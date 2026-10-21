import SiteFooter from "@/components/layouts/(marketing)/site-footer";
import SiteHeader from "@/components/layouts/(marketing)/site-header";
import Image from "next/image";

const stories = [
  {
    category: "Product",
    title: "Unlimited free transfers for everyday banking",
    date: "Mar 2026",
    body: "PalmPay continues to remove friction from sending money — free, fast, and reliable.",
  },
  {
    category: "Company",
    title: "Expanding roles across Nigeria and beyond",
    date: "Aug 2026",
    body: "We’re hiring across sales, risk, product, and leadership as we scale new markets.",
  },
  {
    category: "Impact",
    title: "Smartphone financing opens digital access",
    date: "Jan 2026",
    body: "Hundreds of thousands of first-time users get a phone — and a wallet — ready to go.",
  },
  {
    category: "Business",
    title: "Pay with Transfer for merchants",
    date: "Nov 2025",
    body: "Shops accept payments faster with merchant accounts and in-store posters.",
  },
];

const reviews = [
  {
    name: "Anna",
    date: "Aug 2025",
    text: "One of the best banking apps at the moment. Quick transactions, PalmPoints, and rewards that actually matter.",
  },
  {
    name: "Chidi",
    date: "Jul 2025",
    text: "Free transfers changed how I move money. CashBox interest is solid and support actually replies.",
  },
  {
    name: "Fatima",
    date: "Jun 2025",
    text: "Bills, data, and savings in one place. Clean app, fast payouts — exactly what I needed.",
  },
];

export default function NewsroomPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-palm-purple-bright">
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:gap-12 md:px-8 md:py-24">
            <div>
              <p className="animate-rise text-sm font-semibold uppercase tracking-[0.14em] text-white/75">
                Newsroom
              </p>
              <h1 className="animate-rise-delay-1 mt-3 font-[family-name:var(--font-syne)] text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-[3.2rem]">
                Stories, updates, and what&apos;s next
              </h1>
              <p className="animate-rise-delay-1 mt-5 max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
                Press notes, product launches, and community stories from across
                PalmPay.
              </p>
            </div>
            <div className="animate-rise-delay-2 relative aspect-[5/4] w-full overflow-hidden rounded-[2rem]">
              <Image
                src="/images/card-visual.png"
                alt="PalmPay card in use"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 520px"
              />
            </div>
          </div>
        </section>

        <section className="section-wash py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-palm-purple-deep sm:text-4xl">
              Latest updates
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {stories.map((story) => (
                <article
                  key={story.title}
                  className="rounded-2xl bg-white px-6 py-7 shadow-[0_12px_40px_-20px_rgba(45,10,92,0.18)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-palm-purple">
                      {story.category}
                    </span>
                    <time className="text-xs text-palm-muted">{story.date}</time>
                  </div>
                  <h3 className="mt-3 font-[family-name:var(--font-syne)] text-xl font-bold text-palm-purple-deep">
                    {story.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-palm-muted">
                    {story.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-palm-purple-deep sm:text-4xl">
                  Loved by 40 million users
                </h2>
                <p className="mt-3 max-w-lg text-base text-palm-muted sm:text-lg">
                  Highest-rated fintech app in Africa — 4.6★ on Google Play.
                </p>
              </div>
              <p className="font-[family-name:var(--font-syne)] text-5xl font-extrabold text-palm-purple">
                4.6
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {reviews.map((review) => (
                <blockquote
                  key={review.name}
                  className="rounded-2xl bg-palm-lavender px-6 py-6"
                >
                  <p className="text-sm leading-relaxed text-palm-purple-deep/90">
                    {review.text}
                  </p>
                  <footer className="mt-5 text-xs text-palm-muted">
                    <span className="font-semibold text-palm-purple-deep">
                      {review.name}
                    </span>
                    {" · "}
                    {review.date}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
