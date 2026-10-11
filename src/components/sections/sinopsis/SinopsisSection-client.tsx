"use client";

import { motion } from "motion/react";
import { BadgeCheck } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import { useRegisterCTA } from "@/hooks/useRegisterCTA";
import { useEnterVariants } from "@/hooks/useEnterVariants";
import { staggerContainer } from "@/config/motion-tokens";

export default function SinopsisSectionClient() {
  const ref = useRegisterCTA("sinopsis-cta");
  const enter = useEnterVariants();
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-col gap-6"
    >
      <motion.h2
        variants={enter}
        className="text-4xl font-display font-black text-ink-primary"
      >
        Los Dos Reinos
      </motion.h2>

      <motion.div variants={enter} className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
          Fantasía Oscura
        </span>
        <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
          Romance
        </span>
        <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
          Política
        </span>
      </motion.div>

      <motion.p variants={enter} className="text-ink-secondary leading-relaxed">
        En el Reino Central, las gemelas Laila y Liora personifican el
        equilibrio entre la luz y la oscuridad. Sin embargo, su destino se
        fractura cuando Kenan, su creador, destierra a Laila al reino Oscuro
        bajo la tutela del dios de la muerte, Seth Godness. Forjada en el dolor
        y la crueldad, Laila deberá aprender a reinar en un mundo que la
        rechaza.
      </motion.p>

      <motion.p variants={enter} className="text-ink-secondary leading-relaxed">
        Más de quinientos años después, el implacable dios Cosmo Godness busca
        una consorte para perpetuar el linaje divino y someter el universo. Su
        mirada recae sobre Aryana, una veterinaria cuya fuerza lo cautiva.
        Atrapada en un pacto divino para salvar a su familia de un nido de
        intrigas celestiales, Aryana deberá sobrevivir a la dinastía más
        peligrosa del cosmos. Los Godness.
      </motion.p>

      <motion.p
        variants={enter}
        className="text-ink-secondary leading-relaxed italic"
      >
        Los dos reinos es una historia épica de traición, dolor y redención,
        donde la línea entre la luz y la oscuridad desaparece, y el amor y la
        venganza dictan el destino de la creación.
      </motion.p>

      <motion.p
        variants={enter}
        className="text-sm text-ink-secondary inline-flex items-center gap-1.5"
      >
        <BadgeCheck
          className="w-4 h-4 text-accent"
          strokeWidth={2}
          nonScalingStroke
          aria-hidden
        />
        Ya disponible
      </motion.p>

      <motion.div
        ref={ref}
        variants={enter}
        className="flex flex-col sm:flex-row gap-3 pt-4"
      >
        <CTAButton />
      </motion.div>
    </motion.div>
  );
}
