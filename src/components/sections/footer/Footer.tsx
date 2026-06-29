"use client";

import { motion } from "motion/react";
import CTAButton from "@/components/ui/CTAButton";
import InstagramIcon from "@/components/icons/InstagramIcon";
import TikTokIcon from "@/components/icons/TikTokIcon";
import { SOCIAL_LINKS_FLAT } from "@/config/links";
import { useRegisterCTA } from "@/hooks/useRegisterCTA";
import SocialLinkCard from "@/components/ui/SocialLinkCard";
import { motionTokens } from "@/config/motion-tokens";

export default function Footer() {
  const ref = useRegisterCTA("footer-cta");
  return (
    <footer className="relative overflow-hidden px-6 md:px-8 pt-24 pb-16 bg-surface-2">
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
          ref={ref}
          data-cta-block
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:justify-center"
        >
          <CTAButton variant="whatsapp" text="Consigue tu copia" />
        </motion.div>

        {/* Separador */}
        <div className="w-full h-px bg-border-subtle" />

        {/* Redes sociales + copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
          <p className="text-xs text-ink-muted">
            © 2026 Victoria Querales. Todos los derechos reservados.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {[
              {
                nombre: 'Instagram',
                handle: '@victoria_aql',
                url: SOCIAL_LINKS_FLAT.instagram,
                icon: <InstagramIcon className="w-4 h-4" />,
              },
              {
                nombre: 'TikTok',
                handle: '@victoria_aql',
                url: SOCIAL_LINKS_FLAT.tiktok,
                icon: <TikTokIcon className="w-4 h-4" />,
              },
            ].map((red, i) => (
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
      </div>
    </footer>
  );
}
