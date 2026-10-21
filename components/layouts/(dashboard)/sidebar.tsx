"use client";

import Logo from "@/components/icons/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavItem = {
  title: string;
  href?: string;
  icon: "home" | "finance" | "recon" | "risk" | "product" | "business" | "settings";
  children?: { title: string; href: string }[];
};

const navItems: NavItem[] = [
  { title: "Home", href: "/home", icon: "home" },
  {
    title: "Finance",
    icon: "finance",
    children: [{ title: "Balance", href: "/home/finance/balance" }],
  },
  {
    title: "Reconciliation",
    icon: "recon",
    children: [
      { title: "Transaction", href: "/home/reconciliation/transaction" },
      { title: "Statement", href: "/home/reconciliation/statement" },
    ],
  },
  { title: "Risk & Refunds", href: "/home/risk-refunds", icon: "risk" },
  {
    title: "Product Center",
    icon: "product",
    children: [{ title: "Products List", href: "/home/products" }],
  },
  {
    title: "Business Management",
    icon: "business",
    children: [
      { title: "Employee", href: "/home/business/employee" },
      { title: "Settlement Accounts", href: "/home/business/settlement" },
    ],
  },
  {
    title: "Settings",
    icon: "settings",
    children: [
      { title: "Profile", href: "/home/settings/profile" },
      { title: "Email Notification", href: "/home/settings/email" },
      { title: "Security Service", href: "/home/settings/security" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    Finance: true,
    Reconciliation: true,
    "Product Center": true,
    "Business Management": true,
    Settings: true,
  });
  const [copied, setCopied] = useState(false);

  const merchantId = "1";

  function isActive(href: string) {
    if (href === "/home") return pathname === "/home";
    return pathname.startsWith(href);
  }

  function isChildActive(children: { href: string }[]) {
    return children.some((child) => pathname.startsWith(child.href));
  }

  async function copyMerchantId() {
    try {
      await navigator.clipboard.writeText(merchantId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-black/[0.06] bg-white">
      <div className="px-4 pb-6 pt-4">
        <Link href="/home" className="inline-flex items-center gap-2">
          <Logo className="[&>span]:text-xl [&>svg]:h-10 [&>svg]:w-10" />
          <span className="font-[family-name:var(--font-syne)] text-sm font-semibold text-palm-purple">
            Business
          </span>
        </Link>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center gap-3 rounded-lg border border-black/[0.06] bg-[#F7F9FC] px-3 py-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-palm-lavender text-palm-purple">
            <MerchantIcon />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-palm-muted">Merchant ID</p>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-palm-purple-deep">
                {merchantId}
              </p>
              <button
                type="button"
                onClick={copyMerchantId}
                className="shrink-0 text-palm-muted transition hover:text-palm-purple"
                aria-label={copied ? "Copied" : "Copy merchant ID"}
              >
                <CopyIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6" aria-label="Business">
        <ul className="space-y-1">
          {navItems.map((item) => {
            if (!item.children) {
              const active = item.href ? isActive(item.href) : false;
              return (
                <li key={item.title}>
                  <Link
                    href={item.href!}
                    className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition ${
                      active
                        ? "bg-[#efe8ff] font-semibold text-palm-purple"
                        : "font-medium text-palm-purple-deep/70 hover:bg-[#F7F9FC] hover:text-palm-purple-deep"
                    }`}
                  >
                    <NavIcon name={item.icon} active={active} />
                    {item.title}
                  </Link>
                </li>
              );
            }

            const open = openMenus[item.title] ?? false;
            const childActive = isChildActive(item.children);

            return (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenus((prev) => ({
                      ...prev,
                      [item.title]: !prev[item.title],
                    }))
                  }
                  className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm transition ${
                    childActive
                      ? "font-semibold text-palm-purple"
                      : "font-medium text-palm-purple-deep/70 hover:bg-[#F7F9FC] hover:text-palm-purple-deep"
                  }`}
                  aria-expanded={open}
                >
                  <NavIcon name={item.icon} active={childActive} />
                  <span className="flex-1 text-left">{item.title}</span>
                  <ChevronIcon open={open} />
                </button>
                {open ? (
                  <ul className="ml-5 space-y-1 border-l border-black/[0.06] py-1 pl-3">
                    {item.children.map((child) => {
                      const active = isActive(child.href);
                      return (
                        <li key={child.title}>
                          <Link
                            href={child.href}
                            className={`flex h-9 items-center rounded-md px-3 text-sm transition ${
                              active
                                ? "bg-[#efe8ff] font-semibold text-palm-purple"
                                : "font-medium text-palm-purple-deep/65 hover:bg-[#F7F9FC] hover:text-palm-purple-deep"
                            }`}
                          >
                            {child.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

function NavIcon({
  name,
  active,
}: {
  name: NavItem["icon"];
  active?: boolean;
}) {
  const stroke = active ? "#6C2BD9" : "#5b4a78";
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "size-5 shrink-0",
  };

  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
        </svg>
      );
    case "finance":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h18M8 14h4" />
        </svg>
      );
    case "recon":
      return (
        <svg {...common}>
          <path d="M8 7h11M8 12h11M8 17h7" />
          <path d="M4 7h.01M4 12h.01M4 17h.01" />
        </svg>
      );
    case "risk":
      return (
        <svg {...common}>
          <path d="M12 3 20 7v5c0 5-3.4 8.4-8 9-4.6-.6-8-4-8-9V7l8-4Z" />
          <path d="M12 8v5M12 16h.01" />
        </svg>
      );
    case "product":
      return (
        <svg {...common}>
          <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
          <path d="M12 12 20 7.5M12 12v9M12 12 4 7.5" />
        </svg>
      );
    case "business":
      return (
        <svg {...common}>
          <path d="M4 20V8.5L12 4l8 4.5V20" />
          <path d="M9 20v-6h6v6M4 20h16" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v2.2M12 18.8V21M4.9 6.3l1.6 1.5M17.5 16.2l1.6 1.5M3 12h2.2M18.8 12H21M4.9 17.7l1.6-1.5M17.5 7.8l1.6-1.5" />
        </svg>
      );
  }
}

function MerchantIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20V9l8-5 8 5v11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 20v-5h6v5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="8"
        y="8"
        width="12"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={`size-4 text-palm-muted transition ${open ? "rotate-90" : ""}`}
    >
      <path
        d="M4.5 2.5 8 6l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
