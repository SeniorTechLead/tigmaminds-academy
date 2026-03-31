export default function OrchidEpiphyteDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 440" className="w-full max-w-lg mx-auto" role="img" aria-label="Diagram showing how epiphytic orchids grow on trees without parasitizing them, using aerial roots and velamen to capture water">
        <rect width="560" height="440" rx="12" className="fill-slate-900" />
        <text x="280" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#86efac">Epiphytes \u2014 Growing Without Soil</text>
        <text x="280" y="46" textAnchor="middle" fontSize="10" className="fill-slate-400">Orchids live on trees but are NOT parasites \u2014 they make their own food</text>

        {/* Tree trunk */}
        <g transform="translate(60, 60)">
          <rect x="0" y="0" width="60" height="360" rx="8" fill="#5c4033" stroke="#8b6914" strokeWidth="1" />
          {/* Bark texture lines */}
          {[30, 70, 110, 150, 190, 230, 270, 310, 340].map((y, i) => (
            <path key={i} d={`M ${5 + (i % 3) * 5},${y} Q 30,${y - 5 + (i % 2) * 10} ${55 - (i % 3) * 5},${y}`} stroke="#8b6914" strokeWidth="0.5" fill="none" opacity="0.4" />
          ))}
          <text x="30" y="385" textAnchor="middle" fontSize="10" fill="#8b6914">Host tree trunk</text>
        </g>

        {/* Orchid on the tree */}
        <g transform="translate(120, 130)">
          {/* Aerial roots gripping bark */}
          <path d="M 0,40 Q -15,50 -25,65 Q -35,80 -30,95" stroke="#86efac" strokeWidth="3" fill="none" />
          <path d="M 0,40 Q -20,60 -35,75 Q -45,85 -42,100" stroke="#86efac" strokeWidth="2.5" fill="none" />
          <path d="M 0,40 Q -10,55 -18,70 Q -22,80 -20,90" stroke="#86efac" strokeWidth="2" fill="none" />
          {/* Hanging roots */}
          <path d="M 5,50 Q 20,70 25,100 Q 28,120 22,140" stroke="#86efac" strokeWidth="2" fill="none" />
          <path d="M 10,50 Q 30,80 35,110 Q 38,130 30,155" stroke="#86efac" strokeWidth="1.5" fill="none" />

          {/* Orchid leaves */}
          <ellipse cx="20" cy="20" rx="35" ry="10" fill="#22c55e" opacity="0.6" transform="rotate(-20, 20, 20)" />
          <ellipse cx="30" cy="10" rx="30" ry="8" fill="#22c55e" opacity="0.5" transform="rotate(15, 30, 10)" />
          <ellipse cx="10" cy="30" rx="32" ry="9" fill="#22c55e" opacity="0.55" transform="rotate(-35, 10, 30)" />

          {/* Flower */}
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx={50 + Math.cos((a * Math.PI) / 180) * 14}
              cy={-15 + Math.sin((a * Math.PI) / 180) * 14}
              rx="10" ry="6" fill="#e879f9" opacity="0.6"
              transform={`rotate(${a}, ${50 + Math.cos((a * Math.PI) / 180) * 14}, ${-15 + Math.sin((a * Math.PI) / 180) * 14})`}
            />
          ))}
          <circle cx="50" cy="-15" r="5" fill="#c026d3" />
        </g>

        {/* Velamen cross-section detail */}
        <g transform="translate(300, 70)">
          <rect x="0" y="0" width="230" height="130" rx="8" fill="#1e293b" stroke="#86efac" strokeWidth="1" />
          <text x="115" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#86efac">Velamen \u2014 Sponge Root Coating</text>

          {/* Root cross-section */}
          <circle cx="70" cy="75" r="35" fill="#3b2f1e" stroke="#86efac" strokeWidth="1" />
          {/* Velamen layer (outer) */}
          <circle cx="70" cy="75" r="35" fill="none" stroke="#e2e8f0" strokeWidth="8" opacity="0.2" />
          <circle cx="70" cy="75" r="35" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" />
          {/* Inner vascular */}
          <circle cx="70" cy="75" r="15" fill="#22c55e" opacity="0.4" />
          <circle cx="70" cy="75" r="8" fill="#3b82f6" opacity="0.4" />

          <text x="70" y="120" textAnchor="middle" fontSize="8" className="fill-slate-400">Root cross-section</text>

          {/* Labels */}
          <line x1="105" y1="55" x2="140" y2="45" stroke="#e2e8f0" strokeWidth="0.8" />
          <text x="142" y="42" fontSize="8" fill="#e2e8f0">Velamen (spongy)</text>
          <text x="142" y="52" fontSize="7" className="fill-slate-400">Absorbs rain + humidity</text>

          <line x1="85" y1="75" x2="140" y2="72" stroke="#22c55e" strokeWidth="0.8" />
          <text x="142" y="72" fontSize="8" fill="#22c55e">Cortex</text>

          <line x1="78" y1="80" x2="140" y2="95" stroke="#3b82f6" strokeWidth="0.8" />
          <text x="142" y="95" fontSize="8" fill="#60a5fa">Vascular core</text>
          <text x="142" y="105" fontSize="7" className="fill-slate-400">Moves water to leaves</text>
        </g>

        {/* Parasite vs Epiphyte comparison */}
        <g transform="translate(300, 215)">
          <rect x="0" y="0" width="230" height="90" rx="8" fill="#1e293b" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" />
          <text x="115" y="18" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ef4444">\u2718 Parasite (e.g. mistletoe)</text>
          <text x="115" y="34" textAnchor="middle" fontSize="9" fill="#e2e8f0">Pushes roots INTO host tree</text>
          <text x="115" y="48" textAnchor="middle" fontSize="9" fill="#e2e8f0">Steals water and sugar</text>
          <text x="115" y="62" textAnchor="middle" fontSize="9" fill="#e2e8f0">Harms the host</text>
          <text x="115" y="82" textAnchor="middle" fontSize="9" fill="#ef4444">Takes food from host</text>
        </g>

        <g transform="translate(300, 315)">
          <rect x="0" y="0" width="230" height="90" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="1" />
          <text x="115" y="18" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#22c55e">\u2714 Epiphyte (e.g. orchid)</text>
          <text x="115" y="34" textAnchor="middle" fontSize="9" fill="#e2e8f0">Roots grip the SURFACE only</text>
          <text x="115" y="48" textAnchor="middle" fontSize="9" fill="#e2e8f0">Gets water from rain + humid air</text>
          <text x="115" y="62" textAnchor="middle" fontSize="9" fill="#e2e8f0">Makes own food (photosynthesis)</text>
          <text x="115" y="82" textAnchor="middle" fontSize="9" fill="#22c55e">Tree is just a perch, not a food source</text>
        </g>

        {/* Why live on trees? */}
        <g transform="translate(140, 310)">
          <rect x="0" y="0" width="140" height="110" rx="8" fill="#1e293b" stroke="#fbbf24" strokeWidth="1" />
          <text x="70" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Why live up high?</text>
          <text x="70" y="36" textAnchor="middle" fontSize="9" fill="#e2e8f0">\u2600 More sunlight</text>
          <text x="70" y="52" textAnchor="middle" fontSize="9" fill="#e2e8f0">\ud83d\udca8 More airflow</text>
          <text x="70" y="68" textAnchor="middle" fontSize="9" fill="#e2e8f0">\ud83d\udc1b Away from ground pests</text>
          <text x="70" y="84" textAnchor="middle" fontSize="9" fill="#e2e8f0">\ud83d\udc1d Closer to pollinators</text>
          <text x="70" y="102" textAnchor="middle" fontSize="8" className="fill-slate-400">Trade-off: no soil nutrients</text>
        </g>
      </svg>
    </div>
  );
}
