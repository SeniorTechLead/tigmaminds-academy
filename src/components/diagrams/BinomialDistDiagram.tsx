'use client';
import { useState, useMemo } from 'react';

/** Binomial coefficient C(n, k) */
function comb(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let res = 1;
  for (let i = 0; i < Math.min(k, n - k); i++) {
    res = res * (n - i) / (i + 1);
  }
  return Math.round(res);
}

/** P(X = k) for Binomial(n, p) */
function binomPMF(n: number, p: number, k: number): number {
  return comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

/** Generate all binary sequences of length n with exactly k ones */
function sequences(n: number, k: number): string[] {
  const result: string[] = [];
  const generate = (pos: number, ones: number, current: string) => {
    if (ones > k || (n - pos) < (k - ones)) return;
    if (pos === n) { if (ones === k) result.push(current); return; }
    generate(pos + 1, ones + 1, current + 'H');
    generate(pos + 1, ones, current + 'T');
  };
  generate(0, 0, '');
  return result;
}

export default function BinomialDistDiagram() {
  const [n, setN] = useState(10);
  const [p, setP] = useState(0.5);
  const [selectedK, setSelectedK] = useState<number | null>(null);

  const pmf = useMemo(() => {
    const vals: number[] = [];
    for (let k = 0; k <= n; k++) vals.push(binomPMF(n, p, k));
    return vals;
  }, [n, p]);

  const maxP = Math.max(...pmf);
  const ex = n * p;
  const variance = n * p * (1 - p);
  const sigma = Math.sqrt(variance);
  const expectedK = Math.round(ex);

  const W = 400, H = 300;
  const padL = 40, padR = 15, padT = 50, padB = 55;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const barW = Math.min(plotW / (n + 1) - 2, 24);
  const gap = (plotW - barW * (n + 1)) / (n + 2);

  const barX = (k: number) => padL + gap + k * (barW + gap);
  const barH = (pk: number) => (pk / (maxP * 1.15)) * plotH;
  const yBase = padT + plotH;

  // Coin icons at the top
  const coinY = 16;
  const coinR = 6;
  const coinGap = Math.min(16, (W - 40) / n);
  const coinStartX = W / 2 - ((n - 1) * coinGap) / 2;

  const hoverK = selectedK;
  const seqs = hoverK !== null && n <= 5 ? sequences(n, hoverK) : [];

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Sliders */}
      <div className="flex flex-wrap justify-center gap-4 mb-2">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">n = {n}</span>
          <input type="range" min={1} max={20} value={n} onChange={e => { setN(+e.target.value); setSelectedK(null); }}
            className="w-28 accent-blue-600" />
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">p = {p.toFixed(1)}</span>
          <input type="range" min={1} max={9} value={Math.round(p * 10)} onChange={e => { setP(+e.target.value / 10); setSelectedK(null); }}
            className="w-28 accent-blue-600" />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label={`Binomial distribution with n=${n} and p=${p}`}>
        <rect width={W} height={H} className="fill-white dark:fill-gray-900" rx="8" />

        {/* Title */}
        <text x={W / 2} y={32} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
          Binomial Distribution: n={n}, p={p.toFixed(1)}
        </text>

        {/* Coin icons */}
        {Array.from({ length: n }).map((_, i) => {
          const filled = i < Math.round(n * p);
          return (
            <circle key={i} cx={coinStartX + i * coinGap} cy={coinY} r={coinR}
              fill={filled ? '#3b82f6' : 'none'} stroke={filled ? '#3b82f6' : '#9ca3af'}
              strokeWidth="1.5" opacity={filled ? 0.8 : 0.4} />
          );
        })}

        {/* X-axis */}
        <line x1={padL} y1={yBase} x2={padL + plotW} y2={yBase} stroke="#9ca3af" strokeWidth="1" />

        {/* Bars */}
        {pmf.map((pk, k) => {
          const x = barX(k);
          const h = barH(pk);
          const isExpected = k === expectedK;
          const isSelected = k === hoverK;
          let fill = '#60a5fa';
          if (isExpected) fill = '#f59e0b';
          if (isSelected) fill = '#ef4444';
          return (
            <g key={k} className="cursor-pointer" onClick={() => setSelectedK(k === selectedK ? null : k)}>
              <rect x={x} y={yBase - h} width={barW} height={h} fill={fill}
                opacity={isSelected ? 1 : 0.75} rx="1" />
              {/* k label */}
              {(n <= 12 || k % 2 === 0) && (
                <text x={x + barW / 2} y={yBase + 12} textAnchor="middle" fontSize={n <= 12 ? '8' : '7'}
                  className="fill-gray-500 dark:fill-gray-400">{k}</text>
              )}
              {/* Probability on top */}
              {isSelected && (
                <text x={x + barW / 2} y={yBase - h - 4} textAnchor="middle" fontSize="8" fontWeight="600"
                  className="fill-red-600 dark:fill-red-400">{pk.toFixed(4)}</text>
              )}
              {isExpected && !isSelected && (
                <text x={x + barW / 2} y={yBase - h - 4} textAnchor="middle" fontSize="7" fontWeight="600"
                  className="fill-amber-600 dark:fill-amber-400">E(X)</text>
              )}
            </g>
          );
        })}

        {/* Y-axis label */}
        <text x={padL - 5} y={padT - 2} textAnchor="end" fontSize="8" className="fill-gray-400 dark:fill-gray-500">P(X=k)</text>
        <text x={W / 2} y={yBase + 24} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-gray-400">k (number of successes)</text>

        {/* Legend */}
        <rect x={padL} y={yBase + 30} width="8" height="8" fill="#f59e0b" rx="1" />
        <text x={padL + 12} y={yBase + 38} fontSize="8" className="fill-gray-500 dark:fill-gray-400">= E(X) = np = {ex.toFixed(1)}</text>
      </svg>

      {/* Formula and stats */}
      <div className="mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 space-y-1">
        {hoverK !== null ? (
          <>
            <p>
              <strong>P(X={hoverK})</strong> = C({n},{hoverK}) &times; {p.toFixed(1)}<sup>{hoverK}</sup> &times; {(1 - p).toFixed(1)}<sup>{n - hoverK}</sup> = <strong>{pmf[hoverK].toFixed(4)}</strong>
            </p>
            {seqs.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sequences: {seqs.join(', ')}
                {' '}({seqs.length} way{seqs.length !== 1 ? 's' : ''})
              </p>
            )}
          </>
        ) : (
          <p>Click a bar to see its exact probability and formula.</p>
        )}
        <p className="text-xs">
          E(X) = np = {ex.toFixed(2)} &nbsp;|&nbsp; Var(X) = np(1-p) = {variance.toFixed(2)} &nbsp;|&nbsp; &sigma; = {sigma.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
