"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { motionTokens, staggerContainer } from "@/config/motion-tokens";
import { useEnterVariants } from "@/hooks/useEnterVariants";

const DivineParticles = dynamic(() => import("./DivineParticles"), {
  ssr: false,
});

const personajes = [
  {
    id: 1,
    src: "/landing-book-victoria/prota-2-libro-1-sin-fondo.png",
    alt: "Primera pareja de protagonistas de Los Dos Reinos",
  },
  {
    id: 2,
    src: "/landing-book-victoria/prota-libro-1-sin-fondo.PNG",
    alt: "Segunda pareja de protagonistas de Los Dos Reinos",
  },
];

export default function PersonajesSectionClient() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Pausa manual (botón); hover y foco pausan aparte
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const reduce = useReducedMotion();
  const enter = useEnterVariants();
  const autoplay = !(isPaused || isHovering || hasFocus || reduce);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % personajes.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [autoplay]);

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.p
          variants={enter}
          className="text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center"
        >
          Los Protagonistas
        </motion.p>

        <motion.h2
          variants={enter}
          className="text-3xl md:text-4xl font-display font-black text-center mb-16 text-ink-primary"
        >
          Conoce a los Personajes Principales
        </motion.h2>
      </motion.div>

      <motion.div
        variants={enter}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="group/carrusel relative mx-auto max-w-2xl"
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        onFocus={(e) => {
          // Solo foco de teclado: un clic con ratón no debe dejarlo pausado
          if (e.target.matches(":focus-visible")) setHasFocus(true);
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setHasFocus(false);
        }}
      >
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
          {/* Partículas doradas flotantes */}
          <DivineParticles />

          {/* Fondo con gradiente cósmico */}
          <div className="absolute inset-0 bg-gradient-to-br from-surface-base via-surface-base/40 to-purple-medium/20" />

          {/* Marco divino con bordes sutiles */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,198,103,0.1) 0%, transparent 50%, rgba(255,198,103,0.05) 100%)",
            }}
          >
            <div className="absolute inset-0 rounded-lg border border-accent/20 group-hover/carrusel:border-accent/40 transition-colors" />
            {/* Esquinas decorativas */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/40 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent/40 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent/40 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/40 rounded-br-lg" />
          </div>

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
              className="absolute inset-0 flex items-center justify-center p-5 md:p-8"
            >
              <motion.div
                initial={{ filter: "brightness(0.8) blur(4px)" }}
                animate={{ filter: "brightness(1) blur(0px)" }}
                transition={
                  reduce ? { duration: 0 } : { duration: 1, delay: 0.2 }
                }
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
              ease: "easeInOut",
            }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-accent/20 blur-3xl"
          />
        </div>

        {/* Indicadores de navegación con efecto divino */}
        <motion.div
          className="mt-8 flex justify-center items-center gap-3"
          variants={enter}
        >
          {personajes.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base rounded-full"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: motionTokens.scale.tap }}
              aria-current={index === currentIndex ? "true" : undefined}
              aria-label={`Ver ${personajes[index].alt.charAt(0).toLowerCase() + personajes[index].alt.slice(1)}`}
            >
              <motion.div
                animate={
                  index === currentIndex
                    ? {
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.8, 1],
                      }
                    : { scale: 1, opacity: 1 }
                }
                transition={
                  index === currentIndex
                    ? {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : { duration: 0.15 }
                }
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex
                    ? "bg-accent shadow-[0_0_12px_rgba(255,198,103,0.6)]"
                    : "bg-accent/30 group-hover:bg-accent/50"
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
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.button>
          ))}
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? "Reanudar carrusel" : "Pausar carrusel"}
            className="ml-2 w-8 h-8 rounded-full flex items-center justify-center text-ink-secondary hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
          >
            {isPaused ? (
              <Play
                className="w-4 h-4"
                strokeWidth={2}
                nonScalingStroke
                aria-hidden
              />
            ) : (
              <Pause
                className="w-4 h-4"
                strokeWidth={2}
                nonScalingStroke
                aria-hidden
              />
            )}
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-12 text-center max-w-2xl mx-auto flex flex-col gap-3"
      >
        <motion.p
          variants={enter}
          className="text-base text-ink-secondary leading-relaxed"
        >
          Dioses con el poder de doblar el destino del universo. Decisiones que
          no solo mueven reinos, sino que reescriben las leyes de lo divino.
        </motion.p>
        <motion.p
          variants={enter}
          className="text-sm text-ink-secondary italic font-serif"
        >
          Dioses Universales — Los Dos Reinos
        </motion.p>
      </motion.div>
    </>
  );
}
