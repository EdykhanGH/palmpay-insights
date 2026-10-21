import Image from "next/image";

export default function Spotlight() {
  return (
    <section className="section-wash py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:gap-14 md:px-8">
        <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2rem]">
          <Image
            src="/images/card-visual.png"
            alt="Customer paying at a POS with PalmPay"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 520px"
          />
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-palm-purple-deep sm:text-4xl">
            Payments that keep your counter moving
          </h2>
          <p className="mt-4 text-base leading-relaxed text-palm-purple sm:text-lg">
            From Pay with Transfer posters to POS and online collections —
            PalmPay Business helps you get paid faster with less friction.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Instant settlement visibility",
              "Clear fees and transparent pricing",
              "Tools for shops and digital merchants",
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
  );
}
