"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

// Définition d'une interface pour le contexte d'authentification
interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
}

// Valeurs par défaut pour le contexte
const defaultAuthContext: AuthContextType = {
  user: null,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  // Charger l'utilisateur depuis le localStorage lors du montage du composant
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Erreur lors du parsing de l'utilisateur stocké :", error);
        }
      }
    }
  }, []);

  // Fonction pour connecter l'utilisateur
  const login = (userData: any) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Fonction pour déconnecter l'utilisateur
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
