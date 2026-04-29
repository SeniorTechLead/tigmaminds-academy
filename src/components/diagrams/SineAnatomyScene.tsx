/**
 * One sine wave with every key feature labelled: amplitude, period, peak,
 * trough, zero crossing.
 */
import Tara from './people/Tara';

export default function SineAnatomyScene() {
  const W = 760, H = 380;
  const xStart = 200, xEnd = 720, midY = 200;
  const amp = 80;
  const period = (xEnd - xStart) / 2; // 2 cycles fit

  const buildWave = () => {
    const pts: string[] = [];
    for (let p = 0; p <= 1; p += 0.003) {
      const x = xStart + p * (xEnd - xStart);
      const y = midY - amp * Math.sin(p * 4 * Math.PI);
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  };

  // Key points (first cycle)
  const peakX = xStart + period / 4;
  const troughX = xStart + 3 * period / 4;
  const zeroX1 = xStart;
  const zeroX2 = xStart + period / 2;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Anatomy of a sine wave: amplitude, period, peak, trough, zero crossings">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        <rect x="20" y="14" width="270" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          The parts of a sine wave
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Each name describes one feature.
        </text>

        <Tara x={100} y={350} scale={0.85} pose="pointing" />

        {/* Centre line */}
        <line x1={xStart} y1={midY} x2={xEnd} y2={midY} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
        <text x={xEnd + 6} y={midY + 4} fontSize="10" fill="#475569" className="dark:fill-gray-400">centre</text>

        {/* The wave */}
        <polyline points={buildWave()} fill="none" stroke="#1e40af" strokeWidth="2.5" />

        {/* Amplitude marker (peak to centre) */}
        <line x1={peakX} y1={midY} x2={peakX} y2={midY - amp}
          stroke="#dc2626" strokeWidth="1.5" markerStart="url(#arDown-sa)" markerEnd="url(#arUp-sa)" />
        <defs>
          <marker id="arUp-sa" markerWidth="6" markerHeight="8" refX="3" refY="1" orient="auto">
            <polygon points="0 8, 3 0, 6 8" fill="#dc2626" />
          </marker>
          <marker id="arDown-sa" markerWidth="6" markerHeight="8" refX="3" refY="7" orient="auto">
            <polygon points="0 0, 3 8, 6 0" fill="#dc2626" />
          </marker>
        </defs>
        <rect x={peakX + 8} y={midY - amp / 2 - 11} width="86" height="22" rx="11"
          fill="#fee2e2" stroke="#dc2626" strokeWidth="1" className="dark:fill-red-900/40 dark:stroke-red-400" />
        <text x={peakX + 51} y={midY - amp / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#b91c1c" className="dark:fill-red-200">
          amplitude
        </text>

        {/* Period marker (zero to next zero same direction) */}
        <line x1={zeroX1} y1={midY + amp + 26} x2={zeroX1 + period} y2={midY + amp + 26}
          stroke="#16a34a" strokeWidth="1.5" markerStart="url(#arL-sa)" markerEnd="url(#arR-sa)" />
        <defs>
          <marker id="arR-sa" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#16a34a" />
          </marker>
          <marker id="arL-sa" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
            <polygon points="8 0, 0 3, 8 6" fill="#16a34a" />
          </marker>
        </defs>
        <rect x={zeroX1 + period / 2 - 36} y={midY + amp + 32} width="72" height="22" rx="11"
          fill="#dcfce7" stroke="#16a34a" strokeWidth="1" className="dark:fill-emerald-900/40 dark:stroke-emerald-400" />
        <text x={zeroX1 + period / 2} y={midY + amp + 47} textAnchor="middle" fontSize="11" fontWeight="700" fill="#15803d" className="dark:fill-emerald-200">
          period
        </text>

        {/* Peak label */}
        <circle cx={peakX} cy={midY - amp} r="5" fill="#facc15" stroke="#854d0e" strokeWidth="1.5" />
        <text x={peakX} y={midY - amp - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#854d0e">
          peak
        </text>

        {/* Trough label */}
        <circle cx={troughX} cy={midY + amp} r="5" fill="#a78bfa" stroke="#5b21b6" strokeWidth="1.5" />
        <text x={troughX} y={midY + amp + 18} textAnchor="middle" fontSize="11" fontWeight="700" fill="#6b21a8">
          trough
        </text>

        {/* Zero crossing label */}
        <circle cx={zeroX2} cy={midY} r="5" fill="white" stroke="#0f172a" strokeWidth="1.5" />
        <text x={zeroX2 + 8} y={midY - 10} fontSize="10" fontWeight="600" fill="#475569" className="dark:fill-gray-300">
          zero crossing
        </text>

        <rect x={W / 2 - 240} y={H - 26} width="480" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          y(t) = A sin(2πt / T) — A is amplitude, T is period.
        </text>
      </svg>
    </div>
  );
}
