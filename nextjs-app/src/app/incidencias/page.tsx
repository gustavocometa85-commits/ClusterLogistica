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
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Incidencias</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <IncidenciaForm viajes={viajes} />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
            <div className="px-card py-5 border-b border-border-subtle">
              <h2 className="font-semibold">
                Registro ({incidencias.length})
              </h2>
            </div>
            {incidencias.length === 0 ? (
              <p className="p-6 text-text-muted text-sm">Sin incidencias</p>
            ) : (
              <div className="divide-y divide-border-subtle">
                {incidencias.map((inc) => (
                  <div key={inc.id} className="p-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                          inc.resuelto ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {inc.tipo.replace("_", " ")}
                        </p>
                        <p className="text-text-secondary text-sm mt-1">
                          {inc.descripcion}
                        </p>
                        <p className="text-xs text-text-muted mt-1.5">
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
