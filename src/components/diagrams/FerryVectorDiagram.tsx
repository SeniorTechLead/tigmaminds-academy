export default function FerryVectorDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 620 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Vector addition diagram showing how a ferry must angle upstream to cross a river current in a straight line">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .formula { font-family: system-ui, sans-serif; font-size: 11px; font-style: italic; }
        `}</style>
        <rect width="620" height="380" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-cyan-700 dark:fill-cyan-300">
          Ferry River Crossing — Vector Addition
        </text>

        {/* River background */}
        <rect x="30" y="55" width="270" height="200" rx="4" fill="#0c4a6e" opacity="0.15" className="dark:fill-blue-900/20" />

        {/* River current arrows (flowing right) */}
        {[80, 120, 160, 200].map(y => (
          <line key={y} x1="40" y1={y} x2="280" y2={y} stroke="#60a5fa" strokeWidth="1" opacity="0.4" markerEnd="url(#ferry-curr)" />
        ))}
        <text x="165" y="72" textAnchor="middle" className="small fill-blue-500 dark:fill-blue-400">Current: 3 m/s →</text>

        {/* Banks */}
        <rect x="25" y="55" width="10" height="200" rx="2" fill="#92400e" opacity="0.5" className="dark:fill-amber-900/40" />
        <text x="20" y="155" textAnchor="end" className="small fill-amber-700 dark:fill-amber-400">Near bank</text>
        <rect x="295" y="55" width="10" height="200" rx="2" fill="#92400e" opacity="0.5" className="dark:fill-amber-900/40" />
        <text x="312" y="155" className="small fill-amber-700 dark:fill-amber-400">Far bank</text>

        {/* Scenario 1: Pointing straight across */}
        <text x="165" y="100" textAnchor="middle" className="small fill-red-500 dark:fill-red-400" fontWeight="600">If ferry points straight across:</text>
        {/* Ferry engine velocity (up) */}
        <line x1="100" y1="220" x2="100" y2="130" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#ferry-engine)" />
        <text x="80" y="175" textAnchor="end" className="small fill-emerald-600 dark:fill-emerald-400">5 m/s</text>
        {/* Current velocity (right) */}
        <line x1="100" y1="220" x2="170" y2="220" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#ferry-curr-b)" />
        <text x="135" y="240" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-400">3 m/s</text>
        {/* Resultant (diagonal) */}
        <line x1="100" y1="220" x2="170" y2="130" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6,3" markerEnd="url(#ferry-result)" />
        <text x="155" y="168" className="small fill-red-500 dark:fill-red-400">Actual</text>
        <text x="155" y="180" className="small fill-red-500 dark:fill-red-400">path!</text>
        <text x="165" y="245" textAnchor="middle" className="small fill-red-500 dark:fill-red-400">Arrives downstream ✗</text>

        {/* RIGHT SIDE: Correct approach */}
        <rect x="330" y="55" width="270" height="200" rx="4" fill="#0c4a6e" opacity="0.15" className="dark:fill-blue-900/20" />

        {/* Current arrows */}
        {[80, 120, 160, 200].map(y => (
          <line key={y} x1="340" y1={y} x2="580" y2={y} stroke="#60a5fa" strokeWidth="1" opacity="0.4" markerEnd="url(#ferry-curr)" />
        ))}

        {/* Banks */}
        <rect x="325" y="55" width="10" height="200" rx="2" fill="#92400e" opacity="0.5" className="dark:fill-amber-900/40" />
        <rect x="595" y="55" width="10" height="200" rx="2" fill="#92400e" opacity="0.5" className="dark:fill-amber-900/40" />

        <text x="465" y="100" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">If ferry angles upstream:</text>

        {/* Ferry aimed upstream (up-left) */}
        <line x1="420" y1="220" x2="370" y2="130" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#ferry-engine)" />
        <text x="375" y="180" textAnchor="end" className="small fill-emerald-600 dark:fill-emerald-400">5 m/s</text>
        {/* Current (right) */}
        <line x1="370" y1="130" x2="420" y2="130" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#ferry-curr-b)" />
        <text x="395" y="122" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-400">3 m/s</text>
        {/* Resultant - straight across */}
        <line x1="420" y1="220" x2="420" y2="130" stroke="#10b981" strokeWidth="3" markerEnd="url(#ferry-straight)" />
        <text x="440" y="175" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">Straight</text>
        <text x="440" y="188" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">across! ✓</text>

        {/* Angle label */}
        <path d="M 420 200 Q 410 195 405 185" fill="none" stroke="#d97706" strokeWidth="1.5" />
        <text x="400" y="208" textAnchor="end" className="small fill-amber-600 dark:fill-amber-400">37°</text>

        {/* Formula */}
        <rect x="40" y="270" width="540" height="50" rx="6" fill="#f0fdfa" stroke="#5eead4" strokeWidth="1" className="dark:fill-teal-900/15 dark:stroke-teal-700" />
        <text x="310" y="290" textAnchor="middle" className="label fill-teal-700 dark:fill-teal-300" fontWeight="600">Required upstream angle:</text>
        <text x="310" y="310" textAnchor="middle" className="formula fill-teal-800 dark:fill-teal-200">
          θ = arcsin(v_current / v_ferry) = arcsin(3/5) = 37°
        </text>

        {/* Key insight */}
        <rect x="40" y="332" width="540" height="38" rx="6" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1" className="dark:fill-amber-900/15 dark:stroke-amber-700" />
        <text x="310" y="350" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400" fontWeight="600">If current speed ≥ ferry speed, the ferry CANNOT cross straight — it will always drift downstream.</text>
        <text x="310" y="364" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Nimatighat ferrymen adjust angle continuously as current varies across the river width.</text>

        <defs>
          <marker id="ferry-curr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
          <marker id="ferry-engine" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 10 L 5 0 L 10 10 z" fill="#10b981" />
          </marker>
          <marker id="ferry-curr-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="ferry-result" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="ferry-straight" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 10 L 5 0 L 10 10 z" fill="#10b981" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
