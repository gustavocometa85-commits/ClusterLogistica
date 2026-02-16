import Link from "next/link";
import { KpiSection, RecentTripsTable, getKpis, getRecentTrips } from "@/features/dashboard";

export default async function DashboardPage() {
  const [kpis, recentTrips] = await Promise.all([getKpis(), getRecentTrips()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link
            href="/viajes/nuevo"
            className="px-4 py-2 bg-[#2c3e50] text-white rounded-lg text-sm hover:bg-[#34495e] transition-colors"
          >
            + Nuevo Viaje
          </Link>
          <Link
            href="/calendario"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition-colors"
          >
            Ver Calendario
          </Link>
        </div>
      </div>

      <KpiSection kpis={kpis} />
      <RecentTripsTable trips={recentTrips} />
    </div>
  );
}
