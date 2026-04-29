/**
 * Two close-frequency sine waves added together produce a "beat" — a
 * slow waxing and waning amplitude at the difference frequency.
 */
import Tara from './people/Tara';

export default function BeatsScene() {
  const W = 760, H = 380;
  const xStart = 80, xEnd = 740;
  const f1 = 8, f2 = 9;
  const amp = 22;

  // Two source waves, then their sum
  const buildWave = (f: number, midY: number) => {
    const pts: string[] = [];
    for (let p = 0; p <= 1; p += 0.002) {
      const x = xStart + p * (xEnd - xStart);
      const y = midY - amp * Math.sin(p * 2 * Math.PI * f);
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  };

  // Sum wave
  const sumWave: string[] = [];
  for (let p = 0; p <= 1; p += 0.002) {
    const x = xStart + p * (xEnd - xStart);
    const y = 270 - (amp * Math.sin(p * 2 * Math.PI * f1) + amp * Math.sin(p * 2 * Math.PI * f2));
    sumWave.push(`${x},${y}`);
  }
  // Envelope
  const envelopeUpper: string[] = [];
  const envelopeLower: string[] = [];
  for (let p = 0; p <= 1; p += 0.002) {
    const x = xStart + p * (xEnd - xStart);
    const env = 2 * amp * Math.abs(Math.cos(p * Math.PI * (f2 - f1)));
    envelopeUpper.push(`${x},${270 - env}`);
    envelopeLower.push(`${x},${270 + env}`);
  }

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Beats: two close frequencies add to give a wave that loudens and softens at the difference frequency">

        <rect x="0" y="0" width={W} height={H} fill="#f0f9ff" className="dark:fill-gray-900" />

        <rect x="20" y="14" width="290" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Two close notes make a wobble
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          That wobble is the beat frequency.
        </text>

        {/* Wave 1: 8 Hz */}
        <line x1={xStart} y1={120} x2={xEnd} y2={120} stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
        <polyline points={buildWave(f1, 120)} fill="none" stroke="#3b82f6" strokeWidth="1.8" />
        <text x={20} y={125} fontSize="11" fontWeight="700" fill="#1d4ed8">8 Hz</text>

        {/* Wave 2: 9 Hz */}
        <line x1={xStart} y1={190} x2={xEnd} y2={190} stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
        <polyline points={buildWave(f2, 190)} fill="none" stroke="#16a34a" strokeWidth="1.8" />
        <text x={20} y={195} fontSize="11" fontWeight="700" fill="#15803d">9 Hz</text>

        <text x={W / 2} y={235} textAnchor="middle" fontSize="13" fontWeight="700" fill="#dc2626">
          Sum (what your ear hears):
        </text>

        {/* Sum wave with envelope */}
        <line x1={xStart} y1={270} x2={xEnd} y2={270} stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
        <polyline points={envelopeUpper.join(' ')} fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
        <polyline points={envelopeLower.join(' ')} fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
        <polyline points={sumWave.join(' ')} fill="none" stroke="#0f172a" strokeWidth="1.5" />

        <Tara x={100} y={350} scale={0.7} pose="thinking" />

        <rect x={W / 2 - 250} y={H - 28} width="500" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Beat frequency = |f₁ − f₂| = 1 Hz. Piano tuners use this to match strings.
        </text>
      </svg>
    </div>
  );
}
