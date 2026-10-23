"use client";

import { useCallback, useEffect, useState } from "react";

import { PRODUCTS_URL } from "../constants";
import { request } from "@/utilities/request";
import AllProducts, { type Product } from "./all-products";

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await request({
          url: PRODUCTS_URL,
          method: "GET",
        });

        if (cancelled) return;

        setProducts(data?.products);
        setTotal(data?.total);
      } catch {
        if (cancelled) return;
        setError("Something went wrong. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getProducts();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return (
    <AllProducts
      products={products}
      total={total}
      loading={loading}
      error={error}
      onRetry={retry}
    />
  );
}
