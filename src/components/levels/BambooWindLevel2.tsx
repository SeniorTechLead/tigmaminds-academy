import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function BambooWindLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Damped oscillations — how vibrations die',
      concept: `All real vibrations eventually stop. Energy is lost to **damping** — friction, air resistance, internal material losses. The mathematics of damping determines how quickly a system loses energy.

**The damped oscillator equation:**
**m*x'' + c*x' + k*x = 0**
- m = mass, c = damping coefficient, k = spring constant
- x'' = acceleration, x' = velocity, x = displacement

**Three regimes:**
1. **Underdamped** (c < 2*sqrt(m*k)): oscillates with exponentially decaying amplitude
   - x(t) = A * e^(-gamma*t) * cos(omega_d*t)
   - gamma = c/(2m), omega_d = sqrt(omega_n^2 - gamma^2)
   - Examples: guitar string, pendulum, bamboo in wind

2. **Critically damped** (c = 2*sqrt(m*k)): fastest return to rest without oscillation
   - x(t) = (A + B*t) * e^(-gamma*t)
   - Example: car door closing mechanism

3. **Overdamped** (c > 2*sqrt(m*k)): slow exponential return, no oscillation
   - x(t) = A*e^(-a1*t) + B*e^(-a2*t)
   - Example: heavy door closer

**Energy decay:**
Energy decays as E(t) = E0 * e^(-2*gamma*t). The time to lose half the energy: t_half = ln(2)/(2*gamma).`,
      analogy: 'Damping is like swimming through fluids of different thickness. In water (underdamped), you glide back and forth before stopping. In honey (critically damped), you return smoothly with no overshoot. In cement (overdamped), you barely move at all. The fluid\'s viscosity determines the damping regime.',
      storyConnection: 'When the wind stops in the story, the bamboo continues to sway and hum for a while before falling silent. This is underdamped oscillation: the bamboo\'s internal damping is low enough that it oscillates many times before the energy dissipates. A thick, solid tree would be critically or overdamped — it would return to rest without swaying.',
      checkQuestion: 'Car shock absorbers are designed to be critically damped. What would happen if they were underdamped?',
      checkAnswer: 'The car would bounce repeatedly after hitting a bump, oscillating up and down for several cycles. This is uncomfortable and dangerous (tyres lose contact with the road during upward bounces). Critical damping returns the suspension to rest as quickly as possible without bouncing. Worn-out shock absorbers become underdamped — which is why old cars bounce on bumpy roads.',
      codeIntro: 'Simulate and compare the three damping regimes: underdamped, critically damped, and overdamped.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 5, 1000)

# System parameters
m = 1.0  # mass
k = 100.0  # spring constant
omega_n = np.sqrt(k / m)  # natural frequency

# Three damping cases
damping_cases = [
    ('Underdamped (bamboo)', 2.0, '#22c55e'),
    ('Critically damped (car door)', 2 * np.sqrt(m * k), '#f59e0b'),
    ('Overdamped (heavy door)', 40.0, '#ef4444'),
]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Displacement vs time
ax1.set_facecolor('#111827')
for label, c, color in damping_cases:
    gamma = c / (2 * m)
    zeta = c / (2 * np.sqrt(m * k))

    if zeta < 1:  # underdamped
        omega_d = omega_n * np.sqrt(1 - zeta**2)
        x = np.exp(-gamma * t) * np.cos(omega_d * t)
    elif abs(zeta - 1) < 0.01:  # critically damped
        x = (1 + gamma * t) * np.exp(-gamma * t)
    else:  # overdamped
        s1 = -gamma + np.sqrt(gamma**2 - omega_n**2)
        s2 = -gamma - np.sqrt(gamma**2 - omega_n**2)
        x = (s2 * np.exp(s1 * t) - s1 * np.exp(s2 * t)) / (s2 - s1)

    ax1.plot(t, x, color=color, linewidth=2, label=f'{label} (ζ={zeta:.2f})')

