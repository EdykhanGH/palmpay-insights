import {
  Bell, Building2, ChevronRight, CircleDollarSign, Eye, EyeOff, Gift, Grid3x3, HandCoins, Lightbulb, Phone, PiggyBank, Plus,
  Send, Sparkles, Trophy, Tv, Wallet, Wifi,
} from "lucide-react";
import { useState } from "react";
import { ScoreRing } from "../components/ui";
import type { Facts } from "../lib/analyse";
import { naira, prettyDate } from "../lib/format";
import type { Insight, Txn } from "../lib/types";

interface Props {
  firstName: string;
  facts: Facts;
  insights: Insight[];
  txns: Txn[];
  onOpenInsights: () => void;
  onAsk: (q: string) => void;
  onSeeAll: () => void;
  onDemo: (label: string) => void;
}

const SERVICES = [
  { label: "Airtime", icon: Phone, color: "text-tip bg-tip-soft" },
  { label: "Data", icon: Wifi, color: "text-ok bg-ok-soft" },
  { label: "Betting", icon: Trophy, color: "text-warn bg-warn-soft" },
  { label: "Electricity", icon: Lightbulb, color: "text-warn bg-warn-soft" },
  { label: "TV", icon: Tv, color: "text-bad bg-bad-soft" },
  { label: "CashBox", icon: PiggyBank, color: "text-pp bg-pp-soft" },
  { label: "Loan", icon: HandCoins, color: "text-tip bg-tip-soft" },
  { label: "More", icon: Grid3x3, color: "text-muted bg-gray-100" },
];

export default function Home({ firstName, facts, insights, txns, onOpenInsights, onAsk, onSeeAll, onDemo }: Props) {
  const [hidden, setHidden] = useState(false);
  const top = insights[0];
  const alerts = insights.filter((i) => i.severity === "alert").length;

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pp text-lg font-extrabold text-white">{firstName[0]}</div>
          <div>
            <div className="text-xs text-muted">Good day 👋</div>
            <div className="font-extrabold">Hi, {firstName}</div>
          </div>
        </div>
        <button onClick={onOpenInsights} className="relative rounded-full bg-white p-2.5 shadow-card" aria-label="Notifications">
          <Bell size={20} />
          {alerts > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-bad text-[10px] font-bold text-white">
              {alerts}
            </span>
          )}
        </button>
      </div>

      {/* Balance card */}
      <div className="mx-4 mt-4 rounded-3xl bg-gradient-to-br from-pp to-pp-dark p-5 text-white shadow-card">
        <div className="flex items-center justify-between text-sm opacity-90">
          <button onClick={() => setHidden(!hidden)} className="flex items-center gap-1.5">
            Available Balance {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button onClick={onSeeAll} className="flex items-center text-xs font-semibold">
            Transaction History <ChevronRight size={14} />
          </button>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div className="text-3xl font-extrabold tracking-tight">{hidden ? "₦ ****" : naira(facts.balance)}</div>
          <button onClick={() => onDemo("Add Money")} className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-pp">
            <Plus size={16} /> Add Money
          </button>
        </div>
      </div>

      {/* Main actions */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "To PalmPay", icon: Send },
          { label: "To Bank", icon: Building2 },
          { label: "Withdraw", icon: Wallet },
        ].map((a) => (
          <button key={a.label} onClick={() => onDemo(a.label)} className="card flex flex-col items-center gap-1.5 py-3 text-sm font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pp-soft text-pp">
              <a.icon size={20} />
            </span>
            {a.label}
          </button>
        ))}
      </div>

      {/* PalmPay Insights with Pally: the feature */}
      <div className="mx-4 mt-4 overflow-hidden rounded-3xl border-2 border-pp/20 bg-white shadow-card">
        <div className="flex items-center justify-between bg-pp-soft px-4 py-2">
          <div className="flex items-center gap-1.5 text-sm font-extrabold text-pp">
            <Sparkles size={16} /> Ask Pally · PalmPay Insights
          </div>
          <span className="rounded-full bg-pp px-2 py-0.5 text-[10px] font-bold text-white">NEW</span>
        </div>
        <button onClick={onOpenInsights} className="flex w-full items-center gap-3 p-4 text-left">
          <ScoreRing score={facts.score} onLight />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-muted">Money health score</div>
            {top ? (
              <>
                <div className="mt-0.5 font-bold leading-snug">{top.title}</div>
                <div className="mt-1 text-xs text-muted">
                  {insights.length} insights for you{alerts ? ` · ${alerts} need${alerts === 1 ? "s" : ""} attention` : ""}
                </div>
              </>
            ) : (
              <div className="mt-0.5 font-bold">Your money looks healthy this month</div>
            )}
          </div>
          <ChevronRight className="shrink-0 text-pp" />
        </button>
        <div className="flex gap-2 overflow-x-auto px-4 pb-4">
          {["Explain my month", "Where did my money go?", "How can I save more?"].map((q) => (
            <button key={q} onClick={() => onAsk(q)} className="chip whitespace-nowrap bg-pp-soft text-xs text-pp">
              💬 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="card mx-4 mt-4 grid grid-cols-4 gap-y-4 p-4">
        {SERVICES.map((s) => (
          <button key={s.label} onClick={() => onDemo(s.label)} className="flex flex-col items-center gap-1.5 text-xs font-semibold">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${s.color}`}>
              <s.icon size={20} />
            </span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Promo */}
      <button onClick={() => onDemo("Refer & Earn")} className="mx-4 mt-4 flex w-[calc(100%-2rem)] items-center gap-3 rounded-2xl bg-gradient-to-r from-warn to-bad p-4 text-left text-white">
        <Gift />
        <div className="flex-1">
          <div className="font-bold">Refer & earn up to ₦5,000</div>
          <div className="text-xs opacity-90">Invite friends to PalmPay</div>
        </div>
        <CircleDollarSign />
      </button>

      {/* Recent transactions */}
      <div className="mx-4 mt-5 flex items-center justify-between">
        <h2 className="font-extrabold">Recent transactions</h2>
        <button onClick={onSeeAll} className="text-sm font-semibold text-pp">See all</button>
      </div>
      <div className="card mx-4 mt-2 divide-y divide-pp-soft">
        {[...txns].reverse().slice(0, 5).map((x) => (
          <div key={x.id} className="flex items-center justify-between gap-3 p-3 text-sm">
            <div className="min-w-0">
              <div className="truncate font-semibold">{x.description}</div>
              <div className="text-xs text-muted">{prettyDate(x.date)}</div>
            </div>
            <div className={`shrink-0 font-bold ${x.direction === "in" ? "text-ok" : ""}`}>
              {x.direction === "in" ? "+" : "−"}
              {naira(x.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
