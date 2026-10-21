import insightsHandler from "@/features/(personal)/account/server/insights";
import { runHandler } from "@/features/(personal)/account/server/_claude";

// Pally's take: a short personal note written from the computed facts.
export async function POST(request: Request) {
  return runHandler(insightsHandler, request);
}
