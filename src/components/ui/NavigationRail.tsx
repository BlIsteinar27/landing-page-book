"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { motionTokens, exitTransition } from "@/config/motion-tokens";

interface NavigationRailProps {
  count: number;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  tooltips?: string[];
}

const tickTop = (index: number, count: number) => ((index + 0.5) / count) * 100;

export default function NavigationRail({
  count,
  activeIndex,
  onIndexChange,
  tooltips = [],
}: NavigationRailProps) {
  // Chip transitorio con el nombre del reino: el rail comunica la posición
  // pero no el «qué»; al cambiar de capítulo la etiqueta aparece ~2.5s
  const [chipVisible, setChipVisible] = useState(true);

  useEffect(() => {
    const show = setTimeout(() => setChipVisible(true), 0);
    const hide = setTimeout(() => setChipVisible(false), 2600);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [activeIndex]);

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{
        opacity: 0,
        filter: "blur(4px)",
        transition: exitTransition.transition,
      }}
      aria-label="Navegación entre reinos"
      className="fixed right-3 top-1/2 -translate-y-1/2 z-40 lg:hidden"
    >
      {/* «Respiración» dorada al aparecer: enseña que el riel es interactivo.
          Solo existe cuando la sección está pineada, y con reduced-motion el
          rail ni siquiera se monta (los reinos se apilan) */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 0 1px rgba(254, 244, 230, 0.2)",
            "0 0 0 3px rgba(255, 198, 103, 0.5), 0 0 14px rgba(255, 198, 103, 0.35)",
            "0 0 0 1px rgba(254, 244, 230, 0.2)",
            "0 0 0 3px rgba(255, 198, 103, 0.5), 0 0 14px rgba(255, 198, 103, 0.35)",
            "0 0 0 1px rgba(254, 244, 230, 0.2)",
          ],
        }}
        transition={{ duration: 3.2, ease: "easeInOut" }}
        className="relative h-[min(50vh,20rem)] w-1 rounded-full bg-surface-deep/70"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 rounded-full bg-accent transition-[height] duration-300"
          style={{ height: `${tickTop(activeIndex, count)}%` }}
        />
        {Array.from({ length: count }).map((_, index) => (
          <motion.button
            key={index}
            type="button"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: motionTokens.scale.tap }}
            onClick={() => onIndexChange(index)}
            aria-label={`Navegar a ${tooltips[index] || `elemento ${index + 1}`}`}
            aria-current={index === activeIndex ? "true" : undefined}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full"
            style={{ top: `${tickTop(index, count)}%` }}
          >
            <span
              aria-hidden="true"
              className={`block rounded-full bg-accent transition-all duration-300 ${
                index === activeIndex
                  ? "size-3.5 border-2 border-surface-base shadow-[0_0_0_2px_rgba(255,198,103,0.5),0_0_10px_rgba(255,198,103,0.5)]"
                  : "size-2.5 shadow-[0_0_6px_rgba(255,198,103,0.45)]"
              }`}
            />
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {chipVisible && tooltips[activeIndex] && (
          <motion.span
            key={activeIndex}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={motionTokens.spring}
            className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-border-subtle bg-surface-1/90 px-3 py-1.5 text-xs text-ink-primary backdrop-blur-sm"
          >
            {tooltips[activeIndex]}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
