import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MugaSilkLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Part 1 — Building the amino acid property database',
      concept: `Your capstone project is a **Biomaterial Property Predictor**: a computational tool that takes an amino acid composition as input and predicts the mechanical properties (tensile strength, stiffness, extensibility, toughness) of the resulting silk fiber.

This is real computational materials science. Researchers at MIT, Cambridge, and Tufts use similar models to design new silk-based biomaterials without needing to physically synthesize every candidate.

The foundation is an **amino acid property database**. Each of the 20 amino acids has measurable physical and chemical properties:
- **Hydrophobicity**: tendency to avoid water (drives protein folding)
- **Molecular weight**: affects chain density and packing
- **Volume**: determines how tightly chains can pack in β-sheets
- **Charge**: affects solubility and inter-chain interactions
- **β-sheet propensity**: likelihood of forming β-sheet structure (critical for silk strength)
- **Flexibility**: how much conformational freedom each residue allows

Given a composition (% of each amino acid), we compute weighted averages and distributions of these properties, which then feed into the mechanical property prediction model.`,
      analogy: 'Building this database is like creating a cookbook where each ingredient has nutritional facts. If you know the recipe (amino acid composition) and the nutritional profile of each ingredient (property database), you can predict the nutritional content of the final dish (mechanical properties). The key insight is that material properties emerge from molecular composition in predictable ways.',
      storyConnection: 'The golden Muga silk is golden because of its specific amino acid recipe — 43% alanine, 27% glycine, 5.2% tyrosine. This capstone turns that recipe into a quantitative predictor: change the recipe, predict the result. What if you could design a silk with custom mechanical properties by tuning the amino acid composition?',
      checkQuestion: 'Why is β-sheet propensity the most important property for predicting silk strength, rather than hydrophobicity or molecular weight?',
      checkAnswer: 'Silk strength comes from crystalline β-sheet domains. An amino acid with high β-sheet propensity (like alanine) will form more crystalline regions, directly increasing tensile strength and stiffness. Hydrophobicity drives folding in general but does not specifically predict β-sheet formation. Molecular weight affects density but not the critical crystal structure. The composition of β-sheet-forming residues is the primary determinant of silk mechanical properties.',
      codeIntro: 'Build a comprehensive amino acid property database and compute composition-weighted properties for known silk types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# =====================================================
# BIOMATERIAL PROPERTY PREDICTOR — Part 1
# Amino Acid Property Database
# =====================================================

# Properties for the 20 standard amino acids
# Format: (hydrophobicity, mol_weight, volume_A3, charge_pH7, beta_propensity, flexibility)
# Beta propensity: Chou-Fasman scale (>1 = prefers beta-sheet)
# Flexibility: B-factor scale (higher = more flexible)

AA_PROPERTIES = {
    'Ala': (1.8,   89.1,  88.6,  0.0, 0.83, 0.360),
    'Arg': (-4.5, 174.2, 173.4,  1.0, 0.93, 0.530),
    'Asn': (-3.5, 132.1, 114.1,  0.0, 0.89, 0.460),
    'Asp': (-3.5, 133.1, 111.1, -1.0, 0.54, 0.510),
    'Cys': (2.5,  121.2, 108.5,  0.0, 1.19, 0.350),
    'Gln': (-3.5, 146.2, 143.8,  0.0, 1.10, 0.490),
    'Glu': (-3.5, 147.1, 138.4, -1.0, 0.37, 0.500),
    'Gly': (-0.4,  75.0,  60.1,  0.0, 0.75, 0.540),
    'His': (-3.2, 155.2, 153.2,  0.5, 0.87, 0.320),
    'Ile': (4.5,  131.2, 166.7,  0.0, 1.60, 0.460),
    'Leu': (3.8,  131.2, 166.7,  0.0, 1.30, 0.400),
    'Lys': (-3.9, 146.2, 168.6,  1.0, 0.74, 0.535),
    'Met': (1.9,  149.2, 162.9,  0.0, 1.05, 0.410),
    'Phe': (2.8,  165.2, 189.9,  0.0, 1.38, 0.420),
    'Pro': (-1.6, 115.1, 122.7,  0.0, 0.55, 0.510),
    'Ser': (-0.8, 105.1,  89.0,  0.0, 0.75, 0.510),
    'Thr': (-0.7, 119.1, 116.1,  0.0, 1.19, 0.440),
    'Trp': (-0.9, 204.2, 227.8,  0.0, 1.37, 0.410),
    'Tyr': (-1.3, 181.2, 193.6,  0.0, 1.47, 0.420),
    'Val': (4.2,  117.1, 140.0,  0.0, 1.70, 0.390),
}

# Known silk compositions (% of each amino acid)
SILK_COMPOSITIONS = {
    'Muga (A. assamensis)': {
        'Ala': 43.0, 'Gly': 27.0, 'Ser': 12.0, 'Tyr': 5.2,
        'Val': 3.0, 'Asp': 2.5, 'Thr': 1.8, 'Ile': 1.5,
        'Leu': 1.2, 'Glu': 1.0, 'Pro': 0.5, 'Phe': 0.3,
        'Arg': 0.5, 'Lys': 0.3, 'His': 0.2,
    },
    'Mulberry (B. mori)': {
        'Gly': 44.0, 'Ala': 30.0, 'Ser': 12.0, 'Tyr': 5.0,
        'Val': 2.0, 'Asp': 1.5, 'Thr': 1.0, 'Ile': 0.8,
        'Leu': 0.7, 'Glu': 1.0, 'Pro': 0.5, 'Phe': 0.3,
        'Arg': 0.5, 'Lys': 0.3, 'His': 0.4,
    },
    'Eri (S. ricini)': {
        'Ala': 48.0, 'Gly': 32.0, 'Ser': 8.0, 'Tyr': 3.5,
        'Val': 2.5, 'Asp': 1.8, 'Thr': 1.2, 'Ile': 0.8,
        'Leu': 0.6, 'Glu': 0.5, 'Pro': 0.3, 'Phe': 0.2,
        'Arg': 0.3, 'Lys': 0.2, 'His': 0.1,
    },
    'Spider dragline': {
        'Gly': 42.0, 'Ala': 25.0, 'Pro': 10.0, 'Gln': 8.0,
        'Ser': 5.0, 'Leu': 3.0, 'Tyr': 2.0, 'Val': 1.5,
        'Arg': 1.5, 'Asp': 1.0, 'Thr': 0.5, 'Ile': 0.5,
    },
    'Custom high-beta': {
        'Val': 30.0, 'Ile': 20.0, 'Ala': 20.0, 'Tyr': 10.0,
        'Gly': 10.0, 'Thr': 5.0, 'Phe': 3.0, 'Cys': 2.0,
    },
}

def compute_composition_properties(composition):
    """Compute weighted average properties from amino acid composition."""
    total = sum(composition.values())
    props = {
        'avg_hydrophobicity': 0, 'avg_mol_weight': 0,
        'avg_volume': 0, 'avg_charge': 0,
        'avg_beta_propensity': 0, 'avg_flexibility': 0,
    }
    prop_names = ['avg_hydrophobicity', 'avg_mol_weight', 'avg_volume',
                  'avg_charge', 'avg_beta_propensity', 'avg_flexibility']
    for aa, pct in composition.items():
        if aa in AA_PROPERTIES:
            weight = pct / total
            for i, prop_name in enumerate(prop_names):
                props[prop_name] += AA_PROPERTIES[aa][i] * weight
    return props

# Compute for all silks
silk_props = {}
for name, comp in SILK_COMPOSITIONS.items():
    silk_props[name] = compute_composition_properties(comp)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Capstone: Biomaterial Property Predictor — Amino Acid Database',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

silk_names = list(SILK_COMPOSITIONS.keys())
silk_colors = ['#f59e0b', '#e5e7eb', '#d4d4d8', '#a855f7', '#ef4444']

# Plot 1: Beta-sheet propensity comparison
ax = axes[0, 0]
beta_vals = [silk_props[n]['avg_beta_propensity'] for n in silk_names]
bars = ax.barh(range(len(silk_names)), beta_vals, color=silk_colors, edgecolor='none', height=0.6)
ax.set_yticks(range(len(silk_names)))
ax.set_yticklabels([n.split('(')[0].strip() for n in silk_names], color='white', fontsize=9)
ax.set_xlabel('Avg β-sheet propensity', color='white')
ax.set_title('β-Sheet Forming Tendency', color='white', fontsize=11)
ax.axvline(1.0, color='gray', linewidth=1, linestyle='--')
ax.text(1.01, -0.5, 'β threshold', color='gray', fontsize=8)

# Plot 2: Hydrophobicity vs flexibility
ax = axes[0, 1]
for i, name in enumerate(silk_names):
    ax.scatter(silk_props[name]['avg_hydrophobicity'],
              silk_props[name]['avg_flexibility'],
              s=200, color=silk_colors[i], edgecolor='white', linewidth=1, zorder=5)
    ax.annotate(name.split('(')[0].strip(),
                (silk_props[name]['avg_hydrophobicity'], silk_props[name]['avg_flexibility']),
                textcoords='offset points', xytext=(10, 5), color=silk_colors[i], fontsize=8)
ax.set_xlabel('Avg hydrophobicity', color='white')
ax.set_ylabel('Avg flexibility', color='white')
ax.set_title('Hydrophobicity vs Flexibility', color='white', fontsize=11)

# Plot 3: Radar chart approximation (property comparison)
ax = axes[0, 2]
prop_labels = ['Hydropho.', 'Mol. Wt.', 'Volume', 'β-propensity', 'Flexibility']
for i, name in enumerate(silk_names[:4]):  # Skip custom for clarity
    vals = [
        (silk_props[name]['avg_hydrophobicity'] + 5) / 10,  # normalize 0-1
        silk_props[name]['avg_mol_weight'] / 200,
        silk_props[name]['avg_volume'] / 200,
        silk_props[name]['avg_beta_propensity'] / 2,
        silk_props[name]['avg_flexibility'] / 0.6,
    ]
    x = np.arange(len(prop_labels))
    ax.plot(x, vals, color=silk_colors[i], linewidth=2, marker='o', markersize=5,
            label=name.split('(')[0].strip())
