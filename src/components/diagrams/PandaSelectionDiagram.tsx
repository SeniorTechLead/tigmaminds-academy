export default function PandaSelectionDiagram() {
  const generations = [
    { label: 'Gen 1', light: 8, medium: 6, dark: 2 },
    { label: 'Gen 5', light: 5, medium: 7, dark: 4 },
    { label: 'Gen 15', light: 2, medium: 5, dark: 9 },
    { label: 'Gen 50', light: 0, medium: 2, dark: 14 },
  ];

  const barW = 100;
  const barH = 16;
  const gapY = 90;

  return (
    <div className="my-4">
      <svg viewBox="0 0 560 430" className="w-full max-w-xl mx-auto" role="img" aria-label="Natural selection over generations: dark-furred finches survive better on dark volcanic rock">
        <rect width="560" height="430" rx="12" className="fill-slate-900" />

        <text x="280" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#86efac">Natural Selection in Action</text>
        <text x="280" y="46" textAnchor="middle" fontSize="11" fill="#94a3b8">Darwin’s finches on volcanic islands — dark rock favours dark feathers</text>

        {/* Environment indicator */}
        <rect x="400" y="65" width="140" height="55" rx="6" fill="#292524" opacity="0.6" />
        <text x="470" y="82" textAnchor="middle" fontSize="10" fill="#a8a29e">Environment:</text>
        <text x="470" y="98" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#78716c">Dark volcanic rock</text>
        <text x="470" y="112" textAnchor="middle" fontSize="10" fill="#a8a29e">Hawks hunt by sight</text>

        {/* Legend */}
        <g transform="translate(30, 65)">
          <rect x="0" y="0" width="14" height="14" rx="3" fill="#fde68a" />
          <text x="20" y="12" fontSize="10" fill="#fde68a">Light (easy to spot)</text>
          <rect x="0" y="20" width="14" height="14" rx="3" fill="#a16207" />
          <text x="20" y="32" fontSize="10" fill="#d4a437">Medium</text>
          <rect x="0" y="40" width="14" height="14" rx="3" fill="#44403c" />
          <text x="20" y="52" fontSize="10" fill="#a8a29e">Dark (hard to spot)</text>
        </g>

        {/* Generation rows */}
        {generations.map((gen, gi) => {
          const y = 135 + gi * gapY;
          const total = gen.light + gen.medium + gen.dark;
          const lightW = (gen.light / 16) * barW;
          const mediumW = (gen.medium / 16) * barW;
          const darkW = (gen.dark / 16) * barW;

          return (
            <g key={gen.label}>
              {/* Row label */}
              <text x="50" y={y + 10} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#e2e8f0">{gen.label}</text>
              <text x="50" y={y + 24} textAnchor="middle" fontSize="10" fill="#94a3b8">{total} birds</text>

              {/* Stacked bar */}
              <g transform={`translate(100, ${y})`}>
                <rect x="0" y="0" width={lightW * 3} height={barH} rx="3" fill="#fde68a" />
                <rect x={lightW * 3} y="0" width={mediumW * 3} height={barH} rx="0" fill="#a16207" />
                <rect x={lightW * 3 + mediumW * 3} y="0" width={darkW * 3} height={barH} rx="3" fill="#44403c" />

                {/* Count labels */}
                {gen.light > 0 && (
                  <text x={lightW * 1.5} y={barH / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1a1a1a">{gen.light}</text>
                )}
                {gen.medium > 0 && (
                  <text x={lightW * 3 + mediumW * 1.5} y={barH / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fde68a">{gen.medium}</text>
                )}
                {gen.dark > 0 && (
                  <text x={lightW * 3 + mediumW * 3 + darkW * 1.5} y={barH / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#e2e8f0">{gen.dark}</text>
                )}
              </g>

              {/* Bird icons */}
              <g transform={`translate(420, ${y - 5})`}>
                {Array.from({ length: Math.min(gen.dark, 5) }).map((_, i) => (
                  <g key={`bird-${gi}-${i}`} transform={`translate(${i * 22}, 0)`}>
                    <ellipse cx="8" cy="12" rx="7" ry="5" fill="#44403c" />
                    <circle cx="13" cy="8" r="4" fill="#57534e" />
                    <polygon points="17,8 22,7 17,10" fill="#f59e0b" />
                  </g>
                ))}
              </g>

              {/* Arrow to next generation */}
              {gi < generations.length - 1 && (
                <g>
                  <line x1="280" y1={y + 25} x2="280" y2={y + gapY - 10}
                    stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4,3" />
                  <text x="295" y={y + 55} fontSize="9" fill="#4ade80">
                    {gi === 0 ? 'Hawks eat light birds first' : gi === 1 ? 'Dark birds survive more' : 'Trait becomes dominant'}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Bottom insight */}
        <rect x="30" y="395" width="500" height="26" rx="6" fill="#86efac" opacity="0.12" />
        <text x="280" y="413" textAnchor="middle" fontSize="11" fill="#86efac">
          No bird “chooses” to be dark — random mutations + selective survival = gradual population change
        </text>
      </svg>
    </div>
  );
}
