import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-palm-purple-bright">
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 pb-14 pt-10 md:grid-cols-[1.05fr_0.95fr] md:gap-6 md:px-8 md:pb-16 md:pt-14">
        <div className="relative z-10 max-w-xl">
          <h1 className="animate-rise font-[family-name:var(--font-syne)] text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.22)] sm:text-5xl md:text-[3.55rem]">
            The Smarter Way
            <br />
            to Bank is Here
          </h1>

          <p className="animate-rise-delay-1 mt-5 max-w-md text-base leading-relaxed text-white/95 sm:text-lg">
            Tools to help you pay, earn, save and grow – all in one app
          </p>

          <div
            id="download"
            className="animate-rise-delay-2 mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="https://play.google.com/store/apps/details?id=com.transsnet.palmpay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl bg-white px-4 py-2.5 text-palm-ink shadow-sm transition hover:brightness-95"
            >
              <PlayBadge />
              <span className="flex flex-col leading-none">
                <span className="text-[9px] font-medium uppercase tracking-wide opacity-70">
                  Get it on
                </span>
                <span className="text-sm font-bold">Google Play</span>
              </span>
            </a>
            <a
              href="https://bit.ly/DownloadPalmPay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl bg-white px-4 py-2.5 text-palm-ink shadow-sm transition hover:brightness-95"
            >
              <AppleBadge />
              <span className="flex flex-col leading-none">
                <span className="text-[9px] font-medium tracking-wide opacity-70">
                  Download on the
                </span>
                <span className="text-sm font-bold">App Store</span>
              </span>
            </a>
          </div>

          <div className="animate-rise-delay-2 mt-8 flex flex-wrap items-center gap-6 text-white">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <CbnMark />
              <span>Licensed by the CBN</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <NdicMark />
              <span>Deposits insured by NDIC</span>
            </div>
          </div>
        </div>

        <div className="animate-rise-delay-2 relative mx-auto w-full max-w-md md:justify-self-end">
          <div className="animate-float-soft relative mx-auto aspect-square w-full overflow-hidden md:max-w-md">
            <Image
              src="/images/hero-visual.png"
              alt="PalmPay app on a phone with a happy customer"
              fill
              priority
              className="object-cover object-center drop-shadow-[0_24px_48px_rgba(0,0,0,0.28)]"
              sizes="(max-width: 768px) 90vw, 448px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function PlayBadge() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M3.6 2.7c-.4.2-.6.6-.6 1.1v16.4c0 .5.2.9.6 1.1l9.7-9.3L3.6 2.7z"
        fill="#34A853"
      />
      <path
        d="M14.9 9.1 6.2 3.4l10.5 6 1.8-1-.1-.1-3.5.8z"
        fill="#FBBC04"
      />
      <path
        d="M18.3 9.5l-1.9 1.1 1.9 1.1 3.2-1.8c.5-.3.5-.9 0-1.2l-3.2.8z"
        fill="#EA4335"
      />
      <path
        d="M14.9 14.7l1.9 1.1 3.5-.8.1-.1-1.8-1-3.7.8zM6.2 20.6l8.7-5.7-1.9-1.1-6.8 6.8z"
        fill="#4285F4"
      />
    </svg>
  );
}

function AppleBadge() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#111" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function CbnMark() {
  return (
    <span
      className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm"
      aria-hidden
    >
      <svg viewBox="0 0 40 40" className="h-8 w-8">
        <circle cx="20" cy="20" r="18" fill="#0B3D2E" />
        <circle cx="20" cy="20" r="14" fill="none" stroke="#C9A227" strokeWidth="1.5" />
        <text
          x="20"
          y="17"
          textAnchor="middle"
          fill="#C9A227"
          fontSize="6"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          CBN
        </text>
        <path
          d="M12 22c2-3 4.5-4.5 8-4.5S26 19 28 22"
          fill="none"
          stroke="#F5F5F5"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="20" cy="24.5" r="1.6" fill="#C9A227" />
      </svg>
    </span>
  );
}

function NdicMark() {
  return (
    <span
      className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm"
      aria-hidden
    >
      <svg viewBox="0 0 40 40" className="h-8 w-8">
        <circle cx="20" cy="20" r="18" fill="#1B4F9C" />
        <path
          d="M20 8.5 29 13.2v6.2c0 6.1-3.7 10.2-9 12.1-5.3-1.9-9-6-9-12.1v-6.2L20 8.5z"
          fill="#F5C518"
        />
        <path
          d="M20 11.2 26.2 14.4v4.6c0 4.4-2.6 7.3-6.2 8.8-3.6-1.5-6.2-4.4-6.2-8.8v-4.6L20 11.2z"
          fill="#1B4F9C"
        />
        <text
          x="20"
          y="22"
          textAnchor="middle"
          fill="#fff"
          fontSize="5.5"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
        >
          NDIC
        </text>
      </svg>
    </span>
  );
}
