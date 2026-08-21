import React from "react";
import HeroSection from "@/components/Hero";
import ProductCatalog from "@/components/ProductCatalog";
import AboutFounders from "@/components/AboutFounders";
import ContactSection from "@/components/ContactSection";

// JSON-LD Structured Data for Google Rich Results
function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Stage & Steel",
    alternateName: "Sands Nutrition",
    url: "https://stageandsteel.in",
    logo: "https://stageandsteel.in/logo.png",
    description:
      "India's premium athlete-grade sports nutrition. 100% Microfiltered Whey Protein, Micronized Creatine, EAA supplements.",
    foundingDate: "2024",
    founders: [
      { "@type": "Person", name: "Divesh Mehan" },
      { "@type": "Person", name: "Ashish Yadav" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-97791-59169",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+91-99991-93383",
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "D-74 Shubham Enclave",
      addressLocality: "Paschim Vihar",
      addressRegion: "Delhi",
      postalCode: "110063",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.instagram.com/stageandsteel.in",
    ],
    email: "Stageandsteel26@gmail.com",
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Stage & Steel",
    url: "https://stageandsteel.in",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://stageandsteel.in/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const products = [
    {
      "@type": "Product",
      name: "Stage & Steel 100% Microfiltered Whey Protein — Belgian Chocolate",
      description:
        "Premium microfiltered whey protein concentrate, 25g protein per scoop, 30 servings, 1kg. HPLC lab-tested. Zero amino spiking.",
      image: "https://stageandsteel.in/3FE6F1C2-86DE-4FA5-9EB3-1702E846C994-removebg-preview.png",
      brand: { "@type": "Brand", name: "Stage & Steel" },
      sku: "SS-WP-BC-1KG",
      offers: {
        "@type": "Offer",
        url: "https://stageandsteel.in/#products",
        priceCurrency: "INR",
        price: "2599",
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "Stage & Steel" },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "INR" },
          deliveryTime: { "@type": "ShippingDeliveryTime", handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" }, transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 5, unitCode: "DAY" } },
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "127",
      },
    },
    {
      "@type": "Product",
      name: "Stage & Steel 100% Microfiltered Whey Protein — Salted Caramel",
      description:
        "Premium microfiltered whey protein, 25g protein, 6.1g BCAAs, 30 servings, 1kg. Ultra-smooth salted caramel flavor.",
      image: "https://stageandsteel.in/salted caramel/Whey_protein.JPG-removebg-preview.png",
      brand: { "@type": "Brand", name: "Stage & Steel" },
      sku: "SS-WP-SC-1KG",
      offers: {
        "@type": "Offer",
        url: "https://stageandsteel.in/#products",
        priceCurrency: "INR",
        price: "2599",
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "Stage & Steel" },
      },
    },
    {
      "@type": "Product",
      name: "Stage & Steel Micronized Creatine Monohydrate — Orange",
      description:
        "85 servings, 3000mg creatine + 40mg Vitamin C per scoop, 300g. Micronized for rapid absorption.",
      image: "https://stageandsteel.in/creatine orange flavour/1_k.jpg-removebg-preview (1).png",
      brand: { "@type": "Brand", name: "Stage & Steel" },
      sku: "SS-CR-OR-300G",
      offers: {
        "@type": "Offer",
        url: "https://stageandsteel.in/#products",
        priceCurrency: "INR",
        price: "799",
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "Stage & Steel" },
      },
    },
    {
      "@type": "Product",
      name: "Stage & Steel EAA + Electrolytes — Cola Blast",
      description:
        "6.45g EAAs, 4g BCAAs, electrolytes, 30 servings, 255g. Essential amino acids for recovery.",
      brand: { "@type": "Brand", name: "Stage & Steel" },
      sku: "SS-EAA-COLA-255G",
      offers: {
        "@type": "Offer",
        url: "https://stageandsteel.in/#products",
        priceCurrency: "INR",
        price: "1299",
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "Stage & Steel" },
      },
    },
  ];

  const productListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Stage & Steel Supplements",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: product,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productListSchema),
        }}
      />
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#A8A7A3] text-[#151515] relative selection:bg-[#596238] selection:text-[#F4F4F1] overflow-x-hidden">
      <StructuredData />
      <HeroSection />
      <ProductCatalog />
      <AboutFounders />
      <ContactSection />
    </main>
  );
}
