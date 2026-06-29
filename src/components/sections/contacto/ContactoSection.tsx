'use client';

import { motion } from 'motion/react';
import { LINKS } from '@/config/links';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

export default function ContactoSection() {
  return (
    <section className="relative py-24 px-6 md:px-8 bg-surface-1">
      <div className="max-w-2xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs tracking-[0.25em] uppercase text-accent mb-8"
        >
          Contacto
        </motion.p>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-black mb-6 text-ink-primary"
        >
          ¿Quieres asegurar tu copia?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-ink-secondary mb-10"
        >
          Escríbeme por WhatsApp y te cuento cómo reservar tu ejemplar de <em>Los Dos Reinos</em>.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          {/* WhatsApp */}
          <a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1"
          >
            <WhatsAppIcon />
            WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
