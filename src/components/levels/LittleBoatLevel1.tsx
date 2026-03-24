import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function LittleBoatLevel1() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'What is buoyancy — why things float',
      concept: `When the boy in our story placed his little boat on the Brahmaputra, it floated. But why? Why does a heavy wooden boat float while a small pebble sinks? The answer is **buoyancy** — an upward force that any fluid exerts on an object placed in it.

Every object submerged in water experiences two forces:
- **Gravity** pulling it down (its weight)
- **Buoyant force** pushing it up (from the water below)

If the buoyant force equals or exceeds the weight, the object floats. If the weight wins, it sinks. This is why a steel ship floats — it's shaped to displace enough water that the buoyant force matches its enormous weight. A solid steel ball of the same mass would sink.

The buoyant force exists because water pressure increases with depth. The bottom of a submerged object feels more pressure (more force pushing up) than the top (less force pushing down). The difference is the buoyant force.`,
      analogy: 'Imagine standing in a crowded room and someone tries to push a beach ball down into the crowd. The people at the bottom push back harder than the people at the top push down — the ball pops back up. Water molecules behave the same way: deeper water pushes harder, creating an upward net force.',
      storyConnection: 'The boy built his boat from bamboo and sal wood — materials less dense than water. But even the shape mattered. A flat-bottomed design displaced more water for the same weight, giving the boat more buoyancy. The Brahmaputra fishermen have known this for centuries without ever writing an equation.',
      checkQuestion: 'A steel ship weighing 50,000 tonnes floats, but a 1 kg steel bolt sinks. Both are made of steel. Why does shape matter?',
      checkAnswer: 'The ship is hollow — it encloses a huge volume of air. This makes its average density (total mass / total volume) less than water. The bolt is solid steel (density ~7,800 kg/m³, much more than water\'s 1,000 kg/m³). Shape determines the volume of water displaced, and that determines buoyancy.',
      codeIntro: 'Visualize the forces acting on objects of different densities in water.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Compare objects with different densities
