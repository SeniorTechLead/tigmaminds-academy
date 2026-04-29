export default function BanyanStomataCloseupDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 545 420" className="w-full max-w-2xl mx-auto" role="img" aria-label="Leaf stomata showing guard cells opening and closing to control gas exchange and water loss">
        <rect width="500" height="380" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Stomata: The Leaf&apos;s Trade-Off</text>

        {/* === OPEN STOMA (left) === */}
        <text x="140" y="60" textAnchor="middle" className="fill-green-300" fontSize="12" fontWeight="bold">OPEN</text>

        {/* Epidermal cells background */}
        <rect x="50" y="80" width="180" height="180" rx="8" className="fill-green-900" opacity="0.4" />

        {/* Guard cells - open */}
        <path d="M 100,170 Q 120,130 140,170" className="stroke-green-400" strokeWidth="4" fill="none" />
        <path d="M 140,170 Q 160,210 180,170" className="stroke-green-400" strokeWidth="4" fill="none" />
        <path d="M 100,170 Q 120,210 140,170" className="stroke-green-400" strokeWidth="4" fill="none" />
        <path d="M 140,170 Q 160,130 180,170" className="stroke-green-400" strokeWidth="4" fill="none" />

        {/* Pore opening */}
        <ellipse cx="140" cy="170" rx="15" ry="25" className="fill-gray-100 dark:fill-slate-800" />

        {/* Guard cell labels */}
        <text x="95" y="150" textAnchor="middle" className="fill-green-300" fontSize="7">Guard</text>
        <text x="95" y="160" textAnchor="middle" className="fill-green-300" fontSize="7">cell</text>
        <text x="185" y="150" textAnchor="middle" className="fill-green-300" fontSize="7">Guard</text>
        <text x="185" y="160" textAnchor="middle" className="fill-green-300" fontSize="7">cell</text>
        <text x="140" y="173" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="7">Pore</text>

        {/* CO2 in arrow */}
        <line x1="140" y1="100" x2="140" y2="140" className="stroke-slate-300" strokeWidth="1.5" markerEnd="url(#stomataArrowIn)">
          <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.5s" repeatCount="indefinite" />
        </line>
        <text x="140" y="93" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8" fontWeight="bold">CO₂ in</text>

        {/* H2O out arrow */}
        <line x1="115" y1="200" x2="95" y2="240" className="stroke-blue-400" strokeWidth="1.5" markerEnd="url(#stomataArrowBlue)">
          <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.5s" repeatCount="indefinite" />
        </line>
        <text x="80" y="253" className="fill-blue-400" fontSize="8">H₂O out</text>

        {/* O2 out arrow */}
        <line x1="165" y1="200" x2="185" y2="240" className="stroke-sky-400" strokeWidth="1.5" markerEnd="url(#stomataArrowSky)">
          <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.5s" repeatCount="indefinite" />
        </line>
        <text x="185" y="253" className="fill-sky-400" fontSize="8">O₂ out</text>

        {/* === CLOSED STOMA (right) === */}
        <text x="370" y="60" textAnchor="middle" className="fill-amber-300" fontSize="12" fontWeight="bold">CLOSED</text>

        {/* Epidermal cells background */}
        <rect x="280" y="80" width="180" height="180" rx="8" className="fill-amber-900" opacity="0.3" />

        {/* Guard cells - closed */}
        <path d="M 330,170 Q 350,155 370,170" className="stroke-amber-500" strokeWidth="4" fill="none" />
        <path d="M 370,170 Q 390,185 410,170" className="stroke-amber-500" strokeWidth="4" fill="none" />
        <path d="M 330,170 Q 350,185 370,170" className="stroke-amber-500" strokeWidth="4" fill="none" />
        <path d="M 370,170 Q 390,155 410,170" className="stroke-amber-500" strokeWidth="4" fill="none" />

        {/* Closed pore - thin line */}
        <line x1="370" y1="158" x2="370" y2="182" className="stroke-slate-700" strokeWidth="1" />

        {/* Guard cell labels */}
        <text x="325" y="155" textAnchor="middle" className="fill-amber-400" fontSize="7">Guard</text>
        <text x="325" y="165" textAnchor="middle" className="fill-amber-400" fontSize="7">cell</text>
        <text x="415" y="155" textAnchor="middle" className="fill-amber-400" fontSize="7">Guard</text>
        <text x="415" y="165" textAnchor="middle" className="fill-amber-400" fontSize="7">cell</text>

        {/* X marks for blocked */}
        <text x="370" y="110" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="9">CO₂ blocked ✕</text>
        <text x="370" y="245" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="9">Water saved ✓</text>

        {/* Trade-off box at bottom */}
        <rect x="40" y="280" width="200" height="45" rx="6" className="fill-green-900" opacity="0.6" />
        <text x="140" y="298" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">Open stomata:</text>
        <text x="140" y="312" textAnchor="middle" className="fill-green-400" fontSize="8">✓ CO₂ for photosynthesis</text>
        <text x="140" y="323" textAnchor="middle" className="fill-blue-400" fontSize="8">✕ Loses water (transpiration)</text>

        <rect x="260" y="280" width="200" height="45" rx="6" className="fill-amber-900" opacity="0.6" />
        <text x="360" y="298" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">Closed stomata:</text>
        <text x="360" y="312" textAnchor="middle" className="fill-amber-400" fontSize="8">✓ Saves water in drought</text>
        <text x="360" y="323" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">✕ No photosynthesis</text>

        {/* Bottom insight */}
        <text x="250" y="355" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">A banyan leaf has ~200 stomata per mm²</text>
        <text x="250" y="370" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Each one opens and closes in response to light, humidity, and CO₂ levels</text>

        <defs>
          <marker id="stomataArrowIn" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-gray-600 dark:fill-slate-300" />
          </marker>
          <marker id="stomataArrowBlue" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-blue-400" />
          </marker>
          <marker id="stomataArrowSky" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-sky-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
