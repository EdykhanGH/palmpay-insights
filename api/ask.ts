import { runTool, TOOLS } from "../src/lib/tools.js";
import type { Txn } from "../src/lib/types.js";
import { client, MODEL, textOf, type Req, type Res } from "./_claude.js";

const MAX_ROUNDS = 6;

// "Ask PalmPay": Claude answers questions about the user's transactions by calling tools that do exact maths.
// Returns the answer, the transactions it looked at (as receipts) and follow-up questions.
export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { question, history = [], txns = [], facts, name, language } = req.body ?? {};
  if (!question) return res.status(400).json({ error: "Missing question" });
  const rows = txns as Txn[];
  const today = rows[rows.length - 1]?.date.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
  const evidence: unknown[] = [];

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
        system: `You are "Ask PalmPay", a friendly money assistant inside the PalmPay app in Nigeria, talking to ${name ?? "the user"}.
Your job is to help them understand what is going on with their money and what to do about it.
Today is ${today}. Their history runs from ${rows[0]?.date.slice(0, 10) ?? "?"} to ${today}.
Here is their monthly overview, already computed exactly (use it for context, quote it freely):
${JSON.stringify(facts ?? {})}
Rules:
- For any number not in the overview, use the tools. Never guess or do arithmetic yourself; use what_if for savings maths.
- When explaining a spike or an insight, look up the actual transactions behind it (list_transactions) and name the biggest ones.
- "Spending" means direction "out". Answer in 2-5 short sentences, amounts like ₦12,500. Give one practical next step, mentioning a PalmPay feature (CashBox, QR pay, spending limits, bill payments, account freeze) when it genuinely fits.
- End with a final line exactly in this form: FOLLOWUPS: question one | question two | question three
  (three short follow-up questions the user might tap next, written in the user's voice).
${language === "pidgin" ? "Reply in friendly Nigerian Pidgin English (follow-ups too)." : "Reply in simple, plain English."}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tools: TOOLS as any,
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
        return res.status(200).json({ answer, followups, evidence: evidence.slice(0, 6) });
      }
      messages.push({
        role: "user",
        content: calls.map((c) => {
          const result = runTool(c.name, c.input ?? {}, rows);
          if (c.name === "list_transactions" && Array.isArray(result)) evidence.push(...result);
          return { type: "tool_result", tool_use_id: c.id, content: JSON.stringify(result) };
        }),
      });
    }
    return res.status(200).json({ answer: "Sorry, that one took too long. Try asking it a simpler way.", followups: [], evidence: [] });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}
