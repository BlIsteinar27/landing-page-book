"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Info, X } from "lucide-react";
import Portal from "@/components/Portal";
import { motionTokens, exitTransition } from "@/config/motion-tokens";
import { useDialog } from "@/hooks/useDialog";
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

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleClose = () => setIsOpen(false);

  const dialogRef = useDialog<HTMLDivElement>(isOpen, handleClose, {
    capture: true,
  });

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
          bg-surface-base border-2 border-accent text-accent
          hover:bg-surface-1 hover:scale-105
          active:scale-[0.96]
          transition-[scale,background-color] duration-150 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black
          shadow-[0_0_12px_var(--accent-glow)]
          pointer-events-auto
          ${buttonClassName}
        `}
      >
        <Info
          className="w-5 h-5"
          strokeWidth={2.5}
          nonScalingStroke
          aria-hidden
        />
      </button>

      <Portal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overscroll-contain"
              onClick={(e) => {
                // El portal no corta el burbujeo de React: sin esto se cerraría también el overlay padre
                e.stopPropagation();
                handleClose();
              }}
              role="presentation"
            >
              <motion.div
                ref={dialogRef}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{
                  ...exitTransition.exit,
                  transition: exitTransition.transition,
                }}
                transition={motionTokens.spring}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="realm-info-title"
                className={`
                  relative w-full max-w-md max-h-[80dvh] flex flex-col
                  bg-[linear-gradient(135deg,var(--color-surface-base)_0%,var(--color-surface-deep)_100%)]
                  rounded-xl
                  border border-border-emphasis
                  shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6),0_0_24px_var(--color-accent-dim)]
                  p-6 md:p-8
                  ${panelClassName}
                `}
              >
                {/* Close button */}
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Cerrar información"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-ink-primary/70 hover:text-accent hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
                >
                  <X
                    className="w-5 h-5"
                    strokeWidth={2}
                    nonScalingStroke
                    aria-hidden
                  />
                </button>

                {/* Header */}
                <div className="mb-5 pr-8 shrink-0">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-accent/80 mb-2">
                    Lore del universo
                  </p>
                  <h2
                    id="realm-info-title"
                    className="text-2xl md:text-3xl font-display font-black text-accent leading-tight"
                  >
                    {lore.title}
                  </h2>
                  {lore.subtitle && (
                    <p className="mt-1 text-sm md:text-base text-ink-primary/80 italic">
                      {lore.subtitle}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px w-full shrink-0 bg-gradient-to-r from-transparent via-accent/50 to-transparent mb-5" />

                {/* Points list */}
                <ul className="space-y-3 min-h-0 overflow-y-auto overscroll-contain touch-pan-y pb-6 -mb-6 [scrollbar-width:thin] [scrollbar-color:var(--color-border-emphasis)_transparent] [mask-image:linear-gradient(to_bottom,black_calc(100%-1.5rem),transparent)]">
                  {lore.points.map((point, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                        delay: 0.1 + Math.min(index, 5) * 0.05,
                      }}
                      className="flex items-start gap-3"
                    >
                      <span
                        className="mt-0.5 text-accent text-sm md:text-base shrink-0"
                        aria-hidden="true"
                      >
                        {point.icon ? bulletIcon[point.icon] : "◆"}
                      </span>
                      <span className="text-sm md:text-base text-ink-primary leading-relaxed">
                        {point.text}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
