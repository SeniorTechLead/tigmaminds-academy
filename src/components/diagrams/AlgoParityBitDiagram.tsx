/**
 * Parity-bit error detection: data bits + a parity bit make the total number of
 * 1s even. A flipped bit in transit breaks parity, so the receiver detects it.
 *
 * Used in the "Error Detection and Correction" section.
 */
export default function AlgoParityBitDiagram() {
  const W = 720, H = 280;
  const data = [1, 0, 1, 1, 0, 0, 1]; // four 1s -> even -> parity 0
  const parity = 0;
  const cellW = 56, ox = 60, sentY = 90, recvY = 190;
  const recv = [1, 0, 1, 1, 1, 0, 1]; // bit 4 flipped 0->1 -> five 1s + parity 0 = odd -> error
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A parity bit makes the total number of ones even when sent. If noise flips a bit in transit, the received total becomes odd, so the receiver detects an error.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">A parity bit catches a single flipped bit</text>

        {/* sent row */}
        <text x={ox} y={sentY - 12} fontSize="11" fontWeight="700" fill="#16a34a" className="dark:fill-green-300">Sent (even # of 1s)</text>
        {data.map((b, i) => (
          <g key={'s' + i}>
            <rect x={ox + i * cellW} y={sentY} width={cellW - 8} height="40" rx="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" className="dark:fill-gray-800 dark:stroke-gray-500" />
            <text x={ox + i * cellW + (cellW - 8) / 2} y={sentY + 26} textAnchor="middle" fontSize="14" fontWeight="600" fill="#0f172a" className="dark:fill-gray-100">{b}</text>
          </g>
        ))}
        <rect x={ox + 7 * cellW} y={sentY} width={cellW - 8} height="40" rx="6" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" className="dark:fill-green-900/40 dark:stroke-green-400" />
        <text x={ox + 7 * cellW + (cellW - 8) / 2} y={sentY + 26} textAnchor="middle" fontSize="14" fontWeight="700" fill="#15803d" className="dark:fill-green-300">{parity}</text>
        <text x={ox + 7 * cellW + (cellW - 8) / 2} y={sentY - 12} textAnchor="middle" fontSize="9" fontWeight="700" fill="#15803d" className="dark:fill-green-300">parity</text>

        {/* received row with flipped bit */}
        <text x={ox} y={recvY - 12} fontSize="11" fontWeight="700" fill="#b91c1c" className="dark:fill-red-300">Received (now odd → error!)</text>
        {recv.map((b, i) => {
          const flipped = b !== data[i];
          return (
            <g key={'r' + i}>
              <rect x={ox + i * cellW} y={recvY} width={cellW - 8} height="40" rx="6"
                fill={flipped ? '#fee2e2' : '#ffffff'} stroke={flipped ? '#dc2626' : '#94a3b8'} strokeWidth={flipped ? 2 : 1.2}
                className={flipped ? 'dark:fill-red-900/40 dark:stroke-red-400' : 'dark:fill-gray-800 dark:stroke-gray-500'} />
              <text x={ox + i * cellW + (cellW - 8) / 2} y={recvY + 26} textAnchor="middle" fontSize="14" fontWeight={flipped ? 800 : 600} fill={flipped ? '#b91c1c' : '#0f172a'} className={flipped ? 'dark:fill-red-300' : 'dark:fill-gray-100'}>{b}</text>
              {flipped && <text x={ox + i * cellW + (cellW - 8) / 2} y={recvY + 58} textAnchor="middle" fontSize="9" fontWeight="700" fill="#b91c1c" className="dark:fill-red-300">flipped</text>}
            </g>
          );
        })}
        <rect x={ox + 7 * cellW} y={recvY} width={cellW - 8} height="40" rx="6" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" className="dark:fill-green-900/40 dark:stroke-green-400" />
        <text x={ox + 7 * cellW + (cellW - 8) / 2} y={recvY + 26} textAnchor="middle" fontSize="14" fontWeight="700" fill="#15803d" className="dark:fill-green-300">{parity}</text>
      </svg>
    </div>
  );
}
