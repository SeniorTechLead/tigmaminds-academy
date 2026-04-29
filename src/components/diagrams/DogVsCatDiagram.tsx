import { useState } from 'react';

/**
 * Dogs vs Cats classification diagram — shows two approaches:
 * rule-based (with crossed-out rules) vs ML (with examples flowing in).
 * Used in the ML reference opening section.
 */
export default function DogVsCatDiagram() {
  const [approach, setApproach] = useState<'rules' | 'ml'>('rules');

  return (
    <div className="my-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <button
            onClick={() => setApproach('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              approach === 'rules' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 ring-2 ring-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
            }`}
          >
            Approach 1: Write Rules
          </button>
          <button
            onClick={() => setApproach('ml')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              approach === 'ml' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
            }`}
          >
            Approach 2: Show Examples (ML)
          </button>
        </div>
      </div>

      <div className="p-5">
        <svg viewBox="0 0 720 400" className="w-full max-w-3xl mx-auto" role="img" aria-label="Dogs vs cats classification">
          {/* Dog side */}
          <g transform="translate(20, 30)">
            <text x="50" y="0" textAnchor="middle" fontSize="40">🐕</text>
            <text x="50" y="70" textAnchor="middle" fontSize="40">🐩</text>
            <text x="50" y="140" textAnchor="middle" fontSize="40">🐕‍🦺</text>
            <text x="50" y="26" textAnchor="middle" fontSize="13" className="fill-emerald-600 dark:fill-emerald-400" fontWeight="700">DOG</text>
            <text x="50" y="96" textAnchor="middle" fontSize="13" className="fill-emerald-600 dark:fill-emerald-400" fontWeight="700">DOG</text>
            <text x="50" y="166" textAnchor="middle" fontSize="13" className="fill-emerald-600 dark:fill-emerald-400" fontWeight="700">DOG</text>
          </g>

          {/* Cat side */}
          <g transform="translate(540, 30)">
            <text x="50" y="0" textAnchor="middle" fontSize="40">🐈</text>
            <text x="50" y="70" textAnchor="middle" fontSize="40">🐈‍⬛</text>
            <text x="50" y="140" textAnchor="middle" fontSize="40">🦁</text>
            <text x="50" y="26" textAnchor="middle" fontSize="13" className="fill-rose-600 dark:fill-rose-400" fontWeight="700">CAT</text>
            <text x="50" y="96" textAnchor="middle" fontSize="13" className="fill-rose-600 dark:fill-rose-400" fontWeight="700">CAT</text>
            <text x="50" y="166" textAnchor="middle" fontSize="11" className="fill-rose-600 dark:fill-rose-400" fontWeight="700">NOT A DOG</text>
          </g>

          {/* Center: the classifier */}
          <rect x="155" y="15" width="330" height="230" rx="12"
            fill={approach === 'rules' ? '#fef2f2' : '#ecfdf5'}
            stroke={approach === 'rules' ? '#fca5a5' : '#6ee7b7'}
            strokeWidth="2"
          />

          {approach === 'rules' ? (
            // Rule-based approach: each rule on its own line, failure annotation directly underneath
            <g>
              <text x="320" y="42" textAnchor="middle" fontSize="15" className="fill-red-700 dark:fill-red-400" fontWeight="700">
                Rule-based classifier
              </text>
              {[
                { rule: 'IF pointed ears → cat', fail: '✗ But huskies have pointed ears too', ruleW: 138 },
                { rule: 'IF small + fluffy → cat', fail: '✗ But pomeranians are small & fluffy', ruleW: 140 },
                { rule: 'IF slit pupils → cat', fail: '✗ But photos at night can fool it', ruleW: 118 },
                { rule: 'IF purrs → cat', fail: '✗ But photos have no sound at all', ruleW: 86 },
              ].map((r, i) => {
                const y = 68 + i * 38;
                return (
                  <g key={i} opacity="0.9">
                    <text x="170" y={y} fontSize="12" className="fill-gray-800 dark:fill-gray-200" fontWeight="600">{r.rule}</text>
                    <line x1="165" y1={y - 3} x2={165 + r.ruleW} y2={y - 3} stroke="#ef4444" strokeWidth="1.5" />
                    <text x="185" y={y + 14} fontSize="10" className="fill-red-500" fontWeight="600">{r.fail}</text>
                  </g>
                );
              })}
              <text x="320" y="235" textAnchor="middle" fontSize="12" className="fill-red-600" fontWeight="700">
                Rules keep breaking...
              </text>
            </g>
          ) : (
            // ML approach
            <g>
              <text x="320" y="42" textAnchor="middle" fontSize="15" className="fill-emerald-700 dark:fill-emerald-400" fontWeight="700">
                ML classifier
              </text>
              <text x="320" y="62" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-gray-400">
                Trained on 10,000 labelled photos
              </text>
              {/* Examples flowing in */}
              {[90, 120, 150, 180].map((y, i) => (
                <g key={i}>
                  <rect x="180" y={y - 11} width="280" height="22" rx="11"
                    fill={i < 2 ? '#dcfce7' : '#ffe4e6'}
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 300}ms` }}
                  />
                  <text x="320" y={y + 4} textAnchor="middle" fontSize="12" className="fill-gray-800 dark:fill-gray-200" fontWeight="600">
                    {['🐕 → dog ✓', '🐩 → dog ✓', '🐈 → cat ✓', '🦁 → not a dog ✓'][i]}
                  </text>
                </g>
              ))}
              <text x="320" y="220" textAnchor="middle" fontSize="12" className="fill-emerald-600" fontWeight="700">
                Learns patterns automatically
              </text>
            </g>
          )}

          {/* New unknown animal */}
          <g transform="translate(235, 265)">
            <rect x="0" y="0" width="170" height="60" rx="10"
              fill="#fef9c3" stroke="#eab308" strokeWidth="2" strokeDasharray="4,3"
            />
            <text x="30" y="38" fontSize="30">🐕‍🦺</text>
            <text x="75" y="24" fontSize="12" className="fill-gray-800 dark:fill-gray-100" fontWeight="700">New photo:</text>
            <text x="75" y="44" fontSize="11" className="fill-gray-600 dark:fill-gray-400">Never seen this breed</text>
            <text x="85" y="78" textAnchor="middle" fontSize="12" fontWeight="700"
              className={approach === 'rules' ? 'fill-red-600' : 'fill-emerald-600'}>
              {approach === 'rules' ? '❓ Rules don\'t cover this case' : '→ dog (93% confidence) ✓'}
            </text>
          </g>

          {/* Arrows: dogs → classifier, classifier → cats */}
          <line x1="95" y1="100" x2="150" y2="100" stroke="#9ca3af" strokeWidth="1.5" markerEnd="url(#arrowGray)" />
          <line x1="485" y1="100" x2="535" y2="100" stroke="#9ca3af" strokeWidth="1.5" markerEnd="url(#arrowGray)" />

          <defs>
            <marker id="arrowGray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#9ca3af" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
}
