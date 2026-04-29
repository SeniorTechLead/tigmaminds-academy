/**
 * A bamboo flute. Three plotted standing waves: fundamental, 2nd harmonic,
 * 3rd harmonic. Together they make the rich tone of any real instrument.
 */
import Tara from './people/Tara';

export default function HarmonicsScene() {
  const W = 760, H = 380;
  const xStart = 220, xEnd = 720;

  const harmonics = [
    { n: 1, amp: 38, color: '#1e40af', y: 100, label: '1st (fundamental)' },
    { n: 2, amp: 22, color: '#16a34a', y: 200, label: '2nd harmonic' },
    { n: 3, amp: 14, color: '#dc2626', y: 300, label: '3rd harmonic' },
  ];

  const buildWave = (n: number, amp: number, midY: number) => {
    const pts: string[] = [];
    for (let p = 0; p <= 1; p += 0.004) {
      const x = xStart + p * (xEnd - xStart);
      const y = midY - amp * Math.sin(p * 2 * Math.PI * n);
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  };

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A bamboo flute's tone is the sum of its fundamental and harmonics — three sine waves at 1×, 2×, and 3× the base frequency">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          A note is many notes
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Fundamental + harmonics = real tone.
        </text>

        <Tara x={100} y={350} scale={0.85} pose="thinking" />

        {/* Three harmonic waves */}
        {harmonics.map(h => (
          <g key={h.n}>
            <line x1={xStart} y1={h.y} x2={xEnd} y2={h.y} stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
            <polyline points={buildWave(h.n, h.amp, h.y)} fill="none" stroke={h.color} strokeWidth="2.5" />
            <rect x={xStart - 130} y={h.y - 12} width="120" height="24" rx="12"
              fill="white" stroke={h.color} strokeWidth="1.5" className="dark:fill-gray-800" />
            <text x={xStart - 70} y={h.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={h.color}>
              {h.label}
            </text>
          </g>
        ))}

        <rect x={W / 2 - 250} y={H - 26} width="500" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Harmonics are integer multiples of the fundamental frequency. They give each instrument its colour.
        </text>
      </svg>
    </div>
  );
}
