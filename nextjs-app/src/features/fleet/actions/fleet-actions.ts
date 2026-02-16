"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const vehiculoSchema = z.object({
  marca: z.string().min(1, "Marca requerida"),
  modelo: z.string().min(1, "Modelo requerido"),
  placas: z.string().min(1, "Placas requeridas"),
  economico: z.string().min(1, "Número económico requerido"),
});

const choferSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  licencia: z.string().min(1, "Licencia requerida"),
  telefono: z.string().min(1, "Teléfono requerido"),
});

export async function createVehiculo(formData: FormData) {
  const supabase = await createClient();
  const parsed = vehiculoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { error } = await supabase.from("vehiculos").insert(parsed.data);
  if (error) return { error: { _form: [error.message] } };

  revalidatePath("/flota");
  return { success: true };
}

export async function deleteVehiculo(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("vehiculos").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/flota");
  return { success: true };
}

export async function createChofer(formData: FormData) {
  const supabase = await createClient();
  const parsed = choferSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { error } = await supabase.from("choferes").insert(parsed.data);
  if (error) return { error: { _form: [error.message] } };

  revalidatePath("/flota");
  return { success: true };
}

export async function deleteChofer(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("choferes").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/flota");
  return { success: true };
}
