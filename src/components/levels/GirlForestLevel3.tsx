import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function GirlForestLevel3() {
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
      title: 'Ecological succession — from bare ground to mature forest',
      concept: `**Ecological succession** is the process by which a community of organisms changes over time, eventually reaching a stable **climax community**. There are two types:

**Primary succession**: starts on bare substrate with no soil — volcanic lava, glacial till, bare rock. Pioneer species (lichens, mosses) colonize first, slowly creating soil. This takes centuries.

**Secondary succession**: starts after disturbance to existing ecosystem — fire, logging, abandoned farmland. Soil is already present, so recovery is faster (decades).

The classic succession stages for a tropical/subtropical forest:
1. **Pioneer stage** (0-5 years): grasses, herbs, fast-growing shrubs. High light, low competition.
2. **Early successional** (5-20 years): fast-growing trees (Albizia, Trema). Shade begins.
3. **Mid-successional** (20-50 years): canopy closes. Shade-tolerant species establish under pioneers.
4. **Late successional** (50-100 years): pioneers die; shade-tolerant species dominate.
5. **Climax** (100+ years): stable, self-replacing community. Maximum biomass and biodiversity.

The **facilitation model** (Connell & Slatyer, 1977) explains succession: early species modify the environment (create soil, add nutrients, provide shade), making it suitable for later species that outcompete the pioneers. Each stage facilitates the next.`,
      analogy: 'Succession is like building a city. First come the construction workers (pioneer species) who clear the land and build infrastructure (create soil). Then come small businesses (early trees) that provide basic services. As the city grows, corporations (canopy trees) move in and tower over the small shops. Eventually, the city is mature — tall buildings, diverse businesses, stable infrastructure. If a fire destroys a block (disturbance), rebuilding is faster than starting from scratch because the infrastructure (soil) is already there.',
      storyConnection: 'The girl who grew a forest started with barren, degraded land — the kind of land that needs secondary succession. By planting trees, she accelerated nature\'s process. But she had to plant the RIGHT species in the RIGHT order — pioneers first for soil improvement, then mid-successional species in their shade. The story captures the essence of the facilitation model: each planting prepares the ground for the next.',
      checkQuestion: 'Abandoned farmland in Assam undergoes secondary succession. After 30 years, the dominant trees are fast-growing Albizia species. Are these the final community? What comes next?',
      checkAnswer: 'No — Albizia is an early-to-mid successional species. It grows fast in full sun but cannot reproduce in its own shade. Over the next 50-100 years, shade-tolerant species (Dipterocarpus, Shorea, Artocarpus) will grow in the understory, eventually overtopping and replacing the Albizia as it dies of old age. The final community will be a mixed dipterocarp forest. Albizia facilitated this by creating the shaded conditions that late-successional species need to establish.',
      codeIntro: 'Model ecological succession over 200 years: track species composition, biomass, canopy height, and biodiversity through each successional stage.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Ecological succession model ---
years = 200
n_species_groups = 5
group_names = ['Grasses/herbs', 'Pioneer trees', 'Early canopy', 'Mid canopy', 'Climax trees']
group_colors = ['#a3e635', '#22c55e', '#16a34a', '#15803d', '#14532d']

# Species group parameters
# [max_biomass, growth_rate, shade_tolerance, establishment_year, peak_year, decline_year]
params = {
    'Grasses/herbs':   {'max_bio': 5, 'growth': 0.8, 'shade_tol': 0.1, 'est': 0, 'peak': 5, 'decline': 15},
    'Pioneer trees':   {'max_bio': 40, 'growth': 0.3, 'shade_tol': 0.2, 'est': 2, 'peak': 20, 'decline': 50},
    'Early canopy':    {'max_bio': 80, 'growth': 0.15, 'shade_tol': 0.5, 'est': 10, 'peak': 50, 'decline': 100},
    'Mid canopy':      {'max_bio': 120, 'growth': 0.08, 'shade_tol': 0.7, 'est': 25, 'peak': 80, 'decline': 150},
    'Climax trees':    {'max_bio': 150, 'growth': 0.04, 'shade_tol': 0.9, 'est': 40, 'peak': 120, 'decline': 250},
}

def succession_model(years, params, disturbance_year=None):
    biomass = np.zeros((n_species_groups, years))
    total_shade = np.zeros(years)

    for year in range(1, years):
        # Calculate total shade from existing canopy
        total_shade[year] = min(1.0, np.sum(biomass[:, year-1]) / 200)

        for g, (name, p) in enumerate(params.items()):
            if year < p['est']:
                continue

            age = year - p['est']

            # Growth depends on shade tolerance matching current conditions
            shade_match = 1.0 - abs(total_shade[year] - p['shade_tol'])
            shade_match = max(0.1, shade_match)

            # Logistic growth modified by shade
            current = biomass[g, year-1]
            growth = p['growth'] * current * (1 - current / p['max_bio']) * shade_match

            # Decline phase (outcompeted by later species)
            if year > p['decline']:
                decline_rate = 0.02 * (year - p['decline']) / 50
                growth -= current * decline_rate

            biomass[g, year] = max(0, current + growth)

            # Initial establishment
            if age < 3 and current < 1:
                biomass[g, year] = max(biomass[g, year], 0.5 * (age + 1))

        # Disturbance (fire/logging)
        if disturbance_year and year == disturbance_year:
            biomass[:, year] *= 0.1  # 90% destruction

    return biomass, total_shade

# Run natural succession
biomass, shade = succession_model(years, params)

# Run with disturbance at year 80
biomass_dist, shade_dist = succession_model(years, params, disturbance_year=80)

# Derived metrics
total_biomass = np.sum(biomass, axis=0)
canopy_height = total_biomass * 0.3  # rough conversion to meters
species_richness = np.sum(biomass > 1, axis=0)  # groups with significant biomass

# Shannon diversity index
diversity = np.zeros(years)
for year in range(years):
    total = np.sum(biomass[:, year])
    if total > 0:
        props = biomass[:, year] / total
        props = props[props > 0]
        diversity[year] = -np.sum(props * np.log(props + 1e-10))

# Carbon storage (biomass * 0.5 = carbon content)
carbon = total_biomass * 0.5

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Ecological Succession: From Bare Ground to Mature Forest', color='white', fontsize=14)

# Plot 1: Biomass by species group
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.stackplot(range(years), biomass, labels=group_names, colors=group_colors, alpha=0.8)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Biomass (tonnes/ha)', color='white')
ax.set_title('Species composition over time', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper left')
ax.tick_params(colors='gray')

# Plot 2: Canopy height
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.fill_between(range(years), canopy_height, color='#22c55e', alpha=0.3)
ax.plot(canopy_height, color='#22c55e', linewidth=2)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Canopy height (m)', color='white')
ax.set_title('Forest canopy development', color='white', fontsize=11)
# Add succession stage labels
stages = [('Pioneer', 5, 15), ('Early', 20, 45), ('Mid', 50, 90), ('Climax', 120, 180)]
for name, start, mid in stages:
    ax.text(mid, canopy_height[mid] + 2, name, color='white', fontsize=7, ha='center')
ax.tick_params(colors='gray')

# Plot 3: Shade progression
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.fill_between(range(years), shade, color='#3b82f6', alpha=0.3)
ax.plot(shade, color='#3b82f6', linewidth=2)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Canopy closure (0-1)', color='white')
ax.set_title('Light → shade transition', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 4: Diversity and richness
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(diversity, color='#a855f7', linewidth=2, label='Shannon diversity')
ax.plot(species_richness, color='#f59e0b', linewidth=2, label='Species groups present')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Diversity', color='white')
ax.set_title('Biodiversity through succession', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Carbon accumulation
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.fill_between(range(years), carbon, color='#22c55e', alpha=0.3)
ax.plot(carbon, color='#22c55e', linewidth=2)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Carbon stored (tonnes C/ha)', color='white')
ax.set_title('Carbon sequestration', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: Succession with disturbance
ax = axes[1, 2]
ax.set_facecolor('#111827')
total_dist = np.sum(biomass_dist, axis=0)
ax.plot(total_biomass, color='#22c55e', linewidth=2, label='Undisturbed')
ax.plot(total_dist, color='#ef4444', linewidth=2, label='Fire at year 80')
ax.axvline(80, color='#ef4444', linestyle=':', linewidth=1, alpha=0.5)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Total biomass', color='white')
ax.set_title('Recovery after disturbance', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Succession milestones:")
print(f"  Canopy closure (shade > 0.8): year {np.argmax(shade > 0.8)}")
print(f"  Peak biomass: {max(total_biomass):.0f} tonnes/ha at year {np.argmax(total_biomass)}")
print(f"  Peak carbon: {max(carbon):.0f} tonnes C/ha")
print(f"  Peak diversity: year {np.argmax(diversity)}")
print(f"  Recovery after fire: ~{np.argmax(total_dist[80:] > total_biomass[80] * 0.5)} years to 50% pre-disturbance biomass")`,
      challenge: 'Model primary succession on bare rock by adding a "soil development" variable that increases from 0 to 1 over 100 years. Make tree establishment depend on soil depth. How much longer does primary succession take compared to secondary?',
      successHint: 'Ecological succession is the theoretical foundation of reforestation. Every tree planting project — including the Miyawaki method used in India — applies succession principles to accelerate forest development. Understanding succession means understanding what to plant, when, and why.',
    },
    {
      title: 'The facilitation model — how pioneer species build the forest',
      concept: `The facilitation model explains WHY succession happens: each stage modifies the environment to favor the next stage. Pioneers do not just grow and die — they actively transform the site.

**Soil building**: pioneer grasses add organic matter through root turnover and leaf litter. Nitrogen-fixing species (Albizia, Acacia) add atmospheric N₂ to the soil. In 10-20 years, pioneers can build 5-10 cm of topsoil with 2-3% organic matter.

**Microclimate modification**: as canopy develops, it buffers temperature extremes (cooler days, warmer nights), increases humidity, reduces wind speed, and blocks UV radiation. Many late-successional species REQUIRE these conditions — their seeds will not germinate in full sun.

**Mycorrhizal networks**: tree roots form partnerships with soil fungi that create underground networks connecting trees. These **mycorrhizal networks** (the "wood wide web") allow resource sharing between trees. Pioneer trees establish the fungal network that later species depend on.

**Nurse plants**: some pioneers protect seedlings of later species from herbivory, desiccation, and frost. The shade of a pioneer tree might be the only place a climax tree seedling can survive.

The mathematical formalization: species j facilitates species k if dK_k/dN_j > 0 — the carrying capacity of species k increases as species j becomes more abundant. This is positive indirect interaction.`,
      analogy: 'Facilitation is like a startup incubator. The incubator (pioneer species) provides office space, mentoring, and infrastructure (soil, shade, mycorrhizae) that young companies (late-successional species) need to survive. Without the incubator, most startups would fail in their first year. But as the companies grow, they no longer need the incubator — they move out and the incubator\'s role diminishes. The incubator facilitated growth that eventually outgrows it.',
      storyConnection: 'The girl who grew a forest understood facilitation intuitively. She planted nitrogen-fixing trees first to improve the soil. She planted fast-growing species to create shade. Then she planted slower-growing climax species in their protective canopy. Each planting phase prepared the conditions for the next — facilitation in action. Without this sequence, simply planting climax tree seeds on barren ground would have failed.',
      checkQuestion: 'You are restoring a degraded hillside. The soil is poor (low nitrogen, low organic matter). Would you plant climax species like Dipterocarpus directly? Why or why not?',
      checkAnswer: 'No. Dipterocarpus requires deep soil, mycorrhizal fungi, and partial shade — none of which exist on a degraded hillside. You must plant pioneers first: nitrogen-fixers (Albizia, Leucaena) to build soil N, fast growers (Trema, Macaranga) for shade, and then introduce mycorrhizal inoculum. After 5-10 years, when pioneers have built 5cm of organic soil and created a microclimate, THEN introduce Dipterocarpus seedlings in the understory. Skipping steps wastes time and money.',
      codeIntro: 'Model the facilitation process: track soil nutrients, light availability, mycorrhizal network development, and how these abiotic changes drive species replacement.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Facilitation model ---
years = 150

# Abiotic variables that change through succession
soil_N = np.zeros(years)      # soil nitrogen (kg/ha)
soil_organic = np.zeros(years) # soil organic matter (%)
soil_depth = np.zeros(years)   # effective soil depth (cm)
light = np.ones(years)         # light at ground level (0-1)
humidity = np.zeros(years)     # relative humidity increase (0-1)
mycorrhizae = np.zeros(years)  # mycorrhizal network strength (0-1)

# Species groups with their requirements and contributions
species = {
    'N-fixers': {
        'N_requirement': 10, 'shade_tolerance': 0.1, 'soil_requirement': 5,
        'N_contribution': 30, 'organic_contribution': 0.3, 'shade_creation': 0.2,
        'myc_contribution': 0.3, 'max_biomass': 30, 'growth_rate': 0.4,
    },
    'Fast growers': {
        'N_requirement': 20, 'shade_tolerance': 0.2, 'soil_requirement': 8,
        'N_contribution': 5, 'organic_contribution': 0.5, 'shade_creation': 0.4,
        'myc_contribution': 0.2, 'max_biomass': 50, 'growth_rate': 0.3,
    },
    'Mid-successional': {
        'N_requirement': 40, 'shade_tolerance': 0.5, 'soil_requirement': 15,
        'N_contribution': 3, 'organic_contribution': 0.3, 'shade_creation': 0.3,
        'myc_contribution': 0.3, 'max_biomass': 100, 'growth_rate': 0.12,
    },
    'Climax canopy': {
        'N_requirement': 50, 'shade_tolerance': 0.7, 'soil_requirement': 20,
        'N_contribution': 2, 'organic_contribution': 0.4, 'shade_creation': 0.3,
        'myc_contribution': 0.4, 'max_biomass': 150, 'growth_rate': 0.05,
    },
    'Understorey': {
        'N_requirement': 30, 'shade_tolerance': 0.9, 'soil_requirement': 15,
        'N_contribution': 1, 'organic_contribution': 0.2, 'shade_creation': 0.05,
        'myc_contribution': 0.2, 'max_biomass': 20, 'growth_rate': 0.08,
    },
}

n_sp = len(species)
sp_names = list(species.keys())
biomass = np.zeros((n_sp, years))

# Initial conditions (degraded land)
soil_N[0] = 5
soil_organic[0] = 0.5
soil_depth[0] = 3
light[0] = 1.0

for year in range(1, years):
    # Calculate suitability for each species
    for g, (name, sp) in enumerate(species.items()):
        # Suitability based on requirements
        n_suit = min(1, soil_N[year-1] / sp['N_requirement'])
        shade_suit = 1 - abs((1 - light[year-1]) - sp['shade_tolerance'])
        shade_suit = max(0.1, shade_suit)
        soil_suit = min(1, soil_depth[year-1] / sp['soil_requirement'])
        myc_suit = min(1, mycorrhizae[year-1] / 0.3 + 0.3) if sp['shade_tolerance'] > 0.4 else 1.0

        total_suitability = n_suit * shade_suit * soil_suit * myc_suit

        # Growth
        current = biomass[g, year-1]
        if total_suitability > 0.3 and (current > 0 or year > 2):
            growth = sp['growth_rate'] * current * (1 - current / sp['max_biomass']) * total_suitability
            if current < 1 and total_suitability > 0.5:
                growth = max(growth, 0.5 * total_suitability)
            biomass[g, year] = max(0, current + growth)

            # Competition: later species reduce earlier species
            if g > 0 and biomass[g, year] > sp['max_biomass'] * 0.3:
                for earlier in range(g):
                    competition = 0.005 * biomass[g, year] / sp['max_biomass']
                    biomass[earlier, year] *= (1 - competition)
        else:
            biomass[g, year] = max(0, current * 0.95)

    # Update abiotic variables based on current biomass
    for g, (name, sp) in enumerate(species.items()):
        b_frac = biomass[g, year] / sp['max_biomass']
        soil_N[year] += sp['N_contribution'] * b_frac * 0.1
        soil_organic[year] += sp['organic_contribution'] * b_frac * 0.01
        soil_depth[year] += sp['organic_contribution'] * b_frac * 0.01
        mycorrhizae[year] += sp['myc_contribution'] * b_frac * 0.005

    soil_N[year] = min(100, soil_N[year-1] + soil_N[year])
    soil_organic[year] = min(8, soil_organic[year-1] + soil_organic[year])
    soil_depth[year] = min(50, soil_depth[year-1] + soil_depth[year])
    mycorrhizae[year] = min(1, mycorrhizae[year-1] + mycorrhizae[year])

    # Light decreases as canopy develops
    total_bio = np.sum(biomass[:, year])
    light[year] = max(0.05, 1 - total_bio / 300)

    humidity[year] = min(1, total_bio / 200)

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Facilitation Model: How Pioneer Species Build the Forest', color='white', fontsize=14)

sp_colors = ['#a3e635', '#22c55e', '#16a34a', '#14532d', '#6b21a8']

# Plot 1: Biomass succession
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.stackplot(range(years), biomass, labels=sp_names, colors=sp_colors, alpha=0.8)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Biomass (tonnes/ha)', color='white')
ax.set_title('Species replacement (facilitation)', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Soil development
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(soil_N, color='#22c55e', linewidth=2, label='Nitrogen (kg/ha)')
ax.plot(soil_organic * 10, color='#f59e0b', linewidth=2, label='Organic matter (% × 10)')
ax.plot(soil_depth, color='#3b82f6', linewidth=2, label='Soil depth (cm)')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Soil quality', color='white')
ax.set_title('Soil building by pioneers', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Light and mycorrhizae
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(light, color='#f59e0b', linewidth=2, label='Ground light')
ax.plot(mycorrhizae, color='#a855f7', linewidth=2, label='Mycorrhizal network')
ax.plot(humidity, color='#3b82f6', linewidth=2, label='Humidity')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Level (0-1)', color='white')
ax.set_title('Environmental modification', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Facilitation arrows (which species enables which)
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.axis('off')
y_positions = [0.9, 0.7, 0.5, 0.3, 0.1]
for i, (name, color) in enumerate(zip(sp_names, sp_colors)):
    ax.scatter(0.3, y_positions[i], s=200, c=color, edgecolors='white', linewidths=1, zorder=5)
    ax.text(0.35, y_positions[i], name, color='white', fontsize=8, va='center')
    if i < len(sp_names) - 1:
        ax.annotate('', xy=(0.3, y_positions[i+1] + 0.05), xytext=(0.3, y_positions[i] - 0.05),
                    arrowprops=dict(arrowstyle='->', color='#f59e0b', linewidth=2))
    # Add facilitation mechanism
    mechanisms = ['Fixes N, builds soil', 'Creates shade canopy', 'Deepens soil, adds fungi', 'Provides shade for understory']
    if i < len(mechanisms):
        ax.text(0.55, (y_positions[i] + y_positions[i+1]) / 2, mechanisms[i],
                color='#f59e0b', fontsize=7, va='center')
ax.set_title('Facilitation chain', color='white', fontsize=11)

# Plot 5: Carbon sequestration rate
ax = axes[1, 1]
ax.set_facecolor('#111827')
total_bio = np.sum(biomass, axis=0)
carbon = total_bio * 0.5
carbon_rate = np.diff(carbon)
ax.fill_between(range(1, years), carbon_rate, color='#22c55e', alpha=0.3)
ax.plot(range(1, years), carbon_rate, color='#22c55e', linewidth=2)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Carbon sequestered (tonnes C/ha/yr)', color='white')
ax.set_title('Annual carbon sequestration rate', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: Succession phase diagram
ax = axes[1, 2]
ax.set_facecolor('#111827')
# Phase: dominant species at each time
for g in range(n_sp):
    dominant_years = []
    for year in range(years):
        if biomass[g, year] == np.max(biomass[:, year]) and biomass[g, year] > 1:
            dominant_years.append(year)
    if dominant_years:
        ax.barh(g, max(dominant_years) - min(dominant_years), left=min(dominant_years),
                color=sp_colors[g], edgecolor='none', height=0.6)
        ax.text(np.mean(dominant_years), g, f'{min(dominant_years)}-{max(dominant_years)}',
                color='white', fontsize=7, ha='center', va='center')

ax.set_yticks(range(n_sp))
ax.set_yticklabels(sp_names, color='white', fontsize=7)
ax.set_xlabel('Year', color='white')
ax.set_title('Dominance periods', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Facilitation milestones:")
print(f"  Soil N reaches 50 kg/ha: year {np.argmax(soil_N > 50)}")
print(f"  Canopy closure (light < 0.3): year {np.argmax(light < 0.3)}")
print(f"  Mycorrhizal network > 0.5: year {np.argmax(mycorrhizae > 0.5)}")
print(f"  Max carbon rate: {max(carbon_rate):.1f} tonnes C/ha/yr at year {np.argmax(carbon_rate)+1}")
print(f"  Total carbon at year 150: {carbon[-1]:.0f} tonnes C/ha")`,
      challenge: 'Remove the N-fixer group entirely (simulate planting only non-fixing species). How does soil nitrogen develop? How much slower is the succession? This demonstrates why nitrogen fixation is the keystone process in facilitation.',
      successHint: 'The facilitation model is the scientific basis for all reforestation projects. The Miyawaki method, used across India and Japan, is explicitly designed to accelerate facilitation by planting multiple successional stages simultaneously in dense mixed plantations.',
    },
    {
      title: 'Soil development & mycorrhizal networks — the underground forest',
      concept: `Soil is not dirt — it is a living ecosystem. A teaspoon of healthy forest soil contains more microorganisms than there are humans on Earth. Soil development during succession involves:

**Physical weathering**: roots crack rocks, freezing expands cracks, creating mineral particles.
**Chemical weathering**: organic acids from roots and decomposers dissolve minerals, releasing nutrients.
**Biological building**: dead leaves and roots decompose into **humus** — stable organic matter that holds water and nutrients. Earthworms, fungi, and bacteria are the construction workers.

The most remarkable underground structure is the **mycorrhizal network**: 90% of plant species form partnerships with soil fungi. The fungus extends far beyond the root zone, accessing water and phosphorus the tree cannot reach. In return, the tree provides sugars from photosynthesis.

But mycorrhizae do more than individual partnerships — they form **common mycorrhizal networks (CMNs)** that connect multiple trees. Through these networks:
- Mature trees can transfer carbon and nutrients to struggling seedlings ("mother tree" effect)
- Trees can send chemical warning signals when attacked by pests
- Dying trees dump their carbon into the network, feeding neighboring trees

Suzanne Simard's research showed that forest trees are not competitors in a war for resources — they are cooperating members of a networked community, connected underground.`,
      analogy: 'The mycorrhizal network is like the internet for trees. Each tree is a computer; the fungal threads are fiber-optic cables. Trees share resources (water, nutrients, carbon) through the network, much like servers share data. "Mother trees" (large, old trees) are like major data centers that support many connections. Cut the network (disturb the soil) and individual trees lose access to shared resources. A forest is not a collection of individual trees — it is a network.',
      storyConnection: 'The girl who grew a forest did not just plant trees — she planted a community. The first trees she planted established mycorrhizal networks that later trees plugged into. Each new seedling, planted in the shadow of an older tree, immediately connected to the underground network and received resources from its neighbors. The girl could not see this network, but she observed its effects: seedlings near established trees grew faster and survived drought better.',
      checkQuestion: 'A reforestation project on degraded land plants 1000 seedlings. After 5 years, 400 have died. A second project on adjacent land with existing mycorrhizal networks (from remnant trees) plants 1000 seedlings. After 5 years, only 100 have died. What explains the difference?',
      checkAnswer: 'The second site had an existing mycorrhizal network from remnant trees. Seedlings immediately connected to this network and received water, phosphorus, and potentially carbon subsidies from established trees. On the degraded site, seedlings had to build mycorrhizal partnerships from scratch, which takes 1-2 years. During this vulnerable period, many died from drought and nutrient stress. Lesson: preserving remnant trees and their mycorrhizal networks dramatically improves reforestation success.',
      codeIntro: 'Model soil development and mycorrhizal network growth during reforestation, comparing sites with and without existing mycorrhizal networks.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Soil development model ---
years = 100

def soil_model(has_mycorrhizae=True, has_remnant_trees=False):
    """Model soil and mycorrhizal development."""
    # Soil layers
    organic_matter = np.zeros(years)  # % organic matter
    soil_N = np.zeros(years)           # available N (kg/ha)
    soil_P = np.zeros(years)           # available P (kg/ha)
    soil_water_capacity = np.zeros(years)  # water holding (mm)
    myc_density = np.zeros(years)      # mycorrhizal hyphae density (0-1)
    tree_biomass = np.zeros(years)

    # Initial conditions
    if has_remnant_trees:
        organic_matter[0] = 2.0
        soil_N[0] = 30
        soil_P[0] = 10
        myc_density[0] = 0.5
        tree_biomass[0] = 20
    else:
        organic_matter[0] = 0.5
        soil_N[0] = 8
        soil_P[0] = 3
        myc_density[0] = 0.05 if has_mycorrhizae else 0.01

    for year in range(1, years):
        # Litter input (proportional to tree biomass)
        litter = tree_biomass[year-1] * 0.03  # 3% annual leaf fall

        # Decomposition (depends on temperature, moisture, microbes)
        decomp_rate = 0.05 * (1 + myc_density[year-1])
        decomposition = organic_matter[year-1] * decomp_rate

        # Organic matter balance
        organic_matter[year] = organic_matter[year-1] + litter * 0.01 - decomposition * 0.5
        organic_matter[year] = np.clip(organic_matter[year], 0, 10)

        # Nitrogen: mineralization from organic matter + N-fixation
        n_mineralization = organic_matter[year] * 2
        n_fixation = 5 * min(tree_biomass[year-1] / 50, 1)  # N-fixing trees
        soil_N[year] = np.clip(soil_N[year-1] * 0.95 + n_mineralization + n_fixation, 0, 100)

        # Phosphorus: weathering + mycorrhizal mining
        p_weathering = 0.5
        p_myc_mining = 3 * myc_density[year-1]  # mycorrhizae greatly increase P access
        soil_P[year] = np.clip(soil_P[year-1] * 0.97 + p_weathering + p_myc_mining, 0, 50)

        # Water capacity (improves with organic matter)
        soil_water_capacity[year] = 50 + organic_matter[year] * 20

        # Mycorrhizal network growth
        if has_mycorrhizae:
            myc_growth = 0.02 * tree_biomass[year-1] / 100
            myc_natural = 0.005  # slow natural colonization
            myc_density[year] = np.clip(myc_density[year-1] + myc_growth + myc_natural, 0, 1)
        else:
            myc_density[year] = myc_density[year-1] * 1.01  # very slow without inoculation

        # Tree growth (depends on nutrients, water, mycorrhizae)
        n_limit = min(1, soil_N[year] / 40)
        p_limit = min(1, soil_P[year] / 15)
        water_limit = min(1, soil_water_capacity[year] / 100)
        myc_boost = 1 + 0.5 * myc_density[year]

        growth_potential = 0.1 * n_limit * p_limit * water_limit * myc_boost
        tree_biomass[year] = tree_biomass[year-1] + growth_potential * tree_biomass[year-1] * (1 - tree_biomass[year-1] / 200)

        # Establishment boost in early years
        if year < 5 and tree_biomass[year] < 5:
            tree_biomass[year] = max(tree_biomass[year], 2 + year)

    return {
        'organic': organic_matter, 'N': soil_N, 'P': soil_P,
        'water': soil_water_capacity, 'myc': myc_density, 'biomass': tree_biomass,
    }

# Three scenarios
bare = soil_model(has_mycorrhizae=True, has_remnant_trees=False)
with_myc = soil_model(has_mycorrhizae=True, has_remnant_trees=False)
with_remnant = soil_model(has_mycorrhizae=True, has_remnant_trees=True)
no_myc = soil_model(has_mycorrhizae=False, has_remnant_trees=False)

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Soil Development & Mycorrhizal Networks in Reforestation', color='white', fontsize=14)

scenarios = [
    ('Bare ground', bare, '#ef4444'),
    ('With mycorrhizae', with_myc, '#f59e0b'),
    ('Remnant trees present', with_remnant, '#22c55e'),
    ('No mycorrhizae', no_myc, '#6b7280'),
]

# Plot 1: Tree biomass
ax = axes[0, 0]
ax.set_facecolor('#111827')
for name, data, color in scenarios:
    ax.plot(data['biomass'], color=color, linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Tree biomass (tonnes/ha)', color='white')
ax.set_title('Forest growth under different soil conditions', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Soil nitrogen
ax = axes[0, 1]
ax.set_facecolor('#111827')
for name, data, color in scenarios:
    ax.plot(data['N'], color=color, linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Available N (kg/ha)', color='white')
ax.set_title('Soil nitrogen accumulation', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Mycorrhizal density
ax = axes[0, 2]
ax.set_facecolor('#111827')
for name, data, color in scenarios:
    ax.plot(data['myc'], color=color, linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Network density (0-1)', color='white')
ax.set_title('Mycorrhizal network development', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Phosphorus (mycorrhizal effect most dramatic here)
ax = axes[1, 0]
ax.set_facecolor('#111827')
for name, data, color in scenarios:
    ax.plot(data['P'], color=color, linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Available P (kg/ha)', color='white')
ax.set_title('Phosphorus: mycorrhizae make the difference', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Organic matter
ax = axes[1, 1]
ax.set_facecolor('#111827')
for name, data, color in scenarios:
    ax.plot(data['organic'], color=color, linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Organic matter (%)', color='white')
ax.set_title('Soil organic matter buildup', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Time to milestones
ax = axes[1, 2]
ax.set_facecolor('#111827')
milestones = ['Biomass > 50', 'Soil N > 40', 'Myc > 0.5', 'Organic > 3%']
for idx, (name, data, color) in enumerate(scenarios[:3]):
    times = [
        np.argmax(data['biomass'] > 50) if any(data['biomass'] > 50) else 100,
        np.argmax(data['N'] > 40) if any(data['N'] > 40) else 100,
        np.argmax(data['myc'] > 0.5) if any(data['myc'] > 0.5) else 100,
        np.argmax(data['organic'] > 3) if any(data['organic'] > 3) else 100,
    ]
    ax.barh(np.arange(len(milestones)) + idx * 0.25, times, 0.2, color=color,
            edgecolor='none', label=name[:10])

ax.set_yticks(np.arange(len(milestones)) + 0.25)
ax.set_yticklabels(milestones, color='white', fontsize=8)
ax.set_xlabel('Years to reach milestone', color='white')
ax.set_title('Time to restoration milestones', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Mycorrhizal network effect on P availability:")
print(f"  With mycorrhizae at year 50: P = {with_myc['P'][50]:.1f} kg/ha")
print(f"  Without mycorrhizae at year 50: P = {no_myc['P'][50]:.1f} kg/ha")
print(f"  Mycorrhizal P mining advantage: {with_myc['P'][50]/max(no_myc['P'][50],0.1):.1f}x")
print(f"\\nRemnant trees accelerate forest development by ~{np.argmax(bare['biomass'] > 50) - np.argmax(with_remnant['biomass'] > 50)} years")`,
      challenge: 'Add a "soil disturbance" event at year 30 (tilling destroys mycorrhizal network, resets myc_density to 0.1). How long does recovery take? This simulates the impact of converting forest to farmland and back.',
      successHint: 'Suzanne Simard\'s "Finding the Mother Tree" popularized mycorrhizal networks, but the science is rigorous and quantitative. Your model captures the core dynamics: mycorrhizae are not optional decorations — they are infrastructure that determines whether reforestation succeeds or fails.',
    },
    {
      title: 'Carbon accounting — measuring the climate value of forests',
      concept: `Forests are the largest terrestrial carbon sink, storing ~450 billion tonnes of carbon globally. When a girl grows a forest, she is building a carbon bank. Quantifying this requires **carbon accounting**:

**Carbon pools in a forest**:
1. **Above-ground biomass (AGB)**: trunks, branches, leaves. Measured via allometric equations: biomass = a × DBH^b (where DBH = diameter at breast height).
2. **Below-ground biomass (BGB)**: roots. Typically 20-30% of AGB.
3. **Dead wood**: fallen trees, branches. Important reservoir, 5-15% of total.
4. **Litter layer**: leaf litter, decomposing material. 1-5% of total.
5. **Soil organic carbon (SOC)**: the largest pool, often > AGB. Slow to build, slow to release.

**Carbon sequestration** = rate of carbon accumulation = photosynthesis - respiration - decomposition.

Young forests sequester carbon fastest (rapid growth). Mature forests sequester slowly (growth ≈ respiration) but STORE the most carbon. This distinction matters for climate policy:
- Planting new forests = high sequestration rate for 30-50 years
- Protecting old forests = preserving massive existing carbon stocks

**The Miyawaki method** (dense native planting, 3-5 trees/m²) achieves carbon sequestration rates of 5-10 tonnes C/ha/year in the first 20 years — 10× faster than conventional plantations.`,
      analogy: 'Carbon accounting is like personal finance. Sequestration is your savings rate (income minus expenses). Storage is your total bank balance. A young professional with high income and low expenses (young forest) has a great savings rate. A retiree (old forest) has low income but massive savings built over decades. Cutting down an old forest is like emptying a retirement account — the loss is far greater than the annual contributions.',
      storyConnection: 'The girl who grew a forest is fighting climate change one tree at a time. Her forest is a carbon bank that grows every year. If she planted a Miyawaki forest of 3000 trees on one hectare, after 20 years it would store approximately 100 tonnes of carbon — equivalent to the lifetime emissions of 5-10 people. The story is about one girl, but the carbon math scales to entire landscapes.',
      checkQuestion: 'A 50-year-old forest stores 150 tonnes C/ha and sequesters 2 tonnes C/ha/year. A developer proposes cutting it and planting a new forest that will sequester 8 tonnes C/ha/year initially. Is this a net climate benefit?',
      checkAnswer: 'No. Cutting releases 150 tonnes immediately (via decomposition and burning). The new forest sequesters 8 tonnes/year initially but declines. To replace the released 150 tonnes at an average rate of ~5 tonnes/year takes 30 years. For 30 years, the atmosphere has MORE CO2 than if we had left the original forest standing. The "carbon debt" from cutting old-growth forests takes decades to repay. Protecting existing forests is almost always better for climate than cutting and replanting.',
      codeIntro: 'Build a comprehensive carbon accounting model for a reforestation project, tracking all five carbon pools and comparing conventional planting to the Miyawaki method.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Forest carbon accounting model ---
years = 80

def carbon_model(method='conventional', area_ha=1):
    """Model carbon in 5 pools over time."""
    # Method parameters
    if method == 'miyawaki':
        trees_per_ha = 3000  # dense planting
        initial_growth_rate = 0.25  # fast early growth
        max_agb = 180  # tonnes C/ha
        mortality_rate = 0.15  # high initial mortality but dense planting compensates
    elif method == 'conventional':
        trees_per_ha = 400
        initial_growth_rate = 0.12
        max_agb = 120
        mortality_rate = 0.05
    else:  # natural regeneration
        trees_per_ha = 100  # slow natural establishment
        initial_growth_rate = 0.06
        max_agb = 100
        mortality_rate = 0.08

    # Carbon pools
    agb = np.zeros(years)  # above-ground biomass
    bgb = np.zeros(years)  # below-ground (roots)
    dead_wood = np.zeros(years)
    litter = np.zeros(years)
    soc = np.zeros(years)  # soil organic carbon

    # Initial SOC (degraded land)
    soc[0] = 30  # tonnes C/ha in degraded soil

    for year in range(1, years):
        # AGB growth: logistic with method-specific parameters
        age = year
        growth_rate = initial_growth_rate * (1 + 0.02 * min(age, 30))  # accelerates then plateaus
        agb_growth = growth_rate * agb[year-1] * (1 - agb[year-1] / max_agb)

        # Initial planting boost
        if year == 1:
            agb_growth = trees_per_ha * 0.005  # initial seedling biomass

        # Mortality creates dead wood
        mortality = agb[year-1] * mortality_rate * np.exp(-age * 0.05)

        agb[year] = max(0, agb[year-1] + agb_growth - mortality)

        # BGB = 25% of AGB
        bgb[year] = agb[year] * 0.25

        # Dead wood: accumulates from mortality, decomposes over time
        dead_wood[year] = dead_wood[year-1] * 0.9 + mortality  # 10%/year decomposition

        # Litter: leaf fall (3% of AGB/year), decomposes fast
        leaf_fall = agb[year] * 0.03
        litter[year] = litter[year-1] * 0.7 + leaf_fall  # 30%/year decomposition

        # SOC: builds slowly from root turnover and decomposition products
        root_input = bgb[year] * 0.01  # root turnover
        decomp_input = (dead_wood[year-1] * 0.1 + litter[year-1] * 0.3) * 0.3  # humus formation
        soc_loss = soc[year-1] * 0.005  # slow SOC decomposition
        soc[year] = soc[year-1] + root_input + decomp_input - soc_loss

    total = agb + bgb + dead_wood + litter + soc
    sequestration = np.diff(total)

    return {
        'agb': agb * area_ha, 'bgb': bgb * area_ha,
        'dead_wood': dead_wood * area_ha, 'litter': litter * area_ha,
        'soc': soc * area_ha, 'total': total * area_ha,
        'sequestration': sequestration * area_ha,
    }

miyawaki = carbon_model('miyawaki')
conventional = carbon_model('conventional')
natural = carbon_model('natural')

# CO2 equivalents (1 tonne C = 3.67 tonnes CO2)
co2_factor = 3.67

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Forest Carbon Accounting: Miyawaki vs Conventional vs Natural', color='white', fontsize=14)

# Plot 1: Carbon pools stacked (Miyawaki)
ax = axes[0, 0]
ax.set_facecolor('#111827')
pools = [miyawaki['soc'], miyawaki['bgb'], miyawaki['agb'], miyawaki['dead_wood'], miyawaki['litter']]
pool_names = ['Soil organic C', 'Below-ground', 'Above-ground', 'Dead wood', 'Litter']
pool_colors = ['#92400e', '#a16207', '#22c55e', '#6b7280', '#d4d4d4']
ax.stackplot(range(years), pools, labels=pool_names, colors=pool_colors, alpha=0.8)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Carbon stored (tonnes C/ha)', color='white')
ax.set_title('Miyawaki: carbon pools', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper left')
ax.tick_params(colors='gray')

# Plot 2: Total carbon comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(miyawaki['total'], color='#22c55e', linewidth=2, label='Miyawaki')
ax.plot(conventional['total'], color='#3b82f6', linewidth=2, label='Conventional')
ax.plot(natural['total'], color='#f59e0b', linewidth=2, label='Natural regen.')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Total carbon (tonnes C/ha)', color='white')
ax.set_title('Total carbon storage comparison', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Annual sequestration rate
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(miyawaki['sequestration'], color='#22c55e', linewidth=2, label='Miyawaki')
ax.plot(conventional['sequestration'], color='#3b82f6', linewidth=2, label='Conventional')
ax.plot(natural['sequestration'], color='#f59e0b', linewidth=2, label='Natural')
ax.axhline(0, color='gray', linewidth=0.5)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Sequestration (tonnes C/ha/yr)', color='white')
ax.set_title('Annual carbon sequestration rate', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: CO2 equivalent offset
ax = axes[1, 0]
ax.set_facecolor('#111827')
for data, name, color in [
    (miyawaki, 'Miyawaki', '#22c55e'),
    (conventional, 'Conventional', '#3b82f6'),
    (natural, 'Natural', '#f59e0b'),
]:
    co2_offset = (data['total'] - data['total'][0]) * co2_factor
    ax.plot(co2_offset, color=color, linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('CO₂ offset (tonnes CO₂/ha)', color='white')
ax.set_title('Climate impact: CO₂ offset', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Cost-effectiveness
ax = axes[1, 1]
ax.set_facecolor('#111827')
costs_per_ha = {'Miyawaki': 5, 'Conventional': 1.5, 'Natural': 0.3}  # lakh ₹
carbon_at_30 = {'Miyawaki': miyawaki['total'][30] - miyawaki['total'][0],
                'Conventional': conventional['total'][30] - conventional['total'][0],
                'Natural': natural['total'][30] - natural['total'][0]}
methods = list(costs_per_ha.keys())
costs = [costs_per_ha[m] for m in methods]
carbons = [carbon_at_30[m] for m in methods]
cost_per_tonne = [c * 100000 / (ca * co2_factor) if ca > 0 else 0 for c, ca in zip(costs, carbons)]

colors_m = ['#22c55e', '#3b82f6', '#f59e0b']
ax.bar(methods, cost_per_tonne, color=colors_m, edgecolor='none')
for i, (m, cpt) in enumerate(zip(methods, cost_per_tonne)):
    ax.text(i, cpt + 20, f'₹{cpt:.0f}', ha='center', color='white', fontsize=10, fontweight='bold')
ax.set_ylabel('Cost per tonne CO₂ (₹)', color='white')
ax.set_title('Cost-effectiveness at year 30', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: Summary table
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
rows = []
for name, data, cost in [('Miyawaki', miyawaki, 5), ('Conventional', conventional, 1.5), ('Natural', natural, 0.3)]:
    c20 = data['total'][20] - data['total'][0]
    c50 = data['total'][50] - data['total'][0]
    peak_rate = max(data['sequestration'])
    rows.append([name, f'{c20:.0f}', f'{c50:.0f}', f'{peak_rate:.1f}', f'₹{cost}L'])

table = ax.table(cellText=rows,
                colLabels=['Method', 'C@20yr', 'C@50yr', 'Peak rate', 'Cost/ha'],
                cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(9)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
ax.set_title('Method comparison (tonnes C/ha)', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"Carbon stored at year 50:")
print(f"  Miyawaki:      {miyawaki['total'][50]:.0f} tonnes C/ha ({miyawaki['total'][50]*co2_factor:.0f} tonnes CO₂)")
print(f"  Conventional:  {conventional['total'][50]:.0f} tonnes C/ha ({conventional['total'][50]*co2_factor:.0f} tonnes CO₂)")
print(f"  Natural:       {natural['total'][50]:.0f} tonnes C/ha ({natural['total'][50]*co2_factor:.0f} tonnes CO₂)")
print(f"\\nMiyawaki advantage at 50 years: {(miyawaki['total'][50]/conventional['total'][50] - 1)*100:.0f}% more carbon")`,
      challenge: 'Model the carbon impact of cutting a 100-year-old forest and replanting with Miyawaki method. Calculate the "carbon payback period" — how many years until the new forest stores as much total carbon as the old forest had. This is the carbon debt concept.',
      successHint: 'Carbon accounting is the basis of REDD+ (Reducing Emissions from Deforestation and forest Degradation) and carbon credit markets. India\'s National REDD+ Strategy uses exactly these calculations. The girl who grew a forest is earning carbon credits, whether she knows it or not.',
    },
    {
      title: 'The Miyawaki method — engineering rapid forest succession',
      concept: `The Miyawaki method, developed by Japanese botanist Akira Miyawaki, creates dense native forests that reach maturity in 20-30 years instead of 200+ years. The method:

1. **Soil preparation**: deep tilling, adding organic matter (compost, mulch) to create 0.5-1m of improved soil
2. **Species selection**: 30-50 native species from ALL successional stages, in natural proportions
3. **Dense planting**: 3-5 seedlings per m² (10-30× conventional density)
4. **Random mixing**: no rows — species randomly distributed, mimicking natural forest
5. **3 years of care**: watering, weeding, mulching. After 3 years, the forest is self-sustaining.
6. **No management after year 3**: the forest manages itself through natural processes

Why does it work so fast? The extreme density triggers:
- **Competition for light**: trees grow upward rapidly (etiolation), reaching 3-4m in 3 years
- **Early canopy closure**: dense planting creates closed canopy within 2-3 years (vs 15-20 normally)
- **Facilitation in overdrive**: nitrogen-fixers, deep-rooters, and mycorrhizal hosts are all present from day 1
- **Self-thinning**: weaker trees die, providing dead wood, nutrients, and habitat — natural succession is compressed

India has planted over 70 Miyawaki forests in cities including Mumbai, Delhi, and Bengaluru. Results are dramatic: forests reaching 4m height in 2 years, supporting birds and insects within 3 years.`,
      analogy: 'The Miyawaki method is like a startup accelerator vs. traditional business development. In a traditional company (conventional planting), one person builds the business slowly over 30 years. In an accelerator (Miyawaki), you pack 50 startups into one building, force them to compete, share resources, and grow fast. Many fail (self-thinning), but the survivors are strong, the building is full of activity, and the ecosystem is vibrant in 3 years instead of 30.',
      storyConnection: 'The girl who grew a forest could have planted trees one by one, waiting decades for a forest. Instead, imagine she used the Miyawaki method: planting 3000 seedlings of 40 different species on a single hectare. Within 3 years, she would have a dense young forest taller than herself. Within 20 years, it would look like a forest that took nature 100 years to build. This is the power of understanding succession and engineering it.',
      checkQuestion: 'A Miyawaki forest has 3000 trees/ha initially. After 20 years, it has 800 trees/ha. Where did the other 2200 trees go? Is this a failure?',
      checkAnswer: 'No — it is the plan. Self-thinning is essential. The 2200 trees that died were mostly pioneers and weak individuals that served their purpose: creating shade, building soil, and forcing the survivors to grow tall and fast. Their dead wood feeds the soil ecosystem. The surviving 800 are strong, well-established trees of diverse species, forming a mature canopy. Natural forests also self-thin; Miyawaki just compresses the timeline. High initial density followed by self-thinning is the engine of rapid forest development.',
      codeIntro: 'Simulate a Miyawaki forest from planting through self-thinning and canopy development, tracking species composition, growth rates, and biodiversity over 30 years.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Miyawaki forest simulation ---
years = 30
area = 1  # hectare

# Species pool: 40 native species across 4 successional stages
n_species = 40
stage_names = ['Pioneer', 'Early secondary', 'Late secondary', 'Climax']
stage_fractions = [0.25, 0.30, 0.25, 0.20]  # planting proportions

# Species properties
species_stage = np.concatenate([
    np.zeros(10), np.ones(12), np.full(10, 2), np.full(8, 3)
]).astype(int)

max_height = np.array([
    *np.random.uniform(8, 15, 10),   # pioneers
    *np.random.uniform(12, 25, 12),  # early secondary
    *np.random.uniform(20, 35, 10),  # late secondary
    *np.random.uniform(25, 40, 8),   # climax
])

growth_rate = np.array([
    *np.random.uniform(1.0, 2.0, 10),
    *np.random.uniform(0.6, 1.2, 12),
    *np.random.uniform(0.3, 0.6, 10),
    *np.random.uniform(0.15, 0.35, 8),
])

shade_tolerance = np.array([
    *np.random.uniform(0.1, 0.3, 10),
    *np.random.uniform(0.3, 0.5, 12),
    *np.random.uniform(0.5, 0.7, 10),
    *np.random.uniform(0.7, 0.9, 8),
])

# Plant 3000 trees
n_initial = 3000
individual_species = np.random.choice(n_species, n_initial, p=np.repeat(
    np.array(stage_fractions) / np.array([10, 12, 10, 8]),
    [10, 12, 10, 8]
))

individual_height = np.random.uniform(0.3, 0.8, n_initial)  # initial seedling height
individual_alive = np.ones(n_initial, dtype=bool)

# Track over time
height_history = np.zeros((n_initial, years))
alive_count = np.zeros(years)
species_count = np.zeros(years)
canopy_height = np.zeros(years)
biomass_total = np.zeros(years)
stage_counts = np.zeros((4, years))

for year in range(years):
    # Calculate light at ground level
    total_canopy = np.sum(individual_height[individual_alive] > 3)
    light = max(0.05, 1 - total_canopy / 2000)

    for i in range(n_initial):
        if not individual_alive[i]:
            continue

        sp = individual_species[i]
        h = individual_height[i]

        # Growth (competition for light)
        light_competition = max(0.2, 1 - (np.sum(individual_alive) - 1) / 4000)
        shade_effect = shade_tolerance[sp] * (1 - light) + (1 - shade_tolerance[sp]) * light
        height_growth = growth_rate[sp] * shade_effect * light_competition * (1 - h / max_height[sp])
        height_growth = max(0, height_growth + np.random.normal(0, 0.05))

        individual_height[i] = min(max_height[sp], h + height_growth)

        # Mortality: competition-driven self-thinning
        if year > 2:
            # Small trees under dense canopy die
            if h < canopy_height[year-1] * 0.3 and shade_tolerance[sp] < 0.3:
                if np.random.random() < 0.15:
                    individual_alive[i] = False
            # Pioneers die under shade
            if species_stage[sp] == 0 and light < 0.3 and year > 10:
                if np.random.random() < 0.08:
                    individual_alive[i] = False
            # Random mortality
            if np.random.random() < 0.01:
                individual_alive[i] = False

    height_history[:, year] = individual_height
    alive_count[year] = np.sum(individual_alive)
    species_alive = set(individual_species[individual_alive])
    species_count[year] = len(species_alive)
    canopy_height[year] = np.percentile(individual_height[individual_alive], 90) if any(individual_alive) else 0
    biomass_total[year] = np.sum(individual_height[individual_alive] ** 2 * 0.01)  # rough biomass proxy

    for stage in range(4):
        mask = individual_alive & np.isin(individual_species, np.where(species_stage == stage)[0])
        stage_counts[stage, year] = np.sum(mask)

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Miyawaki Forest Development: 3000 Trees on 1 Hectare', color='white', fontsize=14)

# Plot 1: Tree count and self-thinning
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(alive_count, color='#22c55e', linewidth=2)
ax.fill_between(range(years), alive_count, alpha=0.2, color='#22c55e')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Living trees', color='white')
ax.set_title(f'Self-thinning: {n_initial} → {int(alive_count[-1])} trees', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 2: Canopy height
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(canopy_height, color='#22c55e', linewidth=2)
ax.fill_between(range(years), canopy_height, alpha=0.2, color='#22c55e')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Canopy height (m)', color='white')
ax.set_title('Rapid vertical growth', color='white', fontsize=11)
# Milestones
for h_val, label in [(4, '4m in ~3yr'), (15, '15m in ~10yr')]:
    yr = np.argmax(canopy_height > h_val)
    if yr > 0:
        ax.annotate(label, (yr, h_val), color='#f59e0b', fontsize=8,
                   arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax.tick_params(colors='gray')

# Plot 3: Species by successional stage
ax = axes[0, 2]
ax.set_facecolor('#111827')
stage_colors = ['#a3e635', '#22c55e', '#16a34a', '#14532d']
ax.stackplot(range(years), stage_counts, labels=stage_names, colors=stage_colors, alpha=0.8)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Number of trees', color='white')
ax.set_title('Successional stage composition', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Species richness
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(species_count, color='#a855f7', linewidth=2)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Species present', color='white')
ax.set_title(f'Biodiversity: {int(species_count[0])} → {int(species_count[-1])} species', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 5: Height distribution at years 1, 10, 30
ax = axes[1, 1]
ax.set_facecolor('#111827')
for yr, color, label in [(0, '#ef4444', 'Year 1'), (9, '#f59e0b', 'Year 10'), (29, '#22c55e', 'Year 30')]:
    heights = height_history[individual_alive, yr] if yr == 29 else height_history[:, yr]
    heights = heights[heights > 0]
    if len(heights) > 0:
        ax.hist(heights, bins=20, alpha=0.5, color=color, label=label, edgecolor='none')
ax.set_xlabel('Height (m)', color='white')
ax.set_ylabel('Number of trees', color='white')
ax.set_title('Height distribution evolution', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Biomass and carbon
ax = axes[1, 2]
ax.set_facecolor('#111827')
carbon = biomass_total * 0.5
ax.fill_between(range(years), carbon, color='#22c55e', alpha=0.3)
ax.plot(carbon, color='#22c55e', linewidth=2, label='Carbon stored')
seq_rate = np.diff(carbon)
ax.plot(range(1, years), seq_rate * 5, color='#f59e0b', linewidth=1.5, label='Sequestration rate (×5)')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Carbon (tonnes/ha)', color='white')
ax.set_title('Carbon accumulation', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Miyawaki forest at year 30:")
print(f"  Trees: {int(alive_count[-1])} of {n_initial} planted ({alive_count[-1]/n_initial*100:.0f}% survival)")
print(f"  Species: {int(species_count[-1])} of {n_species}")
print(f"  Canopy height: {canopy_height[-1]:.1f}m")
print(f"  Carbon stored: {carbon[-1]:.0f} tonnes C/ha")
print(f"  Self-management: no human intervention needed after year 3")`,
      challenge: 'Compare a Miyawaki forest (3000 trees/ha) to a conventional plantation of the same species but at 400 trees/ha. Track height, biomass, and species diversity over 30 years. Quantify the Miyawaki advantage.',
      successHint: 'The Miyawaki method is being used across India — from corporate campuses in Bengaluru to highway medians in Delhi. You now understand the science behind it: dense planting + multiple successional stages + self-thinning = rapid forest development. The girl who grew a forest could accelerate her work dramatically using this method.',
    },
    {
      title: 'Afforestation at landscape scale — integrating succession, carbon, and biodiversity',
      concept: `Scaling from one hectare to an entire landscape requires integrating everything: succession models, carbon accounting, biodiversity targets, cost constraints, and land-use trade-offs.

A landscape-scale reforestation plan must answer:
1. **Where to plant**: prioritize degraded lands with restoration potential (based on soil, rainfall, proximity to seed sources)
2. **What to plant**: species selection based on native flora, site conditions, and restoration goals
3. **How much**: target area based on carbon commitments, biodiversity targets, or watershed protection
4. **How to monitor**: remote sensing + ground surveys to track canopy cover, biomass, species diversity

India's **Green India Mission** aims to increase forest cover by 5 million hectares. The Bonn Challenge commits to restoring 350 million hectares globally by 2030. These are massive commitments that require the computational tools you have been building:
- Succession models predict timeline and species composition
- Carbon accounting justifies climate investments
- Biodiversity metrics track ecosystem health
- Cost-benefit analysis guides resource allocation

The girl who grew a forest showed that one person can make a difference. Scaling to landscape requires the same principles applied computationally to thousands of hectares.`,
      analogy: 'Landscape reforestation planning is like urban planning. You cannot just plant trees randomly any more than you can build houses randomly. You need zoning (which areas get which treatment), infrastructure (roads and corridors connect forest patches), phased development (plant pioneers first, climax later), and ongoing monitoring (is the plan working?). The succession model is your zoning plan, carbon accounting is your budget, and biodiversity metrics are your quality inspections.',
      storyConnection: 'The girl started with one patch of barren land. But her success inspired neighbors, and soon an entire hillside was being reforested. This is the landscape-scale challenge: coordinating multiple restoration sites, prioritizing limited resources, and tracking progress across space and time. Her story scales from one girl to a movement — and the science scales with it.',
      checkQuestion: 'You have 1000 hectares of degraded land, a budget of ₹50 crore, and a target of storing 50,000 tonnes of CO₂ in 30 years. The Miyawaki method costs ₹5 lakh/ha and stores 200 tonnes CO₂/ha in 30 years. Conventional planting costs ₹1.5 lakh/ha and stores 100 tonnes CO₂/ha in 30 years. How should you allocate the budget?',
      checkAnswer: 'Miyawaki: 200 tonnes CO₂ per ₹5 lakh = 40 tonnes/lakh. Conventional: 100 tonnes per ₹1.5 lakh = 67 tonnes/lakh. Conventional is more cost-effective per tonne CO₂! With ₹50 crore, you can do: 1000 ha conventional × ₹1.5L = ₹15 crore → 100,000 tonnes CO₂. That exceeds the target with budget to spare. OR: 200 ha Miyawaki (₹10 crore) + 267 ha conventional (₹4 crore) = ₹14 crore → 40,000 + 26,700 = 66,700 tonnes. Best strategy depends on whether you also value biodiversity (Miyawaki wins) or just carbon (conventional wins per rupee).',
      codeIntro: 'Build a landscape-scale reforestation planner that optimizes species allocation, carbon targets, and biodiversity goals across multiple restoration sites.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Landscape restoration planner ---
n_sites = 8
site_names = ['Hillside A', 'Riverbank', 'Degraded farm', 'Mine site',
              'Hillside B', 'Wetland edge', 'Road corridor', 'Urban patch']
site_areas = np.array([150, 80, 200, 50, 120, 60, 30, 10])  # hectares
site_soil_quality = np.array([0.4, 0.7, 0.5, 0.2, 0.5, 0.8, 0.3, 0.6])
site_water = np.array([0.5, 0.9, 0.6, 0.3, 0.4, 0.95, 0.5, 0.7])
site_seed_proximity = np.array([0.7, 0.8, 0.3, 0.2, 0.6, 0.9, 0.4, 0.5])

methods = ['Miyawaki', 'Conventional', 'Natural regen.', 'Assisted natural']
method_costs = np.array([5, 1.5, 0.3, 0.8])  # lakh ₹/ha
method_carbon_30yr = np.array([100, 50, 25, 40])  # tonnes C/ha at 30 years
method_biodiversity = np.array([0.9, 0.5, 0.7, 0.6])  # biodiversity score (0-1)
method_min_soil = np.array([0.3, 0.2, 0.1, 0.15])

budget = 50  # crore ₹ = 5000 lakh

# Suitability of each method at each site
suitability = np.zeros((n_sites, len(methods)))
for i in range(n_sites):
    for j in range(len(methods)):
        soil_ok = 1 if site_soil_quality[i] >= method_min_soil[j] else 0.3
        water_ok = min(1, site_water[i] / 0.4)
        seed_ok = min(1, site_seed_proximity[i] / 0.3) if methods[j] in ['Natural regen.', 'Assisted natural'] else 1
        suitability[i, j] = soil_ok * water_ok * seed_ok

# --- Optimization: allocate method to each site to maximize carbon + biodiversity ---
# Simple greedy: for each site, choose best method considering cost constraint
best_allocation = np.full(n_sites, -1)
best_area_allocated = np.zeros(n_sites)
remaining_budget = budget * 100  # in lakhs

# Score = carbon × biodiversity × suitability / cost
for iteration in range(n_sites * 2):
    best_score = -1
    best_site = -1
    best_method = -1
    best_area = 0

    for i in range(n_sites):
        remaining_area = site_areas[i] - best_area_allocated[i]
        if remaining_area <= 0:
            continue

        for j in range(len(methods)):
            affordable_area = min(remaining_area, remaining_budget / method_costs[j])
            if affordable_area < 5:
                continue

            carbon = method_carbon_30yr[j] * affordable_area * suitability[i, j]
            biodiv = method_biodiversity[j] * suitability[i, j]
            cost = method_costs[j] * affordable_area
            score = (carbon * 0.6 + biodiv * affordable_area * 100 * 0.4) / max(cost, 0.1)

            if score > best_score:
                best_score = score
                best_site = i
                best_method = j
                best_area = affordable_area

    if best_site < 0:
        break

    best_allocation[best_site] = best_method
    best_area_allocated[best_site] = min(site_areas[best_site], best_area_allocated[best_site] + best_area)
    remaining_budget -= method_costs[best_method] * best_area

# Calculate outcomes
total_carbon = 0
total_cost = 0
total_area = 0
site_results = []
for i in range(n_sites):
    if best_allocation[i] >= 0 and best_area_allocated[i] > 0:
        j = best_allocation[i]
        area = best_area_allocated[i]
        carbon = method_carbon_30yr[j] * area * suitability[i, j]
        cost = method_costs[j] * area
        biodiv = method_biodiversity[j] * suitability[i, j]
        total_carbon += carbon
        total_cost += cost
        total_area += area
        site_results.append({
            'site': site_names[i], 'method': methods[j],
            'area': area, 'carbon': carbon, 'cost': cost, 'biodiv': biodiv,
        })

# 30-year projection
yearly_carbon = np.zeros(30)
for year in range(30):
    frac = min(1, (year / 30) ** 0.7)  # growth curve
    yearly_carbon[year] = total_carbon * frac

# --- Dashboard ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('LANDSCAPE REFORESTATION PLAN — 700 ha Target', color='white', fontsize=14)

# Plot 1: Site map with allocations
ax = axes[0, 0]
ax.set_facecolor('#111827')
method_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']
for i, res in enumerate(site_results):
    j = methods.index(res['method'])
    ax.barh(i, res['area'], color=method_colors[j], edgecolor='none', height=0.6)
    ax.text(res['area'] + 2, i, f"{res['method']} ({res['area']:.0f} ha)", color='white', fontsize=7, va='center')
ax.set_yticks(range(len(site_results)))
ax.set_yticklabels([r['site'] for r in site_results], color='white', fontsize=7)
ax.set_xlabel('Area (ha)', color='white')
ax.set_title('Restoration method allocation', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 2: Carbon vs cost
ax = axes[0, 1]
ax.set_facecolor('#111827')
for res in site_results:
    j = methods.index(res['method'])
    ax.scatter(res['cost'] / 100, res['carbon'] / 1000, s=res['area'] * 3,
               c=method_colors[j], edgecolors='white', linewidths=0.5, alpha=0.8)
    ax.annotate(res['site'][:8], (res['cost'] / 100, res['carbon'] / 1000),
               color='white', fontsize=6, textcoords="offset points", xytext=(3, 3))
ax.set_xlabel('Cost (₹ crore)', color='white')
ax.set_ylabel('Carbon (thousand tonnes C)', color='white')
ax.set_title('Cost vs carbon by site', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 3: 30-year carbon projection
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.fill_between(range(30), yearly_carbon / 1000, color='#22c55e', alpha=0.3)
ax.plot(yearly_carbon / 1000, color='#22c55e', linewidth=2)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Cumulative carbon (thousand tonnes C)', color='white')
ax.set_title(f'30-year carbon target: {total_carbon/1000:.0f}k tonnes C', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 4: Method distribution
ax = axes[1, 0]
ax.set_facecolor('#111827')
method_areas = {m: 0 for m in methods}
for res in site_results:
    method_areas[res['method']] += res['area']
used_methods = {k: v for k, v in method_areas.items() if v > 0}
if used_methods:
    ax.pie(used_methods.values(), labels=used_methods.keys(),
           colors=[method_colors[methods.index(m)] for m in used_methods.keys()],
           autopct='%1.0f%%', textprops={'color': 'white', 'fontsize': 8}, startangle=90)
ax.set_title('Area by method', color='white', fontsize=11)

# Plot 5: Biodiversity scores
ax = axes[1, 1]
ax.set_facecolor('#111827')
biodiv_scores = [res['biodiv'] for res in site_results]
site_labels = [res['site'][:10] for res in site_results]
colors_bd = ['#22c55e' if b > 0.6 else '#f59e0b' if b > 0.3 else '#ef4444' for b in biodiv_scores]
ax.barh(range(len(site_results)), biodiv_scores, color=colors_bd, edgecolor='none')
ax.set_yticks(range(len(site_results)))
ax.set_yticklabels(site_labels, color='white', fontsize=7)
ax.set_xlabel('Biodiversity score', color='white')
ax.set_title('Expected biodiversity outcomes', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: Summary
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
co2_total = total_carbon * 3.67
rows = [
    ['Total area restored', f'{total_area:.0f} ha'],
    ['Total cost', f'₹{total_cost/100:.1f} crore'],
    ['Carbon at 30 years', f'{total_carbon:.0f} tonnes C'],
    ['CO₂ equivalent', f'{co2_total:.0f} tonnes CO₂'],
    ['Cost per tonne CO₂', f'₹{total_cost*100000/co2_total:.0f}'],
    ['Budget remaining', f'₹{remaining_budget/100:.1f} crore'],
    ['Mean biodiversity', f'{np.mean(biodiv_scores):.2f}'],
]
table = ax.table(cellText=rows, colLabels=['Metric', 'Value'], cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(9)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
ax.set_title('Plan summary', color='white', fontsize=11, pad=15)

plt.tight_layout()
plt.show()

print("=" * 60)
print("LANDSCAPE RESTORATION PLAN")
print("=" * 60)
for res in site_results:
    print(f"  {res['site']:<15} {res['method']:<15} {res['area']:>6.0f} ha  {res['carbon']:>8.0f} tC  ₹{res['cost']/100:>5.1f}Cr")
print(f"{'TOTAL':<31} {total_area:>6.0f} ha  {total_carbon:>8.0f} tC  ₹{total_cost/100:>5.1f}Cr")
print(f"\\nCO₂ offset: {co2_total:.0f} tonnes ({co2_total/1000:.0f}k tonnes)")
print(f"Equivalent to: ~{co2_total/5:.0f} people's lifetime emissions offset")`,
      challenge: 'Add a constraint: at least 100 ha must use the Miyawaki method (for biodiversity, not just carbon). How does this change the optimal allocation and the cost-effectiveness?',
      successHint: 'You have built a landscape-scale reforestation planner that integrates succession science, carbon accounting, biodiversity targets, and cost optimization. This is the exact tool needed to implement India\'s Green India Mission and contribute to global reforestation targets. The girl who grew a forest is now an architect of landscape-scale restoration.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Forest Ecologist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (ecology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for forest ecology computations. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
