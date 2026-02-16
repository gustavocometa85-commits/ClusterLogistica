"use client";

import { useActionState } from "react";
import { createVehiculo } from "../actions/fleet-actions";
import { FormError } from "@/shared/ui/form-error";

export function VehiculoForm() {
  const [state, formAction, pending] = useActionState(
    (_prev: unknown, fd: FormData) => createVehiculo(fd),
    null
  );

  return (
    <form action={formAction} className="bg-white rounded-xl border p-5 space-y-3">
      <h3 className="font-semibold">Agregar Vehículo</h3>
      <FormError state={state} />
      <div className="grid grid-cols-2 gap-3">
        <input name="marca" placeholder="Marca" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input name="modelo" placeholder="Modelo" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input name="placas" placeholder="Placas" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input name="economico" placeholder="No. Económico" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 bg-[#2c3e50] text-white rounded-lg text-sm hover:bg-[#34495e] disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Agregar"}
      </button>
    </form>
  );
}
