import { useRef, useState, useCallback, useEffect } from 'react';

interface UseTouchGesturesOptions {
  onLongPress?: (event: TouchEvent) => void;
  onPinch?: (scale: number) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  longPressDelay?: number; // ms
  currentScale?: number; // Escala actual del componente para pinch zoom
  enablePan?: boolean; // Habilitar arrastre
}

export function useTouchGestures(options: UseTouchGesturesOptions = {}) {
  const { 
    onLongPress, 
    onPinch,
    onPan,
    longPressDelay = 500,
    currentScale = 1,
    enablePan = false
  } = options;
  const elementRef = useRef<HTMLDivElement>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  
  // Estado para arrastre (pan)
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (enablePan && onPan && e.touches.length === 1) {
      e.preventDefault(); // Bloquear scroll de fondo
      isDraggingRef.current = true;
      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
    }
    
    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        setIsLongPressing(true);
        onLongPress(e);
      }, longPressDelay);
    }
  }, [onLongPress, longPressDelay, enablePan, onPan]);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const touchCount = e.touches.length;

      if (touchCount === 2 && onPinch) {
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        if (initialDistanceRef.current === 0) {
          initialDistanceRef.current = distance;
          initialScaleRef.current = currentScale;
        }
        const newScale =
          initialScaleRef.current * (distance / initialDistanceRef.current);
        onPinch(newScale);
      } else if (
        touchCount === 1 &&
        enablePan &&
        onPan &&
        isDraggingRef.current
      ) {
        e.preventDefault();
        const deltaX = e.touches[0].clientX - startXRef.current;
        const deltaY = e.touches[0].clientY - startYRef.current;
        onPan(deltaX, deltaY);
        startXRef.current = e.touches[0].clientX;
        startYRef.current = e.touches[0].clientY;
      }

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      setIsLongPressing(false);
    },
    [enablePan, onPan, onPinch, currentScale],
  );

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    setIsLongPressing(false);
  }, []);

  // Pinch zoom logic
  const initialDistanceRef = useRef<number>(0);
  const initialScaleRef = useRef<number>(1);

  // Mouse handlers para arrastre
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (enablePan && onPan) {
      e.preventDefault(); // Prevenir comportamiento por defecto
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
      // Cambiar cursor a grabbing
      if (elementRef.current) {
        elementRef.current.style.cursor = 'grabbing';
      }
    }
  }, [enablePan, onPan]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (enablePan && onPan && isDraggingRef.current) {
      e.preventDefault(); // Prevenir comportamiento por defecto
      const deltaX = e.clientX - startXRef.current;
      const deltaY = e.clientY - startYRef.current;
      onPan(deltaX, deltaY);
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
    }
  }, [enablePan, onPan]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    // Restaurar cursor
    if (elementRef.current && enablePan) {
      elementRef.current.style.cursor = 'grab';
    }
  }, [enablePan]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Touch events - non-passive cuando enablePan está activo para poder usar preventDefault
    element.addEventListener('touchstart', handleTouchStart, {
      passive: !enablePan,
    });
    element.addEventListener('touchmove', handleTouchMove, {
      passive: !enablePan,
    });
    element.addEventListener('touchend', handleTouchEnd);

    // Mouse events (solo si enablePan está activo)
    if (enablePan) {
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseup', handleMouseUp);
      element.addEventListener('mouseleave', handleMouseUp);
    }

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);

      if (enablePan) {
        element.removeEventListener('mousedown', handleMouseDown);
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseup', handleMouseUp);
        element.removeEventListener('mouseleave', handleMouseUp);
      }
    };
  }, [
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    enablePan,
  ]);

  return { elementRef, isLongPressing };
}
