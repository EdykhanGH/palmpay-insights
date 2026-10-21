import Image from "next/image";

const features = [
  {
    title: "Multi Currency Balances",
    description:
      "Initiate a multi-currency online corporate collection platform for global transactions.",
    icon: "globe" as const,
  },
  {
    title: "Global Collection",
    description:
      "Quickly integrate mainstream Payment method for business development.",
    icon: "card" as const,
  },
  {
    title: "Unified Access API",
    description: "A set of API access to achieve multi country collection.",
    icon: "gear" as const,
  },
];

const countries = [
  { name: "Nigeria", code: "NG", colors: ["#008751", "#fff", "#008751"] },
  { name: "Ghana", code: "GH", colors: ["#ce1126", "#fcd116", "#006b3f"] },
  { name: "Tanzania", code: "TZ", colors: ["#1eb53a", "#00a3dd", "#fcd116"] },
  { name: "South Africa", code: "ZA", colors: ["#007749", "#de3831", "#002395"] },
  { name: "Kenya", code: "KE", colors: ["#000", "#bb0000", "#006600"] },
  { name: "Côte d'Ivoire", code: "CI", colors: ["#f77f00", "#fff", "#009e60"] },
  { name: "Senegal", code: "SN", colors: ["#00853f", "#fdef42", "#e31b23"] },
  { name: "Pakistan", code: "PK", colors: ["#01411C", "#fff", "#01411C"] },
];

export default function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#F2F2F2] bg-white p-6 md:p-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between md:gap-10">
          <div className="w-full max-w-xl shrink-0 md:w-auto">
            <h2 className="text-2xl font-bold tracking-tight text-palm-purple-deep">
              Activate your balance to start receiving payments
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-palm-muted md:text-base">
              Start the activation process by providing your identity and
              business documents
            </p>
            <button
              type="button"
              className="mt-6 inline-flex h-10 items-center rounded-lg bg-palm-purple px-5 text-sm font-semibold text-white transition hover:bg-palm-purple-bright"
            >
              Activate Balance
            </button>
          </div>

          <div className="relative aspect-square w-full max-w-56 shrink-0 overflow-hidden rounded-2xl md:ml-auto md:max-w-64">
            <Image
              src="/images/activate-visual.png"
              alt="PalmPay app with a happy customer"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 224px, 256px"
              priority
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-[#F2F2F2] bg-white p-5"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#F0F2F5] text-palm-purple-deep">
              <FeatureIcon name={feature.icon} />
            </div>
            <h3 className="mt-4 text-base font-bold text-palm-purple-deep">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-palm-muted">
              {feature.description}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-[#F2F2F2] bg-white p-6 md:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-palm-purple-deep">
          Supported Countries
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-palm-muted md:text-base">
          It will hold balance accounts in multiple currencies at the same time,
          supporting global collection and payment capabilities
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-8">
          {countries.map((country) => (
            <li
              key={country.code}
              className="flex flex-col items-center gap-3 text-center"
            >
              <CountryFlag name={country.name} colors={country.colors} />
              <span className="text-sm font-medium text-palm-purple-deep/80">
                {country.name}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function FeatureIcon({ name }: { name: "globe" | "card" | "gear" }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "size-5",
  };

  if (name === "globe") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9S14.5 18.2 12 21c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3Z" />
      </svg>
    );
  }

  if (name === "card") {
    return (
      <svg {...common}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18M7 14h4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.2M12 18.8V21M4.9 6.3l1.6 1.5M17.5 16.2l1.6 1.5M3 12h2.2M18.8 12H21M4.9 17.7l1.6-1.5M17.5 7.8l1.6-1.5" />
    </svg>
  );
}

function CountryFlag({
  name,
  colors,
}: {
  name: string;
  colors: string[];
}) {
  return (
    <span
      className="relative flex size-14 items-center justify-center overflow-hidden rounded-full border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
      aria-label={name}
      title={name}
    >
      <span
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${colors[0]} 0 33.33%, ${colors[1]} 33.33% 66.66%, ${colors[2]} 66.66% 100%)`,
        }}
      />
    </span>
  );
}
