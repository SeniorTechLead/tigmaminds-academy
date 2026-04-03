import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RiverBraidLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'River types — straight, meandering, and braided',
      concept: `In "Why Rivers Braid Near the Sea," a fisherman notices that the Brahmaputra splits into dozens of channels as it nears the Bay of Bengal. Rivers take three basic forms, and each tells a story about the landscape:

**Straight channels** (rare in nature):
- Occur in narrow, steep valleys where the river is confined
- The water flows fast with little room to wander
- Typically short stretches (<10 river widths)

**Meandering rivers**:
- Single channel that snakes across a flat plain in S-curves
- The outer bank erodes (cutbank), the inner bank deposits (point bar)
- Meanders grow, migrate, and occasionally cut off to form oxbow lakes
- Examples: lower Mississippi, Mekong

**Braided rivers**:
- Multiple channels separated by sand/gravel bars
- Channels constantly shift, split, and rejoin
- Occur when sediment load is high relative to water flow
- Examples: Brahmaputra, Kosi, glacial rivers in Iceland

The Brahmaputra is one of the world's most spectacular braided rivers. In Assam, it can be 10-15 km wide during monsoon, with hundreds of mid-channel islands (chars) that appear and disappear with the seasons.`,
      analogy: 'Think of water flowing down a tilted tray of sand. If the tray is narrow and steep, water cuts a single straight channel. If the tray is wide and gentle, water spreads out and splits around obstacles. If you keep pouring sand onto the tray (high sediment), the water is forced to find multiple paths — braiding.',
      storyConnection: 'The fisherman in the story observes the river "splitting like the roots of a banyan tree." This is a perfect natural analogy. Like banyan roots spread across the ground seeking soil, braided channels spread across the floodplain seeking the path of least resistance. Both are branching networks optimised by physics.',
      checkQuestion: 'The Brahmaputra is braided in Assam but was a single deep channel cutting through the Himalayas upstream. What changed?',
      checkAnswer: 'Gradient (slope) and sediment load. In the mountains, the steep gradient gives the river enough power to carry its sediment in a single deep channel. When it reaches the flat Assam plains, the gradient drops dramatically. The river loses energy, deposits sediment, and splits around the deposits. Less slope + more sediment = braiding.',
      codeIntro: 'Generate and visualise the three river types using simple mathematical models.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 3, figsize=(15, 6))
fig.patch.set_facecolor('#1f2937')

np.random.seed(42)

# Straight river
ax = axes[0]
ax.set_facecolor('#111827')
x = np.linspace(0, 100, 200)
y = 50 + np.random.normal(0, 0.5, len(x)).cumsum() * 0.1
width = 3
ax.fill_between(x, y - width, y + width, color='#3b82f6', alpha=0.6)
ax.plot(x, y, color='#60a5fa', linewidth=1)
# Valley walls
ax.fill_between(x, 0, y - width - 5, color='#4b5563', alpha=0.3)
ax.fill_between(x, y + width + 5, 100, color='#4b5563', alpha=0.3)
ax.set_title('Straight', color='white', fontsize=13)
ax.set_xlim(0, 100)
ax.set_ylim(30, 70)
ax.axis('off')
ax.text(50, 33, 'Confined valley, steep gradient', ha='center', color='gray', fontsize=8)

# Meandering river
ax = axes[1]
ax.set_facecolor('#111827')
t = np.linspace(0, 4 * np.pi, 500)
x_m = t * 8
y_m = 50 + 15 * np.sin(t) + 5 * np.sin(2.3 * t)
width = 2.5
ax.fill_between(x_m, y_m - width, y_m + width, color='#3b82f6', alpha=0.6)
ax.plot(x_m, y_m, color='#60a5fa', linewidth=1)
# Oxbow lake
ox_theta = np.linspace(0.3, 2*np.pi - 0.3, 50)
ox_x = 52 + 8 * np.cos(ox_theta)
ox_y = 63 + 6 * np.sin(ox_theta)
ax.fill(ox_x, ox_y, color='#3b82f6', alpha=0.3)
ax.text(52, 63, 'oxbow\nlake', ha='center', va='center', color='#60a5fa', fontsize=7)
ax.set_title('Meandering', color='white', fontsize=13)
ax.set_xlim(0, 100)
ax.set_ylim(20, 85)
ax.axis('off')
ax.text(50, 23, 'Single channel, S-curves, flat plain', ha='center', color='gray', fontsize=8)

