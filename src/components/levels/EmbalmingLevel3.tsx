import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function EmbalmingLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Multi-compartment desiccation model — skin, muscle, and bone layers',
      concept: `A real human body is not a uniform slab — it's a **multi-layered composite**: skin on the outside, then subcutaneous fat, muscle, connective tissue, and bone at the centre. Each layer has different water content, diffusion coefficient, and thickness.

To model desiccation accurately, we build a **multi-compartment model** where each compartment (layer) exchanges water with its neighbours according to Fick's law, but with layer-specific transport properties.

The key insight: water must pass through EACH layer sequentially to escape the body. A low-permeability layer (like fat or skin) acts as a **diffusion barrier** — even if the muscle dries quickly, water from deeper layers gets "trapped" behind the fat layer.

This explains why embalmers made incisions through the skin and fat: they created shortcuts through the diffusion barriers, dramatically reducing desiccation time.

📚 *In multi-compartment models, the slowest compartment controls the overall rate — just like the bottleneck in a supply chain. Identifying and bypassing the rate-limiting layer is the key to efficient desiccation.*`,
      analogy: 'Imagine draining a series of connected water tanks through pipes of different sizes. A narrow pipe between two tanks slows the entire drainage — even if all other pipes are wide. The fat layer under the skin acts like that narrow pipe: it limits how fast water can escape from the deeper muscle tissue to the natron-covered surface.',
      storyConnection: 'Egyptian embalmers made a single long incision along the left flank to remove organs — but this incision also served a second purpose: it exposed the deep muscle directly to natron, bypassing the skin and fat barriers. The brain was removed through the nose (trans-nasal excerebration), again creating a direct path for cranial desiccation.',
      checkQuestion: 'If skin has a diffusion coefficient 5× lower than muscle, and the skin is 3 mm thick while muscle is 30 mm thick, which layer takes longer to desiccate?',
      checkAnswer: 'Time scales as thickness²/D. Skin: (0.3)²/D_skin = 0.09/D_skin. Muscle: (3.0)²/(5×D_skin) = 9/(5×D_skin) = 1.8/D_skin. Muscle takes 1.8/0.09 = 20× longer than skin. Despite the skin\'s low permeability, the muscle\'s much greater thickness dominates — thickness matters more than permeability.',
      codeIntro: 'Build a multi-compartment model of body desiccation with layer-specific transport properties.',
      code: `import numpy as np

class TissueLayer:
    """Represents one layer of body tissue."""
    def __init__(self, name, thickness_cm, diffusion_coeff, initial_water_pct):
        self.name = name
        self.thickness = thickness_cm
        self.D = diffusion_coeff         # cm²/day
        self.water = initial_water_pct
        self.history = [initial_water_pct]

def simulate_multilayer(layers, surface_moisture=5.0, days=60, dt=0.05):
    """
    Simulate desiccation through multiple tissue layers.
    Natron contacts the outermost layer; each inner layer
    exchanges water with its neighbours.
    """
    for day_frac in np.arange(0, days, dt):
        for i, layer in enumerate(layers):
            # Water exchange with neighbours
            if i == 0:
                outer = surface_moisture  # natron surface
            else:
                outer = layers[i - 1].water

            if i == len(layers) - 1:
                inner = layer.water  # no flux from bone core
            else:
                inner = layers[i + 1].water

            # Fick's law: flux proportional to concentration gradient / thickness
            flux_out = layer.D * (layer.water - outer) / layer.thickness * dt
            flux_in = layer.D * (inner - layer.water) / layer.thickness * dt if i < len(layers) - 1 else 0

            layer.water -= flux_out
            layer.water += flux_in
            layer.water = max(layer.water, surface_moisture)

        # Record history every full day
        if abs(day_frac % 1.0) < dt:
            for layer in layers:
                layer.history.append(layer.water)

    return layers

# Define body cross-section (torso, from skin to spine)
intact_layers = [
    TissueLayer("Skin",             0.3,  0.15, 65),
    TissueLayer("Subcutaneous fat", 1.5,  0.08, 20),
    TissueLayer("Outer muscle",     2.0,  0.50, 75),
    TissueLayer("Deep muscle",      3.0,  0.45, 75),
    TissueLayer("Connective tissue",0.5,  0.20, 60),
    TissueLayer("Bone cortex",      1.0,  0.02, 15),
]

# Simulate intact body
intact = simulate_multilayer(
    [TissueLayer(l.name, l.thickness, l.D, l.water) for l in intact_layers],
    days=60
)

print("=== Multi-Compartment Desiccation Model ===")
print("Intact body (no incisions)\\\n")
print(f"{'Layer':<22} {'Thick':>6} {'D':>6} {'Day 0':>6} {'Day 10':>7} {'Day 20':>7} {'Day 40':>7} {'Day 60':>7}")
print("-" * 68)
for layer in intact:
    vals = [layer.history[0]]
    for d in [10, 20, 40, 60]:
        idx = min(d, len(layer.history) - 1)
        vals.append(layer.history[idx])
    print(f"{layer.name:<22} {layer.thickness:>5.1f} {layer.D:>5.2f} " +
          " ".join(f"{v:>6.1f}%" for v in vals))

# Now simulate with incision (bypasses skin + fat)
print("\\\n=== With Embalming Incision (bypasses skin + fat) ===")
incised_layers = [
    TissueLayer("Outer muscle",     2.0, 0.50, 75),  # exposed directly
    TissueLayer("Deep muscle",      3.0, 0.45, 75),
    TissueLayer("Connective tissue",0.5, 0.20, 60),
    TissueLayer("Bone cortex",      1.0, 0.02, 15),
]
incised = simulate_multilayer(incised_layers, days=60)

print(f"{'Layer':<22} {'Day 0':>6} {'Day 10':>7} {'Day 20':>7} {'Day 40':>7} {'Day 60':>7}")
print("-" * 52)
for layer in incised:
    vals = [layer.history[0]]
    for d in [10, 20, 40, 60]:
        idx = min(d, len(layer.history) - 1)
        vals.append(layer.history[idx])
    print(f"{layer.name:<22} " + " ".join(f"{v:>6.1f}%" for v in vals))

# Compare average moisture at day 40
intact_avg = np.mean([l.history[min(40, len(l.history)-1)] for l in intact])
incised_avg = np.mean([l.history[min(40, len(l.history)-1)] for l in incised])
print(f"\\\nAverage moisture at 40 days — Intact: {intact_avg:.1f}%  Incised: {incised_avg:.1f}%")
print(f"Incision reduces desiccation time by bypassing the low-D skin/fat barrier.")`,
      challenge: 'Add a "natron packing inside body cavity" condition: after evisceration, natron is placed inside the abdominal cavity, so the deep muscle is attacked from BOTH sides (outside surface AND internal cavity). Model this as reducing the effective thickness by half. How much faster does the deep muscle reach the 15% target?',
      successHint: 'Multi-compartment models are used throughout biomedical engineering: drug delivery (skin/blood/tissue compartments), pharmacokinetics (absorption/distribution/metabolism), and dialysis (blood/membrane/dialysate). You just built the same type of model that pharmaceutical companies use to design transdermal patches.',
    },
    {
      title: 'Ancient DNA extraction simulation — recovering genetic information',
      concept: `Ancient DNA (aDNA) in mummified remains is **heavily degraded**: broken into short fragments (typically 30-150 base pairs), chemically modified by deamination (cytosine converting to uracil), and contaminated with microbial DNA.

Extracting usable genetic information requires:

1. **Sample preparation**: drilling bone or tooth, dissolving mineral matrix
2. **DNA extraction**: releasing fragments from tissue, purifying from proteins/salts
3. **Library preparation**: adding adapter sequences to fragments for sequencing
4. **Sequencing**: reading the base pairs of each fragment
5. **Bioinformatic analysis**: assembling fragments, filtering contamination, mapping to a reference genome

The key metric is **endogenous DNA percentage** — what fraction of recovered DNA is actually from the mummy, vs from bacteria, fungi, or modern contamination. For most mummies, this is **0.1-5%** — the vast majority of recovered DNA is microbial.

📚 *Deamination (C→U transitions) is actually useful: it provides authentication. Modern contamination lacks these damage patterns, so high deamination at fragment ends confirms the DNA is genuinely ancient.*`,
      analogy: 'Imagine trying to reconstruct a shredded newspaper that has been soaked in water, mixed with confetti from other newspapers, and left in a compost pile for 3,000 years. Most pieces are from the wrong newspaper (contamination). The surviving pieces from the original are faded, torn, and chemically altered. This is the challenge of ancient DNA analysis.',
      storyConnection: 'DNA analysis of Egyptian royal mummies identified family relationships between pharaohs, revealed that Tutankhamun\'s parents were siblings, and detected Plasmodium falciparum (malaria) DNA in his remains. These findings required sequencing millions of fragments and filtering 95%+ contamination — a triumph of computational biology.',
      checkQuestion: 'A mummy sample yields 10 million DNA fragments. Only 2% are endogenous (from the mummy). Of those, 70% are shorter than 50 base pairs and unusable. How many usable mummy fragments remain?',
      checkAnswer: '10,000,000 × 0.02 = 200,000 endogenous fragments. Of those, 30% are usable (>50 bp): 200,000 × 0.30 = 60,000 usable fragments. From 10 million raw fragments, only 60,000 (0.6%) carry usable genetic information. This is why sequencing depth matters enormously.',
      codeIntro: 'Simulate an ancient DNA extraction and analysis pipeline — from raw fragments to genome coverage.',
      code: `import numpy as np

np.random.seed(42)

class AncientDNASample:
    """Simulates DNA extracted from a mummy sample."""

    def __init__(self, age_years, preservation_quality, sample_type):
        self.age = age_years
        self.quality = preservation_quality  # 0-1 scale
        self.sample_type = sample_type

    def extract(self, mass_mg=50):
        """Simulate DNA extraction from a tissue/bone sample."""
        # Total fragments recovered (decreases with age)
        base_fragments = mass_mg * 200000  # ~200k fragments per mg
        age_factor = np.exp(-self.age / 5000)  # exponential decay with age
        total = int(base_fragments * age_factor * self.quality)

        # Endogenous percentage (higher for well-preserved samples)
        endogenous_pct = max(0.1, min(15, self.quality * 5 * np.random.uniform(0.5, 1.5)))

        # Fragment length distribution (short, peaked around 50-80 bp)
        mean_length = max(30, 100 - self.age / 100)
        lengths = np.random.exponential(mean_length, total).astype(int)
        lengths = np.clip(lengths, 15, 300)

        # Deamination rate (increases with age)
        deamination_rate = min(0.4, 0.05 + self.age / 10000)

        return {
            "total_fragments": total,
            "endogenous_pct": endogenous_pct,
            "lengths": lengths,
            "mean_length": np.mean(lengths),
            "deamination_rate": deamination_rate,
        }

    def analyse(self, extraction, genome_size_mbp=3200, min_length=30):
        """Calculate genome coverage from extracted DNA."""
        endogenous = int(extraction["total_fragments"] * extraction["endogenous_pct"] / 100)
        usable = int(np.sum(extraction["lengths"][:endogenous] >= min_length))
        mean_usable_len = np.mean(extraction["lengths"][extraction["lengths"] >= min_length])

        # Genome coverage
        total_bases = usable * mean_usable_len
        coverage = total_bases / (genome_size_mbp * 1e6)

        return {
            "endogenous_fragments": endogenous,
            "usable_fragments": usable,
            "mean_usable_length": mean_usable_len,
            "total_bases_mapped": total_bases,
            "genome_coverage": coverage,
        }

# Test different mummy samples
samples = [
    ("18th Dynasty royal (dry tomb)",   3350, 0.8, "petrous bone"),
    ("Ptolemaic commoner (humid)",      2200, 0.3, "tooth"),
    ("Predynastic natural mummy",       5200, 0.5, "skin"),
    ("Roman-era Fayum portrait mummy",  1900, 0.6, "rib bone"),
    ("Modern forensic reference",       50,   0.95, "blood"),
]

print("=== Ancient DNA Extraction Simulation ===\\\n")
print(f"{'Sample':<38} {'Age':>6} {'Qual':>5} {'Total Frags':>12} {'Endog%':>7} "
      f"{'Usable':>8} {'MeanBP':>7} {'Coverage':>9}")
print("-" * 96)

for name, age, quality, sample_type in samples:
    sample = AncientDNASample(age, quality, sample_type)
    ext = sample.extract()
    analysis = sample.analyse(ext)

    print(f"{name:<38} {age:>5} {quality:>5.1f} {ext['total_fragments']:>11,} "
          f"{ext['endogenous_pct']:>6.1f}% {analysis['usable_fragments']:>7,} "
          f"{analysis['mean_usable_length']:>6.0f} {analysis['genome_coverage']:>8.3f}×")

# Deamination authentication check
print("\\\n=== Deamination Authentication ===")
print("(C→T substitution rate at fragment ends — higher = more ancient)")
for name, age, quality, _ in samples:
    sample = AncientDNASample(age, quality, "bone")
    ext = sample.extract()
    deam = ext["deamination_rate"]
    authentic = "AUTHENTIC" if deam > 0.10 else "SUSPECT" if deam > 0.05 else "LIKELY MODERN"
    print(f"  {name:<38} Deamination: {deam:.1%}  — {authentic}")

print("\\\nKey: >10% terminal deamination strongly suggests genuine ancient DNA.")
print("Modern contamination shows <2% deamination at fragment ends.")`,
      challenge: 'To increase genome coverage, researchers sequence the same sample multiple times and combine results. If one sequencing run gives 0.5x coverage, how many runs are needed for 10x coverage (the standard for reliable variant calling)? Model diminishing returns: each additional run adds slightly less NEW coverage due to overlapping fragments.',
      successHint: 'Ancient DNA analysis combines molecular biology, chemistry, statistics, and computational genomics. The same bioinformatic pipeline you just simulated is used in medical genomics (cancer sequencing uses similar fragment-assembly methods), forensics, and conservation genetics (extracting DNA from museum specimens).',
    },
    {
      title: 'Isotope analysis — reading diet and migration from bone chemistry',
      concept: `Stable isotope ratios in bone and teeth act as **chemical diaries** of a person's life. The key isotopes are:

- **δ¹³C** (carbon-13/carbon-12): distinguishes C3 plants (wheat, barley: δ¹³C ≈ -25‰) from C4 plants (millet, sugar cane: δ¹³C ≈ -12‰). Tells you what the person ate.
- **δ¹⁵N** (nitrogen-15/nitrogen-14): increases with each trophic level (+3-5‰ per level). High δ¹⁵N = meat/fish heavy diet. Low δ¹⁵N = plant-based diet.
- **⁸⁷Sr/⁸⁶Sr** (strontium): reflects local geology. Matches the region where food was grown, so it reveals migration — if tooth enamel (formed in childhood) differs from bone (remodelled throughout life), the person moved.
- **δ¹⁸O** (oxygen-18/oxygen-16): reflects drinking water source, which correlates with climate and altitude.

Each isotope tells a different part of the story. Together, they reconstruct diet, social status, geographic origin, and migration patterns.

📚 *"You are what you eat" is literally true for isotopes. Atoms from your food are incorporated into your bones and teeth. Isotope ratios in your skeleton record decades of dietary history.*`,
      analogy: 'Isotope analysis is like reading tree rings — but for human bones. Just as tree rings record wet years (wide rings) and dry years (narrow rings), bone isotopes record what you ate (δ¹³C, δ¹⁵N), where you lived (⁸⁷Sr/⁸⁶Sr), and what water you drank (δ¹⁸O). Each measurement is a chapter of your life story, written in atoms.',
      storyConnection: 'Isotope analysis of Egyptian mummies has revealed that royal mummies had significantly higher δ¹⁵N values than commoners — indicating a diet rich in meat and Nile fish, consistent with historical records of royal feasts. Some mummies show isotope shifts between tooth enamel and bone, indicating they migrated to Egypt from Nubia or the Levant.',
      checkQuestion: 'A mummy has δ¹³C = -20‰ and δ¹⁵N = +12‰. What can you infer about their diet?',
      checkAnswer: 'δ¹³C of -20‰ is between pure C3 (-25‰) and C4 (-12‰), suggesting a mixed diet with some millet or C4 crops. δ¹⁵N of +12‰ is very high — about 3 trophic levels above plants — indicating heavy consumption of fish or meat. This person likely ate Nile fish supplemented with millet-based bread: consistent with an upper-class Egyptian diet.',
      codeIntro: 'Analyse isotope data from a population of mummies to reconstruct diet, status, and migration.',
      code: `import numpy as np

np.random.seed(42)

def generate_mummy_isotopes(n_mummies=40):
    """Generate realistic isotope data for a population of Egyptian mummies."""
    data = []
    for i in range(n_mummies):
        # Assign social class (determines diet)
        social_class = np.random.choice(["Royal", "Elite", "Artisan", "Laborer"],
                                        p=[0.05, 0.15, 0.35, 0.45])
        # Assign origin
        origin = np.random.choice(["Thebes", "Memphis", "Nubia", "Levant"],
                                  p=[0.45, 0.30, 0.15, 0.10])

        # Diet isotopes depend on class
        diet_params = {
            "Royal":   {"d13C": (-18, 1.5), "d15N": (12, 1.0)},
            "Elite":   {"d13C": (-20, 1.5), "d15N": (10, 1.5)},
            "Artisan": {"d13C": (-22, 2.0), "d15N": (8, 1.5)},
            "Laborer": {"d13C": (-24, 1.5), "d15N": (7, 1.0)},
        }
        dp = diet_params[social_class]
        d13C = np.random.normal(*dp["d13C"])
        d15N = np.random.normal(*dp["d15N"])

        # Strontium depends on geographic origin
        sr_params = {
            "Thebes": (0.7080, 0.0003),
            "Memphis": (0.7090, 0.0004),
            "Nubia":  (0.7120, 0.0005),
            "Levant": (0.7095, 0.0006),
        }
        sr = np.random.normal(*sr_params[origin])

        # Oxygen isotope depends on water source / climate
        d18O_params = {
            "Thebes": (-4.5, 0.8),
            "Memphis": (-3.0, 0.7),
            "Nubia":  (-2.0, 1.0),
            "Levant": (-5.5, 1.2),
        }
        d18O = np.random.normal(*d18O_params[origin])

        # Migration: does tooth enamel Sr differ from bone Sr?
        if np.random.random() < 0.2:  # 20% migrated
            tooth_sr = np.random.normal(*sr_params[np.random.choice(list(sr_params.keys()))])
            migrant = True
        else:
            tooth_sr = sr + np.random.normal(0, 0.0002)
            migrant = False

        data.append({
            "id": i + 1, "class": social_class, "origin": origin,
            "d13C": d13C, "d15N": d15N, "Sr_bone": sr,
            "Sr_tooth": tooth_sr, "d18O": d18O, "migrant": migrant
        })
    return data

mummies = generate_mummy_isotopes()

# Diet analysis by social class
print("=== Isotope Analysis: Diet by Social Class ===")
print(f"{'Class':<12} {'n':>3} {'δ¹³C mean':>10} {'δ¹⁵N mean':>10} {'Interpretation'}")
print("-" * 65)

for cls in ["Royal", "Elite", "Artisan", "Laborer"]:
    subset = [m for m in mummies if m["class"] == cls]
    if not subset:
        continue
    mean_c = np.mean([m["d13C"] for m in subset])
    mean_n = np.mean([m["d15N"] for m in subset])
    if mean_n > 11:
        interp = "Fish/meat-rich (high status)"
    elif mean_n > 9:
        interp = "Mixed meat and grain"
    elif mean_n > 7.5:
        interp = "Grain-based, some fish"
    else:
        interp = "Plant-dominated (low status)"
    print(f"{cls:<12} {len(subset):>3} {mean_c:>9.1f}‰ {mean_n:>9.1f}‰ {interp}")

# Migration detection
print("\\\n=== Migration Detection (Strontium Mismatch) ===")
migrants = [m for m in mummies if m["migrant"]]
locals_ = [m for m in mummies if not m["migrant"]]

print(f"Total mummies: {len(mummies)}")
print(f"Probable migrants: {len(migrants)} ({len(migrants)/len(mummies)*100:.0f}%)")
print(f"Local residents: {len(locals_)} ({len(locals_)/len(mummies)*100:.0f}%)")

if migrants:
    print(f"\\\n{'ID':>4} {'Class':<10} {'Bone ⁸⁷Sr':>10} {'Tooth ⁸⁷Sr':>11} {'ΔSr':>8} {'Likely Origin'}")
    print("-" * 56)
    for m in migrants[:8]:
        delta_sr = abs(m["Sr_bone"] - m["Sr_tooth"])
        # Infer childhood origin from tooth Sr
        best_match = min(
            {"Thebes": 0.7080, "Memphis": 0.7090, "Nubia": 0.7120, "Levant": 0.7095}.items(),
            key=lambda x: abs(x[1] - m["Sr_tooth"])
        )
        print(f"{m['id']:>4} {m['class']:<10} {m['Sr_bone']:>9.4f} {m['Sr_tooth']:>10.4f} "
              f"{delta_sr:>7.4f} {best_match[0]}")

# Geographic clustering
print("\\\n=== Geographic Origin Clusters (δ¹⁸O vs ⁸⁷Sr/⁸⁶Sr) ===")
for origin in ["Thebes", "Memphis", "Nubia", "Levant"]:
    subset = [m for m in mummies if m["origin"] == origin]
    if not subset:
        continue
    mean_sr = np.mean([m["Sr_bone"] for m in subset])
    mean_o = np.mean([m["d18O"] for m in subset])
    print(f"  {origin:<10} n={len(subset):>2}  ⁸⁷Sr={mean_sr:.4f}  δ¹⁸O={mean_o:>+.1f}‰")`,
      challenge: 'Add a temporal dimension: if you have mummies from three different periods (Old Kingdom, New Kingdom, Ptolemaic), how do diet isotopes change over time? Egypt\'s diet shifted as trade introduced new crops and animals. Model a gradual increase in δ¹³C (more C4 crops like sorghum) and δ¹⁵N (more animal protein) from Old Kingdom to Ptolemaic period.',
      successHint: 'Isotope analysis is one of the most powerful tools in bioarchaeology — it turns bones into biographical documents. The same techniques are used in modern forensics (identifying unknown remains), ecology (tracking animal migration), and food science (verifying the geographic origin of wine, olive oil, and cheese).',
    },
    {
      title: 'Comparative preservation — bog bodies, ice mummies, and catacombs',
      concept: `Egyptian embalming is just one preservation method. Nature provides others:

- **Bog bodies** (e.g., Tollund Man, 2,400 years old): Sphagnum moss creates an acidic, anaerobic, tannin-rich environment. Tannins crosslink collagen (like leather tanning), acid dissolves bone mineral. Result: preserved skin and organs, but no bones.
- **Ice mummies** (e.g., Ötzi, 5,300 years old): Sub-zero temperatures halt all enzymatic and microbial activity. Freeze-drying (sublimation) gradually removes water. Result: full-body preservation including stomach contents.
- **Catacomb mummies** (e.g., Palermo, 500+ years): Dry, cool air with constant airflow causes natural desiccation. No chemicals needed. Result: dried but recognisable bodies.
- **Salt mummies** (e.g., Chehrabad, Iran, 1,700 years): Salt mine environment — essentially natural natron. Result: exceptional soft tissue preservation.

Each mechanism targets different decomposition pathways: enzymes, bacteria, oxidation, or hydrolysis.

📚 *Preservation requires halting all four: enzymatic autolysis, bacterial decomposition, oxidative damage, and hydrolytic degradation. Each environment blocks different pathways — Egyptian embalming is the only ancient method that addresses all four.*`,
      analogy: 'Think of four enemies attacking a castle: enzymes, bacteria, oxygen, and water. A bog stops bacteria and oxygen (anaerobic acid) but doesn\'t stop water. Ice stops all four — but only while it stays frozen. Natron removes water (stops enzymes and bacteria) and resin blocks oxygen. Each preservation method has a different defensive strategy.',
      storyConnection: 'Egyptian embalmers achieved the most reliable preservation because they empirically addressed ALL decomposition pathways: evisceration (removed enzyme-rich organs), natron (removed water), resin coating (blocked oxygen and bacteria), and linen wrapping (physical barrier). No other ancient culture combined all four strategies so systematically.',
      checkQuestion: 'Why do bog bodies preserve skin but dissolve bone, while desert mummies preserve bone but degrade skin?',
      checkAnswer: 'Bog acid (pH 3-4) dissolves the calcium phosphate mineral in bone but cross-links the collagen in skin (like tanning leather). Desert heat and UV degrade the organic collagen in skin but leave the mineral bone matrix intact. They attack opposite components: bogs destroy mineral/preserve organic, deserts destroy organic/preserve mineral.',
      codeIntro: 'Model and compare the preservation mechanisms of different environments quantitatively.',
      code: `import numpy as np

class PreservationEnvironment:
    """Models a preservation environment and its effect on tissue components."""
    def __init__(self, name, temp_C, pH, oxygen_pct, humidity_pct, airflow):
        self.name = name
        self.temp = temp_C
        self.pH = pH
        self.oxygen = oxygen_pct
        self.humidity = humidity_pct
        self.airflow = airflow

    def decay_rates(self):
        """Calculate decay rates for different tissue components."""
        # Enzyme rate: depends on temperature and water
        enzyme_rate = max(0, (self.temp + 10) / 50) * (self.humidity / 100)
        # Bacterial rate: depends on temp, oxygen, pH
        bacterial_rate = max(0, self.temp / 40) * (self.oxygen / 21) * (1 - abs(self.pH - 7) / 7)
        # Oxidative rate: depends on oxygen and temperature
        oxidative_rate = (self.oxygen / 21) * max(0, (self.temp + 20) / 60)
        # Hydrolytic rate: depends on water, temperature, pH deviation
        hydrolytic_rate = (self.humidity / 100) * max(0, self.temp / 40) * (1 + abs(self.pH - 7) / 3)
        return {
            "enzymatic": enzyme_rate,
            "bacterial": bacterial_rate,
            "oxidative": oxidative_rate,
            "hydrolytic": hydrolytic_rate,
        }

    def preservation_score(self, years):
        """Overall preservation quality after N years (0-100%)."""
        rates = self.decay_rates()
        total_rate = sum(rates.values()) / 4  # normalised average
        # Exponential decay in quality
        quality = 100 * np.exp(-total_rate * years / 500)
        return max(0, quality)

# Define preservation environments
environments = [
    PreservationEnvironment("Egyptian tomb (embalmed)", 30, 7.0, 2, 15, 0.1),
    PreservationEnvironment("Peat bog (Tollund Man)",   8, 3.5, 1, 100, 0.0),
    PreservationEnvironment("Alpine glacier (Ötzi)",    -6, 7.0, 21, 30, 0.5),
    PreservationEnvironment("Catacomb (Palermo)",       15, 7.0, 21, 35, 2.0),
    PreservationEnvironment("Salt mine (Chehrabad)",    18, 7.5, 18, 10, 0.3),
    PreservationEnvironment("Open desert (natural)",    35, 7.0, 21, 8, 3.0),
    PreservationEnvironment("Tropical forest (control)",28, 6.5, 21, 90, 1.0),
]

print("=== Comparative Preservation Analysis ===\\\n")
print(f"{'Environment':<32} {'T°C':>5} {'pH':>5} {'O₂%':>5} {'RH%':>5}")
print("-" * 54)
for env in environments:
    print(f"{env.name:<32} {env.temp:>4} {env.pH:>5.1f} {env.oxygen:>4} {env.humidity:>4}")

# Decay pathway analysis
print(f"\\\n{'Environment':<32} {'Enzyme':>8} {'Bacteria':>9} {'Oxidation':>10} {'Hydrolysis':>10}")
print("-" * 70)
for env in environments:
    rates = env.decay_rates()
    print(f"{env.name:<32} {rates['enzymatic']:>7.2f} {rates['bacterial']:>8.2f} "
          f"{rates['oxidative']:>9.2f} {rates['hydrolytic']:>9.2f}")

# Preservation quality over time
print(f"\\\n=== Preservation Quality Over Time (%) ===")
time_points = [10, 100, 500, 1000, 3000, 5000]
header = f"{'Environment':<32} " + " ".join(f"{t:>6}yr" for t in time_points)
print(header)
print("-" * (32 + 7 * len(time_points)))

for env in environments:
    scores = [env.preservation_score(t) for t in time_points]
    row = f"{env.name:<32} " + " ".join(f"{s:>6.1f}%" for s in scores)
    print(row)

# Tissue-specific preservation
print("\\\n=== Tissue Preservation by Environment ===")
print(f"{'Environment':<32} {'Skin':>6} {'Muscle':>8} {'Bone':>6} {'Organs':>8} {'Hair':>6}")
print("-" * 68)
tissue_data = {
    "Egyptian tomb (embalmed)":  [90, 70, 95, 85, 95],
    "Peat bog (Tollund Man)":    [95, 80, 10, 70, 90],
    "Alpine glacier (Ötzi)":     [85, 75, 90, 80, 60],
    "Catacomb (Palermo)":        [60, 40, 90, 20, 70],
    "Salt mine (Chehrabad)":     [90, 65, 85, 60, 85],
    "Open desert (natural)":     [30, 10, 95, 5,  40],
    "Tropical forest (control)": [0,  0,  5,  0,  0],
}
for env_name, scores in tissue_data.items():
    print(f"{env_name:<32} " + " ".join(f"{s:>5}%" for s in scores))`,
      challenge: 'Add a "climate change vulnerability" analysis: if global temperatures rise by 2°C, how does this affect each preservation environment? Ice mummies are most vulnerable (melting), but even tombs are affected (higher microbial activity). Model the percentage change in preservation quality for a +2°C scenario.',
      successHint: 'Comparative preservation science draws on chemistry, biology, geology, and climatology. Understanding WHY different environments preserve different tissues is the foundation of taphonomy — the science of what happens to organisms after death. This knowledge is essential for forensic pathology, paleontology, and archaeological excavation.',
    },
    {
      title: 'Digital twin of a mummy — CT scan reconstruction',
      concept: `Modern mummy research uses **computed tomography (CT)** to study mummies non-destructively. A CT scanner takes hundreds of X-ray images from different angles and reconstructs a 3D **voxel** (volumetric pixel) model of the interior.

Each voxel has a **Hounsfield unit (HU)** value representing tissue density:
- Air: -1000 HU
- Fat: -100 HU
- Water: 0 HU
- Muscle: +40 HU
- Bone: +400 to +1000 HU
- Metal (amulets): +3000 HU
- Resin: +100 to +200 HU

By **segmenting** the CT data — classifying each voxel by tissue type based on its HU value — researchers can create a **digital twin**: a complete 3D model showing the skeleton, remaining soft tissue, amulets, and resin fills, all without unwrapping a single layer of linen.

📚 *A digital twin is a virtual replica of a physical object, updated with real measurement data. It allows testing and analysis that would be impossible or destructive on the original.*`,
      analogy: 'Imagine slicing a loaf of bread into 1,000 razor-thin slices, photographing each one, and stacking the photos back together in a computer to create a 3D model of every raisin, air bubble, and crust texture — without destroying the loaf. That is CT scanning. For a mummy, the "raisins" are amulets, the "air bubbles" are empty cavities, and the "crust" is the linen wrapping.',
      storyConnection: 'CT scanning of Tutankhamun\'s mummy in 2005 revealed a broken leg and bone disease (Köhler\'s disease), leading to the hypothesis that he walked with a cane — confirmed by the 130 walking sticks found in his tomb. A digital twin allowed researchers to virtually "unwrap" the mummy and examine every bone without touching the remains.',
      checkQuestion: 'A CT voxel reads +150 HU. What material is it most likely?',
      checkAnswer: 'Resin (+100 to +200 HU). This is denser than muscle (+40) but much less dense than bone (+400+). In a mummy, this is likely embalming resin that was poured into a body cavity — a common finding in royal mummies, where the cranial cavity was often filled with molten resin after brain removal.',
      codeIntro: 'Simulate CT scan data of a mummy cross-section and perform tissue segmentation to build a digital twin.',
      code: `import numpy as np

np.random.seed(42)

def generate_mummy_ct_slice(size=60):
    """
    Generate a simplified 2D CT slice through a mummy torso.
    Returns a 2D array of Hounsfield units.
    """
    ct = np.full((size, size), -1000.0)  # air background

    cx, cy = size // 2, size // 2

    # Body outline (elliptical)
    for x in range(size):
        for y in range(size):
            dx = (x - cx) / 18
            dy = (y - cy) / 12
            r = np.sqrt(dx**2 + dy**2)

            if r < 1.0:
                # Linen wrapping (outermost 2 pixels)
                if r > 0.88:
                    ct[x, y] = np.random.normal(50, 15)  # linen
                # Skin layer
                elif r > 0.82:
                    ct[x, y] = np.random.normal(30, 10)  # desiccated skin
                # Muscle/soft tissue (desiccated)
                elif r > 0.4:
                    ct[x, y] = np.random.normal(45, 20)  # desiccated muscle
                # Vertebral body (centre)
                elif r < 0.15:
                    ct[x, y] = np.random.normal(700, 100)  # bone

            # Ribs (symmetric pairs)
            for rib_y_offset in [-8, -5, -2, 2, 5, 8]:
                rib_cx = cx - 2
                rib_cy = cy + rib_y_offset
                dist = np.sqrt((x - rib_cx)**2 + (y - rib_cy)**2)
                if 10 < dist < 12 and abs(y - rib_cy) < 3:
                    ct[x, y] = np.random.normal(600, 80)

            # Resin fill in abdominal cavity
            if abs(x - cx) < 6 and abs(y - cy + 3) < 5:
                ct[x, y] = np.random.normal(150, 30)  # resin

            # Amulet (small, very dense — over the chest)
            if abs(x - cx + 5) < 1.5 and abs(y - cy) < 1.5:
                ct[x, y] = np.random.normal(3000, 200)  # metal amulet

    return ct

def segment_ct(ct_slice):
    """Classify each voxel into tissue type based on HU value."""
    labels = np.empty(ct_slice.shape, dtype='U12')
    for x in range(ct_slice.shape[0]):
        for y in range(ct_slice.shape[1]):
            hu = ct_slice[x, y]
            if hu < -500:
                labels[x, y] = "Air"
            elif hu < -50:
                labels[x, y] = "Fat"
            elif hu < 20:
                labels[x, y] = "Water/fluid"
            elif hu < 80:
                labels[x, y] = "Soft tissue"
            elif hu < 250:
                labels[x, y] = "Resin"
            elif hu < 1500:
                labels[x, y] = "Bone"
            else:
                labels[x, y] = "Metal"
    return labels

# Generate and analyse CT slice
ct = generate_mummy_ct_slice()
segments = segment_ct(ct)

# Count voxels per tissue type
print("=== Mummy CT Scan — Cross-Section Analysis ===")
print("Simulated axial slice through the torso\\\n")

unique, counts = np.unique(segments, return_counts=True)
total_voxels = ct.size
body_voxels = total_voxels - counts[list(unique).index("Air")]

print(f"{'Tissue Type':<14} {'Voxels':>8} {'% of body':>10} {'Mean HU':>8} {'Std HU':>7}")
print("-" * 50)
for tissue, count in sorted(zip(unique, counts), key=lambda x: -x[1]):
    mask = segments == tissue
    mean_hu = np.mean(ct[mask])
    std_hu = np.std(ct[mask])
    pct = count / body_voxels * 100 if tissue != "Air" else 0
    print(f"{tissue:<14} {count:>7} {pct:>9.1f}% {mean_hu:>7.0f} {std_hu:>6.0f}")

# Hounsfield unit histogram
print("\\\n=== HU Distribution (non-air voxels) ===")
non_air = ct[segments != "Air"]
bins = [(-500, -50, "Fat/lipid"), (-50, 20, "Water"), (20, 80, "Soft tissue"),
        (80, 250, "Resin"), (250, 1500, "Bone"), (1500, 5000, "Metal")]

for low, high, label in bins:
    count = np.sum((non_air >= low) & (non_air < high))
    bar = "#" * (count // 8)
    print(f"  {label:<14} [{low:>5} to {high:>5} HU] {count:>5} {bar}")

# Amulet detection
metal_mask = segments == "Metal"
if np.any(metal_mask):
    metal_coords = np.argwhere(metal_mask)
    centroid = metal_coords.mean(axis=0)
    max_hu = np.max(ct[metal_mask])
    print(f"\\\n=== Amulet Detection ===")
    print(f"Metal object detected at position ({centroid[0]:.0f}, {centroid[1]:.0f})")
    print(f"Peak density: {max_hu:.0f} HU")
    print(f"Size: ~{len(metal_coords)} voxels")
    print(f"Material: likely gold (>2500 HU) or copper alloy")

# Resin volume estimation
resin_mask = segments == "Resin"
resin_pct = np.sum(resin_mask) / body_voxels * 100
print(f"\\\n=== Resin Analysis ===")
print(f"Resin volume: {np.sum(resin_mask)} voxels ({resin_pct:.1f}% of body)")
print(f"Mean resin density: {np.mean(ct[resin_mask]):.0f} HU")
print(f"Location: abdominal cavity (consistent with post-evisceration filling)")`,
      challenge: 'Add a "virtual unwrapping" feature: identify the linen wrapping layer (HU 30-70, outermost body voxels) and calculate its thickness in voxels at different positions around the body. Royal mummies had up to 20 layers of linen — can you estimate the number of layers from the wrapping thickness?',
      successHint: 'CT-based digital twins are transforming archaeology, medicine, and engineering. The same segmentation pipeline you built is used in medical imaging (tumour detection), industrial inspection (detecting cracks in metal parts), and paleontology (extracting fossils from rock virtually). Voxel-based analysis is one of the core skills in computational imaging.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced modelling, ancient DNA, isotope analysis, and CT reconstruction</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers multi-compartment desiccation, ancient DNA, isotope analysis, comparative preservation, and CT-based digital twins.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L3-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
