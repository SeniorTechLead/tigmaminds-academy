import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HawkBlueLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Plotting the drag polar',
      concept: `The **drag polar** is a plot of C_L vs C_D — it summarizes a wing\'s entire aerodynamic performance in one curve.

For a hawk wing:
\`C_D = C_D0 + C_L² / (π × AR × e)\`

Where AR = b²/S is the **aspect ratio** (wingspan squared divided by wing area). Higher AR means more efficient wings — this is why albatrosses have long, narrow wings (AR ≈ 18) while hawks have broader wings (AR ≈ 7).

The drag polar reveals:
- Maximum L/D ratio (tangent line from origin)
- Minimum drag speed
- Stall point (maximum C_L)

📚 *matplotlib\'s \`plt.annotate()\` with arrow properties creates professional-looking annotations. We use tangent line geometry to find the maximum L/D point.*`,
      analogy: 'The drag polar is like a fuel efficiency graph for a car. At each speed (C_L), there is a corresponding fuel consumption (C_D). The most efficient point is not at the lowest fuel consumption but at the best ratio of distance to fuel — analogous to maximum L/D.',
      storyConnection: 'The hawk\'s wing has been shaped by millions of years of evolution to optimize its drag polar. The slotted primary feathers at the wingtip reduce induced drag (lowering the right side of the curve), while the smooth leading edge minimizes parasitic drag (lowering the baseline C_D0).',
      checkQuestion: 'Why do gliders have higher aspect ratios than fighter jets?',
      checkAnswer: 'Gliders need maximum L/D for efficiency — high AR reduces induced drag, which dominates at the slow speeds gliders fly. Fighter jets need high speed and maneuverability — low AR gives a smaller wing that produces less drag at high speed and allows tighter turns. Each is optimized for its mission, like hawks (high AR for soaring) vs falcons (lower AR for diving).',
      codeIntro: 'Plot the drag polar for a hawk wing and compare it with other birds.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

def drag_polar(CL, CD0, AR, e=0.85):
    return CD0 + CL**2 / (np.pi * AR * e)

CL = np.linspace(0, 1.5, 200)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

birds = {
    'Hawk (AR=7)':      {'CD0': 0.025, 'AR': 7, 'color': '#f87171'},
    'Albatross (AR=18)': {'CD0': 0.015, 'AR': 18, 'color': '#34d399'},
    'Sparrow (AR=5)':   {'CD0': 0.040, 'AR': 5, 'color': '#fbbf24'},
    'Falcon (AR=6)':    {'CD0': 0.020, 'AR': 6, 'color': '#a78bfa'},
}

# Drag polar
ax1.set_facecolor('#1f2937')
for name, props in birds.items():
    CD = drag_polar(CL, props['CD0'], props['AR'])
    ax1.plot(CD, CL, color=props['color'], linewidth=2.5, label=name)

    # Max L/D point (tangent from origin)
    LD = CL / CD
    max_idx = np.argmax(LD)
    ax1.plot(CD[max_idx], CL[max_idx], 'o', color=props['color'], markersize=8)

ax1.set_xlabel('Drag Coefficient (C_D)', color='lightgray', fontsize=12)
ax1.set_ylabel('Lift Coefficient (C_L)', color='lightgray', fontsize=12)
ax1.set_title('Drag Polar — Bird Wing Comparison', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=9)
ax1.set_xlim(0, 0.15)
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# L/D ratio vs CL
ax2.set_facecolor('#1f2937')
for name, props in birds.items():
    CD = drag_polar(CL, props['CD0'], props['AR'])
    LD = CL / CD
    ax2.plot(CL, LD, color=props['color'], linewidth=2.5, label=name)

    max_ld = np.max(LD)
    max_cl = CL[np.argmax(LD)]
    ax2.plot(max_cl, max_ld, 'o', color=props['color'], markersize=8)
    ax2.annotate(f'L/D={max_ld:.0f}', xy=(max_cl, max_ld),
                 xytext=(max_cl+0.1, max_ld-2), color=props['color'], fontsize=9)

