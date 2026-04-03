import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function CuckooLevel3() {
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
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
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
      title: 'Brood parasitism — the evolutionary con game',
      concept: `The cuckoo is nature\'s master con artist. Instead of building a nest and raising its own young, it lays eggs in the nests of other bird species (hosts). The host raises the cuckoo chick as its own, often at the cost of its own offspring.

**The parasitism strategy:**
1. Female cuckoo watches a host species building a nest
2. When the host is away, the cuckoo sneaks in, removes one host egg, and lays her own (taking just 10 seconds)
3. The cuckoo egg mimics the host's eggs in color and pattern
4. The cuckoo chick hatches first (shorter incubation) and pushes host eggs/chicks out of the nest
5. The host raises the giant cuckoo chick, often 3x its own size

This is an **evolutionary arms race**: hosts evolve better egg discrimination (reject foreign eggs), and cuckoos evolve better egg mimicry. The Red Queen hypothesis applies — both sides must keep evolving just to maintain the status quo.

We can model this mathematically using **game theory**: the payoff matrix for cuckoo (mimic/don\'t mimic) vs host (accept/reject) determines the stable strategies. If rejection costs are high (accidentally rejecting own egg), hosts tolerate some parasitism. If mimicry costs are high, cuckoos specialize on fewer hosts.`,
      analogy: 'Brood parasitism is like a counterfeiting arms race. The cuckoo produces counterfeit "currency" (eggs). The host is the bank teller trying to detect fakes. As detection improves (UV light, watermarks), counterfeiting technology improves (better paper, better inks). Neither side can ever fully win — the arms race continues indefinitely, driving ever-more-sophisticated forgery and detection.',
      storyConnection: 'The story\'s cuckoo calls at dawn, but what it does not reveal is the darker side: the cuckoo is scouting nests. Its beautiful dawn call is partly territorial (warning other cuckoos) and partly reconnaissance — timing its egg-laying to coincide with the host\'s laying period. The dawn chorus masks a calculated strategy.',
      checkQuestion: 'If a host species evolves to reject ALL eggs that look even slightly different from its own, why would not this end the arms race permanently?',
      checkAnswer: 'Because rejection has costs: (1) the host might accidentally reject its own egg (recognition error), especially if egg appearance varies within the species, (2) rejection requires time and energy inspecting eggs, (3) if the host damages its own eggs while ejecting the parasite egg, the net cost may exceed raising the parasite. The arms race persists because perfect discrimination is biologically impossible — there is always a trade-off between rejection accuracy and recognition error cost.',
      codeIntro: 'Simulate the coevolutionary arms race between cuckoo egg mimicry and host egg rejection using evolutionary game theory.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Evolutionary arms race simulation
def coevolution_simulation(n_generations=200, host_pop=500, cuckoo_pop=100):
    """
    Simulate cuckoo-host coevolution.
    Traits: cuckoo mimicry quality (0-1), host discrimination threshold (0-1).
    """
    # Initialize traits
    cuckoo_mimicry = np.random.beta(2, 5, cuckoo_pop)  # starts low
    host_threshold = np.random.beta(5, 2, host_pop)     # starts high (accepts most)

    history = {'cuckoo_mean': [], 'host_mean': [], 'parasitism_rate': [],
               'rejection_rate': [], 'cuckoo_fitness': [], 'host_fitness': []}

    for gen in range(n_generations):
        # Each cuckoo attempts to parasitize a random host
        parasitism_attempts = np.random.choice(host_pop, cuckoo_pop)

        # Detection: host rejects if mimicry < threshold
        mimicry_quality = cuckoo_mimicry
        detection_threshold = host_threshold[parasitism_attempts]

        # Probability of acceptance: sigmoid function of mimicry - threshold
        diff = mimicry_quality - detection_threshold
        p_accept = 1 / (1 + np.exp(-10 * diff))  # steep sigmoid
        accepted = np.random.random(cuckoo_pop) < p_accept

        parasitism_rate = accepted.mean()
        rejection_rate = 1 - parasitism_rate

        # Fitness
        # Cuckoo fitness: proportional to successful parasitism
        cuckoo_fitness = accepted.astype(float)
        cuckoo_fitness += 0.1  # baseline survival

        # Host fitness
        host_fitness = np.ones(host_pop)
        parasitized = np.zeros(host_pop, dtype=bool)
        for i, h in enumerate(parasitism_attempts):
            if accepted[i]:
                parasitized[h] = True
        host_fitness[parasitized] *= 0.3  # parasitized hosts lose most offspring

        # Cost of rejection: occasionally reject own eggs
        false_rejection_rate = 0.05 * (1 - host_threshold)  # lower threshold = more false rejections
        host_fitness *= (1 - false_rejection_rate)

        # Record history
        history['cuckoo_mean'].append(cuckoo_mimicry.mean())
        history['host_mean'].append(host_threshold.mean())
        history['parasitism_rate'].append(parasitism_rate)
        history['rejection_rate'].append(rejection_rate)
        history['cuckoo_fitness'].append(cuckoo_fitness.mean())
        history['host_fitness'].append(host_fitness.mean())

        # Selection and reproduction (roulette wheel)
        # Cuckoo reproduction
        c_probs = cuckoo_fitness / cuckoo_fitness.sum()
        parents = np.random.choice(cuckoo_pop, cuckoo_pop, p=c_probs)
        cuckoo_mimicry = cuckoo_mimicry[parents] + np.random.normal(0, 0.02, cuckoo_pop)
        cuckoo_mimicry = np.clip(cuckoo_mimicry, 0, 1)

        # Host reproduction
        h_probs = host_fitness / host_fitness.sum()
        parents = np.random.choice(host_pop, host_pop, p=h_probs)
        host_threshold = host_threshold[parents] + np.random.normal(0, 0.02, host_pop)
        host_threshold = np.clip(host_threshold, 0, 1)

    return history

history = coevolution_simulation(300)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Trait coevolution
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(history['cuckoo_mean'], color='#ef4444', linewidth=2, label='Cuckoo mimicry')
ax.plot(history['host_mean'], color='#3b82f6', linewidth=2, label='Host discrimination')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Trait value', color='white')
ax.set_title('Coevolutionary arms race', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Parasitism rate
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(history['parasitism_rate'], color='#f59e0b', linewidth=1.5, alpha=0.7)
# Smoothed
window = 10
smooth = np.convolve(history['parasitism_rate'], np.ones(window)/window, mode='valid')
ax.plot(range(window-1, len(history['parasitism_rate'])), smooth, color='#f59e0b', linewidth=2.5)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Parasitism rate', color='white')
ax.set_title('Parasitism success over time', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Fitness dynamics
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(history['cuckoo_fitness'], color='#ef4444', linewidth=1.5, alpha=0.5, label='Cuckoo')
ax.plot(history['host_fitness'], color='#3b82f6', linewidth=1.5, alpha=0.5, label='Host')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean fitness', color='white')
ax.set_title('Fitness dynamics (Red Queen)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Phase portrait
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(history['cuckoo_mean'], history['host_mean'], color='#a855f7', linewidth=1, alpha=0.6)
ax.plot(history['cuckoo_mean'][0], history['host_mean'][0], 'o', color='#22c55e', markersize=10, label='Start')
ax.plot(history['cuckoo_mean'][-1], history['host_mean'][-1], 's', color='#ef4444', markersize=10, label='End')
ax.set_xlabel('Cuckoo mimicry', color='white')
ax.set_ylabel('Host discrimination', color='white')
ax.set_title('Coevolutionary trajectory', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Coevolutionary arms race results:")
print(f"  Starting: mimicry={history['cuckoo_mean'][0]:.3f}, discrimination={history['host_mean'][0]:.3f}")
print(f"  Ending:   mimicry={history['cuckoo_mean'][-1]:.3f}, discrimination={history['host_mean'][-1]:.3f}")
print(f"  Both traits escalated — the Red Queen effect.")
print(f"  Parasitism rate stabilized near {np.mean(history['parasitism_rate'][-50:]):.1%}")`,
      challenge: 'Add a second host species with a different initial discrimination threshold. The cuckoo must choose which host to parasitize each generation. Does the cuckoo specialize on the easier host, or spread its effort?',
      successHint: 'Coevolutionary arms races produce some of nature\'s most remarkable adaptations. The cuckoo\'s egg mimicry is so precise that spectrographic analysis of egg coloration is needed to distinguish cuckoo eggs from host eggs.',
    },
    {
      title: 'Egg mimicry and chick ejection — the evolutionary arms race in detail',
      concept: `The cuckoo egg must fool the host's visual system. This involves matching multiple properties:

- **Ground color**: background hue of the eggshell (blue, brown, white, speckled)
- **Spot pattern**: size, density, and distribution of pigment spots
- **Egg size**: too large and the host notices; too small and the chick is weak
- **UV reflectance**: many birds see ultraviolet; some hosts check UV patterns

Each female cuckoo belongs to a **gens** (genetic lineage) specialized on one host species. The mimicry gene is thought to be on the W chromosome (female-specific), allowing gens-specific mimicry to be maintained even when males mate across gens.

The cuckoo chick's behavior is equally remarkable:
- Hatches 1-2 days before host chicks (shorter incubation)
- At just hours old, instinctively pushes other eggs/chicks out of the nest
- Has a specialized hollow back for balancing eggs while pushing
- Produces begging calls that mimic an entire brood of host chicks (one cuckoo chick sounds like 4-8 host chicks)

We can quantify egg mimicry using **color space analysis**: map egg colors to a bird-vision color space (tetrahedral, since birds have 4 cone types vs our 3) and measure the distance between cuckoo and host eggs.`,
      analogy: 'Egg mimicry is like art forgery. A forger studies the original painting\'s color palette, brushwork, canvas texture, and aging patterns. A good forgery passes casual inspection but fails spectroscopic analysis. Similarly, cuckoo eggs pass the host\'s visual inspection but can be detected with spectrometry. Both forger and cuckoo are under selection pressure to improve — the better the detection technology, the better the forgery must become.',
      storyConnection: 'The cuckoo in the story calls at dawn — a beautiful, memorable sound. But behind that call is a sophisticated reproductive strategy involving egg forgery that would impress any counterfeiter. The dawn call might even be a distraction, drawing the host\'s attention away from the nest while the female cuckoo sneaks in.',
      checkQuestion: 'If cuckoo egg mimicry is so good, why do host species still exist? Why haven\'t cuckoos driven their hosts to extinction?',
      checkAnswer: 'Several reasons: (1) Cuckoos are much rarer than hosts — only a small fraction of nests are parasitized. (2) Parasitized hosts still survive and can re-nest. (3) The arms race maintains a dynamic equilibrium where parasitism rates are moderate (10-30% of nests). (4) If a host species declined too much, cuckoos would also decline (losing their host), reducing parasitism pressure and allowing the host to recover. This is a form of frequency-dependent selection that stabilizes the system.',
      codeIntro: 'Simulate egg color evolution: model the cuckoo\'s mimicry optimization in bird-vision color space and quantify detection probability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Bird-vision color model (simplified tetrahedral color space)
# 4 cone types: UV, S (blue), M (green), L (red)
def egg_to_bird_vision(rgb_uv):
    """Convert egg color (R, G, B, UV) to bird-perceived color space."""
    # Normalized cone responses
    total = max(rgb_uv.sum(), 1e-10)
    return rgb_uv / total

def color_distance(c1, c2):
    """Euclidean distance in bird-vision color space."""
    return np.sqrt(np.sum((c1 - c2) ** 2))

# Host species egg colors (R, G, B, UV normalized)
host_species = {
    'Reed warbler':    np.array([0.3, 0.5, 0.2, 0.15]),
    'Meadow pipit':    np.array([0.4, 0.35, 0.25, 0.1]),
    'Dunnock':         np.array([0.15, 0.25, 0.6, 0.2]),
    'Pied wagtail':    np.array([0.35, 0.35, 0.3, 0.12]),
}

# Cuckoo gens (specialized lineages) evolution
def evolve_mimicry(host_color, n_generations=100, pop_size=50):
    """Evolve cuckoo egg color to match a host species."""
    # Initial cuckoo eggs (random)
    population = np.random.dirichlet(np.ones(4), pop_size)
    host_norm = egg_to_bird_vision(host_color)

    history = {'mean_distance': [], 'best_distance': [], 'mean_color': []}

    for gen in range(n_generations):
        # Compute distances (fitness = inverse distance)
        distances = np.array([color_distance(egg_to_bird_vision(egg), host_norm) for egg in population])
        fitness = 1 / (distances + 0.01)

        history['mean_distance'].append(distances.mean())
        history['best_distance'].append(distances.min())
        history['mean_color'].append(population.mean(axis=0))

        # Selection
        probs = fitness / fitness.sum()
        parents = np.random.choice(pop_size, pop_size, p=probs)
        offspring = population[parents] + np.random.normal(0, 0.02, (pop_size, 4))
        offspring = np.clip(offspring, 0.01, None)
        offspring = offspring / offspring.sum(axis=1, keepdims=True)
        population = offspring

    return history, population

# Evolve mimicry for each host
all_histories = {}
final_pops = {}
for name, color in host_species.items():
    h, p = evolve_mimicry(color)
    all_histories[name] = h
    final_pops[name] = p

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']

# Mimicry convergence
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i, (name, hist) in enumerate(all_histories.items()):
    ax.plot(hist['mean_distance'], color=colors[i], linewidth=2, label=name)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Color distance from host', color='white')
ax.set_title('Mimicry evolution (distance = detectability)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Color comparison (final)
ax = axes[0, 1]
ax.set_facecolor('#111827')
x = np.arange(len(host_species))
w = 0.35
channels = ['Red', 'Green', 'Blue', 'UV']
for ci, ch in enumerate(channels):
    host_vals = [egg_to_bird_vision(c)[ci] for c in host_species.values()]
    cuckoo_vals = [egg_to_bird_vision(final_pops[name].mean(0))[ci] for name in host_species]
    offset = (ci - 1.5) * 0.08
    ax.scatter(x + offset - 0.15, host_vals, s=60, marker='o', color=f'C{ci}', alpha=0.7)
    ax.scatter(x + offset + 0.15, cuckoo_vals, s=60, marker='^', color=f'C{ci}', alpha=0.7)
ax.set_xticks(x)
ax.set_xticklabels(host_species.keys(), color='white', fontsize=8, rotation=15)
ax.set_ylabel('Cone response', color='white')
ax.set_title('Host (circles) vs cuckoo (triangles) egg colors', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Chick ejection simulation
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Simulate chick ejection behavior
days = np.arange(0, 16)
host_eggs = 4 * np.ones_like(days, dtype=float)
cuckoo_present = np.ones_like(days, dtype=float)
# Cuckoo hatches day 0, host eggs on day 1-2
for d in range(len(days)):
    if d == 0:
        cuckoo_present[d] = 1
    if d >= 1 and d <= 2:
        # Cuckoo ejects one egg per half-day
        host_eggs[d:] = max(host_eggs[d] - 1.5, 0)
host_eggs = np.clip(host_eggs, 0, 4)
host_chicks = np.zeros_like(days, dtype=float)
host_chicks[2:] = host_eggs[2:]  # remaining hatch day 2

ax.plot(days, host_eggs, 'o-', color='#3b82f6', linewidth=2, label='Host eggs')
ax.plot(days, host_chicks, 's-', color='#22c55e', linewidth=2, label='Host chicks surviving')
ax.fill_between(days, 0, cuckoo_present, alpha=0.2, color='#ef4444', label='Cuckoo chick')
ax.set_xlabel('Days after cuckoo hatches', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Chick ejection timeline', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Detection probability model
ax = axes[1, 1]
ax.set_facecolor('#111827')
distances = np.linspace(0, 0.5, 100)
# Host detection follows a sigmoid: closer = easier to detect, but with noise
for threshold, label, col in [(0.1, 'Expert host (discriminating)', '#22c55e'),
                                (0.2, 'Average host', '#f59e0b'),
                                (0.35, 'Naive host', '#ef4444')]:
    p_reject = 1 / (1 + np.exp(-(distances - threshold) * 20))
    ax.plot(distances, p_reject, color=col, linewidth=2, label=label)
ax.set_xlabel('Egg color distance (cuckoo vs host)', color='white')
ax.set_ylabel('Rejection probability', color='white')
ax.set_title('Host rejection as function of mimicry quality', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Egg mimicry evolution results:")
for name, hist in all_histories.items():
    print(f"  {name}: distance {hist['mean_distance'][0]:.3f} -> {hist['mean_distance'][-1]:.3f} ({100*(1-hist['mean_distance'][-1]/hist['mean_distance'][0]):.0f}% improvement)")`,
      challenge: 'Add host counter-evolution: as cuckoo mimicry improves, increase host discrimination (lower rejection threshold). Run for 500 generations and observe the escalating arms race. Does either side "win"?',
      successHint: 'The cuckoo-host arms race is one of the best-studied examples of coevolution. It demonstrates that evolution is not about reaching a final perfect state — it is an ongoing arms race where adaptation never stops.',
    },
    {
      title: 'Bird migration navigation — magnetic field, star compass, sun compass',
      concept: `The cuckoo migrates thousands of kilometers between breeding and wintering grounds. How does it navigate? Birds use at least three compass systems:

**1. Magnetic compass:**
- Birds sense Earth\'s magnetic field using magnetite crystals in the beak and/or cryptochrome proteins in the retina
- The magnetic field provides directional information (north/south) and inclination (angle of field lines, indicating latitude)
- This compass works in any weather, day or night

**2. Star compass:**
- Migratory birds learn the rotation center of the night sky (near Polaris in the Northern Hemisphere)
- Stars rotate around this point; the bird uses the rotation axis to determine geographic north
- Calibrated during development by observing stellar rotation

**3. Sun compass:**
- The sun's position combined with an internal clock gives directional information
- The bird knows the sun rises in the east, is south at noon (Northern Hemisphere), and sets in the west
- Requires accurate time sense to compensate for the sun's movement across the sky

These three systems are **redundant and cross-calibrated**: the magnetic compass calibrates the star compass, which calibrates the sun compass. This redundancy ensures navigation works across different conditions.`,
      analogy: 'A bird\'s navigation system is like having three separate GPS units, each using a different technology: one uses satellites (stars), one uses a magnetic sensor (magnetic compass), and one uses the sun\'s position. If one fails (cloudy night = no stars, magnetic anomaly = compass error), the others compensate. A human hiker with a paper map, magnetic compass, and sun compass would have the same redundancy.',
      storyConnection: 'The story\'s cuckoo calls at dawn, arriving after its long migration from Africa. It navigated thousands of kilometers using these three compasses — sensing the magnetic field, reading the stars, and tracking the sun. The dawn call announces not just a bird, but a navigation feat that would challenge any human pilot.',
      checkQuestion: 'Young cuckoos migrate to Africa WITHOUT their parents (adults leave earlier). How can they navigate a route they have never traveled?',
      checkAnswer: 'This is one of the most remarkable facts in biology. Young cuckoos have an innate (genetically encoded) migration program: a heading direction and approximate distance. The magnetic compass provides the heading, and an internal clock determines when to stop. This genetic program gets them to the general wintering area. They do NOT learn the route from parents. This was proven by displacement experiments: displaced young cuckoos flew the correct heading but from the wrong starting point, ending up in the wrong place. They follow instructions ("fly southwest for 3 weeks"), not a learned map.',
      codeIntro: 'Simulate bird migration using the three compass systems, including navigation errors, recalibration, and the effect of compass failure.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class MigrationNavigator:
    """Simulate bird migration with three compass systems."""

    def __init__(self, start=(52, 0), end=(0, 35), speed_km_day=200):
        self.start = np.array(start, dtype=float)  # lat, lon
        self.end = np.array(end, dtype=float)
        self.speed = speed_km_day
        self.km_per_deg_lat = 111.0
        self.km_per_deg_lon = 111.0 * np.cos(np.radians(30))

    def true_heading(self, pos):
        """Compute true heading from current position to destination."""
        diff = self.end - pos
        angle = np.degrees(np.arctan2(diff[1] * self.km_per_deg_lon,
                                       diff[0] * self.km_per_deg_lat))
        return angle % 360

    def magnetic_compass(self, pos, error_std=5):
        """Magnetic compass: true heading + magnetic declination + noise."""
        declination = 2 * np.sin(np.radians(pos[0]))  # simplified
        return self.true_heading(pos) + declination + np.random.normal(0, error_std)

    def star_compass(self, pos, error_std=3, cloud_prob=0.3):
        """Star compass: works at night, good accuracy, fails in clouds."""
        if np.random.random() < cloud_prob:
            return None  # cloudy, can\'t see stars
        return self.true_heading(pos) + np.random.normal(0, error_std)

    def sun_compass(self, pos, error_std=8, time_error=0.5):
        """Sun compass: works by day, requires accurate internal clock."""
        clock_drift = np.random.normal(0, time_error)  # hours
        heading_error = clock_drift * 15  # 15 degrees per hour of sun movement
        return self.true_heading(pos) + heading_error + np.random.normal(0, error_std)

    def integrated_heading(self, pos, compasses_active={'magnetic': True, 'star': True, 'sun': True}):
        """Combine available compass readings with weighted average."""
        readings = []
        weights = []

        if compasses_active.get('magnetic', True):
            readings.append(self.magnetic_compass(pos))
            weights.append(1.0)

        if compasses_active.get('star', True):
            star = self.star_compass(pos)
            if star is not None:
                readings.append(star)
                weights.append(2.0)  # stars are most accurate

        if compasses_active.get('sun', True):
            readings.append(self.sun_compass(pos))
            weights.append(0.8)

        if not readings:
            return self.true_heading(pos) + np.random.normal(0, 30)  # dead reckoning

        # Weighted circular mean
        weights = np.array(weights) / sum(weights)
        x = sum(w * np.cos(np.radians(r)) for w, r in zip(weights, readings))
        y = sum(w * np.sin(np.radians(r)) for w, r in zip(weights, readings))
        return np.degrees(np.arctan2(y, x)) % 360

    def simulate_migration(self, compasses_active=None, wind_effect=True):
        """Simulate complete migration."""
        if compasses_active is None:
            compasses_active = {'magnetic': True, 'star': True, 'sun': True}

        pos = self.start.copy()
        trajectory = [pos.copy()]
        headings = []

        for day in range(100):
            dist_to_end = np.sqrt(
                ((pos[0]-self.end[0])*self.km_per_deg_lat)**2 +
                ((pos[1]-self.end[1])*self.km_per_deg_lon)**2)

            if dist_to_end < 100:
                break

            heading = self.integrated_heading(pos, compasses_active)
            headings.append(heading)

            # Convert heading to position change
            dlat = self.speed * np.cos(np.radians(heading)) / self.km_per_deg_lat
            dlon = self.speed * np.sin(np.radians(heading)) / self.km_per_deg_lon

            # Wind effect
            if wind_effect:
                dlat += np.random.normal(0, 0.3)
                dlon += np.random.normal(0, 0.3)

            pos = pos + np.array([dlat, dlon])
            trajectory.append(pos.copy())

        return np.array(trajectory), headings

nav = MigrationNavigator(start=(52, 0), end=(0, 35))

# Simulate different compass scenarios
scenarios = {
    'All compasses': {'magnetic': True, 'star': True, 'sun': True},
    'Magnetic only': {'magnetic': True, 'star': False, 'sun': False},
    'Star only':     {'magnetic': False, 'star': True, 'sun': False},
    'Sun only':      {'magnetic': False, 'star': False, 'sun': True},
    'No compass':    {'magnetic': False, 'star': False, 'sun': False},
}
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Migration routes
ax = axes[0, 0]
ax.set_facecolor('#111827')
final_dists = {}
for (name, active), color in zip(scenarios.items(), colors):
    traj, _ = nav.simulate_migration(active)
    ax.plot(traj[:, 1], traj[:, 0], color=color, linewidth=1.5, alpha=0.8, label=name)
    final_dist = np.sqrt(((traj[-1,0]-nav.end[0])*111)**2 + ((traj[-1,1]-nav.end[1])*85)**2)
    final_dists[name] = final_dist
ax.plot(nav.start[1], nav.start[0], 'o', color='white', markersize=10, label='Start (UK)')
ax.plot(nav.end[1], nav.end[0], '*', color='#f59e0b', markersize=15, label='Destination (Africa)')
ax.set_xlabel('Longitude', color='white')
ax.set_ylabel('Latitude', color='white')
ax.set_title('Migration routes by compass type', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, loc='lower left')
ax.tick_params(colors='gray')

# Final distance from target
ax = axes[0, 1]
ax.set_facecolor('#111827')
names = list(final_dists.keys())
dists = list(final_dists.values())
bars = ax.barh(range(len(names)), dists, color=colors, edgecolor='none', height=0.6)
ax.set_yticks(range(len(names)))
ax.set_yticklabels(names, color='white', fontsize=9)
ax.set_xlabel('Final distance from target (km)', color='white')
ax.set_title('Navigation accuracy by compass type', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Monte Carlo: arrival accuracy
ax = axes[1, 0]
ax.set_facecolor('#111827')
for (name, active), color in zip(list(scenarios.items())[:3], colors[:3]):
    arrival_dists = []
    for _ in range(30):
        traj, _ = nav.simulate_migration(active)
        d = np.sqrt(((traj[-1,0]-nav.end[0])*111)**2 + ((traj[-1,1]-nav.end[1])*85)**2)
        arrival_dists.append(d)
    ax.hist(arrival_dists, bins=15, alpha=0.5, color=color, label=name, density=True)
ax.set_xlabel('Arrival distance from target (km)', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Arrival accuracy (30 migrations each)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Compass reliability over migration
ax = axes[1, 1]
ax.set_facecolor('#111827')
traj_full, headings = nav.simulate_migration({'magnetic':True,'star':True,'sun':True})
true_headings = [nav.true_heading(traj_full[i]) for i in range(len(headings))]
errors = np.array(headings) - np.array(true_headings)
errors = (errors + 180) % 360 - 180  # wrap to [-180, 180]
ax.plot(range(len(errors)), errors, 'o', color='#22c55e', markersize=3, alpha=0.6)
ax.axhline(0, color='gray', linestyle='--')
ax.fill_between(range(len(errors)), -10, 10, alpha=0.1, color='white', label='±10° acceptable')
ax.set_xlabel('Day of migration', color='white')
ax.set_ylabel('Heading error (degrees)', color='white')
ax.set_title('Navigation error over time (all compasses)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Migration navigation results:")
for name, d in final_dists.items():
    status = 'arrived' if d < 200 else f'{d:.0f} km off'
    print(f"  {name}: {status}")`,
      challenge: 'Simulate a young cuckoo with an innate but imprecise heading (e.g., "fly 210° for 45 days"). Displace it 500 km east before migration. Does it reach Africa? This tests whether the navigation is a vector program (heading + distance) or a map (knows its location).',
      successHint: 'Bird migration navigation is one of the most studied problems in animal behavior. The redundancy of three compass systems explains why birds can navigate across oceans, at night, in clouds, and over featureless landscapes.',
    },
    {
      title: 'Phenology and climate change — when seasons shift',
      concept: `**Phenology** is the timing of seasonal biological events: when birds migrate, when flowers bloom, when insects emerge. Climate change is disrupting these timings with cascading consequences.

The cuckoo's problem: its migration timing evolved to match the host's breeding season. If the host breeds earlier due to warmer springs, but the cuckoo arrives on the same date (triggered by day length in Africa, not European temperature), the cuckoo arrives too late — the host chicks have already hatched.

**Phenological mismatch** occurs when:
- Species A's timing cue (temperature) shifts with climate change
- Species B's timing cue (photoperiod) does not
- The interaction between A and B breaks down

Examples:
- Great tits breeding earlier but caterpillar peak shifting faster → chicks starving
- Pied flycatchers arriving same date but caterpillar peak 2 weeks earlier → population crash
- Pollinators and flowers becoming desynchronized → reduced seed production

The mathematical framework uses **degree-day models**: organisms accumulate thermal units (°C above a base temperature per day). When accumulated degree-days reach a threshold, the event triggers. Climate warming increases the accumulation rate, advancing the trigger date.`,
      analogy: 'Phenological mismatch is like two friends agreeing to meet at a restaurant: "Let\'s meet when the cherry blossoms open." If climate change makes cherries bloom two weeks earlier but your friend\'s phone still shows the old date, you arrive at an empty restaurant. The cuckoo\'s "appointment" with its host is set by African day length, but the host\'s "schedule" shifts with European temperature.',
      storyConnection: 'The story says the cuckoo calls "at dawn" — but which dawn? Climate change is shifting when "spring" happens. If the cuckoo arrives at its ancestral time but the host has already started breeding, the cuckoo\'s entire reproductive strategy fails. The story\'s dawn call might, in 50 years, arrive at an empty stage.',
      checkQuestion: 'A researcher finds that cuckoo arrival dates in Europe have advanced by 5 days over 30 years, but host breeding has advanced by 12 days. Is the cuckoo adapting fast enough?',
      checkAnswer: 'No. The cuckoo is adapting (5 days earlier) but not fast enough to keep up with the host (12 days earlier). The mismatch is growing at 7 days per 30 years, or about 2.3 days per decade. If this continues, the cuckoo will arrive a full clutch-cycle too late within 50 years. The cuckoo needs to either (1) evolve a faster response to warming cues, (2) switch to a host whose timing has shifted less, or (3) face population decline.',
      codeIntro: 'Model phenological mismatch: simulate degree-day accumulation, migration timing, and the growing gap between cuckoo arrival and host breeding under climate warming.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def degree_day_model(daily_temps, base_temp=5.0, threshold_dd=200):
    """Compute date when accumulated degree-days reach threshold."""
    dd_accum = np.cumsum(np.maximum(daily_temps - base_temp, 0))
    trigger_day = np.searchsorted(dd_accum, threshold_dd)
    return min(trigger_day, len(daily_temps) - 1)

# Simulate 60 years of climate data
n_years = 60
warming_rate = 0.03  # °C per year
days_per_year = 365

host_breeding_days = []
cuckoo_arrival_days = []
caterpillar_peak_days = []
mismatch = []

for year in range(n_years):
    # Daily temperatures: seasonal cycle + warming trend + noise
    day = np.arange(days_per_year)
    base_temp = -5 + 15 * np.sin(2 * np.pi * (day - 80) / 365)  # seasonal
    warming = warming_rate * year
    noise = np.random.normal(0, 3, days_per_year)
    temp = base_temp + warming + noise

    # Host breeding: triggered by degree-days (responds to local temperature)
    host_day = degree_day_model(temp, base_temp=5, threshold_dd=150)
    host_breeding_days.append(host_day)

    # Caterpillar peak: also degree-day driven, faster response
    cat_day = degree_day_model(temp, base_temp=8, threshold_dd=250)
    caterpillar_peak_days.append(cat_day)

    # Cuckoo arrival: driven by photoperiod (day length) in Africa
    # Only slowly adjusts — 0.5 day earlier per decade of warming
    base_arrival = 120  # day 120 = late April
    cuckoo_day = base_arrival - 0.05 * year + np.random.normal(0, 3)
    cuckoo_arrival_days.append(int(cuckoo_day))

    mismatch.append(cuckoo_day - host_day)

years = np.arange(n_years) + 1965

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Phenology trends
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.scatter(years, host_breeding_days, s=15, color='#3b82f6', alpha=0.5)
ax.scatter(years, cuckoo_arrival_days, s=15, color='#ef4444', alpha=0.5)
ax.scatter(years, caterpillar_peak_days, s=15, color='#22c55e', alpha=0.5)
# Trend lines
for data, color, label in [(host_breeding_days, '#3b82f6', 'Host breeding'),
                             (cuckoo_arrival_days, '#ef4444', 'Cuckoo arrival'),
                             (caterpillar_peak_days, '#22c55e', 'Caterpillar peak')]:
    z = np.polyfit(years, data, 1)
    ax.plot(years, np.polyval(z, years), color=color, linewidth=2, label=f'{label} ({z[0]:.2f} d/yr)')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Day of year', color='white')
ax.set_title('Phenological shifts over 60 years', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Mismatch trend
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.scatter(years, mismatch, s=15, color='#f59e0b', alpha=0.5)
z = np.polyfit(years, mismatch, 1)
ax.plot(years, np.polyval(z, years), color='#f59e0b', linewidth=2)
ax.axhline(0, color='gray', linestyle='--')
ax.fill_between(years, -10, 10, alpha=0.1, color='#22c55e', label='Acceptable window (±10 days)')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Cuckoo arrival - Host breeding (days)', color='white')
ax.set_title('Phenological mismatch (growing!)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Population consequence
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Parasitism success depends on timing match
parasitism_success = np.exp(-np.array(mismatch)**2 / (2 * 10**2))
cuckoo_pop = [100]
for i in range(1, n_years):
    growth = 0.1 * (parasitism_success[i] - 0.3)  # needs >30% success to grow
    cuckoo_pop.append(max(cuckoo_pop[-1] * (1 + growth), 1))
ax.plot(years, cuckoo_pop, color='#ef4444', linewidth=2, label='Cuckoo population')
ax.plot(years, parasitism_success * 100, color='#f59e0b', linewidth=1.5,
        alpha=0.6, label='Parasitism success (%)')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Population / Success rate', color='white')
ax.set_title('Cuckoo population decline from mismatch', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Temperature vs timing
ax = axes[1, 1]
ax.set_facecolor('#111827')
spring_temps = [np.mean(temp_data) for temp_data in
                [np.maximum(-5+15*np.sin(2*np.pi*(np.arange(365)-80)/365)+warming_rate*y,0)[60:150]
                 for y in range(n_years)]]
ax.scatter(spring_temps, host_breeding_days, s=20, color='#3b82f6', alpha=0.6, label='Host breeding')
ax.scatter(spring_temps, cuckoo_arrival_days, s=20, color='#ef4444', alpha=0.6, label='Cuckoo arrival')
ax.set_xlabel('Mean spring temperature (°C)', color='white')
ax.set_ylabel('Day of year', color='white')
ax.set_title('Temperature sensitivity: host responds, cuckoo doesn\'t', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Phenological mismatch analysis:")
print(f"  Host breeding advance:  {np.polyfit(years, host_breeding_days, 1)[0]:.2f} days/year")
print(f"  Cuckoo arrival advance: {np.polyfit(years, cuckoo_arrival_days, 1)[0]:.2f} days/year")
print(f"  Mismatch growth rate:   {z[0]:.2f} days/year")
print(f"  Current mismatch:       {mismatch[-1]:.0f} days")
print(f"  Cuckoo population change: {100*(cuckoo_pop[-1]/cuckoo_pop[0]-1):.0f}%")`,
      challenge: 'Model an adaptive scenario: the cuckoo evolves to respond partly to temperature (not just photoperiod). Give it 0.02 days/year of additional advancement. Is this enough to prevent population decline? How much adaptation rate would be needed?',
      successHint: 'Phenological mismatch is one of the most significant climate change impacts on biodiversity. Species that cannot adapt their timing fast enough face population crashes — not from direct warming, but from broken ecological relationships.',
    },
    {
      title: 'Dawn chorus timing — why birds sing at specific times',
      concept: `The dawn chorus — the burst of birdsong starting before sunrise — is one of nature\'s most reliable phenomena. But the timing is not random; it follows precise rules:

**Factors determining when a species starts singing:**

1. **Light level**: each species has a threshold light intensity. Species with larger eyes (adapted to low light) start singing earlier. The robin starts 40 minutes before sunrise; the great tit starts 10 minutes before.

2. **Foraging ecology**: species that forage in dim light (insectivores catching dawn-active insects) can afford to sing early because their food is already available. Seed eaters need more light to find food, so they start later.

3. **Eye size**: the single best predictor of dawn chorus position. Larger eyes capture more photons → can see at lower light → start singing earlier.

4. **Territorial pressure**: species in highly competitive territories start earlier to establish boundaries before competitors wake.

5. **Female preference**: females may prefer males who can start singing earliest (indicating good condition — well-fed enough to "waste" time singing in darkness).

The **singing order** is remarkably consistent day after day and correlates strongly with eye size. This ordering is so reliable that experienced birders can tell the time by which species is currently singing.`,
      analogy: 'The dawn chorus is like a radio schedule: different shows (species) come on at different times, and the schedule is consistent every day. The first shows are the low-frequency programs (owls, nightjars) that work in "low signal" (dim light). As signal strength increases (brighter), more shows come online. The full chorus at sunrise is like the morning rush hour of programming.',
      storyConnection: 'The story is titled "When the Cuckoo Calls at Dawn." That timing is not poetic license — the cuckoo has a specific position in the dawn chorus, determined by its eye size and foraging ecology. It calls after the robin but before the sparrow, in a time slot that evolution has assigned it over thousands of generations.',
      checkQuestion: 'If you artificially illuminated a forest at night (streetlights), what would happen to the dawn chorus?',
      checkAnswer: 'Light pollution would cause species to start singing earlier because their light threshold is reached sooner. Studies confirm this: birds near streetlights start singing up to 90 minutes earlier than birds in dark forests. This has cascading effects: sleep disruption, earlier breeding, energy waste from extended singing, and disrupted dawn chorus timing that may interfere with territorial negotiations. The dawn chorus timing system, perfected over millions of years, is being scrambled by artificial light.',
      codeIntro: 'Model the dawn chorus: simulate light levels, eye sizes, and singing onset times for multiple species.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Dawn light model
def dawn_light(minutes_from_sunrise, clear_sky=True):
    """Light intensity (lux) as function of time relative to sunrise."""
    if clear_sky:
        return 10 ** (minutes_from_sunrise / 30 + 1)  # log increase
    else:
        return 10 ** (minutes_from_sunrise / 40 + 0.5)  # slower in clouds

# Bird species with dawn chorus characteristics
species = [
    {'name': 'Blackbird',      'eye_mm': 11.5, 'threshold_lux': 0.5, 'freq_Hz': 2500, 'song_len': 3},
    {'name': 'Robin',          'eye_mm': 10.8, 'threshold_lux': 0.8, 'freq_Hz': 4500, 'song_len': 4},
    {'name': 'Song thrush',    'eye_mm': 10.2, 'threshold_lux': 1.5, 'freq_Hz': 3000, 'song_len': 2.5},
    {'name': 'Cuckoo',         'eye_mm': 9.5,  'threshold_lux': 3.0, 'freq_Hz': 700,  'song_len': 1},
    {'name': 'Wren',           'eye_mm': 7.5,  'threshold_lux': 5.0, 'freq_Hz': 5000, 'song_len': 5},
    {'name': 'Great tit',      'eye_mm': 7.0,  'threshold_lux': 8.0, 'freq_Hz': 4000, 'song_len': 1.5},
    {'name': 'Chaffinch',      'eye_mm': 6.5,  'threshold_lux': 12.0,'freq_Hz': 3500, 'song_len': 2},
    {'name': 'House sparrow',  'eye_mm': 5.5,  'threshold_lux': 25.0,'freq_Hz': 3000, 'song_len': 1},
]

# Compute singing onset time for each species
minutes = np.arange(-60, 30, 0.5)  # -60 to +30 minutes from sunrise
lux = np.array([dawn_light(m) for m in minutes])

onset_times = {}
for sp in species:
    idx = np.searchsorted(lux, sp['threshold_lux'])
    onset_times[sp['name']] = minutes[min(idx, len(minutes)-1)]

# Sort by onset time
species_sorted = sorted(species, key=lambda s: onset_times[s['name']])
colors = plt.cm.viridis(np.linspace(0.2, 0.9, len(species)))

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Light curve and singing onsets
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.semilogy(minutes, lux, color='#f59e0b', linewidth=2, label='Light level')
for i, sp in enumerate(species_sorted):
    onset = onset_times[sp['name']]
    ax.axvline(onset, color=colors[i], linestyle='--', alpha=0.6, linewidth=1)
    ax.plot(onset, sp['threshold_lux'], 'o', color=colors[i], markersize=8)
    ax.annotate(sp['name'], (onset, sp['threshold_lux']),
                textcoords="offset points", xytext=(5, 5),
                fontsize=7, color='white', rotation=30)
ax.axvline(0, color='white', linestyle='-', linewidth=2, alpha=0.3, label='Sunrise')
ax.set_xlabel('Minutes from sunrise', color='white')
ax.set_ylabel('Light intensity (lux)', color='white')
ax.set_title('Dawn light curve and species onset thresholds', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Eye size vs onset time
ax = axes[0, 1]
ax.set_facecolor('#111827')
eyes = [sp['eye_mm'] for sp in species]
onsets = [onset_times[sp['name']] for sp in species]
ax.scatter(eyes, onsets, s=80, c=[sp['threshold_lux'] for sp in species],
           cmap='YlOrRd_r', edgecolors='white', linewidth=1)
for sp in species:
    ax.annotate(sp['name'], (sp['eye_mm'], onset_times[sp['name']]),
                textcoords="offset points", xytext=(5, 3), fontsize=7, color='white')
# Regression
z = np.polyfit(eyes, onsets, 1)
ax.plot([5, 12], np.polyval(z, [5, 12]), '--', color='#ef4444', linewidth=2,
        label=f'r={np.corrcoef(eyes, onsets)[0,1]:.2f}')
ax.set_xlabel('Eye diameter (mm)', color='white')
ax.set_ylabel('Onset (min from sunrise)', color='white')
ax.set_title('Eye size predicts dawn chorus position', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Chorus timeline
ax = axes[1, 0]
ax.set_facecolor('#111827')
for i, sp in enumerate(species_sorted):
    onset = onset_times[sp['name']]
    ax.barh(i, sp['song_len'] * 5, left=onset, color=colors[i],
            edgecolor='none', height=0.7, alpha=0.8)
    ax.text(onset - 1, i, f"{onset:.0f}'", ha='right', va='center',
            color='white', fontsize=8)
ax.set_yticks(range(len(species_sorted)))
ax.set_yticklabels([sp['name'] for sp in species_sorted], color='white', fontsize=9)
ax.axvline(0, color='white', linestyle='-', linewidth=2, alpha=0.3)
ax.set_xlabel('Minutes from sunrise', color='white')
ax.set_title('Dawn chorus timeline', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Light pollution effect
ax = axes[1, 1]
ax.set_facecolor('#111827')
light_pollution_levels = [0, 5, 20, 50]  # added background lux
for lp, color in zip(light_pollution_levels, ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']):
    lux_polluted = lux + lp
    advance = []
    for sp in species:
        new_idx = np.searchsorted(lux_polluted, sp['threshold_lux'])
        new_onset = minutes[min(new_idx, len(minutes)-1)]
        advance.append(onset_times[sp['name']] - new_onset)
    ax.plot([sp['name'][:6] for sp in species_sorted],
            [advance[species.index(sp)] for sp in species_sorted],
            'o-', color=color, linewidth=1.5, label=f'+{lp} lux')
ax.set_ylabel('Advance (minutes earlier)', color='white')
ax.set_title('Dawn chorus advance from light pollution', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray', labelsize=7)
plt.setp(ax.get_xticklabels(), rotation=30, ha='right')

plt.tight_layout()
plt.show()

print("Dawn chorus order (earliest to latest):")
for i, sp in enumerate(species_sorted):
    print(f"  {i+1}. {sp['name']}: {onset_times[sp['name']]:.0f} min (eye: {sp['eye_mm']} mm, threshold: {sp['threshold_lux']} lux)")
print(f"\\nCorrelation (eye size vs onset): r = {np.corrcoef(eyes, onsets)[0,1]:.3f}")`,
      challenge: 'Model seasonal variation: in June (long days), dawn starts at 4:30 AM; in March it starts at 6:30 AM. How does the absolute timing of each species shift? Does the RELATIVE order stay the same?',
      successHint: 'The dawn chorus demonstrates how a simple physical variable (light level) combined with an evolved trait (eye size) creates a highly structured, predictable ecological pattern. Understanding this helps predict how light pollution and climate change will disrupt bird communities.',
    },
    {
      title: 'Phenology monitoring — tracking seasonal change with data',
      concept: `Phenology monitoring is one of the most valuable long-term datasets in ecology. By recording when migratory birds arrive, when trees leaf out, and when insects emerge, we can detect climate change impacts decades before temperature records show clear trends.

**Key monitoring methods:**

1. **First arrival date (FAD)**: when the first individual of a migratory species is detected each year. Simple but noisy — depends on observer effort.
2. **Mean arrival date (MAD)**: average arrival date across multiple observers. More robust but requires standardized effort.
3. **Phenological networks**: networks of volunteers recording the same events at many locations (e.g., the UK Phenological Network since 1736).
4. **Satellite phenology**: remote sensing tracks "green-up" dates from NDVI (vegetation index) across entire continents.
5. **Acoustic monitoring**: automated recording units detect when species start calling — the same bioacoustic monitoring used for frogs.

**Statistical analysis:**
- **Linear trend**: regression of event date vs year. The slope gives days-per-decade advance.
- **Breakpoint analysis**: detect when the trend changes (e.g., acceleration of advance after 1980).
- **Correlation with drivers**: relate phenological shifts to temperature, precipitation, NAO index.

The cuckoo is a **flagship species** for phenological monitoring because its call is unmistakable and its timing is culturally significant ("hearing the first cuckoo of spring" has been reported in British newspapers since the 1700s).`,
      analogy: 'Phenological monitoring is like keeping a diary of when seasonal events happen. If you recorded when the cherry blossoms open every year for 50 years, you would notice them blooming earlier — a personal climate change dataset. Japan has records of cherry blossom dates going back 1,200 years. The UK has records of cuckoo arrival going back to 1736. These are among the longest ecological datasets on Earth.',
      storyConnection: 'The story\'s cuckoo calling at dawn is a phenological event — the arrival of a migratory species. If we recorded when the cuckoo first calls each year in Assam, after 30 years we would have a climate change dataset showing how tropical phenology is shifting. The story freezes one moment; monitoring reveals the trajectory.',
      checkQuestion: 'A 50-year record shows the cuckoo arriving 8 days earlier. Is this definitely due to climate change?',
      checkAnswer: 'Not necessarily. Alternative explanations: (1) observer bias — more people watching earlier in the season, detecting earlier arrivals that always occurred, (2) land use change — deforestation at stopover sites forcing faster migration, (3) population decline — fewer birds means the first arrival is a statistical outlier. You need to correlate the advance with temperature data, control for observer effort, and rule out demographic changes. The 8-day advance is suggestive but not conclusive without this analysis.',
      codeIntro: 'Build a phenological analysis pipeline: generate long-term arrival data, fit trends, detect breakpoints, and correlate with temperature.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate 80 years of phenological + climate data (1945-2024)
n_years = 80
years = np.arange(1945, 1945 + n_years)

# Temperature trend (0.02°C/year overall, accelerating after 1980)
spring_temp = 8.0 + np.where(years < 1980, 0.01 * (years - 1945),
                               0.01 * 35 + 0.035 * (years - 1980))
spring_temp += np.random.normal(0, 0.8, n_years)

# Cuckoo arrival (correlated with temperature but with lag and noise)
cuckoo_arrival = 120 - 1.5 * (spring_temp - 8) + np.random.normal(0, 5, n_years)

# Host breeding (more responsive to temperature)
host_breeding = 100 - 2.5 * (spring_temp - 8) + np.random.normal(0, 3, n_years)

# Oak leafing date
oak_leaf = 110 - 3.0 * (spring_temp - 8) + np.random.normal(0, 4, n_years)

# Caterpillar peak
caterpillar = 130 - 2.8 * (spring_temp - 8) + np.random.normal(0, 3, n_years)

# ---- Statistical analysis ----
def linear_trend(years, data):
    z = np.polyfit(years, data, 1)
    return z[0], z[1], np.polyval(z, years)

def breakpoint_analysis(years, data, candidates=None):
    """Find best breakpoint in time series."""
    if candidates is None:
        candidates = years[10:-10]
    best_r2, best_bp = 0, years[len(years)//2]
    for bp in candidates:
        mask1 = years <= bp
        mask2 = years > bp
        if mask1.sum() < 5 or mask2.sum() < 5:
            continue
        z1 = np.polyfit(years[mask1], data[mask1], 1)
        z2 = np.polyfit(years[mask2], data[mask2], 1)
        pred = np.concatenate([np.polyval(z1, years[mask1]),
                                np.polyval(z2, years[mask2])])
        ss_res = np.sum((data - pred)**2)
        ss_tot = np.sum((data - data.mean())**2)
        r2 = 1 - ss_res / ss_tot
        if r2 > best_r2:
            best_r2, best_bp = r2, bp
    return best_bp, best_r2

# Compute trends
cuckoo_slope, _, cuckoo_trend = linear_trend(years, cuckoo_arrival)
host_slope, _, host_trend = linear_trend(years, host_breeding)
bp, bp_r2 = breakpoint_analysis(years, cuckoo_arrival)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Multi-species phenology
ax = axes[0, 0]
ax.set_facecolor('#111827')
for data, color, label in [(host_breeding, '#3b82f6', 'Host breeding'),
                             (oak_leaf, '#22c55e', 'Oak leafing'),
                             (cuckoo_arrival, '#ef4444', 'Cuckoo arrival'),
                             (caterpillar, '#f59e0b', 'Caterpillar peak')]:
    ax.scatter(years, data, s=10, color=color, alpha=0.4)
    slope, _, trend = linear_trend(years, data)
    ax.plot(years, trend, color=color, linewidth=2, label=f'{label} ({slope:.2f} d/yr)')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Day of year', color='white')
ax.set_title('Multi-species phenological trends', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Temperature correlation
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.scatter(spring_temp, cuckoo_arrival, s=25, color='#ef4444', alpha=0.6, label='Cuckoo')
ax.scatter(spring_temp, host_breeding, s=25, color='#3b82f6', alpha=0.6, label='Host')
for data, color in [(cuckoo_arrival, '#ef4444'), (host_breeding, '#3b82f6')]:
    z = np.polyfit(spring_temp, data, 1)
    t_range = np.linspace(spring_temp.min(), spring_temp.max(), 50)
    ax.plot(t_range, np.polyval(z, t_range), color=color, linewidth=2)
ax.set_xlabel('Spring temperature (°C)', color='white')
ax.set_ylabel('Day of year', color='white')
ax.set_title('Temperature sensitivity', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Breakpoint analysis
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.scatter(years, cuckoo_arrival, s=15, color='#ef4444', alpha=0.5)
mask1 = years <= bp; mask2 = years > bp
z1 = np.polyfit(years[mask1], cuckoo_arrival[mask1], 1)
z2 = np.polyfit(years[mask2], cuckoo_arrival[mask2], 1)
ax.plot(years[mask1], np.polyval(z1, years[mask1]), color='#22c55e', linewidth=2,
        label=f'Before {bp}: {z1[0]:.2f} d/yr')
ax.plot(years[mask2], np.polyval(z2, years[mask2]), color='#f59e0b', linewidth=2,
        label=f'After {bp}: {z2[0]:.2f} d/yr')
ax.axvline(bp, color='white', linestyle='--', linewidth=2, alpha=0.5)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Cuckoo arrival (day of year)', color='white')
ax.set_title(f'Breakpoint analysis: acceleration at {bp}', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Mismatch trend
ax = axes[1, 1]
ax.set_facecolor('#111827')
mismatch = cuckoo_arrival - host_breeding
ax.scatter(years, mismatch, s=15, color='#a855f7', alpha=0.5)
slope, _, trend = linear_trend(years, mismatch)
ax.plot(years, trend, color='#a855f7', linewidth=2, label=f'Trend: {slope:.2f} d/yr')
ax.axhline(0, color='gray', linestyle='--')
ax.fill_between(years, -5, 5, alpha=0.1, color='#22c55e')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Mismatch (days)', color='white')
ax.set_title('Cuckoo-host timing mismatch', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

r_temp_cuckoo = np.corrcoef(spring_temp, cuckoo_arrival)[0, 1]
r_temp_host = np.corrcoef(spring_temp, host_breeding)[0, 1]
print("Phenological monitoring analysis (80-year dataset):")
print(f"  Cuckoo advance: {cuckoo_slope:.2f} days/year = {cuckoo_slope*10:.1f} days/decade")
print(f"  Host advance:   {host_slope:.2f} days/year = {host_slope*10:.1f} days/decade")
print(f"  Mismatch rate:  {slope:.2f} days/year")
print(f"  Breakpoint:     {bp} (advance accelerated)")
print(f"  Temperature correlation: cuckoo r={r_temp_cuckoo:.3f}, host r={r_temp_host:.3f}")
print(f"  Host is {abs(r_temp_host/r_temp_cuckoo):.1f}x more temperature-sensitive than cuckoo")`,
      challenge: 'Add a "citizen science noise" component: simulate 20 observers with different detection probabilities and biases. Some report first sighting (biased early), others report peak abundance (more reliable). How does observer heterogeneity affect the trend estimate?',
      successHint: 'Long-term phenological datasets are among ecology\'s most precious resources. The UK\'s cuckoo arrival records, dating to 1736, have documented nearly 300 years of seasonal change. Your analysis tools can reveal patterns in these irreplaceable time series.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Ornithology & Evolutionary Biology
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (bird biology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for evolutionary and ecological modeling. Click to start.</p>
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
