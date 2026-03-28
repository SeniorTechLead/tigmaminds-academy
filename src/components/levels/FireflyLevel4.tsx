import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FireflyLevel4() {
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
      title: 'Project Design: Coupled Oscillators and Synchronization',
      concept: `In Level 3 you built physical LED circuits that blink in patterns. Now you model the physics behind nature\'s most spectacular synchronization: thousands of fireflies flashing in perfect unison across the riverbanks of Majuli.

This is not random — it is an emergent phenomenon governed by **coupled oscillators**. Each firefly is an oscillator with its own internal clock (a cycle of chemical reactions producing light). When a firefly sees a neighbor's flash, it adjusts its own timing slightly. This simple rule — "flash a little sooner when you see a neighbor flash" — is enough to synchronize thousands of individuals.

The mathematics of synchronization was formalized by Yoshiki Kuramoto in 1975. The **Kuramoto model** describes N oscillators, each with a natural frequency omega_i, coupled through a sine function:

d(theta_i)/dt = omega_i + (K/N) * sum_j sin(theta_j - theta_i)

Here theta_i is the phase of oscillator i, omega_i is its natural frequency (how fast it wants to flash on its own), and K is the coupling strength (how strongly each firefly responds to its neighbors). When K is small, oscillators run independently. When K exceeds a critical threshold K_c, they spontaneously synchronize.

Our capstone builds a full Kuramoto simulator: from individual oscillator dynamics to emergent collective behavior, with visualization of the phase transition from disorder to synchrony.`,
      analogy: 'Imagine a room full of people clapping at different speeds after a concert. Each person hears their neighbors and unconsciously adjusts their rhythm. At first it sounds chaotic. But gradually, clusters form, then merge, until the entire audience claps in unison. No conductor, no signal — just local coupling. The Kuramoto model is the mathematical description of this phenomenon.',
      storyConnection: 'The Firefly Festival of Majuli describes thousands of fireflies lighting up the riverbanks in synchronized waves. Local villagers see it as magical, but it is one of the most studied examples of biological synchronization. Our simulator captures the exact mechanism: each firefly\'s internal chemical oscillator couples to its visual neighbors, producing the collective light show that draws people from across Assam.',
      checkQuestion: 'If each firefly only responds to its nearest neighbors (not all fireflies in the swarm), would synchronization still emerge? How would it differ?',
      checkAnswer: 'Yes, but it would be slower and produce traveling waves rather than global synchronization. With local coupling, synchronization spreads like a wave from nucleation points — small clusters sync first, then adjacent clusters merge. With global (all-to-all) coupling, synchronization snaps in suddenly once K exceeds K_c. The spatial structure of coupling determines whether you get uniform sync or traveling waves, both observed in real firefly populations.',
      codeIntro: 'Define the Kuramoto model, simulate N independent oscillators, and visualize their phases before coupling is introduced.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Kuramoto Model Parameters ---
N = 50          # number of fireflies (oscillators)
dt = 0.01       # time step (seconds)
T_total = 20.0  # total simulation time
n_steps = int(T_total / dt)

# Natural frequencies: drawn from a Lorentzian (Cauchy) distribution
# centered at omega_0 = 2*pi (1 flash per second) with spread gamma
omega_0 = 2 * np.pi  # mean frequency: 1 Hz (1 flash/second)
gamma = 0.5           # frequency spread — how different each firefly is
omegas = omega_0 + gamma * np.tan(np.pi * (np.random.random(N) - 0.5))

# Initial phases: uniformly random on [0, 2*pi)
theta_0 = np.random.uniform(0, 2 * np.pi, N)

# --- Simulate WITHOUT coupling (K=0) ---
K = 0.0  # no coupling yet

theta = theta_0.copy()
phases_history = np.zeros((n_steps, N))

for step in range(n_steps):
    phases_history[step] = theta % (2 * np.pi)
    # Kuramoto equation: d(theta)/dt = omega_i + (K/N) * sum sin(theta_j - theta_i)
    coupling = np.zeros(N)
    if K > 0:
        for i in range(N):
            coupling[i] = (K / N) * np.sum(np.sin(theta - theta[i]))
    theta = theta + (omegas + coupling) * dt

# --- Order parameter: measures synchronization ---
# r * exp(i*psi) = (1/N) * sum exp(i*theta_j)
# r = 0 means complete disorder, r = 1 means perfect sync
def compute_order_parameter(phases):
    z = np.mean(np.exp(1j * phases), axis=1)
    return np.abs(z), np.angle(z)

r_values, psi_values = compute_order_parameter(phases_history)

# --- Visualization ---
times = np.arange(n_steps) * dt

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Firefly Oscillators — No Coupling (K=0)', color='white', fontsize=14, fontweight='bold')

# Panel 1: Phase trajectories (each oscillator as a colored line)
ax = axes[0, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for i in range(min(20, N)):
    ax.plot(times[::10], phases_history[::10, i], linewidth=0.5, alpha=0.7)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Phase (radians)', color='white')
ax.set_title('Phase Trajectories (20 of 50 oscillators)', color='white', fontsize=10)

# Panel 2: Circular phase snapshot at t=0 and t=T
ax = axes[0, 1]; ax.set_facecolor('#111827')
ax.set_aspect('equal')
# Phase circle
circle = plt.Circle((0, 0), 1, fill=False, color='gray', linewidth=1)
ax.add_patch(circle)
# Initial phases (blue)
for i in range(N):
    x0 = np.cos(theta_0[i]); y0 = np.sin(theta_0[i])
    ax.plot(x0, y0, 'o', color='#3b82f6', markersize=4, alpha=0.5)
# Final phases (yellow)
final_phases = phases_history[-1]
for i in range(N):
    xf = np.cos(final_phases[i]); yf = np.sin(final_phases[i])
    ax.plot(xf, yf, 'o', color='#f59e0b', markersize=5, alpha=0.7)
ax.set_xlim(-1.4, 1.4); ax.set_ylim(-1.4, 1.4)
ax.set_title('Phase Circle: blue=t=0, yellow=t=20s', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Panel 3: Order parameter over time
ax = axes[1, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(times, r_values, color='#22c55e', linewidth=1.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Order parameter r', color='white')
ax.set_title('Synchronization Measure (r) — K=0', color='white', fontsize=10)
ax.set_ylim(0, 1.05)
ax.axhline(0.5, color='gray', linestyle='--', alpha=0.5)
ax.text(T_total*0.7, 0.55, 'r~0: no sync', color='gray', fontsize=9)

# Panel 4: Frequency histogram
ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.hist(omegas / (2*np.pi), bins=20, color='#a855f7', edgecolor='none', alpha=0.8)
ax.axvline(omega_0/(2*np.pi), color='#ef4444', linestyle='--', linewidth=2, label=f'Mean: {omega_0/(2*np.pi):.2f} Hz')
ax.set_xlabel('Natural frequency (Hz)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Frequency Distribution (Lorentzian)', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print(f"Simulation: {N} oscillators, {T_total}s, K=0 (no coupling)")
print(f"Natural frequencies: mean={omegas.mean()/(2*np.pi):.3f} Hz, std={omegas.std()/(2*np.pi):.3f} Hz")
print(f"Final order parameter: r = {r_values[-1]:.3f} (0=disorder, 1=sync)")
print(f"\\nWith no coupling, oscillators drift apart. r stays near 1/sqrt(N) = {1/np.sqrt(N):.3f}.")
print("Next: turn on coupling and watch synchronization emerge.")`,
      challenge: 'Try a Gaussian frequency distribution instead of Lorentzian. Does the uncoupled system look different? (Hint: Lorentzian has heavier tails, meaning some oscillators have very different frequencies.)',
      successHint: 'Without coupling, each firefly blinks at its own rhythm. The phases spread uniformly around the circle, and the order parameter stays near zero. This is the baseline against which synchronization is measured.',
    },
    {
      title: 'The Kuramoto Model: Coupling and Phase Transition',
      concept: `Now we add coupling. The key parameter is **K**, the coupling strength. At K=0, oscillators are independent. As K increases, something remarkable happens at a critical value K_c: the system undergoes a **phase transition** from disorder to order.

For the Kuramoto model with a Lorentzian frequency distribution of width gamma, the critical coupling is: **K_c = 2 * gamma**. Below K_c, the order parameter r stays near zero (no sync). Above K_c, r rises sharply toward 1 (sync). This transition is mathematically analogous to a second-order phase transition in physics — like water freezing or a magnet spontaneously magnetizing.

The physics is intuitive. Each oscillator wants to run at its natural frequency (pulling apart from others). Coupling pulls oscillators toward the mean phase (pulling together). When coupling is weak, the frequency differences win — oscillators cannot lock. When coupling is strong enough, it overcomes the frequency spread, and oscillators snap into a common rhythm.

The **order parameter** r = |<exp(i*theta)>| is the key observable:
- r near 0: phases uniformly spread, no synchronization
- r near 1: phases clustered, strong synchronization
- The transition from r=0 to r>0 at K=K_c is one of the cleanest examples of collective emergence in science.`,
      analogy: 'The phase transition is like a political election. When a candidate has weak appeal (low K), voters remain divided — each follows their own preference. As appeal increases past a threshold, undecided voters start following the majority, which attracts more followers, creating a positive feedback loop. The election "snaps" from divided to landslide. There is no gradual transition — it is a tipping point.',
      storyConnection: 'The story describes the moment when the first few fireflies begin to flash together, then more join, until the entire riverbank pulses as one. This is the phase transition in action. Below K_c, the fireflies of Majuli would blink randomly — beautiful but chaotic. Above K_c, the collective synchronization produces the mesmerizing waves that make the festival famous.',
      checkQuestion: 'If you double the spread of natural frequencies (gamma), what happens to K_c? What does this mean biologically?',
      checkAnswer: 'K_c doubles (K_c = 2*gamma). Biologically, this means that a population of fireflies with very diverse flash rates requires stronger coupling (more sensitive visual response) to synchronize. A genetically uniform population with similar flash rates synchronizes easily. This is why synchronization is most common in species with low frequency variation — evolution selects for uniformity when synchronization provides a mating advantage.',
      codeIntro: 'Simulate the Kuramoto model across a range of coupling strengths and visualize the phase transition from disorder to synchrony.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

N = 50; dt = 0.01; T = 30.0; n_steps = int(T / dt)
omega_0 = 2 * np.pi; gamma = 0.5
omegas = omega_0 + gamma * np.tan(np.pi * (np.random.random(N) - 0.5))

K_c = 2 * gamma  # critical coupling
print(f"Theoretical K_c = 2 * gamma = {K_c:.2f}")

def simulate_kuramoto(K, omegas, theta_init, dt=0.01, n_steps=3000):
    """Simulate Kuramoto model and return phase history."""
    N = len(omegas)
    theta = theta_init.copy()
    phases = np.zeros((n_steps, N))
    for step in range(n_steps):
        phases[step] = theta % (2 * np.pi)
        # Vectorized coupling
        diff = np.subtract.outer(theta, theta)  # theta_j - theta_i
        coupling = (K / N) * np.sum(np.sin(diff), axis=1)  # note: axis=1 for sum over j
        theta = theta + (omegas + coupling) * dt
    return phases

# --- Sweep K values ---
K_values = np.linspace(0, 4.0, 25)
r_final = []
theta_init = np.random.uniform(0, 2*np.pi, N)

for K in K_values:
    phases = simulate_kuramoto(K, omegas, theta_init)
    z = np.mean(np.exp(1j * phases[-500:]), axis=1)  # average last 500 steps
    r_final.append(np.mean(np.abs(z)))

# --- Detailed simulation at 3 coupling values ---
K_examples = [0.0, K_c, 3.0]
labels_k = [f'K=0 (uncoupled)', f'K={K_c:.1f} (critical)', 'K=3.0 (strong)']

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Kuramoto Phase Transition — From Disorder to Synchrony',
             color='white', fontsize=14, fontweight='bold')

colors_k = ['#ef4444', '#f59e0b', '#22c55e']

for col, (K, label, kcol) in enumerate(zip(K_examples, labels_k, colors_k)):
    phases = simulate_kuramoto(K, omegas, theta_init, n_steps=n_steps)
    times = np.arange(n_steps) * dt

    # Order parameter
    z = np.mean(np.exp(1j * phases), axis=1)
    r = np.abs(z)

    # Phase circle (final state)
    ax = axes[0, col]; ax.set_facecolor('#111827'); ax.set_aspect('equal')
    circle = plt.Circle((0, 0), 1, fill=False, color='gray', linewidth=1)
    ax.add_patch(circle)
    final_p = phases[-1]
    for i in range(N):
        ax.plot(np.cos(final_p[i]), np.sin(final_p[i]), 'o',
                color=kcol, markersize=5, alpha=0.7)
    # Mean phase arrow
    mean_z = np.mean(np.exp(1j * final_p))
    ax.arrow(0, 0, np.real(mean_z)*0.8, np.imag(mean_z)*0.8,
             head_width=0.08, head_length=0.05, fc='white', ec='white', linewidth=2)
    ax.set_xlim(-1.4, 1.4); ax.set_ylim(-1.4, 1.4)
    ax.set_title(f'{label}\\nr={r[-1]:.2f}', color='white', fontsize=10)
    ax.tick_params(colors='gray')

    # r over time
    ax = axes[1, col]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
    ax.plot(times, r, color=kcol, linewidth=1)
    ax.set_xlabel('Time (s)', color='white')
    ax.set_ylabel('r (order parameter)', color='white')
    ax.set_ylim(0, 1.05)
    ax.axhline(0.5, color='gray', linestyle='--', alpha=0.3)

plt.tight_layout()
plt.show()

# --- Phase transition curve ---
fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')

ax.plot(K_values, r_final, 'o-', color='#a855f7', linewidth=2, markersize=5)
ax.axvline(K_c, color='#ef4444', linestyle='--', linewidth=2, label=f'K_c = {K_c:.2f}')
ax.fill_between(K_values, 0, r_final, alpha=0.15, color='#a855f7')
ax.set_xlabel('Coupling strength K', color='white', fontsize=12)
ax.set_ylabel('Order parameter r (steady state)', color='white', fontsize=12)
ax.set_title('Phase Transition: Disorder to Synchrony', color='white', fontsize=14, fontweight='bold')
ax.legend(fontsize=11, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 1.05)

# Annotate regions
ax.text(K_c/2, 0.1, 'Disordered\\n(no sync)', ha='center', color='#ef4444', fontsize=10)
ax.text(K_c + 1.0, 0.8, 'Synchronized', ha='center', color='#22c55e', fontsize=10)

plt.tight_layout()
plt.show()

print(f"Phase transition detected around K = {K_c:.2f}")
print(f"Below K_c: r ~ {np.mean(r_final[:5]):.3f} (near zero)")
print(f"Above K_c: r rises sharply")
print(f"At K=3.0: r ~ {r_final[-1]:.3f} (strong synchronization)")`,
      challenge: 'Run the phase transition sweep with N=10, N=50, and N=200 oscillators. Plot all three curves on the same graph. How does N affect the sharpness of the transition?',
      successHint: 'The phase transition is the central phenomenon: below K_c, coupling is too weak to overcome frequency differences. Above K_c, a synchronized cluster nucleates and grows, pulling in more oscillators through positive feedback. This is emergent order from simple local rules.',
    },
    {
      title: 'Spatial Coupling: Fireflies on a 2D Grid',
      concept: `Real fireflies do not couple to every other firefly in the swarm — they couple to **nearby neighbors** based on visual range. A firefly on Majuli's eastern bank cannot see one on the western bank 2 km away. This spatial structure fundamentally changes the synchronization dynamics.

We model this by placing N fireflies on a 2D grid and coupling each one only to its immediate neighbors (4 or 8 surrounding cells). The Kuramoto equation becomes:

d(theta_i)/dt = omega_i + (K/n_neighbors) * sum_{j in neighbors(i)} sin(theta_j - theta_i)

With local coupling, synchronization does not happen all at once. Instead:
1. **Local clusters** form first — small groups of 3-5 nearby fireflies sync.
2. **Cluster boundaries** shift as neighboring clusters with slightly different phases influence each other.
3. **Traveling waves** appear — phase fronts that sweep across the grid.
4. Eventually, clusters merge into **global synchronization** — but this takes much longer than all-to-all coupling.

The spatial dynamics produce beautiful patterns: spiral waves, concentric rings, and propagating fronts. These are the same mathematical structures that appear in cardiac tissue (where they cause arrhythmias), chemical reactions (Belousov-Zhabotinsky), and neural networks (brain oscillations).`,
      analogy: 'Spatial synchronization is like a stadium wave. Nobody can see the entire stadium — you only watch the people next to you. When your neighbors stand up, you stand up too. The wave propagates at finite speed because information travels only through local interactions. A firefly grid works the same way: synchronization propagates as a wave from local clusters outward.',
      storyConnection: 'The Majuli firefly display is famous for its **wave patterns** — synchronization that sweeps along the riverbank rather than appearing everywhere simultaneously. This is exactly what local coupling produces. The story describes waves of light rolling across the mangroves — our 2D grid simulation reproduces this phenomenon, showing how spatial structure creates the traveling waves that make the festival spectacular.',
      checkQuestion: 'If you increase the coupling range from 4 nearest neighbors to 24 (a 5x5 neighborhood), how would the synchronization dynamics change?',
      checkAnswer: 'Synchronization would happen faster and more uniformly, approaching the all-to-all behavior. Longer-range coupling reduces the effective distance between clusters, so waves propagate faster and merge sooner. The tradeoff: longer-range coupling requires each oscillator to process more inputs, which is computationally (and biologically) expensive. Real firefly species vary in visual range, producing different synchronization patterns.',
      codeIntro: 'Implement the Kuramoto model on a 2D grid with nearest-neighbor coupling, and visualize the emergence of traveling wave patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- 2D Grid Kuramoto ---
grid_size = 20  # 20x20 = 400 fireflies
N = grid_size ** 2
dt = 0.02
T = 25.0
n_steps = int(T / dt)
K = 4.0  # strong coupling to see clear patterns

# Natural frequencies on the grid
omega_0 = 2 * np.pi
gamma = 0.3
omegas = omega_0 + gamma * np.random.randn(grid_size, grid_size)

# Initial phases: random
theta = np.random.uniform(0, 2*np.pi, (grid_size, grid_size))

# Store snapshots at specific times
snapshot_times = [0, 3, 8, 15, 25]
snapshots = {}
r_history = []

for step in range(n_steps):
    t_now = step * dt

    # Compute order parameter
    z = np.mean(np.exp(1j * theta))
    r_history.append(np.abs(z))

    # Save snapshots
    for st in snapshot_times:
        if abs(t_now - st) < dt/2 and st not in snapshots:
            snapshots[st] = theta.copy() % (2*np.pi)

    # Compute coupling: 4-nearest neighbors with periodic boundary
    coupling = np.zeros_like(theta)
    for di, dj in [(-1,0),(1,0),(0,-1),(0,1)]:
        neighbor = np.roll(np.roll(theta, di, axis=0), dj, axis=1)
        coupling += np.sin(neighbor - theta)
    coupling *= K / 4.0  # normalize by number of neighbors

    theta = theta + (omegas + coupling) * dt

# Make sure we have the final snapshot
snapshots[25] = theta.copy() % (2*np.pi)

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('2D Firefly Grid — Local Coupling Synchronization',
             color='white', fontsize=14, fontweight='bold')

# Top row: phase snapshots
snap_keys = sorted(snapshots.keys())[:3]
for col, t_snap in enumerate(snap_keys):
    ax = axes[0, col]; ax.set_facecolor('#111827')
    phase_img = snapshots[t_snap]
    # Map phase to a cyclic colormap (representing flash timing)
    im = ax.imshow(phase_img, cmap='twilight', vmin=0, vmax=2*np.pi,
                   interpolation='nearest')
    ax.set_title(f't = {t_snap}s', color='white', fontsize=11)
    ax.tick_params(colors='gray')
    if col == 2:
        cbar = plt.colorbar(im, ax=ax, fraction=0.046)
        cbar.set_label('Phase (rad)', color='white', fontsize=9)
        cbar.ax.tick_params(colors='gray')

# Bottom left: later snapshots
snap_keys_late = sorted(snapshots.keys())[3:]
for col, t_snap in enumerate(snap_keys_late):
    ax = axes[1, col]; ax.set_facecolor('#111827')
    phase_img = snapshots[t_snap]
    im = ax.imshow(phase_img, cmap='twilight', vmin=0, vmax=2*np.pi,
                   interpolation='nearest')
    ax.set_title(f't = {t_snap}s', color='white', fontsize=11)
    ax.tick_params(colors='gray')

# Bottom middle: order parameter over time
ax = axes[1, min(2, len(snap_keys_late))]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
times = np.arange(len(r_history)) * dt
ax.plot(times, r_history, color='#22c55e', linewidth=1.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Order parameter r', color='white')
ax.set_title('Global Synchronization Over Time', color='white', fontsize=11)
ax.set_ylim(0, 1.05)

# Mark snapshot times
for st in snapshot_times:
    idx = min(int(st/dt), len(r_history)-1)
    ax.plot(st, r_history[idx], 'o', color='#f59e0b', markersize=8, zorder=5)
    ax.annotate(f't={st}s', (st, r_history[idx]+0.05), color='#f59e0b', fontsize=8, ha='center')

# Hide unused subplot if needed
if len(snap_keys_late) < 2:
    axes[1, 1].set_visible(False)

plt.tight_layout()
plt.show()

# --- "Flash" visualization: show which fireflies are near peak phase ---
fig, axes = plt.subplots(1, 4, figsize=(16, 4))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('"Flash" Snapshots — Bright = Near Peak Phase', color='white', fontsize=12, fontweight='bold')

final_phases = snapshots[25]
for i, offset in enumerate([0, 0.5, 1.0, 1.5]):
    ax = axes[i]; ax.set_facecolor('#000000')
    # Brightness = cos(phase - offset) mapped to [0, 1]
    brightness = (np.cos(final_phases - offset * np.pi) + 1) / 2
    flash_img = np.zeros((grid_size, grid_size, 3))
    flash_img[:,:,1] = brightness * 0.9   # green channel (firefly color)
    flash_img[:,:,0] = brightness * 0.3   # slight yellow tint
    ax.imshow(flash_img, interpolation='nearest')
    ax.set_title(f'Phase offset: {offset:.1f}pi', color='white', fontsize=9)
    ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print(f"Grid: {grid_size}x{grid_size} = {N} oscillators, K={K}")
print(f"Final order parameter: r = {r_history[-1]:.3f}")
print(f"Synchronization emerged through local coupling (4 neighbors)")
print("Phase patterns show traveling waves — same physics as the Majuli firefly display")`,
      challenge: 'Add diagonal neighbors (8-connectivity instead of 4). Compare the synchronization speed. Then try coupling range of 2 cells (a 5x5 neighborhood). Plot r(t) for all three on the same graph.',
      successHint: 'Local coupling produces spatial structure that global coupling cannot: traveling waves, spiral patterns, and cluster boundaries. These are the patterns you actually see in nature — firefly waves sweeping along a riverbank, not the entire bank flashing simultaneously.',
    },
    {
      title: 'Entrainment and Frequency Locking',
      concept: `Not all oscillators synchronize equally. In a population with diverse natural frequencies, the Kuramoto model produces a characteristic split:

- **Locked oscillators**: those whose natural frequencies are close enough to the mean that coupling pulls them into sync. They oscillate at exactly the collective frequency.
- **Drifting oscillators**: those with extreme natural frequencies that coupling cannot capture. They continue to drift, running faster or slower than the synchronized group.

The boundary between locked and drifting oscillators is sharp and determined by:
|omega_i - omega_mean| < K * r

Oscillators within this "locking bandwidth" are captured; those outside drift freely. As K increases, the locking bandwidth widens and more oscillators are captured — explaining why r increases with K.

This phenomenon is called **frequency entrainment** and has profound biological implications. In a firefly population, entrainment means that fireflies with similar flash rates synchronize first, forming a core group. Outliers with very different rates cannot join. The size of the entrained core grows with coupling strength. Real firefly species have evolved narrow frequency distributions precisely because this makes entrainment easier — a population that synchronizes more effectively has a mating advantage.`,
      analogy: 'Entrainment is like a marching band rounding a corner. Musicians in the inner lane slow down slightly; those in the outer lane speed up. If the curve is gentle (moderate frequency difference), everyone stays in step. If the curve is too sharp (extreme frequency difference), the outermost musicians fall out of formation. The coupling K is the band director\'s insistence on keeping formation — stronger insistence captures more musicians.',
      storyConnection: 'In the Majuli firefly display, you can often see a few "rebel" fireflies that blink out of sync with the main group. These are the drifting oscillators — their natural flash rates are too far from the population mean for coupling to capture them. The beauty of the display comes from the vast majority being entrained, with a few outliers adding texture.',
      checkQuestion: 'If you artificially set one firefly\'s natural frequency to 10x the mean while keeping K constant, what would happen to it and to the rest of the swarm?',
      checkAnswer: 'The extreme outlier would drift freely — no amount of reasonable coupling can capture a frequency that far from the mean. The rest of the swarm would be unaffected because one outlier among N oscillators contributes negligibly to the coupling sum (its effect is divided by N). This robustness to outliers is a key feature of the Kuramoto model and explains why firefly displays are stable even when individual fireflies malfunction.',
      codeIntro: 'Analyze the locked vs drifting partition, measure the locking bandwidth, and visualize how it grows with coupling strength.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

N = 100; dt = 0.01; T = 40.0; n_steps = int(T / dt)
omega_0 = 2 * np.pi; gamma = 0.5
omegas = omega_0 + gamma * np.tan(np.pi * (np.random.random(N) - 0.5))

# Sort oscillators by natural frequency for analysis
sort_idx = np.argsort(omegas)
omegas_sorted = omegas[sort_idx]

def simulate_and_analyze(K, omegas, dt=0.01, T=40.0):
    """Simulate Kuramoto and classify oscillators as locked or drifting."""
    N = len(omegas)
    n_steps = int(T / dt)
    theta = np.random.uniform(0, 2*np.pi, N)

    # Run simulation
    r_history = []
    for step in range(n_steps):
        z = np.mean(np.exp(1j * theta))
        r_history.append(np.abs(z))
        diff = np.subtract.outer(theta, theta)
        coupling = (K / N) * np.sum(np.sin(diff), axis=1)
        theta = theta + (omegas + coupling) * dt

    # Measure effective frequencies in steady state
    # Run extra steps and measure phase advance
    phases_start = theta.copy()
    measure_steps = 5000
    for step in range(measure_steps):
        diff = np.subtract.outer(theta, theta)
        coupling = (K / N) * np.sum(np.sin(diff), axis=1)
        theta = theta + (omegas + coupling) * dt

    effective_freq = (theta - phases_start) / (measure_steps * dt)

    # Classify: locked if effective freq is within 0.1 of the mean effective freq
    mean_eff = np.median(effective_freq)
    locked = np.abs(effective_freq - mean_eff) < 0.2

    return {
        'r_history': np.array(r_history),
        'effective_freq': effective_freq,
        'locked': locked,
        'r_final': np.mean(r_history[-500:]),
        'n_locked': np.sum(locked),
    }

# --- Analyze at multiple K values ---
K_values = [0.5, 1.0, 1.5, 2.0, 3.0, 5.0]
results = {}
for K in K_values:
    results[K] = simulate_and_analyze(K, omegas)
    print(f"K={K:.1f}: r={results[K]['r_final']:.3f}, locked={results[K]['n_locked']}/{N}")

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Frequency Entrainment — Locked vs Drifting Oscillators',
             color='white', fontsize=14, fontweight='bold')

# Top row: effective frequency vs natural frequency at 3 K values
K_show = [0.5, 2.0, 5.0]
for col, K in enumerate(K_show):
    ax = axes[0, col]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
    res = results[K]
    eff = res['effective_freq'][sort_idx]
    nat = omegas_sorted

    locked = res['locked'][sort_idx]
    ax.scatter(nat[locked]/(2*np.pi), eff[locked]/(2*np.pi),
              s=10, color='#22c55e', alpha=0.8, label=f'Locked ({np.sum(locked)})')
    ax.scatter(nat[~locked]/(2*np.pi), eff[~locked]/(2*np.pi),
              s=10, color='#ef4444', alpha=0.5, label=f'Drifting ({np.sum(~locked)})')

    # Diagonal: omega_eff = omega_nat (no coupling effect)
    freq_range = [nat.min()/(2*np.pi), nat.max()/(2*np.pi)]
    ax.plot(freq_range, freq_range, '--', color='gray', linewidth=1, alpha=0.5)

    # Horizontal line: collective frequency
    mean_locked = np.median(eff[locked])/(2*np.pi) if np.any(locked) else np.nan
    if not np.isnan(mean_locked):
        ax.axhline(mean_locked, color='#3b82f6', linestyle=':', linewidth=1, alpha=0.7)

    ax.set_xlabel('Natural freq (Hz)', color='white', fontsize=9)
    ax.set_ylabel('Effective freq (Hz)', color='white', fontsize=9)
    ax.set_title(f'K={K:.1f} — {np.sum(locked)} locked', color='white', fontsize=10)
    ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Bottom left: locked fraction vs K
ax = axes[1, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
fracs = [results[K]['n_locked']/N for K in K_values]
ax.plot(K_values, fracs, 'o-', color='#a855f7', linewidth=2, markersize=8)
ax.fill_between(K_values, 0, fracs, alpha=0.15, color='#a855f7')
ax.axvline(2*gamma, color='#ef4444', linestyle='--', linewidth=2, label=f'K_c={2*gamma:.1f}')
ax.set_xlabel('Coupling K', color='white', fontsize=11)
ax.set_ylabel('Fraction locked', color='white', fontsize=11)
ax.set_title('Entrainment Growth', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 1.05)

# Bottom middle: order parameter comparison
ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
colors_line = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#3b82f6', '#a855f7']
for K, color in zip(K_values, colors_line):
    times = np.arange(len(results[K]['r_history'])) * dt
    ax.plot(times, results[K]['r_history'], color=color, linewidth=1,
            label=f'K={K:.1f}', alpha=0.8)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('r', color='white')
ax.set_title('Synchronization Dynamics', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white', ncol=2)
ax.set_ylim(0, 1.05)

# Bottom right: locking bandwidth illustration
ax = axes[1, 2]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
freq_range = np.linspace(omegas.min()/(2*np.pi), omegas.max()/(2*np.pi), 200)
ax.hist(omegas/(2*np.pi), bins=30, color='gray', alpha=0.4, edgecolor='none', density=True, label='Freq. dist.')

for K, color, ls in [(1.0, '#ef4444', '--'), (2.0, '#f59e0b', '-'), (5.0, '#22c55e', '-')]:
    r_val = results[K]['r_final']
    lock_bw = K * r_val / (2*np.pi)
    center = omega_0 / (2*np.pi)
    ax.axvspan(center - lock_bw, center + lock_bw, alpha=0.1, color=color)
    ax.axvline(center - lock_bw, color=color, linestyle=ls, linewidth=1.5, label=f'K={K}: bw={lock_bw:.2f} Hz')
    ax.axvline(center + lock_bw, color=color, linestyle=ls, linewidth=1.5)

ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Locking Bandwidth Growth', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("\\nKey insight: as K increases, the locking bandwidth widens,")
print("capturing oscillators with increasingly different natural frequencies.")
print("Locked oscillators all beat at the collective frequency.")
print("Drifting oscillators follow the diagonal (their own natural frequency).")`,
      challenge: 'Simulate a "split population" where half the fireflies have natural frequency 0.8 Hz and half have 1.2 Hz (a bimodal distribution). At what coupling strength do the two groups merge into a single synchronized cluster? This models two species of fireflies that can potentially synchronize across species.',
      successHint: 'The locked/drifting partition is the microscopic explanation for the macroscopic order parameter. Understanding which oscillators lock and why is essential for controlling synchronization — whether in fireflies, power grids, or neural circuits.',
    },
    {
      title: 'Perturbation and Robustness Analysis',
      concept: `A synchronized system is only useful if it is **robust** — if it can recover from perturbations. What happens when a flash of lightning disrupts a firefly display? When a predator scatters part of the swarm? When some fireflies die or new ones arrive?

We test three types of perturbation:
1. **Phase perturbation**: randomly reset some oscillators' phases (simulating a disruptive flash of light). How quickly does the system re-synchronize?
2. **Frequency perturbation**: suddenly change some oscillators' natural frequencies (simulating environmental change). Does the locked group absorb them or does sync break?
3. **Removal/addition**: delete oscillators from the population or add new ones with random phases. Is the system resilient to membership changes?

The **relaxation time** measures robustness: how many cycles does it take to return to the pre-perturbation order parameter? Short relaxation = robust system. Long relaxation = fragile system.

For the Kuramoto model, theory predicts that relaxation time scales as 1/(K - K_c). Near the critical point, the system is fragile (slow recovery). Well above K_c, it is robust (fast recovery). This has a biological interpretation: species with strong coupling (K >> K_c) can maintain synchronization despite environmental noise, giving them a selective advantage.`,
      analogy: 'Robustness testing is like stress-testing a bridge. You do not just drive one car across — you simulate earthquakes, hurricanes, heavy traffic, and material degradation. A bridge that survives all tests is trustworthy. Similarly, a synchronized firefly swarm that recovers from perturbations is genuinely synchronized, not just temporarily aligned by coincidence.',
      storyConnection: 'The Majuli firefly festival happens during monsoon season — with rain, wind, and predators constantly disrupting the display. Yet the synchronization persists. Our robustness analysis explains why: at strong enough coupling, the collective rhythm is an attractor that the system returns to after any perturbation. The festival is reliable precisely because the physics is robust.',
      checkQuestion: 'Would a system at K = K_c + 0.01 (barely above critical coupling) be more or less robust to perturbation than one at K = 3*K_c?',
      checkAnswer: 'Much less robust. Near K_c, the system is marginally stable — the synchronized state exists but is barely attracting. Perturbations push it far from equilibrium and recovery is slow (critical slowing down). At 3*K_c, the synchronized state is a strong attractor with a large basin — perturbations are absorbed quickly. This is why real biological systems typically operate well above their critical coupling threshold.',
      codeIntro: 'Simulate three types of perturbation, measure relaxation times, and visualize the system\'s recovery dynamics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

N = 80; dt = 0.01; omega_0 = 2*np.pi; gamma = 0.5
omegas = omega_0 + gamma * np.tan(np.pi * (np.random.random(N) - 0.5))
K = 4.0  # well above K_c = 1.0

def kuramoto_step(theta, omegas, K, dt):
    N = len(theta)
    diff = np.subtract.outer(theta, theta)
    coupling = (K / N) * np.sum(np.sin(diff), axis=1)
    return theta + (omegas + coupling) * dt

def run_with_perturbation(omegas, K, perturb_func, perturb_time=20.0,
                          T_pre=20.0, T_post=30.0, dt=0.01):
    """Run simulation: stabilize, perturb at perturb_time, then observe recovery."""
    N = len(omegas)
    theta = np.random.uniform(0, 2*np.pi, N)

    # Pre-perturbation: let system reach steady state
    n_pre = int(T_pre / dt)
    r_pre = []
    for _ in range(n_pre):
        theta = kuramoto_step(theta, omegas, K, dt)
        r_pre.append(np.abs(np.mean(np.exp(1j * theta))))

    r_before = np.mean(r_pre[-200:])

    # Apply perturbation
    theta, omegas_new = perturb_func(theta.copy(), omegas.copy())

    # Post-perturbation: observe recovery
    n_post = int(T_post / dt)
    r_post = []
    for _ in range(n_post):
        theta = kuramoto_step(theta, omegas_new, K, dt)
        r_post.append(np.abs(np.mean(np.exp(1j * theta))))

    # Measure relaxation time: time to reach 90% of pre-perturbation r
    target = 0.9 * r_before
    relax_time = T_post  # default: never recovered
    for i, r in enumerate(r_post):
        if r >= target:
            relax_time = i * dt
            break

    return np.array(r_pre), np.array(r_post), r_before, relax_time

# --- Perturbation 1: Phase reset (30% of oscillators) ---
def phase_perturb(theta, omegas):
    n_perturb = int(0.3 * len(theta))
    idx = np.random.choice(len(theta), n_perturb, replace=False)
    theta[idx] = np.random.uniform(0, 2*np.pi, n_perturb)
    return theta, omegas

# --- Perturbation 2: Frequency shift (20% get doubled frequency) ---
def freq_perturb(theta, omegas):
    n_perturb = int(0.2 * len(omegas))
    idx = np.random.choice(len(omegas), n_perturb, replace=False)
    omegas[idx] *= 2.0
    return theta, omegas

# --- Perturbation 3: Remove 25% of oscillators ---
def removal_perturb(theta, omegas):
    n_keep = int(0.75 * len(theta))
    idx = np.random.choice(len(theta), n_keep, replace=False)
    return theta[idx], omegas[idx]

# --- Run all three ---
perturbations = [
    ('Phase Reset (30%)', phase_perturb, '#ef4444'),
    ('Frequency Doubling (20%)', freq_perturb, '#f59e0b'),
    ('Removal (25%)', removal_perturb, '#3b82f6'),
]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Synchronization Robustness — Perturbation Recovery',
             color='white', fontsize=14, fontweight='bold')

relax_times = []
for idx_p, (name, pfunc, color) in enumerate(perturbations):
    r_pre, r_post, r_before, relax = run_with_perturbation(omegas, K, pfunc)
    relax_times.append(relax)

    ax = axes.flat[idx_p]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')

    t_pre = np.arange(len(r_pre)) * dt
    t_post = np.arange(len(r_post)) * dt + t_pre[-1]

    ax.plot(t_pre, r_pre, color='gray', linewidth=1, alpha=0.5)
    ax.plot(t_post, r_post, color=color, linewidth=1.5)
    ax.axvline(t_pre[-1], color='white', linestyle='--', linewidth=1, alpha=0.7)
    ax.axhline(r_before, color='#22c55e', linestyle=':', alpha=0.5)
    ax.axhline(0.9*r_before, color='#22c55e', linestyle='--', alpha=0.3)

    if relax < 30.0:
        ax.axvline(t_pre[-1]+relax, color='#22c55e', linestyle='--', alpha=0.7)
        ax.text(t_pre[-1]+relax+0.5, 0.3, f'Recovery: {relax:.1f}s',
                color='#22c55e', fontsize=9)

    ax.set_xlabel('Time (s)', color='white')
    ax.set_ylabel('r', color='white')
    ax.set_title(f'{name}', color='white', fontsize=11)
    ax.set_ylim(0, 1.05)
    ax.text(t_pre[-1]+0.5, 0.15, 'PERTURB', color='white', fontsize=8,
            bbox=dict(boxstyle='round', facecolor=color, alpha=0.3))

# Bottom right: comparison summary
ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
names_short = ['Phase\nReset', 'Freq\nDoubling', 'Removal']
colors_bar = ['#ef4444', '#f59e0b', '#3b82f6']
bars = ax.bar(range(3), relax_times, color=colors_bar, edgecolor='white', linewidth=1)
ax.set_xticks(range(3))
ax.set_xticklabels(names_short, color='white', fontsize=9)
ax.set_ylabel('Relaxation time (s)', color='white', fontsize=11)
ax.set_title('Recovery Speed Comparison', color='white', fontsize=12, fontweight='bold')

for i, rt in enumerate(relax_times):
    label = f'{rt:.1f}s' if rt < 30 else 'No recovery'
    ax.text(i, rt+0.5, label, ha='center', color='white', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.show()

# --- Relaxation time vs K ---
K_test = np.linspace(1.5, 6.0, 12)
relax_vs_K = []
for K_val in K_test:
    _, _, _, relax = run_with_perturbation(omegas, K_val, phase_perturb)
    relax_vs_K.append(relax)

fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(K_test, relax_vs_K, 'o-', color='#a855f7', linewidth=2, markersize=8)
ax.set_xlabel('Coupling K', color='white', fontsize=12)
ax.set_ylabel('Relaxation time (s)', color='white', fontsize=12)
ax.set_title('Robustness vs Coupling Strength', color='white', fontsize=14, fontweight='bold')
ax.axvline(2*gamma, color='#ef4444', linestyle='--', label=f'K_c={2*gamma:.1f}')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
plt.tight_layout()
plt.show()

print(f"Perturbation recovery at K={K:.1f}:")
for name, relax in zip(names_short, relax_times):
    status = f'{relax:.1f}s' if relax < 30 else 'Did not recover'
    print(f"  {name.replace(chr(10),' ')}: {status}")
print(f"\\nStronger coupling (higher K) = faster recovery = more robust synchronization")`,
      challenge: 'Add a fourth perturbation type: "continuous noise" — at each timestep, add random phase noise of amplitude sigma to each oscillator. Measure the steady-state r as a function of noise amplitude sigma. At what noise level does synchronization collapse?',
      successHint: 'Robustness is what separates a real synchronized system from a coincidence. The firefly display persists through monsoon storms because the coupling is strong enough to be an attractor. Testing perturbation recovery is essential for any oscillator system, from fireflies to power grids to neural pacemakers.',
    },
    {
      title: 'Deployment: Complete Firefly Synchronization Simulator',
      concept: `The final step is packaging the simulator into a clean, interactive tool. A researcher or educator should be able to instantiate a \`FireflySwarm\`, set parameters, run the simulation, and get beautiful visualizations with a few method calls.

Our deployed system includes:
- **Clean API**: \`swarm.simulate(K, T)\` runs the simulation; \`swarm.get_metrics()\` returns order parameter, locked fraction, and relaxation time.
- **Parameter validation**: coupling K must be non-negative, grid size must be reasonable, time step must ensure numerical stability.
- **Multiple coupling topologies**: all-to-all, 2D grid (4-neighbor), 2D grid (8-neighbor), and random network. Each topology produces different synchronization patterns.
- **Comprehensive visualization**: phase plots, order parameter traces, entrainment diagrams, and the signature "flash" display showing waves of light propagating across the grid.
- **Known limitations**: mean-field Kuramoto model assumes identical coupling strengths, no time delays in signal propagation, and no refractory period (real fireflies cannot flash continuously).

This lesson builds the polished final version — a portfolio-ready synchronization simulator that demonstrates physics, mathematics, and computational modeling.`,
      analogy: 'Deploying a simulator is like publishing a physics textbook. The content (equations, simulations) must be correct, but equally important are the pedagogy (clear API, meaningful defaults), the exercises (parameter exploration), and the honest discussion of limitations. A simulator that is correct but unusable sits unused. A clean, well-documented one becomes a teaching tool and research instrument.',
      storyConnection: 'The Firefly Festival of Majuli attracts visitors who marvel at the display without understanding the physics. Our simulator is a bridge between wonder and understanding — it lets anyone reproduce the phenomenon computationally, tweak parameters to see what breaks synchronization, and develop intuition for emergent behavior. It transforms the story from narrative into interactive science.',
      checkQuestion: 'A user sets the time step dt=1.0 (very large) for a system with omega_0 = 2*pi (one cycle per second). What goes wrong, and how should the system handle it?',
      checkAnswer: 'With dt=1.0, the Euler integration takes steps of an entire cycle — the phase advances by 2*pi per step, making the simulation meaningless. The Nyquist criterion requires dt << 1/(2*f_max) = 0.5/f_max. For omega_0 = 2*pi (f=1 Hz), dt should be at most ~0.05s. The system should validate dt against the maximum frequency and either reject bad values or auto-correct with a warning.',
      codeIntro: 'Build the final polished Firefly Synchronization Simulator with a clean API, multiple topologies, and a comprehensive demonstration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ================================================================
# FIREFLY SYNCHRONIZATION SIMULATOR — Final Polished Version
# ================================================================
# A complete Kuramoto model simulator for studying emergent
# synchronization in coupled oscillator populations.
#
# Based on: Kuramoto (1975), Strogatz (2000)
#
# Limitations:
#   - Euler integration (no adaptive step)
#   - No time delays in coupling
#   - No refractory period
#   - No amplitude dynamics (phase-only model)
# ================================================================

class FireflySwarm:
    """Simulate synchronization in a population of coupled oscillators.

    Usage:
        swarm = FireflySwarm(n=100, topology='all-to-all')
        swarm.simulate(K=3.0, T=30.0)
        metrics = swarm.get_metrics()
    """

    TOPOLOGIES = ['all-to-all', 'grid-4', 'grid-8', 'random']

    def __init__(self, n=100, topology='all-to-all', freq_mean=1.0,
                 freq_spread=0.08, dt=0.02, seed=42):
        np.random.seed(seed)
        self.n = n
        self.topology = topology
        self.dt = dt
        self.omega_0 = 2 * np.pi * freq_mean
        self.gamma = freq_spread * 2 * np.pi

        # Validate
        assert topology in self.TOPOLOGIES, f"Unknown topology: {topology}"
        assert dt < 0.5 / freq_mean, f"dt={dt} too large for freq={freq_mean} Hz"

        # Natural frequencies (Gaussian for cleaner behavior)
        self.omegas = self.omega_0 + self.gamma * np.random.randn(n)

        # Build adjacency
        self._build_adjacency()

        # State
        self.theta = np.random.uniform(0, 2*np.pi, n)
        self.r_history = []
        self.phase_history = []
        self.simulated = False

    def _build_adjacency(self):
        """Build neighbor lists based on topology."""
        n = self.n
        if self.topology == 'all-to-all':
            self.neighbors = [list(range(n)) for _ in range(n)]
        elif self.topology in ('grid-4', 'grid-8'):
            side = int(np.sqrt(n))
            assert side * side == n, f"Grid topology requires square N (got {n})"
            self.grid_side = side
            self.neighbors = [[] for _ in range(n)]
            deltas = [(-1,0),(1,0),(0,-1),(0,1)]
            if self.topology == 'grid-8':
                deltas += [(-1,-1),(-1,1),(1,-1),(1,1)]
            for i in range(side):
                for j in range(side):
                    idx = i * side + j
                    for di, dj in deltas:
                        ni, nj = (i+di) % side, (j+dj) % side
                        self.neighbors[idx].append(ni * side + nj)
        elif self.topology == 'random':
            k_neighbors = min(10, n-1)
            self.neighbors = [list(np.random.choice(
                [j for j in range(n) if j != i], k_neighbors, replace=False
            )) for i in range(n)]

    def simulate(self, K=3.0, T=30.0):
        """Run the Kuramoto simulation."""
        n_steps = int(T / self.dt)
        self.K = K
        self.theta = np.random.uniform(0, 2*np.pi, self.n)
        self.r_history = []
        self.phase_history = []

        for step in range(n_steps):
            z = np.mean(np.exp(1j * self.theta))
            self.r_history.append(np.abs(z))

            if step % 50 == 0:
                self.phase_history.append(self.theta.copy() % (2*np.pi))

            # Compute coupling
            coupling = np.zeros(self.n)
            for i in range(self.n):
                nbrs = self.neighbors[i]
                n_nbrs = len(nbrs)
                if n_nbrs > 0:
                    coupling[i] = (K/n_nbrs) * np.sum(
                        np.sin(self.theta[nbrs] - self.theta[i]))

            self.theta += (self.omegas + coupling) * self.dt

        self.simulated = True
        return self

    def get_metrics(self):
        """Return synchronization metrics."""
        assert self.simulated, "Run simulate() first"
        r = np.array(self.r_history)
        return {
            'r_final': float(np.mean(r[-200:])),
            'r_max': float(np.max(r)),
            'r_history': r,
            'n_oscillators': self.n,
            'topology': self.topology,
            'K': self.K,
        }

# ================================================================
# DEMONSTRATION
# ================================================================

# --- Compare topologies ---
print("FIREFLY SYNCHRONIZATION SIMULATOR — Deployment Demo")
print("=" * 65)

topologies = ['all-to-all', 'grid-4', 'grid-8', 'random']
n_osc = 100  # 10x10 for grid
K_demo = 4.0
T_demo = 25.0

topo_results = {}
for topo in topologies:
    swarm = FireflySwarm(n=n_osc, topology=topo, freq_spread=0.08)
    swarm.simulate(K=K_demo, T=T_demo)
    metrics = swarm.get_metrics()
    topo_results[topo] = {'swarm': swarm, 'metrics': metrics}
    print(f"  {topo:<15} r_final={metrics['r_final']:.3f}")

# --- Visualization ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Firefly Synchronization Simulator — Topology Comparison',
             color='white', fontsize=16, fontweight='bold')

colors_topo = {'all-to-all': '#22c55e', 'grid-4': '#3b82f6', 'grid-8': '#f59e0b', 'random': '#a855f7'}

# Panel 1: r(t) for all topologies
ax = axes[0, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for topo in topologies:
    r = topo_results[topo]['metrics']['r_history']
    t = np.arange(len(r)) * 0.02
    ax.plot(t, r, color=colors_topo[topo], linewidth=1.5, label=topo, alpha=0.8)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('r (order parameter)', color='white')
ax.set_title('Synchronization Dynamics', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 1.05)

# Panel 2: Grid-4 phase snapshot (final state)
ax = axes[0, 1]; ax.set_facecolor('#111827')
swarm_grid = topo_results['grid-4']['swarm']
side = swarm_grid.grid_side
final_phase = swarm_grid.theta % (2*np.pi)
phase_grid = final_phase.reshape(side, side)
im = ax.imshow(phase_grid, cmap='twilight', vmin=0, vmax=2*np.pi, interpolation='nearest')
ax.set_title('Grid-4: Final Phase Pattern', color='white', fontsize=12)
ax.tick_params(colors='gray')
cbar = plt.colorbar(im, ax=ax, fraction=0.046)
cbar.set_label('Phase (rad)', color='white')
cbar.ax.tick_params(colors='gray')

# Panel 3: Phase transition curves per topology
ax = axes[1, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
K_sweep = np.linspace(0, 6.0, 15)
for topo in topologies:
    r_vs_K = []
    for K_val in K_sweep:
        s = FireflySwarm(n=n_osc, topology=topo, freq_spread=0.08)
        s.simulate(K=K_val, T=15.0)
        r_vs_K.append(s.get_metrics()['r_final'])
    ax.plot(K_sweep, r_vs_K, 'o-', color=colors_topo[topo], linewidth=1.5,
            markersize=4, label=topo)
ax.set_xlabel('Coupling K', color='white', fontsize=11)
ax.set_ylabel('Steady-state r', color='white', fontsize=11)
ax.set_title('Phase Transition by Topology', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 1.05)

# Panel 4: API reference
ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.set_xticks([]); ax.set_yticks([])
doc = """API Reference
------------------------------
swarm = FireflySwarm(
    n=100,
    topology='grid-4',
    freq_mean=1.0,       # Hz
    freq_spread=0.08,    # Hz (std)
    dt=0.02,             # seconds
)

swarm.simulate(K=4.0, T=30.0)
metrics = swarm.get_metrics()
  metrics['r_final']    -> 0.92
  metrics['r_history']  -> array(...)
  metrics['topology']   -> 'grid-4'

Topologies
------------------------------
  all-to-all  (fastest sync)
  grid-4      (traveling waves)
  grid-8      (faster grid sync)
  random      (small-world effects)

Limitations
------------------------------
  Euler integration only
  No time delays
  No refractory period
  Phase-only (no amplitude)"""

ax.text(0.05, 0.95, doc, transform=ax.transAxes, color='#22c55e',
        fontsize=8.5, va='top', fontfamily='monospace',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))
ax.set_title('Documentation', color='white', fontsize=11)

plt.tight_layout()
plt.show()

# --- Flash animation (static frames) ---
fig, axes = plt.subplots(1, 5, figsize=(18, 3.5))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Firefly Flash Sequence — Grid-4 Synchronized Swarm',
             color='white', fontsize=12, fontweight='bold')

for i, offset in enumerate(np.linspace(0, 2*np.pi, 5, endpoint=False)):
    ax = axes[i]; ax.set_facecolor('#000000')
    brightness = (np.cos(phase_grid - offset) + 1) / 2
    flash = np.zeros((side, side, 3))
    flash[:,:,1] = brightness * 0.95  # green
    flash[:,:,0] = brightness * 0.35  # yellow tint
    ax.imshow(flash, interpolation='nearest')
    ax.set_title(f'Frame {i+1}', color='white', fontsize=9)
    ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print()
print("CAPSTONE COMPLETE")
print("=" * 65)
print("You built a Firefly Synchronization Simulator from scratch:")
print("  1. Modeled individual oscillators with natural frequency variation")
print("  2. Implemented the Kuramoto coupling and observed phase transition")
print("  3. Extended to 2D spatial grids with local coupling")
print("  4. Analyzed entrainment: locked vs drifting oscillators")
print("  5. Tested robustness through perturbation and recovery analysis")
print("  6. Deployed with multiple topologies and clean API")
print()
print("Skills demonstrated: dynamical systems, nonlinear physics,")
print("numerical simulation, emergent behavior, scientific visualization.")`,
      challenge: 'Add a method swarm.find_critical_K() that uses binary search to find K_c to within 0.01 precision for any topology. Test it on all four topologies and compare — which topology requires the lowest K to synchronize?',
      successHint: 'You have completed a full capstone project: from isolated oscillators to emergent synchronization, with spatial dynamics, entrainment analysis, robustness testing, and clean deployment. The Kuramoto model is a cornerstone of complexity science — understanding it prepares you for oscillator problems in neuroscience, ecology, engineering, and physics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (circuits and electronics)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Firefly Synchronization Simulator. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
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
