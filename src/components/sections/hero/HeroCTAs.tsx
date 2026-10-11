"use client";

import { motion } from "motion/react";
import CTAButton from "@/components/ui/CTAButton";
import { useRegisterCTA } from "@/hooks/useRegisterCTA";
import { useEnterVariants } from "@/hooks/useEnterVariants";

export default function HeroCTAs() {
  const ref = useRegisterCTA("hero-cta");
  const enter = useEnterVariants();

  return (
    <>
      <motion.div
        ref={ref}
        data-cta-block
        variants={enter}
        className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2"
      >
        <CTAButton />
      </motion.div>
    </>
  );
}
