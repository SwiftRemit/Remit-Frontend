import api from "./axios";

export const createWalletApi = () => api.post("/wallet/create");

export const fundWalletApi = (publicKey: string) =>
  api.post("/wallet/fund", { publicKey });

export const getBalanceApi = (publicKey: string) =>
  api.get(`/wallet/balance/${publicKey}`);
