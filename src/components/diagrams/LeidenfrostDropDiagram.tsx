export default function LeidenfrostDropDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Leidenfrost effect: a water droplet floating on its own steam cushion above a very hot surface">
        <rect width="700" height="400" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">The Leidenfrost Effect</text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Above ~200\u00B0C, water drops float on a cushion of their own steam</text>

        {/* Hot surface */}
        <rect x="100" y="280" width="500" height="30" rx="4" fill="#ef4444" opacity="0.3" stroke="#ef4444" strokeWidth="1.5" />
        <text x="350" y="300" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ef4444">Hot surface (~300\u00B0C)</text>
        {/* Heat glow */}
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <line key={i} x1={160 + i * 60} y1="275" x2={160 + i * 60} y2="260" stroke="#ef4444" strokeWidth="1" opacity="0.3" />
        ))}

        {/* Steam cushion */}
        <rect x="260" y="258" width="180" height="22" rx="8" fill="#94a3b8" opacity="0.15" />
        <text x="350" y="273" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Steam cushion (vapor layer)</text>

        {/* Water droplet */}
        <ellipse cx="350" cy="230" rx="50" ry="32" fill="#3b82f6" opacity="0.25" stroke="#3b82f6" strokeWidth="1.5" />
        <ellipse cx="335" cy="220" rx="15" ry="8" fill="#ffffff" opacity="0.2" />
        <text x="350" y="234" textAnchor="middle" fontSize="11" fontWeight="600" fill="#3b82f6">Water drop</text>

        {/* Labels with arrows */}
        <line x1="280" y1="200" x2="308" y2="218" stroke="#3b82f6" strokeWidth="1" />
        <text x="225" y="198" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Droplet stays cool</text>
        <text x="225" y="210" fontSize="10" className="fill-gray-600 dark:fill-slate-300">(steam insulates it)</text>

        {/* LEFT: Below Leidenfrost point */}
        <g transform="translate(0, 0)">
          <rect x="40" y="80" width="260" height="140" rx="8" className="fill-red-50 dark:fill-red-900/10" stroke="#ef4444" strokeWidth="1" />
          <text x="170" y="105" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ef4444">Below 200\u00B0C</text>
          <text x="170" y="125" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Water touches hot surface</text>
          <text x="170" y="140" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">directly \u2192 boils violently</text>
          <text x="170" y="160" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Evaporates in ~1 second</text>
          {/* Bubbles */}
          {[0, 1, 2, 3].map(i => (
            <circle key={i} cx={130 + i * 25} cy={185} r={4 + i} fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.4" />
          ))}
        </g>

        {/* RIGHT: Above Leidenfrost point */}
        <g transform="translate(0, 0)">
          <rect x="400" y="80" width="260" height="140" rx="8" className="fill-blue-50 dark:fill-blue-900/10" stroke="#3b82f6" strokeWidth="1" />
          <text x="530" y="105" textAnchor="middle" fontSize="12" fontWeight="700" fill="#3b82f6">Above 200\u00B0C</text>
          <text x="530" y="125" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Steam cushion forms</text>
          <text x="530" y="140" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">\u2192 droplet floats and skitters</text>
          <text x="530" y="160" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Survives for 30+ seconds</text>
          {/* Hovering drop icon */}
          <ellipse cx="530" cy="190" rx="20" ry="10" fill="#3b82f6" opacity="0.2" />
          <line x1="510" y1="205" x2="550" y2="205" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
        </g>

        {/* Bottom callout */}
        <rect x="120" y="335" width="460" height="38" rx="6" className="fill-amber-50 dark:fill-amber-900/15" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="354" textAnchor="middle" fontSize="11" fontWeight="500" className="fill-gray-700 dark:fill-slate-200">Firewalkers may benefit from a similar effect: moisture on the foot creates a brief vapor barrier</text>
        <text x="350" y="366" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">(but charcoal\u2019s low conductivity and brief contact time matter more)</text>
      </svg>
    </div>
  );
}
