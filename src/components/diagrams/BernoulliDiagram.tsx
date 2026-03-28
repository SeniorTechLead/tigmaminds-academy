const BernoulliDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 500 250"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Bernoulli principle diagram showing airflow over an airplane wing creating lift"
      >
        <style>{`
          @keyframes flowRight {
            0% { stroke-dashoffset: 20; }
            100% { stroke-dashoffset: 0; }
          }
          .airflow-top {
            animation: flowRight 1s linear infinite;
            stroke-dasharray: 10 10;
          }
          .airflow-bottom {
            animation: flowRight 1.6s linear infinite;
            stroke-dasharray: 14 14;
          }
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 13px;
            font-weight: 600;
          }
        `}</style>

        <defs>
          <marker id="bern-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
          <marker id="bern-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="500" height="250" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Bernoulli's Principle — Airplane Wing Lift
        </text>

        {/* Wing cross-section (airfoil shape) */}
        <path d="M 130 140 Q 180 90, 280 120 Q 340 130, 370 140 Q 340 148, 280 148 Q 200 150, 130 140 Z"
          className="fill-slate-300 dark:fill-slate-600 stroke-slate-600 dark:stroke-slate-300" strokeWidth="2" />

        {/* Airflow lines — top (faster, closer together) */}
        <path d="M 80 95 Q 180 60, 290 90 L 420 85" fill="none"
          stroke="#3b82f6" strokeWidth="1.5" className="airflow-top" />
        <path d="M 80 108 Q 190 78, 300 102 L 420 98" fill="none"
          stroke="#3b82f6" strokeWidth="1.5" className="airflow-top" />
        <path d="M 80 120 Q 200 92, 310 113 L 420 110" fill="none"
          stroke="#3b82f6" strokeWidth="1.5" className="airflow-top" />

        {/* Airflow lines — bottom (slower, more spread) */}
        <path d="M 80 155 Q 200 158, 310 155 L 420 155" fill="none"
          stroke="#60a5fa" strokeWidth="1.5" className="airflow-bottom" />
        <path d="M 80 172 Q 200 178, 310 174 L 420 172" fill="none"
          stroke="#60a5fa" strokeWidth="1.5" className="airflow-bottom" />
        <path d="M 80 190 Q 200 195, 310 192 L 420 190" fill="none"
          stroke="#60a5fa" strokeWidth="1.5" className="airflow-bottom" />

        {/* Flow direction arrows */}
        <line x1="60" y1="140" x2="95" y2="140"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" markerEnd="url(#bern-arrow-green)" />
        <text x="60" y="135" className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          Airflow
        </text>

        {/* Pressure labels */}
        <text x="250" y="75" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400" fontWeight="600">
          Low P (fast flow)
        </text>
        <text x="250" y="210" textAnchor="middle"
          className="label-text fill-orange-600 dark:fill-orange-400" fontWeight="600">
          High P (slow flow)
        </text>

        {/* Lift force arrow */}
        <line x1="395" y1="145" x2="395" y2="60"
          stroke="#ef4444" strokeWidth="3.5" markerEnd="url(#bern-arrow-red)" />
        <text x="420" y="95" className="label-text fill-red-600 dark:fill-red-400" fontWeight="600">
          Net Lift
        </text>

        {/* Wing label */}
        <text x="250" y="143" textAnchor="middle"
          className="label-text fill-slate-700 dark:fill-slate-200" style={{ fontSize: '10px' }}>
          Wing
        </text>

        {/* Bottom note */}
        <text x="250" y="240" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          Faster airflow above wing → lower pressure → net upward lift
        </text>
      </svg>
    </div>
  );
};

export default BernoulliDiagram;
