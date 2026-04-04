import { createContext, useContext, useRef, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';

type TsState = 'idle' | 'loading' | 'ready' | 'error';

export interface TsRunResult {
  output: string;
  error: string | null;
  compileErrors: string[];
}

interface TsContextType {
  load: () => Promise<any>;
  tsRef: React.MutableRefObject<any>;
  stateRef: React.MutableRefObject<TsState>;
  progressRef: React.MutableRefObject<string>;
  subscribe: (cb: () => void) => () => void;
}

const TsContext = createContext<TsContextType | undefined>(undefined);

const TS_CDN = 'https://cdn.jsdelivr.net/npm/typescript@5.5.3/lib/typescript.min.js';

export function TsProvider({ children }: { children: ReactNode }) {
  const tsRef = useRef<any>(null);
  const stateRef = useRef<TsState>('idle');
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
    if (tsRef.current) return tsRef.current;
    if (loadingRef.current && loadPromiseRef.current) return loadPromiseRef.current;

    loadingRef.current = true;
    stateRef.current = 'loading';
    progressRef.current = 'Loading TypeScript compiler...';
    notify();

    const promise = (async () => {
      try {
        if (!(window as any).ts) {
          const script = document.createElement('script');
          script.src = TS_CDN;
          document.head.appendChild(script);
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load TypeScript compiler'));
          });
        }

        const ts = (window as any).ts;
        if (!ts) throw new Error('TypeScript compiler not found on window');

        tsRef.current = ts;
        stateRef.current = 'ready';
        progressRef.current = '';
        loadingRef.current = false;
        notify();
        return ts;
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

  const value = useMemo<TsContextType>(
    () => ({ load, tsRef, stateRef, progressRef, subscribe }),
    [load, subscribe],
  );

  return (
    <TsContext.Provider value={value}>
      {children}
    </TsContext.Provider>
  );
}

/**
 * Hook for components that need the TypeScript compiler.
 * Compiles TS to JS, runs the JS, captures console output.
 */
export function useTs() {
  const ctx = useContext(TsContext);
  if (!ctx) throw new Error('useTs must be used within TsProvider');

  const { load, tsRef, stateRef, progressRef, subscribe } = ctx;
  const [, setTick] = useState(0);

  useEffect(() => {
    return subscribe(() => setTick(n => n + 1));
  }, [subscribe]);

  const runTs = useCallback((code: string): TsRunResult => {
    const ts = tsRef.current;
    if (!ts) return { output: '', error: 'TypeScript compiler not loaded', compileErrors: [] };

    // Compile TS → JS
    const compileErrors: string[] = [];
    let jsCode: string;

    try {
      const result = ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.None,
          strict: true,
          noEmitOnError: false,
          esModuleInterop: true,
        },
        reportDiagnostics: true,
      });

      // Collect compile diagnostics
      if (result.diagnostics && result.diagnostics.length > 0) {
        for (const diag of result.diagnostics) {
          const msg = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
          const line = diag.file
            ? diag.file.getLineAndCharacterOfPosition(diag.start).line + 1
            : null;
          compileErrors.push(line ? `Line ${line}: ${msg}` : msg);
        }
      }

      jsCode = result.outputText;
    } catch (err: any) {
      return { output: '', error: `Compile error: ${err.message}`, compileErrors: [] };
    }

    // Run the compiled JS with captured console.log
    const outputLines: string[] = [];
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    try {
      console.log = (...args: any[]) => {
        outputLines.push(args.map(a =>
          typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
        ).join(' '));
      };
      console.warn = console.log;
      console.error = console.log;

      // eslint-disable-next-line no-new-func
      const fn = new Function(jsCode);
      fn();

      return { output: outputLines.join('\n'), error: null, compileErrors };
    } catch (err: any) {
      return {
        output: outputLines.join('\n'),
        error: `Runtime error: ${err.message}`,
        compileErrors,
      };
    } finally {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    }
  }, [tsRef]);

  return {
    ts: tsRef.current,
    state: stateRef.current,
    loadProgress: progressRef.current,
    ready: stateRef.current === 'ready',
    load,
    runTs,
  };
}
