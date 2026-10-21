import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-opus-5-5";

export function client() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey });
}

// Minimal request/response shapes for Vercel Node functions (avoids an extra dependency).
export interface Req {
  method?: string;
  body: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
export interface Res {
  status(code: number): Res;
  json(body: unknown): void;
}

export const textOf = (content: any[]) => // eslint-disable-line @typescript-eslint/no-explicit-any
  content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();

/** Runs one of these handlers inside a Next.js route handler. */
export async function runHandler(handler: (req: Req, res: Res) => Promise<void> | void, request: Request) {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // empty or invalid body: the handler reports what is missing
  }
  let status = 200;
  let payload: unknown = null;
  const res: Res = {
    status(code) {
      status = code;
      return res;
    },
    json(b) {
      payload = b;
    },
  };
  await handler({ method: request.method, body }, res);
  return Response.json(payload, { status });
}
