import Link from "next/link";
import { createClient } from "@/shared/lib/supabase/server";
import { StatusBadge } from "@/shared/ui/status-badge";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import { ExcelUpload } from "@/features/trips";
import type { ViajeConRelaciones } from "@/shared/types/database";

export default async function HistorialPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("viajes")
    .select("*, vehiculos(*), choferes(*)")
    .order("fecha_salida", { ascending: false });

  const viajes = (data ?? []) as ViajeConRelaciones[];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Historial de Viajes</h1>
        <Link
          href="/viajes/nuevo"
          className="px-5 py-2.5 bg-brand-800 text-white rounded-button text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          + Nuevo Viaje
        </Link>
      </div>

      <ExcelUpload />

      <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
        {viajes.length === 0 ? (
          <p className="p-10 text-center text-text-muted">No hay viajes registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-muted text-text-secondary text-left">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Fecha</th>
                  <th className="px-5 py-3.5 font-medium">Ruta</th>
                  <th className="px-5 py-3.5 font-medium">Cliente</th>
                  <th className="px-5 py-3.5 font-medium">Chofer</th>
                  <th className="px-5 py-3.5 font-medium">Vehículo</th>
                  <th className="px-5 py-3.5 font-medium">Estado</th>
                  <th className="px-5 py-3.5 font-medium text-right">Ingreso</th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {viajes.map((v) => (
                  <tr key={v.id} className="hover:bg-surface-subtle transition-colors">
                    <td className="px-5 py-4">{formatDate(v.fecha_salida)}</td>
                    <td className="px-5 py-4 font-medium">
                      {v.origen} → {v.destino}
                    </td>
                    <td className="px-5 py-4">{v.cliente}</td>
                    <td className="px-5 py-4">
                      {v.choferes?.nombre ?? (
                        <span className="text-red-500 text-xs">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-text-muted text-xs">
                      {v.vehiculos
                        ? `${v.vehiculos.economico} - ${v.vehiculos.marca}`
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge estado={v.estado} />
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-emerald-700">
                      {formatCurrency(v.ingresos_estimados)}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/viajes/${v.id}`}
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
        )}
      </div>
    </div>
  );
}
