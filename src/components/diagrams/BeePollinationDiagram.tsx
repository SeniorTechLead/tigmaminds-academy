export default function BeePollinationDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 546 378" className="w-full max-w-lg mx-auto" role="img" aria-label="Bee pollination diagram showing pollen transfer between flowers">
        <rect width="520" height="360" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Pollination: Pollen Transfer</text>

        {/* Flower 1 — left */}
        <g transform="translate(110, 200)">
          {/* Stem */}
          <line x1="0" y1="40" x2="0" y2="100" stroke="#22c55e" strokeWidth="4" />
          {/* Leaves */}
          <ellipse cx="-20" cy="70" rx="15" ry="6" fill="#22c55e" transform="rotate(-30, -20, 70)" />
          <ellipse cx="18" cy="85" rx="15" ry="6" fill="#16a34a" transform="rotate(25, 18, 85)" />

          {/* Petals */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse
              key={angle}
              cx={Math.cos((angle * Math.PI) / 180) * 30}
              cy={Math.sin((angle * Math.PI) / 180) * 30}
              rx="20"
              ry="12"
              fill="#a855f7"
              opacity="0.7"
              transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 30}, ${Math.sin((angle * Math.PI) / 180) * 30})`}
            />
          ))}

          {/* Center — anther with pollen */}
          <circle cx="0" cy="0" r="14" fill="#fbbf24" />
          {/* Pollen grains */}
          {[[-5, -5], [3, -7], [6, 2], [-3, 6], [-7, 1]].map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r="2.5" fill="#f59e0b" stroke="#d97706" strokeWidth="0.5" />
          ))}

          <text x="0" y="120" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#a855f7">Flower A</text>
          <text x="0" y="133" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Anther releases pollen</text>
        </g>

        {/* Flower 2 — right */}
        <g transform="translate(410, 200)">
          {/* Stem */}
          <line x1="0" y1="40" x2="0" y2="100" stroke="#22c55e" strokeWidth="4" />
          <ellipse cx="20" cy="70" rx="15" ry="6" fill="#22c55e" transform="rotate(30, 20, 70)" />
          <ellipse cx="-18" cy="85" rx="15" ry="6" fill="#16a34a" transform="rotate(-25, -18, 85)" />

          {/* Petals */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse
              key={angle}
              cx={Math.cos((angle * Math.PI) / 180) * 30}
              cy={Math.sin((angle * Math.PI) / 180) * 30}
              rx="20"
              ry="12"
              fill="#ec4899"
              opacity="0.7"
              transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 30}, ${Math.sin((angle * Math.PI) / 180) * 30})`}
            />
          ))}

          {/* Center — stigma (sticky) */}
          <circle cx="0" cy="0" r="14" fill="#86efac" />
          {/* Stigma surface */}
          <circle cx="0" cy="0" r="8" fill="#22c55e" />
          {/* Received pollen */}
          <circle cx="-3" cy="-2" r="2.5" fill="#f59e0b" stroke="#d97706" strokeWidth="0.5" />
          <circle cx="4" cy="1" r="2.5" fill="#f59e0b" stroke="#d97706" strokeWidth="0.5" />

          <text x="0" y="120" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ec4899">Flower B</text>
          <text x="0" y="133" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Stigma receives pollen</text>
        </g>

        {/* Bee in flight — center */}
        <g transform="translate(260, 140)">
          {/* Wings */}
          <ellipse cx="-15" cy="-15" rx="18" ry="8" fill="#bfdbfe" opacity="0.4" transform="rotate(-20, -15, -15)" />
          <ellipse cx="15" cy="-15" rx="18" ry="8" fill="#bfdbfe" opacity="0.4" transform="rotate(20, 15, -15)" />

          {/* Body */}
          <ellipse cx="0" cy="0" rx="20" ry="12" fill="#eab308" />
          {/* Stripes */}
          <line x1="-8" y1="-2" x2="8" y2="-2" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="3" />
          <line x1="-6" y1="4" x2="6" y2="4" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="3" />
          {/* Head */}
          <circle cx="22" cy="-2" r="7" className="fill-gray-100 dark:fill-slate-800" />
          {/* Antennae */}
          <line x1="26" y1="-6" x2="34" y2="-14" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1.5" />
          <line x1="28" y1="-3" x2="36" y2="-10" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1.5" />
          {/* Pollen on legs */}
          <circle cx="-8" cy="12" r="4" fill="#f59e0b" opacity="0.8" />
          <circle cx="4" cy="13" r="3.5" fill="#f59e0b" opacity="0.8" />
        </g>

        {/* Transfer arrows */}
        <defs>
          <marker id="bpd-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Arrow from Flower A to Bee */}
        <path d="M 140,180 Q 180,140 240,140" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#bpd-arrow)" />
        <text x="170" y="148" fontSize="8" fill="#fcd34d" transform="rotate(-20, 170, 148)">Pollen sticks</text>

        {/* Arrow from Bee to Flower B */}
        <path d="M 280,145 Q 340,145 380,185" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#bpd-arrow)" />
        <text x="340" y="148" fontSize="8" fill="#fcd34d" transform="rotate(20, 340, 148)">Pollen deposits</text>

        {/* Process steps — bottom */}
        {[
          { x: 80, label: "1. Bee visits", sub: "Flower A" },
          { x: 200, label: "2. Pollen grains", sub: "stick to body" },
          { x: 320, label: "3. Bee flies to", sub: "Flower B" },
          { x: 440, label: "4. Pollen lands", sub: "on stigma" },
        ].map((step, i) => (
          <g key={i}>
            <circle cx={step.x} cy="55" r="12" fill="#f59e0b" opacity="0.2" />
            <text x={step.x} y="59" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">{i + 1}</text>
            <text x={step.x} y="75" textAnchor="middle" fontSize="8" fill="#fcd34d">{step.label}</text>
            <text x={step.x} y="86" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">{step.sub}</text>
          </g>
        ))}

        {/* Connecting dots between steps */}
        {[140, 260, 380].map((x) => (
          <line key={x} x1={x} y1="55" x2={x + 20} y2="55" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
        ))}
      </svg>
    </div>
  );
}
