"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";
import * as XLSX from "xlsx";

interface UploadResult {
  success?: boolean;
  inserted?: number;
  errors?: string[];
}

const REQUIRED_COLUMNS = ["origen", "destino", "cliente", "fecha_salida"];

export async function uploadExcel(formData: FormData): Promise<UploadResult> {
  const file = formData.get("file") as File | null;
  if (!file) return { errors: ["No se seleccionó ningún archivo"] };

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return { errors: ["El archivo no contiene hojas de cálculo"] };

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  if (rows.length === 0) return { errors: ["El archivo está vacío"] };

  // Normalize headers (lowercase, trim)
  const normalized = rows.map((row) => {
    const obj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(row)) {
      obj[key.toLowerCase().trim()] = val;
    }
    return obj;
  });

  // Validate required columns exist
  const firstRow = normalized[0];
  const missing = REQUIRED_COLUMNS.filter((col) => !(col in firstRow));
  if (missing.length > 0) {
    return {
      errors: [
        `Columnas requeridas faltantes: ${missing.join(", ")}. ` +
          `Columnas encontradas: ${Object.keys(firstRow).join(", ")}`,
      ],
    };
  }

  const supabase = await createClient();
  const errors: string[] = [];
  let inserted = 0;

  for (let i = 0; i < normalized.length; i++) {
    const row = normalized[i];
    const rowNum = i + 2; // Excel row (1-indexed header + data)

    const origen = String(row.origen ?? "").trim();
    const destino = String(row.destino ?? "").trim();
    const cliente = String(row.cliente ?? "").trim();

    if (!origen || !destino || !cliente) {
      errors.push(`Fila ${rowNum}: origen, destino y cliente son obligatorios`);
      continue;
    }

    // Parse date - handle Excel serial numbers and strings
    let fechaSalida: string;
    const rawDate = row.fecha_salida;
    if (typeof rawDate === "number") {
      const date = XLSX.SSF.parse_date_code(rawDate);
      fechaSalida = `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
    } else {
      fechaSalida = String(rawDate ?? "").trim();
    }

    if (!fechaSalida) {
      errors.push(`Fila ${rowNum}: fecha_salida es obligatoria`);
      continue;
    }

    const ingresos = Number(row.ingresos_estimados ?? row.ingresos ?? 0);

    const { error } = await supabase.from("viajes").insert({
      origen,
      destino,
      cliente,
      fecha_salida: fechaSalida,
      fecha_regreso: row.fecha_regreso ? String(row.fecha_regreso) : null,
      estado: "PENDIENTE",
      ingresos_estimados: isNaN(ingresos) ? 0 : ingresos,
      vehiculo_id: null,
      chofer_id: null,
    });

    if (error) {
      errors.push(`Fila ${rowNum}: ${error.message}`);
    } else {
      inserted++;
    }
  }

  revalidatePath("/");
  revalidatePath("/historial");

  return {
    success: inserted > 0,
    inserted,
    errors: errors.length > 0 ? errors : undefined,
  };
}
