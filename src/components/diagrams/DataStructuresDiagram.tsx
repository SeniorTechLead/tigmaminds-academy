'use client';
import { useState, useEffect, useRef } from 'react';

type DS = 'array' | 'stack' | 'queue' | 'hashmap';
type Op = 'insert' | 'delete' | 'find';

interface AnimState {
  op: Op;
  frame: number;
  totalFrames: number;
}

const DS_INFO: Record<DS, { name: string; desc: string; ops: Record<Op, string> }> = {
  array: {
    name: 'Array',
    desc: 'Use an array when you need fast access by index. Example: leaderboard scores, pixel data.',
    ops: { insert: 'O(n)', delete: 'O(n)', find: 'O(n)' },
  },
  stack: {
    name: 'Stack',
    desc: 'Use a stack when you need last-in-first-out. Example: undo history, backtracking, function calls.',
    ops: { insert: 'O(1)', delete: 'O(1)', find: 'O(n)' },
  },
  queue: {
    name: 'Queue',
    desc: 'Use a queue when you need first-in-first-out. Example: print jobs, message queues, BFS.',
    ops: { insert: 'O(1)', delete: 'O(1)', find: 'O(n)' },
  },
  hashmap: {
    name: 'Hash Map',
    desc: 'Use a hash map when you need fast key lookup. Example: dictionaries, caches, counting occurrences.',
    ops: { insert: 'O(1) avg', delete: 'O(1) avg', find: 'O(1) avg' },
  },
};

const OP_LABELS: Record<Op, string> = { insert: 'Insert', delete: 'Delete', find: 'Find' };

function ArrayVis({ items, anim }: { items: string[]; anim: AnimState | null }) {
  const boxW = 36, boxH = 28, gap = 3, startX = 10, startY = 30;
  const progress = anim ? anim.frame / anim.totalFrames : 0;

  return (
    <g>
      <text x="10" y="20" fontSize="9" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Array (numbered boxes)</text>
      {items.map((val, i) => {
        let dx = 0;
        let opacity = 1;
        // Insert animation: last item slides in, others shift right
        if (anim?.op === 'insert' && i === items.length - 1) {
          opacity = progress;
        }
        // Delete animation: first item fades, rest shift left
        if (anim?.op === 'delete' && i === 0) {
          opacity = 1 - progress;
          dx = -progress * (boxW + gap);
        } else if (anim?.op === 'delete' && i > 0) {
          dx = -progress * (boxW + gap);
        }
        // Find: highlight scanning
        const scanning = anim?.op === 'find' && i <= Math.floor(progress * items.length);
        return (
          <g key={i} transform={`translate(${dx}, 0)`}>
            <rect x={startX + i * (boxW + gap)} y={startY} width={boxW} height={boxH} rx="3"
              fill={scanning ? '#f59e0b' : '#3b82f6'} opacity={opacity} />
            <text x={startX + i * (boxW + gap) + boxW / 2} y={startY + boxH / 2 + 4} textAnchor="middle"
              fontSize="9" fontWeight="600" fill="#fff" opacity={opacity}>{val}</text>
            <text x={startX + i * (boxW + gap) + boxW / 2} y={startY + boxH + 10} textAnchor="middle"
              fontSize="7" className="fill-gray-400 dark:fill-slate-500">{i}</text>
          </g>
        );
      })}
      {anim?.op === 'insert' && (
        <text x={startX + (items.length - 1) * (boxW + gap) + boxW / 2} y={startY - 6} textAnchor="middle" fontSize="7" fill="#22c55e" fontWeight="600" opacity={1 - progress}>shift right</text>
      )}
    </g>
  );
}

function StackVis({ items, anim }: { items: string[]; anim: AnimState | null }) {
  const boxW = 52, boxH = 20, startX = 80, startY = 12;
  const progress = anim ? anim.frame / anim.totalFrames : 0;

  return (
    <g>
      <text x="10" y="20" fontSize="9" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Stack (pile of plates)</text>
      <text x={startX + boxW + 8} y={startY + 6} fontSize="7" className="fill-gray-400 dark:fill-slate-500">top</text>
      {items.map((val, i) => {
        const idx = items.length - 1 - i;
        let dy = 0, opacity = 1;
        if (anim?.op === 'insert' && i === 0) {
          dy = -20 * (1 - progress);
          opacity = progress;
        }
        if (anim?.op === 'delete' && i === 0) {
          dy = -20 * progress;
          opacity = 1 - progress;
        }
        return (
          <g key={idx} transform={`translate(0, ${dy})`}>
            <rect x={startX} y={startY + i * (boxH + 3)} width={boxW} height={boxH} rx="3"
              fill={i === 0 ? '#22c55e' : '#6366f1'} opacity={opacity} />
            <text x={startX + boxW / 2} y={startY + i * (boxH + 3) + boxH / 2 + 3} textAnchor="middle"
              fontSize="9" fontWeight="600" fill="#fff" opacity={opacity}>{val}</text>
          </g>
        );
      })}
    </g>
  );
}

