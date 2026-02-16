from django.urls import path
from . import views

urlpatterns = [
    # 1. Página Principal
    path('', views.dashboard_view, name='dashboard'),

    # 2. Herramientas (Nombres corregidos para que coincidan con tu HTML)
    path('calendar/', views.calendar_view, name='calendar'),

    # AQUÍ ESTABA EL ERROR: Tu HTML busca 'subir_excel', así que le ponemos ese nombre
    path('upload/', views.upload_view, name='subir_excel'),

    # El botón de historial (lo mandamos al inicio por ahora para que no falle)
    path('history/', views.dashboard_view, name='history'),

    # 3. Reportes
    path('pdf/<int:trip_id>/', views.export_pdf, name='export_pdf'),
]