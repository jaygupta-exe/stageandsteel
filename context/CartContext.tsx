"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { soundFX } from "@/lib/sound";

export interface CartItem {
  id: string;
  name: string;
  subtitle: string;
  price: string; // e.g. "₹2,599"
  numericPrice: number; // e.g. 2599
  flavor: string;
  quantity: number;
  thumbnail: string;
  servings?: string;
  netWeight?: string;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  addToCart: (
    item: {
      id: string;
      name: string;
      subtitle: string;
      price: string;
      flavor?: string;
      thumbnail: string;
      servings?: string;
      netWeight?: string;
    },
    quantity?: number,
    flavor?: string
  ) => void;
  removeFromCart: (id: string, flavor: string) => void;
  updateQuantity: (id: string, flavor: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  formattedSubtotal: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to convert "₹2,599" -> 2599
export function parsePriceToNumber(priceStr: string): number {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("stage_steel_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load cart from storage:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("stage_steel_cart", JSON.stringify(items));
      } catch (e) {
        console.warn("Failed to save cart to storage:", e);
      }
    }
  }, [items, isLoaded]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const openCheckout = () => {
    soundFX.playClick();
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const addToCart = (
    product: {
      id: string;
      name: string;
      subtitle: string;
      price: string;
      flavor?: string;
      thumbnail: string;
      servings?: string;
      netWeight?: string;
    },
    quantity: number = 1,
    selectedFlavor: string = "Standard"
  ) => {
    // Play satisfying mechanical click sound!
    soundFX.playAddToCart();

    const flavor = selectedFlavor || product.flavor || "Standard";
    const numericPrice = parsePriceToNumber(product.price);

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (i) => i.id === product.id && i.flavor === flavor
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            subtitle: product.subtitle,
            price: product.price,
            numericPrice,
            flavor,
            quantity,
            thumbnail: product.thumbnail,
            servings: product.servings,
            netWeight: product.netWeight,
          },
        ];
      }
    });

    // Automatically slide open the cart drawer to confirm addition
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, flavor: string) => {
    soundFX.playClick();
    setItems((prev) => prev.filter((i) => !(i.id === id && i.flavor === flavor)));
  };

  const updateQuantity = (id: string, flavor: string, delta: number) => {
    soundFX.playClick();
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id && i.flavor === flavor) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    soundFX.playClick();
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.numericPrice * item.quantity,
    0
  );
  const formattedSubtotal = `₹${subtotal.toLocaleString("en-IN")}`;

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        isCheckoutOpen,
        openCart,
        closeCart,
        toggleCart,
        openCheckout,
        closeCheckout,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        formattedSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
