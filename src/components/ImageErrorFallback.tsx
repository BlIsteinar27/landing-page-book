import { ImageOff } from "lucide-react";

interface ImageErrorFallbackProps {
  message?: string;
}

export default function ImageErrorFallback({
  message = "Imagen no disponible",
}: ImageErrorFallbackProps) {
  return (
    <div className="absolute inset-0 bg-surface-2 flex items-center justify-center">
      <div className="text-center">
        <ImageOff
          className="w-12 h-12 text-ink-secondary mx-auto mb-2"
          strokeWidth={2}
          nonScalingStroke
          aria-hidden
        />
        <p className="text-sm text-ink-secondary">{message}</p>
      </div>
    </div>
  );
}
