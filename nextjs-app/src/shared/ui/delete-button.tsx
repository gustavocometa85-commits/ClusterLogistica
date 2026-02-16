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
      className="text-red-500 hover:text-red-700 text-xs disabled:opacity-50"
    >
      {pending ? "..." : "Eliminar"}
    </button>
  );
}
