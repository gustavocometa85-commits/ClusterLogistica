import Link from "next/link";
import { KpiSection, RecentTripsTable, DashboardCharts, getKpis, getActiveTrips, getRecentTrips, getChartData } from "@/features/dashboard";

export default async function DashboardPage() {
  const [kpis, activeTrips, recentTrips, chartData] = await Promise.all([
    getKpis(),
    getActiveTrips(),
    getRecentTrips(),
    getChartData(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <div className="flex gap-3">
          <Link
            href="/viajes/nuevo"
            className="px-5 py-2.5 bg-brand-800 text-white rounded-button text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            + Nuevo Viaje
          </Link>
          <Link
            href="/calendario"
            className="px-5 py-2.5 border border-border rounded-button text-sm font-medium text-text-secondary hover:bg-surface-muted transition-colors"
          >
            Ver Calendario
          </Link>
        </div>
      </div>

      <KpiSection kpis={kpis} />

      <DashboardCharts data={chartData} />

      {activeTrips.length > 0 && (
        <RecentTripsTable
          trips={activeTrips}
          title="En Carretera Ahora"
          emptyMessage="No hay viajes en ruta"
        />
      )}

      <RecentTripsTable
        trips={recentTrips}
        title="Viajes Recientes"
        emptyMessage="No hay viajes registrados"
      />
    </div>
  );
}
