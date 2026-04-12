import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Loader2, Sun, Moon, Copy, Check } from 'lucide-react';
import { usePrefs } from '../contexts/PrefsContext';
import { usePyodide } from '../contexts/PyodideContext';

interface PythonPlaygroundProps {
  starterCode: string;
  title?: string;
}

export default function PythonPlayground({ starterCode, title = 'Try it' }: PythonPlaygroundProps) {
  const { editorTheme, setEditorTheme } = usePrefs();
  const isDark = editorTheme === 'dark';
  const { pyodideRef, load, ready, state } = usePyodide();

  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setOutput('');
    setError('');
    try {
      const pyodide = pyodideRef?.current || await load();
      if (!pyodide) { setError('Failed to load Python'); setRunning(false); return; }
      await pyodide.runPythonAsync('_stdout_capture.clear()');
      await pyodide.runPythonAsync(code);
      const stdout = await pyodide.runPythonAsync('_stdout_capture.get_output()');
      setOutput(stdout || '(no output)');
    } catch (err: any) {
      setError(err.message || String(err));
    }
    setRunning(false);
  }, [code, load, pyodideRef]);

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
      handleRun();
    }
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; }
  }, [code]);

  const lineCount = code.split('\n').length;
  const pyState = state === 'loading' ? 'loading' : running ? 'running' : state;

  return (
    <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} rounded-xl overflow-hidden border`}>
      {/* Header */}
      <div className={`px-4 py-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-emerald-500 font-bold text-sm">Py</span>
          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</span>
          {ready && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'text-emerald-400 bg-emerald-900/30' : 'text-emerald-700 bg-emerald-100'}`}>Ready</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setCode(starterCode); setOutput(''); setError(''); }}
            className={`p-1.5 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`} title="Reset code">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setEditorTheme(isDark ? 'light' : 'dark')}
            className={`p-1.5 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`} title="Toggle theme">
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <button onClick={handleRun} disabled={pyState === 'loading' || running}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
            {pyState === 'loading' || running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            {pyState === 'loading' ? 'Loading...' : running ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex">
        <div className={`flex-shrink-0 pt-2 pb-4 pr-2 text-right select-none border-r ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`} style={{ width: '3rem' }}>
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className={`leading-6 text-xs font-mono ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className={`flex-1 bg-transparent font-mono text-sm pl-3 pr-4 pt-2 pb-4 resize-none focus:outline-none min-h-[80px] leading-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
          style={{ tabSize: 4 }}
        />
      </div>

      {/* Loading indicator */}
      {pyState === 'loading' && (
        <div className={`border-t px-4 py-4 flex items-center gap-3 ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          <div>
            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Loading Python runtime...</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Downloading Pyodide ({'>'}10 MB). This only happens once per session.</p>
          </div>
        </div>
      )}

      {/* Output */}
      {error && (
        <div className={`border-t p-4 ${isDark ? 'border-red-800 bg-red-900/20' : 'border-red-200 bg-red-50'}`}>
          <pre className={`text-sm font-mono whitespace-pre-wrap ${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</pre>
        </div>
      )}

      {output && !error && (
        <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`flex items-center px-4 py-1 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Output</span>
            <button
              onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className={`ml-auto p-1 rounded transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'}`}
              title="Copy output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className={`px-4 py-3 text-sm font-mono whitespace-pre-wrap max-h-[200px] overflow-y-auto ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{output}</pre>
        </div>
      )}

      {/* Hint */}
      {!ready && !output && !error && (
        <div className={`border-t px-4 py-2 ${isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Click Run to load Python and execute the code. {typeof navigator !== 'undefined' && /Mac/.test(navigator.platform) ? '⌘' : 'Ctrl'}+Enter also works.
          </p>
        </div>
      )}
    </div>
  );
}
