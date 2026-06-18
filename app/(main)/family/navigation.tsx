"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function FamilyNavigation({ hasFamily }: { hasFamily: boolean }) {
  const pathname = usePathname();

  const navItems = hasFamily
    ? [
        { name: "Transactions", href: "/family/transactions" },
        { name: "Reports", href: "/family/reports" },
        { name: "Settings", href: "/family/settings" },
      ]
    : [{ name: "Settings", href: "/family/settings" }];

  return (
    <div className="flex space-x-4 border-b border-border overflow-x-auto pb-px">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
