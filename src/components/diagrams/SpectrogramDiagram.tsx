export default function SpectrogramDiagram() {
  // Simplified spectrogram: time on x, frequency on y, color for intensity
  const W = 520;
  const H = 160;
  const cols = 40;
  const rows = 12;
  const cellW = W / cols;
  const cellH = H / rows;

  // Simulate a signal at ~80 Hz that pulses (calm elephant)
  const cells = [];
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const freq = (rows - row) * 25; // 25-300 Hz, bottom = low
      const time = col / cols * 3;

      // Energy near 80 Hz, pulsing at 0.5 Hz
      const freqDist = Math.abs(freq - 80);
      const pulse = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.5 * time);
      const energy = Math.max(0, (1 - freqDist / 60)) * pulse;

      if (energy > 0.05) {
        // Map energy to inferno-like color
        const r = Math.min(255, Math.round(energy * 300));
        const g = Math.min(255, Math.round(energy * 150));
        const b = Math.round(40 + energy * 60);

        cells.push(
          <rect
            key={`${col}-${row}`}
            x={40 + col * cellW}
            y={20 + row * cellH}
            width={cellW + 0.5}
            height={cellH + 0.5}
            fill={`rgb(${r},${g},${b})`}
            opacity={0.9}
          />
        );
      }
    }
  }

  return (
    <svg viewBox="0 0 630 285" className="w-full max-w-xl mx-auto my-6" role="img" aria-label="Spectrogram diagram showing frequency over time with intensity as color">
      <text x="300" y="14" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="11" fontWeight="600">
        Spectrogram: what a computer "sees" instead of hearing
      </text>

      {/* Background */}
      <rect x="40" y="20" width={W} height={H} rx="4" className="fill-gray-900" />

      {/* Data cells */}
      {cells}

      {/* Axes */}
      <text x="35" y="30" textAnchor="end" className="fill-gray-400" fontSize="8">300</text>
      <text x="35" y="100" textAnchor="end" className="fill-gray-400" fontSize="8">150</text>
      <text x="35" y="178" textAnchor="end" className="fill-gray-400" fontSize="8">0</text>

      <text x="40" y="195" className="fill-gray-400" fontSize="8">0s</text>
      <text x={40 + W / 2} y="195" textAnchor="middle" className="fill-gray-400" fontSize="8">1.5s</text>
      <text x={40 + W} y="195" textAnchor="end" className="fill-gray-400" fontSize="8">3s</text>

      {/* Axis labels */}
      <text x="12" y="105" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontWeight="600" transform="rotate(-90, 12, 105)">Frequency (Hz)</text>
      <text x={40 + W / 2} y="210" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontWeight="600">Time</text>

      {/* Annotation: bright band at 80 Hz */}
      <line x1={40 + W + 5} y1={20 + (rows - 80 / 25) * cellH} x2={40 + W + 25} y2={20 + (rows - 80 / 25) * cellH} className="stroke-amber-400" strokeWidth="1.5" />
      <text x={40 + W + 28} y={24 + (rows - 80 / 25) * cellH} className="fill-amber-500" fontSize="9" fontWeight="600">80 Hz band</text>

      {/* Legend */}
      <text x="300" y="235" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
        Bright = loud | Dark = quiet | The band at 80 Hz pulses in and out = calm elephant
      </text>
    </svg>
  );
}
