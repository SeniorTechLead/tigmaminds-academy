import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function PaperUmbrellaLevel2() {
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
      title: 'Cellulose chemistry — the molecular basis of paper',
      concept: `Cellulose is the most abundant organic polymer on Earth — plants produce ~180 billion tonnes annually. Its chemical formula is (C₆H₁₀O₅)n, where n can be 10,000+ glucose units linked in a chain.

Why cellulose makes great paper:
- **Hydrogen bonding**: OH groups on cellulose chains form hydrogen bonds with adjacent chains. When paper dries, these bonds lock fibers together — no glue needed.
- **Fiber morphology**: each cellulose fiber is hollow (lumen), with a layered cell wall. This gives excellent strength-to-weight ratio.
- **Hydroxyl groups**: the -OH groups also make cellulose hydrophilic — it absorbs water readily. This is why paper gets weak when wet.

Cellulose nanocrystals (CNCs):
Modern research breaks cellulose into nanocrystals 5-20nm wide. These have:
- Tensile strength of ~7.5 GPa (stronger than steel!)
- Can be used as reinforcement in composites
- Biodegradable and renewable
- Transparent when arranged in thin films

The paper umbrella's strength comes from the same molecular bonds that hold trees upright — just rearranged into a flat sheet.`,
      analogy: 'Cellulose molecules are like sticky spaghetti. Individual strands (chains) are weak, but when bundled together and dried, the sticky points (hydrogen bonds) lock them into a rigid mat. Adding water re-wets the spaghetti, breaking the bonds and making the mat floppy again. Waterproofing is like coating the spaghetti in oil so water cannot reach the sticky points.',
      storyConnection: 'The paper umbrella\'s strength came from cellulose hydrogen bonds — the same bonds that hold all paper together. The umbrella maker exploited molecular chemistry without knowing the molecules. Tung oil coating worked because it blocked water from reaching those hydrogen bonds.',
      checkQuestion: 'Cotton is nearly pure cellulose. Paper is made from cellulose. Why is cotton fabric flexible while paper is rigid?',
      checkAnswer: 'Fiber arrangement. In cotton fabric, fibers are woven — they can slide over each other at crossing points, allowing the fabric to drape and fold. In paper, fibers are randomly matted and bonded at every contact point — they cannot move relative to each other. Same molecule, different architecture. This is why you can fold paper into an origami crane (static folds) but cannot make it drape like cloth.',
      codeIntro: 'Model hydrogen bonding between cellulose fibers and its effect on paper strength.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hydrogen bond model for paper strength
# Strength ∝ number of H-bonds between fibers
# Number of bonds depends on: fiber contact area, hydroxyl density, drying conditions

def h_bond_strength(contact_area, oh_density, moisture):
    """Model paper strength from hydrogen bonding."""
    # Bonds available = contact_area × oh_density
    available_bonds = contact_area * oh_density
    # Moisture breaks bonds: effective bonds = available × (1 - moisture)
    effective_bonds = available_bonds * (1 - moisture)**2
    # Strength proportional to bond count
    return effective_bonds * 0.01  # scale to reasonable MPa

# Moisture content effect
moisture = np.linspace(0, 0.5, 100)
strengths_moisture = [h_bond_strength(100, 5, m) for m in moisture]

# Fiber contact area effect (controlled by beating/pressing)
contact_areas = np.linspace(10, 200, 100)
strengths_contact = [h_bond_strength(ca, 5, 0.05) for ca in contact_areas]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Moisture effect
ax1.set_facecolor('#111827')
ax1.plot(moisture * 100, strengths_moisture, color='#3b82f6', linewidth=2)
ax1.fill_between(moisture * 100, 0, strengths_moisture, alpha=0.1, color='#3b82f6')
ax1.set_xlabel('Moisture content (%)', color='white')
ax1.set_ylabel('Paper strength (relative)', color='white')
ax1.set_title('Water Destroys Hydrogen Bonds', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.annotate('Dry paper\\n(maximum strength)', xy=(5, strengths_moisture[10]),
            xytext=(20, strengths_moisture[10]*0.9), color='#22c55e', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#22c55e'))
ax1.annotate('Wet paper\\n(very weak)', xy=(40, strengths_moisture[80]),
            xytext=(30, strengths_moisture[40]*0.5), color='#ef4444', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#ef4444'))

# Contact area effect
ax2.set_facecolor('#111827')
ax2.plot(contact_areas, strengths_contact, color='#22c55e', linewidth=2)
ax2.fill_between(contact_areas, 0, strengths_contact, alpha=0.1, color='#22c55e')
ax2.set_xlabel('Fiber contact area (relative units)', color='white')
ax2.set_ylabel('Paper strength (relative)', color='white')
ax2.set_title('More Fiber Contact = Stronger Paper', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.annotate('Light beating\\n(fewer bonds)', xy=(30, strengths_contact[10]),
            xytext=(50, strengths_contact[40]), color='#f59e0b', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax2.annotate('Heavy beating\\n(many bonds)', xy=(180, strengths_contact[85]),
            xytext=(140, strengths_contact[70]), color='#22c55e', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#22c55e'))

plt.tight_layout()
plt.show()

print("Hydrogen bonds in paper:")
print("  Dry paper: ~1 bond per 0.5nm² of contact → very strong")
print("  Wet paper: water competes for H-bond sites → very weak")
print("  Bond energy: ~20 kJ/mol (individually weak, collectively strong)")
print()
print("Key insight: paper strength is EMERGENT —")
print("billions of weak bonds create a strong material.")
print("Water breaks these bonds individually, weakening the whole.")`,
      challenge: 'If you could replace hydrogen bonds with covalent bonds (using a chemical cross-linker), paper would be waterproof AND strong. What would be the trade-off? (Hint: think about recyclability.)',
      successHint: 'Hydrogen bonding is one of the most important forces in chemistry — it holds paper together, gives water its unusual properties, and maintains the shape of DNA and proteins. Understanding it at the molecular level explains why paper is strong, why it fails in water, and how to engineer solutions.',
    },
    {
      title: 'Polymer coatings — modern waterproofing chemistry',
      concept: `Traditional tung oil works by **polymerization** — the oil molecules cross-link when exposed to air, forming a tough, waterproof network. Modern waterproofing uses the same principle with engineered polymers.

Key waterproofing polymers:
- **Silicones** (polydimethylsiloxane): flexible, water-repellent, UV-stable. Used on outdoor fabrics.
- **Fluoropolymers** (PTFE/Teflon): extremely low surface energy → superb water/oil repellency. Environmental concerns (PFAS forever chemicals).
- **Polyurethane**: tough, flexible film. Used on most modern rain gear.
- **Wax emulsions**: natural, biodegradable. Used on cardboard and food packaging.
- **Alkyl ketene dimer (AKD)**: added during papermaking to make internal fibers hydrophobic.

Coating effectiveness depends on:
- **Thickness**: thicker coating = better barrier, but adds weight and reduces flexibility
- **Uniformity**: gaps in coating = weak points where water enters
- **Adhesion**: coating must stick to paper surface (surface treatment may be needed)
- **Durability**: must survive folding, UV exposure, and mechanical wear

The environmental challenge: many effective waterproofing chemicals (PFAS, fluoropolymers) are persistent in the environment — "forever chemicals." Finding biodegradable alternatives that match their performance is an active research area.`,
      analogy: 'Polymer coatings are like painting a fence. A thin coat (one layer) has gaps where wood shows through (water gets in). Multiple thick coats create a solid barrier. But too much paint makes the fence heavy and inflexible. The ideal coating is thin enough to be light, thick enough to be waterproof, and flexible enough to not crack.',
      storyConnection: 'The evolution from tung oil to modern polymers mirrors the umbrella\'s own evolution — from handcrafted paper to engineered composites. Each generation of waterproofing technology improved performance, but also raised new questions about cost, sustainability, and environmental impact.',
      checkQuestion: 'PFAS (per- and polyfluoroalkyl substances) are called "forever chemicals" because they do not break down in the environment. Why are they so persistent?',
      checkAnswer: 'The carbon-fluorine bond is one of the strongest in organic chemistry (bond energy ~485 kJ/mol vs ~345 for C-H). No natural enzyme or environmental process can break C-F bonds efficiently. These molecules resist biodegradation, UV breakdown, heat, and chemical attack. This is why they are excellent at waterproofing (nothing can break the coating) but also why they accumulate in soil, water, and living organisms indefinitely. The same property that makes them useful makes them dangerous.',
      codeIntro: 'Model water vapor transmission through different coating materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Water vapor transmission rate (WVTR) model
# WVTR depends on coating material, thickness, and temperature

def wvtr(permeability, thickness, delta_rh=0.5, temperature=25):
    """Water vapor transmission rate in g/m²/day."""
    # Simplified: WVTR = P × ΔRH / L × temp_factor
    temp_factor = np.exp(0.03 * (temperature - 25))
    return permeability * delta_rh / thickness * temp_factor * 100

# Coating materials (permeability in relative units)
coatings = {
    'No coating': {'perm': 50, 'color': '#854d0e'},
    'Tung oil (traditional)': {'perm': 5, 'color': '#f59e0b'},
    'Wax coating': {'perm': 3, 'color': '#22c55e'},
    'Polyurethane': {'perm': 1.5, 'color': '#3b82f6'},
    'PTFE (Teflon)': {'perm': 0.3, 'color': '#a855f7'},
    'Silicone': {'perm': 8, 'color': '#ef4444'},  # Breathable!
}

thicknesses = np.linspace(0.01, 0.5, 100)  # mm

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# WVTR vs thickness
ax1.set_facecolor('#111827')
for name, props in coatings.items():
    rates = [wvtr(props['perm'], t) for t in thicknesses]
    ax1.plot(thicknesses * 1000, rates, color=props['color'], linewidth=2, label=name)

ax1.set_xlabel('Coating thickness (μm)', color='white')
ax1.set_ylabel('WVTR (g/m²/day)', color='white')
ax1.set_title('Water Vapor Transmission Rate', color='white', fontsize=12)
ax1.set_yscale('log')
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=7)
ax1.tick_params(colors='gray')
ax1.axhline(10, color='gray', linestyle=':', alpha=0.3)
ax1.text(300, 12, 'Comfortable for clothing', color='gray', fontsize=8)

# Performance comparison
ax2.set_facecolor('#111827')
names = list(coatings.keys())
perms = [coatings[n]['perm'] for n in names]
colors_bar = [coatings[n]['color'] for n in names]

# Multi-criteria comparison
criteria = ['Waterproofing', 'Breathability', 'Durability', 'Eco-friendliness', 'Cost']
data = {
    'No coating': [0, 10, 2, 10, 10],
    'Tung oil (traditional)': [6, 3, 5, 9, 8],
    'Wax coating': [7, 2, 4, 8, 7],
    'Polyurethane': [9, 3, 8, 5, 6],
    'PTFE (Teflon)': [10, 1, 9, 1, 3],
    'Silicone': [7, 8, 7, 6, 5],
}

# Stacked comparison for key coatings
selected = ['Tung oil (traditional)', 'Polyurethane', 'Silicone']
x = np.arange(len(criteria))
width = 0.25
sel_colors = ['#f59e0b', '#3b82f6', '#ef4444']

for i, (name, color) in enumerate(zip(selected, sel_colors)):
    ax2.bar(x + i*width, data[name], width, label=name, color=color, alpha=0.8)

ax2.set_xticks(x + width)
ax2.set_xticklabels(criteria, color='white', fontsize=8)
ax2.set_ylabel('Score (0-10)', color='white')
ax2.set_title('Coating Trade-offs', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Coating selection depends on application:")
print("  Paper umbrella → tung oil (traditional, effective, eco-friendly)")
print("  Rain jacket → polyurethane or silicone (durable, flexible)")
print("  Industrial → PTFE (maximum protection, environmental cost)")
print()
print("The ideal coating doesn't exist — every choice is a trade-off")
print("between performance, cost, and environmental impact.")`,
      challenge: 'Research bio-based waterproof coatings (e.g., shellac, chitosan, or carnauba wax). How do they compare to synthetic polymers? Could they make the paper umbrella commercially viable again?',
      successHint: 'Coating science is where chemistry meets engineering. The right coating transforms a material\'s properties entirely — turning absorbent paper into a waterproof shield. The challenge of the 21st century is finding coatings that work as well as PFAS without lasting forever in the environment.',
    },
    {
      title: 'Origami engineering — paper folding as structural design',
      concept: `A paper umbrella opens and closes through a folding mechanism — essentially **origami** (paper folding) applied to engineering. Origami principles are now used in:

- **Space engineering**: solar panels that fold flat for launch and unfold in orbit (Miura fold)
- **Medical devices**: stents that fold small for insertion, expand inside arteries
- **Architecture**: deployable shelters, retractable roofs
- **Robotics**: origami robots that self-fold from flat sheets

Key origami principles:
- **Rigid foldability**: the panels between folds stay flat (important for solar panels)
- **Degree of freedom**: a single-DOF mechanism can be opened with one motion (like an umbrella)
- **Flat foldability**: can the structure collapse to a flat state? (important for storage)
- **Bistability**: does the structure lock in open and closed positions?

The **Miura fold** is the most famous engineering origami: a tessellation of parallelograms that collapses to a compact flat state and deploys with a single pull. It was invented for space solar panels and is now used in maps, shelters, and even fashion.

Mathematical origami uses the **Kawasaki theorem**: at any vertex, alternating angles must sum to 180° for the fold to lie flat.`,
      analogy: 'Origami engineering is like flat-pack furniture (IKEA). The product is designed to be flat for shipping (storage/launch) and then assembled into a 3D structure at the destination (deployment). Origami takes this further — the transformation from flat to 3D is built into the geometry itself, requiring no assembly, just unfolding.',
      storyConnection: 'The paper umbrella of Sualkuchi was an origami structure — flat paper folded into a 3D canopy through a single opening motion. The ribs guided the fold pattern, ensuring the paper deployed correctly every time. This is the same principle that deploys solar panels in space — geometry ensuring reliable transformation.',
      checkQuestion: 'A sheet of paper folded in half n times would be 2ⁿ layers thick. If paper is 0.1mm thick, how thick would it be after 42 folds?',
      checkAnswer: '2⁴² × 0.1mm = 4.4 × 10¹¹ mm = 440,000 km. That is beyond the distance from Earth to the Moon (384,400 km). This is the power of exponential growth — and why it is physically impossible to fold paper more than about 7-12 times (the paper becomes too thick relative to its remaining area). Britney Gallivan proved the theoretical maximum for a single fold direction in 2002.',
      codeIntro: 'Simulate the Miura fold — a single-DOF origami mechanism used in space engineering.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Miura fold simulation
# The fold pattern creates a tessellation that deploys with one degree of freedom

def miura_fold(nx, ny, a, b, gamma, fold_angle):
    """Generate Miura fold vertex positions.
    nx, ny: grid size
    a, b: parallelogram dimensions
    gamma: acute angle of parallelogram
    fold_angle: 0 = flat (deployed), pi = fully folded
    """
    vertices = []
    theta = fold_angle
    sin_g = np.sin(gamma)
    cos_g = np.cos(gamma)

    # Fold kinematics
    if theta < 0.01:
        w = a
        h = b * sin_g
        z = 0
    else:
        xi = np.arctan(np.tan(gamma) * np.cos(theta/2))
        w = a * np.cos(theta/2) / np.cos(xi)
        h = b * np.sin(xi)
        z_unit = b * np.cos(xi)

    for j in range(ny + 1):
        for i in range(nx + 1):
            if theta < 0.01:
                x = i * a + (j % 2) * a * cos_g
                y = j * b * sin_g
                z_val = 0
            else:
                x = i * w + (j % 2) * w * 0.3
                y = j * h
                z_val = (j % 2) * z_unit * 0.3 + (i % 2) * z_unit * 0.2
            vertices.append([x, y, z_val])

    return np.array(vertices)

fig, axes = plt.subplots(1, 4, figsize=(16, 4))
fig.patch.set_facecolor('#1f2937')

fold_angles = [0, 0.5, 1.5, 2.8]
titles = ['Deployed (flat)', 'Partially folded', 'More folded', 'Fully compact']

for ax, angle, title in zip(axes, fold_angles, titles):
    ax.set_facecolor('#111827')
    verts = miura_fold(4, 4, 1.0, 1.0, np.radians(70), angle)

    # Plot grid connections
    nx, ny = 5, 5  # vertices per side
    for j in range(ny):
        for i in range(nx - 1):
            idx1 = j * nx + i
            idx2 = j * nx + i + 1
            if idx1 < len(verts) and idx2 < len(verts):
                ax.plot([verts[idx1, 0], verts[idx2, 0]],
                       [verts[idx1, 1], verts[idx2, 1]],
                       color='#22c55e', linewidth=1)

    for j in range(ny - 1):
        for i in range(nx):
            idx1 = j * nx + i
            idx2 = (j + 1) * nx + i
            if idx1 < len(verts) and idx2 < len(verts):
                ax.plot([verts[idx1, 0], verts[idx2, 0]],
                       [verts[idx1, 1], verts[idx2, 1]],
                       color='#3b82f6', linewidth=1)

    ax.scatter(verts[:, 0], verts[:, 1], c='#f59e0b', s=10, zorder=5)
    ax.set_title(title, color='white', fontsize=10)
    ax.set_aspect('equal')
    ax.tick_params(colors='gray')

plt.suptitle('Miura Fold: From Flat to Compact (1 degree of freedom)',
            color='white', fontsize=13, y=1.05)
plt.tight_layout()
plt.show()

# Compaction ratio
print("Miura fold compaction:")
print("  Deployed area: 100% (full solar panel)")
print("  Partially folded: ~60% height, ~70% width")
print("  Fully folded: ~20% of deployed dimensions")
print()
print("Applications:")
print("  - Space: JAXA solar sail (IKAROS, 2010)")
print("  - Maps: folds flat, opens with one pull")
print("  - Shelters: deployable emergency structures")
print("  - Medical: foldable stents, surgical tools")
print()
print("The paper umbrella is an ancient origami mechanism —")
print("it folds flat for storage and deploys with one motion.")`,
      challenge: 'The Kawasaki theorem states that at any fold vertex, alternating angles must sum to 180°. Can you verify this for a simple 4-fold vertex where angles are 60°, 120°, 60°, 120°?',
      successHint: 'Origami engineering is one of the fastest-growing fields in mechanical design. From NASA solar panels to medical stents, the principles of paper folding are solving 21st-century engineering problems. The paper umbrella of Sualkuchi was ahead of its time.',
    },
    {
      title: 'Life cycle analysis — environmental impact of an umbrella',
      concept: `Which is more environmentally friendly: a paper umbrella that lasts one season, or a plastic umbrella that lasts five years but ends up in a landfill? **Life Cycle Analysis (LCA)** answers this by tracking environmental impact from cradle to grave.

LCA stages:
1. **Raw materials**: growing bamboo/trees for paper vs. mining petroleum for plastic
2. **Manufacturing**: energy, water, and chemicals used in production
3. **Transportation**: shipping materials and finished products
4. **Use phase**: maintenance, repair, durability
5. **End of life**: biodegradation (paper) vs. landfill/recycling (plastic)

Paper umbrella LCA:
- Raw materials: bamboo (fast-growing, renewable), local plant fibers
- Manufacturing: low energy (handmade), tung oil (natural)
- Transport: local (minimal)
- Use: 1-2 seasons
- End of life: fully biodegradable in months

Plastic umbrella LCA:
- Raw materials: petroleum (non-renewable), steel (mining), nylon (chemical synthesis)
- Manufacturing: high energy (injection molding, metal working)
- Transport: typically shipped from China (high carbon)
- Use: 3-5 years (but often discarded after 1-2 uses!)
- End of life: steel recyclable, nylon/plastic → landfill (500+ years)

The surprising finding: cheap plastic umbrellas that break quickly may have HIGHER lifetime environmental impact per use than traditional paper umbrellas.`,
      analogy: 'LCA is like comparing the total cost of ownership for a car — not just the purchase price, but fuel, maintenance, insurance, and depreciation. A cheap car with terrible fuel economy may cost more over 10 years than an expensive efficient one. Similarly, a "cheap" plastic umbrella may cost the planet more than an "expensive" paper one.',
      storyConnection: 'The paper umbrella of Sualkuchi was inherently sustainable — local materials, low-energy production, biodegradable end-of-life. Modern engineering is circling back to these principles after decades of disposable plastic products. The old way was not primitive; it was ahead of its time.',
      checkQuestion: 'An estimated 1.1 billion umbrellas are discarded annually worldwide. Most are not recyclable (mixed materials: steel, plastic, nylon). What is the total waste?',
      checkAnswer: 'At approximately 0.4 kg per umbrella: 1.1 billion × 0.4 kg = 440 million kg = 440,000 tonnes of waste annually. Most goes to landfill. The nylon canopy takes 30-40 years to degrade; the plastic handle takes 500+ years. If these were paper umbrellas with bamboo frames, they would biodegrade in 6-12 months. This is a massive argument for sustainable umbrella design.',
      codeIntro: 'Perform a simplified life cycle analysis comparing paper and plastic umbrellas.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Life Cycle Analysis: Paper vs Plastic umbrella
# Impact categories: CO2, water use, waste, toxicity

categories = ['CO₂\\n(kg)', 'Water\\n(liters)', 'Solid waste\\n(kg)', 'Toxic\\nchemicals\\n(g)', 'Biodeg.\\ntime (years)']

# Per umbrella impacts
paper_umbrella = {
    'CO2': 0.5,       # kg CO2
    'water': 20,      # liters
    'waste': 0.3,     # kg at end of life (biodegrades)
    'toxic': 5,       # grams of chemicals
    'biodegrade': 0.5, # years to fully degrade
    'uses': 50,       # number of uses before replacement
}

plastic_umbrella = {
    'CO2': 2.5,       # kg CO2 (petroleum + manufacturing + transport)
    'water': 80,      # liters
    'waste': 0.4,     # kg at end of life (landfill)
    'toxic': 50,      # grams of chemicals
    'biodegrade': 500, # years to degrade (never, really)
    'uses': 200,      # number of uses before breaking
}

cheap_plastic = {
    'CO2': 1.8,       # slightly less (thinner materials)
    'water': 60,
    'waste': 0.35,
    'toxic': 40,
    'biodegrade': 500,
    'uses': 20,       # breaks quickly!
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5.5))
fig.patch.set_facecolor('#1f2937')

# Per umbrella comparison
ax1.set_facecolor('#111827')
x = np.arange(5)
width = 0.25

values_paper = [paper_umbrella['CO2'], paper_umbrella['water']/10,
                paper_umbrella['waste'], paper_umbrella['toxic']/10, paper_umbrella['biodegrade']]
values_plastic = [plastic_umbrella['CO2'], plastic_umbrella['water']/10,
                  plastic_umbrella['waste'], plastic_umbrella['toxic']/10, 5]  # cap biodegrade for visibility
values_cheap = [cheap_plastic['CO2'], cheap_plastic['water']/10,
                cheap_plastic['waste'], cheap_plastic['toxic']/10, 5]

ax1.bar(x - width, values_paper, width, label='Paper (Sualkuchi)', color='#22c55e', alpha=0.8)
ax1.bar(x, values_plastic, width, label='Quality plastic', color='#3b82f6', alpha=0.8)
ax1.bar(x + width, values_cheap, width, label='Cheap plastic', color='#ef4444', alpha=0.8)

ax1.set_xticks(x)
ax1.set_xticklabels(categories, color='white', fontsize=8)
ax1.set_ylabel('Impact (various units, scaled)', color='white')
ax1.set_title('Environmental Impact Per Umbrella', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Per USE comparison (normalizing by number of uses)
ax2.set_facecolor('#111827')

per_use_paper = paper_umbrella['CO2'] / paper_umbrella['uses']
per_use_plastic = plastic_umbrella['CO2'] / plastic_umbrella['uses']
per_use_cheap = cheap_plastic['CO2'] / cheap_plastic['uses']

# Over 1000 uses
uses = np.arange(0, 1001)
cumulative_paper = np.ceil(uses / paper_umbrella['uses']) * paper_umbrella['CO2']
cumulative_plastic = np.ceil(uses / plastic_umbrella['uses']) * plastic_umbrella['CO2']
cumulative_cheap = np.ceil(uses / cheap_plastic['uses']) * cheap_plastic['CO2']

ax2.plot(uses, cumulative_paper, color='#22c55e', linewidth=2, label='Paper')
ax2.plot(uses, cumulative_plastic, color='#3b82f6', linewidth=2, label='Quality plastic')
ax2.plot(uses, cumulative_cheap, color='#ef4444', linewidth=2, label='Cheap plastic')

ax2.set_xlabel('Total uses', color='white')
ax2.set_ylabel('Cumulative CO₂ (kg)', color='white')
ax2.set_title('Lifetime CO₂: Which Is Really Greener?', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Per-use CO₂ emissions:")
print(f"  Paper umbrella: {per_use_paper*1000:.0f} g CO₂/use")
print(f"  Quality plastic: {per_use_plastic*1000:.0f} g CO₂/use")
print(f"  Cheap plastic: {per_use_cheap*1000:.0f} g CO₂/use")
print()
print("Surprise: cheap plastic is the WORST option per use!")
print("Quality plastic beats paper on CO₂/use IF it lasts 200 uses.")
print("But paper wins on waste, toxicity, and biodegradability.")`,
      challenge: 'Add a fourth option: a high-quality repairable umbrella (CO₂: 5 kg to make, but lasts 2000 uses and is fully repairable). How does its per-use impact compare?',
      successHint: 'Life cycle analysis reveals hidden trade-offs that intuition misses. The "cheap" option is often the most expensive environmentally. Sustainable design means thinking about the entire lifecycle — not just the purchase price or the immediate use.',
    },
    {
      title: 'Smart materials — the future of adaptive waterproofing',
      concept: `What if an umbrella could change its properties based on conditions? **Smart materials** respond to environmental stimuli:

- **Shape memory alloys** (SMA): metal that "remembers" a shape and returns to it when heated. Umbrella ribs that auto-repair after inversion.
- **Electrochromic materials**: change color/opacity with applied voltage. An umbrella that darkens in bright sun and clears in overcast sky.
- **Self-healing polymers**: coatings that repair scratches automatically using microcapsules of healing agent.
- **Hydrogel coatings**: swell with water to seal micro-cracks, improving waterproofing when it rains (the time you need it most).
- **Piezoelectric materials**: generate electricity from mechanical stress. An umbrella that charges your phone from raindrop impacts.

The piezoelectric rain umbrella is real: each raindrop hitting a piezoelectric film generates ~0.001 mW. With ~1000 drops/second in moderate rain, that is ~1 mW — enough to slowly charge a small device. Proof-of-concept prototypes exist.

The paper umbrella of the future might be: biodegradable paper with self-healing nanocoating, shape-memory bamboo ribs, and piezoelectric film generating power from rain. Every component exists; integration is the challenge.`,
      analogy: 'Smart materials are like living tissue. Your skin self-heals (self-healing polymer), changes color in response to temperature (electrochromic), and generates nerve signals from touch (piezoelectric). Smart materials are engineering\'s attempt to make inanimate objects behave like living systems — responsive, adaptive, and self-maintaining.',
      storyConnection: 'The paper umbrella of Sualkuchi was a static design — paper and oil, unchanging. The future umbrella will be dynamic — adapting to conditions, healing damage, and generating energy. From passive artifact to active system, the umbrella\'s evolution mirrors the broader arc of technology: from tools that we use to tools that respond to us.',
      checkQuestion: 'A piezoelectric umbrella generates power from raindrops. In a city with 150 rainy days per year, each producing 1 mW for 2 hours, how much energy is generated annually?',
      checkAnswer: '150 days × 2 hours × 1 mW = 300 mWh = 0.3 Wh per year. That is tiny — about 1/30th of what it takes to charge a smartphone once. But the principle matters more than the current numbers. Better piezoelectric materials, larger surfaces, and heavier rain could increase this by 100×. And if millions of umbrellas each generated small amounts, the distributed energy adds up. Every technology starts small.',
      codeIntro: 'Model energy harvesting from raindrops using piezoelectric materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Piezoelectric rain energy harvesting model

# Raindrop parameters
drop_mass = 5e-5  # kg (typical raindrop, 4mm diameter)
drop_velocity = 7  # m/s (terminal velocity)
drop_energy = 0.5 * drop_mass * drop_velocity**2  # kinetic energy (J)

# Piezoelectric conversion efficiency
piezo_efficiency = 0.10  # 10% conversion (optimistic for PVDF film)

# Energy per drop
energy_per_drop = drop_energy * piezo_efficiency  # Joules

# Rain intensity (drops per m² per second)
rain_rates = {
    'Light rain (2mm/h)': 20,
    'Moderate (10mm/h)': 100,
    'Heavy (25mm/h)': 250,
    'Monsoon (50mm/h)': 500,
}

umbrella_area = 0.8  # m² (typical umbrella)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5.5))
fig.patch.set_facecolor('#1f2937')

# Power vs rain intensity
ax1.set_facecolor('#111827')
intensities = np.linspace(1, 100, 200)  # mm/h
drops_per_sec = intensities * 10  # approximate drops/m²/s

power_mw = drops_per_sec * umbrella_area * energy_per_drop * 1000  # milliwatts

ax1.plot(intensities, power_mw, color='#3b82f6', linewidth=2)
ax1.fill_between(intensities, 0, power_mw, alpha=0.1, color='#3b82f6')

# Mark rain types
for name, rate in rain_rates.items():
    power = rate * umbrella_area * energy_per_drop * 1000
    ax1.plot(rate / 10, power, 'o', color='#f59e0b', markersize=8)
    ax1.annotate(f'{name}\\n{power:.2f} mW', xy=(rate/10, power),
                xytext=(rate/10 + 5, power + 0.2), color='#f59e0b', fontsize=8)

ax1.set_xlabel('Rain intensity (mm/h)', color='white')
ax1.set_ylabel('Power output (mW)', color='white')
ax1.set_title('Piezoelectric Rain Energy Harvesting', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Annual energy by location
ax2.set_facecolor('#111827')
locations = {
    'Cherrapunji\\n(11,777mm/yr)': {'rain_hours': 2000, 'avg_rate': 25},
    'Guwahati\\n(1,722mm/yr)': {'rain_hours': 800, 'avg_rate': 15},
    'Mumbai\\n(2,166mm/yr)': {'rain_hours': 900, 'avg_rate': 18},
    'London\\n(602mm/yr)': {'rain_hours': 1500, 'avg_rate': 5},
    'Sahara\\n(25mm/yr)': {'rain_hours': 20, 'avg_rate': 5},
}

loc_names = list(locations.keys())
annual_wh = []
for name, data in locations.items():
    drops_s = data['avg_rate'] * 10
    power_w = drops_s * umbrella_area * energy_per_drop
    annual = power_w * data['rain_hours']  # Wh
    annual_wh.append(annual * 1000)  # mWh

colors_loc = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']
bars = ax2.barh(loc_names, annual_wh, color=colors_loc, alpha=0.8)
ax2.set_xlabel('Annual energy (mWh)', color='white')
ax2.set_title('Annual Piezoelectric Energy by Location', color='white', fontsize=12)
ax2.tick_params(colors='gray')

for bar, val in zip(bars, annual_wh):
    ax2.text(bar.get_width() + 5, bar.get_y() + bar.get_height()/2,
            f'{val:.0f} mWh', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print(f"Energy per raindrop: {energy_per_drop*1e6:.1f} μJ")
print(f"  Drop mass: {drop_mass*1000:.1f} mg")
print(f"  Drop velocity: {drop_velocity} m/s")
print(f"  Kinetic energy: {drop_energy*1e6:.1f} μJ")
print(f"  Piezo conversion: {piezo_efficiency*100:.0f}%")
print()
print("In Cherrapunji (wettest place on Earth):")
print(f"  Annual energy: {annual_wh[0]:.0f} mWh")
print(f"  That could charge a smartwatch {annual_wh[0]/200:.0f} times per year")`,
      challenge: 'If 10 million people in Assam each had a piezoelectric umbrella, what would be the total annual energy output? Compare this to the output of a small solar panel.',
      successHint: 'From paper and oil to piezoelectric nanofilms — the umbrella has evolved from passive shelter to active energy harvester. The paper umbrella of Sualkuchi solved the essential problem elegantly with available materials. The smart umbrella of tomorrow solves the same problem while adding new capabilities. Both are engineering at its best.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build on Level 1 engineering foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced materials engineering. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
