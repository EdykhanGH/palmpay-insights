import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PalmPay Business",
};

export default async function DashboardSectionPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const title = slug
    .map((part) => part.replace(/-/g, " "))
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ");

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#F2F2F2] bg-white p-6 md:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-palm-purple-deep">
          {title}
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-palm-muted md:text-base">
          This section is ready for your merchant workflows. Continue from Home
          to activate your balance and start receiving payments.
        </p>
        <Link
          href="/home"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-palm-purple px-5 text-sm font-semibold text-white transition hover:bg-palm-purple-bright"
        >
          Back to Home
        </Link>
      </section>
    </div>
  );
}
