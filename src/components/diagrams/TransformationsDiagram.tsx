export default function TransformationsDiagram() {
  // Grid helper
  const Grid = ({ ox, oy, w, h }: { ox: number; oy: number; w: number; h: number }) => (
    <g>
      {Array.from({ length: Math.floor(w / 20) + 1 }, (_, i) => (
        <line key={`v${i}`} x1={ox + i * 20} y1={oy} x2={ox + i * 20} y2={oy + h} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
      ))}
      {Array.from({ length: Math.floor(h / 20) + 1 }, (_, i) => (
        <line key={`h${i}`} x1={ox} y1={oy + i * 20} x2={ox + w} y2={oy + i * 20} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
      ))}
    </g>
  );

  return (
    <div className="my-4">
      <svg viewBox="0 0 540 200" className="w-full max-w-xl mx-auto" role="img" aria-label="Geometric transformations: translation, rotation, and reflection">
        {/* Panel 1: Translation */}
        <g>
          <Grid ox={10} oy={30} w={160} h={140} />
          <text x="90" y="22" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="12" fontWeight="bold">Translation</text>

          {/* Original shape */}
          <polygon points="30,130 70,130 70,90 50,70 30,90" className="fill-blue-300 dark:fill-blue-500 stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" opacity="0.6" />

          {/* Translated shape */}
          <polygon points="90,110 130,110 130,70 110,50 90,70" className="fill-blue-400 dark:fill-blue-500 stroke-blue-600 dark:stroke-blue-400" strokeWidth="1.5" />

          {/* Arrow showing slide */}
          <line x1="70" y1="110" x2="88" y2="92" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" markerEnd="url(#tfArrow)" />
          <text x="90" y="155" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Slides right and up</text>
          <text x="90" y="168" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Same shape, same size</text>
        </g>

        {/* Panel 2: Rotation */}
        <g>
          <Grid ox={190} oy={30} w={160} h={140} />
          <text x="270" y="22" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="12" fontWeight="bold">Rotation (90°)</text>

          {/* Center point */}
          <circle cx="270" cy="110" r="3" className="fill-red-500" />
          <text x="278" y="118" className="fill-red-500 dark:fill-red-400" fontSize="10">center</text>

          {/* Original L-shape */}
          <polygon points="230,110 230,70 250,70 250,90 270,90 270,110" className="fill-emerald-300 dark:fill-emerald-500 stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1.5" opacity="0.6" />

          {/* Rotated 90° CW */}
          <polygon points="270,110 270,70 310,70 310,90 290,90 290,110" className="fill-emerald-400 dark:fill-emerald-500 stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="1.5" />

          {/* Rotation arc */}
          <path d="M 250,80 A 30,30 0 0,1 290,80" fill="none" className="stroke-red-400 dark:stroke-red-300" strokeWidth="1.5" markerEnd="url(#tfArrow)" />
          <text x="270" y="62" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="10">90°</text>

          <text x="270" y="155" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Turns around a point</text>
          <text x="270" y="168" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Same shape, same size</text>
        </g>

        {/* Panel 3: Reflection */}
        <g>
          <Grid ox={370} oy={30} w={160} h={140} />
          <text x="450" y="22" textAnchor="middle" className="fill-purple-600 dark:fill-purple-400" fontSize="12" fontWeight="bold">Reflection</text>

          {/* Mirror axis */}
          <line x1="450" y1="30" x2="450" y2="170" className="stroke-red-400 dark:stroke-red-300" strokeWidth="1.5" strokeDasharray="5,4" />
          <text x="456" y="42" className="fill-red-500 dark:fill-red-400" fontSize="10">axis</text>

          {/* Original triangle */}
          <polygon points="400,130 430,70 440,130" className="fill-purple-300 dark:fill-purple-500 stroke-purple-500 dark:stroke-purple-400" strokeWidth="1.5" opacity="0.6" />

          {/* Reflected triangle */}
          <polygon points="500,130 470,70 460,130" className="fill-purple-400 dark:fill-purple-500 stroke-purple-600 dark:stroke-purple-400" strokeWidth="1.5" />

          {/* Connecting dashed lines */}
          <line x1="400" y1="130" x2="500" y2="130" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="430" y1="70" x2="470" y2="70" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="0.5" strokeDasharray="3,3" />

          <text x="450" y="155" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Flips across an axis</text>
          <text x="450" y="168" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Mirror image</text>
        </g>

        {/* Common footer */}
        <text x="270" y="192" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">All three are rigid transformations — they preserve shape and size</text>

        <defs>
          <marker id="tfArrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-red-500 dark:fill-red-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
