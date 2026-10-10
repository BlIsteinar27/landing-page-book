"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { motionTokens } from "@/config/motion-tokens";
import { useEnterVariants } from "@/hooks/useEnterVariants";

interface SocialLinkCardProps {
  nombre: string;
  handle: string;
  url: string;
  icon: ReactNode;
  // Sin uso: el escalonado lo da el contenedor padre; se mantiene por ComunidadSection
  index?: number;
}

export default function SocialLinkCard({
  nombre,
  handle,
  url,
  icon,
}: SocialLinkCardProps) {
  const enter = useEnterVariants();

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      variants={enter}
      whileHover={{ y: motionTokens.translate.cardHover }}
      className="relative group focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base rounded-xl outline-none"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />

      {/* Card */}
      <div className="relative flex items-center gap-4 px-8 py-5 rounded-xl bg-surface-2 border border-border-subtle group-hover:border-accent/50 transition-colors duration-300">
        {/* Icon container con efecto cósmico */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-md group-hover:bg-accent/30 transition-colors" />
          <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 group-hover:border-accent/40 transition-colors">
            <span className="text-accent group-hover:scale-110 transition-transform">
              {icon}
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="text-left">
          <p className="font-semibold text-ink-primary group-hover:text-accent transition-colors">
            {nombre}
          </p>
          <p className="text-sm text-ink-secondary font-mono">{handle}</p>
        </div>

        {/* Arrow indicator */}
        <ChevronRight
          className="w-4 h-4 text-ink-tertiary group-hover:text-accent group-hover:translate-x-1 transition-[color,translate] ml-2"
          strokeWidth={2}
          nonScalingStroke
          aria-hidden
        />
      </div>
      <span className="sr-only">(se abre en una pestaña nueva)</span>
    </motion.a>
  );
}
