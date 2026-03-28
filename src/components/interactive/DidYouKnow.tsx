import { useState } from 'react';

interface Props {
  facts: string[];
}

export default function DidYouKnow({ facts }: Props) {
  const [current, setCurrent] = useState(0);
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 mb-4">
      <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2">Did You Know?</p>
      <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{facts[current]}</p>
      {facts.length > 1 && (
        <button onClick={() => setCurrent((current + 1) % facts.length)}
          className="mt-3 text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline">
          Next fact ({current + 1}/{facts.length}) →
        </button>
      )}
    </div>
  );
}
