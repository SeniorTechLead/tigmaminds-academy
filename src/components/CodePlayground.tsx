import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Loader2, CheckCircle, Terminal, ChevronRight } from 'lucide-react';

interface CodePlaygroundProps {
  /** Initial code in the editor */
  starterCode: string;
  /** Packages to pre-install via micropip (e.g. ['numpy', 'matplotlib']) */
  packages?: string[];
  /** Title shown above the playground */
  title?: string;
  /** Description text */
  description?: string;
  /** Guided steps the student works through. lines is 1-indexed [start, end] inclusive. */
  steps?: { title: string; hint: string; lines?: [number, number] }[];
}

type PyodideState = 'idle' | 'loading' | 'ready' | 'running' | 'error';

export default function CodePlayground({
  starterCode,
  packages = [],
  title = 'Code Playground',
  description,
  steps,
}: CodePlaygroundProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState('');
  const [imageOutput, setImageOutput] = useState<string | null>(null);
  const [pyState, setPyState] = useState<PyodideState>('idle');
  const [loadProgress, setLoadProgress] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const pyodideRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;

    setPyState('loading');
    setLoadProgress('Loading Python runtime...');

    try {
      // Load Pyodide from CDN
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Pyodide'));
        });
      }

      setLoadProgress('Initializing Python...');
      const pyodide = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      });

      // Install requested packages
      if (packages.length > 0) {
        setLoadProgress(`Installing packages: ${packages.join(', ')}...`);
        await pyodide.loadPackage('micropip');
        const micropip = pyodide.pyimport('micropip');
        for (const pkg of packages) {
          setLoadProgress(`Installing ${pkg}...`);
          try {
            await micropip.install(pkg);
          } catch {
            // Some packages are built-in to Pyodide, try loading directly
            try {
              await pyodide.loadPackage(pkg);
            } catch {
              console.warn(`Could not install ${pkg}, skipping`);
            }
          }
        }
      }

      // Set up matplotlib for inline rendering
      await pyodide.runPythonAsync(`
import sys
import io

# Redirect stdout
class OutputCapture:
    def __init__(self):
        self.output = []
    def write(self, text):
        self.output.append(text)
    def flush(self):
        pass
    def get_output(self):
        return ''.join(self.output)
    def clear(self):
        self.output = []

_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
`);

      // Set up matplotlib backend if matplotlib is in packages
      if (packages.includes('matplotlib')) {
        await pyodide.runPythonAsync(`
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt
import base64

def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close('all')
    return img_str
`);
      }

      pyodideRef.current = pyodide;
      setPyState('ready');
      setLoadProgress('');
      return pyodide;
    } catch (err: any) {
      setPyState('error');
      setLoadProgress('');
      setOutput(`Error loading Python: ${err.message}`);
      return null;
    }
  }, [packages]);

  const runCode = useCallback(async () => {
    const pyodide = pyodideRef.current || (await loadPyodide());
    if (!pyodide) return;

    setPyState('running');
    setOutput('');
    setImageOutput(null);

    try {
      // Clear previous output
      await pyodide.runPythonAsync('_stdout_capture.clear()');

      // Run user code
      await pyodide.runPythonAsync(code);

      // Capture stdout
      const stdout = await pyodide.runPythonAsync('_stdout_capture.get_output()');
      setOutput(stdout || '(no output)');

      // Check if there's a matplotlib plot
      if (packages.includes('matplotlib')) {
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
          // No plot, that's fine
        }
      }

      setPyState('ready');
    } catch (err: any) {
      // Extract Python traceback
      const errMsg = err.message || String(err);
      setOutput(errMsg);
      setPyState('ready');
    }
  }, [code, loadPyodide, packages]);

  // Handle tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
    // Ctrl/Cmd + Enter to run
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runCode();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(200, textarea.scrollHeight) + 'px';
    }
  }, [code]);

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white font-bold">{title}</h3>
          {pyState === 'ready' && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" /> Python Ready
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setCode(starterCode); setOutput(''); setImageOutput(null); }}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={runCode}
            disabled={pyState === 'loading' || pyState === 'running'}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            {pyState === 'loading' || pyState === 'running' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {pyState === 'loading' ? 'Loading...' : pyState === 'running' ? 'Running...' : 'Run (⌘↵)'}
          </button>
        </div>
      </div>

      {/* Loading progress */}
      {pyState === 'loading' && loadProgress && (
        <div className="px-6 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            {loadProgress}
          </div>
        </div>
      )}

      {description && (
        <div className="px-6 py-3 bg-gray-800/50 border-b border-gray-700">
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      )}

      {/* Steps sidebar + editor */}
      <div className="flex">
        {/* Steps panel */}
        {steps && steps.length > 0 && (
          <div className="w-64 border-r border-gray-700 bg-gray-800/50 p-4 hidden lg:block">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Steps</p>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                    currentStep === i
                      ? 'bg-emerald-900/30 border border-emerald-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep === i ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-400'
                    }`}>{i + 1}</span>
                    <span className="font-medium">{step.title}</span>
                  </div>
                  {currentStep === i && (
                    <p className="text-xs text-gray-400 mt-1 ml-7">{step.hint}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Editor with line numbers and highlights */}
        <div className="flex-1 min-w-0">
          <div className="relative flex">
            {/* Line number gutter + highlight indicators */}
            <div
              className="flex-shrink-0 bg-gray-800/50 pt-2 pb-4 select-none text-right pr-2 border-r border-gray-700"
              style={{ width: '3rem', paddingTop: '0.5rem' }}
              aria-hidden
            >
              {code.split('\n').map((_, i) => {
                const lineNum = i + 1;
                const activeStep = steps?.find(
                  (s) => s.lines && currentStep === steps.indexOf(s)
                );
                const isHighlighted = activeStep?.lines
                  ? lineNum >= activeStep.lines[0] && lineNum <= activeStep.lines[1]
                  : false;
                return (
                  <div
                    key={i}
                    className="leading-6 text-xs font-mono"
                    style={{
                      color: isHighlighted ? '#f59e0b' : '#4b5563',
                      fontWeight: isHighlighted ? 700 : 400,
                    }}
                  >
                    {lineNum}
                  </div>
                );
              })}
            </div>

            {/* Code area with highlight backdrop */}
            <div className="flex-1 relative min-w-0">
              {/* Highlight backdrop */}
              <div className="absolute inset-0 pointer-events-none pt-2" aria-hidden>
                {code.split('\n').map((_, i) => {
                  const lineNum = i + 1;
                  const activeStep = steps?.find(
                    (s) => s.lines && currentStep === steps.indexOf(s)
                  );
                  const isHighlighted = activeStep?.lines
                    ? lineNum >= activeStep.lines[0] && lineNum <= activeStep.lines[1]
                    : false;
                  return (
                    <div
                      key={i}
                      className="leading-6 transition-colors duration-200"
                      style={{
                        backgroundColor: isHighlighted ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                        borderLeft: isHighlighted ? '2px solid #f59e0b' : '2px solid transparent',
                      }}
                    >
                      &nbsp;
                    </div>
                  );
                })}
              </div>

              {/* Actual textarea */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="w-full bg-transparent text-gray-100 font-mono text-sm pl-3 pr-4 pt-2 pb-4 resize-none focus:outline-none min-h-[200px] leading-6 relative z-10"
                style={{ tabSize: 4 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Output */}
      {(output || imageOutput) && (
        <div className="border-t border-gray-700">
          <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Output</span>
          </div>

          {output && (
            <pre className="p-4 text-sm text-gray-300 font-mono whitespace-pre-wrap overflow-x-auto max-h-[300px] overflow-y-auto">
              {output}
            </pre>
          )}

          {imageOutput && (
            <div className="p-4 flex justify-center bg-gray-800/50">
              <img
                src={imageOutput}
                alt="Plot output"
                className="max-w-full rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
