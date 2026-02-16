from django.db import models
from django.utils import timezone
from datetime import date

# --- 1. GESTIÓN DE FLOTA ---
class Vehiculo(models.Model):
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    placas = models.CharField(max_length=20, unique=True)
    economico = models.CharField(max_length=20, verbose_name="No. Económico")

    def __str__(self):
        return f"{self.economico} - {self.marca}"

class Chofer(models.Model):
    nombre = models.CharField(max_length=100)
    licencia = models.CharField(max_length=50)
    telefono = models.CharField(max_length=20)

    def __str__(self):
        return self.nombre

# --- 2. OPERACIÓN Y LOGÍSTICA ---
class Trip(models.Model):
    ESTADOS = [
        ('PENDIENTE', 'Pendiente'),
        ('EN_RUTA', 'En Ruta'),
        ('ENTREGADO', 'Entregado'),
        ('CANCELADO', 'Cancelado'),
    ]

    fecha_salida = models.DateField(default=timezone.now)
    fecha_regreso = models.DateField(null=True, blank=True)
    origen = models.CharField(max_length=100)
    destino = models.CharField(max_length=100)
    cliente = models.CharField(max_length=100)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='PENDIENTE')

    # Recursos asignados
    vehiculo = models.ForeignKey(Vehiculo, on_delete=models.SET_NULL, null=True, blank=True)
    chofer = models.ForeignKey(Chofer, on_delete=models.SET_NULL, null=True, blank=True)

    # Finanzas del Viaje
    ingresos_estimados = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.origen} -> {self.destino} ({self.fecha_salida})"

# --- 3. GASTOS Y COMBUSTIBLE (Rentabilidad) ---
class Gasto(models.Model):
    TIPO_GASTO = [('CASETA', 'Caseta'), ('VIATICO', 'Viático'), ('MANIOBRA', 'Maniobra'), ('OTRO', 'Otro')]
    viaje = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='gastos')
    tipo = models.CharField(max_length=20, choices=TIPO_GASTO)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.CharField(max_length=200, blank=True)
    fecha = models.DateField(default=timezone.now)

class CargaCombustible(models.Model):
    viaje = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='cargas_diesel')
    litros = models.DecimalField(max_digits=10, decimal_places=2)
    precio_por_litro = models.DecimalField(max_digits=10, decimal_places=2)
    costo_total = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    kilometraje = models.IntegerField(help_text="Odómetro al momento de la carga")
    foto_ticket = models.ImageField(upload_to='tickets/', null=True, blank=True)

    def save(self, *args, **kwargs):
        self.costo_total = self.litros * self.precio_por_litro
        super().save(*args, **kwargs)

# --- 4. SEGURIDAD E INCIDENCIAS ---
class Incidencia(models.Model):
    viaje = models.ForeignKey(Trip, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=50, choices=[('ACCIDENTE', 'Accidente'), ('FALLA_MECANICA', 'Falla Mecánica'), ('DEMORA', 'Demora')])
    descripcion = models.TextField()
    fecha_reporte = models.DateTimeField(auto_now_add=True)
    resuelto = models.BooleanField(default=False)