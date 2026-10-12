"use client";

import {
  m,
  AnimatePresence,
  animate,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";
import { ReactNode, useState, useEffect, useId, useLayoutEffect } from "react";
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
  // Zoom y pan en MotionValues: los gestos escriben el transform directo al
  // DOM sin re-render por evento; `zoomed` solo se deriva al cruzar el umbral
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [zoomed, setZoomed] = useState(false);
  useMotionValueEvent(scale, "change", (v) => {
    const z = v > 1.001;
    setZoomed((prev) => (prev === z ? prev : z));
    // Al volver a escala 1 el pan se resetea — sin imagen desplazada de adorno
    if (v <= 1.001) {
      x.set(0);
      y.set(0);
    }
  });
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
          scale.set(Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE))
      : undefined,
    onPan: enablePan
      ? (deltaX, deltaY) => {
          // Clamp: el desplazamiento máximo es el overflow de la imagen
          // escalada respecto al marco — no se puede sacar del marco
          const frame = elementRef.current;
          if (!frame) return;
          const s = scale.get();
          const boundX = Math.max(0, ((s - 1) * frame.clientWidth) / 2);
          const boundY = Math.max(0, ((s - 1) * frame.clientHeight) / 2);
          x.set(Math.min(Math.max(x.get() + deltaX, -boundX), boundX));
          y.set(Math.min(Math.max(y.get() + deltaY, -boundY), boundY));
        }
      : undefined,
    currentScale: () => scale.get(),
    enablePan: enablePan && zoomed,
  });

  // Zoom con rueda anclado al cursor: el wheel va por listener no-pasivo
  // (preventDefault) y se acumula en rAF para no escribir por evento
  useEffect(() => {
    const frame = elementRef.current;
    if (!frame || !enableZoom) return;
    let raf = 0;
    let pendingDelta = 0;
    let anchorX = 0;
    let anchorY = 0;

    const applyWheel = () => {
      raf = 0;
      const s = scale.get();
      const next = Math.min(
        Math.max(s * Math.exp(-pendingDelta * 0.0015), MIN_SCALE),
        MAX_SCALE,
      );
      pendingDelta = 0;
      if (next === s) return;
      // El punto bajo el cursor queda fijo: x' = a - (a - x)·(s'/s),
      // clampeado al overflow de la imagen escalada (mismo límite que el pan)
      const k = next / s;
      const rect = frame.getBoundingClientRect();
      const boundX = Math.max(0, ((next - 1) * rect.width) / 2);
      const boundY = Math.max(0, ((next - 1) * rect.height) / 2);
      x.set(
        Math.min(Math.max(anchorX - (anchorX - x.get()) * k, -boundX), boundX),
      );
      y.set(
        Math.min(Math.max(anchorY - (anchorY - y.get()) * k, -boundY), boundY),
      );
      scale.set(next);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = frame.getBoundingClientRect();
      anchorX = e.clientX - rect.left - rect.width / 2;
      anchorY = e.clientY - rect.top - rect.height / 2;
      pendingDelta += e.deltaY;
      if (!raf) raf = requestAnimationFrame(applyWheel);
    };

    frame.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      frame.removeEventListener("wheel", onWheel);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enableZoom, scale, x, y, elementRef]);

  // Doble clic: alterna ×2 anclado al cursor ↔ escala 1
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!enableZoom) return;
    if ((e.target as HTMLElement).closest("button")) return;
    const frame = elementRef.current;
    if (!frame) return;
    e.preventDefault();
    const transition = { duration: motionTokens.duration.normal };
    const s = scale.get();
    if (s > 1.001) {
      animate(scale, 1, transition);
      animate(x, 0, transition);
      animate(y, 0, transition);
    } else {
      const rect = frame.getBoundingClientRect();
      const ax = e.clientX - rect.left - rect.width / 2;
      const ay = e.clientY - rect.top - rect.height / 2;
      const next = Math.min(s * 2, MAX_SCALE);
      const k = next / s;
      const boundX = Math.max(0, ((next - 1) * rect.width) / 2);
      const boundY = Math.max(0, ((next - 1) * rect.height) / 2);
      animate(
        x,
        Math.min(Math.max(ax - (ax - x.get()) * k, -boundX), boundX),
        transition,
      );
      animate(
        y,
        Math.min(Math.max(ay - (ay - y.get()) * k, -boundY), boundY),
        transition,
      );
      animate(scale, next, transition);
    }
  };

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
      scale.set(
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
  }, [initialFill, elementRef, scale]);

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
                animate(scale, Math.min(scale.get() + 0.2, MAX_SCALE), {
                  duration: motionTokens.duration.fast,
                  ease: "easeOut",
                });
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
                animate(scale, Math.max(scale.get() - 0.2, MIN_SCALE), {
                  duration: motionTokens.duration.fast,
                  ease: "easeOut",
                });
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
            {zoomed ? (
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

      <m.div
        ref={elementRef}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ ...exitTransition.exit, transition: exitTransition.transition }}
        transition={motionTokens.spring}
        className={`relative w-full h-full flex items-center justify-center overflow-hidden ${zoomed ? "cursor-grab" : "cursor-default"} rounded-2xl border border-border-emphasis bg-[radial-gradient(120%_100%_at_50%_0%,var(--color-surface-3),var(--color-surface-deep))] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6),0_0_24px_var(--color-accent-dim)] ${className}`}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={handleDoubleClick}
      >
        <m.div
          style={{ x, y, scale }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {children}
        </m.div>

        {header ?? (
          <div className="absolute top-0 inset-x-0 z-30 pointer-events-none flex justify-center">
            <div className="bg-surface-1/95 backdrop-blur-sm rounded-b-lg px-6 py-3 border-b border-x border-accent-glow shadow-lg">
              <h2
                id={titleId}
                className="text-lg md:text-xl font-semibold text-ink-primary"
              >
                {title}
              </h2>
            </div>
          </div>
        )}
      </m.div>
    </>
  );

  if (renderInline) {
    return isVisible ? <>{content}</> : null;
  }

  return (
    <Portal>
      <AnimatePresence>
        {isVisible && (
          <m.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={hasTitleElement ? titleId : undefined}
            aria-label={hasTitleElement ? undefined : title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-surface-deep/95 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain touch-none"
            onClick={onClose}
          >
            {content}
          </m.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
