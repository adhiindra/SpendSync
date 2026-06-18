"use client";

import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Bell, Search, LogOut, User as UserIcon, Sun, Moon, Settings, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlowSyncLogo } from "@/components/ui/flow-sync-logo";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/providers/i18n-provider";
import clsx from "clsx";

export function Header() {
  const { t } = useTranslation("header");
  const { data: session } = useSession();

  const navItems = [
    { name: t("dashboard"), href: "/dashboard" },
    { name: t("transactions"), href: "/transactions" },
    { name: t("reports"), href: "/reports" },
    { name: t("family"), href: "/family" },
  ];
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-4 z-30 mx-4 lg:mx-8 mt-4 flex h-16 shrink-0 items-center justify-between gap-4 rounded-2xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 px-6 backdrop-blur-[32px] shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] transition-colors">
      <div className="flex items-center gap-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <FlowSyncLogo className="h-6 w-6 text-primary" />
                <span>FlowSync</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={clsx(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                      isActive ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/dashboard" className="hidden md:flex items-center gap-2 font-bold tracking-tight text-xl mr-2">
          <FlowSyncLogo className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">FlowSync</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "transition-colors hover:text-foreground",
                  isActive ? "text-foreground font-semibold" : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4">
        {/* <div className="relative w-full max-w-[200px] lg:max-w-[300px] hidden lg:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-full rounded-md border border-input bg-transparent px-9 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div> */}

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        )}
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>
        <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end mr-1">
            <span className="text-sm font-medium leading-none">{session?.user?.name || "User"}</span>
            <span className="text-xs text-muted-foreground mt-1">{session?.user?.email}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger render={<button className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />}>
              <UserIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 md:hidden">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session?.user?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/settings" className="w-full cursor-pointer" />}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t("settings")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/settings"
            className="hidden md:flex p-2 text-muted-foreground hover:text-foreground transition-colors ml-1"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="hidden md:flex p-2 text-muted-foreground hover:text-destructive transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
