import {
  AlertTriangle, CheckCircle2, Dice5, Hourglass, PiggyBank, Receipt, Repeat, ShieldAlert, TrendingUp, Users, Lightbulb,
} from "lucide-react";
import { naira, nairaShort } from "../lib/format";
import type { PallyAction } from "../lib/plan";
import type { Insight, Severity } from "../lib/types";

const ICONS: Record<string, typeof AlertTriangle> = {
  shield: ShieldAlert, hourglass: Hourglass, trending: TrendingUp, dice: Dice5, repeat: Repeat, receipt: Receipt,
  users: Users, piggy: PiggyBank, check: CheckCircle2,
};

const TONE: Record<Severity, { bg: string; fg: string; label: string }> = {
  alert: { bg: "bg-bad-soft", fg: "text-bad", label: "Needs attention" },
  warn: { bg: "bg-warn-soft", fg: "text-warn", label: "Heads up" },
  tip: { bg: "bg-tip-soft", fg: "text-tip", label: "Tip" },
  good: { bg: "bg-ok-soft", fg: "text-ok", label: "Well done" },
};

export function InsightCard({ insight, onAction, onAsk }: { insight: Insight; onAction?: (i: Insight) => void; onAsk?: (q: string) => void }) {
  const Icon = ICONS[insight.icon] ?? Lightbulb;
  const tone = TONE[insight.severity];
  return (
    <div className="card p-4">
      <div className="flex gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.bg} ${tone.fg}`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className={`text-[11px] font-bold uppercase tracking-wide ${tone.fg}`}>{tone.label}</div>
          <div className="mt-0.5 font-bold leading-snug">{insight.title}</div>
          <p className="mt-1 text-sm leading-relaxed text-muted">{insight.body}</p>
          {insight.action && (
            <button
              onClick={() => onAction?.(insight)}
              className="mt-3 rounded-full bg-pp-soft px-3 py-1.5 text-sm font-semibold text-pp hover:bg-pp hover:text-white"
            >
              {insight.action} →
            </button>
          )}
          {onAsk && (
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                ["💬 Why?", `Why is this happening: "${insight.title}"? Show me the transactions behind it.`],
                ["What should I do?", `What should I do about this: "${insight.title}"?`],
              ].map(([label, q]) => (
                <button key={label} onClick={() => onAsk(q)} className="rounded-full border border-pp/20 px-3 py-1 text-xs font-semibold text-pp hover:bg-pp-soft">
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Shows **bold** from AI replies as bold text instead of raw asterisks. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        /^\*\*[^*]+\*\*$/.test(part) ? <b key={i}>{part.slice(2, -2)}</b> : part,
      )}
    </>
  );
}

export function ScoreRing({ score, onLight = false }: { score: number; onLight?: boolean }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const color = score >= 70 ? "#16A34A" : score >= 45 ? "#F59E0B" : "#F87171";
  return (
    <svg width="76" height="76" viewBox="0 0 76 76" role="img" aria-label={`Money health score ${score} out of 100`}>
      <circle cx="38" cy="38" r={r} stroke={onLight ? "#F1EAFD" : "rgba(255,255,255,.25)"} strokeWidth="7" fill="none" />
      <circle
        cx="38" cy="38" r={r} stroke={color} strokeWidth="7" fill="none" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} transform="rotate(-90 38 38)"
      />
      <text x="38" y="43" textAnchor="middle" fontSize="20" fontWeight="800" fill={onLight ? "#1E1530" : "white"}>{score}</text>
    </svg>
  );
}

export function Section({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="mt-6">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-base font-extrabold">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

/** A small bar chart inside a Pally answer. */
export function MiniChart({ title, rows }: { title: string; rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="mt-2 rounded-xl border border-pp/10 bg-white p-2.5">
      <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-pp">{title}</div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="text-xs">
            <div className="flex justify-between gap-2">
              <span className="truncate">{r.label}</span>
              <span className="shrink-0 font-semibold">{nairaShort(r.value)}</span>
            </div>
            <div className="mt-0.5 h-1.5 rounded-full bg-pp-soft">
              <div className="h-full rounded-full bg-pp" style={{ width: `${(r.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const fmtDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short" });

/** An action Pally proposes; nothing happens until the user confirms. */
export function ActionCard({
  action,
  status,
  onConfirm,
  onDismiss,
}: {
  action: PallyAction;
  status?: "confirmed" | "dismissed";
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  const [icon, title, detail] =
    action.type === "set_spending_limit"
      ? ["🎯", `Monthly limit: ${action.category}`, `${naira(action.amount)} a month. I’ll track it and warn you as you get close.`]
      : action.type === "create_savings_goal"
        ? ["🐷", `Savings goal: ${action.name}`, `Target ${naira(action.target)}${action.monthly ? `, saving ${naira(action.monthly)} a month in CashBox` : ""}${action.by ? ` by ${fmtDate(action.by)}` : ""}.`]
        : ["⏰", "Reminder", `${action.message}, on ${fmtDate(action.date)}.`];
  return (
    <div className="mt-2 rounded-xl border-2 border-pp/20 bg-pp-soft/50 p-3">
      <div className="flex items-start gap-2">
        <span className="text-lg leading-none">{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold">{title}</div>
          <div className="text-xs text-muted">{detail}</div>
        </div>
      </div>
      {status === "confirmed" ? (
        <div className="mt-2 text-xs font-bold text-ok">✓ Done. You can see it on your Dashboard.</div>
      ) : status === "dismissed" ? (
        <div className="mt-2 text-xs font-semibold text-muted">Not set.</div>
      ) : (
        <div className="mt-2 flex gap-2">
          <button onClick={onConfirm} className="chip bg-pp text-xs text-white">
            Confirm
          </button>
          <button onClick={onDismiss} className="chip bg-white text-xs text-muted">
            Not now
          </button>
        </div>
      )}
    </div>
  );
}
