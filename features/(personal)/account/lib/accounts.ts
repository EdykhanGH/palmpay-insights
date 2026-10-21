// Accounts for the prototype login. Built-in accounts plus ones created on this device (kept in this browser only).

export interface Account {
  /** Unique account id. */
  id: string;
  /** Which demo history profile the account's transactions follow (tunde = salary earner, aisha = trader, kemi = student). */
  personaId: string;
  fullName: string;
  phone: string; // 11-digit Nigerian number
  tier: string;
  /** Login PIN for accounts created on this device; built-in accounts use DEMO_PIN. */
  pin?: string;
}

export const DEMO_PIN = "123456";

export const ACCOUNTS: Account[] = [
  { id: "tunde", personaId: "tunde", fullName: "Tunde Ogundipe", phone: "08012345678", tier: "Tier 3" },
  { id: "aisha", personaId: "aisha", fullName: "Aisha Aliyu", phone: "08023456789", tier: "Tier 3" },
  { id: "kemi", personaId: "kemi", fullName: "Kemi Adewale", phone: "08034567890", tier: "Tier 2" },
];

export const PROFILES = [
  { personaId: "tunde", label: "Salary earner", detail: "Monthly salary, bills, transfers" },
  { personaId: "aisha", label: "Trader / business", detail: "Daily customer payments, suppliers" },
  { personaId: "kemi", label: "Student", detail: "Allowance, data, food" },
];

const KEY = "ppi-accounts";

export function customAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as Account[]) : [];
    return Array.isArray(list) ? list.filter((a) => a && a.id && a.phone && a.pin) : [];
  } catch {
    return [];
  }
}

export const allAccounts = () => [...ACCOUNTS, ...customAccounts()];
export const findAccount = (id: string) => allAccounts().find((a) => a.id === id);
export const findByPhone = (phone: string) => allAccounts().find((a) => a.phone === phone);
export const pinFor = (a: Account) => a.pin ?? DEMO_PIN;

/** Saves a new account on this device and returns it. */
export function createAccount(input: { fullName: string; phone: string; pin: string; personaId: string }): Account {
  const account: Account = {
    id: `u-${input.phone}`,
    personaId: input.personaId,
    fullName: input.fullName.trim().replace(/\s+/g, " "),
    phone: input.phone,
    tier: "Tier 1",
    pin: input.pin,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify([...customAccounts().filter((a) => a.phone !== account.phone), account]));
  } catch {
    // storage blocked (private mode): the account still works for this visit
    sessionAccounts.push(account);
  }
  return account;
}

// Fallback when browser storage is unavailable.
const sessionAccounts: Account[] = [];
export const accountById = (id: string) => findAccount(id) ?? sessionAccounts.find((a) => a.id === id);

export const maskPhone = (p: string) => p.slice(0, 4) + "****" + p.slice(-3);
