import { createClient } from "@/shared/lib/supabase/server";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import { GastoForm, CargaForm } from "@/features/costs";
import { DeleteButton } from "@/shared/ui/delete-button";
import type { Viaje, Gasto, CargaCombustible } from "@/shared/types/database";

export default async function CostosPage() {
  const supabase = await createClient();

  const [viajesRes, gastosRes, cargasRes] = await Promise.all([
    supabase.from("viajes").select("*").order("fecha_salida", { ascending: false }),
    supabase.from("gastos").select("*").order("fecha", { ascending: false }).limit(20),
    supabase.from("cargas_combustible").select("*").order("created_at", { ascending: false }).limit(20),
  ]);

  const viajes = (viajesRes.data ?? []) as Viaje[];
  const gastos = (gastosRes.data ?? []) as Gasto[];
  const cargas = (cargasRes.data ?? []) as CargaCombustible[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Costos y Combustible</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <GastoForm viajes={viajes} />
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Gastos Recientes</h2>
            </div>
            {gastos.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">Sin gastos</p>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-2">Tipo</th>
                    <th className="px-4 py-2">Fecha</th>
                    <th className="px-4 py-2 text-right">Monto</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {gastos.map((g) => (
                    <tr key={g.id}>
                      <td className="px-4 py-2">{g.tipo}</td>
                      <td className="px-4 py-2">{formatDate(g.fecha)}</td>
                      <td className="px-4 py-2 text-right text-red-600">{formatCurrency(g.monto)}</td>
                      <td className="px-4 py-2">
                        <DeleteButton id={g.id} table="gastos" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <CargaForm viajes={viajes} />
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Cargas Recientes</h2>
            </div>
            {cargas.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">Sin cargas</p>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-2">Litros</th>
                    <th className="px-4 py-2">$/L</th>
                    <th className="px-4 py-2">KM</th>
                    <th className="px-4 py-2 text-right">Total</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cargas.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-2">{c.litros} L</td>
                      <td className="px-4 py-2">{formatCurrency(c.precio_por_litro)}</td>
                      <td className="px-4 py-2">{c.kilometraje.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-red-600">{formatCurrency(c.costo_total)}</td>
                      <td className="px-4 py-2">
                        <DeleteButton id={c.id} table="cargas_combustible" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
