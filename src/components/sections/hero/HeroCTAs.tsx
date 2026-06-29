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
        {/* Amazon comentado hasta tener el enlace oficial del producto */}
        {/* <CTAButton variant="primary" text="Comprar en Amazon" /> */}
      </motion.div>

    </>
  );
}
