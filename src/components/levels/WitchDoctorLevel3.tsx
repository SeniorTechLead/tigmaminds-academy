import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function WitchDoctorLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Phytochemistry — classes of plant secondary metabolites',
      concept: `Plants produce thousands of secondary metabolites — chemicals not needed for basic growth but crucial for defense, communication, and survival. These fall into three major classes: (1) Alkaloids — nitrogen-containing compounds like morphine, quinine, and caffeine. They often taste bitter (deterring herbivores) and have potent pharmacological effects on animal nervous systems. (2) Terpenoids — built from isoprene units (C₅H₈), including essential oils (monoterpenes), artemisinin (sesquiterpene), and taxol (diterpene). Over 40,000 known terpenoids make this the largest class. (3) Phenolics — containing aromatic rings with hydroxyl groups, including flavonoids, tannins, and curcumin. They act as antioxidants and UV protectants.

The biosynthetic pathways are well-understood: alkaloids derive from amino acids (tryptophan, tyrosine, lysine), terpenoids from the mevalonate or MEP pathway, and phenolics from the shikimic acid pathway. Understanding these pathways is essential for drug discovery because it tells us which plants are likely to produce which types of compounds — closely related plants share biosynthetic machinery and therefore produce similar metabolite profiles.

Northeast India's biodiversity hotspot harbors an estimated 8,000+ plant species, many with documented ethnobotanical uses. The traditional knowledge holders — the witch doctors, herbalists, and medicine practitioners of tribal communities — represent centuries of empirical pharmacology that modern science is now working to validate and understand.`,
      analogy: 'Think of plant secondary metabolites as a plant\'s chemical toolkit. Alkaloids are like the plant\'s pepper spray — they target animal nervous systems to deter herbivores. Terpenoids are like perfume and insect repellent combined — volatile ones attract pollinators while others repel pests. Phenolics are like sunscreen and preservatives — they absorb UV radiation and prevent oxidative damage. Each plant species carries a unique combination of these tools, selected by millions of years of evolution.',
      storyConnection: 'The witch doctor in the story knows which plants treat fever, which soothe pain, and which heal wounds. This knowledge maps directly onto phytochemical classes: fever-treating plants likely contain alkaloids (like quinine from cinchona bark), pain-relieving ones contain analgesic compounds (like salicin from willow bark, the precursor to aspirin), and wound-healing plants contain antimicrobial phenolics and terpenoids.',
      checkQuestion: 'A traditional healer uses three plants: one with intensely bitter leaves for malaria, one with aromatic oily leaves for respiratory infections, and one with astringent bark for diarrhea. What phytochemical class likely dominates each, and why?',
      checkAnswer: 'Bitter leaves for malaria: alkaloids — bitter taste indicates nitrogen-containing bases (quinine is the archetype antimalarial alkaloid). Aromatic oily leaves: terpenoids — volatile essential oils are primarily monoterpenes and sesquiterpenes with antimicrobial properties that help clear respiratory infections. Astringent bark: tannins (phenolics) — the puckering, drying sensation of astringency comes from tannins precipitating proteins, which also acts as an anti-diarrheal by tightening gut mucosa and as an antimicrobial by disrupting bacterial proteins.',
      codeIntro: 'Map the phytochemical landscape of medicinal plants, visualizing the relationships between plant families, compound classes, and therapeutic uses.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Phytochemical database
plant_families = ['Rubiaceae', 'Fabaceae', 'Asteraceae', 'Lamiaceae', 'Zingiberaceae',
                  'Apocynaceae', 'Solanaceae', 'Piperaceae', 'Lauraceae', 'Rutaceae']
compound_classes = ['Alkaloids', 'Terpenoids', 'Phenolics', 'Glycosides', 'Saponins']
therapeutic_uses = ['Antimalarial', 'Analgesic', 'Anti-inflammatory', 'Antimicrobial',
                    'Antidiabetic', 'Wound healing', 'Digestive', 'Respiratory']

# Generate realistic phytochemical profiles
n_plants = 80
plant_data = {
    'family': np.random.choice(plant_families, n_plants),
    'alkaloid_content': np.random.exponential(2, n_plants),
    'terpenoid_content': np.random.exponential(3, n_plants),
    'phenolic_content': np.random.exponential(4, n_plants),
    'bioactivity': np.random.uniform(0, 1, n_plants),
}

# Family-specific enrichments
family_profiles = {
    'Rubiaceae': [5, 2, 3, 0.7],     # alkaloid-rich
    'Lamiaceae': [1, 6, 4, 0.6],     # terpenoid-rich
    'Asteraceae': [2, 5, 3, 0.5],    # terpenoid/phenolic
    'Fabaceae': [3, 2, 5, 0.6],      # phenolic-rich
    'Zingiberaceae': [1, 7, 3, 0.7], # terpenoid-rich
    'Apocynaceae': [6, 3, 2, 0.8],   # alkaloid-rich (potent)
    'Solanaceae': [7, 2, 2, 0.7],    # alkaloid-rich
    'Piperaceae': [5, 2, 4, 0.6],    # alkaloid/phenolic
    'Lauraceae': [2, 5, 3, 0.5],     # terpenoid
    'Rutaceae': [3, 4, 3, 0.6],      # mixed
}
for i in range(n_plants):
    fam = plant_data['family'][i]
    profile = family_profiles[fam]
    plant_data['alkaloid_content'][i] *= profile[0] / 3
    plant_data['terpenoid_content'][i] *= profile[1] / 3
    plant_data['phenolic_content'][i] *= profile[2] / 3
    plant_data['bioactivity'][i] *= profile[3]

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Ternary-style plot of compound composition
ax = axes[0, 0]
ax.set_facecolor('#111827')
total = (plant_data['alkaloid_content'] + plant_data['terpenoid_content'] +
         plant_data['phenolic_content'])
alk_frac = plant_data['alkaloid_content'] / total
terp_frac = plant_data['terpenoid_content'] / total
phen_frac = plant_data['phenolic_content'] / total

family_colors = {fam: plt.cm.tab10(i) for i, fam in enumerate(plant_families)}
for fam in plant_families:
    mask = plant_data['family'] == fam
    ax.scatter(alk_frac[mask], terp_frac[mask],
              c=[family_colors[fam]], s=40, alpha=0.7, label=fam, edgecolors='white', linewidths=0.3)
ax.set_xlabel('Alkaloid fraction', color='white')
ax.set_ylabel('Terpenoid fraction', color='white')
ax.set_title('Phytochemical Profiles by Family', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white',
          ncol=2, loc='upper right')
ax.tick_params(colors='gray')

# Plot 2: Compound class abundance by family
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
families_to_plot = plant_families[:6]
x_pos = np.arange(len(families_to_plot))
width = 0.25
alk_means = [np.mean(plant_data['alkaloid_content'][plant_data['family'] == f]) for f in families_to_plot]
terp_means = [np.mean(plant_data['terpenoid_content'][plant_data['family'] == f]) for f in families_to_plot]
phen_means = [np.mean(plant_data['phenolic_content'][plant_data['family'] == f]) for f in families_to_plot]

