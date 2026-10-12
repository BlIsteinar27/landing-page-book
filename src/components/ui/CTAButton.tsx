"use client";

import { m } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { useCompraDialog } from "@/components/CompraDialogProvider";
import { motionTokens } from "@/config/motion-tokens";

interface CTAButtonProps {
  className?: string;
  text?: string;
  size?: "md" | "sm";
}

const sizeClasses = {
  md: "px-7 py-4",
  sm: "px-4 py-3 whitespace-nowrap",
};

export default function CTAButton({
  className = "",
  text,
  size = "md",
}: CTAButtonProps) {
  const openCompra = useCompraDialog();

  return (
    <m.button
      type="button"
      onClick={openCompra}
      whileTap={{ scale: motionTokens.scale.tap }}
      transition={motionTokens.press}
      className={`inline-flex items-center justify-center gap-2.5 ${sizeClasses[size]} font-semibold text-sm rounded-2xl bg-accent text-surface-base hover:opacity-90 transition-opacity shadow-[0_0_24px_var(--accent-glow)] focus-visible:ring-2 focus-visible:ring-accent ${className}`}
    >
      <ShoppingBag
        className="w-4 h-4"
        strokeWidth={2}
        nonScalingStroke
        aria-hidden
      />
      {text || "Comprar Los Dos Reinos"}
    </m.button>
  );
}
