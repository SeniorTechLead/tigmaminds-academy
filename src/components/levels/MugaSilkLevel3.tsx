import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MugaSilkLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Silk fibroin protein structure — the beta-sheet architecture',
      concept: `Silk is not just a fiber — it is a **protein crystal**. The protein that makes silk strong is called **fibroin**, and its secret lies in how its amino acid chain folds.

Fibroin arranges itself into **beta-sheets (β-sheets)**: flat, zigzag structures where adjacent protein chains line up side by side and form hydrogen bonds between them. Think of it as molecular corrugated cardboard — each chain is a ridge, and hydrogen bonds are the glue holding ridges together.

Key structural facts:
- **Anti-parallel β-sheets**: adjacent chains run in opposite directions, maximizing hydrogen bond strength
- **Crystalline regions**: tightly packed β-sheets create rigid, ordered domains (~60% of Muga silk)
- **Amorphous regions**: looser, random-coil sections between crystalline domains (~40%)
- **Nanofibrils**: crystalline + amorphous regions alternate along each fibril, creating a natural composite

The ratio of crystalline to amorphous regions determines the silk's mechanical properties. More crystalline = stiffer and stronger. More amorphous = stretchier and softer.`,
      analogy: 'Imagine a rope made of alternating sections of steel cable and rubber bands. The steel sections (crystalline β-sheets) give it enormous strength — you cannot snap them. The rubber sections (amorphous regions) give it flexibility — it can stretch without breaking. Silk fibroin is nature\'s engineered composite, alternating rigid and flexible at the molecular scale.',
      storyConnection: 'The golden Muga silk that Assamese weavers prize is made of fibroin proteins folded into these β-sheet crystals. The particular amino acid sequence of Antheraea assamensis fibroin creates an unusually high proportion of crystalline domains, giving Muga silk its legendary durability — garments that last generations.',
      checkQuestion: 'If you could increase the percentage of crystalline β-sheet regions in a silk fiber from 60% to 90%, what would happen to its mechanical properties? What trade-off would you expect?',
      checkAnswer: 'The fiber would become significantly stiffer and stronger in tension (higher Young\'s modulus, higher ultimate tensile strength). However, it would also become more brittle — less able to stretch before breaking (lower strain at failure). You trade elasticity for rigidity. Real spider dragline silk is about 40% crystalline, optimizing for both strength and stretch.',
      codeIntro: 'Model the β-sheet structure of silk fibroin and visualize how crystalline fraction affects the stress-strain curve.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Model silk fibroin as alternating crystalline (beta-sheet) and amorphous regions
# Each region has different mechanical properties

def silk_stress_strain(strain, crystalline_fraction):
    """
    Simple composite model for silk fiber:
    - Crystalline regions: high stiffness (E_c = 20 GPa), low extensibility (max 2%)
    - Amorphous regions: low stiffness (E_a = 1 GPa), high extensibility (max 40%)
    - Rule of mixtures for composite behavior
    """
    f_c = crystalline_fraction
    f_a = 1.0 - f_c

    E_crystalline = 20.0   # GPa - beta-sheet stiffness
    E_amorphous = 1.0      # GPa - random coil stiffness
    strain_max_c = 0.02    # 2% max strain for crystalline
    strain_max_a = 0.40    # 40% max strain for amorphous

    stress = np.zeros_like(strain)
    for i, eps in enumerate(strain):
        # Crystalline contribution (linear until failure)
        if eps < strain_max_c:
            sigma_c = E_crystalline * eps
        else:
            # Gradual degradation after crystalline failure
            sigma_c = E_crystalline * strain_max_c * np.exp(-(eps - strain_max_c) / 0.05)

        # Amorphous contribution (nonlinear elastomer-like)
        if eps < strain_max_a:
            sigma_a = E_amorphous * eps * (1 + 2 * eps)  # strain stiffening
        else:
            sigma_a = 0  # amorphous failure

        stress[i] = f_c * sigma_c + f_a * sigma_a

    return stress

strain = np.linspace(0, 0.45, 500)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Silk Fibroin: Beta-Sheet Structure & Mechanical Properties',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Stress-strain curves for different crystalline fractions
ax = axes[0, 0]
fractions = [0.3, 0.5, 0.6, 0.75, 0.9]
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']
for f_c, color in zip(fractions, colors):
    stress = silk_stress_strain(strain, f_c)
    ax.plot(strain * 100, stress, color=color, linewidth=2,
            label=f'{f_c:.0%} crystalline')
