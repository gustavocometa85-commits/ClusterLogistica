import Link from "next/link";
import { StatusBadge } from "@/shared/ui/status-badge";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import type { ViajeConRelaciones } from "@/shared/types/database";

interface Props {
  trips: ViajeConRelaciones[];
  title?: string;
  emptyMessage?: string;
}

export function RecentTripsTable({
  trips,
  title = "Viajes Recientes",
  emptyMessage = "No hay viajes registrados",
}: Props) {
  if (trips.length === 0) {
    return (
      <div className="bg-surface rounded-card border border-border shadow-card p-10 text-center text-text-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
      <div className="px-card py-5 border-b border-border-subtle flex items-center justify-between">
        <h2 className="font-semibold text-lg">{title}</h2>
        <Link
          href="/historial"
          className="text-sm text-brand-600 hover:text-brand-800 font-medium"
        >
          Ver todos
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-text-secondary text-left">
            <tr>
              <th className="px-5 py-3.5 font-medium">Ruta</th>
              <th className="px-5 py-3.5 font-medium">Cliente</th>
              <th className="px-5 py-3.5 font-medium">Chofer</th>
              <th className="px-5 py-3.5 font-medium">Estado</th>
              <th className="px-5 py-3.5 font-medium text-right">Ingreso</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {trips.map((trip) => (
              <tr key={trip.id} className="hover:bg-surface-subtle transition-colors">
                <td className="px-5 py-4">
                  <div className="font-medium">
                    {trip.origen} → {trip.destino}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {formatDate(trip.fecha_salida)}
                  </div>
                </td>
                <td className="px-5 py-4">{trip.cliente}</td>
                <td className="px-5 py-4">
                  {trip.choferes?.nombre ?? (
                    <span className="text-red-500 text-xs">Sin asignar</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge estado={trip.estado} />
                </td>
                <td className="px-5 py-4 text-right font-semibold text-emerald-700">
                  {formatCurrency(trip.ingresos_estimados)}
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/viajes/${trip.id}`}
                    className="text-brand-600 hover:text-brand-800 text-xs font-medium"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
