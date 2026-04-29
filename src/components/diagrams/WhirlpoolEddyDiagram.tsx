export default function WhirlpoolEddyDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 620 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="How whirlpools and eddies form when river current flows past obstacles or around bends">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .spinning { animation: spin 4s linear infinite; transform-origin: center; }
        `}</style>
        <rect width="620" height="320" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-cyan-700 dark:fill-cyan-300">
          Whirlpools and Eddies — How They Form
        </text>

        {/* LEFT: Obstacle eddy */}
        <rect x="30" y="50" width="280" height="150" rx="6" fill="#0c4a6e" opacity="0.1" className="dark:fill-blue-900/15" />
        <text x="170" y="70" textAnchor="middle" className="label fill-blue-600 dark:fill-blue-400" fontWeight="600">Eddy Behind an Obstacle</text>

        {/* River flow arrows */}
        {[85, 105, 125, 155, 175].map(y => (
          <line key={y} x1="40" y1={y} x2="130" y2={y} stroke="#60a5fa" strokeWidth="1.2" markerEnd="url(#eddy-arr)" opacity="0.5" />
        ))}

        {/* Obstacle (rock/pillar) */}
        <circle cx="165" cy="130" r="18" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" className="dark:fill-slate-500" />
        <text x="165" y="135" textAnchor="middle" className="small fill-white dark:fill-slate-200">rock</text>

        {/* Streamlines bending around obstacle */}
        <path d="M 140 85 Q 175 85 195 100" fill="none" stroke="#60a5fa" strokeWidth="1.2" />
        <path d="M 140 175 Q 175 175 195 160" fill="none" stroke="#60a5fa" strokeWidth="1.2" />

        {/* Eddy (rotating flow behind obstacle) */}
        <g style={{ transformOrigin: '230px 130px' }} className="spinning">
          <path d="M 215 120 Q 230 110 245 120 Q 255 130 245 140 Q 230 150 215 140 Q 205 130 215 120"
            fill="none" stroke="#ef4444" strokeWidth="1.5" />
        </g>
        <text x="250" y="118" className="small fill-red-500 dark:fill-red-400">eddy</text>

        {/* Flow continues after */}
        {[100, 130, 160].map(y => (
          <line key={y} x1="260" y1={y} x2="300" y2={y} stroke="#60a5fa" strokeWidth="1.2" markerEnd="url(#eddy-arr)" opacity="0.5" />
        ))}

        <text x="170" y="205" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Water separates around the rock,</text>
        <text x="170" y="218" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">creating a low-pressure zone behind it</text>

        {/* RIGHT: River bend eddy */}
        <rect x="330" y="50" width="260" height="150" rx="6" fill="#0c4a6e" opacity="0.1" className="dark:fill-blue-900/15" />
        <text x="460" y="70" textAnchor="middle" className="label fill-blue-600 dark:fill-blue-400" fontWeight="600">Eddy at a River Bend</text>

        {/* Curved river */}
        <path d="M 340 130 Q 420 80 500 100 Q 560 115 580 130" fill="none" stroke="#0c4a6e" strokeWidth="30" opacity="0.1" className="dark:opacity-20" />

        {/* Fast flow on outside */}
        <path d="M 350 115 Q 420 70 500 88 Q 555 100 575 115" fill="none" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#eddy-arr)" />
        <text x="500" y="80" className="small fill-blue-500 dark:fill-blue-400">fast (outside)</text>

        {/* Slow flow on inside */}
        <path d="M 350 145 Q 420 105 500 120 Q 555 132 575 145" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.5" markerEnd="url(#eddy-arr)" />
        <text x="370" y="158" className="small fill-blue-400 dark:fill-blue-500">slow (inside)</text>

        {/* Eddy in the bend */}
        <g style={{ transformOrigin: '430px 135px' }} className="spinning">
          <path d="M 420 125 Q 430 118 440 125 Q 447 135 440 145 Q 430 152 420 145 Q 413 135 420 125"
            fill="none" stroke="#ef4444" strokeWidth="1.5" />
        </g>
        <text x="455" y="143" className="small fill-red-500 dark:fill-red-400">eddy</text>

        <text x="460" y="205" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Faster flow on the outside,</text>
        <text x="460" y="218" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">slower inside creates rotation</text>

        {/* Danger + Ferryman note */}
        <rect x="40" y="235" width="540" height="70" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" className="dark:fill-red-900/10 dark:stroke-red-800" />
        <text x="310" y="255" textAnchor="middle" className="small fill-red-600 dark:fill-red-400" fontWeight="600">Why eddies matter for Brahmaputra ferries:</text>
        <text x="310" y="273" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Eddies near bridge pillars and sandbars create unpredictable currents. The Nimatighat crossing has</text>
        <text x="310" y="288" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">shifting sandbars that create new eddies each monsoon season. Experienced ferrymen read the water</text>
        <text x="310" y="303" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">surface for swirl patterns and adjust their course in real time — an intuitive application of fluid dynamics.</text>
      </svg>
    </div>
  );
}
