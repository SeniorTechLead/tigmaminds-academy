export default function WaveEquationDiagram() {
  // Generate sine wave points
  const wavePoints: string[] = [];
  const startX = 40;
  const endX = 460;
  const midY = 70;
  const amplitude = 40;
  const wavelength = 140; // pixels per full cycle
  const steps = 200;

  for (let i = 0; i <= steps; i++) {
    const x = startX + (i / steps) * (endX - startX);
    const y = midY - amplitude * Math.sin((2 * Math.PI * (x - startX)) / wavelength);
    wavePoints.push(`${x},${y}`);
  }

  const wavePath = wavePoints.join(' ');

  // Key positions
  const crest1X = startX + wavelength * 0.25;
  const crest2X = startX + wavelength * 1.25;
  const troughX = startX + wavelength * 0.75;

  return (
    <div className="my-4">
      <svg viewBox="0 0 500 220" className="w-full max-w-xl mx-auto" role="img" aria-label="Wave equation diagram showing wavelength, amplitude, and the wave speed equation">
        {/* Equilibrium line */}
        <line x1={30} y1={midY} x2={470} y2={midY} stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeWidth="1" strokeDasharray="4,3" />
        <text x={475} y={midY + 4} className="fill-gray-400 dark:fill-gray-500" fontSize="10">equilibrium</text>

        {/* Sine wave */}
        <polyline points={wavePath} fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5" strokeLinecap="round" />

        {/* Wavelength arrow (between two crests) */}
        <line x1={crest1X} y1={20} x2={crest2X} y2={20} className="stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="1.5" />
        <polygon points={`${crest1X},20 ${crest1X + 6},17 ${crest1X + 6},23`} className="fill-emerald-600 dark:fill-emerald-400" />
        <polygon points={`${crest2X},20 ${crest2X - 6},17 ${crest2X - 6},23`} className="fill-emerald-600 dark:fill-emerald-400" />
        <text x={(crest1X + crest2X) / 2} y={16} textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="12" fontWeight="700">Wavelength (λ)</text>

        {/* Dashed lines from crests to arrow */}
        <line x1={crest1X} y1={midY - amplitude} x2={crest1X} y2={22} className="stroke-emerald-500" strokeWidth="1" strokeDasharray="2,2" opacity={0.5} />
        <line x1={crest2X} y1={midY - amplitude} x2={crest2X} y2={22} className="stroke-emerald-500" strokeWidth="1" strokeDasharray="2,2" opacity={0.5} />

        {/* Amplitude arrow (vertical, from equilibrium to crest) */}
        <line x1={crest1X + 10} y1={midY} x2={crest1X + 10} y2={midY - amplitude} className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" />
        <polygon points={`${crest1X + 10},${midY - amplitude} ${crest1X + 7},${midY - amplitude + 6} ${crest1X + 13},${midY - amplitude + 6}`} className="fill-red-500 dark:fill-red-400" />
        <polygon points={`${crest1X + 10},${midY} ${crest1X + 7},${midY - 6} ${crest1X + 13},${midY - 6}`} className="fill-red-500 dark:fill-red-400" />
        <text x={crest1X + 22} y={(midY + midY - amplitude) / 2 + 4} className="fill-red-600 dark:fill-red-300" fontSize="11" fontWeight="700">A</text>
        <text x={crest1X + 22} y={(midY + midY - amplitude) / 2 + 16} className="fill-red-500 dark:fill-red-400" fontSize="10">(amplitude)</text>

        {/* Crest and trough labels */}
        <text x={crest1X} y={midY - amplitude - 6} textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10">crest</text>
        <text x={troughX} y={midY + amplitude + 14} textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10">trough</text>

        {/* Period annotation */}
        <text x={460} y={midY + amplitude + 24} textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Period T = 1/f
        </text>

        {/* Divider line */}
        <line x1={30} y1={135} x2={470} y2={135} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="1" />

        {/* Wave equation */}
        <text x={250} y={160} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="16" fontWeight="700">
          v = f × λ
        </text>
        <text x={250} y={178} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="11">
          wave speed = frequency × wavelength
        </text>

        {/* Worked example */}
        <rect x={80} y={188} width={340} height={24} rx={4} className="fill-sky-50 dark:fill-sky-900/30 stroke-sky-300 dark:stroke-sky-700" strokeWidth="1" />
        <text x={250} y={205} textAnchor="middle" className="fill-sky-700 dark:fill-sky-300" fontSize="11" fontWeight="600">
          Sound in air: 343 m/s = 262 Hz × 1.31 m
        </text>
      </svg>
    </div>
  );
}
