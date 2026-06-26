'use client';

import { motion, type Transition } from 'motion/react';
import Image from 'next/image';
import CTAButton from '@/components/CTAButton';

const heroColumnVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.13, delayChildren: 0 },
  },
};

const heroBadgeTransition: Transition = { duration: 0.5, ease: 'easeOut' };
const heroTitleTransition: Transition = { duration: 0.75, ease: [0.16, 1, 0.3, 1] };
const heroSubtitleTransition: Transition = { duration: 0.65, ease: 'easeOut' };
const heroCTATransition: Transition = { duration: 0.6, ease: 'easeOut' };
const heroSocialProofTransition: Transition = { duration: 0.5 };

const heroBadgeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: heroBadgeTransition },
};

const heroTitleVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: heroTitleTransition },
};

const heroSubtitleVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: heroSubtitleTransition },
};

const heroCTAVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: heroCTATransition },
};

const heroSocialProofVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: heroSocialProofTransition },
};

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden px-5 pt-16 pb-28 md:pb-20 bg-surface-base"
    >
      {/* Glow de acento — único, fijo, sin blur-orbs aleatorios */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 60% 80%, var(--accent-glow) 0%, transparent 70%)',
        }}
      />

      {/* Línea de borde superior sutil — estilo Linear */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border-default" />

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* ——— Columna de texto ——— */}
          <motion.div
            className="lg:col-span-7 flex flex-col gap-7 text-center lg:text-left"
            variants={heroColumnVariants}
            initial="hidden"
            animate="visible"
          >

            {/* Badge de lanzamiento */}
            <motion.div
              variants={heroBadgeVariants}
              className="inline-flex items-center gap-2 justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase border border-border-emphasis bg-accent-dim text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Lanzamiento Octubre 2026
              </span>
            </motion.div>

            {/* Título principal — Syne ultra-heavy */}
            <motion.h1
              variants={heroTitleVariants}
              className="text-[clamp(2.6rem,8vw,5.5rem)] leading-[1.05] tracking-tight font-black font-display text-ink-primary"
            >
              Victoria{' '}
              <em className="not-italic font-serif text-accent">
                Querales
              </em>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              variants={heroSubtitleVariants}
              className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 text-ink-secondary"
            >
              Donde amar es un acto político capaz de cambiar por completo el universo.
            </motion.p>

            {/* CTAs — jerarquía clara: primario + secundario */}
            <motion.div
              data-cta-block
              variants={heroCTAVariants}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2"
            >
              <CTAButton variant="primary" text="Descubre el primer libro" />
            </motion.div>

            {/* Social proof eliminado — libro no lanzado aún */}
          </motion.div>

          {/* ——— Mockup del libro ——— */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 40, rotateY: -15 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative [perspective:800px]"
            >
              {/* Glow debajo del libro */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-10 rounded-full blur-2xl bg-accent-glow" />

              {/* Libro con perspectiva 3D CSS */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
                className="relative w-56 sm:w-64 md:w-72 aspect-[2/3]"
              >
                {/* Lomo del libro */}
                <div
                  className="absolute left-0 top-2 bottom-2 w-5 rounded-l-sm"
                  style={{
                    background: 'linear-gradient(to right, var(--color-purple-medium), var(--accent))',
                    transform: 'translateX(-14px) skewY(-0.5deg)',
                    transformOrigin: 'right',
                  }}
                />

                {/* Portada */}
                <div
                  className="relative w-full h-full rounded-r-lg rounded-l-sm overflow-hidden flex flex-col justify-between p-7"
                  style={{
                    background: 'linear-gradient(145deg, var(--surface-base) 0%, var(--surface-2) 40%, var(--surface-base) 100%)',
                    border: '1px solid var(--accent-glow)',
                    boxShadow: '4px 8px 40px rgba(0,0,0,0.8), inset 0 0 60px var(--accent-dim)',
                  }}
                >
                  {/* Ornamento superior */}
                  <div className="flex flex-col gap-1.5">
                    <div className="w-8 h-px bg-accent" />
                    <div className="w-4 h-px bg-accent opacity-50" />
                  </div>

                  {/* Portada oficial del libro */}
                  <div className="absolute inset-0">
                    <Image
                      src="/landing-book-victoria/portada-libro-1.png"
                      alt="Portada oficial de Los Dos Reinos"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Ornamento inferior */}
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="w-4 h-px bg-accent opacity-50" />
                    <div className="w-8 h-px bg-accent" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}
