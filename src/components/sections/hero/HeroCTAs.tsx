"use client";

import CTAButton from "@/components/ui/CTAButton";
import { useRegisterCTA } from "@/hooks/useRegisterCTA";

export default function HeroCTAs() {
  const ref = useRegisterCTA("hero-cta");

  return (
    <div
      ref={ref}
      data-cta-block
      className="hero-enter hero-enter-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2"
    >
      <CTAButton />
    </div>
  );
}
