/**
 * Two sine waves of identical amplitude and frequency, but offset in time.
 * Phase shift — same shape, different starting moment.
 */
import Tara from './people/Tara';

export default function PhaseShiftScene() {
  const W = 760, H = 380;
  const xStart = 220, xEnd = 720, midY = 200;
  const amp = 50, freq = 2;

  const buildWave = (phaseOffset: number) => {
    const pts: string[] = [];
    for (let p = 0; p <= 1; p += 0.004) {
      const x = xStart + p * (xEnd - xStart);
      const y = midY - amp * Math.sin(p * 2 * Math.PI * freq + phaseOffset);
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  };

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Two sine waves of identical shape but offset by 90 degrees in phase">

        <rect x="0" y="0" width={W} height={H} fill="#f0fdf4" className="dark:fill-gray-900" />

        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Same shape, different start
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Phase = where the wave begins.
        </text>

        <Tara x={100} y={350} scale={0.85} pose="thinking" />

        <line x1={xStart} y1={midY} x2={xEnd} y2={midY} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />

        {/* Wave 1: phase 0 */}
        <polyline points={buildWave(0)} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
        {/* Wave 2: phase π/2 (90°) */}
        <polyline points={buildWave(Math.PI / 2)} fill="none" stroke="#dc2626" strokeWidth="2.5" />

        {/* Phase shift highlight */}
        <line x1={xStart} y1={midY - amp - 16} x2={xStart + (xEnd - xStart) / 8} y2={midY - amp - 16}
          stroke="#f97316" strokeWidth="2" markerEnd="url(#arShift-ps)" markerStart="url(#arShiftL-ps)" />
        <defs>
          <marker id="arShift-ps" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#f97316" />
          </marker>
          <marker id="arShiftL-ps" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
            <polygon points="8 0, 0 3, 8 6" fill="#f97316" />
          </marker>
        </defs>
        <text x={xStart + (xEnd - xStart) / 16} y={midY - amp - 22} textAnchor="middle" fontSize="11" fontWeight="700" fill="#c2410c">
          phase shift
        </text>

        <g transform="translate(540, 90)">
          <rect x="0" y="0" width="200" height="62" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
          <line x1="14" y1="22" x2="36" y2="22" stroke="#3b82f6" strokeWidth="3" />
          <text x="44" y="26" fontSize="11" fontWeight="600" fill="#0f172a" className="dark:fill-gray-100">sin(2πt)</text>
          <line x1="14" y1="44" x2="36" y2="44" stroke="#dc2626" strokeWidth="3" />
          <text x="44" y="48" fontSize="11" fontWeight="600" fill="#0f172a" className="dark:fill-gray-100">sin(2πt + π/2)</text>
        </g>

        <rect x={W / 2 - 250} y={H - 26} width="500" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Phase shift slides the wave horizontally — π/2 = a quarter cycle ahead.
        </text>
      </svg>
    </div>
  );
}
