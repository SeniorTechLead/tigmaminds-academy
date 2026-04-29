/**
 * Phase offset diagram — two sine waves, one shifted by a phase angle.
 * Interactive: slider to change the phase offset.
 */
import { useState } from 'react';

export default function PhaseDiagram() {
  const [phase, setPhase] = useState(90);

  const totalW = 460;
  const totalH = 200;
  const waveY = 105;
  const amplitude = 35;
  const startX = 50;
  const endX = totalW - 20;
  const waveLen = endX - startX;

  const makeWave = (phaseOffset: number) => {
    const points: string[] = [];
    for (let x = startX; x <= endX; x += 2) {
      const t = (x - startX) / waveLen;
      const y = waveY - Math.sin((t * 2 * Math.PI) + (phaseOffset * Math.PI / 180)) * amplitude;
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      {/* Phase slider */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Phase offset:</span>
        <input
          type="range" min="0" max="360" value={phase}
          onChange={(e) => setPhase(Number(e.target.value))}
          className="w-40 accent-violet-500"
        />
        <span className="text-sm font-bold text-violet-600 dark:text-violet-400 w-12 text-right">{phase}°</span>
      </div>

      <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full" role="img" aria-label={`Two sine waves with ${phase} degree phase offset`}>
        {/* Title */}
        <text x={totalW / 2} y="16" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="12" fontWeight="700">
          Phase: Where the Wave Starts
        </text>

        {/* Axis */}
        <line x1={startX} y1={waveY} x2={endX} y2={waveY} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />

        {/* Wave 1: reference (no offset) */}
        <polyline points={makeWave(0)} fill="none" className="stroke-sky-400 dark:stroke-sky-500" strokeWidth="2" />

        {/* Wave 2: phase shifted */}
        <polyline points={makeWave(phase)} fill="none" className="stroke-violet-400 dark:stroke-violet-500" strokeWidth="2" strokeDasharray="6 3" />

        {/* Legend */}
        <line x1={startX} y1="32" x2={startX + 20} y2="32" className="stroke-sky-400" strokeWidth="2" />
        <text x={startX + 25} y="36" className="fill-sky-600 dark:fill-sky-400" fontSize="9" fontWeight="600">
          Reference (0°)
        </text>

        <line x1={startX + 130} y1="32" x2={startX + 150} y2="32" className="stroke-violet-400" strokeWidth="2" strokeDasharray="6 3" />
        <text x={startX + 155} y="36" className="fill-violet-600 dark:fill-violet-400" fontSize="9" fontWeight="600">
          Shifted ({phase}°)
        </text>

        {/* Phase annotation */}
        {phase > 0 && phase < 360 && (
          <text x={totalW / 2} y={waveY + amplitude + 22} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
            {phase === 180 ? 'Exactly out of phase — waves cancel (destructive)' :
             phase === 360 || phase === 0 ? 'In phase — waves reinforce (constructive)' :
             phase === 90 ? 'Quarter cycle ahead' :
             phase === 270 ? 'Quarter cycle behind' :
             `Offset by ${phase}° of the cycle`}
          </text>
        )}

        {/* Footer */}
        <text x={totalW / 2} y={totalH - 6} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="8">
          Phase = how far along the cycle a wave has started. 360° = back to the same position.
        </text>
      </svg>
    </div>
  );
}
