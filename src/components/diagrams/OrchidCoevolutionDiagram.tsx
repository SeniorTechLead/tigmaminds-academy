export default function OrchidCoevolutionDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 440" className="w-full max-w-lg mx-auto" role="img" aria-label="Diagram showing co-evolution between Darwin orchid and hawk moth, illustrating the arms race of spur length and tongue length">
        <rect width="560" height="440" rx="12" className="fill-slate-900" />
        <text x="280" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#22c55e">Co-evolution Arms Race</text>
        <text x="280" y="46" textAnchor="middle" fontSize="10" className="fill-slate-400">When two species push each other to evolve — Darwin{"'"}s orchid and hawk moth</text>

        {/* Timeline of escalation */}
        <g transform="translate(50, 75)">
          <text x="230" y="0" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#e2e8f0">The Escalation</text>

          {/* Steps */}
          {[
            { label: 'Step 1', orchid: 'Short spur (5 cm)', moth: 'Short tongue (5 cm)', spurLen: 30, tongueLen: 30, color: '#86efac' },
            { label: 'Step 2', orchid: 'Deeper spur (10 cm)', moth: 'Longer tongue (10 cm)', spurLen: 55, tongueLen: 55, color: '#4ade80' },
            { label: 'Step 3', orchid: 'Very deep spur (20 cm)', moth: 'Very long tongue (20 cm)', spurLen: 90, tongueLen: 90, color: '#22c55e' },
            { label: 'Step 4', orchid: '30 cm spur!', moth: '30 cm tongue!', spurLen: 120, tongueLen: 120, color: '#15803d' },
          ].map((step, i) => (
            <g key={i} transform={`translate(${i * 115}, 20)`}>
              <text x="50" y="0" textAnchor="middle" fontSize="10" fontWeight="bold" fill={step.color}>{step.label}</text>

              {/* Orchid flower */}
              <ellipse cx="30" cy="25" rx="14" ry="10" fill="#e879f9" opacity="0.5" />
              <ellipse cx="50" cy="22" rx="14" ry="10" fill="#e879f9" opacity="0.5" />
              <ellipse cx="70" cy="25" rx="14" ry="10" fill="#e879f9" opacity="0.5" />
              <circle cx="50" cy="30" r="6" fill="#c026d3" opacity="0.7" />

              {/* Spur (tube going down) */}
              <rect x="47" y="36" width="6" height={step.spurLen} rx="2" fill="#a855f7" opacity="0.6" />
              <circle cx="50" cy={36 + step.spurLen} r="4" fill="#fbbf24" opacity="0.8" />

              {/* Moth tongue (dashed line) */}
              <line x1="50" y1="30" x2="50" y2={30 + step.tongueLen + 6} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />

              <text x="50" y={Math.max(step.spurLen + 58, 100)} textAnchor="middle" fontSize="7" className="fill-slate-400">{step.orchid}</text>
              <text x="50" y={Math.max(step.spurLen + 70, 112)} textAnchor="middle" fontSize="7" fill="#f59e0b">{step.moth}</text>
            </g>
          ))}

          {/* Arrows between steps */}
          {[0, 1, 2].map((i) => (
            <g key={`arrow${i}`}>
              <line x1={i * 115 + 95} y1="50" x2={i * 115 + 110} y2="50" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrowGray)" />
            </g>
          ))}
        </g>

        {/* Darwin's prediction */}
        <g transform="translate(30, 270)">
          <rect x="0" y="0" width="240" height="100" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="1" />
          <text x="120" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#22c55e">Darwin (1862)</text>
          <text x="120" y="38" textAnchor="middle" fontSize="9" fill="#e2e8f0">&quot;There must exist a moth</text>
          <text x="120" y="50" textAnchor="middle" fontSize="9" fill="#e2e8f0">with a 30 cm tongue.&quot;</text>
          <text x="120" y="68" textAnchor="middle" fontSize="9" fill="#94a3b8">Predicted from the orchid{"'"}s</text>
          <text x="120" y="80" textAnchor="middle" fontSize="9" fill="#94a3b8">30 cm nectar spur alone.</text>
          <text x="120" y="96" textAnchor="middle" fontSize="8" fill="#fbbf24">He was ridiculed.</text>
        </g>

        {/* Arrow connecting */}
        <line x1="275" y1="320" x2="295" y2="320" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrowGray)" />

        {/* Discovery */}
        <g transform="translate(300, 270)">
          <rect x="0" y="0" width="230" height="100" rx="8" fill="#1e293b" stroke="#fbbf24" strokeWidth="1" />
          <text x="115" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">Discovered (1903)</text>
          <text x="115" y="38" textAnchor="middle" fontSize="9" fill="#e2e8f0">Xanthopan morganii praedicta</text>
          <text x="115" y="54" textAnchor="middle" fontSize="9" fill="#e2e8f0">Hawk moth with 30 cm proboscis</text>
          <text x="115" y="72" textAnchor="middle" fontSize="9" fill="#94a3b8">Found 41 years after</text>
          <text x="115" y="84" textAnchor="middle" fontSize="9" fill="#94a3b8">Darwin{"'"}s prediction.</text>
          <text x="115" y="96" textAnchor="middle" fontSize="8" fill="#22c55e">He was right.</text>
        </g>

        {/* Why it matters */}
        <g transform="translate(280, 395)">
          <text x="0" y="0" textAnchor="middle" fontSize="10" fill="#94a3b8">Co-evolution = each species drives the other to evolve.</text>
          <text x="0" y="14" textAnchor="middle" fontSize="10" fill="#94a3b8">Beautiful precision — but dangerous fragility if one partner disappears.</text>
        </g>

        <defs>
          <marker id="arrowGray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#475569" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
