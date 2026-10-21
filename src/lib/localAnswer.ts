import type { Facts } from "./analyse";
import { naira } from "./format";
import { applyFilters, runTool, type Filters } from "./tools";
import type { Category, Txn } from "./types";

// Answers common money questions straight from the transactions, without the AI.
// Used when the AI can't be reached, so the chat always works and is always exact.

export interface LocalReply {
  text: string;
  evidence?: { date: string; description: string; amount: number; direction: "in" | "out" }[];
  followups?: string[];
}

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const DAY = 86_400_000;
const iso = (d: Date) => d.toISOString().slice(0, 10);

interface Range {
  from?: string;
  to?: string;
  label: string;
}

function rangeFrom(q: string, asOf: string): Range {
  const now = new Date(asOf.slice(0, 10) + "T12:00:00");
  const y = now.getFullYear();
  const m = now.getMonth();
  const monthRange = (yy: number, mm: number, label: string): Range => ({
    from: iso(new Date(Date.UTC(yy, mm, 1))),
    to: iso(new Date(Date.UTC(yy, mm + 1, 0))),
    label,
  });
  if (/this month/.test(q)) return monthRange(y, m, "this month");
  if (/last month/.test(q)) return monthRange(m === 0 ? y - 1 : y, (m + 11) % 12, "last month");
  if (/today/.test(q)) return { from: iso(now), to: iso(now), label: "today" };
  if (/yesterday/.test(q)) return { from: iso(new Date(now.getTime() - DAY)), to: iso(new Date(now.getTime() - DAY)), label: "yesterday" };
  if (/this week|last 7 days|past week/.test(q)) return { from: iso(new Date(now.getTime() - 6 * DAY)), label: "in the last 7 days" };
  if (/last week/.test(q)) return { from: iso(new Date(now.getTime() - 13 * DAY)), to: iso(new Date(now.getTime() - 7 * DAY)), label: "last week" };
  if (/(last|past) 30 days|this past month/.test(q)) return { from: iso(new Date(now.getTime() - 29 * DAY)), label: "in the last 30 days" };
  if (/(last|past) (3|three) months/.test(q)) return { from: iso(new Date(now.getTime() - 90 * DAY)), label: "in the last 3 months" };
  if (/this year/.test(q)) return { from: `${y}-01-01`, label: "this year" };
  const since = q.match(new RegExp(`since (${MONTHS.join("|")})`));
  if (since) {
    const mm = MONTHS.indexOf(since[1]);
    return { from: iso(new Date(Date.UTC(mm > m ? y - 1 : y, mm, 1))), label: `since ${since[1][0].toUpperCase() + since[1].slice(1)}` };
  }
  const named = MONTHS.find((n) => new RegExp(`\\b(${n}|${n.slice(0, 3)})\\b`).test(q));
  if (named) {
    const mm = MONTHS.indexOf(named);
    return monthRange(mm > m ? y - 1 : y, mm, `in ${named[0].toUpperCase() + named.slice(1)}`);
  }
  return { label: "in your history" };
}

const CATS: [RegExp, Category][] = [
  [/bet|sporty|bet9ja|gambl/, "Betting"],
  [/data|airtime|recharge|top ?up/, "Airtime & Data"],
  [/food|eat|grocer|restaurant|kitchen|chop/, "Food & Groceries"],
  [/transport|bolt|uber|ride|fuel|petrol|keke/, "Transport"],
  [/subscri|netflix|dstv|gotv|showmax|spotify/, "Subscriptions"],
  [/fee|charge|levy|stamp duty/, "Fees & Charges"],
  [/pos|cash ?out|withdraw/, "Cash Withdrawal"],
  [/rent|landlord/, "Rent"],
  [/church|tithe|offering|giving|donat/, "Church & Giving"],
  [/electric|nepa|light bill|bills?|utilit/, "Bills & Utilities"],
  [/shop|jumia|konga/, "Shopping"],
  [/loan repay|repaid|repay/, "Loan Repayment"],
  [/business|supplier|stock/, "Business & Suppliers"],
  [/my own|myself|own account/, "Transfers to self"],
];

