export default function GetStarted() {
  return (
    <section id="get-started" className="bg-palm-purple py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 text-center md:px-8">
        <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
          Ready to grow with PalmPay Business?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-white/85 sm:text-lg">
          Open a merchant account and start accepting payments today.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/home"
            className="inline-flex rounded-md bg-white px-6 py-3.5 text-sm font-bold text-palm-purple-deep palm-offset transition hover:brightness-95"
          >
            Go to merchant login
          </a>
          <a
            href="/#download"
            className="inline-flex rounded-md border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Download the app
          </a>
        </div>
      </div>
    </section>
  );
}
