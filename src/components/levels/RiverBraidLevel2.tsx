import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RiverBraidLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Stream power equations — the energy of flowing water',
      concept: `**Stream power** is the rate at which a river expends energy on its bed and banks. It determines whether the river erodes, transports sediment, or deposits. Two forms are used:

**Total stream power** (Omega, watts per metre of channel):
**Omega = rho * g * Q * S**
- rho = water density (1000 kg/m3)
- g = gravitational acceleration (9.81 m/s2)
- Q = discharge (m3/s)
- S = channel slope (m/m)

**Specific stream power** (omega, watts per square metre of bed):
**omega = Omega / w = rho * g * Q * S / w**
- w = channel width (m)

This divides total power by width, giving power per unit area — more useful for predicting erosion.

**Critical thresholds (after Brookes, 1988):**
- omega < 10 W/m2: deposition dominates (stable or aggrading channel)
- 10-35 W/m2: transport zone (channel maintains its form)
- omega > 35 W/m2: erosion dominates (channel incising or widening)

For the Brahmaputra in Assam:
- Q ~ 20,000 m3/s (mean), 70,000 m3/s (flood)
- S ~ 0.00008 (very gentle)
- w ~ 5,000-10,000 m
- omega ~ 1.5-4 W/m2 (low — hence deposition and braiding)`,
      analogy: 'Stream power is like the wattage of a pressure washer. A high-wattage washer on a narrow nozzle (steep, narrow channel) blasts dirt away (erosion). A low-wattage washer on a wide spray (gentle, wide river) gently mists the surface (deposition). The Brahmaputra is an extremely wide, low-pressure spray — it deposits more than it erodes.',
      storyConnection: 'The fisherman wonders why the river "loses its strength" near the sea. Stream power quantifies this exactly: as slope decreases and width increases, specific stream power drops. The Brahmaputra transforms from a powerful mountain torrent (omega > 100 W/m2 in Tibet) to a gentle, braided plain river (omega < 5 W/m2 in Assam).',
      checkQuestion: 'If discharge doubles during monsoon, does stream power double?',
      checkAnswer: 'Total stream power (Omega) doubles if Q doubles (assuming slope unchanged). But specific stream power (omega) increases by less than double because the river also widens during floods. If width doubles along with discharge, omega stays the same. In practice, width increases but not proportionally, so omega increases moderately during floods.',
      codeIntro: 'Calculate and plot stream power along a river profile from mountains to coast.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# River profile: elevation and width from source to sea
distance = np.linspace(0, 1000, 200)  # km

# Elevation profile (concave-up, typical river)
elevation = 4000 * np.exp(-distance / 200)

# Slope (derivative of elevation)
slope = np.abs(np.gradient(elevation, distance * 1000))  # m/m
slope = np.maximum(slope, 1e-6)

# Width increases downstream
width = 10 + 10000 * (distance / 1000)**2  # m

# Discharge increases downstream (tributaries joining)
discharge = 100 + 50000 * (distance / 1000)**1.5  # m3/s

# Stream power calculations
rho = 1000  # kg/m3
g = 9.81    # m/s2
total_power = rho * g * discharge * slope  # W/m
specific_power = total_power / width  # W/m2