const sum = (xs: Txn[]) => xs.reduce((s, x) => s + x.amount, 0);
const ev = (xs: Txn[], n = 5) =>
  [...xs]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, n)
    .map((x) => ({ date: x.date.slice(0, 16), description: x.description, amount: x.amount, direction: x.direction }));
const NOT_SPEND = new Set<Category>(["Savings", "Transfers to self"]);
const NOT_INCOME = new Set<Category>(["From Savings"]);

export function overviewText(f: Facts, name: string) {
  const month = new Date(f.month + "-01T12:00:00").toLocaleString("en-NG", { month: "long" });
  const top = f.byCategory.filter((c) => !NOT_SPEND.has(c.category)).slice(0, 3);
  return (
    `Hi ${name}! Here's ${month} so far: ${naira(f.thisMonth.income)} came in and ${naira(f.thisMonth.spend)} went out.` +
    (top.length ? ` Most of it went on ${top.map((c) => `${c.category} (${naira(c.amount)})`).join(", ")}.` : "") +
    ` Your money health score is ${f.score}/100.`
  );
}

export function localAnswer(question: string, txns: Txn[], f: Facts, name: string): LocalReply {
  const q = question.toLowerCase();
  const r = rangeFrom(q, f.asOf);
  const inRange = applyFilters(txns, { from: r.from, to: r.to } as Filters);
  const outs = inRange.filter((x) => x.direction === "out" && !NOT_SPEND.has(x.category));
  const ins = inRange.filter((x) => x.direction === "in" && !NOT_INCOME.has(x.category));

  // Overview / explain
  if (/explain|summary|summar|overview|how am i doing|my month|what('?s| is) going on|break.?down my month|how (is|was) my/.test(q) && !CATS.some(([re]) => re.test(q))) {
    return {
      text: overviewText(f, name) + (f.history.loansIn ? ` Since ${f.history.from} you've borrowed ${naira(f.history.loansIn)} and repaid ${naira(f.history.loansRepaid)}.` : ""),
      followups: ["Where did my money go this month?", "Who do I send the most money to?", "What should I cut first?"],
    };
  }

  // What-if
  const cut = q.match(/(\d{1,3})\s*%|half|quarter/);
  if (/what if|if i (cut|reduce|stop)|cut .* by/.test(q)) {
    const cat = CATS.find(([re]) => re.test(q))?.[1];
    const pct = cut ? (cut[0] === "half" ? 50 : cut[0] === "quarter" ? 25 : Number(cut[1])) : /stop/.test(q) ? 100 : 50;
    const from90 = iso(new Date(new Date(f.asOf).getTime() - 89 * DAY));
    const spent = sum(applyFilters(txns, { from: from90, direction: "out", category: cat }).filter((x) => !NOT_SPEND.has(x.category))) / 3;
    const saved = Math.round((spent * pct) / 100);
    return {
      text: `You spend about ${naira(spent)} a month${cat ? ` on ${cat}` : ""} (average of the last 3 months). Cutting that by ${pct}% saves about ${naira(saved)} a month, which is ${naira(saved * 12)} a year. Put it in CashBox and it earns daily interest too.`,
      followups: ["What else can I cut?", "How much did I save this year?", "Explain my month"],
    };
  }

  // Advice
  if (/cut|save more|reduce|advice|what should i|how can i save|tips?/.test(q)) {
    const nonEssential = new Set<Category>(["Betting", "Food & Groceries", "Shopping", "Subscriptions", "Transfers to people", "Cash Withdrawal", "Airtime & Data", "Transport"]);
    const last30 = applyFilters(txns, { from: iso(new Date(new Date(f.asOf).getTime() - 89 * DAY)), direction: "out" });
    const byCat = new Map<Category, number>();
    for (const x of last30) if (nonEssential.has(x.category)) byCat.set(x.category, (byCat.get(x.category) ?? 0) + x.amount / 3);
    const top = [...byCat.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (!top.length) return { text: "Your recent spending is already lean. The best next step is automatic saving: set CashBox to save a little after every credit." };
    const save = top.reduce((s, [, v]) => s + v * 0.2, 0);
    return {
      text: `Your biggest flexible spending, per month on average over the last 3 months: ${top.map(([c, v]) => `${c} ${naira(v)}`).join(", ")}. Trimming each by just 20% frees up about ${naira(save)} a month. Start with ${top[0][0]}.`,
      evidence: ev(last30.filter((x) => x.category === top[0][0])),
      followups: [`What if I cut ${top[0][0]} by half?`, `Show me my ${top[0][0]} spending`, "Explain my month"],
    };
  }

  // Loans
  if (/loan|borrow|debt|owe/.test(q)) {
    const loans = applyFilters(txns, { from: r.from, to: r.to }).filter((x) => x.category === "Loan received" || x.category === "Loan Repayment");
    const took = sum(loans.filter((x) => x.category === "Loan received"));
    const paid = sum(loans.filter((x) => x.category === "Loan Repayment"));
    if (!loans.length) return { text: `No loans ${r.label}. 👏` };
    return {
      text: `${r.label[0].toUpperCase() + r.label.slice(1)} you borrowed ${naira(took)} and repaid ${naira(paid)}${paid > took ? `, ${naira(paid - took)} more than you borrowed` : ""}. A small emergency buffer in CashBox can help you avoid the next loan.`,
      evidence: ev(loans),
      followups: ["How much did I save this year?", "What should I cut first?", "How much came in this month?"],
    };
  }

  // Savings & interest
  if (/interest|saving|saved|\bsave\b|cashbox|spend ?& ?save|flexi/.test(q)) {
    const rows = applyFilters(txns, { from: r.from, to: r.to });
    const saved = sum(rows.filter((x) => x.category === "Savings"));
    const interest = sum(rows.filter((x) => x.category === "Interest"));
    const back = sum(rows.filter((x) => x.category === "From Savings"));
    return {
      text: `${r.label[0].toUpperCase() + r.label.slice(1)} you put ${naira(saved)} into savings, took ${naira(back)} back out, and earned ${naira(interest)} in interest. Saving a fixed amount every payday would grow this much faster.`,
      followups: ["What should I cut first?", "What if I cut food by 20%?", "Explain my month"],
    };
  }

  if (/balance|how much (do i have|is left)/.test(q)) {
    return f.balanceKnown
      ? { text: `Your balance is ${naira(f.balance)}. You're spending about ${naira(f.dailyBurn)} a day.`, followups: ["What should I cut first?", "Explain my month"] }
      : { text: `This statement doesn't show balances, but across it ${naira(sum(txns.filter((x) => x.direction === "in")))} came in and ${naira(sum(txns.filter((x) => x.direction === "out")))} went out.`, followups: ["Explain my month", "Where did my money go?"] };
  }

  // Biggest payments
  if (/biggest|largest|highest|most expensive|top (payments|transactions|expenses)/.test(q)) {
    return {
      text: `Your biggest payments ${r.label}:`,
      evidence: ev(outs),
      followups: ["Who do I send the most money to?", "Where did my money go this month?", "What should I cut first?"],
    };
  }

  // Specific person: "sent to X", "paid X", "from X"
  const who = q.match(/(?:send|sent|transfer(?:red)?|pay|paid|give|gave)\s+(?:to\s+)?([a-z][a-z .'-]{2,})|from\s+([a-z][a-z .'-]{2,})/);
  const nameQ = (who?.[1] ?? who?.[2] ?? "").replace(/\b(this|last|in|since|the|so far|month|year|week|today|me|my|money)\b.*$/, "").trim();
  if (nameQ && nameQ.length >= 3 && !/^(people|who|whom|someone|anyone)$/.test(nameQ) && !CATS.some(([re]) => re.test(nameQ))) {
    const words = nameQ.split(/\s+/).filter((w) => w.length >= 3);
    const match = inRange.filter((x) => words.some((w) => x.counterparty.toLowerCase().includes(w) || x.description.toLowerCase().includes(w)));
    if (match.length) {
      const out = match.filter((x) => x.direction === "out");
      const inn = match.filter((x) => x.direction === "in");
      return {
        text: `${r.label[0].toUpperCase() + r.label.slice(1)}: you sent ${naira(sum(out))} in ${out.length} payment${out.length === 1 ? "" : "s"}${inn.length ? ` and received ${naira(sum(inn))} in ${inn.length}` : ""} matching "${nameQ}".`,
        evidence: ev(match),
        followups: ["Who do I send the most money to?", "Explain my month", "What should I cut first?"],
      };
    }
  }

  // Top people
  if (/who/.test(q)) {
    const incoming = /(sends?|sent|pays?|paid|gives?|gave|transfers?) me|receiv|from|earn|income/.test(q);
    const pool = (incoming ? ins : outs).filter((x) => incoming || x.category === "Transfers to people" || x.category === "Family & Friends" || x.category === "Business & Suppliers" || x.category === "Church & Giving");
    const b = runTool("breakdown", { by: "counterparty" }, pool) as { key: string; total: number; count: number }[];
    if (!b.length) return { text: `I couldn't find any ${incoming ? "money received" : "transfers"} ${r.label}.` };
    return {
      text: `${incoming ? "Who sent you the most" : "Who you sent the most to"} ${r.label}: ${b.slice(0, 5).map((x, i) => `${i + 1}. ${x.key}: ${naira(x.total)} (${x.count}×)`).join("\n")}`,
      followups: [incoming ? "Who do I send the most money to?" : "Who sends me the most money?", "Biggest payments this month", "Explain my month"],
    };
  }

  // Income
  if (/income|earn|receiv|came in|money in|got paid|credit/.test(q)) {
    const b = runTool("breakdown", { by: "counterparty" }, ins) as { key: string; total: number }[];
    return {
      text: `${naira(sum(ins))} came in ${r.label} (${ins.length} credits). Biggest sources: ${b.slice(0, 3).map((x) => `${x.key} ${naira(x.total)}`).join(", ")}.`,
      evidence: ev(ins, 4),
      followups: ["How much did I spend this month?", "Who sends me the most money?", "Explain my month"],
    };
  }

  // Category
  const cat = CATS.find(([re]) => re.test(q))?.[1];
  if (cat) {
    const rows = inRange.filter((x) => x.category === cat && x.direction === "out");
    const total = sum(rows);
    return {
      text: rows.length
        ? `You spent ${naira(total)} on ${cat} ${r.label}, across ${rows.length} payment${rows.length === 1 ? "" : "s"} (about ${naira(total / rows.length)} each).`
        : `No ${cat} spending ${r.label}.`,
      evidence: ev(rows),
      followups: [`What if I cut ${cat} by half?`, `${cat} last month`, "What should I cut first?"],
    };
  }

  // Day of week
  if (/day of the week|weekday|which day/.test(q)) {
    const b = runTool("breakdown", { by: "weekday" }, outs) as { key: string; total: number }[];
    return { text: `You spend the most on ${b[0]?.key}s (${naira(b[0]?.total ?? 0)} ${r.label}), then ${b[1]?.key}s.`, followups: ["Biggest payments this month", "Explain my month"] };
  }

  // Spending in general
  if (/spen|spent|expens|money out|went out|where did|where (does|is) my money/.test(q)) {
    const b = runTool("breakdown", { by: "category" }, outs) as { key: string; total: number }[];
    return {
      text: `You spent ${naira(sum(outs))} ${r.label}. By category: ${b.slice(0, 5).map((x) => `${x.key} ${naira(x.total)}`).join(", ")}.`,
      evidence: ev(outs, 4),
      followups: [`Show me my ${b[0]?.key ?? "food"} spending`, "What should I cut first?", "Who do I send the most money to?"],
    };
  }

  return {
    text: `I can answer questions about your transactions. Try asking how much you spent on something, who you send money to, your biggest payments, loans or savings. ${overviewText(f, name)}`,
    followups: ["Explain my month", "Where did my money go this month?", "Who do I send the most money to?"],
  };
}
