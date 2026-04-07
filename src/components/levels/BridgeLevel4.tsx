import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BridgeLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Project Architecture: Bio-Bridge Strength Modeler',
      concept: `This capstone builds a complete engineering tool: a Bio-Bridge Strength Modeler that predicts the load-bearing capacity of a living root bridge given its age, species, root count, span length, and environmental conditions. This is a tool that could actually be used by conservation engineers working to preserve and catalog Meghalaya's living root bridges.

The system has five modules:

1. **Growth Model**: Predicts root diameter and wood properties as functions of age, species, and environment. Uses the logistic growth model from Level 3, parameterized with real botanical data for *Ficus elastica*.

2. **Material Properties Engine**: Calculates tensile strength, Young's modulus, and density of root wood based on age (maturity affects wood density and microfibril angle), moisture content (seasonal variation), and temperature. Implements the composite mechanics from Level 3.

3. **Structural Analyzer**: Given root geometry (count, diameter, span, sag ratio) and material properties, computes the bridge's load capacity using catenary mechanics and safety factors. Accounts for root anastomosis (fused junctions increase or decrease effective strength depending on quality).

4. **Environmental Risk Module**: Adjusts capacity for monsoon loading (additional water weight on roots), seismic risk (dynamic amplification factor), wind loading, and root disease/decay probability as a function of age and maintenance.

5. **Visualization Dashboard**: Multi-panel output showing growth trajectory, current capacity, risk factors, and recommendations (safe crowd limit, maintenance schedule, comparison to engineering codes).

Each lesson builds one module. By the end, you have a deployable engineering tool.`,
      analogy: 'Building this modeler is like creating a digital twin of the bridge. In aerospace engineering, every aircraft has a digital twin — a computer model that mirrors the real plane\'s structural state. Engineers run simulations on the twin before modifying the real plane. Our Bio-Bridge Strength Modeler is a digital twin for a living structure: it predicts how the bridge will behave under various loads and conditions without needing to load-test the real bridge (which could damage it).',
      storyConnection: 'The bridge in the story has been crossing the gorge for over 200 years. But how strong is it today? Could it carry a group of 50 tourists? What about during monsoon when the roots are waterlogged? These are real questions facing Meghalaya\'s tourism department and conservation engineers. Our modeler answers them quantitatively, using the physics and biology we learned in Level 3.',
      checkQuestion: 'Why is a modular architecture (5 separate modules) better than a single monolithic function for this project?',
      checkAnswer: 'Modularity provides three advantages. First, each module can be tested and validated independently — you can verify the growth model against botanical data without needing the structural analyzer. Second, modules can be updated independently — if better material property data becomes available, you update only the material engine without touching the rest. Third, modules can be reused — the growth model could serve a separate project on forest biomass estimation. This is the Single Responsibility Principle in software engineering.',
      codeIntro: 'Define the project architecture, data structures, and the Growth Model module with species-specific parameters.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# BIO-BRIDGE STRENGTH MODELER — Module 1: Growth Model
# ============================================================

class BridgeSpecies:
    """Species-specific growth parameters for bridge-building trees."""

    SPECIES_DB = {
        'ficus_elastica': {
            'common_name': 'Indian Rubber Fig',
            'max_root_diameter_cm': 25.0,
            'growth_rate': 0.04,         # logistic growth rate
            'inflection_year': 40,       # fastest growth around this age
            'wood_density_young': 450,   # kg/m^3 at age 5
            'wood_density_mature': 700,  # kg/m^3 at age 100+
            'base_tensile_MPa': 30,      # young wood
            'mature_tensile_MPa': 50,    # mature wood
            'mfa_young_deg': 30,         # microfibril angle, young
            'mfa_mature_deg': 12,        # microfibril angle, mature
            'aerial_root_rate': 8,       # roots per year under ideal conditions
            'min_humidity_pct': 70,      # below this, growth stalls
        },
        'ficus_benghalensis': {
            'common_name': 'Banyan',
            'max_root_diameter_cm': 35.0,
            'growth_rate': 0.035,
            'inflection_year': 50,
            'wood_density_young': 400,
            'wood_density_mature': 650,
            'base_tensile_MPa': 25,
            'mature_tensile_MPa': 42,
            'mfa_young_deg': 35,
            'mfa_mature_deg': 15,
            'aerial_root_rate': 12,
            'min_humidity_pct': 65,
        },
        'ficus_racemosa': {
            'common_name': 'Cluster Fig',
            'max_root_diameter_cm': 18.0,
            'growth_rate': 0.05,
            'inflection_year': 30,
            'wood_density_young': 380,
            'wood_density_mature': 580,
            'base_tensile_MPa': 22,
            'mature_tensile_MPa': 38,
            'mfa_young_deg': 32,
            'mfa_mature_deg': 18,
            'aerial_root_rate': 15,
            'min_humidity_pct': 60,
        },
    }

    @classmethod
    def get(cls, species_key):
        return cls.SPECIES_DB[species_key]

    @classmethod
    def list_species(cls):
        return list(cls.SPECIES_DB.keys())


class GrowthModel:
    """Predicts root diameter and count over time."""

    def __init__(self, species_key, humidity_pct=85, temperature_C=25):
        self.params = BridgeSpecies.get(species_key)
        self.humidity = humidity_pct
        self.temperature = temperature_C

        # Environmental growth modifier
        humidity_factor = max(0, min(1, (humidity_pct - self.params['min_humidity_pct']) /
                                      (100 - self.params['min_humidity_pct'])))
        temp_factor = np.exp(-((temperature_C - 25) / 15)**2)  # optimal at 25C
        self.env_modifier = humidity_factor * temp_factor

    def root_diameter(self, age_years):
        """Root diameter in cm at given age."""
        p = self.params
        d_max = p['max_root_diameter_cm'] * self.env_modifier
        return d_max / (1 + np.exp(-p['growth_rate'] * (age_years - p['inflection_year'])))

    def root_count(self, age_years, initial_guided=4):
        """Estimated number of load-bearing roots at given age."""
        # Guided roots + natural additions
        natural = self.params['aerial_root_rate'] * self.env_modifier * np.log1p(age_years) * 0.3
        return initial_guided + int(natural)

    def wood_density(self, age_years):
        """Wood density in kg/m^3 as function of age."""
        p = self.params
        maturity = 1 - np.exp(-0.03 * age_years)
        return p['wood_density_young'] + maturity * (p['wood_density_mature'] - p['wood_density_young'])

    def profile(self, max_age=200):
        """Generate full growth profile."""
        ages = np.arange(0, max_age + 1)
        diameters = np.array([self.root_diameter(a) for a in ages])
        counts = np.array([self.root_count(a) for a in ages])
        densities = np.array([self.wood_density(a) for a in ages])
        return ages, diameters, counts, densities


# --- Generate growth profiles for all species ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bio-Bridge Growth Model: Species Comparison',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

species_colors = {'ficus_elastica': '#22c55e', 'ficus_benghalensis': '#f59e0b', 'ficus_racemosa': '#3b82f6'}

# Plot 1: Diameter growth
ax = axes[0, 0]
for sp_key in BridgeSpecies.list_species():
    model = GrowthModel(sp_key, humidity_pct=85)
    ages, diams, _, _ = model.profile(200)
    sp = BridgeSpecies.get(sp_key)
    ax.plot(ages, diams, color=species_colors[sp_key], linewidth=2,
            label=f"{sp['common_name']}")

