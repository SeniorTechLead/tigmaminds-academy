export default function DistillationDiagram() {
  const colX = 160;
  const colW = 100;
  const colTop = 50;
  const colH = 240;

  const fractions = [
    { name: 'Petrol (Gasoline)', temp: '40–75 °C', y: 0, color: 'fill-yellow-200 dark:fill-yellow-500/50', text: 'fill-yellow-700 dark:fill-yellow-200' },
    { name: 'Naphtha', temp: '75–150 °C', y: 1, color: 'fill-orange-200 dark:fill-orange-500/40', text: 'fill-orange-700 dark:fill-orange-200' },
    { name: 'Kerosene', temp: '150–200 °C', y: 2, color: 'fill-amber-300 dark:fill-amber-500/50', text: 'fill-amber-800 dark:fill-amber-200' },
    { name: 'Diesel', temp: '250–350 °C', y: 3, color: 'fill-orange-400 dark:fill-orange-600/50', text: 'fill-orange-800 dark:fill-orange-200' },
    { name: 'Bitumen (Residue)', temp: '350 °C+', y: 4, color: 'fill-stone-500 dark:fill-stone-600/60', text: 'fill-stone-100 dark:fill-stone-200' },
  ];

  const layerH = colH / fractions.length;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 480 340"
        className="w-full h-auto"
        role="img"
        aria-label="Fractional distillation column showing crude oil separated into fractions by boiling point"
      >
        <style>{`
          .dist-title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .dist-label { font-family: system-ui, sans-serif; font-size: 11px; }
          .dist-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .dist-bold { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
          .dist-temp { font-family: system-ui, sans-serif; font-size: 10px; font-style: italic; }
        `}</style>

        <defs>
          <linearGradient id="dist-temp-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <marker id="dist-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="480" height="340" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="240" y="26" textAnchor="middle" className="dist-title fill-gray-700 dark:fill-gray-200">
          Fractional Distillation
        </text>

        {/* Temperature gradient bar (left side of column) */}
        <rect x={colX - 20} y={colTop} width="12" height={colH} rx="3" fill="url(#dist-temp-grad)" />
        <text x={colX - 14} y={colTop - 6} textAnchor="middle"
          className="dist-small fill-blue-500 dark:fill-blue-400">Cool</text>
        <text x={colX - 14} y={colTop + colH + 14} textAnchor="middle"
          className="dist-small fill-red-500 dark:fill-red-400">Hot</text>

        {/* Column outline */}
        <rect x={colX} y={colTop} width={colW} height={colH} rx="4"
          className="fill-transparent stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />

        {/* Fraction layers and collection trays */}
        {fractions.map((f, i) => {
          const y = colTop + i * layerH;
          const trayX = colX + colW;
          const trayY = y + layerH / 2;

          return (
            <g key={f.name}>
              {/* Layer in column */}
              <rect x={colX + 1} y={y + 1} width={colW - 2} height={layerH - 2}
                className={f.color} rx={i === 0 ? 3 : i === fractions.length - 1 ? 0 : 0} />

              {/* Collection tray line */}
              <line x1={trayX} y1={trayY} x2={trayX + 30} y2={trayY}
                className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
              <line x1={trayX + 30} y1={trayY} x2={trayX + 40} y2={trayY + 8}
                className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />

              {/* Collection container */}
              <rect x={trayX + 35} y={trayY + 2} width="18" height="14" rx="2"
                className={f.color} strokeWidth="1"
                stroke="currentColor" />

              {/* Fraction labels */}
              <text x={trayX + 60} y={trayY + 4}
                className={`dist-bold ${f.text}`}>
                {f.name}
              </text>
              <text x={trayX + 60} y={trayY + 17}
                className="dist-temp fill-gray-500 dark:fill-gray-400">
                {f.temp}
              </text>
            </g>
          );
        })}

        {/* Crude oil input arrow at bottom */}
        <line x1={colX + colW / 2} y1={colTop + colH + 22} x2={colX + colW / 2} y2={colTop + colH + 4}
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" markerEnd="url(#dist-arrow)" />
        <text x={colX + colW / 2} y={colTop + colH + 36} textAnchor="middle"
          className="dist-bold fill-stone-600 dark:fill-stone-300">
          Crude Oil Input
        </text>

        {/* Fire/heat indicator */}
        <text x={colX + colW / 2} y={colTop + colH + 50} textAnchor="middle"
          className="dist-small fill-red-500 dark:fill-red-400">
          (heated)
        </text>

        {/* Left annotation: lighter at top, heavier at bottom */}
        <line x1="50" y1={colTop + 10} x2="50" y2={colTop + colH - 10}
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#dist-arrow)" />
        <text x="45" y={colTop + 6} textAnchor="end"
          className="dist-small fill-gray-500 dark:fill-gray-400">Lighter</text>
        <text x="45" y={colTop + 18} textAnchor="end"
          className="dist-small fill-gray-500 dark:fill-gray-400">molecules</text>
        <text x="45" y={colTop + colH - 12} textAnchor="end"
          className="dist-small fill-gray-500 dark:fill-gray-400">Heavier</text>
        <text x="45" y={colTop + colH} textAnchor="end"
          className="dist-small fill-gray-500 dark:fill-gray-400">molecules</text>

        {/* Bottom note */}
        <text x="240" y="326" textAnchor="middle" className="dist-small fill-gray-400 dark:fill-gray-500">
          Lighter substances rise higher — like treasures emerging at different stages
        </text>
      </svg>
    </div>
  );
}
