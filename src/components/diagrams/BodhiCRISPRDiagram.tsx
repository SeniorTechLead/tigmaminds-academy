export default function BodhiCRISPRDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 570 400" className="w-full max-w-lg mx-auto" role="img" aria-label="CRISPR gene editing and cloning ethics overview">
        <rect width="570" height="400" rx="12" className="fill-white dark:fill-slate-900" />
        <text x="285" y="28" textAnchor="middle" className="fill-rose-400" fontSize="14" fontWeight="bold">Cloning: Plants vs Animals vs Gene Editing</text>

        {/* Three columns */}
        {/* Column 1: Plant Cloning */}
        <rect x="20" y="50" width="165" height="175" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="102" y="72" textAnchor="middle" className="fill-green-400" fontSize="11" fontWeight="bold">Plant Cloning</text>
        <circle cx="102" cy="98" r="16" className="fill-green-700" />
        <text x="102" y="102" textAnchor="middle" className="fill-green-300" fontSize="16">🌱</text>
        <text x="102" y="130" textAnchor="middle" className="fill-emerald-300" fontSize="10" fontWeight="bold">Easy</text>
        <text x="102" y="145" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Cells are totipotent</text>
        <text x="102" y="158" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Any cell can become</text>
        <text x="102" y="170" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">a whole new plant</text>
        <text x="102" y="190" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">Done for 1000s of years</text>
        <text x="102" y="205" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">Bananas, grapes, roses</text>
        <rect x="30" y="213" width="145" height="5" rx="2" className="fill-green-500" />

        {/* Column 2: Animal Cloning */}
        <rect x="200" y="50" width="165" height="175" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="282" y="72" textAnchor="middle" className="fill-amber-400" fontSize="11" fontWeight="bold">Animal Cloning</text>
        <circle cx="282" cy="98" r="16" className="fill-amber-800" />
        <text x="282" y="102" textAnchor="middle" className="fill-amber-300" fontSize="16">🐑</text>
        <text x="282" y="130" textAnchor="middle" className="fill-red-400" fontSize="10" fontWeight="bold">Very Hard</text>
        <text x="282" y="145" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Cells are specialized</text>
        <text x="282" y="158" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Must reprogram nucleus</text>
        <text x="282" y="170" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">High failure rate</text>
        <text x="282" y="190" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">Dolly the Sheep (1996)</text>
        <text x="282" y="205" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">277 tries for 1 success</text>
        <rect x="210" y="213" width="145" height="5" rx="2" className="fill-amber-500" />

        {/* Column 3: CRISPR */}
        <rect x="380" y="50" width="165" height="175" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="462" y="72" textAnchor="middle" className="fill-violet-400" fontSize="11" fontWeight="bold">CRISPR Gene Editing</text>
        <circle cx="462" cy="98" r="16" className="fill-violet-800" />
        <text x="462" y="102" textAnchor="middle" className="fill-violet-300" fontSize="16">✂</text>
        <text x="462" y="130" textAnchor="middle" className="fill-violet-300" fontSize="10" fontWeight="bold">Precise Editing</text>
        <text x="462" y="145" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Find a specific gene</text>
        <text x="462" y="158" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Cut it out or replace it</text>
        <text x="462" y="170" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Like find-and-replace</text>
        <text x="462" y="190" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">2012: Doudna & Charpentier</text>
        <text x="462" y="205" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">Nobel Prize 2020</text>
        <rect x="390" y="213" width="145" height="5" rx="2" className="fill-violet-500" />

        {/* CRISPR mechanism */}
        <text x="285" y="248" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="11" fontWeight="bold">How CRISPR Works</text>

        {/* DNA strand */}
        <rect x="50" y="265" width="470" height="20" rx="4" className="fill-blue-900" opacity="0.5" />
        <text x="285" y="280" textAnchor="middle" className="fill-blue-300" fontSize="9">... A T G C C G | T A G G C A | C T A A G T ...</text>

        {/* Guide RNA finding target */}
        <path d="M 235,263 Q 235,250 270,250 Q 305,250 305,263" fill="none" className="stroke-yellow-400" strokeWidth="1.5" />
        <text x="270" y="247" textAnchor="middle" className="fill-yellow-400" fontSize="8" fontWeight="bold">Guide RNA</text>
        <text x="270" y="237" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="7">"find this sequence"</text>

        {/* Cas9 scissors */}
        <text x="230" y="302" textAnchor="middle" className="fill-red-400" fontSize="10">✂</text>
        <text x="310" y="302" textAnchor="middle" className="fill-red-400" fontSize="10">✂</text>
        <text x="270" y="312" textAnchor="middle" className="fill-red-300" fontSize="8">Cas9 cuts here</text>

        {/* Result options */}
        <line x1="270" y1="318" x2="150" y2="340" className="stroke-slate-500" strokeWidth="1" />
        <line x1="270" y1="318" x2="400" y2="340" className="stroke-slate-500" strokeWidth="1" />

        <rect x="80" y="340" width="140" height="22" rx="4" className="fill-gray-100 dark:fill-slate-800" />
        <text x="150" y="355" textAnchor="middle" className="fill-teal-300" fontSize="9">Delete a harmful gene</text>

        <rect x="330" y="340" width="140" height="22" rx="4" className="fill-gray-100 dark:fill-slate-800" />
        <text x="400" y="355" textAnchor="middle" className="fill-teal-300" fontSize="9">Insert a better one</text>

        {/* Ethics bar */}
        <rect x="50" y="375" width="470" height="18" rx="4" className="fill-rose-900" opacity="0.4" />
        <text x="285" y="388" textAnchor="middle" className="fill-rose-300" fontSize="9" fontWeight="bold">Key question: Just because we CAN edit genes, SHOULD we? Who decides?</text>
      </svg>
    </div>
  );
}
