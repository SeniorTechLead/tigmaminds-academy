export default function FireflySineBreatheDiagram() {
  const w = 520, h = 360;
  const cx = 260;

  // Generate sine wave points
  const waveStartX = 60;
  const waveEndX = 460;
  const waveY = 160;
  const amp = 55;
  const points: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = waveStartX + (i / 100) * (waveEndX - waveStartX);
    const y = waveY - Math.sin((i / 100) * 2 * Math.PI) * amp;
    points.push(`${x},${y}`);
  }

  // Sample points for LED brightness indicators
  const samples = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5];

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="Sine wave controlling LED brightness from 0 to 255, creating an organic breathing glow">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={cx} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">Sine Wave = Organic Breathing Glow</text>

        {/* Axes */}
        <line x1={waveStartX} y1={waveY} x2={waveEndX + 10} y2={waveY} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <line x1={waveStartX} y1={waveY - amp - 15} x2={waveStartX} y2={waveY + amp + 15} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />

        {/* Y axis labels */}
        <text x={waveStartX - 8} y={waveY - amp + 3} textAnchor="end" fill="#4ade80" fontSize="9">255</text>
        <text x={waveStartX - 8} y={waveY + 4} textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="9">128</text>
        <text x={waveStartX - 8} y={waveY + amp + 3} textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="9">0</text>
        <text x="20" y={waveY - 20} className="fill-gray-500 dark:fill-slate-400" fontSize="8" transform="rotate(-90, 20, 160)">Brightness</text>

        {/* X axis labels */}
        <text x={waveStartX} y={waveY + amp + 30} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">0</text>
        <text x={(waveStartX + waveEndX) / 2} y={waveY + amp + 30} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">π</text>
        <text x={waveEndX} y={waveY + amp + 30} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">2π</text>
        <text x={cx} y={waveY + amp + 45} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Phase angle →</text>

        {/* Grid lines */}
        <line x1={waveStartX} y1={waveY - amp} x2={waveEndX} y2={waveY - amp} stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1={waveStartX} y1={waveY + amp} x2={waveEndX} y2={waveY + amp} stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1={cx} y1={waveY - amp - 10} x2={cx} y2={waveY + amp + 10} stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />

        {/* Sine wave */}
        <polyline points={points.join(' ')} fill="none" stroke="#4ade80" strokeWidth="2.5" />

        {/* Fill under positive part */}
        <path
          d={`M${waveStartX},${waveY} ${points.slice(0, 51).join(' ')} L${cx},${waveY} Z`}
          fill="#4ade80"
          opacity="0.06"
        />

        {/* Sample LED indicators along the wave */}
        {samples.map((pct, i) => {
          const x = waveStartX + (pct / 100) * (waveEndX - waveStartX);
          const sinVal = Math.sin((pct / 100) * 2 * Math.PI);
          const brightness = (sinVal + 1) / 2; // 0 to 1
          const y = waveY - sinVal * amp;
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={x} y2={waveY} stroke="#4ade80" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
              <circle cx={x} cy={y} r="4" fill="#4ade80" opacity={0.4 + brightness * 0.6} />
            </g>
          );
        })}

        {/* Formula box */}
        <rect x="60" y="55" width="200" height="30" rx="5" className="fill-white dark:fill-slate-950" stroke="#f59e0b" strokeWidth="1" />
        <text x="160" y="74" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="600">b = 128 + 127 × sin(t)</text>

        {/* Mapping explanation */}
        <rect x="280" y="55" width="180" height="30" rx="5" className="fill-white dark:fill-slate-950 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="370" y="68" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">sin goes from -1 to +1</text>
        <text x="370" y="80" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">mapped to brightness 0 to 255</text>

        {/* LED comparison strip at bottom */}
        <text x={cx} y="280" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="600">What your eye sees over one cycle:</text>

        {Array.from({ length: 12 }).map((_, i) => {
          const pct = i / 11;
          const sinVal = Math.sin(pct * 2 * Math.PI);
          const brightness = (sinVal + 1) / 2;
          const x = 85 + i * 32;
          return (
            <g key={i}>
              <circle cx={x} cy="310" r="14" fill="#4ade80" opacity={brightness * 0.15} />
              <circle cx={x} cy="310" r="9" fill="#4ade80" opacity={brightness * 0.3} />
              <circle cx={x} cy="310" r="5" fill="#4ade80" opacity={0.1 + brightness * 0.9} />
            </g>
          );
        })}

        <text x="70" y="340" className="fill-gray-500 dark:fill-slate-400" fontSize="8">off</text>
        <text x="230" y="340" fill="#4ade80" fontSize="8">peak</text>
        <text x="405" y="340" className="fill-gray-500 dark:fill-slate-400" fontSize="8">off</text>
        <text x={cx} y="356" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Smooth fade — no abrupt on/off like PWM alone</text>
      </svg>
    </div>
  );
}
