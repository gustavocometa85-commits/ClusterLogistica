import type { EstadoViaje } from "@/shared/types/database";

const badgeStyles: Record<EstadoViaje, string> = {
  PENDIENTE: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
  EN_RUTA: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  ENTREGADO: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  CANCELADO: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

const labels: Record<EstadoViaje, string> = {
  PENDIENTE: "Pendiente",
  EN_RUTA: "En Ruta",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export function StatusBadge({ estado }: { estado: EstadoViaje }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-badge text-xs font-medium ${badgeStyles[estado]}`}
    >
      {labels[estado]}
    </span>
  );
}
