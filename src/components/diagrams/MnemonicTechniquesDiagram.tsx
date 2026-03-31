export default function MnemonicTechniquesDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Four memory techniques: chunking, method of loci, storytelling, and spaced repetition"
      >
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-violet-600 dark:fill-violet-400">
          Memory Techniques That Actually Work
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Ancient storytellers like Yaruini used these without knowing the science
        </text>

        {/* 4 technique cards */}
        {[
          {
            x: 110, y: 90, title: 'Chunking',
            desc: 'Group items into\nsmaller clusters',
            example: '9-7-1-1-2-0-0-1 \u2192\n9/11/2001',
            icon: '\u{1F4E6}', color: '#3b82f6', darkColor: '#60a5fa',
            bgClass: 'fill-blue-50 dark:fill-blue-950',
          },
          {
            x: 420, y: 90, title: 'Method of Loci',
            desc: 'Place items along\na familiar route',
            example: 'Walk through your\nhouse, placing one\nfact in each room',
            icon: '\u{1F3E0}', color: '#8b5cf6', darkColor: '#a78bfa',
            bgClass: 'fill-violet-50 dark:fill-violet-950',
          },
          {
            x: 110, y: 280, title: 'Narrative Linking',
            desc: 'Weave facts into\na story with characters',
            example: 'Yaruini\'s stories\nconnect dates, names,\nand places into plots',
            icon: '\u{1F4D6}', color: '#ec4899', darkColor: '#f472b6',
            bgClass: 'fill-pink-50 dark:fill-pink-950',
          },
          {
            x: 420, y: 280, title: 'Spaced Repetition',
            desc: 'Review at growing\nintervals: 1d, 3d, 1w, 1m',
            example: 'Each review resets\nthe forgetting curve\nand makes memory last',
            icon: '\u{1F504}', color: '#22c55e', darkColor: '#4ade80',
            bgClass: 'fill-green-50 dark:fill-green-950',
          },
        ].map((t) => (
          <g key={t.title}>
            <rect x={t.x - 80} y={t.y} width="310" height="160" rx="12" className={t.bgClass} stroke={t.color} strokeWidth="1.5" />
            <text x={t.x + 75} y={t.y + 28} textAnchor="middle" fontSize="14" fontWeight="700" fill={t.color}>
              <tspan className="dark:hidden">{t.title}</tspan>
            </text>
            <text x={t.x + 75} y={t.y + 28} textAnchor="middle" fontSize="14" fontWeight="700" fill={t.darkColor}>
              <tspan className="hidden dark:inline">{t.title}</tspan>
            </text>
            <text x={t.x - 55} y={t.y + 30} fontSize="22">{t.icon}</text>
            {t.desc.split('\n').map((line, i) => (
              <text key={i} x={t.x + 75} y={t.y + 52 + i * 16} textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
                {line}
              </text>
            ))}
            <rect x={t.x - 60} y={t.y + 90} width="270" height="55" rx="6" fill={t.color} opacity="0.1" />
            <text x={t.x + 75} y={t.y + 106} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">
              Example:
            </text>
            {t.example.split('\n').map((line, i) => (
              <text key={`e${i}`} x={t.x + 75} y={t.y + 120 + i * 14} textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
                {line}
              </text>
            ))}
          </g>
        ))}

        {/* Bottom insight */}
        <rect x="120" y="460" width="540" height="1" rx="0" fill="none" />
      </svg>
    </div>
  );
}
