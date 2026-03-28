import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface Props {
  pairs: [string, string][];
  title: string;
}

export default function MatchingActivity({ pairs, title }: Props) {
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [wrongPair, setWrongPair] = useState<[number, number] | null>(null);

  const shuffledRight = useState(() => {
    const indices = pairs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  })[0];

  const handleRightClick = (rightIndex: number) => {
    if (selectedLeft === null) return;
    const actualRight = shuffledRight[rightIndex];
    if (selectedLeft === actualRight) {
      setMatched(prev => new Set([...prev, selectedLeft]));
      setSelectedLeft(null);
      setWrongPair(null);
    } else {
      setWrongPair([selectedLeft, rightIndex]);
      setTimeout(() => setWrongPair(null), 800);
    }
  };

  const allMatched = matched.size === pairs.length;

  return (
    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-5">
      <p className="text-sm font-semibold text-sky-800 dark:text-sky-300 mb-4">{title}</p>
      {allMatched ? (
        <div className="text-center py-4">
          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">All matched correctly!</p>
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
