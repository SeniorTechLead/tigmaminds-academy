'use client';

import { useState, useCallback } from 'react';

const TOKENS = ['The', 'elephant', 'crossed', 'the', 'river', 'because', 'it', 'was', 'deep'];

/* Pre-computed attention weights [row][col] — row = "who is looking", col = "looking at what"
   Designed to show pronoun resolution: "it" attends strongly to "river" and "elephant" */
const ATTENTION: number[][] = [
  // The  elephant crossed the  river because it   was  deep
  [0.10, 0.25, 0.10, 0.15, 0.15, 0.08, 0.07, 0.05, 0.05], // The
  [0.08, 0.20, 0.15, 0.05, 0.18, 0.10, 0.08, 0.06, 0.10], // elephant
  [0.05, 0.45, 0.08, 0.02, 0.35, 0.02, 0.01, 0.01, 0.01], // crossed
  [0.12, 0.10, 0.05, 0.10, 0.30, 0.08, 0.10, 0.05, 0.10], // the
  [0.08, 0.15, 0.20, 0.12, 0.15, 0.10, 0.05, 0.05, 0.10], // river
  [0.05, 0.12, 0.18, 0.05, 0.15, 0.10, 0.15, 0.10, 0.10], // because
  [0.03, 0.28, 0.04, 0.02, 0.42, 0.03, 0.03, 0.00, 0.15], // it ← key row
  [0.02, 0.05, 0.05, 0.02, 0.10, 0.08, 0.18, 0.10, 0.40], // was
  [0.02, 0.08, 0.03, 0.02, 0.55, 0.02, 0.08, 0.20, 0.00], // deep
];

