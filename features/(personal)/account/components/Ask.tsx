import { LayoutDashboard, Mic, Paperclip, Receipt, Send, Sparkles, Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Facts } from "../lib/analyse";
import { naira, prettyDate } from "../lib/format";
import { localAnswer, type LocalReply } from "../lib/localAnswer";
import type { Txn } from "../lib/types";
import type { PallyAction, Plan } from "../lib/plan";
import { ActionCard, MiniChart, RichText } from "./ui";

interface Msg extends LocalReply {
  /** What the user did with each proposed action card. */
  done?: Record<number, "confirmed" | "dismissed">;
  role: "user" | "assistant";
}

export interface PendingQuestion {
  text: string;
  nonce: number;
}

const STARTERS = [
  "Explain my month in simple words",
  "Where did my money go this month?",
  "Set a limit for betting",
  "Help me save ₦100,000 for rent",
  "Remind me to pay my electricity bill on Friday",
];


interface Props {
  txns: Txn[];
  name: string;
  language: string;
  facts: Facts;
  sheet: unknown;
  plan: Plan;
  onConfirmAction: (a: PallyAction) => void;
  sourceLabel: string;
  pending: PendingQuestion | null;
  busyUpload: boolean;
  onUpload: () => void;
  onDashboard: () => void;
}

export default function Ask({ txns, name, language, facts, sheet, plan, onConfirmAction, sourceLabel, pending, busyUpload, onUpload, onDashboard }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognition = useRef<any>(null);
  const askRef = useRef<(q: string) => void>(() => {});

  // New data starts a fresh conversation.
  useEffect(() => {
    setMsgs([]);
  }, [txns]);
  // Block bodies on purpose: newer Chrome returns a value from scroll calls, which React would treat as a cleanup function.
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, busy]);
  useEffect(() => {
    if (pending) ask(pending.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending?.nonce]);

  async function ask(q: string) {
    if (!q.trim() || busy) return;
    const history = msgs;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setBusy(true);
    let reply: Msg;
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history: history.map(({ role, text }) => ({ role, text })), txns, facts: sheet, name, language, plan }),
      });
      const j = await r.json();
      if (!j.answer) throw new Error(j.error ?? "no answer");
      reply = { role: "assistant", text: j.answer, followups: j.followups, evidence: j.evidence, actions: j.actions, chart: j.chart ?? undefined };
    } catch {
      // AI unavailable: answer from the transactions directly (exact, just less chatty).
      reply = { role: "assistant", ...localAnswer(q, txns, facts, name, plan) };
    }
    setMsgs((m) => [...m, reply]);
    setBusy(false);
  }

  askRef.current = ask;

  // Voice input: the browser's own speech-to-text (Chrome, Edge, Safari). Speak, and the question is sent when you stop.
  function toggleVoice() {
    setVoiceError(null);
    if (listening) {
      recognition.current?.stop();
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SpeechRecognition = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Voice input isn’t supported in this browser. Try Chrome or Edge.");
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-NG";
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText = text;
      }
      setInput(text);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onerror = (e: any) => {
      setVoiceError(
        e.error === "not-allowed" || e.error === "service-not-allowed"
          ? "Allow microphone access in your browser to talk to Pally."
          : e.error === "no-speech"
            ? "I didn’t hear anything. Tap the mic and try again."
            : "Voice input stopped. Please try again.",
      );
    };
    rec.onend = () => {
      setListening(false);
      recognition.current = null;
      if (finalText.trim()) askRef.current(finalText.trim());
    };
    recognition.current = rec;
    setInput("");
    setListening(true);
    rec.start();
  }

  // Reads one of Pally's answers aloud.
  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ""));
    u.lang = "en-NG";
    window.speechSynthesis.speak(u);
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

        {/* Pally starts clean and only analyses when asked. */}
        <div className="flex justify-start">
          <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm leading-relaxed shadow-card">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-pp">
              <Sparkles size={14} /> Pally
            </div>
            Hi {name}, I’m Pally. Ask me anything about your money, by typing or with the mic.
          </div>
        </div>

        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[92%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user" ? "rounded-br-sm bg-pp text-white" : "rounded-bl-sm bg-white shadow-card"
              }`}
            >
              <div className="whitespace-pre-wrap">
                <RichText text={m.text} />
              </div>
              {m.role === "assistant" && (
                <button
                  type="button"
                  onClick={() => speak(m.text)}
                  className="mt-1 flex items-center gap-1 text-xs font-semibold text-pp"
                  aria-label="Read this answer aloud"
                >
                  <Volume2 size={14} /> Listen
                </button>
              )}
              {m.chart && m.chart.rows.length > 1 && <MiniChart title={m.chart.title} rows={m.chart.rows} />}
              {m.actions?.map((a, j) => (
                <ActionCard
                  key={j}
                  action={a}
                  status={m.done?.[j]}
                  onConfirm={() => {
                    onConfirmAction(a);
                    setMsgs((all) => all.map((x, k) => (k === i ? { ...x, done: { ...x.done, [j]: "confirmed" } } : x)));
                  }}
                  onDismiss={() => setMsgs((all) => all.map((x, k) => (k === i ? { ...x, done: { ...x.done, [j]: "dismissed" } } : x)))}
                />
              ))}
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
            {busyUpload ? "Pally is reading your statement…" : "Pally is looking…"}
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
      {voiceError && <p className="sticky bottom-36 rounded-xl bg-bad-soft px-3 py-2 text-xs font-semibold text-bad">{voiceError}</p>}
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
          placeholder={listening ? "Listening… speak now" : "Ask Pally about your money…"}
          className={`min-w-0 flex-1 rounded-full border bg-white px-4 py-3 text-sm shadow-card outline-none focus:border-pp ${listening ? "border-bad" : "border-pp/20"}`}
        />
        <button
          type="button"
          onClick={toggleVoice}
          disabled={busy}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-card disabled:opacity-50 ${
            listening ? "animate-pulse bg-bad text-white" : "bg-white text-pp"
          }`}
          aria-label={listening ? "Stop recording" : "Ask by voice"}
          title={listening ? "Stop recording" : "Ask by voice"}
        >
          {listening ? <Square size={16} /> : <Mic size={18} />}
        </button>
        <button disabled={busy} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pp text-white disabled:opacity-50" aria-label="Send">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
