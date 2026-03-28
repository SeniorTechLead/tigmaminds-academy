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
        <svg viewBox="0 0 600 340" className="w-full max-w-lg mx-auto" role="img" aria-label="Dogs vs cats classification">
          {/* Dog side */}
          <g transform="translate(20, 30)">
            <text x="50" y="0" textAnchor="middle" fontSize="40">🐕</text>
            <text x="50" y="70" textAnchor="middle" fontSize="40">🐩</text>
            <text x="50" y="140" textAnchor="middle" fontSize="40">🐕‍🦺</text>
            <text x="50" y="25" textAnchor="middle" fontSize="9" className="fill-emerald-600 dark:fill-emerald-400" fontWeight="700">DOG</text>
            <text x="50" y="95" textAnchor="middle" fontSize="9" className="fill-emerald-600 dark:fill-emerald-400" fontWeight="700">DOG</text>
            <text x="50" y="165" textAnchor="middle" fontSize="9" className="fill-emerald-600 dark:fill-emerald-400" fontWeight="700">DOG</text>
          </g>

          {/* Cat side */}
          <g transform="translate(460, 30)">
            <text x="50" y="0" textAnchor="middle" fontSize="40">🐈</text>
            <text x="50" y="70" textAnchor="middle" fontSize="40">🐈‍⬛</text>
            <text x="50" y="140" textAnchor="middle" fontSize="40">🦁</text>
            <text x="50" y="25" textAnchor="middle" fontSize="9" className="fill-rose-600 dark:fill-rose-400" fontWeight="700">CAT</text>
            <text x="50" y="95" textAnchor="middle" fontSize="9" className="fill-rose-600 dark:fill-rose-400" fontWeight="700">CAT</text>
            <text x="50" y="165" textAnchor="middle" fontSize="9" className="fill-rose-600 dark:fill-rose-400" fontWeight="700">NOT A DOG</text>
          </g>

          {/* Center: the classifier */}
          <rect x="160" y="20" width="240" height="190" rx="12"
            fill={approach === 'rules' ? '#fef2f2' : '#ecfdf5'}
            stroke={approach === 'rules' ? '#fca5a5' : '#6ee7b7'}
            strokeWidth="2"
          />

          {approach === 'rules' ? (
            // Rule-based approach
            <g>
              <text x="280" y="45" textAnchor="middle" fontSize="11" className="fill-red-700 dark:fill-red-400" fontWeight="700">
                Rule-based classifier
              </text>
              {/* Rules with strikethroughs showing failures */}
              <g opacity="0.7">
                <text x="175" y="70" fontSize="9" className="fill-gray-600">IF pointed ears → cat</text>
                <line x1="170" y1="68" x2="335" y2="68" stroke="#ef4444" strokeWidth="1.5" />
                <text x="340" y="70" fontSize="8" className="fill-red-500">✗ Huskies too!</text>
              </g>
              <g opacity="0.7">
                <text x="175" y="90" fontSize="9" className="fill-gray-600">IF small + fluffy → cat</text>
                <line x1="170" y1="88" x2="325" y2="88" stroke="#ef4444" strokeWidth="1.5" />
                <text x="330" y="90" fontSize="8" className="fill-red-500">✗ Pomeranians!</text>
              </g>
              <g opacity="0.7">
                <text x="175" y="110" fontSize="9" className="fill-gray-600">IF slit pupils → cat</text>
                <line x1="170" y1="108" x2="310" y2="108" stroke="#ef4444" strokeWidth="1.5" />
                <text x="315" y="110" fontSize="8" className="fill-red-500">✗ Night photos!</text>
              </g>
              <g opacity="0.7">
                <text x="175" y="130" fontSize="9" className="fill-gray-600">IF purrs → cat</text>
                <line x1="170" y1="128" x2="280" y2="128" stroke="#ef4444" strokeWidth="1.5" />
                <text x="285" y="130" fontSize="8" className="fill-red-500">✗ Photos only!</text>
              </g>
              <text x="280" y="180" textAnchor="middle" fontSize="9" className="fill-red-600" fontWeight="600">
                Rules keep breaking...
              </text>
            </g>
          ) : (
            // ML approach
            <g>
              <text x="280" y="45" textAnchor="middle" fontSize="11" className="fill-emerald-700 dark:fill-emerald-400" fontWeight="700">
                ML classifier
              </text>
              <text x="280" y="65" textAnchor="middle" fontSize="9" className="fill-gray-600 dark:fill-gray-400">
                Trained on 10,000 labelled photos
              </text>
              {/* Examples flowing in */}
              {[80, 100, 120, 140].map((y, i) => (
                <g key={i}>
                  <rect x="195" y={y - 8} width="170" height="16" rx="8"
                    fill={i < 2 ? '#dcfce7' : '#ffe4e6'}
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 300}ms` }}
                  />
                  <text x="280" y={y + 3} textAnchor="middle" fontSize="8" className="fill-gray-700 dark:fill-gray-300">
                    {['🐕 → dog ✓', '🐩 → dog ✓', '🐈 → cat ✓', '🦁 → not a dog ✓'][i]}
                  </text>
                </g>
              ))}
              <text x="280" y="180" textAnchor="middle" fontSize="9" className="fill-emerald-600" fontWeight="600">
                Learns patterns automatically
              </text>
            </g>
          )}

          {/* New unknown animal */}
          <g transform="translate(220, 220)">
            <rect x="0" y="0" width="120" height="50" rx="10"
              fill="#fef9c3" stroke="#eab308" strokeWidth="2" strokeDasharray="4,3"
            />
            <text x="28" y="28" fontSize="28">🐕‍🦺</text>
            <text x="65" y="20" fontSize="9" className="fill-gray-700 dark:fill-gray-200" fontWeight="700">New photo:</text>
            <text x="65" y="35" fontSize="9" className="fill-gray-500 dark:fill-gray-400">Never seen this breed</text>
            <text x="60" y="60" textAnchor="middle" fontSize="9" fontWeight="700"
              className={approach === 'rules' ? 'fill-red-600' : 'fill-emerald-600'}>
              {approach === 'rules' ? '❓ Rules don\'t cover this case' : '→ dog (93% confidence) ✓'}
            </text>
          </g>

          {/* Arrows: dogs → classifier, classifier → cats */}
          <line x1="95" y1="100" x2="155" y2="100" stroke="#9ca3af" strokeWidth="1.5" markerEnd="url(#arrowGray)" />
          <line x1="400" y1="100" x2="455" y2="100" stroke="#9ca3af" strokeWidth="1.5" markerEnd="url(#arrowGray)" />

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
