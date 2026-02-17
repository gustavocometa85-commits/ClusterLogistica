"use client";

import { useTransition } from "react";
import { deleteRecord } from "@/shared/lib/delete-action";

export function DeleteButton({ id, table }: { id: string; table: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (!confirm("¿Eliminar este registro?")) return;
        startTransition(async () => { await deleteRecord(id, table); });
      }}
      className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors disabled:opacity-50"
    >
      {pending ? "..." : "Eliminar"}
    </button>
  );
}
