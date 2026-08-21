"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Tag,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders, OrderRecord } from "@/lib/orders";

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PAID: { label: "PAID", color: "text-emerald-400", icon: CheckCircle2 },
  PROCESSING: { label: "PROCESSING", color: "text-yellow-400", icon: Clock },
  SHIPPED: { label: "SHIPPED", color: "text-blue-400", icon: Truck },
  DELIVERED: { label: "DELIVERED", color: "text-[#9DB25E]", icon: Package },
  CANCELLED: { label: "CANCELLED", color: "text-red-400", icon: X },
};

export default function OrderHistoryModal({ isOpen, onClose }: OrderHistoryModalProps) {
  const { user, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const data = await getUserOrders(user.uid);
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (isOpen && user?.uid) {
      fetchOrders();
    }
  }, [isOpen, user?.uid, fetchOrders]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-[115] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0c0d0c]/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-[#161715] border-l border-[#333530] text-[#F4F4F1] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
        {/* Top Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-[#596238] via-[#75804c] to-[#596238]" />

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#262824] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xs bg-[#596238]/20 border border-[#596238]/50 flex items-center justify-center text-[#9DB25E]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#75804c] uppercase font-bold block">
                STAGE & STEEL // LEDGER
              </span>
              <h2 className="text-xl font-editorial font-bold tracking-wide uppercase text-white">
                MY ORDERS
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#9c9e99] hover:text-white hover:bg-[#252723] transition-colors rounded-xs cursor-pointer"
            aria-label="Close order history"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* Not logged in */}
          {!user ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#20211e] border border-[#333530] flex items-center justify-center mb-4 text-[#555751]">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="font-editorial text-lg text-white uppercase tracking-wider mb-1">
                SIGN IN TO VIEW ORDERS
              </p>
              <p className="text-xs font-mono text-[#8e9089] max-w-[260px] mb-4">
                Your order history, invoices, and live tracking will appear here.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAuthModal("signin");
                }}
                className="px-6 py-2.5 bg-[#596238] hover:bg-[#687342] text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                SIGN IN
              </button>
            </div>
          ) : loading ? (
            <div className="h-full flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#596238] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs font-mono text-[#8e9089] uppercase">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#20211e] border border-[#333530] flex items-center justify-center mb-4 text-[#555751]">
                <Package className="w-7 h-7" />
              </div>
              <p className="font-editorial text-lg text-white uppercase tracking-wider mb-1">
                NO ORDERS YET
              </p>
              <p className="text-xs font-mono text-[#8e9089] max-w-[260px]">
                Place your first Stage & Steel order and it will appear here with live Delhivery tracking.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PAID;
                const StatusIcon = statusCfg.icon;
                const isExpanded = expandedOrder === order.orderId;
                const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

                return (
                  <div
                    key={order.orderId}
                    className="bg-[#1f201d] border border-[#2e302b] rounded-xs overflow-hidden"
                  >
                    {/* Order Header */}
                    <button
                      type="button"
                      onClick={() => setExpandedOrder(isExpanded ? null : order.orderId)}
                      className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#252723] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono text-[#8c8e88] uppercase">
                            {formatDate(order.createdAt)}
                          </span>
                          <span className={`text-[10px] font-mono font-bold uppercase flex items-center gap-1 ${statusCfg.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusCfg.label}
                          </span>
                        </div>
                        <div className="text-xs font-mono font-bold text-white tracking-wide truncate">
                          {order.orderId}
                        </div>
                        <div className="text-[10px] font-mono text-[#777873] mt-0.5">
                          {totalItems} item{totalItems > 1 ? "s" : ""} • ₹{order.finalTotal.toLocaleString("en-IN")}
                          {order.couponCode && (
                            <span className="ml-2 text-[#9DB25E]">
                              <Tag className="w-2.5 h-2.5 inline mr-0.5" />
                              {order.couponCode}
                            </span>
                          )}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#777873] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#777873] shrink-0" />
                      )}
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 border-t border-[#262824] space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                        {/* Items */}
                        <div className="space-y-2 pt-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="relative w-10 h-10 bg-[#131412] border border-[#2b2c28] rounded-xs shrink-0 overflow-hidden">
                                <Image
                                  src={item.thumbnail}
                                  alt={item.name}
                                  fill
                                  unoptimized
                                  className="object-contain p-0.5"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-white uppercase truncate">
                                  {item.name}
                                </p>
                                <p className="text-[10px] font-mono text-[#8c8e88]">
                                  {item.flavor} × {item.quantity}
                                </p>
                              </div>
                              <span className="text-xs font-mono font-bold text-white shrink-0">
                                ₹{(item.numericPrice * item.quantity).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Invoice Breakdown */}
                        <div className="p-2.5 bg-[#141513] border border-[#262824] rounded-xs space-y-1 text-[10px] font-mono">
                          <div className="flex justify-between text-[#8c8e88]">
                            <span>SUBTOTAL:</span>
                            <span className="text-white">₹{order.subtotal.toLocaleString("en-IN")}</span>
                          </div>
                          {order.discountAmount > 0 && (
                            <div className="flex justify-between text-[#9DB25E] font-bold">
                              <span>DISCOUNT ({order.couponCode}):</span>
                              <span>-₹{order.discountAmount.toLocaleString("en-IN")}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-[#8c8e88]">
                            <span>DELIVERY:</span>
                            <span className="text-[#9DB25E] font-bold">FREE</span>
                          </div>
                          <div className="flex justify-between text-white font-bold pt-1 border-t border-[#222420]">
                            <span>AMOUNT PAID:</span>
                            <span className="text-[#9DB25E]">₹{order.finalTotal.toLocaleString("en-IN")}</span>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="text-[10px] font-mono text-[#8c8e88]">
                          <span className="text-[#75804c] font-bold block mb-0.5">SHIP TO:</span>
                          {order.customerName} • {order.customerPhone}<br />
                          {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </div>

                        {/* Track Package Button */}
                        {order.waybill && (
                          <a
                            href={`https://www.delhivery.com/track/package/${order.waybill}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#232521] hover:bg-[#2e302a] border border-[#3a3c36] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5 text-[#9DB25E]" />
                            TRACK PACKAGE VIA DELHIVERY
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
