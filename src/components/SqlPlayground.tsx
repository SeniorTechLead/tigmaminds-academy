import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Loader2, Database, Sun, Moon, RefreshCw, ChevronDown, ChevronUp, Table2 } from 'lucide-react';
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
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [schema, setSchema] = useState<{ table: string; columns: { name: string; type: string; pk: boolean; notnull: boolean }[] }[]>([]);
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

  const loadSchema = useCallback(async () => {
    const db = await load();
    if (!db) return;
    // Query schema directly from the db object (not via runSql which may see stale ref)
    const tableNames = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
    if (!tableNames.length) return;
    const result: typeof schema = [];
    for (const row of tableNames[0].values) {
      const tableName = String(row[0]);
      const info = db.exec(`PRAGMA table_info("${tableName}")`);
      if (info.length > 0) {
        result.push({
          table: tableName,
          columns: info[0].values.map((r: any[]) => ({
            name: String(r[1]),
            type: String(r[2] || 'TEXT'),
            pk: r[5] === 1,
            notnull: r[3] === 1,
          })),
        });
      }
    }
    setSchema(result);
  }, [load]);

  const toggleSchema = useCallback(() => {
    if (!schemaOpen && schema.length === 0) loadSchema();
    setSchemaOpen(o => !o);
  }, [schemaOpen, schema.length, loadSchema]);

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
            <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'text-emerald-400 bg-emerald-900/30' : 'text-emerald-700 bg-emerald-100'}`}>Ready</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {ready && (
            <button onClick={handleReset} className={`p-1.5 transition-colors ${isDark ? 'text-gray-400 hover:text-amber-400' : 'text-gray-500 hover:text-amber-600'}`} title="Reset database to sample data">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={() => { setCode(starterCode); setResults([]); setMessage(''); setError(''); }} className={`p-1.5 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`} title="Reset code">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setEditorTheme(isDark ? 'light' : 'dark')} className={`p-1.5 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`} title="Toggle theme">
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
        <div className={`px-4 py-2 border-b text-sm flex items-center gap-2 ${isDark ? 'bg-gray-800 border-gray-700 text-amber-400' : 'bg-amber-50 border-gray-200 text-amber-700'}`}>
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> {loadProgress}
        </div>
      )}

      {/* Schema panel */}
      <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={toggleSchema}
          className={`w-full px-4 py-1.5 flex items-center gap-2 text-xs font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          <Table2 className="w-3 h-3" />
          Schema
          {schemaOpen ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
        </button>
        {schemaOpen && (
          <div className={`px-4 pb-3 grid grid-cols-2 gap-3 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50/50'}`}>
            {schema.map(t => (
              <div key={t.table}>
                <p className={`text-xs font-bold font-mono mb-1 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>{t.table}</p>
                {t.columns.map(c => (
                  <div key={c.name} className="flex items-center gap-1.5 text-xs font-mono leading-5">
                    {c.pk && <span className={`text-[9px] px-1 rounded ${isDark ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>PK</span>}
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{c.name}</span>
                    <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>{c.type}</span>
                    {c.notnull && <span className={`text-[9px] ${isDark ? 'text-red-500' : 'text-red-400'}`}>NOT NULL</span>}
                  </div>
                ))}
              </div>
            ))}
            {schema.length === 0 && (
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Click Run SQL first to load the database.</p>
            )}
          </div>
        )}
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
          className={`flex-1 bg-transparent font-mono text-sm pl-3 pr-4 pt-2 pb-4 resize-none focus:outline-none min-h-[100px] leading-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
          style={{ tabSize: 2 }}
        />
      </div>

      {/* Results */}
      {error && (
        <div className={`border-t p-4 ${isDark ? 'border-red-800 bg-red-900/20' : 'border-red-200 bg-red-50'}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>Error</p>
          <pre className={`text-sm font-mono whitespace-pre-wrap ${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</pre>
        </div>
      )}

      {message && !error && (
        <div className={`border-t px-4 py-3 ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-emerald-50'}`}>
          <p className={`text-sm font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{message}</p>
        </div>
      )}

      {results.map((result, ri) => (
        <div key={ri} className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {results.length > 1 && (
            <div className={`px-4 py-1 text-xs font-semibold ${isDark ? 'bg-gray-800/50 text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
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
        <div className={`border-t px-4 py-2 ${isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Click Run SQL to load the database. Sample tables: elephants, sightings, parks.</p>
        </div>
      )}
      {ready && results.length === 0 && !error && !message && (
        <div className={`border-t px-4 py-2 ${isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Press {typeof navigator !== 'undefined' && /Mac/.test(navigator.platform) ? '⌘' : 'Ctrl'}+Enter to run. Tables: elephants, sightings, parks, park_elephants.</p>
        </div>
      )}
    </div>
  );
}
