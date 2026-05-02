import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="font-bold text-xl text-white">SwiftRemit</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
            Login
          </Link>
          <Link to="/register" className="btn-primary text-sm">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 bg-primary-900/30 border border-primary-700 rounded-full px-4 py-1.5 text-sm text-primary-300 mb-6">
          <span>⭐</span> Powered by Stellar Network
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight max-w-3xl">
          Instant Cross-Border Payments for{" "}
          <span className="text-primary-400">Africa</span>
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-xl">
          Send money across Africa in seconds, not days. Near-zero fees, powered by
          blockchain technology and USDC stablecoins.
        </p>
        <div className="mt-10 flex gap-4">
          <Link to="/register" className="btn-primary px-8 py-3 text-base">
            Start Sending →
          </Link>
          <a
            href="https://stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 text-base border border-gray-700 rounded-lg text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
          >
            Learn More
          </a>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl w-full">
          {[
            { value: "3–5s", label: "Settlement Time" },
            { value: "~$0.00001", label: "Transaction Fee" },
            { value: "USDC", label: "Stablecoin Payments" },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className="text-2xl font-bold text-primary-400">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
