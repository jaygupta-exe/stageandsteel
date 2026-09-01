"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  getAllOrders,
  updateOrderStatus,
  updateOrderWaybill,
  deleteOrder,
  OrderRecord,
} from "@/lib/orders";
import {
  ShoppingCart,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Eye,
  Trash2,
  Loader2,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  User,
  ExternalLink,
  Save,
  X,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  // Inline editing state for tracking waybill
  const [editingWaybillId, setEditingWaybillId] = useState<string | null>(null);
  const [waybillInput, setWaybillInput] = useState("");
  const [savingWaybill, setSavingWaybill] = useState(false);

  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await res.json();
      const list = data.orders || [];
      setOrders(list);
      setFilteredOrders(list);
    } catch (err) {
      console.error("Error loading orders from API, trying SDK fallback:", err);
      try {
        const sdkData = await getAllOrders();
        setOrders(sdkData);
        setFilteredOrders(sdkData);
      } catch (sdkErr) {
        console.error("SDK fetch error:", sdkErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    let list = orders;
    if (statusFilter !== "ALL") {
      list = list.filter((o) => o.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderId?.toLowerCase().includes(q) ||
          o.customerEmail?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.customerPhone?.toLowerCase().includes(q) ||
          o.waybill?.toLowerCase().includes(q)
      );
    }
    setFilteredOrders(list);
  }, [searchQuery, statusFilter, orders]);

  const handleStatusChange = async (orderDocId: string, newStatus: OrderRecord["status"]) => {
    setUpdatingStatusId(orderDocId);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderDocId, status: newStatus }),
      });
      if (!res.ok) {
        await updateOrderStatus(orderDocId, newStatus);
      }
      setMessage({ type: "success", text: `Order status updated to ${newStatus}` });
      await loadOrders();
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to update order status: " + err.message });
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleSaveWaybill = async (orderDocId: string) => {
    setSavingWaybill(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderDocId, waybill: waybillInput }),
      });
      if (!res.ok) {
        await updateOrderWaybill(orderDocId, waybillInput);
      }
      setMessage({ type: "success", text: "Waybill / Tracking ID updated successfully." });
      setEditingWaybillId(null);
      await loadOrders();
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to update waybill: " + err.message });
    } finally {
      setSavingWaybill(false);
    }
  };

  const [dispatchingOrderId, setDispatchingOrderId] = useState<string | null>(null);

  const handleDispatchDelhivery = async (ord: OrderRecord) => {
    setDispatchingOrderId(ord.orderId);
    setMessage(null);
    try {
      const res = await fetch("/api/delhivery/create-shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: ord.orderId,
          amount: ord.finalTotal,
          customer: {
            name: ord.customerName,
            phone: ord.customerPhone,
            email: ord.customerEmail,
          },
          shippingAddress: ord.shippingAddress,
          items: ord.items,
        }),
      });
      const data = await res.json();
      if (data.waybill) {
        setMessage({
          type: "success",
          text: `Delhivery shipment created! AWB: ${data.waybill}`,
        });
        await loadOrders();
      } else {
        setMessage({
          type: "error",
          text: `Delhivery notice: ${data.error || "Could not manifest shipment"}`,
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to dispatch: " + err.message });
    } finally {
      setDispatchingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderDocId: string, orderId: string) => {
    if (!confirm(`Are you sure you want to permanently delete order ${orderId}?`)) return;

    setMessage(null);
    try {
      const res = await fetch(`/api/admin/orders?orderId=${encodeURIComponent(orderDocId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        await deleteOrder(orderDocId);
      }
      setMessage({ type: "success", text: `Order ${orderId} deleted.` });
      await loadOrders();
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to delete order: " + err.message });
    }
  };

  const statuses = ["ALL", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
            Order Fulfillment & Tracking
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-widest">
            Manage customer deliveries, Delhivery waybills & live order tracking
          </p>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs font-mono flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : "bg-red-950/40 border-red-500/40 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-neutral-400 hover:text-white underline text-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-[#0e130f] border border-neutral-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, customer, email, waybill..."
            className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-emerald-500 text-black font-bold"
                  : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-3xl bg-[#0d120e] border border-neutral-800/80">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-neutral-400 font-mono text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
            Loading live orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-neutral-400 font-mono text-xs">
            <ShoppingCart className="w-10 h-10 mx-auto text-neutral-400 mb-3" />
            No customer orders matching the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Order Details</th>
                  <th className="pb-3 px-3">Customer</th>
                  <th className="pb-3 px-3">Items</th>
                  <th className="pb-3 px-3">Amount</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Waybill / Tracking</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id || ord.orderId} className="hover:bg-neutral-900/40 transition-colors">
                    {/* Order ID & Date */}
                    <td className="py-4 px-3">
                      <div className="font-bold text-white text-sm font-sans">{ord.orderId}</div>
                      <div className="text-[10px] text-neutral-400">
                        {ord.createdAt?.toDate
                          ? ord.createdAt.toDate().toLocaleString("en-IN")
                          : "Recent"}
                      </div>
                      {ord.couponCode && (
                        <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                          {ord.couponCode} applied
                        </span>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-3 text-neutral-300">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      <div className="text-[10px] text-neutral-400">{ord.customerEmail}</div>
                      <div className="text-[10px] text-neutral-400">{ord.customerPhone}</div>
                    </td>

                    {/* Items */}
                    <td className="py-4 px-3 text-neutral-300">
                      <div className="space-y-1">
                        {ord.items?.map((item, idx) => (
                          <div key={idx} className="text-[11px] flex items-center gap-1.5">
                            <span className="text-emerald-400 font-bold">x{item.quantity}</span>
                            <span className="truncate max-w-[140px]">{item.name}</span>
                            <span className="text-[10px] text-neutral-400">({item.flavor})</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-3">
                      <div className="text-emerald-400 font-bold text-sm">
                        ₹{ord.finalTotal?.toLocaleString("en-IN")}
                      </div>
                      {ord.discountAmount > 0 && (
                        <div className="text-[10px] text-neutral-400">
                          Saved ₹{ord.discountAmount}
                        </div>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-3">
                      {ord.id ? (
                        <select
                          value={ord.status}
                          disabled={updatingStatusId === ord.id}
                          onChange={(e) =>
                            handleStatusChange(
                              ord.id!,
                              e.target.value as OrderRecord["status"]
                            )
                          }
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider focus:outline-none cursor-pointer border ${
                            ord.status === "DELIVERED"
                              ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                              : ord.status === "SHIPPED"
                              ? "bg-blue-950 text-blue-400 border-blue-800"
                              : ord.status === "CANCELLED"
                              ? "bg-red-950 text-red-400 border-red-800"
                              : "bg-amber-950 text-amber-400 border-amber-800"
                          }`}
                        >
                          <option value="PAID">PAID</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      ) : (
                        <span className="text-neutral-400">{ord.status}</span>
                      )}
                    </td>

                    {/* Waybill / Tracking */}
                    <td className="py-4 px-3">
                      {editingWaybillId === ord.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={waybillInput}
                            onChange={(e) => setWaybillInput(e.target.value)}
                            placeholder="Enter Delhivery AWB..."
                            className="bg-[#141a15] border border-emerald-500 rounded px-2 py-1 text-[11px] text-white focus:outline-none w-32"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveWaybill(ord.id!)}
                            disabled={savingWaybill}
                            className="p-1 rounded bg-emerald-500 text-black hover:bg-emerald-400"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingWaybillId(null)}
                            className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-neutral-300">
                            {ord.waybill || "No waybill"}
                          </span>
                          {ord.id && (
                            <button
                              onClick={() => {
                                setEditingWaybillId(ord.id!);
                                setWaybillInput(ord.waybill || "");
                              }}
                              className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                            >
                              {ord.waybill ? "Edit" : "+ Add"}
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDispatchDelhivery(ord)}
                          disabled={dispatchingOrderId === ord.orderId}
                          className="p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800 text-emerald-400 transition-colors cursor-pointer disabled:opacity-50"
                          title="Generate Delhivery Shipment & AWB"
                        >
                          {dispatchingOrderId === ord.orderId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Truck className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-emerald-400 transition-colors cursor-pointer"
                          title="View Full Order & Address"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {ord.id && (
                          <button
                            onClick={() => handleDeleteOrder(ord.id!, ord.orderId)}
                            className="p-2 rounded-lg bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 text-red-400 transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0e130f] border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto font-mono text-xs">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
                Order Breakdown
              </span>
              <h2 className="text-xl font-black uppercase text-white font-sans mt-1">
                {selectedOrder.orderId}
              </h2>
            </div>

            {/* Shipping Address */}
            <div className="p-4 rounded-2xl bg-[#141a15] border border-neutral-800 mb-6 space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Shipping Address & Contact
              </h3>
              <p className="text-white font-semibold">{selectedOrder.customerName}</p>
              <p className="text-neutral-300">{selectedOrder.shippingAddress?.address}</p>
              <p className="text-neutral-400">
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{" "}
                {selectedOrder.shippingAddress?.pincode}
              </p>
              <div className="pt-2 border-t border-neutral-800 flex flex-wrap gap-4 text-[11px] text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" /> {selectedOrder.customerEmail}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" /> {selectedOrder.customerPhone}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6 space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Ordered Products
              </h3>
              <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-2xl overflow-hidden">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="p-3 bg-[#111612] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                        {it.thumbnail ? (
                          <Image
                            src={it.thumbnail}
                            alt={it.name}
                            width={36}
                            height={36}
                            className="object-contain"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-neutral-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-bold font-sans text-xs">{it.name}</p>
                        <p className="text-[10px] text-neutral-400">
                          Flavor: <span className="text-emerald-400">{it.flavor}</span> • Qty: {it.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">
                        ₹{(it.numericPrice * it.quantity).toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] text-neutral-400">₹{it.numericPrice} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Math */}
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-1.5">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal:</span>
                <span>₹{selectedOrder.subtotal?.toLocaleString("en-IN")}</span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-purple-400">
                  <span>Discount ({selectedOrder.couponCode || "Coupon"}):</span>
                  <span>-₹{selectedOrder.discountAmount?.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                <span>Final Total Paid:</span>
                <span className="text-emerald-400">
                  ₹{selectedOrder.finalTotal?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleDispatchDelhivery(selectedOrder)}
                disabled={dispatchingOrderId === selectedOrder.orderId}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {dispatchingOrderId === selectedOrder.orderId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Truck className="w-4 h-4" />
                )}
                {selectedOrder.waybill ? "Re-manifest / Update Delhivery AWB" : "Generate Delhivery Shipment"}
              </button>

              <a
                href={`https://wa.me/91${selectedOrder.customerPhone?.replace(/[^0-9]/g, "").slice(-10)}?text=${encodeURIComponent(
                  `Hi ${selectedOrder.customerName}, your Stage & Steel order ${selectedOrder.orderId} is being prepared! Tracking AWB: ${selectedOrder.waybill || "Generating..."}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                Chat with Customer
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
