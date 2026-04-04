import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Loader2, AlertTriangle, Sun, Moon } from 'lucide-react';
import { usePrefs } from '../contexts/PrefsContext';
import { useTs } from '../contexts/TsContext';

interface TsPlaygroundProps {
  starterCode: string;
  title?: string;
}

export default function TsPlayground({ starterCode, title = 'TypeScript Playground' }: TsPlaygroundProps) {
  const { editorTheme, setEditorTheme } = usePrefs();
  const isDark = editorTheme === 'dark';
  const { load, runTs, state: ctxState, loadProgress, ready } = useTs();

  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [compileErrors, setCompileErrors] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const tsState = running ? 'running' : ctxState;

  const handleRun = useCallback(async () => {
    const ts = await load();
    if (!ts) return;

    setRunning(true);
    setOutput('');
    setError('');
    setCompileErrors([]);

    await new Promise(r => setTimeout(r, 10));

    const result = runTs(code);

    setOutput(result.output);
    setError(result.error || '');
    setCompileErrors(result.compileErrors);
    setRunning(false);
  }, [code, load, runTs]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const s = ta.selectionStart;
      const end = ta.selectionEnd;
      setCode(code.substring(0, s) + '  ' + code.substring(end));
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 2; }, 0);
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

  return (
    <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} rounded-xl overflow-hidden border`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-blue-500 font-bold text-sm">TS</span>
          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</span>
          {ready && (
            <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">Ready</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setCode(starterCode); setOutput(''); setError(''); setCompileErrors([]); }} className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors" title="Reset code">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setEditorTheme(isDark ? 'light' : 'dark')} className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors" title="Toggle theme">
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleRun}
            disabled={tsState === 'loading' || running}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
          >
            {tsState === 'loading' || running
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Play className="w-3.5 h-3.5" />}
            {tsState === 'loading' ? 'Loading...' : running ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Loading progress */}
      {tsState === 'loading' && loadProgress && (
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 text-sm text-amber-400 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> {loadProgress}
        </div>
      )}

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
          className={`flex-1 bg-transparent font-mono text-sm pl-3 pr-4 pt-2 pb-4 resize-none focus:outline-none min-h-[100px] leading-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
          style={{ tabSize: 2 }}
        />
      </div>

      {/* Compile errors (warnings) */}
      {compileErrors.length > 0 && (
        <div className="border-t border-amber-800 bg-amber-900/20 p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Compile Warnings</p>
          </div>
          {compileErrors.map((e, i) => (
            <p key={i} className="text-sm text-amber-300 font-mono">{e}</p>
          ))}
        </div>
      )}

      {/* Runtime error */}
      {error && (
        <div className="border-t border-red-800 bg-red-900/20 p-4">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1">Error</p>
          <pre className="text-sm text-red-300 font-mono whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="border-t border-gray-700 bg-gray-800/50">
          <div className="px-4 py-2 border-b border-gray-700 text-xs font-semibold text-gray-500 uppercase tracking-wide">Output</div>
          <pre className="p-4 text-sm text-gray-300 font-mono whitespace-pre-wrap overflow-x-auto max-h-[300px] overflow-y-auto">{output}</pre>
        </div>
      )}

      {/* Hint bar */}
      {!ready && ctxState === 'idle' && (
        <div className="border-t border-gray-700 px-4 py-2 bg-gray-800/30">
          <p className="text-xs text-gray-500">Click Run to load the TypeScript compiler (~5MB, cached after first load).</p>
        </div>
      )}
      {ready && !output && !error && compileErrors.length === 0 && (
        <div className="border-t border-gray-700 px-4 py-2 bg-gray-800/30">
          <p className="text-xs text-gray-500">Press Ctrl+Enter to compile and run. Type errors show as compile warnings.</p>
        </div>
      )}
    </div>
  );
}
