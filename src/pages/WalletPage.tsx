import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { createWalletApi, fundWalletApi, getBalanceApi } from "@/api/wallet.api";
import { useFreighter } from "@/hooks/useFreighter";

interface Balance {
  asset: string;
  balance: string;
}

interface NewWallet {
  publicKey: string;
  secretKey: string;
}

// ── Copy-to-clipboard helper ──
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="text-xs text-primary-400 hover:text-primary-300 transition-colors ml-2 flex-shrink-0"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

export default function WalletPage() {
  const { user, updateUser } = useAuthStore();
  const freighter = useFreighter();

  const [balances, setBalances] = useState<Balance[]>([]);
  const [freighterBalances, setFreighterBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);
  const [funding, setFunding] = useState(false);
  const [newWallet, setNewWallet] = useState<NewWallet | null>(null);
  const [activeTab, setActiveTab] = useState<"freighter" | "managed">("freighter");

  // Load managed wallet balances
  const fetchBalances = async (publicKey: string) => {
    try {
      const { data } = await getBalanceApi(publicKey);
      setBalances(data.balances);
    } catch {
      setBalances([]);
    }
  };

  // Load Freighter wallet balances from backend
  const fetchFreighterBalances = async (publicKey: string) => {
    try {
      const { data } = await getBalanceApi(publicKey);
      setFreighterBalances(data.balances);
    } catch {
      setFreighterBalances([]);
    }
  };

  useEffect(() => {
    if (user?.stellarPublicKey) fetchBalances(user.stellarPublicKey);
  }, [user?.stellarPublicKey]);

  useEffect(() => {
    if (freighter.isConnected && freighter.publicKey) {
      fetchFreighterBalances(freighter.publicKey);
    }
  }, [freighter.isConnected, freighter.publicKey]);

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

  const handleFundWallet = async (publicKey: string) => {
    setFunding(true);
    try {
      await fundWalletApi(publicKey);
      toast.success("Testnet account funded with 10,000 XLM!");
      await fetchBalances(publicKey);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Funding failed");
    } finally {
      setFunding(false);
    }
  };

  const handleConnectFreighter = async () => {
    await freighter.connect();
    if (freighter.status !== "error") {
      toast.success("Freighter wallet connected!");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
        <p className="text-gray-400 mt-1">Connect or manage your Stellar wallet</p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-gray-800 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("freighter")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "freighter"
              ? "bg-primary-600 text-white shadow"
              : "text-gray-400 hover:text-white"
          }`}
        >
          🦊 Freighter Wallet
        </button>
        <button
          onClick={() => setActiveTab("managed")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "managed"
              ? "bg-primary-600 text-white shadow"
              : "text-gray-400 hover:text-white"
          }`}
        >
          🔑 Managed Wallet
        </button>
      </div>

      {/* ── Freighter Tab ── */}
      {activeTab === "freighter" && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                🦊
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Freighter Browser Wallet</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Connect your existing Stellar wallet via the Freighter browser extension. Your keys never leave your device.
                </p>
              </div>
            </div>

            {/* Not installed */}
            {freighter.status === "not_installed" && (
              <div className="space-y-4">
                <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-4 flex gap-3">
                  <span className="text-yellow-400 text-lg flex-shrink-0">⚠️</span>
                  <div>
                    <p className="text-sm font-medium text-yellow-300">Freighter not detected</p>
                    <p className="text-xs text-gray-400 mt-1">Install the Freighter extension to connect your Stellar wallet directly.</p>
                  </div>
                </div>
                <a
                  href="https://www.freighter.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center block py-3"
                >
                  Install Freighter Extension →
                </a>
              </div>
            )}

            {/* Checking */}
            {freighter.status === "checking" && (
              <p className="text-sm text-gray-400">Checking for Freighter...</p>
            )}

            {/* Not connected */}
            {(freighter.status === "not_connected" || freighter.status === "error") && (
              <div className="space-y-3">
                {freighter.error && (
                  <div className="bg-red-900/20 border border-red-700/40 rounded-lg p-3 text-sm text-red-400">
                    {freighter.error}
                  </div>
                )}
                <button
                  onClick={handleConnectFreighter}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  <span>🔗</span> Connect Freighter Wallet
                </button>
              </div>
            )}

            {/* Connecting */}
            {freighter.status === "connecting" && (
              <div className="flex items-center gap-3 py-3">
                <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Waiting for Freighter approval...</p>
              </div>
            )}

            {/* Connected */}
            {freighter.isConnected && freighter.publicKey && (
              <div className="space-y-4">
                {/* Status badge */}
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-green-400 font-medium">Connected</span>
                  {freighter.network && (
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full ml-auto">
                      {freighter.network}
                    </span>
                  )}
                </div>

                {/* Public key */}
                <div>
                  <p className="text-xs text-gray-400 mb-1">Public Key</p>
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2.5">
                    <p className="text-xs font-mono text-white break-all flex-1">{freighter.publicKey}</p>
                    <CopyButton text={freighter.publicKey} />
                  </div>
                </div>

                {/* Balances */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-300">Balances</p>
                    <button
                      onClick={() => fetchFreighterBalances(freighter.publicKey!)}
                      className="text-xs text-primary-400 hover:underline"
                    >
                      Refresh
                    </button>
                  </div>
                  {freighterBalances.length > 0 ? (
                    <div className="space-y-2">
                      {freighterBalances.map((b) => (
                        <div key={b.asset} className="flex justify-between items-center bg-gray-800 rounded-lg px-4 py-3">
                          <span className="text-gray-300 font-medium">{b.asset}</span>
                          <span className="text-white font-semibold">{parseFloat(b.balance).toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No balances found on this network.</p>
                  )}
                </div>

                {/* Fund testnet */}
                <button
                  onClick={() => handleFundWallet(freighter.publicKey!)}
                  disabled={funding}
                  className="btn-primary w-full"
                >
                  {funding ? "Funding..." : "Fund with Testnet XLM (Friendbot)"}
                </button>

                {/* Disconnect */}
                <button
                  onClick={freighter.disconnect}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Disconnect wallet
                </button>
              </div>
            )}
          </div>

          {/* Info card */}
          <div className="card bg-primary-900/10 border-primary-800/30">
            <h3 className="text-sm font-semibold text-primary-300 mb-2">Why use Freighter?</h3>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li className="flex gap-2"><span className="text-green-400">✓</span> Your private keys never leave your device</li>
              <li className="flex gap-2"><span className="text-green-400">✓</span> Sign transactions securely in the browser</li>
              <li className="flex gap-2"><span className="text-green-400">✓</span> Works with existing Stellar accounts</li>
              <li className="flex gap-2"><span className="text-green-400">✓</span> Supports Testnet and Mainnet</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── Managed Wallet Tab ── */}
      {activeTab === "managed" && (
        <div className="space-y-4">

          {/* New wallet secret reveal */}
          {newWallet && (
            <div className="card border-yellow-700 bg-yellow-900/10">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-400 mb-2">Save your secret key now!</h3>
                  <p className="text-sm text-gray-400 mb-3">This is the only time your secret key will be shown.</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Public Key</p>
                      <div className="flex items-center bg-gray-800 p-2 rounded">
                        <p className="text-xs font-mono text-white break-all flex-1">{newWallet.publicKey}</p>
                        <CopyButton text={newWallet.publicKey} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Secret Key (shown once)</p>
                      <div className="flex items-center bg-gray-800 p-2 rounded">
                        <p className="text-xs font-mono text-yellow-300 break-all flex-1">{newWallet.secretKey}</p>
                        <CopyButton text={newWallet.secretKey} />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setNewWallet(null)} className="mt-3 text-sm text-gray-400 hover:text-white transition-colors">
                    I've saved my key ✓
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-1">Managed Stellar Wallet</h2>
            <p className="text-sm text-gray-400 mb-5">Generate a Stellar keypair managed through SwiftRemit. You'll need to store your secret key safely.</p>

            {user?.stellarPublicKey ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Public Key</p>
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2.5">
                    <p className="text-xs font-mono text-white break-all flex-1">{user.stellarPublicKey}</p>
                    <CopyButton text={user.stellarPublicKey} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-300">Balances</p>
                    <button onClick={() => fetchBalances(user.stellarPublicKey!)} className="text-xs text-primary-400 hover:underline">
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

                <button onClick={() => handleFundWallet(user.stellarPublicKey!)} disabled={funding} className="btn-primary w-full">
                  {funding ? "Funding..." : "Fund with Testnet XLM (Friendbot)"}
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🔑</div>
                <p className="text-gray-400 mb-5 text-sm">You don't have a managed wallet yet.</p>
                <button onClick={handleCreateWallet} disabled={loading} className="btn-primary px-8 py-3">
                  {loading ? "Creating..." : "Generate Stellar Wallet"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
