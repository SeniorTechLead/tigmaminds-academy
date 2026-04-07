import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function NeermahalLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Visualising pressure vs depth',
      concept: `**Hydrostatic pressure increases linearly with depth** — the graph of P vs h is a straight line with slope ρg.

Using matplotlib, we can visualise this relationship and see why engineers worry about deep water. The linear relationship means:
- Every extra metre of depth adds the same increment of pressure
- But the **total force** on a wall grows quadratically (because force integrates pressure over area)

Plotting both on the same figure reveals why a 6m flood is not just "twice as bad" as a 3m flood — it is four times worse in terms of wall loading.

📚 *We will use \`numpy.linspace()\` to create smooth depth arrays and \`matplotlib.pyplot\` to create our first scientific plots with dark styling.*`,
      analogy: 'Think of filling a glass with coloured layers of water — each layer adds the same weight. A graph of total weight vs number of layers is a straight line. But the pressure at the bottom (total weight divided by glass area) climbs with each layer too.',
      storyConnection: 'The architects of Neermahal could not plot graphs, but they understood intuitively that deeper walls needed to be thicker. Our visualisation puts numbers to their intuition.',
      checkQuestion: 'If you plot pressure (y-axis) vs depth (x-axis), what is the slope of the line in SI units?',
      checkAnswer: 'The slope is ρg = 1000 × 9.81 = 9810 Pa/m. For every metre deeper, pressure increases by 9,810 Pascals.',
      codeIntro: 'Plot hydrostatic pressure and wall force as functions of depth.',
      code: `import numpy as np
import matplotlib.pyplot as plt

h = np.linspace(0, 10, 200)  # depth 0 to 10 metres
rho, g = 1000, 9.81

pressure = rho * g * h               # Pa (linear)
wall_force = 0.5 * rho * g * h**2 * 10  # N for 10m-wide wall (quadratic)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')

for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

ax1.plot(h, pressure / 1000, color='#34d399', linewidth=2)
ax1.set_xlabel('Depth (m)', color='white')
ax1.set_ylabel('Pressure (kPa)', color='white')
ax1.set_title('Pressure vs Depth (linear)', color='white', fontsize=12)
ax1.axhline(y=101.325, color='#f59e0b', linestyle='--', alpha=0.7, label='1 atm')
ax1.legend(facecolor='#374151', labelcolor='white')

ax2.plot(h, wall_force / 1000, color='#f87171', linewidth=2)
ax2.set_xlabel('Depth (m)', color='white')
ax2.set_ylabel('Force on 10m wall (kN)', color='white')
ax2.set_title('Wall Force vs Depth (quadratic)', color='white', fontsize=12)
ax2.fill_between(h, 0, wall_force / 1000, alpha=0.2, color='#f87171')

plt.tight_layout()
plt.savefig('pressure_depth.png', dpi=100, facecolor='#1f2937')
plt.show()
print("Left: pressure grows linearly. Right: force grows quadratically.")
print("This is why deep floods are disproportionately dangerous.")`,
      challenge: 'Add a vertical dashed line at h=4.5m (heavy monsoon level) and annotate both plots with the pressure and force values at that depth.',
      successHint: 'Visualising the linear vs quadratic growth reveals why engineers obsess over maximum water levels — small increases in depth create large increases in structural demand.',
    },
    {
      title: 'Pressure distribution on a submerged wall',
      concept: `The pressure on a submerged wall is not uniform — it is **zero at the surface and maximum at the bottom**. This creates a triangular pressure distribution.

The **centre of pressure** (where the resultant force acts) is located at **2h/3** from the surface, or equivalently **h/3 from the bottom**. This is lower than the centroid of the wall (h/2) because higher pressures are concentrated near the bottom.

This matters for structural design:
- The overturning moment depends on WHERE the force acts, not just its magnitude
- A force applied lower creates a larger overturning moment about the base
- Walls must be designed to resist both the total force AND the overturning moment

📚 *We will use \`matplotlib.fill_betweenx()\` to shade the pressure distribution triangle and mark the centre of pressure.*`,
      analogy: 'Imagine holding a door closed against wind. If the wind pushes harder at the bottom, the door wants to swing out at the top. Water against a wall does exactly this — pushing hardest at the bottom, trying to tip the wall over.',
      storyConnection: 'Neermahal has thick, heavy walls that resist being pushed over by the lake. The walls are wider at the base — just like a dam — because that is where the water pushes hardest.',
      checkQuestion: 'For a 4m deep submerged wall, at what height from the bottom does the resultant force act?',
      checkAnswer: 'The centre of pressure is h/3 from the bottom = 4/3 ≈ 1.33 m from the bottom. The force acts in the lower third of the wall, not at the midpoint.',
      codeIntro: 'Visualise the triangular pressure distribution on a submerged palace wall.',
      code: `import numpy as np
import matplotlib.pyplot as plt

h_wall = 5.0  # wall height submerged (metres)
rho, g = 1000, 9.81

y = np.linspace(0, h_wall, 200)  # depth from surface
pressure = rho * g * y            # pressure at each depth

fig, ax = plt.subplots(figsize=(6, 7))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')
ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

# Wall on the left
ax.fill_betweenx(y, 0, 0.3, color='#9ca3af', alpha=0.8)

# Pressure triangle
p_norm = pressure / pressure.max() * 3  # scale for visual
ax.fill_betweenx(y, 0.3, 0.3 + p_norm, color='#60a5fa', alpha=0.4)
ax.plot(0.3 + p_norm, y, color='#3b82f6', linewidth=2)

# Centre of pressure
cp = 2 * h_wall / 3  # from surface
ax.plot(0.3 + rho * g * cp / pressure.max() * 3, cp, 'o',
        color='#f59e0b', markersize=12, zorder=5)
ax.annotate('Centre of\\npressure', xy=(2.2, cp),
            fontsize=10, color='#f59e0b', fontweight='bold')

# Force arrow
F = 0.5 * rho * g * h_wall**2
ax.annotate(f'F = {F/1000:.0f} kN/m', xy=(2.5, cp),
            xytext=(3.0, cp - 0.5), fontsize=10, color='white',
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax.set_xlabel('', color='white')
ax.set_ylabel('Depth from surface (m)', color='white')
ax.set_title('Pressure Distribution on Submerged Wall', color='white', fontsize=13)
ax.invert_yaxis()
ax.set_xlim(-0.5, 5)
ax.axhline(y=0, color='#22d3ee', linewidth=2, label='Water surface')
ax.legend(facecolor='#374151', labelcolor='white', loc='lower right')

plt.tight_layout()
plt.savefig('pressure_dist.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Total force per metre width: {F/1000:.1f} kN/m")
print(f"Centre of pressure: {cp:.2f}m from surface ({h_wall - cp:.2f}m from bottom)")`,
      challenge: 'What if the wall is only partially submerged (water on one side to 3m, dry on the other)? Modify the plot to show this asymmetric case.',
      successHint: 'The triangular distribution explains why retaining walls, dams, and palace foundations are always thicker at the bottom — that is where the action is.',
    },
    {
      title: 'Buoyancy force diagram — why Neermahal does not float',
      concept: `We can visualise the balance of forces on Neermahal:
- **Weight** (downward): the mass of stone, brick, concrete × g
- **Buoyancy** (upward): the weight of water displaced by the submerged portion
- **Pile reaction** (upward): the friction/bearing from the foundations

For stability: \`Weight = Buoyancy + Pile reaction\`

If buoyancy alone were enough to support the weight, the palace would float (like a boat). Since stone is denser than water, buoyancy only provides partial support, and the piles carry the rest.

The **net downward force** that the piles must resist is: \`F_piles = Weight - Buoyancy\`

📚 *We will use \`matplotlib\` bar charts to compare these forces visually.*`,
      analogy: 'You are standing in a pool. Gravity pulls you down, water pushes you up (you feel lighter), and your feet push against the pool floor for the difference. Neermahal works the same way — gravity, buoyancy, and foundations are the three players.',
      storyConnection: 'The genius of Neermahal is that the lake helps support it. Buoyancy carries part of the load, reducing how much the soft lakebed must bear. Without this partial buoyancy, the piles would need to be much stronger.',
      checkQuestion: 'If Neermahal weighs 50,000 kN and displaces 15,000 kN of water, how much must the piles carry?',
      checkAnswer: 'Pile reaction = Weight - Buoyancy = 50,000 - 15,000 = 35,000 kN. The water carries 30% of the palace weight — a significant contribution.',
      codeIntro: 'Create a force balance diagram for Neermahal showing weight, buoyancy, and pile reactions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Estimated forces (kN)
weight = 50000        # total palace weight
buoyancy = 15000      # upward water force
pile_reaction = weight - buoyancy  # piles carry the rest

forces = ['Weight\\n(down)', 'Buoyancy\\n(up)', 'Pile Reaction\\n(up)']
values = [weight, buoyancy, pile_reaction]
colors = ['#ef4444', '#3b82f6', '#22c55e']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')

# Bar chart
ax1.set_facecolor('#1f2937')
ax1.tick_params(colors='white')
for spine in ax1.spines.values():
    spine.set_color('white')

bars = ax1.bar(forces, values, color=colors, edgecolor='white', linewidth=0.5)
ax1.set_ylabel('Force (kN)', color='white', fontsize=12)
ax1.set_title('Force Balance on Neermahal', color='white', fontsize=13)
for bar, val in zip(bars, values):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 500,
             f'{val:,} kN', ha='center', color='white', fontsize=10)

