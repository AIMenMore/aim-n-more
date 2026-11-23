import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LangProvider } from "@/components/LangProvider";
import { getLang } from "@/lib/lang-server";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aim & More | Nail · Pedicure · Waxing · PMU – Suriname",
  description:
    "Because you deserve good brows and sexy lips, every day. Premium beauty services in Suriname — nails, pedicures, waxing, and permanent make-up by Shea.",
  openGraph: {
    title: "Aim & More",
    description: "Because you deserve good brows and sexy lips, every day.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();
  return (
    <html lang={lang} className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <LangProvider lang={lang}>
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
