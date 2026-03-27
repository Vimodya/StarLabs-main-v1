import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  joinedDate: string;
  followedArtists: Artist[];
  cart: CartItem[];
  purchaseHistory: Purchase[];
  rewards: Reward[];
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  followers: number;
}

export interface CartItem {
  id: string;
  name: string;
  artist: string;
  price: number;
  type: 'NFT' | 'Token' | 'Bundle';
}

export interface Purchase {
  id: string;
  name: string;
  artist: string;
  price: number;
  type: 'NFT' | 'Token' | 'Bundle';
  purchaseDate: string;
  txHash: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  earned: boolean;
  earnedDate?: string;
  icon: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: '1',
  name: 'Alex Rivera',
  email: 'alex@starlabs.io',
  bio: 'Beauty enthusiast & NFT collector. Early adopter of the StarLabs ecosystem.',
  location: 'Los Angeles, CA',
  joinedDate: '2024-01-15',
  followedArtists: [
    { id: '1', name: 'Luna Beats', genre: 'Electronic', followers: 24500 },
    { id: '2', name: 'The Aura Collective', genre: 'Indie Pop', followers: 18200 },
    { id: '3', name: 'Cipher Wave', genre: 'Hip-Hop', followers: 52100 },
  ],
  cart: [
    { id: '1', name: 'Genesis Drop #047', artist: 'Luna Beats', price: 0.85, type: 'NFT' },
    { id: '2', name: 'Aura Bundle Pack', artist: 'The Aura Collective', price: 2.5, type: 'Bundle' },
  ],
  purchaseHistory: [
    { id: '1', name: 'Neon Dreams #012', artist: 'Cipher Wave', price: 1.2, type: 'NFT', purchaseDate: '2024-03-10', txHash: '5Kj9x...mPqR' },
    { id: '2', name: 'StarLabs Silver Pass', artist: 'StarLabs', price: 50, type: 'Token', purchaseDate: '2024-02-20', txHash: '8Yz3n...wQvL' },
    { id: '3', name: 'Frequency Pack', artist: 'Luna Beats', price: 3.0, type: 'Bundle', purchaseDate: '2024-01-30', txHash: '2Rt7k...xNbA' },
  ],
  rewards: [
    { id: '1', title: 'Early Adopter', description: 'Joined during the genesis phase', points: 500, earned: true, earnedDate: '2024-01-15', icon: '🌟' },
    { id: '2', title: 'First Purchase', description: 'Made your first purchase on StarLabs', points: 200, earned: true, earnedDate: '2024-01-30', icon: '🛒' },
    { id: '3', title: 'Social Butterfly', description: 'Follow 5 artists', points: 150, earned: false, icon: '🦋' },
    { id: '4', title: 'Diamond Collector', description: 'Own 10 NFTs simultaneously', points: 1000, earned: false, icon: '💎' },
    { id: '5', title: 'Loyal Fan', description: 'Be active for 6 consecutive months', points: 750, earned: false, icon: '🏆' },
  ],
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('starlabs_web_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('starlabs_web_user'); }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(res => setTimeout(res, 900));
    if (email && password.length >= 6) {
      const u = { ...MOCK_USER, email };
      setUser(u);
      localStorage.setItem('starlabs_web_user', JSON.stringify(u));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password.' };
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(res => setTimeout(res, 900));
    if (!name || !email || password.length < 6)
      return { success: false, error: 'Please fill all fields. Password must be at least 6 characters.' };
    const u: User = {
      ...MOCK_USER,
      id: Date.now().toString(),
      name,
      email,
      joinedDate: new Date().toISOString().split('T')[0],
      followedArtists: [],
      cart: [],
      purchaseHistory: [],
      rewards: [MOCK_USER.rewards[0]],
    };
    setUser(u);
    localStorage.setItem('starlabs_web_user', JSON.stringify(u));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('starlabs_web_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('starlabs_web_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
