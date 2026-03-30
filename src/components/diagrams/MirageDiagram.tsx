export default function MirageDiagram() {
  return (
    <div className="bg-gradient-to-b from-sky-200 to-amber-100 rounded-xl p-4 my-4">
      <p className="text-center text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">
        How Mirages Form — Light Bending Near Hot Ground
      </p>
      <svg viewBox="0 0 720 360" className="w-full max-w-xl mx-auto">
        <defs>
          <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="100%" stopColor="#c4e0f0" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="720" height="190" fill="url(#sky-grad)" />

        {/* Sun */}
        <circle cx="580" cy="45" r="25" fill="#FFD700" opacity={0.8} />

        {/* Air layers */}
        <line x1="0" y1="140" x2="720" y2="140" stroke="rgba(70,130,180,0.2)" strokeWidth={1} strokeDasharray="5 4" />
        <line x1="0" y1="170" x2="720" y2="170" stroke="rgba(255,99,71,0.2)" strokeWidth={1} strokeDasharray="5 4" />

        {/* Temperature labels */}
        <text x="680" y="125" textAnchor="end" fontSize="11" fill="#4682B4">Cool air (dense)</text>
        <text x="680" y="178" textAnchor="end" fontSize="11" fill="#ff6347">Hot air (thin, less dense)</text>

        {/* Road surface */}
        <rect x="0" y="190" width="720" height="60" fill="#555" />
        <rect x="0" y="190" width="720" height="4" fill="#777" />

        {/* Heat shimmer */}
        {[60, 150, 250, 350, 450, 550, 640].map((x, i) => (
          <path key={i} d={`M ${x} 194 Q ${x+6} 184 ${x+12} 194`} stroke="rgba(255,100,0,0.4)" strokeWidth={1.5} fill="none" />
        ))}
        <text x="360" y="228" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ff8c00">
          HOT GROUND — heats air above it
        </text>

        {/* Tree (real object) */}
        <rect x="100" y="135" width="10" height="55" fill="#5a3825" />
        <circle cx="105" cy="128" r="20" fill="#2d8a4e" />
        <text x="105" y="100" textAnchor="middle" fontSize="11" fontWeight="600" fill="#2d5a30">Real tree</text>

        {/* Normal light ray (straight, blue dashed) */}
        <line x1="115" y1="140" x2="500" y2="155" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 3" opacity={0.5} />
        <text x="300" y="138" textAnchor="middle" fontSize="11" fill="#3b82f6">Normal ray (straight)</text>

        {/* Mirage light ray (curves — bends away from hot air) */}
        <path d="M 115 148 Q 250 192 360 185 Q 450 180 500 162" stroke="#ef4444" strokeWidth={2.5} fill="none" opacity={0.8} />
        <text x="270" y="200" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ef4444">Light bends away</text>
        <text x="270" y="215" textAnchor="middle" fontSize="11" fill="#ef4444">from hot air layer</text>

        {/* Observer's eye */}
        <ellipse cx="510" cy="158" rx="10" ry="7" fill="white" stroke="#333" strokeWidth={1.5} />
        <circle cx="510" cy="158" r="4" fill="#4a3728" />
        <circle cx="511" cy="157" r="1.5" fill="white" />
        <text x="510" y="145" textAnchor="middle" fontSize="11" fontWeight="600" fill="#333">Your eye</text>

        {/* Brain's projected line (below ground) */}
        <line x1="500" y1="162" x2="360" y2="290" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.4} />

        {/* Underground area */}
        <rect x="0" y="250" width="720" height="110" fill="rgba(168,136,104,0.2)" />

        {/* Mirage image (inverted, faded) */}
        <rect x="350" y="270" width="8" height="35" fill="#5a3825" opacity={0.25} />
        <circle cx="354" cy="308" r="14" fill="#2d8a4e" opacity={0.15} />

        <text x="410" y="280" fontSize="13" fontWeight="700" fill="#ef4444">Mirage!</text>
        <text x="410" y="298" fontSize="11" fill="#888">Brain sees inverted image</text>
        <text x="410" y="314" fontSize="11" fill="#888">below ground — looks like</text>
        <text x="410" y="330" fontSize="11" fill="#888">water reflecting the tree</text>
      </svg>
    </div>
  );
}
