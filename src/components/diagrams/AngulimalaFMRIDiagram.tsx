export default function AngulimalaFMRIDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 520 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing how fMRI measures brain activity by detecting blood oxygen levels in active brain regions"
      >
        <rect width="520" height="440" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="260" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          fMRI — Watching the Brain Think
        </text>

        {/* Brain outline (side view) */}
        <path d="M 80,180 Q 80,80 180,80 Q 260,70 300,100 Q 340,80 360,100 Q 400,120 400,180 Q 410,240 360,280 Q 300,320 240,320 Q 160,320 120,280 Q 80,250 80,180"
          fill="none" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />

        {/* Prefrontal cortex highlight */}
        <ellipse cx="130" cy="160" rx="35" ry="40" className="fill-blue-300/40 dark:fill-blue-600/30 stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />
        <text x="130" y="140" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-blue-600 dark:fill-blue-300">Prefrontal</text>
        <text x="130" y="152" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-blue-600 dark:fill-blue-300">Cortex</text>
        <text x="130" y="170" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-blue-500 dark:fill-blue-400">(decisions,</text>
        <text x="130" y="181" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-blue-500 dark:fill-blue-400">self-control)</text>

        {/* Amygdala highlight */}
        <ellipse cx="240" cy="240" rx="25" ry="20" className="fill-red-300/40 dark:fill-red-600/30 stroke-red-400 dark:stroke-red-500" strokeWidth="1.5" />
        <text x="240" y="238" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-300">Amygdala</text>
        <text x="240" y="252" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-red-500 dark:fill-red-400">(fear, anger)</text>

        {/* Hippocampus */}
        <ellipse cx="300" cy="240" rx="25" ry="18" className="fill-emerald-300/40 dark:fill-emerald-600/30 stroke-emerald-400 dark:stroke-emerald-500" strokeWidth="1.5" />
        <text x="300" y="237" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-emerald-600 dark:fill-emerald-300">Hippo-</text>
        <text x="300" y="249" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-emerald-600 dark:fill-emerald-300">campus</text>

        {/* Motor cortex */}
        <path d="M 200,100 Q 240,85 280,105" fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
        <text x="240" y="98" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-amber-600 dark:fill-amber-300">Motor Cortex</text>

        {/* Right side: fMRI explanation */}
        <rect x="420" y="65" width="90" height="130" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="465" y="85" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="700" className="fill-slate-700 dark:fill-slate-200">How fMRI</text>
        <text x="465" y="97" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="700" className="fill-slate-700 dark:fill-slate-200">Works</text>

        {/* Steps */}
        <circle cx="435" cy="118" r="8" className="fill-red-400 dark:fill-red-500" />
        <text x="435" y="122" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="700" className="fill-white">1</text>
        <text x="475" y="122" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">Neurons</text>
        <text x="475" y="133" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">fire</text>

        <circle cx="435" cy="152" r="8" className="fill-orange-400 dark:fill-orange-500" />
        <text x="435" y="156" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="700" className="fill-white">2</text>
        <text x="475" y="152" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">Blood</text>
        <text x="475" y="163" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">rushes in</text>

        <circle cx="435" cy="182" r="8" className="fill-blue-400 dark:fill-blue-500" />
        <text x="435" y="186" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="700" className="fill-white">3</text>
        <text x="475" y="182" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">MRI</text>
        <text x="475" y="193" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">detects O₂</text>

        {/* BOLD signal explanation */}
        <rect x="30" y="340" width="460" height="50" rx="6"
          className="fill-purple-50 dark:fill-purple-900/20 stroke-purple-300 dark:stroke-purple-700" strokeWidth="1" />
        <text x="260" y="362" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-purple-700 dark:fill-purple-300">
          BOLD Signal: Blood Oxygen Level Dependent
        </text>
        <text x="260" y="378" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Active neurons consume oxygen → oxygenated blood rushes in → fMRI detects the change
        </text>

        {/* Meditation study callout */}
        <rect x="30" y="395" width="460" height="35" rx="4"
          className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="260" y="416" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-700 dark:fill-amber-300">
          fMRI shows meditators have thicker prefrontal cortex and calmer amygdala — the brain changes physically
        </text>
      </svg>
    </div>
  );
}
