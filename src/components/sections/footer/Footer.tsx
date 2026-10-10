"use client";

import { motion } from "motion/react";
import { staggerContainer } from "@/config/motion-tokens";
import { useEnterVariants } from "@/hooks/useEnterVariants";

export default function Footer() {
  const enter = useEnterVariants();

  return (
    <footer className="relative px-6 md:px-8 py-12 pb-32 md:pb-28 lg:pb-16 bg-surface-2 border-t border-border-subtle">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-3xl mx-auto flex flex-col items-center gap-2 text-center"
      >
        <motion.p
          variants={enter}
          className="font-display text-lg font-bold text-accent"
        >
          Victoria Querales
        </motion.p>
        <motion.p variants={enter} className="text-sm text-ink-secondary">
          Autora de Dioses Universales
        </motion.p>
        <motion.p variants={enter} className="text-xs text-ink-secondary mt-4">
          © 2026 Victoria Querales. Todos los derechos reservados.
        </motion.p>
      </motion.div>
    </footer>
  );
}
