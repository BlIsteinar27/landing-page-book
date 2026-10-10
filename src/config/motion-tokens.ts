import type { Transition, Variants } from "motion/react";

export const motionTokens = {
  // Scale interactions
  scale: {
    hover: 1.02,
    tap: 0.96,
  },
  // Translate interactions
  translate: {
    cardHover: -4,
    arrowHover: 4,
  },
  // Press feedback: corto y sin rebote
  press: { duration: 0.15, ease: "easeOut" } satisfies Transition,
  // Spring sin rebote para entradas de overlays y paneles
  spring: { type: "spring", duration: 0.3, bounce: 0 } satisfies Transition,
  // Duration
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
  },
};

// Entrada estándar de bloques de sección
export const enterVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Contenedor que escalona sus hijos cada 100ms
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// Salida estándar: más corta y más pequeña que la entrada
export const exitTransition = {
  exit: { opacity: 0, y: -12, filter: "blur(4px)" },
  transition: { duration: 0.15, ease: "easeOut" },
} as const;
