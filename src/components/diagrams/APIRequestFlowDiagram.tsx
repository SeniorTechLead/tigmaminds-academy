import { useState, useEffect } from 'react';

// ── URL → Pixels ─────────────────────────────────────────────
// Animated client-server loop. Packets fly from client to DNS,
// back, then to server, then response streams back with the
// HTML/JSON payload. Counter shows total round-trip time.

type Phase = 'idle' | 'dns-out' | 'dns-in' | 'request' | 'processing' | 'response' | 'render';

const PHASES: { name: Phase; label: string; duration: number }[] = [
  { name: 'idle', label: 'Ready. Click "Send Request"', duration: 0 },
  { name: 'dns-out', label: '① DNS lookup — "What IP is google.com?"', duration: 40 },
  { name: 'dns-in', label: '② DNS responds — "142.250.80.46"', duration: 30 },
  { name: 'request', label: '③ HTTP GET request travels to server', duration: 60 },
  { name: 'processing', label: '④ Server processes: queries DB, renders response', duration: 50 },
  { name: 'response', label: '⑤ HTTP 200 + JSON/HTML response travels back', duration: 60 },
  { name: 'render', label: '⑥ Browser parses response and displays page ✓', duration: 40 },
];

export default function APIRequestFlowDiagram() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const current = PHASES[phaseIdx];
    if (tick >= current.duration) {
      if (phaseIdx < PHASES.length - 1) {
        setPhaseIdx(i => i + 1);
        setTick(0);
      } else {
        setRunning(false);
      }
    }
  }, [tick, phaseIdx, running]);

  const start = () => {
    setPhaseIdx(1);
    setTick(0);
    setRunning(true);
  };

  const reset = () => {
    setPhaseIdx(0);
    setTick(0);
    setRunning(false);
  };

  const phase = PHASES[phaseIdx].name;
  const progress = running ? tick / PHASES[phaseIdx].duration : 0;

  const W = 600, H = 280;
  const clientX = 60, clientY = 140;
  const dnsX = 300, dnsY = 60;
  const serverX = 540, serverY = 140;

  // Calculate packet position
  let packetX = 0, packetY = 0, packetVisible = false, packetLabel = '';
  if (phase === 'dns-out') {
    packetX = clientX + progress * (dnsX - clientX);
    packetY = clientY + progress * (dnsY - clientY);
    packetVisible = true;
    packetLabel = '?';
  } else if (phase === 'dns-in') {
    packetX = dnsX + progress * (clientX - dnsX);
    packetY = dnsY + progress * (clientY - dnsY);
    packetVisible = true;
    packetLabel = 'IP';
  } else if (phase === 'request') {
    packetX = clientX + progress * (serverX - clientX);
    packetY = clientY;
    packetVisible = true;
    packetLabel = 'GET';
  } else if (phase === 'response') {
    packetX = serverX - progress * (serverX - clientX);
    packetY = clientY;
    packetVisible = true;
    packetLabel = '200';
  }

  // Total elapsed time (ms) — 1 tick ≈ ~10ms in a fake real-time display
  const elapsedMs = (phaseIdx > 0 ? PHASES.slice(1, phaseIdx).reduce((s, p) => s + p.duration, 0) + tick : 0) * 3;

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-emerald-50 dark:from-blue-950 dark:via-slate-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
          URL → Pixels
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
            {elapsedMs}ms elapsed
          </span>
          <button
            onClick={start}
            disabled={running}
            className="text-xs px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-semibold shadow transition"
          >
            ▶ Send request
          </button>
          <button
            onClick={reset}
            className="text-xs px-2 py-1 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            Reset
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" role="img"
        aria-label="Animated web request from client to DNS to server and back">

        {/* Client (browser) */}
        <g>
          <rect x={clientX - 40} y={clientY - 30} width={80} height={60} rx={8}
            fill="#3b82f6" opacity="0.9" />
          <text x={clientX} y={clientY - 5} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
            Browser
          </text>
          <text x={clientX} y={clientY + 10} textAnchor="middle" fill="white" fontSize="9" opacity="0.8">
            (client)
          </text>
          <text x={clientX} y={clientY + 55} textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="9">
            You
          </text>
        </g>

        {/* DNS */}
        <g>
          <rect x={dnsX - 40} y={dnsY - 20} width={80} height={40} rx={8}
            fill="#f59e0b" opacity="0.9" />
          <text x={dnsX} y={dnsY - 2} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
            DNS
          </text>
          <text x={dnsX} y={dnsY + 11} textAnchor="middle" fill="white" fontSize="8" opacity="0.9">
            (phone book)
          </text>
        </g>

        {/* Server */}
        <g>
          <rect x={serverX - 40} y={serverY - 30} width={80} height={60} rx={8}
            fill="#10b981" opacity="0.9" />
          <text x={serverX} y={serverY - 5} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
            Server
          </text>
          <text x={serverX} y={serverY + 10} textAnchor="middle" fill="white" fontSize="9" opacity="0.8">
            google.com
          </text>
          {phase === 'processing' && (
            <g opacity={0.5 + Math.sin(tick * 0.3) * 0.3}>
              <circle cx={serverX - 20} cy={serverY + 45} r="3" fill="#10b981" />
              <circle cx={serverX} cy={serverY + 45} r="3" fill="#10b981" />
              <circle cx={serverX + 20} cy={serverY + 45} r="3" fill="#10b981" />
            </g>
          )}
        </g>

        {/* Connection lines */}
        <line x1={clientX + 40} y1={clientY - 20} x2={dnsX - 40} y2={dnsY + 10}
          stroke="#cbd5e1" className="dark:stroke-gray-600" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        <line x1={clientX + 40} y1={clientY} x2={serverX - 40} y2={serverY}
          stroke="#cbd5e1" className="dark:stroke-gray-600" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

        {/* Packet */}
        {packetVisible && (
          <g>
            <circle cx={packetX} cy={packetY} r="14"
              fill={phase.includes('dns') ? '#f59e0b' : phase === 'request' ? '#3b82f6' : '#10b981'}
              opacity="0.3" />
            <circle cx={packetX} cy={packetY} r="10"
              fill={phase.includes('dns') ? '#f59e0b' : phase === 'request' ? '#3b82f6' : '#10b981'} />
            <text x={packetX} y={packetY + 3} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
              {packetLabel}
            </text>
          </g>
        )}

        {/* Page rendered */}
        {phase === 'render' && (
          <g>
            <rect x={clientX - 35} y={clientY - 25} width={70} height={50} rx={4}
              fill="white" opacity={progress} stroke="#10b981" strokeWidth="2" />
            <rect x={clientX - 28} y={clientY - 18} width={56} height={4} fill="#10b981" opacity={progress * 0.7} />
            <rect x={clientX - 28} y={clientY - 10} width={42} height={3} fill="#cbd5e1" opacity={progress * 0.6} />
            <rect x={clientX - 28} y={clientY - 4} width={48} height={3} fill="#cbd5e1" opacity={progress * 0.6} />
            <rect x={clientX - 28} y={clientY + 2} width={36} height={3} fill="#cbd5e1" opacity={progress * 0.6} />
          </g>
        )}

        {/* Phase caption */}
        <rect x={40} y={H - 50} width={W - 80} height={40} rx={8}
          fill="#f1f5f9" className="dark:fill-slate-800" opacity="0.8" />
        <text x={W / 2} y={H - 28} textAnchor="middle" className="fill-slate-800 dark:fill-slate-100" fontSize="11" fontWeight="bold">
          {PHASES[phaseIdx].label}
        </text>

        {/* Progress bar */}
        <rect x={60} y={H - 8} width={W - 120} height={3} rx={1}
          fill="#cbd5e1" className="dark:fill-gray-700" />
        <rect x={60} y={H - 8}
          width={((phaseIdx + progress) / (PHASES.length - 1)) * (W - 120)}
          height={3} rx={1} fill="#3b82f6" />
      </svg>

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
        Every webpage you open triggers this exact dance — typically in under 300 milliseconds.
      </p>
    </div>
  );
}
