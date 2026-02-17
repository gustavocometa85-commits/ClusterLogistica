"use client";

import { useActionState } from "react";
import { createChofer } from "../actions/fleet-actions";
import { FormError } from "@/shared/ui/form-error";

const inputClass = "rounded-input border border-border px-3 py-2.5 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-colors";

export function ChoferForm() {
  const [state, formAction, pending] = useActionState(
    (_prev: unknown, fd: FormData) => createChofer(fd),
    null
  );

  return (
    <form action={formAction} className="bg-surface rounded-card border border-border shadow-card p-card space-y-4">
      <h3 className="font-semibold">Agregar Chofer</h3>
      <FormError state={state} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input name="nombre" placeholder="Nombre" required className={inputClass} />
        <input name="licencia" placeholder="No. Licencia" required className={inputClass} />
        <input name="telefono" placeholder="Teléfono" required className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="px-5 py-2.5 bg-brand-800 text-white rounded-button text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Agregar"}
      </button>
    </form>
  );
}
