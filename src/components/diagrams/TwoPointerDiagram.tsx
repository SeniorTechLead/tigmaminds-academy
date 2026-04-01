import { useState, useEffect } from 'react';

/**
 * Animated two-pointer technique diagram.
 * Shows two pointers moving inward on a palindrome check.
 */
export default function TwoPointerDiagram() {
  const word = 'RACECAR'.split('');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const maxSteps = 3; // 3 comparison steps for 7-char palindrome

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStep(s => {
        if (s >= maxSteps) { setPlaying(false); return maxSteps; }
        return s + 1;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [playing]);

  const boxW = 44;
  const boxH = 40;
  const gap = 4;
  const startX = 60;
  const topY = 50;
  const cellW = boxW + gap;
  const totalW = startX + word.length * cellW + 60;

  const left = step;
  const right = word.length - 1 - step;
  const matched = left >= right; // all matched

  return (
    <svg viewBox={`0 0 ${totalW} 200`} className="w-full max-w-xl mx-auto" role="img" aria-label="Two-pointer technique checking if RACECAR is a palindrome">
      {/* Title */}
      <text x={totalW / 2} y="20" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
        Two-Pointer: Palindrome Check
      </text>
      <text x={totalW / 2} y="36" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
        Compare from both ends, moving inward
      </text>

      {/* Character boxes */}
      {word.map((ch, i) => {
        const x = startX + i * cellW;
        const isLeft = i === left && !matched;
        const isRight = i === right && !matched;
        const isChecked = i < left || i > right;
        const isActive = isLeft || isRight;

        return (
          <g key={i}>
            <rect x={x} y={topY} width={boxW} height={boxH} rx="6"
              className={
                isActive ? 'fill-amber-200 dark:fill-amber-800/60 stroke-amber-500 dark:stroke-amber-400' :
                isChecked ? 'fill-emerald-100 dark:fill-emerald-900/40 stroke-emerald-400 dark:stroke-emerald-600' :
                'fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600'
              }
              strokeWidth={isActive ? 2.5 : 1.5} />
            <text x={x + boxW / 2} y={topY + boxH / 2 + 1} textAnchor="middle" dominantBaseline="central"
              className={isChecked ? 'fill-emerald-700 dark:fill-emerald-300' : 'fill-gray-900 dark:fill-white'}
              fontSize="16" fontWeight="700" fontFamily="monospace">
              {ch}
            </text>
            {/* Check mark for matched pairs */}
            {isChecked && (
              <text x={x + boxW / 2} y={topY - 6} textAnchor="middle" className="fill-emerald-500" fontSize="12">
                ✓
              </text>
            )}
          </g>
        );
      })}

      {/* Left pointer arrow */}
      {!matched && (
        <g>
          <line x1={startX + left * cellW + boxW / 2} y1={topY + boxH + 6}
                x2={startX + left * cellW + boxW / 2} y2={topY + boxH + 20}
                className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" markerEnd="url(#arrowUp)" />
          <text x={startX + left * cellW + boxW / 2} y={topY + boxH + 34} textAnchor="middle"
                className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="700">
            left={left}
          </text>
        </g>
      )}

      {/* Right pointer arrow */}
      {!matched && (
        <g>
          <line x1={startX + right * cellW + boxW / 2} y1={topY + boxH + 6}
                x2={startX + right * cellW + boxW / 2} y2={topY + boxH + 20}
                className="stroke-orange-500 dark:stroke-orange-400" strokeWidth="2" />
          <text x={startX + right * cellW + boxW / 2} y={topY + boxH + 34} textAnchor="middle"
                className="fill-orange-600 dark:fill-orange-400" fontSize="10" fontWeight="700">
            right={right}
          </text>
        </g>
      )}

      {/* Comparison annotation */}
      {!matched && left < right && (
        <text x={totalW / 2} y={topY + boxH + 52} textAnchor="middle"
              className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">
          Compare: '{word[left]}' == '{word[right]}' → ✓ Match! Move inward.
        </text>
      )}

      {matched && (
        <text x={totalW / 2} y={topY + boxH + 40} textAnchor="middle"
              className="fill-emerald-600 dark:fill-emerald-400" fontSize="12" fontWeight="700">
          ✓ All pairs matched — RACECAR is a palindrome!
        </text>
      )}

      {/* Controls */}
      <g transform={`translate(${totalW / 2 - 60}, 170)`}>
        <rect x="0" y="0" width="50" height="22" rx="4"
              className="fill-gray-200 dark:fill-gray-700 stroke-gray-300 dark:stroke-gray-600 cursor-pointer" strokeWidth="1"
              onClick={() => { setStep(0); setPlaying(false); }} style={{ cursor: 'pointer' }} />
        <text x="25" y="15" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300 pointer-events-none" fontSize="10" fontWeight="600">
          Reset
        </text>
        <rect x="58" y="0" width="62" height="22" rx="4"
              className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-400 dark:stroke-amber-600 cursor-pointer" strokeWidth="1"
              onClick={() => { if (step >= maxSteps) setStep(0); setPlaying(!playing); }} style={{ cursor: 'pointer' }} />
        <text x="89" y="15" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300 pointer-events-none" fontSize="10" fontWeight="600">
          {playing ? '⏸ Pause' : '▶ Play'}
        </text>
      </g>

      <defs>
        <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto">
          <path d="M0,6 L3,0 L6,6" className="fill-blue-500" />
        </marker>
      </defs>
    </svg>
  );
}
