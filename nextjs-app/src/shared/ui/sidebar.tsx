"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/calendario", label: "Calendario", icon: "📅" },
  { href: "/historial", label: "Historial", icon: "📋" },
  { href: "/flota", label: "Flota", icon: "🚛" },
  { href: "/costos", label: "Costos", icon: "💰" },
  { href: "/incidencias", label: "Incidencias", icon: "⚠️" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop — mobile only */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-60 bg-[#2c3e50] text-white flex flex-col z-50 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#f1c40f]">Clúster Logística</h1>
            <p className="text-xs text-white/60 mt-1">Gestión de Flotas</p>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="md:hidden text-white/60 hover:text-white text-xl"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-white/10 text-[#f1c40f] border-r-2 border-[#f1c40f]"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full text-left text-sm text-white/60 hover:text-white transition-colors"
            >
              Cerrar Sesión
            </button>
          </form>
          <p className="text-xs text-white/40">v2.0 — Next.js + Supabase</p>
        </div>
      </aside>
    </>
  );
}
