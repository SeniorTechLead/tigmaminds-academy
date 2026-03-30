export default function StarTwinklingDiagram() {
  return (
    <svg viewBox="0 0 570 338" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Diagram showing why stars twinkle due to atmospheric turbulence">
      <rect width="520" height="300" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Why Stars Twinkle (Scintillation)</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Stars twinkle because air bends their light</text>

      {/* Star at top */}
      <circle cx="260" cy="70" r="6" fill="#fef3c7" />
      <circle cx="260" cy="70" r="10" fill="#fef3c7" opacity={0.2} />
      <text x="260" y="62" textAnchor="middle" fill="#fbbf24" fontSize="9">★ Star</text>

      {/* Light rays from star - straight in space */}
      <line x1="245" y1="76" x2="220" y2="110" stroke="#fef3c7" strokeWidth="1.5" opacity={0.6} />
      <line x1="260" y1="76" x2="260" y2="110" stroke="#fef3c7" strokeWidth="1.5" opacity={0.6} />
      <line x1="275" y1="76" x2="300" y2="110" stroke="#fef3c7" strokeWidth="1.5" opacity={0.6} />

      {/* Space label */}
      <text x="440" y="90" textAnchor="end" className="fill-gray-400 dark:fill-slate-500" fontSize="10">SPACE</text>

      {/* Atmosphere boundary */}
      <line x1="40" y1="115" x2="480" y2="115" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,3" />
      <text x="440" y="128" textAnchor="end" fill="#3b82f6" fontSize="10">ATMOSPHERE</text>

      {/* Turbulent air pockets */}
      {[
        { cx: 180, cy: 140, label: 'Warm', color: '#f87171' },
        { cx: 260, cy: 155, label: 'Cool', color: '#60a5fa' },
        { cx: 340, cy: 138, label: 'Warm', color: '#f87171' },
        { cx: 220, cy: 175, label: 'Cool', color: '#60a5fa' },
        { cx: 300, cy: 180, label: 'Warm', color: '#f87171' },
      ].map((p, i) => (
        <g key={i}>
          <ellipse cx={p.cx} cy={p.cy} rx="35" ry="16" fill={p.color} opacity={0.12} stroke={p.color} strokeWidth="0.8" strokeDasharray="3,2" />
          <text x={p.cx} y={p.cy + 4} textAnchor="middle" fill={p.color} fontSize="8" opacity={0.7}>{p.label}</text>
        </g>
      ))}

      {/* Bent light rays through atmosphere */}
      <path d="M220,110 Q200,140 215,160 Q230,175 225,200 L210,235" stroke="#fef3c7" strokeWidth="1.5" fill="none" opacity={0.7} />
      <path d="M260,110 Q270,145 250,170 Q240,185 260,210 L265,235" stroke="#fef3c7" strokeWidth="1.5" fill="none" opacity={0.7} />
      <path d="M300,110 Q320,135 305,160 Q290,180 310,210 L315,235" stroke="#fef3c7" strokeWidth="1.5" fill="none" opacity={0.7} />

      {/* Ground */}
      <rect x="40" y="238" width="440" height="4" rx="2" fill="#334155" />

      {/* Observer */}
      <circle cx="265" cy="252" r="8" fill="#475569" />
      <line x1="265" y1="260" x2="265" y2="272" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />
      <line x1="255" y1="265" x2="275" y2="265" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />
      <text x="265" y="288" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Observer sees shimmer</text>

      {/* Annotation */}
      <rect x="370" y="160" width="130" height="52" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="435" y="177" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">Different densities</text>
      <text x="435" y="191" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">bend light different</text>
      <text x="435" y="203" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">amounts each instant</text>
    </svg>
  );
}
