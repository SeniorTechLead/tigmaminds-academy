export default function CorridorConflictSolutionDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Human-elephant conflict solutions: early warning, barriers, compensation, and corridor restoration"
      >
        <rect width="700" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-orange-600 dark:fill-orange-400">
          Human-Elephant Conflict: Solutions That Work
        </text>
        <text x="350" y="52" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          No single solution works everywhere — the best programs combine multiple strategies
        </text>

        {/* Four solution panels */}
        {[
          {
            x: 40, y: 70, w: 300, h: 160,
            title: 'Early Warning Systems',
            icon: '\ud83d\udce1',
            color: 'fill-blue-50 dark:fill-blue-950/20 stroke-blue-300 dark:stroke-blue-700',
            titleColor: 'fill-blue-700 dark:fill-blue-300',
            items: [
              'Motion sensors on corridor edges',
              'SMS alerts to farmers\u2019 phones',
              'Sirens activated by elephant approach',
              '30-min warning = enough to act',
            ],
          },
          {
            x: 360, y: 70, w: 300, h: 160,
            title: 'Elephant-Proof Barriers',
            icon: '\ud83d\udd12',
            color: 'fill-amber-50 dark:fill-amber-950/20 stroke-amber-300 dark:stroke-amber-700',
            titleColor: 'fill-amber-700 dark:fill-amber-300',
            items: [
              'Solar-powered electric fences',
              'Trenches elephants won\u2019t cross',
              'Beehive fences (elephants avoid bees!)',
              'Guides along corridor, not blocks',
            ],
          },
          {
            x: 40, y: 250, w: 300, h: 160,
            title: 'Economic Compensation',
            icon: '\ud83d\udcb0',
            color: 'fill-emerald-50 dark:fill-emerald-950/20 stroke-emerald-300 dark:stroke-emerald-700',
            titleColor: 'fill-emerald-700 dark:fill-emerald-300',
            items: [
              'Rapid crop damage compensation',
              'Crop insurance programs',
              'Eco-tourism revenue sharing',
              'Alternative livelihood training',
            ],
          },
          {
            x: 360, y: 250, w: 300, h: 160,
            title: 'Corridor Restoration',
            icon: '\ud83c\udf33',
            color: 'fill-green-50 dark:fill-green-950/20 stroke-green-300 dark:stroke-green-700',
            titleColor: 'fill-green-700 dark:fill-green-300',
            items: [
              'Buy and reforest corridor land',
              'Road underpasses for wildlife',
              'Remove barriers on traditional routes',
              'Community-managed conservation zones',
            ],
          },
        ].map(({ x, y, w, h, title, icon, color, titleColor, items }) => (
          <g key={title}>
            <rect x={x} y={y} width={w} height={h} rx="10" className={color} strokeWidth="1.5" />
            <text x={x + 20} y={y + 24} fontSize="16">{icon}</text>
            <text x={x + 42} y={y + 26} fontSize="12" fontWeight="700" className={titleColor}>{title}</text>
            {items.map((item, i) => (
              <text key={i} x={x + 20} y={y + 50 + i * 18} fontSize="10" className="fill-gray-600 dark:fill-slate-400">
                • {item}
              </text>
            ))}
          </g>
        ))}

        {/* Key principle */}
        <rect x="60" y="420" width="580" height="30" rx="8" className="fill-orange-50 dark:fill-orange-950/30 stroke-orange-200 dark:stroke-orange-800" strokeWidth="1" />
        <text x="350" y="440" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-orange-700 dark:fill-orange-300">
          Key: involve local communities in planning — people who live with elephants know what works
        </text>
      </svg>
    </div>
  );
}
