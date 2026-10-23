"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { DashboardShell } from "@/app/dashboard/shell";
import { Skeleton } from "@/components/ui/skeleton";
import {  useCart, type CartItem } from "@/store/cart-store";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function itemLabel(count: number) {
  return `${count} ${count === 1 ? "item" : "items"}`;
}

function CartLine({
  item,
  onRemove,
  onQuantityChange,
}: {
  item: CartItem;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}) {
  const lineTotal = item.price * item.quantity;
  const atStockLimit = item.quantity >= item.stock;

  return (
    <li className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:gap-4 sm:p-4 dark:border-slate-800 dark:bg-slate-900">
      <Link
        href={`/products/${item.id}`}
        className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:size-24 dark:border-slate-800 dark:bg-slate-950"
      >
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          sizes="96px"
          className="object-contain p-2"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${item.id}`}
              className="line-clamp-2 text-sm font-medium text-slate-900 hover:underline sm:text-base dark:text-slate-100"
            >
              {item.title}
            </Link>
            <p className="mt-1 text-sm text-slate-500">
              {currency.format(item.price)} each
            </p>
            {atStockLimit && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                Maximum available quantity reached
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex h-9 items-center rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => onQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="flex size-8 items-center justify-center rounded-l-lg text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Minus className="size-3.5" />
            </button>
            <span
              className="w-8 text-center text-sm font-medium tabular-nums"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.quantity + 1)}
              disabled={atStockLimit}
              className="flex size-8 items-center justify-center rounded-r-lg text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          <p className="text-sm font-semibold sm:text-base">
            {currency.format(lineTotal)}
          </p>
        </div>
      </div>
    </li>
  );
}

function CartSkeleton() {
  return (
    <div
      className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start"
      role="status"
    >
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <Skeleton className="size-24 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <Skeleton className="h-5 w-32" />
        <div className="mt-5 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      </div>
      <span className="sr-only">Loading cart...</span>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="mt-6 flex flex-col items-center rounded-xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
      <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <ShoppingBag className="size-6" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">Your cart is empty</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Browse the catalog and add products to see them here.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex h-10 items-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Browse products
      </Link>
    </div>
  );
}

function OrderSummary({
  itemCount,
  total,
}: {
  itemCount: number;
  total: number;
}) {
  return (
    <aside
      className="rounded-xl border border-slate-200 bg-white p-5 lg:sticky lg:top-20 dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 id="order-summary-heading" className="text-base font-semibold">
        Order summary
      </h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">
            Subtotal ({itemLabel(itemCount)})
          </dt>
          <dd className="font-medium">{currency.format(total)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">Shipping</dt>
          <dd className="font-medium text-emerald-600 dark:text-emerald-400">
            Free
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3 text-base dark:border-slate-700">
          <dt className="font-semibold">Total</dt>
          <dd className="font-bold">{currency.format(total)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-slate-500">
        The total updates automatically as you change quantities.
      </p>
    </aside>
  );
}

export function CartView() {
  const {
    items,
    itemCount,
    total,
    isLoaded,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  return (
    <DashboardShell title="Shopping cart">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Continue shopping
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Shopping cart
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {!isLoaded
              ? "Loading your cart..."
              : items.length
                ? `${itemLabel(itemCount)} · ${currency.format(total)} total`
                : "Your cart is empty."}
          </p>
        </div>

        {isLoaded && items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          >
            <Trash2 className="size-4" />
            Clear cart
          </button>
        )}
      </div>

      {!isLoaded ? (
        <CartSkeleton />
      ) : items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <ul className="space-y-3">
            {items?.map((item) => (
              <CartLine
                key={item.id}
                item={item}
                onRemove={() => removeItem(item.id)}
                onQuantityChange={(quantity) =>
                  updateQuantity(item.id, quantity)
                }
              />
            ))}
          </ul>
          <OrderSummary itemCount={itemCount} total={total} />
        </div>
      )}
    </DashboardShell>
  );
}
