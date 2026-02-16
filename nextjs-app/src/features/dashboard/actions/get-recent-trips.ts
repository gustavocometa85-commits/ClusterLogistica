"use server";

import { createClient } from "@/shared/lib/supabase/server";
import type { ViajeConRelaciones } from "@/shared/types/database";

export async function getRecentTrips(): Promise<ViajeConRelaciones[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("viajes")
    .select("*, vehiculos(*), choferes(*)")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("getRecentTrips:", error.message);
    return [];
  }
  return (data as ViajeConRelaciones[]) ?? [];
}
