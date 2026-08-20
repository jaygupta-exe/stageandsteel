import type { Metadata } from "next";
import { Oswald, Barlow_Condensed, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import AuthModal from "@/components/AuthModal";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";

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

export const metadata: Metadata = {
  title: "STAGE & STEEL | Premium Sports Nutrition & Bodybuilding Supplements",
  description:
    "Engineered for performance. Built on discipline. Premium sports nutrition, 100% Whey Protein and Creatine Monohydrate.",
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
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
