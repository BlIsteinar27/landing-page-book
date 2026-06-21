'use client';

import { motion } from 'motion/react';

export default function SinopsisSection() {
  return (
    <section className="relative py-24 md:py-32 px-5 overflow-hidden bg-surface-1">
      {/* Separador superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border-subtle" />

      <div className="max-w-4xl mx-auto">

        {/* Label de sección */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.25em] uppercase font-medium mb-10 text-center text-accent"
        >
          De qué trata
        </motion.p>

        {/* Pull quote — la frase gancho del libro */}
        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-16 pl-6 sm:pl-8"
        >
          {/* Línea lateral editorial */}
          <div
            className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
            style={{ background: 'linear-gradient(to bottom, var(--accent), transparent)' }}
          />
          <p className="text-[clamp(1.5rem,4vw,2.5rem)] leading-[1.2] font-light italic font-serif text-ink-primary">
            "El viaje más profundo que puedes emprender no te llevará a ningún lugar del mapa.
            <span className="text-accent"> Te llevará a ti."</span>
          </p>
        </motion.blockquote>

        {/* Cuerpo de la sinopsis — 3 párrafos con entrada escalonada */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              num: '01',
              text: 'En un mundo donde las expectativas nos rodean por todos lados, Victoria nos invita a emprender un viaje de autodescubrimiento que cambiará nuestra perspectiva sobre lo que significa vivir plenamente.',
            },
            {
              num: '02',
              text: 'A través de anécdotas personales y reflexiones profundas, este libro explora los desafíos de nuestra búsqueda de propósito, ofreciendo herramientas prácticas para superar obstáculos y cultivar una mentalidad de crecimiento.',
            },
            {
              num: '03',
              text: 'Más que una lectura, es una guía interactiva que te acompañará paso a paso mientras construyes la vida que siempre has soñado.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.1 }}
              className="flex flex-col gap-3"
            >
              <span className="text-xs font-mono tracking-widest text-ink-muted">
                {item.num}
              </span>
              <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Separador inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border-subtle" />
    </section>
  );
}
