"use client";

import { m } from "motion/react";
import { Libro } from "@/data/libros";
import { useCompraDialog } from "@/components/CompraDialogProvider";
import { motionTokens, staggerContainer } from "@/config/motion-tokens";
import { useEnterVariants } from "@/hooks/useEnterVariants";

const cardBase =
  "aspect-[2/3] rounded-lg flex flex-col items-center justify-center p-3 text-center";

interface SagaSectionClientProps {
  libros: Libro[];
}

export default function SagaSectionClient({ libros }: SagaSectionClientProps) {
  const enter = useEnterVariants();
  const openCompra = useCompraDialog();

  return (
    <m.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4"
    >
      {libros.map((libro) =>
        libro.actual ? (
          <m.button
            key={libro.titulo}
            type="button"
            onClick={openCompra}
            aria-label={`Comprar ${libro.titulo}`}
            variants={enter}
            whileHover={{ y: motionTokens.translate.cardHover }}
            whileTap={{ scale: motionTokens.scale.tap }}
            className={`${cardBase} bg-accent-dim border border-accent hover:border-accent/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1 cursor-pointer`}
          >
            <span className="text-xs font-medium text-accent">
              {libro.titulo}
            </span>
            <span className="text-[10px] mt-1 text-ink-primary">
              {libro.estado}
            </span>
          </m.button>
        ) : (
          <m.div
            key={libro.titulo}
            variants={enter}
            className={`${cardBase} bg-surface-2 border border-border-subtle`}
          >
            <span className="text-xs font-medium text-ink-secondary">
              {libro.titulo}
            </span>
            <span className="text-[10px] mt-1 text-ink-secondary">
              {libro.estado}
            </span>
          </m.div>
        ),
      )}
    </m.div>
  );
}
