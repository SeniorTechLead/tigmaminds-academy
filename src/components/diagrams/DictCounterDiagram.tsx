/**
 * Visual diagram showing how a dictionary counts characters.
 * Step-by-step: iterate through "RROOYP", building a count dict.
 */
import { useState } from 'react';

export default function DictCounterDiagram() {
  const input = 'RROOYP';
  const [step, setStep] = useState(input.length); // show final state by default

  // Build state at each step
  const states: Record<string, number>[] = [{}];
  for (let i = 0; i < input.length; i++) {
    const prev = { ...states[i] };
    const ch = input[i];
    prev[ch] = (prev[ch] || 0) + 1;
    states.push(prev);
  }

  const current = states[step];
  const keys = Object.keys(current);
  const totalW = 400;

  const colors: Record<string, string> = {
    R: 'fill-red-200 dark:fill-red-900/40 stroke-red-400',
    O: 'fill-orange-200 dark:fill-orange-900/40 stroke-orange-400',
    Y: 'fill-yellow-200 dark:fill-yellow-900/40 stroke-yellow-400',
    P: 'fill-pink-200 dark:fill-pink-900/40 stroke-pink-400',
  };

  const textColors: Record<string, string> = {
    R: 'fill-red-700 dark:fill-red-300',
    O: 'fill-orange-700 dark:fill-orange-300',
    Y: 'fill-yellow-700 dark:fill-yellow-300',
    P: 'fill-pink-700 dark:fill-pink-300',
  };

  return (
    <svg viewBox={`0 0 ${totalW} 180`} className="w-full max-w-md mx-auto" role="img" aria-label="Dictionary counter building step by step">
      {/* Title */}
      <text x={totalW / 2} y="16" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="12" fontWeight="700">
        Dictionary: Counting Characters
      </text>

      {/* Input string with highlight */}
      <g transform="translate(40, 30)">
        <text className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontWeight="600">Input:</text>
        {input.split('').map((ch, i) => {
          const processed = i < step;
          const isCurrent = i === step - 1;
          return (
            <g key={i}>
              <rect x={40 + i * 32} y={-10} width="28" height="22" rx="4"
                className={isCurrent ? `${colors[ch]} stroke-2` : processed ? 'fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600' : 'fill-white dark:fill-gray-900 stroke-gray-200 dark:stroke-gray-700'}
                strokeWidth={isCurrent ? 2 : 1} />
              <text x={40 + i * 32 + 14} y={4} textAnchor="middle"
                className={processed ? 'fill-gray-700 dark:fill-gray-300' : 'fill-gray-400 dark:fill-gray-600'}
                fontSize="13" fontWeight="700" fontFamily="monospace">
                {ch}
              </text>
            </g>
          );
        })}
      </g>

      {/* Arrow */}
      <text x={totalW / 2} y="64" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="10">
        ↓ counts.get(char, 0) + 1
      </text>

      {/* Dictionary visualization */}
      <g transform="translate(40, 78)">
        <text className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontWeight="600">Dict:</text>
        <rect x="35" y="-12" width={keys.length > 0 ? keys.length * 80 + 10 : 50} height="55" rx="8"
          className="fill-gray-50 dark:fill-gray-800/50 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" strokeDasharray="4 2" />
        {keys.length === 0 && (
          <text x="60" y="18" className="fill-gray-400 dark:fill-gray-600" fontSize="10" fontFamily="monospace">{'{}'}</text>
        )}
        {keys.map((k, i) => (
          <g key={k} transform={`translate(${45 + i * 80}, 0)`}>
            {/* Key */}
            <rect x="0" y="0" width="30" height="28" rx="5"
              className={`${colors[k] || 'fill-gray-200 stroke-gray-400'}`} strokeWidth="1.5" />
            <text x="15" y="18" textAnchor="middle"
              className={textColors[k] || 'fill-gray-700 dark:fill-gray-300'}
              fontSize="14" fontWeight="800" fontFamily="monospace">
              {k}
            </text>
            {/* Colon */}
            <text x="36" y="18" className="fill-gray-400" fontSize="12">:</text>
            {/* Value */}
            <rect x="42" y="0" width="28" height="28" rx="5"
              className="fill-white dark:fill-gray-900 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
            <text x="56" y="18" textAnchor="middle"
              className="fill-gray-900 dark:fill-white" fontSize="14" fontWeight="700" fontFamily="monospace">
              {current[k]}
            </text>
          </g>
        ))}
      </g>

      {/* Step slider */}
      <g transform={`translate(40, 148)`}>
        <text className="fill-gray-500 dark:fill-gray-400" fontSize="9">Step {step}/{input.length}</text>
        {Array.from({ length: input.length + 1 }, (_, i) => (
          <rect key={i} x={50 + i * 30} y={-4} width="24" height="14" rx="3"
            className={i === step ? 'fill-amber-400 dark:fill-amber-600 stroke-amber-500' : 'fill-gray-200 dark:fill-gray-700 stroke-gray-300 dark:stroke-gray-600'}
            strokeWidth="1"
            onClick={() => setStep(i)} style={{ cursor: 'pointer' }} />
        ))}
        {Array.from({ length: input.length + 1 }, (_, i) => (
          <text key={`t${i}`} x={50 + i * 30 + 12} y={7} textAnchor="middle"
            className={i === step ? 'fill-white dark:fill-gray-900 pointer-events-none' : 'fill-gray-500 dark:fill-gray-400 pointer-events-none'}
            fontSize="8" fontWeight="600">
            {i}
          </text>
        ))}
      </g>
    </svg>
  );
}
