import { useEffect, useLayoutEffect, useRef } from "react";

const FOCUSABLE =
  'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

/**
 * Contador global de diálogos abiertos: con overlays anidados
 * (DualOverlay + RealmInfoPanel) solo el último en cerrarse quita `inert`.
 */
let inertCount = 0;

interface UseDialogOptions {
  /**
   * Escuchar Escape en fase de captura y detener la propagación.
   * Úsalo en diálogos anidados para que Escape cierre solo el más interno.
   */
  capture?: boolean;
}

export function useDialog<T extends HTMLElement>(
  isOpen: boolean,
  onClose: () => void,
  { capture = false }: UseDialogOptions = {},
) {
  const ref = useRef<T>(null);
  const onCloseRef = useRef(onClose);

  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    const trigger = document.activeElement as HTMLElement | null;
    const main = document.getElementById("main-content");

    inertCount += 1;
    if (main) main.inert = true;

    ref.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (capture) e.stopImmediatePropagation();
      onCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown, capture);

    return () => {
      document.removeEventListener("keydown", onKeyDown, capture);
      inertCount -= 1;
      if (main && inertCount === 0) main.inert = false;
      trigger?.focus();
    };
  }, [isOpen, capture]);

  return ref;
}
