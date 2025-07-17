import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthGate } from "@/components/layout/auth-gate";

export const metadata: Metadata = {
  title: "Clarity - ADHD-Friendly Project Management",
  description: "A centralized, ADHD-friendly dashboard for developers to manage projects without decision paralysis or context switching overhead.",
  keywords: ["ADHD", "project management", "productivity", "developers", "dashboard"],
  authors: [{ name: "farajabien" }],
  creator: "farajabien",
  openGraph: {
    title: "Clarity - ADHD-Friendly Project Management",
    description: "Manage your projects with clarity and focus. Built for developers with ADHD.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clarity - ADHD-Friendly Project Management",
    description: "Manage your projects with clarity and focus. Built for developers with ADHD.",
  },
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {children}
        <AuthGate />
        <Toaster />
      </body>
    </html>
  );
}