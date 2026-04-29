/* HilsaOlfactoryDiagram – How fish smell their home river via chemical gradients */

export default function HilsaOlfactoryDiagram() {
  // Chemical gradient dots (more concentrated near source)
  const dots = Array.from({ length: 40 }, (_, i) => {
    const t = i / 39; // 0 = source, 1 = far away
    const x = 480 - t * 380;
    const baseY = 160;
    const spread = t * 40;
    const y = baseY + (Math.sin(i * 2.7) * spread);
    const opacity = 1 - t * 0.7;
    const r = 2.5 - t * 1.2;
    return { x, y, opacity: Math.max(opacity, 0.15), r: Math.max(r, 1) };
  });

  return (
    <>
      <style>{`
        @keyframes sniff {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.15); }
        }
        @keyframes drift {
          0% { transform: translateX(0); }
          100% { transform: translateX(-8px); opacity: 0.3; }
        }
      `}</style>

      <svg
        viewBox="0 0 592 320"
        className="w-full max-w-2xl mx-auto my-6"
        role="img"
        aria-label="Fish olfactory navigation: detecting chemical gradients to find home river"
      >
        {/* Title */}
        <text x="296" y="22" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
          The Nose That Smells Home
        </text>
        <text x="296" y="38" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
          Olfactory navigation via chemical gradients
        </text>

        {/* River background */}
        <rect x="40" y="70" width="510" height="180" rx="8" fill="#0c4a6e" opacity="0.1" />

        {/* Home river source */}
        <rect x="470" y="100" width="60" height="120" rx="6" fill="#16a34a" opacity="0.15" />
        <text x="500" y="118" textAnchor="middle" fontSize="9" fontWeight="600" className="fill-green-600 dark:fill-green-400">Home</text>
        <text x="500" y="130" textAnchor="middle" fontSize="9" fontWeight="600" className="fill-green-600 dark:fill-green-400">River</text>
        <text x="500" y="148" textAnchor="middle" fontSize="8" className="fill-green-600 dark:fill-green-400">Unique</text>
        <text x="500" y="158" textAnchor="middle" fontSize="8" className="fill-green-600 dark:fill-green-400">chemical</text>
        <text x="500" y="168" textAnchor="middle" fontSize="8" className="fill-green-600 dark:fill-green-400">signature</text>

        {/* Chemical gradient dots */}
        <g style={{ animation: 'drift 4s ease-in-out infinite alternate' }}>
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#22c55e" opacity={d.opacity} />
          ))}
        </g>

        {/* Gradient label */}
        <text x="280" y="85" textAnchor="middle" fontSize="9" fontStyle="italic" className="fill-gray-500 dark:fill-gray-400">
          Chemical concentration increases toward home river &#x2192;
        </text>

        {/* Fish with olfactory rosette highlighted */}
        <g transform="translate(100, 145)">
          {/* Fish body */}
          <ellipse cx="0" cy="0" rx="28" ry="12" fill="#3b82f6" opacity="0.7" />
          <path d="M26,-2 Q38,0 26,2Z" fill="#3b82f6" opacity="0.5" />
          <path d="M-28,0 L-38,-8 L-36,0 L-38,8Z" fill="#3b82f6" opacity="0.6" />
          {/* Eye */}
          <circle cx="18" cy="-3" r="2.5" fill="white" />
          <circle cx="19" cy="-3" r="1.2" fill="#1e293b" />

          {/* Olfactory rosette (nostrils) - highlighted */}
          <g style={{ animation: 'sniff 2s ease-in-out infinite' }}>
            <circle cx="28" cy="0" r="5" fill="#f59e0b" opacity="0.3" />
            <circle cx="26" cy="-1" r="1.5" fill="#f59e0b" />
            <circle cx="26" cy="2" r="1.5" fill="#f59e0b" />
          </g>
        </g>

        {/* Annotation: olfactory rosette */}
        <line x1="128" y1="140" x2="180" y2="100" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />
        <text x="185" y="96" fontSize="9" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">Olfactory rosette</text>
        <text x="185" y="107" fontSize="8" className="fill-gray-500 dark:fill-gray-400">Detects parts-per-billion</text>
        <text x="185" y="117" fontSize="8" className="fill-gray-500 dark:fill-gray-400">chemical differences</text>

        {/* Decision arrow showing gradient following */}
        <path d="M135,155 Q200,170 270,155 Q340,140 400,150" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,3" markerEnd="url(#arr-olf)" />
        <defs>
          <marker id="arr-olf" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10Z" fill="#f59e0b" />
          </marker>
        </defs>
        <text x="270" y="180" textAnchor="middle" fontSize="8" fontStyle="italic" className="fill-amber-600 dark:fill-amber-400">
          Follows increasing concentration
        </text>

        {/* Bottom: How it works */}
        <rect x="40" y="262" width="510" height="50" rx="6" fill="#1e293b" opacity="0.05" />
        <text x="296" y="278" textAnchor="middle" fontSize="9" fontWeight="600" className="fill-gray-600 dark:fill-gray-300">
          How it works
        </text>
        <text x="120" y="295" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400">1. Water enters nostrils</text>
        <text x="296" y="295" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400">2. Receptor cells detect amino acids</text>
        <text x="472" y="295" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400">3. Brain compares to imprinted memory</text>
      </svg>
    </>
  );
}
