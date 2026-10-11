"use client";

import { motion } from "motion/react";
import InstagramIcon from "@/components/icons/InstagramIcon";
import TikTokIcon from "@/components/icons/TikTokIcon";
import { SOCIAL_LINKS_FLAT } from "@/config/links";
import SocialLinkCard from "@/components/ui/SocialLinkCard";
import { staggerContainer } from "@/config/motion-tokens";
import { useEnterVariants } from "@/hooks/useEnterVariants";

const redes = [
  {
    nombre: "Instagram",
    handle: SOCIAL_LINKS_FLAT.instagramHandle,
    url: SOCIAL_LINKS_FLAT.instagram,
    icon: <InstagramIcon />,
  },
  {
    nombre: "TikTok",
    handle: SOCIAL_LINKS_FLAT.tiktokHandle,
    url: SOCIAL_LINKS_FLAT.tiktok,
    icon: <TikTokIcon />,
  },
];

export default function ContactoSection() {
  const enter = useEnterVariants();

  return (
    <section className="relative py-24 px-6 md:px-8 bg-surface-1">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p
            variants={enter}
            className="text-xs tracking-[0.25em] uppercase text-accent mb-8"
          >
            Contacto
          </motion.p>

          <motion.h2
            variants={enter}
            className="text-3xl md:text-4xl font-display font-black mb-6 text-ink-primary"
          >
            Sigue el viaje de creación
          </motion.h2>

          <motion.p
            variants={enter}
            className="text-ink-secondary mb-12 max-w-xl mx-auto"
          >
            Únete a la comunidad de lectores, conoce más del universo de Dioses
            Universales y acompaña la llegada de <em>Los Dos Reinos</em>.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          {redes.map((red) => (
            <SocialLinkCard
              key={red.nombre}
              nombre={red.nombre}
              handle={red.handle}
              url={red.url}
              icon={red.icon}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
