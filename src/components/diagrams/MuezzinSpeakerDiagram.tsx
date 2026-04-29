/**
 * MuezzinSpeakerDiagram — How a loudspeaker converts electrical signals to sound.
 * Shows the voice coil, permanent magnet, cone, and signal path.
 */
export default function MuezzinSpeakerDiagram() {
  const cx = 200;
  const cy = 140;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 400 280" className="w-full" role="img" aria-label="Cross-section of a loudspeaker showing magnet, voice coil, and cone">
        <rect width="400" height="280" className="fill-white dark:fill-slate-950" rx="8" />
        <text x="200" y="22" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">How a Loudspeaker Works</text>
        <text x="200" y="38" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Electrical signal → magnetic force → cone vibration → sound waves</text>

        {/* Permanent magnet */}
        <rect x={cx - 15} y={cy - 30} width="30" height="60" rx="3" fill="#dc2626" opacity="0.5" stroke="#dc2626" strokeWidth="1" />
        <text x={cx} y={cy - 35} textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="bold">Magnet</text>
        <text x={cx - 8} y={cy - 15} fill="#fef2f2" fontSize="12" fontWeight="bold">N</text>
        <text x={cx - 8} y={cy + 20} fill="#fef2f2" fontSize="12" fontWeight="bold">S</text>

        {/* Voice coil (wrapping around magnet) */}
        <ellipse cx={cx} cy={cy - 30} rx="22" ry="8" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        <ellipse cx={cx} cy={cy + 30} rx="22" ry="8" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        <line x1={cx - 22} y1={cy - 30} x2={cx - 22} y2={cy + 30} stroke="#f59e0b" strokeWidth="2.5" />
        <line x1={cx + 22} y1={cy - 30} x2={cx + 22} y2={cy + 30} stroke="#f59e0b" strokeWidth="2.5" />
        <text x={cx + 30} y={cy + 5} fill="#f59e0b" fontSize="10" fontWeight="bold">Voice Coil</text>

        {/* Cone */}
        <line x1={cx - 22} y1={cy - 35} x2={cx - 80} y2={cy - 80} stroke="#64748b" strokeWidth="2" />
        <line x1={cx - 22} y1={cy + 35} x2={cx - 80} y2={cy + 80} stroke="#64748b" strokeWidth="2" />
        <line x1={cx - 80} y1={cy - 80} x2={cx - 80} y2={cy + 80} stroke="#64748b" strokeWidth="2" />
        {/* Cone fill */}
        <path d={`M ${cx - 22} ${cy - 35} L ${cx - 80} ${cy - 80} L ${cx - 80} ${cy + 80} L ${cx - 22} ${cy + 35} Z`} fill="#94a3b8" opacity="0.15" />
        <text x={cx - 55} y={cy + 5} textAnchor="middle" className="fill-gray-700 dark:fill-slate-300" fontSize="10" fontWeight="bold">Cone</text>

        {/* Sound waves emanating from cone */}
        {[30, 55, 80].map((offset, i) => (
          <path key={i} d={`M ${cx - 80 - offset} ${cy - 60 + i * 5} Q ${cx - 80 - offset - 10} ${cy}, ${cx - 80 - offset} ${cy + 60 - i * 5}`} fill="none" stroke="#3b82f6" strokeWidth={2 - i * 0.5} opacity={0.7 - i * 0.2} />
        ))}
        <text x="50" y={cy + 5} textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="bold">Sound</text>

        {/* Signal path */}
        <path d="M 340 200 Q 310 180, 280 160 Q 260 150, 225 135" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="340" y="215" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">Electrical</text>
        <text x="340" y="228" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">Signal In</text>

        {/* Process steps at bottom */}
        {[
          { x: 40, label: '1. Signal', desc: 'AC current flows', icon: '⚡' },
          { x: 140, label: '2. Force', desc: 'Coil moves in field', icon: '↔' },
          { x: 250, label: '3. Vibration', desc: 'Cone pushes air', icon: '∿' },
          { x: 350, label: '4. Sound', desc: 'Pressure waves', icon: '🔊' },
        ].map((step, i) => (
          <g key={i}>
            <rect x={step.x - 30} y="242" width="65" height="32" rx="4" className="fill-gray-50 dark:fill-slate-800" stroke="#94a3b8" strokeWidth="0.5" />
            <text x={step.x + 2} y="256" textAnchor="middle" className="fill-gray-800 dark:fill-slate-200" fontSize="10" fontWeight="bold">{step.label}</text>
            <text x={step.x + 2} y="268" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">{step.desc}</text>
          </g>
        ))}
        {/* Arrows between steps */}
        {[105, 215, 325].map((x, i) => (
          <text key={i} x={x} y="260" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="12">→</text>
        ))}
      </svg>
    </div>
  );
}
