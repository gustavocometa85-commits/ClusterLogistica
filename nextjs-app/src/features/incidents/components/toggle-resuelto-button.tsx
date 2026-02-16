"use client";

import { useTransition } from "react";
import { toggleResuelto } from "../actions/incident-actions";

export function ToggleResueltoButton({ id, resuelto }: { id: string; resuelto: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(async () => { await toggleResuelto(id, !resuelto); })}
      className={`text-xs px-2 py-1 rounded-full transition-colors disabled:opacity-50 ${
        resuelto
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      }`}
    >
      {pending ? "..." : resuelto ? "Resuelto" : "Pendiente"}
    </button>
  );
}
