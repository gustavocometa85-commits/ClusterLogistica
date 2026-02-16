from django.contrib import admin
from .models import Vehiculo, Chofer, Trip, Gasto, CargaCombustible, Incidencia

# Configuración avanzada para ver los gastos dentro del viaje
class GastoInline(admin.TabularInline):
    model = Gasto
    extra = 1

class CombustibleInline(admin.TabularInline):
    model = CargaCombustible
    extra = 1

class IncidenciaInline(admin.TabularInline):
    model = Incidencia
    extra = 0

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('origen', 'destino', 'fecha_salida', 'cliente', 'estado', 'vehiculo')
    list_filter = ('estado', 'fecha_salida', 'cliente')
    inlines = [GastoInline, CombustibleInline, IncidenciaInline] # ¡Todo en una sola pantalla!
    search_fields = ('cliente', 'origen', 'destino')

# Registro simple de los otros modelos
admin.site.register(Vehiculo)
admin.site.register(Chofer)
admin.site.register(Gasto)
admin.site.register(CargaCombustible)
admin.site.register(Incidencia)