"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput } from "@fullcalendar/core";
import type { ViajeConRelaciones, EstadoViaje } from "@/shared/types/database";

const colorMap: Record<EstadoViaje, string> = {
  EN_RUTA: "#0d6efd",
  PENDIENTE: "#ffc107",
  ENTREGADO: "#198754",
  CANCELADO: "#6c757d",
};

function tripsToEvents(trips: ViajeConRelaciones[]): EventInput[] {
  return trips.map((trip) => ({
    id: trip.id,
    title: `${trip.cliente} (${trip.destino})`,
    start: trip.fecha_salida,
    end: trip.fecha_regreso ?? undefined,
    backgroundColor: colorMap[trip.estado] ?? "#6c757d",
    borderColor: colorMap[trip.estado] ?? "#6c757d",
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
    <div className="bg-white rounded-xl border p-4">
      <div className="flex gap-3 mb-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#0d6efd]" /> En Ruta
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#ffc107]" /> Pendiente
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#198754]" /> Entregado
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#6c757d]" /> Cancelado
        </span>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="es"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,listMonth",
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
