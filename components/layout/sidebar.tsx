"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, PieChart, Users, Settings } from "lucide-react";
import { SpendSyncLogo } from "@/components/ui/spend-sync-logo";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Reports", href: "/reports", icon: PieChart },
  { name: "Family", href: "/family", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-sidebar md:flex">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold tracking-tight text-xl">
          <SpendSyncLogo className="h-6 w-6 text-primary" />
          <span>SpendSync</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" 
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border/50 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} SpendSync
      </div>
    </aside>
  );
}
