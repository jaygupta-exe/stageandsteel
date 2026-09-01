"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Mail,
  Truck,
  ArrowLeft,
  Package,
  RotateCw,
  ExternalLink,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const WHATSAPP_NUMBER = "919779159169"; // Divesh Mehan (Stage & Steel Owner)

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const orderId = searchParams.get("order_id") || searchParams.get("orderId") || "";
  const initialStatus = (searchParams.get("status") || "CHECKING").toUpperCase();

  const [status, setStatus] = useState<string>(initialStatus);
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [waybill, setWaybill] = useState<string | null>(null);
  const [dynamicWhatsappUrl, setDynamicWhatsappUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setErrorMessage("No Order ID was provided in the return URL.");
      return;
    }

    // Verify order status directly from server API & trigger fulfillment
    async function verifyOrder() {
      try {
        setLoading(true);
        const res = await fetch(`/api/cashfree/verify-order?orderId=${encodeURIComponent(orderId)}`);
        const data = await res.json();

        if (res.ok && data.success) {
          const currentStatus = (data.orderStatus || "PENDING").toUpperCase();
          setStatus(currentStatus);
          setOrderDetails(data.order || data.paymentDetails || data);
          if (data.waybill) setWaybill(data.waybill);
          if (data.whatsappUrl) setDynamicWhatsappUrl(data.whatsappUrl);

          if (currentStatus === "PAID") {
            // Clear cart since order has been successfully paid
            clearCart();
          }
        } else {
          setStatus("UNKNOWN");
          setErrorMessage(data.error || "Unable to retrieve order details from payment gateway.");
        }
      } catch (err: any) {
        console.error("Order verification error:", err);
        setErrorMessage("Network issue while checking order status.");
      } finally {
        setLoading(false);
      }
    }

    verifyOrder();
  }, [orderId]);

  const orderAmount =
    orderDetails?.finalTotal ||
    orderDetails?.order_amount ||
    orderDetails?.orderAmount ||
    0;
  const formattedAmount = orderAmount ? `₹${Number(orderAmount).toLocaleString("en-IN")}` : "Paid";

  const defaultWhatsappMessage = encodeURIComponent(
    `✅ *Stage & Steel Order Confirmed!*\n\n` +
      `📋 Order ID: *${orderId}*\n` +
      (orderAmount ? `💰 Amount: ₹${Number(orderAmount).toLocaleString("en-IN")}\n` : "") +
      (waybill ? `🚚 Delhivery AWB: *${waybill}*\n` : "") +
      `\nPlease update me with the dispatch details. Thank you! 💪`
  );
  const finalWhatsappUrl = dynamicWhatsappUrl || `https://wa.me/${WHATSAPP_NUMBER}?text=${defaultWhatsappMessage}`;

  const isPaid = status === "PAID";
  const isFailed = status === "FAILED" || status === "USER_DROPPED" || status === "CANCELLED";
  const isPending = !isPaid && !isFailed;

  return (
    <div className="min-h-screen bg-[#0c0d0c] text-[#F4F4F1] flex flex-col justify-between selection:bg-[#596238] selection:text-[#F4F4F1]">
      {/* Top Banner */}
      <header className="border-b border-[#262824] bg-[#111210]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-editorial text-xl font-bold tracking-widest text-white group-hover:text-[#9DB25E] transition-colors">
              STAGE & STEEL
            </span>
            <span className="text-[9px] font-mono uppercase bg-[#596238]/30 text-[#9DB25E] px-1.5 py-0.5 border border-[#596238]/60">
              DISPATCH TERMINAL
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-mono text-[#9c9e99] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO STORE</span>
          </Link>
        </div>
      </header>

      {/* Main Status Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-10 pb-32 sm:py-16 sm:pb-36 flex items-center justify-center">
        <div className="w-full bg-[#161715] border border-[#333530] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Top Accent Strip */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 ${
              isPaid
                ? "bg-gradient-to-r from-[#596238] via-[#8FA355] to-[#596238]"
                : isFailed
                ? "bg-gradient-to-r from-red-800 via-red-500 to-red-800"
                : "bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700"
            }`}
          />

          {loading ? (
            <div className="py-16 text-center space-y-4">
              <RotateCw className="w-10 h-10 text-[#9DB25E] animate-spin mx-auto" />
              <p className="text-xs font-mono tracking-widest text-[#9c9e99] uppercase">
                VERIFYING SECURE CASHFREE PG TRANSACTION & DELHIVERY DISPATCH...
              </p>
            </div>
          ) : isPaid ? (
            <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-[#596238]/20 border-2 border-[#9DB25E] text-[#9DB25E] flex items-center justify-center mx-auto shadow-lg shadow-[#596238]/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#9DB25E] uppercase block mb-1">
                  DISPATCH CONFIRMED // TRANSACTION SUCCESS
                </span>
                <h1 className="text-2xl sm:text-3xl font-editorial font-bold uppercase text-white tracking-wide">
                  PAYMENT VERIFIED & ACCEPTED
                </h1>
                <p className="text-xs font-mono text-[#9c9e99] mt-2 max-w-md mx-auto">
                  Your Stage & Steel high-purity stack is locked in. Our lab facility is preparing your order for express dispatch.
                </p>
              </div>

              {/* Status Badges */}
              <div className="flex items-center justify-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#596238]/20 border border-[#596238]/40 text-[10px] font-mono text-[#9DB25E] font-bold">
                  <Mail className="w-3 h-3" />
                  CONFIRMATION EMAIL SENT
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#20211e] border border-[#333530] text-[10px] font-mono text-[#8c8e88]">
                  <ShieldCheck className="w-3 h-3 text-[#9DB25E]" />
                  256-BIT ENCRYPTED RECEIPT
                </span>
              </div>

              {/* Order Receipt Box */}
              <div className="p-4 sm:p-5 bg-[#111210] border border-[#2b2d28] text-left space-y-2.5 text-xs font-mono">
                <div className="flex justify-between border-b border-[#222420] pb-2">
                  <span className="text-[#777873]">ORDER ID:</span>
                  <span className="font-bold text-white tracking-wide">{orderId}</span>
                </div>
                {orderAmount > 0 && (
                  <div className="flex justify-between border-b border-[#222420] pb-2">
                    <span className="text-[#777873]">AMOUNT PAID:</span>
                    <span className="font-bold text-[#9DB25E]">{formattedAmount}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-[#222420] pb-2">
                  <span className="text-[#777873]">PAYMENT METHOD:</span>
                  <span className="font-bold text-white">CASHFREE PG (VERIFIED)</span>
                </div>
                <div className="flex justify-between border-b border-[#222420] pb-2 items-center">
                  <span className="text-[#777873]">DELHIVERY TRACKING:</span>
                  {waybill ? (
                    <a
                      href={`https://www.delhivery.com/track/package/${waybill}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#9DB25E] hover:underline flex items-center gap-1"
                    >
                      <Truck className="w-3 h-3" /> {waybill} <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ) : (
                    <span className="font-bold text-[#9DB25E] flex items-center gap-1">
                      <Truck className="w-3 h-3" /> DELHIVERY AIR EXPRESS
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[#777873]">ORDER STATUS:</span>
                  <span className="px-2 py-0.5 bg-[#596238]/30 border border-[#8FA355]/50 text-[#9DB25E] text-[10px] font-bold">
                    PAID / PROCESSING
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <a
                  href={finalWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-editorial font-bold tracking-widest text-xs sm:text-sm uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
                >
                  <svg viewBox="0 0 32 32" fill="white" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958C9.72 31.054 12.764 32 16.004 32 24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.35 22.606c-.39 1.1-1.932 2.014-3.166 2.28-.846.18-1.95.324-5.668-1.218-4.762-1.974-7.826-6.814-8.064-7.13-.23-.316-1.93-2.572-1.93-4.904s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.018.292.014.682-.11 1.068.814.39.938 1.336 3.27 1.452 3.508.118.238.196.514.04.83-.158.316-.236.514-.474.79-.238.278-.5.62-.714.832-.238.236-.486.494-.208.968.276.474 1.228 2.028 2.638 3.286 1.81 1.616 3.338 2.118 3.812 2.356.474.238.75.198 1.026-.118.278-.316 1.186-1.382 1.502-1.858.316-.476.632-.396 1.066-.238.434.158 2.764 1.304 3.238 1.542.474.238.79.356.908.554.118.198.118 1.148-.272 2.252z" />
                  </svg>
                  CONFIRM & TRACK ON WHATSAPP
                </a>

                <Link
                  href="/"
                  className="w-full py-3 bg-[#232521] hover:bg-[#596238] border border-[#3a3c36] hover:border-[#8FA355] text-white font-editorial font-bold tracking-widest text-xs sm:text-sm uppercase transition-all flex items-center justify-center gap-2"
                >
                  RETURN TO HOME / PRODUCT LABS
                </Link>
              </div>
            </div>
          ) : isFailed ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-red-950/40 border-2 border-red-500 text-red-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase block mb-1">
                  PAYMENT UNRESOLVED // GATEWAY NOTICE
                </span>
                <h1 className="text-2xl sm:text-3xl font-editorial font-bold uppercase text-white tracking-wide">
                  PAYMENT NOT COMPLETED
                </h1>
                <p className="text-xs font-mono text-[#9c9e99] mt-2 max-w-md mx-auto">
                  {errorMessage ||
                    "The transaction was cancelled or declined by the bank/UPI provider. If any amount was deducted, it will be automatically refunded by Cashfree within 48 hours."}
                </p>
              </div>

              <div className="p-4 bg-[#111210] border border-[#2b2d28] text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#777873]">ORDER ID:</span>
                  <span className="text-white font-bold">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777873]">STATUS:</span>
                  <span className="text-red-400 font-bold">{status}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href="/"
                  className="w-full py-3.5 bg-[#596238] hover:bg-[#6b7644] text-white font-editorial font-bold tracking-widest text-xs sm:text-sm uppercase transition-all flex items-center justify-center gap-2"
                >
                  RETRY CHECKOUT / BACK TO STORE
                </Link>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20my%20payment%20for%20order%20${orderId}%20faced%20an%20issue.%20Please%20assist.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#1a1b18] hover:bg-[#222420] border border-[#333530] text-[#9c9e99] hover:text-white font-mono text-xs uppercase transition-all flex items-center justify-center gap-2"
                >
                  CONTACT SUPPORT ON WHATSAPP
                </a>
              </div>
            </div>
          ) : (
            /* Pending state */
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-950/40 border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase block mb-1">
                  PAYMENT IN VERIFICATION
                </span>
                <h1 className="text-2xl sm:text-3xl font-editorial font-bold uppercase text-white tracking-wide">
                  TRANSACTION PENDING
                </h1>
                <p className="text-xs font-mono text-[#9c9e99] mt-2 max-w-md mx-auto">
                  Your payment is currently being confirmed with your bank. This usually takes under 60 seconds.
                </p>
              </div>

              <div className="p-4 bg-[#111210] border border-[#2b2d28] text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#777873]">ORDER ID:</span>
                  <span className="text-white font-bold">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777873]">GATEWAY STATUS:</span>
                  <span className="text-amber-400 font-bold">{status}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="w-full py-3.5 bg-[#596238] hover:bg-[#6b7644] text-white font-editorial font-bold tracking-widest text-xs sm:text-sm uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" />
                  REFRESH PAYMENT STATUS
                </button>

                <Link
                  href="/"
                  className="w-full py-2.5 bg-[#1a1b18] hover:bg-[#222420] border border-[#333530] text-[#9c9e99] hover:text-white font-mono text-xs uppercase transition-all flex items-center justify-center gap-2"
                >
                  BACK TO HOME
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#262824] py-6 text-center text-xs font-mono text-[#666762]">
        <p>STAGE & STEEL // MILITARY-GRADE PURITY // CERTIFIED SPORTS NUTRITION</p>
        <p className="mt-1 text-[10px] text-[#555651]">
          Support: +91 97791 59169 | Stageandsteel26@gmail.com
        </p>
      </footer>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0c0d0c] text-white flex items-center justify-center">
          <div className="text-center space-y-3">
            <RotateCw className="w-8 h-8 text-[#9DB25E] animate-spin mx-auto" />
            <p className="text-xs font-mono tracking-widest text-[#9c9e99]">
              LOADING ORDER STATUS...
            </p>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
