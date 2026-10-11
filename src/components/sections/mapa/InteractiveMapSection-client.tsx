"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  AnimatePresence,
  useScroll,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { ArrowDown } from "lucide-react";
import { realms, Realm, Hotspot as HotspotType } from "@/config/realms-data";
import { exitTransition } from "@/config/motion-tokens";
import RealmChapter from "./RealmChapter";
import RealmLevel from "./RealmLevel";
import Hotspot from "./Hotspot";
import ImageOverlay from "@/components/overlays/ImageOverlay";
import DualOverlay from "@/components/overlays/DualOverlay";
import NavigationDots from "@/components/ui/NavigationDots";
import NavigationRail from "@/components/ui/NavigationRail";

const GalaxyScene = dynamic(() => import("./GalaxyScene"), { ssr: false });

// Rangos de cada capítulo dentro del progreso global 0-1
const CHAPTER_RANGES: [number, number][] = [
  [0, 0.36],
  [0.31, 0.69],
  [0.64, 1],
];
// Centro de cada capítulo (para scrollToIndex)
const CHAPTER_CENTERS = [0.17, 0.5, 0.83];

export default function InteractiveMapSectionClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  // El sticky (100dvh) es lo que realmente "está en pantalla" mientras dura el pin;
  // observar el contenedor de 400vh con amount 0.3 nunca se cumpliría (ratio máx. 0.25)
  const stickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const isInSection = useInView(stickyRef, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  // Progreso local del capítulo oscuro (rango [0.64, 1] del progreso global)
  const darkProgress = useTransform(scrollYProgress, [0.64, 1], [0, 1]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [showDualOverlay, setShowDualOverlay] = useState(false);
  const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null);
  // Cambia solo al abrir: remonta los overlays con estado limpio sin cortar su animación de salida
  const [openCount, setOpenCount] = useState(0);

  // Estado discreto derivado del progreso continuo (reemplaza IntersectionObserver)
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2;
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  // Vista alterna del capítulo oscuro (reino ↔ galaxias): alterna sola cada 7s
  // mientras el capítulo está activo, hasta que el usuario toca el pill — a
  // partir de ahí la selección manual manda y el ciclo automático se detiene.
  // Vive aquí para que el hotspot pueda leerla
  const [darkAltView, setDarkAltView] = useState(false);
  const [autoCycle, setAutoCycle] = useState(true);
  const darkActive = activeIndex === 2;

  useEffect(() => {
    if (!darkActive || !autoCycle) return;
    const id = setInterval(() => setDarkAltView((v) => !v), 7000);
    return () => clearInterval(id);
  }, [darkActive, autoCycle]);

  const selectDarkView = (alt: boolean) => {
    setDarkAltView(alt);
    setAutoCycle(false);
  };

  const scrollToIndex = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const start = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: start + range * CHAPTER_CENTERS[index],
      behavior: "smooth",
    });
  };

  const handleHotspotClick = (hotspot: HotspotType) => {
    // Long press + click posterior no deben reabrir (ni remontar) el overlay
    if (showImageOverlay || showDualOverlay) return;
    const realm = realms.find((r) =>
      r.hotspots?.some((h) => h.id === hotspot.id),
    );
    if (realm) {
      setSelectedRealm(realm);
      setOpenCount((count) => count + 1);
      if (realm.id === "realm-dark") {
        setShowDualOverlay(true);
      } else {
        setShowImageOverlay(true);
      }
    }
  };

  const closeOverlay = () => {
    setShowImageOverlay(false);
    setShowDualOverlay(false);
    setSelectedRealm(null);
  };

  // Fallback reduced-motion: los tres reinos apilados, sin pinning
  if (reduceMotion) {
    return (
      <div>
        {realms.map((realm, index) => (
          <div key={realm.id} className="h-dvh relative">
            <RealmLevel realm={realm} isActive index={index} />
            {realm.hotspots && realm.hotspots.length > 0 && (
              <div className="absolute inset-0 z-30 pointer-events-none">
                {realm.hotspots.map((hotspot) => (
                  <div key={hotspot.id} className="pointer-events-auto">
                    <Hotspot
                      hotspot={hotspot}
                      onShowDetail={handleHotspotClick}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <ImageOverlay
          key={`image-overlay-${openCount}`}
          isVisible={showImageOverlay}
          onClose={closeOverlay}
          imagePath={selectedRealm?.backgroundImage || ""}
          title={selectedRealm?.title || ""}
          lore={selectedRealm?.lore}
          initialFill={selectedRealm?.overlayFill}
        />
        <DualOverlay
          key={`dual-overlay-${openCount}`}
          isVisible={showDualOverlay}
          onClose={closeOverlay}
          leftImagePath="/landing-book-victoria/mapa-galaxias.webp"
          rightImagePath="/landing-book-victoria/reino-oscuro.png"
          leftTitle="Mapa de Galaxias"
          rightTitle="Reino Oscuro"
          lore={realms.find((r) => r.id === "realm-dark")?.lore}
        />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isInSection && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              filter: "blur(4px)",
              transition: exitTransition.transition,
            }}
            // Cápsula con el nombre del reino activo: solo en desktop (lg+),
            // donde hay espacio y los tooltips por hover sí existen. En móvil
            // ocupa demasiado del mapa y se usa el NavigationRail
            className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-2 rounded-full border border-border-subtle bg-surface-1/80 px-2.5 py-3 backdrop-blur-sm"
          >
            <span className="text-xs font-medium text-ink-secondary whitespace-nowrap">
              {realms[activeIndex].name}
            </span>
            <NavigationDots
              count={realms.length}
              activeIndex={activeIndex}
              onIndexChange={scrollToIndex}
              size="medium"
              showTooltips
              tooltips={realms.map((r) => r.name)}
              tooltipPosition="left"
              orientation="vertical"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rail fino en móvil: mismo rol que la cápsula pero ~14px de ancho.
          El chip del nombre aparece al cambiar de reino y los ticks dorados
          activos llevan el anillo oscuro del lenguaje visual de los hotspots */}
      <AnimatePresence>
        {isInSection && (
          <NavigationRail
            count={realms.length}
            activeIndex={activeIndex}
            onIndexChange={scrollToIndex}
            tooltips={realms.map((r) => r.name)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInSection && activeIndex === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              ...exitTransition.exit,
              transition: exitTransition.transition,
            }}
            // Abajo sobre el StickyCTA solo si el viewport da espacio (≥400px de
            // ancho y ≥660px de alto: móvil L en adelante); en pantallas más
            // estrechas o bajas choca con la etiqueta del hotspot y va arriba
            className="pointer-events-none fixed left-1/2 -translate-x-1/2 z-40 max-[400px]:top-[calc(1rem+env(safe-area-inset-top))] [@media_not_all_and_(min-height:41.25rem)]:top-[calc(1rem+env(safe-area-inset-top))] min-[400px]:[@media(min-height:41.25rem)]:max-lg:bottom-[calc(6rem+env(safe-area-inset-bottom))] min-[400px]:[@media(min-height:41.25rem)]:lg:bottom-8"
          >
            <p className="flex items-center gap-2 text-sm text-ink-secondary bg-surface-1/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border-subtle">
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-accent inline-flex"
              >
                <ArrowDown
                  className="w-4 h-4"
                  strokeWidth={2}
                  nonScalingStroke
                  aria-hidden
                />
              </motion.span>
              <span className="pointer-coarse:hidden">
                Desplázate para explorar el universo
              </span>
              <span className="hidden pointer-coarse:inline">
                Desliza para explorar el universo
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenedor de 400vh: 300vh de recorrido de scrub para 3 capítulos */}
      <div ref={containerRef} className="relative h-[400vh]">
        <div ref={stickyRef} className="sticky top-0 h-dvh overflow-hidden">
          {realms.map((realm, index) => (
            <RealmChapter
              key={realm.id}
              realm={realm}
              index={index}
              range={CHAPTER_RANGES[index]}
              progress={scrollYProgress}
              isActive={activeIndex === index}
              altView={realm.id === "realm-dark" ? darkAltView : undefined}
              onSelectView={
                realm.id === "realm-dark" ? selectDarkView : undefined
              }
            />
          ))}

          {/* Starfield 3D: solo montado cerca del capítulo oscuro */}
          {activeIndex === 2 && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <GalaxyScene progress={darkProgress} />
            </div>
          )}

          <p className="sr-only" role="status">
            {`Explorando: ${realms[activeIndex].name}`}
          </p>

          {/* Hotspots del capítulo activo. En el reino oscuro la etiqueta
              sigue la vista activa del pill (reino ↔ mapa de galaxias) */}
          {realms[activeIndex]?.hotspots?.length ? (
            <div className="absolute inset-0 z-30 pointer-events-none">
              {realms[activeIndex].hotspots!.map((hotspot) => {
                const realm = realms[activeIndex];
                const displayHotspot =
                  realm.altView && darkAltView
                    ? { ...hotspot, title: realm.altView.title }
                    : hotspot;
                return (
                  <div key={hotspot.id} className="pointer-events-auto">
                    <Hotspot
                      hotspot={displayHotspot}
                      onShowDetail={handleHotspotClick}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <ImageOverlay
        key={`image-overlay-${openCount}`}
        isVisible={showImageOverlay}
        onClose={closeOverlay}
        imagePath={selectedRealm?.backgroundImage || ""}
        title={selectedRealm?.title || ""}
        lore={selectedRealm?.lore}
        initialFill={selectedRealm?.overlayFill}
      />
      <DualOverlay
        key={`dual-overlay-${openCount}`}
        isVisible={showDualOverlay}
        onClose={closeOverlay}
        leftImagePath="/landing-book-victoria/mapa-galaxias.webp"
        rightImagePath="/landing-book-victoria/reino-oscuro.png"
        leftTitle="Mapa de Galaxias"
        rightTitle="Reino Oscuro"
        lore={realms.find((r) => r.id === "realm-dark")?.lore}
      />
    </>
  );
}
