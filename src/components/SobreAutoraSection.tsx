'use client';

import { motion, type Transition } from 'motion/react';

const credencialesContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const credencialItemTransition: Transition = { duration: 0.45 };

const credencialVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: credencialItemTransition },
};

const credenciales = [
  { valor: '10+', label: 'Años guiando personas' },
  { valor: '500+', label: 'Lectores transformados' },
  { valor: '1er', label: 'Libro publicado' },
];

export default function SobreAutoraSection() {

  return (
    <section className="relative py-24 md:py-32 px-5 overflow-hidden bg-surface-base">
      {/* Glow de fondo posicionado detrás de la foto */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl bg-accent-dim" />

      <div className="relative max-w-5xl mx-auto">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.25em] uppercase font-medium mb-14 text-center text-accent"
        >
          La autora
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">

          {/* Foto — columna izquierda, primero en móvil */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 flex justify-center"
          >
            <div className="relative">
              {/* Anillo de acento externo */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(var(--accent) 0%, transparent 60%, var(--accent) 100%)`,
                  padding: '2px',
                  borderRadius: '50%',
                }}
              />
              {/* Foto / placeholder */}
              <div
                className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full overflow-hidden flex items-center justify-center border-2 border-border-emphasis"
                style={{
                  background: 'linear-gradient(145deg, var(--surface-3), var(--surface-4))',
                  boxShadow: '0 0 40px var(--accent-glow)',
                }}
              >
                <span className="text-sm italic font-serif text-ink-tertiary">
                  Foto de Victoria
                </span>
              </div>
            </div>
          </motion.div>

          {/* Texto — columna derecha */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="md:col-span-8 flex flex-col gap-6 text-center md:text-left"
          >
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight tracking-tight font-display text-ink-primary">
              Victoria
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
              Escritora y mentora apasionada por el desarrollo personal. Con más de una década de experiencia guiando a personas hacia su máximo potencial, ha dedicado su vida a compartir herramientas prácticas para el crecimiento emocional y espiritual.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
              Su estilo único combina la calidez humana con conocimientos basados en evidencia, haciendo que conceptos complejos sean accesibles para todos.
            </p>

            {/* Credenciales numéricas */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-2 pt-6 border-t border-border-subtle"
              variants={credencialesContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {credenciales.map((c) => (
                <motion.div
                  key={c.label}
                  variants={credencialVariants}
                  className="flex flex-col gap-1"
                >
                  <span className="text-2xl sm:text-3xl font-black tracking-tight font-display text-accent">
                    {c.valor}
                  </span>
                  <span className="text-xs leading-tight text-ink-tertiary">
                    {c.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
