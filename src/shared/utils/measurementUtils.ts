/**
 * Convierte centímetros a pies y pulgadas con formato
 * @param cm Altura en centímetros
 * @returns Cadena formateada en pies y pulgadas (ej: "6'2")
 */
export function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);

  // Si las pulgadas llegan a 12 después de redondear, incrementar pies
  if (inches === 12) {
    return `${feet + 1}'0"`;
  }

  return `${feet}'${inches}"`;
}

/**
 * Convierte kilogramos a libras
 * @param kg Peso en kilogramos
 * @returns Peso en libras (redondeado)
 */
export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462);
}

/**
 * Calcula el Índice de Masa Corporal (IMC)
 * @param kg Peso en kilogramos
 * @param cm Altura en centímetros
 * @returns El valor del IMC, redondeado al entero más cercano.
 */
export function imc(kg: number, cm: number): string {
  if (cm === 0) return '0';

  const heightMeters = cm / 100;
  const result = kg / Math.pow(heightMeters, 2);

  return result.toFixed(1);
}
