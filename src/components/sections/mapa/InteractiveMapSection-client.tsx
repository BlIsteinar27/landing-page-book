"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { realms, Realm, Hotspot as HotspotType } from "@/config/realms-data";
import { useScrollSnap } from "@/hooks/useScrollSnap";
import { exitTransition } from "@/config/motion-tokens";
import RealmLevel from "./RealmLevel";
import Hotspot from "./Hotspot";
import ImageOverlay from "@/components/overlays/ImageOverlay";
import DualOverlay from "@/components/overlays/DualOverlay";
import NavigationDots from "@/components/ui/NavigationDots";

export default function InteractiveMapSectionClient() {
  const { containerRef, activeIndex, scrollToIndex, isInSection } =
    useScrollSnap({ snapPoints: realms.length });
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [showDualOverlay, setShowDualOverlay] = useState(false);
  const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null);
  // Cambia solo al abrir: remonta los overlays con estado limpio sin cortar su animación de salida
  const [openCount, setOpenCount] = useState(0);

  const handleHotspotClick = (hotspot: HotspotType) => {
    // Long press + click posterior no deben reabrir (ni remontar) el overlay
    if (showImageOverlay || showDualOverlay) return;
    const realm = realms.find((r) =>
      r.hotspots?.some((h) => h.id === hotspot.id),
    );

    if (realm) {
      setSelectedRealm(realm);
      setOpenCount((count) => count + 1);

      // Si es el Reino Oscuro (última imagen), mostrar DualOverlay
      if (realm.id === "realm-dark") {
        setShowDualOverlay(true);
      } else {
        // Para las otras imágenes, mostrar ImageOverlay normal
        setShowImageOverlay(true);
      }
    }
  };

  const closeOverlay = () => {
    setShowImageOverlay(false);
    setShowDualOverlay(false);
    setSelectedRealm(null);
  };

  return (
    <>
      {/* Navigation Dots - solo visibles cuando la sección está en viewport */}
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
            className="fixed right-4 top-1/2 -translate-y-1/2 z-40"
          >
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

      {/* Navigation Instructions - solo en el primer realm */}
      <AnimatePresence>
        {isInSection && activeIndex === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              ...exitTransition.exit,
              transition: exitTransition.transition,
            }}
            className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] lg:bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-accent"
            >
              <ArrowDown
                className="w-6 h-6"
                strokeWidth={2}
                nonScalingStroke
                aria-hidden
              />
            </motion.div>
            <p className="text-sm text-ink-secondary bg-surface-1/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border-subtle">
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

      {/* Realms Container - fluye directamente en la página, sin scroll anidado */}
      <div ref={containerRef}>
        {realms.map((realm, index) => (
          <div
            key={realm.id}
            className="h-dvh relative"
            data-snap-point
            data-index={index}
          >
            <RealmLevel
              realm={realm}
              isActive={activeIndex === index}
              index={index}
            />

            {/* Hotspots - mismo inset que la imagen para alineamiento correcto */}
            {realm.hotspots &&
              realm.hotspots.length > 0 &&
              activeIndex === index && (
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
      </div>

      {/* Image Overlay para imágenes individuales (Reino de la Luz y Reino Central) */}
      <ImageOverlay
        key={`image-overlay-${openCount}`}
        isVisible={showImageOverlay}
        onClose={closeOverlay}
        imagePath={selectedRealm?.backgroundImage || ""}
        title={selectedRealm?.title || ""}
        lore={selectedRealm?.lore}
      />

      {/* Dual Overlay para Reino Oscuro + Mapa de Galaxias */}
      <DualOverlay
        key={`dual-overlay-${openCount}`}
        isVisible={showDualOverlay}
        onClose={closeOverlay}
        leftImagePath="/landing-book-victoria/mapa-galaxias.svg"
        rightImagePath="/landing-book-victoria/reino-oscuro.png"
        leftTitle="Mapa de Galaxias"
        rightTitle="Reino Oscuro"
        lore={realms.find((r) => r.id === "realm-dark")?.lore}
      />
    </>
  );
}
