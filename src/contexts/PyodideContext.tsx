import { createContext, useContext, useRef, useState, useCallback, ReactNode } from 'react';

type PyodideState = 'idle' | 'loading' | 'ready' | 'error';

interface PyodideContextType {
  /** The shared Pyodide instance (null until loaded) */
  pyodide: any;
  /** Current loading state */
  state: PyodideState;
  /** Human-readable loading progress message */
  loadProgress: string;
  /** True when Pyodide is ready to run code */
  ready: boolean;
  /** Load Pyodide if not already loaded. Returns the instance. */
  load: () => Promise<any>;
  /** Ref to the Pyodide instance (for legacy prop-drilling compatibility) */
  pyodideRef: React.MutableRefObject<any>;
}

const PyodideContext = createContext<PyodideContextType | undefined>(undefined);

const PYODIDE_VERSION = '0.24.1';
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full`;

export function PyodideProvider({ children }: { children: ReactNode }) {
  const pyodideRef = useRef<any>(null);
  const loadingRef = useRef(false);
  const loadPromiseRef = useRef<Promise<any> | null>(null);
  const [state, setState] = useState<PyodideState>('idle');
  const [loadProgress, setLoadProgress] = useState('');

  const load = useCallback(async () => {
    // Already loaded — return immediately
    if (pyodideRef.current) return pyodideRef.current;

    // Another call is already loading — wait for it
    if (loadingRef.current && loadPromiseRef.current) {
      return loadPromiseRef.current;
    }

    loadingRef.current = true;
    setState('loading');

    const promise = (async () => {
      try {
        // 1. Load Pyodide script from CDN (if not already on window)
        if (!(window as any).loadPyodide) {
          setLoadProgress('Loading Python runtime...');
          const script = document.createElement('script');
          script.src = `${PYODIDE_CDN}/pyodide.js`;
          document.head.appendChild(script);
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Pyodide'));
          });
        }

        // 2. Initialize Pyodide
        setLoadProgress('Starting Python...');
        const pyodide = await (window as any).loadPyodide({
          indexURL: `${PYODIDE_CDN}/`,
        });

        // 3. Install packages
        setLoadProgress('Installing packages...');
        await pyodide.loadPackage('micropip');
        const micropip = pyodide.pyimport('micropip');
        for (const pkg of ['numpy', 'matplotlib']) {
          try {
            await micropip.install(pkg);
          } catch {
            await pyodide.loadPackage(pkg).catch(() => {});
          }
        }

        // 4. Set up stdout/stderr capture + matplotlib
        setLoadProgress('Configuring environment...');
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
          "# Alias for PlaygroundPage compatibility",
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
        setState('ready');
        setLoadProgress('');
        loadingRef.current = false;
        return pyodide;
      } catch (err: any) {
        setState('error');
        setLoadProgress(`Error: ${err.message}`);
        loadingRef.current = false;
        return null;
      }
    })();

    loadPromiseRef.current = promise;
    return promise;
  }, []);

  return (
    <PyodideContext.Provider
      value={{
        pyodide: pyodideRef.current,
        state,
        loadProgress,
        ready: state === 'ready',
        load,
        pyodideRef,
      }}
    >
      {children}
    </PyodideContext.Provider>
  );
}

export function usePyodide() {
  const ctx = useContext(PyodideContext);
  if (!ctx) throw new Error('usePyodide must be used within PyodideProvider');
  return ctx;
}
