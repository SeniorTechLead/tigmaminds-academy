import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function HornbillLevel3() {
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
      title: 'Aerodynamics of hornbill flight — lift, drag, and wing loading',
      concept: `Hornbills are among the largest flying birds in Asian tropical forests, yet their flight mechanics are remarkably efficient. Understanding how they stay aloft requires three core aerodynamic quantities: **lift**, **drag**, and **wing loading**.

Lift is the upward force generated as air flows faster over the curved upper surface of a wing than beneath it, creating a pressure difference (Bernoulli's principle). Drag is the resistive force opposing forward motion — it comes in two flavors: **parasitic drag** (friction and form drag from the bird's body) and **induced drag** (a byproduct of generating lift, caused by wingtip vortices).

**Wing loading** is the bird's weight divided by its total wing area (W/A, in N/m²). A low wing loading means the bird can fly slowly and maneuver tightly — ideal for navigating dense forest canopy. Great hornbills have wing loadings around 30-40 N/m² compared to 150+ N/m² for a swift. This explains their distinctive slow, powerful wingbeats and their ability to brake and land on narrow branches. The trade-off is speed: low wing loading means more drag at high velocities.`,
      analogy: 'Wing loading is like the pressure your shoes put on the ground. Snowshoes spread your weight over a large area (low loading), so you float on soft snow. Stilettos concentrate weight on a tiny point (high loading), sinking in. Hornbills are the snowshoes of the bird world — wide wings, slow and steady, perfect for the dense forest floor of the canopy.',
      storyConnection: 'The hornbill with its magnificent crown soars through the forest canopy not by brute force but by aerodynamic design. Its broad wings and slow wingbeat frequency let it navigate between dense trees where faster, higher-loaded birds would crash. The crown itself adds weight, making efficient wing design even more critical.',
      checkQuestion: 'If a hornbill gains weight by 20% (say, from eating a large meal of figs), but wing area stays the same, what happens to its wing loading and minimum flight speed?',
      checkAnswer: 'Wing loading increases by 20% (since W/A goes up proportionally). Minimum flight speed scales as the square root of wing loading, so it increases by about sqrt(1.2) = ~10%. The bird must flap harder or faster to generate the extra lift, which increases metabolic cost. This is why hornbills often rest after large meals.',
      codeIntro: 'Model hornbill flight by computing lift, drag, and wing loading across a range of velocities, and compare with other bird species.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Bird species parameters ---
birds = {
    'Great Hornbill': {'mass': 3.0, 'wing_area': 0.25, 'wingspan': 1.5, 'Cd_body': 0.35},
    'Wreathed Hornbill': {'mass': 2.2, 'wing_area': 0.20, 'wingspan': 1.3, 'Cd_body': 0.33},
    'Peregrine Falcon': {'mass': 1.0, 'wing_area': 0.065, 'wingspan': 0.95, 'Cd_body': 0.15},
    'Common Swift': {'mass': 0.04, 'wing_area': 0.015, 'wingspan': 0.42, 'Cd_body': 0.12},
}

g = 9.81  # gravity (m/s^2)
rho = 1.225  # air density at sea level (kg/m^3)

velocities = np.linspace(3, 25, 200)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

# --- Wing loading comparison ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
names = list(birds.keys())
wl = [birds[b]['mass'] * g / birds[b]['wing_area'] for b in names]
bars = ax.barh(names, wl, color=colors)
ax.set_xlabel('Wing Loading (N/m²)', color='white')
ax.set_title('Wing Loading Comparison', color='white')
for bar, val in zip(bars, wl):
    ax.text(bar.get_width() + 2, bar.get_y() + bar.get_height()/2, f'{val:.0f}', va='center', color='white', fontsize=9)
ax.tick_params(colors='gray')

# --- Lift required vs velocity ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
for i, (name, params) in enumerate(birds.items()):
    W = params['mass'] * g
    # Lift coefficient needed: L = 0.5 * rho * v^2 * S * Cl => Cl = W / (0.5 * rho * v^2 * S)
    Cl_needed = W / (0.5 * rho * velocities**2 * params['wing_area'])
    ax.plot(velocities, Cl_needed, color=colors[i], linewidth=2, label=name)
ax.axhline(y=1.5, color='white', linestyle='--', alpha=0.5, label='Max Cl ~ 1.5')
ax.set_xlabel('Velocity (m/s)', color='white')
ax.set_ylabel('Required Lift Coefficient', color='white')
ax.set_title('Cl Needed to Stay Aloft', color='white')
ax.set_ylim(0, 5)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Total drag vs velocity for hornbill ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
params = birds['Great Hornbill']
W = params['mass'] * g
S = params['wing_area']
b = params['wingspan']
AR = b**2 / S  # aspect ratio
e = 0.85  # Oswald efficiency
Cd0 = params['Cd_body'] * 0.01  # zero-lift drag coefficient (body area / wing area scaled)

# Parasitic drag
D_parasitic = 0.5 * rho * velocities**2 * S * Cd0
# Induced drag: Di = L^2 / (0.5 * rho * v^2 * pi * b^2 * e) = W^2 / (0.5 * rho * v^2 * pi * b^2 * e)
D_induced = W**2 / (0.5 * rho * velocities**2 * np.pi * b**2 * e)
D_total = D_parasitic + D_induced

ax.plot(velocities, D_parasitic, color='#f59e0b', linewidth=2, label='Parasitic drag')
ax.plot(velocities, D_induced, color='#3b82f6', linewidth=2, label='Induced drag')
ax.plot(velocities, D_total, color='#ef4444', linewidth=2, label='Total drag')
v_min_drag = velocities[np.argmin(D_total)]
ax.axvline(x=v_min_drag, color='white', linestyle=':', alpha=0.5)
ax.set_xlabel('Velocity (m/s)', color='white')
ax.set_ylabel('Drag Force (N)', color='white')
ax.set_title(f'Great Hornbill Drag Curve (min drag at {v_min_drag:.1f} m/s)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Power required for level flight ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
for i, (name, params) in enumerate(birds.items()):
    W = params['mass'] * g
    S = params['wing_area']
    b_span = params['wingspan']
    AR = b_span**2 / S
    Cd0_b = params['Cd_body'] * 0.01
    D_p = 0.5 * rho * velocities**2 * S * Cd0_b
    D_i = W**2 / (0.5 * rho * velocities**2 * np.pi * b_span**2 * 0.85)
    power = (D_p + D_i) * velocities
    ax.plot(velocities, power, color=colors[i], linewidth=2, label=name)
ax.set_xlabel('Velocity (m/s)', color='white')
ax.set_ylabel('Power Required (W)', color='white')
ax.set_title('Power for Level Flight', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Aerodynamic Analysis Results:")
print(f"{'Bird':<22} {'Mass(kg)':>8} {'Wing Area(m²)':>14} {'Wing Loading(N/m²)':>18} {'Aspect Ratio':>13}")
print("-" * 77)
for name, p in birds.items():
    wl_val = p['mass'] * g / p['wing_area']
    ar = p['wingspan']**2 / p['wing_area']
    print(f"{name:<22} {p['mass']:>8.2f} {p['wing_area']:>14.3f} {wl_val:>18.1f} {ar:>13.1f}")
print()
print(f"Great Hornbill minimum-drag speed: {v_min_drag:.1f} m/s ({v_min_drag*3.6:.0f} km/h)")
print("This is the optimal cruising speed for long-distance forest travel.")`,
      challenge: 'Add a calculation for glide ratio (L/D ratio) at each velocity and find the best glide speed for the Great Hornbill. Compare it with the minimum-drag speed.',
      successHint: 'Wing loading and aspect ratio together determine a bird\'s flight envelope. Hornbills optimize for slow, maneuverable flight in dense canopy — a fundamentally different strategy from falcons or swifts that optimize for speed in open air.',
    },
    {
      title: 'Casque resonance — the physics of hornbill calls',
      concept: `The hornbill's casque (the bony structure atop its bill) is not merely decorative. In many species, it functions as a **resonance chamber** that amplifies and modifies vocalizations. Understanding this requires the physics of acoustic resonance.

A resonance chamber amplifies specific frequencies — those whose wavelengths "fit" the chamber dimensions. The fundamental resonant frequency of a hollow tube closed at one end is f = v/(4L), where v is the speed of sound (~343 m/s in air) and L is the tube length. Harmonics occur at odd multiples: 3f, 5f, 7f.

The Great Hornbill's casque is roughly 15-20 cm long internally, predicting a fundamental resonant frequency of 430-570 Hz — right in the range of their characteristic booming calls. The casque acts like a natural megaphone, selectively amplifying frequencies near these resonances while attenuating others. This gives each species (and potentially each individual) a distinctive vocal signature.

**Q-factor** measures how "sharp" the resonance is. A high-Q resonator amplifies a narrow band strongly (like a wine glass at its resonant frequency). A low-Q resonator provides broad, mild amplification. Hornbill casques appear to have moderate Q-factors, producing rich harmonic calls rather than pure tones.`,
      analogy: 'The casque works like a trombone slide. A trombone player changes the tube length to change the pitch. A longer tube (slide extended) produces lower notes. Similarly, hornbill species with longer casques produce lower-frequency calls. The casque is a built-in brass instrument that evolution has tuned over millions of years.',
      storyConnection: 'The hornbill\'s crown is described as majestic and distinctive in the story. That crown — the casque — is literally the bird\'s voice box amplifier. When the hornbill calls across the forest canopy, it is the casque that gives the call its booming, far-carrying quality. The crown is not just beautiful; it is functional acoustic engineering.',
      checkQuestion: 'If a hornbill species evolved a casque that was exactly twice as long as another species, how would their fundamental call frequencies compare?',
      checkAnswer: 'The fundamental frequency is inversely proportional to length (f = v/4L). Doubling the length halves the frequency. If species A has a 10 cm casque (fundamental ~858 Hz) and species B has a 20 cm casque (fundamental ~429 Hz), species B calls at roughly one octave lower. This prediction matches observations: larger hornbill species with bigger casques do produce lower-pitched calls.',
      codeIntro: 'Simulate casque resonance for different hornbill species and visualize how tube length affects the frequency response.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Casque resonance physics ---
v_sound = 343.0  # speed of sound in air (m/s)

# Hornbill species with approximate casque internal lengths
species = {
    'Great Hornbill': {'casque_length': 0.18, 'color': '#22c55e'},
    'Rhinoceros Hornbill': {'casque_length': 0.22, 'color': '#3b82f6'},
    'Wreathed Hornbill': {'casque_length': 0.12, 'color': '#f59e0b'},
    'Oriental Pied Hornbill': {'casque_length': 0.08, 'color': '#ef4444'},
    'Rufous-necked Hornbill': {'casque_length': 0.14, 'color': '#a855f7'},
}

def resonant_frequencies(length, n_harmonics=6):
    """Closed-tube resonance: only odd harmonics."""
    f0 = v_sound / (4 * length)
    return np.array([(2*k+1) * f0 for k in range(n_harmonics)])

def frequency_response(freqs, resonances, Q=8):
    """Compute amplitude response given resonant frequencies and Q-factor."""
    response = np.ones_like(freqs)
    for f_res in resonances:
        # Lorentzian peak at each resonance
        gamma = f_res / (2 * Q)
        response += 1.0 / ((freqs - f_res)**2 + gamma**2) * gamma**2
    return response

freqs = np.linspace(50, 5000, 2000)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# --- Frequency response for each species ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
for name, params in species.items():
    res_freqs = resonant_frequencies(params['casque_length'])
    response = frequency_response(freqs, res_freqs, Q=8)
    response_db = 10 * np.log10(response / response.max() + 1e-10)
    ax.plot(freqs, response_db, color=params['color'], linewidth=1.5, label=f"{name} ({params['casque_length']*100:.0f}cm)")
ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Relative Gain (dB)', color='white')
ax.set_title('Casque Frequency Response by Species', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Fundamental frequency vs casque length ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
lengths = np.linspace(0.05, 0.30, 100)
f0_curve = v_sound / (4 * lengths)
ax.plot(lengths * 100, f0_curve, color='white', linewidth=2, label='f = v/(4L)')
for name, params in species.items():
    f0 = v_sound / (4 * params['casque_length'])
    ax.scatter([params['casque_length'] * 100], [f0], color=params['color'], s=100, zorder=5)
    ax.annotate(name.split()[0], (params['casque_length']*100, f0), xytext=(5, 5),
                textcoords='offset points', color=params['color'], fontsize=7)
ax.set_xlabel('Casque Length (cm)', color='white')
ax.set_ylabel('Fundamental Frequency (Hz)', color='white')
ax.set_title('Casque Length vs Call Pitch', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Q-factor effect on resonance sharpness ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
great_res = resonant_frequencies(0.18)
for Q, style, alpha in [(3, '--', 0.6), (8, '-', 0.8), (20, '-', 1.0)]:
    response = frequency_response(freqs, great_res, Q=Q)
    response_db = 10 * np.log10(response / response.max() + 1e-10)
    ax.plot(freqs, response_db, color='#22c55e', linewidth=1.5, linestyle=style, alpha=alpha, label=f'Q = {Q}')
ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Relative Gain (dB)', color='white')
ax.set_title('Effect of Q-Factor on Resonance Sharpness', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Synthesize call with casque filtering ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
sr = 22050
duration = 0.5
t = np.linspace(0, duration, int(sr * duration), endpoint=False)

# Raw vocal source: rich harmonic series (like vocal cords)
source = np.zeros_like(t)
f_vocal = 200  # fundamental vocal frequency
for k in range(1, 15):
    source += (1.0 / k) * np.sin(2 * np.pi * k * f_vocal * t)
source += 0.05 * np.random.randn(len(t))

# Apply casque resonance filter in frequency domain
fft_source = np.fft.rfft(source)
fft_freqs = np.fft.rfftfreq(len(source), d=1.0/sr)
casque_filter = frequency_response(fft_freqs, resonant_frequencies(0.18), Q=8)
casque_filter = casque_filter / casque_filter.max()
fft_filtered = fft_source * casque_filter
filtered = np.fft.irfft(fft_filtered, n=len(source))

ax.plot(t[:500], source[:500] / np.max(np.abs(source)), color='#6b7280', linewidth=0.8, alpha=0.5, label='Raw source')
ax.plot(t[:500], filtered[:500] / np.max(np.abs(filtered)), color='#22c55e', linewidth=1.2, label='After casque')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Amplitude', color='white')
ax.set_title('Vocal Source vs Casque-Filtered Call', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Casque Resonance Analysis:")
print(f"{'Species':<25} {'Casque(cm)':>10} {'f0(Hz)':>8} {'f1(Hz)':>8} {'f2(Hz)':>8}")
print("-" * 61)
for name, params in species.items():
    res = resonant_frequencies(params['casque_length'], 3)
    print(f"{name:<25} {params['casque_length']*100:>10.0f} {res[0]:>8.0f} {res[1]:>8.0f} {res[2]:>8.0f}")
print()
print("Key insight: casque length determines species-specific call pitch.")
print("Longer casques = lower fundamental frequency = deeper booming calls.")`,
      challenge: 'Add a simulation of two hornbills with slightly different casque lengths calling simultaneously. Compute the beat frequency (the difference in fundamentals) and visualize the interference pattern.',
      successHint: 'Acoustic resonance is one of the most elegant examples of physics in biology. The casque is a precisely tuned instrument shaped by millions of years of selection for effective long-distance communication in dense forest.',
    },
    {
      title: 'Seed dispersal networks — hornbills as forest architects',
      concept: `Hornbills are among the most important seed dispersers in tropical Asian forests. A single Great Hornbill can disperse seeds from over 40 plant species across a home range of 10+ km². Understanding their role requires **network analysis**.

A **seed dispersal network** is a bipartite graph: one set of nodes represents fruiting tree species, the other represents disperser species (birds, mammals, etc.). An edge connects a tree to a disperser if that animal eats the fruit and deposits viable seeds elsewhere. Edge weights can represent frequency of interaction, quantity of seeds moved, or dispersal distance.

Key network metrics reveal each species' importance:
- **Degree**: how many plant species a disperser handles. Hornbills have high degree (40+ species) — they are **generalist dispersers**.
- **Betweenness centrality**: how often a disperser is the ONLY link between otherwise unconnected plants. High betweenness means removing that disperser would fragment the network.
- **Nestedness**: a property of the whole network where specialist dispersers interact with subsets of the plants that generalists also visit. Nested networks are more robust to random extinctions but vulnerable to losing keystone generalists.

If hornbills disappear, dozens of tree species lose their primary disperser. The forest composition shifts over decades as large-seeded trees fail to regenerate away from parent trees.`,
      analogy: 'Think of the seed dispersal network like a postal system. Hornbills are like the main post office that handles mail for every neighborhood (high degree). Some small birds are like corner mailboxes that only serve one street (low degree). If you shut down the main post office, dozens of neighborhoods lose service. If you lose one corner mailbox, only one street is affected.',
      storyConnection: 'The hornbill\'s crown symbolizes its status as royalty of the forest. In ecological terms, this royalty is earned — hornbills are keystone dispersers whose daily flights plant the seeds of the next generation of forest. Without the hornbill, the forest literally cannot reproduce itself fully.',
      checkQuestion: 'A forest has 50 tree species. Hornbills disperse seeds for 40 of them, while 10 small bird species each disperse seeds for 5 tree species (with overlap). If hornbills go locally extinct, what is the maximum number of tree species that could lose ALL dispersers?',
      checkAnswer: 'The 10 small birds cover at most 10 x 5 = 50 species, but with overlap the actual coverage is less. However, the question is how many of the 40 hornbill-served species are NOT also served by the small birds. In the worst case, the 10 small birds might all specialize on the same 10 species (all within the hornbill\'s 40). Then 30 tree species would lose all dispersers. In the best case, the small birds collectively cover all 40 hornbill species (needing at least 8 specialists with no overlap). Reality is somewhere between — typically 10-20 species lose their primary disperser.',
      codeIntro: 'Build a seed dispersal network, compute centrality metrics, and simulate the impact of hornbill extinction on forest connectivity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Build a seed dispersal network ---
n_trees = 40
n_dispersers = 12

tree_names = [f'Tree_{i+1}' for i in range(n_trees)]
disperser_names = ['Great Hornbill', 'Wreathed Hornbill', 'Pied Hornbill',
                   'Green Pigeon', 'Imperial Pigeon', 'Barbet', 'Bulbul',
                   'Myna', 'Flowerpecker', 'Fruit Bat', 'Macaque', 'Civet']

# Interaction matrix: disperser x tree (1 = disperses, 0 = does not)
# Hornbills are generalists (many connections), others are specialists
interaction = np.zeros((n_dispersers, n_trees), dtype=int)

# Great Hornbill: disperses 35 of 40 species
interaction[0, np.random.choice(n_trees, 35, replace=False)] = 1
# Wreathed Hornbill: 28 species
interaction[1, np.random.choice(n_trees, 28, replace=False)] = 1
# Pied Hornbill: 20 species
interaction[2, np.random.choice(n_trees, 20, replace=False)] = 1
# Other dispersers: 3-10 species each
for i in range(3, n_dispersers):
    n_sp = np.random.randint(3, 11)
    interaction[i, np.random.choice(n_trees, n_sp, replace=False)] = 1

# --- Compute network metrics ---
degree_disperser = interaction.sum(axis=1)  # number of tree species per disperser
degree_tree = interaction.sum(axis=0)       # number of dispersers per tree

# Betweenness-like metric: for each tree, count if disperser is the SOLE disperser
sole_disperser_count = np.zeros(n_dispersers)
for t in range(n_trees):
    dispersers_for_tree = np.where(interaction[:, t] == 1)[0]
    if len(dispersers_for_tree) == 1:
        sole_disperser_count[dispersers_for_tree[0]] += 1

# Extinction simulation: remove dispersers one by one (most connected first)
def simulate_extinction(interaction_matrix, removal_order):
    """Remove dispersers in order, track trees with zero dispersers."""
    matrix = interaction_matrix.copy()
    orphaned = []
    for step, d_idx in enumerate(removal_order):
        matrix[d_idx, :] = 0
        n_orphaned = np.sum(matrix.sum(axis=0) == 0)
        orphaned.append(n_orphaned)
    return orphaned

# Targeted: remove most connected first
targeted_order = np.argsort(-degree_disperser)
targeted_orphans = simulate_extinction(interaction, targeted_order)

# Random: average of 50 random orderings
random_orphans_all = []
for _ in range(50):
    order = np.random.permutation(n_dispersers)
    random_orphans_all.append(simulate_extinction(interaction, order))
random_orphans = np.mean(random_orphans_all, axis=0)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# --- Interaction matrix heatmap ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.imshow(interaction, aspect='auto', cmap='Greens', interpolation='nearest')
ax.set_yticks(range(n_dispersers))
ax.set_yticklabels(disperser_names, fontsize=7)
ax.set_xlabel(f'Tree species (n={n_trees})', color='white')
ax.set_title('Seed Dispersal Network (green = interaction)', color='white')
ax.tick_params(colors='gray')

# --- Disperser degree (bar chart) ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
sort_idx = np.argsort(degree_disperser)[::-1]
colors_bar = ['#22c55e' if i < 3 else '#6b7280' for i in sort_idx]
ax.barh([disperser_names[i] for i in sort_idx], degree_disperser[sort_idx], color=colors_bar)
ax.set_xlabel('Number of Tree Species Dispersed', color='white')
ax.set_title('Disperser Degree (green = hornbills)', color='white')
ax.tick_params(colors='gray', labelsize=7)

# --- Sole-disperser responsibility ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.barh([disperser_names[i] for i in sort_idx], sole_disperser_count[sort_idx],
        color=['#ef4444' if sole_disperser_count[i] > 0 else '#6b7280' for i in sort_idx])
ax.set_xlabel('Trees Where This Is the ONLY Disperser', color='white')
ax.set_title('Sole Disperser Responsibility (critical role)', color='white')
ax.tick_params(colors='gray', labelsize=7)

# --- Extinction cascade ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
steps = range(1, n_dispersers + 1)
ax.plot(steps, targeted_orphans, 'o-', color='#ef4444', linewidth=2, label='Targeted (most connected first)')
ax.plot(steps, random_orphans, 's-', color='#3b82f6', linewidth=2, label='Random removal (avg of 50)')
ax.fill_between(steps, targeted_orphans, alpha=0.15, color='#ef4444')
ax.set_xlabel('Number of Disperser Species Removed', color='white')
ax.set_ylabel('Tree Species with No Dispersers', color='white')
ax.set_title('Extinction Cascade Simulation', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Seed Dispersal Network Analysis:")
print(f"{'Disperser':<22} {'Degree':>7} {'Sole Resp.':>11}")
print("-" * 42)
for i in targeted_order:
    print(f"{disperser_names[i]:<22} {degree_disperser[i]:>7} {int(sole_disperser_count[i]):>11}")
print()
print(f"Trees with only 1 disperser species: {np.sum(degree_tree == 1)}")
print(f"After removing all 3 hornbills: {targeted_orphans[2]} tree species lose ALL dispersers")
print("Hornbills are irreplaceable keystone dispersers.")`,
      challenge: 'Add weighted edges: hornbills carry 50+ seeds per visit, small birds carry 1-5. Recompute the impact of hornbill extinction on total seed movement (not just connectivity) and visualize the difference.',
      successHint: 'Network analysis reveals what intuition alone cannot: hornbills are not just one of many dispersers — they are the backbone of the network. Their loss triggers a cascade that restructures the entire forest over decades.',
    },
    {
      title: 'Mark-recapture population estimation for hornbill census',
      concept: `Counting hornbills in dense tropical forest is difficult — you cannot see them all. Ecologists use **mark-recapture** methods to estimate population size from incomplete observations.

The classic **Lincoln-Petersen** method works in two steps:
1. **Capture session 1**: catch (or identify) M individuals. Mark them (e.g., leg bands, photo-ID of unique bill markings).
2. **Capture session 2**: catch C individuals total. Of those, R are already marked (recaptured).

The population estimate is: **N = (M × C) / R**

The logic: if you marked M out of the true population N, then the proportion marked in the population is M/N. In the second sample, you expect the same proportion: R/C ≈ M/N. Solving for N gives the formula above.

This assumes: (1) the population is **closed** (no births, deaths, immigration, emigration between sessions), (2) marks are not lost, (3) marked and unmarked individuals have **equal probability** of capture. Violations of these assumptions bias the estimate — for example, if marked birds become trap-shy, R is too low, and N is overestimated.

For longer studies, **Jolly-Seber** models relax the closed-population assumption, estimating survival and recruitment rates alongside population size.`,
      analogy: 'Imagine you pour 100 red marbles into a jar of unknown size containing white marbles, mix well, then scoop out 50 marbles and count 10 red ones. Since 10/50 = 20% of your sample is red, and you know you added 100 red marbles, the total must be about 100/0.20 = 500 marbles. Mark-recapture uses the same logic with birds instead of marbles.',
      storyConnection: 'To truly crown the hornbill as king of the forest, we need to know how many subjects remain in the kingdom. Mark-recapture lets field researchers estimate hornbill population size without the impossible task of finding every individual in dense canopy — a blend of statistics and careful fieldwork.',
      checkQuestion: 'You band 30 hornbills in session 1. In session 2, you capture 40 hornbills, of which 6 are banded. What is the population estimate? What if only 2 were banded?',
      checkAnswer: 'With R=6: N = (30 × 40) / 6 = 200 hornbills. With R=2: N = (30 × 40) / 2 = 600 hornbills. The fewer recaptures you get, the larger (and less precise) the estimate. With only 2 recaptures, the confidence interval would be very wide. This illustrates why adequate recapture rates are critical for reliable estimates.',
      codeIntro: 'Simulate mark-recapture surveys with varying population sizes, sample sizes, and assumption violations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Basic Lincoln-Petersen simulation ---
def lincoln_petersen(true_N, M, C, n_sims=1000):
    """Simulate mark-recapture and return estimates."""
    estimates = []
    for _ in range(n_sims):
        # Mark M individuals (indices 0..M-1 are marked)
        # Second capture: sample C from population
        captured = np.random.choice(true_N, C, replace=False)
        R = np.sum(captured < M)  # how many of the captured are marked
        if R > 0:
            N_hat = (M * C) / R
            estimates.append(N_hat)
        else:
            estimates.append(np.nan)  # undefined if no recaptures
    return np.array(estimates)

# --- Simulation 1: Accuracy vs sample size ---
true_N = 300
sample_sizes = [10, 20, 30, 50, 75, 100]
results_by_size = {}
for M in sample_sizes:
    C = M  # equal effort both sessions
    ests = lincoln_petersen(true_N, M, C)
    results_by_size[M] = ests[~np.isnan(ests)]

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

ax = axes[0, 0]
ax.set_facecolor('#111827')
positions = range(len(sample_sizes))
bp = ax.boxplot([results_by_size[m] for m in sample_sizes], positions=positions,
                patch_artist=True, widths=0.6)
for patch in bp['boxes']:
    patch.set_facecolor('#22c55e')
    patch.set_alpha(0.5)
for element in ['whiskers', 'caps', 'medians']:
    for line in bp[element]:
        line.set_color('white')
ax.axhline(y=true_N, color='#ef4444', linestyle='--', linewidth=2, label=f'True N = {true_N}')
ax.set_xticks(positions)
ax.set_xticklabels([str(m) for m in sample_sizes])
ax.set_xlabel('Sample Size (M = C)', color='white')
ax.set_ylabel('Population Estimate', color='white')
ax.set_title('Estimate Accuracy vs Sample Size', color='white')
ax.set_ylim(0, 2000)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Simulation 2: Bias from trap-shy behavior ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
true_N = 300
M = 50
C = 50
shy_factors = [1.0, 0.8, 0.5, 0.3, 0.1]  # recapture probability multiplier for marked birds
estimates_shy = {}
for shy in shy_factors:
    ests = []
    for _ in range(1000):
        captured = []
        for i in range(true_N):
            p = 1.0 if i >= M else shy  # marked birds have reduced capture probability
            if np.random.random() < C / true_N * p:
                captured.append(i)
        R = sum(1 for c in captured if c < M)
        total_C = len(captured)
        if R > 0 and total_C > 0:
            ests.append((M * total_C) / R)
    estimates_shy[shy] = np.array(ests)

bp2 = ax.boxplot([estimates_shy[s] for s in shy_factors],
                  patch_artist=True, widths=0.6)
for patch in bp2['boxes']:
    patch.set_facecolor('#f59e0b')
    patch.set_alpha(0.5)
for element in ['whiskers', 'caps', 'medians']:
    for line in bp2[element]:
        line.set_color('white')
ax.axhline(y=true_N, color='#ef4444', linestyle='--', linewidth=2, label=f'True N = {true_N}')
ax.set_xticklabels([f'{s:.0%}' for s in shy_factors])
ax.set_xlabel('Recapture Probability for Marked Birds', color='white')
ax.set_ylabel('Population Estimate', color='white')
ax.set_title('Bias from Trap-Shy Behavior', color='white')
ax.set_ylim(0, 3000)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Simulation 3: Chapman estimator (bias-corrected) ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
true_N = 300
M = 30
C = 30

lp_estimates = lincoln_petersen(true_N, M, C, 2000)
lp_clean = lp_estimates[~np.isnan(lp_estimates)]

# Chapman estimator: N = ((M+1)(C+1))/(R+1) - 1
chapman_ests = []
for _ in range(2000):
    captured = np.random.choice(true_N, C, replace=False)
    R = np.sum(captured < M)
    N_chap = ((M + 1) * (C + 1)) / (R + 1) - 1
    chapman_ests.append(N_chap)
chapman_ests = np.array(chapman_ests)

ax.hist(lp_clean, bins=50, alpha=0.5, color='#3b82f6', label=f'Lincoln-Petersen (mean={np.nanmean(lp_clean):.0f})')
ax.hist(chapman_ests, bins=50, alpha=0.5, color='#22c55e', label=f'Chapman (mean={np.mean(chapman_ests):.0f})')
ax.axvline(x=true_N, color='#ef4444', linewidth=2, linestyle='--', label=f'True N = {true_N}')
ax.set_xlabel('Population Estimate', color='white')
ax.set_ylabel('Frequency', color='white')
ax.set_title('Lincoln-Petersen vs Chapman Estimator', color='white')
ax.set_xlim(0, 1500)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Confidence interval width vs sample effort ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
efforts = np.arange(10, 101, 5)
ci_widths = []
for m in efforts:
    ests = lincoln_petersen(300, m, m, 1000)
    clean = ests[~np.isnan(ests)]
    if len(clean) > 10:
        ci_widths.append(np.percentile(clean, 97.5) - np.percentile(clean, 2.5))
    else:
        ci_widths.append(np.nan)
ax.plot(efforts, ci_widths, 'o-', color='#a855f7', linewidth=2)
ax.set_xlabel('Sample Size (M = C)', color='white')
ax.set_ylabel('95% CI Width', color='white')
ax.set_title('Precision Improves with Sampling Effort', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Mark-Recapture Summary (True N = 300):")
print(f"Lincoln-Petersen (M=30, C=30): mean = {np.nanmean(lp_clean):.0f}, median = {np.nanmedian(lp_clean):.0f}")
print(f"Chapman (M=30, C=30): mean = {np.mean(chapman_ests):.0f}, median = {np.median(chapman_ests):.0f}")
print(f"Chapman is less biased for small samples (adds 1 to numerator and denominator).")
print()
print("Practical rule: need M*C/N >= 7 recaptures for reliable estimates.")
print(f"With M=C=30, N=300: expected recaptures = 30*30/300 = {30*30/300:.0f}. Just barely adequate.")`,
      challenge: 'Implement a multi-session Jolly-Seber-like approach: run 5 capture sessions, track marked/unmarked in each session, and estimate how the population changes over time (simulate 5% mortality between sessions).',
      successHint: 'Mark-recapture connects statistics to real conservation fieldwork. The assumptions matter enormously — violating them can make your estimate twice the true value or half. Understanding the method means understanding its limitations.',
    },
    {
      title: 'Biomechanics of casque structure — finite element analysis concepts',
      concept: `The hornbill's casque appears solid and heavy, but cross-sections reveal a remarkable engineering solution: a **cellular structure** of thin bone walls enclosing air pockets, similar to engineering foam or honeycomb. This reduces weight while maintaining structural integrity.

**Stress** (force per area, in Pascals) and **strain** (deformation per unit length, dimensionless) are the fundamental quantities of structural mechanics. When a hornbill strikes its casque against a tree during territorial displays, the casque must absorb impact without fracturing. The cellular structure achieves this through **energy absorption**: each thin wall buckles and deforms slightly, distributing the impact across many cells rather than concentrating it at one point.

**Young's modulus** (E) describes material stiffness: stress/strain in the elastic region. Bone has E ≈ 15-20 GPa. But the *effective* modulus of a cellular structure is much lower because most of the volume is air. For a foam-like structure with relative density ρ*/ρs, the effective modulus scales as E* ≈ Es × (ρ*/ρs)², meaning a structure that is 30% solid has only 9% of the solid material's stiffness — but also only 30% of its weight. The trade-off favors the hornbill: light enough to fly, strong enough to fight.

**Finite element analysis (FEA)** is the computational method for predicting stress distribution in complex shapes. It divides the structure into tiny elements, solves force-balance equations for each, and assembles results into a complete stress map.`,
      analogy: 'The casque structure is like bubble wrap protecting a package. Each air pocket absorbs a small portion of an impact. If you press one bubble, it deforms and spreads the force to neighboring bubbles. This distributed deformation prevents any single point from experiencing catastrophic stress. The hornbill evolved its own internal bubble wrap millions of years before humans invented the packaging version.',
      storyConnection: 'The hornbill\'s crown endures battles and territorial clashes. The story presents it as a symbol of strength and nobility. That strength comes not from being solid and heavy, but from sophisticated internal architecture — nature\'s answer to the engineering problem of making a structure that is simultaneously light, strong, and shock-absorbing.',
      checkQuestion: 'Why does the effective modulus of a cellular structure scale with the SQUARE of relative density rather than linearly? (Hint: think about how thin beams bend.)',
      checkAnswer: 'In a cellular structure, each wall acts as a thin beam. When the structure is compressed, these beams bend (not just compress axially). The bending stiffness of a beam scales with thickness³/length³. For a structure with relative density ρ*/ρs, wall thickness scales linearly with ρ*/ρs, and so does cell size. Substituting into the bending formula gives stiffness proportional to (ρ*/ρs)². This quadratic scaling is a fundamental result in cellular mechanics (Gibson-Ashby theory).',
      codeIntro: 'Model the casque as a cellular structure, compute effective mechanical properties, and simulate an impact event.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Cellular structure mechanics (Gibson-Ashby model) ---
rho_bone = 1900  # density of solid bone (kg/m^3)
E_bone = 18e9    # Young's modulus of solid bone (Pa)
sigma_y_bone = 130e6  # yield stress of bone (Pa)

# Relative density range for hornbill casque
relative_densities = np.linspace(0.05, 0.8, 100)

# Gibson-Ashby scaling laws for closed-cell foam
def effective_modulus(Es, rel_density):
    """E* = Es * (rel_density)^2 for open cell; add 0.33 factor."""
    return 0.33 * Es * rel_density ** 2

def effective_strength(sigma_ys, rel_density):
    """sigma* = 0.3 * sigma_ys * (rel_density)^(3/2)"""
    return 0.3 * sigma_ys * rel_density ** 1.5

def effective_density(rho_s, rel_density):
    return rho_s * rel_density

E_eff = effective_modulus(E_bone, relative_densities)
sigma_eff = effective_strength(sigma_y_bone, relative_densities)
rho_eff = effective_density(rho_bone, relative_densities)

# Specific stiffness and strength (per unit mass)
specific_E = E_eff / rho_eff
specific_sigma = sigma_eff / rho_eff

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# --- E* vs relative density ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(relative_densities, E_eff / 1e9, color='#22c55e', linewidth=2)
ax.axvspan(0.2, 0.35, alpha=0.2, color='#f59e0b', label='Hornbill casque range')
ax.set_xlabel('Relative Density (ρ*/ρs)', color='white')
ax.set_ylabel('Effective Modulus (GPa)', color='white')
ax.set_title('Stiffness vs Density', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Strength vs relative density ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(relative_densities, sigma_eff / 1e6, color='#3b82f6', linewidth=2)
ax.axvspan(0.2, 0.35, alpha=0.2, color='#f59e0b', label='Hornbill casque range')
ax.set_xlabel('Relative Density (ρ*/ρs)', color='white')
ax.set_ylabel('Effective Strength (MPa)', color='white')
ax.set_title('Crush Strength vs Density', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Specific properties (merit indices) ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(relative_densities, specific_E / 1e6, color='#22c55e', linewidth=2, label='Specific stiffness (E*/ρ*)')
ax.plot(relative_densities, specific_sigma, color='#3b82f6', linewidth=2, label='Specific strength (σ*/ρ*)')
ax.axvspan(0.2, 0.35, alpha=0.2, color='#f59e0b', label='Hornbill range')
ax.set_xlabel('Relative Density', color='white')
ax.set_ylabel('Specific Property', color='white')
ax.set_title('Weight-Efficiency: Less Dense Is Better', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Impact simulation ---
ax = axes[1, 0]
ax.set_facecolor('#111827')

# Model casque as a spring-dashpot system
# Impact: hornbill head (m=0.15 kg) hits tree at v=2 m/s
m_head = 0.15  # kg
v_impact = 2.0  # m/s

# Casque properties at 25% relative density
rd_casque = 0.25
E_casque = float(effective_modulus(E_bone, rd_casque))
sigma_crush = float(effective_strength(sigma_y_bone, rd_casque))
casque_thickness = 0.03  # 3 cm
contact_area = 0.0005  # 5 cm^2

# Spring constant
k = E_casque * contact_area / casque_thickness
damping = 0.4  # energy absorption ratio

# Simulate impact (mass-spring with energy absorption)
dt = 1e-6
t_sim = np.arange(0, 0.01, dt)
x = np.zeros_like(t_sim)  # deformation
v = np.zeros_like(t_sim)  # velocity
v[0] = v_impact
force_history = np.zeros_like(t_sim)

for i in range(1, len(t_sim)):
    F_spring = k * x[i-1]
    F_damping = damping * k * v[i-1] * dt  # simplified damping
    F_total = F_spring + F_damping
    force_history[i] = F_total
    a = -F_total / m_head
    v[i] = v[i-1] + a * dt
    x[i] = x[i-1] + v[i] * dt
    if v[i] <= 0:
        v[i:] = 0
        force_history[i:] = 0
        break

ax.plot(t_sim * 1000, force_history, color='#ef4444', linewidth=2)
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Impact Force (N)', color='white')
peak_force = np.max(force_history)
ax.set_title(f'Impact Force During Head Strike (peak={peak_force:.0f} N)', color='white')
ax.tick_params(colors='gray')

# --- Compare solid vs cellular impact ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
densities_test = [0.15, 0.25, 0.40, 1.0]
colors_test = ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444']
labels_test = ['15% (ultra-light)', '25% (hornbill)', '40% (dense)', '100% (solid bone)']

for rd, col, lbl in zip(densities_test, colors_test, labels_test):
    E_test = float(effective_modulus(E_bone, rd)) if rd < 1 else E_bone
    k_test = E_test * contact_area / casque_thickness
    x_t = np.zeros_like(t_sim)
    v_t = np.zeros_like(t_sim)
    v_t[0] = v_impact
    f_t = np.zeros_like(t_sim)
    for i in range(1, len(t_sim)):
        F = k_test * x_t[i-1] + damping * k_test * v_t[i-1] * dt
        f_t[i] = F
        a = -F / m_head
        v_t[i] = v_t[i-1] + a * dt
        x_t[i] = x_t[i-1] + v_t[i] * dt
        if v_t[i] <= 0:
            break
    ax.plot(t_sim[:i+1] * 1000, f_t[:i+1], color=col, linewidth=2, label=lbl)

ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Impact Force (N)', color='white')
ax.set_title('Peak Force vs Cellular Density', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Weight savings summary ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
casque_volume = 50e-6  # approximate casque volume in m^3
weights = [rho_bone * rd * casque_volume * 1000 for rd in densities_test]  # grams
ax.bar(range(len(densities_test)), weights, color=colors_test)
ax.set_xticks(range(len(densities_test)))
ax.set_xticklabels(['15%', '25%', '40%', '100%'], color='white')
ax.set_xlabel('Relative Density', color='white')
ax.set_ylabel('Casque Mass (grams)', color='white')
ax.set_title('Weight Savings from Cellular Structure', color='white')
for i, w in enumerate(weights):
    ax.text(i, w + 1, f'{w:.0f}g', ha='center', color='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Casque Biomechanics Summary:")
print(f"{'Relative Density':<18} {'Eff. Modulus (GPa)':>18} {'Crush Strength (MPa)':>21} {'Mass (g)':>9}")
print("-" * 68)
for rd, col, lbl in zip(densities_test, colors_test, labels_test):
    E_v = effective_modulus(E_bone, rd) / 1e9 if rd < 1 else E_bone / 1e9
    s_v = effective_strength(sigma_y_bone, rd) / 1e6 if rd < 1 else sigma_y_bone / 1e6
    m_v = rho_bone * rd * casque_volume * 1000
    print(f"{lbl:<30} {E_v:>10.2f} {s_v:>18.1f} {m_v:>10.0f}")
print()
print("The hornbill casque at ~25% relative density is 75% lighter than solid bone")
print("while retaining enough strength for territorial combat. Nature\'s engineering.")`,
      challenge: 'Model the casque as a 2D grid of cells (like a honeycomb cross-section). Apply a point load at the top and compute stress distribution by propagating forces through the cell walls. Visualize which cells carry the most stress.',
      successHint: 'Cellular structures appear everywhere in nature — bird bones, plant stems, coral, trabecular bone. The Gibson-Ashby scaling laws give us a simple but powerful framework to understand why nature overwhelmingly favors hollow over solid construction.',
    },
    {
      title: 'Hornbill habitat modeling with logistic regression',
      concept: `Predicting where hornbills are likely to be found requires **habitat suitability modeling**. We observe hornbill presence/absence at many locations, measure environmental variables at each location, and build a model that predicts the probability of presence from those variables.

**Logistic regression** is the workhorse model for binary classification when you want calibrated probabilities. It models the log-odds of presence as a linear combination of features:

log(p/(1-p)) = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ

The key environmental variables for hornbills include:
- **Canopy height** (hornbills need tall trees for nesting — cavity nesters require old-growth trees with trunk diameters > 60 cm)
- **Forest contiguity** (continuous forest, not fragments — hornbills need large home ranges)
- **Fruit tree density** (food availability — fig trees are especially critical)
- **Distance to human settlement** (hornbills are sensitive to disturbance and hunting)
- **Elevation** (most species prefer lowland and mid-elevation forests, < 1500m)

The model outputs a probability between 0 and 1, which can be mapped onto a landscape to create a **habitat suitability map**. This directly informs conservation planning: protect the high-probability areas first.`,
      analogy: 'Habitat modeling is like a real estate algorithm predicting house prices. Just as a house price depends on location, size, neighborhood quality, and distance to amenities, hornbill presence depends on tree height, forest size, fruit availability, and distance from threats. The logistic regression finds the "pricing formula" for hornbill habitat.',
      storyConnection: 'The hornbill\'s crown represents its need for a specific kind of kingdom — not just any forest, but old-growth forest with tall trees, abundant fruit, and minimal human disturbance. Habitat modeling quantifies exactly what makes a forest fit for a king, turning ecological intuition into actionable conservation maps.',
      checkQuestion: 'Your model predicts 80% probability of hornbill presence at a location, but the species is actually absent. Does this mean the model is wrong?',
      checkAnswer: 'Not necessarily. A probability of 80% means that out of 100 sites with similar characteristics, we expect hornbills at about 80 of them. Absence at any single site is consistent with an 80% probability — it just means this site fell in the 20% where other factors (recent disturbance, bad luck, stochastic absence) dominated. The model is only "wrong" if, across many sites where it predicts 80%, presence is significantly different from 80%. This is the concept of calibration.',
      codeIntro: 'Build a hornbill habitat suitability model from synthetic survey data using logistic regression from scratch.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Generate synthetic hornbill survey data ---
n_sites = 500

# Environmental variables
canopy_height = np.random.uniform(5, 45, n_sites)       # meters
forest_area = np.random.exponential(50, n_sites)          # km^2
fig_tree_density = np.random.uniform(0, 30, n_sites)      # trees per hectare
dist_settlement = np.random.exponential(5, n_sites)       # km
elevation = np.random.uniform(50, 2000, n_sites)          # meters

# True relationship (known to us, unknown to model)
logits = (-5.0
          + 0.15 * canopy_height
          + 0.02 * forest_area
          + 0.12 * fig_tree_density
          + 0.3 * dist_settlement
          - 0.002 * elevation)
prob_true = 1 / (1 + np.exp(-logits))
presence = (np.random.random(n_sites) < prob_true).astype(float)

print(f"Survey: {n_sites} sites, {int(presence.sum())} with hornbills ({presence.mean():.0%} prevalence)")

# --- Build feature matrix ---
X = np.column_stack([canopy_height, forest_area, fig_tree_density, dist_settlement, elevation])
feature_names = ['Canopy Height', 'Forest Area', 'Fig Density', 'Dist. Settlement', 'Elevation']

# Standardize features
mu = X.mean(axis=0)
sigma = X.std(axis=0) + 1e-10
X_std = (X - mu) / sigma

# Add intercept
X_design = np.column_stack([np.ones(n_sites), X_std])

# --- Logistic regression via gradient descent ---
def sigmoid(z):
    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

def log_likelihood(X, y, beta):
    p = sigmoid(X @ beta)
    return np.sum(y * np.log(p + 1e-10) + (1 - y) * np.log(1 - p + 1e-10))

# Gradient descent
n_features = X_design.shape[1]
beta = np.zeros(n_features)
lr = 0.05
history = []

for epoch in range(500):
    p_pred = sigmoid(X_design @ beta)
    gradient = X_design.T @ (presence - p_pred)
    beta += lr * gradient / n_sites
    ll = log_likelihood(X_design, presence, beta)
    history.append(ll)

# Predictions
p_hat = sigmoid(X_design @ beta)
predictions = (p_hat >= 0.5).astype(float)
accuracy = np.mean(predictions == presence)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# --- Training convergence ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(history, color='#22c55e', linewidth=1.5)
ax.set_xlabel('Epoch', color='white')
ax.set_ylabel('Log-Likelihood', color='white')
ax.set_title('Training Convergence', color='white')
ax.tick_params(colors='gray')

# --- Coefficient importance ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
coefs = beta[1:]  # exclude intercept
sort_idx = np.argsort(np.abs(coefs))[::-1]
colors_bar = ['#22c55e' if c > 0 else '#ef4444' for c in coefs[sort_idx]]
ax.barh([feature_names[i] for i in sort_idx], coefs[sort_idx], color=colors_bar)
ax.set_xlabel('Coefficient (standardized)', color='white')
ax.set_title('Feature Importance (green=positive, red=negative)', color='white')
ax.tick_params(colors='gray')

# --- ROC curve ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
thresholds = np.linspace(0, 1, 200)
tpr_list, fpr_list = [], []
for thresh in thresholds:
    pred = (p_hat >= thresh).astype(float)
    tp = np.sum((pred == 1) & (presence == 1))
    fp = np.sum((pred == 1) & (presence == 0))
    fn = np.sum((pred == 0) & (presence == 1))
    tn = np.sum((pred == 0) & (presence == 0))
    tpr_list.append(tp / (tp + fn + 1e-10))
    fpr_list.append(fp / (fp + tn + 1e-10))
auc = -np.trapz(tpr_list, fpr_list)
ax.plot(fpr_list, tpr_list, color='#22c55e', linewidth=2, label=f'AUC = {auc:.3f}')
ax.plot([0, 1], [0, 1], '--', color='gray', linewidth=1)
ax.set_xlabel('False Positive Rate', color='white')
ax.set_ylabel('True Positive Rate', color='white')
ax.set_title('ROC Curve', color='white')
ax.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Habitat suitability map (2D: canopy height vs fig density) ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
ch_range = np.linspace(5, 45, 100)
fd_range = np.linspace(0, 30, 100)
CH, FD = np.meshgrid(ch_range, fd_range)
# Fix other variables at median
grid_X = np.column_stack([
    CH.ravel(),
    np.full(10000, np.median(forest_area)),
    FD.ravel(),
    np.full(10000, np.median(dist_settlement)),
    np.full(10000, np.median(elevation))
])
grid_std = (grid_X - mu) / sigma
grid_design = np.column_stack([np.ones(10000), grid_std])
grid_prob = sigmoid(grid_design @ beta).reshape(100, 100)

im = ax.contourf(ch_range, fd_range, grid_prob, levels=20, cmap='RdYlGn')
plt.colorbar(im, ax=ax, label='P(presence)')
ax.scatter(canopy_height[presence==1], fig_tree_density[presence==1], c='white', s=5, alpha=0.3)
ax.scatter(canopy_height[presence==0], fig_tree_density[presence==0], c='black', s=5, alpha=0.3)
ax.set_xlabel('Canopy Height (m)', color='white')
ax.set_ylabel('Fig Tree Density (trees/ha)', color='white')
ax.set_title('Habitat Suitability Map', color='white')
ax.tick_params(colors='gray')

# --- Calibration plot ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
n_bins = 10
bin_edges = np.linspace(0, 1, n_bins + 1)
mean_predicted, mean_observed = [], []
for i in range(n_bins):
    mask = (p_hat >= bin_edges[i]) & (p_hat < bin_edges[i+1])
    if mask.sum() > 0:
        mean_predicted.append(p_hat[mask].mean())
        mean_observed.append(presence[mask].mean())
ax.plot(mean_predicted, mean_observed, 'o-', color='#22c55e', linewidth=2, markersize=8)
ax.plot([0, 1], [0, 1], '--', color='gray')
ax.set_xlabel('Mean Predicted Probability', color='white')
ax.set_ylabel('Observed Frequency', color='white')
ax.set_title('Calibration Plot (closer to diagonal = better)', color='white')
ax.tick_params(colors='gray')

# --- Partial dependence: canopy height ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
ch_vals = np.linspace(5, 45, 50)
partial_probs = []
for ch in ch_vals:
    X_temp = X.copy()
    X_temp[:, 0] = ch
    X_temp_std = (X_temp - mu) / sigma
    X_temp_design = np.column_stack([np.ones(n_sites), X_temp_std])
    partial_probs.append(sigmoid(X_temp_design @ beta).mean())
ax.plot(ch_vals, partial_probs, color='#22c55e', linewidth=2)
ax.set_xlabel('Canopy Height (m)', color='white')
ax.set_ylabel('Mean Predicted P(presence)', color='white')
ax.set_title('Partial Dependence: Canopy Height Effect', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"\\nModel Performance: accuracy = {accuracy:.1%}, AUC = {auc:.3f}")
print(f"\\nCoefficients (standardized):")
print(f"  Intercept: {beta[0]:.3f}")
for i, name in enumerate(feature_names):
    direction = "+" if beta[i+1] > 0 else "-"
    print(f"  {name}: {beta[i+1]:+.3f} ({direction} presence)")
print()
print("Conservation insight: canopy height and fig tree density are the")
print("strongest predictors. Protecting old-growth forest with mature fig")
print("trees is the single most effective strategy for hornbill conservation.")`,
      challenge: 'Split the data 80/20 train/test, train only on the training set, and compute AUC on the held-out test set. Compare train vs test AUC to check for overfitting.',
      successHint: 'Habitat suitability models bridge ecology and conservation policy. When a government asks "which forest patches should we protect?" the habitat model provides a quantitative, defensible answer based on the species\' actual requirements rather than political convenience.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (biomechanics and ecology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real scientific computing. Click to start.</p>
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
