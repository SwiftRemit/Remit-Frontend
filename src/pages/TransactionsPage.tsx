import { useEffect, useState } from "react";
import { getTransactionsApi } from "@/api/transaction.api";

interface Transaction {
  _id: string;
  senderPublicKey: string;
  recipientPublicKey: string;
  amount: string;
  asset: string;
  status: string;
  memo: string;
  stellarTxHash: string | null;
  createdAt: string;
}

interface Pagination {
  page: number;
  pages: number;
  total: number;
}

const statusStyles: Record<string, string> = {
  success: "bg-green-900/40 text-green-400 border border-green-800",
  pending: "bg-yellow-900/40 text-yellow-400 border border-yellow-800",
  failed: "bg-red-900/40 text-red-400 border border-red-800",
  submitted: "bg-blue-900/40 text-blue-400 border border-blue-800",
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getTransactionsApi(page, 10);
        setTransactions(data.data);
        setPagination(data.pagination);
      } catch {
        // handle silently
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        <p className="text-gray-400 mt-1">{pagination.total} total transactions</p>
      </div>

      <div className="card">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="text-left py-3 pr-4">Date</th>
                  <th className="text-left py-3 pr-4">Recipient</th>
                  <th className="text-left py-3 pr-4">Amount</th>
                  <th className="text-left py-3 pr-4">Status</th>
                  <th className="text-left py-3">Tx Hash</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 pr-4 text-gray-400">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4 text-white font-mono text-xs">
                      {tx.recipientPublicKey.slice(0, 8)}...{tx.recipientPublicKey.slice(-6)}
                    </td>
                    <td className="py-3 pr-4 text-white font-semibold">
                      {tx.amount} {tx.asset}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[tx.status] || ""}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 text-xs font-mono text-gray-400">
                      {tx.stellarTxHash ? (
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${tx.stellarTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-400 hover:underline"
                        >
                          {tx.stellarTxHash.slice(0, 10)}...
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm text-gray-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="text-sm text-gray-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
