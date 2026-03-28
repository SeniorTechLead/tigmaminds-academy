import { useState, useEffect } from 'react';

/**
 * Animated diagram showing train/test split and WHY you need it.
 * Shows a stack of data cards being divided, then the model tested on unseen data.
 */
export default function TrainTestSplitDiagram() {
  const [phase, setPhase] = useState<'split' | 'train' | 'test' | 'result'>('split');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('train'), 1500),
      setTimeout(() => setPhase('test'), 3500),
      setTimeout(() => setPhase('result'), 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const reset = () => {
    setPhase('split');
    setTimeout(() => setPhase('train'), 1500);
    setTimeout(() => setPhase('test'), 3500);
    setTimeout(() => setPhase('result'), 5500);
  };

  // Training data
  const trainData = [
    { emoji: '🐘', label: 'calm', color: '#059669' },
    { emoji: '🐘', label: 'nervous', color: '#dc2626' },
    { emoji: '🐘', label: 'calm', color: '#059669' },
    { emoji: '🐘', label: 'danger', color: '#ea580c' },
    { emoji: '🐘', label: 'calm', color: '#059669' },
    { emoji: '🐘', label: 'nervous', color: '#dc2626' },
    { emoji: '🐘', label: 'calm', color: '#059669' },
    { emoji: '🐘', label: 'danger', color: '#ea580c' },
  ];

  const testData = [
    { emoji: '🐘', label: 'calm', predicted: 'calm', correct: true },
    { emoji: '🐘', label: 'nervous', predicted: 'nervous', correct: true },
    { emoji: '🐘', label: 'danger', predicted: 'calm', correct: false },
  ];

  return (
    <div className="my-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          Why split your data? Because a student who memorizes the answer key hasn't learned the subject.
        </p>
      </div>

      <div className="p-5">
        {/* Phase indicator */}
        <div className="flex gap-1 mb-5">
          {(['split', 'train', 'test', 'result'] as const).map((p, i) => (
            <div key={p} className="flex-1 text-center">
              <div className={`h-1.5 rounded-full mb-1 transition-all duration-500 ${
                phase === p ? 'bg-amber-500' :
                ['split', 'train', 'test', 'result'].indexOf(phase) > i ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
              <span className={`text-[10px] font-semibold ${phase === p ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'}`}>
                {p === 'split' ? '① Split data' : p === 'train' ? '② Train model' : p === 'test' ? '③ Test on unseen' : '④ Evaluate'}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-6 min-h-[180px]">
          {/* Training set */}
          <div className="flex-1">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2">
              Training Set (80%) {phase !== 'split' && '— model learns from these'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {trainData.map((d, i) => (
                <div
                  key={i}
                  className={`w-12 h-14 rounded-lg flex flex-col items-center justify-center transition-all duration-500 ${
                    phase === 'train' ? 'ring-2 ring-blue-400 scale-105' : ''
                  }`}
                  style={{
                    backgroundColor: phase === 'split' ? '#f3f4f6' : `${d.color}15`,
                    borderColor: d.color,
                    border: `2px solid ${phase === 'split' ? '#d1d5db' : d.color}`,
                    transitionDelay: `${i * 80}ms`,
                  }}
                >
                  <span className="text-lg">{d.emoji}</span>
                  <span className="text-[8px] font-bold" style={{ color: d.color }}>
                    {phase !== 'split' ? d.label : '?'}
                  </span>
                </div>
              ))}
            </div>
            {phase === 'train' && (
              <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2 animate-pulse">
                Learning patterns: calm=low freq, nervous=high freq...
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="w-px bg-gray-200 dark:bg-gray-700 relative">
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-1 py-0.5 rounded text-[9px] text-gray-400 font-bold whitespace-nowrap">
              WALL
            </div>
          </div>

          {/* Test set */}
          <div className="flex-1">
            <p className="text-xs font-bold text-rose-700 dark:text-rose-400 mb-2">
              Test Set (20%) {phase === 'test' && '— never seen before!'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {testData.map((d, i) => (
                <div
                  key={i}
                  className={`w-12 h-14 rounded-lg flex flex-col items-center justify-center transition-all duration-500 ${
                    phase === 'test' ? 'ring-2 ring-rose-400' :
                    phase === 'result' ? (d.correct ? 'ring-2 ring-emerald-400' : 'ring-2 ring-red-500') : ''
                  }`}
                  style={{
                    backgroundColor: phase === 'result'
                      ? d.correct ? '#ecfdf5' : '#fef2f2'
                      : '#f9fafb',
                    border: `2px dashed ${phase === 'result' ? (d.correct ? '#059669' : '#dc2626') : '#d1d5db'}`,
                    opacity: phase === 'split' || phase === 'train' ? 0.4 : 1,
                    transitionDelay: `${i * 150}ms`,
                  }}
                >
                  <span className="text-lg">{d.emoji}</span>
                  {phase === 'result' ? (
                    <span className="text-[8px] font-bold" style={{ color: d.correct ? '#059669' : '#dc2626' }}>
                      {d.correct ? '✓' : `✗ ${d.predicted}`}
                    </span>
                  ) : (
                    <span className="text-[8px] text-gray-400 font-bold">?</span>
                  )}
                </div>
              ))}
            </div>
            {phase === 'result' && (
              <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-2">
                2/3 correct = 67% accuracy. The model confused danger with calm — needs more training data.
              </p>
            )}
          </div>
        </div>

        {/* Replay */}
        {phase === 'result' && (
          <button
            onClick={reset}
            className="mt-3 text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
          >
            Watch again →
          </button>
        )}

        {/* Insight */}
        <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-4 py-3">
          <p className="text-xs text-amber-800 dark:text-amber-300">
            <strong>The wall matters.</strong> If you let the model see test answers during training, it could just memorize them and score 100% — while learning nothing about actual patterns. The test set is the honest exam: data the model has never encountered.
          </p>
        </div>
      </div>
    </div>
  );
}