ax2.bar(x_pos - width, alk_means, width, color='#ef4444', alpha=0.8, label='Alkaloids')
ax2.bar(x_pos, terp_means, width, color='#22c55e', alpha=0.8, label='Terpenoids')
ax2.bar(x_pos + width, phen_means, width, color='#3b82f6', alpha=0.8, label='Phenolics')
ax2.set_xticks(x_pos)
ax2.set_xticklabels([f[:5] for f in families_to_plot], fontsize=8)
ax2.set_ylabel('Mean content (arbitrary units)', color='white')
ax2.set_title('Compound Classes by Plant Family', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Bioactivity vs total phytochemical content
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
total_content = total
scatter3 = ax3.scatter(total_content, plant_data['bioactivity'],
                       c=alk_frac, cmap='RdYlGn', s=40, alpha=0.7,
                       edgecolors='white', linewidths=0.3)
cbar3 = plt.colorbar(scatter3, ax=ax3)
cbar3.set_label('Alkaloid fraction', color='white')
cbar3.ax.tick_params(colors='gray')
# Trend line
z = np.polyfit(total_content, plant_data['bioactivity'], 1)
x_fit = np.linspace(total_content.min(), total_content.max(), 100)
ax3.plot(x_fit, np.polyval(z, x_fit), '--', color='#fbbf24', linewidth=1.5)
ax3.set_xlabel('Total phytochemical content', color='white')
ax3.set_ylabel('Bioactivity score', color='white')
ax3.set_title('Bioactivity vs Phytochemical Content', color='white', fontsize=12, fontweight='bold')
ax3.tick_params(colors='gray')

# Plot 4: Biosynthetic pathway overview
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Simplified pathway diagram using bar chart of precursors
precursors = ['Shikimic\\\nacid', 'Mevalonate\\\n(MVA)', 'MEP\\\npathway', 'Amino\\\nacids', 'Acetyl\\\nCoA']
products = [35, 45, 25, 30, 20]  # approximate % of known compounds from each
colors_p = ['#3b82f6', '#22c55e', '#14b8a6', '#ef4444', '#f59e0b']
bars = ax4.bar(precursors, products, color=colors_p, alpha=0.8, edgecolor='white', linewidth=0.5)
# Annotate product classes
annotations = ['Phenolics\\\nFlavonoids', 'Terpenoids\\\nSteroids', 'Terpenoids\\\n(plastidic)', 'Alkaloids', 'Fatty acids\\\nPolyketides']
for bar, ann in zip(bars, annotations):
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             ann, ha='center', va='bottom', color='white', fontsize=7, fontweight='bold')
ax4.set_ylabel('% of known metabolites', color='white')
ax4.set_title('Biosynthetic Pathways → Product Classes', color='white', fontsize=12, fontweight='bold')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    PHYTOCHEMICAL LANDSCAPE ANALYSIS")
print("=" * 60)
print(f"\\\nDatabase: {n_plants} plants from {len(plant_families)} families")
print(f"\\\nMost alkaloid-rich families:")
for fam in sorted(plant_families, key=lambda f: -np.mean(plant_data['alkaloid_content'][plant_data['family']==f]))[:3]:
    print(f"  {fam}: {np.mean(plant_data['alkaloid_content'][plant_data['family']==fam]):.1f}")
print(f"\\\nMost bioactive families:")
for fam in sorted(plant_families, key=lambda f: -np.mean(plant_data['bioactivity'][plant_data['family']==f]))[:3]:
    print(f"  {fam}: {np.mean(plant_data['bioactivity'][plant_data['family']==fam]):.2f}")`,
      challenge: 'Add a chemotaxonomy analysis: cluster plants by their phytochemical profiles and show how chemical similarity often (but not always) correlates with taxonomic relatedness.',
      successHint: 'You have mapped the chemical diversity of medicinal plants — understanding which families produce which compounds is the foundation of rational drug discovery from traditional knowledge.',
    },
    {
      title: 'Pharmacokinetics — absorption, distribution, metabolism, excretion',
      concept: `When a plant extract enters the body, its active compounds undergo ADME: Absorption (crossing gut membranes into blood), Distribution (traveling to target tissues), Metabolism (chemical transformation, mainly in the liver), and Excretion (elimination via kidneys or bile). Understanding ADME determines whether a phytochemical can become a drug.

Absorption depends on Lipinski's Rule of Five: a drug candidate should have molecular weight < 500 Da, logP (lipophilicity) < 5, hydrogen bond donors < 5, and hydrogen bond acceptors < 10. Compounds violating these rules tend to have poor oral absorption because they cannot efficiently cross lipid cell membranes. Most successful drugs from plants satisfy Lipinski's rules.

