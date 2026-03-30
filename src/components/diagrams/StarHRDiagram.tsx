export default function StarHRDiagram() {
  const mainSeq = [
    { x: 100, y: 80, r: 4, fill: '#93c5fd', label: 'O/B stars' },
    { x: 150, y: 110, r: 3.5, fill: '#bfdbfe', label: '' },
    { x: 200, y: 140, r: 3, fill: '#fef9c3', label: '' },
    { x: 240, y: 160, r: 3, fill: '#fde68a', label: 'Sun ☀' },
    { x: 290, y: 185, r: 2.5, fill: '#fed7aa', label: '' },
    { x: 340, y: 210, r: 2, fill: '#fca5a5', label: '' },
    { x: 380, y: 230, r: 1.8, fill: '#f87171', label: 'M stars' },
  ];

  const redGiants = [
    { x: 300, y: 80, r: 8, fill: '#f87171' },
    { x: 340, y: 70, r: 10, fill: '#ef4444' },
    { x: 360, y: 95, r: 7, fill: '#fca5a5' },
  ];

  const whiteDwarfs = [
    { x: 130, y: 220, r: 1.5, fill: '#e0e7ff' },
    { x: 160, y: 230, r: 1.2, fill: '#c7d2fe' },
    { x: 145, y: 240, r: 1, fill: '#a5b4fc' },
  ];

  return (
    <svg viewBox="0 0 546 340" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Simplified Hertzsprung-Russell diagram showing main sequence, red giants, and white dwarfs">
      <rect width="520" height="310" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Hertzsprung-Russell Diagram</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Temperature vs Luminosity — a star's life story</text>

      {/* Axes */}
      <line x1="70" y1="55" x2="70" y2="260" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
      <line x1="70" y1="260" x2="430" y2="260" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />

      {/* Y-axis label */}
      <text x="18" y="160" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10" transform="rotate(-90 18 160)">Luminosity (brightness) →</text>
      <text x="70" y="53" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Bright</text>
      <text x="70" y="275" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Dim</text>

      {/* X-axis label */}
      <text x="250" y="290" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">← Temperature (surface)</text>
      <text x="85" y="275" fill="#93c5fd" fontSize="8">Hot</text>
      <text x="410" y="275" fill="#f87171" fontSize="8">Cool</text>

      {/* Main sequence band (background) */}
      <path d="M90,70 L120,100 L260,165 L400,240 L400,245 L260,175 L120,110 L90,80 Z" fill="#334155" opacity={0.3} />

      {/* Main sequence stars */}
      {mainSeq.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r={s.r + 3} fill={s.fill} opacity={0.15} />
          <circle cx={s.x} cy={s.y} r={s.r} fill={s.fill} />
          {s.label && (
            <text x={s.x + (s.label === 'Sun ☀' ? 0 : s.x < 200 ? 15 : -15)} y={s.y + (s.label === 'Sun ☀' ? -12 : 5)} textAnchor="middle" fill={s.fill} fontSize="9" fontWeight="600">{s.label}</text>
          )}
        </g>
      ))}

      {/* Sun pointer */}
      <line x1="240" y1="148" x2="240" y2="140" stroke="#fde68a" strokeWidth="1" strokeDasharray="2,2" />

      {/* Red giants */}
      {redGiants.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r={s.r + 4} fill={s.fill} opacity={0.1} />
          <circle cx={s.x} cy={s.y} r={s.r} fill={s.fill} opacity={0.7} />
        </g>
      ))}
      <text x="370" y="55" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="600">Red Giants</text>
      <text x="370" y="66" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">(cool but huge)</text>

      {/* White dwarfs */}
      {whiteDwarfs.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.fill} />
      ))}
      <text x="145" y="255" textAnchor="middle" fill="#a5b4fc" fontSize="9" fontWeight="600">White Dwarfs</text>
      <text x="145" y="265" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">(hot but tiny)</text>

      {/* Main sequence label */}
      <text x="200" y="200" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600" transform="rotate(-35 200 200)">Main Sequence</text>

      {/* Temperature scale indicators */}
      <text x="100" y="275" className="fill-gray-500 dark:fill-slate-400" fontSize="7">30,000K</text>
      <text x="240" y="275" className="fill-gray-500 dark:fill-slate-400" fontSize="7">5,500K</text>
      <text x="380" y="275" className="fill-gray-500 dark:fill-slate-400" fontSize="7">3,000K</text>
    </svg>
  );
}
