export default function SalGrainDirectionDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing wood is strong along the grain but weak across the grain, with force arrows"
      >
        <rect width="780" height="440" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Grain Direction Matters
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Wood is 10-20x stronger along the grain than across it
        </text>

        <defs>
          <marker id="force-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#ef4444" />
          </marker>
          <marker id="ok-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#22c55e" />
          </marker>
        </defs>

        {/* Left: Force along grain - STRONG */}
        <rect x="40" y="80" width="330" height="250" rx="10" fill="#22c55e" fillOpacity="0.05" stroke="#22c55e" strokeWidth="1" />
        <text x="205" y="105" textAnchor="middle" fontSize="13" fontWeight="700" fill="#22c55e">
          Along the Grain {'\u2014'} STRONG
        </text>

        {/* Wood block with grain lines */}
        <rect x="90" y="130" width="230" height="100" rx="4" fill="#c9a86c" fillOpacity="0.4" stroke="#a16207" strokeWidth="1" />
        {[145, 160, 175, 190, 205, 220].map(y => (
          <line key={y} x1="95" y1={y} x2="315" y2={y} stroke="#8b6914" strokeWidth="1" strokeOpacity="0.5" />
        ))}
        <text x="205" y="245" textAnchor="middle" fontSize="10" fill="#a16207">grain lines</text>

        {/* Force arrows along grain */}
        <line x1="50" y1="180" x2="85" y2="180" stroke="#22c55e" strokeWidth="3" markerEnd="url(#ok-arrow)" />
        <line x1="360" y1="180" x2="325" y2="180" stroke="#22c55e" strokeWidth="3" markerEnd="url(#ok-arrow)" />
        <text x="50" y="170" fontSize="10" fill="#22c55e" fontWeight="600">Push</text>
        <text x="340" y="170" fontSize="10" fill="#22c55e" fontWeight="600">Push</text>

        {/* Result */}
        <text x="205" y="275" textAnchor="middle" fontSize="12" fontWeight="600" fill="#22c55e">
          Fibers resist: no break!
        </text>
        <text x="205" y="293" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Tensile strength: ~100 MPa
        </text>
        <text x="205" y="310" textAnchor="middle" fontSize="20">{'\u2714\uFE0F'}</text>

        {/* Right: Force across grain - WEAK */}
        <rect x="410" y="80" width="330" height="250" rx="10" fill="#ef4444" fillOpacity="0.05" stroke="#ef4444" strokeWidth="1" />
        <text x="575" y="105" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">
          Across the Grain {'\u2014'} WEAK
        </text>

        {/* Wood block with grain lines */}
        <rect x="460" y="130" width="230" height="100" rx="4" fill="#c9a86c" fillOpacity="0.4" stroke="#a16207" strokeWidth="1" />
        {[145, 160, 175, 190, 205, 220].map(y => (
          <line key={y} x1="465" y1={y} x2="685" y2={y} stroke="#8b6914" strokeWidth="1" strokeOpacity="0.5" />
        ))}

        {/* Force arrows across grain */}
        <line x1="575" y1="100" x2="575" y2="125" stroke="#ef4444" strokeWidth="3" markerEnd="url(#force-arrow)" />
        <line x1="575" y1="258" x2="575" y2="235" stroke="#ef4444" strokeWidth="3" markerEnd="url(#force-arrow)" />

        {/* Crack visualization */}
        <path d="M540,155 L545,165 L538,175 L546,185 L540,195 L547,205 L541,215" fill="none" stroke="#ef4444" strokeWidth="2" />
        <path d="M620,155 L615,165 L622,175 L614,185 L620,195 L613,205 L619,215" fill="none" stroke="#ef4444" strokeWidth="2" />

        {/* Result */}
        <text x="575" y="275" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ef4444">
          Fibers split apart easily!
        </text>
        <text x="575" y="293" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Tensile strength: ~5 MPa
        </text>
        <text x="575" y="310" textAnchor="middle" fontSize="20">{'\u274C'}</text>

        {/* Bottom explanation */}
        <rect x="80" y="355" width="620" height="65" rx="10" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="1" />
        <text x="390" y="378" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-800 dark:fill-amber-200">
          This is why carpenters always check the grain before cutting
        </text>
        <text x="390" y="396" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-amber-300">
          A floor plank loaded along the grain can support a car. Loaded across the grain, a child could snap it.
        </text>
        <text x="390" y="411" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-amber-300">
          This is the same reason you can tear newspaper straight down but not across.
        </text>
      </svg>
    </div>
  );
}
