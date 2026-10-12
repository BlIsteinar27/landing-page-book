import { useRef, useState, useEffect, useLayoutEffect } from "react";

interface UseTouchGesturesOptions {
  onLongPress?: (event: TouchEvent) => void;
  onPinch?: (scale: number) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  longPressDelay?: number; // ms
  /** Escala actual para el pinch: número fijo o getter (p. ej. sobre un MotionValue) */
  currentScale?: number | (() => number);
  enablePan?: boolean; // Habilitar arrastre
}

export function useTouchGestures<T extends HTMLElement = HTMLDivElement>(
  options: UseTouchGesturesOptions = {},
) {
  const elementRef = useRef<T>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // Opciones más recientes, leídas en los handlers sin re-suscribir listeners
  const optsRef = useRef(options);
  useLayoutEffect(() => {
    optsRef.current = options;
  });

  // Estado para arrastre (pan)
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);

  // Pinch zoom logic
  const initialDistanceRef = useRef<number>(0);
  const initialScaleRef = useRef<number>(1);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    // Estado inicial de las opciones para decidir listeners y passive;
    // los handlers leen optsRef.current en cada evento (valores siempre frescos)
    const initialOpts = optsRef.current;
    const initialPan = initialOpts.enablePan ?? false;
    const initialPinch = !!initialOpts.onPinch;

    const handleTouchStart = (e: TouchEvent) => {
      const {
        onLongPress,
        onPinch,
        onPan,
        longPressDelay = 500,
      } = optsRef.current;
      const panEnabled = optsRef.current.enablePan ?? false;
      const touchCount = e.touches.length;

      // Prevenir zoom nativo del navegador durante pinch o pan
      if (
        (onPinch && touchCount === 2) ||
        (panEnabled && onPan && touchCount === 1)
      ) {
        e.preventDefault();
      }

      if (panEnabled && onPan && touchCount === 1) {
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
    };

    const handleTouchMove = (e: TouchEvent) => {
      const { onPinch, onPan } = optsRef.current;
      const rawScale = optsRef.current.currentScale ?? 1;
      const currentScale =
        typeof rawScale === "function" ? rawScale() : rawScale;
      const panEnabled = optsRef.current.enablePan ?? false;
      const touchCount = e.touches.length;

      if (touchCount === 2 && onPinch) {
        e.preventDefault(); // Evitar que el navegador haga zoom nativo de la página
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
        panEnabled &&
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
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      initialDistanceRef.current = 0;
      initialScaleRef.current = 1;

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      setIsLongPressing(false);
    };

    // Mouse handlers para arrastre
    const handleMouseDown = (e: MouseEvent) => {
      const { onPan } = optsRef.current;
      if (optsRef.current.enablePan && onPan) {
        e.preventDefault(); // Prevenir comportamiento por defecto
        isDraggingRef.current = true;
        startXRef.current = e.clientX;
        startYRef.current = e.clientY;
        // Cambiar cursor a grabbing
        element.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { onPan } = optsRef.current;
      if (optsRef.current.enablePan && onPan && isDraggingRef.current) {
        e.preventDefault(); // Prevenir comportamiento por defecto
        const deltaX = e.clientX - startXRef.current;
        const deltaY = e.clientY - startYRef.current;
        onPan(deltaX, deltaY);
        startXRef.current = e.clientX;
        startYRef.current = e.clientY;
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      // Restaurar cursor
      if (optsRef.current.enablePan) {
        element.style.cursor = "grab";
      }
    };

    // Touch events - non-passive cuando hay pinch o pan activo para poder usar preventDefault
    const needsActiveTouch = initialPan || initialPinch;
    element.addEventListener("touchstart", handleTouchStart, {
      passive: !needsActiveTouch,
    });
    element.addEventListener("touchmove", handleTouchMove, {
      passive: !needsActiveTouch,
    });
    element.addEventListener("touchend", handleTouchEnd);

    // Mouse events: siempre instalados — los handlers se autogatean leyendo
    // optsRef.current.enablePan en cada evento
    element.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    // Deps []: los handlers leen las opciones frescas vía optsRef,
    // no hace falta re-suscribir cuando cambian
  }, []);

  return { elementRef, isLongPressing };
}
