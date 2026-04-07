import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MajuliLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Fluvial geomorphology — how rivers shape landscapes',
      concept: `Fluvial geomorphology is the study of how flowing water shapes the Earth\'s surface. The Brahmaputra is one of the world's great geomorphic engines — it moves approximately 735 million tonnes of sediment per year, more than almost any other river.

**Stream power**: The ability of a river to erode and transport sediment is governed by stream power: P = rho * g * Q * S, where rho is water density (1000 kg/m^3), g is gravity (9.81 m/s^2), Q is discharge (m^3/s), and S is channel slope. The Brahmaputra has enormous discharge (average ~20,000 m^3/s, peak monsoon ~100,000 m^3/s) but a very gentle slope (~0.0001 m/m in Assam). Despite the low slope, the sheer volume of water creates massive stream power.

**Sediment transport**: Sediment moves in two ways. **Bed load** consists of sand and gravel rolling and bouncing along the bottom — this is what builds bars and islands. **Suspended load** consists of fine silt and clay carried within the water column — this is what makes the Brahmaputra appear brown. The Brahmaputra carries approximately 400 million tonnes of suspended sediment and 335 million tonnes of bed load annually.

**Shields parameter**: Whether a particular sediment grain moves depends on the ratio of flow force to grain weight, expressed as the Shields parameter: theta = tau / ((rho_s - rho) * g * d), where tau is bed shear stress, rho_s is sediment density (~2650 kg/m^3 for quartz), and d is grain diameter. When theta exceeds a critical value (~0.045-0.06 for sand), the grain begins to move. During monsoon floods, the Brahmaputra's shear stress exceeds critical Shields stress for grains up to cobble size.

**Channel patterns**: Rivers adopt different planform patterns depending on slope, discharge, and sediment load. The Brahmaputra in Assam is a classic **braided river** — multiple channels separated by mid-channel bars and islands. Braiding occurs when: (1) sediment supply exceeds transport capacity (leading to deposition), (2) banks are erodible (the alluvial plain offers little resistance), and (3) discharge is highly variable (monsoon floods rework channels annually). Majuli island exists because it sits in the most actively braided reach of the Brahmaputra.`,
      analogy: 'A braided river is like a highway during construction — traffic (water) is forced to split around work zones (sediment bars) and merge again, with the lanes (channels) constantly shifting. During rush hour (monsoon), new lanes open and old ones close. Majuli island is like a large median strip — it separates traffic but is constantly being nibbled by the flow on both sides.',
      storyConnection: 'The story of how Majuli island was born begins with the great Brahmaputra changing course. In geological terms, the Brahmaputra\'s main channel shifted southward in the 1750 earthquake, cutting off a section of the floodplain that became Majuli. The island\'s birth was literally a geomorphic event — a braided river reorganizing its channels after a tectonic disturbance. The same forces that created Majuli are now slowly eroding it.',
      checkQuestion: 'The Brahmaputra\'s discharge increases from 20,000 m^3/s in winter to 100,000 m^3/s during monsoon, while the slope stays approximately the same. By what factor does stream power increase during monsoon?',
      checkAnswer: 'Stream power P = rho * g * Q * S. Since rho, g, and S are constant, the ratio is simply Q_monsoon / Q_winter = 100,000 / 20,000 = 5. Stream power increases by a factor of 5 during monsoon. This means the river\'s ability to erode banks and transport sediment is 5 times greater — which is why most of Majuli\'s erosion occurs during the June-September monsoon season.',
      codeIntro: 'Model the Brahmaputra\'s stream power, sediment transport capacity, and the Shields parameter for different flow conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Brahmaputra River Parameters ---
rho_water = 1000    # kg/m^3
rho_sed = 2650      # kg/m^3 (quartz sand)
g = 9.81            # m/s^2
slope = 0.0001      # m/m (very gentle in Assam)
channel_width = 5000  # m (average, braided reach)

# Monthly discharge data (approximate, m^3/s)
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
discharge = [8000, 6000, 7000, 15000, 30000, 60000,
             80000, 100000, 70000, 35000, 15000, 10000]

# --- Calculations ---
# Stream power (watts per meter of channel width)
stream_power = [rho_water * g * Q * slope for Q in discharge]
specific_stream_power = [P / channel_width for P in stream_power]

# Bed shear stress: tau = rho * g * R * S, where R ~ depth
# Approximate depth from Q = w * d * v, assuming v ~ 2 m/s average
depths = [Q / (channel_width * 2.0) for Q in discharge]
shear_stress = [rho_water * g * d * slope for d in depths]

# Shields parameter for different grain sizes
grain_sizes_mm = [0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 50.0]  # mm
critical_shields = 0.05

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Brahmaputra Fluvial Geomorphology', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Discharge and stream power
ax = axes[0, 0]
ax2 = ax.twinx()
bars = ax.bar(months, np.array(discharge)/1000, color='#3b82f6', alpha=0.7,
              label='Discharge', edgecolor='none')
ax2.plot(months, np.array(specific_stream_power), color='#ef4444', linewidth=2.5,
         marker='o', markersize=6, label='Specific stream power')
