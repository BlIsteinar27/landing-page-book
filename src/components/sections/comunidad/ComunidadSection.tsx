'use client';

import { motion } from 'motion/react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import TikTokIcon from '@/components/icons/TikTokIcon';
import { SOCIAL_LINKS_FLAT } from '@/config/links';
import SocialLinkCard from '@/components/ui/SocialLinkCard';

const redes = [
  {
    nombre: 'Instagram',
    handle: SOCIAL_LINKS_FLAT.instagramHandle,
    url: SOCIAL_LINKS_FLAT.instagram,
    icon: <InstagramIcon />,
  },
  {
    nombre: 'TikTok',
    handle: SOCIAL_LINKS_FLAT.tiktokHandle,
    url: SOCIAL_LINKS_FLAT.tiktok,
    icon: <TikTokIcon />,
  },
];

export default function ComunidadSection() {
  return (
    <section className="relative py-24 px-6 md:px-8 bg-surface-2">
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
            <SocialLinkCard
              key={red.nombre}
              nombre={red.nombre}
              handle={red.handle}
              url={red.url}
              icon={red.icon}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
