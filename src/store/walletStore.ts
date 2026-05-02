import { create } from "zustand";

interface Balance {
  asset: string;
  balance: string;
  assetIssuer: string | null;
}

interface WalletState {
  publicKey: string | null;
  balances: Balance[];
  isLoading: boolean;
  setPublicKey: (key: string) => void;
  setBalances: (balances: Balance[]) => void;
  setLoading: (loading: boolean) => void;
  clearWallet: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  publicKey: null,
  balances: [],
  isLoading: false,
  setPublicKey: (key) => set({ publicKey: key }),
  setBalances: (balances) => set({ balances }),
  setLoading: (isLoading) => set({ isLoading }),
  clearWallet: () => set({ publicKey: null, balances: [] }),
}));
