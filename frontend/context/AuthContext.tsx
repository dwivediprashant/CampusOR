"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Role = "user" | "admin" | "operator";

interface User {
  id: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // placeholder user (no backend yet)
      setUser({ id: "123", role: "user" });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setUser({ id: "123", role: "user" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return context;
};
