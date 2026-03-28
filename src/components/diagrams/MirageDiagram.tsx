export default function MirageDiagram() {
  return (
    <div className="bg-gradient-to-b from-sky-200 to-amber-100 rounded-xl p-4 my-4">
      <p className="text-center text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
        How Mirages Form — Light Bending Near Hot Ground
      </p>
      <svg viewBox="0 0 500 250" className="w-full max-w-lg mx-auto">
        {/* Sky */}
        <rect x="0" y="0" width="500" height="140" fill="url(#sky-grad)" />
        <defs>
          <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="100%" stopColor="#c4e0f0" />
          </linearGradient>
        </defs>

        {/* Sun */}
        <circle cx="400" cy="35" r="20" fill="#FFD700" opacity={0.8} />

        {/* Road surface (hot) */}
        <rect x="0" y="140" width="500" height="50" fill="#555" />
        <rect x="0" y="140" width="500" height="3" fill="#777" />
        {/* Heat shimmer lines */}
        {[50, 120, 200, 280, 360, 430].map((x, i) => (
          <path key={i} d={`M ${x} 143 Q ${x+5} 135 ${x+10} 143`} stroke="rgba(255,100,0,0.3)" strokeWidth={1} fill="none" />
        ))}
        <text x="250" y="175" textAnchor="middle" className="text-[9px] font-bold" fill="#ff8c00">HOT GROUND — heats air above it</text>

        {/* Temperature labels */}
        <text x="480" y="100" textAnchor="end" className="text-[7px]" fill="#4682B4">Cool air (dense)</text>
        <text x="480" y="135" textAnchor="end" className="text-[7px]" fill="#ff6347">Hot air (thin)</text>

        {/* Air layers */}
        <line x1="0" y1="110" x2="500" y2="110" stroke="rgba(70,130,180,0.2)" strokeWidth={0.5} strokeDasharray="4 4" />
        <line x1="0" y1="125" x2="500" y2="125" stroke="rgba(255,99,71,0.2)" strokeWidth={0.5} strokeDasharray="4 4" />

        {/* Object: a tree in the distance */}
        <rect x="80" y="105" width="8" height="35" fill="#5a3825" />
        <circle cx="84" cy="100" r="15" fill="#2d8a4e" />
        <text x="84" y="82" textAnchor="middle" className="text-[7px]" fill="#2d5a30">Real tree</text>

        {/* Light ray — normal path (straight) from tree to eye */}
        <line x1="90" y1="110" x2="350" y2="120" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 2" opacity={0.5} />
        <text x="220" y="108" textAnchor="middle" className="text-[7px]" fill="#3b82f6">Normal ray (straight)</text>

        {/* Light ray — mirage path (curves down then up) */}
        <path d="M 90 115 Q 180 145 250 140 Q 320 136 350 125" stroke="#ef4444" strokeWidth={2} fill="none" opacity={0.8} />
        {/* Arrow showing curve direction */}
        <text x="200" y="150" textAnchor="middle" className="text-[8px] font-semibold" fill="#ef4444">Light bends away</text>
        <text x="200" y="160" textAnchor="middle" className="text-[8px]" fill="#ef4444">from hot air</text>

        {/* Observer's eye */}
        <ellipse cx="360" cy="122" rx="8" ry="5" fill="white" stroke="#333" strokeWidth={1} />
        <circle cx="360" cy="122" r="3" fill="#4a3728" />
        <circle cx="361" cy="121" r="1" fill="white" />
        <text x="360" y="115" textAnchor="middle" className="text-[7px]" fill="#333">Your eye</text>

        {/* Where the brain THINKS the light came from — below ground */}
        <line x1="350" y1="125" x2="250" y2="190" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />

        {/* Mirage image (inverted tree, below road) */}
        <rect x="240" y="190" width="6" height="25" fill="#5a3825" opacity={0.3} />
        <circle cx="243" cy="218" r="10" fill="#2d8a4e" opacity={0.2} />
        <text x="280" y="205" className="text-[8px] font-semibold" fill="#ef4444">Mirage!</text>
        <text x="280" y="215" className="text-[7px]" fill="#999">Brain sees inverted image</text>
        <text x="280" y="225" className="text-[7px]" fill="#999">(looks like water reflection)</text>

        {/* Ground line */}
        <rect x="0" y="190" width="500" height="60" fill="#a8886850" />
      </svg>
    </div>
  );
}
