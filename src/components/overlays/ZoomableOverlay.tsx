"use client";

import { motion, AnimatePresence } from "motion/react";
import { ReactNode, useState, useEffect } from "react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useTouchGestures } from "@/hooks/useTouchGestures";

interface ZoomableOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  enableZoom?: boolean;
  enablePan?: boolean;
  header?: ReactNode;
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
  header,
  extraControls,
  className = "",
  renderInline = false,
}: ZoomableOverlayProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useLockBodyScroll(isVisible);

  const { elementRef } = useTouchGestures({
    onPinch: enableZoom
      ? (newScale) => setScale(Math.min(Math.max(newScale, 0.5), 3))
      : undefined,
    onPan: enablePan
      ? (deltaX, deltaY) =>
          setPosition((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
      : undefined,
    currentScale: scale,
    enablePan: enablePan && scale > 1,
  });

  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [isVisible]);

  const content = (
    <>
      <div className="absolute inset-0 pointer-events-none z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Cerrar"
          className="absolute top-4 right-4 w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black pointer-events-auto"
        >
          <svg
            className="w-6 h-6 text-ink-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {enableZoom && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setScale((s) => Math.min(s + 0.2, 3));
              }}
              aria-label="Zoom in"
              className="w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <svg
                className="w-6 h-6 text-ink-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setScale((s) => Math.max(s - 0.2, 0.5));
              }}
              aria-label="Zoom out"
              className="w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <svg
                className="w-6 h-6 text-ink-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
          </div>
        )}

        {extraControls}

        <div className="absolute bottom-16 md:bottom-4 left-4 max-w-[70%] bg-surface-1/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border-default pointer-events-auto">
          <p className="text-xs text-ink-secondary leading-snug">
            {scale > 1
              ? "Arrastra para mover • Pinch para zoom"
              : "Pinch para zoom • Tap para cerrar"}
          </p>
        </div>
      </div>

      {header ?? (
        <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none flex justify-center p-4">
          <div
            className="bg-surface-1/95 backdrop-blur-sm rounded-b-lg px-6 py-3 border-b-2 border-x-2 border-accent shadow-lg [border-top:2px_solid_var(--color-surface-base)]"
          >
            <h2 className="text-lg md:text-xl font-semibold text-ink-primary">
              {title}
            </h2>
          </div>
        </div>
      )}

      <motion.div
        ref={elementRef}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className={`relative w-full h-full flex items-center justify-center ${scale > 1 ? 'cursor-grab' : 'cursor-default'} shadow-[0_0_0_2px_var(--color-surface-base),0_0_0_4px_var(--accent),0_8px_32px_rgba(61,31,92,0.4)] bg-[linear-gradient(135deg,rgba(61,31,92,0.3)_0%,rgba(20,10,30,0.5)_100%)] ${className}`}
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
      </motion.div>
    </>
  );

  if (renderInline) {
    return isVisible ? <>{content}</> : null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
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
  );
}
