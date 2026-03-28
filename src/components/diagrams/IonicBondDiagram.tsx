export default function IonicBondDiagram() {
  // Three stages: Na atom | electron transfer | Na+ and Cl- ions
  const stageW = 170;

  // Helper to draw concentric electron shells
  const drawAtom = (cx: number, cy: number, label: string, shells: number[], highlightOuter?: boolean) => {
    const radii = [20, 35, 52];
    return (
      <g>
        {/* Nucleus */}
        <circle cx={cx} cy={cy} r={10} className="fill-gray-300 dark:fill-gray-600" />
        <text x={cx} y={cy + 3.5} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="9" fontWeight="bold">{label}</text>

        {shells.map((count, si) => {
          const r = radii[si];
          return (
            <g key={si}>
              <circle cx={cx} cy={cy} r={r} fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="0.8" strokeDasharray="3,3" />
              {Array.from({ length: count }).map((_, ei) => {
                const angle = (ei * 2 * Math.PI) / count - Math.PI / 2;
                const ex = cx + Math.cos(angle) * r;
                const ey = cy + Math.sin(angle) * r;
                const isHighlight = highlightOuter && si === shells.length - 1;
                return (
                  <circle key={`${si}-${ei}`} cx={ex} cy={ey} r={3}
                    className={isHighlight ? 'fill-red-500' : 'fill-blue-500'} />
                );
              })}
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div className="my-4">
      <svg viewBox="0 0 560 220" className="w-full max-w-2xl mx-auto" role="img" aria-label="Ionic bond formation between sodium and chlorine">
        {/* Stage 1: Na and Cl atoms */}
        <text x={90} y={18} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="bold">Na atom</text>
        {drawAtom(65, 105, 'Na', [2, 8, 1], true)}
        <text x={65} y={180} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">2-8-1</text>

        <text x={160} y={18} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="bold">Cl atom</text>
        {drawAtom(160, 105, 'Cl', [2, 8, 7])}
        <text x={160} y={180} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">2-8-7</text>

        {/* Arrow between stage 1 and stage 2 */}
        <defs>
          <marker id="ionic-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-red-500" />
          </marker>
          <marker id="attract-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-amber-500" />
          </marker>
        </defs>

        {/* Stage 2: Electron transfer */}
        <line x1="210" y1="105" x2="265" y2="105" stroke="none" />
        <g>
          <path d="M 215,90 C 235,60 255,60 275,90" fill="none" className="stroke-red-500" strokeWidth="1.5" markerEnd="url(#ionic-arrow)" />
          <circle cx="245" cy="62" r="3" className="fill-red-500" />
          <text x="245" y="55" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">e⁻</text>
          <text x="245" y="200" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">electron transfers</text>
        </g>

        {/* Stage 3: Ions */}
        <text x="370" y="18" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="bold">Na⁺ ion</text>
        {/* Na+ smaller, lost outer shell */}
        <g>
          <circle cx="350" cy="105" r="10" className="fill-gray-300 dark:fill-gray-600" />
          <text x="350" y="108.5" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="9" fontWeight="bold">Na⁺</text>
          <circle cx="350" cy="105" r="20" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="0.8" strokeDasharray="3,3" />
          <circle cx="350" cy="105" r="35" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="0.8" strokeDasharray="3,3" />
          {/* 2 inner electrons */}
          {[0, 180].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return <circle key={i} cx={350 + Math.cos(rad) * 20} cy={105 + Math.sin(rad) * 20} r={2.5} className="fill-blue-500" />;
          })}
          {/* 8 middle electrons */}
          {Array.from({ length: 8 }).map((_, i) => {
            const rad = (i * 2 * Math.PI) / 8;
            return <circle key={i} cx={350 + Math.cos(rad) * 35} cy={105 + Math.sin(rad) * 35} r={2.5} className="fill-blue-500" />;
          })}
          <text x="350" y="155" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">+</text>
        </g>

        {/* Attraction arrows */}
        <line x1="393" y1="100" x2="415" y2="100" className="stroke-amber-500" strokeWidth="1.5" markerEnd="url(#attract-arrow)" />
        <line x1="443" y1="110" x2="421" y2="110" className="stroke-amber-500" strokeWidth="1.5" markerEnd="url(#attract-arrow)" />
        <text x="418" y="90" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="9">attract</text>

        {/* Cl- larger, gained electron */}
        <text x="490" y="18" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="bold">Cl⁻ ion</text>
        <g>
          <circle cx="490" cy="105" r="10" className="fill-gray-300 dark:fill-gray-600" />
          <text x="490" y="108.5" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="9" fontWeight="bold">Cl⁻</text>
          <circle cx="490" cy="105" r="20" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="0.8" strokeDasharray="3,3" />
          <circle cx="490" cy="105" r="35" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="0.8" strokeDasharray="3,3" />
          <circle cx="490" cy="105" r="52" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="0.8" strokeDasharray="3,3" />
          {/* 2 inner */}
          {[0, 180].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return <circle key={i} cx={490 + Math.cos(rad) * 20} cy={105 + Math.sin(rad) * 20} r={2.5} className="fill-blue-500" />;
          })}
          {/* 8 middle */}
          {Array.from({ length: 8 }).map((_, i) => {
            const rad = (i * 2 * Math.PI) / 8;
            return <circle key={i} cx={490 + Math.cos(rad) * 35} cy={105 + Math.sin(rad) * 35} r={2.5} className="fill-blue-500" />;
          })}
          {/* 8 outer (was 7, gained 1) */}
          {Array.from({ length: 8 }).map((_, i) => {
            const rad = (i * 2 * Math.PI) / 8;
            return <circle key={i} cx={490 + Math.cos(rad) * 52} cy={105 + Math.sin(rad) * 52} r={2.5} className="fill-blue-500" />;
          })}
          <text x="490" y="170" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="bold">−</text>
        </g>

        <text x="418" y="210" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Na⁺ and Cl⁻ form NaCl (table salt)</text>
      </svg>
    </div>
  );
}
