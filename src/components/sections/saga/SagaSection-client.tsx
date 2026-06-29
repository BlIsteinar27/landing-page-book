'use client';

import { motion } from 'motion/react';
import { Libro } from '@/data/libros';
import CTAButton from '@/components/ui/CTAButton';
import { LINKS } from '@/config/links';

interface SagaSectionClientProps {
  libros: Libro[];
}

export default function SagaSectionClient({ libros }: SagaSectionClientProps) {
  return (
    <>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center"
      >
        La Saga Completa
      </motion.p>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-5xl font-display font-black text-center mb-6 text-ink-primary"
      >
        Dioses Universales
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-ink-secondary max-w-2xl mx-auto mb-16"
      >
        Una saga que cuenta el ascenso, la conquista y los vínculos familiares 
        de los dioses regentes del universo. Siete libros que conforman una 
        historia épica sobre poder, familia y destino.
      </motion.p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {libros.map((libro, i) => (
          <motion.div
            key={libro.titulo}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`
              aspect-[2/3] rounded-lg flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors
              ${libro.actual
                ? 'bg-accent/20 border border-accent hover:bg-accent/30'
                : 'bg-surface-2 border border-border-subtle hover:bg-surface-3'}
            `}
          >
            {libro.actual && i === 0 ? (
              <a
                href={LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="contents"
              >
                <span className={`text-xs font-medium ${libro.actual ? 'text-accent' : 'text-ink-tertiary'}`}>
                  {libro.titulo}
                </span>
                <span className="text-[10px] mt-1 text-ink-muted">
                  {libro.estado}
                </span>
              </a>
            ) : (
              <>
                <span className={`text-xs font-medium ${libro.actual ? 'text-accent' : 'text-ink-tertiary'}`}>
                  {libro.titulo}
                </span>
                <span className="text-[10px] mt-1 text-ink-muted">
                  {libro.estado}
                </span>
              </>
            )}
          </motion.div>
        ))}
      </div>
      
    </>
  );
}
