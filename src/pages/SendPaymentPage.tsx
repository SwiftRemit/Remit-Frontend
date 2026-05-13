import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { buildPaymentApi, submitPaymentApi } from "@/api/payment.api";
import { useFreighter } from "@/hooks/useFreighter";
import { useAuthStore } from "@/store/authStore";

interface PaymentForm {
  recipientPublicKey: string;
  amount: string;
  assetCode: string;
  memo: string;
}

type Step = "form" | "signing" | "success";

export default function SendPaymentPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const freighter = useFreighter();

  const [form, setForm] = useState<PaymentForm>({
    recipientPublicKey: "",
    amount: "",
    assetCode: "XLM",
    memo: "",
  });

  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Derive sender public key — prefer Freighter, fall back to managed wallet
  const senderPublicKey = freighter.isConnected
    ? freighter.publicKey
    : user?.stellarPublicKey ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderPublicKey) {
      toast.error("Connect a wallet first before sending a payment.");
      return;
    }

    setLoading(true);
    try {
      // ── Step 1: Build unsigned XDR on backend ──────────────────────────
      const { data: buildData } = await buildPaymentApi({
        senderPublicKey,
        recipientPublicKey: form.recipientPublicKey,
        amount: form.amount,
        assetCode: form.assetCode,
        memo: form.memo,
      });

      const unsignedXdr: string = buildData.xdr;

      // ── Step 2: Sign with Freighter (secret key stays in browser) ──────
      setStep("signing");

      if (!window.freighter) {
        throw new Error("Freighter extension not found. Please install Freighter to send payments.");
      }

      const network = freighter.network ?? "TESTNET";
      const signedXdr = await window.freighter.signTransaction(unsignedXdr, {
        network,
      });

      // ── Step 3: Submit signed XDR to backend ───────────────────────────
      const { data: submitData } = await submitPaymentApi({
        signedXdr,
        senderPublicKey,
        recipientPublicKey: form.recipientPublicKey,
        amount: form.amount,
        assetCode: form.assetCode,
        memo: form.memo,
      });

      setTxHash(submitData.transaction.hash);
      setStep("success");
      toast.success("Payment sent successfully!");
    } catch (err: unknown) {
      setStep("form");
      const error = err as { message?: string; response?: { data?: { message?: string } } };
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Payment failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep("form");
    setTxHash(null);
    setForm({ recipientPublicKey: "", amount: "", assetCode: "XLM", memo: "" });
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (step === "success" && txHash) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card text-center space-y-5">
          <div className="text-5xl">✅</div>
          <h2 className="text-xl font-bold text-white">Payment Sent!</h2>
          <p className="text-gray-400 text-sm">
            Your transaction was confirmed on the Stellar network.
          </p>
          <div className="bg-gray-800 rounded-lg p-3 text-left">
            <p className="text-xs text-gray-400 mb-1">Transaction Hash</p>
            <p className="text-xs text-primary-300 break-all font-mono">{txHash}</p>
          </div>
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-primary-400 hover:underline"
          >
            View on Stellar Explorer →
          </a>
          <div className="flex gap-3 pt-2">
            <button onClick={resetForm} className="btn-primary flex-1">
              Send Another
            </button>
            <button
              onClick={() => navigate("/transactions")}
              className="flex-1 border border-gray-700 rounded-lg py-2 text-gray-300 hover:text-white transition-colors"
            >
              View History
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Signing screen ───────────────────────────────────────────────────────
  if (step === "signing") {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card text-center space-y-4 py-10">
          <div className="text-4xl animate-float inline-block">🦊</div>
          <h2 className="text-lg font-semibold text-white">Waiting for Freighter</h2>
          <p className="text-sm text-gray-400">
            Check your Freighter extension and approve the transaction.
            <br />Your secret key never leaves your device.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="w-3 h-3 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
            Waiting for signature...
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ────────────────────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Send Payment</h1>
        <p className="text-gray-400 text-sm mt-1">
          Transactions are signed by your wallet — your secret key is never shared.
        </p>
      </div>

      {/* Wallet status banner */}
      {!senderPublicKey ? (
        <div className="card border-yellow-700/50 bg-yellow-900/10 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="text-sm font-medium text-yellow-300">No wallet connected</p>
            <p className="text-xs text-gray-400 mt-0.5">
              You need a connected wallet to send payments.
            </p>
            <Link to="/wallet" className="text-xs text-primary-400 hover:underline mt-1 inline-block">
              Connect wallet →
            </Link>
          </div>
        </div>
      ) : (
        <div className="card border-green-700/40 bg-green-900/10 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-green-400 font-medium">
              {freighter.isConnected ? "Freighter wallet" : "Managed wallet"}
            </p>
            <p className="text-xs text-gray-400 font-mono truncate">{senderPublicKey}</p>
          </div>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">

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
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Memo <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Payment for..."
              maxLength={28}
              value={form.memo}
              onChange={(e) => setForm({ ...form, memo: e.target.value })}
            />
          </div>

          {/* Security note */}
          <div className="flex items-start gap-2 bg-gray-800/50 rounded-lg px-3 py-2.5">
            <span className="text-green-400 text-sm flex-shrink-0">🔒</span>
            <p className="text-xs text-gray-400">
              Your transaction will be signed by{" "}
              <span className="text-white font-medium">Freighter</span> in your browser.
              Your secret key never leaves your device or touches our servers.
            </p>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            disabled={loading || !senderPublicKey}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <span>⚡</span> Send Payment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
