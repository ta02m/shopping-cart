"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, ShoppingBag, ShoppingCart, X } from "lucide-react";

import { useCart } from "@/store/cart-store";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
];

type DashboardSidebarProps = {
  open: boolean;
  onClose: () => void;
};

function NavLinks({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const { itemCount, isLoaded } = useCart();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-2">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
            {isLoaded && item.href === "/cart" && itemCount > 0 && (
              <span className="ml-auto rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/dashboard"
      onClick={onNavigate}
      className="flex items-center gap-2"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
        <ShoppingBag className="size-4" />
      </span>
      <span className="text-sm font-semibold">Store dashboard</span>
    </Link>
  );
}

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <aside
        inert={!open}
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden dark:border-slate-800 dark:bg-slate-900 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <Brand onNavigate={onClose} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>
        <NavLinks onNavigate={onClose} />
        <p className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800">
          Product catalog
        </p>
      </aside>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r border-slate-200 bg-white md:flex dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-14 shrink-0 items-center border-b border-slate-200 px-4 dark:border-slate-800">
          <Brand />
        </div>
        <NavLinks onNavigate={onClose} />
        <p className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800">
          Product catalog
        </p>
      </aside>
    </>
  );
}
