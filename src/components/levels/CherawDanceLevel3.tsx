import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CherawDanceLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The harmonic oscillator differential equation',
      concept: `The motion of the Cheraw bamboo poles is governed by the **simple harmonic oscillator** equation:

\`m × d²x/dt² + b × dx/dt + k × x = F(t)\`

Where:
- **m** = mass of the bamboo pole
- **b** = damping coefficient (friction, air resistance)
- **k** = spring constant (bamboo stiffness)
- **F(t)** = driving force from the holders

This is a **second-order linear ODE**. We solve it numerically by converting to two first-order equations:
\`dx/dt = v\`
\`dv/dt = (F(t) - b×v - k×x) / m\`

This is the **Euler method**: step forward in time using the current derivatives.

📚 *We model continuous physics by taking tiny discrete time steps. The smaller the step (dt), the more accurate the simulation, but the slower it runs.*`,
      analogy: 'A differential equation is like a recipe that tells you how to change your current state. If you know your position and velocity right now, the equation tells you what your acceleration must be. Then you update your velocity, update your position, and repeat — like a GPS recalculating your route at every step.',
      storyConnection: 'The bamboo poles in Cheraw are real physical objects with mass, stiffness, and friction. The harmonic oscillator equation captures all these properties in a single elegant formula. Solving it predicts exactly how the bamboo moves — the same math describes atoms in crystals, circuits in radios, and stars in galaxies.',
      checkQuestion: 'What happens to the natural frequency if you use a stiffer bamboo (larger k) with the same mass?',
      checkAnswer: 'Natural frequency ω₀ = √(k/m). Larger k means higher frequency — stiffer bamboo vibrates faster. This is why thin, stiff bamboo produces higher-pitched sounds than thick, flexible bamboo. The holders would need to drive at a higher tempo to match.',
      codeIntro: 'Simulate a driven, damped harmonic oscillator using the Euler method to model bamboo pole motion.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Physical parameters
m = 0.5      # kg (bamboo pole mass)
k = 20.0     # N/m (bamboo stiffness)
b = 0.3      # damping coefficient
F0 = 5.0     # driving force amplitude (N)

omega_natural = np.sqrt(k / m)
f_natural = omega_natural / (2 * np.pi)
print(f"Natural frequency: {f_natural:.2f} Hz ({f_natural*60:.0f} BPM)")

# Euler method simulation
dt = 0.001   # time step (seconds)
t_max = 6.0
steps = int(t_max / dt)
t = np.linspace(0, t_max, steps)

# Try three driving frequencies
fig, axes = plt.subplots(3, 1, figsize=(10, 8))
fig.patch.set_facecolor('#111827')

drive_freqs = [f_natural * 0.5, f_natural, f_natural * 1.5]
labels = ['Below resonance', 'At resonance', 'Above resonance']
colors = ['#34d399', '#f87171', '#a78bfa']

