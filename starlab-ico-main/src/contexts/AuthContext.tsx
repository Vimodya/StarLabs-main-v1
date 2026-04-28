import React, { createContext, useContext, ReactNode } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinedDate: string;
}

interface AuthContextType {
  userAddress: string | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { publicKey, connected, disconnect } = useWallet();

  const userAddress = publicKey ? publicKey.toBase58() : null;
  const isAuthenticated = connected && !!publicKey;

  const logout = () => {
    disconnect();
  };

  return (
    <AuthContext.Provider value={{ userAddress, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