Distribution is governed by plasma protein binding and tissue affinity. Metabolism occurs primarily through cytochrome P450 enzymes in the liver, which oxidize foreign molecules for elimination. Many plant compounds are prodrugs — inactive forms that are activated by metabolism (e.g., salicin from willow bark is metabolized to salicylic acid, the active anti-inflammatory). Half-life (t₁/₂) determines dosing frequency: t₁/₂ = 0.693/k_elimination. First-order elimination means the rate of drug removal is proportional to its concentration: C(t) = C₀ × e^(-k_el × t).`,
      analogy: 'ADME is like the journey of a letter through a postal system. Absorption is dropping the letter in the mailbox (getting into the system). Distribution is the sorting and delivery route (reaching the right address). Metabolism is the letter being read, annotated, and sometimes forwarded (chemical processing). Excretion is the letter being filed or shredded (elimination). A drug that never gets absorbed is a letter that was never mailed; one that is metabolized too fast is a letter shredded before anyone reads it.',
      storyConnection: 'The witch doctor prepares medicines as teas (aqueous extraction), poultices (topical delivery), or steam inhalations (pulmonary absorption) — each preparation method selects for different compounds and uses different absorption routes. A tea extracts hydrophilic compounds that absorb through the gut; a poultice delivers hydrophobic compounds through the skin. The preparation IS the pharmacokinetics.',
      checkQuestion: 'A plant alkaloid has MW = 285, logP = 2.1, 2 H-bond donors, and 4 acceptors. Its plasma half-life is 4 hours. Does it satisfy Lipinski rules? If a patient takes 200mg, what concentration remains after 12 hours? How often should they dose to maintain effective levels?',
      checkAnswer: 'Lipinski check: MW 285 < 500, logP 2.1 < 5, HBD 2 < 5, HBA 4 < 10 — all rules satisfied, suggesting good oral bioavailability. k_el = 0.693/4 = 0.173 h⁻¹. After 12 hours: C = 200 × e^(-0.173 × 12) = 200 × e^(-2.08) = 200 × 0.125 = 25 mg equivalent (12.5% remaining). After 3 half-lives (12h), about 87.5% is eliminated. Dosing every 6-8 hours (1.5-2 half-lives) would maintain therapeutic levels between ~50-100% of peak.',
      codeIntro: 'Model drug pharmacokinetics — absorption, distribution, metabolism, and excretion — and visualize how dosing regimens affect drug levels over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Pharmacokinetic models
def one_compartment(t, dose, ka, ke, Vd):
    """One-compartment PK model with first-order absorption and elimination."""
    if ka == ke:
        ka += 0.01  # avoid division by zero
    C = (dose * ka) / (Vd * (ka - ke)) * (np.exp(-ke * t) - np.exp(-ka * t))
    return np.maximum(C, 0)

def multiple_doses(times, dose, interval, ka, ke, Vd, n_doses=10):
    """Superposition principle for multiple doses."""
    C = np.zeros_like(times)
    for i in range(n_doses):
        t_shifted = times - i * interval
        mask = t_shifted >= 0
        C[mask] += one_compartment(t_shifted[mask], dose, ka, ke, Vd)
    return C

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Single dose pharmacokinetics
ax = axes[0, 0]
ax.set_facecolor('#111827')
t = np.linspace(0, 24, 500)
dose = 200  # mg
Vd = 50     # L (volume of distribution)
compounds = [
    ('Quinine-like alkaloid', 1.5, 0.08, '#ef4444'),   # ka=1.5/h, ke=0.08/h (t½=8.7h)
    ('Curcumin analog', 2.0, 0.35, '#f59e0b'),         # rapid elimination (t½=2h)
    ('Artemisinin-like', 1.0, 0.17, '#22c55e'),         # t½=4h
    ('Resveratrol type', 3.0, 0.46, '#3b82f6'),         # very rapid elimination (t½=1.5h)
]
for name, ka, ke, color in compounds:
    C = one_compartment(t, dose, ka, ke, Vd)
    t_half = 0.693 / ke
    ax.plot(t, C, color=color, linewidth=2, label=f'{name} (t½={t_half:.1f}h)')
ax.axhline(2, color='gray', linestyle=':', linewidth=0.5)
ax.text(20, 2.2, 'MEC (minimum effective)', color='gray', fontsize=8)
ax.axhline(8, color='gray', linestyle=':', linewidth=0.5)
ax.text(20, 8.2, 'Toxic threshold', color='gray', fontsize=8)
ax.fill_between(t, 2, 8, alpha=0.05, color='#22c55e')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Plasma concentration (mg/L)', color='white')
ax.set_title('Single Dose Pharmacokinetics', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Multiple dosing regimen
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
t_long = np.linspace(0, 72, 1000)
ka, ke = 1.0, 0.17  # Artemisinin-like
intervals = [4, 6, 8, 12]
for interval, color in zip(intervals, ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']):
    C_multi = multiple_doses(t_long, dose, interval, ka, ke, Vd, n_doses=20)
    ax2.plot(t_long, C_multi, color=color, linewidth=1.5,
             label=f'Every {interval}h', alpha=0.8)
ax2.axhline(2, color='gray', linestyle=':', linewidth=0.5)
ax2.axhline(8, color='gray', linestyle=':', linewidth=0.5)
ax2.fill_between(t_long, 2, 8, alpha=0.05, color='#22c55e')
ax2.set_xlabel('Time (hours)', color='white')
ax2.set_ylabel('Plasma concentration (mg/L)', color='white')
ax2.set_title('Multiple Dosing Regimens', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Lipinski's Rule of Five visualization
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
n_compounds = 100
MW = np.random.uniform(100, 800, n_compounds)
logP = np.random.uniform(-2, 8, n_compounds)
# Oral bioavailability correlates with Lipinski compliance
lipinski_score = np.zeros(n_compounds)
lipinski_score += (MW < 500).astype(float)
lipinski_score += (logP < 5).astype(float)
lipinski_score += (np.random.randint(0, 8, n_compounds) < 5).astype(float)  # HBD proxy
lipinski_score += (np.random.randint(0, 14, n_compounds) < 10).astype(float)  # HBA proxy
bioavailability = 0.2 * lipinski_score + np.random.normal(0, 0.15, n_compounds)
bioavailability = np.clip(bioavailability, 0, 1)

scatter3 = ax3.scatter(MW, logP, c=bioavailability, cmap='RdYlGn', s=40, alpha=0.7,
                       edgecolors='white', linewidths=0.3)
cbar3 = plt.colorbar(scatter3, ax=ax3)
cbar3.set_label('Oral bioavailability', color='white')
cbar3.ax.tick_params(colors='gray')
ax3.axvline(500, color='#fbbf24', linestyle='--', linewidth=1.5)
ax3.axhline(5, color='#fbbf24', linestyle='--', linewidth=1.5)
ax3.fill_between([0, 500], -2, 5, alpha=0.1, color='#22c55e')
ax3.text(250, 4, 'Lipinski\\\nfavorable', color='#22c55e', fontsize=10, ha='center', fontweight='bold')
ax3.text(650, 6.5, 'Lipinski\\\nviolation', color='#ef4444', fontsize=10, ha='center', fontweight='bold')
ax3.set_xlabel('Molecular weight (Da)', color='white')
ax3.set_ylabel('logP (lipophilicity)', color='white')
ax3.set_title("Lipinski's Rule of Five", color='white', fontsize=12, fontweight='bold')
ax3.tick_params(colors='gray')
ax3.set_xlim(50, 850)

# Plot 4: Metabolism - CYP enzyme kinetics
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Michaelis-Menten kinetics for CYP450
substrate_conc = np.linspace(0, 100, 200)  # μM
enzymes = [
    ('CYP3A4 (most drugs)', 15, 50, '#3b82f6'),
    ('CYP2D6 (alkaloids)', 8, 30, '#ef4444'),
    ('CYP1A2 (phenolics)', 25, 40, '#22c55e'),
    ('CYP2C9 (terpenoids)', 12, 35, '#f59e0b'),
]
for name, Km, Vmax, color in enzymes:
    rate = Vmax * substrate_conc / (Km + substrate_conc)
    ax4.plot(substrate_conc, rate, color=color, linewidth=2, label=name)
    ax4.plot(Km, Vmax/2, 'o', color=color, markersize=6)
    ax4.plot([Km, Km], [0, Vmax/2], ':', color=color, linewidth=0.5)
ax4.set_xlabel('Substrate concentration (μM)', color='white')
ax4.set_ylabel('Metabolic rate (μM/min)', color='white')
ax4.set_title('CYP450 Enzyme Kinetics (Michaelis-Menten)', color='white', fontsize=11, fontweight='bold')
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    PHARMACOKINETICS OF PLANT COMPOUNDS")
print("=" * 60)
for name, ka, ke, _ in compounds:
    t_half = 0.693 / ke
    t_max = np.log(ka/ke) / (ka - ke)
    C_max = one_compartment(t_max, dose, ka, ke, Vd)
    print(f"\\\n{name}:")
    print(f"  Half-life: {t_half:.1f} h")
    print(f"  Time to peak: {t_max:.1f} h")
    print(f"  Peak concentration: {C_max:.1f} mg/L")
    in_window = t_half * 3  # rough therapeutic window duration
    print(f"  Approx time in therapeutic window: {in_window:.0f} h")`,
      challenge: 'Model drug-drug interactions: when two plant compounds compete for the same CYP enzyme, the slower-metabolized one effectively increases the plasma levels of the other. Simulate this competitive inhibition and show how combining two traditional remedies can be dangerous.',
      successHint: 'You have modeled how plant chemicals behave in the human body — ADME determines whether a traditional remedy actually works, and pharmacokinetics explains why dosing frequency and preparation method matter.',
    },
    {
      title: 'Drug discovery pipeline — from ethnobotany to clinical trials',
      concept: `Modern drug discovery from plants follows a systematic pipeline: (1) Ethnobotanical survey — document traditional uses from knowledge holders, recording plant species, parts used, preparation methods, and ailments treated. (2) Extraction and fractionation — prepare crude extracts and separate them into fractions using chromatography. (3) Bioassay-guided isolation — test each fraction for biological activity and further purify active fractions until you isolate the single active compound. (4) Structure elucidation — determine the molecular structure using NMR, mass spectrometry, and X-ray crystallography. (5) Activity optimization — modify the molecule (SAR studies) to improve potency and reduce side effects. (6) Preclinical testing — animal models for safety and efficacy. (7) Clinical trials — Phase I (safety, 20-80 people), Phase II (efficacy, 100-300), Phase III (confirmation, 1000-3000).

The hit rate from ethnobotanical leads is remarkably high: ~75% of plant species used in traditional medicine show some biological activity in lab tests, compared to ~5% for random screening. This validates the empirical knowledge accumulated over centuries. However, the journey from active extract to approved drug takes 10-15 years and costs $1-2 billion. Only about 1 in 10,000 compounds entering preclinical testing becomes an approved drug.

Notable drugs from plants include: aspirin (willow bark), morphine (opium poppy), quinine (cinchona bark), artemisinin (sweet wormwood), taxol (Pacific yew), vincristine (periwinkle), and digitoxin (foxglove). About 25% of modern drugs are derived from or inspired by plant compounds.`,
      analogy: 'Drug discovery from traditional medicine is like translating an ancient poem into modern language. The poem (traditional knowledge) is beautiful and meaningful, but to share it with the world, you need to identify the key words (active compounds), understand the grammar (mechanism of action), and rewrite it in modern language (pharmaceutical formulation). The translation process is long and expensive, but the original poem tells you exactly where to look — which is why ethnobotanical leads are 15x more productive than random searching.',
      storyConnection: 'The witch doctor\'s knowledge is the first step in the drug discovery pipeline — the ethnobotanical survey. Every plant the witch doctor uses for a specific ailment is a potential drug lead. Modern pharmaceutical research has validated many such leads: the witch doctor who uses neem for infections aligns with neem\'s proven antimicrobial properties; the one who uses turmeric for inflammation aligns with curcumin\'s anti-inflammatory mechanism.',
      checkQuestion: 'An ethnobotanical survey in Meghalaya documents 200 plants used in traditional medicine. Based on typical hit rates, how many would show lab activity? If you pursue the 10 most promising leads through the full pipeline, how many drugs might you ultimately produce?',
      checkAnswer: '75% hit rate: 200 × 0.75 = 150 plants would show some biological activity in lab assays. Of 10 leads pursued further, the 1-in-10,000 preclinical-to-approval rate is for random compounds — ethnobotanical leads have better odds, roughly 1 in 1,000. But most attrition occurs in clinical trials. Realistically: 10 leads → maybe 5 survive preclinical → 2-3 enter clinical trials → statistically, 0-1 might become an approved drug. The process takes 15+ years. But even partial successes (compounds that inform new drug designs) have enormous value.',
      codeIntro: 'Simulate the drug discovery pipeline from ethnobotanical survey through clinical trials, modeling the attrition rates and timelines at each stage.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Drug discovery pipeline simulation
pipeline_stages = [
    'Ethnobotanical\\\nsurvey', 'Crude\\\nextract', 'Bioassay\\\nscreening',
    'Active\\\nfraction', 'Pure\\\ncompound', 'Preclinical',
    'Phase I', 'Phase II', 'Phase III', 'Approved\\\ndrug'
]
# Survival rates at each stage
survival_rates = [1.0, 0.90, 0.75, 0.40, 0.25, 0.15, 0.08, 0.04, 0.02, 0.01]
n_initial = 500  # plants surveyed
survivors = [int(n_initial * r) for r in survival_rates]
# Time at each stage (cumulative years)
stage_times = [0, 0.5, 1.5, 3, 4, 6, 8, 10, 13, 15]

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Pipeline funnel
ax = axes[0, 0]
ax.set_facecolor('#111827')
colors_pipeline = plt.cm.RdYlGn(np.linspace(0.2, 0.9, len(pipeline_stages)))
bars = ax.barh(range(len(pipeline_stages)), survivors, color=colors_pipeline,
               edgecolor='white', linewidth=0.5)
for i, (bar, count, stage) in enumerate(zip(bars, survivors, pipeline_stages)):
    ax.text(count + 5, bar.get_y() + bar.get_height()/2,
            f'{count}', va='center', color='white', fontsize=10, fontweight='bold')
ax.set_yticks(range(len(pipeline_stages)))
ax.set_yticklabels(pipeline_stages, fontsize=8)
ax.set_xlabel('Number of candidates remaining', color='white')
ax.set_title(f'Drug Discovery Funnel (from {n_initial} plants)', color='white', fontsize=12, fontweight='bold')
ax.invert_yaxis()
ax.tick_params(colors='gray')

# Plot 2: Time and cost at each stage
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
stage_costs = [0.1, 0.2, 0.5, 1, 2, 10, 50, 100, 300, 500]  # millions USD
cumulative_cost = np.cumsum(stage_costs)
ax2.plot(stage_times, cumulative_cost, 'o-', color='#ef4444', linewidth=2, markersize=8)
for i, (t, c) in enumerate(zip(stage_times, cumulative_cost)):
    ax2.annotate(f'\{c:.0f}M', (t, c), textcoords='offset points',
                 xytext=(5, 10), color='#ef4444', fontsize=7)
ax2_twin = ax2.twinx()
ax2_twin.plot(stage_times, survivors, 's-', color='#3b82f6', linewidth=2, markersize=8)
ax2.set_xlabel('Years', color='white')
ax2.set_ylabel('Cumulative cost ($M)', color='#ef4444')
ax2_twin.set_ylabel('Candidates remaining', color='#3b82f6')
ax2.set_title('Pipeline: Cost vs Attrition Over Time', color='white', fontsize=12, fontweight='bold')
ax2.tick_params(axis='y', colors='#ef4444')
ax2_twin.tick_params(axis='y', colors='#3b82f6')
ax2.tick_params(axis='x', colors='gray')

# Plot 3: Ethnobotanical vs random screening
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
categories = ['All plants\\\nscreened', 'Show lab\\\nactivity', 'Potent\\\nhits', 'Drug-like\\\n(Lipinski)', 'Lead\\\ncompound']
ethno_rates = [100, 75, 30, 20, 10]
random_rates = [100, 5, 1, 0.5, 0.1]
x = np.arange(len(categories))
width = 0.35
ax3.bar(x - width/2, ethno_rates, width, color='#22c55e', alpha=0.8,
        label='Ethnobotanical leads', edgecolor='white', linewidth=0.5)
ax3.bar(x + width/2, random_rates, width, color='#ef4444', alpha=0.8,
        label='Random screening', edgecolor='white', linewidth=0.5)
ax3.set_xticks(x)
ax3.set_xticklabels(categories, fontsize=8)
ax3.set_ylabel('% of initial candidates', color='white')
ax3.set_title('Ethnobotanical vs Random Screening', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')
ax3.set_yscale('log')

# Plot 4: Success stories - drugs from plants
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
drugs = ['Aspirin', 'Morphine', 'Quinine', 'Artemisinin', 'Taxol',
         'Vincristine', 'Digitoxin', 'Pilocarpine', 'Galantamine', 'Capsaicin']
years_discovered = [1897, 1804, 1820, 1972, 1971, 1958, 1930, 1875, 1950, 1816]
annual_revenue = [3.0, 1.5, 0.8, 2.5, 3.5, 1.2, 0.5, 0.3, 1.8, 0.4]  # billions USD
colors_d = plt.cm.Set3(np.linspace(0, 1, len(drugs)))
bars = ax4.barh(drugs, annual_revenue, color=colors_d, alpha=0.8,
                edgecolor='white', linewidth=0.5)
for bar, year in zip(bars, years_discovered):
    ax4.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height()/2,
             f'({year})', va='center', color='gray', fontsize=8)
ax4.set_xlabel('Annual revenue ($B)', color='white')
ax4.set_title('Plant-Derived Drugs: Revenue & Discovery Year', color='white', fontsize=11, fontweight='bold')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    DRUG DISCOVERY PIPELINE ANALYSIS")
print("=" * 60)
print(f"\\\nStarting with {n_initial} ethnobotanical leads:")
for stage, count, time, cost in zip(pipeline_stages, survivors, stage_times, cumulative_cost):
    stage_clean = stage.replace('\\\n', ' ')
    print(f"  {stage_clean:<22} {count:>4} candidates  ({time:.0f} yr, \{cost:.0f}M)")
print(f"\\\nEthnobotanical advantage: {75/5:.0f}x higher hit rate than random screening")
print(f"Total cost to bring one drug to market: ~\{cumulative_cost[-1]:.0f}M")
print(f"Total timeline: ~{stage_times[-1]:.0f} years")`,
      challenge: 'Simulate a Monte Carlo drug discovery campaign: run 1000 simulations of the pipeline with stochastic survival at each stage. Report the probability distribution of final successful drugs and the expected return on investment.',
      successHint: 'You have modeled the complete drug discovery pipeline — from the witch doctor\'s field knowledge to approved medicines. The high hit rate from ethnobotanical leads validates traditional knowledge as a scientifically valuable resource.',
    },
    {
      title: 'Molecular docking — how drugs bind to protein targets',
      concept: `When a drug molecule reaches its target protein, it must bind to a specific pocket (the active site) to exert its effect. Molecular docking is a computational method that predicts how a small molecule fits into a protein binding site. The binding affinity depends on complementarity of shape, electrostatic interactions, hydrogen bonds, and hydrophobic contacts.

The scoring function estimates binding free energy: ΔG_bind = ΔG_vdW + ΔG_elec + ΔG_hbond + ΔG_desolv + ΔG_entropy. Van der Waals (ΔG_vdW) rewards close atomic contacts. Electrostatic (ΔG_elec) rewards opposite charges near each other. Hydrogen bonds (ΔG_hbond) reward donor-acceptor pairs at proper geometry. Desolvation (ΔG_desolv) penalizes burying polar groups without compensation. Entropy (ΔG_entropy) penalizes rigid binding that reduces molecular freedom.

The binding constant relates to free energy: K_d = e^(ΔG/RT), where lower K_d means tighter binding. A typical drug has K_d in the nanomolar range (10⁻⁹ M). For reference: a K_d of 1 nM means the drug occupies 50% of targets when its concentration is just 1 billionth of a mole per liter — an extraordinarily tight fit.

Structure-activity relationships (SAR) map how chemical modifications affect binding. Adding a methyl group might improve hydrophobic contacts (+0.5 kcal/mol); adding a hydroxyl might create a new hydrogen bond (-1.5 kcal/mol). Medicinal chemists use SAR to systematically optimize lead compounds.`,
      analogy: 'Molecular docking is like trying keys in a lock. The protein binding site is the lock, and drug molecules are keys. A good key (low ΔG) fits snugly: the teeth (molecular shape) match the tumblers (binding pocket), the metal contacts the pins (electrostatic interactions), and the key stays in without jiggling (low entropy penalty). You can improve a bad key by filing the teeth (chemical modification) until it fits — this is SAR optimization.',
      storyConnection: 'The witch doctor selects specific plants for specific ailments because each plant\'s chemistry matches specific biological targets. Quinine from cinchona bark docks into the heme pocket of the malaria parasite\'s hemozoin crystal — a molecular key that fits a parasitic lock. Understanding docking explains why the witch doctor\'s remedies work at the molecular level.',
      checkQuestion: 'A plant compound docks into an enzyme\'s active site with ΔG = -8.5 kcal/mol at 37°C. Calculate K_d. If you add a hydroxyl group that creates a new H-bond (ΔG_hbond = -1.5 kcal/mol) but increases desolvation penalty by +0.8 kcal/mol, what is the new K_d?',
      checkAnswer: 'At 37°C (310K), K_d = e^(ΔG/(RT)) = e^(-8500/(1.987×310)) = e^(-13.80) = 1.01 × 10⁻⁶ M = 1.01 μM. Net effect of hydroxyl: -1.5 + 0.8 = -0.7 kcal/mol improvement. New ΔG = -8.5 - 0.7 = -9.2 kcal/mol. New K_d = e^(-9200/(1.987×310)) = e^(-14.94) = 3.26 × 10⁻⁷ M = 326 nM. The modification improved binding 3.1-fold — a meaningful improvement in drug design. The hydroxyl is worth adding despite the desolvation cost.',
      codeIntro: 'Build a simplified molecular docking simulation that scores binding poses and maps structure-activity relationships.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simplified molecular docking model
R_gas = 1.987e-3  # kcal/(mol·K)
T = 310  # K (37°C)

def binding_free_energy(shape_score, elec_score, hbond_count, hydrophobic_area, flexibility):
    """Estimate binding free energy (kcal/mol)."""
    dG_shape = -0.5 * shape_score      # van der Waals complementarity (0-10 scale)
    dG_elec = -0.8 * elec_score        # electrostatic (0-5 scale)
    dG_hbond = -1.5 * hbond_count      # hydrogen bonds
    dG_hydrophobic = -0.03 * hydrophobic_area  # Å² of hydrophobic contact
    dG_entropy = 0.5 * flexibility      # conformational entropy penalty (0-5 scale)
    return dG_shape + dG_elec + dG_hbond + dG_hydrophobic + dG_entropy

def dG_to_Kd(dG, T=310):
    """Convert binding free energy to dissociation constant."""
    return np.exp(dG / (R_gas * T))

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Binding energy components
ax = axes[0, 0]
ax.set_facecolor('#111827')
# Reference compound
components = {
    'Shape (vdW)': -3.5,
    'Electrostatic': -2.4,
    'H-bonds (3×)': -4.5,
    'Hydrophobic': -2.1,
    'Entropy penalty': +1.8,
}
names = list(components.keys())
values = list(components.values())
total = sum(values)
colors_c = ['#3b82f6' if v < 0 else '#ef4444' for v in values]
bars = ax.barh(names, values, color=colors_c, alpha=0.8, edgecolor='white', linewidth=0.5)
ax.axvline(0, color='white', linewidth=0.5)
ax.axvline(total, color='#fbbf24', linewidth=2, linestyle='--')
ax.text(total - 0.3, len(names), f'Total: {total:.1f} kcal/mol\\\nKd = {dG_to_Kd(total)*1e6:.1f} μM',
        color='#fbbf24', fontsize=10, fontweight='bold', va='bottom')
for bar, val in zip(bars, values):
    pos = val - 0.3 if val < 0 else val + 0.1
    ax.text(pos, bar.get_y() + bar.get_height()/2,
            f'{val:+.1f}', va='center', color='white', fontsize=9)
ax.set_xlabel('Free energy contribution (kcal/mol)', color='white')
ax.set_title('Binding Energy Decomposition', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='gray')

# Plot 2: SAR - systematic modification effects
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
base_dG = -8.5
modifications = [
    ('Base compound', 0),
    ('+ Methyl (hydrophobic)', -0.5),
    ('+ Hydroxyl (H-bond)', -1.2),
    ('+ Fluorine (elec)', -0.8),
    ('+ Amine (charge)', -1.5),
    ('- Rotatable bond', -0.6),
    ('+ Bulky group (clash)', +2.0),
    ('+ Polar (desolv)', +0.8),
]
mod_names = [m[0] for m in modifications]
mod_dG = [base_dG + m[1] for m in modifications]
mod_Kd = [dG_to_Kd(dg) * 1e6 for dg in mod_dG]  # μM

colors_sar = ['#fbbf24'] + ['#22c55e' if m[1] < 0 else '#ef4444' for m in modifications[1:]]
bars2 = ax2.barh(mod_names, mod_Kd, color=colors_sar, alpha=0.8,
                 edgecolor='white', linewidth=0.5)
for bar, kd, dg in zip(bars2, mod_Kd, mod_dG):
    ax2.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height()/2,
             f'{kd:.2f} μM ({dg:.1f})', va='center', color='white', fontsize=8)
ax2.set_xlabel('Kd (μM) — lower is better', color='white')
ax2.set_title('Structure-Activity Relationships (SAR)', color='white', fontsize=12, fontweight='bold')
ax2.tick_params(colors='gray')

# Plot 3: Docking score landscape
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# 2D energy landscape: shape complementarity vs electrostatic score
shape_range = np.linspace(0, 10, 100)
elec_range = np.linspace(0, 5, 100)
S, E = np.meshgrid(shape_range, elec_range)
dG_landscape = binding_free_energy(S, E, 2, 80, 2)  # fixed hbonds, hydrophobic, flexibility
Kd_landscape = dG_to_Kd(dG_landscape)

contour = ax3.contourf(S, E, np.log10(Kd_landscape), levels=20, cmap='RdYlGn_r')
cbar = plt.colorbar(contour, ax=ax3)
cbar.set_label('log₁₀(Kd) — lower is tighter', color='white')
cbar.ax.tick_params(colors='gray')
# Mark typical drug zone
ax3.contour(S, E, np.log10(Kd_landscape), levels=[-6], colors=['white'], linewidths=2)
ax3.text(7, 3.5, 'Kd < 1 μM\\\n(drug-like)', color='white', fontsize=10, fontweight='bold')
ax3.set_xlabel('Shape complementarity score', color='white')
ax3.set_ylabel('Electrostatic score', color='white')
ax3.set_title('Binding Affinity Landscape', color='white', fontsize=12, fontweight='bold')
ax3.tick_params(colors='gray')

# Plot 4: Virtual screening results
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
n_compounds_screen = 500
# Simulate virtual screening
screen_dG = np.random.normal(-5, 2, n_compounds_screen)
# Ethnobotanical compounds (enriched)
n_ethno = 50
ethno_dG = np.random.normal(-7, 1.5, n_ethno)

ax4.hist(screen_dG, bins=40, alpha=0.6, color='#3b82f6', density=True,
         label=f'Random library (n={n_compounds_screen})')
ax4.hist(ethno_dG, bins=20, alpha=0.6, color='#22c55e', density=True,
         label=f'Ethnobotanical (n={n_ethno})')
ax4.axvline(-8, color='#fbbf24', linestyle='--', linewidth=1.5,
            label='Hit threshold (ΔG < -8)')
hit_rate_random = np.mean(screen_dG < -8)
hit_rate_ethno = np.mean(ethno_dG < -8)
ax4.text(-11, 0.3, f'Random hits: {hit_rate_random:.0%}', color='#3b82f6', fontsize=10)
ax4.text(-11, 0.25, f'Ethno hits: {hit_rate_ethno:.0%}', color='#22c55e', fontsize=10)
ax4.set_xlabel('Predicted ΔG (kcal/mol)', color='white')
ax4.set_ylabel('Probability density', color='white')
ax4.set_title('Virtual Screening: Random vs Ethnobotanical', color='white', fontsize=11, fontweight='bold')
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    MOLECULAR DOCKING ANALYSIS")
print("=" * 60)
print(f"\\\nReference compound: ΔG = {total:.1f} kcal/mol, Kd = {dG_to_Kd(total)*1e6:.2f} μM")
print(f"\\\nSAR modifications:")
for name, delta in modifications[1:]:
    new_dG = base_dG + delta
    new_Kd = dG_to_Kd(new_dG) * 1e6
    fold_change = dG_to_Kd(base_dG) / dG_to_Kd(new_dG)
    direction = "improved" if delta < 0 else "worsened"
    print(f"  {name:<25}: {delta:+.1f} kcal/mol → Kd = {new_Kd:.2f} μM ({fold_change:.1f}x {direction})")
print(f"\\\nVirtual screening hit rates:")
print(f"  Random library: {hit_rate_random:.0%}")
print(f"  Ethnobotanical: {hit_rate_ethno:.0%}")
print(f"  Enrichment factor: {hit_rate_ethno/max(hit_rate_random,0.001):.1f}x")`,
      challenge: 'Implement a genetic algorithm for lead optimization: start with the base compound, randomly mutate chemical features, keep mutations that improve binding, and track how the compound evolves toward optimal binding affinity over generations.',
      successHint: 'You have modeled how drugs interact with their protein targets at the atomic level — the molecular explanation for why the witch doctor\'s plant remedies work. Docking explains the mechanism behind traditional medicine.',
    },
    {
      title: 'Dose-response relationships — quantifying therapeutic effects',
      concept: `The dose-response curve is the fundamental relationship in pharmacology. It describes how the magnitude of a biological response changes with drug concentration. For most drugs, this follows the Hill equation: E = E_max × C^n / (EC₅₀^n + C^n), where E_max is the maximum effect, C is concentration, EC₅₀ is the concentration producing 50% of maximum effect, and n is the Hill coefficient (steepness of the curve).

The therapeutic index (TI) quantifies drug safety: TI = TD₅₀/ED₅₀, where TD₅₀ is the dose that is toxic to 50% of subjects and ED₅₀ is the dose effective in 50% of subjects. A wide therapeutic index (TI > 10) means the drug is safe over a wide dose range. A narrow TI (< 3) means the effective dose is dangerously close to the toxic dose — careful dosing is essential.

For plant medicines, dose-response is complex because crude extracts contain multiple active compounds that may have synergistic, additive, or antagonistic interactions. Synergy means the combined effect exceeds the sum of individual effects (1+1 > 2). This is quantified by the combination index (CI): CI < 1 indicates synergy, CI = 1 is additive, CI > 1 is antagonism. Many traditional remedies rely on synergy between multiple phytochemicals — using the whole extract is more effective than any single compound.`,
      analogy: 'The dose-response curve is like a volume knob on a radio. Turning from 0, nothing happens at first (sub-threshold). Then the sound increases rapidly (steep part of the curve). Eventually, the speaker is at maximum and turning further does not help (E_max). The therapeutic index is the range between "loud enough to hear" (effective dose) and "so loud it damages your ears" (toxic dose). A wide range is safe; a narrow range means you must set the volume precisely.',
      storyConnection: 'The witch doctor prescribes specific amounts of each plant medicine — "three leaves of this, a pinch of that bark." These dosing instructions encode dose-response knowledge accumulated over generations. Too little is ineffective; too much is dangerous. The witch doctor\'s dosing precision for plants with narrow therapeutic indices (like digitalis-containing plants) represents empirical pharmacology of remarkable sophistication.',
      checkQuestion: 'Herb A alone has EC₅₀ = 100 μg/mL and E_max = 80%. Herb B alone has EC₅₀ = 50 μg/mL and E_max = 60%. When combined at 50 μg/mL each, the observed effect is 90%. Is this synergistic, additive, or antagonistic?',
      checkAnswer: 'At 50 μg/mL, Herb A alone: E = 80 × 50/(100+50) = 26.7%. Herb B alone: E = 60 × 50/(50+50) = 30%. If additive, expected combined effect ≈ 26.7 + 30 - (26.7×30/100) = 48.7% (using Bliss independence model). Observed effect = 90%, which is much higher than 48.7%. This is clear synergy — the two herbs together produce an effect 1.85x greater than predicted by simple addition. This explains why the witch doctor combines specific herbs: the combination works better than either herb alone.',
      codeIntro: 'Model dose-response relationships, therapeutic indices, and drug synergy to understand why traditional medicine often uses combinations of plants.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def hill_equation(C, Emax, EC50, n=1):
    """Hill equation for dose-response."""
    return Emax * C**n / (EC50**n + C**n)

def therapeutic_index(ED50, TD50):
    return TD50 / ED50

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Dose-response curves with different Hill coefficients
ax = axes[0, 0]
ax.set_facecolor('#111827')
concentrations = np.logspace(-2, 4, 500)
for n, color, label in [(0.5, '#3b82f6', 'n=0.5 (gradual)'),
                         (1.0, '#22c55e', 'n=1.0 (standard)'),
                         (2.0, '#f59e0b', 'n=2.0 (cooperative)'),
                         (4.0, '#ef4444', 'n=4.0 (switch-like)')]:
    effect = hill_equation(concentrations, 100, 100, n)
    ax.semilogx(concentrations, effect, color=color, linewidth=2, label=label)
ax.axhline(50, color='gray', linestyle=':', linewidth=0.5)
ax.axvline(100, color='gray', linestyle=':', linewidth=0.5)
ax.text(110, 52, 'EC₅₀', color='gray', fontsize=9)
ax.set_xlabel('Concentration (μg/mL)', color='white')
ax.set_ylabel('Effect (%)', color='white')
ax.set_title('Dose-Response: Hill Coefficient Effect', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Therapeutic index comparison
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
dose_range = np.logspace(-1, 4, 500)
drugs = [
    ('Aspirin (plant-derived)', 500, 5000, '#22c55e'),   # TI = 10
    ('Digoxin (foxglove)', 1.5, 3, '#ef4444'),            # TI = 2
    ('Quinine (cinchona)', 300, 1500, '#f59e0b'),         # TI = 5
    ('Morphine (poppy)', 10, 50, '#3b82f6'),              # TI = 5
]
for name, ED50, TD50, color in drugs:
    efficacy = hill_equation(dose_range, 100, ED50, 1.5)
    toxicity = hill_equation(dose_range, 100, TD50, 2)
    ax2.semilogx(dose_range, efficacy, color=color, linewidth=2, label=f'{name} (TI={TD50/ED50:.0f})')
    ax2.semilogx(dose_range, toxicity, color=color, linewidth=1.5, linestyle='--', alpha=0.5)
    # Shade therapeutic window
    window = (dose_range > ED50 * 0.5) & (dose_range < TD50 * 0.5)
    ax2.fill_between(dose_range, 0, 100, where=window, alpha=0.05, color=color)
ax2.set_xlabel('Dose', color='white')
ax2.set_ylabel('Response (%)', color='white')
ax2.set_title('Therapeutic Index: Efficacy (solid) vs Toxicity (dashed)', color='white', fontsize=10, fontweight='bold')
ax2.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Drug synergy analysis
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Isobologram
# Herb A: EC50 = 100, Herb B: EC50 = 50
EC50_A = 100
EC50_B = 50
# Additive line
ax3.plot([EC50_A, 0], [0, EC50_B], '--', color='gray', linewidth=1.5, label='Additive (CI=1)')
# Synergistic combinations
n_combos = 20
frac_A = np.random.uniform(0.1, 0.9, n_combos)
# Synergistic: less of each needed
synergy_factor = np.random.uniform(0.3, 0.7, n_combos)
combo_A = frac_A * EC50_A * synergy_factor
combo_B = (1 - frac_A) * EC50_B * synergy_factor
ax3.scatter(combo_A, combo_B, c='#22c55e', s=50, alpha=0.7, label='Synergistic combos',
            edgecolors='white', linewidths=0.5)
# Antagonistic combinations
antag_factor = np.random.uniform(1.3, 1.8, 10)
combo_A_ant = frac_A[:10] * EC50_A * antag_factor
combo_B_ant = (1 - frac_A[:10]) * EC50_B * antag_factor
ax3.scatter(combo_A_ant, combo_B_ant, c='#ef4444', s=50, alpha=0.7, label='Antagonistic',
            edgecolors='white', linewidths=0.5)
ax3.set_xlabel('Herb A dose (μg/mL)', color='white')
ax3.set_ylabel('Herb B dose (μg/mL)', color='white')
ax3.set_title('Isobologram: Drug Synergy Analysis', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')
ax3.text(30, 35, 'SYNERGY\\\n(below line)', color='#22c55e', fontsize=11, fontweight='bold')
ax3.text(70, 45, 'ANTAGONISM\\\n(above line)', color='#ef4444', fontsize=11, fontweight='bold')

# Plot 4: Multi-component traditional remedy
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
conc = np.logspace(-1, 4, 500)
# Individual herbs
herb_A = hill_equation(conc, 60, 200, 1.2)
herb_B = hill_equation(conc, 50, 100, 1.0)
herb_C = hill_equation(conc, 40, 150, 0.8)
# Additive prediction
additive = np.minimum(100, herb_A + herb_B + herb_C - herb_A*herb_B/100 - herb_B*herb_C/100)
# Synergistic actual (traditional combination)
synergistic = hill_equation(conc, 95, 80, 1.5)

ax4.semilogx(conc, herb_A, color='#ef4444', linewidth=1.5, linestyle='--', label='Herb A alone', alpha=0.7)
ax4.semilogx(conc, herb_B, color='#3b82f6', linewidth=1.5, linestyle='--', label='Herb B alone', alpha=0.7)
ax4.semilogx(conc, herb_C, color='#22c55e', linewidth=1.5, linestyle='--', label='Herb C alone', alpha=0.7)
ax4.semilogx(conc, additive, color='#f59e0b', linewidth=2, linestyle=':', label='Predicted (additive)')
ax4.semilogx(conc, synergistic, color='#a855f7', linewidth=3, label='Traditional combo (actual)')
ax4.fill_between(conc, additive, synergistic, where=synergistic > additive,
                  alpha=0.15, color='#a855f7', label='Synergy bonus')
ax4.set_xlabel('Total extract concentration (μg/mL)', color='white')
ax4.set_ylabel('Therapeutic effect (%)', color='white')
ax4.set_title('Traditional Combination: Synergy in Action', color='white', fontsize=11, fontweight='bold')
ax4.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    DOSE-RESPONSE & SYNERGY ANALYSIS")
print("=" * 60)
print(f"\\\nTherapeutic indices:")
for name, ED50, TD50, _ in drugs:
    ti = TD50 / ED50
    safety = "SAFE" if ti > 5 else "CAUTION" if ti > 2 else "DANGEROUS"
    print(f"  {name:<25}: TI = {ti:.1f} ({safety})")
print(f"\\\nSynergy analysis (traditional combination):")
print(f"  Individual herbs at EC50: {herb_A[250]:.0f}% + {herb_B[250]:.0f}% + {herb_C[250]:.0f}%")
print(f"  Predicted additive: {additive[250]:.0f}%")
print(f"  Actual combination: {synergistic[250]:.0f}%")
print(f"  Synergy bonus: +{synergistic[250] - additive[250]:.0f}%")
print(f"\\\nThis explains why traditional herbalists combine multiple plants —")
print(f"the synergy between compounds produces effects greater than any single herb.")`,
      challenge: 'Implement the Chou-Talalay combination index (CI) method: for each combination ratio, calculate CI using the median-effect equation. Generate a CI-Fa (combination index vs fraction affected) plot showing how synergy varies with effect level.',
      successHint: 'You have quantified the pharmacology behind traditional medicine — dose-response curves explain why dosing matters, therapeutic indices explain safety margins, and synergy analysis explains why the witch doctor combines multiple plants.',
    },
    {
      title: 'Ethnobotanical databases — building a knowledge graph',
      concept: `Ethnobotanical knowledge is traditionally transmitted orally and risks being lost as indigenous knowledge holders age. Building structured databases that link plants, compounds, uses, and evidence preserves this knowledge and enables computational analysis. A knowledge graph represents entities (plants, compounds, diseases, proteins) as nodes and relationships (contains, treats, binds_to, found_in) as edges.

Key database schemas include: PLANT → has_compound → COMPOUND → has_property → PROPERTY; PLANT → used_for → DISEASE; COMPOUND → binds_to → TARGET → involved_in → DISEASE. This graph structure enables inference: if Plant A and Plant B share three compounds and Plant A treats Disease X, then Plant B is a candidate for Disease X (guilt by association).

Network analysis metrics identify important nodes: degree centrality (most connections), betweenness centrality (bridges between clusters), and PageRank (connected to other important nodes). A compound with high betweenness centrality in the plant-disease network might be a broadly useful medicine. A plant with high degree centrality contains many active compounds and likely has multiple therapeutic uses — these are the "pharmacopeia stars" that traditional healers use most frequently.

The integration of ethnobotanical data with chemical informatics and genomic data creates a powerful research platform. Machine learning on this integrated graph can predict new drug-target interactions, identify plants worth investigating, and prioritize compounds for laboratory testing.`,
      analogy: 'A knowledge graph of medicinal plants is like a subway map of a city. Plants are stations, compounds are the subway lines connecting them, and diseases are the destinations. If you know that two stations (plants) share a subway line (compound), and one station connects to your destination (disease), then the other station likely has a route to that destination too. The most important stations (highest betweenness centrality) are transfer hubs where many lines cross — these are the most medicinally versatile plants.',
      storyConnection: 'The witch doctor carries the knowledge graph in memory — knowing which plants share properties, which combinations work together, and which ailments respond to which preparations. Building a digital version of this knowledge graph preserves the witch doctor\'s wisdom and makes it accessible to researchers worldwide, ensuring that decades of empirical knowledge are not lost.',
      checkQuestion: 'In a knowledge graph, Plant A connects to 5 compounds, Plant B to 3 compounds, and they share 2 compounds. Plant A is used for malaria and inflammation. If shared compounds explain therapeutic activity, what can you predict about Plant B? What is the Jaccard similarity between their compound profiles?',
      checkAnswer: 'If the 2 shared compounds are responsible for Plant A\'s therapeutic effects, then Plant B likely also treats malaria and inflammation (via those same compounds). Plant B\'s 1 unique compound might have additional, unknown therapeutic effects worth investigating. Jaccard similarity = |A ∩ B| / |A ∪ B| = 2 / (5 + 3 - 2) = 2/6 = 0.333. This moderate similarity suggests Plant B is a promising but not identical therapeutic substitute for Plant A.',
      codeIntro: 'Build and analyze an ethnobotanical knowledge graph, computing network metrics and predicting new plant-disease associations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Build ethnobotanical knowledge graph
plants = ['Neem', 'Turmeric', 'Tulsi', 'Cinchona', 'Artemisia',
          'Ashwagandha', 'Brahmi', 'Ginger', 'Aloe vera', 'Noni',
          'Sarpagandha', 'Guggul', 'Moringa', 'Giloy', 'Amla']
compounds = ['Azadirachtin', 'Curcumin', 'Eugenol', 'Quinine', 'Artemisinin',
             'Withaferin', 'Bacosides', 'Gingerol', 'Aloin', 'Scopoletin',
             'Reserpine', 'Guggulsterone', 'Quercetin', 'Berberine', 'Gallic acid']
diseases = ['Malaria', 'Inflammation', 'Diabetes', 'Hypertension', 'Cancer',
            'Anxiety', 'Infection', 'Pain', 'Fever', 'Digestive']

# Plant-compound adjacency (rows=plants, cols=compounds)
PC = np.zeros((len(plants), len(compounds)), dtype=int)
# Assign primary compounds
for i in range(min(len(plants), len(compounds))):
    PC[i, i] = 1
# Add secondary compounds (shared)
shared = [(0, 12), (1, 12), (2, 12), (2, 2), (7, 2),  # Quercetin shared
          (1, 14), (14, 14), (12, 14),  # Gallic acid
          (3, 13), (13, 13),  # Berberine
          (0, 2), (7, 7)]
for p, c in shared:
    if p < len(plants) and c < len(compounds):
        PC[p, c] = 1

# Compound-disease adjacency
CD = np.zeros((len(compounds), len(diseases)), dtype=int)
associations = [
    (0, 6), (0, 7),       # Azadirachtin → infection, pain
    (1, 1), (1, 4),       # Curcumin → inflammation, cancer
    (2, 6), (2, 7),       # Eugenol → infection, pain
    (3, 0), (3, 8),       # Quinine → malaria, fever
    (4, 0),               # Artemisinin → malaria
    (5, 5), (5, 4),       # Withaferin → anxiety, cancer
    (6, 5),               # Bacosides → anxiety
    (7, 9), (7, 1),       # Gingerol → digestive, inflammation
    (8, 6),               # Aloin → infection
    (9, 1),               # Scopoletin → inflammation
    (10, 3),              # Reserpine → hypertension
    (11, 2), (11, 1),     # Guggulsterone → diabetes, inflammation
    (12, 1), (12, 4),     # Quercetin → inflammation, cancer
    (13, 6), (13, 2),     # Berberine → infection, diabetes
    (14, 6),              # Gallic acid → infection
]
for c, d in associations:
    CD[c, d] = 1

# Plant-disease prediction matrix
PD = (PC @ CD > 0).astype(int)

fig, axes = plt.subplots(2, 2, figsize=(14, 11))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Plant-compound heatmap
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.imshow(PC, cmap='Blues', aspect='auto')
ax.set_xticks(range(len(compounds)))
ax.set_yticks(range(len(plants)))
ax.set_xticklabels([c[:6] for c in compounds], fontsize=6, rotation=45, ha='right')
ax.set_yticklabels(plants, fontsize=7)
ax.set_title('Plant-Compound Network', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='gray')
for i in range(len(plants)):
    for j in range(len(compounds)):
        if PC[i, j]:
            ax.text(j, i, '●', ha='center', va='center', color='white', fontsize=8)

# Plot 2: Plant connectivity (degree centrality)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
plant_degree = PC.sum(axis=1)  # number of compounds
plant_disease_count = PD.sum(axis=1)  # number of treatable diseases
sorted_idx = np.argsort(plant_degree)[::-1]
colors_deg = plt.cm.RdYlGn(plant_disease_count[sorted_idx] / max(plant_disease_count))
bars = ax2.barh([plants[i] for i in sorted_idx], plant_degree[sorted_idx],
                color=colors_deg, alpha=0.8, edgecolor='white', linewidth=0.5)
for bar, diseases_n in zip(bars, plant_disease_count[sorted_idx]):
    ax2.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
             f'→ {diseases_n} diseases', va='center', color='white', fontsize=8)
ax2.set_xlabel('Number of known compounds', color='white')
ax2.set_title('Plant Degree Centrality', color='white', fontsize=12, fontweight='bold')
ax2.tick_params(colors='gray')

# Plot 3: Plant similarity network
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Jaccard similarity between plant compound profiles
n_plants = len(plants)
similarity = np.zeros((n_plants, n_plants))
for i in range(n_plants):
    for j in range(n_plants):
        intersection = np.sum(PC[i] & PC[j])
        union = np.sum(PC[i] | PC[j])
        similarity[i, j] = intersection / max(union, 1)

ax3.imshow(similarity, cmap='YlOrRd', aspect='auto', vmin=0, vmax=1)
ax3.set_xticks(range(n_plants))
ax3.set_yticks(range(n_plants))
ax3.set_xticklabels([p[:5] for p in plants], fontsize=6, rotation=45, ha='right')
ax3.set_yticklabels([p[:5] for p in plants], fontsize=6)
ax3.set_title('Plant Chemical Similarity (Jaccard)', color='white', fontsize=12, fontweight='bold')
ax3.tick_params(colors='gray')
# Annotate high similarities
for i in range(n_plants):
    for j in range(i+1, n_plants):
        if similarity[i, j] > 0.2:
            ax3.text(j, i, f'{similarity[i,j]:.1f}', ha='center', va='center',
                    color='white', fontsize=6, fontweight='bold')

# Plot 4: Predicted vs known disease associations
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.imshow(PD, cmap='Greens', aspect='auto')
ax4.set_xticks(range(len(diseases)))
ax4.set_yticks(range(len(plants)))
ax4.set_xticklabels(diseases, fontsize=7, rotation=45, ha='right')
ax4.set_yticklabels(plants, fontsize=7)
ax4.set_title('Predicted Plant-Disease Associations', color='white', fontsize=12, fontweight='bold')
ax4.tick_params(colors='gray')
for i in range(len(plants)):
    for j in range(len(diseases)):
        if PD[i, j]:
            ax4.text(j, i, '✓', ha='center', va='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("=" * 60)
print("    ETHNOBOTANICAL KNOWLEDGE GRAPH ANALYSIS")
print("=" * 60)
print(f"\\\nGraph size: {len(plants)} plants, {len(compounds)} compounds, {len(diseases)} diseases")
print(f"Plant-compound edges: {PC.sum()}")
print(f"Compound-disease edges: {CD.sum()}")
print(f"\\\nMost connected plants (degree centrality):")
for i in np.argsort(plant_degree)[::-1][:5]:
    print(f"  {plants[i]:<15}: {plant_degree[i]} compounds → {plant_disease_count[i]} diseases")
print(f"\\\nMost similar plant pairs (Jaccard > 0.2):")
for i in range(n_plants):
    for j in range(i+1, n_plants):
        if similarity[i,j] > 0.2:
            print(f"  {plants[i]} ↔ {plants[j]}: {similarity[i,j]:.2f}")
print(f"\\\nThe knowledge graph preserves and connects the witch doctor's")
print(f"empirical wisdom with modern chemical and medical data.")`,
      challenge: 'Implement a link prediction algorithm: use the graph structure to predict new compound-disease edges (novel therapeutic applications). Score each missing edge by the number of paths of length 2 connecting it and rank the top 10 predictions.',
      successHint: 'You have built a computational version of the witch doctor\'s knowledge — a graph that connects plants, compounds, and diseases, enabling systematic discovery of new therapeutic relationships.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Ethnobotany, medicinal chemistry, and drug discovery from traditional knowledge</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for pharmacology, molecular modeling, and network analysis. Click to start.</p>
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
