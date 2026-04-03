import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import BanyanPhotosynthesisDiagram from '../diagrams/BanyanPhotosynthesisDiagram';
import BanyanRootsDiagram from '../diagrams/BanyanRootsDiagram';
import BanyanCarbonDiagram from '../diagrams/BanyanCarbonDiagram';
import BanyanGrowthRingsDiagram from '../diagrams/BanyanGrowthRingsDiagram';
import BanyanWaterTransportDiagram from '../diagrams/BanyanWaterTransportDiagram';
import BanyanEcosystemDiagram from '../diagrams/BanyanEcosystemDiagram';

export default function BanyanTreeLevel1() {
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
      title: 'How trees grow — cambium, xylem, and growth rings',
      concept: `The old banyan tree in the story stood for centuries, growing wider and taller year after year. But how does a tree actually grow?

Trees grow in two ways:
1. **Primary growth** (height): happens at the tips of branches and roots, in regions called **apical meristems**. Cells here divide rapidly, pushing the branch longer.

2. **Secondary growth** (width): happens in a thin layer called the **vascular cambium** — a cylinder of dividing cells between the bark and the wood.

The cambium produces:
- **Xylem** (wood) on the inside: water-conducting tubes that become the tree's structural support
- **Phloem** (bark) on the outside: sugar-conducting tubes that feed the tree

Each year, the cambium produces a new ring of xylem:
- **Earlywood** (spring): large, thin-walled cells for rapid water transport → light-coloured ring
- **Latewood** (summer/autumn): small, thick-walled cells for strength → dark ring
- One light + one dark ring = one year of growth

This is why you can count a tree's age by counting its **growth rings**. A 500-year-old banyan has 500 pairs of light and dark rings — a record of every growing season it survived.`,
      analogy: 'A tree trunk is like a roll of paper towels being wrapped from the inside. Each year, the cambium adds a new layer of "paper" (xylem) around the outside of the previous layer. The oldest wood is in the center (the "cardboard tube"), and the newest is just under the bark. The tree literally grows by adding layers.',
      storyConnection: 'The old banyan tree had centuries of stories written in its wood — each ring a year of rain and sun, drought and flood. When the story says the tree is "ancient," the rings prove it. The stories the tree witnessed are encoded in the width of each ring.',
      checkQuestion: 'If a nail is hammered into a tree trunk at 2 meters height, will the nail be higher up in 10 years?',
      checkAnswer: 'No. The nail stays at exactly 2 meters. Trees grow taller from the TIPS (apical meristems), not by stretching the trunk. The trunk only grows WIDER (secondary growth). The nail will eventually be engulfed by new wood growth, but it won\'t move up. This surprises most people — they expect the trunk to "push up" like a rising elevator.',
      codeIntro: 'Model tree ring growth over 100 years, with ring width varying by climate conditions.',
      code: `import numpy as np

np.random.seed(42)

# Simulate 100 years of tree ring growth
n_years = 100

# Ring width depends on: rainfall, temperature, and age
# Young trees grow faster, old trees slower
ages = np.arange(1, n_years + 1)

# Base growth rate (mm/year) — decreases with age
base_growth = 5.0 * np.exp(-0.01 * ages) + 1.0

# Climate variation (random, but with occasional droughts)
rainfall_factor = np.random.normal(1.0, 0.25, n_years)
# Add drought years
drought_years = [15, 16, 42, 43, 44, 78]
for dy in drought_years:
    if dy < n_years:
        rainfall_factor[dy] = 0.3

ring_widths = base_growth * np.clip(rainfall_factor, 0.1, 2.0)

# Calculate cumulative radius
radii = np.cumsum(ring_widths)


print(f"Tree statistics after {n_years} years:")
print(f"  Total radius: {radii[-1]:.0f} mm ({radii[-1]/10:.1f} cm)")
print(f"  Diameter: {2*radii[-1]/10:.1f} cm")
print(f"  Average ring width: {np.mean(ring_widths):.1f} mm")
print(f"  Narrowest ring: Year {np.argmin(ring_widths)+1} ({np.min(ring_widths):.1f} mm — drought)")
print(f"  Widest ring: Year {np.argmax(ring_widths)+1} ({np.max(ring_widths):.1f} mm — good year)")`,
      challenge: 'Add a fire scar to the simulation: at year 30, growth is zero, and for the next 5 years it\'s 50% reduced. How does this appear in the cross-section? Forest ecologists use fire scars to date historical fires.',
      successHint: 'Tree rings are one of nature\'s most faithful record-keepers. They encode climate, fire history, volcanic eruptions, and even atmospheric carbon levels — a biological archive that can span thousands of years.',
    },
    {
      title: 'Aerial roots — the banyan\'s structural superpower',
      concept: `The banyan tree (*Ficus benghalensis*) has a unique feature that no other common tree shares: **aerial roots**. These are roots that grow downward from horizontal branches, eventually reaching the ground and thickening into pillar-like supports.

How aerial roots form:
1. The branch grows horizontally, getting heavier with leaves and fruit
2. The branch produces **adventitious roots** from its underside (triggered by auxin hormones)
3. These roots grow downward through the air, absorbing moisture from humid air
4. When they reach the ground, they penetrate the soil and begin absorbing water and nutrients
5. They thicken rapidly, becoming **prop roots** that support the branch like pillars
6. Over time, the prop roots become indistinguishable from true trunks

This gives the banyan a massive competitive advantage:
- **No size limit**: while most trees are limited by the strength of a single trunk, the banyan can spread indefinitely by adding more prop roots
- **Structural redundancy**: losing one trunk doesn't kill the tree (it has dozens or hundreds)
- **Resource acquisition**: each prop root taps new soil, expanding the tree's "territory"
- **Shade dominance**: the expanding canopy shades out all competitors beneath it

The Great Banyan in Howrah, Kolkata, has a canopy that covers 1.89 hectares (4.67 acres) and has over 3,600 prop roots. It looks like a small forest, but it's one tree.`,
      analogy: 'A banyan tree is like a tent that grows its own tent poles. Most trees are like a single flagpole — tall but limited in spread. The banyan is like a circus tent that keeps adding poles wherever it expands, allowing it to cover an enormous area. Each aerial root is a new pole that makes the next expansion possible.',
      storyConnection: 'The old banyan tree\'s stories were told beneath a canopy supported by hundreds of prop roots — each one a pillar in a natural cathedral. The tree\'s ability to spread was what made it a gathering place for generations. Without aerial roots, it would have been just another tree.',
      checkQuestion: 'The strangler fig (a close relative of the banyan) starts life as a seed deposited by a bird in the canopy of another tree. It sends aerial roots DOWN the host tree trunk. What happens to the host?',
      checkAnswer: 'The strangler fig\'s aerial roots surround the host trunk, fuse together, and gradually compress it. Meanwhile, the fig\'s canopy grows above the host, stealing its light. Over decades, the host tree is strangled and dies (from compression and light deprivation). The fig\'s fused aerial roots form a hollow cylinder where the host trunk used to be — a ghost of the original tree.',
      codeIntro: 'Model how a banyan tree spreads over time by adding aerial roots and expanding its canopy.',
      code: `import numpy as np

np.random.seed(42)

# Simulate banyan tree growth: canopy spread via aerial roots
n_years = 200

# Start with one trunk at center
trunks = [(0, 0, 0)]  # (x, y, year_established)
canopy_radius_history = []

# Each year: canopy expands, new aerial roots form at the edges
trunk_radius = 0.5  # meters, initial

for year in range(n_years):
    # Current canopy extent
    if len(trunks) > 0:
        xs = [t[0] for t in trunks]
        ys = [t[1] for t in trunks]
        canopy_radius = max(max(abs(x) for x in xs), max(abs(y) for y in ys)) + 5
    else:
        canopy_radius = 5

    canopy_radius_history.append(canopy_radius)

    # Probability of new aerial root: increases with canopy size
    n_new_roots = np.random.poisson(0.1 + len(trunks) * 0.02)
    n_new_roots = min(n_new_roots, 5)  # cap

    for _ in range(n_new_roots):
        # New root forms near the edge of canopy
        angle = np.random.uniform(0, 2 * np.pi)
        distance = canopy_radius * np.random.uniform(0.5, 0.95)
        new_x = distance * np.cos(angle)
        new_y = distance * np.sin(angle)
        trunks.append((new_x, new_y, year))


print(f"After {n_years} years:")
print(f"  Total trunks/prop roots: {len(trunks)}")
print(f"  Canopy radius: {canopy_radius_history[-1]:.0f} meters")
print(f"  Canopy area: {np.pi * canopy_radius_history[-1]**2:.0f} m² ({np.pi * canopy_radius_history[-1]**2/10000:.2f} hectares)")
print()
print("The Great Banyan in Kolkata: 3,600+ trunks, 1.89 hectares")
print("Thimmamma Marrimanu in Andhra Pradesh: 1.94 hectares (largest)")`,
      challenge: 'Add a "storm damage" event at year 100 that removes 30% of trunks randomly. How quickly does the tree recover? Compare to a single-trunked tree that loses its trunk (game over).',
      successHint: 'The banyan\'s aerial root strategy is a lesson in distributed systems engineering — redundancy, scalability, and resilience. No single point of failure, no size limit, no stopping.',
    },
    {
      title: 'The banyan\'s spreading strategy — shade as warfare',
      concept: `The banyan doesn't just grow — it **conquers**. Its strategy is ecological warfare through shade.

The expansion cycle:
1. Branches extend horizontally (up to 30+ meters from the trunk)
2. Aerial roots form, creating prop supports for further extension
3. The expanding canopy casts deep shade beneath it
4. Shade kills most competing plants (they can't photosynthesize)
5. With no competition, the banyan's own seedlings and roots have the soil to themselves
6. The cycle repeats: more branches → more shade → more territory

This strategy is called **competitive exclusion through resource monopolization**. The banyan monopolizes light — the most critical resource for all plants.

The result:
- Beneath a mature banyan, almost nothing else grows
- The banyan creates its own microclimate: cooler, more humid, sheltered from wind
- This makes it an ideal gathering place (village meetings, markets, temples)
- But it also makes it an ecological dead zone for plant diversity

Ecologically, the banyan is both creator and destroyer: it creates habitat for animals (birds, bats, insects love it) while eliminating habitat for other plants. This trade-off is one of the most interesting in tropical ecology.`,
      analogy: 'The banyan\'s strategy is like a corporation opening stores in every neighbourhood. Each new "store" (prop root + canopy) eliminates local competitors (shade kills other plants). Eventually, the corporation dominates the entire area. It provides employment (habitat for animals) but destroys independent businesses (other plant species).',
      storyConnection: 'The old banyan tree in the story was the center of the village — people gathered beneath it for shade and shelter. This isn\'t coincidence; it\'s strategy. The banyan created that gathering space by eliminating all competition beneath its canopy. The tree\'s generosity (shade) is also its weapon (shade warfare).',
      checkQuestion: 'Some tropical forests have a single enormous banyan that dominates an area of several hectares. Is this good or bad for the overall ecosystem?',
      checkAnswer: 'Both. Bad for plant diversity (the banyan suppresses almost all understory plants). Good for animal diversity (the banyan provides food — figs — for birds, bats, monkeys; shelter in its complex root structure; and a reliable microclimate). The net effect depends on what you value: if plant diversity, the banyan is destructive. If animal habitat, it\'s constructive. Most ecologists see large banyans as "keystone structures" — their benefits to the animal community outweigh the plant diversity loss.',
      codeIntro: 'Model the banyan\'s shade competition strategy and how it excludes other plants.',
      code: `import numpy as np

np.random.seed(42)

# Simulate competition: banyan canopy expands, other plants die in shade
grid_size = 50  # 50x50 meter area
grid = np.zeros((grid_size, grid_size))  # 0 = empty, 1 = other plants, 2 = banyan

# Initial conditions: other plants everywhere, banyan at center
grid[:, :] = 1  # other plants cover the area
banyan_center = (25, 25)
grid[24:27, 24:27] = 2  # small banyan

# Light level: 100% in open, decreasing under canopy
light = np.ones((grid_size, grid_size)) * 100

n_years = 50
snapshots = {}

for year in range(n_years):
    # Banyan canopy expands (radius grows)
    canopy_radius = 3 + year * 0.5

    # Update light levels
    for i in range(grid_size):
        for j in range(grid_size):
            dist = np.sqrt((i - banyan_center[0])**2 + (j - banyan_center[1])**2)
            if dist < canopy_radius:
                light[i, j] = max(5, 100 * (dist / canopy_radius)**2)  # deep shade near center

    # Other plants die if light < 20%
    dead = (grid == 1) & (light < 20)
    grid[dead] = 0

    # Banyan fills its canopy area
    for i in range(grid_size):
        for j in range(grid_size):
            dist = np.sqrt((i - banyan_center[0])**2 + (j - banyan_center[1])**2)
            if dist < canopy_radius * 0.8:
                grid[i, j] = 2

    if year in [0, 10, 25, 49]:
        snapshots[year] = (grid.copy(), light.copy())


# Statistics
print("Banyan expansion over 50 years:")
for year, (g, l) in snapshots.items():
    other = np.sum(g == 1) / grid_size**2 * 100
    banyan = np.sum(g == 2) / grid_size**2 * 100
    dead = np.sum(g == 0) / grid_size**2 * 100
    print(f"  Year {year+1}: Banyan {banyan:.0f}%, Other plants {other:.0f}%, Dead zone {dead:.0f}%")
print()
print("The banyan doesn't fight other plants.")
print("It simply steals their light. Shade is the weapon.")`,
      challenge: 'Add a gap: at year 25, a branch falls, creating a 5m opening in the canopy. How quickly do other plants recolonize? How quickly does the banyan close the gap? This models "gap dynamics" in forest ecology.',
      successHint: 'The banyan\'s competitive strategy is a masterclass in resource monopolization. Understanding it helps explain tropical forest dynamics, the role of dominant species, and why some ecosystems are controlled by a single species.',
    },
    {
      title: 'Dendrochronology — reading history in tree rings',
      concept: `**Dendrochronology** is the science of dating events by reading tree rings. It goes far beyond counting rings to determine age — it's a precision tool for reconstructing past climate, dating historical events, and calibrating radiocarbon dating.

How it works:
1. **Cross-dating**: rings from different trees in the same region show the same pattern of wide/narrow years (because they experienced the same climate)
2. **Master chronology**: by overlapping ring patterns from living trees with dead wood (beams in old buildings, logs in rivers), scientists build continuous records spanning thousands of years
3. **Climate reconstruction**: ring width correlates with rainfall and temperature, so a 3,000-year ring chronology = a 3,000-year climate record

Precision achievements:
- **Oldest continuous chronology**: European oak/pine, 12,500+ years (back to the last Ice Age)
- **Bristlecone pine**: individual trees over 5,000 years old (Methuselah, 4,855 years)
- **Radiocarbon calibration**: tree rings provide independently dated samples that calibrate the radiocarbon method

Dendrochronology has been used to:
- Date the construction of ancient buildings (Viking ships, Pueblo cliff dwellings)
- Identify volcanic eruptions (narrow rings in the year after eruptions due to reduced sunlight)
- Reconstruct drought cycles (critical for water management)
- Identify falsely dated paintings (the wood panel's rings reveal its true age)`,
      analogy: 'Dendrochronology is like a barcode scanner for time. Each tree\'s ring pattern is a unique barcode. Trees in the same region share the same barcode because they experience the same weather. By matching barcodes between living trees and old dead wood, you extend the scanner\'s range back thousands of years.',
      storyConnection: 'If the old banyan tree in the story were cut down (never!), its rings would tell the history of the village — which years had good rains, which had droughts, when there were fires. The tree that told stories to the villagers also recorded those stories in its wood.',
      checkQuestion: 'A painting is claimed to be from 1485. The wooden panel it\'s painted on has tree rings. The outermost ring dates to 1510. Is the painting genuine?',
      checkAnswer: 'Possibly, but suspicious. The outermost ring (1510) is the earliest the tree was felled. After felling, the wood would be seasoned for 2-10 years before use. So the panel was likely made between 1512-1520. A painting dated 1485 would require a panel made at least 25 years before it was supposedly painted on. This doesn\'t prove forgery (old panels are sometimes reused), but it raises serious doubts.',
      codeIntro: 'Simulate cross-dating: match ring patterns between trees to build a chronology.',
      code: `import numpy as np

np.random.seed(42)

# Simulate 3 trees with overlapping lifespans
# Shared climate signal + individual noise

n_climate_years = 300  # 300-year climate record

# Climate signal (shared by all trees in region)
climate = np.random.normal(1.0, 0.3, n_climate_years)
# Add some extreme events
climate[50] = 0.2   # severe drought
climate[120] = 0.3  # another drought
climate[200] = 2.0  # very wet year
climate[250] = 0.1  # worst drought

# Tree A: years 0-200 (living tree, just cut)
tree_a_start, tree_a_end = 100, 300
tree_a_climate = climate[tree_a_start:tree_a_end]
tree_a_rings = tree_a_climate + np.random.normal(0, 0.15, len(tree_a_climate))
tree_a_rings = np.clip(tree_a_rings, 0.1, 3.0)

# Tree B: years 80-220 (beam from old building)
tree_b_start, tree_b_end = 50, 250
tree_b_climate = climate[tree_b_start:tree_b_end]
tree_b_rings = tree_b_climate + np.random.normal(0, 0.15, len(tree_b_climate))
tree_b_rings = np.clip(tree_b_rings, 0.1, 3.0)

# Tree C: years 0-120 (ancient log)
tree_c_start, tree_c_end = 0, 150
tree_c_climate = climate[tree_c_start:tree_c_end]
tree_c_rings = tree_c_climate + np.random.normal(0, 0.15, len(tree_c_climate))
tree_c_rings = np.clip(tree_c_rings, 0.1, 3.0)


# Cross-correlation between trees in overlap period
overlap_ab = range(max(tree_a_start, tree_b_start), min(tree_a_end, tree_b_end))
a_overlap = tree_a_rings[max(tree_b_start-tree_a_start, 0):max(tree_b_start-tree_a_start, 0)+len(overlap_ab)]
b_overlap = tree_b_rings[max(tree_a_start-tree_b_start, 0):max(tree_a_start-tree_b_start, 0)+len(overlap_ab)]
corr_ab = np.corrcoef(a_overlap[:min(len(a_overlap), len(b_overlap))],
                       b_overlap[:min(len(a_overlap), len(b_overlap))])[0, 1]

print("Cross-dating results:")
print(f"  Tree A ↔ Tree B correlation: {corr_ab:.3f}")
print(f"  Overlap period: years {max(tree_a_start, tree_b_start)}-{min(tree_a_end, tree_b_end)}")
print()
print("By chaining A → B → C, we build a 300-year chronology")
print("from three trees, none older than 200 years individually.")
print()
print("This is exactly how scientists build multi-thousand-year records.")`,
      challenge: 'Add random "noise" to tree C so its correlation with tree B is lower. At what noise level does cross-dating fail (correlation drops below 0.4)? This determines the minimum signal quality needed for dendrochronology.',
      successHint: 'Dendrochronology is one of science\'s most elegant tools — precise to the exact year, based on simple biology, and applicable to questions ranging from climate science to art forgery. The tree rings that record the banyan\'s life also record the planet\'s climate history.',
    },
    {
      title: 'The world\'s oldest trees — lessons in longevity',
      concept: `Some trees have been alive for thousands of years — far longer than any animal, any civilization, or any human institution.

Record holders:
- **Methuselah** (bristlecone pine, California): 4,855 years old (germinated ~2833 BCE, before the pyramids were built)
- **Prometheus** (bristlecone pine, Nevada): was 4,862 years old when cut down in 1964 by a researcher who didn't realize what he was destroying
- **Old Tjikko** (Norway spruce, Sweden): the visible trunk is ~600 years old, but the root system is 9,565 years old (it keeps regenerating new trunks)
- **Pando** (quaking aspen, Utah): a single clonal organism spanning 43 hectares, estimated 80,000-1,000,000 years old

How do trees live so long?
1. **Modularity**: a tree is a colony of semi-independent modules (branches). If one dies, the rest survive. Animals can't do this — lose your heart, game over.
2. **Continuous growth**: trees never stop growing. They keep adding new cells throughout their life.
3. **Chemical defense**: wood is loaded with tannins, resins, and other antimicrobial compounds
4. **Slow metabolism**: extremely old trees grow very slowly, reducing metabolic damage
5. **No programmed death**: unlike animals, trees don't have a genetic "clock" that triggers aging

The banyan's longevity secret is aerial roots: even if the original trunk dies, the clone continues through its prop roots. In theory, a banyan could live indefinitely.`,
      analogy: 'A tree\'s longevity strategy is like a company that can replace its CEO (main trunk) while the branches (departments) keep operating. Animals are like a one-person business — when the founder dies, it\'s over. Trees are like corporations — the organization persists even as individual parts are replaced.',
      storyConnection: 'The old banyan tree told stories spanning centuries — and it could do so because banyans can live for centuries. The Great Banyan in Kolkata is estimated at 250+ years. Some banyans in India are believed to be 500+ years old. The tree in the story might genuinely have witnessed the events it describes.',
      checkQuestion: 'If trees don\'t have programmed aging, why do they eventually die?',
      checkAnswer: 'Trees die from external causes, not internal aging: (1) Storm damage breaks branches or topples the trunk, (2) Fire kills the cambium, (3) Fungal or insect attacks overwhelm defenses, (4) Lightning strikes, (5) Drought or flooding, (6) Structural failure — the heartwood rots and the trunk can\'t support the crown. Very old trees often die from accumulated structural damage rather than "old age." In theory, if protected from all external threats, a tree could live indefinitely.',
      codeIntro: 'Visualize the world\'s oldest trees and compare their ages to human history.',
      code: `import numpy as np

# World's oldest trees and human history timeline
trees = {
    'Pando (aspen clone)': {'age': 80000, 'type': 'clonal', 'color': '#22c55e'},
    'Old Tjikko (root system)': {'age': 9565, 'type': 'clonal', 'color': '#3b82f6'},
    'Methuselah (bristlecone)': {'age': 4855, 'type': 'individual', 'color': '#f59e0b'},
    'Sarv-e Abarkuh (cypress)': {'age': 4000, 'type': 'individual', 'color': '#a855f7'},
    'Llangernyw Yew (Wales)': {'age': 3000, 'type': 'individual', 'color': '#ef4444'},
    'Great Banyan (Kolkata)': {'age': 250, 'type': 'spreading', 'color': '#ec4899'},
}

# Human history milestones (years before present)
history = {
    'Agriculture invented': 12000,
    'Pyramids of Giza': 4500,
    'Roman Empire peak': 2000,
    'Printing press': 580,
    'Industrial Revolution': 250,
    'Internet': 35,
}


print("Perspective check:")
print(f"  Methuselah germinated {trees['Methuselah (bristlecone)']['age']} years ago")
print(f"  That's {trees['Methuselah (bristlecone)']['age'] - 4500} years BEFORE the pyramids")
print(f"  The tree predates writing, bronze, and most civilizations")
print()
print("The Great Banyan is 'only' 250 years old.")
print("But banyans can theoretically live forever through aerial roots.")
print("In 5,000 years, today's young banyans could be as old as Methuselah.")`,
      challenge: 'Methuselah (4,855 years old) has been alive through the entire recorded history of humanity. Plot its ring-width timeline and overlay major historical events. What climate signals might its rings contain?',
      successHint: 'The world\'s oldest trees are living records of Earth\'s history, surviving through modularity, chemical defense, and continuous renewal. The old banyan tree\'s stories are just the beginning — the real story is written in the wood itself.',
    },
    {
      title: 'Ecosystem services of old trees — what ancient trees give us',
      concept: `Old trees provide **ecosystem services** — benefits to humans and the environment — that young trees cannot match:

**1. Carbon storage**:
- A single large tree can store 20+ tonnes of carbon (equivalent to the annual emissions of 4 cars)
- Old-growth forests store 30-70% more carbon per hectare than young forests
- Cutting old trees and replanting releases more CO₂ than it saves for decades

**2. Biodiversity support**:
- Old trees develop **cavities** (holes from broken branches, woodpecker excavations) used by owls, bats, parrots, and small mammals
- Thick bark provides habitat for insects, lichens, mosses, and fungi
- A single banyan can host 100+ animal species in its complex root structure

**3. Water regulation**:
- Large root systems absorb and filter rainwater, reducing flooding
- Transpiration (water evaporating from leaves) contributes to local rainfall
- The banyan's aerial roots intercept fog and mist, adding to ground moisture

**4. Soil health**:
- Leaf litter feeds soil organisms (fungi, bacteria, earthworms)
- Deep roots break up compacted soil and access minerals from bedrock
- Mycorrhizal networks (tree-fungus partnerships) connect trees underground

**5. Cultural and spiritual value**:
- Old trees are gathering places, landmarks, and sacred sites
- They connect communities to their history
- The psychological benefit of old trees ("biophilia") is measurable`,
      analogy: 'An old tree is like a venerable institution — a university or hospital that has been serving the community for centuries. A young tree is like a startup. The startup might grow faster, but the institution has infrastructure, networks, and accumulated value that the startup can\'t match. You don\'t tear down a 500-year-old university to build a new one — the accumulated value is irreplaceable.',
      storyConnection: 'The old banyan tree was the village\'s university, temple, and town hall — all in one organism. It provided shade (temperature regulation), habitat (biodiversity), carbon storage (climate service), water regulation (its roots and canopy), and cultural identity (gathering place for stories). Every ecosystem service was on display.',
      checkQuestion: 'A city planner argues: "We should cut down the 200-year-old banyan and plant 100 saplings. More trees = better for the environment." Is this correct?',
      checkAnswer: 'No, and the math proves it. The 200-year-old banyan stores ~20 tonnes of carbon. Cutting it releases most of that carbon immediately. 100 saplings will take 50-100 years to collectively store the same amount. In the meantime, the cavity-nesting birds, the mycorrhizal network, the cultural value, and the water regulation services are lost. Net carbon impact: NEGATIVE for decades. Net biodiversity impact: devastating. This is why conserving old trees is almost always better than planting new ones.',
      codeIntro: 'Quantify ecosystem services of old vs young trees.',
      code: `import numpy as np

# Ecosystem services: old tree vs young tree vs 100 saplings

# Carbon storage model (tonnes CO2 equivalent)
ages = np.arange(0, 201)

# Single tree carbon accumulation (sigmoid)
def tree_carbon(age):
    return 25 / (1 + np.exp(-0.05 * (age - 60)))

single_tree = tree_carbon(ages)

# 100 saplings planted at year 0 (after cutting old tree)
saplings_total = 100 * tree_carbon(ages) / 5  # each sapling smaller

# Carbon released from cutting old tree
old_tree_carbon = tree_carbon(200)  # 200-year-old tree
cut_and_replant = -old_tree_carbon + saplings_total  # net = released + new growth


print("The 200-year-old banyan:")
print(f"  Carbon stored: {tree_carbon(200):.0f} tonnes CO₂")
print(f"  Species supported: ~100")
print(f"  Annual ecosystem value: {sum(old_value):,}")
print()
print("100 saplings would take {:.0f} years to match its carbon alone.".format(breakeven if breakeven > 0 else 999))
print("The biodiversity and cultural value may NEVER be matched.")
print()
print("Conclusion: protecting old trees is almost always better")
print("than planting new ones. Level 2 explores the forest ecology")
print("that makes these trees keystone organisms.")`,
      challenge: 'Calculate the "replacement cost" of the Great Banyan in Kolkata (250 years old, 1.89 hectares canopy, 3600 trunks). How many saplings would you need, how long would it take, and what would it cost?',
      successHint: 'Ecosystem services quantification is transforming conservation by putting economic value on nature\'s contributions. The old banyan tree isn\'t just a cultural treasure — it\'s an irreplaceable piece of ecological infrastructure worth millions of dollars in services.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior ecology experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for ecology simulations. Click to start.</p>
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
            diagram={[BanyanPhotosynthesisDiagram, BanyanRootsDiagram, BanyanCarbonDiagram, BanyanGrowthRingsDiagram, BanyanWaterTransportDiagram, BanyanEcosystemDiagram][i] ? createElement([BanyanPhotosynthesisDiagram, BanyanRootsDiagram, BanyanCarbonDiagram, BanyanGrowthRingsDiagram, BanyanWaterTransportDiagram, BanyanEcosystemDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}