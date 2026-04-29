export default function ChurningMassSpecDiagram() {
  const peaks = [
    { mz: 18, height: 60, label: 'H₂O', color: 'fill-blue-500' },
    { mz: 28, height: 45, label: 'N₂', color: 'fill-gray-500' },
    { mz: 32, height: 35, label: 'O₂', color: 'fill-red-400' },
    { mz: 44, height: 80, label: 'CO₂', color: 'fill-emerald-500' },
    { mz: 58, height: 25, label: 'Acetone', color: 'fill-purple-500' },
    { mz: 78, height: 55, label: 'Benzene', color: 'fill-amber-500' },
  ];

  const chartX = 60, chartY = 40, chartW = 380, chartH = 160;
  const mzToX = (mz: number) => chartX + ((mz - 10) / 80) * chartW;
  const hToY = (h: number) => chartY + chartH - (h / 100) * chartH;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 500 260" className="w-full h-auto" role="img" aria-label="Mass spectrum showing peaks at different mass-to-charge ratios identifying compounds in a mixture">
        <style>{`
          .ms-title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .ms-label { font-family: system-ui, sans-serif; font-size: 9px; }
          .ms-small { font-family: system-ui, sans-serif; font-size: 8px; }
        `}</style>

        <rect width="500" height="260" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="250" y="24" textAnchor="middle" className="ms-title fill-gray-700 dark:fill-gray-200">Mass Spectrum of a Mixture</text>

        {/* Axes */}
        <line x1={chartX} y1={chartY + chartH} x2={chartX + chartW} y2={chartY + chartH} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <line x1={chartX} y1={chartY} x2={chartX} y2={chartY + chartH} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />

        {/* X axis label */}
        <text x={chartX + chartW / 2} y={chartY + chartH + 30} textAnchor="middle" className="ms-label fill-gray-600 dark:fill-gray-300">Mass-to-charge ratio (m/z)</text>

        {/* Y axis label */}
        <text x="15" y={chartY + chartH / 2} textAnchor="middle" className="ms-label fill-gray-600 dark:fill-gray-300" transform={`rotate(-90, 15, ${chartY + chartH / 2})`}>Relative intensity (%)</text>

        {/* X axis ticks */}
        {[20, 40, 60, 80].map(mz => (
          <g key={mz}>
            <line x1={mzToX(mz)} y1={chartY + chartH} x2={mzToX(mz)} y2={chartY + chartH + 5} className="stroke-gray-400" strokeWidth="0.5" />
            <text x={mzToX(mz)} y={chartY + chartH + 15} textAnchor="middle" className="ms-small fill-gray-500 dark:fill-gray-400">{mz}</text>
          </g>
        ))}

        {/* Peaks */}
        {peaks.map((p, i) => {
          const x = mzToX(p.mz);
          const top = hToY(p.height);
          return (
            <g key={i}>
              <line x1={x} y1={chartY + chartH} x2={x} y2={top} className={p.color.replace('fill-', 'stroke-')} strokeWidth="3" />
              <text x={x} y={top - 8} textAnchor="middle" className={`ms-small ${p.color.replace('fill-', 'fill-')}`} fontWeight="600">{p.label}</text>
              <text x={x} y={top - 0} textAnchor="middle" className="ms-small fill-gray-400">m/z={p.mz}</text>
            </g>
          );
        })}

        <text x="250" y="250" textAnchor="middle" className="ms-small fill-gray-400 dark:fill-gray-500">Each peak is a fingerprint — identifying a compound by its molecular weight</text>
      </svg>
    </div>
  );
}
