"use client";

import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { useCallback } from "react";

type DisplayMethod = "swal" | "toast" | "console";

interface UseAxiosErrorHandlerOptions {
  display?: DisplayMethod;
  toast?: (message: string) => void;
  onUnauthorized?: () => void; // útil para redireccionar al login
}

export const useAxiosErrorHandler = (options?: UseAxiosErrorHandlerOptions) => {
  const { display = "swal", toast, onUnauthorized } = options || {};

  const getMessageFromStatus = (status?: number): string => {
    switch (status) {
      case 400:
        return "Solicitud incorrecta.";
      case 401:
        return "No estás autorizado. Por favor, inicia sesión.";
      case 403:
        return "Acceso prohibido.";
      case 404:
        return "Recurso no encontrado.";
      case 422:
        return "Datos inválidos. Verifica los campos.";
      case 500:
        return "Error interno del servidor.";
      default:
        return "Ocurrió un error inesperado.";
    }
  };

  const handleError = useCallback(
    (error: unknown) => {
      let message = "Ocurrió un error inesperado.";
      let status: number | undefined;

      if (error && typeof error === "object" && "isAxiosError" in error) {
        const axiosError = error as AxiosError;

        status = axiosError.response?.status;
        const apiMessage = (axiosError.response?.data as { message?: string })
          ?.message;

        message = apiMessage || getMessageFromStatus(status);

        if (status === 401 && onUnauthorized) {
          onUnauthorized();
        }
      }

      // Mostrar el mensaje
      switch (display) {
        case "swal":
          Swal.fire("Error", message, "error");
          break;
        case "toast":
          toast?.(message);
          break;
        case "console":
        default:
          console.error(`Error (${status}): ${message}`);
          break;
      }
    },
    [display, toast, onUnauthorized]
  );

  return handleError;
};
