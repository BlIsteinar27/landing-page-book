import { useRef, useState, useEffect, useLayoutEffect } from "react";

interface UseTouchGesturesOptions {
  onLongPress?: (event: TouchEvent) => void;
  onDoubleTap?: (event: TouchEvent) => void;
  onPinch?: (scale: number) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  longPressDelay?: number; // ms
  /** Escala actual para el pinch: número fijo o getter (p. ej. sobre un MotionValue) */
  currentScale?: number | (() => number);
  enablePan?: boolean; // Habilitar arrastre
}

// Doble toque: los navegadores táctiles no sintetizan `dblclick` de forma
// fiable (iOS no lo emite; Android lo suprime cuando el touchstart lleva
// preventDefault), así que se detecta a mano: dos taps de un dedo, cortos y
// casi sin moverse, juntos en tiempo y posición
const DOUBLE_TAP_WINDOW_MS = 300;
const DOUBLE_TAP_MAX_GAP_PX = 40;
const TAP_MAX_DURATION_MS = 300;
const TAP_MAX_MOVE_PX = 10;

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

  // Detección de tap/doble tap (un solo dedo, sin arrastre ni pinch)
  const tapStartRef = useRef<{ time: number; x: number; y: number } | null>(
    null,
  );
  const tapMovedRef = useRef(false);
  const multiTouchRef = useRef(false);
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(
    null,
  );

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

      if (touchCount === 1) {
        multiTouchRef.current = false;
        tapMovedRef.current = false;
        tapStartRef.current = {
          time: performance.now(),
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else {
        multiTouchRef.current = true;
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

      if (
        touchCount === 1 &&
        tapStartRef.current &&
        !tapMovedRef.current &&
        Math.hypot(
          e.touches[0].clientX - tapStartRef.current.x,
          e.touches[0].clientY - tapStartRef.current.y,
        ) > TAP_MAX_MOVE_PX
      ) {
        tapMovedRef.current = true;
      }

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      setIsLongPressing(false);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      isDraggingRef.current = false;
      initialDistanceRef.current = 0;
      initialScaleRef.current = 1;

      // El tap cuenta solo si la secuencia fue de un solo dedo, corta y sin
      // desplazamiento (nada de pinch ni arrastre)
      if (e.touches.length === 0) {
        const { onDoubleTap } = optsRef.current;
        const tap = tapStartRef.current;
        const touch = e.changedTouches[0];
        const now = performance.now();
        if (
          onDoubleTap &&
          tap &&
          touch &&
          !multiTouchRef.current &&
          !tapMovedRef.current &&
          now - tap.time <= TAP_MAX_DURATION_MS
        ) {
          const last = lastTapRef.current;
          const isDouble =
            last !== null &&
            now - last.time <= DOUBLE_TAP_WINDOW_MS &&
            Math.hypot(touch.clientX - last.x, touch.clientY - last.y) <=
              DOUBLE_TAP_MAX_GAP_PX;
          if (isDouble) {
            lastTapRef.current = null;
            onDoubleTap(e);
          } else {
            lastTapRef.current = {
              time: now,
              x: touch.clientX,
              y: touch.clientY,
            };
          }
        }
        multiTouchRef.current = false;
      }

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
