import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useFreighter } from "@/hooks/useFreighter";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const freighter = useFreighter();

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 md:px-6 py-4 flex items-center justify-between gap-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
        <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center text-sm font-bold">⚡</div>
        <span className="font-bold text-base md:text-lg text-white">SwiftRemit</span>
      </Link>

      <div className="flex items-center gap-2 md:gap-4">

        {/* ── Connect Wallet button ── */}
        {freighter.isConnected && freighter.publicKey ? (
          // Connected state — shows truncated address
          <Link
            to="/wallet"
            className="flex items-center gap-2 bg-green-900/30 border border-green-700/50 hover:border-green-500/70 text-green-400 text-xs md:text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <span className="hidden sm:inline">
              {freighter.publicKey.slice(0, 4)}...{freighter.publicKey.slice(-4)}
            </span>
            <span className="sm:hidden">Connected</span>
          </Link>
        ) : (
          // Not connected state
          <Link
            to="/wallet"
            className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 text-white text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg transition-all shadow hover:shadow-primary-600/30"
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Connect Wallet</span>
          </Link>
        )}

        {/* User name — hidden on small screens */}
        <span className="hidden md:block text-sm text-gray-400">{user?.name}</span>

        <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">
          Home
        </Link>

        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
