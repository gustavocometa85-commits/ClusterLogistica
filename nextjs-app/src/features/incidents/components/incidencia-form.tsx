"use client";

import { useActionState } from "react";
import { createIncidencia } from "../actions/incident-actions";
import { FormError } from "@/shared/ui/form-error";
import type { Viaje } from "@/shared/types/database";

const inputClass = "rounded-input border border-border px-3 py-2.5 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-colors";

export function IncidenciaForm({ viajes }: { viajes: Viaje[] }) {
  const [state, formAction, pending] = useActionState(
    (_prev: unknown, fd: FormData) => createIncidencia(fd),
    null
  );

  return (
    <form action={formAction} className="bg-surface rounded-card border border-border shadow-card p-card space-y-4">
      <h3 className="font-semibold">Reportar Incidencia</h3>
      <FormError state={state} />
      <div className="grid grid-cols-1 gap-4">
        <select name="viaje_id" required className={inputClass}>
          <option value="">Seleccionar viaje...</option>
          {viajes.map((v) => (
            <option key={v.id} value={v.id}>
              {v.origen} → {v.destino} ({v.cliente})
            </option>
          ))}
        </select>
        <select name="tipo" required className={inputClass}>
          <option value="ACCIDENTE">Accidente</option>
          <option value="FALLA_MECANICA">Falla Mecánica</option>
          <option value="DEMORA">Demora</option>
        </select>
        <textarea name="descripcion" placeholder="Descripción de la incidencia..." required rows={3} className={inputClass} />
      </div>
      <button type="submit" disabled={pending} className="px-5 py-2.5 bg-brand-800 text-white rounded-button text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50">
        {pending ? "Guardando..." : "Reportar"}
      </button>
    </form>
  );
}
