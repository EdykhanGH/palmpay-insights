import { ArrowLeft, ChevronRight, Home as HomeIcon, LayoutDashboard, Languages, List, LogOut, Shield, Sparkles, Upload, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Ask, { type PendingQuestion } from "./components/Ask";
import { CategoryBars, MonthlyBars } from "./components/Charts";
import { InsightCard, ScoreRing, Section } from "./components/ui";
import { accountFor, maskPhone, saveSession, savedSession } from "./lib/accounts";
import { buildInsights, computeFacts, factSheet, perMonth } from "./lib/analyse";
import { monthName, naira, prettyDate } from "./lib/format";
import { overviewText } from "./lib/localAnswer";
import { openingBalance, seedTransactions } from "./lib/seed";
import { readStatement } from "./lib/statement";
import type { Insight, Txn } from "./lib/types";
import Home from "./screens/Home";
import Login from "./screens/Login";

// "ask" is the Insights chat (the main feature); "insights" is the dashboard of cards and charts behind it.
type Tab = "home" | "insights" | "ask" | "history" | "me";

export default function App() {
  const [user, setUser] = useState<string | null>(() => {
    const s = savedSession();
    return s && accountFor(s) ? s : null;
  });
  if (!user)
    return (
      <Login
        onLogin={(id) => {
          saveSession(id);
          setUser(id);
        }}
      />
    );
  return (
    <Main
      key={user}
      personaId={user}
      onLogout={() => {
        saveSession(null);
        setUser(null);
      }}
    />
  );
}

function Main({ personaId, onLogout }: { personaId: string; onLogout: () => void }) {
  const account = accountFor(personaId)!;
  const firstName = account.fullName.split(" ")[0];
  const [uploaded, setUploaded] = useState<{ name: string; txns: Txn[] } | null>(null);
  const [useUpload, setUseUpload] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [language, setLanguage] = useState<"english" | "pidgin">("english");
  const [note, setNote] = useState<string | null>(null);
  const [noteLoading, setNoteLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingQuestion | null>(null);
  const [busyUpload, setBusyUpload] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fromUpload = useUpload && !!uploaded;
  const txns = useMemo(() => (fromUpload ? uploaded!.txns : seedTransactions(personaId)), [fromUpload, uploaded, personaId]);
  const facts = useMemo(() => computeFacts(txns, fromUpload ? undefined : openingBalance(personaId)), [txns, fromUpload, personaId]);
  const accountFacts = useMemo(() => computeFacts(seedTransactions(personaId), openingBalance(personaId)), [personaId]);
  const insights = useMemo(() => buildInsights(facts), [facts]);
  const sheet = useMemo(() => factSheet(facts, insights), [facts, insights]);

  // AI coach note, written from the exact fact sheet.
  useEffect(() => {
    let cancelled = false;
    setNote(null);
    setNoteLoading(true);
    fetch("/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ facts: sheet, name: firstName, language }),
    })
      .then((r) => r.json())
      .then((j) => !cancelled && setNote(j.note ?? null))
      .catch(() => !cancelled && setNote(null))
      .finally(() => !cancelled && setNoteLoading(false));
    return () => {
      cancelled = true;
    };
  }, [sheet, firstName, language]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tab]);

  async function onFile(f: File | undefined) {
    if (!f) return;
    setUploadError(null);
    setBusyUpload(true);
    setTab("ask");
    try {
      const t = await readStatement(f);
      setUploaded({ name: f.name, txns: t });
      setUseUpload(true);
    } catch (e) {
      setUploadError((e as Error).message);
      showToast((e as Error).message);
    } finally {
      setBusyUpload(false);
    }
  }

  function askAbout(text: string) {
    setPending({ text, nonce: Date.now() });
    setTab("ask");
  }

  function showToast(text: string) {
    setToast(text);
    setTimeout(() => setToast(null), 2500);
  }

  const onAction = (i: Insight) => showToast(`"${i.action}" would open here in the PalmPay app.`);

  const fallbackNote = overviewText(facts, fromUpload ? "there" : firstName);

  const subHeader = (title: string, back: Tab = "home") => (
    <div className="sticky top-0 z-10 flex items-center gap-3 bg-[#f6f3fb]/95 px-4 py-4 backdrop-blur">
      <button onClick={() => setTab(back)} className="rounded-full bg-white p-2 shadow-card" aria-label="Back">
        <ArrowLeft size={18} />
      </button>
      <h1 className="text-lg font-extrabold">{title}</h1>
    </div>
  );

  return (
    <div className="mx-auto min-h-screen max-w-md pb-28">
      {tab === "home" && (
        <Home
          firstName={firstName}
          facts={{ ...facts, balance: accountFacts.balance }}
          insights={insights}
          txns={seedTransactions(personaId)}
          onOpenInsights={() => setTab("ask")}
          onAsk={askAbout}
          onSeeAll={() => setTab("history")}
          onDemo={(label) => showToast(`${label} isn't part of this demo. Try PalmPay Insights ✨`)}
        />
      )}

      {tab === "insights" && (
        <>
          <header className="rounded-b-[28px] bg-gradient-to-br from-pp to-pp-dark px-4 pb-6 pt-4 text-white">
            <div className="flex items-center justify-between">
              <button onClick={() => setTab("ask")} className="rounded-full bg-white/15 p-2" aria-label="Back to chat">
                <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-1.5 font-extrabold">
                <LayoutDashboard size={18} /> Insights dashboard
              </div>
              <button onClick={() => setLanguage(language === "english" ? "pidgin" : "english")} className="chip bg-white/15 text-xs text-white">
                {language === "english" ? "English" : "Pidgin"} ⇄
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <div className="text-sm opacity-80">{monthName(facts.month)} so far</div>
                <div className="mt-1 text-sm">
                  In <span className="font-extrabold">{naira(facts.thisMonth.income)}</span>
                </div>
                <div className="text-sm">
                  Out <span className="font-extrabold">{naira(facts.thisMonth.spend)}</span>
                </div>
                {facts.balanceKnown && (
                  <div className="text-sm">
                    Balance <span className="font-extrabold">{naira(facts.balance)}</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <ScoreRing score={facts.score} />
                <div className="text-[11px] font-semibold opacity-90">Money health</div>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto">
              {uploaded && (
                <button onClick={() => setUseUpload(!useUpload)} className="chip whitespace-nowrap bg-white text-xs text-pp">
                  {useUpload ? "Showing: my statement ⇄ PalmPay history" : "Showing: PalmPay history ⇄ my statement"}
                </button>
              )}
              <button onClick={() => fileRef.current?.click()} className="chip flex items-center gap-1 whitespace-nowrap bg-white/15 text-xs text-white">
                <Upload size={14} /> Analyse a PalmPay statement (PDF)
              </button>
            </div>
            {uploadError && <div className="mt-2 rounded-lg bg-white/15 p-2 text-sm">{uploadError}</div>}
          </header>

          <main className="px-4">
            <div className="card mt-4 border border-pp/10 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-pp">
                <Sparkles size={16} /> Your money coach
              </div>
              {noteLoading ? (
                <div className="mt-2 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-pp-soft" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-pp-soft" />
                  <div className="h-3 w-4/6 animate-pulse rounded bg-pp-soft" />
                </div>
              ) : (
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{note ?? fallbackNote}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {["Explain my month in simple words", "What should I cut first?"].map((q) => (
                  <button key={q} onClick={() => askAbout(q)} className="chip bg-pp-soft text-xs text-pp hover:bg-pp hover:text-white">
                    💬 {q}
                  </button>
                ))}
                <button onClick={() => setTab("ask")} className="chip bg-pp text-xs text-white">
                  Chat with your coach →
                </button>
              </div>
            </div>

            <Section title="Insights for you" right={<span className="text-xs text-muted">{insights.length} found</span>}>
              <div className="space-y-3">
                {insights.map((i) => (
                  <InsightCard key={i.id} insight={i} onAction={onAction} onAsk={askAbout} />
                ))}
              </div>
            </Section>

            <Section title={`Where your money went in ${monthName(facts.month)}`}>
              <CategoryBars facts={facts} onAsk={askAbout} />
            </Section>

            <Section title="Month by month">
              <MonthlyBars facts={facts} />
            </Section>

            {facts.recurring.length > 0 && (
              <Section title="Regular payments we found">
                <div className="card divide-y divide-pp-soft">
                  {facts.recurring.slice(0, 8).map((r) => (
                    <div key={r.counterparty} className="flex items-center justify-between p-3 text-sm">
                      <div>
                        <div className="font-semibold">{r.counterparty}</div>
                        <div className="text-xs text-muted">
                          {r.category} · every {r.everyDays >= 25 && r.everyDays <= 35 ? "month" : `${r.everyDays} days`} · next ~
                          {new Date(r.nextDate).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{naira(r.amount)}</div>
                        <div className="text-[11px] text-muted">{naira(perMonth(r))}/mo</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </main>
        </>
      )}

      {/* Kept mounted so the conversation survives switching tabs. */}
      <div className={tab === "ask" ? "" : "hidden"}>
        <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-br from-pp to-pp-dark px-4 py-4 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="font-extrabold leading-tight">PalmPay Insights</div>
              <div className="text-[11px] opacity-85">Your AI money assistant</div>
            </div>
          </div>
          <div className="flex gap-2">
            {uploaded && (
              <button onClick={() => setUseUpload(!useUpload)} className="chip bg-white/15 text-xs text-white">
                {useUpload ? "Statement" : "Account"} ⇄
              </button>
            )}
            <button onClick={() => setLanguage(language === "english" ? "pidgin" : "english")} className="chip bg-white/15 text-xs text-white">
              {language === "english" ? "EN" : "Pidgin"} ⇄
            </button>
          </div>
        </div>
        <div className="px-4 pt-3">
          <Ask
            txns={txns}
            name={fromUpload ? "there" : firstName}
            language={language}
            facts={facts}
            sheet={sheet}
            insights={insights}
            overview={note ?? fallbackNote}
            sourceLabel={fromUpload ? "your uploaded statement" : "your PalmPay account"}
            pending={pending}
            busyUpload={busyUpload}
            onUpload={() => fileRef.current?.click()}
            onDashboard={() => setTab("insights")}
          />
        </div>
      </div>

      {tab === "history" && (
        <>
          {subHeader("Transaction History")}
          <div className="card mx-4 divide-y divide-pp-soft">
            {[...txns]
              .reverse()
              .slice(0, 150)
              .map((x) => (
                <div key={x.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{x.description}</div>
                    <div className="text-xs text-muted">
                      {prettyDate(x.date)} · <span className="font-semibold text-pp">{x.category}</span>
                    </div>
                  </div>
                  <div className={`shrink-0 font-bold ${x.direction === "in" ? "text-ok" : ""}`}>
                    {x.direction === "in" ? "+" : "−"}
                    {naira(x.amount)}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {tab === "me" && (
        <>
          <div className="rounded-b-[28px] bg-gradient-to-br from-pp to-pp-dark px-4 pb-8 pt-8 text-center text-white">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-extrabold text-pp">{firstName[0]}</div>
            <div className="mt-3 text-xl font-extrabold">{account.fullName}</div>
            <div className="text-sm opacity-85">
              {maskPhone(account.phone)} · {account.tier}
            </div>
          </div>
          <div className="card mx-4 mt-4 divide-y divide-pp-soft">
            <button onClick={() => setTab("ask")} className="flex w-full items-center gap-3 p-4 text-left font-semibold">
              <Sparkles className="text-pp" size={20} /> <span className="flex-1">PalmPay Insights</span> <ChevronRight size={18} className="text-muted" />
            </button>
            <button onClick={() => setLanguage(language === "english" ? "pidgin" : "english")} className="flex w-full items-center gap-3 p-4 text-left font-semibold">
              <Languages className="text-pp" size={20} /> <span className="flex-1">Insights language</span>
              <span className="text-sm text-muted">{language === "english" ? "English" : "Pidgin"}</span>
            </button>
            <button onClick={() => fileRef.current?.click()} className="flex w-full items-center gap-3 p-4 text-left font-semibold">
              <Upload className="text-pp" size={20} /> <span className="flex-1">Analyse a bank statement</span> <ChevronRight size={18} className="text-muted" />
            </button>
            <button onClick={() => showToast("Security settings aren't part of this demo.")} className="flex w-full items-center gap-3 p-4 text-left font-semibold">
              <Shield className="text-pp" size={20} /> <span className="flex-1">Security</span> <ChevronRight size={18} className="text-muted" />
            </button>
            <button onClick={onLogout} className="flex w-full items-center gap-3 p-4 text-left font-semibold text-bad">
              <LogOut size={20} /> <span className="flex-1">Log out</span>
            </button>
          </div>
        </>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-30 w-[90%] max-w-sm -translate-x-1/2 rounded-xl bg-pp-ink px-4 py-3 text-center text-sm text-white shadow-card">
          {toast}
        </div>
      )}

      <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-md -translate-x-1/2 items-end justify-around border-t border-pp/10 bg-white pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
        {(
          [
            ["home", "Home", HomeIcon],
            ["history", "History", List],
            ["ask", "Insights", Sparkles],
            ["insights", "Dashboard", LayoutDashboard],
            ["me", "Me", User],
          ] as const
        ).map(([id, label, Icon]) =>
          id === "ask" ? (
            <button key={id} onClick={() => setTab(id)} className="-mt-5 flex flex-col items-center text-xs font-bold text-pp">
              <span className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-white shadow-card ${tab === id ? "bg-pp-dark" : "bg-pp"} text-white`}>
                <Icon size={24} />
              </span>
              {label}
            </button>
          ) : (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center px-2 py-1.5 text-xs font-semibold ${tab === id ? "text-pp" : "text-muted"}`}
            >
              <Icon size={22} />
              {label}
            </button>
          ),
        )}
      </nav>
    </div>
  );
}