for ax, f_drive, label, color in zip(axes, drive_freqs, labels, colors):
    x = np.zeros(steps)
    v = np.zeros(steps)

    for i in range(steps - 1):
        F = F0 * np.sin(2 * np.pi * f_drive * t[i])
        a = (F - b * v[i] - k * x[i]) / m
        v[i+1] = v[i] + a * dt
        x[i+1] = x[i] + v[i+1] * dt

    ax.set_facecolor('#1f2937')
    ax.plot(t, x * 100, color=color, linewidth=1.5)  # convert to cm
    ax.set_title(f'{label} (f_drive = {f_drive:.2f} Hz)',
                 color='white', fontsize=11, fontweight='bold')
    ax.set_ylabel('Position (cm)', color='lightgray')
    ax.tick_params(colors='lightgray')
    for s in ax.spines.values(): s.set_color('#374151')

    max_amp = np.max(np.abs(x[steps//2:])) * 100
    print(f"{label}: max amplitude = {max_amp:.1f} cm")

axes[-1].set_xlabel('Time (seconds)', color='lightgray')
plt.suptitle('Driven Harmonic Oscillator — Cheraw Bamboo Simulation',
             color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('/tmp/cheraw_ode.png', dpi=100, bbox_inches='tight',
            facecolor='#111827')
plt.show()`,
      challenge: 'Try reducing the damping coefficient b to 0.05. What happens to the resonance amplitude? Why would this be dangerous in a real Cheraw performance?',
      successHint: 'You solved your first differential equation numerically. The Euler method is the simplest ODE solver — it forms the foundation of computational physics, from weather prediction to spacecraft trajectories.',
    },
    {
      title: 'Coupled oscillators — multiple bamboo pairs',
      concept: `When multiple bamboo pairs interact, we get **coupled oscillators**. If two oscillators are connected (e.g., through the shared floor vibration), energy transfers between them.

For two coupled oscillators with equal mass and stiffness:
\`m × d²x₁/dt² = -k×x₁ - κ(x₁ - x₂)\`
\`m × d²x₂/dt² = -k×x₂ - κ(x₂ - x₁)\`

Where κ (kappa) is the **coupling strength**. This system has two **normal modes**:
- **Symmetric mode**: both oscillate in phase (same direction) at frequency ω₁ = √(k/m)
- **Antisymmetric mode**: oscillate in antiphase (opposite directions) at ω₂ = √((k + 2κ)/m)

The difference between these frequencies creates **beat patterns** — a slow modulation of amplitude.

📚 *We simulate two ODEs simultaneously by tracking four variables: x₁, v₁, x₂, v₂. This is how physicists model interacting systems.*`,
      analogy: 'Two coupled pendulums are like two friends on adjacent swings. If the swings share a flexible bar, pushing one swing affects the other. Energy "sloshes" back and forth: first one swing is high while the other is low, then they trade. The sloshing speed depends on how strong the connection is.',
      storyConnection: 'In complex Cheraw formations, bamboo pairs are held by the same group of holders sitting in a line. The motion of one pair subtly influences adjacent pairs through the holders\' bodies and the ground vibration. Master performers use this coupling to create mesmerizing wave patterns across the formation.',
      checkQuestion: 'If the coupling strength κ is very small compared to k, what happens to the beat frequency?',
      checkAnswer: 'Beat frequency = (ω₂ - ω₁) / (2π). When κ is small, ω₂ ≈ ω₁, so the beat frequency is very low — energy transfers slowly between the oscillators. With zero coupling, each oscillates independently. Strong coupling creates fast energy exchange.',
      codeIntro: 'Simulate two coupled bamboo pole pairs and observe energy exchange between them.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

m = 0.5
k = 20.0
kappa = 2.0   # coupling strength
b = 0.05      # light damping

dt = 0.001
t_max = 8.0
steps = int(t_max / dt)
t = np.linspace(0, t_max, steps)

# Initial conditions: only pole 1 is displaced
x1 = np.zeros(steps); v1 = np.zeros(steps)
x2 = np.zeros(steps); v2 = np.zeros(steps)
x1[0] = 0.3  # 30 cm displacement

for i in range(steps - 1):
    a1 = (-k * x1[i] - kappa * (x1[i] - x2[i]) - b * v1[i]) / m
    a2 = (-k * x2[i] - kappa * (x2[i] - x1[i]) - b * v2[i]) / m
    v1[i+1] = v1[i] + a1 * dt
    v2[i+1] = v2[i] + a2 * dt
    x1[i+1] = x1[i] + v1[i+1] * dt
    x2[i+1] = x2[i] + v2[i+1] * dt

# Energy in each oscillator
E1 = 0.5 * m * v1**2 + 0.5 * k * x1**2
E2 = 0.5 * m * v2**2 + 0.5 * k * x2**2

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7))
fig.patch.set_facecolor('#111827')

ax1.set_facecolor('#1f2937')
ax1.plot(t, x1 * 100, color='#34d399', linewidth=1.5, label='Pole pair 1')
ax1.plot(t, x2 * 100, color='#fbbf24', linewidth=1.5, label='Pole pair 2')
ax1.set_ylabel('Position (cm)', color='lightgray')
ax1.set_title('Coupled Bamboo Pole Motion', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

ax2.set_facecolor('#1f2937')
ax2.plot(t, E1, color='#34d399', linewidth=1.5, label='Energy in pair 1')
ax2.plot(t, E2, color='#fbbf24', linewidth=1.5, label='Energy in pair 2')
ax2.plot(t, E1 + E2, color='white', linewidth=1, linestyle='--', alpha=0.5, label='Total energy')
ax2.set_ylabel('Energy (J)', color='lightgray')
ax2.set_xlabel('Time (s)', color='lightgray')
ax2.set_title('Energy Exchange Between Pole Pairs', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/cheraw_coupled.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

beat_period = 2 * np.pi * m / kappa
print(f"Energy exchange period: {beat_period:.2f} seconds")
print(f"Energy sloshes from pair 1 to pair 2 and back every {beat_period:.1f} s")`,
      challenge: 'Try doubling the coupling strength to κ = 4.0. How does this change the beat frequency? Then try κ = 0.5 for weak coupling. What pattern emerges?',
      successHint: 'You simulated coupled oscillators — one of the most important models in physics. Coupled oscillations explain atomic bonds, electrical circuits, neural networks, and even the synchronization of fireflies.',
    },
    {
      title: 'Wave propagation along a bamboo line',
      concept: `When many oscillators are coupled in a chain, we get **wave propagation**. A disturbance at one end travels through the chain as a wave.

For N coupled oscillators in a line:
\`m × d²xₙ/dt² = -k×xₙ + κ(xₙ₊₁ - 2xₙ + xₙ₋₁)\`

This is the discrete version of the **wave equation**. The wave speed depends on coupling and mass:
\`v = a × √(κ/m)\`

Where a is the spacing between oscillators.

Wave properties emerge:
- **Wavelength** (λ): distance between identical points on adjacent waves
- **Wave speed** (v): how fast the disturbance travels
- **Dispersion**: different frequencies travel at different speeds

📚 *We simulate a chain of oscillators using numpy arrays. Instead of separate variables for each, we use array indexing: \`x[n-1]\`, \`x[n]\`, \`x[n+1]\`.*`,
      analogy: 'Imagine a line of dominoes standing on a vibrating table. Push the first one and the disturbance travels down the line. But unlike dominoes (which fall once), oscillators bounce back, so the wave keeps going back and forth. The speed depends on how closely spaced and how stiff the "connections" are.',
      storyConnection: 'In a grand Cheraw formation with 8-10 bamboo pairs in a line, the holders often create a wave pattern: each pair starts its cycle slightly after the previous one. A ripple of opening and closing bamboos flows down the line, and the dancer surfs this wave, stepping through each pair at the perfect moment.',
      checkQuestion: 'If wave speed is 2 m/s and bamboo pairs are spaced 1 m apart, how much time delay should each pair have to create a clean traveling wave?',
      checkAnswer: 'Time delay = spacing / wave speed = 1 m / 2 m/s = 0.5 seconds. Each pair starts its cycle 0.5 seconds after the previous one. At 90 BPM (period = 0.667 s), this is about 75% of a full cycle — a 270° phase shift between adjacent pairs.',
      codeIntro: 'Simulate wave propagation along a line of 10 coupled bamboo pairs.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Chain of 10 coupled oscillators
N = 10
m = 0.5
k = 20.0
kappa = 8.0
b = 0.1

dt = 0.0005
t_max = 4.0
steps = int(t_max / dt)

x = np.zeros((N, steps))
v = np.zeros((N, steps))

# Drive the first oscillator
f_drive = 1.5
F0 = 3.0

for i in range(steps - 1):
    a = np.zeros(N)
    # Driving force on first oscillator
    a[0] = (F0 * np.sin(2 * np.pi * f_drive * i * dt) - k * x[0, i]
            + kappa * (x[1, i] - x[0, i]) - b * v[0, i]) / m
    # Interior oscillators
    for n in range(1, N - 1):
        a[n] = (-k * x[n, i] + kappa * (x[n+1, i] - 2*x[n, i] + x[n-1, i])
                - b * v[n, i]) / m
    # Last oscillator (fixed boundary)
    a[N-1] = (-k * x[N-1, i] + kappa * (- 2*x[N-1, i] + x[N-2, i])
              - b * v[N-1, i]) / m

    v[:, i+1] = v[:, i] + a * dt
    x[:, i+1] = x[:, i] + v[:, i+1] * dt

# Plot snapshots
fig, axes = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#111827')

# Space-time diagram
ax = axes[0]
ax.set_facecolor('#1f2937')
subsample = 20
t_sub = np.arange(0, steps, subsample) * dt
extent = [t_sub[0], t_sub[-1], N - 0.5, 0.5]
ax.imshow(x[:, ::subsample] * 100, aspect='auto', extent=extent,
          cmap='RdBu_r', vmin=-15, vmax=15, interpolation='bilinear')
ax.set_xlabel('Time (s)', color='lightgray')
ax.set_ylabel('Pole pair #', color='lightgray')
ax.set_title('Wave Propagation Along Bamboo Line', color='white', fontsize=13, fontweight='bold')
ax.tick_params(colors='lightgray')

# Snapshot at specific time
ax2 = axes[1]
ax2.set_facecolor('#1f2937')
for t_snap, color, ls in [(1.0, '#34d399', '-'), (1.5, '#fbbf24', '--'), (2.0, '#f87171', ':')]:
    idx = int(t_snap / dt)
    ax2.plot(range(1, N+1), x[:, idx] * 100, color=color, linewidth=2,
             marker='o', markersize=6, label=f't = {t_snap}s')
ax2.set_xlabel('Pole pair number', color='lightgray')
ax2.set_ylabel('Displacement (cm)', color='lightgray')
ax2.set_title('Snapshots of Wave at Different Times', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/cheraw_wave.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

wave_speed = np.sqrt(kappa / m)
print(f"Theoretical wave speed: {wave_speed:.2f} m/s")
print(f"Wave takes ~{N / wave_speed:.2f} seconds to cross all {N} pairs")`,
      challenge: 'Change the boundary condition at the last oscillator from fixed to free (remove the -2*x[N-1] term, use just x[N-2] - x[N-1]). How does the wave reflection change? This is the difference between a hard wall and an open end in acoustics.',
      successHint: 'You simulated wave propagation through coupled oscillators — the foundation of acoustics, seismology, and solid-state physics. The space-time diagram you created is exactly how physicists visualize wave motion in crystals and along strings.',
    },
    {
      title: 'Nonlinear oscillations and chaos',
      concept: `Real bamboo does not obey a perfect linear spring law. At large displacements, the restoring force becomes **nonlinear**:

\`F = -k×x - α×x³\`

The cubic term α×x³ is the **anharmonic correction**. It makes the frequency depend on amplitude — a fundamentally nonlinear effect.

For even stronger nonlinearity, or with periodic driving at the wrong frequency, the motion can become **chaotic**: deterministic but unpredictable. Tiny changes in initial conditions lead to wildly different outcomes.

The **Duffing oscillator** models this:
\`d²x/dt² + δ(dx/dt) + αx + βx³ = γ cos(ωt)\`

Depending on parameters, solutions can be periodic, quasiperiodic, or chaotic.

📚 *We detect chaos by checking sensitivity to initial conditions: run two simulations with slightly different starting points and see if they diverge.*`,
      analogy: 'Linear oscillation is like a ball rolling in a smooth bowl — predictable and gentle. Nonlinear oscillation is like a ball in a bumpy bowl with ridges. Small amplitude: the ball stays in the center and behaves normally. Large amplitude: it hits the ridges and its path becomes complicated, even chaotic.',
      storyConnection: 'When Cheraw dancers push the boundaries — faster tempos, wider amplitudes — the bamboo motion transitions from smooth and predictable to complex and potentially chaotic. This is the edge where the dance becomes dangerous but also most visually dramatic. Master performers live on this edge of chaos.',
      checkQuestion: 'Why does nonlinearity cause the frequency to depend on amplitude?',
      checkAnswer: 'In a linear spring, the restoring force is proportional to displacement, so the oscillation period is constant regardless of amplitude. With a cubic term, larger displacements encounter a stronger restoring force (for α > 0), making the oscillator "stiffer" at large amplitudes and increasing the frequency. This is called amplitude-frequency coupling.',
      codeIntro: 'Simulate the Duffing oscillator and explore the transition from periodic to chaotic motion.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

def duffing(x, v, t, delta, alpha, beta, gamma, omega):
    """Duffing oscillator: returns acceleration."""
    return gamma * np.cos(omega * t) - delta * v - alpha * x - beta * x**3

dt = 0.001
t_max = 30.0
steps = int(t_max / dt)
t = np.linspace(0, t_max, steps)

# Parameters for chaotic regime
delta = 0.3    # damping
alpha = -1.0   # negative linear stiffness
beta = 1.0     # cubic stiffness
omega = 1.2    # driving frequency

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#111827')

# Two slightly different initial conditions
for col, gamma_val, title in [(0, 0.2, 'Periodic (weak drive)'),
                                (1, 0.5, 'Chaotic (strong drive)')]:
    x1 = np.zeros(steps); v1 = np.zeros(steps)
    x2 = np.zeros(steps); v2 = np.zeros(steps)
    x1[0] = 1.0; v1[0] = 0
    x2[0] = 1.001; v2[0] = 0  # tiny difference

    for i in range(steps - 1):
        a1 = duffing(x1[i], v1[i], t[i], delta, alpha, beta, gamma_val, omega)
        a2 = duffing(x2[i], v2[i], t[i], delta, alpha, beta, gamma_val, omega)
        v1[i+1] = v1[i] + a1 * dt
        v2[i+1] = v2[i] + a2 * dt
        x1[i+1] = x1[i] + v1[i+1] * dt
        x2[i+1] = x2[i] + v2[i+1] * dt

    # Time series
    ax = axes[0][col]
    ax.set_facecolor('#1f2937')
    ax.plot(t, x1, color='#34d399', linewidth=0.8, label='x₀=1.000')
    ax.plot(t, x2, color='#f87171', linewidth=0.8, label='x₀=1.001')
    ax.set_title(title, color='white', fontsize=12, fontweight='bold')
    ax.set_ylabel('Position', color='lightgray')
    ax.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=8)
    ax.tick_params(colors='lightgray')
    for s in ax.spines.values(): s.set_color('#374151')

    # Phase portrait (last 50%)
    ax2 = axes[1][col]
    ax2.set_facecolor('#1f2937')
    start = steps // 2
    ax2.plot(x1[start:], v1[start:], color='#a78bfa', linewidth=0.3, alpha=0.7)
    ax2.set_xlabel('Position', color='lightgray')
    ax2.set_ylabel('Velocity', color='lightgray')
    ax2.set_title('Phase Portrait', color='white', fontsize=11)
    ax2.tick_params(colors='lightgray')
    for s in ax2.spines.values(): s.set_color('#374151')

plt.suptitle('Duffing Oscillator — Order vs Chaos in Bamboo Motion',
             color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('/tmp/cheraw_chaos.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()
print("Periodic: both trajectories stay together (predictable)")
print("Chaotic: tiny 0.1% difference grows until trajectories diverge completely")`,
      challenge: 'Try gamma = 0.35, which is at the edge between periodic and chaotic. Run the simulation for longer (t_max = 60). Can you see intermittent chaos — periods of order interrupted by bursts of chaos?',
      successHint: 'You explored the boundary between order and chaos in nonlinear oscillators. Chaos theory reveals that deterministic systems can be inherently unpredictable — a profound insight discovered through exactly this kind of numerical simulation.',
    },
    {
      title: 'Rhythm entrainment — Kuramoto synchronization model',
      concept: `When multiple oscillators interact, they tend to **synchronize** — a phenomenon called **entrainment**. The Kuramoto model describes this:

\`dθᵢ/dt = ωᵢ + (K/N) × Σⱼ sin(θⱼ - θᵢ)\`

Where:
- θᵢ = phase of oscillator i
- ωᵢ = natural frequency of oscillator i
- K = coupling strength
- N = number of oscillators

Below a critical coupling K_c, oscillators run independently. Above K_c, they spontaneously synchronize. The **order parameter** r measures synchronization:
- r ≈ 0: random phases (no sync)
- r ≈ 1: perfect synchronization

This models how Cheraw performers naturally fall into sync — their individual internal rhythms align through auditory and visual coupling.

📚 *The Kuramoto model is a classic example of an emergent phenomenon: simple local rules (each oscillator adjusts to its neighbors) produce global order (synchronization).*`,
      analogy: 'Entrainment is like an audience learning to clap in unison. Initially everyone claps at slightly different rates. But each person unconsciously adjusts their timing toward the average, and within seconds, the entire audience is synchronized. No conductor needed — synchronization emerges from the coupling.',
      storyConnection: 'In Cheraw, the holders do not have a conductor or metronome. They synchronize through hearing each other\'s claps and feeling each other\'s movements. The Kuramoto model explains how this works mathematically: each holder is an oscillator with a slightly different natural tempo, but coupling through sound and touch pulls them into sync.',
      checkQuestion: 'What determines the critical coupling strength K_c needed for synchronization?',
      checkAnswer: 'K_c depends on the spread of natural frequencies. If all oscillators have nearly the same natural frequency, even weak coupling (small K) is enough. If natural frequencies are widely spread, you need strong coupling (large K). For Cheraw, well-practiced holders have similar internal tempos, so they synchronize easily.',
      codeIntro: 'Simulate the Kuramoto model showing how Cheraw performers synchronize their rhythms.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

np.random.seed(42)
N = 8  # number of Cheraw holders

# Natural frequencies: slightly different internal tempos
mean_freq = 1.5  # Hz (90 BPM)
freq_spread = 0.15
omega = np.random.normal(mean_freq, freq_spread, N)

dt = 0.01
t_max = 15.0
steps = int(t_max / dt)
t = np.linspace(0, t_max, steps)

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#111827')

coupling_values = [0.0, 0.5, 2.0, 5.0]
titles = ['No coupling (K=0)', 'Weak coupling (K=0.5)',
          'Moderate coupling (K=2)', 'Strong coupling (K=5)']

for ax, K, title in zip(axes.flat, coupling_values, titles):
    theta = np.random.uniform(0, 2 * np.pi, N)
    r_history = []

    for step in range(steps):
        # Compute order parameter
        complex_order = np.mean(np.exp(1j * theta))
        r = np.abs(complex_order)
        r_history.append(r)

        # Update phases (Euler method)
        for i in range(N):
            coupling_sum = np.sum(np.sin(theta - theta[i]))
            theta[i] += (omega[i] + K / N * coupling_sum) * dt

    ax.set_facecolor('#1f2937')
    ax.plot(t, r_history, color='#fbbf24', linewidth=2)
    ax.set_ylim(0, 1.05)
    ax.set_title(title, color='white', fontsize=11, fontweight='bold')
    ax.set_ylabel('Sync (r)', color='lightgray')
    ax.axhline(0.8, color='#34d399', linestyle='--', alpha=0.5, linewidth=1)
    ax.tick_params(colors='lightgray')
    for s in ax.spines.values(): s.set_color('#374151')

    final_r = np.mean(r_history[-100:])
    print(f"K={K:.1f}: final sync = {final_r:.3f} {'✓ synchronized' if final_r > 0.8 else '✗ not synced'}")

axes[1][0].set_xlabel('Time (s)', color='lightgray')
axes[1][1].set_xlabel('Time (s)', color='lightgray')
plt.suptitle('Kuramoto Synchronization — Cheraw Holder Entrainment',
             color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('/tmp/cheraw_kuramoto.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()`,
      challenge: 'Increase the frequency spread to 0.5 Hz (like novice performers with very different internal tempos). How much stronger does the coupling need to be for synchronization? What does this tell you about why practice matters?',
      successHint: 'You simulated the Kuramoto model — the standard model for synchronization in physics, biology, and neuroscience. It explains everything from synchronized fireflies to neural oscillations to the Cheraw dance: local coupling creates global order.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Differential Equations & Oscillator Simulations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
