import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "VPN Manager - لوحة التحكم",
  description: "لوحة تحكم احترافية لإدارة اتصالات VPN و V2Ray/Xray",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-dark-bg text-text-primary antialiased min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
