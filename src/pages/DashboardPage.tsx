import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { getBalanceApi } from "@/api/wallet.api";
import { getTransactionsApi } from "@/api/transaction.api";
import { useFreighter } from "@/hooks/useFreighter";

interface Transaction {
  _id: string;
  recipientPublicKey: string;
  amount: string;
  asset: string;
  status: string;
  createdAt: string;
}

interface Balance {
  asset: string;
  balance: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const freighter = useFreighter();
  const [balances, setBalances] = useState<Balance[]>([]);
  const [recentTxs, setRecentTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes] = await Promise.all([
          getTransactionsApi(1, 5),
          user?.stellarPublicKey
            ? getBalanceApi(user.stellarPublicKey).then((r) => setBalances(r.data.balances))
            : Promise.resolve(),
        ]);
        setRecentTxs(txRes.data.data);
      } catch {
        // silently fail on dashboard
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const statusColor: Record<string, string> = {
    success: "text-green-400",
    pending: "text-yellow-400",
    failed: "text-red-400",
    submitted: "text-blue-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
      </div>

      {/* ── Connect Wallet banner — shown when no wallet is connected ── */}
      {!freighter.isConnected && !user?.stellarPublicKey && (
        <div className="card border-primary-700/50 bg-primary-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-600/30 flex items-center justify-center text-xl flex-shrink-0">
              👛
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">No wallet connected</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Connect your Freighter wallet or create a managed wallet to start sending payments.
              </p>
            </div>
          </div>
          <Link
            to="/wallet"
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all shadow hover:shadow-primary-600/30 flex-shrink-0 w-full sm:w-auto justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Connect Wallet
          </Link>
        </div>
      )}

      {/* Connected wallet status strip */}
      {freighter.isConnected && freighter.publicKey && (
        <div className="card border-green-700/40 bg-green-900/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-400">Freighter wallet connected</p>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                {freighter.publicKey.slice(0, 12)}...{freighter.publicKey.slice(-8)}
              </p>
            </div>
          </div>
          <Link to="/wallet" className="text-xs text-primary-400 hover:underline flex-shrink-0">
            Manage →
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Send Payment", to: "/send", icon: "💸" },
          { label: "Transactions", to: "/transactions", icon: "📋" },
          { label: "History", to: "/transactions", icon: "🕐" },
        ].map((action) => (
          <Link key={action.label} to={action.to} className="card hover:border-primary-600 transition-colors text-center">
            <div className="text-3xl mb-2">{action.icon}</div>
            <div className="text-sm font-medium text-gray-300">{action.label}</div>
          </Link>
        ))}
        {/* View Wallet — uses same SVG icon as Connect Wallet button */}
        <Link to="/wallet" className="card hover:border-primary-600 transition-colors text-center flex flex-col items-center justify-center">
          <div className="mb-2 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div className="text-sm font-medium text-gray-300">View Wallet</div>
        </Link>
      </div>

      {/* Balances */}
      {user?.stellarPublicKey && (
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Wallet Balances</h2>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading balances...</p>
          ) : balances.length > 0 ? (
            <div className="space-y-2">
              {balances.map((b) => (
                <div key={b.asset} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                  <span className="text-gray-300 font-medium">{b.asset}</span>
                  <span className="text-white font-semibold">{parseFloat(b.balance).toFixed(4)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No balances found. Fund your wallet first.</p>
          )}
        </div>
      )}

      {/* Recent transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
          <Link to="/transactions" className="text-sm text-primary-400 hover:underline">View all</Link>
        </div>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : recentTxs.length > 0 ? (
          <div className="space-y-3">
            {recentTxs.map((tx) => (
              <div key={tx._id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-sm text-white font-medium">
                    {tx.recipientPublicKey.slice(0, 8)}...{tx.recipientPublicKey.slice(-6)}
                  </p>
                  <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{tx.amount} {tx.asset}</p>
                  <p className={`text-xs font-medium ${statusColor[tx.status] || "text-gray-400"}`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No transactions yet. <Link to="/send" className="text-primary-400 hover:underline">Send your first payment</Link></p>
        )}
      </div>
    </div>
  );
}
