'use client';

import { motion, type Transition } from 'motion/react';
import { Star } from 'lucide-react';
import { testimonios, palabrasClave } from '@/data/testimonios';

const cardsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardItemTransition: Transition = { duration: 0.55, ease: 'easeOut' };

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: cardItemTransition },
};


export default function TestimoniosSection() {

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-surface-1">
      {/* Separador superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border-subtle" />

      <div className="px-5 max-w-6xl mx-auto mb-16">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.25em] uppercase font-medium mb-12 text-center text-accent"
        >
          Lectores
        </motion.p>

        {/* Título */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(1.8rem,5vw,3rem)] font-black tracking-tight text-center mb-14 font-display text-ink-primary"
        >
          Lo que dicen quienes lo leyeron
        </motion.h2>

        {/* Cards con stagger */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={cardsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {testimonios.map((t) => (
            <motion.div
              key={t.nombre}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="shimmer-card flex flex-col gap-5 rounded-2xl p-6 border border-border-default transition-colors duration-300"
            >
              {/* Estrellas */}
              <div className="flex gap-1">
                {[...Array(t.estrellas)].map((_, si) => (
                  <Star key={si} className="w-3.5 h-3.5 fill-accent text-accent" />
                ))}
              </div>

              {/* Reseña */}
              <p className="text-sm leading-relaxed italic flex-1 font-serif text-ink-secondary">
                "{t.reseña}"
              </p>

              {/* Autor */}
              <div className="flex items-center gap-3 pt-3 border-t border-border-subtle">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 text-ink-primary"
                  style={{ background: t.color }}
                >
                  {t.inicial}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-ink-primary">
                    {t.nombre}
                  </span>
                  <span className="text-xs text-ink-tertiary">
                    {t.ciudad}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Marquee de palabras clave — Motion */}
      <div className="relative overflow-hidden py-6 border-t border-border-subtle border-b">
        <motion.div
          className="flex gap-8 whitespace-nowrap w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 90, ease: 'linear', repeat: Infinity }}
        >
          {[...palabrasClave, ...palabrasClave].map((palabra, i) => (
            <span
              key={`${palabra}-${i}`}
              className={`text-sm font-medium tracking-wide shrink-0 ${i % 3 === 0 ? 'text-accent' : 'text-ink-muted'}`}
            >
              {palabra}
              <span className="ml-8 text-border-default">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
