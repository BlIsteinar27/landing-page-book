"use client";

import Image from "next/image";
import { useId } from "react";
import ZoomableOverlay from "./ZoomableOverlay";
import RealmInfoPanel from "./RealmInfoPanel";
import { RealmLore } from "@/config/realms-data";

interface ImageOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  imagePath: string;
  title: string;
  lore?: RealmLore;
  /** Fracción del marco (0-1) que el mapa cubre al abrirse */
  initialFill?: number;
}

export default function ImageOverlay({
  isVisible,
  onClose,
  imagePath,
  title,
  lore,
  initialFill = 0.8,
}: ImageOverlayProps) {
  const titleId = useId();

  return (
    <ZoomableOverlay
      isVisible={isVisible}
      onClose={onClose}
      title={title}
      titleId={titleId}
      className="max-w-6xl max-h-[85vh] p-3 md:p-4"
      initialFill={initialFill}
      header={
        <div className="absolute top-0 inset-x-0 z-30 pointer-events-none flex justify-center">
          <div className="bg-surface-1/95 backdrop-blur-sm rounded-b-lg px-6 py-3 border-b border-x border-accent-glow shadow-lg">
            <h2
              id={titleId}
              className="text-lg md:text-xl font-semibold text-ink-primary text-center"
            >
              {title}
            </h2>
          </div>
        </div>
      }
      extraControls={
        lore ? (
          <div className="absolute top-4 left-4 pointer-events-auto">
            <RealmInfoPanel lore={lore} />
          </div>
        ) : undefined
      }
    >
      <Image
        src={imagePath}
        alt={title}
        fill
        className="object-contain p-2 md:p-3"
        // Sin optimizar: el zoom (hasta 3x) escala píxeles de la imagen cargada;
        // servir el archivo original evita pixelar al acercar
        unoptimized
        sizes="100vw"
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM2QxZjVjIi8+PC9zdmc+"
      />
    </ZoomableOverlay>
  );
}
