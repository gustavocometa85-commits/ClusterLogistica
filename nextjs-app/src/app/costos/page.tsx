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
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Costos y Combustible</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <GastoForm viajes={viajes} />
          <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
            <div className="px-card py-5 border-b border-border-subtle">
              <h2 className="font-semibold">Gastos Recientes</h2>
            </div>
            {gastos.length === 0 ? (
              <p className="p-6 text-text-muted text-sm">Sin gastos</p>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-muted text-text-secondary text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Tipo</th>
                    <th className="px-5 py-3 font-medium">Fecha</th>
                    <th className="px-5 py-3 font-medium text-right">Monto</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {gastos.map((g) => (
                    <tr key={g.id} className="hover:bg-surface-subtle transition-colors">
                      <td className="px-5 py-3.5">{g.tipo}</td>
                      <td className="px-5 py-3.5">{formatDate(g.fecha)}</td>
                      <td className="px-5 py-3.5 text-right text-red-600 font-medium">{formatCurrency(g.monto)}</td>
                      <td className="px-5 py-3.5">
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

        <div className="space-y-5">
          <CargaForm viajes={viajes} />
          <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
            <div className="px-card py-5 border-b border-border-subtle">
              <h2 className="font-semibold">Cargas Recientes</h2>
            </div>
            {cargas.length === 0 ? (
              <p className="p-6 text-text-muted text-sm">Sin cargas</p>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-muted text-text-secondary text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Litros</th>
                    <th className="px-5 py-3 font-medium">$/L</th>
                    <th className="px-5 py-3 font-medium">KM</th>
                    <th className="px-5 py-3 font-medium text-right">Total</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {cargas.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-subtle transition-colors">
                      <td className="px-5 py-3.5">{c.litros} L</td>
                      <td className="px-5 py-3.5">{formatCurrency(c.precio_por_litro)}</td>
                      <td className="px-5 py-3.5">{c.kilometraje.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-right text-red-600 font-medium">{formatCurrency(c.costo_total)}</td>
                      <td className="px-5 py-3.5">
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
