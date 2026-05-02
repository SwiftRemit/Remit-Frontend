import api from "./axios";

interface SendPaymentPayload {
  senderSecret: string;
  recipientPublicKey: string;
  amount: string;
  assetCode?: string;
  assetIssuer?: string;
  memo?: string;
}

export const sendPaymentApi = (data: SendPaymentPayload) =>
  api.post("/payments/send", data);
