import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinedDate: string;
  followedArtists: Artist[];
  followedCelebrityList?: Celebrity[];
  buyProductList?: Product[];
  notifiedProductList?: Product[];
  orders?: Order[];
  cart: CartItem[];
  purchaseHistory: Purchase[];
  rewards: Reward[];
}

export interface Celebrity {
  id: string;
  _id?: string;
  name: string;
  category: string;
  profilePicture: string;
  isVerified: boolean;
}

export interface Product {
  id: string;
  _id?: string;
  name: string;
  title?: string;
  price: number;
  images: string[];
  image?: string;
  currency: string;
  category?: string;
  subtitle?: string;
  status?: string;
}

export interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id?: string;
  _id: string;
  products: OrderProduct[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  avatar: string;
  followers: number;
}

export interface CartItem {
  id: string;
  name: string;
  artist: string;
  price: number;
  image: string;
  type: 'NFT' | 'Token' | 'Bundle';
}

export interface Purchase {
  id: string;
  name: string;
  artist: string;
  price: number;
  image: string;
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
  walletLogin: (publicKey: string, signature: string, message: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Maps a raw API user object to our frontend User shape */
const mapApiUser = (apiUser: Record<string, unknown>): User => ({
  id: String(apiUser._id ?? apiUser.id ?? ''),
  name: String(apiUser.name ?? ''),
  email: String(apiUser.email ?? ''),
  avatar: apiUser.avatar ? String(apiUser.avatar) : '',
  bio: apiUser.bio ? String(apiUser.bio) : undefined,
  location: apiUser.location ? String(apiUser.location) : undefined,
  joinedDate: apiUser.createdAt
    ? new Date(String(apiUser.createdAt)).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0],
  followedArtists: Array.isArray(apiUser.followedArtists)
    ? (apiUser.followedArtists as Record<string, unknown>[]).map((a) => ({
      id: String(a._id ?? a.id ?? ''),
      name: String(a.name ?? ''),
      genre: String(a.genre ?? ''),
      avatar: String(a.avatar ?? ''),
      followers: Number(a.followers ?? 0),
    }))
    : [],
  followedCelebrityList: Array.isArray(apiUser.followedCelebrityList) ? apiUser.followedCelebrityList as Celebrity[] : [],
  buyProductList: Array.isArray(apiUser.buyProductList) ? apiUser.buyProductList as Product[] : [],
  notifiedProductList: Array.isArray(apiUser.notifiedProductList) ? apiUser.notifiedProductList as Product[] : [],
  orders: Array.isArray(apiUser.orders) ? apiUser.orders as Order[] : [],
  cart: [],
  purchaseHistory: [],
  rewards: [],
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('starlabs_user');
    const token = localStorage.getItem('starlabs_token');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
        // Re-fetch fresh profile in the background
        axiosInstance.get('/user/profile').then((res) => {
          const fresh = mapApiUser(res.data.user ?? res.data);
          setUser(fresh);
          localStorage.setItem('starlabs_user', JSON.stringify(fresh));
        }).catch(() => {
          // Token likely expired; clear session
          localStorage.removeItem('starlabs_user');
          localStorage.removeItem('starlabs_token');
          setUser(null);
        });
      } catch {
        localStorage.removeItem('starlabs_user');
        localStorage.removeItem('starlabs_token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      const { token, user: apiUser } = res.data;
      const mapped = mapApiUser(apiUser);
      localStorage.setItem('starlabs_token', token);
      localStorage.setItem('starlabs_user', JSON.stringify(mapped));
      setUser(mapped);
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message || 'Login failed.' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!name || !email || password.length < 6)
      return { success: false, error: 'Please fill all fields. Password must be at least 6 characters.' };
    try {
      const res = await axiosInstance.post('/auth/register', { name, email, password });
      const { token, user: apiUser } = res.data;
      const mapped = mapApiUser(apiUser);
      localStorage.setItem('starlabs_token', token);
      localStorage.setItem('starlabs_user', JSON.stringify(mapped));
      setUser(mapped);
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message || 'Signup failed.' };
    }
  };

  const walletLogin = async (publicKey: string, signature: string, message: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { walletLoginApi } = await import('@/services/api');
      const res = await walletLoginApi({ publicKey, signature, message });
      const { token, user: apiUser } = res;
      const mapped = mapApiUser(apiUser);
      localStorage.setItem('starlabs_token', token);
      localStorage.setItem('starlabs_user', JSON.stringify(mapped));
      setUser(mapped);
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message || 'Wallet login failed.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('starlabs_user');
    localStorage.removeItem('starlabs_token');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('starlabs_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, walletLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
