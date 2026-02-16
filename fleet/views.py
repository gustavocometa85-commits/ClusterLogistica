from django.shortcuts import render, redirect
from django.db.models import Sum
from django.core.serializers.json import DjangoJSONEncoder
import json
from datetime import date
from .models import Trip, Vehiculo, Chofer, Gasto, CargaCombustible, Incidencia

# ---------------------------------------------------------
# 1. VISTA DEL DASHBOARD (Tus $28,000 y la tabla)
# ---------------------------------------------------------
def dashboard_view(request):
    # Traer viajes
    viajes = Trip.objects.all().order_by('-id')

    # Calcular dinero
    ingresos = Trip.objects.aggregate(total=Sum('ingresos_estimados'))['total'] or 0
    diesel = CargaCombustible.objects.aggregate(total=Sum('costo_total'))['total'] or 0
    otros_gastos = Gasto.objects.aggregate(total=Sum('monto'))['total'] or 0

    gastos_totales = diesel + otros_gastos
    utilidad = ingresos - gastos_totales

    context = {
        'viajes': viajes,
        'ingresos_totales': ingresos,
        'gastos_totales': gastos_totales,
        'utilidad_neta': utilidad,
        'hoy': date.today()
    }
    return render(request, 'fleet/dashboard.html', context)

# ---------------------------------------------------------
# 2. VISTA DEL CALENDARIO (La nueva función inteligente)
# ---------------------------------------------------------
def calendar_view(request):
    viajes = Trip.objects.all()

    # Convertimos los viajes en "Eventos" para el calendario
    eventos = []
    for viaje in viajes:
        # Elegir color según el estado
        color = '#6c757d' # Gris (por defecto)
        estado_texto = str(viaje.estado).lower() # Convertimos a minúsculas para comparar fácil

        if 'ruta' in estado_texto:
            color = '#0d6efd' # Azul (En Ruta)
        elif 'pendiente' in estado_texto or 'programado' in estado_texto:
            color = '#ffc107' # Amarillo (Programado)
        elif 'completado' in estado_texto:
            color = '#198754' # Verde (Completado)

        # Creamos el evento
        eventos.append({
            'title': f"{viaje.cliente} ({viaje.destino})",
            'start': viaje.fecha_salida.isoformat() if viaje.fecha_salida else date.today().isoformat(),
            'color': color,
            # Datos extra para cuando pases el mouse por encima
            'extendedProps': {
                'chofer': str(viaje.chofer),
                'vehiculo': str(viaje.vehiculo),
                'ingreso': f"${viaje.ingresos_estimados}"
            }
        })

    # Empaquetamos los datos en formato JSON
    context = {
        'eventos_json': json.dumps(eventos, cls=DjangoJSONEncoder),
    }
    return render(request, 'fleet/calendar.html', context)

# ---------------------------------------------------------
# 3. VISTAS AUXILIARES (Para que no fallen los botones)
# ---------------------------------------------------------
def upload_view(request):
    return render(request, 'fleet/upload.html')

def export_pdf(request, trip_id):
    return redirect('dashboard')