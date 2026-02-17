"use client";

import { useActionState } from "react";
import { createChofer } from "../actions/fleet-actions";
import { FormError } from "@/shared/ui/form-error";

export function ChoferForm() {
  const [state, formAction, pending] = useActionState(
    (_prev: unknown, fd: FormData) => createChofer(fd),
    null
  );

  return (
    <form action={formAction} className="bg-white rounded-xl border p-5 space-y-3">
      <h3 className="font-semibold">Agregar Chofer</h3>
      <FormError state={state} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input name="nombre" placeholder="Nombre" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input name="licencia" placeholder="No. Licencia" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input name="telefono" placeholder="Teléfono" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
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
