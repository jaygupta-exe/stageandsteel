"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProducts, seedProducts } from "@/lib/products";
import { getAllOrders, OrderRecord } from "@/lib/orders";
import { getAllCoupons, seedCoupons } from "@/lib/coupons";
import {
  Package,
  ShoppingCart,
  TicketPercent,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Database,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Truck,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [productsCount, setProductsCount] = useState<number>(0);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [couponsCount, setCouponsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ords, coups] = await Promise.all([
        getAllProducts(),
        getAllOrders(),
        getAllCoupons(),
      ]);
      setProductsCount(prods.length);
      setOrders(ords);
      setCouponsCount(coups.length);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeedDatabase = async () => {
    if (
      !confirm(
        "Do you want to initialize/sync default Stage & Steel products and coupon codes into Firestore?"
      )
    )
      return;

    setSeeding(true);
    setSeedSuccess(null);
    try {
      const [pRes, cRes] = await Promise.all([seedProducts(), seedCoupons()]);
      setSeedSuccess(
        `Successfully synced ${pRes.count} products and ${cRes.count} coupons to Firestore!`
      );
      await loadData();
    } catch (err: any) {
      alert("Seeding failed: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => {
    return order.status !== "CANCELLED" ? sum + (order.finalTotal || 0) : sum;
  }, 0);

  const pendingOrders = orders.filter(
    (o) => o.status === "PAID" || o.status === "PROCESSING"
  );
  const shippedOrders = orders.filter((o) => o.status === "SHIPPED");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
            Command Center
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-widest">
            Real-time overview of inventory, live orders & promotional systems
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            title="Seed default catalog & coupons into Firestore"
          >
            {seeding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Database className="w-3.5 h-3.5" />
            )}
            <span>Sync Default Data</span>
          </button>

          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Success notification banner */}
      {seedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{seedSuccess}</span>
          </div>
          <button
            onClick={() => setSeedSuccess(null)}
            className="text-neutral-400 hover:text-white text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-6 rounded-2xl bg-[#0f1410] border border-neutral-800 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black font-sans text-white">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] font-mono text-neutral-400 mt-2">
            Across {orders.length} total customer orders
          </p>
        </div>

        {/* Pending Shipments */}
        <div className="p-6 rounded-2xl bg-[#0f1410] border border-neutral-800 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black font-sans text-amber-400">
            {pendingOrders.length}
          </div>
          <p className="text-[10px] font-mono text-neutral-400 mt-2">
            Awaiting dispatch & waybill creation
          </p>
        </div>

        {/* Active Products */}
        <div className="p-6 rounded-2xl bg-[#0f1410] border border-neutral-800 relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Live Products
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black font-sans text-white">
            {productsCount}
          </div>
          <p className="text-[10px] font-mono text-neutral-400 mt-2">
            In store catalog & checkout
          </p>
        </div>

        {/* Active Coupons */}
        <div className="p-6 rounded-2xl bg-[#0f1410] border border-neutral-800 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Coupons Active
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TicketPercent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black font-sans text-white">
            {couponsCount}
          </div>
          <p className="text-[10px] font-mono text-neutral-400 mt-2">
            Discount codes configured
          </p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/products"
          className="p-5 rounded-2xl bg-[#0c100d] border border-neutral-800/80 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white uppercase group-hover:text-emerald-400 transition-colors">
                Manage Products
              </h3>
              <p className="text-[11px] text-neutral-400">Add, edit pricing, stock & specs</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </Link>

        <Link
          href="/admin/orders"
          className="p-5 rounded-2xl bg-[#0c100d] border border-neutral-800/80 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white uppercase group-hover:text-emerald-400 transition-colors">
                Order Fulfillment
              </h3>
              <p className="text-[11px] text-neutral-400">Update shipping & tracking IDs</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </Link>

        <Link
          href="/admin/content"
          className="p-5 rounded-2xl bg-[#0c100d] border border-neutral-800/80 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white uppercase group-hover:text-emerald-400 transition-colors">
                Live Site Content
              </h3>
              <p className="text-[11px] text-neutral-400">Edit announcements & banners</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 rounded-3xl bg-[#0d120e] border border-neutral-800/80">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black uppercase tracking-wider text-white">
              Recent Customer Orders
            </h2>
            <p className="text-xs font-mono text-neutral-400">
              Live transactions synced from Cloud Firestore
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-mono text-emerald-400 hover:underline uppercase tracking-wider flex items-center gap-1"
          >
            View All ({orders.length}) <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-neutral-400 font-mono text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mb-2" />
            Fetching live orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 font-mono text-xs bg-neutral-900/30 rounded-2xl border border-dashed border-neutral-800">
            <ShoppingCart className="w-8 h-8 mx-auto text-neutral-400 mb-3" />
            No customer orders recorded yet. They will appear here automatically when payments are completed.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono uppercase tracking-wider">
                  <th className="pb-3 px-3">Order ID</th>
                  <th className="pb-3 px-3">Customer</th>
                  <th className="pb-3 px-3">Items</th>
                  <th className="pb-3 px-3">Total</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id || order.orderId} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3.5 px-3 text-white font-bold">{order.orderId}</td>
                    <td className="py-3.5 px-3 text-neutral-300">
                      <div>{order.customerName}</div>
                      <div className="text-[10px] text-neutral-400">{order.customerEmail}</div>
                    </td>
                    <td className="py-3.5 px-3 text-neutral-400">
                      {order.items?.length || 0} product(s)
                    </td>
                    <td className="py-3.5 px-3 text-emerald-400 font-bold">
                      ₹{order.finalTotal?.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : order.status === "SHIPPED"
                            ? "bg-blue-950 text-blue-400 border border-blue-800"
                            : order.status === "CANCELLED"
                            ? "bg-red-950 text-red-400 border border-red-800"
                            : "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-neutral-400 text-[11px]">
                      {order.waybill || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
