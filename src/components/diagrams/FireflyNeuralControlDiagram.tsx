export default function FireflyNeuralControlDiagram() {
  const w = 520, h = 400;

  const steps = [
    { label: 'Brain', desc: 'Decision to flash', x: 60, y: 80, color: '#c084fc', w: 80, h: 40 },
    { label: 'Nerve Signal', desc: 'Travels to lantern', x: 60, y: 155, color: '#60a5fa', w: 100, h: 40 },
    { label: 'Nitric Oxide', desc: 'NO released in lantern', x: 60, y: 230, color: '#f59e0b', w: 100, h: 40 },
    { label: 'Mitochondria', desc: 'O₂ consumption STOPS', x: 260, y: 230, color: '#ef4444', w: 110, h: 40 },
    { label: 'O₂ Available', desc: 'Reaches photocytes', x: 260, y: 155, color: '#60a5fa', w: 100, h: 40 },
    { label: 'Luciferin + O₂', desc: 'Chemical reaction', x: 260, y: 80, color: '#a3e635', w: 100, h: 40 },
  ];

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="Neural control of firefly flashing: brain to nerve to nitric oxide to mitochondria to oxygen to luciferin to light, 50ms response">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">Neural Flash Control</text>
        <text x={w / 2} y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">How a firefly controls when to flash — 50ms response time</text>

        {/* Step boxes */}
        {steps.map((step, i) => (
          <g key={i}>
            <rect x={step.x} y={step.y} width={step.w} height={step.h} rx="8" className="fill-white dark:fill-slate-950" stroke={step.color} strokeWidth="1.5" />
            <text x={step.x + step.w / 2} y={step.y + 16} textAnchor="middle" fill={step.color} fontSize="10" fontWeight="600">{step.label}</text>
            <text x={step.x + step.w / 2} y={step.y + 30} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">{step.desc}</text>

            {/* Step number */}
            <circle cx={step.x - 8} cy={step.y + step.h / 2} r="9" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
            <text x={step.x - 8} y={step.y + step.h / 2 + 4} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8" fontWeight="600">{i + 1}</text>
          </g>
        ))}

        {/* Arrows: 1→2 (down) */}
        <line x1="100" y1="120" x2="100" y2="150" stroke="#c084fc" strokeWidth="1.5" markerEnd="url(#neuralArr)" />

        {/* 2→3 (down) */}
        <line x1="110" y1="195" x2="110" y2="225" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#neuralArr)" />

        {/* 3→4 (right) */}
        <line x1="165" y1="250" x2="255" y2="250" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#neuralArr)" />

        {/* 4→5 (up) */}
        <line x1="310" y1="225" x2="310" y2="200" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#neuralArr)" />

        {/* 5→6 (up) */}
        <line x1="310" y1="150" x2="310" y2="125" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#neuralArr)" />

        {/* Light output from step 6 */}
        <line x1="365" y1="100" x2="410" y2="100" stroke="#a3e635" strokeWidth="1.5" markerEnd="url(#neuralArr)" />

        {/* LIGHT burst */}
        <circle cx="440" cy="100" r="25" fill="#a3e635" opacity="0.06" />
        <circle cx="440" cy="100" r="16" fill="#a3e635" opacity="0.12" />
        <circle cx="440" cy="100" r="8" fill="#a3e635" opacity="0.4" />
        <text x="440" y="104" textAnchor="middle" fill="#a3e635" fontSize="9" fontWeight="700">FLASH</text>

        {/* Key insight box */}
        <rect x="200" y="290" width="290" height="40" rx="6" className="fill-white dark:fill-slate-950" stroke="#f59e0b" strokeWidth="1" />
        <text x="345" y="306" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">Key insight: NO shuts down mitochondria</text>
        <text x="345" y="320" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Normally mitochondria consume all O₂ — stopping</text>
        <text x="345" y="330" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">them lets O₂ reach the light-producing cells</text>

        {/* Timing bar */}
        <rect x="30" y="340" width="460" height="45" rx="8" className="fill-white dark:fill-slate-950" stroke="#4ade80" strokeWidth="1" />
        <text x="50" y="358" fill="#fbbf24" fontSize="10" fontWeight="600">Speed:</text>
        {/* Timeline */}
        <line x1="110" y1="355" x2="470" y2="355" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="110" y="350" className="fill-gray-500 dark:fill-slate-400" fontSize="7">0ms</text>
        <text x="180" y="350" fill="#c084fc" fontSize="7">10ms</text>
        <text x="250" y="350" fill="#60a5fa" fontSize="7">20ms</text>
        <text x="330" y="350" fill="#f59e0b" fontSize="7">30ms</text>
        <text x="400" y="350" fill="#a3e635" fontSize="7">50ms</text>
        <circle cx="110" cy="355" r="3" fill="#c084fc" />
        <circle cx="180" cy="355" r="3" fill="#60a5fa" />
        <circle cx="250" cy="355" r="3" fill="#f59e0b" />
        <circle cx="330" cy="355" r="3" fill="#ef4444" />
        <circle cx="400" cy="355" r="3" fill="#a3e635" />
        <text x="110" y="372" fill="#c084fc" fontSize="7">brain</text>
        <text x="180" y="372" fill="#60a5fa" fontSize="7">nerve</text>
        <text x="250" y="372" fill="#f59e0b" fontSize="7">NO</text>
        <text x="330" y="372" fill="#ef4444" fontSize="7">O₂ free</text>
        <text x="400" y="372" fill="#a3e635" fontSize="7" fontWeight="700">LIGHT</text>

        <defs>
          <marker id="neuralArr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" className="fill-gray-500 dark:fill-slate-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
