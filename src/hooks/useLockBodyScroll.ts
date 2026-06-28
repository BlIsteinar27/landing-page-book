import { useEffect } from 'react';

/**
 * Bloquea el scroll del body mientras el componente esté montado.
 * Útil para modales, overlays y galerías de imagen a pantalla completa.
 * Restaura el scroll original al desmontar o cuando `isLocked` cambia a false.
 */
export function useLockBodyScroll(isLocked: boolean = true) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const originalTouchAction = document.body.style.touchAction;
    const originalOverscrollBehavior = document.body.style.overscrollBehavior;

    if (isLocked) {
      // Guardar ancho del scrollbar para evitar layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.touchAction = 'none';
      document.body.style.overscrollBehavior = 'none';
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.body.style.touchAction = originalTouchAction;
      document.body.style.overscrollBehavior = originalOverscrollBehavior;
    };
  }, [isLocked]);
}
