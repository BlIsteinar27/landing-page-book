'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

const personajes = [
  {
    id: 1,
    src: '/landing-book-victoria/prota-libro-1-con-fondo.PNG',
    alt: 'Primera pareja de protagonistas de Los Dos Reinos',
  },
  {
    id: 2,
    src: '/landing-book-victoria/prota-2-libro-1-con-fondo.jpg',
    alt: 'Segunda pareja de protagonistas de Los Dos Reinos',
  },
];

export default function PersonajesSectionClient() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % personajes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
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
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-2xl"
      >
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
          {/* Glow pulsante de fondo */}
          <motion.div
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-gradient-radial from-accent/20 via-transparent to-transparent blur-3xl"
          />

          {/* Carrusel con crossfade suave */}
          <AnimatePresence initial={false}>
            <motion.div
              key={personajes[currentIndex].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="absolute inset-0"
            >
              <div className="relative w-full h-full">
                <Image
                  src={personajes[currentIndex].src}
                  alt={personajes[currentIndex].alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                  style={{
                    filter: 'brightness(1.05) contrast(1.02)',
                  }}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Glow inferior */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-accent-glow blur-2xl" />
        </div>

        {/* Indicadores de navegación */}
        <div className="flex justify-center gap-2 mt-6">
          {personajes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ver personajes ${index + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base ${
                index === currentIndex
                  ? 'bg-accent w-6'
                  : 'bg-ink-muted hover:bg-ink-tertiary'
              }`}
            />
          ))}
        </div>
      </motion.div>
      
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
    </>
  );
}
