export default function VimanaLiftDragDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 520 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Four forces acting on an aircraft: lift, weight, thrust, and drag"
      >
        <defs>
          <marker id="vld-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="vld-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="vld-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
          <marker id="vld-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="520" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="260" y="30" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          The Four Forces of Flight
        </text>

        {/* Sky gradient hint */}
        <rect x="20" y="45" width="480" height="250" rx="6"
          className="fill-sky-50 dark:fill-sky-950/30" />

        {/* Simple aircraft body */}
        <ellipse cx="260" cy="180" rx="80" ry="18"
          className="fill-slate-300 dark:fill-slate-600 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
        {/* Wings */}
        <line x1="220" y1="180" x2="160" y2="175"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="4" strokeLinecap="round" />
        <line x1="300" y1="180" x2="360" y2="175"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="4" strokeLinecap="round" />
        {/* Tail */}
        <line x1="180" y1="180" x2="170" y2="165"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="3" strokeLinecap="round" />
        {/* Cockpit */}
        <ellipse cx="310" cy="175" rx="15" ry="10"
          className="fill-sky-200 dark:fill-sky-700 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1" />

        {/* LIFT arrow (up) */}
        <line x1="260" y1="160" x2="260" y2="70"
          className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="3"
          markerEnd="url(#vld-arrow-blue)" />
        <text x="260" y="62" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="13" fontWeight="bold" className="fill-blue-600 dark:fill-blue-300">LIFT</text>

        {/* WEIGHT arrow (down) */}
        <line x1="260" y1="200" x2="260" y2="280"
          className="stroke-red-500 dark:stroke-red-400" strokeWidth="3"
          markerEnd="url(#vld-arrow-red)" />
        <text x="260" y="298" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="13" fontWeight="bold" className="fill-red-600 dark:fill-red-300">WEIGHT</text>

        {/* THRUST arrow (right) */}
        <line x1="342" y1="180" x2="430" y2="180"
          className="stroke-green-500 dark:stroke-green-400" strokeWidth="3"
          markerEnd="url(#vld-arrow-green)" />
        <text x="445" y="184" fontFamily="system-ui, sans-serif"
          fontSize="13" fontWeight="bold" className="fill-green-600 dark:fill-green-300">THRUST</text>

        {/* DRAG arrow (left) */}
        <line x1="178" y1="180" x2="90" y2="180"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="3"
          markerEnd="url(#vld-arrow-amber)" />
        <text x="50" y="184" fontFamily="system-ui, sans-serif"
          fontSize="13" fontWeight="bold" className="fill-amber-600 dark:fill-amber-300">DRAG</text>

        {/* Gravity symbol at centre */}
        <circle cx="260" cy="180" r="3" className="fill-slate-700 dark:fill-slate-200" />

        {/* Force descriptions */}
        <rect x="20" y="310" width="235" height="95" rx="6"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="137" y="330" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          Vertical balance
        </text>
        <text x="137" y="348" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-blue-600 dark:fill-blue-400">
          Lift (air pressure difference)
        </text>
        <text x="137" y="363" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">must equal or exceed</text>
        <text x="137" y="378" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-red-600 dark:fill-red-400">
          Weight (gravity pulling down)
        </text>
        <text x="137" y="396" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">
          Lift {'>'} Weight = climb
        </text>

        <rect x="265" y="310" width="235" height="95" rx="6"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="382" y="330" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          Horizontal balance
        </text>
        <text x="382" y="348" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-green-600 dark:fill-green-400">
          Thrust (engine power forward)
        </text>
        <text x="382" y="363" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">must equal or exceed</text>
        <text x="382" y="378" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">
          Drag (air resistance backward)
        </text>
        <text x="382" y="396" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">
          Thrust {'>'} Drag = accelerate
        </text>
      </svg>
    </div>
  );
}
