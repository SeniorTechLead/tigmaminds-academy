/**
 * MugaSilkEndemicDiagram — Why muga silk can only be produced in Assam.
 * Shows the specific ecological requirements of Antheraea assamensis:
 * host trees, climate, humidity, and why transplanting fails.
 */

export default function MugaSilkEndemicDiagram() {
  const gold = '#C8962E';
  const goldLight = '#E8B84B';
  const green = '#4CAF50';
  const waterBlue = '#5C9CE6';
  const warmRed = '#E57373';

  return (
    <svg
      viewBox="0 0 640 400"
      className="w-full max-w-2xl mx-auto"
      role="img"
      aria-label="Diagram showing why muga silk production is endemic to Assam, including host tree requirements, climate conditions, and failed transplanting attempts"
    >
      <rect width="640" height="400" rx="8" className="fill-[#fafaf8] dark:fill-[#1a1a2e]" />

      <text x="320" y="24" fontSize="13" fontWeight="700" textAnchor="middle" className="fill-gray-800 dark:fill-gray-100">
        The Only Golden Silk on Earth: Why It Cannot Be Farmed Elsewhere
      </text>

      {/* === Central: Map of Assam (simplified) === */}
      <g>
        {/* Simplified Assam outline */}
        <path
          d="M240,80 Q260,65 300,70 Q340,60 370,72 Q400,78 410,95 Q415,110 400,120 Q380,130 350,125 Q320,135 290,130 Q260,135 245,120 Q230,105 240,80Z"
          fill={goldLight}
          opacity="0.15"
          stroke={gold}
          strokeWidth="1.5"
        />
        <text x="320" y="102" fontSize="11" fontWeight="700" textAnchor="middle" fill={gold}>ASSAM</text>
        <text x="320" y="115" fontSize="7" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">
          Brahmaputra Valley
        </text>

        {/* Dots for key silk districts */}
        {[
          { x: 275, y: 90, name: 'Sualkuchi' },
          { x: 340, y: 95, name: 'Jorhat' },
          { x: 370, y: 88, name: 'Dibrugarh' },
        ].map((d, i) => (
          <g key={`dist-${i}`}>
            <circle cx={d.x} cy={d.y} r="3" fill={gold} />
            <text x={d.x} y={d.y + 12} fontSize="6" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">{d.name}</text>
          </g>
        ))}
      </g>

      {/* === Four requirement boxes === */}

      {/* Box 1: Host trees */}
      <g>
        <rect x="30" y="155" width="135" height="110" rx="6" className="fill-green-50 dark:fill-green-900/10" stroke={green} strokeWidth="1" />
        <text x="97" y="173" fontSize="9" fontWeight="700" textAnchor="middle" fill={green}>Host Trees</text>

        {/* Tree icons */}
        <g>
          {/* Som tree */}
          <line x1="60" y1="220" x2="60" y2="200" stroke="#8D6E63" strokeWidth="2" />
          <ellipse cx="60" cy="195" rx="15" ry="10" fill={green} opacity="0.5" />
          <text x="60" y="232" fontSize="6.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">Som</text>
          <text x="60" y="240" fontSize="5" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontStyle="italic">Persea bombycina</text>

          {/* Sualu tree */}
          <line x1="120" y1="220" x2="120" y2="200" stroke="#8D6E63" strokeWidth="2" />
          <ellipse cx="120" cy="195" rx="15" ry="10" fill={green} opacity="0.5" />
          <text x="120" y="232" fontSize="6.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">Sualu</text>
          <text x="120" y="240" fontSize="5" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontStyle="italic">Litsea monopetala</text>
        </g>

        <text x="97" y="256" fontSize="6.5" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">
          Leaves provide tryptophan
        </text>
      </g>

      {/* Box 2: Climate */}
      <g>
        <rect x="180" y="155" width="135" height="110" rx="6" className="fill-blue-50 dark:fill-blue-900/10" stroke={waterBlue} strokeWidth="1" />
        <text x="247" y="173" fontSize="9" fontWeight="700" textAnchor="middle" fill={waterBlue}>Climate</text>

        {/* Thermometer icon */}
        <rect x="205" y="188" width="6" height="30" rx="3" fill="none" stroke={warmRed} strokeWidth="1" />
        <rect x="206" y="200" width="4" height="17" rx="2" fill={warmRed} opacity="0.5" />
        <circle cx="208" cy="222" r="5" fill={warmRed} opacity="0.5" />
        <text x="220" y="205" fontSize="7" className="fill-gray-600 dark:fill-gray-300">25-33 C</text>
        <text x="220" y="215" fontSize="6" className="fill-gray-400 dark:fill-gray-500">(warm, never frost)</text>

        {/* Rain drop */}
        <path d="M260,195 Q265,185 270,195 Q265,200 260,195" fill={waterBlue} opacity="0.5" />
        <text x="260" y="235" fontSize="7" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">1500-2500mm</text>
        <text x="260" y="245" fontSize="6" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500">monsoon rainfall</text>
      </g>

      {/* Box 3: Humidity */}
      <g>
        <rect x="330" y="155" width="135" height="110" rx="6" className="fill-cyan-50 dark:fill-cyan-900/10" stroke="#26C6DA" strokeWidth="1" />
        <text x="397" y="173" fontSize="9" fontWeight="700" textAnchor="middle" fill="#00ACC1">Humidity</text>

        <text x="397" y="200" fontSize="22" textAnchor="middle" className="fill-cyan-400 dark:fill-cyan-500" fontWeight="700">
          80%+
        </text>
        <text x="397" y="216" fontSize="7" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
          relative humidity
        </text>
        <text x="397" y="228" fontSize="6.5" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">
          Brahmaputra valley stays
        </text>
        <text x="397" y="238" fontSize="6.5" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">
          humid year-round
        </text>
        <text x="397" y="250" fontSize="6.5" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">
          Critical for larval survival
        </text>
      </g>

      {/* Box 4: Semi-wild rearing */}
      <g>
        <rect x="480" y="155" width="135" height="110" rx="6" className="fill-amber-50 dark:fill-amber-900/10" stroke={gold} strokeWidth="1" />
        <text x="547" y="173" fontSize="9" fontWeight="700" textAnchor="middle" fill={gold}>Semi-wild Rearing</text>

        {/* Outdoor tree with caterpillar */}
        <line x1="530" y1="240" x2="530" y2="205" stroke="#8D6E63" strokeWidth="3" />
        <ellipse cx="530" cy="198" rx="22" ry="14" fill={green} opacity="0.3" />
        {/* Tiny caterpillars on tree */}
        {[515, 525, 540].map((x, i) => (
          <ellipse key={`cat-${i}`} cx={x} cy={196 + i * 3} rx="4" ry="2" fill="#8BC34A" stroke="#689F38" strokeWidth="0.5" />
        ))}

        <text x="547" y="252" fontSize="6.5" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">
          Not domesticated like
        </text>
        <text x="547" y="260" fontSize="6.5" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">
          mulberry silkworms
        </text>
      </g>

      {/* === Bottom: Why transplanting fails === */}
      <rect x="30" y="280" width="580" height="105" rx="6" className="fill-red-50 dark:fill-red-900/10" stroke={warmRed} strokeWidth="1" />

      <text x="320" y="300" fontSize="10" fontWeight="700" textAnchor="middle" fill={warmRed}>
        Why transplanting fails
      </text>

      {/* Three failure reasons */}
      {[
        { x: 100, icon: 'X', reason: 'Wrong trees', detail: 'Without som/sualu leaves, caterpillars\ndie or produce white silk (no gold)' },
        { x: 310, icon: 'X', reason: 'Wrong climate', detail: 'Too dry, too cold, or wrong seasonal\npattern kills larvae or stunts growth' },
        { x: 520, icon: 'X', reason: 'Wrong ecology', detail: 'Predators, parasites, and diseases differ;\ncaterpillars lack natural defenses' },
      ].map((f, i) => (
        <g key={`fail-${i}`}>
          <circle cx={f.x} cy={325} r="10" fill={warmRed} opacity="0.15" />
          <text x={f.x} y="329" fontSize="12" fontWeight="700" textAnchor="middle" fill={warmRed}>{f.icon}</text>
          <text x={f.x} y="345" fontSize="8" fontWeight="600" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200">{f.reason}</text>
          {f.detail.split('\n').map((line, j) => (
            <text key={`d-${i}-${j}`} x={f.x} y={356 + j * 10} fontSize="7" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">{line}</text>
          ))}
        </g>
      ))}
    </svg>
  );
}
