export default function ChurningDistillationDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 520 300" className="w-full h-auto" role="img" aria-label="Simple distillation apparatus showing liquid heated in flask, vapor rising through condenser, and collecting as purified liquid">
        <style>{`
          .cd-title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .cd-label { font-family: system-ui, sans-serif; font-size: 10px; }
          .cd-small { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        <rect width="520" height="300" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="260" y="24" textAnchor="middle" className="cd-title fill-gray-700 dark:fill-gray-200">Distillation: Separation by Boiling Point</text>

        {/* Heating flask */}
        <ellipse cx="100" cy="220" rx="50" ry="40" className="fill-blue-100 dark:fill-blue-900/40 stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />
        <ellipse cx="100" cy="195" rx="25" ry="8" className="fill-orange-200 dark:fill-orange-700/40" />

        {/* Flask neck */}
        <rect x="88" y="140" width="24" height="50" className="fill-transparent stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" rx="2" />

        {/* Heat source */}
        <rect x="65" y="260" width="70" height="12" rx="3" className="fill-red-400 dark:fill-red-600" />
        <text x="100" y="288" textAnchor="middle" className="cd-small fill-red-500 dark:fill-red-400">Heat source</text>

        {/* Vapor rising */}
        <text x="75" y="135" className="cd-small fill-gray-500 dark:fill-gray-400">Vapor rises</text>
        <path d="M 100 140 Q 100 110, 120 100 Q 140 90, 170 85" fill="none" className="stroke-orange-400" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* Condenser tube (angled) */}
        <rect x="170" y="60" width="180" height="18" rx="5" className="fill-slate-200 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" transform="rotate(15, 260, 69)" />

        {/* Cooling water arrows */}
        <text x="260" y="50" textAnchor="middle" className="cd-small fill-cyan-600 dark:fill-cyan-400">Cooling water</text>
        <line x1="230" y1="55" x2="230" y2="65" className="stroke-cyan-500" strokeWidth="1" />
        <line x1="290" y1="55" x2="290" y2="65" className="stroke-cyan-500" strokeWidth="1" />

        <text x="260" y="100" textAnchor="middle" className="cd-small fill-gray-500 dark:fill-gray-400">Vapor condenses back to liquid</text>

        {/* Collection flask */}
        <ellipse cx="400" cy="200" rx="40" ry="35" className="fill-emerald-100 dark:fill-emerald-900/40 stroke-emerald-400 dark:stroke-emerald-500" strokeWidth="1.5" />
        <rect x="388" y="150" width="24" height="40" className="fill-transparent stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" rx="2" />

        {/* Drip into collection */}
        <path d="M 350 85 Q 370 100, 400 150" fill="none" className="stroke-emerald-400" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Labels */}
        <text x="100" y="225" textAnchor="middle" className="cd-label fill-blue-600 dark:fill-blue-300" fontWeight="600">Mixture</text>
        <text x="400" y="205" textAnchor="middle" className="cd-label fill-emerald-600 dark:fill-emerald-300" fontWeight="600">Pure liquid</text>

        {/* Boiling points */}
        <text x="420" y="260" textAnchor="middle" className="cd-small fill-gray-500 dark:fill-gray-400">Each substance boils</text>
        <text x="420" y="273" textAnchor="middle" className="cd-small fill-gray-500 dark:fill-gray-400">at a unique temperature</text>
      </svg>
    </div>
  );
}
