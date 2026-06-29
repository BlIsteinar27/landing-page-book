"use client";

import { motion, type Transition } from "motion/react";
import CTAButton from "@/components/ui/CTAButton";
import { useRegisterCTA } from "@/hooks/useRegisterCTA";

const heroCTATransition: Transition = { duration: 0.6, ease: "easeOut" };
const heroSocialProofTransition: Transition = { duration: 0.5 };

const heroCTAVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: heroCTATransition },
};

const heroSocialProofVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: heroSocialProofTransition },
};

export default function HeroCTAs() {
  const ref = useRegisterCTA("hero-cta");

  return (
    <>
      <motion.div
        ref={ref}
        data-cta-block
        variants={heroCTAVariants}
        className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2"
      >
        <CTAButton variant="whatsapp" text="Reserva tu copia" />
      </motion.div>

      <motion.a
        variants={heroSocialProofVariants}
        href="#mapa-interactivo"
        className="group relative inline-flex items-center gap-2 mx-auto lg:mx-0 mt-4 px-5 py-2.5 rounded-full bg-accent text-[#3d1f5c] font-semibold text-sm border-2 border-[#3d1f5c] shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
      >
        {/* Glow pulsante */}
        <motion.span
          className="absolute inset-0 rounded-full bg-accent"
          initial={{ opacity: 0.4, scale: 1 }}
          animate={{ opacity: [0.4, 0.1, 0.4], scale: [1, 1.25, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ zIndex: -1 }}
        />
        <span className="relative">Explora el universo</span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.a>
    </>
  );
}
