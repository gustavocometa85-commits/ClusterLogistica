"use server";

import { createClient } from "@/shared/lib/supabase/server";

export interface MonthlyData {
  mes: string;
  ingresos: number;
  gastos: number;
}

export interface TripStatusData {
  name: string;
  value: number;
}

export interface ExpenseTypeData {
  name: string;
  value: number;
}

export interface ChartData {
  monthly: MonthlyData[];
  tripStatus: TripStatusData[];
  expenseType: ExpenseTypeData[];
}

export async function getChartData(): Promise<ChartData> {
  const supabase = await createClient();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const sinceDate = sixMonthsAgo.toISOString().slice(0, 10);

  const [viajesRes, gastosRes, cargasRes, statusRes] = await Promise.all([
    supabase
      .from("viajes")
      .select("fecha_salida, ingresos_estimados")
      .gte("fecha_salida", sinceDate),
    supabase
      .from("gastos")
      .select("fecha, monto, tipo")
      .gte("fecha", sinceDate),
    supabase
      .from("cargas_combustible")
      .select("fecha, costo_total")
      .gte("fecha", sinceDate),
    supabase.from("viajes").select("estado"),
  ]);

  // --- Monthly income vs expenses ---
  const monthMap = new Map<string, { ingresos: number; gastos: number }>();

  const getMonthKey = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("es-MX", { month: "short", year: "2-digit" });
  };

  const ensureMonth = (key: string) => {
    if (!monthMap.has(key)) monthMap.set(key, { ingresos: 0, gastos: 0 });
    return monthMap.get(key)!;
  };

  for (const v of viajesRes.data ?? []) {
    const m = ensureMonth(getMonthKey(v.fecha_salida));
    m.ingresos += Number(v.ingresos_estimados) || 0;
  }

  for (const g of gastosRes.data ?? []) {
    const m = ensureMonth(getMonthKey(g.fecha));
    m.gastos += Number(g.monto) || 0;
  }

  for (const c of cargasRes.data ?? []) {
    const m = ensureMonth(getMonthKey(c.fecha));
    m.gastos += Number(c.costo_total) || 0;
  }

  // Sort by date (generate ordered keys for last 6 months)
  const monthly: MonthlyData[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toLocaleDateString("es-MX", { month: "short", year: "2-digit" });
    const entry = monthMap.get(key);
    monthly.push({
      mes: key,
      ingresos: entry?.ingresos ?? 0,
      gastos: entry?.gastos ?? 0,
    });
  }

  // --- Trip status distribution ---
  const statusCounts: Record<string, number> = {};
  for (const v of statusRes.data ?? []) {
    const estado = v.estado as string;
    statusCounts[estado] = (statusCounts[estado] || 0) + 1;
  }

  const statusLabels: Record<string, string> = {
    PENDIENTE: "Pendiente",
    EN_RUTA: "En Ruta",
    ENTREGADO: "Entregado",
    CANCELADO: "Cancelado",
  };

  const tripStatus: TripStatusData[] = Object.entries(statusLabels).map(
    ([key, name]) => ({ name, value: statusCounts[key] || 0 })
  );

  // --- Expense type breakdown ---
  const typeCounts: Record<string, number> = {};
  for (const g of gastosRes.data ?? []) {
    const tipo = g.tipo as string;
    typeCounts[tipo] = (typeCounts[tipo] || 0) + Number(g.monto);
  }

  const typeLabels: Record<string, string> = {
    CASETA: "Caseta",
    VIATICO: "Viático",
    MANIOBRA: "Maniobra",
    OTRO: "Otro",
  };

  const expenseType: ExpenseTypeData[] = Object.entries(typeLabels).map(
    ([key, name]) => ({ name, value: typeCounts[key] || 0 })
  );

  return { monthly, tripStatus, expenseType };
}
