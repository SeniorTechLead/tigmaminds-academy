export default function StarInverseSquareDiagram() {
  return (
    <svg viewBox="0 0 546 315" className="w-full max-w-2xl mx-auto my-4" role="img" aria-label="Inverse square law showing light spreading over larger area with distance">
      <rect width="520" height="280" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Inverse Square Law of Light</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Why farther stars look dimmer</text>

      {/* Light source (star) */}
      <circle cx="60" cy="150" r="10" fill="#fef3c7" />
      <circle cx="60" cy="150" r="16" fill="#fef3c7" opacity={0.15} />
      <text x="60" y="130" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">Star</text>

      {/* Light cone lines */}
      <line x1="70" y1="142" x2="480" y2="75" stroke="#fef3c7" strokeWidth="0.8" opacity={0.3} />
      <line x1="70" y1="158" x2="480" y2="225" stroke="#fef3c7" strokeWidth="0.8" opacity={0.3} />

      {/* Fill the cone */}
      <polygon points="70,142 480,75 480,225 70,158" fill="#fef3c7" opacity={0.04} />

      {/* Distance 1 screen */}
      <g>
        <rect x="170" y="134" width="4" height="32" rx="1" fill="#fbbf24" opacity={0.8} />
        <text x="172" y="128" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600">1d</text>
        <text x="172" y="180" textAnchor="middle" fill="#fbbf24" fontSize="9">1 unit²</text>
        <text x="172" y="192" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="700">100%</text>
      </g>

      {/* Distance 2 screen */}
      <g>
        <rect x="280" y="118" width="4" height="64" rx="1" fill="#f59e0b" opacity={0.6} />
        <text x="282" y="112" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600">2d</text>
        <text x="282" y="198" textAnchor="middle" fill="#f59e0b" fontSize="9">4 units²</text>
        <text x="282" y="210" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="700">25%</text>

        {/* Grid to show 4 squares */}
        <line x1="280" y1="150" x2="284" y2="150" stroke="#f59e0b" strokeWidth="0.5" opacity={0.5} />
      </g>

      {/* Distance 3 screen */}
      <g>
        <rect x="390" y="102" width="4" height="96" rx="1" fill="#d97706" opacity={0.4} />
        <text x="392" y="96" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600">3d</text>
        <text x="392" y="214" textAnchor="middle" fill="#d97706" fontSize="9">9 units²</text>
        <text x="392" y="226" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="700">11%</text>
      </g>

      {/* Distance ruler */}
      <line x1="60" y1="240" x2="390" y2="240" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
      {[60, 172, 282, 392].map((x) => (
        <line key={x} x1={x} y1="237" x2={x} y2="243" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
      ))}

      {/* Formula box */}
      <rect x="300" y="248" width="200" height="26" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="400" y="265" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600">Brightness = 1 / distance²</text>
    </svg>
  );
}
