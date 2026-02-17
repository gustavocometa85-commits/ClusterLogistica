"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput } from "@fullcalendar/core";
import type { ViajeConRelaciones, EstadoViaje } from "@/shared/types/database";

const colorMap: Record<EstadoViaje, string> = {
  EN_RUTA: "#4a6785",
  PENDIENTE: "#d4ac0d",
  ENTREGADO: "#198754",
  CANCELADO: "#9ca3af",
};

function tripsToEvents(trips: ViajeConRelaciones[]): EventInput[] {
  return trips.map((trip) => ({
    id: trip.id,
    title: `${trip.cliente} (${trip.destino})`,
    start: trip.fecha_salida,
    end: trip.fecha_regreso ?? undefined,
    backgroundColor: colorMap[trip.estado] ?? "#9ca3af",
    borderColor: colorMap[trip.estado] ?? "#9ca3af",
    extendedProps: {
      chofer: trip.choferes?.nombre ?? "Sin asignar",
      vehiculo: trip.vehiculos
        ? `${trip.vehiculos.economico} - ${trip.vehiculos.marca}`
        : "Sin asignar",
      ingreso: trip.ingresos_estimados,
    },
  }));
}

export function CalendarView({ trips }: { trips: ViajeConRelaciones[] }) {
  const events = tripsToEvents(trips);

  return (
    <div className="bg-surface rounded-card border border-border shadow-card p-card">
      <div className="flex flex-wrap gap-4 mb-5 text-xs text-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#4a6785]" /> En Ruta
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#d4ac0d]" /> Pendiente
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#198754]" /> Entregado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#9ca3af]" /> Cancelado
        </span>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="es"
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "dayGridMonth,listMonth",
        }}
        events={events}
        eventDidMount={(info) => {
          const props = info.event.extendedProps;
          info.el.title = `${props.chofer} | ${props.vehiculo} | $${Number(props.ingreso).toLocaleString()}`;
        }}
        height="auto"
      />
    </div>
  );
}
