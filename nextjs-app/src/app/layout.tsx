import type { Metadata } from "next";
import { AppShell } from "@/shared/ui/app-shell";
import "./globals.css";

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
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
