import { createContext, useContext, useRef, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';

type PyodideState = 'idle' | 'loading' | 'ready' | 'error';

interface PyodideContextType {
  load: () => Promise<any>;
  pyodideRef: React.MutableRefObject<any>;
  stateRef: React.MutableRefObject<PyodideState>;
  progressRef: React.MutableRefObject<string>;
  subscribe: (cb: () => void) => () => void;
}

const PyodideContext = createContext<PyodideContextType | undefined>(undefined);

const PYODIDE_VERSION = '0.24.1';
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full`;

export function PyodideProvider({ children }: { children: ReactNode }) {
  const pyodideRef = useRef<any>(null);
  const stateRef = useRef<PyodideState>('idle');
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
    if (pyodideRef.current) return pyodideRef.current;
    if (loadingRef.current && loadPromiseRef.current) return loadPromiseRef.current;

    loadingRef.current = true;
    stateRef.current = 'loading';
    progressRef.current = 'Loading Python runtime...';
    notify();

    const promise = (async () => {
      try {
        if (!(window as any).loadPyodide) {
          const script = document.createElement('script');
          script.src = `${PYODIDE_CDN}/pyodide.js`;
          document.head.appendChild(script);
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Pyodide'));
          });
        }

        progressRef.current = 'Starting Python...';
        notify();
        const pyodide = await (window as any).loadPyodide({ indexURL: `${PYODIDE_CDN}/` });

        progressRef.current = 'Installing packages...';
        notify();
        await pyodide.loadPackage('micropip');
        const micropip = pyodide.pyimport('micropip');
        for (const pkg of ['numpy', 'matplotlib']) {
          try { await micropip.install(pkg); }
          catch { await pyodide.loadPackage(pkg).catch(() => {}); }
        }

        progressRef.current = 'Configuring environment...';
        notify();
        await pyodide.runPythonAsync([
          "import sys, io",
          "class _OutputCapture:",
          "    def __init__(self): self.output = []",
          "    def write(self, text): self.output.append(text)",
          "    def flush(self): pass",
          "    def get_output(self): return ''.join(self.output)",
          "    def clear(self): self.output = []",
          "_stdout_capture = _OutputCapture()",
          "sys.stdout = _stdout_capture",
          "sys.stderr = _stdout_capture",
          "_out = _stdout_capture",
          "_out.get = _out.get_output",
        ].join('\n'));

        await pyodide.runPythonAsync([
          "import matplotlib",
          "matplotlib.use('AGG')",
          "import warnings",
          "warnings.filterwarnings('ignore', category=UserWarning)",
          "import matplotlib.pyplot as plt",
          "import base64",
          "def _get_plot_as_base64():",
          "    buf = io.BytesIO()",
          "    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')",
          "    buf.seek(0)",
          "    img_str = base64.b64encode(buf.read()).decode('utf-8')",
          "    plt.close('all')",
          "    return img_str",
        ].join('\n'));

        pyodideRef.current = pyodide;
        stateRef.current = 'ready';
        progressRef.current = '';
        loadingRef.current = false;
        notify();
        return pyodide;
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

  const value = useMemo<PyodideContextType>(
    () => ({ load, pyodideRef, stateRef, progressRef, subscribe }),
    [load, subscribe],
  );

  return (
    <PyodideContext.Provider value={value}>
      {children}
    </PyodideContext.Provider>
  );
}

/**
 * Hook for components that need Pyodide.
 * Only components that call usePyodide() re-render on state changes —
 * the rest of the app is unaffected.
 */
export function usePyodide() {
  const ctx = useContext(PyodideContext);
  if (!ctx) throw new Error('usePyodide must be used within PyodideProvider');

  const { load, pyodideRef, stateRef, progressRef, subscribe } = ctx;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    return subscribe(() => setTick(n => n + 1));
  }, [subscribe]);

  return {
    pyodide: pyodideRef.current,
    state: stateRef.current,
    loadProgress: progressRef.current,
    ready: stateRef.current === 'ready',
    load,
    pyodideRef,
  };
}
