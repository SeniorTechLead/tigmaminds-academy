import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Loader2, Database, Sun, Moon, RefreshCw } from 'lucide-react';
import { usePrefs } from '../contexts/PrefsContext';
import { useSqlJs, SqlResult } from '../contexts/SqlJsContext';

interface SqlPlaygroundProps {
  starterCode: string;
  title?: string;
}

const MAX_DISPLAY_ROWS = 100;

export default function SqlPlayground({ starterCode, title = 'SQL Playground' }: SqlPlaygroundProps) {
  const { editorTheme, setEditorTheme } = usePrefs();
  const isDark = editorTheme === 'dark';
  const { load, runSql, resetDb, state: ctxState, loadProgress, ready } = useSqlJs();

  const [code, setCode] = useState(starterCode);
  const [results, setResults] = useState<SqlResult[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sqlState = running ? 'running' : ctxState;

  const handleRun = useCallback(async () => {
    const db = await load();
    if (!db) return;

    setRunning(true);
    setResults([]);
    setMessage('');
    setError('');

    // Small delay so UI updates before potentially long query
    await new Promise(r => setTimeout(r, 10));

    const { results: res, rowsModified, error: err } = runSql(code);

    if (err) {
      setError(err);
    } else if (res.length > 0) {
      setResults(res);
      const totalRows = res.reduce((sum, r) => sum + r.rows.length, 0);
      if (totalRows > MAX_DISPLAY_ROWS) {
        setMessage(`Showing first ${MAX_DISPLAY_ROWS} of ${totalRows} rows.`);
      }
    } else if (rowsModified > 0) {
      setMessage(`Done. ${rowsModified} row${rowsModified !== 1 ? 's' : ''} affected.`);
    } else {
      setMessage('Query executed successfully (no rows returned).');
    }

    setRunning(false);
  }, [code, load, runSql]);

  const handleReset = useCallback(() => {
    resetDb();
    setResults([]);
    setMessage('Database reset to sample data.');
    setError('');
  }, [resetDb]);

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
          <Database className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</span>
          {ready && (
            <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">Ready</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {ready && (
            <button onClick={handleReset} className="p-1.5 text-gray-400 hover:text-amber-400 transition-colors" title="Reset database to sample data">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={() => { setCode(starterCode); setResults([]); setMessage(''); setError(''); }} className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors" title="Reset code">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setEditorTheme(isDark ? 'light' : 'dark')} className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors" title="Toggle theme">
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleRun}
            disabled={sqlState === 'loading' || running}
            className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
          >
            {sqlState === 'loading' || running
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Play className="w-3.5 h-3.5" />}
            {sqlState === 'loading' ? 'Loading...' : running ? 'Running...' : 'Run SQL'}
          </button>
        </div>
      </div>

      {/* Loading progress */}
      {sqlState === 'loading' && loadProgress && (
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

      {/* Results */}
      {error && (
        <div className="border-t border-red-800 bg-red-900/20 p-4">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1">Error</p>
          <pre className="text-sm text-red-300 font-mono whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {message && !error && (
        <div className="border-t border-gray-700 bg-gray-800/50 px-4 py-3">
          <p className="text-sm text-emerald-400 font-medium">{message}</p>
        </div>
      )}

      {results.map((result, ri) => (
        <div key={ri} className="border-t border-gray-700">
          {results.length > 1 && (
            <div className="px-4 py-1 bg-gray-800/50 text-xs text-gray-500 font-semibold">
              Result {ri + 1}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
                  {result.columns.map((col, ci) => (
                    <th key={ci} className={`px-3 py-2 text-left font-semibold font-mono text-xs ${isDark ? 'text-cyan-300 border-gray-700' : 'text-cyan-700 border-gray-200'} border-b`}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.slice(0, MAX_DISPLAY_ROWS).map((row, rowIdx) => (
                  <tr key={rowIdx} className={rowIdx % 2 === 0 ? (isDark ? 'bg-gray-900' : 'bg-white') : (isDark ? 'bg-gray-800/30' : 'bg-gray-50')}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className={`px-3 py-1.5 font-mono text-xs ${isDark ? 'text-gray-300 border-gray-800' : 'text-gray-700 border-gray-100'} border-b`}>
                        {cell === null ? <span className="text-gray-500 italic">NULL</span> : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={`px-3 py-1.5 text-xs ${isDark ? 'text-gray-500 bg-gray-800/30' : 'text-gray-400 bg-gray-50'}`}>
            {result.rows.length} row{result.rows.length !== 1 ? 's' : ''}
          </div>
        </div>
      ))}

      {/* Hint bar */}
      {!ready && sqlState === 'idle' && (
        <div className="border-t border-gray-700 px-4 py-2 bg-gray-800/30">
          <p className="text-xs text-gray-500">Click Run SQL to load the database. Sample tables: elephants, sightings, parks.</p>
        </div>
      )}
      {ready && results.length === 0 && !error && !message && (
        <div className="border-t border-gray-700 px-4 py-2 bg-gray-800/30">
          <p className="text-xs text-gray-500">Press Ctrl+Enter to run. Tables: elephants, sightings, parks, park_elephants.</p>
        </div>
      )}
    </div>
  );
}
