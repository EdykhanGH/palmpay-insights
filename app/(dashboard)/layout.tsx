import { DashboardHeader } from "@/components/layouts/(dashboard)/header";
import { AppSidebar } from "@/components/layouts/(dashboard)/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh overflow-hidden bg-white">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto bg-[#F7F9FC] p-6">{children}</main>
      </div>
    </div>
  );
}
