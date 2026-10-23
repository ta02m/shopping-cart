"use client";

import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/store/cart-store";
import { DashboardSidebar } from "./sidebar";

export function DashboardShell({
  children,
  title = "Dashboard",
}: {
  children: ReactNode;
  title?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { itemCount, isLoaded } = useCart();

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex min-h-svh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <DashboardSidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-950">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 md:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Menu className="size-5" />
          </button>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {title}
          </span>

          <Link
            href="/cart"
            className="relative ml-auto flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <ShoppingCart className="size-5" />
            {isLoaded && itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold leading-5 text-white dark:bg-slate-100 dark:text-slate-900">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
