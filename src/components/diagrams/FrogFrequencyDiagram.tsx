export default function FrogFrequencyDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Frequency and pitch: how different frog sizes produce different call frequencies"
      >
        <rect width="700" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">
          Frequency and Pitch: Size Shapes Sound
        </text>

        {/* Axes */}
        <line x1="100" y1="380" x2="650" y2="380" className="stroke-gray-400 dark:stroke-slate-500" strokeWidth="1.5" />
        <line x1="100" y1="380" x2="100" y2="70" className="stroke-gray-400 dark:stroke-slate-500" strokeWidth="1.5" />
        <text x="375" y="410" textAnchor="middle" fontSize="12" className="fill-gray-600 dark:fill-slate-400">Frequency (Hz)</text>
        <text x="50" y="225" textAnchor="middle" fontSize="12" className="fill-gray-600 dark:fill-slate-400" transform="rotate(-90 50 225)">Amplitude</text>

        {/* Frequency labels */}
        {[
          { x: 150, label: '100' },
          { x: 250, label: '500' },
          { x: 370, label: '2000' },
          { x: 500, label: '5000' },
          { x: 600, label: '8000' },
        ].map((tick) => (
          <text key={tick.label} x={tick.x} y="396" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-500">{tick.label}</text>
        ))}

        {/* Bull frog - low frequency band */}
        <rect x="130" y="120" width="100" height="250" rx="6" fill="#ef4444" opacity="0.12" />
        <path d="M 140 340 Q 160 180 180 160 Q 200 180 220 340" fill="none" stroke="#ef4444" strokeWidth="2.5" />
        <circle cx="180" cy="90" r="22" className="fill-emerald-200 dark:fill-emerald-800" stroke="#065f46" strokeWidth="1.5" />
        <text x="180" y="94" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-emerald-800 dark:fill-emerald-200">BIG</text>
        <text x="180" y="380" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400" dy="-10">Bull Frog</text>
        <text x="180" y="380" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400" dy="12">100–500 Hz</text>

        {/* Tree frog - mid frequency band */}
        <rect x="300" y="140" width="120" height="230" rx="6" fill="#3b82f6" opacity="0.12" />
        <path d="M 320 340 Q 345 200 360 180 Q 375 200 400 340" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
        <circle cx="360" cy="100" r="16" className="fill-emerald-200 dark:fill-emerald-800" stroke="#065f46" strokeWidth="1.5" />
        <text x="360" y="104" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-emerald-800 dark:fill-emerald-200">MED</text>
        <text x="360" y="380" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-blue-600 dark:fill-blue-400" dy="-10">Tree Frog</text>
        <text x="360" y="380" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400" dy="12">1000–3000 Hz</text>

        {/* Cricket frog - high frequency band */}
        <rect x="470" y="170" width="120" height="200" rx="6" fill="#10b981" opacity="0.12" />
        <path d="M 490 340 Q 510 230 530 210 Q 550 230 570 340" fill="none" stroke="#10b981" strokeWidth="2.5" />
        <circle cx="530" cy="120" r="11" className="fill-emerald-200 dark:fill-emerald-800" stroke="#065f46" strokeWidth="1.5" />
        <text x="530" y="124" textAnchor="middle" fontSize="8" fontWeight="700" className="fill-emerald-800 dark:fill-emerald-200">SM</text>
        <text x="530" y="380" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-emerald-600 dark:fill-emerald-400" dy="-10">Cricket Frog</text>
        <text x="530" y="380" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400" dy="12">4000–8000 Hz</text>

        {/* Key insight */}
        <rect x="100" y="425" width="500" height="28" rx="6" className="fill-blue-50 dark:fill-blue-950/30 stroke-blue-200 dark:stroke-blue-800" strokeWidth="1" />
        <text x="350" y="444" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">
          Smaller frog → smaller vocal sac → higher frequency → higher pitch
        </text>
      </svg>
    </div>
  );
}
