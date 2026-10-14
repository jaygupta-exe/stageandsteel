import { NextResponse } from "next/server";
import { generateVisitorReminderEmailHtml } from "@/lib/visitorEmailTemplate";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "Divesh";
  const withCart = searchParams.get("withCart") !== "false";

  const sampleViewedProducts = [
    {
      id: "whey-belgian-chocolate",
      name: "STAGE WHEY — BELGIAN CHOCOLATE",
      subtitle: "MICROFILTERED 100% PURE WHEY // RICH COCOA",
      category: "PROTEIN",
      price: "₹3,499",
      numericPrice: 3499,
      thumbnail: "/belgium-chocolate-cutout.png",
      viewedAt: new Date().toISOString(),
    },
    {
      id: "creatine-monohydrate",
      name: "PURE MICRONIZED CREATINE",
      subtitle: "100% ULTRA PURE CREATINE MONOHYDRATE",
      category: "CREATINE",
      price: "₹899",
      numericPrice: 899,
      thumbnail: "/creatine-cutout.png",
      viewedAt: new Date().toISOString(),
    },
  ];

  const sampleCartItems = withCart
    ? [
        {
          id: "whey-belgian-chocolate",
          name: "STAGE WHEY — BELGIAN CHOCOLATE",
          flavor: "Belgian Chocolate",
          quantity: 1,
          price: "₹3,499",
          numericPrice: 3499,
          thumbnail: "/belgium-chocolate-cutout.png",
        },
      ]
    : [];

  const { html, subject } = generateVisitorReminderEmailHtml({
    customerName: name,
    customerEmail: "athlete@stageandsteel.in",
    viewedProducts: sampleViewedProducts,
    cartItems: sampleCartItems,
    cartSubtotal: 3499,
    siteUrl: "https://stageandsteel.in",
  });

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Email-Subject": encodeURIComponent(subject),
    },
  });
}
