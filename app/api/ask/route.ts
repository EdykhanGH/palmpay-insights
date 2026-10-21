import askHandler from "@/features/(personal)/account/server/ask";
import { runHandler } from "@/features/(personal)/account/server/_claude";

// Pally chat: answers questions about the user's transactions.
export async function POST(request: Request) {
  return runHandler(askHandler, request);
}
