const solutions = [
  {
    title: "Pay with Transfer",
    body: "Customers pay into your merchant account in seconds — quick, easy, and secure.",
  },
  {
    title: "POS & in-store",
    body: "Accept card and transfer payments at your counter with PalmPay POS tools.",
  },
  {
    title: "Payin",
    body: "Collect from bank, wallet, card, and USSD — one flow for every channel.",
  },
  {
    title: "Payout",
    body: "Send money to banks and wallets at scale for salaries, refunds, and vendors.",
  },
  {
    title: "Virtual accounts",
    body: "Open multiple accounts to separate sales, branches, or business lines.",
  },
  {
    title: "Agent network",
    body: "Extend your reach with agents who help customers pay and cash out locally.",
  },
];

export default function Solutions() {
  return (
    <section id="solutions" className="section-wash py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-palm-purple-deep sm:text-4xl">
            Ways to accept and move money
          </h2>
          <p className="mt-3 text-base text-palm-purple sm:text-lg">
            Tools built for shops, platforms, and growing businesses
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl bg-white px-6 py-7 shadow-[0_12px_40px_-20px_rgba(45,10,92,0.18)]"
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
  );
}
