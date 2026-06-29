"use client";

import { motion } from "motion/react";

export default function Footer() {
  return (
    <footer className="relative px-6 md:px-8 py-12 pb-32 md:pb-28 lg:pb-16 bg-surface-2 border-t border-border-subtle">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-2 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-lg font-bold text-accent"
        >
          Victoria Querales
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm text-ink-tertiary"
        >
          Autora de Dioses Universales
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xs text-ink-muted mt-4"
        >
          © 2026 Victoria Querales. Todos los derechos reservados.
        </motion.p>
      </div>
    </footer>
  );
}