objects = ['Cork', 'Bamboo', 'Sal wood', 'Water', 'Steel bolt', 'Lead']
densities = [120, 350, 590, 1000, 7800, 11340]  # kg/m³
colors_list = ['#22c55e', '#22c55e', '#22c55e', '#3b82f6', '#ef4444', '#ef4444']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Bar chart of densities
ax1.set_facecolor('#111827')
bars = ax1.barh(objects, densities, color=colors_list, edgecolor='none')
ax1.axvline(1000, color='#3b82f6', linestyle='--', linewidth=2, label='Water density (1000 kg/m³)')
ax1.set_xlabel('Density (kg/m³)', color='white')
ax1.set_title('Object Densities: Float or Sink?', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
for bar, d in zip(bars, densities):
    label = 'FLOATS' if d < 1000 else ('NEUTRAL' if d == 1000 else 'SINKS')
    ax1.text(bar.get_width() + 100, bar.get_y() + bar.get_height()/2,
             f'{d} kg/m³ — {label}', va='center', color='white', fontsize=9)

# Force diagram for a floating boat
ax2.set_facecolor('#111827')
ax2.set_xlim(-3, 3)
ax2.set_ylim(-3, 3)
ax2.set_aspect('equal')

# Water
ax2.axhspan(-3, 0, color='#1e40af', alpha=0.3)
ax2.text(0, -2.5, 'WATER', ha='center', color='#60a5fa', fontsize=12, alpha=0.7)
ax2.text(0, 1.5, 'AIR', ha='center', color='gray', fontsize=12, alpha=0.5)

# Boat shape (trapezoid)
boat_x = [-1.5, -1.2, 1.2, 1.5]
boat_y = [-0.5, 0.3, 0.3, -0.5]
ax2.fill(boat_x, boat_y, color='#92400e', alpha=0.8)
ax2.plot(boat_x + [boat_x[0]], boat_y + [boat_y[0]], color='#f59e0b', linewidth=2)

# Weight arrow (down)
ax2.annotate('', xy=(0, -1.5), xytext=(0, 0),
            arrowprops=dict(arrowstyle='->', color='#ef4444', lw=3))
ax2.text(0.3, -0.8, 'Weight\n(gravity)', color='#ef4444', fontsize=10)

# Buoyant force arrow (up)
ax2.annotate('', xy=(0, 1.5), xytext=(0, 0),
            arrowprops=dict(arrowstyle='->', color='#22c55e', lw=3))
ax2.text(0.3, 0.8, 'Buoyant\nforce', color='#22c55e', fontsize=10)

ax2.set_title('Forces on a Floating Boat', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.set_xticks([])
ax2.set_yticks([])

plt.tight_layout()
plt.show()

print("Rule: if object density < water density (1000 kg/m³), it floats")
print(f"  Cork ({densities[0]} kg/m³): floats high")
print(f"  Bamboo ({densities[1]} kg/m³): floats well — great boat material!")
print(f"  Sal wood ({densities[2]} kg/m³): floats but sits lower")
print(f"  Steel ({densities[4]} kg/m³): sinks as solid, floats as hollow ship")`,
      challenge: 'Add "Ice" to the objects list with density 917 kg/m³. What fraction of an iceberg sits below the waterline? (Hint: the fraction submerged = object density / water density)',
      successHint: 'Buoyancy is why boats float, icebergs are mostly underwater, and hot air balloons rise. It is the foundation of all naval engineering — and the boy on the Brahmaputra understood it intuitively.',
    },
    {
      title: "Archimedes' principle — the displaced water rule",
      concept: `Around 250 BCE, the Greek mathematician Archimedes discovered a beautifully simple rule: **the buoyant force on an object equals the weight of the fluid it displaces**.

This means:
- Drop a 1-litre block into water → it pushes aside 1 litre of water → the buoyant force equals the weight of 1 litre of water (about 9.8 N)
- A floating object displaces exactly its own weight in water
- A sinking object displaces a volume of water equal to the object's own volume

The equation: **F_buoyancy = ρ_fluid × V_displaced × g**

Where:
- ρ_fluid = density of the fluid (1000 kg/m³ for fresh water)
- V_displaced = volume of fluid pushed aside by the object
- g = gravitational acceleration (9.8 m/s²)

This single equation explains why ships float, submarines dive, and fish control their depth.`,
      analogy: 'Imagine getting into a full bathtub. Water spills over the edge. The amount that spills out weighs exactly as much as the upward push you feel from the water. Archimedes supposedly discovered this while taking a bath and ran through the streets shouting "Eureka!" — though that part may be legend.',
      storyConnection: 'When the boy loaded his boat with supplies for the river crossing, it sat deeper in the water. Each kilogram of cargo made the boat displace one more litre of Brahmaputra water. If he loaded too much, the water would reach the gunwale and the boat would swamp — a danger every river boatman respects.',
      checkQuestion: 'A block of wood (density 600 kg/m³) measuring 10cm × 10cm × 10cm is placed in water. How deep does it sink?',
      checkAnswer: 'The block weighs 0.6 kg (600 kg/m³ × 0.001 m³). To float, it must displace 0.6 kg of water = 0.6 litres = 600 cm³. The base is 10×10 = 100 cm², so it sinks 600/100 = 6 cm deep. The fraction submerged = density_object/density_water = 600/1000 = 60%.',
      codeIntro: 'Calculate and visualize how deep different materials sink in water.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Archimedes' principle: fraction submerged = density_object / density_fluid
materials = ['Balsa wood', 'Bamboo', 'Oak', 'Coconut', 'Human body']
densities = [160, 350, 750, 560, 1010]  # kg/m³
water_density = 1000  # kg/m³

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Fraction submerged bar chart
ax1.set_facecolor('#111827')
fractions = [min(d / water_density, 1.0) for d in densities]
colors_bar = ['#22c55e' if f < 1 else '#ef4444' for f in fractions]
bars = ax1.bar(materials, [f * 100 for f in fractions], color=colors_bar, edgecolor='none')
ax1.axhline(100, color='#ef4444', linestyle='--', linewidth=1, alpha=0.5)
ax1.set_ylabel('Percent submerged (%)', color='white')
ax1.set_title("Archimedes' Principle: How Deep Things Sink", color='white', fontsize=13)
ax1.tick_params(colors='gray', axis='both')
ax1.set_xticklabels(materials, rotation=20, ha='right')
for bar, f, d in zip(bars, fractions, densities):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2,
             f'{f*100:.0f}%', ha='center', color='white', fontsize=10)

# Visual cross-section of a floating block
ax2.set_facecolor('#111827')
ax2.set_xlim(-2, 2)
ax2.set_ylim(-1.5, 1.5)

# Water
ax2.axhspan(-1.5, 0, color='#1e40af', alpha=0.3)

# Block (bamboo, 35% submerged)
block_frac = 0.35
block_height = 1.0
submerged = block_frac * block_height
above = block_height - submerged

# Draw block
rect_x = [-0.5, 0.5, 0.5, -0.5, -0.5]
rect_y = [-submerged, -submerged, above, above, -submerged]
ax2.fill(rect_x, rect_y, color='#92400e', alpha=0.8)
ax2.plot(rect_x, rect_y, color='#f59e0b', linewidth=2)

# Water line
ax2.axhline(0, color='#60a5fa', linewidth=2, linestyle='-')
ax2.text(1.0, 0.05, 'Waterline', color='#60a5fa', fontsize=10)

# Labels
ax2.annotate(f'{above/block_height*100:.0f}% above', xy=(0, above/2),
            color='#f59e0b', fontsize=11, ha='center', fontweight='bold')
ax2.annotate(f'{block_frac*100:.0f}% below', xy=(0, -submerged/2),
            color='#60a5fa', fontsize=11, ha='center', fontweight='bold')

ax2.set_title('Bamboo block in water', color='white', fontsize=13)
ax2.set_xticks([])
ax2.set_yticks([])

plt.tight_layout()
plt.show()

print("Archimedes' Principle in action:")
for mat, d, f in zip(materials, densities, fractions):
    status = "sinks" if f >= 1 else f"floats ({f*100:.0f}% submerged)"
    print(f"  {mat} ({d} kg/m³): {status}")
print()
print("Key insight: fraction submerged = object density / fluid density")
print("Salt water (1025 kg/m³) is denser than fresh water (1000 kg/m³),")
print("so you float higher in the ocean than in the Brahmaputra.")`,
      challenge: 'The Dead Sea has water density ~1240 kg/m³ (very salty). Calculate the fraction submerged for a human body (1010 kg/m³) in the Dead Sea vs. fresh water. Why can people "sit" on Dead Sea water?',
      successHint: 'Archimedes\' principle is used every day by ship designers calculating how much cargo a vessel can carry. The "load line" painted on every cargo ship is a direct application of this 2,000-year-old discovery.',
    },
    {
      title: 'Displacement — the water a boat pushes aside',
      concept: `When the boy slid his boat into the Brahmaputra, the water level around it rose slightly. The boat **displaced** water — pushed it out of the way to make room for itself. The volume of water displaced is the key to understanding whether something floats or sinks.

For a floating object, the mass of displaced water equals the mass of the object. This gives us a way to calculate exactly how much of the boat sits below the waterline — the **draft**.

**Draft** is the depth of water a boat needs to float. It depends on:
- The boat's total weight (including cargo and passengers)
- The shape of the hull below the waterline
- The density of the water (salt water is denser, so the draft is less)

Brahmaputra river boats traditionally have shallow drafts because the river has many sandbars and shifting channels. A deep-draft ocean vessel would run aground within minutes.`,
      analogy: 'Displacement is like sitting on a waterbed. Your body pushes the water inside the bed out of the way, creating a depression. The heavier you are, the deeper the depression. If you put too much weight on a small waterbed, the water can not move aside fast enough and the bed bursts — just like an overloaded boat swamps.',
      storyConnection: 'The boy had to calculate how much weight his little boat could carry. He needed enough supplies for the crossing but could not overload it. Every fisherman on the Brahmaputra knows their boat\'s limit by feel — they are doing displacement calculations intuitively, every single day.',
      checkQuestion: 'A rectangular barge is 10m long, 4m wide, and currently has a draft of 1m in fresh water. How much does it weigh?',
      checkAnswer: 'Volume displaced = 10 × 4 × 1 = 40 m³. Mass of water displaced = 40 m³ × 1000 kg/m³ = 40,000 kg = 40 tonnes. Since it is floating, the barge weighs 40 tonnes. If you add 10 tonnes of cargo, the draft increases to 1.25m (50 m³ displaced).',
      codeIntro: 'Simulate loading cargo onto a boat and watch the draft change.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Rectangular boat parameters
length = 5.0  # meters
width = 1.5   # meters
boat_mass = 200  # kg (empty boat)
max_height = 0.8  # meters (sides of the boat)
water_density = 1000  # kg/m³

# Loading cargo step by step
cargo_masses = np.arange(0, 5001, 100)  # 0 to 5000 kg
total_masses = boat_mass + cargo_masses

# Draft = total_mass / (water_density * length * width)
drafts = total_masses / (water_density * length * width)

# Freeboard = max_height - draft (how much hull is above water)
freeboards = max_height - drafts

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Draft vs cargo
ax1.set_facecolor('#111827')
safe = freeboards > 0.1  # safe if >10cm freeboard
danger = (freeboards <= 0.1) & (freeboards > 0)
swamped = freeboards <= 0

ax1.plot(cargo_masses[safe], drafts[safe] * 100, color='#22c55e', linewidth=2, label='Safe')
ax1.plot(cargo_masses[danger], drafts[danger] * 100, color='#f59e0b', linewidth=2, label='Danger zone')
ax1.plot(cargo_masses[swamped], drafts[swamped] * 100, color='#ef4444', linewidth=2, label='Swamped!')

ax1.axhline(max_height * 100, color='#ef4444', linestyle='--', linewidth=1, label=f'Gunwale ({max_height*100:.0f}cm)')
ax1.set_xlabel('Cargo mass (kg)', color='white')
ax1.set_ylabel('Draft (cm)', color='white')
ax1.set_title('Loading the Boat: Draft vs Cargo', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Cross-section view at different loads
ax2.set_facecolor('#111827')
loads = [0, 1500, 3500, 5000]
for i, cargo in enumerate(loads):
    x_offset = i * 3
    total = boat_mass + cargo
    draft = total / (water_density * length * width)
    freeboard = max_height - draft

    # Water
    ax2.fill([x_offset - 1, x_offset + 1, x_offset + 1, x_offset - 1],
             [-1.5, -1.5, 0, 0], color='#1e40af', alpha=0.2)

    # Boat hull
    hull_bottom = -draft
    hull_top = max_height - draft
    ax2.fill([x_offset - 0.6, x_offset + 0.6, x_offset + 0.6, x_offset - 0.6],
             [hull_bottom, hull_bottom, hull_top, hull_top],
             color='#92400e' if freeboard > 0 else '#ef4444', alpha=0.8)

    # Water line
    ax2.axhline(0, color='#60a5fa', linewidth=0.5, alpha=0.3)

    status = 'Empty' if cargo == 0 else f'{cargo}kg'
    color = '#22c55e' if freeboard > 0.1 else ('#f59e0b' if freeboard > 0 else '#ef4444')
    ax2.text(x_offset, hull_top + 0.15, status, ha='center', color=color, fontsize=9, fontweight='bold')
    ax2.text(x_offset, hull_bottom - 0.2, f'{draft*100:.0f}cm', ha='center', color='#60a5fa', fontsize=8)

ax2.set_xlim(-1.5, 10.5)
ax2.set_ylim(-1.5, 1.5)
ax2.set_title('Cross-sections at different loads', color='white', fontsize=13)
ax2.set_xticks([])
ax2.set_yticks([])

plt.tight_layout()
plt.show()

max_cargo = (max_height * water_density * length * width) - boat_mass
print(f"Boat: {length}m x {width}m, sides {max_height}m high, mass {boat_mass}kg")
print(f"Maximum safe cargo: {max_cargo:.0f} kg")
print(f"That's before water reaches the gunwale.")
print(f"In practice, you'd want at least 10cm of freeboard for waves.")
safe_cargo = ((max_height - 0.1) * water_density * length * width) - boat_mass
print(f"Safe cargo (10cm freeboard): {safe_cargo:.0f} kg")`,
      challenge: 'The Brahmaputra rises several metres during monsoon. If the water becomes muddy (density ~1050 kg/m³ instead of 1000), recalculate the maximum safe cargo. Does muddy water help or hurt?',
      successHint: 'Displacement calculations determine the load capacity of every vessel on every river and ocean in the world. Overloading boats is one of the leading causes of ferry disasters in South Asia.',
    },
    {
      title: 'Hull design — shape matters more than material',
      concept: `The shape of a boat's bottom — its **hull** — determines almost everything about how it performs. A flat bottom, a V-shape, a round bottom: each has trade-offs.

Common hull types:
- **Flat bottom**: stable in calm water, shallow draft, easy to build. Used by Brahmaputra fishermen for decades. Bad in waves — slaps the water hard.
- **V-hull**: cuts through waves, faster, better in rough water. But rolls more in calm water and needs more depth.
- **Round bottom**: smooth ride, efficient at slow speeds. Very common in traditional boats worldwide. Tends to roll side to side.
- **Catamaran (twin hull)**: extremely stable, wide deck area. Used for ferries. More drag at speed.

The hull shape affects **drag** — the resistance the water puts on the boat as it moves. Drag has two parts:
- **Friction drag**: water rubbing against the hull surface
- **Wave drag**: energy lost creating waves

A longer, narrower hull has less wave drag. A smoother hull has less friction drag. This is why racing boats are long and thin, while fishing boats are wide and stable.`,
      analogy: 'Hull design is like shoe design. Flat shoes (flat hull) are stable on smooth floors but slip in rain. Pointed shoes (V-hull) look sleek and move fast but are less stable. Hiking boots (round hull) handle rough terrain but are heavy. Each is designed for a specific job, not for all jobs.',
      storyConnection: 'The boy chose a flat-bottomed design for his boat because the Brahmaputra near his village was shallow with shifting sandbars. A deep V-hull would have run aground. His grandfather had built boats the same way — local hull designs encode generations of engineering knowledge.',
      checkQuestion: 'Why are all competitive rowing shells (racing boats) extremely long and narrow, even though they tip over easily?',
      checkAnswer: 'Wave drag decreases as the length-to-width ratio increases. A longer, narrower boat slips through water with much less resistance, allowing higher speeds. The trade-off is stability — rowing shells are so unstable that beginners capsize constantly. Speed vs. stability is the fundamental hull design trade-off.',
      codeIntro: 'Compare drag forces on different hull shapes as speed increases.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified drag model: F_drag = 0.5 * Cd * rho * A * v^2
# Cd depends on hull shape, A is wetted area
speeds = np.linspace(0, 10, 100)  # m/s (0 to ~20 knots)
rho_water = 1000  # kg/m³

hulls = {
    'Flat bottom': {'Cd': 0.8, 'A': 3.0, 'color': '#f59e0b'},
    'Round bottom': {'Cd': 0.5, 'A': 2.5, 'color': '#3b82f6'},
    'V-hull': {'Cd': 0.35, 'A': 2.8, 'color': '#22c55e'},
    'Racing shell': {'Cd': 0.2, 'A': 1.5, 'color': '#a855f7'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Drag vs speed
ax1.set_facecolor('#111827')
for name, params in hulls.items():
    drag = 0.5 * params['Cd'] * rho_water * params['A'] * speeds**2
    ax1.plot(speeds, drag / 1000, color=params['color'], linewidth=2, label=name)

ax1.set_xlabel('Speed (m/s)', color='white')
ax1.set_ylabel('Drag force (kN)', color='white')
ax1.set_title('Hull Drag vs Speed', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Hull shape cross-sections
ax2.set_facecolor('#111827')
ax2.set_xlim(-2, 8)
ax2.set_ylim(-2, 2)

# Water line
ax2.axhline(0, color='#60a5fa', linewidth=1, alpha=0.3)

shapes = [
    ('Flat', 0, [(-0.8, 0), (-0.8, -0.3), (0.8, -0.3), (0.8, 0)]),
    ('Round', 2.5, None),  # special case — draw arc
    ('V-hull', 5, [(-0.8, 0), (0, -0.8), (0.8, 0)]),
    ('Racing', 7.5, [(-0.3, 0), (-0.1, -1.0), (0.1, -1.0), (0.3, 0)]),
]

for name, cx, points in shapes:
    if name == 'Round':
        theta = np.linspace(0, np.pi, 50)
        rx, ry = 0.8 * np.cos(theta), -0.6 * np.sin(theta)
        ax2.fill(rx + cx, ry, color='#92400e', alpha=0.8)
        ax2.plot(rx + cx, ry, color='#f59e0b', linewidth=2)
    else:
        xs = [p[0] + cx for p in points]
        ys = [p[1] for p in points]
        ax2.fill(xs, ys, color='#92400e', alpha=0.8)
        ax2.plot(xs + [xs[0]], ys + [ys[0]], color='#f59e0b', linewidth=2)
    ax2.text(cx, 0.3, name, ha='center', color='white', fontsize=10, fontweight='bold')

ax2.set_title('Hull Cross-Sections', color='white', fontsize=13)
ax2.set_xticks([])
ax2.set_yticks([])

plt.tight_layout()
plt.show()

print("Hull design trade-offs:")
print("  Flat bottom: most stable, highest drag, shallowest draft")
print("  Round bottom: good all-rounder, moderate drag, tends to roll")
print("  V-hull: cuts waves well, moderate drag, less stable at rest")
print("  Racing shell: lowest drag, fastest, extremely unstable")
print()
print("Drag increases with the SQUARE of speed.")
print("Going twice as fast needs FOUR times the force.")`,
      challenge: 'Add a "Catamaran" hull to the drag chart with Cd=0.4 and A=4.0 (wider wetted area). At what speed does its drag exceed the V-hull? Why are catamarans still popular despite higher drag?',
      successHint: 'Hull design is where physics meets centuries of practical experience. The flat-bottomed boats of the Brahmaputra are not "primitive" — they are precisely optimized for shallow, shifting rivers.',
    },
    {
      title: 'River currents — the moving water problem',
      concept: `The Brahmaputra is not a still pond. It flows at 2-5 m/s depending on the season, with complex currents that change across the width and depth of the river. To cross it, the boy had to understand how currents work.

Key concepts:
- **Laminar flow**: smooth, orderly flow in layers. Happens at low speeds in small channels.
- **Turbulent flow**: chaotic, swirling flow with eddies. This is what the Brahmaputra has — fast, messy, unpredictable.
- **Velocity profile**: water moves faster in the center of the river and slower near the banks and bottom (friction slows it down).
- **Cross-river navigation**: if you point your boat straight across, the current pushes you downstream. You must aim upstream to compensate — the **crab angle**.

The velocity of the boat relative to the ground is the **vector sum** of the boat's velocity through the water and the water's velocity. This is the same math used in airplane navigation (compensating for wind).`,
      analogy: 'Imagine walking across a moving conveyor belt in an airport. If you walk straight across, you end up downstream from where you aimed. To reach the door directly opposite, you must angle your walk upstream (against the belt\'s direction). The faster the belt, the steeper your angle must be.',
      storyConnection: 'The boy studied the river for days before attempting the crossing. He noticed the current was weakest near the inside of bends and strongest at the outside. He planned his route to cross at a wide, shallow stretch where the current was gentler — applying fluid dynamics without knowing the term.',
      checkQuestion: 'If the river flows east at 3 m/s and the boy can paddle at 4 m/s, what angle upstream should he aim to travel straight across (due north)?',
      checkAnswer: 'He needs to aim west of north. The angle θ = arcsin(3/4) = 48.6° west of north. His actual crossing speed (northward) would be √(4² - 3²) = √7 ≈ 2.65 m/s. If the river flows faster than he can paddle (>4 m/s), he cannot cross straight at all — he will always drift downstream.',
      codeIntro: 'Visualize river crossing with currents and the vector addition of velocities.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# River crossing simulation
river_width = 100  # meters
river_speed = 3.0  # m/s (eastward)
paddle_speed = 4.0  # m/s

# Three strategies
fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

strategies = [
    ('Aim straight across', np.pi/2),
    ('Aim upstream (optimal)', np.pi/2 + np.arcsin(river_speed/paddle_speed)),
    ('Aim 45° upstream', np.pi/2 + np.pi/4),
]

for ax, (name, angle) in zip(axes, strategies):
    ax.set_facecolor('#1e40af')
    ax.set_facecolor('#111827')

    # River banks
    ax.axhline(0, color='#92400e', linewidth=3)
    ax.axhline(river_width, color='#92400e', linewidth=3)
    ax.fill_between([-50, 200], 0, river_width, color='#1e40af', alpha=0.15)

    # Simulate trajectory
    dt = 0.1
    x, y = 0, 0
    path_x, path_y = [x], [y]

    # Boat velocity in water
    vx_boat = paddle_speed * np.cos(angle)
    vy_boat = paddle_speed * np.sin(angle)

    while y < river_width and len(path_x) < 5000:
        # Current varies across river (faster in middle)
        current_factor = 1.0 + 0.5 * np.sin(np.pi * y / river_width)
        vx_current = river_speed * current_factor

        x += (vx_boat + vx_current) * dt
        y += vy_boat * dt
        path_x.append(x)
        path_y.append(y)

    ax.plot(path_x, path_y, color='#f59e0b', linewidth=2)
    ax.plot(0, 0, 'o', color='#22c55e', markersize=10, label='Start')
    ax.plot(path_x[-1], path_y[-1], 's', color='#ef4444', markersize=10, label='End')

    # Show drift
    drift = path_x[-1]
    time = len(path_x) * dt
    ax.set_title(f'{name}\\nDrift: {drift:.0f}m, Time: {time:.0f}s', color='white', fontsize=10)
    ax.set_xlabel('East (m)', color='white')
    ax.set_ylabel('North (m)', color='white')
    ax.tick_params(colors='gray')
    ax.set_xlim(-30, 180)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)

    # Current arrows
    for yy in [25, 50, 75]:
        cf = 1.0 + 0.5 * np.sin(np.pi * yy / river_width)
        ax.annotate('', xy=(20 * cf, yy), xytext=(0, yy),
                    arrowprops=dict(arrowstyle='->', color='#60a5fa', lw=1.5, alpha=0.5))

plt.tight_layout()
plt.show()

print("River crossing strategies:")
print(f"  River speed: {river_speed} m/s, Paddle speed: {paddle_speed} m/s")
angle_opt = np.degrees(np.arcsin(river_speed / paddle_speed))
print(f"  Optimal upstream angle: {angle_opt:.1f}° from perpendicular")
crossing_speed = np.sqrt(paddle_speed**2 - river_speed**2)
crossing_time = river_width / crossing_speed
print(f"  Crossing speed (northward): {crossing_speed:.2f} m/s")
print(f"  Crossing time: {crossing_time:.0f} seconds")
print()
print("Note: the current is strongest in the middle of the river,")
print("which makes the actual path curved, not straight.")`,
      challenge: 'During monsoon, the river speed increases to 5 m/s — faster than the boy can paddle (4 m/s). Can he still cross? Plot his path. What strategy minimizes downstream drift?',
      successHint: 'Vector addition of velocities is the same math pilots use for crosswind landings and astronauts use for orbital manoeuvres. The boy on the Brahmaputra was solving the same equations — just with a paddle instead of a computer.',
    },
    {
      title: 'Building a boat — putting physics into practice',
      concept: `All the physics we have learned — buoyancy, displacement, hull design, currents — comes together when you actually build a boat. The boy in our story did not have engineering textbooks, but he followed the same design process engineers use:

1. **Requirements**: What does the boat need to do? (Cross the Brahmaputra, carry supplies, handle currents)
2. **Material selection**: Bamboo for the frame (light, strong, waterproof), sal wood planks for the hull (durable, water-resistant)
3. **Dimensions**: Length, width, and depth determine displacement capacity
4. **Stability**: The center of gravity must be below the center of buoyancy, or the boat capsizes
5. **Waterproofing**: Traditional methods use tree resin, tar, or natural rubber

**Stability** deserves special attention. A boat is stable when:
- The **center of gravity** (CG) — where the weight acts — is low
- The **center of buoyancy** (CB) — where the upward force acts — shifts outward when the boat tilts
- The **metacenter** (M) — a calculated point — is above the CG

If M is below CG, the boat is unstable and will capsize. Wide, flat boats have high metacenters (very stable). Narrow, tall boats have low metacenters (less stable).`,
      analogy: 'Stability is like balancing a pencil. Stand it on its eraser (low CG, wide base) — it is stable. Balance it on its tip (high CG, narrow base) — the slightest touch tips it. A boat with heavy cargo on top and a narrow hull is like a pencil on its tip.',
      storyConnection: 'The boy placed heavy stones at the bottom of his boat as ballast. He did not know the term "metacentric height," but he knew that a low center of gravity kept the boat from flipping. When he loaded his supplies, he packed them low and centered — the same principle that cargo ship captains follow today.',
      checkQuestion: 'A canoe tips over much more easily than a pontoon boat. In terms of metacentric height, why?',
      checkAnswer: 'A canoe is narrow, so when it tilts, the center of buoyancy barely shifts. The metacenter is low — close to or below the center of gravity. A pontoon boat has two widely-spaced hulls, so when it tilts, the buoyancy shifts dramatically to the lower hull, creating a large righting moment. Its metacenter is very high.',
      codeIntro: 'Simulate boat stability: tilt a boat and see if it rights itself or capsizes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Stability simulation: righting moment vs heel angle
heel_angles = np.linspace(0, 90, 100)  # degrees

# Righting arm (GZ) for different boat types
# GZ = GM * sin(theta) for small angles, gets complex for large angles
boats = {
    'Flat-bottom (wide)': {'GM': 1.2, 'max_angle': 75, 'color': '#22c55e'},
    'V-hull (medium)': {'GM': 0.6, 'max_angle': 55, 'color': '#3b82f6'},
    'Canoe (narrow)': {'GM': 0.2, 'max_angle': 30, 'color': '#f59e0b'},
    'Top-heavy cargo': {'GM': -0.1, 'max_angle': 0, 'color': '#ef4444'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# GZ curve (righting arm vs heel angle)
ax1.set_facecolor('#111827')
for name, params in boats.items():
    gm = params['GM']
    max_a = params['max_angle']
    if gm > 0:
        gz = gm * np.sin(np.radians(heel_angles)) * np.cos(np.radians(heel_angles / max_a * 90))
        gz = np.where(heel_angles <= max_a, gz, np.maximum(gz, -0.2))
    else:
        gz = gm * np.sin(np.radians(heel_angles))
    ax1.plot(heel_angles, gz, color=params['color'], linewidth=2, label=name)

ax1.axhline(0, color='gray', linestyle='--', linewidth=0.5)
ax1.set_xlabel('Heel angle (degrees)', color='white')
ax1.set_ylabel('Righting arm GZ (m)', color='white')
ax1.set_title('Stability Curves: Will it capsize?', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.annotate('Positive GZ = self-righting', xy=(10, 0.4), color='#22c55e', fontsize=9)
ax1.annotate('Negative GZ = capsizing!', xy=(50, -0.15), color='#ef4444', fontsize=9)

# Visual: boat tilting with CG and CB marked
ax2.set_facecolor('#111827')
ax2.set_xlim(-2.5, 2.5)
ax2.set_ylim(-1.5, 2)
ax2.set_aspect('equal')

# Water
ax2.axhspan(-1.5, 0, color='#1e40af', alpha=0.2)

# Tilted boat (15 degrees)
angle_rad = np.radians(15)
hull_pts = np.array([[-1, -0.3], [1, -0.3], [1, 0.2], [-1, 0.2]])
rotation = np.array([[np.cos(angle_rad), -np.sin(angle_rad)],
                      [np.sin(angle_rad), np.cos(angle_rad)]])
rotated = hull_pts @ rotation.T
ax2.fill(rotated[:, 0], rotated[:, 1], color='#92400e', alpha=0.8)
ax2.plot(np.append(rotated[:, 0], rotated[0, 0]),
         np.append(rotated[:, 1], rotated[0, 1]), color='#f59e0b', linewidth=2)

# CG (center of gravity) - red dot
cg = np.array([0, 0.05]) @ rotation.T
ax2.plot(cg[0], cg[1], 'o', color='#ef4444', markersize=12, zorder=5)
ax2.text(cg[0] + 0.2, cg[1] + 0.15, 'CG', color='#ef4444', fontsize=11, fontweight='bold')

# CB (center of buoyancy) - green dot (shifts to lower side)
cb = np.array([-0.15, -0.15]) @ rotation.T
ax2.plot(cb[0], cb[1], 'o', color='#22c55e', markersize=12, zorder=5)
ax2.text(cb[0] - 0.5, cb[1] - 0.2, 'CB', color='#22c55e', fontsize=11, fontweight='bold')

# Metacenter - blue dot (above CG = stable)
m_point = np.array([0, 0.8])
ax2.plot(m_point[0], m_point[1], '^', color='#3b82f6', markersize=12, zorder=5)
ax2.text(m_point[0] + 0.2, m_point[1], 'M', color='#3b82f6', fontsize=11, fontweight='bold')

# Line from CG to M
ax2.plot([cg[0], m_point[0]], [cg[1], m_point[1]], '--', color='#3b82f6', linewidth=1)
ax2.annotate('GM > 0\\n(stable!)', xy=(0.4, 0.5), color='#3b82f6', fontsize=10)

ax2.set_title('Tilted Boat: Stability Check', color='white', fontsize=13)
ax2.set_xticks([])
ax2.set_yticks([])

plt.tight_layout()
plt.show()

print("Boat stability summary:")
print("  GM > 0: boat rights itself when tilted (stable)")
print("  GM = 0: neutral — boat stays at any angle (dangerous)")
print("  GM < 0: boat capsizes immediately (unstable)")
print()
print("Design rules:")
print("  1. Keep heavy things LOW (lowers CG)")
print("  2. Make the boat WIDE (raises metacenter)")
print("  3. Never let cargo shift to one side")
print("  4. Ballast at the bottom improves stability")`,
      challenge: 'The boy adds a tall mast and sail to his boat. This raises the center of gravity. By how much can CG rise before GM becomes negative? (Use GM=1.2 for the flat-bottom boat and assume the metacenter stays fixed.)',
      successHint: 'You have now covered the full physics of boat building: buoyancy, Archimedes\' principle, displacement, hull design, river currents, and stability. In Level 2, you will dive deeper into naval engineering — pressure, streamlining, and propulsion.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Fluid Dynamics & Buoyancy — no prior physics needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for physics simulations. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
