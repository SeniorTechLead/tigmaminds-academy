import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, RotateCcw, Loader2, CheckCircle, XCircle, Terminal, Lock,
  ChevronDown, Filter, Search, BookOpen, Zap, Sparkles,
  ArrowRight, Sun, Moon,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SignUpGate from '../components/SignUpGate';
import SectionRenderer from '../components/reference/SectionRenderer';
import { usePrefs } from '../contexts/PrefsContext';
import { useAuth } from '../contexts/AuthContext';
import { usePyodide } from '../contexts/PyodideContext';
import { problems, type Problem, type ProblemTier, type Difficulty, type Topic } from '../data/playground-problems';
import { lookupSection } from '../utils/referenceLookup';

const FREE_PROBLEM_COUNT = 5;

/* ── Test result type ── */
interface TestResult {
  label: string;
  passed: boolean;
  expected: string;
  actual: string;
}

/* ── Tier badge colors ── */
const tierColors = {
  1: 'from-emerald-400 to-green-500',
  2: 'from-blue-400 to-indigo-500',
  3: 'from-orange-400 to-red-500',
};

const tierIcons = {
  1: Zap,
  2: Sparkles,
  3: Terminal,
};

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

/* ══════════════════════════════════════════
   HintPanel — expandable Library content inline
   ══════════════════════════════════════════ */
