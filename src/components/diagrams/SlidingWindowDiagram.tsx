import { useState, useEffect } from 'react';

/**
 * Animated sliding window diagram.
 * Shows a window sliding across a list computing a moving average.
 */
export default function SlidingWindowDiagram() {
  const data = [10, 20, 30, 40, 50, 60, 70];
  const windowSize = 3;
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const maxPos = data.length - windowSize;

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setPos(p => {
        if (p >= maxPos) { setPlaying(false); return maxPos; }
        return p + 1;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [playing, maxPos]);

  const windowSum = data.slice(pos, pos + windowSize).reduce((a, b) => a + b, 0);
  const windowAvg = (windowSum / windowSize).toFixed(1);

  // What left and what entered
  const leaving = pos > 0 ? data[pos - 1] : null;
  const entering = pos > 0 ? data[pos + windowSize - 1] : null;

  const boxW = 48;
  const boxH = 40;
  const gap = 4;
  const startX = 30;
  const topY = 52;
  const cellW = boxW + gap;
  const totalW = startX + data.length * cellW + 30;

  return (
    <svg viewBox={`0 0 ${totalW} 210`} className="w-full max-w-xl mx-auto" role="img" aria-label="Sliding window computing moving average">
      {/* Title */}
      <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
        Sliding Window: Moving Average (window={windowSize})
      </text>
      <text x={totalW / 2} y="34" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
        Slide the window — subtract what leaves, add what enters
      </text>

      {/* Data boxes */}
      {data.map((val, i) => {
        const x = startX + i * cellW;
        const inWindow = i >= pos && i < pos + windowSize;
        const wasRemoved = pos > 0 && i === pos - 1;

        return (
          <g key={i}>
            <rect x={x} y={topY} width={boxW} height={boxH} rx="6"
              className={
                inWindow ? 'fill-purple-200 dark:fill-purple-800/50 stroke-purple-500 dark:stroke-purple-400' :
                wasRemoved ? 'fill-red-50 dark:fill-red-900/20 stroke-red-300 dark:stroke-red-700' :
                'fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600'
              }
              strokeWidth={inWindow ? 2.5 : 1.5}
              opacity={!inWindow && !wasRemoved ? 0.5 : 1} />
            <text x={x + boxW / 2} y={topY + boxH / 2 + 1} textAnchor="middle" dominantBaseline="central"
              className={inWindow ? 'fill-purple-800 dark:fill-purple-200' : 'fill-gray-500 dark:fill-gray-400'}
              fontSize="14" fontWeight={inWindow ? '700' : '500'} fontFamily="monospace">
              {val}
            </text>
          </g>
        );
      })}

      {/* Window bracket */}
      {(() => {
        const x1 = startX + pos * cellW - 3;
        const x2 = startX + (pos + windowSize) * cellW - gap + 3;
        const y = topY - 4;
        return (
          <rect x={x1} y={y} width={x2 - x1} height={boxH + 8} rx="8"
            fill="none" className="stroke-purple-400 dark:stroke-purple-500" strokeWidth="2" strokeDasharray="6 3" />
        );
      })()}

      {/* Sum and average display */}
      <g transform={`translate(${totalW / 2}, ${topY + boxH + 20})`}>
        <text textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="12" fontWeight="700">
          Window sum = {windowSum}  |  Average = {windowAvg}
        </text>
      </g>

      {/* Slide explanation */}
      {pos > 0 && (
        <g transform={`translate(${totalW / 2}, ${topY + boxH + 40})`}>
          <text textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">
            <tspan className="fill-red-500">−{leaving}</tspan> (left the window)  +  <tspan className="fill-emerald-500">+{entering}</tspan> (entered the window)
          </text>
        </g>
      )}

      {pos === 0 && (
        <g transform={`translate(${totalW / 2}, ${topY + boxH + 40})`}>
          <text textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
            Initial window: sum first {windowSize} values
          </text>
        </g>
      )}

      {/* Results so far */}
      <g transform={`translate(${startX}, ${topY + boxH + 58})`}>
        <text className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontWeight="600">
          Results: [{Array.from({ length: pos + 1 }, (_, i) => {
            const s = data.slice(i, i + windowSize).reduce((a, b) => a + b, 0);
            return (s / windowSize).toFixed(1);
          }).join(', ')}]
        </text>
      </g>

      {/* Controls */}
      <g transform={`translate(${totalW / 2 - 60}, 180)`}>
        <rect x="0" y="0" width="50" height="22" rx="4"
              className="fill-gray-200 dark:fill-gray-700 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1"
              onClick={() => { setPos(0); setPlaying(false); }} style={{ cursor: 'pointer' }} />
        <text x="25" y="15" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300 pointer-events-none" fontSize="10" fontWeight="600">
          Reset
        </text>
        <rect x="58" y="0" width="62" height="22" rx="4"
              className="fill-purple-100 dark:fill-purple-900/40 stroke-purple-400 dark:stroke-purple-600" strokeWidth="1"
              onClick={() => { if (pos >= maxPos) setPos(0); setPlaying(!playing); }} style={{ cursor: 'pointer' }} />
        <text x="89" y="15" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300 pointer-events-none" fontSize="10" fontWeight="600">
          {playing ? '⏸ Pause' : '▶ Play'}
        </text>
      </g>
    </svg>
  );
}
