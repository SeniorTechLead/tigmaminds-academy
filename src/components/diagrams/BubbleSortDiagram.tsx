import { useState, useEffect } from 'react';

/**
 * Animated bubble sort diagram.
 * Shows elements swapping step by step.
 */
export default function BubbleSortDiagram() {
  const initial = [64, 34, 25, 12, 22, 11, 90];
  const [arr, setArr] = useState([...initial]);
  const [comparing, setComparing] = useState<[number, number] | null>(null);
  const [sorted, setSorted] = useState<Set<number>>(new Set());
  const [playing, setPlaying] = useState(false);
  const [stepQueue, setStepQueue] = useState<{ arr: number[]; comparing: [number, number] | null; sorted: Set<number> }[]>([]);
  const [stepIdx, setStepIdx] = useState(0);

  // Pre-compute all steps
  useEffect(() => {
    const steps: typeof stepQueue = [];
    const a = [...initial];
    const s = new Set<number>();

    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a.length - 1 - i; j++) {
        steps.push({ arr: [...a], comparing: [j, j + 1], sorted: new Set(s) });
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          steps.push({ arr: [...a], comparing: [j, j + 1], sorted: new Set(s) });
        }
      }
      s.add(a.length - 1 - i);
    }
    steps.push({ arr: [...a], comparing: null, sorted: new Set(Array.from({ length: a.length }, (_, i) => i)) });
    setStepQueue(steps);
  }, []);

  useEffect(() => {
    if (!playing || stepQueue.length === 0) return;
    const timer = setInterval(() => {
      setStepIdx(i => {
        if (i >= stepQueue.length - 1) { setPlaying(false); return stepQueue.length - 1; }
        return i + 1;
      });
    }, 400);
    return () => clearInterval(timer);
  }, [playing, stepQueue]);

  useEffect(() => {
    if (stepQueue[stepIdx]) {
      setArr(stepQueue[stepIdx].arr);
      setComparing(stepQueue[stepIdx].comparing);
      setSorted(stepQueue[stepIdx].sorted);
    }
  }, [stepIdx, stepQueue]);

  const boxW = 44;
  const startX = 30;
  const topY = 50;
  const maxVal = Math.max(...initial);
  const barMaxH = 90;
  const gap = 6;
  const totalW = startX + arr.length * (boxW + gap) + 30;

  return (
    <svg viewBox={`0 0 ${totalW} 210`} className="w-full max-w-xl mx-auto" role="img" aria-label="Bubble sort animation">
      {/* Title */}
      <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
        Bubble Sort — Swap Adjacent Pairs
      </text>
      <text x={totalW / 2} y="34" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
        Largest values "bubble up" to the right
      </text>

      {/* Bars */}
      {arr.map((val, i) => {
        const x = startX + i * (boxW + gap);
        const barH = (val / maxVal) * barMaxH;
        const y = topY + barMaxH - barH;
        const isComparing = comparing && (i === comparing[0] || i === comparing[1]);
        const isSorted = sorted.has(i);

        return (
          <g key={i}>
            <rect x={x} y={y} width={boxW} height={barH} rx="4"
              className={
                isSorted ? 'fill-emerald-400 dark:fill-emerald-600 stroke-emerald-600 dark:stroke-emerald-400' :
                isComparing ? 'fill-amber-300 dark:fill-amber-700 stroke-amber-500 dark:stroke-amber-400' :
                'fill-blue-200 dark:fill-blue-800 stroke-blue-400 dark:stroke-blue-600'
              }
              strokeWidth={isComparing ? 2 : 1} />
            <text x={x + boxW / 2} y={topY + barMaxH + 16} textAnchor="middle"
              className={isSorted ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-gray-700 dark:fill-gray-300'}
              fontSize="12" fontWeight="700" fontFamily="monospace">
              {val}
            </text>
          </g>
        );
      })}

      {/* Comparison arrows */}
      {comparing && (
        <g>
          <line
            x1={startX + comparing[0] * (boxW + gap) + boxW / 2}
            y1={topY + barMaxH + 26}
            x2={startX + comparing[1] * (boxW + gap) + boxW / 2}
            y2={topY + barMaxH + 26}
            className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" />
          <text x={startX + (comparing[0] + 0.5) * (boxW + gap) + boxW / 2} y={topY + barMaxH + 40}
                textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="9" fontWeight="600">
            {arr[comparing[0]] > arr[comparing[1]] ? 'swap!' : 'ok'}
          </text>
        </g>
      )}

      {/* Controls */}
      <g transform={`translate(${totalW / 2 - 60}, 180)`}>
        <rect x="0" y="0" width="50" height="22" rx="4"
              className="fill-gray-200 dark:fill-gray-700 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1"
              onClick={() => { setStepIdx(0); setPlaying(false); }} style={{ cursor: 'pointer' }} />
        <text x="25" y="15" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300 pointer-events-none" fontSize="10" fontWeight="600">
          Reset
        </text>
        <rect x="58" y="0" width="62" height="22" rx="4"
              className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-400 dark:stroke-amber-600" strokeWidth="1"
              onClick={() => { if (stepIdx >= stepQueue.length - 1) setStepIdx(0); setPlaying(!playing); }} style={{ cursor: 'pointer' }} />
        <text x="89" y="15" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300 pointer-events-none" fontSize="10" fontWeight="600">
          {playing ? '⏸ Pause' : '▶ Sort'}
        </text>
      </g>
    </svg>
  );
}
