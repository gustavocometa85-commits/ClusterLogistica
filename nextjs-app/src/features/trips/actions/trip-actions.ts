"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { viajeSchema } from "../types";

export async function createTrip(formData: FormData) {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData);
  const parsed = viajeSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const { error } = await supabase.from("viajes").insert({
    fecha_salida: data.fecha_salida,
    fecha_regreso: data.fecha_regreso || null,
    origen: data.origen,
    destino: data.destino,
    cliente: data.cliente,
    estado: data.estado,
    vehiculo_id: data.vehiculo_id || null,
    chofer_id: data.chofer_id || null,
    ingresos_estimados: data.ingresos_estimados,
  });

  if (error) return { error: { _form: [error.message] } };

  revalidatePath("/");
  revalidatePath("/historial");
  return { success: true };
}

export async function updateTrip(id: string, formData: FormData) {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData);
  const parsed = viajeSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const { error } = await supabase
    .from("viajes")
    .update({
      fecha_salida: data.fecha_salida,
      fecha_regreso: data.fecha_regreso || null,
      origen: data.origen,
      destino: data.destino,
      cliente: data.cliente,
      estado: data.estado,
      vehiculo_id: data.vehiculo_id || null,
      chofer_id: data.chofer_id || null,
      ingresos_estimados: data.ingresos_estimados,
    })
    .eq("id", id);

  if (error) return { error: { _form: [error.message] } };

  revalidatePath("/");
  revalidatePath("/historial");
  revalidatePath(`/viajes/${id}`);
  return { success: true };
}

export async function deleteTrip(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("viajes").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/historial");
  return { success: true };
}
