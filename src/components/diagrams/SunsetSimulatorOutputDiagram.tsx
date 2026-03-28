export default function SunsetSimulatorOutputDiagram() {
  // Simulate what the student's Python output should look like:
  // A vertical gradient from blue (zenith) to orange/red (horizon)
  // at different sun angles

  const angles = [
    { label: '90° (noon)', colors: ['#1a75ff', '#3388ff', '#55aaff', '#77ccff', '#99ddff'] },
    { label: '30°', colors: ['#3366cc', '#6688bb', '#cc8844', '#dd7733', '#ee6622'] },
    { label: '10°', colors: ['#334477', '#775533', '#cc6622', '#dd4411', '#ee3300'] },
    { label: '2° (sunset)', colors: ['#221133', '#553322', '#aa3311', '#cc2200', '#dd1100'] },
  ];

  const stripW = 80;
  const stripH = 140;
  const gap = 24;
  const startX = 50;
  const startY = 40;
  const totalW = startX + angles.length * (stripW + gap) + 20;

  return (
    <div className="bg-gray-950 rounded-xl p-4 my-4">
      <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
        Expected Output — Your Sunset Simulator Should Produce This
      </p>
      <p className="text-center text-[10px] text-gray-500 mb-3">
        Each strip shows sky colour from zenith (top) to horizon (bottom) at different sun angles
      </p>
      <svg viewBox={`0 0 ${totalW} 210`} className="w-full max-w-lg mx-auto">
        {angles.map((angle, ai) => {
          const x = startX + ai * (stripW + gap);
          return (
            <g key={ai}>
              {/* Gradient strip */}
              <defs>
                <linearGradient id={`sunset-grad-${ai}`} x1="0" y1="0" x2="0" y2="1">
                  {angle.colors.map((c, ci) => (
                    <stop key={ci} offset={`${(ci / (angle.colors.length - 1)) * 100}%`} stopColor={c} />
                  ))}
                </linearGradient>
              </defs>
              <rect x={x} y={startY} width={stripW} height={stripH} rx={6} fill={`url(#sunset-grad-${ai})`} />

              {/* Border */}
              <rect x={x} y={startY} width={stripW} height={stripH} rx={6} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

              {/* Zenith / Horizon labels (only on first strip) */}
              {ai === 0 && (
                <>
                  <text x={x - 6} y={startY + 10} textAnchor="end" className="text-[7px]" fill="#888">Zenith</text>
                  <text x={x - 6} y={startY + stripH - 4} textAnchor="end" className="text-[7px]" fill="#888">Horizon</text>
                </>
              )}

              {/* Sun angle label */}
              <text x={x + stripW / 2} y={startY + stripH + 16} textAnchor="middle" className="text-[9px] font-semibold" fill="white">
                {angle.label}
              </text>

              {/* Sun icon near horizon for low angles */}
              {ai >= 2 && (
                <circle cx={x + stripW / 2} cy={startY + stripH - 8} r={5} fill="#FF6B35" opacity={0.7} />
              )}
            </g>
          );
        })}

        {/* Arrow showing sun descending */}
        <defs>
          <marker id="sim-arrow" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" fill="#f59e0b" />
          </marker>
        </defs>
        <line
          x1={startX + 30}
          y1={startY + stripH + 28}
          x2={startX + angles.length * (stripW + gap) - gap - 30}
          y2={startY + stripH + 28}
          stroke="#f59e0b"
          strokeWidth={1}
          markerEnd="url(#sim-arrow)"
        />
        <text
          x={(startX + startX + angles.length * (stripW + gap) - gap) / 2}
          y={startY + stripH + 40}
          textAnchor="middle"
          className="text-[8px]"
          fill="#f59e0b"
        >
          Sun descending toward horizon
        </text>

        {/* Code hint */}
        <text x={totalW / 2} y={200} textAnchor="middle" className="text-[8px]" fill="#666">
          Use the Rayleigh formula (intensity ∝ 1/λ⁴) to calculate how much of each colour survives at each angle
        </text>
      </svg>
    </div>
  );
}
