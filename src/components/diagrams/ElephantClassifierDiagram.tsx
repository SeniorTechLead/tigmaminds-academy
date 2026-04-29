export default function ElephantClassifierDiagram() {
  // Elephant silhouettes for each mood
  const elephantCalm =
    'M12,32 Q8,28 10,20 Q12,10 20,8 Q26,6 30,12 L32,10 Q34,8 34,12 L32,14 Q34,18 32,24 L32,34 L28,34 L28,28 L22,28 L22,34 L18,34 L18,26 Q14,30 12,32 Z';
  const elephantNervous =
    'M8,34 Q4,28 6,20 Q8,10 16,8 L14,4 Q12,2 14,2 L16,6 Q22,6 28,8 L32,4 Q34,2 34,6 L30,10 Q34,16 32,24 L32,34 L28,34 L28,28 L22,28 L22,34 L18,34 L18,26 Q12,30 8,34 Z';
  const elephantDanger =
    'M10,34 Q6,28 8,20 Q10,12 18,8 L16,2 Q14,0 16,0 L18,4 Q22,6 28,8 L34,4 Q36,2 36,6 L30,10 Q34,14 34,22 L36,34 L32,34 L30,26 L24,26 L24,34 L20,34 L20,24 Q14,28 10,34 Z';

  // Mini waveform for Step 1
  const miniWaveN = 60;
  const miniWave = Array.from({ length: miniWaveN }, (_, i) => {
    const t = i / miniWaveN;
    const y = Math.sin(2 * Math.PI * 6 * t) * (0.5 + 0.4 * Math.sin(2 * Math.PI * 1.5 * t));
    return `${i === 0 ? 'M' : 'L'}${(t * 60).toFixed(1)},${(18 - y * 14).toFixed(1)}`;
  }).join(' ');

  // Arrow connector
  const Arrow = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => (
    <g>
      <line x1={x1} y1={y} x2={x2 - 6} y2={y} stroke="#64748b" strokeWidth="1.5" />
      <polygon points={`${x2 - 6},${y - 4} ${x2},${y} ${x2 - 6},${y + 4}`} className="fill-gray-400 dark:fill-slate-500" />
    </g>
  );

  // Layout
  const midY = 130; // vertical center of the pipeline
  const step1X = 30;
  const step2X = 160;
  const step3X = 310;

  // Decision branch positions
  const branchX = step3X + 10;
  const dangerY = midY - 56;
  const calmY = midY;
  const nervousY = midY + 56;

  return (
    <svg
      viewBox="0 0 630 336"
      className="w-full max-w-2xl mx-auto my-4"
      role="img"
      aria-label="Rule-based classifier pipeline: raw signal goes through FFT to find peak frequency, then decision thresholds classify as danger, calm, or nervous"
    >
      {/* Dark background */}
      <rect width="600" height="310" rx="8" className="fill-slate-900" />

      {/* ══════════ STEP 1: Raw Signal ══════════ */}
      <rect
        x={step1X}
        y={midY - 30}
        width={80}
        height={60}
        rx="6"
        className="fill-white dark:fill-slate-950"
        stroke="#334155"
        strokeWidth="1"
      />
      {/* Mini waveform inside */}
      <g transform={`translate(${step1X + 10}, ${midY - 20})`}>
        <path d={miniWave} fill="none" stroke="#22c55e" strokeWidth="1.2" />
      </g>
      <text x={step1X + 40} y={midY + 44} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9" fontWeight="600">
        Raw signal
      </text>

      {/* Arrow 1→2 */}
      <Arrow x1={step1X + 84} x2={step2X} y={midY} />

      {/* ══════════ STEP 2: FFT Box ══════════ */}
      <rect
        x={step2X}
        y={midY - 30}
        width={100}
        height={60}
        rx="6"
        className="fill-gray-100 dark:fill-slate-800"
        stroke="#3b82f6"
        strokeWidth="1.5"
      />
      <text x={step2X + 50} y={midY - 6} textAnchor="middle" fill="#60a5fa" fontSize="14" fontWeight="800">
        FFT
      </text>
      <text x={step2X + 50} y={midY + 10} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">
        Find peak
      </text>
      <text x={step2X + 50} y={midY + 20} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">
        frequency
      </text>

      {/* Arrow 2→3 — splits into three branches */}
      {/* Main arrow out of FFT */}
      <line x1={step2X + 104} y1={midY} x2={branchX - 10} y2={midY} stroke="#64748b" strokeWidth="1.5" />

      {/* Vertical connector */}
      <line x1={branchX - 10} y1={dangerY} x2={branchX - 10} y2={nervousY} stroke="#64748b" strokeWidth="1.5" />

      {/* Branch arrows */}
      {[dangerY, calmY, nervousY].map((y) => (
        <g key={y}>
          <line x1={branchX - 10} y1={y} x2={branchX + 4} y2={y} stroke="#64748b" strokeWidth="1.5" />
          <polygon points={`${branchX + 4},${y - 3} ${branchX + 8},${y} ${branchX + 4},${y + 3}`} className="fill-gray-400 dark:fill-slate-500" />
        </g>
      ))}

      {/* ══════════ STEP 3: Decision branches ══════════ */}

      {/* ── DANGER branch ── */}
      <rect
        x={branchX + 12}
        y={dangerY - 18}
        width={145}
        height={36}
        rx="5"
        fill="#450a0a"
        stroke="#ef4444"
        strokeWidth="1"
      />
      <text x={branchX + 22} y={dangerY - 2} fill="#fca5a5" fontSize="9" fontWeight="600">
        {'< 60 Hz →'}
      </text>
      <text x={branchX + 82} y={dangerY - 2} fill="#ef4444" fontSize="10" fontWeight="800">
        DANGER
      </text>
      <text x={branchX + 22} y={dangerY + 10} className="fill-gray-500 dark:fill-slate-400" fontSize="7">
        Low rumble = alarm call
      </text>
      {/* Elephant */}
      <g transform={`translate(${branchX + 162}, ${dangerY - 16}) scale(0.85)`}>
        <path d={elephantDanger} fill="#ef4444" opacity="0.8" />
      </g>

      {/* ── CALM branch ── */}
      <rect
        x={branchX + 12}
        y={calmY - 18}
        width={145}
        height={36}
        rx="5"
        fill="#052e16"
        stroke="#22c55e"
        strokeWidth="1"
      />
      <text x={branchX + 22} y={calmY - 2} fill="#86efac" fontSize="9" fontWeight="600">
        {'60–95 Hz →'}
      </text>
      <text x={branchX + 90} y={calmY - 2} fill="#22c55e" fontSize="10" fontWeight="800">
        CALM
      </text>
      <text x={branchX + 22} y={calmY + 10} className="fill-gray-500 dark:fill-slate-400" fontSize="7">
        Contact rumble = all good
      </text>
      {/* Elephant */}
      <g transform={`translate(${branchX + 162}, ${calmY - 16}) scale(0.85)`}>
        <path d={elephantCalm} fill="#22c55e" opacity="0.8" />
      </g>

      {/* ── NERVOUS branch ── */}
      <rect
        x={branchX + 12}
        y={nervousY - 18}
        width={145}
        height={36}
        rx="5"
        fill="#451a03"
        stroke="#f59e0b"
        strokeWidth="1"
      />
      <text x={branchX + 22} y={nervousY - 2} fill="#fde68a" fontSize="9" fontWeight="600">
        {'> 95 Hz →'}
      </text>
      <text x={branchX + 84} y={nervousY - 2} fill="#f59e0b" fontSize="10" fontWeight="800">
        NERVOUS
      </text>
      <text x={branchX + 22} y={nervousY + 10} className="fill-gray-500 dark:fill-slate-400" fontSize="7">
        High pitch = agitation
      </text>
      {/* Elephant */}
      <g transform={`translate(${branchX + 162}, ${nervousY - 16}) scale(0.85)`}>
        <path d={elephantNervous} fill="#f59e0b" opacity="0.8" />
      </g>

      {/* ── Step numbers ── */}
      <circle cx={step1X + 40} cy={midY - 42} r="10" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
      <text x={step1X + 40} y={midY - 38} textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="9" fontWeight="700">
        1
      </text>

      <circle cx={step2X + 50} cy={midY - 42} r="10" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
      <text x={step2X + 50} y={midY - 38} textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="9" fontWeight="700">
        2
      </text>

      <circle cx={branchX + 84} cy={midY - 86} r="10" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
      <text x={branchX + 84} y={midY - 82} textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="9" fontWeight="700">
        3
      </text>

      {/* ── Title ── */}
      <text x="300" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="13" fontWeight="700">
        Rule-Based Classifier Pipeline
      </text>

      {/* ── Bottom summary ── */}
      <text x="300" y="286" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11" fontWeight="600">
        Rule-based classifier: measure one feature, apply thresholds
      </text>
    </svg>
  );
}
