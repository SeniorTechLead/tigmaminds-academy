export default function ElephantPulseDiagram() {
  const N = 300;
  const carrierFreq = 20; // ~20 visible oscillations across the strip

  const generate = (pulseRate: number, boom = false) =>
    Array.from({ length: N }, (_, i) => {
      const t = i / N;
      const carrier = Math.sin(2 * Math.PI * carrierFreq * t);
      let envelope = 0.5 + 0.5 * Math.sin(2 * Math.PI * pulseRate * t);
      if (boom) {
        // Initial boom: sharp attack that decays into the frantic pulse
        const attack = Math.max(0, 1 - t * 6);
        envelope = Math.min(1, envelope + attack * 0.6);
      }
      return { t, carrier, envelope, combined: carrier * envelope };
    });

  const calm = generate(0.5);
  const nervous = generate(3);
  const danger = generate(8, true);

  // Waveform strip geometry
  const stripX = 100;
  const stripW = 430;
  const stripH = 30; // half-amplitude in px

  const toPath = (data: { t: number; y: number }[], yCenter: number) =>
    data
      .map(
        (d, i) =>
          `${i === 0 ? 'M' : 'L'}${(stripX + d.t * stripW).toFixed(1)},${(yCenter - d.y * stripH).toFixed(1)}`
      )
      .join(' ');

  const toEnvelope = (data: { t: number; envelope: number }[], yCenter: number, sign: 1 | -1) =>
    data
      .map(
        (d, i) =>
          `${i === 0 ? 'M' : 'L'}${(stripX + d.t * stripW).toFixed(1)},${(yCenter - sign * d.envelope * stripH).toFixed(1)}`
      )
      .join(' ');

  // Row y-centers
  const row1 = 65;
  const row2 = 160;
  const row3 = 255;

  // Simple elephant silhouettes (minimal path commands)
  // Calm: relaxed, trunk down, ears flat
  const elephantCalm =
    'M12,32 Q8,28 10,20 Q12,10 20,8 Q26,6 30,12 L32,10 Q34,8 34,12 L32,14 Q34,18 32,24 L32,34 L28,34 L28,28 L22,28 L22,34 L18,34 L18,26 Q14,30 12,32 Z';

  // Nervous: alert, trunk up, ears spread
  const elephantNervous =
    'M8,34 Q4,28 6,20 Q8,10 16,8 L14,4 Q12,2 14,2 L16,6 Q22,6 28,8 L32,4 Q34,2 34,6 L30,10 Q34,16 32,24 L32,34 L28,34 L28,28 L22,28 L22,34 L18,34 L18,26 Q12,30 8,34 Z';

  // Danger: charging, trunk raised high
  const elephantDanger =
    'M10,34 Q6,28 8,20 Q10,12 18,8 L16,2 Q14,0 16,0 L18,4 Q22,6 28,8 L34,4 Q36,2 36,6 L30,10 Q34,14 34,22 L36,34 L32,34 L30,26 L24,26 L24,34 L20,34 L20,24 Q14,28 10,34 Z';

  const rows: {
    label: string;
    sublabel: string;
    data: { t: number; combined: number; envelope: number }[];
    color: string;
    envColor: string;
    fillClass: string;
    strokeClass: string;
    envStrokeClass: string;
    elephant: string;
    yCenter: number;
  }[] = [
    {
      label: 'Calm',
      sublabel: 'slow pulse (0.5 Hz) — rises and falls every 2 s',
      data: calm,
      color: '#22c55e',
      envColor: '#4ade80',
      fillClass: 'fill-green-400',
      strokeClass: 'stroke-green-500',
      envStrokeClass: 'stroke-green-400',
      elephant: elephantCalm,
      yCenter: row1,
    },
    {
      label: 'Nervous',
      sublabel: 'fast pulse (3 Hz) — three surges per second',
      data: nervous,
      color: '#f59e0b',
      envColor: '#fbbf24',
      fillClass: 'fill-amber-400',
      strokeClass: 'stroke-amber-500',
      envStrokeClass: 'stroke-amber-400',
      elephant: elephantNervous,
      yCenter: row2,
    },
    {
      label: 'Danger',
      sublabel: 'frantic pulse (8 Hz) + initial boom',
      data: danger,
      color: '#ef4444',
      envColor: '#f87171',
      fillClass: 'fill-red-400',
      strokeClass: 'stroke-red-500',
      envStrokeClass: 'stroke-red-400',
      elephant: elephantDanger,
      yCenter: row3,
    },
  ];

  return (
    <svg
      viewBox="0 0 685 368"
      className="w-full max-w-lg mx-auto my-4"
      role="img"
      aria-label="Three elephant moods showing amplitude modulation: calm with slow pulse, nervous with fast pulse, danger with frantic pulse"
    >
      {/* Dark background */}
      <rect width="600" height="330" rx="8" className="fill-slate-900" />

      {rows.map((row) => (
        <g key={row.label}>
          {/* Elephant silhouette */}
          <g transform={`translate(14,${row.yCenter - 20}) scale(1.1)`}>
            <path d={row.elephant} fill={row.color} opacity="0.85" />
          </g>

          {/* Axis line */}
          <line
            x1={stripX}
            y1={row.yCenter}
            x2={stripX + stripW}
            y2={row.yCenter}
            className="stroke-gray-300 dark:stroke-slate-600"
            strokeWidth="0.5"
            strokeDasharray="3,3"
          />

          {/* Envelope (dashed) */}
          <path
            d={toEnvelope(row.data, row.yCenter, 1)}
            fill="none"
            stroke={row.envColor}
            strokeWidth="0.8"
            strokeDasharray="4,3"
            opacity="0.5"
          />
          <path
            d={toEnvelope(row.data, row.yCenter, -1)}
            fill="none"
            stroke={row.envColor}
            strokeWidth="0.8"
            strokeDasharray="4,3"
            opacity="0.5"
          />

          {/* Waveform */}
          <path
            d={toPath(
              row.data.map((d) => ({ t: d.t, y: d.combined })),
              row.yCenter
            )}
            fill="none"
            stroke={row.color}
            strokeWidth="1.5"
          />

          {/* Label */}
          <text
            x={stripX}
            y={row.yCenter - stripH - 6}
            className={row.fillClass}
            fontSize="10"
            fontWeight="700"
          >
            {row.label}:
          </text>
          <text
            x={stripX + 40}
            y={row.yCenter - stripH - 6}
            className="fill-gray-500 dark:fill-slate-400"
            fontSize="9"
          >
            {row.sublabel}
          </text>
        </g>
      ))}

      {/* Right-side annotation */}
      <line x1="548" y1={row1 + 10} x2="548" y2={row3 - 10} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrowDown)" markerStart="url(#arrowUp)" />
      <defs>
        <marker id="arrowDown" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" className="fill-gray-400 dark:fill-slate-500" />
        </marker>
        <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M6,0 L0,3 L6,6" className="fill-gray-400 dark:fill-slate-500" />
        </marker>
      </defs>
      <text x="555" y={row2 - 10} className="fill-gray-500 dark:fill-slate-400" fontSize="8" fontWeight="600">
        Same rumble
      </text>
      <text x="555" y={row2} className="fill-gray-500 dark:fill-slate-400" fontSize="8" fontWeight="600">
        frequency —
      </text>
      <text x="555" y={row2 + 10} className="fill-gray-500 dark:fill-slate-400" fontSize="8" fontWeight="600">
        only the
      </text>
      <text x="555" y={row2 + 20} className="fill-gray-600 dark:fill-slate-300" fontSize="8" fontWeight="700">
        PULSE RATE
      </text>
      <text x="555" y={row2 + 30} className="fill-gray-500 dark:fill-slate-400" fontSize="8" fontWeight="600">
        changes
      </text>

      {/* Bottom label */}
      <text x="300" y="318" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">
        The rumble stays the same — the elephant changes how fast it pulses the volume
      </text>
    </svg>
  );
}