# Braided river
ax = axes[2]
ax.set_facecolor('#111827')
# Multiple channels
n_channels = 8
for c in range(n_channels):
    x_b = np.linspace(0, 100, 300)
    base_y = 50 + np.random.normal(0, 8)
    y_b = base_y + np.cumsum(np.random.normal(0, 0.8, len(x_b))) * 0.15
    w = np.random.uniform(0.5, 2.0)
    alpha = np.random.uniform(0.2, 0.5)
    ax.fill_between(x_b, y_b - w, y_b + w, color='#3b82f6', alpha=alpha)

# Sand bars
for _ in range(12):
    bx = np.random.uniform(10, 90)
    by = np.random.uniform(40, 60)
    bw = np.random.uniform(3, 8)
    bh = np.random.uniform(2, 5)
    ellipse = plt.matplotlib.patches.Ellipse((bx, by), bw, bh, color='#d4a574', alpha=0.6)
    ax.add_patch(ellipse)

ax.set_title('Braided', color='white', fontsize=13)
ax.set_xlim(0, 100)
ax.set_ylim(30, 70)
ax.axis('off')
ax.text(50, 33, 'Multiple channels, sand bars, high sediment', ha='center', color='gray', fontsize=8)

plt.suptitle('Three River Types', color='white', fontsize=15, y=1.02)
plt.tight_layout()
plt.show()

print("River type depends on two main factors:")
print("  1. Gradient (slope of the land)")
print("  2. Sediment load (how much sand/gravel the river carries)")
print()
print("  Steep + low sediment → Straight")
print("  Gentle + low sediment → Meandering")
print("  Gentle + high sediment → Braided")
print()
print("The Brahmaputra carries ~735 million tonnes of sediment per year,")
print("making it one of the most sediment-laden rivers on Earth.")`,
      challenge: 'Generate a transitional river that starts meandering upstream and becomes braided downstream. The Brahmaputra does this as it enters the Assam valley.',
      successHint: 'River type is not random — it is determined by the balance between the river\'s energy (slope, discharge) and its sediment load. Change either factor, and the river changes form.',
    },
    {
      title: 'Why rivers braid — the physics of channel splitting',
      concept: `Braiding happens when a river carries more sediment than it can transport. The excess sediment deposits in the channel, creating bars that force water to split around them. Here is the step-by-step process:

1. **Sediment overload**: the river receives more sand/gravel than its current can carry (from tributaries, bank erosion, or glacier melt)
2. **Bar formation**: the excess settles mid-channel, creating a mound
3. **Flow diversion**: water is forced around both sides of the bar
4. **Channel incision**: each side-channel is narrower, so water flows faster, eroding new paths
5. **Bar stabilisation**: if vegetation colonises the bar, it becomes an island
6. **Repeat**: each new channel can itself become overloaded and split again

**Key conditions for braiding:**
- High sediment supply (glacial outwash, monsoon erosion)
- Erodible banks (sand, gravel — not bedrock)
- Variable flow (floods bring surges of sediment)
- Low gradient (river lacks energy to carry everything)
- Wide valley (room to spread)

