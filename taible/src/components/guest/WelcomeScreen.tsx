interface WelcomeScreenProps {
  restaurantName: string
  tableNumber: number
  onStart: () => void
  onBrowseMenu: () => void
}

function QRCodeArt() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer glow effect (conceptual) */}
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Outer border - Premium Gold */}
      <rect x="1" y="1" width="158" height="158" rx="16" stroke="rgba(212,168,98,0.4)" strokeWidth="1.5"/>
      <rect x="4" y="4" width="152" height="152" rx="13" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      
      {/* Top-left finder */}
      <rect x="16" y="16" width="36" height="36" rx="8" fill="rgba(212,168,98,0.1)" stroke="#D4A862" strokeWidth="2"/>
      <rect x="24" y="24" width="20" height="20" rx="4" fill="#D4A862"/>
      {/* Top-right finder */}
      <rect x="108" y="16" width="36" height="36" rx="8" fill="rgba(212,168,98,0.1)" stroke="#D4A862" strokeWidth="2"/>
      <rect x="116" y="24" width="20" height="20" rx="4" fill="#D4A862"/>
      {/* Bottom-left finder */}
      <rect x="16" y="108" width="36" height="36" rx="8" fill="rgba(212,168,98,0.1)" stroke="#D4A862" strokeWidth="2"/>
      <rect x="24" y="116" width="20" height="20" rx="4" fill="#D4A862"/>
      
      {/* Data modules - slightly transparent gold/white for premium look */}
      <g fill="rgba(212,168,98,0.8)">
        {[
          [64,16],[72,16],[80,16],[88,16],
          [64,24],[80,24],[88,24],
          [64,32],[72,32],[88,32],
          [72,40],[80,40],
          [64,48],[80,48],[88,48],
          [64,56],[72,56],[80,56],
          [16,64],[24,64],[40,64],[48,64],[56,64],
          [16,72],[32,72],[56,72],
          [24,80],[32,80],[48,80],
          [16,88],[40,88],[56,88],
          [24,96],[32,96],[48,96],[56,96],
          [16,104],[32,104],[40,104],
          [64,64],[72,64],[80,64],[88,64],[96,64],[104,64],[112,64],
          [64,72],[96,72],[112,72],
          [72,80],[80,80],[88,80],[96,80],
          [64,88],[80,88],[88,88],[104,88],[112,88],
          [72,96],[80,96],[96,96],
          [64,104],[88,104],[96,104],[112,104],
          [72,112],[80,112],[88,112],[104,112],
          [64,120],[88,120],[96,120],[112,120],
          [72,128],[80,128],
          [64,136],[72,136],[88,136],[96,136],
          [80,144],[88,144],[104,144],[112,144],
          [96,16],[104,16],
          [120,64],[128,64],[136,64],[144,64],
          [120,72],[136,72],[144,72],
          [120,80],[128,80],[144,80],
          [128,88],[136,88],
          [120,96],[144,96],
          [120,104],[128,104],[136,104],[144,104],
          [128,112],[136,112],[144,112],
          [120,120],[136,120],[144,120],
          [120,128],[128,128],[144,128],
          [136,136],[144,136],
          [120,144],[128,144],[136,144],[144,144],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="6.5" height="6.5" rx="1.5" />
        ))}
      </g>
    </svg>
  )
}

export default function WelcomeScreen({ restaurantName, tableNumber, onStart, onBrowseMenu }: WelcomeScreenProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 font-sans relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at top, #1F1B18 0%, #0A0908 100%)", color: "#E8DCD0" }}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4A862] rounded-full blur-[150px] opacity-[0.03] pointer-events-none" />

      {/* Logo */}
      <div className="flex flex-col items-center gap-4 mb-12 animate-in slide-in-from-top-4 fade-in duration-700">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#D4A862] to-[#8F5E3A] shadow-[0_10px_40px_rgba(212,168,98,0.2)]">
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <rect x="4" y="10" width="28" height="5" rx="2.5" fill="#FFF"/>
            <rect x="6" y="15" width="4" height="14" rx="2" fill="#FFF"/>
            <rect x="26" y="15" width="4" height="14" rx="2" fill="#FFF"/>
            <circle cx="18" cy="8" r="4" fill="#FFF"/>
          </svg>
        </div>
        <span className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
          taible
        </span>
      </div>

      {/* QR Card - Premium Glassmorphism */}
      <div className="w-full max-w-sm rounded-[2rem] p-8 mb-10 flex flex-col items-center gap-6 relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 animate-in zoom-in-95 fade-in duration-700 delay-150">
        
        {/* Shine effect */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        <div className="flex flex-col items-center gap-2 relative z-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A862]">
            {restaurantName}
          </span>
          <span className="text-sm font-semibold px-4 py-1.5 rounded-full bg-[#D4A862]/10 border border-[#D4A862]/20 text-[#D4A862]">
            Table {tableNumber}
          </span>
        </div>

        <div className="relative z-10 p-4 rounded-3xl bg-white/5 border border-white/5">
          <QRCodeArt />
        </div>

        <p className="text-xs text-center font-medium tracking-wide text-white/50 relative z-10">
          Scan to order from your phone
        </p>
      </div>

      {/* Headline */}
      <div className="text-center mb-10 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300">
        <h1 className="text-3xl font-bold mb-3 text-white tracking-tight">
          Hi! I'm your AI waiter.
        </h1>
        <p className="text-base text-white/60 font-medium">
          Tell me what you'd like to order.
        </p>
      </div>

      {/* Actions */}
      <div className="w-full max-w-xs flex flex-col gap-4 animate-in slide-in-from-bottom-6 fade-in duration-700 delay-500">
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl text-base font-bold text-white transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_30px_rgba(91,168,92,0.2)] group relative overflow-hidden flex items-center justify-center gap-3"
          style={{ background: "linear-gradient(135deg, #5BA85C 0%, #3B7D3C 100%)", border: "1px solid rgba(91,168,92,0.4)" }}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            Start Talking
          </span>
        </button>

        <button
          onClick={onBrowseMenu}
          className="w-full py-4 rounded-2xl text-sm font-semibold tracking-wide uppercase transition-all duration-300 active:scale-95 text-[#D4A862] hover:bg-white/5 border border-transparent hover:border-white/5"
        >
          Browse Menu
        </button>
      </div>

      {/* Mic note */}
      <p className="text-xs text-center mt-10 max-w-[260px] leading-relaxed text-white/30 font-medium animate-in fade-in duration-1000 delay-700">
        Taible will ask for microphone access to hear your order. Your voice is not stored.
      </p>
    </div>
  )
}
