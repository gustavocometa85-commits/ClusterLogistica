"use client";

import { useActionState, useState } from "react";
import { createCarga } from "../actions/cost-actions";
import { auditarCarga } from "@/shared/lib/auditar-carga";
import { FormError } from "@/shared/ui/form-error";
import type { Viaje } from "@/shared/types/database";

export function CargaForm({ viajes }: { viajes: Viaje[] }) {
  const [state, formAction, pending] = useActionState(
    (_prev: unknown, fd: FormData) => createCarga(fd),
    null
  );
  const [auditResult, setAuditResult] = useState<{ esFraude: boolean; mensaje: string } | null>(null);

  function handleAudit() {
    const litros = parseFloat((document.querySelector('[name="litros"]') as HTMLInputElement)?.value || "0");
    const km = parseFloat((document.querySelector('[name="km_recorridos"]') as HTMLInputElement)?.value || "0");
    const tanque = parseFloat((document.querySelector('[name="capacidad_tanque"]') as HTMLInputElement)?.value || "0");
    const rendimiento = parseFloat((document.querySelector('[name="rendimiento_teorico"]') as HTMLInputElement)?.value || "0");

    if (litros && tanque && rendimiento) {
      setAuditResult(auditarCarga(litros, km, tanque, rendimiento));
    }
  }

  return (
    <div className="space-y-3">
      <form action={formAction} className="bg-white rounded-xl border p-5 space-y-3">
        <h3 className="font-semibold">Registrar Carga de Combustible</h3>
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
          <input name="litros" type="number" step="0.01" min="0" placeholder="Litros" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input name="precio_por_litro" type="number" step="0.01" min="0" placeholder="Precio/Litro" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input name="kilometraje" type="number" min="0" placeholder="Kilometraje" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={pending} className="px-4 py-2 bg-[#2c3e50] text-white rounded-lg text-sm hover:bg-[#34495e] disabled:opacity-50">
          {pending ? "Guardando..." : "Registrar Carga"}
        </button>
      </form>

      {/* Fuel Audit Tool */}
      <div className="bg-white rounded-xl border p-5 space-y-3">
        <h3 className="font-semibold">Auditoría de Combustible</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="km_recorridos" type="number" min="0" placeholder="KM Recorridos" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input name="capacidad_tanque" type="number" min="0" placeholder="Capacidad Tanque (L)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input name="rendimiento_teorico" type="number" step="0.1" min="0" placeholder="Rendimiento Teórico (km/L)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <button
          type="button"
          onClick={handleAudit}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
        >
          Auditar
        </button>
        {auditResult && (
          <div
            className={`p-3 rounded-lg text-sm ${
              auditResult.esFraude
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}
          >
            {auditResult.mensaje}
          </div>
        )}
      </div>
    </div>
  );
}
