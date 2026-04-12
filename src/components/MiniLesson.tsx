import { useState, useRef, useCallback, useContext, useEffect } from 'react';
import { Play, Loader2, CheckCircle, RotateCcw, HelpCircle, ChevronDown, ChevronUp, Sparkles, GripHorizontal, Maximize2, Minimize2, Moon, Sun, Copy, Check } from 'lucide-react';
import DiagramZoom from './DiagramZoom';
import { usePyodide } from '../contexts/PyodideContext';
import { usePrefs } from '../contexts/PrefsContext';

interface MiniLessonProps {
  /** HTML id for scroll targeting */
  id?: string;
  /** Lesson number for display */
  number: number;
  /** Short title */
  title: string;

  // --- Concept section (before code) ---
  /** The concept explained in plain language. Supports **bold** and `code` markdown. */
  concept: string;
  /** An analogy that connects the concept to something familiar */
  analogy?: string;
  /** How this concept connects back to the elephant story */
  storyConnection?: string;
  /** A question to check understanding before they code */
  checkQuestion?: string;
  /** The answer (revealed on click) */
  checkAnswer?: string;

  /** React element to render as a visual diagram between concept and code */
  diagram?: React.ReactNode;

  // --- Code section ---
  /** Code the student starts with */
  code: string;
  /** What the code does, in one sentence (shown above editor) */
  codeIntro?: string;
  /** What the student should try changing */
  challenge?: string;
  /** Shown after successful run */
  successHint?: string;

  // --- Practice problems (collapsible, after main exercise) ---
  /** Extra practice problems to reinforce the concept */
  practice?: {
    label: string; // e.g. "Reinforce", "Apply", "Challenge"
    prompt: string;
    starterCode: string;
    hint?: string;
  }[];

  // --- Shared state (legacy props — now falls back to context) ---
  pyodideRef?: React.MutableRefObject<any>;
  onLoadPyodide?: () => Promise<any>;
  pyReady?: boolean;

  // --- Legacy support (maps to concept) ---
  /** @deprecated Use concept instead */
  explanation?: string;
}

export function inlineMarkdown(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 dark:text-white">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-amber-700 dark:text-amber-300 text-xs font-mono">$1</code>');
}

export function renderMarkdown(text: string) {
  const paragraphs = text.split(/\n\n+/);
  const html: string[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    const lines = trimmed.split('\n');

    // Process lines in groups: plain text, then list items, then plain text, etc.
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();

      // Numbered list run
      if (/^\d+\.\s/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          items.push(`<li class="ml-4 mb-1">${inlineMarkdown(lines[i].trim().replace(/^\d+\.\s/, ''))}</li>`);
          i++;
        }
        html.push(`<ol class="list-decimal pl-4 my-2 space-y-1">${items.join('')}</ol>`);
        continue;
      }

      // Bullet list run
      if (/^[-•]\s/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^[-•]\s/.test(lines[i].trim())) {
          items.push(`<li class="ml-4 mb-1">${inlineMarkdown(lines[i].trim().replace(/^[-•]\s/, ''))}</li>`);
          i++;
        }
        html.push(`<ul class="list-disc pl-4 my-2 space-y-1">${items.join('')}</ul>`);
        continue;
      }

      // Plain text run — collect consecutive non-list lines
      const textLines: string[] = [];
      while (i < lines.length && !/^\d+\.\s/.test(lines[i].trim()) && !/^[-•]\s/.test(lines[i].trim())) {
        textLines.push(inlineMarkdown(lines[i].trim()));
        i++;
      }
      html.push(`<p class="mb-3">${textLines.join('<br/>')}</p>`);
    }
  }

  return html.join('');
}

/* ── Split pane: code on top, output on bottom, draggable divider, fullscreen ── */
const INLINE_HEIGHT = 460;
const MIN_CODE = 100;
const MIN_OUTPUT = 80;

