export default function MemoryFormationDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Memory formation pathway: sensory input to hippocampus to long-term storage in neocortex"
      >
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-purple-600 dark:fill-purple-400">
          How Memories Form: The Hippocampus Gateway
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Every new memory passes through the hippocampus before becoming permanent
        </text>

        {/* Step 1: Sensory Input */}
        <g transform="translate(100, 120)">
          <rect x="-60" y="-30" width="120" height="60" rx="10" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" strokeWidth="2" />
          <text x="0" y="-8" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">
            Sensory
          </text>
          <text x="0" y="10" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">
            Input
          </text>
          <text x="0" y="50" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            sights, sounds, smells
          </text>
        </g>

        {/* Arrow */}
        <line x1="165" y1="120" x2="225" y2="120" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#mem-arrow)" />
        <text x="195" y="108" textAnchor="middle" fontSize="10" className="fill-purple-500 dark:fill-purple-400">
          seconds
        </text>

        {/* Step 2: Short-term memory */}
        <g transform="translate(310, 120)">
          <rect x="-75" y="-30" width="150" height="60" rx="10" fill="#8b5cf6" opacity="0.2" stroke="#8b5cf6" strokeWidth="2" />
          <text x="0" y="-8" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-violet-700 dark:fill-violet-300">
            Short-term
          </text>
          <text x="0" y="10" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-violet-700 dark:fill-violet-300">
            Memory
          </text>
          <text x="0" y="50" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            holds ~7 items for ~30 sec
          </text>
        </g>

        {/* Arrow */}
        <line x1="390" y1="120" x2="455" y2="120" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#mem-arrow)" />

        {/* Step 3: Hippocampus */}
        <g transform="translate(545, 120)">
          <ellipse cx="0" cy="0" rx="85" ry="40" fill="#a855f7" opacity="0.25" stroke="#a855f7" strokeWidth="2.5" />
          <text x="0" y="-8" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-purple-700 dark:fill-purple-300">
            Hippocampus
          </text>
          <text x="0" y="10" textAnchor="middle" fontSize="10" className="fill-purple-600 dark:fill-purple-400">
            (the gateway)
          </text>
          <text x="0" y="60" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            encodes & replays during sleep
          </text>
        </g>

        {/* Arrow down */}
        <line x1="545" y1="165" x2="545" y2="220" stroke="#a855f7" strokeWidth="2" markerEnd="url(#mem-arrow)" />
        <text x="570" y="200" fontSize="10" className="fill-purple-500 dark:fill-purple-400">
          consolidation
        </text>
        <text x="570" y="215" fontSize="10" className="fill-purple-500 dark:fill-purple-400">
          (during sleep)
        </text>

        {/* Step 4: Long-term memory */}
        <g transform="translate(545, 270)">
          <rect x="-100" y="-30" width="200" height="60" rx="12" fill="#6d28d9" opacity="0.2" stroke="#6d28d9" strokeWidth="2.5" />
          <text x="0" y="-6" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-purple-700 dark:fill-purple-300">
            Long-term Memory
          </text>
          <text x="0" y="14" textAnchor="middle" fontSize="11" className="fill-purple-600 dark:fill-purple-400">
            (neocortex \u2014 permanent storage)
          </text>
          <text x="0" y="52" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            can last a lifetime
          </text>
        </g>

        {/* Failure path */}
        <g>
          <line x1="310" y1="155" x2="310" y2="270" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1="310" y1="270" x2="280" y2="270" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#mem-arrow-red)" />
          <text x="180" y="275" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-red-500 dark:fill-red-400">
            Forgotten!
          </text>
          <text x="180" y="292" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            (if not rehearsed or
          </text>
          <text x="180" y="306" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            emotionally tagged)
          </text>
        </g>

        <defs>
          <marker id="mem-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#8b5cf6" />
          </marker>
          <marker id="mem-arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Key insight */}
        <rect x="100" y="360" width="580" height="80" rx="10" className="fill-purple-50 dark:fill-purple-950" stroke="#a855f7" strokeWidth="1.5" />
        <text x="390" y="385" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-purple-700 dark:fill-purple-300">
          Yaruini's secret: repeated storytelling + emotion
        </text>
        <text x="390" y="405" textAnchor="middle" fontSize="11" className="fill-purple-600 dark:fill-purple-400">
          Each retelling reactivates the hippocampus, strengthening the neural pathway.
        </text>
        <text x="390" y="422" textAnchor="middle" fontSize="11" className="fill-purple-600 dark:fill-purple-400">
          Emotional stories activate the amygdala, which tells the hippocampus: "Save this!"
        </text>
      </svg>
    </div>
  );
}
