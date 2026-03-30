import { useState } from "react";

const layers = [
  {
    id: "margin",
    label: "Margin",
    css: "margin: 20px",
    description:
      "The outermost space that separates this element from its neighbors. Margin is transparent — it just pushes other elements away.",
  },
  {
    id: "border",
    label: "Border",
    css: "border: 3px solid",
    description:
      "A visible line around the element. It sits between padding and margin and can have its own color, style, and width.",
  },
  {
    id: "padding",
    label: "Padding",
    css: "padding: 16px",
    description:
      "The breathing room between the content and the border. Padding has a background color (same as the element) so it is not transparent like margin.",
  },
  {
    id: "content",
    label: "Content",
    css: "200 × 100",
    description:
      "The actual stuff inside — text, images, or child elements. The width and height you set in CSS usually apply to this box (unless you use box-sizing: border-box).",
  },
] as const;

type LayerId = (typeof layers)[number]["id"];

export default function CSSBoxModelDiagram() {
  const [active, setActive] = useState<LayerId | null>(null);

  const activeLayer = layers.find((l) => l.id === active) ?? null;

  /* Geometry (in SVG units) */
  const cx = 250;
  const cy = 155;
  const contentW = 200;
  const contentH = 100;
  const pad = 16;
  const bdr = 3;
  const mar = 20;

  /* Rectangles from outside-in */
  const marginRect = {
    x: cx - contentW / 2 - pad - bdr - mar,
    y: cy - contentH / 2 - pad - bdr - mar,
    w: contentW + 2 * (pad + bdr + mar),
    h: contentH + 2 * (pad + bdr + mar),
  };
  const borderRect = {
    x: cx - contentW / 2 - pad - bdr,
    y: cy - contentH / 2 - pad - bdr,
    w: contentW + 2 * (pad + bdr),
    h: contentH + 2 * (pad + bdr),
  };
  const paddingRect = {
    x: cx - contentW / 2 - pad,
    y: cy - contentH / 2 - pad,
    w: contentW + 2 * pad,
    h: contentH + 2 * pad,
  };
  const contentRect = {
    x: cx - contentW / 2,
    y: cy - contentH / 2,
    w: contentW,
    h: contentH,
  };

  const highlight = (id: LayerId) =>
    active === id ? "brightness(1.25)" : "none";

  return (
    <div className="w-full max-w-lg mx-auto my-6 select-none">
      <svg
        viewBox="0 0 525 367"
        className="w-full"
        role="img"
        aria-label="CSS Box Model diagram showing margin, border, padding, and content layers"
      >
        {/* ── Margin (dashed outline) ── */}
        <rect
          x={marginRect.x}
          y={marginRect.y}
          width={marginRect.w}
          height={marginRect.h}
          rx="4"
          className="fill-transparent stroke-gray-400 dark:stroke-gray-500 cursor-pointer"
          strokeWidth="2"
          strokeDasharray="6 4"
          filter={highlight("margin")}
          onClick={() => setActive(active === "margin" ? null : "margin")}
        />
        {/* margin label */}
        <text
          x={marginRect.x + 6}
          y={marginRect.y + 14}
          fontSize="10"
          className="fill-gray-500 dark:fill-gray-400 pointer-events-none"
          fontFamily="monospace"
        >
          margin: 20px
        </text>

        {/* ── Border (solid dark) ── */}
        <rect
          x={borderRect.x}
          y={borderRect.y}
          width={borderRect.w}
          height={borderRect.h}
          rx="3"
          className="fill-yellow-200/60 dark:fill-yellow-800/30 stroke-gray-700 dark:stroke-gray-300 cursor-pointer"
          strokeWidth="3"
          filter={highlight("border")}
          onClick={() => setActive(active === "border" ? null : "border")}
        />
        <text
          x={borderRect.x + 6}
          y={borderRect.y + 14}
          fontSize="10"
          className="fill-gray-600 dark:fill-gray-300 pointer-events-none"
          fontFamily="monospace"
        >
          border: 3px solid
        </text>

        {/* ── Padding (light blue) ── */}
        <rect
          x={paddingRect.x}
          y={paddingRect.y}
          width={paddingRect.w}
          height={paddingRect.h}
          rx="2"
          className="fill-sky-200/70 dark:fill-sky-800/40 stroke-sky-400 dark:stroke-sky-600 cursor-pointer"
          strokeWidth="1.5"
          filter={highlight("padding")}
          onClick={() => setActive(active === "padding" ? null : "padding")}
        />
        <text
          x={paddingRect.x + 6}
          y={paddingRect.y + 14}
          fontSize="10"
          className="fill-sky-700 dark:fill-sky-300 pointer-events-none"
          fontFamily="monospace"
        >
          padding: 16px
        </text>

        {/* ── Content (darker blue) ── */}
        <rect
          x={contentRect.x}
          y={contentRect.y}
          width={contentRect.w}
          height={contentRect.h}
          rx="2"
          className="fill-blue-300/80 dark:fill-blue-700/50 stroke-blue-500 dark:stroke-blue-400 cursor-pointer"
          strokeWidth="1.5"
          filter={highlight("content")}
          onClick={() => setActive(active === "content" ? null : "content")}
        />
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
          className="fill-blue-900 dark:fill-blue-100 pointer-events-none"
          fontFamily="monospace"
        >
          content
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fontSize="11"
          className="fill-blue-700 dark:fill-blue-200 pointer-events-none"
          fontFamily="monospace"
        >
          200 × 100
        </text>

        {/* ── Dimension lines (right side) ── */}
        {/* Content height */}
        <line
          x1={contentRect.x + contentRect.w + 8}
          y1={contentRect.y}
          x2={contentRect.x + contentRect.w + 8}
          y2={contentRect.y + contentRect.h}
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="1"
          markerStart="url(#arrowUp)"
          markerEnd="url(#arrowDown)"
        />
        <text
          x={contentRect.x + contentRect.w + 14}
          y={cy + 4}
          fontSize="9"
          className="fill-blue-600 dark:fill-blue-300"
          fontFamily="monospace"
        >
          100
        </text>

        {/* Padding width (top) */}
        <line
          x1={paddingRect.x}
          y1={paddingRect.y - 6}
          x2={contentRect.x}
          y2={paddingRect.y - 6}
          className="stroke-sky-500 dark:stroke-sky-400"
          strokeWidth="1"
          markerStart="url(#arrowLeft)"
          markerEnd="url(#arrowRight)"
        />
        <text
          x={(paddingRect.x + contentRect.x) / 2}
          y={paddingRect.y - 10}
          textAnchor="middle"
          fontSize="9"
          className="fill-sky-600 dark:fill-sky-300"
          fontFamily="monospace"
        >
          16
        </text>

        {/* Border width indicator (top-right corner) */}
        <line
          x1={borderRect.x + borderRect.w + 4}
          y1={borderRect.y}
          x2={borderRect.x + borderRect.w + 4}
          y2={paddingRect.y}
          className="stroke-gray-600 dark:stroke-gray-300"
          strokeWidth="1"
          markerStart="url(#arrowUp)"
          markerEnd="url(#arrowDown)"
        />
        <text
          x={borderRect.x + borderRect.w + 10}
          y={(borderRect.y + paddingRect.y) / 2 + 3}
          fontSize="9"
          className="fill-gray-600 dark:fill-gray-300"
          fontFamily="monospace"
        >
          3
        </text>

        {/* Margin width (bottom) */}
        <line
          x1={marginRect.x}
          y1={marginRect.y + marginRect.h + 8}
          x2={borderRect.x}
          y2={marginRect.y + marginRect.h + 8}
          className="stroke-gray-400 dark:stroke-gray-500"
          strokeWidth="1"
          markerStart="url(#arrowLeft)"
          markerEnd="url(#arrowRight)"
        />
        <text
          x={(marginRect.x + borderRect.x) / 2}
          y={marginRect.y + marginRect.h + 20}
          textAnchor="middle"
          fontSize="9"
          className="fill-gray-500 dark:fill-gray-400"
          fontFamily="monospace"
        >
          20
        </text>

        {/* Total width calculation */}
        <text
          x={cx}
          y={330}
          textAnchor="middle"
          fontSize="11"
          className="fill-gray-600 dark:fill-gray-300"
          fontFamily="monospace"
        >
          Total width = 200 + 16×2 + 3×2 + 20×2 = 278px
        </text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto">
            <path d="M1,6 L3,1 L5,6" className="fill-none stroke-current" strokeWidth="1" />
          </marker>
          <marker id="arrowDown" markerWidth="6" markerHeight="6" refX="3" refY="0" orient="auto">
            <path d="M1,0 L3,5 L5,0" className="fill-none stroke-current" strokeWidth="1" />
          </marker>
          <marker id="arrowLeft" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
            <path d="M6,1 L1,3 L6,5" className="fill-none stroke-current" strokeWidth="1" />
          </marker>
          <marker id="arrowRight" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
            <path d="M0,1 L5,3 L0,5" className="fill-none stroke-current" strokeWidth="1" />
          </marker>
        </defs>
      </svg>

      {/* Tooltip / explanation */}
      <div
        className={`mt-2 rounded-lg border px-4 py-3 text-sm transition-all duration-200 ${
          activeLayer
            ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40 opacity-100"
            : "border-transparent opacity-0 pointer-events-none"
        }`}
        aria-live="polite"
      >
        {activeLayer && (
          <>
            <span className="font-semibold text-blue-800 dark:text-blue-200">
              {activeLayer.label}
            </span>{" "}
            <code className="text-xs bg-blue-100 dark:bg-blue-900/50 px-1 rounded">
              {activeLayer.css}
            </code>
            <p className="mt-1 text-gray-700 dark:text-gray-300">
              {activeLayer.description}
            </p>
          </>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-1">
        Click any layer to learn more
      </p>
    </div>
  );
}
