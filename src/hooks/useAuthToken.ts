import { useState, useEffect } from "react";
import Cookies from "js-cookie";

// Nombre de la cookie donde almacenaremos el token
const TOKEN_COOKIE_NAME =
  process.env.AUTH_TOKEN_COOKIE_NAME || "auth_token_faktia";

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);

  // Recupera el token desde las cookies al montar el componente
  useEffect(() => {
    const storedToken = Cookies.get(TOKEN_COOKIE_NAME);
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Función para almacenar el token en la cookie
  const setAuthToken = (newToken: string) => {
    // Guardar el token en la cookie con un tiempo de expiración (ejemplo: 1 día)
    Cookies.set(TOKEN_COOKIE_NAME, newToken, { expires: 1 });
    setToken(newToken); // Actualizar el estado
  };

  // Función para eliminar el token de la cookie
  const removeAuthToken = () => {
    Cookies.remove(TOKEN_COOKIE_NAME);
    setToken(null); // Borrar el estado
  };

  return {
    token,
    setAuthToken,
    removeAuthToken,
  };
}
