"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CircleAlert, RefreshCw } from "lucide-react";

import { DashboardShell } from "@/app/dashboard/shell";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <DashboardShell title="Product details">
      <div
        role="alert"
        className="mx-auto max-w-md rounded-xl border border-red-200 bg-white px-6 py-10 text-center dark:border-red-900/60 dark:bg-slate-900"
      >
        <CircleAlert className="mx-auto size-8 text-red-500" />
        <h1 className="mt-4 text-lg font-semibold">
          Couldn&apos;t load this product
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Something went wrong while fetching the product. Please try again.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center rounded-lg border border-slate-200 px-4 text-sm font-medium transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Back to products
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
