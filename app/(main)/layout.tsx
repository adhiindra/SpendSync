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
      <div className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0 z-10 bg-transparent relative">
        <Header />
        <main className="flex-1 px-4 lg:px-8 py-5 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
