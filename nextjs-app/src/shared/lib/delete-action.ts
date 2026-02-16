"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ALLOWED_TABLES = ["vehiculos", "choferes", "viajes", "gastos", "cargas_combustible", "incidencias"] as const;
type AllowedTable = (typeof ALLOWED_TABLES)[number];

export async function deleteRecord(id: string, table: string) {
  if (!ALLOWED_TABLES.includes(table as AllowedTable)) {
    return { error: "Tabla no permitida" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/flota");
  revalidatePath("/historial");
  revalidatePath("/costos");
  revalidatePath("/incidencias");
  return { success: true };
}
