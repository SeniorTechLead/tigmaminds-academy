export default function ChurningCentrifugeDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 480 300" className="w-full h-auto" role="img" aria-label="Centrifugal separation diagram showing cream separating from milk in a spinning container">
        <style>{`
          .cc-title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .cc-label { font-family: system-ui, sans-serif; font-size: 10px; }
          .cc-small { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        <rect width="480" height="300" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="240" y="24" textAnchor="middle" className="cc-title fill-gray-700 dark:fill-gray-200">Centrifugal Separation of Milk</text>

        {/* Spinning container - cross section */}
        <ellipse cx="160" cy="160" rx="80" ry="100" fill="none" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />

        {/* Cream layer (inside - lighter, moves to center) */}
        <ellipse cx="160" cy="160" rx="35" ry="45" className="fill-yellow-100 dark:fill-yellow-700/40" />
        <text x="160" y="155" textAnchor="middle" className="cc-label fill-yellow-700 dark:fill-yellow-300" fontWeight="600">Cream</text>
        <text x="160" y="168" textAnchor="middle" className="cc-small fill-yellow-600 dark:fill-yellow-400">0.93 g/cm³</text>

        {/* Skim milk (outside - heavier, pushed out) */}
        <path d="M 160 60 A 80 100 0 1 1 160 260 A 80 100 0 1 1 160 60 M 160 115 A 35 45 0 1 0 160 205 A 35 45 0 1 0 160 115" className="fill-blue-100 dark:fill-blue-800/40" fillRule="evenodd" />
        <text x="160" y="85" textAnchor="middle" className="cc-label fill-blue-700 dark:fill-blue-300" fontWeight="600">Skim milk</text>
        <text x="160" y="240" textAnchor="middle" className="cc-small fill-blue-600 dark:fill-blue-400">1.035 g/cm³</text>

        {/* Rotation arrows */}
        <path d="M 70 100 A 100 60 0 0 1 90 80" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <path d="M 250 220 A 100 60 0 0 1 230 240" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <text x="55" y="90" className="cc-small fill-gray-500 dark:fill-gray-400">spin</text>

        {/* Force arrows pointing outward */}
        <line x1="195" y1="160" x2="230" y2="160" className="stroke-red-500" strokeWidth="2" markerEnd="url(#cc-arrow)" />
        <text x="250" y="155" className="cc-small fill-red-500">Centrifugal</text>
        <text x="250" y="166" className="cc-small fill-red-500">force</text>

        {/* Right side explanation */}
        <text x="310" y="60" className="cc-label fill-gray-600 dark:fill-gray-300" fontWeight="600">How it works:</text>
        <text x="310" y="80" className="cc-small fill-gray-500 dark:fill-gray-400">1. Whole milk enters spinner</text>
        <text x="310" y="95" className="cc-small fill-gray-500 dark:fill-gray-400">2. Spins at 6,000-10,000 RPM</text>
        <text x="310" y="110" className="cc-small fill-gray-500 dark:fill-gray-400">3. Heavier skim milk pushed out</text>
        <text x="310" y="125" className="cc-small fill-gray-500 dark:fill-gray-400">4. Lighter cream stays at center</text>

        <text x="310" y="160" className="cc-label fill-gray-600 dark:fill-gray-300" fontWeight="600">Key formula:</text>
        <text x="310" y="180" className="cc-small fill-gray-500 dark:fill-gray-400">F = m × omega² × r</text>
        <text x="310" y="195" className="cc-small fill-gray-500 dark:fill-gray-400">Heavier particles feel more</text>
        <text x="310" y="210" className="cc-small fill-gray-500 dark:fill-gray-400">force and move outward faster</text>

        <text x="240" y="285" textAnchor="middle" className="cc-small fill-gray-400 dark:fill-gray-500">Like the mythical churning rod — spinning separates by density</text>

        <defs>
          <marker id="cc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-red-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
