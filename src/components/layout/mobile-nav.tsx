"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TrendingUp, LayoutDashboard, ArrowLeftRight, LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transações", icon: ArrowLeftRight },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Você saiu da conta");
    router.push("/login");
    router.refresh();
  }

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  const initials = userEmail ? userEmail[0].toUpperCase() : "?";

  return (
    <>
      {/* Top bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-sidebar text-sidebar-foreground border-b border-sidebar-border px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">FinanSee</span>
        </Link>
        <div className="flex items-center gap-1">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-sidebar-accent transition-colors"
              title={resolvedTheme === "dark" ? "Tema claro" : "Tema escuro"}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-sidebar-accent transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setOpen(false)}>
          <div
            className="w-64 h-full bg-sidebar text-sidebar-foreground flex flex-col pt-14"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
              {/* User info */}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                <div className="w-7 h-7 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-sidebar-primary-foreground">{initials}</span>
                </div>
                <span className="text-xs text-sidebar-foreground/70 truncate flex-1">
                  {userEmail ?? "Carregando..."}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
