// Demo accounts for the prototype login. Nothing is sent anywhere; this only picks which demo history to load.

export interface Account {
  personaId: string;
  fullName: string;
  phone: string; // 11-digit Nigerian number
  tier: string;
}

export const DEMO_PIN = "123456";

export const ACCOUNTS: Account[] = [
  { personaId: "tunde", fullName: "Tunde Ogundipe", phone: "08012345678", tier: "Tier 3" },
  { personaId: "aisha", fullName: "Aisha Aliyu", phone: "08023456789", tier: "Tier 3" },
  { personaId: "kemi", fullName: "Kemi Adewale", phone: "08034567890", tier: "Tier 2" },
];

const KEY = "ppi-session";

export function savedSession(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function saveSession(personaId: string | null) {
  try {
    if (personaId) localStorage.setItem(KEY, personaId);
    else localStorage.removeItem(KEY);
  } catch {
    // private mode: session just won't persist
  }
}

export const accountFor = (personaId: string) => ACCOUNTS.find((a) => a.personaId === personaId);

export const maskPhone = (p: string) => p.slice(0, 4) + "****" + p.slice(-3);
