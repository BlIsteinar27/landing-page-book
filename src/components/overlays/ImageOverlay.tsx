"use client";

import Image from "next/image";
import ZoomableOverlay from "./ZoomableOverlay";

interface ImageOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  imagePath: string;
  title: string;
}

export default function ImageOverlay({
  isVisible,
  onClose,
  imagePath,
  title,
}: ImageOverlayProps) {
  return (
    <ZoomableOverlay
      isVisible={isVisible}
      onClose={onClose}
      title={title}
      className="max-w-6xl max-h-[85vh] p-3 md:p-4"
    >
      <Image
        src={imagePath}
        alt={title}
        fill
        className="object-contain p-2 md:p-3"
        sizes="100vw"
      />
    </ZoomableOverlay>
  );
}
