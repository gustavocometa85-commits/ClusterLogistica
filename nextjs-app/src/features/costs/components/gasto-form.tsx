"use client";

import { useActionState } from "react";
import { createGasto } from "../actions/cost-actions";
import { FormError } from "@/shared/ui/form-error";
import type { Viaje } from "@/shared/types/database";

export function GastoForm({ viajes }: { viajes: Viaje[] }) {
  const [state, formAction, pending] = useActionState(
    (_prev: unknown, fd: FormData) => createGasto(fd),
    null
  );

  return (
    <form action={formAction} className="bg-white rounded-xl border p-5 space-y-3">
      <h3 className="font-semibold">Registrar Gasto</h3>
      <FormError state={state} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select name="viaje_id" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm sm:col-span-2">
          <option value="">Seleccionar viaje...</option>
          {viajes.map((v) => (
            <option key={v.id} value={v.id}>
              {v.origen} → {v.destino} ({v.cliente})
            </option>
          ))}
        </select>
        <select name="tipo" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="CASETA">Caseta</option>
          <option value="VIATICO">Viático</option>
          <option value="MANIOBRA">Maniobra</option>
          <option value="OTRO">Otro</option>
        </select>
        <input name="monto" type="number" step="0.01" min="0" placeholder="Monto" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input name="descripcion" placeholder="Descripción (opcional)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input name="fecha" type="date" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <button type="submit" disabled={pending} className="px-4 py-2 bg-[#2c3e50] text-white rounded-lg text-sm hover:bg-[#34495e] disabled:opacity-50">
        {pending ? "Guardando..." : "Registrar"}
      </button>
    </form>
  );
}