fig, axes = plt.subplots(3, 1, figsize=(12, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Elevation profile
ax = axes[0]
ax.set_facecolor('#111827')
ax.fill_between(distance, 0, elevation, alpha=0.3, color='#6b7280')
ax.plot(distance, elevation, color='white', linewidth=2)
ax.set_ylabel('Elevation (m)', color='white')
ax.set_title('River Long Profile: Mountains to Sea', color='white', fontsize=13)
ax.tick_params(colors='gray')

# Mark zones
zones = [(0, 200, 'Mountains', '#ef4444'), (200, 500, 'Foothills', '#f59e0b'),
         (500, 800, 'Plains', '#22c55e'), (800, 1000, 'Delta', '#3b82f6')]
for x1, x2, name, color in zones:
    ax.axvspan(x1, x2, alpha=0.05, color=color)
    ax.text((x1+x2)/2, elevation.max()*0.8, name, ha='center', color=color, fontsize=9)

# Specific stream power
ax = axes[1]
ax.set_facecolor('#111827')
ax.plot(distance, specific_power, color='#f59e0b', linewidth=2)
ax.fill_between(distance, specific_power, alpha=0.15, color='#f59e0b')
ax.axhline(35, color='#ef4444', linestyle='--', alpha=0.5, label='Erosion threshold (35 W/m²)')
ax.axhline(10, color='#22c55e', linestyle='--', alpha=0.5, label='Deposition threshold (10 W/m²)')
ax.set_ylabel('Specific stream\\npower (W/m²)', color='white')
ax.set_yscale('log')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Channel type prediction
ax = axes[2]
ax.set_facecolor('#111827')
channel_type = np.where(specific_power > 35, 2,  # erosion → straight/incising
                np.where(specific_power > 10, 1,   # transport → meandering
                0))  # deposition → braided
colors_map = {0: '#3b82f6', 1: '#22c55e', 2: '#ef4444'}
for i in range(len(distance) - 1):
    ax.fill_between([distance[i], distance[i+1]], 0, 1,
                     color=colors_map[channel_type[i]], alpha=0.7)

ax.set_ylabel('Channel type', color='white')
ax.set_xlabel('Distance from source (km)', color='white')
ax.set_yticks([0.2, 0.5, 0.8])
ax.set_yticklabels(['Braided', 'Meandering', 'Incising'], color='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Stream power predicts channel type:")
print("  Mountains (0-200km): high omega → incising/straight")
print("  Foothills (200-500km): moderate omega → meandering")
print("  Plains (500-800km): low omega → braided")
print("  Delta (800-1000km): very low omega → distributary")
print()
print(f"Brahmaputra at Guwahati: omega ≈ {specific_power[int(0.6*len(distance))]:.1f} W/m²")
print("This confirms: low power = braided channel pattern")`,
      challenge: 'Calculate stream power for the Brahmaputra during monsoon flood (Q = 70,000 m3/s) vs. dry season (Q = 5,000 m3/s). How does the power ratio compare to the discharge ratio?',
      successHint: 'Stream power is the single most useful variable in fluvial geomorphology. It connects hydrology (discharge, slope) to geomorphology (channel form, erosion/deposition). Every river management decision should start with a stream power calculation.',
    },
    {
      title: 'Sediment transport formulas — predicting what rivers carry',
      concept: `Predicting how much sediment a river transports is one of the most important (and difficult) problems in geomorphology. Several formulas exist:

**Bedload transport (particles rolling/sliding along the bed):**
The **Meyer-Peter Muller (MPM) equation** (1948):
**qb = 8 * (tau* - tau*c)^1.5 * sqrt(R * g * D^3)**
- qb = bedload transport rate (m2/s per unit width)
- tau* = dimensionless shear stress = tau / (rho_s - rho) * g * D
- tau*c = critical Shields parameter (~0.047 for sand)
- R = submerged specific gravity (~1.65)
- D = grain diameter (m)

**Suspended load transport:**
The **Rouse equation** gives the vertical concentration profile:
**C(z)/Ca = ((a/z) * (d-z)/(d-a))^Rouse**
- Rouse number = ws / (kappa * u*) where ws = settling velocity, u* = shear velocity, kappa = 0.4
- Low Rouse (<0.8): sediment well-mixed through water column (wash load)
- High Rouse (>2.5): sediment concentrated near bed (bedload)
- The Brahmaputra transports ~90% of its sediment as suspended load

**Total load:**
Combining bed and suspended load gives total sediment transport. For the Brahmaputra: ~735 million tonnes/year (one of the highest on Earth).`,
      analogy: 'Think of sediment transport like traffic on a highway. Bedload is heavy trucks crawling along the road surface (slow, in contact with the bed). Suspended load is cars flying along above the surface (fast, carried by the flow). Wash load is dust in the air (so fine it never settles). The river\'s "speed limit" (shear stress) determines which vehicles can move.',
      storyConnection: 'The fisherman sees the river "carrying the mountains to the sea." This is literally true: 735 million tonnes of Himalayan rock, ground to sand and silt by glaciers and rivers, transported through Assam to the Bay of Bengal each year. The sediment transport formulas quantify this enormous geological conveyor belt.',
      checkQuestion: 'The Shields parameter has a critical value of ~0.047 for sand. What does this mean physically?',
      checkAnswer: 'It means sediment begins to move when the fluid shear stress on the bed exceeds 4.7% of the submerged weight of the particle per unit area. Below this threshold, friction and gravity keep the particle stationary. Above it, the fluid drag overcomes resistance. This dimensionless threshold is remarkably constant across a wide range of sediment sizes — which is why it is so useful.',
      codeIntro: 'Calculate sediment transport rates using the Meyer-Peter Muller equation and Rouse profile.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(15, 6))
fig.patch.set_facecolor('#1f2937')

# Parameters
rho = 1000       # water density
rho_s = 2650     # sediment density
g = 9.81
R = (rho_s - rho) / rho  # submerged specific gravity = 1.65

# 1. Shields curve: critical shear stress vs grain size
ax1.set_facecolor('#111827')
D = np.logspace(-5, -1, 100)  # grain diameter (m)
Re_star = np.sqrt(R * g * D) * D / 1e-6  # particle Reynolds number

# Shields curve (empirical fit)
tau_star_c = np.where(Re_star < 2, 0.14 * Re_star**(-0.64),
             np.where(Re_star < 500, 0.045 * Re_star**(-0.1),
             0.047))

tau_critical = tau_star_c * (rho_s - rho) * g * D  # dimensional (Pa)

ax1.loglog(D * 1000, tau_critical, color='#f59e0b', linewidth=2)
ax1.fill_between(D * 1000, tau_critical, 100, alpha=0.15, color='#ef4444', label='Motion')
ax1.fill_between(D * 1000, 0.001, tau_critical, alpha=0.15, color='#22c55e', label='No motion')

# Mark Brahmaputra typical
ax1.plot(0.2, 0.5, '*', color='white', markersize=15)
ax1.annotate('Brahmaputra\\nbed sand', (0.2, 0.5), xytext=(0.5, 2),
             color='white', fontsize=9, arrowprops=dict(arrowstyle='->', color='white'))

ax1.set_xlabel('Grain size (mm)', color='white')
ax1.set_ylabel('Critical shear stress (Pa)', color='white')
ax1.set_title('Shields Diagram', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# 2. Meyer-Peter Muller: transport rate vs shear stress
ax2.set_facecolor('#111827')
D50 = 0.0002  # 0.2mm sand (Brahmaputra median)
tau_star = np.linspace(0, 0.3, 100)
tau_star_c_val = 0.047

qb = np.where(tau_star > tau_star_c_val,
               8 * (tau_star - tau_star_c_val)**1.5 * np.sqrt(R * g * D50**3),
               0)

ax2.plot(tau_star, qb * 1e6, color='#3b82f6', linewidth=2)  # convert to mm2/s for readability
ax2.fill_between(tau_star, qb * 1e6, alpha=0.15, color='#3b82f6')
ax2.axvline(tau_star_c_val, color='#ef4444', linestyle='--', alpha=0.5)
ax2.text(tau_star_c_val + 0.01, max(qb * 1e6) * 0.8, 'Critical\\nShields', color='#ef4444', fontsize=9)

ax2.set_xlabel('Dimensionless shear stress (τ*)', color='white')
ax2.set_ylabel('Bedload transport (×10⁻⁶ m²/s)', color='white')
ax2.set_title('Meyer-Peter Muller', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# 3. Rouse profile: concentration vs depth
ax3.set_facecolor('#111827')
depth = 10  # m (Brahmaputra typical)
z = np.linspace(0.1, depth, 100)
a = 0.1  # reference height

# Different Rouse numbers (different grain sizes)
rouse_numbers = [0.3, 1.0, 2.5, 5.0]
labels = ['Wash load (clay)', 'Suspended (silt)', 'Mixed (fine sand)', 'Bedload (coarse sand)']
colors_r = ['#a855f7', '#3b82f6', '#f59e0b', '#ef4444']

for Ro, label, color in zip(rouse_numbers, labels, colors_r):
    C_ratio = ((a / z) * (depth - z) / (depth - a)) ** Ro
    C_ratio = np.clip(C_ratio, 0, 10)
    ax3.plot(C_ratio, z, color=color, linewidth=2, label=f'Ro={Ro} ({label})')

ax3.set_xlabel('Relative concentration C(z)/Ca', color='white')
ax3.set_ylabel('Height above bed (m)', color='white')
ax3.set_title('Rouse Profile', color='white', fontsize=11)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax3.tick_params(colors='gray')
ax3.set_xlim(0, 5)

plt.tight_layout()
plt.show()

print("Sediment transport summary:")
print(f"  Brahmaputra D50: {D50*1000}mm (medium sand)")
print(f"  Critical Shields parameter: {tau_star_c_val}")
print()
print("Rouse number interpretation:")
print("  <0.8: wash load (well-mixed, never settles)")
print("  0.8-2.5: suspended load (carried by turbulence)")
print("  >2.5: bedload (rolls/slides along bed)")
print("  Brahmaputra: 90% suspended, 10% bedload")`,
      challenge: 'Calculate the total annual sediment transport for the Brahmaputra using Q=20,000 m3/s, S=0.00008, w=8000m, D50=0.2mm. Does your calculation match the observed 735 Mt/year?',
      successHint: 'Sediment transport equations are imperfect — they can be off by a factor of 2-10 in natural rivers. But they capture the essential physics: transport increases with shear stress (and thus with slope and discharge) and decreases with grain size.',
    },
    {
      title: 'Channel morphology modelling — predicting river shape',
      concept: `River channels are not random shapes — their geometry (width, depth, slope) adjusts to balance the energy of the water against the resistance of the banks and bed. This is the concept of **hydraulic geometry**.

**Leopold and Maddock (1953)** found power-law relationships:
- **Width**: w = a * Q^b (typically b ~ 0.5)
- **Depth**: d = c * Q^f (typically f ~ 0.4)
- **Velocity**: v = k * Q^m (typically m ~ 0.1)
- Constraint: b + f + m = 1 (width × depth × velocity = discharge)

These "at-a-station" relations describe how a channel changes at one location as discharge varies (flood vs. drought). "Downstream" relations describe how channels change along the river's length.

**Regime theory** goes further, predicting the equilibrium channel dimensions:
- **Lacey equations** (1930, developed for Indian canals):
  - P = 4.75 * Q^0.5 (wetted perimeter)
  - R = 0.47 * (Q / f_s)^(1/3) (hydraulic radius, f_s = silt factor)
  - S = 0.0003 * f_s^(5/3) / Q^(1/6) (slope)

These equations were calibrated on Indian rivers including the Brahmaputra's tributaries — they work best for alluvial (sand/silt) channels in the subcontinent.`,
      analogy: 'Hydraulic geometry is like Ohm\'s law for rivers. Ohm\'s law says V = I * R (voltage = current × resistance). For rivers: Energy = Flow × Friction. If you increase flow (discharge), the river adjusts its shape (width, depth) to balance the equation. Just as a wire heats up if you push too much current through it, a river erodes if you push too much water through it.',
      storyConnection: 'The fisherman notices that the river is "wider than any road" in monsoon but becomes "a string of ponds" in winter. Leopold\'s hydraulic geometry explains this precisely: width scales as Q^0.5, so doubling discharge increases width by ~41%. The Brahmaputra\'s discharge varies 14× between seasons, so its width varies ~3.7×.',
      checkQuestion: 'The exponents b + f + m = 1 is a mathematical constraint. What physical principle does it represent?',
      checkAnswer: 'Conservation of mass (continuity equation). Q = w * d * v (discharge = width × depth × velocity). Since Q = a*Q^b * c*Q^f * k*Q^m = (a*c*k) * Q^(b+f+m), the exponents must sum to 1 for the equation to hold. This is the river\'s version of "water in = water out." The channel adjusts its three dimensions (width, depth, velocity) so their product always equals the discharge.',
      codeIntro: 'Plot hydraulic geometry relationships and compare them to Brahmaputra measurements.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hydraulic geometry: w, d, v as functions of Q
Q = np.logspace(1, 5, 100)  # 10 to 100,000 m3/s

# At-a-station coefficients (typical for large alluvial rivers)
a, b = 25, 0.5    # width
c, f = 0.3, 0.4   # depth
k, m = 0.13, 0.1  # velocity

width = a * Q**b
depth = c * Q**f
velocity = k * Q**m

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Width vs Q
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.loglog(Q, width, color='#3b82f6', linewidth=2)
# Brahmaputra observations
brah_Q = [5000, 20000, 50000, 70000]
brah_w = [3000, 6000, 9000, 12000]
ax.scatter(brah_Q, brah_w, color='#f59e0b', s=80, zorder=5, label='Brahmaputra obs.')
ax.set_xlabel('Q (m³/s)', color='white')
ax.set_ylabel('Width (m)', color='white')
ax.set_title(f'Width ~ Q^{b}', color='#3b82f6', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Depth vs Q
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.loglog(Q, depth, color='#22c55e', linewidth=2)
brah_d = [5, 8, 12, 15]
ax.scatter(brah_Q, brah_d, color='#f59e0b', s=80, zorder=5)
ax.set_xlabel('Q (m³/s)', color='white')
ax.set_ylabel('Depth (m)', color='white')
ax.set_title(f'Depth ~ Q^{f}', color='#22c55e', fontsize=11)
ax.tick_params(colors='gray')

# Velocity vs Q
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.loglog(Q, velocity, color='#a855f7', linewidth=2)
brah_v = [0.5, 1.0, 1.5, 1.8]
ax.scatter(brah_Q, brah_v, color='#f59e0b', s=80, zorder=5)
ax.set_xlabel('Q (m³/s)', color='white')
ax.set_ylabel('Velocity (m/s)', color='white')
ax.set_title(f'Velocity ~ Q^{m}', color='#a855f7', fontsize=11)
ax.tick_params(colors='gray')

# Verification: Q = w * d * v
ax = axes[1, 1]
ax.set_facecolor('#111827')
Q_check = width * depth * velocity
ax.loglog(Q, Q, color='white', linewidth=1, linestyle='--', label='Q = Q (perfect)')
ax.loglog(Q, Q_check, color='#ef4444', linewidth=2, label='w × d × v')
ax.set_xlabel('Discharge Q (m³/s)', color='white')
ax.set_ylabel('w × d × v (m³/s)', color='white')
ax.set_title(f'Continuity check: b+f+m = {b+f+m}', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.suptitle('Hydraulic Geometry of a Large Alluvial River', color='white', fontsize=13, y=1.01)
plt.tight_layout()
plt.show()

print("Hydraulic geometry: how the Brahmaputra adjusts to discharge")
print(f"  Width exponent (b): {b} → 'width-adjusting' river")
print(f"  Depth exponent (f): {f}")
print(f"  Velocity exponent (m): {m} → velocity changes least")
print(f"  Sum: {b+f+m} (must equal 1.0)")
print()
print("The Brahmaputra is primarily 'width-adjusting':")
print("  When discharge increases, width changes most.")
print("  This is typical of braided rivers with erodible banks.")`,
      challenge: 'Use the Lacey equations to predict the Brahmaputra\'s equilibrium width for Q=20,000 m3/s and silt factor f_s=1.0. Compare with the observed width of ~6,000m. How close is the prediction?',
      successHint: 'Hydraulic geometry reveals that river channels are self-organising systems. They adjust their shape to efficiently transport water and sediment — like a pipe that designs itself.',
    },
    {
      title: 'Levee and flood plain dynamics — the river\'s breathing',
      concept: `Rivers don't just flow in channels — they periodically spill over onto **floodplains**. This flooding is not a disaster; it is a fundamental geomorphic process that builds landscapes.

**Natural levee formation:**
1. During flood, turbid water spills over the channel banks
2. As soon as water leaves the deep, fast channel, it slows dramatically
3. Coarse sediment (sand) deposits immediately at the channel edge → **natural levee**
4. Fine sediment (silt, clay) travels further onto the floodplain → **backswamp deposits**
5. Over centuries, repeated floods build levees higher and higher
6. Eventually, the channel sits ABOVE the surrounding floodplain (perched channel)
7. A catastrophic flood breaks through the levee → **avulsion** → new channel path

**Floodplain sedimentation rates:**
- Brahmaputra floodplain: 1-5 cm/year
- Mississippi floodplain: 0.1-1 cm/year
- These rates build metres of fertile soil over centuries

**The flood pulse concept:**
Ecologists (Junk et al., 1989) showed that annual flooding is essential:
- Replenishes floodplain fertility (natural fertiliser)
- Connects fish habitats (fish breed in floodplain pools)
- Recharges groundwater
- Maintains biodiversity (wetlands, beels, oxbow lakes)
- In Assam, the annual flood is called "baan" and is both feared and necessary`,
      analogy: 'A river with its floodplain is like a lung. The channel is the bronchial tube. The floodplain is the alveolus (air sac). During "inhalation" (flood), water spreads across the floodplain, exchanging nutrients and sediment. During "exhalation" (recession), water retreats to the channel. This "breathing" is essential for the ecosystem\'s health.',
      storyConnection: 'The fisherman in the story says "the river gives back what it takes." This is the flood pulse in action. The Brahmaputra floods take homes and crops, but they also deposit the fertile silt that makes the Assam valley one of the most productive agricultural regions in India. The rice paddies, tea gardens, and fish ponds all depend on this annual gift.',
      checkQuestion: 'Why do engineers build artificial levees to prevent flooding if natural flooding is beneficial?',
      checkAnswer: 'Because people built cities on floodplains. Natural flooding is ecologically beneficial but economically devastating when houses, factories, and farms are in the way. Artificial levees protect development but at a cost: they disconnect the river from its floodplain, reducing soil fertility, groundwater recharge, and fish habitat. They also worsen downstream flooding (water that would have spread out is instead forced downstream). It is a classic engineering trade-off.',
      codeIntro: 'Model natural levee formation through repeated flood deposition events.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Cross-section of channel + floodplain
distance = np.linspace(-2000, 2000, 400)  # m from channel centre
channel_width = 200  # m

# Initial flat floodplain
elevation = np.zeros_like(distance)
# Channel
channel_mask = np.abs(distance) < channel_width / 2
elevation[channel_mask] = -5  # channel bed

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Simulate flood deposition over multiple events
n_floods = [0, 10, 50, 200]
elev_history = []

elev = elevation.copy()
for flood in range(max(n_floods)):
    # Each flood deposits sediment
    for i, d in enumerate(distance):
        if np.abs(d) < channel_width / 2:
            continue  # no deposition in channel
        # Deposition rate decreases exponentially with distance from channel
        dist_from_bank = np.abs(d) - channel_width / 2
        if dist_from_bank < 0:
            continue
        # Natural levee: coarse sediment near bank
        deposition = 0.05 * np.exp(-dist_from_bank / 200)
        # Add some randomness
        deposition *= (1 + 0.3 * np.random.randn())
        elev[i] += max(0, deposition)

    if flood + 1 in n_floods or flood == 0:
        elev_history.append(elev.copy())

for ax, elev_snap, n in zip(axes.flat, elev_history, n_floods):
    ax.set_facecolor('#111827')
    ax.fill_between(distance, -6, elev_snap, color='#92702a', alpha=0.5)
    ax.plot(distance, elev_snap, color='#d4a574', linewidth=1.5)
    ax.fill_between(distance, -6, -5, where=np.abs(distance) < channel_width/2,
                     color='#3b82f6', alpha=0.5)

    # Water level (varies with flood)
    water_level = -3 if n > 0 else -4
    ax.axhline(water_level, color='#60a5fa', linestyle='--', alpha=0.5, linewidth=0.8)

    ax.set_ylim(-6, max(8, np.max(elev_snap) + 1))
    ax.set_title(f'After {n} floods', color='white', fontsize=11)
    ax.set_ylabel('Elevation (m)', color='white', fontsize=9)
    ax.tick_params(colors='gray')

    if n > 0:
        # Label levees
        levee_idx = np.argmax(elev_snap[len(distance)//2:]) + len(distance)//2
        ax.annotate('levee', (distance[levee_idx], elev_snap[levee_idx]),
                     xytext=(distance[levee_idx]+200, elev_snap[levee_idx]+1),
                     color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

axes[1, 0].set_xlabel('Distance from channel centre (m)', color='white')
axes[1, 1].set_xlabel('Distance from channel centre (m)', color='white')

plt.suptitle('Natural Levee Growth Through Repeated Flooding', color='white', fontsize=13, y=1.01)
plt.tight_layout()
plt.show()

max_levee = np.max(elev_history[-1])
print(f"After {max(n_floods)} floods:")
print(f"  Maximum levee height: {max_levee:.1f}m above floodplain")
print(f"  Levee width: ~400m (exponential decay)")
print()
print("When levees build high enough, the river is 'perched' above")
print("its floodplain. The next major flood can break through (avulsion),")
print("creating an entirely new channel path.")
print()
print("The Brahmaputra has avulsed multiple times in recorded history.")
print("Its current course through Assam is only ~250 years old.")`,
      challenge: 'After 200 floods, break the levee at one point (set elevation to 0). Run 10 more floods. Does sediment fill the breach? Does a new channel form? This is how avulsions create new distributaries in deltas.',
      successHint: 'Levee formation and avulsion are among the most important processes in floodplain geomorphology. They build fertile land, create new channels, and reshape landscapes over centuries — the river rewriting its own geography.',
    },
    {
      title: 'Dam impacts and river restoration — engineering with rivers',
      concept: `Dams are the largest human modification to rivers. Globally, they have profoundly altered sediment transport, flow regimes, and channel morphology.

**Downstream effects of dams:**
1. **Clear-water erosion**: sediment-free releases erode the channel bed (degradation)
2. **Armouring**: fine sediment erodes, leaving a pavement of coarse gravel the flow cannot move
3. **Channel narrowing**: without flood peaks to maintain width, vegetation encroaches
4. **Thermal changes**: deep reservoir releases are colder than natural flow
5. **Ecological disruption**: fish migration blocked, flood pulse eliminated

**Quantified impacts (examples):**
- Colorado River (below Glen Canyon Dam): bed degraded 4m, channel narrowed 50%
- Nile (below Aswan Dam): delta eroding at 5-8 m/year (no new sediment)
- Missouri River: 100+ km of channel straightened for navigation

**River restoration approaches:**
1. **Controlled floods**: releasing artificial flood pulses from dams to maintain channel form
2. **Sediment augmentation**: adding gravel below dams to compensate for trapped supply
3. **Dam removal**: complete restoration (200+ dams removed in the US since 2020)
4. **Setback levees**: moving levees farther from the channel to restore floodplain connectivity
5. **Channel reconstruction**: re-creating meanders in straightened channels

The field of river restoration has grown from fringe science to a multi-billion-dollar industry in 30 years.`,
      analogy: 'A dam on a river is like a tourniquet on an artery. It stops the bleeding (flooding) but also stops nutrient delivery to tissue downstream (sediment, fertility). Leave it on too long and the tissue dies (delta erosion, ecosystem collapse). River restoration is like surgical repair: restoring flow while managing the damage the tourniquet caused.',
      storyConnection: 'The fisherman\'s Brahmaputra is one of the last great undammed rivers on Earth. This makes it invaluable — both as a living laboratory for understanding natural river processes and as a warning of what could be lost if large dams are built upstream. The story\'s river is a rare surviving example of how rivers used to be.',
      checkQuestion: 'Over 200 dams have been removed in the US since 2020. Why remove a dam you spent millions building?',
      checkAnswer: 'Many old dams (built in the 1800-1900s) no longer serve their original purpose (mills, small hydropower) but continue to block fish migration, trap sediment, and degrade water quality. The cost of maintaining an aging dam often exceeds the benefit. Removal restores the river ecosystem, salmon runs, and sediment supply. The Elwha Dam removal in Washington (2011-2014) restored 70 miles of salmon habitat within 3 years.',
      codeIntro: 'Model channel evolution before and after dam construction, and compare with restoration scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = np.arange(0, 100)

# Pre-dam equilibrium
pre_dam = {
    'bed_level': np.zeros(100),  # metres relative to initial
    'width': np.full(100, 500.0),
    'sed_supply': np.full(100, 100.0),  # Mt/yr
    'braiding_index': np.full(100, 3.0),
}

# Scenario 1: Dam at year 20, no mitigation
dam_year = 20
bed_1 = np.where(years < dam_year, 0,
                  -4 * (1 - np.exp(-0.05 * (years - dam_year))))
width_1 = np.where(years < dam_year, 500,
                    500 * np.exp(-0.01 * (years - dam_year)))
sed_1 = np.where(years < dam_year, 100,
                  100 * np.exp(-0.05 * (years - dam_year)) + 10)
braid_1 = np.where(years < dam_year, 3.0,
                    3.0 * np.exp(-0.03 * (years - dam_year)) + 0.5)

# Scenario 2: Dam + controlled floods + sediment augmentation (at year 40)
restore_year = 40
bed_2 = bed_1.copy()
width_2 = width_1.copy()
for i in range(restore_year, 100):
    bed_2[i] = bed_1[restore_year] + 0.5 * (1 - np.exp(-0.03 * (i - restore_year)))
    width_2[i] = width_1[restore_year] + 50 * (1 - np.exp(-0.02 * (i - restore_year)))

# Scenario 3: Dam removal at year 40
bed_3 = bed_1.copy()
width_3 = width_1.copy()
for i in range(restore_year, 100):
    bed_3[i] = bed_1[restore_year] + (0 - bed_1[restore_year]) * (1 - np.exp(-0.04 * (i - restore_year)))
    width_3[i] = width_1[restore_year] + (500 - width_1[restore_year]) * (1 - np.exp(-0.03 * (i - restore_year)))

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Bed level
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(years, np.zeros(100), '--', color='gray', alpha=0.3, label='Natural')
ax.plot(years, bed_1, color='#ef4444', linewidth=2, label='Dam only')
ax.plot(years, bed_2, color='#f59e0b', linewidth=2, label='Dam + restore')
ax.plot(years, bed_3, color='#22c55e', linewidth=2, label='Dam removed')
ax.axvline(dam_year, color='gray', linestyle=':', alpha=0.3)
ax.axvline(restore_year, color='gray', linestyle=':', alpha=0.3)
ax.set_ylabel('Bed level change (m)', color='white')
ax.set_title('Channel Bed Degradation', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Width
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(years, np.full(100, 500), '--', color='gray', alpha=0.3)
ax.plot(years, width_1, color='#ef4444', linewidth=2)
ax.plot(years, width_2, color='#f59e0b', linewidth=2)
ax.plot(years, width_3, color='#22c55e', linewidth=2)
ax.axvline(dam_year, color='gray', linestyle=':', alpha=0.3)
ax.axvline(restore_year, color='gray', linestyle=':', alpha=0.3)
ax.set_ylabel('Channel width (m)', color='white')
ax.set_title('Channel Narrowing', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Sediment supply
ax = axes[1, 0]
ax.set_facecolor('#111827')
sed_2b = sed_1.copy()
sed_2b[restore_year:] = sed_1[restore_year:] + 30  # augmentation
sed_3b = sed_1.copy()
sed_3b[restore_year:] = 100 * (1 - np.exp(-0.05 * (years[restore_year:] - restore_year))) + sed_1[restore_year]
sed_3b = np.clip(sed_3b, 0, 100)

ax.plot(years, np.full(100, 100), '--', color='gray', alpha=0.3)
ax.plot(years, sed_1, color='#ef4444', linewidth=2)
ax.plot(years, sed_2b, color='#f59e0b', linewidth=2)
ax.plot(years, sed_3b, color='#22c55e', linewidth=2)
ax.axvline(dam_year, color='gray', linestyle=':', alpha=0.3)
ax.axvline(restore_year, color='gray', linestyle=':', alpha=0.3)
ax.set_ylabel('Sediment supply (Mt/yr)', color='white')
ax.set_xlabel('Year', color='white')
ax.set_title('Downstream Sediment Supply', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Recovery time comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Recovery index: how close to natural (0=fully impacted, 1=fully recovered)
recovery_1 = 1 - np.abs(bed_1 / bed_1.min())
recovery_2 = 1 - np.abs(bed_2 / bed_1.min())
recovery_3 = 1 - np.abs(bed_3 / bed_1.min())

ax.plot(years, recovery_1, color='#ef4444', linewidth=2, label='No restoration')
ax.plot(years, recovery_2, color='#f59e0b', linewidth=2, label='Managed restoration')
ax.plot(years, recovery_3, color='#22c55e', linewidth=2, label='Dam removal')
ax.axvline(dam_year, color='gray', linestyle=':', alpha=0.3)
ax.axvline(restore_year, color='gray', linestyle=':', alpha=0.3)
ax.set_ylabel('Recovery index (0-1)', color='white')
ax.set_xlabel('Year', color='white')
ax.set_title('Ecosystem Recovery', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

plt.suptitle('River Response to Damming and Restoration', color='white', fontsize=13, y=1.01)
plt.tight_layout()
plt.show()

print("Three futures for a dammed river:")
print("  1. No action: bed degrades 4m, width narrows 50%, ecosystem collapses")
print("  2. Managed restoration: partial recovery, expensive, indefinite maintenance")
print("  3. Dam removal: full recovery in 20-40 years, cheapest long-term")
print()
print("The Brahmaputra's undammed state is increasingly rare and precious.")
print("Protecting it requires understanding both the science and the politics.")`,
      challenge: 'Add a fourth scenario: cascade dams (3 dams built over 30 years). How do cumulative impacts differ from a single dam? This is the reality facing the Brahmaputra as China plans multiple dams on the Yarlung Tsangpo.',
      successHint: 'River restoration engineering represents the synthesis of everything in this module: stream power, sediment transport, channel morphology, and flood dynamics. Understanding the physics is essential for managing rivers sustainably — whether that means building dams carefully or removing them entirely.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Deep Dive
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Fluvial Geomorphology</span>
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
