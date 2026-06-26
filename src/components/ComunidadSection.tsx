'use client';

import { motion } from 'motion/react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import TikTokIcon from '@/components/icons/TikTokIcon';
import { SOCIAL_LINKS } from '@/config/links';

const redes = [
  {
    nombre: 'Instagram',
    handle: SOCIAL_LINKS.instagramHandle,
    url: SOCIAL_LINKS.instagram,
    icon: <InstagramIcon />,
  },
  {
    nombre: 'TikTok',
    handle: SOCIAL_LINKS.tiktokHandle,
    url: SOCIAL_LINKS.tiktok,
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
        
        {/* Cards de redes personalizadas */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
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
              whileHover={{ y: -4 }}
              className="relative group"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
              
              {/* Card */}
              <div className="relative flex items-center gap-4 px-8 py-5 rounded-xl bg-surface-2 border border-border-subtle group-hover:border-accent/50 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base">
                {/* Icon container con efecto cósmico */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-accent/20 blur-md group-hover:bg-accent/30 transition-colors" />
                  <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 group-hover:border-accent/40 transition-all">
                    <span className="text-accent group-hover:scale-110 transition-transform">
                      {red.icon}
                    </span>
                  </div>
                </div>
                
                {/* Text */}
                <div className="text-left">
                  <p className="font-semibold text-ink-primary group-hover:text-accent transition-colors">{red.nombre}</p>
                  <p className="text-sm text-ink-tertiary font-mono">{red.handle}</p>
                </div>
                
                {/* Arrow indicator */}
                <svg className="w-4 h-4 text-ink-tertiary group-hover:text-accent group-hover:translate-x-1 transition-all ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
