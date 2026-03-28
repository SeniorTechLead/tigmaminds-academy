import { useState } from 'react';

/**
 * Shows how a child learning to identify dogs unconsciously weights features.
 * Interactive: toggle features on/off and see how classification changes.
 * This is the "lightbulb moment" diagram — connecting human intuition to ML.
 */
export default function FeatureWeightsDiagram() {
  const [weights, setWeights] = useState({
    furry: true,
    fourLegs: true,
    wetNose: true,
    barks: true,
    wags: true,
  });

  // Candidates to classify
  const candidates = [
    { name: 'Golden Retriever', furry: true, fourLegs: true, wetNose: true, barks: true, wags: true, actual: 'dog', emoji: '🐕' },
    { name: 'Cat', furry: true, fourLegs: true, wetNose: true, barks: false, wags: false, actual: 'not dog', emoji: '🐈' },
    { name: 'Stuffed toy', furry: true, fourLegs: true, wetNose: false, barks: false, wags: false, actual: 'not dog', emoji: '🧸' },
    { name: 'Fox', furry: true, fourLegs: true, wetNose: true, barks: false, wags: true, actual: 'not dog', emoji: '🦊' },
    { name: 'Poodle', furry: true, fourLegs: true, wetNose: true, barks: true, wags: true, actual: 'dog', emoji: '🐩' },
    { name: 'Wolf', furry: true, fourLegs: true, wetNose: true, barks: false, wags: false, actual: 'not dog', emoji: '🐺' },
  ];

  const featureList = [
    { key: 'furry' as const, label: 'Has fur', importance: 'low' },
    { key: 'fourLegs' as const, label: 'Four legs', importance: 'low' },
    { key: 'wetNose' as const, label: 'Wet nose', importance: 'medium' },
    { key: 'barks' as const, label: 'Barks', importance: 'high' },
    { key: 'wags' as const, label: 'Wags tail at humans', importance: 'high' },
  ];

  // Classify based on active features
  const classify = (c: typeof candidates[0]) => {
    let score = 0;
    let maxScore = 0;
    if (weights.furry) { maxScore++; if (c.furry) score++; }
    if (weights.fourLegs) { maxScore++; if (c.fourLegs) score++; }
    if (weights.wetNose) { maxScore++; if (c.wetNose) score++; }
    if (weights.barks) { maxScore += 2; if (c.barks) score += 2; } // barks weighted 2x
    if (weights.wags) { maxScore += 2; if (c.wags) score += 2; } // wags weighted 2x
    if (maxScore === 0) return { prediction: '?', confidence: 0 };
    const confidence = score / maxScore;
    return { prediction: confidence > 0.6 ? 'dog' : 'not dog', confidence };
  };

  const activeCount = Object.values(weights).filter(Boolean).length;

  return (
    <div className="my-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          A child learning "what is a dog?" doesn't weight all features equally.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Toggle features on/off. Watch how the classifier's accuracy changes. Which features matter most?
        </p>
      </div>

      <div className="p-5">
        {/* Feature toggles */}
        <div className="flex flex-wrap gap-2 mb-5">
          {featureList.map((f) => (
            <button
              key={f.key}
              onClick={() => setWeights(w => ({ ...w, [f.key]: !w[f.key] }))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                weights[f.key]
                  ? f.importance === 'high'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : f.importance === 'medium'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'bg-gray-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 line-through'
              }`}
            >
              {f.label}
              {weights[f.key] && f.importance === 'high' && ' ★★'}
              {weights[f.key] && f.importance === 'medium' && ' ★'}
            </button>
          ))}
        </div>

        {/* Classification results */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {candidates.map((c) => {
            const result = classify(c);
            const correct = result.prediction === c.actual;
            const isUnsure = result.prediction === '?';
            return (
              <div
                key={c.name}
                className={`p-3 rounded-xl border-2 transition-all text-center ${
                  isUnsure
                    ? 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30'
                    : correct
                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <span className="text-2xl">{c.emoji}</span>
                <p className="text-xs font-semibold text-gray-900 dark:text-white mt-1">{c.name}</p>
                <p className={`text-[10px] mt-0.5 font-semibold ${
                  isUnsure ? 'text-gray-400' : correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {isUnsure ? 'No features selected' : `→ ${result.prediction}`}
                  {!isUnsure && (correct ? ' ✓' : ' ✗')}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  Actually: {c.actual}
                </p>
              </div>
            );
          })}
        </div>

        {/* Accuracy */}
        <div className="mt-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700/30 rounded-lg px-4 py-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Features active: {activeCount}/5
          </span>
          <span className="text-xs font-bold text-gray-900 dark:text-white">
            Accuracy: {activeCount === 0 ? '—' : `${candidates.filter(c => classify(c).prediction === c.actual).length}/${candidates.length}`}
          </span>
        </div>

        {/* Insight */}
        <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-4 py-3">
          <p className="text-xs text-amber-800 dark:text-amber-300">
            {activeCount === 5
              ? '★ With all features, the classifier gets most right. But notice: "barks" and "wags tail" matter more than "has fur" (every candidate has fur — it doesn\'t help distinguish). ML models learn this automatically: features that don\'t help separate classes get low weight.'
              : activeCount >= 3
              ? 'Try turning off "has fur" and "four legs" — accuracy barely changes. These features are shared by ALL candidates, so they don\'t help classify. Now try turning off "barks" — accuracy drops. That\'s a HIGH-WEIGHT feature.'
              : activeCount >= 1
              ? 'With only low-importance features, the classifier struggles. It needs the distinguishing features — the ones that are different between dogs and non-dogs.'
              : 'No features selected — the classifier can\'t make any decisions. Features are the raw material of machine learning.'}
          </p>
        </div>
      </div>
    </div>
  );
}
