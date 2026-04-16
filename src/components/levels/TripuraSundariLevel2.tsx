import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TripuraSundariLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Visualising fold geometry',
      concept: `Anticlines and synclines can be modelled as sinusoidal surfaces with multiple layers at different depths. Each layer follows the same fold shape but at a different base depth.

A folded layer: \`z(x) = z₀ + A × sin(2πx/λ) × exp(-z₀/D)\`

where z₀ is the unfolded depth, A is amplitude, λ is wavelength, and D is a decay factor (deeper layers fold less).

📚 *We will use numpy and matplotlib to create cross-sectional visualisations of Tripura's folded geological structure.*`,
      analogy: 'Stack sheets of coloured paper and push the ends together. Each sheet folds, but the bottom sheets fold slightly less than the top ones. Plotting this side-on shows the beautiful layered structure of folded rock.',
      storyConnection: 'The cross-section beneath Tripura Sundari Temple looks exactly like our model — layers of sandstone and shale folded into anticlines. The temple sits at the crest where the oldest layers are closest to the surface.',
      checkQuestion: 'If fold amplitude decreases with depth, which layers show the most dramatic folding?',
      checkAnswer: 'The shallowest layers. This is because deep layers are more rigid (higher confining pressure) and fold less. Surface layers are more free to deform. This is called "amplitude decay with depth."',
      codeIntro: 'Create a geological cross-section showing folded layers beneath Tripura Sundari Temple.',
      code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 60, 500)  # km
wavelength = 12  # km
amplitude = 0.3  # km

layers = [
    ('Topsoil/Laterite', 0.003, '#8B4513'),
    ('Dupitila Sandstone', 0.05, '#DAA520'),
    ('Tipam Sandstone', 0.13, '#CD853F'),
    ('Bhuban Shale', 0.33, '#696969'),
    ('Barail Group', 0.83, '#A0522D'),
    ('Disang Formation', 1.83, '#4A4A4A'),
    ('Basement', 3.0, '#2F2F2F'),
]

