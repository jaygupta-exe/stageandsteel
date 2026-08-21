"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag, Percent, Check, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    openCheckout,
    updateQuantity,
    removeFromCart,
    subtotal,
    formattedSubtotal,
    appliedCoupon,
    discountAmount,
    formattedDiscountAmount,
    formattedFinalTotal,
    applyCoupon,
    removeCoupon,
    totalCount,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponFeedback({ type: "success", message: res.message });
      setCouponInput("");
    } else {
      setCouponFeedback({ type: "error", message: res.message });
    }
    setTimeout(() => setCouponFeedback(null), 4000);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isCartOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0c0d0c]/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeCart}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#161715] border-l border-[#333530] text-[#F4F4F1] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
        
        {/* Top Military Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-[#596238] via-[#75804c] to-[#596238]" />

        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-[#262824] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xs bg-[#596238]/20 border border-[#596238]/50 flex items-center justify-center text-[#9DB25E]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-[#75804c] uppercase font-bold">
                  STAGE & STEEL // PROTOCOL
                </span>
              </div>
              <h2 className="text-xl font-editorial font-bold tracking-wide uppercase text-white">
                YOUR STACK ({totalCount})
              </h2>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="p-2 text-[#9c9e99] hover:text-white hover:bg-[#252723] transition-colors rounded-xs focus:outline-hidden cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#777873]">
              <div className="w-16 h-16 rounded-full bg-[#20211e] border border-[#333530] flex items-center justify-center mb-4 text-[#555751]">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="font-editorial text-lg text-white uppercase tracking-wider mb-1">
                PROTOCOL SHAKER EMPTY
              </p>
              <p className="text-xs font-mono max-w-[240px] text-[#8e9089]">
                Select your pure microfiltered protein, creatine, or EAA to fuel your discipline.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.flavor}`}
                className="p-3.5 bg-[#1f201d] border border-[#2e302b] flex gap-3.5 items-center justify-between rounded-xs"
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 bg-[#131412] border border-[#2b2c28] rounded-xs shrink-0 flex items-center justify-center overflow-hidden">
                  <Image
                    src={item.thumbnail}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-contain p-1"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide truncate">
                    {item.name}
                  </h4>
                  <div className="text-[10px] font-mono text-[#8c8e88] truncate">
                    FLAVOR: <span className="text-[#9DB25E] font-semibold">{item.flavor}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-white mt-1">
                    {item.price}
                  </div>
                </div>

                {/* Quantity & Delete */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id, item.flavor)}
                    className="text-[#777873] hover:text-red-400 transition-colors p-1 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center border border-[#3a3c36] bg-[#141513] rounded-xs">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.flavor, -1)}
                      className="px-2 py-1 text-[#8E8D88] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-[11px] font-mono font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.flavor, 1)}
                      className="px-2 py-1 text-[#8E8D88] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-[#262824] bg-[#121312] space-y-3.5">
            
            {/* Promo Code System */}
            <div className="space-y-2 pb-2 border-b border-[#222420]">
              {appliedCoupon ? (
                <div className="p-2.5 bg-[#596238]/15 border border-[#596238]/40 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#9DB25E]" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-white tracking-wider">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#596238] text-white rounded font-semibold">
                          {appliedCoupon.type === "percentage" ? `${appliedCoupon.value}% OFF` : `₹${appliedCoupon.value} OFF`}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#9DB25E] block">
                        Saved {formattedDiscountAmount}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-[10px] font-mono text-red-400 hover:text-red-300 uppercase px-2 py-1 hover:bg-white/5 rounded transition-colors cursor-pointer"
                  >
                    REMOVE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#777873]" />
                    <input
                      type="text"
                      placeholder="ENTER PROMO CODE (e.g. LAUNCH10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full pl-8 pr-2.5 py-2 bg-[#1b1c19] border border-[#2e302b] focus:border-[#8FA355] text-white font-mono text-xs placeholder:text-[#666762] focus:outline-hidden uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#262824] hover:bg-[#596238] hover:text-white border border-[#3a3c36] text-[#9DB25E] font-mono text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    APPLY
                  </button>
                </form>
              )}

              {/* Feedback messages */}
              {couponFeedback && (
                <div
                  className={`text-[10px] font-mono flex items-center gap-1.5 ${
                    couponFeedback.type === "success"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {couponFeedback.type === "success" ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  <span>{couponFeedback.message}</span>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-[#8c8e88]">
                <span>SUBTOTAL:</span>
                <span className="text-white">{formattedSubtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#9DB25E] font-bold">
                  <span>DISCOUNT ({appliedCoupon?.code}):</span>
                  <span>-{formattedDiscountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-[#8c8e88]">
                <span>DELIVERY:</span>
                <span className="text-[#9DB25E] font-bold">FREE EXPRESS</span>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-[#222420]">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">
                  TOTAL PAYABLE:
                </span>
                <span className="font-display text-2xl font-black text-white">
                  {formattedFinalTotal}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={openCheckout}
              className="w-full py-3.5 bg-[#596238] hover:bg-[#687342] text-white font-editorial font-bold tracking-widest text-sm uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#596238]/30"
            >
              <span>PROCEED TO SECURE CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
