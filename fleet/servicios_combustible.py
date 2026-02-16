# Este archivo contiene la LOGICA PURA (Matemáticas).
# No necesita importar modelos, solo recibir números y devolver respuestas.

def auditar_carga(litros_ticket, km_recorridos, capacidad_tanque, rendimiento_teorico):
    """
    Analiza una carga y detecta si hay robo de combustible.
    Retorna un diccionario con el resultado.
    """

    # Aseguramos que los números sean números (floats)
    litros = float(litros_ticket)
    tanque = float(capacidad_tanque)
    rendimiento_teo = float(rendimiento_teorico)
    kms = float(km_recorridos)

    # ---------------------------------------------------------
    # REGLA 1: TANQUE INFLADO (El tanque mágico)
    # ---------------------------------------------------------
    # Si el tanque es de 80L y le metieron 90L (damos 10% de margen de error)
    if litros > (tanque * 1.10):
        return {
            "es_fraude": True,
            "mensaje": f"🚨 ALERTA CRÍTICA: Se cargaron {litros}L en un tanque de {tanque}L."
        }

    # Si no hay kilómetros recorridos (ej. primera carga), no podemos auditar rendimiento
    if kms <= 0:
        return {
            "es_fraude": False,
            "mensaje": "Carga inicial o sin movimiento registrado."
        }

    # ---------------------------------------------------------
    # REGLA 2: RENDIMIENTO BAJO (La ordeña)
    # ---------------------------------------------------------
    rendimiento_real = kms / litros

    # Calculamos qué tanto se desvió del ideal
    # Ejemplo: Si debía dar 10 km/l y dio 5 km/l, la desviación es 0.50 (50%)
    desviacion = (rendimiento_teo - rendimiento_real) / rendimiento_teo

    # Si la desviación es mayor al 30%, es ROBO casi seguro
    if desviacion > 0.30:
        litros_debidos = kms / rendimiento_teo
        faltante = litros - litros_debidos
        return {
            "es_fraude": True,
            "mensaje": f"⚠️ POSIBLE ROBO: Rendimiento de {rendimiento_real:.2f} km/l (Muy bajo). Se estiman {faltante:.1f} litros faltantes."
        }

    # Si la desviación es menor, todo está bien
    return {
        "es_fraude": False,
        "mensaje": "✅ Carga Validada. Rendimiento correcto."
    }