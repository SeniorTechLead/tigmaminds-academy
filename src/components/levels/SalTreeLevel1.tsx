import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function SalTreeLevel1() {
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
      title: 'Tree anatomy — heartwood, sapwood, and bark',
      concept: `A tree trunk is not a uniform block of wood. It's a layered structure, like a Russian doll, with each layer serving a different function.

**From outside to inside:**
1. **Outer bark**: dead cells forming a protective shield against insects, fire, disease, and physical damage. In Sal trees, bark can be 5-10 cm thick.
2. **Inner bark (phloem)**: living tissue that transports sugars downward from leaves to roots. Think of it as the "food highway."
3. **Cambium**: a paper-thin layer of stem cells that produces new wood (inward) and new bark (outward). This is where the tree grows wider each year.
4. **Sapwood (xylem)**: living wood that transports water upward from roots to leaves. The "water highway." Contains starch reserves.
5. **Heartwood**: dead sapwood at the center. No longer transports water, but is filled with resins, tannins, and oils that make it darker, harder, and more resistant to decay.

The Sal tree (*Shorea robusta*) is prized for its heartwood — one of the hardest, most durable tropical hardwoods. Sal heartwood resists termites, fungi, and water for decades, making it the traditional choice for foundations and door frames across NE India.`,
      analogy: 'A tree trunk is like a city with ring roads. The outer bark is the city wall. The phloem is the outbound delivery trucks. The cambium is the construction zone (always building more city). The sapwood is the inbound water pipes. The heartwood is the old city centre — no longer active, but still solid and important for structural support.',
      storyConnection: 'The story says the Sal tree "never bends" because of its strong heart. Scientifically, this is the heartwood — the dead, dense, resin-filled core that gives Sal its legendary strength. The "heart" that makes Sal unbending is literally dead wood, made strong by the chemistry of decay resistance.',
      checkQuestion: 'If heartwood is dead, and sapwood is alive, could you hollow out the heartwood without killing the tree?',
      checkAnswer: 'Yes — and nature does this regularly. Many old trees have hollow trunks where the heartwood has rotted away. They survive because the living sapwood and cambium (outer layers) are intact. The sapwood handles water transport and the bark protects. But the tree is structurally weaker — more likely to blow over in storms.',
      codeIntro: 'Visualize tree trunk cross-section with proportional layer thicknesses for different species.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Tree cross-section comparison
trees = {
    'Sal (Shorea robusta)': {
        'outer_bark': 8, 'inner_bark': 3, 'cambium': 0.5,
        'sapwood': 15, 'heartwood': 73.5,
        'color': '#8b4513', 'heartwood_color': '#5c3317'
    },
    'Pine (softwood)': {
        'outer_bark': 5, 'inner_bark': 3, 'cambium': 0.5,
        'sapwood': 40, 'heartwood': 51.5,
        'color': '#deb887', 'heartwood_color': '#d2a060'
    },
    'Balsa (lightest wood)': {
        'outer_bark': 3, 'inner_bark': 2, 'cambium': 0.5,
        'sapwood': 55, 'heartwood': 39.5,
        'color': '#faebd7', 'heartwood_color': '#f5deb3'
    },
}

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

for ax, (name, layers) in zip(axes, trees.items()):
    ax.set_facecolor('#111827')
    ax.set_aspect('equal')

    # Draw concentric rings
    total = sum([layers['outer_bark'], layers['inner_bark'], layers['cambium'],
                 layers['sapwood'], layers['heartwood']])
    max_r = 50  # pixels

    radii = []
    r = max_r
    for layer_name, pct in [('Outer bark', layers['outer_bark']),
                             ('Inner bark', layers['inner_bark']),
                             ('Cambium', layers['cambium']),
                             ('Sapwood', layers['sapwood']),
                             ('Heartwood', layers['heartwood'])]:
        radii.append((r, layer_name, pct))
        r -= pct / total * max_r

    layer_colors = ['#5c4033', '#8b6914', '#22c55e', layers['color'], layers['heartwood_color']]

    for i, ((radius, lname, pct), color) in enumerate(zip(radii, layer_colors)):
        circle = plt.Circle((0, 0), radius, facecolor=color, edgecolor='white',
                            linewidth=0.5, alpha=0.85)
        ax.add_patch(circle)

    # Labels
    ax.set_title(name, color='white', fontsize=11, fontweight='bold')
    ax.set_xlim(-60, 60)
    ax.set_ylim(-60, 60)
    ax.set_xticks([])
    ax.set_yticks([])

    # Layer labels on right side
    r_pos = max_r
    for lname, pct in [('Bark', layers['outer_bark']),
                        ('Phloem', layers['inner_bark']),
                        ('Sapwood', layers['sapwood']),
                        ('Heartwood', layers['heartwood'])]:
        r_pos -= pct / total * max_r / 2
        if pct > 3:
            ax.annotate(f'{lname} ({pct:.0f}%)', xy=(r_pos * 0.7, r_pos * 0.7),
                       color='white', fontsize=6, ha='center')
        r_pos -= pct / total * max_r / 2

# Add legend
fig.text(0.5, 0.02, 'Brown = bark | Yellow = phloem | Green = cambium | Light = sapwood | Dark = heartwood',
         ha='center', color='gray', fontsize=8)

plt.tight_layout()
plt.show()

print("Tree anatomy comparison:")
print(f"  Sal: {trees['Sal (Shorea robusta)']['heartwood']}% heartwood (dense, durable)")
print(f"  Pine: {trees['Pine (softwood)']['heartwood']}% heartwood (lighter, less durable)")
print(f"  Balsa: {trees['Balsa (lightest wood)']['heartwood']}% heartwood (very light, soft)")
print()
print("Sal heartwood density: ~880 kg/m3 (sinks in water)")
print("Pine heartwood density: ~500 kg/m3")
print("Balsa heartwood density: ~160 kg/m3 (lighter than cork)")
print()
print("The proportion and density of heartwood determines")
print("a wood's strength, durability, and commercial value.")`,
      challenge: 'Add annual growth rings to the visualization. Sal trees in NE India grow about 2-4mm in trunk radius per year. How many rings would a 50-year-old Sal tree have, and how wide would it be?',
      successHint: 'Tree anatomy is the foundation of wood science, forestry, and timber engineering. Understanding the difference between heartwood and sapwood explains why some woods last centuries and others decay in years.',
    },
    {
      title: 'Why wood is strong — cellulose plus lignin',
      concept: `Wood is one of the strongest natural materials per unit weight. Its strength comes from two molecules working together:

**Cellulose**: long chains of glucose molecules linked together and bundled into **microfibrils** (like ropes). Cellulose provides **tensile strength** — resistance to being pulled apart. Individually, cellulose fibers are stronger than steel wire of the same thickness.

**Lignin**: a complex, cross-linked polymer that fills the spaces between cellulose fibers. Lignin provides **compressive strength** — resistance to being crushed. It also waterproofs the cell wall and resists microbial attack.

Together, cellulose + lignin form a **natural composite material** — analogous to fiberglass (glass fibers in resin) or reinforced concrete (steel rebar in concrete).

**The proportions matter:**
- Hardwoods (Sal, oak, teak): ~40% cellulose, ~25% lignin → strong and rigid
- Softwoods (pine, spruce): ~40% cellulose, ~28% lignin → less dense but still strong
- Bamboo: ~50% cellulose, ~25% lignin → high tensile strength
- Balsa: ~40% cellulose, ~22% lignin → very low density (large cells, thin walls)`,
      analogy: 'Cellulose + lignin is like reinforced concrete. Cellulose fibers are the steel rebar (strong in tension). Lignin is the concrete (strong in compression). Neither alone is as good as both together. Nature invented reinforced concrete 400 million years before humans did.',
      storyConnection: 'The Sal tree "never bends" because its cellulose fibers resist stretching and its lignin resists crushing. When wind pushes the trunk, one side is compressed and the other is stretched — the cellulose-lignin composite handles both simultaneously.',
      checkQuestion: 'Paper is made from cellulose (with lignin removed). Why is paper so much weaker than wood if it has the same cellulose?',
      checkAnswer: 'Two reasons: (1) The cellulose fibers are shortened and disordered during pulping — in wood, they\'re long and aligned. Short, random fibers are much weaker than long, aligned ones. (2) Lignin provides compressive strength and cross-links the fibers. Without lignin, cellulose fibers can slide past each other easily. Paper tears because the fibers separate; wood doesn\'t because lignin holds them together.',
      codeIntro: 'Compare the mechanical properties of cellulose, lignin, and their composite.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Material properties
components = {
    'Cellulose\\n(fibers)': {'tensile': 750, 'compressive': 50, 'density': 1500, 'color': '#22c55e'},
    'Lignin\\n(matrix)': {'tensile': 50, 'compressive': 200, 'density': 1300, 'color': '#f59e0b'},
    'Wood composite\\n(Sal)': {'tensile': 120, 'compressive': 65, 'density': 880, 'color': '#8b4513'},
    'Wood composite\\n(Pine)': {'tensile': 40, 'compressive': 35, 'density': 500, 'color': '#deb887'},
    'Steel': {'tensile': 250, 'compressive': 250, 'density': 7800, 'color': '#6b7280'},
    'Concrete': {'tensile': 5, 'compressive': 40, 'density': 2400, 'color': '#94a3b8'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Tensile vs compressive strength
ax1.set_facecolor('#111827')
for name, props in components.items():
    ax1.scatter(props['compressive'], props['tensile'], s=props['density']/5,
                color=props['color'], edgecolor='white', linewidth=1, zorder=5, alpha=0.85)
    ax1.annotate(name.replace('\\n', ' '), xy=(props['compressive'], props['tensile']),
                 xytext=(props['compressive']+5, props['tensile']+15),
                 color=props['color'], fontsize=7)

ax1.set_xlabel('Compressive strength (MPa)', color='white')
ax1.set_ylabel('Tensile strength (MPa)', color='white')
ax1.set_title('Strength Profile (bubble size = density)', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# How composition affects properties
ax2.set_facecolor('#111827')
cellulose_pct = np.linspace(0, 100, 100)
lignin_pct = 100 - cellulose_pct

# Simple rule of mixtures (composite theory)
tensile_composite = (cellulose_pct/100 * 750 + lignin_pct/100 * 50)
compressive_composite = (cellulose_pct/100 * 50 + lignin_pct/100 * 200)

# With synergy (cross-linking adds extra strength)
synergy = 0.3 * cellulose_pct/100 * lignin_pct/100 * 200
compressive_synergy = compressive_composite + synergy

ax2.plot(cellulose_pct, tensile_composite, color='#22c55e', linewidth=2, label='Tensile strength')
ax2.plot(cellulose_pct, compressive_synergy, color='#f59e0b', linewidth=2, label='Compressive strength (with synergy)')
ax2.plot(cellulose_pct, compressive_composite, color='#f59e0b', linewidth=1, linestyle=':', label='Compressive (no synergy)')

# Mark real wood compositions
ax2.axvline(40, color='gray', linestyle=':', linewidth=0.5)
ax2.text(42, 600, 'Typical wood\\n(~40% cellulose)', color='gray', fontsize=8)

ax2.set_xlabel('Cellulose content (%)', color='white')
ax2.set_ylabel('Strength (MPa)', color='white')
ax2.set_title('Composite Properties vs Cellulose:Lignin Ratio', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Cellulose vs Lignin — division of labor:")
print("  Cellulose: tensile strength champion (750 MPa)")
print("  Lignin: compressive strength + waterproofing + decay resistance")
print("  Together: a composite stronger than either alone")
print()
print("Sal wood strength:")
print(f"  Tensile: {components['Wood composite' + chr(10) + '(Sal)']['tensile']} MPa")
print(f"  Compressive: {components['Wood composite' + chr(10) + '(Sal)']['compressive']} MPa")
print(f"  Density: {components['Wood composite' + chr(10) + '(Sal)']['density']} kg/m3")
print()
print("Nature invented composite materials 400 million years ago.")
print("We reinvented them as fiberglass, carbon fiber, and reinforced concrete.")`,
      challenge: 'Research the composition of Sal heartwood vs. sapwood. Heartwood has more extractives (resins, tannins). How do these extractives add to the wood\'s durability? Add them to the composite model.',
      successHint: 'Wood science is materials science. Cellulose + lignin is nature\'s version of fiber-reinforced composites. Understanding this composite structure explains everything from why trees stand to why Sal door frames last centuries.',
    },
    {
      title: 'Grain direction and strength — why wood breaks the way it does',
      concept: `Wood is **anisotropic** — its strength depends on direction. This is because cellulose fibers are aligned along the trunk (longitudinally), creating very different properties along vs. across the grain.

**Three strength directions:**
- **Along the grain** (longitudinal): strongest direction. Fibers are aligned, sharing the load. This is the direction a tree trunk supports weight.
- **Across the grain** (radial/tangential): weakest direction. Load has to break across fibers or separate them. Wood splits easily along the grain because you're separating fibers rather than breaking them.
- **Ratio**: wood is typically 10-20x stronger along the grain than across it.

**Practical implications:**
- A wooden beam supports the most weight when fibers run along its length
- Wood splits along the grain (how we chop firewood)
- Knots (where branches grew) disrupt fiber alignment and create weak points
- Plywood alternates grain direction in each layer → strong in all directions

Sal wood has extremely interlocked grain — the fibers don't run straight but weave back and forth. This makes it:
- **Harder to split** (good for structural use)
- **Harder to work** with tools (challenging for carpenters)
- **More stable** (less warping when moisture changes)`,
      analogy: 'Grain direction in wood is like the direction of threads in a rope. Pull along the threads: very strong. Pull across: the threads separate easily. A single rope is strong in one direction. Weave many ropes into a net (interlocked grain), and it\'s strong in every direction. Sal wood\'s interlocked grain makes it a natural "net."',
      storyConnection: 'The Sal tree "never bends" partly because of its interlocked grain. Wind pushes from many directions, and straight-grained trees can split along the grain under wind stress. Sal\'s woven grain resists splitting from any direction — natural engineering for storm resistance.',
      checkQuestion: 'Log cabins are built with logs running horizontally. Why not stack them vertically (the strong direction)?',
      checkAnswer: 'Because horizontal logs span gaps (like beams over windows and doors) and support weight from above through their length — which IS along the grain. A vertical log wall would be loaded perpendicular to the grain at every horizontal joint, and the weight would crush the grain. Horizontal logs work because the beam action uses longitudinal strength, and the wall thickness (the log diameter) provides compressive strength across the grain where needed.',
      codeIntro: 'Demonstrate wood strength anisotropy: along vs. across the grain.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Wood strength by direction (MPa)
wood_types = {
    'Sal (hardwood)': {
        'along': 120, 'radial': 12, 'tangential': 8,
        'color': '#8b4513'
    },
    'Oak (hardwood)': {
        'along': 90, 'radial': 10, 'tangential': 7,
        'color': '#a0522d'
    },
    'Pine (softwood)': {
        'along': 40, 'radial': 5, 'tangential': 3,
        'color': '#deb887'
    },
    'Balsa (softwood)': {
        'along': 12, 'radial': 1.5, 'tangential': 1,
        'color': '#faebd7'
    },
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Grouped bar chart: strength by direction
ax1.set_facecolor('#111827')
x = np.arange(len(wood_types))
width = 0.25

along = [w['along'] for w in wood_types.values()]
radial = [w['radial'] for w in wood_types.values()]
tangential = [w['tangential'] for w in wood_types.values()]

ax1.bar(x - width, along, width, color='#22c55e', label='Along grain', alpha=0.85)
ax1.bar(x, radial, width, color='#3b82f6', label='Radial (across)', alpha=0.85)
ax1.bar(x + width, tangential, width, color='#ef4444', label='Tangential (across)', alpha=0.85)

ax1.set_xticks(x)
ax1.set_xticklabels(list(wood_types.keys()), color='white', fontsize=8)
ax1.set_ylabel('Tensile strength (MPa)', color='white')
ax1.set_title('Wood Strength is Directional (Anisotropic)', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Anisotropy ratio
for i, name in enumerate(wood_types.keys()):
    ratio = wood_types[name]['along'] / wood_types[name]['tangential']
    ax1.text(i, wood_types[name]['along'] + 3, f'{ratio:.0f}x', ha='center',
             color='#f59e0b', fontsize=9, fontweight='bold')

# Polar plot: strength as function of angle
ax2 = plt.subplot(122, polar=True)
ax2.set_facecolor('#111827')

angles = np.linspace(0, 2*np.pi, 360)

for name, props in wood_types.items():
    # Simplified model: strength varies as cos² along grain + sin² across grain
    strength_at_angle = (props['along'] * np.cos(angles)**2 +
                        props['radial'] * np.sin(angles)**2)
    ax2.plot(angles, strength_at_angle, linewidth=2, label=name, color=props['color'])

ax2.set_title('Strength vs Direction\\n(0° = along grain)', color='white', fontsize=11, pad=20)
ax2.legend(loc='upper right', bbox_to_anchor=(1.4, 1.1), facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', fontsize=7)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Anisotropy ratios (along:across):")
for name, props in wood_types.items():
    ratio = props['along'] / props['tangential']
    print(f"  {name}: {ratio:.0f}:1")
print()
print("Sal's interlocked grain reduces anisotropy ratio")
print("compared to straight-grained woods — stronger across grain.")
print()
print("Engineering rule: always load wood ALONG the grain.")
print("A beam with grain along its length is 10-15x stronger")
print("than the same beam turned sideways.")`,
      challenge: 'Plywood alternates grain direction 90 degrees in each layer. If you stack 5 layers, what would the strength profile look like on the polar plot? (Hint: it should be more circular — nearly isotropic.)',
      successHint: 'Anisotropy is not unique to wood — bone, muscle, carbon fiber, and crystalline materials all have directional strength. Understanding anisotropy is key to engineering with any fibrous material.',
    },
    {
      title: 'Comparing hardwoods and softwoods',
      concept: `The terms "hardwood" and "softwood" are botanical classifications, not descriptions of hardness:

**Hardwoods** (angiosperms — flowering trees):
- Have vessels (wide tubes) for water transport + fibers for support
- Broad leaves (usually deciduous in temperate zones, evergreen in tropics)
- Examples: Sal, oak, teak, mahogany, maple
- Generally (but not always) harder and denser

**Softwoods** (gymnosperms — cone-bearing trees):
- Have tracheids (narrow tubes that do BOTH transport and support)
- Needle-like leaves (usually evergreen)
- Examples: pine, spruce, cedar, redwood
- Generally lighter and faster-growing

**The exceptions that break the rule:**
- Balsa is a hardwood (angiosperm) but is the world's lightest commercial wood
- Yew is a softwood (gymnosperm) but is harder than most hardwoods
- So "hardwood" and "softwood" refer to evolutionary group, not physical hardness

The key structural difference: hardwood vessels create a more complex internal architecture than softwood tracheids, generally producing denser, harder wood with more varied grain patterns.`,
      analogy: 'Hardwood vs. softwood is like "new world" vs. "old world" in wine. It refers to where the tree\'s family evolved, not what the wood feels like. Just as a California Cabernet can be as good as a French one, a softwood (yew) can be harder than a hardwood (balsa). The label is about family history, not quality.',
      storyConnection: 'Sal is a hardwood — the dominant hardwood of NE India\'s forests. Its density (880 kg/m³) makes it one of the heaviest commercial woods. The "never bends" quality comes from being a particularly dense hardwood with interlocked grain.',
      checkQuestion: 'Why do softwoods grow faster than hardwoods? What\'s the trade-off?',
      checkAnswer: 'Softwoods use tracheids for both transport and support — simpler, faster to produce. Hardwoods build two separate systems (vessels + fibers) — more complex, slower to produce, but more efficient and stronger. It\'s the generalist (softwood) vs. specialist (hardwood) trade-off. Fast and simple vs. slow and optimized.',
      codeIntro: 'Compare properties of major hardwood and softwood species.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Wood species comparison
species = {
    'Sal': {'density': 880, 'hardness': 1370, 'type': 'hardwood', 'growth': 2},
    'Teak': {'density': 630, 'hardness': 1070, 'type': 'hardwood', 'growth': 3},
    'Oak': {'density': 710, 'hardness': 1290, 'type': 'hardwood', 'growth': 3},
    'Mahogany': {'density': 540, 'hardness': 800, 'type': 'hardwood', 'growth': 4},
    'Balsa': {'density': 160, 'hardness': 67, 'type': 'hardwood', 'growth': 10},
    'Pine': {'density': 500, 'hardness': 380, 'type': 'softwood', 'growth': 7},
    'Spruce': {'density': 430, 'hardness': 410, 'type': 'softwood', 'growth': 6},
    'Cedar': {'density': 370, 'hardness': 320, 'type': 'softwood', 'growth': 5},
    'Yew': {'density': 670, 'hardness': 1520, 'type': 'softwood', 'growth': 2},
    'Redwood': {'density': 410, 'hardness': 420, 'type': 'softwood', 'growth': 6},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Density vs hardness scatter
ax1.set_facecolor('#111827')
for name, props in species.items():
    color = '#22c55e' if props['type'] == 'hardwood' else '#3b82f6'
    marker = 'o' if props['type'] == 'hardwood' else 's'
    ax1.scatter(props['density'], props['hardness'], s=150, color=color,
                marker=marker, edgecolor='white', linewidth=1, zorder=5)
    ax1.annotate(name, xy=(props['density'], props['hardness']),
                 xytext=(props['density']+15, props['hardness']+30),
                 color=color, fontsize=7)

ax1.set_xlabel('Density (kg/m3)', color='white')
ax1.set_ylabel('Janka Hardness (N)', color='white')
ax1.set_title('Density vs Hardness: Hardwoods (circles) & Softwoods (squares)',
              color='white', fontsize=11)
ax1.tick_params(colors='gray')

# Highlight exceptions
ax1.annotate('Balsa: hardwood\\nbut softest!', xy=(160, 67),
             xytext=(250, 200), color='#f59e0b', fontsize=8,
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax1.annotate('Yew: softwood\\nbut very hard!', xy=(670, 1520),
             xytext=(500, 1600), color='#f59e0b', fontsize=8,
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Growth rate vs density
ax2.set_facecolor('#111827')
for name, props in species.items():
    color = '#22c55e' if props['type'] == 'hardwood' else '#3b82f6'
    ax2.scatter(props['growth'], props['density'], s=150, color=color,
                edgecolor='white', linewidth=1, zorder=5)
    ax2.annotate(name, xy=(props['growth'], props['density']),
                 xytext=(props['growth']+0.2, props['density']+20),
                 color=color, fontsize=7)

# Trend line
growths = [p['growth'] for p in species.values()]
densities = [p['density'] for p in species.values()]
z = np.polyfit(growths, densities, 1)
p_func = np.poly1d(z)
x_trend = np.linspace(1, 11, 100)
ax2.plot(x_trend, p_func(x_trend), '--', color='gray', linewidth=1, alpha=0.5)

ax2.set_xlabel('Growth rate (mm radius/year)', color='white')
ax2.set_ylabel('Density (kg/m3)', color='white')
ax2.set_title('Growth Speed vs Wood Density: The Trade-off', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key findings:")
print(f"  Densest: Sal ({species['Sal']['density']} kg/m3)")
print(f"  Lightest: Balsa ({species['Balsa']['density']} kg/m3)")
print(f"  Hardest: Yew ({species['Yew']['hardness']} N) — a SOFTWOOD!")
print(f"  Softest: Balsa ({species['Balsa']['hardness']} N) — a HARDWOOD!")
print()
print("The trade-off: fast growth → light wood, slow growth → dense wood")
print("Sal grows ~2mm/year radius — very slow, very dense.")
print("Balsa grows ~10mm/year — very fast, very light.")`,
      challenge: 'Add bamboo to the chart. Research its Janka hardness (~1380 N for strand-woven bamboo) and density (~700 kg/m³ for laminated). Is bamboo more like a hardwood or softwood in properties?',
      successHint: 'The hardwood/softwood distinction is about evolution, not properties. But there IS a real trend: slower-growing species produce denser wood. This density-growth trade-off is one of the most important patterns in wood science.',
    },
    {
      title: 'Wood density and uses — matching material to job',
      concept: `Wood density determines its suitability for different applications. Choosing the right wood for the job is applied materials science.

**Density classes and uses:**
- **Very heavy (>800 kg/m³)**: Sal, ebony, ironwood. Structural foundations, ship keels, tool handles. Resists compression, impact, and wear.
- **Heavy (600-800)**: Teak, oak, walnut. Furniture, flooring, boat building. Good balance of strength and workability.
- **Medium (400-600)**: Pine, cherry, maple. General construction, cabinets, musical instruments. Easy to work, versatile.
- **Light (200-400)**: Cedar, spruce, redwood. Cladding, decking, model building. Good insulation, weather resistance.
- **Very light (<200)**: Balsa, paulownia. Model aircraft, surfboards, theatrical props. Extremely easy to shape.

**Sal in NE India:**
- Railway sleepers (ties): Sal is the traditional choice because it handles compression from tons of train + weather cycling without failure
- Door/window frames: resists termites and humidity swings
- Bridge timbers: high strength in wet conditions
- Temple/building foundations: can last centuries in contact with soil`,
      analogy: 'Choosing wood by density is like choosing athletes for a team. A heavyweight boxer (Sal) is wrong for a marathon, and a marathon runner (balsa) is wrong for boxing. Every wood excels in its weight class. The skill is matching the material to the mechanical demands.',
      storyConnection: 'The Sal tree "never bends" because its 880 kg/m³ density makes it one of the heaviest tropical hardwoods. In NE India, Sal has been the go-to structural timber for centuries — bridges, temples, railways. The story\'s reverence for Sal reflects millennia of practical engineering experience.',
      checkQuestion: 'Sal is so dense it sinks in water (density > 1000 for green Sal). How do you transport Sal logs down a river?',
      checkAnswer: 'You don\'t — at least not by floating. Sal logs must be transported by truck or rail, not river rafting. This is one reason Sal timber is more expensive than lighter woods in remote areas. However, air-dried Sal (~880 kg/m³) is slightly less than water, so partially dried logs can float — but just barely, and they often waterlog and sink.',
      codeIntro: 'Build a wood selection tool: input mechanical requirements, find the best wood.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Wood properties database
woods = {
    'Sal': {'density': 880, 'tensile': 120, 'compress': 65, 'durability': 10, 'workability': 3, 'cost': 7},
    'Teak': {'density': 630, 'tensile': 95, 'compress': 55, 'durability': 9, 'workability': 7, 'cost': 9},
    'Oak': {'density': 710, 'tensile': 90, 'compress': 50, 'durability': 7, 'workability': 6, 'cost': 6},
    'Pine': {'density': 500, 'tensile': 40, 'compress': 35, 'durability': 3, 'workability': 9, 'cost': 3},
    'Cedar': {'density': 370, 'tensile': 35, 'compress': 30, 'durability': 8, 'workability': 9, 'cost': 4},
    'Spruce': {'density': 430, 'tensile': 45, 'compress': 38, 'durability': 2, 'workability': 8, 'cost': 3},
}

# Application requirements (0-10 importance)
applications = {
    'Railway sleeper': {'compress': 10, 'durability': 10, 'density_min': 700},
    'Furniture': {'workability': 8, 'durability': 6, 'density_min': 400},
    'Boat hull': {'durability': 10, 'tensile': 8, 'density_min': 500},
    'Roof beam': {'tensile': 9, 'compress': 7, 'density_min': 400},
    'Outdoor deck': {'durability': 9, 'workability': 6, 'density_min': 300},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Density vs durability (most common selection criteria)
ax1.set_facecolor('#111827')
colors_map = {'Sal': '#8b4513', 'Teak': '#d2691e', 'Oak': '#a0522d',
              'Pine': '#deb887', 'Cedar': '#cd853f', 'Spruce': '#d2b48c'}

for name, props in woods.items():
    ax1.scatter(props['density'], props['durability'], s=props['tensile']*3,
                color=colors_map[name], edgecolor='white', linewidth=1.5, zorder=5)
    ax1.annotate(name, xy=(props['density'], props['durability']),
                 xytext=(props['density']+15, props['durability']+0.3),
                 color=colors_map[name], fontsize=9, fontweight='bold')

# Application zones
ax1.axhspan(7, 10.5, xmin=0.55, alpha=0.08, color='#ef4444')
ax1.text(820, 9.5, 'Structural\\n(sleepers, bridges)', color='#ef4444', fontsize=7, ha='center')
ax1.axhspan(5, 8, xmin=0.2, xmax=0.6, alpha=0.08, color='#3b82f6')
ax1.text(600, 6.5, 'Furniture\\n& boats', color='#3b82f6', fontsize=7, ha='center')
ax1.axhspan(0, 5, xmin=0, xmax=0.5, alpha=0.08, color='#22c55e')
ax1.text(400, 2, 'Light construction\\n& framing', color='#22c55e', fontsize=7, ha='center')

ax1.set_xlabel('Density (kg/m3)', color='white')
ax1.set_ylabel('Durability (0-10)', color='white')
ax1.set_title('Wood Selection: Density vs Durability\\n(bubble size = tensile strength)', color='white', fontsize=11)
ax1.tick_params(colors='gray')

# Score each wood for each application
ax2.set_facecolor('#111827')
app_names = list(applications.keys())
wood_names = list(woods.keys())

scores = np.zeros((len(app_names), len(wood_names)))
for i, (app_name, reqs) in enumerate(applications.items()):
    for j, (wood_name, props) in enumerate(woods.items()):
        score = 0
        if props['density'] >= reqs.get('density_min', 0):
            score += 3
        score += min(props['durability'] / 10, 1) * reqs.get('durability', 5)
        score += min(props['tensile'] / 120, 1) * reqs.get('tensile', 5)
        score += min(props['compress'] / 65, 1) * reqs.get('compress', 5)
        score += min(props['workability'] / 10, 1) * reqs.get('workability', 5)
        scores[i, j] = score

# Normalize scores per application
for i in range(len(app_names)):
    if scores[i].max() > 0:
        scores[i] = scores[i] / scores[i].max() * 10

im = ax2.imshow(scores, cmap='YlGn', aspect='auto')
ax2.set_xticks(range(len(wood_names)))
ax2.set_xticklabels(wood_names, color='white', fontsize=8, rotation=30, ha='right')
ax2.set_yticks(range(len(app_names)))
ax2.set_yticklabels(app_names, color='white', fontsize=9)
ax2.set_title('Wood-Application Suitability (10 = best)', color='white', fontsize=11)

for i in range(len(app_names)):
    for j in range(len(wood_names)):
        ax2.text(j, i, f'{scores[i,j]:.1f}', ha='center', va='center',
                 color='black' if scores[i,j] > 5 else 'white', fontsize=8)

plt.colorbar(im, ax=ax2, label='Suitability score')
plt.tight_layout()
plt.show()

print("Best wood for each application:")
for i, app_name in enumerate(app_names):
    best_idx = np.argmax(scores[i])
    print(f"  {app_name}: {wood_names[best_idx]} (score {scores[i, best_idx]:.1f}/10)")`,
      challenge: 'Add cost-effectiveness to the scoring: divide suitability score by cost. Which wood gives the best value for each application? (Hint: expensive teak might not always be the best choice.)',
      successHint: 'Material selection is engineering in action. Matching wood properties to application requirements is the same process engineers use for metals, plastics, and composites. The Sal tree\'s dominance in NE Indian construction is centuries of empirical material selection.',
    },
    {
      title: 'Deforestation and sustainable forestry — using without losing',
      concept: `Sal forests once covered most of NE India's plains and foothills. Today, they're under pressure from:

- **Logging**: legal and illegal harvesting outpaces regrowth (Sal takes 60-80 years to reach timber size)
- **Agriculture**: forest cleared for rice, tea, and other crops
- **Development**: roads, dams, and urban expansion fragment forests
- **Firewood**: rural communities depend on wood for cooking fuel
- **Climate change**: shifting rainfall patterns stress drought-sensitive Sal

**Sustainable forestry approaches:**
1. **Selective logging**: harvest only mature trees, leave young ones to grow. Works if cutting rate < regrowth rate.
2. **Community forestry**: local communities manage and benefit from forests. Proven effective in Nepal's Sal forests (forest cover INCREASED under community management).
3. **Plantation forestry**: grow Sal in dedicated plantations, reducing pressure on natural forests.
4. **Agroforestry**: grow Sal trees alongside crops — the trees provide shade, improve soil, and yield timber.
5. **Certification**: FSC (Forest Stewardship Council) certification ensures timber comes from sustainably managed sources.

The key metric: **annual allowable cut** — the maximum volume of timber that can be harvested while maintaining forest health indefinitely.`,
      analogy: 'Sustainable forestry is like spending only the interest from a savings account, never the principal. The forest is the principal; timber growth is the interest. If you harvest (spend) less than the annual growth (interest), the forest sustains itself forever. If you harvest more, you deplete the principal and eventually go bankrupt.',
      storyConnection: 'The story warns: "if you take too much, the Sal will be gone." This is the forestry dilemma in real life. NE India\'s Sal forests can provide timber, employment, and ecosystem services indefinitely — but only if harvesting stays within the forest\'s regeneration capacity.',
      checkQuestion: 'If Sal takes 80 years to reach timber size and a forest has 1000 mature trees, how many can you harvest per year sustainably?',
      checkAnswer: 'At most 1000/80 = 12.5 trees per year (about 12). This assumes every harvested tree is replaced by a seedling that survives to maturity — unrealistic without active management. In practice, sustainable yield is lower because not all seedlings survive, and you need buffer for drought years, disease, and climate variation. A conservative estimate: 8-10 trees per year.',
      codeIntro: 'Model forest dynamics under different harvesting scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Forest dynamics model
years = 200
initial_trees = 1000

scenarios = {
    'No harvest\\n(natural forest)': 0.00,
    'Sustainable\\n(1% per year)': 0.01,
    'Moderate\\n(3% per year)': 0.03,
    'Overharvest\\n(5% per year)': 0.05,
    'Destructive\\n(10% per year)': 0.10,
}

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 8))
fig.patch.set_facecolor('#1f2937')

# Forest population over time
ax1.set_facecolor('#111827')
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#dc2626']

for (name, harvest_rate), color in zip(scenarios.items(), colors):
    trees = np.zeros(years)
    trees[0] = initial_trees

    for y in range(1, years):
        # Natural growth: logistic model
        growth_rate = 0.03  # 3% natural growth per year
        carrying_capacity = 1200
        growth = growth_rate * trees[y-1] * (1 - trees[y-1] / carrying_capacity)

        # Harvest
        harvest = harvest_rate * trees[y-1]

        # Natural mortality
        mortality = 0.01 * trees[y-1]

        # Stochastic variation
        noise = np.random.normal(0, 5)

        trees[y] = max(trees[y-1] + growth - harvest - mortality + noise, 0)

    ax1.plot(range(years), trees, linewidth=2, label=name.replace('\\n', ' '), color=color)

ax1.axhline(initial_trees, color='gray', linestyle=':', linewidth=0.5)
ax1.set_xlabel('Years', color='white')
ax1.set_ylabel('Number of mature trees', color='white')
ax1.set_title('Sal Forest Under Different Harvest Rates', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Cumulative timber yield over time
ax2.set_facecolor('#111827')

for (name, harvest_rate), color in zip(scenarios.items(), colors):
    trees = np.zeros(years)
    trees[0] = initial_trees
    cumulative_harvest = np.zeros(years)

    for y in range(1, years):
        growth_rate = 0.03
        carrying_capacity = 1200
        growth = growth_rate * trees[y-1] * (1 - trees[y-1] / carrying_capacity)
        harvest = harvest_rate * trees[y-1]
        mortality = 0.01 * trees[y-1]
        trees[y] = max(trees[y-1] + growth - harvest - mortality, 0)
        cumulative_harvest[y] = cumulative_harvest[y-1] + harvest

    ax2.plot(range(years), cumulative_harvest, linewidth=2,
             label=name.replace('\\n', ' '), color=color)

ax2.set_xlabel('Years', color='white')
ax2.set_ylabel('Cumulative timber harvested (trees)', color='white')
ax2.set_title('Total Timber Yield: Patience Pays Off', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Harvest scenarios (200-year totals):")
for name, rate in scenarios.items():
    trees_arr = np.zeros(years)
    trees_arr[0] = initial_trees
    total_harvest = 0
    for y in range(1, years):
        growth = 0.03 * trees_arr[y-1] * (1 - trees_arr[y-1] / 1200)
        harvest = rate * trees_arr[y-1]
        trees_arr[y] = max(trees_arr[y-1] + growth - harvest - 0.01 * trees_arr[y-1], 0)
        total_harvest += harvest
    clean_name = name.replace('\\n', ' ')
    print(f"  {clean_name}: {total_harvest:.0f} trees total, {trees_arr[-1]:.0f} remaining")
print()
print("Counterintuitive result: MODERATE harvest yields MORE total timber")
print("than aggressive harvest, because the forest stays productive longer.")`,
      challenge: 'Add a "reforestation" scenario: harvest 5% but plant 20 seedlings per harvested tree. Assume 10% seedling survival to maturity (80 years later). How does the forest recover?',
      successHint: 'Sustainable forestry is applied ecology and economics. The math shows that moderation yields more timber over time than greed. This is the fundamental lesson of renewable resource management — and it applies to fisheries, water, and every other shared resource.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Wood Science & Material Strength</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for wood science simulations. Click to start.</p>
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