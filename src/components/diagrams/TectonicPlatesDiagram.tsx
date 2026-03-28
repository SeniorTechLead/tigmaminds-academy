export default function TectonicPlatesDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 540 300" className="w-full max-w-2xl mx-auto" role="img" aria-label="Simplified world map showing major tectonic plates">
        {/* Ocean background */}
        <rect x="0" y="0" width="540" height="300" rx="4" className="fill-blue-100 dark:fill-blue-950" />

        {/* Simplified continent outlines */}
        {/* North America */}
        <path d="M 60,50 L 130,40 L 155,65 L 150,100 L 135,130 L 110,140 L 80,135 L 55,110 L 45,80 Z"
          className="fill-green-200 dark:fill-green-800" stroke="#4ade80" strokeWidth="0.5" />
        {/* South America */}
        <path d="M 110,155 L 130,150 L 145,170 L 140,210 L 125,240 L 110,250 L 100,230 L 95,190 Z"
          className="fill-green-200 dark:fill-green-800" stroke="#4ade80" strokeWidth="0.5" />
        {/* Europe */}
        <path d="M 250,45 L 280,40 L 300,50 L 295,70 L 275,80 L 255,75 L 245,60 Z"
          className="fill-green-200 dark:fill-green-800" stroke="#4ade80" strokeWidth="0.5" />
        {/* Africa */}
        <path d="M 255,100 L 285,90 L 310,105 L 315,150 L 300,190 L 275,200 L 260,180 L 250,140 Z"
          className="fill-green-200 dark:fill-green-800" stroke="#4ade80" strokeWidth="0.5" />
        {/* Asia */}
        <path d="M 300,40 L 380,30 L 430,45 L 450,70 L 440,100 L 410,110 L 370,105 L 340,95 L 310,80 L 295,60 Z"
          className="fill-green-200 dark:fill-green-800" stroke="#4ade80" strokeWidth="0.5" />
        {/* India */}
        <path d="M 345,110 L 365,105 L 375,120 L 365,155 L 350,165 L 340,145 L 338,125 Z"
          className="fill-amber-200 dark:fill-amber-700" stroke="#f59e0b" strokeWidth="1" />
        {/* Australia */}
        <path d="M 420,185 L 460,180 L 480,195 L 475,215 L 450,225 L 425,215 L 415,200 Z"
          className="fill-green-200 dark:fill-green-800" stroke="#4ade80" strokeWidth="0.5" />
        {/* Antarctica hint */}
        <path d="M 140,275 L 250,270 L 380,275 L 400,285 L 120,285 Z"
          className="fill-gray-200 dark:fill-gray-700" stroke="#9ca3af" strokeWidth="0.5" />

        {/* Plate boundary lines (dashed red) */}
        {/* Pacific plate boundary (Ring of Fire) */}
        <path d="M 10,260 L 30,200 L 20,140 L 25,80 L 40,40 L 60,35 L 155,70 L 150,135 L 145,170 L 140,250"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" strokeDasharray="4,3" />
        {/* Pacific plate west boundary */}
        <path d="M 490,250 L 500,190 L 495,130 L 490,80 L 470,40"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" strokeDasharray="4,3" />
        {/* Mid-Atlantic ridge */}
        <path d="M 190,15 L 185,60 L 195,120 L 200,170 L 210,230 L 205,280"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" strokeDasharray="4,3" />
        {/* Eurasian-Indian boundary (Himalayas) */}
        <path d="M 300,95 L 340,100 L 380,95 L 420,105"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" strokeDasharray="4,3" />
        {/* African plate boundary */}
        <path d="M 230,90 L 245,95 L 255,100"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" strokeDasharray="4,3" />
        {/* Indian-Australian boundary */}
        <path d="M 420,105 L 460,150 L 490,170"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Plate labels */}
        <text x="25" y="170" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="bold">Pacific</text>
        <text x="25" y="182" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="bold">Plate</text>

        <text x="75" y="95" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600">North American</text>
        <text x="85" y="106" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600">Plate</text>

        <text x="330" y="58" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600">Eurasian Plate</text>

        <text x="340" y="140" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">Indian</text>
        <text x="340" y="151" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">Plate</text>

        <text x="260" y="155" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600">African</text>
        <text x="260" y="166" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600">Plate</text>

        {/* Indian plate highlight marker */}
        <circle cx="355" cy="135" r="3" className="fill-amber-500" opacity="0.8">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Legend */}
        <line x1="410" y1="262" x2="435" y2="262" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="440" y="266" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Plate boundary</text>

        {/* Title */}
        <text x="270" y="296" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="12" fontWeight="bold">
          Major Tectonic Plates
        </text>
      </svg>
    </div>
  );
}
