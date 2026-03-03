import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrewOrder — POS System for Beverage Shops",
  description: "A complete point-of-sale system for beverage shops. Manage orders, products, toppings and vouchers in real-time. Built with .NET, React and React Native.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
