"use client";

import { m } from "motion/react";
import { staggerContainer } from "@/config/motion-tokens";
import type { ReactNode } from "react";

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Viewport de whileInView; default igual al usado hoy en las secciones */
  viewport?: { once?: boolean; margin?: string };
}

export default function Stagger({
  children,
  className,
  viewport = { once: true },
}: StaggerProps) {
  return (
    <m.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className={className}
    >
      {children}
    </m.div>
  );
}
