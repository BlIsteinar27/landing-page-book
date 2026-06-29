interface ImageErrorFallbackProps {
  message?: string;
}

export default function ImageErrorFallback({
  message = "Imagen no disponible",
}: ImageErrorFallbackProps) {
  return (
    <div className="absolute inset-0 bg-surface-2 flex items-center justify-center">
      <div className="text-center">
        <svg
          className="w-12 h-12 text-ink-muted mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm text-ink-muted">{message}</p>
      </div>
    </div>
  );
}
