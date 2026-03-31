export default function OrchidBeeVisionDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 420" className="w-full max-w-lg mx-auto" role="img" aria-label="Diagram comparing human vision and bee vision of flowers, showing UV nectar guide patterns invisible to humans">
        <rect width="560" height="420" rx="12" className="fill-slate-900" />
        <text x="280" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Flowers Talk to Insects</text>
        <text x="280" y="46" textAnchor="middle" fontSize="10" className="fill-slate-400">Bees see UV patterns invisible to human eyes — hidden nectar guides</text>

        {/* Human vision section */}
        <g transform="translate(140, 80)">
          <text x="0" y="0" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#60a5fa">Human Vision</text>
          <text x="0" y="15" textAnchor="middle" fontSize="9" className="fill-slate-400">3 cone types: red, green, blue</text>
          <text x="0" y="27" textAnchor="middle" fontSize="9" className="fill-slate-400">Range: 380–750 nm</text>

          {/* Human view of flower - uniform yellow */}
          <g transform="translate(0, 55)">
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse
                key={a}
                cx={Math.cos((a * Math.PI) / 180) * 28}
                cy={Math.sin((a * Math.PI) / 180) * 28}
                rx="18" ry="10" fill="#eab308" opacity="0.7"
                transform={`rotate(${a}, ${Math.cos((a * Math.PI) / 180) * 28}, ${Math.sin((a * Math.PI) / 180) * 28})`}
              />
            ))}
            <circle cx="0" cy="0" r="10" fill="#a16207" />
            <text x="0" y="60" textAnchor="middle" fontSize="10" fill="#fbbf24">Uniform yellow</text>
            <text x="0" y="73" textAnchor="middle" fontSize="8" className="fill-slate-400">&quot;Pretty, but where is the nectar?&quot;</text>
          </g>

          {/* Eye icon */}
          <g transform="translate(0, 150)">
            <ellipse cx="0" cy="0" rx="18" ry="12" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="6" fill="#60a5fa" />
            <circle cx="0" cy="0" r="3" className="fill-gray-100 dark:fill-slate-800" />
            <text x="0" y="20" textAnchor="middle" fontSize="8" fill="#60a5fa">Human eye</text>
          </g>
        </g>

        {/* Bee vision section */}
        <g transform="translate(420, 80)">
          <text x="0" y="0" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#a855f7">Bee Vision</text>
          <text x="0" y="15" textAnchor="middle" fontSize="9" className="fill-slate-400">3 receptor types: UV, blue, green</text>
          <text x="0" y="27" textAnchor="middle" fontSize="9" className="fill-slate-400">Range: 300–650 nm (sees UV!)</text>

          {/* Bee view of flower - UV bullseye pattern */}
          <g transform="translate(0, 55)">
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse
                key={a}
                cx={Math.cos((a * Math.PI) / 180) * 28}
                cy={Math.sin((a * Math.PI) / 180) * 28}
                rx="18" ry="10" fill="#eab308" opacity="0.5"
                transform={`rotate(${a}, ${Math.cos((a * Math.PI) / 180) * 28}, ${Math.sin((a * Math.PI) / 180) * 28})`}
              />
            ))}
            {/* UV bullseye */}
            <circle cx="0" cy="0" r="22" fill="#7c3aed" opacity="0.6" />
            <circle cx="0" cy="0" r="14" fill="#581c87" opacity="0.7" />
            <circle cx="0" cy="0" r="7" fill="#fbbf24" opacity="0.9" />
            {/* Nectar guide lines */}
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <line
                key={`g${a}`}
                x1={Math.cos((a * Math.PI) / 180) * 7}
                y1={Math.sin((a * Math.PI) / 180) * 7}
                x2={Math.cos((a * Math.PI) / 180) * 20}
                y2={Math.sin((a * Math.PI) / 180) * 20}
                stroke="#fbbf24" strokeWidth="2" opacity="0.8"
              />
            ))}
            <text x="0" y="60" textAnchor="middle" fontSize="10" fill="#a855f7">UV bullseye pattern</text>
            <text x="0" y="73" textAnchor="middle" fontSize="8" className="fill-slate-400">&quot;Land here! Nectar this way!&quot;</text>
          </g>

          {/* Bee eye icon */}
          <g transform="translate(0, 150)">
            <circle cx="-6" cy="-4" r="5" fill="none" stroke="#a855f7" strokeWidth="1" />
            <circle cx="6" cy="-4" r="5" fill="none" stroke="#a855f7" strokeWidth="1" />
            <circle cx="0" cy="4" r="5" fill="none" stroke="#a855f7" strokeWidth="1" />
            <circle cx="-6" cy="-4" r="2" fill="#a855f7" />
            <circle cx="6" cy="-4" r="2" fill="#a855f7" />
            <circle cx="0" cy="4" r="2" fill="#a855f7" />
            <text x="0" y="20" textAnchor="middle" fontSize="8" fill="#a855f7">Bee compound eye</text>
          </g>
        </g>

        {/* Middle: the key difference */}
        <g transform="translate(280, 140)">
          <line x1="0" y1="-30" x2="0" y2="100" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4 4" />
          <text x="0" y="115" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-gray-700 dark:fill-slate-200">Same flower,</text>
          <text x="0" y="128" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-gray-700 dark:fill-slate-200">different eyes</text>
        </g>

        {/* Color matching table */}
        <g transform="translate(280, 290)">
          <text x="0" y="0" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-gray-700 dark:fill-slate-200">Which Pollinator Sees What?</text>

          {/* Table */}
          <g transform="translate(-200, 15)">
            {/* Headers */}
            <rect x="0" y="0" width="100" height="22" rx="3" fill="#334155" />
            <text x="50" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" className="fill-gray-700 dark:fill-slate-200">Flower Color</text>
            <rect x="105" y="0" width="100" height="22" rx="3" fill="#334155" />
            <text x="155" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" className="fill-gray-700 dark:fill-slate-200">Targets</text>
            <rect x="210" y="0" width="190" height="22" rx="3" fill="#334155" />
            <text x="305" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" className="fill-gray-700 dark:fill-slate-200">Why?</text>

            {/* Rows */}
            {[
              { color: '#8b5cf6', name: 'Blue/Purple', target: 'Bees', reason: 'Bees see blue and UV best', y: 26 },
              { color: '#ef4444', name: 'Red', target: 'Birds', reason: 'Bees cannot see red at all', y: 48 },
              { color: '#f1f5f9', name: 'White/Pale', target: 'Moths', reason: 'Visible in dim moonlight', y: 70 },
              { color: '#eab308', name: 'Yellow', target: 'Many insects', reason: 'Broad-spectrum visibility', y: 92 },
            ].map((row) => (
              <g key={row.name}>
                <circle cx="12" cy={row.y + 9} r="6" fill={row.color} opacity="0.8" />
                <text x="24" y={row.y + 13} fontSize="9" fill={row.color}>{row.name}</text>
                <text x="155" y={row.y + 13} textAnchor="middle" fontSize="9" className="fill-gray-700 dark:fill-slate-200">{row.target}</text>
                <text x="210" y={row.y + 13} fontSize="8" className="fill-slate-400">{row.reason}</text>
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
