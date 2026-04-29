export default function BeeConservationPlanDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 546 420" className="w-full max-w-2xl mx-auto" role="img" aria-label="Bee conservation plan diagram showing habitat corridors, pesticide-free zones, and native planting">
        <rect width="520" height="400" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Bee Conservation Plan</text>
        <text x="260" y="46" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Landscape-level strategy for pollinator protection</text>

        {/* Map view — central landscape */}
        <g transform="translate(260, 200)">
          {/* Background terrain */}
          <rect x="-200" y="-100" width="400" height="200" rx="8" fill="#1a3a1a" opacity="0.3" stroke="#22c55e" strokeWidth="1" />

          {/* Farmland areas (monoculture) */}
          <rect x="-180" y="-80" width="80" height="60" rx="4" fill="#78350f" opacity="0.2" stroke="#a16207" strokeWidth="1" strokeDasharray="3,2" />
          <text x="-140" y="-45" textAnchor="middle" fontSize="7" fill="#a16207">Farmland</text>

          <rect x="100" y="-80" width="80" height="60" rx="4" fill="#78350f" opacity="0.2" stroke="#a16207" strokeWidth="1" strokeDasharray="3,2" />
          <text x="140" y="-45" textAnchor="middle" fontSize="7" fill="#a16207">Farmland</text>

          <rect x="-50" y="20" width="100" height="60" rx="4" fill="#78350f" opacity="0.2" stroke="#a16207" strokeWidth="1" strokeDasharray="3,2" />
          <text x="0" y="55" textAnchor="middle" fontSize="7" fill="#a16207">Farmland</text>

          {/* Pesticide-free zones (green circles) */}
          <circle cx="-140" cy="30" r="35" fill="#22c55e" opacity="0.1" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,3" />
          <text x="-140" y="25" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#22c55e">Pesticide-</text>
          <text x="-140" y="34" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#22c55e">free zone</text>

          <circle cx="140" cy="40" r="35" fill="#22c55e" opacity="0.1" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,3" />
          <text x="140" y="35" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#22c55e">Pesticide-</text>
          <text x="140" y="44" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#22c55e">free zone</text>

          {/* Native wildflower meadows */}
          {[
            { x: -140, y: -30 },
            { x: 0, y: -60 },
            { x: 140, y: -30 },
          ].map((m, i) => (
            <g key={i}>
              <ellipse cx={m.x} cy={m.y} rx="25" ry="15" fill="#ec4899" opacity="0.1" stroke="#ec4899" strokeWidth="1" />
              {/* Mini flowers */}
              {[-10, -3, 4, 11].map((fx) => (
                <circle key={fx} cx={m.x + fx} cy={m.y} r="2" fill="#ec4899" opacity="0.4" />
              ))}
              <text x={m.x} y={m.y + 12} textAnchor="middle" fontSize="6" fill="#f9a8d4">Wildflower meadow</text>
            </g>
          ))}

          {/* Habitat corridors — connecting green strips */}
          <path
            d="M -115,-30 Q -60,-40 0,-60 Q 60,-40 115,-30"
            fill="none" stroke="#86efac" strokeWidth="8" opacity="0.2"
          />
          <path
            d="M -115,-30 Q -80,10 -60,30"
            fill="none" stroke="#86efac" strokeWidth="8" opacity="0.2"
          />
          <path
            d="M 115,-30 Q 80,10 60,40"
            fill="none" stroke="#86efac" strokeWidth="8" opacity="0.2"
          />

          {/* Corridor label */}
          <text x="0" y="-75" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#86efac">HABITAT CORRIDOR</text>

          {/* Bee-friendly hive locations */}
          {[
            { x: -140, y: -30 },
            { x: 0, y: -50 },
            { x: 140, y: -30 },
          ].map((h, i) => (
            <g key={i}>
              <polygon
                points={`${h.x - 5},${h.y - 2} ${h.x},${h.y - 8} ${h.x + 5},${h.y - 2} ${h.x + 5},${h.y + 4} ${h.x - 5},${h.y + 4}`}
                fill="#f59e0b" opacity="0.5"
              />
            </g>
          ))}
        </g>

        {/* Legend */}
        <g transform="translate(260, 330)">
          <rect x="-220" y="-15" width="440" height="50" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />

          {[
            { x: -180, color: "#86efac", label: "Habitat corridor", shape: "line" },
            { x: -80, color: "#22c55e", label: "Pesticide-free zone", shape: "circle" },
            { x: 30, color: "#ec4899", label: "Wildflower meadow", shape: "flower" },
            { x: 150, color: "#f59e0b", label: "Managed hives", shape: "hive" },
          ].map((item) => (
            <g key={item.label}>
              {item.shape === "line" && <line x1={item.x - 10} y1="5" x2={item.x + 5} y2="5" stroke={item.color} strokeWidth="4" opacity="0.4" />}
              {item.shape === "circle" && <circle cx={item.x} cy="5" r="6" fill={item.color} opacity="0.15" stroke={item.color} strokeWidth="1" />}
              {item.shape === "flower" && <circle cx={item.x} cy="5" r="4" fill={item.color} opacity="0.4" />}
              {item.shape === "hive" && <polygon points={`${item.x - 4},3 ${item.x},0 ${item.x + 4},3 ${item.x + 4},8 ${item.x - 4},8`} fill={item.color} opacity="0.5" />}
              <text x={item.x + 12} y="8" fontSize="7" className="fill-gray-500 dark:fill-slate-400">{item.label}</text>
            </g>
          ))}
        </g>

        {/* Action items — bottom */}
        <g transform="translate(260, 375)">
          {[
            { label: "Plant native species", icon: "🌻" },
            { label: "Reduce pesticides", icon: "🚫" },
            { label: "Create nesting sites", icon: "🏠" },
            { label: "Connect habitats", icon: "🔗" },
          ].map((action, i) => (
            <g key={i}>
              <text x={-180 + i * 120} y="0" textAnchor="middle" fontSize="10">{action.icon}</text>
              <text x={-180 + i * 120} y="14" textAnchor="middle" fontSize="7" fill="#fcd34d">{action.label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
