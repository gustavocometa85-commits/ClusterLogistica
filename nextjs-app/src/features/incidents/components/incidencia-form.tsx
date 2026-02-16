"use client";

import { useActionState } from "react";
import { createIncidencia } from "../actions/incident-actions";
import { FormError } from "@/shared/ui/form-error";
import type { Viaje } from "@/shared/types/database";

export function IncidenciaForm({ viajes }: { viajes: Viaje[] }) {
  const [state, formAction, pending] = useActionState(
    (_prev: unknown, fd: FormData) => createIncidencia(fd),
    null
  );

  return (
    <form action={formAction} className="bg-white rounded-xl border p-5 space-y-3">
      <h3 className="font-semibold">Reportar Incidencia</h3>
      <FormError state={state} />
      <div className="grid grid-cols-1 gap-3">
        <select name="viaje_id" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">Seleccionar viaje...</option>
          {viajes.map((v) => (
            <option key={v.id} value={v.id}>
              {v.origen} → {v.destino} ({v.cliente})
            </option>
          ))}
        </select>
        <select name="tipo" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="ACCIDENTE">Accidente</option>
          <option value="FALLA_MECANICA">Falla Mecánica</option>
          <option value="DEMORA">Demora</option>
        </select>
        <textarea name="descripcion" placeholder="Descripción de la incidencia..." required rows={3} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <button type="submit" disabled={pending} className="px-4 py-2 bg-[#2c3e50] text-white rounded-lg text-sm hover:bg-[#34495e] disabled:opacity-50">
        {pending ? "Guardando..." : "Reportar"}
      </button>
    </form>
  );
}
