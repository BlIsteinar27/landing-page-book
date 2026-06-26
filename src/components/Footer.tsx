'use client';

import { motion } from 'motion/react';
import CTAButton from '@/components/CTAButton';
import InstagramIcon from '@/components/icons/InstagramIcon';
import TikTokIcon from '@/components/icons/TikTokIcon';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden px-5 pt-24 pb-16 bg-surface-2">
      {/* Separador superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border-subtle" />

      {/* Glow central */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 blur-3xl bg-accent-dim" />

      <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-10 text-center">

        {/* Logo / Nombre */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-2"
        >
          <p className="font-display text-xl font-bold text-accent">
            Victoria Querales
          </p>
          <p className="text-sm text-ink-tertiary">
            Autora de Dioses Universales
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          data-cta-block
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:justify-center"
        >
          <CTAButton variant="primary" text="Comprar en Amazon" />
          <CTAButton variant="whatsapp" />
        </motion.div>

        {/* Separador */}
        <div className="w-full h-px bg-border-subtle" />

        {/* Redes sociales + copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
          <p className="text-xs text-ink-muted">
            © 2026 Victoria Querales. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4">
            {[
              {
                label: 'Instagram',
                url: 'https://www.instagram.com/victoria_aql',
                icon: <InstagramIcon className="w-4 h-4" />,
              },
              {
                label: 'TikTok',
                url: 'https://tiktok.com/@victoria_aql',
                icon: <TikTokIcon className="w-4 h-4" />,
              },
            ].map(({ icon, label, url }) => (
              <motion.a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-subtle bg-surface-3 text-ink-tertiary hover:text-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2"
              >
                {icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
