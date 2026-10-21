import Logo from "@/components/icons/logo";

const columns = [
  {
    title: "Personal",
    links: [
      { label: "PalmPay App", href: "/personal" },
      { label: "Send and Receive Money", href: "/personal" },
      { label: "Bill Payment", href: "/personal" },
      { label: "Buy and Shop", href: "/personal" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "Payin", href: "/business" },
      { label: "Payout", href: "/business" },
      { label: "POS", href: "/business" },
      { label: "Pay with Transfer", href: "/business" },
      { label: "Business Account Management", href: "/business" },
      { label: "Agent Network", href: "/business" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Blog", href: "/newsroom" },
      { label: "Press and Media", href: "/newsroom" },
      { label: "Contact", href: "/company" },
      { label: "Careers", href: "/company" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/company" },
      { label: "Cookie Policy", href: "/company" },
      { label: "Loan Privacy Policy", href: "/company" },
      { label: "Terms & Conditions", href: "/company" },
      { label: "Complaints", href: "/company" },
    ],
  },
];

const badges = ["CBN", "PCI", "NDIC", "NDPC", "FCCPC"];

export default function SiteFooter() {
  return (
    <footer className="border-t-2 border-palm-purple bg-palm-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_1fr_1fr] md:px-8 md:py-16">
        <div className="space-y-4">
          <Logo tone="light" />
          <ul className="flex flex-col gap-2">
            {badges.map((badge) => (
              <li
                key={badge}
                className="inline-flex w-fit items-center rounded-md bg-white px-3 py-1.5 text-xs font-bold tracking-wide text-palm-ink"
              >
                {badge}
              </li>
            ))}
          </ul>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-sm font-bold tracking-wide text-white">
              {col.title}
            </h3>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/65 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="text-sm text-white/55">
            © 2026 PalmPay. All rights reserved.
          </p>
          <div className="flex items-center gap-3" aria-label="Social links">
            {["IG", "FB", "X", "in"].map((social) => (
              <a
                key={social}
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[10px] font-bold text-palm-ink transition hover:bg-palm-lavender"
                aria-label={social}
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5 pb-10 md:px-8">
          <p className="max-w-5xl text-xs leading-relaxed text-white/45">
            PalmPay is a financial service provided by PalmPay Limited, licensed
            and regulated by the Central Bank of Nigeria (CBN). Deposits are
            insured by the Nigerian Deposit Insurance Corporation (NDIC). Loan
            services on PalmPay are provided by Flexi Microfinance Bank Limited,
            licensed by the Central Bank of Nigeria (CBN). We empower individuals
            and businesses with payments solutions, high-yield investment
            opportunities, and easy-to-use tools for financial management. We are
            a global company with a presence in Nigeria, Ghana, Tanzania, and the
            United Kingdom.
          </p>
        </div>
      </div>
    </footer>
  );
}
