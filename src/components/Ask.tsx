import { LayoutDashboard, Paperclip, Receipt, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Facts } from "../lib/analyse";
import { naira, prettyDate } from "../lib/format";
import { localAnswer, type LocalReply } from "../lib/localAnswer";
import type { Insight, Txn } from "../lib/types";

interface Msg extends LocalReply {
  role: "user" | "assistant";
}

export interface PendingQuestion {
  text: string;
  nonce: number;
}

const STARTERS = [
  "Explain my month in simple words",
  "Where did my money go this month?",
  "Who do I send the most money to?",
  "What should I cut first?",
  "Tell me about my loans",
];

const TONE: Record<Insight["severity"], string> = {
  alert: "border-bad/30 bg-bad-soft text-bad",
  warn: "border-warn/30 bg-warn-soft text-warn",
  tip: "border-tip/30 bg-tip-soft text-tip",
  good: "border-ok/30 bg-ok-soft text-ok",
};

interface Props {
  txns: Txn[];
  name: string;
  language: string;
  facts: Facts;
  sheet: unknown;
  insights: Insight[];
  overview: string;
  sourceLabel: string;
  pending: PendingQuestion | null;
  busyUpload: boolean;
  onUpload: () => void;
  onDashboard: () => void;
}

export default function Ask({ txns, name, language, facts, sheet, insights, overview, sourceLabel, pending, busyUpload, onUpload, onDashboard }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  // New data starts a fresh conversation.
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
        body: JSON.stringify({ question: q, history: history.map(({ role, text }) => ({ role, text })), txns, facts: sheet, name, language }),
      });
      const j = await r.json();
      if (!j.answer) throw new Error(j.error ?? "no answer");
      reply = { role: "assistant", text: j.answer, followups: j.followups, evidence: j.evidence };
    } catch {
      // AI unavailable: answer from the transactions directly (exact, just less chatty).
      reply = { role: "assistant", ...localAnswer(q, txns, facts, name) };
    }
    setMsgs((m) => [...m, reply]);
    setBusy(false);
  }

  const lastFollowups = [...msgs].reverse().find((m) => m.role === "assistant")?.followups ?? (msgs.length ? [] : STARTERS);
  const first = txns[0]?.date.slice(0, 10);
  const lastDay = txns[txns.length - 1]?.date.slice(0, 10);
  const fmt = (d?: string) => (d ? new Date(d + "T12:00:00").toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "");

  return (
    <div className="flex min-h-[70vh] flex-col">
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-xs text-muted shadow-card">
          <span>
            Reading <b className="text-pp-ink">{sourceLabel}</b> · {txns.length} transactions · {fmt(first)} to {fmt(lastDay)}
          </span>
          <button onClick={onDashboard} className="flex items-center gap-1 font-bold text-pp">
            <LayoutDashboard size={14} /> Dashboard
          </button>
        </div>

        {/* The overview opens the conversation, with the top insights attached. */}
        <div className="flex justify-start">
          <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm leading-relaxed shadow-card">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-pp">
              <Sparkles size={14} /> PalmPay AI
            </div>
            <div className="whitespace-pre-line">{overview}</div>
            {insights.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-xs font-semibold text-muted">I noticed {insights.length} things. Tap one to ask about it:</div>
                {insights.slice(0, 4).map((i) => (
                  <button
                    key={i.id}
                    onClick={() => ask(`Tell me more about this: "${i.title}". Why is it happening and what should I do?`)}
                    className={`block w-full rounded-xl border px-3 py-2 text-left text-xs font-semibold ${TONE[i.severity]}`}
                  >
                    {i.title} →
                  </button>
                ))}
              </div>
            )}
            <div className="mt-3 text-xs text-muted">Ask me anything about your transactions. I'll show you the payments behind every answer.</div>
          </div>
        </div>

        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[92%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
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
        {(busy || busyUpload) && (
          <div className="w-40 animate-pulse rounded-2xl bg-white px-4 py-2.5 text-sm text-muted shadow-card">
            {busyUpload ? "Reading statement…" : "Looking…"}
          </div>
        )}

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
        <button
          type="button"
          onClick={onUpload}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-pp shadow-card"
          aria-label="Upload a statement"
          title="Upload a PalmPay statement (PDF, Excel or CSV)"
        >
          <Paperclip size={18} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your money…"
          className="min-w-0 flex-1 rounded-full border border-pp/20 bg-white px-4 py-3 text-sm shadow-card outline-none focus:border-pp"
        />
        <button disabled={busy} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pp text-white disabled:opacity-50" aria-label="Send">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
