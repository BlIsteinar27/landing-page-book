"use client";

import { m, AnimatePresence } from "motion/react";
import { useCTAVisibility } from "@/components/CTAVisibilityProvider";
import CTAButton from "@/components/ui/CTAButton";
import { motionTokens } from "@/config/motion-tokens";

export default function StickyCTA() {
  const { anyVisible } = useCTAVisibility();
  const showSticky = !anyVisible;

  return (
    <AnimatePresence>
      {showSticky && (
        <m.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={motionTokens.spring}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 lg:hidden bg-[linear-gradient(to_top,var(--surface-base)_70%,transparent)]"
        >
          <CTAButton size="sm" className="w-full" />
        </m.div>
      )}
    </AnimatePresence>
  );
}
