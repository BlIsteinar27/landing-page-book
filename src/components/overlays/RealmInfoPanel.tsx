"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { RealmLore, LoreBulletIcon } from "@/config/realms-data";

interface RealmInfoPanelProps {
  lore: RealmLore;
  buttonClassName?: string;
  panelClassName?: string;
}

const bulletIcon: Record<LoreBulletIcon, string> = {
  diamond: "◆",
  plus: "+",
  asterisk: "*",
};

export default function RealmInfoPanel({
  lore,
  buttonClassName = "",
  panelClassName = "",
}: RealmInfoPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        aria-label={`Información sobre ${lore.title}`}
        aria-expanded={isOpen}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          bg-[#3d1f5c] border-2 border-[#ffc667] text-[#ffc667]
          hover:bg-[#4a2570] hover:scale-105
          active:scale-95
          transition-all duration-200 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc667] focus-visible:ring-offset-2 focus-visible:ring-offset-black
          shadow-[0_0_12px_rgba(255,198,103,0.25)]
          pointer-events-auto
          ${buttonClassName}
        `}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overscroll-contain touch-none"
            onClick={handleClose}
            role="presentation"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="realm-info-title"
              className={`
                relative w-full max-w-md max-h-[80vh] overflow-y-auto
                bg-[linear-gradient(135deg,#3d1f5c_0%,#241038_100%)]
                rounded-xl
                shadow-[0_0_0_2px_#3d1f5c,0_0_0_4px_#ffc667,0_16px_48px_rgba(0,0,0,0.6)]
                p-6 md:p-8
                ${panelClassName}
              `}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Cerrar información"
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-[#fef4e6]/70 hover:text-[#ffc667] hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc667] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3d1f5c]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Header */}
              <div className="mb-5 pr-8">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#ffc667]/80 mb-2">
                  Lore del universo
                </p>
                <h2
                  id="realm-info-title"
                  className="text-2xl md:text-3xl font-display font-black text-[#ffc667] leading-tight"
                >
                  {lore.title}
                </h2>
                {lore.subtitle && (
                  <p className="mt-1 text-sm md:text-base text-[#fef4e6]/80 italic">
                    {lore.subtitle}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ffc667]/50 to-transparent mb-5" />

              {/* Points list */}
              <ul className="space-y-3">
                {lore.points.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span
                      className="mt-0.5 text-[#ffc667] text-sm md:text-base shrink-0"
                      aria-hidden="true"
                    >
                      {point.icon ? bulletIcon[point.icon] : "◆"}
                    </span>
                    <span className="text-sm md:text-base text-[#fef4e6] leading-relaxed">
                      {point.text}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
