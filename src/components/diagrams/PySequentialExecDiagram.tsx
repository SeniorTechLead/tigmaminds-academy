/**
 * Sequential execution: a program runs top to bottom, one line at a time.
 * Shows the order pointer moving down, and why using a variable before it is
 * defined throws a NameError.
 *
 * Used in the "How a Program Runs — Line by Line" section.
 */
export default function PySequentialExecDiagram() {
  const W = 720, H = 280;
  const good = ['mood = "calm"   # 1. store the word', 'print(mood)      # 2. print it'];
  const bad = ['print(mood)      # ERROR: not defined yet', 'mood = "calm"'];
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Python runs lines top to bottom. When a variable is defined before it is used the program works; reversing the order causes a NameError on line 1.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="32" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Top to bottom, one line at a time</text>

        {/* Good order */}
        <text x="40" y="68" fontSize="12" fontWeight="700" fill="#15803d" className="dark:fill-green-300">✓ Works</text>
        <rect x="40" y="80" width="300" height="90" rx="10" fill="#ffffff" stroke="#16a34a" strokeWidth="1.5" className="dark:fill-gray-800 dark:stroke-green-400" />
        {good.map((l, i) => (
          <text key={i} x="56" y={108 + i * 28} fontSize="11" fontFamily="monospace" fill="#0f172a" className="dark:fill-gray-100">{l}</text>
        ))}
        {/* down arrow */}
        <line x1="350" y1="95" x2="350" y2="155" stroke="#16a34a" strokeWidth="2" markerEnd="url(#pse-g)" />
        <text x="362" y="128" fontSize="10" fill="#15803d" className="dark:fill-green-300">runs in order</text>

        {/* Bad order */}
        <text x="420" y="68" fontSize="12" fontWeight="700" fill="#b91c1c" className="dark:fill-red-300">✗ NameError</text>
        <rect x="420" y="80" width="270" height="90" rx="10" fill="#ffffff" stroke="#dc2626" strokeWidth="1.5" className="dark:fill-gray-800 dark:stroke-red-400" />
        {bad.map((l, i) => (
          <text key={i} x="436" y={108 + i * 28} fontSize="11" fontFamily="monospace" fill={i === 0 ? '#b91c1c' : '#0f172a'} className={i === 0 ? 'dark:fill-red-300' : 'dark:fill-gray-100'}>{l}</text>
        ))}
        <text x="40" y="210" fontSize="11" fontStyle="italic" fill="#64748b" className="dark:fill-gray-400">Python can't use a name it hasn't seen yet — define before you use.</text>
        <defs><marker id="pse-g" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#16a34a" /></marker></defs>
      </svg>
    </div>
  );
}