function SplitPane({ code, lineCount, onCodeChange, onKeyDown, textareaRef, output, imageOutput, running, pyReady, toolbar, dark, onToggleTheme }: {
  code: string; lineCount: number; onCodeChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  output: string; imageOutput: string | null; running: boolean; pyReady: boolean;
  toolbar: React.ReactNode;
  dark: boolean;
  onToggleTheme: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [splitRatio, setSplitRatio] = useState(0.6); // 60% code, 40% output
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [expanded]);

  // Lock body scroll when expanded
  useEffect(() => {
    if (expanded) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [expanded]);

  const onDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const startY = e.clientY;
    const startRatio = splitRatio;
    const totalH = container.offsetHeight;
    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientY - startY;
      const next = Math.max(MIN_CODE / totalH, Math.min(1 - MIN_OUTPUT / totalH, startRatio + delta / totalH));
      setSplitRatio(next);
    };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [splitRatio]);

  const onDividerTouchStart = useCallback((e: React.TouchEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const startY = e.touches[0].clientY;
    const startRatio = splitRatio;
    const totalH = container.offsetHeight;
    const onMove = (ev: TouchEvent) => {
      const delta = ev.touches[0].clientY - startY;
      const next = Math.max(MIN_CODE / totalH, Math.min(1 - MIN_OUTPUT / totalH, startRatio + delta / totalH));
      setSplitRatio(next);
    };
    const onEnd = () => { window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  }, [splitRatio]);

  const wrapperClass = expanded
    ? `fixed inset-0 z-50 flex flex-col ${dark ? 'bg-gray-900' : 'bg-white'}`
    : 'flex flex-col';
  const totalStyle = expanded ? {} : { height: INLINE_HEIGHT };

  return (
    <div ref={containerRef} style={totalStyle} className={wrapperClass}>
      {/* Toolbar */}
      <div className={`flex items-center gap-2 px-4 py-2 flex-shrink-0 border-b ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
        {toolbar}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-1 px-2 py-1.5 text-xs transition-colors ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            title={dark ? 'Switch to light editor' : 'Switch to dark editor'}
          >
            {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center gap-1 px-2 py-1.5 text-xs transition-colors ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            title={expanded ? 'Exit fullscreen (Esc)' : 'Expand to fullscreen'}
          >
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            {expanded ? 'Exit' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Code editor */}
      <div className={`flex overflow-y-auto ${dark ? 'bg-gray-900' : 'bg-gray-50'}`} style={{ flex: `0 0 ${splitRatio * 100}%` }}>
        <div className={`flex-shrink-0 pt-3 pb-3 pr-2 pl-3 select-none border-r ${dark ? 'border-gray-700' : 'border-gray-300'}`} aria-hidden>
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className={`leading-6 text-xs font-mono ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{i + 1}</div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            rows={lineCount}
            className={`w-full bg-transparent font-mono text-sm pl-3 pr-4 py-3 resize-none focus:outline-none leading-6 ${dark ? 'text-gray-100' : 'text-gray-900'}`}
            style={{ tabSize: 4 }}
          />
        </div>
      </div>

      {/* Draggable divider */}
      <div
        onMouseDown={onDividerMouseDown}
        onTouchStart={onDividerTouchStart}
        className={`flex-shrink-0 h-2 hover:bg-emerald-600 cursor-row-resize flex items-center justify-center transition-colors group ${dark ? 'bg-gray-700' : 'bg-gray-300'}`}
        title="Drag to resize"
      >
        <GripHorizontal className={`w-4 h-3 group-hover:text-white ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>

      {/* Output area */}
      <div className={`flex flex-col overflow-hidden flex-1 min-h-0 ${dark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className={`flex items-center gap-2 px-4 py-1.5 border-b flex-shrink-0 ${dark ? 'bg-gray-800/80 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Output</span>
          {running && <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />}
          {output && (
            <button
              onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className={`ml-auto p-1 rounded transition-colors ${dark ? 'hover:bg-gray-700 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'}`}
              title="Copy output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {!output && !imageOutput && (
            <p className={`px-4 py-3 text-xs italic ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              {!pyReady ? 'Click "Load Python" above, then click "Run" to execute the code.' : 'Click "Run" to execute the code.'}
            </p>
          )}
          {imageOutput && (
            <div className="p-4 flex justify-center">
              <img src={imageOutput} alt="Plot" className="max-w-full rounded-lg" />
            </div>
          )}
          {output && (
            <pre className={`px-4 py-3 text-sm font-mono whitespace-pre-wrap ${dark ? 'text-emerald-300' : 'text-emerald-700'}`}>{output}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MiniLesson({
  id,
  number,
  title,
  concept,
  analogy,
  storyConnection,
  checkQuestion,
  checkAnswer,
  diagram,
  code: initialCode,
  codeIntro,
  challenge,
  successHint,
  pyodideRef: propPyodideRef,
  onLoadPyodide: propOnLoadPyodide,
  pyReady: propPyReady,
  practice,
  explanation,
}: MiniLessonProps) {
  // Editor theme from preferences — toggle persists to localStorage
  const { editorTheme, setEditorTheme } = usePrefs();
  const isDark = editorTheme === 'dark';
  const toggleTheme = useCallback(() => {
    setEditorTheme(isDark ? 'light' : 'dark');
  }, [isDark, setEditorTheme]);
  // Use context as primary, fall back to props for legacy compatibility
  const ctx = usePyodide();
  const pyodideRef = propPyodideRef ?? ctx.pyodideRef;
  const onLoadPyodide = propOnLoadPyodide ?? ctx.load;
  const pyReady = propPyReady ?? ctx.ready;
  const pyContextLoading = ctx.state === 'loading';
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [imageOutput, setImageOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [pyLoading, setPyLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [activePractice, setActivePractice] = useState<number | null>(null);
  const [practiceCode, setPracticeCode] = useState<Record<number, string>>({});
  const [practiceOutput, setPracticeOutput] = useState<Record<number, string>>({});
  const [practiceImage, setPracticeImage] = useState<Record<number, string | null>>({});
  const [practiceRunning, setPracticeRunning] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use concept if provided, fall back to explanation for backwards compat
  const conceptText = concept || explanation || '';

  const run = useCallback(async () => {
    let pyodide = pyodideRef.current;
    if (!pyodide) {
      pyodide = await onLoadPyodide();
      if (!pyodide) return;
    }

    setRunning(true);
    setOutput('');
    setImageOutput(null);

    try {
      await pyodide.runPythonAsync('_stdout_capture.clear()');
      await pyodide.runPythonAsync(code);

      const stdout = await pyodide.runPythonAsync('_stdout_capture.get_output()');
      setOutput(stdout || '(no output)');

      try {
        const hasPlot = await pyodide.runPythonAsync(`
import matplotlib.pyplot as plt
len(plt.get_fignums()) > 0
`);
        if (hasPlot) {
          const imgData = await pyodide.runPythonAsync('_get_plot_as_base64()');
          setImageOutput(`data:image/png;base64,${imgData}`);
        }
      } catch {
        // no matplotlib or no plot
      }

      setHasRun(true);
    } catch (err: any) {
      setOutput(err.message || String(err));
    } finally {
      setRunning(false);
    }
  }, [code, pyodideRef, onLoadPyodide]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      setCode(code.substring(0, start) + '    ' + code.substring(end));
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 4; }, 0);
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      run();
    }
  };

  const lineCount = code.split('\n').length;

  return (
    <div id={id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden scroll-mt-24">

      {/* ===== CONCEPT SECTION ===== */}
      <div className="px-6 pt-6 pb-4">
        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{number}</span>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h4>
          {hasRun && <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
        </div>

        {/* Concept explanation — with inline diagram at [diagram] marker */}
        {conceptText.includes('[diagram]') ? (
          <>
            {conceptText.split('[diagram]').map((part, idx) => (
              <div key={idx}>
                {part.trim() && (
                  <div
                    className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(part.trim()) }}
                  />
                )}
                {idx === 0 && diagram && (
                  <div className="my-4">
                    <DiagramZoom>{diagram}</DiagramZoom>
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <div
            className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(conceptText) }}
          />
        )}

        {/* Analogy callout */}
        {analogy && (
          <div className="bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-400 rounded-r-lg px-4 py-3 mb-4">
            <p className="text-sm text-sky-800 dark:text-sky-300 leading-relaxed">
              <strong>Think of it this way:</strong> {analogy}
            </p>
          </div>
        )}

        {/* Story connection */}
        {storyConnection && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 rounded-r-lg px-4 py-3 mb-4">
            <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
              <strong>In the story:</strong> {storyConnection}
            </p>
          </div>
        )}

        {/* Check understanding */}
        {checkQuestion && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-2">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">Before you code — think about this:</p>
                <p className="text-sm text-amber-800 dark:text-amber-300">{checkQuestion}</p>
                {checkAnswer && (
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors"
                  >
                    {showAnswer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {showAnswer ? 'Hide answer' : 'Show answer'}
                  </button>
                )}
                {showAnswer && checkAnswer && (
                  <p className="mt-2 text-sm text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-3 py-2 rounded-lg">{checkAnswer}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== DIAGRAM (only if not already inlined via [diagram] marker) ===== */}
      {diagram && !conceptText.includes('[diagram]') && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <DiagramZoom>
            {diagram}
          </DiagramZoom>
        </div>
      )}

      {/* ===== CODE SECTION ===== */}
      {codeIntro && (
        <div className="px-6 py-2 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong className="text-gray-900 dark:text-white">Now try it:</strong> {codeIntro}
          </p>
        </div>
      )}

      <SplitPane
        code={code}
        lineCount={lineCount}
        onCodeChange={setCode}
        onKeyDown={handleKeyDown}
        textareaRef={textareaRef}
        output={output}
        imageOutput={imageOutput}
        running={running}
        pyReady={!!(pyReady || pyodideRef?.current)}
        dark={isDark}
        onToggleTheme={toggleTheme}
        toolbar={<>
          {!pyReady && !pyodideRef?.current ? (
            <button
              onClick={async () => { setPyLoading(true); await onLoadPyodide(); setPyLoading(false); }}
              disabled={pyLoading || pyContextLoading}
              className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-semibold transition-colors ${pyLoading || pyContextLoading ? 'bg-amber-700' : 'bg-amber-600 hover:bg-amber-700'}`}
              title="Load Python to run this code"
            >
              {pyLoading || pyContextLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {pyLoading || pyContextLoading ? 'Loading Python...' : 'Load Python'}
            </button>
          ) : (
            <button
              onClick={run}
              disabled={running}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors"
              title={`Run (${typeof navigator !== 'undefined' && /Mac/.test(navigator.platform) ? '⌘' : 'Ctrl'}+Enter)`}
            >
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {running ? 'Running...' : 'Run'}
            </button>
          )}
          <button
            onClick={() => { setCode(initialCode); setOutput(''); setImageOutput(null); setHasRun(false); }}
            className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          {hasRun && <CheckCircle className="w-4 h-4 text-emerald-500" />}
        </>}
      />

      {/* Challenge */}
      {challenge && (
        <div className="px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Experiment:</strong> {challenge}
          </p>
        </div>
      )}

      {/* Success */}
      {hasRun && successHint && (
        <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-emerald-800 dark:text-emerald-300">
            <CheckCircle className="w-4 h-4 inline mr-1" />
            {successHint}
          </p>
        </div>
      )}

      {/* ===== PRACTICE PROBLEMS ===== */}
      {practice && practice.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowPractice(!showPractice)}
            className="w-full px-6 py-3 flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-bold">{practice.length}</span>
              Practice Problems
            </span>
            {showPractice ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showPractice && (
            <div className="px-6 pb-4 space-y-4">
              {practice.map((prob, i) => {
                const pCode = practiceCode[i] ?? prob.starterCode;
                const pOutput = practiceOutput[i] ?? '';
                const pImage = practiceImage[i] ?? null;
                const isRunning = practiceRunning === i;
                const isOpen = activePractice === i;
                const pLineCount = pCode.split('\n').length;

                const runPractice = async () => {
                  let pyodide = pyodideRef.current;
                  if (!pyodide) { pyodide = await onLoadPyodide(); if (!pyodide) return; }
                  setPracticeRunning(i);
                  setPracticeOutput(prev => ({ ...prev, [i]: '' }));
                  setPracticeImage(prev => ({ ...prev, [i]: null }));
                  try {
                    await pyodide.runPythonAsync('_stdout_capture.clear()');
                    await pyodide.runPythonAsync(pCode);
                    const stdout = await pyodide.runPythonAsync('_stdout_capture.get_output()');
                    setPracticeOutput(prev => ({ ...prev, [i]: stdout || '(no output)' }));
                    try {
                      const hasPlot = await pyodide.runPythonAsync('import matplotlib.pyplot as plt\nlen(plt.get_fignums()) > 0');
                      if (hasPlot) {
                        const img = await pyodide.runPythonAsync('_get_plot_as_base64()');
                        setPracticeImage(prev => ({ ...prev, [i]: `data:image/png;base64,${img}` }));
                      }
                    } catch {}
                  } catch (err: any) {
                    setPracticeOutput(prev => ({ ...prev, [i]: err.message || String(err) }));
                  } finally {
                    setPracticeRunning(null);
                  }
                };

                return (
                  <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Problem header */}
                    <button
                      onClick={() => setActivePractice(isOpen ? null : i)}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        prob.label === 'Reinforce' ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400' :
                        prob.label === 'Apply' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                        'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                      }`}>
                        {prob.label === 'Reinforce' ? 'R' : prob.label === 'Apply' ? 'A' : 'C'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{prob.label}</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{prob.prompt}</p>
                      </div>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                    </button>

                    {isOpen && (
                      <>
                        {prob.hint && (
                          <div className="px-4 py-2 bg-violet-50 dark:bg-violet-900/20 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-violet-700 dark:text-violet-300"><strong>Hint:</strong> {prob.hint}</p>
                          </div>
                        )}

                        {/* Mini editor */}
                        <div className={`flex border-t ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
                          <div className={`flex-shrink-0 pt-3 pb-3 pr-2 pl-3 select-none border-r ${isDark ? 'border-gray-700' : 'border-gray-300'}`} aria-hidden>
                            {Array.from({ length: pLineCount }).map((_, li) => (
                              <div key={li} className={`leading-6 text-xs font-mono ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{li + 1}</div>
                            ))}
                          </div>
                          <div className="flex-1 min-w-0">
                            <textarea
                              value={pCode}
                              onChange={(e) => setPracticeCode(prev => ({ ...prev, [i]: e.target.value }))}
                              spellCheck={false}
                              rows={pLineCount}
                              className={`w-full bg-transparent font-mono text-sm pl-3 pr-4 py-3 resize-none focus:outline-none leading-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
                              style={{ tabSize: 4 }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runPractice(); }
                              }}
                            />
                          </div>
                          <div className="flex-shrink-0 p-2">
                            <button
                              onClick={runPractice}
                              disabled={isRunning}
                              className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 text-white rounded-lg transition-colors"
                              title={`Run (${typeof navigator !== 'undefined' && /Mac/.test(navigator.platform) ? '⌘' : 'Ctrl'}+Enter)`}
                            >
                              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {pOutput && (
                          <div className={`border-t ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-gray-50'}`}>
                            <div className="flex items-start">
                              <pre className={`flex-1 px-4 py-3 text-sm font-mono whitespace-pre-wrap max-h-[120px] overflow-y-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{pOutput}</pre>
                              <button
                                onClick={() => navigator.clipboard.writeText(pOutput)}
                                className={`flex-shrink-0 p-1.5 m-1 rounded transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'}`}
                                title="Copy output"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                        {pImage && (
                          <div className={`border-t p-4 flex justify-center ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-gray-100'}`}>
                            <img src={pImage} alt="Plot" className="max-w-full rounded-lg" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
