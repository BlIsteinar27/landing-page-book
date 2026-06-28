'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { realms, Realm, Hotspot as HotspotType } from '@/config/realms-data';
import { useScrollSnap } from '@/hooks/useScrollSnap';
import RealmLevel from './RealmLevel';
import Hotspot from './Hotspot';
import GalaxyOverlay from './GalaxyOverlay';
import ImageOverlay from './ImageOverlay';
import DualOverlay from './DualOverlay';

interface Libro {
  titulo: string;
  estado: string;
  actual: boolean;
}

interface InteractiveMapSectionClientProps {
  libros: Libro[];
}

export default function InteractiveMapSectionClient({ libros }: InteractiveMapSectionClientProps) {
  const { containerRef, activeIndex, scrollToIndex, isInSection } = useScrollSnap({ snapPoints: realms.length });
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotType | null>(null);
  const [showGalaxyOverlay, setShowGalaxyOverlay] = useState(false);
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [showDualOverlay, setShowDualOverlay] = useState(false);
  const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null);
  const [visibleHotspots, setVisibleHotspots] = useState<Set<string>>(new Set());

  const handleHotspotVisible = (hotspotId: string) => {
    setVisibleHotspots(prev => new Set(prev).add(hotspotId));
  };

  // Limpiar hotspots visibles cuando el realm activo cambia
  useEffect(() => {
    const currentRealm = realms[activeIndex];
    if (currentRealm) {
      // Remover hotspots que no pertenecen al realm actual
      const currentRealmHotspotIds = new Set(
        currentRealm.hotspots?.map(h => h.id) || []
      );
      setVisibleHotspots(prev => {
        const newSet = new Set<string>();
        prev.forEach(id => {
          if (currentRealmHotspotIds.has(id)) {
            newSet.add(id);
          }
        });
        return newSet;
      });
    }
  }, [activeIndex]);

  const handleHotspotClick = (hotspot: HotspotType) => {
    setSelectedHotspot(hotspot);
    
    // Determinar el realm del hotspot
    const realm = realms.find(r => r.hotspots?.some(h => h.id === hotspot.id));
    
    if (realm) {
      setSelectedRealm(realm);
      
      // Si es el Reino Oscuro (última imagen), mostrar DualOverlay
      if (realm.id === 'realm-dark') {
        setShowDualOverlay(true);
      } else {
        // Para las otras imágenes, mostrar ImageOverlay normal
        setShowImageOverlay(true);
      }
    }
  };

  const handleImageClick = (realm: Realm) => {
    // Solo permitir click en la imagen si el hotspot aún no es visible
    const realmHotspot = realm.hotspots?.[0];
    if (realmHotspot && !visibleHotspots.has(realmHotspot.id)) {
      setSelectedRealm(realm);
      
      // Si es el Reino Oscuro (última imagen), mostrar DualOverlay
      if (realm.id === 'realm-dark') {
        setShowDualOverlay(true);
      } else {
        // Para las otras imágenes, mostrar ImageOverlay normal
        setShowImageOverlay(true);
      }
    }
  };

  const closeOverlay = () => {
    setShowGalaxyOverlay(false);
    setShowImageOverlay(false);
    setShowDualOverlay(false);
    setSelectedHotspot(null);
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
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3"
          >
            {realms.map((realm, index) => (
              <div key={realm.id} className="relative group">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  onClick={() => scrollToIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeIndex === index ? 'bg-accent scale-125' : 'bg-surface-2'
                  }`}
                  aria-label={`Navegar a ${realm.name}`}
                />
                {/* Tooltip */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  <div className="bg-surface-1 border border-border-default rounded-lg px-3 py-1.5 shadow-xl">
                    <p className="text-xs text-ink-primary">{realm.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Instructions - solo en el primer realm */}
      <AnimatePresence>
        {isInSection && activeIndex === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-accent"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
            <p className="text-sm text-ink-secondary bg-surface-1/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border-subtle">
              Desliza para explorar el universo
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Realms Container - fluye directamente en la página, sin scroll anidado */}
      <div ref={containerRef}>
        {realms.map((realm, index) => (
          <div key={realm.id} className="h-screen relative" data-snap-point data-index={index}>
            <RealmLevel
              realm={realm}
              isActive={activeIndex === index}
              index={index}
              onImageClick={handleImageClick}
            />
            
            {/* Hotspots - mismo inset que la imagen para alineamiento correcto */}
            {realm.hotspots && realm.hotspots.length > 0 && activeIndex === index && (
              <div className="absolute inset-0 z-30 pointer-events-none">
                {realm.hotspots.map((hotspot) => (
                  <div key={hotspot.id} className="pointer-events-auto">
                    <Hotspot
                      hotspot={hotspot}
                      onShowDetail={handleHotspotClick}
                      onVisible={() => handleHotspotVisible(hotspot.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Books Grid Section */}
        <div className="min-h-screen flex items-center justify-center p-6 bg-surface-1">
          <div className="max-w-6xl mx-auto w-full">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center"
            >
              La Saga Completa
            </motion.p>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-display font-black text-center mb-6 text-ink-primary"
            >
              Dioses Universales
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-ink-secondary max-w-2xl mx-auto mb-16"
            >
              Una saga que cuenta el ascenso, la conquista y los vínculos familiares 
              de los dioses regentes del universo. Siete libros que conforman una 
              historia épica sobre poder, familia y destino.
            </motion.p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {libros.map((libro, i) => (
                <motion.div
                  key={libro.titulo}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`
                    aspect-[2/3] rounded-lg flex flex-col items-center justify-center p-3 text-center
                    ${libro.actual 
                      ? 'bg-accent/20 border border-accent' 
                      : 'bg-surface-2 border border-border-subtle'}
                  `}
                >
                  <span className={`text-xs font-medium ${libro.actual ? 'text-accent' : 'text-ink-tertiary'}`}>
                    {libro.titulo}
                  </span>
                  <span className="text-[10px] mt-1 text-ink-muted">
                    {libro.estado}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Galaxy Overlay */}
      <GalaxyOverlay
        isVisible={showGalaxyOverlay}
        onClose={closeOverlay}
        svgPath="/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg"
      />

      {/* Image Overlay para imágenes individuales (Reino de la Luz y Reino Central) */}
      <ImageOverlay
        isVisible={showImageOverlay}
        onClose={closeOverlay}
        imagePath={selectedRealm?.backgroundImage || ''}
        title={selectedRealm?.title || ''}
      />

      {/* Dual Overlay para Reino Oscuro + Mapa de Galaxias */}
      <DualOverlay
        isVisible={showDualOverlay}
        onClose={closeOverlay}
        leftImagePath="/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg"
        rightImagePath="/landing-book-victoria/reino-oscuro.png"
        leftTitle="Mapa de Galaxias"
        rightTitle="Reino Oscuro"
      />
    </>
  );
}
