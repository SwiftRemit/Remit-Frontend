import api from "./axios";

export const getTransactionsApi = (page = 1, limit = 10) =>
  api.get(`/transactions?page=${page}&limit=${limit}`);

export const getTransactionByIdApi = (id: string) =>
  api.get(`/transactions/${id}`);

export const getStellarHistoryApi = (publicKey: string, limit = 10) =>
  api.get(`/transactions/stellar/${publicKey}?limit=${limit}`);
