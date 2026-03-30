/**
 * MugaSilkNanostructureDiagram — Why muga silk glows gold.
 * Compares structural colour (pigment bonded into protein) vs surface dye.
 * Shows nanostructure light scattering and xanthurenic acid bonding.
 */

export default function MugaSilkNanostructureDiagram() {
  const gold = '#C8962E';
  const goldLight = '#E8B84B';
  const fadedGray = '#BDBDBD';
  const uvPurple = '#9B59B6';
  const lightYellow = '#FDE68A';

  return (
    <svg
      viewBox="0 0 640 400"
      className="w-full max-w-2xl mx-auto"
      role="img"
      aria-label="Diagram comparing structural colour in muga silk (xanthurenic acid bonded into fibroin) with surface dye that washes off"
    >
      <defs>
        <marker id="mn-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10z" className="fill-gray-500 dark:fill-gray-400" />
        </marker>
      </defs>

      <rect width="640" height="400" rx="8" className="fill-[#fafaf8] dark:fill-[#1a1a2e]" />

      {/* Title */}
      <text x="320" y="24" fontSize="13" fontWeight="700" textAnchor="middle" className="fill-gray-800 dark:fill-gray-100">
        Why Muga Silk Glows Gold (and Never Fades)
      </text>

      {/* === LEFT PANEL: Structural colour (Muga) === */}
      <text x="165" y="52" fontSize="11" fontWeight="600" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200">
        Muga silk: Structural colour
      </text>

      {/* Fibroin with bonded pigment molecules */}
      <rect x="45" y="70" width="240" height="120" rx="6" className="fill-amber-50 dark:fill-amber-900/20" stroke={gold} strokeWidth="1" />

      {/* Protein chain with embedded pigment */}
      {[0, 1, 2].map((row) => {
        const y = 88 + row * 35;
        return (
          <g key={`chain-${row}`}>
            {/* Chain backbone */}
            <path
              d={`M60,${y} ${Array.from({ length: 8 }, (_, j) =>
                `L${70 + j * 25},${y + (j % 2 === 0 ? -4 : 4)}`
              ).join(' ')}`}
              fill="none"
              stroke={goldLight}
              strokeWidth="2"
            />
            {/* Xanthurenic acid molecules bonded IN */}
            {[2, 5].map((pos) => (
              <g key={`xa-${row}-${pos}`}>
                <circle
                  cx={70 + pos * 25}
                  cy={y + (pos % 2 === 0 ? -4 : 4)}
                  r="5"
                  fill={gold}
                  stroke="#8B6914"
                  strokeWidth="1"
                />
                <text
                  x={70 + pos * 25}
                  y={y + (pos % 2 === 0 ? -4 : 4) + 3}
                  fontSize="5"
                  textAnchor="middle"
                  fill="white"
                  fontWeight="bold"
                >
                  XA
                </text>
              </g>
            ))}
          </g>
        );
      })}

      {/* Label inside */}
      <text x="165" y="196" fontSize="8" textAnchor="middle" fill={gold} fontWeight="600">
        Xanthurenic acid bonded INTO fibroin
      </text>

      {/* Incoming light */}
      <line x1="90" y1="215" x2="90" y2="240" stroke={lightYellow} strokeWidth="2" markerEnd="url(#mn-arrow)" />
      <text x="78" y="213" fontSize="7" fill="#B8860B">Light in</text>

      {/* Gold reflection */}
      <line x1="105" y1="240" x2="140" y2="220" stroke={gold} strokeWidth="2" />
      <line x1="110" y1="240" x2="150" y2="215" stroke={goldLight} strokeWidth="1.5" opacity="0.6" />
      <text x="148" y="218" fontSize="7" fill={gold} fontWeight="600">Gold out</text>

      {/* UV arrow bouncing off */}
      <line x1="200" y1="215" x2="200" y2="240" stroke={uvPurple} strokeWidth="1.5" markerEnd="url(#mn-arrow)" />
      <line x1="200" y1="240" x2="220" y2="250" stroke={uvPurple} strokeWidth="1" strokeDasharray="2,2" />
      <text x="225" y="253" fontSize="7" fill={uvPurple}>UV blocked</text>

      {/* Wash arrow */}
      <path d="M120,260 Q165,280 210,260" fill="none" stroke="#4FC3F7" strokeWidth="1.5" />
      <text x="165" y="290" fontSize="8" textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontWeight="600">
        Washing cannot remove it
      </text>
      <text x="165" y="300" fontSize="7" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">
        (pigment IS the protein)
      </text>

      {/* Divider */}
      <line x1="320" y1="48" x2="320" y2="380" strokeWidth="1" strokeDasharray="4,4" className="stroke-gray-300 dark:stroke-gray-600" />

      {/* === RIGHT PANEL: Surface dye (regular fabric) === */}
      <text x="475" y="52" fontSize="11" fontWeight="600" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200">
        Dyed fabric: Surface colour
      </text>

      {/* Fabric with surface dye */}
      <rect x="355" y="70" width="240" height="120" rx="6" className="fill-gray-50 dark:fill-gray-800" stroke={fadedGray} strokeWidth="1" />

      {/* Plain protein chains */}
      {[0, 1, 2].map((row) => {
        const y = 88 + row * 35;
        return (
          <g key={`plain-${row}`}>
            <path
              d={`M370,${y} ${Array.from({ length: 8 }, (_, j) =>
                `L${380 + j * 25},${y + (j % 2 === 0 ? -4 : 4)}`
              ).join(' ')}`}
              fill="none"
              stroke={fadedGray}
              strokeWidth="2"
            />
          </g>
        );
      })}

      {/* Surface dye dots sitting ON TOP */}
      {[
        [375, 68], [400, 65], [430, 68], [460, 66], [490, 68], [520, 65], [550, 68], [580, 66],
        [385, 190], [415, 192], [445, 190], [475, 191], [505, 190], [535, 192], [565, 190],
      ].map(([cx, cy], i) => (
        <circle
          key={`dye-${i}`}
          cx={cx}
          cy={cy}
          r="3"
          fill="#E74C3C"
          opacity="0.7"
        />
      ))}

      <text x="475" y="196" fontSize="8" textAnchor="middle" fill="#E74C3C" fontWeight="600">
        Dye molecules sit ON the surface
      </text>

      {/* UV arrow breaking dye */}
      <line x1="510" y1="215" x2="510" y2="240" stroke={uvPurple} strokeWidth="1.5" markerEnd="url(#mn-arrow)" />
      <text x="525" y="235" fontSize="7" fill={uvPurple}>UV breaks</text>
      <text x="525" y="243" fontSize="7" fill={uvPurple}>the dye bonds</text>

      {/* Wash removing dye */}
      <path d="M430,260 Q475,280 520,260" fill="none" stroke="#4FC3F7" strokeWidth="1.5" />
      {/* Dye particles floating away */}
      {[440, 465, 490, 515].map((x, i) => (
        <circle key={`wash-${i}`} cx={x} cy={275 + i * 3} r="2" fill="#E74C3C" opacity={0.5 - i * 0.1} />
      ))}
      <text x="475" y="290" fontSize="8" textAnchor="middle" fill="#E74C3C" fontWeight="600">
        Washing removes dye molecules
      </text>
      <text x="475" y="300" fontSize="7" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">
        (colour fades over time)
      </text>

      {/* === Bottom comparison === */}
      <rect x="45" y="320" width="240" height="55" rx="6" fill={gold} opacity="0.1" stroke={gold} strokeWidth="1" />
      <text x="165" y="340" fontSize="9" textAnchor="middle" fill={gold} fontWeight="700">
        Gets MORE lustrous with age
      </text>
      <text x="165" y="355" fontSize="7.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
        Sericin wears off, exposing more golden fibroin
      </text>
      <text x="165" y="367" fontSize="7.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
        Lasts 50+ years
      </text>

      <rect x="355" y="320" width="240" height="55" rx="6" className="fill-red-50 dark:fill-red-900/10" stroke="#E74C3C" strokeWidth="1" opacity="0.7" />
      <text x="475" y="340" fontSize="9" textAnchor="middle" fill="#E74C3C" fontWeight="700">
        Fades with every wash
      </text>
      <text x="475" y="355" fontSize="7.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
        UV breaks surface bonds, water carries dye away
      </text>
      <text x="475" y="367" fontSize="7.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
        Needs re-dyeing after a few years
      </text>
    </svg>
  );
}
