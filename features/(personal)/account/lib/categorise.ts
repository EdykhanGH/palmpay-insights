import type { Category, Direction } from "./types";

// Ordered rules: first match wins. Matched against the lower-cased description.
const OUT_RULES: [RegExp, Category][] = [
  [/\b(fee|charge|vat|stamp duty|sms alert|levy)\b/, "Fees & Charges"],
  [/\b(spend & save deposit|auto deduct-flexi)\b/, "Savings"],
  [/\b(auto deduct-cash loan|repayment-|loan repayment)/, "Loan Repayment"],
  [/\bpos transfer/, "Cash Withdrawal"],
  [/\b(church|foundation|ministry|ministries|mosque|parish|tithe|offering|faith|chapel|assembly)\b/, "Church & Giving"],
  [/\b(bet9ja|sportybet|betking|nairabet|1xbet|msport|bangbet|merrybet|betway|22bet|betting)\b/, "Betting"],
  [/\b(airtime|data|mtn|glo|airtel|9mobile|t2)\b/, "Airtime & Data"],
  [/\b(dstv|gotv|startimes|netflix|showmax|spotify|apple|youtube|prime video|boomplay|subscription)\b/, "Subscriptions"],
  [/\b(ikedc|ekedc|aedc|phed|ibedc|eedc|kaedco|electricity|prepaid|nepa|water|lawma|waste)\b/, "Bills & Utilities"],
  [/\b(cashbox|flexi|target saving|savings|save|piggy|cowrywise|piggyvest)\b/, "Savings"],
  [/\b(loan|repayment|carbon|fairmoney|palmcredit|branch|renmoney|easemoni)\b/, "Loan Repayment"],
  [/\b(rent|landlord|caution fee|agent fee)\b/, "Rent"],
  [/\b(pos|atm|cash ?out|withdrawal|withdraw)\b/, "Cash Withdrawal"],
  [/\b(bolt|uber|indrive|taxify|rida|brt|cowry|keke|okada|fuel|petrol|filling station|mobil|nnpc|conoil|oil|rainoil|ardova|motors)\b/, "Transport"],
  [/\b(shoprite|spar|chicken republic|kfc|domino|dominos|mr bigg|sweet sensation|chowdeck|glovo|jumia food|bukka|restaurant|eatery|kitchen|foods?|groceries|supermarket|market|mama put|suya|bakery|grill|spices|catering|lounge|cafe)\b/, "Food & Groceries"],
  [/\b(jumia|konga|temu|aliexpress|slot|store|boutique|mall|fashion|pharmacy|medplus)\b/, "Shopping"],
  [/\b(supplier|wholesale|stock|goods|ventures|enterprises?|trading|ltd|limited|services|resources|global|plc)\b/, "Business & Suppliers"],
];

const FAMILY = /\b(mum|mom|mama|mummy|dad|daddy|papa|baba|sister|brother|bro|sis|aunty|auntie|uncle|wife|husband|babe|son|daughter)\b/;

export function categorise(description: string, direction: Direction): Category {
  const d = description.toLowerCase();
  if (direction === "in") {
    if (/\b(salary|payroll|wages|stipend|allowance)\b/.test(d)) return "Income";
    if (/interest\b/.test(d)) return "Interest";
    if (/spend & save withdraw|cashbox withdraw|flexi withdraw|savings withdraw/.test(d)) return "From Savings";
    if (/disbursement|loan disburse/.test(d)) return "Loan received";
    if (/^received from .*\b(ltd|limited|plc|inc|llc|company)\b/.test(d)) return "Income";
    return "Transfers received";
  }
  for (const [re, cat] of OUT_RULES) if (re.test(d)) return cat;
  if (FAMILY.test(d)) return "Family & Friends";
  if (/^(transfer to|send to)\b/.test(d)) return "Transfers to people";
  return "Other";
}

/** Pulls the person/merchant name out of a bank narration. */
export function counterpartyOf(description: string): string {
  let s = description
    .replace(/^(transfer (to|from)|payment (to|from)|send to|sent to|received from|pos purchase at|purchase at|paid to|bill payment[:-]?)\s*/i, "")
    .replace(/^pos transfer\s*-\s*/i, "")
    .replace(/\s*(ref|reference|txn|session)[:#]?\s*\w+$/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (!s) s = description.trim();
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .slice(0, 40);
}
