import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { ViajeConRelaciones, Gasto, CargaCombustible, Incidencia } from "@/shared/types/database";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const [tripRes, gastosRes, cargasRes, incidenciasRes] = await Promise.all([
    supabase.from("viajes").select("*, vehiculos(*), choferes(*)").eq("id", id).single(),
    supabase.from("gastos").select("*").eq("viaje_id", id).order("fecha", { ascending: false }),
    supabase.from("cargas_combustible").select("*").eq("viaje_id", id).order("created_at", { ascending: false }),
    supabase.from("incidencias").select("*").eq("viaje_id", id).order("fecha_reporte", { ascending: false }),
  ]);

  if (tripRes.error || !tripRes.data) {
    return NextResponse.json({ error: "Viaje no encontrado" }, { status: 404 });
  }

  const trip = tripRes.data as unknown as ViajeConRelaciones;
  const gastos = (gastosRes.data ?? []) as Gasto[];
  const cargas = (cargasRes.data ?? []) as CargaCombustible[];
  const incidencias = (incidenciasRes.data ?? []) as Incidencia[];

  const totalGastos = gastos.reduce((s, g) => s + Number(g.monto), 0);
  const totalDiesel = cargas.reduce((s, c) => s + Number(c.costo_total), 0);
  const utilidad = Number(trip.ingresos_estimados) - totalGastos - totalDiesel;

  // Build PDF
  const doc = new jsPDF();
  const fmt = (n: number) => `$${n.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
  const fmtDate = (d: string) => d ? new Date(d + "T00:00:00").toLocaleDateString("es-MX") : "—";

  // Header
  doc.setFillColor(44, 62, 80);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(241, 196, 15);
  doc.setFontSize(18);
  doc.text("Cluster Logistica", 14, 15);
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("Reporte de Viaje", 14, 22);

  // Trip info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(`${trip.origen} - ${trip.destino}`, 14, 42);

  doc.setFontSize(10);
  const info = [
    ["Cliente", trip.cliente],
    ["Estado", trip.estado],
    ["Chofer", trip.choferes?.nombre ?? "Sin asignar"],
    ["Vehiculo", trip.vehiculos ? `${trip.vehiculos.economico} - ${trip.vehiculos.marca} ${trip.vehiculos.modelo}` : "Sin asignar"],
    ["Fecha Salida", fmtDate(trip.fecha_salida)],
    ["Fecha Regreso", trip.fecha_regreso ? fmtDate(trip.fecha_regreso) : "—"],
    ["Ingreso Estimado", fmt(Number(trip.ingresos_estimados))],
  ];

  autoTable(doc, {
    startY: 48,
    head: [["Campo", "Valor"]],
    body: info,
    theme: "grid",
    headStyles: { fillColor: [44, 62, 80] },
    styles: { fontSize: 9 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentY = (doc as any).lastAutoTable.finalY + 10;

  // Gastos table
  if (gastos.length > 0) {
    doc.setFontSize(12);
    doc.text("Gastos", 14, currentY);
    currentY += 4;

    autoTable(doc, {
      startY: currentY,
      head: [["Tipo", "Descripcion", "Fecha", "Monto"]],
      body: gastos.map((g) => [g.tipo, g.descripcion || "—", fmtDate(g.fecha), fmt(Number(g.monto))]),
      foot: [["", "", "Total", fmt(totalGastos)]],
      theme: "striped",
      headStyles: { fillColor: [44, 62, 80] },
      footStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // Cargas table
  if (cargas.length > 0) {
    doc.setFontSize(12);
    doc.text("Cargas de Combustible", 14, currentY);
    currentY += 4;

    autoTable(doc, {
      startY: currentY,
      head: [["Litros", "Precio/L", "Kilometraje", "Total"]],
      body: cargas.map((c) => [
        `${c.litros} L`,
        fmt(Number(c.precio_por_litro)),
        `${Number(c.kilometraje).toLocaleString()} km`,
        fmt(Number(c.costo_total)),
      ]),
      foot: [["", "", "Total Diesel", fmt(totalDiesel)]],
      theme: "striped",
      headStyles: { fillColor: [44, 62, 80] },
      footStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // Incidencias
  if (incidencias.length > 0) {
    doc.setFontSize(12);
    doc.text("Incidencias", 14, currentY);
    currentY += 4;

    autoTable(doc, {
      startY: currentY,
      head: [["Tipo", "Descripcion", "Estado"]],
      body: incidencias.map((inc) => [
        inc.tipo.replace("_", " "),
        inc.descripcion,
        inc.resuelto ? "Resuelto" : "Pendiente",
      ]),
      theme: "striped",
      headStyles: { fillColor: [44, 62, 80] },
      styles: { fontSize: 8 },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // Resumen financiero
  doc.setFontSize(12);
  doc.text("Resumen Financiero", 14, currentY);
  currentY += 4;

  const utilidadColor: [number, number, number] = utilidad >= 0 ? [22, 163, 74] : [239, 68, 68];
  autoTable(doc, {
    startY: currentY,
    head: [["Concepto", "Monto"]],
    body: [
      ["Ingreso Estimado", fmt(Number(trip.ingresos_estimados))],
      ["Total Gastos", fmt(totalGastos)],
      ["Total Diesel", fmt(totalDiesel)],
    ],
    foot: [["Utilidad del Viaje", fmt(utilidad)]],
    theme: "grid",
    headStyles: { fillColor: [44, 62, 80] },
    footStyles: { fillColor: utilidadColor, textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 9 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Cluster Logistica — Generado ${new Date().toLocaleDateString("es-MX")} — Pagina ${i}/${pageCount}`,
      105,
      290,
      { align: "center" }
    );
  }

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  const filename = `viaje-${trip.origen}-${trip.destino}-${trip.fecha_salida}.pdf`.replace(/\s+/g, "_");

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
