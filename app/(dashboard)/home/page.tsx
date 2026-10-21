import { DashboardHomePage } from "@/features/(dashboard)/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | PalmPay Business",
  description:
    "Activate your balance and manage multi-currency collections with PalmPay Business.",
};

export default function Page() {
  return <DashboardHomePage />;
}
