'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

interface Libro {
  titulo: string;
  estado: string;
  actual: boolean;
}

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
            className={`
              aspect-[2/3] rounded-lg flex flex-col items-center justify-center p-3 text-center
              ${libro.actual 
                ? 'bg-accent/20 border border-accent' 
                : 'bg-surface-2 border border-border-subtle'}
            `}
          >
            <span className={`text-xs font-medium ${libro.actual ? 'text-accent' : 'text-ink-tertiary'}`}>
              {libro.titulo}
            </span>
            <span className="text-[10px] mt-1 text-ink-muted">
              {libro.estado}
            </span>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-6 text-center">
          El Universo
        </p>
        <div className="relative aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden border border-border-default">
          <Image
            src="/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg"
            alt="Mapa del universo de Dioses Universales"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 90vw"
            className="object-contain bg-surface-base"
          />
        </div>
      </motion.div>
    </>
  );
}
