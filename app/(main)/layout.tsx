import { Header } from "@/components/layout/header";
import { OrbBackground } from "@/components/ui/orb-background";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { I18nProvider } from "@/components/providers/i18n-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const language = session?.user?.language || "en";
  const dictionary = await getDictionary(language);

  return (
    <I18nProvider dictionary={dictionary}>
      <div className="flex min-h-screen bg-background relative overflow-hidden">
        <OrbBackground />
        <div className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0 z-10 bg-transparent relative">
          <Header />
          <main className="flex-1 px-4 lg:px-14 py-5 relative">
            {children}
          </main>
        </div>
      </div>
    </I18nProvider>
  );
}
