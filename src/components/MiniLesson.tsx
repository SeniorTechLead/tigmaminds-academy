import { useState, useRef, useCallback } from 'react';
import { Play, Loader2, CheckCircle, RotateCcw } from 'lucide-react';

interface MiniLessonProps {
  /** Lesson number for display */
  number: number;
  /** Short title */
  title: string;
  /** Explanation text (supports simple markdown bold) */
  explanation: string;
  /** Code the student starts with */
  code: string;
  /** What the student should try changing */
  challenge?: string;
  /** Expected output (shown after they run successfully) */
  successHint?: string;
  /** Shared Pyodide instance ref */
  pyodideRef: React.MutableRefObject<any>;
  /** Callback when Pyodide needs to be loaded */
  onLoadPyodide: () => Promise<any>;
  /** Whether Pyodide is ready */
  pyReady: boolean;
}

export default function MiniLesson({
  number,
  title,
  explanation,
  code: initialCode,
  challenge,
  successHint,
  pyodideRef,
  onLoadPyodide,
  pyReady,
}: MiniLessonProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [imageOutput, setImageOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

      // Check for plot
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-7 h-7 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center text-sm font-bold">{number}</span>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h4>
          {hasRun && <CheckCircle className="w-5 h-5 text-emerald-500" />}
        </div>
        <div
          className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: explanation
              .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 dark:text-white">$1</strong>')
              .replace(/`(.+?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-amber-700 dark:text-amber-300 text-xs font-mono">$1</code>')
          }}
        />
      </div>

      {/* Code editor */}
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

        {/* Run button */}
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

      {/* Challenge / hint */}
      {challenge && (
        <div className="px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Try this:</strong> {challenge}
          </p>
        </div>
      )}
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
