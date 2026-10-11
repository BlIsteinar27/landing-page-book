"use client";

import { motion, AnimatePresence } from "motion/react";
import { ReactNode, useState, useId, useLayoutEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import Portal from "@/components/Portal";
import { motionTokens, exitTransition } from "@/config/motion-tokens";
import { useDialog } from "@/hooks/useDialog";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useTouchGestures } from "@/hooks/useTouchGestures";

// Zoom máximo/minimo del contenido (los mapas se sirven con `unoptimized`
// a resolución completa, así que ×7 sigue nítido)
const MAX_SCALE = 7;
const MIN_SCALE = 0.5;

interface ZoomableOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  enableZoom?: boolean;
  enablePan?: boolean;
  /** Fracción del marco (0-1) que la imagen debe cubrir al abrirse */
  initialFill?: number;
  header?: ReactNode;
  /** id del título dentro de un `header` custom, para `aria-labelledby` */
  titleId?: string;
  extraControls?: ReactNode;
  className?: string;
  renderInline?: boolean;
}

export default function ZoomableOverlay({
  isVisible,
  onClose,
  title,
  children,
  enableZoom = true,
  enablePan = true,
  initialFill,
  header,
  titleId: titleIdProp,
  extraControls,
  className = "",
  renderInline = false,
}: ZoomableOverlayProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const generatedTitleId = useId();
  const titleId = titleIdProp ?? generatedTitleId;
  // Con header custom sin id no hay título que referenciar: se usa aria-label
  const hasTitleElement = !header || titleIdProp !== undefined;

  useLockBodyScroll(isVisible && !renderInline);
  const dialogRef = useDialog<HTMLDivElement>(
    isVisible && !renderInline,
    onClose,
  );

  const { elementRef } = useTouchGestures({
    onPinch: enableZoom
      ? (newScale) =>
          setScale(Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE))
      : undefined,
    onPan: enablePan
      ? (deltaX, deltaY) =>
          setPosition((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
      : undefined,
    currentScale: scale,
    enablePan: enablePan && scale > 1,
  });

  // Zoom inicial adaptativo: acerca la imagen hasta cubrir `initialFill` del
  // marco, según el aspecto de la imagen y el tamaño real del contenedor.
  // Nunca pasa de "cover" completo ni abre por debajo de la vista ajustada.
  useLayoutEffect(() => {
    if (initialFill === undefined) return;
    const frame = elementRef.current;
    const img = frame?.querySelector("img");
    if (!frame || !img) return;

    const fitToFrame = () => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const style = getComputedStyle(img);
      const fitW =
        img.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      const fitH =
        img.clientHeight -
        parseFloat(style.paddingTop) -
        parseFloat(style.paddingBottom);
      const frameArea = frame.clientWidth * frame.clientHeight;
      if (!iw || !ih || !fitW || !fitH || !frameArea) return;
      const contain = Math.min(fitW / iw, fitH / ih);
      const coverOverContain = Math.max(fitW / iw, fitH / ih) / contain;
      const shownW = iw * contain;
      const shownH = ih * contain;
      const scaleForFill = Math.sqrt(
        (initialFill * frameArea) / (shownW * shownH),
      );
      setScale(
        Math.min(Math.max(scaleForFill, 1), coverOverContain, MAX_SCALE),
      );
    };

    const raf = requestAnimationFrame(fitToFrame);
    if (!img.complete) img.addEventListener("load", fitToFrame);
    const observer = new ResizeObserver(fitToFrame);
    observer.observe(frame);
    return () => {
      cancelAnimationFrame(raf);
      img.removeEventListener("load", fitToFrame);
      observer.disconnect();
    };
  }, [initialFill, elementRef]);

  const content = (
    <>
      <div className="absolute inset-0 pointer-events-none z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label={`Cerrar ${title}`}
          className="absolute top-4 right-4 w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black pointer-events-auto"
        >
          <X
            className="w-6 h-6 text-ink-primary"
            strokeWidth={2}
            nonScalingStroke
            aria-hidden
          />
        </button>

        {enableZoom && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setScale((s) => Math.min(s + 0.2, MAX_SCALE));
              }}
              aria-label="Acercar"
              className="w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <Plus
                className="w-6 h-6 text-ink-primary"
                strokeWidth={2}
                nonScalingStroke
                aria-hidden
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setScale((s) => Math.max(s - 0.2, MIN_SCALE));
              }}
              aria-label="Alejar"
              className="w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <Minus
                className="w-6 h-6 text-ink-primary"
                strokeWidth={2}
                nonScalingStroke
                aria-hidden
              />
            </button>
          </div>
        )}

        {extraControls}

        <div className="absolute bottom-16 md:bottom-4 left-4 max-w-[70%] bg-surface-1/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border-default pointer-events-auto">
          <p className="text-xs text-ink-secondary leading-snug">
            {scale > 1 ? (
              "Arrastra para mover · Usa + y − para acercar o alejar"
            ) : (
              <>
                <span className="pointer-coarse:hidden">
                  Usa + y − para acercar · Haz clic fuera del mapa para cerrar
                </span>
                <span className="hidden pointer-coarse:inline">
                  Pellizca para acercar · Toca fuera del mapa para cerrar
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      <motion.div
        ref={elementRef}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ ...exitTransition.exit, transition: exitTransition.transition }}
        transition={motionTokens.spring}
        className={`relative w-full h-full flex items-center justify-center overflow-hidden ${scale > 1 ? "cursor-grab" : "cursor-default"} border border-transparent shadow-[0_0_0_2px_var(--color-surface-base),0_0_0_4px_var(--accent),0_8px_32px_rgba(61,31,92,0.4)] bg-[linear-gradient(135deg,rgba(61,31,92,0.3)_0%,rgba(20,10,30,0.5)_100%)] ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          {children}
        </div>

        {header ?? (
          <div className="absolute top-0 inset-x-0 z-30 pointer-events-none flex justify-center">
            <div className="bg-surface-1/95 backdrop-blur-sm rounded-b-lg px-6 py-3 border-b-2 border-x-2 border-accent shadow-lg [border-top:2px_solid_var(--color-surface-base)]">
              <h2
                id={titleId}
                className="text-lg md:text-xl font-semibold text-ink-primary"
              >
                {title}
              </h2>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );

  if (renderInline) {
    return isVisible ? <>{content}</> : null;
  }

  return (
    <Portal>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={hasTitleElement ? titleId : undefined}
            aria-label={hasTitleElement ? undefined : title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overscroll-contain touch-none"
            onClick={onClose}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
