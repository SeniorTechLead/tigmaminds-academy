export default function MatrixMultiplicationDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 525 271" className="w-full max-w-lg mx-auto" role="img" aria-label="Matrix multiplication diagram showing 2x2 times 2x2 with row-by-column dot product">
        {/* Matrix A */}
        <text x="65" y="30" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="12" fontWeight="bold">A</text>
        <rect x="20" y="40" width="90" height="80" rx="4" fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        {/* Row 1 highlighted */}
        <rect x="22" y="42" width="86" height="36" rx="2" className="fill-blue-100 dark:fill-blue-900/40" />
        <text x="42" y="66" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="14" fontWeight="600">1</text>
        <text x="88" y="66" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="14" fontWeight="600">2</text>
        {/* Row 2 */}
        <text x="42" y="105" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14">3</text>
        <text x="88" y="105" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14">4</text>

        {/* Multiplication sign */}
        <text x="130" y="85" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="18" fontWeight="bold">×</text>

        {/* Matrix B */}
        <text x="195" y="30" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="12" fontWeight="bold">B</text>
        <rect x="150" y="40" width="90" height="80" rx="4" fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        {/* Column 1 highlighted */}
        <rect x="152" y="42" width="42" height="76" rx="2" className="fill-amber-100 dark:fill-amber-900/40" />
        <text x="173" y="66" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="14" fontWeight="600">5</text>
        <text x="218" y="66" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14">6</text>
        <text x="173" y="105" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="14" fontWeight="600">7</text>
        <text x="218" y="105" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14">8</text>

        {/* Equals sign */}
        <text x="260" y="85" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="18" fontWeight="bold">=</text>

        {/* Result Matrix */}
        <text x="335" y="30" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="12" fontWeight="bold">Result</text>
        <rect x="280" y="40" width="110" height="80" rx="4" fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        {/* Highlighted result cell */}
        <rect x="282" y="42" width="52" height="36" rx="2" className="fill-emerald-100 dark:fill-emerald-900/40" />
        <text x="308" y="66" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="14" fontWeight="bold">19</text>
        <text x="362" y="66" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14">22</text>
        <text x="308" y="105" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14">43</text>
        <text x="362" y="105" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14">50</text>

        {/* Dot product explanation */}
        <rect x="60" y="145" width="380" height="45" rx="6" className="fill-gray-100 dark:fill-gray-800" />
        <text x="250" y="165" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="600">
          Row 1 · Column 1 = (1×5) + (2×7) = 5 + 14 = 19
        </text>
        <text x="250" y="182" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Each result cell = dot product of a row from A and a column from B
        </text>

        {/* Connection arrows */}
        <path d="M 65,78 Q 65,135 140,160" fill="none" className="stroke-blue-400" strokeWidth="1.5" strokeDasharray="4,3" />
        <path d="M 173,120 Q 173,140 175,160" fill="none" className="stroke-amber-400" strokeWidth="1.5" strokeDasharray="4,3" />
        <path d="M 308,78 Q 308,135 280,155" fill="none" className="stroke-emerald-400" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Legend */}
        <rect x="80" y="210" width="12" height="12" rx="2" className="fill-blue-200 dark:fill-blue-800" />
        <text x="98" y="221" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Row from A</text>
        <rect x="190" y="210" width="12" height="12" rx="2" className="fill-amber-200 dark:fill-amber-800" />
        <text x="208" y="221" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Column from B</text>
        <rect x="310" y="210" width="12" height="12" rx="2" className="fill-emerald-200 dark:fill-emerald-800" />
        <text x="328" y="221" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Result cell</text>
      </svg>
    </div>
  );
}
