import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function PeacockLevel3() {
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
      title: 'Thin-film interference — the physics of iridescent feathers',
      concept: `Peacock feathers are not pigmented blue or green. The colour you see is **structural colour** produced by thin-film interference in nanoscale barbule structures. Each barbule contains layers of melanin rods separated by keratin, with layer spacings around 100-200 nm.

When white light hits these layers, some wavelengths reflect from the top surface and some from the bottom. The reflected waves **interfere constructively** when the optical path difference equals a whole number of wavelengths: 2 * n * d * cos(theta) = m * lambda, where n is the refractive index, d is the layer thickness, theta is the angle of incidence, and m is an integer.

This is why peacock feathers change colour when you tilt them. The cos(theta) term shifts which wavelength satisfies the constructive interference condition. At normal incidence you might see blue; tilt 30 degrees and it shifts to green. This angle-dependent colour is the hallmark of iridescence and is impossible to produce with pigments alone.

The physics is identical to oil-film rainbows and anti-reflective coatings on camera lenses. Nature invented thin-film optics millions of years before humans did.`,
      analogy: 'Imagine two speakers playing the same note, but one is slightly farther away. At some positions the sound waves add up (loud) and at others they cancel (quiet). Thin-film interference does the same thing with light waves bouncing off two surfaces separated by a tiny gap. Only certain colours "add up" at each viewing angle.',
      storyConnection: 'The peacock in our story dances in shifting light, and observers see different colours from different angles. This is not magic but thin-film physics: the barbule layers act as natural diffraction gratings, and the dance itself is a display that shows off the full iridescent range to potential mates.',
      checkQuestion: 'If you could somehow change the refractive index of the keratin spacer layers from 1.5 to 2.0 without changing the physical thickness, what would happen to the reflected colour?',
      checkAnswer: 'The optical path length (n * d) increases, so the wavelength satisfying constructive interference shifts to a longer wavelength. Blue feathers would appear green or even yellow. The physical thickness is the same, but the "optical thickness" increased by 33%, pushing the peak reflected wavelength proportionally longer.',
      codeIntro: 'Model thin-film interference to compute the reflected colour as a function of layer thickness and viewing angle.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Thin-film interference model for peacock barbule
def reflectance_spectrum(d_nm, n_film, theta_deg, wavelengths):
    """Compute reflectance for a single thin film (simplified Fabry-Perot)."""
    theta = np.radians(theta_deg)
    # Snell's law: angle inside film
    sin_theta_t = np.sin(theta) / n_film
    cos_theta_t = np.sqrt(1 - sin_theta_t**2)

    # Optical path difference in nm
    opd = 2 * n_film * d_nm * cos_theta_t

    # Phase difference
    delta = 2 * np.pi * opd / wavelengths

    # Simplified reflectance (Airy function for single layer)
    R_base = ((n_film - 1) / (n_film + 1))**2
    R = 4 * R_base * np.sin(delta / 2)**2 / (1 - R_base)**2
    R = R / (1 + R)  # Normalize to [0, 1]
    return R

wavelengths = np.linspace(380, 750, 500)  # visible spectrum in nm

# Peacock barbule parameters
d_melanin = 150  # nm layer thickness
n_melanin = 2.0  # refractive index of melanin

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Reflectance at different angles
ax = axes[0, 0]
ax.set_facecolor('#111827')
angles = [0, 15, 30, 45, 60]
colors_list = ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#ef4444']
for angle, clr in zip(angles, colors_list):
    R = reflectance_spectrum(d_melanin, n_melanin, angle, wavelengths)
    ax.plot(wavelengths, R, color=clr, linewidth=2, label=f'{angle} deg')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('Iridescence: colour shifts with viewing angle', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Peak wavelength vs angle
ax = axes[0, 1]
ax.set_facecolor('#111827')
theta_range = np.linspace(0, 70, 100)
peak_wavelengths = []
for theta in theta_range:
    R = reflectance_spectrum(d_melanin, n_melanin, theta, wavelengths)
    peak_wavelengths.append(wavelengths[np.argmax(R)])
peak_wavelengths = np.array(peak_wavelengths)

# Color-code the line by wavelength
for i in range(len(theta_range) - 1):
    wl = peak_wavelengths[i]
    if wl < 450: c = '#6366f1'
    elif wl < 500: c = '#3b82f6'
    elif wl < 550: c = '#22c55e'
    elif wl < 600: c = '#eab308'
    elif wl < 650: c = '#f97316'
    else: c = '#ef4444'
    ax.plot(theta_range[i:i+2], peak_wavelengths[i:i+2], color=c, linewidth=3)
ax.set_xlabel('Viewing angle (degrees)', color='white')
ax.set_ylabel('Peak wavelength (nm)', color='white')
ax.set_title('Peak colour vs viewing angle', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 3: Effect of layer thickness
ax = axes[1, 0]
ax.set_facecolor('#111827')
thicknesses = [100, 130, 160, 190, 220]
for d, clr in zip(thicknesses, colors_list):
    R = reflectance_spectrum(d, n_melanin, 0, wavelengths)
    ax.plot(wavelengths, R, color=clr, linewidth=2, label=f'd={d} nm')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('Layer thickness controls base colour', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: 2D heatmap — angle vs wavelength
ax = axes[1, 1]
ax.set_facecolor('#111827')
angle_grid = np.linspace(0, 70, 80)
R_map = np.zeros((len(angle_grid), len(wavelengths)))
for i, a in enumerate(angle_grid):
    R_map[i] = reflectance_spectrum(d_melanin, n_melanin, a, wavelengths)
im = ax.imshow(R_map, aspect='auto', origin='lower',
               extent=[380, 750, 0, 70], cmap='inferno')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Viewing angle (deg)', color='white')
ax.set_title('Iridescence map (bright = high reflectance)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, label='Reflectance')

plt.tight_layout()
plt.show()

print("Thin-film interference in peacock barbules:")
print(f"  Layer thickness: {d_melanin} nm")
print(f"  Refractive index: {n_melanin}")
print(f"  Normal incidence peak: {peak_wavelengths[0]:.0f} nm")
print(f"  At 45 degrees peak: {peak_wavelengths[64]:.0f} nm")
print(f"  Shift: {peak_wavelengths[0] - peak_wavelengths[64]:.0f} nm (blue shift)")
print()
print("This is why peacock feathers shimmer: the dance rotates the")
print("feathers through many angles, sweeping the peak colour across")
print("the visible spectrum. Every tilt is a different colour.")`,
      challenge: 'Add a second melanin layer (double-layer stack) by multiplying the reflectance of two films with slightly different thicknesses. What happens to the spectral peaks? Multi-layer stacks sharpen the reflected colour band.',
      successHint: 'Structural colour is a convergent solution in nature: peacocks, morpho butterflies, beetle shells, and even some fruits use thin-film or photonic crystal interference. The physics is universal.',
    },
    {
      title: 'Sexual selection theory — fitness signals and honest advertising',
      concept: `Darwin proposed two mechanisms of evolution: natural selection (survive) and sexual selection (reproduce). The peacock's tail is the textbook example of sexual selection — it is a handicap in survival terms (heavy, conspicuous to predators) but an advantage in mating.

Amotz Zahavi's **handicap principle** explains the paradox: the tail is an **honest signal** precisely because it is costly. Only a genuinely fit male can afford to grow and maintain a massive, symmetrical tail while still evading predators. A weak or parasitized male cannot fake it. The signal is reliable because cheating is too expensive.

Quantitative predictions from sexual selection theory:
- **Tail symmetry** correlates with parasite resistance and genetic quality
- **Eyespot count** (ocelli) correlates with mating success — females prefer more eyespots
- **Display vigor** (how long and energetically the male dances) signals metabolic fitness
- **Feather condition** reflects nutritional status and immune function

The mathematics involves **game theory**: males invest in display up to the point where the marginal mating benefit equals the marginal survival cost. Females evolve preferences that extract maximum information about male quality from the display.`,
      analogy: 'A peacock tail is like a luxury sports car in a job interview. Anyone can claim to be successful, but only someone who actually has resources can show up in a real Ferrari. The cost of the signal guarantees its honesty. If Ferraris cost ten dollars, they would signal nothing.',
      storyConnection: 'The peacock in our story dances to impress — but the story hints that the dance is more than vanity. It is a fitness exam. Every eyespot, every symmetrical feather, every sustained display minute is biological data that peahens evaluate with statistical rigor refined over millions of years.',
      checkQuestion: 'If a mutation appeared that let weak males grow equally large tails at no extra metabolic cost, what would happen to the signaling system over evolutionary time?',
      checkAnswer: 'The signal would become unreliable. Females could no longer distinguish fit from unfit males by tail size. Over generations, female preference for large tails would weaken (no fitness benefit to choosing based on tail), and tail size would stop being under sexual selection. The honest signaling equilibrium collapses when the cost differential disappears.',
      codeIntro: 'Simulate sexual selection dynamics: male investment in display vs. survival, female choice, and the evolution of honest signaling.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Evolutionary simulation of peacock sexual selection
# Males have: genetic_quality (0-1) and display_investment (0-1)
# Display = quality * investment (can\'t fake quality)
# Survival probability decreases with display size
# Mating probability increases with display size

n_males = 200
n_generations = 100

def simulate_generation(qualities, investments, female_preference_strength):
    """One generation of sexual selection."""
    n = len(qualities)

    # Display signal = quality * investment (honest signal)
    displays = qualities * investments

    # Survival: base 0.8, penalty proportional to investment
    survival_prob = 0.8 - 0.5 * investments
    survived = np.random.random(n) < survival_prob

    if survived.sum() < 2:
        return qualities, investments, {}

    # Among survivors, mating success proportional to display^preference
    surviving_displays = displays[survived]
    surviving_qualities = qualities[survived]
    surviving_investments = investments[survived]

    # Female choice: probability proportional to display^preference_strength
    mating_scores = surviving_displays ** female_preference_strength
    mating_probs = mating_scores / mating_scores.sum()

    # Select parents weighted by mating success (with replacement)
    parents = np.random.choice(len(surviving_qualities), size=n, p=mating_probs)

    # Offspring inherit with mutation
    new_qualities = np.clip(surviving_qualities[parents] + np.random.normal(0, 0.05, n), 0.01, 1)
    new_investments = np.clip(surviving_investments[parents] + np.random.normal(0, 0.05, n), 0.01, 0.99)

    stats = {
        'mean_quality': qualities.mean(),
        'mean_investment': investments.mean(),
        'mean_display': displays.mean(),
        'survival_rate': survived.mean(),
        'display_quality_corr': np.corrcoef(displays[survived], qualities[survived])[0, 1] if survived.sum() > 2 else 0,
    }
    return new_qualities, new_investments, stats

# Run simulation with strong female preference
qualities = np.random.uniform(0.3, 0.7, n_males)
investments = np.random.uniform(0.1, 0.3, n_males)

history = {'mean_quality': [], 'mean_investment': [], 'mean_display': [],
           'survival_rate': [], 'display_quality_corr': []}

for gen in range(n_generations):
    qualities, investments, stats = simulate_generation(qualities, investments, female_preference_strength=3.0)
    if stats:
        for k in history: history[k].append(stats[k])

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Quality and investment over generations
ax = axes[0, 0]
ax.set_facecolor('#111827')
gens = range(len(history['mean_quality']))
ax.plot(gens, history['mean_quality'], color='#22c55e', linewidth=2, label='Genetic quality')
ax.plot(gens, history['mean_investment'], color='#f59e0b', linewidth=2, label='Display investment')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean value', color='white')
ax.set_title('Evolution of quality & display', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Display signal strength
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(gens, history['mean_display'], color='#a855f7', linewidth=2)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean display signal', color='white')
ax.set_title('Display signal increases', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 3: Survival rate (cost of display)
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(gens, history['survival_rate'], color='#ef4444', linewidth=2)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Survival rate', color='white')
ax.set_title('Survival cost of display', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 4: Honesty correlation
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(gens, history['display_quality_corr'], color='#3b82f6', linewidth=2)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Correlation', color='white')
ax.set_title('Signal honesty (display-quality corr)', color='white', fontsize=11)
ax.axhline(0, color='gray', linestyle='--', linewidth=1)
ax.tick_params(colors='gray')

# Plot 5: Final population scatter
ax = axes[1, 1]
ax.set_facecolor('#111827')
displays_final = qualities * investments
sc = ax.scatter(qualities, investments, c=displays_final, cmap='plasma', s=20, alpha=0.7)
ax.set_xlabel('Genetic quality', color='white')
ax.set_ylabel('Display investment', color='white')
ax.set_title('Final population (color=display)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(sc, ax=ax, label='Display signal')

# Plot 6: Compare weak vs strong preference
ax = axes[1, 2]
ax.set_facecolor('#111827')
for pref, clr, lbl in [(0.5, '#94a3b8', 'Weak preference'), (3.0, '#22c55e', 'Strong preference'), (6.0, '#ef4444', 'Extreme preference')]:
    q = np.random.uniform(0.3, 0.7, n_males)
    inv = np.random.uniform(0.1, 0.3, n_males)
    display_hist = []
    for _ in range(60):
        q, inv, st = simulate_generation(q, inv, pref)
        if st: display_hist.append(st['mean_display'])
    ax.plot(display_hist, color=clr, linewidth=2, label=lbl)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean display', color='white')
ax.set_title('Female preference strength effect', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Sexual selection simulation results:")
print(f"  Quality evolved: {history['mean_quality'][0]:.3f} -> {history['mean_quality'][-1]:.3f}")
print(f"  Display investment: {history['mean_investment'][0]:.3f} -> {history['mean_investment'][-1]:.3f}")
print(f"  Signal honesty (corr): {history['display_quality_corr'][-1]:.3f}")
print(f"  Survival cost: {history['survival_rate'][0]:.1%} -> {history['survival_rate'][-1]:.1%}")
print()
print("Key insight: sexual selection drives up both quality AND display,")
print("maintaining the honest signal. The cost (lower survival) is the")
print("price of honest advertising.")`,
      challenge: 'Add a "cheater" mutation: males that display more than their quality warrants (display = quality * investment * 1.5). Do cheaters spread through the population, or does the system self-correct? Track cheater frequency over generations.',
      successHint: 'Sexual selection is one of the most powerful forces in evolution. It explains not just peacock tails but birdsong complexity, antler size, and even some human traits. The mathematics of honest signaling applies anywhere communication costs and benefits interact.',
    },
    {
      title: 'Eyespot pattern formation — reaction-diffusion in feather development',
      concept: `Each eyespot (ocellus) on a peacock tail feather is a concentric ring pattern: a dark center surrounded by rings of blue, green, and bronze. How does a feather follicle cell know whether to produce melanin (dark) or structural colour? The answer is **reaction-diffusion**, first proposed by Alan Turing in 1952.

Two chemicals — an **activator** (A) that promotes its own production and an **inhibitor** (I) that suppresses the activator — diffuse at different rates. The inhibitor diffuses faster. This creates a pattern:
- Near the source: high A, high I, but A wins locally
- Far from source: low A, high I (inhibitor reached there first), so A is suppressed

The mathematical model (Turing equations):
dA/dt = D_A * laplacian(A) + f(A, I)
dI/dt = D_I * laplacian(I) + g(A, I)

where D_I > D_A (inhibitor diffuses faster). From a uniform state, small perturbations grow into stable patterns: spots, stripes, or rings depending on the parameters and geometry.

On a feather, the reaction-diffusion process runs along the growing barbule, creating the concentric ring pattern of each eyespot. Different parameter values at different positions create the variation between eyespots.`,
      analogy: 'Imagine dropping a stone in still water (activator). The ripple spreads outward. Now imagine a faster wave (inhibitor) chasing it and dampening the ripple. Where the ripple outran the dampener, you get a ring. Where the dampener caught up, the water is flat. This creates concentric ring patterns from a single point source.',
      storyConnection: 'The story describes the peacock\'s eyespots as "painted by the sky." In reality, they are painted by differential diffusion of morphogens — chemical signals during feather growth. Each eyespot is a frozen snapshot of a reaction-diffusion process that ran for a few days during feather development.',
      checkQuestion: 'If you doubled the diffusion rate of the inhibitor relative to the activator, what would happen to the eyespot pattern?',
      checkAnswer: 'The inhibitor would reach farther before being overwhelmed, so the rings would be spaced farther apart and the central spot would be smaller. In the extreme, the inhibitor dominates everywhere and no pattern forms at all — just a uniform feather. The ratio D_I/D_A is the key control parameter.',
      codeIntro: 'Simulate reaction-diffusion pattern formation to generate eyespot-like ring patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 2D Reaction-Diffusion simulation (Gray-Scott model variant)
# Produces eyespot-like ring patterns

def reaction_diffusion_eyespot(size=100, steps=5000, Da=0.16, Di=0.08, f=0.035, k=0.065):
    """Simulate reaction-diffusion to form ring patterns."""
    # Initialize concentrations
    A = np.ones((size, size))  # activator (U in Gray-Scott)
    I = np.zeros((size, size))  # inhibitor (V in Gray-Scott)

    # Seed center with inhibitor (the eyespot source)
    cx, cy = size // 2, size // 2
    r = 3
    A[cx-r:cx+r, cy-r:cy+r] = 0.5
    I[cx-r:cx+r, cy-r:cy+r] = 0.25

    dt = 1.0
    snapshots = []
    snapshot_steps = [0, 500, 1500, 3000, 5000]

    for step in range(steps + 1):
        if step in snapshot_steps:
            snapshots.append((step, I.copy()))

        # Laplacian via convolution (5-point stencil)
        lapA = (np.roll(A, 1, 0) + np.roll(A, -1, 0) +
                np.roll(A, 1, 1) + np.roll(A, -1, 1) - 4 * A)
        lapI = (np.roll(I, 1, 0) + np.roll(I, -1, 0) +
                np.roll(I, 1, 1) + np.roll(I, -1, 1) - 4 * I)

        # Gray-Scott reaction terms
        reaction = A * I * I
        dA = Da * lapA - reaction + f * (1 - A)
        dI = Di * lapI + reaction - (f + k) * I

        A += dA * dt
        I += dI * dt

        A = np.clip(A, 0, 1)
        I = np.clip(I, 0, 1)

    return snapshots

# Run simulation
snapshots = reaction_diffusion_eyespot(size=120, steps=5000)

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

# Plot time evolution
for idx, (step, pattern) in enumerate(snapshots):
    if idx >= 5: break
    ax = axes.flat[idx]
    ax.set_facecolor('#111827')
    # Use peacock-like colormap
    im = ax.imshow(pattern, cmap='YlGnBu_r', origin='lower', vmin=0, vmax=0.35)
    ax.set_title(f'Step {step}', color='white', fontsize=11)
    ax.tick_params(colors='gray')

# Plot 6: Cross-section through final pattern
ax = axes[1, 2]
ax.set_facecolor('#111827')
final = snapshots[-1][1]
mid = final.shape[0] // 2
profile = final[mid, :]
x = np.arange(len(profile)) - len(profile) // 2

ax.fill_between(x, profile, alpha=0.3, color='#22c55e')
ax.plot(x, profile, color='#22c55e', linewidth=2)
ax.set_xlabel('Distance from center (pixels)', color='white')
ax.set_ylabel('Inhibitor concentration', color='white')
ax.set_title('Radial profile (eyespot cross-section)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Mark ring positions
peaks = []
for i in range(1, len(profile) - 1):
    if profile[i] > profile[i-1] and profile[i] > profile[i+1] and profile[i] > 0.05:
        peaks.append(i)
        ax.axvline(x[i], color='#f59e0b', linestyle='--', alpha=0.5, linewidth=1)

plt.tight_layout()
plt.show()

print("Reaction-diffusion eyespot simulation:")
print(f"  Grid size: 120 x 120")
print(f"  Time steps: 5000")
print(f"  Ring peaks found: {len(peaks)}")
if len(peaks) >= 2:
    spacings = [abs(x[peaks[i+1]] - x[peaks[i]]) for i in range(len(peaks)-1)]
    print(f"  Ring spacings: {spacings}")
    print(f"  Mean ring spacing: {np.mean(spacings):.1f} pixels")
print()
print("The Turing mechanism creates ordered patterns from randomness.")
print("Spots, stripes, and rings all emerge from the same equations")
print("with different parameters. This is how nature 'paints' feathers.")`,
      challenge: 'Change the parameters f and k to see different pattern types. Try f=0.04, k=0.06 for spots instead of rings. Map out the parameter space by running multiple simulations.',
      successHint: 'Turing patterns appear everywhere in biology: leopard spots, zebra stripes, fish scale patterns, and fingerprints. The same math that produces peacock eyespots also explains why your fingertips have whorls.',
    },
    {
      title: 'Display behavior optimization — game theory of courtship',
      concept: `A male peacock faces an optimization problem every breeding season: how much energy to invest in display? Too little display and he attracts no mates. Too much and he dies before the season ends. The optimal strategy depends on what other males are doing — this is a **game theory** problem.

The key framework is the **evolutionary stable strategy (ESS)**. An ESS is a strategy that, once adopted by a population, cannot be invaded by a mutant playing a different strategy. For courtship display:

- If all males display at low intensity, a mutant displaying high wins all matings (low is not ESS)
- If all males display at maximum, a mutant conserving energy survives longer and mates with late females (max is not ESS)
- The ESS is a mixed strategy: display at a level where marginal mating gain equals marginal survival cost

This is formalized as:
- Payoff(display level d) = mating_success(d) - survival_cost(d)
- At ESS: d(mating_success)/dd = d(survival_cost)/dd

The ESS also depends on **population density** (more competitors = need more display), **female arrival pattern** (synchronous vs. spread out), and **predator pressure** (more predators = higher display cost).`,
      analogy: 'It is like bidding in an auction where you pay your bid whether you win or not (an all-pay auction). Bid too low and you never win. Bid too high and winning costs more than the prize is worth. The optimal bid depends on how many others are bidding and how much they are willing to pay.',
      storyConnection: 'In the story, the peacock does not simply dance at maximum intensity all day. He times his displays, adjusts his energy, and reads the responses. This is not mindless behavior but an evolved optimization algorithm running the game-theoretic calculation in real time.',
      checkQuestion: 'In a population where predators have been removed (e.g., a protected sanctuary), what would you predict happens to peacock display intensity over many generations?',
      checkAnswer: 'With predators removed, the survival cost of display drops dramatically. The ESS shifts toward higher display intensity because males can afford more elaborate tails and longer displays. Over generations, tails would get larger and displays more vigorous — until some other cost (energy, parasites, physical limits) creates a new equilibrium. This is called "relaxed selection" on predator avoidance.',
      codeIntro: 'Simulate game-theoretic courtship optimization to find the evolutionarily stable display strategy.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Game theory model of peacock display optimization
def mating_success(display, competitors_display, female_preference=2.0):
    """Probability of mating given own display and competitors' displays."""
    all_displays = np.append(competitors_display, display)
    scores = all_displays ** female_preference
    return scores[-1] / scores.sum()

def survival_probability(display, predator_pressure=1.0):
    """Survival decreases with display intensity."""
    return np.exp(-predator_pressure * display)

def fitness(display, competitors_display, predator_pressure=1.0):
    """Total fitness = mating * survival."""
    m = mating_success(display, competitors_display)
    s = survival_probability(display, predator_pressure)
    return m * s

# Find ESS by simulation
def find_ess(n_males=20, n_gens=200, predator_pressure=1.0, mutation_rate=0.05):
    """Evolve population to find ESS display level."""
    displays = np.random.uniform(0.1, 0.5, n_males)
    history = []

    for gen in range(n_gens):
        # Calculate fitness for each male
        fitnesses = np.zeros(n_males)
        for i in range(n_males):
            others = np.delete(displays, i)
            fitnesses[i] = fitness(displays[i], others, predator_pressure)

        history.append({
            'mean_display': displays.mean(),
            'std_display': displays.std(),
            'mean_fitness': fitnesses.mean(),
            'max_display': displays.max(),
            'min_display': displays.min(),
        })

        # Selection: reproduce proportional to fitness
        fitnesses = np.maximum(fitnesses, 1e-10)
        probs = fitnesses / fitnesses.sum()
        parents = np.random.choice(n_males, size=n_males, p=probs)
        displays = displays[parents] + np.random.normal(0, mutation_rate, n_males)
        displays = np.clip(displays, 0.01, 2.0)

    return history, displays

# Run for different predator pressures
fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

pressures = [0.3, 1.0, 2.0]
ess_values = []

for idx, pp in enumerate(pressures):
    hist, final_displays = find_ess(predator_pressure=pp)
    ess_values.append(np.mean([h['mean_display'] for h in hist[-20:]]))

    ax = axes[0, idx]
    ax.set_facecolor('#111827')
    gens = range(len(hist))
    means = [h['mean_display'] for h in hist]
    stds = [h['std_display'] for h in hist]
    ax.plot(gens, means, color='#22c55e', linewidth=2)
    ax.fill_between(gens,
                     [m - s for m, s in zip(means, stds)],
                     [m + s for m, s in zip(means, stds)],
                     alpha=0.2, color='#22c55e')
    ax.set_xlabel('Generation', color='white')
    ax.set_ylabel('Display intensity', color='white')
    ax.set_title(f'Predator pressure = {pp}', color='white', fontsize=11)
    ax.tick_params(colors='gray')

# Plot 4: ESS vs predator pressure
ax = axes[1, 0]
ax.set_facecolor('#111827')
pp_range = np.linspace(0.1, 3.0, 15)
ess_curve = []
for pp in pp_range:
    h, _ = find_ess(n_males=15, n_gens=100, predator_pressure=pp)
    ess_curve.append(np.mean([hh['mean_display'] for hh in h[-20:]]))
ax.plot(pp_range, ess_curve, 'o-', color='#f59e0b', linewidth=2, markersize=5)
ax.set_xlabel('Predator pressure', color='white')
ax.set_ylabel('ESS display level', color='white')
ax.set_title('More predators = less display', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 5: Fitness landscape for different population strategies
ax = axes[1, 1]
ax.set_facecolor('#111827')
d_range = np.linspace(0.01, 2.0, 100)
for pop_mean, clr, lbl in [(0.3, '#3b82f6', 'Low pop display'), (0.7, '#22c55e', 'Mid pop display'), (1.2, '#ef4444', 'High pop display')]:
    competitors = np.random.normal(pop_mean, 0.1, 19)
    competitors = np.clip(competitors, 0.01, 2.0)
    fit_curve = [fitness(d, competitors, 1.0) for d in d_range]
    ax.plot(d_range, fit_curve, color=clr, linewidth=2, label=lbl)
    best_d = d_range[np.argmax(fit_curve)]
    ax.axvline(best_d, color=clr, linestyle='--', alpha=0.5)
ax.set_xlabel('Your display level', color='white')
ax.set_ylabel('Fitness', color='white')
ax.set_title('Best response depends on others', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Population distribution at ESS
ax = axes[1, 2]
ax.set_facecolor('#111827')
_, final = find_ess(n_males=100, n_gens=300, predator_pressure=1.0)
ax.hist(final, bins=20, color='#a855f7', edgecolor='none', alpha=0.8)
ax.axvline(final.mean(), color='#f59e0b', linewidth=2, linestyle='--', label=f'ESS = {final.mean():.2f}')
ax.set_xlabel('Display intensity', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Population at ESS equilibrium', color='white', fontsize=11)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Game theory of courtship display:")
for pp, ess in zip(pressures, ess_values):
    print(f"  Predator pressure {pp}: ESS display = {ess:.3f}")
print()
print("Key insight: the optimal display is NOT maximum.")
print("It is the Nash equilibrium where no male benefits")
print("from unilaterally changing his strategy.")`,
      challenge: 'Add female choice as an evolving trait: females have a "preference strength" gene that also mutates. Do preferences and displays co-evolve in a runaway process (Fisherian runaway selection)?',
      successHint: 'Game theory in biology is called evolutionary game theory. It explains not just courtship but aggression, cooperation, parasitism, and even bacterial communication. Any time organisms interact, game theory applies.',
    },
    {
      title: 'Feather symmetry measurement — fluctuating asymmetry as fitness proxy',
      concept: `Bilateral organisms are supposed to be symmetric — left and right sides develop from the same genome. But development is noisy: random perturbations from parasites, nutritional stress, and temperature fluctuations cause small deviations from perfect symmetry. This is called **fluctuating asymmetry (FA)**.

FA is measured as: FA = |Left - Right| / ((Left + Right) / 2)

The key insight: organisms with better genes and fewer stressors during development show LESS fluctuating asymmetry. FA is an **honest signal of developmental stability** — you cannot fake symmetric development.

In peacocks, researchers measure:
- **Eyespot count asymmetry**: |left_eyespots - right_eyespots|
- **Feather length asymmetry**: |left_tail_length - right_tail_length|
- **Eyespot size asymmetry**: average |left_spot_diameter - right_spot_diameter|

Studies show peahens prefer males with lower FA. A male with 150 eyespots but high asymmetry loses to a male with 140 eyespots and perfect symmetry. The female is not just counting spots — she is reading the developmental precision encoded in the pattern.

Statistical analysis of FA requires careful methodology: you must distinguish FA (random, normally distributed around zero) from directional asymmetry (consistent bias) and antisymmetry (bimodal distribution).`,
      analogy: 'Fluctuating asymmetry is like handwriting quality. Anyone can write a letter, but writing identically with both hands requires extraordinary neural precision. Sloppy development is like sloppy handwriting — it reveals that the underlying system is under stress or lacks fine control.',
      storyConnection: 'When the peahen in the story watches the dance, she is not mesmerized by the flash of colour alone. She is performing a high-speed symmetry assessment — comparing left and right eyespots, checking alignment, measuring the precision of the display. Evolution has made her an expert quality-control inspector.',
      checkQuestion: 'A researcher measures FA in a captive peacock population that is well-fed and parasite-free. Would you expect higher or lower FA compared to a wild population, and why?',
      checkAnswer: 'Lower FA. Environmental stressors (parasites, poor nutrition, temperature extremes) increase developmental noise. A stress-free captive environment reduces perturbations, so development proceeds more symmetrically. However, genetic quality differences would still cause FA variation — captive birds with bad genes would still show more asymmetry than those with good genes. FA reflects both genetic and environmental components.',
      codeIntro: 'Analyze fluctuating asymmetry in simulated peacock feather data, correlate with fitness indicators, and build a statistical test for FA significance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate peacock feather measurement data
n_birds = 150

# Genetic quality (hidden variable)
quality = np.random.beta(3, 2, n_birds)  # skewed toward higher quality

# Environmental stress (hidden variable)
stress = np.random.exponential(0.3, n_birds)

# Developmental noise = f(quality, stress) — lower quality & more stress = more noise
dev_noise = (1 - quality) * 0.3 + stress * 0.2

# Generate bilateral measurements
# Left and right eyespot counts (mean ~80 for high quality birds)
mean_eyespots = 60 + 40 * quality
left_eyespots = np.round(mean_eyespots + np.random.normal(0, dev_noise * 10, n_birds)).astype(int)
right_eyespots = np.round(mean_eyespots + np.random.normal(0, dev_noise * 10, n_birds)).astype(int)

# Tail feather lengths (cm)
mean_length = 120 + 30 * quality
left_length = mean_length + np.random.normal(0, dev_noise * 5, n_birds)
right_length = mean_length + np.random.normal(0, dev_noise * 5, n_birds)

# Compute FA indices
fa_eyespots = np.abs(left_eyespots - right_eyespots)
fa_length = np.abs(left_length - right_length) / ((left_length + right_length) / 2) * 100  # percent

# Composite FA score
fa_composite = (fa_eyespots / fa_eyespots.std() + fa_length / fa_length.std()) / 2

# Mating success (simulated: proportional to quality, inversely to FA)
mating_score = quality * 2 - fa_composite * 0.3 + np.random.normal(0, 0.2, n_birds)
mating_score = np.clip(mating_score, 0, None)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Left vs Right eyespots
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.scatter(left_eyespots, right_eyespots, c=quality, cmap='viridis', s=15, alpha=0.7)
ax.plot([40, 110], [40, 110], '--', color='#ef4444', linewidth=2, label='Perfect symmetry')
ax.set_xlabel('Left eyespots', color='white')
ax.set_ylabel('Right eyespots', color='white')
ax.set_title('Bilateral eyespot counts', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: FA distribution (should be half-normal if true FA)
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.hist(fa_eyespots, bins=20, color='#a855f7', edgecolor='none', alpha=0.8)
ax.set_xlabel('|Left - Right| eyespots', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('FA distribution (should be half-normal)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Check for directional asymmetry
diff = left_eyespots - right_eyespots
ax2 = axes[0, 2]
ax2.set_facecolor('#111827')
ax2.hist(diff, bins=25, color='#3b82f6', edgecolor='none', alpha=0.8)
ax2.axvline(0, color='#ef4444', linewidth=2, linestyle='--')
ax2.axvline(diff.mean(), color='#f59e0b', linewidth=2, label=f'Mean = {diff.mean():.2f}')
ax2.set_xlabel('Left - Right (signed)', color='white')
ax2.set_ylabel('Count', color='white')
ax2.set_title('Directional asymmetry test', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 4: FA vs genetic quality
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.scatter(quality, fa_composite, c=stress, cmap='YlOrRd', s=15, alpha=0.7)
z = np.polyfit(quality, fa_composite, 1)
p = np.poly1d(z)
x_line = np.linspace(quality.min(), quality.max(), 100)
ax.plot(x_line, p(x_line), color='#22c55e', linewidth=2)
r = np.corrcoef(quality, fa_composite)[0, 1]
ax.set_xlabel('Genetic quality', color='white')
ax.set_ylabel('Composite FA score', color='white')
ax.set_title(f'FA vs quality (r={r:.3f})', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 5: FA vs mating success
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.scatter(fa_composite, mating_score, c=quality, cmap='viridis', s=15, alpha=0.7)
r_mate = np.corrcoef(fa_composite, mating_score)[0, 1]
ax.set_xlabel('Composite FA score', color='white')
ax.set_ylabel('Mating success', color='white')
ax.set_title(f'FA predicts mating (r={r_mate:.3f})', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: Quality, FA, and mating in 3D projection
ax = axes[1, 2]
ax.set_facecolor('#111827')
# Sort by mating success and show top/bottom quartiles
top_q = np.percentile(mating_score, 75)
bot_q = np.percentile(mating_score, 25)
top = mating_score >= top_q
bot = mating_score <= bot_q
ax.scatter(quality[bot], fa_composite[bot], c='#ef4444', s=20, alpha=0.6, label='Low mating')
ax.scatter(quality[top], fa_composite[top], c='#22c55e', s=20, alpha=0.6, label='High mating')
ax.set_xlabel('Genetic quality', color='white')
ax.set_ylabel('FA score', color='white')
ax.set_title('Top vs bottom mating quartiles', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fluctuating Asymmetry Analysis:")
print(f"  Mean FA (eyespots): {fa_eyespots.mean():.2f} +/- {fa_eyespots.std():.2f}")
print(f"  Mean FA (length): {fa_length.mean():.2f}% +/- {fa_length.std():.2f}%")
print(f"  FA-Quality correlation: r = {r:.3f} (negative = better quality -> less FA)")
print(f"  FA-Mating correlation: r = {r_mate:.3f} (negative = less FA -> more mating)")
print(f"  Directional asymmetry: mean L-R = {diff.mean():.2f} (should be ~0)")
print()
print("FA is a window into developmental precision.")
print("Peahens are essentially measuring the signal-to-noise")
print("ratio of male development. Low FA = high precision = good genes.")`,
      challenge: 'Simulate the effect of an environmental stressor (e.g., a drought year) on FA across the population. Show that FA increases population-wide during stress, demonstrating its value as a population health indicator.',
      successHint: 'Fluctuating asymmetry is used not just in sexual selection research but in conservation biology. High FA in a population can be an early warning signal of environmental degradation — before population decline becomes visible.',
    },
    {
      title: 'Multi-trait preference models — peahens as multi-criteria decision makers',
      concept: `Peahens do not evaluate a single trait. They assess multiple signals simultaneously: eyespot count, tail symmetry, display duration, call frequency, body condition, and territory quality. This is a **multi-criteria decision problem**.

How do you combine multiple criteria into a single decision? There are several mathematical frameworks:

1. **Weighted linear model**: Score = w1*trait1 + w2*trait2 + ... + wn*traitn. Simple but assumes traits are independent and effects are additive.

2. **Threshold model**: A male must exceed minimum thresholds on ALL traits (sequential screening). Fail any one and he is rejected regardless of others.

3. **Multiplicative model**: Score = trait1^w1 * trait2^w2 * ... Ensures that zero on any trait gives zero overall — no single trait can compensate for absence of another.

4. **Best-of-n model**: The female samples n males and picks the best. This does not require absolute evaluation — just relative comparison.

Empirical evidence suggests peahens use a combination: threshold screening first (reject males below minimum quality), then weighted comparison among remaining candidates. The weights are not fixed — they shift with female condition (hungry females weight territory quality more) and population composition (rare trait types may get a novelty bonus).`,
      analogy: 'A peahen choosing a mate is like a hiring committee reviewing job candidates. First, filter out anyone missing required qualifications (thresholds). Then, among qualified candidates, score them on multiple dimensions with different weights. The final choice is a composite ranking, not a single-metric sort.',
      storyConnection: 'The story describes the peacock working to perfect every aspect of his display — not just the tail fan, but the rhythm, the calls, the posture. He intuitively knows that the peahen is a multi-criteria evaluator. Excelling on one dimension while failing another means rejection.',
      checkQuestion: 'A male scores top 10% in eyespot count but bottom 30% in display duration. Under a threshold model vs. a weighted linear model, would the outcome differ?',
      checkAnswer: 'Under a threshold model, if his display duration falls below the minimum threshold, he is rejected immediately — his excellent eyespots cannot compensate. Under a weighted linear model, his high eyespot score could compensate for low duration if the eyespot weight is large enough. The two models make fundamentally different predictions about trait compensation.',
      codeIntro: 'Implement and compare multi-criteria mate choice models: linear, threshold, multiplicative, and best-of-n.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate male peacock trait data
n_males = 500

# 5 traits: eyespots, symmetry, display_duration, call_quality, body_condition
# All normalized to 0-1 scale
traits = {
    'Eyespots': np.random.beta(5, 2, n_males),
    'Symmetry': np.random.beta(4, 3, n_males),
    'Display duration': np.random.beta(3, 3, n_males),
    'Call quality': np.random.beta(3, 4, n_males),
    'Body condition': np.random.beta(4, 2, n_males),
}
trait_names = list(traits.keys())
trait_matrix = np.column_stack(list(traits.values()))

# Model 1: Weighted linear
weights_linear = np.array([0.35, 0.25, 0.15, 0.10, 0.15])
scores_linear = trait_matrix @ weights_linear

# Model 2: Threshold + rank
thresholds = np.array([0.3, 0.3, 0.2, 0.15, 0.25])
passes_threshold = np.all(trait_matrix >= thresholds, axis=1)
scores_threshold = np.where(passes_threshold, scores_linear, -1)

# Model 3: Multiplicative (geometric mean with weights)
log_traits = np.log(np.clip(trait_matrix, 0.01, 1))
scores_multiplicative = np.exp(log_traits @ weights_linear)

# Model 4: Best-of-n (sample 5 males, pick best by linear score)
def best_of_n(scores, n_sample=5, n_females=200):
    chosen = np.zeros(n_females, dtype=int)
    for i in range(n_females):
        candidates = np.random.choice(len(scores), size=n_sample, replace=False)
        chosen[i] = candidates[np.argmax(scores[candidates])]
    return chosen

chosen_linear = best_of_n(scores_linear)
chosen_mult = best_of_n(scores_multiplicative)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Model score distributions
ax = axes[0, 0]
ax.set_facecolor('#111827')
for scores, clr, lbl in [(scores_linear, '#22c55e', 'Linear'),
                          (scores_multiplicative, '#3b82f6', 'Multiplicative')]:
    ax.hist(scores, bins=30, color=clr, alpha=0.5, edgecolor='none', label=lbl)
ax.set_xlabel('Score', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Score distributions by model', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Threshold filtering
ax = axes[0, 1]
ax.set_facecolor('#111827')
n_pass = passes_threshold.sum()
n_fail = (~passes_threshold).sum()
bars = ax.bar(['Pass', 'Fail'], [n_pass, n_fail], color=['#22c55e', '#ef4444'], width=0.5)
for bar, val in zip(bars, [n_pass, n_fail]):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,
            str(val), ha='center', color='white', fontweight='bold')
ax.set_ylabel('Number of males', color='white')
ax.set_title(f'Threshold screening ({n_pass} pass of {n_males})', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 3: Linear vs Multiplicative scores
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.scatter(scores_linear, scores_multiplicative, s=8, alpha=0.4, c='#a855f7')
r = np.corrcoef(scores_linear, scores_multiplicative)[0, 1]
ax.set_xlabel('Linear score', color='white')
ax.set_ylabel('Multiplicative score', color='white')
ax.set_title(f'Model agreement (r={r:.3f})', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Highlight disagreement cases
disagreements = np.argsort(scores_linear)[-20:]  # top 20 by linear
mult_ranks = np.argsort(np.argsort(scores_multiplicative))[::-1]
for idx in disagreements:
    if mult_ranks[idx] > 50:  # ranked low by multiplicative
        ax.scatter(scores_linear[idx], scores_multiplicative[idx],
                  s=40, color='#ef4444', zorder=5)

# Plot 4: Trait profiles of top males under each model
ax = axes[1, 0]
ax.set_facecolor('#111827')
top_linear = np.argsort(scores_linear)[-1]
top_mult = np.argsort(scores_multiplicative)[-1]
x_pos = np.arange(len(trait_names))
width = 0.35
ax.bar(x_pos - width/2, trait_matrix[top_linear], width, color='#22c55e', label='Top linear')
ax.bar(x_pos + width/2, trait_matrix[top_mult], width, color='#3b82f6', label='Top multiplicative')
ax.set_xticks(x_pos)
ax.set_xticklabels([t[:8] for t in trait_names], rotation=30, fontsize=8, color='white')
ax.set_ylabel('Trait value', color='white')
ax.set_title('Top male: linear vs multiplicative', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Mating distribution under best-of-5
ax = axes[1, 1]
ax.set_facecolor('#111827')
unique, counts = np.unique(chosen_linear, return_counts=True)
ax.bar(range(len(counts)), np.sort(counts)[::-1][:50], color='#f59e0b', edgecolor='none')
ax.set_xlabel('Male rank (by times chosen)', color='white')
ax.set_ylabel('Times chosen (of 200 females)', color='white')
ax.set_title('Best-of-5: highly skewed mating', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: Weight sensitivity analysis
ax = axes[1, 2]
ax.set_facecolor('#111827')
# Vary eyespot weight, redistribute rest proportionally
eyespot_ws = np.linspace(0.05, 0.8, 30)
top10_overlap = []
base_top10 = set(np.argsort(scores_linear)[-50:])
for ew in eyespot_ws:
    remaining = 1 - ew
    w = np.array([ew, 0.25, 0.15, 0.10, 0.15])
    w[1:] = w[1:] / w[1:].sum() * remaining
    s = trait_matrix @ w
    new_top10 = set(np.argsort(s)[-50:])
    top10_overlap.append(len(base_top10 & new_top10) / 50)
ax.plot(eyespot_ws, top10_overlap, color='#ef4444', linewidth=2)
ax.set_xlabel('Eyespot weight', color='white')
ax.set_ylabel('Overlap with base top-50', color='white')
ax.set_title('How weight changes shift rankings', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Multi-criteria mate choice comparison:")
print(f"  Threshold screening: {n_pass}/{n_males} males pass ({n_pass/n_males:.0%})")
print(f"  Linear-Multiplicative correlation: r = {r:.3f}")
print(f"  Top male (linear) traits: {trait_matrix[top_linear].round(2)}")
print(f"  Top male (multiplicative) traits: {trait_matrix[top_mult].round(2)}")
print()
print("The multiplicative model penalizes weakness in ANY trait more")
print("than the linear model. This is why 'well-rounded' males win under")
print("multiplicative evaluation even if they lack a single standout trait.")`,
      challenge: 'Add a "novelty" factor: females prefer rare trait combinations (measured by distance to population centroid in trait space). How does this change which males succeed? Does it maintain genetic diversity?',
      successHint: 'Multi-criteria decision theory connects biology to operations research, economics, and AI. The same mathematics used to rank peacocks is used in recommendation systems, college admissions, and stock portfolio optimization.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Computational Scientist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (biology and physics fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for computational biology and optics simulations. Click to start.</p>
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
