/**
 * Visual diagram showing how Python string indexing and slicing works.
 * Shows a string as a sequence of boxes with positive and negative indices,
 * and illustrates slice notation [start:stop:step].
 */
export default function StringSlicingDiagram() {
  const str = 'KAZIRANGA'.split('');
  const boxW = 38;
  const boxH = 36;
  const gap = 3;
  const startX = 44;
  const topY = 44;
  const cellW = boxW + gap;
  const rowW = str.length * cellW - gap;
  const totalW = startX + rowW + 20;

  // Y coordinates for each section (generous spacing)
  const negIdxY = topY + boxH + 14;
  const section1Y = negIdxY + 24;    // s[0:5]
  const section2Y = section1Y + 50;  // s[5:]
  const section3Y = section2Y + 50;  // s[::-1]
  const section4Y = section3Y + 56;  // s[::2]
  const legendY = section4Y + 56;
  const totalH = legendY + 16;

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full max-w-xl mx-auto" role="img" aria-label="String slicing diagram showing how Python indexes and slices a string">
      {/* Title */}
      <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
        String Indexing &amp; Slicing
      </text>

      {/* ── Character boxes with indices ── */}
      {str.map((ch, i) => {
        const x = startX + i * cellW;
        return (
          <g key={i}>
            <rect x={x} y={topY} width={boxW} height={boxH} rx="5"
              className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" />
            <text x={x + boxW / 2} y={topY + boxH / 2 + 1} textAnchor="middle" dominantBaseline="central"
              className="fill-gray-900 dark:fill-white" fontSize="15" fontWeight="700" fontFamily="monospace">
              {ch}
            </text>
            {/* Positive index above */}
            <text x={x + boxW / 2} y={topY - 5} textAnchor="middle"
              className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="600" fontFamily="monospace">
              {i}
            </text>
            {/* Negative index below */}
            <text x={x + boxW / 2} y={negIdxY} textAnchor="middle"
              className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="600" fontFamily="monospace">
              {i - str.length}
            </text>
          </g>
        );
      })}

      {/* Index/neg labels */}
      <text x="4" y={topY - 5} className="fill-emerald-600 dark:fill-emerald-400" fontSize="8" fontWeight="600">index</text>
      <text x="4" y={negIdxY} className="fill-blue-600 dark:fill-blue-400" fontSize="8" fontWeight="600">neg</text>

      {/* ── Example 1: s[0:5] = "KAZIR" ── */}
      {(() => {
        const y = section1Y;
        const x1 = startX;
        const w = 5 * cellW - gap;
        return (
          <g>
            <rect x={x1 - 1} y={y} width={w + 2} height="24" rx="5"
              className="fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-400 dark:stroke-emerald-700" strokeWidth="1" strokeDasharray="4 2" />
            <text x={x1 + 4} y={y + 16} className="fill-emerald-700 dark:fill-emerald-300" fontSize="11" fontWeight="600" fontFamily="monospace">
              s[0:5] = "KAZIR"
            </text>
            <text x={x1 + w + 12} y={y + 16} className="fill-gray-500 dark:fill-gray-400" fontSize="9">
              start at 0, stop before 5
            </text>
          </g>
        );
      })()}

      {/* ── Example 2: s[5:] = "ANGA" ── */}
      {(() => {
        const y = section2Y;
        const x1 = startX + 5 * cellW;
        const w = 4 * cellW - gap;
        return (
          <g>
            <rect x={x1 - 1} y={y} width={w + 2} height="24" rx="5"
              className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-400 dark:stroke-blue-700" strokeWidth="1" strokeDasharray="4 2" />
            <text x={x1 + 4} y={y + 16} className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="600" fontFamily="monospace">
              s[5:] = "ANGA"
            </text>
            <text x={x1 + w + 12} y={y + 16} className="fill-gray-500 dark:fill-gray-400" fontSize="9">
              5 to end
            </text>
          </g>
        );
      })()}

      {/* ── Example 3: s[::-1] reversed ── */}
      {(() => {
        const y = section3Y;
        const reversed = [...str].reverse();
        return (
          <g>
            {reversed.map((ch, i) => {
              const x = startX + i * cellW;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={boxW} height="24" rx="4"
                    className="fill-orange-50 dark:fill-orange-900/20 stroke-orange-400 dark:stroke-orange-700" strokeWidth="1" />
                  <text x={x + boxW / 2} y={y + 13} textAnchor="middle" dominantBaseline="central"
                    className="fill-orange-700 dark:fill-orange-300" fontSize="12" fontWeight="700" fontFamily="monospace">
                    {ch}
                  </text>
                </g>
              );
            })}
            <text x={startX} y={y + 38} className="fill-orange-600 dark:fill-orange-400" fontSize="10" fontWeight="600" fontFamily="monospace">
              s[::-1]
            </text>
            <text x={startX + 52} y={y + 38} className="fill-gray-500 dark:fill-gray-400" fontSize="9">
              step = -1 walks backwards through the entire string
            </text>
          </g>
        );
      })()}

      {/* ── Example 4: s[::2] every other ── */}
      {(() => {
        const y = section4Y;
        return (
          <g>
            {str.map((ch, i) => {
              const x = startX + i * cellW;
              const picked = i % 2 === 0;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={boxW} height="24" rx="4"
                    className={picked ? 'fill-purple-100 dark:fill-purple-900/30 stroke-purple-400 dark:stroke-purple-600' : 'fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600'}
                    strokeWidth="1" opacity={picked ? 1 : 0.35} />
                  <text x={x + boxW / 2} y={y + 13} textAnchor="middle" dominantBaseline="central"
                    className={picked ? 'fill-purple-700 dark:fill-purple-300' : 'fill-gray-400 dark:fill-gray-600'}
                    fontSize="12" fontWeight={picked ? '700' : '400'} fontFamily="monospace">
                    {ch}
                  </text>
                </g>
              );
            })}
            <text x={startX} y={y + 38} className="fill-purple-600 dark:fill-purple-400" fontSize="10" fontWeight="600" fontFamily="monospace">
              s[::2]
            </text>
            <text x={startX + 46} y={y + 38} className="fill-gray-500 dark:fill-gray-400" fontSize="9">
              step = 2 takes every second character: K, Z, R, N, A
            </text>
          </g>
        );
      })()}

      {/* Legend */}
      <text x={startX} y={legendY} className="fill-gray-500 dark:fill-gray-400" fontSize="9">
        s[start : stop : step]  —  start included, stop excluded
      </text>
    </svg>
  );
}
