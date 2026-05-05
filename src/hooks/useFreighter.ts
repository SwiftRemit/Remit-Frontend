import { useState, useEffect, useCallback } from "react";

// Freighter injects window.freighter — we type just what we need
interface FreighterAPI {
  isConnected: () => Promise<boolean>;
  getPublicKey: () => Promise<string>;
  isAllowed: () => Promise<boolean>;
  setAllowed: () => Promise<boolean>;
  getNetwork: () => Promise<string>;
  getNetworkDetails: () => Promise<{ network: string; networkPassphrase: string }>;
  signTransaction: (xdr: string, opts?: { network?: string; networkPassphrase?: string }) => Promise<string>;
}

declare global {
  interface Window {
    freighter?: FreighterAPI;
  }
}

export type FreighterStatus =
  | "checking"
  | "not_installed"
  | "not_connected"
  | "connecting"
  | "connected"
  | "error";

export interface UseFreighterReturn {
  status: FreighterStatus;
  publicKey: string | null;
  network: string | null;
  error: string | null;
  isInstalled: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export function useFreighter(): UseFreighterReturn {
  const [status, setStatus] = useState<FreighterStatus>("checking");
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check on mount if Freighter is installed and already allowed
  useEffect(() => {
    const check = async () => {
      if (!window.freighter) {
        setStatus("not_installed");
        return;
      }
      try {
        const allowed = await window.freighter.isAllowed();
        if (allowed) {
          const key = await window.freighter.getPublicKey();
          const net = await window.freighter.getNetwork();
          setPublicKey(key);
          setNetwork(net);
          setStatus("connected");
        } else {
          setStatus("not_connected");
        }
      } catch {
        setStatus("not_connected");
      }
    };
    check();
  }, []);

  const connect = useCallback(async () => {
    if (!window.freighter) {
      setError("Freighter is not installed.");
      setStatus("not_installed");
      return;
    }
    setStatus("connecting");
    setError(null);
    try {
      await window.freighter.setAllowed();
      const key = await window.freighter.getPublicKey();
      const net = await window.freighter.getNetwork();
      setPublicKey(key);
      setNetwork(net);
      setStatus("connected");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Connection rejected";
      setError(msg);
      setStatus("error");
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    setNetwork(null);
    setStatus("not_connected");
    setError(null);
  }, []);

  return {
    status,
    publicKey,
    network,
    error,
    isInstalled: status !== "not_installed" && status !== "checking",
    isConnected: status === "connected",
    connect,
    disconnect,
  };
}
