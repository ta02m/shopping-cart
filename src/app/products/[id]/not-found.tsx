import Link from "next/link";
import { PackageX } from "lucide-react";

import { DashboardShell } from "@/app/dashboard/shell";

export default function ProductNotFound() {
  return (
    <DashboardShell title="Product details">
      <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <PackageX className="mx-auto size-8 text-slate-400" />
        <h1 className="mt-4 text-lg font-semibold">Product not found</h1>
        <p className="mt-1 text-sm text-slate-500">
          The product you&apos;re looking for doesn&apos;t exist or is no
          longer available.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Back to products
        </Link>
      </div>
    </DashboardShell>
  );
}
