import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl">⚡</span>
        <span className="font-bold text-lg text-white">SwiftRemit</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">
          {user?.name}
        </span>
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
