/**
 * Resonance diagram — shows how amplitude peaks when driving frequency
 * matches the natural frequency. Interactive frequency slider.
 */
import { useState } from 'react';

export default function ResonanceDiagram() {
  const [drivingFreq, setDrivingFreq] = useState(50);

  const naturalFreq = 50; // center
  const totalW = 460;
  const totalH = 220;
  const graphX = 60;
  const graphW = 360;
  const graphY = 50;
  const graphH = 110;

  // Resonance curve: amplitude peaks at natural frequency
  const resonanceCurve = (f: number) => {
    const delta = (f - naturalFreq) / 12;
    return 1 / (1 + delta * delta);
  };

  const curvePoints: string[] = [];
  for (let f = 10; f <= 90; f += 1) {
    const x = graphX + ((f - 10) / 80) * graphW;
    const amp = resonanceCurve(f);
    const y = graphY + graphH - amp * graphH;
    curvePoints.push(`${x},${y}`);
  }

  const currentAmp = resonanceCurve(drivingFreq);
  const currentX = graphX + ((drivingFreq - 10) / 80) * graphW;
  const currentY = graphY + graphH - currentAmp * graphH;

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      {/* Frequency slider */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Driving frequency:</span>
        <input
          type="range" min="10" max="90" value={drivingFreq}
          onChange={(e) => setDrivingFreq(Number(e.target.value))}
          className="w-40 accent-rose-500"
        />
        <span className="text-sm font-bold text-rose-600 dark:text-rose-400 w-12 text-right">{drivingFreq} Hz</span>
      </div>

      <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full" role="img" aria-label="Resonance curve showing amplitude peak at natural frequency">
        {/* Title */}
        <text x={totalW / 2} y="16" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="12" fontWeight="700">
          Resonance: Amplitude vs Driving Frequency
        </text>

        {/* Axes */}
        <line x1={graphX} y1={graphY + graphH} x2={graphX + graphW} y2={graphY + graphH}
          className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <line x1={graphX} y1={graphY} x2={graphX} y2={graphY + graphH}
          className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />

        {/* Y-axis label */}
        <text x="15" y={graphY + graphH / 2} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8"
          transform={`rotate(-90, 15, ${graphY + graphH / 2})`}>
          Amplitude
        </text>

        {/* X-axis label */}
        <text x={graphX + graphW / 2} y={graphY + graphH + 18} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">
          Driving Frequency (Hz)
        </text>

        {/* Natural frequency marker */}
        <line x1={graphX + graphW / 2} y1={graphY} x2={graphX + graphW / 2} y2={graphY + graphH}
          className="stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1" strokeDasharray="3 3" />
        <text x={graphX + graphW / 2} y={graphY - 4} textAnchor="middle"
          className="fill-emerald-600 dark:fill-emerald-400" fontSize="8" fontWeight="700">
          Natural freq = {naturalFreq} Hz
        </text>

        {/* Resonance curve */}
        <polyline points={curvePoints.join(' ')} fill="none"
          className="stroke-rose-400 dark:stroke-rose-500" strokeWidth="2.5" />

        {/* Current position indicator */}
        <circle cx={currentX} cy={currentY} r="5"
          className="fill-rose-500 stroke-white dark:stroke-gray-900" strokeWidth="2" />
        <line x1={currentX} y1={currentY} x2={currentX} y2={graphY + graphH}
          className="stroke-rose-300 dark:stroke-rose-700" strokeWidth="1" strokeDasharray="3 2" />

        {/* Amplitude readout */}
        <text x={currentX + 10} y={currentY - 8}
          className="fill-rose-600 dark:fill-rose-400" fontSize="9" fontWeight="700">
          {(currentAmp * 100).toFixed(0)}%
        </text>

        {/* Status text */}
        <text x={totalW / 2} y={totalH - 8} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontWeight="600">
          {Math.abs(drivingFreq - naturalFreq) <= 3
            ? '🔴 At resonance! Maximum amplitude — the system vibrates wildly.'
            : Math.abs(drivingFreq - naturalFreq) <= 15
              ? '🟡 Near resonance — noticeable vibration increase.'
              : '🟢 Far from resonance — small amplitude, system barely responds.'}
        </text>
      </svg>
    </div>
  );
}
