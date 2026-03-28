import { useState } from 'react';

const ElectromagnetDiagram = () => {
  const [isOn, setIsOn] = useState(true);

  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 450 280"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Electromagnet diagram showing a coil wrapped around an iron core with current arrows and magnetic field lines"
      >
        <style>{`
          @keyframes currentFlow {
            0% { stroke-dashoffset: 16; }
            100% { stroke-dashoffset: 0; }
          }
          .current-anim {
            stroke-dasharray: 8 8;
            animation: currentFlow 1s linear infinite;
          }
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 13px;
            font-weight: 600;
          }
        `}</style>

        <defs>
          <marker id="em-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="em-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="450" height="280" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="225" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Electromagnet
        </text>

        {/* Iron core */}
        <rect x="130" y="100" width="190" height="30" rx="4"
          className="fill-slate-400 dark:fill-slate-500 stroke-slate-600 dark:stroke-slate-400" strokeWidth="2" />
        <text x="225" y="120" textAnchor="middle"
          className="label-text fill-slate-800 dark:fill-slate-200" style={{ fontSize: '10px' }}>
          Iron Core
        </text>

        {/* Coil wraps around core */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const x = 148 + i * 22;
          return (
            <g key={i}>
              {/* Top arc */}
              <path d={`M ${x} 100 Q ${x + 11} 78, ${x + 22} 100`}
                fill="none" stroke="#f97316" strokeWidth="2.5"
                opacity={isOn ? 1 : 0.3} />
              {/* Bottom arc */}
              <path d={`M ${x} 130 Q ${x + 11} 152, ${x + 22} 130`}
                fill="none" stroke="#f97316" strokeWidth="2.5"
                opacity={isOn ? 1 : 0.3} />
            </g>
          );
        })}

        {/* Wire leads */}
        <line x1="148" y1="115" x2="80" y2="115"
          stroke="#f97316" strokeWidth="2.5" opacity={isOn ? 1 : 0.3} />
        <line x1="80" y1="115" x2="80" y2="210"
          stroke="#f97316" strokeWidth="2.5" opacity={isOn ? 1 : 0.3} />

        <line x1="326" y1="115" x2="380" y2="115"
          stroke="#f97316" strokeWidth="2.5" opacity={isOn ? 1 : 0.3} />
        <line x1="380" y1="115" x2="380" y2="210"
          stroke="#f97316" strokeWidth="2.5" opacity={isOn ? 1 : 0.3} />

        {/* Battery */}
        <rect x="190" y="200" width="80" height="25" rx="4"
          className="fill-slate-200 dark:fill-slate-700 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
        <text x="230" y="216" textAnchor="middle"
          className="label-text fill-slate-700 dark:fill-slate-200" style={{ fontSize: '10px' }}>
          Battery
        </text>
        {/* Battery terminals */}
        <line x1="190" y1="212" x2="80" y2="212"
          stroke="#f97316" strokeWidth="2" opacity={isOn ? 1 : 0.3} />
        <line x1="270" y1="212" x2="380" y2="212"
          stroke="#f97316" strokeWidth="2" opacity={isOn ? 1 : 0.3} />

        {/* + and - */}
        <text x="175" y="216" textAnchor="middle"
          className="label-text fill-red-500" fontWeight="600" style={{ fontSize: '12px' }}>+</text>
        <text x="285" y="216" textAnchor="middle"
          className="label-text fill-blue-500" fontWeight="600" style={{ fontSize: '12px' }}>−</text>

        {/* Current direction arrows */}
        {isOn && (
          <>
            <line x1="80" y1="170" x2="80" y2="140"
              stroke="#ef4444" strokeWidth="1.5" className="current-anim" markerEnd="url(#em-arrow-red)" />
            <text x="62" y="160" textAnchor="end"
              className="label-text fill-red-500 dark:fill-red-400" style={{ fontSize: '10px' }}>
              I
            </text>

            <line x1="380" y1="140" x2="380" y2="170"
              stroke="#ef4444" strokeWidth="1.5" className="current-anim" markerEnd="url(#em-arrow-red)" />
            <text x="398" y="160"
              className="label-text fill-red-500 dark:fill-red-400" style={{ fontSize: '10px' }}>
              I
            </text>
          </>
        )}

        {/* Magnetic field lines (only when ON) */}
        {isOn && (
          <>
            {/* Field through core (left to right) */}
            <line x1="125" y1="115" x2="100" y2="115"
              stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#em-arrow-blue)" opacity="0.7" />

            {/* External field lines */}
            <path d="M 325 115 Q 400 115, 400 50 Q 400 0, 225 0 Q 50 0, 50 50 Q 50 115, 125 115"
              fill="none" stroke="#3b82f6" strokeWidth="1.2" opacity="0.4"
              markerEnd="url(#em-arrow-blue)" />
            <path d="M 325 115 Q 370 115, 370 60 Q 370 20, 225 20 Q 80 20, 80 60 Q 80 115, 125 115"
              fill="none" stroke="#3b82f6" strokeWidth="1.2" opacity="0.5"
              markerEnd="url(#em-arrow-blue)" />

            {/* N and S poles */}
            <text x="110" y="100" textAnchor="middle"
              className="label-text fill-red-600 dark:fill-red-400" fontWeight="600">
              N
            </text>
            <text x="340" y="100" textAnchor="middle"
              className="label-text fill-blue-600 dark:fill-blue-400" fontWeight="600">
              S
            </text>
          </>
        )}

        {/* OFF state label */}
        {!isOn && (
          <text x="225" y="55" textAnchor="middle"
            className="label-text fill-slate-400 dark:fill-slate-500" style={{ fontStyle: 'italic' }}>
            No magnetic field when current is off
          </text>
        )}

        {/* ON/OFF Toggle button */}
        <g
          onClick={() => setIsOn(!isOn)}
          style={{ cursor: 'pointer' }}
        >
          <rect x="185" y="248" width="80" height="24" rx="12"
            className={isOn
              ? 'fill-green-500 stroke-green-600'
              : 'fill-slate-300 dark:fill-slate-600 stroke-slate-400 dark:stroke-slate-500'}
            strokeWidth="1.5" />
          <circle
            cx={isOn ? 245 : 205}
            cy="260" r="9"
            className="fill-white stroke-slate-300" strokeWidth="1" />
          <text x={isOn ? 210 : 230} y="264" textAnchor="middle"
            className={`label-text ${isOn ? 'fill-white' : 'fill-slate-500 dark:fill-slate-400'}`}
            fontWeight="600" style={{ fontSize: '10px' }}>
            {isOn ? 'ON' : 'OFF'}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default ElectromagnetDiagram;
