/**
 * Three sine waves with different frequencies — slow, medium, fast.
 * Tara compares two tuning forks.
 */
import Tara from './people/Tara';

export default function FrequencyScene() {
  const W = 760, H = 380;

  // Three waves: 1 Hz, 3 Hz, 6 Hz over the same time window
  const waves = [
    { freq: 1, color: '#3b82f6', label: 'Slow (1 Hz)', y: 100 },
    { freq: 3, color: '#16a34a', label: 'Medium (3 Hz)', y: 200 },
    { freq: 6, color: '#dc2626', label: 'Fast (6 Hz)', y: 300 },
  ];

  const xStart = 220, xEnd = 720;
  const amp = 24;

  const buildWave = (freq: number, midY: number) => {
    const pts: string[] = [];
    for (let p = 0; p <= 1; p += 0.005) {
      const x = xStart + p * (xEnd - xStart);
      const y = midY - amp * Math.sin(p * 2 * Math.PI * freq);
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  };

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Three sine waves at 1, 3, and 6 Hz — frequency is how fast the wave repeats">

        <rect x="0" y="0" width={W} height={H} fill="#f0f9ff" className="dark:fill-gray-900" />

        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Slow wave, fast wave
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Frequency = cycles per second.
        </text>

        <Tara x={100} y={350} scale={0.85} pose="thinking" />

        {waves.map(w => (
          <g key={w.freq}>
            <line x1={xStart} y1={w.y} x2={xEnd} y2={w.y} stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
            <polyline points={buildWave(w.freq, w.y)} fill="none" stroke={w.color} strokeWidth="2.5" />
            <rect x={xStart - 110} y={w.y - 12} width="100" height="24" rx="12"
              fill="white" stroke={w.color} strokeWidth="1.5" className="dark:fill-gray-800" />
            <text x={xStart - 60} y={w.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={w.color}>
              {w.label}
            </text>
          </g>
        ))}

        <rect x={W / 2 - 240} y={H - 26} width="480" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          1 Hz = 1 cycle per second. Higher frequency = higher pitch (in sound).
        </text>
      </svg>
    </div>
  );
}
