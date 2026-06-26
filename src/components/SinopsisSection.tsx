'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import CTAButton from '@/components/CTAButton';

export default function SobreLibroSection() {
  return (
    <section className="relative py-24 md:py-32 px-5 bg-surface-1">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center"
        >
          El Primer Libro
        </motion.p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Portada del libro */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            {/* Mockup de libro con portada oficial */}
            <div className="relative w-48 sm:w-56 md:w-64 aspect-[2/3] rounded-lg overflow-hidden"
              style={{
                border: '1px solid var(--accent-glow)',
                boxShadow: '4px 8px 40px rgba(0,0,0,0.8)',
              }}
            >
              <Image
                src="/landing-book-victoria/portada-libro-1.png"
                alt="Portada oficial de Los Dos Reinos"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 200px, (max-width: 1024px) 224px, 256px"
              />
            </div>
          </motion.div>
          
          {/* Información */}
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
            
            {/* Género tags */}
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
            
            {/* Sinopsis - placeholder hasta que Victoria envíe */}
            <p className="text-ink-secondary leading-relaxed">
              [Sinopsis pendiente de Victoria — sin spoilers]
            </p>
            
            {/* Fecha */}
            <p className="text-sm text-ink-tertiary">
              📅 Lanzamiento: Octubre 2026
            </p>
            
            {/* Botones de compra */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <CTAButton variant="whatsapp" />
              <CTAButton variant="amazon" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
