import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import BanyanAllometryDiagram from '../diagrams/BanyanAllometryDiagram';
import BanyanRespirationDiagram from '../diagrams/BanyanRespirationDiagram';
import BanyanWaterPotentialDiagram from '../diagrams/BanyanWaterPotentialDiagram';
import BanyanPopulationDiagram from '../diagrams/BanyanPopulationDiagram';
import BanyanCarbonFluxDiagram from '../diagrams/BanyanCarbonFluxDiagram';
import BanyanClimateResponseDiagram from '../diagrams/BanyanClimateResponseDiagram';

export default function BanyanTreeLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Strangler fig life cycle — modeling parasitic growth dynamics',
      concept: `The banyan (Ficus benghalensis) is a strangler fig: it germinates in the canopy of a host tree, sends roots downward, and eventually envelops and kills the host. This is not parasitism in the usual sense — the banyan does not feed on the host. Instead, it competes for light above and water below, slowly shading out and root-competing the host to death over decades.

The growth dynamics follow a logistic competition model:

dB/dt = r_B * B * (1 - (B + alpha*H) / K_B)
dH/dt = r_H * H * (1 - (H + beta*B) / K_H)

Where B = banyan biomass, H = host biomass, r = growth rates, K = carrying capacities, and alpha/beta = competition coefficients. The critical asymmetry: alpha (banyan's effect on host) is much larger than beta (host's effect on banyan) because the banyan attacks from both above (light competition) and below (root competition).

The outcome depends on timing. A banyan seed that lands on a vigorous young tree faces strong competition. One that lands on an old, declining tree faces weak competition. This is why banyans often succeed on ancient host trees — the host is already weakening.`,
      analogy: 'The banyan growth pattern is like a corporate takeover in slow motion. The acquiring company (banyan) starts small — a satellite office inside the target company building (seed in the canopy). It gradually expands, taking over floor after floor (sending down aerial roots), until the original company is squeezed out entirely. The building (ecological niche) remains, but the occupant has changed.',
      storyConnection: 'The ancient banyan in the story sheltered an entire village beneath its canopy. That immense spread started from a single seed lodged in a host tree crack, perhaps centuries ago. The host tree is long gone — dissolved into the banyan lattice of aerial roots. The story captures the end state; our model captures the journey.',
      checkQuestion: 'Why does the competition model predict that banyans rarely succeed on young, vigorous host trees?',
      checkAnswer: 'A young host tree has high growth rate r_H and high remaining capacity (H is far from K_H). The host can outgrow the banyan seedling — adding biomass faster than the banyan can establish root contact and begin light competition. The competition coefficient beta (host suppressing banyan) dominates when the host is vigorous. Only when the host is old (H near K_H, growth slowing) does the banyan asymmetry (alpha >> beta) take effect.',
      codeIntro: 'Simulate the Lotka-Volterra competition model for banyan vs. host tree over a 200-year timeline.',
      code: `import numpy as np

np.random.seed(42)

# --- Lotka-Volterra competition: Banyan vs Host ---
def simulate_competition(B0, H0, r_B, r_H, K_B, K_H, alpha, beta, years=200, dt=0.1):
    """Simulate banyan-host competition dynamics.

    B = banyan biomass, H = host biomass
    alpha = banyan's competitive effect on host (high)
    beta = host's competitive effect on banyan (low)
    """
    steps = int(years / dt)
    t = np.linspace(0, years, steps)
    B = np.zeros(steps)
    H = np.zeros(steps)
    B[0], H[0] = B0, H0

    for i in range(1, steps):
        dB = r_B * B[i-1] * (1 - (B[i-1] + alpha * H[i-1]) / K_B)
        dH = r_H * H[i-1] * (1 - (H[i-1] + beta * B[i-1]) / K_H)
        B[i] = max(0, B[i-1] + dB * dt)
        H[i] = max(0, H[i-1] + dH * dt)

    return t, B, H

# Scenario 1: Banyan on old host (typical success)
t1, B1, H1 = simulate_competition(
    B0=0.5, H0=80,       # tiny banyan, large old host
    r_B=0.08, r_H=0.02,  # banyan grows faster than aging host
    K_B=100, K_H=100,
    alpha=1.8,            # banyan strongly suppresses host
    beta=0.3,             # host weakly suppresses banyan
    years=200
)

# Scenario 2: Banyan on young host (typical failure)
t2, B2, H2 = simulate_competition(
    B0=0.5, H0=20,       # tiny banyan, small vigorous host
    r_B=0.08, r_H=0.12,  # young host grows faster
    K_B=100, K_H=100,
    alpha=1.8, beta=0.3,
    years=200
)

# Scenario 3: Equal competitors (rare stalemate)
t3, B3, H3 = simulate_competition(
    B0=0.5, H0=50,
    r_B=0.06, r_H=0.06,
    K_B=100, K_H=100,

print("\n[Full visualization available in the playground]")`,
      challenge: 'Add environmental stochasticity: multiply each growth rate by (1 + noise) where noise is drawn from a normal distribution each year. Run 100 simulations and plot the distribution of outcomes. What fraction of the time does the banyan win on a young host?',
      successHint: 'You can now model competition dynamics between strangler fig and host tree — the ecological foundation of banyan biology.',
    },
    {
      title: 'Aerial root biomechanics — modeling structural support systems',
      concept: `Banyan aerial roots are engineering marvels. Starting as thin, flexible filaments hanging from branches, they thicken upon reaching the ground and eventually become load-bearing pillars. A single banyan can have thousands of aerial roots forming a distributed support system.

The biomechanics involve two phases:

**Phase 1 — Pendant root (hanging)**: The root hangs in tension, loaded by its own weight. Its diameter is limited by the branch's carrying capacity. Stress = Force / Area = (mass × g) / (π × r²). If stress exceeds the root tissue's tensile strength (~10 MPa for young aerial roots), the root breaks.

**Phase 2 — Pillar root (grounded)**: Once rooted, the aerial root transitions from tension to compression. It thickens through secondary growth, eventually supporting branch loads. The critical parameter is the **slenderness ratio** L/r (length/radius): tall, thin roots buckle; short, thick roots are stable. Euler's buckling load: P_cr = π²EI/L² where E = elastic modulus, I = moment of inertia = πr⁴/4.

The distributed pillar system gives banyans extraordinary stability. Unlike a single-trunk tree that fails catastrophically if the trunk breaks, a banyan with 100 pillar roots can lose 20% and still stand. This is **structural redundancy** — the same principle used in bridge engineering.`,
      analogy: 'A banyan root system is like a tent held up by many poles instead of one central mast. If a storm breaks one pole, the tent sags locally but does not collapse. A cathedral with one massive column fails if that column cracks; a banyan-like structure with many smaller columns degrades gracefully. This is why banyans survive cyclones that topple conventional trees.',
      storyConnection: 'The story describes children playing among the aerial roots — each root thick as a small tree trunk. Those roots started as threads and grew into pillars through decades of secondary growth. The biomechanical transition from pendant filament to load-bearing column is the hidden engineering that makes the banyan a living building.',
      checkQuestion: 'Why does the slenderness ratio L/r matter more than absolute root diameter for structural stability?',
      checkAnswer: 'A root that is 10cm in diameter and 1m tall is extremely stable. The same 10cm root at 10m tall would buckle under modest loads. Euler buckling load scales as r⁴/L² — so doubling the length reduces the critical load by 4x, while doubling the radius increases it by 16x. Slenderness ratio captures this scaling: a thick, short root (low L/r) is always more stable than a thin, tall one (high L/r), regardless of absolute size.',
      codeIntro: 'Model the biomechanics of aerial root development from pendant phase through grounded pillar phase, computing structural loads and safety factors.',
      code: `import numpy as np

np.random.seed(42)

# --- Aerial Root Biomechanics Model ---
class AerialRoot:
    """Model a single banyan aerial root through its lifecycle."""

    def __init__(self, branch_height, initial_diameter=0.002):
        self.branch_height = branch_height  # meters
        self.diameter = initial_diameter     # meters (starts as 2mm thread)
        self.length = 0.1                    # initial hanging length
        self.grounded = False
        self.age = 0                         # years

        # Material properties
        self.density = 800          # kg/m³ (green wood)
        self.tensile_strength = 10e6  # Pa (10 MPa)
        self.elastic_modulus = 2e9    # Pa (2 GPa — young wood)
        self.growth_rate_diameter = 0.003  # m/year radial growth
        self.growth_rate_length = 0.5      # m/year downward growth

    def radius(self):
        return self.diameter / 2

    def cross_section_area(self):
        return np.pi * self.radius()**2

    def mass(self):
        return self.density * self.cross_section_area() * self.length

    def tensile_stress(self):
        """Stress when hanging (pendant phase)."""
        if self.grounded:
            return 0
        return (self.mass() * 9.81) / self.cross_section_area()

    def safety_factor_tension(self):
        stress = self.tensile_stress()
        return self.tensile_strength / stress if stress > 0 else float('inf')

    def moment_of_inertia(self):
        return np.pi * self.radius()**4 / 4

    def euler_buckling_load(self):
        """Critical buckling load (compression, grounded phase)."""
        if not self.grounded or self.length < 0.01:
            return float('inf')
        return np.pi**2 * self.elastic_modulus * self.moment_of_inertia() / self.length**2


print("\n[Full visualization available in the playground]")`,
      challenge: 'Simulate 50 aerial roots at different branch heights (4-15m) with random variation in growth rates. Plot the distribution of grounding times and final diameters. Which branch height produces the most structurally effective pillars?',
      successHint: 'You can now model the biomechanical lifecycle of aerial roots — from pendant filament to load-bearing pillar.',
    },
    {
      title: 'Canopy expansion — modeling spatial growth with fractal branching',
      concept: `A mature banyan's canopy can cover over 20,000 m². This extraordinary spread follows fractal branching patterns: each branch produces sub-branches at characteristic angles and length ratios, creating a self-similar structure across scales.

The **L-system** (Lindenmayer system) is the standard model for plant branching:
- Start with an axiom (trunk): "F"
- Apply production rules iteratively: F -> F[+F]F[-F]F
- F = draw forward, + = turn left, - = turn right, [ = push state, ] = pop state

For banyans, we add aerial root rules:
- At each branch node, there is a probability of dropping an aerial root.
- Roots that reach the ground become new support points.
- New support points enable further canopy extension (branches can grow longer when supported).

This creates a **positive feedback loop**: more roots → more support → longer branches → more canopy area → more root drop points → more roots. This is why banyans expand exponentially once established — each new pillar enables further expansion.

The canopy shape is not circular but **lobate** — extending further in directions with more successful root establishment. Wind, light, and soil conditions create asymmetric root success, producing the irregular outlines seen in real banyans.`,
      analogy: 'Banyan canopy expansion is like a city growing along highways. The first highway (trunk) enables suburban development (branches). Successful suburbs build their own exits (aerial roots), which become new growth centers. The city does not expand uniformly — it follows infrastructure. The banyan does not expand uniformly — it follows its root-pillar infrastructure.',
      storyConnection: 'The story describes the banyan as a living village — its canopy sheltering homes, markets, and gathering places. That canopy shape was not planned; it emerged from decades of fractal branching guided by where aerial roots succeeded. The tree is not an architect — it is an emergent system, building its structure from simple local rules repeated thousands of times.',
      checkQuestion: 'Why does the positive feedback between roots and canopy expansion eventually slow down?',
      checkAnswer: 'Resource limitation. Each new branch and root competes with existing ones for water (finite soil moisture), light (self-shading within the canopy), and nutrients. As the tree gets larger, the ratio of photosynthetic canopy surface to total biomass decreases (the square-cube law). Eventually, the metabolic cost of maintaining existing structure exceeds the energy gained from new expansion. The growth curve is logistic, not exponential.',
      codeIntro: 'Simulate banyan canopy growth using an L-system with aerial root feedback, visualizing the expanding crown over time.',
      code: `import numpy as np

np.random.seed(42)

# --- L-system Banyan Growth Model ---
class BanyanGrowth:
    """Simulate banyan canopy expansion with aerial root feedback."""

    def __init__(self):
        self.branches = []       # (x1,y1,x2,y2,generation)
        self.roots = []          # (x, y_branch, y_ground, is_grounded)
        self.support_points = [(0, 0)]  # (x, y) grounded root positions
        self.canopy_radius = 2.0
        self.max_branch_length = 3.0

    def distance_to_nearest_support(self, x, y):
        """Distance from (x,y) to nearest grounded root."""
        if not self.support_points:
            return float('inf')
        dists = [np.sqrt((x-sx)**2 + (y-sy)**2) for sx, sy in self.support_points]
        return min(dists)

    def grow_generation(self, gen):
        """Add one generation of branches."""
        if gen == 0:
            # Initial trunk splits
            n_primary = np.random.randint(4, 7)
            angles = np.linspace(0, 2*np.pi, n_primary, endpoint=False)
            angles += np.random.normal(0, 0.2, n_primary)
            for angle in angles:
                length = self.max_branch_length * np.random.uniform(0.7, 1.0)
                x2 = length * np.cos(angle)
                y2 = length * np.sin(angle)
                self.branches.append((0, 0, x2, y2, gen))
        else:
            # Extend from tips of previous generation
            prev_tips = [(b[2], b[3]) for b in self.branches if b[4] == gen-1]
            new_branches = []

            for tx, ty in prev_tips:
                # Branch length depends on support proximity
                support_dist = self.distance_to_nearest_support(tx, ty)
                max_extension = self.max_branch_length * max(0.3, 1.0 - support_dist / 20)

                # 1-3 sub-branches per tip
                n_sub = np.random.choice([1, 2, 3], p=[0.3, 0.5, 0.2])
                base_angle = np.arctan2(ty, tx)

                for _ in range(n_sub):
                    angle = base_angle + np.random.normal(0, 0.6)

print("\n[Full visualization available in the playground]")`,
      challenge: 'Add wind bias: make branches grow preferentially in the downwind direction (e.g., add +0.3 to the angle for branches growing eastward). How does persistent wind affect canopy symmetry and root distribution?',
      successHint: 'You can now model fractal canopy expansion with aerial root feedback — capturing the positive loop that makes banyans the largest single-organism canopies on Earth.',
    },
    {
      title: 'Keystone species analysis — quantifying ecological importance',
      concept: `A keystone species has disproportionate ecological impact relative to its abundance. Banyans are keystone species because:

1. **Habitat provision**: A single banyan supports 100+ species — epiphytes, insects, birds, bats, reptiles, and mammals that nest in its complex structure.
2. **Food source**: Figs fruit asynchronously (different trees fruit at different times), providing year-round food when other sources are scarce. Figs are a "famine food" for frugivores.
3. **Microclimate modification**: The canopy reduces temperature by 5-10°C, increases humidity by 15-20%, and reduces wind speed — creating a habitat island in otherwise inhospitable terrain.
4. **Seed dispersal hub**: Birds and bats consuming figs defecate seeds of dozens of other species, making the banyan a seed dispersal epicenter.

Quantifying keystoneness uses **network analysis**. Build a food web or interaction network: species are nodes, interactions are edges. Remove the banyan (node deletion) and measure how many other species lose their primary resource or habitat. A keystone species, when removed, causes a **trophic cascade** — collapse propagating through the network.

The **interaction strength** is not binary. Some species depend entirely on the banyan (obligate mutualists like fig wasps); others use it opportunistically. The weighted network captures this spectrum.`,
      analogy: 'A keystone species is like the central server in a corporate network. Remove any ordinary computer and the network barely notices. Remove the server and dozens of departments lose email, files, and connectivity. The server is not the biggest machine — it is the most connected, the one with the most dependencies. The banyan is the ecological server of its forest.',
      storyConnection: 'The story describes the banyan as the heart of the village — not just a tree but a gathering place, a shade provider, a home for birds and bats. The ecological reality mirrors the cultural symbolism: remove the banyan, and the web of life it supports unravels, just as the village community would fragment without its central gathering tree.',
      checkQuestion: 'Why are figs considered a "keystone resource" even though they contain relatively little energy per fruit compared to other tropical fruits?',
      checkAnswer: 'Temporal availability matters more than per-fruit energy. Most tropical trees fruit synchronously during the wet season, creating a "feast or famine" cycle. Figs fruit asynchronously — some tree always has ripe figs. During the dry season, when no other fruit is available, figs may be the only food keeping frugivore populations alive. Removing figs during this bottleneck period would cause population crashes that ripple through the food web. Low energy per fruit is irrelevant when they are the only energy available.',
      codeIntro: 'Build an ecological interaction network centered on the banyan, simulate node removal, and quantify keystoneness by measuring cascade effects.',
      code: `import numpy as np

np.random.seed(42)

# --- Ecological Interaction Network ---
class EcologicalNetwork:
    """Model species interaction network around a banyan tree."""

    def __init__(self):
        self.species = {}    # name -> {type, dependency_on_banyan}
        self.interactions = []  # (species_a, species_b, strength, type)

    def add_species(self, name, category, banyan_dependency):
        """banyan_dependency: 0-1, how much this species depends on banyan."""
        self.species[name] = {'category': category, 'banyan_dep': banyan_dependency}

    def add_interaction(self, sp_a, sp_b, strength, interaction_type='mutualism'):
        self.interactions.append((sp_a, sp_b, strength, interaction_type))

    def remove_species(self, target):
        """Simulate removal and compute cascade."""
        surviving = set(self.species.keys()) - {target}
        lost = {target}
        cascade_rounds = 0

        while True:
            cascade_rounds += 1
            newly_lost = set()
            for sp in list(surviving):
                deps = self.species[sp]['banyan_dep']
                # Check if this species depends on any lost species
                interaction_loss = 0
                total_interaction = 0
                for a, b, strength, _ in self.interactions:
                    if a == sp and b in lost:
                        interaction_loss += strength
                    if a == sp:
                        total_interaction += strength

                # Species lost if >60% of interactions gone or direct banyan dependency
                if target == 'Banyan' and deps > 0.7:
                    newly_lost.add(sp)
                elif total_interaction > 0 and interaction_loss / total_interaction > 0.6:
                    newly_lost.add(sp)

            if not newly_lost:
                break
            lost |= newly_lost
            surviving -= newly_lost


print("\n[Full visualization available in the playground]")`,
      challenge: 'Add redundancy: for each species, add a second, weaker interaction to a different food source. How does redundancy change the banyan keystoneness score? At what redundancy level does the banyan stop being the top keystone species?',
      successHint: 'You can now quantify ecological keystoneness through network analysis and cascade simulation — the scientific foundation for conservation prioritization.',
    },
    {
      title: 'Allometric scaling — predicting tree age from measurable dimensions',
      concept: `Estimating a banyan tree's age is notoriously difficult: they do not produce clear annual rings in tropical climates, and their multi-trunk structure defies simple measurement. Instead, we use **allometric scaling** — mathematical relationships between measurable tree dimensions.

Allometric relationships follow power laws:
  Y = a × X^b

Where X and Y are different measurements (trunk girth, canopy diameter, height, root count). The exponents arise from physical constraints:

- **Metabolic scaling**: West-Brown-Enquist theory predicts that biological rates scale with mass^(3/4) because of fractal nutrient distribution networks. For trees: diameter ~ mass^(3/8), height ~ mass^(1/4).
- **Structural scaling**: To support its own weight, a tree column must not buckle. This requires diameter to scale as height^(3/2) — Greenhill's formula for elastic self-buckling.
- **Canopy scaling**: Canopy area scales with trunk cross-section because each unit of trunk area must transport water to a proportional area of leaves.

For banyans specifically, the relationship between **total basal area** (sum of cross-sections of all trunks/pillars) and canopy area is more predictive than any single-trunk measurement. Total basal area integrates the entire support system.

Age estimation combines multiple allometric predictors: canopy diameter, aerial root count, total basal area, and height. Each has measurement error; combining them with regression reduces the uncertainty.`,
      analogy: 'Allometric scaling is like estimating a person age from their measurements. You cannot count their birthdays, but you can measure height, weight, grey hair percentage, and skin elasticity. Each measurement correlates imperfectly with age, but together they narrow the estimate. Similarly, each tree measurement correlates imperfectly with age, but the allometric ensemble converges on a reliable estimate.',
      storyConnection: 'The ancient banyan in the story was said to be hundreds of years old. But how would you verify that? You cannot cut it down to count rings. Allometric scaling lets you estimate age non-destructively: measure the canopy, count the aerial roots, total up the trunk cross-sections, and let the power laws translate measurements into years.',
      checkQuestion: 'Why does total basal area predict canopy size better than a single trunk diameter measurement for banyans?',
      checkAnswer: 'A banyan with 200 pillar roots has a narrow main trunk relative to its canopy — the main trunk alone vastly underestimates the water transport and structural capacity. Total basal area (sum of all trunk and pillar root cross-sections) captures the entire hydraulic and structural system. It accounts for the distributed support architecture that makes banyans unique among trees. Single-trunk allometry is designed for single-trunk trees and fails for multi-stemmed organisms.',
      codeIntro: 'Fit allometric power laws to simulated banyan measurement data and build a multi-predictor age estimation model.',
      code: `import numpy as np

np.random.seed(42)

# --- Generate allometric dataset ---
# Simulate measurements from 80 banyans of known age (from dated records)
n_trees = 80
true_ages = np.random.uniform(20, 500, n_trees)  # years

# Allometric relationships (with noise)
def generate_measurements(ages):
    n = len(ages)
    # Canopy diameter (m): scales roughly as age^0.5
    canopy_diam = 2.5 * ages**0.45 * np.random.lognormal(0, 0.15, n)

    # Aerial root count: increases with age^1.2 (accelerating)
    root_count = 0.02 * ages**1.3 * np.random.lognormal(0, 0.25, n)
    root_count = np.round(root_count).astype(int)

    # Total basal area (m²): sum of all trunk cross-sections
    # scales as age^0.8
    total_basal = 0.001 * ages**0.85 * np.random.lognormal(0, 0.2, n)

    # Height (m): saturates early (logistic-like)
    max_height = 25
    height = max_height * (1 - np.exp(-0.01 * ages)) * np.random.lognormal(0, 0.08, n)

    # Main trunk girth (m): grows then plateaus as pillars take over
    girth = 0.1 * ages**0.4 * np.random.lognormal(0, 0.2, n)
    girth = np.minimum(girth, 15)  # cap at 15m

    return canopy_diam, root_count, total_basal, height, girth

canopy, roots, basal, height, girth = generate_measurements(true_ages)

# --- Fit power law: log(Y) = log(a) + b*log(X) ---
def fit_power_law(x, y):
    """Fit Y = a * X^b using log-linear regression."""
    log_x = np.log(x + 1e-10)
    log_y = np.log(y + 1e-10)
    # Linear regression in log space
    n = len(x)
    sx = np.sum(log_x)
    sy = np.sum(log_y)
    sxx = np.sum(log_x**2)
    sxy = np.sum(log_x * log_y)
    b = (n*sxy - sx*sy) / (n*sxx - sx**2)
    log_a = (sy - b*sx) / n
    a = np.exp(log_a)


print("\n[Full visualization available in the playground]")`,
      challenge: 'Use leave-one-out cross-validation: for each tree, train the model on the other 79 and predict its age. Compare the cross-validated R² to the in-sample R². How much overfitting is there?',
      successHint: 'You can now estimate banyan tree age from non-destructive measurements using allometric power laws and multi-predictor regression.',
    },
    {
      title: 'Conservation modeling — predicting banyan population dynamics under threats',
      concept: `Banyans face multiple threats: urbanization (root cutting for construction), climate change (altered fruiting phenology), and loss of pollinators (fig wasps are highly sensitive to temperature). Modeling population dynamics under these threats informs conservation strategy.

The population model uses a **stage-structured matrix** (Leslie matrix variant):

Stages: Seedling → Juvenile (< 10 years) → Mature (10-100 years) → Ancient (> 100 years)

Each stage has:
- **Survival probability**: fraction surviving to next time step.
- **Growth probability**: fraction transitioning to next stage.
- **Fecundity**: number of seedlings produced per individual.

The matrix equation: N(t+1) = M × N(t)

Where N is the population vector [seedlings, juveniles, matures, ancients] and M is the transition matrix.

Under threats, we modify survival rates:
- **Urbanization**: reduces survival of all stages (root cutting, pollution).
- **Climate change**: reduces seedling survival (altered germination conditions) and fecundity (pollinator mismatch).
- **Pollinator loss**: directly reduces fecundity to near zero.

The **dominant eigenvalue** of M determines population growth rate. If λ₁ > 1, population grows. If λ₁ < 1, it declines. The **eigenvector** gives the stable stage distribution. We compute these under different threat scenarios to identify which threats are most dangerous and which life stages are most vulnerable.`,
      analogy: 'Population modeling is like a business forecasting its workforce. You track employees at different levels: interns, junior, senior, executive. Each level has a retention rate (survival), a promotion rate (growth), and a hiring rate (fecundity). If you cut hiring (pollinator loss), the pipeline dries up. If you increase turnover at the senior level (urbanization cutting mature trees), you lose institutional knowledge. The model predicts which interventions prevent workforce collapse.',
      storyConnection: 'The story ends with the village protecting their ancient banyan. But one tree is not a population. Conservation requires understanding whether banyans across the region are replacing themselves fast enough to persist. Our model reveals whether the ancient tree in the story is the last of its kind or one of a healthy population — and what must change if the answer is alarming.',
      checkQuestion: 'Why is pollinator loss potentially more catastrophic than urbanization for banyan populations?',
      checkAnswer: 'Urbanization reduces survival rates across all stages, but some individuals survive. Pollinator loss (fig wasp extinction) reduces fecundity to zero — no new seedlings at all. With zero recruitment, the population decays deterministically: existing trees age and die with no replacements. A population with reduced survival can recover if conditions improve; a population with zero fecundity is on a terminal countdown. The demographic algebra is unforgiving.',
      codeIntro: 'Build a stage-structured population model, compute eigenvalue growth rates, and simulate banyan population trajectories under threat scenarios.',
      code: `import numpy as np

np.random.seed(42)

# --- Stage-structured population model ---
class BanyanPopulationModel:
    """Leslie-type matrix model for banyan populations."""

    STAGES = ['Seedling', 'Juvenile', 'Mature', 'Ancient']

    def __init__(self, survival, growth, fecundity):
        """
        survival: [s0, s1, s2, s3] — survival prob per stage per decade
        growth: [g01, g12, g23] — transition prob to next stage per decade
        fecundity: [f0, f1, f2, f3] — seedlings produced per individual per decade
        """
        self.survival = np.array(survival)
        self.growth = np.array(growth)
        self.fecundity = np.array(fecundity)
        self.matrix = self._build_matrix()

    def _build_matrix(self):
        s, g, f = self.survival, self.growth, self.fecundity
        # M[i,j] = contribution of stage j to stage i next time step
        M = np.zeros((4, 4))
        # Fecundity (top row): each stage produces seedlings
        M[0, :] = f
        # Survival in same stage (diagonal)
        M[0, 0] += s[0] * (1 - g[0])  # seedlings that survive but don\'t grow
        M[1, 1] = s[1] * (1 - g[1])
        M[2, 2] = s[2] * (1 - g[2])
        M[3, 3] = s[3]  # ancients stay ancient
        # Growth to next stage (sub-diagonal)
        M[1, 0] = s[0] * g[0]
        M[2, 1] = s[1] * g[1]
        M[3, 2] = s[2] * g[2]
        return M

    def growth_rate(self):
        """Dominant eigenvalue = population growth rate."""
        eigenvalues = np.linalg.eigvals(self.matrix)
        return np.max(np.abs(eigenvalues))

    def stable_distribution(self):
        """Stable stage distribution (dominant eigenvector)."""
        eigenvalues, eigenvectors = np.linalg.eig(self.matrix)
        dominant_idx = np.argmax(np.abs(eigenvalues))
        v = np.abs(eigenvectors[:, dominant_idx])
        return v / v.sum()


print("\n[Full visualization available in the playground]")`,
      challenge: 'Implement a sensitivity analysis: vary each survival and fecundity parameter by ±20% one at a time and measure the change in λ. Which parameter has the largest effect on population growth? This identifies the most effective conservation intervention target.',
      successHint: 'You have built a complete conservation analysis: from growth dynamics to biomechanics to population modeling. The integration of ecological theory with computational tools is what makes modern conservation science effective.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (ecology and biomechanics fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for ecological modeling and biomechanical analysis. Click to start.</p>
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
            diagram={[BanyanAllometryDiagram, BanyanRespirationDiagram, BanyanWaterPotentialDiagram, BanyanPopulationDiagram, BanyanCarbonFluxDiagram, BanyanClimateResponseDiagram][i] ? createElement([BanyanAllometryDiagram, BanyanRespirationDiagram, BanyanWaterPotentialDiagram, BanyanPopulationDiagram, BanyanCarbonFluxDiagram, BanyanClimateResponseDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
