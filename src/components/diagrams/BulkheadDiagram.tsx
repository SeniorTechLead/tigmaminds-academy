const BulkheadDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 540 350"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Bulkhead diagram comparing a ship with sealed compartments to one without, showing how bulkheads limit flooding"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small-text { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        {/* Background */}
        <rect width="520" height="330" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="260" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Bulkhead Compartmentalisation
        </text>

        {/* === TOP: Ship with bulkheads === */}
        <text x="260" y="50" textAnchor="middle"
          className="label-text fill-green-600 dark:fill-green-400" fontWeight="600">
          With Bulkheads — One compartment breached
        </text>

        {/* Hull outline */}
        <path d="M 60 100 L 50 150 Q 260 175, 470 150 L 460 100 Z"
          className="fill-slate-200 dark:fill-slate-700 stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />

        {/* Deck */}
        <line x1="60" y1="100" x2="460" y2="100"
          className="stroke-slate-600 dark:stroke-slate-400" strokeWidth="2" />

        {/* Bulkhead walls */}
        {[140, 220, 300, 380].map((x) => (
          <line key={x} x1={x} y1="100" x2={x} y2="150"
            stroke="#6366f1" strokeWidth="2.5" />
        ))}

        {/* Compartment labels */}
        <text x="100" y="132" textAnchor="middle" className="small-text fill-slate-500 dark:fill-slate-400">1</text>
        <text x="180" y="132" textAnchor="middle" className="small-text fill-slate-500 dark:fill-slate-400">2</text>
        <text x="260" y="132" textAnchor="middle" className="small-text fill-slate-500 dark:fill-slate-400">3</text>
        <text x="340" y="132" textAnchor="middle" className="small-text fill-slate-500 dark:fill-slate-400">4</text>
        <text x="420" y="132" textAnchor="middle" className="small-text fill-slate-500 dark:fill-slate-400">5</text>

        {/* Flooded compartment (2nd) */}
        <path d="M 140 100 L 140 150 Q 180 155, 220 150 L 220 100 Z"
          fill="#3b82f6" opacity="0.4" />

        {/* Breach mark */}
        <line x1="178" y1="150" x2="182" y2="160" stroke="#ef4444" strokeWidth="2" />
        <line x1="182" y1="150" x2="178" y2="160" stroke="#ef4444" strokeWidth="2" />
        <text x="180" y="172" textAnchor="middle" className="small-text fill-red-500 dark:fill-red-400">
          Breach
        </text>

        {/* Water line */}
        <line x1="30" y1="145" x2="490" y2="145"
          stroke="#3b82f6" strokeWidth="1" strokeDasharray="6 3" opacity="0.5" />

        {/* Status label */}
        <text x="260" y="192" textAnchor="middle"
          className="label-text fill-green-600 dark:fill-green-400" fontWeight="600">
          Ship stays afloat — only 1/5 flooded
        </text>

        {/* Divider */}
        <line x1="40" y1="205" x2="480" y2="205"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4 4" />

        {/* === BOTTOM: Ship without bulkheads === */}
        <text x="260" y="225" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400" fontWeight="600">
          Without Bulkheads — Same breach
        </text>

        {/* Hull outline */}
        <path d="M 60 245 L 50 295 Q 260 320, 470 295 L 460 245 Z"
          className="fill-slate-200 dark:fill-slate-700 stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />

        {/* Deck */}
        <line x1="60" y1="245" x2="460" y2="245"
          className="stroke-slate-600 dark:stroke-slate-400" strokeWidth="2" />

        {/* Fully flooded */}
        <path d="M 60 245 L 50 295 Q 260 320, 470 295 L 460 245 Z"
          fill="#3b82f6" opacity="0.35" />

        {/* Breach mark */}
        <line x1="178" y1="290" x2="182" y2="300" stroke="#ef4444" strokeWidth="2" />
        <line x1="182" y1="290" x2="178" y2="300" stroke="#ef4444" strokeWidth="2" />

        {/* Water spreading arrows */}
        <text x="120" y="278" textAnchor="middle" className="small-text fill-blue-500">~water~</text>
        <text x="260" y="278" textAnchor="middle" className="small-text fill-blue-500">~water~</text>
        <text x="380" y="278" textAnchor="middle" className="small-text fill-blue-500">~water~</text>

        {/* Status label */}
        <text x="260" y="315" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400" fontWeight="600">
          Entire hull floods — ship sinks
        </text>
      </svg>
    </div>
  );
};

export default BulkheadDiagram;
