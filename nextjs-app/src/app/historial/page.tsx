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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Historial de Viajes</h1>
        <Link
          href="/viajes/nuevo"
          className="px-4 py-2 bg-[#2c3e50] text-white rounded-lg text-sm hover:bg-[#34495e] transition-colors"
        >
          + Nuevo Viaje
        </Link>
      </div>

      <ExcelUpload />

      <div className="bg-white rounded-xl border overflow-hidden">
        {viajes.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No hay viajes registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-left">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Ruta</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Chofer</th>
                  <th className="px-4 py-3">Vehículo</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Ingreso</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {viajes.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{formatDate(v.fecha_salida)}</td>
                    <td className="px-4 py-3 font-medium">
                      {v.origen} → {v.destino}
                    </td>
                    <td className="px-4 py-3">{v.cliente}</td>
                    <td className="px-4 py-3">
                      {v.choferes?.nombre ?? (
                        <span className="text-red-500 text-xs">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {v.vehiculos
                        ? `${v.vehiculos.economico} - ${v.vehiculos.marca}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge estado={v.estado} />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-700">
                      {formatCurrency(v.ingresos_estimados)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/viajes/${v.id}`}
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
        )}
      </div>
    </div>
  );
}
