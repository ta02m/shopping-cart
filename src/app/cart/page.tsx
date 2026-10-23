import type { Metadata } from "next";

import { CartView } from "./cart-view";

export const metadata: Metadata = {
  title: "Shopping cart - Shop",
  description: "Review and update the items in your shopping cart.",
};

export default function CartPage() {
  return <CartView />;
}
