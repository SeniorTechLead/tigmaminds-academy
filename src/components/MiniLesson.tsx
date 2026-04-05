import { useState, useRef, useCallback, useContext } from 'react';
import { Play, Loader2, CheckCircle, RotateCcw, HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import DiagramZoom from './DiagramZoom';
import { usePyodide } from '../contexts/PyodideContext';

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
  // Use context as primary, fall back to props for legacy compatibility
  const ctx = usePyodide();
  const pyodideRef = propPyodideRef ?? ctx.pyodideRef;
  const onLoadPyodide = propOnLoadPyodide ?? ctx.load;
  const pyReady = propPyReady ?? ctx.ready;
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [imageOutput, setImageOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
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

        {/* Concept explanation */}
        <div
          className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(conceptText) }}
        />

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

      {/* ===== DIAGRAM ===== */}
      {diagram && (
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

      <div className="flex bg-gray-900">
        {/* Line numbers */}
        <div className="flex-shrink-0 pt-3 pb-3 pr-2 pl-3 select-none border-r border-gray-700" aria-hidden>
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="leading-6 text-xs font-mono text-gray-600">{i + 1}</div>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 min-w-0 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            rows={lineCount}
            className="w-full bg-transparent text-gray-100 font-mono text-sm pl-3 pr-4 py-3 resize-none focus:outline-none leading-6"
            style={{ tabSize: 4 }}
          />
        </div>

        {/* Run / reset buttons */}
        <div className="flex-shrink-0 p-2 flex flex-col items-center justify-start gap-2">
          {!pyReady && !pyodideRef?.current ? (
            <button
              onClick={onLoadPyodide}
              className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors animate-pulse"
              title="Load Python to run this code"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={run}
              disabled={running}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 text-white rounded-lg transition-colors"
              title="Run (⌘↵)"
            >
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={() => { setCode(initialCode); setOutput(''); setImageOutput(null); setHasRun(false); }}
            className="p-2 text-gray-500 hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Python not loaded hint */}
      {!pyReady && !pyodideRef?.current && !output && (
        <div className="border-t border-gray-700 bg-gray-800/50 px-4 py-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-xs text-amber-300">
            <button onClick={onLoadPyodide} className="underline hover:text-amber-200 font-semibold">Load Python</button> to run this code — it takes a few seconds the first time.
          </p>
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="border-t border-gray-700 bg-gray-900">
          <pre className="px-4 py-3 text-sm text-gray-300 font-mono whitespace-pre-wrap max-h-[150px] overflow-y-auto">{output}</pre>
        </div>
      )}

      {imageOutput && (
        <div className="border-t border-gray-700 bg-gray-800/50 p-4 flex justify-center">
          <img src={imageOutput} alt="Plot" className="max-w-full rounded-lg" />
        </div>
      )}

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
                        <div className="flex bg-gray-900 border-t border-gray-700">
                          <div className="flex-shrink-0 pt-3 pb-3 pr-2 pl-3 select-none border-r border-gray-700" aria-hidden>
                            {Array.from({ length: pLineCount }).map((_, li) => (
                              <div key={li} className="leading-6 text-xs font-mono text-gray-600">{li + 1}</div>
                            ))}
                          </div>
                          <div className="flex-1 min-w-0">
                            <textarea
                              value={pCode}
                              onChange={(e) => setPracticeCode(prev => ({ ...prev, [i]: e.target.value }))}
                              spellCheck={false}
                              rows={pLineCount}
                              className="w-full bg-transparent text-gray-100 font-mono text-sm pl-3 pr-4 py-3 resize-none focus:outline-none leading-6"
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
                              title="Run (⌘↵)"
                            >
                              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {pOutput && (
                          <div className="border-t border-gray-700 bg-gray-900">
                            <pre className="px-4 py-3 text-sm text-gray-300 font-mono whitespace-pre-wrap max-h-[120px] overflow-y-auto">{pOutput}</pre>
                          </div>
                        )}
                        {pImage && (
                          <div className="border-t border-gray-700 bg-gray-800/50 p-4 flex justify-center">
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
