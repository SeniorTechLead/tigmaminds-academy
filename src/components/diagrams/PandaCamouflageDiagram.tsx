export default function PandaCamouflageDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 580 420" className="w-full max-w-xl mx-auto" role="img" aria-label="Three types of animal camouflage: crypsis, disruptive coloration, and mimicry">
        <rect width="580" height="420" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="290" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#86efac">Three Types of Camouflage</text>

        {/* ── 1. Crypsis (Background Matching) ── */}
        <g transform="translate(15, 50)">
          <rect width="170" height="320" rx="8" fill="#365314" opacity="0.25" />
          <text x="85" y="24" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#86efac">Crypsis</text>
          <text x="85" y="40" textAnchor="middle" fontSize="10" fill="#a3e635">(Background Matching)</text>

          {/* Forest background strips */}
          {[60, 80, 100, 120, 140, 160].map((y, i) => (
            <rect key={`bark-${i}`} x={15 + (i % 3) * 50} y={y} width={40} height={12} rx={3}
              fill={i % 2 === 0 ? '#5c4033' : '#6b4c3b'} opacity={0.7} />
          ))}

          {/* Leaf litter */}
          {[180, 200, 220].map((y, i) => (
            <ellipse key={`leaf-${i}`} cx={40 + i * 35} cy={y} rx={18} ry={6}
              fill="#4d7c0f" opacity={0.5} transform={`rotate(${-15 + i * 20}, ${40 + i * 35}, ${y})`} />
          ))}

          {/* Moth blending into bark */}
          <g transform="translate(55, 120)">
            <ellipse cx="30" cy="0" rx="22" ry="10" fill="#5c4033" stroke="#7c6050" strokeWidth="1" />
            <line x1="10" y1="-2" x2="50" y2="-2" stroke="#7c6050" strokeWidth="0.5" opacity="0.6" />
            <line x1="15" y1="3" x2="45" y2="3" stroke="#7c6050" strokeWidth="0.5" opacity="0.6" />
            {/* Antennae */}
            <line x1="30" y1="-10" x2="22" y2="-18" stroke="#a08060" strokeWidth="1" />
            <line x1="30" y1="-10" x2="38" y2="-18" stroke="#a08060" strokeWidth="1" />
          </g>

          <text x="85" y="255" textAnchor="middle" fontSize="10" fill="#fde68a">Peppered moth</text>
          <text x="85" y="268" textAnchor="middle" fontSize="10" fill="#fde68a">matches tree bark</text>

          {/* Arrow pointing to hard-to-see moth */}
          <line x1="85" y1="240" x2="85" y2="138" stroke="#fde68a" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#camoArrow)" />

          <text x="85" y="290" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-gray-400">The animal’s colour</text>
          <text x="85" y="303" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-gray-400">matches its habitat</text>
        </g>

        {/* ── 2. Disruptive Coloration ── */}
        <g transform="translate(200, 50)">
          <rect width="170" height="320" rx="8" fill="#1e3a5f" opacity="0.25" />
          <text x="85" y="24" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#86efac">Disruptive</text>
          <text x="85" y="40" textAnchor="middle" fontSize="10" fill="#a3e635">(Outline Breaking)</text>

          {/* Zebra body */}
          <g transform="translate(25, 80)">
            <ellipse cx="60" cy="50" rx="50" ry="30" fill="#f5f5f5" />
            {/* Black stripes */}
            {[25, 40, 55, 70, 85].map((x, i) => (
              <rect key={`stripe-${i}`} x={x} y={22} width={8} height={56} rx={2}
                fill="#1a1a1a" transform={`rotate(${-5 + i * 3}, ${x + 4}, 50)`} />
            ))}
            {/* Head */}
            <ellipse cx="110" cy="35" rx="18" ry="14" fill="#f5f5f5" />
            <rect x="102" y="24" width="5" height="22" rx="1" fill="#1a1a1a" />
            <rect x="110" y="24" width="5" height="22" rx="1" fill="#1a1a1a" />
            {/* Eye */}
            <circle cx="118" cy="32" r="2.5" fill="#1a1a1a" />
            {/* Ears */}
            <ellipse cx="102" cy="22" rx="5" ry="8" fill="#e5e5e5" stroke="#1a1a1a" strokeWidth="1" />
            <ellipse cx="115" cy="20" rx="5" ry="8" fill="#e5e5e5" stroke="#1a1a1a" strokeWidth="1" />
            {/* Legs */}
            <rect x="25" y="78" width="10" height="30" rx="2" fill="#f5f5f5" />
            <rect x="30" y="80" width="4" height="26" rx="1" fill="#1a1a1a" />
            <rect x="85" y="78" width="10" height="30" rx="2" fill="#f5f5f5" />
            <rect x="90" y="80" width="4" height="26" rx="1" fill="#1a1a1a" />
          </g>

          {/* Explanation */}
          <text x="85" y="225" textAnchor="middle" fontSize="10" fill="#fde68a">Bold contrasting</text>
          <text x="85" y="238" textAnchor="middle" fontSize="10" fill="#fde68a">stripes break the</text>
          <text x="85" y="251" textAnchor="middle" fontSize="10" fill="#fde68a">body outline</text>

          <text x="85" y="278" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-gray-400">Predators struggle to</text>
          <text x="85" y="291" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-gray-400">see where one animal</text>
          <text x="85" y="304" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-gray-400">ends and another begins</text>
        </g>

        {/* ── 3. Mimicry ── */}
        <g transform="translate(385, 50)">
          <rect width="180" height="320" rx="8" fill="#4a1d1d" opacity="0.25" />
          <text x="90" y="24" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#86efac">Mimicry</text>
          <text x="90" y="40" textAnchor="middle" fontSize="10" fill="#a3e635">(Copying Another Species)</text>

          {/* Dangerous model: coral snake */}
          <g transform="translate(15, 60)">
            <text x="70" y="0" textAnchor="middle" fontSize="10" fill="#fca5a5">Dangerous (coral snake)</text>
            {/* Coral snake body bands */}
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <rect key={`coral-${i}`} x={10 + i * 20} y={10} width={18} height={20} rx={2}
                fill={i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#fbbf24' : '#1a1a1a'} />
            ))}
            <text x="70" y="46" textAnchor="middle" fontSize="10" fill="#fca5a5">Red-Yellow-Black</text>
          </g>

          {/* Harmless mimic: king snake */}
          <g transform="translate(15, 130)">
            <text x="70" y="0" textAnchor="middle" fontSize="10" fill="#86efac">Harmless (king snake)</text>
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <rect key={`king-${i}`} x={10 + i * 20} y={10} width={18} height={20} rx={2}
                fill={i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#1a1a1a' : '#fbbf24'} />
            ))}
            <text x="70" y="46" textAnchor="middle" fontSize="10" fill="#86efac">Red-Black-Yellow</text>
          </g>

          {/* Equals sign / similarity arrow */}
          <text x="90" y="120" textAnchor="middle" fontSize="18" fill="#fde68a">≈</text>

          <text x="90" y="210" textAnchor="middle" fontSize="10" fill="#fde68a">Harmless species</text>
          <text x="90" y="223" textAnchor="middle" fontSize="10" fill="#fde68a">copies a dangerous</text>
          <text x="90" y="236" textAnchor="middle" fontSize="10" fill="#fde68a">one’s warning colours</text>

          <text x="90" y="263" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-gray-400">Predators avoid both,</text>
          <text x="90" y="276" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-gray-400">protecting the mimic</text>
        </g>

        {/* Arrow marker */}
        <defs>
          <marker id="camoArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#fde68a" />
          </marker>
        </defs>

        {/* Bottom summary */}
        <rect x="30" y="385" width="520" height="24" rx="6" fill="#86efac" opacity="0.12" />
        <text x="290" y="402" textAnchor="middle" fontSize="11" fill="#86efac">
          All three types evolved through natural selection — better-hidden animals survive and reproduce more
        </text>
      </svg>
    </div>
  );
}
