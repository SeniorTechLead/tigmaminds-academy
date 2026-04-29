/**
 * Three sine waves with different amplitudes — same frequency, different
 * heights. Like the same note played quietly vs loudly.
 */
import Tara from './people/Tara';

export default function AmplitudeScene() {
  const W = 760, H = 380;

  const waves = [
    { amp: 12, color: '#bae6fd', label: 'Soft (A=1)', y: 200 },
    { amp: 30, color: '#3b82f6', label: 'Medium (A=2.5)', y: 200 },
    { amp: 60, color: '#1e40af', label: 'Loud (A=5)', y: 200 },
  ];

  const xStart = 240, xEnd = 720;
  const freq = 2;

  const buildWave = (a: number, midY: number) => {
    const pts: string[] = [];
    for (let p = 0; p <= 1; p += 0.004) {
      const x = xStart + p * (xEnd - xStart);
      const y = midY - a * Math.sin(p * 2 * Math.PI * freq);
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  };

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Three sine waves with the same frequency but different amplitudes — quiet, medium, and loud">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Quiet vs loud
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Same note, different amplitude.
        </text>

        <Tara x={100} y={350} scale={0.85} pose="thinking" />

        <line x1={xStart} y1="200" x2={xEnd} y2="200" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />

        {/* Draw faint, medium, bold waves layered */}
        {waves.map((w, i) => (
          <polyline key={i} points={buildWave(w.amp, w.y)} fill="none" stroke={w.color}
            strokeWidth={i === 2 ? 3 : 2} opacity={i === 0 ? 0.5 : 1} />
        ))}

        {/* Legend */}
        <g transform="translate(540, 90)">
          <rect x="0" y="0" width="200" height="80" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
          {waves.map((w, i) => (
            <g key={i} transform={`translate(14, ${20 + i * 18})`}>
              <line x1="0" y1="0" x2="22" y2="0" stroke={w.color} strokeWidth="3" />
              <text x="30" y="4" fontSize="11" fontWeight="600" fill="#0f172a" className="dark:fill-gray-100">
                {w.label}
              </text>
            </g>
          ))}
        </g>

        <rect x={W / 2 - 240} y={H - 26} width="480" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Amplitude = wave height. Bigger A → louder sound, brighter light, taller wave.
        </text>
      </svg>
    </div>
  );
}
