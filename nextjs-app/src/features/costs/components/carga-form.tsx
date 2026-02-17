"use client";

import { useActionState, useState } from "react";
import { createCarga } from "../actions/cost-actions";
import { auditarCarga } from "@/shared/lib/auditar-carga";
import { FormError } from "@/shared/ui/form-error";
import type { Viaje } from "@/shared/types/database";

const inputClass = "rounded-input border border-border px-3 py-2.5 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-colors";

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
    <div className="space-y-5">
      <form action={formAction} className="bg-surface rounded-card border border-border shadow-card p-card space-y-4">
        <h3 className="font-semibold">Registrar Carga de Combustible</h3>
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
          <input name="litros" type="number" step="0.01" min="0" placeholder="Litros" required className={inputClass} />
          <input name="precio_por_litro" type="number" step="0.01" min="0" placeholder="Precio/Litro" required className={inputClass} />
          <input name="kilometraje" type="number" min="0" placeholder="Kilometraje" required className={inputClass} />
        </div>
        <button type="submit" disabled={pending} className="px-5 py-2.5 bg-brand-800 text-white rounded-button text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50">
          {pending ? "Guardando..." : "Registrar Carga"}
        </button>
      </form>

      {/* Fuel Audit Tool */}
      <div className="bg-surface rounded-card border border-border shadow-card p-card space-y-4">
        <h3 className="font-semibold">Auditoría de Combustible</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="km_recorridos" type="number" min="0" placeholder="KM Recorridos" className={inputClass} />
          <input name="capacidad_tanque" type="number" min="0" placeholder="Capacidad Tanque (L)" className={inputClass} />
          <input name="rendimiento_teorico" type="number" step="0.1" min="0" placeholder="Rendimiento Teórico (km/L)" className={inputClass} />
        </div>
        <button
          type="button"
          onClick={handleAudit}
          className="px-5 py-2.5 bg-amber-500 text-white rounded-button text-sm font-medium hover:bg-amber-600 transition-colors"
        >
          Auditar
        </button>
        {auditResult && (
          <div
            className={`p-4 rounded-badge text-sm ${
              auditResult.esFraude
                ? "bg-red-50 text-red-800 border border-red-100"
                : "bg-emerald-50 text-emerald-800 border border-emerald-100"
            }`}
          >
            {auditResult.mensaje}
          </div>
        )}
      </div>
    </div>
  );
}
