import { useState } from 'react';

/**
 * Interactive supply & demand curve. A slider shifts the demand curve; the
 * equilibrium point (where supply meets demand) moves with it, and the price
 * is read off the axis. Light/dark aware.
 *
 * Used in the "Supply and Demand" section of the supply-demand-economics guide.
 */
export default function SupplyDemandCurveDiagram() {
  // demandShift: -2..+2 (left = lower demand, right = higher demand)
  const [shift, setShift] = useState(0);

  const W = 460, H = 360;
  const ox = 60, oy = 40;          // plot origin (top-left of plot area)
  const pw = 340, ph = 260;        // plot width/height
  const x0 = ox, y0 = oy + ph;     // axes origin (bottom-left)

  // Map quantity (0..10) and price (0..10) to svg coords
  const qx = (q: number) => x0 + (q / 10) * pw;
  const py = (p: number) => y0 - (p / 10) * ph;

  // Supply: price rises with quantity. p = q (line from (0,0)..(10,10))
  // Demand: price falls with quantity, shifted horizontally. p = (8+shift) - q
  const dIntercept = 8 + shift;            // demand line: p = dIntercept - q
  // equilibrium: supply p=q ; demand p=dIntercept - q  => q = dIntercept/2
  const eqQ = dIntercept / 2;
  const eqP = eqQ;

  // endpoints for drawing within 0..10 box
  const supplyA = { q: 0, p: 0 }, supplyB = { q: 10, p: 10 };
  const demandA = { q: Math.max(0, dIntercept - 10), p: Math.min(10, dIntercept) };
  const demandB = { q: Math.min(10, dIntercept), p: Math.max(0, dIntercept - 10) };

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden p-4">
      <p className="text-center text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">Supply &amp; Demand — find the equilibrium</p>
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-3">Drag the slider to shift demand and watch the price move.</p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto" role="img"
        aria-label="A supply curve sloping up and a demand curve sloping down cross at the equilibrium point. Shifting demand moves the equilibrium price and quantity.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />

        {/* grid */}
        {[0, 2, 4, 6, 8, 10].map(g => (
          <g key={g}>
            <line x1={qx(g)} y1={oy} x2={qx(g)} y2={y0} stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-gray-800" />
            <line x1={x0} y1={py(g)} x2={x0 + pw} y2={py(g)} stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-gray-800" />
          </g>
        ))}

        {/* axes */}
        <line x1={x0} y1={oy} x2={x0} y2={y0} stroke="#475569" strokeWidth="2" className="dark:stroke-gray-400" />
        <line x1={x0} y1={y0} x2={x0 + pw} y2={y0} stroke="#475569" strokeWidth="2" className="dark:stroke-gray-400" />
        <text x={x0 - 8} y={oy + 6} textAnchor="end" fontSize="11" fontWeight="700" fill="#475569" className="dark:fill-gray-300">Price</text>
        <text x={x0 + pw} y={y0 + 24} textAnchor="end" fontSize="11" fontWeight="700" fill="#475569" className="dark:fill-gray-300">Quantity →</text>

        {/* supply curve */}
        <line x1={qx(supplyA.q)} y1={py(supplyA.p)} x2={qx(supplyB.q)} y2={py(supplyB.p)} stroke="#2563eb" strokeWidth="3" />
        <text x={qx(8.4)} y={py(9.2)} fontSize="12" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">Supply</text>

        {/* demand curve */}
        <line x1={qx(demandA.q)} y1={py(demandA.p)} x2={qx(demandB.q)} y2={py(demandB.p)} stroke="#dc2626" strokeWidth="3" />
        <text x={qx(demandB.q) - 4} y={py(demandB.p) - 8} fontSize="12" fontWeight="700" fill="#b91c1c" className="dark:fill-red-300">Demand</text>

        {/* equilibrium guide lines */}
        <line x1={qx(eqQ)} y1={py(eqP)} x2={qx(eqQ)} y2={y0} stroke="#16a34a" strokeWidth="1.5" strokeDasharray="5 3" />
        <line x1={qx(eqQ)} y1={py(eqP)} x2={x0} y2={py(eqP)} stroke="#16a34a" strokeWidth="1.5" strokeDasharray="5 3" />
        {/* equilibrium point */}
        <circle cx={qx(eqQ)} cy={py(eqP)} r="6" fill="#16a34a" stroke="#fff" strokeWidth="1.5" className="dark:stroke-gray-900" />

        {/* equilibrium readout */}
        <rect x={qx(eqQ) + 10} y={py(eqP) - 26} width="120" height="36" rx="7" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" className="dark:fill-green-900/40 dark:stroke-green-400" />
        <text x={qx(eqQ) + 70} y={py(eqP) - 11} textAnchor="middle" fontSize="10" fontWeight="700" fill="#15803d" className="dark:fill-green-300">Equilibrium</text>
        <text x={qx(eqQ) + 70} y={py(eqP) + 3} textAnchor="middle" fontSize="10" fill="#166534" className="dark:fill-green-200">price ≈ {eqP.toFixed(1)}</text>
      </svg>

      <div className="max-w-lg mx-auto mt-2 px-2">
        <label className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
          <span className="font-semibold whitespace-nowrap">Demand</span>
          <input type="range" min={-2} max={2} step={0.5} value={shift}
            onChange={e => setShift(parseFloat(e.target.value))}
            className="flex-1 accent-red-500" />
          <span className="whitespace-nowrap w-16 text-right">{shift > 0 ? 'higher' : shift < 0 ? 'lower' : 'normal'}</span>
        </label>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
          More demand shifts the red curve right → equilibrium price <strong>rises</strong>. Less demand → price <strong>falls</strong>.
        </p>
      </div>
    </div>
  );
}
