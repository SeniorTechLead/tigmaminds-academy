export default function ActivitySonarDiagram() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="w-full max-w-2xl mx-auto my-6"
      role="img"
      aria-label="Offline activity: clap in different rooms and time the echo to estimate room size"
    >
      <defs>
        <style>{`
          @keyframes dClapPulse {
            0%, 100% { r: 8; opacity: 0.8; }
            50% { r: 14; opacity: 0.3; }
          }
          .d-clap-pulse { animation: dClapPulse 1.5s ease-in-out infinite; }
        `}</style>
      </defs>

      <rect width="640" height="320" rx="12" className="fill-gray-900" />

      <text x="320" y="24" textAnchor="middle" className="fill-gray-400" fontSize="11" fontWeight="600">
        Try It Yourself &mdash; Echolocation with a Clap
      </text>

      {/* === Scene 1: Large room === */}
      <rect x="30" y="45" width="270" height="150" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#374151" strokeWidth="1" />
      <text x="165" y="65" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10" fontWeight="600">Large Hall</text>

      {/* Walls */}
      <rect x="50" y="75" width="230" height="100" rx="4" fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" strokeDasharray="6,3" />

      {/* Person in center */}
      <circle cx="100" cy="125" r="6" fill="#f59e0b" />
      <line x1="100" y1="131" x2="100" y2="152" stroke="#f59e0b" strokeWidth="2" />
      <line x1="90" y1="140" x2="110" y2="140" stroke="#f59e0b" strokeWidth="2" />

      {/* Clap waves */}
      <circle cx="108" cy="130" r="8" fill="none" stroke="#22d3ee" strokeWidth="1.5" className="d-clap-pulse" />

      {/* Arrow to wall and back */}
      <line x1="118" y1="125" x2="260" y2="125" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
      <line x1="260" y1="125" x2="118" y2="132" stroke="#c084fc" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />

      {/* Distance label */}
      <text x="190" y="118" textAnchor="middle" fill="#67e8f9" fontSize="8">~10 m to wall</text>
      <text x="165" y="182" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="600">Echo: ~0.06 sec (noticeable)</text>

      {/* === Scene 2: Small room === */}
      <rect x="340" y="45" width="270" height="150" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#374151" strokeWidth="1" />
      <text x="475" y="65" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10" fontWeight="600">Small Bathroom</text>

      {/* Walls (close) */}
      <rect x="410" y="80" width="80" height="80" rx="4" fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" strokeDasharray="6,3" />

      {/* Person */}
      <circle cx="450" cy="120" r="6" fill="#f59e0b" />
      <line x1="450" y1="126" x2="450" y2="147" stroke="#f59e0b" strokeWidth="2" />
      <line x1="440" y1="135" x2="460" y2="135" stroke="#f59e0b" strokeWidth="2" />

      <circle cx="458" cy="115" r="8" fill="none" stroke="#22d3ee" strokeWidth="1.5" className="d-clap-pulse" style={{ animationDelay: '0.7s' }} />

      <text x="470" y="105" fill="#67e8f9" fontSize="8">~1.5 m</text>
      <text x="475" y="182" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="600">Echo: ~0.009 sec (instant)</text>

      {/* === Instructions === */}
      <rect x="30" y="210" width="580" height="100" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#374151" strokeWidth="1" />
      <text x="50" y="232" fill="#f59e0b" fontSize="10" fontWeight="700">What to do:</text>

      {[
        '1. Stand in a large room or hallway. Clap once, sharply. Listen for the echo.',
        '2. Now try the same in a small room (bathroom). Is the echo faster or gone?',
        '3. Stand near a wall vs the center. Does the echo change?',
        '4. You are doing exactly what a dolphin does: using sound to map the space.',
      ].map((step, i) => (
        <text key={i} x="50" y={248 + i * 14} className="fill-gray-600 dark:fill-slate-300" fontSize="9">{step}</text>
      ))}

      {/* Formula reminder */}
      <text x="320" y="302" textAnchor="middle" fill="#34d399" fontSize="9" fontFamily="monospace">
        echo time &#8776; 2 &#215; distance / 343 m/s &nbsp;&nbsp;|&nbsp;&nbsp; 10m wall &#8594; 0.058 sec echo
      </text>
    </svg>
  );
}
