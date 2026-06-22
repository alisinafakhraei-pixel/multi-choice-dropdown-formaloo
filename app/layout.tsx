import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DemoNav } from "@/components/demo-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Multi-select Dropdown — Formaloo PRD Demo",
  description: "Interactive prototype for the Multi-select Dropdown field PRD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full flex">
        <DemoNav />
        <div className="flex-1 overflow-auto">{children}</div>
      </body>
    </html>
  );
}
