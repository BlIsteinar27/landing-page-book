'use client';

import { motion } from 'motion/react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import TikTokIcon from '@/components/icons/TikTokIcon';

const redes = [
  {
    nombre: 'Instagram',
    handle: '@victoria_aql',
    url: 'https://www.instagram.com/victoria_aql',
    icon: <InstagramIcon />,
  },
  {
    nombre: 'TikTok',
    handle: '@victoria_aql',
    url: 'https://tiktok.com/@victoria_aql',
    icon: <TikTokIcon />,
  },
];

export default function ComunidadSection() {
  return (
    <section className="relative py-24 px-5 bg-surface-base">
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs tracking-[0.25em] uppercase text-accent mb-8"
        >
          Comunidad
        </motion.p>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-black mb-6 text-ink-primary"
        >
          Únete a los lectores
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-ink-secondary mb-12 max-w-xl mx-auto"
        >
          Sigue el viaje de creación, conoce más del universo de Dioses Universales 
          y sé parte de la comunidad.
        </motion.p>
        
        {/* Cards de redes */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {redes.map((red, i) => (
            <motion.a
              key={red.nombre}
              href={red.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 px-6 py-4 rounded-lg bg-surface-2 border border-border-subtle hover:border-accent transition-colors group"
            >
              <span className="text-accent group-hover:scale-110 transition-transform">
                {red.icon}
              </span>
              <div className="text-left">
                <p className="font-medium text-ink-primary">{red.nombre}</p>
                <p className="text-sm text-ink-tertiary">{red.handle}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
