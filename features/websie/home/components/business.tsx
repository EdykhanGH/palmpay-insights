import Image from "next/image";

export default function Business() {
  return (
    <section id="business" className="section-wash py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:gap-14 md:px-8">
        <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2rem]">
          <Image
            src="/images/credit-visual.png"
            alt="Business owner checking PalmPay on her phone at a market stall"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 520px"
          />
        </div>

        <div className="md:text-right">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-palm-purple-deep sm:text-4xl">
            Get credit when you need it
          </h2>
          <p className="mt-4 text-base leading-relaxed text-palm-purple sm:text-lg">
            With instant approval and transparent pricing, credit on PalmPay
            helps you move forward.
          </p>
          <a
            href="#download"
            className="mt-8 inline-flex rounded-md bg-palm-purple px-6 py-3.5 text-sm font-bold text-white palm-offset transition hover:bg-palm-purple-bright"
          >
            Fuel your next move
          </a>
        </div>
      </div>
    </section>
  );
}
