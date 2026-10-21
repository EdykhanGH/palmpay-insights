import SiteFooter from "@/components/layouts/(marketing)/site-footer";
import SiteHeader from "@/components/layouts/(marketing)/site-header";
import Image from "next/image";

const markets = ["Nigeria", "Ghana", "Tanzania", "Bangladesh", "United Kingdom"];

const pillars = [
  {
    title: "Consumer banking",
    body: "Payments, savings, credit, and rewards in one trusted app.",
  },
  {
    title: "Business tools",
    body: "Collections, payouts, POS, and agent networks for merchants.",
  },
  {
    title: "Device financing",
    body: "Smartphone access that opens the door to digital finance.",
  },
  {
    title: "Enterprise rails",
    body: "APIs for local and cross-border payments at scale.",
  },
];

export default function CompanyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-palm-purple-bright">
          <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <p className="animate-rise text-sm font-semibold uppercase tracking-[0.14em] text-white/75">
              Company
            </p>
            <h1 className="animate-rise-delay-1 mt-3 max-w-3xl font-[family-name:var(--font-syne)] text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-[3.2rem]">
              We scale inclusive finance across emerging markets
            </h1>
            <p className="animate-rise-delay-1 mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
              PalmPay is a next-generation digital bank and fintech platform
              powering inclusive economic growth — trusted by tens of millions
              for payments, savings, credit, and business tools.
            </p>
          </div>
        </section>

        <section className="section-wash py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:gap-14 md:px-8">
            <div>
              <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-palm-purple-deep sm:text-4xl">
                Our story
              </h2>
              <p className="mt-4 text-base leading-relaxed text-palm-muted sm:text-lg">
                We launched in Nigeria in 2019 as a consumer payments app.
                Since then, PalmPay has grown into a full financial ecosystem
                for individuals and businesses across multiple markets.
              </p>
              <p className="mt-4 text-base leading-relaxed text-palm-muted sm:text-lg">
                Our vision is bold: to build the neobank for the next billion.
              </p>
            </div>
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2rem]">
              <Image
                src="/images/people-visual.png"
                alt="PalmPay customer with debit card"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 90vw, 520px"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-palm-purple-deep sm:text-4xl">
              What we build
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {pillars.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl bg-palm-lavender px-6 py-7"
                >
                  <h3 className="font-[family-name:var(--font-syne)] text-lg font-bold text-palm-purple-deep">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-palm-muted">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-wash py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-palm-purple-deep sm:text-4xl">
              Where we operate
            </h2>
            <ul className="mt-8 flex flex-wrap gap-3">
              {markets.map((market) => (
                <li
                  key={market}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-palm-purple-deep shadow-[0_8px_24px_-12px_rgba(45,10,92,0.2)]"
                >
                  {market}
                </li>
              ))}
            </ul>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                { value: "40M+", label: "Users" },
                { value: "1M+", label: "Businesses" },
                { value: "15M", label: "Transactions / day" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-palm-purple px-6 py-8 text-center text-white palm-offset"
                >
                  <p className="font-[family-name:var(--font-syne)] text-3xl font-extrabold">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-white/85">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
