import Image from "next/image";

export default function SocialProof() {
  return (
    <section id="newsroom" className="section-wash py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:gap-14 md:px-8">
        <div>
          <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-palm-purple-deep sm:text-4xl">
            A debit card that works
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-palm-purple sm:text-lg">
            Shop online &amp; in-store. Enjoy lower fees and exclusive merchant
            offers.
          </p>
          <a
            href="#download"
            className="mt-8 inline-flex rounded-md bg-palm-purple px-6 py-3.5 text-sm font-bold text-white palm-offset transition hover:bg-palm-purple-bright"
          >
            Transact &amp; earn rewards daily!
          </a>
        </div>

        <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2.5rem]">
          <Image
            src="/images/card-visual.png"
            alt="Paying with a PalmPay debit card at a POS terminal"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 520px"
          />
        </div>
      </div>
    </section>
  );
}
