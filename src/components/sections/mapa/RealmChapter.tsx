"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Realm } from "@/config/realms-data";
import ImageErrorFallback from "@/components/ImageErrorFallback";
import AtmosphereLayer from "./AtmosphereLayer";

interface RealmChapterProps {
  realm: Realm;
  index: number;
  /** Rango [inicio, fin] del capítulo dentro de scrollYProgress (0-1) */
  range: [number, number];
  /** Progreso global de la sección */
  progress: MotionValue<number>;
  /** Capítulo actualmente dominante (para aria-hidden y hotspots) */
  isActive: boolean;
}

const FADE = 0.05; // margen de crossfade entre capítulos

export default function RealmChapter({
  realm,
  index,
  range,
  progress,
  isActive,
}: RealmChapterProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [start, end] = range;
  const isFirst = index === 0;
  const isLast = index === 2;

  // Crossfade: el primero arranca visible, el último termina visible
  const opacity = useTransform(
    progress,
    [start, Math.min(start + FADE, end), Math.max(end - FADE, start), end],
    [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0],
  );
  // Ken Burns: zoom-out lento + deriva vertical mientras el capítulo vive
  const scale = useTransform(progress, [start, end], [1.1, 1.02]);
  // Deriva vertical: el final se queda en -1% para que la imagen escalada
  // (x1.02) siga cubriendo el borde inferior — con -2% quedaba una franja vista
  const y = useTransform(progress, [start, end], ["2%", "-1%"]);

  const textOpacity = useTransform(
    progress,
    [start + FADE, start + FADE * 2, end - FADE * 2, end - FADE],
    [0, 1, 1, 0],
  );
  const textY = useTransform(
    progress,
    [start + FADE, start + FADE * 2],
    [24, 0],
  );

  // Salida del último capítulo: el borde inferior se funde al color de la
  // sección siguiente (Saga usa bg-surface-1) — la transición se lee
  // intencional en vez de un corte con franjas
  const outroOpacity = useTransform(
    progress,
    [Math.max(end - 0.08, start), end],
    [0, 1],
  );

  return (
    <motion.div
      aria-hidden={!isActive}
      inert={!isActive ? true : undefined}
      style={{ opacity }}
      className={`absolute inset-0 overflow-hidden ${
        isActive ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-surface-2 animate-pulse" />
      )}
      {hasError && <ImageErrorFallback />}

      <motion.div style={{ scale, y }} className="absolute inset-0">
        <Image
          src={realm.backgroundImage}
          alt={isActive ? realm.name : ""}
          fill
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          quality={85}
          className="object-cover"
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM2QxZjVjIi8+PC9zdmc+"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      </motion.div>

      {/* Gradiente de legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

      <AtmosphereLayer
        progress={progress}
        range={range}
        variant={
          realm.id === "realm-light"
            ? "light"
            : realm.id === "realm-dark"
              ? "dark"
              : "central"
        }
      />

      {isLast && (
        <motion.div
          style={{ opacity: outroOpacity }}
          className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-surface-1 via-surface-1/70 to-transparent pointer-events-none"
        />
      )}

      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none"
      >
        <div className="text-center max-w-2xl">
          <h3 className="text-4xl md:text-6xl font-display font-black text-ink-primary mb-4">
            {realm.title}
          </h3>
          <p className="text-lg md:text-xl text-ink-secondary">
            {realm.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
