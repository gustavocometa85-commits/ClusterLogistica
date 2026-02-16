from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('fleet.urls')),
]  # <--- ¡AQUÍ SE CIERRA LA LISTA!

# --- AHORA SÍ, AFUERA DE LA LISTA: ---
admin.site.site_header = "Administración Clúster Logística"
admin.site.site_title = "Clúster Logística"
admin.site.index_title = "Bienvenido al Panel de Control"