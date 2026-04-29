export default function BoatHullShapesDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Three hull shapes compared: flat bottom, V-hull, and round bottom with trade-offs labeled"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .heading { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          @keyframes gentle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          .rock { animation: gentle 3s ease-in-out infinite; }
        `}</style>

        {/* Background */}
        <rect width="630" height="460" rx="8" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="315" y="28" textAnchor="middle" className="title fill-amber-300">
          Hull Shape Matters — Stability vs Speed
        </text>

        {/* === FLAT BOTTOM === */}
        <text x="108" y="60" textAnchor="middle" className="heading fill-cyan-400">Flat Bottom</text>

        {/* Water */}
        <rect x="20" y="150" width="180" height="80" rx="3" fill="#1e3a5f" opacity="0.5" />
        <line x1="20" y1="150" x2="200" y2="150" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4,2" />

        <g className="rock">
          {/* Flat hull cross-section */}
          <path d="M 48 150 L 45 170 L 170 170 L 167 150 Z"
            fill="#92400e" stroke="#d97706" strokeWidth="1.5" />
          {/* Deck */}
          <rect x="48" y="140" width="119" height="10" rx="2" fill="#78350f" stroke="#d97706" strokeWidth="1" />
        </g>

        {/* Wide contact area arrows */}
        <line x1="50" y1="180" x2="165" y2="180" stroke="#22c55e" strokeWidth="1.5" />
        <polygon points="50,180 56,177 56,183" fill="#22c55e" />
        <polygon points="165,180 159,177 159,183" fill="#22c55e" />
        <text x="108" y="195" textAnchor="middle" className="small fill-green-400">wide contact = stable</text>

        {/* Pros/Cons */}
        <text x="108" y="248" textAnchor="middle" className="small fill-green-300">✓ Very stable</text>
        <text x="108" y="262" textAnchor="middle" className="small fill-green-300">✓ Carries heavy cargo</text>
        <text x="108" y="278" textAnchor="middle" className="small fill-red-300">✗ Slow (high drag)</text>
        <text x="108" y="292" textAnchor="middle" className="small fill-red-300">✗ Rough ride in waves</text>

        <text x="108" y="315" textAnchor="middle" className="small fill-slate-400">
          Brahmaputra cargo boats
        </text>

        {/* === V-HULL === */}
        <text x="315" y="60" textAnchor="middle" className="heading fill-cyan-400">V-Hull</text>

        {/* Water */}
        <rect x="225" y="150" width="180" height="80" rx="3" fill="#1e3a5f" opacity="0.5" />
        <line x1="225" y1="150" x2="405" y2="150" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4,2" />

        <g className="rock" style={{ animationDelay: '0.5s' }}>
          {/* V-hull cross-section */}
          <path d="M 260 150 L 315 185 L 370 150 Z"
            fill="#92400e" stroke="#d97706" strokeWidth="1.5" />
          {/* Deck */}
          <rect x="260" y="140" width="110" height="10" rx="2" fill="#78350f" stroke="#d97706" strokeWidth="1" />
        </g>

        {/* V angle */}
        <path d="M 285 155 L 315 175 L 345 155" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />
        <text x="315" y="168" textAnchor="middle" className="small fill-amber-300">V angle</text>

        {/* Wave cutting arrows */}
        <path d="M 290 192 L 315 205 L 340 192" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="315" y="220" textAnchor="middle" className="small fill-blue-400">cuts through waves</text>

        {/* Pros/Cons */}
        <text x="315" y="248" textAnchor="middle" className="small fill-green-300">✓ Smooth in rough water</text>
        <text x="315" y="262" textAnchor="middle" className="small fill-green-300">✓ Good speed</text>
        <text x="315" y="278" textAnchor="middle" className="small fill-red-300">✗ Less cargo space</text>
        <text x="315" y="292" textAnchor="middle" className="small fill-red-300">✗ Rolls more at rest</text>

        <text x="315" y="315" textAnchor="middle" className="small fill-slate-400">
          Speedboats, patrol boats
        </text>

        {/* === ROUND BOTTOM === */}
        <text x="520" y="60" textAnchor="middle" className="heading fill-cyan-400">Round Bottom</text>

        {/* Water */}
        <rect x="430" y="150" width="180" height="80" rx="3" fill="#1e3a5f" opacity="0.5" />
        <line x1="430" y1="150" x2="610" y2="150" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4,2" />

        <g className="rock" style={{ animationDelay: '1s' }}>
          {/* Round hull cross-section */}
          <path d="M 465 150 Q 520 195 575 150 Z"
            fill="#92400e" stroke="#d97706" strokeWidth="1.5" />
          {/* Deck */}
          <rect x="465" y="140" width="110" height="10" rx="2" fill="#78350f" stroke="#d97706" strokeWidth="1" />
        </g>

        {/* Flow lines */}
        <path d="M 460 165 Q 520 188 580 165" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3,2" />
        <text x="520" y="208" textAnchor="middle" className="small fill-blue-400">water flows smoothly</text>

        {/* Pros/Cons */}
        <text x="520" y="248" textAnchor="middle" className="small fill-green-300">✓ Least drag</text>
        <text x="520" y="262" textAnchor="middle" className="small fill-green-300">✓ Best for long voyages</text>
        <text x="520" y="278" textAnchor="middle" className="small fill-red-300">✗ Needs keel to stop rolling</text>
        <text x="520" y="292" textAnchor="middle" className="small fill-red-300">✗ Can capsize without ballast</text>

        <text x="520" y="315" textAnchor="middle" className="small fill-slate-400">
          Sailing boats, trawlers
        </text>

        {/* Drag comparison bar chart */}
        <text x="315" y="350" textAnchor="middle" className="heading fill-slate-300">Drag Comparison (relative)</text>

        {/* Flat */}
        <rect x="60" y="365" width="120" height="16" rx="3" fill="#ef4444" opacity="0.7" />
        <text x="55" y="378" textAnchor="end" className="small fill-slate-400">Flat</text>
        <text x="185" y="378" className="small fill-red-300">High</text>

        {/* V */}
        <rect x="60" y="388" width="75" height="16" rx="3" fill="#fbbf24" opacity="0.7" />
        <text x="55" y="401" textAnchor="end" className="small fill-slate-400">V</text>
        <text x="140" y="401" className="small fill-amber-300">Medium</text>

        {/* Round */}
        <rect x="60" y="411" width="45" height="16" rx="3" fill="#22c55e" opacity="0.7" />
        <text x="55" y="424" textAnchor="end" className="small fill-slate-400">Round</text>
        <text x="110" y="424" className="small fill-green-300">Low</text>

        {/* Stability comparison */}
        <text x="460" y="350" textAnchor="middle" className="heading fill-slate-300">Stability (relative)</text>

        {/* Flat */}
        <rect x="380" y="365" width="120" height="16" rx="3" fill="#22c55e" opacity="0.7" />
        <text x="375" y="378" textAnchor="end" className="small fill-slate-400">Flat</text>
        <text x="505" y="378" className="small fill-green-300">High</text>

        {/* V */}
        <rect x="380" y="388" width="75" height="16" rx="3" fill="#fbbf24" opacity="0.7" />
        <text x="375" y="401" textAnchor="end" className="small fill-slate-400">V</text>
        <text x="460" y="401" className="small fill-amber-300">Medium</text>

        {/* Round */}
        <rect x="380" y="411" width="35" height="16" rx="3" fill="#ef4444" opacity="0.7" />
        <text x="375" y="424" textAnchor="end" className="small fill-slate-400">Round</text>
        <text x="420" y="424" className="small fill-red-300">Low</text>

        {/* Key insight */}
        <rect x="60" y="436" width="510" height="18" rx="4" fill="#1e3a5f" opacity="0.6" />
        <text x="315" y="449" textAnchor="middle" className="small fill-blue-200">
          Every hull is a trade-off: stability vs speed vs cargo capacity
        </text>
      </svg>
    </div>
  );
}
