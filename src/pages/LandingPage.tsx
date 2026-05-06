import { Link } from "react-router-dom";
import { useState } from "react";
import TypewriterText from "@/components/TypewriterText";
import MoneyTransferAnimation from "@/components/MoneyTransferAnimation";

const features = [
  { icon: "⚡", title: "Instant Settlement", desc: "Transactions confirm in 3–5 seconds on the Stellar network — not 2–5 business days." },
  { icon: "💸", title: "Near-Zero Fees", desc: "Pay fractions of a cent per transaction instead of the 5–10% charged by traditional services." },
  { icon: "🔒", title: "Secure by Design", desc: "Wallet-based authentication, rate limiting, and cryptographic transaction signing built in." },
  { icon: "🌍", title: "Built for Africa", desc: "Designed around the real needs of African freelancers, SMEs, and families sending remittances." },
  { icon: "🪙", title: "USDC Stablecoins", desc: "Send value in USDC to avoid volatility — no surprises on the receiving end." },
  { icon: "📊", title: "Full Transparency", desc: "Every transaction is on-chain and verifiable. Track history in real time from your dashboard." },
];

const steps = [
  { step: "01", title: "Connect Your Wallet", desc: "Create or connect a Stellar wallet in seconds." },
  { step: "02", title: "Enter Details", desc: "Add the recipient's address and the amount to send." },
  { step: "03", title: "Confirm & Send", desc: "Sign the transaction — it settles on-chain in under 5 seconds." },
];

const stats = [
  { value: "3–5s", label: "Settlement Time", sub: "vs 2–5 days" },
  { value: "<$0.01", label: "Per Transaction", sub: "vs 5–10% fees" },
  { value: "USDC", label: "Stablecoin", sub: "No volatility" },
  { value: "Stellar", label: "Blockchain", sub: "Layer 1 speed" },
];

