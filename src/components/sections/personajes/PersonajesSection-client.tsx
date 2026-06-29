'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import NavigationDots from '@/components/ui/NavigationDots';

const personajes = [
  {
    id: 1,
    src: '/landing-book-victoria/prota-2-libro-1-sin-fondo.PNG',
    alt: 'Primera pareja de protagonistas de Los Dos Reinos',
  },
  {
    id: 2,
    src: '/landing-book-victoria/prota-libro-1-sin-fondo.png',
    alt: 'Segunda pareja de protagonistas de Los Dos Reinos',
  },
];

// Componente de partículas doradas flotantes
function DivineParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-accent/30 blur-[1px]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -30, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function PersonajesSectionClient() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % personajes.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused]);

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
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-2xl"
        onMouseEnter={() => {
          setIsPaused(true);
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsPaused(false);
          setIsHovering(false);
        }}
      >
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
          {/* Partículas doradas flotantes */}
          <DivineParticles />

          {/* Fondo con gradiente cósmico */}
          <div className="absolute inset-0 bg-gradient-to-br from-surface-base via-[#3d1f5c]/40 to-[#724aa5]/20" />

          {/* Marco divino con bordes sutiles */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(255,198,103,0.1) 0%, transparent 50%, rgba(255,198,103,0.05) 100%)',
            }}
            animate={isHovering ? {
              borderColor: ['rgba(255,198,103,0.2)', 'rgba(255,198,103,0.4)', 'rgba(255,198,103,0.2)'],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-0 rounded-lg border border-accent/20" />
            {/* Esquinas decorativas */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/40 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent/40 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent/40 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/40 rounded-br-lg" />
          </motion.div>

          {/* Carrusel con transición de luz divina */}
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={personajes[currentIndex].id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="absolute inset-0 flex items-center justify-center p-8"
            >
              <motion.div
                initial={{ filter: 'brightness(0.8) blur(4px)' }}
                animate={{ filter: 'brightness(1) blur(0px)' }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative w-full h-full"
              >
                <Image
                  src={personajes[currentIndex].src}
                  alt={personajes[currentIndex].alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Efecto de luz divina en transición */}
          <AnimatePresence>
            {isHovering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent blur-xl"
              />
            )}
          </AnimatePresence>

          {/* Glow inferior divino */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-accent/20 blur-3xl"
          />
        </div>

        {/* Indicadores de navegación con efecto divino */}
        <motion.div
          className="mt-8 flex justify-center items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {personajes.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="relative group focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-surface-base rounded-full"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Ver personaje ${index + 1}`}
            >
              <motion.div
                animate={index === currentIndex ? {
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.8, 1],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex
                    ? 'bg-accent shadow-[0_0_12px_rgba(255,198,103,0.6)]'
                    : 'bg-accent/30 group-hover:bg-accent/50'
                }`}
              />
              {index === currentIndex && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-accent/30 blur-sm"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
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
