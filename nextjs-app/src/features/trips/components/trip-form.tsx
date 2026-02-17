"use client";

import { useActionState } from "react";
import { createTrip, updateTrip } from "../actions/trip-actions";
import { FormError } from "@/shared/ui/form-error";
import type { Viaje, Vehiculo, Chofer, EstadoViaje } from "@/shared/types/database";

interface TripFormProps {
  trip?: Viaje;
  vehiculos: Vehiculo[];
  choferes: Chofer[];
}

const estados: { value: EstadoViaje; label: string }[] = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_RUTA", label: "En Ruta" },
  { value: "ENTREGADO", label: "Entregado" },
  { value: "CANCELADO", label: "Cancelado" },
];

const inputClass = "mt-1.5 block w-full rounded-input border border-border px-3 py-2.5 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-colors";

export function TripForm({ trip, vehiculos, choferes }: TripFormProps) {
  const action = trip
    ? (prev: unknown, fd: FormData) => updateTrip(trip.id, fd)
    : (_prev: unknown, fd: FormData) => createTrip(fd);

  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="bg-surface rounded-card border border-border shadow-card p-card space-y-5 max-w-2xl">
      <h2 className="text-lg font-semibold tracking-tight">
        {trip ? "Editar Viaje" : "Nuevo Viaje"}
      </h2>

      <FormError state={state} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-sm text-text-secondary font-medium">Origen</span>
          <input name="origen" defaultValue={trip?.origen} required className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm text-text-secondary font-medium">Destino</span>
          <input name="destino" defaultValue={trip?.destino} required className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm text-text-secondary font-medium">Cliente</span>
          <input name="cliente" defaultValue={trip?.cliente} required className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm text-text-secondary font-medium">Ingresos Estimados</span>
          <input name="ingresos_estimados" type="number" step="0.01" min="0" defaultValue={trip?.ingresos_estimados ?? 0} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm text-text-secondary font-medium">Fecha Salida</span>
          <input name="fecha_salida" type="date" defaultValue={trip?.fecha_salida} required className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm text-text-secondary font-medium">Fecha Regreso</span>
          <input name="fecha_regreso" type="date" defaultValue={trip?.fecha_regreso ?? ""} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm text-text-secondary font-medium">Estado</span>
          <select name="estado" defaultValue={trip?.estado ?? "PENDIENTE"} className={inputClass}>
            {estados.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-text-secondary font-medium">Vehículo</span>
          <select name="vehiculo_id" defaultValue={trip?.vehiculo_id ?? ""} className={inputClass}>
            <option value="">Sin asignar</option>
            {vehiculos.map((v) => (
              <option key={v.id} value={v.id}>{v.economico} - {v.marca} {v.modelo}</option>
            ))}
          </select>
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm text-text-secondary font-medium">Chofer</span>
          <select name="chofer_id" defaultValue={trip?.chofer_id ?? ""} className={inputClass}>
            <option value="">Sin asignar</option>
            {choferes.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="px-6 py-2.5 bg-brand-800 text-white rounded-button text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
      >
        {pending ? "Guardando..." : trip ? "Actualizar" : "Crear Viaje"}
      </button>
    </form>
  );
}
