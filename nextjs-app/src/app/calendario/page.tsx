import { createClient } from "@/shared/lib/supabase/server";
import { CalendarView } from "@/features/calendar";
import type { ViajeConRelaciones } from "@/shared/types/database";

export default async function CalendarioPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("viajes")
    .select("*, vehiculos(*), choferes(*)")
    .order("fecha_salida", { ascending: false });

  const viajes = (data ?? []) as ViajeConRelaciones[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Calendario</h1>
      <CalendarView trips={viajes} />
    </div>
  );
}
