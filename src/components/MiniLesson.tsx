import { useState, useRef, useCallback } from 'react';
import { Play, Loader2, CheckCircle, RotateCcw, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

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

  // --- Code section ---
  /** Code the student starts with */
  code: string;
  /** What the code does, in one sentence (shown above editor) */
  codeIntro?: string;
  /** What the student should try changing */
  challenge?: string;
  /** Shown after successful run */
  successHint?: string;

  // --- Shared state ---
  pyodideRef: React.MutableRefObject<any>;
  onLoadPyodide: () => Promise<any>;
  pyReady: boolean;

  // --- Legacy support (maps to concept) ---
  /** @deprecated Use concept instead */
  explanation?: string;
}

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 dark:text-white">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-amber-700 dark:text-amber-300 text-xs font-mono">$1</code>');
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
  code: initialCode,
  codeIntro,
  challenge,
  successHint,
  pyodideRef,
  onLoadPyodide,
  pyReady,
  explanation,
}: MiniLessonProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [imageOutput, setImageOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
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
          <button
            onClick={run}
            disabled={running || (!pyReady && !pyodideRef.current)}
            className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 text-white rounded-lg transition-colors"
            title="Run (⌘↵)"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => { setCode(initialCode); setOutput(''); setImageOutput(null); setHasRun(false); }}
            className="p-2 text-gray-500 hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

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
    </div>
  );
}
