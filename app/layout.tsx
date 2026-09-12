import type { Metadata } from "next";
import { Oswald, Barlow_Condensed, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import AuthModal from "@/components/AuthModal";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import LaunchCouponModal from "@/components/LaunchCouponModal";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = "https://stageandsteel.in";
const siteName = "Stage & Steel";
const siteDescription =
  "India's premium athlete-grade sports nutrition. 100% Microfiltered Whey Protein, Micronized Creatine Monohydrate, EAA + Electrolytes. HPLC lab-tested. Zero amino spiking. Free express delivery pan-India.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "STAGE & STEEL | Premium Sports Nutrition & Bodybuilding Supplements India",
    template: "%s | Stage & Steel",
  },
  description: siteDescription,
  keywords: [
    "whey protein",
    "creatine monohydrate",
    "EAA supplements",
    "sports nutrition India",
    "bodybuilding supplements",
    "Stage and Steel",
    "premium protein powder",
    "microfiltered whey",
    "HPLC tested protein",
    "gym supplements",
    "muscle building",
    "athlete nutrition",
    "whey protein India",
    "creatine India",
    "Belgian chocolate whey",
    "salted caramel whey",
    "cafe mocha yeast protein",
    "yeast protein",
    "bio-fermented yeast protein",
    "orange creatine",
    "pineapple creatine",
    "EAA cola",
    "free delivery supplements",
  ],
  authors: [
    { name: "Stage & Steel", url: siteUrl },
    { name: "Divesh Mehan" },
    { name: "Ashish Yadav" },
  ],
  creator: "Stage & Steel",
  publisher: "Stage & Steel / Sands Nutrition",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName,
    title: "STAGE & STEEL — Premium Athlete-Grade Sports Nutrition",
    description: siteDescription,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Stage & Steel — Premium Sports Nutrition",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STAGE & STEEL — Premium Sports Nutrition",
    description: siteDescription,
    images: ["/og-image.jpg"],
    creator: "@stageandsteel",
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  category: "Sports Nutrition",
  other: {
    "theme-color": "#596238",
    "msapplication-TileColor": "#596238",
    "apple-mobile-web-app-title": "Stage & Steel",
    "application-name": "Stage & Steel",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${oswald.variable} ${barlowCondensed.variable} ${spaceGrotesk.variable} ${inter.variable} antialiased selection:bg-[#596238] selection:text-[#F4F4F1]`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#A8A7A3] text-[#151515] font-sans relative overflow-x-hidden"
      >
        <AuthProvider>
          <CartProvider>
            {children}
            <AuthModal />
            <CartDrawer />
            <CheckoutModal />
            <WhatsAppWidget />
            <LaunchCouponModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
