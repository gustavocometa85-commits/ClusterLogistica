"use server";

import { createClient } from "@/shared/lib/supabase/server";

export interface DashboardKpis {
  ingresosTotales: number;
  gastosTotales: number;
  utilidadNeta: number;
}

export async function getKpis(): Promise<DashboardKpis> {
  const supabase = await createClient();

  const [viajesRes, gastosRes, cargasRes] = await Promise.all([
    supabase.from("viajes").select("ingresos_estimados").then(r => r, () => ({ data: null })),
    supabase.from("gastos").select("monto").then(r => r, () => ({ data: null })),
    supabase.from("cargas_combustible").select("costo_total").then(r => r, () => ({ data: null })),
  ]);

  const ingresosTotales =
    viajesRes.data?.reduce((sum, v: Record<string, unknown>) => sum + Number(v.ingresos_estimados), 0) ?? 0;
  const gastosOtros =
    gastosRes.data?.reduce((sum: number, g: Record<string, unknown>) => sum + Number(g.monto), 0) ?? 0;
  const gastosDiesel =
    cargasRes.data?.reduce((sum: number, c: Record<string, unknown>) => sum + Number(c.costo_total), 0) ?? 0;
  const gastosTotales = gastosOtros + gastosDiesel;

  return {
    ingresosTotales,
    gastosTotales,
    utilidadNeta: ingresosTotales - gastosTotales,
  };
}
