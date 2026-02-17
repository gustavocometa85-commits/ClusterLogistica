import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import { StatusBadge } from "@/shared/ui/status-badge";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import { TripForm } from "@/features/trips";
import type { ViajeConRelaciones, Gasto, CargaCombustible, Incidencia } from "@/shared/types/database";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "nuevo") {
    return <NewTripPage />;
  }

  const supabase = await createClient();

  const [tripRes, gastosRes, cargasRes, incidenciasRes] = await Promise.all([
    supabase.from("viajes").select("*, vehiculos(*), choferes(*)").eq("id", id).single(),
    supabase.from("gastos").select("*").eq("viaje_id", id).order("fecha", { ascending: false }),
    supabase.from("cargas_combustible").select("*").eq("viaje_id", id).order("created_at", { ascending: false }),
    supabase.from("incidencias").select("*").eq("viaje_id", id).order("fecha_reporte", { ascending: false }),
  ]);

  const tripData = tripRes.data;
  if (tripRes.error || !tripData) {
    notFound();
  }

  const trip = tripData as unknown as ViajeConRelaciones;
  const gastos = (gastosRes.data ?? []) as Gasto[];
  const cargas = (cargasRes.data ?? []) as CargaCombustible[];
  const incidencias = (incidenciasRes.data ?? []) as Incidencia[];

  const totalGastos = gastos.reduce((s, g) => s + Number(g.monto), 0);
  const totalDiesel = cargas.reduce((s, c) => s + Number(c.costo_total), 0);
  const utilidadViaje = Number(trip.ingresos_estimados) - totalGastos - totalDiesel;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/historial" className="text-gray-500 hover:text-gray-700">
          ← Volver
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold">
          {trip.origen} → {trip.destino}
        </h1>
        <StatusBadge estado={trip.estado} />
        <a
          href={`/api/viajes/${id}/pdf`}
          className="ml-auto px-4 py-2 bg-[#2c3e50] text-white rounded-lg text-sm hover:bg-[#34495e] transition-colors"
        >
          Descargar PDF
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard label="Cliente" value={trip.cliente} />
        <InfoCard label="Fecha Salida" value={formatDate(trip.fecha_salida)} />
        <InfoCard label="Ingreso Estimado" value={formatCurrency(trip.ingresos_estimados)} />
        <InfoCard label="Chofer" value={trip.choferes?.nombre ?? "Sin asignar"} />
        <InfoCard
          label="Vehículo"
          value={trip.vehiculos ? `${trip.vehiculos.economico} - ${trip.vehiculos.marca}` : "Sin asignar"}
        />
        <InfoCard label="Fecha Regreso" value={trip.fecha_regreso ? formatDate(trip.fecha_regreso) : "—"} />
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs text-red-600">Total Gastos + Diesel</p>
          <p className="text-xl font-bold text-red-700 mt-1">{formatCurrency(totalGastos + totalDiesel)}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-xs text-emerald-600">Ingreso Estimado</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">{formatCurrency(trip.ingresos_estimados)}</p>
        </div>
        <div className={`rounded-xl p-4 border ${utilidadViaje >= 0 ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"}`}>
          <p className={`text-xs ${utilidadViaje >= 0 ? "text-blue-600" : "text-red-600"}`}>Utilidad del Viaje</p>
          <p className={`text-xl font-bold mt-1 ${utilidadViaje >= 0 ? "text-blue-700" : "text-red-700"}`}>{formatCurrency(utilidadViaje)}</p>
        </div>
      </div>

      {/* Gastos */}
      <Section title="Gastos" count={gastos.length}>
        {gastos.length > 0 ? (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {gastos.map((g) => (
                <tr key={g.id}>
                  <td className="px-4 py-2 font-medium">{g.tipo}</td>
                  <td className="px-4 py-2 text-gray-600">{g.descripcion || "—"}</td>
                  <td className="px-4 py-2">{formatDate(g.fecha)}</td>
                  <td className="px-4 py-2 text-right text-red-600">{formatCurrency(g.monto)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-2" colSpan={3}>Total Gastos</td>
                <td className="px-4 py-2 text-right text-red-700">{formatCurrency(totalGastos)}</td>
              </tr>
            </tfoot>
          </table>
          </div>
        ) : (
          <p className="p-4 text-gray-500 text-sm">Sin gastos registrados</p>
        )}
      </Section>

      {/* Cargas de Combustible */}
      <Section title="Cargas de Combustible" count={cargas.length}>
        {cargas.length > 0 ? (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2">Litros</th>
                <th className="px-4 py-2">Precio/L</th>
                <th className="px-4 py-2">Kilometraje</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cargas.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-2">{c.litros} L</td>
                  <td className="px-4 py-2">{formatCurrency(c.precio_por_litro)}</td>
                  <td className="px-4 py-2">{c.kilometraje.toLocaleString()} km</td>
                  <td className="px-4 py-2 text-right text-red-600">{formatCurrency(c.costo_total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-2" colSpan={3}>Total Diesel</td>
                <td className="px-4 py-2 text-right text-red-700">{formatCurrency(totalDiesel)}</td>
              </tr>
            </tfoot>
          </table>
          </div>
        ) : (
          <p className="p-4 text-gray-500 text-sm">Sin cargas registradas</p>
        )}
      </Section>

      {/* Incidencias */}
      <Section title="Incidencias" count={incidencias.length}>
        {incidencias.length > 0 ? (
          <div className="divide-y">
            {incidencias.map((inc) => (
              <div key={inc.id} className="p-4 flex items-start gap-3">
                <span
                  className={`mt-1 w-2 h-2 rounded-full shrink-0 ${inc.resuelto ? "bg-emerald-500" : "bg-red-500"}`}
                />
                <div>
                  <p className="font-medium text-sm">{inc.tipo.replace("_", " ")}</p>
                  <p className="text-gray-600 text-sm">{inc.descripcion}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {inc.resuelto ? "Resuelto" : "Pendiente"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-4 text-gray-500 text-sm">Sin incidencias</p>
        )}
      </Section>
    </div>
  );
}

async function NewTripPage() {
  const supabase = await createClient();
  const [vehiculosRes, choferesRes] = await Promise.all([
    supabase.from("vehiculos").select("*").order("economico"),
    supabase.from("choferes").select("*").order("nombre"),
  ]);

  return (
    <div className="space-y-4">
      <Link href="/historial" className="text-gray-500 hover:text-gray-700">
        ← Volver
      </Link>
      <TripForm vehiculos={vehiculosRes.data ?? []} choferes={choferesRes.data ?? []} />
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold mt-1">{value}</p>
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="p-4 border-b flex items-center gap-2">
        <h2 className="font-semibold">{title}</h2>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}
