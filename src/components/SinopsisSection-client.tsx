'use client';

import { motion } from 'motion/react';
import CTAButton from '@/components/CTAButton';

export default function SinopsisSectionClient() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="flex flex-col gap-6"
    >
      <h2 className="text-4xl font-display font-black text-ink-primary">
        Los Dos Reinos
      </h2>
      
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
          Fantasía Oscura
        </span>
        <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
          Romance
        </span>
        <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
          Política
        </span>
      </div>
      
      <p className="text-ink-secondary leading-relaxed">
        [Sinopsis pendiente de Victoria — sin spoilers]
      </p>
      
      <p className="text-sm text-ink-tertiary">
        📅 Lanzamiento: Octubre 2026
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <CTAButton variant="whatsapp" />
        <CTAButton variant="primary" text="Comprar en Amazon" />
      </div>
    </motion.div>
  );
}
