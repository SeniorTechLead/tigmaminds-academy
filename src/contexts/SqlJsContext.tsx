import { createContext, useContext, useRef, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { SQL_SAMPLE_DB_INIT } from '../data/sql-sample-db';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

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
  /** Persist the current DB to the server for the signed-in user (debounced). No-op if logged out. */
  scheduleServerSave: () => void;
  /** Delete the signed-in user's server-side workspace (used on Reset). */
  clearServerSave: () => void;
}

const SqlJsContext = createContext<SqlJsContextType | undefined>(undefined);

const SQL_JS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3';

// Persistence: the user's working database (including any tables they CREATE) is
// saved to localStorage as the sql.js binary export, so their schema and data
// survive page reloads. The Reset button clears this and restores sample data.
const DB_STORAGE_KEY = 'tma_sql_db_v1';
// Don't sync workspaces larger than this to the server (base64 adds ~33% on top).
const MAX_SERVER_BYTES = 2 * 1024 * 1024; // 2 MB raw
const SERVER_SAVE_DEBOUNCE_MS = 2500;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk) as any);
  }
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function saveDbBlob(db: any) {
  try {
    localStorage.setItem(DB_STORAGE_KEY, bytesToBase64(db.export() as Uint8Array));
  } catch {
    // Quota exceeded or export failed — non-fatal; the in-memory DB still works.
  }
}

function loadDbBlob(): Uint8Array | null {
  try {
    const b64 = localStorage.getItem(DB_STORAGE_KEY);
    return b64 ? base64ToBytes(b64) : null;
  } catch {
    return null;
  }
}

function clearDbBlob() {
  try { localStorage.removeItem(DB_STORAGE_KEY); } catch { /* ignore */ }
}

// ── Server-side persistence (signed-in users, across devices/sessions) ──
// Stores the same base64 export in the per-user `sql_workspaces` row (RLS-guarded).
// Fails silently if the table doesn't exist yet or the user is offline — the
// localStorage copy and in-memory DB remain the source of truth.
async function saveDbToServer(userId: string, db: any) {
  try {
    const bytes: Uint8Array = db.export();
    if (bytes.length > MAX_SERVER_BYTES) return; // too big — keep local-only
    const b64 = bytesToBase64(bytes);
    await supabase.from('sql_workspaces').upsert({
      user_id: userId,
      db_blob: b64,
      byte_size: bytes.length,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  } catch {
    /* table missing / offline / RLS — non-fatal */
  }
}

async function loadDbFromServer(userId: string): Promise<Uint8Array | null> {
  try {
    const { data, error } = await supabase
      .from('sql_workspaces')
      .select('db_blob')
      .eq('user_id', userId)
      .maybeSingle();
    if (error || !data?.db_blob) return null;
    return base64ToBytes(data.db_blob as string);
  } catch {
    return null;
  }
}

export function SqlJsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const dbRef = useRef<any>(null);
  const sqlModuleRef = useRef<any>(null); // the initSqlJs module, for rebuilding the DB
  const stateRef = useRef<SqlJsState>('idle');
  const progressRef = useRef('');
  const loadingRef = useRef(false);
  const loadPromiseRef = useRef<Promise<any> | null>(null);
  const listenersRef = useRef<Set<() => void>>(new Set());
  const userIdRef = useRef<string | null>(null);
  const serverSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoredUserRef = useRef<string | null>(null); // which user we've already restored from server

  userIdRef.current = user?.id ?? null;

  // Debounced server save — coalesces rapid edits into one upsert.
  const scheduleServerSave = useCallback(() => {
    const uid = userIdRef.current;
    if (!uid || !dbRef.current) return;
    if (serverSaveTimer.current) clearTimeout(serverSaveTimer.current);
    serverSaveTimer.current = setTimeout(() => {
      if (userIdRef.current && dbRef.current) saveDbToServer(userIdRef.current, dbRef.current);
    }, SERVER_SAVE_DEBOUNCE_MS);
  }, []);

  const clearServerSave = useCallback(() => {
    const uid = userIdRef.current;
    if (serverSaveTimer.current) { clearTimeout(serverSaveTimer.current); serverSaveTimer.current = null; }
    if (uid) supabase.from('sql_workspaces').delete().eq('user_id', uid).then(() => {}, () => {});
  }, []);

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
        sqlModuleRef.current = SQL;

        // Restore the user's saved database if one exists; otherwise seed sample data.
        const saved = loadDbBlob();
        let db: any;
        if (saved) {
          progressRef.current = 'Restoring your database...';
          notify();
          try {
            db = new SQL.Database(saved);
          } catch {
            db = new SQL.Database();
            db.run(SQL_SAMPLE_DB_INIT);
          }
        } else {
          progressRef.current = 'Loading sample data...';
          notify();
          db = new SQL.Database();
          db.run(SQL_SAMPLE_DB_INIT);
        }

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

  // Server-wins-on-login: when a user signs in, load their server workspace (if any)
  // into the live DB, replacing the local copy. Runs once per user id.
  useEffect(() => {
    const uid = user?.id;
    if (!uid) { restoredUserRef.current = null; return; }
    if (restoredUserRef.current === uid) return;
    restoredUserRef.current = uid;
    let active = true;
    (async () => {
      const serverBytes = await loadDbFromServer(uid);
      if (!active || !serverBytes) return; // no server copy → keep current (local) DB
      const SQL = sqlModuleRef.current ?? (dbRef.current ? null : await load().then(() => sqlModuleRef.current));
      const mod = sqlModuleRef.current ?? SQL;
      if (!active || !mod) return;
      try {
        const newDb = new mod.Database(serverBytes);
        dbRef.current = newDb;
        saveDbBlob(newDb);        // mirror server copy into localStorage
        stateRef.current = 'ready';
        notify();                  // tell consumers to re-render with restored DB
      } catch {
        /* corrupt server blob — keep current DB */
      }
    })();
    return () => { active = false; };
  }, [user?.id, load, notify]);

  const value = useMemo<SqlJsContextType>(
    () => ({ load, dbRef, stateRef, progressRef, subscribe, scheduleServerSave, clearServerSave }),
    [load, subscribe, scheduleServerSave, clearServerSave],
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

  const { load, dbRef, stateRef, progressRef, subscribe, scheduleServerSave, clearServerSave } = ctx;
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

      // Persist if the statement changed data (INSERT/UPDATE/DELETE) or the schema
      // (CREATE/DROP/ALTER). DDL doesn't bump getRowsModified, so detect it by keyword.
      const isDDL = /\b(create|drop|alter|truncate|rename)\b/i.test(sql);
      if (rowsModified > 0 || isDDL) {
        saveDbBlob(db);            // local (every device)
        scheduleServerSave();      // server (signed-in users, debounced)
      }

      return { results, rowsModified, error: null };
    } catch (err: any) {
      return { results: [], rowsModified: 0, error: err.message };
    }
  }, [dbRef, scheduleServerSave]);

  const resetDb = useCallback(() => {
    const db = dbRef.current;
    if (!db) return;
    // Disable FK checks, drop all tables (including any the user created), re-init
    db.run("PRAGMA foreign_keys = OFF");
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    if (tables.length > 0) {
      for (const row of tables[0].values) {
        db.run(`DROP TABLE IF EXISTS "${row[0]}"`);
      }
    }
    db.run(SQL_SAMPLE_DB_INIT);
    // Forget the persisted user database (local + server) so a reload starts fresh.
    clearDbBlob();
    clearServerSave();
  }, [dbRef, clearServerSave]);

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
