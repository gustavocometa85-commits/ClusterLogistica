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
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/historial" className="text-text-muted hover:text-text-primary transition-colors">
          ← Volver
        </Link>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          {trip.origen} → {trip.destino}
        </h1>
        <StatusBadge estado={trip.estado} />
        <a
          href={`/api/viajes/${id}/pdf`}
          className="ml-auto px-5 py-2.5 bg-brand-800 text-white rounded-button text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          Descargar PDF
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-red-50 border border-red-100 rounded-card p-card">
          <p className="text-xs text-red-600 font-medium">Total Gastos + Diesel</p>
          <p className="text-xl font-semibold text-red-700 mt-2">{formatCurrency(totalGastos + totalDiesel)}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-card p-card">
          <p className="text-xs text-emerald-600 font-medium">Ingreso Estimado</p>
          <p className="text-xl font-semibold text-emerald-700 mt-2">{formatCurrency(trip.ingresos_estimados)}</p>
        </div>
        <div className={`rounded-card p-card border ${utilidadViaje >= 0 ? "bg-blue-50 border-blue-100" : "bg-red-50 border-red-100"}`}>
          <p className={`text-xs font-medium ${utilidadViaje >= 0 ? "text-blue-600" : "text-red-600"}`}>Utilidad del Viaje</p>
          <p className={`text-xl font-semibold mt-2 ${utilidadViaje >= 0 ? "text-blue-700" : "text-red-700"}`}>{formatCurrency(utilidadViaje)}</p>
        </div>
      </div>

      {/* Gastos */}
      <Section title="Gastos" count={gastos.length}>
        {gastos.length > 0 ? (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted text-text-secondary text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Tipo</th>
                <th className="px-5 py-3 font-medium">Descripción</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {gastos.map((g) => (
                <tr key={g.id} className="hover:bg-surface-subtle transition-colors">
                  <td className="px-5 py-3.5 font-medium">{g.tipo}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{g.descripcion || "—"}</td>
                  <td className="px-5 py-3.5">{formatDate(g.fecha)}</td>
                  <td className="px-5 py-3.5 text-right text-red-600 font-medium">{formatCurrency(g.monto)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-surface-muted font-semibold">
                <td className="px-5 py-3" colSpan={3}>Total Gastos</td>
                <td className="px-5 py-3 text-right text-red-700">{formatCurrency(totalGastos)}</td>
              </tr>
            </tfoot>
          </table>
          </div>
        ) : (
          <p className="p-6 text-text-muted text-sm">Sin gastos registrados</p>
        )}
      </Section>

      {/* Cargas de Combustible */}
      <Section title="Cargas de Combustible" count={cargas.length}>
        {cargas.length > 0 ? (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted text-text-secondary text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Litros</th>
                <th className="px-5 py-3 font-medium">Precio/L</th>
                <th className="px-5 py-3 font-medium">Kilometraje</th>
                <th className="px-5 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {cargas.map((c) => (
                <tr key={c.id} className="hover:bg-surface-subtle transition-colors">
                  <td className="px-5 py-3.5">{c.litros} L</td>
                  <td className="px-5 py-3.5">{formatCurrency(c.precio_por_litro)}</td>
                  <td className="px-5 py-3.5">{c.kilometraje.toLocaleString()} km</td>
                  <td className="px-5 py-3.5 text-right text-red-600 font-medium">{formatCurrency(c.costo_total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-surface-muted font-semibold">
                <td className="px-5 py-3" colSpan={3}>Total Diesel</td>
                <td className="px-5 py-3 text-right text-red-700">{formatCurrency(totalDiesel)}</td>
              </tr>
            </tfoot>
          </table>
          </div>
        ) : (
          <p className="p-6 text-text-muted text-sm">Sin cargas registradas</p>
        )}
      </Section>

      {/* Incidencias */}
      <Section title="Incidencias" count={incidencias.length}>
        {incidencias.length > 0 ? (
          <div className="divide-y divide-border-subtle">
            {incidencias.map((inc) => (
              <div key={inc.id} className="p-5 flex items-start gap-3">
                <span
                  className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${inc.resuelto ? "bg-emerald-500" : "bg-red-500"}`}
                />
                <div>
                  <p className="font-medium text-sm">{inc.tipo.replace("_", " ")}</p>
                  <p className="text-text-secondary text-sm mt-0.5">{inc.descripcion}</p>
                  <p className="text-xs text-text-muted mt-1">
                    {inc.resuelto ? "Resuelto" : "Pendiente"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-6 text-text-muted text-sm">Sin incidencias</p>
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
    <div className="space-y-5">
      <Link href="/historial" className="text-text-muted hover:text-text-primary transition-colors">
        ← Volver
      </Link>
      <TripForm vehiculos={vehiculosRes.data ?? []} choferes={choferesRes.data ?? []} />
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface rounded-card border border-border shadow-card p-card">
      <p className="text-xs text-text-muted font-medium">{label}</p>
      <p className="font-semibold mt-1.5">{value}</p>
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
    <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
      <div className="px-card py-5 border-b border-border-subtle flex items-center gap-2">
        <h2 className="font-semibold">{title}</h2>
        <span className="text-xs bg-surface-muted text-text-secondary px-2 py-0.5 rounded-badge">
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}
