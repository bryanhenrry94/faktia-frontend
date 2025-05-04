"use client";

import { useMemo } from "react";

export const useSubdomain = (): string | null => {
  return useMemo(() => {
    if (typeof window === "undefined") return null;

    const hostname = window.location.hostname;

    // Ej: app.localhost => ["app", "localhost"]
    const parts = hostname.split(".");

    // Si estás usando .localhost o un dominio como app.misitio.com
    // entonces 'app' es el subdominio (cuando hay al menos 2 partes)
    if (parts.length >= 2) {
      return parts[0]; // El subdominio
    }

    return null; // No hay subdominio
  }, []);
};
