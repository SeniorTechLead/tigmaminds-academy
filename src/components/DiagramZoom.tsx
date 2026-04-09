import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';

interface DiagramZoomProps {
  children: ReactNode;
}

/**
 * Wraps a diagram with click-to-zoom. When zoomed, the SAME DOM element
 * is reparented into a fullscreen modal so interactive state is preserved.
 */
export default function DiagramZoom({ children }: DiagramZoomProps) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const diagramRef = useRef<HTMLDivElement>(null);
  const inlinePlaceholderRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setScale(1);
  }, []);

  const zoomIn = useCallback(() => setScale(s => Math.min(s + 0.25, 3)), []);
  const zoomOut = useCallback(() => setScale(s => Math.max(s - 0.25, 0.5)), []);

  // Move the diagram DOM node between inline and modal
  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;

    if (open && modalContentRef.current) {
      // Move diagram into the modal
      modalContentRef.current.prepend(diagram);
    } else if (!open && inlinePlaceholderRef.current) {
      // Move diagram back to inline position
      inlinePlaceholderRef.current.prepend(diagram);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, zoomIn, zoomOut]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  }, [zoomIn, zoomOut]);

  return (
    <>
      {/* Inline wrapper */}
      <div
        className="relative group"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('button, input, select, textarea, a, [role="button"], [tabindex]')) return;
          setOpen(true);
        }}
        title="Click to enlarge"
      >
        {/* Placeholder — diagram lives here when not zoomed */}
        <div ref={inlinePlaceholderRef}>
          <div ref={diagramRef}>
            {children}
          </div>
        </div>

        {/* Inline watermark */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
          <div className="absolute inset-[-50%] flex flex-wrap gap-32 items-center justify-center" style={{ transform: 'rotate(-25deg)' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="text-gray-500/[0.15] text-sm font-bold whitespace-nowrap tracking-widest">
                tigmaminds.com
              </span>
            ))}
          </div>
        </div>

        {/* Zoom icon */}
        <button
          onClick={(e) => { e.stopPropagation(); setOpen(true); }}
          className="absolute top-2 right-2 bg-slate-800/70 hover:bg-slate-700/90 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-zoom-in"
          title="Click to enlarge"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
      </div>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-950" onClick={close}>
          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-lg"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Diagram area — the real DOM node gets moved here */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onWheel={onWheel}
          >
            <div
              ref={modalContentRef}
              className="relative m-auto p-6 w-[80vw] max-w-4xl [&_>_*]:!max-w-none"
              style={{ transform: `scale(${scale})`, transformOrigin: 'center center', transition: 'transform 0.15s ease' }}
            >
              {/* diagram node gets moved here by the useEffect */}

              {/* Watermark */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
                <div className="absolute inset-[-50%] flex flex-wrap gap-40 items-center justify-center" style={{ transform: 'rotate(-25deg)' }}>
                  {Array.from({ length: 16 }).map((_, i) => (
                    <span key={i} className="text-gray-500/[0.2] text-xl font-bold whitespace-nowrap tracking-widest">
                      tigmaminds.com
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Zoom controls */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100/90 dark:bg-slate-800/90 border border-gray-300 dark:border-slate-700 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={zoomOut} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 text-lg font-bold" aria-label="Zoom out">−</button>
            <span className="text-gray-600 dark:text-slate-300 text-sm font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={zoomIn} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 text-lg font-bold" aria-label="Zoom in">+</button>
            <div className="w-px h-5 bg-gray-300 dark:bg-slate-600" />
            <button onClick={() => setScale(1)} className="px-2 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 text-xs">Reset</button>
          </div>
        </div>
      )}
    </>
  );
}
