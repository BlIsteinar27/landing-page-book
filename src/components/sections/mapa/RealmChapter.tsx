"use client";

import {
  m,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
  type TargetAndTransition,
} from "motion/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Realm } from "@/config/realms-data";
import { motionTokens } from "@/config/motion-tokens";
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
  /** Vista alternativa activa — controlada por el padre para que el pill del
      capítulo y la etiqueta del hotspot muestren la misma vista */
  altView?: boolean;
  onSelectView?: (alt: boolean) => void;
}

const FADE = 0.05; // margen de crossfade entre capítulos

// Deriva ambiental en reposo (sin scroll): el mapa "respira" igual que el
// balanceo de cámara del starfield del Reino Oscuro — mismo idioma, menor
// intensidad. Escala mínima 1.03 → margen 1.5% por lado, así la deriva
// (≤1%) nunca deja ver los bordes. El reino oscuro no lleva: ya flota en 3D.
const AMBIENT_DRIFT: Record<
  string,
  { animate: TargetAndTransition; duration: number }
> = {
  "realm-light": {
    // Ascenso: flota hacia arriba — lo divino se eleva
    animate: {
      scale: [1.04, 1.09, 1.04],
      x: ["0%", "0.7%", "0%"],
      y: ["0.8%", "-1.4%", "0.8%"],
    },
    duration: 19,
  },
  "realm-central": {
    // Péndulo: mece de lado a lado — lo terrenal oscila
    animate: {
      scale: [1.04, 1.08, 1.04],
      x: ["-1.3%", "1.3%", "-1.3%"],
      y: ["0%", "-0.6%", "0%"],
    },
    duration: 15,
  },
};

export default function RealmChapter({
  realm,
  index,
  range,
  progress,
  isActive,
  altView = false,
  onSelectView,
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

  // La deriva solo corre mientras el capítulo es visible (incluido el crossfade
  // completo); a opacity 0 se asienta a la escala base — nadie la ve parar
  const [ambientVisible, setAmbientVisible] = useState(isFirst);
  useMotionValueEvent(opacity, "change", (v) => {
    const on = v > 0.001;
    setAmbientVisible((prev) => (prev === on ? prev : on));
  });
  const drift = AMBIENT_DRIFT[realm.id];

  // La imagen se desmonta solo tras ~2 s de opacidad 0 sostenida: libera el
  // bitmap del capítulo fuera de pantalla sin riesgo de parpadear durante
  // el crossfade ni de desmontar/remontar si el usuario cambia de dirección
  const [grace, setGrace] = useState(true);
  useEffect(() => {
    const t = setTimeout(
      () => setGrace(ambientVisible),
      ambientVisible ? 0 : 2000,
    );
    return () => clearTimeout(t);
  }, [ambientVisible]);
  const imageMounted = ambientVisible || grace;

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
    <m.div
      // Solo inert (sin aria-hidden): inert ya saca el subárbol del árbol de
      // accesibilidad y además desenfoca descendientes al activarse — con ambos,
      // Chrome avisa «Blocked aria-hidden… descendant retained focus» si el
      // foco estaba en el pill al salir del capítulo
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

      <m.div style={{ scale, y }} className="absolute inset-0">
        {/* Capa ambiental separada del Ken Burns por scroll: los dos
            transforms viven en elementos distintos y no se pisan */}
        <m.div
          animate={
            drift
              ? ambientVisible
                ? drift.animate
                : { scale: 1.04, x: "0%", y: "0%" }
              : undefined
          }
          transition={
            drift
              ? ambientVisible
                ? {
                    duration: drift.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : { duration: 1.2, ease: "easeInOut" }
              : undefined
          }
          className="absolute inset-0"
        >
          {imageMounted && (
            <Image
              src={realm.backgroundImage}
              alt={isActive ? realm.name : ""}
              fill
              loading="lazy"
              quality={85}
              className="object-cover"
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM2QxZjVjIi8+PC9zdmc+"
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
            />
          )}
          {realm.altView && imageMounted && (
            <m.div
              animate={{ opacity: altView ? 1 : 0 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={realm.altView.image}
                alt=""
                fill
                loading="lazy"
                quality={85}
                className="object-cover"
                sizes="100vw"
              />
            </m.div>
          )}
        </m.div>
      </m.div>

      {/* Pill de vista: indica qué imagen está activa y permite cambiarla.
          Ambas vistas son el mismo nivel del cono — el rail sigue en 3 ticks */}
      {realm.altView && (
        <div
          role="group"
          aria-label="Vista del capítulo"
          className="absolute left-1/2 -translate-x-1/2 top-[calc(1rem+env(safe-area-inset-top))] z-30 flex gap-1 rounded-full border border-border-subtle bg-surface-deep/70 p-1 backdrop-blur-sm"
        >
          {[realm.name, realm.altView.name].map((label, i) => {
            const active = altView === (i === 1);
            return (
              <m.button
                key={label}
                type="button"
                whileTap={{ scale: motionTokens.scale.tap }}
                onClick={() => onSelectView?.(i === 1)}
                aria-pressed={active}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-300 ${
                  active
                    ? "bg-accent text-surface-base"
                    : "text-ink-secondary hover:text-ink-primary"
                }`}
              >
                {label}
              </m.button>
            );
          })}
        </div>
      )}

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
        active={ambientVisible}
      />

      {isLast && (
        <m.div
          style={{ opacity: outroOpacity }}
          className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-surface-1 via-surface-1/70 to-transparent pointer-events-none"
        />
      )}

      <m.div
        style={{ opacity: textOpacity, y: textY }}
        className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none"
      >
        {/* Grid apilado: las dos vistas ocupan la misma celda y crossfaden;
            el contenedor se dimensiona al bloque más alto */}
        <div className="grid text-center max-w-2xl">
          <m.div
            animate={{ opacity: altView ? 0 : 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="col-start-1 row-start-1"
          >
            <h3 className="text-4xl md:text-6xl font-display font-black text-ink-primary mb-4">
              {realm.title}
            </h3>
            <p className="text-lg md:text-xl text-ink-secondary">
              {realm.description}
            </p>
          </m.div>
          {realm.altView && (
            <m.div
              animate={{ opacity: altView ? 1 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="col-start-1 row-start-1"
            >
              <h3 className="text-4xl md:text-6xl font-display font-black text-ink-primary mb-4">
                {realm.altView.title}
              </h3>
              <p className="text-lg md:text-xl text-ink-secondary">
                {realm.altView.description}
              </p>
            </m.div>
          )}
        </div>
      </m.div>
    </m.div>
  );
}
