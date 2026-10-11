"use client";

import { motion } from "motion/react";
import { useEnterVariants } from "@/hooks/useEnterVariants";

export default function HeroTitle() {
  const enter = useEnterVariants();

  return (
    <>
      <motion.div
        variants={enter}
        className="inline-flex items-center gap-2 justify-center lg:justify-start"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase border border-border-emphasis bg-accent-dim text-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          Ya disponible
        </span>
      </motion.div>

      <motion.h1
        variants={enter}
        className="text-[clamp(3rem,10vw,6.5rem)] leading-[0.95] tracking-tighter font-black font-display text-ink-primary"
      >
        Victoria <span className="block text-accent mt-1">Querales</span>
      </motion.h1>

      <motion.h2
        variants={enter}
        className="text-2xl sm:text-3xl leading-tight font-bold max-w-xl mx-auto lg:mx-0 text-ink-primary"
      >
        Autora de fantasía oscura, política y romántica
      </motion.h2>

      <motion.div
        variants={enter}
        className="flex flex-wrap gap-4 justify-center lg:justify-start"
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-sm font-medium text-ink-secondary">
          <span className="text-accent font-bold">11+</span> años escribiendo
        </span>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-sm font-medium text-ink-secondary">
          <span className="text-accent font-bold">7</span> libros en la saga
        </span>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-sm font-medium text-ink-secondary">
          Miles de lecturas en{" "}
          <span className="font-semibold text-ink-primary">Wattpad</span>
        </span>
      </motion.div>

      <motion.div
        variants={enter}
        className="flex flex-col gap-3 p-6 rounded-2xl bg-gradient-to-br from-surface-2 to-surface-1 border border-accent/20 max-w-xl mx-auto lg:mx-0 shadow-lg shadow-accent/5"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-xs tracking-widest uppercase text-accent mb-2 font-semibold">
              Primer libro
            </p>
            <h3 className="text-2xl font-black text-ink-primary mb-2 font-display">
              Los Dos Reinos
            </h3>
            <p className="text-sm italic text-ink-secondary leading-relaxed">
              "Donde amar es un acto político capaz de cambiar por completo el
              universo"
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