// ── Sticky stack features (mobile only) + normal grid (tablet/desktop) ──
function FeaturesSection() {
  return (
    <section id="features" className="relative px-4 md:px-12 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-primary-400 text-xs md:text-sm font-semibold tracking-widest uppercase mb-3">
            Why SwiftRemit
          </p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white">
            Everything you need to send money
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-400 max-w-xl mx-auto px-4">
            A complete payment stack built for speed, security, and accessibility across Africa.
          </p>
        </div>

        {/* ── Mobile: sticky stack ── */}
        <div className="flex flex-col sm:hidden">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="sticky p-5 mb-3 border border-white/10 rounded-2xl backdrop-blur-md"
              style={{
                top: `${60 + i * 12}px`,
                zIndex: i + 10,
                backgroundColor: `rgb(${10 + i * 4}, ${14 + i * 4}, ${30 + i * 4})`,
                transform: `scale(${1 - i * 0.015})`,
                transformOrigin: "top center",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-600/30 flex items-center justify-center text-xl mb-3">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
          {/* Spacer so last card scrolls fully out */}
          <div className="h-32" />
        </div>

        {/* ── Tablet / Desktop: normal grid ── */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-card p-5 md:p-6 group hover:bg-white/10 hover:border-primary-600/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary-600/20 border border-primary-600/30 flex items-center justify-center text-xl md:text-2xl mb-3 md:mb-4 group-hover:bg-primary-600/30 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // No overflow-x-hidden here — it would break position:sticky on feature cards
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* ── Ambient glow ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="glow-dot w-[400px] h-[400px] bg-primary-700 bottom-0 left-1/3" />
        <div className="mesh-bg absolute inset-0" />
      </div>

      {/* ── Navbar ── */}
      <header className="relative z-50 px-4 md:px-12 py-4 flex items-center justify-between">
        <div className="glass-card px-3 py-2 flex items-center gap-2">
          <div className="w-6 h-6 md:w-7 md:h-7 bg-primary-600 rounded-lg flex items-center justify-center text-xs font-bold">⚡</div>
          <span className="font-bold text-base md:text-lg text-white tracking-tight">SwiftRemit</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Stellar</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-300 hover:text-white font-medium transition-colors px-4 py-2">Sign in</Link>
          <Link to="/register" className="btn-glow text-sm px-5 py-2.5">Get Started →</Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Link to="/login" className="text-xs text-gray-300 hover:text-white px-3 py-1.5 glass-card">Sign in</Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="glass-card p-2 text-gray-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="relative z-40 md:hidden glass-card mx-4 mb-2 p-4 flex flex-col gap-3 text-sm">
          <a href="#features" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white py-2 border-b border-white/5">Features</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white py-2 border-b border-white/5">How it works</a>
          <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white py-2 border-b border-white/5">Stellar</a>
          <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-glow text-center py-2.5 mt-1">Get Started →</Link>
        </div>
      )}

      <main className="relative z-10 flex-1">

        {/* ── Hero — clipped separately so sticky cards below are unaffected ── */}
        <div style={{ overflow: "clip" }}>
          <section className="relative min-h-[88vh] flex items-start">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/hero-bg.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/95 to-gray-950/60 md:via-gray-950/90 md:to-gray-950/30" />
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12 pt-8 md:pt-10 pb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-start text-left">

                <div className="animate-fade-in inline-flex items-center gap-2 glass-card px-3 py-1.5 text-xs md:text-sm text-primary-300 mb-6 max-w-full">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary-400 animate-pulse-slow flex-shrink-0" />
                  <span className="truncate">Live on Stellar Testnet · Mainnet coming soon</span>
                </div>

                <h1 className="animate-fade-up text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                  <TypewriterText text="Send Money Across Borders in Seconds" speed={120} delay={400} showCursor />
                </h1>

                <p
                  className="animate-fade-up-delay mt-4 text-sm md:text-base text-gray-400 max-w-md leading-relaxed tracking-wide"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                >
                  Fast, secure and affordable payments for everyone — powered by the Stellar blockchain and USDC stablecoins.
                </p>

                <div className="animate-fade-up-delay2 mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Link to="/register" className="btn-glow px-6 py-3 text-sm md:text-base text-center">
                    Start Sending for Free
                  </Link>
                  <a
                    href="#how-it-works"
                    className="px-6 py-3 text-sm md:text-base glass-card text-gray-300 hover:text-white hover:border-white/20 transition-all duration-300 font-medium text-center"
                  >
                    See how it works ↓
                  </a>
                </div>

                <p className="mt-6 text-xs text-gray-600 tracking-widest uppercase">
                  Built on Stellar · Secured by cryptography · Open source
                </p>

                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                  {stats.map((s) => (
                    <div key={s.label} className="glass-card gradient-border p-3 md:p-4 text-left hover:bg-white/10 transition-all duration-300">
                      <div className="text-lg md:text-2xl font-bold gradient-text">{s.value}</div>
                      <div className="text-xs font-medium text-white mt-1">{s.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden md:flex items-start justify-center pt-4">
                <MoneyTransferAnimation />
              </div>
            </div>
          </section>
        </div>

        {/* ── Features — outside overflow:clip so sticky works ── */}
        <FeaturesSection />

        {/* ── How it works ── */}
        <section id="how-it-works" className="relative px-4 md:px-12 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 md:mb-16">
              <p className="text-primary-400 text-xs md:text-sm font-semibold tracking-widest uppercase mb-3">Simple Process</p>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white">Send in 3 steps</h2>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-transparent via-primary-600/50 to-transparent" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {steps.map((s, i) => (
                  <div key={s.step} className="flex flex-col items-center text-center group">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary-600/20 border border-primary-600/40 flex items-center justify-center mb-4 group-hover:bg-primary-600/30 group-hover:border-primary-500 transition-all duration-300 group-hover:-translate-y-1">
                      <span className="text-xl md:text-2xl font-bold gradient-text">{s.step}</span>
                      {i < steps.length - 1 && (
                        <div className="md:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 w-px h-5 bg-primary-600/40" />
                      )}
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-white mb-2">{s.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="relative px-4 md:px-12 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="gradient-border glass-card p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-blue-600/10 pointer-events-none" />
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl mb-4 md:mb-6 animate-float inline-block">⚡</div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
                  Ready to send your first payment?
                </h2>
                <p className="text-sm md:text-base text-gray-400 mb-6 md:mb-8 max-w-lg mx-auto">
                  Create a free account, connect your Stellar wallet, and send money across Africa in under a minute.
                </p>
                <Link to="/register" className="btn-glow inline-block px-8 md:px-10 py-3 md:py-4 text-sm md:text-base">
                  Create Free Account →
                </Link>
                <p className="mt-4 text-xs text-gray-600">No credit card required · Testnet available instantly</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 px-4 md:px-12 py-8 md:py-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center text-xs">⚡</div>
            <span className="font-bold text-white text-sm">SwiftRemit</span>
            <span className="text-gray-600 text-xs ml-1">© 2025</span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs md:text-sm text-gray-500">
            <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Stellar Network</a>
            <a href="https://stellar.expert" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Explorer</a>
            <Link to="/login" className="hover:text-gray-300 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-gray-300 transition-colors">Register</Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
            Stellar Testnet · Live
          </div>
        </div>
      </footer>

    </div>
  );
}