const HEADS = [
  { name: 'Head 1: Syntax', color: '#60a5fa', links: [[0, 1], [2, 1], [2, 4], [3, 4], [7, 8]] },
  { name: 'Head 2: Semantics', color: '#a78bfa', links: [[1, 4], [4, 8], [6, 4], [6, 8]] },
  { name: 'Head 3: Position', color: '#34d399', links: [[0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [6, 7], [7, 8]] },
  { name: 'Head 4: Coreference', color: '#f472b6', links: [[6, 1], [6, 4], [8, 4], [8, 6]] },
];

type View = 'heatmap' | 'qkv' | 'multihead';

const QKV_STEPS = ['input', 'project', 'dotproduct', 'softmax', 'output'] as const;
type QKVStep = typeof QKV_STEPS[number];

function weightToColor(w: number, selected: boolean): string {
  if (!selected) {
    const a = Math.round(w * 180 + 40);
    return `rgba(96,165,250,${a / 255})`;
  }
  const a = Math.round(w * 220 + 35);
  return `rgba(251,146,60,${a / 255})`;
}

export default function TransformerAttentionDiagram() {
  const [view, setView] = useState<View>('heatmap');
  const [selectedRow, setSelectedRow] = useState<number>(6); // "it" selected by default
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);
  const [qkvStep, setQkvStep] = useState<QKVStep>('input');

  const stepIndex = QKV_STEPS.indexOf(qkvStep);

  const advanceStep = useCallback(() => {
    setQkvStep(prev => {
      const i = QKV_STEPS.indexOf(prev);
      return QKV_STEPS[Math.min(i + 1, QKV_STEPS.length - 1)];
    });
  }, []);

  const resetSteps = useCallback(() => setQkvStep('input'), []);

  /* ── View 1: Attention Heatmap ── */
  const renderHeatmap = () => {
    const n = TOKENS.length;
    const gridX = 100;
    const gridY = 55;
    const cellW = 36;
    const cellH = 26;

    return (
      <svg viewBox="0 0 460 360" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto"
        role="img" aria-label="Attention heatmap showing which tokens attend to which other tokens">
        <rect width="460" height="360" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="230" y="22" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Attention Heatmap — Click a row to see what that token attends to
        </text>

        {/* Column headers */}
        {TOKENS.map((t, ci) => (
          <text key={`ch-${ci}`} x={gridX + ci * cellW + cellW / 2} y={gridY - 5}
            textAnchor="middle" fontFamily="monospace" fontSize="8"
            className={ci === hoveredCell?.[1] ? 'fill-orange-500' : 'fill-slate-500 dark:fill-slate-400'}>
            {t}
          </text>
        ))}

        {/* Rows */}
        {TOKENS.map((rowToken, ri) => (
          <g key={`row-${ri}`} className="cursor-pointer" onClick={() => setSelectedRow(ri)}>
            {/* Row label */}
            <text x={gridX - 6} y={gridY + ri * cellH + cellH / 2 + 3}
              textAnchor="end" fontFamily="monospace" fontSize="8"
              className={ri === selectedRow ? 'fill-orange-500 font-bold' : 'fill-slate-500 dark:fill-slate-400'}>
              {rowToken}
            </text>

            {/* Selection indicator */}
            {ri === selectedRow && (
              <rect x={gridX - 2} y={gridY + ri * cellH - 1} width={n * cellW + 4} height={cellH + 2}
                rx="3" fill="none" stroke="#f97316" strokeWidth="1.5" />
            )}

            {/* Cells */}
            {TOKENS.map((_, ci) => {
              const w = ATTENTION[ri][ci];
              const isSelected = ri === selectedRow;
              const isHovered = hoveredCell?.[0] === ri && hoveredCell?.[1] === ci;
              return (
                <g key={`cell-${ri}-${ci}`}
                  onMouseEnter={() => setHoveredCell([ri, ci])}
                  onMouseLeave={() => setHoveredCell(null)}>
                  <rect
                    x={gridX + ci * cellW} y={gridY + ri * cellH}
                    width={cellW - 1} height={cellH - 1} rx="2"
                    fill={weightToColor(w, isSelected)}
                    stroke={isHovered ? '#f97316' : 'none'} strokeWidth={isHovered ? 1.5 : 0}
                  />
                  <text x={gridX + ci * cellW + cellW / 2 - 0.5} y={gridY + ri * cellH + cellH / 2 + 3}
                    textAnchor="middle" fontFamily="monospace" fontSize="7"
                    className="fill-slate-700 dark:fill-slate-200" style={{ pointerEvents: 'none' }}>
                    {w.toFixed(2)}
                  </text>
                </g>
              );
            })}
          </g>
        ))}

        {/* Hover tooltip */}
        {hoveredCell && (
          <g>
            <rect x="60" y="310" width="340" height="22" rx="4"
              className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="0.5" />
            <text x="230" y="325" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9"
              className="fill-slate-700 dark:fill-slate-200">
              {`'${TOKENS[hoveredCell[0]]}' attends to '${TOKENS[hoveredCell[1]]}' with weight ${ATTENTION[hoveredCell[0]][hoveredCell[1]].toFixed(2)}`}
            </text>
          </g>
        )}

        {/* Legend: selected row insight */}
        {selectedRow !== null && !hoveredCell && (
          <g>
            <rect x="60" y="310" width="340" height="22" rx="4"
              className="fill-orange-50 dark:fill-orange-900/30 stroke-orange-300 dark:stroke-orange-700" strokeWidth="0.5" />
            <text x="230" y="325" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9"
              className="fill-orange-700 dark:fill-orange-300">
              {selectedRow === 6
                ? 'The model resolves "it" \u2192 mostly "river" (0.42) and "elephant" (0.28)'
                : selectedRow === 8
                ? '"deep" attends strongly to "river" (0.55) \u2014 describing the river'
                : selectedRow === 2
                ? '"crossed" focuses on "elephant" (0.45) and "river" (0.35) \u2014 subject and object'
                : `Showing attention pattern for "${TOKENS[selectedRow]}"`}
            </text>
          </g>
        )}

        {/* Color legend */}
        <text x="60" y="348" fontFamily="system-ui, sans-serif" fontSize="7"
          className="fill-slate-400 dark:fill-slate-500">
          Lighter = weak attention  ·  Darker = strong attention  ·  Orange = selected row
        </text>
      </svg>
    );
  };

  /* ── View 2: Q, K, V Pipeline ── */
  const renderQKV = () => {
    const active = (step: QKVStep) => stepIndex >= QKV_STEPS.indexOf(step);
    const bright = (step: QKVStep) => stepIndex === QKV_STEPS.indexOf(step);

    const scores = [0.42, 0.28, 0.15, 0.04, 0.03, 0.03, 0.02, 0.02, 0.01];
    const rawScores = [3.8, 2.5, 1.2, 0.3, 0.1, 0.1, -0.2, -0.3, -0.5];
    const tokenLabels = ['river', 'elephant', 'deep', 'crossed', 'because', 'the', 'The', 'was', 'the'];

    return (
      <svg viewBox="0 0 460 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto"
        role="img" aria-label="Query Key Value pipeline diagram for transformer attention">
        <rect width="460" height="320" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="230" y="20" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Q, K, V Pipeline — Processing token &quot;it&quot;
        </text>

        {/* Step 1: Input token */}
        <rect x="20" y="45" width="60" height="30" rx="6"
          fill={bright('input') ? '#fbbf24' : active('input') ? '#60a5fa' : '#94a3b8'}
          opacity={active('input') ? 1 : 0.3} />
        <text x="50" y="64" textAnchor="middle" fontFamily="monospace" fontSize="10"
          fontWeight="600" className="fill-white">&quot;it&quot;</text>
        <text x="50" y="88" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="7"
          className="fill-slate-500 dark:fill-slate-400">Input embedding</text>

        {/* Arrows to Q, K, V */}
        {active('project') && (
          <>
            <line x1="80" y1="55" x2="130" y2="42" stroke={bright('project') ? '#fbbf24' : '#60a5fa'} strokeWidth="1.5" markerEnd="url(#arrow)" />
            <line x1="80" y1="60" x2="130" y2="60" stroke={bright('project') ? '#fbbf24' : '#a78bfa'} strokeWidth="1.5" markerEnd="url(#arrow)" />
            <line x1="80" y1="65" x2="130" y2="78" stroke={bright('project') ? '#fbbf24' : '#34d399'} strokeWidth="1.5" markerEnd="url(#arrow)" />
          </>
        )}

        {/* Q, K, V boxes */}
        {[
          { label: 'Q', sub: 'Query', desc: '"What am I looking for?"', y: 42, color: '#60a5fa' },
          { label: 'K', sub: 'Key', desc: '"What do I contain?"', y: 60, color: '#a78bfa' },
          { label: 'V', sub: 'Value', desc: '"What info do I carry?"', y: 78, color: '#34d399' },
        ].map(({ label, sub, desc, y, color }) => (
          <g key={label}>
            <rect x="132" y={y - 8} width="40" height="18" rx="4"
              fill={active('project') ? color : '#64748b'} opacity={active('project') ? 1 : 0.25} />
            <text x="152" y={y + 4} textAnchor="middle" fontFamily="monospace" fontSize="10"
              fontWeight="700" className="fill-white">{label}</text>
            <text x="180" y={y + 4} fontFamily="system-ui, sans-serif" fontSize="6.5"
              className="fill-slate-500 dark:fill-slate-400">{sub}: {desc}</text>
          </g>
        ))}

        {/* Dot product section */}
        {active('dotproduct') && (
          <g>
            <text x="230" y="115" textAnchor="middle" fontFamily="system-ui, sans-serif"
              fontSize="9" fontWeight="600" className={bright('dotproduct') ? 'fill-yellow-500' : 'fill-slate-600 dark:fill-slate-300'}>
              Q · K scores (dot product with each token&apos;s key)
            </text>
            {tokenLabels.slice(0, 5).map((tok, i) => (
              <g key={`score-${i}`}>
                <text x={60 + i * 85} y="133" textAnchor="middle" fontFamily="monospace" fontSize="7"
                  className="fill-slate-500 dark:fill-slate-400">{tok}</text>
                <rect x={40 + i * 85} y="137" width="40" height="16" rx="3"
                  fill={bright('dotproduct') ? '#fbbf24' : '#818cf8'} opacity={0.8} />
                <text x={60 + i * 85} y="148" textAnchor="middle" fontFamily="monospace" fontSize="8"
                  className="fill-white" fontWeight="600">{rawScores[i].toFixed(1)}</text>
              </g>
            ))}
          </g>
        )}

        {/* Softmax section */}
        {active('softmax') && (
          <g>
            <text x="230" y="175" textAnchor="middle" fontFamily="system-ui, sans-serif"
              fontSize="9" fontWeight="600" className={bright('softmax') ? 'fill-yellow-500' : 'fill-slate-600 dark:fill-slate-300'}>
              Softmax → Normalized weights (sum to 1.0)
            </text>
            {tokenLabels.slice(0, 5).map((tok, i) => {
              const barH = scores[i] * 80;
              return (
                <g key={`bar-${i}`}>
                  <rect x={50 + i * 85} y={240 - barH} width="24" height={barH} rx="2"
                    fill={i === 0 ? '#f97316' : i === 1 ? '#fb923c' : '#94a3b8'} />
                  <text x={62 + i * 85} y={237 - barH} textAnchor="middle" fontFamily="monospace" fontSize="7"
                    className="fill-slate-600 dark:fill-slate-300">{scores[i].toFixed(2)}</text>
                  <text x={62 + i * 85} y="253" textAnchor="middle" fontFamily="monospace" fontSize="7"
                    className="fill-slate-500 dark:fill-slate-400">{tok}</text>
                </g>
              );
            })}
          </g>
        )}

        {/* Output */}
        {active('output') && (
          <g>
            <line x1="230" y1="258" x2="230" y2="275" stroke={bright('output') ? '#fbbf24' : '#34d399'} strokeWidth="1.5" markerEnd="url(#arrow)" />
            <rect x="160" y="277" width="140" height="24" rx="6"
              fill={bright('output') ? '#fbbf24' : '#34d399'} />
            <text x="230" y="293" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9"
              fontWeight="600" className="fill-white">
              Weighted sum of V vectors
            </text>
          </g>
        )}

        {/* Arrow marker */}
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500 dark:fill-slate-400" />
          </marker>
        </defs>
      </svg>
    );
  };

  /* ── View 3: Multi-Head Attention ── */
  const renderMultiHead = () => {
    const tokenX = (i: number) => 30 + i * 44;
    const tokenY = 50;
    const mergeY = 265;

    return (
      <svg viewBox="0 0 460 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto"
        role="img" aria-label="Multi-head attention diagram with four parallel attention heads">
        <rect width="460" height="320" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="230" y="20" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Multi-Head Attention — 4 Heads in Parallel
        </text>

        {/* Token row at top */}
        {TOKENS.map((t, i) => (
          <g key={`tok-${i}`}>
            <rect x={tokenX(i) - 18} y={tokenY - 10} width="36" height="18" rx="4"
              className="fill-slate-200 dark:fill-slate-700" />
            <text x={tokenX(i)} y={tokenY + 2} textAnchor="middle" fontFamily="monospace" fontSize="7"
              className="fill-slate-700 dark:fill-slate-200">{t}</text>
          </g>
        ))}

        {/* 4 attention heads */}
        {HEADS.map((head, hi) => {
          const bandY = 80 + hi * 44;
          return (
            <g key={`head-${hi}`}>
              {/* Head label */}
              <rect x="2" y={bandY} width="78" height="18" rx="4" fill={head.color} opacity={0.15} />
              <text x="41" y={bandY + 12} textAnchor="middle" fontFamily="system-ui, sans-serif"
                fontSize="6.5" fontWeight="600" fill={head.color}>{head.name}</text>

              {/* Connections */}
              {head.links.map(([from, to], li) => {
                const x1 = tokenX(from);
                const x2 = tokenX(to);
                return (
                  <line key={`link-${hi}-${li}`}
                    x1={x1} y1={bandY + 5} x2={x2} y2={bandY + 14}
                    stroke={head.color} strokeWidth="1.5" opacity={0.7}
                    strokeLinecap="round" />
                );
              })}

              {/* Token dots in this head's band */}
              {TOKENS.map((_, ti) => (
                <circle key={`dot-${hi}-${ti}`} cx={tokenX(ti)} cy={bandY + 9} r="3"
                  fill={head.links.some(([a, b]) => a === ti || b === ti) ? head.color : '#94a3b8'}
                  opacity={head.links.some(([a, b]) => a === ti || b === ti) ? 1 : 0.25} />
              ))}
            </g>
          );
        })}

        {/* Merge arrows */}
        {HEADS.map((head, hi) => (
          <line key={`merge-${hi}`}
            x1={120 + hi * 70} y1={80 + hi * 44 + 22} x2="230" y2={mergeY}
            stroke={head.color} strokeWidth="1" opacity={0.5} strokeDasharray="3,2" />
        ))}

        {/* Concat + Linear box */}
        <rect x="155" y={mergeY} width="150" height="22" rx="6"
          className="fill-slate-700 dark:fill-slate-600" />
        <text x="230" y={mergeY + 14} textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" fontWeight="600" className="fill-white">
          Concatenate + Linear Layer
        </text>

        {/* Output */}
        <line x1="230" y1={mergeY + 22} x2="230" y2={mergeY + 35} className="stroke-slate-400" strokeWidth="1.5" markerEnd="url(#arrowMH)" />
        <rect x="180" y={mergeY + 36} width="100" height="18" rx="5"
          className="fill-emerald-500 dark:fill-emerald-600" />
        <text x="230" y={mergeY + 48} textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="8" fontWeight="600" className="fill-white">Output</text>

        <defs>
          <marker id="arrowMH" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-400" />
          </marker>
        </defs>
      </svg>
    );
  };

  const descriptions: Record<View, string> = {
    heatmap: 'Each cell shows how much one token "pays attention" to another. When "it" is selected, notice the strong connection to "river" (0.42) — the model has learned that "it" refers to the river, not the elephant, because "deep" describes a river.',
    qkv: 'Each token is projected into three vectors: Query (what am I looking for?), Key (what do I contain?), and Value (what information do I carry?). The dot product of Q and K produces attention scores, softmax normalizes them, and the weighted sum of V vectors produces the output.',
    multihead: 'Each head learns to focus on different relationships. Head 1 tracks syntax (subject-verb-object), Head 2 tracks meaning (semantic similarity), Head 3 tracks nearby positions, and Head 4 tracks coreference ("it" \u2192 "elephant"/"river"). Their outputs are concatenated and combined.',
  };

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      {/* Tab buttons */}
      <div className="flex gap-1 mb-2">
        {([
          ['heatmap', 'Attention Heatmap'],
          ['qkv', 'Q, K, V Pipeline'],
          ['multihead', 'Multi-Head Attention'],
        ] as [View, string][]).map(([v, label]) => (
          <button key={v} onClick={() => setView(v)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              view === v
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* QKV step controls */}
      {view === 'qkv' && (
        <div className="flex items-center gap-2 mb-2">
          <button onClick={advanceStep}
            disabled={qkvStep === 'output'}
            className="px-3 py-1 rounded text-xs font-medium bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Step through →
          </button>
          <button onClick={resetSteps}
            className="px-3 py-1 rounded text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
            Reset
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
            Step {stepIndex + 1}/{QKV_STEPS.length}: {['Input Embedding', 'Project to Q/K/V', 'Dot Product Scores', 'Softmax Normalize', 'Weighted Output'][stepIndex]}
          </span>
        </div>
      )}

      {/* SVG diagram */}
      {view === 'heatmap' && renderHeatmap()}
      {view === 'qkv' && renderQKV()}
      {view === 'multihead' && renderMultiHead()}

      {/* Description */}
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        {descriptions[view]}
      </p>
    </div>
  );
}
