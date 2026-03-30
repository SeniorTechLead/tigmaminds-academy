export default function SeismicWavesDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 580 292" className="w-full max-w-2xl mx-auto" role="img" aria-label="P-waves and S-waves comparison diagram">
        <defs>
          <marker id="sw-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        {/* --- P-Wave (top) --- */}
        <text x="250" y="18" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="12" fontWeight="bold">
          P-Wave (Primary / Compression)
        </text>

        {/* Direction arrow */}
        <line x1="60" y1="35" x2="440" y2="35" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" markerEnd="url(#sw-arrow)" />
        <text x="450" y="39" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Direction</text>

        {/* Particles: compression and rarefaction pattern */}
        {/* Compressed zone */}
        {[0, 8, 16, 24].map(i => (
          <circle key={`pc-${i}`} cx={80 + i} cy="70" r="3.5" className="fill-blue-500 dark:fill-blue-400" />
        ))}
        {/* Rarefaction zone */}
        {[0, 14, 28, 42].map(i => (
          <circle key={`pr1-${i}`} cx={120 + i} cy="70" r="3.5" className="fill-blue-300 dark:fill-blue-500" opacity="0.6" />
        ))}
        {/* Compressed zone */}
        {[0, 8, 16, 24].map(i => (
          <circle key={`pc2-${i}`} cx={185 + i} cy="70" r="3.5" className="fill-blue-500 dark:fill-blue-400" />
        ))}
        {/* Rarefaction zone */}
        {[0, 14, 28, 42].map(i => (
          <circle key={`pr2-${i}`} cx={225 + i} cy="70" r="3.5" className="fill-blue-300 dark:fill-blue-500" opacity="0.6" />
        ))}
        {/* Compressed zone */}
        {[0, 8, 16, 24].map(i => (
          <circle key={`pc3-${i}`} cx={290 + i} cy="70" r="3.5" className="fill-blue-500 dark:fill-blue-400" />
        ))}
        {/* Rarefaction zone */}
        {[0, 14, 28, 42].map(i => (
          <circle key={`pr3-${i}`} cx={330 + i} cy="70" r="3.5" className="fill-blue-300 dark:fill-blue-500" opacity="0.6" />
        ))}
        {/* Compressed zone */}
        {[0, 8, 16, 24].map(i => (
          <circle key={`pc4-${i}`} cx={395 + i} cy="70" r="3.5" className="fill-blue-500 dark:fill-blue-400" />
        ))}

        {/* Compression/rarefaction labels */}
        <text x="95" y="95" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="10">C</text>
        <text x="148" y="95" textAnchor="middle" className="fill-blue-400 dark:fill-blue-400" fontSize="10">R</text>
        <text x="200" y="95" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="10">C</text>
        <text x="253" y="95" textAnchor="middle" className="fill-blue-400 dark:fill-blue-400" fontSize="10">R</text>

        {/* Particle motion arrows (parallel to wave direction) */}
        <line x1="85" y1="55" x2="105" y2="55" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" markerEnd="url(#sw-arrow)" />
        <line x1="115" y1="55" x2="95" y2="55" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" markerEnd="url(#sw-arrow)" />
        <text x="250" y="108" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Particles move parallel to wave direction (push-pull)
        </text>

        {/* Divider */}
        <line x1="40" y1="122" x2="460" y2="122" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" strokeDasharray="4,4" />

        {/* --- S-Wave (bottom) --- */}
        <text x="250" y="140" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="12" fontWeight="bold">
          S-Wave (Secondary / Shear)
        </text>

        {/* Direction arrow */}
        <line x1="60" y1="152" x2="440" y2="152" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" markerEnd="url(#sw-arrow)" />
        <text x="450" y="156" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Direction</text>

        {/* Sinusoidal wave path */}
        <path d="M 70,190 Q 105,160 140,190 Q 175,220 210,190 Q 245,160 280,190 Q 315,220 350,190 Q 385,160 420,190"
          fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" />

        {/* Particles at wave positions with up/down arrows */}
        {[70, 140, 210, 280, 350, 420].map(x => (
          <circle key={`sp-${x}`} cx={x} cy={190} r="3.5" className="fill-emerald-500 dark:fill-emerald-400" />
        ))}
        {/* Up arrows at peaks */}
        {[105, 245, 385].map(x => (
          <g key={`su-${x}`}>
            <circle cx={x} cy={175} r="3.5" className="fill-emerald-500 dark:fill-emerald-400" />
            <line x1={x} y1="168" x2={x} y2="160" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1.5" markerEnd="url(#sw-arrow)" />
          </g>
        ))}
        {/* Down arrows at troughs */}
        {[175, 315].map(x => (
          <g key={`sd-${x}`}>
            <circle cx={x} cy={205} r="3.5" className="fill-emerald-500 dark:fill-emerald-400" />
            <line x1={x} y1={212} x2={x} y2={220} className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1.5" markerEnd="url(#sw-arrow)" />
          </g>
        ))}

        <text x="250" y="242" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Particles move perpendicular to wave direction (up-down)
        </text>
      </svg>
    </div>
  );
}
