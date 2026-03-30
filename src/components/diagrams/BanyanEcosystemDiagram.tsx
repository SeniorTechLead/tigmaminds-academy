export default function BanyanEcosystemDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 582 475" className="w-full max-w-lg mx-auto" role="img" aria-label="Banyan tree as an ecosystem showing birds, insects, epiphytes, animals, and mycorrhizal fungi">
        <rect width="500" height="440" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">One Tree = One Ecosystem</text>

        {/* Canopy - large spreading */}
        <ellipse cx="250" cy="110" rx="180" ry="75" className="fill-green-800" opacity="0.6" />
        <ellipse cx="200" cy="100" rx="100" ry="55" className="fill-green-700" opacity="0.7" />
        <ellipse cx="310" cy="105" rx="90" ry="50" className="fill-green-700" opacity="0.7" />
        <ellipse cx="250" cy="90" rx="120" ry="50" className="fill-green-600" opacity="0.5" />

        {/* Main trunk */}
        <rect x="230" y="155" width="40" height="150" rx="5" className="fill-amber-800" />

        {/* Aerial roots */}
        <line x1="140" y1="120" x2="130" y2="305" className="stroke-amber-600" strokeWidth="3" />
        <line x1="360" y1="120" x2="370" y2="305" className="stroke-amber-600" strokeWidth="3" />

        {/* Ground line */}
        <line x1="30" y1="305" x2="470" y2="305" className="stroke-amber-800" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Ground roots */}
        <path d="M 230,305 Q 150,325 60,340" className="stroke-amber-700" strokeWidth="2.5" fill="none" />
        <path d="M 270,305 Q 350,325 440,340" className="stroke-amber-700" strokeWidth="2.5" fill="none" />

        {/* === ECOSYSTEM ELEMENTS === */}

        {/* 1. Birds nesting in canopy */}
        <g>
          {/* Bird shape */}
          <ellipse cx="170" cy="80" rx="8" ry="5" className="fill-amber-400" />
          <circle cx="163" cy="77" r="3" className="fill-amber-300" />
          <line x1="160" y1="77" x2="155" y2="78" className="stroke-amber-500" strokeWidth="1.5" />
          {/* Nest */}
          <path d="M 180,90 Q 190,100 200,90" className="stroke-amber-600" strokeWidth="2" fill="none" />
          <circle cx="190" cy="88" r="3" className="fill-slate-300" />
        </g>
        <line x1="175" y1="95" x2="50" y2="60" className="stroke-slate-600" strokeWidth="0.5" />
        <rect x="10" y="48" width="80" height="20" rx="4" className="fill-green-900" />
        <text x="50" y="62" textAnchor="middle" className="fill-green-300" fontSize="8" fontWeight="bold">Birds nesting</text>

        {/* 2. Insects on branches */}
        <g>
          <ellipse cx="320" cy="75" rx="4" ry="2.5" className="fill-yellow-400" />
          <circle cx="316" cy="74" r="1.5" className="fill-yellow-300" />
          <line x1="318" y1="72" x2="315" y2="68" className="stroke-yellow-400" strokeWidth="0.5" />
          <line x1="320" y1="72" x2="322" y2="68" className="stroke-yellow-400" strokeWidth="0.5" />
        </g>
        <g>
          <ellipse cx="290" cy="85" rx="3.5" ry="2" className="fill-yellow-500" />
        </g>
        <line x1="325" y1="75" x2="430" y2="55" className="stroke-slate-600" strokeWidth="0.5" />
        <rect x="410" y="42" width="80" height="20" rx="4" className="fill-green-900" />
        <text x="450" y="56" textAnchor="middle" className="fill-green-300" fontSize="8" fontWeight="bold">Insects</text>

        {/* 3. Epiphytes on branches */}
        <g>
          {/* Fern-like epiphyte */}
          <path d="M 145,135 Q 140,125 135,135 M 145,135 Q 150,125 155,135 M 145,135 Q 145,122 145,115" className="stroke-green-400" strokeWidth="1.5" fill="none" />
          <path d="M 355,140 Q 350,130 345,140 M 355,140 Q 360,130 365,140 M 355,140 Q 355,127 355,120" className="stroke-green-400" strokeWidth="1.5" fill="none" />
        </g>
        <line x1="355" y1="135" x2="435" y2="120" className="stroke-slate-600" strokeWidth="0.5" />
        <rect x="415" y="108" width="75" height="20" rx="4" className="fill-green-900" />
        <text x="452" y="122" textAnchor="middle" className="fill-green-300" fontSize="8" fontWeight="bold">Epiphytes</text>

        {/* 4. Animals sheltering under canopy */}
        <g>
          {/* Simple animal silhouette (monkey-like) */}
          <circle cx="380" cy="245" r="6" className="fill-amber-600" />
          <ellipse cx="380" cy="260" rx="5" ry="8" className="fill-amber-600" />
          <path d="M 376,268 L 374,278" className="stroke-amber-600" strokeWidth="2" />
          <path d="M 384,268 L 386,278" className="stroke-amber-600" strokeWidth="2" />
        </g>
        {/* Squirrel */}
        <g>
          <circle cx="115" cy="250" r="5" className="fill-amber-500" />
          <ellipse cx="115" cy="262" rx="4" ry="7" className="fill-amber-500" />
          <path d="M 119,258 Q 128,248 125,240" className="stroke-amber-500" strokeWidth="1.5" fill="none" />
        </g>
        <line x1="115" y1="245" x2="45" y2="220" className="stroke-slate-600" strokeWidth="0.5" />
        <rect x="5" y="210" width="85" height="20" rx="4" className="fill-green-900" />
        <text x="47" y="224" textAnchor="middle" className="fill-green-300" fontSize="8" fontWeight="bold">Animals shelter</text>

        {/* 5. Mycorrhizal fungi at roots */}
        <g>
          {/* Fungal network */}
          {[80, 120, 160, 340, 380, 420].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={340 + (i % 3) * 8} r="3" className="fill-amber-500" opacity="0.6" />
              <line x1={x} y1={340 + (i % 3) * 8} x2={x + (i % 2 === 0 ? 15 : -15)} y2={345 + (i % 3) * 8} className="stroke-amber-500" strokeWidth="0.5" opacity="0.4" />
            </g>
          ))}
          {/* Hyphae network lines */}
          <path d="M 80,340 Q 100,350 120,348 Q 150,345 160,340" className="stroke-amber-500" strokeWidth="0.5" fill="none" opacity="0.4" />
          <path d="M 340,356 Q 370,350 380,340 Q 400,345 420,348" className="stroke-amber-500" strokeWidth="0.5" fill="none" opacity="0.4" />
        </g>
        <rect x="175" y="355" width="150" height="22" rx="4" className="fill-amber-900" />
        <text x="250" y="370" textAnchor="middle" className="fill-amber-300" fontSize="8" fontWeight="bold">Mycorrhizal fungi network</text>
        <text x="250" y="385" textAnchor="middle" className="fill-slate-400" fontSize="8">Fungi trade soil nutrients for tree sugars</text>

        {/* Species count */}
        <rect x="130" y="400" width="240" height="28" rx="8" className="fill-green-900" opacity="0.7" />
        <text x="250" y="414" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">A single banyan can support 100+ species</text>
        <text x="250" y="425" textAnchor="middle" className="fill-green-400" fontSize="8">birds, mammals, reptiles, insects, fungi, epiphytes</text>
      </svg>
    </div>
  );
}
