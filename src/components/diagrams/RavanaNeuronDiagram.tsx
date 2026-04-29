export default function RavanaNeuronDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 500 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram of a neuron showing dendrites, cell body, axon, myelin sheath, and synapse"
      >
        <defs>
          <marker id="rn-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#facc15" />
          </marker>
          <linearGradient id="rn-axon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="500" height="380" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          A Neuron — The Brain's Messenger Cell
        </text>

        {/* Dendrites — branching inputs */}
        {[
          'M 50,140 Q 70,120 90,150', 'M 40,170 Q 65,160 90,170',
          'M 45,200 Q 68,195 90,190', 'M 55,225 Q 72,215 90,205',
          'M 60,120 Q 78,130 90,145',
        ].map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
        ))}
        <text x="30" y="260" fontFamily="system-ui, sans-serif" fontSize="11"
          fontWeight="600" className="fill-red-500 dark:fill-red-400">Dendrites</text>
        <text x="30" y="273" fontFamily="system-ui, sans-serif" fontSize="9"
          className="fill-slate-500 dark:fill-slate-400">(receive signals)</text>

        {/* Cell Body (soma) */}
        <ellipse cx="120" cy="175" rx="35" ry="40"
          className="fill-purple-200 dark:fill-purple-800 stroke-purple-500 dark:stroke-purple-400" strokeWidth="2" />
        {/* Nucleus */}
        <circle cx="120" cy="175" r="14"
          className="fill-purple-400 dark:fill-purple-600" />
        <text x="120" y="179" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="8" className="fill-white">Nucleus</text>
        <text x="120" y="230" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-purple-600 dark:fill-purple-300">Cell Body</text>

        {/* Axon */}
        <line x1="155" y1="175" x2="370" y2="175" stroke="url(#rn-axon-grad)" strokeWidth="4" />

        {/* Myelin sheath segments */}
        {[185, 225, 265, 305, 345].map((x, i) => (
          <rect key={i} x={x - 15} y={162} width="25" height="26" rx="6"
            className="fill-blue-200 dark:fill-blue-800 stroke-blue-400 dark:stroke-blue-500" strokeWidth="1" opacity="0.8" />
        ))}
        <text x="265" y="155" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-blue-500 dark:fill-blue-300">Myelin Sheath (insulation — speeds signals)</text>

        <text x="265" y="205" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-indigo-500 dark:fill-indigo-300">Axon</text>
        <text x="265" y="218" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-slate-500 dark:fill-slate-400">(carries signal forward)</text>

        {/* Signal arrow */}
        <line x1="160" y1="140" x2="360" y2="140" stroke="#facc15" strokeWidth="2"
          strokeDasharray="6,4" markerEnd="url(#rn-arrow)" />
        <text x="260" y="134" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" fontWeight="600" className="fill-yellow-600 dark:fill-yellow-300">
          Electrical signal → 120 m/s
        </text>

        {/* Axon terminal / Synapse */}
        {[375, 390, 380].map((x, i) => (
          <circle key={i} cx={x} cy={[165, 175, 185][i]} r="8"
            className="fill-green-300 dark:fill-green-700 stroke-green-500" strokeWidth="1.5" />
        ))}
        <text x="415" y="160" fontFamily="system-ui, sans-serif" fontSize="10"
          fontWeight="600" className="fill-green-600 dark:fill-green-300">Synapse</text>
        <text x="415" y="173" fontFamily="system-ui, sans-serif" fontSize="9"
          className="fill-slate-500 dark:fill-slate-400">(chemical</text>
        <text x="415" y="185" fontFamily="system-ui, sans-serif" fontSize="9"
          className="fill-slate-500 dark:fill-slate-400">handoff)</text>

        {/* Neurotransmitter dots */}
        {[160, 170, 180].map((y, i) => (
          <circle key={i} cx={[400, 405, 402][i]} cy={y} r="2.5"
            className="fill-yellow-400 dark:fill-yellow-500" />
        ))}

        {/* Bottom: Ravana metaphor */}
        <rect x="30" y="300" width="440" height="60" rx="8"
          className="fill-amber-50 dark:fill-amber-900/30 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="250" y="320" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-200">
          Ravana's Ten Heads = Ten Thoughts?
        </text>
        <text x="250" y="338" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Your brain has ~86 billion neurons, but they share one bottleneck:
        </text>
        <text x="250" y="352" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-purple-600 dark:fill-purple-300">
          conscious attention can focus on only ONE thing at a time.
        </text>

        {/* Legend */}
        <circle cx="20" cy="310" r="4" className="fill-red-400" />
        <text x="30" y="314" fontFamily="system-ui, sans-serif" fontSize="8" className="fill-slate-500 dark:fill-slate-400">Input</text>
        <circle cx="60" cy="310" r="4" className="fill-purple-400" />
        <text x="70" y="314" fontFamily="system-ui, sans-serif" fontSize="8" className="fill-slate-500 dark:fill-slate-400">Process</text>
        <circle cx="110" cy="310" r="4" className="fill-green-400" />
        <text x="120" y="314" fontFamily="system-ui, sans-serif" fontSize="8" className="fill-slate-500 dark:fill-slate-400">Output</text>
      </svg>
    </div>
  );
}
