export default function DharmaGyroscopeDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 500 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Gyroscope showing spinning wheel, angular momentum vector, and precession motion"
      >
        <defs>
          <marker id="dgy-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="dgy-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="dgy-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
          <marker id="dgy-arrow-purple" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="500" height="440" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Gyroscopic Stability
        </text>

        {/* --- Side view: spinning wheel on pedestal --- */}
        <text x="160" y="55" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="600" className="fill-slate-600 dark:fill-slate-400">
          Side View
        </text>

        {/* Pedestal / pivot point */}
        <rect x="145" y="270" width="30" height="10" rx="2"
          className="fill-slate-300 dark:fill-slate-600" />
        <rect x="155" y="245" width="10" height="25"
          className="fill-slate-400 dark:fill-slate-500" />

        {/* Axle */}
        <line x1="100" y1="195" x2="220" y2="195"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="3" />

        {/* Wheel (ellipse for perspective) */}
        <ellipse cx="160" cy="195" rx="15" ry="55" fill="none"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="3" />

        {/* Spin direction arrow on wheel */}
        <path d="M 148,145 A 15,15 0 0,0 148,245" fill="none"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5"
          markerEnd="url(#dgy-arrow-purple)" />

        {/* Support line from pivot to axle */}
        <line x1="160" y1="245" x2="160" y2="195"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Angular momentum vector (L) pointing along axle */}
        <line x1="220" y1="195" x2="285" y2="195"
          className="stroke-purple-500 dark:stroke-purple-400" strokeWidth="2.5"
          markerEnd="url(#dgy-arrow-purple)" />
        <text x="260" y="188" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-purple-600 dark:fill-purple-300">L</text>

        {/* Gravity arrow */}
        <line x1="160" y1="200" x2="160" y2="250"
          className="stroke-red-500 dark:stroke-red-400" strokeWidth="2"
          markerEnd="url(#dgy-arrow-red)" />
        <text x="140" y="240" textAnchor="end" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-red-500 dark:fill-red-400">mg</text>

        {/* Torque from gravity (into page) */}
        <circle cx="160" cy="195" r="8" fill="none"
          className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
        <text x="160" y="199" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-blue-500 dark:fill-blue-400">×</text>
        <text x="130" y="193" textAnchor="end" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-blue-500 dark:fill-blue-400">τ (into page)</text>

        {/* --- Top view: precession circle --- */}
        <text x="380" y="55" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="600" className="fill-slate-600 dark:fill-slate-400">
          Top View (precession)
        </text>

        {/* Precession circle */}
        <circle cx="380" cy="160" r="60" fill="none"
          className="stroke-green-400 dark:stroke-green-500" strokeWidth="1.5" strokeDasharray="6,4" />

        {/* Pivot center */}
        <circle cx="380" cy="160" r="4"
          className="fill-slate-500 dark:fill-slate-400" />

        {/* L vector at one position */}
        <line x1="380" y1="160" x2="440" y2="160"
          className="stroke-purple-500 dark:stroke-purple-400" strokeWidth="2.5"
          markerEnd="url(#dgy-arrow-purple)" />
        <text x="445" y="157" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-purple-600 dark:fill-purple-300">L</text>

        {/* L vector ghosted at another position */}
        <line x1="380" y1="160" x2="380" y2="100"
          className="stroke-purple-300 dark:stroke-purple-600" strokeWidth="1.5" strokeDasharray="4,3" />
        <line x1="380" y1="160" x2="320" y2="160"
          className="stroke-purple-300 dark:stroke-purple-600" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Precession direction arrow */}
        <path d="M 430,130 A 60,60 0 0,1 410,100" fill="none"
          className="stroke-green-500 dark:stroke-green-400" strokeWidth="2"
          markerEnd="url(#dgy-arrow-green)" />
        <text x="440" y="110" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-green-600 dark:fill-green-300">Precession</text>

        {/* Comparison: still vs spinning */}
        <rect x="310" y="230" width="170" height="75" rx="8"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <text x="395" y="250" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">Not spinning: falls</text>
        <text x="395" y="267" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">Gravity wins immediately</text>
        <text x="395" y="285" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-green-600 dark:fill-green-400">Spinning: precesses</text>
        <text x="395" y="300" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-green-500 dark:fill-green-400">L resists change in direction</text>

        {/* Key insight box */}
        <rect x="30" y="325" width="440" height="100" rx="8"
          className="fill-amber-50 dark:fill-amber-900/30 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1.5" />
        <text x="250" y="348" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-amber-700 dark:fill-amber-300">
          Why does spinning stabilise?
        </text>
        <text x="250" y="368" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">
          Angular momentum (L) is a vector — it has direction.
        </text>
        <text x="250" y="383" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">
          Changing L requires torque. The bigger L is, the harder it is to change direction.
        </text>
        <text x="250" y="398" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">
          Gravity provides torque perpendicular to L, so L rotates slowly (precesses)
        </text>
        <text x="250" y="413" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">
          instead of falling. Bicycles, tops, gyroscopes, and planets all use this.
        </text>
      </svg>
    </div>
  );
}
