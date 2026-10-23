"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";
import {
  ArrowDownWideNarrow,
  CircleAlert,
  RefreshCw,
  Search,
  Star,
} from "lucide-react";
import { cn } from "cn";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SKELETON_CARDS } from "../constants";
import { DashboardShell } from "./shell";
import useDebounce from "@/hooks/use-debounce";

export type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
  stock: number;
  brand?: string;
  discountPercentage: number;
};

interface TProps {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const ALL_CATEGORIES = "All products";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "rating", label: "Rating: high to low" },
];

interface SelectOption {
  value: string;
  label: string;
}

function FilterSelect({
  value,
  onValueChange,
  options,
  disabled,
  icon,
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SelectOption[];
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "h-10 gap-2 border-slate-200 bg-transparent px-3 text-slate-700 dark:border-slate-700 dark:bg-transparent dark:text-slate-200",
          className,
        )}
      >
        {icon}
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      {value.toFixed(1)}
      <span className="font-normal text-slate-400">/ 5</span>
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition group-hover:border-slate-300 group-hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:group-hover:border-slate-700">
      <Link
        href={`/products/${product.id}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-400"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 dark:bg-slate-800/60">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="object-contain p-5"
          />
          {product.discountPercentage > 0 && (
            <span className="absolute top-2 left-2 rounded bg-white px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-950 dark:text-slate-200">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
        </div>
        <div className="px-3 pt-3 sm:px-4 sm:pt-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="truncate text-xs capitalize text-slate-500">
              {product.category.replace(/-/g, " ")}
            </span>
            <Rating value={product.rating} />
          </div>
          <h2 className="min-h-10 text-sm leading-5 font-medium text-slate-800 dark:text-slate-100">
            {product.title}
          </h2>
        </div>
      </Link>
      <div className="mt-auto flex items-end justify-between gap-2 border-t border-slate-100 px-3 py-3 sm:px-4 dark:border-slate-800">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">
            {currency.format(product.price)}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {product.stock} in stock
          </p>
        </div>
        <AddToCartButton product={product} compact />
      </div>
    </article>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-gray-100 dark:border-slate-800 dark:bg-slate-900">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="mt-1.5 h-4 w-3/5" />
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div
      className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      role="status"
    >
      {Array.from({ length: SKELETON_CARDS }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
      <span className="sr-only">Loading products...</span>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="mt-4 flex flex-col items-center rounded-xl border border-red-200 bg-white px-6 py-12 text-center dark:border-red-900/50 dark:bg-slate-900"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
        <CircleAlert className="size-5" />
      </span>
      <h2 className="mt-4 font-medium">Couldn&apos;t load products</h2>
      <p className="mt-1 max-w-md text-sm text-slate-500">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        <RefreshCw className="size-4" />
        Try again
      </button>
    </div>
  );
}

export default function AllProducts({
  products,
  total,
  loading,
  error,
  onRetry,
}: TProps) {
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("featured");
  const controlsDisabled = loading || error !== null;

  const debouncedQuery = useDebounce(query, 500);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products],
  );

  const categoryOptions = useMemo<SelectOption[]>(
    () => [
      { value: ALL_CATEGORIES, label: "All categories" },
      ...categories.map((item) => ({
        value: item,
        label: item,
      })),
    ],
    [categories],
  );

  const filtered = useMemo(() => {
    const min = minPrice === "" ? 0 : Number(minPrice);
    const max = maxPrice === "" ? Number.POSITIVE_INFINITY : Number(maxPrice);

    const result = products.filter(
      (product) =>
        (category === ALL_CATEGORIES || product.category === category) &&
        product.price >= min &&
        product.price <= max &&
        `${product.title} ${product.category} ${product.brand ?? ""}`
          .toLowerCase()
          .includes(debouncedQuery.toLowerCase().trim()),
    );

    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [category, debouncedQuery, maxPrice, minPrice, products, sort]);

  return (
    <DashboardShell>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse the product catalog.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          {loading
            ? "Loading products..."
            : error
              ? "Products unavailable"
              : `${total} products`}
        </p>
      </div>

      <div className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-3 lg:grid-cols-[minmax(220px,1fr)_auto] lg:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            disabled={controlsDisabled}
            placeholder="Search products..."
            className="h-10 w-full pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 dark:text-slate-200"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 lg:justify-end">
          <div className="flex flex-wrap gap-2">
            <FilterSelect
              value={category}
              onValueChange={setCategory}
              options={categoryOptions}
              disabled={controlsDisabled}
              className="w-[150px] capitalize"
            />
            <div className="flex h-10 items-center gap-1 rounded-lg border border-slate-200 px-2 text-sm dark:border-slate-700">
              <span className="text-slate-400">$</span>
              <Input
                type="number"
                min={0}
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                disabled={controlsDisabled}
                placeholder="Min"
                className="h-8 w-14 border-0 bg-transparent px-1 text-center text-slate-700 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-slate-200"
              />
              <span className="text-slate-300 dark:text-slate-600">–</span>
              <span className="text-slate-400">$</span>
              <Input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                disabled={controlsDisabled}
                placeholder="Max"
                className="h-8 w-14 border-0 bg-transparent px-1 text-center text-slate-700 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-slate-200"
              />
            </div>
            <FilterSelect
              value={sort}
              onValueChange={setSort}
              options={SORT_OPTIONS}
              disabled={controlsDisabled}
              icon={<ArrowDownWideNarrow className="size-4 text-slate-500" />}
              className="w-[190px]"
            />
          </div>
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : loading ? (
        <ProductGridSkeleton />
      ) : !filtered.length ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-medium">No products found.</h2>
          <p className="mt-1 text-sm text-slate-500">
            Try another search or choose a different category.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
