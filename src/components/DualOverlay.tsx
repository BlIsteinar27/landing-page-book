'use client';

import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface DualOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  leftImagePath: string;
  rightImagePath: string;
  leftTitle: string;
  rightTitle: string;
}

type ViewMode = 'dual' | 'single-left' | 'single-right';

export default function DualOverlay({ 
  isVisible, 
  onClose, 
  leftImagePath, 
  rightImagePath, 
  leftTitle, 
  rightTitle 
}: DualOverlayProps) {
  const [scale, setScale] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('dual');
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
    enablePan: viewMode !== 'dual' // Habilitar arrastre siempre en vista individual
  });

  // Reset estado cuando el overlay se abre/cierra
  useEffect(() => {
    if (isVisible) {
      setScale(1);
      setViewMode('dual');
      setPosition({ x: 0, y: 0 });
    }
  }, [isVisible]);

  // Reset zoom y posición al cambiar de vista
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [viewMode]);

  const handleImageClick = (side: 'left' | 'right') => {
    setViewMode(side === 'left' ? 'single-left' : 'single-right');
  };

  const handleBackToDual = () => {
    setViewMode('dual');
  };

  const currentImagePath = viewMode === 'single-left' ? leftImagePath : rightImagePath;
  const currentTitle = viewMode === 'single-left' ? leftTitle : rightTitle;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overscroll-contain"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
        >
          {/* Contenedor de controles - fuera del contenedor que escala */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Close Button */}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="absolute top-4 right-4 w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black pointer-events-auto"
            >
              <svg className="w-6 h-6 text-ink-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Back Button - solo visible en vista individual */}
            {viewMode !== 'dual' && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={(e) => { e.stopPropagation(); handleBackToDual(); }}
                className="absolute top-4 left-4 flex items-center gap-2 bg-surface-1 rounded-full px-4 py-2 border border-border-default hover:bg-surface-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black pointer-events-auto"
              >
                <svg className="w-5 h-5 text-ink-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm text-ink-primary">Ver ambos</span>
              </motion.button>
            )}

            {/* Zoom Controls - solo en vista individual */}
            {viewMode !== 'dual' && (
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col gap-2 pointer-events-auto">
                <button
                  onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(s + 0.2, 3)); }}
                  className="w-10 h-10 md:w-12 md:h-12 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-ink-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(s - 0.2, 0.5)); }}
                  className="w-10 h-10 md:w-12 md:h-12 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-ink-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
              </div>
            )}

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-surface-1/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border-default pointer-events-auto">
              <p className="text-xs text-ink-secondary">
                {viewMode === 'dual' ? 'Toca una imagen para ampliar' : 'Arrastra para mover • Pinch para zoom'}
              </p>
            </div>
          </div>

          {/* Header con nombre del mapa en vista individual */}
          {viewMode !== 'dual' && (
            <div className="absolute top-0 left-36 right-16 md:left-40 md:right-20 z-30 pointer-events-none flex justify-center p-4">
              <div className="bg-surface-1/95 backdrop-blur-sm rounded-b-lg px-6 py-3 border-b-2 border-x-2 border-[#ffc667] shadow-lg max-w-full" style={{ borderTop: '2px solid #3d1f5c' }}>
                <h2 className="text-base md:text-xl font-semibold text-ink-primary truncate text-center">{currentTitle}</h2>
              </div>
            </div>
          )}

          {/* Vista Dual */}
          <AnimatePresence mode="wait">
            {viewMode === 'dual' ? (
              <motion.div
                key="dual-view"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative w-full h-full max-w-7xl max-h-[85vh] grid grid-cols-1 md:grid-cols-2 gap-4 p-2"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left Image - Reino Oscuro */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => { e.stopPropagation(); handleImageClick('left'); }}
                  className="relative w-full h-full min-h-[200px] flex items-center justify-center overflow-hidden bg-surface-2 cursor-pointer transition-colors"
                  style={{
                    boxShadow: '0 0 0 2px #3d1f5c, 0 0 0 4px #ffc667, 0 8px 32px rgba(61, 31, 92, 0.4)'
                  }}
                >
                  <Image
                    src={leftImagePath}
                    alt={leftTitle}
                    fill
                    className="object-contain p-2"
                    sizes="50vw"
                  />
                  <div className="absolute top-4 left-4 bg-surface-1/95 backdrop-blur-sm rounded-lg px-3 py-2 border-2 border-[#ffc667] z-10 shadow-lg">
                    <p className="text-sm font-medium text-ink-primary">{leftTitle}</p>
                    <p className="text-[10px] text-[#ffc667] mt-0.5">Toca para ampliar</p>
                  </div>
                </motion.div>

                {/* Right Image - Mapa de Galaxias */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => { e.stopPropagation(); handleImageClick('right'); }}
                  className="relative w-full h-full min-h-[200px] flex items-center justify-center overflow-hidden bg-surface-2 cursor-pointer transition-colors"
                  style={{
                    boxShadow: '0 0 0 2px #3d1f5c, 0 0 0 4px #ffc667, 0 8px 32px rgba(61, 31, 92, 0.4)'
                  }}
                >
                  <Image
                    src={rightImagePath}
                    alt={rightTitle}
                    fill
                    className="object-contain p-2"
                    sizes="50vw"
                  />
                  <div className="absolute bottom-4 right-4 bg-surface-1/95 backdrop-blur-sm rounded-lg px-3 py-2 border-2 border-[#ffc667] z-10 shadow-lg">
                    <p className="text-sm font-medium text-ink-primary">{rightTitle}</p>
                    <p className="text-[10px] text-[#ffc667] mt-0.5">Toca para ampliar</p>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              /* Vista Individual con zoom */
              <motion.div
                key="single-view"
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
                className="relative w-full h-full max-w-5xl max-h-[85vh] overflow-hidden bg-surface-2"
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  cursor: 'grab',
                  boxShadow: '0 0 0 2px #3d1f5c, 0 0 0 4px #ffc667, 0 8px 32px rgba(61, 31, 92, 0.4)'
                }}
              >
                <Image
                  src={currentImagePath}
                  alt={currentTitle}
                  fill
                  className="object-contain p-2"
                  sizes="100vw"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
