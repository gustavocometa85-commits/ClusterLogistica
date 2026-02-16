export function auditarCarga(
  litrosTicket: number,
  kmRecorridos: number,
  capacidadTanque: number,
  rendimientoTeorico: number
): { esFraude: boolean; mensaje: string } {
  const litros = Number(litrosTicket);
  const tanque = Number(capacidadTanque);
  const rendimientoTeo = Number(rendimientoTeorico);
  const kms = Number(kmRecorridos);

  // Rule 1: Tank overflow
  if (litros > tanque * 1.1) {
    return {
      esFraude: true,
      mensaje: `ALERTA: Se cargaron ${litros}L en un tanque de ${tanque}L.`,
    };
  }

  // No movement, can't audit
  if (kms <= 0) {
    return {
      esFraude: false,
      mensaje: "Carga inicial o sin movimiento registrado.",
    };
  }

  // Rule 2: Efficiency audit
  const rendimientoReal = kms / litros;
  const desviacion = (rendimientoTeo - rendimientoReal) / rendimientoTeo;

  if (desviacion > 0.3) {
    const litrosDebidos = kms / rendimientoTeo;
    const faltante = litros - litrosDebidos;
    return {
      esFraude: true,
      mensaje: `POSIBLE ROBO: Rendimiento de ${rendimientoReal.toFixed(2)} km/l (Muy bajo). Se estiman ${faltante.toFixed(1)} litros faltantes.`,
    };
  }

  return {
    esFraude: false,
    mensaje: "Carga Validada. Rendimiento correcto.",
  };
}
