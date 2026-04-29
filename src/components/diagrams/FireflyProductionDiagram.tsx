export default function FireflyProductionDiagram() {
  const w = 520, h = 400;

  const steps = [
    {
      title: '1. Solder Connections',
      desc: 'Wire each LED + resistor pair',
      icon: 'solder',
      color: '#f59e0b',
    },
    {
      title: '2. Add Diffuser Paper',
      desc: 'Tissue paper softens harsh LED light',
      icon: 'diffuser',
      color: '#a3e635',
    },
    {
      title: '3. Attach LDR Sensor',
      desc: 'Auto-dim in daylight, glow at night',
      icon: 'sensor',
      color: '#60a5fa',
    },
    {
      title: '4. Test All LEDs',
      desc: 'Power on, check each LED fades smoothly',
      icon: 'test',
      color: '#4ade80',
    },
  ];

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="Production checklist: solder, add diffuser, attach LDR sensor, test LEDs">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">From Breadboard to Finished Product</text>
        <text x={w / 2} y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Production checklist for your firefly jar</text>

        {/* Progress line */}
        <line x1="70" y1="80" x2="70" y2="340" stroke="#334155" strokeWidth="2" />

        {steps.map((step, i) => {
          const y = 80 + i * 68;
          return (
            <g key={i}>
              {/* Step circle on timeline */}
              <circle cx="70" cy={y} r="14" className="fill-gray-100 dark:fill-slate-800" stroke={step.color} strokeWidth="2" />
              <text x="70" y={y + 5} textAnchor="middle" fill={step.color} fontSize="11" fontWeight="700">{i + 1}</text>

              {/* Step content box */}
              <rect x="100" y={y - 25} width="380" height="50" rx="8" className="fill-white dark:fill-slate-950" stroke={step.color} strokeWidth="1" opacity="0.8" />

              {/* Step title */}
              <text x="120" y={y - 5} fill={step.color} fontSize="12" fontWeight="600">{step.title}</text>
              <text x="120" y={y + 12} className="fill-gray-500 dark:fill-slate-400" fontSize="10">{step.desc}</text>

              {/* Step icon/illustration */}
              {step.icon === 'solder' && (
                <g>
                  {/* Soldering iron tip */}
                  <line x1="420" y1={y - 12} x2="450" y2={y + 5} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="450" cy={y + 5} r="3" fill="#fbbf24" opacity="0.8" />
                  {/* Solder joint */}
                  <circle cx="455" cy={y + 5} r="5" className="fill-gray-500 dark:fill-slate-400" opacity="0.4" />
                  {/* Wire */}
                  <line x1="455" y1={y + 5} x2="470" y2={y + 5} stroke="#4ade80" strokeWidth="1.5" />
                </g>
              )}
              {step.icon === 'diffuser' && (
                <g>
                  {/* LED behind paper */}
                  <circle cx="440" cy={y - 2} r="5" fill="#4ade80" opacity="0.8" />
                  <circle cx="440" cy={y - 2} r="10" fill="#4ade80" opacity="0.15" />
                  {/* Paper overlay */}
                  <rect x="430" y={y - 15} width="30" height="28" rx="3" className="fill-gray-700 dark:fill-slate-200" opacity="0.12" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 2" />
                  <text x="445" y={y + 18} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">paper</text>
                </g>
              )}
              {step.icon === 'sensor' && (
                <g>
                  {/* LDR symbol */}
                  <circle cx="445" cy={y - 2} r="10" className="fill-gray-100 dark:fill-slate-800" stroke="#60a5fa" strokeWidth="1.5" />
                  {/* Arrows for light */}
                  <line x1="430" y1={y - 14} x2="438" y2={y - 8} stroke="#facc15" strokeWidth="1" markerEnd="url(#ldrArrow)" />
                  <line x1="432" y1={y - 10} x2="440" y2={y - 4} stroke="#facc15" strokeWidth="1" markerEnd="url(#ldrArrow)" />
                  <text x="445" y={y + 2} textAnchor="middle" fill="#60a5fa" fontSize="8">LDR</text>
                </g>
              )}
              {step.icon === 'test' && (
                <g>
                  {/* Check mark */}
                  <circle cx="445" cy={y - 2} r="12" className="fill-gray-100 dark:fill-slate-800" stroke="#4ade80" strokeWidth="1.5" />
                  <polyline points="437,-4 443,4 455,-8" transform={`translate(0,${y})`} fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}

              {/* Connector to next */}
              {i < steps.length - 1 && (
                <line x1="70" y1={y + 14} x2="70" y2={y + 54} stroke={step.color} strokeWidth="1.5" opacity="0.4" />
              )}
            </g>
          );
        })}

        {/* Final result */}
        <rect x="60" y="350" width="400" height="35" rx="8" className="fill-white dark:fill-slate-950" stroke="#4ade80" strokeWidth="1.5" />
        <text x={w / 2} y="368" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="600">Done! Your firefly jar glows with code-controlled bioluminescence</text>
        <text x={w / 2} y="380" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Place it on a windowsill — LDR activates at dusk, just like real fireflies</text>

        <defs>
          <marker id="ldrArrow" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
            <path d="M0,0 L6,2.5 L0,5" fill="#facc15" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
