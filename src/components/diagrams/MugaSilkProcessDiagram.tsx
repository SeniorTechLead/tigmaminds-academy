/**
 * MugaSilkProcessDiagram — From cocoon to cloth: the manufacturing process.
 * Shows: caterpillar -> cocoon -> boiling/reeling -> degumming -> weaving -> mekhela chador.
 */

export default function MugaSilkProcessDiagram() {
  const gold = '#C8962E';
  const goldLight = '#E8B84B';
  const waterBlue = '#5C9CE6';
  const sericin = '#9E9E9E';

  const stages = [
    { x: 20, label: '1. Caterpillar spins', sub: '~900m of thread' },
    { x: 130, label: '2. Cocoon', sub: 'Fibroin + sericin shell' },
    { x: 248, label: '3. Boil & reel', sub: 'Soften sericin, unwind' },
    { x: 370, label: '4. Degum', sub: 'Remove sericin coating' },
    { x: 485, label: '5. Weave', sub: 'Mekhela chador' },
  ];

  return (
    <svg
      viewBox="0 0 657 340"
      className="w-full max-w-2xl mx-auto"
      role="img"
      aria-label="Five-stage diagram of muga silk production: caterpillar spinning, cocoon formation, boiling and reeling, degumming, and weaving into fabric"
    >
      <defs>
        <marker id="mp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10z" className="fill-gray-400 dark:fill-gray-500" />
        </marker>
      </defs>

      <rect width="620" height="340" rx="8" className="fill-[#fafaf8] dark:fill-[#1a1a2e]" />

      <text x="310" y="22" fontSize="13" fontWeight="700" textAnchor="middle" className="fill-gray-800 dark:fill-gray-100">
        From Cocoon to Cloth
      </text>

      {/* === Stage 1: Caterpillar === */}
      <g>
        {/* Simplified caterpillar body */}
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse
            key={`seg-${i}`}
            cx={45 + i * 14}
            cy={80}
            rx={9}
            ry={8}
            fill="#8BC34A"
            stroke="#689F38"
            strokeWidth="0.8"
          />
        ))}
        {/* Head */}
        <circle cx={115} cy={80} r={7} fill="#A5D6A7" stroke="#689F38" strokeWidth="1" />
        {/* Thread coming out */}
        <path d="M122,80 Q128,70 118,60" fill="none" stroke={goldLight} strokeWidth="1" />
        {/* Som leaf */}
        <ellipse cx={55} cy={105} rx={20} ry={8} fill="#81C784" stroke="#4CAF50" strokeWidth="0.5" />
        <text x="55" y="108" fontSize="5.5" textAnchor="middle" fill="#2E7D32">som leaf</text>
      </g>

      {/* Arrow 1->2 */}
      <line x1="125" y1="80" x2="148" y2="80" stroke="#888" strokeWidth="1.2" markerEnd="url(#mp-arrow)" />

      {/* === Stage 2: Cocoon === */}
      <g>
        {/* Cocoon shape */}
        <ellipse cx="185" cy="80" rx="28" ry="20" fill={sericin} opacity="0.4" stroke={sericin} strokeWidth="1" />
        <ellipse cx="185" cy="80" rx="18" ry="13" fill={goldLight} opacity="0.5" stroke={gold} strokeWidth="0.8" />
        {/* Thread lines wrapping */}
        <path d="M160,68 Q185,58 210,68" fill="none" stroke={gold} strokeWidth="0.5" opacity="0.5" />
        <path d="M158,80 Q185,70 212,80" fill="none" stroke={gold} strokeWidth="0.5" opacity="0.5" />
        <path d="M160,92 Q185,102 210,92" fill="none" stroke={gold} strokeWidth="0.5" opacity="0.5" />
      </g>

      {/* Arrow 2->3 */}
      <line x1="218" y1="80" x2="250" y2="80" stroke="#888" strokeWidth="1.2" markerEnd="url(#mp-arrow)" />

      {/* === Stage 3: Boiling & reeling === */}
      <g>
        {/* Pot */}
        <path d="M260,60 L260,100 Q280,110 310,100 L310,60 Q295,50 270,50 Q255,55 260,60" fill="none" stroke="#666" strokeWidth="1.5" className="dark:stroke-gray-400" />
        {/* Water */}
        <rect x="262" y="65" width="46" height="33" rx="3" fill={waterBlue} opacity="0.2" />
        {/* Steam bubbles */}
        {[270, 285, 300].map((x, i) => (
          <circle key={`bub-${i}`} cx={x} cy={55 - i * 3} r="2" fill={waterBlue} opacity="0.3" />
        ))}
        {/* Reel */}
        <circle cx="340" cy="65" r="12" fill="none" stroke="#8D6E63" strokeWidth="2" />
        <circle cx="340" cy="65" r="3" fill="#8D6E63" />
        {/* Thread from pot to reel */}
        <path d="M308,70 Q320,60 328,65" fill="none" stroke={goldLight} strokeWidth="1" />
        {/* Thread on reel */}
        <path d="M332,58 Q340,53 348,58" fill="none" stroke={goldLight} strokeWidth="1" />
        <path d="M330,65 Q340,60 350,65" fill="none" stroke={goldLight} strokeWidth="0.8" />
      </g>

      {/* Arrow 3->4 */}
      <line x1="358" y1="80" x2="385" y2="80" stroke="#888" strokeWidth="1.2" markerEnd="url(#mp-arrow)" />

      {/* === Stage 4: Degumming === */}
      <g>
        {/* Before: fibre with sericin */}
        <rect x="395" y="60" width="60" height="8" rx="4" fill={sericin} opacity="0.5" stroke={sericin} strokeWidth="0.5" />
        <rect x="400" y="62" width="50" height="4" rx="2" fill={goldLight} />
        <text x="425" y="55" fontSize="6" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">Before</text>

        {/* Arrow down */}
        <line x1="425" y1="70" x2="425" y2="82" stroke="#888" strokeWidth="1" markerEnd="url(#mp-arrow)" />

        {/* After: pure golden fibre */}
        <rect x="400" y="88" width="50" height="5" rx="2.5" fill={goldLight} stroke={gold} strokeWidth="0.8" />
        <text x="425" y="102" fontSize="6" textAnchor="middle" fill={gold}>Pure fibroin</text>

        {/* Sericin particles floating away */}
        {[393, 398, 452, 458].map((x, i) => (
          <circle key={`sg-${i}`} cx={x} cy={85 + i * 2} r="1.5" fill={sericin} opacity={0.3} />
        ))}
      </g>

      {/* Arrow 4->5 */}
      <line x1="460" y1="80" x2="490" y2="80" stroke="#888" strokeWidth="1.2" markerEnd="url(#mp-arrow)" />

      {/* === Stage 5: Weaving === */}
      <g>
        {/* Loom grid pattern */}
        {Array.from({ length: 6 }, (_, i) => (
          <g key={`weave-${i}`}>
            {/* Warp (vertical) */}
            <line
              x1={505 + i * 12}
              y1="58"
              x2={505 + i * 12}
              y2="105"
              stroke={gold}
              strokeWidth="1.5"
              opacity="0.6"
            />
            {/* Weft (horizontal, alternating over/under) */}
            <line
              x1="498"
              y1={62 + i * 8}
              x2="575"
              y2={62 + i * 8}
              stroke={goldLight}
              strokeWidth="1.5"
              opacity="0.6"
            />
          </g>
        ))}
        {/* Shimmer */}
        <rect x="500" y="68" width="70" height="25" rx="2" fill="#F5D98A" opacity="0.15" />
      </g>

      {/* Stage labels */}
      {stages.map((s, i) => (
        <g key={`label-${i}`}>
          <text x={s.x + 50} y="130" fontSize="8.5" fontWeight="600" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200">
            {s.label}
          </text>
          <text x={s.x + 50} y="141" fontSize="7" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">
            {s.sub}
          </text>
        </g>
      ))}

      {/* === Bottom: Key facts bar === */}
      <rect x="30" y="165" width="560" height="1" className="fill-gray-200 dark:fill-gray-700" />

      {/* Fact 1 */}
      <text x="50" y="185" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-gray-200">Key numbers:</text>

      <circle cx="50" cy="206" r="3" fill={gold} />
      <text x="60" y="209" fontSize="8" className="fill-gray-600 dark:fill-gray-300">
        1 cocoon = 300-900 metres of continuous thread
      </text>

      <circle cx="50" cy="226" r="3" fill={gold} />
      <text x="60" y="229" fontSize="8" className="fill-gray-600 dark:fill-gray-300">
        Assam produces ~150 tonnes/year (the only place on Earth)
      </text>

      <circle cx="50" cy="246" r="3" fill={gold} />
      <text x="60" y="249" fontSize="8" className="fill-gray-600 dark:fill-gray-300">
        Semi-wild: caterpillars raised on outdoor trees, not in factories
      </text>

      <circle cx="50" cy="266" r="3" fill={gold} />
      <text x="60" y="269" fontSize="8" className="fill-gray-600 dark:fill-gray-300">
        Sericin removed by boiling in mild alkali (traditional: ash water)
      </text>

      <circle cx="50" cy="286" r="3" fill={gold} />
      <text x="60" y="289" fontSize="8" className="fill-gray-600 dark:fill-gray-300">
        Mekhela chador: traditional Assamese two-piece garment woven from muga
      </text>

      {/* Traditional note */}
      <rect x="30" y="305" width="560" height="28" rx="4" className="fill-amber-50 dark:fill-amber-900/10" stroke={gold} strokeWidth="0.5" />
      <text x="310" y="323" fontSize="8" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
        Sualkuchi, the &quot;Manchester of the East,&quot; is the traditional silk-weaving village of Assam. Weavers pass down loom patterns through generations.
      </text>
    </svg>
  );
}
