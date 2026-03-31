export default function HornbillKeystoneDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 440" className="w-full max-w-lg mx-auto" role="img" aria-label="Diagram showing hornbill as keystone species connecting seed dispersal, forest structure, and biodiversity">
        <rect width="520" height="440" rx="12" className="fill-slate-900" />
        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Keystone Species: Remove One, Lose Many</text>

        {/* Central hornbill icon */}
        <g transform="translate(260, 120)">
          <circle cx="0" cy="0" r="40" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="2.5" />
          {/* Simplified hornbill */}
          <ellipse cx="0" cy="5" rx="15" ry="20" fill="#1c1917" />
          <circle cx="-3" cy="-10" r="8" fill="#4a3728" />
          <circle cx="-6" cy="-12" r="3" fill="#fefce8" />
          <circle cx="-7" cy="-12" r="1.5" fill="#1c1917" />
          <path d="M 3,-12 Q 15,-10 22,-8" fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M -3,-18 Q 5,-25 12,-18 Q 8,-15 -3,-16 Z" fill="#f59e0b" />
          <text x="0" y="32" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Hornbill</text>
        </g>

        {/* Arrows radiating from hornbill to ecosystem roles */}
        {/* Arrow to Seeds */}
        <line x1="220" y1="120" x2="100" y2="180" stroke="#34d399" strokeWidth="2" markerEnd="url(#arrowGreen)" />
        {/* Arrow to Trees */}
        <line x1="260" y1="160" x2="260" y2="220" stroke="#34d399" strokeWidth="2" markerEnd="url(#arrowGreen)" />
        {/* Arrow to Other animals */}
        <line x1="300" y1="120" x2="420" y2="180" stroke="#34d399" strokeWidth="2" markerEnd="url(#arrowGreen)" />

        <defs>
          <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0,0 L 8,3 L 0,6 Z" fill="#34d399" />
          </marker>
          <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0,0 L 8,3 L 0,6 Z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Seed dispersal node */}
        <g transform="translate(80, 210)">
          <rect x="-55" y="-20" width="110" height="50" rx="10" className="fill-slate-800" stroke="#34d399" strokeWidth="1.5" />
          <text x="0" y="-3" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#34d399">Seed Dispersal</text>
          <text x="0" y="10" textAnchor="middle" fontSize="8" className="fill-slate-400">Carries 40+ species</text>
          <text x="0" y="21" textAnchor="middle" fontSize="8" className="fill-slate-400">up to 12 km away</text>
        </g>

        {/* Forest structure node */}
        <g transform="translate(260, 260)">
          <rect x="-55" y="-20" width="110" height="50" rx="10" className="fill-slate-800" stroke="#34d399" strokeWidth="1.5" />
          <text x="0" y="-3" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#34d399">Forest Structure</text>
          <text x="0" y="10" textAnchor="middle" fontSize="8" className="fill-slate-400">Large trees need large</text>
          <text x="0" y="21" textAnchor="middle" fontSize="8" className="fill-slate-400">seeds dispersed far</text>
        </g>

        {/* Other wildlife node */}
        <g transform="translate(440, 210)">
          <rect x="-55" y="-20" width="110" height="50" rx="10" className="fill-slate-800" stroke="#34d399" strokeWidth="1.5" />
          <text x="0" y="-3" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#34d399">Biodiversity</text>
          <text x="0" y="10" textAnchor="middle" fontSize="8" className="fill-slate-400">Cavity nests used by</text>
          <text x="0" y="21" textAnchor="middle" fontSize="8" className="fill-slate-400">owls, bats, lizards</text>
        </g>

        {/* BOTTOM HALF: What happens without hornbills */}
        <line x1="20" y1="310" x2="500" y2="310" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4,3" />
        <text x="260" y="330" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ef4444">If Hornbills Disappear ↓</text>

        {/* Cascade chain */}
        <g transform="translate(60, 355)">
          <rect x="-40" y="-15" width="80" height="35" rx="6" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
          <text x="0" y="0" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fca5a5">No large-seed</text>
          <text x="0" y="11" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fca5a5">dispersal</text>
        </g>

        <line x1="100" y1="360" x2="140" y2="360" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrowRed)" />

        <g transform="translate(185, 355)">
          <rect x="-40" y="-15" width="80" height="35" rx="6" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
          <text x="0" y="0" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fca5a5">Large trees</text>
          <text x="0" y="11" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fca5a5">decline</text>
        </g>

        <line x1="225" y1="360" x2="265" y2="360" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrowRed)" />

        <g transform="translate(310, 355)">
          <rect x="-40" y="-15" width="80" height="35" rx="6" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
          <text x="0" y="0" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fca5a5">Canopy height</text>
          <text x="0" y="11" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fca5a5">drops</text>
        </g>

        <line x1="350" y1="360" x2="390" y2="360" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrowRed)" />

        <g transform="translate(435, 355)">
          <rect x="-40" y="-15" width="80" height="35" rx="6" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
          <text x="0" y="0" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fca5a5">Biodiversity</text>
          <text x="0" y="11" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fca5a5">collapses</text>
        </g>

        {/* Bottom note */}
        <text x="260" y="420" textAnchor="middle" fontSize="10" className="fill-slate-500">This chain reaction is called an ecological cascade</text>
      </svg>
    </div>
  );
}