fig, ax = plt.subplots(figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')
ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

# Draw folded layers
for i in range(len(layers) - 1):
    name, depth, color = layers[i]
    _, depth_next, _ = layers[i + 1]

    # Fold amplitude decreases with depth
    fold_factor = np.exp(-depth / 2)
    z_top = -depth + amplitude * fold_factor * np.sin(2 * np.pi * x / wavelength)
    z_bot = -depth_next + amplitude * np.exp(-depth_next / 2) * np.sin(2 * np.pi * x / wavelength)

    ax.fill_between(x, z_top, z_bot, color=color, alpha=0.8, label=name)

# Surface line
z_surface = amplitude * np.sin(2 * np.pi * x / wavelength) * 0.3
ax.plot(x, z_surface, color='#34d399', linewidth=2)

# Mark temple location (anticline crest)
temple_x = wavelength / 4  # first anticline crest
ax.plot(temple_x, z_surface[int(temple_x / 60 * 500)] + 0.05, '^',
        color='#ef4444', markersize=15, zorder=5)
ax.annotate('Tripura Sundari\
Temple', xy=(temple_x, 0.15),
            color='#ef4444', fontsize=10, ha='center', fontweight='bold')

# Labels
ax.set_xlabel('Distance (km)', color='white', fontsize=12)
ax.set_ylabel('Depth (km)', color='white', fontsize=12)
ax.set_title('Geological Cross-Section  -  Tripura Fold Belt', color='white', fontsize=14)
ax.legend(facecolor='#374151', labelcolor='white', fontsize=8, loc='lower right')
ax.set_ylim(-3, 0.5)

# Annotate anticline/syncline
for i in range(5):
    cx = (i * wavelength / 2 + wavelength / 4)
    if cx < 60:
        if i % 2 == 0:
            ax.annotate('Anticline', xy=(cx, 0.35), color='#9ca3af',
                        fontsize=8, ha='center')
        else:
            ax.annotate('Syncline', xy=(cx, 0.35), color='#9ca3af',
                        fontsize=8, ha='center')

plt.tight_layout()
plt.savefig('cross_section.png', dpi=100, facecolor='#1f2937')
plt.show()
print("The temple sits on an anticline crest where hard Tipam Sandstone")
print("is closest to the surface  -  providing a stable foundation.")`,
      challenge: 'Add fault lines (vertical offsets) at two locations where layers are displaced. Faults are common in fold belts like Tripura\'s.',
      successHint: 'Geological cross-sections are the primary tool for understanding subsurface structure. This same technique guides oil exploration, water wells, and earthquake hazard assessment.',
    },
    {
      title: 'India\'s journey — plotting continental drift',
      concept: `We can plot India's position over time on a latitude-time diagram, showing its journey from Gondwana to its current position.

The speed is not constant:
- **Pre-collision** (>50 Mya): ~15 cm/year (fast, driven by mantle plume)
- **Collision phase** (50-30 Mya): decelerating as resistance builds
- **Post-collision** (<30 Mya): ~5 cm/year (slow, pushing into Eurasia)

📚 *We will plot India's latitude vs time and overlay key geological events.*`,
      analogy: 'India\'s journey north is like a car approaching a wall — it starts fast, then slows as it makes contact, but keeps pushing. The "crumple zone" is the Himalayas and the folded hills of Northeast India.',
      storyConnection: 'Every feature of Tripura\'s landscape — the hills, the rock types, the earthquake risk — is a consequence of India\'s northward journey. The Tripura Sundari Temple exists because India moved.',
      checkQuestion: 'Why did India slow down when it hit Eurasia?',
      checkAnswer: 'The collision created friction and resistance. Pushing one continent into another requires enormous force. The driving force (mantle convection) remained roughly constant, but the resisting force (continental collision) increased dramatically, so the net speed dropped.',
      codeIntro: 'Plot India\'s continental drift journey with geological events.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# India's position over time
times = np.array([130, 120, 110, 100, 90, 80, 70, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0])
latitudes = np.array([-35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 13, 16, 18, 20, 21, 22, 22.5, 23, 23.5, 23.8])

# Speed calculation
speeds = []
for i in range(1, len(times)):
    dt = times[i-1] - times[i]  # Mya (positive backward)
    dlat = latitudes[i] - latitudes[i-1]
    dist_km = dlat * 111
    speed = dist_km * 100000 / (dt * 1e6)  # cm/year
    speeds.append(speed)
speeds = np.array(speeds)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

# Latitude vs time
ax1.plot(times, latitudes, 'o-', color='#f59e0b', linewidth=2.5, markersize=6)
ax1.axhline(y=0, color='#9ca3af', linestyle=':', alpha=0.3, label='Equator')
ax1.axhline(y=23.8, color='#34d399', linestyle='--', alpha=0.5, label='Tripura today')
ax1.axvline(x=50, color='#ef4444', linestyle='--', alpha=0.5, label='Collision (~50 Mya)')

# Key events
events = [(130, -35, 'Gondwana'), (70, -10, 'Crossing equator'),
          (50, 10, 'COLLISION'), (20, 22, 'Tripura hills form'), (0, 23.8, 'Today')]
for t, lat, label in events:
    ax1.annotate(label, xy=(t, lat), xytext=(t + 5, lat + 3),
                 color='white', fontsize=8, arrowprops=dict(arrowstyle='->', color='white'))

ax1.set_ylabel('Latitude (°N)', color='white', fontsize=12)
ax1.set_title("India's Northward Journey", color='white', fontsize=14)
ax1.legend(facecolor='#374151', labelcolor='white', fontsize=8)
ax1.invert_xaxis()

# Speed vs time
ax2.bar(times[1:] - 2.5, speeds, width=5, color='#60a5fa', alpha=0.8, edgecolor='white', linewidth=0.5)
ax2.axhline(y=5, color='#34d399', linestyle='--', alpha=0.5, label='Current speed')
ax2.set_xlabel('Time (Mya)', color='white', fontsize=12)
ax2.set_ylabel('Speed (cm/year)', color='white', fontsize=12)
ax2.set_title("India's Speed Over Time", color='white', fontsize=12)
ax2.legend(facecolor='#374151', labelcolor='white', fontsize=8)
ax2.invert_xaxis()

plt.tight_layout()
plt.savefig('drift.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Pre-collision speed: ~{speeds[:8].mean():.0f} cm/year")
print(f"Post-collision speed: ~{speeds[10:].mean():.0f} cm/year")
print(f"Speed reduction: {(1 - speeds[10:].mean()/speeds[:8].mean())*100:.0f}%")`,
      challenge: 'Add Australia and Africa to the plot (they also moved from Gondwana). Who moved fastest and why?',
      successHint: 'India\'s journey north is one of the most dramatic events in geological history. The speed, the collision, and the consequences are all captured in this plot — and all visible in the landscape of Tripura.',
    },
    {
      title: 'Seismic hazard mapping',
      concept: `**Seismic hazard maps** show the expected ground shaking intensity across a region. They combine:

1. **Earthquake source zones**: where earthquakes are likely
2. **Magnitude-frequency relationship**: how often each size occurs
3. **Attenuation**: how shaking decreases with distance
4. **Site effects**: soft soil amplifies shaking

The **Gutenberg-Richter law**: \`log₁₀(N) = a - bM\`
where N is the number of earthquakes per year with magnitude ≥ M.

For Northeast India: a ≈ 5.5, b ≈ 0.9
This means: ~3,000 M≥3 per year, ~10 M≥5 per year, ~0.03 M≥7 per year (one every 30 years).

📚 *We will build a seismic hazard model and create a hazard map for the Tripura region.*`,
      analogy: 'A seismic hazard map is like a weather forecast for earthquakes — it does not tell you when the next earthquake will happen, but it tells you how strong the shaking is likely to be over the next 50 years. The temple area is in a "severe thunderstorm zone" for earthquakes.',
      storyConnection: 'Tripura Sundari Temple is in Seismic Zone V — the highest hazard category in India. The hazard map tells us that the temple faces a real risk of strong shaking, and helps engineers design appropriate protection measures.',
      checkQuestion: 'If b = 0.9, how many times more common are M5 earthquakes compared to M6?',
      checkAnswer: 'Using Gutenberg-Richter: N(M5)/N(M6) = 10^(b × 1) = 10^0.9 ≈ 7.9. There are about 8 times as many M5 earthquakes as M6. Each magnitude step reduces frequency by a factor of ~8.',
      codeIntro: 'Build a seismic hazard model for the Tripura Sundari Temple region.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Gutenberg-Richter parameters for NE India
a, b = 5.5, 0.9

magnitudes = np.arange(3, 9, 0.1)
log_N = a - b * magnitudes
N_per_year = 10**log_N

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

# Frequency-magnitude plot
ax1.semilogy(magnitudes, N_per_year, color='#f87171', linewidth=2.5)
ax1.set_xlabel('Magnitude', color='white', fontsize=12)
ax1.set_ylabel('Earthquakes per year (≥M)', color='white', fontsize=12)
ax1.set_title('Gutenberg-Richter Law  -  NE India', color='white', fontsize=13)
ax1.axhline(y=1, color='#9ca3af', linestyle=':', alpha=0.5, label='1 per year')
ax1.axhline(y=1/50, color='#f59e0b', linestyle=':', alpha=0.5, label='1 per 50 years')

# Mark key magnitudes
for M in [5, 6, 7, 8]:
    N = 10**(a - b*M)
    ax1.plot(M, N, 'o', color='white', markersize=8, zorder=5)
    if N >= 1:
        ax1.annotate(f'M{M}: {N:.0f}/yr', xy=(M, N*1.5), color='white', fontsize=8)
    else:
        ax1.annotate(f'M{M}: 1/{1/N:.0f}yr', xy=(M, N*1.5), color='white', fontsize=8)
ax1.legend(facecolor='#374151', labelcolor='white')

# Simple hazard map (2D grid)
nx, ny = 30, 30
x_km = np.linspace(0, 150, nx)
y_km = np.linspace(0, 150, ny)
X, Y = np.meshgrid(x_km, y_km)

# Earthquake sources (fault lines)
sources = [(50, 75, 7.5), (100, 50, 7.0), (75, 120, 6.5)]

# PGA (peak ground acceleration) from all sources
pga = np.zeros_like(X)
for sx, sy, mag in sources:
    dist = np.sqrt((X - sx)**2 + (Y - sy)**2) + 10  # min 10 km
    # Attenuation: PGA = 10^(0.5*M - 1.5*log10(dist) - 0.5)
    pga += 10**(0.5*mag - 1.5*np.log10(dist) - 0.5)

# Plot
im = ax2.pcolormesh(X, Y, pga, cmap='YlOrRd', shading='auto')
ax2.set_xlabel('East-West (km)', color='white', fontsize=11)
ax2.set_ylabel('North-South (km)', color='white', fontsize=11)
ax2.set_title('Seismic Hazard Map (PGA)', color='white', fontsize=13)
plt.colorbar(im, ax=ax2, label='Peak Ground Acceleration (g)')

# Mark sources and temple
for sx, sy, mag in sources:
    ax2.plot(sx, sy, '*', color='white', markersize=12)
ax2.plot(75, 75, '^', color='#34d399', markersize=15, zorder=5)
ax2.annotate('Temple', xy=(77, 77), color='#34d399', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.savefig('hazard.png', dpi=100, facecolor='#1f2937')
plt.show()

# Return period analysis
print("EARTHQUAKE RETURN PERIODS  -  Tripura Region")
print("=" * 45)
for M in range(4, 9):
    N = 10**(a - b*M)
    if N >= 1:
        print(f"  M≥{M}: {N:.1f} per year ({365/N:.0f} days between events)")
    else:
        print(f"  M≥{M}: one every {1/N:.0f} years")`,
      challenge: 'Add soil amplification: soft alluvial soil (in valleys/synclines) amplifies shaking by 2-3x compared to hard rock (on anticlines/hills). Update the hazard map to include this effect.',
      successHint: 'Seismic hazard maps guide building codes, emergency planning, and heritage conservation. For Tripura Sundari Temple, they quantify the earthquake risk and inform protective measures.',
    },
    {
      title: 'Erosion rates from river profiles',
      concept: `Rivers cutting through folded terrain reveal erosion rates. A river's **longitudinal profile** (elevation vs distance) is shaped by:

- **Uplift**: raises the riverbed
- **Erosion**: lowers the riverbed
- **Stream power**: proportional to slope × discharge

Steeper segments indicate either harder rock (resists erosion) or recent uplift (river hasn't caught up). Gentler segments indicate softer rock or long-term equilibrium.

**Hack's law** relates stream length to basin area: \`L = c × A^h\`

The **steepness index** of a river segment: \`k_s = S × A^θ\`
where S is slope, A is drainage area, and θ is a concavity parameter.

📚 *We will model river profiles across Tripura's fold belt and estimate erosion rates from profile shape.*`,
      analogy: 'A river is like a saw cutting through rock. Harder rock makes the saw go slower (steeper profile). Softer rock cuts easily (gentler profile). The profile shape is a record of the rock types the river has encountered.',
      storyConnection: 'The rivers near Tripura Sundari Temple cut through the same folded layers we studied. Where rivers cross hard sandstone anticlines, they form narrow gorges. Where they flow through soft shale synclines, they meander across wide valleys.',
      checkQuestion: 'If a river segment has a steepness index twice the regional average, what might this indicate?',
      checkAnswer: 'Either the rock is unusually hard (resisting erosion) or the area has experienced recent uplift (the river is steepening to erode faster and restore equilibrium). Both create locally steep river profiles.',
      codeIntro: 'Model river profiles across Tripura\'s fold belt and estimate erosion rates.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Model a river crossing multiple anticlines
distance = np.linspace(0, 60, 500)  # km

# Bedrock geology (fold pattern)
wavelength = 12
fold_elev = 0.3 * np.sin(2 * np.pi * distance / wavelength)  # km

# Rock hardness varies with fold (hard sandstone at crests, soft shale in troughs)
hardness = 1 + 0.5 * np.sin(2 * np.pi * distance / wavelength)

# Equilibrium river profile: elevation decreases downstream
# Modified by rock hardness
base_profile = 0.5 * (1 - distance / 60)**1.5  # concave-up profile in km
river_elevation = base_profile + 0.05 * hardness * np.sin(2 * np.pi * distance / wavelength)

# Slope (steepness)
slope = -np.gradient(river_elevation, distance) * 1000  # m/km

# Erosion rate estimate (proportional to slope / hardness)
erosion_rate = slope / hardness * 0.1  # mm/year (simplified)

fig, axes = plt.subplots(3, 1, figsize=(11, 9), sharex=True)
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

# Elevation profile
axes[0].fill_between(distance, fold_elev * 1000, -200, color='#8B4513', alpha=0.3, label='Bedrock')
axes[0].plot(distance, river_elevation * 1000, color='#3b82f6', linewidth=2.5, label='River')
axes[0].set_ylabel('Elevation (m)', color='white', fontsize=11)
axes[0].set_title('River Profile Across Tripura Fold Belt', color='white', fontsize=13)
axes[0].legend(facecolor='#374151', labelcolor='white')

# Mark anticlines and synclines
for i in range(5):
    x_crest = wavelength / 4 + i * wavelength / 2
    if x_crest < 60:
        label = 'A' if i % 2 == 0 else 'S'
        axes[0].annotate(label, xy=(x_crest, fold_elev[int(x_crest/60*500)] * 1000 + 50),
                         color='#f59e0b', fontsize=10, ha='center', fontweight='bold')

# Temple marker
axes[0].plot(3, river_elevation[25] * 1000 + 80, '^', color='#ef4444', markersize=12)
axes[0].annotate('Temple', xy=(4, river_elevation[25] * 1000 + 100), color='#ef4444', fontsize=9)

# Slope
axes[1].plot(distance, slope, color='#f59e0b', linewidth=2)
axes[1].fill_between(distance, 0, slope, alpha=0.15, color='#f59e0b')
axes[1].set_ylabel('Slope (m/km)', color='white', fontsize=11)
axes[1].set_title('River Steepness', color='white', fontsize=12)

# Erosion rate
axes[2].plot(distance, erosion_rate, color='#34d399', linewidth=2)
axes[2].fill_between(distance, 0, erosion_rate, alpha=0.15, color='#34d399')
axes[2].set_xlabel('Distance downstream (km)', color='white', fontsize=11)
axes[2].set_ylabel('Erosion rate (mm/yr)', color='white', fontsize=11)
axes[2].set_title('Estimated Erosion Rate', color='white', fontsize=12)

plt.tight_layout()
plt.savefig('river_profile.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Average slope: {np.mean(slope):.1f} m/km")
print(f"Max slope: {np.max(slope):.1f} m/km (at anticline crossings)")
print(f"Average erosion rate: {np.mean(erosion_rate):.2f} mm/yr")`,
      challenge: 'Add a "knickpoint" (sudden steepening) where the river crosses a particularly hard anticline. How does the knickpoint migrate upstream over time?',
      successHint: 'River profiles are powerful tools for understanding landscape evolution. The steepness of a river at any point encodes information about the rocks below and the tectonic forces above.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Visualising Geological Processes</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