ax1.axhline(0, color='gray', linewidth=0.5, alpha=0.3)
ax1.set_xlabel('Time (s)', color='white')
ax1.set_ylabel('Displacement', color='white')
ax1.set_title('Three Damping Regimes', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Energy vs time
ax2.set_facecolor('#111827')
for label, c, color in damping_cases:
    gamma = c / (2 * m)
    energy = np.exp(-2 * gamma * t)
    ax2.plot(t, energy, color=color, linewidth=2, label=label)
    # Mark half-life
    t_half = np.log(2) / (2 * gamma)
    if t_half < 5:
        ax2.plot(t_half, 0.5, 'o', color=color, markersize=8)
        ax2.annotate(f't½={t_half:.2f}s', (t_half, 0.5), xytext=(t_half+0.3, 0.55),
                     color=color, fontsize=8)

ax2.axhline(0.5, color='gray', linestyle=':', alpha=0.3)
ax2.set_xlabel('Time (s)', color='white')
ax2.set_ylabel('Energy (normalised)', color='white')
ax2.set_title('Energy Decay', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Damping comparison:")
for label, c, _ in damping_cases:
    gamma = c / (2 * m)
    zeta = c / (2 * np.sqrt(m * k))
    t_half = np.log(2) / (2 * gamma)
    print(f"  {label}:")
    print(f"    ζ = {zeta:.2f}, γ = {gamma:.1f}, Energy half-life = {t_half:.3f}s")`,
      challenge: 'Find the damping coefficient that gives exactly 3 oscillations before the amplitude drops below 5% of the initial value. This is a common engineering specification for vibration isolation systems.',
      successHint: 'Damping regime selection is a core engineering decision. Musical instruments need low damping (sustain). Buildings need moderate damping (earthquake resistance). Brakes need high damping (stopping quickly). The same equation governs all three.',
    },
    {
      title: 'Forced oscillation and resonance curves — the frequency response',
      concept: `When a damped system is driven by an external force at frequency omega_f, the steady-state response is:

**x(t) = X * sin(omega_f * t - phi)**

where:
**X = F0 / sqrt((k - m*omega_f^2)^2 + (c*omega_f)^2)**
**phi = atan2(c*omega_f, k - m*omega_f^2)**

**Key features of the frequency response:**
1. At low forcing frequency (omega_f << omega_n): X ≈ F0/k (static deflection)
2. At resonance (omega_f ≈ omega_n): X ≈ F0/(c*omega_n) (amplified by Q = omega_n*m/c)
3. At high frequency (omega_f >> omega_n): X ≈ F0/(m*omega_f^2) (amplitude drops as 1/f^2)

**Phase response:**
- Below resonance: response is nearly in phase with forcing (phi ≈ 0)
- At resonance: response lags forcing by 90° (phi = pi/2)
- Above resonance: response is nearly 180° out of phase (phi ≈ pi)

This 90° phase shift at resonance is a universal diagnostic. If you push a swing and observe that the swing is 90° behind your push, you are at resonance — regardless of the system.`,
      analogy: 'The frequency response curve is like a restaurant review aggregated across all food critics. Each critic (forcing frequency) rates the restaurant (system). Most critics give moderate ratings. But one specific critic (resonant frequency) gives an ecstatic review. The restaurant\'s reputation (amplitude) peaks at that one review. The width of the peak tells you how picky the critics are (damping).',
      storyConnection: 'The bamboo in the story doesn\'t sing at every wind speed — only at certain speeds that match its resonant frequencies. The frequency response curve predicts exactly which wind speeds produce the loudest tone, and the phase response explains why the bamboo\'s oscillation seems to "lag" the wind gusts.',
      checkQuestion: 'Audio speakers use resonance to amplify sound, but speaker designers try to make the resonance as BROAD as possible (low Q). Why?',
      checkAnswer: 'A speaker needs to reproduce many frequencies equally well (from 20 Hz to 20 kHz). A sharp resonance (high Q) would make one frequency much louder than others — terrible for music reproduction. Low Q gives a broad, flat frequency response, meaning all frequencies are amplified equally. This is why speaker design is difficult: you want some amplification (resonance) but without frequency favouritism.',
      codeIntro: 'Plot the complete frequency response (amplitude and phase) for different damping ratios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

omega_n = 2 * np.pi * 10  # natural frequency 10 Hz
omega = np.linspace(0.1, 3 * omega_n, 1000)

zeta_values = [0.05, 0.15, 0.3, 0.5, 1.0]
colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(12, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')

for zeta, color in zip(zeta_values, colors):
    r = omega / omega_n  # frequency ratio

    # Amplitude response (normalised)
    H = 1.0 / np.sqrt((1 - r**2)**2 + (2 * zeta * r)**2)

    # Phase response
    phi = np.arctan2(2 * zeta * r, 1 - r**2)

    # Power (amplitude squared, in dB)
    power_dB = 20 * np.log10(H)

    Q = 1 / (2 * zeta)

    ax1.plot(omega / omega_n, H, color=color, linewidth=2, label=f'ζ={zeta} (Q={Q:.0f})')
    ax2.plot(omega / omega_n, power_dB, color=color, linewidth=2)
    ax3.plot(omega / omega_n, np.degrees(phi), color=color, linewidth=2)

# Amplitude
ax1.set_facecolor('#111827')
ax1.set_ylabel('Amplitude ratio |H(ω)|', color='white')
ax1.set_title('Frequency Response of a Damped Oscillator', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.axvline(1, color='white', linestyle=':', alpha=0.2)
ax1.set_ylim(0, 12)
ax1.tick_params(colors='gray')

# Power (dB)
ax2.set_facecolor('#111827')
ax2.set_ylabel('Power (dB)', color='white')
ax2.axvline(1, color='white', linestyle=':', alpha=0.2)
ax2.axhline(0, color='gray', linestyle=':', alpha=0.3)
ax2.set_ylim(-40, 25)
ax2.tick_params(colors='gray')

# Phase
ax3.set_facecolor('#111827')
ax3.set_ylabel('Phase (degrees)', color='white')
ax3.set_xlabel('Frequency ratio (ω/ωn)', color='white')
ax3.axvline(1, color='white', linestyle=':', alpha=0.2)
ax3.axhline(90, color='gray', linestyle=':', alpha=0.3)
ax3.text(1.05, 92, '90° at resonance', color='gray', fontsize=8)
ax3.tick_params(colors='gray')
ax3.set_yticks([0, 45, 90, 135, 180])

plt.tight_layout()
plt.show()

print("Resonance diagnostics:")
print("  1. Amplitude peaks at ω/ωn ≈ 1")
print("  2. Phase crosses 90° at exactly ω/ωn = 1")
print("  3. Power gain at resonance = 20*log10(Q) dB")
print()
for zeta in zeta_values:
    Q = 1 / (2 * zeta)
    gain = 20 * np.log10(Q)
    print(f"  ζ={zeta}: Q={Q:.0f}, gain={gain:.1f} dB")`,
      challenge: 'Create a "notch filter" by combining two oscillators: one resonant, one anti-resonant. This is how noise-cancelling headphones work — they create anti-resonance at unwanted frequencies.',
      successHint: 'The frequency response plot is the single most important tool in vibration engineering, signal processing, and control systems. Every filter, amplifier, and control loop is designed by shaping this curve.',
    },
    {
      title: 'Tacoma Narrows Bridge — when resonance kills',
      concept: `On November 7, 1940, the Tacoma Narrows Bridge in Washington State collapsed due to wind-induced vibrations. It is the most famous engineering failure caused by resonance — and the most misunderstood.

**What actually happened:**
- The bridge was unusually flexible (narrow deck, shallow girders)
- In 64 km/h winds, the deck began twisting (torsional oscillation)
- The twisting was NOT simple resonance with vortex shedding
- It was **aeroelastic flutter**: the bridge's motion CHANGED the aerodynamic forces, which INCREASED the motion — a positive feedback loop
- The amplitude grew until the steel and concrete failed

**Common misconception:** "The wind frequency matched the bridge's natural frequency" (simple resonance). **Reality:** Flutter is self-excited — the bridge generated its own driving force through interaction with the wind. It is more like a flag flapping than a tuning fork resonating.

**Design lessons:**
- Bridges must be tested in wind tunnels (aerodynamic stability)
- Torsional stiffness matters as much as vertical stiffness
- Damping devices can prevent flutter (tuned mass dampers)
- Modern suspension bridges (Golden Gate, Akashi Kaikyo) are designed for flutter resistance

The Tacoma Narrows collapse changed bridge engineering forever.`,
      analogy: 'Flutter is like wobbling on a bicycle. A small wobble shifts your weight, which increases the wobble, which shifts your weight more — positive feedback. The wobble grows until you crash. It is not that someone is shaking your bicycle at the right frequency (resonance). The bicycle\'s own motion creates the destabilising force. Flutter is self-excited instability.',
      storyConnection: 'The bamboo in the story bends gracefully in the wind but never breaks. Bamboo has evolved to be flexible AND well-damped — it absorbs wind energy through internal friction rather than building up destructive oscillations. The Tacoma Narrows Bridge, by contrast, was flexible but poorly damped — it stored wind energy instead of dissipating it.',
      checkQuestion: 'The Millennium Bridge in London (opened 2000) wobbled dangerously when 2000 people walked across it on opening day. Was this resonance?',
      checkAnswer: 'Yes, but with a twist. The bridge swayed slightly from wind. Pedestrians, feeling the sway, unconsciously synchronised their steps to maintain balance. Synchronised walking amplified the sway (positive feedback). This is "synchronous lateral excitation" — a form of resonance where the forcing (footsteps) adapts to match the bridge\'s natural frequency. The fix: add 37 viscous dampers and 26 tuned mass dampers.',
      codeIntro: 'Simulate the Tacoma Narrows bridge oscillation: compare simple resonance vs. aeroelastic flutter.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 60, 6000)  # 60 seconds
dt = t[1] - t[0]

# Bridge parameters
omega_n = 2 * np.pi * 0.2  # natural frequency 0.2 Hz (5s period)
m = 1.0  # normalised mass

fig, axes = plt.subplots(3, 1, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Scenario 1: Simple forced resonance (what people THINK happened)
ax = axes[0]
ax.set_facecolor('#111827')
zeta = 0.02
gamma = zeta * omega_n
F0 = 0.1
omega_f = omega_n  # forcing at resonance
x_res = np.zeros_like(t)
v_res = np.zeros_like(t)
for i in range(1, len(t)):
    force = F0 * np.sin(omega_f * t[i])
    a = force - 2 * gamma * v_res[i-1] - omega_n**2 * x_res[i-1]
    v_res[i] = v_res[i-1] + a * dt
    x_res[i] = x_res[i-1] + v_res[i] * dt

ax.plot(t, x_res, color='#3b82f6', linewidth=1)
ax.set_title('Myth: Simple resonance (amplitude grows linearly, bounded)', color='#3b82f6', fontsize=11)
ax.set_ylabel('Displacement', color='white')
ax.tick_params(colors='gray')

# Scenario 2: Aeroelastic flutter (what ACTUALLY happened)
ax = axes[1]
ax.set_facecolor('#111827')
x_flutter = np.zeros_like(t)
v_flutter = np.zeros_like(t)
x_flutter[0] = 0.01  # tiny initial disturbance

for i in range(1, len(t)):
    # Negative damping from aerodynamic forces (flutter)
    aero_damping = -0.05 * omega_n  # negative = energy input
    structural_damping = 0.02 * omega_n  # positive = energy loss
    net_damping = structural_damping + aero_damping  # negative net = flutter

    # Nonlinear: damping becomes positive at large amplitude (limits growth before failure)
    if abs(x_flutter[i-1]) > 2:
        net_damping = 0.1 * omega_n

    a = -2 * net_damping * v_flutter[i-1] - omega_n**2 * x_flutter[i-1]
    v_flutter[i] = v_flutter[i-1] + a * dt
    x_flutter[i] = x_flutter[i-1] + v_flutter[i] * dt

ax.plot(t, x_flutter, color='#ef4444', linewidth=1)
failure_point = np.argmax(np.abs(x_flutter) > 3) if np.any(np.abs(x_flutter) > 3) else -1
if failure_point > 0:
    ax.axvline(t[failure_point], color='#f59e0b', linestyle='--', alpha=0.5)
    ax.text(t[failure_point]+1, 2, 'Failure threshold', color='#f59e0b', fontsize=9)
ax.set_title('Reality: Aeroelastic flutter (exponential growth from tiny disturbance)', color='#ef4444', fontsize=11)
ax.set_ylabel('Displacement', color='white')
ax.tick_params(colors='gray')

# Scenario 3: Modern bridge with tuned mass damper
ax = axes[2]
ax.set_facecolor('#111827')
x_modern = np.zeros_like(t)
v_modern = np.zeros_like(t)
x_modern[0] = 0.01

for i in range(1, len(t)):
    aero_damping = -0.05 * omega_n
    structural_damping = 0.02 * omega_n
    tmd_damping = 0.08 * omega_n  # tuned mass damper adds positive damping
    net_damping = structural_damping + aero_damping + tmd_damping  # positive net

    a = -2 * net_damping * v_modern[i-1] - omega_n**2 * x_modern[i-1]
    v_modern[i] = v_modern[i-1] + a * dt
    x_modern[i] = x_modern[i-1] + v_modern[i] * dt

ax.plot(t, x_modern, color='#22c55e', linewidth=1)
ax.set_title('Modern bridge with damper (flutter suppressed)', color='#22c55e', fontsize=11)
ax.set_ylabel('Displacement', color='white')
ax.set_xlabel('Time (seconds)', color='white')
ax.tick_params(colors='gray')

plt.suptitle('Tacoma Narrows: Three Scenarios', color='white', fontsize=13, y=1.01)
plt.tight_layout()
plt.show()

print("Key difference:")
print("  Simple resonance: external force drives the system")
print("    → amplitude grows linearly, bounded by damping")
print("  Aeroelastic flutter: the system's motion creates its own driving force")
print("    → amplitude grows EXPONENTIALLY (positive feedback)")
print("    → only stops when something breaks")
print()
print("Modern solution: add enough damping to ensure net damping is positive")
print("even with aerodynamic negative damping. This is why modern bridges")
print("have tuned mass dampers, aerodynamic fairings, and extensive wind testing.")`,
      challenge: 'Vary the wind speed (which changes the aeroelastic damping). Find the critical wind speed where net damping goes negative (flutter onset). This critical speed is the most important number in bridge aerodynamics.',
      successHint: 'The Tacoma Narrows collapse is a cautionary tale about the difference between resonance and instability. Engineers who design for simple resonance but ignore flutter are making the same mistake that killed the bridge in 1940.',
    },
    {
      title: 'Vibration isolation — protecting structures from shaking',
      concept: `**Vibration isolation** prevents unwanted vibrations from reaching sensitive objects. The physics is elegant: place a spring-damper system between the vibration source and the object you want to protect.

**The transmissibility ratio:**
**T = sqrt((1 + (2*zeta*r)^2) / ((1-r^2)^2 + (2*zeta*r)^2))**
where r = omega_forcing / omega_natural

**Key insight:** T < 1 (isolation) only when r > sqrt(2) ≈ 1.414

This means: for the isolator to work, the forcing frequency must be MORE than 1.414× the natural frequency of the isolation mount. Below this ratio, the mount actually amplifies vibrations.

**Design rule:** make the natural frequency of the mount as LOW as possible (soft springs, heavy mass) so that the ratio r is as large as possible.

**Applications:**
- Building foundations on rubber bearings (earthquake isolation)
- Optical tables on air springs (vibration-free for lasers)
- Engine mounts in cars (isolate engine vibration from cabin)
- Spacecraft instrument mounts (isolate launch vibrations)
- Audio turntable on springs (isolate floor vibrations from the needle)`,
      analogy: 'Vibration isolation is like floating on a waterbed during an earthquake. The water absorbs and spreads the floor\'s shaking, so you barely feel it. The waterbed is the isolator. The key: the waterbed must be softer (lower natural frequency) than the earthquake\'s shaking frequency. A rigid bed would transmit the shaking directly.',
      storyConnection: 'The bamboo grove in the story sways in the wind but the ground beneath remains still. This is natural vibration isolation: the flexible bamboo stems absorb wind energy and convert it to internal friction heat, preventing the ground from shaking. Bamboo\'s flexibility makes it a natural vibration isolator — which is why bamboo buildings survive earthquakes better than rigid concrete.',
      checkQuestion: 'Why are hospital MRI machines mounted on special vibration-isolating platforms?',
      checkAnswer: 'MRI machines detect nuclear magnetic resonance signals that are incredibly faint. Floor vibrations (from traffic, HVAC, people walking) can blur the images. The isolation platform has a very low natural frequency (~1 Hz), making it transparent to the MRI\'s operating frequencies but blocking higher-frequency floor vibrations. Without isolation, many MRI images would be unusable.',
      codeIntro: 'Plot transmissibility curves and design an isolation system for a specific application.',
      code: `import numpy as np
import matplotlib.pyplot as plt

r = np.linspace(0.01, 5, 500)  # frequency ratio

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Transmissibility for different damping
ax1.set_facecolor('#111827')
zeta_values = [0.01, 0.1, 0.25, 0.5, 1.0]
colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

for zeta, color in zip(zeta_values, colors):
    T = np.sqrt((1 + (2*zeta*r)**2) / ((1-r**2)**2 + (2*zeta*r)**2))
    ax1.semilogy(r, T, color=color, linewidth=2, label=f'ζ={zeta}')

ax1.axhline(1, color='white', linestyle='--', alpha=0.3)
ax1.axvline(np.sqrt(2), color='white', linestyle=':', alpha=0.3)
ax1.text(np.sqrt(2) + 0.05, 5, 'r = √2\n(isolation begins)', color='white', fontsize=8)

ax1.fill_between([0, np.sqrt(2)], 0.01, 100, alpha=0.05, color='#ef4444')
ax1.fill_between([np.sqrt(2), 5], 0.01, 100, alpha=0.05, color='#22c55e')
ax1.text(0.5, 0.015, 'AMPLIFICATION\nzone', ha='center', color='#ef4444', fontsize=9)
ax1.text(3, 0.015, 'ISOLATION\nzone', ha='center', color='#22c55e', fontsize=9)

ax1.set_xlabel('Frequency ratio (r = ω/ωn)', color='white')
ax1.set_ylabel('Transmissibility |T|', color='white')
ax1.set_title('Vibration Transmissibility', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.set_ylim(0.01, 50)
ax1.set_xlim(0, 5)
ax1.tick_params(colors='gray')

# Design example: isolating a machine from floor vibration
ax2.set_facecolor('#111827')

# Floor vibration spectrum (typical office building)
freq = np.linspace(1, 100, 200)  # Hz
floor_spectrum = 5 * np.exp(-((freq - 10)**2) / 50) + 2 * np.exp(-((freq - 30)**2) / 100) + 0.5

# Isolation mount with fn = 5 Hz, zeta = 0.1
fn_mount = 5
zeta_mount = 0.1
r_vals = freq / fn_mount
T_vals = np.sqrt((1 + (2*zeta_mount*r_vals)**2) / ((1-r_vals**2)**2 + (2*zeta_mount*r_vals)**2))

transmitted = floor_spectrum * T_vals

ax2.plot(freq, floor_spectrum, color='#ef4444', linewidth=2, label='Floor vibration')
ax2.plot(freq, transmitted, color='#22c55e', linewidth=2, label='After isolation (fn=5Hz)')
ax2.fill_between(freq, floor_spectrum, transmitted, where=transmitted < floor_spectrum,
                  alpha=0.15, color='#22c55e')

ax2.set_xlabel('Frequency (Hz)', color='white')
ax2.set_ylabel('Vibration amplitude', color='white')
ax2.set_title(f'Isolation Design: mount fn={fn_mount}Hz, ζ={zeta_mount}', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

# Calculate isolation effectiveness
reduction_db = -20 * np.log10(np.mean(T_vals[freq > fn_mount * np.sqrt(2)]))

plt.tight_layout()
plt.show()

print(f"Isolation mount design: fn = {fn_mount} Hz, ζ = {zeta_mount}")
print(f"  Isolation begins at: {fn_mount * np.sqrt(2):.1f} Hz")
print(f"  Average isolation above √2·fn: {reduction_db:.1f} dB")
print()
print("Design paradox:")
print("  Low damping → better isolation at high frequencies")
print("  Low damping → worse resonance amplification at fn")
print("  Solution: use LOW damping + avoid operating near fn")`,
      challenge: 'Design an isolation system for a telescope mirror that must be isolated from vibrations above 5 Hz. What natural frequency should the mount have? What damping ratio gives the best trade-off between isolation and resonance amplification?',
      successHint: 'Vibration isolation is one of the most widely applied concepts in mechanical engineering. Every car, building, and precision instrument uses the same transmissibility physics. The math is simple; the art is in choosing fn and zeta for each application.',
    },
    {
      title: 'Structural resonance testing — finding hidden weaknesses',
      concept: `Before a bridge, building, or aircraft is put into service, engineers test its vibration characteristics. The goal: find all natural frequencies and ensure none align with expected forcing frequencies.

**Modal analysis** identifies:
- **Natural frequencies** (eigenfrequencies): the frequencies at which the structure vibrates freely
- **Mode shapes** (eigenmodes): the pattern of deformation at each natural frequency
- **Damping ratios**: how quickly each mode decays

**Testing methods:**
1. **Impact hammer testing**: hit the structure with an instrumented hammer, measure the response with accelerometers. The impulse excites ALL frequencies simultaneously, and the frequency response reveals the natural frequencies
2. **Shaker testing**: attach a vibration shaker and sweep through frequencies. Measure the transmissibility at each frequency. Slower but more controlled
3. **Ambient vibration testing**: measure the structure's response to natural excitation (wind, traffic, ground vibration). Used for large structures (bridges, buildings) that cannot be shaken artificially
4. **Operational modal analysis**: same as ambient, but uses statistical techniques (stochastic subspace identification) to extract modes

**In practice:**
- A car body has ~50 significant modes below 200 Hz
- A suspension bridge has ~20 modes below 1 Hz
- An aircraft wing has ~100 modes below 50 Hz
- Each mode must be checked for potential resonance with known forcing sources`,
      analogy: 'Modal analysis is like a medical checkup for structures. The doctor (engineer) taps (impacts) and listens (measures) to find weak spots. A healthy structure has no modes near operational frequencies. An unhealthy one has modes that could be excited — like a heart murmur (a structural vibration) that indicates a valve problem.',
      storyConnection: 'When the wind hits a bamboo grove, each culm (stem) resonates at its own natural frequency — determined by its length, diameter, and wall thickness. A botanist doing "modal analysis" on bamboo would tap each culm and measure the ringing frequency. This is exactly what engineers do with bridges: tap and listen.',
      checkQuestion: 'An engineer discovers that a building\'s natural frequency is 2 Hz — the same as typical earthquake ground motion. What should they do?',
      checkAnswer: 'Three options: (1) Stiffen the building (increase natural frequency above 2 Hz, so r < 1 and the earthquake frequency falls in the isolation zone). (2) Add damping (reduce the amplification at resonance — tuned mass dampers, viscous dampers). (3) Base isolation (put the building on rubber bearings with fn ~ 0.5 Hz, so earthquake frequencies are well above fn, in the isolation zone). Option 3 is the gold standard for earthquake engineering.',
      codeIntro: 'Simulate an impact hammer test on a multi-degree-of-freedom structure and extract its modal frequencies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a structure with 3 modes
# (simplified as superposition of 3 damped oscillators)
t = np.linspace(0, 2, 4000)  # 2 seconds at 2000 Hz sampling
dt = t[1] - t[0]

# Three modes
modes = [
    {'fn': 15, 'zeta': 0.02, 'amplitude': 1.0},   # Mode 1
    {'fn': 42, 'zeta': 0.03, 'amplitude': 0.5},    # Mode 2
    {'fn': 78, 'zeta': 0.015, 'amplitude': 0.3},   # Mode 3
]

# Impact force (short pulse at t=0)
impact = np.zeros_like(t)
impact[0:5] = 1000  # short, high-amplitude pulse

# Response = sum of modal responses
response = np.zeros_like(t)
for mode in modes:
    omega_n = 2 * np.pi * mode['fn']
    zeta = mode['zeta']
    omega_d = omega_n * np.sqrt(1 - zeta**2)
    amp = mode['amplitude']
    response += amp * np.exp(-zeta * omega_n * t) * np.sin(omega_d * t)

# Add noise
response += np.random.normal(0, 0.02, len(t))

# FFT to extract frequencies
n = len(t)
freq = np.fft.rfftfreq(n, dt)
spectrum = np.abs(np.fft.rfft(response)) / n

fig, axes = plt.subplots(3, 1, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Impact force
ax = axes[0]
ax.set_facecolor('#111827')
ax.plot(t[:100] * 1000, impact[:100], color='#ef4444', linewidth=2)
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Force (N)', color='white')
ax.set_title('Impact Hammer Force', color='#ef4444', fontsize=11)
ax.tick_params(colors='gray')

# Time response
ax = axes[1]
ax.set_facecolor('#111827')
ax.plot(t, response, color='#3b82f6', linewidth=0.8)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Acceleration (m/s²)', color='white')
ax.set_title('Structure Response (accelerometer)', color='#3b82f6', fontsize=11)
ax.tick_params(colors='gray')

# Frequency spectrum
ax = axes[2]
ax.set_facecolor('#111827')
ax.plot(freq, spectrum, color='#22c55e', linewidth=1)
ax.fill_between(freq, spectrum, alpha=0.15, color='#22c55e')

# Mark peaks
for mode in modes:
    fn = mode['fn']
    idx = np.argmin(np.abs(freq - fn))
    ax.plot(fn, spectrum[idx], 'o', color='#f59e0b', markersize=10)
    ax.annotate(f'Mode: {fn} Hz\nζ={mode["zeta"]}',
                (fn, spectrum[idx]), xytext=(fn+5, spectrum[idx]*0.8),
                color='#f59e0b', fontsize=9,
                arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Amplitude', color='white')
ax.set_title('Frequency Response Function (FRF)', color='#22c55e', fontsize=11)
ax.set_xlim(0, 120)
ax.tick_params(colors='gray')

plt.suptitle('Impact Hammer Modal Analysis', color='white', fontsize=13, y=1.01)
plt.tight_layout()
plt.show()

print("Modal analysis results:")
print(f"{'Mode':<8} {'Frequency':<15} {'Damping':<12} {'Amplitude':<12}")
print("-" * 47)
for i, mode in enumerate(modes, 1):
    print(f"  {i:<6} {mode['fn']:>6} Hz      ζ={mode['zeta']:<8} {mode['amplitude']}")
print()
print("If any of these frequencies matches an expected forcing frequency")
print("(wind, traffic, earthquake, machinery), the structure needs modification.")`,
      challenge: 'Add a 4th mode at 50 Hz (close to Mode 2 at 42 Hz). Can the FFT resolve them as separate peaks? What frequency resolution (sampling duration) is needed to distinguish modes that are 8 Hz apart? This is the fundamental resolution limit of spectral analysis.',
      successHint: 'Modal analysis is how engineers ensure that every structure you use — every bridge, building, car, and aircraft — will not shake itself apart. It is the practical application of everything in this module: natural frequencies, damping, resonance, and forced vibration.',
    },
    {
      title: 'Acoustic metamaterials — engineering impossible materials',
      concept: `**Acoustic metamaterials** are artificially structured materials designed to control sound and vibration in ways that natural materials cannot. They are to acoustics what lenses are to optics — but far more powerful.

**What makes them "meta":**
Natural materials have properties determined by their chemistry (atoms, molecules). Metamaterials have properties determined by their **structure** (geometry, arrangement of unit cells). By designing the structure, engineers can create materials with properties that don't exist in nature:

**Capabilities:**
1. **Negative effective mass**: unit cells oscillate out of phase with the wave, creating a band gap (frequency range where no sound propagates)
2. **Sound focusing**: curved arrays of resonators focus sound to a point (acoustic lens)
3. **Cloaking**: sound waves bend around an object, making it acoustically invisible
4. **Subwavelength isolation**: stop low-frequency sound with structures much thinner than the wavelength (impossible with conventional materials)

**Applications:**
- Noise barriers that block traffic noise without being massive walls
- Seismic cloaking: protect buildings from earthquake waves
- Ultrasound focusing for medical imaging and surgery
- Soundproofing that is thin and lightweight
- Vibration isolation platforms for sensitive instruments

The field is young (first acoustic metamaterial demonstrated in 2000) but growing rapidly.`,
      analogy: 'A metamaterial is like a choreographed crowd. If every person in a stadium does the wave at the same speed as a real wave, they become transparent (wave passes through). If they do the wave at a different speed or direction, they can redirect, focus, or block the wave. The "material property" is not the people themselves but how they are coordinated.',
      storyConnection: 'Bamboo groves naturally create acoustic metamaterial-like effects. The regularly spaced culms act as a periodic array that scatters certain sound frequencies while transmitting others. Walk into a dense bamboo grove and notice how outside sounds are filtered — high frequencies are scattered by the culms, while low frequencies pass through. It is a natural sound filter.',
      checkQuestion: 'If you could cloak a building from earthquake waves, what would happen to the energy of those waves?',
      checkAnswer: 'The waves would bend around the building (like water flowing around a rock) and reconverge behind it. The energy is not absorbed — it is redirected. This means buildings BEHIND the cloaked building might receive MORE energy than usual (like a lens focusing light). Seismic cloaking protects one building but potentially endangers its neighbours. This is an active area of ethical and engineering debate.',
      codeIntro: 'Simulate a simple acoustic metamaterial: a periodic array of resonators that creates a band gap.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1D metamaterial: chain of masses connected by springs with local resonators
# Main chain: mass M, spring K
# Local resonators: mass m, spring k, attached to each main mass

M = 1.0   # main chain mass
K = 100.0  # main chain spring
m = 0.3   # resonator mass
k = 30.0   # resonator spring

# Dispersion relation for this system
# Two branches: acoustic and optical

n_points = 500
q = np.linspace(0.01, np.pi, n_points)  # wavenumber (0 to pi/a)

omega_r = np.sqrt(k / m)  # resonator frequency

# Dispersion relation (simplified for infinite chain)
# Solving: det(D - omega^2 * M_matrix) = 0
# Gives two branches

omega_sq_1 = np.zeros(n_points)
omega_sq_2 = np.zeros(n_points)

for i, qi in enumerate(q):
    a11 = 2 * K * (1 - np.cos(qi)) / M + k / M
    a12 = -k / M
    a21 = -k / m
    a22 = k / m

    # Eigenvalues of [[a11, a12], [a21, a22]]
    trace = a11 + a22
    det = a11 * a22 - a12 * a21
    discriminant = trace**2 - 4 * det

    omega_sq_1[i] = (trace - np.sqrt(max(0, discriminant))) / 2
    omega_sq_2[i] = (trace + np.sqrt(max(0, discriminant))) / 2

omega_1 = np.sqrt(np.maximum(omega_sq_1, 0))
omega_2 = np.sqrt(np.maximum(omega_sq_2, 0))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Dispersion curves
ax1.set_facecolor('#111827')
ax1.plot(q / np.pi, omega_1 / (2*np.pi), color='#3b82f6', linewidth=2, label='Acoustic branch')
ax1.plot(q / np.pi, omega_2 / (2*np.pi), color='#ef4444', linewidth=2, label='Optical branch')

# Band gap
gap_bottom = np.max(omega_1) / (2*np.pi)
gap_top = np.min(omega_2) / (2*np.pi)
ax1.axhspan(gap_bottom, gap_top, alpha=0.2, color='#f59e0b')
ax1.text(0.5, (gap_bottom + gap_top)/2, f'BAND GAP\n({gap_bottom:.1f} - {gap_top:.1f} Hz)',
         ha='center', va='center', color='#f59e0b', fontsize=10, fontweight='bold')

ax1.axhline(omega_r / (2*np.pi), color='#22c55e', linestyle='--', alpha=0.5, label=f'Resonator freq ({omega_r/(2*np.pi):.1f} Hz)')
ax1.set_xlabel('Normalised wavenumber (q/π)', color='white')
ax1.set_ylabel('Frequency (Hz)', color='white')
ax1.set_title('Metamaterial Dispersion Relation', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Transmission spectrum (what gets through)
ax2.set_facecolor('#111827')
freq_test = np.linspace(0.1, 4 * omega_r / (2*np.pi), 500)
n_cells = 10  # 10-cell metamaterial

transmission = np.zeros_like(freq_test)
for fi, f in enumerate(freq_test):
    omega = 2 * np.pi * f
    # Simplified transmission through n_cells
    # In the band gap, transmission drops exponentially
    in_gap = (f > gap_bottom) and (f < gap_top)
    if in_gap:
        transmission[fi] = np.exp(-n_cells * 0.5)  # evanescent
    else:
        # Outside gap: some transmission with oscillations
        transmission[fi] = 0.8 + 0.2 * np.sin(n_cells * omega / omega_r)

transmission = np.clip(transmission, 0, 1)

ax2.plot(freq_test, transmission, color='#22c55e', linewidth=2)
ax2.fill_between(freq_test, transmission, alpha=0.15, color='#22c55e')
ax2.axvspan(gap_bottom, gap_top, alpha=0.15, color='#f59e0b')
ax2.text((gap_bottom + gap_top)/2, 0.5, 'Band gap\n(no transmission)',
         ha='center', color='#f59e0b', fontsize=10)

ax2.set_xlabel('Frequency (Hz)', color='white')
ax2.set_ylabel('Transmission', color='white')
ax2.set_title(f'Transmission Through {n_cells}-Cell Metamaterial', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Metamaterial parameters:")
print(f"  Main chain: M={M}kg, K={K}N/m")
print(f"  Resonators: m={m}kg, k={k}N/m")
print(f"  Resonator frequency: {omega_r/(2*np.pi):.1f} Hz")
print(f"  Band gap: {gap_bottom:.1f} - {gap_top:.1f} Hz")
print(f"  Gap width: {gap_top - gap_bottom:.1f} Hz")
print()
print("Within the band gap, sound CANNOT propagate.")
print("The local resonators absorb and reflect the energy.")
print("This allows thin, lightweight sound barriers that block")
print("specific frequency ranges — impossible with normal materials.")`,
      challenge: 'Change the resonator mass m from 0.3 to 0.6. How does the band gap change? Heavier resonators create wider gaps. What mass ratio m/M gives the widest band gap? This is a key design parameter for metamaterial engineers.',
      successHint: 'From the bamboo\'s natural vibration to acoustic metamaterials, you have journeyed from the simplest oscillator to the frontier of materials science. Vibration engineering connects physics, music, structural safety, and cutting-edge technology — all unified by the mathematics of oscillation.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Deep Dive
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Vibration Engineering</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for vibration engineering simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
