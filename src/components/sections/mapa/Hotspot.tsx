"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Hotspot as HotspotType } from "@/config/realms-data";
import { useTouchGestures } from "@/hooks/useTouchGestures";

interface HotspotProps {
  hotspot: HotspotType;
  onShowDetail?: (hotspot: HotspotType) => void;
  onVisible?: () => void;
}

export default function Hotspot({
  hotspot,
  onShowDetail,
  onVisible,
}: HotspotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showLongPressHint, setShowLongPressHint] = useState(false);
  const { elementRef } = useTouchGestures({
    onLongPress: () => {
      if (onShowDetail) {
        onShowDetail(hotspot);
      }
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      onVisible?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowLongPressHint(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

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
      <motion.div
        ref={elementRef}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          onShowDetail?.(hotspot);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="absolute cursor-pointer flex items-center justify-center"
        style={{
          left: `${hotspot.x * 100}%`,
          top: `${hotspot.y * 100}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Pulse Effect */}
        <motion.div
          animate={{
            scale: [1, hotspot.isProminent ? 2 : 1.5, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: hotspot.isProminent ? 1.5 : 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute rounded-full motion-reduce:animate-none ${
            hotspot.isProminent ? "bg-accent" : "bg-accent/70"
          }`}
          style={{
            width: hotspot.isProminent ? 32 : 24,
            height: hotspot.isProminent ? 32 : 24,
          }}
        />

        {/* Hotspot Dot */}
        <div
          className={`relative rounded-full border-2 border-white shadow-lg ${
            hotspot.isProminent ? "w-8 h-8 bg-accent" : "w-6 h-6 bg-accent"
          }`}
        >
          {hotspot.isProminent && (
            <svg
              className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </div>

        {/* Label visible para hotspots prominentes */}
        {hotspot.isProminent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-3 bg-surface-1/90 backdrop-blur-sm border border-border-default rounded-lg px-3 py-1.5 shadow-xl whitespace-nowrap"
          >
            <p className="text-xs font-medium text-ink-primary">
              {hotspot.title}
            </p>
            <p className="text-[10px] text-accent mt-0.5">Toca para explorar</p>
            {showLongPressHint && (
              <p className="text-[9px] text-ink-tertiary mt-1 italic">
                También puedes mantener presionado
              </p>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Tooltip on hover (desktop) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bg-surface-1 border border-border-default rounded-lg p-3 shadow-xl max-w-xs z-50"
            style={{
              left: `${hotspot.x * 100}%`,
              top: `${hotspot.y * 100}%`,
              transform: getTooltipTransform(),
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
