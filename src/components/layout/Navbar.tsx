import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      {/* Logo — clicking takes you back to the landing page */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span className="text-2xl">⚡</span>
        <span className="font-bold text-lg text-white">SwiftRemit</span>
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">{user?.name}</span>
        <Link
          to="/"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
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
