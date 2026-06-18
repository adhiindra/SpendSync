import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { OrbBackground } from "@/components/ui/orb-background";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      <OrbBackground />
      <Sidebar />
      <div className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0 z-10 bg-transparent md:pl-64 relative">
        <Header />
        <main className="flex-1 p-4 lg:p-8 pt-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
