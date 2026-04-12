'use client';
import { useState, useEffect, useRef } from 'react';

const SORTED_ARRAY = [2, 5, 8, 12, 16, 23, 38, 42, 55, 61, 70, 73, 84, 90, 95, 99];
const TARGETS = [5, 12, 23, 42, 55, 70, 90, 99];

interface Step {
  lo: number;
  hi: number;
  mid: number;
  result: 'found' | 'go-left' | 'go-right';
}

function computeSteps(arr: number[], target: number): Step[] {
  const steps: Step[] = [];
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) {
      steps.push({ lo, hi, mid, result: 'found' });
      break;
    } else if (arr[mid] < target) {
      steps.push({ lo, hi, mid, result: 'go-right' });
      lo = mid + 1;
    } else {
      steps.push({ lo, hi, mid, result: 'go-left' });
      hi = mid - 1;
    }
  }
  return steps;
}

export default function BinarySearchDiagram() {
  const arr = SORTED_ARRAY;
  const [target, setTarget] = useState(42);
  const [stepIdx, setStepIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = computeSteps(arr, target);
  const done = stepIdx >= 0 && stepIdx <= steps.length - 1 && steps[Math.min(stepIdx, steps.length - 1)].result === 'found';

  // Build set of eliminated indices up to current step
  const eliminated = new Set<number>();
  for (let s = 0; s <= Math.min(stepIdx, steps.length - 1); s++) {
    const step = steps[s];
    if (step.result === 'go-right') {
      for (let i = step.lo; i <= step.mid; i++) eliminated.add(i);
    } else if (step.result === 'go-left') {
      for (let i = step.mid; i <= step.hi; i++) eliminated.add(i);
    }
  }

  const currentStep = stepIdx >= 0 && stepIdx < steps.length ? steps[stepIdx] : null;

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStepIdx(prev => {
          const next = prev + 1;
          if (next >= steps.length) {
            setPlaying(false);
            return steps.length - 1;
          }
          return next;
        });
      }, 600);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, steps.length]);

  function reset() {
    setPlaying(false);
    setStepIdx(-1);
  }

  function nextStep() {
    if (!done && stepIdx < steps.length - 1) setStepIdx(prev => prev + 1);
  }

  // SVG layout
  const boxW = 24, boxH = 26, gap = 2, startX = 14, startY = 56;

  function boxFill(i: number): string {
    if (currentStep && currentStep.result === 'found' && i === currentStep.mid) return '#22c55e';
    if (currentStep && i === currentStep.mid) return '#f59e0b';
    if (eliminated.has(i)) return '#94a3b8';
    return '#3b82f6';
  }

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      {/* Controls */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Target:</label>
        <select
          value={target}
          onChange={e => { setTarget(Number(e.target.value)); reset(); }}
          className="text-xs px-2 py-0.5 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200"
        >
          {TARGETS.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button onClick={nextStep} disabled={done || playing} className="px-2 py-0.5 text-xs rounded font-medium bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700 transition-colors">Next Step</button>
        <button
          onClick={() => { if (stepIdx < 0) setStepIdx(0); setPlaying(!playing); }}
          disabled={done}
          className="px-2 py-0.5 text-xs rounded font-medium bg-amber-500 text-white disabled:opacity-40 hover:bg-amber-600 transition-colors"
        >
          {playing ? 'Pause' : 'Animate'}
        </button>
        <button onClick={reset} className="px-2 py-0.5 text-xs rounded font-medium bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-400 dark:hover:bg-slate-600 transition-colors">Reset</button>
      </div>

      <svg viewBox="0 0 460 170" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label={`Binary search visualization finding ${target} in a sorted array of ${arr.length} elements`}>
        <rect width="460" height="170" rx="8" className="fill-white dark:fill-slate-950" />

        {/* Title */}
        <text x="230" y="18" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">
          Finding {target} in a sorted list of {arr.length}
        </text>

        {/* lo/hi pointer labels above boxes */}
        {currentStep && !done && (
          <>
            <text x={startX + currentStep.lo * (boxW + gap) + boxW / 2} y={startY - 14} textAnchor="middle" fontSize="8" fontWeight="700" fill="#3b82f6">lo</text>
            <line x1={startX + currentStep.lo * (boxW + gap) + boxW / 2} y1={startY - 12} x2={startX + currentStep.lo * (boxW + gap) + boxW / 2} y2={startY - 2} stroke="#3b82f6" strokeWidth="1" markerEnd="" />
            <text x={startX + currentStep.hi * (boxW + gap) + boxW / 2} y={startY - 14} textAnchor="middle" fontSize="8" fontWeight="700" fill="#ef4444">hi</text>
            <line x1={startX + currentStep.hi * (boxW + gap) + boxW / 2} y1={startY - 12} x2={startX + currentStep.hi * (boxW + gap) + boxW / 2} y2={startY - 2} stroke="#ef4444" strokeWidth="1" />
          </>
        )}

        {/* Index labels */}
        {arr.map((_, i) => (
          <text key={`idx-${i}`} x={startX + i * (boxW + gap) + boxW / 2} y={startY - 4} textAnchor="middle" fontSize="7" className="fill-gray-400 dark:fill-slate-500">{i}</text>
        ))}

        {/* Array boxes */}
        {arr.map((val, i) => {
          const isElim = eliminated.has(i) && !(currentStep && i === currentStep.mid);
          return (
            <g key={i}>
              <rect
                x={startX + i * (boxW + gap)}
                y={startY}
                width={boxW}
                height={boxH}
                rx="3"
                fill={boxFill(i)}
                opacity={isElim ? 0.3 : 1}
              />
              <text
                x={startX + i * (boxW + gap) + boxW / 2}
                y={startY + boxH / 2 + 4}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill={isElim ? '#64748b' : '#ffffff'}
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Mid pointer below */}
        {currentStep && (
          <>
            <text x={startX + currentStep.mid * (boxW + gap) + boxW / 2} y={startY + boxH + 12} textAnchor="middle" fontSize="8" fontWeight="700" fill="#f59e0b">mid</text>
          </>
        )}

        {/* Step explanation */}
        {currentStep && (
          <text x="230" y={startY + boxH + 30} textAnchor="middle" fontSize="9" className="fill-gray-600 dark:fill-slate-400">
            {currentStep.result === 'found'
              ? `arr[${currentStep.mid}] = ${arr[currentStep.mid]} = ${target} -- Found!`
              : currentStep.result === 'go-right'
              ? `arr[${currentStep.mid}] = ${arr[currentStep.mid]} < ${target} -- search right half`
              : `arr[${currentStep.mid}] = ${arr[currentStep.mid]} > ${target} -- search left half`}
          </text>
        )}

        {/* Step counter */}
        <text x="230" y="155" textAnchor="middle" fontSize="9" fontWeight="600" className="fill-gray-500 dark:fill-slate-400">
          {stepIdx >= 0 ? `Steps taken: ${stepIdx + 1}` : 'Click "Next Step" or "Animate" to begin'}
          {done ? ` of ${arr.length} elements` : ''}
        </text>
      </svg>

      {/* Result */}
      {done && (
        <p className="mt-2 text-xs font-semibold text-green-600 dark:text-green-400 text-center">
          Found {target} in {stepIdx + 1} step{stepIdx > 0 ? 's' : ''} out of {arr.length} elements. Linear search would need up to {arr.length} steps.
        </p>
      )}

      <p className="mt-1 text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
        Binary search halves the remaining elements each step. For {arr.length} elements it needs at most {Math.ceil(Math.log2(arr.length))} comparisons instead of {arr.length}.
      </p>
    </div>
  );
}
