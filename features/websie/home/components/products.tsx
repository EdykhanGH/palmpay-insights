import Image from "next/image";

const features = [
  {
    title: "Unlimited Free Transfers",
    body: "Fast, free & reliable transfers to other PalmPay users and banks",
  },
  {
    title: "Up to 20% Savings Interest",
    body: "Earn interest daily, withdraw anytime",
  },
  {
    title: "Cashback on bills & more",
    body: "Get rewarded for your everyday spending",
  },
];

export default function Products() {
  return (
    <section
      id="personal"
      className="section-wash py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-palm-purple-deep sm:text-4xl md:text-[2.75rem]">
            Built For People Going Places
          </h2>
          <p className="mt-3 text-base text-palm-purple sm:text-lg">
            Earn more, save smarter, and level up your life
          </p>
        </div>

        <div className="mt-12 grid items-center gap-10 md:mt-16 md:grid-cols-2 md:gap-14">
          <ul className="space-y-4">
            {features.map((feature) => (
              <li
                key={feature.title}
                className="rounded-2xl bg-palm-purple px-6 py-5 text-center palm-offset sm:px-8 sm:py-6"
              >
                <h3 className="font-[family-name:var(--font-syne)] text-lg font-bold text-white sm:text-xl">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/85">
                  {feature.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="relative mx-auto aspect-[9/10] w-full max-w-md overflow-hidden rounded-[2rem]">
            <Image
              src="/images/people-visual.png"
              alt="Customer holding a PalmPay debit card"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 90vw, 420px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
