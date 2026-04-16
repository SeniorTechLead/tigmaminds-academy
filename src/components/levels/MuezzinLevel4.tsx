import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import MuezzinInverseSquareDiagram from '../diagrams/MuezzinInverseSquareDiagram';
import MuezzinDomeAcousticsDiagram from '../diagrams/MuezzinDomeAcousticsDiagram';
import MuezzinSpeakerDiagram from '../diagrams/MuezzinSpeakerDiagram';
import MuezzinCityPropagationDiagram from '../diagrams/MuezzinCityPropagationDiagram';
import InterferenceDiagram from '../diagrams/InterferenceDiagram';
import ActivitySoundDistanceDiagram from '../diagrams/ActivitySoundDistanceDiagram';

export default function MuezzinLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Minaret design optimiser — height, shape, and acoustic performance',
      concept: `A minaret’s acoustic performance depends on its **height** (range), **shape** (directionality), and **balcony design** (projection angle). Taller minarets reach further but cost more and face structural limits. Cylindrical shapes radiate omnidirectionally; octagonal shapes have slight directional preferences.

The balcony (serefe) is critical. If the Muezzin stands at the outer edge with the balcony floor below, the floor acts as a ground plane reflector. Sound waves travelling downward reflect off the floor and combine with the direct upward-radiating waves. For frequencies where the floor-to-mouth height is λ/4, the reflected and direct waves are in phase — **constructive interference** doubles the sound pressure in the horizontal direction.

The code models a minaret’s acoustic radiation pattern as a function of height, balcony dimensions, and frequency.`,
      analogy: 'A lighthouse needs to be tall to shine its beam far. But height alone is not enough — the shape of the lens, the angle of the reflector, and the power of the lamp all matter. A minaret is an acoustic lighthouse: height gives range, the balcony shapes the beam, and the Muezzin’s voice is the source.',
      storyConnection: 'The minarets of the Blue Mosque in Istanbul are 64 metres tall with three balconies each. The multiple balconies served different functions: the highest for the pre-dawn call (when sound carries furthest in still air), the middle for the noon call (when thermal updrafts could lift sound), and the lowest for evening (when the temperature inversion bends sound downward).',
      checkQuestion: 'Why might a hexagonal minaret have slightly better acoustic performance than a circular one?',
      checkAnswer: 'A circular minaret scatters sound equally in all directions, but some energy is wasted on the side facing the mosque building itself. A hexagonal minaret has flat faces that can be oriented to direct more energy toward the city and less toward the building. Each flat face acts as a small reflector. The effect is subtle (1-2 dB) but was potentially noticed by empirical testing over centuries.',
      codeIntro: 'Model a minaret’s acoustic radiation pattern with balcony reflections.',
      code: `import numpy as np
import matplotlib.pyplot as plt

v = 343
freq = 500  # Hz (fundamental of Muezzin's voice)
wavelength = v / freq

# Minaret parameters
heights = [30, 50, 70]  # metres
balcony_width = 2.5  # metres radius
mouth_height = 1.6   # metres above balcony floor

# Radiation pattern: combination of monopole + ground plane reflection
theta = np.linspace(0, np.pi, 360)  # 0 = up, pi/2 = horizontal, pi = down

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5), subplot_kw=dict(projection='polar') if False else {})

# Polar plot of radiation pattern
for h, col, ls in zip(heights, ['#ef4444', '#3b82f6', '#10b981'], ['-', '--', '-.']):
    # Ground plane effect: reflection from balcony floor
    path_diff = 2 * mouth_height * np.cos(theta)  # extra path for reflected wave
    phase_diff = 2 * np.pi * path_diff / wavelength
    # Combined amplitude (direct + reflected with some absorption)
    refl_coeff = 0.7  # balcony floor reflection
    amplitude = np.abs(1 + refl_coeff * np.exp(1j * phase_diff))

    # Inverse square law at 500m as function of angle from horizontal
    # At angle theta from vertical, horizontal distance at 500m from base
    elevation = np.pi/2 - theta
    # Normalize
    amplitude = amplitude / amplitude.max()

    ax1.plot(np.degrees(theta) - 90, amplitude, color=col, linewidth=2,
             label=f'h={h}m')

ax1.set_xlabel('Angle from horizontal (°)', fontsize=10)
ax1.set_ylabel('Relative amplitude', fontsize=10)
ax1.set_title('Minaret Radiation Pattern (500 Hz)', fontsize=12)
ax1.legend(fontsize=10)
ax1.grid(alpha=0.3)
ax1.axvline(0, color='white', linewidth=0.5, linestyle=':', alpha=0.3)
ax1.text(5, 0.5, 'Horizontal', color='white', fontsize=10, rotation=90)

# Coverage radius vs height
h_range = np.linspace(10, 100, 100)
source_dB = 95  # dB at 1m
ambient = 35     # quiet city ambient dB
# Max distance where signal > ambient
# dB at distance d from height h: 95 - 20*log10(sqrt(d^2 + h^2))
# But direct line of sight helps
coverage = []
for h in h_range:
    d_max = 10 ** ((source_dB - ambient) / 20) * 1  # simplified
    # Account for height advantage: effective distance is sqrt(d^2 + h^2)
    # but h provides line of sight over obstacles
    obstacle_bonus = min(h / 10, 10)  # dB bonus for height (empirical)
    d_effective = 10 ** ((source_dB + obstacle_bonus - ambient) / 20)
    coverage.append(d_effective)

ax2.plot(h_range, coverage, color='#3b82f6', linewidth=2.5)
ax2.fill_between(h_range, coverage, color='#3b82f6', alpha=0.1)
for h, col in [(30, '#ef4444'), (50, '#3b82f6'), (70, '#10b981')]:
    idx = int((h - 10) / 90 * 99)
    ax2.scatter([h], [coverage[idx]], color=col, s=100, zorder=5)
    ax2.annotate(f'{h}m: {coverage[idx]:.0f}m range',
                xy=(h, coverage[idx]), xytext=(h+5, coverage[idx]+200),
                fontsize=10, color=col,
                arrowprops=dict(arrowstyle='->', color=col))

ax2.set_xlabel('Minaret height (m)', fontsize=11)
ax2.set_ylabel('Coverage radius (m)', fontsize=11)
ax2.set_title('Adhan Coverage vs Minaret Height', fontsize=12)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("=== Minaret Design Summary ===")
for h in [30, 50, 70]:
    idx = int((h - 10) / 90 * 99)
    area = np.pi * coverage[idx]**2 / 1e6
    print(f"  h={h}m: range={coverage[idx]:.0f}m, area={area:.1f} km²")`,
      challenge: 'Add wind effects: a 20 km/h wind shifts the Adhan’s coverage pattern downwind. Model the asymmetric coverage and calculate how much of the city loses audibility in windy conditions.',
      successHint: 'Minaret design is a centuries-old optimisation problem that blends structural engineering, acoustics, and aesthetics. Modern mosque designers use computational tools to solve what Ottoman architects solved by iterative testing over generations.',
    },
    {
      title: 'Acoustic simulation engine — FDTD wave propagation',
      concept: `The gold standard for room acoustics simulation is the **Finite-Difference Time-Domain (FDTD)** method. Unlike ray tracing (which approximates sound as rays), FDTD solves the actual **wave equation** directly on a grid:

**∂²p/∂t² = c² (∂²p/∂x² + ∂²p/∂y²)**

Where p is sound pressure and c is the speed of sound.

FDTD captures everything: diffraction, interference, resonance, and all wave phenomena that ray tracing misses. The cost: you need a grid with cell size ≤ λ/10 (at least 10 cells per wavelength). For 1 kHz (λ = 0.34 m), cells must be ≤ 3.4 cm. A 30m room needs 900 cells per side — 810,000 cells in 2D. Each time step advances by dt = dx/(c√2) for stability.

The code implements a 2D FDTD acoustic simulation of a simplified mosque.`,
      analogy: 'Ray tracing is like tracking individual billiard balls. FDTD is like watching the entire pool of water ripple. When you drop a stone in a pond, you see wavefronts spread, diffract around obstacles, and interfere. FDTD literally simulates this ripple-by-ripple, capturing every wave phenomenon. It is slower but fundamentally more accurate.',
      storyConnection: 'Recent PhD research at Istanbul Technical University used FDTD to study the acoustics of the Süleymaniye Mosque below 500 Hz, where ray tracing fails. The FDTD simulation revealed that the mosque’s dome creates a strong resonance at 43 Hz — a frequency felt more than heard, contributing to the sense of awe and grandeur that visitors report.',
      checkQuestion: 'Why is FDTD computationally expensive for high frequencies?',
      checkAnswer: 'At 10 kHz, λ = 3.4 cm. The grid needs cells ≤ 3.4 mm. A 30m room would need ~9000 cells per side = 81 million cells in 2D (or 729 billion in 3D). Each cell must be updated at every time step. This is why FDTD is practical for low frequencies (< 1 kHz) in room-sized spaces, while ray tracing handles high frequencies. Hybrid methods combine both.',
      codeIntro: 'Implement a 2D FDTD acoustic wave simulation in a room.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 2D FDTD acoustic simulation
# Room: 20m x 15m (scaled down for speed)
Lx, Ly = 20, 15
c = 343  # speed of sound

# Grid: 10 cells per metre (good for < 500 Hz)
dx = 0.1  # metres
nx = int(Lx / dx)
ny = int(Ly / dx)
dt = dx / (c * np.sqrt(2)) * 0.95  # CFL stability

# Pressure fields
p = np.zeros((nx, ny))      # current
p_prev = np.zeros((nx, ny)) # previous
p_next = np.zeros((nx, ny)) # next

# Source: Gaussian pulse at imam position
sx, sy = nx//2, ny//6  # near front wall
freq_centre = 200  # Hz

# Wall absorption (0 = perfect reflection, 1 = perfect absorption)
wall_absorption = 0.2

n_steps = 800
snapshots = []
snap_steps = [50, 150, 300, 500]

# Receiver positions
receivers = [(nx//4, ny//2), (nx//2, ny//2), (3*nx//4, ny//2)]
recv_signals = [[] for _ in receivers]

courant = (c * dt / dx) ** 2

for step in range(n_steps):
    # Source: modulated Gaussian pulse
    t_now = step * dt
    source_signal = np.sin(2 * np.pi * freq_centre * t_now) * np.exp(-((t_now - 0.01)**2) / (0.003**2))
    p[sx, sy] += source_signal * 2

    # FDTD update (interior)
    p_next[1:-1, 1:-1] = (2 * p[1:-1, 1:-1] - p_prev[1:-1, 1:-1] +
        courant * (p[2:, 1:-1] + p[:-2, 1:-1] + p[1:-1, 2:] + p[1:-1, :-2] - 4 * p[1:-1, 1:-1]))

    # Absorbing boundary conditions (simple first-order)
    p_next[0, :] = p[1, :] * (1 - wall_absorption)
    p_next[-1, :] = p[-2, :] * (1 - wall_absorption)
    p_next[:, 0] = p[:, 1] * (1 - wall_absorption)
    p_next[:, -1] = p[:, -2] * (1 - wall_absorption)

    # Shift time steps
    p_prev = p.copy()
    p = p_next.copy()

    # Record receivers
    for i, (rx, ry) in enumerate(receivers):
        recv_signals[i].append(p[rx, ry])

    if step in snap_steps:
        snapshots.append((step, p.copy()))

# Visualize
fig, axes = plt.subplots(2, 2, figsize=(13, 10))

for idx, (step, snap) in enumerate(snapshots[:4]):
    ax = axes[idx // 2, idx % 2]
    vmax = np.max(np.abs(snap)) * 0.5
    if vmax < 1e-10:
        vmax = 1
    ax.imshow(snap.T, cmap='RdBu_r', vmin=-vmax, vmax=vmax,
              origin='lower', extent=[0, Lx, 0, Ly], aspect='auto')
    ax.plot(sx*dx, sy*dx, 'k*', markersize=12)
    for rx, ry in receivers:
        ax.plot(rx*dx, ry*dx, 'wo', markersize=6)
    ax.set_title(f'Step {step} (t = {step*dt*1000:.1f} ms)', fontsize=11)
    ax.set_xlabel('X (m)', fontsize=10)
    ax.set_ylabel('Y (m)', fontsize=10)

plt.tight_layout()
plt.show()

# Receiver signals
fig2, ax = plt.subplots(figsize=(12, 4))
t_axis = np.arange(n_steps) * dt * 1000
labels = ['Left', 'Centre', 'Right']
colors = ['#ef4444', '#3b82f6', '#10b981']
for sig, lab, col in zip(recv_signals, labels, colors):
    ax.plot(t_axis, sig, color=col, linewidth=1, label=lab, alpha=0.8)
ax.set_xlabel('Time (ms)', fontsize=11)
ax.set_ylabel('Pressure', fontsize=11)
ax.set_title('Sound Pressure at Three Receiver Positions', fontsize=12)
ax.legend(fontsize=10)
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()

print(f"Grid: {nx} x {ny} = {nx*ny:,} cells")
print(f"dx = {dx}m, dt = {dt*1e6:.1f} µs")
print(f"Max valid frequency: {c/(10*dx):.0f} Hz")
print(f"Simulation time: {n_steps*dt*1000:.1f} ms")`,
      challenge: 'Add a semicircular dome at the top of the room (reflecting boundary) and compare the pressure distribution with and without the dome. Does the dome create a focal region?',
      successHint: 'FDTD is the most accurate acoustic simulation method available. It captures all wave phenomena from first principles. The trade-off is computational cost, which is why real-world simulations often combine FDTD (low frequencies) with ray tracing (high frequencies) for full-bandwidth prediction.',
    },
    {
      title: 'Speaker array beamforming — steering sound electronically',
      concept: `A **phased array** of speakers can steer a beam of sound in any direction without physically moving. The trick: add a small **time delay** to each speaker so that the wavefronts from all speakers arrive in phase at the desired angle.

For a linear array of N speakers spaced d apart, the delay for speaker n to steer to angle θ is:

**Δt_n = n × d × sin(θ) / c**

When all speakers emit with these delays, constructive interference creates a beam at angle θ and destructive interference suppresses sound in other directions. The beam width is approximately:

**Δθ ≈ λ / (N × d)**

More speakers or wider spacing = narrower beam. Higher frequency = narrower beam.

Modern mosque speaker arrays use this to direct the Adhan toward the city while minimising sound toward nearby apartments.`,
      analogy: 'Imagine a line of people on a beach, each throwing a stone into the water. If they all throw at exactly the same time, the ripples spread in all directions. But if each person throws slightly later than the one before them (a "Mexican wave" of throws), the resulting wave pattern has a strong beam in one direction. This is beamforming: coordinated timing creates directional waves.',
      storyConnection: 'In modern Istanbul, noise complaints from residents near mosques have led to regulated sound levels. Beamforming speaker arrays allow mosques to direct the Adhan outward and downward (toward the neighbourhood) while creating a "null" (silence zone) directly at the nearest apartment building. This is acoustic engineering solving a social problem.',
      checkQuestion: 'An 8-speaker array with d = 0.2m spacing operates at 1 kHz. What is the beam width?',
      checkAnswer: 'λ = 343/1000 = 0.343 m. Δθ ≈ 0.343 / (8 × 0.2) = 0.214 radians = 12.3°. This is a reasonably tight beam. At 4 kHz, the beam narrows to 3.1°. At 250 Hz, it widens to 49° — too broad for directional control. This is why beamforming works best at higher frequencies.',
      codeIntro: 'Simulate a phased speaker array and visualise beamforming.',
      code: `import numpy as np
import matplotlib.pyplot as plt

v = 343
N_speakers = 12
d = 0.15  # speaker spacing (metres)

# Steer beam to different angles
steer_angles = [0, 30, -20]
freq = 1000

theta = np.linspace(-90, 90, 1000)
theta_rad = np.radians(theta)
wavelength = v / freq
k = 2 * np.pi / wavelength

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))

colors = ['#3b82f6', '#ef4444', '#10b981']
for steer, col in zip(steer_angles, colors):
    steer_rad = np.radians(steer)
    # Array factor
    AF = np.zeros_like(theta, dtype=complex)
    for n in range(N_speakers):
        phase = k * n * d * (np.sin(theta_rad) - np.sin(steer_rad))
        AF += np.exp(1j * phase)
    AF_mag = np.abs(AF) / N_speakers

    ax1.plot(theta, 20*np.log10(AF_mag + 1e-10), color=col, linewidth=2,
             label=f'Steer: {steer}°')

ax1.set_xlabel('Angle (°)', fontsize=11)
ax1.set_ylabel('Array gain (dB)', fontsize=11)
ax1.set_title(f'{N_speakers}-Speaker Array at {freq} Hz', fontsize=12)
ax1.set_ylim(-30, 3)
ax1.legend(fontsize=10)
ax1.grid(alpha=0.3)

# Frequency dependence of beamwidth
freqs = np.linspace(200, 4000, 200)
beamwidths = np.degrees(v / (freqs * N_speakers * d))

ax2.plot(freqs, beamwidths, color='#a855f7', linewidth=2.5)
ax2.axhline(15, color='#f59e0b', linewidth=1.5, linestyle='--')
ax2.text(500, 17, 'Target beamwidth (15°)', color='#f59e0b', fontsize=10)
ax2.fill_between(freqs, 0, beamwidths, where=beamwidths < 15,
                 color='#10b981', alpha=0.1)
ax2.fill_between(freqs, 0, beamwidths, where=beamwidths >= 15,
                 color='#ef4444', alpha=0.1)
ax2.set_xlabel('Frequency (Hz)', fontsize=11)
ax2.set_ylabel('Beamwidth (°)', fontsize=11)
ax2.set_title('Beamwidth vs Frequency', fontsize=12)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print(f"Array: {N_speakers} speakers, spacing {d}m")
print(f"Total aperture: {(N_speakers-1)*d:.2f}m")
print()
for f in [250, 500, 1000, 2000, 4000]:
    bw = np.degrees(v / (f * N_speakers * d))
    print(f"  {f:>5} Hz: beamwidth = {bw:>5.1f}° {'(too wide)' if bw > 30 else '(good)' if bw > 10 else '(very tight)'}")`,
      challenge: 'Design a circular array (speakers on a ring) that steers the Adhan in all horizontal directions while creating a null directly downward (to protect ground-floor residents). Calculate the required number of speakers and ring diameter.',
      successHint: 'Beamforming is used everywhere: 5G cellular antennas, medical ultrasound imaging, sonar, radar, and concert sound systems. The mathematics is identical — delay and sum — whether the waves are sound, radio, or light.',
    },
    {
      title: 'Urban sound propagation — modelling the Adhan across a city',
      concept: `Sound propagation in a city is far more complex than the simple inverse square law. Buildings create **shadow zones** (diffraction), **reflections** create multiple paths, **ground absorption** varies (asphalt vs. gardens), and **atmospheric conditions** (wind, temperature gradients) bend the sound path.

Professional urban acoustics uses the **ISO 9613** standard, which adds corrections to the basic inverse square law:

**L = L_source - A_div - A_atm - A_ground - A_barrier - A_misc**

Where A_div = geometric divergence (inverse square), A_atm = air absorption, A_ground = ground effect, A_barrier = building shielding, and A_misc = other factors.

Building shielding (diffraction around buildings) uses the Maekawa formula:
**A_barrier ≈ 10 × log₁₀(3 + 20N)**
where N is the Fresnel number = 2δ/λ (δ = path difference).

The code creates a simplified urban sound propagation model for the Adhan.`,
      analogy: 'Imagine shining a flashlight across a miniature city model. Some buildings block the light (shadow zones). Some surfaces reflect it (creating bright spots). The ground colour (dark pavement vs. light grass) affects how much light bounces upward. And heat shimmer from the model bends the light beam. Sound in a city follows all the same patterns, just with longer wavelengths.',
      storyConnection: 'In Ottoman-era Istanbul, minarets were spaced so that the entire city was within earshot of at least one Muezzin. The spacing was determined empirically over centuries. Modern acoustic modelling can replicate this: given a city’s building layout, wind patterns, and ambient noise map, we can calculate the optimal minaret (or loudspeaker) placement for full coverage with minimum noise pollution.',
      checkQuestion: 'A 4-storey building (12m tall) sits between a minaret and a listener. The minaret top is 50m high and the listener is 200m behind the building. Does the building significantly block the sound?',
      checkAnswer: 'The sound from a 50m minaret travels downward at a steep angle to clear a 12m building 200m away. The direct path clears the building easily (the angle from minaret top to building top to listener has δ near zero, so N ≈ 0 and A_barrier ≈ 5 dB). If the minaret were only 15m tall, the building would be a significant barrier (N >> 1, A_barrier > 15 dB). This confirms why height matters.',
      codeIntro: 'Model Adhan propagation across a simplified city grid.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# City grid: 1000m x 1000m
grid_size = 1000  # metres
resolution = 5     # metres per cell
nx = grid_size // resolution
ny = grid_size // resolution

# Minaret at centre
mx, my = nx//2, ny//2
minaret_height = 60  # metres
source_dB = 100  # at 1m

# Buildings: random blocks
np.random.seed(42)
building_map = np.zeros((nx, ny))
for _ in range(80):
    bx = np.random.randint(10, nx-10)
    by = np.random.randint(10, ny-10)
    bw = np.random.randint(3, 8)  # width in cells
    bh = np.random.randint(3, 8)
    height = np.random.uniform(8, 25)  # metres
    building_map[bx:bx+bw, by:by+bh] = height

# Clear area around minaret (mosque compound)
building_map[mx-5:mx+5, my-5:my+5] = 0

# Calculate sound level at each point
sound_map = np.zeros((nx, ny))
freq = 500
wavelength = 343 / freq
m_air = 0.005  # air absorption at 500 Hz (dB/m)

for i in range(nx):
    for j in range(ny):
        dx = (i - mx) * resolution
        dy = (j - my) * resolution
        dist = np.sqrt(dx**2 + dy**2)
        if dist < 1:
            sound_map[i, j] = source_dB
            continue

        # Geometric divergence
        A_div = 20 * np.log10(dist)

        # Air absorption
        A_atm = m_air * dist

        # Building barrier (simplified: check if buildings between source and receiver)
        n_steps_path = int(dist / resolution)
        if n_steps_path > 0:
            path_x = np.linspace(mx, i, n_steps_path).astype(int)
            path_y = np.linspace(my, j, n_steps_path).astype(int)
            path_x = np.clip(path_x, 0, nx-1)
            path_y = np.clip(path_y, 0, ny-1)
            max_building = 0
            for px, py in zip(path_x, path_y):
                if building_map[px, py] > max_building:
                    max_building = building_map[px, py]

            # Barrier attenuation (simplified Maekawa)
            if max_building > 0:
                # Path difference due to diffraction over building
                delta = max_building - (minaret_height * (1 - dist/(dist+1)))
                if delta > 0:
                    N_fresnel = 2 * delta / wavelength
                    A_barrier = 10 * np.log10(3 + 20 * max(N_fresnel, 0))
                else:
                    A_barrier = 0
            else:
                A_barrier = 0
        else:
            A_barrier = 0

        sound_map[i, j] = source_dB - A_div - A_atm - A_barrier

# Ambient noise
ambient = 40  # dB

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))

# Sound level map
extent = [0, grid_size, 0, grid_size]
c1 = ax1.imshow(sound_map.T, origin='lower', extent=extent, cmap='YlOrRd',
                vmin=20, vmax=80, aspect='equal')
ax1.contour(np.linspace(0, grid_size, nx), np.linspace(0, grid_size, ny),
            sound_map.T, levels=[ambient], colors=['white'], linewidths=2)
ax1.plot(mx*resolution, my*resolution, 'b*', markersize=15)
ax1.set_xlabel('X (m)', fontsize=10)
ax1.set_ylabel('Y (m)', fontsize=10)
ax1.set_title(f'Adhan Sound Level (dB) at {freq} Hz', fontsize=12)
plt.colorbar(c1, ax=ax1, label='dB')

# Coverage analysis: what % of area is above ambient
audible = sound_map > ambient
coverage_pct = np.sum(audible) / audible.size * 100

# Radial average
radii = np.linspace(10, 450, 50)
avg_levels = []
for r in radii:
    mask = np.abs(np.sqrt((np.arange(nx)[:,None]-mx)**2 + (np.arange(ny)[None,:]-my)**2) * resolution - r) < resolution*2
    if np.sum(mask) > 0:
        avg_levels.append(np.mean(sound_map[mask]))
    else:
        avg_levels.append(0)

ax2.plot(radii, avg_levels, color='#3b82f6', linewidth=2.5, label='With buildings')
# Compare to free field
free_field = source_dB - 20*np.log10(radii) - m_air*radii
ax2.plot(radii, free_field, color='#10b981', linewidth=2, linestyle='--', label='Free field')
ax2.axhline(ambient, color='#ef4444', linewidth=1.5, linestyle='--')
ax2.text(50, ambient+2, f'Ambient ({ambient} dB)', color='#ef4444', fontsize=10)
ax2.set_xlabel('Distance from minaret (m)', fontsize=11)
ax2.set_ylabel('Average sound level (dB)', fontsize=11)
ax2.set_title('Radial Average: City vs Free Field', fontsize=12)
ax2.legend(fontsize=10)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print(f"City coverage (>{ambient} dB): {coverage_pct:.1f}% of area")
print(f"White contour = audibility boundary ({ambient} dB)")`,
      challenge: 'Add a second minaret 500m away and calculate the combined coverage. Where do the two minarets create destructive interference? What is the optimal spacing for maximum coverage with minimum overlap?',
      successHint: 'Urban sound propagation modelling is used for airport noise zoning, highway noise barriers, industrial noise assessment, and city planning. The ISO 9613 standard is the foundation, but modern software adds building-specific ray tracing and meteorological effects.',
    },
    {
      title: 'Noise ordinance checker — compliance at property boundaries',
      concept: `Most cities regulate noise levels at property boundaries. A typical ordinance specifies:
- **Daytime limit** (7AM-10PM): 55-65 dB(A)
- **Nighttime limit** (10PM-7AM): 45-55 dB(A)
- **Exemptions** for religious calls (varies by jurisdiction)

The Adhan occurs at times that span both day and night (Fajr at ~4:30 AM, Isha at ~8:30 PM). Compliance requires calculating the A-weighted sound level at the nearest sensitive receiver (apartment, hospital, school).

**A-weighting** adjusts for human hearing sensitivity: we hear mid-frequencies (1-4 kHz) best, so these are weighted more heavily. Low frequencies below 200 Hz are weighted down by 10-20 dB.

The code builds a noise compliance checker that calculates dB(A) at multiple receiver positions for a given speaker configuration and checks against ordinance limits.`,
      analogy: 'Speed limits vary by zone: 30 km/h near schools, 50 km/h in town, 100 km/h on highways. Similarly, noise limits vary by time of day and location. A noise ordinance checker is like a speed camera for sound: it measures the level at the boundary and flags violations. The engineer’s job is to design the system so it never trips the alarm.',
      storyConnection: 'In modern Cairo, Istanbul, and Kuala Lumpur, noise complaints about the Adhan have led to regulated speaker systems. Some mosques now use "smart" systems that automatically adjust volume based on ambient noise level and time of day. Fajr (pre-dawn) uses lower volume than Dhuhr (noon, when traffic is loudest). This is noise engineering meeting religious practice.',
      checkQuestion: 'The Adhan produces 80 dB(A) at 50m from the minaret. The nearest apartment is 100m away. The nighttime limit is 50 dB(A). Does the Fajr Adhan comply?',
      checkAnswer: 'At 100m (double the 50m reference distance), the level drops by 6 dB to 74 dB(A). This is 24 dB above the 50 dB(A) nighttime limit — a significant violation. The mosque needs to either: (1) reduce speaker power by 24 dB for Fajr, (2) use beamforming to create a null at the apartment, or (3) rely on a religious exemption in local law.',
      codeIntro: 'Build a noise compliance checker for a mosque speaker system.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# A-weighting curve (simplified)
def a_weight(freq):
    """A-weighting correction in dB"""
    f2 = freq**2
    ra = (12194**2 * f2**2) / ((f2 + 20.6**2) * np.sqrt((f2 + 107.7**2)*(f2 + 737.9**2)) * (f2 + 12194**2))
    return 20 * np.log10(ra) + 2.0

# Adhan spectrum (typical male voice + room acoustics)
freqs_oct = np.array([63, 125, 250, 500, 1000, 2000, 4000, 8000])
adhan_spectrum = np.array([60, 72, 78, 82, 85, 80, 74, 65])  # dB at 1m

# A-weight the spectrum
a_weights = np.array([a_weight(f) for f in freqs_oct])
adhan_A = adhan_spectrum + a_weights

fig, axes = plt.subplots(2, 2, figsize=(13, 9))

# Spectrum comparison
axes[0,0].bar(np.arange(len(freqs_oct)) - 0.15, adhan_spectrum, width=0.3,
              color='#3b82f6', label='Unweighted (dB)')
axes[0,0].bar(np.arange(len(freqs_oct)) + 0.15, adhan_A, width=0.3,
              color='#ef4444', label='A-weighted (dBA)')
axes[0,0].set_xticks(range(len(freqs_oct)))
axes[0,0].set_xticklabels([str(f) for f in freqs_oct], fontsize=10)
axes[0,0].set_xlabel('Frequency (Hz)', fontsize=10)
axes[0,0].set_ylabel('Level (dB)', fontsize=10)
axes[0,0].set_title('Adhan Spectrum at 1m', fontsize=12)
axes[0,0].legend(fontsize=9)
axes[0,0].grid(alpha=0.3)

# A-weighting curve
f_range = np.logspace(1.3, 4, 500)
aw = np.array([a_weight(f) for f in f_range])
axes[0,1].semilogx(f_range, aw, color='#a855f7', linewidth=2.5)
axes[0,1].set_xlabel('Frequency (Hz)', fontsize=10)
axes[0,1].set_ylabel('A-weighting (dB)', fontsize=10)
axes[0,1].set_title('A-Weighting Curve', fontsize=12)
axes[0,1].grid(alpha=0.3)
axes[0,1].set_ylim(-50, 5)

# Distance-based compliance check
distances = np.linspace(10, 500, 100)
# Overall A-weighted level at 1m (energy sum)
L_total_A_1m = 10 * np.log10(np.sum(10**(adhan_A/10)))

levels_at_dist = L_total_A_1m - 20*np.log10(distances) - 0.005*distances

# Ordinance limits
day_limit = 60
night_limit = 50
fajr_limit = 45  # stricter for pre-dawn

axes[1,0].plot(distances, levels_at_dist, color='#3b82f6', linewidth=2.5, label='Adhan level')
axes[1,0].axhline(day_limit, color='#10b981', linewidth=1.5, linestyle='--', label=f'Day limit ({day_limit} dBA)')
axes[1,0].axhline(night_limit, color='#f59e0b', linewidth=1.5, linestyle='--', label=f'Night limit ({night_limit} dBA)')
axes[1,0].axhline(fajr_limit, color='#ef4444', linewidth=1.5, linestyle='--', label=f'Fajr limit ({fajr_limit} dBA)')

# Find compliance distances
for limit, name, col in [(day_limit, 'Day', '#10b981'), (night_limit, 'Night', '#f59e0b'), (fajr_limit, 'Fajr', '#ef4444')]:
    comply_idx = np.where(levels_at_dist <= limit)[0]
    if len(comply_idx) > 0:
        comply_dist = distances[comply_idx[0]]
        axes[1,0].scatter([comply_dist], [limit], color=col, s=80, zorder=5)
        axes[1,0].annotate(f'{name}: {comply_dist:.0f}m',
                          xy=(comply_dist, limit), xytext=(comply_dist+30, limit+3),
                          fontsize=10, color=col,
                          arrowprops=dict(arrowstyle='->', color=col))

axes[1,0].set_xlabel('Distance from minaret (m)', fontsize=10)
axes[1,0].set_ylabel('Sound level (dBA)', fontsize=10)
axes[1,0].set_title('Compliance Distance Analysis', fontsize=12)
axes[1,0].legend(fontsize=9, loc='upper right')
axes[1,0].grid(alpha=0.3)

# Time-of-day schedule with volume adjustment
prayer_times = ['Fajr\
4:30', 'Dhuhr\
12:30', 'Asr\
15:30', 'Maghrib\
18:30', 'Isha\
20:00']
base_volume = [0.5, 1.0, 0.9, 0.8, 0.7]  # volume multiplier
ambient_noise = [30, 55, 50, 45, 40]  # typical ambient dB

# Smart volume: adjust to be 10 dB above ambient at 200m, max 1.0
smart_volume = []
for amb in ambient_noise:
    target_at_200m = amb + 10
    needed_source = target_at_200m + 20*np.log10(200) + 0.005*200
    vol = min(1.0, 10**((needed_source - L_total_A_1m)/20))
    smart_volume.append(vol)

x_pos = np.arange(len(prayer_times))
axes[1,1].bar(x_pos - 0.15, base_volume, width=0.3, color='#ef4444', label='Fixed volume')
axes[1,1].bar(x_pos + 0.15, smart_volume, width=0.3, color='#10b981', label='Smart volume')
axes[1,1].set_xticks(x_pos)
axes[1,1].set_xticklabels(prayer_times, fontsize=10)
axes[1,1].set_ylabel('Volume (fraction of max)', fontsize=10)
axes[1,1].set_title('Smart Volume: Adapt to Ambient Noise', fontsize=12)
axes[1,1].legend(fontsize=10)
axes[1,1].grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("=== Compliance Summary ===")
for limit, name in [(day_limit, 'Daytime'), (night_limit, 'Nighttime'), (fajr_limit, 'Pre-dawn')]:
    comply_idx = np.where(levels_at_dist <= limit)[0]
    d = distances[comply_idx[0]] if len(comply_idx) > 0 else float('inf')
    print(f"  {name:12s} ({limit} dBA): compliant at >{d:.0f}m")`,
      challenge: 'Add a beamforming factor: the array can reduce sound by 15 dB in one specific direction. If the nearest apartment is at 120m in that direction, does the system comply with the Fajr limit without reducing overall coverage?',
      successHint: 'Noise compliance is a critical skill for acoustic engineers. Every construction project, industrial facility, and entertainment venue requires a noise assessment. The same methods apply to airport noise contours, highway noise barriers, and wind turbine noise.',
    },
    {
      title: 'Capstone — designing a complete city acoustic plan',
      concept: `This capstone integrates everything: the inverse square law (Level 1), dome acoustics and crossover design (Level 2), ray tracing and impulse response (Level 3), and beamforming, urban propagation, and noise compliance (Level 4) into a single city acoustic design.

You will design the sound system for a new mosque in a dense urban neighbourhood:
- Interior: optimise dome shape and materials for RT60 = 1.2s
- Exterior: design a speaker array for the minaret (30m) with beamforming
- Compliance: meet daytime (60 dBA) and nighttime (50 dBA) limits at all property boundaries
- Coverage: ensure the Adhan is audible to 80% of the neighbourhood

**Level 1**: You learned WHY minarets are tall and how sound fades with distance.
**Level 2**: You learned HOW domes focus sound and speakers split frequencies.
**Level 3**: You learned to SIMULATE acoustics with ray tracing and impulse responses.
**Level 4**: You learned to DESIGN complete systems with beamforming and compliance.

This is the journey from understanding to engineering — from the Muezzin’s voice to a city-scale acoustic design.`,
      analogy: 'An architect designs a building by integrating structural engineering, plumbing, electrical, and aesthetics into one coherent plan. An acoustic engineer does the same for sound: interior treatment, speaker design, noise control, and coverage planning must all work together. This capstone is your architectural plan for sound.',
      storyConnection: 'When Saudi Arabia builds new mosques (hundreds per year), each requires a complete acoustic design package: interior analysis (Sabine/Eyring), speaker selection, minaret height recommendation, noise impact assessment, and a smart volume control scheme. The process you have learned across four levels mirrors the actual professional workflow.',
      checkQuestion: 'If budget allows only ONE of these improvements, which gives the most benefit: (a) increasing minaret height from 30m to 50m, (b) adding beamforming to the speaker array, or (c) adding acoustic treatment to the dome interior?',
      checkAnswer: 'It depends on the primary problem. If coverage is insufficient: (a) height gives ~6 dB more range. If noise complaints are the issue: (b) beamforming can reduce levels by 15 dB in specific directions. If the imam cannot be heard clearly inside: (c) dome treatment improves speech intelligibility. A good engineer identifies the bottleneck before recommending a solution. Often (b) gives the most "bang for the buck" because it solves both coverage AND compliance simultaneously.',
      codeIntro: 'Build a complete mosque acoustic design dashboard.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === DESIGN PARAMETERS ===
# Interior
dome_volume = 8000   # m^3
dome_surface = 2800  # m^2
target_rt60 = 1.2    # seconds

# Exterior
minaret_height = 30  # metres
n_speakers = 8
speaker_spacing = 0.2  # metres
source_dB = 95       # dBA at 1m per speaker
steer_angle = 0      # degrees (horizontal)

# Compliance
day_limit = 60       # dBA
night_limit = 50     # dBA
nearest_building = 80  # metres

# Coverage
target_coverage = 0.80  # 80% of 500m radius
ambient_day = 50
ambient_night = 35

# === CALCULATIONS ===
fig, axes = plt.subplots(2, 3, figsize=(16, 10))

# 1. Interior RT60 design
alpha_values = np.linspace(0.05, 0.6, 100)
rt60_values = 0.161 * dome_volume / (-dome_surface * np.log(1 - alpha_values))

axes[0,0].plot(alpha_values, rt60_values, color='#3b82f6', linewidth=2.5)
axes[0,0].axhline(target_rt60, color='#10b981', linewidth=2, linestyle='--')

# Find required alpha
required_alpha = 1 - np.exp(-0.161 * dome_volume / (dome_surface * target_rt60))
axes[0,0].scatter([required_alpha], [target_rt60], color='#ef4444', s=100, zorder=5)
axes[0,0].annotate(f'α = {required_alpha:.2f}', xy=(required_alpha, target_rt60),
                  xytext=(required_alpha + 0.05, target_rt60 + 0.5),
                  fontsize=11, color='#ef4444',
                  arrowprops=dict(arrowstyle='->', color='#ef4444'))
axes[0,0].set_xlabel('Avg absorption coefficient', fontsize=10)
axes[0,0].set_ylabel('RT60 (seconds)', fontsize=10)
axes[0,0].set_title('Interior: RT60 Design', fontsize=12)
axes[0,0].grid(alpha=0.3)

# 2. Speaker array pattern
theta = np.linspace(-90, 90, 500)
theta_rad = np.radians(theta)
freq = 1000
k = 2 * np.pi * freq / 343
steer_rad = np.radians(steer_angle)

AF = np.zeros_like(theta, dtype=complex)
for n in range(n_speakers):
    phase = k * n * speaker_spacing * (np.sin(theta_rad) - np.sin(steer_rad))
    AF += np.exp(1j * phase)
AF_dB = 20 * np.log10(np.abs(AF) / n_speakers + 1e-10)

axes[0,1].plot(theta, AF_dB, color='#a855f7', linewidth=2)
axes[0,1].set_xlabel('Angle (°)', fontsize=10)
axes[0,1].set_ylabel('Gain (dB)', fontsize=10)
axes[0,1].set_title(f'Speaker Array ({n_speakers} elements)', fontsize=12)
axes[0,1].set_ylim(-25, 3)
axes[0,1].grid(alpha=0.3)

# 3. Distance attenuation
distances = np.linspace(1, 500, 200)
total_source = source_dB + 10*np.log10(n_speakers)
levels = total_source - 20*np.log10(distances) - 0.005*distances

axes[0,2].plot(distances, levels, color='#3b82f6', linewidth=2.5)
axes[0,2].axhline(day_limit, color='#10b981', linewidth=1.5, linestyle='--', label=f'Day: {day_limit} dBA')
axes[0,2].axhline(night_limit, color='#f59e0b', linewidth=1.5, linestyle='--', label=f'Night: {night_limit} dBA')
axes[0,2].axhline(ambient_night, color='#ef4444', linewidth=1, linestyle=':', alpha=0.5)
axes[0,2].axvline(nearest_building, color='white', linewidth=1, linestyle=':', alpha=0.3)
axes[0,2].text(nearest_building + 5, 85, 'Nearest\
building', color='white', fontsize=10)
axes[0,2].set_xlabel('Distance (m)', fontsize=10)
axes[0,2].set_ylabel('Level (dBA)', fontsize=10)
axes[0,2].set_title('Compliance Check', fontsize=12)
axes[0,2].legend(fontsize=9)
axes[0,2].grid(alpha=0.3)

# 4. Coverage map (simplified 2D)
grid_res = 10
grid_n = 100
x = np.linspace(-500, 500, grid_n)
y = np.linspace(-500, 500, grid_n)
X, Y = np.meshgrid(x, y)
D = np.sqrt(X**2 + Y**2)
D = np.maximum(D, 1)
coverage_map = total_source - 20*np.log10(D) - 0.005*D

c4 = axes[1,0].contourf(X, Y, coverage_map, levels=np.arange(20, 90, 5), cmap='YlOrRd')
axes[1,0].contour(X, Y, coverage_map, levels=[ambient_day], colors=['white'], linewidths=2)
axes[1,0].plot(0, 0, 'b*', markersize=15)
circle = plt.Circle((0, 0), nearest_building, fill=False, color='#ef4444', linewidth=2, linestyle='--')
axes[1,0].add_patch(circle)
axes[1,0].set_xlabel('X (m)', fontsize=10)
axes[1,0].set_ylabel('Y (m)', fontsize=10)
axes[1,0].set_title('Coverage Map (dBA)', fontsize=12)
axes[1,0].set_aspect('equal')
plt.colorbar(c4, ax=axes[1,0])

# 5. Coverage percentage vs distance
radii = np.linspace(50, 500, 50)
audible_pct = []
for r in radii:
    level = total_source - 20*np.log10(r) - 0.005*r
    audible_pct.append(100 if level > ambient_day else 0)

# Simplified: area within audibility radius
aud_radius_day = 10**((total_source - ambient_day) / 20)
aud_radius_night = 10**((total_source - ambient_night) / 20)
target_radius = 500
cov_day = min(100, (aud_radius_day / target_radius)**2 * 100)
cov_night = min(100, (aud_radius_night / target_radius)**2 * 100)

bars = axes[1,1].bar(['Day', 'Night'], [cov_day, cov_night],
                     color=['#10b981', '#3b82f6'], width=0.5, edgecolor='none')
axes[1,1].axhline(target_coverage * 100, color='#f59e0b', linewidth=2, linestyle='--',
                  label=f'Target ({target_coverage*100:.0f}%)')
for bar, pct in zip(bars, [cov_day, cov_night]):
    axes[1,1].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2,
                   f'{pct:.0f}%', ha='center', fontsize=14, color='white', fontweight='bold')
axes[1,1].set_ylabel('Coverage (%)', fontsize=10)
axes[1,1].set_title('Coverage of 500m Radius', fontsize=12)
axes[1,1].legend(fontsize=10)
axes[1,1].grid(alpha=0.3)

# 6. Design scorecard
categories = ['Interior\
RT60', 'Day\
compliance', 'Night\
compliance', 'Day\
coverage', 'Night\
coverage']
# Calculate scores (0-100)
level_at_boundary = total_source - 20*np.log10(nearest_building) - 0.005*nearest_building
scores = [
    100 if abs(0.161*dome_volume/(-dome_surface*np.log(1-required_alpha)) - target_rt60) < 0.1 else 50,
    100 if level_at_boundary < day_limit else max(0, 100 - (level_at_boundary - day_limit)*10),
    100 if level_at_boundary < night_limit else max(0, 100 - (level_at_boundary - night_limit)*10),
    min(100, cov_day / (target_coverage*100) * 100),
    min(100, cov_night / (target_coverage*100) * 100),
]

colors = ['#10b981' if s >= 80 else '#f59e0b' if s >= 50 else '#ef4444' for s in scores]
axes[1,2].barh(categories, scores, color=colors, height=0.5, edgecolor='none')
axes[1,2].set_xlim(0, 110)
axes[1,2].axvline(80, color='white', linewidth=1, linestyle=':', alpha=0.3)
for i, s in enumerate(scores):
    axes[1,2].text(s + 2, i, f'{s:.0f}', fontsize=12, color='white', va='center')
axes[1,2].set_xlabel('Score (0-100)', fontsize=10)
axes[1,2].set_title('Design Scorecard', fontsize=12)
axes[1,2].grid(axis='x', alpha=0.3)

plt.tight_layout()
plt.show()

print("=== MOSQUE ACOUSTIC DESIGN REPORT ===")
print(f"Interior: α_avg = {required_alpha:.2f} for RT60 = {target_rt60}s")
print(f"Array: {n_speakers} speakers, {total_source:.0f} dBA combined at 1m")
print(f"At boundary ({nearest_building}m): {level_at_boundary:.1f} dBA")
print(f"Day compliance: {'PASS' if level_at_boundary < day_limit else 'FAIL'}")
print(f"Night compliance: {'PASS' if level_at_boundary < night_limit else 'FAIL - reduce by ' + str(int(level_at_boundary - night_limit)) + ' dB'}")
print(f"Overall score: {np.mean(scores):.0f}/100")`,
      challenge: 'Modify the design to achieve 100% on all five scorecard metrics. You can adjust: minaret height, number of speakers, absorption coefficient, and add beamforming null directions. What is the minimum-cost design that passes everything?',
      successHint: 'You have completed a full journey through architectural acoustics. From the Muezzin’s voice to a city-scale acoustic plan, you now have the foundational knowledge used by acoustic consultants, speaker engineers, and architects worldwide. The minaret was your classroom — the equations are your tools for any space where sound matters.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Researcher
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone acoustic design and city-scale modelling</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises involve advanced acoustic simulations and system design. Click to start Python.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
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
            diagram={[MuezzinCityPropagationDiagram, MuezzinDomeAcousticsDiagram, MuezzinSpeakerDiagram, MuezzinInverseSquareDiagram, InterferenceDiagram, ActivitySoundDistanceDiagram][i] ? createElement([MuezzinCityPropagationDiagram, MuezzinDomeAcousticsDiagram, MuezzinSpeakerDiagram, MuezzinInverseSquareDiagram, InterferenceDiagram, ActivitySoundDistanceDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
