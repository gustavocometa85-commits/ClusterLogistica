"use client";

import { useActionState } from "react";
import { uploadExcel } from "../actions/upload-excel";

export function ExcelUpload() {
  const [state, formAction, pending] = useActionState(
    (_prev: unknown, fd: FormData) => uploadExcel(fd),
    null
  );

  return (
    <form action={formAction} className="bg-surface rounded-card border border-border shadow-card p-card space-y-4">
      <h3 className="font-semibold">Carga Masiva (Excel)</h3>
      <p className="text-xs text-text-muted">
        Columnas requeridas: <span className="font-medium text-text-secondary">origen, destino, cliente, fecha_salida</span>.
        Opcionales: ingresos_estimados, fecha_regreso.
      </p>
      <input
        name="file"
        type="file"
        accept=".xlsx,.xls,.csv"
        required
        className="block w-full text-sm text-text-muted file:mr-3 file:py-2.5 file:px-5 file:rounded-button file:border-0 file:text-sm file:font-medium file:bg-brand-800 file:text-white hover:file:bg-brand-700 file:cursor-pointer file:transition-colors"
      />
      <button
        type="submit"
        disabled={pending}
        className="px-5 py-2.5 bg-emerald-600 text-white rounded-button text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
      >
        {pending ? "Procesando..." : "Subir y Crear Viajes"}
      </button>

      {state?.success && (
        <div className="p-4 rounded-badge text-sm bg-emerald-50 text-emerald-800 border border-emerald-100">
          Se crearon {state.inserted} viaje(s) exitosamente.
        </div>
      )}
      {state?.errors && (
        <div className="p-4 rounded-badge text-sm bg-red-50 text-red-800 border border-red-100 space-y-1">
          {state.errors.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      )}
    </form>
  );
}