function QueueVis({ items, anim }: { items: string[]; anim: AnimState | null }) {
  const boxW = 36, boxH = 28, gap = 3, startX = 10, startY = 35;
  const progress = anim ? anim.frame / anim.totalFrames : 0;

  return (
    <g>
      <text x="10" y="18" fontSize="9" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Queue (line of people)</text>
      <text x={startX} y={startY - 4} fontSize="7" className="fill-gray-400 dark:fill-slate-500">front</text>
      <text x={startX + (items.length - 1) * (boxW + gap) + boxW} y={startY - 4} textAnchor="end" fontSize="7" className="fill-gray-400 dark:fill-slate-500">back</text>
      {items.map((val, i) => {
        let dx = 0, opacity = 1;
        if (anim?.op === 'delete' && i === 0) {
          dx = -40 * progress;
          opacity = 1 - progress;
        }
        if (anim?.op === 'insert' && i === items.length - 1) {
          dx = 40 * (1 - progress);
          opacity = progress;
        }
        return (
          <g key={i} transform={`translate(${dx}, 0)`}>
            <rect x={startX + i * (boxW + gap)} y={startY} width={boxW} height={boxH} rx="3"
              fill={i === 0 ? '#ef4444' : i === items.length - 1 ? '#22c55e' : '#8b5cf6'} opacity={opacity} />
            <text x={startX + i * (boxW + gap) + boxW / 2} y={startY + boxH / 2 + 4} textAnchor="middle"
              fontSize="9" fontWeight="600" fill="#fff" opacity={opacity}>{val}</text>
          </g>
        );
      })}
    </g>
  );
}

function HashMapVis({ items, anim }: { items: [string, string][]; anim: AnimState | null }) {
  const startX = 10, startY = 26, rowH = 18;
  const progress = anim ? anim.frame / anim.totalFrames : 0;

  return (
    <g>
      <text x="10" y="16" fontSize="9" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Hash Map (key -&gt; value)</text>
      {/* Hash function box */}
      <rect x="120" y={startY - 2} width="50" height="16" rx="3" fill="#f59e0b" opacity="0.3" />
      <text x="145" y={startY + 10} textAnchor="middle" fontSize="7" fill="#f59e0b" fontWeight="600">hash(key)</text>
      {items.map(([key, val], i) => {
        const y = startY + 20 + i * rowH;
        const highlight = anim?.op === 'find' && i <= Math.floor(progress * items.length);
        const insertHighlight = anim?.op === 'insert' && i === items.length - 1;
        return (
          <g key={i}>
            {/* Key */}
            <rect x={startX} y={y} width="44" height="14" rx="2" fill={highlight || insertHighlight ? '#f59e0b' : '#6366f1'} />
            <text x={startX + 22} y={y + 10} textAnchor="middle" fontSize="7" fontWeight="600" fill="#fff">{key}</text>
            {/* Arrow */}
            <line x1={startX + 46} y1={y + 7} x2={startX + 56} y2={y + 7} stroke="#94a3b8" strokeWidth="1" markerEnd="" />
            <text x={startX + 54} y={y + 10} fontSize="8" className="fill-gray-400 dark:fill-slate-500">&rarr;</text>
            {/* Value */}
            <rect x={startX + 62} y={y} width="44" height="14" rx="2" fill={highlight || insertHighlight ? '#22c55e' : '#3b82f6'} />
            <text x={startX + 84} y={y + 10} textAnchor="middle" fontSize="7" fontWeight="600" fill="#fff">{val}</text>
            {/* Bucket index */}
            <text x={startX + 112} y={y + 10} fontSize="7" className="fill-gray-400 dark:fill-slate-500">[{i}]</text>
          </g>
        );
      })}
    </g>
  );
}

