import { useState, useEffect } from 'react';

// ── The ER Waiting Room ──────────────────────────────────────
// Animated priority queue. Tasks arrive with priority levels;
// heap structure automatically reorders so the highest-priority
// task is always pulled next. Click "arrive" to add random
// tasks; click "process" to pop the top priority.

interface Task {
  id: number;
  label: string;
  priority: number;
  arrived: number;
  color: string;
}

const LABELS = [
  { label: 'heart attack', priority: 9, color: '#ef4444' },
  { label: 'broken arm', priority: 6, color: '#f97316' },
  { label: 'deep cut', priority: 7, color: '#ef4444' },
  { label: 'fever', priority: 4, color: '#f59e0b' },
  { label: 'sprained ankle', priority: 5, color: '#eab308' },
  { label: 'paper cut', priority: 1, color: '#84cc16' },
  { label: 'stroke', priority: 10, color: '#dc2626' },
  { label: 'cough', priority: 2, color: '#84cc16' },
  { label: 'dizziness', priority: 5, color: '#eab308' },
  { label: 'stomach ache', priority: 3, color: '#84cc16' },
];

let taskId = 0;

export default function PrioritySchedulerDiagram() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [processed, setProcessed] = useState<Task[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(id);
  }, []);

  const arrive = () => {
    const template = LABELS[Math.floor(Math.random() * LABELS.length)];
    const newTask: Task = {
      id: taskId++,
      label: template.label,
      priority: template.priority,
      color: template.color,
      arrived: tick,
    };
    setTasks(prev => {
      // Priority queue: highest priority at the top (descending)
      const next = [...prev, newTask].sort((a, b) => b.priority - a.priority);
      return next;
    });
  };

  const process = () => {
    if (tasks.length === 0) return;
    setTasks(prev => {
      const [top, ...rest] = prev;
      setProcessed(p => [top, ...p].slice(0, 6));
      return rest;
    });
  };

  const reset = () => {
    setTasks([]);
    setProcessed([]);
  };

  return (
    <div className="bg-gradient-to-b from-rose-50 via-slate-50 to-emerald-50 dark:from-rose-950 dark:via-slate-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
          The ER Waiting Room
        </p>
        <div className="flex gap-2">
          <button
            onClick={arrive}
            className="text-xs px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow transition"
          >
            + Patient arrives
          </button>
          <button
            onClick={process}
            disabled={tasks.length === 0}
            className="text-xs px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-semibold shadow transition"
          >
            ✓ Treat next
          </button>
          {(tasks.length > 0 || processed.length > 0) && (
            <button
              onClick={reset}
              className="text-xs px-2 py-1 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {/* Waiting queue (priority queue) */}
        <div className="md:col-span-2 bg-white/70 dark:bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 font-semibold">
            Priority Queue · {tasks.length} waiting
          </div>
          {tasks.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-12">
              Empty queue. Click &quot;Patient arrives&quot; to add one.
            </div>
          ) : (
            <div className="space-y-1.5">
              {tasks.map((t, i) => (
                <div key={t.id}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 transition-all ${
                    i === 0
                      ? 'ring-2 ring-emerald-500 shadow-md'
                      : ''
                  }`}
                  style={{ background: t.color + '30' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0" style={{ background: t.color }}>
                    {t.priority}
                  </div>
                  <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">{t.label}</span>
                  {i === 0 && <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">← NEXT</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Processed history */}
        <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 font-semibold">
            Treated · {processed.length}
          </div>
          {processed.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-500 text-xs py-8">
              No one treated yet.
            </div>
          ) : (
            <div className="space-y-1">
              {processed.map((t) => (
                <div key={t.id} className="text-xs text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center font-bold text-white text-[9px]" style={{ background: t.color }}>
                    {t.priority}
                  </div>
                  <span>{t.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
        Behind the scenes: a <strong>heap</strong> data structure keeps the highest priority at the top in O(log n) per insert/remove. Used by OS schedulers, Dijkstra&apos;s algorithm, and every real-time system.
      </p>
    </div>
  );
}
