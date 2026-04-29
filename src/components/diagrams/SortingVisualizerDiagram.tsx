'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

type BarState = 'default' | 'comparing' | 'sorted';

interface Snapshot {
  array: number[];
  highlights: [number, BarState][];
}

function bubbleSortSnapshots(initial: number[]): Snapshot[] {
  const arr = [...initial];
  const snaps: Snapshot[] = [{ array: [...arr], highlights: [] }];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      snaps.push({ array: [...arr], highlights: [[j, 'comparing'], [j + 1, 'comparing']] });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        snaps.push({ array: [...arr], highlights: [[j, 'sorted'], [j + 1, 'sorted']] });
      }
    }
  }
  snaps.push({ array: [...arr], highlights: arr.map((_, i) => [i, 'sorted'] as [number, BarState]) });
  return snaps;
}

function mergeSortSnapshots(initial: number[]): Snapshot[] {
  const arr = [...initial];
  const snaps: Snapshot[] = [{ array: [...arr], highlights: [] }];

  function merge(lo: number, mid: number, hi: number) {
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      snaps.push({ array: [...arr], highlights: [[lo + i, 'comparing'], [mid + 1 + j, 'comparing']] });
      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }
      snaps.push({ array: [...arr], highlights: [[k - 1, 'sorted']] });
    }
    while (i < left.length) { arr[k++] = left[i++]; snaps.push({ array: [...arr], highlights: [[k - 1, 'sorted']] }); }
    while (j < right.length) { arr[k++] = right[j++]; snaps.push({ array: [...arr], highlights: [[k - 1, 'sorted']] }); }
  }

  function sort(lo: number, hi: number) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  sort(0, arr.length - 1);
  snaps.push({ array: [...arr], highlights: arr.map((_, i) => [i, 'sorted'] as [number, BarState]) });
  return snaps;
}

function randomArray(len: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) arr.push(Math.floor(Math.random() * 90) + 10);
  return arr;
}

const BAR_COLORS: Record<BarState, string> = {
  default: '#3b82f6',
  comparing: '#f59e0b',
  sorted: '#22c55e',
};

function BarChart({ snap, label, stepCount, maxVal, side }: { snap: Snapshot; label: string; stepCount: number; maxVal: number; side: 'left' | 'right' }) {
  const arr = snap.array;
  const hlMap = new Map(snap.highlights);
  const n = arr.length;
  const chartX = side === 'left' ? 10 : 240;
  const chartW = 210, chartH = 150, barGap = 2;
  const barW = (chartW - barGap * (n - 1)) / n;

  return (
    <g>
      <text x={chartX + chartW / 2} y="16" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">{label}</text>
      {arr.map((val, i) => {
        const state = hlMap.get(i) || 'default';
        const barH = (val / maxVal) * (chartH - 20);
        const x = chartX + i * (barW + barGap);
        const y = 30 + (chartH - 20) - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="2" fill={BAR_COLORS[state]} />
            <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize="7" fontWeight="600" className="fill-gray-500 dark:fill-slate-400">{val}</text>
          </g>
        );
      })}
      <text x={chartX + chartW / 2} y={chartH + 24} textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Steps: {stepCount}</text>
    </g>
  );
}

export default function SortingVisualizerDiagram() {
  const [initial, setInitial] = useState<number[]>(() => randomArray(9));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const bubbleSnaps = bubbleSortSnapshots(initial);
  const mergeSnaps = mergeSortSnapshots(initial);
  const totalSteps = Math.max(bubbleSnaps.length, mergeSnaps.length) - 1;

  const maxVal = Math.max(...initial) + 5;

  const bubbleIdx = Math.min(step, bubbleSnaps.length - 1);
  const mergeIdx = Math.min(step, mergeSnaps.length - 1);

  const bubbleDone = bubbleIdx >= bubbleSnaps.length - 1;
  const mergeDone = mergeIdx >= mergeSnaps.length - 1;
  const allDone = bubbleDone && mergeDone;

  const advance = useCallback(() => {
    setStep(prev => {
      const next = prev + 1;
      if (next > totalSteps) return totalSteps;
      return next;
    });
  }, [totalSteps]);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStep(prev => {
          if (prev >= totalSteps) {
            setPlaying(false);
            return totalSteps;
          }
          return prev + 1;
        });
      }, 200);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, totalSteps]);

  function resetNew() {
    setPlaying(false);
    setStep(0);
    setInitial(randomArray(9));
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <button onClick={advance} disabled={allDone || playing} className="px-2 py-0.5 text-xs rounded font-medium bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700 transition-colors">Step</button>
        <button onClick={() => setPlaying(!playing)} disabled={allDone} className="px-2 py-0.5 text-xs rounded font-medium bg-amber-500 text-white disabled:opacity-40 hover:bg-amber-600 transition-colors">{playing ? 'Pause' : 'Play'}</button>
        <button onClick={resetNew} className="px-2 py-0.5 text-xs rounded font-medium bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-400 dark:hover:bg-slate-600 transition-colors">New Array</button>
        <span className="text-xs text-gray-500 dark:text-slate-400 ml-auto">
          <span className="inline-block w-2 h-2 rounded-sm mr-0.5" style={{ background: '#f59e0b' }} /> comparing
          <span className="inline-block w-2 h-2 rounded-sm ml-2 mr-0.5" style={{ background: '#22c55e' }} /> placed
        </span>
      </div>

      <svg viewBox="0 0 460 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Side-by-side comparison of bubble sort and merge sort">
        <rect width="460" height="200" rx="8" className="fill-white dark:fill-slate-950" />
        {/* Divider */}
        <line x1="230" y1="10" x2="230" y2="190" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,3" className="dark:stroke-slate-700" />

        <BarChart snap={bubbleSnaps[bubbleIdx]} label="Bubble Sort" stepCount={bubbleIdx} maxVal={maxVal} side="left" />
        <BarChart snap={mergeSnaps[mergeIdx]} label="Merge Sort" stepCount={mergeIdx} maxVal={maxVal} side="right" />
      </svg>

      {allDone && (
        <p className="mt-2 text-xs font-semibold text-center text-gray-700 dark:text-slate-300">
          Bubble sort: {bubbleSnaps.length - 1} steps. Merge sort: {mergeSnaps.length - 1} steps.
          {bubbleSnaps.length > mergeSnaps.length && (
            <span className="text-green-600 dark:text-green-400"> Merge sort wins by {bubbleSnaps.length - mergeSnaps.length} steps!</span>
          )}
        </p>
      )}

      <p className="mt-1 text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
        Bubble sort compares adjacent elements repeatedly (O(n squared)). Merge sort divides the array, sorts halves, and merges (O(n log n)). The difference grows dramatically with larger inputs.
      </p>
    </div>
  );
}