export default function DataStructuresDiagram() {
  const [selected, setSelected] = useState<DS>('array');
  const [anim, setAnim] = useState<AnimState | null>(null);
  const [arrayItems, setArrayItems] = useState(['A', 'B', 'C', 'D', 'E']);
  const [stackItems, setStackItems] = useState(['E', 'D', 'C', 'B', 'A']);
  const [queueItems, setQueueItems] = useState(['A', 'B', 'C', 'D', 'E']);
  const [hashItems, setHashItems] = useState<[string, string][]>([['name', 'Ada'], ['age', '36'], ['city', 'London'], ['job', 'Math']]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextChar = useRef('F');

  function getNext() {
    const c = nextChar.current;
    nextChar.current = String.fromCharCode(c.charCodeAt(0) + 1);
    if (nextChar.current > 'Z') nextChar.current = 'A';
    return c;
  }

  function runAnim(op: Op) {
    if (anim) return;
    const totalFrames = 12;
    let frame = 0;

    // Pre-compute end state
    const newChar = getNext();

    setAnim({ op, frame: 0, totalFrames });

    timerRef.current = setInterval(() => {
      frame++;
      if (frame > totalFrames) {
        if (timerRef.current) clearInterval(timerRef.current);
        setAnim(null);
        // Apply final state
        if (selected === 'array') {
          if (op === 'insert') setArrayItems(prev => [...prev, newChar]);
          if (op === 'delete') setArrayItems(prev => prev.length > 1 ? prev.slice(1) : prev);
        } else if (selected === 'stack') {
          if (op === 'insert') setStackItems(prev => [newChar, ...prev]);
          if (op === 'delete') setStackItems(prev => prev.length > 1 ? prev.slice(1) : prev);
        } else if (selected === 'queue') {
          if (op === 'insert') setQueueItems(prev => [...prev, newChar]);
          if (op === 'delete') setQueueItems(prev => prev.length > 1 ? prev.slice(1) : prev);
        } else if (selected === 'hashmap') {
          if (op === 'insert') setHashItems(prev => [...prev, [newChar.toLowerCase(), newChar]]);
          if (op === 'delete') setHashItems(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
        }
      } else {
        setAnim({ op, frame, totalFrames });
      }
    }, 50);

    // For insert, pre-add the item for animation
    if (op === 'insert') {
      if (selected === 'array') setArrayItems(prev => [...prev, newChar]);
      else if (selected === 'stack') setStackItems(prev => [newChar, ...prev]);
      else if (selected === 'queue') setQueueItems(prev => [...prev, newChar]);
      else if (selected === 'hashmap') setHashItems(prev => [...prev, [newChar.toLowerCase(), newChar]]);
    }
  }

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function resetDS() {
    if (timerRef.current) clearInterval(timerRef.current);
    setAnim(null);
    nextChar.current = 'F';
    setArrayItems(['A', 'B', 'C', 'D', 'E']);
    setStackItems(['E', 'D', 'C', 'B', 'A']);
    setQueueItems(['A', 'B', 'C', 'D', 'E']);
    setHashItems([['name', 'Ada'], ['age', '36'], ['city', 'London'], ['job', 'Math']]);
  }

  const info = DS_INFO[selected];

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* DS selector */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        {(['array', 'stack', 'queue', 'hashmap'] as DS[]).map(ds => (
          <button
            key={ds}
            onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setAnim(null); setSelected(ds); }}
            className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
              selected === ds
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
            }`}
          >
            {DS_INFO[ds].name}
          </button>
        ))}
        <span className="mx-1 text-gray-300 dark:text-slate-600">|</span>
        {(['insert', 'delete', 'find'] as Op[]).map(op => (
          <button
            key={op}
            onClick={() => runAnim(op)}
            disabled={!!anim}
            className="px-2 py-0.5 text-xs rounded font-medium bg-emerald-600 text-white disabled:opacity-40 hover:bg-emerald-700 transition-colors"
          >
            {OP_LABELS[op]}
          </button>
        ))}
        <button onClick={resetDS} className="px-2 py-0.5 text-xs rounded font-medium bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-400 dark:hover:bg-slate-600 transition-colors ml-auto">Reset</button>
      </div>

      <svg viewBox="0 0 460 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label={`${info.name} data structure visualization`}>
        <rect width="460" height="160" rx="8" className="fill-white dark:fill-slate-950" />

        <g transform="translate(20, 10)">
          {selected === 'array' && <ArrayVis items={arrayItems} anim={anim} />}
          {selected === 'stack' && <StackVis items={stackItems} anim={anim} />}
          {selected === 'queue' && <QueueVis items={queueItems} anim={anim} />}
          {selected === 'hashmap' && <HashMapVis items={hashItems} anim={anim} />}
        </g>

        {/* Big O table */}
        <g transform="translate(300, 20)">
          <text x="0" y="0" fontSize="9" fontWeight="700" className="fill-gray-600 dark:fill-slate-300">Time Complexity</text>
          {(['insert', 'delete', 'find'] as Op[]).map((op, i) => (
            <g key={op}>
              <text x="0" y={18 + i * 16} fontSize="8" className="fill-gray-500 dark:fill-slate-400">{OP_LABELS[op]}:</text>
              <text x="50" y={18 + i * 16} fontSize="9" fontWeight="700" fill={info.ops[op].includes('1') ? '#22c55e' : '#f59e0b'}>{info.ops[op]}</text>
            </g>
          ))}
        </g>
      </svg>

      <p className="mt-2 text-xs text-gray-600 dark:text-slate-400 leading-relaxed">{info.desc}</p>
    </div>
  );
}
