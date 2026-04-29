export default function LotusNanobumpsDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 720 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Lotus leaf surface at three zoom levels: leaf, microscale bumps, and nanoscale wax tubules">
        <rect width="720" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="360" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Why Lotus Leaves Repel Water</text>
        <text x="360" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Zoom in: the secret is dual-scale roughness — bumps on bumps</text>

        {/* ZOOM LEVEL 1: Leaf with droplet */}
        <rect x="30" y="70" width="200" height="180" rx="8" className="fill-green-50 dark:fill-green-900/10" stroke="#22c55e" strokeWidth="1" />
        <text x="130" y="92" textAnchor="middle" fontSize="12" fontWeight="600" fill="#22c55e">Naked eye</text>
        {/* Leaf shape */}
        <ellipse cx="130" cy="170" rx="70" ry="35" fill="#22c55e" opacity="0.2" stroke="#22c55e" strokeWidth="1" />
        {/* Water droplet */}
        <ellipse cx="130" cy="148" rx="14" ry="12" fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1" />
        <text x="130" y="225" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Water beads up</text>
        <text x="130" y="238" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">and rolls off</text>

        {/* Arrow */}
        <line x1="235" y1="160" x2="260" y2="160" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#zoomArr)" />
        <defs><marker id="zoomArr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" className="fill-gray-400 dark:fill-slate-500" /></marker></defs>

        {/* ZOOM LEVEL 2: Microscale bumps (papillae) */}
        <rect x="260" y="70" width="200" height="180" rx="8" className="fill-green-50 dark:fill-green-900/10" stroke="#22c55e" strokeWidth="1" />
        <text x="360" y="92" textAnchor="middle" fontSize="12" fontWeight="600" fill="#22c55e">Microscope (×500)</text>
        {/* Bumps */}
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <ellipse key={i} cx={290 + i * 20} cy="185" rx="8" ry="14" fill="#22c55e" opacity="0.2" stroke="#16a34a" strokeWidth="1" />
        ))}
        {/* Droplet sitting on tips */}
        <ellipse cx="360" cy="150" rx="30" ry="22" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" strokeWidth="1" />
        {/* Air pockets */}
        <text x="360" y="210" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Air trapped between bumps</text>
        <text x="360" y="225" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Bumps: 10–20 µm tall</text>
        <text x="360" y="238" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Only tips touch water (&lt;3%)</text>

        {/* Arrow */}
        <line x1="465" y1="160" x2="490" y2="160" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#zoomArr)" />

        {/* ZOOM LEVEL 3: Nanoscale wax tubules */}
        <rect x="490" y="70" width="200" height="180" rx="8" className="fill-green-50 dark:fill-green-900/10" stroke="#22c55e" strokeWidth="1" />
        <text x="590" y="92" textAnchor="middle" fontSize="12" fontWeight="600" fill="#22c55e">Electron micro (×5000)</text>
        {/* Single bump with wax tubules */}
        <ellipse cx="590" cy="190" rx="50" ry="20" fill="#22c55e" opacity="0.15" stroke="#16a34a" strokeWidth="1" />
        {/* Tiny tubules */}
        {[-30, -18, -6, 6, 18, 30].map((dx, i) => (
          <g key={i}>
            <line x1={590 + dx} y1="175" x2={590 + dx} y2="160" stroke="#65a30d" strokeWidth="1.5" />
            <circle cx={590 + dx} cy="158" r="2" fill="#65a30d" />
          </g>
        ))}
        <text x="590" y="225" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Wax tubules: ~100 nm</text>
        <text x="590" y="238" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Make bumps non-stick</text>

        {/* Contact angle comparison */}
        <rect x="60" y="280" width="280" height="110" rx="8" className="fill-blue-50 dark:fill-blue-900/10" stroke="#3b82f6" strokeWidth="1" />
        <text x="200" y="300" textAnchor="middle" fontSize="12" fontWeight="600" fill="#3b82f6">Contact Angle</text>

        {/* Normal surface ~70\u00B0 */}
        <line x1="100" y1="370" x2="200" y2="370" className="stroke-gray-400 dark:stroke-slate-500" strokeWidth="1.5" />
        <ellipse cx="150" cy="355" rx="30" ry="15" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" strokeWidth="1" />
        <text x="150" y="340" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Normal: ~70°</text>

        {/* Lotus surface >150\u00B0 */}
        <line x1="220" y1="370" x2="320" y2="370" className="stroke-gray-400 dark:stroke-slate-500" strokeWidth="1.5" />
        <circle cx="270" cy="356" r="12" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" strokeWidth="1" />
        <text x="270" y="340" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Lotus: &gt;150°</text>

        {/* Engineering box */}
        <rect x="380" y="280" width="290" height="110" rx="8" className="fill-amber-50 dark:fill-amber-900/10" stroke="#f59e0b" strokeWidth="1" />
        <text x="525" y="300" textAnchor="middle" fontSize="12" fontWeight="600" fill="#f59e0b">Lotus Effect in Engineering</text>
        {['\u2022 Self-cleaning glass', '\u2022 Stain-proof fabrics', '\u2022 Anti-icing aircraft coatings', '\u2022 Anti-corrosion metal surfaces'].map((t, i) => (
          <text key={i} x="410" y={320 + i * 17} fontSize="11" className="fill-gray-600 dark:fill-slate-300">{t}</text>
        ))}
      </svg>
    </div>
  );
}
