import { KpiCard } from "@/shared/ui/kpi-card";
import { formatCurrency } from "@/shared/lib/format";
import type { DashboardKpis } from "../actions/get-kpis";

export function KpiSection({ kpis }: { kpis: DashboardKpis }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <KpiCard
        title="Ingresos Totales"
        value={formatCurrency(kpis.ingresosTotales)}
        icon="💵"
        color="green"
      />
      <KpiCard
        title="Gastos Operativos"
        value={formatCurrency(kpis.gastosTotales)}
        icon="⛽"
        color="red"
      />
      <KpiCard
        title="Utilidad Neta"
        value={formatCurrency(kpis.utilidadNeta)}
        icon="📈"
        color="blue"
      />
      <KpiCard
        title={`En Ruta (${kpis.viajesEnRuta})`}
        value={formatCurrency(kpis.dineroEnRuta)}
        icon="🚛"
        color="amber"
      />
    </div>
  );
}
