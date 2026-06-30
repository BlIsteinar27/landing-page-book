"use client";

import Image from "next/image";
import ZoomableOverlay from "./ZoomableOverlay";
import RealmInfoPanel from "./RealmInfoPanel";
import { RealmLore } from "@/config/realms-data";

interface ImageOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  imagePath: string;
  title: string;
  lore?: RealmLore;
}

export default function ImageOverlay({
  isVisible,
  onClose,
  imagePath,
  title,
  lore,
}: ImageOverlayProps) {
  return (
    <ZoomableOverlay
      isVisible={isVisible}
      onClose={onClose}
      title={title}
      className="max-w-6xl max-h-[85vh] p-3 md:p-4"
      header={
        <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none flex justify-between items-start p-4">
          {lore ? (
            <div className="pointer-events-auto">
              <RealmInfoPanel lore={lore} />
            </div>
          ) : (
            <div />
          )}
          <div className="bg-surface-1/95 backdrop-blur-sm rounded-b-lg px-6 py-3 border-b-2 border-x-2 border-accent shadow-lg [border-top:2px_solid_var(--color-surface-base)]">
            <h2 className="text-lg md:text-xl font-semibold text-ink-primary">
              {title}
            </h2>
          </div>
          <div className="w-10" />
        </div>
      }
    >
      <Image
        src={imagePath}
        alt={title}
        fill
        className="object-contain p-2 md:p-3"
        sizes="100vw"
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM2QxZjVjIi8+PC9zdmc+"
      />
    </ZoomableOverlay>
  );
}
