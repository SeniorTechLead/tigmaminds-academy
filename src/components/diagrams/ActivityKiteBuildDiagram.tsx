const ActivityKiteBuildDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 651 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Step-by-step diagram for building a simple diamond kite from newspaper and bamboo sticks"
      >
        <style>{`
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 12px;
            font-weight: 600;
          }
          .section-title {
            font-family: system-ui, sans-serif;
            font-size: 11px;
            font-weight: 600;
          }
          .fact-text {
            font-family: system-ui, sans-serif;
            font-size: 9.5px;
          }
          .step-num {
            font-family: system-ui, sans-serif;
            font-size: 14px;
            font-weight: 700;
          }
        `}</style>

        {/* Background */}
        <rect width="600" height="480" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="24" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Build Biren’s Kite — A Newspaper Diamond
        </text>

        {/* === STEP 1: Frame === */}
        <rect x="15" y="40" width="135" height="190" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.5" />
        <circle cx="30" cy="55" r="10" className="fill-amber-400 dark:fill-amber-600" />
        <text x="30" y="60" textAnchor="middle"
          className="step-num fill-white dark:fill-slate-100">1</text>

        <text x="45" y="58" className="section-title fill-amber-700 dark:fill-amber-300">
          Build the Frame
        </text>

        {/* Two crossed sticks */}
        <line x1="82" y1="75" x2="82" y2="175" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
        <line x1="42" y1="115" x2="122" y2="115" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />

        {/* Cross-binding */}
        <circle cx="82" cy="115" r="5" fill="none" stroke="#fbbf24" strokeWidth="2" />

        {/* Measurements */}
        <text x="88" y="90" className="fact-text fill-slate-500 dark:fill-slate-400">
          60 cm
        </text>
        <text x="56" y="110" className="fact-text fill-slate-500 dark:fill-slate-400">
          45 cm
        </text>

        <text x="25" y="195" className="fact-text fill-slate-600 dark:fill-slate-300">
          Bamboo slivers or
        </text>
        <text x="25" y="207" className="fact-text fill-slate-600 dark:fill-slate-300">
          wooden sticks. Tie at
        </text>
        <text x="25" y="219" className="fact-text fill-slate-600 dark:fill-slate-300">
          1/3 from the top.
        </text>

        {/* === STEP 2: String frame === */}
        <rect x="160" y="40" width="135" height="190" rx="6"
          className="fill-sky-50 dark:fill-sky-950" opacity="0.5" />
        <circle cx="175" cy="55" r="10" className="fill-sky-400 dark:fill-sky-600" />
        <text x="175" y="60" textAnchor="middle"
          className="step-num fill-white dark:fill-slate-100">2</text>

        <text x="190" y="58" className="section-title fill-sky-700 dark:fill-sky-300">
          String Border
        </text>

        {/* Diamond outline with sticks */}
        <line x1="227" y1="75" x2="227" y2="175" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
        <line x1="187" y1="115" x2="267" y2="115" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
        {/* String connecting endpoints */}
        <polygon points="227,75 267,115 227,175 187,115"
          fill="none" stroke="#60a5fa" strokeWidth="2" />

        <text x="170" y="195" className="fact-text fill-slate-600 dark:fill-slate-300">
          Run string around all
        </text>
        <text x="170" y="207" className="fact-text fill-slate-600 dark:fill-slate-300">
          4 stick tips. This is
        </text>
        <text x="170" y="219" className="fact-text fill-slate-600 dark:fill-slate-300">
          the kite’s outline.
        </text>

        {/* === STEP 3: Cover === */}
        <rect x="305" y="40" width="135" height="190" rx="6"
          className="fill-green-50 dark:fill-green-950" opacity="0.5" />
        <circle cx="320" cy="55" r="10" className="fill-green-400 dark:fill-green-600" />
        <text x="320" y="60" textAnchor="middle"
          className="step-num fill-white dark:fill-slate-100">3</text>

        <text x="335" y="58" className="section-title fill-green-700 dark:fill-green-300">
          Cover It
        </text>

        {/* Filled diamond (newspaper) */}
        <polygon points="372,75 412,115 372,175 332,115"
          className="fill-slate-200 dark:fill-slate-600" stroke="#64748b" strokeWidth="1.5" />
        {/* Newspaper text lines */}
        <line x1="348" y1="105" x2="396" y2="105" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.5" />
        <line x1="350" y1="112" x2="394" y2="112" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.5" />
        <line x1="352" y1="119" x2="392" y2="119" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.5" />
        <line x1="349" y1="126" x2="395" y2="126" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.5" />

        <text x="315" y="195" className="fact-text fill-slate-600 dark:fill-slate-300">
          Lay frame on newspaper.
        </text>
        <text x="315" y="207" className="fact-text fill-slate-600 dark:fill-slate-300">
          Cut 2 cm outside string.
        </text>
        <text x="315" y="219" className="fact-text fill-slate-600 dark:fill-slate-300">
          Fold &amp; glue over string.
        </text>

        {/* === STEP 4: Bridle + tail === */}
        <rect x="450" y="40" width="135" height="190" rx="6"
          className="fill-purple-50 dark:fill-purple-950" opacity="0.5" />
        <circle cx="465" cy="55" r="10" className="fill-purple-400 dark:fill-purple-600" />
        <text x="465" y="60" textAnchor="middle"
          className="step-num fill-white dark:fill-slate-100">4</text>

        <text x="480" y="58" className="section-title fill-purple-700 dark:fill-purple-300">
          Bridle &amp; Tail
        </text>

        {/* Kite with bridle */}
        <polygon points="517,75 547,110 517,155 487,110"
          className="fill-amber-200 dark:fill-amber-600" stroke="#d97706" strokeWidth="1" />

        {/* Bridle lines */}
        <line x1="517" y1="90" x2="505" y2="130"
          stroke="#78716c" strokeWidth="1.5" />
        <line x1="517" y1="135" x2="505" y2="130"
          stroke="#78716c" strokeWidth="1.5" />
        {/* Bridle point */}
        <circle cx="505" cy="130" r="3" className="fill-red-400 dark:fill-red-500" />
        <text x="460" y="132" className="fact-text fill-red-500 dark:fill-red-400" fontSize="8">
          bridle
        </text>
        <text x="460" y="142" className="fact-text fill-red-500 dark:fill-red-400" fontSize="8">
          point
        </text>

        {/* Tail */}
        <polyline points="517,155 512,170 522,182 510,192 520,202"
          fill="none" stroke="#e879f9" strokeWidth="2.5" strokeLinecap="round" />

        <text x="460" y="195" className="fact-text fill-slate-600 dark:fill-slate-300">
          Tie bridle from top
        </text>
        <text x="460" y="207" className="fact-text fill-slate-600 dark:fill-slate-300">
          &amp; bottom of spine.
        </text>
        <text x="460" y="219" className="fact-text fill-slate-600 dark:fill-slate-300">
          Add 1m plastic tail.
        </text>

        {/* === BOTTOM: Science experiments === */}
        <rect x="15" y="245" width="570" height="100" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="300" y="265" textAnchor="middle"
          className="section-title fill-slate-700 dark:fill-slate-200">
          Now Test It — Like a Scientist
        </text>

        <text x="30" y="285" className="fact-text fill-slate-600 dark:fill-slate-300">
          • Fly it. Measure the string angle from vertical (use a protractor or your phone’s angle tool).
        </text>
        <text x="30" y="300" className="fact-text fill-slate-600 dark:fill-slate-300">
          • Shorten the tail by half. Does the kite become less stable? More stable? Why?
        </text>
        <text x="30" y="315" className="fact-text fill-slate-600 dark:fill-slate-300">
          • Move the bridle point up 2 cm. What happens to the angle of attack? Does it fly higher or lower?
        </text>
        <text x="30" y="330" className="fact-text fill-amber-600 dark:fill-amber-400" fontWeight="600">
          • Record everything. Change ONE variable at a time. This is how real engineers test — change, measure, compare.
        </text>

        {/* Materials list */}
        <rect x="15" y="358" width="280" height="108" rx="6"
          className="fill-green-50 dark:fill-green-950 stroke-green-200 dark:stroke-green-800" strokeWidth="1" />
        <text x="155" y="378" textAnchor="middle"
          className="section-title fill-green-700 dark:fill-green-300">
          Materials (total cost: ~₹5)
        </text>
        <text x="30" y="396" className="fact-text fill-slate-600 dark:fill-slate-300">
          • 2 thin sticks (bamboo, reed, or dowel)
        </text>
        <text x="30" y="410" className="fact-text fill-slate-600 dark:fill-slate-300">
          • 1 newspaper sheet (or light plastic bag)
        </text>
        <text x="30" y="424" className="fact-text fill-slate-600 dark:fill-slate-300">
          • Thread or thin string (for bridle + flying)
        </text>
        <text x="30" y="438" className="fact-text fill-slate-600 dark:fill-slate-300">
          • Tape or glue (rice paste works!)
        </text>
        <text x="30" y="452" className="fact-text fill-slate-600 dark:fill-slate-300">
          • Plastic strip for tail (old bag, cut into ribbon)
        </text>

        {/* Physics checklist */}
        <rect x="305" y="358" width="280" height="108" rx="6"
          className="fill-amber-50 dark:fill-amber-950 stroke-amber-200 dark:stroke-amber-800" strokeWidth="1" />
        <text x="445" y="378" textAnchor="middle"
          className="section-title fill-amber-700 dark:fill-amber-300">
          Physics You’ll See in Action
        </text>
        <text x="315" y="396" className="fact-text fill-slate-600 dark:fill-slate-300">
          ✓ Lift: your kite rises against gravity
        </text>
        <text x="315" y="410" className="fact-text fill-slate-600 dark:fill-slate-300">
          ✓ Drag: the force you feel pulling the string
        </text>
        <text x="315" y="424" className="fact-text fill-slate-600 dark:fill-slate-300">
          ✓ Angle of attack: set by your bridle position
        </text>
        <text x="315" y="438" className="fact-text fill-slate-600 dark:fill-slate-300">
          ✓ Stability: provided by the tail’s trailing drag
        </text>
        <text x="315" y="452" className="fact-text fill-slate-600 dark:fill-slate-300">
          ✓ Wind energy: the invisible engine powering it all
        </text>
      </svg>
    </div>
  );
};

export default ActivityKiteBuildDiagram;
