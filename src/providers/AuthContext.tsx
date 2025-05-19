"use client";
import { UserAuth } from "@/types";
import Cookies from "js-cookie";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";

// Nombre de la cookie donde almacenaremos el token
const TOKEN_COOKIE_NAME =
  process.env.AUTH_TOKEN_COOKIE_NAME || "auth_token_faktia";

/**
 * Shape of the authentication context
 */
export interface AuthContextType {
  user: UserAuth | null;
  token: string | null;
  login: (
    email: string,
    password: string,
    subdomain: string
  ) => Promise<boolean>;
  logout: () => void;
  validateToken: () => Promise<boolean>;
}

/**
 * Context instance – intentionally started as `undefined` so we can throw
 * a clear error if the consumer is outside the provider.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Wrap your application with this provider to make the auth context available.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserAuth | null>(null);
  const [token, setToken] = useState<string | null>(null);

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

  // memoise callbacks so they keep the same reference between renders
  const login = useCallback(
    async (email: string, password: string, subdomain: string) => {
      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/auth/login`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Tenant-Subdomain": subdomain,
      };

      const response = await axios.post(
        backendUrl,
        { email, password },
        { headers }
      );

      if (!response.status || response.status !== 200) {
        throw new Error("Credenciales incorrectas");
      }

      console.log("response: ", response.data);

      const { access_token } = response.data;

      // Guardar el token en la cookie
      if (access_token) {
        setAuthToken(access_token);
      }

      return true;
    },
    []
  );

  const logout = useCallback(() => {
    // Aquí puedes agregar lógica adicional para limpiar el estado de la aplicación
    setUser(null);
    removeAuthToken();
  }, []);

  // validate token en set user
  const validateToken = useCallback(async () => {
    if (!token) return false;

    const protocol = window.location.protocol;
    const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/auth/me`;

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(backendUrl, { headers });

    if (!response.status || response.status !== 200) {
      return false;
    }

    const user = response.data;

    // Guardar el token en la cookie
    if (user) {
      setUser(user);
    }

    return true;
  }, [token]);

  const value = useMemo<AuthContextType>(
    () => ({ user, token, login, logout, validateToken }),
    [user, token, login, logout, validateToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Convenience hook so that any component can access authentication data.
 * @throws Error if used outside <AuthProvider>
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)!;
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthContext };
