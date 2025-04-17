"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

// Définition d'une interface pour le contexte d'authentification
interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

// Valeurs par défaut pour le contexte
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Erreur de parsing du user :", error);
        }
      }
      setLoading(false);
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
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
