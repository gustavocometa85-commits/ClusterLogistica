"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const gastoSchema = z.object({
  viaje_id: z.string().uuid("Viaje requerido"),
  tipo: z.enum(["CASETA", "VIATICO", "MANIOBRA", "OTRO"]),
  monto: z.coerce.number().positive("Monto debe ser positivo"),
  descripcion: z.string().default(""),
  fecha: z.string().min(1, "Fecha requerida"),
});

const cargaSchema = z.object({
  viaje_id: z.string().uuid("Viaje requerido"),
  litros: z.coerce.number().positive("Litros debe ser positivo"),
  precio_por_litro: z.coerce.number().positive("Precio debe ser positivo"),
  kilometraje: z.coerce.number().int().min(0, "Kilometraje inválido"),
});

export async function createGasto(formData: FormData) {
  const supabase = await createClient();
  const parsed = gastoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { error } = await supabase.from("gastos").insert(parsed.data);
  if (error) return { error: { _form: [error.message] } };

  revalidatePath("/");
  revalidatePath("/costos");
  return { success: true };
}

export async function createCarga(formData: FormData) {
  const supabase = await createClient();
  const parsed = cargaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { error } = await supabase.from("cargas_combustible").insert(parsed.data);
  if (error) return { error: { _form: [error.message] } };

  revalidatePath("/");
  revalidatePath("/costos");
  return { success: true };
}
