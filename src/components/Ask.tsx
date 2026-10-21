import { Receipt, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { naira, prettyDate } from "../lib/format";
import { runTool } from "../lib/tools";
import type { Txn } from "../lib/types";

interface Evidence {
  date: string;
  description: string;
  amount: number;
  direction: "in" | "out";
}

interface Msg {
  role: "user" | "assistant";
  text: string;
  followups?: string[];
  evidence?: Evidence[];
}

export interface PendingQuestion {
  text: string;
  nonce: number;
}

const STARTERS = [
  "Explain my month in simple words",
  "Why is my balance so low?",
  "What should I cut first?",
  "What if I cut betting by half?",
];

const CATS: [RegExp, string][] = [
  [/bet/, "Betting"], [/data|airtime/, "Airtime & Data"], [/food|eat|grocer/, "Food & Groceries"], [/transport|bolt|uber|ride/, "Transport"],
  [/subscri|netflix|dstv|showmax/, "Subscriptions"], [/fee|charge/, "Fees & Charges"], [/pos|cash/, "Cash Withdrawal"], [/rent/, "Rent"],
  [/shop|jumia/, "Shopping"], [/family|mum|mama|friend/, "Family & Friends"], [/supplier|stock|business/, "Business & Suppliers"],
];

// Used only when the AI can't be reached, so the demo never dead-ends. Still exact: it runs the same tools.
function offlineAnswer(q: string, txns: Txn[]): Msg {
  const s = q.toLowerCase();
  const hit = CATS.find(([re]) => re.test(s));
  if (hit) {
    const cat = hit[1];
    const end = txns[txns.length - 1]?.date.slice(0, 10) ?? "";
    const from = new Date(new Date(end).getTime() - 30 * 86_400_000).toISOString().slice(0, 10);
    const r = runTool("sum_transactions", { category: cat, direction: "out", from }, txns) as { total: number; count: number };
    const ev = runTool("list_transactions", { category: cat, direction: "out", from, limit: 5 }, txns) as Evidence[];
    const half = runTool("what_if", { category: cat, cut_percent: 50 }, txns) as { saved_per_month: number; saved_per_year: number };
    return {
      role: "assistant",
      text: `In the last 30 days you spent ${naira(r.total)} on ${cat} across ${r.count} payments. Cutting it by half would save about ${naira(half.saved_per_month)} a month (${naira(half.saved_per_year)} a year).`,
      evidence: ev,
      followups: [`Set a limit for ${cat}`, "What else can I cut?", "Explain my month in simple words"],
    };
  }
  const b = runTool("breakdown", { by: "category", direction: "out" }, txns) as { key: string; total: number }[];
  return {
    role: "assistant",
    text: `Your biggest spending areas are ${b.slice(0, 3).map((x) => `${x.key} (${naira(x.total)})`).join(", ")}. Tap one below to dig in.`,
    followups: b.slice(0, 3).map((x) => `Show me my ${x.key} spending`),
  };
}

interface Props {
  txns: Txn[];
  name: string;
  language: string;
  facts: unknown;
  overview: string;
  pending: PendingQuestion | null;
}

export default function Ask({ txns, name, language, facts, overview, pending }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  // A new account starts a fresh conversation.
  useEffect(() => setMsgs([]), [txns]);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth", block: "end" }), [msgs, busy]);
  useEffect(() => {
    if (pending) ask(pending.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending?.nonce]);

  async function ask(q: string) {
    if (!q.trim() || busy) return;
    const history = [{ role: "assistant" as const, text: overview }, ...msgs];
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setBusy(true);
    let reply: Msg;
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history: history.map(({ role, text }) => ({ role, text })), txns, facts, name, language }),
      });
      const j = await r.json();
      reply = j.answer ? { role: "assistant", text: j.answer, followups: j.followups, evidence: j.evidence } : offlineAnswer(q, txns);
    } catch {
      reply = offlineAnswer(q, txns);
    }
    setMsgs((m) => [...m, reply]);
    setBusy(false);
  }

  const lastFollowups = [...msgs].reverse().find((m) => m.role === "assistant")?.followups ?? (msgs.length ? [] : STARTERS);

  return (
    <div className="flex min-h-[60vh] flex-col">
      <div className="flex-1 space-y-3">
        {/* The monthly overview opens the conversation. */}
        <div className="flex justify-start">
          <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm leading-relaxed shadow-card">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-pp">
              <Sparkles size={14} /> Your month so far
            </div>
            <div className="whitespace-pre-line">{overview}</div>
            <div className="mt-2 text-xs text-muted">Ask me anything about it. I'll show you the transactions behind every answer.</div>
          </div>
        </div>

        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user" ? "rounded-br-sm bg-pp text-white" : "rounded-bl-sm bg-white shadow-card"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
              {m.evidence && m.evidence.length > 0 && (
                <div className="mt-2 rounded-xl bg-pp-soft/60 p-2">
                  <div className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-pp">
                    <Receipt size={12} /> Based on these transactions
                  </div>
                  {m.evidence.map((e, j) => (
                    <div key={j} className="flex justify-between gap-2 py-0.5 text-xs">
                      <span className="truncate">
                        <span className="text-muted">{prettyDate(e.date)} · </span>
                        {e.description}
                      </span>
                      <span className={`shrink-0 font-semibold ${e.direction === "in" ? "text-ok" : ""}`}>
                        {e.direction === "in" ? "+" : "−"}
                        {naira(e.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && <div className="w-28 animate-pulse rounded-2xl bg-white px-4 py-2.5 text-sm text-muted shadow-card">Looking…</div>}

        {!busy && lastFollowups.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {lastFollowups.map((s) => (
              <button key={s} onClick={() => ask(s)} className="chip border border-pp/20 bg-white text-left text-pp hover:bg-pp hover:text-white">
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={end} className="h-16" />
      </div>
      <form
        className="sticky bottom-20 mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your money…"
          className="flex-1 rounded-full border border-pp/20 bg-white px-4 py-3 text-sm shadow-card outline-none focus:border-pp"
        />
        <button disabled={busy} className="flex h-12 w-12 items-center justify-center rounded-full bg-pp text-white disabled:opacity-50" aria-label="Send">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
