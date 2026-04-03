import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import bs58 from "bs58";

const WalletButton = () => {
  const { publicKey, connected, connecting, disconnect, signMessage } = useWallet();
  const { setVisible } = useWalletModal();
  const { toast } = useToast();
  const { isAuthenticated, walletLogin, logout } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const handleAuthentication = async () => {
      // If wallet is connected, user is not authenticated, and we have signMessage
      if (connected && publicKey && signMessage && !isAuthenticated && !isAuthenticating) {
        setIsAuthenticating(true);
        try {
          const messageStr = `Sign this message to authenticate with StarLabs.\nNonce: ${Date.now()}`;
          const message = new TextEncoder().encode(messageStr);
          
          const signature = await signMessage(message);
          const signatureBase58 = bs58.encode(signature);
          
          const result = await walletLogin(publicKey.toBase58(), signatureBase58, messageStr);
          
          if (result.success) {
            toast({
              title: "Authenticated Successfully",
              description: "You are now logged in with your wallet.",
            });
          } else {
            toast({
              title: "Authentication Failed",
              description: result.error || "Could not authenticate wallet.",
              variant: "destructive",
            });
            disconnect();
          }
        } catch (error: any) {
          console.error("Signature error:", error);
          if (error?.message?.includes("User rejected")) {
            toast({
              title: "Authentication Cancelled",
              description: "You rejected the signature request.",
              variant: "destructive",
            });
          } else {
             toast({
              title: "Authentication Failed",
              description: "An error occurred during wallet signing.",
              variant: "destructive",
            });
          }
          disconnect();
        } finally {
          setIsAuthenticating(false);
        }
      }
    };

    handleAuthentication();
  }, [connected, publicKey, signMessage, isAuthenticated]);

  const handleClick = async () => {
    if (connected) {
      await disconnect();
      logout();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected and you have been logged out.",
      });
    } else {
      setVisible(true);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <Button
      onClick={handleClick}
      disabled={connecting || isAuthenticating}
      variant={connected ? "outline" : "default"}
      className={connected ? "border-primary/50" : "bg-gradient-primary hover:opacity-90"}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {connecting || isAuthenticating 
        ? "Connecting..." 
        : connected && publicKey 
          ? formatAddress(publicKey.toBase58()) 
          : "Connect Wallet"}
    </Button>
  );
};

export default WalletButton;
