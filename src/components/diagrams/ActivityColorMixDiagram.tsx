export default function ActivityColorMixDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: test subtractive color mixing with paints or food coloring on white paper"
      >
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#ec4899">
          Try This: Prove Subtractive Mixing Yourself
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          You need: red, blue, and yellow paint (or food coloring), white paper, a brush, water
        </text>

        {/* Step 1 */}
        <rect x="30" y="75" width="350" height="150" rx="10" className="fill-white dark:fill-slate-900" stroke="#ec4899" strokeWidth="1.5" />
        <circle cx="55" cy="100" r="14" fill="#ec4899" fillOpacity="0.2" />
        <text x="55" y="106" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ec4899">1</text>
        <text x="78" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Paint 3 overlapping circles</text>
        {/* Three circles overlapping */}
        <circle cx="150" cy="170" r="35" fill="#ef4444" fillOpacity="0.4" />
        <circle cx="210" cy="170" r="35" fill="#3b82f6" fillOpacity="0.4" />
        <circle cx="180" cy="215" r="35" fill="#eab308" fillOpacity="0.4" />
        {/* Overlap labels */}
        <text x="180" y="155" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">purple?</text>
        <text x="145" y="200" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">orange?</text>
        <text x="215" y="200" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">green?</text>
        <text x="180" y="185" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">dark?</text>

        {/* Step 2 */}
        <rect x="400" y="75" width="350" height="150" rx="10" className="fill-white dark:fill-slate-900" stroke="#ec4899" strokeWidth="1.5" />
        <circle cx="425" cy="100" r="14" fill="#ec4899" fillOpacity="0.2" />
        <text x="425" y="106" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ec4899">2</text>
        <text x="448" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Record what you see</text>
        <text x="415" y="135" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} Red + Blue = ???</text>
        <text x="415" y="155" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} Red + Yellow = ???</text>
        <text x="415" y="175" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} Blue + Yellow = ???</text>
        <text x="415" y="195" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} All three = ???</text>
        <text x="415" y="215" fontSize="10" fill="#ec4899" fontWeight="600">
          Predict FIRST, then check!
        </text>

        {/* Step 3 */}
        <rect x="30" y="245" width="350" height="130" rx="10" className="fill-white dark:fill-slate-900" stroke="#ec4899" strokeWidth="1.5" />
        <circle cx="55" cy="270" r="14" fill="#ec4899" fillOpacity="0.2" />
        <text x="55" y="276" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ec4899">3</text>
        <text x="78" y="276" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Compare wet vs dry paint</text>
        <rect x="60" y="295" width="80" height="30" rx="4" fill="#3b82f6" fillOpacity="0.6" />
        <text x="100" y="315" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="600">Wet</text>
        <rect x="160" y="295" width="80" height="30" rx="4" fill="#3b82f6" fillOpacity="0.3" />
        <text x="200" y="315" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300" fontWeight="600">Dry</text>
        <text x="290" y="310" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{'\u2190'} lighter!</text>
        <text x="60" y="355" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Watercolors dry 20-40% lighter {'\u2014'} water reflects
        </text>
        <text x="60" y="368" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          extra light back at you while still wet
        </text>

        {/* Step 4 */}
        <rect x="400" y="245" width="350" height="130" rx="10" className="fill-white dark:fill-slate-900" stroke="#ec4899" strokeWidth="1.5" />
        <circle cx="425" cy="270" r="14" fill="#ec4899" fillOpacity="0.2" />
        <text x="425" y="276" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ec4899">4</text>
        <text x="448" y="276" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Capillary action test</text>
        <text x="415" y="300" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          Put a drop of paint on dry paper.
        </text>
        <text x="415" y="318" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          Put a drop on wet paper.
        </text>
        <text x="415" y="336" fontSize="11" fontWeight="600" fill="#ec4899">
          Watch it spread faster on wet paper!
        </text>
        <text x="415" y="358" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          The water already in the paper pulls the new
        </text>
        <text x="415" y="371" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          drop outward through capillary action
        </text>

        {/* Bottom summary */}
        <rect x="80" y="395" width="620" height="48" rx="10" fill="#ec4899" fillOpacity="0.1" stroke="#ec4899" strokeWidth="1" />
        <text x="390" y="415" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ec4899">
          What you learned:
        </text>
        <text x="390" y="432" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-pink-300">
          Mixing pigments subtracts light. Each added pigment removes wavelengths. More mixing = darker, not brighter.
        </text>
      </svg>
    </div>
  );
}
