const steps = [
  {
    step: "01",
    title: "Download the app",
    body: "Get the PalmPay App or PalmPay Business App and create your Merchant Account.",
  },
  {
    step: "02",
    title: "Display your poster",
    body: "Paste the PalmPay brand-mark poster with your Merchant Account in store.",
  },
  {
    step: "03",
    title: "Get paid with PalmPay",
    body: "Ask customers to enter your Merchant Account — money lands instantly.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-palm-purple-deep sm:text-4xl">
            It&apos;s easy to get your own account
          </h2>
          <p className="mt-3 text-base text-palm-muted sm:text-lg">
            Three steps to start accepting Pay with Transfer in your shop
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <li key={item.step} className="relative">
              <span className="font-[family-name:var(--font-syne)] text-4xl font-extrabold text-palm-lavender">
                {item.step}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-syne)] text-xl font-bold text-palm-purple-deep">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-palm-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
