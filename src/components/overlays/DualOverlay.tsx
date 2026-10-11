"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState, useId } from "react";
import { ChevronLeft, X } from "lucide-react";
import Portal from "@/components/Portal";
import { motionTokens, exitTransition } from "@/config/motion-tokens";
import { useDialog } from "@/hooks/useDialog";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import ZoomableOverlay from "./ZoomableOverlay";
import RealmInfoPanel from "./RealmInfoPanel";
import { RealmLore } from "@/config/realms-data";

interface DualOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  leftImagePath: string;
  rightImagePath: string;
  leftTitle: string;
  rightTitle: string;
  lore?: RealmLore;
}

type ViewMode = "dual" | "single-left" | "single-right";

export default function DualOverlay({
  isVisible,
  onClose,
  leftImagePath,
  rightImagePath,
  leftTitle,
  rightTitle,
  lore,
}: DualOverlayProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("dual");
  const titleId = useId();

  useLockBodyScroll(isVisible);
  const dialogRef = useDialog<HTMLDivElement>(isVisible, onClose);

  const handleImageClick = (side: "left" | "right") => {
    setViewMode(side === "left" ? "single-left" : "single-right");
  };

  const handleBackToDual = () => {
    setViewMode("dual");
  };

  const currentImagePath =
    viewMode === "single-left" ? leftImagePath : rightImagePath;
  const currentTitle = viewMode === "single-left" ? leftTitle : rightTitle;

  return (
    <Portal>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overscroll-contain touch-none"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            {/* En vista individual el título lo aporta la cabecera de ZoomableOverlay */}
            {viewMode === "dual" && (
              <h2 id={titleId} className="sr-only">
                Mapas del Reino Oscuro
              </h2>
            )}

            {/* Close Button - siempre visible */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Cerrar mapas"
                className="absolute top-4 right-4 w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black pointer-events-auto"
              >
                <X
                  className="w-6 h-6 text-ink-primary"
                  strokeWidth={2}
                  nonScalingStroke
                  aria-hidden
                />
              </button>

              {/* Instructions - solo en vista dual; en vista individual ZoomableOverlay las provee */}
              {viewMode === "dual" && (
                <div className="absolute bottom-4 left-4 bg-surface-1/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border-default pointer-events-auto">
                  <p className="text-xs text-ink-secondary">
                    <span className="pointer-coarse:hidden">
                      Haz clic en una imagen para ampliarla
                    </span>
                    <span className="hidden pointer-coarse:inline">
                      Toca una imagen para ampliarla
                    </span>
                  </p>
                </div>
              )}

              {/* Info button - solo en vista dual; describe ambos mapas juntos */}
              {viewMode === "dual" && lore && (
                <div className="absolute top-4 right-16 pointer-events-auto">
                  <RealmInfoPanel lore={lore} />
                </div>
              )}
            </div>

            {/* Vista Dual o Individual */}
            <AnimatePresence mode="wait">
              {viewMode === "dual" ? (
                <motion.div
                  key="dual-view"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{
                    ...exitTransition.exit,
                    transition: exitTransition.transition,
                  }}
                  transition={motionTokens.spring}
                  className="relative w-full h-full max-w-7xl max-h-[85vh] grid grid-cols-1 md:grid-cols-2 gap-4 p-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Left Image */}
                  <motion.button
                    type="button"
                    aria-label={`Ampliar ${leftTitle}`}
                    whileHover={{ scale: motionTokens.scale.hover }}
                    whileTap={{ scale: motionTokens.scale.tap }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick("left");
                    }}
                    className="relative w-full h-full min-h-[200px] flex items-center justify-center overflow-hidden bg-surface-2 cursor-pointer border border-transparent shadow-[0_0_0_2px_var(--color-surface-base),0_0_0_4px_var(--accent),0_8px_32px_rgba(61,31,92,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <Image
                      src={leftImagePath}
                      alt={leftTitle}
                      fill
                      className="object-contain p-2"
                      sizes="50vw"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM2QxZjVjIi8+PC9zdmc+"
                    />
                    <span className="block text-left absolute top-4 left-4 bg-surface-1/95 backdrop-blur-sm rounded-lg px-3 py-2 border-2 border-accent z-10 shadow-lg">
                      <span className="block text-sm font-medium text-ink-primary">
                        {leftTitle}
                      </span>
                      <span className="block text-[10px] text-accent mt-0.5">
                        <span className="pointer-coarse:hidden">
                          Haz clic para ampliar
                        </span>
                        <span className="hidden pointer-coarse:inline">
                          Toca para ampliar
                        </span>
                      </span>
                    </span>
                  </motion.button>

                  {/* Right Image */}
                  <motion.button
                    type="button"
                    aria-label={`Ampliar ${rightTitle}`}
                    whileHover={{ scale: motionTokens.scale.hover }}
                    whileTap={{ scale: motionTokens.scale.tap }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick("right");
                    }}
                    className="relative w-full h-full min-h-[200px] flex items-center justify-center overflow-hidden bg-surface-2 cursor-pointer border border-transparent shadow-[0_0_0_2px_var(--color-surface-base),0_0_0_4px_var(--accent),0_8px_32px_rgba(61,31,92,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <Image
                      src={rightImagePath}
                      alt={rightTitle}
                      fill
                      className="object-contain p-2"
                      sizes="50vw"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM2QxZjVjIi8+PC9zdmc+"
                    />
                    <span className="block text-left absolute bottom-4 right-4 bg-surface-1/95 backdrop-blur-sm rounded-lg px-3 py-2 border-2 border-accent z-10 shadow-lg">
                      <span className="block text-sm font-medium text-ink-primary">
                        {rightTitle}
                      </span>
                      <span className="block text-[10px] text-accent mt-0.5">
                        <span className="pointer-coarse:hidden">
                          Haz clic para ampliar
                        </span>
                        <span className="hidden pointer-coarse:inline">
                          Toca para ampliar
                        </span>
                      </span>
                    </span>
                  </motion.button>
                </motion.div>
              ) : (
                /* Vista Individual delegada a ZoomableOverlay */
                <ZoomableOverlay
                  key="single-view"
                  isVisible={isVisible}
                  onClose={onClose}
                  title={currentTitle}
                  titleId={titleId}
                  className="max-w-5xl max-h-[85vh] overflow-hidden"
                  enablePan
                  renderInline
                  initialFill={0.8}
                  header={
                    <div className="absolute top-0 inset-x-0 z-30 pointer-events-none flex justify-center">
                      <div className="bg-surface-1/95 backdrop-blur-sm rounded-b-lg px-6 py-3 border-b-2 border-x-2 border-accent shadow-lg [border-top:2px_solid_var(--color-surface-base)]">
                        <h2
                          id={titleId}
                          className="text-lg md:text-xl font-semibold text-ink-primary text-center"
                        >
                          {currentTitle}
                        </h2>
                      </div>
                    </div>
                  }
                  extraControls={
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBackToDual();
                      }}
                      className="absolute top-4 left-4 flex items-center gap-2 bg-surface-1 rounded-full px-4 py-2 border border-border-default hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black pointer-events-auto"
                    >
                      <ChevronLeft
                        className="w-5 h-5 text-ink-primary"
                        strokeWidth={2}
                        nonScalingStroke
                        aria-hidden
                      />
                      <span className="text-sm text-ink-primary">
                        Ver ambos
                      </span>
                    </motion.button>
                  }
                >
                  <Image
                    src={currentImagePath}
                    alt={currentTitle}
                    fill
                    className="object-contain p-2"
                    // Sin optimizar: el zoom (hasta 3x) escala píxeles de la
                    // imagen cargada; servir el original evita pixelar
                    unoptimized
                    sizes="100vw"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM2QxZjVjIi8+PC9zdmc+"
                  />
                </ZoomableOverlay>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
