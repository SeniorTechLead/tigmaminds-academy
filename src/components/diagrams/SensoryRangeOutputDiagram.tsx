export default function SensoryRangeOutputDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Comparative bar chart of sensory capabilities across tiger, human, bat, and dolphin">
        <rect width="780" height="380" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f59e0b">Your Project: Animal Sensory Range Comparison</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Which species has the best hearing? Vision? Touch sensitivity?</text>

        {/* Bar chart */}
        {[
          { animal: 'Tiger', whiskers: 90, hearing: 65, vision: 80, color: '#f59e0b' },
          { animal: 'Human', whiskers: 10, hearing: 40, vision: 90, color: '#3b82f6' },
          { animal: 'Bat', whiskers: 5, hearing: 95, vision: 15, color: '#8b5cf6' },
          { animal: 'Dolphin', whiskers: 0, hearing: 98, vision: 30, color: '#06b6d4' },
        ].map((a, i) => (
          <g key={i} transform={`translate(${100 + i * 165}, 80)`}>
            <text x="55" y="0" textAnchor="middle" fontSize="12" fontWeight="700" fill={a.color}>{a.animal}</text>
            {/* Touch bar */}
            <rect x="0" y="15" width={a.whiskers * 1.1} height="22" rx="3" fill={a.color} opacity="0.3" />
            <rect x="0" y="15" width={a.whiskers * 1.1} height="22" rx="3" fill={a.color} opacity="0.6" />
            <text x="4" y="30" fontSize="10" fontWeight="600" fill="#fff">Touch: {a.whiskers}%</text>
            {/* Hearing bar */}
            <rect x="0" y="42" width={a.hearing * 1.1} height="22" rx="3" fill={a.color} opacity="0.4" />
            <text x="4" y="57" fontSize="10" fontWeight="600" fill="#fff">Hear: {a.hearing}%</text>
            {/* Vision bar */}
            <rect x="0" y="69" width={a.vision * 1.1} height="22" rx="3" fill={a.color} opacity="0.25" />
            <text x="4" y="84" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">See: {a.vision}%</text>
          </g>
        ))}

        {/* Key findings */}
        <rect x="60" y="195" width="660" height="140" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="218" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Key Findings</text>
        {[
          { text: 'Tigers excel at tactile sensing — whiskers give them a 3D touch map that humans lack', color: '#f59e0b' },
          { text: 'Bats trade vision for ultrasonic hearing — they "see" with sound (echolocation)', color: '#8b5cf6' },
          { text: 'Dolphins have the widest hearing range but no whiskers — sonar replaces touch', color: '#06b6d4' },
          { text: 'Humans rely most on vision — we compensated for weak touch by inventing tools', color: '#3b82f6' },
        ].map((f, i) => (
          <g key={i}>
            <circle cx="90" cy={238 + i * 22} r="4" fill={f.color} />
            <text x="102" y={242 + i * 22} fontSize="11" className="fill-gray-600 dark:fill-slate-300">{f.text}</text>
          </g>
        ))}

        {/* Project description */}
        <rect x="60" y="345" width="660" height="22" rx="6" fill="#f59e0b" opacity="0.1" />
        <text x="390" y="361" textAnchor="middle" fontSize="11" fontWeight="600" fill="#f59e0b">
          Level 4: Research 8-10 animals, build bar charts in Matplotlib, write a comparative analysis
        </text>
      </svg>
    </div>
  );
}
