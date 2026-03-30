export default function StarLightCurveDiagram() {
  /* Eclipsing binary light curve points */
  const curvePoints: [number, number][] = [
    [0, 100], [15, 100], [25, 98], [30, 70], [35, 55], [40, 70], [45, 98],
    [55, 100], [65, 100], [75, 98], [80, 88], [85, 80], [90, 88], [95, 98],
    [105, 100], [115, 100], [125, 98], [130, 70], [135, 55], [140, 70], [145, 98],
    [155, 100], [165, 100],
  ];

  const plotX = (v: number) => 60 + v * 2.5;
  const plotY = (v: number) => 220 - v * 1.4;

  return (
    <svg viewBox="0 0 567 338" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Light curve showing brightness changes over time revealing eclipsing binary stars">
      <rect width="520" height="300" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Light Curves</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Brightness changes reveal hidden objects</text>

      {/* Plot area */}
      <rect x="55" y="60" width="420" height="170" className="fill-gray-100 dark:fill-slate-800" rx="4" />

      {/* Axes */}
      <line x1="55" y1="230" x2="475" y2="230" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
      <line x1="55" y1="60" x2="55" y2="230" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />

      <text x="260" y="252" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Time (hours) →</text>
      <text x="25" y="145" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9" transform="rotate(-90 25 145)">Brightness →</text>

      {/* Grid lines */}
      {[80, 100].map(v => (
        <line key={v} x1="56" y1={plotY(v)} x2="475" y2={plotY(v)} stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
      ))}

      {/* Light curve */}
      <polyline
        points={curvePoints.map(([x, y]) => `${plotX(x)},${plotY(y)}`).join(' ')}
        fill="none"
        stroke="#fbbf24"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {curvePoints.map(([x, y], i) => (
        <circle key={i} cx={plotX(x)} cy={plotY(y)} r="2" fill="#fbbf24" />
      ))}

      {/* Primary eclipse annotation */}
      <line x1={plotX(35)} y1={plotY(55)} x2={plotX(35)} y2={plotY(30)} stroke="#f87171" strokeWidth="0.8" strokeDasharray="2,2" />
      <text x={plotX(35)} y={plotY(25)} textAnchor="middle" fill="#f87171" fontSize="8" fontWeight="600">Primary</text>
      <text x={plotX(35)} y={plotY(19)} textAnchor="middle" fill="#f87171" fontSize="8">eclipse</text>
      <text x={plotX(35)} y={plotY(13)} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">(big star blocked)</text>

      {/* Secondary eclipse annotation */}
      <line x1={plotX(85)} y1={plotY(80)} x2={plotX(85)} y2={plotY(30)} stroke="#60a5fa" strokeWidth="0.8" strokeDasharray="2,2" />
      <text x={plotX(85)} y={plotY(25)} textAnchor="middle" fill="#60a5fa" fontSize="8" fontWeight="600">Secondary</text>
      <text x={plotX(85)} y={plotY(19)} textAnchor="middle" fill="#60a5fa" fontSize="8">eclipse</text>
      <text x={plotX(85)} y={plotY(13)} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">(small star blocked)</text>

      {/* Binary star illustration */}
      <rect x="400" y="60" width="75" height="55" rx="6" className="fill-white dark:fill-slate-950" stroke="#334155" strokeWidth="0.5" />
      <circle cx="425" cy="82" r="10" fill="#fbbf24" opacity={0.6} />
      <circle cx="455" cy="88" r="6" fill="#60a5fa" opacity={0.7} />
      <text x="437" y="72" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">Binary pair</text>
      <path d="M420,95 Q437,105 455,95" fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" strokeDasharray="2,1" />

      {/* Period annotation */}
      <line x1={plotX(30)} y1={plotY(100) - 5} x2={plotX(130)} y2={plotY(100) - 5} stroke="#22c55e" strokeWidth="1" />
      <line x1={plotX(30)} y1={plotY(100) - 8} x2={plotX(30)} y2={plotY(100) - 2} stroke="#22c55e" strokeWidth="1" />
      <line x1={plotX(130)} y1={plotY(100) - 8} x2={plotX(130)} y2={plotY(100) - 2} stroke="#22c55e" strokeWidth="1" />
      <text x={plotX(80)} y={plotY(100) - 8} textAnchor="middle" fill="#22c55e" fontSize="8" fontWeight="600">1 Period</text>

      {/* Bottom note */}
      <rect x="60" y="260" width="400" height="32" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="260" y="275" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">Also used to detect exoplanet transits!</text>
      <text x="260" y="288" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">A tiny dip in brightness = planet passing in front of star</text>
    </svg>
  );
}
