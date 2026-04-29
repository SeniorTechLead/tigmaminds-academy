export default function FireflyPhaseOffsetDiagram() {
  const w = 520, h = 380;
  const ledCount = 5;
  const waveStartX = 140;
  const waveEndX = 480;
  const waveW = waveEndX - waveStartX;
  const amp = 16;

  // Each LED has a different phase offset (fraction of 2π)
  const offsets = [0, 0.2, 0.4, 0.6, 0.8];
  const colors = ['#4ade80', '#a3e635', '#facc15', '#fb923c', '#34d399'];

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="Five LEDs with different phase offsets on sine waves, each glowing at its own time">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">Phase Offsets: Same Speed, Different Start</text>
        <text x={w / 2} y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Same frequency, different phase = each LED glows at its own time</text>

        {/* Time axis header */}
        <text x={waveStartX + waveW / 2} y="68" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Time →</text>
        <line x1={waveStartX} y1="72" x2={waveEndX} y2="72" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />

        {ledCount > 0 && offsets.map((offset, i) => {
          const rowY = 90 + i * 52;
          const color = colors[i];

          // Generate sine wave points with phase offset
          const pts: string[] = [];
          for (let p = 0; p <= 80; p++) {
            const x = waveStartX + (p / 80) * waveW;
            const y = rowY + 18 - Math.sin(((p / 80) * 2 * Math.PI) + (offset * 2 * Math.PI)) * amp;
            pts.push(`${x},${y}`);
          }

          // Find where peak is
          const peakFrac = (0.25 - offset + 1) % 1;
          const peakX = waveStartX + peakFrac * waveW;

          return (
            <g key={i}>
              {/* LED indicator */}
              <circle cx="30" cy={rowY + 18} r="12" fill={color} opacity="0.08" />
              <circle cx="30" cy={rowY + 18} r="7" fill={color} opacity="0.2" />
              <circle cx="30" cy={rowY + 18} r="4" fill={color} opacity="0.8" />
              <text x="55" y={rowY + 14} fill={color} fontSize="9" fontWeight="600">LED {i}</text>
              <text x="55" y={rowY + 26} className="fill-gray-500 dark:fill-slate-400" fontSize="8">offset: {(offset * 360).toFixed(0)}°</text>

              {/* Sine wave */}
              <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.5" opacity="0.8" />

              {/* Peak marker */}
              {peakFrac < 0.95 && (
                <g>
                  <circle cx={peakX} cy={rowY + 18 - amp} r="5" fill={color} opacity="0.6" />
                  <line x1={peakX} y1={rowY + 18 - amp + 5} x2={peakX} y2={rowY + 18 + amp} stroke={color} strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
                </g>
              )}

              {/* Row divider */}
              {i < ledCount - 1 && (
                <line x1={waveStartX} y1={rowY + 43} x2={waveEndX} y2={rowY + 43} className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="0.5" />
              )}
            </g>
          );
        })}

        {/* Bottom explanation */}
        <rect x="40" y="310" width="440" height="55" rx="8" className="fill-white dark:fill-slate-950" stroke="#f59e0b" strokeWidth="1" />
        <text x={w / 2} y="328" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">Code: phase[i] = i × (2π / numLEDs)</text>
        <text x={w / 2} y="344" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">brightness[i] = 128 + 127 × sin(time + phase[i])</text>
        <text x={w / 2} y="358" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">All LEDs run the same sine function — only the starting angle differs</text>
      </svg>
    </div>
  );
}
