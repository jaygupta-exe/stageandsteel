"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getAllOrders, OrderRecord } from "@/lib/orders";
import {
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  ShoppingCart,
  Package,
  TicketPercent,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Users,
  MapPin,
  Building,
} from "lucide-react";

export default function AdminSalesPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState<string>("august"); // Default to august as requested
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("VALID"); // "ALL", "VALID" (non-cancelled), "PAID", "DELIVERED", etc.
  const [exporting, setExporting] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await res.json();
      const list = data.orders || [];
      setOrders(list);
    } catch (err) {
      console.error("Error loading orders from API, falling back to SDK:", err);
      try {
        const sdkData = await getAllOrders();
        setOrders(sdkData);
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

  // Helper to parse order date safely
  const getOrderDate = (ord: OrderRecord): Date | null => {
    if (!ord.createdAt) return null;
    if (typeof ord.createdAt?.toDate === "function") {
      return ord.createdAt.toDate();
    }
    if (typeof ord.createdAt === "string") {
      const d = new Date(ord.createdAt);
      return isNaN(d.getTime()) ? null : d;
    }
    if (typeof ord.createdAt === "number") {
      return new Date(ord.createdAt);
    }
    return null;
  };

  // Filter orders based on date range and status
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    return orders.filter((ord) => {
      // 1. Status Filter
      if (statusFilter === "VALID") {
        if (ord.status === "CANCELLED") return false;
      } else if (statusFilter !== "ALL") {
        if (ord.status !== statusFilter) return false;
      }

      const orderDate = getOrderDate(ord);
      if (!orderDate) return selectedRange === "all";

      const orderTime = orderDate.getTime();

      // 2. Date Range Filter
      switch (selectedRange) {
        case "today": {
          const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
          return orderTime >= startOfToday;
        }
        case "yesterday": {
          const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime();
          const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
          return orderTime >= startOfYesterday && orderTime < endOfYesterday;
        }
        case "last7days": {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
          return orderTime >= sevenDaysAgo;
        }
        case "last30days": {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime();
          return orderTime >= thirtyDaysAgo;
        }
        case "thisMonth": {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
          return orderTime >= startOfMonth;
        }
        case "august": {
          // August (Month index 7) of current year or 2026/2025
          const augStart = new Date(currentYear, 7, 1, 0, 0, 0).getTime();
          const augEnd = new Date(currentYear, 8, 1, 0, 0, 0).getTime();
          return orderTime >= augStart && orderTime < augEnd;
        }
        case "september": {
          const sepStart = new Date(currentYear, 8, 1, 0, 0, 0).getTime();
          const sepEnd = new Date(currentYear, 9, 1, 0, 0, 0).getTime();
          return orderTime >= sepStart && orderTime < sepEnd;
        }
        case "july": {
          const julStart = new Date(currentYear, 6, 1, 0, 0, 0).getTime();
          const julEnd = new Date(currentYear, 7, 1, 0, 0, 0).getTime();
          return orderTime >= julStart && orderTime < julEnd;
        }
        case "custom": {
          if (!customStart && !customEnd) return true;
          let valid = true;
          if (customStart) {
            const start = new Date(customStart).getTime();
            if (orderTime < start) valid = false;
          }
          if (customEnd) {
            const end = new Date(customEnd + "T23:59:59").getTime();
            if (orderTime > end) valid = false;
          }
          return valid;
        }
        case "all":
        default:
          return true;
      }
    });
  }, [orders, selectedRange, customStart, customEnd, statusFilter]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    let totalGross = 0;
    let totalDiscount = 0;
    let totalNetRevenue = 0;
    let totalItemsCount = 0;

    const statusCounts: Record<string, number> = {
      PAID: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    filteredOrders.forEach((ord) => {
      const subtotal = ord.subtotal || ord.finalTotal || 0;
      const discount = ord.discountAmount || 0;
      const finalAmt = ord.finalTotal || 0;

      if (ord.status !== "CANCELLED") {
        totalGross += subtotal;
        totalDiscount += discount;
        totalNetRevenue += finalAmt;
      }

      if (statusCounts[ord.status] !== undefined) {
        statusCounts[ord.status]++;
      }

      (ord.items || []).forEach((item) => {
        totalItemsCount += item.quantity || 1;
      });
    });

    const nonCancelledOrders = filteredOrders.filter((o) => o.status !== "CANCELLED");
    const aov = nonCancelledOrders.length > 0 ? totalNetRevenue / nonCancelledOrders.length : 0;

    return {
      totalOrders: filteredOrders.length,
      validOrdersCount: nonCancelledOrders.length,
      totalGross,
      totalDiscount,
      totalNetRevenue,
      totalItemsCount,
      aov,
      statusCounts,
    };
  }, [filteredOrders]);

  // Product-wise sales breakdown
  const productBreakdown = useMemo(() => {
    const map = new Map<string, { name: string; flavor: string; units: number; revenue: number }>();

    filteredOrders.forEach((ord) => {
      if (ord.status === "CANCELLED") return;
      (ord.items || []).forEach((item) => {
        const key = `${item.name || "Item"}_${item.flavor || "Default"}`;
        const existing = map.get(key) || {
          name: item.name || "Stage & Steel Product",
          flavor: item.flavor || "Standard",
          units: 0,
          revenue: 0,
        };
        const qty = item.quantity || 1;
        const price = item.numericPrice || parseFloat(String(item.price || "0").replace(/[^0-9.]/g, "")) || 0;
        existing.units += qty;
        existing.revenue += price * qty;
        map.set(key, existing);
      });
    });

    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  // Coupon usage breakdown
  const couponBreakdown = useMemo(() => {
    const map = new Map<string, { code: string; count: number; totalDiscount: number; totalSales: number }>();

    filteredOrders.forEach((ord) => {
      if (ord.status === "CANCELLED") return;
      const code = ord.couponCode ? ord.couponCode.toUpperCase().trim() : "NO COUPON";
      const existing = map.get(code) || {
        code,
        count: 0,
        totalDiscount: 0,
        totalSales: 0,
      };
      existing.count += 1;
      existing.totalDiscount += ord.discountAmount || 0;
      existing.totalSales += ord.finalTotal || 0;
      map.set(code, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [filteredOrders]);

  // Daily Breakdown
  const dailyBreakdown = useMemo(() => {
    const map = new Map<string, { dateStr: string; dateObj: Date; orders: number; gross: number; discount: number; net: number }>();

    filteredOrders.forEach((ord) => {
      if (ord.status === "CANCELLED") return;
      const d = getOrderDate(ord);
      const key = d ? d.toISOString().split("T")[0] : "Undated";
      const existing = map.get(key) || {
        dateStr: d ? d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Undated",
        dateObj: d || new Date(0),
        orders: 0,
        gross: 0,
        discount: 0,
        net: 0,
      };
      existing.orders += 1;
      existing.gross += ord.subtotal || ord.finalTotal || 0;
      existing.discount += ord.discountAmount || 0;
      existing.net += ord.finalTotal || 0;
      map.set(key, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
  }, [filteredOrders]);

  // CSV Generator Helper
  const downloadCSV = (filename: string, rows: string[][]) => {
    const csvContent =
      "\uFEFF" +
      rows
        .map((row) =>
          row
            .map((val) => {
              if (val === null || val === undefined) return '""';
              const str = String(val).replace(/"/g, '""');
              return `"${str}"`;
            })
            .join(",")
        )
        .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 1. Export Detailed CA & Tax Audit Report
  const exportCAOrdersReport = () => {
    setExporting("ca");
    try {
      const headers = [
        "Order ID",
        "Order Date",
        "Order Time",
        "Status",
        "Customer Name",
        "Customer Phone",
        "Customer Email",
        "Shipping Address",
        "City",
        "State",
        "Pincode",
        "Items Details",
        "Total Quantity",
        "Gross Subtotal (INR)",
        "Discount Amount (INR)",
        "Coupon Code",
        "Final Amount Paid (INR)",
        "Payment Gateway",
        "Delhivery Waybill / AWB",
      ];

      const rows: string[][] = [headers];

      filteredOrders.forEach((ord) => {
        const d = getOrderDate(ord);
        const dateStr = d ? d.toLocaleDateString("en-IN") : "N/A";
        const timeStr = d ? d.toLocaleTimeString("en-IN") : "N/A";

        const itemsSummary = (ord.items || [])
          .map((i) => `${i.name || "Item"} [${i.flavor || "Standard"}] x${i.quantity || 1} (@Rs.${i.numericPrice || i.price})`)
          .join(" | ");

        const totalQty = (ord.items || []).reduce((sum, i) => sum + (i.quantity || 1), 0);

        rows.push([
          ord.orderId || (ord as any).order_id || ord.id || "",
          dateStr,
          timeStr,
          ord.status,
          ord.customerName || (ord as any).customer_name || "",
          ord.customerPhone || (ord as any).customer_phone || "",
          ord.customerEmail || (ord as any).customer_email || "",
          ord.shippingAddress?.address || "",
          ord.shippingAddress?.city || "",
          ord.shippingAddress?.state || "",
          ord.shippingAddress?.pincode || "",
          itemsSummary,
          String(totalQty),
          String(ord.subtotal || ord.finalTotal || 0),
          String(ord.discountAmount || 0),
          ord.couponCode || "NONE",
          String(ord.finalTotal || 0),
          ord.paymentGateway || "CASHFREE",
          ord.waybill || "NOT_ASSIGNED",
        ]);
      });

      const rangeLabel = selectedRange === "august" ? "August_Sales" : selectedRange;
      downloadCSV(`StageAndSteel_CA_Sales_Report_${rangeLabel}_${new Date().toISOString().split("T")[0]}.csv`, rows);
    } finally {
      setExporting(null);
    }
  };

  // 2. Export Daily Summary
  const exportDailySummary = () => {
    setExporting("daily");
    try {
      const headers = ["Date", "Orders Count", "Gross Sales (INR)", "Discounts (INR)", "Net Revenue (INR)", "Average Order Value (INR)"];
      const rows: string[][] = [headers];

      dailyBreakdown.forEach((item) => {
        const aov = item.orders > 0 ? (item.net / item.orders).toFixed(2) : "0";
        rows.push([
          item.dateStr,
          String(item.orders),
          item.gross.toFixed(2),
          item.discount.toFixed(2),
          item.net.toFixed(2),
          aov,
        ]);
      });

      downloadCSV(`StageAndSteel_Daily_Sales_Summary_${new Date().toISOString().split("T")[0]}.csv`, rows);
    } finally {
      setExporting(null);
    }
  };

  // 3. Export Product Sales
  const exportProductSummary = () => {
    setExporting("product");
    try {
      const headers = ["Product Name", "Flavor / Variant", "Units Sold", "Total Revenue (INR)", "Avg Unit Price (INR)"];
      const rows: string[][] = [headers];

      productBreakdown.forEach((item) => {
        const avgPrice = item.units > 0 ? (item.revenue / item.units).toFixed(2) : "0";
        rows.push([item.name, item.flavor, String(item.units), item.revenue.toFixed(2), avgPrice]);
      });

      downloadCSV(`StageAndSteel_Product_Sales_Breakdown_${new Date().toISOString().split("T")[0]}.csv`, rows);
    } finally {
      setExporting(null);
    }
  };

  // 4. Export Customer Contacts / Athletes
  const exportCustomerContacts = () => {
    setExporting("contacts");
    try {
      const map = new Map<string, { name: string; phone: string; email: string; city: string; state: string; ordersCount: number; totalSpent: number }>();

      filteredOrders.forEach((ord) => {
        const email = ord.customerEmail?.toLowerCase() || ord.customerPhone || "unknown";
        const existing = map.get(email) || {
          name: ord.customerName || "",
          phone: ord.customerPhone || "",
          email: ord.customerEmail || "",
          city: ord.shippingAddress?.city || "",
          state: ord.shippingAddress?.state || "",
          ordersCount: 0,
          totalSpent: 0,
        };
        existing.ordersCount += 1;
        existing.totalSpent += ord.finalTotal || 0;
        map.set(email, existing);
      });

      const headers = ["Customer Name", "Phone Number", "Email Address", "City", "State", "Orders Count", "Lifetime Spent (INR)"];
      const rows: string[][] = [headers];

      Array.from(map.values()).forEach((c) => {
        rows.push([c.name, c.phone, c.email, c.city, c.state, String(c.ordersCount), c.totalSpent.toFixed(2)]);
      });

      downloadCSV(`StageAndSteel_Customer_Directory_${new Date().toISOString().split("T")[0]}.csv`, rows);
    } finally {
      setExporting(null);
    }
  };

  const getRangeDisplayTitle = () => {
    switch (selectedRange) {
      case "august":
        return "August 2026";
      case "september":
        return "September 2026";
      case "july":
        return "July 2026";
      case "today":
        return "Today's Sales";
      case "yesterday":
        return "Yesterday's Sales";
      case "last7days":
        return "Last 7 Days";
      case "last30days":
        return "Last 30 Days";
      case "thisMonth":
        return "This Month";
      case "custom":
        return `Custom (${customStart || "Start"} to ${customEnd || "End"})`;
      case "all":
      default:
        return "All-Time Sales";
    }
  };

  return (
    <div className="space-y-8 print:bg-white print:text-black">
      {/* Top Header & Export Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
                Sales & Revenue Analytics
              </h1>
              <p className="text-xs font-mono text-neutral-400 mt-0.5 uppercase tracking-widest">
                Financial reports, CA audit data & CSV export center
              </p>
            </div>
          </div>
        </div>

        {/* Primary Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportCAOrdersReport}
            disabled={exporting !== null || filteredOrders.length === 0}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] cursor-pointer disabled:opacity-50"
            title="Download complete transaction report formatted for CA and GST accounting"
          >
            {exporting === "ca" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            <span>Export CA Sales Report (CSV)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Summary</span>
          </button>

          <button
            onClick={loadOrders}
            disabled={loading}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Date Range & Status Filters */}
      <div className="p-5 rounded-3xl bg-[#0c110d] border border-neutral-800/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
            <Calendar className="w-4 h-4" />
            <span>Select Time Period:</span>
            <span className="text-white font-bold bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-lg">
              {getRangeDisplayTitle()}
            </span>
          </div>

          {/* Quick status selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-neutral-400 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#141b16] border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 font-mono focus:border-emerald-500 focus:outline-none"
            >
              <option value="VALID">Non-Cancelled Orders (Standard)</option>
              <option value="ALL">All Orders (Including Cancelled)</option>
              <option value="PAID">Paid Only</option>
              <option value="PROCESSING">Processing Only</option>
              <option value="SHIPPED">Shipped Only</option>
              <option value="DELIVERED">Delivered Only</option>
              <option value="CANCELLED">Cancelled Only</option>
            </select>
          </div>
        </div>

        {/* Filter Buttons / Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "august", label: "August (CA Report)" },
            { id: "september", label: "September" },
            { id: "july", label: "July" },
            { id: "thisMonth", label: "This Month" },
            { id: "last30days", label: "Last 30 Days" },
            { id: "last7days", label: "Last 7 Days" },
            { id: "today", label: "Today" },
            { id: "yesterday", label: "Yesterday" },
            { id: "all", label: "All Time" },
            { id: "custom", label: "Custom Dates..." },
          ].map((preset) => {
            const isActive = selectedRange === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedRange(preset.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-500 text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    : "bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Custom Date Inputs (if custom is selected) */}
        {selectedRange === "custom" && (
          <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 uppercase">From:</span>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-[#141b16] border border-neutral-800 rounded-xl px-3 py-1.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 uppercase">To:</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-[#141b16] border border-neutral-800 rounded-xl px-3 py-1.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Revenue */}
        <div className="p-6 rounded-3xl bg-[#0d120e] border border-neutral-800 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Net Realized Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-sans text-white">
            ₹{metrics.totalNetRevenue.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mt-3 pt-3 border-t border-neutral-800/60">
            <span>Gross: ₹{metrics.totalGross.toLocaleString("en-IN")}</span>
            <span className="text-purple-400">-₹{metrics.totalDiscount.toLocaleString("en-IN")} disc.</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-3xl bg-[#0d120e] border border-neutral-800 relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-sans text-white">
            {metrics.validOrdersCount}{" "}
            <span className="text-xs font-mono text-neutral-400 font-normal">
              ({metrics.totalOrders} total)
            </span>
          </div>
          <div className="text-[11px] font-mono text-neutral-400 mt-3 pt-3 border-t border-neutral-800/60 flex items-center justify-between">
            <span>Delivered: {metrics.statusCounts.DELIVERED}</span>
            <span className="text-amber-400">Shipped: {metrics.statusCounts.SHIPPED}</span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="p-6 rounded-3xl bg-[#0d120e] border border-neutral-800 relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Avg. Order Value (AOV)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-sans text-white">
            ₹{Math.round(metrics.aov).toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] font-mono text-neutral-400 mt-3 pt-3 border-t border-neutral-800/60">
            Across {metrics.validOrdersCount} active customer orders
          </div>
        </div>

        {/* Units Sold */}
        <div className="p-6 rounded-3xl bg-[#0d120e] border border-neutral-800 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Units / Tubs Sold
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-sans text-white">
            {metrics.totalItemsCount}
          </div>
          <div className="text-[11px] font-mono text-purple-300 mt-3 pt-3 border-t border-neutral-800/60">
            Total product quantity dispatched
          </div>
        </div>
      </div>

      {/* Export Center Cards */}
      <div className="p-6 rounded-3xl bg-[#0d120e] border border-neutral-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Export Center & Reports
            </h2>
            <p className="text-xs font-mono text-neutral-400">
              Download clean CSV files ready for Microsoft Excel, Google Sheets, or Tally/Zoho Books
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: CA Audit */}
          <div className="p-4 rounded-2xl bg-[#111712] border border-neutral-800 flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-all">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-1">
                <Building className="w-4 h-4" />
                <span>CA & Tax Full Audit</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Detailed orders with customer info, addresses, waybills, and taxable totals.
              </p>
            </div>
            <button
              onClick={exportCAOrdersReport}
              disabled={exporting !== null}
              className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-mono uppercase font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download CA CSV
            </button>
          </div>

          {/* Card 2: Daily Sales */}
          <div className="p-4 rounded-2xl bg-[#111712] border border-neutral-800 flex flex-col justify-between space-y-3 hover:border-blue-500/40 transition-all">
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase mb-1">
                <Calendar className="w-4 h-4" />
                <span>Daily Sales Summary</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Day-by-day revenue, discount totals, order volume, and daily AOV.
              </p>
            </div>
            <button
              onClick={exportDailySummary}
              disabled={exporting !== null}
              className="w-full py-2 px-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-300 text-xs font-mono uppercase font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Daily CSV
            </button>
          </div>

          {/* Card 3: Product Breakdown */}
          <div className="p-4 rounded-2xl bg-[#111712] border border-neutral-800 flex flex-col justify-between space-y-3 hover:border-purple-500/40 transition-all">
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase mb-1">
                <Package className="w-4 h-4" />
                <span>Product Matrix</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Top selling flavors, total units sold, and revenue generated per SKU.
              </p>
            </div>
            <button
              onClick={exportProductSummary}
              disabled={exporting !== null}
              className="w-full py-2 px-3 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 text-xs font-mono uppercase font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Product CSV
            </button>
          </div>

          {/* Card 4: Customer Directory */}
          <div className="p-4 rounded-2xl bg-[#111712] border border-neutral-800 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-all">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase mb-1">
                <Users className="w-4 h-4" />
                <span>Customer Directory</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Athlete contact list with phone numbers, emails, locations, and lifetime spend.
              </p>
            </div>
            <button
              onClick={exportCustomerContacts}
              disabled={exporting !== null}
              className="w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono uppercase font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Contacts CSV
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Product Matrix & Coupon Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Sales Matrix */}
        <div className="p-6 rounded-3xl bg-[#0d120e] border border-neutral-800/80 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Product & Flavor Breakdown</span>
            </h2>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">
              {productBreakdown.length} Variants Sold
            </span>
          </div>

          {productBreakdown.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 font-mono text-xs">
              No product sales in this selected period.
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px]">
                    <th className="pb-2">Product / Variant</th>
                    <th className="pb-2 text-center">Units</th>
                    <th className="pb-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {productBreakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-900/30">
                      <td className="py-2.5 pr-2">
                        <div className="font-semibold text-white truncate max-w-[200px]">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-emerald-400">{item.flavor}</div>
                      </td>
                      <td className="py-2.5 text-center font-bold text-white">
                        {item.units}
                      </td>
                      <td className="py-2.5 text-right font-bold text-emerald-400">
                        ₹{item.revenue.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Coupon Code Performance */}
        <div className="p-6 rounded-3xl bg-[#0d120e] border border-neutral-800/80 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TicketPercent className="w-4 h-4 text-purple-400" />
              <span>Coupon Code Performance</span>
            </h2>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">
              {couponBreakdown.length} Codes Active
            </span>
          </div>

          {couponBreakdown.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 font-mono text-xs">
              No coupon transactions in this period.
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px]">
                    <th className="pb-2">Coupon Code</th>
                    <th className="pb-2 text-center">Orders</th>
                    <th className="pb-2 text-right">Discounts Given</th>
                    <th className="pb-2 text-right">Net Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {couponBreakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-900/30">
                      <td className="py-2.5 pr-2">
                        <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 font-bold text-[10px]">
                          {item.code}
                        </span>
                      </td>
                      <td className="py-2.5 text-center font-bold text-white">
                        {item.count}
                      </td>
                      <td className="py-2.5 text-right text-purple-400">
                        ₹{item.totalDiscount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-2.5 text-right font-bold text-emerald-400">
                        ₹{item.totalSales.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Daily Sales Breakdown Table */}
      <div className="p-6 rounded-3xl bg-[#0d120e] border border-neutral-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Daily Transaction Breakdown</span>
            </h2>
            <p className="text-[11px] font-mono text-neutral-400">
              Aggregated daily performance in {getRangeDisplayTitle()}
            </p>
          </div>

          <button
            onClick={exportDailySummary}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer w-fit"
          >
            <Download className="w-3.5 h-3.5" /> Export Daily CSV
          </button>
        </div>

        {dailyBreakdown.length === 0 ? (
          <div className="py-12 text-center text-neutral-400 font-mono text-xs">
            No daily transactions found for this date selection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px]">
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3 text-center">Orders</th>
                  <th className="pb-3 px-3 text-right">Gross Amount</th>
                  <th className="pb-3 px-3 text-right">Discount</th>
                  <th className="pb-3 px-3 text-right">Net Revenue</th>
                  <th className="pb-3 px-3 text-right">Avg. Order Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {dailyBreakdown.map((row, idx) => {
                  const aov = row.orders > 0 ? row.net / row.orders : 0;
                  return (
                    <tr key={idx} className="hover:bg-neutral-900/40">
                      <td className="py-3 px-3 font-semibold text-white">{row.dateStr}</td>
                      <td className="py-3 px-3 text-center font-bold text-white">
                        <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40">
                          {row.orders}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-neutral-300">
                        ₹{row.gross.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-3 text-right text-purple-400">
                        {row.discount > 0 ? `-₹${row.discount.toLocaleString("en-IN")}` : "₹0"}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400">
                        ₹{row.net.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-3 text-right text-neutral-400">
                        ₹{Math.round(aov).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick link to live orders */}
      <div className="p-4 rounded-2xl bg-[#0a0f0b] border border-neutral-800 flex items-center justify-between">
        <span className="text-xs font-mono text-neutral-400">
          Looking for tracking, Delhivery AWB dispatch or customer delivery updates?
        </span>
        <Link
          href="/admin/orders"
          className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 uppercase"
        >
          Go to Live Orders <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
