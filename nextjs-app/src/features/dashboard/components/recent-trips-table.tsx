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
      <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">{title}</h2>
        <Link
          href="/historial"
          className="text-sm text-blue-600 hover:underline"
        >
          Ver todos
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3">Ruta</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Chofer</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Ingreso</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {trips.map((trip) => (
              <tr key={trip.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {trip.origen} → {trip.destino}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(trip.fecha_salida)}
                  </div>
                </td>
                <td className="px-4 py-3">{trip.cliente}</td>
                <td className="px-4 py-3">
                  {trip.choferes?.nombre ?? (
                    <span className="text-red-500 text-xs">Sin asignar</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge estado={trip.estado} />
                </td>
                <td className="px-4 py-3 text-right font-semibold text-emerald-700">
                  {formatCurrency(trip.ingresos_estimados)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/viajes/${trip.id}`}
                    className="text-blue-600 hover:underline text-xs"
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
