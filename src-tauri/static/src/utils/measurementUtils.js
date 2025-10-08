/**
 * Convierte centímetros a pies y pulgadas con formato
 * @param {number} cm Altura en centímetros
 * @returns {string} Cadena formateada en pies y pulgadas (ej: "6'2")
 */
function cmToFeetInches(cm) {
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
 * @param {number} kg Peso en kilogramos
 * @returns {number} Peso en libras (redondeado)
 */
function kgToLbs(kg) {
  return Math.round(kg * 2.20462);
}

/**
 * Calcula el Índice de Masa Corporal (IMC)
 * @param {number} kg Peso en kilogramos
 * @param {number} cm Altura en centímetros
 * @returns {string} El valor del IMC, redondeado al entero más cercano.
 */
function calculateIMC(kg, cm) {
  if (cm === 0) return '0';

  const heightMeters = cm / 100;
  const result = kg / Math.pow(heightMeters, 2);

  return result.toFixed(1);
}

// Hacer las funciones disponibles globalmente
window.cmToFeetInches = cmToFeetInches;
window.kgToLbs = kgToLbs;
window.calculateIMC = calculateIMC;
