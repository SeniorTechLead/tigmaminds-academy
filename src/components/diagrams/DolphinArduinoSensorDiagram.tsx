export default function DolphinArduinoSensorDiagram() {
  return (
    <svg
      viewBox="0 0 640 360"
      className="w-full max-w-2xl mx-auto my-6"
      role="img"
      aria-label="HC-SR04 ultrasonic sensor wired to Arduino, showing trigger pulse, echo timing, and distance calculation"
    >
      <defs>
        <style>{`
          @keyframes dSensorPing {
            0%, 100% { opacity: 0; }
            10% { opacity: 0.8; }
            50% { opacity: 0.3; }
          }
          .d-sensor-ping { animation: dSensorPing 3s ease-out infinite; }
          @keyframes dSensorEcho {
            0%, 40% { opacity: 0; }
            50% { opacity: 0.7; }
            80% { opacity: 0.2; }
            100% { opacity: 0; }
          }
          .d-sensor-echo { animation: dSensorEcho 3s ease-out infinite; }
        `}</style>
        <marker id="dSenArr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="#f59e0b" />
        </marker>
      </defs>

      <rect width="640" height="360" rx="12" className="fill-gray-900" />

      <text x="320" y="24" textAnchor="middle" className="fill-gray-400" fontSize="11" fontWeight="600">
        Building a Sonar Sensor &mdash; HC-SR04 + Arduino
      </text>

      {/* === HC-SR04 sensor === */}
      <rect x="40" y="55" width="140" height="80" rx="6" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600"  strokeWidth="1.5" />
      <text x="110" y="50" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9" fontWeight="600">HC-SR04 SENSOR</text>

      {/* Two transducers (cylinders) */}
      <circle cx="75" cy="85" r="18" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
      <circle cx="75" cy="85" r="12" fill="#475569" />
      <text x="75" y="118" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">TRIG</text>
      <text x="75" y="127" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="6">(speaker)</text>

      <circle cx="145" cy="85" r="18" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
      <circle cx="145" cy="85" r="12" fill="#475569" />
      <text x="145" y="118" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">ECHO</text>
      <text x="145" y="127" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="6">(microphone)</text>

      {/* 4 pins */}
      {['VCC', 'TRIG', 'ECHO', 'GND'].map((pin, i) => (
        <g key={pin}>
          <rect x={55 + i * 28} y="135" width="22" height="14" rx="2" className="fill-white dark:fill-slate-950 stroke-gray-300 dark:stroke-slate-600"  strokeWidth="1" />
          <text x={66 + i * 28} y="146" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="7" fontWeight="600">{pin}</text>
        </g>
      ))}

      {/* Outgoing pulse from sensor */}
      {[0, 1, 2].map((i) => (
        <path
          key={`sp-${i}`}
          className="d-sensor-ping"
          d={`M${200 + i * 40},${60} A${15 + i * 12},${20 + i * 10} 0 0,1 ${200 + i * 40},${110}`}
          fill="none" stroke="#22d3ee" strokeWidth="2"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}

      {/* Object (wall) */}
      <rect x="370" y="50" width="20" height="90" rx="3" fill="#78716c" />
      <text x="380" y="155" textAnchor="middle" fill="#a8a29e" fontSize="9">Object</text>

      {/* Returning echo */}
      {[0, 1, 2].map((i) => (
        <path
          key={`se-${i}`}
          className="d-sensor-echo"
          d={`M${350 - i * 40},${60} A${15 + i * 12},${20 + i * 10} 0 0,0 ${350 - i * 40},${110}`}
          fill="none" stroke="#c084fc" strokeWidth="2"
          style={{ animationDelay: `${1.2 + i * 0.3}s` }}
        />
      ))}

      {/* Labels */}
      <text x="270" y="50" textAnchor="middle" fill="#67e8f9" fontSize="8">40 kHz ultrasonic pulse</text>
      <text x="300" y="135" textAnchor="middle" fill="#d8b4fe" fontSize="8">echo returns</text>

      {/* === Arduino board === */}
      <rect x="40" y="190" width="200" height="110" rx="8" fill="#064e3b" stroke="#059669" strokeWidth="1.5" />
      <text x="140" y="210" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="700">Arduino Uno</text>

      {/* Wiring */}
      <line x1="66" y1="149" x2="66" y2="190" stroke="#ef4444" strokeWidth="2" />
      <text x="58" y="175" fill="#ef4444" fontSize="7">5V</text>

      <line x1="94" y1="149" x2="94" y2="190" stroke="#3b82f6" strokeWidth="2" />
      <text x="86" y="175" fill="#3b82f6" fontSize="7">D2</text>

      <line x1="122" y1="149" x2="122" y2="190" stroke="#a855f7" strokeWidth="2" />
      <text x="114" y="175" fill="#a855f7" fontSize="7">D3</text>

      <line x1="150" y1="149" x2="150" y2="190" stroke="#6b7280" strokeWidth="2" />
      <text x="142" y="175" fill="#6b7280" fontSize="7">GND</text>

      {/* Code snippet inside Arduino */}
      <text x="60" y="232" fill="#6ee7b7" fontSize="8" fontFamily="monospace" opacity="0.8">digitalWrite(TRIG, HIGH);</text>
      <text x="60" y="244" fill="#6ee7b7" fontSize="8" fontFamily="monospace" opacity="0.8">delayMicroseconds(10);</text>
      <text x="60" y="256" fill="#6ee7b7" fontSize="8" fontFamily="monospace" opacity="0.8">digitalWrite(TRIG, LOW);</text>
      <text x="60" y="272" fill="#a78bfa" fontSize="8" fontFamily="monospace" opacity="0.8">dur = pulseIn(ECHO, HIGH);</text>
      <text x="60" y="288" fill="#fbbf24" fontSize="8" fontFamily="monospace" opacity="0.8">dist = dur * 0.0343 / 2;</text>

      {/* === Timing diagram (right) === */}
      <rect x="280" y="190" width="340" height="155" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#374151" strokeWidth="1" />
      <text x="450" y="210" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10" fontWeight="600">Timing Diagram</text>

      {/* Trigger pulse */}
      <text x="295" y="232" fill="#3b82f6" fontSize="8">TRIG</text>
      <polyline points="340,235 340,220 370,220 370,235" fill="none" stroke="#3b82f6" strokeWidth="2" />
      <line x1="370" y1="235" x2="600" y2="235" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
      <text x="355" y="217" textAnchor="middle" fill="#3b82f6" fontSize="7">10 &#181;s</text>

      {/* Echo pulse */}
      <text x="295" y="270" fill="#a855f7" fontSize="8">ECHO</text>
      <line x1="340" y1="273" x2="400" y2="273" stroke="#a855f7" strokeWidth="1" opacity="0.3" />
      <polyline points="400,273 400,258 530,258 530,273" fill="none" stroke="#a855f7" strokeWidth="2" />
      <line x1="530" y1="273" x2="600" y2="273" stroke="#a855f7" strokeWidth="1" opacity="0.3" />

      {/* Duration label */}
      <line x1="400" y1="280" x2="400" y2="290" stroke="#a855f7" strokeWidth="0.5" />
      <line x1="530" y1="280" x2="530" y2="290" stroke="#a855f7" strokeWidth="0.5" />
      <line x1="400" y1="287" x2="530" y2="287" stroke="#a855f7" strokeWidth="1" markerEnd="url(#dSenArr)" />
      <text x="465" y="300" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="600">duration (&#181;s)</text>

      {/* Formula box */}
      <rect x="310" y="310" width="280" height="26" rx="4" className="fill-white dark:fill-slate-950" stroke="#374151" strokeWidth="1" />
      <text x="450" y="328" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="700" fontFamily="monospace">
        distance_cm = duration &#215; 0.0343 / 2
      </text>
    </svg>
  );
}
