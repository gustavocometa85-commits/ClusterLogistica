import { createClient } from "@/shared/lib/supabase/server";
import { VehiculoForm, ChoferForm } from "@/features/fleet";
import { DeleteButton } from "@/shared/ui/delete-button";
import type { Vehiculo, Chofer } from "@/shared/types/database";

export default async function FlotaPage() {
  const supabase = await createClient();

  const [vehiculosRes, choferesRes] = await Promise.all([
    supabase.from("vehiculos").select("*").order("economico"),
    supabase.from("choferes").select("*").order("nombre"),
  ]);

  const vehiculos = (vehiculosRes.data ?? []) as Vehiculo[];
  const choferes = (choferesRes.data ?? []) as Chofer[];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Gestión de Flota</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vehículos */}
        <div className="space-y-5">
          <VehiculoForm />
          <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
            <div className="px-card py-5 border-b border-border-subtle">
              <h2 className="font-semibold">
                Vehículos ({vehiculos.length})
              </h2>
            </div>
            {vehiculos.length === 0 ? (
              <p className="p-6 text-text-muted text-sm">Sin vehículos</p>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-muted text-text-secondary text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Económico</th>
                    <th className="px-5 py-3 font-medium">Marca/Modelo</th>
                    <th className="px-5 py-3 font-medium">Placas</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {vehiculos.map((v) => (
                    <tr key={v.id} className="hover:bg-surface-subtle transition-colors">
                      <td className="px-5 py-3.5 font-medium">{v.economico}</td>
                      <td className="px-5 py-3.5">{v.marca} {v.modelo}</td>
                      <td className="px-5 py-3.5 text-text-muted">{v.placas}</td>
                      <td className="px-5 py-3.5">
                        <DeleteButton id={v.id} table="vehiculos" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </div>

        {/* Choferes */}
        <div className="space-y-5">
          <ChoferForm />
          <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
            <div className="px-card py-5 border-b border-border-subtle">
              <h2 className="font-semibold">Choferes ({choferes.length})</h2>
            </div>
            {choferes.length === 0 ? (
              <p className="p-6 text-text-muted text-sm">Sin choferes</p>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-muted text-text-secondary text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Nombre</th>
                    <th className="px-5 py-3 font-medium">Licencia</th>
                    <th className="px-5 py-3 font-medium">Teléfono</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {choferes.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-subtle transition-colors">
                      <td className="px-5 py-3.5 font-medium">{c.nombre}</td>
                      <td className="px-5 py-3.5">{c.licencia}</td>
                      <td className="px-5 py-3.5 text-text-muted">{c.telefono}</td>
                      <td className="px-5 py-3.5">
                        <DeleteButton id={c.id} table="choferes" />
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
