"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Realm } from "@/config/realms-data";
import ImageErrorFallback from "@/components/ImageErrorFallback";

interface RealmLevelProps {
  realm: Realm;
  isActive: boolean;
  index: number;
  onImageClick?: (realm: Realm) => void;
}

export default function RealmLevel({ realm, isActive, index, onImageClick }: RealmLevelProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: isActive ? 1 : 0.5,
        scale: isActive ? 1 : 0.95
      }}
      transition={{ duration: 0.5 }}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Skeleton Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-surface-2 animate-pulse" />
      )}

      {/* Error Fallback */}
      {hasError && <ImageErrorFallback />}

      {/* Background Image with Conditional Parallax */}
      <motion.div
        animate={isActive ? {
          y: [0, -10, 0],
        } : {}}
        transition={isActive ? {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
        className="absolute inset-0 cursor-pointer z-10"
        onClick={() => onImageClick?.(realm)}
      >
        <Image
          src={realm.backgroundImage}
          alt={realm.name}
          fill
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          quality={85}
          className="object-cover"
          sizes="100vw"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      </motion.div>

      {/* Gradient Overlay - pointer-events-none para no bloquear el click */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none z-20" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: isActive ? 1 : 0,
            y: isActive ? 0 : 30
          }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-2xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-display font-black text-ink-primary mb-4"
          >
            {realm.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-ink-secondary"
          >
            {realm.description}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
