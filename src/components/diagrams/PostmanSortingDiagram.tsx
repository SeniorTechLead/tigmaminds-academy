import { useState } from 'react';

/**
 * Interactive diagram: a postman sorting parcels by physical features.
 * Student drags/clicks parcels to see their features and classification.
 */
export default function PostmanSortingDiagram() {
  const [selected, setSelected] = useState<number | null>(null);

  const parcels = [
    {
      label: 'Letter',
      weight: '50g',
      size: '24×16 cm',
      shape: 'Flat rectangle',
      flex: 'Bendable',
      bag: 'Bike pouch',
      bagColor: '#3b82f6',
      color: '#dbeafe',
      border: '#93c5fd',
      icon: '✉️',
      w: 70, h: 35,
    },
    {
      label: 'Small box',
      weight: '800g',
      size: '20×15×10 cm',
      shape: 'Rigid cube',
      flex: 'Stiff',
      bag: 'Shoulder bag',
      bagColor: '#f59e0b',
      color: '#fef3c7',
      border: '#fcd34d',
      icon: '📦',
      w: 50, h: 50,
    },
    {
      label: 'Heavy crate',
      weight: '12 kg',
      size: '60×40×30 cm',
      shape: 'Large box',
      flex: 'Rigid',
      bag: 'Truck',
      bagColor: '#ef4444',
      color: '#fee2e2',
      border: '#fca5a5',
      icon: '📦',
      w: 75, h: 60,
    },
    {
      label: 'Padded envelope',
      weight: '350g',
      size: '30×22 cm',
      shape: 'Thick flat',
      flex: 'Semi-flexible',
      bag: '🤔 Boundary case!',
      bagColor: '#8b5cf6',
      color: '#ede9fe',
      border: '#c4b5fd',
      icon: '📨',
      w: 65, h: 40,
    },
  ];

  return (
    <div className="my-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          The postman classifies parcels by feel — weight, size, shape, flexibility.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Tap each parcel to see its features and which bag it goes in.
        </p>
      </div>

      <div className="p-5">
        {/* Postman scene */}
        <svg viewBox="0 0 630 210" className="w-full max-w-lg mx-auto mb-4" role="img" aria-label="Postman sorting parcels">
          {/* Postman figure */}
          <g transform="translate(30, 40)">
            {/* Body */}
            <rect x="8" y="35" width="30" height="40" rx="4" fill="#1e40af" />
            {/* Head */}
            <circle cx="23" cy="22" r="15" fill="#fbbf24" />
            {/* Cap */}
            <ellipse cx="23" cy="14" rx="17" ry="6" fill="#1e40af" />
            <rect x="6" y="11" width="34" height="4" rx="2" fill="#1e40af" />
            {/* Arms reaching out */}
            <line x1="38" y1="50" x2="55" y2="42" stroke="#1e40af" strokeWidth="4" strokeLinecap="round" />
            {/* Legs */}
            <line x1="16" y1="75" x2="12" y2="95" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" />
            <line x1="30" y1="75" x2="34" y2="95" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" />
            {/* Smile */}
            <path d="M 17 26 Q 23 32 29 26" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="18" cy="20" r="2" fill="#1e3a8a" />
            <circle cx="28" cy="20" r="2" fill="#1e3a8a" />
          </g>

          {/* Parcels on table */}
          {parcels.map((p, i) => {
            const x = 120 + i * 115;
            const y = 100 - p.h / 2;
            const isSelected = selected === i;
            return (
              <g
                key={i}
                onClick={() => setSelected(isSelected ? null : i)}
                className="cursor-pointer"
                style={{ filter: selected !== null && !isSelected ? 'opacity(0.3)' : 'none' }}
              >
                <rect
                  x={x - p.w / 2} y={y}
                  width={p.w} height={p.h}
                  rx="4"
                  fill={p.color}
                  stroke={isSelected ? p.bagColor : p.border}
                  strokeWidth={isSelected ? 3 : 1.5}
                />
                <text x={x} y={y + p.h / 2 + 1} textAnchor="middle" fontSize="20" dominantBaseline="middle">
                  {p.icon}
                </text>
                <text x={x} y={y + p.h + 14} textAnchor="middle" fontSize="9" className="fill-gray-600 dark:fill-gray-400" fontWeight="600">
                  {p.label}
                </text>
              </g>
            );
          })}

          {/* Three destination bags */}
          <g transform="translate(80, 155)">
            <rect x="0" y="0" width="60" height="28" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="30" y="12" textAnchor="middle" fontSize="8" className="fill-blue-800 dark:fill-blue-300" fontWeight="700">🚲 Bike</text>
            <text x="30" y="22" textAnchor="middle" fontSize="10" className="fill-blue-500 dark:fill-blue-400">pouch</text>
          </g>
          <g transform="translate(220, 155)">
            <rect x="0" y="0" width="60" height="28" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="30" y="12" textAnchor="middle" fontSize="8" className="fill-amber-800 dark:fill-amber-300" fontWeight="700">👜 Shoulder</text>
            <text x="30" y="22" textAnchor="middle" fontSize="10" className="fill-amber-600 dark:fill-amber-400">bag</text>
          </g>
          <g transform="translate(360, 155)">
            <rect x="0" y="0" width="60" height="28" rx="6" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
            <text x="30" y="12" textAnchor="middle" fontSize="8" className="fill-red-800 dark:fill-red-300" fontWeight="700">🚛 Truck</text>
            <text x="30" y="22" textAnchor="middle" fontSize="10" className="fill-red-500 dark:fill-red-400">crate</text>
          </g>
        </svg>

        {/* Feature card for selected parcel */}
        {selected !== null && (
          <div
            className="rounded-xl p-4 border-2 transition-all"
            style={{ borderColor: parcels[selected].bagColor, backgroundColor: parcels[selected].color + '40' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{parcels[selected].icon}</span>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{parcels[selected].label}</p>
                <p className="text-xs font-semibold" style={{ color: parcels[selected].bagColor }}>
                  → {parcels[selected].bag}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Weight', value: parcels[selected].weight, icon: '⚖️' },
                { label: 'Size', value: parcels[selected].size, icon: '📏' },
                { label: 'Shape', value: parcels[selected].shape, icon: '🔷' },
                { label: 'Flexibility', value: parcels[selected].flex, icon: '🤸' },
              ].map((f) => (
                <div key={f.label} className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center">
                  <span className="text-lg">{f.icon}</span>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">{f.label}</p>
                  <p className="text-xs text-gray-900 dark:text-white font-bold">{f.value}</p>
                </div>
              ))}
            </div>
            {selected === 3 && (
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg px-3 py-2">
                This padded envelope is right on the boundary — too big for the bike pouch, too light for the truck.
                The postman hesitates. ML classifiers make the same kind of mistakes at decision boundaries.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
