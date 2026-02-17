"use client";

import { useActionState } from "react";
import { createGasto } from "../actions/cost-actions";
import { FormError } from "@/shared/ui/form-error";
import type { Viaje } from "@/shared/types/database";

const inputClass = "rounded-input border border-border px-3 py-2.5 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-colors";

export function GastoForm({ viajes }: { viajes: Viaje[] }) {
  const [state, formAction, pending] = useActionState(
    (_prev: unknown, fd: FormData) => createGasto(fd),
    null
  );

  return (
    <form action={formAction} className="bg-surface rounded-card border border-border shadow-card p-card space-y-4">
      <h3 className="font-semibold">Registrar Gasto</h3>
      <FormError state={state} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select name="viaje_id" required className={`${inputClass} sm:col-span-2`}>
          <option value="">Seleccionar viaje...</option>
          {viajes.map((v) => (
            <option key={v.id} value={v.id}>
              {v.origen} → {v.destino} ({v.cliente})
            </option>
          ))}
        </select>
        <select name="tipo" required className={inputClass}>
          <option value="CASETA">Caseta</option>
          <option value="VIATICO">Viático</option>
          <option value="MANIOBRA">Maniobra</option>
          <option value="OTRO">Otro</option>
        </select>
        <input name="monto" type="number" step="0.01" min="0" placeholder="Monto" required className={inputClass} />
        <input name="descripcion" placeholder="Descripción (opcional)" className={inputClass} />
        <input name="fecha" type="date" required className={inputClass} />
      </div>
      <button type="submit" disabled={pending} className="px-5 py-2.5 bg-brand-800 text-white rounded-button text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50">
        {pending ? "Guardando..." : "Registrar"}
      </button>
    </form>
  );
}
