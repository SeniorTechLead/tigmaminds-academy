import { useState, useEffect } from 'react';

/**
 * Animated binary search diagram.
 * Shows the search space halving each step.
 */
export default function BinarySearchDiagram() {
  const data = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  const target = 23;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Pre-compute search steps
  const steps: { left: number; right: number; mid: number; found: boolean }[] = [];
  {
    let l = 0, r = data.length - 1;
    while (l <= r) {
      const m = Math.floor((l + r) / 2);
      steps.push({ left: l, right: r, mid: m, found: data[m] === target });
      if (data[m] === target) break;
      if (data[m] < target) l = m + 1;
      else r = m - 1;
    }
  }

  const maxSteps = steps.length - 1;

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStep(s => {
        if (s >= maxSteps) { setPlaying(false); return maxSteps; }
        return s + 1;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, [playing, maxSteps]);

  const current = steps[Math.min(step, maxSteps)];

  const boxW = 40;
  const boxH = 36;
  const gap = 3;
  const startX = 30;
  const topY = 56;
  const cellW = boxW + gap;
  const totalW = startX + data.length * cellW + 30;

  return (
    <svg viewBox={`0 0 ${totalW} 210`} className="w-full max-w-xl mx-auto" role="img" aria-label="Binary search animation finding 23 in a sorted list">
      {/* Title */}
      <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
        Binary Search: Find {target}
      </text>
      <text x={totalW / 2} y="34" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
        Halve the search space each step — O(log n)
      </text>

      {/* Data boxes */}
      {data.map((val, i) => {
        const x = startX + i * cellW;
        const inRange = i >= current.left && i <= current.right;
        const isMid = i === current.mid;
        const isFound = isMid && current.found;
        const eliminated = !inRange;

        return (
          <g key={i}>
            <rect x={x} y={topY} width={boxW} height={boxH} rx="5"
              className={
                isFound ? 'fill-emerald-200 dark:fill-emerald-800/60 stroke-emerald-500 dark:stroke-emerald-400' :
                isMid ? 'fill-amber-200 dark:fill-amber-800/60 stroke-amber-500 dark:stroke-amber-400' :
                eliminated ? 'fill-gray-100 dark:fill-gray-800/40 stroke-gray-200 dark:stroke-gray-700' :
                'fill-blue-50 dark:fill-blue-900/30 stroke-blue-300 dark:stroke-blue-700'
              }
              strokeWidth={isMid ? 2.5 : 1.5}
              opacity={eliminated ? 0.35 : 1} />
            <text x={x + boxW / 2} y={topY + boxH / 2 + 1} textAnchor="middle" dominantBaseline="central"
              className={eliminated ? 'fill-gray-400 dark:fill-gray-600' : 'fill-gray-900 dark:fill-white'}
              fontSize="13" fontWeight={isMid ? '800' : '600'} fontFamily="monospace"
              opacity={eliminated ? 0.4 : 1}>
              {val}
            </text>
            {/* Index below */}
            <text x={x + boxW / 2} y={topY + boxH + 12} textAnchor="middle"
              className="fill-gray-400 dark:fill-gray-600" fontSize="8" fontFamily="monospace"
              opacity={eliminated ? 0.3 : 0.7}>
              [{i}]
            </text>
          </g>
        );
      })}

      {/* Pointer labels */}
      {!current.found && (
        <>
          {/* Left bracket */}
          <text x={startX + current.left * cellW + boxW / 2} y={topY - 8} textAnchor="middle"
                className="fill-blue-600 dark:fill-blue-400" fontSize="9" fontWeight="700">
            L
          </text>
          {/* Right bracket */}
          <text x={startX + current.right * cellW + boxW / 2} y={topY - 8} textAnchor="middle"
                className="fill-blue-600 dark:fill-blue-400" fontSize="9" fontWeight="700">
            R
          </text>
          {/* Mid pointer */}
          <text x={startX + current.mid * cellW + boxW / 2} y={topY - 8} textAnchor="middle"
                className="fill-amber-600 dark:fill-amber-400" fontSize="9" fontWeight="700">
            mid
          </text>
        </>
      )}

      {/* Explanation */}
      <g transform={`translate(${totalW / 2}, ${topY + boxH + 30})`}>
        {current.found ? (
          <text textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="12" fontWeight="700">
            ✓ Found {target} at index {current.mid}!
          </text>
        ) : (
          <>
            <text textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="11" fontWeight="600">
              Step {step + 1}: mid=[{current.mid}]={data[current.mid]} {data[current.mid] < target ? '< ' + target + ' → search RIGHT half' : '> ' + target + ' → search LEFT half'}
            </text>
            <text y="16" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
              Search space: [{current.left}..{current.right}] = {current.right - current.left + 1} elements
            </text>
          </>
        )}
      </g>

      {/* Step counter */}
      <text x={totalW / 2} y={topY + boxH + 72} textAnchor="middle"
            className="fill-gray-400 dark:fill-gray-500" fontSize="9">
        {step + 1} of {steps.length} steps to find {target} in {data.length} items (log₂{data.length} ≈ {Math.ceil(Math.log2(data.length))})
      </text>

      {/* Controls */}
      <g transform={`translate(${totalW / 2 - 60}, 180)`}>
        <rect x="0" y="0" width="50" height="22" rx="4"
              className="fill-gray-200 dark:fill-gray-700 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1"
              onClick={() => { setStep(0); setPlaying(false); }} style={{ cursor: 'pointer' }} />
        <text x="25" y="15" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300 pointer-events-none" fontSize="10" fontWeight="600">
          Reset
        </text>
        <rect x="58" y="0" width="62" height="22" rx="4"
              className="fill-blue-100 dark:fill-blue-900/40 stroke-blue-400 dark:stroke-blue-600" strokeWidth="1"
              onClick={() => { if (step >= maxSteps) setStep(0); setPlaying(!playing); }} style={{ cursor: 'pointer' }} />
        <text x="89" y="15" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300 pointer-events-none" fontSize="10" fontWeight="600">
          {playing ? '⏸ Pause' : '▶ Play'}
        </text>
      </g>
    </svg>
  );
}
