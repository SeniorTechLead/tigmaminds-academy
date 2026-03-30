export default function BrainSynapseDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 350" className="w-full max-w-xl mx-auto" role="img" aria-label="Synapse: neurotransmitters crossing the gap between two neurons">
        <style>{`
          @keyframes synapse-drop {
            0% { transform: translateY(0); opacity: 1; }
            80% { transform: translateY(50px); opacity: 1; }
            100% { transform: translateY(50px); opacity: 0; }
          }
          .synapse-nt-1 { animation: synapse-drop 2s ease-in infinite; }
          .synapse-nt-2 { animation: synapse-drop 2s ease-in 0.3s infinite; }
          .synapse-nt-3 { animation: synapse-drop 2s ease-in 0.6s infinite; }
          .synapse-nt-4 { animation: synapse-drop 2s ease-in 0.9s infinite; }
        `}</style>

        {/* Title */}
        <text x="260" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          The Synapse — Passing Notes Between Neurons
        </text>

        {/* Pre-synaptic neuron (sender) terminal */}
        <rect x="140" y="45" width="240" height="85" rx="20" className="fill-purple-100 dark:fill-purple-900/50" stroke="#a855f7" strokeWidth="2" />
        <text x="260" y="65" textAnchor="middle" className="fill-purple-700 dark:fill-purple-200" fontSize="11" fontWeight="bold">Sending Neuron (axon terminal)</text>

        {/* Vesicles with neurotransmitters */}
        {[185, 220, 255, 290, 325].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={95} r="12" className="fill-purple-200 dark:fill-purple-700" stroke="#7c3aed" strokeWidth="1" />
            {/* Small dots inside = neurotransmitters */}
            <circle cx={x - 3} cy={92} r="2" className="fill-yellow-400" />
            <circle cx={x + 3} cy={92} r="2" className="fill-yellow-400" />
            <circle cx={x} cy={98} r="2" className="fill-yellow-400" />
          </g>
        ))}
        <text x="370" y="98" className="fill-purple-600 dark:fill-purple-300" fontSize="10">Vesicles</text>

        {/* Synaptic cleft (the gap) */}
        <rect x="140" y="135" width="240" height="60" rx="4" className="fill-sky-50 dark:fill-sky-900/30" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 3" />
        <text x="115" y="168" textAnchor="end" className="fill-sky-600 dark:fill-sky-300" fontSize="10" fontWeight="bold">Synaptic</text>
        <text x="115" y="180" textAnchor="end" className="fill-sky-600 dark:fill-sky-300" fontSize="10" fontWeight="bold">Cleft (gap)</text>

        {/* Neurotransmitter molecules floating across */}
        <circle cx="195" cy="145" r="3" className="fill-yellow-500 synapse-nt-1" />
        <circle cx="230" cy="145" r="3" className="fill-yellow-500 synapse-nt-2" />
        <circle cx="265" cy="145" r="3" className="fill-yellow-500 synapse-nt-3" />
        <circle cx="300" cy="145" r="3" className="fill-yellow-500 synapse-nt-4" />

        {/* Post-synaptic neuron (receiver) */}
        <rect x="140" y="200" width="240" height="65" rx="20" className="fill-green-100 dark:fill-green-900/50" stroke="#22c55e" strokeWidth="2" />
        <text x="260" y="222" textAnchor="middle" className="fill-green-700 dark:fill-green-200" fontSize="11" fontWeight="bold">Receiving Neuron (dendrite)</text>

        {/* Receptor sites */}
        {[195, 230, 265, 300].map((x, i) => (
          <path key={i} d={`M ${x - 6},200 Q ${x},208 ${x + 6},200`}
            className="fill-green-300 dark:fill-green-600" stroke="#16a34a" strokeWidth="1.5" />
        ))}
        <text x="260" y="248" textAnchor="middle" className="fill-green-600 dark:fill-green-300" fontSize="10">Receptors (lock-and-key fit)</text>

        {/* Analogy box */}
        <rect x="50" y="280" width="420" height="55" rx="6" className="fill-amber-50 dark:fill-amber-900/30" stroke="#d97706" strokeWidth="1" />
        <text x="260" y="298" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="10" fontWeight="bold">
          Analogy: Like passing a note in class.
        </text>
        <text x="260" y="312" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10">
          The sender writes a chemical message, tosses it across the gap,
        </text>
        <text x="260" y="326" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10">
          and the receiver has the right &quot;mailbox&quot; (receptor) to catch it.
        </text>
      </svg>
    </div>
  );
}
