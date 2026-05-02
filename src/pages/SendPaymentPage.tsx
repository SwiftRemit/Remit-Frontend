import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { sendPaymentApi } from "@/api/payment.api";

interface PaymentForm {
  senderSecret: string;
  recipientPublicKey: string;
  amount: string;
  assetCode: string;
  memo: string;
}

export default function SendPaymentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<PaymentForm>({
    senderSecret: "",
    recipientPublicKey: "",
    amount: "",
    assetCode: "XLM",
    memo: "",
  });
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await sendPaymentApi(form);
      setTxHash(data.transaction.hash);
      toast.success("Payment sent successfully!");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (txHash) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card text-center space-y-4">
          <div className="text-5xl">✅</div>
          <h2 className="text-xl font-bold text-white">Payment Sent!</h2>
          <p className="text-gray-400 text-sm">Your transaction was submitted to the Stellar network.</p>
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Transaction Hash</p>
            <p className="text-xs text-primary-300 break-all font-mono">{txHash}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setTxHash(null); setForm({ senderSecret: "", recipientPublicKey: "", amount: "", assetCode: "XLM", memo: "" }); }}
              className="btn-primary flex-1"
            >
              Send Another
            </button>
            <button onClick={() => navigate("/transactions")} className="flex-1 border border-gray-700 rounded-lg py-2 text-gray-300 hover:text-white transition-colors">
              View Transactions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Send Payment</h1>
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Your Secret Key
              <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="S... (never stored)"
              value={form.senderSecret}
              onChange={(e) => setForm({ ...form, senderSecret: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Your secret key is used to sign the transaction and is never stored.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Recipient Public Key <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="G..."
              value={form.recipientPublicKey}
              onChange={(e) => setForm({ ...form, recipientPublicKey: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Amount <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.0000001"
                min="0.0000001"
                className="input-field"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Asset</label>
              <select
                className="input-field"
                value={form.assetCode}
                onChange={(e) => setForm({ ...form, assetCode: e.target.value })}
              >
                <option value="XLM">XLM</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Memo (optional)</label>
            <input
              type="text"
              className="input-field"
              placeholder="Payment for..."
              maxLength={28}
              value={form.memo}
              onChange={(e) => setForm({ ...form, memo: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
            {loading ? "Sending..." : "Send Payment ⚡"}
          </button>
        </form>
      </div>
    </div>
  );
}
