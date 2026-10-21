import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-palm-purple-bright">
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-12 md:grid-cols-2 md:gap-8 md:px-8 md:pb-20 md:pt-16">
        <div className="relative z-10 max-w-xl">
          <p className="animate-rise text-sm font-semibold uppercase tracking-[0.14em] text-white/75">
            PalmPay Business
          </p>
          <h1 className="animate-rise-delay-1 mt-3 font-[family-name:var(--font-syne)] text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-[3.2rem]">
            A simpler way to accept payments
          </h1>
          <p className="animate-rise-delay-1 mt-5 max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
            Grow your business with the power of mobile payments. Collect,
            payout, and manage money — in-store and online.
          </p>

          <div className="animate-rise-delay-2 mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#get-started"
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-palm-purple-deep shadow-sm transition hover:brightness-95"
            >
              Open a merchant account
            </a>
            <a
              href="#solutions"
              className="inline-flex rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore solutions
            </a>
          </div>
        </div>

        <div className="animate-rise-delay-2 relative mx-auto w-full max-w-md md:justify-self-end">
          <div className="animate-float-soft relative aspect-[5/4] w-full overflow-hidden rounded-[2rem]">
            <Image
              src="/images/credit-visual.png"
              alt="Merchant accepting PalmPay payments at a shop"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 480px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
