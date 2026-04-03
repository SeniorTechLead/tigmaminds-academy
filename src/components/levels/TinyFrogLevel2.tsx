import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function TinyFrogLevel2() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'The square-cube law — why size changes everything',
      concept: `In Level 1, we introduced the square-cube law. Now let's formalize it mathematically and explore its deep consequences.

If you scale an organism by factor **k** (double k=2, halve k=0.5):
- **Length** scales as k
- **Area** scales as k² (surfaces: skin, lungs, intestines)
- **Volume** scales as k³ (mass, blood volume, muscle volume)
- **Weight** scales as k³ (proportional to volume times density)
- **Strength** scales as k² (proportional to muscle cross-section)

**Critical ratios:**
- Strength/weight = k²/k³ = **1/k** — smaller animals are relatively stronger
- Heat loss/heat production = k²/k³ = **1/k** — smaller animals lose heat faster
- Bone cross-section/weight = k²/k³ = **1/k** — larger animals need proportionally thicker bones

This is why:
- A scaled-up ant would collapse under its own weight
- A scaled-down elephant would overheat
- A miniaturized frog can jump 25x its body length but must stay in humid environments

The square-cube law is not just biology — it governs the scaling of bridges, aircraft, microchips, and any physical system where area and volume matter differently.`,
      analogy: 'The square-cube law is like the economics of pizza delivery. A 10-inch pizza feeds 1 person. A 20-inch pizza (2x diameter) has 4x the area (feeds 4 people) but 8x the volume of dough needed. The "cost per serving" (volume/area) increases with size. This is why large pizzas are better value — and why large animals need proportionally more food.',
      storyConnection: 'The tiny frog of NE India lives in a world governed by the square-cube law at its extreme. At 10mm, it has a surface-area-to-volume ratio 8x higher than an 80mm frog. This means 8x faster water loss, 8x faster heat exchange, and a fundamentally different relationship with its environment.',
      checkQuestion: 'Galileo first described the square-cube law in 1638 when discussing why large animals have thicker bones relative to their body size. If you tripled an animal\'s length, how much thicker would its leg bones need to be to support the increased weight?',
      checkAnswer: 'Weight increases by 3³ = 27x. Bone strength is proportional to cross-sectional area. To support 27x the weight, bone cross-section must increase 27x, meaning bone diameter must increase by sqrt(27) ≈ 5.2x. But length only tripled (3x), so bones are 5.2/3 ≈ 1.7x thicker relative to body length. This is why elephant legs look proportionally thicker than mouse legs.',
      codeIntro: 'Build a comprehensive scaling model from the square-cube law.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Comprehensive scaling analysis
scale_factor = np.linspace(0.1, 10, 200)  # relative to reference animal

# Reference: a 30mm tree frog (scale = 1)
ref_length = 30  # mm

# Scaling relationships
length = ref_length * scale_factor
area = scale_factor ** 2
volume = scale_factor ** 3
strength = scale_factor ** 2
weight = scale_factor ** 3

# Derived ratios
strength_to_weight = strength / weight  # = 1/scale
heat_loss_ratio = area / volume  # = 1/scale
bone_thickness_needed = np.sqrt(weight) / length * ref_length  # relative

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')

