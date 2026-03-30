export default function FireflyConservationDiagram() {
  const w = 520, h = 420;

  const threats = [
    {
      label: 'Light Pollution',
      desc: 'Artificial light disrupts mating signals',
      color: '#ef4444',
      solution: 'Dark sky zones',
      solDesc: 'Shield lights, use warm tones, reduce after 10pm',
    },
    {
      label: 'Habitat Loss',
      desc: 'Wetlands drained, forests cleared',
      color: '#f59e0b',
      solution: 'Wetland protection',
      solDesc: 'Preserve riverbanks, meadows, forest edges',
    },
    {
      label: 'Pesticides',
      desc: 'Insecticides kill larvae and adults',
      color: '#a78bfa',
      solution: 'Reduced pesticide use',
      solDesc: 'Organic farming, targeted application only',
    },
  ];

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Firefly conservation: threats of light pollution, habitat loss, pesticides and their solutions">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">Fireflies Are Disappearing Worldwide</text>
        <text x={w / 2} y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Understanding the threats — and what we can do</text>

        {/* Threat header */}
        <text x="130" y="72" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="600">THREATS</text>
        <text x="390" y="72" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="600">SOLUTIONS</text>

        {/* Center arrow */}
        <line x1="255" y1="85" x2="255" y2="315" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4 4" />

        {threats.map((threat, i) => {
          const y = 88 + i * 80;
          return (
            <g key={i}>
              {/* Threat box */}
              <rect x="20" y={y} width="215" height="60" rx="8" className="fill-white dark:fill-slate-950" stroke={threat.color} strokeWidth="1.5" />

              {/* Threat icon */}
              {i === 0 && (
                <g>
                  {/* Light bulb with rays */}
                  <circle cx="45" cy={y + 25} r="8" fill={threat.color} opacity="0.2" />
                  <circle cx="45" cy={y + 25} r="4" fill={threat.color} opacity="0.5" />
                  {[0, 60, 120, 180, 240, 300].map(angle => {
                    const rad = (angle * Math.PI) / 180;
                    return (
                      <line
                        key={angle}
                        x1={45 + Math.cos(rad) * 10}
                        y1={y + 25 + Math.sin(rad) * 10}
                        x2={45 + Math.cos(rad) * 15}
                        y2={y + 25 + Math.sin(rad) * 15}
                        stroke={threat.color}
                        strokeWidth="1"
                        opacity="0.4"
                      />
                    );
                  })}
                </g>
              )}
              {i === 1 && (
                <g>
                  {/* Tree stump */}
                  <rect x="38" y={y + 15} width="14" height="20" rx="2" fill={threat.color} opacity="0.4" />
                  <line x1="38" y1={y + 15} x2="52" y2={y + 15} stroke={threat.color} strokeWidth="2" />
                  {/* Cut marks */}
                  <line x1="40" y1={y + 20} x2="50" y2={y + 20} stroke={threat.color} strokeWidth="0.5" opacity="0.5" />
                  <line x1="40" y1={y + 25} x2="50" y2={y + 25} stroke={threat.color} strokeWidth="0.5" opacity="0.5" />
                </g>
              )}
              {i === 2 && (
                <g>
                  {/* Spray bottle */}
                  <rect x="40" y={y + 12} width="10" height="22" rx="2" fill={threat.color} opacity="0.3" />
                  <rect x="38" y={y + 10} width="14" height="6" rx="1" fill={threat.color} opacity="0.5" />
                  {/* Spray droplets */}
                  <circle cx="60" cy={y + 15} r="1.5" fill={threat.color} opacity="0.4" />
                  <circle cx="63" cy={y + 20} r="1" fill={threat.color} opacity="0.3" />
                  <circle cx="58" cy={y + 22} r="1.5" fill={threat.color} opacity="0.4" />
                </g>
              )}

              <text x="70" y={y + 22} fill={threat.color} fontSize="10" fontWeight="600">{threat.label}</text>
              <text x="70" y={y + 38} className="fill-gray-500 dark:fill-slate-400" fontSize="8">{threat.desc}</text>

              {/* Arrow from threat to solution */}
              <line x1="240" y1={y + 30} x2="270" y2={y + 30} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" markerEnd="url(#consArrow)" />

              {/* Solution box */}
              <rect x="280" y={y} width="215" height="60" rx="8" className="fill-white dark:fill-slate-950" stroke="#4ade80" strokeWidth="1.5" />
              <text x="300" y={y + 22} fill="#4ade80" fontSize="10" fontWeight="600">{threat.solution}</text>
              <text x="300" y={y + 38} className="fill-gray-500 dark:fill-slate-400" fontSize="8">{threat.solDesc}</text>
            </g>
          );
        })}

        {/* Majuli-specific note */}
        <rect x="30" y="335" width="460" height="35" rx="6" className="fill-white dark:fill-slate-950" stroke="#fbbf24" strokeWidth="1" />
        <text x={w / 2} y="350" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">Majuli Island, Assam: Riverbank erosion is shrinking firefly habitat</text>
        <text x={w / 2} y="364" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">The Brahmaputra floods erode 2-3 km² of Majuli each year</text>

        {/* What you can do */}
        <rect x="30" y="380" width="460" height="30" rx="6" className="fill-white dark:fill-slate-950" stroke="#4ade80" strokeWidth="1" />
        <text x={w / 2} y="400" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="600">You can help: turn off outdoor lights at night, support wetland conservation</text>

        <defs>
          <marker id="consArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#4ade80" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
