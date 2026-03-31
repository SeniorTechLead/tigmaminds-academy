export default function DeerOpticalIllusionDiagram() {
  return (
    <div className="bg-gray-900 rounded-xl p-4 my-4">
      <p className="text-center text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
        How Your Eyes Can Be Tricked — Optical Illusions
      </p>
      <svg viewBox="0 0 640 360" className="w-full max-w-2xl mx-auto">
        {/* LEFT: Simultaneous contrast — same gray looks different */}
        <text x="160" y="24" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f472b6">
          Same Colour, Different Perception
        </text>

        {/* Dark background square */}
        <rect x="40" y="45" width="110" height="110" rx={6} fill="#1a1a2e" />
        <rect x="70" y="70" width="50" height="50" rx={3} fill="#808080" />
        <text x="95" y="140" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">on dark</text>

        {/* Light background square */}
        <rect x="170" y="45" width="110" height="110" rx={6} fill="#e0e0e0" />
        <rect x="200" y="70" width="50" height="50" rx={3} fill="#808080" />
        <text x="225" y="140" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">on light</text>

        {/* Arrow and label */}
        <line x1="130" y1="95" x2="190" y2="95" stroke="#f472b6" strokeWidth={1.5} strokeDasharray="4,3" />
        <text x="160" y="175" textAnchor="middle" fontSize="10" fill="#f472b6">Both inner squares are</text>
        <text x="160" y="188" textAnchor="middle" fontSize="10" fontWeight="700" fill="#f472b6">identical grey (#808080)</text>
        <text x="160" y="205" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">Your brain judges brightness</text>
        <text x="160" y="218" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">relative to surroundings.</text>

        {/* Divider */}
        <line x1="320" y1="15" x2="320" y2="230" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

        {/* RIGHT: Müller-Lyer illusion */}
        <text x="480" y="24" textAnchor="middle" fontSize="12" fontWeight="700" fill="#34d399">
          Müller-Lyer Illusion
        </text>

        {/* Line A with outward arrows (looks longer) */}
        <line x1="370" y1="80" x2="590" y2="80" stroke="white" strokeWidth={2.5} />
        <line x1="370" y1="80" x2="390" y2="65" stroke="#34d399" strokeWidth={2} />
        <line x1="370" y1="80" x2="390" y2="95" stroke="#34d399" strokeWidth={2} />
        <line x1="590" y1="80" x2="570" y2="65" stroke="#34d399" strokeWidth={2} />
        <line x1="590" y1="80" x2="570" y2="95" stroke="#34d399" strokeWidth={2} />
        <text x="620" y="84" fontSize="10" fill="#34d399">A</text>

        {/* Line B with inward arrows (looks shorter) */}
        <line x1="370" y1="130" x2="590" y2="130" stroke="white" strokeWidth={2.5} />
        <line x1="370" y1="130" x2="350" y2="115" stroke="#f472b6" strokeWidth={2} />
        <line x1="370" y1="130" x2="350" y2="145" stroke="#f472b6" strokeWidth={2} />
        <line x1="590" y1="130" x2="610" y2="115" stroke="#f472b6" strokeWidth={2} />
        <line x1="590" y1="130" x2="610" y2="145" stroke="#f472b6" strokeWidth={2} />
        <text x="620" y="134" fontSize="10" fill="#f472b6">B</text>

        <text x="480" y="168" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-gray-400">
          Both lines are exactly the same length.
        </text>
        <text x="480" y="183" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
          Arrow direction tricks your brain about size.
        </text>

        {/* BOTTOM: How the eye works */}
        <rect x="20" y="240" width="600" height="105" rx={8} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        <text x="320" y="262" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fbbf24">
          Why Illusions Work — The Eye-Brain Pipeline
        </text>

        {/* Pipeline boxes */}
        {[
          { x: 40, label: 'Light enters', sub: 'Cornea focuses', color: '#38bdf8' },
          { x: 160, label: 'Retina detects', sub: '130M rods + 6M cones', color: '#22c55e' },
          { x: 290, label: 'Signals travel', sub: 'Optic nerve (1M fibres)', color: '#a78bfa' },
          { x: 430, label: 'Brain interprets', sub: 'Makes assumptions!', color: '#f472b6' },
        ].map((step, i) => (
          <g key={i}>
            <rect x={step.x} y={275} width={115} height={50} rx={6} fill="rgba(255,255,255,0.04)" stroke={step.color} strokeWidth={1} />
            <text x={step.x + 57} y={295} textAnchor="middle" fontSize="10" fontWeight="700" fill={step.color}>{step.label}</text>
            <text x={step.x + 57} y={310} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-gray-400">{step.sub}</text>
            {i < 3 && (
              <text x={step.x + 127} y={300} textAnchor="middle" fontSize="14" className="fill-gray-500 dark:fill-gray-500">{'→'}</text>
            )}
          </g>
        ))}

        <text x="320" y="340" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
          Illusions happen at step 4 — the brain fills gaps and makes shortcuts that can be wrong.
        </text>
      </svg>
    </div>
  );
}
