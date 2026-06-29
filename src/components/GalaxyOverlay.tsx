'use client';

import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface GalaxyOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  svgPath: string;
  title?: string;
}

export default function GalaxyOverlay({ isVisible, onClose, svgPath, title = 'Mapa de Galaxias' }: GalaxyOverlayProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Bloquear scroll del body cuando overlay está abierto
  useLockBodyScroll(isVisible);

  const { elementRef } = useTouchGestures({
    onPinch: (newScale) => {
      setScale(Math.min(Math.max(newScale, 0.5), 3));
    },
    onPan: (deltaX, deltaY) => {
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
    },
    currentScale: scale,
    enablePan: scale > 1
  });

  // Reset zoom y posición cuando el overlay se abre
  useEffect(() => {
    if (isVisible) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isVisible]);

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
          {/* Contenedor de controles - fuera del contenedor que escala */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Close Button */}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="absolute top-4 right-4 w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black pointer-events-auto"
            >
              <svg className="w-6 h-6 text-ink-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Zoom Controls - Fixed position outside scaling container */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-auto">
              <button
                onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(s + 0.2, 3)); }}
                className="w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <svg className="w-6 h-6 text-ink-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(s - 0.2, 0.5)); }}
                className="w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <svg className="w-6 h-6 text-ink-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 bg-surface-1/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border-default pointer-events-auto">
              <p className="text-xs text-ink-secondary">
                {scale > 1 ? 'Arrastra para mover • Pinch para zoom' : 'Pinch para zoom • Tap para cerrar'}
              </p>
            </div>
          </div>

          {/* Header con nombre del mapa */}
          <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none flex justify-center p-4">
            <div className="bg-surface-1/95 backdrop-blur-sm rounded-b-lg px-6 py-3 border-b-2 border-x-2 border-[#ffc667] shadow-lg" style={{ borderTop: '2px solid #3d1f5c' }}>
              <h2 className="text-lg md:text-xl font-semibold text-ink-primary">{title}</h2>
            </div>
          </div>

          {/* Contenedor de imagen con marco - este es el que escala */}
          <motion.div
            ref={elementRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: scale, 
              opacity: 1,
              x: position.x,
              y: position.y
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className={`relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center p-3 md:p-4 ${scale > 1 ? 'cursor-grab' : 'cursor-default'} shadow-[0_0_0_2px_var(--color-surface-base),0_0_0_4px_var(--accent),0_8px_32px_rgba(61,31,92,0.4)] bg-[linear-gradient(135deg,rgba(61,31,92,0.3)_0%,rgba(20,10,30,0.5)_100%)]`}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={svgPath}
              alt={title}
              fill
              className="object-contain p-2 md:p-3"
              sizes="100vw"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