ax.set_xlabel('Strain (%)', color='white')
ax.set_ylabel('Stress (GPa)', color='white')
ax.set_title('Stress-Strain: Effect of Crystallinity', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Stiffness vs crystalline fraction
ax = axes[0, 1]
fracs = np.linspace(0.1, 0.95, 50)
stiffness = []
for f in fracs:
    s = silk_stress_strain(np.array([0.005]), f)
    stiffness.append(s[0] / 0.005)  # Young's modulus at small strain
toughness = []
for f in fracs:
    s = silk_stress_strain(strain, f)
    toughness.append(np.trapz(s, strain))

ax.plot(fracs * 100, stiffness, color='#ef4444', linewidth=2.5, label='Stiffness (GPa)')
ax.set_xlabel('Crystalline Fraction (%)', color='white')
ax.set_ylabel("Young's Modulus (GPa)", color='white')
ax.set_title('Stiffness vs Crystallinity', color='white', fontsize=11)
ax2 = ax.twinx()
ax2.plot(fracs * 100, toughness, color='#22c55e', linewidth=2.5, label='Toughness')
ax2.set_ylabel('Toughness (MJ/m³)', color='white')
ax2.tick_params(colors='gray')
ax.legend(loc='upper left', fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.legend(loc='upper right', fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Beta-sheet structure visualization
ax = axes[1, 0]
# Draw zigzag chains (simplified beta-sheet view)
n_chains = 6
chain_length = 20
for c in range(n_chains):
    y_base = c * 1.2
    x = np.linspace(0, chain_length, 100)
    y = y_base + 0.3 * np.sin(2 * np.pi * x / 1.5) * (1 if c % 2 == 0 else -1)
    color = '#f59e0b' if c % 2 == 0 else '#fbbf24'
    ax.plot(x, y, color=color, linewidth=2)
    # Hydrogen bonds between adjacent chains
    if c > 0:
        for xi in np.linspace(1, chain_length - 1, 12):
            y_top = y_base + 0.3 * np.sin(2 * np.pi * xi / 1.5) * (1 if c % 2 == 0 else -1)
            y_bot = (c - 1) * 1.2 + 0.3 * np.sin(2 * np.pi * xi / 1.5) * (1 if (c-1) % 2 == 0 else -1)
            ax.plot([xi, xi], [y_bot, y_top], color='#60a5fa', linewidth=0.8,
                    linestyle=':', alpha=0.6)
ax.set_xlim(-1, chain_length + 1)
ax.set_title('Beta-Sheet Structure (side view)', color='white', fontsize=11)
ax.set_xlabel('Chain direction →', color='white')
ax.text(chain_length / 2, -1.5, 'Blue dotted: hydrogen bonds between chains',
        color='#60a5fa', fontsize=9, ha='center')
ax.set_yticks([])

# Plot 4: Crystalline vs amorphous regions along fiber
ax = axes[1, 1]
fiber_length = 100
x = np.arange(fiber_length)
# Alternating crystalline (1) and amorphous (0) regions
regions = np.zeros(fiber_length)
crystal_starts = [0, 15, 30, 48, 65, 82]
crystal_lengths = [10, 8, 12, 10, 11, 9]
for start, length in zip(crystal_starts, crystal_lengths):
    regions[start:start + length] = 1

ax.fill_between(x, 0, 1, where=regions == 1, color='#f59e0b', alpha=0.8, label='Crystalline (β-sheet)')
ax.fill_between(x, 0, 1, where=regions == 0, color='#22c55e', alpha=0.5, label='Amorphous (random coil)')
ax.set_xlabel('Position along fiber (nm)', color='white')
ax.set_title('Crystalline/Amorphous Alternation', color='white', fontsize=11)
ax.set_yticks([])
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Silk Fibroin Beta-Sheet Structure")
print("=" * 50)
print(f"Muga silk (Antheraea assamensis):")
print(f"  Crystalline fraction: ~60%")
print(f"  Beta-sheet type: anti-parallel")
print(f"  Dominant amino acids: Ala (43%), Gly (27%)")
print()
print("Mechanical properties comparison:")
print(f"  {'Material':<20} {'Stiffness (GPa)':<18} {'Strain at break':<18}")
print(f"  {'-'*56}")
for name, f_c, max_s in [('Spider dragline', 0.40, '30%'),
                          ('Muga silk', 0.60, '26%'),
                          ('Bombyx mori', 0.55, '18%'),
                          ('Kevlar', 0.95, '3%')]:
    E = silk_stress_strain(np.array([0.005]), f_c)[0] / 0.005
    print(f"  {name:<20} {E:<18.1f} {max_s:<18}")
print()
print("Key insight: crystalline fraction controls the strength-elasticity trade-off.")
print("Muga silk's 60% crystallinity is a sweet spot — strong yet flexible.")`,
      challenge: 'Modify the model to add a third phase: oriented amorphous regions (intermediate stiffness, E=5 GPa). Real silk has these "interphase" regions between crystals and amorphous domains. How does a three-phase model change the predicted stress-strain curve?',
      successHint: 'The β-sheet is one of nature\'s most elegant engineering solutions. By stacking simple hydrogen-bonded chains into crystalline sheets, biology creates a material that rivals steel in tensile strength per unit weight. Understanding this structure is the foundation of biomaterial engineering.',
    },
    {
      title: 'Amino acid composition — why Muga silk is golden',
      concept: `Every protein is a chain of **amino acids** — 20 different molecular building blocks linked together. The specific sequence and proportion of amino acids determines everything about a protein: its shape, its function, and even its color.

Muga silk fibroin has a distinctive amino acid composition:
- **Alanine (Ala)**: ~43% — small, hydrophobic, forms tight β-sheet crystals
- **Glycine (Gly)**: ~27% — the smallest amino acid, allows tight chain packing
- **Serine (Ser)**: ~12% — has a hydroxyl group (-OH), can form extra hydrogen bonds
- **Tyrosine (Tyr)**: ~5% — contains an aromatic ring that absorbs UV and reflects golden wavelengths

The **golden color** of Muga silk comes from:
1. **Tyrosine residues**: their aromatic rings absorb blue-violet light (380-450 nm) and reflect yellow-gold (570-590 nm)
2. **Carotenoid pigments**: the silkworm diet includes compounds that bind to the fibroin
3. **Light scattering**: the nanostructure of Muga fibroin creates structural coloring effects

Other silk species have different compositions and different colors — Bombyx mori silk is white because it has less tyrosine and different pigment binding.`,
      analogy: 'Think of amino acids as LEGO bricks of 20 different shapes and colors. A protein is a specific arrangement of these bricks. If you change the proportion of yellow bricks (tyrosine), the overall creation changes color. Muga silk\'s recipe calls for more "golden bricks" than any other silk.',
      storyConnection: 'The story asks why Muga silk is golden — the answer is molecular. The Antheraea assamensis silkworm produces a fibroin protein uniquely rich in tyrosine, whose aromatic rings create the golden hue. It is literally chemistry that you can wear.',
      checkQuestion: 'If you genetically engineered the Muga silkworm to replace all tyrosine residues with alanine, what would happen to the silk\'s color and mechanical properties?',
      checkAnswer: 'The silk would lose its golden color and become closer to white, since alanine has no aromatic ring to absorb blue light. Mechanically, replacing the bulky tyrosine (molecular weight 181) with tiny alanine (89) would increase the crystalline packing density, making the silk stiffer but potentially more brittle. You would gain strength but lose the signature golden beauty.',
      codeIntro: 'Analyze amino acid compositions of different silk types and model how composition affects light absorption (color).',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Amino acid compositions of different silk fibroins (approximate %)
silk_types = {
    'Muga (A. assamensis)': {
        'Ala': 43, 'Gly': 27, 'Ser': 12, 'Tyr': 5.2,
        'Val': 3, 'Asp': 2.5, 'Thr': 1.8, 'Other': 5.5
    },
    'Mulberry (B. mori)': {
        'Gly': 44, 'Ala': 30, 'Ser': 12, 'Tyr': 5.0,
        'Val': 2, 'Asp': 1.5, 'Thr': 1.0, 'Other': 4.5
    },
    'Eri (S. ricini)': {
        'Ala': 48, 'Gly': 32, 'Ser': 8, 'Tyr': 3.5,
        'Val': 2.5, 'Asp': 1.8, 'Thr': 1.2, 'Other': 3.0
    },
    'Spider (N. clavipes)': {
        'Gly': 42, 'Ala': 25, 'Pro': 10, 'Tyr': 2.0,
        'Gln': 8, 'Ser': 5, 'Leu': 3, 'Other': 5.0
    },
}

amino_acids = ['Ala', 'Gly', 'Ser', 'Tyr', 'Val', 'Asp', 'Pro', 'Gln', 'Thr', 'Leu', 'Other']

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Amino Acid Composition & the Golden Color of Muga Silk',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Stacked bar chart of compositions
ax = axes[0, 0]
silk_names = list(silk_types.keys())
bar_colors = ['#f59e0b', '#22c55e', '#3b82f6', '#ef4444', '#a855f7',
              '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1', '#64748b']
bottoms = np.zeros(len(silk_names))
for j, aa in enumerate(amino_acids):
    values = []
    for name in silk_names:
        values.append(silk_types[name].get(aa, 0))
    ax.barh(range(len(silk_names)), values, left=bottoms,
            color=bar_colors[j % len(bar_colors)], label=aa, edgecolor='none', height=0.6)
    bottoms += values
ax.set_yticks(range(len(silk_names)))
ax.set_yticklabels(silk_names, color='white', fontsize=9)
ax.set_xlabel('Composition (%)', color='white')
ax.set_title('Amino Acid Composition by Silk Type', color='white', fontsize=11)
ax.legend(fontsize=7, ncol=3, facecolor='#1f2937', edgecolor='gray', labelcolor='white',
          loc='lower right')

# Plot 2: Tyrosine absorption spectrum and silk color
ax = axes[0, 1]
wavelengths = np.linspace(300, 700, 500)

def tyrosine_absorption(wl, concentration):
    """Model tyrosine absorption: absorbs UV/blue, transmits gold."""
    # Peak absorption at ~275 nm (UV) with tail into blue
    uv_peak = concentration * 1.5 * np.exp(-((wl - 275) ** 2) / (2 * 30 ** 2))
    blue_tail = concentration * 0.3 * np.exp(-((wl - 400) ** 2) / (2 * 50 ** 2))
    return uv_peak + blue_tail

for name, comp, color, ls in [
    ('Muga (5.2% Tyr)', 5.2, '#f59e0b', '-'),
    ('Mulberry (5.0% Tyr)', 5.0, '#e5e7eb', '--'),
    ('Eri (3.5% Tyr)', 3.5, '#d4d4d8', ':'),
    ('Spider (2.0% Tyr)', 2.0, '#94a3b8', '-.')
]:
    absorption = tyrosine_absorption(wavelengths, comp)
    ax.plot(wavelengths, absorption, color=color, linewidth=2, linestyle=ls, label=name)

# Color the visible spectrum background
for wl_start, wl_end, c in [(380, 450, '#4338ca'), (450, 495, '#2563eb'),
                              (495, 570, '#16a34a'), (570, 590, '#f59e0b'),
                              (590, 620, '#ea580c'), (620, 700, '#dc2626')]:
    ax.axvspan(wl_start, wl_end, alpha=0.08, color=c)

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Absorption (a.u.)', color='white')
ax.set_title('Tyrosine Absorption → Golden Reflection', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.annotate('Blue absorbed\
→ gold reflected', xy=(420, 1.2), fontsize=9,
            color='#f59e0b', fontweight='bold')

# Plot 3: Hydrophobicity profile
ax = axes[1, 0]
hydrophobicity = {'Ala': 1.8, 'Gly': -0.4, 'Ser': -0.8, 'Tyr': -1.3,
                  'Val': 4.2, 'Asp': -3.5, 'Pro': -1.6, 'Gln': -3.5,
                  'Thr': -0.7, 'Leu': 3.8, 'Other': 0}

for i, name in enumerate(silk_names):
    avg_hydro = sum(silk_types[name].get(aa, 0) * hydrophobicity.get(aa, 0) / 100
                    for aa in amino_acids)
    color = ['#f59e0b', '#e5e7eb', '#d4d4d8', '#94a3b8'][i]
    ax.bar(i, avg_hydro, color=color, edgecolor='none', width=0.6)
    ax.text(i, avg_hydro + 0.02, f'{avg_hydro:.2f}', ha='center', color='white', fontsize=10)
ax.set_xticks(range(len(silk_names)))
ax.set_xticklabels([n.split('(')[0].strip() for n in silk_names], color='white', fontsize=9)
ax.set_ylabel('Avg Hydrophobicity Index', color='white')
ax.set_title('Average Hydrophobicity by Silk Type', color='white', fontsize=11)
ax.axhline(0, color='gray', linewidth=0.8, linestyle='--')

# Plot 4: Molecular weight distribution
ax = axes[1, 1]
mw = {'Ala': 89, 'Gly': 75, 'Ser': 105, 'Tyr': 181,
      'Val': 117, 'Asp': 133, 'Pro': 115, 'Gln': 146,
      'Thr': 119, 'Leu': 131, 'Other': 120}

for i, name in enumerate(silk_names):
    avg_mw = sum(silk_types[name].get(aa, 0) * mw.get(aa, 120) / 100
                 for aa in amino_acids)
    color = ['#f59e0b', '#e5e7eb', '#d4d4d8', '#94a3b8'][i]
    ax.bar(i, avg_mw, color=color, edgecolor='none', width=0.6)
    ax.text(i, avg_mw + 1, f'{avg_mw:.1f}', ha='center', color='white', fontsize=10)
ax.set_xticks(range(len(silk_names)))
ax.set_xticklabels([n.split('(')[0].strip() for n in silk_names], color='white', fontsize=9)
ax.set_ylabel('Avg Residue MW (Da)', color='white')
ax.set_title('Average Molecular Weight per Residue', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Why Muga Silk is Golden — Molecular Explanation")
print("=" * 55)
print()
print("1. TYROSINE (5.2% of residues):")
print("   - Aromatic ring absorbs UV/blue light (275-430 nm)")
print("   - Reflects yellow-gold wavelengths (570-590 nm)")
print("   - Higher tyrosine = more golden color")
print()
print("2. ALANINE (43% — highest of any silk):")
print("   - Small, hydrophobic → tight β-sheet packing")
print("   - Creates dense crystalline domains")
print("   - Gives Muga its exceptional durability")
print()
print("3. LOW GLYCINE (27% vs 44% in Bombyx):")
print("   - More alanine, less glycine = stiffer chains")
print("   - Muga is less flexible but more durable than mulberry silk")
print()
print("The golden color is NOT a dye — it is built into the protein itself.")`,
      challenge: 'Add a carotenoid pigment absorption model (peak around 450 nm). Carotenoids from the silkworm\'s diet contribute to the golden color alongside tyrosine. Model the combined absorption spectrum and predict the resulting reflected color.',
      successHint: 'The color of a biological material is determined by its molecular composition — which wavelengths are absorbed and which are reflected. Muga silk is golden because its amino acid composition and bound pigments specifically absorb blue light and reflect gold. Chemistry you can see and touch.',
    },
    {
      title: 'Material science of silk — tensile strength and elasticity',
      concept: `Engineers measure materials by their **mechanical properties** — how they respond to forces. Silk is remarkable because it outperforms most synthetic materials in key metrics:

**Tensile strength** (σ): Maximum stress before breaking. Muga silk: ~500 MPa. For comparison, structural steel: ~400 MPa. Silk is stronger than steel per unit weight.

**Young's modulus** (E): Stiffness — resistance to deformation. Muga silk: ~7 GPa. Higher = stiffer.

**Strain at break** (ε): How much it stretches before failure. Muga silk: ~26%. Kevlar: ~3%. Silk stretches 8x more than Kevlar.

**Toughness**: Energy absorbed before breaking = area under the stress-strain curve. This is where silk truly shines — it is one of the toughest materials known, combining strength AND stretch.

**Specific strength** (strength/density): Because silk is lightweight (density ~1.3 g/cm³), its strength-to-weight ratio exceeds steel (density 7.8 g/cm³) by a factor of ~6.

These properties emerge from the molecular architecture: crystalline β-sheets provide strength, amorphous regions provide extensibility, and the hierarchical structure from molecules to fibers distributes stress efficiently.`,
      analogy: 'Compare a ceramic plate and a rubber ball. The plate is stiff (high modulus) but shatters easily (low toughness). The ball is stretchy (high strain) but weak (low strength). Silk is the rare material that is both strong AND stretchy — like a plate that can bounce. This combination makes it one of nature\'s best engineering materials.',
      storyConnection: 'Muga silk garments in Assam last for decades — some are passed down through generations. This extraordinary durability is not magic or tradition alone; it is material science. The fibroin protein creates a composite material with a toughness that synthetic fibers struggle to match.',
      checkQuestion: 'A spider dragline silk has a tensile strength of 1.1 GPa and strain at break of 30%. Kevlar has 3.6 GPa tensile strength but only 3% strain at break. Which material is tougher, and why?',
      checkAnswer: 'Spider silk is tougher. Toughness is the area under the stress-strain curve (energy per unit volume). Spider silk: roughly 0.5 * 1.1 * 0.30 = 0.165 GJ/m³. Kevlar: roughly 0.5 * 3.6 * 0.03 = 0.054 GJ/m³. Spider silk absorbs 3x more energy before breaking, even though Kevlar has 3x higher peak stress. Stretch matters enormously for toughness.',
      codeIntro: 'Compare the mechanical properties of Muga silk against other natural and synthetic materials using real engineering data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Material properties database
# Format: (tensile_strength_MPa, youngs_modulus_GPa, strain_break_%, density_g_cm3)
materials = {
    'Muga silk':       (500, 7.0, 26, 1.3),
    'Bombyx silk':     (600, 10.0, 18, 1.35),
    'Spider dragline': (1100, 12.0, 30, 1.3),
    'Kevlar':          (3600, 130.0, 3, 1.44),
    'Nylon':           (70, 3.0, 40, 1.15),
    'Steel':           (400, 200.0, 2, 7.8),
    'Carbon fiber':    (4000, 230.0, 2, 1.75),
    'Rubber':          (15, 0.01, 600, 0.92),
    'Bone':            (130, 20.0, 3, 1.9),
    'Tendon':          (100, 1.5, 10, 1.1),
}

names = list(materials.keys())
strength = np.array([m[0] for m in materials.values()])
modulus = np.array([m[1] for m in materials.values()])
strain_break = np.array([m[2] for m in materials.values()])
density = np.array([m[3] for m in materials.values()])

# Derived properties
toughness = 0.5 * strength * strain_break / 100  # MJ/m³ (approximate)
specific_strength = strength / density  # MPa / (g/cm³)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Mechanical Properties: Muga Silk vs Engineering Materials',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Ashby plot — strength vs modulus
ax = axes[0, 0]
colors_mat = ['#f59e0b', '#fbbf24', '#a855f7', '#ef4444', '#3b82f6',
              '#64748b', '#22c55e', '#ec4899', '#f97316', '#06b6d4']
for i, (name, color) in enumerate(zip(names, colors_mat)):
    size = 200 if 'Muga' in name else 100
    ax.scatter(modulus[i], strength[i], s=size, color=color, edgecolor='white',
              linewidth=1, zorder=5)
    ax.annotate(name, (modulus[i], strength[i]), textcoords='offset points',
                xytext=(8, 5), color=color, fontsize=7, fontweight='bold')
ax.set_xscale('log')
ax.set_yscale('log')
ax.set_xlabel('Young\'s Modulus (GPa)', color='white')
ax.set_ylabel('Tensile Strength (MPa)', color='white')
ax.set_title('Ashby Plot: Strength vs Stiffness', color='white', fontsize=11)

# Plot 2: Toughness comparison
ax = axes[0, 1]
sorted_idx = np.argsort(toughness)[::-1]
bars = ax.barh(range(len(names)), toughness[sorted_idx], color=[colors_mat[i] for i in sorted_idx],
               edgecolor='none', height=0.6)
ax.set_yticks(range(len(names)))
ax.set_yticklabels([names[i] for i in sorted_idx], color='white', fontsize=9)
ax.set_xlabel('Toughness (MJ/m³)', color='white')
ax.set_title('Toughness = Strength × Stretch', color='white', fontsize=11)
# Highlight Muga
muga_rank = list(sorted_idx).index(0)
bars[muga_rank].set_edgecolor('#f59e0b')
bars[muga_rank].set_linewidth(2)

# Plot 3: Specific strength (strength per unit weight)
ax = axes[1, 0]
sorted_idx2 = np.argsort(specific_strength)[::-1]
ax.barh(range(len(names)), specific_strength[sorted_idx2],
        color=[colors_mat[i] for i in sorted_idx2], edgecolor='none', height=0.6)
ax.set_yticks(range(len(names)))
ax.set_yticklabels([names[i] for i in sorted_idx2], color='white', fontsize=9)
ax.set_xlabel('Specific Strength (MPa·cm³/g)', color='white')
ax.set_title('Strength-to-Weight Ratio', color='white', fontsize=11)

# Plot 4: Stress-strain curves for silks
ax = axes[1, 1]
def model_curve(E, sigma_max, eps_max):
    eps = np.linspace(0, eps_max / 100, 300)
    # Nonlinear curve that peaks at sigma_max
    sigma = sigma_max * (1 - np.exp(-E * eps / sigma_max * 1000)) * (1 - (eps / (eps_max/100))**2)
    sigma = np.maximum(sigma, 0)
    return eps * 100, sigma

for name, color in [('Muga silk', '#f59e0b'), ('Bombyx silk', '#fbbf24'),
                     ('Spider dragline', '#a855f7'), ('Kevlar', '#ef4444'),
                     ('Nylon', '#3b82f6')]:
    s, E, eb, _ = materials[name]
    x, y = model_curve(E, s, eb)
    ax.plot(x, y, color=color, linewidth=2.5, label=name)
ax.set_xlabel('Strain (%)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Stress-Strain Curves', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Mechanical Properties Comparison")
print("=" * 70)
print(f"{'Material':<18} {'Strength':>10} {'Modulus':>10} {'Strain':>8} {'Toughness':>10} {'Sp.Str':>8}")
print(f"{'':18} {'(MPa)':>10} {'(GPa)':>10} {'(%)':>8} {'(MJ/m³)':>10} {'(kNm/g)':>8}")
print("-" * 70)
for i, name in enumerate(names):
    print(f"{name:<18} {strength[i]:>10.0f} {modulus[i]:>10.1f} {strain_break[i]:>8.0f} "
          f"{toughness[i]:>10.1f} {specific_strength[i]:>8.0f}")
print()
print("Key finding: Muga silk combines moderate strength with high extensibility,")
print("giving it excellent toughness — it absorbs more energy than steel or Kevlar.")
print("Per unit weight, silk is 6x stronger than steel.")`,
      challenge: 'Add a "design space" overlay to the Ashby plot showing the ideal region for body armor (high specific strength + high toughness). Which existing materials fall in this region? Can you see why spider silk is being researched for bulletproof vests?',
      successHint: 'Material selection in engineering is about matching properties to requirements. Silk excels not in any single property but in its combination — strength, stretch, toughness, and low weight together. This is why material scientists study silk as a model for synthetic biomaterials.',
    },
    {
      title: 'Sericulture biology — the silkworm life cycle',
      concept: `**Sericulture** is the cultivation of silkworms for silk production. For Muga silk, the species is **Antheraea assamensis**, a semi-domesticated moth found only in the Brahmaputra Valley of Assam.

The life cycle has four stages:

1. **Egg** (~10 days): Females lay 150-300 eggs on som (Machilus bombycina) or soalu (Litsea polyantha) leaves — the only host plants. Temperature and humidity must be precisely controlled.

2. **Larva/Caterpillar** (~30-35 days, 5 instars): The larva eats voraciously, growing through 5 molting stages (instars). It consumes ~50g of leaves to produce ~0.5g of silk. Feed conversion efficiency: ~1%.

3. **Pupa/Cocoon** (~15-20 days): The 5th-instar larva spins a cocoon from a single continuous silk filament 300-500 meters long. The golden fibroin protein is secreted from modified salivary glands (spinneret), coated with sericin (silk glue).

4. **Adult moth** (~5-7 days): In Muga sericulture, moths are allowed to emerge and mate (unlike Bombyx mori, where pupae are killed). This is because Muga silkworms are semi-wild and cannot be fully domesticated.

Assam produces ~150 tonnes of Muga silk annually — roughly 95% of the world supply. The silk is harvested after the moth emerges, so each cocoon's filament is broken into shorter "spun silk" fibers.`,
      analogy: 'Sericulture is like farming, but your livestock are caterpillars and your crop is protein fiber. The farmer must manage host plants (the caterpillar\'s food), control parasites and diseases, time the harvest to the cocoon stage, and manage breeding for the next generation. It is agriculture at the intersection of entomology, botany, and textile engineering.',
      storyConnection: 'The story of Muga silk is inseparable from Assam itself. Antheraea assamensis feeds only on som and soalu trees native to the Brahmaputra Valley. The warm, humid climate is essential for the silkworm\'s development. This geographic specificity — a silkworm that thrives nowhere else — makes Muga silk a product of its place, like champagne or Darjeeling tea.',
      checkQuestion: 'Muga sericulture allows the moth to emerge from the cocoon, while Bombyx mori sericulture kills the pupa before emergence. How does this affect the silk fiber quality and why?',
      checkAnswer: 'When the moth emerges, it secretes an enzyme (cocoonase) that dissolves a hole in the cocoon, breaking the continuous 300-500m filament into short fragments. This makes Muga silk "spun silk" (short fibers twisted together) rather than "reeled silk" (one continuous filament). Spun silk has lower tensile strength and more texture. Bombyx pupae are killed by steam so the filament stays intact for reeling. The trade-off: Muga moth survival enables sustainable breeding, but the silk is less uniform.',
      codeIntro: 'Model the Muga silkworm life cycle, including growth rates, feed consumption, and silk production efficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Muga silkworm (Antheraea assamensis) life cycle model

# Larval growth through 5 instars
instar_data = {
    # (duration_days, initial_weight_g, final_weight_g, food_consumed_g)
    1: (5, 0.003, 0.03, 0.2),
    2: (5, 0.03, 0.15, 0.8),
    3: (6, 0.15, 0.8, 3.5),
    4: (7, 0.8, 3.5, 12.0),
    5: (8, 3.5, 12.0, 35.0),
}

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Muga Silkworm (Antheraea assamensis) Life Cycle Biology',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Larval growth curve
ax = axes[0, 0]
days = []
weights = []
current_day = 0
for instar in range(1, 6):
    dur, w_i, w_f, _ = instar_data[instar]
    t = np.linspace(0, dur, 50)
    # Sigmoidal growth within each instar
    w = w_i + (w_f - w_i) / (1 + np.exp(-1.5 * (t - dur/2)))
    days.extend(current_day + t)
    weights.extend(w)
    # Mark molt
    ax.axvline(current_day + dur, color='gray', linewidth=0.5, linestyle='--')
    ax.text(current_day + dur/2, max(weights) * 0.9, f'I-{instar}',
            color='white', fontsize=8, ha='center')
    current_day += dur

ax.plot(days, weights, color='#22c55e', linewidth=2.5)
ax.fill_between(days, 0, weights, color='#22c55e', alpha=0.15)
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Weight (g)', color='white')
ax.set_title('Larval Growth (5 Instars)', color='white', fontsize=11)

# Plot 2: Feed consumption per instar
ax = axes[0, 1]
instars = list(range(1, 6))
food = [instar_data[i][3] for i in instars]
ax.bar(instars, food, color=['#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d'],
       edgecolor='none', width=0.6)
ax.set_xlabel('Instar', color='white')
ax.set_ylabel('Food consumed (g)', color='white')
ax.set_title('Leaf Consumption per Instar', color='white', fontsize=11)
for i, f in zip(instars, food):
    ax.text(i, f + 0.5, f'{f}g', ha='center', color='white', fontsize=10)
total_food = sum(food)
ax.text(3, max(food) * 0.7, f'Total: {total_food:.1f}g leaves\
→ ~0.5g silk\
= {0.5/total_food*100:.1f}% efficiency',
        color='#f59e0b', fontsize=9, ha='center',
        bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#f59e0b'))

# Plot 3: Full life cycle timeline
ax = axes[0, 2]
stages = ['Egg', 'Larva\
(5 instars)', 'Pupa\
(cocoon)', 'Adult\
moth']
durations = [10, 31, 18, 6]
colors_stage = ['#60a5fa', '#22c55e', '#f59e0b', '#a855f7']
starts = [0]
for d in durations[:-1]:
    starts.append(starts[-1] + d)
for i, (stage, dur, start, color) in enumerate(zip(stages, durations, starts, colors_stage)):
    ax.barh(0, dur, left=start, height=0.4, color=color, edgecolor='none')
    ax.text(start + dur/2, 0, f'{stage}\
{dur}d', ha='center', va='center',
            color='white', fontsize=8, fontweight='bold')
ax.set_xlim(-2, sum(durations) + 2)
ax.set_ylim(-0.5, 0.5)
ax.set_xlabel('Days', color='white')
ax.set_title('Complete Life Cycle (~65 days)', color='white', fontsize=11)
ax.set_yticks([])

# Plot 4: Cocoon filament analysis
ax = axes[1, 0]
# Single filament: 300-500m, ~1.5 denier
filament_lengths = np.random.normal(400, 50, 200)  # meters
ax.hist(filament_lengths, bins=25, color='#f59e0b', edgecolor='none', alpha=0.8)
ax.axvline(np.mean(filament_lengths), color='#ef4444', linewidth=2, linestyle='--',
           label=f'Mean: {np.mean(filament_lengths):.0f}m')
ax.set_xlabel('Filament length (m)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Cocoon Filament Length Distribution', color='white', fontsize=11)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Silk production economics
ax = axes[1, 1]
# Cocoons needed for different products
products = ['1 Mekhela\
Chadar', '1 Muga\
Shawl', '1 Muga\
Sari', '1 kg raw\
Muga silk']
cocoons_needed = [3000, 1500, 5000, 1000]
ax.bar(range(len(products)), cocoons_needed,
       color=['#f59e0b', '#fbbf24', '#d97706', '#b45309'], edgecolor='none', width=0.6)
ax.set_xticks(range(len(products)))
ax.set_xticklabels(products, color='white', fontsize=9)
ax.set_ylabel('Cocoons needed', color='white')
ax.set_title('Cocoons Required per Product', color='white', fontsize=11)
for i, n in enumerate(cocoons_needed):
    ax.text(i, n + 100, f'{n:,}', ha='center', color='white', fontsize=10)

# Plot 6: Environmental requirements
ax = axes[1, 2]
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
temp_assam = [17, 20, 24, 27, 28, 29, 29, 29, 28, 26, 22, 18]
humidity_assam = [75, 68, 60, 70, 78, 85, 88, 87, 85, 80, 75, 76]
optimal_temp = (24, 28)  # Optimal for silkworm

ax.plot(range(12), temp_assam, color='#ef4444', linewidth=2.5, marker='o',
        markersize=5, label='Temperature (°C)')
ax.axhspan(optimal_temp[0], optimal_temp[1], alpha=0.1, color='#22c55e',
           label=f'Optimal: {optimal_temp[0]}-{optimal_temp[1]}°C')
ax.set_xticks(range(12))
ax.set_xticklabels(months, color='white', fontsize=8)
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Assam Climate vs Silkworm Needs', color='white', fontsize=11)
ax2 = ax.twinx()
ax2.plot(range(12), humidity_assam, color='#3b82f6', linewidth=2, linestyle='--',
         marker='s', markersize=4, label='Humidity (%)')
ax2.set_ylabel('Humidity (%)', color='white')
ax2.tick_params(colors='gray')
ax.legend(loc='upper left', fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.legend(loc='upper right', fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Mark rearing seasons
for month_range, label in [((2, 5), 'Spring\
rearing'), ((8, 11), 'Autumn\
rearing')]:
    mid = sum(month_range) / 2
    ax.annotate(label, xy=(mid, optimal_temp[1]),
                color='#22c55e', fontsize=7, ha='center', fontweight='bold')

plt.tight_layout()
plt.show()

print("Muga Silkworm Life Cycle Summary")
print("=" * 50)
print(f"Species: Antheraea assamensis (semi-domesticated)")
print(f"Host plants: Som (Machilus bombycina), Soalu (Litsea polyantha)")
print(f"Geographic range: Brahmaputra Valley, Assam (exclusively)")
print()
print(f"Life cycle: ~65 days total")
print(f"  Egg:   10 days | Larva: 31 days | Pupa: 18 days | Adult: 6 days")
print(f"  Feed efficiency: {0.5/51.5*100:.2f}% (51.5g leaves → 0.5g silk)")
print(f"  Filament length: 300-500 m per cocoon")
print()
print(f"Production (Assam, ~95% of world supply):")
print(f"  ~150 tonnes/year | ~3000 cocoons per Mekhela Chadar")
print(f"  Two rearing seasons: spring (Mar-May) and autumn (Sep-Nov)")`,
      challenge: 'Model the population dynamics of a Muga silkworm farm over 5 generations. Start with 100 female moths, each laying 200 eggs. Apply mortality rates: 30% egg mortality, 40% larval mortality (disease + predators), 10% pupal mortality. How many generations until the farm needs 10,000 cocoons per harvest?',
      successHint: 'Sericulture is applied ecology — managing a biological system for maximum fiber output while keeping the population sustainable. Every parameter (feed quality, temperature, disease control, harvest timing) affects the final silk yield. It is farming and engineering combined.',
    },
    {
      title: 'Biomaterial engineering — learning from silk',
      concept: `Engineers are obsessed with silk because it solves problems that synthetic materials cannot. **Biomaterial engineering** studies natural materials to either replicate them or learn design principles for new materials.

Silk's engineering lessons:

1. **Hierarchical structure**: Silk is organized across scales — amino acids → β-sheets → nanofibrils → microfibrils → fibers → yarn. Each level adds new properties. This hierarchical design principle is now used in carbon fiber composites and 3D-printed materials.

2. **Self-assembly**: The silkworm doesn\'t build silk atom by atom. It secretes a protein solution that spontaneously folds into β-sheets when drawn through the spinneret. This **spinning-induced crystallization** is far more energy-efficient than any factory process — silk forms at room temperature and atmospheric pressure, while Kevlar requires concentrated sulfuric acid and 500°C.

3. **Biocompatibility**: Silk fibroin is non-toxic, non-inflammatory, and biodegradable. This makes it ideal for medical applications:
   - Surgical sutures (used for centuries)
   - Tissue engineering scaffolds (grow new bone/cartilage on silk frameworks)
   - Drug delivery systems (silk nanoparticles release medicine slowly)
   - Optical devices (silk films for biosensors)

4. **Recombinant silk**: Genetic engineers have inserted silk genes into bacteria, yeast, goats, and even alfalfa plants to produce silk proteins at scale. Companies like Bolt Threads and Spiber are commercializing these approaches.`,
      analogy: 'Learning from silk is like reverse-engineering a Ferrari to understand Italian engineering — and then using those principles to design something even better. We study the β-sheet structure (the engine), the hierarchical organization (the chassis), and the self-assembly process (the manufacturing method) to create new materials with silk-like properties but tailored for specific applications.',
      storyConnection: 'The golden Muga silk of Assam is not just a textile — it is a bioengineering blueprint. Researchers worldwide study Antheraea assamensis fibroin to understand how nature creates materials that outperform our best synthetic alternatives. The story of Muga silk extends from an Assamese weaver\'s loom to the frontiers of materials science.',
      checkQuestion: 'Why can\'t we simply manufacture silk in a factory the way we make nylon, even though we know its molecular structure?',
      checkAnswer: 'Nylon is a simple repeating polymer that can be synthesized by mixing two chemicals. Silk fibroin is a massive protein (350,000+ Da) with a precise amino acid sequence that determines how it folds. We can synthesize the protein sequence using recombinant DNA technology, but the spinning process — drawing the protein solution through a narrow opening at just the right speed and pH — triggers the specific folding that creates β-sheets. We are still learning to replicate the silkworm\'s spinneret conditions. The biology is the factory.',
      codeIntro: 'Model the self-assembly process of silk fibroin and compare natural vs. synthetic manufacturing energy costs.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Model silk self-assembly: random coil → beta-sheet transition
# As shear force increases (during spinning), crystallinity increases

def crystallization_model(shear_rate, concentration, pH):
    """
    Model the spinning-induced crystallization of silk fibroin.
    Returns crystalline fraction (0-1).
    Factors: shear rate (drawing speed), concentration, pH
    """
    # Optimal pH for crystallization: ~4.5 (acidic)
    pH_factor = np.exp(-((pH - 4.5) ** 2) / 2)
    # Concentration effect: higher = more crystallization
    conc_factor = 1 - np.exp(-concentration / 15)
    # Shear-induced crystallization: sigmoidal response
    shear_factor = 1 / (1 + np.exp(-0.05 * (shear_rate - 50)))
    return 0.7 * shear_factor * conc_factor * pH_factor

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Biomaterial Engineering: Learning from Silk',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Shear-induced crystallization
ax = axes[0, 0]
shear_rates = np.linspace(0, 200, 300)
for pH, color in [(3.0, '#ef4444'), (4.5, '#22c55e'), (6.0, '#3b82f6'), (7.4, '#a855f7')]:
    crystal = crystallization_model(shear_rates, 20, pH)
    ax.plot(shear_rates, crystal * 100, color=color, linewidth=2, label=f'pH {pH}')
ax.set_xlabel('Shear rate (s⁻¹)', color='white')
ax.set_ylabel('Crystallinity (%)', color='white')
ax.set_title('Spinning-Induced Crystallization', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.annotate('Optimal: pH 4.5\
(like silkworm gland)', xy=(120, 60),
            color='#22c55e', fontsize=8, fontweight='bold')

# Plot 2: Energy cost comparison (manufacturing)
ax = axes[0, 1]
processes = ['Silkworm\
(natural)', 'Recombinant\
(bacteria)', 'Nylon\
(chemical)',
             'Kevlar\
(chemical)', 'Carbon\
fiber', 'Steel\
(smelting)']
energy_MJ_per_kg = [1, 50, 120, 250, 300, 25]
colors_proc = ['#22c55e', '#4ade80', '#3b82f6', '#ef4444', '#a855f7', '#64748b']
bars = ax.bar(range(len(processes)), energy_MJ_per_kg, color=colors_proc,
              edgecolor='none', width=0.6)
ax.set_xticks(range(len(processes)))
ax.set_xticklabels(processes, color='white', fontsize=8)
ax.set_ylabel('Energy (MJ/kg)', color='white')
ax.set_title('Manufacturing Energy per kg of Material', color='white', fontsize=11)
for i, e in enumerate(energy_MJ_per_kg):
    ax.text(i, e + 5, f'{e}', ha='center', color='white', fontsize=10)
ax.annotate('Nature: 1 MJ/kg\
(room temp, water-based)', xy=(0, 20),
            color='#22c55e', fontsize=8, fontweight='bold')

# Plot 3: Hierarchical structure levels
ax = axes[0, 2]
scales = ['Amino acids\
(0.1 nm)', 'β-sheets\
(1 nm)', 'Nanofibrils\
(10 nm)',
          'Microfibrils\
(100 nm)', 'Fibers\
(10 μm)', 'Yarn\
(100 μm)']
properties = ['Sequence', 'Crystallinity', 'Composite\
structure',
              'Fiber\
bundling', 'Twist &\
texture', 'Fabric\
properties']
y_pos = np.arange(len(scales))
ax.barh(y_pos, np.arange(1, len(scales)+1), color='#f59e0b', alpha=0.6, edgecolor='none', height=0.5)
for i, (scale, prop) in enumerate(zip(scales, properties)):
    ax.text(0.1, i, scale, va='center', color='white', fontsize=8, fontweight='bold')
    ax.text(i + 1.2, i, prop, va='center', color='#a855f7', fontsize=7)
ax.set_title('Hierarchical Structure of Silk', color='white', fontsize=11)
ax.set_xlabel('Scale level →', color='white')
ax.set_yticks([])

# Plot 4: Medical applications of silk biomaterials
ax = axes[1, 0]
applications = ['Sutures', 'Tissue\
scaffolds', 'Drug\
delivery', 'Biosensors', 'Bone\
repair']
trl = [9, 6, 5, 4, 3]  # Technology Readiness Level (1-9)
market_M = [500, 200, 150, 50, 80]  # Market size estimate ($ millions)
colors_app = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']
for i, (app, t, m, c) in enumerate(zip(applications, trl, market_M, colors_app)):
    ax.scatter(t, m, s=200, color=c, edgecolor='white', linewidth=1, zorder=5)
    ax.annotate(app, (t, m), textcoords='offset points', xytext=(10, 5),
                color=c, fontsize=8, fontweight='bold')
ax.set_xlabel('Technology Readiness Level (1-9)', color='white')
ax.set_ylabel('Market Size ($ millions)', color='white')
ax.set_title('Silk-Based Medical Applications', color='white', fontsize=11)

# Plot 5: Degradation rate comparison
ax = axes[1, 1]
months = np.arange(0, 25)
materials_deg = {
    'Silk suture': 0.92,     # fraction remaining per month
    'PLGA scaffold': 0.85,
    'Nylon suture': 0.99,
    'Collagen implant': 0.80,
}
for name, rate in materials_deg.items():
    remaining = rate ** months * 100
    ax.plot(months, remaining, linewidth=2, label=name)
ax.set_xlabel('Months', color='white')
ax.set_ylabel('Material remaining (%)', color='white')
ax.set_title('Biodegradation Rates', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 105)

# Plot 6: Recombinant silk production routes
ax = axes[1, 2]
routes = ['Bacteria\
(E. coli)', 'Yeast', 'Transgenic\
goats', 'Plants\
(alfalfa)', 'Cell-free\
synthesis']
yield_mg_L = [200, 500, 1000, 300, 50]  # mg per liter (or equivalent)
cost_per_g = [500, 200, 100, 300, 2000]  # $/g
ax.scatter(yield_mg_L, cost_per_g, s=[300, 300, 300, 300, 300],
           color=['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444'],
           edgecolor='white', linewidth=1, zorder=5)
for i, route in enumerate(routes):
    ax.annotate(route, (yield_mg_L[i], cost_per_g[i]),
                textcoords='offset points', xytext=(10, 5),
                color='white', fontsize=8)
ax.set_xlabel('Yield (mg/L)', color='white')
ax.set_ylabel('Cost ($/g)', color='white')
ax.set_title('Recombinant Silk Production', color='white', fontsize=11)
ax.set_yscale('log')

plt.tight_layout()
plt.show()

print("Biomaterial Engineering: Silk as Inspiration")
print("=" * 55)
print()
print("Why engineers study silk:")
print(f"  1. Self-assembly at room temperature (vs 500°C for Kevlar)")
print(f"  2. Energy cost: ~1 MJ/kg (vs 250 MJ/kg for Kevlar)")
print(f"  3. Biocompatible & biodegradable (medical implants)")
print(f"  4. Hierarchical design (6 structural levels)")
print()
print("Recombinant silk companies:")
print(f"  Bolt Threads (USA)  — spider silk proteins from yeast")
print(f"  Spiber (Japan)      — structural proteins from bacteria")
print(f"  AMSilk (Germany)    — medical-grade recombinant silk")
print()
print("The silkworm remains the most efficient silk factory ever built.")
print("Replicating its spinning process is the frontier of biomaterial engineering.")`,
      challenge: 'Model a spinning process: simulate drawing a 20% fibroin solution through a narrowing channel (diameter decreases from 1mm to 50μm over 10mm length). Calculate the shear rate at each point and predict the crystallinity profile along the channel. At what point does the solution transition from liquid to solid fiber?',
      successHint: 'Biomaterial engineering bridges biology and industry. The silkworm\'s spinning process — converting a water-based protein solution into a crystalline fiber at room temperature — is a manufacturing method that humanity has not yet matched. Every advance in understanding silk brings us closer to sustainable, high-performance materials.',
    },
    {
      title: 'Protein folding — from sequence to structure',
      concept: `Protein folding is one of the deepest problems in biology: how does a linear chain of amino acids spontaneously fold into a precise 3D shape? For silk fibroin, folding determines whether you get a strong fiber or a useless gel.

**Levinthal's paradox**: A 100-amino-acid protein has ~10^47 possible conformations. If it sampled one per picosecond, it would take longer than the age of the universe to find the right fold. Yet real proteins fold in milliseconds. How?

**The folding funnel**: Proteins don\'t search randomly. The energy landscape has a funnel shape — most random perturbations push the chain toward lower energy states, so the protein "rolls downhill" toward its native fold.

For silk fibroin specifically:
- **In solution** (inside the silkworm gland): fibroin is in a random coil / alpha-helix state, kept soluble by water and sericin protein
- **During spinning**: mechanical shear + pH change triggers a conformational switch from alpha-helix to beta-sheet
- **In fiber**: beta-sheets lock in, creating irreversible crystalline structure
- **Key residues**: Ala-Gly-Ala-Gly repeats are the beta-sheet-forming motifs

The 2024 Nobel Prize in Chemistry was awarded to Demis Hassabis and John Jumper (AlphaFold) for solving the computational protein folding problem using deep learning.`,
      analogy: 'Imagine crumpling a piece of paper into a ball. There are billions of possible crumpled shapes, but if the paper has pre-creased fold lines (like an origami pattern), it naturally collapses into one specific shape. Amino acid interactions create "fold lines" in the protein chain, guiding it toward one unique structure out of astronomical possibilities.',
      storyConnection: 'The transformation of liquid silk (inside the silkworm) into solid golden fiber (the cocoon) is a protein folding event. The fibroin protein changes shape from a soluble coil to an insoluble crystal — and this folding event is what creates the material we call Muga silk. The golden garment begins as a molecular origami inside a caterpillar.',
      checkQuestion: 'If AlphaFold can predict protein structure from sequence, why can\'t we just design any protein we want (including artificial silk)?',
      checkAnswer: 'AlphaFold solves the "forward" problem: given a sequence, predict the structure. The "inverse" problem — designing a sequence that folds into a desired structure and function — is much harder because many sequences can fold similarly, the relationship is not one-to-one, and we need to optimize for multiple properties simultaneously (folding, stability, function, manufacturability). Tools like RoseTTAFold and ProteinMPNN are making progress on inverse design, but we are still early. It is like the difference between reading a recipe and inventing a new dish.',
      codeIntro: 'Simulate a simplified protein folding energy landscape and visualize the alpha-helix to beta-sheet transition that creates silk fiber.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simplified protein folding energy landscape
# 2D representation: phi (x) and psi (y) torsion angles

phi = np.linspace(-180, 180, 200)
psi = np.linspace(-180, 180, 200)
PHI, PSI = np.meshgrid(phi, psi)

# Ramachandran-inspired energy landscape
# Minima at beta-sheet (-120, 120) and alpha-helix (-60, -50) regions
def folding_energy(phi, psi):
    # Beta-sheet basin
    E_beta = -3.0 * np.exp(-(((phi + 120)**2 + (psi - 120)**2) / (2 * 30**2)))
    # Alpha-helix basin
    E_alpha = -2.5 * np.exp(-(((phi + 60)**2 + (psi + 50)**2) / (2 * 25**2)))
    # Left-handed helix (less stable)
    E_left = -1.0 * np.exp(-(((phi - 60)**2 + (psi + 40)**2) / (2 * 20**2)))
    # Steric clashes (high energy regions)
    E_clash = 2.0 * np.exp(-(((phi)**2 + (psi)**2) / (2 * 40**2)))
    # Background
    E_bg = 0.5 * (np.sin(phi * np.pi / 180) ** 2 + np.cos(psi * np.pi / 180) ** 2)
    return E_beta + E_alpha + E_left + E_clash + E_bg

energy = folding_energy(PHI, PSI)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Protein Folding: From Random Coil to Beta-Sheet Silk Fiber',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Ramachandran energy landscape
ax = axes[0, 0]
im = ax.contourf(PHI, PSI, energy, levels=30, cmap='RdYlGn_r')
ax.contour(PHI, PSI, energy, levels=10, colors='white', linewidths=0.3, alpha=0.5)
ax.plot(-120, 120, 'o', color='#f59e0b', markersize=12, markeredgecolor='white',
        markeredgewidth=2, label='β-sheet')
ax.plot(-60, -50, 's', color='#a855f7', markersize=12, markeredgecolor='white',
        markeredgewidth=2, label='α-helix')
ax.set_xlabel('φ (phi) angle (°)', color='white')
ax.set_ylabel('ψ (psi) angle (°)', color='white')
ax.set_title('Ramachandran Energy Landscape', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Folding funnel (1D cross-section)
ax = axes[0, 1]
# Model folding as energy vs. folding coordinate (0=unfolded, 1=native)
q = np.linspace(0, 1, 300)
# Funnel with a kinetic trap
E_funnel = 5 * (1 - q) + 1.5 * np.exp(-((q - 0.3)**2) / 0.01) - 3 * np.exp(-((q - 1.0)**2) / 0.02)
E_funnel += 0.3 * np.sin(20 * q)  # roughness

ax.plot(q, E_funnel, color='#22c55e', linewidth=2.5)
ax.fill_between(q, E_funnel, max(E_funnel), alpha=0.1, color='#22c55e')
ax.annotate('Unfolded\
(random coil)', xy=(0.05, E_funnel[5]), fontsize=8,
            color='#ef4444', fontweight='bold')
ax.annotate('Kinetic trap\
(misfolded)', xy=(0.3, E_funnel[90]+0.3), fontsize=8,
            color='#f59e0b', fontweight='bold')
ax.annotate('Native fold\
(β-sheet)', xy=(0.95, E_funnel[-5]-0.5), fontsize=8,
            color='#22c55e', fontweight='bold')
ax.set_xlabel('Folding coordinate (0=unfolded, 1=native)', color='white')
ax.set_ylabel('Free energy', color='white')
ax.set_title('Folding Funnel', color='white', fontsize=11)

# Plot 3: Alpha-helix to beta-sheet transition (silk spinning)
ax = axes[0, 2]
shear = np.linspace(0, 100, 200)
alpha_frac = 0.6 * np.exp(-shear / 30) + 0.05
beta_frac = 0.6 * (1 - np.exp(-shear / 30)) + 0.05
coil_frac = 1 - alpha_frac - beta_frac

ax.fill_between(shear, 0, coil_frac, color='#64748b', alpha=0.7, label='Random coil')
ax.fill_between(shear, coil_frac, coil_frac + alpha_frac, color='#a855f7', alpha=0.7, label='α-helix')
ax.fill_between(shear, coil_frac + alpha_frac, 1, color='#f59e0b', alpha=0.7, label='β-sheet')
ax.set_xlabel('Shear rate (s⁻¹)', color='white')
ax.set_ylabel('Fraction', color='white')
ax.set_title('α→β Transition During Spinning', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 1)
ax.annotate('Liquid silk\
(in gland)', xy=(5, 0.5), fontsize=8, color='white')
ax.annotate('Solid fiber\
(in cocoon)', xy=(75, 0.5), fontsize=8, color='white')

# Plot 4: Levinthal's paradox visualization
ax = axes[1, 0]
n_residues = np.arange(10, 110, 10)
conformations = 3 ** n_residues  # ~3 rotamers per residue
time_random_s = conformations * 1e-12  # 1 picosecond per conformation
time_random_yr = time_random_s / (365.25 * 24 * 3600)
actual_time_s = np.full_like(n_residues, 1e-3, dtype=float)  # ~1 ms

ax.semilogy(n_residues, time_random_yr, color='#ef4444', linewidth=2.5,
            label='Random search', marker='o', markersize=5)
ax.semilogy(n_residues, actual_time_s / (365.25 * 24 * 3600), color='#22c55e',
            linewidth=2.5, label='Actual folding', marker='s', markersize=5)
ax.axhline(13.8e9, color='gray', linestyle='--', linewidth=1, label='Age of universe')
ax.set_xlabel('Number of amino acids', color='white')
ax.set_ylabel('Time to fold (years)', color='white')
ax.set_title("Levinthal's Paradox", color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Silk fibroin sequence motifs
ax = axes[1, 1]
# Show repeating Ala-Gly motif that forms beta-sheets
motif = 'GAGAGSGAAG' * 3  # Typical fibroin repeat
positions = np.arange(len(motif))
hydro_values = {'G': -0.4, 'A': 1.8, 'S': -0.8}
hydro = [hydro_values.get(aa, 0) for aa in motif]
colors_aa = ['#22c55e' if aa == 'G' else '#f59e0b' if aa == 'A' else '#3b82f6' for aa in motif]
ax.bar(positions, hydro, color=colors_aa, edgecolor='none', width=0.8)
ax.set_xticks(positions)
ax.set_xticklabels(list(motif), color='white', fontsize=7, fontfamily='monospace')
ax.set_ylabel('Hydrophobicity', color='white')
ax.set_title('Fibroin Repeat Motif: GAGAGS...', color='white', fontsize=11)
ax.axhline(0, color='gray', linewidth=0.8, linestyle='--')
# Legend
from matplotlib.patches import Patch
legend_elements = [Patch(facecolor='#22c55e', label='Gly'),
                   Patch(facecolor='#f59e0b', label='Ala'),
                   Patch(facecolor='#3b82f6', label='Ser')]
ax.legend(handles=legend_elements, fontsize=8, facecolor='#1f2937',
          edgecolor='gray', labelcolor='white')

# Plot 6: AlphaFold accuracy over time
ax = axes[1, 2]
years = [2000, 2006, 2010, 2014, 2016, 2018, 2020, 2022]
gdt_scores = [30, 40, 45, 50, 55, 60, 92, 95]  # GDT-TS score (0-100)
ax.plot(years, gdt_scores, color='#a855f7', linewidth=2.5, marker='o', markersize=8,
        markeredgecolor='white', markeredgewidth=1)
ax.fill_between(years, 0, gdt_scores, color='#a855f7', alpha=0.15)
ax.axhline(90, color='#22c55e', linestyle='--', linewidth=1.5,
           label='Experimental accuracy')
ax.annotate('AlphaFold2\
(2020)', xy=(2020, 92), xytext=(2015, 85),
            color='#f59e0b', fontsize=9, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Structure prediction accuracy (GDT)', color='white')
ax.set_title('Protein Folding: Solved by AI', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 100)

plt.tight_layout()
plt.show()

print("Protein Folding & Silk Formation")
print("=" * 50)
print()
print("Levinthal's Paradox:")
print(f"  100-residue protein: 3^100 = {3**100:.1e} conformations")
print(f"  Random search: ~10^35 years (universe is 1.4 × 10^10 years old)")
print(f"  Actual folding: ~1 millisecond")
print(f"  Solution: energy funnel guides folding downhill")
print()
print("Silk spinning = controlled protein folding:")
print(f"  In gland: α-helix + random coil (soluble)")
print(f"  Spinning: shear + pH drop → α-to-β transition")
print(f"  In fiber: β-sheet crystals (insoluble, strong)")
print()
print("AlphaFold (2020 Nobel Chemistry, 2024):")
print(f"  Predicts protein structure from sequence alone")
print(f"  Accuracy: >90 GDT (matches experimental methods)")
print(f"  Next frontier: predicting how proteins CHANGE shape")
print(f"  (like the α→β transition in silk spinning)")`,
      challenge: 'Simulate a simplified 2D protein folding process using Monte Carlo: start with a random conformation on a 2D lattice, make random moves, accept moves that lower energy (and occasionally accept ones that raise it, using the Boltzmann criterion). Track how long it takes to find the "native" state. Does the funnel shape of the energy landscape speed up the search compared to a flat landscape?',
      successHint: 'Protein folding connects molecular biology to materials science to AI. Understanding how silk fibroin folds from a random coil into a crystalline β-sheet is not just academic — it is the key to manufacturing silk-like materials. AlphaFold solved the prediction problem; the inverse design problem (engineer a sequence that folds into a desired material) is the next frontier.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Biomaterial Scientist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (biology & chemistry fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for protein structure and material science simulations. Click to start.</p>
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
