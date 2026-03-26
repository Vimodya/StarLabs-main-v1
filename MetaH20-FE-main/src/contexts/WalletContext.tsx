import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  publicKey: string | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Check for stored wallet on mount
  useEffect(() => {
    const storedWallet = localStorage.getItem('walletPublicKey');
    if (storedWallet) {
      setPublicKey(storedWallet);
      setConnected(true);
    }
  }, []);

  const connect = async () => {
    setConnecting(true);

    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo purposes, generate or use a mock public key
    // In production, this would connect to an actual Solana wallet
    const mockPublicKey = localStorage.getItem('walletPublicKey') ||
                          generateMockPublicKey();

    localStorage.setItem('walletPublicKey', mockPublicKey);
    setPublicKey(mockPublicKey);
    setConnected(true);
    setConnecting(false);
  };

  const disconnect = () => {
    localStorage.removeItem('walletPublicKey');
    setPublicKey(null);
    setConnected(false);
  };

  const value = {
    publicKey,
    connected,
    connecting,
    connect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Generate a mock Solana public key (base58 encoded, 32-44 characters)
function generateMockPublicKey(): string {
  const characters = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
