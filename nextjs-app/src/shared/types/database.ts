export type EstadoViaje = "PENDIENTE" | "EN_RUTA" | "ENTREGADO" | "CANCELADO";
export type TipoGasto = "CASETA" | "VIATICO" | "MANIOBRA" | "OTRO";
export type TipoIncidencia = "ACCIDENTE" | "FALLA_MECANICA" | "DEMORA";

export interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  placas: string;
  economico: string;
  created_at: string;
}

export interface Chofer {
  id: string;
  nombre: string;
  licencia: string;
  telefono: string;
  created_at: string;
}

export interface Viaje {
  id: string;
  fecha_salida: string;
  fecha_regreso: string | null;
  origen: string;
  destino: string;
  cliente: string;
  estado: EstadoViaje;
  vehiculo_id: string | null;
  chofer_id: string | null;
  ingresos_estimados: number;
  created_at: string;
}

export interface ViajeConRelaciones extends Viaje {
  vehiculos: Vehiculo | null;
  choferes: Chofer | null;
}

export interface Gasto {
  id: string;
  viaje_id: string;
  tipo: TipoGasto;
  monto: number;
  descripcion: string;
  fecha: string;
  created_at: string;
}

export interface CargaCombustible {
  id: string;
  viaje_id: string;
  litros: number;
  precio_por_litro: number;
  costo_total: number;
  kilometraje: number;
  created_at: string;
}

export interface Incidencia {
  id: string;
  viaje_id: string;
  tipo: TipoIncidencia;
  descripcion: string;
  fecha_reporte: string;
  resuelto: boolean;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      vehiculos: {
        Row: Vehiculo;
        Insert: Omit<Vehiculo, "id" | "created_at">;
        Update: Partial<Omit<Vehiculo, "id" | "created_at">>;
      };
      choferes: {
        Row: Chofer;
        Insert: Omit<Chofer, "id" | "created_at">;
        Update: Partial<Omit<Chofer, "id" | "created_at">>;
      };
      viajes: {
        Row: Viaje;
        Insert: Omit<Viaje, "id" | "created_at">;
        Update: Partial<Omit<Viaje, "id" | "created_at">>;
      };
      gastos: {
        Row: Gasto;
        Insert: Omit<Gasto, "id" | "created_at">;
        Update: Partial<Omit<Gasto, "id" | "created_at">>;
      };
      cargas_combustible: {
        Row: CargaCombustible;
        Insert: Omit<CargaCombustible, "id" | "created_at">;
        Update: Partial<Omit<CargaCombustible, "id" | "created_at">>;
      };
      incidencias: {
        Row: Incidencia;
        Insert: Omit<Incidencia, "id" | "created_at">;
        Update: Partial<Omit<Incidencia, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      estado_viaje: EstadoViaje;
      tipo_gasto: TipoGasto;
      tipo_incidencia: TipoIncidencia;
    };
  };
}
