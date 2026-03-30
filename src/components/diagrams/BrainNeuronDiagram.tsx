export default function BrainNeuronDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 340" className="w-full max-w-xl mx-auto" role="img" aria-label="How a neuron fires: electrical signal travels from dendrites to axon terminals">
        <style>{`
          @keyframes brain-pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          .brain-pulse-1 { animation: brain-pulse 2s ease-in-out infinite; }
          .brain-pulse-2 { animation: brain-pulse 2s ease-in-out 0.4s infinite; }
          .brain-pulse-3 { animation: brain-pulse 2s ease-in-out 0.8s infinite; }
          .brain-pulse-4 { animation: brain-pulse 2s ease-in-out 1.2s infinite; }
        `}</style>

        {/* Title */}
        <text x="260" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          How a Neuron Fires — Like a Chain of Dominoes
        </text>

        {/* Dendrites — input branches */}
        <g className="stroke-purple-400 dark:stroke-purple-500" strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M 30,90 Q 45,95 65,105" />
          <path d="M 25,110 Q 45,112 65,115" />
          <path d="M 20,130 Q 40,130 65,125" />
          <path d="M 25,150 Q 45,148 65,140" />
          <path d="M 35,165 Q 50,158 65,148" />
          <path d="M 30,90 Q 20,80 15,70" />
          <path d="M 25,150 Q 15,158 10,165" />
        </g>
        <text x="28" y="185" textAnchor="middle" className="fill-purple-600 dark:fill-purple-300" fontSize="10" fontWeight="bold">Dendrites</text>
        <text x="28" y="196" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(input)</text>

        {/* Cell body */}
        <ellipse cx="100" cy="128" rx="30" ry="28" className="fill-purple-200 dark:fill-purple-800" stroke="#a855f7" strokeWidth="2" />
        <circle cx="100" cy="128" r="11" className="fill-purple-400 dark:fill-purple-600" />
        <text x="100" y="170" textAnchor="middle" className="fill-purple-600 dark:fill-purple-300" fontSize="10" fontWeight="bold">Cell Body</text>

        {/* Axon line */}
        <line x1="130" y1="128" x2="390" y2="128" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="3" />

        {/* Signal pulses traveling along axon */}
        <circle cx="165" cy="128" r="6" className="fill-yellow-400 dark:fill-yellow-500 brain-pulse-1" />
        <circle cx="225" cy="128" r="6" className="fill-yellow-400 dark:fill-yellow-500 brain-pulse-2" />
        <circle cx="285" cy="128" r="6" className="fill-yellow-400 dark:fill-yellow-500 brain-pulse-3" />
        <circle cx="345" cy="128" r="6" className="fill-yellow-400 dark:fill-yellow-500 brain-pulse-4" />

        {/* Myelin sheath segments */}
        {[145, 205, 265, 325].map((x, i) => (
          <rect key={i} x={x} y={114} width="38" height="28" rx="10"
            className="fill-amber-100 dark:fill-amber-900/50" stroke="#d97706" strokeWidth="1" opacity="0.6" />
        ))}

        <text x="260" y="108" textAnchor="middle" className="fill-amber-600 dark:fill-amber-300" fontSize="10">Myelin sheath (insulation — speeds up signal)</text>
        <text x="260" y="165" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">Axon (the wire)</text>

        {/* Axon terminals */}
        <g>
          <path d="M 390,128 Q 405,112 420,105" className="stroke-green-500" strokeWidth="2.5" fill="none" />
          <path d="M 390,128 Q 410,128 425,128" className="stroke-green-500" strokeWidth="2.5" fill="none" />
          <path d="M 390,128 Q 405,144 420,152" className="stroke-green-500" strokeWidth="2.5" fill="none" />
          <circle cx="424" cy="102" r="6" className="fill-green-400 dark:fill-green-600" />
          <circle cx="430" cy="128" r="6" className="fill-green-400 dark:fill-green-600" />
          <circle cx="424" cy="155" r="6" className="fill-green-400 dark:fill-green-600" />
        </g>
        <text x="445" y="125" className="fill-green-600 dark:fill-green-300" fontSize="10" fontWeight="bold">Terminals</text>
        <text x="445" y="137" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(output)</text>

        {/* Arrow showing direction */}
        <text x="260" y="210" textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-300" fontSize="11" fontWeight="bold">
          ⚡ Signal direction →
        </text>

        {/* Analogy box */}
        <rect x="50" y="230" width="420" height="55" rx="6" className="fill-amber-50 dark:fill-amber-900/30" stroke="#d97706" strokeWidth="1" />
        <text x="260" y="248" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="10" fontWeight="bold">
          Analogy: A neuron is like a wire with a switch.
        </text>
        <text x="260" y="262" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10">
          Dendrites receive the signal → cell body decides &quot;fire or not&quot; →
        </text>
        <text x="260" y="276" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10">
          axon carries it at up to 120 m/s → terminals pass it to the next neuron.
        </text>
      </svg>
    </div>
  );
}
