export default function BeeDataDashboardDiagram() {
  // Honey yield mini-chart data
  const honeyData = [
    { m: "J", v: 0 }, { m: "F", v: 0 }, { m: "M", v: 2 },
    { m: "A", v: 5 }, { m: "M", v: 12 }, { m: "J", v: 18 },
    { m: "J", v: 22 }, { m: "A", v: 15 }, { m: "S", v: 8 },
    { m: "O", v: 3 }, { m: "N", v: 0 }, { m: "D", v: 0 },
  ];
  const maxH = 24;

  return (
    <div className="my-4">
      <svg viewBox="0 0 560 460" className="w-full max-w-lg mx-auto" role="img" aria-label="Apiary management dashboard showing colony health, honey yield, and weather data">
        <rect width="560" height="460" rx="12" className="fill-slate-900" />

        <text x="280" y="24" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fbbf24">Apiary Management Dashboard</text>

        {/* Top row: Colony overview cards */}
        <g transform="translate(0, 40)">
          {/* Total colonies */}
          <g transform="translate(75, 0)">
            <rect x="-55" y="0" width="110" height="55" rx="6" fill="#f59e0b" opacity="0.08" stroke="#f59e0b" strokeWidth="1" />
            <text x="0" y="18" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Total Colonies</text>
            <text x="0" y="42" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#fbbf24">12</text>
          </g>

          {/* Healthy */}
          <g transform="translate(205, 0)">
            <rect x="-55" y="0" width="110" height="55" rx="6" fill="#22c55e" opacity="0.08" stroke="#22c55e" strokeWidth="1" />
            <text x="0" y="18" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Healthy</text>
            <text x="0" y="42" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#22c55e">10</text>
          </g>

          {/* Warning */}
          <g transform="translate(335, 0)">
            <rect x="-55" y="0" width="110" height="55" rx="6" fill="#f59e0b" opacity="0.08" stroke="#f59e0b" strokeWidth="1" />
            <text x="0" y="18" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Warning</text>
            <text x="0" y="42" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#f59e0b">1</text>
          </g>

          {/* Critical */}
          <g transform="translate(465, 0)">
            <rect x="-55" y="0" width="110" height="55" rx="6" fill="#ef4444" opacity="0.08" stroke="#ef4444" strokeWidth="1" />
            <text x="0" y="18" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Critical</text>
            <text x="0" y="42" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#ef4444">1</text>
          </g>
        </g>

        {/* Middle left: Honey yield chart */}
        <g transform="translate(30, 115)">
          <rect x="0" y="0" width="250" height="140" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
          <text x="125" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Honey Yield (kg/month)</text>

          {/* Bars */}
          {honeyData.map((d, i) => {
            const barH = (d.v / maxH) * 80;
            const bx = 18 + i * 18;
            return (
              <g key={i}>
                <rect x={bx} y={105 - barH} width="12" height={barH} rx="2" fill="#f59e0b" opacity={d.v > 0 ? 0.5 : 0.1} />
                <text x={bx + 6} y="120" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500">{d.m}</text>
                {d.v > 0 && (
                  <text x={bx + 6} y={100 - barH} textAnchor="middle" fontSize="10" fill="#fbbf24">{d.v}</text>
                )}
              </g>
            );
          })}

          {/* Total */}
          <text x="125" y="136" textAnchor="middle" fontSize="10" fill="#fcd34d">Total: 85 kg this year</text>
        </g>

        {/* Middle right: Colony health table */}
        <g transform="translate(295, 115)">
          <rect x="0" y="0" width="240" height="140" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
          <text x="120" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Colony Status</text>

          {/* Table header */}
          <text x="18" y="36" fontSize="10" fontWeight="bold" className="fill-gray-500 dark:fill-slate-400">ID</text>
          <text x="62" y="36" fontSize="10" fontWeight="bold" className="fill-gray-500 dark:fill-slate-400">Temp</text>
          <text x="110" y="36" fontSize="10" fontWeight="bold" className="fill-gray-500 dark:fill-slate-400">Weight</text>
          <text x="158" y="36" fontSize="10" fontWeight="bold" className="fill-gray-500 dark:fill-slate-400">Queen</text>
          <text x="208" y="36" fontSize="10" fontWeight="bold" className="fill-gray-500 dark:fill-slate-400">Status</text>

          {[
            { id: "H-01", temp: "35.1°", wt: "42kg", queen: "Yes", status: "OK", color: "#22c55e" },
            { id: "H-02", temp: "34.8°", wt: "38kg", queen: "Yes", status: "OK", color: "#22c55e" },
            { id: "H-05", temp: "33.2°", wt: "31kg", queen: "?", status: "WARN", color: "#f59e0b" },
            { id: "H-09", temp: "30.1°", wt: "22kg", queen: "No", status: "CRIT", color: "#ef4444" },
            { id: "H-11", temp: "35.0°", wt: "45kg", queen: "Yes", status: "OK", color: "#22c55e" },
          ].map((row, i) => (
            <g key={i}>
              <text x="18" y={52 + i * 16} fontSize="10" className="fill-gray-700 dark:fill-slate-200">{row.id}</text>
              <text x="62" y={52 + i * 16} fontSize="10" className="fill-gray-500 dark:fill-slate-400">{row.temp}</text>
              <text x="110" y={52 + i * 16} fontSize="10" className="fill-gray-500 dark:fill-slate-400">{row.wt}</text>
              <text x="158" y={52 + i * 16} fontSize="10" fill={row.queen === "No" ? "#ef4444" : row.queen === "?" ? "#f59e0b" : "#94a3b8"}>{row.queen}</text>
              <rect x="192" y={41 + i * 16} width="38" height="14" rx="3" fill={row.color} opacity="0.2" />
              <text x="211" y={52 + i * 16} textAnchor="middle" fontSize="10" fontWeight="bold" fill={row.color}>{row.status}</text>
            </g>
          ))}
        </g>

        {/* Bottom left: Weather widget */}
        <g transform="translate(30, 272)">
          <rect x="0" y="0" width="170" height="110" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
          <text x="85" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#60a5fa">Weather Today</text>

          <text x="45" y="50" textAnchor="middle" fontSize="24" fill="#fbbf24">☀️</text>
          <text x="45" y="70" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Sunny</text>

          <text x="115" y="42" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Temp: <tspan className="fill-gray-700 dark:fill-slate-200">28°C</tspan></text>
          <text x="115" y="56" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Humid: <tspan className="fill-gray-700 dark:fill-slate-200">55%</tspan></text>
          <text x="115" y="70" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Wind: <tspan className="fill-gray-700 dark:fill-slate-200">8 km/h</tspan></text>
          <text x="115" y="86" fontSize="10" fill="#22c55e" fontWeight="bold">Good foraging!</text>
        </g>

        {/* Bottom middle: Alerts */}
        <g transform="translate(215, 272)">
          <rect x="0" y="0" width="185" height="110" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
          <text x="92" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444">Active Alerts</text>

          {[
            { msg: "H-09: Queen loss detected", time: "2h ago", color: "#ef4444" },
            { msg: "H-05: Low weight trend", time: "6h ago", color: "#f59e0b" },
            { msg: "H-09: Temp below 32°C", time: "1d ago", color: "#ef4444" },
          ].map((alert, i) => (
            <g key={i}>
              <circle cx="12" cy={38 + i * 26} r="3" fill={alert.color} opacity="0.6" />
              <text x="22" y={42 + i * 26} fontSize="10" fill={alert.color}>{alert.msg}</text>
              <text x="170" y={42 + i * 26} textAnchor="end" fontSize="10" className="fill-gray-400 dark:fill-slate-500">{alert.time}</text>
            </g>
          ))}
        </g>

        {/* Bottom right: Actions */}
        <g transform="translate(415, 272)">
          <rect x="0" y="0" width="125" height="110" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
          <text x="62" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#22c55e">Recommended</text>

          {[
            { action: "Inspect H-09", priority: "Urgent" },
            { action: "Requeen H-09", priority: "High" },
            { action: "Feed H-05", priority: "Medium" },
            { action: "Harvest H-11", priority: "Low" },
          ].map((item, i) => (
            <g key={i}>
              <text x="10" y={38 + i * 20} fontSize="10" className="fill-gray-700 dark:fill-slate-200">{item.action}</text>
              <text x="115" y={38 + i * 20} textAnchor="end" fontSize="10" fill={i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : "#94a3b8"}>{item.priority}</text>
            </g>
          ))}
        </g>

        {/* Footer */}
        <text x="280" y="410" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500">
          Data refreshes every 15 minutes &bull; Powered by IoT sensors + ML anomaly detection
        </text>
      </svg>
    </div>
  );
}
