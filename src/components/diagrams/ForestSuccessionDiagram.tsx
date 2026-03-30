export default function ForestSuccessionDiagram() {
  const stages = [
    { label: 'Bare Land', years: '0', color: '#d4a574', plants: ['Sand', 'Rock'], height: 20 },
    { label: 'Pioneer', years: '1–5', color: '#86a854', plants: ['Grasses', 'Mosses'], height: 40 },
    { label: 'Shrubs', years: '5–15', color: '#5d8a3c', plants: ['Bushes', 'Small trees'], height: 65 },
    { label: 'Young Forest', years: '15–50', color: '#3d7a2c', plants: ['Fast trees', 'Bamboo'], height: 90 },
    { label: 'Climax Forest', years: '50–200+', color: '#2d5a1c', plants: ['Canopy trees', 'Full ecosystem'], height: 120 },
  ];

  return (
    <svg viewBox="0 0 700 340" className="w-full rounded-xl">
      <rect width="700" height="340" rx="16" className="fill-white dark:fill-slate-950" />
      <text x="350" y="28" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" style={{ fontSize: 16, fontWeight: 700 }}>Ecological Succession: From Bare Land to Forest</text>

      {/* Ground line */}
      <rect x="30" y="250" width="640" height="4" rx="2" fill="#8B6F47" />

      {/* Arrow along bottom */}
      <line x1="50" y1="285" x2="640" y2="285" stroke="#6B7280" strokeWidth="2" markerEnd="url(#arrowS)" />
      <defs>
        <marker id="arrowS" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="#6B7280" />
        </marker>
      </defs>
      <text x="345" y="300" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" style={{ fontSize: 11 }}>Time (years)</text>

      {stages.map((s, i) => {
        const x = 50 + i * 130;
        const treeTop = 250 - s.height;
        return (
          <g key={i}>
            {/* Stage vegetation */}
            {i === 0 ? (
              <g>
                <rect x={x + 10} y={230} width={100} height={20} rx="4" fill={s.color} opacity={0.6} />
                <text x={x + 60} y={244} textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-900 dark:fill-slate-50">bare</text>
              </g>
            ) : i === 1 ? (
              <g>
                {[0, 20, 40, 60, 80].map((gx, gi) => (
                  <line key={gi} x1={x + 15 + gx / 5 * 20} y1={250} x2={x + 15 + gx / 5 * 20} y2={250 - 15 - Math.random() * 20} stroke={s.color} strokeWidth="2" />
                ))}
              </g>
            ) : i === 2 ? (
              <g>
                {[15, 55, 90].map((sx, si) => (
                  <g key={si}>
                    <line x1={x + sx} y1={250} x2={x + sx} y2={250 - 35 - si * 5} stroke="#6B4226" strokeWidth="3" />
                    <circle cx={x + sx} cy={250 - 40 - si * 5} r={14} fill={s.color} opacity={0.85} />
                  </g>
                ))}
              </g>
            ) : i === 3 ? (
              <g>
                {[20, 55, 85].map((tx, ti) => {
                  const th = 50 + ti * 15;
                  return (
                    <g key={ti}>
                      <rect x={x + tx - 3} y={250 - th} width={6} height={th} fill="#6B4226" />
                      <ellipse cx={x + tx} cy={250 - th - 8} rx={16} ry={14} fill={s.color} opacity={0.85} />
                    </g>
                  );
                })}
              </g>
            ) : (
              <g>
                {[15, 40, 65, 90].map((tx, ti) => {
                  const th = 70 + ti * 12;
                  return (
                    <g key={ti}>
                      <rect x={x + tx - 4} y={250 - th} width={8} height={th} fill="#5C3A1E" />
                      <ellipse cx={x + tx} cy={250 - th - 10} rx={20} ry={16} fill={s.color} opacity={0.9} />
                      {ti < 2 && <ellipse cx={x + tx + 8} cy={250 - th + 10} rx={12} ry={10} fill="#4a8a2c" opacity={0.6} />}
                    </g>
                  );
                })}
              </g>
            )}

            {/* Label */}
            <text x={x + 55} y={265} textAnchor="middle" style={{ fontSize: 11, fontWeight: 600 }} className="fill-gray-900 dark:fill-slate-50">{s.label}</text>
            <text x={x + 55} y="278" textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">{s.years} yr</text>

            {/* Plants list */}
            {s.plants.map((p, pi) => (
              <text key={pi} x={x + 55} y={310 + pi * 13} textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">{p}</text>
            ))}

            {/* Arrow between stages */}
            {i < stages.length - 1 && (
              <path d={`M${x + 110},${240} L${x + 125},${240}`} stroke="#9CA3AF" strokeWidth="1.5" markerEnd="url(#arrowS)" />
            )}
          </g>
        );
      })}
    </svg>
  );
}
