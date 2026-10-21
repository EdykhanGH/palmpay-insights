"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const titleMap: Record<string, string> = {
  "/home": "Home",
  "/home/finance/balance": "Balance",
  "/home/reconciliation/transaction": "Transaction",
  "/home/reconciliation/statement": "Statement",
  "/home/risk-refunds": "Risk & Refunds",
  "/home/products": "Products List",
  "/home/business/employee": "Employee",
  "/home/business/settlement": "Settlement Accounts",
  "/home/settings/profile": "Profile",
  "/home/settings/email": "Email Notification",
  "/home/settings/security": "Security Service",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const title = titleMap[pathname] ?? "Home";
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const email = "urhomovocollinsrumo@gmail.com";

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-black/[0.06] bg-white px-6">
      <h1 className="text-2xl font-bold text-palm-purple-deep">{title}</h1>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-lg text-palm-muted transition hover:bg-[#F7F9FC] hover:text-palm-purple"
          aria-label="Support"
        >
          <HeadsetIcon />
        </button>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-lg text-palm-muted transition hover:bg-[#F7F9FC] hover:text-palm-purple"
          aria-label="Notifications"
        >
          <BellIcon />
        </button>

        <div className="mx-1 h-6 w-px bg-black/[0.08]" />

        <div ref={rootRef} className="relative">
          <button
            type="button"
            className="inline-flex max-w-[240px] items-center gap-3 rounded-lg py-1.5 pl-1.5 pr-3 text-left transition hover:bg-[#F7F9FC] sm:max-w-none"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-palm-lavender text-sm font-bold text-palm-purple">
              UC
            </span>
            <span className="hidden truncate text-sm font-medium text-palm-purple-deep/85 sm:inline">
              {email}
            </span>
            <ChevronDown className={open ? "rotate-180 transition" : "transition"} />
          </button>

          {open ? (
            <div
              id={menuId}
              role="menu"
              className="absolute right-0 mt-2 min-w-[240px] overflow-hidden rounded-xl border border-black/5 bg-white py-1.5 shadow-[0_12px_40px_rgba(45,10,92,0.12)]"
            >
              <div className="border-b border-black/[0.05] px-4 py-3">
                <p className="text-xs text-palm-muted">Signed in as</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-palm-purple-deep">
                  {email}
                </p>
              </div>
              <Link
                href="/"
                role="menuitem"
                className="block px-4 py-2.5 text-sm font-medium text-palm-purple-deep/90 transition-colors hover:bg-palm-lavender hover:text-palm-purple"
                onClick={() => setOpen(false)}
              >
                Back to website
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function HeadsetIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="size-5"
    >
      <path
        d="M4 13v-1a8 8 0 0 1 16 0v1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M4 13a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1v-5H4ZM20 13h-1v5h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M15 19a3 3 0 0 1-6 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="size-5"
    >
      <path
        d="M6 9.5a6 6 0 1 1 12 0c0 3.2.8 4.4 1.5 5.5H4.5C5.2 13.9 6 12.7 6 9.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M10 18.5a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={`size-4 shrink-0 text-palm-muted ${className ?? ""}`}
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
