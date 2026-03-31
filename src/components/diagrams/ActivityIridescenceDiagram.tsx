export default function ActivityIridescenceDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 600 320" className="w-full max-w-xl mx-auto" role="img" aria-label="Hands-on activity: making iridescence with a CD and soap bubbles to observe thin-film interference">
        <text x="300" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Activity: See Iridescence for Yourself</text>

        {/* Step 1: CD */}
        <rect x="20" y="40" width="170" height="120" rx="8" className="fill-violet-50 dark:fill-violet-900/20" />
        <text x="105" y="60" textAnchor="middle" className="fill-violet-700 dark:fill-violet-300" fontSize="11" fontWeight="bold">Step 1: CD Rainbow</text>

        {/* CD shape */}
        <circle cx="105" cy="105" r="30" className="fill-gray-200 dark:fill-gray-700" />
        <circle cx="105" cy="105" r="8" className="fill-gray-100 dark:fill-gray-800" />
        <circle cx="105" cy="105" r="30" fill="none" className="stroke-violet-400" strokeWidth="1" />

        {/* Rainbow lines on CD */}
        <path d="M 80,90 Q 105,80 130,90" fill="none" className="stroke-red-400" strokeWidth="1.5" />
        <path d="M 82,95 Q 105,85 128,95" fill="none" className="stroke-yellow-400" strokeWidth="1.5" />
        <path d="M 84,100 Q 105,90 126,100" fill="none" className="stroke-green-400" strokeWidth="1.5" />
        <path d="M 86,105 Q 105,95 124,105" fill="none" className="stroke-blue-400" strokeWidth="1.5" />

        <text x="105" y="148" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Tilt a CD under light.</text>

        {/* Step 2: Soap bubble */}
        <rect x="215" y="40" width="170" height="120" rx="8" className="fill-cyan-50 dark:fill-cyan-900/20" />
        <text x="300" y="60" textAnchor="middle" className="fill-cyan-700 dark:fill-cyan-300" fontSize="11" fontWeight="bold">Step 2: Soap Film</text>

        {/* Soap bubble */}
        <circle cx="300" cy="103" r="28" className="fill-sky-100 dark:fill-sky-800/30" opacity="0.6" />
        <circle cx="300" cy="103" r="28" fill="none" strokeWidth="2">
          <animate attributeName="stroke" values="#a855f7;#3b82f6;#22c55e;#eab308;#a855f7" dur="4s" repeatCount="indefinite" />
        </circle>
        <text x="300" y="107" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">thin film!</text>

        <text x="300" y="148" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Watch color bands shift.</text>

        {/* Step 3: Oil on water */}
        <rect x="410" y="40" width="170" height="120" rx="8" className="fill-amber-50 dark:fill-amber-900/20" />
        <text x="495" y="60" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="11" fontWeight="bold">Step 3: Oil on Water</text>

        {/* Water + oil */}
        <rect x="445" y="82" width="100" height="45" rx="4" className="fill-cyan-200 dark:fill-cyan-800/40" />
        <ellipse cx="495" cy="84" rx="50" ry="6" className="fill-amber-200 dark:fill-amber-700/40" />
        {/* Rainbow swirls */}
        <path d="M 465,84 Q 480,78 495,84 Q 510,90 525,84" fill="none" className="stroke-purple-400" strokeWidth="1" opacity="0.7" />
        <path d="M 470,86 Q 485,80 500,86 Q 515,92 530,86" fill="none" className="stroke-green-400" strokeWidth="1" opacity="0.7" />

        <text x="495" y="148" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Drop oil in a bowl of water.</text>

        {/* What to observe */}
        <rect x="20" y="175" width="560" height="65" rx="8" className="fill-indigo-50 dark:fill-indigo-900/20" />
        <text x="300" y="195" textAnchor="middle" className="fill-indigo-700 dark:fill-indigo-300" fontSize="11" fontWeight="bold">What to observe</text>
        <text x="300" y="214" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">1. Do the colors change when you change your viewing angle? (They should!)</text>
        <text x="300" y="228" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">2. In the soap film, do the color bands move as the film thins? (Yes \u2014 thinner = different colors.)</text>

        {/* Why it works */}
        <rect x="20" y="252" width="560" height="55" rx="8" className="fill-green-50 dark:fill-green-900/20" />
        <text x="300" y="272" textAnchor="middle" className="fill-green-700 dark:fill-green-300" fontSize="11" fontWeight="bold">Why it works \u2014 same physics as fish scales</text>
        <text x="300" y="290" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Light reflects off the top and bottom of a thin layer. The two reflections interfere:</text>
        <text x="300" y="304" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">in phase \u2192 bright color | out of phase \u2192 cancelled. Different thickness = different color.</text>
      </svg>
    </div>
  );
}
