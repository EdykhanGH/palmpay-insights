"use client";

import Logo from "@/components/icons/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const links = [
  { label: "Company", href: "/company" },
  { label: "Personal", href: "/personal" },
  { label: "Business", href: "/business" },
  { label: "Impact", href: "/impact" },
  { label: "Newsroom", href: "/newsroom" },
];

const loginOptions = [
  { label: "Personal Account", href: "/personal" },
  { label: "Business Account", href: "/home" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" aria-label="PalmPay home" className="shrink-0">
          <Logo />
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Primary"
        >
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] font-medium transition-colors hover:text-palm-purple ${
                  active
                    ? "text-palm-purple"
                    : "text-palm-purple-deep/85"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <LoginMenu />
          <button
            type="button"
            className="hidden items-center gap-2 rounded-full bg-[#f0eef5] px-3.5 py-2 text-sm font-medium text-palm-purple-deep sm:inline-flex"
            aria-label="Select region: Nigeria"
          >
            <NigeriaFlag />
            <span>Nigeria</span>
            <ChevronDown />
          </button>
        </div>
      </div>
    </header>
  );
}

function LoginMenu() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

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
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full bg-palm-purple px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-palm-purple-bright"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
      >
        Log In
        <ChevronDown className={open ? "rotate-180 transition" : "transition"} />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Account type"
          className="absolute right-0 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-black/5 bg-white py-1.5 shadow-[0_12px_40px_rgba(45,10,92,0.12)]"
        >
          {loginOptions.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              role="menuitem"
              className="block px-4 py-2.5 text-sm font-medium text-palm-purple-deep/90 transition-colors hover:bg-palm-lavender hover:text-palm-purple"
              onClick={() => setOpen(false)}
            >
              {option.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function NigeriaFlag() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden>
      <rect width="6" height="12" fill="#008751" />
      <rect x="6" width="6" height="12" fill="#fff" />
      <rect x="12" width="6" height="12" fill="#008751" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
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
