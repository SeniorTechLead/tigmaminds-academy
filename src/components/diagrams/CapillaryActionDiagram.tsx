export default function CapillaryActionDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing capillary action pulling water up through narrow tubes, explaining watercolor physics"
      >
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Capillary Action: How Watercolor Paint Spreads
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Water climbs into narrow spaces between paper fibers all by itself
        </text>

        {/* Left side: Capillary tube demo */}
        <rect x="40" y="75" width="320" height="290" rx="10" className="fill-white dark:fill-slate-900" stroke="#3b82f6" strokeWidth="1" />
        <text x="200" y="100" textAnchor="middle" fontSize="13" fontWeight="700" fill="#3b82f6">Capillary Tubes in Water</text>

        {/* Water tray */}
        <rect x="70" y="290" width="260" height="50" rx="4" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="1" />
        <text x="200" y="320" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Water</text>

        {/* Wide tube */}
        <rect x="100" y="180" width="30" height="120" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
        <rect x="102" y="265" width="26" height="25" fill="#3b82f6" fillOpacity="0.3" />
        <text x="115" y="170" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Wide</text>
        <text x="115" y="260" textAnchor="middle" fontSize="10" fill="#3b82f6">Low</text>

        {/* Medium tube */}
        <rect x="185" y="180" width="18" height="120" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
        <rect x="187" y="240" width="14" height="50" fill="#3b82f6" fillOpacity="0.4" />
        <text x="194" y="170" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Medium</text>
        <text x="194" y="235" textAnchor="middle" fontSize="10" fill="#3b82f6">Higher</text>

        {/* Narrow tube */}
        <rect x="262" y="180" width="8" height="120" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
        <rect x="263" y="210" width="6" height="80" fill="#3b82f6" fillOpacity="0.5" />
        <text x="266" y="170" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Narrow</text>
        <text x="266" y="205" textAnchor="middle" fontSize="10" fill="#3b82f6">Highest!</text>

        {/* Rule */}
        <text x="200" y="355" textAnchor="middle" fontSize="11" fontWeight="600" fill="#3b82f6">
          Narrower gap = water climbs higher
        </text>

        {/* Right side: Watercolor on paper */}
        <rect x="400" y="75" width="340" height="290" rx="10" className="fill-white dark:fill-slate-900" stroke="#f97316" strokeWidth="1" />
        <text x="570" y="100" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f97316">Watercolor on Paper</text>

        {/* Paper fibers zoomed in */}
        <rect x="420" y="120" width="300" height="150" rx="6" fill="#fef3c7" fillOpacity="0.3" stroke="#e5e7eb" strokeWidth="1" />
        <text x="720" y="138" textAnchor="end" fontSize="10" className="fill-gray-400 dark:fill-slate-500">(zoomed in)</text>

        {/* Paper fibers */}
        {[140, 165, 190, 215, 240].map((y, i) => (
          <g key={y}>
            <line x1="425" y1={y} x2={530 + i * 15} y2={y} stroke="#d4a574" strokeWidth={3 + Math.random()} strokeLinecap="round" />
            <line x1={545 + i * 12} y1={y} x2="715" y2={y} stroke="#d4a574" strokeWidth={3 + Math.random()} strokeLinecap="round" />
          </g>
        ))}

        {/* Paint drop at top */}
        <circle cx="530" cy="130" r="12" fill="#3b82f6" fillOpacity="0.5" />
        <text x="530" y="118" textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight="600">Paint drop</text>

        {/* Spreading arrows */}
        <path d="M530,145 L480,170" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
        <path d="M530,145 L580,170" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
        <path d="M530,145 L530,195" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
        <path d="M530,145 L460,200" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
        <path d="M530,145 L600,200" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />

        {/* Spread result */}
        <ellipse cx="530" cy="195" rx="75" ry="45" fill="#3b82f6" fillOpacity="0.12" />

        <text x="570" y="285" textAnchor="middle" fontSize="11" fontWeight="600" fill="#f97316">
          Water pulls into gaps between fibers
        </text>
        <text x="570" y="302" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Pigment particles travel with the water
        </text>
        <text x="570" y="318" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Finer paper = slower, more controlled spread
        </text>
        <text x="570" y="346" textAnchor="middle" fontSize="11" fontWeight="600" fill="#f97316">
          This is why wet paper "drinks" the paint!
        </text>

        {/* Forces explanation at bottom */}
        <rect x="60" y="385" width="660" height="55" rx="10" fill="#f97316" fillOpacity="0.08" stroke="#f97316" strokeWidth="1" />
        <text x="390" y="405" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-800 dark:fill-orange-200">
          Two forces work together:
        </text>
        <text x="250" y="425" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-orange-300">
          Adhesion: water sticks to fibers {'\u2191'}
        </text>
        <text x="530" y="425" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-orange-300">
          Cohesion: water sticks to water {'\u2192'}
        </text>
      </svg>
    </div>
  );
}
