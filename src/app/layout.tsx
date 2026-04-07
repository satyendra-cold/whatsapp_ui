import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhatsDash",
  description: "WhatsApp Business Messaging Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full w-full bg-[#111b21] text-[#e9edef]" style={{ fontFamily: 'Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
