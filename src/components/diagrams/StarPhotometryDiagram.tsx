export default function StarPhotometryDiagram() {
  const filters = [
    { name: 'U (Ultraviolet)', color: '#7c3aed', peak: '365nm', x: 120, barH: 70 },
    { name: 'B (Blue)', color: '#3b82f6', peak: '440nm', x: 260, barH: 90 },
    { name: 'V (Visual)', color: '#22c55e', peak: '550nm', x: 400, barH: 60 },
  ];

  return (
    <svg viewBox="0 0 546 327" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Photometry basics showing U B V filters measuring star brightness">
      <rect width="520" height="300" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Photometry: Measuring Star Colors</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Same star looks different through each filter</text>

      {/* Star at top */}
      <circle cx="260" cy="75" r="8" fill="#fde68a" />
      <circle cx="260" cy="75" r="14" fill="#fde68a" opacity={0.15} />
      <text x="260" y="62" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="600">Star (like our Sun)</text>

      {/* Light beams to each filter */}
      {filters.map((f) => (
        <line key={f.name} x1="260" y1="83" x2={f.x} y2="108" stroke="#fef3c7" strokeWidth="1" opacity={0.3} />
      ))}

      {filters.map((f) => (
        <g key={f.name}>
          {/* Filter */}
          <rect x={f.x - 30} y="110" width="60" height="22" rx="4" fill={f.color} opacity={0.3} stroke={f.color} strokeWidth="1.5" />
          <text x={f.x} y="125" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600">{f.name.split(' ')[0]}</text>

          {/* Result brightness bar */}
          <rect x={f.x - 15} y={200 - f.barH} width="30" height={f.barH} rx="3" fill={f.color} opacity={0.6} />
          <rect x={f.x - 15} y={200 - f.barH} width="30" height="3" rx="1" fill={f.color} />

          {/* Label below bar */}
          <text x={f.x} y="215" textAnchor="middle" fill={f.color} fontSize="10" fontWeight="600">{f.name}</text>
          <text x={f.x} y="228" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">peak {f.peak}</text>

          {/* Arrow from filter to bar */}
          <line x1={f.x} y1="135" x2={f.x} y2={197 - f.barH} stroke={f.color} strokeWidth="1" strokeDasharray="3,2" opacity={0.5} />
        </g>
      ))}

      {/* Baseline */}
      <line x1="80" y1="200" x2="440" y2="200" stroke="#334155" strokeWidth="1" />

      {/* Color index explanation */}
      <rect x="90" y="242" width="340" height="48" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="260" y="260" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600">Color Index (B - V)</text>
      <text x="260" y="277" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Blue star → negative B-V | Red star → positive B-V</text>
    </svg>
  );
}
