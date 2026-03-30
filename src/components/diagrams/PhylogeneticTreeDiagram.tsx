export default function PhylogeneticTreeDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 605 395" className="w-full max-w-lg mx-auto" role="img" aria-label="Phylogenetic tree showing branching from common ancestor to bacteria, archaea, plants, fungi, and animals">
        <text x="250" y="25" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Tree of Life (Simplified)</text>

        {/* Root / Common ancestor */}
        <circle cx="60" cy="175" r="18" className="fill-amber-200 dark:fill-amber-800 stroke-amber-500" strokeWidth="2" />
        <text x="60" y="170" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">Common</text>
        <text x="60" y="182" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">Ancestor</text>

        {/* Main trunk */}
        <line x1="78" y1="175" x2="130" y2="175" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2.5" />

        {/* First split: Bacteria vs rest */}
        <line x1="130" y1="175" x2="130" y2="70" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        <line x1="130" y1="70" x2="200" y2="70" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        <line x1="130" y1="175" x2="180" y2="175" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />

        {/* Branch point label */}
        <circle cx="130" cy="175" r="4" className="fill-red-400" />
        <text x="130" y="195" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="10">~3.5 bya</text>

        {/* Second split: Archaea vs Eukaryotes */}
        <line x1="180" y1="175" x2="180" y2="120" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        <line x1="180" y1="120" x2="260" y2="120" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        <line x1="180" y1="175" x2="240" y2="175" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />

        <circle cx="180" cy="175" r="4" className="fill-red-400" />
        <text x="180" y="195" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="10">~2.7 bya</text>

        {/* Third split: Plants vs rest */}
        <line x1="240" y1="175" x2="240" y2="230" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        <line x1="240" y1="230" x2="320" y2="230" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        <line x1="240" y1="175" x2="300" y2="175" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />

        <circle cx="240" cy="175" r="4" className="fill-red-400" />

        {/* Fourth split: Fungi vs Animals */}
        <line x1="300" y1="175" x2="300" y2="270" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        <line x1="300" y1="270" x2="380" y2="270" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        <line x1="300" y1="175" x2="380" y2="175" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />

        <circle cx="300" cy="175" r="4" className="fill-red-400" />

        {/* Terminal nodes */}
        {/* Bacteria */}
        <rect x="200" y="52" width="80" height="35" rx="8" className="fill-sky-100 dark:fill-sky-900/40 stroke-sky-400" strokeWidth="1.5" />
        <text x="240" y="67" textAnchor="middle" className="fill-sky-700 dark:fill-sky-300" fontSize="11" fontWeight="bold">Bacteria</text>
        <text x="240" y="80" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">single-celled</text>

        {/* Archaea */}
        <rect x="260" y="102" width="80" height="35" rx="8" className="fill-purple-100 dark:fill-purple-900/40 stroke-purple-400" strokeWidth="1.5" />
        <text x="300" y="117" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="11" fontWeight="bold">Archaea</text>
        <text x="300" y="130" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">extremophiles</text>

        {/* Plants */}
        <rect x="320" y="212" width="80" height="35" rx="8" className="fill-emerald-100 dark:fill-emerald-900/40 stroke-emerald-400" strokeWidth="1.5" />
        <text x="360" y="227" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="11" fontWeight="bold">Plants</text>
        <text x="360" y="240" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">photosynthetic</text>

        {/* Fungi */}
        <rect x="380" y="252" width="80" height="35" rx="8" className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-400" strokeWidth="1.5" />
        <text x="420" y="267" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="11" fontWeight="bold">Fungi</text>
        <text x="420" y="280" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">decomposers</text>

        {/* Animals */}
        <rect x="380" y="157" width="80" height="35" rx="8" className="fill-red-100 dark:fill-red-900/40 stroke-red-400" strokeWidth="1.5" />
        <text x="420" y="172" textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="11" fontWeight="bold">Animals</text>
        <text x="420" y="185" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">consumers</text>

        {/* Eukaryotes bracket */}
        <rect x="228" y="150" width="250" height="140" rx="6" fill="none" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="5,4" />
        <text x="475" y="148" className="fill-gray-400 dark:fill-gray-500" fontSize="10">Eukaryotes</text>

        {/* Time arrow */}
        <line x1="60" y1="330" x2="460" y2="330" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#phyloArrow)" />
        <text x="250" y="345" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Time →</text>

        <defs>
          <marker id="phyloArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-400 dark:fill-gray-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
