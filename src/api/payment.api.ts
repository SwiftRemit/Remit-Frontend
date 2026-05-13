import api from "./axios";

interface BuildPaymentPayload {
  senderPublicKey: string;
  recipientPublicKey: string;
  amount: string;
  assetCode?: string;
  assetIssuer?: string;
  memo?: string;
}

interface SubmitPaymentPayload {
  signedXdr: string;
  senderPublicKey: string;
  recipientPublicKey: string;
  amount: string;
  assetCode?: string;
  memo?: string;
}

// Step 1 — ask backend to build unsigned XDR
export const buildPaymentApi = (data: BuildPaymentPayload) =>
  api.post("/payments/build", data);

// Step 2 — submit Freighter-signed XDR to backend
export const submitPaymentApi = (data: SubmitPaymentPayload) =>
  api.post("/payments/submit", data);
