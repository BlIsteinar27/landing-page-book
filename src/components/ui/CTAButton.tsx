"use client";

import { motion } from "motion/react";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { LINKS } from "@/config/links";
import { motionTokens } from "@/config/motion-tokens";

interface CTAButtonProps {
  variant: "whatsapp" | "primary" | "whatsapp-sticky";
  className?: string;
  text?: string;
  size?: "md" | "sm";
}

const sharedMotion = {
  whileTap: { scale: motionTokens.scale.tap },
  transition: motionTokens.press,
};

const sizeClasses = {
  md: "px-7 py-4",
  sm: "px-4 py-3 whitespace-nowrap",
};

export default function CTAButton({
  variant,
  className = "",
  text,
  size = "md",
}: CTAButtonProps) {
  const sizeClass = sizeClasses[size];

  if (variant === "primary") {
    return (
      <motion.a
        href={LINKS.amazon}
        target="_blank"
        rel="noopener noreferrer"
        {...sharedMotion}
        className={`inline-flex items-center justify-center gap-2.5 ${sizeClass} font-semibold text-sm rounded-2xl bg-accent text-surface-base hover:opacity-90 transition-opacity shadow-[0_0_24px_var(--accent-glow)] focus-visible:ring-2 focus-visible:ring-accent ${className}`}
      >
        <ShoppingBag
          className="w-4 h-4"
          strokeWidth={2}
          nonScalingStroke
          aria-hidden
        />
        {text || "Comprar en Amazon"}
        <span className="sr-only">(se abre en una pestaña nueva)</span>
      </motion.a>
    );
  }

  if (variant === "whatsapp-sticky") {
    return (
      <motion.a
        href={LINKS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        {...sharedMotion}
        className={`inline-flex items-center justify-center gap-2.5 ${sizeClass} font-semibold text-sm rounded-2xl bg-whatsapp text-surface-base hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base ${className}`}
      >
        <MessageCircle
          className="w-4 h-4"
          strokeWidth={2}
          nonScalingStroke
          aria-hidden
        />
        {text || "Reserva ahora"}
        <span className="sr-only">(abre WhatsApp en una pestaña nueva)</span>
      </motion.a>
    );
  }

  return (
    <motion.a
      href={LINKS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      {...sharedMotion}
      className={`inline-flex items-center justify-center gap-2.5 ${sizeClass} font-medium text-sm rounded-2xl bg-surface-2 text-ink-primary border border-border-emphasis hover:bg-surface-3 transition-colors ${className}`}
    >
      <MessageCircle
        className="w-4 h-4 text-whatsapp"
        strokeWidth={2}
        nonScalingStroke
        aria-hidden
      />
      {text || "Reserva por WhatsApp"}
      <span className="sr-only">(abre WhatsApp en una pestaña nueva)</span>
    </motion.a>
  );
}
