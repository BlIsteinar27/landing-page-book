import { useReducedMotion, type Variants } from "motion/react";
import { enterVariants } from "@/config/motion-tokens";

/**
 * Variante de entrada sin movimiento para reduced motion.
 */
const reducedEnterVariants: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export function useEnterVariants() {
  return useReducedMotion() ? reducedEnterVariants : enterVariants;
}
