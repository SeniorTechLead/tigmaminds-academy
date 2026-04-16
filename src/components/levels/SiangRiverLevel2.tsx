import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SiangRiverLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    { title: 'Erosion rate calculations — quantifying landscape change', concept: `Geomorphologists measure erosion rates using cosmogenic nuclide dating (10Be, 26Al from cosmic rays hitting rock), sediment gauging (measuring river sediment flux), and thermochronology (tracking when minerals cooled as they were brought to the surface).\n\nThe Siang basin shows erosion rates of 2-5 mm/yr in the gorge section — among the highest on Earth. The **denudation rate** formula: E = Qs / (rho * A), where Qs = sediment flux (kg/yr), rho = rock density (2700 kg/m3), A = basin area (m2).\n\nA key finding is the "Sadler effect": apparent erosion rates decrease with measurement timescale. Sediment gauging (decades) gives lower rates than cosmogenic nuclides (millennia) because rare catastrophic events (landslides, outburst floods) are missed by short-term measurements.`, analogy: 'Erosion rate measurement is like tracking weight loss. Weighing yourself daily (sediment gauging) misses water weight fluctuations. Weighing monthly (cosmogenic nuclides) captures the real trend. Each timescale tells a different part of the story.', storyConnection: 'The Siang erodes at 2-5 mm/yr. In the story, the river "carved through mountains" — cosmogenic data confirms this as literally true at one of the fastest rates measured anywhere on Earth.', checkQuestion: 'Why do long-term erosion rates tend to be higher than short-term ones?', checkAnswer: 'Rare catastrophic events (mega-landslides, glacial lake outburst floods) move enormous sediment volumes but happen once in thousands of years. Short-term measurements miss these events. Long-term methods average over many such events, giving higher rates.', codeIntro: 'Calculate erosion rates and compare measurement methods.', code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

rivers = ['Siang
(gorge)', 'Ganges', 'Amazon', 'Mississippi', 'Rhine', 'Nile']
rates = [3.5, 0.8, 0.07, 0.05, 0.04, 0.02]
colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#6b7280']

ax1.set_facecolor('#111827')
bars = ax1.barh(rivers, rates, color=colors, height=0.6)
ax1.set_xlabel('Erosion rate (mm/year)', color='white')
ax1.set_title('Basin Erosion Rates', color='white', fontsize=12)
ax1.tick_params(colors='gray')
for bar, val in zip(bars, rates):
    ax1.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height()/2,
             f'{val}', va='center', color='white', fontsize=9)

ax2.set_facecolor('#111827')
timescales = np.logspace(0, 7, 50)
E0 = 5
apparent_rate = E0 * timescales**(-0.15)
ax2.loglog(timescales, apparent_rate, color='#f59e0b', linewidth=2)
ax2.fill_between(timescales, apparent_rate * 0.5, apparent_rate * 2, alpha=0.15, color='#f59e0b')

methods = [(1, 'Sediment
gauging', '#3b82f6'), (10000, 'Cosmogenic', '#f59e0b'), (1e6, 'Thermo-
chronology', '#ef4444')]
for ts, label, color in methods:
    rate = E0 * ts**(-0.15)
    ax2.plot(ts, rate, 'o', color=color, markersize=12)
    ax2.annotate(label, (ts, rate), xytext=(10, 10), textcoords='offset points', color=color, fontsize=8)

ax2.set_xlabel('Measurement timescale (years)', color='white')
ax2.set_ylabel('Apparent rate (mm/yr)', color='white')
ax2.set_title('Sadler Effect', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Siang gorge erosion: ~3.5 mm/yr")
print("This is 50x the global average (0.07 mm/yr)")`, challenge: 'Calculate denudation rate from: sediment flux 200 Mt/yr, basin area 20,000 km2, rock density 2,700 kg/m3.', successHint: 'Erosion rate measurement is where geomorphology becomes quantitative. Understanding timescale dependence is key to interpreting any erosion study.' },
    { title: 'Stream grading and base level — the river\'s equilibrium', concept: `A **graded river** has a slope adjusted to transport exactly the sediment supplied — dynamic equilibrium. **Base level** is the lowest point a river can erode to (sea level for coastal rivers).\n\nThe graded profile is concave-up, evolving through erosion where too steep and deposition where too gentle. Base level changes drive landscape response: sea level drop triggers incision waves (knickpoints) retreating upstream, creating river terraces.\n\nThe Siang gorge is NOT graded — tectonic uplift steepens the profile faster than erosion smooths it.`, analogy: 'A graded river is like a balanced bank account: income (sediment supply) equals spending (transport). The river adjusts its slope until the account balances.', storyConnection: 'The Siang gorge represents a river fighting to maintain grade against active mountain building — one of the most dramatic disequilibria on Earth.', checkQuestion: 'If sea level drops 100m during an ice age, what happens downstream?', checkAnswer: 'An incision wave propagates upstream from the coast. The river cuts down to the new base level, leaving former floodplains as elevated terraces. Multiple ice ages create terrace staircases.', codeIntro: 'Model graded profile evolution and base level response.', code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

distance = np.linspace(0, 500, 200)
initial = 3000 - 6 * distance
initial = np.maximum(initial, 0)
graded = 3000 * np.exp(-distance / 150)

ax1.set_facecolor('#111827')
for t, alpha_val in zip([0, 0.2, 0.5, 0.8, 1.0], [0.3, 0.4, 0.6, 0.8, 1.0]):
    profile = (1 - t) * initial + t * graded
    color = plt.cm.YlOrRd(t * 0.8 + 0.1)
    label = 'Initial' if t == 0 else ('Graded' if t == 1 else f't={t}')
    ax1.plot(distance, profile, color=color, linewidth=2, alpha=alpha_val, label=label)

ax1.set_ylabel('Elevation (m)', color='white')
ax1.set_title('Profile Evolution Toward Grade', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
graded_p = 1000 * np.exp(-distance / 150)
ax2.plot(distance, graded_p, color='#22c55e', linewidth=2, label='Original')

incised = graded_p.copy()
for i, d in enumerate(distance):
    if d > 300:
        incised[i] = graded_p[i] - 100 * (d - 300) / 200
incised = np.maximum(incised, graded_p - 100)

ax2.plot(distance, incised, color='#ef4444', linewidth=2, label='After sea level drop')
ax2.fill_between(distance, incised, graded_p, where=incised < graded_p, alpha=0.2, color='#f59e0b')
ax2.axhline(0, color='#3b82f6', linestyle='--', alpha=0.3)
ax2.set_xlabel('Distance (km)', color='white')
ax2.set_ylabel('Elevation (m)', color='white')
ax2.set_title('Response to Base Level Drop', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Graded profile: concave-up curve from source to base level")
print("Base level drop -> incision wave -> terraces")`, challenge: 'Simulate 5 ice age cycles of base level oscillation (±100m). How many terraces form?', successHint: 'The graded profile is the river\'s target shape. Tectonic forces and climate changes keep moving the target.' },
    { title: 'Knickpoint retreat — erosion\'s cutting edge', concept: `A **knickpoint** is a steep section in a river profile that migrates upstream. The stream power incision model predicts retreat rate:\n\n**E = K * A^m * S^n**\n\nKnickpoint celerity: c = K * m * A^m * S^(n-1). Key insight: larger rivers propagate knickpoints faster (higher A). This creates **hanging valleys** where tributaries lag behind the main stem.`, analogy: 'A knickpoint retreating upstream is like a queue forming at a highway bottleneck. The congestion (knickpoint) moves backward as more traffic arrives.', storyConnection: 'The Siang gorge itself is a giant knickpoint — a massive steepening retreating upstream over millions of years as the Himalayas rose.', checkQuestion: 'At 1 km per 10,000 years, how long to carve a 300 km gorge?', checkAnswer: '3 million years. But rates vary with drainage area and rock type. The Siang gorge likely formed over 10-20 Ma with varying rates.', codeIntro: 'Simulate knickpoint retreat using the stream power model.', code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

K = 1e-5; m = 0.5
time_kyr = np.linspace(0, 500, 200)
areas = [10, 100, 1000, 10000, 100000]
colors = ['#6b7280', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

ax1.set_facecolor('#111827')
for A, color in zip(areas, colors):
    celerity = K * m * A**m * 1e3
    ax1.plot(time_kyr, celerity * time_kyr, color=color, linewidth=2, label=f'A={A:,} km\²')

ax1.set_xlabel('Time (kyr)', color='white')
ax1.set_ylabel('Retreat distance (km)', color='white')
ax1.set_title('Knickpoint Celerity vs Drainage Area', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
x_main = np.linspace(0, 100, 200)
z_main = 1000 * np.exp(-x_main / 40)
ax2.plot(x_main, z_main, color='#3b82f6', linewidth=3, label='Main stem')

junction_x = 60
junction_z = 1000 * np.exp(-junction_x / 40)
x_trib = np.linspace(0, 30, 100)
z_trib = junction_z + 200 * np.exp(-x_trib / 15) + 100
ax2.plot(junction_x - x_trib[::-1], z_trib[::-1], color='#f59e0b', linewidth=2, label='Tributary')
ax2.annotate('Hanging valley', (junction_x, junction_z + 100), xytext=(70, junction_z + 200),
             color='#ef4444', fontsize=10, arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax2.set_xlabel('Distance (km)', color='white')
ax2.set_ylabel('Elevation (m)', color='white')
ax2.set_title('Hanging Valley Formation', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Knickpoint celerity: c = K * m * A^m")
for A in areas:
    c = K * m * A**m * 1e3
    print(f"  A={A:>6,} km2: {c:.2f} km/kyr")`, challenge: 'Calculate hanging valley height at a Siang tributary (A=100 km2) vs main stem (A=50,000 km2) after 1 Myr.', successHint: 'Knickpoint retreat theory connects field observations to mathematical predictions — one of geomorphology\'s great successes.' },
    { title: 'Landscape evolution modelling — simulating deep time', concept: `**Landscape evolution models (LEMs)** combine fluvial erosion (E = K*A^m*S^n), hillslope diffusion (D*nabla2(z)), and tectonic uplift (U) into one equation:\n\n**dz/dt = U - K*A^m*S^n - D*nabla2(z)**\n\nLEMs reproduce observed features: drainage networks, mountain ranges, and plateau erosion from simple physics. Major frameworks: CHILD, Landlab (Python), FastScape.`, analogy: 'An LEM is like a climate model for rocks — tracking rock and sediment over millions of years instead of air and water over days.', storyConnection: 'Running an LEM of the Eastern Himalayas reproduces the Siang gorge formation over 20 million years, showing how uplift creates gradient and the river fights to maintain equilibrium.', checkQuestion: 'Why should we trust models that simulate millions of years using modern observations?', checkAnswer: 'The physics (gravity, fluid mechanics) is timeless. LEMs are validated against real landscapes. Different models converge on similar results, suggesting they capture real physics.', codeIntro: 'Build a simple 2D landscape evolution model.', code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
nx, ny = 60, 60
dx = 500
z = np.random.rand(ny, nx) * 10
U = 0.001; K = 5e-6; D = 0.01; dt = 1000

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
snapshots = [0, 50, 200, 500, 1000, 2000]
snap_idx = 0

for step in range(max(snapshots) + 1):
    z += U * dt
    z[0, :] = 0; z[-1, :] = 0; z[:, 0] = 0; z[:, -1] = 0
    lap = np.zeros_like(z)
    lap[1:-1, 1:-1] = (z[2:, 1:-1] + z[:-2, 1:-1] + z[1:-1, 2:] + z[1:-1, :-2] - 4*z[1:-1, 1:-1]) / dx**2
    z += D * lap * dt
    for i in range(1, ny-1):
        for j in range(1, nx-1):
            nbrs = [(i-1,j), (i+1,j), (i,j-1), (i,j+1)]
            slopes = [(z[i,j] - z[ni,nj]) / dx for ni, nj in nbrs]
            ms = max(slopes)
            if ms > 0:
                A_p = max(1, (nx*ny - np.sum(z > z[i,j])) * dx**2 / 1e6)
                erosion = K * A_p**0.5 * ms * dt
                z[i,j] -= min(erosion, z[i,j] * 0.1)
    z = np.maximum(z, 0)
    if step in snapshots:
        ax = axes.flat[snap_idx]
        ax.set_facecolor('#111827')
        ax.imshow(z, cmap='terrain', vmin=0, vmax=np.percentile(z, 99))
        ax.set_title(f'Step {step}', color='white', fontsize=10)
        ax.tick_params(colors='gray', labelsize=7)
        snap_idx += 1

plt.suptitle('2D Landscape Evolution Model', color='white', fontsize=14, y=1.01)
plt.tight_layout()
plt.show()

print("Model shows: random surface -> uplift -> river incision -> steady state")`, challenge: 'Increase uplift to 0.005 m/yr. How does the landscape change?', successHint: 'LEMs combine stream power, hillslope diffusion, and tectonics into one framework — the culmination of quantitative geomorphology.' },
    { title: 'Base level control and terraces — reading the geological record', concept: `River terraces are former floodplains elevated above the current channel. They form when: (1) climate change reduces sediment supply, causing incision, (2) sea level drops, triggering upstream incision, or (3) tectonic uplift raises the land.\n\n**Strath terraces**: cut into bedrock (river eroded down to rock)\n**Fill terraces**: cut into alluvium (river eroded through its own deposits)\n\nTerraces are a geological archive: each terrace surface records a former river level. Dating terraces (14C, OSL, cosmogenic nuclides) reveals the timing of incision events, climate changes, and tectonic pulses.\n\nThe Siang valley has multiple terrace levels recording Quaternary climate oscillations and ongoing tectonic uplift.`, analogy: 'Terraces are like rings in a bathtub. Each ring marks a former water level. Lower rings are older (earlier drainage events). Reading terraces is reading the river\'s autobiography, written in sediment.', storyConnection: 'The Siang\'s terraces record its history of incision as the Himalayas rose and ice ages came and went. Each terrace level is a chapter in the story of the river carving through mountains.', checkQuestion: 'How can you tell a fill terrace from a strath terrace in the field?', checkAnswer: 'Dig or look at the terrace edge. A strath terrace has bedrock at its base with a thin layer of river gravel on top. A fill terrace is thick alluvium (gravel, sand, silt) all the way down. Strath terraces indicate prolonged lateral planation; fill terraces indicate rapid aggradation followed by incision.', codeIntro: 'Simulate terrace formation from multiple incision events.', code: `import numpy as np
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

x = np.linspace(-500, 500, 300)

terrace_levels = [
    (0, 'Current floodplain', '#3b82f6'),
    (15, 'T1 (~10 ka)', '#22c55e'),
    (40, 'T2 (~50 ka)', '#f59e0b'),
    (80, 'T3 (~130 ka)', '#ef4444'),
    (120, 'T4 (~250 ka)', '#a855f7'),
]

for elev, label, color in terrace_levels:
    width = 200 + elev * 3
    surface = np.where(np.abs(x) < width/2, elev, np.nan)
    ax.fill_between(x, elev - 5, surface, color=color, alpha=0.3)
    ax.plot(x, surface, color=color, linewidth=2)
    ax.text(width/2 + 10, elev, label, color=color, fontsize=9, va='center')

# Current channel
ax.fill_between(x, -20, 0, where=np.abs(x) < 30, color='#1e40af', alpha=0.5)
ax.text(0, -10, 'River', ha='center', color='#60a5fa', fontsize=9)

# Bedrock
ax.fill_between(x, -30, -20, color='#4b5563', alpha=0.3)

ax.set_xlabel('Distance from channel (m)', color='white')
ax.set_ylabel('Elevation above channel (m)', color='white')
ax.set_title('River Terrace Staircase', color='white', fontsize=13)
ax.tick_params(colors='gray')
ax.set_ylim(-30, 150)

plt.tight_layout()
plt.show()

print("Terrace formation:")
print("  T4 (250 ka): interglacial, high river level")
print("  T3 (130 ka): next interglacial")
print("  T2 (50 ka): moderate incision")
print("  T1 (10 ka): post-glacial incision")
print("  Current: active floodplain")
print()
print("Each terrace = a snapshot of the river at that time")`, challenge: 'Add tectonic tilt: one side of the valley uplifts faster. How do terraces on each bank differ in elevation?', successHint: 'Terraces are the geological record of landscape change. Each level documents a specific climate state, sea level, or tectonic event — a library of Earth history written in sediment and rock.' },
    { title: 'Tectonic uplift vs erosion — the mountain\'s fate', concept: `Mountain height is set by the balance: **Uplift > Erosion** (growing), **Uplift ≈ Erosion** (steady state), **Uplift < Erosion** (shrinking).\n\nThe Himalayas are near steady state: cosmogenic erosion rates (~3-5 mm/yr) match GPS uplift rates. A negative feedback limits mountain height: higher mountains → steeper rivers → faster erosion → prevents further growth. This "speed limit" is ~8-9 km for Earth gravity.\n\n**Isostatic rebound**: erosion removes rock, reducing crustal load, causing the crust to float upward. Erosion can actually CAUSE surface uplift even as mountains lose mass.`, analogy: 'A mountain in steady state is like a candle: wax is added from below (uplift) and burned from the top (erosion). The height stays constant even as material flows through it.', storyConnection: 'The Siang river did not defeat the mountains — it reached a truce. The Himalayas keep rising; the Siang keeps eroding. The gorge is the battlefield where these forces meet in dynamic equilibrium.', checkQuestion: 'Why isn\'t Everest 15,000m tall?', checkAnswer: 'Erosion speed-limits height. Taller mountains have steeper slopes, more precipitation, glaciers, and landslides. At ~8-9 km, erosion matches uplift. The rock also deforms under its own weight at extreme heights.', codeIntro: 'Model uplift-erosion competition to find steady-state mountain height.', code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

time_myr = np.linspace(0, 50, 500)
dt = time_myr[1] - time_myr[0]

scenarios = [
    ('Growing (U>>E)', 5, 0.5, '#ef4444'),
    ('Steady state', 5, 4.5, '#22c55e'),
    ('Shrinking', 1, 3, '#3b82f6'),
    ('No uplift', 0, 2, '#6b7280'),
]

ax1.set_facecolor('#111827')
for label, U, K_eff, color in scenarios:
    h = np.zeros_like(time_myr)
    h[0] = 1000
    for i in range(1, len(time_myr)):
        erosion = K_eff * h[i-1] / 5000
        h[i] = max(0, h[i-1] + (U - erosion) * dt * 1000)
    ax1.plot(time_myr, h / 1000, color=color, linewidth=2, label=label)

ax1.set_xlabel('Time (Myr)', color='white')
ax1.set_ylabel('Height (km)', color='white')
ax1.set_title('Mountain Height Evolution', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
U_range = np.linspace(0, 10, 100)
for k, label, color in [(0.5, 'Arid', '#ef4444'), (1.0, 'Temperate', '#f59e0b'), (2.0, 'Tropical', '#22c55e')]:
    ax2.plot(U_range, U_range / k, color=color, linewidth=2, label=label)

ranges_data = [('Himalayas', 5, 8), ('Andes', 3, 6), ('Alps', 1.5, 4), ('Appalachians', 0.1, 1.5)]
for name, u, h in ranges_data:
    ax2.plot(u, h, 'o', color='white', markersize=10)
    ax2.annotate(name, (u, h), xytext=(5, 5), textcoords='offset points', color='white', fontsize=9)

ax2.set_xlabel('Uplift rate (mm/yr)', color='white')
ax2.set_ylabel('Steady-state height (km)', color='white')
ax2.set_title('Height = Uplift / Erosion Efficiency', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Steady-state height = Uplift / Erosion efficiency")
print("Himalayas: 5mm/yr uplift, high erosion -> ~8km")
print("Appalachians: ~0mm/yr uplift -> slowly decaying")`, challenge: 'Double erosion efficiency (wetter climate). How fast does mountain height adjust? The response time is typically 1-10 Myr.', successHint: 'The tectonic-erosion balance is the grand synthesis of geomorphology. Mountains are dynamic steady states maintained by continuous interplay of uplift and erosion.' },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Deep Dive
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Geomorphology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for geomorphology simulations. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
