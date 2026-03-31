export default function ShinkansenBeakDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 720 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Biomimicry: Kingfisher beak shape inspired the Shinkansen bullet train nose design">
        <rect width="720" height="400" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="360" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Biomimicry: Beak \u2192 Bullet Train</text>
        <text x="360" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">The kingfisher\u2019s beak shape solved a high-speed rail problem</text>

        {/* LEFT: Kingfisher beak */}
        <text x="180" y="80" textAnchor="middle" fontSize="13" fontWeight="600" fill="#3b82f6">Kingfisher Beak</text>

        {/* Beak shape */}
        <path d="M80,160 Q180,120 280,160" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
        <path d="M80,160 Q180,200 280,160" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
        <path d="M80,160 Q180,120 280,160 Q180,200 80,160 Z" fill="#3b82f6" opacity="0.1" />
        {/* Tip */}
        <circle cx="80" cy="160" r="3" fill="#3b82f6" />
        {/* Eye */}
        <circle cx="250" cy="150" r="5" className="fill-gray-800 dark:fill-white" />

        {/* Water splash arrows */}
        <path d="M75,165 L60,180 M75,155 L60,140" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" />
        <text x="180" y="230" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Tapered shape: minimal splash</text>
        <text x="180" y="246" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">when diving into water</text>

        {/* Arrow */}
        <line x1="340" y1="160" x2="390" y2="160" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrGold)" />
        <text x="365" y="150" textAnchor="middle" fontSize="11" fontWeight="700" fill="#f59e0b">Inspired</text>
        <defs><marker id="arrGold" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#f59e0b" /></marker></defs>

        {/* RIGHT: Shinkansen nose */}
        <text x="540" y="80" textAnchor="middle" fontSize="13" fontWeight="600" fill="#ef4444">Shinkansen 500 Series</text>

        {/* Train nose shape */}
        <path d="M420,160 Q520,125 630,155" fill="none" stroke="#ef4444" strokeWidth="2.5" />
        <path d="M420,160 Q520,195 630,165" fill="none" stroke="#ef4444" strokeWidth="2.5" />
        <path d="M420,160 Q520,125 630,155 L630,165 Q520,195 420,160 Z" fill="#ef4444" opacity="0.1" />
        <rect x="630" y="140" width="50" height="40" rx="4" fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="1.5" />

        {/* Air flow arrows */}
        <path d="M415,155 L400,140 M415,165 L400,180" stroke="#fb923c" strokeWidth="1.5" opacity="0.6" />
        <text x="540" y="230" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Same taper: air flows smoothly</text>
        <text x="540" y="246" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">around the nose at 300 km/h</text>

        {/* Results box */}
        <rect x="100" y="275" width="520" height="90" rx="8" className="fill-green-50 dark:fill-green-900/10" stroke="#22c55e" strokeWidth="1" />
        <text x="360" y="298" textAnchor="middle" fontSize="12" fontWeight="700" fill="#22c55e">Results of the Biomimetic Redesign</text>
        {[
          'Sonic boom when exiting tunnels: eliminated',
          'Air resistance reduced by 30%',
          'Power consumption reduced by 15%',
        ].map((t, i) => (
          <text key={i} x="360" y={318 + i * 16} textAnchor="middle" fontSize="11" className="fill-gray-700 dark:fill-slate-200">\u2713 {t}</text>
        ))}

        {/* Footer */}
        <text x="360" y="386" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Nature solved this problem millions of years before engineers did</text>
      </svg>
    </div>
  );
}
