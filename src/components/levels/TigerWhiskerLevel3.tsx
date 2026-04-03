import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function TigerWhiskerLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Vibration sensing — how whiskers detect the invisible',
      concept: `A tiger's whiskers are not passive hairs — they are precision vibration sensors. Each whisker is a tapered, stiff beam embedded in a **follicle-sinus complex** (FSC), a capsule filled with blood and packed with mechanoreceptor nerve endings. When the whisker tip deflects even a few micrometers, the base transmits that motion to the receptors, which convert it into electrical nerve signals.

The physics of whisker sensing begins with the **cantilever beam model**. A whisker is essentially a tapered cantilever — fixed at the base (in the follicle) and free at the tip. When an external force or airflow deflects the tip, the resulting bending moment is largest at the base, where the receptors are located. This is mechanically advantageous: the whisker amplifies tiny tip deflections into large base moments.

The deflection of a cantilever beam under a point load F at the tip is: delta = F * L^3 / (3 * E * I), where L is length, E is Young's modulus, and I is the second moment of area (I = pi * r^4 / 4 for a circular cross-section). For a tiger whisker — about 10 cm long, 0.5 mm base diameter, made of keratin (E ~ 4 GPa) — this gives a tip stiffness of roughly 0.01 N/m. A breeze of 1 m/s produces enough force to deflect the tip by several millimeters. The tiger can feel air currents, nearby surfaces, and prey movements through its whiskers alone.`,
      analogy: 'A whisker is like a fishing rod detecting a nibble. The rod is long and flexible, and a tiny tug at the tip creates a noticeable bend that you feel at the handle. The rod amplifies the fish\'s gentle bite into a signal your hand can detect. Similarly, the whisker amplifies microscopic deflections at the tip into signals that nerve endings at the base can detect. Both are cantilever-based mechanical amplifiers.',
      storyConnection: 'The tiger in the story moves through dense undergrowth in total darkness, never bumping into a single branch. The villagers believed the tiger had night vision beyond any animal. In truth, the whiskers are doing the navigation. Each whisker sweeps the space ahead, detecting obstacles through deflection, airflow changes through vibration, and prey through the faintest tremor in the ground or air.',
      checkQuestion: 'A whisker is 10 cm long with a base diameter of 0.5 mm. If the tip deflects by 2 mm under a force F, what is the bending moment at the base? (Hint: M = F * L, and F = delta * 3EI/L^3)',
      checkAnswer: 'First find F: I = pi * (0.25e-3)^4 / 4 = 3.07e-15 m^4. F = 0.002 * 3 * 4e9 * 3.07e-15 / (0.1)^3 = 0.002 * 3.68e-2 = 7.37e-5 N = 73.7 microNewtons. Then M = F * L = 73.7e-6 * 0.1 = 7.37e-6 Nm = 7.37 microNewton-meters. This tiny moment is enough to excite hundreds of mechanoreceptors at the base. The whisker is an extraordinarily sensitive force sensor.',
      codeIntro: 'Model a whisker as a tapered cantilever beam and calculate deflection profiles, sensitivity, and the forces it can detect.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Whisker cantilever beam model
E_keratin = 4e9  # Pa (Young's modulus of keratin)
L = 0.10  # 10 cm whisker length
r_base = 0.25e-3  # 0.5 mm base diameter -> 0.25 mm radius
r_tip = 0.05e-3  # 0.1 mm tip diameter (tapered)

# Discretize whisker along its length
n_points = 200
x = np.linspace(0, L, n_points)

# Tapered radius profile: linear taper
r_profile = r_base - (r_base - r_tip) * x / L

# Second moment of area at each point
I_profile = np.pi * r_profile**4 / 4

# Cantilever deflection under tip load F
F_tip = 1e-4  # 100 microNewtons

# For tapered beam, need numerical integration
# d2y/dx2 = M(x) / (E * I(x)) where M(x) = F * (L - x)
M_profile = F_tip * (L - x)
curvature = M_profile / (E_keratin * I_profile)

# Double integrate curvature to get deflection
# dy/dx = integral of curvature
# y = integral of dy/dx
slope = np.cumsum(curvature) * (x[1] - x[0])
slope -= slope[0]  # Fixed at base: slope = 0 at x=0 (simplified)
deflection = np.cumsum(slope) * (x[1] - x[0])

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Whisker geometry (tapered profile)
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.fill_between(x * 1000, -r_profile * 1000, r_profile * 1000,
                color='#f59e0b', alpha=0.6)
