"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// Simplified wallet context — no external deps, works without WalletConnect
// WalletConnect integration will use the user's injected provider (MetaMask, OKX Wallet)

interface WalletState {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletState>({
  address: null,
  balance: null,
  chainId: null,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<any>(null);

  // Check if already connected on mount
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAddress(null);
        setBalance(null);
        setChainId(null);
      } else {
        setAddress(accounts[0]);
        updateBalance(accounts[0]);
      }
    };
    const handleChainChanged = () => {
      if (address) updateBalance(address);
    };
    window.ethereum?.on?.("accountsChanged", handleAccountsChanged);
    window.ethereum?.on?.("chainChanged", handleChainChanged);
    setProvider(window.ethereum);
    // Check if already connected
    window.ethereum?.request?.({ method: "eth_accounts" }).then((accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        updateBalance(accounts[0]);
        window.ethereum?.request?.({ method: "eth_chainId" }).then((id: string) => setChainId(parseInt(id, 16)));
      }
    });
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
    };
  }, []);

  const updateBalance = async (addr: string) => {
    try {
      if (!provider) return;
      // Get balance in wei, convert to ETH
      const bal = await provider.request({ method: "eth_getBalance", params: [addr, "latest"] });
      const eth = parseInt(bal, 16) / 1e18;
      setBalance(eth.toFixed(4));
    } catch {
      setBalance(null);
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const chain = await window.ethereum.request({ method: "eth_chainId" });
      setAddress(accounts[0]);
      setChainId(parseInt(chain, 16));
      await updateBalance(accounts[0]);
    } catch (e) {
      console.error("Wallet connect failed", e);
    }
    setIsConnecting(false);
  };

  const disconnect = () => {
    setAddress(null);
    setBalance(null);
    setChainId(null);
  };

  return (
    <WalletContext.Provider value={{ address, balance, chainId, connect, disconnect, isConnecting }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);