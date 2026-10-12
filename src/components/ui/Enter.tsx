"use client";

import { m, type Variants } from "motion/react";
import { useEnterVariants } from "@/hooks/useEnterVariants";
import type { ReactNode } from "react";

interface EnterProps {
  children: ReactNode;
  className?: string;
}

// Hijo de Stagger: hereda "visible" del padre por contexto de Motion.
// Equivale al motion.* con variants={enter} que usaban las secciones.
export default function Enter({ children, className }: EnterProps) {
  const enter = useEnterVariants();
  return (
    <m.div variants={enter as Variants} className={className}>
      {children}
    </m.div>
  );
}
