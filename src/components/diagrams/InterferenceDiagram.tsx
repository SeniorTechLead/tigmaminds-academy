export default function InterferenceDiagram() {
  // Generate sine wave as SVG path
  const sineWave = (startX: number, midY: number, amplitude: number, wavelength: number, width: number, phase: number = 0) => {
    const points: string[] = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const x = startX + (i / steps) * width;
      const y = midY - amplitude * Math.sin((2 * Math.PI * (x - startX)) / wavelength + phase);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  const panelWidth = 230;
  const waveWidth = 190;
  const wavelength = 80;
  const amp = 18;

  // Left panel: Constructive
  const cLeftX = 30;
  const cWaveY1 = 70;
  const cWaveY2 = 120;
  const cSumY = 170;

  // Right panel: Destructive
  const dLeftX = 290;
  const dWaveY1 = 70;
  const dWaveY2 = 120;
  const dSumY = 170;

  return (
    <div className="my-4">
      <svg viewBox="0 0 546 284" className="w-full max-w-2xl mx-auto" role="img" aria-label="Constructive and destructive wave interference">
        {/* ======== CONSTRUCTIVE (left) ======== */}
        <text x={cLeftX + panelWidth / 2} y={18} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="700">Constructive Interference</text>
        <text x={cLeftX + panelWidth / 2} y={32} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Waves in phase</text>

        {/* Background panel */}
        <rect x={cLeftX - 5} y={40} width={panelWidth} height={180} rx={6} className="fill-gray-50 dark:fill-gray-800/30" stroke="none" />

        {/* Wave 1 (blue) */}
        <line x1={cLeftX} y1={cWaveY1} x2={cLeftX + waveWidth} y2={cWaveY1} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="0.5" />
        <polyline points={sineWave(cLeftX, cWaveY1, amp, wavelength, waveWidth, 0)} fill="none" className="stroke-blue-500" strokeWidth="1.5" />
        <text x={cLeftX + waveWidth + 5} y={cWaveY1 + 4} className="fill-blue-500" fontSize="10">A</text>

        {/* Wave 2 (red dashed) — same phase */}
        <line x1={cLeftX} y1={cWaveY2} x2={cLeftX + waveWidth} y2={cWaveY2} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="0.5" />
        <polyline points={sineWave(cLeftX, cWaveY2, amp, wavelength, waveWidth, 0)} fill="none" className="stroke-red-500" strokeWidth="1.5" strokeDasharray="5,3" />
        <text x={cLeftX + waveWidth + 5} y={cWaveY2 + 4} className="fill-red-500" fontSize="10">A</text>

        {/* Plus sign */}
        <text x={cLeftX - 2} y={cWaveY2 - 15} className="fill-gray-500 dark:fill-gray-400" fontSize="14" fontWeight="700">+</text>

        {/* Equals line */}
        <line x1={cLeftX} y1={cSumY - 20} x2={cLeftX + waveWidth} y2={cSumY - 20} stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeWidth="1" strokeDasharray="2,2" />
        <text x={cLeftX - 2} y={cSumY - 15} className="fill-gray-500 dark:fill-gray-400" fontSize="14" fontWeight="700">=</text>

        {/* Sum wave (green, double amplitude) */}
        <line x1={cLeftX} y1={cSumY} x2={cLeftX + waveWidth} y2={cSumY} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="0.5" />
        <polyline points={sineWave(cLeftX, cSumY, amp * 2, wavelength, waveWidth, 0)} fill="none" className="stroke-emerald-500" strokeWidth="2.5" />
        <text x={cLeftX + waveWidth + 5} y={cSumY + 4} className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="700">2A</text>

        {/* Amplitude label */}
        <text x={cLeftX + panelWidth / 2} y={228} textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="11" fontWeight="600">Sum = 2A (louder)</text>

        {/* ======== DESTRUCTIVE (right) ======== */}
        <text x={dLeftX + panelWidth / 2} y={18} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="700">Destructive Interference</text>
        <text x={dLeftX + panelWidth / 2} y={32} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Waves out of phase (180°)</text>

        {/* Background panel */}
        <rect x={dLeftX - 5} y={40} width={panelWidth} height={180} rx={6} className="fill-gray-50 dark:fill-gray-800/30" stroke="none" />

        {/* Wave 1 (blue) */}
        <line x1={dLeftX} y1={dWaveY1} x2={dLeftX + waveWidth} y2={dWaveY1} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="0.5" />
        <polyline points={sineWave(dLeftX, dWaveY1, amp, wavelength, waveWidth, 0)} fill="none" className="stroke-blue-500" strokeWidth="1.5" />
        <text x={dLeftX + waveWidth + 5} y={dWaveY1 + 4} className="fill-blue-500" fontSize="10">A</text>

        {/* Wave 2 (red dashed) — phase shifted by pi */}
        <line x1={dLeftX} y1={dWaveY2} x2={dLeftX + waveWidth} y2={dWaveY2} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="0.5" />
        <polyline points={sineWave(dLeftX, dWaveY2, amp, wavelength, waveWidth, Math.PI)} fill="none" className="stroke-red-500" strokeWidth="1.5" strokeDasharray="5,3" />
        <text x={dLeftX + waveWidth + 5} y={dWaveY2 + 4} className="fill-red-500" fontSize="10">A</text>

        {/* Plus sign */}
        <text x={dLeftX - 2} y={dWaveY2 - 15} className="fill-gray-500 dark:fill-gray-400" fontSize="14" fontWeight="700">+</text>

        {/* Equals line */}
        <line x1={dLeftX} y1={dSumY - 20} x2={dLeftX + waveWidth} y2={dSumY - 20} stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeWidth="1" strokeDasharray="2,2" />
        <text x={dLeftX - 2} y={dSumY - 15} className="fill-gray-500 dark:fill-gray-400" fontSize="14" fontWeight="700">=</text>

        {/* Sum wave (green, flat line) */}
        <line x1={dLeftX} y1={dSumY} x2={dLeftX + waveWidth} y2={dSumY} className="stroke-emerald-500" strokeWidth="2.5" />
        <text x={dLeftX + waveWidth + 5} y={dSumY + 4} className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="700">0</text>

        {/* Amplitude label */}
        <text x={dLeftX + panelWidth / 2} y={228} textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="11" fontWeight="600">Sum = 0 (silence)</text>

        {/* Bottom legend */}
        <line x1={100} y1={250} x2={120} y2={250} className="stroke-blue-500" strokeWidth="1.5" />
        <text x={125} y={254} className="fill-gray-600 dark:fill-gray-300" fontSize="10">Wave 1</text>
        <line x1={200} y1={250} x2={220} y2={250} className="stroke-red-500" strokeWidth="1.5" strokeDasharray="5,3" />
        <text x={225} y={254} className="fill-gray-600 dark:fill-gray-300" fontSize="10">Wave 2</text>
        <line x1={300} y1={250} x2={320} y2={250} className="stroke-emerald-500" strokeWidth="2.5" />
        <text x={325} y={254} className="fill-gray-600 dark:fill-gray-300" fontSize="10">Sum</text>
      </svg>
    </div>
  );
}
