/**
 * Underfit vs good fit vs overfit, three panels with the same scattered points
 * and a decision boundary that is too simple, just right, and too wiggly.
 *
 * Used in the "Overfitting — When Memorising Beats Learning" section.
 */
export default function MLOverfittingDiagram() {
  const W = 760, H = 320;
  const panels = [
    { x: 30, title: 'Underfit', sub: 'Too simple', boundary: 'M20,110 L200,90', color: '#64748b', verdict: 'misses the pattern' },
    { x: 270, title: 'Good fit', sub: 'Just right', boundary: 'M20,130 Q110,40 200,110', color: '#16a34a', verdict: 'learns the trend' },
    { x: 510, title: 'Overfit', sub: 'Memorised noise', boundary: 'M20,120 Q50,40 80,120 Q110,30 140,120 Q170,50 200,110', color: '#dc2626', verdict: 'fits every wiggle' },
  ];
  // shared blue/orange points (class A above-ish, class B below-ish)
  const ptsA = [[40, 70], [80, 60], [120, 75], [160, 55], [185, 70]];
  const ptsB = [[35, 140], [75, 150], [115, 135], [150, 150], [185, 140]];

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Three panels: an underfit boundary that is too simple, a good fit that follows the trend, and an overfit boundary that wiggles to chase every noisy point.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="30" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Too simple, just right, or memorising the noise</text>

        {panels.map((p, i) => (
          <g key={i} transform={`translate(${p.x}, 55)`}>
            <rect x="0" y="0" width="220" height="210" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
            <text x="110" y="26" textAnchor="middle" fontSize="13" fontWeight="700" fill={p.color} className="dark:fill-gray-100">{p.title}</text>
            <text x="110" y="43" textAnchor="middle" fontSize="10" fill="#64748b" className="dark:fill-gray-400">{p.sub}</text>
            {/* plot area offset */}
            <g transform="translate(10, 55)">
              {ptsA.map((pt, k) => <circle key={'a' + k} cx={pt[0]} cy={pt[1]} r="5" fill="#3b82f6" />)}
              {ptsB.map((pt, k) => <circle key={'b' + k} cx={pt[0]} cy={pt[1]} r="5" fill="#f97316" />)}
              <path d={p.boundary} fill="none" stroke={p.color} strokeWidth="3" />
            </g>
            <text x="110" y="200" textAnchor="middle" fontSize="10" fontStyle="italic" fill={p.color} className="dark:fill-gray-300">{p.verdict}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
