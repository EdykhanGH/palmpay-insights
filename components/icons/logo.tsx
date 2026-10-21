export default function Logo({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const text = tone === "light" ? "text-white" : "text-palm-purple-deep";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="36" height="36" rx="8" fill="#6C2BD9" />
        <path
          d="M12 12h6.2c3.1 0 5.1 1.7 5.1 4.4 0 1.8-.9 3.1-2.4 3.8L24 24h-3.4l-2.9-3.5H15.2V24H12V12zm3.2 2.5v4.2h2.7c1.5 0 2.4-.8 2.4-2.1s-.9-2.1-2.4-2.1h-2.7z"
          fill="white"
        />
      </svg>
      <span
        className={`font-[family-name:var(--font-syne)] text-xl font-bold tracking-tight ${text}`}
      >
        PalmPay
      </span>
    </span>
  );
}
