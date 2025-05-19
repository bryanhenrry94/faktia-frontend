import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { UserAuth } from "@/types";
import axios from "axios";

// Nombre de la cookie donde almacenaremos el token
const TOKEN_COOKIE_NAME =
  process.env.AUTH_TOKEN_COOKIE_NAME || "auth_token_faktia";

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserAuth | null>(null);

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

  const fetchUserData = React.useCallback(async () => {
    if (!token) {
      return;
    }

    const protocol = window.location.protocol;
    const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/auth/me`;

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(backendUrl, { headers });
      console.log("response: ", response);

      if (!response.status || response.status !== 200) {
        throw new Error("Credenciales incorrectas");
      }

      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [token]);

  return {
    token,
    user,
    setAuthToken,
    setUser,
    removeAuthToken,
    fetchUserData,
  };
}
