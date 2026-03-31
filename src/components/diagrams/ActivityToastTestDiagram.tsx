export default function ActivityToastTestDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Offline activity: compare untoasted bread with toasted bread for color, smell, and taste differences">
        <rect width="780" height="380" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#d97706">Try This: See the Maillard Reaction Yourself</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Toast a piece of bread and compare it to the untoasted one — all three senses change</text>

        {/* Untoasted */}
        <g transform="translate(80, 80)">
          <rect width="260" height="200" rx="8" className="fill-gray-100 dark:fill-slate-800" />
          <text x="130" y="24" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-600 dark:fill-slate-300">Before (untoasted)</text>
          <rect x="60" y="40" width="140" height="60" rx="8" fill="#fef3c7" stroke="#e5e7eb" strokeWidth="1" />
          <text x="130" y="75" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Plain bread</text>

          <text x="20" y="125" fontSize="11" className="fill-gray-600 dark:fill-slate-300">👁️ Color: pale white/cream</text>
          <text x="20" y="148" fontSize="11" className="fill-gray-600 dark:fill-slate-300">👃 Smell: mild, yeasty</text>
          <text x="20" y="171" fontSize="11" className="fill-gray-600 dark:fill-slate-300">👅 Taste: bland, soft</text>
        </g>

        {/* Arrow */}
        <g transform="translate(365, 160)">
          <line x1="0" y1="0" x2="40" y2="0" stroke="#d97706" strokeWidth="3" />
          <polygon points="40,-4 50,0 40,4" fill="#d97706" />
          <text x="25" y="-10" textAnchor="middle" fontSize="10" fill="#d97706">🔥 Heat</text>
        </g>

        {/* Toasted */}
        <g transform="translate(440, 80)">
          <rect width="260" height="200" rx="8" className="fill-gray-100 dark:fill-slate-800" />
          <text x="130" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="#d97706">After (toasted)</text>
          <rect x="60" y="40" width="140" height="60" rx="8" fill="#92400e" opacity="0.4" stroke="#78350f" strokeWidth="1" />
          <text x="130" y="75" textAnchor="middle" fontSize="12" fill="#fef3c7">Golden toast</text>

          <text x="20" y="125" fontSize="11" fill="#d97706" fontWeight="600">👁️ Color: golden-brown</text>
          <text x="20" y="148" fontSize="11" fill="#d97706" fontWeight="600">👃 Smell: rich, nutty, complex</text>
          <text x="20" y="171" fontSize="11" fill="#d97706" fontWeight="600">👅 Taste: savory, crunchy, deep</text>
        </g>

        {/* Bottom explanation */}
        <rect x="60" y="300" width="660" height="64" rx="8" fill="#d97706" opacity="0.05" stroke="#d97706" strokeWidth="1" />
        <text x="390" y="320" textAnchor="middle" fontSize="12" fontWeight="700" fill="#d97706">What happened?</text>
        <text x="390" y="338" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          Heat triggered the Maillard reaction between amino acids and sugars in the bread
        </text>
        <text x="390" y="354" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          Same ingredients, same bread — but 1000+ new flavor molecules were created by heat alone!
        </text>
      </svg>
    </div>
  );
}
