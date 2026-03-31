export default function ThreadTensionDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Comparison showing how thread tension affects fabric: too loose causes gaps, too tight causes puckering, just right creates strong even cloth"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Thread Tension and Fabric Strength
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Getting the tension right is the hardest skill in weaving
        </text>

        {/* Too Loose */}
        <rect x="30" y="75" width="230" height="250" rx="10" className="fill-white dark:fill-slate-900" stroke="#ef4444" strokeWidth="1.5" />
        <text x="145" y="100" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">
          Too Loose {'\u2716'}
        </text>
        {/* Loose weave */}
        <g transform="translate(50, 115)">
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <path key={`wl${i}`} d={`M${15 + i * 27},0 Q${15 + i * 27 + 5},50 ${15 + i * 27 - 3},100 Q${15 + i * 27 + 8},150 ${15 + i * 27},180`} fill="none" stroke="#6366f1" strokeWidth="2" opacity="0.5" />
          ))}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <path key={`hl${i}`} d={`M0,${15 + i * 30} Q50,${20 + i * 30} 100,${12 + i * 30} Q150,${22 + i * 30} 190,${15 + i * 30}`} fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.5" />
          ))}
        </g>
        <text x="145" y="310" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          Threads wander, leaving gaps
        </text>
        <text x="145" y="326" textAnchor="middle" fontSize="10" fill="#ef4444">
          Weak fabric, uneven, sloppy
        </text>

        {/* Just Right */}
        <rect x="275" y="75" width="230" height="250" rx="10" className="fill-white dark:fill-slate-900" stroke="#22c55e" strokeWidth="2" />
        <text x="390" y="100" textAnchor="middle" fontSize="13" fontWeight="700" fill="#22c55e">
          Just Right {'\u2714'}
        </text>
        {/* Even weave */}
        <g transform="translate(295, 115)">
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <line key={`wr${i}`} x1={15 + i * 27} y1="0" x2={15 + i * 27} y2="180" stroke="#6366f1" strokeWidth="2.5" opacity="0.7" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <line key={`hr${i}`} x1="0" y1={15 + i * 26} x2="190" y2={15 + i * 26} stroke="#f59e0b" strokeWidth="2.5" opacity="0.7" />
          ))}
        </g>
        <text x="390" y="310" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          Even spacing, consistent grid
        </text>
        <text x="390" y="326" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="600">
          Strong, uniform, beautiful
        </text>

        {/* Too Tight */}
        <rect x="520" y="75" width="230" height="250" rx="10" className="fill-white dark:fill-slate-900" stroke="#ef4444" strokeWidth="1.5" />
        <text x="635" y="100" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">
          Too Tight {'\u2716'}
        </text>
        {/* Puckered weave */}
        <g transform="translate(540, 115)">
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <line key={`wt${i}`} x1={15 + i * 24} y1="0" x2={15 + i * 24} y2="180" stroke="#6366f1" strokeWidth="3" opacity="0.7" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <line key={`ht${i}`} x1="0" y1={10 + i * 20} x2="170" y2={10 + i * 20} stroke="#f59e0b" strokeWidth="3" opacity="0.7" />
          ))}
        </g>
        <text x="635" y="310" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          Threads compressed, fabric buckles
        </text>
        <text x="635" y="326" textAnchor="middle" fontSize="10" fill="#ef4444">
          Puckered, distorted, may tear
        </text>

        {/* Bottom explanation */}
        <rect x="80" y="350" width="620" height="55" rx="10" fill="#22c55e" fillOpacity="0.08" stroke="#22c55e" strokeWidth="1" />
        <text x="390" y="372" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-800 dark:fill-green-200">
          A Tawang weaver adjusts tension by feel {'\u2014'} the backstrap presses against her body
        </text>
        <text x="390" y="392" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-green-300">
          Leaning back increases tension, leaning forward decreases it. The human body IS the tensioning device.
        </text>
      </svg>
    </div>
  );
}
