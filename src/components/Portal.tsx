"use client";

import { ReactNode, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};

/**
 * Renderiza los hijos directamente en <body>, fuera de <main>,
 * para que `inert` en el contenido principal no desactive los overlays.
 */
export default function Portal({ children }: { children: ReactNode }) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return isClient ? createPortal(children, document.body) : null;
}
