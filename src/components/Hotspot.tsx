'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Hotspot as HotspotType } from '@/config/realms-data';
import { useTouchGestures } from '@/hooks/useTouchGestures';

interface HotspotProps {
  hotspot: HotspotType;
  onShowDetail?: (hotspot: HotspotType) => void;
  onVisible?: () => void;
}

export default function Hotspot({ hotspot, onShowDetail, onVisible }: HotspotProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { elementRef, isLongPressing } = useTouchGestures({
    onLongPress: () => {
      if (onShowDetail) {
        onShowDetail(hotspot);
      }
    }
  });

  // Notificar cuando el hotspot se vuelve visible después del delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      onVisible?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
          setIsSelected(true);
          setTimeout(() => setIsSelected(false), 300);
          onShowDetail?.(hotspot);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="absolute cursor-pointer flex items-center justify-center"
        style={{
          left: `${hotspot.x * 100}%`,
          top: `${hotspot.y * 100}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Pulse Effect - centrado con el dot */}
        <motion.div
          animate={{
            scale: [1, hotspot.isProminent ? 2 : 1.5, 1],
            opacity: [0.8, 0, 0.8]
          }}
          transition={{
            duration: hotspot.isProminent ? 1.5 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute rounded-full motion-reduce:animate-none ${
            hotspot.isProminent ? 'bg-accent' : 'bg-accent/70'
          }`}
          style={{ 
            width: hotspot.isProminent ? 32 : 24, 
            height: hotspot.isProminent ? 32 : 24
          }}
        />
        
        {/* Hotspot Dot */}
        <motion.div
          animate={{
            scale: isPressed ? 0.8 : isSelected ? 1.3 : 1,
            backgroundColor: isSelected ? '#10b981' : undefined // Verde al seleccionar
          }}
          transition={{ type: "spring", damping: 15 }}
          className={`relative rounded-full border-2 border-white shadow-lg ${
            hotspot.isProminent ? 'w-8 h-8 bg-accent' : 'w-6 h-6 bg-accent'
          }`}
        >
          {/* Icono para hotspots prominentes */}
          {hotspot.isProminent && (
            <svg className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </motion.div>

        {/* Label visible para hotspots prominentes */}
        {hotspot.isProminent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-3 bg-surface-1/90 backdrop-blur-sm border border-border-default rounded-lg px-3 py-1.5 shadow-xl whitespace-nowrap"
          >
            <p className="text-xs font-medium text-ink-primary">{hotspot.title}</p>
            <p className="text-[10px] text-accent mt-0.5">Toca para explorar</p>
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
            className="absolute bg-surface-1 border border-border-default rounded-lg p-3 shadow-xl max-w-xs"
            style={{
              left: `${hotspot.x * 100}%`,
              top: `${hotspot.y * 100}%`,
              transform: 'translate(-50%, -150%)'
            }}
          >
            <p className="text-sm font-medium text-ink-primary">{hotspot.title}</p>
            <p className="text-xs text-ink-secondary mt-1">{hotspot.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
