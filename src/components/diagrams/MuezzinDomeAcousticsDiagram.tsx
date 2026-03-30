/**
 * MuezzinDomeAcousticsDiagram — How domed architecture focuses and amplifies sound.
 * Shows reflection paths inside a dome, the focal point, and whispering gallery effect.
 */
export default function MuezzinDomeAcousticsDiagram() {
  const domeCenter = 200;
  const domeBase = 180;
  const domeR = 120;

  // Reflection paths — sound from a source bouncing off the dome
  const srcX = 140;
  const srcY = 170;
  const reflections = [
    { angle: -70, hitX: 128, hitY: 75, endX: 272, endY: 170 },
    { angle: -50, hitX: 155, hitY: 68, endX: 260, endY: 160 },
    { angle: -30, hitX: 185, hitY: 62, endX: 245, endY: 170 },
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 400 280" className="w-full" role="img" aria-label="Dome acoustics: sound reflects off curved surfaces to focus at a point">
        <rect width="400" height="280" className="fill-white dark:fill-slate-950" rx="8" />
        <text x="200" y="22" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">Dome Acoustics: How Mosques Amplify Sound</text>

        {/* Dome */}
        <path d={`M 80 ${domeBase} A ${domeR} ${domeR} 0 0 1 320 ${domeBase}`} fill="none" stroke="#ca8a04" strokeWidth="3" />
        <path d={`M 80 ${domeBase} A ${domeR} ${domeR} 0 0 1 320 ${domeBase}`} fill="#fef3c7" opacity="0.15" />
        {/* Base line */}
        <line x1="80" y1={domeBase} x2="320" y2={domeBase} stroke="#a16207" strokeWidth="2" />

        {/* Walls */}
        <rect x="70" y={domeBase} width="12" height="60" fill="#a16207" opacity="0.5" />
        <rect x="318" y={domeBase} width="12" height="60" fill="#a16207" opacity="0.5" />
        {/* Floor */}
        <line x1="70" y1="240" x2="330" y2="240" stroke="#a16207" strokeWidth="1.5" />

        {/* Sound source (speaker/imam) */}
        <circle cx={srcX} cy={srcY} r="5" fill="#3b82f6" />
        <text x={srcX} y={srcY + 18} textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="bold">Speaker</text>

        {/* Reflection paths */}
        {reflections.map((ref, i) => (
          <g key={i}>
            {/* Incident ray */}
            <line x1={srcX} y1={srcY} x2={ref.hitX} y2={ref.hitY} stroke="#60a5fa" strokeWidth="1.5" opacity="0.7" />
            {/* Reflected ray */}
            <line x1={ref.hitX} y1={ref.hitY} x2={ref.endX} y2={ref.endY} stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7" />
            {/* Hit point */}
            <circle cx={ref.hitX} cy={ref.hitY} r="3" fill="#f59e0b" />
          </g>
        ))}

        {/* Focal point */}
        <circle cx="255" cy="170" r="8" fill="#ef4444" opacity="0.3" />
        <circle cx="255" cy="170" r="3" fill="#ef4444" />
        <text x="255" y="160" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">Focal Point</text>

        {/* Whispering gallery annotation */}
        <path d={`M 95 ${domeBase - 5} A ${domeR - 15} ${domeR - 15} 0 0 1 305 ${domeBase - 5}`} fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="200" y={domeBase - 15} textAnchor="middle" fill="#10b981" fontSize="10">Whispering gallery: sound hugs the curve</text>

        {/* Key concepts */}
        {[
          { x: 30, y: 255, label: 'Concave dome focuses', desc: 'sound like a lens' },
          { x: 200, y: 255, label: 'Focal point amplifies', desc: 'intensity for listeners' },
        ].map((item, i) => (
          <g key={i}>
            <text x={item.x} y={item.y} className="fill-gray-700 dark:fill-slate-300" fontSize="10" fontWeight="bold">{item.label}</text>
            <text x={item.x} y={item.y + 14} className="fill-gray-500 dark:fill-slate-400" fontSize="9">{item.desc}</text>
          </g>
        ))}

        {/* Comparison note */}
        <text x="200" y="280" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">A dome can amplify sound 3-6 dB at the focal point — perceived as twice as loud</text>
      </svg>
    </div>
  );
}
