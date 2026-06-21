'use client';

import { motion } from 'motion/react';
import CTAButton from '@/components/CTAButton';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden px-5 pt-24 pb-16 bg-surface-2">
      {/* Separador superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border-subtle" />

      {/* Glow central */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 blur-3xl bg-accent-dim" />

      <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-10 text-center">

        {/* Closing statement — la última impresión */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4"
        >
          <p className="text-xs tracking-[0.25em] uppercase font-medium text-accent">
            Tu momento es ahora
          </p>
          <h2 className="text-[clamp(2rem,6vw,4rem)] font-black leading-[1.05] tracking-tight font-display text-ink-primary">
            La vida que sueñas
            <br />
            <em className="not-italic font-serif text-accent">
              empieza en una página.
            </em>
          </h2>
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
          <CTAButton variant="amazon" />
          <CTAButton variant="whatsapp" />
        </motion.div>

        {/* Separador */}
        <div className="w-full h-px bg-border-subtle" />

        {/* Redes sociales + copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} Victoria. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4">
            {[
              {
                label: 'Instagram',
                svg: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                ),
              },
              {
                label: 'Facebook',
                svg: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                ),
              },
              {
                label: 'X',
                svg: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                ),
              },
            ].map(({ svg, label }) => (
              <motion.a
                key={label}
                href="#"
                aria-label={label}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-subtle bg-surface-3 text-ink-tertiary hover:text-ink-secondary transition-colors"
              >
                {svg}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
