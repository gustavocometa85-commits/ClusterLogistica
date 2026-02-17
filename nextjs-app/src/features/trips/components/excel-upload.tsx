"use client";

import { useActionState } from "react";
import { uploadExcel } from "../actions/upload-excel";

export function ExcelUpload() {
  const [state, formAction, pending] = useActionState(
    (_prev: unknown, fd: FormData) => uploadExcel(fd),
    null
  );

  return (
    <form action={formAction} className="bg-white rounded-xl border p-5 space-y-3">
      <h3 className="font-semibold">Carga Masiva (Excel)</h3>
      <p className="text-xs text-gray-500">
        Columnas requeridas: <span className="font-medium">origen, destino, cliente, fecha_salida</span>.
        Opcionales: ingresos_estimados, fecha_regreso.
      </p>
      <input
        name="file"
        type="file"
        accept=".xlsx,.xls,.csv"
        required
        className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#2c3e50] file:text-white hover:file:bg-[#34495e] file:cursor-pointer"
      />
      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50"
      >
        {pending ? "Procesando..." : "Subir y Crear Viajes"}
      </button>

      {state?.success && (
        <div className="p-3 rounded-lg text-sm bg-emerald-50 text-emerald-800 border border-emerald-200">
          Se crearon {state.inserted} viaje(s) exitosamente.
        </div>
      )}
      {state?.errors && (
        <div className="p-3 rounded-lg text-sm bg-red-50 text-red-800 border border-red-200 space-y-1">
          {state.errors.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      )}
    </form>
  );
}
