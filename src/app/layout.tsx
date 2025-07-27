import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Steal for Brands - See it. Steal it. Style your brand.",
  description:
    "Extract any aesthetic from reference images and apply it to your brand content with AI-powered precision.",
  keywords: ["AI", "brand", "design", "aesthetic", "styling", "premium"],
  authors: [{ name: "Steal for Brands Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Steal for Brands - See it. Steal it. Style your brand.",
    description:
      "Extract any aesthetic from reference images and apply it to your brand content with AI-powered precision.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Steal for Brands - See it. Steal it. Style your brand.",
    description:
      "Extract any aesthetic from reference images and apply it to your brand content with AI-powered precision.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
