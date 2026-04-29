export default function StructuralColorDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 720 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Structural color vs pigment color comparison">
        <defs>
          <linearGradient id="feather-blue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
        </defs>
        <rect width="720" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="360" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Why Kingfisher Blue Is Not Pigment</text>
        <text x="360" y="50" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Grind the feather → brown powder. The blue comes from structure, not chemistry.</text>

        {/* LEFT: Pigment color */}
        <rect x="40" y="70" width="300" height="300" rx="8" className="fill-red-50 dark:fill-red-900/10" stroke="#ef4444" strokeWidth="1" />
        <text x="190" y="95" textAnchor="middle" fontSize="14" fontWeight="700" fill="#ef4444">Pigment Color</text>

        {/* Red pigment molecule absorbing light */}
        <circle cx="190" cy="160" r="30" fill="#ef4444" opacity="0.3" />
        <text x="190" y="164" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Molecule</text>

        {/* Incoming white light arrows */}
        <line x1="100" y1="120" x2="165" y2="145" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrY)" />
        <text x="90" y="115" fontSize="10" className="fill-gray-600 dark:fill-slate-300">White light</text>

        {/* Absorbed */}
        <text x="190" y="210" textAnchor="middle" fontSize="10" fill="#ef4444">Absorbs blue &amp; green</text>
        {/* Reflected red */}
        <line x1="215" y1="145" x2="280" y2="120" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrR)" />
        <text x="280" y="115" fontSize="10" fill="#ef4444">Red reflected</text>

        <text x="190" y="260" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Fades over time as</text>
        <text x="190" y="275" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">molecules break down</text>

        <text x="190" y="310" textAnchor="middle" fontSize="24">⏳</text>
        <text x="190" y="345" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ef4444">Color fades</text>

        {/* RIGHT: Structural color */}
        <rect x="380" y="70" width="300" height="300" rx="8" className="fill-blue-50 dark:fill-blue-900/10" stroke="#3b82f6" strokeWidth="1" />
        <text x="530" y="95" textAnchor="middle" fontSize="14" fontWeight="700" fill="#3b82f6">Structural Color</text>

        {/* Nano layers */}
        {[0, 1, 2, 3, 4].map(i => (
          <g key={i}>
            <rect x="460" y={120 + i * 18} width="140" height="8" rx="2" fill={i % 2 === 0 ? '#93c5fd' : '#e0f2fe'} opacity="0.6" />
          </g>
        ))}
        <text x="530" y="215" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Nano-layers of keratin + air</text>

        {/* Light interaction */}
        <line x1="430" y1="115" x2="470" y2="135" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrY)" />
        <line x1="530" y1="135" x2="590" y2="115" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrB)" />
        <text x="600" y="112" fontSize="10" fill="#3b82f6">Blue reflected</text>

        <text x="530" y="250" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Blue wavelengths add up</text>
        <text x="530" y="265" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">(constructive interference)</text>

        <text x="530" y="310" textAnchor="middle" fontSize="24">♾️</text>
        <text x="530" y="345" textAnchor="middle" fontSize="11" fontWeight="600" fill="#3b82f6">Never fades</text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrY" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24" /></marker>
          <marker id="arrR" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" /></marker>
          <marker id="arrB" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#3b82f6" /></marker>
        </defs>

        {/* Bottom note */}
        <text x="360" y="400" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Museum kingfisher specimens remain brilliant blue after centuries — proof that structure outlasts chemistry</text>
      </svg>
    </div>
  );
}
