import { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Code2 } from 'lucide-react';

interface HtmlPlaygroundProps {
  /** Initial HTML code */
  starterCode: string;
  /** Title above the playground */
  title?: string;
  /** Height of the preview iframe */
  previewHeight?: number;
}

export default function HtmlPlayground({
  starterCode,
  title = 'HTML Playground',
  previewHeight = 300,
}: HtmlPlaygroundProps) {
  const [code, setCode] = useState(starterCode);
  const [preview, setPreview] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-render on code change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreview(code);
    }, 500);
    return () => clearTimeout(timer);
  }, [code]);

  // Also render immediately on first load
  useEffect(() => {
    setPreview(starterCode);
  }, [starterCode]);

  const lineCount = code.split('\n').length;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2; }, 0);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-violet-400" />
          <h3 className="text-white font-bold text-sm">{title}</h3>
          <span className="text-xs text-violet-400 bg-violet-900/30 px-2 py-0.5 rounded-full">Live Preview</span>
        </div>
        <button
          onClick={() => { setCode(starterCode); setPreview(starterCode); }}
          className="p-1.5 text-gray-400 hover:text-white transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Editor + Preview split */}
      <div className="flex flex-col lg:flex-row">
        {/* Code editor */}
        <div className="flex-1 min-w-0 border-b lg:border-b-0 lg:border-r border-gray-700">
          <div className="flex max-h-[400px] overflow-y-auto">
            {/* Line numbers */}
            <div className="flex-shrink-0 pt-3 pb-3 pr-2 pl-3 select-none border-r border-gray-700" aria-hidden>
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i} className="leading-6 text-xs font-mono text-gray-600">{i + 1}</div>
              ))}
            </div>
            {/* Editor */}
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                rows={lineCount}
                className="w-full bg-transparent text-gray-100 font-mono text-sm pl-3 pr-4 py-3 resize-none focus:outline-none leading-6"
                style={{ tabSize: 2 }}
              />
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="flex-1 min-w-0 bg-white" style={{ minHeight: previewHeight }}>
          <iframe
            ref={iframeRef}
            srcDoc={preview}
            title="Preview"
            sandbox="allow-scripts"
            className="w-full border-0"
            style={{ height: previewHeight }}
          />
        </div>
      </div>
    </div>
  );
}