The Brahmaputra meets ALL these conditions: Himalayan sediment, sandy banks, monsoon floods, gentle gradient in Assam, and the wide Brahmaputra valley.`,
      analogy: 'Imagine walking through a crowded hallway carrying a stack of boxes. If you are running fast (steep gradient), you can carry them all. But if you slow down (gentle gradient), you start dropping boxes. Other people (water) have to walk around your dropped boxes (sand bars). The hallway splits into multiple lanes — braiding.',
      storyConnection: 'The fisherman in the story wonders why the river "couldn\'t make up its mind." The answer: it\'s not indecision, it\'s physics. The river has too much sediment for one channel. Splitting into many channels is the river\'s solution to an impossible transport problem — like a delivery company opening multiple routes when one road is congested.',
      checkQuestion: 'After a dam is built, rivers often change from braided to single-channel downstream. Why?',
      checkAnswer: 'Dams trap sediment in their reservoirs. The water released downstream is "hungry" — it has carrying capacity but no sediment to carry. So it picks up sediment from the channel bed and banks, eroding down into a single deeper channel instead of depositing bars. Less sediment in = less braiding. This "hungry water" effect has transformed rivers worldwide.',
      codeIntro: 'Simulate bar formation and channel splitting in a simple sediment transport model.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simple braiding simulation on a 2D grid
width, length = 60, 100
elevation = np.zeros((length, width))

# Initial slope (upstream to downstream)
for i in range(length):
    elevation[i, :] = (length - i) * 0.02

# Add initial channel (center)
for i in range(length):
    center = width // 2 + int(3 * np.sin(i / 10))
    for j in range(max(0, center-3), min(width, center+4)):
        elevation[i, j] -= 0.5

fig, axes = plt.subplots(2, 3, figsize=(15, 8))
fig.patch.set_facecolor('#1f2937')

# Simulate sediment deposition over time steps
steps = [0, 20, 50, 100, 200, 500]
elev_history = [elevation.copy()]

for step in range(1, max(steps) + 1):
    # Find lowest points (channels) in each row
    for i in range(1, length - 1):
        for j in range(1, width - 1):
            # Water flows to lowest neighbour
            neighbours = [elevation[i+1, j-1], elevation[i+1, j], elevation[i+1, j+1]]
            min_n = min(neighbours)

            if elevation[i, j] < np.mean(elevation[i, :]):
                # This is a channel: deposit sediment randomly
                if np.random.random() < 0.02:
                    elevation[i, j] += 0.01
                    # Erode nearby
                    jj = j + np.random.choice([-2, -1, 1, 2])
                    if 0 < jj < width:
                        elevation[i, jj] -= 0.005

    # Occasional flood: add sediment to channels
    if step % 50 == 0:
        for i in range(length):
            j_low = np.argmin(elevation[i, :])
            elevation[i, max(0,j_low-1):min(width,j_low+2)] += 0.03

    if step in steps:
        elev_history.append(elevation.copy())

for ax, elev, step in zip(axes.flat, elev_history, steps):
    ax.set_facecolor('#111827')
    # Create water mask: below mean elevation = water
    water = elev < np.percentile(elev, 30, axis=1, keepdims=True)
    display = np.where(water, -1, elev)

    from matplotlib.colors import LinearSegmentedColormap
    colors_cmap = ['#1e40af', '#3b82f6', '#d4a574', '#92702a', '#6b4a1e']
    cmap = LinearSegmentedColormap.from_list('river', colors_cmap, N=256)

    ax.imshow(display, cmap=cmap, aspect='auto', vmin=-1, vmax=np.max(elev))
    ax.set_title(f'Step {step}', color='white', fontsize=10)
    ax.set_ylabel('Downstream →', color='gray', fontsize=8)
    ax.tick_params(colors='gray', labelsize=7)

plt.suptitle('Braided River Formation: Sediment Deposition Over Time', color='white', fontsize=13, y=1.01)
plt.tight_layout()
plt.show()

print("Braiding process:")
print("  Step 0: Single channel")
print("  Step 20-50: First mid-channel bars form")
print("  Step 100: Multiple channels visible")
print("  Step 200-500: Complex braided pattern")
print()
print("Key driver: sediment deposition in the channel creates obstacles")
print("that force water to find new paths. Floods accelerate the process")
print("by dumping large amounts of sediment all at once.")`,
      challenge: 'Increase the flood frequency (change step % 50 to step % 20). Does more frequent flooding create more or fewer channels? How does this relate to the Brahmaputra\'s annual monsoon flooding?',
      successHint: 'Braiding is a self-organising process — no one designs the channel pattern. It emerges from simple rules: water flows downhill, sediment deposits when flow slows, new channels form around deposits. Complex patterns from simple physics.',
    },
    {
      title: 'Delta formation — where rivers meet the sea',
      concept: `When a river reaches the sea (or a lake), it slows dramatically. The current that carried sand and silt for hundreds of kilometres suddenly loses its power. The sediment drops — building a **delta**.

**Why "delta"?**
The Greek historian Herodotus named the Nile's fan-shaped deposit after the Greek letter delta (Δ) because of its triangular shape. Not all deltas are triangular, though:

**Delta types:**
- **Fan/arcuate delta**: classic fan shape (Nile, Ganges-Brahmaputra)
- **Bird's-foot delta**: channels extend like toes (Mississippi)
- **Cuspate delta**: tooth-shaped, pointed (Tiber, Ebro)
- **Estuarine/drowned**: river mouth flooded by rising sea (no delta forms)

**The Ganges-Brahmaputra Delta:**
- Largest delta on Earth: ~100,000 km²
- Built by combined sediment of the Ganges, Brahmaputra, and Meghna rivers
- Home to ~150 million people (Bangladesh + West Bengal)
- Includes the Sundarbans — world's largest mangrove forest
- Growing seaward at ~17 metres/year despite rising sea levels

**Delta formation process:**
1. River slows at the coast → sediment deposits
2. Deposits build up → river mouth extends seaward
3. Channel becomes elevated above surrounding land
4. Flood breaks through banks → new channel (avulsion)
5. New channel builds a new lobe
6. Process repeats, building a fan shape over centuries`,
      analogy: 'A delta is like the pile of snow at the bottom of a snow-plow\'s path. The plow (river) pushes snow (sediment) along the road (valley). When the road ends at a parking lot (ocean), the snow piles up in a fan shape. Over time, the pile grows outward. The plow must find new paths around its own pile.',
      storyConnection: 'The fisherman in the story notices the river "spreading its fingers into the sea." This is delta formation in action. Each "finger" is a distributary channel — a branch that split off from the main channel as sediment blocked the original path. The delta is the river\'s final artwork, built grain by grain over millennia.',
      checkQuestion: 'The Ganges-Brahmaputra delta is growing (adding land) even though sea levels are rising. How is that possible?',
      checkAnswer: 'The rivers deposit more sediment than the sea erodes. The delta is building upward and outward faster than the sea is rising — for now. But if sediment supply decreases (due to dams upstream) or sea level rise accelerates, the balance could tip. Parts of the delta are already sinking (subsidence from groundwater extraction), making them more vulnerable to flooding.',
      codeIntro: 'Simulate delta growth as sediment deposits where a river meets still water.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simple delta growth model
grid_size = 100
elevation = np.zeros((grid_size, grid_size))

# Sea level at y >= 60
sea_level = 0
coast_y = 60

# River enters from top centre
river_x, river_y = grid_size // 2, 0

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

snapshots = [100, 500, 1000, 2000, 5000, 10000]
snap_idx = 0

for step in range(max(snapshots) + 1):
    # Particle starts at river mouth
    px, py = river_x + np.random.randint(-2, 3), 0
    # Particle walks downstream with random lateral movement
    while 0 <= px < grid_size and py < grid_size:
        py += 1
        px += np.random.randint(-1, 2)
        px = np.clip(px, 0, grid_size - 1)

        # Once past coast, sediment may deposit
        if py >= coast_y - 5:
            # Probability of deposition increases with existing elevation
            # (sediment stacks) and distance from coast
            deposit_prob = 0.1 + 0.3 * (py - coast_y + 5) / grid_size
            if np.random.random() < deposit_prob:
                elevation[py, px] += 0.1
                # Spread slightly
                for dx in [-1, 0, 1]:
                    nx = px + dx
                    if 0 <= nx < grid_size:
                        elevation[py, nx] += 0.02
                break

    if step + 1 in snapshots:
        ax = axes.flat[snap_idx]
        ax.set_facecolor('#111827')

        # Display
        display = elevation.copy()
        # Water: below sea level and past coast
        water_mask = (elevation <= sea_level) & (np.arange(grid_size)[:, None] >= coast_y - 5)
        land_mask = elevation > sea_level

        from matplotlib.colors import LinearSegmentedColormap
        colors_list = ['#1e3a5f', '#1e40af', '#3b82f6', '#d4a574', '#92702a', '#6b4a1e']
        cmap = LinearSegmentedColormap.from_list('delta', colors_list, N=256)

        im = ax.imshow(display, cmap=cmap, vmin=-0.1, vmax=np.percentile(elevation, 99) + 0.1,
                        aspect='equal')
        ax.axhline(coast_y, color='#60a5fa', linestyle='--', alpha=0.3, linewidth=0.5)
        ax.set_title(f'{step+1} sediment particles', color='white', fontsize=10)
        ax.tick_params(colors='gray', labelsize=7)

        snap_idx += 1

plt.suptitle('Delta Growth Simulation', color='white', fontsize=14, y=1.01)
plt.tight_layout()
plt.show()

# Calculate delta area
final_delta_area = np.sum(elevation[coast_y:, :] > 0.3)
print(f"Delta growth after {max(snapshots)} particles:")
print(f"  New land area: {final_delta_area} grid cells")
print(f"  Maximum elevation: {np.max(elevation):.1f} units")
print()
print("Real-world delta growth rates:")
print("  Ganges-Brahmaputra: ~17m/year seaward")
print("  Mississippi: variable (parts eroding now)")
print("  Nile: shrinking since Aswan Dam (1970)")`,
      challenge: 'Add a second river entering from a different point. How do the two deltas interact? Do they merge or stay separate? The Ganges-Brahmaputra delta is built by multiple rivers converging.',
      successHint: 'Deltas are among the most dynamic and productive landscapes on Earth. They are also the most vulnerable to climate change — rising seas, reduced sediment (from dams), and subsidence threaten hundreds of millions of people living on deltas worldwide.',
    },
    {
      title: 'Sediment sorting — how rivers organise particles by size',
      concept: `Rivers are natural sorting machines. As water slows down, it drops particles in order of size — largest first, smallest last. This is called **sediment sorting** or **grading**.

**Hjulstrom's diagram** (1935) shows the relationship between water velocity and sediment behaviour:
- **Erosion**: fast water picks up particles from the bed
- **Transport**: moving water keeps particles suspended
- **Deposition**: slow water drops particles

The key insight: larger particles need faster water to move, so they deposit first when velocity decreases. The result is a predictable pattern from mountains to sea:
- **Mountains**: boulders, cobbles (fast water)
- **Foothills**: gravel, pebbles (moderate water)
- **Plains**: sand, silt (slower water)
- **Delta/coast**: fine silt, clay (very slow water)

Within a braided river like the Brahmaputra:
- Channel centres: coarse sand, gravel (fastest flow)
- Channel margins: fine sand (slower flow)
- Floodplain: silt and clay (deposited during floods)
- Char/island surfaces: stratified layers from repeated floods`,
      analogy: 'Sediment sorting is like shaking a jar of mixed nuts. The largest nuts (Brazil nuts) end up on top, and the smallest (peanuts) fall to the bottom. In a river, the "shaking" is water velocity. High velocity keeps everything suspended; as velocity drops, things settle out by size — heaviest (largest) first.',
      storyConnection: 'The fisherman in the story notices different colours of sand on different islands. Each colour comes from different minerals carried at different speeds. The Brahmaputra\'s famous white sand comes from Himalayan quartz (harder, survives transport). The dark sand is heavier minerals (magnetite, ilmenite) that deposit in specific zones.',
      checkQuestion: 'Alluvial gold mining works because gold particles sort out in predictable locations in a river. Where would you look for gold?',
      checkAnswer: 'On the inside of bends (point bars) and behind large obstacles. Gold is very dense (19.3 g/cm3 vs. 2.65 for quartz sand). It drops out of suspension first when water slows — which happens on the inner bank of meanders and in eddies behind boulders. Gold miners call these locations "traps." The river does the sorting for free.',
      codeIntro: 'Model sediment sorting using Hjulstrom\'s curve: velocity vs particle size for erosion, transport, and deposition.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hjulstrom diagram (simplified)
particle_size = np.logspace(-3, 2, 200)  # mm (clay to boulders)

# Erosion velocity (U-shaped: fine particles are cohesive)
erosion_v = np.where(particle_size < 0.1,
                      50 * (0.1 / particle_size)**0.5,  # cohesive sediment (clay/silt)
                      20 * (particle_size / 0.1)**0.5)   # non-cohesive

# Deposition velocity (monotonically increasing)
deposition_v = 0.5 * particle_size**0.8

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Hjulstrom diagram
ax1.set_facecolor('#111827')
ax1.fill_between(particle_size, erosion_v, 500, alpha=0.2, color='#ef4444', label='Erosion zone')
ax1.fill_between(particle_size, deposition_v, erosion_v, alpha=0.2, color='#f59e0b', label='Transport zone')
ax1.fill_between(particle_size, 0.01, deposition_v, alpha=0.2, color='#22c55e', label='Deposition zone')
ax1.plot(particle_size, erosion_v, color='#ef4444', linewidth=2)
ax1.plot(particle_size, deposition_v, color='#22c55e', linewidth=2)

ax1.set_xscale('log')
ax1.set_yscale('log')
ax1.set_xlim(0.001, 100)
ax1.set_ylim(0.1, 500)

# Label particle sizes
sizes = {'Clay': 0.002, 'Silt': 0.05, 'Sand': 0.5, 'Gravel': 10, 'Cobble': 100}
for name, size in sizes.items():
    ax1.axvline(size, color='gray', linestyle=':', alpha=0.3)
    ax1.text(size, 0.15, name, color='gray', fontsize=8, ha='center', rotation=90)

ax1.set_xlabel('Particle size (mm)', color='white')
ax1.set_ylabel('Water velocity (cm/s)', color='white')
ax1.set_title('Hjulstrom Diagram', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Sediment profile from mountains to sea
ax2.set_facecolor('#111827')
locations = ['Mountains', 'Foothills', 'Plains', 'Delta', 'Coast']
x_pos = range(len(locations))
avg_size = [50, 10, 0.5, 0.05, 0.005]  # mm
avg_velocity = [200, 80, 30, 5, 1]  # cm/s
bar_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

ax2_v = ax2.twinx()
bars = ax2.bar(x_pos, avg_size, color=bar_colors, alpha=0.7, width=0.4, label='Particle size (mm)')
ax2.set_yscale('log')
ax2.set_ylabel('Average particle size (mm)', color='#f59e0b')

line = ax2_v.plot(x_pos, avg_velocity, 'o-', color='white', linewidth=2, markersize=8, label='Water velocity')
ax2_v.set_ylabel('Water velocity (cm/s)', color='white')
ax2_v.set_yscale('log')

ax2.set_xticks(x_pos)
ax2.set_xticklabels(locations, color='white')
ax2.set_title('Sediment Sorting: Mountains → Sea', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2_v.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Sediment sorting from mountains to sea:")
for loc, size, vel in zip(locations, avg_size, avg_velocity):
    print(f"  {loc}: {size}mm particles, {vel} cm/s flow")
print()
print("Surprise from Hjulstrom: clay is HARDER to erode than sand!")
print("Clay particles stick together (cohesion). You need high velocity")
print("to rip them loose, but once moving, they stay suspended at low velocity.")`,
      challenge: 'The Brahmaputra carries mostly medium sand (0.1-0.5mm). Mark this range on the Hjulstrom diagram. What velocity does the river need to transport it? What velocity causes deposition? The difference between these two velocities determines how sensitive the braiding pattern is to flow changes.',
      successHint: 'Sediment sorting is not just geology — it is applied everywhere. Water treatment plants use settling tanks (same physics). Construction separates aggregate by size. Even blood cells sort by size in centrifuges. Stokes\' law governs them all.',
    },
    {
      title: 'Satellite views of rivers — reading landscapes from space',
      concept: `Satellite imagery has revolutionised river science. Before satellites, understanding a braided river like the Brahmaputra required dangerous boat surveys. Now we can see the entire channel pattern at once.

**What satellites reveal about rivers:**
- **Channel migration**: comparing images over years shows how channels shift. The Brahmaputra's main channel has migrated up to 15 km in a decade
- **Sediment plumes**: turbid water carrying sediment appears brown/tan from space. The Brahmaputra's plume extends 100+ km into the Bay of Bengal
- **Flood extent**: comparing dry-season and monsoon images reveals flood areas
- **Land use change**: deforestation upstream → more erosion → more sediment → more braiding
- **Island dynamics**: chars (mid-channel islands) in the Brahmaputra appear and disappear over years

**Key satellite sensors for rivers:**
- **Landsat** (30m resolution, since 1972): long-term change detection
- **Sentinel-2** (10m, since 2015): detailed channel mapping
- **SAR (radar)**: sees through clouds — critical during monsoon
- **LIDAR**: measures elevation with centimetre accuracy for flood modelling

**Google Earth Engine** gives researchers free access to decades of satellite data, enabling anyone to study river change from their laptop.`,
      analogy: 'Satellite river monitoring is like watching a time-lapse video from a helicopter. On the ground, a river seems permanent. From space, over decades, it writhes like a living thing — channels shifting, islands forming, floods spreading. The river is not a static feature on a map; it is a dynamic system in constant motion.',
      storyConnection: 'The fisherman in the story sees the river from his boat — one channel at a time. If he could see the satellite view, he would see the entire braided pattern: hundreds of channels, dozens of islands, and the annual flood pulse that rearranges everything. Satellite technology has given us the fisherman\'s ultimate dream: a god\'s-eye view of the river.',
      checkQuestion: 'Why does the Brahmaputra appear bright white/tan in satellite images while the nearby Meghna river appears dark/clear?',
      checkAnswer: 'Sediment concentration. The Brahmaputra carries ~735 million tonnes/year of Himalayan sediment, turning it opaque and reflective. The Meghna drains the low-lying Sylhet plains with much less erosion, so its water is relatively clear. From space, turbid water reflects more sunlight (appears bright), while clear water absorbs it (appears dark).',
      codeIntro: 'Create a synthetic satellite-style visualisation of a braided river system.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

def generate_braided_river(seed, n_channels=12, width=200, height=300):
    """Generate a synthetic braided river pattern"""
    np.random.seed(seed)
    img = np.zeros((height, width, 3))

    # Background: land (dark green/brown)
    img[:, :, 0] = 0.15 + np.random.normal(0, 0.02, (height, width))
    img[:, :, 1] = 0.25 + np.random.normal(0, 0.02, (height, width))
    img[:, :, 2] = 0.1 + np.random.normal(0, 0.02, (height, width))

    # River channels
    for _ in range(n_channels):
        x = np.random.randint(60, 140)
        channel_width = np.random.randint(2, 8)
        turbidity = np.random.uniform(0.5, 1.0)  # sediment concentration

        for y in range(height):
            x += np.random.randint(-2, 3)
            x = np.clip(x, 10, width - 10)
            w = channel_width + np.random.randint(-1, 2)
            for dx in range(-w, w + 1):
                xx = x + dx
                if 0 <= xx < width:
                    # Water colour: turquoise-brown based on turbidity
                    img[y, xx, 0] = 0.2 * turbidity + 0.1
                    img[y, xx, 1] = 0.3 * (1 - turbidity) + 0.2
                    img[y, xx, 2] = 0.4 * (1 - turbidity) + 0.15

    # Sand bars (tan/white)
    for _ in range(20):
        bx = np.random.randint(70, 130)
        by = np.random.randint(20, height - 20)
        bw = np.random.randint(3, 12)
        bh = np.random.randint(5, 20)
        for dy in range(-bh, bh + 1):
            for dx in range(-bw, bw + 1):
                if dx**2/bw**2 + dy**2/bh**2 < 1:
                    yy, xx = by + dy, bx + dx
                    if 0 <= yy < height and 0 <= xx < width:
                        img[yy, xx] = [0.75, 0.65, 0.5]

    return np.clip(img, 0, 1)

# Dry season
dry = generate_braided_river(42, n_channels=8)
ax1.imshow(dry, aspect='auto')
ax1.set_title('Dry Season (January)', color='white', fontsize=12)
ax1.text(100, 290, 'Flow →', ha='center', color='white', fontsize=10)
ax1.axis('off')

# Monsoon (more channels, wider, more turbid)
wet = generate_braided_river(43, n_channels=20, width=200, height=300)
# Make everything more watery
wet[:, 50:150, 0] *= 0.7
wet[:, 50:150, 1] *= 0.8
wet[:, 50:150, 2] *= 1.2
wet = np.clip(wet, 0, 1)
ax2.imshow(wet, aspect='auto')
ax2.set_title('Monsoon (August)', color='white', fontsize=12)
ax2.text(100, 290, 'Flow →', ha='center', color='white', fontsize=10)
ax2.axis('off')

# Scale bars
for ax in [ax1, ax2]:
    ax.plot([10, 30], [285, 285], color='white', linewidth=2)
    ax.text(20, 280, '5 km', ha='center', color='white', fontsize=8)

plt.suptitle('Synthetic Satellite View: Braided River (Dry vs Monsoon)', color='white', fontsize=14, y=1.01)
plt.tight_layout()
plt.show()

print("Satellite observations of the Brahmaputra:")
print("  Dry season width: ~3-5 km")
print("  Monsoon width: ~10-15 km")
print("  Annual channel migration: up to 1-2 km/year")
print("  Sediment plume visible: 100+ km into Bay of Bengal")
print()
print("Key remote sensing indices for rivers:")
print("  NDWI (Normalised Difference Water Index): maps water extent")
print("  Turbidity index: estimates sediment concentration")
print("  MNDWI: distinguishes water from urban areas")`,
      challenge: 'Create a third panel showing "change detection" — subtract the dry-season image from the monsoon image. Areas that changed from land to water (flooded) should appear in blue. This is how flood maps are made from satellite data.',
      successHint: 'Satellite remote sensing has made it possible to study rivers at scales and frequencies that were impossible before. The Brahmaputra, once too dangerous and vast to survey, can now be monitored daily from space.',
    },
    {
      title: 'Human impact on rivers — dams, mining, and climate change',
      concept: `Humans have altered nearly every major river on Earth. Understanding these impacts is critical because rivers provide water, food, transport, and power to billions of people.

**Dams:**
- >59,000 large dams worldwide, blocking ~65% of river flow to the sea
- Trap 25-30% of global sediment (causing "hungry water" downstream)
- Reduce flooding (removing natural floodplain fertilisation)
- Fragment river ecosystems (blocking fish migration)
- The Brahmaputra has few dams (political complexity of China/India/Bangladesh), which is why it remains one of the world's wildest rivers

**Sand mining:**
- Sand is the second most consumed natural resource after water
- River sand is preferred for construction (smooth, round grains)
- Excessive mining deepens channels, collapses banks, destroys habitats
- The Brahmaputra and its tributaries face severe illegal sand mining
- A single housing boom in a city can strip-mine an entire river reach

**Climate change:**
- Himalayan glaciers retreating → initially more meltwater, eventually less
- Changing monsoon patterns → more extreme floods AND droughts
- Sea level rise → delta flooding, saltwater intrusion
- The Brahmaputra basin faces all three threats simultaneously

These changes are not theoretical — they are happening now, affecting millions of people who depend on the river for their livelihoods.`,
      analogy: 'A river system is like the body\'s circulatory system. Dams are like blood clots (blocking flow). Sand mining is like removing sections of blood vessel wall (weakening the system). Climate change is like altering the heart\'s rhythm (changing the flood pulse). Each stress alone is manageable; all three together can be fatal.',
      storyConnection: 'The fisherman in the story notices the river "is not what it was in my grandfather\'s time." This is not nostalgia — it is observation. Rivers change on human timescales when we alter sediment supply, flow, and climate. The fisherman\'s knowledge, accumulated over generations, is a valuable record of change that complements satellite data.',
      checkQuestion: 'China is building several large dams on the Yarlung Tsangpo (the Brahmaputra\'s name in Tibet). What will this do to the river in Assam?',
      checkAnswer: 'The dams will trap sediment (reducing supply to Assam), regulate flow (reducing monsoon floods but also dry-season flow), and lower the riverbed downstream (hungry water erosion). This could reduce braiding, starve the Ganges-Brahmaputra delta of new sediment, and disrupt ecosystems that depend on the natural flood pulse. It is one of the most consequential dam projects on Earth.',
      codeIntro: 'Model the impact of a dam on downstream sediment supply and channel form.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Model: downstream sediment supply and river width over time
years = np.arange(1960, 2060)
dam_year = 2000

# Sediment supply (million tonnes/year)
sed_natural = 735  # current Brahmaputra
sed_supply = np.where(years < dam_year, sed_natural,
                       sed_natural * np.exp(-0.03 * (years - dam_year)) + 200)

# River braiding index (higher = more braided)
braid_index = 0.3 + 0.7 * (sed_supply / sed_natural)

# Channel depth (deeper when less sediment — hungry water erosion)
channel_depth = np.where(years < dam_year, 10,
                          10 + 3 * (1 - np.exp(-0.05 * (years - dam_year))))

# Flood peak (dam reduces peaks)
flood_peak = np.where(years < dam_year, 50000,
                       50000 * (0.6 + 0.4 * np.exp(-0.1 * (years - dam_year))))
# Add noise
flood_peak += np.random.normal(0, 2000, len(years))

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Sediment supply
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(years, sed_supply, color='#f59e0b', linewidth=2)
ax.fill_between(years, sed_supply, alpha=0.15, color='#f59e0b')
ax.axvline(dam_year, color='#ef4444', linestyle='--', alpha=0.7)
ax.text(dam_year + 1, sed_natural * 0.9, 'Dam built', color='#ef4444', fontsize=9)
ax.set_ylabel('Sediment (Mt/yr)', color='white')
ax.set_title('Sediment Supply', color='#f59e0b', fontsize=11)
ax.tick_params(colors='gray')

# Braiding index
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(years, braid_index, color='#3b82f6', linewidth=2)
ax.fill_between(years, braid_index, alpha=0.15, color='#3b82f6')
ax.axvline(dam_year, color='#ef4444', linestyle='--', alpha=0.7)
ax.set_ylabel('Braiding index', color='white')
ax.set_title('Channel Pattern', color='#3b82f6', fontsize=11)
ax.tick_params(colors='gray')

# Channel depth
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(years, channel_depth, color='#22c55e', linewidth=2)
ax.fill_between(years, channel_depth, alpha=0.15, color='#22c55e')
ax.axvline(dam_year, color='#ef4444', linestyle='--', alpha=0.7)
ax.set_ylabel('Channel depth (m)', color='white')
ax.set_title('Bed Erosion (hungry water)', color='#22c55e', fontsize=11)
ax.set_xlabel('Year', color='white')
ax.tick_params(colors='gray')

# Flood peak
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(years, flood_peak, color='#a855f7', linewidth=1, alpha=0.7)
flood_smooth = np.convolve(flood_peak, np.ones(5)/5, mode='same')
ax.plot(years, flood_smooth, color='#a855f7', linewidth=2)
ax.axvline(dam_year, color='#ef4444', linestyle='--', alpha=0.7)
ax.set_ylabel('Flood peak (m³/s)', color='white')
ax.set_title('Annual Flood Magnitude', color='#a855f7', fontsize=11)
ax.set_xlabel('Year', color='white')
ax.tick_params(colors='gray')

plt.suptitle('Impact of Upstream Dam on a Braided River', color='white', fontsize=14, y=1.01)
plt.tight_layout()
plt.show()

print("Post-dam changes (projected 60 years):")
print(f"  Sediment supply: {sed_natural} → {sed_supply[-1]:.0f} Mt/yr ({(1-sed_supply[-1]/sed_natural)*100:.0f}% reduction)")
print(f"  Braiding index: {braid_index[0]:.2f} → {braid_index[-1]:.2f} (less braided)")
print(f"  Channel depth: {channel_depth[0]:.0f} → {channel_depth[-1]:.1f} m (deeper)")
print(f"  Flood peak: reduced by ~{(1-flood_peak[-1]/50000)*100:.0f}%")
print()
print("The Brahmaputra currently has no major dams in Assam.")
print("If upstream dams in China trap sediment, the effects")
print("would cascade through the entire downstream system.")`,
      challenge: 'Add a sand mining component: 50 Mt/yr removed from the channel starting in 2010. How does this interact with the dam\'s sediment reduction? Combined stresses are often worse than the sum of individual stresses.',
      successHint: 'From river types to sediment physics to satellite monitoring to human impacts, you now have a foundation in river geomorphology. Level 2 goes deeper into the mathematics — stream power equations, sediment transport formulas, and computational river models.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">River Geomorphology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for river science simulations. Click to start.</p>
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
