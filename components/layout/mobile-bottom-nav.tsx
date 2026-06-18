"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/components/providers/i18n-provider";
import { LayoutDashboard, ReceiptText, PieChart, Users } from "lucide-react";
import clsx from "clsx";

export function MobileBottomNav() {
  const { t } = useTranslation("header");
  const pathname = usePathname();

  const navItems = [
    { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("transactions"), href: "/transactions", icon: ReceiptText },
    { name: t("reports"), href: "/reports", icon: PieChart },
    { name: t("family"), href: "/family", icon: Users },
  ];

  return (
    <div className="lg:hidden sticky bottom-6 mx-auto z-50 w-[92%] max-w-[400px]">
      <nav className="flex items-center justify-between bg-white/50 dark:bg-black/20 backdrop-blur-[32px] border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-[1rem] px-6 py-2.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center gap-1 p-1.5 transition-all",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={clsx("h-[22px] w-[22px]", isActive && "drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-tight mt-0.5">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  );
}
