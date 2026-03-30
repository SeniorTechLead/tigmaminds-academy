import { useState } from 'react';

type CrossType = 'BbxBb' | 'Bbxbb';

const crosses: Record<CrossType, {
  title: string;
  parent1: string[];
  parent2: string[];
  offspring: { genotype: string; phenotype: string; color: string; textColor: string }[];
  ratio: string;
}> = {
  BbxBb: {
    title: 'Brown eyes × Brown eyes (Bb × Bb)',
    parent1: ['B', 'b'],
    parent2: ['B', 'b'],
    offspring: [
      { genotype: 'BB', phenotype: 'Brown', color: 'fill-amber-700 dark:fill-amber-600', textColor: 'fill-white' },
      { genotype: 'Bb', phenotype: 'Brown', color: 'fill-amber-500 dark:fill-amber-500', textColor: 'fill-white' },
      { genotype: 'bB', phenotype: 'Brown', color: 'fill-amber-500 dark:fill-amber-500', textColor: 'fill-white' },
      { genotype: 'bb', phenotype: 'Blue', color: 'fill-sky-400 dark:fill-sky-500', textColor: 'fill-white' },
    ],
    ratio: '3 brown : 1 blue',
  },
  Bbxbb: {
    title: 'Brown eyes × Blue eyes (Bb × bb)',
    parent1: ['B', 'b'],
    parent2: ['b', 'b'],
    offspring: [
      { genotype: 'Bb', phenotype: 'Brown', color: 'fill-amber-500 dark:fill-amber-500', textColor: 'fill-white' },
      { genotype: 'Bb', phenotype: 'Brown', color: 'fill-amber-500 dark:fill-amber-500', textColor: 'fill-white' },
      { genotype: 'bb', phenotype: 'Blue', color: 'fill-sky-400 dark:fill-sky-500', textColor: 'fill-white' },
      { genotype: 'bb', phenotype: 'Blue', color: 'fill-sky-400 dark:fill-sky-500', textColor: 'fill-white' },
    ],
    ratio: '1 brown : 1 blue (50 : 50)',
  },
};

export default function PunnettSquareDiagram() {
  const [crossType, setCrossType] = useState<CrossType>('BbxBb');
  const data = crosses[crossType];

  const gridX = 160;
  const gridY = 100;
  const cellW = 80;
  const cellH = 65;

  return (
    <div className="my-4">
      {/* Toggle button */}
      <div className="flex justify-center mb-2">
        <button
          onClick={() => setCrossType(prev => prev === 'BbxBb' ? 'Bbxbb' : 'BbxBb')}
          className="px-3 py-1.5 text-sm rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors font-medium"
        >
          Toggle: {crossType === 'BbxBb' ? 'Switch to Bb × bb' : 'Switch to Bb × Bb'}
        </button>
      </div>

      <svg viewBox="0 0 420 388" className="w-full max-w-md mx-auto" role="img" aria-label="Punnett square diagram">
        {/* Title */}
        <text x="200" y="25" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="bold">
          {data.title}
        </text>

        {/* Parent 2 alleles — top header */}
        {data.parent2.map((allele, i) => (
          <g key={`top-${i}`}>
            <rect x={gridX + i * cellW} y={gridY - 40} width={cellW} height={35} rx="4"
              className="fill-purple-100 dark:fill-purple-900/30 stroke-purple-300 dark:stroke-purple-600" strokeWidth="1" />
            <text x={gridX + i * cellW + cellW / 2} y={gridY - 17}
              textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="16" fontWeight="bold">
              {allele}
            </text>
          </g>
        ))}
        <text x={gridX + cellW} y={gridY - 48} textAnchor="middle" className="fill-purple-600 dark:fill-purple-400" fontSize="10">
          Parent 2
        </text>

        {/* Parent 1 alleles — left header */}
        {data.parent1.map((allele, i) => (
          <g key={`left-${i}`}>
            <rect x={gridX - 55} y={gridY + i * cellH} width={50} height={cellH} rx="4"
              className="fill-teal-100 dark:fill-teal-900/30 stroke-teal-300 dark:stroke-teal-600" strokeWidth="1" />
            <text x={gridX - 30} y={gridY + i * cellH + cellH / 2 + 5}
              textAnchor="middle" className="fill-teal-700 dark:fill-teal-300" fontSize="16" fontWeight="bold">
              {allele}
            </text>
          </g>
        ))}
        <text x={gridX - 30} y={gridY - 10} textAnchor="middle" className="fill-teal-600 dark:fill-teal-400" fontSize="10">
          Parent 1
        </text>

        {/* 2x2 grid — offspring cells */}
        {data.offspring.map((cell, idx) => {
          const row = Math.floor(idx / 2);
          const col = idx % 2;
          const cx = gridX + col * cellW;
          const cy = gridY + row * cellH;
          return (
            <g key={idx}>
              <rect x={cx} y={cy} width={cellW} height={cellH} rx="4"
                className={`${cell.color} stroke-gray-300 dark:stroke-gray-600`} strokeWidth="1.5" />
              <text x={cx + cellW / 2} y={cy + 25} textAnchor="middle"
                className={cell.textColor} fontSize="15" fontWeight="bold">
                {cell.genotype}
              </text>
              <text x={cx + cellW / 2} y={cy + 44} textAnchor="middle"
                className={cell.textColor} fontSize="10" opacity="0.9">
                {cell.phenotype}
              </text>
            </g>
          );
        })}

        {/* Grid border */}
        <rect x={gridX} y={gridY} width={cellW * 2} height={cellH * 2}
          fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" rx="4" />

        {/* Ratio result */}
        <rect x="80" y="260" width="240" height="35" rx="8"
          className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="200" y="270" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Phenotype ratio
        </text>
        <text x="200" y="286" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="bold">
          {data.ratio}
        </text>

        {/* Key */}
        <text x="200" y="320" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          B = dominant (brown) &middot; b = recessive (blue)
        </text>
        <text x="200" y="338" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Carriers (Bb) show the dominant trait
        </text>
      </svg>
    </div>
  );
}
