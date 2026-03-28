import { useState } from 'react';

interface Props {
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export default function TrueFalse({ statement, isTrue, explanation }: Props) {
  const [answer, setAnswer] = useState<boolean | null>(null);

  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 mb-3">
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{statement}</p>
      {answer === null ? (
        <div className="flex gap-2">
          <button onClick={() => setAnswer(true)} className="flex-1 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold hover:bg-emerald-200 transition-colors">True</button>
          <button onClick={() => setAnswer(false)} className="flex-1 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-semibold hover:bg-red-200 transition-colors">False</button>
        </div>
      ) : (
        <div className={`p-3 rounded-lg text-sm ${answer === isTrue ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
          <p className="font-semibold mb-1">{answer === isTrue ? '✓ Correct!' : '✗ Not quite.'} The answer is {isTrue ? 'True' : 'False'}.</p>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}
