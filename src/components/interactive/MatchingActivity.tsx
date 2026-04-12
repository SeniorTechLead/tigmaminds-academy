import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface Props {
  pairs: [string, string][];
  title: string;
  explanations?: string[]; // optional visual explanation for each pair (markdown rendered as text)
  transformMatrices?: [number, number, number, number][]; // optional: show transform visuals
}

function MiniTransform({ matrix }: { matrix: [number, number, number, number] }) {
  const [a, b, c, d] = matrix;
  const shape = [[0, 0], [1, 0], [1, 1], [0, 1]] as const;
  const transformed = shape.map(([x, y]) => [a * x + b * y, c * x + d * y] as const);
  const s = 22; // scale
  const ox = 30, oy = 55;
  const sx = (v: number) => ox + v * s;
  const sy = (v: number) => oy - v * s;
  const pts = (arr: (readonly [number, number])[]) => arr.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ');

  return (
    <svg viewBox="0 0 100 65" className="w-20 h-14 inline-block align-middle">
      <polygon points={pts(shape)} fill="rgba(37,99,235,0.1)" stroke="#93c5fd" strokeWidth="1" strokeDasharray="2,2" />
      <polygon points={pts(transformed)} fill="rgba(22,163,74,0.15)" stroke="#16a34a" strokeWidth="1.5" />
      {/* Arrow */}
      <line x1="52" y1="32" x2="64" y2="32" stroke="#9ca3af" strokeWidth="1" markerEnd="url(#arrowM)" />
      <defs><marker id="arrowM" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4" fill="#9ca3af" /></marker></defs>
    </svg>
  );
}

export default function MatchingActivity({ pairs, title, explanations, transformMatrices }: Props) {
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [wrongPair, setWrongPair] = useState<[number, number] | null>(null);
  const [showExplanation, setShowExplanation] = useState<number | null>(null);

  const [shuffledRight, setShuffledRight] = useState(() => pairs.map((_, i) => i));

  useEffect(() => {
    const indices = pairs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledRight(indices);
  }, [pairs.length]);

  const handleRightClick = (rightIndex: number) => {
    if (selectedLeft === null) return;
    const actualRight = shuffledRight[rightIndex];
    if (selectedLeft === actualRight) {
      setMatched(prev => new Set([...prev, selectedLeft]));
      setSelectedLeft(null);
      setWrongPair(null);
      // Show explanation briefly
      if (explanations?.[selectedLeft] || transformMatrices?.[selectedLeft]) {
        setShowExplanation(selectedLeft);
      }
    } else {
      setWrongPair([selectedLeft, rightIndex]);
      setTimeout(() => setWrongPair(null), 800);
    }
  };

  const allMatched = matched.size === pairs.length;

  return (
    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-5">
      <p className="text-sm font-semibold text-sky-800 dark:text-sky-300 mb-4">{title}</p>

      {/* Explanation popup when a pair is matched */}
      {showExplanation !== null && (
        <div className="mb-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center gap-3">
            {transformMatrices?.[showExplanation] && (
              <MiniTransform matrix={transformMatrices[showExplanation]} />
            )}
            <div className="flex-1">
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-0.5">
                {pairs[showExplanation][0]} → {pairs[showExplanation][1]}
              </div>
              {explanations?.[showExplanation] && (
                <div className="text-xs text-emerald-600 dark:text-emerald-400">
                  {explanations[showExplanation]}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowExplanation(null)}
              className="text-emerald-400 hover:text-emerald-600 text-lg leading-none px-1"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {allMatched ? (
        <div className="text-center py-4">
          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">All matched correctly!</p>

          {/* Show all explanations after completion */}
          {(explanations || transformMatrices) && (
            <div className="mt-3 space-y-2 text-left">
              {pairs.map(([left, right], i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded bg-white/60 dark:bg-gray-800/40 text-xs">
                  {transformMatrices?.[i] && <MiniTransform matrix={transformMatrices[i]} />}
                  <div>
                    <span className="font-semibold">{left}</span>
                    <span className="text-gray-400 mx-1">→</span>
                    <span>{right}</span>
                    {explanations?.[i] && <div className="text-gray-500 dark:text-gray-400 mt-0.5">{explanations[i]}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <div className="space-y-2">
            {pairs.map(([left], i) => (
              <button key={i} onClick={() => !matched.has(i) && setSelectedLeft(i)}
                disabled={matched.has(i)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-all ${
                  matched.has(i) ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 line-through opacity-60' :
                  selectedLeft === i ? 'bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100 ring-2 ring-sky-500' :
                  wrongPair && wrongPair[0] === i ? 'bg-red-100 text-red-700' :
                  'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-800'
                }`}>
                {left}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {shuffledRight.map((actualIdx, displayIdx) => (
              <button key={displayIdx} onClick={() => handleRightClick(displayIdx)}
                disabled={matched.has(actualIdx)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-all ${
                  matched.has(actualIdx) ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 line-through opacity-60' :
                  wrongPair && wrongPair[1] === displayIdx ? 'bg-red-100 text-red-700' :
                  'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-800'
                }`}>
                {pairs[actualIdx][1]}
              </button>
            ))}
          </div>
        </div>
      )}
      {!allMatched && <p className="text-xs text-sky-600 dark:text-sky-400 mt-3">Click a term on the left, then click its match on the right.</p>}
    </div>
  );
}
