import { DashboardHeader } from "@/components/layouts/(dashboard)/header";
import { AppSidebar } from "@/components/layouts/(dashboard)/sidebar";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Suspense boundaries let Next prerender the shell while the URL-dependent parts
  // (usePathname, catch-all params) render at request time.
  return (
    <div className="flex h-dvh overflow-hidden bg-white">
      <Suspense fallback={<div className="w-64 shrink-0" />}>
        <AppSidebar />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={<div className="h-16" />}>
          <DashboardHeader />
        </Suspense>
        <main className="flex-1 overflow-auto bg-[#F7F9FC] p-6">
          <Suspense>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
