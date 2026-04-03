/**
 * Digital vs Analog signal comparison.
 * Left: analog smooth wave. Right: digital stepped signal (0/1).
 */
export default function DigitalAnalogDiagram() {
  const totalW = 480;
  const totalH = 200;
  const halfW = totalW / 2;
  const waveY = 100;
  const amplitude = 35;

  // Analog: smooth sine wave points
  const analogPoints: string[] = [];
  for (let x = 30; x <= halfW - 20; x += 2) {
    const t = (x - 30) / (halfW - 50);
    const y = waveY - Math.sin(t * Math.PI * 3) * amplitude;
    analogPoints.push(`${x},${y}`);
  }

  // Digital: stepped 0/1 signal
  const digitalSteps = [
    { x: halfW + 20, v: 0 }, { x: halfW + 50, v: 1 }, { x: halfW + 80, v: 1 },
    { x: halfW + 110, v: 0 }, { x: halfW + 140, v: 0 }, { x: halfW + 170, v: 1 },
    { x: halfW + 200, v: 0 }, { x: halfW + 230, v: 1 }, { x: halfW + 260, v: 1 },
    { x: halfW + 290, v: 0 },
  ];
  const digitalPath = digitalSteps.map((s, i) => {
    const y = waveY - s.v * amplitude * 1.5;
    const prevY = i > 0 ? waveY - digitalSteps[i - 1].v * amplitude * 1.5 : y;
    return i === 0 ? `M ${s.x} ${y}` : `L ${s.x} ${prevY} L ${s.x} ${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full max-w-lg mx-auto my-6" role="img" aria-label="Analog smooth wave vs digital stepped signal">
      {/* Title */}
      <text x={totalW / 2} y="16" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="12" fontWeight="700">
        Analog vs Digital Signals
      </text>

      {/* Divider */}
      <line x1={halfW} y1="30" x2={halfW} y2={totalH - 20} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" strokeDasharray="4 3" />

      {/* --- ANALOG side --- */}
      <text x={halfW / 2} y="38" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="11" fontWeight="700">
        Analog
      </text>
      {/* Axis */}
      <line x1="30" y1={waveY} x2={halfW - 20} y2={waveY} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
      {/* Smooth wave */}
      <polyline points={analogPoints.join(' ')} fill="none" className="stroke-emerald-400 dark:stroke-emerald-500" strokeWidth="2.5" />
      {/* Labels */}
      <text x={halfW / 2} y="52" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">
        Continuous — any value between 0 and 5V
      </text>
      <text x="18" y={waveY - amplitude - 6} className="fill-emerald-500 dark:fill-emerald-400" fontSize="7">5V</text>
      <text x="18" y={waveY + 4} className="fill-gray-400" fontSize="7">0V</text>
      <text x={halfW / 2} y={waveY + amplitude + 24} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="8">
        analogRead() → 0 to 1023
      </text>

      {/* --- DIGITAL side --- */}
      <text x={halfW + (totalW - halfW) / 2} y="38" textAnchor="middle" className="fill-sky-600 dark:fill-sky-400" fontSize="11" fontWeight="700">
        Digital
      </text>
      {/* Axis */}
      <line x1={halfW + 20} y1={waveY} x2={totalW - 20} y2={waveY} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
      {/* Stepped signal */}
      <path d={digitalPath} fill="none" className="stroke-sky-400 dark:stroke-sky-500" strokeWidth="2.5" />
      {/* Labels */}
      <text x={halfW + (totalW - halfW) / 2} y="52" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">
        Discrete — only HIGH (5V) or LOW (0V)
      </text>
      <text x={halfW + 8} y={waveY - amplitude * 1.5 - 4} className="fill-sky-500 dark:fill-sky-400" fontSize="7">HIGH</text>
      <text x={halfW + 8} y={waveY + 4} className="fill-gray-400" fontSize="7">LOW</text>
      <text x={halfW + (totalW - halfW) / 2} y={waveY + amplitude + 24} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="8">
        digitalRead() → 0 or 1
      </text>

      {/* Footer */}
      <text x={totalW / 2} y={totalH - 6} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="8">
        Sensors (light, temp) produce analog. Buttons and switches produce digital.
      </text>
    </svg>
  );
}
