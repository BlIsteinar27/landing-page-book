import { useEffect } from 'react';

/**
 * Contador global de instancias activas del lock.
 * Evita que múltiples overlays apilados (DualOverlay + ZoomableOverlay)
 * restauren el scroll prematuramente al desmontar uno de ellos.
 */
let lockCount = 0;

/**
 * Bloquea el scroll del body mientras el componente esté montado.
 * Útil para modales, overlays y galerías de imagen a pantalla completa.
 * Restaura el scroll original solo cuando el último lock se libera.
 */
export function useLockBodyScroll(isLocked: boolean = true) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!isLocked) return;

    lockCount += 1;

    if (lockCount === 1) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.touchAction = 'none';
      document.body.style.overscrollBehavior = 'none';
    }

    return () => {
      lockCount -= 1;

      if (lockCount === 0) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.body.style.touchAction = '';
        document.body.style.overscrollBehavior = '';
      }
    };
  }, [isLocked]);
}
