import { CATEGORIES } from "./tools";
import type { Txn } from "./types";

// Things Pally can set up for the user: spending limits, savings goals and reminders.
// Pally only PROPOSES these (as action cards); nothing is saved until the user taps Confirm.

export type PallyAction =
  | { type: "set_spending_limit"; category: string; amount: number }
  | { type: "create_savings_goal"; name: string; target: number; monthly?: number; by?: string }
  | { type: "set_reminder"; message: string; date: string };

export interface Plan {
  limits: { category: string; amount: number }[];
  goals: { name: string; target: number; monthly?: number; by?: string }[];
  reminders: { message: string; date: string }[];
}

export const EMPTY_PLAN: Plan = { limits: [], goals: [], reminders: [] };

/** Tool definitions Claude uses to propose actions. */
export const ACTION_TOOLS = [
  {
    name: "set_spending_limit",
    description:
      "Propose a monthly spending limit for a category. The user sees a card and must confirm. Use when they ask to limit, cap or control spending, or when a limit is the best next step.",
    input_schema: {
      type: "object",
      properties: { category: { type: "string", enum: CATEGORIES }, amount: { type: "number", description: "Monthly limit in naira" } },
      required: ["category", "amount"],
    },
  },
  {
    name: "create_savings_goal",
    description:
      "Propose a savings goal in CashBox. The user sees a card and must confirm. Use what_if or other tools first if you need numbers to suggest a sensible monthly amount.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Short goal name, e.g. Rent, New phone, Emergency fund" },
        target: { type: "number", description: "Target amount in naira" },
        monthly: { type: "number", description: "Suggested amount to save each month, in naira" },
        by: { type: "string", description: "Target date YYYY-MM-DD, if the user gave one" },
      },
      required: ["name", "target"],
    },
  },
  {
    name: "set_reminder",
    description: "Propose a reminder (e.g. a bill due date). The user sees a card and must confirm.",
    input_schema: {
      type: "object",
      properties: { message: { type: "string" }, date: { type: "string", description: "YYYY-MM-DD" } },
      required: ["message", "date"],
    },
  },
];

export const isActionTool = (name: string) => ACTION_TOOLS.some((t) => t.name === name);

/** Turns a tool call into a clean action, or null if the input is unusable. */
export function toAction(name: string, input: Record<string, unknown>): PallyAction | null {
  const num = (v: unknown) => Math.round(Number(v));
  if (name === "set_spending_limit" && CATEGORIES.includes(String(input.category)) && num(input.amount) > 0)
    return { type: name, category: String(input.category), amount: num(input.amount) };
  if (name === "create_savings_goal" && input.name && num(input.target) > 0)
    return {
      type: name,
      name: String(input.name).slice(0, 40),
      target: num(input.target),
      monthly: num(input.monthly) > 0 ? num(input.monthly) : undefined,
      by: /^\d{4}-\d{2}-\d{2}$/.test(String(input.by ?? "")) ? String(input.by) : undefined,
    };
  if (name === "set_reminder" && input.message && /^\d{4}-\d{2}-\d{2}$/.test(String(input.date)))
    return { type: name, message: String(input.message).slice(0, 80), date: String(input.date) };
  return null;
}

export function applyAction(plan: Plan, a: PallyAction): Plan {
  if (a.type === "set_spending_limit")
    return { ...plan, limits: [...plan.limits.filter((l) => l.category !== a.category), { category: a.category, amount: a.amount }] };
  if (a.type === "create_savings_goal")
    return { ...plan, goals: [...plan.goals.filter((g) => g.name.toLowerCase() !== a.name.toLowerCase()), { name: a.name, target: a.target, monthly: a.monthly, by: a.by }] };
  return { ...plan, reminders: [...plan.reminders, { message: a.message, date: a.date }].sort((x, y) => x.date.localeCompare(y.date)) };
}

/** Spending this month per limited category, for progress bars and for Pally's context. */
export function limitProgress(plan: Plan, txns: Txn[]) {
  const month = txns[txns.length - 1]?.date.slice(0, 7) ?? "";
  return plan.limits.map((l) => {
    const spent = txns.filter((x) => x.direction === "out" && x.category === l.category && x.date.startsWith(month)).reduce((s, x) => s + x.amount, 0);
    return { ...l, spent, left: l.amount - spent, over: spent > l.amount };
  });
}

const key = (accountId: string) => `ppi-plan-${accountId}`;

export function loadPlan(accountId: string): Plan {
  try {
    const raw = localStorage.getItem(key(accountId));
    const p = raw ? JSON.parse(raw) : null;
    return p && Array.isArray(p.limits) && Array.isArray(p.goals) && Array.isArray(p.reminders) ? p : EMPTY_PLAN;
  } catch {
    return EMPTY_PLAN;
  }
}

export function savePlan(accountId: string, plan: Plan) {
  try {
    localStorage.setItem(key(accountId), JSON.stringify(plan));
  } catch {
    // storage blocked: the plan lasts for this visit
  }
}
