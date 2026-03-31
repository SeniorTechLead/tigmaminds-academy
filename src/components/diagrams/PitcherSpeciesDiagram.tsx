export default function PitcherSpeciesDiagram() {
  const species = [
    { name: 'Nepenthes khasiana', region: 'Khasi Hills, Meghalaya', status: 'Endangered', statusColor: '#f87171', pitcherH: 90, color: '#22c55e', detail: 'Only Nepenthes native to India' },
    { name: 'N. mirabilis', region: 'Southeast Asia (widespread)', status: 'Least Concern', statusColor: '#86efac', pitcherH: 65, color: '#16a34a', detail: 'Most widespread tropical pitcher' },
    { name: 'N. rajah', region: 'Borneo (Mt. Kinabalu)', status: 'Endangered', statusColor: '#f87171', pitcherH: 120, color: '#15803d', detail: 'Largest pitcher — holds 3.5 L' },
    { name: 'N. lowii', region: 'Borneo highlands', status: 'Least Concern', statusColor: '#86efac', pitcherH: 55, color: '#4ade80', detail: 'Catches tree shrew droppings!' },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 560 480" className="w-full max-w-lg mx-auto" role="img" aria-label="Diagram showing Nepenthes species diversity with focus on Nepenthes khasiana of Meghalaya">
        <rect width="560" height="480" rx="12" className="fill-white dark:fill-slate-900" />
        <text x="280" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#86efac">Nepenthes of Meghalaya and Beyond</text>
        <text x="280" y="46" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Pitcher plant species diversity — Meghalaya hosts India’s only native Nepenthes</text>

        {/* Species comparison */}
        {species.map((sp, i) => {
          const xOff = 30 + i * 135;
          const baseY = 240;
          return (
            <g key={i} transform={`translate(${xOff}, 60)`}>
              {/* Pitcher shape */}
              <g transform={`translate(50, ${baseY - sp.pitcherH})`}>
                {/* Lid */}
                <ellipse cx="0" cy="0" rx="18" ry="8" fill={sp.color} opacity="0.6" stroke={sp.color} strokeWidth="1" />
                {/* Body */}
                <path d={`M -15,5 Q -20,${sp.pitcherH * 0.4} -18,${sp.pitcherH * 0.7} Q -15,${sp.pitcherH} 0,${sp.pitcherH + 5} Q 15,${sp.pitcherH} 18,${sp.pitcherH * 0.7} Q 20,${sp.pitcherH * 0.4} 15,5`} fill={sp.color} opacity="0.3" stroke={sp.color} strokeWidth="1.5" />
                {/* Peristome rim */}
                <ellipse cx="0" cy="5" rx="15" ry="5" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                {/* Fluid level */}
                <path d={`M -14,${sp.pitcherH * 0.6} Q 0,${sp.pitcherH * 0.55} 14,${sp.pitcherH * 0.6} Q 15,${sp.pitcherH * 0.85} 0,${sp.pitcherH + 3} Q -15,${sp.pitcherH * 0.85} -14,${sp.pitcherH * 0.6}`} fill="#365314" opacity="0.4" />
              </g>

              {/* Species name */}
              <text x="50" y={baseY + 20} textAnchor="middle" fontSize="9" fontWeight="bold" fontStyle="italic" fill={sp.color}>{sp.name}</text>
              {/* Region */}
              <text x="50" y={baseY + 34} textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">{sp.region}</text>
              {/* Status badge */}
              <rect x="15" y={baseY + 40} width="70" height="16" rx="4" fill={sp.statusColor} opacity="0.15" stroke={sp.statusColor} strokeWidth="0.8" />
              <text x="50" y={baseY + 52} textAnchor="middle" fontSize="7" fontWeight="bold" fill={sp.statusColor}>{sp.status}</text>
              {/* Detail */}
              <text x="50" y={baseY + 70} textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">{sp.detail}</text>

              {/* Height label */}
              <line x1="75" y1={baseY - sp.pitcherH} x2="75" y2={baseY + 5} stroke={sp.color} strokeWidth="0.8" strokeDasharray="2,2" opacity="0.5" />
              <text x="80" y={baseY - sp.pitcherH / 2} fontSize="7" fill={sp.color}>{Math.round(sp.pitcherH * 0.4)}cm</text>
            </g>
          );
        })}

        {/* Highlight box for N. khasiana */}
        <rect x="15" y="55" width="145" height="290" rx="8" fill="none" stroke="#86efac" strokeWidth="2" strokeDasharray="4,3" />
        <text x="87" y="350" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#86efac">★ India’s only native species</text>

        {/* Map inset of Meghalaya */}
        <g transform="translate(280, 380)">
          <rect x="-250" y="-10" width="500" height="90" rx="8" fill="#14532d" opacity="0.4" stroke="#22c55e" strokeWidth="1" />
          <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#86efac">Why Meghalaya?</text>
          <text x="0" y="24" textAnchor="middle" fontSize="9" className="fill-gray-600 dark:fill-slate-300">Wettest place on Earth (Mawsynram: 11,871 mm/year) → extreme nutrient leaching</text>
          <text x="0" y="38" textAnchor="middle" fontSize="9" className="fill-gray-600 dark:fill-slate-300">Acidic, rocky laterite soils → very low nitrogen and phosphorus</text>
          <text x="0" y="52" textAnchor="middle" fontSize="9" className="fill-gray-600 dark:fill-slate-300">Subtropical climate (1,000–1,800 m altitude) → ideal for Nepenthes growth</text>
          <text x="0" y="68" textAnchor="middle" fontSize="9" fill="#fbbf24">N. khasiana is listed under Indian Wildlife Protection Act, Schedule VI</text>
        </g>
      </svg>
    </div>
  );
}
