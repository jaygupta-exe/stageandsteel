import React from "react";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Stage & Steel",
  description: "Pan-India Express shipping timelines and delivery policies for Stage & Steel.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPageLayout
      title="SHIPPING & DELIVERY POLICY"
      badge="EXPRESS PAN-INDIA LOGISTICS"
      lastUpdated="AUGUST 2026"
    >
      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          1. ORDER DISPATCH TIMELINE
        </h2>
        <p>
          All orders placed on <strong>stageandsteel.in</strong> are fulfilled from our central dispatch hub in <strong>Paschim Vihar, New Delhi - 110063</strong>. Confirmed orders are dispatched within <strong>24 to 48 hours</strong> (excluding national holidays and Sundays).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          2. ESTIMATED DELIVERY TIMES
        </h2>
        <p>
          We partner exclusively with <strong>Delhivery Express B2C</strong> to provide fast, reliable door-to-door delivery across India:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs my-3">
          <div className="p-3 bg-[#0D0D0C] border border-white/10 rounded-lg">
            <span className="text-[#9DB25E] font-bold block mb-1">DELHI NCR</span>
            <span className="text-white text-sm font-display font-bold">1–2 BUSINESS DAYS</span>
          </div>
          <div className="p-3 bg-[#0D0D0C] border border-white/10 rounded-lg">
            <span className="text-[#9DB25E] font-bold block mb-1">METRO CITIES</span>
            <span className="text-white text-sm font-display font-bold">2–4 BUSINESS DAYS</span>
          </div>
          <div className="p-3 bg-[#0D0D0C] border border-white/10 rounded-lg">
            <span className="text-[#9DB25E] font-bold block mb-1">REST OF INDIA</span>
            <span className="text-white text-sm font-display font-bold">3–6 BUSINESS DAYS</span>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          3. SHIPPING FEES
        </h2>
        <p>
          We offer <strong>FREE PAN-INDIA SHIPPING</strong> on all prepaid supplement orders nationwide. There are zero hidden convenience or packaging charges.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          4. SHIPMENT TRACKING &amp; AWB
        </h2>
        <p>
          Once your package is picked up by Delhivery, an official <strong>Air Waybill (AWB)</strong> tracking number is generated. You can track your shipment anytime via the <strong>Track Order</strong> tab on our homepage or directly on Delhivery’s tracking portal.
        </p>
      </section>
    </PolicyPageLayout>
  );
}
