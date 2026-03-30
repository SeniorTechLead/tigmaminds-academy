export default function LungsDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 517 370" className="w-full max-w-lg mx-auto" role="img" aria-label="Lungs and gas exchange diagram">
        <defs>
          <marker id="lung-red" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" className="fill-red-500" />
          </marker>
          <marker id="lung-blue" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" className="fill-blue-500" />
          </marker>
        </defs>

        {/* Title */}
        <text x="180" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">The Lungs &amp; Gas Exchange</text>

        {/* Trachea */}
        <rect x="165" y="28" width="30" height="50" rx="6" className="fill-sky-200 dark:fill-sky-800" stroke="#0ea5e9" strokeWidth="1.5" />
        <text x="180" y="55" textAnchor="middle" className="fill-sky-700 dark:fill-sky-200" fontSize="10">Trachea</text>

        {/* Left bronchus */}
        <path d="M 165,78 Q 130,95 100,120" className="stroke-sky-400" strokeWidth="8" fill="none" strokeLinecap="round" />
        {/* Right bronchus */}
        <path d="M 195,78 Q 230,95 260,120" className="stroke-sky-400" strokeWidth="8" fill="none" strokeLinecap="round" />

        {/* Left lung */}
        <path d="M 40,100 Q 30,180 50,260 Q 80,290 130,280 Q 155,260 160,200 Q 160,130 140,100 Q 100,80 40,100 Z"
          className="fill-pink-100 dark:fill-pink-950" stroke="#ec4899" strokeWidth="2" />
        {/* Left bronchial branches */}
        <path d="M 100,120 Q 85,140 75,165" className="stroke-sky-400" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 100,120 Q 110,150 105,175" className="stroke-sky-400" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 85,140 Q 65,160 60,185" className="stroke-sky-400" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 85,140 Q 90,170 80,195" className="stroke-sky-400" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 110,150 Q 120,175 115,200" className="stroke-sky-400" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Right lung */}
        <path d="M 200,100 Q 200,130 200,200 Q 205,260 230,280 Q 280,290 310,260 Q 330,180 320,100 Q 270,80 200,100 Z"
          className="fill-pink-100 dark:fill-pink-950" stroke="#ec4899" strokeWidth="2" />
        {/* Right bronchial branches */}
        <path d="M 260,120 Q 275,140 285,165" className="stroke-sky-400" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 260,120 Q 250,150 255,175" className="stroke-sky-400" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 275,140 Q 295,160 300,185" className="stroke-sky-400" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 275,140 Q 270,170 280,195" className="stroke-sky-400" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 250,150 Q 240,175 245,200" className="stroke-sky-400" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Lung labels */}
        <text x="85" y="250" textAnchor="middle" className="fill-pink-600 dark:fill-pink-300" fontSize="11" fontWeight="600">Left Lung</text>
        <text x="265" y="250" textAnchor="middle" className="fill-pink-600 dark:fill-pink-300" fontSize="11" fontWeight="600">Right Lung</text>

        {/* Alveoli zoom inset */}
        <rect x="330" y="100" width="115" height="140" rx="8" className="fill-gray-50 dark:fill-gray-900" stroke="#6b7280" strokeWidth="1.5" />
        <text x="387" y="116" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">Alveolus (zoom)</text>

        {/* Alveolus circle */}
        <circle cx="387" cy="170" r="35" className="fill-pink-50 dark:fill-pink-900" stroke="#ec4899" strokeWidth="1.5" />
        {/* Capillary around alveolus */}
        <path d="M 350,155 Q 345,170 355,185 Q 370,200 387,205 Q 405,200 420,185 Q 425,170 420,155"
          className="stroke-red-300 dark:stroke-red-700" strokeWidth="6" fill="none" opacity="0.5" />

        {/* O2 arrows (into blood) */}
        <line x1="375" y1="155" x2="365" y2="142" className="stroke-red-500" strokeWidth="1.5" markerEnd="url(#lung-red)" />
        <line x1="400" y1="155" x2="410" y2="142" className="stroke-red-500" strokeWidth="1.5" markerEnd="url(#lung-red)" />
        <text x="387" y="138" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">O₂ in</text>

        {/* CO2 arrows (out of blood) */}
        <line x1="365" y1="200" x2="375" y2="190" className="stroke-blue-500" strokeWidth="1.5" markerEnd="url(#lung-blue)" />
        <line x1="410" y1="200" x2="400" y2="190" className="stroke-blue-500" strokeWidth="1.5" markerEnd="url(#lung-blue)" />
        <text x="387" y="218" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="bold">CO₂ out</text>

        {/* Labels */}
        <text x="350" y="232" className="fill-red-500" fontSize="10">Red = O₂</text>
        <text x="350" y="244" className="fill-blue-500" fontSize="10">Blue = CO₂</text>

        {/* Zoom line connecting lung to inset */}
        <line x1="300" y1="185" x2="330" y2="170" className="stroke-gray-400" strokeWidth="1" strokeDasharray="3,3" />

        {/* Air flow label */}
        <text x="180" y="305" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Air enters through trachea → bronchi → bronchioles → alveoli</text>
        <text x="180" y="320" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Gas exchange occurs at the alveoli walls</text>
      </svg>
    </div>
  );
}