function HintPanel({ tier }: { tier: ProblemTier }) {
  const [expanded, setExpanded] = useState(false);

  const sectionData = tier.hintRef?.section ? lookupSection(tier.hintRef.section) : null;

  return (
    <div className="mb-4">
      <div className={`border rounded-lg overflow-hidden transition-colors ${expanded ? 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10' : 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/15'}`}>
        {/* Hint bar — always visible */}
        <div className="px-4 py-3 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm flex-1">
            <span className="text-gray-700 dark:text-gray-300">{tier.hint}</span>
            {tier.hintRef && sectionData && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-2 inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-medium"
              >
                {expanded ? 'Hide' : tier.hintRef.label}
                <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
            )}
            {tier.hintRef && !sectionData && (
              <Link
                to={`/reference/${tier.hintRef.slug}${tier.hintRef.section ? '#' + tier.hintRef.section : ''}`}
                className="ml-2 inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-medium"
              >
                {tier.hintRef.label} <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Expanded Library content */}
        {expanded && sectionData && (
          <div className="border-t border-amber-200 dark:border-amber-800 px-4 py-4 bg-white dark:bg-gray-800/50">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                From the Library: {sectionData.guideTitle}
              </p>
            </div>
            <SectionRenderer section={sectionData.section} level={1} />
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <Link
                to={`/reference/${tier.hintRef!.slug}${tier.hintRef!.section ? '#' + tier.hintRef!.section : ''}`}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium inline-flex items-center gap-1"
              >
                Open full article in Library <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Problem Solver — the code editor + test runner
   ══════════════════════════════════════════ */
function ProblemSolver({ problem, tier, onBack }: { problem: Problem; tier: ProblemTier; onBack: () => void }) {
  const { editorTheme, setEditorTheme } = usePrefs();
  const isDark = editorTheme === 'dark';
  const [code, setCode] = useState(tier.starterCode);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [output, setOutput] = useState('');
  const { pyodideRef, load: loadPyodide, state: ctxState, loadProgress } = usePyodide();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const pyState = running ? 'running' as const : ctxState === 'idle' ? 'idle' as const : ctxState === 'loading' ? 'loading' as const : 'ready' as const;

  const runTests = useCallback(async () => {
    const pyodide = pyodideRef.current || (await loadPyodide());
    if (!pyodide) return;

    setRunning(true);
    setResults([]);
    setOutput('');

    try {
      // Clear and define user function
      await pyodide.runPythonAsync('_out.clear()');
      await pyodide.runPythonAsync(code);

      const testResults: TestResult[] = [];
      // Extract function name from the code
      const fnMatch = code.match(/def\s+(\w+)\s*\(/);
      const fnName = fnMatch ? fnMatch[1] : '';

      for (const tc of tier.testCases) {
        try {
          await pyodide.runPythonAsync('_out.clear()');
          // Handle generator tier: wrap in list()
          const isGenerator = tier.starterCode.includes('yield');
          const callExpr = isGenerator
            ? `list(${fnName}(${tc.input}))`
            : `${fnName}(${tc.input})`;

          const actual = await pyodide.runPythonAsync(`repr(${callExpr})`);
          const expected = await pyodide.runPythonAsync(`repr(${tc.expected})`);
          testResults.push({
            label: tc.label,
            passed: actual === expected,
            expected: tc.expected,
            actual: String(actual),
          });
        } catch (err: any) {
          testResults.push({
            label: tc.label,
            passed: false,
            expected: tc.expected,
            actual: `Error: ${err.message?.split('\n').pop() || err.message}`,
          });
        }
      }

      // Capture any print output
      const stdout = await pyodide.runPythonAsync('_out.get()');
      if (stdout) setOutput(stdout);

      setResults(testResults);
      setRunning(false);
    } catch (err: any) {
      setOutput(err.message || String(err));
      setRunning(false);
    }
  }, [code, tier, loadPyodide]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const s = ta.selectionStart;
      const end = ta.selectionEnd;
      setCode(code.substring(0, s) + '    ' + code.substring(end));
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 4; }, 0);
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runTests();
    }
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; }
  }, [code]);

  const allPassed = results.length > 0 && results.every(r => r.passed);
  const passCount = results.filter(r => r.passed).length;

  const TierIcon = tierIcons[tier.tier];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button onClick={onBack} className="text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium">
          &larr; All Problems
        </button>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{problem.title}</h2>
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${difficultyColors[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
      </div>

      {/* Problem description */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 mb-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{problem.description}</p>
        <Link to={`/lessons/${problem.storySlug}`} className="inline-flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium">
          <BookOpen className="w-3.5 h-3.5" /> From: {problem.story}
        </Link>
      </div>

      {/* Tier info */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tierColors[tier.tier]} flex items-center justify-center`}>
          <TierIcon className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">Tier {tier.tier}: {tier.tierName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{tier.goal}</p>
        </div>
      </div>
      {/* Hint with expandable Library content */}
      <HintPanel tier={tier} />

      {/* Editor */}
      <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} rounded-xl overflow-hidden border mb-4`}>
        <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <Terminal className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Solution</span>
            {pyState === 'ready' && (
              <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">Ready</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setCode(tier.starterCode); setResults([]); setOutput(''); }} className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors" title="Reset">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setEditorTheme(isDark ? 'light' : 'dark')} className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors" title="Toggle theme">
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <button onClick={runTests} disabled={pyState === 'loading' || pyState === 'running'} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
              {pyState === 'loading' || pyState === 'running' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              {pyState === 'loading' ? 'Loading...' : pyState === 'running' ? 'Testing...' : 'Run Tests'}
            </button>
          </div>
        </div>

        {pyState === 'loading' && loadProgress && (
          <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 text-sm text-amber-400 flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> {loadProgress}
          </div>
        )}

        <div className="flex">
          {/* Line numbers */}
          <div className={`flex-shrink-0 pt-2 pb-4 pr-2 text-right select-none border-r ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`} style={{ width: '3rem' }}>
            {code.split('\n').map((_, i) => (
              <div key={i} className={`leading-6 text-xs font-mono ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{i + 1}</div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className={`flex-1 bg-transparent font-mono text-sm pl-3 pr-4 pt-2 pb-4 resize-none focus:outline-none min-h-[180px] leading-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
            style={{ tabSize: 4 }}
          />
        </div>
      </div>

      {/* Test Results */}
      {results.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
          <div className={`px-4 py-3 border-b ${allPassed ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700'}`}>
            <div className="flex items-center gap-2">
              {allPassed ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              <span className={`text-sm font-bold ${allPassed ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}`}>
                {allPassed ? 'All tests passed!' : `${passCount}/${results.length} tests passed`}
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {results.map((r, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3">
                {r.passed ? <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />}
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${r.passed ? 'text-gray-700 dark:text-gray-300' : 'text-red-700 dark:text-red-300'}`}>{r.label}</p>
                  {!r.passed && (
                    <div className="mt-1 text-xs font-mono">
                      <p className="text-gray-500 dark:text-gray-400">Expected: <span className="text-emerald-600 dark:text-emerald-400">{r.expected}</span></p>
                      <p className="text-gray-500 dark:text-gray-400">Got: <span className="text-red-600 dark:text-red-400">{r.actual}</span></p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stdout output */}
      {output && (
        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden mb-4">
          <div className="px-4 py-2 border-b border-gray-700 text-xs font-semibold text-gray-500 uppercase tracking-wide">Console Output</div>
          <pre className="p-4 text-sm text-gray-300 font-mono whitespace-pre-wrap overflow-x-auto max-h-[200px] overflow-y-auto">{output}</pre>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   Main Playground Page
   ══════════════════════════════════════════ */
export default function PlaygroundPage() {
  const { user } = useAuth();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [selectedTier, setSelectedTier] = useState<ProblemTier | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'all'>('all');
  const [filterTopic, setFilterTopic] = useState<Topic | 'all'>('all');

  const isFree = (p: Problem) => p.id <= FREE_PROBLEM_COUNT;
  const canAccess = (p: Problem) => !!user || isFree(p);

  const filtered = problems.filter(p => {
    if (filterDifficulty !== 'all' && p.difficulty !== filterDifficulty) return false;
    if (filterTopic !== 'all' && p.topic !== filterTopic) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.story.toLowerCase().includes(q) || p.topic.includes(q);
    }
    return true;
  });

  const topics: Topic[] = ['strings', 'lists', 'math', 'sorting', 'dictionaries', 'loops', 'functions', 'data', 'tuples-sets', 'classes', 'recursion', 'error-handling'];

  // If a problem + tier is selected, show the solver
  if (selectedProblem && selectedTier) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Header />
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
          <ProblemSolver
            problem={selectedProblem}
            tier={selectedTier}
            onBack={() => { setSelectedProblem(null); setSelectedTier(null); }}
          />
        </section>
        <Footer />
      </div>
    );
  }

  // If a problem is selected but no tier, show tier picker
  if (selectedProblem) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Header />
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setSelectedProblem(null)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium mb-6 block">
              &larr; All Problems
            </button>

            <div className="mb-8">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${difficultyColors[selectedProblem.difficulty]} mb-3`}>
                {selectedProblem.difficulty}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedProblem.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{selectedProblem.description}</p>
              <Link to={`/lessons/${selectedProblem.storySlug}`} className="inline-flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium">
                <BookOpen className="w-3.5 h-3.5" /> From: {selectedProblem.story}
              </Link>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Choose your tier</h3>
            <div className="space-y-4">
              {selectedProblem.tiers.map((t) => {
                const TIcon = tierIcons[t.tier];
                return (
                  <button
                    key={t.tier}
                    onClick={() => setSelectedTier(t)}
                    className="w-full text-left bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-600 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tierColors[t.tier]} flex items-center justify-center flex-shrink-0`}>
                        <TIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          Tier {t.tier}: {t.tierName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.goal}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-amber-500 transition-colors flex-shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // Problem list
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Playground
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {problems.length} problems inspired by real stories. Solve them, clean them up, then optimize. Same problem, three levels of mastery.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-20 z-40">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems or stories..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm"
            >
              <option value="all">All levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm"
            >
              <option value="all">All topics</option>
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <span className="text-sm text-gray-400 dark:text-gray-500">{filtered.length} problems</span>
        </div>
      </section>

      {/* Problem Grid */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => {
              const locked = !canAccess(p);
              return (
                <button
                  key={p.id}
                  onClick={() => { if (!locked) setSelectedProblem(p); }}
                  className={`text-left rounded-xl p-5 border transition-all group relative ${
                    locked
                      ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-70 cursor-default'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md'
                  }`}
                >
                  {locked && (
                    <div className="absolute top-3 right-3">
                      <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${difficultyColors[p.difficulty]}`}>
                      {p.difficulty}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      {p.topic}
                    </span>
                  </div>
                  <h3 className={`text-base font-bold mb-2 ${locked ? 'text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400'} transition-colors`}>
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{p.description}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {p.story}
                  </p>
                  <div className="flex gap-1.5 mt-3">
                    {p.tiers.map(t => (
                      <div key={t.tier} className={`w-2 h-2 rounded-full ${locked ? 'bg-gray-300 dark:bg-gray-600' : `bg-gradient-to-br ${tierColors[t.tier]}`}`} title={t.tierName} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sign-up gate after free problems */}
          {!user && filtered.some(p => !isFree(p)) && (
            <div className="mt-8">
              <SignUpGate message={`Sign up free to unlock all ${problems.length} problems`} />
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400 dark:text-gray-500">
              <Terminal className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No problems match your filters</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
