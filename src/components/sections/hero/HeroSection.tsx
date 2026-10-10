"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { staggerContainer } from "@/config/motion-tokens";
import { useEnterVariants } from "@/hooks/useEnterVariants";
import HeroTitle from "./HeroTitle";
import HeroCTAs from "./HeroCTAs";
import HeroBookMockup from "./HeroBookMockup";

export default function HeroSection() {
  const enter = useEnterVariants();

  return (
    <section className="relative min-h-dvh flex flex-col justify-center overflow-hidden px-6 md:px-8 pt-16 pb-28 md:pb-20 bg-surface-base">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_60%_80%,var(--accent-glow)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-border-default" />
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            className="lg:col-span-8 flex flex-col gap-6 text-center lg:text-left"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <HeroTitle />
            <HeroCTAs />
          </motion.div>
          <HeroBookMockup />
        </div>

        <motion.div
          variants={enter}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary">
            <span>Explora el universo</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDown
                className="w-4 h-4"
                strokeWidth={2}
                nonScalingStroke
                aria-hidden
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
