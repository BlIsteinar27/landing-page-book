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
      className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6 md:px-8 pt-16 pb-28 md:pb-20 bg-surface-base"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* ——— Columna de texto (AUTORA PRIMERO) ——— */}
          <motion.div
            className="lg:col-span-8 flex flex-col gap-6 text-center lg:text-left"
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

            {/* Título principal — Nombre de la autora MAS PROMINENTE */}
            <motion.h1
              variants={heroTitleVariants}
              className="text-[clamp(3rem,10vw,6.5rem)] leading-[0.95] tracking-tighter font-black font-display text-ink-primary"
            >
              Victoria{' '}
              <span className="block text-accent mt-1">
                Querales
              </span>
            </motion.h1>

            {/* Subtítulo — Quién es la autora */}
            <motion.h2
              variants={heroSubtitleVariants}
              className="text-2xl sm:text-3xl leading-tight font-bold max-w-xl mx-auto lg:mx-0 text-ink-primary"
            >
              Autora de fantasía oscura, política y romántica
            </motion.h2>

            {/* Credenciales visuales */}
            <motion.div
              variants={heroSubtitleVariants}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-sm font-medium text-ink-secondary">
                <span className="text-accent font-bold">11+</span> años escribiendo
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-sm font-medium text-ink-secondary">
                <span className="text-accent font-bold">7</span> libros en la saga
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-sm font-medium text-ink-secondary">
                Miles de lecturas en <span className="font-semibold text-ink-primary">Wattpad</span>
              </span>
            </motion.div>

            {/* Destacado del libro - SECUNDARIO */}
            <motion.div
              variants={heroSubtitleVariants}
              className="flex flex-col gap-3 p-6 rounded-2xl bg-gradient-to-br from-surface-2 to-surface-1 border border-accent/20 max-w-xl mx-auto lg:mx-0 shadow-lg shadow-accent/5"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-xs tracking-widest uppercase text-accent mb-2 font-semibold">Primer libro</p>
                  <h3 className="text-2xl font-black text-ink-primary mb-2 font-display">Los Dos Reinos</h3>
                  <p className="text-sm italic text-ink-secondary leading-relaxed">
                    "Donde amar es un acto político capaz de cambiar por completo el universo"
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTAs — jerarquía clara: primario + secundario */}
            <motion.div
              data-cta-block
              variants={heroCTAVariants}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2"
            >
              {/* Botón Amazon comentado temporalmente hasta tener el link real */}
              {/* <CTAButton variant="primary" text="Pre-ordena Los Dos Reinos" /> */}
              <CTAButton variant="whatsapp" text="Reserva tu copia" />
            </motion.div>

            {/* Social proof eliminado — libro no lanzado aún */}

            {/* Botón para explorar el mapa */}
            <motion.button
              variants={heroSocialProofVariants}
              onClick={() => {
                const mapaSection = document.getElementById('mapa-interactivo');
                if (mapaSection) {
                  mapaSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group flex flex-col items-center gap-2 mx-auto lg:mx-0 mt-4 cursor-pointer"
            >
              <span className="text-sm text-ink-secondary group-hover:text-accent transition-colors">
                Explora el universo
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-accent"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </motion.button>
          </motion.div>

          {/* ——— Mockup del libro (SECUNDARIO) ——— */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 40, rotateY: -15 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="relative [perspective:800px]"
            >
              {/* Glow debajo del libro */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-10 rounded-full blur-2xl bg-accent-glow opacity-60" />

              {/* Libro con perspectiva 3D CSS - más pequeño */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
                className="relative w-48 sm:w-52 md:w-56 aspect-[2/3]"
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
