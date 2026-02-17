"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLogin = pathname.startsWith("/login");

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-[#2c3e50] flex items-center px-4 z-30 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-white text-2xl mr-3"
          aria-label="Abrir menú"
        >
          ☰
        </button>
        <span className="text-[#f1c40f] font-bold text-sm">Clúster Logística</span>
      </div>

      <main className="min-h-screen md:ml-60 pt-14 md:pt-0 p-4 md:p-6">
        {children}
      </main>
    </>
  );
}
