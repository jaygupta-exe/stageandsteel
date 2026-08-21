import React from "react";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Stage & Steel",
  description: "7-Day Replacement and Refund Policy for Stage & Steel sports nutrition supplements.",
};

export default function RefundPolicyPage() {
  return (
    <PolicyPageLayout
      title="REFUND & CANCELLATION POLICY"
      badge="CUSTOMER PROTECTION & REPLACEMENTS"
      lastUpdated="AUGUST 2026"
    >
      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          1. 7-DAY REPLACEMENT GUARANTEE
        </h2>
        <p>
          At <strong>Stage &amp; Steel (S AND S Nutrition Partners)</strong>, we manufacture and distribute certified sports nutrition supplements engineered to strict purity standards. We offer a <strong>7-Day Free Replacement</strong> from the date of confirmed delivery for:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-[#A3A29E]">
          <li>Products received with physical transit damage, leaks, or broken outer/inner induction seals.</li>
          <li>Products differing from the ordered SKU, size, or flavor (e.g. dispatched incorrect flavor).</li>
          <li>Products received past their marked manufacturing or best-before expiration date.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          2. NON-RETURNABLE CONDITIONS
        </h2>
        <p>
          Due to safety and hygiene protocols governing ingestible food and dietary nutraceuticals (FSSAI norms), returns/replacements cannot be accepted under the following conditions:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-[#A3A29E]">
          <li>Products whose original tamper-evident safety seals have been opened and consumed (unless an authentic lab verified defect is proven).</li>
          <li>Damages arising from improper customer storage (e.g., direct heat/sunlight, moisture contamination).</li>
          <li>Claims submitted after 7 calendar days from confirmed delivery.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          3. HOW TO INITIATE A REPLACEMENT OR REFUND
        </h2>
        <p>
          To file a replacement or refund claim, contact our support team with your order details:
        </p>
        <div className="p-4 bg-[#0E0E0D] border border-white/10 rounded-xl space-y-1 font-mono text-xs text-[#9DB25E]">
          <p>• Provide Order ID (e.g., SS_1787236951013_986)</p>
          <p>• Attach clear photos or unboxing video showing the defect and batch number</p>
          <p>• Official Email: Stageandsteel26@gmail.com</p>
          <p>• WhatsApp Desk: +91 99991 93383 / +91 97791 59169</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          4. REFUND PROCESSING TIMELINES
        </h2>
        <p>
          Upon approval of a monetary refund, funds are returned directly to the customer’s original source account (UPI, Debit/Credit Card, Netbanking) via Cashfree PG within <strong>5 to 7 business days</strong>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          5. ORDER CANCELLATIONS
        </h2>
        <p>
          Orders can be cancelled at any time prior to Delhivery courier manifest generation. Once handed over to Delhivery logistics with an active AWB, the order cannot be cancelled in transit.
        </p>
      </section>
    </PolicyPageLayout>
  );
}