# Pie chart showing load sharing
ax2.set_facecolor('#1f2937')
ax2.pie([buoyancy, pile_reaction], labels=['Buoyancy', 'Piles'],
        colors=['#3b82f6', '#22c55e'], autopct='%1.0f%%',
        textprops={'color': 'white', 'fontsize': 12},
        startangle=90, explode=(0.05, 0))
ax2.set_title('Who carries the load?', color='white', fontsize=13)

plt.tight_layout()
plt.savefig('force_balance.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Weight: {weight:,} kN (down)")
print(f"Buoyancy: {buoyancy:,} kN (up) = {buoyancy/weight*100:.0f}%")
print(f"Piles: {pile_reaction:,} kN (up) = {pile_reaction/weight*100:.0f}%")`,
      challenge: 'During monsoon, the water level rises and MORE of the palace is submerged, increasing buoyancy. Recalculate with buoyancy at 20,000 kN. How does this help the piles?',
      successHint: 'The water is not just a threat to Neermahal — it is an ally. Buoyancy reduces the load on the foundations, making a lake palace more feasible than it first appears.',
    },
    {
      title: 'Monsoon water level — a time series',
      concept: `Rudrasagar Lake's water level follows a **seasonal cycle**:
- **Pre-monsoon** (March-May): lowest levels, 1-2m
- **Monsoon** (June-September): rapid rise to 4-5m, peak in August
- **Post-monsoon** (October-November): gradual decline
- **Winter** (December-February): stable low levels

This annual cycle can be modelled as a **sinusoidal function** with an offset:

\`h(t) = h_mean + A × sin(2π(t - t_peak)/12)\`

where A is the amplitude of variation and t_peak shifts the peak to August.

📚 *We will use \`numpy.sin()\` to model seasonal variation and plot a full year of water levels with matplotlib.*`,
      analogy: 'Lake levels follow seasons like your body temperature follows the day — there is a predictable rhythm with a peak and a trough. Modelling it with a sine wave captures the essential pattern.',
      storyConnection: 'The palace caretakers and engineers must plan maintenance around the monsoon cycle. Repairs happen in winter when the water is low; inspections happen in autumn as the water recedes. The annual rhythm dictates the life of Neermahal.',
      checkQuestion: 'If the mean water level is 3m and the amplitude is 2m, what are the minimum and maximum levels?',
      checkAnswer: 'Minimum = 3 - 2 = 1m (pre-monsoon), Maximum = 3 + 2 = 5m (monsoon peak). The lake swings between 1m and 5m depth around the palace over the year.',
      codeIntro: 'Model and plot the annual water level cycle at Neermahal.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Monthly water level model
months = np.arange(1, 13)
month_names = ['Jan','Feb','Mar','Apr','May','Jun',
               'Jul','Aug','Sep','Oct','Nov','Dec']

h_mean = 3.0   # average depth (m)
amplitude = 1.8  # seasonal swing (m)
peak_month = 8   # August

# Sinusoidal model
t_fine = np.linspace(1, 12, 365)
h = h_mean + amplitude * np.sin(2 * np.pi * (t_fine - peak_month + 3) / 12)

fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')
ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

ax.plot(t_fine, h, color='#3b82f6', linewidth=2.5, label='Water level')
ax.fill_between(t_fine, 0, h, alpha=0.15, color='#3b82f6')

# Danger zone
ax.axhline(y=4.5, color='#ef4444', linestyle='--', alpha=0.7, label='Design flood level')
ax.axhline(y=h_mean, color='#9ca3af', linestyle=':', alpha=0.5, label=f'Mean ({h_mean}m)')

# Monsoon shading
ax.axvspan(6, 9, alpha=0.1, color='#22d3ee', label='Monsoon season')

ax.set_xlabel('Month', color='white', fontsize=12)
ax.set_ylabel('Water depth at Neermahal (m)', color='white', fontsize=12)
ax.set_title('Annual Water Level Cycle — Rudrasagar Lake', color='white', fontsize=13)
ax.set_xticks(months)
ax.set_xticklabels(month_names)
ax.set_ylim(0, 6)
ax.legend(facecolor='#374151', labelcolor='white', loc='upper left')

plt.tight_layout()
plt.savefig('water_level.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Min level: {h.min():.1f}m (dry season)")
print(f"Max level: {h.max():.1f}m (monsoon peak)")
print(f"Days above design flood (4.5m): {np.sum(h > 4.5)}")`,
      challenge: 'Add random daily variation (noise) of ±0.3m to make the model more realistic. Use np.random.normal(). Does this change when the level exceeds the design flood?',
      successHint: 'Seasonal modelling lets engineers predict when structures will face maximum stress. For Neermahal, August is the month of greatest danger — every year, without fail.',
    },
    {
      title: 'Comparing forces across monsoon scenarios',
      concept: `With our seasonal model, we can now calculate the **wall force at every point in the year** and plot how structural demand changes with the seasons.

Combining the time-series water level with the force formula:

\`F(t) = ½ × ρ × g × h(t)² × w\`

This transforms our water level plot into a **structural demand plot** — showing engineers exactly when the palace is under greatest stress and by how much.

The peak-to-trough ratio of force is much larger than the peak-to-trough ratio of water level, because force grows with h².

📚 *We will combine numpy arrays with matplotlib to create a two-panel plot showing both water level and structural force over a full year.*`,
      analogy: 'If your electricity bill were proportional to the square of the temperature, a hot summer would not just double your bill — it would quadruple it. Force vs water level works exactly this way.',
      storyConnection: 'For the engineers maintaining Neermahal today, understanding the seasonal force profile helps schedule inspections and repairs. They know August is the danger month, but the force plot shows them exactly how much worse August is compared to February.',
      checkQuestion: 'If water level doubles from 2m to 4m, by what factor does the wall force increase?',
      checkAnswer: 'Force is proportional to h², so it increases by (4/2)² = 4 times. A doubling of water level means four times the force — this is the critical insight for monsoon engineering.',
      codeIntro: 'Plot the annual cycle of both water level and structural force on Neermahal walls.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Seasonal model
days = np.arange(365)
h_mean, amp = 3.0, 1.8
h = h_mean + amp * np.sin(2 * np.pi * (days / 365 - 0.1))
h = np.clip(h, 0.5, None)  # min 0.5m

rho, g, w = 1000, 9.81, 10
force = 0.5 * rho * g * h**2 * w  # force in N

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7), sharex=True)
fig.patch.set_facecolor('#1f2937')

