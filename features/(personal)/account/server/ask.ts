import { ACTION_TOOLS, isActionTool, limitProgress, toAction, type PallyAction, type Plan } from "../lib/plan";
import { runTool, TOOLS } from "../lib/tools";
import type { Txn } from "../lib/types";
import { client, MODEL, textOf, type Req, type Res } from "./_claude";

const MAX_ROUNDS = 6;

// Pally: Claude answers questions about the user's transactions by calling tools that do exact maths.
// Pally can also propose actions (limits, savings goals, reminders) that the user confirms in the app.
// Returns the answer, the transactions it looked at (as receipts), a chart, proposed actions and follow-up questions.
export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { question, history = [], txns = [], facts, name, language, plan } = req.body ?? {};
  if (!question) return res.status(400).json({ error: "Missing question" });
  const rows = txns as Txn[];
  const today = rows[rows.length - 1]?.date.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
  const evidence: unknown[] = [];
  const actions: PallyAction[] = [];
  let chart: { title: string; rows: { label: string; value: number }[] } | null = null;
  const current: Plan = plan && Array.isArray(plan.limits) ? plan : { limits: [], goals: [], reminders: [] };
  const planContext = {
    spending_limits: limitProgress(current, rows),
    savings_goals: current.goals,
    reminders: current.reminders,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any[] = [
    ...(history as { role: "user" | "assistant"; text: string }[]).slice(-10).map((m) => ({ role: m.role, content: m.text })),
    { role: "user", content: question },
  ];
  while (messages.length && messages[0].role !== "user") messages.shift();

  try {
    for (let round = 0; round < MAX_ROUNDS; round++) {
      const response = await client().messages.create({
        model: MODEL,
        max_tokens: 2000,
        system: `You are Pally, a friendly money assistant inside the PalmPay app in Nigeria, talking to ${name ?? "the user"}.
Your job is to help them understand what is going on with their money and what to do about it, and to help them act on it.
You can also chat about general money topics and explain PalmPay features (transfers, CashBox savings, bill payments, airtime, loans, cards, security), even when no statement is involved.
Today is ${today}. Their history runs from ${rows[0]?.date.slice(0, 10) ?? "?"} to ${today}.
Here is their monthly overview, already computed exactly (use it for context, quote it freely):
${JSON.stringify(facts ?? {})}
Their current plan with you (limits show this month's spending so far):
${JSON.stringify(planContext)}
Rules:
- When the user wants to limit spending, save towards something, or be reminded, call set_spending_limit, create_savings_goal or set_reminder. These only PROPOSE: the user sees a card with Confirm. Say so briefly ("Tap Confirm to set it."). Suggest sensible amounts based on their real spending.
- For any number not in the overview, use the tools. Never guess or do arithmetic yourself; use what_if for savings maths.
- When explaining a spike or an insight, look up the actual transactions behind it (list_transactions) and name the biggest ones.
- "Spending" means direction "out". Answer in 2-5 short sentences of plain text (no markdown, headings or bullet symbols; use **bold** at most once for the key number), amounts like ₦12,500. Give one practical next step, mentioning a PalmPay feature (CashBox, QR pay, spending limits, bill payments, account freeze) when it genuinely fits.
- End with a final line exactly in this form: FOLLOWUPS: question one | question two | question three
  (three short follow-up questions the user might tap next, written in the user's voice).
${language === "pidgin" ? "Reply in friendly Nigerian Pidgin English (follow-ups too)." : "Reply in simple, plain English."}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tools: [...TOOLS, ...ACTION_TOOLS] as any,
        messages,
      });
      messages.push({ role: "assistant", content: response.content });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const calls = response.content.filter((b: any) => b.type === "tool_use") as any[];
      if (response.stop_reason !== "tool_use" || !calls.length) {
        const full = textOf(response.content);
        const m = full.match(/\n?FOLLOWUPS:\s*(.+)\s*$/i);
        const followups = m ? m[1].split("|").map((s) => s.trim()).filter(Boolean).slice(0, 3) : [];
        const answer = m ? full.slice(0, m.index).trim() : full;
        return res.status(200).json({ answer, followups, evidence: evidence.slice(0, 6), actions, chart });
      }
      messages.push({
        role: "user",
        content: calls.map((c) => {
          if (isActionTool(c.name)) {
            const action = toAction(c.name, c.input ?? {});
            if (action) actions.push(action);
            return {
              type: "tool_result",
              tool_use_id: c.id,
              content: action ? "Shown to the user as a card. It is saved only if they tap Confirm." : "Invalid input; nothing was proposed.",
              is_error: !action,
            };
          }
          const result = runTool(c.name, c.input ?? {}, rows);
          if (c.name === "list_transactions" && Array.isArray(result)) evidence.push(...result);
          if (c.name === "breakdown" && Array.isArray(result) && result.length > 1) {
            const by = String(c.input?.by ?? "category");
            chart = {
              title: `By ${by === "counterparty" ? "person / merchant" : by}`,
              rows: (result as { key: string; total: number }[]).slice(0, 6).map((r) => ({ label: r.key, value: Math.round(r.total) })),
            };
          }
          return { type: "tool_result", tool_use_id: c.id, content: JSON.stringify(result) };
        }),
      });
    }
    return res.status(200).json({ answer: "Sorry, that one took too long. Try asking it a simpler way.", followups: [], evidence: [], actions, chart });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}
