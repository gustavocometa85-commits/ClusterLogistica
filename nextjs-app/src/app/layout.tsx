import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/shared/ui/app-shell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Clúster Logística",
  description: "Gestión de flotas y logística",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="bg-surface-subtle text-text-primary antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
