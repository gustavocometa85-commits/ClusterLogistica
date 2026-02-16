import type { EstadoViaje } from "@/shared/types/database";

const badgeStyles: Record<EstadoViaje, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  EN_RUTA: "bg-blue-100 text-blue-800",
  ENTREGADO: "bg-emerald-100 text-emerald-800",
  CANCELADO: "bg-red-100 text-red-800",
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
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeStyles[estado]}`}
    >
      {labels[estado]}
    </span>
  );
}
