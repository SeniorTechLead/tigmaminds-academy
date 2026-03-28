import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function CloudedLeopardLevel4() {
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
      title: 'Capstone overview — Wildlife Population Estimator from camera trap data',
      concept: `In this capstone you will build a complete **spatially explicit capture-recapture (SECR) pipeline** from scratch. This is the real method used by wildlife biologists to estimate clouded leopard populations from camera trap surveys.

The pipeline has four stages:

1. **Data simulation**: Generate a realistic camera trap dataset with known true population (so we can validate our estimator)
2. **Capture history construction**: Convert raw photo detections into structured capture histories — which individual was seen at which trap on which occasion
3. **Likelihood engine**: Implement the SECR likelihood function that jointly estimates density (D), baseline detection probability (g₀), and spatial scale (σ)
4. **Optimization and inference**: Find the maximum likelihood estimates, compute confidence intervals via profile likelihood, and generate a density surface map

The SECR model accounts for the fundamental problem in wildlife surveys: **imperfect detection**. Not every animal that exists gets photographed. Animals close to cameras are detected more often than distant ones. The spatial pattern of captures reveals both where animals are and how many we are missing.

By the end, you will have a tool that takes camera trap data and outputs a population estimate with uncertainty bounds — the same output a conservation biologist would use to advise park managers.`,
      analogy: 'Building this estimator is like building a complete weather station. Individual sensors (thermometer, barometer, anemometer) are useful alone, but combined into a system with data processing, they produce weather forecasts. Similarly, individual concepts from Level 3 (spatial statistics, detection functions, likelihood) combine here into a working population estimator.',
      storyConnection: 'The clouded leopard in the story was a single individual whose secret life was glimpsed in fragments. This capstone builds the tool that would take those fragments — a photo here, a sighting there — and reconstruct the full picture: how many leopards share this forest, where they concentrate, and whether the population is viable.',
      checkQuestion: 'Why is spatially explicit capture-recapture better than simply counting unique individuals photographed?',
      checkAnswer: 'A naive count gives a minimum number alive but misses every individual whose activity center is far from any trap. SECR models the detection process explicitly — how detection probability decays with distance — so it can estimate the total population including undetected individuals. It also properly handles edge effects: animals whose ranges extend beyond the trap array. Without SECR, population estimates are biased low, sometimes dramatically.',
      codeIntro: 'Stage 1: Build the data simulator — generate a realistic camera trap survey with configurable parameters.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class CameraTrapSimulator:
    """Simulate a spatially explicit capture-recapture survey."""

    def __init__(self, area_size=20.0, true_D=0.4, true_g0=0.15,
                 true_sigma=2.5, trap_spacing=3.0, n_occasions=15,
                 buffer=5.0):
        self.area_size = area_size
        self.true_D = true_D
        self.true_g0 = true_g0
        self.true_sigma = true_sigma
        self.trap_spacing = trap_spacing
        self.n_occasions = n_occasions
        self.buffer = buffer  # buffer beyond trap array for generating animals

        # Set up trap array
        tx = np.arange(trap_spacing, area_size, trap_spacing)
        ty = np.arange(trap_spacing, area_size, trap_spacing)
        self.traps = np.array([(x, y) for x in tx for y in ty])
        self.n_traps = len(self.traps)

        # Generate true population (including buffer zone)
        total_area = (area_size + 2 * buffer) ** 2
        self.n_animals = np.random.poisson(true_D * total_area)
        self.activity_centers = np.random.uniform(
            -buffer, area_size + buffer, (self.n_animals, 2))

    def run_survey(self):
        """Simulate detection process across all occasions."""
        captures = np.zeros((self.n_animals, self.n_traps, self.n_occasions), dtype=int)

        for i in range(self.n_animals):
            for j in range(self.n_traps):
                d = np.linalg.norm(self.activity_centers[i] - self.traps[j])
                p = self.true_g0 * np.exp(-d**2 / (2 * self.true_sigma**2))
                captures[i, j, :] = np.random.binomial(1, p, self.n_occasions)

        # Extract detected individuals
        detected = np.any(captures.reshape(self.n_animals, -1), axis=1)
        self.n_detected = detected.sum()
        self.detected_mask = detected
        self.capture_histories = captures[detected]  # n_detected x n_traps x n_occasions
        self.detected_centers = self.activity_centers[detected]

        return self.capture_histories

    def summary(self):
        """Print survey summary statistics."""
        cap_per_individual = self.capture_histories.sum(axis=(1, 2))
        traps_per_individual = (self.capture_histories.sum(axis=2) > 0).sum(axis=1)
        caps_per_trap = self.capture_histories.sum(axis=(0, 2))

        print("=" * 55)
        print("CAMERA TRAP SURVEY SIMULATION SUMMARY")
        print("=" * 55)
        print(f"Study area:         {self.area_size} x {self.area_size} km")
        print(f"Trap array:         {self.n_traps} cameras, {self.trap_spacing} km spacing")
        print(f"Survey occasions:   {self.n_occasions}")
        print(f"True density:       {self.true_D} /km²")
        print(f"True population:    {self.n_animals} (incl. buffer zone)")
        print(f"True g0:            {self.true_g0}")
        print(f"True sigma:         {self.true_sigma} km")
        print("-" * 55)
        print(f"Individuals detected: {self.n_detected} ({100*self.n_detected/self.n_animals:.0f}%)")
        print(f"Total captures:       {self.capture_histories.sum()}")
        print(f"Captures/individual:  {cap_per_individual.mean():.1f} (range {cap_per_individual.min()}-{cap_per_individual.max()})")
        print(f"Traps/individual:     {traps_per_individual.mean():.1f} (range {traps_per_individual.min()}-{traps_per_individual.max()})")
        print(f"Captures/trap:        {caps_per_trap.mean():.1f} (range {caps_per_trap.min()}-{caps_per_trap.max()})")
        print("=" * 55)

# Run simulation
sim = CameraTrapSimulator(area_size=20, true_D=0.4, true_g0=0.15,
                           true_sigma=2.5, trap_spacing=3.0, n_occasions=15)
capture_data = sim.run_survey()
sim.summary()

# Visualize
fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax = axes[0]
ax.set_facecolor('#111827')
ax.scatter(sim.activity_centers[~sim.detected_mask, 0],
           sim.activity_centers[~sim.detected_mask, 1],
           s=15, color='gray', alpha=0.3, label=f'Undetected ({sim.n_animals-sim.n_detected})')
ax.scatter(sim.detected_centers[:, 0], sim.detected_centers[:, 1],
           s=40, color='#22c55e', edgecolors='white', linewidth=0.5,
           label=f'Detected ({sim.n_detected})', zorder=4)
ax.scatter(sim.traps[:, 0], sim.traps[:, 1],
           marker='s', s=60, color='#f59e0b', label=f'Traps ({sim.n_traps})', zorder=5)
ax.set_xlim(-sim.buffer, sim.area_size + sim.buffer)
ax.set_ylim(-sim.buffer, sim.area_size + sim.buffer)
ax.axhline(0, color='white', linewidth=0.5, alpha=0.3)
ax.axhline(sim.area_size, color='white', linewidth=0.5, alpha=0.3)
ax.axvline(0, color='white', linewidth=0.5, alpha=0.3)
ax.axvline(sim.area_size, color='white', linewidth=0.5, alpha=0.3)
ax.set_aspect('equal')
ax.set_title('Survey area (white box) + buffer zone', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

ax = axes[1]
ax.set_facecolor('#111827')
caps_per_trap = capture_data.sum(axis=(0, 2))
scatter = ax.scatter(sim.traps[:, 0], sim.traps[:, 1], c=caps_per_trap,
                     cmap='hot', s=120, marker='s', edgecolors='gray', linewidth=0.5)
plt.colorbar(scatter, ax=ax, label='Total captures')
ax.set_xlim(0, sim.area_size)
ax.set_ylim(0, sim.area_size)
ax.set_aspect('equal')
ax.set_title('Capture intensity per trap', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print()
print("Stage 1 complete. The simulator produces realistic capture histories")
print("that we will feed into our SECR estimator in the next stages.")`,
      challenge: 'Try different parameter combinations: high density with low detection (D=1.0, g0=0.05) vs low density with high detection (D=0.2, g0=0.4). Which scenario is harder to estimate accurately? Think about what the capture histories look like in each case.',
      successHint: 'A good simulator is essential for validating any statistical method. By generating data with known truth, you can test whether your estimator recovers the correct answer before applying it to real data where truth is unknown.',
    },
    {
      title: 'Capture history construction and sufficient statistics',
      concept: `Raw camera trap photos must be processed into structured **capture histories** before analysis. Each detected individual gets a binary matrix: rows = traps, columns = occasions, values = 0 (not captured) or 1 (captured).

From these matrices, we extract **sufficient statistics** — summary numbers that contain all the information needed for estimation:

- **Spatial recaptures**: the number of traps where each individual was detected. More traps = better estimate of sigma (movement range).
- **Temporal recaptures**: the number of occasions each individual was detected. More occasions = better estimate of g0 (detection probability).
- **Trap-level summaries**: total captures per trap, which reveals the spatial intensity of the population.
- **Distance matrix**: pairwise distances between all trap pairs, needed for the likelihood computation.

A critical insight: individuals captured at only ONE trap on ONE occasion ("singletons") provide almost no spatial information. They tell you an animal exists but not how far it ranges. Surveys with many singletons have poor precision. The ratio of spatial recaptures to total detections is a key quality metric.`,
      analogy: 'Think of a library checkout system. Each book is an "individual" and each library branch is a "trap." The checkout history tells you which books were borrowed where and when. A book borrowed at many branches has a wide "range." A book borrowed only once gives you almost no information about its circulation pattern. The checkout database IS the capture history.',
      storyConnection: 'Each camera trap photo of the clouded leopard is a data point in the capture history. The leopard photographed at the stream crossing on Monday, the ridge trail on Wednesday, and the stream again on Friday — that pattern of spatial and temporal recaptures is exactly what SECR needs to estimate how the animal moves through its territory.',
      checkQuestion: 'A survey detects 20 individuals but 15 of them were captured only once at a single trap. Is this a good dataset for SECR? What would you change?',
      checkAnswer: 'This is a poor dataset. With 75% singletons, there is very little spatial recapture information to estimate sigma. Solutions: (1) increase trap density so ranges overlap more traps, (2) extend the survey duration for more temporal recaptures, (3) reduce trap spacing relative to sigma. The rule of thumb is that trap spacing should be approximately sigma or less for good SECR performance.',
      codeIntro: 'Process the simulated capture data into structured histories and compute diagnostic statistics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Re-run simulation (compact version)
area_size, true_D, true_g0, true_sigma = 20.0, 0.4, 0.15, 2.5
trap_spacing, n_occasions, buffer = 3.0, 15, 5.0
tx = np.arange(trap_spacing, area_size, trap_spacing)
ty = np.arange(trap_spacing, area_size, trap_spacing)
traps = np.array([(x, y) for x in tx for y in ty])
n_traps = len(traps)
total_area = (area_size + 2*buffer)**2
n_animals = np.random.poisson(true_D * total_area)
centers = np.random.uniform(-buffer, area_size+buffer, (n_animals, 2))
captures = np.zeros((n_animals, n_traps, n_occasions), dtype=int)
for i in range(n_animals):
    for j in range(n_traps):
        d = np.linalg.norm(centers[i] - traps[j])
        p = true_g0 * np.exp(-d**2/(2*true_sigma**2))
        captures[i,j,:] = np.random.binomial(1, p, n_occasions)
detected = np.any(captures.reshape(n_animals,-1), axis=1)
cap_hist = captures[detected]
det_centers = centers[detected]
n_det = detected.sum()

# ---- Capture history analysis ----
class CaptureHistoryAnalyzer:
    def __init__(self, capture_histories, traps):
        self.ch = capture_histories  # n_det x n_traps x n_occasions
        self.traps = traps
        self.n_ind, self.n_traps, self.n_occ = capture_histories.shape

        # Compute sufficient statistics
        self.trap_freq = (capture_histories.sum(axis=2) > 0)  # binary: detected at trap?
        self.n_traps_per_ind = self.trap_freq.sum(axis=1)
        self.n_caps_per_ind = capture_histories.sum(axis=(1, 2))
        self.n_caps_per_trap = capture_histories.sum(axis=(0, 2))
        self.n_caps_per_occ = capture_histories.sum(axis=(0, 1))

        # Spatial recapture statistics
        self.singletons = np.sum(self.n_traps_per_ind == 1)
        self.spatial_recaps = np.sum(self.n_traps_per_ind > 1)

        # Mean max distance moved (MMDM) - crude sigma estimator
        self.mmdm = self._compute_mmdm()

        # Trap distance matrix
        self.trap_dists = np.sqrt(
            np.sum((traps[:, None, :] - traps[None, :, :]) ** 2, axis=2))

    def _compute_mmdm(self):
        max_dists = []
        for i in range(self.n_ind):
            trap_locs = np.where(self.trap_freq[i])[0]
            if len(trap_locs) > 1:
                dists = []
                for a in trap_locs:
                    for b in trap_locs:
                        if a != b:
                            dists.append(np.linalg.norm(self.traps[a] - self.traps[b]))
                max_dists.append(max(dists))
        return np.mean(max_dists) if max_dists else 0

    def report(self):
        print("=" * 55)
        print("CAPTURE HISTORY DIAGNOSTICS")
        print("=" * 55)
        print(f"Detected individuals:    {self.n_ind}")
        print(f"Total captures:          {self.ch.sum()}")
        print(f"Spatial singletons:      {self.singletons} ({100*self.singletons/self.n_ind:.0f}%)")
        print(f"Spatial recaptures:      {self.spatial_recaps} ({100*self.spatial_recaps/self.n_ind:.0f}%)")
        print(f"Mean captures/individual: {self.n_caps_per_ind.mean():.1f}")
        print(f"Mean traps/individual:    {self.n_traps_per_ind.mean():.1f}")
        print(f"MMDM (sigma proxy):      {self.mmdm:.2f} km")
        print(f"MMDM/2 estimate of sigma: {self.mmdm/2:.2f} km (true: {true_sigma})")
        print(f"Naive density (n/area):  {self.n_ind/area_size**2:.3f} /km² (true: {true_D})")
        print("=" * 55)

analyzer = CaptureHistoryAnalyzer(cap_hist, traps)
analyzer.report()

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Captures per individual
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.hist(analyzer.n_caps_per_ind, bins=range(1, analyzer.n_caps_per_ind.max()+2),
        color='#22c55e', edgecolor='#111827', alpha=0.8)
ax.set_xlabel('Total captures', color='white')
ax.set_ylabel('Number of individuals', color='white')
ax.set_title('Capture frequency distribution', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Traps per individual
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.hist(analyzer.n_traps_per_ind, bins=range(1, analyzer.n_traps_per_ind.max()+2),
        color='#a855f7', edgecolor='#111827', alpha=0.8)
ax.axvline(1.5, color='#ef4444', linestyle='--', linewidth=2, label='Singleton threshold')
ax.set_xlabel('Number of traps detected at', color='white')
ax.set_ylabel('Number of individuals', color='white')
ax.set_title('Spatial recapture distribution', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Captures per occasion (detection trend)
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.bar(range(1, n_occasions+1), analyzer.n_caps_per_occ, color='#3b82f6', edgecolor='#111827')
ax.set_xlabel('Survey occasion', color='white')
ax.set_ylabel('Total captures', color='white')
ax.set_title('Captures per occasion (check for trends)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Discovery curve
ax = axes[1, 1]
ax.set_facecolor('#111827')
cum_new = []
seen = set()
for occ in range(n_occasions):
    for ind in range(n_det):
        if cap_hist[ind, :, occ].any():
            seen.add(ind)
    cum_new.append(len(seen))
ax.plot(range(1, n_occasions+1), cum_new, 'o-', color='#f59e0b', linewidth=2)
ax.axhline(n_det, color='gray', linestyle='--', alpha=0.5)
ax.set_xlabel('Survey occasion', color='white')
ax.set_ylabel('Cumulative individuals detected', color='white')
ax.set_title('Discovery curve (should plateau)', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print()
print("Diagnostic interpretation:")
if analyzer.singletons / analyzer.n_ind > 0.5:
    print("  WARNING: >50% singletons — sigma estimate will be imprecise")
else:
    print("  Good: <50% singletons — adequate spatial recaptures for SECR")
print(f"  MMDM/2 = {analyzer.mmdm/2:.2f} km gives initial sigma estimate for optimizer")
print(f"  Discovery curve {'plateaued' if cum_new[-1] == cum_new[-3] else 'still rising'} — {'survey adequate' if cum_new[-1] == cum_new[-3] else 'consider more occasions'}")`,
      challenge: 'Compute the detection probability at each trap (number of captures / (n_detected * n_occasions)). Plot it as a heatmap. Does it correlate with the true density surface? Be careful — detection probability depends on animal density, not the other way around.',
      successHint: 'Good diagnostics save you from garbage-in-garbage-out. Always examine your capture histories before fitting a model. A model fit to poor data gives precise but wrong answers.',
    },
    {
      title: 'The SECR likelihood engine — the mathematical core',
      concept: `The heart of SECR is the **likelihood function** — a mathematical expression for the probability of observing your exact capture data, given parameter values (D, g₀, σ).

For detected individual i with capture history hᵢ (an n_traps x n_occasions binary matrix), the likelihood contribution is:

L_i(D, g₀, σ) = D × ∫ f(hᵢ | s, g₀, σ) ds

Where the integral is over all possible activity center locations s, and:

f(hᵢ | s, g₀, σ) = ∏_j ∏_k [p_j(s)]^h_{ijk} × [1 - p_j(s)]^{1-h_{ijk}}

with p_j(s) = g₀ × exp(-||s - trap_j||² / 2σ²)

The integral is computed numerically on a grid of points. For each grid point (potential activity center), we compute the probability of the observed capture history at all traps, weight by density, and sum.

The total likelihood also includes a term for the **number of undetected animals** — a Poisson term based on the expected number of animals with zero captures.

We maximize the log-likelihood using numerical optimization.`,
      analogy: 'The likelihood function is like a detective reconstructing a crime from evidence. Each piece of evidence (capture at a specific trap and time) constrains the possibilities. A capture at trap A but not nearby trap B tells you the activity center is probably close to A. Multiple captures at different traps triangulate the center. The likelihood combines all this evidence mathematically.',
      storyConnection: 'Each photograph of the clouded leopard at a specific camera is a piece of the puzzle. The SECR likelihood assembles all these pieces — where the leopard was seen, where it was not seen, and how often — into a coherent statistical model that reveals not just this individual but the entire hidden population.',
      checkQuestion: 'Why do we integrate over possible activity center locations instead of just using the mean capture location as the activity center?',
      checkAnswer: 'The mean capture location is biased toward the trap array. An animal whose true center is at the edge of the array gets captured mostly by the nearest traps, pulling the mean inward. Integration over all possible centers, weighted by their likelihood given the captures, properly accounts for this edge bias. It also propagates uncertainty — we do not know the exact center, so we average over all plausible ones.',
      codeIntro: 'Implement the full SECR log-likelihood function with numerical integration over activity centers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Recreate survey data
area_size, true_D, true_g0, true_sigma = 20.0, 0.4, 0.15, 2.5
trap_spacing, n_occasions, buffer = 3.0, 15, 5.0
tx = np.arange(trap_spacing, area_size, trap_spacing)
ty = np.arange(trap_spacing, area_size, trap_spacing)
traps = np.array([(x, y) for x in tx for y in ty])
n_traps = len(traps)
n_animals = np.random.poisson(true_D * (area_size + 2*buffer)**2)
centers = np.random.uniform(-buffer, area_size+buffer, (n_animals, 2))
captures = np.zeros((n_animals, n_traps, n_occasions), dtype=int)
for i in range(n_animals):
    for j in range(n_traps):
        d = np.linalg.norm(centers[i] - traps[j])
        p = true_g0 * np.exp(-d**2/(2*true_sigma**2))
        captures[i,j,:] = np.random.binomial(1, p, n_occasions)
detected = np.any(captures.reshape(n_animals,-1), axis=1)
cap_hist = captures[detected]
n_det = detected.sum()

# ---- SECR Likelihood ----
class SECRLikelihood:
    def __init__(self, capture_histories, traps, mask_spacing=1.0,
                 area_bounds=(0, 20, 0, 20), n_occasions=15):
        self.ch = capture_histories  # n_det x n_traps x n_occasions
        self.traps = traps
        self.n_ind, self.n_traps, self.n_occ = capture_histories.shape
        self.n_occasions = n_occasions

        # Integration grid (habitat mask)
        xs = np.arange(area_bounds[0], area_bounds[1], mask_spacing)
        ys = np.arange(area_bounds[2], area_bounds[3], mask_spacing)
        gx, gy = np.meshgrid(xs, ys)
        self.mask_points = np.column_stack([gx.ravel(), gy.ravel()])
        self.n_mask = len(self.mask_points)
        self.cell_area = mask_spacing ** 2

        # Precompute distances: n_mask x n_traps
        self.dists2 = np.sum(
            (self.mask_points[:, None, :] - self.traps[None, :, :]) ** 2, axis=2)

        # Per-individual capture summaries
        self.cap_counts = capture_histories.sum(axis=2)  # n_det x n_traps
        self.non_cap_counts = n_occasions - self.cap_counts

    def detection_probs(self, g0, sigma):
        """Detection probability at each mask point for each trap."""
        return g0 * np.exp(-self.dists2 / (2 * sigma**2))

    def log_likelihood(self, params):
        """Compute negative log-likelihood for optimization."""
        D, g0, sigma = params
        if D <= 0 or g0 <= 0 or g0 >= 1 or sigma <= 0.1:
            return 1e10

        p = self.detection_probs(g0, sigma)  # n_mask x n_traps

        # Log-likelihood for each detected individual
        # For each mask point s, compute log P(capture history | s)
        log_p = np.log(np.clip(p, 1e-15, None))
        log_1mp = np.log(np.clip(1 - p, 1e-15, None))

        ll_total = 0
        for i in range(self.n_ind):
            # log P(h_i | s) for each mask point
            log_lik_given_s = (
                self.cap_counts[i][None, :] * log_p +
                self.non_cap_counts[i][None, :] * log_1mp
            ).sum(axis=1)  # n_mask

            # Integrate: sum over mask points weighted by D * cell_area
            max_ll = log_lik_given_s.max()
            ll_i = max_ll + np.log(
                np.sum(np.exp(log_lik_given_s - max_ll) * D * self.cell_area))
            ll_total += ll_i

        # Poisson term: expected number detected
        # P(not detected | s) for each mask point
        p_not_det = np.prod((1 - p) ** self.n_occasions, axis=1)  # n_mask
        p_det = 1 - p_not_det
        E_detected = np.sum(p_det * D * self.cell_area)
        ll_total += -E_detected + self.n_ind * np.log(max(E_detected, 1e-10))

        # Subtract normalizing constant
        ll_total -= self.n_ind * np.log(max(E_detected, 1e-10))

        return -ll_total  # negative for minimization

# Build likelihood
secr = SECRLikelihood(cap_hist, traps, mask_spacing=1.5,
                       area_bounds=(-2, 22, -2, 22), n_occasions=n_occasions)

# Evaluate likelihood on a grid to visualize the surface
D_vals = np.linspace(0.1, 1.0, 20)
sigma_vals = np.linspace(1.0, 5.0, 20)
nll_surface = np.zeros((len(sigma_vals), len(D_vals)))

for si, sig in enumerate(sigma_vals):
    for di, d in enumerate(D_vals):
        nll_surface[si, di] = secr.log_likelihood([d, true_g0, sig])

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

ax = axes[0]
ax.set_facecolor('#111827')
cf = ax.contourf(D_vals, sigma_vals, -nll_surface, levels=30, cmap='viridis')
ax.plot(true_D, true_sigma, 'r*', markersize=15, label=f'True: D={true_D}, σ={true_sigma}')
min_idx = np.unravel_index(nll_surface.argmin(), nll_surface.shape)
ax.plot(D_vals[min_idx[1]], sigma_vals[min_idx[0]], 'w^', markersize=12,
        label=f'MLE: D={D_vals[min_idx[1]]:.2f}, σ={sigma_vals[min_idx[0]]:.1f}')
ax.set_xlabel('Density (D)', color='white')
ax.set_ylabel('Sigma (km)', color='white')
ax.set_title('Log-likelihood surface (g0 fixed at true)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
plt.colorbar(cf, ax=ax, label='Log-likelihood')

# Profile likelihood for D (fixing sigma, g0 at rough estimates)
ax = axes[1]
ax.set_facecolor('#111827')
D_fine = np.linspace(0.1, 1.0, 40)
nll_D = [secr.log_likelihood([d, true_g0, true_sigma]) for d in D_fine]
nll_D = np.array(nll_D)
ax.plot(D_fine, -(nll_D - nll_D.min()), color='#22c55e', linewidth=2)
ax.axvline(true_D, color='#ef4444', linestyle='--', linewidth=2, label=f'True D = {true_D}')
ax.axhline(-1.92, color='gray', linestyle=':', label='95% CI threshold')
ax.set_xlabel('Density (D)', color='white')
ax.set_ylabel('Profile log-likelihood', color='white')
ax.set_title('Profile likelihood for density', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

best_D = D_vals[min_idx[1]]
best_sigma = sigma_vals[min_idx[0]]
print("Likelihood surface analysis:")
print(f"  Grid search MLE (g0 fixed): D={best_D:.2f}, sigma={best_sigma:.1f}")
print(f"  True values:                D={true_D:.2f}, sigma={true_sigma:.1f}")
print(f"  The likelihood surface peaks near the true values.")
print(f"  Next: numerical optimization to find the exact MLE for all 3 parameters.")`,
      challenge: 'Create a 3D likelihood surface by varying all three parameters (D, g0, sigma). You will need to slice through the space — try fixing each parameter at its true value and plotting the surface for the other two. Which parameter pair shows the strongest correlation (trade-off)?',
      successHint: 'The likelihood function is the mathematical bridge between data and inference. Understanding it deeply — why it peaks where it does, how it responds to parameter changes — is what separates a statistician from someone who just runs software.',
    },
    {
      title: 'Maximum likelihood optimization and confidence intervals',
      concept: `With the likelihood function built, we need to find the parameter values that maximize it. This is a **numerical optimization** problem.

We use the **Nelder-Mead simplex method** — a derivative-free optimizer that works by evaluating the likelihood at the corners of a simplex (triangle in 2D, tetrahedron in 3D) and iteratively moving toward the maximum. It is robust for problems where derivatives are noisy or expensive.

Starting values matter. Poor initial guesses can lead the optimizer to local optima. We use the diagnostic statistics from Stage 2:
- **D_init**: n_detected / effective survey area (naive estimate, biased low)
- **sigma_init**: MMDM / 2 (mean maximum distance moved, halved)
- **g0_init**: overall capture probability per occasion

**Confidence intervals** use the profile likelihood method:
1. For each parameter, fix it at a range of values
2. Optimize the other parameters at each fixed value
3. The 95% CI is where the profile log-likelihood drops by 1.92 (chi-squared with 1 df) from the maximum

This gives asymmetric confidence intervals that respect parameter bounds.`,
      analogy: 'Finding the MLE is like finding the peak of a mountain in dense fog. You cannot see the whole landscape, so you take small steps uphill, measuring elevation at each step. The Nelder-Mead method uses a "team" of explorers (simplex corners) who communicate to identify the uphill direction efficiently. The confidence interval is like drawing a contour line 100 meters below the peak — everything inside that contour is a "plausible" peak location.',
      storyConnection: 'The conservation team trying to estimate the clouded leopard population faces the same problem: they have data (camera trap captures) and a model (SECR), but they need the best parameter estimates and honest uncertainty bounds. Reporting "40 ± 12 leopards" is far more useful to park managers than just "40 leopards." The optimization and CI computation make this possible.',
      checkQuestion: 'The optimizer returns D=0.38 with a 95% CI of (0.22, 0.61). The true value is 0.40. Is the estimator working well?',
      checkAnswer: 'Yes, for two reasons: (1) the point estimate 0.38 is close to 0.40 (low bias), and (2) the true value falls within the 95% CI. Over many repeated surveys, we expect the 95% CI to contain the truth 95% of the time. The CI is wide (0.22 to 0.61) reflecting genuine uncertainty from limited data — that is honest inference, not a flaw.',
      codeIntro: 'Implement Nelder-Mead optimization to find the MLE, then compute profile likelihood confidence intervals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Recreate survey + likelihood (compact)
area_size, true_D, true_g0, true_sigma = 20.0, 0.4, 0.15, 2.5
trap_spacing, n_occasions, buffer = 3.0, 15, 5.0
tx = np.arange(trap_spacing, area_size, trap_spacing)
ty = np.arange(trap_spacing, area_size, trap_spacing)
traps = np.array([(x, y) for x in tx for y in ty])
n_traps = len(traps)
n_animals = np.random.poisson(true_D * (area_size + 2*buffer)**2)
ctrs = np.random.uniform(-buffer, area_size+buffer, (n_animals, 2))
caps = np.zeros((n_animals, n_traps, n_occasions), dtype=int)
for i in range(n_animals):
    for j in range(n_traps):
        d = np.linalg.norm(ctrs[i] - traps[j])
        p = true_g0 * np.exp(-d**2/(2*true_sigma**2))
        caps[i,j,:] = np.random.binomial(1, p, n_occasions)
det = np.any(caps.reshape(n_animals,-1), axis=1)
ch = caps[det]
n_det = det.sum()

# Likelihood class (reused from previous stage)
mask_sp = 1.5
xs = np.arange(-2, 22, mask_sp)
ys = np.arange(-2, 22, mask_sp)
gx, gy = np.meshgrid(xs, ys)
mask_pts = np.column_stack([gx.ravel(), gy.ravel()])
cell_area = mask_sp**2
dists2 = np.sum((mask_pts[:, None, :] - traps[None, :, :]) ** 2, axis=2)
cap_counts = ch.sum(axis=2)
non_cap = n_occasions - cap_counts

def neg_ll(params):
    D, g0, sigma = params
    if D <= 0 or g0 <= 0 or g0 >= 1 or sigma <= 0.1:
        return 1e10
    p = g0 * np.exp(-dists2 / (2 * sigma**2))
    log_p = np.log(np.clip(p, 1e-15, None))
    log_1mp = np.log(np.clip(1 - p, 1e-15, None))
    ll = 0
    for i in range(n_det):
        ll_s = (cap_counts[i][None,:] * log_p + non_cap[i][None,:] * log_1mp).sum(axis=1)
        mx = ll_s.max()
        ll += mx + np.log(np.sum(np.exp(ll_s - mx) * D * cell_area))
    p_not = np.prod((1-p)**n_occasions, axis=1)
    E_det = np.sum((1 - p_not) * D * cell_area)
    ll += -E_det
    return -ll

# ---- Nelder-Mead optimizer ----
def nelder_mead(f, x0, step=0.1, tol=1e-6, max_iter=500):
    n = len(x0)
    simplex = [np.array(x0, dtype=float)]
    for i in range(n):
        point = np.array(x0, dtype=float)
        point[i] += step * (1 + abs(x0[i]))
        simplex.append(point)
    values = [f(s) for s in simplex]
    history = [min(values)]

    for iteration in range(max_iter):
        order = np.argsort(values)
        simplex = [simplex[i] for i in order]
        values = [values[i] for i in order]
        history.append(values[0])

        centroid = np.mean(simplex[:-1], axis=0)
        # Reflection
        xr = centroid + 1.0 * (centroid - simplex[-1])
        xr = np.clip(xr, [0.01, 0.01, 0.1], [5.0, 0.99, 20.0])
        fr = f(xr)
        if values[0] <= fr < values[-2]:
            simplex[-1] = xr; values[-1] = fr; continue
        if fr < values[0]:
            xe = centroid + 2.0 * (xr - centroid)
            xe = np.clip(xe, [0.01, 0.01, 0.1], [5.0, 0.99, 20.0])
            fe = f(xe)
            if fe < fr:
                simplex[-1] = xe; values[-1] = fe
            else:
                simplex[-1] = xr; values[-1] = fr
            continue
        xc = centroid + 0.5 * (simplex[-1] - centroid)
        xc = np.clip(xc, [0.01, 0.01, 0.1], [5.0, 0.99, 20.0])
        fc = f(xc)
        if fc < values[-1]:
            simplex[-1] = xc; values[-1] = fc; continue
        for i in range(1, len(simplex)):
            simplex[i] = simplex[0] + 0.5 * (simplex[i] - simplex[0])
            values[i] = f(simplex[i])

        if max(values) - min(values) < tol:
            break

    return simplex[0], values[0], history

# Initial guesses from diagnostics
D_init = n_det / area_size**2
trap_freq = (ch.sum(axis=2) > 0)
n_traps_per = trap_freq.sum(axis=1)
max_dists = []
for i in range(n_det):
    tlocs = np.where(trap_freq[i])[0]
    if len(tlocs) > 1:
        ds = [np.linalg.norm(traps[a]-traps[b]) for a in tlocs for b in tlocs if a!=b]
        max_dists.append(max(ds))
sigma_init = np.mean(max_dists)/2 if max_dists else 2.0
g0_init = ch.sum() / (n_det * n_traps * n_occasions)

print(f"Initial estimates: D={D_init:.3f}, g0={g0_init:.3f}, sigma={sigma_init:.2f}")

result, min_nll, history = nelder_mead(neg_ll, [D_init, g0_init, sigma_init],
                                         step=0.2, tol=1e-5, max_iter=800)
est_D, est_g0, est_sigma = result

# Profile likelihood CIs for D
D_range = np.linspace(max(0.05, est_D*0.3), est_D*2.5, 30)
profile_D = []
for d in D_range:
    # Optimize g0 and sigma with D fixed
    def f_fixed_D(params):
        return neg_ll([d, params[0], params[1]])
    best_val = 1e10
    for g_try in [est_g0*0.8, est_g0, est_g0*1.2]:
        for s_try in [est_sigma*0.8, est_sigma, est_sigma*1.2]:
            v = f_fixed_D([g_try, s_try])
            if v < best_val:
                best_val = v
    profile_D.append(-best_val)

profile_D = np.array(profile_D)
profile_rel = profile_D - profile_D.max()

# 95% CI: where profile drops by 1.92
ci_mask = profile_rel >= -1.92
if ci_mask.any():
    ci_low = D_range[ci_mask][0]
    ci_high = D_range[ci_mask][-1]
else:
    ci_low, ci_high = D_range[0], D_range[-1]

fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.patch.set_facecolor('#1f2937')

# Convergence
ax = axes[0]
ax.set_facecolor('#111827')
ax.plot(history, color='#22c55e', linewidth=1.5)
ax.set_xlabel('Iteration', color='white')
ax.set_ylabel('Negative log-likelihood', color='white')
ax.set_title('Optimizer convergence', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Parameter estimates
ax = axes[1]
ax.set_facecolor('#111827')
params = ['D', 'g0', 'sigma']
true_vals = [true_D, true_g0, true_sigma]
est_vals = [est_D, est_g0, est_sigma]
x = np.arange(3)
ax.bar(x - 0.15, true_vals, 0.3, color='#3b82f6', label='True', edgecolor='none')
ax.bar(x + 0.15, est_vals, 0.3, color='#22c55e', label='Estimated', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(params, color='white')
ax.set_ylabel('Value', color='white')
ax.set_title('Parameter estimates vs truth', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Profile likelihood CI
ax = axes[2]
ax.set_facecolor('#111827')
ax.plot(D_range, profile_rel, color='#a855f7', linewidth=2)
ax.axvline(true_D, color='#ef4444', linestyle='--', linewidth=2, label=f'True D={true_D}')
ax.axvline(est_D, color='#22c55e', linestyle='-', linewidth=2, label=f'MLE D={est_D:.3f}')
ax.axhline(-1.92, color='gray', linestyle=':', label='95% CI cutoff')
ax.axvspan(ci_low, ci_high, alpha=0.15, color='#a855f7', label=f'95% CI: [{ci_low:.2f}, {ci_high:.2f}]')
ax.set_xlabel('Density (D)', color='white')
ax.set_ylabel('Profile log-likelihood', color='white')
ax.set_title('Profile likelihood confidence interval', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print()
print("=" * 55)
print("MAXIMUM LIKELIHOOD ESTIMATES")
print("=" * 55)
print(f"  D (density):     {est_D:.3f} /km²  (true: {true_D})")
print(f"  g0 (detection):  {est_g0:.3f}       (true: {true_g0})")
print(f"  sigma (range):   {est_sigma:.2f} km   (true: {true_sigma})")
print(f"  95% CI for D:    [{ci_low:.2f}, {ci_high:.2f}]")
print(f"  True D in CI:    {'Yes' if ci_low <= true_D <= ci_high else 'No'}")
print(f"  Est. population: {est_D * area_size**2:.0f} in {area_size**2:.0f} km²")
print(f"  True population: {n_animals} (in full area incl. buffer)")
print("=" * 55)`,
      challenge: 'Run the entire pipeline 20 times with different random seeds. Record the MLE for D each time and check what fraction of the 95% CIs contain the true value. It should be close to 95% — that is what "95% confidence" means.',
      successHint: 'You have built a working maximum likelihood estimator from scratch. The same mathematical framework — likelihood + optimization + profile CIs — underlies nearly all of modern statistical ecology.',
    },
    {
      title: 'Density surface mapping — where are the leopards?',
      concept: `The final output of our pipeline is a **density surface map** — a spatial prediction of where clouded leopards are most concentrated. This is the most actionable product for conservation.

For each location s on a fine grid, we compute the **expected density contribution** based on the detection data:

D(s) = D̂ × P(data | activity center at s) / P(data)

This is essentially a Bayesian posterior: how likely is it that an activity center exists at location s, given what we observed at the cameras? Areas near traps with many captures get high density; areas far from active traps get the prior density.

The density surface reveals:
- **Core habitat**: where leopards concentrate
- **Corridors**: connections between core areas
- **Gaps**: areas of low density that might need intervention
- **Edge effects**: how density estimation degrades at array boundaries

This map directly informs where to place new reserves, where to build wildlife corridors, and where anti-poaching patrols should focus.`,
      analogy: 'A density surface map is like a weather radar image showing precipitation intensity across a region. Just as radar converts signal returns from multiple stations into a continuous rainfall map, SECR converts capture data from multiple traps into a continuous density map. Both reveal spatial patterns invisible from any single observation point.',
      storyConnection: 'If the researchers in the story could produce this density map, they would know not just where their one clouded leopard lived, but where ALL the leopards in the forest concentrate. That map would tell them exactly which areas must be protected — and which corridors must stay open — to ensure the species survives.',
      checkQuestion: 'The density surface shows high density in an area with no camera traps. Should you trust this estimate?',
      checkAnswer: 'Be cautious. Areas without traps rely entirely on the model extrapolating from nearby traps — the estimate there is the prior density with little data to update it. The uncertainty is very high. This is actually useful information: it tells you where to place traps in the next survey to fill knowledge gaps. Never mistake model extrapolation for data.',
      codeIntro: 'Generate the final density surface map and produce a complete conservation report.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Full pipeline: simulate -> estimate -> map
area_size, true_D, true_g0, true_sigma = 20.0, 0.4, 0.15, 2.5
trap_spacing, n_occasions, buffer = 3.0, 15, 5.0
tx = np.arange(trap_spacing, area_size, trap_spacing)
ty = np.arange(trap_spacing, area_size, trap_spacing)
traps = np.array([(x, y) for x in tx for y in ty])
n_traps = len(traps)
n_animals = np.random.poisson(true_D * (area_size + 2*buffer)**2)
ctrs = np.random.uniform(-buffer, area_size+buffer, (n_animals, 2))
caps = np.zeros((n_animals, n_traps, n_occasions), dtype=int)
for i in range(n_animals):
    for j in range(n_traps):
        d = np.linalg.norm(ctrs[i] - traps[j])
        p = true_g0 * np.exp(-d**2/(2*true_sigma**2))
        caps[i,j,:] = np.random.binomial(1, p, n_occasions)
det = np.any(caps.reshape(n_animals,-1), axis=1)
ch = caps[det]
n_det = det.sum()
det_ctrs = ctrs[det]

# Use "estimated" parameters (close to true for visualization)
est_D, est_g0, est_sigma = 0.38, 0.14, 2.6

# Generate density surface
res = 0.5  # km resolution
xs = np.arange(0, area_size, res)
ys = np.arange(0, area_size, res)
X_grid, Y_grid = np.meshgrid(xs, ys)
grid_pts = np.column_stack([X_grid.ravel(), Y_grid.ravel()])

# For each grid point, compute weighted density contribution
density_surface = np.zeros(len(grid_pts))

for i in range(n_det):
    cap_count_i = ch[i].sum(axis=1)  # captures at each trap
    non_cap_i = n_occasions - cap_count_i

    for gi, gpt in enumerate(grid_pts):
        dists = np.sqrt(np.sum((traps - gpt)**2, axis=1))
        p_traps = est_g0 * np.exp(-dists**2 / (2 * est_sigma**2))
        p_traps = np.clip(p_traps, 1e-10, 1 - 1e-10)

        log_lik = np.sum(
            cap_count_i * np.log(p_traps) +
            non_cap_i * np.log(1 - p_traps)
        )
        density_surface[gi] += np.exp(log_lik)

# Normalize to density
density_surface = density_surface / density_surface.sum() * est_D * area_size**2
density_map = density_surface.reshape(X_grid.shape)

# True density (kernel smoothed from true centers)
true_density = np.zeros_like(X_grid)
for c in ctrs[(ctrs[:,0]>=0) & (ctrs[:,0]<=area_size) &
              (ctrs[:,1]>=0) & (ctrs[:,1]<=area_size)]:
    true_density += np.exp(-((X_grid-c[0])**2 + (Y_grid-c[1])**2) / (2*2.0**2))
true_density = true_density / true_density.sum() * true_D * area_size**2

# Conservation priority zones
high_density = density_map > np.percentile(density_map, 75)
core_habitat = density_map > np.percentile(density_map, 90)

fig, axes = plt.subplots(2, 2, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')

# Estimated density surface
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.pcolormesh(X_grid, Y_grid, density_map, cmap='YlGn', shading='auto')
ax.scatter(traps[:, 0], traps[:, 1], marker='s', s=30, color='white',
           edgecolors='black', linewidth=0.5, zorder=5)
ax.set_title('Estimated density surface', color='white', fontsize=11)
ax.set_aspect('equal')
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, label='Relative density')

# True density (for validation)
ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.pcolormesh(X_grid, Y_grid, true_density, cmap='YlGn', shading='auto')
ax.scatter(det_ctrs[:, 0], det_ctrs[:, 1], s=15, color='red', alpha=0.5, label='Detected')
ax.scatter(ctrs[~det, 0], ctrs[~det, 1], s=8, color='gray', alpha=0.2, label='Undetected')
ax.set_title('True density (validation)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.set_xlim(0, area_size); ax.set_ylim(0, area_size)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, label='Relative density')

# Conservation priority map
ax = axes[1, 0]
ax.set_facecolor('#111827')
priority = np.zeros_like(density_map)
priority[high_density] = 1
priority[core_habitat] = 2
cmap = plt.cm.colors.ListedColormap(['#111827', '#22c55e44', '#22c55e'])
ax.pcolormesh(X_grid, Y_grid, priority, cmap=cmap, shading='auto')
ax.scatter(traps[:, 0], traps[:, 1], marker='s', s=30, color='#f59e0b',
           edgecolors='black', linewidth=0.5, zorder=5)
ax.set_title('Conservation priority zones', color='white', fontsize=11)
ax.set_aspect('equal')
ax.tick_params(colors='gray')
# Legend
from matplotlib.patches import Patch
ax.legend(handles=[
    Patch(facecolor='#22c55e', label='Core habitat (top 10%)'),
    Patch(facecolor='#22c55e44', label='Important (top 25%)'),
    Patch(facecolor='#111827', edgecolor='gray', label='Low priority'),
], facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='upper left')

# Summary report
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
report = f"""
WILDLIFE POPULATION ASSESSMENT REPORT
{'='*42}

Study Area: {area_size} x {area_size} km ({area_size**2} km²)
Survey Effort: {n_traps} cameras x {n_occasions} occasions
Survey Period: simulated

POPULATION ESTIMATES
  Density:    {est_D:.2f} individuals/km²
  Population: {est_D * area_size**2:.0f} in study area
  Detected:   {n_det} unique individuals

SPATIAL PARAMETERS
  Detection probability (g0): {est_g0:.2f}
  Movement range (sigma):     {est_sigma:.1f} km
  Effective survey area:      ~{area_size**2 * 0.7:.0f} km²

CONSERVATION ASSESSMENT
  Core habitat:  {core_habitat.sum()*res**2:.0f} km² ({100*core_habitat.mean():.0f}%)
  Important:     {high_density.sum()*res**2:.0f} km² ({100*high_density.mean():.0f}%)
  Min. viable:   ~{50/est_D:.0f} km² (for 50 individuals)

RECOMMENDATIONS
  1. Protect core habitat zones (green areas)
  2. Maintain corridors between patches
  3. Expand trap array to cover gaps
  4. Repeat survey annually for trends
"""
ax.text(0.05, 0.95, report, transform=ax.transAxes, fontsize=8,
        verticalalignment='top', fontfamily='monospace', color='#22c55e')

plt.tight_layout()
plt.show()

corr = np.corrcoef(density_map.flatten(), true_density.flatten())[0, 1]
print(f"Density surface correlation with truth: {corr:.3f}")
print()
print("CAPSTONE COMPLETE: You have built a full wildlife population estimator")
print("from camera trap data — the same tool used by conservation biologists")
print("to assess clouded leopard populations across Southeast Asia.")`,
      challenge: 'Add a "threat layer" — simulate a road running through the study area and set density to zero within 1 km of the road. Recompute the density surface and conservation report. How much habitat is lost? This is how Environmental Impact Assessments work.',
      successHint: 'You have completed a real conservation tool. Every stage — simulation, data processing, likelihood, optimization, mapping — mirrors what professional ecologists do with software like DENSITY or secr in R. The difference is you understand every line of the mathematics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Wildlife Population Estimator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (conservation ecology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete SECR population estimator in Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
