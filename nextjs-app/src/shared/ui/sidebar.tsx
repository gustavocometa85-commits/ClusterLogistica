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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-brand-900 text-white flex flex-col z-50 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Brand header */}
        <div className="px-7 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-accent-500">
              Clúster
            </h1>
            <p className="text-xs text-white/40 mt-0.5 tracking-wide uppercase">
              Logística
            </p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-white/40 hover:text-white transition-colors"
            aria-label="Cerrar menú"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-button text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-accent-400"
                    : "text-white/60 hover:bg-white/5 hover:text-white/90"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-7 py-6 border-t border-white/5 space-y-3">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Cerrar Sesión
            </button>
          </form>
          <p className="text-xs text-white/20">v2.0</p>
        </div>
      </aside>
    </>
  );
}
