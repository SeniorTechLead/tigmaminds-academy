import { createContext, useContext, useRef, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { SQL_SAMPLE_DB_INIT } from '../data/sql-sample-db';

type SqlJsState = 'idle' | 'loading' | 'ready' | 'error';

export interface SqlResult {
  columns: string[];
  rows: any[][];
}

export interface SqlExecResult {
  results: SqlResult[];
  rowsModified: number;
  error: string | null;
}

interface SqlJsContextType {
  load: () => Promise<any>;
  dbRef: React.MutableRefObject<any>;
  stateRef: React.MutableRefObject<SqlJsState>;
  progressRef: React.MutableRefObject<string>;
  subscribe: (cb: () => void) => () => void;
}

const SqlJsContext = createContext<SqlJsContextType | undefined>(undefined);

const SQL_JS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3';

export function SqlJsProvider({ children }: { children: ReactNode }) {
  const dbRef = useRef<any>(null);
  const stateRef = useRef<SqlJsState>('idle');
  const progressRef = useRef('');
  const loadingRef = useRef(false);
  const loadPromiseRef = useRef<Promise<any> | null>(null);
  const listenersRef = useRef<Set<() => void>>(new Set());

  const notify = useCallback(() => {
    listenersRef.current.forEach(cb => cb());
  }, []);

  const subscribe = useCallback((cb: () => void) => {
    listenersRef.current.add(cb);
    return () => { listenersRef.current.delete(cb); };
  }, []);

  const load = useCallback(async () => {
    if (dbRef.current) return dbRef.current;
    if (loadingRef.current && loadPromiseRef.current) return loadPromiseRef.current;

    loadingRef.current = true;
    stateRef.current = 'loading';
    progressRef.current = 'Loading SQL engine...';
    notify();

    const promise = (async () => {
      try {
        // Load sql.js from CDN
        if (!(window as any).initSqlJs) {
          const script = document.createElement('script');
          script.src = `${SQL_JS_CDN}/sql-wasm.js`;
          document.head.appendChild(script);
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load sql.js'));
          });
        }

        progressRef.current = 'Initializing database...';
        notify();

        const SQL = await (window as any).initSqlJs({
          locateFile: (file: string) => `${SQL_JS_CDN}/${file}`,
        });

        const db = new SQL.Database();

        // Set up sample database
        progressRef.current = 'Loading sample data...';
        notify();
        db.run(SQL_SAMPLE_DB_INIT);

        dbRef.current = db;
        stateRef.current = 'ready';
        progressRef.current = '';
        loadingRef.current = false;
        notify();
        return db;
      } catch (err: any) {
        stateRef.current = 'error';
        progressRef.current = `Error: ${err.message}`;
        loadingRef.current = false;
        notify();
        return null;
      }
    })();

    loadPromiseRef.current = promise;
    return promise;
  }, [notify]);

  const value = useMemo<SqlJsContextType>(
    () => ({ load, dbRef, stateRef, progressRef, subscribe }),
    [load, subscribe],
  );

  return (
    <SqlJsContext.Provider value={value}>
      {children}
    </SqlJsContext.Provider>
  );
}

/**
 * Hook for components that need the SQL database.
 * Only subscribing components re-render on state changes.
 */
export function useSqlJs() {
  const ctx = useContext(SqlJsContext);
  if (!ctx) throw new Error('useSqlJs must be used within SqlJsProvider');

  const { load, dbRef, stateRef, progressRef, subscribe } = ctx;
  const [, setTick] = useState(0);

  useEffect(() => {
    return subscribe(() => setTick(n => n + 1));
  }, [subscribe]);

  const runSql = useCallback((sql: string): SqlExecResult => {
    const db = dbRef.current;
    if (!db) return { results: [], rowsModified: 0, error: 'Database not loaded' };

    try {
      const raw = db.exec(sql);
      const results: SqlResult[] = raw.map((r: any) => ({
        columns: r.columns,
        rows: r.values,
      }));
      const rowsModified = db.getRowsModified();
      return { results, rowsModified, error: null };
    } catch (err: any) {
      return { results: [], rowsModified: 0, error: err.message };
    }
  }, [dbRef]);

  const resetDb = useCallback(() => {
    const db = dbRef.current;
    if (!db) return;
    // Disable FK checks, drop all tables, re-init
    db.run("PRAGMA foreign_keys = OFF");
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    if (tables.length > 0) {
      for (const row of tables[0].values) {
        db.run(`DROP TABLE IF EXISTS "${row[0]}"`);
      }
    }
    db.run(SQL_SAMPLE_DB_INIT);
  }, [dbRef]);

  return {
    db: dbRef.current,
    state: stateRef.current,
    loadProgress: progressRef.current,
    ready: stateRef.current === 'ready',
    load,
    runSql,
    resetDb,
  };
}
