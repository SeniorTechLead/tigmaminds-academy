export default function SunsetSimulatorOutputDiagram() {
  const angles = [
    { label: '90° (noon)', colors: ['#1a75ff', '#3388ff', '#55aaff', '#77ccff', '#99ddff'] },
    { label: '30°', colors: ['#3366cc', '#6688bb', '#cc8844', '#dd7733', '#ee6622'] },
    { label: '10°', colors: ['#334477', '#775533', '#cc6622', '#dd4411', '#ee3300'] },
    { label: '2° (sunset)', colors: ['#221133', '#553322', '#aa3311', '#cc2200', '#dd1100'] },
  ];

  const stripW = 100;
  const stripH = 160;
  const gap = 30;
  const startX = 70;
  const startY = 20;
  const totalW = startX + angles.length * (stripW + gap) + 30;

  return (
    <div className="bg-gray-950 rounded-xl p-4 my-4">
      <p className="text-center text-sm font-bold text-gray-300 uppercase tracking-wider mb-1">
        Expected Output — Your Sunset Simulator Should Produce This
      </p>
      <p className="text-center text-xs text-gray-500 mb-3">
        Each strip shows sky colour from zenith (top) to horizon (bottom) at different sun angles
      </p>
      <svg viewBox={`0 0 ${totalW} 290`} className="w-full max-w-xl mx-auto">
        {angles.map((angle, ai) => {
          const x = startX + ai * (stripW + gap);
          return (
            <g key={ai}>
              <defs>
                <linearGradient id={`sunset-grad-${ai}`} x1="0" y1="0" x2="0" y2="1">
                  {angle.colors.map((c, ci) => (
                    <stop key={ci} offset={`${(ci / (angle.colors.length - 1)) * 100}%`} stopColor={c} />
                  ))}
                </linearGradient>
              </defs>
              <rect x={x} y={startY} width={stripW} height={stripH} rx={8} fill={`url(#sunset-grad-${ai})`} />
              <rect x={x} y={startY} width={stripW} height={stripH} rx={8} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

              {/* Zenith / Horizon labels */}
              {ai === 0 && (
                <>
                  <text x={x - 10} y={startY + 14} textAnchor="end" fontSize="10" fill="#888">Zenith</text>
                  <text x={x - 10} y={startY + stripH - 6} textAnchor="end" fontSize="10" fill="#888">Horizon</text>
                </>
              )}

              {/* Sun angle label — below strip with good spacing */}
              <text x={x + stripW / 2} y={startY + stripH + 20} textAnchor="middle" fontSize="12" fontWeight="600" fill="white">
                {angle.label}
              </text>

              {/* Sun icon for low angles */}
              {ai >= 2 && (
                <circle cx={x + stripW / 2} cy={startY + stripH - 10} r={6} fill="#FF6B35" opacity={0.7} />
              )}
            </g>
          );
        })}

        {/* Arrow — well below the degree labels */}
        <defs>
          <marker id="sim-arrow" markerWidth="7" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 7 3, 0 6" fill="#f59e0b" />
          </marker>
        </defs>
        <line
          x1={startX + 40}
          y1={startY + stripH + 45}
          x2={startX + angles.length * (stripW + gap) - gap - 40}
          y2={startY + stripH + 45}
          stroke="#f59e0b"
          strokeWidth={1.5}
          markerEnd="url(#sim-arrow)"
        />
        <text
          x={(startX + startX + angles.length * (stripW + gap) - gap) / 2}
          y={startY + stripH + 62}
          textAnchor="middle"
          fontSize="11"
          fill="#f59e0b"
        >
          Sun descending toward horizon
        </text>

        {/* Code hint — well below arrow */}
        <text x={totalW / 2} y={startY + stripH + 90} textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-500">
          Use the Rayleigh formula (intensity ∝ 1/λ⁴) to calculate how much of each colour survives
        </text>
      </svg>
    </div>
  );
}