ax.axhline(y=10, color='#ef4444', linestyle='--', alpha=0.5, label='Min for foot traffic')
ax.set_xlabel('Age (years)', color='white', fontsize=11)
ax.set_ylabel('Root diameter (cm)', color='white', fontsize=11)
ax.set_title('Root diameter growth by species', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Environmental effect on F. elastica
ax = axes[0, 1]
for hum, ls in [(95, '-'), (85, '--'), (75, ':'), (65, '-.')]:
    model = GrowthModel('ficus_elastica', humidity_pct=hum)
    ages, diams, _, _ = model.profile(200)
    ax.plot(ages, diams, color='#22c55e', linewidth=2, linestyle=ls,
            label=f'Humidity {hum}%')

ax.set_xlabel('Age (years)', color='white', fontsize=11)
ax.set_ylabel('Root diameter (cm)', color='white', fontsize=11)
ax.set_title('Humidity effect on F. elastica growth', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Root count over time
ax = axes[1, 0]
for sp_key in BridgeSpecies.list_species():
    model = GrowthModel(sp_key, humidity_pct=85)
    ages, _, counts, _ = model.profile(200)
    sp = BridgeSpecies.get(sp_key)
    ax.plot(ages, counts, color=species_colors[sp_key], linewidth=2,
            label=f"{sp['common_name']}")

ax.set_xlabel('Age (years)', color='white', fontsize=11)
ax.set_ylabel('Load-bearing root count', color='white', fontsize=11)
ax.set_title('Root recruitment over time', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Wood density maturation
ax = axes[1, 1]
for sp_key in BridgeSpecies.list_species():
    model = GrowthModel(sp_key, humidity_pct=85)
    ages, _, _, densities = model.profile(200)
    sp = BridgeSpecies.get(sp_key)
    ax.plot(ages, densities, color=species_colors[sp_key], linewidth=2,
            label=f"{sp['common_name']}")

ax.set_xlabel('Age (years)', color='white', fontsize=11)
ax.set_ylabel('Wood density (kg/m\³)', color='white', fontsize=11)
ax.set_title('Wood density maturation', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

# Summary
print("Bio-Bridge Growth Model — Module 1 Complete")
print("=" * 60)
print(f"Species in database: {len(BridgeSpecies.list_species())}")
print()
for sp_key in BridgeSpecies.list_species():
    sp = BridgeSpecies.get(sp_key)
    model = GrowthModel(sp_key, humidity_pct=85)
    d50 = model.root_diameter(50)
    d100 = model.root_diameter(100)
    n100 = model.root_count(100)
    print(f"  {sp['common_name']:20s}: D@50yr={d50:.1f}cm, D@100yr={d100:.1f}cm, "
          f"roots@100yr={n100}, max={sp['max_root_diameter_cm']}cm")

print()
print("Environmental modifier at 85% humidity, 25C: {:.2f}".format(
    GrowthModel('ficus_elastica', 85, 25).env_modifier))
print("Environmental modifier at 70% humidity, 30C: {:.2f}".format(
    GrowthModel('ficus_elastica', 70, 30).env_modifier))`,
      challenge: 'Add a drought stress function: if humidity drops below the species minimum for more than 2 consecutive years, growth rate halves and wood density decreases (stress wood). Model a 5-year drought at age 60 and show the recovery trajectory.',
      successHint: 'Module 1 is complete. You have a species-parameterized growth model that accounts for environmental conditions. This is the foundation — every other module builds on these predictions.',
    },
    {
      title: 'Material Properties Engine',
      concept: `Module 2 translates the growth model's predictions into engineering-grade material properties. The key properties are tensile strength (how much pull it can take before breaking), Young's modulus (stiffness — how much it stretches under load), and the effects of moisture content on both.

**Age-dependent properties**: As root wood matures, the microfibril angle (MFA) decreases from ~30 degrees (young, flexible) to ~12 degrees (mature, stiff and strong). This single parameter change accounts for most of the strength increase with age. We model this using the off-axis transformation equations from Level 3.

**Moisture correction**: Root wood is hygroscopic — it absorbs water from the environment. Below the fiber saturation point (FSP, about 28-30% moisture content), both strength and stiffness decrease linearly with increasing moisture. Above FSP, free water fills cell lumens but doesn\'t affect the cell walls, so properties plateau. During monsoon, roots can reach 80-100% moisture content, but properties don\'t decrease further beyond FSP.

The correction factor is: if MC < FSP, strength_factor = 1 - 0.5 * MC/FSP. If MC >= FSP, strength_factor = 0.5 (constant).

**Temperature effect**: Wood strength decreases at higher temperatures due to thermal softening of lignin and hemicellulose. The effect is approximately 1% decrease per degree C above 20C, and 0.5% increase per degree below 20C. In Meghalaya's climate (15-30C), this is a 5-10% variation.

**Anastomosis quality**: Where two roots have fused, the junction can be weaker or stronger than intact root, depending on how completely the cambia merged. We model this as an "anastomosis efficiency" from 0 (no fusion, just touching) to 1.0 (perfect fusion, continuous wood). Well-maintained bridges with old fusions approach 0.8-0.9.`,
      analogy: 'The material properties engine is like a wood grading system at a lumber yard. A grader examines each piece of timber and assigns a structural grade based on species, grain angle, moisture, knots, and defects. Our engine does the same thing computationally for living root wood, but with the added dimension that the "grade" changes with age (improving) and season (varying with moisture).',
      storyConnection: 'The story mentions that the bridge feels different in monsoon — more flexible, slightly bouncy — compared to the dry winter months when it feels rigid and solid. This is not imagination: the material properties genuinely change with moisture. Our engine quantifies this seasonal variation, which is critical for setting safe load limits.',
      checkQuestion: 'A conservation engineer measures the moisture content of a root at 45% during monsoon. Is this above or below the fiber saturation point, and what does it mean for the bridge\'s load capacity compared to dry season (12% MC)?',
      checkAnswer: 'At 45% MC, the root is above the FSP (~28-30%). The strength factor plateaus at approximately 0.5 (50% of oven-dry strength). In dry season at 12% MC, the strength factor is 1 - 0.5 * 12/28 = 0.79 (79% of oven-dry). So the monsoon bridge is approximately 0.5/0.79 = 63% as strong as the dry-season bridge. This means the safe crowd limit should be reduced by about 37% during monsoon — a quantitative safety recommendation.',
      codeIntro: 'Build the Material Properties Engine with age, moisture, and temperature corrections.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# BIO-BRIDGE STRENGTH MODELER — Module 2: Material Properties
# ============================================================

class MaterialEngine:
    """Computes engineering properties of root wood."""

    FSP = 28.0  # Fiber saturation point (% moisture content)

    def __init__(self, species_params):
        self.params = species_params

    def microfibril_angle(self, age_years):
        """MFA decreases with maturity (degrees)."""
        p = self.params
        maturity = 1 - np.exp(-0.03 * age_years)
        return p['mfa_young_deg'] - maturity * (p['mfa_young_deg'] - p['mfa_mature_deg'])

    def tensile_strength(self, age_years, moisture_pct=15, temperature_C=25):
        """Tensile strength in MPa, corrected for conditions."""
        p = self.params
        # Base strength improves with age (MFA effect)
        maturity = 1 - np.exp(-0.03 * age_years)
        base = p['base_tensile_MPa'] + maturity * (p['mature_tensile_MPa'] - p['base_tensile_MPa'])

        # MFA correction (cos^2 relationship)
        mfa_rad = np.deg2rad(self.microfibril_angle(age_years))
        mfa_factor = np.cos(mfa_rad)**2 / np.cos(np.deg2rad(p['mfa_mature_deg']))**2

        # Moisture correction
        if moisture_pct < self.FSP:
            moisture_factor = 1 - 0.5 * moisture_pct / self.FSP
        else:
            moisture_factor = 0.5

        # Temperature correction (1% per degree above 20C)
        temp_factor = 1 - 0.01 * (temperature_C - 20)
        temp_factor = max(0.8, min(1.1, temp_factor))

        return base * mfa_factor * moisture_factor * temp_factor

    def youngs_modulus(self, age_years, moisture_pct=15):
        """Young's modulus in GPa."""
        # Mature root wood: ~10-15 GPa along fiber
        maturity = 1 - np.exp(-0.03 * age_years)
        base_E = 5 + maturity * 10  # GPa

        # MFA correction (cos^4 relationship for modulus)
        mfa_rad = np.deg2rad(self.microfibril_angle(age_years))
        mfa_factor = np.cos(mfa_rad)**4 / np.cos(np.deg2rad(self.params['mfa_mature_deg']))**4

        # Moisture correction
        if moisture_pct < self.FSP:
            moisture_factor = 1 - 0.4 * moisture_pct / self.FSP
        else:
            moisture_factor = 0.6

        return base_E * mfa_factor * moisture_factor

    def anastomosis_strength(self, age_of_junction, maintenance_quality=0.7):
        """Strength efficiency of a root junction (0-1)."""
        # Fusion improves with age of the junction
        fusion = 1 - np.exp(-0.05 * age_of_junction)
        # Maintenance quality affects how well the junction was established
        return fusion * maintenance_quality

    def full_report(self, age_years, moisture_pct=15, temperature_C=25):
        """Generate complete material property report."""
        return {
            'age': age_years,
            'mfa_deg': self.microfibril_angle(age_years),
            'tensile_MPa': self.tensile_strength(age_years, moisture_pct, temperature_C),
            'youngs_GPa': self.youngs_modulus(age_years, moisture_pct),
            'moisture_pct': moisture_pct,
            'temperature_C': temperature_C,
        }

# --- Species data (from Module 1) ---
species_db = {
    'ficus_elastica': {
        'common_name': 'Indian Rubber Fig',
        'base_tensile_MPa': 30, 'mature_tensile_MPa': 50,
        'mfa_young_deg': 30, 'mfa_mature_deg': 12,
    },
}

engine = MaterialEngine(species_db['ficus_elastica'])

# --- Visualize material properties ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Material Properties Engine: Root Wood Characterization',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

ages = np.arange(1, 201)

# Plot 1: Tensile strength vs age (different moisture levels)
ax = axes[0, 0]
for mc, color, ls in [(10, '#22c55e', '-'), (20, '#3b82f6', '--'),
                       (28, '#f59e0b', ':'), (50, '#ef4444', '-.')]:
    strengths = [engine.tensile_strength(a, mc) for a in ages]
    ax.plot(ages, strengths, color=color, linewidth=2, linestyle=ls,
            label=f'MC={mc}%')

ax.set_xlabel('Root age (years)', color='white', fontsize=11)
ax.set_ylabel('Tensile strength (MPa)', color='white', fontsize=11)
ax.set_title('Strength vs age & moisture', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Young's modulus vs age
ax = axes[0, 1]
moduli_dry = [engine.youngs_modulus(a, 12) for a in ages]
moduli_wet = [engine.youngs_modulus(a, 50) for a in ages]
ax.plot(ages, moduli_dry, color='#22c55e', linewidth=2, label='Dry season (12% MC)')
ax.plot(ages, moduli_wet, color='#3b82f6', linewidth=2, label='Monsoon (50% MC)')
ax.fill_between(ages, moduli_wet, moduli_dry, alpha=0.15, color='#f59e0b')
ax.text(100, (moduli_dry[100]+moduli_wet[100])/2, 'Seasonal\\\nvariation',
        color='#f59e0b', fontsize=10, ha='center')
ax.set_xlabel('Root age (years)', color='white', fontsize=11)
ax.set_ylabel("Young's modulus (GPa)", color='white', fontsize=11)
ax.set_title('Stiffness: dry vs monsoon', color='white', fontsize=12)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: MFA evolution
ax = axes[1, 0]
mfas = [engine.microfibril_angle(a) for a in ages]
ax.plot(ages, mfas, color='#a855f7', linewidth=2.5)
ax.fill_between(ages, 0, mfas, alpha=0.15, color='#a855f7')
ax.axhline(y=15, color='#22c55e', linestyle='--', alpha=0.5, label='Optimal for tension (<15\°)')
ax.set_xlabel('Root age (years)', color='white', fontsize=11)
ax.set_ylabel('Microfibril angle (degrees)', color='white', fontsize=11)
ax.set_title('MFA decreases with maturity', color='white', fontsize=12)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.text(100, 20, 'Young wood:\\\nflexible, weaker', color='gray', fontsize=9, ha='center')
ax.text(150, 13, 'Mature wood:\\\nstiff, strong', color='#22c55e', fontsize=9, ha='center')

# Plot 4: Anastomosis junction strength
ax = axes[1, 1]
junction_ages = np.arange(0, 101)
for quality, color, label in [(0.9, '#22c55e', 'Well-maintained (0.9)'),
                                (0.7, '#3b82f6', 'Average (0.7)'),
                                (0.4, '#ef4444', 'Neglected (0.4)')]:
    efficiencies = [engine.anastomosis_strength(a, quality) for a in junction_ages]
    ax.plot(junction_ages, np.array(efficiencies) * 100, color=color, linewidth=2, label=label)

ax.axhline(y=80, color='#f59e0b', linestyle='--', alpha=0.5, label='80% = "good" junction')
ax.set_xlabel('Junction age (years)', color='white', fontsize=11)
ax.set_ylabel('Junction efficiency (%)', color='white', fontsize=11)
ax.set_title('Anastomosis strength by maintenance quality', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

# Print material report
print("Material Properties Report — Ficus elastica")
print("=" * 60)
for age in [10, 30, 50, 100, 200]:
    r_dry = engine.full_report(age, moisture_pct=12)
    r_wet = engine.full_report(age, moisture_pct=50)
    print(f"  Age {age:3d}yr: MFA={r_dry['mfa_deg']:.1f}\° | "
          f"Dry: {r_dry['tensile_MPa']:.1f} MPa, E={r_dry['youngs_GPa']:.1f} GPa | "
          f"Wet: {r_wet['tensile_MPa']:.1f} MPa, E={r_wet['youngs_GPa']:.1f} GPa")

print()
print("Anastomosis at 50yr junction, well-maintained: {:.0f}%".format(
    engine.anastomosis_strength(50, 0.9) * 100))
print("Anastomosis at 50yr junction, neglected: {:.0f}%".format(
    engine.anastomosis_strength(50, 0.4) * 100))`,
      challenge: 'Add a "decay model" for old roots: after age 150, a probability of internal decay increases, reducing effective cross-sectional area. Model the decay as a random hollow core that grows inward from the center. How does this affect the tensile capacity (hint: a hollow tube can be nearly as strong as a solid cylinder)?',
      successHint: 'Module 2 is complete. You can now compute material properties for any age, moisture, and temperature. The seasonal variation data is particularly valuable — it tells conservation engineers when bridges are at their weakest.',
    },
    {
      title: 'Structural Analyzer — catenary mechanics and load capacity',
      concept: `Module 3 combines root geometry with material properties to compute the bridge's actual load-carrying capacity. The key insight is that the main load-bearing roots hang in a catenary curve — the shape that minimizes bending and puts the entire member in pure tension.

**Catenary equation**: A flexible cable of uniform weight per unit length w, spanning distance L between supports at the same height, assumes the shape y(x) = a * (cosh(x/a) - 1), where a = H/w is the catenary parameter, and H is the horizontal tension. The total tension at any point is T(x) = H * cosh(x/a). Maximum tension occurs at the supports: T_max = H * cosh(L/(2a)).

**From catenary to capacity**: The bridge fails when T_max exceeds the tensile capacity of the roots. Tensile capacity = (number of roots) * (cross-sectional area per root) * (tensile strength of wood) * (anastomosis efficiency). The safe capacity applies a safety factor (typically 3 for living structures, accounting for variability and uncertainty).

**Sag ratio**: The ratio of sag (vertical drop at midspan) to span length determines the catenary parameter. A deeper sag means lower horizontal tension but longer total cable length. Root bridges typically have sag ratios of 0.10 to 0.25 (10-25% of span). The optimal sag ratio balances walkability (less sag = flatter, easier to walk) against structural efficiency (more sag = lower cable tension = higher capacity).

**Dynamic amplification**: Walking creates dynamic forces 1.2-1.5 times static body weight. A group walking in rhythm can create resonance if their stepping frequency matches a natural frequency of the bridge. We apply a dynamic amplification factor (DAF) of 1.5 for normal foot traffic and 2.0 for large groups.`,
      analogy: 'The structural analyzer is like an engineer\'s calculator that answers the essential question: "How much can this bridge hold before it breaks?" For a steel bridge, the calculation uses tensile strength of steel, cross-sectional area of cables, and safety factors. Our calculator does exactly the same thing, but substitutes root wood properties (which vary with age and season) for steel properties (which are constant).',
      storyConnection: 'The village elder in the story somehow knows that the bridge can hold 20 people but not 30. This is traditional engineering knowledge — centuries of observation codified as oral rules. Our structural analyzer replaces intuition with physics, giving the same answer but with quantified confidence. The elder\'s "20 people" rule likely corresponds to a safety factor of about 3.',
      checkQuestion: 'A bridge has 6 roots of 15 cm diameter, each with tensile strength of 40 MPa, spanning 20 m with a sag of 3 m. What is the approximate safe load capacity? (Use safety factor of 3, assume anastomosis efficiency of 0.85.)',
      checkAnswer: 'Root area = pi * (0.075)^2 = 0.01767 m^2 per root. Total root capacity = 6 * 0.01767 * 40e6 * 0.85 = 3.61 MN. Sag ratio = 3/20 = 0.15. The catenary parameter a = L^2/(8*sag) = 400/24 = 16.67 m. Horizontal tension per unit load = approximately L/(8*sag/L) requiring the full catenary math, but simplified: the cable force amplification is roughly 1/sin(theta) where theta = arctan(4*sag/L) = arctan(0.6) = 31 degrees. So cable force per unit load = 1/sin(31) = 1.94. Safe vertical load = 3.61 MN / 1.94 / 3 (safety factor) = 620 kN = 63 tonnes = roughly 900 people. This seems high because 6 roots at 15 cm is a very robust bridge.',
      codeIntro: 'Build the structural analysis module with catenary mechanics, capacity calculation, and safety assessment.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# BIO-BRIDGE STRENGTH MODELER — Module 3: Structural Analyzer
# ============================================================

class StructuralAnalyzer:
    """Computes bridge load capacity from geometry and material properties."""

    PERSON_WEIGHT_KG = 70  # average person
    G = 9.81               # gravity m/s^2

    def __init__(self, span_m, sag_m, n_roots, root_diameter_cm,
                 tensile_MPa, anastomosis_eff=0.85, safety_factor=3.0):
        self.span = span_m
        self.sag = sag_m
        self.n_roots = n_roots
        self.root_diam = root_diameter_cm / 100  # convert to m
        self.tensile = tensile_MPa * 1e6          # convert to Pa
        self.anast_eff = anastomosis_eff
        self.SF = safety_factor

    @property
    def sag_ratio(self):
        return self.sag / self.span

    @property
    def root_area_m2(self):
        """Cross-sectional area of one root in m^2."""
        return np.pi * (self.root_diam / 2)**2

    @property
    def total_capacity_N(self):
        """Total tensile capacity of all roots (Newtons)."""
        return self.n_roots * self.root_area_m2 * self.tensile * self.anast_eff

    def catenary_parameter(self):
        """Catenary parameter a = H/w."""
        # For sag d and span L: a = L^2 / (8*d) (parabolic approximation)
        return self.span**2 / (8 * self.sag)

    def cable_force_factor(self):
        """Ratio of max cable tension to vertical load."""
        # At the support: T_max = w*L/2 * sqrt(1 + (L/(4*d))^2) / (L/(2*d))
        # Simplified: factor = sqrt(1 + (L/(4d))^2)
        ratio = self.span / (4 * self.sag)
        return np.sqrt(1 + ratio**2)

    def safe_load_N(self, dynamic_factor=1.5):
        """Safe vertical load in Newtons."""
        # Capacity / cable_amplification / safety_factor / dynamic_factor
        return self.total_capacity_N / self.cable_force_factor() / self.SF / dynamic_factor

    def safe_persons(self, dynamic_factor=1.5):
        """Number of people the bridge can safely support."""
        return int(self.safe_load_N(dynamic_factor) / (self.PERSON_WEIGHT_KG * self.G))

    def utilization(self, n_persons, dynamic_factor=1.5):
        """Structural utilization ratio (0-1, >1 = failure)."""
        applied = n_persons * self.PERSON_WEIGHT_KG * self.G * self.cable_force_factor() * dynamic_factor
        return applied / (self.total_capacity_N / self.SF)

    def catenary_shape(self, n_points=100):
        """Return x, y arrays for the catenary curve."""
        a = self.catenary_parameter()
        x = np.linspace(-self.span/2, self.span/2, n_points)
        y = a * (np.cosh(x/a) - 1)
        # Normalize so max sag = self.sag
        y = y / y.max() * self.sag if y.max() > 0 else y
        x = x + self.span/2  # shift to 0..span
        return x, y

# --- Example bridge: typical Khasi living root bridge ---
bridge = StructuralAnalyzer(
    span_m=25, sag_m=4, n_roots=6,
    root_diameter_cm=15, tensile_MPa=42,
    anastomosis_eff=0.85, safety_factor=3.0
)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Structural Analysis: Living Root Bridge Capacity',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Bridge profile with catenary
ax = axes[0, 0]
x_cat, y_cat = bridge.catenary_shape()
# Draw multiple roots with slight offsets
for i in range(bridge.n_roots):
    offset = (i - bridge.n_roots/2) * 0.15
    ax.plot(x_cat, -(y_cat + offset), color='#22c55e', linewidth=2.5, alpha=0.6)

# Banks
ax.fill_between([-2, 0], [-1, -1], [1, 1], color='#78350f', alpha=0.5)
ax.fill_between([25, 27], [-1, -1], [1, 1], color='#78350f', alpha=0.5)
ax.plot(x_cat, -y_cat, color='#22c55e', linewidth=3, label='Catenary profile')
ax.annotate(f'Span = {bridge.span}m', xy=(12.5, 0.3), color='white', fontsize=10, ha='center')
ax.annotate(f'Sag = {bridge.sag}m', xy=(12.5, -2), color='#f59e0b', fontsize=10, ha='center',
            arrowprops=dict(arrowstyle='<->', color='#f59e0b'), xytext=(14, -2))
ax.set_title(f'Bridge profile ({bridge.n_roots} roots, {bridge.root_diam*100:.0f}cm diameter)',
             color='white', fontsize=12)
ax.set_xlabel('Position (m)', color='white')
ax.set_ylabel('Elevation (m)', color='white')
ax.set_xlim(-3, 28)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Capacity vs sag ratio
ax = axes[0, 1]
sag_ratios = np.linspace(0.05, 0.35, 50)
capacities = []
for sr in sag_ratios:
    b = StructuralAnalyzer(25, sr*25, 6, 15, 42, 0.85, 3.0)
    capacities.append(b.safe_persons())

ax.plot(sag_ratios * 100, capacities, color='#3b82f6', linewidth=2.5)
ax.fill_between(sag_ratios * 100, 0, capacities, alpha=0.15, color='#3b82f6')
ax.axvline(x=15, color='#f59e0b', linestyle='--', alpha=0.5)
ax.axvline(x=25, color='#f59e0b', linestyle='--', alpha=0.5)
ax.axhspan(0, 0, color='gray')  # dummy
ax.text(20, max(capacities)*0.5, 'Typical range\\\n(15-25%)', color='#f59e0b',
        fontsize=10, ha='center')
ax.set_xlabel('Sag ratio (%)', color='white', fontsize=11)
ax.set_ylabel('Safe capacity (persons)', color='white', fontsize=11)
ax.set_title('More sag = higher capacity (but harder to walk)', color='white', fontsize=12)

# Plot 3: Utilization under different loads
ax = axes[1, 0]
n_people = np.arange(0, 80)
util_normal = [bridge.utilization(n, 1.5) for n in n_people]
util_march = [bridge.utilization(n, 2.0) for n in n_people]

ax.plot(n_people, util_normal, color='#3b82f6', linewidth=2, label='Normal walking (DAF=1.5)')
ax.plot(n_people, util_march, color='#ef4444', linewidth=2, label='Marching in step (DAF=2.0)')
ax.axhline(y=1.0, color='#ef4444', linestyle='--', linewidth=2, alpha=0.7, label='Failure threshold')
ax.axhline(y=0.6, color='#f59e0b', linestyle=':', alpha=0.5, label='Recommended limit (60%)')
ax.fill_between(n_people, 0.6, 1.0, alpha=0.1, color='#f59e0b')
ax.fill_between(n_people, 1.0, 2.0, alpha=0.1, color='#ef4444')
ax.set_xlabel('Number of people on bridge', color='white', fontsize=11)
ax.set_ylabel('Utilization ratio', color='white', fontsize=11)
ax.set_title('Structural utilization vs crowd size', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 1.5)

# Plot 4: Parametric study — root count vs diameter
ax = axes[1, 1]
diameters = np.arange(5, 26)
for n in [2, 4, 6, 8]:
    caps = []
    for d in diameters:
        b = StructuralAnalyzer(25, 4, n, d, 42, 0.85, 3.0)
        caps.append(b.safe_persons())
    color = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'][[2,4,6,8].index(n)]
    ax.plot(diameters, caps, color=color, linewidth=2, label=f'{n} roots')

ax.axhline(y=20, color='white', linestyle=':', alpha=0.3, label='Typical village need')
ax.set_xlabel('Root diameter (cm)', color='white', fontsize=11)
ax.set_ylabel('Safe capacity (persons)', color='white', fontsize=11)
ax.set_title('Root count and diameter: design space', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

# Engineering report
print("Structural Analysis Report")
print("=" * 60)
print(f"Bridge: {bridge.span}m span, {bridge.sag}m sag (ratio {bridge.sag_ratio:.2f})")
print(f"Roots: {bridge.n_roots} x {bridge.root_diam*100:.0f}cm diameter")
print(f"Material: {bridge.tensile/1e6:.0f} MPa tensile, {bridge.anast_eff:.0%} anastomosis")
print(f"Safety factor: {bridge.SF}")
print()
print(f"Root area (each): {bridge.root_area_m2*1e4:.1f} cm^2")
print(f"Total tensile capacity: {bridge.total_capacity_N/1e3:.0f} kN")
print(f"Cable force factor: {bridge.cable_force_factor():.2f}")
print(f"Safe load (normal walking): {bridge.safe_load_N()/1e3:.0f} kN")
print(f"Safe persons (normal): {bridge.safe_persons(1.5)}")
print(f"Safe persons (marching): {bridge.safe_persons(2.0)}")
print()
print("Recommendation: limit to {0} persons, reduce to {1} during monsoon".format(
    int(bridge.safe_persons(1.5) * 0.6),  # 60% utilization target
    int(bridge.safe_persons(1.5) * 0.6 * 0.63)))  # monsoon moisture reduction`,
      challenge: 'Add a resonance analysis: calculate the fundamental natural frequency of the bridge (f = (1/2L) * sqrt(T/mu) where T is tension and mu is mass per unit length). If f is between 1.5-2.5 Hz (typical walking frequency), flag a resonance risk and recommend a maximum group size to avoid synchronized stepping.',
      successHint: 'Module 3 delivers the core engineering output: how many people can safely cross this bridge. The utilization chart is exactly what a conservation engineer needs to set posted load limits.',
    },
    {
      title: 'Environmental Risk Module — monsoon, earthquake, disease',
      concept: `Module 4 adjusts the structural capacity for real-world hazards. A bridge that is perfectly safe on a calm dry day may be dangerously overloaded during monsoon with strong winds and waterlogged roots.

**Monsoon loading**: During heavy rain, water accumulates on root surfaces and in the root network (epiphytes, moss, debris). This adds dead load — weight that reduces the bridge's remaining capacity for live load (people). Measurements on Khasi bridges show that monsoon dead load can increase by 30-60% due to water absorption and debris accumulation.

**Wind loading**: Meghalaya experiences strong winds, especially during nor'westers (bordoichila). Wind creates lateral forces on the bridge and anyone crossing it. For a person with a frontal area of ~0.6 m^2 in a 60 km/h wind, the wind force is approximately 120 N (about 12 kg equivalent). For the bridge structure itself (total lateral area ~20 m^2), wind force can reach 2400 N. This lateral loading is additive to vertical loading through vector combination.

**Seismic risk**: The Northeast India region is in Seismic Zone V (highest risk in India). Earthquakes create horizontal accelerations that add to vertical gravity loading. For a Zone V design earthquake (peak ground acceleration ~0.36g), the effective gravity becomes sqrt(1^2 + 0.36^2) * g = 1.063g — a 6.3% increase. But the dynamic amplification for a flexible structure like a root bridge can be 2-3x, so effective loading increases by 20-50%.

**Biological risks**: Root disease (fungal infections like Armillaria root rot, insect damage like wood borers) can reduce cross-sectional area and material strength. Annual inspection and maintenance (removing infected material, encouraging new root growth around damaged areas) is essential. We model disease probability as increasing with age beyond 100 years if maintenance is neglected.`,
      analogy: 'The risk module is like a weather adjustment for a flight plan. A plane can carry 200 passengers on a calm day, but if there is turbulence, headwinds, and icing conditions, the effective payload must be reduced to maintain safety margins. Our risk module does the same: it takes the calm-day capacity and reduces it for each active hazard until we reach the safe operational limit for actual conditions.',
      storyConnection: 'The story\'s climactic scene is the monsoon flood — the moment when every risk factor converges. The roots are waterlogged (reduced material strength), carrying extra water weight (increased dead load), in heavy rain (reduced visibility for crossing), with strong winds (lateral loading). Yet the bridge survives while the concrete bridge downstream does not. Our risk module quantifies exactly how close to failure the bridge actually was.',
      checkQuestion: 'During a monsoon storm, a bridge has: roots at 50% moisture content, 40% increased dead load from water/debris, 50 km/h crosswind, and a moderate earthquake (0.1g PGA) hits simultaneously. If the dry-day capacity is 40 persons, what is the storm capacity? Use the reduction factors from the lesson.',
      checkAnswer: 'Start with 40 persons. Moisture effect: 0.63 factor (from Module 2), reducing to 40 * 0.63 = 25.2 persons equivalent. Dead load increase: 40% more dead load means the live load capacity drops by roughly 40% of the dead-load-to-capacity ratio (estimated ~15% for a root bridge), so multiply by 0.85: 25.2 * 0.85 = 21.4. Wind lateral load: at 50 km/h, additional effective load per person is ~8 kg / 70 kg = 11%, so multiply by 0.89: 21.4 * 0.89 = 19.0. Earthquake DAF: at 0.1g PGA, flexible bridge DAF ~1.3, so multiply by 1/1.3 = 0.77: 19.0 * 0.77 = 14.6. Round down: 14 persons during the storm. This is 35% of the dry-day capacity.',
      codeIntro: 'Build the risk assessment module that computes capacity reduction factors for all environmental hazards.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# BIO-BRIDGE STRENGTH MODELER — Module 4: Environmental Risk
# ============================================================

class RiskModule:
    """Assesses environmental risk factors and adjusts bridge capacity."""

    def __init__(self, base_capacity_persons):
        self.base_capacity = base_capacity_persons
        self.factors = {}

    def moisture_factor(self, moisture_pct):
        """Capacity reduction due to moisture in root wood."""
        FSP = 28.0
        if moisture_pct < FSP:
            f = 1 - 0.5 * moisture_pct / FSP
        else:
            f = 0.5
        # Normalize to dry-season baseline (12% MC)
        baseline = 1 - 0.5 * 12 / FSP
        factor = f / baseline
        self.factors['moisture'] = factor
        return factor

    def dead_load_factor(self, rain_intensity_mm_hr):
        """Capacity reduction from water weight on bridge."""
        # Light rain: 5% increase in dead load
        # Heavy rain (>50 mm/hr): up to 40% increase
        dead_load_increase = 0.05 + 0.35 * min(1.0, rain_intensity_mm_hr / 50)
        # Dead load is typically 30% of total capacity, so increase affects capacity
        factor = 1 - dead_load_increase * 0.30
        self.factors['dead_load'] = factor
        return factor

    def wind_factor(self, wind_speed_kmh, n_persons=10):
        """Capacity reduction from lateral wind loading."""
        # Wind pressure = 0.5 * rho * v^2
        v_ms = wind_speed_kmh / 3.6
        rho = 1.225  # kg/m^3
        pressure = 0.5 * rho * v_ms**2  # Pa
        # Force on one person (frontal area 0.6 m^2)
        person_wind_N = pressure * 0.6
        # As fraction of person weight
        wind_fraction = person_wind_N / (70 * 9.81)
        # Vector combination: effective load = sqrt(gravity^2 + wind^2)
        factor = 1 / np.sqrt(1 + wind_fraction**2)
        self.factors['wind'] = factor
        return factor

    def seismic_factor(self, pga_g, bridge_natural_freq_hz=1.5):
        """Capacity reduction from seismic loading."""
        # Dynamic amplification factor for flexible bridge
        # Approximate: DAF = 1 + 2.5 * pga for natural freq 1-3 Hz
        daf = 1 + 2.5 * pga_g
        if 0.5 < bridge_natural_freq_hz < 3.0:
            daf *= 1.2  # resonance amplification
        factor = 1 / daf
        self.factors['seismic'] = factor
        return factor

    def disease_factor(self, age_years, maintenance_quality=0.7):
        """Capacity reduction from biological decay."""
        # Probability of significant decay
        if age_years < 50:
            decay_prob = 0.01
        elif age_years < 100:
            decay_prob = 0.05 * (1 - maintenance_quality)
        elif age_years < 200:
            decay_prob = 0.15 * (1 - maintenance_quality)
        else:
            decay_prob = 0.30 * (1 - maintenance_quality)

        # Expected strength reduction
        factor = 1 - decay_prob * 0.3  # decay affects ~30% of cross-section
        self.factors['disease'] = factor
        return factor

    def combined_factor(self):
        """Product of all risk factors."""
        combined = 1.0
        for f in self.factors.values():
            combined *= f
        return combined

    def adjusted_capacity(self):
        """Final safe capacity after all risk adjustments."""
        return int(self.base_capacity * self.combined_factor())

    def report(self):
        """Generate risk assessment report."""
        lines = []
        lines.append(f"Base capacity: {self.base_capacity} persons")
        lines.append(f"Risk factors:")
        for name, factor in self.factors.items():
            reduction_pct = (1 - factor) * 100
            lines.append(f"  {name:15s}: {factor:.3f} ({reduction_pct:+.1f}% capacity)")
        lines.append(f"Combined factor: {self.combined_factor():.3f}")
        lines.append(f"Adjusted capacity: {self.adjusted_capacity()} persons")
        return '\\\n'.join(lines)


# --- Scenario analysis ---
base_cap = 40  # dry-day capacity from Module 3

# Define scenarios
scenarios = {
    'Dry season, calm': {
        'moisture': 12, 'rain': 0, 'wind': 5, 'pga': 0, 'age': 100, 'maint': 0.8
    },
    'Light monsoon rain': {
        'moisture': 35, 'rain': 10, 'wind': 15, 'pga': 0, 'age': 100, 'maint': 0.8
    },
    'Heavy monsoon storm': {
        'moisture': 55, 'rain': 60, 'wind': 50, 'pga': 0, 'age': 100, 'maint': 0.8
    },
    'Monsoon + earthquake': {
        'moisture': 50, 'rain': 40, 'wind': 30, 'pga': 0.15, 'age': 100, 'maint': 0.8
    },
    'Old bridge, neglected': {
        'moisture': 30, 'rain': 20, 'wind': 20, 'pga': 0.05, 'age': 250, 'maint': 0.3
    },
    'Worst case': {
        'moisture': 60, 'rain': 80, 'wind': 70, 'pga': 0.36, 'age': 200, 'maint': 0.4
    },
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Environmental Risk Assessment: Capacity Under Adverse Conditions',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Capacity by scenario (waterfall chart)
ax = axes[0, 0]
scenario_names = list(scenarios.keys())
capacities = []
for name, params in scenarios.items():
    risk = RiskModule(base_cap)
    risk.moisture_factor(params['moisture'])
    risk.dead_load_factor(params['rain'])
    risk.wind_factor(params['wind'])
    risk.seismic_factor(params['pga'])
    risk.disease_factor(params['age'], params['maint'])
    capacities.append(risk.adjusted_capacity())

colors_scen = ['#22c55e', '#84cc16', '#f59e0b', '#ef4444', '#a855f7', '#dc2626']
bars = ax.barh(scenario_names, capacities, color=colors_scen, edgecolor='none', height=0.6)
for bar, cap in zip(bars, capacities):
    ax.text(cap + 0.5, bar.get_y() + bar.get_height()/2,
            f'{cap} persons', va='center', color='white', fontsize=9)
ax.axvline(x=base_cap, color='white', linestyle='--', alpha=0.3, label=f'Base: {base_cap}')
ax.set_xlabel('Safe capacity (persons)', color='white', fontsize=11)
ax.set_title('Capacity under different conditions', color='white', fontsize=12)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(axis='y', labelcolor='white', labelsize=8)

# Plot 2: Risk factor breakdown for heavy storm
ax = axes[0, 1]
storm = scenarios['Heavy monsoon storm']
risk = RiskModule(base_cap)
factors_list = [
    ('Moisture (55%)', risk.moisture_factor(storm['moisture'])),
    ('Rain load (60mm/hr)', risk.dead_load_factor(storm['rain'])),
    ('Wind (50km/h)', risk.wind_factor(storm['wind'])),
    ('Seismic (none)', risk.seismic_factor(storm['pga'])),
    ('Disease (100yr, maintained)', risk.disease_factor(storm['age'], storm['maint'])),
]

cumulative = base_cap
values = [base_cap]
labels = ['Base capacity']
colors_waterfall = ['#22c55e']

for fname, fval in factors_list:
    reduction = cumulative * (1 - fval)
    cumulative -= reduction
    values.append(-reduction)
    labels.append(fname)
    colors_waterfall.append('#ef4444')

values.append(cumulative)
labels.append('Final capacity')
colors_waterfall.append('#3b82f6')

# Simple bar chart showing contributions
factor_names = [f[0] for f in factors_list]
factor_reductions = [(1 - f[1]) * 100 for f in factors_list]
ax.barh(factor_names, factor_reductions, color='#ef4444', edgecolor='none', height=0.5, alpha=0.8)
for i, (name, red) in enumerate(zip(factor_names, factor_reductions)):
    ax.text(red + 0.5, i, f'{red:.1f}%', va='center', color='white', fontsize=9)
ax.set_xlabel('Capacity reduction (%)', color='white', fontsize=11)
ax.set_title('Risk factor breakdown: Heavy monsoon storm', color='white', fontsize=12)
ax.tick_params(axis='y', labelcolor='white', labelsize=8)

# Plot 3: Seasonal capacity curve
ax = axes[1, 0]
months = np.arange(1, 13)
month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
# Typical Meghalaya conditions by month
monthly_moisture = [15, 15, 20, 30, 45, 55, 60, 55, 45, 30, 20, 15]
monthly_rain = [2, 3, 10, 30, 50, 70, 80, 60, 40, 15, 5, 2]
monthly_wind = [10, 10, 20, 30, 25, 30, 25, 20, 15, 10, 10, 10]

monthly_capacity = []
for m in range(12):
    risk = RiskModule(base_cap)
    risk.moisture_factor(monthly_moisture[m])
    risk.dead_load_factor(monthly_rain[m])
    risk.wind_factor(monthly_wind[m])
    risk.seismic_factor(0)  # no earthquake
    risk.disease_factor(100, 0.8)
    monthly_capacity.append(risk.adjusted_capacity())

ax.bar(month_names, monthly_capacity, color=[
    '#22c55e' if c > 30 else '#f59e0b' if c > 20 else '#ef4444'
    for c in monthly_capacity], edgecolor='none')
ax.axhline(y=base_cap, color='white', linestyle='--', alpha=0.3)
for i, c in enumerate(monthly_capacity):
    ax.text(i, c + 0.5, str(c), ha='center', color='white', fontsize=8)
ax.set_ylabel('Safe capacity (persons)', color='white', fontsize=11)
ax.set_title('Seasonal capacity variation (Meghalaya)', color='white', fontsize=12)
ax.tick_params(axis='x', labelcolor='white', labelsize=9)

# Plot 4: Age and maintenance interaction
ax = axes[1, 1]
ages_risk = np.arange(10, 301)
for mq, color, label in [(0.9, '#22c55e', 'Excellent maintenance'),
                           (0.7, '#3b82f6', 'Average'),
                           (0.4, '#f59e0b', 'Poor'),
                           (0.1, '#ef4444', 'Neglected')]:
    caps_age = []
    for age in ages_risk:
        risk = RiskModule(base_cap)
        risk.moisture_factor(15)  # dry season
        risk.dead_load_factor(0)
        risk.wind_factor(5)
        risk.seismic_factor(0)
        risk.disease_factor(age, mq)
        caps_age.append(risk.adjusted_capacity())
    ax.plot(ages_risk, caps_age, color=color, linewidth=2, label=label)

ax.set_xlabel('Bridge age (years)', color='white', fontsize=11)
ax.set_ylabel('Safe capacity (persons)', color='white', fontsize=11)
ax.set_title('Maintenance quality determines longevity', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

# Print reports
print("Environmental Risk Assessment Summary")
print("=" * 60)
for name, params in scenarios.items():
    risk = RiskModule(base_cap)
    risk.moisture_factor(params['moisture'])
    risk.dead_load_factor(params['rain'])
    risk.wind_factor(params['wind'])
    risk.seismic_factor(params['pga'])
    risk.disease_factor(params['age'], params['maint'])
    print(f"\\\n{name}:")
    print(risk.report())

print()
print("SEASONAL POSTED LIMITS (recommended):")
for i, name in enumerate(month_names):
    print(f"  {name}: {monthly_capacity[i]} persons max")`,
      challenge: 'Add a climate change projection: if average temperatures increase by 2C and monsoon intensity increases by 20% by 2050, how does the seasonal capacity curve shift? Is the bridge still viable? Model the projection and provide adaptation recommendations.',
      successHint: 'Module 4 completes the safety engineering. The seasonal capacity chart is exactly what Meghalaya\'s tourism board needs: a month-by-month posted limit for each bridge, backed by physics rather than guesswork.',
    },
    {
      title: 'Visualization Dashboard — the complete Bio-Bridge Strength Modeler',
      concept: `Module 5 integrates all four previous modules into a single dashboard. This is the deployable product — a tool that takes bridge parameters as input and produces a comprehensive engineering assessment as output.

**Dashboard design principles**: Every panel must answer a specific question that a conservation engineer would ask:
1. "How old is this bridge and how has it grown?" (Growth trajectory)
2. "How strong is it right now?" (Current material properties)
3. "How many people can cross safely today?" (Structural capacity)
4. "What are the risks?" (Environmental hazard assessment)
5. "What should I recommend?" (Actionable engineering advice)
6. "How does it compare to alternatives?" (Decision support)

**Input parameters**: Species, age (years), number of main roots, average root diameter (cm), span (m), sag (m), current moisture content (%), maintenance quality (0-1), and any active hazards (wind, rain, seismic).

**Output**: A 6-panel visualization plus a text report with specific recommendations: posted load limit by season, maintenance schedule, comparison to building a conventional replacement, and a 50-year projection (will the bridge continue to strengthen or is it at risk of decay?).

This is the complete capstone — a real engineering tool built from first principles, module by module.`,
      analogy: 'The dashboard is the cockpit instrument panel of our engineering tool. A pilot does not read raw sensor data — she reads instruments that synthesize altitude, speed, fuel, weather, and navigation into actionable displays. Our dashboard synthesizes growth biology, material science, structural mechanics, and risk assessment into actionable engineering recommendations. Each panel is one instrument.',
      storyConnection: 'Imagine the village elder from the story having this tool on a tablet. Before the monsoon, he checks the dashboard: "Bridge capacity drops to 18 persons in July. We need to limit tourist groups to 15 and schedule maintenance for October." This is the bridge between traditional knowledge and modern engineering — respecting the elder\'s centuries of inherited wisdom while adding the quantitative precision that conservation agencies require.',
      checkQuestion: 'A conservation engineer wants to register a living root bridge as a protected heritage structure. She needs to demonstrate it meets Indian Roads Congress safety standards. What data from our dashboard would she submit?',
      checkAnswer: 'She would submit: (1) Structural capacity with safety factor 3.0, showing the bridge exceeds IRC\'s required factor of 2.5 for pedestrian bridges. (2) Seasonal capacity chart showing minimum capacity (monsoon) still exceeds expected peak traffic. (3) Environmental risk assessment for Zone V seismic, monsoon, and wind hazards. (4) 50-year maintenance and monitoring plan. (5) Comparison showing the living bridge has lower lifecycle risk than a conventional replacement. Our dashboard generates all of this from a single set of measurements.',
      codeIntro: 'Build the complete integrated dashboard combining all four modules into a 6-panel engineering assessment.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# BIO-BRIDGE STRENGTH MODELER — Complete Integrated Dashboard
# ============================================================

# --- Integrated Model (all modules combined) ---
class BioBridgeModeler:
    """Complete Bio-Bridge Strength Modeler integrating all modules."""

    def __init__(self, species='ficus_elastica', age=100, n_roots=6,
                 root_diameter_cm=15, span_m=25, sag_m=4,
                 moisture_pct=15, maintenance=0.8, temperature_C=25):
        self.species = species
        self.age = age
        self.n_roots = n_roots
        self.root_diam_cm = root_diameter_cm
        self.span = span_m
        self.sag = sag_m
        self.moisture = moisture_pct
        self.maintenance = maintenance
        self.temperature = temperature_C

        # Species data
        self.sp = {
            'max_diam': 25.0, 'growth_rate': 0.04, 'inflection': 40,
            'base_tensile': 30, 'mature_tensile': 50,
            'mfa_young': 30, 'mfa_mature': 12,
            'density_young': 450, 'density_mature': 700,
        }

    def growth_diameter(self, age):
        return self.sp['max_diam'] / (1 + np.exp(-self.sp['growth_rate'] * (age - self.sp['inflection'])))

    def tensile_strength(self, age, mc):
        maturity = 1 - np.exp(-0.03 * age)
        base = self.sp['base_tensile'] + maturity * (self.sp['mature_tensile'] - self.sp['base_tensile'])
        mfa = self.sp['mfa_young'] - maturity * (self.sp['mfa_young'] - self.sp['mfa_mature'])
        mfa_factor = np.cos(np.deg2rad(mfa))**2 / np.cos(np.deg2rad(self.sp['mfa_mature']))**2
        mc_factor = min(1 - 0.5 * mc / 28, 0.5) if mc >= 28 else 1 - 0.5 * mc / 28
        return base * mfa_factor * mc_factor

    def structural_capacity(self, n_roots, diam_cm, tensile, anast=0.85, sf=3, daf=1.5):
        area = np.pi * (diam_cm / 200)**2
        total_T = n_roots * area * tensile * 1e6 * anast
        cff = np.sqrt(1 + (self.span / (4 * self.sag))**2)
        return total_T / cff / sf / daf / (70 * 9.81)

    def risk_adjusted_capacity(self, base_cap, mc, rain_mm, wind_kmh, pga, age, maint):
        # Moisture
        if mc < 28:
            mf = (1 - 0.5 * mc / 28) / (1 - 0.5 * 12 / 28)
        else:
            mf = 0.5 / (1 - 0.5 * 12 / 28)
        # Dead load
        dl = 1 - (0.05 + 0.35 * min(1, rain_mm / 50)) * 0.3
        # Wind
        v = wind_kmh / 3.6
        wf = 1 / np.sqrt(1 + (0.5 * 1.225 * v**2 * 0.6 / (70 * 9.81))**2)
        # Seismic
        sf = 1 / (1 + 2.5 * pga)
        # Disease
        if age < 50: dp = 0.01
        elif age < 100: dp = 0.05 * (1 - maint)
        elif age < 200: dp = 0.15 * (1 - maint)
        else: dp = 0.30 * (1 - maint)
        df = 1 - dp * 0.3
        return int(base_cap * mf * dl * wf * sf * df)

    def run_dashboard(self):
        """Generate complete 6-panel dashboard."""
        fig, axes = plt.subplots(2, 3, figsize=(18, 11))
        fig.patch.set_facecolor('#1f2937')
        fig.suptitle(f'Bio-Bridge Strength Modeler: {self.species.replace("_", " ").title()}\\\n'
                     f'Age: {self.age}yr | Span: {self.span}m | Roots: {self.n_roots} x {self.root_diam_cm}cm',
                     color='white', fontsize=14, fontweight='bold')
        for ax in axes.flat:
            ax.set_facecolor('#111827')
            ax.tick_params(colors='gray')

        # PANEL 1: Growth trajectory
        ax = axes[0, 0]
        ages = np.arange(0, 201)
        diams = [self.growth_diameter(a) for a in ages]
        ax.plot(ages, diams, color='#22c55e', linewidth=2)
        ax.axvline(x=self.age, color='#f59e0b', linewidth=2, linestyle='--', label=f'Current ({self.age}yr)')
        ax.plot(self.age, self.growth_diameter(self.age), 'o', color='#f59e0b', markersize=10, zorder=5)
        ax.set_xlabel('Age (years)', color='white')
        ax.set_ylabel('Root diameter (cm)', color='white')
        ax.set_title('1. Growth Trajectory', color='#22c55e', fontsize=12)
        ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

        # PANEL 2: Current material properties gauge
        ax = axes[0, 1]
        current_tensile = self.tensile_strength(self.age, self.moisture)
        max_tensile = self.sp['mature_tensile']
        maturity = 1 - np.exp(-0.03 * self.age)
        mfa = self.sp['mfa_young'] - maturity * (self.sp['mfa_young'] - self.sp['mfa_mature'])

        props = ['Tensile\\\nstrength', 'MFA\\\n(lower=better)', 'Maturity', 'Moisture\\\neffect']
        vals_pct = [
            current_tensile / max_tensile * 100,
            (1 - mfa / self.sp['mfa_young']) * 100,
            maturity * 100,
            (self.tensile_strength(self.age, self.moisture) /
             self.tensile_strength(self.age, 0)) * 100,
        ]
        actual_vals = [f'{current_tensile:.1f} MPa', f'{mfa:.1f}\°',
                       f'{maturity*100:.0f}%', f'{vals_pct[3]:.0f}%']
        colors_gauge = ['#22c55e' if v > 70 else '#f59e0b' if v > 40 else '#ef4444' for v in vals_pct]

        bars = ax.barh(props, vals_pct, color=colors_gauge, edgecolor='none', height=0.5)
        for bar, val, txt in zip(bars, vals_pct, actual_vals):
            ax.text(val + 2, bar.get_y() + bar.get_height()/2, txt,
                    va='center', color='white', fontsize=9)
        ax.set_xlim(0, 120)
        ax.set_xlabel('Property score (%)', color='white')
        ax.set_title('2. Material Properties', color='#3b82f6', fontsize=12)
        ax.tick_params(axis='y', labelcolor='white', labelsize=9)

        # PANEL 3: Structural capacity
        ax = axes[0, 2]
        base_cap = int(self.structural_capacity(
            self.n_roots, self.root_diam_cm,
            self.tensile_strength(self.age, 12)))  # dry season

        n_people = np.arange(0, base_cap + 20)
        utilization = n_people * 70 * 9.81 / (base_cap * 70 * 9.81) * 100

        ax.fill_between(n_people, 0, utilization,
                        where=utilization <= 60, color='#22c55e', alpha=0.3)
        ax.fill_between(n_people, 0, utilization,
                        where=(utilization > 60) & (utilization <= 100), color='#f59e0b', alpha=0.3)
        ax.fill_between(n_people, 0, utilization,
                        where=utilization > 100, color='#ef4444', alpha=0.3)
        ax.plot(n_people, utilization, color='white', linewidth=2)
        ax.axhline(y=100, color='#ef4444', linestyle='--', linewidth=2, label='Failure')
        ax.axhline(y=60, color='#f59e0b', linestyle=':', label='Recommended limit')
        ax.set_xlabel('People on bridge', color='white')
        ax.set_ylabel('Utilization (%)', color='white')
        ax.set_title(f'3. Structural Capacity: {base_cap} persons', color='#f59e0b', fontsize=12)
        ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
        ax.set_ylim(0, 150)

        # PANEL 4: Seasonal capacity
        ax = axes[1, 0]
        month_names = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
        monthly_mc = [15, 15, 20, 30, 45, 55, 60, 55, 45, 30, 20, 15]
        monthly_rain = [2, 3, 10, 30, 50, 70, 80, 60, 40, 15, 5, 2]
        monthly_wind = [10, 10, 20, 30, 25, 30, 25, 20, 15, 10, 10, 10]

        monthly_cap = [self.risk_adjusted_capacity(
            base_cap, monthly_mc[m], monthly_rain[m], monthly_wind[m], 0,
            self.age, self.maintenance) for m in range(12)]

        colors_month = ['#22c55e' if c > base_cap*0.7 else '#f59e0b' if c > base_cap*0.4
                        else '#ef4444' for c in monthly_cap]
        ax.bar(month_names, monthly_cap, color=colors_month, edgecolor='none')
        ax.axhline(y=base_cap, color='white', linestyle='--', alpha=0.3, label='Max (dry)')
        for i, c in enumerate(monthly_cap):
            ax.text(i, c + 0.5, str(c), ha='center', color='white', fontsize=8)
        ax.set_ylabel('Safe capacity (persons)', color='white')
        ax.set_title('4. Seasonal Posted Limits', color='#ef4444', fontsize=12)
        ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

        # PANEL 5: 50-year projection
        ax = axes[1, 1]
        future_ages = np.arange(self.age, self.age + 51)
        future_cap_maintained = []
        future_cap_neglected = []
        for a in future_ages:
            d = self.growth_diameter(a)
            ts_m = self.tensile_strength(a, 12)
            cap_m = int(self.structural_capacity(self.n_roots, d, ts_m))
            cap_m_adj = self.risk_adjusted_capacity(cap_m, 15, 5, 10, 0, a, 0.8)
            future_cap_maintained.append(cap_m_adj)
            cap_n_adj = self.risk_adjusted_capacity(cap_m, 15, 5, 10, 0, a, 0.2)
            future_cap_neglected.append(cap_n_adj)

        ax.plot(future_ages, future_cap_maintained, color='#22c55e', linewidth=2,
                label='With maintenance')
        ax.plot(future_ages, future_cap_neglected, color='#ef4444', linewidth=2,
                label='If neglected')
        ax.fill_between(future_ages, future_cap_neglected, future_cap_maintained,
                        alpha=0.15, color='#f59e0b')
        ax.axhline(y=20, color='white', linestyle=':', alpha=0.3, label='Village need (20)')
        ax.set_xlabel('Bridge age (years)', color='white')
        ax.set_ylabel('Dry-season capacity', color='white')
        ax.set_title('5. 50-Year Projection', color='#a855f7', fontsize=12)
        ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

        # PANEL 6: Comparison with conventional bridges
        ax = axes[1, 2]
        comparison = {
            'Living root\\\n(this bridge)': {'cost_200yr': 10500, 'carbon_200yr': -12000, 'color': '#22c55e'},
            'Steel truss': {'cost_200yr': 1000000, 'carbon_200yr': 200000, 'color': '#3b82f6'},
            'RC bridge': {'cost_200yr': 900000, 'carbon_200yr': 350000, 'color': '#f59e0b'},
        }

        names_comp = list(comparison.keys())
        costs = [comparison[n]['cost_200yr'] / 1000 for n in names_comp]
        carbons = [comparison[n]['carbon_200yr'] / 1000 for n in names_comp]
        colors_comp = [comparison[n]['color'] for n in names_comp]

        x_pos = np.arange(len(names_comp))
        width = 0.35
        bars1 = ax.bar(x_pos - width/2, costs, width, color=colors_comp, alpha=0.8,
                        label='200yr cost ($k)')
        bars2 = ax.bar(x_pos + width/2, carbons, width, color=colors_comp, alpha=0.4,
                        label='200yr CO\₂ (tonnes)', edgecolor=colors_comp, linewidth=2)

        ax.set_xticks(x_pos)
        ax.set_xticklabels(names_comp, color='white', fontsize=8)
        ax.set_ylabel('Value (thousands)', color='white')
        ax.set_title('6. vs Conventional (200yr)', color='white', fontsize=12)
        ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
        ax.axhline(y=0, color='gray', linewidth=0.5)

        plt.tight_layout(rect=[0, 0, 1, 0.93])
        plt.show()

        return base_cap, monthly_cap, future_cap_maintained

# --- Run the complete dashboard ---
modeler = BioBridgeModeler(
    species='ficus_elastica', age=100, n_roots=6,
    root_diameter_cm=15, span_m=25, sag_m=4,
    moisture_pct=15, maintenance=0.8, temperature_C=25
)

base_cap, monthly_cap, projection = modeler.run_dashboard()

# Print comprehensive report
print("=" * 70)
print("BIO-BRIDGE STRENGTH MODELER — ENGINEERING ASSESSMENT REPORT")
print("=" * 70)
print()
print("BRIDGE IDENTIFICATION")
print(f"  Species: Ficus elastica (Indian Rubber Fig)")
print(f"  Estimated age: 100 years")
print(f"  Span: 25 m | Sag: 4 m | Sag ratio: 0.16")
print(f"  Load-bearing roots: 6 | Average diameter: 15 cm")
print()
print("STRUCTURAL ASSESSMENT")
print(f"  Dry-season capacity: {base_cap} persons (safety factor 3.0)")
print(f"  Recommended operational limit: {int(base_cap * 0.6)} persons (60% utilization)")
print(f"  Monsoon minimum (July): {min(monthly_cap)} persons")
print()
print("POSTED LIMITS (recommended)")
month_full = ['January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December']
for i, (name, cap) in enumerate(zip(month_full, monthly_cap)):
    status = "GREEN" if cap > base_cap * 0.7 else "AMBER" if cap > base_cap * 0.4 else "RED"
    print(f"  {name:12s}: {cap:3d} persons  [{status}]")
print()
print("50-YEAR PROJECTION")
print(f"  With maintenance: capacity increases to {projection[-1]} by year {100+50}")
print(f"  Without maintenance: capacity declines — INTERVENTION NEEDED")
print()
print("RECOMMENDATION: This bridge is structurally sound and should be")
print("registered as a protected heritage structure. Seasonal load limits")
print("should be posted at both entrances. Annual inspection recommended")
print("in October (post-monsoon) to assess any storm damage.")
print()
print("Report generated by Bio-Bridge Strength Modeler v1.0")
print("Based on physics-based growth, material, structural, and risk models")`,
      challenge: 'Add an input interface: let the user modify bridge parameters (age, root count, span) and instantly regenerate the dashboard. Also add a "What If" panel that shows what happens if 2 roots are lost (e.g., storm damage) — how does the capacity change and how long until natural regrowth restores it?',
      successHint: 'You have built a complete, deployable engineering tool from first principles. It integrates plant biology (growth model), materials science (property engine), structural mechanics (catenary analysis), and risk engineering (hazard assessment) into a single dashboard. This is portfolio-quality work that demonstrates interdisciplinary engineering thinking.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (bioengineering foundations)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Bio-Bridge Strength Modeler. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
