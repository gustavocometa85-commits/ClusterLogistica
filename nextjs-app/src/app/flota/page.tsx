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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Flota</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehículos */}
        <div className="space-y-4">
          <VehiculoForm />
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold">
                Vehículos ({vehiculos.length})
              </h2>
            </div>
            {vehiculos.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">Sin vehículos</p>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-2">Económico</th>
                    <th className="px-4 py-2">Marca/Modelo</th>
                    <th className="px-4 py-2">Placas</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {vehiculos.map((v) => (
                    <tr key={v.id}>
                      <td className="px-4 py-2 font-medium">{v.economico}</td>
                      <td className="px-4 py-2">{v.marca} {v.modelo}</td>
                      <td className="px-4 py-2 text-gray-500">{v.placas}</td>
                      <td className="px-4 py-2">
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
        <div className="space-y-4">
          <ChoferForm />
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Choferes ({choferes.length})</h2>
            </div>
            {choferes.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">Sin choferes</p>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Licencia</th>
                    <th className="px-4 py-2">Teléfono</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {choferes.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-2 font-medium">{c.nombre}</td>
                      <td className="px-4 py-2">{c.licencia}</td>
                      <td className="px-4 py-2 text-gray-500">{c.telefono}</td>
                      <td className="px-4 py-2">
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
