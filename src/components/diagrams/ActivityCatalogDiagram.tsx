export default function ActivityCatalogDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 460" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Offline activity: organize 15 items into a catalog with categories, labels, and an index">
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f59e0b">
          Try This: Build a Paper Database
        </text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Organize 15+ items (books, spices, toys) so anyone can find any item fast
        </text>

        {/* Step 1: Collect */}
        <g transform="translate(40, 80)">
          <rect width="220" height="140" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" className="dark:fill-amber-950/20" />
          <text x="110" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f59e0b">Step 1: Collect</text>
          <text x="110" y="44" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Gather 15+ items</text>
          {/* Items */}
          {['📕 Book 1', '📗 Book 2', '🧂 Salt', '🌶️ Chili', '🧸 Bear', '🎲 Dice'].map((item, i) => (
            <text key={i} x={20 + (i % 2) * 105} y={70 + Math.floor(i / 2) * 22} fontSize="11" className="fill-gray-600 dark:fill-slate-300">{item}</text>
          ))}
          <text x="110" y="128" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500">...and more</text>
        </g>

        {/* Step 2: Categorize */}
        <g transform="translate(280, 80)">
          <rect width="220" height="140" rx="8" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.5" className="dark:fill-purple-950/20" />
          <text x="110" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="#8b5cf6">Step 2: Categorize</text>
          <text x="110" y="44" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Sort into groups</text>
          {[
            { label: 'Books', color: '#3b82f6', y: 65 },
            { label: 'Spices', color: '#f97316', y: 85 },
            { label: 'Toys', color: '#ec4899', y: 105 },
          ].map((cat, i) => (
            <g key={i}>
              <rect x="20" y={cat.y - 10} width="80" height="18" rx="4" fill={cat.color} opacity="0.15" />
              <text x="60" y={cat.y + 3} textAnchor="middle" fontSize="11" fontWeight="600" fill={cat.color}>{cat.label}</text>
              <line x1="110" y1={cat.y} x2="200" y2={cat.y} stroke={cat.color} strokeWidth="1" strokeDasharray="3,2" opacity="0.4" />
              <text x="155" y={cat.y + 4} fontSize="10" className="fill-gray-500 dark:fill-slate-400">{['5 items', '4 items', '6 items'][i]}</text>
            </g>
          ))}
        </g>

        {/* Step 3: Index */}
        <g transform="translate(520, 80)">
          <rect width="220" height="140" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" className="dark:fill-emerald-950/20" />
          <text x="110" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="#10b981">Step 3: Index Cards</text>
          <text x="110" y="44" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">One card per item</text>
          {/* Index card example */}
          <rect x="20" y="55" width="180" height="70" rx="4" className="fill-gray-50 dark:fill-slate-800" stroke="#d1d5db" strokeWidth="1" />
          <text x="30" y="72" fontSize="11" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Folktales of Assam</text>
          <text x="30" y="88" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Category: Books</text>
          <text x="30" y="102" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Location: Shelf 1, Slot 3</text>
          <text x="30" y="116" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Tags: folklore, Assam, stories</text>
        </g>

        {/* Step 4: Test */}
        <g transform="translate(140, 245)">
          <rect width="500" height="80" rx="8" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" className="dark:fill-red-950/20" />
          <text x="250" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">Step 4: Test It!</text>
          <text x="250" y="46" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Ask a friend: "Find the chili powder." Time them with a stopwatch.
          </text>
          <text x="250" y="64" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Could they find it without asking you? That is the test of good information architecture.
          </text>
        </g>

        {/* Think about it */}
        <rect x="60" y="345" width="660" height="90" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="370" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">
          Think About It
        </text>
        <text x="390" y="392" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          What if someone looks for "red things" instead of "spices"? Your categories would not help.
        </text>
        <text x="390" y="410" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          This is why databases use multiple access paths — categories AND tags AND search.
        </text>
        <text x="390" y="428" textAnchor="middle" fontSize="11" fontWeight="600" fill="#f59e0b">
          Dipankar sorted books by color when covers were missing — that was his access path!
        </text>
      </svg>
    </div>
  );
}
