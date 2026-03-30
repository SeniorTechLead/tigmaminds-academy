export default function StdDevDiagram() {
  // Dataset A: heights of same-age children (tight cluster)
  const dataA = [147, 148, 149, 150, 151, 152, 153];
  // Dataset B: ages at a family reunion (wide scatter)
  const dataB = [5, 15, 25, 35, 45, 65, 80];

  const mean = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;
  const stdDev = (arr: number[]) => {
    const m = mean(arr);
    return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
  };

  const meanA = mean(dataA);
  const sdA = stdDev(dataA);
  const meanB = mean(dataB);
  const sdB = stdDev(dataB);

  // Layout constants
  const panelWidth = 240;
  const gap = 40;
  const totalWidth = panelWidth * 2 + gap;
  const numberLineY = 160;
  const dotRadius = 6;

  // Map a value to x within a panel
  const mapX = (val: number, min: number, max: number, offsetX: number) => {
    const padding = 20;
    const usable = panelWidth - padding * 2;
    return offsetX + padding + ((val - min) / (max - min)) * usable;
  };

  const minA = 144;
  const maxA = 156;
  const minB = 0;
  const maxB = 85;

  const panelAx = 0;
  const panelBx = panelWidth + gap;

  // Tick values for number lines
  const ticksA = [144, 146, 148, 150, 152, 154, 156];
  const ticksB = [0, 20, 40, 60, 80];

  const renderPanel = (
    data: number[],
    m: number,
    sd: number,
    min: number,
    max: number,
    offsetX: number,
    ticks: number[],
    title: string,
    dotColor: string,
    bandColor: string,
    meanLineColor: string,
    labelColor: string,
  ) => {
    const bandLeft = mapX(m - sd, min, max, offsetX);
    const bandRight = mapX(m + sd, min, max, offsetX);
    const meanX = mapX(m, min, max, offsetX);
    const lineLeft = offsetX + 10;
    const lineRight = offsetX + panelWidth - 10;

    return (
      <g>
        {/* Title */}
        <text
          x={offsetX + panelWidth / 2}
          y={30}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          className="fill-gray-800 dark:fill-gray-200"
        >
          {title}
        </text>

        {/* Band: +/- 1 std dev */}
        <rect
          x={bandLeft}
          y={numberLineY - 40}
          width={bandRight - bandLeft}
          height={80}
          fill={bandColor}
          opacity={0.3}
          rx={4}
        />

        {/* Number line */}
        <line
          x1={lineLeft}
          y1={numberLineY}
          x2={lineRight}
          y2={numberLineY}
          stroke="#94a3b8"
          strokeWidth={1.5}
        />

        {/* Ticks */}
        {ticks.map((t) => {
          const tx = mapX(t, min, max, offsetX);
          return (
            <g key={t}>
              <line x1={tx} y1={numberLineY - 4} x2={tx} y2={numberLineY + 4} stroke="#94a3b8" strokeWidth={1} />
              <text
                x={tx}
                y={numberLineY + 16}
                textAnchor="middle"
                fontSize="9"
                className="fill-gray-500 dark:fill-gray-400"
              >
                {t}
              </text>
            </g>
          );
        })}

        {/* Mean line (dashed) */}
        <line
          x1={meanX}
          y1={numberLineY - 45}
          x2={meanX}
          y2={numberLineY + 25}
          stroke={meanLineColor}
          strokeWidth={2}
          strokeDasharray="5,3"
        />

        {/* Data points */}
        {data.map((v, i) => {
          const cx = mapX(v, min, max, offsetX);
          return (
            <circle
              key={i}
              cx={cx}
              cy={numberLineY}
              r={dotRadius}
              fill={dotColor}
              stroke="#fff"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Labels */}
        <text
          x={offsetX + panelWidth / 2}
          y={numberLineY + 40}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill={labelColor}
        >
          mean = {Math.round(m * 10) / 10}
        </text>
        <text
          x={offsetX + panelWidth / 2}
          y={numberLineY + 56}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill={labelColor}
        >
          {'σ'} = {Math.round(sd * 10) / 10}
        </text>

        {/* Band edge labels */}
        <text
          x={bandLeft}
          y={numberLineY - 46}
          textAnchor="middle"
          fontSize="9"
          className="fill-gray-500 dark:fill-gray-400"
        >
          {Math.round((m - sd) * 10) / 10}
        </text>
        <text
          x={bandRight}
          y={numberLineY - 46}
          textAnchor="middle"
          fontSize="9"
          className="fill-gray-500 dark:fill-gray-400"
        >
          {Math.round((m + sd) * 10) / 10}
        </text>

        {/* Bracket arrows for band */}
        <line x1={bandLeft} y1={numberLineY - 42} x2={bandLeft} y2={numberLineY - 38} stroke="#94a3b8" strokeWidth={1} />
        <line x1={bandRight} y1={numberLineY - 42} x2={bandRight} y2={numberLineY - 38} stroke="#94a3b8" strokeWidth={1} />
        <line x1={bandLeft} y1={numberLineY - 40} x2={bandRight} y2={numberLineY - 40} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2,2" />
        <text
          x={(bandLeft + bandRight) / 2}
          y={numberLineY - 52}
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          className="fill-gray-500 dark:fill-gray-400"
        >
          {'±'}1{'σ'} band
        </text>
      </g>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <svg
        viewBox={`0 0 ${totalWidth} 280`}
        className="w-full"
        role="img"
        aria-label="Standard deviation comparison: low spread vs high spread"
      >
        {/* Background panels */}
        <rect x={panelAx} y={5} width={panelWidth} height={260} fill="#f8fafc" rx={8} className="dark:fill-gray-800/40" />
        <rect x={panelBx} y={5} width={panelWidth} height={260} fill="#f8fafc" rx={8} className="dark:fill-gray-800/40" />

        {renderPanel(
          dataA, meanA, sdA, minA, maxA, panelAx, ticksA,
          'Low Spread',
          '#3b82f6', '#dbeafe', '#1e40af', '#2563eb',
        )}
        {renderPanel(
          dataB, meanB, sdB, minB, maxB, panelBx, ticksB,
          'High Spread',
          '#f97316', '#ffedd5', '#9a3412', '#ea580c',
        )}

        {/* Bottom annotation */}
        <text
          x={totalWidth / 2}
          y={270}
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-400 dark:fill-gray-500"
        >
          Tight cluster = low {'σ'} &nbsp;&nbsp;|&nbsp;&nbsp; Wide scatter = high {'σ'}
        </text>
      </svg>
    </div>
  );
}
