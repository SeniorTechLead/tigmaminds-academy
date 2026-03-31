export default function ActivityHillColorDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Activity: observe hills at different distances and sketch their color to demonstrate aerial perspective"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Sketch the Blue Gradient
        </text>
        <text x="390" y="52" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          You need: a sketchpad, coloured pencils (green, blue, grey), and a clear viewpoint
        </text>

        {/* Sketch example */}
        <g transform="translate(390, 80)">
          <rect x="-250" y="0" width="500" height="180" rx="8" fill="#fefce8" opacity="0.3" stroke="#d4d4d8" strokeWidth="1" className="dark:stroke-slate-700 dark:fill-slate-900" />
          <text x="0" y="22" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">
            Your sketch should look something like this:
          </text>

          {/* Layers of hills in sketch */}
          <path d="M -240,160 L -180,70 L -100,100 L 0,60 L 100,90 L 200,65 L 240,160 Z" fill="#bfdbfe" opacity="0.3" />
          <path d="M -240,160 L -150,100 L -50,120 L 50,95 L 150,115 L 240,160 Z" fill="#86efac" opacity="0.3" />
          <path d="M -240,160 L -100,130 L 0,140 L 100,128 L 240,160 Z" fill="#22c55e" opacity="0.5" />

          {/* Color swatches on the right */}
          <g transform="translate(200, 60)">
            <rect x="0" y="0" width="20" height="12" rx="2" fill="#3b82f6" opacity="0.4" />
            <text x="25" y="10" fontSize="10" className="fill-gray-500 dark:fill-slate-400">far: blue</text>
            <rect x="0" y="20" width="20" height="12" rx="2" fill="#22d3ee" opacity="0.5" />
            <text x="25" y="30" fontSize="10" className="fill-gray-500 dark:fill-slate-400">mid: blue-green</text>
            <rect x="0" y="40" width="20" height="12" rx="2" fill="#22c55e" opacity="0.6" />
            <text x="25" y="50" fontSize="10" className="fill-gray-500 dark:fill-slate-400">near: green</text>
          </g>

          {/* Distance labels */}
          <text x="-180" y="85" fontSize="9" className="fill-blue-400 dark:fill-blue-500">{"\u223C"}50 km</text>
          <text x="-130" y="115" fontSize="9" className="fill-cyan-500 dark:fill-cyan-400">{"\u223C"}10 km</text>
          <text x="-80" y="142" fontSize="9" className="fill-green-500 dark:fill-green-400">{"\u223C"}1 km</text>
        </g>

        {/* Steps */}
        <g transform="translate(390, 280)">
          <rect x="-330" y="0" width="660" height="105" rx="8" className="fill-blue-50 dark:fill-blue-950" opacity="0.5" />
          <text x="0" y="20" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">
            Steps
          </text>
          {[
            '1. Find an elevated spot with a view of hills at different distances',
            '2. Sketch the silhouettes of at least 3 layers of hills',
            '3. Colour each layer: nearest in true colour (green), farthest in blue',
            '4. Label the approximate distance to each layer',
            '5. Bonus: repeat on a clear day AND a hazy day \u2014 compare the blue depth',
          ].map((step, i) => (
            <text key={i} x="-300" y={38 + i * 14} fontSize="11" className="fill-gray-600 dark:fill-slate-300">
              {step}
            </text>
          ))}
        </g>

        <text x="390" y="408" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          You are seeing the same physics Leonardo da Vinci described in 1490 {"\u2014"} now you can draw it
        </text>
      </svg>
    </div>
  );
}
