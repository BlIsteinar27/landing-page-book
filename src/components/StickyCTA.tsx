"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { LINKS } from "@/config/links";
import { useCTAVisibility } from "@/components/CTAVisibilityProvider";
import CTAButton from "@/components/ui/CTAButton";

export default function StickyCTA() {
  const { anyVisible } = useCTAVisibility();
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    setShowSticky(!anyVisible);
  }, [anyVisible]);

  return (
    <AnimatePresence>
      {showSticky && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 lg:hidden"
          style={{
            background: 'linear-gradient(to top, var(--surface-base) 70%, transparent)',
          }}
        >
          <div className="grid grid-cols-1 gap-3">
            <CTAButton variant="whatsapp-sticky" text="Reservar ahora" className="w-full" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
