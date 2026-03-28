export default function NeuronDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 550 200" className="w-full max-w-xl mx-auto" role="img" aria-label="Labeled neuron diagram">
        <defs>
          <marker id="neuron-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-amber-500" />
          </marker>
        </defs>

        {/* Title */}
        <text x="275" y="16" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">Structure of a Neuron</text>

        {/* Dendrites */}
        <g className="stroke-purple-400 dark:stroke-purple-500" strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M 30,60 Q 45,65 60,70 Q 70,75 80,82" />
          <path d="M 25,80 Q 40,82 55,85 Q 68,88 80,92" />
          <path d="M 20,100 Q 40,100 60,100 Q 72,100 80,100" />
          <path d="M 25,120 Q 40,118 55,115 Q 68,112 80,108" />
          <path d="M 30,140 Q 45,135 60,128 Q 70,123 80,118" />
          {/* Secondary branches */}
          <path d="M 30,60 Q 20,50 15,40" />
          <path d="M 30,60 Q 22,55 18,55" />
          <path d="M 25,80 Q 15,75 10,68" />
          <path d="M 20,100 Q 10,95 5,92" />
          <path d="M 20,100 Q 12,105 5,108" />
          <path d="M 25,120 Q 15,125 10,132" />
          <path d="M 30,140 Q 22,148 15,155" />
          <path d="M 30,140 Q 20,145 15,142" />
        </g>
        <text x="35" y="170" textAnchor="middle" className="fill-purple-600 dark:fill-purple-300" fontSize="11" fontWeight="600">Dendrites</text>
        <text x="35" y="182" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(receive signals)</text>

        {/* Cell Body (Soma) */}
        <ellipse cx="110" cy="100" rx="32" ry="30" className="fill-purple-200 dark:fill-purple-800" stroke="#a855f7" strokeWidth="2" />
        {/* Nucleus */}
        <circle cx="110" cy="100" r="12" className="fill-purple-400 dark:fill-purple-600" stroke="#7e22ce" strokeWidth="1" />
        <text x="110" y="104" textAnchor="middle" className="fill-purple-900 dark:fill-purple-100" fontSize="10">Nucleus</text>
        <text x="110" y="145" textAnchor="middle" className="fill-purple-600 dark:fill-purple-300" fontSize="11" fontWeight="600">Cell Body</text>

        {/* Axon Hillock */}
        <path d="M 142,100 Q 155,100 168,100" className="stroke-purple-400" strokeWidth="3" fill="none" />

        {/* Axon with Myelin Sheath segments */}
        {/* Bare axon line underneath */}
        <line x1="142" y1="100" x2="460" y2="100" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="3" />

        {/* Myelin sheath segments */}
        {[175, 225, 275, 325, 375].map((x, i) => (
          <g key={i}>
            <rect x={x} y={85} width="38" height="30" rx="12" className="fill-amber-200 dark:fill-amber-800" stroke="#d97706" strokeWidth="1.5" />
          </g>
        ))}

        {/* Nodes of Ranvier (gaps) */}
        {[213, 263, 313, 363].map((x, i) => (
          <line key={i} x1={x} y1={92} x2={x + 12} y2={92} className="stroke-gray-500" strokeWidth="0.8" strokeDasharray="2,2" />
        ))}

        {/* Myelin sheath label */}
        <text x="295" y="78" textAnchor="middle" className="fill-amber-600 dark:fill-amber-300" fontSize="10" fontWeight="600">Myelin Sheath</text>
        <text x="295" y="130" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Node of Ranvier (gap)</text>
        <line x1="263" y1="125" x2="263" y2="115" className="stroke-gray-400" strokeWidth="0.8" />

        {/* Axon label */}
        <text x="295" y="145" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Axon (signal travels along)</text>

        {/* Axon Terminals */}
        <g>
          <path d="M 460,100 Q 470,85 485,75" className="stroke-green-500" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 460,100 Q 475,100 490,100" className="stroke-green-500" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 460,100 Q 470,115 485,125" className="stroke-green-500" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Terminal bulbs */}
          <circle cx="490" cy="72" r="6" className="fill-green-400 dark:fill-green-600" stroke="#16a34a" strokeWidth="1" />
          <circle cx="496" cy="100" r="6" className="fill-green-400 dark:fill-green-600" stroke="#16a34a" strokeWidth="1" />
          <circle cx="490" cy="128" r="6" className="fill-green-400 dark:fill-green-600" stroke="#16a34a" strokeWidth="1" />
        </g>
        <text x="505" y="75" className="fill-green-600 dark:fill-green-300" fontSize="10" fontWeight="600">Axon</text>
        <text x="505" y="87" className="fill-green-600 dark:fill-green-300" fontSize="10" fontWeight="600">Terminals</text>
        <text x="505" y="110" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(release</text>
        <text x="505" y="122" className="fill-gray-500 dark:fill-gray-400" fontSize="10">signals)</text>

        {/* Signal direction arrow */}
        <line x1="100" y1="35" x2="450" y2="35" className="stroke-amber-500" strokeWidth="2" markerEnd="url(#neuron-arrow)" />
        <text x="275" y="30" textAnchor="middle" className="fill-amber-600 dark:fill-amber-300" fontSize="11" fontWeight="600">Signal Direction →</text>
      </svg>
    </div>
  );
}
