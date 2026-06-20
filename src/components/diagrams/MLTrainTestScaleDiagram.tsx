/**
 * Data preparation: split the full dataset into train/test, then scale features
 * to a common range. Two-step flow.
 *
 * Used in the "Preparing Data with scikit-learn" section.
 */
export default function MLTrainTestScaleDiagram() {
  const W = 740, H = 280;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Full dataset splits into an 80 percent training set and 20 percent test set, then features are scaled to a common range.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Split first, then scale</text>

        {/* Full dataset */}
        <rect x="40" y="80" width="150" height="70" rx="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" className="dark:fill-gray-700 dark:stroke-gray-500" />
        <text x="115" y="110" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155" className="dark:fill-gray-100">Full dataset</text>
        <text x="115" y="130" textAnchor="middle" fontSize="10" fill="#64748b" className="dark:fill-gray-400">all rows</text>

        {/* Arrow */}
        <line x1="190" y1="115" x2="250" y2="115" stroke="#64748b" strokeWidth="2" markerEnd="url(#mtts-a)" />

        {/* Train (80%) */}
        <rect x="255" y="60" width="180" height="48" rx="9" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
        <text x="345" y="80" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">Training set — 80%</text>
        <text x="345" y="98" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-300">model learns from this</text>

        {/* Test (20%) */}
        <rect x="255" y="122" width="180" height="48" rx="9" fill="#ffedd5" stroke="#f97316" strokeWidth="1.5" className="dark:fill-orange-900/30 dark:stroke-orange-400" />
        <text x="345" y="142" textAnchor="middle" fontSize="12" fontWeight="700" fill="#c2410c" className="dark:fill-orange-300">Test set — 20%</text>
        <text x="345" y="160" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-300">held back for grading</text>

        {/* Arrow to scaling */}
        <line x1="435" y1="115" x2="495" y2="115" stroke="#64748b" strokeWidth="2" markerEnd="url(#mtts-a)" />

        {/* Scaling */}
        <rect x="500" y="70" width="200" height="90" rx="10" fill="#ffffff" stroke="#16a34a" strokeWidth="1.5" className="dark:fill-gray-800 dark:stroke-green-400" />
        <text x="600" y="92" textAnchor="middle" fontSize="12" fontWeight="700" fill="#15803d" className="dark:fill-green-300">Scale features</text>
        <text x="600" y="112" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-300">e.g. 0–1000 and 0–1</text>
        <text x="600" y="128" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-300">become the same range</text>
        <text x="600" y="148" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#15803d" className="dark:fill-green-300">fit on train only</text>

        <defs>
          <marker id="mtts-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#64748b" /></marker>
        </defs>
      </svg>
    </div>
  );
}
