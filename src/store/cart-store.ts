"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const CART_STORAGE_KEY = "shop-app:cart";
const EMPTY_CART: CartItem[] = [];

export type CartProduct = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  stock: number;
};

export type CartItem = CartProduct & {
  quantity: number;
};

type PersistedCartState = {
  items: CartItem[];
};

type CartStore = {
  items: CartItem[];
  isLoaded: boolean;
  setLoaded: () => void;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};

function normalizeItem(value: unknown): CartItem | null {
  if (!value || typeof value !== "object") return null;

  const item = value as Record<string, unknown>;

  if (
    typeof item.id !== "number" ||
    typeof item.title !== "string" ||
    typeof item.price !== "number" ||
    !Number.isFinite(item.price) ||
    typeof item.thumbnail !== "string" ||
    typeof item.stock !== "number" ||
    !Number.isFinite(item.stock) ||
    item.stock <= 0 ||
    typeof item.quantity !== "number" ||
    !Number.isFinite(item.quantity) ||
    item.quantity <= 0
  ) {
    return null;
  }

  const stock = Math.max(1, Math.floor(item.stock));

  return {
    id: item.id,
    title: item.title,
    price: item.price,
    thumbnail: item.thumbnail,
    stock,
    quantity: Math.min(Math.max(1, Math.floor(item.quantity)), stock),
  };
}

function normalizeItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return EMPTY_CART;

  const items = value
    .map(normalizeItem)
    .filter((item): item is CartItem => item !== null);

  return items.length ? items : EMPTY_CART;
}

export const useCartStore = create<CartStore>()(
  persist<CartStore, [], [], PersistedCartState>(
    (set) => ({
      items: EMPTY_CART,
      isLoaded: false,
      setLoaded: () => set({ isLoaded: true }),

      addItem: (product, quantity = 1) => {
        const stock = Math.max(0, Math.floor(product.stock));

        if (stock <= 0) return;

        const amount = Math.max(1, Math.floor(quantity));

        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);

          const items = existing
            ? state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      stock,
                      quantity: Math.min(stock, item.quantity + amount),
                    }
                  : item,
              )
            : [
                ...state.items,
                {
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  thumbnail: product.thumbnail,
                  stock,
                  quantity: Math.min(stock, amount),
                },
              ];

          return { items };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (!Number.isFinite(quantity)) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: Math.min(
                    Math.max(1, item.stock),
                    Math.max(1, Math.floor(quantity)),
                  ),
                }
              : item,
          ),
        }));
      },

      clearCart: () => set({ items: EMPTY_CART }),
    }),
    {
      name: CART_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage<PersistedCartState>(() => localStorage),

      partialize: (state) => ({
        items: state.items,
      }),

      merge: (persistedState, currentState) => ({
        ...currentState,
        items: normalizeItems(
          (persistedState as Partial<PersistedCartState> | undefined)?.items,
        ),
      }),

      onRehydrateStorage: () => (state, error) => {
        if (error) {
          useCartStore.setState({ isLoaded: true });
          return;
        }

        state?.setLoaded();
      },
    },
  ),
);

export function useCart() {
  const items = useCartStore((state) => state.items);
  const isLoaded = useCartStore((state) => state.isLoaded);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  return {
    items,
    isLoaded,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
