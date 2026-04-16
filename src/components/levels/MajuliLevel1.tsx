import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MajuliLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Rivers — how water shapes land, erosion and deposition',
      concept: `The Brahmaputra is one of the most powerful rivers on Earth. But every river, no matter how small, does two things constantly: it **erodes** (wears away) material from one place, and **deposits** (drops) it somewhere else. Over thousands of years, these two forces literally reshape the landscape.

**Erosion** happens through several mechanisms:
- **Hydraulic action**: the sheer force of moving water pries rock apart
- **Abrasion**: sediment carried by water grinds against the riverbed like sandpaper
- **Attrition**: rocks in the water smash into each other and break into smaller pieces
- **Solution**: slightly acidic water dissolves certain minerals

**Deposition** happens when water slows down. Fast water can carry boulders; slow water drops sand and silt. This is why river mouths and inner bends accumulate sediment — the water loses energy there.

The balance between erosion and deposition determines whether a river carves deeper into the earth or builds new land. On the Brahmaputra, both happen at extraordinary scale — which is exactly how Majuli was born.`,
      analogy: 'Think of a river as a conveyor belt at a construction site. The fast-moving belt can carry heavy loads (boulders, gravel). When the belt slows down, heavy items fall off first, then lighter ones. The pile that builds up where the belt slows is deposition — and on a river, those piles can become islands.',
      storyConnection: 'Majuli exists because the Brahmaputra is a river of extremes — monsoon floods carrying enormous sediment loads, which get deposited when the water spreads and slows. The island was literally built by the river, grain by grain, over millennia. The same force that created it now threatens to destroy it.',
      checkQuestion: 'A river flowing at 2 m/s can carry gravel. At 0.5 m/s it can only carry fine silt. If the river suddenly widens (doubling its width), what happens to the flow speed and the gravel it was carrying?',
      checkAnswer: 'When the river widens, the same volume of water spreads over a larger cross-section, so the velocity drops (roughly halves). At the lower speed, the water can no longer carry the gravel — so the gravel is deposited right where the river widens. This is one mechanism that forms mid-channel bars, the precursors to river islands like Majuli.',
      codeIntro: 'Model how water velocity determines what a river can carry — the Hjulstrom curve.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hjulstrom curve: relationship between water velocity and sediment transport
# Simplified model of erosion, transport, and deposition thresholds

particle_sizes = np.logspace(-3, 2, 200)  # mm (clay to boulders)

# Erosion velocity (U-shaped: clay is cohesive, hard to erode)
erosion_vel = np.where(
    particle_sizes < 0.1,
    100 * particle_sizes**(-0.3),   # clay/silt: cohesive, needs high velocity
    10 * particle_sizes**(0.5)       # sand/gravel: easier, scales with size
)

# Deposition velocity (always increases with size)
deposition_vel = 0.7 * particle_sizes**(0.6)
deposition_vel = np.clip(deposition_vel, 0.1, None)

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

ax.fill_between(particle_sizes, erosion_vel, 1000, alpha=0.15, color='#ef4444', label='Erosion zone')
ax.fill_between(particle_sizes, deposition_vel, erosion_vel,
                where=erosion_vel > deposition_vel,
                alpha=0.15, color='#3b82f6', label='Transport zone')
ax.fill_between(particle_sizes, 0.01, deposition_vel, alpha=0.15, color='#22c55e', label='Deposition zone')

ax.plot(particle_sizes, erosion_vel, color='#ef4444', linewidth=2, label='Erosion threshold')
ax.plot(particle_sizes, deposition_vel, color='#22c55e', linewidth=2, label='Deposition threshold')

# Mark sediment types
labels = [('Clay', 0.002), ('Silt', 0.05), ('Sand', 0.5), ('Gravel', 10), ('Cobbles', 80)]
for name, size in labels:
    ax.axvline(size, color='gray', linestyle=':', alpha=0.3)
    ax.text(size, 0.015, name, color='gray', fontsize=8, ha='center', rotation=45)

