export default function StarPhotometryPipelineDiagram() {
  const steps = [
    { label: 'Raw CCD\nImage', desc: 'Noisy, unprocessed', icon: 'grid', color: '#64748b' },
    { label: 'Dark\nSubtract', desc: 'Remove sensor noise', icon: 'minus', color: '#f87171' },
    { label: 'Flat\nField', desc: 'Fix uneven response', icon: 'even', color: '#f59e0b' },
    { label: 'Aperture\nPhotometry', desc: 'Measure star flux', icon: 'circle', color: '#22c55e' },
    { label: 'Calibrated\nMagnitude', desc: 'Science-ready data', icon: 'star', color: '#fbbf24' },
  ];

  const stepW = 80;
  const gap = 15;
  const startX = 30;

  return (
    <svg viewBox="0 0 546 308" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Photometry data pipeline from raw CCD image to calibrated magnitude">
      <rect width="520" height="280" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Photometry Data Pipeline</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">From raw image to calibrated magnitude</text>

      {steps.map((s, i) => {
        const x = startX + i * (stepW + gap);
        const lines = s.label.split('\n');

        return (
          <g key={i}>
            {/* Step box */}
            <rect x={x} y="70" width={stepW} height="85" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke={s.color} strokeWidth="1.5" />

            {/* Step number */}
            <circle cx={x + 15} cy="82" r="9" fill={s.color} opacity={0.2} />
            <text x={x + 15} y="86" textAnchor="middle" fill={s.color} fontSize="10" fontWeight="700">{i + 1}</text>

            {/* Icon area */}
            {s.icon === 'grid' && (
              <g>
                {[0,1,2].map(r => [0,1,2].map(c => (
                  <rect key={`${r}${c}`} x={x + 25 + c * 12} y={90 + r * 10} width="10" height="8" fill="#475569" stroke="#334155" strokeWidth="0.5" rx="1" />
                )))}
              </g>
            )}
            {s.icon === 'minus' && (
              <g>
                <rect x={x + 25} y="95" width="30" height="20" fill="#475569" rx="2" />
                <text x={x + 40} y="110" textAnchor="middle" fill="#f87171" fontSize="14" fontWeight="700">−</text>
              </g>
            )}
            {s.icon === 'even' && (
              <g>
                <rect x={x + 25} y="95" width="30" height="20" rx="2" fill="none" stroke="#f59e0b" strokeWidth="1" />
                <line x1={x + 30} y1="105" x2={x + 50} y2="105" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
              </g>
            )}
            {s.icon === 'circle' && (
              <g>
                <circle cx={x + 40} cy="105" r="10" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3,2" />
                <circle cx={x + 40} cy="105" r="3" fill="#fef3c7" />
              </g>
            )}
            {s.icon === 'star' && (
              <g>
                <circle cx={x + 40} cy="105" r="6" fill="#fbbf24" />
                <text x={x + 40} y="109" textAnchor="middle" className="fill-white dark:fill-slate-950" fontSize="8" fontWeight="700">★</text>
              </g>
            )}

            {/* Labels */}
            {lines.map((line, li) => (
              <text key={li} x={x + stepW / 2} y={130 + li * 12} textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="9" fontWeight="600">{line}</text>
            ))}

            {/* Arrow to next */}
            {i < steps.length - 1 && (
              <g>
                <line x1={x + stepW + 2} y1="112" x2={x + stepW + gap - 2} y2="112" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
                <polygon points={`${x + stepW + gap - 4},109 ${x + stepW + gap},112 ${x + stepW + gap - 4},115`} fill="#475569" />
              </g>
            )}

            {/* Description below */}
            <text x={x + stepW / 2} y="175" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7.5">{s.desc}</text>
          </g>
        );
      })}

      {/* Detail boxes */}
      <rect x="30" y="195" width="220" height="75" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="140" y="213" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">Why each step matters</text>
      <text x="45" y="230" fill="#f87171" fontSize="8"><tspan fontWeight="600">Dark frame:</tspan> CCD has thermal noise even with no light</text>
      <text x="45" y="244" fill="#f59e0b" fontSize="8"><tspan fontWeight="600">Flat field:</tspan> Pixels respond differently to same light</text>
      <text x="45" y="258" fill="#22c55e" fontSize="8"><tspan fontWeight="600">Aperture:</tspan> Sum pixels around star, subtract sky background</text>

      <rect x="270" y="195" width="230" height="75" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="385" y="213" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">Final output</text>
      <text x="285" y="230" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Instrumental magnitude → compare to</text>
      <text x="285" y="244" className="fill-gray-500 dark:fill-slate-400" fontSize="8">known reference stars → calibrated magnitude</text>
      <text x="285" y="258" className="fill-gray-700 dark:fill-slate-200" fontSize="8" fontWeight="600">Precision: ±0.01 mag achievable!</text>
    </svg>
  );
}
