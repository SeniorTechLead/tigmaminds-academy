import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Play, RotateCcw, Loader2, CheckCircle, XCircle, Terminal, Lock,
  ChevronDown, Filter, Search, BookOpen, Zap, Sparkles,
  ArrowRight, Sun, Moon, Maximize2, Minimize2, GripHorizontal,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SignUpGate from '../components/SignUpGate';
import SectionRenderer from '../components/reference/SectionRenderer';
import { usePrefs } from '../contexts/PrefsContext';
import { useAuth } from '../contexts/AuthContext';
import { usePyodide } from '../contexts/PyodideContext';
import { useSqlJs } from '../contexts/SqlJsContext';
import { useTs } from '../contexts/TsContext';
import { problems, type Problem, type ProblemTier, type Difficulty, type Topic, type Language } from '../data/playground-problems';
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
              <Link href={`/library/${tier.hintRef.slug}${tier.hintRef.section ? '#' + tier.hintRef.section : ''}`}
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
              <Link href={`/library/${tier.hintRef!.slug}${tier.hintRef!.section ? '#' + tier.hintRef!.section : ''}`}
                target="_blank"
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
  const [sqlResultDisplay, setSqlResultDisplay] = useState<{ columns: string[]; rows: any[][] } | null>(null);
  const { pyodideRef, load: loadPyodide, state: pyCtxState, loadProgress: pyLoadProgress } = usePyodide();
  const { load: loadSqlJs, runSql, resetDb, state: sqlCtxState, loadProgress: sqlLoadProgress } = useSqlJs();
  const { load: loadTs, runTs, state: tsCtxState, loadProgress: tsLoadProgress } = useTs();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lang = problem.language || 'python';
  const isSql = lang === 'sql';
  const isTs = lang === 'typescript';
  const isHtml = lang === 'html';
  const isArduino = lang === 'arduino';
  const ctxState = (isHtml || isArduino) ? 'ready' as const : isSql ? sqlCtxState : isTs ? tsCtxState : pyCtxState;
  const loadProgress = isSql ? sqlLoadProgress : isTs ? tsLoadProgress : pyLoadProgress;
  const pyState = running ? 'running' as const : ctxState === 'idle' ? 'idle' as const : ctxState === 'loading' ? 'loading' as const : 'ready' as const;
  const [arduinoLeds, setArduinoLeds] = useState<{pin: number; brightness: number}[]>([]);
  const arduinoAbortRef = useRef<AbortController | null>(null);
  const [htmlPreview, setHtmlPreview] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const [splitRatio, setSplitRatio] = useState(0.55);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fullscreen]);

  useEffect(() => {
    if (fullscreen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [fullscreen]);

  const onSplitMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const container = splitContainerRef.current;
    if (!container) return;
    const startY = e.clientY;
    const startRatio = splitRatio;
    const totalH = container.offsetHeight;
    const onMove = (ev: MouseEvent) => setSplitRatio(Math.max(0.2, Math.min(0.8, startRatio + (ev.clientY - startY) / totalH)));
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [splitRatio]);
  const [htmlIframeKey, setHtmlIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const runPythonTests = useCallback(async () => {
    const pyodide = pyodideRef.current || (await loadPyodide());
    if (!pyodide) return;

    setRunning(true);
    setResults([]);
    setOutput('');

    try {
      await pyodide.runPythonAsync('_out.clear()');
      await pyodide.runPythonAsync(code);

      const testResults: TestResult[] = [];
      const fnMatch = code.match(/def\s+(\w+)\s*\(/);
      const fnName = fnMatch ? fnMatch[1] : '';

      for (const tc of tier.testCases) {
        try {
          await pyodide.runPythonAsync('_out.clear()');
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

      const stdout = await pyodide.runPythonAsync('_out.get()');
      if (stdout) setOutput(stdout);

      setResults(testResults);
      setRunning(false);
    } catch (err: any) {
      setOutput(err.message || String(err));
      setRunning(false);
    }
  }, [code, tier, loadPyodide, pyodideRef]);

  const runSqlTests = useCallback(async () => {
    const db = await loadSqlJs();
    if (!db) return;

    setRunning(true);
    setResults([]);
    setOutput('');
    setSqlResultDisplay(null);

    // Reset DB to clean state before each test run
    resetDb();

    const testResults: TestResult[] = [];

    for (const tc of tier.testCases) {
      try {
        // Run setup SQL if provided (tc.input)
        if (tc.input.trim()) {
          const setupResult = runSql(tc.input);
          if (setupResult.error) {
            testResults.push({ label: tc.label, passed: false, expected: tc.expected, actual: `Setup error: ${setupResult.error}` });
            continue;
          }
        }

        // Run student's query
        const { results: queryResults, error, rowsModified } = runSql(code);

        if (error) {
          testResults.push({ label: tc.label, passed: false, expected: tc.expected, actual: `Error: ${error}` });
          continue;
        }

        // Compare results
        const expectedParsed = JSON.parse(tc.expected);

        if (Array.isArray(expectedParsed)) {
          // Expected is rows: compare row data
          const actualRows = queryResults.length > 0 ? queryResults[queryResults.length - 1].rows : [];
          const actualStr = JSON.stringify(actualRows);
          const expectedStr = JSON.stringify(expectedParsed);
          testResults.push({
            label: tc.label,
            passed: actualStr === expectedStr,
            expected: tc.expected,
            actual: actualStr,
          });
        } else if (typeof expectedParsed === 'number') {
          // Expected is a count (rowsModified)
          testResults.push({
            label: tc.label,
            passed: rowsModified === expectedParsed,
            expected: String(expectedParsed),
            actual: String(rowsModified),
          });
        } else {
          testResults.push({ label: tc.label, passed: false, expected: tc.expected, actual: 'Unknown expected format' });
        }

        // Reset DB between tests so they're independent
        resetDb();
      } catch (err: any) {
        testResults.push({ label: tc.label, passed: false, expected: tc.expected, actual: `Error: ${err.message}` });
        resetDb();
      }
    }

    // Run the query one more time to capture results for display
    resetDb();
    try {
      const displayResult = runSql(code);
      if (!displayResult.error && displayResult.results.length > 0) {
        const last = displayResult.results[displayResult.results.length - 1];
        setSqlResultDisplay({ columns: last.columns, rows: last.rows });
      }
    } catch { /* ignore display errors */ }

    setResults(testResults);
    setRunning(false);
  }, [code, tier, loadSqlJs, runSql, resetDb]);

  const runTsTests = useCallback(async () => {
    const ts = await loadTs();
    if (!ts) return;

    setRunning(true);
    setResults([]);
    setOutput('');

    const testResults: TestResult[] = [];

    for (const tc of tier.testCases) {
      try {
        // Build full code: student code + test expression
        const fullCode = tc.input
          ? code + '\n' + tc.input  // tc.input = extra test code to append
          : code;

        const result = runTs(fullCode);

        if (result.error) {
          testResults.push({
            label: tc.label,
            passed: false,
            expected: tc.expected,
            actual: result.error,
          });
          continue;
        }

        // Compare output
        const actual = result.output.trim();
        const expected = tc.expected;

        if (expected === 'true') {
          // Flexible check — just verify no error
          testResults.push({ label: tc.label, passed: true, expected: 'runs without error', actual });
        } else {
          testResults.push({
            label: tc.label,
            passed: actual === expected,
            expected,
            actual,
          });
        }
      } catch (err: any) {
        testResults.push({ label: tc.label, passed: false, expected: tc.expected, actual: `Error: ${err.message}` });
      }
    }

    // Capture final output for display
    const finalResult = runTs(code);
    if (finalResult.output) setOutput(finalResult.output);

    setResults(testResults);
    setRunning(false);
  }, [code, tier, loadTs, runTs]);

  const runHtmlTests = useCallback(async () => {
    setRunning(true);
    setResults([]);
    setOutput('');
    setHtmlPreview(code);
    setHtmlIframeKey(k => k + 1);

    // Wait for iframe to render
    await new Promise(r => setTimeout(r, 500));

    const testResults: TestResult[] = [];

    for (const tc of tier.testCases) {
      try {
        const assertions = JSON.parse(tc.expected) as { selector: string; text?: string; count?: number; style?: Record<string, string>; exists?: boolean; attr?: Record<string, string> }[];
        let allPass = true;
        const failures: string[] = [];

        // Create a temporary iframe to test
        const tempIframe = document.createElement('iframe');
        tempIframe.style.position = 'absolute';
        tempIframe.style.left = '-9999px';
        tempIframe.sandbox.add('allow-scripts', 'allow-same-origin');
        document.body.appendChild(tempIframe);
        tempIframe.srcdoc = code;
        await new Promise(r => setTimeout(r, 300));

        const doc = tempIframe.contentDocument;
        if (!doc) { failures.push('Could not access iframe'); allPass = false; }
        else {
          for (const a of assertions) {
            const els = doc.querySelectorAll(a.selector);
            if (a.exists === false) {
              if (els.length > 0) { failures.push(`"${a.selector}" should not exist`); allPass = false; }
              continue;
            }
            if (els.length === 0) { failures.push(`"${a.selector}" not found`); allPass = false; continue; }
            if (a.count !== undefined && els.length !== a.count) {
              failures.push(`Expected ${a.count} "${a.selector}", found ${els.length}`);
              allPass = false;
            }
            if (a.text !== undefined) {
              const actualText = els[0].textContent?.trim() || '';
              if (!actualText.includes(a.text)) {
                failures.push(`"${a.selector}" text: expected "${a.text}", got "${actualText.substring(0, 50)}"`);
                allPass = false;
              }
            }
            if (a.style) {
              const computed = tempIframe.contentWindow?.getComputedStyle(els[0]);
              if (computed) {
                for (const [prop, val] of Object.entries(a.style)) {
                  const actual = computed.getPropertyValue(prop);
                  if (!actual.includes(val)) {
                    failures.push(`"${a.selector}" style ${prop}: expected "${val}", got "${actual}"`);
                    allPass = false;
                  }
                }
              }
            }
            if (a.attr) {
              for (const [name, val] of Object.entries(a.attr)) {
                const actual = els[0].getAttribute(name);
                if (actual !== val) {
                  failures.push(`"${a.selector}" attr ${name}: expected "${val}", got "${actual}"`);
                  allPass = false;
                }
              }
            }
          }
        }
        tempIframe.remove();

        testResults.push({
          label: tc.label,
          passed: allPass,
          expected: tc.label,
          actual: allPass ? 'All checks passed' : failures.join('; '),
        });
      } catch (err: any) {
        testResults.push({ label: tc.label, passed: false, expected: tc.expected, actual: `Error: ${err.message}` });
      }
    }

    setResults(testResults);
    setRunning(false);
  }, [code, tier]);

  const runArduinoTests = useCallback(async () => {
    setRunning(true);
    setResults([]);
    setOutput('');
    arduinoAbortRef.current?.abort();
    const ac = new AbortController();
    arduinoAbortRef.current = ac;

    // Parse code for setup/loop, extract serial output and pin states
    const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//') && !l.startsWith('#'));
    const serialLines: string[] = [];
    const pinStates: Record<number, number> = {};
    const ledStates: {pin: number; brightness: number}[] = [];

    // Simple parse: find pinMode, digitalWrite, analogWrite, Serial.println
    for (const line of lines) {
      const dw = line.match(/digitalWrite\((\d+),\s*(HIGH|LOW|1|0)\)/);
      if (dw) pinStates[parseInt(dw[1])] = (dw[2] === 'HIGH' || dw[2] === '1') ? 255 : 0;
      const aw = line.match(/analogWrite\((\d+),\s*(\d+)\)/);
      if (aw) pinStates[parseInt(aw[1])] = parseInt(aw[2]);
      const sp = line.match(/Serial\.println?\("([^"]+)"\)/);
      if (sp) serialLines.push(sp[1]);
      const pm = line.match(/pinMode\((\d+),\s*(OUTPUT|INPUT)\)/);
      if (pm) { if (!pinStates[parseInt(pm[1])]) pinStates[parseInt(pm[1])] = 0; }
    }

    // Update LED display
    const maxPin = Math.max(13, ...Object.keys(pinStates).map(Number));
    for (let p = 2; p <= Math.min(maxPin, 13); p++) {
      ledStates.push({ pin: p, brightness: pinStates[p] || 0 });
    }
    setArduinoLeds(ledStates);
    setOutput(serialLines.join('\n'));

    const testResults: TestResult[] = [];
    for (const tc of tier.testCases) {
      try {
        if (tc.expected === 'OK') {
          // Basic check: code has setup() and loop()
          const hasSetup = code.includes('void setup()');
          const hasLoop = code.includes('void loop()');
          testResults.push({
            label: tc.label,
            passed: hasSetup && hasLoop,
            expected: 'setup() and loop() defined',
            actual: hasSetup && hasLoop ? 'Both found' : `Missing: ${!hasSetup ? 'setup()' : ''} ${!hasLoop ? 'loop()' : ''}`.trim(),
          });
        } else {
          // Expected is a JSON check: [{"serial":"text"}, {"pin":13,"state":"HIGH"}]
          const checks = JSON.parse(tc.expected) as { serial?: string; pin?: number; state?: string; analogMin?: number; analogMax?: number }[];
          let allPass = true;
          const failures: string[] = [];
          for (const check of checks) {
            if (check.serial !== undefined) {
              if (!serialLines.some(l => l.includes(check.serial!))) {
                failures.push(`Serial output missing: "${check.serial}"`);
                allPass = false;
              }
            }
            if (check.pin !== undefined && check.state !== undefined) {
              const val = pinStates[check.pin];
              const expected = check.state === 'HIGH' ? 255 : 0;
              if (val !== expected) {
                failures.push(`Pin ${check.pin}: expected ${check.state}, got ${val === 255 ? 'HIGH' : val === 0 ? 'LOW' : val}`);
                allPass = false;
              }
            }
            if (check.pin !== undefined && check.analogMin !== undefined) {
              const val = pinStates[check.pin] || 0;
              if (val < check.analogMin || val > (check.analogMax || 255)) {
                failures.push(`Pin ${check.pin}: analog ${val} not in range ${check.analogMin}-${check.analogMax || 255}`);
                allPass = false;
              }
            }
          }
          testResults.push({
            label: tc.label,
            passed: allPass,
            expected: tc.label,
            actual: allPass ? 'All checks passed' : failures.join('; '),
          });
        }
      } catch (err: any) {
        testResults.push({ label: tc.label, passed: false, expected: tc.expected, actual: `Error: ${err.message}` });
      }
    }
    setResults(testResults);
    setRunning(false);
  }, [code, tier]);

  const runTests = isArduino ? runArduinoTests : isHtml ? runHtmlTests : isTs ? runTsTests : isSql ? runSqlTests : runPythonTests;

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
        <Link href={`/lessons/${problem.storySlug}`} className="inline-flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium">
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

      {/* Editor + Output: fullscreen-capable split pane */}
      <div className={fullscreen ? `fixed inset-0 z-50 flex flex-col ${isDark ? 'bg-gray-900' : 'bg-white'}` : 'mb-4'}>
        {/* Toolbar */}
        <div className={`px-4 py-2 border-b flex items-center justify-between flex-shrink-0 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} ${!fullscreen ? 'rounded-t-xl border border-b' : ''}`}>
          <div className="flex items-center gap-2">
            <Terminal className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Solution</span>
            {pyState === 'ready' && <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">Ready</span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setCode(tier.starterCode); setResults([]); setOutput(''); }} className="flex items-center gap-1 px-2 py-1.5 text-gray-400 hover:text-white text-xs transition-colors" title="Reset">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button onClick={() => setEditorTheme(isDark ? 'light' : 'dark')} className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors" title="Toggle theme">
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <button onClick={runTests} disabled={pyState === 'loading' || pyState === 'running'} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
              {pyState === 'loading' || pyState === 'running' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              {pyState === 'loading' ? 'Loading...' : pyState === 'running' ? 'Testing...' : 'Run Tests'}
            </button>
            <button onClick={() => setFullscreen(!fullscreen)} className="flex items-center gap-1 px-2 py-1.5 text-gray-400 hover:text-white text-xs transition-colors" title={fullscreen ? 'Exit fullscreen (Esc)' : 'Expand to fullscreen'}>
              {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              {fullscreen ? 'Exit' : 'Expand'}
            </button>
          </div>
        </div>

        {pyState === 'loading' && loadProgress && (
          <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 text-sm text-amber-400 flex items-center gap-2 flex-shrink-0">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> {loadProgress}
          </div>
        )}

        {/* Split: code on top, output on bottom */}
        <div ref={splitContainerRef} className={`flex flex-col ${fullscreen ? 'flex-1 min-h-0' : ''} ${!fullscreen ? `${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} rounded-b-xl overflow-hidden border border-t-0` : ''}`}
          style={fullscreen ? {} : { height: 420 }}>
          {/* Code editor */}
          <div className="overflow-y-auto" style={{ flex: `0 0 ${splitRatio * 100}%` }}>
            <div className="flex min-h-full">
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
                className={`flex-1 bg-transparent font-mono text-sm pl-3 pr-4 pt-2 pb-4 resize-none focus:outline-none leading-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
                style={{ tabSize: 4 }}
              />
            </div>
          </div>

          {/* Draggable divider */}
          <div onMouseDown={onSplitMouseDown} className="flex-shrink-0 h-2 bg-gray-700 hover:bg-emerald-600 cursor-row-resize flex items-center justify-center transition-colors group" title="Drag to resize">
            <GripHorizontal className="w-4 h-3 text-gray-500 group-hover:text-white" />
          </div>

          {/* Output area */}
          <div className="overflow-y-auto bg-gray-950 flex-1 min-h-0">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-800/80 border-b border-gray-700 sticky top-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Output</span>
              {running && <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />}
            </div>

      {/* Test Results */}
      {results.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-700 overflow-hidden">
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
                    <div className="mt-2 text-xs font-mono space-y-1">
                      <p className="text-gray-500 dark:text-gray-400">Expected: <span className="text-emerald-600 dark:text-emerald-400 break-all">{r.expected}</span></p>
                      <p className="text-gray-500 dark:text-gray-400">Got: <span className="text-red-600 dark:text-red-400 break-all">{r.actual}</span></p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SQL query results table */}
      {sqlResultDisplay && sqlResultDisplay.rows.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-700 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Query Result — {sqlResultDisplay.rows.length} row{sqlResultDisplay.rows.length !== 1 ? 's' : ''}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                  {sqlResultDisplay.columns.map((col, ci) => (
                    <th key={ci} className={`px-3 py-2 text-left font-semibold font-mono text-xs ${isDark ? 'text-cyan-300 border-gray-600' : 'text-cyan-700 border-gray-200'} border-b`}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sqlResultDisplay.rows.slice(0, 50).map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? (isDark ? 'bg-gray-800' : 'bg-white') : (isDark ? 'bg-gray-800/50' : 'bg-gray-50')}>
                    {row.map((cell, ci) => (
                      <td key={ci} className={`px-3 py-1.5 font-mono text-xs ${isDark ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-100'} border-b`}>
                        {cell === null ? <span className="text-gray-400 italic">NULL</span> : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* HTML live preview */}
      {isHtml && htmlPreview && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-700 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Live Preview</div>
          <iframe
            key={htmlIframeKey}
            ref={iframeRef}
            srcDoc={htmlPreview}
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
            className="w-full border-0"
            style={{ height: 300 }}
          />
        </div>
      )}

      {/* Arduino LED simulator */}
      {isArduino && arduinoLeds.length > 0 && (
        <div className="bg-gray-900 border-t border-gray-700 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-700 text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> LED Simulator
          </div>
          <div className="flex items-center justify-center gap-4 p-6">
            {arduinoLeds.map((led) => (
              <div key={led.pin} className="flex flex-col items-center gap-1">
                <div
                  className="w-6 h-6 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: led.brightness > 0 ? `rgba(251, 191, 36, ${led.brightness / 255})` : '#374151',
                    boxShadow: led.brightness > 0 ? `0 0 ${led.brightness / 10}px rgba(251, 191, 36, ${led.brightness / 255})` : 'none',
                  }}
                />
                <span className="text-[10px] text-gray-500 font-mono">D{led.pin}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stdout output (Python/TS) */}
      {output && (
        <div className="border-t border-gray-700">
          <pre className="p-4 text-sm text-emerald-300 font-mono whitespace-pre-wrap overflow-x-auto">{output}</pre>
        </div>
      )}

      {/* Empty state */}
      {!output && results.length === 0 && !sqlResultDisplay && !(isHtml && htmlPreview) && !(isArduino && arduinoLeds.length > 0) && (
        <p className="px-4 py-3 text-xs text-gray-600 italic">Click &quot;Run Tests&quot; to execute your code.</p>
      )}
          </div>{/* end output scroll area */}
        </div>{/* end split container */}
      </div>{/* end fullscreen wrapper */}
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
  const [filterLanguage, setFilterLanguage] = useState<Language | 'all'>('all');

  const isFree = (p: Problem) => p.id <= FREE_PROBLEM_COUNT;
  const canAccess = (p: Problem) => !!user || isFree(p);

  const filtered = problems.filter(p => {
    if (filterDifficulty !== 'all' && p.difficulty !== filterDifficulty) return false;
    if (filterTopic !== 'all' && p.topic !== filterTopic) return false;
    if (filterLanguage !== 'all' && (p.language || 'python') !== filterLanguage) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.story.toLowerCase().includes(q) || p.topic.includes(q);
    }
    return true;
  });

  const pythonTopics: Topic[] = ['strings', 'lists', 'math', 'sorting', 'dictionaries', 'loops', 'functions', 'data', 'tuples-sets', 'classes', 'recursion', 'error-handling'];
  const sqlTopics: Topic[] = ['sql-select', 'sql-joins', 'sql-aggregate', 'sql-modify', 'sql-subqueries'];
  const tsTopics: Topic[] = ['ts-variables', 'ts-functions', 'ts-interfaces', 'ts-unions', 'ts-arrays', 'ts-generics', 'ts-enums', 'ts-classes'];
  const htmlTopics: Topic[] = ['html-structure', 'css-styling', 'css-layout', 'html-forms', 'js-dom', 'js-events', 'html-animation', 'html-responsive'];
  const arduinoTopics: Topic[] = ['arduino-digital', 'arduino-analog', 'arduino-serial', 'arduino-timing', 'arduino-sensors', 'arduino-projects'];
  const topics = filterLanguage === 'sql' ? sqlTopics : filterLanguage === 'typescript' ? tsTopics : filterLanguage === 'html' ? htmlTopics : filterLanguage === 'arduino' ? arduinoTopics : filterLanguage === 'python' ? pythonTopics : [...pythonTopics, ...sqlTopics, ...tsTopics, ...htmlTopics, ...arduinoTopics];

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
              <Link href={`/lessons/${selectedProblem.storySlug}`} className="inline-flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium">
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
            {problems.length}+ problems and growing — inspired by real stories. Solve them, clean them up, then optimize. Same problem, three levels of mastery.
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
              value={filterLanguage}
              onChange={(e) => { setFilterLanguage(e.target.value as any); setFilterTopic('all'); }}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm"
            >
              <option value="all">All languages</option>
              <option value="python">Python</option>
              <option value="sql">SQL</option>
              <option value="typescript">TypeScript</option>
              <option value="html">HTML/CSS/JS</option>
              <option value="arduino">Arduino</option>
            </select>
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
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${difficultyColors[p.difficulty]}`}>
                        {p.difficulty}
                      </span>
                      {p.language === 'sql' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
                          SQL
                        </span>
                      )}
                      {p.language === 'typescript' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          TS
                        </span>
                      )}
                      {p.language === 'html' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                          HTML
                        </span>
                      )}
                      {p.language === 'arduino' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                          Arduino
                        </span>
                      )}
                    </div>
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
              <SignUpGate message={`Sign up free to unlock all ${problems.length}+ problems`} />
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