ax.set_xscale('log')
ax.set_yscale('log')
ax.set_xlim(0.001, 100)
ax.set_ylim(0.01, 1000)
ax.set_xlabel('Particle size (mm)', color='white')
ax.set_ylabel('Water velocity (cm/s)', color='white')
ax.set_title('Hjulstrom Curve: What Rivers Can Move', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')
plt.tight_layout()
plt.show()

print("Key insight: Clay is HARDER to erode than sand!")
print("  Clay particles are tiny but cohesive (they stick together).")
print("  Sand grains are loose and easy to pick up.")
print("  But once moving, clay stays suspended at very low velocities.")
print()
print("The Brahmaputra in monsoon: velocity ~3 m/s (300 cm/s)")
print("  -> Can erode and transport everything up to cobbles")
print("The Brahmaputra in dry season: velocity ~0.5 m/s (50 cm/s)")
print("  -> Drops gravel and coarse sand -> builds islands")`,
      challenge: 'The Brahmaputra carries about 735 million tonnes of sediment per year. If Majuli is 880 km² and the average sediment density is 1600 kg/m³, how thick a layer would that sediment make if it were all deposited on the island? (Hint: convert units carefully.)',
      successHint: 'The Hjulstrom curve is one of the most important tools in geomorphology. It explains why river deltas form, why floods rearrange landscapes, and why Majuli keeps changing shape every monsoon season.',
    },
    {
      title: 'Sediment transport — what rivers carry, where they drop it',
      concept: `A river is not just water — it is a massive sediment delivery system. The Brahmaputra carries an estimated **735 million tonnes** of sediment every year, making it one of the most sediment-laden rivers on the planet.

Rivers transport sediment in three ways:
- **Bed load**: heavy particles (gravel, coarse sand) that roll and bounce along the bottom
- **Suspended load**: finer particles (silt, fine sand) held up by water turbulence
- **Dissolved load**: minerals dissolved invisibly in the water

The amount of sediment a river carries depends on:
- **Velocity**: faster water carries more and larger particles
- **Discharge**: more water = more carrying capacity
- **Supply**: how much sediment is available (depends on geology, rainfall, vegetation)

Where does all this sediment come from? The Brahmaputra starts in Tibet and cuts through the Himalayas — the youngest, most actively eroding mountain range on Earth. Every monsoon, landslides and glacial melt deliver enormous loads of rock and soil into the river.

The sediment that builds Majuli is literally the Himalayas, ground to powder and carried 2,900 km downstream.`,
      analogy: 'Imagine stirring sand into a glass of water. If you stir fast, even heavy grains stay suspended. Stop stirring and the heavy grains sink immediately (bed load deposits), fine grains settle slowly (suspended load deposits), and dissolved salt stays in solution. A river works the same way — turbulence is the stirring.',
      storyConnection: 'Majuli was built from Himalayan sediment deposited by the Brahmaputra over thousands of years. Every grain of sand on the island traveled thousands of kilometers from the mountains. The island is, quite literally, a piece of the Himalayas reassembled by water.',
      checkQuestion: 'After a heavy monsoon rain, rivers often turn brown. After several dry days, the same river runs clear. Explain what is happening in terms of sediment transport.',
      checkAnswer: 'During heavy rain, surface runoff washes loose soil into the river (increased sediment supply). Higher water levels and faster flow increase the river\'s capacity to carry sediment (increased discharge and velocity). The brown colour is suspended silt and clay. In dry conditions, runoff stops, flow slows, the river drops its suspended load, and only dissolved minerals remain — hence the clear water.',
      codeIntro: 'Simulate how sediment settles based on particle size — Stokes\' Law in action.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Stokes' Law: settling velocity for spherical particles
# v = (2/9) * (rho_s - rho_w) * g * r^2 / mu

rho_s = 2650  # sediment density (kg/m^3, quartz)
rho_w = 1000  # water density (kg/m^3)
g = 9.81      # gravity (m/s^2)
mu = 0.001    # dynamic viscosity of water (Pa.s at 20°C)

# Particle diameters from clay to coarse sand
diameters_mm = np.array([0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0])
diameters_m = diameters_mm / 1000
radii = diameters_m / 2

# Stokes settling velocity (valid for small particles, Re < 1)
v_stokes = (2/9) * (rho_s - rho_w) * g * radii**2 / mu

# Time to settle through 1 meter of still water
settle_time_s = 1.0 / v_stokes
settle_time_hr = settle_time_s / 3600

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Settling velocity
ax1.set_facecolor('#111827')
ax1.plot(diameters_mm, v_stokes * 100, 'o-', color='#3b82f6', linewidth=2, markersize=6)
ax1.set_xscale('log')
ax1.set_yscale('log')
ax1.set_xlabel('Particle diameter (mm)', color='white')
ax1.set_ylabel('Settling velocity (cm/s)', color='white')
ax1.set_title('Settling Velocity vs Particle Size', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Annotate categories
categories = [('Clay', 0.002), ('Silt', 0.05), ('Fine sand', 0.2), ('Coarse sand', 1.0)]
for name, d in categories:
    idx = np.argmin(np.abs(diameters_mm - d))
    ax1.annotate(name, xy=(d, v_stokes[idx]*100), xytext=(d*2, v_stokes[idx]*100*3),
                 color='#f59e0b', fontsize=8, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Settling time
ax2.set_facecolor('#111827')
colors = ['#ef4444' if t > 24 else '#f59e0b' if t > 1 else '#22c55e' for t in settle_time_hr]
bars = ax2.bar(range(len(diameters_mm)), settle_time_hr, color=colors)
ax2.set_yscale('log')
ax2.set_xticks(range(len(diameters_mm)))
ax2.set_xticklabels([f'{d}' for d in diameters_mm], color='gray', fontsize=8, rotation=45)
ax2.set_xlabel('Particle diameter (mm)', color='white')
ax2.set_ylabel('Time to settle 1m (hours)', color='white')
ax2.set_title('How Long Sediment Takes to Settle', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Time annotations
for i, (bar, t) in enumerate(zip(bars, settle_time_hr)):
    if t > 24:
        label = f'{t/24:.0f} days'
    elif t > 1:
        label = f'{t:.0f} hrs'
    else:
        label = f'{t*60:.0f} min'
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() * 1.3,
             label, ha='center', color='white', fontsize=7)

plt.tight_layout()
plt.show()

print("Settling times through 1m of still water:")
for d, t in zip(diameters_mm, settle_time_hr):
    if t > 24:
        print(f"  {d:6.3f} mm: {t/24:8.1f} days")
    elif t > 1:
        print(f"  {d:6.3f} mm: {t:8.1f} hours")
    else:
        print(f"  {d:6.3f} mm: {t*60:8.1f} minutes")
print()
print("Clay takes DAYS to settle. That's why floodwater stays")
print("muddy long after the rain stops. It's also why clay reaches")
print("the ocean while sand stays near the river — Majuli is mostly sand.")`,
      challenge: 'The Brahmaputra is about 10m deep in the monsoon. How long would it take the finest clay (0.002 mm) to settle to the bottom? If the river flows at 3 m/s, how far downstream would that clay particle travel before reaching the bottom?',
      successHint: 'Understanding sediment transport explains why Majuli is made mostly of sand and silt (they settle first), why the Brahmaputra delta extends far into the Bay of Bengal (clay stays suspended longest), and why dredging rivers is a never-ending job.',
    },
    {
      title: 'River islands — how they form from sediment deposition',
      concept: `Majuli is the world's largest river island. But how does an island form in the middle of a river? The answer lies in **mid-channel bars** — mounds of sediment that grow into permanent features.

The process works like this:
1. **Obstruction**: something slows the flow — a fallen tree, a slight bend, a rocky outcrop
2. **Deposition begins**: sediment drops behind the obstruction where the water is slower
3. **Bar grows**: the deposited sediment itself becomes an obstruction, causing more deposition
4. **Vegetation colonizes**: grasses take root, binding the sediment, making the bar more resistant to erosion
5. **Channel splits**: the river flows around the bar, creating two channels
6. **Island stabilizes**: with vegetation holding the sediment, the bar becomes a true island

This is a **positive feedback loop**: more sediment makes a bigger bar, which traps more sediment, which makes it even bigger. But it also works in reverse — if erosion starts eating one side, the exposed sediment erodes faster, accelerating the loss.

Majuli formed through this process over thousands of years. It sits between the Brahmaputra's main channel and the Subansiri tributary, with sediment continuously building and reshaping the island.`,
      analogy: 'Think of snow piling up behind a fence on a windy day. The fence slows the wind, and snow accumulates. The pile itself then acts as a bigger barrier, trapping even more snow. River islands form the same way — but with sediment instead of snow, and water instead of wind.',
      storyConnection: 'Majuli was born from the Brahmaputra\'s restless energy — a river that carries mountains\' worth of sediment and occasionally pauses long enough to set some down. The island is not a permanent feature carved from rock; it is a living, shifting accumulation that the river built and continues to reshape every monsoon.',
      checkQuestion: 'If mid-channel bars grow through a positive feedback loop, why don\'t they just keep growing forever until they block the entire river?',
      checkAnswer: 'The river fights back. As the bar grows, it forces water into narrower channels on either side. Narrower channels mean faster flow, which increases erosion on the bar\'s edges. Eventually, erosion on the sides balances deposition on top and behind — a dynamic equilibrium. The bar reaches a stable (but slowly shifting) size.',
      codeIntro: 'Simulate mid-channel bar formation over time using a simple deposition model.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate island formation as a positive feedback process
# Island area grows based on sediment capture, but erosion fights back

years = np.arange(0, 500)
dt = 1  # year

# Parameters
max_area = 1000   # km^2 (carrying capacity)
growth_rate = 0.02  # base growth rate per year
erosion_base = 0.005  # base erosion rate

# Simulation: island area over time
area = np.zeros(len(years))
area[0] = 5  # initial bar size (km^2)

for i in range(1, len(years)):
    # Deposition: proportional to area (more area = more sediment captured)
    # but limited by carrying capacity (logistic growth)
    deposition = growth_rate * area[i-1] * (1 - area[i-1] / max_area)

    # Erosion: increases as island gets bigger (more exposed edges)
    erosion = erosion_base * area[i-1]

    area[i] = area[i-1] + (deposition - erosion) * dt
    area[i] = max(area[i], 0)

# Also simulate with vegetation stabilization kicking in at year 50
area_veg = np.zeros(len(years))
area_veg[0] = 5

for i in range(1, len(years)):
    veg_factor = 0.5 if i > 50 else 1.0  # vegetation halves erosion
    deposition = growth_rate * area_veg[i-1] * (1 - area_veg[i-1] / max_area)
    erosion = erosion_base * veg_factor * area_veg[i-1]
    area_veg[i] = area_veg[i-1] + (deposition - erosion) * dt
    area_veg[i] = max(area_veg[i], 0)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Area over time
ax1.set_facecolor('#111827')
ax1.plot(years, area, color='#3b82f6', linewidth=2, label='Without vegetation')
ax1.plot(years, area_veg, color='#22c55e', linewidth=2, label='With vegetation (after yr 50)')
ax1.axvline(50, color='#22c55e', linestyle=':', alpha=0.5)
ax1.annotate('Vegetation colonizes', xy=(50, area_veg[50]), xytext=(100, 200),
             color='#22c55e', fontsize=9, arrowprops=dict(arrowstyle='->', color='#22c55e'))
ax1.set_xlabel('Years', color='white')
ax1.set_ylabel('Island area (km²)', color='white')
ax1.set_title('River Island Formation Over Time', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Growth rate (derivative)
ax2.set_facecolor('#111827')
growth = np.diff(area_veg)
ax2.fill_between(years[1:], growth, alpha=0.2, color='#f59e0b')
ax2.plot(years[1:], growth, color='#f59e0b', linewidth=2)
ax2.axhline(0, color='gray', linestyle='-', alpha=0.3)
ax2.set_xlabel('Years', color='white')
ax2.set_ylabel('Area change (km²/year)', color='white')
ax2.set_title('Growth Rate of Island', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Island formation stages:")
print(f"  Year 0:   {area_veg[0]:.0f} km² (initial sediment bar)")
print(f"  Year 50:  {area_veg[50]:.0f} km² (vegetation begins)")
print(f"  Year 100: {area_veg[100]:.0f} km² (rapid growth phase)")
print(f"  Year 200: {area_veg[200]:.0f} km² (growth slowing)")
print(f"  Year 500: {area_veg[499]:.0f} km² (near equilibrium)")
print()
print(f"Equilibrium area without vegetation: {area[-1]:.0f} km²")
print(f"Equilibrium area with vegetation:    {area_veg[-1]:.0f} km²")
print("Vegetation nearly DOUBLES the stable island size!")`,
      challenge: 'What happens if you increase erosion_base to 0.015 (simulating stronger monsoon floods)? At what erosion rate does the island fail to form at all? (Hint: the island grows only when deposition > erosion.)',
      successHint: 'Majuli formed through exactly this kind of process — sediment deposition, vegetation stabilization, and a dynamic balance between growth and erosion. The fact that Majuli is now shrinking tells us the balance has tipped toward erosion.',
    },
    {
      title: 'The Brahmaputra — one of the world\'s most dynamic rivers',
      concept: `The Brahmaputra is extraordinary by any measure. Here are the numbers:

- **Length**: 2,900 km (from Tibet through India to Bangladesh)
- **Discharge**: 19,800 m³/s average (4th largest in the world)
- **Sediment load**: 735 million tonnes/year (one of the highest on Earth)
- **Width**: up to 10 km in places during monsoon
- **Monsoon surge**: discharge increases 5-10x from dry season to monsoon peak

What makes the Brahmaputra uniquely dynamic is its **braided channel pattern**. Unlike a meandering river (which snakes in a single channel), a braided river splits into multiple channels separated by bars and islands. The Brahmaputra constantly shifts between these channels, abandoning old ones and carving new ones.

This happens because the river carries far more sediment than it can transport at low flow. During the dry season, it dumps sediment everywhere, creating bars. During the monsoon, it erodes some bars and builds others. The pattern is chaotic — no two monsoons reshape the river the same way.

Majuli sits in this constantly shifting maze of channels. The island's fate depends entirely on which channels the Brahmaputra decides to favor each year.`,
      analogy: 'A braided river is like a crowd leaving a stadium through a wide plaza. People (water) naturally split around obstacles (sediment bars), creating multiple shifting paths. No two people take the same route, and the popular paths change from moment to moment. A meandering river is more like a single-file line — orderly but slow to change.',
      storyConnection: 'The Brahmaputra does not simply flow past Majuli — it surrounds, reshapes, and constantly renegotiates the island\'s boundaries. Majuli exists because of the Brahmaputra\'s immense sediment load, but it is also threatened by the river\'s tendency to shift channels unpredictably. The creator and destroyer are one and the same.',
      checkQuestion: 'The Brahmaputra\'s discharge is about 5,000 m³/s in the dry season and 50,000 m³/s in monsoon peak. That\'s a 10x increase. If the river width doubles during monsoon, how much must the depth and velocity change to accommodate the extra water?',
      checkAnswer: 'Discharge = Width x Depth x Velocity. If width doubles (2x), and discharge increases 10x, then Depth x Velocity must increase 5x. Typically both increase: depth might triple and velocity might increase 1.7x, for example. This massive velocity increase is why monsoon floods are so erosive — the same river that gently deposits sediment in winter tears away riverbanks in summer.',
      codeIntro: 'Visualize the Brahmaputra\'s seasonal discharge cycle and compare it to other major rivers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Monthly discharge data (approximate, m^3/s)
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# Brahmaputra at Pandu, Assam (approximate monthly means)
brahmaputra = [4800, 4200, 5100, 8500, 15000, 28000,
               42000, 48000, 38000, 22000, 11000, 6500]

# Other rivers for comparison
ganges = [3000, 2800, 2500, 2800, 5000, 15000,
          30000, 35000, 28000, 15000, 7000, 4000]

mississippi = [16000, 17000, 20000, 22000, 21000, 18000,
               15000, 12000, 11000, 10000, 12000, 14000]

nile = [800, 700, 600, 500, 500, 700,
        1500, 5000, 7000, 5500, 2500, 1200]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# Monthly discharge comparison
ax1.set_facecolor('#111827')
ax1.plot(months, brahmaputra, 'o-', color='#ef4444', linewidth=2.5, markersize=6, label='Brahmaputra')
ax1.plot(months, ganges, 's-', color='#3b82f6', linewidth=2, markersize=5, label='Ganges')
ax1.plot(months, mississippi, '^-', color='#22c55e', linewidth=2, markersize=5, label='Mississippi')
ax1.plot(months, nile, 'D-', color='#f59e0b', linewidth=2, markersize=5, label='Nile')
ax1.fill_between(range(12), brahmaputra, alpha=0.1, color='#ef4444')
ax1.set_ylabel('Discharge (m³/s)', color='white')
ax1.set_title('Seasonal Discharge: The Brahmaputra vs Major Rivers', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Monsoon ratio (peak / minimum)
ax2.set_facecolor('#111827')
rivers = ['Brahmaputra', 'Ganges', 'Nile', 'Mississippi']
ratios = [max(brahmaputra)/min(brahmaputra),
          max(ganges)/min(ganges),
          max(nile)/min(nile),
          max(mississippi)/min(mississippi)]
colors = ['#ef4444', '#3b82f6', '#f59e0b', '#22c55e']

bars = ax2.bar(rivers, ratios, color=colors)
for bar, ratio in zip(bars, ratios):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2,
             f'{ratio:.1f}x', ha='center', color='white', fontsize=11, fontweight='bold')

ax2.set_ylabel('Peak/Minimum discharge ratio', color='white')
ax2.set_title('Seasonal Variability: How Much Rivers Change', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The Brahmaputra's seasonal swing:")
print(f"  Minimum (Feb): {min(brahmaputra):,} m³/s")
print(f"  Maximum (Aug): {max(brahmaputra):,} m³/s")
print(f"  Ratio: {max(brahmaputra)/min(brahmaputra):.1f}x")
print()
print("Compare to the Mississippi (2.0x) - a 'steady' river.")
print("The Brahmaputra's extreme variability is WHY it reshapes")
print("the landscape so aggressively - and why Majuli is at risk.")`,
      challenge: 'Calculate the total volume of water the Brahmaputra discharges in one year using the monthly data above. Convert to km³. How does it compare to the volume of a lake? (Lake Baikal = 23,600 km³ for reference.)',
      successHint: 'The Brahmaputra\'s extreme seasonality is the key to understanding Majuli. The gentle dry-season flow builds and maintains the island; the violent monsoon floods reshape and erode it. This annual cycle of creation and destruction defines life on the island.',
    },
    {
      title: 'Erosion threatens Majuli — the island is shrinking',
      concept: `Majuli has been losing land at an alarming rate. The numbers tell a stark story:

- **1901**: area estimated at ~1,255 km²
- **1950**: ~1,090 km²
- **1972**: ~880 km²
- **2001**: ~640 km²
- **2014**: ~524 km²
- **2016**: ~502 km²

That is a loss of more than **60%** of the island's area in just over a century. At this rate, some researchers warned that Majuli could be fully submerged within 15-20 years — though the rate has slowed somewhat due to conservation efforts.

Why is erosion accelerating?
- **Deforestation** upstream increases sediment and runoff
- **Earthquakes** (Assam had a massive 8.6-magnitude quake in 1950) lifted the riverbed and changed flow patterns
- **Embankments** on the south bank of the Brahmaputra deflect erosive flow toward Majuli
- **Channel shifting**: the Brahmaputra has been migrating southward, attacking Majuli's southern edge
- **Climate change**: more intense monsoons mean more extreme floods

The island is not just shrinking in area — it is sinking. As erosion removes land from the edges, flood frequency increases, and agricultural land becomes waterlogged.`,
      analogy: 'Imagine an ice cube in a warm drink. It melts from all edges simultaneously, getting smaller and smaller. But unlike an ice cube (which melts at a steady rate), Majuli\'s erosion accelerates — because as the island gets smaller, the river channels around it get proportionally larger and more erosive. It is a vicious cycle.',
      storyConnection: 'The same Brahmaputra that built Majuli grain by grain is now taking it back. The island\'s origin story — born from sediment deposition — has an epilogue: the river giveth, and the river taketh away. Understanding the data behind this loss is the first step toward saving the island.',
      checkQuestion: 'Between 1901 and 2016, Majuli lost about 753 km² in 115 years. But the loss was not linear — it accelerated. What factors could cause erosion to speed up over time, creating a positive feedback loop?',
      checkAnswer: 'Several feedback loops: (1) Less area means less vegetation to stabilize banks, increasing erosion. (2) Eroded sediment makes the river shallower, spreading flow and increasing bank attack. (3) Smaller island means proportionally more edge exposed to the current. (4) Loss of wetlands removes natural flood buffers. (5) Displacement of farmers leads to deforestation of remaining land for agriculture, weakening soil further. Each effect amplifies the others.',
      codeIntro: 'Plot Majuli\'s area decline and project future scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Historical area data (km^2)
years_data = np.array([1901, 1917, 1950, 1972, 1990, 2001, 2004, 2010, 2014, 2016])
area_data = np.array([1255, 1200, 1090, 880, 760, 640, 580, 545, 524, 502])

# Fit exponential decay: A(t) = A0 * exp(-k * (t - t0))
from numpy.polynomial import polynomial as P

# Log-linear fit for exponential decay
t_offset = years_data - 1901
log_area = np.log(area_data)
coeffs = np.polyfit(t_offset, log_area, 1)
k_decay = -coeffs[0]
A0_fit = np.exp(coeffs[1])

# Project forward
years_future = np.arange(1901, 2060)
t_future = years_future - 1901
area_exponential = A0_fit * np.exp(-k_decay * t_future)

# Scenario: conservation slows erosion by 50% starting 2020
area_conservation = np.copy(area_exponential)
idx_2020 = 2020 - 1901
for i in range(idx_2020, len(area_conservation)):
    area_conservation[i] = area_conservation[idx_2020] * np.exp(-k_decay * 0.5 * (i - idx_2020))

# Scenario: no intervention (current rate)
# Scenario: accelerating (rate increases 2% per year)
area_accelerating = np.copy(area_exponential)
for i in range(idx_2020, len(area_accelerating)):
    dt = i - idx_2020
    area_accelerating[i] = area_accelerating[idx_2020] * np.exp(-k_decay * 1.5 * dt)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Historical + projections
ax1.set_facecolor('#111827')
ax1.plot(years_data, area_data, 'o', color='#ef4444', markersize=8, label='Measured data', zorder=5)
ax1.plot(years_future, area_exponential, '--', color='#f59e0b', linewidth=2, label='Current trend')
ax1.plot(years_future, area_conservation, '-', color='#22c55e', linewidth=2, label='With conservation (-50% erosion)')
ax1.plot(years_future, area_accelerating, '-', color='#ef4444', linewidth=2, alpha=0.7, label='Accelerating erosion (+50%)')
ax1.axvline(2025, color='white', linestyle=':', alpha=0.3)
ax1.text(2026, 1100, 'Today', color='white', fontsize=9)
ax1.axhline(100, color='gray', linestyle=':', alpha=0.3)
ax1.text(1905, 110, 'Critical threshold (100 km²)', color='gray', fontsize=8)
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Area (km²)', color='white')
ax1.set_title('Majuli Island: Measured Decline & Projections', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 1400)

# Decadal loss rates
ax2.set_facecolor('#111827')
decades = []
losses = []
for i in range(1, len(years_data)):
    dt = years_data[i] - years_data[i-1]
    if dt >= 5:  # only significant intervals
        loss_rate = (area_data[i-1] - area_data[i]) / dt
        mid_year = (years_data[i] + years_data[i-1]) / 2
        decades.append(mid_year)
        losses.append(loss_rate)

bars = ax2.bar(range(len(decades)), losses, color='#ef4444', alpha=0.8)
ax2.set_xticks(range(len(decades)))
ax2.set_xticklabels([f'{int(d)}' for d in decades], color='gray', fontsize=8, rotation=45)
ax2.set_ylabel('Land loss rate (km²/year)', color='white')
ax2.set_title('Erosion Rate Over Time', color='white', fontsize=12)
ax2.tick_params(colors='gray')
for bar, loss in zip(bars, losses):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
             f'{loss:.1f}', ha='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Majuli's decline by the numbers:")
print(f"  1901 area: {area_data[0]:,} km²")
print(f"  2016 area: {area_data[-1]:,} km²")
print(f"  Total loss: {area_data[0] - area_data[-1]:,} km² ({100*(1 - area_data[-1]/area_data[0]):.1f}%)")
print(f"  Decay rate: {k_decay*100:.2f}% per year")
print()
print("At current rate, area reaches 100 km² around:", end=" ")
for i, a in enumerate(area_exponential):
    if a < 100:
        print(f"{years_future[i]}"); break
print("With conservation, area reaches 100 km² around:", end=" ")
for i, a in enumerate(area_conservation):
    if a < 100:
        print(f"{years_future[i]}"); break`,
      challenge: 'The 1950 Assam earthquake (magnitude 8.6) dramatically changed the Brahmaputra\'s course. Look at the area data: is there a noticeable change in erosion rate before and after 1950? Calculate the average annual loss for 1901-1950 vs. 1950-2016.',
      successHint: 'Data makes the crisis visible. Majuli is not experiencing gentle, natural change — it is in a rapid decline accelerated by human and geological factors. The projections show why conservation action is urgent, and why quantitative analysis matters for policy decisions.',
    },
    {
      title: 'Conservation — engineering solutions to save the island',
      concept: `Saving Majuli requires fighting the Brahmaputra's erosive power. Engineers and ecologists have proposed and implemented several strategies:

**Hard engineering (structural solutions):**
- **Embankments (dykes)**: raised earth walls along the river edge to block floodwater. Majuli has ~100 km of embankments. Problem: they often fail during major floods and can worsen erosion elsewhere.
- **Revetments**: layers of rock, concrete, or geotextile placed along banks to absorb wave energy. More durable than earthen embankments but expensive.
- **Porcupine structures**: bamboo and wire frames placed in the river to slow current and trap sediment. Cheap, locally sourced, and effective.

**Soft engineering (nature-based solutions):**
- **Vegetation planting**: deep-rooted plants (vetiver grass, bamboo) stabilize banks by binding soil. The roots create a living reinforcement mesh.
- **Mangrove/wetland restoration**: wetlands absorb flood energy and trap sediment.
- **Floodplain reconnection**: allowing controlled flooding of low-value land reduces pressure on critical areas.

**Hybrid approaches:**
- **Bamboo porcupines + vegetation**: porcupines protect newly planted vegetation until roots establish.
- **Geotextile tubes + soil bioengineering**: synthetic tubes hold sediment in place while plants grow through them.

The Indian government declared Majuli a district in 2016, partly to increase funding for conservation. Several pilot projects combining hard and soft engineering have shown promising results.`,
      analogy: 'Saving Majuli is like treating a wound. Hard engineering (embankments, revetments) is like a bandage — it covers the wound but doesn\'t heal it. Soft engineering (vegetation, wetlands) is like the body\'s immune system — slower, but it actually repairs the damage. The best treatment combines both: bandage for immediate protection, immune response for long-term healing.',
      storyConnection: 'The story of Majuli is not over. The same understanding of erosion, sediment transport, and river dynamics that explains how the island formed now guides the effort to save it. Science moves from observation to intervention — from understanding the river to negotiating with it.',
      checkQuestion: 'Bamboo porcupine structures are placed perpendicular to the river flow. How do they reduce erosion? What would happen if you placed them parallel to the flow instead?',
      checkAnswer: 'Perpendicular placement forces water to slow down as it passes through the bamboo lattice, reducing velocity and causing sediment deposition behind the structure. Over time, a new sandbar builds up. Parallel placement would not slow the current — water would simply flow along the structure without losing energy. It\'s the same principle as a windbreak: you need to intercept the flow, not align with it.',
      codeIntro: 'Compare the cost-effectiveness and durability of different conservation strategies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Conservation strategy comparison
strategies = [
    'Earthen\
embankment',
    'Rock\
revetment',
    'Concrete\
wall',
    'Bamboo\
porcupines',
    'Vetiver\
grass',
    'Mangrove\
restoration',
    'Geotextile\
tubes',
    'Hybrid\
(porcupine+plants)'
]

# Cost per km (lakhs INR, approximate)
cost = [50, 200, 500, 15, 8, 25, 150, 35]

# Effectiveness (0-10 scale, erosion protection)
effectiveness = [5, 8, 9, 6, 4, 5, 7, 8]

# Durability (years before major maintenance)
durability = [3, 15, 25, 5, 20, 50, 10, 15]

# Environmental impact (0-10, higher = more eco-friendly)
eco_score = [3, 2, 1, 7, 9, 10, 4, 8]

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Conservation Strategies for Majuli Island', color='white', fontsize=14, y=0.98)

# Cost
ax = axes[0, 0]
ax.set_facecolor('#111827')
colors_cost = ['#ef4444' if c > 100 else '#f59e0b' if c > 30 else '#22c55e' for c in cost]
ax.barh(strategies, cost, color=colors_cost)
ax.set_xlabel('Cost per km (lakhs INR)', color='white')
ax.set_title('Cost', color='white', fontsize=11)
ax.tick_params(colors='gray')
for i, c in enumerate(cost):
    ax.text(c + 5, i, f'₹{c}L', va='center', color='white', fontsize=9)

# Effectiveness
ax = axes[0, 1]
ax.set_facecolor('#111827')
colors_eff = ['#22c55e' if e >= 7 else '#f59e0b' if e >= 5 else '#ef4444' for e in effectiveness]
ax.barh(strategies, effectiveness, color=colors_eff)
ax.set_xlabel('Effectiveness (0-10)', color='white')
ax.set_title('Erosion Protection', color='white', fontsize=11)
ax.set_xlim(0, 11)
ax.tick_params(colors='gray')

# Durability
ax = axes[1, 0]
ax.set_facecolor('#111827')
colors_dur = ['#22c55e' if d >= 15 else '#f59e0b' if d >= 8 else '#ef4444' for d in durability]
ax.barh(strategies, durability, color=colors_dur)
ax.set_xlabel('Durability (years)', color='white')
ax.set_title('Durability Before Major Maintenance', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Cost-effectiveness ratio (effectiveness * durability / cost)
ax = axes[1, 1]
ax.set_facecolor('#111827')
ce_ratio = [(e * d / c) for e, d, c in zip(effectiveness, durability, cost)]
colors_ce = ['#22c55e' if r >= 2 else '#f59e0b' if r >= 0.5 else '#ef4444' for r in ce_ratio]
ax.barh(strategies, ce_ratio, color=colors_ce)
ax.set_xlabel('Cost-effectiveness score', color='white')
ax.set_title('Value for Money (effectiveness × durability / cost)', color='white', fontsize=11)
ax.tick_params(colors='gray')
for i, r in enumerate(ce_ratio):
    ax.text(r + 0.1, i, f'{r:.1f}', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Cost-effectiveness ranking:")
ranked = sorted(zip(strategies, ce_ratio, cost, eco_score), key=lambda x: -x[1])
for i, (name, score, c, eco) in enumerate(ranked, 1):
    name_clean = name.replace('\
', ' ')
    print(f"  {i}. {name_clean}: score={score:.1f}, cost=₹{c}L/km, eco={eco}/10")
print()
print("Key insight: The cheapest, most eco-friendly solutions")
print("(vetiver grass, bamboo porcupines) are often the most")
print("cost-effective. Concrete walls score lowest on value for money.")
print()
print("Best approach: Hybrid strategies that combine cheap natural")
print("solutions with targeted structural protection at critical points.")`,
      challenge: 'Add a "community labor" factor to the analysis. Bamboo porcupines and vetiver planting can be done by local communities (reducing cost by 50%), while concrete and geotextile require specialized contractors. Recalculate the cost-effectiveness with this adjustment.',
      successHint: 'Saving Majuli is not just an engineering problem — it is an economic, ecological, and social challenge. The best solutions are those that are affordable, sustainable, and empower local communities. This is where science meets policy, and data meets action.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior geography or earth science experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for geography and river dynamics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
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
