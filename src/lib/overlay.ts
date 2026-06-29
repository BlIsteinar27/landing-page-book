/**
 * Helpers para manipulación de zoom y pan en overlays
 */

/**
 * Clampa un valor entre un mínimo y un máximo
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calcula el nuevo zoom basado en un delta (pinch gesture)
 */
export function calculateZoom(currentZoom: number, delta: number): number {
  const newZoom = currentZoom + delta;
  return clamp(newZoom, 0.5, 3);
}

/**
 * Calcula la nueva posición basada en delta y zoom actual
 */
export function calculatePan(
  currentX: number,
  currentY: number,
  deltaX: number,
  deltaY: number,
  zoom: number
): { x: number; y: number } {
  // El pan se escala inversamente con el zoom para mayor precisión
  const scale = 1 / zoom;
  return {
    x: currentX + deltaX * scale,
    y: currentY + deltaY * scale,
  };
}

/**
 * Resetea zoom y posición a valores iniciales
 */
export function resetZoomAndPan(): { zoom: number; position: { x: number; y: number } } {
  return {
    zoom: 1,
    position: { x: 0, y: 0 },
  };
}
