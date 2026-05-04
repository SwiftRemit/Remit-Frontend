import { NavLink, Link } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/send", label: "Send Payment", icon: "💸" },
  { to: "/transactions", label: "Transactions", icon: "📋" },
  { to: "/wallet", label: "Wallet", icon: "👛" },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col py-6 px-4">
      {/* Logo — links back to landing page */}
      <Link
        to="/"
        className="flex items-center gap-2.5 px-4 mb-6 hover:opacity-80 transition-opacity"
      >
        <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center text-sm font-bold">
          ⚡
        </div>
        <span className="font-bold text-white text-base tracking-tight">SwiftRemit</span>
      </Link>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {/* Divider + Home link */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <span>🌐</span>
            Back to Home
          </Link>
        </div>
      </nav>
    </aside>
  );
}
