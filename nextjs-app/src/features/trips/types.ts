import { z } from "zod";

export const viajeSchema = z.object({
  fecha_salida: z.string().min(1, "Fecha de salida requerida"),
  fecha_regreso: z.string().optional().default(""),
  origen: z.string().min(1, "Origen requerido"),
  destino: z.string().min(1, "Destino requerido"),
  cliente: z.string().min(1, "Cliente requerido"),
  estado: z.enum(["PENDIENTE", "EN_RUTA", "ENTREGADO", "CANCELADO"]).default("PENDIENTE"),
  vehiculo_id: z.string().optional().default(""),
  chofer_id: z.string().optional().default(""),
  ingresos_estimados: z.coerce.number().min(0).default(0),
});

export type ViajeFormData = z.infer<typeof viajeSchema>;
