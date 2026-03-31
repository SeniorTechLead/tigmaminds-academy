export default function ActivityCDRainbowDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Activity: find structural colors in everyday objects like CDs, soap bubbles, and feathers">
        <rect width="700" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#3b82f6">Try This: Spot Structural Color</text>
        <text x="350" y="52" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Find these everyday examples and tilt them to watch the color shift</text>

        {/* CD */}
        <g transform="translate(130, 140)">
          <circle cx="0" cy="0" r="55" fill="none" stroke="#a78bfa" strokeWidth="2" />
          <circle cx="0" cy="0" r="48" fill="#a78bfa" opacity="0.1" />
          <circle cx="0" cy="0" r="10" className="fill-gray-300 dark:fill-slate-600" />
          {[0, 60, 120, 180, 240, 300].map((a, i) => {
            const rad = a * Math.PI / 180;
            return <line key={i} x1={Math.cos(rad) * 15} y1={Math.sin(rad) * 15} x2={Math.cos(rad) * 45} y2={Math.sin(rad) * 45} stroke="#c4b5fd" strokeWidth="0.5" opacity="0.6" />;
          })}
          <text x="0" y="80" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">CD / DVD</text>
          <text x="0" y="96" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Grooves diffract light</text>
        </g>

        {/* Soap bubble */}
        <g transform="translate(350, 140)">
          <circle cx="0" cy="0" r="50" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="48" fill="#60a5fa" opacity="0.06" />
          <ellipse cx="-15" cy="-15" rx="18" ry="10" fill="#ffffff" opacity="0.2" />
          <text x="0" y="80" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Soap Bubble</text>
          <text x="0" y="96" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Thin-film interference</text>
        </g>

        {/* Feather */}
        <g transform="translate(570, 140)">
          <path d="M0,-50 Q30,-20 15,20 Q5,50 0,55 Q-5,50 -15,20 Q-30,-20 0,-50 Z" fill="#3b82f6" opacity="0.15" stroke="#3b82f6" strokeWidth="1.5" />
          <line x1="0" y1="-45" x2="0" y2="55" stroke="#3b82f6" strokeWidth="1" />
          <text x="0" y="80" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Pigeon Feather</text>
          <text x="0" y="96" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Iridescent neck colors</text>
        </g>

        {/* Instructions */}
        {[
          { n: '1', text: 'Hold a CD under a lamp and tilt it slowly \u2014 watch colors shift with angle' },
          { n: '2', text: 'Blow a soap bubble and look at the swirling bands of color as the film thins' },
          { n: '3', text: 'Find a pigeon neck feather \u2014 tilt it and notice the green-purple shift' },
          { n: '4', text: 'Key question: do paint colors shift with angle? Why not?' },
        ].map((s, i) => (
          <g key={i}>
            <circle cx={120} cy={275 + i * 28} r="10" fill="#3b82f6" opacity="0.15" />
            <text x={120} y={279 + i * 28} textAnchor="middle" fontSize="11" fontWeight="700" fill="#3b82f6">{s.n}</text>
            <text x={140} y={279 + i * 28} fontSize="12" className="fill-gray-700 dark:fill-slate-200">{s.text}</text>
          </g>
        ))}

        <text x="350" y="405" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Structural color always shifts with viewing angle \u2014 pigment color does not</text>
      </svg>
    </div>
  );
}
