import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";

const WalletButton = () => {
  const { publicKey, connected, connecting, connect, disconnect } = useWallet();
  const { toast } = useToast();

  const handleClick = async () => {
    if (connected) {
      disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } else {
      try {
        await connect();
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to your wallet",
        });
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet",
          variant: "destructive",
        });
      }
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <Button
      onClick={handleClick}
      disabled={connecting}
      variant={connected ? "outline" : "default"}
      className={connected ? "border-primary/50" : "bg-gradient-primary hover:opacity-90"}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {connecting ? "Connecting..." : connected && publicKey ? formatAddress(publicKey) : "Connect Wallet"}
    </Button>
  );
};

export default WalletButton;
