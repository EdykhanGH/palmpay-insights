import { categorise, counterpartyOf } from "./categorise";
import type { Txn } from "./types";

// Reads a PalmPay "Account Statement" PDF. Its table has five columns (Transaction Date, Transaction Detail,
// Money In, Money Out, Transaction ID) and details often wrap over several lines, so we read text by position:
// every row is anchored on its date, and each piece of text joins the row whose date is closest vertically.

export interface PdfItem {
  str: string;
  x: number;
  y: number; // PDF space: larger is higher on the page
  rotated: boolean;
}

interface Columns {
  detail: number;
  moneyIn: number;
  moneyOut: number;
  id: number;
}

const DATE_RE = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)$/i;
const AMOUNT_RE = /^[+-]?[\d,]+\.\d{2}$/;

function isoFrom(m: RegExpMatchArray) {
  const [, mo, d, y, h, mi, s, ap] = m;
  let hh = Number(h) % 12;
  if (ap.toUpperCase() === "PM") hh += 12;
  return `${y}-${mo}-${d}T${String(hh).padStart(2, "0")}:${mi}:${s}`;
}

function findColumns(items: PdfItem[]): Columns | null {
  const at = (re: RegExp) => items.find((i) => re.test(i.str))?.x;
  const detail = at(/^Transaction Detail/i);
  const moneyIn = at(/^Money In/i);
  const moneyOut = at(/^Money Out/i);
  const id = at(/^Transaction ID/i);
  if (detail == null || moneyIn == null || moneyOut == null || id == null) return null;
  return { detail, moneyIn, moneyOut, id };
}

/** Pure parser over positioned text, one array per page. */
export function parseStatementPages(pages: PdfItem[][]): Txn[] {
  let cols: Columns | null = null;
  const txns: Txn[] = [];

  // The account holder's name (top right of page 1) lets us spot transfers to their own other accounts.
  const first = (pages[0] ?? []).filter((i) => !i.rotated && i.str.trim());
  const label = first.find((i) => i.str.trim() === "Name");
  const holder = label
    ? first.filter((i) => Math.abs(i.y - label.y) < 2 && i.x > label.x + 20).map((i) => i.str.trim()).join(" ").toLowerCase()
    : "";
  const holderWords = holder.split(/\s+/).filter((w) => w.length > 2);
  const isSelf = (desc: string) => holderWords.length >= 2 && holderWords.filter((w) => desc.toLowerCase().includes(w)).length >= 2;

  pages.forEach((raw, pageNo) => {
    const items = raw.filter((i) => !i.rotated && i.str.trim() && !/^palmpay$/i.test(i.str.trim()));
    cols = findColumns(items) ?? cols;
    if (!cols) return;
    const c = cols;
    const headerY = items.find((i) => /^Transaction Date/i.test(i.str))?.y ?? Infinity;

    // Join pieces on the same line in the date column (a date and its time can arrive separately).
    const dateBits = items.filter((i) => i.x < c.detail - 5 && i.y < headerY);
    const lines = new Map<number, PdfItem[]>();
    for (const i of dateBits) {
      const key = [...lines.keys()].find((k) => Math.abs(k - i.y) < 2) ?? i.y;
      lines.set(key, [...(lines.get(key) ?? []), i]);
    }
    const anchors = [...lines.entries()]
      .map(([y, parts]) => ({ y, m: parts.sort((a, b) => a.x - b.x).map((p) => p.str.trim()).join(" ").replace(/\s+/g, " ").match(DATE_RE) }))
      .filter((a): a is { y: number; m: RegExpMatchArray } => !!a.m)
      .sort((a, b) => b.y - a.y);
    if (!anchors.length) return;

    const gaps = anchors.slice(1).map((a, i) => anchors[i].y - a.y).sort((a, b) => a - b);
    const spacing = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 30;
    const top = anchors[0].y + spacing * 0.6;

    const rows = anchors.map((a) => ({ ...a, detail: [] as PdfItem[], moneyIn: "", moneyOut: "" }));
    for (const i of items) {
      if (i.x < c.detail - 5 || i.x >= c.id - 5 || i.y > top || i.y >= headerY) continue;
      let best = rows[0];
      for (const r of rows) if (Math.abs(r.y - i.y) < Math.abs(best.y - i.y)) best = r;
      if (Math.abs(best.y - i.y) > spacing * 0.6) continue;
      const s = i.str.trim();
      if (i.x < c.moneyIn - 5) best.detail.push(i);
      else if (i.x < c.moneyOut - 5) best.moneyIn += s;
      else best.moneyOut += s;
    }

    rows.forEach((r, n) => {
      const amountText = (r.moneyIn || r.moneyOut).replace(/\s/g, "");
      if (!AMOUNT_RE.test(amountText)) return;
      const amount = Math.abs(parseFloat(amountText.replace(/,/g, "")));
      if (!amount) return;
      const direction = r.moneyIn ? "in" : "out";
      const description =
        r.detail
          .sort((a, b) => b.y - a.y || a.x - b.x)
          .map((d) => d.str.trim())
          .join(" ")
          .replace(/\s+/g, " ")
          .trim() || "Transaction";
      txns.push({
        id: `pdf-${pageNo}-${n}`,
        date: isoFrom(r.m),
        description,
        amount,
        direction,
        category: direction === "out" && /^send to/i.test(description) && isSelf(description) ? "Transfers to self" : categorise(description, direction),
        counterparty: counterpartyOf(description),
      });
    });
  });

  return txns.sort((a, b) => a.date.localeCompare(b.date));
}

/** Browser entry point: extracts positioned text with pdf.js, then parses it. */
export async function readPdfStatement(file: File): Promise<Txn[]> {
  const pdfjs = await import("pdfjs-dist");
  // Served from public/ (copied from pdfjs-dist/build).
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: PdfItem[][] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const content = await (await doc.getPage(p)).getTextContent();
    pages.push(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (content.items as any[])
        .filter((i) => typeof i.str === "string")
        .map((i) => ({ str: i.str, x: i.transform[4], y: i.transform[5], rotated: Math.abs(i.transform[1]) > 0.01 })),
    );
  }
  const txns = parseStatementPages(pages);
  if (!txns.length) throw new Error("Couldn't find any transactions in this PDF. Is it a PalmPay account statement?");
  return txns;
}
