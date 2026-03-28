export default function EcholocationDiagram() {
  return (
    <svg
      viewBox="0 0 600 250"
      className="w-full max-w-2xl mx-auto my-6"
      role="img"
      aria-label="Echolocation diagram showing how dolphins use sound waves to detect objects"
    >
      <defs>
        {/* Outgoing wave arc animation — pulses rightward */}
        {[0, 1, 2, 3].map((i) => (
          <style key={`out-${i}`}>{`
            @keyframes pulseOut${i} {
              0%   { opacity: 0; transform: scale(0.3); }
              20%  { opacity: 0.7; }
              60%  { opacity: 0.3; }
              100% { opacity: 0; transform: scale(1); }
            }
            .wave-out-${i} {
              animation: pulseOut${i} 2.4s ease-out infinite;
              animation-delay: ${i * 0.4}s;
              transform-origin: 145px 95px;
            }
          `}</style>
        ))}

        {/* Reflected wave arc animation — pulses leftward from fish */}
        {[0, 1, 2].map((i) => (
          <style key={`back-${i}`}>{`
            @keyframes pulseBack${i} {
              0%   { opacity: 0; transform: scale(0.3); }
              20%  { opacity: 0.6; }
              60%  { opacity: 0.2; }
              100% { opacity: 0; transform: scale(1); }
            }
            .wave-back-${i} {
              animation: pulseBack${i} 2.4s ease-out infinite;
              animation-delay: ${1.6 + i * 0.4}s;
              transform-origin: 370px 95px;
            }
          `}</style>
        ))}
      </defs>

      {/* Background */}
      <rect width="600" height="250" rx="12" className="fill-gray-900" />

      {/* Title */}
      <text x="300" y="24" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="11" fontWeight="600">
        Echolocation — How Dolphins "See" with Sound
      </text>

      {/* === Dolphin silhouette (left) === */}
      <g transform="translate(40, 60)">
        {/* Body */}
        <path
          d="M0,35 Q10,10 50,15 Q80,5 105,20 L100,35 Q80,50 50,45 Q20,50 0,35Z"
          className="fill-cyan-600"
        />
        {/* Dorsal fin */}
        <path d="M55,15 L60,0 L70,15" className="fill-cyan-700" />
        {/* Tail */}
        <path d="M0,35 Q-5,25 -15,20 M0,35 Q-5,45 -15,48" className="stroke-cyan-600" strokeWidth="3" fill="none" />
        {/* Eye */}
        <circle cx="85" cy="22" r="3" className="fill-gray-900" />
        {/* Snout / melon */}
        <ellipse cx="102" cy="28" rx="6" ry="4" className="fill-cyan-500" opacity="0.5" />
      </g>
      <text x="90" y="125" textAnchor="middle" className="fill-cyan-400" fontSize="10" fontWeight="500">
        Dolphin
      </text>

      {/* === Outgoing sound waves (arcs expanding right from dolphin) === */}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={`out-${i}`}
          className={`wave-out-${i}`}
          d={`M${170 + i * 30},${65} A${20 + i * 15},${30 + i * 10} 0 0,1 ${170 + i * 30},${125}`}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2"
          opacity="0"
        />
      ))}

      {/* === Fish (middle) === */}
      <g transform="translate(340, 75)">
        {/* Body */}
        <ellipse cx="30" cy="20" rx="25" ry="12" className="fill-amber-500" />
        {/* Tail */}
        <path d="M5,20 L-10,10 L-10,30Z" className="fill-amber-600" />
        {/* Eye */}
        <circle cx="42" cy="17" r="3" className="fill-gray-900" />
        {/* Fin */}
        <path d="M25,10 L30,2 L35,10" className="fill-amber-400" opacity="0.7" />
      </g>
      <text x="370" y="125" textAnchor="middle" className="fill-amber-400" fontSize="10" fontWeight="500">
        Fish (target)
      </text>

      {/* === Reflected waves (arcs expanding left from fish) === */}
      {[0, 1, 2].map((i) => (
        <path
          key={`back-${i}`}
          className={`wave-back-${i}`}
          d={`M${340 - i * 30},${65} A${20 + i * 15},${30 + i * 10} 0 0,0 ${340 - i * 30},${125}`}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="2"
          opacity="0"
        />
      ))}

      {/* Labels for wave directions */}
      <text x="240" y="58" textAnchor="middle" className="fill-cyan-300 dark:fill-cyan-400" fontSize="9">
        outgoing click
      </text>
      <path d="M210,55 L260,55" fill="none" stroke="#22d3ee" strokeWidth="1" markerEnd="url(#arrowRight)" opacity="0.5" />

      <text x="280" y="143" textAnchor="middle" className="fill-purple-300 dark:fill-purple-400" fontSize="9">
        reflected echo
      </text>
      <path d="M310,140 L255,140" fill="none" stroke="#a78bfa" strokeWidth="1" markerEnd="url(#arrowLeft)" opacity="0.5" />

      {/* Arrow markers */}
      <defs>
        <marker id="arrowRight" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="#22d3ee" />
        </marker>
        <marker id="arrowLeft" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
          <path d="M8,0 L0,3 L8,6" fill="#a78bfa" />
        </marker>
      </defs>

      {/* === Timeline below === */}
      <line x1="50" y1="175" x2="550" y2="175" className="stroke-gray-600" strokeWidth="1.5" />

      {/* Step 1: Click sent */}
      <circle cx="100" cy="175" r="5" className="fill-cyan-500" />
      <text x="100" y="195" textAnchor="middle" className="fill-cyan-300 dark:fill-cyan-400" fontSize="10" fontWeight="600">
        Click sent
      </text>

      {/* Arrow between steps */}
      <line x1="140" y1="175" x2="260" y2="175" stroke="#4b5563" strokeWidth="2" markerEnd="url(#timeArrow)" />

      {/* Step 2: Echo received */}
      <circle cx="300" cy="175" r="5" className="fill-purple-500" />
      <text x="300" y="195" textAnchor="middle" className="fill-purple-300 dark:fill-purple-400" fontSize="10" fontWeight="600">
        Echo received
      </text>

      {/* Arrow between steps */}
      <line x1="350" y1="175" x2="440" y2="175" stroke="#4b5563" strokeWidth="2" markerEnd="url(#timeArrow)" />

      {/* Step 3: Distance calculated */}
      <circle cx="480" cy="175" r="5" className="fill-emerald-500" />
      <text x="480" y="195" textAnchor="middle" className="fill-emerald-300" fontSize="10" fontWeight="600">
        Distance calculated
      </text>

      <defs>
        <marker id="timeArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="#4b5563" />
        </marker>
      </defs>

      {/* === Formula === */}
      <rect x="120" y="212" width="360" height="28" rx="6" className="fill-gray-800" stroke="#374151" strokeWidth="1" />
      <text x="300" y="231" textAnchor="middle" className="fill-emerald-400" fontSize="12" fontWeight="700" fontFamily="monospace">
        Distance = (time x speed of sound) / 2
      </text>
    </svg>
  );
}
