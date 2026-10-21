import SiteFooter from "@/components/layouts/(marketing)/site-footer";
import SiteHeader from "@/components/layouts/(marketing)/site-header";
import Image from "next/image";

const outcomes = [
  {
    value: "25%",
    title: "First-time account holders",
    body: "People opening their first formal financial account with PalmPay.",
  },
  {
    value: "57%",
    title: "First-time loan recipients",
    body: "Access to credit that helps households and small businesses move forward.",
  },
  {
    value: "800K+",
    title: "Smartphones financed",
    body: "Device financing that puts a bank branch in more people’s pockets.",
  },
];

const security = [
  {
    title: "Licensed & regulated",
    body: "Fully licensed under strict financial authority oversight.",
  },
  {
    title: "NDIC insured deposits",
    body: "Customer deposits protected for peace of mind.",
  },
  {
    title: "Advanced encryption",
    body: "End-to-end protection, ISO-aligned and PCI DSS compliant.",
  },
  {
    title: "Fraud monitoring",
    body: "AI detection, dedicated teams, and 24/7 in-app reporting.",
  },
];

export default function ImpactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-palm-purple-bright">
          <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <p className="animate-rise text-sm font-semibold uppercase tracking-[0.14em] text-white/75">
              Impact
            </p>
            <h1 className="animate-rise-delay-1 mt-3 max-w-3xl font-[family-name:var(--font-syne)] text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-[3.2rem]">
              Expanding access. Unlocking opportunity.
            </h1>
            <p className="animate-rise-delay-1 mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
              From first bank accounts to affordable smartphones, PalmPay drives
              financial inclusion at scale across emerging markets.
            </p>
          </div>
        </section>

        <section className="section-wash py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-palm-purple-deep sm:text-4xl">
              Our impact in numbers
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {outcomes.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl bg-white px-6 py-8 shadow-[0_12px_40px_-20px_rgba(45,10,92,0.18)]"
                >
                  <p className="font-[family-name:var(--font-syne)] text-4xl font-extrabold text-palm-purple">
                    {item.value}
                  </p>
                  <h3 className="mt-3 font-[family-name:var(--font-syne)] text-lg font-bold text-palm-purple-deep">
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

        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:gap-14 md:px-8">
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2rem]">
              <Image
                src="/images/transfers-visual.png"
                alt="Friends using PalmPay together"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 520px"
              />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-palm-purple-deep sm:text-4xl">
                Banking that starts with a smartphone
              </h2>
              <p className="mt-4 text-base leading-relaxed text-palm-muted sm:text-lg">
                Financial inclusion begins with phone ownership. We make it
                easier to get online, get a wallet, and join the digital
                economy — without paperwork or a bank visit.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Affordable smartphone access",
                  "A digital wallet from day one",
                  "Tools that grow with every user",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm font-medium text-palm-purple-deep sm:text-base"
                  >
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-palm-purple text-[10px] font-bold text-white"
                      aria-hidden
                    >
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section-wash py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-palm-purple-deep sm:text-4xl">
              Security comes first
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {security.map((point) => (
                <div
                  key={point.title}
                  className="border-t border-palm-purple/30 pt-5"
                >
                  <h3 className="font-[family-name:var(--font-syne)] text-lg font-bold text-palm-purple-deep">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-palm-muted">
                    {point.body}
                  </p>
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