ax2.set_xlabel('Lift Coefficient (C_L)', color='lightgray', fontsize=12)
ax2.set_ylabel('L/D Ratio', color='lightgray', fontsize=12)
ax2.set_title('Lift-to-Drag Ratio', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=9)
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/hawk_polar.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print("Maximum L/D ratios:")
for name, props in birds.items():
    CD = drag_polar(CL, props['CD0'], props['AR'])
    print(f"  {name}: L/D = {np.max(CL/CD):.1f}")`,
      challenge: 'Add a modern sailplane (AR=30, CD0=0.008) to the comparison. How does human engineering compare to bird evolution? What compromises does the sailplane make that birds do not?',
      successHint: 'You plotted the drag polar — the most fundamental representation of aerodynamic performance. This single curve contains everything needed to predict flight performance. Aircraft designers spend millions of dollars and years of wind tunnel testing to optimize this curve.',
    },
    {
      title: 'Thermal mapping — visualizing updrafts',
      concept: `Thermals are not uniform — they have structure:
- **Core**: strongest updraft (warmest air), 2-5 m/s
- **Edges**: weaker updraft, turbulent mixing
- **Downdrafts**: sinking air around the thermal (compensation current)

A thermal profile can be modeled as a **Gaussian** distribution:
\`w(r) = w_max × exp(-r² / (2σ²))\`

Where r is distance from the thermal center and σ is the thermal radius. The total mass flux upward must equal the mass flux downward (conservation of mass), so surrounding air sinks.

Hawks find the thermal core by circling and feeling which wing gets more lift. They adjust their circle to stay centered on the strongest updraft.

📚 *numpy\'s meshgrid creates 2D coordinate arrays for surface plots. matplotlib\'s \`contourf\` creates filled contour maps — thermal maps of the sky.*`,
      analogy: 'A thermal map is like a topographic map of an invisible mountain of rising air. The "peak" is the thermal core (strongest updraft). The "slopes" are the edges (weaker updraft). The "valley" around the thermal is the compensating downdraft. Hawks navigate this invisible landscape as skillfully as mountaineers navigate real terrain.',
      storyConnection: 'Over Blue Mountain, multiple thermals form simultaneously along the ridgeline. Hawks reading these thermal patterns can choose optimal routes — jumping from thermal to thermal like stepping stones, staying in rising air almost continuously. The thermal map of Blue Mountain changes minute by minute as the sun moves.',
      checkQuestion: 'Why do thermals have downdrafts around their edges?',
      checkAnswer: 'Conservation of mass. If air rises in the thermal core, an equal mass of air must descend somewhere to replace it. This creates a ring of sinking air around each thermal. Hawks avoid these "sink zones" — entering a thermal from the wrong angle means flying through a downdraft first, losing precious altitude.',
      codeIntro: 'Create a 2D thermal map showing updraft and downdraft patterns over Blue Mountain.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Create 2D thermal field
x = np.linspace(-2000, 2000, 200)  # meters
y = np.linspace(-2000, 2000, 200)
X, Y = np.meshgrid(x, y)

def thermal(x0, y0, w_max, sigma):
    """Single thermal with Gaussian profile."""
    r2 = (X - x0)**2 + (Y - y0)**2
    up = w_max * np.exp(-r2 / (2 * sigma**2))
    # Compensating downdraft
    down = -w_max * 0.3 * np.exp(-r2 / (2 * (sigma*2.5)**2))
    return up + down

# Multiple thermals over Blue Mountain
W = np.zeros_like(X)
thermals = [
    (500, 300, 4.0, 200),     # strong thermal
    (-600, -200, 3.0, 150),   # medium thermal
    (-200, 800, 2.5, 180),    # medium thermal
    (800, -600, 1.5, 120),    # weak thermal
    (0, 0, 3.5, 250),         # central thermal
]

for x0, y0, w_max, sigma in thermals:
    W += thermal(x0, y0, w_max, sigma)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Thermal contour map
ax1.set_facecolor('#1f2937')
levels = np.linspace(-1, 5, 25)
cf = ax1.contourf(X/1000, Y/1000, W, levels=levels, cmap='RdBu_r')
plt.colorbar(cf, ax=ax1, label='Vertical speed (m/s)')
ax1.contour(X/1000, Y/1000, W, levels=[0], colors='white', linewidths=1, linestyles='--')

