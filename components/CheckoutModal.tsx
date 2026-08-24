"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Phone,
  Mail,
  User as UserIcon,
  MapPin,
  Lock,
  Tag,
  Check,
  Percent,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { load } from "@cashfreepayments/cashfree-js";
import { saveOrder } from "@/lib/orders";

export default function CheckoutModal() {
  const {
    items,
    isCheckoutOpen,
    closeCheckout,
    subtotal,
    formattedSubtotal,
    appliedCoupon,
    discountAmount,
    formattedDiscountAmount,
    finalTotal,
    formattedFinalTotal,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();
  const { user } = useAuth();

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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pincodeStatus, setPincodeStatus] = useState<{
    checking: boolean;
    serviceable?: boolean;
    city?: string;
    state?: string;
  } | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    amount: number;
    waybill?: string;
    whatsappUrl?: string;
    emailSent?: boolean;
  } | null>(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      if (user.displayName && !name) setName(user.displayName);
      if (user.email && !email) setEmail(user.email);
    }
  }, [user]);

  // Check Delhivery PIN code serviceability when 6 digits are typed
  const handlePincodeChange = async (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "").slice(0, 6);
    setPincode(cleaned);

    if (cleaned.length === 6) {
      setPincodeStatus({ checking: true });
      try {
        const res = await fetch(`/api/delhivery/check-pincode?pincode=${cleaned}`);
        const data = await res.json();
        if (data.serviceable) {
          setPincodeStatus({
            checking: false,
            serviceable: true,
            city: data.city,
            state: data.state,
          });
          if (data.city && !city) setCity(data.city);
          if (data.state && !stateName) setStateName(data.state);
        } else {
          setPincodeStatus({
            checking: false,
            serviceable: false,
          });
        }
      } catch (err) {
        console.warn("Pincode check error:", err);
        setPincodeStatus({ checking: false, serviceable: true });
      }
    } else {
      setPincodeStatus(null);
    }
  };

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) closeCheckout();
    };
    if (isCheckoutOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isCheckoutOpen, isProcessing, closeCheckout]);

  if (!isCheckoutOpen) return null;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      if (!phone || phone.replace(/[^0-9]/g, "").length < 10) {
        throw new Error("Please enter a valid 10-digit mobile number for Cashfree verification.");
      }
      if (!pincode || pincode.length < 6) {
        throw new Error("Please enter a valid 6-digit PIN code.");
      }

      // 1. Create order on server
      const res = await fetch("/api/cashfree/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderAmount: finalTotal,
          couponCode: appliedCoupon?.code || null,
          customerDetails: {
            customerId: user?.uid || `cust_${Date.now()}`,
            name,
            email,
            phone: phone.replace(/[^0-9]/g, ""),
          },
          items,
          shippingAddress: {
            address,
            city,
            state: stateName,
            pincode,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate payment gateway");
      }

      const { paymentSessionId, orderId, environment } = data;

      if (!paymentSessionId) {
        throw new Error("Payment session ID not received from Cashfree.");
      }

      // 2. Initialize Cashfree Web SDK
      const mode = (environment || "SANDBOX").toLowerCase() === "production" ? "production" : "sandbox";
      const cashfree = await load({ mode });

      // 3. Open Cashfree Checkout Modal
      const checkoutOptions = {
        paymentSessionId,
        redirectTarget: "_modal" as const,
      };

      await cashfree.checkout(checkoutOptions);

      // 4. Verify payment status after modal interaction
      const verifyRes = await fetch(`/api/cashfree/verify-order?orderId=${orderId}`);
      const verifyData = await verifyRes.json();

      if (verifyData.orderStatus === "PAID" || verifyData.success) {
        // Automatically create Delhivery Express Shipment
        let waybill = `DELHIVERY_${Date.now()}`;
        try {
          const shipRes = await fetch("/api/delhivery/create-shipment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              amount: finalTotal,
              customer: { name, phone, email },
              shippingAddress: { address, city, state: stateName, pincode },
              items,
            }),
          });
          const shipData = await shipRes.json();
          if (shipData.waybill) {
            waybill = shipData.waybill;
          }
        } catch (shipErr) {
          console.warn("Delhivery auto-dispatch error:", shipErr);
        }

        // 5. Save order to Firestore for order history
        const orderItems = items.map((item) => ({
          id: item.id,
          name: item.name,
          flavor: item.flavor,
          price: item.price,
          numericPrice: item.numericPrice,
          quantity: item.quantity,
          thumbnail: item.thumbnail,
        }));

        try {
          await saveOrder({
            orderId,
            userId: user?.uid || `guest_${Date.now()}`,
            items: orderItems,
            subtotal,
            discountAmount,
            couponCode: appliedCoupon?.code || null,
            finalTotal,
            status: "PAID",
            paymentGateway: "CASHFREE",
            waybill,
            customerName: name,
            customerEmail: email,
            customerPhone: phone.replace(/[^0-9]/g, ""),
            shippingAddress: { address, city, state: stateName, pincode },
          });
        } catch (saveErr) {
          console.warn("Order save to Firestore warning:", saveErr);
        }

        // 6. Send order confirmation (email + WhatsApp link)
        let whatsappUrl = "";
        let emailSent = false;
        try {
          const confirmRes = await fetch("/api/send-confirmation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              customerName: name,
              customerEmail: email,
              customerPhone: phone.replace(/[^0-9]/g, ""),
              orderAmount: finalTotal,
              items: orderItems,
              waybill,
              couponCode: appliedCoupon?.code || null,
            }),
          });
          const confirmData = await confirmRes.json();
          whatsappUrl = confirmData.whatsappUrl || "";
          emailSent = confirmData.emailSent || false;
        } catch (confirmErr) {
          console.warn("Order confirmation send warning:", confirmErr);
        }

        setOrderSuccess({
          orderId,
          amount: finalTotal,
          waybill,
          whatsappUrl,
          emailSent,
        });
        clearCart();
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err?.message || "Payment process encountered an error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0c0d0c]/85 backdrop-blur-md transition-opacity"
        onClick={() => !isProcessing && closeCheckout()}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#161715] border border-[#333530] text-[#F4F4F1] shadow-2xl overflow-hidden z-10 my-auto">
        {/* Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-[#596238] via-[#8FA355] to-[#596238]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-start justify-between border-b border-[#292a26]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#9DB25E] uppercase">
                STAGE & STEEL LAB // SECURE CHECKOUT
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-editorial font-bold tracking-wide uppercase text-white">
              {orderSuccess ? "ORDER DISPATCH CONFIRMED" : "DISPATCH TERMINAL & PAYMENT"}
            </h2>
          </div>

          {!isProcessing && (
            <button
              onClick={closeCheckout}
              className="p-1.5 text-[#9c9e99] hover:text-white hover:bg-[#252723] transition-colors rounded-xs cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Success Confirmation Screen */}
        {orderSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#596238]/20 border border-[#9DB25E] text-[#9DB25E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-editorial font-bold uppercase text-white">
                PAYMENT VERIFIED // DISPATCH INITIATED
              </h3>
              <p className="text-xs font-mono text-[#9c9e99] mt-1">
                Your Stage & Steel high-purity stack is being prepared for express delivery.
              </p>
            </div>

            {/* Confirmation Badges */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {orderSuccess.emailSent && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#596238]/20 border border-[#596238]/40 text-[10px] font-mono text-[#9DB25E] font-bold rounded">
                  <Mail className="w-3 h-3" />
                  📧 CONFIRMATION EMAIL SENT
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#20211e] border border-[#333530] text-[10px] font-mono text-[#8c8e88] rounded">
                <ShieldCheck className="w-3 h-3 text-[#9DB25E]" />
                ORDER SAVED TO YOUR ACCOUNT
              </span>
            </div>

            <div className="p-4 bg-[#111210] border border-[#2b2d28] text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-[#222420] pb-2">
                <span className="text-[#777873]">ORDER ID:</span>
                <span className="font-bold text-white">{orderSuccess.orderId}</span>
              </div>
              <div className="flex justify-between border-b border-[#222420] pb-2">
                <span className="text-[#777873]">AMOUNT PAID:</span>
                <span className="font-bold text-[#9DB25E]">₹{orderSuccess.amount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between border-b border-[#222420] pb-2">
                <span className="text-[#777873]">PAYMENT GATEWAY:</span>
                <span className="font-bold text-white">CASHFREE PG (PAID)</span>
              </div>
              {orderSuccess.waybill && (
                <div className="flex justify-between items-center pt-1">
                  <div>
                    <span className="text-[#777873] block">DELHIVERY AWB / TRACKING:</span>
                    <span className="font-bold text-[#8FA355] text-xs">{orderSuccess.waybill}</span>
                  </div>
                  <a
                    href={`https://www.delhivery.com/track/package/${orderSuccess.waybill}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-[#232521] hover:bg-[#2e302a] border border-[#3a3c36] text-[10px] text-white rounded-xs font-mono uppercase transition-colors"
                  >
                    TRACK PACKAGE &rarr;
                  </a>
                </div>
              )}
            </div>

            {/* WhatsApp Confirmation Button */}
            {orderSuccess.whatsappUrl && (
              <a
                href={orderSuccess.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-editorial font-bold tracking-widest text-sm uppercase transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/20"
              >
                <svg viewBox="0 0 32 32" fill="white" className="w-5 h-5">
                  <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958C9.72 31.054 12.764 32 16.004 32 24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.35 22.606c-.39 1.1-1.932 2.014-3.166 2.28-.846.18-1.95.324-5.668-1.218-4.762-1.974-7.826-6.814-8.064-7.13-.23-.316-1.93-2.572-1.93-4.904s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.018.292.014.682-.11 1.068.814.39.938 1.336 3.27 1.452 3.508.118.238.196.514.04.83-.158.316-.236.514-.474.79-.238.278-.5.62-.714.832-.238.236-.486.494-.208.968.276.474 1.228 2.028 2.638 3.286 1.81 1.616 3.338 2.118 3.812 2.356.474.238.75.198 1.026-.118.278-.316 1.186-1.382 1.502-1.858.316-.476.632-.396 1.066-.238.434.158 2.764 1.304 3.238 1.542.474.238.79.356.908.554.118.198.118 1.148-.272 2.252z" />
                </svg>
                CONFIRM ORDER ON WHATSAPP
              </a>
            )}

            <button
              type="button"
              onClick={closeCheckout}
              className="w-full py-3.5 bg-[#596238] hover:bg-[#687342] text-white font-editorial font-bold tracking-widest text-sm uppercase transition-all cursor-pointer shadow-lg"
            >
              RETURN TO LABS
            </button>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Payment Alert:</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Order Items & Coupon Summary */}
            <div className="p-3.5 bg-[#101110] border border-[#262824] rounded-xs space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8c8e88] pb-2 border-b border-[#222420]">
                <span>ORDER SUMMARY ({items.reduce((s, i) => s + i.quantity, 0)} ITEMS)</span>
                <span className="text-white font-bold">{formattedSubtotal}</span>
              </div>

              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.flavor}`}
                    className="flex items-center justify-between text-xs font-mono"
                  >
                    <span className="truncate max-w-[220px] text-[#D4D3CD]">
                      {item.quantity}x {item.name} ({item.flavor})
                    </span>
                    <span className="text-white font-semibold">
                      ₹{(item.numericPrice * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Input in Checkout */}
              <div className="pt-2 border-t border-[#222420]">
                {appliedCoupon ? (
                  <div className="p-2 bg-[#596238]/20 border border-[#596238]/40 rounded flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#9DB25E]" />
                      <div className="text-xs font-mono">
                        <span className="font-bold text-white tracking-wide mr-1.5">{appliedCoupon.code}</span>
                        <span className="text-[#9DB25E]">(-{formattedDiscountAmount})</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-[10px] font-mono text-red-400 hover:text-red-300 uppercase cursor-pointer"
                    >
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#666762]" />
                      <input
                        type="text"
                        placeholder="COUPON (e.g. LAUNCH10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="w-full bg-[#0d0e0d] border border-[#2b2d28] focus:border-[#8FA355] text-white text-xs pl-8 pr-2 py-1.5 placeholder:text-[#444541] focus:outline-hidden uppercase font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 py-1.5 bg-[#232521] hover:bg-[#596238] text-[#9DB25E] hover:text-white border border-[#3a3c36] text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                    >
                      APPLY
                    </button>
                  </div>
                )}

                {couponFeedback && (
                  <p className={`mt-1 text-[10px] font-mono ${couponFeedback.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Final Totals Breakdown */}
              <div className="pt-2 border-t border-[#222420] space-y-1 text-xs font-mono">
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
                <div className="flex justify-between text-white font-bold pt-1 border-t border-[#222420] text-sm">
                  <span>TOTAL PAYABLE:</span>
                  <span className="text-[#9DB25E] text-base">{formattedFinalTotal}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handlePayment} className="space-y-4">
              {/* Personal Details */}
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#9DB25E] uppercase font-bold block mb-2">
                  01. CUSTOMER CONTACT DETAILS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-[#8e9089] uppercase mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666762]" />
                      <input
                        type="text"
                        required
                        placeholder="Alex Mercer"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#0d0e0d] border border-[#2b2d28] focus:border-[#8FA355] text-white text-xs pl-8 pr-2.5 py-2 placeholder:text-[#444541] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-[#8e9089] uppercase mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666762]" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#0d0e0d] border border-[#2b2d28] focus:border-[#8FA355] text-white text-xs pl-8 pr-2.5 py-2 placeholder:text-[#444541] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-[#8e9089] uppercase mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666762]" />
                      <input
                        type="email"
                        required
                        placeholder="alex@athlete.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0d0e0d] border border-[#2b2d28] focus:border-[#8FA355] text-white text-xs pl-8 pr-2.5 py-2 placeholder:text-[#444541] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#9DB25E] uppercase font-bold block mb-2">
                  02. DISPATCH DESTINATION (DELHIVERY EXPRESS)
                </span>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-[#8e9089] uppercase mb-1">
                      Street Address / House / Flat No. *
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-[#666762]" />
                      <input
                        type="text"
                        required
                        placeholder="House No., Street / Sector / Landmark"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-[#0d0e0d] border border-[#2b2d28] focus:border-[#8FA355] text-white text-xs pl-8 pr-2.5 py-2 placeholder:text-[#444541] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[9px] font-mono tracking-wider text-[#8e9089] uppercase">
                          PIN Code *
                        </label>
                        {pincodeStatus && (
                          <span
                            className={`text-[9px] font-mono ${
                              pincodeStatus.checking
                                ? "text-yellow-400"
                                : pincodeStatus.serviceable
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {pincodeStatus.checking
                              ? "CHECKING..."
                              : pincodeStatus.serviceable
                              ? "✓ EXPRESS SERVICEABLE"
                              : "✕ UNSERVICEABLE"}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="110001"
                        value={pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        className="w-full bg-[#0d0e0d] border border-[#2b2d28] focus:border-[#8FA355] text-white text-xs px-2.5 py-2 placeholder:text-[#444541] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono tracking-wider text-[#8e9089] uppercase mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Mumbai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#0d0e0d] border border-[#2b2d28] focus:border-[#8FA355] text-white text-xs px-2.5 py-2 placeholder:text-[#444541] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono tracking-wider text-[#8e9089] uppercase mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Maharashtra"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full bg-[#0d0e0d] border border-[#2b2d28] focus:border-[#8FA355] text-white text-xs px-2.5 py-2 placeholder:text-[#444541] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cashfree Payment Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#596238] hover:bg-[#687342] text-white font-editorial font-bold tracking-widest text-sm uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#596238]/30 disabled:opacity-60"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>PAY {formattedFinalTotal} VIA CASHFREE PG</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[#777873]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#9DB25E]" />
                    UPI / CARDS / NETBANKING / WALLETS
                  </span>
                  <span>POWERED BY CASHFREE PAYMENTS</span>
                </div>

                <p className="mt-2.5 text-[9px] font-mono text-center text-[#777873] leading-relaxed">
                  By proceeding, you agree to our{" "}
                  <a href="/terms-and-conditions" target="_blank" className="text-[#9DB25E] underline hover:text-white">Terms</a>,{" "}
                  <a href="/shipping-policy" target="_blank" className="text-[#9DB25E] underline hover:text-white">Shipping Policy</a> &amp;{" "}
                  <a href="/refund-policy" target="_blank" className="text-[#9DB25E] underline hover:text-white">7-Day Refund Policy</a>.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
