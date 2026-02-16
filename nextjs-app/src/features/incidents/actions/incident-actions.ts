"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const incidenciaSchema = z.object({
  viaje_id: z.string().uuid("Viaje requerido"),
  tipo: z.enum(["ACCIDENTE", "FALLA_MECANICA", "DEMORA"]),
  descripcion: z.string().min(1, "Descripción requerida"),
});

export async function createIncidencia(formData: FormData) {
  const supabase = await createClient();
  const parsed = incidenciaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { error } = await supabase.from("incidencias").insert(parsed.data);
  if (error) return { error: { _form: [error.message] } };

  revalidatePath("/incidencias");
  return { success: true };
}

export async function toggleResuelto(id: string, resuelto: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("incidencias").update({ resuelto }).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/incidencias");
  return { success: true };
}
