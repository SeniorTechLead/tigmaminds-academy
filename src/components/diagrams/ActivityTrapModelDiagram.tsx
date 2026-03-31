export default function ActivityTrapModelDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 400" className="w-full max-w-lg mx-auto" role="img" aria-label="Step-by-step instructions for building a pitcher plant trap model from household materials">
        <rect width="560" height="400" rx="12" className="fill-slate-900" />
        <text x="280" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Build a Pitcher Plant Trap Model</text>
        <text x="280" y="46" textAnchor="middle" fontSize="10" className="fill-slate-400">Test which design features capture the most "insects" (small beads)</text>

        {/* Step 1 */}
        <g transform="translate(20, 70)">
          <circle cx="15" cy="15" r="15" fill="#22c55e" opacity="0.2" stroke="#22c55e" strokeWidth="1.5" />
          <text x="15" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#22c55e">1</text>
          <text x="40" y="12" fontSize="10" fontWeight="bold" fill="#86efac">Roll paper into a cone</text>
          <text x="40" y="26" fontSize="9" className="fill-slate-400">Use A4 paper. Make 3 cones with different rim angles: narrow, medium, wide.</text>

          {/* Three cones */}
          {[{w: 15, label: 'Narrow'}, {w: 25, label: 'Medium'}, {w: 40, label: 'Wide'}].map((c, i) => (
            <g key={i} transform={`translate(\${190 + i * 95}, -5)`}>
              <path d={`M ${-c.w},0 L 0,50 L ${c.w},0`} fill="none" stroke="#86efac" strokeWidth="1.5" />
              <ellipse cx="0" cy="0" rx={c.w} ry="6" fill="none" stroke="#86efac" strokeWidth="1" />
              <text x="0" y="60" textAnchor="middle" fontSize="8" className="fill-slate-400">{c.label}</text>
            </g>
          ))}
        </g>

        {/* Step 2 */}
        <g transform="translate(20, 150)">
          <circle cx="15" cy="15" r="15" fill="#38bdf8" opacity="0.2" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="15" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#38bdf8">2</text>
          <text x="40" y="12" fontSize="10" fontWeight="bold" fill="#38bdf8">Test different rim coatings</text>
          <text x="40" y="26" fontSize="9" className="fill-slate-400">Coat the inner rim of each with: (A) nothing, (B) cooking oil, (C) oil + water spray</text>

          {/* Coating comparison */}
          {[{label: 'A: Dry', color: '#6b7280'}, {label: 'B: Oily', color: '#fbbf24'}, {label: 'C: Oily + Wet', color: '#38bdf8'}].map((c, i) => (
            <g key={i} transform={`translate(\${210 + i * 100}, 5)`}>
              <rect x="-30" y="-8" width="60" height="20" rx="4" fill={c.color} opacity="0.15" stroke={c.color} strokeWidth="1" />
              <text x="0" y="6" textAnchor="middle" fontSize="9" fontWeight="bold" fill={c.color}>{c.label}</text>
            </g>
          ))}
        </g>

        {/* Step 3 */}
        <g transform="translate(20, 220)">
          <circle cx="15" cy="15" r="15" fill="#fbbf24" opacity="0.2" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="15" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fbbf24">3</text>
          <text x="40" y="12" fontSize="10" fontWeight="bold" fill="#fbbf24">Drop "insects" and count captures</text>
          <text x="40" y="26" fontSize="9" className="fill-slate-400">Roll 10 small beads (or rice grains) down the rim of each cone. Record how many fall in.</text>

          {/* Data table */}
          <g transform="translate(180, -5)">
            <rect x="0" y="0" width="300" height="70" rx="4" className="fill-slate-800" stroke="#475569" strokeWidth="1" />
            {/* Headers */}
            <text x="10" y="18" fontSize="9" fontWeight="bold" fill="#fbbf24">Cone</text>
            <text x="80" y="18" fontSize="9" fontWeight="bold" fill="#fbbf24">Dry</text>
            <text x="150" y="18" fontSize="9" fontWeight="bold" fill="#fbbf24">Oily</text>
            <text x="220" y="18" fontSize="9" fontWeight="bold" fill="#fbbf24">Oily+Wet</text>
            <line x1="0" y1="24" x2="300" y2="24" stroke="#475569" strokeWidth="0.5" />
            {/* Rows */}
            {['Narrow', 'Medium', 'Wide'].map((label, r) => (
              <g key={r}>
                <text x="10" y={40 + r * 15} fontSize="8" className="fill-slate-400">{label}</text>
                <text x="90" y={40 + r * 15} fontSize="8" className="fill-slate-500">__/10</text>
                <text x="160" y={40 + r * 15} fontSize="8" className="fill-slate-500">__/10</text>
                <text x="230" y={40 + r * 15} fontSize="8" className="fill-slate-500">__/10</text>
              </g>
            ))}
          </g>
        </g>

        {/* Step 4 */}
        <g transform="translate(20, 310)">
          <circle cx="15" cy="15" r="15" fill="#a78bfa" opacity="0.2" stroke="#a78bfa" strokeWidth="1.5" />
          <text x="15" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#a78bfa">4</text>
          <text x="40" y="12" fontSize="10" fontWeight="bold" fill="#a78bfa">Compare and conclude</text>
          <text x="40" y="26" fontSize="9" className="fill-slate-400">Which combination caught the most? Does wider rim help or hurt? Does wetness matter?</text>
        </g>

        {/* Bottom prediction */}
        <g transform="translate(280, 365)">
          <rect x="-250" y="-8" width="500" height="30" rx="6" fill="#fbbf24" opacity="0.1" stroke="#fbbf24" strokeWidth="1" />
          <text x="0" y="10" textAnchor="middle" fontSize="10" fill="#fbbf24">Prediction: the oily + wet coating on a medium cone should win — just like a real pitcher!</text>
        </g>
      </svg>
    </div>
  );
}
