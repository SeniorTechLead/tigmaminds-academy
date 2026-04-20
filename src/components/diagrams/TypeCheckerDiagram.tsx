import { useState } from 'react';

// ── Red Squiggles Before Runtime ──────────────────────────────
// Toggle between JavaScript and TypeScript versions of the same
// buggy code. In JS: no warning, breaks at runtime. In TS: the
// compiler catches it instantly with a red squiggle and message.

interface Scenario {
  name: string;
  jsCode: string;
  tsCode: string;
  runtimeBreak: string;
  compileError: { line: number; msg: string };
  lesson: string;
}

const SCENARIOS: Scenario[] = [
  {
    name: 'Wrong type assigned',
    jsCode: `let age = 25;\nage = "twenty-five";\nconsole.log(age + 1);`,
    tsCode: `let age: number = 25;\nage = "twenty-five";\nconsole.log(age + 1);`,
    runtimeBreak: '"twenty-five1"  // 😱 string concat',
    compileError: { line: 2, msg: 'Type \'string\' is not assignable to type \'number\'.' },
    lesson: 'JS lets you change types silently → bizarre bugs. TS stops you at line 2.',
  },
  {
    name: 'Typo in property',
    jsCode: `const el = { name: "Ranga", weight: 4500 };\nconsole.log(el.weigt);`,
    tsCode: `const el = { name: "Ranga", weight: 4500 };\nconsole.log(el.weigt);`,
    runtimeBreak: 'undefined  // silently wrong',
    compileError: { line: 2, msg: "Property 'weigt' does not exist. Did you mean 'weight'?" },
    lesson: 'JS returns undefined for typos. TS spots it AND suggests the fix.',
  },
  {
    name: 'Missing argument',
    jsCode: `function bmi(w, h) { return w / (h * h); }\nconsole.log(bmi(4500));`,
    tsCode: `function bmi(w: number, h: number): number {\n  return w / (h * h);\n}\nconsole.log(bmi(4500));`,
    runtimeBreak: 'NaN  // h was undefined',
    compileError: { line: 4, msg: "Expected 2 arguments, but got 1." },
    lesson: 'JS quietly returns NaN. TS tells you exactly which argument is missing.',
  },
  {
    name: 'Null crash',
    jsCode: `function find() { return null; }\nconst x = find();\nconsole.log(x.length);`,
    tsCode: `function find(): string | null { return null; }\nconst x = find();\nconsole.log(x.length);`,
    runtimeBreak: 'TypeError: Cannot read properties of null 💥',
    compileError: { line: 3, msg: "'x' is possibly 'null'. Use x?.length or check first." },
    lesson: 'JS crashes at runtime. TS forces you to handle null before it bites.',
  },
];

export default function TypeCheckerDiagram() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [mode, setMode] = useState<'js' | 'ts'>('ts');
  const s = SCENARIOS[scenarioIdx];
  const code = mode === 'ts' ? s.tsCode : s.jsCode;
  const lines = code.split('\n');

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-rose-50 dark:from-blue-950 dark:via-slate-950 dark:to-rose-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
          Red Squiggles Before Runtime
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Bug scenario:</span>
          {SCENARIOS.map((sc, i) => (
            <button key={sc.name}
              onClick={() => setScenarioIdx(i)}
              className={`text-[11px] px-2 py-0.5 rounded transition ${
                scenarioIdx === i
                  ? 'bg-blue-500 text-white'
                  : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-3 justify-center">
        <button
          onClick={() => setMode('js')}
          className={`text-xs font-mono font-bold px-3 py-1 rounded transition ${
            mode === 'js'
              ? 'bg-yellow-400 text-yellow-900 ring-2 ring-yellow-600'
              : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
          }`}>
          ⚠ JavaScript (no checks)
        </button>
        <button
          onClick={() => setMode('ts')}
          className={`text-xs font-mono font-bold px-3 py-1 rounded transition ${
            mode === 'ts'
              ? 'bg-blue-500 text-white ring-2 ring-blue-700'
              : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
          }`}>
          🔷 TypeScript (type-checked)
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {/* Code editor view */}
        <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-3 font-mono text-xs overflow-x-auto">
          <div className="text-gray-500 uppercase tracking-wider text-[10px] mb-2">
            {s.name}
          </div>
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const hasError = mode === 'ts' && lineNum === s.compileError.line;
            return (
              <div key={i} className="flex gap-2">
                <span className="text-gray-500 select-none w-4 text-right">{lineNum}</span>
                <div className="flex-1">
                  <code className="text-gray-200 whitespace-pre">{line}</code>
                  {hasError && (
                    <div className="mt-0.5 flex items-start gap-2">
                      <span className="text-red-500 text-lg leading-none">〰️〰️〰️</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Outcome panel */}
        <div className={`rounded-lg p-4 ${
          mode === 'ts'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-700'
            : 'bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-300 dark:border-rose-700'
        }`}>
          {mode === 'js' ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💥</span>
                <span className="text-sm font-bold text-rose-700 dark:text-rose-300">
                  Runs, then breaks at runtime
                </span>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded p-2 font-mono text-xs mb-3 border border-rose-200 dark:border-rose-800">
                <span className="text-rose-700 dark:text-rose-300">Output:</span> <span className="text-slate-700 dark:text-slate-300">{s.runtimeBreak}</span>
              </div>
              <p className="text-xs text-rose-800 dark:text-rose-200">
                JavaScript ran the code without complaint. Now the bug is loose in production.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">✓</span>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  Caught at compile time
                </span>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded p-2 font-mono text-xs mb-3 border border-emerald-200 dark:border-emerald-800">
                <span className="text-red-600 dark:text-red-400 font-bold">Error on line {s.compileError.line}:</span>
                <br/>
                <span className="text-slate-700 dark:text-slate-300">{s.compileError.msg}</span>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-200">
                TypeScript won&apos;t even let you run the code until you fix this. Bug never reaches production.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 text-center text-xs text-gray-700 dark:text-gray-300">
        💡 <strong>{s.lesson}</strong>
      </div>
    </div>
  );
}
