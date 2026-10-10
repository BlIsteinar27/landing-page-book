import { useReducedMotion, type Variants } from "motion/react";
import { enterVariants } from "@/config/motion-tokens";

/**
 * Variante de entrada sin movimiento ni blur para reduced motion.
 * Declara y/filter en reposo para limpiar el estilo inicial que llega del SSR
 * (MotionConfig no cubre `filter`).
 */
const reducedEnterVariants: Variants = {
  hidden: { opacity: 0, y: 0, filter: "blur(0px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.3 },
  },
};

export function useEnterVariants() {
  return useReducedMotion() ? reducedEnterVariants : enterVariants;
}
