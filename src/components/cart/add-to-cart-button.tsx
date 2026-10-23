"use client";

import { useEffect, useState } from "react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";

import { useCart, type CartProduct } from "@/store/cart-store";

export function AddToCartButton({
  product,
  compact = false,
}: {
  product: CartProduct;
  compact?: boolean;
}) {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = items.find((item) => item.id === product.id)?.quantity ?? 0;
  const remaining = Math.max(0, product.stock - inCart);
  const selected = Math.min(quantity, Math.max(1, remaining));
  const soldOut = product.stock <= 0;
  const atLimit = remaining <= 0;

  const handleAdd = () => {
    if (atLimit) return;

    addItem(product, selected);
    setAdded(true);
  };

  useEffect(() => {
    if (!added) return;

    const timeout = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(timeout);
  }, [added]);

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        disabled={soldOut || atLimit}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 text-xs font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
      >
        {added ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
        {soldOut ? "Sold out" : added ? "Added" : atLimit ? "Max" : "Add"}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {!soldOut && !atLimit && (
        <div className="flex h-11 w-fit items-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={() =>
              setQuantity((current) =>
                Math.max(1, Math.min(current, remaining) - 1),
              )
            }
            disabled={selected <= 1}
            className="flex size-10 items-center justify-center rounded-l-lg text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-9 text-center text-sm font-medium tabular-nums">
            {selected}
          </span>
          <button
            type="button"
            onClick={() =>
              setQuantity((current) =>
                Math.min(Math.max(1, remaining), current + 1),
              )
            }
            disabled={selected >= remaining}
            className="flex size-10 items-center justify-center rounded-r-lg text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Plus className="size-4" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={soldOut || atLimit}
        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
      >
        {added ? (
          <Check className="size-4" />
        ) : (
          <ShoppingCart className="size-4" />
        )}
        {soldOut
          ? "Out of stock"
          : added
            ? "Added to cart"
            : atLimit
              ? "Maximum in cart"
              : "Add to cart"}
      </button>
    </div>
  );
}
