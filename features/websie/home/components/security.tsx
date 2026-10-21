import Image from "next/image";

export default function Security() {
  return (
    <section id="impact" className="section-wash py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:gap-14 md:px-8">
        <div>
          <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-palm-purple-deep sm:text-4xl">
            Stop paying to send money
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-palm-purple-deep/80 sm:text-lg">
            PalmPay gives you{" "}
            <span className="font-semibold text-palm-purple-bright">
              unlimited free bank transfers
            </span>{" "}
            – no daily limits, no hidden fees.
          </p>
          <div className="mt-8 inline-flex rounded-md bg-palm-purple px-5 py-3.5 text-sm font-bold text-white palm-offset sm:text-base">
            99.95% success rate within 10 seconds!
          </div>
        </div>

        <div className="relative aspect-square w-full overflow-hidden rounded-[2.5rem]">
          <Image
            src="/images/transfers-visual.png"
            alt="Friends laughing while sending money on PalmPay"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 480px"
          />
        </div>
      </div>
    </section>
  );
}
