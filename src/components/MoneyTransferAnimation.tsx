export default function MoneyTransferAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <div className="relative w-[420px] h-[500px]">

        {/* ── Glow backdrop ── */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-radial from-primary-600/10 via-transparent to-transparent blur-2xl" />

        {/* ══════════════════════════════════
            LEFT PHONE — Sender
        ══════════════════════════════════ */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 phone-float-left">
          <PhoneCard side="left" label="You" amount="-$250.00" flag="🇳🇬" color="from-primary-600 to-blue-700" />
        </div>

        {/* ══════════════════════════════════
            RIGHT PHONE — Receiver
        ══════════════════════════════════ */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 phone-float-right">
          <PhoneCard side="right" label="Recipient" amount="+$250.00" flag="🇬🇭" color="from-emerald-600 to-teal-700" />
        </div>

        {/* ══════════════════════════════════
            TRANSFER TRACK — centre
        ══════════════════════════════════ */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">

          {/* Arc track */}
          <svg width="110" height="60" viewBox="0 0 110 60" fill="none" className="overflow-visible">
            {/* Dashed track */}
            <path
              d="M4 52 Q55 4 106 52"
              stroke="rgba(99,179,237,0.25)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              fill="none"
            />
            {/* Animated coin 1 */}
            <circle r="6" fill="#F6C90E" className="coin-travel">
              <animateMotion dur="1.8s" repeatCount="indefinite" begin="0s"   path="M4 52 Q55 4 106 52" />
            </circle>
            {/* Animated coin 2 */}
            <circle r="5" fill="#F6C90E" opacity="0.7">
              <animateMotion dur="1.8s" repeatCount="indefinite" begin="0.6s" path="M4 52 Q55 4 106 52" />
            </circle>
            {/* Animated coin 3 */}
            <circle r="4" fill="#F6C90E" opacity="0.5">
              <animateMotion dur="1.8s" repeatCount="indefinite" begin="1.2s" path="M4 52 Q55 4 106 52" />
            </circle>
          </svg>

          {/* Centre badge */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-gray-900 border-2 border-primary-500/60 flex items-center justify-center shadow-lg shadow-primary-600/20 transfer-pulse">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <span className="text-[10px] text-primary-300 font-semibold tracking-widest uppercase">Stellar</span>
          </div>

          {/* Speed badge */}
          <div className="bg-gray-900/80 border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-gray-300 font-medium">~3 seconds</span>
          </div>
        </div>

        {/* ══════════════════════════════════
            FLOATING PARTICLES
        ══════════════════════════════════ */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 particle-1">
          <span className="text-base">💰</span>
        </div>
        <div className="absolute bottom-10 left-1/3 particle-2">
          <span className="text-sm">✨</span>
        </div>
        <div className="absolute top-16 right-8 particle-3">
          <span className="text-xs">⭐</span>
        </div>

        {/* ══════════════════════════════════
            TRANSACTION CONFIRMED TOAST
        ══════════════════════════════════ */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-52 confirm-toast">
          <div className="bg-gray-900/95 border border-green-700/50 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-xl">
            <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-green-400">Transfer Complete</p>
              <p className="text-[10px] text-gray-500">Confirmed on Stellar</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Phone card sub-component ── */
interface PhoneCardProps {
  side: "left" | "right";
  label: string;
  amount: string;
  flag: string;
  color: string;
}

function PhoneCard({ side, label, amount, flag, color }: PhoneCardProps) {
  const isLeft = side === "left";
  return (
    <div className="w-[140px] bg-gray-900 border border-white/10 rounded-[22px] overflow-hidden shadow-2xl">
      {/* Phone header bar */}
      <div className={`bg-gradient-to-br ${color} px-3 pt-3 pb-4`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-white/70 font-medium">{label}</span>
          <span className="text-base">{flag}</span>
        </div>
        <p className={`text-base font-bold ${isLeft ? "text-white" : "text-white"}`}>
          {amount}
        </p>
        <p className="text-[9px] text-white/60 mt-0.5">USDC · Stellar</p>
      </div>

      {/* Phone body */}
      <div className="px-3 py-2.5 space-y-1.5">
        {/* Mini balance bar */}
        <div className="flex justify-between items-center">
          <span className="text-[9px] text-gray-500">Balance</span>
          <span className="text-[9px] text-gray-300 font-medium">
            {isLeft ? "$1,240" : "$890"}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${color} ${isLeft ? "w-3/4" : "w-1/2"} ${isLeft ? "balance-drain" : "balance-fill"}`}
          />
        </div>
        {/* Status dot */}
        <div className="flex items-center gap-1 pt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] text-gray-500">Active</span>
        </div>
      </div>
    </div>
  );
}
