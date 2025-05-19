"use client";
import React from "react";
import { AuthContext, AuthContextType } from "@/providers/AuthContext"; // Adjust the path based on your project structure

const SecurePage = () => {
  const authContext = React.useContext(AuthContext) as AuthContextType | null;

  if (!authContext) {
    return <div>Error: AuthContext is not available</div>;
  }

  const { user } = authContext as AuthContextType;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-800 font-sans text-xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">
          Hola, {user?.name || "Bienvenido a la aplicación"}
        </h1>
        <p className="text-gray-600">Estamos encantados de tenerte aquí.</p>
      </div>
    </div>
  );
};

export default SecurePage;
