export default function BeeDiseaseDetectionDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 570 420" className="w-full max-w-2xl mx-auto" role="img" aria-label="Varroa mite detection pipeline diagram from image capture to classification to alert">
        <rect width="570" height="420" rx="12" className="fill-slate-900" />

        <text x="285" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Varroa Mite Detection Pipeline</text>
        <text x="285" y="46" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Computer vision for automated disease monitoring</text>

        <defs>
          <marker id="bdd-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#fbbf24" />
          </marker>
        </defs>

        {/* Stage 1: Image Capture */}
        <g transform="translate(75, 135)">
          <rect x="-50" y="-40" width="100" height="90" rx="6" fill="#3b82f6" opacity="0.08" stroke="#3b82f6" strokeWidth="1" />
          <text x="0" y="-22" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3b82f6">1. CAPTURE</text>

          {/* Camera icon */}
          <rect x="-18" y="-8" width="36" height="24" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#3b82f6" strokeWidth="1.5" />
          <circle cx="0" cy="4" r="8" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
          <circle cx="0" cy="4" r="3" fill="#3b82f6" opacity="0.4" />
          <rect x="10" y="-6" width="6" height="4" rx="1" fill="#3b82f6" opacity="0.4" />

          <text x="0" y="60" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Camera at hive</text>
          <text x="0" y="73" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">entrance, 10fps</text>
        </g>

        {/* Arrow 1→2 */}
        <line x1="130" y1="135" x2="165" y2="135" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#bdd-arrow)" opacity="0.5" />

        {/* Stage 2: Preprocessing */}
        <g transform="translate(210, 135)">
          <rect x="-40" y="-40" width="80" height="90" rx="6" fill="#a855f7" opacity="0.08" stroke="#a855f7" strokeWidth="1" />
          <text x="0" y="-22" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#a855f7">2. PROCESS</text>

          {/* Image frame with bee */}
          <rect x="-20" y="-8" width="40" height="28" rx="3" className="fill-gray-100 dark:fill-slate-800" stroke="#a855f7" strokeWidth="1" />
          {/* Bee silhouette */}
          <ellipse cx="-2" cy="6" rx="10" ry="6" fill="#eab308" opacity="0.4" />
          {/* Bounding box */}
          <rect x="-14" y="-2" width="24" height="18" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,1" />
          {/* Mite dot */}
          <circle cx="3" cy="3" r="3" fill="#ef4444" opacity="0.7" />

          <text x="0" y="60" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Segment bee,</text>
          <text x="0" y="73" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">crop &amp; resize</text>
        </g>

        {/* Arrow 2→3 */}
        <line x1="255" y1="135" x2="290" y2="135" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#bdd-arrow)" opacity="0.5" />

        {/* Stage 3: CNN Classification */}
        <g transform="translate(340, 135)">
          <rect x="-45" y="-40" width="90" height="90" rx="6" fill="#f59e0b" opacity="0.08" stroke="#f59e0b" strokeWidth="1" />
          <text x="0" y="-22" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f59e0b">3. CLASSIFY</text>

          {/* Neural net layers */}
          {[-25, -10, 5, 20].map((xOff, col) => {
            const nodes = col === 0 ? 4 : col === 3 ? 2 : 3;
            return Array.from({ length: nodes }).map((_, row) => (
              <circle
                key={`${col}-${row}`}
                cx={xOff}
                cy={(row - (nodes - 1) / 2) * 10 + 6}
                r="3"
                fill="#f59e0b"
                opacity={0.3 + col * 0.15}
              />
            ));
          })}
          {/* Connections (simplified) */}
          <line x1="-22" y1="0" x2="-13" y2="0" stroke="#f59e0b" strokeWidth="0.5" opacity="0.3" />
          <line x1="-7" y1="0" x2="2" y2="0" stroke="#f59e0b" strokeWidth="0.5" opacity="0.3" />
          <line x1="8" y1="0" x2="17" y2="0" stroke="#f59e0b" strokeWidth="0.5" opacity="0.3" />

          <text x="0" y="60" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">CNN model:</text>
          <text x="0" y="73" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">mite / no-mite</text>
        </g>

        {/* Arrow 3→4 */}
        <line x1="390" y1="135" x2="425" y2="135" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#bdd-arrow)" opacity="0.5" />

        {/* Stage 4: Alert */}
        <g transform="translate(480, 135)">
          <rect x="-45" y="-40" width="90" height="90" rx="6" fill="#ef4444" opacity="0.08" stroke="#ef4444" strokeWidth="1" />
          <text x="0" y="-22" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444">4. ALERT</text>

          {/* Bell icon */}
          <path d="M 0,-8 Q -12,-5 -12,5 L -12,8 L 12,8 L 12,5 Q 12,-5 0,-8 Z" fill="#ef4444" opacity="0.4" />
          <circle cx="0" cy="12" r="3" fill="#ef4444" opacity="0.4" />
          <line x1="0" y1="-12" x2="0" y2="-8" stroke="#ef4444" strokeWidth="1.5" />

          <text x="0" y="60" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">SMS / app alert</text>
          <text x="0" y="73" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">to beekeeper</text>
        </g>

        {/* Detection results panel */}
        <g transform="translate(285, 275)">
          <rect x="-230" y="-28" width="460" height="75" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
          <text x="0" y="-8" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">Model Output Example</text>

          {/* Healthy bee */}
          <g transform="translate(-130, 22)">
            <rect x="-45" y="-14" width="90" height="28" rx="4" fill="#22c55e" opacity="0.1" stroke="#22c55e" strokeWidth="1" />
            <ellipse cx="-22" cy="0" rx="10" ry="6" fill="#eab308" opacity="0.5" />
            <text x="18" y="5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#22c55e">Healthy 97%</text>
          </g>

          {/* Infected bee */}
          <g transform="translate(130, 22)">
            <rect x="-50" y="-14" width="100" height="28" rx="4" fill="#ef4444" opacity="0.1" stroke="#ef4444" strokeWidth="1" />
            <ellipse cx="-28" cy="0" rx="10" ry="6" fill="#eab308" opacity="0.5" />
            <circle cx="-23" cy="-3" r="3" fill="#ef4444" opacity="0.7" />
            <text x="18" y="5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444">Mite! 94%</text>
          </g>
        </g>

        {/* Performance metrics */}
        <g transform="translate(285, 375)">
          {[
            { label: "Accuracy", value: "96.5%", color: "#22c55e" },
            { label: "Precision", value: "94.2%", color: "#3b82f6" },
            { label: "Recall", value: "97.1%", color: "#a855f7" },
            { label: "Speed", value: "30 fps", color: "#f59e0b" },
          ].map((m, i) => (
            <g key={i}>
              <text x={-175 + i * 118} y="0" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{m.label}</text>
              <text x={-175 + i * 118} y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill={m.color}>{m.value}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