# Mark thermal centers
for x0, y0, w_max, sigma in thermals:
    ax1.plot(x0/1000, y0/1000, '^', color='white', markersize=10)
    ax1.annotate(f'{w_max:.1f}m/s', xy=(x0/1000, y0/1000),
                 xytext=(x0/1000+0.15, y0/1000+0.1), color='white', fontsize=8)

ax1.set_xlabel('East-West (km)', color='lightgray')
ax1.set_ylabel('North-South (km)', color='lightgray')
ax1.set_title('Thermal Map — Blue Mountain', color='white', fontsize=13, fontweight='bold')
ax1.tick_params(colors='lightgray')

# Cross-section through strongest thermal
ax2.set_facecolor('#1f2937')
center_y_idx = 100 + int(300 / 20)  # y = 300m
profile = W[center_y_idx, :]
ax2.plot(x/1000, profile, color='#f87171', linewidth=2.5)
ax2.fill_between(x/1000, profile, where=profile > 0, alpha=0.3, color='#f87171', label='Updraft')
ax2.fill_between(x/1000, profile, where=profile < 0, alpha=0.3, color='#60a5fa', label='Downdraft')
ax2.axhline(0, color='gray', linewidth=0.5)
ax2.axhline(1.0, color='#34d399', linestyle='--', alpha=0.5, label='Hawk sink rate')
ax2.set_xlabel('East-West position (km)', color='lightgray')
ax2.set_ylabel('Vertical air speed (m/s)', color='lightgray')
ax2.set_title('Thermal Cross-Section', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/hawk_thermal_map.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

# Analysis
usable_area = np.sum(W > 1.0) / W.size * 100
print(f"Usable thermal area (updraft > 1 m/s): {usable_area:.1f}% of sky")
print(f"Peak updraft: {W.max():.1f} m/s")
print(f"Strongest downdraft: {W.min():.1f} m/s")`,
      challenge: 'Simulate the thermal field changing over 3 hours (thermals grow, shift, and die). Create an animation-like series of 6 snapshots showing how the "thermal landscape" evolves as the sun moves.',
      successHint: 'You created a thermal map — a visualization of the invisible energy field that soaring birds navigate. Modern glider pilots use similar computations (fed by weather models and satellite data) to plan cross-country flights. Hawks do it by feel, in real time.',
    },
    {
      title: 'Biomimicry — hawk-inspired wing design',
      concept: `**Biomimicry** applies natural designs to engineering. Hawk features that inspire technology:

1. **Slotted wingtips**: primary feathers spread like fingers, each acting as a small winglet. Reduces induced drag by 10-15%. Copied by Boeing 737 winglets.

2. **Variable geometry**: hawks change wing shape in flight (sweep, camber, twist). Inspires morphing wings for drones.

3. **Turbulence sensing**: feathers detect airflow changes. Inspires distributed sensor arrays for aircraft.

4. **Thermal detection**: hawks sense temperature gradients. Inspires UAV thermal-seeking algorithms.

Quantifying biomimicry: we compare the performance gain from each feature to the engineering cost of implementing it.

📚 *Bar charts with grouped bars compare features across categories. We use \`plt.bar()\` with offset positions to create grouped displays.*`,
      analogy: 'Biomimicry is like reverse engineering nature\'s R&D department. Evolution has been "testing prototypes" for 150 million years (since the first birds). Each feature that survives is proven to work. We are not copying nature blindly — we are reading nature\'s research papers (bird anatomy) and adapting the best ideas to our technology.',
      storyConnection: 'The hawks of Blue Mountain are flying laboratories. Their wing features — the slotted tips, the flexible trailing edge, the alula (thumb wing for low-speed control) — each represent an engineering solution refined over millions of years. Mizoram\'s raptors carry design secrets that aerospace engineers are only beginning to decode.',
      checkQuestion: 'Why cannot we simply copy a hawk\'s wing exactly for an aircraft?',
      checkAnswer: 'Scale effects. A hawk weighs 1.5 kg; an aircraft weighs 100,000 kg. The physics changes at different scales (Reynolds number). Features that work at small scale (flexible feathers) may not scale up. Also, birds use active muscle control that we cannot yet replicate mechanically. Biomimicry adapts principles, not exact copies.',
      codeIntro: 'Quantify the performance benefits of hawk-inspired design features.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Performance comparison: hawk features vs standard wing
features = {
    'Slotted wingtips': {
        'drag_reduction': 12,    # percent
        'lift_increase': 5,
        'stall_delay': 8,        # degrees angle of attack
        'complexity': 3,         # 1-5 scale
        'aircraft_example': 'Boeing 737 winglets'
    },
    'Variable sweep': {
        'drag_reduction': 15,
        'lift_increase': 10,
        'stall_delay': 3,
        'complexity': 5,
        'aircraft_example': 'F-14 Tomcat'
    },
    'Flexible trailing edge': {
        'drag_reduction': 8,
        'lift_increase': 12,
        'stall_delay': 5,
        'complexity': 4,
        'aircraft_example': 'FlexSys adaptive wing'
    },
    'Alula (leading edge slat)': {
        'drag_reduction': 2,
        'lift_increase': 15,
        'stall_delay': 10,
        'complexity': 2,
        'aircraft_example': 'All modern airliners'
    },
    'Surface texture (feathers)': {
        'drag_reduction': 5,
        'lift_increase': 3,
        'stall_delay': 2,
        'complexity': 3,
        'aircraft_example': 'Riblet surfaces (experimental)'
    },
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

names = list(features.keys())
short_names = [n.split('(')[0].strip() for n in names]
x = np.arange(len(names))
width = 0.25

# Performance bars
ax1.set_facecolor('#1f2937')
drag = [features[n]['drag_reduction'] for n in names]
lift = [features[n]['lift_increase'] for n in names]
stall = [features[n]['stall_delay'] for n in names]

ax1.barh(x - width, drag, width, color='#34d399', label='Drag reduction %')
ax1.barh(x, lift, width, color='#60a5fa', label='Lift increase %')
ax1.barh(x + width, stall, width, color='#fbbf24', label='Stall delay (deg)')
ax1.set_yticks(x)
ax1.set_yticklabels(short_names, fontsize=9)
ax1.set_xlabel('Performance gain', color='lightgray')
ax1.set_title('Biomimicry Performance Benefits', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=8)
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Benefit-to-complexity ratio
ax2.set_facecolor('#1f2937')
total_benefit = [(features[n]['drag_reduction'] + features[n]['lift_increase'] + features[n]['stall_delay']) for n in names]
complexity = [features[n]['complexity'] for n in names]
ratio = [b/c for b, c in zip(total_benefit, complexity)]

colors = ['#34d399' if r > 8 else '#fbbf24' if r > 5 else '#f87171' for r in ratio]
ax2.barh(short_names, ratio, color=colors, edgecolor='none', height=0.6)
ax2.set_xlabel('Benefit/Complexity ratio', color='lightgray')
ax2.set_title('Engineering Value (higher = better ROI)', color='white', fontsize=13, fontweight='bold')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/hawk_biomimicry.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print("Best biomimicry candidates (benefit/complexity):")
for name, r in sorted(zip(names, ratio), key=lambda x: -x[1]):
    f = features[name]
    print(f"  {name:<30} ratio={r:.1f} → {f['aircraft_example']}")`,
      challenge: 'Add a "drone application" column — which features are most valuable for small UAVs (< 5 kg) vs large aircraft (> 50,000 kg)? The answer differs because of scale effects (Reynolds number changes with size).',
      successHint: 'You quantified biomimicry — turning biological inspiration into engineering metrics. This is how modern bio-inspired design works: not romantic imitation but rigorous comparison of benefits and costs. The hawks of Blue Mountain carry engineering solutions worth billions in aerospace R&D.',
    },
    {
      title: 'Flight speed polar — the sink rate curve',
      concept: `The **speed polar** (or sink polar) plots sink rate vs airspeed — the most practical performance curve for soaring:

\`sink_rate = V × D / W = V × (½ρV²SC_D0 + 2W²/(ρV²πb²e)) / W\`

This V-shaped curve reveals:
- **Minimum sink speed** (V_ms): slowest descent, used for circling in thermals
- **Best glide speed** (V_bg): maximum distance per altitude lost
- **Speed to fly** (MacCready): optimal inter-thermal speed, faster than V_bg

The curve shifts with wing loading (W/S):
- Light loading (spread wings): lower speeds, lower sink rates — thermal soaring
- Heavy loading (tucked wings): higher speeds — fast inter-thermal glide

📚 *numpy operations on arrays compute the entire speed polar in one vectorized expression, much faster than a Python loop.*`,
      analogy: 'The speed polar is like a car\'s fuel economy chart. There is a speed where you get the best miles per gallon (best glide speed). Going slower wastes fuel on engine inefficiency (induced drag). Going faster wastes fuel on air resistance (parasitic drag). The hawk naturally flies at the economical speed.',
      storyConnection: 'Hawks over Blue Mountain instinctively fly at different speeds depending on what they are doing. In a thermal: slow (minimum sink). Between thermals: faster (best glide or MacCready speed). Diving on prey: maximum speed (tucked wings). Their flight computer is neural, not digital — but solves the same optimization.',
      checkQuestion: 'Why is the best glide speed different from the minimum sink speed?',
      checkAnswer: 'Minimum sink occurs at a speed where sink rate (vertical speed downward) is lowest. But best glide requires maximum horizontal-distance-per-altitude-lost, which means the tangent line from the origin to the speed polar. This tangent point is always at a higher speed than minimum sink — you trade a slightly higher sink rate for much more horizontal speed.',
      codeIntro: 'Plot the speed polar and find optimal soaring speeds for different conditions.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

def speed_polar(V, mass, S, b, CD0, rho=1.1, e=0.85):
    """Calculate sink rate at each airspeed."""
    W = mass * 9.81
    q = 0.5 * rho * V**2
    CL = W / (q * S)
    CD = CD0 + CL**2 / (np.pi * (b**2/S) * e)
    D = q * S * CD
    return D * V / W  # sink rate (m/s, positive = sinking)

V = np.linspace(5, 35, 300)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Different configurations
configs = [
    ('Wings spread (soaring)', 1.5, 0.25, 1.2, 0.025, '#34d399'),
    ('Wings normal', 1.5, 0.20, 1.0, 0.022, '#fbbf24'),
    ('Wings tucked (fast)', 1.5, 0.14, 0.8, 0.018, '#f87171'),
]

ax1.set_facecolor('#1f2937')
for name, mass, S, b, CD0, color in configs:
    sink = speed_polar(V, mass, S, b, CD0)
    valid = (sink > 0) & (sink < 10)
    ax1.plot(V[valid], -sink[valid], color=color, linewidth=2.5, label=name)

    # Minimum sink point
    min_idx = np.argmin(sink[valid])
    ax1.plot(V[valid][min_idx], -sink[valid][min_idx], 'o', color=color, markersize=8)

    # Best glide: tangent from origin
    glide_ratio = V / sink
    bg_idx = np.argmax(glide_ratio[valid])
    ax1.plot(V[valid][bg_idx], -sink[valid][bg_idx], 's', color=color, markersize=8)

ax1.set_xlabel('Airspeed (m/s)', color='lightgray', fontsize=12)
ax1.set_ylabel('Sink rate (m/s, up is less sinking)', color='lightgray', fontsize=12)
ax1.set_title('Speed Polar — Hawk Flight Configurations', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=9)
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# MacCready speed selection
ax2.set_facecolor('#1f2937')
sink_normal = speed_polar(V, 1.5, 0.20, 1.0, 0.022)
valid = (sink_normal > 0) & (sink_normal < 10)

ax2.plot(V[valid], -sink_normal[valid], color='#fbbf24', linewidth=2.5, label='Speed polar')

# MacCready theory: draw tangent from (0, -thermal_strength)
for thermal_w, color in [(1.0, '#34d399'), (2.0, '#60a5fa'), (4.0, '#f87171')]:
    # Find tangent point
    best_v = V[valid][0]
    best_slope = -1e6
    for i, (v, s) in enumerate(zip(V[valid], sink_normal[valid])):
        slope = (-s - (-thermal_w)) / v
        if slope > best_slope:
            best_slope = slope
            best_v = v
            best_sink = s

    ax2.plot([0, best_v], [-thermal_w, -best_sink], '--', color=color, linewidth=1.5)
    ax2.plot(best_v, -best_sink, 'o', color=color, markersize=8)
    ax2.annotate(f'w={thermal_w}: fly at {best_v:.0f} m/s',
                 xy=(best_v, -best_sink), xytext=(best_v+2, -best_sink+0.2),
                 color=color, fontsize=9)

ax2.set_xlabel('Airspeed (m/s)', color='lightgray', fontsize=12)
ax2.set_ylabel('Sink rate (m/s)', color='lightgray', fontsize=12)
ax2.set_title('MacCready Speed Theory', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=9)
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/hawk_speed_polar.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

for name, mass, S, b, CD0, _ in configs:
    sink = speed_polar(V, mass, S, b, CD0)
    valid = sink > 0
    print(f"{name}: min sink = {np.min(sink[valid]):.2f} m/s at {V[valid][np.argmin(sink[valid])]:.0f} m/s")`,
      challenge: 'A hawk is at 500m altitude and must reach a thermal 5 km away. Plot the available altitude at arrival for each speed. What is the maximum distance the hawk can reach? At what speed should it fly?',
      successHint: 'You plotted the speed polar and applied MacCready theory — the mathematical framework that competitive glider pilots use to win championships. Hawks do this instinctively, adjusting their speed to thermal conditions in real time.',
    },
    {
      title: 'Wind and ridge lift — slope soaring',
      concept: `When wind hits a mountain slope, it is deflected upward, creating **ridge lift** (also called orographic lift):

\`w_ridge = V_wind × sin(slope_angle)\`

Ridge lift is strongest when:
- Wind is perpendicular to the ridge
- Wind speed is high
- Slope is steep

Blue Mountain (Phawngpui) at 2,157 m creates strong ridge lift on its windward side. Hawks use this for **slope soaring**: flying back and forth along the ridge in the updraft band.

Unlike thermals (which are localized and intermittent), ridge lift is continuous as long as the wind blows. Hawks can soar for hours along a ridge without gaining or losing altitude.

📚 *We model the wind field around a mountain using potential flow theory (simplified). The 2D wind field can be computed and visualized as a vector plot.*`,
      analogy: 'Ridge lift is like an escalator along the side of a building. Wind hitting the building has nowhere to go but up (and over). A bird flying along the building\'s face rides this continuous updraft. Thermals are like elevators — intermittent and localized. Ridge lift is like the escalator — always running.',
      storyConnection: 'Phawngpui\'s ridgeline runs roughly north-south. When prevailing winds blow from the west, the western slope generates continuous ridge lift. Hawks patrol this ridge at precise altitude, riding the narrow band of strongest updraft — a living demonstration of fluid dynamics.',
      checkQuestion: 'Why is ridge lift strongest near the top of the ridge rather than at the base?',
      checkAnswer: 'At the base, wind is partially blocked by the mountain itself (wind shadow). Near the top, the wind accelerates as it is compressed between the slope and the air above (Venturi effect). Maximum updraft occurs slightly below and upwind of the ridgetop. Above the ridge, the flow may become turbulent (rotor), which is dangerous.',
      codeIntro: 'Model the wind field around Blue Mountain and visualize the ridge lift pattern.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Mountain profile (simplified Blue Mountain cross-section)
x = np.linspace(-5000, 5000, 200)
mountain = 2157 * np.exp(-x**2 / (2 * 1500**2))  # Gaussian mountain

# Wind field (simplified potential flow over a bump)
nx, nz = 100, 50
x_grid = np.linspace(-5000, 5000, nx)
z_grid = np.linspace(0, 4000, nz)
X, Z = np.meshgrid(x_grid, z_grid)

# Base wind (horizontal)
V_wind = 8.0  # m/s
U = np.ones_like(X) * V_wind
W = np.zeros_like(X)

# Add deflection over mountain
for i in range(nx):
    for j in range(nz):
        mtn_height = 2157 * np.exp(-x_grid[i]**2 / (2 * 1500**2))
        if z_grid[j] < mtn_height:
            U[j, i] = 0
            W[j, i] = 0
        elif z_grid[j] < mtn_height + 1000:
            # Deflect upward near surface
            height_above = z_grid[j] - mtn_height
            slope = -2157 * x_grid[i] / 1500**2 * np.exp(-x_grid[i]**2 / (2 * 1500**2))
            deflection = max(0, slope * V_wind) * np.exp(-height_above / 500)
            W[j, i] = deflection * 0.5

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 9))
fig.patch.set_facecolor('#111827')

