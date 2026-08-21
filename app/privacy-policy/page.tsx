import React from "react";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Stage & Steel",
  description: "User privacy, 256-bit encryption, and data protection practices at Stage & Steel.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageLayout
      title="PRIVACY POLICY & DATA SECURITY"
      badge="256-BIT ENCRYPTION & DATA INTEGRITY"
      lastUpdated="AUGUST 2026"
    >
      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          1. INFORMATION COLLECTED
        </h2>
        <p>
          Stage &amp; Steel collects basic customer contact details (Name, Delivery Address, Mobile Number, Email Address, Pincode) strictly to execute order fulfillments, generate shipping waybills, and communicate order tracking updates.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          2. ZERO STORAGE OF FINANCIAL OR CARD DATA
        </h2>
        <p>
          We do not store, capture, or log your credit card numbers, CVVs, net banking credentials, or UPI PINs. All financial payments are encrypted and processed through <strong>Cashfree Payments India Pvt. Ltd.</strong>, an RBI-authorized, PCI-DSS Level 1 compliant payment gateway.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          3. LOGISTICS DISCLOSURE
        </h2>
        <p>
          We share your contact name, phone number, and delivery address solely with our authorized courier partner, <strong>Delhivery</strong>, for dispatch routing and delivery coordination.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          4. ZERO SPAM &amp; DATA PROTECTION
        </h2>
        <p>
          We do not sell, rent, or trade your personal data to any external marketing agencies or data aggregators. Your information is strictly used for order fulfillment and direct brand support.
        </p>
      </section>
    </PolicyPageLayout>
  );
}
