"use client";

import React, { useState } from "react";
import { X, Search, Truck, CheckCircle, Package, Clock, MapPin, AlertCircle } from "lucide-react";

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderTrackerModal({ isOpen, onClose }: OrderTrackerModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const isWaybill = /^\d+$/.test(query.trim());
      const param = isWaybill ? `waybill=${query.trim()}` : `orderId=${query.trim()}`;

      const res = await fetch(`/api/delhivery/track?${param}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Tracking lookup failed");
      }

      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Could not retrieve tracking details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0c0d0c]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#161715] border border-[#333530] text-[#F4F4F1] shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        <div className="h-1 bg-gradient-to-r from-[#596238] via-[#8FA355] to-[#596238]" />

        {/* Header */}
        <div className="p-5 border-b border-[#292a26] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-[#596238]/20 border border-[#596238]/50 flex items-center justify-center text-[#9DB25E]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#9DB25E] uppercase font-bold block">
                DELHIVERY B2C LOGISTICS // LIVE RADAR
              </span>
              <h3 className="text-lg font-editorial font-bold uppercase text-white">
                TRACK YOUR SHIPMENT
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#9c9e99] hover:text-white hover:bg-[#252723] rounded-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <form onSubmit={handleTrack} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777873]" />
              <input
                type="text"
                required
                placeholder="Enter Delhivery AWB / Order ID (e.g. SS_...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#0d0e0d] border border-[#333530] focus:border-[#8FA355] text-white text-xs pl-9 pr-3 py-2.5 placeholder:text-[#555652] focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 bg-[#596238] hover:bg-[#687342] text-white font-editorial text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer disabled:opacity-60 shrink-0 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "TRACK"
              )}
            </button>
          </form>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-4 bg-[#0e0f0e] border border-[#262824] space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#222420] pb-2">
                <span className="text-[10px] font-mono text-[#8c8e88] uppercase">SHIPMENT STATUS:</span>
                <span className="px-2 py-0.5 bg-[#596238]/30 border border-[#596238] text-[#9DB25E] text-[10px] font-mono font-bold uppercase rounded-xs">
                  {result.status || "IN TRANSIT"}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {result.origin && (
                  <div className="flex items-start gap-2 text-[#D4D3CD]">
                    <MapPin className="w-3.5 h-3.5 text-[#8FA355] shrink-0 mt-0.5" />
                    <span>ORIGIN: {result.origin}</span>
                  </div>
                )}
                {result.destination && (
                  <div className="flex items-start gap-2 text-[#D4D3CD]">
                    <Package className="w-3.5 h-3.5 text-[#8FA355] shrink-0 mt-0.5" />
                    <span>DESTINATION: {result.destination}</span>
                  </div>
                )}
                {result.expectedDelivery && (
                  <div className="flex items-start gap-2 text-[#D4D3CD]">
                    <Clock className="w-3.5 h-3.5 text-[#8FA355] shrink-0 mt-0.5" />
                    <span>ESTIMATED DELIVERY: {new Date(result.expectedDelivery).toDateString()}</span>
                  </div>
                )}
                {result.message && (
                  <p className="text-[#9c9e99] text-[11px] pt-1">
                    {result.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#101110] px-5 py-3 border-t border-[#292a26] flex items-center justify-between text-[10px] font-mono text-[#777873]">
          <span>DELHIVERY SURFACE B2C API</span>
          <span>SANDS NUTRITION SURFACE</span>
        </div>
      </div>
    </div>
  );
}
