/**
 * How a child (and a classifier) learns "dog": extract features, weight them,
 * combine into a decision. Shows features on the left flowing through weights
 * into a classifier that outputs "Dog".
 *
 * Used in the "How a Child Learns Dog" section of the machine-learning guide.
 */
export default function MLFeatureLearningDiagram() {
  const W = 760, H = 400;

  const features = [
    { label: 'Barks', weight: 'high', wText: '0.9', y: 120 },
    { label: 'Wags tail', weight: 'high', wText: '0.8', y: 178 },
    { label: 'Has fur', weight: 'low', wText: '0.2', y: 236 },
    { label: 'Colour', weight: 'low', wText: '0.0', y: 294 },
  ];

  const hubX = 470, hubY = 207;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Features such as barks and wags tail flow through weights into a classifier that outputs Dog. Strong predictors get high weights; weak ones get low weights.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="380" height="44" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="33" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Learning = extract features, then weight them</text>
        <text x="32" y="50" fontSize="11" fill="#475569" className="dark:fill-gray-300">Strong predictors get big weights; weak ones get small weights.</text>

        {/* Column headers — sit in the gap between caption (ends y=58) and first row box (top y=102) */}
        <text x="110" y="92" textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">FEATURES</text>
        <text x="300" y="92" textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">WEIGHTS</text>

        {/* Feature boxes + weight edges */}
        {features.map((f, i) => {
          const high = f.weight === 'high';
          const stroke = high ? '#16a34a' : '#94a3b8';
          const sw = high ? 4 : 1.5;
          return (
            <g key={i}>
              <rect x="30" y={f.y - 18} width="160" height="36" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
              <text x="110" y={f.y + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill="#0f172a" className="dark:fill-gray-100">{f.label}</text>
              {/* edge to hub */}
              <line x1="190" y1={f.y} x2={hubX - 38} y2={hubY} stroke={stroke} strokeWidth={sw} strokeDasharray={high ? undefined : '5 4'} />
              {/* weight pill at midpoint */}
              <rect x="270" y={(f.y + hubY) / 2 - 12} width="60" height="22" rx="11" fill={high ? '#dcfce7' : '#f1f5f9'} stroke={high ? '#16a34a' : '#94a3b8'} strokeWidth="1" className={high ? 'dark:fill-green-900/40' : 'dark:fill-gray-700'} />
              <text x="300" y={(f.y + hubY) / 2 + 3} textAnchor="middle" fontSize="11" fontWeight="700" fill={high ? '#15803d' : '#64748b'} className={high ? 'dark:fill-green-300' : 'dark:fill-gray-300'}>w={f.wText}</text>
            </g>
          );
        })}

        {/* Classifier hub */}
        <circle cx={hubX} cy={hubY} r="38" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
        <text x={hubX} y={hubY - 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">combine</text>
        <text x={hubX} y={hubY + 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">+ decide</text>

        {/* Output arrow */}
        <line x1={hubX + 38} y1={hubY} x2={620} y2={hubY} stroke="#f97316" strokeWidth="3" markerEnd="url(#mlfl-arrow)" />
        <rect x="620" y={hubY - 26} width="110" height="52" rx="10" fill="#fff7ed" stroke="#f97316" strokeWidth="2" className="dark:fill-orange-900/30 dark:stroke-orange-400" />
        <text x="675" y={hubY - 4} textAnchor="middle" fontSize="14" fontWeight="800" fill="#c2410c" className="dark:fill-orange-300">"Dog"</text>
        <text x="675" y={hubY + 14} textAnchor="middle" fontSize="10" fill="#9a3412" className="dark:fill-orange-200">confident</text>

        <defs>
          <marker id="mlfl-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 Z" fill="#f97316" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