for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

# Water level
ax1.plot(days, h, color='#3b82f6', linewidth=2)
ax1.fill_between(days, 0, h, alpha=0.15, color='#3b82f6')
ax1.set_ylabel('Water depth (m)', color='white', fontsize=11)
ax1.set_title('Neermahal: Seasonal Water Level & Wall Force', color='white', fontsize=13)
ax1.axhline(y=h_mean, color='#9ca3af', linestyle=':', alpha=0.5)

# Force
ax2.plot(days, force / 1000, color='#f87171', linewidth=2)
ax2.fill_between(days, 0, force / 1000, alpha=0.15, color='#f87171')
ax2.set_ylabel('Wall force (kN)', color='white', fontsize=11)
ax2.set_xlabel('Day of year', color='white', fontsize=11)

# Show ratio
f_min, f_max = force.min(), force.max()
ratio = f_max / f_min
ax2.annotate(f'Peak/Min = {ratio:.1f}x', xy=(0.75, 0.85),
             xycoords='axes fraction', color='#f59e0b', fontsize=12, fontweight='bold')

# Month labels
month_starts = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
month_names = ['J','F','M','A','M','J','J','A','S','O','N','D']
ax2.set_xticks(month_starts)
ax2.set_xticklabels(month_names)

plt.tight_layout()
plt.savefig('seasonal_force.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Min water level: {h.min():.1f}m -> Force: {f_min/1000:.0f} kN")
print(f"Max water level: {h.max():.1f}m -> Force: {f_max/1000:.0f} kN")
print(f"Force ratio (peak/min): {ratio:.1f}x")
print(f"Level ratio: {h.max()/h.min():.1f}x")
print("Force amplification is much larger than level change!")`,
      challenge: 'Add a third panel showing the overturning moment (Force × h/3). How does the moment ratio compare to the force ratio?',
      successHint: 'By combining time-series modelling with structural physics, you can predict exactly when and how much stress a water palace experiences. This is real engineering analysis.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Visualising Structural Forces</span>
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
