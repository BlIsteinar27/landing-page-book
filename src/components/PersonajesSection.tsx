'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function PersonajesSection() {
  return (
    <section className="relative py-24 md:py-32 px-5 overflow-hidden bg-surface-base">
      {/* Glow de fondo */}
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(114, 74, 165, 0.15) 0%, transparent 70%)',
        }}
      />
      
      <div className="relative max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center"
        >
          Los Protagonistas
        </motion.p>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-black text-center mb-16 text-ink-primary"
        >
          Conoce a los Personajes Principales
        </motion.h2>
        
        {/* Ilustración de personajes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-2xl"
        >
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src="/landing-book-victoria/prota-libro-1-sin-fondo.PNG"
              alt="Personajes principales de Los Dos Reinos"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="object-contain"
            />
            {/* Glow bajo la imagen */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-accent-glow blur-2xl" />
          </div>
        </motion.div>
        
        {/* Descripción de protagonistas */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center max-w-2xl mx-auto flex flex-col gap-3"
        >
          <p className="text-base text-ink-secondary leading-relaxed">
            Dioses con poder de doblar el destino del universo. Decisiones que no solo 
            mueven reinos, sino que reescriben las leyes de lo divino.
          </p>
          <p className="text-sm text-ink-tertiary italic font-serif">
            Dioses Universales — Los Dos Reinos
          </p>
        </motion.div>
      </div>
    </section>
  );
}