ax.plot(x * 1000, r_profile * 1000, color='#f59e0b', linewidth=2)
ax.plot(x * 1000, -r_profile * 1000, color='#f59e0b', linewidth=2)
ax.set_xlabel('Distance from base (mm)', color='white')
ax.set_ylabel('Radius (mm)', color='white')
ax.set_title('Whisker taper profile', color='white', fontsize=11)
ax.set_aspect('auto')
ax.axvline(0, color='#ef4444', linewidth=3, label='Follicle (fixed)')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Second moment of area along length
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.semilogy(x * 1000, I_profile, color='#3b82f6', linewidth=2)
ax.set_xlabel('Distance from base (mm)', color='white')
ax.set_ylabel('I (m^4)', color='white')
ax.set_title('Stiffness (I) along whisker', color='white', fontsize=11)
ax.text(50, I_profile[100], f'I_base = {I_profile[0]:.2e} m^4\\nI_tip = {I_profile[-1]:.2e} m^4\\nRatio: {I_profile[0]/I_profile[-1]:.0f}x',
        color='white', fontsize=8, bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#3b82f6'))

# Plot 3: Deflection profile under tip load
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(x * 1000, deflection * 1000, color='#22c55e', linewidth=2)
ax.set_xlabel('Distance from base (mm)', color='white')
ax.set_ylabel('Deflection (mm)', color='white')
ax.set_title(f'Deflection under {F_tip*1e6:.0f} uN tip load', color='white', fontsize=11)
ax.axhline(0, color='gray', linestyle='--', alpha=0.3)
ax.text(L * 500, deflection[-1] * 500, f'Tip deflection: {deflection[-1]*1000:.2f} mm',
        color='#22c55e', fontsize=9)

# Plot 4: Bending moment along whisker
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(x * 1000, M_profile * 1e6, color='#ef4444', linewidth=2)
ax.fill_between(x * 1000, 0, M_profile * 1e6, alpha=0.2, color='#ef4444')
ax.set_xlabel('Distance from base (mm)', color='white')
ax.set_ylabel('Bending moment (uN*m)', color='white')
ax.set_title('Moment is maximum at BASE', color='white', fontsize=11)
ax.annotate('Receptors here!', xy=(0, M_profile[0] * 1e6),
            xytext=(20, M_profile[0] * 0.5e6), color='#fbbf24', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#fbbf24', lw=2))

# Plot 5: Sensitivity — tip deflection vs applied force
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

forces_uN = np.linspace(0, 500, 100)  # 0 to 500 microNewtons
# Tip stiffness for uniform beam: k = 3EI/L^3
# For tapered, use numerical result
k_tip = F_tip / deflection[-1]  # N/m
deflections_mm = forces_uN * 1e-6 / k_tip * 1000

ax.plot(forces_uN, deflections_mm, color='#a855f7', linewidth=2)
ax.set_xlabel('Applied force (microNewtons)', color='white')
ax.set_ylabel('Tip deflection (mm)', color='white')
ax.set_title(f'Sensitivity: k = {k_tip:.4f} N/m', color='white', fontsize=11)

# Mark detection threshold
threshold_um = 10  # 10 micrometer detection threshold
F_threshold = threshold_um * 1e-6 * k_tip * 1e6  # in uN
ax.axhline(threshold_um / 1000, color='#22c55e', linestyle='--', alpha=0.7)
ax.text(250, threshold_um / 1000 + 0.1, f'Detection threshold: {threshold_um} um',
        color='#22c55e', fontsize=8)

# Plot 6: Comparison with different whisker lengths
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

lengths = [0.03, 0.05, 0.08, 0.10, 0.15]  # meters
stiffnesses = []
for Li in lengths:
    xi = np.linspace(0, Li, 200)
    ri = r_base - (r_base - r_tip) * xi / Li
    Ii = np.pi * ri**4 / 4
    Mi = F_tip * (Li - xi)
    ci = Mi / (E_keratin * Ii)
    si = np.cumsum(ci) * (xi[1] - xi[0])
    si -= si[0]
    di = np.cumsum(si) * (xi[1] - xi[0])
    ki = F_tip / di[-1] if di[-1] > 0 else float('inf')
    stiffnesses.append(ki)

ax.semilogy([l * 100 for l in lengths], stiffnesses, 'o-', color='#06b6d4', linewidth=2, markersize=8)
ax.set_xlabel('Whisker length (cm)', color='white')
ax.set_ylabel('Tip stiffness (N/m)', color='white')
ax.set_title('Longer whiskers = more sensitive', color='white', fontsize=11)

for l, k in zip(lengths, stiffnesses):
    ax.annotate(f'{k:.3f} N/m', (l * 100, k), textcoords="offset points",
                xytext=(10, 5), color='white', fontsize=7)

plt.tight_layout()
plt.show()

print("Whisker Cantilever Beam Analysis:")
print(f"Whisker length: {L*100:.0f} cm")
print(f"Base diameter: {r_base*2*1000:.1f} mm, Tip: {r_tip*2*1000:.1f} mm")
print(f"Taper ratio: {r_base/r_tip:.1f}x")
print(f"I ratio (base/tip): {I_profile[0]/I_profile[-1]:.0f}x")
print()
print(f"Tip stiffness: {k_tip:.4f} N/m")
print(f"Tip deflection under {F_tip*1e6:.0f} uN: {deflection[-1]*1000:.2f} mm")
print(f"Base moment under same load: {M_profile[0]*1e6:.2f} uN*m")
print()
print(f"Minimum detectable force ({threshold_um} um threshold): {F_threshold:.1f} uN")
print("This is the weight of a grain of pollen. Tigers can feel air currents.")`,
      challenge: 'Model a whisker with a non-linear taper (r = r_base * (1 - x/L)^2 instead of linear). How does the deflection profile change? Does the parabolic taper make the whisker more or less sensitive at the tip?',
      successHint: 'The cantilever beam model explains why whiskers are tapered: the taper concentrates strain energy at the base where the receptors are. This is not accidental — it is optimal sensor design. Engineers use the same principle in MEMS cantilever sensors.',
    },
    {
      title: 'Resonance in biological structures — the whisker as a tuned antenna',
      concept: `A whisker is not just a static deflection sensor — it is a **resonant structure** with natural frequencies that determine which vibrations it amplifies and which it ignores. This is the physics of **resonance**: when an external vibration matches the natural frequency of the whisker, the amplitude of oscillation is dramatically amplified.

The natural frequencies of a cantilever beam are given by: f_n = (lambda_n^2 / (2*pi*L^2)) * sqrt(E*I / (rho*A)), where lambda_n is the modal constant (1.875 for mode 1, 4.694 for mode 2, 7.855 for mode 3), rho is density, and A is cross-sectional area. For a tiger whisker, the first natural frequency is typically 30-80 Hz, which corresponds exactly to the frequency range of prey movements and airflow disturbances.

This is not coincidence. Different whiskers on the tiger's face have different lengths, and therefore different natural frequencies. The array of whiskers forms a **frequency-selective sensor bank** — short whiskers respond to high frequencies (fine textures, rapid vibrations), long whiskers respond to low frequencies (airflow, distant movements). Together, they cover the full frequency range relevant to hunting. This is analogous to the basilar membrane in the ear, where different positions respond to different frequencies.

At resonance, the quality factor **Q** determines amplification. Biological whiskers have Q values of 5-20, meaning resonant vibrations are amplified 5-20x compared to off-resonance vibrations. This selective amplification is the whisker's secret weapon.`,
      analogy: 'Think of a set of wine glasses with different amounts of water. Each glass has a different natural frequency. When you run a wet finger around the rim of one glass, only THAT glass vibrates — the others are silent. If you could somehow "listen" to all the glasses simultaneously, you could identify what frequency someone was singing at by seeing which glass vibrated. Tiger whiskers are a set of tuned wine glasses on the face, each responding to a different frequency band.',
      storyConnection: 'The tiger in the story hunts at night, locating prey by the slightest rustle in the grass. Each whisker is tuned to a different frequency — short ones near the nose detect the high-frequency vibrations of a mouse scurrying, while long ones detect the low-frequency sway of grass pushed by a larger animal. The whisker array gives the tiger a frequency map of its surroundings, like having ears all over its face.',
      checkQuestion: 'A short whisker (3 cm) has a fundamental frequency of 200 Hz. A long whisker (10 cm) on the same face has what approximate fundamental frequency? (Hint: f is proportional to 1/L^2 for a cantilever)',
      checkAnswer: 'f_long = f_short * (L_short / L_long)^2 = 200 * (3/10)^2 = 200 * 0.09 = 18 Hz. The long whisker vibrates at 18 Hz — about 11x lower. This means the long whisker is tuned to detect slow movements (walking prey, wind shifts), while the short one detects rapid vibrations (heartbeats, insect wing flutters). The face is a frequency analyzer.',
      codeIntro: 'Calculate natural frequencies for whiskers of different lengths and simulate the frequency response showing resonance amplification.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Whisker resonance analysis
E = 4e9  # Pa (keratin)
rho = 1300  # kg/m^3 (keratin density)

# Modal constants for cantilever beam
lambda_n = [1.875, 4.694, 7.855, 10.996]
mode_names = ['Mode 1', 'Mode 2', 'Mode 3', 'Mode 4']

# Different whisker lengths (representing different positions on face)
whisker_set = [
    {'name': 'Mystacial (short)', 'L': 0.03, 'r': 0.15e-3, 'color': '#ef4444'},
    {'name': 'Mystacial (mid)', 'L': 0.06, 'r': 0.20e-3, 'color': '#f59e0b'},
    {'name': 'Mystacial (long)', 'L': 0.10, 'r': 0.25e-3, 'color': '#22c55e'},
    {'name': 'Supraorbital', 'L': 0.08, 'r': 0.20e-3, 'color': '#3b82f6'},
    {'name': 'Genal', 'L': 0.12, 'r': 0.30e-3, 'color': '#a855f7'},
]

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Calculate natural frequencies for each whisker
all_freqs = {}
for w in whisker_set:
    L, r = w['L'], w['r']
    A = np.pi * r**2
    I = np.pi * r**4 / 4
    freqs = []
    for lam in lambda_n:
        f = (lam**2 / (2 * np.pi * L**2)) * np.sqrt(E * I / (rho * A))
        freqs.append(f)
    all_freqs[w['name']] = freqs

# Plot 1: Natural frequencies for each whisker
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for i, w in enumerate(whisker_set):
    freqs = all_freqs[w['name']]
    ax.scatter([i] * len(freqs), freqs[:3], c=w['color'], s=80, zorder=5)
    for j, f in enumerate(freqs[:3]):
        ax.text(i + 0.15, f, f'{f:.0f} Hz', color=w['color'], fontsize=7, va='center')

ax.set_xticks(range(len(whisker_set)))
ax.set_xticklabels([w['name'] for w in whisker_set], color='white', fontsize=7, rotation=20)
ax.set_ylabel('Natural frequency (Hz)', color='white')
ax.set_title('Whisker natural frequencies (modes 1-3)', color='white', fontsize=11)
ax.set_yscale('log')

# Plot 2: Frequency response (amplitude vs driving frequency)
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

f_drive = np.linspace(1, 500, 2000)
Q = 10  # Quality factor

for w in whisker_set:
    f0 = all_freqs[w['name']][0]  # First mode
    # Amplitude response of damped harmonic oscillator
    ratio = f_drive / f0
    amplitude = 1.0 / np.sqrt((1 - ratio**2)**2 + (ratio / Q)**2)
    ax.plot(f_drive, amplitude, color=w['color'], linewidth=1.5,
            label=f"{w['name']} (f0={f0:.0f}Hz)")

ax.set_xlabel('Driving frequency (Hz)', color='white')
ax.set_ylabel('Amplitude gain', color='white')
ax.set_title(f'Frequency response (Q={Q})', color='white', fontsize=11)
ax.set_xlim(0, 500)
ax.set_ylim(0, Q * 1.2)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Q-factor effect on resonance
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

f0 = all_freqs[whisker_set[2]['name']][0]  # Long mystacial
Q_values = [2, 5, 10, 20, 50]
colors_q = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

for Q_val, color in zip(Q_values, colors_q):
    ratio = f_drive / f0
    amp = 1.0 / np.sqrt((1 - ratio**2)**2 + (ratio / Q_val)**2)
    ax.plot(f_drive, amp, color=color, linewidth=1.5, label=f'Q={Q_val}')

ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Amplitude gain', color='white')
ax.set_title(f'Q-factor effect (f0={f0:.0f} Hz)', color='white', fontsize=11)
ax.set_xlim(f0 * 0.3, f0 * 2)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Frequency coverage map
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for i, w in enumerate(whisker_set):
    f0 = all_freqs[w['name']][0]
    bandwidth = f0 / Q  # 3dB bandwidth
    ax.barh(i, bandwidth * 2, left=f0 - bandwidth, height=0.6,
            color=w['color'], alpha=0.6)
    ax.plot(f0, i, 'o', color=w['color'], markersize=8)

ax.set_yticks(range(len(whisker_set)))
ax.set_yticklabels([w['name'] for w in whisker_set], color='white', fontsize=8)
ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_title('Frequency coverage (3dB bandwidth)', color='white', fontsize=11)

# Add annotations for prey types
prey_ranges = [
    ('Mouse scurry', 80, 200, '#fbbf24'),
    ('Bird wing', 20, 50, '#94a3b8'),
    ('Deer walk', 2, 10, '#d4d4d4'),
]
for name, f_lo, f_hi, color in prey_ranges:
    ax.axvspan(f_lo, f_hi, alpha=0.1, color=color)
    ax.text((f_lo + f_hi) / 2, len(whisker_set) - 0.3, name,
            ha='center', color=color, fontsize=7, fontweight='bold')

# Plot 5: Mode shapes
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

x_norm = np.linspace(0, 1, 200)
mode_shapes = []
for n, lam in enumerate(lambda_n[:4]):
    # Cantilever mode shape (approximate)
    sigma = (np.cosh(lam) + np.cos(lam)) / (np.sinh(lam) + np.sin(lam))
    phi = np.cosh(lam * x_norm) - np.cos(lam * x_norm) - sigma * (np.sinh(lam * x_norm) - np.sin(lam * x_norm))
    phi /= np.max(np.abs(phi))  # Normalize
    mode_shapes.append(phi)
    ax.plot(x_norm * 100, phi + n * 2.5, color=['#ef4444', '#f59e0b', '#22c55e', '#3b82f6'][n],
            linewidth=2, label=f'Mode {n+1} (f = {all_freqs[whisker_set[2]["name"]][n]:.0f} Hz)')

ax.set_xlabel('Position along whisker (%)', color='white')
ax.set_ylabel('Mode shape (offset)', color='white')
ax.set_title('Vibration mode shapes', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Natural frequency vs length (scaling law)
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

L_range = np.linspace(0.02, 0.15, 100)
r_range = 0.002 * L_range + 0.1e-3  # Approximate scaling

for n, lam in enumerate(lambda_n[:3]):
    freqs_range = []
    for Li, ri in zip(L_range, r_range):
        A_i = np.pi * ri**2
        I_i = np.pi * ri**4 / 4
        f_i = (lam**2 / (2 * np.pi * Li**2)) * np.sqrt(E * I_i / (rho * A_i))
        freqs_range.append(f_i)
    ax.plot(L_range * 100, freqs_range, color=['#ef4444', '#f59e0b', '#22c55e'][n],
            linewidth=2, label=f'Mode {n+1}')

ax.set_xlabel('Whisker length (cm)', color='white')
ax.set_ylabel('Natural frequency (Hz)', color='white')
ax.set_title('Frequency scales as 1/L^2', color='white', fontsize=11)
ax.set_yscale('log')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Mark actual whiskers
for w in whisker_set:
    f0 = all_freqs[w['name']][0]
    ax.scatter(w['L'] * 100, f0, c=w['color'], s=60, zorder=5, edgecolors='white')

plt.tight_layout()
plt.show()

print("Whisker Resonance Analysis:")
print(f"{'Whisker':<22} {'L (cm)':>8} {'f1 (Hz)':>10} {'f2 (Hz)':>10} {'f3 (Hz)':>10}")
print("-" * 65)
for w in whisker_set:
    freqs = all_freqs[w['name']]
    print(f"{w['name']:<22} {w['L']*100:>8.1f} {freqs[0]:>10.1f} {freqs[1]:>10.1f} {freqs[2]:>10.1f}")
print()
print(f"Frequency coverage: {min(f[0] for f in all_freqs.values()):.0f} - {max(f[0] for f in all_freqs.values()):.0f} Hz (mode 1)")
print(f"Quality factor Q = {Q} gives bandwidth ~f0/{Q}")
print("The whisker array is a biological spectrum analyzer.")`,
      challenge: 'Add damping to the time-domain simulation. Apply a chirp signal (frequency sweeping from 1 Hz to 500 Hz) to the whisker tip and plot the amplitude response. Verify that the peak response occurs at the predicted natural frequency.',
      successHint: 'Resonant sensing is used everywhere in engineering: quartz crystal oscillators in watches, MEMS accelerometers in phones, and atomic force microscope cantilevers. The tiger whisker is a macroscale version of the same physics — a tuned mechanical resonator optimized by evolution.',
    },
    {
      title: 'Mechanoreceptors — converting motion to electrical signals',
      concept: `The whisker detects vibrations mechanically, but the brain needs electrical signals. The conversion happens in **mechanoreceptors** — specialized nerve endings at the base of each whisker. There are four main types in the follicle-sinus complex:

1. **Merkel cells**: Slowly adapting receptors that respond to sustained deflection. They signal the static position of the whisker — "how far is it bent?"
2. **Lanceolate endings**: Rapidly adapting receptors wrapped around the whisker shaft. They respond to changes in velocity — "how fast is the whisker moving?"
3. **Ruffini endings**: Respond to skin stretch, detecting the direction of the applied force.
4. **Free nerve endings**: Pain and extreme force detection — the safety system.

The conversion mechanism is **mechanotransduction**: physical deformation opens ion channels in the receptor membrane. When the whisker base moves, it stretches the receptor cell membrane, opening mechanically-gated ion channels. Ions (primarily Na+ and K+) flow through, creating a small voltage change called a **receptor potential**. If this potential exceeds a threshold, the neuron fires an **action potential** — a standard all-or-nothing electrical pulse that travels to the brain.

The key concept is **rate coding**: stronger stimuli cause faster firing rates. A gentle touch might produce 10 action potentials per second; a strong deflection might produce 500 per second. The brain reads the firing rate to determine stimulus intensity.`,
      analogy: 'Mechanoreceptors are like pressure gauges with electrical outputs. A mechanical pressure gauge has a needle that moves — that is the mechanical response. An electronic pressure transducer converts that same pressure into a voltage signal that a computer can read. The mechanoreceptor does the same conversion: mechanical deformation in, electrical voltage out. And just like a transducer, it has a calibration curve — more pressure means more voltage (or in biological terms, more deformation means faster firing).',
      storyConnection: 'When the tiger in the story brushes its whisker against a branch in the dark, what happens in microseconds is extraordinary: the whisker deflects, the base rotates in the follicle, mechanoreceptors stretch and open ion channels, receptor potentials trigger action potentials, and electrical signals race to the brain\'s somatosensory cortex. Within 20 milliseconds, the tiger knows the branch is there, how thick it is, and which direction to turn. All from a touch lighter than a breath.',
      checkQuestion: 'A Merkel cell fires at 50 Hz when a whisker is deflected 100 micrometers and at 200 Hz when deflected 400 micrometers. Is this relationship linear? What does this tell us about the receptor\'s sensitivity?',
      checkAnswer: 'Firing rate: 50 Hz at 100 um, 200 Hz at 400 um. Rate per um: 50/100 = 0.5 Hz/um and 200/400 = 0.5 Hz/um. Yes, this is linear: rate = 0.5 * deflection (in um). The receptor has constant sensitivity of 0.5 Hz per micrometer. In reality, most receptors have logarithmic responses (Weber-Fechner law), but over small ranges they appear linear. This makes signal processing easier for the brain.',
      codeIntro: 'Model the mechanotransduction process: from whisker deflection to receptor potential to action potential firing rate.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Mechanoreceptor model: deflection -> ion channels -> receptor potential -> spikes

# === Ion Channel Gating Model ===
def channel_open_probability(deflection_um, half_max=50, sensitivity=0.05):
    """Boltzmann function for mechanically-gated ion channel opening."""
    return 1.0 / (1.0 + np.exp(-sensitivity * (deflection_um - half_max)))

# === Receptor Potential Model ===
def receptor_potential(p_open, max_current=5e-9, R_membrane=100e6):
    """Convert channel opening to membrane voltage change."""
    I_channel = max_current * p_open  # Current through open channels
    V_receptor = I_channel * R_membrane  # Ohm's law
    return V_receptor  # in volts

# === Firing Rate Model (simplified LIF neuron) ===
def firing_rate(V_receptor, V_threshold=0.02, V_max=0.5, max_rate=500):
    """Leaky integrate-and-fire: receptor potential to firing rate."""
    rate = np.zeros_like(V_receptor)
    above_threshold = V_receptor > V_threshold
    rate[above_threshold] = max_rate * (V_receptor[above_threshold] - V_threshold) / (V_max - V_threshold)
    rate = np.clip(rate, 0, max_rate)
    return rate

# Generate deflection sweep
deflection = np.linspace(0, 200, 500)  # micrometers

# Four receptor types with different properties
receptors = [
    {'name': 'Merkel (slow)', 'half_max': 30, 'sens': 0.06, 'max_I': 5e-9,
     'threshold': 0.015, 'max_rate': 200, 'color': '#ef4444', 'adapt': 0.0},
    {'name': 'Lanceolate (fast)', 'half_max': 20, 'sens': 0.1, 'max_I': 8e-9,
     'threshold': 0.01, 'max_rate': 500, 'color': '#22c55e', 'adapt': 0.95},
    {'name': 'Ruffini (medium)', 'half_max': 50, 'sens': 0.04, 'max_I': 3e-9,
     'threshold': 0.02, 'max_rate': 150, 'color': '#3b82f6', 'adapt': 0.5},
    {'name': 'Free ending', 'half_max': 100, 'sens': 0.03, 'max_I': 2e-9,
     'threshold': 0.05, 'max_rate': 100, 'color': '#f59e0b', 'adapt': 0.0},
]

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Channel open probability
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for rec in receptors:
    p = channel_open_probability(deflection, rec['half_max'], rec['sens'])
    ax.plot(deflection, p, color=rec['color'], linewidth=2, label=rec['name'])

ax.set_xlabel('Deflection (um)', color='white')
ax.set_ylabel('Channel open probability', color='white')
ax.set_title('Ion channel gating curves', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Receptor potential
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for rec in receptors:
    p = channel_open_probability(deflection, rec['half_max'], rec['sens'])
    V = receptor_potential(p, rec['max_I'])
    ax.plot(deflection, V * 1000, color=rec['color'], linewidth=2, label=rec['name'])

ax.set_xlabel('Deflection (um)', color='white')
ax.set_ylabel('Receptor potential (mV)', color='white')
ax.set_title('Receptor potential generation', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Firing rate
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for rec in receptors:
    p = channel_open_probability(deflection, rec['half_max'], rec['sens'])
    V = receptor_potential(p, rec['max_I'])
    rate = firing_rate(V, rec['threshold'], 0.5, rec['max_rate'])
    ax.plot(deflection, rate, color=rec['color'], linewidth=2, label=rec['name'])

ax.set_xlabel('Deflection (um)', color='white')
ax.set_ylabel('Firing rate (Hz)', color='white')
ax.set_title('Neural firing rate (rate coding)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Time-domain response to step deflection
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

t = np.linspace(0, 0.5, 1000)  # 500 ms
step_deflection = np.where(t > 0.05, 100, 0)  # 100 um step at t=50ms

for rec in receptors:
    p = channel_open_probability(step_deflection, rec['half_max'], rec['sens'])
    V = receptor_potential(p, rec['max_I'])
    rate = firing_rate(V, rec['threshold'], 0.5, rec['max_rate'])
    # Apply adaptation
    adapt_factor = np.ones_like(t)
    adapt_mask = t > 0.05
    adapt_factor[adapt_mask] = (1 - rec['adapt']) + rec['adapt'] * np.exp(-(t[adapt_mask] - 0.05) / 0.05)
    adapted_rate = rate * adapt_factor
    ax.plot(t * 1000, adapted_rate, color=rec['color'], linewidth=2, label=rec['name'])

ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Firing rate (Hz)', color='white')
ax.set_title('Response to step deflection (100 um)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.axvline(50, color='gray', linestyle='--', alpha=0.5)
ax.text(52, 450, 'Stimulus onset', color='gray', fontsize=8)

# Plot 5: Spike train visualization
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

np.random.seed(42)
for i, rec in enumerate(receptors):
    # Generate Poisson spike train based on firing rate
    avg_rate = 100 if i < 3 else 30  # Hz
    # For step: high rate then adapt
    for j, t_spike in enumerate(np.sort(np.random.exponential(1.0/max(avg_rate, 1), size=50)).cumsum()):
        if t_spike < 0.5:
            # Adaptation: reduce probability over time
            adapt = (1 - rec['adapt']) + rec['adapt'] * np.exp(-t_spike / 0.05)
            if np.random.random() < adapt:
                ax.plot([t_spike * 1000, t_spike * 1000], [i - 0.3, i + 0.3],
                       color=rec['color'], linewidth=1)

ax.set_yticks(range(len(receptors)))
ax.set_yticklabels([r['name'] for r in receptors], color='white', fontsize=8)
ax.set_xlabel('Time (ms)', color='white')
ax.set_title('Spike trains (action potentials)', color='white', fontsize=11)

# Plot 6: Signal processing pipeline
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

stages = ['Whisker\\ndeflection', 'Channel\\nopening', 'Receptor\\npotential',
          'Action\\npotentials', 'Brain\\npercept']
stage_x = np.arange(len(stages))

# Signal "amplitude" at each stage (normalized)
amplitudes = [1.0, 0.6, 0.4, 0.8, 0.9]  # Amplified by neural processing
colors_stage = ['#f59e0b', '#ef4444', '#a855f7', '#22c55e', '#3b82f6']

bars = ax.bar(stage_x, amplitudes, color=colors_stage, alpha=0.8)
ax.set_xticks(stage_x)
ax.set_xticklabels(stages, color='white', fontsize=8)
ax.set_ylabel('Signal strength (normalized)', color='white')
ax.set_title('Sensory transduction pipeline', color='white', fontsize=11)

# Add arrows
for i in range(len(stages) - 1):
    ax.annotate('', xy=(i + 0.6, amplitudes[i + 1] + 0.05),
                xytext=(i + 0.4, amplitudes[i] + 0.05),
                arrowprops=dict(arrowstyle='->', color='white', lw=1.5))

plt.tight_layout()
plt.show()

print("Mechanoreceptor Summary:")
print(f"{'Receptor':<20} {'Threshold':>12} {'Max rate':>10} {'Adaptation':>12}")
print("-" * 58)
for rec in receptors:
    p_thresh = channel_open_probability(np.array([10]), rec['half_max'], rec['sens'])[0]
    print(f"{rec['name']:<20} {rec['half_max']:>10} um {rec['max_rate']:>8} Hz {rec['adapt']:>10.0%}")
print()
print("Key insight: different receptor types encode different aspects:")
print("  Merkel: position (how far bent)")
print("  Lanceolate: velocity (how fast moving)")
print("  Ruffini: direction (which way)")
print("  Free endings: damage (too much force)")
print("Together, they give the brain a complete mechanical description.")`,
      challenge: 'Add a sinusoidal stimulus (100 um amplitude, 50 Hz) and show how the rapidly adapting (Lanceolate) receptor responds only to the moving phases while the slowly adapting (Merkel) receptor responds continuously. This differential encoding is how the brain distinguishes texture from pressure.',
      successHint: 'Mechanotransduction is the bridge between physics and neuroscience. Every touch sensor — from your smartphone screen to a robot\'s pressure pad — must solve the same problem: convert mechanical deformation into an electrical signal. Biology does it with ion channels; engineers do it with piezoelectric materials and strain gauges.',
    },
    {
      title: 'Signal transduction — from single receptor to neural map',
      concept: `A single mechanoreceptor tells the brain very little. But a tiger has about 200 whiskers, each with hundreds of receptors. The brain must combine signals from all these receptors into a coherent **spatial map** of the environment. This is **signal transduction** at the system level.

The whisker signals travel through three stages of neural processing:

1. **Trigeminal ganglion**: First relay station. Each whisker's receptors converge onto a small group of neurons called a **barrelette**. At this stage, the signal is simply "whisker #47 was deflected by X micrometers at time T."

2. **Brainstem (trigeminal nucleus)**: Second relay. Here, signals from neighboring whiskers are combined. The neurons compute features like "the object contacted whiskers 45, 46, 47 in sequence, moving right to left." This is spatial-temporal integration.

3. **Somatosensory cortex (barrel cortex)**: Final processing. The cortex contains a precise topographic map — each whisker is represented by a distinct column of neurons called a **barrel**. The barrel cortex performs the highest-level computations: object recognition, texture discrimination, distance estimation.

The key engineering principle here is **population coding**: no single neuron carries complete information, but the pattern of activity across the population encodes everything. This is exactly how sensor arrays work in engineering — individual sensors are noisy and limited, but the array as a whole is precise and robust.`,
      analogy: 'Think of a touchscreen. Each individual capacitive sensor detects "finger present" or "no finger" — very basic information. But the array of thousands of sensors, processed by a controller chip, can track multiple fingers, detect swipe gestures, measure pressure, and recognize handwriting. The leap from single sensor to full touchscreen requires the same kind of population coding and spatial processing that the whisker system uses. One sensor is crude; thousands working together are brilliant.',
      storyConnection: 'The tiger in the story can identify a sambar deer from a barking deer by touch alone, in total darkness. It does this by sweeping its whiskers across the animal\'s body — the pattern of deflections across the whisker array creates a spatial signature. A sambar has coarse fur with wide spacing; a barking deer has fine, dense fur. The barrel cortex reads these patterns like a blind person reads Braille — through spatial population coding.',
      checkQuestion: 'A tiger sweeps its whisker array across a surface with 2 mm wide ridges spaced 5 mm apart. The whiskers are spaced 3 mm apart on the face. Can the whisker array resolve the individual ridges?',
      checkAnswer: 'The Nyquist sampling theorem says you need at least 2 samples per spatial period to resolve a feature. The ridge period is 5 mm, so you need samples every 2.5 mm or less. The whiskers are spaced 3 mm apart, which is too coarse — the array cannot fully resolve 5 mm ridges (it would alias). However, the tiger actively sweeps whiskers back and forth, effectively increasing spatial resolution through temporal oversampling. Active sensing overcomes the static resolution limit.',
      codeIntro: 'Simulate a whisker array scanning a textured surface and build a neural population code that discriminates different textures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Whisker array simulation: scanning a textured surface
np.random.seed(42)

# Define whisker array (simplified: 5 rows x 7 columns on one side of face)
n_rows = 5
n_cols = 7
n_whiskers = n_rows * n_cols

# Whisker positions (mm from nose tip)
whisker_positions = []
whisker_lengths = []
for row in range(n_rows):
    for col in range(n_cols):
        x = 5 + col * 4  # 4 mm spacing, starting 5mm from nose
        y = -8 + row * 4
        length = 30 + col * 12  # Longer whiskers further from nose
        whisker_positions.append((x, y))
        whisker_lengths.append(length)

# Define textures to scan
def generate_texture(texture_type, x_range, resolution=0.1):
    x = np.arange(x_range[0], x_range[1], resolution)
    if texture_type == 'smooth':
        return x, np.zeros_like(x)
    elif texture_type == 'fine_ridges':
        return x, 0.2 * np.sin(2 * np.pi * x / 2)  # 2mm period ridges
    elif texture_type == 'coarse_ridges':
        return x, 0.5 * np.sin(2 * np.pi * x / 8)  # 8mm period ridges
    elif texture_type == 'rough':
        return x, 0.3 * np.random.randn(len(x))
    elif texture_type == 'fur_fine':
        return x, 0.15 * np.sin(2 * np.pi * x / 1) + 0.05 * np.random.randn(len(x))
    elif texture_type == 'fur_coarse':
        return x, 0.4 * np.sin(2 * np.pi * x / 3) + 0.1 * np.random.randn(len(x))

textures = {
    'Smooth bark': 'smooth',
    'Fine fur (barking deer)': 'fur_fine',
    'Coarse fur (sambar)': 'fur_coarse',
    'Rough bark': 'rough',
}

# Simulate scanning: each whisker contacts the surface at its length
def scan_texture(texture_profile, whisker_lengths, sweep_speed=50):
    """Simulate whisker array scanning a texture.
    Returns deflection time series for each whisker."""
    x_tex, y_tex = texture_profile
    dt = 0.001  # 1ms timestep
    t_total = (x_tex[-1] - x_tex[0]) / sweep_speed  # time to sweep
    t = np.arange(0, t_total, dt)

    deflections = np.zeros((n_whiskers, len(t)))
    for i, length in enumerate(whisker_lengths):
        col = i % n_cols
        x_offset = col * 4  # Whisker contacts texture at different positions
        for ti, time in enumerate(t):
            x_contact = sweep_speed * time + x_offset
            if x_contact >= x_tex[0] and x_contact <= x_tex[-1]:
                idx = int((x_contact - x_tex[0]) / 0.1)
                idx = min(idx, len(y_tex) - 1)
                deflections[i, ti] = y_tex[idx] * (length / 100)  # Scale by whisker length

    return t, deflections

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Whisker array layout
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for i, (pos, length) in enumerate(zip(whisker_positions, whisker_lengths)):
    row = i // n_cols
    col = i % n_cols
    # Draw whisker as line from position extending outward
    angle = np.radians(-30 + row * 15)
    tip_x = pos[0] + length * 0.3 * np.cos(angle)
    tip_y = pos[1] + length * 0.3 * np.sin(angle)
    ax.plot([pos[0], tip_x], [pos[1], tip_y], color='#f59e0b', linewidth=1, alpha=0.7)
    ax.plot(pos[0], pos[1], 'o', color='#ef4444', markersize=3)

ax.set_xlabel('x (mm from nose)', color='white')
ax.set_ylabel('y (mm)', color='white')
ax.set_title(f'Whisker array ({n_whiskers} whiskers)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.invert_xaxis()

# Plot 2: Texture profiles
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

colors_tex = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b']
for (name, tex_type), color in zip(textures.items(), colors_tex):
    x, y = generate_texture(tex_type, (0, 30))
    ax.plot(x, y + list(textures.keys()).index(name) * 1.5, color=color, linewidth=1.5, label=name)

ax.set_xlabel('Position (mm)', color='white')
ax.set_ylabel('Surface height (offset)', color='white')
ax.set_title('Texture profiles', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Deflection raster for one texture
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

tex_profile = generate_texture('fur_coarse', (0, 50))
t_scan, defl = scan_texture(tex_profile, whisker_lengths)

# Show every 5th whisker
for i in range(0, n_whiskers, 5):
    ax.plot(t_scan * 1000, defl[i] * 5 + i / 5, color='#22c55e', linewidth=0.5, alpha=0.8)

ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Whisker index (offset)', color='white')
ax.set_title('Deflection raster (coarse fur)', color='white', fontsize=11)

# Plot 4: Population response (mean + variance)
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for (name, tex_type), color in zip(textures.items(), colors_tex):
    tex_prof = generate_texture(tex_type, (0, 50))
    t_s, d = scan_texture(tex_prof, whisker_lengths)
    mean_defl = np.mean(np.abs(d), axis=0)
    # Smooth
    kernel_size = 50
    if len(mean_defl) > kernel_size:
        smooth = np.convolve(mean_defl, np.ones(kernel_size)/kernel_size, mode='valid')
        t_smooth = t_s[:len(smooth)]
        ax.plot(t_smooth * 1000, smooth * 1000, color=color, linewidth=2, label=name)

ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Mean |deflection| (um)', color='white')
ax.set_title('Population mean response', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Feature extraction for texture classification
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Compute features for each texture
features_data = []
feature_names_list = ['Mean defl', 'Std defl', 'Max defl', 'Freq content']
for name, tex_type in textures.items():
    tex_prof = generate_texture(tex_type, (0, 50))
    t_s, d = scan_texture(tex_prof, whisker_lengths)
    mean_d = np.mean(np.abs(d))
    std_d = np.std(d)
    max_d = np.max(np.abs(d))
    # Frequency content: energy above 50 Hz
    fft_energy = 0
    for w in range(n_whiskers):
        if len(d[w]) > 10:
            fft_vals = np.abs(np.fft.rfft(d[w]))
            freqs = np.fft.rfftfreq(len(d[w]), d=0.001)
            high_freq_mask = freqs > 50
            fft_energy += np.sum(fft_vals[high_freq_mask])
    fft_energy /= n_whiskers
    features_data.append([mean_d * 1000, std_d * 1000, max_d * 1000, fft_energy * 1000])

features_arr = np.array(features_data)
# Normalize each feature
for j in range(features_arr.shape[1]):
    max_val = np.max(features_arr[:, j])
    if max_val > 0:
        features_arr[:, j] /= max_val

x_feat = np.arange(len(feature_names_list))
width = 0.2
for i, (name, color) in enumerate(zip(textures.keys(), colors_tex)):
    ax.bar(x_feat + i * width, features_arr[i], width, color=color, alpha=0.8,
           label=name.split('(')[0].strip())

ax.set_xticks(x_feat + width * 1.5)
ax.set_xticklabels(feature_names_list, color='white', fontsize=8)
ax.set_ylabel('Normalized feature value', color='white')
ax.set_title('Texture feature vectors', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Barrel cortex map (simplified)
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Draw barrel cortex as grid of circles
for row in range(n_rows):
    for col in range(n_cols):
        i = row * n_cols + col
        # Activity level based on coarse fur texture
        activity = np.mean(np.abs(defl[i])) * 1000
        size = 100 + activity * 500
        alpha_val = 0.3 + min(activity * 3, 0.7)
        ax.scatter(col, row, s=size, c='#22c55e', alpha=alpha_val, edgecolors='white', linewidths=0.5)
        ax.text(col, row, f'{activity:.1f}', ha='center', va='center', color='white', fontsize=6)

ax.set_xlabel('Column (posterior -> anterior)', color='white')
ax.set_ylabel('Row (dorsal -> ventral)', color='white')
ax.set_title('Barrel cortex activation map', color='white', fontsize=11)
ax.set_xlim(-0.5, n_cols - 0.5)
ax.set_ylim(-0.5, n_rows - 0.5)

plt.tight_layout()
plt.show()

print("Signal Transduction Summary:")
print(f"Whisker array: {n_rows} x {n_cols} = {n_whiskers} whiskers")
print(f"Whisker lengths: {min(whisker_lengths):.0f} - {max(whisker_lengths):.0f} mm")
print()
print("Texture discrimination features:")
for name, feats in zip(textures.keys(), features_data):
    print(f"  {name:<30} mean={feats[0]:.2f} std={feats[1]:.2f} max={feats[2]:.2f}")
print()
print("Population coding: each texture creates a unique pattern across the array.")
print("The barrel cortex maps this pattern to perception — like a tactile 'image'.")`,
      challenge: 'Add noise to each whisker\'s deflection signal (to simulate neural noise). How many whiskers does the array need to reliably discriminate between fine and coarse fur? This is the signal-to-noise benefit of population coding — more sensors means better discrimination despite noisy individuals.',
      successHint: 'Population coding is a universal principle in both neuroscience and engineering. Sensor arrays in autonomous vehicles, microphone arrays in smart speakers, and antenna arrays in 5G all use the same idea: individual sensors are weak, but the pattern across the array carries rich information.',
    },
    {
      title: 'Piezoelectric sensors — the engineering analog of whiskers',
      concept: `The tiger's mechanoreceptor converts mechanical deformation into electrical signals. Engineers do the same thing using **piezoelectric materials** — crystals and ceramics that generate a voltage when squeezed or bent. The word "piezo" comes from Greek for "press" — literally, electricity from pressure.

The piezoelectric effect arises from the crystal structure: when a piezoelectric material (like quartz, PZT ceramic, or PVDF polymer) is deformed, the positive and negative charges in the crystal lattice shift asymmetrically, creating a voltage across the material. The relationship is: V = g * sigma * t, where g is the **piezoelectric voltage constant** (V*m/N), sigma is the applied stress, and t is the material thickness.

Common piezoelectric sensor designs:
- **Compression sensor**: A disk of PZT ceramic sandwiched between electrodes. When compressed, it generates a voltage proportional to force. Used in force plates, pressure sensors.
- **Bending sensor (bimorph)**: Two layers of piezo material bonded together, bending in opposite directions. Very sensitive to deflection. Used in AFM tips, vibration sensors.
- **PVDF film**: Thin, flexible polymer film that can be shaped into any geometry. Lower sensitivity than PZT but far more flexible. Used in artificial whiskers.

The sensitivity of a piezoelectric sensor is characterized by the **charge constant** d (Coulombs/Newton): Q = d * F. For PZT-5A (a common sensor ceramic), d33 = 374 pC/N. A 1 N force produces 374 picocoulombs of charge. With a typical sensor capacitance of 1 nF, this gives V = Q/C = 0.374 V — easily measurable.`,
      analogy: 'A piezoelectric sensor is like a sponge full of water. Squeeze the sponge (apply stress) and water flows out (charge flows). Release the sponge and it absorbs water back (charge returns). The amount of water that flows out is proportional to how hard you squeeze. A mechanoreceptor works similarly — deformation squeezes open ion channels, and ions flow like the water from a sponge.',
      storyConnection: 'The tiger\'s whisker follicle is nature\'s piezoelectric sensor: mechanical deformation produces electrical output. Engineers building robot cats, search-and-rescue robots, or autonomous vehicles need the same capability — detecting obstacles through touch. Piezoelectric whisker sensors directly mimic the tiger\'s design: a flexible cantilever with a piezo element at the base, converting deflection into voltage. The story\'s tiger is the blueprint for the robot\'s sensor.',
      checkQuestion: 'A PZT bimorph sensor has charge constant d31 = 170 pC/N and capacitance 2 nF. If a 5 mN force is applied (simulating gentle whisker contact), what voltage does it generate? Is this measurable with standard electronics?',
      checkAnswer: 'Q = d * F = 170e-12 * 5e-3 = 0.85e-12 C = 0.85 pC. V = Q/C = 0.85e-12 / 2e-9 = 4.25e-4 V = 0.425 mV. This is small but measurable — a standard instrumentation amplifier with gain of 1000 would give 0.425 V, which any microcontroller ADC can read. For comparison, the tiger\'s mechanoreceptors can detect deflections producing forces 100x smaller. Biology still outperforms our best sensors.',
      codeIntro: 'Model piezoelectric sensor physics and compare performance with biological mechanoreceptors across different force ranges.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Piezoelectric sensor models

class PiezoSensor:
    """Model a piezoelectric sensor."""
    def __init__(self, name, d_constant, capacitance, area, thickness,
                 max_voltage=10, noise_uV=5, color='gray'):
        self.name = name
        self.d = d_constant  # C/N (charge constant)
        self.C = capacitance  # F
        self.area = area  # m^2
        self.thickness = thickness  # m
        self.max_voltage = max_voltage
        self.noise = noise_uV * 1e-6  # Convert to V
        self.color = color

    def voltage(self, force):
        """Output voltage for given force."""
        Q = self.d * force
        V = Q / self.C
        return np.clip(V, -self.max_voltage, self.max_voltage)

    def sensitivity(self):
        """V/N"""
        return self.d / self.C

    def min_detectable_force(self, snr=3):
        """Minimum force for SNR > 3."""
        return snr * self.noise * self.C / self.d

# Define sensor types
sensors = [
    PiezoSensor("PZT-5A disk", d_constant=374e-12, capacitance=1e-9,
                area=1e-4, thickness=1e-3, noise_uV=5, color='#ef4444'),
    PiezoSensor("PZT bimorph", d_constant=170e-12, capacitance=2e-9,
                area=5e-5, thickness=0.5e-3, noise_uV=10, color='#f59e0b'),
    PiezoSensor("PVDF film", d_constant=23e-12, capacitance=0.5e-9,
                area=2e-4, thickness=28e-6, noise_uV=20, color='#22c55e'),
    PiezoSensor("PVDF whisker", d_constant=23e-12, capacitance=0.3e-9,
                area=5e-5, thickness=28e-6, noise_uV=50, color='#3b82f6'),
]

# Biological reference
bio_min_force = 0.5e-6  # 0.5 uN (tiger whisker)
bio_max_force = 0.1  # 100 mN
bio_sensitivity = 500  # Hz/mN (firing rate per force)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Voltage output vs force
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

forces = np.logspace(-6, -1, 500)  # 1 uN to 100 mN

for sensor in sensors:
    V_out = sensor.voltage(forces)
    ax.loglog(forces * 1000, np.abs(V_out) * 1000, color=sensor.color,
              linewidth=2, label=sensor.name)

# Noise floors
for sensor in sensors:
    ax.axhline(sensor.noise * 1000, color=sensor.color, linestyle=':', alpha=0.3)

ax.set_xlabel('Force (mN)', color='white')
ax.set_ylabel('Output voltage (mV)', color='white')
ax.set_title('Sensor output vs force', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Sensitivity comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

sensitivities = [s.sensitivity() for s in sensors]
min_forces = [s.min_detectable_force() for s in sensors]
names = [s.name for s in sensors]
colors = [s.color for s in sensors]

bars = ax.barh(range(len(sensors)), [s * 1000 for s in sensitivities], color=colors, alpha=0.8)
ax.set_yticks(range(len(sensors)))
ax.set_yticklabels(names, color='white', fontsize=8)
ax.set_xlabel('Sensitivity (mV/N)', color='white')
ax.set_title('Sensor sensitivity comparison', color='white', fontsize=11)
ax.set_xscale('log')

for bar, sens in zip(bars, sensitivities):
    ax.text(bar.get_width() * 1.5, bar.get_y() + bar.get_height()/2,
            f'{sens*1000:.0f} mV/N', va='center', color='white', fontsize=7)

# Plot 3: Min detectable force comparison (with bio reference)
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

all_names = names + ['Tiger whisker']
all_min_forces = min_forces + [bio_min_force]
all_colors = colors + ['#a855f7']

bars = ax.barh(range(len(all_names)), [f * 1e6 for f in all_min_forces],
               color=all_colors, alpha=0.8)
ax.set_yticks(range(len(all_names)))
ax.set_yticklabels(all_names, color='white', fontsize=8)
ax.set_xlabel('Min detectable force (uN)', color='white')
ax.set_title('Detection threshold (lower = better)', color='white', fontsize=11)
ax.set_xscale('log')

for bar, f in zip(bars, all_min_forces):
    ax.text(bar.get_width() * 1.5, bar.get_y() + bar.get_height()/2,
            f'{f*1e6:.1f} uN', va='center', color='white', fontsize=7)

# Plot 4: Time response to impulse
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

t = np.linspace(0, 0.1, 5000)
# Impulse force
F_impulse = 0.01 * np.exp(-t / 0.002) * np.sin(2 * np.pi * 100 * t)  # 10 mN decaying

for sensor in sensors:
    V = sensor.voltage(np.abs(F_impulse))
    # Add RC decay (charge leaks through parallel resistance)
    R_leak = 1e9  # 1 GOhm (typical)
    tau_RC = R_leak * sensor.C
    decay = np.exp(-t / tau_RC)
    V_real = V * decay + sensor.noise * np.random.randn(len(t))
    ax.plot(t * 1000, V_real * 1000, color=sensor.color, linewidth=1, alpha=0.8, label=sensor.name)

ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Voltage (mV)', color='white')
ax.set_title('Response to 10mN impulse', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Frequency response
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

freq_range = np.logspace(0, 5, 500)  # 1 Hz to 100 kHz

for sensor in sensors:
    R_load = 1e9
    # Transfer function: H(f) = 1 / (1 + j*2*pi*f*R*C) -- high-pass for piezo
    tau = R_load * sensor.C
    # Piezo acts as high-pass with -3dB at f = 1/(2*pi*R*C)
    f_3dB = 1 / (2 * np.pi * tau)
    # Also has resonance based on mechanical properties
    f_res = 1e4 / (sensor.thickness * 1e3)  # Simplified
    H_mag = freq_range / np.sqrt(freq_range**2 + f_3dB**2)
    # Resonance peak
    ratio = freq_range / f_res
    H_res = 1 / np.sqrt((1 - ratio**2)**2 + (0.1 * ratio)**2)
    H_total = H_mag * np.minimum(H_res, 10)

    ax.semilogx(freq_range, 20 * np.log10(H_total), color=sensor.color,
                linewidth=2, label=f"{sensor.name} (f_lo={f_3dB:.0f}Hz)")

ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Gain (dB)', color='white')
ax.set_title('Frequency response', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.axhline(-3, color='gray', linestyle='--', alpha=0.3)

# Plot 6: Bio vs engineered radar chart (simplified as bar chart)
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

metrics = ['Sensitivity', 'Bandwidth', 'Size', 'Durability', 'Cost', 'Self-repair']
bio_scores = [10, 7, 9, 6, 10, 10]
pvdf_scores = [5, 8, 7, 8, 6, 0]
pzt_scores = [8, 9, 4, 7, 4, 0]

x_m = np.arange(len(metrics))
width = 0.25
ax.bar(x_m - width, bio_scores, width, color='#a855f7', alpha=0.8, label='Tiger whisker')
ax.bar(x_m, pvdf_scores, width, color='#22c55e', alpha=0.8, label='PVDF whisker')
ax.bar(x_m + width, pzt_scores, width, color='#ef4444', alpha=0.8, label='PZT sensor')

ax.set_xticks(x_m)
ax.set_xticklabels(metrics, color='white', fontsize=7, rotation=20)
ax.set_ylabel('Score (0-10)', color='white')
ax.set_title('Bio vs engineered sensors', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Piezoelectric Sensor Summary:")
print(f"{'Sensor':<18} {'d (pC/N)':>10} {'Sens (mV/N)':>14} {'Min force (uN)':>16}")
print("-" * 62)
for s in sensors:
    print(f"{s.name:<18} {s.d*1e12:>10.0f} {s.sensitivity()*1000:>14.1f} {s.min_detectable_force()*1e6:>16.1f}")
print(f"{'Tiger whisker':<18} {'N/A':>10} {'~500 Hz/mN':>14} {bio_min_force*1e6:>16.1f}")
print()
print("Gap: Tiger whisker detects forces 10-1000x smaller than piezo sensors.")
print("This is the frontier of bio-inspired sensor engineering.")`,
      challenge: 'Design a PVDF artificial whisker by choosing optimal length, thickness, and base geometry to maximize sensitivity while keeping the resonant frequency in the range 50-200 Hz (matching the tiger\'s hunting-relevant frequency range). What are the tradeoffs?',
      successHint: 'Piezoelectric sensors are the most direct engineering analog of biological mechanoreceptors. They are used in everything from ultrasound imaging to guitar pickups to earthquake detection. Understanding both the biological and engineered versions reveals the universal physics of force-to-electricity conversion.',
    },
    {
      title: 'Bio-inspired engineering — from whisker to robot sensor',
      concept: `The ultimate goal of studying the tiger's whisker system is **bio-inspired engineering**: designing artificial sensors and robots that replicate biological performance. This is not mere imitation — it is extracting design principles from biology and implementing them with engineering materials and fabrication methods.

The key design principles extracted from the whisker system:

1. **Tapered cantilever geometry**: Concentrates strain at the base where the sensor element is located. This is mechanically optimal for sensitivity and has been adopted in MEMS (Micro-Electro-Mechanical Systems) cantilever sensors.

2. **Multi-modal sensing**: Different receptor types (Merkel, Lanceolate, Ruffini) extract different features from the same mechanical input. Engineers implement this by placing multiple sensor elements (piezoelectric, strain gauge, accelerometer) on one whisker.

3. **Active sensing (whisking)**: The tiger does not passively wait for contact — it sweeps its whiskers back and forth at 5-25 Hz, actively probing the environment. This dramatically improves spatial resolution and object recognition. Robotic whiskers that actively whisk outperform passive ones by 10-100x in texture discrimination.

4. **Array processing**: The array of differently-tuned whiskers provides richer information than any single sensor. Implementing this requires signal processing algorithms inspired by the barrel cortex.

Current applications include: robot navigation in dark or dusty environments where cameras fail, underwater vehicle sensing where sonar is insufficient, surgical robots needing tactile feedback, and industrial quality control for surface finish inspection.`,
      analogy: 'Bio-inspired engineering is like translating a poem from one language to another. You cannot translate word-for-word — the grammar, idioms, and sounds are different. But you can capture the meaning, rhythm, and emotion using the tools of the target language. Similarly, we cannot copy a whisker cell-by-cell into a robot. But we can capture the sensing principles — cantilever geometry, resonant tuning, active scanning, array processing — and implement them with piezo films, microcontrollers, and signal processing algorithms. The "poem" of the whisker is preserved in a new "language."',
      storyConnection: 'The tiger from the story could navigate the densest jungle in total darkness, identify prey species by touch, and detect approaching threats through air vibrations. Imagine giving those same capabilities to a search-and-rescue robot exploring a collapsed building — no light, thick dust blocking cameras, and the need to distinguish a human from a concrete slab by touch. The tiger\'s whisker system, translated into engineering, could save lives in exactly this scenario.',
      checkQuestion: 'A robot whisker array has 16 PVDF whiskers of different lengths (2 cm to 12 cm) actively whisking at 10 Hz. It needs to discriminate between smooth metal, rough concrete, and human skin. What features from the whisker signals would you extract?',
      checkAnswer: 'Mean deflection amplitude (smooth metal is hard, skin is soft — different compliance), vibration frequency content (rough concrete produces high-frequency vibrations, smooth metal does not), temporal pattern during active whisking (skin deforms and recovers differently than rigid materials), and temperature (PVDF is also pyroelectric — skin is warm, metal and concrete are cold). Combining these features from 16 whiskers gives a rich feature vector for a classifier.',
      codeIntro: 'Design and simulate a complete bio-inspired robotic whisker sensor system, from individual sensor to array processing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Bio-Inspired Robotic Whisker System Design ===
np.random.seed(42)

class RoboticWhisker:
    """Model a single PVDF-based robotic whisker."""
    def __init__(self, length_cm, base_diameter_mm=1.0, pvdf_d=23e-12):
        self.L = length_cm / 100  # m
        self.r_base = base_diameter_mm / 2000  # m
        self.d = pvdf_d
        self.E = 2.5e9  # PVDF modulus
        self.I_base = np.pi * self.r_base**4 / 4
        self.k = 3 * self.E * self.I_base / self.L**3  # tip stiffness
        self.f0 = 1.875**2 / (2 * np.pi * self.L**2) * np.sqrt(
            self.E * self.I_base / (1780 * np.pi * self.r_base**2))
        self.C = 0.5e-9  # Sensor capacitance

    def response(self, force):
        """Deflection and voltage output."""
        deflection = force / self.k
        voltage = self.d * force / self.C
        return deflection, voltage

    def scan_surface(self, surface_func, sweep_speed, dt=0.001, t_total=0.5):
        """Simulate whisking across a surface."""
        t = np.arange(0, t_total, dt)
        # Active whisking: sinusoidal motion at 10 Hz
        whisk_angle = 15 * np.sin(2 * np.pi * 10 * t)  # degrees
        x_contact = self.L * np.sin(np.radians(whisk_angle)) + sweep_speed * t

        deflections = np.zeros_like(t)
        for i, xc in enumerate(x_contact):
            surface_height = surface_func(xc)
            # Contact force depends on penetration
            penetration = max(0, self.L * np.cos(np.radians(whisk_angle[i])) - surface_height)
            force = self.k * penetration * 0.1  # Scale factor
            deflections[i] = force / self.k if force > 0 else 0

        voltages = self.d * deflections * self.k / self.C
        # Add noise
        noise = 50e-6 * np.random.randn(len(t))  # 50 uV noise
        voltages += noise

        return t, deflections, voltages

# Define surface types
def smooth_metal(x):
    return 0.05  # Flat, 5cm from base

def rough_concrete(x):
    return 0.05 + 0.002 * np.sin(50 * x) + 0.001 * np.random.randn()

def human_skin(x):
    return 0.048 + 0.0005 * np.sin(10 * x)  # Soft, slightly deformable

def tree_bark(x):
    return 0.05 + 0.003 * np.sin(20 * x) + 0.002 * np.sin(7 * x)

surfaces = {
    'Smooth metal': (smooth_metal, '#3b82f6'),
    'Rough concrete': (rough_concrete, '#ef4444'),
    'Human skin': (human_skin, '#f59e0b'),
    'Tree bark': (tree_bark, '#22c55e'),
}

# Create whisker array (8 whiskers, different lengths)
whisker_array = [RoboticWhisker(l) for l in [3, 4, 5, 6, 7, 8, 10, 12]]

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Whisker array properties
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

lengths = [w.L * 100 for w in whisker_array]
freqs = [w.f0 for w in whisker_array]
stiffnesses = [w.k for w in whisker_array]

ax.plot(lengths, freqs, 'o-', color='#a855f7', linewidth=2, markersize=8, label='Natural freq (Hz)')
ax2 = ax.twinx()
ax2.plot(lengths, [k * 1000 for k in stiffnesses], 's-', color='#06b6d4', linewidth=2, markersize=8, label='Stiffness (mN/m)')
ax2.tick_params(colors='gray')
ax2.set_ylabel('Stiffness (mN/m)', color='#06b6d4')

ax.set_xlabel('Whisker length (cm)', color='white')
ax.set_ylabel('Natural frequency (Hz)', color='#a855f7')
ax.set_title('Whisker array specifications', color='white', fontsize=11)
ax.legend(loc='upper right', fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.legend(loc='center right', fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Single whisker response to each surface
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

whisker = whisker_array[3]  # 6 cm whisker
for name, (func, color) in surfaces.items():
    t, defl, volt = whisker.scan_surface(func, sweep_speed=0.02)
    ax.plot(t * 1000, volt * 1000, color=color, linewidth=1, alpha=0.8, label=name)

ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Voltage (mV)', color='white')
ax.set_title('6cm whisker: surface responses', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Feature extraction for classification
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

feature_vectors = {}
for name, (func, color) in surfaces.items():
    features = []
    for w in whisker_array:
        t, defl, volt = w.scan_surface(func, sweep_speed=0.02)
        mean_v = np.mean(np.abs(volt))
        std_v = np.std(volt)
        # Spectral energy in 50-200 Hz band
        fft = np.abs(np.fft.rfft(volt))
        freqs_fft = np.fft.rfftfreq(len(volt), d=0.001)
        band_mask = (freqs_fft > 50) & (freqs_fft < 200)
        spectral_energy = np.sum(fft[band_mask])
        features.extend([mean_v, std_v, spectral_energy])
    feature_vectors[name] = np.array(features)

# Reduce to 2D for visualization using simple projection
all_feats = np.array(list(feature_vectors.values()))
# Normalize
all_feats_norm = (all_feats - all_feats.mean(axis=0)) / (all_feats.std(axis=0) + 1e-10)
# Simple 2D projection (first two principal axes)
cov = np.cov(all_feats_norm.T)
eigenvalues, eigenvectors = np.linalg.eigh(cov)
proj = all_feats_norm @ eigenvectors[:, -2:]

for i, (name, (_, color)) in enumerate(surfaces.items()):
    ax.scatter(proj[i, 0], proj[i, 1], c=color, s=200, zorder=5,
              edgecolors='white', linewidths=2)
    ax.annotate(name, (proj[i, 0], proj[i, 1]),
                textcoords="offset points", xytext=(10, 10),
                color=color, fontsize=8, fontweight='bold')

ax.set_xlabel('Feature PC1', color='white')
ax.set_ylabel('Feature PC2', color='white')
ax.set_title('Surface classification (PCA)', color='white', fontsize=11)

# Plot 4: Array response heatmap for each surface
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

response_matrix = np.zeros((len(surfaces), len(whisker_array)))
for i, (name, (func, _)) in enumerate(surfaces.items()):
    for j, w in enumerate(whisker_array):
        t, defl, volt = w.scan_surface(func, sweep_speed=0.02)
        response_matrix[i, j] = np.std(volt) * 1000  # mV std

im = ax.imshow(response_matrix, cmap='magma', aspect='auto')
ax.set_xticks(range(len(whisker_array)))
ax.set_xticklabels([f'{w.L*100:.0f}cm' for w in whisker_array], color='white', fontsize=7)
ax.set_yticks(range(len(surfaces)))
ax.set_yticklabels(list(surfaces.keys()), color='white', fontsize=8)
ax.set_xlabel('Whisker length', color='white')
ax.set_title('Array response pattern (mV std)', color='white', fontsize=11)
cbar = plt.colorbar(im, ax=ax)
cbar.set_label('Voltage std (mV)', color='white')
cbar.ax.tick_params(colors='gray')

# Plot 5: Active vs passive sensing comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Active: whisking at 10 Hz
t_active, _, v_active = whisker_array[3].scan_surface(rough_concrete, sweep_speed=0.02)
# Passive: no whisking (just drag)
t_passive = np.arange(0, 0.5, 0.001)
passive_defl = np.zeros_like(t_passive)
for i, ti in enumerate(t_passive):
    x = 0.02 * ti
    h = rough_concrete(x)
    penetration = max(0, whisker_array[3].L * 0.99 - h)
    passive_defl[i] = penetration
v_passive = whisker_array[3].d * passive_defl * whisker_array[3].k / whisker_array[3].C
v_passive += 50e-6 * np.random.randn(len(t_passive))

snr_active = np.std(v_active) / (50e-6)
snr_passive = np.std(v_passive) / (50e-6)

ax.plot(t_active[:300] * 1000, v_active[:300] * 1000, color='#22c55e', linewidth=1.5,
        label=f'Active (SNR={snr_active:.1f})')
ax.plot(t_passive[:300] * 1000, v_passive[:300] * 1000, color='#ef4444', linewidth=1.5,
        label=f'Passive (SNR={snr_passive:.1f})')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Voltage (mV)', color='white')
ax.set_title('Active vs passive whisking', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: System architecture diagram (as text-based)
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Performance summary
categories = ['Detection\\nthreshold', 'Texture\\nresolution', 'Response\\ntime', 'Power\\nconsumption']
bio_perf = [9.5, 9, 8, 10]
robot_perf = [6, 7, 9, 5]
improvement = [r/b * 100 for r, b in zip(robot_perf, bio_perf)]

x_cat = np.arange(len(categories))
ax.bar(x_cat - 0.2, bio_perf, 0.35, color='#a855f7', alpha=0.8, label='Tiger whisker')
ax.bar(x_cat + 0.2, robot_perf, 0.35, color='#06b6d4', alpha=0.8, label='Robot whisker')

ax.set_xticks(x_cat)
ax.set_xticklabels(categories, color='white', fontsize=8)
ax.set_ylabel('Performance score (0-10)', color='white')
ax.set_title('Bio vs robotic performance', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

for i, (b, r) in enumerate(zip(bio_perf, robot_perf)):
    gap_pct = (b - r) / b * 100
    ax.text(i, max(b, r) + 0.3, f'{gap_pct:.0f}% gap', ha='center', color='white', fontsize=7)

plt.tight_layout()
plt.show()

print("=== Bio-Inspired Robotic Whisker System ===")
print(f"Array: {len(whisker_array)} whiskers, {whisker_array[0].L*100:.0f}-{whisker_array[-1].L*100:.0f} cm")
print(f"Frequency range: {whisker_array[-1].f0:.0f} - {whisker_array[0].f0:.0f} Hz")
print()
print("Surface Classification Results:")
for name in surfaces:
    fv = feature_vectors[name]
    print(f"  {name:<20} feature magnitude: {np.linalg.norm(fv):.4f}")
print()
print(f"Active whisking SNR improvement: {snr_active/max(snr_passive, 0.01):.1f}x over passive")
print()
print("The robotic whisker system achieves 60-90% of biological performance.")
print("The remaining gap is in sensitivity and self-repair — areas of active research.")
print("From tiger to robot: bio-inspired engineering closes the gap year by year.")`,
      challenge: 'Add a simple nearest-neighbor classifier that uses the feature vectors to identify surfaces from test data. Generate 20 noisy samples of each surface and report classification accuracy. How many whiskers does the array need for 95% accuracy?',
      successHint: 'You have traced the complete path from biological whisker to robotic sensor: cantilever mechanics, resonant tuning, mechanotransduction, population coding, piezoelectric sensing, and system integration. This is bio-inspired engineering at its best — understanding nature deeply enough to build something that works.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Sensory systems, vibration physics, and bio-inspired sensing</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for sensor physics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
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
