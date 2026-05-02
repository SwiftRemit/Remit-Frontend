import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { createWalletApi, fundWalletApi, getBalanceApi } from "@/api/wallet.api";

interface Balance {
  asset: string;
  balance: string;
}

interface NewWallet {
  publicKey: string;
  secretKey: string;
}

export default function WalletPage() {
  const { user, updateUser } = useAuthStore();
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);
  const [newWallet, setNewWallet] = useState<NewWallet | null>(null);
  const [funding, setFunding] = useState(false);

  const fetchBalances = async (publicKey: string) => {
    try {
      const { data } = await getBalanceApi(publicKey);
      setBalances(data.balances);
    } catch {
      setBalances([]);
    }
  };

  useEffect(() => {
    if (user?.stellarPublicKey) {
      fetchBalances(user.stellarPublicKey);
    }
  }, [user?.stellarPublicKey]);

  const handleCreateWallet = async () => {
    setLoading(true);
    try {
      const { data } = await createWalletApi();
      setNewWallet({ publicKey: data.publicKey, secretKey: data.secretKey });
      updateUser({ stellarPublicKey: data.publicKey });
      toast.success("Wallet created! Save your secret key now.");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleFundWallet = async () => {
    if (!user?.stellarPublicKey) return;
    setFunding(true);
    try {
      await fundWalletApi(user.stellarPublicKey);
      toast.success("Testnet account funded with 10,000 XLM!");
      await fetchBalances(user.stellarPublicKey);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Funding failed");
    } finally {
      setFunding(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
        <p className="text-gray-400 mt-1">Manage your Stellar wallet</p>
      </div>

      {/* New wallet reveal */}
      {newWallet && (
        <div className="card border-yellow-700 bg-yellow-900/10">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-400 mb-2">Save your secret key now!</h3>
              <p className="text-sm text-gray-400 mb-3">This is the only time your secret key will be shown. Store it securely.</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Public Key</p>
                  <p className="text-xs font-mono text-white bg-gray-800 p-2 rounded break-all">{newWallet.publicKey}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Secret Key (shown once)</p>
                  <p className="text-xs font-mono text-yellow-300 bg-gray-800 p-2 rounded break-all">{newWallet.secretKey}</p>
                </div>
              </div>
              <button onClick={() => setNewWallet(null)} className="mt-3 text-sm text-gray-400 hover:text-white transition-colors">
                I've saved my key ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet info */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Stellar Wallet</h2>
        {user?.stellarPublicKey ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Public Key</p>
              <p className="text-sm font-mono text-white bg-gray-800 p-3 rounded break-all">
                {user.stellarPublicKey}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-300">Balances</p>
                <button
                  onClick={() => fetchBalances(user.stellarPublicKey!)}
                  className="text-xs text-primary-400 hover:underline"
                >
                  Refresh
                </button>
              </div>
              {balances.length > 0 ? (
                <div className="space-y-2">
                  {balances.map((b) => (
                    <div key={b.asset} className="flex justify-between items-center bg-gray-800 rounded-lg px-4 py-3">
                      <span className="text-gray-300 font-medium">{b.asset}</span>
                      <span className="text-white font-semibold">{parseFloat(b.balance).toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No balances. Fund your wallet below.</p>
              )}
            </div>
            <button
              onClick={handleFundWallet}
              disabled={funding}
              className="btn-primary w-full"
            >
              {funding ? "Funding..." : "Fund with Testnet XLM (Friendbot)"}
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-400 mb-4">You don't have a Stellar wallet yet.</p>
            <button onClick={handleCreateWallet} disabled={loading} className="btn-primary px-8">
              {loading ? "Creating..." : "Create Stellar Wallet"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
