export default function AerenchymaCrossDiagram() {
  // Air channels in a lotus stem cross-section
  const channels: { cx: number; cy: number; r: number }[] = [
    { cx: 350, cy: 200, r: 28 },
    { cx: 300, cy: 170, r: 22 },
    { cx: 400, cy: 170, r: 22 },
    { cx: 310, cy: 230, r: 20 },
    { cx: 390, cy: 230, r: 20 },
    { cx: 350, cy: 148, r: 18 },
    { cx: 350, cy: 252, r: 16 },
    { cx: 275, cy: 200, r: 16 },
    { cx: 425, cy: 200, r: 16 },
    { cx: 340, cy: 270, r: 12 },
    { cx: 360, cy: 270, r: 12 },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Cross-section of a lotus stem showing aerenchyma air channels that provide buoyancy and oxygen transport">
        <rect width="700" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Aerenchyma: Air Highways in Lotus Stems</text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Cross-section of a lotus petiole — up to 70% is air</text>

        {/* Outer stem wall */}
        <circle cx="350" cy="200" r="100" fill="#22c55e" opacity="0.15" stroke="#16a34a" strokeWidth="2" />
        <text x="350" y="88" textAnchor="middle" fontSize="10" fill="#16a34a" fontWeight="600">Stem wall (green tissue)</text>

        {/* Air channels */}
        {channels.map((ch, i) => (
          <circle key={i} cx={ch.cx} cy={ch.cy} r={ch.r} className="fill-white dark:fill-slate-900" stroke="#94a3b8" strokeWidth="1" opacity="0.8" />
        ))}

        {/* Label: air */}
        <text x="350" y="205" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Air</text>

        {/* Annotations */}
        {/* Left: oxygen arrow */}
        <g>
          <line x1="180" y1="140" x2="258" y2="175" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#o2arr)" />
          <defs><marker id="o2arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#3b82f6" /></marker></defs>
          <text x="130" y="130" fontSize="11" fontWeight="600" fill="#3b82f6">O₂ from air</text>
          <text x="130" y="145" fontSize="10" className="fill-gray-500 dark:fill-slate-400">↓ down to roots</text>
        </g>

        {/* Right: buoyancy */}
        <g>
          <line x1="520" y1="140" x2="442" y2="175" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#buoyArr)" />
          <defs><marker id="buoyArr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" /></marker></defs>
          <text x="520" y="125" fontSize="11" fontWeight="600" fill="#f59e0b">Built-in flotation</text>
          <text x="520" y="140" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Air = less dense than water</text>
        </g>

        {/* Dual function box */}
        <rect x="100" y="320" width="240" height="70" rx="8" className="fill-blue-50 dark:fill-blue-900/10" stroke="#3b82f6" strokeWidth="1" />
        <text x="220" y="342" textAnchor="middle" fontSize="12" fontWeight="600" fill="#3b82f6">Function 1: Oxygen Pipeline</text>
        <text x="220" y="360" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Delivers air from leaves to</text>
        <text x="220" y="374" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">submerged roots in anoxic mud</text>

        <rect x="360" y="320" width="240" height="70" rx="8" className="fill-amber-50 dark:fill-amber-900/10" stroke="#f59e0b" strokeWidth="1" />
        <text x="480" y="342" textAnchor="middle" fontSize="12" fontWeight="600" fill="#f59e0b">Function 2: Buoyancy</text>
        <text x="480" y="360" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Air channels make stems lighter</text>
        <text x="480" y="374" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">than water → leaves float up</text>

        <text x="350" y="410" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Cut a lotus stem and blow through it — you can feel the air channels!</text>
      </svg>
    </div>
  );
}
