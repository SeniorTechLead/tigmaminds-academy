export default function ElephantDeployDiagram() {
  // Tree silhouettes for forest background
  const tree1 = 'M50,180 L38,130 L44,135 L34,100 L40,105 L36,75 L50,60 L64,75 L60,105 L66,100 L56,135 L62,130 L50,180 Z';
  const tree2 = 'M90,180 L82,145 L86,148 L80,125 L84,128 L82,105 L90,92 L98,105 L96,128 L100,125 L94,148 L98,145 L90,180 Z';
  const tree3 = 'M130,180 L120,140 L125,144 L118,115 L122,118 L120,95 L130,82 L140,95 L138,118 L142,115 L135,144 L140,140 L130,180 Z';

  // Elephant silhouette
  const elephant =
    'M12,32 Q8,28 10,20 Q12,10 20,8 Q26,6 30,12 L32,10 Q34,8 34,12 L32,14 Q34,18 32,24 L32,34 L28,34 L28,28 L22,28 L22,34 L18,34 L18,26 Q14,30 12,32 Z';

  // Wireless wave arcs
  const waves = [
    { r: 12, opacity: 0.8 },
    { r: 18, opacity: 0.5 },
    { r: 24, opacity: 0.3 },
  ];

  return (
    <svg
      viewBox="0 0 674 359"
      className="w-full max-w-2xl mx-auto my-4"
      role="img"
      aria-label="Deployed monitoring system: ground sensor in the field picks up elephant audio, sends it wirelessly to a server running the classifier pipeline, which outputs a distress alert to the ranger team"
    >
      {/* Dark background */}
      <rect width="600" height="340" rx="8" className="fill-slate-900" />

      {/* Title */}
      <text x="300" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="13" fontWeight="700">
        Deployed Monitoring System
      </text>

      {/* ══════════ LANDSCAPE SCENE ══════════ */}
      {/* Ground */}
      <rect x="0" y="180" width="230" height="100" rx="0" fill="#14532d" opacity="0.3" />
      <line x1="0" y1="180" x2="230" y2="180" stroke="#22c55e" strokeWidth="1" opacity="0.4" />

      {/* Trees */}
      <path d={tree1} fill="#166534" opacity="0.6" />
      <path d={tree2} fill="#15803d" opacity="0.5" />
      <path d={tree3} fill="#166534" opacity="0.6" />
      {/* Trunks */}
      <rect x="47" y="170" width="6" height="12" fill="#92400e" opacity="0.5" rx="1" />
      <rect x="87" y="170" width="6" height="12" fill="#92400e" opacity="0.5" rx="1" />
      <rect x="127" y="170" width="6" height="12" fill="#92400e" opacity="0.5" rx="1" />

      {/* Elephant in field */}
      <g transform="translate(160, 192) scale(1.2)">
        <path d={elephant} fill="#22c55e" opacity="0.6" />
      </g>

      {/* ── Ground sensor ── */}
      <g transform="translate(70, 195)">
        {/* Sensor body */}
        <rect x="-8" y="0" width="16" height="22" rx="3" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="1.5" />
        {/* Microphone icon */}
        <circle cx="0" cy="8" r="4" fill="#fbbf24" opacity="0.8" />
        <line x1="0" y1="12" x2="0" y2="18" stroke="#fbbf24" strokeWidth="1.5" />
        {/* Antenna */}
        <line x1="0" y1="0" x2="0" y2="-12" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="0" cy="-12" r="2" fill="#f59e0b" />
      </g>
      <text x="70" y="230" textAnchor="middle" fill="#fde68a" fontSize="8" fontWeight="600">
        Ground sensor
      </text>

      {/* ── Wireless waves ── */}
      {waves.map((w, i) => (
        <path
          key={i}
          d={`M${120 + i * 18},${180 - w.r} A${w.r},${w.r} 0 0 1 ${120 + i * 18},${180 + w.r}`}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
          opacity={w.opacity}
          transform={`translate(${i * 8}, -10)`}
        />
      ))}

      {/* Dashed line from sensor to server */}
      <line x1="140" y1="175" x2="260" y2="120" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />

      {/* ══════════ SERVER / LAPTOP ══════════ */}
      <g transform="translate(260, 72)">
        {/* Laptop body */}
        <rect x="0" y="0" width="190" height="110" rx="6" className="fill-white dark:fill-slate-950" stroke="#3b82f6" strokeWidth="1.5" />
        {/* Screen bezel */}
        <rect x="6" y="6" width="178" height="78" rx="3" className="fill-gray-100 dark:fill-slate-800" />

        {/* Mini pipeline inside screen */}
        {/* Audio → Features → k-NN → Output */}
        {[
          { x: 14, label: 'Audio', color: '#22c55e' },
          { x: 56, label: 'Features', color: '#3b82f6' },
          { x: 106, label: 'k-NN', color: '#f59e0b' },
          { x: 148, label: 'Mood', color: '#22c55e' },
        ].map((stage, i) => (
          <g key={stage.label}>
            <rect x={stage.x} y={20} width={36} height={20} rx="3" className="fill-white dark:fill-slate-950" stroke={stage.color} strokeWidth="0.8" />
            <text x={stage.x + 18} y={33} textAnchor="middle" fill={stage.color} fontSize="6" fontWeight="700">
              {stage.label}
            </text>
            {i < 3 && (
              <g>
                <line
                  x1={stage.x + 38}
                  y1={30}
                  x2={[56, 106, 148][i] - 2}
                  y2={30}
                  className="stroke-gray-300 dark:stroke-slate-600"
                  strokeWidth="0.8"
                />
                <polygon
                  points={`${[56, 106, 148][i] - 2},28 ${[56, 106, 148][i]},30 ${[56, 106, 148][i] - 2},32`}
                  fill="#475569"
                />
              </g>
            )}
          </g>
        ))}

        {/* Status bar in screen */}
        <rect x={14} y={50} width={160} height={20} rx="2" fill="#052e16" stroke="#22c55e" strokeWidth="0.5" />
        <text x={94} y={63} textAnchor="middle" fill="#86efac" fontSize="6.5" fontWeight="600">
          Processing elephant audio...
        </text>

        {/* Keyboard base */}
        <rect x="10" y="90" width="170" height="14" rx="2" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="0.5" />
        <text x="95" y="100" textAnchor="middle" fill="#475569" fontSize="6">
          ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪
        </text>
      </g>
      <text x="355" y="198" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="600">
        Ranger station server
      </text>

      {/* ══════════ OUTPUT: ALERT ══════════ */}
      {/* Arrow from server to alert */}
      <line x1="454" y1="130" x2="490" y2="130" stroke="#64748b" strokeWidth="1.5" />
      <polygon points="490,126 498,130 490,134" className="fill-gray-400 dark:fill-slate-500" />

      {/* Alert box */}
      <rect x="500" y="90" width="88" height="80" rx="6" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />

      {/* Alert icon */}
      <g transform="translate(530, 100)">
        <polygon points="14,0 28,24 0,24" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <text x="14" y="20" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="800">
          !
        </text>
      </g>
      <text x="544" y="138" textAnchor="middle" fill="#fca5a5" fontSize="7" fontWeight="700">
        DISTRESS CRY
      </text>
      <text x="544" y="148" textAnchor="middle" fill="#fca5a5" fontSize="7" fontWeight="700">
        detected
      </text>
      <text x="544" y="162" textAnchor="middle" fill="#f59e0b" fontSize="6.5" fontWeight="600">
        → Alert ranger team
      </text>

      {/* ══════════ DECORATIVE ELEMENTS ══════════ */}
      {/* Stars in sky */}
      {[
        [20, 50],
        [45, 68],
        [170, 45],
        [200, 62],
        [15, 80],
      ].map(([x, y], i) => (
        <circle key={`star-${i}`} cx={x} cy={y} r="1" className="fill-gray-700 dark:fill-slate-200" opacity="0.4" />
      ))}

      {/* ── Bottom summary ── */}
      <rect x={90} y={290} width={420} height={30} rx="5" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />
      <text x="300" y="309" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10" fontWeight="600">
        From Rongpharpi's ear to an automated monitoring network
      </text>
    </svg>
  );
}
