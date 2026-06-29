"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState, useEffect } from "react";
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

  useLockBodyScroll(isVisible);

  useEffect(() => {
    if (isVisible) {
      setViewMode("dual");
    }
  }, [isVisible]);

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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overscroll-contain touch-none"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          {/* Close Button - siempre visible */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
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

            {/* Instructions - solo en vista dual; en vista individual ZoomableOverlay las provee */}
            {viewMode === "dual" && (
              <div className="absolute bottom-4 left-4 bg-surface-1/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border-default pointer-events-auto">
                <p className="text-xs text-ink-secondary">
                  Toca una imagen para ampliar
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
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative w-full h-full max-w-7xl max-h-[85vh] grid grid-cols-1 md:grid-cols-2 gap-4 p-2"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left Image */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick("left");
                  }}
                  className="relative w-full h-full min-h-[200px] flex items-center justify-center overflow-hidden bg-surface-2 cursor-pointer transition-colors shadow-[0_0_0_2px_var(--color-surface-base),0_0_0_4px_var(--accent),0_8px_32px_rgba(61,31,92,0.4)]"
                >
                  <Image
                    src={leftImagePath}
                    alt={leftTitle}
                    fill
                    className="object-contain p-2"
                    sizes="50vw"
                  />
                  <div className="absolute top-4 left-4 bg-surface-1/95 backdrop-blur-sm rounded-lg px-3 py-2 border-2 border-accent z-10 shadow-lg">
                    <p className="text-sm font-medium text-ink-primary">
                      {leftTitle}
                    </p>
                    <p className="text-[10px] text-accent mt-0.5">
                      Toca para ampliar
                    </p>
                  </div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick("right");
                  }}
                  className="relative w-full h-full min-h-[200px] flex items-center justify-center overflow-hidden bg-surface-2 cursor-pointer transition-colors shadow-[0_0_0_2px_var(--color-surface-base),0_0_0_4px_var(--accent),0_8px_32px_rgba(61,31,92,0.4)]"
                >
                  <Image
                    src={rightImagePath}
                    alt={rightTitle}
                    fill
                    className="object-contain p-2"
                    sizes="50vw"
                  />
                  <div className="absolute bottom-4 right-4 bg-surface-1/95 backdrop-blur-sm rounded-lg px-3 py-2 border-2 border-accent z-10 shadow-lg">
                    <p className="text-sm font-medium text-ink-primary">
                      {rightTitle}
                    </p>
                    <p className="text-[10px] text-accent mt-0.5">
                      Toca para ampliar
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              /* Vista Individual delegada a ZoomableOverlay */
              <ZoomableOverlay
                key="single-view"
                isVisible={isVisible}
                onClose={onClose}
                title={currentTitle}
                className="max-w-5xl max-h-[85vh] overflow-hidden"
                enablePan
                renderInline
                header={
                  <div className="absolute top-0 left-36 right-16 md:left-40 md:right-20 z-30 pointer-events-none flex justify-center p-4">
                    <div
                      className="bg-surface-1/95 backdrop-blur-sm rounded-b-lg px-6 py-3 border-b-2 border-x-2 border-accent shadow-lg [border-top:2px_solid_var(--color-surface-base)]"
                    >
                      <h2 className="text-lg md:text-xl font-semibold text-ink-primary">
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
                    <svg
                      className="w-5 h-5 text-ink-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span className="text-sm text-ink-primary">Ver ambos</span>
                  </motion.button>
                }
              >
                <Image
                  src={currentImagePath}
                  alt={currentTitle}
                  fill
                  className="object-contain p-2"
                  sizes="100vw"
                />
              </ZoomableOverlay>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
