"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import dynamic from "next/dynamic";

const CompraDialog = dynamic(() => import("@/components/CompraDialog"));

const CompraDialogContext = createContext<(() => void) | null>(null);

export function useCompraDialog() {
  const ctx = useContext(CompraDialogContext);
  if (!ctx)
    throw new Error(
      "useCompraDialog debe usarse dentro de CompraDialogProvider",
    );
  return ctx;
}

export function CompraDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <CompraDialogContext value={() => setOpen(true)}>
      {children}
      <CompraDialog open={open} onClose={() => setOpen(false)} />
    </CompraDialogContext>
  );
}
