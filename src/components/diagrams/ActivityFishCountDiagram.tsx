/* ActivityFishCountDiagram – Offline activity: count & record fish at a local water body */

export default function ActivityFishCountDiagram() {
  return (
    <svg
      viewBox="0 0 592 310"
      className="w-full max-w-lg mx-auto my-6"
      role="img"
      aria-label="Activity: fish count survey at a local water body, recording species, count, water conditions, and plotting results"
    >
      {/* Title */}
      <text x="296" y="20" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
        Activity: Fish Count Survey
      </text>
      <text x="296" y="36" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
        Observe, record, and analyse like a real ecologist
      </text>

      {/* Step 1: Choose site */}
      <rect x="20" y="52" width="170" height="110" rx="6" className="fill-blue-50 dark:fill-blue-950" stroke="#3b82f6" strokeWidth="1" />
      <text x="105" y="70" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">Step 1: Choose a Site</text>
      {/* Simple pond/river icon */}
      <ellipse cx="105" cy="105" rx="45" ry="15" fill="#3b82f6" opacity="0.15" />
      <path d="M65,105 Q85,95 105,105 Q125,115 145,105" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" />
      <text x="105" y="135" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">Pond, river ghat, or</text>
      <text x="105" y="145" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">fish market (backup)</text>

      {/* Step 2: Record */}
      <rect x="210" y="52" width="170" height="110" rx="6" className="fill-green-50 dark:fill-green-950" stroke="#22c55e" strokeWidth="1" />
      <text x="295" y="70" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-green-600 dark:fill-green-400">Step 2: Record Data</text>
      {/* Mini data table */}
      <rect x="225" y="80" width="140" height="70" rx="3" className="fill-white dark:fill-gray-800" stroke="#d1d5db" strokeWidth="0.5" />
      <line x1="225" y1="94" x2="365" y2="94" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" />
      <line x1="280" y1="80" x2="280" y2="150" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" />
      <line x1="330" y1="80" x2="330" y2="150" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" />
      <text x="252" y="90" textAnchor="middle" fontSize="7" fontWeight="600" className="fill-gray-600 dark:fill-gray-300">Species</text>
      <text x="305" y="90" textAnchor="middle" fontSize="7" fontWeight="600" className="fill-gray-600 dark:fill-gray-300">Count</text>
      <text x="347" y="90" textAnchor="middle" fontSize="7" fontWeight="600" className="fill-gray-600 dark:fill-gray-300">Size</text>
      <text x="252" y="107" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">Rohu</text>
      <text x="305" y="107" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">||||  = 4</text>
      <text x="347" y="107" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">~20 cm</text>
      <text x="252" y="120" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">Catla</text>
      <text x="305" y="120" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">||  = 2</text>
      <text x="347" y="120" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">~30 cm</text>
      <text x="252" y="133" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">Puti</text>
      <text x="305" y="133" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">||||||| = 7</text>
      <text x="347" y="133" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">~8 cm</text>

      {/* Step 3: Water quality */}
      <rect x="400" y="52" width="170" height="110" rx="6" className="fill-amber-50 dark:fill-amber-950" stroke="#f59e0b" strokeWidth="1" />
      <text x="485" y="70" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">Step 3: Water Check</text>
      <text x="485" y="90" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">• Colour: clear / murky / green?</text>
      <text x="485" y="103" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">• Smell: none / earthy / foul?</text>
      <text x="485" y="116" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">• Flow: still / slow / fast?</text>
      <text x="485" y="129" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">• Trash visible? Yes / No</text>
      <text x="485" y="148" textAnchor="middle" fontSize="7" fontStyle="italic" className="fill-amber-600 dark:fill-amber-400">These are real water quality indicators!</text>

      {/* Step 4: Analyse */}
      <rect x="80" y="178" width="430" height="120" rx="6" className="fill-purple-50 dark:fill-purple-950" stroke="#a855f7" strokeWidth="1" />
      <text x="295" y="196" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-purple-600 dark:fill-purple-400">Step 4: Analyse &amp; Conclude</text>

      {/* Mini bar chart */}
      <rect x="110" y="210" width="140" height="75" rx="3" className="fill-white dark:fill-gray-800" stroke="#d1d5db" strokeWidth="0.5" />
      {[
        { label: 'Puti', h: 55, c: '#3b82f6' },
        { label: 'Rohu', h: 32, c: '#22c55e' },
        { label: 'Catla', h: 16, c: '#f59e0b' },
      ].map((b, i) => {
        const x = 130 + i * 35;
        return (
          <g key={i}>
            <rect x={x} y={285 - b.h} width="20" height={b.h} rx="2" fill={b.c} opacity="0.7" />
            <text x={x + 10} y={295} textAnchor="middle" fontSize="6" className="fill-gray-500 dark:fill-gray-400">{b.label}</text>
          </g>
        );
      })}
      <text x="180" y="220" textAnchor="middle" fontSize="7" fontWeight="600" className="fill-gray-500 dark:fill-gray-400">Draw a bar chart</text>

      {/* Questions to answer */}
      <text x="310" y="220" fontSize="8" fontWeight="600" className="fill-gray-600 dark:fill-gray-300">Answer these questions:</text>
      <text x="310" y="235" fontSize="8" className="fill-gray-600 dark:fill-gray-300">• Which species was most common? Why?</text>
      <text x="310" y="248" fontSize="8" className="fill-gray-600 dark:fill-gray-300">• Were big fish or small fish more common?</text>
      <text x="310" y="261" fontSize="8" className="fill-gray-600 dark:fill-gray-300">• Does water quality match fish diversity?</text>
      <text x="310" y="274" fontSize="8" className="fill-gray-600 dark:fill-gray-300">• Is this water body healthy or stressed?</text>
      <text x="310" y="290" fontSize="7" fontStyle="italic" className="fill-purple-600 dark:fill-purple-400">You just did a real ecological survey!</text>
    </svg>
  );
}
