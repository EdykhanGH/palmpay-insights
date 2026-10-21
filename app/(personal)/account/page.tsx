import { PersonalAccountPage } from "@/features/(personal)/account";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Account | PalmPay",
  description: "Your PalmPay personal account, with Pally, your AI money assistant.",
};

export default function Page() {
  return <PersonalAccountPage />;
}