# Power laws
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.loglog(scale_factor, area, color='#3b82f6', linewidth=2, label='Area (~k²)')
ax.loglog(scale_factor, volume, color='#ef4444', linewidth=2, label='Volume (~k³)')
ax.loglog(scale_factor, strength, color='#22c55e', linewidth=2, label='Strength (~k²)')
ax.axvline(1, color='gray', linestyle=':', linewidth=0.5)
ax.text(1.1, 0.02, 'Reference\\n(30mm frog)', color='gray', fontsize=7)
ax.set_xlabel('Scale factor (k)', color='white')
ax.set_ylabel('Relative value', color='white')
ax.set_title('Fundamental Scaling Laws', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Strength-to-weight ratio
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(length, strength_to_weight, color='#22c55e', linewidth=2)
ax.fill_between(length, strength_to_weight, alpha=0.15, color='#22c55e')

animals = [(8, 'Tiny frog', '#ef4444'), (30, 'Tree frog', '#f59e0b'),
           (80, 'Bullfrog', '#3b82f6'), (200, 'Cat-sized', '#a855f7')]
for size, name, color in animals:
    k = size / ref_length
    stw = 1 / k
    ax.plot(size, stw, 'o', color=color, markersize=8)
    ax.annotate(name, xy=(size, stw), xytext=(size+5, stw+0.5),
                color=color, fontsize=8)

ax.set_xlabel('Body length (mm)', color='white')
ax.set_ylabel('Relative strength / weight', color='white')
ax.set_title('Smaller = Relatively Stronger', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Heat loss ratio
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(length, heat_loss_ratio, color='#ef4444', linewidth=2)
ax.fill_between(length, heat_loss_ratio, alpha=0.15, color='#ef4444')

for size, name, color in animals:
    k = size / ref_length
    hlr = 1 / k
    ax.plot(size, hlr, 'o', color=color, markersize=8)
    ax.annotate(name, xy=(size, hlr), xytext=(size+5, hlr+0.3),
                color=color, fontsize=8)

ax.set_xlabel('Body length (mm)', color='white')
ax.set_ylabel('Relative heat loss rate', color='white')
ax.set_title('Smaller = Faster Heat Loss', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Bone thickness
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(length, bone_thickness_needed, color='#f59e0b', linewidth=2)
ax.fill_between(length, bone_thickness_needed, alpha=0.15, color='#f59e0b')
ax.set_xlabel('Body length (mm)', color='white')
ax.set_ylabel('Relative bone thickness needed', color='white')
ax.set_title('Larger = Thicker Bones Required', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Square-cube law consequences:")
print("  Scale by k=0.33 (shrink to 1/3 size):")
print(f"    Weight: {0.33**3:.3f}x (27x lighter)")
print(f"    Strength/weight: {1/0.33:.1f}x (3x relatively stronger)")
print(f"    Heat loss rate: {1/0.33:.1f}x (3x faster)")
print()
print("  Scale by k=3 (grow to 3x size):")
print(f"    Weight: {3**3:.0f}x (27x heavier)")
print(f"    Strength/weight: {1/3:.2f}x (3x relatively weaker)")
print(f"    Heat loss rate: {1/3:.2f}x (3x slower)")`,
      challenge: 'The world\'s smallest mammal (bumblebee bat) is ~30mm long. Using the square-cube law, calculate how many times per minute it must breathe and how many times its heart must beat compared to an elephant (5000mm). Assume breathing rate scales as 1/mass^0.25.',
      successHint: 'The square-cube law is the most important scaling principle in all of physics and engineering. It explains biological size limits, why aircraft need different shapes at different scales, and why nanotechnology works differently from macroscopic engineering.',
    },
    {
      title: 'Metabolic rate vs. body size — Kleiber\'s law',
      concept: `In 1932, Max Kleiber discovered one of biology's most universal laws: metabolic rate scales with body mass to the power of 3/4.

**Kleiber's Law:** B = B₀ * M^0.75

Where:
- B = basal metabolic rate (watts or mL O₂/hour)
- B₀ = normalization constant (~70 for mammals in cal/day units)
- M = body mass (kg)
- 0.75 = the scaling exponent

**Why 3/4 and not 2/3?**
The simple square-cube law predicts metabolic rate should scale as M^(2/3) (proportional to surface area, since heat loss = surface area). But the actual exponent is 3/4. This "quarter-power scaling" has been explained by:
- **Fractal distribution networks**: blood vessels branch in a fractal pattern that optimizes resource delivery. The mathematics of this branching gives 3/4, not 2/3.
- **West-Brown-Enquist model** (1997): the most widely accepted explanation. The branching geometry of circulatory and respiratory systems constrains metabolism.

**Consequences of Kleiber's Law:**
- Per-gram metabolic rate = B/M = B₀ * M^(-0.25) — smaller animals burn energy faster per gram
- A mouse uses 7x more oxygen per gram than an elephant
- This explains why small frogs eat constantly (high per-gram metabolism) while large frogs can fast for weeks`,
      analogy: 'Kleiber\'s law is like fuel efficiency in cars vs. trucks. A motorcycle (small animal) uses less total fuel but more fuel per kilogram of vehicle. A truck (large animal) uses more total fuel but less per kilogram. The relationship isn\'t linear — it follows a power law because the "engine" (metabolism) and the "vehicle" (body) scale differently.',
      storyConnection: 'The tiny frog\'s metabolic rate per gram of body tissue is enormously high — it burns through energy faster than a bullfrog, relative to its size. This means it must eat constantly, which is why miniature frogs are found in leaf litter with abundant tiny prey (mites, springtails). The micro-habitat isn\'t just shelter — it\'s a buffet.',
      checkQuestion: 'If metabolic rate scales as M^0.75, and lifespan correlates inversely with per-gram metabolic rate, what does Kleiber\'s law predict about the relationship between body size and lifespan?',
      checkAnswer: 'Per-gram metabolic rate scales as M^(-0.25). If lifespan is inversely proportional to per-gram rate, then lifespan scales as M^(0.25). This is approximately correct: elephants live ~60 years, mice ~2 years. The ratio of their masses (5000kg / 0.02kg = 250,000) predicts lifespan ratio of 250,000^0.25 ≈ 22x. Actual ratio: ~30x. Close! This is the "rate of living" theory.',
      codeIntro: 'Plot Kleiber\'s law across the animal kingdom and explore its consequences.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Kleiber's law: B = B0 * M^0.75
mass = np.logspace(-6, 5, 200)  # kg (from insects to whales)
B0 = 70  # cal/day for mammals (approximate)

metabolic_rate = B0 * mass ** 0.75  # total metabolic rate
per_gram_rate = B0 * mass ** (-0.25)  # per-gram metabolic rate

# Real animal data
animals = {
    'Tiny frog (0.5g)': {'mass': 0.0005, 'bmr': 0.015},
    'Tree frog (5g)': {'mass': 0.005, 'bmr': 0.1},
    'Mouse (20g)': {'mass': 0.02, 'bmr': 0.3},
    'Rat (300g)': {'mass': 0.3, 'bmr': 3},
    'Cat (4kg)': {'mass': 4, 'bmr': 25},
    'Human (70kg)': {'mass': 70, 'bmr': 80},
    'Elephant (5t)': {'mass': 5000, 'bmr': 3000},
    'Blue whale (100t)': {'mass': 100000, 'bmr': 35000},
}
acolors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#6b7280', '#3b82f6']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Total metabolic rate (log-log)
ax1.set_facecolor('#111827')
ax1.loglog(mass, metabolic_rate, color='#22c55e', linewidth=2, label='Kleiber: B = 70*M^0.75')

# Also plot M^(2/3) prediction
metabolic_surface = B0 * mass ** 0.67
ax1.loglog(mass, metabolic_surface, color='gray', linewidth=1, linestyle='--', label='Surface law: B ~ M^0.67')

for (name, data), color in zip(animals.items(), acolors):
    ax1.scatter(data['mass'], data['bmr'], s=100, color=color,
                edgecolor='white', linewidth=1, zorder=5)
    ax1.annotate(name, xy=(data['mass'], data['bmr']),
                 xytext=(data['mass']*2, data['bmr']*1.5),
                 color=color, fontsize=6)

ax1.set_xlabel('Body mass (kg)', color='white')
ax1.set_ylabel('Metabolic rate (cal/day)', color='white')
ax1.set_title("Kleiber's Law: Metabolism vs Body Size", color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Per-gram metabolic rate
ax2.set_facecolor('#111827')
ax2.loglog(mass, per_gram_rate, color='#ef4444', linewidth=2)
ax2.fill_between(mass, per_gram_rate, alpha=0.1, color='#ef4444')

for (name, data), color in zip(animals.items(), acolors):
    pgr = B0 * data['mass'] ** (-0.25)
    ax2.scatter(data['mass'], pgr, s=100, color=color,
                edgecolor='white', linewidth=1, zorder=5)
    ax2.annotate(name, xy=(data['mass'], pgr),
                 xytext=(data['mass']*2, pgr*1.3),
                 color=color, fontsize=6)

ax2.set_xlabel('Body mass (kg)', color='white')
ax2.set_ylabel('Per-gram metabolic rate (cal/day/kg)', color='white')
ax2.set_title('Smaller Animals Burn Energy Faster (per gram)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Calculate ratios
tiny_frog_pgr = B0 * 0.0005 ** (-0.25)
elephant_pgr = B0 * 5000 ** (-0.25)
print("Kleiber's Law: B = 70 * M^0.75")
print()
print(f"Per-gram metabolic rate:")
print(f"  Tiny frog (0.5g): {tiny_frog_pgr:.0f} cal/day/kg")
print(f"  Elephant (5000kg): {elephant_pgr:.1f} cal/day/kg")
print(f"  Ratio: {tiny_frog_pgr/elephant_pgr:.0f}x (frog burns {tiny_frog_pgr/elephant_pgr:.0f}x more per gram)")
print()
print("This is why the tiny frog must eat constantly")
print("and why elephants can survive days without food.")`,
      challenge: 'The 3/4 exponent is debated. Some researchers argue it should be 2/3 (surface area) for some organisms and 3/4 for others. Plot both predictions and overlay real data for 10 animal species. Which exponent fits better?',
      successHint: 'Kleiber\'s law is one of the most robust empirical laws in biology — it holds across 20 orders of magnitude of body mass. Understanding it means understanding the fundamental constraints that size places on all living things.',
    },
    {
      title: 'Heat loss and size — the thermal challenge of being tiny',
      concept: `Small animals lose heat proportionally faster than large ones because of the surface-area-to-volume ratio. For ectotherms like frogs, this creates a fundamental challenge.

**Newton's Law of Cooling:** dT/dt = -h * A/V * (T_body - T_environment)

Where:
- dT/dt = rate of temperature change
- h = heat transfer coefficient (depends on wind, humidity)
- A/V = surface area to volume ratio (higher for small animals)
- T_body - T_environment = temperature difference

**For a frog (ectotherm):**
- Body temperature tracks environment closely (no internal heating)
- Small frogs equilibrate to environmental temperature in seconds
- Large frogs take minutes
- This means tiny frogs experience every temperature fluctuation immediately

**Consequences:**
- Tiny frogs can only survive in thermally stable microhabitats (leaf litter, moss)
- They're active only in a narrow temperature window (18-28C for most tropical species)
- Temperature extremes (direct sunlight, cold nights) are lethal because they can't buffer against rapid change
- This is why climate change is particularly dangerous for miniature ectotherms`,
      analogy: 'A tiny frog is like a metal marble — it quickly takes on the temperature of whatever it touches. A large frog is like a rock — it takes longer to warm up or cool down. A mammal is like a thermos — it maintains its own temperature regardless of the environment. The tiny frog has neither thermal mass (too small) nor thermoregulation (ectotherm). It\'s fully at the mercy of its microhabitat.',
      storyConnection: 'The tiny frog of the rainforest lives in leaf litter not just for food and shelter, but for thermal stability. The damp, shaded leaf litter maintains a nearly constant temperature (22-26C) even as the canopy above swings from cool mornings to hot afternoons. For a 10mm ectotherm, this microclimate is the difference between life and death.',
      checkQuestion: 'If global temperatures rise 2C, why would this disproportionately affect miniature frogs more than larger ones?',
      checkAnswer: 'Two reasons: (1) Tiny frogs already live near their thermal maximum in tropical forests. A 2C increase pushes many past lethal limits. (2) Tiny frogs equilibrate instantly to environmental temperature — they can\'t buffer against the increase. Large frogs have thermal inertia and can behaviorally thermoregulate (move to shade, burrow). Miniature species have nowhere to hide from a systemic temperature rise.',
      codeIntro: 'Model thermal dynamics of frogs at different body sizes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Newton's law of cooling for frogs of different sizes
time = np.arange(0, 300, 1)  # seconds

# Frog sizes (body length in mm -> approximate sphere radius)
frogs = {
    'Tiny frog (10mm)': {'radius': 5, 'color': '#ef4444'},
    'Small frog (20mm)': {'radius': 10, 'color': '#f59e0b'},
    'Tree frog (40mm)': {'radius': 20, 'color': '#22c55e'},
    'Bullfrog (80mm)': {'radius': 40, 'color': '#3b82f6'},
}

h = 0.01  # heat transfer coefficient
T_initial = 25  # body temperature (C)
T_env = 15  # sudden temperature drop to 15C

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Cooling curves
ax1.set_facecolor('#111827')

for name, props in frogs.items():
    r = props['radius'] / 1000  # convert to meters
    A = 4 * np.pi * r**2
    V = 4/3 * np.pi * r**3
    AV = A / V

    k = h * AV
    T = T_env + (T_initial - T_env) * np.exp(-k * time)

    ax1.plot(time, T, linewidth=2, label=f'{name} (A/V={AV:.0f})', color=props['color'])

    idx_16 = np.argmin(np.abs(T - 16))
    if T[idx_16] < 16.5:
        ax1.plot(time[idx_16], 16, 'x', color=props['color'], markersize=10)

ax1.axhline(16, color='#ef4444', linestyle='--', linewidth=0.5)
ax1.text(250, 16.3, 'Near-lethal\\n(16C)', color='#ef4444', fontsize=8)
ax1.axhline(T_env, color='gray', linestyle=':', linewidth=0.5)
ax1.text(250, T_env + 0.3, f'Environment ({T_env}C)', color='gray', fontsize=8)

ax1.set_xlabel('Time (seconds)', color='white')
ax1.set_ylabel('Body temperature (C)', color='white')
ax1.set_title(f'Cooling After Sudden Drop to {T_env}C', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax1.tick_params(colors='gray')

# Daily temperature cycle survival
ax2.set_facecolor('#111827')
hours = np.arange(0, 48, 0.1)
T_ambient = 24 + 4 * np.sin(2 * np.pi * (hours - 6) / 24)

for name, props in frogs.items():
    r = props['radius'] / 1000
    A = 4 * np.pi * r**2
    V = 4/3 * np.pi * r**3
    k = h * A / V

    T_body = np.zeros_like(hours)
    T_body[0] = T_ambient[0]

    for i in range(1, len(hours)):
        dt = (hours[i] - hours[i-1]) * 3600
        dT = -k * (T_body[i-1] - T_ambient[i]) * dt
        T_body[i] = T_body[i-1] + dT

    ax2.plot(hours, T_body, linewidth=2, label=name, color=props['color'])

ax2.plot(hours, T_ambient, color='gray', linewidth=1, linestyle='--', label='Ambient')
ax2.set_xlabel('Time (hours)', color='white')
ax2.set_ylabel('Temperature (C)', color='white')
ax2.set_title('Body Temperature Tracking Over 48 Hours', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Thermal dynamics by size:")
for name, props in frogs.items():
    r = props['radius'] / 1000
    AV = 3 / r
    k = h * AV
    time_to_16 = -np.log((16 - T_env) / (T_initial - T_env)) / k if T_initial > 16 else 0
    print(f"  {name}:")
    print(f"    A/V ratio: {AV:.0f} /m")
    print(f"    Time to cool to 16C: {time_to_16:.0f} seconds")
print()
print("The tiny frog cools to lethal temperature in seconds.")
print("The bullfrog has minutes to find warmth.")
print("This is why tiny frogs MUST live in thermally stable microhabitats.")`,
      challenge: 'Add a warming scenario: ambient temperature increases from 24C to 26C (2C climate change). How does this change the fraction of the day that each frog is above its thermal optimum (28C)? Which frog is most affected?',
      successHint: 'Thermal biology connects physics (heat transfer) to ecology (habitat requirements) to conservation (climate vulnerability). For miniature ectotherms, the physics of heat loss is literally a matter of life and death.',
    },
    {
      title: 'Kleiber\'s law deep dive — the 3/4 power mystery',
      concept: `Why 3/4? The scaling exponent in Kleiber's law (B ~ M^0.75) is not an obvious number. Understanding why it's 3/4 (not 2/3 from simple surface area scaling) reveals deep mathematics.

**The West-Brown-Enquist (WBE) model (1997):**
The circulatory system is a fractal branching network that delivers resources to every cell. The model assumes:
1. The network fills the entire body (space-filling)
2. The terminal units (capillaries) are size-invariant (same in mice and whales)
3. Energy dissipation is minimized (evolution optimizes efficiency)

From these three assumptions, the mathematics forces:
- Total metabolic rate ~ M^(3/4)
- Heart rate ~ M^(-1/4)
- Lifespan ~ M^(1/4)
- Aorta diameter ~ M^(3/8)

**The fractal dimension:**
The branching network has a fractal dimension of 4 (3 spatial + 1 for branching). This "extra dimension" from the fractal structure is why the exponent is 3/4 (= 3/(3+1)) rather than 2/3 (= 2/3).

This is one of the most beautiful results in theoretical biology: the geometry of resource distribution networks constrains the fundamental rate of life.`,
      analogy: 'The WBE model explains Kleiber\'s law the way road networks explain traffic flow. A city\'s road network is fractal (highways to arterials to streets to driveways). The total traffic capacity doesn\'t scale linearly with city area — it scales with a power law determined by the branching geometry. Similarly, the body\'s vascular network determines how metabolism scales with size.',
      storyConnection: 'The tiny frog\'s heart beats hundreds of times per minute (M^(-1/4) predicts ~400 bpm for a 0.5g frog). The blue whale\'s heart beats 6 times per minute. The same mathematical law governs both — a law written into the fractal geometry of blood vessels.',
      checkQuestion: 'If heart rate scales as M^(-1/4) and lifespan scales as M^(1/4), what is the total number of heartbeats in a lifetime?',
      checkAnswer: 'Heartbeats in a lifetime = heart rate times lifespan = M^(-1/4) times M^(1/4) = M^0 = constant! This is the remarkable prediction: every mammal gets roughly the same total number of heartbeats (~1-1.5 billion). A mouse uses them in 2 years; an elephant uses them in 60 years. The "lifetime heartbeat budget" is approximately size-invariant.',
      codeIntro: 'Explore the quarter-power scaling laws and the universal heartbeat hypothesis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Quarter-power scaling laws
mass = np.logspace(-4, 5, 200)  # kg (shrew to whale)

# Scaling predictions
heart_rate = 200 * mass ** (-0.25)  # bpm
lifespan = 10 * mass ** 0.25  # years (approximate)
total_heartbeats = heart_rate * lifespan * 365.25 * 24 * 60  # lifetime total

# Real data points
animal_data = {
    'Shrew': {'mass': 0.003, 'hr': 600, 'lifespan': 1.5},
    'Tiny frog': {'mass': 0.0005, 'hr': 400, 'lifespan': 3},
    'Mouse': {'mass': 0.02, 'hr': 500, 'lifespan': 2},
    'Rabbit': {'mass': 2, 'hr': 200, 'lifespan': 9},
    'Human': {'mass': 70, 'hr': 70, 'lifespan': 75},
    'Horse': {'mass': 500, 'hr': 40, 'lifespan': 30},
    'Elephant': {'mass': 5000, 'hr': 30, 'lifespan': 65},
    'Blue whale': {'mass': 100000, 'hr': 6, 'lifespan': 80},
}

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')

# Heart rate vs mass
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.loglog(mass, heart_rate, color='#ef4444', linewidth=2, label='Prediction: HR ~ M^(-0.25)')
for name, data in animal_data.items():
    ax.scatter(data['mass'], data['hr'], s=80, color='white', edgecolor='#ef4444',
               linewidth=1.5, zorder=5)
    ax.annotate(name, xy=(data['mass'], data['hr']),
                xytext=(data['mass']*2, data['hr']*1.2), color='white', fontsize=6)
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Heart rate (bpm)', color='white')
ax.set_title('Heart Rate ~ M^(-1/4)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Lifespan vs mass
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.loglog(mass, lifespan, color='#22c55e', linewidth=2, label='Prediction: Lifespan ~ M^(0.25)')
for name, data in animal_data.items():
    ax.scatter(data['mass'], data['lifespan'], s=80, color='white', edgecolor='#22c55e',
               linewidth=1.5, zorder=5)
    ax.annotate(name, xy=(data['mass'], data['lifespan']),
                xytext=(data['mass']*2, data['lifespan']*1.2), color='white', fontsize=6)
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Lifespan (years)', color='white')
ax.set_title('Lifespan ~ M^(1/4)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Total heartbeats (should be roughly constant)
ax = axes[1, 0]
ax.set_facecolor('#111827')
real_heartbeats = {}
for name, data in animal_data.items():
    beats = data['hr'] * data['lifespan'] * 365.25 * 24 * 60
    real_heartbeats[name] = beats
    ax.scatter(data['mass'], beats / 1e9, s=80, color='#f59e0b',
               edgecolor='white', linewidth=1.5, zorder=5)
    ax.annotate(name, xy=(data['mass'], beats/1e9),
                xytext=(data['mass']*2, beats/1e9*1.1), color='white', fontsize=6)

ax.axhline(1.0, color='#f59e0b', linestyle='--', linewidth=1, label='~1 billion heartbeats')
ax.set_xscale('log')
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Lifetime heartbeats (billions)', color='white')
ax.set_title('The Universal Heartbeat: ~1 Billion Per Lifetime', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.set_ylim(0, 3)

# Fractal branching visualization
ax = axes[1, 1]
ax.set_facecolor('#111827')
def draw_branch(ax, x, y, angle, length, depth, max_depth):
    if depth > max_depth or length < 0.5:
        return
    x2 = x + length * np.cos(angle)
    y2 = y + length * np.sin(angle)
    lw = (max_depth - depth + 1) * 0.5
    color_val = depth / max_depth
    ax.plot([x, x2], [y, y2], color=plt.cm.YlGn(1 - color_val), linewidth=lw)
    draw_branch(ax, x2, y2, angle + 0.4, length * 0.7, depth + 1, max_depth)
    draw_branch(ax, x2, y2, angle - 0.4, length * 0.7, depth + 1, max_depth)

draw_branch(ax, 0, 0, np.pi/2, 3, 0, 8)
ax.set_xlim(-5, 5)
ax.set_ylim(-0.5, 7)
ax.set_aspect('equal')
ax.set_title('Fractal Vascular Network\\n(geometry behind 3/4 scaling)', color='white', fontsize=10)
ax.set_xticks([])
ax.set_yticks([])

plt.tight_layout()
plt.show()

print("The universal heartbeat:")
for name, beats in real_heartbeats.items():
    print(f"  {name}: {beats/1e9:.1f} billion heartbeats in {animal_data[name]['lifespan']} years")
print()
print("Average across all animals: ~1-1.5 billion heartbeats per lifetime")
print("This invariance is a direct consequence of:")
print("  Heart rate ~ M^(-1/4) and Lifespan ~ M^(1/4)")
print("  Product = constant (the exponents cancel)")`,
      challenge: 'Humans are outliers — we live much longer than Kleiber\'s law predicts for our mass (75 years vs. predicted ~25 years). Calculate the human "heartbeat surplus" — how many extra billions of heartbeats do we get beyond the predicted ~1 billion?',
      successHint: 'Kleiber\'s law and quarter-power scaling reveal that biology has deep mathematical structure. The same fractal network geometry that explains frog heart rates also explains forest tree metabolism, bacterial growth rates, and ecosystem energy flow.',
    },
    {
      title: 'Island dwarfism and gigantism — evolution plays with size',
      concept: `On islands, evolution often produces dramatic size changes:

**Island dwarfism**: large mainland animals evolve smaller body sizes on islands.
- Examples: dwarf elephants of Sicily (1m tall), dwarf hippos of Madagascar, Flores "hobbit" (*Homo floresiensis*, 1m tall)
- Cause: limited food resources + no large predators → smaller size is advantageous

**Island gigantism**: small mainland animals evolve larger body sizes on islands.
- Examples: Komodo dragon (3m lizard), giant tortoises of Galapagos, giant rats of Flores
- Cause: no competition from large animals + empty ecological niches → larger size is advantageous

**The island rule** (Foster's rule, 1964): on islands, large species get smaller and small species get larger. Both converge toward a "medium" body size.

**NE India's miniature frogs:**
NE India isn't an island, but its isolated hilltops function like "sky islands" — separated by lowland valleys that tiny frogs can't cross. Each hilltop population evolves independently, and miniaturization is one of the most common outcomes — driven by the same pressures as island dwarfism.`,
      analogy: 'Islands are like economic experiments with controlled variables. Remove the big companies (large predators/competitors), limit the market (food resources), and small businesses (small animals) grow while big ones shrink. Both converge toward a middle size that optimizes resource use in the constrained market.',
      storyConnection: 'The tiny frog of NE India\'s rainforest is a product of "sky island" evolution — isolated on a hilltop, separated from other populations by valleys it can\'t cross. Like a Galapagos finch, it evolved its distinctive size in isolation. Each hilltop may have its own unique miniature species.',
      checkQuestion: '*Homo floresiensis* ("the Hobbit") was a 1-metre-tall human relative that lived on the island of Flores until ~50,000 years ago. If island dwarfism affected even humans, what does that tell us about the power of evolutionary forces?',
      checkAnswer: 'It tells us that no species is exempt from natural selection — not even intelligent, tool-using humans. The selective pressures on islands (limited food, small territory) are powerful enough to reshape body size even in large-brained hominins. It took roughly 700,000 years for *H. floresiensis* to dwarf from a larger ancestor. Evolution is patient and relentless.',
      codeIntro: 'Model island dwarfism/gigantism and the convergence toward optimal island size.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Island rule simulation
mainland_sizes = np.logspace(-3, 4, 100)  # kg
optimal_island_size = 1.0  # kg

# Island size after evolution
s = 0.4  # selection strength
island_sizes = 10 ** ((1-s) * np.log10(mainland_sizes) + s * np.log10(optimal_island_size))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Island rule
ax1.set_facecolor('#111827')
ax1.loglog(mainland_sizes, island_sizes, color='#22c55e', linewidth=2, label='Island rule prediction')
ax1.loglog(mainland_sizes, mainland_sizes, color='gray', linewidth=1, linestyle='--', label='No change')

# Real examples
examples = {
    'Dwarf elephant (Sicily)': {'mainland': 5000, 'island': 200, 'color': '#ef4444'},
    'Dwarf hippo (Madagascar)': {'mainland': 1500, 'island': 300, 'color': '#f59e0b'},
    'Giant tortoise (Galapagos)': {'mainland': 5, 'island': 250, 'color': '#3b82f6'},
    'Komodo dragon': {'mainland': 2, 'island': 70, 'color': '#a855f7'},
    'Giant rat (Flores)': {'mainland': 0.3, 'island': 2, 'color': '#ec4899'},
    'NE India mini frog': {'mainland': 0.005, 'island': 0.0005, 'color': '#22c55e'},
    'Homo floresiensis': {'mainland': 60, 'island': 25, 'color': '#6b7280'},
}

for name, data in examples.items():
    ax1.scatter(data['mainland'], data['island'], s=150, color=data['color'],
                edgecolor='white', linewidth=1.5, zorder=5)
    ax1.annotate(name, xy=(data['mainland'], data['island']),
                 xytext=(data['mainland']*1.5, data['island']*1.5),
                 color=data['color'], fontsize=6)

ax1.axhline(optimal_island_size, color='#f59e0b', linestyle=':', linewidth=0.5)
ax1.text(0.002, 1.5, 'Optimal island size', color='#f59e0b', fontsize=7)

ax1.set_xlabel('Mainland body mass (kg)', color='white')
ax1.set_ylabel('Island body mass (kg)', color='white')
ax1.set_title('The Island Rule: Large Shrink, Small Grow', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Evolution simulation
ax2.set_facecolor('#111827')
generations = 1000

mass_elephant = np.zeros(generations)
mass_elephant[0] = 5000
target_elephant = 200

mass_rat = np.zeros(generations)
mass_rat[0] = 0.3
target_rat = 2

for g in range(1, generations):
    mass_elephant[g] = mass_elephant[g-1] + (target_elephant - mass_elephant[g-1]) * 0.005
    mass_elephant[g] += np.random.normal(0, mass_elephant[g-1] * 0.01)
    mass_elephant[g] = max(mass_elephant[g], 50)

    mass_rat[g] = mass_rat[g-1] + (target_rat - mass_rat[g-1]) * 0.005
    mass_rat[g] += np.random.normal(0, mass_rat[g-1] * 0.01)
    mass_rat[g] = max(mass_rat[g], 0.1)

ax2.semilogy(range(generations), mass_elephant, color='#ef4444', linewidth=2, label='Elephant -> dwarf')
ax2.semilogy(range(generations), mass_rat, color='#3b82f6', linewidth=2, label='Rat -> giant')
ax2.axhline(optimal_island_size, color='#f59e0b', linestyle=':', linewidth=0.5)

ax2.set_xlabel('Generations', color='white')
ax2.set_ylabel('Body mass (kg, log scale)', color='white')
ax2.set_title('Evolutionary Size Change on Islands', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The island rule in action:")
for name, data in examples.items():
    ratio = data['island'] / data['mainland']
    direction = "dwarfed" if ratio < 1 else "grew"
    print(f"  {name}: {data['mainland']}kg -> {data['island']}kg ({direction}, {ratio:.2f}x)")
print()
print("NE India's hilltops function as 'sky islands'")
print("Each isolated hilltop allows independent evolution")
print("of miniature frog species — the island rule in action.")`,
      challenge: 'Research: how long (in generations) did it take for dwarf elephants to evolve on Sicily? If a generation is 20 years and the island formed ~500,000 years ago, how fast is island dwarfism compared to typical evolutionary rates?',
      successHint: 'Island biogeography connects evolution, ecology, and geography. The same principles that produced dwarf elephants on Sicily produce miniature frogs on NE Indian hilltops. Evolution is geography-dependent.',
    },
    {
      title: 'Designing for scale — engineering lessons from biology',
      concept: `The scaling laws we've explored in biology apply directly to engineering. When you scale a design up or down, the physics changes in predictable ways.

**Biological lessons for engineers:**

1. **Strength-to-weight** (square-cube law):
   - Small drones don't need to be aerodynamically perfect (strength >> weight)
   - Large aircraft must be precisely engineered (weight approaches strength limit)

2. **Heat management** (surface-area-to-volume):
   - Microchips need heat sinks because their SA/V is high
   - Large buildings need less heating per unit volume than small buildings
   - Same physics as frog body temperature regulation

3. **Distribution networks** (fractal scaling):
   - City road networks follow the same branching mathematics as blood vessels
   - Kleiber's law applies to cities: energy use scales as population^0.75

4. **Material properties at scale**:
   - Nanotechnology exploits different dominant forces at small scales (van der Waals > gravity)
   - Large structures face gravity as the dominant constraint
   - This is why gecko feet work (nanoscale adhesion) but a human-sized gecko couldn't climb walls

**The universal principle**: when you change scale, you change which physics dominates.`,
      analogy: 'Scaling in engineering is like translating between languages. You can\'t just scale every word — some concepts don\'t translate directly. A bridge design that works at 10 metres doesn\'t work at 1 kilometre because gravity (which scales as L³) overwhelms structural strength (which scales as L²). You need to "retranslate" the design for each scale.',
      storyConnection: 'The tiny frog of NE India lives in a world where different physics dominates: surface tension is stronger than gravity, air resistance is huge relative to inertia, and heat loss is almost instantaneous. Understanding these scale-dependent physics is essential for any engineer designing at non-human scales.',
      checkQuestion: 'A spider can survive a fall from any height (air resistance slows it to a survivable terminal velocity). An elephant dies from a fall of just a few metres. Explain this using the square-cube law.',
      checkAnswer: 'Air resistance is proportional to surface area (L²). Weight is proportional to volume (L³). For the spider, L is tiny, so air resistance / weight = L²/L³ = 1/L is very large — air resistance dominates, terminal velocity is low, and impact force is survivable. For the elephant, 1/L is very small — gravity dominates, terminal velocity is high, and the impact exceeds what bones can withstand. As J.B.S. Haldane wrote: "A mouse can be dropped down a thousand-yard mine shaft and walk away. A rat is killed, a man is broken, a horse splashes."',
      codeIntro: 'Apply biological scaling laws to engineering design challenges.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Engineering applications of scaling laws
scale = np.logspace(-6, 3, 200)  # meters (nanometer to kilometer)

# Dominant forces at each scale
gravity_force = scale ** 3
surface_tension = scale ** 1
van_der_waals = scale ** 0
air_resistance = scale ** 2

total = gravity_force + surface_tension + van_der_waals + air_resistance
gravity_pct = gravity_force / total * 100
surface_pct = surface_tension / total * 100
vdw_pct = van_der_waals / total * 100
air_pct = air_resistance / total * 100

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Dominant forces by scale
ax1.set_facecolor('#111827')
ax1.fill_between(scale, 0, vdw_pct, color='#a855f7', alpha=0.5, label='Van der Waals')
ax1.fill_between(scale, vdw_pct, vdw_pct + surface_pct, color='#3b82f6', alpha=0.5, label='Surface tension')
ax1.fill_between(scale, vdw_pct + surface_pct, vdw_pct + surface_pct + air_pct,
                 color='#f59e0b', alpha=0.5, label='Air resistance')
ax1.fill_between(scale, vdw_pct + surface_pct + air_pct, 100,
                 color='#ef4444', alpha=0.5, label='Gravity')

ax1.set_xscale('log')
ax1.set_xlabel('Scale (meters)', color='white')
ax1.set_ylabel('Relative importance (%)', color='white')
ax1.set_title('Which Physics Dominates at Each Scale?', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Mark biological and engineering examples
ex = [
    (1e-6, 'Bacteria\\nNanotech', '#a855f7'),
    (1e-4, 'Insect\\nMEMS', '#3b82f6'),
    (1e-2, 'Tiny frog\\nSmall drone', '#f59e0b'),
    (1, 'Human\\nCar', '#ef4444'),
    (100, 'Building\\nBridge', '#ef4444'),
]
for x, label, color in ex:
    ax1.axvline(x, color=color, linestyle=':', linewidth=0.5, alpha=0.5)
    ax1.text(x, 102, label, color=color, fontsize=6, ha='center')

# Terminal velocity vs size (fall survival)
ax2.set_facecolor('#111827')
body_size = np.logspace(-4, 1, 100)  # meters

density = 1000
rho_air = 1.2
Cd = 1.0
g = 9.81

mass_obj = density * body_size ** 3
area_obj = body_size ** 2
v_terminal = np.sqrt(2 * mass_obj * g / (rho_air * Cd * area_obj))

survivable_v = 15 * body_size ** 0.2

ax2.loglog(body_size * 1000, v_terminal, color='#ef4444', linewidth=2, label='Terminal velocity')
ax2.loglog(body_size * 1000, survivable_v, color='#22c55e', linewidth=2, label='Survivable impact')

ax2.fill_between(body_size * 1000, v_terminal, survivable_v,
                 where=survivable_v > v_terminal, alpha=0.15, color='#22c55e')
ax2.fill_between(body_size * 1000, v_terminal, survivable_v,
                 where=v_terminal > survivable_v, alpha=0.15, color='#ef4444')

fall_animals = [
    (0.5, 'Ant', '#22c55e'), (3, 'Spider', '#22c55e'),
    (10, 'Tiny frog', '#f59e0b'), (50, 'Cat', '#f59e0b'),
    (300, 'Human', '#ef4444'), (3000, 'Elephant', '#ef4444'),
]
for size_mm, name, color in fall_animals:
    size_m = size_mm / 1000
    vt = np.sqrt(2 * density * size_m**3 * g / (rho_air * Cd * size_m**2))
    ax2.plot(size_mm, vt, 'o', color=color, markersize=8)
    ax2.annotate(name, xy=(size_mm, vt), xytext=(size_mm*1.5, vt*1.3),
                 color=color, fontsize=8)

ax2.set_xlabel('Body size (mm)', color='white')
ax2.set_ylabel('Velocity (m/s)', color='white')
ax2.set_title("Fall Survival: Small Animals Can't Be Hurt by Falling", color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Engineering implications of scaling:")
print("  Nanoscale: van der Waals forces dominate (gecko adhesion, MEMS)")
print("  Microscale: surface tension dominates (microfluidics, insects)")
print("  Mesoscale: air resistance matters (small drones, tiny frogs)")
print("  Macroscale: gravity dominates (buildings, bridges, elephants)")
print()
print("Haldane's rule: 'For every type of animal there is a most")
print("convenient size, and a large change in size inevitably carries")
print("with it a change of form.'")
print()
print("From tiny frogs to skyscrapers, the physics is the same --")
print("only the dominant terms in the equations change with scale.")`,
      challenge: 'Design a drone the size of a tiny frog (10mm wingspan). Which forces dominate at this scale? Would fixed wings or flapping wings work better? Use the scaling relationships to justify your answer.',
      successHint: 'From the square-cube law to Kleiber\'s law to island dwarfism to engineering design — you\'ve traced the deep mathematical connections between biological size and physical law. The tiny frog is not just a curiosity; it\'s a living lesson in the physics of scale.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Scaling & Allometry</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for scaling and allometry simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}