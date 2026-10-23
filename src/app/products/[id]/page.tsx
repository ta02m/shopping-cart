import axios from "axios";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";

import { PRODUCTS_URL } from "@/app/constants";
import { DashboardShell } from "@/app/dashboard/shell";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductGallery } from "./product-gallery";

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  minimumOrderQuantity: number;
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;
  availabilityStatus?: string;
  images: string[];
  thumbnail: string;
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const getProduct = cache(async (id: string): Promise<Product | null> => {
  try {
    const { data } = await axios.get<Product>(`${PRODUCTS_URL}/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
});

function availabilityClasses(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("out")) {
    return "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400";
  }

  if (normalized.includes("low")) {
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400";
  }

  return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400";
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const images = product.images.length ? product.images : [product.thumbnail];
  const availability =
    product.availabilityStatus ??
    (product.stock > 0 ? "In Stock" : "Out of Stock");
  const originalPrice =
    product.discountPercentage > 0
      ? product.price / (1 - product.discountPercentage / 100)
      : null;

  return (
    <DashboardShell title="Product details">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={images} title={product.title} />

        <div>
          <span className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 capitalize dark:bg-slate-800 dark:text-slate-300">
            {product.category.replace(/-/g, " ")}
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {product.title}
          </h1>

          {product.brand && (
            <p className="mt-2 text-sm text-slate-500">by {product.brand}</p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className={`size-4 ${
                    index < Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold">
              {product.rating.toFixed(2)}
            </span>
            <span className="text-sm text-slate-500">
              ({product.reviews.length} reviews)
            </span>
            <span className="sr-only">
              Rated {product.rating.toFixed(2)} out of 5
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold">
              {currency.format(product.price)}
            </span>
            {originalPrice !== null && (
              <span className="text-lg text-slate-400 line-through">
                {currency.format(originalPrice)}
              </span>
            )}
            {product.discountPercentage > 0 && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                Save {Math.round(product.discountPercentage)}%
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${availabilityClasses(availability)}`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {availability}
            </span>
            <span className="text-sm text-slate-500">
              {product.stock} units available
            </span>
          </div>

          <div className="mt-6">
            <AddToCartButton
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                stock: product.stock,
              }}
            />
          </div>

          <p className="mt-6 leading-7 text-slate-600 dark:text-slate-400">
            {product.description}
          </p>

          {product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 capitalize dark:border-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-slate-200 pt-6 text-sm sm:grid-cols-2 dark:border-slate-800">
            <div>
              <dt className="text-slate-500">SKU</dt>
              <dd className="mt-0.5 font-medium">{product.sku}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Minimum order</dt>
              <dd className="mt-0.5 font-medium">
                {product.minimumOrderQuantity} units
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Warranty</dt>
              <dd className="mt-0.5 font-medium">
                {product.warrantyInformation}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Shipping</dt>
              <dd className="mt-0.5 font-medium">
                {product.shippingInformation}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-500">Return policy</dt>
              <dd className="mt-0.5 font-medium">{product.returnPolicy}</dd>
            </div>
          </dl>
        </div>
      </div>
    </DashboardShell>
  );
}
