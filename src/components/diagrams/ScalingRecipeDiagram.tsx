/**
 * Tara's pitha recipe scales up from "feeds 4" to "feeds 10" — multiply every
 * ingredient by 10/4 = 2.5. Visualised as a "before" recipe card on the left,
 * an "×2.5" arrow in the middle, and an "after" recipe card on the right.
 *
 * Used in the Proportions section.
 */
import Tara from './people/Tara';

export default function ScalingRecipeDiagram() {
  const W = 720, H = 380;

  const ingredients = [
    { name: 'Rice flour', base: '2 cups', scaled: '5 cups' },
    { name: 'Jaggery',    base: '1 cup',  scaled: '2.5 cups' },
    { name: 'Coconut',    base: '½ cup',  scaled: '1¼ cups' },
    { name: 'Milk',       base: '1 cup',  scaled: '2.5 cups' },
  ];

  // Card geometry
  const card1X = 80, card2X = 470;
  const cardW = 220, cardH = 250, cardY = 80;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara scales her pitha recipe from 4 servings to 10 by multiplying every ingredient by 2.5">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="380" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          From 4 servings to 10 — same recipe, scaled
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Every ingredient multiplied by the same factor: 10 ÷ 4 = 2.5
        </text>

        {/* "Before" recipe card */}
        <rect x={card1X} y={cardY} width={cardW} height={cardH} rx="10" fill="white" stroke="#475569" strokeWidth="1.8" className="dark:fill-gray-800 dark:stroke-gray-500" />
        {/* Card header */}
        <rect x={card1X} y={cardY} width={cardW} height="30" rx="10" fill="#bae6fd" className="dark:fill-blue-900/40" />
        <rect x={card1X} y={cardY + 18} width={cardW} height="12" fill="#bae6fd" className="dark:fill-blue-900/40" />
        <text x={card1X + cardW / 2} y={cardY + 20} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0c4a6e" className="dark:fill-blue-200">
          Pitha — feeds 4
        </text>
        {/* Ingredients */}
        {ingredients.map((ing, i) => (
          <g key={`b-${i}`}>
            <text x={card1X + 16} y={cardY + 60 + i * 36} fontSize="12" fontWeight="600" fill="#1e293b" className="dark:fill-gray-200">
              {ing.name}
            </text>
            <text x={card1X + cardW - 16} y={cardY + 60 + i * 36} textAnchor="end" fontSize="13" fontWeight="700" fill="#0c4a6e" className="dark:fill-blue-200">
              {ing.base}
            </text>
            {i < ingredients.length - 1 && (
              <line x1={card1X + 14} y1={cardY + 70 + i * 36} x2={card1X + cardW - 14} y2={cardY + 70 + i * 36} stroke="#cbd5e1" strokeWidth="0.6" />
            )}
          </g>
        ))}

        {/* Arrow with ×2.5 multiplier in middle */}
        <line x1={card1X + cardW + 12} y1={cardY + cardH / 2} x2={card2X - 12} y2={cardY + cardH / 2}
          stroke="#f97316" strokeWidth="3" markerEnd="url(#arrowM-sr)" />
        <defs>
          <marker id="arrowM-sr" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="#f97316" />
          </marker>
        </defs>
        <rect x={(card1X + cardW + card2X) / 2 - 28} y={cardY + cardH / 2 - 18} width="56" height="36" rx="18"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x={(card1X + cardW + card2X) / 2} y={cardY + cardH / 2 + 4} textAnchor="middle" fontSize="16" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          ×2.5
        </text>

        {/* "After" recipe card */}
        <rect x={card2X} y={cardY} width={cardW} height={cardH} rx="10" fill="white" stroke="#475569" strokeWidth="1.8" className="dark:fill-gray-800 dark:stroke-gray-500" />
        {/* Card header */}
        <rect x={card2X} y={cardY} width={cardW} height="30" rx="10" fill="#d1fae5" className="dark:fill-emerald-900/40" />
        <rect x={card2X} y={cardY + 18} width={cardW} height="12" fill="#d1fae5" className="dark:fill-emerald-900/40" />
        <text x={card2X + cardW / 2} y={cardY + 20} textAnchor="middle" fontSize="13" fontWeight="700" fill="#064e3b" className="dark:fill-emerald-200">
          Pitha — feeds 10
        </text>
        {/* Ingredients */}
        {ingredients.map((ing, i) => (
          <g key={`a-${i}`}>
            <text x={card2X + 16} y={cardY + 60 + i * 36} fontSize="12" fontWeight="600" fill="#1e293b" className="dark:fill-gray-200">
              {ing.name}
            </text>
            <text x={card2X + cardW - 16} y={cardY + 60 + i * 36} textAnchor="end" fontSize="13" fontWeight="700" fill="#064e3b" className="dark:fill-emerald-200">
              {ing.scaled}
            </text>
            {i < ingredients.length - 1 && (
              <line x1={card2X + 14} y1={cardY + 70 + i * 36} x2={card2X + cardW - 14} y2={cardY + 70 + i * 36} stroke="#cbd5e1" strokeWidth="0.6" />
            )}
          </g>
        ))}

        {/* Note: ratios stay the same */}
        <rect x={W / 2 - 180} y={H - 50} width="360" height="32" rx="8"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 30} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Flour : Jaggery is still 2 : 1 — the ratio is preserved.
        </text>
      </svg>
    </div>
  );
}
