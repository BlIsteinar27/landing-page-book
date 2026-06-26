'use client';

import { motion, type Transition } from 'motion/react';
import Image from 'next/image';

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
  { valor: '11+', label: 'Años escribiendo' },
  { valor: '7', label: 'Libros en la saga' },
  { valor: '2026', label: 'Lanzamiento oficial' },
];

export default function SobreAutoraSectionClient() {
  return (
    <>
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
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-4 flex justify-center"
        >
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(var(--accent) 0%, transparent 60%, var(--accent) 100%)`,
                padding: '2px',
                borderRadius: '50%',
              }}
            />
            <div
              className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full overflow-hidden border-2 border-border-emphasis"
              style={{
                boxShadow: '0 0 40px var(--accent-glow)',
              }}
            >
              <Image
                src="/landing-book-victoria/foto-escritora.jpg"
                alt="Victoria Querales - Autora de la saga Dioses Universales"
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, 240px"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="md:col-span-8 flex flex-col gap-6 text-center md:text-left"
        >
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight tracking-tight font-display text-ink-primary">
            Victoria Querales
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
            Soy Licenciada en Comunicación Social con mención en Periodismo Audiovisual, 
            y llevo más de una década construyendo universos desde la palabra. Mi relación 
            con la escritura creativa comenzó en 2015, impulsada por una pregunta que 
            siempre me acompañó: ¿qué hay más allá de la comprensión humana?
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
            En 2019 compartí los primeros borradores de mi saga Dioses Universales — 
            publicando el primer libro, Los Dos Reinos en Wattpad — donde una comunidad 
            de lectores acompañó el nacimiento de este universo. Tras años de trabajo y 
            dedicación, cerré la saga en 2024 con siete libros que conforman una historia 
            épica sobre poder, familia y destino.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
            Actualmente, la saga se encuentra en proceso de edición profesional, y su 
            primer volumen llegará a manos de los lectores en octubre de 2026. Los 
            borradores originales de Wattpad ya no están disponibles, pues esta nueva 
            etapa trae consigo una versión pulida y definitiva de mi universo.
          </p>
          
          <blockquote className="border-l-2 border-accent pl-4 italic text-ink-secondary">
            "Desde niña, me inventaba historias para tranquilizar la soledad de mi mente 
            inquieta. Siempre estaba en las nubes, imaginando cómo se creó el universo y 
            si de verdad existen seres poderosos capaces de mantener el orden más allá de 
            la comprensión humana. Por ese motivo, hace 11 años comencé los primeros 
            borradores de lo que hoy es mi saga Dioses Universales — porque algunas 
            preguntas solo encuentran respuesta cuando las conviertes en un mundo propio."
          </blockquote>

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
    </>
  );
}
