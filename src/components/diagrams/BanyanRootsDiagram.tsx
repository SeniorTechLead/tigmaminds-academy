export default function BanyanRootsDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 605 440" className="w-full max-w-lg mx-auto" role="img" aria-label="Banyan tree root system showing aerial roots, strangler roots, and ground roots">
        <rect width="500" height="400" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Banyan Root System</text>

        {/* Ground line */}
        <line x1="30" y1="280" x2="470" y2="280" className="stroke-amber-800" strokeWidth="2" strokeDasharray="4,3" />
        <text x="475" y="284" className="fill-amber-700" fontSize="8" textAnchor="end">ground level</text>

        {/* Main trunk */}
        <rect x="230" y="120" width="40" height="160" rx="4" className="fill-amber-800" />
        <rect x="235" y="125" width="30" height="155" rx="3" className="fill-amber-700" opacity="0.5" />

        {/* Main canopy */}
        <ellipse cx="250" cy="100" rx="130" ry="60" className="fill-green-700" opacity="0.7" />
        <ellipse cx="250" cy="90" rx="110" ry="45" className="fill-green-600" opacity="0.6" />

        {/* Aerial roots from branches */}
        <line x1="160" y1="110" x2="150" y2="280" className="stroke-amber-600" strokeWidth="3" />
        <line x1="340" y1="110" x2="350" y2="280" className="stroke-amber-600" strokeWidth="3" />
        <line x1="200" y1="100" x2="190" y2="280" className="stroke-amber-600" strokeWidth="2.5" />
        <line x1="300" y1="100" x2="310" y2="250" className="stroke-amber-600" strokeWidth="2" strokeDasharray="4,3" />

        {/* Aerial root thickened at ground (pillar roots) */}
        <ellipse cx="150" cy="278" rx="6" ry="4" className="fill-amber-700" />
        <ellipse cx="350" cy="278" rx="6" ry="4" className="fill-amber-700" />
        <ellipse cx="190" cy="278" rx="5" ry="3" className="fill-amber-700" />

        {/* Host tree (ghosted) */}
        <rect x="90" y="150" width="20" height="130" rx="3" className="fill-slate-600" opacity="0.4" />
        <text x="100" y="145" textAnchor="middle" className="fill-slate-500" fontSize="8">host tree</text>

        {/* Strangler roots wrapping host */}
        <path d="M 95,160 Q 80,180 105,200 Q 85,220 100,240 Q 88,260 100,280" className="stroke-amber-500" strokeWidth="2.5" fill="none" />
        <path d="M 105,160 Q 120,180 95,200 Q 115,220 100,240 Q 112,260 100,280" className="stroke-amber-500" strokeWidth="2.5" fill="none" />

        {/* Ground roots spreading */}
        <path d="M 230,280 Q 180,290 80,310 Q 50,315 30,320" className="stroke-amber-700" strokeWidth="3" fill="none" />
        <path d="M 270,280 Q 320,290 420,310 Q 450,315 470,320" className="stroke-amber-700" strokeWidth="3" fill="none" />
        <path d="M 240,280 Q 200,300 120,330 Q 90,340 60,345" className="stroke-amber-700" strokeWidth="2" fill="none" />
        <path d="M 260,280 Q 300,300 380,330 Q 410,340 440,345" className="stroke-amber-700" strokeWidth="2" fill="none" />

        {/* Fine root hairs */}
        {[40, 70, 100, 400, 430, 460].map((x, i) => (
          <g key={i}>
            <line x1={x} y1={320 + (i % 3) * 5} x2={x - 5} y2={340 + (i % 3) * 5} className="stroke-amber-600" strokeWidth="1" />
            <line x1={x} y1={320 + (i % 3) * 5} x2={x + 5} y2={338 + (i % 3) * 5} className="stroke-amber-600" strokeWidth="1" />
          </g>
        ))}

        {/* Labels with leader lines */}
        {/* Aerial roots label */}
        <line x1="340" y1="190" x2="410" y2="170" className="stroke-green-400" strokeWidth="1" />
        <rect x="390" y="155" width="95" height="22" rx="4" className="fill-green-900" />
        <text x="437" y="170" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">Aerial Roots</text>

        {/* Strangler roots label */}
        <line x1="88" y1="200" x2="40" y2="190" className="stroke-amber-400" strokeWidth="1" />
        <rect x="5" y="178" width="100" height="22" rx="4" className="fill-amber-900" />
        <text x="55" y="193" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">Strangler Roots</text>

        {/* Ground roots label */}
        <line x1="130" y1="330" x2="170" y2="355" className="stroke-amber-400" strokeWidth="1" />
        <rect x="140" y="348" width="100" height="22" rx="4" className="fill-amber-900" />
        <text x="190" y="363" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">Ground Roots</text>

        {/* Pillar roots label */}
        <line x1="190" y1="275" x2="200" y2="255" className="stroke-green-400" strokeWidth="1" />
        <text x="200" y="250" className="fill-green-400" fontSize="8">pillar root</text>

        {/* Growing tip label */}
        <line x1="310" y1="250" x2="370" y2="240" className="stroke-slate-500" strokeWidth="1" strokeDasharray="2,2" />
        <text x="375" y="244" className="fill-slate-400" fontSize="8">still growing ↓</text>

        {/* Fact */}
        <text x="250" y="390" textAnchor="middle" className="fill-green-300" fontSize="9">One banyan can have 3,000+ aerial roots — each becoming a new trunk</text>
      </svg>
    </div>
  );
}
