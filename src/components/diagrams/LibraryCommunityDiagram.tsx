export default function LibraryCommunityDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 480" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="How a community library app connects readers: search, borrow, review, recommend">
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#10b981">Building for Your Community: What a Library App Does</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Each feature solves a real problem Dipankar faced with his bamboo library</text>

        {/* Central hub */}
        <circle cx="390" cy="260" r="55" fill="#ecfdf5" stroke="#10b981" strokeWidth="2.5" className="dark:fill-emerald-950/30" />
        <text x="390" y="253" textAnchor="middle" fontSize="14" fontWeight="700" fill="#059669">Library</text>
        <text x="390" y="271" textAnchor="middle" fontSize="14" fontWeight="700" fill="#059669">App</text>

        {/* Feature nodes */}
        {[
          { x: 130, y: 130, label: 'Search & Browse', sub: 'Find any book by title,\nauthor, or genre', color: '#3b82f6', icon: '🔍' },
          { x: 650, y: 130, label: 'Borrow & Return', sub: 'Track who has which book\nand when it is due', color: '#f59e0b', icon: '📚' },
          { x: 130, y: 390, label: 'Reviews & Ratings', sub: 'Readers share opinions\nso others discover books', color: '#ec4899', icon: '⭐' },
          { x: 650, y: 390, label: 'Recommendations', sub: '"If you liked this,\ntry that" — based on data', color: '#8b5cf6', icon: '💡' },
        ].map((f, i) => (
          <g key={i}>
            <rect x={f.x - 85} y={f.y - 45} width="170" height="90" rx="10" fill="none" stroke={f.color} strokeWidth="2" />
            <circle cx={f.x} cy={f.y - 20} r="16" fill={f.color} opacity="0.15" />
            <text x={f.x} y={f.y - 14} textAnchor="middle" fontSize="16">{f.icon}</text>
            <text x={f.x} y={f.y + 8} textAnchor="middle" fontSize="12" fontWeight="700" fill={f.color}>{f.label}</text>
            {f.sub.split('\n').map((line, j) => (
              <text key={j} x={f.x} y={f.y + 22 + j * 14} textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{line}</text>
            ))}
            {/* Connecting line to center */}
            <line x1={f.x + (f.x < 390 ? 85 : -85)} y1={f.y} x2={390 + (f.x < 390 ? -55 : 55)} y2={260 + (f.y < 260 ? -30 : 30)} stroke={f.color} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
          </g>
        ))}

        {/* Problem → Solution mapping at bottom */}
        <rect x="60" y="440" width="660" height="30" rx="6" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="460" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">
          Dipankar's notebook + bamboo shelf = this app. Same logic, digital form.
        </text>
      </svg>
    </div>
  );
}
