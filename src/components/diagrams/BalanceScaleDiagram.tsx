import { useState } from "react";

const STEPS = [
  {
    label: "Start: 2x + 3 = 11",
    left: { xBlocks: 2, ones: 3 },
    right: { xBlocks: 0, ones: 11 },
    hint: null,
  },
  {
    label: "Subtract 3 from both sides",
    left: { xBlocks: 2, ones: 0 },
    right: { xBlocks: 0, ones: 8 },
    hint: "2x + 3 - 3 = 11 - 3  →  2x = 8",
  },
  {
    label: "Divide both sides by 2",
    left: { xBlocks: 1, ones: 0 },
    right: { xBlocks: 0, ones: 4 },
    hint: "2x ÷ 2 = 8 ÷ 2  →  x = 4",
  },
] as const;

function Block({ x, y, text, color }: { x: number; y: number; text: string; color: string }) {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={22}
        height={22}
        rx="3"
        className={`${color} stroke-gray-600 dark:stroke-gray-300`}
        strokeWidth="1"
      />
      <text
        x={x + 11}
        y={y + 15}
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        className="fill-gray-800 dark:fill-gray-100"
      >
        {text}
      </text>
    </>
  );
}

export default function BalanceScaleDiagram() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const fulcrumX = 250, fulcrumY = 190;
  const panWidth = 140, panY = 140;
  const leftPanCx = 120, rightPanCx = 380;

  /* Render blocks on a pan */
  const renderBlocks = (
    panCenterX: number,
    baseY: number,
    xBlocks: number,
    ones: number,
  ) => {
    const blocks: JSX.Element[] = [];
    const totalCount = xBlocks + ones;
    /* Lay out blocks in rows of up to 5 */
    const cols = Math.min(totalCount, 5);
    const startX = panCenterX - (cols * 24) / 2;
    let idx = 0;

    for (let i = 0; i < xBlocks; i++) {
      const col = idx % 5;
      const row = Math.floor(idx / 5);
      blocks.push(
        <Block
          key={`x-${i}`}
          x={startX + col * 24}
          y={baseY - 28 - row * 26}
          text="x"
          color="fill-blue-300 dark:fill-blue-700/60"
        />,
      );
      idx++;
    }
    for (let i = 0; i < ones; i++) {
      const col = idx % 5;
      const row = Math.floor(idx / 5);
      blocks.push(
        <Block
          key={`1-${i}`}
          x={startX + col * 24}
          y={baseY - 28 - row * 26}
          text="1"
          color="fill-amber-200 dark:fill-amber-700/50"
        />,
      );
      idx++;
    }
    return blocks;
  };

  return (
    <div className="my-4">
      <svg
        viewBox="0 0 500 280"
        className="w-full max-w-lg mx-auto"
        role="img"
        aria-label={`Balance scale showing equation step: ${current.label}`}
      >
        {/* Fulcrum triangle */}
        <polygon
          points={`${fulcrumX},${fulcrumY} ${fulcrumX - 20},${fulcrumY + 30} ${fulcrumX + 20},${fulcrumY + 30}`}
          className="fill-gray-300 dark:fill-gray-600 stroke-gray-500 dark:stroke-gray-400"
          strokeWidth="1.5"
        />

        {/* Base */}
        <rect
          x={fulcrumX - 60}
          y={fulcrumY + 30}
          width={120}
          height={8}
          rx="3"
          className="fill-gray-400 dark:fill-gray-500"
        />

        {/* Beam (balanced — horizontal) */}
        <line
          x1={leftPanCx - panWidth / 2}
          y1={panY}
          x2={rightPanCx + panWidth / 2}
          y2={panY}
          className="stroke-gray-600 dark:stroke-gray-300"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Left pan */}
        <rect
          x={leftPanCx - panWidth / 2}
          y={panY}
          width={panWidth}
          height={6}
          rx="2"
          className="fill-gray-500 dark:fill-gray-400"
        />
        {/* Left strings */}
        <line x1={leftPanCx - panWidth / 2} y1={panY} x2={leftPanCx} y2={panY - 20} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <line x1={leftPanCx + panWidth / 2} y1={panY} x2={leftPanCx} y2={panY - 20} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />

        {/* Right pan */}
        <rect
          x={rightPanCx - panWidth / 2}
          y={panY}
          width={panWidth}
          height={6}
          rx="2"
          className="fill-gray-500 dark:fill-gray-400"
        />
        {/* Right strings */}
        <line x1={rightPanCx - panWidth / 2} y1={panY} x2={rightPanCx} y2={panY - 20} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <line x1={rightPanCx + panWidth / 2} y1={panY} x2={rightPanCx} y2={panY - 20} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />

        {/* Blocks on left pan */}
        {renderBlocks(leftPanCx, panY, current.left.xBlocks, current.left.ones)}

        {/* Blocks on right pan */}
        {renderBlocks(rightPanCx, panY, current.right.xBlocks, current.right.ones)}

        {/* Equals sign in the middle */}
        <text
          x={fulcrumX}
          y={panY - 30}
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          className="fill-gray-700 dark:fill-gray-200"
        >
          =
        </text>

        {/* Step label */}
        <text
          x={fulcrumX}
          y={24}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          className="fill-gray-800 dark:fill-gray-100"
        >
          {current.label}
        </text>

        {/* Hint / equation transform */}
        {current.hint && (
          <text
            x={fulcrumX}
            y={fulcrumY + 58}
            textAnchor="middle"
            fontSize="12"
            className="fill-purple-600 dark:fill-purple-400"
            fontFamily="monospace"
          >
            {current.hint}
          </text>
        )}

        {/* Legend */}
        <rect x={10} y={250} width={14} height={14} rx="2" className="fill-blue-300 dark:fill-blue-700/60 stroke-gray-500" strokeWidth="0.5" />
        <text x={28} y={262} fontSize="10" className="fill-gray-600 dark:fill-gray-400">= x</text>
        <rect x={60} y={250} width={14} height={14} rx="2" className="fill-amber-200 dark:fill-amber-700/50 stroke-gray-500" strokeWidth="0.5" />
        <text x={78} y={262} fontSize="10" className="fill-gray-600 dark:fill-gray-400">= 1</text>
      </svg>

      {/* Step navigation */}
      <div className="flex justify-center gap-2 mt-2">
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`px-3 py-1.5 text-xs rounded font-medium transition-colors ${
              step === i
                ? "bg-purple-600 text-white dark:bg-purple-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Step {i + 1}
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-1">
        Click steps to solve 2x + 3 = 11
      </p>
    </div>
  );
}
