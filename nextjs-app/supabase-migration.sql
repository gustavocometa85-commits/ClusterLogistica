-- ============================================
-- Clúster Logística — Supabase Migration
-- ============================================

-- Enums
CREATE TYPE estado_viaje AS ENUM ('PENDIENTE', 'EN_RUTA', 'ENTREGADO', 'CANCELADO');
CREATE TYPE tipo_gasto AS ENUM ('CASETA', 'VIATICO', 'MANIOBRA', 'OTRO');
CREATE TYPE tipo_incidencia AS ENUM ('ACCIDENTE', 'FALLA_MECANICA', 'DEMORA');

-- Vehiculos
CREATE TABLE vehiculos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  placas TEXT NOT NULL UNIQUE,
  economico TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Choferes
CREATE TABLE choferes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  licencia TEXT NOT NULL,
  telefono TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Viajes
CREATE TABLE viajes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha_salida DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_regreso DATE,
  origen TEXT NOT NULL,
  destino TEXT NOT NULL,
  cliente TEXT NOT NULL,
  estado estado_viaje NOT NULL DEFAULT 'PENDIENTE',
  vehiculo_id UUID REFERENCES vehiculos(id) ON DELETE SET NULL,
  chofer_id UUID REFERENCES choferes(id) ON DELETE SET NULL,
  ingresos_estimados NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gastos
CREATE TABLE gastos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  viaje_id UUID NOT NULL REFERENCES viajes(id) ON DELETE CASCADE,
  tipo tipo_gasto NOT NULL,
  monto NUMERIC(10,2) NOT NULL,
  descripcion TEXT DEFAULT '',
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cargas de combustible
CREATE TABLE cargas_combustible (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  viaje_id UUID NOT NULL REFERENCES viajes(id) ON DELETE CASCADE,
  litros NUMERIC(10,2) NOT NULL,
  precio_por_litro NUMERIC(10,2) NOT NULL,
  costo_total NUMERIC(10,2) GENERATED ALWAYS AS (litros * precio_por_litro) STORED,
  kilometraje INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Incidencias
CREATE TABLE incidencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  viaje_id UUID NOT NULL REFERENCES viajes(id) ON DELETE CASCADE,
  tipo tipo_incidencia NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_reporte TIMESTAMPTZ DEFAULT now(),
  resuelto BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE choferes ENABLE ROW LEVEL SECURITY;
ALTER TABLE viajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargas_combustible ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidencias ENABLE ROW LEVEL SECURITY;

-- Policies: authenticated users can do everything
CREATE POLICY "Authenticated users full access" ON vehiculos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access" ON choferes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access" ON viajes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access" ON gastos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access" ON cargas_combustible
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access" ON incidencias
  FOR ALL USING (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX idx_viajes_estado ON viajes(estado);
CREATE INDEX idx_viajes_fecha ON viajes(fecha_salida DESC);
CREATE INDEX idx_gastos_viaje ON gastos(viaje_id);
CREATE INDEX idx_cargas_viaje ON cargas_combustible(viaje_id);
CREATE INDEX idx_incidencias_viaje ON incidencias(viaje_id);
