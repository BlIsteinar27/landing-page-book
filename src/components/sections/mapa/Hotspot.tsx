"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Eye } from "lucide-react";
import { Hotspot as HotspotType } from "@/config/realms-data";
import { useTouchGestures } from "@/hooks/useTouchGestures";
import { motionTokens, exitTransition } from "@/config/motion-tokens";

interface HotspotProps {
  hotspot: HotspotType;
  onShowDetail?: (hotspot: HotspotType) => void;
}

export default function Hotspot({ hotspot, onShowDetail }: HotspotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { elementRef } = useTouchGestures<HTMLButtonElement>({
    onLongPress: () => {
      if (onShowDetail) {
        onShowDetail(hotspot);
      }
    },
  });

  const getTooltipTransform = () => {
    const x = hotspot.x;
    const y = hotspot.y;
    let transform = "translate(-50%, -150%)";
    if (x < 0.2) transform = "translate(0%, -150%)";
    if (x > 0.8) transform = "translate(-100%, -150%)";
    if (y < 0.2) transform = transform.replace("-150%", "50%");
    return transform;
  };

  return (
    <>
      <motion.button
        type="button"
        ref={elementRef}
        aria-label={`Explorar ${hotspot.title}`}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: motionTokens.scale.tap }}
        onClick={() => {
          onShowDetail?.(hotspot);
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="absolute cursor-pointer flex items-center justify-center rounded-full p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
        style={{
          left: `${hotspot.x * 100}%`,
          top: `${hotspot.y * 100}%`,
          // x/y como valores de motion: un transform en style anularía scale
          x: "-50%",
          y: "-50%",
        }}
      >
        {/* Entrada retardada en un span interno para que hover/tap no hereden el delay */}
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="relative flex items-center justify-center"
        >
          {/* Pulse Effect */}
          <motion.span
            animate={{
              scale: [1, hotspot.isProminent ? 2 : 1.5, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: hotspot.isProminent ? 1.5 : 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute rounded-full ${
              hotspot.isProminent ? "bg-accent" : "bg-accent/70"
            }`}
            style={{
              width: hotspot.isProminent ? 32 : 24,
              height: hotspot.isProminent ? 32 : 24,
            }}
          />

          {/* Hotspot Dot */}
          <span
            className={`block relative rounded-full border-2 border-surface-base shadow-lg ${
              hotspot.isProminent ? "w-8 h-8 bg-accent" : "w-6 h-6 bg-accent"
            }`}
          >
            {hotspot.isProminent && (
              <Eye
                className="w-4 h-4 text-surface-base absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                strokeWidth={2}
                nonScalingStroke
                aria-hidden
              />
            )}
          </span>

          {/* Label visible para hotspots prominentes */}
          {hotspot.isProminent && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-3 bg-surface-1/90 backdrop-blur-sm border border-border-default rounded-lg px-3 py-1.5 shadow-xl whitespace-nowrap"
            >
              <span className="block text-xs font-medium text-ink-primary">
                {hotspot.title}
              </span>
              <span className="block text-[10px] text-accent mt-0.5">
                <span className="pointer-coarse:hidden">
                  Haz clic para explorar
                </span>
                <span className="hidden pointer-coarse:inline">
                  Toca para explorar
                </span>
              </span>
            </motion.span>
          )}
        </motion.span>
      </motion.button>

      {/* Tooltip on hover (desktop) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              ...exitTransition.exit,
              transition: exitTransition.transition,
            }}
            // Compone el posicionamiento con el y animado (un transform en style lo anularía)
            transformTemplate={(_, generated) =>
              `${getTooltipTransform()} ${generated}`
            }
            className="absolute bg-surface-1 border border-border-default rounded-lg p-3 shadow-xl max-w-xs z-50"
            style={{
              left: `${hotspot.x * 100}%`,
              top: `${hotspot.y * 100}%`,
            }}
          >
            <p className="text-sm font-medium text-ink-primary">
              {hotspot.title}
            </p>
            <p className="text-xs text-ink-secondary mt-1">
              {hotspot.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
