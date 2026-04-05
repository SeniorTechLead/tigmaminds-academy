const PrioritySchedulerDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 520 320"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Priority scheduler diagram showing CPU processing highest-priority tasks first from a queue"
      >
        <style>{`
          @keyframes pulse-cpu {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          .cpu-pulse { animation: pulse-cpu 2s ease-in-out infinite; }
          .label-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small-text { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        <defs>
          <marker id="sched-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
          </marker>
          <marker id="sched-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="500" height="300" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Priority Scheduler — Task Queue
        </text>

        {/* Queue label */}
        <text x="100" y="50" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600">
          Ready Queue
        </text>

        {/* Priority 1 - Critical (red) */}
        <rect x="30" y="60" width="140" height="32" rx="4" fill="#ef4444" opacity="0.9" />
        <text x="100" y="80" textAnchor="middle" className="label-text fill-white" fontWeight="600">
          P1: Critical task
        </text>

        {/* Priority 2 - High (orange) */}
        <rect x="30" y="98" width="140" height="32" rx="4" fill="#f97316" opacity="0.85" />
        <text x="100" y="118" textAnchor="middle" className="label-text fill-white" fontWeight="600">
          P2: High task
        </text>

        {/* Priority 3 - Medium (yellow) */}
        <rect x="30" y="136" width="140" height="32" rx="4" fill="#eab308" opacity="0.85" />
        <text x="100" y="156" textAnchor="middle" className="label-text fill-slate-800" fontWeight="600">
          P3: Medium task
        </text>

        {/* Priority 4 - Low (green) */}
        <rect x="30" y="174" width="140" height="32" rx="4" fill="#22c55e" opacity="0.8" />
        <text x="100" y="194" textAnchor="middle" className="label-text fill-white" fontWeight="600">
          P4: Low task
        </text>

        {/* Arrow from queue to CPU */}
        <line x1="175" y1="76" x2="260" y2="120"
          stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#sched-arrow-red)" />
        <text x="215" y="88" className="small-text fill-red-500 dark:fill-red-400" fontWeight="600">
          Runs first
        </text>

        {/* CPU box */}
        <rect x="265" y="90" width="100" height="60" rx="8"
          className="fill-indigo-500 dark:fill-indigo-600 stroke-indigo-700 dark:stroke-indigo-400 cpu-pulse"
          strokeWidth="2" />
        <text x="315" y="117" textAnchor="middle" className="label-text fill-white" fontWeight="700">
          CPU
        </text>
        <text x="315" y="133" textAnchor="middle" className="small-text fill-indigo-100">
          Processing P1
        </text>

        {/* Paused indicator arrows */}
        <line x1="175" y1="114" x2="220" y2="140" stroke="#6b7280" strokeWidth="1.5"
          strokeDasharray="4 3" markerEnd="url(#sched-arrow)" />
        <line x1="175" y1="152" x2="220" y2="155" stroke="#6b7280" strokeWidth="1.5"
          strokeDasharray="4 3" markerEnd="url(#sched-arrow)" />
        <line x1="175" y1="190" x2="220" y2="170" stroke="#6b7280" strokeWidth="1.5"
          strokeDasharray="4 3" markerEnd="url(#sched-arrow)" />

        {/* Waiting label */}
        <text x="230" y="175" className="small-text fill-slate-500 dark:fill-slate-400">
          Waiting...
        </text>

        {/* Output arrow */}
        <line x1="370" y1="120" x2="430" y2="120"
          stroke="#6b7280" strokeWidth="2" markerEnd="url(#sched-arrow)" />
        <text x="440" y="115" className="label-text fill-slate-600 dark:fill-slate-300">
          Done
        </text>
        <text x="440" y="130" className="small-text fill-slate-500 dark:fill-slate-400">
          (completed)
        </text>

        {/* Legend */}
        <rect x="30" y="225" width="14" height="14" rx="2" fill="#ef4444" />
        <text x="50" y="236" className="small-text fill-slate-600 dark:fill-slate-300">P1 Critical</text>
        <rect x="120" y="225" width="14" height="14" rx="2" fill="#f97316" />
        <text x="140" y="236" className="small-text fill-slate-600 dark:fill-slate-300">P2 High</text>
        <rect x="200" y="225" width="14" height="14" rx="2" fill="#eab308" />
        <text x="220" y="236" className="small-text fill-slate-600 dark:fill-slate-300">P3 Medium</text>
        <rect x="290" y="225" width="14" height="14" rx="2" fill="#22c55e" />
        <text x="310" y="236" className="small-text fill-slate-600 dark:fill-slate-300">P4 Low</text>

        {/* Starvation note */}
        <text x="250" y="265" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          Lower-priority tasks wait until all higher-priority tasks finish
        </text>
        <text x="250" y="280" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          Risk: priority inversion / starvation of low-priority work
        </text>
      </svg>
    </div>
  );
};

export default PrioritySchedulerDiagram;
