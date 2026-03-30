export default function ArkEcosystemDiagram() {
  const systems = [
    { label: 'O₂ / CO₂', icon: '💨', x: 90, y: 70, color: '#60a5fa', detail: 'Ventilation slit' },
    { label: 'Fresh water', icon: '💧', x: 250, y: 70, color: '#22d3ee', detail: 'Rain collection' },
    { label: 'Food stores', icon: '🌾', x: 410, y: 70, color: '#fbbf24', detail: 'Grain, hay, seeds' },
    { label: 'Waste removal', icon: '♻', x: 170, y: 260, color: '#f87171', detail: 'Bilge & drains' },
    { label: 'Temperature', icon: '🌡', x: 330, y: 260, color: '#a78bfa', detail: 'Animal body heat' },
  ];
  return (
    <svg viewBox="0 0 500 320" className="w-full max-w-lg mx-auto">
      <text x="250" y="25" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">Closed Ecosystem: The Ark vs. the ISS</text>

      {/* Central ark icon */}
      <ellipse cx="250" cy="165" rx="60" ry="35" fill="#78350f" opacity="0.4" />
      <text x="250" y="160" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">ARK</text>
      <text x="250" y="175" textAnchor="middle" fill="#d1d5db" fontSize="9">Closed system</text>

      {/* System nodes */}
      {systems.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r="28" fill="none" stroke={s.color} strokeWidth="1.5" opacity="0.7" />
          <text x={s.x} y={s.y - 5} textAnchor="middle" fontSize="16">{s.icon}</text>
          <text x={s.x} y={s.y + 12} textAnchor="middle" fill={s.color} fontSize="9" fontWeight="bold">{s.label}</text>
          <text x={s.x} y={s.y + 42} textAnchor="middle" fill="#6b7280" fontSize="8">{s.detail}</text>
          {/* Lines to centre */}
          <line x1={s.x} y1={s.y + 28} x2="250" y2="165"
            stroke={s.color} strokeWidth="1" strokeDasharray="4 3" opacity="0.4"
            style={{ display: s.y < 165 ? undefined : 'none' }} />
          <line x1={s.x} y1={s.y - 28} x2="250" y2="165"
            stroke={s.color} strokeWidth="1" strokeDasharray="4 3" opacity="0.4"
            style={{ display: s.y >= 165 ? undefined : 'none' }} />
        </g>
      ))}

      {/* ISS comparison */}
      <rect x="20" y="295" width="460" height="20" rx="4" className="fill-gray-100 dark:fill-slate-800" />
      <text x="250" y="309" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">ISS: same 5 challenges — solved with CO₂ scrubbers, water recyclers, solar panels, and resupply missions</text>
    </svg>
  );
}