ax.set_ylabel('Discharge (\×10\³ m\³/s)', color='#3b82f6', fontsize=10)
ax2.set_ylabel('Stream power (W/m)', color='#ef4444', fontsize=10)
ax.set_title('Monthly discharge & stream power', color='white', fontsize=12)
ax.tick_params(axis='x', labelcolor='white', labelsize=8)
ax2.tick_params(colors='gray')
ax.legend(loc='upper left', fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.legend(loc='upper right', fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Shear stress and sediment mobility
ax = axes[0, 1]
ax.bar(months, shear_stress, color='#f59e0b', edgecolor='none', alpha=0.8)

# Critical shear stress for medium sand (0.5 mm)
d = 0.5e-3  # m
tau_critical = critical_shields * (rho_sed - rho_water) * g * d
ax.axhline(y=tau_critical, color='#22c55e', linestyle='--', linewidth=2,
           label=f'Critical for 0.5mm sand ({tau_critical:.3f} Pa)')

# Critical for gravel (10 mm)
d_gravel = 10e-3
tau_gravel = critical_shields * (rho_sed - rho_water) * g * d_gravel
ax.axhline(y=tau_gravel, color='#ef4444', linestyle='--', linewidth=2,
           label=f'Critical for 10mm gravel ({tau_gravel:.2f} Pa)')

ax.set_ylabel('Bed shear stress (Pa)', color='white', fontsize=11)
ax.set_title('Shear stress: what can the river move?', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(axis='x', labelcolor='white', labelsize=8)

# Plot 3: Shields parameter across grain sizes (monsoon vs dry)
ax = axes[1, 0]
grain_d = np.logspace(-4, -1, 100)  # 0.1 mm to 100 mm in meters

for month_idx, month_name, color in [(1, 'Feb (low)', '#3b82f6'),
                                      (5, 'Jun (rising)', '#f59e0b'),
                                      (7, 'Aug (peak)', '#ef4444')]:
    tau = shear_stress[month_idx]
    shields = tau / ((rho_sed - rho_water) * g * grain_d)
    ax.loglog(grain_d * 1000, shields, color=color, linewidth=2, label=month_name)

ax.axhline(y=critical_shields, color='#22c55e', linestyle='--', linewidth=2,
           label=f'Critical Shields ({critical_shields})')
ax.fill_between(grain_d * 1000, critical_shields, 100, alpha=0.05, color='#22c55e')
ax.set_xlabel('Grain diameter (mm)', color='white', fontsize=11)
ax.set_ylabel('Shields parameter', color='white', fontsize=11)
ax.set_title('Sediment mobility by grain size & season', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0.1, 100)
ax.set_ylim(0.001, 100)
ax.text(0.5, 10, 'MOBILE', color='#22c55e', fontsize=12, alpha=0.5)
ax.text(50, 0.005, 'STABLE', color='#ef4444', fontsize=12, alpha=0.5)

# Plot 4: Sediment budget
ax = axes[1, 1]
categories = ['Suspended\\nload', 'Bed load', 'Bank\\nerosion', 'Flood\\ndeposition', 'Net island\\nloss']
values = [400, 335, 150, -120, -30]  # million tonnes/year
colors_budget = ['#3b82f6', '#f59e0b', '#ef4444', '#22c55e', '#a855f7']
bars = ax.bar(categories, values, color=colors_budget, edgecolor='none', width=0.6)
ax.axhline(y=0, color='white', linewidth=0.5, alpha=0.5)
for bar, v in zip(bars, values):
    y = v + 10 if v > 0 else v - 20
    ax.text(bar.get_x() + bar.get_width()/2, y, f'{v:+d}',
            ha='center', color='white', fontsize=9)
ax.set_ylabel('Million tonnes / year', color='white', fontsize=11)
ax.set_title('Brahmaputra sediment budget', color='white', fontsize=12)
ax.tick_params(axis='x', labelcolor='white', labelsize=8)

plt.tight_layout()
plt.show()

print("Brahmaputra Fluvial Geomorphology Summary")
print("=" * 55)
print(f"Annual discharge range: {min(discharge):,} - {max(discharge):,} m^3/s")
print(f"Monsoon/dry ratio: {max(discharge)/min(discharge):.1f}x")
print(f"Peak stream power: {max(specific_stream_power):.1f} W/m")
print(f"Peak shear stress: {max(shear_stress):.3f} Pa")
print()
print("Sediment mobility (August peak):")
for d_mm in [0.1, 0.5, 2.0, 10.0, 50.0]:
    d_m = d_mm / 1000
    shields = max(shear_stress) / ((rho_sed - rho_water) * g * d_m)
    mobile = "MOBILE" if shields > critical_shields else "STABLE"
    print(f"  {d_mm:5.1f} mm: Shields = {shields:.3f} -> {mobile}")`,
      challenge: 'Add a velocity profile plot showing how flow velocity varies with depth (logarithmic profile: v(z) = (u*/kappa) * ln(z/z0), where u* is shear velocity, kappa=0.41, z0=grain_size/30). Show how near-bed velocities during monsoon compare to dry season.',
      successHint: 'You now understand the fundamental physics: the Brahmaputra is a sediment transport machine. Its braided pattern and the creation of islands like Majuli are direct consequences of enormous sediment loads meeting a gentle valley floor.',
    },
    {
      title: 'Braided channel dynamics — why the Brahmaputra splits and shifts',
      concept: `The Brahmaputra in Assam is one of the world's widest braided rivers, with a braidplain up to 18 km wide. Understanding braiding mechanics is essential to understanding Majuli's fate.

**Braiding index**: The braiding index (BI) measures how many active channels exist at a cross-section. The Brahmaputra's BI ranges from 2-5 in the dry season to 8-15 during monsoon floods. Higher BI means more channels, more bars, and more erosion potential along island margins.

**Bar formation**: Mid-channel bars form when sediment supply exceeds local transport capacity. A flow obstruction (a large boulder, a tree trunk, or even a turbulent eddy) causes a local reduction in velocity, depositing sediment. Once a bar begins, it creates its own flow shadow, trapping more sediment — a positive feedback loop. Bars grow until the flow splits around them, creating two channels.

**Channel avulsion**: The most dramatic geomorphic events are **avulsions** — sudden shifts of the entire channel to a new course. The Brahmaputra undergoes major avulsions every few decades. The 1950 Assam earthquake (M8.6) caused massive landslides that dumped billions of tonnes of sediment into tributaries, raising the Brahmaputra's bed by 2-3 meters and triggering avulsions that reshaped the braided belt. Majuli's western bank has retreated dramatically since the 1950s, largely due to channel migration triggered by this post-earthquake sediment pulse.

**Bank erosion mechanisms**: Banks fail through three mechanisms: (1) **Hydraulic erosion** — flowing water removes grains directly from the bank face. (2) **Mass failure** — the bank is undercut by hydraulic erosion until the overhanging block collapses under its own weight. (3) **Seepage erosion** — groundwater flowing out of the bank carries fine particles with it, weakening the bank from within. On Majuli, all three mechanisms are active, with mass failure being the most destructive during monsoon.`,
      analogy: 'A braided river is like a crowd exiting a stadium through multiple doors. When everyone pushes through one door (channel), it gets congested (sediment builds up). People naturally split to find less crowded doors (new channels form). Sometimes an entire section of exits gets blocked (avulsion), and the crowd surges to a completely different part of the building. The stadium itself (the floodplain) gets worn down by all the foot traffic (erosion).',
      storyConnection: 'The story describes how the river that created Majuli is also destroying it — the same braided dynamics that deposited the sediment forming the island are now eroding its banks. The elders remember when the island was much larger, when entire villages were swallowed by the river. This is not metaphor: satellite imagery shows Majuli has lost over 50% of its area since the 1950s, and the rate of erosion correlates directly with channel migration patterns in the braided belt.',
      checkQuestion: 'After the 1950 earthquake, the Brahmaputra\'s bed rose 2-3 meters due to landslide sediment. How would this bed aggradation affect the braiding index and erosion rates on Majuli?',
      checkAnswer: 'Bed aggradation (raising) reduces the channel\'s cross-sectional area, forcing the same discharge through a shallower, wider channel. This increases the braiding index because the flow is more likely to split around newly deposited bars. Higher BI means more channels and more erosion along island margins. Additionally, a raised bed means flood waters spread wider and reach higher elevations, increasing the area subject to erosion. The post-1950 acceleration of Majuli\'s erosion is directly linked to this bed aggradation. The sediment pulse is still working through the system 70+ years later.',
      codeIntro: 'Simulate braided channel dynamics showing bar formation, channel migration, and bank erosion over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def simulate_braided_river(width=200, length=400, n_steps=100,
                           discharge=1.0, sediment_supply=0.8):
    """Simple cellular automaton model of braided river dynamics."""
    # Grid represents bed elevation
    bed = np.zeros((width, length))

    # Initial channel: slightly lower in the center
    center = width // 2
    for x in range(length):
        bed[center-10:center+10, x] = -2.0  # initial channel

    # Add some initial topographic noise
    bed += np.random.normal(0, 0.3, bed.shape)

    # Water depth grid
    water_level = -1.0  # constant water surface (simplified)
    snapshots = [bed.copy()]

    for step in range(n_steps):
        # 1. Erosion: water erodes where it flows (depth > 0)
        water_depth = np.maximum(water_level - bed, 0)
        flowing = water_depth > 0.2  # threshold for flow

        # Erosion proportional to discharge and local depth
        erosion = flowing.astype(float) * discharge * 0.02 * water_depth
        bed -= erosion

        # 2. Deposition: sediment deposits where flow slows
        # Flow slows at channel edges and behind bars
        for x in range(1, length - 1):
            for y in range(1, width - 1):
                if flowing[y, x]:
                    # Check for velocity decrease (flow expansion)
                    neighbors_flowing = (flowing[y-1, x].astype(int) +
                                        flowing[y+1, x].astype(int) +
                                        flowing[y, x-1].astype(int) +
                                        flowing[y, x+1].astype(int))
                    if neighbors_flowing < 3:  # channel edge
                        bed[y, x] += sediment_supply * 0.01

        # 3. Bank collapse: steep banks fail
        for x in range(1, length - 1):
            for y in range(1, width - 1):
                slope_y = abs(bed[y+1, x] - bed[y-1, x]) / 2
                if slope_y > 1.5:  # critical slope
                    # Collapse: average with neighbors
                    bed[y, x] = (bed[y-1, x] + bed[y, x] + bed[y+1, x]) / 3

        # 4. Random perturbations (representing turbulence, debris)
        n_perturb = int(10 * sediment_supply)
        for _ in range(n_perturb):
            py = np.random.randint(10, width - 10)
            px = np.random.randint(10, length - 10)
            bed[py-1:py+1, px-1:px+1] += np.random.normal(0.2, 0.1)

        # Water level rises slightly during "monsoon" steps
        if step % 20 < 5:  # monsoon pulse
            water_level = -0.3
            discharge = 2.0
        else:
            water_level = -1.0
            discharge = 1.0

        if step % 25 == 0:
            snapshots.append(bed.copy())

    return snapshots

# Run simulation
snapshots = simulate_braided_river(width=150, length=300, n_steps=100)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Braided River Channel Dynamics Simulation', color='white', fontsize=14, fontweight='bold')

titles = ['Initial', 'After 25 steps', 'After 50 steps',
          'After 75 steps', 'After 100 steps', 'Channel migration']

for idx in range(min(5, len(snapshots))):
    ax = axes.flat[idx]
    ax.set_facecolor('#111827')
    im = ax.imshow(snapshots[idx], cmap='terrain', aspect='auto',
                   vmin=-3, vmax=2)
    ax.set_title(titles[idx], color='white', fontsize=11)
    ax.set_xlabel('Downstream', color='white', fontsize=9)
    ax.set_ylabel('Cross-stream', color='white', fontsize=9)
    ax.tick_params(colors='gray')

# Panel 6: Cross-section evolution
ax = axes.flat[5]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
cross_x = 150  # midpoint downstream
for idx, (snap, color, label) in enumerate(zip(
    [snapshots[0], snapshots[2], snapshots[-1]],
    ['#3b82f6', '#f59e0b', '#ef4444'],
    ['Initial', 'Mid-simulation', 'Final'])):
    cross_section = snap[:, cross_x]
    ax.plot(cross_section, color=color, linewidth=2, label=label)

ax.axhline(y=-1.0, color='cyan', linestyle='--', alpha=0.5, label='Water level (dry)')
ax.axhline(y=-0.3, color='cyan', linestyle=':', alpha=0.3, label='Water level (flood)')
ax.set_xlabel('Cross-stream position', color='white')
ax.set_ylabel('Bed elevation', color='white')
ax.set_title('Cross-section evolution at midpoint', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.invert_yaxis()

plt.tight_layout()
plt.show()

# Quantify changes
initial = snapshots[0]
final = snapshots[-1]
erosion_volume = np.sum(np.maximum(initial - final, 0))
deposition_volume = np.sum(np.maximum(final - initial, 0))

print("Braided River Simulation Results")
print("=" * 55)
print(f"Grid: {initial.shape[0]} x {initial.shape[1]} cells")
print(f"Simulation: 100 time steps (4 monsoon cycles)")
print()
print(f"Total erosion volume: {erosion_volume:.0f} (grid units)")
print(f"Total deposition volume: {deposition_volume:.0f} (grid units)")
print(f"Net change: {deposition_volume - erosion_volume:+.0f} (grid units)")
print()
print("Key observations:")
print("  - Channels migrate laterally between monsoon pulses")
print("  - Bars form at flow expansions and channel junctions")
print("  - Bank erosion is concentrated during high-flow periods")
print("  - The river reworks its entire width over ~100 time steps")`,
      challenge: 'Add an "island" (elevated block) in the center of the river and track how it erodes over time. Measure the area loss per time step and determine whether the erosion rate is constant, accelerating, or decelerating. Relate your findings to Majuli\'s observed erosion pattern.',
      successHint: 'You have simulated the fundamental process that governs Majuli\'s fate: a braided river constantly reworking its bed and banks. The key insight is that braided rivers are inherently unstable — they never reach a static equilibrium.',
    },
    {
      title: 'Island formation and erosion — Majuli\'s sediment budget',
      concept: `Majuli's existence depends on the balance between sediment deposition (which builds the island) and erosion (which removes it). This balance — the **sediment budget** — determines whether the island grows, shrinks, or maintains its size.

**Formation**: Majuli formed as a large mid-channel bar/island through sediment deposition in the braided Brahmaputra. The 1750 earthquake shifted the Brahmaputra's main channel southward, isolating a section of the northern floodplain. This created Majuli as a distinct island bounded by the Brahmaputra to the south and the Subansiri/Luit tributaries to the north.

**Erosion rates**: Satellite imagery analysis (Landsat, 1973-2023) shows Majuli has lost approximately 50% of its area over 50 years. The peak erosion rate was 1.5-2.0 km^2/year in the 1990s. Current rates are approximately 0.8-1.2 km^2/year. The erosion is concentrated on the southern and western banks facing the main Brahmaputra channel.

**Deposition vs erosion**: Some sediment is deposited on the island's northern and eastern margins, partially offsetting erosion. However, the deposition rate (approximately 0.2-0.4 km^2/year) is much less than the erosion rate, resulting in a net loss. The island is shrinking.

**Monsoon pulse**: Over 80% of annual erosion occurs during the June-September monsoon. Peak erosion correlates with peak discharge — the river's shear stress exceeds the critical value for bank material (silt, clay, fine sand) during high flows. A single large flood event can remove 10-50 meters of bank in a day.

**Human impact**: Upstream dams, deforestation, and sand mining alter the sediment budget. Dams trap sediment (reducing deposition downstream), deforestation increases runoff (increasing erosion), and sand mining removes material that would otherwise be deposited. India's proposed mega-dams on the Brahmaputra could significantly alter Majuli's sediment balance.`,
      analogy: 'Majuli\'s sediment budget is like a bank account. Deposition is income (sediment deposited by the river). Erosion is spending (sediment removed by the river). If spending exceeds income every year, the account balance (island area) decreases. The island is currently "spending" about 3-4 times more sediment than it "earns." At this rate, it will go "bankrupt" — unless the income increases (more deposition) or spending decreases (erosion protection).',
      storyConnection: 'The story laments that Majuli is "the island that is disappearing." Each monsoon, villages relocate inland as the banks crumble. The fields where grandparents farmed are now river bed. This is not a slow, abstract process — it is the lived experience of 170,000 people watching their homeland shrink by a football field per week during monsoon. Our sediment budget analysis puts precise numbers on this loss.',
      checkQuestion: 'If Majuli\'s current area is approximately 350 km^2 and the net erosion rate is 0.8 km^2/year, how many years until the island disappears entirely? Why is this simple calculation misleading?',
      checkAnswer: 'Simple calculation: 350 / 0.8 = 437.5 years. But this is misleading for three reasons. First, erosion rate is not constant — it may accelerate as the island narrows (less bank length but more exposed to main channel flow) or decelerate (as the most erodible margins are already gone and harder core material remains). Second, the island may fragment into smaller islands rather than disappearing uniformly. Third, interventions (embankments, dam construction upstream) may change the sediment budget. A more realistic assessment uses a dynamic model that accounts for feedback between island shape and erosion rate.',
      codeIntro: 'Model Majuli\'s sediment budget from historical satellite-derived area measurements and project future island area under different scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Historical Majuli area data (approximate, from satellite imagery) ---
years_hist = np.array([1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2024])
area_hist = np.array([880, 750, 650, 530, 450, 400, 370, 355, 348])  # km^2

# Derived erosion rates
erosion_rates = -np.diff(area_hist) / np.diff(years_hist)  # km^2/year

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Majuli Island: Sediment Budget & Area Change Analysis',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Historical area with projections
ax = axes[0, 0]
ax.plot(years_hist, area_hist, 'o-', color='#3b82f6', linewidth=2.5,
        markersize=8, label='Observed (satellite)')

# Fit exponential decay
from_1950 = years_hist - 1950
# ln(A) = ln(A0) - k*t
coeffs = np.polyfit(from_1950, np.log(area_hist), 1)
k_decay = -coeffs[0]
A0_fit = np.exp(coeffs[1])

# Project forward
years_proj = np.arange(2024, 2125)
t_proj = years_proj - 1950

# Scenario 1: Current trend continues
area_trend = A0_fit * np.exp(-k_decay * t_proj)

# Scenario 2: Erosion protection (50% reduction in erosion rate)
area_protected = np.zeros_like(t_proj, dtype=float)
area_protected[0] = area_hist[-1]
for i in range(1, len(t_proj)):
    rate = k_decay * area_protected[i-1] * 0.5  # 50% erosion reduction
    area_protected[i] = area_protected[i-1] - rate

# Scenario 3: Upstream dam (reduced sediment, accelerated erosion)
area_dam = np.zeros_like(t_proj, dtype=float)
area_dam[0] = area_hist[-1]
for i in range(1, len(t_proj)):
    rate = k_decay * area_dam[i-1] * 1.3  # 30% more erosion
    area_dam[i] = area_dam[i-1] - rate

ax.plot(years_proj, area_trend, '--', color='#f59e0b', linewidth=2, label='Trend (exponential decay)')
ax.plot(years_proj, area_protected, '--', color='#22c55e', linewidth=2, label='With erosion protection')
ax.plot(years_proj, area_dam, '--', color='#ef4444', linewidth=2, label='With upstream dam')
ax.axhline(y=100, color='white', linestyle=':', alpha=0.3, label='Critical area (100 km\²)')
ax.set_xlabel('Year', color='white', fontsize=11)
ax.set_ylabel('Island area (km\²)', color='white', fontsize=11)
ax.set_title('Majuli area: history & projections', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(1945, 2125)

# Plot 2: Erosion rate over time
ax = axes[0, 1]
mid_years = (years_hist[:-1] + years_hist[1:]) / 2
ax.bar(mid_years, erosion_rates, width=8, color='#ef4444', edgecolor='none', alpha=0.8)
ax.set_xlabel('Year', color='white', fontsize=11)
ax.set_ylabel('Erosion rate (km\²/year)', color='white', fontsize=11)
ax.set_title('Decadal erosion rates', color='white', fontsize=12)
for x, y in zip(mid_years, erosion_rates):
    ax.text(x, y + 0.3, f'{y:.1f}', ha='center', color='white', fontsize=8)

# Annotate key events
ax.annotate('1950 earthquake\\nsediment pulse', xy=(1955, erosion_rates[0]),
            xytext=(1965, erosion_rates[0]+3), color='#f59e0b', fontsize=8,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Plot 3: Monthly sediment budget
ax = axes[1, 0]
month_names = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
# Monthly erosion (proportional to discharge)
monthly_erosion = np.array([0.02, 0.01, 0.02, 0.05, 0.10, 0.18, 0.22, 0.20, 0.12, 0.05, 0.02, 0.01])
# Monthly deposition (some lag behind discharge peak)
monthly_deposition = np.array([0.01, 0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.05, 0.03, 0.01, 0.01])

x_months = np.arange(12)
ax.bar(x_months - 0.15, -monthly_erosion, 0.3, color='#ef4444', label='Erosion', edgecolor='none')
ax.bar(x_months + 0.15, monthly_deposition, 0.3, color='#22c55e', label='Deposition', edgecolor='none')
net = monthly_deposition - monthly_erosion
ax.plot(x_months, net, 'o-', color='#f59e0b', linewidth=2, label='Net change')
ax.axhline(y=0, color='white', linewidth=0.5, alpha=0.5)
ax.set_xticks(x_months)
ax.set_xticklabels(month_names, color='white')
ax.set_ylabel('Area change (km\²/month)', color='white', fontsize=10)
ax.set_title('Monthly sediment budget (erosion vs deposition)', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Spatial distribution of erosion
ax = axes[1, 1]
# Simplified island outline (approximate polygon)
theta = np.linspace(0, 2*np.pi, 100)
# Elliptical approximation of Majuli
a, b = 30, 8  # km semi-axes
island_x = a * np.cos(theta)
island_y = b * np.sin(theta)

# Erosion hotspots (southern and western banks)
erosion_hotspot_x = a * np.cos(np.linspace(np.pi*0.6, np.pi*1.4, 50))
erosion_hotspot_y = b * np.sin(np.linspace(np.pi*0.6, np.pi*1.4, 50))

# Deposition areas (northern bank)
dep_x = a * np.cos(np.linspace(-np.pi*0.3, np.pi*0.3, 30))
dep_y = b * np.sin(np.linspace(-np.pi*0.3, np.pi*0.3, 30))

ax.fill(island_x, island_y, color='#78350f', alpha=0.5, label='Current island')
# Erosion zone
for i in range(len(erosion_hotspot_x)):
    ax.plot(erosion_hotspot_x[i], erosion_hotspot_y[i], 's', color='#ef4444',
            markersize=3, alpha=0.6)
# Deposition zone
for i in range(len(dep_x)):
    ax.plot(dep_x[i], dep_y[i] + 0.5, '^', color='#22c55e',
            markersize=3, alpha=0.6)

# Historical outline (larger)
ax.plot(1.4*island_x, 1.3*island_y, '--', color='#f59e0b', linewidth=1.5,
        alpha=0.5, label='1950 outline (approx)')

# Flow direction
ax.annotate('', xy=(20, -12), xytext=(-20, -12),
            arrowprops=dict(arrowstyle='->', color='#3b82f6', lw=2))
ax.text(0, -14, 'Brahmaputra flow direction', color='#3b82f6',
        fontsize=9, ha='center')

ax.set_xlabel('East-West (km)', color='white')
ax.set_ylabel('North-South (km)', color='white')
ax.set_title('Spatial erosion pattern', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_aspect('equal')
ax.set_xlim(-45, 45)
ax.set_ylim(-18, 18)

plt.tight_layout()
plt.show()

print("Majuli Sediment Budget Analysis")
print("=" * 55)
print(f"Historical area: {area_hist[0]} km^2 (1950) -> {area_hist[-1]} km^2 (2024)")
print(f"Total loss: {area_hist[0] - area_hist[-1]} km^2 ({(1-area_hist[-1]/area_hist[0])*100:.0f}%)")
print(f"Decay rate: k = {k_decay:.4f} per year")
print()
print("Projected area at 2075:")
print(f"  Current trend:      {area_trend[2075-2024]:.0f} km^2")
print(f"  With protection:    {area_protected[2075-2024]:.0f} km^2")
print(f"  With upstream dam:  {area_dam[2075-2024]:.0f} km^2")
print()
print(f"Annual erosion: ~{sum(monthly_erosion):.2f} km^2")
print(f"Annual deposition: ~{sum(monthly_deposition):.2f} km^2")
print(f"Net loss: ~{sum(monthly_erosion)-sum(monthly_deposition):.2f} km^2/year")
print()
print("80% of erosion occurs June-September (monsoon)")`,
      challenge: 'Add a climate change scenario: if monsoon discharge increases by 15% and monsoon duration extends by 2 weeks by 2050, recalculate the erosion projections. How much faster does Majuli shrink?',
      successHint: 'You now have a quantitative model of Majuli\'s shrinkage. The exponential decay fit reveals that the island is not losing area linearly — as it gets smaller, the absolute loss rate decreases but the percentage loss rate stays constant. This is because a smaller island has less bank length exposed to erosion.',
    },
    {
      title: 'Satellite-based change detection — measuring erosion from space',
      concept: `Remote sensing is the primary tool for monitoring large-scale geomorphic changes. For Majuli, the Landsat program (operating since 1972) provides a 50-year record of island change at 30-meter resolution.

**Spectral indices**: Satellite sensors measure reflected light in multiple wavelength bands. The **Normalized Difference Water Index (NDWI)** distinguishes water from land: NDWI = (Green - NIR) / (Green + NIR). Water has positive NDWI (strong green reflection, weak NIR), while land has negative NDWI (NIR stronger than green). A threshold of NDWI > 0 reliably separates water from land.

**Change detection workflow**: (1) Acquire two satellite images from different dates. (2) Calculate NDWI for both. (3) Classify each pixel as water or land using the threshold. (4) Compare the two classifications: pixels that changed from land to water represent erosion; water to land represents deposition. (5) Calculate areas by multiplying pixel count by pixel area (900 m^2 for Landsat).

**Accuracy considerations**: Cloud cover obscures the surface, requiring cloud masking. Seasonal water level changes mean the same pixel can be land in winter and submerged in monsoon without any erosion occurring — so comparisons must use images from the same season. Geometric registration errors between dates must be corrected to sub-pixel accuracy, or false changes appear at high-contrast edges.

**Multi-temporal analysis**: Rather than comparing just two dates, analyzing the entire 50-year Landsat archive reveals trends. Each pixel can be assigned an "erosion year" — the year it changed from land to water — creating a map of erosion progression. This reveals erosion hotspots, retreat rates along specific bank segments, and the spatial pattern of island shrinkage over decades.`,
      analogy: 'Satellite change detection is like comparing two overhead photographs of a beach taken a year apart. By overlaying them, you can see exactly where the shoreline retreated (erosion) and where new sand appeared (deposition). The satellite does this automatically across the entire island, with 30-meter precision, every 16 days for 50 years. It is an automated surveying crew that never sleeps.',
      storyConnection: 'In the story, the grandmother points across the water and says "That was our village." From the ground, all you see is river. From space, a satellite can show the exact year that village disappeared — the pixel changed from land (brown/green) to water (blue) — and measure the erosion front advancing toward the remaining settlements. This transforms personal loss into quantifiable data that can inform protection strategies.',
      checkQuestion: 'You are comparing two Landsat images of Majuli — one from January 2020 and one from January 2021 (same month to control for seasonal effects). A cluster of 500 pixels changed from land to water. What area does this represent, and what could cause a false positive?',
      checkAnswer: 'Area: 500 pixels * 900 m^2/pixel = 450,000 m^2 = 0.45 km^2. This represents 0.45 km^2 of bank erosion in one year. False positives could arise from: (1) Different water levels between the two dates (even in the same month, exact discharge varies), artificially showing "erosion" that is just higher water covering the bank. (2) Cloud shadow in one image misclassified as water. (3) Geometric misregistration causing edge effects. (4) A temporary flood or waterlogged field in one image. Mitigation: use multiple images per year, check discharge records, apply cloud masks, and verify with field measurements.',
      codeIntro: 'Simulate a satellite-based change detection workflow: generate synthetic NDWI images, classify them, and calculate erosion area.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def generate_island_image(size=200, island_radius=60, erosion_amount=0,
                          noise_level=0.1, cloud_fraction=0.05):
    """Generate a synthetic satellite NDWI image of an island."""
    y, x = np.mgrid[-size//2:size//2, -size//2:size//2]

    # Elliptical island shape
    a = island_radius * 1.5  # semi-major axis
    b = island_radius * 0.6  # semi-minor axis

    # Apply erosion to southern bank
    b_south = b - erosion_amount
    distance = np.where(y > 0,
                        np.sqrt((x/a)**2 + (y/b)**2),
                        np.sqrt((x/a)**2 + (y/b_south)**2))

    # NDWI: negative for land, positive for water
    ndwi = np.where(distance < 1.0, -0.3, 0.5)

    # Add transition zone (shallow water / mudflat)
    transition = (distance > 0.9) & (distance < 1.1)
    ndwi[transition] = -0.3 + 0.8 * (distance[transition] - 0.9) / 0.2

    # Add noise
    ndwi += np.random.normal(0, noise_level, ndwi.shape)

    # Add clouds (high NDWI areas that look like neither water nor land)
    cloud_mask = np.random.random(ndwi.shape) < cloud_fraction
    ndwi[cloud_mask] = np.nan  # mark as no-data

    return ndwi

def classify_ndwi(ndwi, threshold=0.0):
    """Classify NDWI image into water (1), land (0), no-data (-1)."""
    classified = np.zeros_like(ndwi)
    classified[ndwi > threshold] = 1    # water
    classified[ndwi <= threshold] = 0   # land
    classified[np.isnan(ndwi)] = -1     # cloud/no-data
    return classified

# --- Generate multi-date imagery ---
dates = ['2000', '2005', '2010', '2015', '2020', '2024']
erosion_amounts = [0, 3, 7, 12, 16, 19]  # pixels of erosion

images = []
classifications = []
for ea in erosion_amounts:
    img = generate_island_image(erosion_amount=ea, noise_level=0.08, cloud_fraction=0.02)
    images.append(img)
    classifications.append(classify_ndwi(img))

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Satellite Change Detection: Majuli Island Erosion Monitoring',
             color='white', fontsize=14, fontweight='bold')

for idx, (ax, date, img, cls) in enumerate(zip(axes.flat, dates, images, classifications)):
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

    # Show NDWI image with classification overlay
    display = np.where(cls == 0, -0.3, np.where(cls == 1, 0.5, 0))
    ax.imshow(display, cmap='RdYlGn_r', vmin=-0.5, vmax=0.6, aspect='equal')

    # Highlight erosion since previous date
    if idx > 0:
        prev_cls = classifications[idx-1]
        erosion_pixels = (prev_cls == 0) & (cls == 1)
        erosion_overlay = np.zeros((*cls.shape, 4))
        erosion_overlay[erosion_pixels] = [1, 0, 0, 0.6]  # red
        ax.imshow(erosion_overlay, aspect='equal')
        n_eroded = np.sum(erosion_pixels & (prev_cls != -1) & (cls != -1))
        area_eroded = n_eroded * 0.09  # each pixel = 300m x 300m = 0.09 km^2 (scaled)
        ax.text(5, 15, f'Eroded: {area_eroded:.1f} km\²', color='#ef4444', fontsize=9,
                bbox=dict(boxstyle='round', facecolor='#1f2937', alpha=0.8, edgecolor='#ef4444'))

    # Calculate and show island area
    land_pixels = np.sum(cls == 0)
    area_km2 = land_pixels * 0.09  # scaled pixel area
    ax.set_title(f'{date} — {area_km2:.0f} km\²', color='white', fontsize=11)
    ax.text(5, 190, 'Land', color='#22c55e', fontsize=8,
            bbox=dict(boxstyle='round', facecolor='#111827', alpha=0.8))
    ax.text(5, 180, 'Water', color='#3b82f6', fontsize=8,
            bbox=dict(boxstyle='round', facecolor='#111827', alpha=0.8))
    if idx > 0:
        ax.text(5, 170, 'New erosion', color='#ef4444', fontsize=8,
                bbox=dict(boxstyle='round', facecolor='#111827', alpha=0.8))

plt.tight_layout()
plt.show()

# --- Quantitative analysis ---
areas = []
for cls in classifications:
    land_pixels = np.sum(cls == 0)
    areas.append(land_pixels * 0.09)

fig2, axes2 = plt.subplots(1, 2, figsize=(14, 5))
fig2.patch.set_facecolor('#1f2937')

# Area time series
ax = axes2[0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.plot([int(d) for d in dates], areas, 'o-', color='#3b82f6', linewidth=2.5, markersize=8)
ax.set_xlabel('Year', color='white', fontsize=11)
ax.set_ylabel('Island area (km\², synthetic)', color='white', fontsize=11)
ax.set_title('Area decline from change detection', color='white', fontsize=12)

# Erosion rate per period
ax = axes2[1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for i in range(1, len(dates)):
    rate = (areas[i-1] - areas[i]) / (int(dates[i]) - int(dates[i-1]))
    mid_year = (int(dates[i]) + int(dates[i-1])) / 2
    color = '#ef4444' if rate > 1.5 else '#f59e0b' if rate > 0.8 else '#22c55e'
    ax.bar(mid_year, rate, width=4, color=color, edgecolor='none')
    ax.text(mid_year, rate + 0.05, f'{rate:.2f}', ha='center', color='white', fontsize=9)

ax.set_xlabel('Year', color='white', fontsize=11)
ax.set_ylabel('Erosion rate (km\²/year)', color='white', fontsize=11)
ax.set_title('Computed erosion rates', color='white', fontsize=12)

plt.tight_layout()
plt.show()

print("Satellite Change Detection Results")
print("=" * 55)
print(f"{'Date':<8} {'Area (km2)':>12} {'Change':>12} {'Rate (km2/yr)':>15}")
print("-" * 50)
for i, (date, area) in enumerate(zip(dates, areas)):
    if i == 0:
        print(f"{date:<8} {area:>12.1f}       ---            ---")
    else:
        change = areas[i-1] - area
        years = int(dates[i]) - int(dates[i-1])
        rate = change / years
        print(f"{date:<8} {area:>12.1f} {-change:>+12.1f} {rate:>15.2f}")

print()
print(f"Total area loss: {areas[0] - areas[-1]:.1f} km^2 ({(1-areas[-1]/areas[0])*100:.0f}%)")
print(f"Mean erosion rate: {(areas[0] - areas[-1])/(int(dates[-1])-int(dates[0])):.2f} km^2/year")`,
      challenge: 'Add a cloud masking step: randomly add 10% cloud cover to one date and show how it affects the area calculation. Then implement a multi-image composite approach (take the median NDWI from 5 images within the same month) to reduce cloud impact.',
      successHint: 'You have implemented the core remote sensing workflow used by real geomorphologists studying Majuli. The pixel-counting approach is simple but powerful — it turns satellite imagery into quantitative measurements of landscape change.',
    },
    {
      title: 'Flood risk and erosion prediction — protecting Majuli\'s future',
      concept: `The final piece of the geomorphology puzzle is predicting future erosion and assessing flood risk. This requires combining the physical models (hydraulics, sediment transport) with statistical analysis of historical data.

**Flood frequency analysis**: The probability of a flood of a given magnitude is estimated from historical discharge records using extreme value statistics. The **Gumbel distribution** is commonly used: P(Q > q) = 1 - exp(-exp(-(q-mu)/sigma)), where mu and sigma are estimated from the annual maximum discharge series. For the Brahmaputra at Pandu (near Majuli), the 100-year flood discharge is approximately 72,000 m^3/s.

**Erosion-discharge relationship**: Empirical data shows that bank erosion rate increases nonlinearly with discharge. A power law fits well: E = a * (Q - Q_threshold)^b, where Q_threshold is the discharge below which no significant erosion occurs (~30,000 m^3/s for Majuli), and b is typically 1.5-2.0 (erosion accelerates rapidly above the threshold). This means a 20% increase in flood peak causes a 30-40% increase in erosion.

**Bank stability analysis**: The probability of bank failure at a specific location depends on bank geometry (height, slope, stratigraphy), material properties (cohesion, friction angle, unit weight), and pore water pressure (which increases during prolonged floods). The **factor of safety** (FoS) is the ratio of resisting forces to driving forces. FoS < 1 means failure is imminent. During monsoon, rising pore water pressure can reduce FoS from ~1.5 (stable) to <1.0 (failure) in a matter of days.

**Protection strategies**: (1) **Porcupine structures** — bamboo frames filled with stones, placed along eroding banks to break wave energy and trap sediment. (2) **Geotextile bags** — sand-filled synthetic bags stacked along banks. (3) **Vegetation** — planting deep-rooted species (vetiver grass, willows) stabilizes banks. (4) **Upstream flow management** — releasing water from dams in controlled pulses to reduce peak shear stress. Each strategy has different cost, effectiveness, and environmental impact.`,
      analogy: 'Flood risk analysis is like insurance actuarial science. An insurance company asks: "What is the probability of a claim exceeding $1 million in any given year?" We ask: "What is the probability of a flood exceeding 70,000 m^3/s in any given year?" Both use the same statistical tools (extreme value distributions) applied to historical data. The answer determines how much "insurance" (protection infrastructure) Majuli needs.',
      storyConnection: 'The story ends with the community asking: "Will Majuli survive?" Our flood risk analysis provides a quantitative answer. The island will survive if erosion rates can be reduced below deposition rates — and our models show exactly what level of flood protection is needed to achieve that balance. The answer is not just physics; it is a policy decision backed by data.',
      checkQuestion: 'The Brahmaputra\'s 100-year flood is 72,000 m^3/s. Climate models predict a 15% increase in extreme precipitation by 2050. What would the new 100-year flood discharge be, and how would this affect erosion?',
      checkAnswer: 'A 15% increase in extreme precipitation roughly translates to a 15-20% increase in extreme discharge (slightly higher because the rainfall-runoff relationship is nonlinear in a large catchment). New 100-year flood: ~72,000 * 1.17 = 84,240 m^3/s. Using the erosion power law with b=1.8: new erosion rate / old rate = ((84240-30000)/(72000-30000))^1.8 = (54240/42000)^1.8 = 1.29^1.8 = 1.56. Erosion rate increases by 56% — much more than the 17% increase in discharge, because the power law amplifies changes above the threshold. This is why climate change is such a threat to Majuli.',
      codeIntro: 'Build a flood frequency model, erosion prediction system, and evaluate protection strategies for Majuli.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Flood frequency analysis ---
# Synthetic annual maximum discharge (Brahmaputra at Pandu)
n_years = 50
# Gumbel distribution parameters estimated from historical data
mu_gumbel = 55000   # location parameter (m^3/s)
sigma_gumbel = 10000  # scale parameter

# Generate synthetic annual maxima
annual_max_Q = mu_gumbel - sigma_gumbel * np.log(-np.log(np.random.uniform(0.01, 0.99, n_years)))
annual_max_Q = np.sort(annual_max_Q)

# Plotting positions (Gringorten formula)
i = np.arange(1, n_years + 1)
prob = (i - 0.44) / (n_years + 0.12)
return_period = 1 / (1 - prob)

# Gumbel fit
Q_fit = mu_gumbel - sigma_gumbel * np.log(-np.log(prob))

# Return period curves for future climate
return_periods_design = np.array([2, 5, 10, 25, 50, 100, 200, 500])
prob_design = 1 - 1/return_periods_design
Q_current = mu_gumbel - sigma_gumbel * np.log(-np.log(prob_design))
Q_2050 = Q_current * 1.17  # 17% increase from climate change

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Flood Risk & Erosion Prediction for Majuli Island',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Flood frequency curve
ax = axes[0, 0]
ax.semilogx(return_period, annual_max_Q/1000, 'o', color='#3b82f6',
            markersize=5, alpha=0.6, label='Observed annual maxima')
ax.semilogx(return_periods_design, Q_current/1000, '-', color='#3b82f6',
            linewidth=2, label='Current climate (Gumbel fit)')
ax.semilogx(return_periods_design, Q_2050/1000, '--', color='#ef4444',
            linewidth=2, label='2050 climate (+17%)')
ax.axhline(y=72, color='#f59e0b', linestyle=':', alpha=0.5, label='Current 100-yr flood')
ax.set_xlabel('Return period (years)', color='white', fontsize=11)
ax.set_ylabel('Discharge (\×10\³ m\³/s)', color='white', fontsize=11)
ax.set_title('Flood frequency analysis', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Erosion-discharge power law
ax = axes[0, 1]
Q_range = np.linspace(20000, 100000, 100)
Q_threshold = 30000  # no erosion below this

# Current relationship
b_power = 1.8
a_power = 0.0001  # calibration coefficient
erosion_rate = np.where(Q_range > Q_threshold,
                         a_power * (Q_range - Q_threshold)**b_power / 1e6,
                         0)

ax.plot(Q_range/1000, erosion_rate, color='#ef4444', linewidth=2.5, label='Erosion power law')
ax.fill_between(Q_range/1000, 0, erosion_rate, alpha=0.1, color='#ef4444')
ax.axvline(x=Q_threshold/1000, color='#22c55e', linestyle='--', alpha=0.5,
           label=f'Threshold ({Q_threshold/1000:.0f}k m\³/s)')

# Mark key floods
for Q_flood, label in [(55000, '2-yr'), (72000, '100-yr'), (84000, '100-yr 2050')]:
    if Q_flood > Q_threshold:
        E = a_power * (Q_flood - Q_threshold)**b_power / 1e6
        ax.plot(Q_flood/1000, E, 'o', markersize=8, color='#f59e0b', zorder=5)
        ax.annotate(f'{label}\\n{E:.1f} km\²/yr', xy=(Q_flood/1000, E),
                    xytext=(Q_flood/1000 + 5, E + 0.2), color='white', fontsize=8,
                    arrowprops=dict(arrowstyle='->', color='white', lw=1))

ax.set_xlabel('Discharge (\×10\³ m\³/s)', color='white', fontsize=11)
ax.set_ylabel('Erosion rate (km\²/year)', color='white', fontsize=11)
ax.set_title('Erosion increases nonlinearly with discharge', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Bank stability analysis
ax = axes[1, 0]
days = np.arange(0, 120)  # monsoon season

# Factor of safety model
base_FoS = 1.6  # pre-monsoon
# Pore pressure rises as flood persists
pore_pressure_ratio = 0.3 + 0.5 * np.sin(np.pi * days / 120)**2  # peaks mid-monsoon
# Flood level
flood_level = 0.3 + 0.7 * np.sin(np.pi * days / 120)**1.5
# Factor of safety decreases with pore pressure and flood level
FoS = base_FoS * (1 - 0.35 * pore_pressure_ratio) * (1 - 0.2 * flood_level)

ax.plot(days, FoS, color='#3b82f6', linewidth=2.5, label='Factor of Safety')
ax.axhline(y=1.0, color='#ef4444', linewidth=2, linestyle='--', label='FoS = 1.0 (failure)')
ax.fill_between(days, FoS, 1.0, where=FoS < 1.0, alpha=0.3, color='#ef4444',
                label='Failure zone')
ax.fill_between(days, FoS, 1.3, where=(FoS >= 1.0) & (FoS < 1.3), alpha=0.2,
                color='#f59e0b', label='Warning zone (FoS 1.0-1.3)')

# Mark dates
month_starts = [0, 30, 61, 91]
month_labels = ['Jun', 'Jul', 'Aug', 'Sep']
ax.set_xticks(month_starts)
ax.set_xticklabels(month_labels, color='white')
ax.set_ylabel('Factor of Safety', color='white', fontsize=11)
ax.set_title('Bank stability through monsoon', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Protection strategy comparison
ax = axes[1, 1]
strategies = {
    'No protection': {'cost_per_km': 0, 'erosion_reduction': 0, 'lifespan': 0},
    'Porcupine\\nstructures': {'cost_per_km': 50000, 'erosion_reduction': 40, 'lifespan': 5},
    'Geotextile\\nbags': {'cost_per_km': 200000, 'erosion_reduction': 60, 'lifespan': 10},
    'Concrete\\nrevetment': {'cost_per_km': 1000000, 'erosion_reduction': 85, 'lifespan': 25},
    'Vegetation +\\nporcupine': {'cost_per_km': 80000, 'erosion_reduction': 55, 'lifespan': 15},
}

names = list(strategies.keys())
costs = [s['cost_per_km']/1000 for s in strategies.values()]
reductions = [s['erosion_reduction'] for s in strategies.values()]
lifespans = [s['lifespan'] for s in strategies.values()]

# Cost-effectiveness: reduction per $1000 per km
effectiveness = [r / max(c, 1) for r, c in zip(reductions, costs)]

x_pos = np.arange(len(names))
colors_strat = ['#ef4444', '#f59e0b', '#3b82f6', '#a855f7', '#22c55e']

bars = ax.bar(x_pos, reductions, color=colors_strat, edgecolor='none', width=0.6, alpha=0.8)
ax2 = ax.twinx()
ax2.plot(x_pos, costs, 'D-', color='white', linewidth=2, markersize=8, label='Cost ($k/km)')
ax2.tick_params(colors='gray')

for i, (bar, r) in enumerate(zip(bars, reductions)):
    ax.text(i, r + 1, f'{r}%', ha='center', color='white', fontsize=9)

ax.set_xticks(x_pos)
ax.set_xticklabels(names, color='white', fontsize=7)
ax.set_ylabel('Erosion reduction (%)', color='#22c55e', fontsize=10)
ax2.set_ylabel('Cost (thousand USD/km)', color='white', fontsize=10)
ax.set_title('Protection strategies: effectiveness vs cost', color='white', fontsize=12)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

# Summary report
print("Flood Risk & Erosion Prediction Summary")
print("=" * 60)
print()
print("Flood frequency (Gumbel analysis):")
for rp, Q_c, Q_f in zip(return_periods_design, Q_current, Q_2050):
    print(f"  {rp:3.0f}-yr flood: Current={Q_c/1000:.0f}k m3/s, 2050={Q_f/1000:.0f}k m3/s (+{(Q_f/Q_c-1)*100:.0f}%)")

print()
print("Erosion impact of climate change:")
for rp in [10, 50, 100]:
    idx = np.argmin(np.abs(return_periods_design - rp))
    Q_c = Q_current[idx]
    Q_f = Q_2050[idx]
    E_c = a_power * max(Q_c - Q_threshold, 0)**b_power / 1e6
    E_f = a_power * max(Q_f - Q_threshold, 0)**b_power / 1e6
    print(f"  {rp}-yr event: erosion {E_c:.1f} -> {E_f:.1f} km2/yr (+{(E_f/E_c-1)*100:.0f}%)")

print()
print("Recommended strategy: Vegetation + porcupine hybrid")
print("  55% erosion reduction at $80k/km")
print("  Most cost-effective and environmentally sustainable")
print("  15-year lifespan with maintenance")`,
      challenge: 'Build a Monte Carlo simulation: generate 1000 random 50-year flood sequences from the Gumbel distribution and calculate the island area remaining after each sequence using the erosion power law. Report the probability that Majuli\'s area drops below 200 km^2 by 2075.',
      successHint: 'You have completed the geomorphology analysis: from basic hydraulics to flood frequency to erosion prediction to protection engineering. The power law amplification — where a 17% discharge increase causes a 56% erosion increase — is the key finding that makes climate change such a threat to Majuli.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Fluvial Geomorphology & Remote Sensing
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (data analysis fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for river geomorphology and remote sensing simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            />
        ))}
      </div>
    </div>
  );
}
