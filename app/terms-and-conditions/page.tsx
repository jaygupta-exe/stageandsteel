import React from "react";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Stage & Steel",
  description: "Terms of service and legal agreement for Stage & Steel supplement store.",
};

export default function TermsAndConditionsPage() {
  return (
    <PolicyPageLayout
      title="TERMS & CONDITIONS"
      badge="LEGAL AGREEMENT & USE"
      lastUpdated="AUGUST 2026"
    >
      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          1. ACCEPTANCE OF TERMS
        </h2>
        <p>
          By visiting <strong>stageandsteel.in</strong> or purchasing any dietary supplement or athletic nutritional product, you agree to comply with and be bound by these Terms and Conditions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          2. NUTRITIONAL &amp; DIETARY ADVISORY
        </h2>
        <p>
          Products listed on this platform are nutritional and dietary supplements. Statements regarding our supplements have not been evaluated for medical diagnostic or curative purposes. Individuals under 18, pregnant/nursing mothers, or individuals with pre-existing medical conditions should consult a certified healthcare practitioner before commencing supplement use.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          3. PRICING &amp; AVAILABILITY
        </h2>
        <p>
          Prices are listed in Indian Rupees (INR) and include all applicable taxes (GST). We reserve the right to modify prices, batch specifications, and promotional offerings without prior notice.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          4. GOVERNING LAW &amp; JURISDICTION
        </h2>
        <p>
          These Terms of Service and any transactional disputes arising therefrom shall be governed by the laws of India, with exclusive jurisdiction in the competent courts of <strong>New Delhi, India</strong>.
        </p>
      </section>
    </PolicyPageLayout>
  );
}
