import { useState } from 'react';

/**
 * Interactive diagram showing how a child (and an ML model) extracts features.
 * Three animals shown with feature "sliders" — the student sees how
 * different features distinguish different animals.
 */
export default function FeatureExtractionDiagram() {
  const [highlighted, setHighlighted] = useState<number | null>(null);

  const animals = [
    {
      name: 'Elephant',
      emoji: '🐘',
      features: { size: 95, ears: 90, trunk: 100, legs: 80, tail: 30 },
      color: '#059669',
      label: 'calm rumble',
    },
    {
      name: 'Dog',
      emoji: '🐕',
      features: { size: 40, ears: 60, trunk: 0, legs: 70, tail: 85 },
      color: '#2563eb',
      label: 'bark',
    },
    {
      name: 'Cat',
      emoji: '🐈',
      features: { size: 25, ears: 55, trunk: 0, legs: 60, tail: 80 },
      color: '#d97706',
      label: 'meow',
    },
  ];

  const featureNames = [
    { key: 'size', label: 'Body size', icon: '📏' },
    { key: 'ears', label: 'Ear size', icon: '👂' },
    { key: 'trunk', label: 'Has trunk?', icon: '🦣' },
    { key: 'legs', label: 'Leg thickness', icon: '🦵' },
    { key: 'tail', label: 'Tail wagging', icon: '🔄' },
  ];

  return (
    <div className="my-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white">How do you tell animals apart? You use features — without even thinking about it.</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tap an animal to see its feature "fingerprint." Notice which features separate them.</p>
      </div>

      <div className="p-5">
        {/* Animal selector */}
        <div className="flex gap-3 justify-center mb-6">
          {animals.map((a, i) => (
            <button
              key={a.name}
              onClick={() => setHighlighted(highlighted === i ? null : i)}
              className={`flex flex-col items-center px-4 py-3 rounded-xl transition-all ${
                highlighted === i
                  ? 'ring-2 shadow-lg scale-105'
                  : highlighted !== null
                  ? 'opacity-40'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
              }`}
              style={highlighted === i ? { ringColor: a.color, borderColor: a.color } : {}}
            >
              <span className="text-4xl mb-1">{a.emoji}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{a.name}</span>
            </button>
          ))}
        </div>

        {/* Feature bars */}
        <div className="space-y-3">
          {featureNames.map((f) => (
            <div key={f.key} className="flex items-center gap-3">
              <span className="text-lg w-7 text-center">{f.icon}</span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-24">{f.label}</span>
              <div className="flex-1 flex gap-1.5 items-center">
                {animals.map((a, i) => {
                  const val = a.features[f.key as keyof typeof a.features];
                  const show = highlighted === null || highlighted === i;
                  return (
                    <div key={a.name} className="flex-1">
                      <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${val}%`,
                            backgroundColor: a.color,
                            opacity: show ? 1 : 0.15,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4 justify-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          {animals.map((a) => (
            <div key={a.name} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
              <span className="text-xs text-gray-600 dark:text-gray-400">{a.name}</span>
            </div>
          ))}
        </div>

        {/* Insight callout */}
        {highlighted !== null && (
          <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-4 py-3">
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <strong>Notice:</strong> {highlighted === 0
                ? '"Has trunk?" is 100% for elephants and 0% for everything else — that single feature is enough to identify an elephant. The ML model discovers this automatically.'
                : highlighted === 1
                ? 'Dogs and cats are similar in size and ears. The model needs MULTIPLE features (tail wagging, leg thickness) to tell them apart — just like you do.'
                : 'Cats are small with moderate ears — similar to dogs. Without "tail wagging" as a feature, the model would confuse them. Feature selection matters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
