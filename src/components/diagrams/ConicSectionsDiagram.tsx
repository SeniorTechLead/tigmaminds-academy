export default function ConicSectionsDiagram() {
  const sections = [
    { label: 'Circle', angle: 'Horizontal cut', color: 'stroke-blue-500 dark:stroke-blue-400', fill: 'fill-blue-100 dark:fill-blue-900/30' },
    { label: 'Ellipse', angle: 'Tilted cut', color: 'stroke-emerald-500 dark:stroke-emerald-400', fill: 'fill-emerald-100 dark:fill-emerald-900/30' },
    { label: 'Parabola', angle: 'Parallel to edge', color: 'stroke-amber-500 dark:stroke-amber-400', fill: 'fill-amber-100 dark:fill-amber-900/30' },
    { label: 'Hyperbola', angle: 'Steep vertical cut', color: 'stroke-red-500 dark:stroke-red-400', fill: 'fill-red-100 dark:fill-red-900/30' },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 540 300" className="w-full max-w-xl mx-auto" role="img" aria-label="Conic sections diagram">
        {/* Title */}
        <text x="270" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Conic Sections: Slicing a Cone
        </text>

        {sections.map((s, i) => {
          const gx = 10 + i * 135;
          return (
            <g key={s.label} transform={`translate(${gx}, 30)`}>
              {/* Cone */}
              <polygon points="60,10 20,100 100,100"
                fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
              {/* Cone bottom ellipse */}
              <ellipse cx="60" cy="100" rx="40" ry="8"
                fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />

              {/* Slice lines */}
              {i === 0 && (
                <line x1="25" y1="65" x2="95" y2="65" className={s.color} strokeWidth="2" strokeDasharray="4,3" />
              )}
              {i === 1 && (
                <line x1="30" y1="50" x2="90" y2="80" className={s.color} strokeWidth="2" strokeDasharray="4,3" />
              )}
              {i === 2 && (
                <line x1="40" y1="20" x2="78" y2="100" className={s.color} strokeWidth="2" strokeDasharray="4,3" />
              )}
              {i === 3 && (
                <line x1="55" y1="10" x2="55" y2="100" className={s.color} strokeWidth="2" strokeDasharray="4,3" />
              )}

              {/* Result shape below */}
              <g transform="translate(0, 120)">
                {i === 0 && (
                  <circle cx="60" cy="40" r="25" className={`${s.fill} ${s.color}`} strokeWidth="2" />
                )}
                {i === 1 && (
                  <ellipse cx="60" cy="40" rx="35" ry="20" className={`${s.fill} ${s.color}`} strokeWidth="2" />
                )}
                {i === 2 && (
                  <path d="M 30,70 Q 60,0 90,70" fill="none" className={s.color} strokeWidth="2" />
                )}
                {i === 3 && (
                  <g>
                    <path d="M 35,15 Q 60,35 35,60" fill="none" className={s.color} strokeWidth="2" />
                    <path d="M 85,15 Q 60,35 85,60" fill="none" className={s.color} strokeWidth="2" />
                  </g>
                )}
              </g>

              {/* Labels */}
              <text x="60" y="205" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">
                {s.label}
              </text>
              <text x="60" y="220" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
                {s.angle}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
