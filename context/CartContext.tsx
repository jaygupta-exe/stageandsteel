"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { soundFX } from "@/lib/sound";

import { Coupon, validateCoupon } from "@/lib/coupons";

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
  appliedCoupon: Coupon | null;
  discountAmount: number;
  finalTotal: number;
  formattedDiscountAmount: string;
  formattedFinalTotal: string;
  applyCoupon: (code: string) => { success: boolean; message: string; discount: number };
  removeCoupon: () => void;
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
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCodeStored, setCouponCodeStored] = useState<string>("");

  // Load cart and coupon from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("stage_steel_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem("stage_steel_coupon");
      if (savedCoupon) {
        setCouponCodeStored(savedCoupon);
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

  // Calculate Subtotal
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.numericPrice * item.quantity,
    0
  );
  const formattedSubtotal = `₹${subtotal.toLocaleString("en-IN")}`;

  // Recalculate discount whenever subtotal or coupon changes
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    const result = validateCoupon(appliedCoupon.code, subtotal);
    if (result.isValid) {
      discountAmount = result.discountAmount;
    }
  }

  // Restore coupon from storage on initial load once subtotal is known
  useEffect(() => {
    if (couponCodeStored && subtotal > 0 && !appliedCoupon) {
      const result = validateCoupon(couponCodeStored, subtotal);
      if (result.isValid && result.coupon) {
        setAppliedCoupon(result.coupon);
      }
    }
  }, [couponCodeStored, subtotal, appliedCoupon]);

  const finalTotal = Math.max(0, subtotal - discountAmount);
  const formattedDiscountAmount = `₹${discountAmount.toLocaleString("en-IN")}`;
  const formattedFinalTotal = `₹${finalTotal.toLocaleString("en-IN")}`;

  const applyCoupon = (inputCode: string) => {
    const result = validateCoupon(inputCode, subtotal);
    if (result.isValid && result.coupon) {
      soundFX.playClick();
      setAppliedCoupon(result.coupon);
      localStorage.setItem("stage_steel_coupon", result.coupon.code);
      return { success: true, message: result.message, discount: result.discountAmount };
    } else {
      return { success: false, message: result.message, discount: 0 };
    }
  };

  const removeCoupon = () => {
    soundFX.playClick();
    setAppliedCoupon(null);
    setCouponCodeStored("");
    localStorage.removeItem("stage_steel_coupon");
  };

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
    removeCoupon();
  };

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
        appliedCoupon,
        discountAmount,
        finalTotal,
        formattedDiscountAmount,
        formattedFinalTotal,
        applyCoupon,
        removeCoupon,
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