# Wind field with mountain
ax1.set_facecolor('#1f2937')
ax1.fill_between(x/1000, 0, mountain, color='#4a5568', zorder=2)
# Updraft contours
levels = np.linspace(-1, 4, 20)
cf = ax1.contourf(X/1000, Z, W, levels=levels, cmap='RdBu_r', alpha=0.7, zorder=1)
plt.colorbar(cf, ax=ax1, label='Vertical wind (m/s)')

# Wind arrows (subsampled)
skip = 5
ax1.quiver(X[::skip, ::skip]/1000, Z[::skip, ::skip],
           U[::skip, ::skip], W[::skip, ::skip],
           color='white', alpha=0.3, scale=100, width=0.003)

# Hawk soaring zone
ax1.plot([-1.5, -0.5], [2300, 2300], 'r--', linewidth=2, label='Hawk soaring zone')
ax1.set_xlabel('Distance (km)', color='lightgray')
ax1.set_ylabel('Altitude (m)', color='lightgray')
ax1.set_title('Wind Field Over Blue Mountain (Phawngpui)', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax1.set_ylim(0, 4000)
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Vertical wind profile at different positions
ax2.set_facecolor('#1f2937')
positions = [(-1500, 'Windward slope'), (-500, 'Near summit'),
             (0, 'Summit'), (500, 'Leeward'), (1500, 'Downwind')]
colors = ['#34d399', '#fbbf24', '#f87171', '#a78bfa', '#60a5fa']

for (x_pos, label), color in zip(positions, colors):
    xi = np.argmin(np.abs(x_grid - x_pos))
    mtn_h = 2157 * np.exp(-x_pos**2 / (2 * 1500**2))
    valid = z_grid > mtn_h
    ax2.plot(W[valid, xi], z_grid[valid], color=color, linewidth=2, label=label)

ax2.axvline(0, color='gray', linewidth=0.5)
ax2.axvline(1.0, color='white', linewidth=1, linestyle=':', alpha=0.5)
ax2.text(1.1, 3500, 'Min for soaring', color='white', fontsize=9)
ax2.set_xlabel('Vertical wind speed (m/s)', color='lightgray')
ax2.set_ylabel('Altitude (m)', color='lightgray')
ax2.set_title('Ridge Lift Profiles', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=9)
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/hawk_ridge.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print("Ridge lift analysis:")
for (x_pos, label), color in zip(positions, colors):
    xi = np.argmin(np.abs(x_grid - x_pos))
    max_w = np.max(W[:, xi])
    print(f"  {label:20s}: max updraft = {max_w:.2f} m/s {'(soarable)' if max_w > 1 else '(too weak)'}")`,
      challenge: 'Model how ridge lift changes with wind direction. If wind shifts from perpendicular (west) to 45 degrees off (southwest), how does the usable updraft change? At what wind angle does ridge soaring become impossible?',
      successHint: 'You modeled the wind field around a mountain — a simplified version of computational fluid dynamics (CFD). Understanding ridge lift explains hawk behavior, wind turbine placement, and even why certain mountain passes are dangerous for light aircraft.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Visualizing Aerodynamics & Flight</span>
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
