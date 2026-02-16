import { createClient } from "@/shared/lib/supabase/server";
import { IncidenciaForm, ToggleResueltoButton } from "@/features/incidents";
import { DeleteButton } from "@/shared/ui/delete-button";
import type { Viaje, Incidencia } from "@/shared/types/database";

export default async function IncidenciasPage() {
  const supabase = await createClient();

  const [viajesRes, incidenciasRes] = await Promise.all([
    supabase.from("viajes").select("*").order("fecha_salida", { ascending: false }),
    supabase.from("incidencias").select("*").order("fecha_reporte", { ascending: false }),
  ]);

  const viajes = (viajesRes.data ?? []) as Viaje[];
  const incidencias = (incidenciasRes.data ?? []) as Incidencia[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Incidencias</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <IncidenciaForm viajes={viajes} />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold">
                Registro ({incidencias.length})
              </h2>
            </div>
            {incidencias.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">Sin incidencias</p>
            ) : (
              <div className="divide-y">
                {incidencias.map((inc) => (
                  <div key={inc.id} className="p-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
                          inc.resuelto ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {inc.tipo.replace("_", " ")}
                        </p>
                        <p className="text-gray-600 text-sm mt-0.5">
                          {inc.descripcion}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(inc.fecha_reporte).toLocaleString("es-MX")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ToggleResueltoButton id={inc.id} resuelto={inc.resuelto} />
                      <DeleteButton id={inc.id} table="incidencias" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