ax.set_xticks(range(len(prop_labels)))
ax.set_xticklabels(prop_labels, color='white', fontsize=8, rotation=15)
ax.set_ylabel('Normalized value', color='white')
ax.set_title('Property Profiles', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Individual AA beta-propensity
ax = axes[1, 0]
aa_names = sorted(AA_PROPERTIES.keys(), key=lambda x: AA_PROPERTIES[x][4], reverse=True)
beta_scores = [AA_PROPERTIES[aa][4] for aa in aa_names]
colors_beta = ['#22c55e' if b > 1 else '#ef4444' for b in beta_scores]
ax.barh(range(len(aa_names)), beta_scores, color=colors_beta, edgecolor='none', height=0.7)
ax.set_yticks(range(len(aa_names)))
ax.set_yticklabels(aa_names, color='white', fontsize=8)
ax.axvline(1.0, color='#f59e0b', linewidth=2, linestyle='--', label='β threshold')
ax.set_xlabel('β-sheet propensity (Chou-Fasman)', color='white')
ax.set_title('Amino Acid β-Sheet Scores', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Composition pie chart for Muga
ax = axes[1, 1]
muga_comp = SILK_COMPOSITIONS['Muga (A. assamensis)']
labels = [aa for aa in sorted(muga_comp.keys(), key=lambda x: muga_comp[x], reverse=True)]
sizes = [muga_comp[aa] for aa in labels]
explode = [0.05 if aa in ['Ala', 'Gly', 'Ser', 'Tyr'] else 0 for aa in labels]
wedges, texts, autotexts = ax.pie(sizes, labels=labels, autopct='%1.0f%%',
    explode=explode, textprops={'color': 'white', 'fontsize': 7},
    colors=plt.cm.Set3(np.linspace(0, 1, len(labels))))
ax.set_title('Muga Silk Composition', color='white', fontsize=11)

# Plot 6: Property table
ax = axes[1, 2]
ax.axis('off')
table_data = [['Property'] + [n.split('(')[0].strip()[:8] for n in silk_names[:4]]]
for prop, label, fmt in [
    ('avg_hydrophobicity', 'Hydropho.', '{:.2f}'),
    ('avg_mol_weight', 'Mol.Wt(Da)', '{:.1f}'),
    ('avg_volume', 'Vol(Å³)', '{:.1f}'),
    ('avg_beta_propensity', 'β-prop.', '{:.3f}'),
    ('avg_flexibility', 'Flexib.', '{:.3f}'),
]:
    row = [label] + [fmt.format(silk_props[n][prop]) for n in silk_names[:4]]
    table_data.append(row)
table = ax.table(cellText=table_data, loc='center', cellLoc='center')
table.auto_set_font_size(False)
table.set_fontsize(8)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
ax.set_title('Computed Properties Summary', color='white', fontsize=11, pad=20)

plt.tight_layout()
plt.show()

print("Biomaterial Property Predictor — Part 1: Database Built")
print("=" * 55)
print()
print("20 amino acids characterized with 6 properties each")
print("5 silk compositions loaded (4 natural + 1 custom)")
print()
for name in silk_names:
    p = silk_props[name]
    print(f"{name}:")
    print(f"  β-propensity: {p['avg_beta_propensity']:.3f}  |  "
          f"Hydro: {p['avg_hydrophobicity']:.2f}  |  "
          f"Flex: {p['avg_flexibility']:.3f}")
print()
print("Next step: use these composition properties to PREDICT mechanical behavior.")`,
      challenge: 'Add the remaining amino acids to the custom composition and experiment with extreme compositions (e.g., 90% valine — the highest β-sheet former). What are the predicted property values? Can you find a composition that maximizes β-propensity while keeping flexibility above 0.4?',
      successHint: 'The amino acid property database is the foundation of the predictor. Every mechanical property of the silk fiber ultimately traces back to these molecular-level numbers. This is the essence of materials informatics: predicting macro-scale behavior from micro-scale composition.',
    },
    {
      title: 'Capstone Part 2 — The mechanical property prediction model',
      concept: `Now we build the core prediction engine: a model that maps amino acid composition properties to mechanical behavior.

The model uses **structure-property relationships** derived from experimental data on silk biomaterials:

1. **Crystalline fraction** depends primarily on β-sheet propensity and hydrophobicity:
   - Higher β-propensity → more crystalline domains
   - Higher hydrophobicity → tighter chain packing

2. **Tensile strength** scales with crystalline fraction and chain packing density:
   - σ = σ_crystal × f_c + σ_amorphous × (1 - f_c)

3. **Young's modulus** depends on crystalline fraction and residue volume:
   - Smaller residues pack more tightly → stiffer material

4. **Strain at break** inversely correlates with crystallinity:
   - More amorphous regions → more extensibility

5. **Toughness** is the integral of stress-strain (area under curve):
   - Maximized at intermediate crystallinity (the sweet spot)

This is a physics-informed model: we encode known relationships between molecular structure and material behavior, rather than blindly fitting data. The advantage is interpretability — you can explain WHY each prediction occurs.`,
      analogy: 'This prediction model is like a weather forecast. Meteorologists do not just correlate past data — they use physics equations (fluid dynamics, thermodynamics) to predict tomorrow\'s weather from today\'s conditions. Similarly, our model uses materials physics (composite theory, polymer mechanics) to predict silk properties from molecular composition.',
      storyConnection: 'If you wanted to create a new silk variety with specific properties — say, the golden color of Muga but the extreme strength of spider dragline — this model tells you what amino acid composition to target. It turns the art of sericulture into the science of biomaterial design.',
      checkQuestion: 'The model predicts that a silk with 90% crystallinity would be the strongest. Why would a material scientist NOT want to maximize crystallinity?',
      checkAnswer: 'Extremely high crystallinity makes the material brittle — it cannot deform before breaking. A fiber that is incredibly strong but snaps at 1% strain is useless for textiles, sutures, or anything that needs to flex. The optimal silk is a compromise: enough crystallinity for strength, enough amorphous regions for toughness. Nature solved this optimization problem — spider silk is ~40% crystalline, Muga is ~60%. Both are tougher than materials with higher crystallinity.',
      codeIntro: 'Build the prediction model that converts amino acid composition into mechanical properties and validate against known silk data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# =====================================================
# BIOMATERIAL PROPERTY PREDICTOR — Part 2
# Mechanical Property Prediction Model
# =====================================================

AA_PROPERTIES = {
    'Ala': (1.8, 89.1, 88.6, 0.0, 0.83, 0.360),
    'Arg': (-4.5, 174.2, 173.4, 1.0, 0.93, 0.530),
    'Asn': (-3.5, 132.1, 114.1, 0.0, 0.89, 0.460),
    'Asp': (-3.5, 133.1, 111.1, -1.0, 0.54, 0.510),
    'Cys': (2.5, 121.2, 108.5, 0.0, 1.19, 0.350),
    'Gln': (-3.5, 146.2, 143.8, 0.0, 1.10, 0.490),
    'Glu': (-3.5, 147.1, 138.4, -1.0, 0.37, 0.500),
    'Gly': (-0.4, 75.0, 60.1, 0.0, 0.75, 0.540),
    'His': (-3.2, 155.2, 153.2, 0.5, 0.87, 0.320),
    'Ile': (4.5, 131.2, 166.7, 0.0, 1.60, 0.460),
    'Leu': (3.8, 131.2, 166.7, 0.0, 1.30, 0.400),
    'Lys': (-3.9, 146.2, 168.6, 1.0, 0.74, 0.535),
    'Met': (1.9, 149.2, 162.9, 0.0, 1.05, 0.410),
    'Phe': (2.8, 165.2, 189.9, 0.0, 1.38, 0.420),
    'Pro': (-1.6, 115.1, 122.7, 0.0, 0.55, 0.510),
    'Ser': (-0.8, 105.1, 89.0, 0.0, 0.75, 0.510),
    'Thr': (-0.7, 119.1, 116.1, 0.0, 1.19, 0.440),
    'Trp': (-0.9, 204.2, 227.8, 0.0, 1.37, 0.410),
    'Tyr': (-1.3, 181.2, 193.6, 0.0, 1.47, 0.420),
    'Val': (4.2, 117.1, 140.0, 0.0, 1.70, 0.390),
}

def get_composition_features(composition):
    total = sum(composition.values())
    features = np.zeros(6)
    for aa, pct in composition.items():
        if aa in AA_PROPERTIES:
            w = pct / total
            for i in range(6):
                features[i] += AA_PROPERTIES[aa][i] * w
    return features  # [hydro, mw, vol, charge, beta, flex]

def predict_mechanical_properties(composition):
    """
    Physics-informed model: composition → mechanical properties.
    Returns dict with predicted values.
    """
    f = get_composition_features(composition)
    hydro, mw, vol, charge, beta, flex = f

    # 1. Crystalline fraction: driven by beta-propensity and hydrophobicity
    #    Sigmoid: high beta + hydrophobic → more crystalline
    crystal_score = 2.0 * (beta - 0.7) + 0.3 * (hydro + 2) / 6
    crystallinity = 0.8 / (1 + np.exp(-3 * crystal_score))
    crystallinity = np.clip(crystallinity, 0.05, 0.95)

    # 2. Tensile strength (MPa): composite model
    sigma_crystal = 800  # MPa for pure crystal
    sigma_amorphous = 50
    packing = (150 - vol) / 100  # smaller residues pack better
    packing = np.clip(packing, 0.3, 1.0)
    tensile_strength = (sigma_crystal * crystallinity + sigma_amorphous * (1 - crystallinity)) * packing

    # 3. Young's modulus (GPa): stiffness
    E_crystal = 25.0  # GPa
    E_amorphous = 0.5
    youngs_modulus = E_crystal * crystallinity + E_amorphous * (1 - crystallinity)

    # 4. Strain at break (%): inversely related to crystallinity
    strain_max_amorphous = 50  # %
    strain_max_crystal = 2
    strain_break = strain_max_crystal * crystallinity + strain_max_amorphous * (1 - crystallinity)
    # Flexibility increases strain
    strain_break *= (flex / 0.4)

    # 5. Toughness (MJ/m³): area under stress-strain curve (approximate)
    toughness = 0.5 * tensile_strength * strain_break / 100

    return {
        'crystallinity': crystallinity,
        'tensile_strength_MPa': tensile_strength,
        'youngs_modulus_GPa': youngs_modulus,
        'strain_break_pct': strain_break,
        'toughness_MJ_m3': toughness,
    }

# Test with known silks
SILKS = {
    'Muga': {'Ala': 43, 'Gly': 27, 'Ser': 12, 'Tyr': 5.2, 'Val': 3, 'Asp': 2.5, 'Thr': 1.8, 'Ile': 1.5, 'Leu': 1.2, 'Glu': 1.0},
    'Mulberry': {'Gly': 44, 'Ala': 30, 'Ser': 12, 'Tyr': 5, 'Val': 2, 'Asp': 1.5, 'Thr': 1, 'Ile': 0.8, 'Leu': 0.7, 'Glu': 1.0},
    'Spider': {'Gly': 42, 'Ala': 25, 'Pro': 10, 'Gln': 8, 'Ser': 5, 'Leu': 3, 'Tyr': 2, 'Val': 1.5, 'Arg': 1.5, 'Asp': 1},
    'Eri': {'Ala': 48, 'Gly': 32, 'Ser': 8, 'Tyr': 3.5, 'Val': 2.5, 'Asp': 1.8, 'Thr': 1.2, 'Ile': 0.8, 'Leu': 0.6, 'Glu': 0.5},
}

# Experimental reference values for validation
EXPERIMENTAL = {
    'Muga':     {'tensile': 500, 'modulus': 7.0, 'strain': 26, 'toughness': 65},
    'Mulberry': {'tensile': 600, 'modulus': 10.0, 'strain': 18, 'toughness': 54},
    'Spider':   {'tensile': 1100, 'modulus': 12.0, 'strain': 30, 'toughness': 165},
    'Eri':      {'tensile': 450, 'modulus': 6.5, 'strain': 24, 'toughness': 54},
}

predictions = {}
for name, comp in SILKS.items():
    predictions[name] = predict_mechanical_properties(comp)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Capstone: Biomaterial Predictor — Model Validation',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

silk_names = list(SILKS.keys())
colors_s = ['#f59e0b', '#e5e7eb', '#a855f7', '#d4d4d8']

# Plot 1: Predicted vs experimental tensile strength
ax = axes[0, 0]
pred_t = [predictions[n]['tensile_strength_MPa'] for n in silk_names]
exp_t = [EXPERIMENTAL[n]['tensile'] for n in silk_names]
x = np.arange(len(silk_names))
ax.bar(x - 0.15, exp_t, 0.3, color='#3b82f6', label='Experimental', edgecolor='none')
ax.bar(x + 0.15, pred_t, 0.3, color='#22c55e', label='Predicted', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(silk_names, color='white', fontsize=9)
ax.set_ylabel('Tensile Strength (MPa)', color='white')
ax.set_title('Tensile Strength: Pred vs Exp', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Predicted vs experimental modulus
ax = axes[0, 1]
pred_m = [predictions[n]['youngs_modulus_GPa'] for n in silk_names]
exp_m = [EXPERIMENTAL[n]['modulus'] for n in silk_names]
ax.bar(x - 0.15, exp_m, 0.3, color='#3b82f6', label='Experimental', edgecolor='none')
ax.bar(x + 0.15, pred_m, 0.3, color='#22c55e', label='Predicted', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(silk_names, color='white', fontsize=9)
ax.set_ylabel("Young's Modulus (GPa)", color='white')
ax.set_title('Stiffness: Pred vs Exp', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Crystallinity predictions
ax = axes[0, 2]
cryst = [predictions[n]['crystallinity'] * 100 for n in silk_names]
exp_cryst = [60, 55, 40, 58]  # approximate experimental values
ax.bar(x - 0.15, exp_cryst, 0.3, color='#3b82f6', label='Experimental', edgecolor='none')
ax.bar(x + 0.15, cryst, 0.3, color='#22c55e', label='Predicted', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(silk_names, color='white', fontsize=9)
ax.set_ylabel('Crystallinity (%)', color='white')
ax.set_title('Crystalline Fraction', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Predicted stress-strain curves
ax = axes[1, 0]
for i, name in enumerate(silk_names):
    p = predictions[name]
    strain = np.linspace(0, p['strain_break_pct'], 300)
    stress = p['tensile_strength_MPa'] * (1 - np.exp(-p['youngs_modulus_GPa'] * 1000 * strain / (100 * p['tensile_strength_MPa']))) * (1 - (strain / p['strain_break_pct'])**3)
    stress = np.maximum(stress, 0)
    ax.plot(strain, stress, color=colors_s[i], linewidth=2.5, label=name)
ax.set_xlabel('Strain (%)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Predicted Stress-Strain Curves', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Parity plot (predicted vs experimental)
ax = axes[1, 1]
all_pred = pred_t + pred_m + [p * 100 for p in [predictions[n]['strain_break_pct'] / 100 for n in silk_names]]
all_exp = exp_t + exp_m + [EXPERIMENTAL[n]['strain'] for n in silk_names]
ax.scatter(all_exp[:4], all_pred[:4], s=100, color='#ef4444', label='Strength (MPa)', edgecolor='white')
ax.scatter([e * 100 for e in all_exp[4:8]], [p * 100 for p in all_pred[4:8]], s=100, color='#3b82f6', label='Modulus (×100)', edgecolor='white')
lims = [0, max(max(all_exp[:4]), max(all_pred[:4])) * 1.1]
ax.plot(lims, lims, '--', color='gray', linewidth=1, label='Perfect prediction')
ax.set_xlabel('Experimental', color='white')
ax.set_ylabel('Predicted', color='white')
ax.set_title('Parity Plot', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Sensitivity analysis — vary Ala content
ax = axes[1, 2]
ala_range = np.linspace(10, 70, 50)
strengths, moduli, strains = [], [], []
base = dict(SILKS['Muga'])
for ala_pct in ala_range:
    comp = dict(base)
    delta = ala_pct - comp['Ala']
    comp['Ala'] = ala_pct
    comp['Gly'] = max(1, comp['Gly'] - delta)  # compensate
    p = predict_mechanical_properties(comp)
    strengths.append(p['tensile_strength_MPa'])
    moduli.append(p['youngs_modulus_GPa'])
    strains.append(p['strain_break_pct'])

ax.plot(ala_range, strengths, color='#ef4444', linewidth=2, label='Strength (MPa)')
ax.set_xlabel('Alanine content (%)', color='white')
ax.set_ylabel('Tensile Strength (MPa)', color='white')
ax2 = ax.twinx()
ax2.plot(ala_range, strains, color='#3b82f6', linewidth=2, linestyle='--', label='Strain (%)')
ax2.set_ylabel('Strain at break (%)', color='white')
ax2.tick_params(colors='gray')
ax.axvline(43, color='#f59e0b', linewidth=2, linestyle=':', label='Muga (43%)')
ax.set_title('Sensitivity: Varying Alanine', color='white', fontsize=11)
ax.legend(loc='upper left', fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.legend(loc='upper right', fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Biomaterial Property Predictor — Part 2: Model Validation")
print("=" * 60)
print()
print(f"{'Silk':<12} {'Prop':<10} {'Predicted':>10} {'Experimental':>12} {'Error':>8}")
print("-" * 55)
for name in silk_names:
    p = predictions[name]
    e = EXPERIMENTAL[name]
    for prop, pred, exp in [
        ('Strength', p['tensile_strength_MPa'], e['tensile']),
        ('Modulus', p['youngs_modulus_GPa'], e['modulus']),
        ('Strain', p['strain_break_pct'], e['strain']),
    ]:
        err = abs(pred - exp) / exp * 100
        print(f"{name:<12} {prop:<10} {pred:>10.1f} {exp:>12.1f} {err:>7.0f}%")
print()
print("Model captures the correct TRENDS (Muga vs Mulberry vs Spider).")
print("Absolute accuracy is limited by our simplified physics model.")
print("A real predictor would use experimental training data + ML regression.")`,
      challenge: 'Improve the model by adding a nonlinear interaction term: alanine + glycine together have a synergistic effect on crystallinity (the GlyAlaGlyAla motif is the primary β-sheet former). Add this interaction to the crystallinity prediction and check if validation improves.',
      successHint: 'You have built a working physics-informed predictor that takes molecular composition and predicts material behavior. The model is imperfect — real research uses experimental data to calibrate — but the architecture is sound. This is how computational materials science works: physics provides the model structure, data provides the calibration.',
    },
    {
      title: 'Capstone Part 3 — Design space exploration',
      concept: `With a working predictor, we can now explore the **design space**: the set of all possible amino acid compositions and their predicted properties. This is the most powerful application of computational materials science — searching for compositions that optimize specific objectives WITHOUT synthesizing every candidate.

Questions we can answer:
- What composition maximizes toughness?
- What is the trade-off frontier between strength and extensibility?
- Can we find a composition that matches spider silk strength but is producible by silkworms?
- What is the theoretical limit of silk-like materials?

We use two computational approaches:

1. **Grid search**: systematically vary key amino acids (Ala, Gly, Ser, Tyr) and map the property landscape
2. **Pareto optimization**: find the set of compositions where improving one property necessarily worsens another (the Pareto frontier)

The Pareto frontier is critical because it shows the **fundamental trade-offs** in silk design. You cannot have a material that is simultaneously maximally strong AND maximally extensible — physics prevents it. The frontier shows you the best achievable compromises.`,
      analogy: 'Design space exploration is like house hunting with a budget. You want maximum space, minimum price, and best location — but you cannot optimize all three simultaneously. The Pareto frontier is the set of houses where improving one criterion requires sacrificing another. Knowing this frontier lets you make informed trade-offs rather than searching blindly.',
      storyConnection: 'Assamese weavers have been unconsciously exploring the design space for centuries — selecting cocoons that produce the finest golden thread, breeding silkworms for desired qualities. This computational approach does the same thing but at molecular resolution, in minutes rather than generations.',
      checkQuestion: 'If the Pareto frontier for strength vs. extensibility shows that spider silk (1100 MPa, 30%) is ON the frontier, what does that tell us about the possibility of creating a silk that has 1100 MPa strength AND 40% extensibility?',
      checkAnswer: 'If spider silk is on the Pareto frontier, it means no known composition achieves both 1100 MPa and >30% strain simultaneously. A composition with 1100 MPa and 40% strain would lie BEYOND the frontier — it would require fundamentally new physics (new bonding mechanisms, novel structural motifs) not captured by current silk-like materials. The frontier defines the limits of what amino acid composition alone can achieve.',
      codeIntro: 'Explore the full design space of silk-like biomaterials and identify the Pareto frontier for the strength-extensibility trade-off.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# =====================================================
# BIOMATERIAL PROPERTY PREDICTOR — Part 3
# Design Space Exploration & Pareto Optimization
# =====================================================

AA_PROPERTIES = {
    'Ala': (1.8, 89.1, 88.6, 0.0, 0.83, 0.360),
    'Gly': (-0.4, 75.0, 60.1, 0.0, 0.75, 0.540),
    'Ser': (-0.8, 105.1, 89.0, 0.0, 0.75, 0.510),
    'Tyr': (-1.3, 181.2, 193.6, 0.0, 1.47, 0.420),
    'Val': (4.2, 117.1, 140.0, 0.0, 1.70, 0.390),
    'Ile': (4.5, 131.2, 166.7, 0.0, 1.60, 0.460),
    'Pro': (-1.6, 115.1, 122.7, 0.0, 0.55, 0.510),
    'Leu': (3.8, 131.2, 166.7, 0.0, 1.30, 0.400),
}

def predict_properties(composition):
    total = sum(composition.values())
    if total == 0:
        return None
    features = np.zeros(6)
    for aa, pct in composition.items():
        if aa in AA_PROPERTIES:
            w = pct / total
            for i in range(6):
                features[i] += AA_PROPERTIES[aa][i] * w
    hydro, mw, vol, charge, beta, flex = features
    crystal_score = 2.0 * (beta - 0.7) + 0.3 * (hydro + 2) / 6
    crystallinity = 0.8 / (1 + np.exp(-3 * crystal_score))
    crystallinity = np.clip(crystallinity, 0.05, 0.95)
    packing = np.clip((150 - vol) / 100, 0.3, 1.0)
    tensile = (800 * crystallinity + 50 * (1 - crystallinity)) * packing
    modulus = 25 * crystallinity + 0.5 * (1 - crystallinity)
    strain = (2 * crystallinity + 50 * (1 - crystallinity)) * (flex / 0.4)
    toughness = 0.5 * tensile * strain / 100
    return {
        'tensile': tensile, 'modulus': modulus,
        'strain': strain, 'toughness': toughness,
        'crystallinity': crystallinity
    }

# Grid search: vary Ala (10-70%) and Gly (10-60%), fill rest with Ser
ala_range = np.arange(10, 71, 3)
gly_range = np.arange(10, 61, 3)
results = []

for ala in ala_range:
    for gly in gly_range:
        remaining = 100 - ala - gly
        if remaining < 5:
            continue
        comp = {'Ala': ala, 'Gly': gly, 'Ser': remaining * 0.5,
                'Tyr': remaining * 0.2, 'Val': remaining * 0.15,
                'Pro': remaining * 0.15}
        p = predict_properties(comp)
        if p:
            results.append({
                'ala': ala, 'gly': gly, **p
            })

results = np.array([(r['ala'], r['gly'], r['tensile'], r['strain'],
                      r['toughness'], r['modulus'], r['crystallinity'])
                     for r in results])

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Capstone: Design Space Exploration & Pareto Optimization',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Strength landscape (Ala vs Gly)
ax = axes[0, 0]
sc = ax.scatter(results[:, 0], results[:, 1], c=results[:, 2],
                cmap='YlOrRd', s=20, edgecolor='none')
plt.colorbar(sc, ax=ax, label='Tensile Strength (MPa)')
ax.set_xlabel('Alanine (%)', color='white')
ax.set_ylabel('Glycine (%)', color='white')
ax.set_title('Strength Design Landscape', color='white', fontsize=11)
# Mark known silks
for name, ala, gly, marker in [('Muga', 43, 27, 'o'), ('Mulberry', 30, 44, 's'),
                                  ('Spider', 25, 42, '^'), ('Eri', 48, 32, 'D')]:
    ax.plot(ala, gly, marker, color='white', markersize=10, markeredgecolor='black',
            markeredgewidth=1.5, zorder=5)
    ax.annotate(name, (ala, gly), textcoords='offset points', xytext=(8, 5),
                color='white', fontsize=8, fontweight='bold')

# Plot 2: Toughness landscape
ax = axes[0, 1]
sc2 = ax.scatter(results[:, 0], results[:, 1], c=results[:, 4],
                 cmap='YlGn', s=20, edgecolor='none')
plt.colorbar(sc2, ax=ax, label='Toughness (MJ/m³)')
ax.set_xlabel('Alanine (%)', color='white')
ax.set_ylabel('Glycine (%)', color='white')
ax.set_title('Toughness Design Landscape', color='white', fontsize=11)

# Plot 3: Strength vs Extensibility with Pareto frontier
ax = axes[0, 2]
ax.scatter(results[:, 3], results[:, 2], c=results[:, 6],
           cmap='viridis', s=15, alpha=0.5, edgecolor='none')

# Find Pareto frontier (maximize both strength and strain)
pareto_mask = np.ones(len(results), dtype=bool)
for i in range(len(results)):
    for j in range(len(results)):
        if i != j:
            if results[j, 2] >= results[i, 2] and results[j, 3] >= results[i, 3]:
                if results[j, 2] > results[i, 2] or results[j, 3] > results[i, 3]:
                    pareto_mask[i] = False
                    break

pareto_points = results[pareto_mask]
pareto_sorted = pareto_points[pareto_points[:, 3].argsort()]
ax.plot(pareto_sorted[:, 3], pareto_sorted[:, 2], color='#ef4444', linewidth=2.5,
        marker='o', markersize=4, label='Pareto frontier', zorder=5)

# Mark known silks
for name, strength, strain, color in [('Muga', 500, 26, '#f59e0b'),
    ('Spider', 1100, 30, '#a855f7'), ('Mulberry', 600, 18, '#e5e7eb')]:
    ax.scatter(strain, strength, s=150, color=color, edgecolor='white',
              linewidth=2, zorder=6)
    ax.annotate(name, (strain, strength), textcoords='offset points',
                xytext=(8, 8), color=color, fontsize=9, fontweight='bold')

ax.set_xlabel('Strain at break (%)', color='white')
ax.set_ylabel('Tensile Strength (MPa)', color='white')
ax.set_title('Strength vs Extensibility Trade-off', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Toughness optimization
ax = axes[1, 0]
sorted_by_tough = results[results[:, 4].argsort()[::-1]]
top_20 = sorted_by_tough[:20]
ax.scatter(results[:, 4], results[:, 6] * 100, s=10, color='gray', alpha=0.3)
ax.scatter(top_20[:, 4], top_20[:, 6] * 100, s=80, color='#22c55e',
           edgecolor='white', linewidth=1, zorder=5, label='Top 20 compositions')
ax.set_xlabel('Toughness (MJ/m³)', color='white')
ax.set_ylabel('Crystallinity (%)', color='white')
ax.set_title('Toughest Compositions', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.annotate(f'Optimal crystallinity:\\n{top_20[:, 6].mean()*100:.0f}% ± {top_20[:, 6].std()*100:.0f}%',
            xy=(top_20[0, 4] * 0.8, top_20[:, 6].mean() * 100 + 5),
            color='#22c55e', fontsize=9, fontweight='bold')

# Plot 5: Multi-objective summary
ax = axes[1, 1]
# Normalize all objectives 0-1 for comparison
strength_norm = (results[:, 2] - results[:, 2].min()) / (results[:, 2].max() - results[:, 2].min())
strain_norm = (results[:, 3] - results[:, 3].min()) / (results[:, 3].max() - results[:, 3].min())
tough_norm = (results[:, 4] - results[:, 4].min()) / (results[:, 4].max() - results[:, 4].min())

# Overall score: weighted sum
weights = [0.3, 0.3, 0.4]  # emphasis on toughness
overall = weights[0] * strength_norm + weights[1] * strain_norm + weights[2] * tough_norm
best_idx = np.argmax(overall)
best = results[best_idx]

ax.scatter(strength_norm, strain_norm, c=tough_norm, cmap='plasma', s=15, alpha=0.5)
ax.scatter(strength_norm[best_idx], strain_norm[best_idx], s=300, color='none',
           edgecolor='#f59e0b', linewidth=3, zorder=5, label=f'Optimal: Ala={best[0]:.0f}%, Gly={best[1]:.0f}%')
ax.set_xlabel('Normalized Strength', color='white')
ax.set_ylabel('Normalized Extensibility', color='white')
ax.set_title('Multi-Objective Optimization', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Optimal composition breakdown
ax = axes[1, 2]
remaining = 100 - best[0] - best[1]
opt_comp = {
    'Ala': best[0], 'Gly': best[1],
    'Ser': remaining * 0.5, 'Tyr': remaining * 0.2,
    'Val': remaining * 0.15, 'Pro': remaining * 0.15
}
labels = list(opt_comp.keys())
sizes = list(opt_comp.values())
wedges, texts, autotexts = ax.pie(sizes, labels=labels, autopct='%1.0f%%',
    textprops={'color': 'white', 'fontsize': 9},
    colors=['#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ef4444', '#ec4899'])
ax.set_title('Optimal Composition', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Design Space Exploration — Results")
print("=" * 55)
print(f"Compositions explored: {len(results)}")
print(f"Pareto-optimal: {pareto_mask.sum()}")
print()
print(f"Best overall composition (weighted: 30% strength, 30% strain, 40% toughness):")
print(f"  Ala: {best[0]:.0f}%  |  Gly: {best[1]:.0f}%")
print(f"  Predicted: σ={best[2]:.0f} MPa, ε={best[3]:.0f}%, T={best[4]:.0f} MJ/m³")
print()
print("Natural silks in context:")
for name, ala, gly in [('Muga', 43, 27), ('Mulberry', 30, 44), ('Spider', 25, 42), ('Eri', 48, 32)]:
    comp = {'Ala': ala, 'Gly': gly, 'Ser': (100-ala-gly)*0.5, 'Tyr': (100-ala-gly)*0.2,
            'Val': (100-ala-gly)*0.15, 'Pro': (100-ala-gly)*0.15}
    p = predict_properties(comp)
    print(f"  {name:>10}: σ={p['tensile']:.0f} MPa, ε={p['strain']:.0f}%, T={p['toughness']:.0f} MJ/m³")
print()
print("The Pareto frontier shows the fundamental strength-extensibility trade-off.")
print("No composition can simultaneously maximize both — physics imposes limits.")`,
      challenge: 'Add a third objective: minimize molecular weight (lighter fiber). Use 3D Pareto analysis to find compositions that are strong, extensible, AND lightweight. Visualize the 3D Pareto surface. How does adding this constraint change the optimal compositions?',
      successHint: 'Design space exploration is the power of computational materials science. Instead of synthesizing thousands of candidate silks, you simulate them in seconds and identify the most promising candidates for experimental validation. This is how modern biomaterial research works — computation narrows the search, experiments confirm the winners.',
    },
    {
      title: 'Capstone Part 4 — Interactive predictor with custom compositions',
      concept: `The final piece of the capstone is making the predictor interactive and interpretable. A real biomaterial design tool must:

1. **Accept arbitrary compositions**: any mix of amino acids, not just pre-defined silks
2. **Show confidence intervals**: how uncertain are the predictions?
3. **Decompose contributions**: which amino acids contribute most to each property?
4. **Compare to benchmarks**: how does the design compare to known materials?

We add **sensitivity analysis**: for each amino acid in the composition, how much does the predicted property change if you increase or decrease that amino acid by 5%? This tells the designer which "knobs to turn" to improve specific properties.

We also add **uncertainty quantification**: our physics model has parameter uncertainty (the exact relationship between β-propensity and crystallinity is approximate). We propagate this uncertainty through the model using Monte Carlo sampling to generate prediction intervals.

This transforms a point prediction ("tensile strength = 523 MPa") into a range ("tensile strength = 523 +/- 47 MPa"), which is essential for real engineering decisions.`,
      analogy: 'The interactive predictor is like a flight simulator for material design. You adjust the controls (amino acid percentages), see the instruments change in real time (mechanical properties), and get warnings when you approach dangerous territory (brittle region, low toughness). Before you "fly" (synthesize the material), you simulate every scenario.',
      storyConnection: 'Imagine an Assamese sericulture researcher wanting to breed Muga silkworms that produce silk with 20% greater toughness. This tool tells them: increase alanine by 5%, decrease glycine by 3%, and target 4% tyrosine. It turns centuries of trial-and-error breeding into targeted molecular design.',
      checkQuestion: 'The sensitivity analysis shows that increasing tyrosine by 5% increases tensile strength by only 2% but decreases strain by 8%. Should you increase or decrease tyrosine if your goal is maximum toughness?',
      checkAnswer: 'Decrease tyrosine. Toughness depends on BOTH strength and strain (it is the area under the stress-strain curve). A 2% strength gain does not compensate for an 8% strain loss — the net effect on toughness is negative. The sensitivity analysis reveals that tyrosine is a "strain killer" because its large aromatic side chain disrupts amorphous chain mobility. For maximum toughness, you want amino acids that maintain extensibility: glycine (small, flexible) and proline (disrupts crystallization, maintains amorphous regions).',
      codeIntro: 'Build the complete interactive predictor with sensitivity analysis, uncertainty quantification, and comparison to benchmark materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# =====================================================
# BIOMATERIAL PROPERTY PREDICTOR — Part 4
# Full Interactive Predictor with Uncertainty
# =====================================================

AA_PROPERTIES = {
    'Ala': (1.8, 89.1, 88.6, 0.0, 0.83, 0.360),
    'Arg': (-4.5, 174.2, 173.4, 1.0, 0.93, 0.530),
    'Asn': (-3.5, 132.1, 114.1, 0.0, 0.89, 0.460),
    'Asp': (-3.5, 133.1, 111.1, -1.0, 0.54, 0.510),
    'Gly': (-0.4, 75.0, 60.1, 0.0, 0.75, 0.540),
    'Ile': (4.5, 131.2, 166.7, 0.0, 1.60, 0.460),
    'Leu': (3.8, 131.2, 166.7, 0.0, 1.30, 0.400),
    'Pro': (-1.6, 115.1, 122.7, 0.0, 0.55, 0.510),
    'Ser': (-0.8, 105.1, 89.0, 0.0, 0.75, 0.510),
    'Thr': (-0.7, 119.1, 116.1, 0.0, 1.19, 0.440),
    'Tyr': (-1.3, 181.2, 193.6, 0.0, 1.47, 0.420),
    'Val': (4.2, 117.1, 140.0, 0.0, 1.70, 0.390),
}

def predict_with_noise(composition, sigma_crystal=800, sigma_amorphous=50,
                        E_crystal=25.0, E_amorphous=0.5):
    """Predict with parameterized model (for uncertainty analysis)."""
    total = sum(composition.values())
    if total == 0:
        return None
    f = np.zeros(6)
    for aa, pct in composition.items():
        if aa in AA_PROPERTIES:
            w = pct / total
            for i in range(6):
                f[i] += AA_PROPERTIES[aa][i] * w
    hydro, mw, vol, charge, beta, flex = f
    crystal_score = 2.0 * (beta - 0.7) + 0.3 * (hydro + 2) / 6
    cryst = np.clip(0.8 / (1 + np.exp(-3 * crystal_score)), 0.05, 0.95)
    packing = np.clip((150 - vol) / 100, 0.3, 1.0)
    tensile = (sigma_crystal * cryst + sigma_amorphous * (1 - cryst)) * packing
    modulus = E_crystal * cryst + E_amorphous * (1 - cryst)
    strain = (2 * cryst + 50 * (1 - cryst)) * (flex / 0.4)
    toughness = 0.5 * tensile * strain / 100
    return {'tensile': tensile, 'modulus': modulus, 'strain': strain,
            'toughness': toughness, 'crystallinity': cryst}

# === CUSTOM COMPOSITION (modify this!) ===
custom_silk = {
    'Ala': 40, 'Gly': 30, 'Ser': 12, 'Tyr': 4,
    'Val': 5, 'Pro': 3, 'Ile': 2, 'Thr': 2, 'Leu': 2,
}

# Predict base properties
base_pred = predict_with_noise(custom_silk)

# === Sensitivity Analysis ===
delta = 5.0  # percentage points
sensitivities = {}
for aa in custom_silk:
    # Increase this AA by delta, decrease others proportionally
    comp_up = dict(custom_silk)
    comp_up[aa] = min(custom_silk[aa] + delta, 80)
    excess = sum(comp_up.values()) - 100
    for other_aa in comp_up:
        if other_aa != aa and comp_up[other_aa] > 1:
            reduce = min(excess * comp_up[other_aa] / (100 - custom_silk[aa]), comp_up[other_aa] - 0.5)
            comp_up[other_aa] -= reduce
            excess -= reduce
            if excess <= 0:
                break
    pred_up = predict_with_noise(comp_up)
    sensitivities[aa] = {
        'tensile': (pred_up['tensile'] - base_pred['tensile']) / base_pred['tensile'] * 100,
        'strain': (pred_up['strain'] - base_pred['strain']) / base_pred['strain'] * 100,
        'toughness': (pred_up['toughness'] - base_pred['toughness']) / base_pred['toughness'] * 100,
    }

# === Uncertainty Quantification (Monte Carlo) ===
n_mc = 500
mc_tensile, mc_strain, mc_tough, mc_mod = [], [], [], []
for _ in range(n_mc):
    sc = np.random.normal(800, 80)   # ±10% on crystal strength
    sa = np.random.normal(50, 10)
    ec = np.random.normal(25, 3)
    ea = np.random.normal(0.5, 0.1)
    p = predict_with_noise(custom_silk, sc, sa, ec, ea)
    mc_tensile.append(p['tensile'])
    mc_strain.append(p['strain'])
    mc_tough.append(p['toughness'])
    mc_mod.append(p['modulus'])

# === Benchmark comparison ===
benchmarks = {
    'Muga': {'Ala': 43, 'Gly': 27, 'Ser': 12, 'Tyr': 5.2, 'Val': 3, 'Pro': 0.5, 'Ile': 1.5, 'Thr': 1.8, 'Leu': 1.2},
    'Spider': {'Gly': 42, 'Ala': 25, 'Pro': 10, 'Ser': 5, 'Leu': 3, 'Tyr': 2, 'Val': 1.5, 'Ile': 0.5, 'Thr': 0.5},
    'Mulberry': {'Gly': 44, 'Ala': 30, 'Ser': 12, 'Tyr': 5, 'Val': 2, 'Thr': 1, 'Ile': 0.8, 'Leu': 0.7, 'Pro': 0.5},
}
bench_preds = {n: predict_with_noise(c) for n, c in benchmarks.items()}

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Capstone: Complete Biomaterial Predictor — Custom Silk Design',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Custom composition
ax = axes[0, 0]
sorted_aa = sorted(custom_silk.items(), key=lambda x: x[1], reverse=True)
aa_labels = [a[0] for a in sorted_aa]
aa_vals = [a[1] for a in sorted_aa]
bars = ax.barh(range(len(aa_labels)), aa_vals, color='#f59e0b', edgecolor='none', height=0.6)
ax.set_yticks(range(len(aa_labels)))
ax.set_yticklabels(aa_labels, color='white', fontsize=10)
ax.set_xlabel('Composition (%)', color='white')
ax.set_title('Your Custom Silk Composition', color='white', fontsize=11)
for i, v in enumerate(aa_vals):
    ax.text(v + 0.5, i, f'{v}%', va='center', color='white', fontsize=9)

# Plot 2: Sensitivity analysis (tornado chart)
ax = axes[0, 1]
sorted_sens = sorted(sensitivities.items(), key=lambda x: abs(x[1]['toughness']), reverse=True)
aa_sens = [s[0] for s in sorted_sens]
tough_sens = [s[1]['toughness'] for s in sorted_sens]
colors_sens = ['#22c55e' if v > 0 else '#ef4444' for v in tough_sens]
ax.barh(range(len(aa_sens)), tough_sens, color=colors_sens, edgecolor='none', height=0.6)
ax.set_yticks(range(len(aa_sens)))
ax.set_yticklabels(aa_sens, color='white', fontsize=10)
ax.set_xlabel('Change in toughness (%)', color='white')
ax.set_title(f'Sensitivity: +{delta:.0f}% Each AA → Toughness', color='white', fontsize=11)
ax.axvline(0, color='gray', linewidth=1)

# Plot 3: Uncertainty distributions
ax = axes[0, 2]
ax.hist(mc_tensile, bins=30, color='#3b82f6', edgecolor='none', alpha=0.8)
ax.axvline(base_pred['tensile'], color='#f59e0b', linewidth=2, linestyle='--',
           label=f'Point estimate: {base_pred["tensile"]:.0f} MPa')
ci_lo = np.percentile(mc_tensile, 5)
ci_hi = np.percentile(mc_tensile, 95)
ax.axvspan(ci_lo, ci_hi, alpha=0.15, color='#22c55e',
           label=f'90% CI: [{ci_lo:.0f}, {ci_hi:.0f}]')
ax.set_xlabel('Tensile Strength (MPa)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Prediction Uncertainty (Monte Carlo)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Comparison to benchmarks
ax = axes[1, 0]
all_names = list(bench_preds.keys()) + ['Custom']
all_preds = list(bench_preds.values()) + [base_pred]
props_to_plot = ['tensile', 'modulus', 'strain', 'toughness']
x = np.arange(len(props_to_plot))
width = 0.18
colors_bench = ['#f59e0b', '#a855f7', '#e5e7eb', '#22c55e']
for i, (name, pred) in enumerate(zip(all_names, all_preds)):
    vals = [pred[p] for p in props_to_plot]
    # Normalize for display
    max_vals = [max(ap[p] for ap in all_preds) for p in props_to_plot]
    norm_vals = [v / m if m > 0 else 0 for v, m in zip(vals, max_vals)]
    ax.bar(x + i * width, norm_vals, width, color=colors_bench[i], label=name, edgecolor='none')
ax.set_xticks(x + width * 1.5)
ax.set_xticklabels(['Strength', 'Modulus', 'Strain', 'Toughness'], color='white', fontsize=9)
ax.set_ylabel('Normalized value', color='white')
ax.set_title('Custom vs Benchmark Silks', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Predicted stress-strain curve with uncertainty band
ax = axes[1, 1]
strain_range = np.linspace(0, base_pred['strain'], 300)
base_stress = base_pred['tensile'] * (1 - np.exp(-base_pred['modulus'] * 1000 * strain_range / (100 * base_pred['tensile']))) * (1 - (strain_range / base_pred['strain'])**3)
base_stress = np.maximum(base_stress, 0)

# MC curves for uncertainty band
mc_curves = []
for t, s, m in zip(mc_tensile[:50], mc_strain[:50], mc_mod[:50]):
    sr = np.linspace(0, s, 300)
    stress = t * (1 - np.exp(-m * 1000 * sr / (100 * t))) * (1 - (sr / s)**3)
    stress = np.maximum(stress, 0)
    mc_curves.append((sr, stress))

for sr, stress in mc_curves:
    ax.plot(sr, stress, color='#3b82f6', alpha=0.05, linewidth=0.5)
ax.plot(strain_range, base_stress, color='#f59e0b', linewidth=3, label='Point prediction')

# Add benchmark curves
for name, pred, color in [('Muga', bench_preds['Muga'], '#fbbf24'),
                            ('Spider', bench_preds['Spider'], '#a855f7')]:
    sr = np.linspace(0, pred['strain'], 300)
    stress = pred['tensile'] * (1 - np.exp(-pred['modulus'] * 1000 * sr / (100 * pred['tensile']))) * (1 - (sr / pred['strain'])**3)
    ax.plot(sr, np.maximum(stress, 0), color=color, linewidth=1.5, linestyle='--', label=name)

ax.set_xlabel('Strain (%)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Predicted Stress-Strain + Uncertainty', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Property contribution breakdown
ax = axes[1, 2]
# Which amino acids contribute most to each property?
aa_contributions = {}
for aa in custom_silk:
    if aa in AA_PROPERTIES:
        w = custom_silk[aa] / sum(custom_silk.values())
        beta_contrib = AA_PROPERTIES[aa][4] * w  # beta-propensity contribution
        aa_contributions[aa] = beta_contrib

sorted_contrib = sorted(aa_contributions.items(), key=lambda x: x[1], reverse=True)
c_names = [c[0] for c in sorted_contrib]
c_vals = [c[1] for c in sorted_contrib]
cumulative = np.cumsum(c_vals)
ax.bar(range(len(c_names)), c_vals, color='#f59e0b', edgecolor='none', width=0.6)
ax.plot(range(len(c_names)), cumulative, color='#ef4444', linewidth=2, marker='o',
        markersize=5, label='Cumulative')
ax.set_xticks(range(len(c_names)))
ax.set_xticklabels(c_names, color='white', fontsize=9)
ax.set_ylabel('β-propensity contribution', color='white')
ax.set_title('AA Contributions to Crystallinity', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("=" * 65)
print("BIOMATERIAL PROPERTY PREDICTOR — Complete Results")
print("=" * 65)
print()
print("CUSTOM COMPOSITION:", dict(sorted(custom_silk.items(), key=lambda x: x[1], reverse=True)))
print()
print("PREDICTED PROPERTIES:")
print(f"  Crystallinity:     {base_pred['crystallinity']*100:.1f}%")
print(f"  Tensile strength:  {base_pred['tensile']:.0f} MPa  (90% CI: [{ci_lo:.0f}, {ci_hi:.0f}])")
print(f"  Young's modulus:   {base_pred['modulus']:.1f} GPa")
print(f"  Strain at break:   {base_pred['strain']:.1f}%")
print(f"  Toughness:         {base_pred['toughness']:.1f} MJ/m³")
print()
print("SENSITIVITY (top 3 levers for toughness):")
for aa, sens in sorted_sens[:3]:
    print(f"  +{delta:.0f}% {aa}: tensile {sens['tensile']:+.1f}%, strain {sens['strain']:+.1f}%, toughness {sens['toughness']:+.1f}%")
print()
print("COMPARISON TO BENCHMARKS:")
for name in ['Muga', 'Spider', 'Mulberry']:
    p = bench_preds[name]
    diff = (base_pred['toughness'] - p['toughness']) / p['toughness'] * 100
    print(f"  vs {name}: toughness {diff:+.0f}%")
print()
print("Modify the 'custom_silk' dictionary to design your own silk!")
print("This is computational biomaterial design in action.")`,
      challenge: 'Create three optimized silk designs: (1) maximum strength for body armor, (2) maximum extensibility for surgical sutures, (3) maximum toughness for industrial rope. For each, use the sensitivity analysis to iteratively improve the composition. Report the final composition and predicted properties for each design.',
      successHint: 'You have built a complete biomaterial property predictor from first principles. It takes an amino acid composition, predicts mechanical properties with uncertainty, identifies which molecular changes have the most impact, and compares against known materials. This is the workflow of computational materials science: model, predict, validate, optimize.',
    },
    {
      title: 'Capstone Part 5 — Genetic design: from composition to DNA sequence',
      concept: `The ultimate application of the predictor is **inverse design**: given a desired set of mechanical properties, work backwards to find the optimal amino acid composition, and then convert that composition into a DNA sequence that could be expressed in a recombinant organism.

This closes the loop from computation to biology:
1. **Specify targets**: "I want silk with 700 MPa strength, 35% strain, and golden color"
2. **Optimize composition**: search the design space for compositions meeting the targets
3. **Design protein sequence**: arrange the amino acids into a fibroin-like sequence with proper β-sheet-forming motifs
4. **Generate DNA**: convert the protein sequence to a codon-optimized DNA sequence for E. coli or yeast expression
5. **Estimate expression yield**: predict how much protein the organism can produce

This is exactly what companies like Bolt Threads and Spiber do. The computational pipeline replaces years of trial-and-error with targeted molecular design.

The key insight for sequence design: it is not enough to have the right amino acid PROPORTIONS — the amino acids must be ARRANGED in specific patterns. The GAGAGS repeat motif must be preserved for β-sheet formation. Random shuffling of the same composition would produce a non-functional protein.`,
      analogy: 'Inverse design is like commissioning a custom car. You tell the engineer: "I want 0-60 in 4 seconds, 400-mile range, seats 5." The engineer works backwards through the physics to determine the required motor power, battery capacity, and weight — then designs the components to spec. You specify the destination (desired properties) and the predictor finds the route (molecular design).',
      storyConnection: 'The golden Muga silk that inspired this entire capstone exists because evolution optimized a protein sequence over millions of years. With computational inverse design, we can explore variations that evolution never tried — silks with Muga\'s golden color but spider silk\'s extreme strength. The story of Muga silk is no longer just heritage; it is a design blueprint for future biomaterials.',
      checkQuestion: 'You have designed an amino acid composition with predicted tensile strength of 900 MPa. When you arrange the amino acids into a sequence and express it in E. coli, the actual silk has only 300 MPa strength. What went wrong?',
      checkAnswer: 'The composition was correct but the SEQUENCE was wrong. The amino acids were likely not arranged in the proper β-sheet-forming motifs (GAGAGS repeats). A random sequence with the right composition would fold into a disordered globular protein, not a crystalline fiber. Additionally, the E. coli may lack the specific spinning conditions (shear, pH gradient) that the silkworm provides to trigger the α-to-β transition. Composition determines potential; sequence and processing determine reality.',
      codeIntro: 'Build the inverse design pipeline: specify target properties, optimize composition, design a protein sequence, and generate a codon-optimized DNA sequence.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# =====================================================
# BIOMATERIAL PROPERTY PREDICTOR — Part 5
# Inverse Design: Properties → Composition → DNA
# =====================================================

AA_PROPERTIES = {
    'Ala': (1.8, 89.1, 88.6, 0.0, 0.83, 0.360),
    'Gly': (-0.4, 75.0, 60.1, 0.0, 0.75, 0.540),
    'Ser': (-0.8, 105.1, 89.0, 0.0, 0.75, 0.510),
    'Tyr': (-1.3, 181.2, 193.6, 0.0, 1.47, 0.420),
    'Val': (4.2, 117.1, 140.0, 0.0, 1.70, 0.390),
    'Ile': (4.5, 131.2, 166.7, 0.0, 1.60, 0.460),
    'Pro': (-1.6, 115.1, 122.7, 0.0, 0.55, 0.510),
    'Leu': (3.8, 131.2, 166.7, 0.0, 1.30, 0.400),
    'Thr': (-0.7, 119.1, 116.1, 0.0, 1.19, 0.440),
}

# Codon table (E. coli optimized)
CODONS = {
    'Ala': ['GCG', 'GCC'], 'Gly': ['GGC', 'GGT'], 'Ser': ['AGC', 'TCG'],
    'Tyr': ['TAC', 'TAT'], 'Val': ['GTG', 'GTC'], 'Ile': ['ATT', 'ATC'],
    'Pro': ['CCG', 'CCA'], 'Leu': ['CTG', 'CTT'], 'Thr': ['ACC', 'ACG'],
}

AA_1LETTER = {'Ala': 'A', 'Gly': 'G', 'Ser': 'S', 'Tyr': 'Y', 'Val': 'V',
              'Ile': 'I', 'Pro': 'P', 'Leu': 'L', 'Thr': 'T'}

def predict_fast(composition):
    total = sum(composition.values())
    if total == 0: return None
    f = np.zeros(6)
    for aa, pct in composition.items():
        if aa in AA_PROPERTIES:
            w = pct / total
            for i in range(6):
                f[i] += AA_PROPERTIES[aa][i] * w
    hydro, mw, vol, charge, beta, flex = f
    cryst = np.clip(0.8 / (1 + np.exp(-3 * (2*(beta-0.7) + 0.3*(hydro+2)/6))), 0.05, 0.95)
    packing = np.clip((150 - vol) / 100, 0.3, 1.0)
    tensile = (800 * cryst + 50 * (1 - cryst)) * packing
    strain = (2 * cryst + 50 * (1 - cryst)) * (flex / 0.4)
    return {'tensile': tensile, 'strain': strain, 'toughness': 0.5*tensile*strain/100, 'crystallinity': cryst}

# === INVERSE DESIGN: Specify target properties ===
TARGETS = {
    'tensile': 700,    # MPa
    'strain': 30,      # %
    'toughness': 100,  # MJ/m³  (secondary)
}

# Optimization: gradient-free search (random + hill climbing)
best_score = -np.inf
best_comp = None
n_iterations = 5000

aa_list = list(AA_PROPERTIES.keys())
scores_history = []

for iteration in range(n_iterations):
    # Random composition
    raw = np.random.dirichlet(np.ones(len(aa_list))) * 100
    comp = {aa: raw[i] for i, aa in enumerate(aa_list)}

    p = predict_fast(comp)
    if p is None: continue

    # Score: negative distance to target (higher = better)
    score = -(((p['tensile'] - TARGETS['tensile']) / TARGETS['tensile'])**2 +
              ((p['strain'] - TARGETS['strain']) / TARGETS['strain'])**2 +
              0.3 * ((p['toughness'] - TARGETS['toughness']) / TARGETS['toughness'])**2)

    scores_history.append(score)
    if score > best_score:
        best_score = score
        best_comp = comp.copy()

# Hill climbing from best random start
for _ in range(2000):
    # Perturb
    comp_new = dict(best_comp)
    aa1, aa2 = np.random.choice(aa_list, 2, replace=False)
    delta = np.random.uniform(0.5, 3)
    if comp_new[aa1] >= delta:
        comp_new[aa1] -= delta
        comp_new[aa2] += delta
    p = predict_fast(comp_new)
    if p is None: continue
    score = -(((p['tensile'] - TARGETS['tensile']) / TARGETS['tensile'])**2 +
              ((p['strain'] - TARGETS['strain']) / TARGETS['strain'])**2 +
              0.3 * ((p['toughness'] - TARGETS['toughness']) / TARGETS['toughness'])**2)
    if score > best_score:
        best_score = score
        best_comp = comp_new

best_pred = predict_fast(best_comp)

# === SEQUENCE DESIGN ===
# Build fibroin-like sequence preserving GAGAGS motifs
def design_sequence(composition, target_length=200):
    """Design a fibroin-like protein sequence from composition."""
    # Determine number of each amino acid
    total = sum(composition.values())
    counts = {}
    for aa, pct in composition.items():
        counts[aa] = max(1, round(pct / total * target_length))

    # Adjust to exact target length
    current = sum(counts.values())
    while current > target_length:
        max_aa = max(counts, key=counts.get)
        counts[max_aa] -= 1
        current -= 1
    while current < target_length:
        min_aa = min(counts, key=counts.get)
        counts[min_aa] += 1
        current += 1

    # Build sequence with GAGAGS crystalline motifs
    sequence = []
    # Insert crystalline blocks (GAGAGS repeats)
    n_gly = counts.get('Gly', 0)
    n_ala = counts.get('Ala', 0)
    n_ser = counts.get('Ser', 0)

    n_motifs = min(n_gly // 3, n_ala // 2, n_ser // 1, 8)
    for _ in range(n_motifs):
        sequence.extend(['Gly', 'Ala', 'Gly', 'Ala', 'Gly', 'Ser'])
        counts['Gly'] -= 3; counts['Ala'] -= 2; counts['Ser'] -= 1

    # Fill remaining with mixed amorphous regions
    remaining = []
    for aa, count in counts.items():
        remaining.extend([aa] * count)
    np.random.shuffle(remaining)

    # Interleave: crystalline blocks separated by amorphous regions
    final = []
    motif_block = sequence
    block_size = len(motif_block) // max(1, n_motifs)
    amp_per_block = len(remaining) // max(1, n_motifs + 1)

    for i in range(n_motifs):
        final.extend(remaining[i*amp_per_block:(i+1)*amp_per_block])
        final.extend(motif_block[i*6:(i+1)*6])
    final.extend(remaining[n_motifs*amp_per_block:])

    return final[:target_length]

def sequence_to_dna(protein_seq):
    """Convert protein sequence to codon-optimized DNA."""
    dna = []
    for aa in protein_seq:
        codons = CODONS.get(aa, ['NNN'])
        dna.append(codons[0])  # Use preferred codon
    return ''.join(dna)

protein_seq = design_sequence(best_comp, 200)
dna_seq = sequence_to_dna(protein_seq)

# Analyze sequence
from collections import Counter
aa_freq = Counter(protein_seq)
gc_content = (dna_seq.count('G') + dna_seq.count('C')) / len(dna_seq) * 100

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Capstone: Inverse Design — From Target Properties to DNA',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Optimization convergence
ax = axes[0, 0]
window = 50
smoothed = [max(scores_history[max(0,i-window):i+1]) for i in range(len(scores_history))]
ax.plot(smoothed, color='#22c55e', linewidth=1.5)
ax.set_xlabel('Iteration', color='white')
ax.set_ylabel('Best score (higher = closer to target)', color='white')
ax.set_title('Optimization Convergence', color='white', fontsize=11)
ax.annotate(f'Best: {best_score:.4f}', xy=(len(smoothed)-1, smoothed[-1]),
            color='#f59e0b', fontsize=10, fontweight='bold')

# Plot 2: Optimized composition
ax = axes[0, 1]
sorted_comp = sorted(best_comp.items(), key=lambda x: x[1], reverse=True)
names_c = [c[0] for c in sorted_comp if c[1] > 0.5]
vals_c = [c[1] for c in sorted_comp if c[1] > 0.5]
ax.barh(range(len(names_c)), vals_c, color='#f59e0b', edgecolor='none', height=0.6)
ax.set_yticks(range(len(names_c)))
ax.set_yticklabels(names_c, color='white', fontsize=10)
ax.set_xlabel('Composition (%)', color='white')
ax.set_title('Optimized Composition', color='white', fontsize=11)
for i, v in enumerate(vals_c):
    ax.text(v + 0.3, i, f'{v:.1f}%', va='center', color='white', fontsize=9)

# Plot 3: Target vs achieved properties
ax = axes[0, 2]
props = ['tensile', 'strain', 'toughness']
target_vals = [TARGETS[p] for p in props]
achieved_vals = [best_pred[p] for p in props]
x = np.arange(len(props))
ax.bar(x - 0.15, target_vals, 0.3, color='#3b82f6', label='Target', edgecolor='none')
ax.bar(x + 0.15, achieved_vals, 0.3, color='#22c55e', label='Achieved', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(['Strength\\n(MPa)', 'Strain\\n(%)', 'Toughness\\n(MJ/m³)'],
                    color='white', fontsize=9)
ax.set_title('Target vs Achieved', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
for i in range(len(props)):
    err = abs(achieved_vals[i] - target_vals[i]) / target_vals[i] * 100
    ax.text(i, max(target_vals[i], achieved_vals[i]) + 5, f'{err:.0f}% err',
            ha='center', color='#f59e0b', fontsize=8)

# Plot 4: Protein sequence visualization (first 60 residues)
ax = axes[1, 0]
show_len = min(60, len(protein_seq))
for i in range(show_len):
    aa = protein_seq[i]
    letter = AA_1LETTER.get(aa, '?')
    row = i // 20
    col = i % 20
    color_map = {'A': '#f59e0b', 'G': '#22c55e', 'S': '#3b82f6', 'Y': '#a855f7',
                 'V': '#ef4444', 'I': '#ec4899', 'P': '#06b6d4', 'L': '#84cc16', 'T': '#f97316'}
    c = color_map.get(letter, '#64748b')
    ax.text(col, -row, letter, fontsize=10, fontfamily='monospace',
            color=c, ha='center', va='center', fontweight='bold')
ax.set_xlim(-1, 20)
ax.set_ylim(-3.5, 0.5)
ax.set_title(f'Designed Protein Sequence (first {show_len} of {len(protein_seq)} residues)',
             color='white', fontsize=11)
ax.set_xticks([]); ax.set_yticks([])

# Plot 5: DNA sequence properties
ax = axes[1, 1]
# Codon usage
codon_freq = Counter([dna_seq[i:i+3] for i in range(0, len(dna_seq)-2, 3)])
top_codons = codon_freq.most_common(10)
codon_names = [c[0] for c in top_codons]
codon_counts = [c[1] for c in top_codons]
ax.barh(range(len(codon_names)), codon_counts, color='#3b82f6', edgecolor='none', height=0.6)
ax.set_yticks(range(len(codon_names)))
ax.set_yticklabels(codon_names, color='white', fontsize=9, fontfamily='monospace')
ax.set_xlabel('Frequency', color='white')
ax.set_title(f'DNA: {len(dna_seq)} bp, GC={gc_content:.1f}%', color='white', fontsize=11)

# Plot 6: Expression feasibility
ax = axes[1, 2]
# Factors affecting expression yield
factors = ['Protein\\nsize', 'GC\\ncontent', 'Codon\\nusage', 'Solubility', 'Overall']
# Score each 0-100
size_score = max(0, 100 - len(protein_seq) / 10)  # Smaller = easier
gc_score = 100 - abs(gc_content - 50) * 3  # 50% GC is optimal
codon_score = 85  # Using preferred codons
# Solubility: silk proteins are notoriously insoluble
sol_score = 40  # Challenge!
overall = (size_score + gc_score + codon_score + sol_score) / 4
scores = [size_score, gc_score, codon_score, sol_score, overall]
colors_f = ['#22c55e' if s > 70 else '#f59e0b' if s > 50 else '#ef4444' for s in scores]
ax.barh(range(len(factors)), scores, color=colors_f, edgecolor='none', height=0.6)
ax.set_yticks(range(len(factors)))
ax.set_yticklabels(factors, color='white', fontsize=9)
ax.set_xlabel('Feasibility score (0-100)', color='white')
ax.set_title('Expression Feasibility (E. coli)', color='white', fontsize=11)
ax.axvline(70, color='#22c55e', linewidth=1, linestyle='--')
ax.axvline(50, color='#f59e0b', linewidth=1, linestyle='--')

plt.tight_layout()
plt.show()

print("=" * 65)
print("INVERSE DESIGN: Complete Pipeline Results")
print("=" * 65)
print()
print(f"TARGET PROPERTIES:")
print(f"  Tensile: {TARGETS['tensile']} MPa | Strain: {TARGETS['strain']}% | Toughness: {TARGETS['toughness']} MJ/m³")
print()
print(f"OPTIMIZED COMPOSITION:")
for aa, pct in sorted(best_comp.items(), key=lambda x: x[1], reverse=True):
    if pct > 0.5:
        print(f"  {aa}: {pct:.1f}%")
print()
print(f"ACHIEVED PROPERTIES:")
print(f"  Tensile: {best_pred['tensile']:.0f} MPa | Strain: {best_pred['strain']:.1f}% | Toughness: {best_pred['toughness']:.1f} MJ/m³")
print(f"  Crystallinity: {best_pred['crystallinity']*100:.1f}%")
print()
print(f"DESIGNED SEQUENCE ({len(protein_seq)} residues):")
seq_str = ''.join(AA_1LETTER.get(aa, '?') for aa in protein_seq[:80])
print(f"  {seq_str}...")
print()
print(f"DNA SEQUENCE ({len(dna_seq)} bp):")
print(f"  {dna_seq[:60]}...")
print(f"  GC content: {gc_content:.1f}% (optimal for E. coli: 45-55%)")
print()
print("Pipeline: Target → Optimization → Composition → Sequence → DNA → Expression")
print("This is how computational biomaterial design works in practice.")`,
      challenge: 'Design three different silks for three applications: (1) surgical suture (high strength, biocompatible, slow degradation), (2) tissue scaffold (moderate strength, high porosity, fast degradation), (3) bulletproof vest (maximum toughness). For each, run the full pipeline and compare the resulting DNA sequences. How different are the sequences for different applications?',
      successHint: 'You have completed the full biomaterial design pipeline: from understanding the molecular basis of Muga silk to building a predictor to designing entirely new silk proteins. This is computational biology at its most powerful — using models to design molecules that nature never tried. The golden silk of Assam has become a launchpad for biomaterial innovation.',
    },
    {
      title: 'Capstone Part 6 — Full system integration and analysis report',
      concept: `The final step of any engineering capstone is the **integration test and report**. You bring all components together, run the complete pipeline end-to-end, validate the results, and present findings in a professional format.

This mirrors real research:
1. **Literature validation**: compare predictions against published experimental data
2. **Ablation study**: systematically remove model components to understand which ones matter most
3. **Limitations analysis**: what the model cannot predict and why
4. **Future directions**: how to improve the model with experimental data

Key limitations of our model:
- **No sequence effects**: we predict from composition alone, ignoring residue arrangement (which matters enormously for folding)
- **Linear mixing rules**: real silk has nonlinear cooperative effects between amino acids
- **No processing effects**: the spinning process (shear rate, pH, temperature) dramatically affects fiber properties but is not modeled
- **Limited training data**: real ML models would be trained on hundreds of experimentally characterized silks

Despite these limitations, the model captures the correct qualitative trends and demonstrates the computational biomaterial design workflow. Converting it from a physics-informed model to a data-driven ML model would require the experimental datasets that research labs are currently building.`,
      analogy: 'The integration test is like the final flight check before an aircraft is certified. Every subsystem (engines, avionics, hydraulics) has been tested individually, but now you test them TOGETHER under realistic conditions. Likewise, we have tested each component of the predictor independently — now we run the complete pipeline and assess overall performance.',
      storyConnection: 'From a children\'s story about golden silk to a complete biomaterial design system — that is the journey of this capstone. The Muga silkworm has been spinning golden threads for millennia. We have built the computational tools to understand why the silk is golden, predict how to make it stronger, and design new silk proteins from scratch. Science begins with wonder and ends with engineering.',
      checkQuestion: 'If you had access to a wet lab, what single experiment would most improve the predictive accuracy of this model?',
      checkAnswer: 'Measure the mechanical properties (tensile strength, modulus, strain at break) of 50+ recombinant silk variants with systematically varied amino acid compositions under identical spinning conditions. This would provide the training data needed to replace the physics-informed rules with a data-driven ML regression model. The key is controlling the spinning process — the same composition processed differently gives different properties. Standardizing the spinning conditions isolates the composition effect, which is what our model tries to predict.',
      codeIntro: 'Run the complete integrated pipeline, perform an ablation study, and generate a comprehensive analysis report.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# =====================================================
# BIOMATERIAL PROPERTY PREDICTOR — Part 6
# Full Integration Test & Analysis Report
# =====================================================

AA_PROPERTIES = {
    'Ala': (1.8, 89.1, 88.6, 0.0, 0.83, 0.360),
    'Gly': (-0.4, 75.0, 60.1, 0.0, 0.75, 0.540),
    'Ser': (-0.8, 105.1, 89.0, 0.0, 0.75, 0.510),
    'Tyr': (-1.3, 181.2, 193.6, 0.0, 1.47, 0.420),
    'Val': (4.2, 117.1, 140.0, 0.0, 1.70, 0.390),
    'Ile': (4.5, 131.2, 166.7, 0.0, 1.60, 0.460),
    'Pro': (-1.6, 115.1, 122.7, 0.0, 0.55, 0.510),
    'Leu': (3.8, 131.2, 166.7, 0.0, 1.30, 0.400),
    'Thr': (-0.7, 119.1, 116.1, 0.0, 1.19, 0.440),
}

def predict(comp, use_hydro=True, use_packing=True, use_flex=True):
    """Full model with toggleable components for ablation."""
    total = sum(comp.values())
    f = np.zeros(6)
    for aa, pct in comp.items():
        if aa in AA_PROPERTIES:
            w = pct / total
            for i in range(6):
                f[i] += AA_PROPERTIES[aa][i] * w
    hydro, mw, vol, charge, beta, flex = f

    crystal_score = 2.0 * (beta - 0.7)
    if use_hydro:
        crystal_score += 0.3 * (hydro + 2) / 6
    cryst = np.clip(0.8 / (1 + np.exp(-3 * crystal_score)), 0.05, 0.95)

    packing = np.clip((150 - vol) / 100, 0.3, 1.0) if use_packing else 0.7
    tensile = (800 * cryst + 50 * (1 - cryst)) * packing

    flex_factor = (flex / 0.4) if use_flex else 1.0
    strain = (2 * cryst + 50 * (1 - cryst)) * flex_factor
    modulus = 25 * cryst + 0.5 * (1 - cryst)
    toughness = 0.5 * tensile * strain / 100

    return {'tensile': tensile, 'modulus': modulus, 'strain': strain,
            'toughness': toughness, 'crystallinity': cryst}

# Test silks with experimental data
VALIDATION = {
    'Muga':     ({'Ala':43,'Gly':27,'Ser':12,'Tyr':5.2,'Val':3,'Thr':1.8,'Ile':1.5,'Leu':1.2,'Pro':0.5},
                 {'tensile':500, 'modulus':7.0, 'strain':26, 'toughness':65}),
    'Mulberry': ({'Gly':44,'Ala':30,'Ser':12,'Tyr':5,'Val':2,'Thr':1,'Ile':0.8,'Leu':0.7,'Pro':0.5},
                 {'tensile':600, 'modulus':10.0, 'strain':18, 'toughness':54}),
    'Spider':   ({'Gly':42,'Ala':25,'Pro':10,'Ser':5,'Leu':3,'Tyr':2,'Val':1.5,'Ile':0.5,'Thr':0.5},
                 {'tensile':1100, 'modulus':12.0, 'strain':30, 'toughness':165}),
    'Eri':      ({'Ala':48,'Gly':32,'Ser':8,'Tyr':3.5,'Val':2.5,'Thr':1.2,'Ile':0.8,'Leu':0.6,'Pro':0.3},
                 {'tensile':450, 'modulus':6.5, 'strain':24, 'toughness':54}),
}

# === FULL PIPELINE TEST ===
preds = {name: predict(comp) for name, (comp, _) in VALIDATION.items()}

# === ABLATION STUDY ===
ablation_configs = {
    'Full model': {'use_hydro': True, 'use_packing': True, 'use_flex': True},
    'No hydrophobicity': {'use_hydro': False, 'use_packing': True, 'use_flex': True},
    'No packing': {'use_hydro': True, 'use_packing': False, 'use_flex': True},
    'No flexibility': {'use_hydro': True, 'use_packing': True, 'use_flex': False},
    'Beta-only': {'use_hydro': False, 'use_packing': False, 'use_flex': False},
}

ablation_errors = {}
for config_name, kwargs in ablation_configs.items():
    errors = []
    for name, (comp, exp) in VALIDATION.items():
        p = predict(comp, **kwargs)
        for prop in ['tensile', 'strain']:
            err = abs(p[prop] - exp[prop]) / exp[prop] * 100
            errors.append(err)
    ablation_errors[config_name] = np.mean(errors)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Capstone Report: Biomaterial Property Predictor — Integration & Analysis',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

silk_names = list(VALIDATION.keys())
colors_v = ['#f59e0b', '#e5e7eb', '#a855f7', '#d4d4d8']

# Plot 1: Parity plot — all predictions vs experimental
ax = axes[0, 0]
for i, name in enumerate(silk_names):
    comp, exp = VALIDATION[name]
    pred = preds[name]
    for prop, marker, prop_label in [('tensile', 'o', 'σ'), ('strain', 's', 'ε')]:
        ax.scatter(exp[prop], pred[prop], s=120, color=colors_v[i], marker=marker,
                  edgecolor='white', linewidth=1, zorder=5)
        ax.annotate(f'{name} {prop_label}', (exp[prop], pred[prop]),
                    textcoords='offset points', xytext=(8, 5), color=colors_v[i], fontsize=7)
lim_max = max(max(VALIDATION[n][1]['tensile'] for n in silk_names),
              max(preds[n]['tensile'] for n in silk_names)) * 1.1
ax.plot([0, lim_max], [0, lim_max], '--', color='gray', linewidth=1)
ax.set_xlabel('Experimental', color='white')
ax.set_ylabel('Predicted', color='white')
ax.set_title('Overall Parity (circles=σ, squares=ε)', color='white', fontsize=11)

# Plot 2: Ablation study
ax = axes[0, 1]
abl_names = list(ablation_errors.keys())
abl_vals = list(ablation_errors.values())
colors_abl = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']
bars = ax.barh(range(len(abl_names)), abl_vals, color=colors_abl, edgecolor='none', height=0.6)
ax.set_yticks(range(len(abl_names)))
ax.set_yticklabels(abl_names, color='white', fontsize=9)
ax.set_xlabel('Mean Absolute % Error', color='white')
ax.set_title('Ablation Study: Which Components Matter?', color='white', fontsize=11)
for i, v in enumerate(abl_vals):
    ax.text(v + 0.5, i, f'{v:.1f}%', va='center', color='white', fontsize=9)

# Plot 3: Error by silk type
ax = axes[0, 2]
error_by_silk = {}
for name, (comp, exp) in VALIDATION.items():
    p = preds[name]
    errors = {prop: abs(p[prop] - exp[prop]) / exp[prop] * 100
              for prop in ['tensile', 'modulus', 'strain']}
    error_by_silk[name] = errors

x = np.arange(len(silk_names))
width = 0.25
for j, (prop, color) in enumerate(zip(['tensile', 'modulus', 'strain'],
                                        ['#ef4444', '#3b82f6', '#22c55e'])):
    vals = [error_by_silk[n][prop] for n in silk_names]
    ax.bar(x + j * width, vals, width, color=color, label=prop.capitalize(), edgecolor='none')
ax.set_xticks(x + width)
ax.set_xticklabels(silk_names, color='white', fontsize=9)
ax.set_ylabel('% Error', color='white')
ax.set_title('Prediction Error by Silk Type', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Model limitations — known vs predicted trends
ax = axes[1, 0]
# Vary Ala from 20-60%, show predicted vs actual trend
ala_range = np.linspace(20, 60, 50)
pred_strength = []
for ala in ala_range:
    comp = {'Ala': ala, 'Gly': 100-ala-20, 'Ser': 10, 'Tyr': 4, 'Val': 3, 'Pro': 2, 'Thr': 1}
    p = predict(comp)
    pred_strength.append(p['tensile'])
ax.plot(ala_range, pred_strength, color='#3b82f6', linewidth=2.5, label='Model prediction')

# Experimental points
for name, ala, strength, color in [
    ('Eri', 48, 450, '#d4d4d8'), ('Muga', 43, 500, '#f59e0b'),
    ('Mulberry', 30, 600, '#e5e7eb'), ('Spider', 25, 1100, '#a855f7')]:
    ax.scatter(ala, strength, s=150, color=color, edgecolor='white', linewidth=2, zorder=5)
    ax.annotate(name, (ala, strength), textcoords='offset points', xytext=(8, 5),
                color=color, fontsize=9, fontweight='bold')

ax.set_xlabel('Alanine content (%)', color='white')
ax.set_ylabel('Tensile strength (MPa)', color='white')
ax.set_title('Limitation: Spider Silk Anomaly', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.annotate('Model misses spider silk\\n(proline + spinning effects)', xy=(28, 800),
            color='#ef4444', fontsize=8, fontweight='bold')

# Plot 5: Feature importance (from ablation)
ax = axes[1, 1]
feature_importance = {
    'β-propensity': ablation_errors['Beta-only'] - ablation_errors['Full model'],
    'Hydrophobicity': ablation_errors['No hydrophobicity'] - ablation_errors['Full model'],
    'Packing (volume)': ablation_errors['No packing'] - ablation_errors['Full model'],
    'Flexibility': ablation_errors['No flexibility'] - ablation_errors['Full model'],
}
fi_sorted = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
fi_names = [f[0] for f in fi_sorted]
fi_vals = [f[1] for f in fi_sorted]
ax.barh(range(len(fi_names)), fi_vals,
        color=['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'][:len(fi_names)],
        edgecolor='none', height=0.6)
ax.set_yticks(range(len(fi_names)))
ax.set_yticklabels(fi_names, color='white', fontsize=10)
ax.set_xlabel('Error increase when removed (%)', color='white')
ax.set_title('Feature Importance (from ablation)', color='white', fontsize=11)

# Plot 6: Future directions radar
ax = axes[1, 2]
improvements = [
    ('Add sequence\\neffects', 40),
    ('ML regression\\nfrom data', 35),
    ('Spinning process\\nparameters', 25),
    ('Multi-scale\\nmodeling', 20),
    ('Experimental\\nvalidation', 15),
]
imp_names = [i[0] for i in improvements]
imp_vals = [i[1] for i in improvements]
ax.barh(range(len(imp_names)), imp_vals,
        color=plt.cm.viridis(np.linspace(0.3, 0.9, len(imp_names))),
        edgecolor='none', height=0.6)
ax.set_yticks(range(len(imp_names)))
ax.set_yticklabels(imp_names, color='white', fontsize=9)
ax.set_xlabel('Expected accuracy improvement (%)', color='white')
ax.set_title('Future Improvements', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("=" * 70)
print("BIOMATERIAL PROPERTY PREDICTOR — FINAL REPORT")
print("=" * 70)
print()
print("1. VALIDATION RESULTS")
print("-" * 55)
print(f"  {'Silk':<12} {'Property':<10} {'Predicted':>10} {'Actual':>10} {'Error':>8}")
print(f"  {'-'*50}")
total_errors = []
for name in silk_names:
    p = preds[name]
    e = VALIDATION[name][1]
    for prop in ['tensile', 'modulus', 'strain']:
        err = abs(p[prop] - e[prop]) / e[prop] * 100
        total_errors.append(err)
        print(f"  {name:<12} {prop:<10} {p[prop]:>10.1f} {e[prop]:>10.1f} {err:>7.1f}%")
print(f"  Mean absolute error: {np.mean(total_errors):.1f}%")
print()
print("2. ABLATION STUDY")
print("-" * 40)
for name, err in sorted(ablation_errors.items(), key=lambda x: x[1]):
    print(f"  {name:<25} {err:.1f}% error")
print()
print("3. KEY FINDINGS")
print("-" * 40)
print("  - Beta-propensity is the dominant predictor of silk strength")
print("  - Packing (residue volume) is second most important")
print("  - Model captures insect silks well but underestimates spider silk")
print("  - Spider silk's anomalous strength likely comes from spinning process")
print("    (shear-induced crystallization) and unique proline-rich motifs")
print()
print("4. LIMITATIONS")
print("-" * 40)
print("  - Composition-only model ignores sequence arrangement")
print("  - No spinning/processing parameters")
print("  - Limited to 4 validation points")
print("  - Linear mixing approximation")
print()
print("5. NEXT STEPS")
print("-" * 40)
print("  - Add recombinant silk expression data (Bolt Threads, Spiber)")
print("  - Incorporate molecular dynamics simulation results")
print("  - Train ML model on expanded dataset")
print("  - Validate top 3 predictions experimentally")
print()
print("CAPSTONE COMPLETE: From Muga Silk story to Biomaterial Design System.")`,
      challenge: 'Extend the model to include a spinning process parameter (shear rate 0-200 s^-1). Use the relationship established in Level 3 Mini-Lesson 5 (spinning-induced crystallization) to add a processing dimension to the predictor. Does including shear rate improve the spider silk prediction?',
      successHint: 'You have completed a full biomaterial engineering capstone. Starting from the children\'s story about golden Muga silk, you built: (1) an amino acid property database, (2) a physics-informed mechanical property predictor, (3) a design space explorer with Pareto optimization, (4) an inverse design pipeline generating DNA sequences, and (5) a rigorous validation and analysis report. This is computational materials science — and it started with a silkworm in Assam.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Biomaterial Property Predictor
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (protein structure & material science)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project builds a complete Biomaterial Property Predictor in Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
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
