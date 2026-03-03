import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://breworder.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BrewOrder — POS System for Beverage Shops",
    template: "%s | BrewOrder",
  },
  description:
    "A complete point-of-sale system for beverage shops. Manage orders, products, toppings and vouchers in real-time. Built with .NET, React and React Native.",
  keywords: [
    "POS",
    "beverage shop",
    "order management",
    "point of sale",
    "coffee shop",
    "tea shop",
    "quán nước",
    "quản lý đơn hàng",
    "phần mềm quán trà sữa",
    "BrewOrder",
  ],
  authors: [{ name: "BrewOrder Team" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["vi_VN"],
    url: siteUrl,
    siteName: "BrewOrder",
    title: "BrewOrder — POS System for Beverage Shops",
    description:
      "A complete point-of-sale system for beverage shops. Manage orders, products, toppings and vouchers in real-time.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrewOrder — POS System for Beverage Shops",
    description:
      "A complete point-of-sale system for beverage shops. Manage orders, products, toppings and vouchers in real-time.",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
      "vi-VN": `${siteUrl}?lang=vi`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
