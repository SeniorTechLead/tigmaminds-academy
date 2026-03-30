import { useState, useCallback, useEffect, useRef, cloneElement, isValidElement, type ReactNode, type ReactElement } from 'react';

interface DiagramZoomProps {
  children: ReactNode;
}

export default function DiagramZoom({ children }: DiagramZoomProps) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setScale(1);
  }, []);

  const zoomIn = useCallback(() => setScale(s => Math.min(s + 0.25, 3)), []);
  const zoomOut = useCallback(() => setScale(s => Math.max(s - 0.25, 0.5)), []);

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
      {/* Inline diagram — always visible */}
      <div
        className="relative cursor-zoom-in group"
        onClick={() => setOpen(true)}
        title="Click to enlarge"
      >
        {children}
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
        {/* Zoom icon hint */}
        <div className="absolute top-2 right-2 bg-slate-800/70 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
      </div>

      {/* Modal with zoomable copy */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950" onClick={close}>
          {/* Close button — top right */}
          <button
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-lg"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Diagram area */}
          <div
            ref={containerRef}
            className="flex-1 overflow-auto flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onWheel={onWheel}
          >
            <div
              className="relative m-auto p-6 w-[80vw] max-w-4xl [&_>_*]:!max-w-none"
              style={{ transform: `scale(${scale})`, transformOrigin: 'center center', transition: 'transform 0.15s ease' }}
            >
              {/* Render a second copy of the diagram for the modal */}
              {isValidElement(children) ? cloneElement(children as ReactElement) : children}

              {/* Watermark on top of diagram */}
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

          {/* Zoom controls — bottom center */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-slate-800/90 border border-slate-700 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={zoomOut} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-700 text-slate-200 text-lg font-bold" aria-label="Zoom out">−</button>
            <span className="text-slate-300 text-sm font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={zoomIn} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-700 text-slate-200 text-lg font-bold" aria-label="Zoom in">+</button>
            <div className="w-px h-5 bg-slate-600" />
            <button onClick={() => setScale(1)} className="px-2 h-8 flex items-center justify-center rounded-full hover:bg-slate-700 text-slate-400 text-xs">Reset</button>
          </div>
        </div>
      )}
    </>
  );
}
