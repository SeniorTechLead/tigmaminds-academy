import { useState, useCallback } from 'react';
import type { PracticeSet, PracticeProblem, ProblemVisualType } from '../../data/reference';
import PythonPlayground from '../PythonPlayground';

// ─── Inline markdown renderer (bold + code) ────────────────

function renderMd(text: string) {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g;
  let last = 0, key = 0, m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2]) parts.push(<strong key={key++} className="font-semibold text-gray-900 dark:text-white">{m[2]}</strong>);
    else if (m[3]) parts.push(<code key={key++} className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-sm font-mono text-rose-600 dark:text-rose-400">{m[3]}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function renderContent(text: string) {
  return text.split('\n\n').map((p, i) => {
    if (p.trim().startsWith('|') && p.includes('---')) {
      const lines = p.trim().split('\n').filter(l => l.trim());
      const parseRow = (line: string) => line.split('|').map(c => c.trim()).filter(c => c.length > 0);
      const headers = parseRow(lines[0]);
      const rows = lines.slice(2).map(parseRow);
      return (
        <div key={i} className="overflow-x-auto mb-2">
          <table className="w-full text-xs border-collapse rounded overflow-hidden">
            <thead><tr className="bg-gray-100 dark:bg-gray-700">{headers.map((h, j) => <th key={j} className="px-2 py-1 text-left font-semibold">{renderMd(h)}</th>)}</tr></thead>
            <tbody>{rows.map((row, ri) => <tr key={ri} className={ri % 2 === 0 ? '' : 'bg-gray-50 dark:bg-gray-800/50'}>{row.map((cell, ci) => <td key={ci} className="px-2 py-1">{renderMd(cell)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    }
    if (p.trim().startsWith('- ') || p.trim().startsWith('• ')) {
      return <ul key={i} className="text-xs mb-2 space-y-0.5 ml-1">{p.split('\n').filter(l => l.trim()).map((item, j) => <li key={j} className="flex items-start gap-1.5"><span className="text-amber-500 mt-0.5">•</span><span>{renderMd(item.replace(/^[•\-]\s*/, ''))}</span></li>)}</ul>;
    }
    return <p key={i} className="text-xs leading-relaxed mb-2 last:mb-0">{renderMd(p)}</p>;
  });
}

// ─── Visual Props ──────────────────────────────────────────

function DiceVisual({ count, values }: { count: number; values?: number[] }) {
  const faces = values ?? Array.from({ length: count }, () => Math.ceil(Math.random() * 6));
  const dots: Record<number, number[][]> = {
    1: [[1,1]], 2: [[0,0],[2,2]], 3: [[0,0],[1,1],[2,2]],
    4: [[0,0],[0,2],[2,0],[2,2]], 5: [[0,0],[0,2],[1,1],[2,0],[2,2]],
    6: [[0,0],[0,1],[0,2],[2,0],[2,1],[2,2]],
  };
  return (
    <div className="flex gap-2 flex-wrap">
      {faces.map((v, i) => (
        <div key={i} className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg border-2 border-gray-300 dark:border-gray-500 grid grid-cols-3 grid-rows-3 p-1 shadow-sm">
          {[0,1,2].map(r => [0,1,2].map(c => {
            const hasDot = (dots[v] ?? []).some(([dr, dc]) => dr === r && dc === c);
            return <div key={`${r}${c}`} className={`w-1.5 h-1.5 rounded-full m-auto ${hasDot ? 'bg-gray-800 dark:bg-gray-200' : ''}`} />;
          }))}
        </div>
      ))}
    </div>
  );
}

function CoinVisual({ count, heads }: { count: number; heads?: number }) {
  const h = heads ?? Math.floor(count / 2);
  return (
    <div className="flex gap-1.5 flex-wrap">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow-sm ${i < h ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-gray-100 border-gray-400 text-gray-600 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-300'}`}>
          {i < h ? 'H' : 'T'}
        </div>
      ))}
    </div>
  );
}

function CardVisual({ drawn }: { drawn: string[] }) {
  const suitColor = (card: string) => card.includes('♥') || card.includes('♦') ? 'text-red-600' : 'text-gray-900 dark:text-white';
  return (
    <div className="flex gap-1.5 flex-wrap">
      {drawn.map((card, i) => (
        <div key={i} className="w-10 h-14 bg-white dark:bg-gray-100 rounded border border-gray-300 shadow-sm flex items-center justify-center">
          <span className={`text-sm font-bold ${suitColor(card)}`}>{card}</span>
        </div>
      ))}
    </div>
  );
}

function BarChartVisual({ labels, values, highlight }: { labels: string[]; values: number[]; highlight?: number }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1 h-24">
      {values.map((v, i) => (
        <div key={i} className="flex flex-col items-center flex-1 min-w-0">
          <div className={`w-full rounded-t transition-all duration-700 ${i === highlight ? 'bg-amber-500' : 'bg-blue-400 dark:bg-blue-500'}`} style={{ height: `${(v / max) * 80}%`, minHeight: v > 0 ? 4 : 0 }} />
          <span className="text-[10px] text-gray-500 mt-0.5 truncate w-full text-center">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function WaitingVisual({ avgMinutes, markTime }: { avgMinutes: number; markTime?: number }) {
  const maxT = avgMinutes * 3;
  const mark = markTime ?? avgMinutes;
  const pct = (mark / maxT) * 100;
  return (
    <div className="relative h-8 bg-gradient-to-r from-emerald-200 via-amber-200 to-red-200 dark:from-emerald-900 dark:via-amber-900 dark:to-red-900 rounded-full overflow-hidden">
      <div className="absolute top-0 h-full w-0.5 bg-gray-800 dark:bg-white" style={{ left: `${pct}%` }} />
      <div className="absolute -top-5 text-[10px] font-semibold text-gray-700 dark:text-gray-300" style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}>{mark} min</div>
      <div className="absolute bottom-0 left-1 text-[10px] text-gray-600 dark:text-gray-400">0</div>
      <div className="absolute bottom-0 right-1 text-[10px] text-gray-600 dark:text-gray-400">{maxT} min</div>
    </div>
  );
}

function ProblemVisual({ visual }: { visual: ProblemVisualType }) {
  switch (visual.kind) {
    case 'dice': return <DiceVisual count={visual.count} values={visual.values} />;
    case 'coins': return <CoinVisual count={visual.count} heads={visual.heads} />;
    case 'cards': return <CardVisual drawn={visual.drawn} />;
    case 'bar-chart': return <BarChartVisual labels={visual.labels} values={visual.values} highlight={visual.highlight} />;
    case 'waiting': return <WaitingVisual avgMinutes={visual.avgMinutes} markTime={visual.markTime} />;
    case 'scatter': return (
      <svg viewBox="0 0 200 150" className="w-full max-w-xs h-auto">
        {visual.points.map(([x, y], i) => <circle key={i} cx={20 + x * 1.6} cy={140 - y * 1.2} r="3" className="fill-blue-500" />)}
        {visual.showLine && <line x1="20" y1="130" x2="180" y2="20" className="stroke-red-500 stroke-1" strokeDasharray="4" />}
      </svg>
    );
    case 'distribution': return null; // TODO: SVG distribution curves
    default: return null;
  }
}

// ─── Difficulty badge ──────────────────────────────────────

function DiffBadge({ d }: { d: 1 | 2 | 3 }) {
  const cls = d === 1 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    : d === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
  const label = d === 1 ? 'Easy' : d === 2 ? 'Medium' : 'Hard';
  return <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${cls}`}>{label}</span>;
}

// ─── Main Component ────────────────────────────────────────

interface Props {
  practice: PracticeSet;
}

export default function PracticeProblems({ practice }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState(0);
  const [hintShown, setHintShown] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showCodeSolution, setShowCodeSolution] = useState(false);

  const problems = practice.problems;
  const problem = problems[idx];
  const totalSteps = problem?.steps.length ?? 0;
  const allRevealed = revealedSteps >= totalSteps;

  const goTo = useCallback((newIdx: number) => {
    setIdx(newIdx);
    setRevealedSteps(0);
    setHintShown(false);
    setShowCode(false);
    setShowCodeSolution(false);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-semibold hover:from-violet-600 hover:to-indigo-600 transition-all shadow-sm flex items-center justify-center gap-2"
      >
        <span>Practice Problems</span>
        <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded">{problems.length}</span>
      </button>
    );
  }

  return (
    <div className="mt-3 border border-violet-200 dark:border-violet-800 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{practice.title}</span>
          <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">{idx + 1} / {problems.length}</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-lg leading-none">&times;</button>
      </div>

      {/* Problem navigator */}
      <div className="flex gap-1 px-4 py-2 overflow-x-auto bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        {problems.map((p, i) => (
          <button
            key={p.id}
            onClick={() => goTo(i)}
            className={`flex-shrink-0 w-7 h-7 rounded text-xs font-semibold transition-all ${
              i === idx
                ? 'bg-violet-500 text-white shadow'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Problem content */}
      <div className="p-4">
        {/* Difficulty + question */}
        <div className="flex items-start gap-2 mb-3">
          <DiffBadge d={problem.difficulty} />
          <div className="flex-1 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
            {renderContent(problem.question)}
          </div>
        </div>

        {/* Visual */}
        {problem.visual && (
          <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <ProblemVisual visual={problem.visual} />
          </div>
        )}

        {/* Hint */}
        {problem.hint && !hintShown && revealedSteps === 0 && (
          <button
            onClick={() => setHintShown(true)}
            className="mb-3 text-xs text-violet-600 dark:text-violet-400 hover:underline"
          >
            Show hint
          </button>
        )}
        {hintShown && (
          <div className="mb-3 p-2.5 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-xs text-violet-700 dark:text-violet-300">
            {renderContent(problem.hint!)}
          </div>
        )}

        {/* Solution steps — revealed one at a time */}
        {revealedSteps > 0 && (
          <div className="mb-3 space-y-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Solution</div>
            {problem.steps.slice(0, revealedSteps).map((step, i) => (
              <div key={i} className="pl-3 border-l-2 border-emerald-400 dark:border-emerald-600">
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-0.5">{step.label}</div>
                <div className="text-xs text-gray-700 dark:text-gray-300">{renderContent(step.content)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Final answer */}
        {allRevealed && (
          <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            Answer: {problem.answer}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          {!allRevealed && (
            <button
              onClick={() => setRevealedSteps(s => s + 1)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
            >
              {revealedSteps === 0 ? 'Show Solution' : `Next Step (${revealedSteps}/${totalSteps})`}
            </button>
          )}

          {/* Code practice toggle */}
          {problem.code && (
            <button
              onClick={() => { setShowCode(!showCode); setShowCodeSolution(false); }}
              className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {showCode ? 'Hide Code' : 'Try in Python'}
            </button>
          )}

          {/* Navigation */}
          <div className="flex gap-1 ml-auto">
            <button
              onClick={() => goTo(Math.max(0, idx - 1))}
              disabled={idx === 0}
              className="px-2.5 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold disabled:opacity-30 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => goTo(Math.min(problems.length - 1, idx + 1))}
              disabled={idx === problems.length - 1}
              className="px-2.5 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold disabled:opacity-30 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        {/* Code section */}
        {showCode && problem.code && (
          <div className="mt-3">
            <PythonPlayground starterCode={problem.code} title="Solve it in Python" />
            {problem.codeSolution && !showCodeSolution && (
              <button
                onClick={() => setShowCodeSolution(true)}
                className="mt-2 text-xs text-violet-600 dark:text-violet-400 hover:underline"
              >
                Show Python solution
              </button>
            )}
            {showCodeSolution && problem.codeSolution && (
              <div className="mt-2 rounded-lg bg-gray-900 p-3 overflow-x-auto">
                <div className="text-[10px] text-gray-400 mb-1 uppercase tracking-wide">Solution</div>
                <pre className="text-xs font-mono text-gray-100 whitespace-pre">{problem.codeSolution}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
