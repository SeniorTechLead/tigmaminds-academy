import { useState, useEffect, useRef } from 'react';

export default function OhmsLawDiagram() {
  const [voltage, setVoltage] = useState(6);
  const [highlightVar, setHighlightVar] = useState<'V' | 'I' | 'R' | null>(null);
  const dotPosRef = useRef(0);
  const [, forceRender] = useState(0);

  const resistance = 100; // Fixed at 100 Ohms
  const current = voltage / resistance; // Amps
  const currentMA = current * 1000; // milliamps for display

  // Animate electron dots — speed proportional to current
  useEffect(() => {
    const baseInterval = 50;
    const speed = Math.max(0.3, current * 80); // scale speed with current
    const interval = setInterval(() => {
      dotPosRef.current = (dotPosRef.current + speed) % 100;
      forceRender(n => n + 1);
    }, baseInterval);
    return () => clearInterval(interval);
  }, [current]);

  const w = 540, h = 360;
  const top_ = 70, bottom_ = 260, left_ = 60, right_ = 440;

  // Circuit path helper
  const pathLength = 2 * (right_ - left_) + 2 * (bottom_ - top_);
  const t = (dotPosRef.current / 100) * pathLength;

  const getDotPosition = (dist: number) => {
    const topLen = right_ - left_;
    const rightLen = bottom_ - top_;
    const bottomLen = right_ - left_;
    let d = ((dist % pathLength) + pathLength) % pathLength;

    if (d < topLen) return { x: left_ + d, y: top_ };
    d -= topLen;
    if (d < rightLen) return { x: right_, y: top_ + d };
    d -= rightLen;
    if (d < bottomLen) return { x: right_ - d, y: bottom_ };
    d -= bottomLen;
    return { x: left_, y: bottom_ - d };
  };

  const dotCount = 8;
  const dots = Array.from({ length: dotCount }, (_, i) =>
    getDotPosition(t + (i * pathLength) / dotCount)
  );

  // V=IR triangle geometry (bottom-right corner)
  const triCx = 490, triCy = 310;
  const triSize = 40;

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        role="img"
        aria-label="Ohm's Law interactive circuit diagram showing V = IR"
      >
        {/* Background */}
        <rect width={w} height={h} fill="none" />

        {/* Title */}
        <text x={w / 2} y={28} textAnchor="middle" fontSize="16" fontWeight="700"
          className="fill-gray-800 dark:fill-gray-100">
          Ohm's Law: V = I &times; R
        </text>

        {/* ===== Circuit loop ===== */}
        <rect
          x={left_} y={top_} width={right_ - left_} height={bottom_ - top_}
          fill="none" stroke="currentColor"
          className="text-gray-400 dark:text-gray-500"
          strokeWidth="2.5" rx="12"
        />

        {/* ===== Battery (left side) ===== */}
        {/* Battery body */}
        <rect x={left_ - 18} y={130} width={36} height={60} rx="5"
          className="fill-red-50 dark:fill-red-900/30 stroke-red-400 dark:stroke-red-500"
          strokeWidth="1.5" />
        {/* + terminal */}
        <line x1={left_} y1={125} x2={left_} y2={130}
          className="stroke-red-500" strokeWidth="2" />
        <text x={left_ + 22} y={143} fontSize="12" fontWeight="700"
          className="fill-red-600 dark:fill-red-400">+</text>
        {/* - terminal */}
        <line x1={left_} y1={190} x2={left_} y2={195}
          className="stroke-gray-500" strokeWidth="2" />
        <text x={left_ + 22} y={192} fontSize="12" fontWeight="700"
          className="fill-gray-500 dark:fill-gray-400">&minus;</text>
        {/* Battery label */}
        <text x={left_} y={168} textAnchor="middle" fontSize="11" fontWeight="600"
          className="fill-red-700 dark:fill-red-300">
          {voltage}V
        </text>

        {/* ===== Resistor (top wire) ===== */}
        {/* Zigzag resistor symbol */}
        <path
          d={`M ${200} ${top_} l 10 -10 l 10 20 l 10 -20 l 10 20 l 10 -20 l 10 20 l 10 -10`}
          fill="none"
          className="stroke-amber-500 dark:stroke-amber-400"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Resistor label */}
        <rect x={210} y={top_ - 30} width={70} height={20} rx="4"
          className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-400"
          strokeWidth="1" />
        <text x={245} y={top_ - 16} textAnchor="middle" fontSize="11" fontWeight="600"
          className="fill-amber-700 dark:fill-amber-300">
          {resistance} &Omega;
        </text>

        {/* ===== Ammeter (bottom wire) ===== */}
        <circle cx={250} cy={bottom_} r="18"
          className="fill-blue-50 dark:fill-blue-900/30 stroke-blue-500"
          strokeWidth="1.5" />
        <text x={250} y={bottom_ + 1} textAnchor="middle" fontSize="10" fontWeight="700"
          className="fill-blue-700 dark:fill-blue-300">A</text>
        <text x={250} y={bottom_ + 4} textAnchor="middle" fontSize="10" fontWeight="700"
          className="fill-blue-700 dark:fill-blue-300" dy="13">
          {currentMA.toFixed(1)}mA
        </text>

        {/* Current direction arrow (top, right of resistor) */}
        <polygon points={`${310},${top_ - 5} ${320},${top_} ${310},${top_ + 5}`}
          className="fill-sky-500 dark:fill-sky-400" />
        <text x={335} y={top_ + 4} fontSize="9"
          className="fill-gray-500 dark:fill-gray-400">I</text>

        {/* Current direction arrow (bottom, left) */}
        <polygon points={`${170},${bottom_ + 5} ${160},${bottom_} ${170},${bottom_ - 5}`}
          className="fill-sky-500 dark:fill-sky-400" />

        {/* ===== Animated electron dots ===== */}
        {dots.map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r="4"
            className="fill-sky-500 dark:fill-sky-400" opacity={0.85}>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="0.8s" repeatCount="indefinite" />
          </circle>
        ))}

        {/* ===== Value displays ===== */}
        {/* Voltage display */}
        <rect x={370} y={100} width={120} height={36} rx="6"
          className={`stroke-red-400 dark:stroke-red-500 ${highlightVar === 'V' ? 'fill-red-100 dark:fill-red-900/50' : 'fill-white dark:fill-gray-800'}`}
          strokeWidth="1.5" />
        <text x={380} y={123} fontSize="12" fontWeight="600"
          className="fill-red-700 dark:fill-red-300">
          Voltage (V)
        </text>
        <text x={480} y={123} textAnchor="end" fontSize="13" fontWeight="700"
          className="fill-red-600 dark:fill-red-400">
          {voltage} V
        </text>

        {/* Current display */}
        <rect x={370} y={144} width={120} height={36} rx="6"
          className={`stroke-blue-400 dark:stroke-blue-500 ${highlightVar === 'I' ? 'fill-blue-100 dark:fill-blue-900/50' : 'fill-white dark:fill-gray-800'}`}
          strokeWidth="1.5" />
        <text x={380} y={167} fontSize="12" fontWeight="600"
          className="fill-blue-700 dark:fill-blue-300">
          Current (A)
        </text>
        <text x={480} y={167} textAnchor="end" fontSize="13" fontWeight="700"
          className="fill-blue-600 dark:fill-blue-400">
          {current.toFixed(3)} A
        </text>

        {/* Resistance display */}
        <rect x={370} y={188} width={120} height={36} rx="6"
          className={`stroke-amber-400 dark:stroke-amber-500 ${highlightVar === 'R' ? 'fill-amber-100 dark:fill-amber-900/50' : 'fill-white dark:fill-gray-800'}`}
          strokeWidth="1.5" />
        <text x={380} y={211} fontSize="12" fontWeight="600"
          className="fill-amber-700 dark:fill-amber-300">
          Resistance (&Omega;)
        </text>
        <text x={480} y={211} textAnchor="end" fontSize="13" fontWeight="700"
          className="fill-amber-600 dark:fill-amber-400">
          {resistance} &Omega;
        </text>

        {/* ===== V=IR Triangle (bottom-right) ===== */}
        {/* Triangle outline */}
        <polygon
          points={`${triCx},${triCy - triSize} ${triCx - triSize},${triCy + triSize * 0.6} ${triCx + triSize},${triCy + triSize * 0.6}`}
          fill="none"
          className="stroke-gray-400 dark:stroke-gray-500"
          strokeWidth="1.5"
        />
        {/* Horizontal divider */}
        <line
          x1={triCx - triSize * 0.7} y1={triCy - triSize * 0.1}
          x2={triCx + triSize * 0.7} y2={triCy - triSize * 0.1}
          className="stroke-gray-400 dark:stroke-gray-500"
          strokeWidth="1"
        />

        {/* V at top */}
        <text x={triCx} y={triCy - triSize * 0.25} textAnchor="middle" fontSize="13" fontWeight="700"
          className={highlightVar === 'V' ? 'fill-red-600 dark:fill-red-400' : 'fill-gray-600 dark:fill-gray-300'}
          style={{ cursor: 'pointer' }}
          onClick={() => setHighlightVar(highlightVar === 'V' ? null : 'V')}>
          V
        </text>
        {/* I at bottom-left */}
        <text x={triCx - triSize * 0.35} y={triCy + triSize * 0.35} textAnchor="middle" fontSize="13" fontWeight="700"
          className={highlightVar === 'I' ? 'fill-blue-600 dark:fill-blue-400' : 'fill-gray-600 dark:fill-gray-300'}
          style={{ cursor: 'pointer' }}
          onClick={() => setHighlightVar(highlightVar === 'I' ? null : 'I')}>
          I
        </text>
        {/* R at bottom-right */}
        <text x={triCx + triSize * 0.35} y={triCy + triSize * 0.35} textAnchor="middle" fontSize="13" fontWeight="700"
          className={highlightVar === 'R' ? 'fill-amber-600 dark:fill-amber-400' : 'fill-gray-600 dark:fill-gray-300'}
          style={{ cursor: 'pointer' }}
          onClick={() => setHighlightVar(highlightVar === 'R' ? null : 'R')}>
          R
        </text>
        {/* Multiplication sign */}
        <text x={triCx} y={triCy + triSize * 0.35} textAnchor="middle" fontSize="10"
          className="fill-gray-400 dark:fill-gray-500">
          &times;
        </text>
        {/* Triangle label */}
        <text x={triCx} y={triCy + triSize * 0.6 + 14} textAnchor="middle" fontSize="9"
          className="fill-gray-400 dark:fill-gray-500">
          tap to highlight
        </text>
      </svg>

      {/* Voltage slider (below SVG, in HTML for accessibility) */}
      <div className="flex items-center gap-3 mt-3 px-2">
        <label htmlFor="voltage-slider" className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
          Voltage:
        </label>
        <input
          id="voltage-slider"
          type="range"
          min={1}
          max={12}
          step={0.5}
          value={voltage}
          onChange={e => setVoltage(parseFloat(e.target.value))}
          className="flex-1 accent-red-500"
        />
        <span className="text-sm font-bold text-red-600 dark:text-red-400 w-10 text-right">
          {voltage}V
        </span>
      </div>
    </div>
  );
}
