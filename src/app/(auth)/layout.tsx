import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WhatsDash - Sign In",
  description: "Sign in to your WhatsDash business messaging dashboard",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
