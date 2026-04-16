import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CloudRefusedLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Project design — architecture of a cloud seeding simulator',
      concept: `This capstone builds a complete cloud seeding simulator from scratch. By the end, you will have a working model that tracks thousands of droplets through condensation, collision-coalescence, and ice nucleation — with a toggle to add silver iodide seeding agents and measure the effect on precipitation.

The simulator has four core modules:

**1. Droplet population**: A collection of N droplets, each with a radius, position in the cloud, and phase (liquid or ice). We represent this as a numpy array for efficiency.

**2. Growth engine**: At each time step, droplets grow by condensation (vapor deposition on the surface) and by collision-coalescence (larger droplets sweeping up smaller ones). The growth rate depends on supersaturation, temperature, and the droplet size distribution.

**3. Seeding module**: When enabled, introduces AgI particles at a specified concentration. These trigger heterogeneous ice nucleation in supercooled droplets, converting them to ice crystals that then grow via the Bergeron process.

**4. Precipitation tracker**: Droplets that exceed a terminal velocity threshold (roughly r > 100 micrometers) fall out of the cloud as precipitation. We track total rainfall for seeded vs unseeded runs.

The design pattern: separate the physics into modular functions, then compose them into a simulation loop. This is how real atmospheric models are built — the same condensation code works whether you are simulating a single cumulus or a global climate model.`,
      analogy: 'Building this simulator is like building a fish tank ecosystem. You need the water (cloud environment), the fish of various sizes (droplets), rules for how they eat each other (collision-coalescence), rules for how they grow from food in the water (condensation), and a drain at the bottom (precipitation). The seeding module is like adding a new species that changes the whole ecosystem dynamics. Each piece is simple; the emergent behavior is complex.',
      storyConnection: 'The cloud that refused to rain over Assam is the test case for our simulator. We will model a warm-base cloud typical of the pre-monsoon season in the Brahmaputra valley — base temperature around 20C, top temperature around -20C, moderate updraft. The question the simulator must answer: if we seed this cloud with silver iodide, how much additional rain falls on the tea gardens below?',
      checkQuestion: 'Why is it important to model the full droplet size distribution rather than tracking just the mean droplet radius?',
      checkAnswer: 'Collision-coalescence depends on the SIZE DIFFERENCE between droplets, not the mean size. Two droplets of equal size fall at the same speed and rarely collide. A distribution with a few large droplets and many small ones produces rain much faster than one with all droplets the same size. The mean radius could be identical in both cases. Cloud seeding works precisely by creating a few outlier-size particles that break the symmetry of a narrow distribution. A mean-field model would miss this entirely.',
      codeIntro: 'Set up the simulator architecture: define the cloud environment, initialize the droplet population, and build the data structures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class CloudEnvironment:
    """Defines the thermodynamic environment of the cloud."""
    def __init__(self, T_base=20.0, T_top=-20.0, cloud_depth=3000.0,
                 updraft=2.0, LWC=0.5e-3, supersaturation=0.005):
        self.T_base = T_base          # base temperature (C)
        self.T_top = T_top            # top temperature (C)
        self.cloud_depth = cloud_depth # cloud depth (m)
        self.updraft = updraft         # updraft velocity (m/s)
        self.LWC = LWC                # liquid water content (kg/m^3)
        self.supersaturation = supersaturation  # fractional supersaturation
        self.lapse_rate = (T_base - T_top) / cloud_depth  # C/m

    def temperature_at(self, height):
        """Temperature at given height above cloud base (C)."""
        return self.T_base - self.lapse_rate * np.clip(height, 0, self.cloud_depth)

    def __repr__(self):
        return (f"Cloud: T_base={self.T_base}C, T_top={self.T_top}C, "
                f"depth={self.cloud_depth}m, updraft={self.updraft}m/s")

class DropletPopulation:
    """Manages a population of cloud droplets."""
    def __init__(self, n_droplets, cloud_env):
        self.n = n_droplets
        self.env = cloud_env

        # Initialize droplet radii: gamma distribution centered ~10 um
        shape_param = 6.0
        scale_param = 10e-6 / shape_param
        self.radii = np.random.gamma(shape_param, scale_param, n_droplets)
        self.radii = np.clip(self.radii, 1e-6, 100e-6)  # 1 to 100 um

        # Heights within cloud (uniform initially)
        self.heights = np.random.uniform(0, cloud_env.cloud_depth, n_droplets)

        # Phase: 0 = liquid, 1 = ice
        self.phase = np.zeros(n_droplets, dtype=int)

        # Track if droplet has precipitated out
        self.precipitated = np.zeros(n_droplets, dtype=bool)

        # Seeding agent flag
        self.is_seeded_nucleus = np.zeros(n_droplets, dtype=bool)

    def active_mask(self):
        """Mask for droplets still in the cloud."""
        return ~self.precipitated

    def size_distribution(self, n_bins=50):
        """Return histogram of active droplet sizes."""
        active = self.radii[self.active_mask()]
        bins = np.logspace(np.log10(1e-6), np.log10(1e-3), n_bins + 1)
        counts, edges = np.histogram(active, bins=bins)
        centers = np.sqrt(edges[:-1] * edges[1:])  # geometric mean
        return centers, counts

    def stats(self):
        """Summary statistics."""
        active = self.radii[self.active_mask()]
        if len(active) == 0:
            return {'mean_r': 0, 'max_r': 0, 'n_active': 0, 'n_precip': 0,
                    'n_ice': 0, 'n_liquid': 0}
        return {
            'mean_r': np.mean(active) * 1e6,
            'max_r': np.max(active) * 1e6,
            'n_active': np.sum(self.active_mask()),
            'n_precip': np.sum(self.precipitated),
            'n_ice': np.sum(self.phase[self.active_mask()] == 1),
            'n_liquid': np.sum(self.phase[self.active_mask()] == 0),
        }

# Initialize
env = CloudEnvironment()
pop = DropletPopulation(10000, env)

# Visualize initial state
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Cloud Seeding Simulator: Initial State', color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

# Panel 1: Temperature profile
ax = axes[0, 0]
heights = np.linspace(0, env.cloud_depth, 100)
temps = env.temperature_at(heights)
ax.plot(temps, heights / 1000, color='#ef4444', linewidth=2)
ax.axhline(y=heights[temps <= 0][0] / 1000 if np.any(temps <= 0) else env.cloud_depth / 1000,
           color='#3b82f6', linewidth=1.5, linestyle='--', alpha=0.7)
freezing_h = heights[np.argmin(np.abs(temps))]
ax.text(1, freezing_h / 1000 + 0.05, f'Freezing level ({freezing_h:.0f}m)', color='#3b82f6', fontsize=9)
ax.set_xlabel('Temperature (C)', color='white')
ax.set_ylabel('Height above cloud base (km)', color='white')
ax.set_title('Cloud temperature profile', color='white', fontsize=11, fontweight='bold')

# Panel 2: Initial droplet size distribution
ax = axes[0, 1]
centers, counts = pop.size_distribution()
ax.bar(centers * 1e6, counts, width=np.diff(np.concatenate([centers, [centers[-1] * 1.1]])) * 1e6 * 0.8,
       color='#3b82f6', alpha=0.8)
ax.set_xscale('log')
ax.axvline(x=40, color='#f59e0b', linewidth=1.5, linestyle='--', alpha=0.7)
ax.text(45, max(counts) * 0.9, 'Collision\
threshold', color='#f59e0b', fontsize=8)
ax.axvline(x=100, color='#ec4899', linewidth=1.5, linestyle=':', alpha=0.7)
ax.text(110, max(counts) * 0.8, 'Rain\
threshold', color='#ec4899', fontsize=8)
ax.set_xlabel('Droplet radius (um)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Initial size distribution (N=10,000)', color='white', fontsize=11, fontweight='bold')

# Panel 3: Droplets in cloud (height vs radius scatter)
ax = axes[1, 0]
active = pop.active_mask()
scatter = ax.scatter(pop.radii[active] * 1e6, pop.heights[active] / 1000,
                     c=pop.phase[active], cmap='coolwarm', alpha=0.3, s=5)
ax.set_xlabel('Droplet radius (um)', color='white')
ax.set_ylabel('Height (km)', color='white')
ax.set_title('Droplets in cloud', color='white', fontsize=11, fontweight='bold')
ax.set_xscale('log')

# Panel 4: Simulator architecture diagram (text)
ax = axes[1, 1]
ax.axis('off')
arch_text = """SIMULATOR ARCHITECTURE

CloudEnvironment
  - Temperature profile
  - Supersaturation
  - Updraft velocity

DropletPopulation (N=10,000)
  - radii[], heights[], phase[]
  - precipitated[], is_seeded[]

Growth Engine (per time step):
  1. Condensation growth
  2. Collision-coalescence
  3. Ice nucleation (if seeded)
  4. Bergeron process
  5. Precipitation check

Output:
  - Size distribution over time
  - Total precipitation
  - Seeded vs unseeded comparison"""

ax.text(0.05, 0.95, arch_text, transform=ax.transAxes, fontsize=10,
        color='#22c55e', fontfamily='monospace', verticalalignment='top',
        bbox=dict(boxstyle='round', facecolor='#111827', edgecolor='#22c55e', alpha=0.8))
ax.set_title('System design', color='white', fontsize=11, fontweight='bold')

plt.tight_layout()
plt.show()

stats = pop.stats()
print("Cloud Seeding Simulator - Initialization Complete")
print("=" * 55)
print(f"  Environment: {env}")
print(f"  Droplets: {stats['n_active']} active")
print(f"  Mean radius: {stats['mean_r']:.1f} um")
print(f"  Max radius:  {stats['max_r']:.1f} um")
print(f"  Liquid: {stats['n_liquid']}, Ice: {stats['n_ice']}")
print(f"  Precipitated: {stats['n_precip']}")
print()
print("Data structures ready. Next: implement condensation growth.")`,
      challenge: 'Add a method to DropletPopulation that computes the total liquid water content (kg/m^3) from the droplet population, assuming a cloud volume of 1 km^3. Compare it with the environment\'s specified LWC. They should be in the same order of magnitude if the initialization is physically consistent.',
      successHint: 'Good simulator design separates data (DropletPopulation) from physics (growth functions) from environment (CloudEnvironment). This modular architecture means you can swap out any component — different growth equations, different cloud types, different seeding strategies — without rewriting the whole system. Professional atmospheric models follow this exact pattern.',
    },
    {
      title: 'Droplet growth model — condensation and collision-coalescence',
      concept: `Now we implement the two physical processes that grow cloud droplets toward rain size.

**Condensation growth** follows from Maxwell's theory of diffusion. A droplet of radius r grows as water vapor diffuses toward its surface:

r * dr/dt = G * S

where G is the growth parameter (depends on temperature and pressure, typically ~10^-10 m^2/s) and S is the supersaturation. This means dr/dt is proportional to 1/r — small droplets grow faster in radius than large ones. Condensation narrows the size distribution. This is good for cloud formation but bad for rain — you need a BROAD distribution for collision-coalescence.

**Collision-coalescence** is a stochastic process. A larger droplet falls faster than a smaller one (terminal velocity scales as r^2 for small droplets). As it falls, it sweeps a cylindrical volume and collects smaller droplets in its path:

dm/dt = pi * (R + r)^2 * |V(R) - V(r)| * E(R,r) * LWC

where R is the collector radius, r is the collected radius, V is terminal velocity, E is the collection efficiency (probability of actual coalescence after collision), and LWC is the liquid water content.

The key insight: collision-coalescence is a **positive feedback**. Large droplets collect small ones, grow larger, fall faster, sweep more volume, collect more, grow faster. Once it starts, it runs away exponentially. This is why rain comes in bursts — the onset is sudden once the first few droplets cross the collision threshold.

For computational efficiency, we model this statistically rather than tracking every pairwise collision. We use the **stochastic collection equation** (Smoluchowski equation) applied to size bins.`,
      analogy: 'Condensation growth is like everyone in a crowd getting slightly taller at the same rate — the height distribution stays narrow. Collision-coalescence is like a snowball rolling downhill: the bigger it gets, the more snow it picks up, and the faster it grows. One process makes uniform clouds; the other makes rain. The challenge is bridging from the first regime to the second.',
      storyConnection: 'The pre-monsoon clouds over the Brahmaputra valley often stall in the condensation regime — plenty of small droplets, not enough large ones to trigger the collision cascade. The warm, humid air rising from the tea gardens and wetlands produces clouds with high droplet concentrations but narrow size distributions. When the southwest monsoon arrives with its vigorous updrafts, it forces droplets through the growth barrier. The story\'s stubborn cloud was stuck between these regimes, unable to make the leap from condensation to coalescence.',
      checkQuestion: 'Condensation makes all droplets more similar in size, but collision-coalescence needs size differences to work. How does nature bridge this contradiction? What breaks the symmetry of a narrow condensation-grown distribution?',
      checkAnswer: 'Several mechanisms break the symmetry: (1) Turbulence creates local variations in supersaturation, giving some droplets growth advantages. (2) Giant CCN (sea salt from ocean spray) produce a few oversized droplets that bypass the narrow distribution. (3) Entrainment of dry air at cloud edges partially evaporates some droplets, broadening the distribution. (4) Stochastic fluctuations — with millions of droplets, some will be lucky and grow slightly faster by chance. Cloud seeding adds a fifth mechanism: artificial nuclei that create outlier-size droplets or ice crystals by design.',
      codeIntro: 'Implement condensation growth and collision-coalescence, then simulate droplet evolution over 30 minutes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Physical constants
rho_w = 1000.0    # water density (kg/m^3)
g = 9.81          # gravity (m/s^2)
mu_air = 1.8e-5   # dynamic viscosity of air (Pa*s)
rho_air = 1.0     # air density (kg/m^3)

def terminal_velocity(r):
    """Terminal velocity for cloud droplets (Stokes regime for small r)."""
    # Stokes law: v = 2*rho_w*g*r^2 / (9*mu_air) for r < ~30um
    # Beard parameterization for larger drops
    v_stokes = 2 * rho_w * g * r**2 / (9 * mu_air)
    # Cap at realistic values for large drops
    return np.minimum(v_stokes, 9.0)  # max ~9 m/s for large raindrops

def condensation_step(radii, S, G, dt):
    """
    Grow droplets by condensation for one time step.
    r * dr = G * S * dt  =>  r_new = sqrt(r_old^2 + 2*G*S*dt)
    """
    r_squared = radii**2 + 2 * G * S * dt
    return np.sqrt(np.maximum(r_squared, 1e-12))

def collision_coalescence_step(radii, dt, cloud_volume=1e6):
    """
    Stochastic collision-coalescence using bin-pair sampling.
    For efficiency, we randomly pair droplets and check for collection.
    """
    n = len(radii)
    if n < 2:
        return radii

    new_radii = radii.copy()
    n_pairs = n // 4  # sample fraction of possible pairs

    # Random pairs
    idx = np.random.permutation(n)
    collectors = idx[:n_pairs]
    collected = idx[n_pairs:2*n_pairs]

    R = new_radii[collectors]
    r = new_radii[collected]

    # Ensure collector is always the larger one
    swap = R < r
    R_temp = R.copy()
    R[swap] = r[swap]
    r[swap] = R_temp[swap]
    temp_idx = collectors.copy()
    collectors[swap] = collected[swap]
    collected[swap] = temp_idx[swap]

    # Geometric collection kernel
    # K = pi * (R+r)^2 * |V(R) - V(r)| * E(R,r)
    dV = np.abs(terminal_velocity(R) - terminal_velocity(r))
    cross_section = np.pi * (R + r)**2

    # Collection efficiency (simplified Long kernel)
    # E increases with size ratio; large collectors are more efficient
    ratio = r / R
    E = np.where(R > 20e-6, 0.5 * (1 + ratio**2), 0.1 * ratio**2)
    E = np.clip(E, 0, 1)

    # Probability of collection in this time step
    # P = K * n_concentration * dt / cloud_volume
    n_conc = n / cloud_volume
    P_collect = cross_section * dV * E * n_conc * dt
    P_collect = np.clip(P_collect, 0, 0.5)

    # Stochastic collection: each pair collects with probability P
    collect_mask = np.random.random(n_pairs) < P_collect

    if np.any(collect_mask):
        # Mass conservation: new collector mass = old collector + collected
        R_collect = R[collect_mask]
        r_collect = r[collect_mask]
        new_R = (R_collect**3 + r_collect**3)**(1/3)

        new_radii[collectors[collect_mask]] = new_R
        new_radii[collected[collect_mask]] = 0  # absorbed

    return new_radii

def simulate_cloud(n_droplets=5000, duration_minutes=30, dt=5.0, S=0.005, G=1e-10):
    """Run the full droplet growth simulation."""
    n_steps = int(duration_minutes * 60 / dt)

    # Initialize: gamma distribution centered at ~10 um
    shape = 6.0
    scale = 10e-6 / shape
    radii = np.random.gamma(shape, scale, n_droplets)
    radii = np.clip(radii, 1e-6, 50e-6)

    # History tracking
    history = {
        'times': [],
        'mean_r': [],
        'max_r': [],
        'std_r': [],
        'n_active': [],
        'n_precip': [],
        'distributions': [],
    }

    precip_total = 0.0  # total precipitated water mass (relative)

    for step in range(n_steps):
        t = step * dt / 60  # minutes
        active = radii > 0

        if step % max(1, n_steps // 10) == 0:
            active_radii = radii[active]
            history['times'].append(t)
            history['mean_r'].append(np.mean(active_radii) * 1e6 if len(active_radii) > 0 else 0)
            history['max_r'].append(np.max(active_radii) * 1e6 if len(active_radii) > 0 else 0)
            history['std_r'].append(np.std(active_radii) * 1e6 if len(active_radii) > 0 else 0)
            history['n_active'].append(np.sum(active))
            history['n_precip'].append(n_droplets - np.sum(active))
            history['distributions'].append(active_radii.copy())

        # Step 1: Condensation
        radii[active] = condensation_step(radii[active], S, G, dt)

        # Step 2: Collision-coalescence (only among active droplets)
        active_idx = np.where(active)[0]
        if len(active_idx) > 10:
            active_radii = radii[active_idx]
            new_radii = collision_coalescence_step(active_radii, dt)
            radii[active_idx] = new_radii

        # Step 3: Precipitation — droplets > 100um fall out
        precip_mask = (radii > 100e-6) & active
        if np.any(precip_mask):
            precip_total += np.sum(radii[precip_mask]**3)  # proportional to mass
            radii[precip_mask] = 0  # removed from cloud

    return history, precip_total

# Run simulation
print("Running droplet growth simulation (5000 droplets, 30 minutes)...")
history, precip = simulate_cloud()

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Droplet Growth: Condensation + Collision-Coalescence', color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

# Panel 1: Mean radius over time
ax = axes[0, 0]
ax.plot(history['times'], history['mean_r'], color='#3b82f6', linewidth=2, label='Mean radius')
ax.plot(history['times'], history['max_r'], color='#ef4444', linewidth=2, label='Max radius')
ax.axhline(y=100, color='#ec4899', linewidth=1, linestyle=':', alpha=0.6)
ax.text(1, 105, 'Rain threshold', color='#ec4899', fontsize=8)
ax.set_xlabel('Time (minutes)', color='white')
ax.set_ylabel('Radius (um)', color='white')
ax.set_title('Droplet size evolution', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 2: Size distribution spread
ax = axes[0, 1]
ax.plot(history['times'], history['std_r'], color='#f59e0b', linewidth=2)
ax.set_xlabel('Time (minutes)', color='white')
ax.set_ylabel('Std dev of radius (um)', color='white')
ax.set_title('Distribution broadening', color='white', fontsize=11, fontweight='bold')

# Panel 3: Active droplets vs precipitated
ax = axes[0, 2]
ax.plot(history['times'], history['n_active'], color='#3b82f6', linewidth=2, label='Active in cloud')
ax.plot(history['times'], history['n_precip'], color='#22c55e', linewidth=2, label='Precipitated')
ax.set_xlabel('Time (minutes)', color='white')
ax.set_ylabel('Number of droplets', color='white')
ax.set_title('Precipitation onset', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 4-6: Size distributions at different times
dist_indices = [0, len(history['distributions']) // 2, -1]
dist_labels = ['Initial', 'Midpoint', 'Final']
dist_colors = ['#3b82f6', '#f59e0b', '#22c55e']

for i, (idx, label, color) in enumerate(zip(dist_indices, dist_labels, dist_colors)):
    ax = axes[1, i]
    dist = history['distributions'][idx]
    if len(dist) > 0:
        bins = np.logspace(np.log10(1e-6), np.log10(max(1e-3, dist.max() * 2)), 40)
        ax.hist(dist * 1e6, bins=bins * 1e6, color=color, alpha=0.8, edgecolor='none')
        ax.set_xscale('log')
        ax.axvline(x=100, color='#ec4899', linewidth=1, linestyle=':', alpha=0.6)
    t = history['times'][idx]
    ax.set_xlabel('Radius (um)', color='white')
    ax.set_ylabel('Count', color='white')
    ax.set_title(f'{label} (t={t:.0f} min, n={len(dist)})', color='white', fontsize=11, fontweight='bold')

plt.tight_layout()
plt.show()

print()
print("Droplet Growth Simulation Results")
print("=" * 55)
print(f"  Duration: 30 minutes")
print(f"  Initial droplets: 5000")
print(f"  Final active: {history['n_active'][-1]}")
print(f"  Precipitated: {history['n_precip'][-1]}")
print(f"  Mean radius: {history['mean_r'][0]:.1f} -> {history['mean_r'][-1]:.1f} um")
print(f"  Max radius:  {history['max_r'][0]:.1f} -> {history['max_r'][-1]:.1f} um")
print(f"  Std dev:     {history['std_r'][0]:.1f} -> {history['std_r'][-1]:.1f} um")
print(f"  Total precipitation (relative): {precip:.2e}")
print()
print("The collision-coalescence cascade broadens the distribution")
print("and creates the large droplets needed for rain. Next: add seeding.")`,
      challenge: 'Add turbulence to the model: at each step, add random perturbations to the supersaturation experienced by each droplet (S_i = S_mean + sigma * randn()). Run the simulation with and without turbulence and compare how fast the distribution broadens. Turbulence should accelerate rain onset by creating lucky droplets that grow faster than average.',
      successHint: 'The condensation-coalescence interaction is the engine of warm rain. Condensation grows the population uniformly; coalescence selectively grows the lucky few. Understanding this interplay is essential before adding the complexity of ice physics and seeding.',
    },
    {
      title: 'Seeding agent simulation — silver iodide and ice nucleation',
      concept: `Now we add the seeding module. When silver iodide particles enter a supercooled cloud, they trigger heterogeneous ice nucleation. The new ice crystals then grow via the Bergeron process — stealing vapor from surrounding liquid droplets.

The simulation adds these physics:

**Ice nucleation**: At each time step, for each liquid droplet in a supercooled region (T < 0C), calculate the probability of freezing:
- **Immersion freezing**: An AgI particle immersed in a supercooled droplet triggers freezing. Probability increases exponentially with supercooling: P = 1 - exp(-J * V * dt), where J is the nucleation rate and V is the droplet volume.
- **Contact freezing**: An AgI particle collides with a supercooled droplet surface. Probability depends on AgI concentration and droplet collection area.

**Bergeron growth**: Once a droplet freezes, it becomes an ice crystal. In the mixed-phase zone (0 to -38C), ice crystals experience supersaturation with respect to ice even when the air is only saturated with respect to liquid. The ice growth rate is:

dm/dt = 4*pi*C*S_i*G_ice

where C is the crystal capacitance (shape factor), S_i is the ice supersaturation, and G_ice combines diffusion and thermal conductivity effects.

**Riming**: Ice crystals falling through liquid droplets collect them (like collision-coalescence but ice+liquid). This produces graupel — heavily rimed ice particles that can grow very quickly and fall as precipitation.

The seeding toggle: we inject AgI particles at a specified concentration (typically 1-10 per liter of air). Each AgI particle can nucleate one ice crystal. The simulation compares total precipitation with and without these additional nuclei.`,
      analogy: 'Seeding a supercooled cloud with AgI is like dropping a single crystal of salt into a supersaturated salt solution. The solution has more dissolved salt than it can stably hold, but nothing triggers crystallization until you provide a seed crystal. The moment the seed touches the liquid, crystals erupt and grow rapidly. Silver iodide does the same thing to supercooled water — it provides the template that ice needs to form.',
      storyConnection: 'India\'s cloud seeding operations have used both silver iodide flares from aircraft and ground-based generators in mountainous regions. The Assam valley\'s pre-monsoon thunderstorms are prime candidates for glaciogenic seeding because they have deep supercooled layers (tops reaching -30C or colder). A well-timed AgI release at cloud base could trigger ice nucleation throughout the upper cloud, initiating the Bergeron process that the cloud could not start on its own.',
      checkQuestion: 'If you release too much silver iodide (overseeding), you could actually REDUCE rainfall. Why? Think about what happens to the droplet size distribution.',
      checkAnswer: 'Overseeding creates too many ice crystals. The available water vapor is distributed among many crystals, so each one grows less. Instead of a few large ice crystals that fall as rain, you get many small crystals that remain suspended (like the original small-droplet problem, but with ice). You have replaced one narrow distribution problem with another. This is called the "overseeding" effect and it is a real operational concern. Optimal seeding requires a Goldilocks amount of AgI — enough to trigger a few fast-growing crystals, not so many that none grow large enough to precipitate.',
      codeIntro: 'Add ice nucleation and Bergeron process to the simulator, with a seeding agent toggle.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

rho_w = 1000.0
rho_ice = 917.0
g = 9.81
mu_air = 1.8e-5

def terminal_velocity(r, phase=0):
    """Terminal velocity (liquid or ice)."""
    rho = rho_w if phase == 0 else rho_ice
    v = 2 * rho * g * r**2 / (9 * mu_air)
    return np.minimum(v, 9.0)

def sat_pressure_liquid(T_C):
    return 610.78 * np.exp(17.27 * T_C / (T_C + 237.3))

def sat_pressure_ice(T_C):
    return 610.78 * np.exp(21.875 * T_C / (T_C + 265.5))

def simulate_with_seeding(n_droplets=5000, duration_min=30, dt=5.0,
                           S=0.005, G=1e-10, T_base=15.0, T_top=-25.0,
                           cloud_depth=3000.0, seed_AgI=False, n_AgI_per_liter=0):
    """
    Full cloud simulation with optional AgI seeding.
    Returns time series of statistics and total precipitation.
    """
    n_steps = int(duration_min * 60 / dt)
    lapse = (T_base - T_top) / cloud_depth

    # Initialize droplets
    shape = 6.0
    scale = 10e-6 / shape
    radii = np.random.gamma(shape, scale, n_droplets)
    radii = np.clip(radii, 1e-6, 50e-6)

    heights = np.random.uniform(0, cloud_depth, n_droplets)
    phase = np.zeros(n_droplets, dtype=int)  # 0=liquid, 1=ice
    active = np.ones(n_droplets, dtype=bool)

    # Seeding: add AgI nuclei at supercooled heights
    if seed_AgI and n_AgI_per_liter > 0:
        # AgI concentration in the supercooled layer
        freezing_height = (T_base - 0) / lapse  # height where T=0
        supercooled_volume = (cloud_depth - freezing_height) * 1e6  # liters (1m^3 = 1000L, rough)
        n_AgI = int(n_AgI_per_liter * supercooled_volume / 1e6)  # scale to simulation
        n_AgI = min(n_AgI, n_droplets // 10)  # cap for simulation feasibility

        # AgI nuclei start as small ice crystals at random supercooled heights
        for i in range(n_AgI):
            idx = np.random.randint(n_droplets)
            if active[idx] and heights[idx] > freezing_height:
                phase[idx] = 1  # convert to ice
                radii[idx] = max(radii[idx], 15e-6)  # AgI produces larger initial crystals

    # History
    times_hist = []
    mean_r_hist = []
    max_r_hist = []
    n_ice_hist = []
    n_liquid_hist = []
    n_precip_hist = []
    precip_mass = 0.0

    for step in range(n_steps):
        t = step * dt / 60

        if step % max(1, n_steps // 20) == 0:
            act = active & (radii > 0)
            times_hist.append(t)
            mean_r_hist.append(np.mean(radii[act]) * 1e6 if np.any(act) else 0)
            max_r_hist.append(np.max(radii[act]) * 1e6 if np.any(act) else 0)
            n_ice_hist.append(np.sum(phase[act] == 1))
            n_liquid_hist.append(np.sum(phase[act] == 0))
            n_precip_hist.append(np.sum(~active))

        # Temperature at each droplet's height
        temps = T_base - lapse * heights

        # --- CONDENSATION ---
        act_liquid = active & (phase == 0) & (radii > 0)
        if np.any(act_liquid):
            radii[act_liquid] = np.sqrt(radii[act_liquid]**2 + 2 * G * S * dt)

        # --- BERGERON PROCESS (ice growth in mixed-phase region) ---
        act_ice = active & (phase == 1) & (radii > 0)
        if np.any(act_ice):
            # Ice supersaturation: (e_liquid - e_ice) / e_ice
            T_ice = temps[act_ice]
            e_l = sat_pressure_liquid(T_ice)
            e_i = sat_pressure_ice(T_ice)
            S_ice = np.where(T_ice < 0, (e_l - e_i) / e_i, 0)

            # Ice growth: r*dr = G_ice * S_ice * dt
            G_ice = 5e-10  # ice growth parameter (faster than liquid condensation)
            dr = G_ice * S_ice / np.maximum(radii[act_ice], 1e-7) * dt
            radii[act_ice] += np.maximum(dr, 0)

        # --- ICE NUCLEATION (stochastic freezing of supercooled droplets) ---
        supercooled = active & (phase == 0) & (temps < 0) & (radii > 0)
        if np.any(supercooled):
            T_sc = temps[supercooled]
            # Nucleation probability: increases exponentially with supercooling
            # Homogeneous: only below -35C
            # Heterogeneous (natural): sparse, depends on natural ice nuclei
            delta_T = -T_sc  # supercooling magnitude
            # Natural freezing rate: ~1 per 1000 droplets per timestep at -15C
            J_natural = 1e-4 * np.exp(0.1 * delta_T)  # per droplet per second
            P_freeze = 1 - np.exp(-J_natural * dt)
            freeze_mask = np.random.random(np.sum(supercooled)) < P_freeze

            idx_sc = np.where(supercooled)[0]
            phase[idx_sc[freeze_mask]] = 1

        # --- COLLISION-COALESCENCE ---
        act_idx = np.where(active & (radii > 0))[0]
        if len(act_idx) > 10:
            n_pairs = len(act_idx) // 4
            perm = np.random.permutation(len(act_idx))
            if 2 * n_pairs <= len(act_idx):
                c1 = act_idx[perm[:n_pairs]]
                c2 = act_idx[perm[n_pairs:2*n_pairs]]

                R = np.maximum(radii[c1], radii[c2])
                r = np.minimum(radii[c1], radii[c2])
                bigger = np.where(radii[c1] >= radii[c2], c1, c2)
                smaller = np.where(radii[c1] >= radii[c2], c2, c1)

                dV = np.abs(terminal_velocity(R) - terminal_velocity(r))
                cross = np.pi * (R + r)**2
                ratio = r / np.maximum(R, 1e-8)
                E = np.where(R > 20e-6, 0.5 * (1 + ratio**2), 0.1 * ratio**2)
                E = np.clip(E, 0, 1)

                n_conc = len(act_idx) / 1e6
                P = cross * dV * E * n_conc * dt
                P = np.clip(P, 0, 0.3)

                collect = np.random.random(n_pairs) < P
                if np.any(collect):
                    new_R = (R[collect]**3 + r[collect]**3)**(1/3)
                    radii[bigger[collect]] = new_R
                    radii[smaller[collect]] = 0
                    active[smaller[collect]] = False

        # --- PRECIPITATION ---
        precip_mask = active & (radii > 100e-6)
        if np.any(precip_mask):
            precip_mass += np.sum((4/3) * np.pi * radii[precip_mask]**3 * rho_w)
            active[precip_mask] = False
            radii[precip_mask] = 0

    return {
        'times': times_hist,
        'mean_r': mean_r_hist,
        'max_r': max_r_hist,
        'n_ice': n_ice_hist,
        'n_liquid': n_liquid_hist,
        'n_precip': n_precip_hist,
        'precip_mass': precip_mass,
    }

# Run both scenarios
print("Running unseeded simulation...")
result_no_seed = simulate_with_seeding(seed_AgI=False)

print("Running seeded simulation (5 AgI/liter)...")
np.random.seed(42)  # same initial conditions
result_seeded = simulate_with_seeding(seed_AgI=True, n_AgI_per_liter=5)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Cloud Seeding Effect: Unseeded vs Seeded', color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

# Panel 1: Mean radius
ax = axes[0, 0]
ax.plot(result_no_seed['times'], result_no_seed['mean_r'], color='#3b82f6', linewidth=2, label='Unseeded')
ax.plot(result_seeded['times'], result_seeded['mean_r'], color='#22c55e', linewidth=2, label='Seeded (5 AgI/L)')
ax.set_xlabel('Time (min)', color='white')
ax.set_ylabel('Mean radius (um)', color='white')
ax.set_title('Mean droplet size', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 2: Max radius
ax = axes[0, 1]
ax.plot(result_no_seed['times'], result_no_seed['max_r'], color='#3b82f6', linewidth=2, label='Unseeded')
ax.plot(result_seeded['times'], result_seeded['max_r'], color='#22c55e', linewidth=2, label='Seeded')
ax.axhline(y=100, color='#ec4899', linewidth=1, linestyle=':', alpha=0.6)
ax.set_xlabel('Time (min)', color='white')
ax.set_ylabel('Max radius (um)', color='white')
ax.set_title('Largest particle', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 3: Ice vs liquid
ax = axes[0, 2]
ax.plot(result_no_seed['times'], result_no_seed['n_ice'], color='#3b82f6', linewidth=2, linestyle='--', label='Ice (unseeded)')
ax.plot(result_seeded['times'], result_seeded['n_ice'], color='#22c55e', linewidth=2, label='Ice (seeded)')
ax.plot(result_no_seed['times'], result_no_seed['n_liquid'], color='#3b82f6', linewidth=1, alpha=0.5, label='Liquid (unseeded)')
ax.plot(result_seeded['times'], result_seeded['n_liquid'], color='#22c55e', linewidth=1, alpha=0.5, label='Liquid (seeded)')
ax.set_xlabel('Time (min)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Phase partition', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# Panel 4: Precipitation accumulation
ax = axes[1, 0]
ax.plot(result_no_seed['times'], result_no_seed['n_precip'], color='#3b82f6', linewidth=2, label='Unseeded')
ax.plot(result_seeded['times'], result_seeded['n_precip'], color='#22c55e', linewidth=2, label='Seeded')
ax.set_xlabel('Time (min)', color='white')
ax.set_ylabel('Precipitated droplets', color='white')
ax.set_title('Precipitation count', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 5: Precipitation mass comparison
ax = axes[1, 1]
masses = [result_no_seed['precip_mass'], result_seeded['precip_mass']]
bars = ax.bar(['Unseeded', 'Seeded'], masses, color=['#3b82f6', '#22c55e'], alpha=0.8)
for bar, mass in zip(bars, masses):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() * 1.02,
            f'{mass:.2e}', ha='center', color='white', fontsize=10)
ax.set_ylabel('Precipitated mass (kg, relative)', color='white')
ax.set_title('Total precipitation', color='white', fontsize=11, fontweight='bold')

# Panel 6: Enhancement ratio
ax = axes[1, 2]
if result_no_seed['precip_mass'] > 0:
    enhancement = result_seeded['precip_mass'] / result_no_seed['precip_mass']
else:
    enhancement = float('inf') if result_seeded['precip_mass'] > 0 else 1.0

ax.bar(['Enhancement\
ratio'], [enhancement], color='#f59e0b', alpha=0.8, width=0.4)
ax.axhline(y=1.0, color='white', linewidth=1, linestyle='--', alpha=0.5)
ax.text(0, enhancement + 0.05, f'{enhancement:.2f}x', ha='center', color='white', fontsize=14, fontweight='bold')
ax.set_ylabel('Seeded / Unseeded', color='white')
ax.set_title('Seeding effectiveness', color='white', fontsize=11, fontweight='bold')

plt.tight_layout()
plt.show()

print("Seeding Comparison Results")
print("=" * 55)
print(f"  Unseeded precipitation mass: {result_no_seed['precip_mass']:.4e}")
print(f"  Seeded precipitation mass:   {result_seeded['precip_mass']:.4e}")
print(f"  Enhancement ratio:           {enhancement:.2f}x")
print(f"  Unseeded precip count:       {result_no_seed['n_precip'][-1]}")
print(f"  Seeded precip count:         {result_seeded['n_precip'][-1]}")
print()
print("The AgI nuclei trigger ice formation in supercooled regions.")
print("Ice crystals grow via Bergeron process, reach rain size faster.")
print("Result: earlier and greater precipitation from the seeded cloud.")`,
      challenge: 'Implement the overseeding experiment: run simulations with AgI concentrations of 0, 1, 5, 10, 50, and 100 per liter. Plot precipitation vs. AgI concentration. Find the optimal seeding rate — there should be a peak beyond which more AgI actually reduces rainfall.',
      successHint: 'The seeding simulation demonstrates the core mechanism: AgI triggers ice nucleation, ice grows via the Bergeron process, and the cloud produces more precipitation. But the enhancement depends critically on the seeding rate, cloud temperature, and available moisture. Real-world seeding is an optimization problem, not just a trigger.',
    },
    {
      title: 'Monte Carlo cloud simulation — millions of droplets and convergence',
      concept: `Our simulator uses 5,000 droplets, but real clouds contain billions per cubic meter. How do we know our results are meaningful? This is where **Monte Carlo methods** and **convergence analysis** become essential.

A Monte Carlo simulation uses random sampling to approximate a deterministic result. Our collision-coalescence model is inherently stochastic — we randomly pair droplets and probabilistically decide whether they merge. Different random seeds give different results. The question is: how many droplets do we need before the statistics stabilize?

**Convergence analysis**: Run the simulation at different population sizes (100, 500, 1000, 5000, 10000, 50000) and track how the output statistics (mean precipitation, time to first rain, precipitation enhancement ratio) change. When increasing N no longer significantly changes the results, you have converged.

**Ensemble statistics**: For a fixed N, run M independent realizations (different random seeds) and compute:
- Mean and standard deviation of each output metric
- Confidence intervals for the seeding enhancement ratio
- The distribution of outcomes (not just the mean)

This last point is crucial for cloud seeding evaluation. The mean enhancement might be 15%, but if the distribution spans -10% to +40%, you cannot confidently claim seeding works in any individual case. The simulation itself mirrors the real-world attribution problem from Level 3.

**Variance reduction techniques**:
- **Common random numbers**: Use the same initial droplet distribution for seeded and unseeded runs, only varying the seeding. This reduces the variance of the *difference* between scenarios.
- **Importance sampling**: Oversample rare but impactful events (like the formation of the first precipitation-sized droplet) and weight results accordingly.`,
      analogy: 'Monte Carlo simulation is like polling before an election. If you ask 10 people, you might get 70% support for a candidate. Ask 100 people, you get 52%. Ask 10,000, you get 48.3%. The true value does not change, but your estimate gets more precise with more samples. The key question is always: how many samples until my margin of error is acceptable? Running the cloud model 10 times with 1000 droplets is like running 10 small polls — you learn the range of possible outcomes.',
      storyConnection: 'When India evaluates its cloud seeding programs, the key question is always: "Was the extra rain due to seeding or natural variability?" Our Monte Carlo analysis quantifies exactly this uncertainty. If the simulator shows that natural variability can produce a 20% swing in rainfall, then a 15% increase after seeding is statistically meaningless — it could easily be chance. The tea planters of Assam investing in cloud seeding need to know: is this real, or are we seeing patterns in noise?',
      checkQuestion: 'You run 50 simulations of seeded and unseeded clouds. The mean precipitation increases by 12% with seeding, but the 95% confidence interval for the difference is [-5%, +29%]. What should you conclude?',
      checkAnswer: 'The confidence interval includes zero (no effect), so you cannot reject the null hypothesis that seeding has no effect at the 95% confidence level. The data are consistent with seeding having anywhere from a 5% negative effect to a 29% positive effect. You need more simulations (larger ensemble) or more droplets (lower variance per simulation) to narrow the interval. This is exactly the situation that real cloud seeding experiments face — the signal is small relative to natural variability, requiring enormous sample sizes for statistical significance.',
      codeIntro: 'Run ensemble simulations at multiple population sizes and compute convergence statistics and confidence intervals for the seeding enhancement.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)

rho_w = 1000.0
rho_ice = 917.0
g = 9.81
mu_air = 1.8e-5

def fast_simulate(n_droplets, duration_min=20, dt=5.0, S=0.005, G=1e-10,
                  T_base=15.0, T_top=-25.0, cloud_depth=3000.0,
                  seed_AgI=False, n_AgI_per_liter=5, rng_seed=None):
    """Compact simulation for ensemble runs."""
    if rng_seed is not None:
        np.random.seed(rng_seed)

    n_steps = int(duration_min * 60 / dt)
    lapse = (T_base - T_top) / cloud_depth

    shape = 6.0
    scale = 10e-6 / shape
    radii = np.random.gamma(shape, scale, n_droplets)
    radii = np.clip(radii, 1e-6, 50e-6)
    heights = np.random.uniform(0, cloud_depth, n_droplets)
    phase = np.zeros(n_droplets, dtype=int)
    active = np.ones(n_droplets, dtype=bool)

    # Seeding
    if seed_AgI:
        freezing_height = T_base / lapse
        n_AgI = min(int(n_AgI_per_liter * 50), n_droplets // 10)
        for _ in range(n_AgI):
            idx = np.random.randint(n_droplets)
            if active[idx] and heights[idx] > freezing_height:
                phase[idx] = 1
                radii[idx] = max(radii[idx], 15e-6)

    precip_mass = 0.0
    first_precip_time = None

    for step in range(n_steps):
        t = step * dt / 60
        temps = T_base - lapse * heights

        # Condensation
        liq = active & (phase == 0) & (radii > 0)
        if np.any(liq):
            radii[liq] = np.sqrt(radii[liq]**2 + 2 * G * S * dt)

        # Bergeron
        ice = active & (phase == 1) & (radii > 0)
        if np.any(ice):
            T_i = temps[ice]
            e_l = 610.78 * np.exp(17.27 * T_i / (T_i + 237.3))
            e_i = 610.78 * np.exp(21.875 * T_i / (T_i + 265.5))
            S_ice = np.where(T_i < 0, (e_l - e_i) / e_i, 0)
            dr = 5e-10 * S_ice / np.maximum(radii[ice], 1e-7) * dt
            radii[ice] += np.maximum(dr, 0)

        # Ice nucleation
        sc = active & (phase == 0) & (temps < 0) & (radii > 0)
        if np.any(sc):
            dT = -temps[sc]
            J = 1e-4 * np.exp(0.1 * dT)
            P = 1 - np.exp(-J * dt)
            freeze = np.random.random(np.sum(sc)) < P
            phase[np.where(sc)[0][freeze]] = 1

        # Collision-coalescence
        act_idx = np.where(active & (radii > 0))[0]
        if len(act_idx) > 10:
            n_pairs = len(act_idx) // 4
            perm = np.random.permutation(len(act_idx))
            if 2 * n_pairs <= len(act_idx):
                c1 = act_idx[perm[:n_pairs]]
                c2 = act_idx[perm[n_pairs:2*n_pairs]]
                R = np.maximum(radii[c1], radii[c2])
                r = np.minimum(radii[c1], radii[c2])
                bigger = np.where(radii[c1] >= radii[c2], c1, c2)
                smaller = np.where(radii[c1] >= radii[c2], c2, c1)
                dV = np.abs(2*rho_w*g*R**2/(9*mu_air) - 2*rho_w*g*r**2/(9*mu_air))
                cross = np.pi * (R+r)**2
                ratio = r / np.maximum(R, 1e-8)
                E = np.where(R > 20e-6, 0.5*(1+ratio**2), 0.1*ratio**2)
                P_c = np.clip(cross * dV * E * len(act_idx)/1e6 * dt, 0, 0.3)
                collect = np.random.random(n_pairs) < P_c
                if np.any(collect):
                    radii[bigger[collect]] = (R[collect]**3 + r[collect]**3)**(1/3)
                    radii[smaller[collect]] = 0
                    active[smaller[collect]] = False

        # Precipitation
        pm = active & (radii > 100e-6)
        if np.any(pm):
            precip_mass += np.sum((4/3)*np.pi*radii[pm]**3*rho_w)
            if first_precip_time is None:
                first_precip_time = t
            active[pm] = False
            radii[pm] = 0

    return precip_mass, first_precip_time if first_precip_time else duration_min

# Convergence analysis: different population sizes
print("Running convergence analysis...")
pop_sizes = [200, 500, 1000, 2000, 5000]
n_ensemble = 15

convergence = {n: {'unseeded': [], 'seeded': [], 'ratio': []} for n in pop_sizes}

for n in pop_sizes:
    for trial in range(n_ensemble):
        seed = trial * 1000
        m_uns, _ = fast_simulate(n, seed_AgI=False, rng_seed=seed)
        m_sed, _ = fast_simulate(n, seed_AgI=True, rng_seed=seed)
        convergence[n]['unseeded'].append(m_uns)
        convergence[n]['seeded'].append(m_sed)
        ratio = m_sed / m_uns if m_uns > 0 else 1.0
        convergence[n]['ratio'].append(ratio)
    print(f"  N={n}: done ({n_ensemble} trials)")

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Monte Carlo Convergence & Ensemble Analysis', color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

# Panel 1: Mean precipitation vs N
ax = axes[0, 0]
means_uns = [np.mean(convergence[n]['unseeded']) for n in pop_sizes]
means_sed = [np.mean(convergence[n]['seeded']) for n in pop_sizes]
stds_uns = [np.std(convergence[n]['unseeded']) for n in pop_sizes]
stds_sed = [np.std(convergence[n]['seeded']) for n in pop_sizes]

ax.errorbar(pop_sizes, means_uns, yerr=stds_uns, color='#3b82f6', linewidth=2,
            marker='o', capsize=5, label='Unseeded')
ax.errorbar(pop_sizes, means_sed, yerr=stds_sed, color='#22c55e', linewidth=2,
            marker='s', capsize=5, label='Seeded')
ax.set_xscale('log')
ax.set_xlabel('Number of droplets', color='white')
ax.set_ylabel('Mean precip mass', color='white')
ax.set_title('Convergence of precipitation', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 2: Coefficient of variation vs N
ax = axes[0, 1]
cv_uns = [np.std(convergence[n]['unseeded'])/max(np.mean(convergence[n]['unseeded']), 1e-20) for n in pop_sizes]
cv_sed = [np.std(convergence[n]['seeded'])/max(np.mean(convergence[n]['seeded']), 1e-20) for n in pop_sizes]
ax.plot(pop_sizes, cv_uns, 'o-', color='#3b82f6', linewidth=2, label='Unseeded')
ax.plot(pop_sizes, cv_sed, 's-', color='#22c55e', linewidth=2, label='Seeded')
ax.set_xscale('log')
ax.set_xlabel('Number of droplets', color='white')
ax.set_ylabel('Coefficient of variation', color='white')
ax.set_title('Variance reduction with N', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 3: Enhancement ratio distribution (largest N)
ax = axes[0, 2]
largest_n = pop_sizes[-1]
ratios = convergence[largest_n]['ratio']
ax.hist(ratios, bins=15, color='#f59e0b', alpha=0.8, edgecolor='none')
mean_ratio = np.mean(ratios)
ci_low, ci_high = np.percentile(ratios, [2.5, 97.5])
ax.axvline(x=mean_ratio, color='#ef4444', linewidth=2, linestyle='-',
           label=f'Mean: {mean_ratio:.2f}x')
ax.axvline(x=ci_low, color='#a855f7', linewidth=1.5, linestyle='--',
           label=f'95% CI: [{ci_low:.2f}, {ci_high:.2f}]')
ax.axvline(x=ci_high, color='#a855f7', linewidth=1.5, linestyle='--')
ax.axvline(x=1.0, color='white', linewidth=1, linestyle=':', alpha=0.5)
ax.set_xlabel('Seeded/Unseeded ratio', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title(f'Enhancement distribution (N={largest_n})', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# Panel 4: Bootstrap confidence interval for enhancement
ax = axes[1, 0]
# Bootstrap resampling of the enhancement ratio
n_bootstrap = 5000
bootstrap_means = []
for _ in range(n_bootstrap):
    idx = np.random.choice(len(ratios), size=len(ratios), replace=True)
    bootstrap_means.append(np.mean(np.array(ratios)[idx]))

ax.hist(bootstrap_means, bins=40, color='#a855f7', alpha=0.8, edgecolor='none')
boot_ci_low, boot_ci_high = np.percentile(bootstrap_means, [2.5, 97.5])
ax.axvline(x=np.mean(bootstrap_means), color='#ef4444', linewidth=2,
           label=f'Mean: {np.mean(bootstrap_means):.3f}')
ax.axvline(x=boot_ci_low, color='#f59e0b', linewidth=1.5, linestyle='--',
           label=f'95% CI: [{boot_ci_low:.3f}, {boot_ci_high:.3f}]')
ax.axvline(x=boot_ci_high, color='#f59e0b', linewidth=1.5, linestyle='--')
ax.axvline(x=1.0, color='white', linewidth=1, linestyle=':', alpha=0.5)
ax.set_xlabel('Bootstrap mean enhancement', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Bootstrap CI for mean enhancement', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# Panel 5: Common random numbers vs independent
ax = axes[1, 1]
# Common random numbers: same seed for unseeded/seeded
paired_diffs = [convergence[largest_n]['seeded'][i] - convergence[largest_n]['unseeded'][i]
                for i in range(n_ensemble)]
# Independent: shuffle the pairing
unpaired_diffs = []
for _ in range(1000):
    idx_u = np.random.choice(n_ensemble)
    idx_s = np.random.choice(n_ensemble)
    d = convergence[largest_n]['seeded'][idx_s] - convergence[largest_n]['unseeded'][idx_u]
    unpaired_diffs.append(d)

ax.hist(unpaired_diffs, bins=30, alpha=0.6, color='#ef4444', label=f'Independent (std={np.std(unpaired_diffs):.2e})')
ax.hist(paired_diffs, bins=10, alpha=0.8, color='#22c55e', label=f'Paired/CRN (std={np.std(paired_diffs):.2e})')
ax.axvline(x=0, color='white', linewidth=1, linestyle=':', alpha=0.5)
ax.set_xlabel('Seeded - Unseeded mass', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Variance reduction via CRN', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# Panel 6: Summary statistics table
ax = axes[1, 2]
ax.axis('off')

summary = f"""MONTE CARLO RESULTS
{'='*45}

Population sizes tested: {pop_sizes}
Ensemble size: {n_ensemble} trials each

Largest ensemble (N={largest_n}):
  Mean enhancement: {mean_ratio:.3f}x
  95% CI: [{ci_low:.3f}, {ci_high:.3f}]
  Bootstrap CI: [{boot_ci_low:.3f}, {boot_ci_high:.3f}]

Includes 1.0 in CI? {'YES - not significant' if ci_low <= 1.0 <= ci_high else 'NO - significant'}

Variance reduction (CRN):
  Independent std: {np.std(unpaired_diffs):.2e}
  Paired std:      {np.std(paired_diffs):.2e}
  Reduction:       {np.std(unpaired_diffs)/max(np.std(paired_diffs),1e-20):.1f}x"""

ax.text(0.05, 0.95, summary, transform=ax.transAxes, fontsize=9.5,
        color='#22c55e', fontfamily='monospace', verticalalignment='top',
        bbox=dict(boxstyle='round', facecolor='#111827', edgecolor='#22c55e', alpha=0.8))

plt.tight_layout()
plt.show()

print()
print("Monte Carlo Analysis Complete")
print("=" * 55)
for n in pop_sizes:
    r = convergence[n]['ratio']
    print(f"  N={n:>5d}: enhancement = {np.mean(r):.3f} +/- {np.std(r):.3f}")
print()
print(f"95% confidence interval for enhancement: [{ci_low:.3f}, {ci_high:.3f}]")
sig = "statistically significant" if ci_low > 1.0 else "NOT statistically significant"
print(f"Seeding effect is {sig} at the 95% level.")
print()
print("This mirrors the real-world problem: detecting a ~10-15% signal")
print("in a highly variable system requires many experiments.")`,
      challenge: 'Implement importance sampling: identify the "critical droplets" (those near the collision threshold of ~40um) and oversample their growth trajectories. Weight the results inversely by sampling probability. Compare the variance of the precipitation estimate with and without importance sampling at the same computational cost.',
      successHint: 'Monte Carlo methods turn a stochastic model into quantitative predictions with uncertainty bounds. The convergence analysis tells you how much to trust your results. The confidence interval for seeding enhancement connects directly to the real-world debate: is the signal real or noise?',
    },
    {
      title: 'Effectiveness analysis — seeded vs unseeded statistical comparison',
      concept: `With our ensemble of simulations, we can now conduct a rigorous statistical comparison between seeded and unseeded outcomes. This is the computational analog of a randomized cloud seeding experiment.

We need to answer three questions:

**1. Is the mean precipitation different?** Use a paired t-test (or Wilcoxon signed-rank test for non-normal data) on the paired differences (same initial conditions, different seeding). The null hypothesis is that seeding has no effect.

**2. How large is the effect?** Report the **effect size** (Cohen's d or the ratio of means), not just the p-value. A statistically significant result with a tiny effect size is scientifically unimportant. Conversely, a large effect with wide confidence intervals may be promising but uncertain.

**3. How sensitive is the result to conditions?** Run the comparison at different temperatures, moisture levels, and updraft speeds. Cloud seeding might work well for cold continental clouds but poorly for warm tropical ones. A result that only holds under narrow conditions has limited practical value.

**Sensitivity analysis**: Systematically vary input parameters and track how the seeding enhancement changes. This reveals which cloud properties most strongly control seeding effectiveness — information that is directly actionable for operational programs. If enhancement is high only for clouds with tops colder than -15C, you can target those clouds specifically.

This analysis pipeline — ensemble simulation, hypothesis testing, effect size estimation, and sensitivity analysis — is the standard workflow in computational atmospheric science and many other fields.`,
      analogy: 'This is like a clinical trial for a new drug. You do not just give it to 10 people and see if they get better. You run a randomized trial with hundreds of patients, measure the outcome precisely, compute the effect size and confidence interval, and check whether the drug works differently for subgroups (age, severity, genetics). Our simulation ensemble is the trial; each simulation is a patient; the seeding is the drug; precipitation is the outcome.',
      storyConnection: 'The All India Coordinated Project on Artificial Rain (1983-1993) ran cloud seeding trials across multiple Indian states. Results were mixed — some regions showed modest increases, others showed no effect or even decreases. Our sensitivity analysis explains why: seeding effectiveness depends on cloud type, temperature, and moisture. A single nationwide verdict of "seeding works" or "seeding fails" is meaningless. The right question is: for which specific cloud conditions does seeding work, and do those conditions occur over Assam\'s tea country?',
      checkQuestion: 'Your sensitivity analysis shows seeding works best for clouds with tops at -20C and moderate updraft (2 m/s), but shows no effect for warm clouds (tops > -5C) or very strong updrafts (> 10 m/s). What physical explanations account for these patterns?',
      checkAnswer: 'For warm cloud tops (> -5C): there is little supercooled water, so AgI cannot trigger the Bergeron process. No ice nucleation, no effect. For very strong updrafts (> 10 m/s): droplets are lofted so rapidly that they grow efficiently by condensation and collision-coalescence without seeding help — the cloud was already going to rain heavily. Seeding adds little to an already efficient process. The sweet spot at -20C with moderate updraft means: plenty of supercooled water available (Bergeron can work), but the natural precipitation process is marginal (so the extra nuclei make a difference). This is why cloud selection is the most important factor in operational seeding.',
      codeIntro: 'Run paired ensemble comparisons with statistical tests, effect size estimation, and sensitivity analysis across cloud parameters.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

rho_w = 1000.0
g = 9.81
mu_air = 1.8e-5

def fast_sim(n_drop=2000, dur=15, dt=5.0, S=0.005, G=1e-10,
             T_base=15.0, T_top=-25.0, depth=3000.0,
             seed=False, n_agi=5, rng=None):
    """Compact simulation for batch runs."""
    if rng is not None:
        np.random.seed(rng)
    n_steps = int(dur * 60 / dt)
    lapse = (T_base - T_top) / depth

    radii = np.clip(np.random.gamma(6, 10e-6/6, n_drop), 1e-6, 50e-6)
    heights = np.random.uniform(0, depth, n_drop)
    phase = np.zeros(n_drop, dtype=int)
    active = np.ones(n_drop, dtype=bool)

    if seed:
        fh = T_base / lapse if lapse > 0 else depth
        n_a = min(int(n_agi * 30), n_drop // 10)
        for _ in range(n_a):
            idx = np.random.randint(n_drop)
            if active[idx] and heights[idx] > fh:
                phase[idx] = 1
                radii[idx] = max(radii[idx], 15e-6)

    precip = 0.0
    for step in range(n_steps):
        temps = T_base - lapse * heights
        liq = active & (phase==0) & (radii>0)
        if np.any(liq):
            radii[liq] = np.sqrt(radii[liq]**2 + 2*G*S*dt)

        ice = active & (phase==1) & (radii>0)
        if np.any(ice):
            Ti = temps[ice]
            el = 610.78*np.exp(17.27*Ti/(Ti+237.3))
            ei = 610.78*np.exp(21.875*Ti/(Ti+265.5))
            Si = np.where(Ti<0, (el-ei)/ei, 0)
            dr = 5e-10*Si/np.maximum(radii[ice],1e-7)*dt
            radii[ice] += np.maximum(dr, 0)

        sc = active & (phase==0) & (temps<0) & (radii>0)
        if np.any(sc):
            dT = -temps[sc]
            J = 1e-4*np.exp(0.1*dT)
            P = 1-np.exp(-J*dt)
            freeze = np.random.random(np.sum(sc)) < P
            phase[np.where(sc)[0][freeze]] = 1

        ai = np.where(active & (radii>0))[0]
        if len(ai) > 10:
            np2 = len(ai)//4
            pm = np.random.permutation(len(ai))
            if 2*np2 <= len(ai):
                c1, c2 = ai[pm[:np2]], ai[pm[np2:2*np2]]
                R = np.maximum(radii[c1],radii[c2])
                r = np.minimum(radii[c1],radii[c2])
                bg = np.where(radii[c1]>=radii[c2],c1,c2)
                sm = np.where(radii[c1]>=radii[c2],c2,c1)
                dV = np.abs(2*rho_w*g/(9*mu_air)*(R**2-r**2))
                cs = np.pi*(R+r)**2
                rt = r/np.maximum(R,1e-8)
                E = np.where(R>20e-6, 0.5*(1+rt**2), 0.1*rt**2)
                Pc = np.clip(cs*dV*E*len(ai)/1e6*dt, 0, 0.3)
                coll = np.random.random(np2) < Pc
                if np.any(coll):
                    radii[bg[coll]] = (R[coll]**3+r[coll]**3)**(1/3)
                    radii[sm[coll]] = 0
                    active[sm[coll]] = False

        prm = active & (radii>100e-6)
        if np.any(prm):
            precip += np.sum((4/3)*np.pi*radii[prm]**3*rho_w)
            active[prm] = False
            radii[prm] = 0

    return precip

# Run paired ensemble
n_trials = 30
print(f"Running {n_trials} paired trials...")

unseeded = []
seeded = []
for i in range(n_trials):
    u = fast_sim(seed=False, rng=i*1000)
    s = fast_sim(seed=True, rng=i*1000)
    unseeded.append(u)
    seeded.append(s)
    if (i+1) % 10 == 0:
        print(f"  {i+1}/{n_trials} complete")

unseeded = np.array(unseeded)
seeded = np.array(seeded)
diffs = seeded - unseeded
ratios = seeded / np.maximum(unseeded, 1e-20)

# Statistical tests
mean_diff = np.mean(diffs)
std_diff = np.std(diffs, ddof=1)
se_diff = std_diff / np.sqrt(n_trials)
t_stat = mean_diff / se_diff
# Two-sided p-value approximation
from math import erfc, sqrt
p_value = erfc(abs(t_stat) / sqrt(2))

# Effect size (Cohen's d)
pooled_std = np.sqrt((np.var(unseeded, ddof=1) + np.var(seeded, ddof=1)) / 2)
cohens_d = mean_diff / pooled_std if pooled_std > 0 else 0

# Confidence intervals
ci_diff = (mean_diff - 1.96*se_diff, mean_diff + 1.96*se_diff)
mean_ratio = np.mean(ratios)
ci_ratio = (np.percentile(ratios, 2.5), np.percentile(ratios, 97.5))

# Sensitivity analysis: vary cloud top temperature
print("Running sensitivity analysis...")
T_tops = [-5, -10, -15, -20, -25, -30, -35]
sensitivity_ratios = {}

for T_top in T_tops:
    rats = []
    for i in range(15):
        u = fast_sim(T_top=T_top, seed=False, rng=i*100+7)
        s = fast_sim(T_top=T_top, seed=True, rng=i*100+7)
        rats.append(s / max(u, 1e-20))
    sensitivity_ratios[T_top] = rats

# Sensitivity: vary supersaturation
S_values = [0.001, 0.003, 0.005, 0.008, 0.01]
sensitivity_S = {}

for S_val in S_values:
    rats = []
    for i in range(15):
        u = fast_sim(S=S_val, seed=False, rng=i*100+13)
        s = fast_sim(S=S_val, seed=True, rng=i*100+13)
        rats.append(s / max(u, 1e-20))
    sensitivity_S[S_val] = rats

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Seeding Effectiveness Analysis', color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

# Panel 1: Paired comparison scatter
ax = axes[0, 0]
ax.scatter(unseeded, seeded, color='#f59e0b', alpha=0.7, s=40, zorder=3)
max_val = max(unseeded.max(), seeded.max()) * 1.1
ax.plot([0, max_val], [0, max_val], color='white', linewidth=1, linestyle='--', alpha=0.5)
ax.set_xlabel('Unseeded precipitation', color='white')
ax.set_ylabel('Seeded precipitation', color='white')
ax.set_title('Paired comparison (above line = seeding helped)', color='white', fontsize=10, fontweight='bold')

above = np.sum(seeded > unseeded)
ax.text(0.05, 0.9, f'{above}/{n_trials} trials: seeded > unseeded',
        transform=ax.transAxes, color='#22c55e', fontsize=10)

# Panel 2: Distribution of paired differences
ax = axes[0, 1]
ax.hist(diffs, bins=15, color='#22c55e', alpha=0.8, edgecolor='none')
ax.axvline(x=0, color='white', linewidth=1.5, linestyle='--', alpha=0.7)
ax.axvline(x=mean_diff, color='#ef4444', linewidth=2, label=f'Mean diff: {mean_diff:.2e}')
ax.axvline(x=ci_diff[0], color='#a855f7', linewidth=1.5, linestyle='--')
ax.axvline(x=ci_diff[1], color='#a855f7', linewidth=1.5, linestyle='--',
           label=f'95% CI: [{ci_diff[0]:.2e}, {ci_diff[1]:.2e}]')
ax.set_xlabel('Seeded - Unseeded precipitation', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title(f'Paired difference (p={p_value:.4f})', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)

# Panel 3: Enhancement ratio distribution
ax = axes[0, 2]
ax.hist(ratios, bins=15, color='#f59e0b', alpha=0.8, edgecolor='none')
ax.axvline(x=1.0, color='white', linewidth=1.5, linestyle='--', alpha=0.7)
ax.axvline(x=mean_ratio, color='#ef4444', linewidth=2,
           label=f'Mean: {mean_ratio:.3f}x')
ax.set_xlabel('Enhancement ratio (Seeded/Unseeded)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title(f"Cohen's d = {cohens_d:.2f}", color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 4: Sensitivity to cloud top temperature
ax = axes[1, 0]
means_t = [np.mean(sensitivity_ratios[t]) for t in T_tops]
stds_t = [np.std(sensitivity_ratios[t]) for t in T_tops]
ax.errorbar(T_tops, means_t, yerr=stds_t, color='#3b82f6', linewidth=2,
            marker='o', capsize=5, markersize=8)
ax.axhline(y=1.0, color='white', linewidth=1, linestyle='--', alpha=0.5)
ax.set_xlabel('Cloud top temperature (C)', color='white')
ax.set_ylabel('Enhancement ratio', color='white')
ax.set_title('Sensitivity: cloud top temperature', color='white', fontsize=11, fontweight='bold')

# Highlight optimal range
opt_mask = [m > 1.0 + 0.5*s for m, s in zip(means_t, stds_t)]
for i, (t, m, is_opt) in enumerate(zip(T_tops, means_t, opt_mask)):
    if is_opt:
        ax.plot(t, m, 'o', color='#22c55e', markersize=12, zorder=5)

# Panel 5: Sensitivity to supersaturation
ax = axes[1, 1]
means_s = [np.mean(sensitivity_S[s]) for s in S_values]
stds_s = [np.std(sensitivity_S[s]) for s in S_values]
ax.errorbar([s*100 for s in S_values], means_s, yerr=stds_s, color='#f59e0b',
            linewidth=2, marker='s', capsize=5, markersize=8)
ax.axhline(y=1.0, color='white', linewidth=1, linestyle='--', alpha=0.5)
ax.set_xlabel('Supersaturation (%)', color='white')
ax.set_ylabel('Enhancement ratio', color='white')
ax.set_title('Sensitivity: supersaturation', color='white', fontsize=11, fontweight='bold')

# Panel 6: Summary
ax = axes[1, 2]
ax.axis('off')
sig = "YES" if p_value < 0.05 else "NO"
sig_color = "#22c55e" if p_value < 0.05 else "#ef4444"

summary = f"""STATISTICAL ANALYSIS SUMMARY
{'='*45}

Paired t-test (n={n_trials} paired trials):
  Mean difference: {mean_diff:.4e}
  t-statistic:     {t_stat:.3f}
  p-value:         {p_value:.4f}
  Significant at 5%: {sig}

Effect size:
  Mean ratio:  {mean_ratio:.3f}x
  Cohen's d:   {cohens_d:.2f}
  95% CI:      [{ci_ratio[0]:.3f}, {ci_ratio[1]:.3f}]

Interpretation:
  {'Seeding produces a detectable increase' if p_value < 0.05 else 'Cannot distinguish seeding effect from noise'}
  {'in precipitation under these conditions.' if p_value < 0.05 else 'with current sample size.'}

Sensitivity:
  Best cloud tops: {T_tops[np.argmax(means_t)]}C
  Enhancement varies from {min(means_t):.2f}x to {max(means_t):.2f}x"""

ax.text(0.05, 0.95, summary, transform=ax.transAxes, fontsize=9.5,
        color=sig_color, fontfamily='monospace', verticalalignment='top',
        bbox=dict(boxstyle='round', facecolor='#111827', edgecolor=sig_color, alpha=0.8))

plt.tight_layout()
plt.show()

print()
print("Effectiveness Analysis Complete")
print("=" * 55)
print(f"  Trials: {n_trials} paired simulations")
print(f"  t-stat: {t_stat:.3f}, p-value: {p_value:.4f}")
print(f"  Mean enhancement: {mean_ratio:.3f}x")
print(f"  Cohen's d: {cohens_d:.2f}")
print(f"  95% CI for ratio: [{ci_ratio[0]:.3f}, {ci_ratio[1]:.3f}]")
print()
print("Sensitivity: seeding works best for clouds with moderately cold")
print("tops (-15 to -25C) and moderate supersaturation. Warm clouds show")
print("little effect; very cold clouds nucleate ice naturally.")`,
      challenge: 'Add a two-dimensional sensitivity heat map: vary both cloud top temperature (-5 to -35C) and AgI concentration (0 to 50/L) simultaneously. Create a filled contour plot of the enhancement ratio. Identify the optimal (T_top, AgI) combination. Is there a clear overseeding regime visible in the map?',
      successHint: 'This analysis pipeline is publishable-quality atmospheric science. You have paired experimental design, proper statistical testing, effect size estimation, sensitivity analysis, and clear visualization. These exact methods are used in operational cloud seeding evaluation programs worldwide.',
    },
    {
      title: 'Portfolio — complete cloud physics simulator with seeding toggle',
      concept: `You have built a complete cloud seeding simulator from the ground up. Let us consolidate everything into a single, polished portfolio piece that demonstrates mastery of:

**Physics implemented**:
- Kohler theory and droplet activation
- Condensation growth (Maxwell diffusion)
- Collision-coalescence (stochastic collection)
- Heterogeneous ice nucleation (AgI seeding)
- Bergeron process (ice crystal growth in mixed-phase clouds)
- Precipitation formation and removal

**Computational methods**:
- Monte Carlo particle simulation
- Ensemble statistics and convergence analysis
- Bootstrap confidence intervals
- Paired experimental design with common random numbers
- Sensitivity analysis across parameter space

**Statistical rigor**:
- Hypothesis testing (paired t-test)
- Effect size estimation (Cohen's d, ratio of means)
- Confidence intervals (frequentist and bootstrap)
- Multiple comparison awareness

The final version runs a clean head-to-head comparison: same cloud, same initial conditions, seeded vs unseeded. It reports the enhancement ratio with full uncertainty quantification. This is a miniature version of what national weather services use to evaluate cloud seeding programs.

Your simulator captures the essential tension of the field: the physics is clear, the signal is real but small, and natural variability makes it hard to prove effectiveness with certainty. That is the honest state of cloud seeding science in the real world.`,
      analogy: 'This portfolio is your doctoral defense compressed into code. You started with a question ("does cloud seeding work?"), built a model to test it, ran experiments, analyzed the results with proper statistics, and reported your findings with appropriate uncertainty. Every scientist, whether in a university lab or a tea research station in Jorhat, follows this same arc. The specific physics changes; the methodology is universal.',
      storyConnection: 'The cloud that refused to rain is no longer a mystery. You can now explain exactly why it refused (droplet growth barrier, insufficient ice nuclei, narrow size distribution) and exactly what cloud seeding would do (introduce AgI to trigger Bergeron process, create outlier-size particles to initiate coalescence cascade). You can estimate how much extra rain it would produce (10-30%, depending on conditions), and you can quantify your uncertainty about that estimate. The tea gardens of Assam need not just rain, but reliable predictions of rain. Your simulator provides both the intervention and the honesty about its limits.',
      checkQuestion: 'A government official asks you: "Should we fund cloud seeding for drought relief in Assam?" Based on everything you have learned and built, what is your answer? Be specific and honest.',
      checkAnswer: 'The honest answer has three parts. (1) Cloud seeding can increase precipitation by 5-15% under favorable conditions — specifically, deep convective clouds with tops at -15 to -25C, moderate updraft, and sufficient supercooled water. These conditions occur during Assam\'s pre-monsoon season and during monsoon breaks. (2) Cloud seeding CANNOT create rain from clear skies. It only works when suitable clouds already exist. It is an amplifier, not a generator. During severe drought with no cloud formation, seeding is useless. (3) The cost-benefit depends on the value of marginal rainfall. For Assam\'s tea industry, where a week\'s delay in monsoon onset can cost crores in crop quality, even a modest 10% increase during critical periods could be highly valuable. Recommendation: fund a pilot program with proper randomization and statistical evaluation (paired design, 3-5 year time horizon, independent assessment). Do NOT promise rain. Do promise rigorous science.',
      codeIntro: 'Run the complete portfolio simulation: head-to-head comparison with full statistical report and publication-quality visualization.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from math import erfc, sqrt

np.random.seed(42)

rho_w = 1000.0
g = 9.81
mu_air = 1.8e-5

def portfolio_sim(n_drop=3000, dur=20, dt=5.0, S=0.005, G=1e-10,
                  T_base=15.0, T_top=-20.0, depth=3000.0,
                  seed=False, n_agi=5, rng=None):
    """Production-quality cloud simulation."""
    if rng is not None:
        np.random.seed(rng)
    n_steps = int(dur*60/dt)
    lapse = (T_base-T_top)/depth

    radii = np.clip(np.random.gamma(6, 10e-6/6, n_drop), 1e-6, 50e-6)
    heights = np.random.uniform(0, depth, n_drop)
    phase = np.zeros(n_drop, dtype=int)
    active = np.ones(n_drop, dtype=bool)

    if seed:
        fh = T_base/lapse if lapse > 0 else depth
        n_a = min(int(n_agi*30), n_drop//10)
        for _ in range(n_a):
            idx = np.random.randint(n_drop)
            if active[idx] and heights[idx] > fh:
                phase[idx] = 1
                radii[idx] = max(radii[idx], 15e-6)

    precip = 0.0
    times_out = []
    precip_curve = []
    n_ice_curve = []

    for step in range(n_steps):
        t = step*dt/60
        temps = T_base - lapse*heights

        liq = active & (phase==0) & (radii>0)
        if np.any(liq):
            radii[liq] = np.sqrt(radii[liq]**2 + 2*G*S*dt)

        ice = active & (phase==1) & (radii>0)
        if np.any(ice):
            Ti = temps[ice]
            el = 610.78*np.exp(17.27*Ti/(Ti+237.3))
            ei = 610.78*np.exp(21.875*Ti/(Ti+265.5))
            Si = np.where(Ti<0, (el-ei)/ei, 0)
            dr = 5e-10*Si/np.maximum(radii[ice],1e-7)*dt
            radii[ice] += np.maximum(dr, 0)

        sc = active & (phase==0) & (temps<0) & (radii>0)
        if np.any(sc):
            dT = -temps[sc]
            J = 1e-4*np.exp(0.1*dT)
            P = 1-np.exp(-J*dt)
            freeze = np.random.random(np.sum(sc)) < P
            phase[np.where(sc)[0][freeze]] = 1

        ai = np.where(active & (radii>0))[0]
        if len(ai) > 10:
            np2 = len(ai)//4
            pm = np.random.permutation(len(ai))
            if 2*np2 <= len(ai):
                c1, c2 = ai[pm[:np2]], ai[pm[np2:2*np2]]
                R = np.maximum(radii[c1],radii[c2])
                r = np.minimum(radii[c1],radii[c2])
                bg = np.where(radii[c1]>=radii[c2],c1,c2)
                sm = np.where(radii[c1]>=radii[c2],c2,c1)
                dV = np.abs(2*rho_w*g/(9*mu_air)*(R**2-r**2))
                cs = np.pi*(R+r)**2
                rt = r/np.maximum(R,1e-8)
                E = np.where(R>20e-6, 0.5*(1+rt**2), 0.1*rt**2)
                Pc = np.clip(cs*dV*E*len(ai)/1e6*dt, 0, 0.3)
                coll = np.random.random(np2) < Pc
                if np.any(coll):
                    radii[bg[coll]] = (R[coll]**3+r[coll]**3)**(1/3)
                    radii[sm[coll]] = 0
                    active[sm[coll]] = False

        prm = active & (radii>100e-6)
        if np.any(prm):
            precip += np.sum((4/3)*np.pi*radii[prm]**3*rho_w)
            active[prm] = False
            radii[prm] = 0

        if step % max(1, n_steps//40) == 0:
            times_out.append(t)
            precip_curve.append(precip)
            n_ice_curve.append(np.sum(phase[active]==1))

    final_dist = radii[active & (radii > 0)]
    return {
        'precip': precip,
        'times': times_out,
        'precip_curve': precip_curve,
        'n_ice_curve': n_ice_curve,
        'final_dist': final_dist,
        'n_precip_out': n_drop - np.sum(active),
    }

# === MAIN ENSEMBLE ===
n_trials = 40
print(f"Cloud Seeding Simulator — Portfolio Run")
print(f"Running {n_trials} paired trials (3000 droplets x 20 min each)...")

results_u = []
results_s = []
for i in range(n_trials):
    ru = portfolio_sim(seed=False, rng=i*1000)
    rs = portfolio_sim(seed=True, rng=i*1000)
    results_u.append(ru)
    results_s.append(rs)
    if (i+1) % 10 == 0:
        print(f"  {i+1}/{n_trials} complete")

precip_u = np.array([r['precip'] for r in results_u])
precip_s = np.array([r['precip'] for r in results_s])
diffs = precip_s - precip_u
ratios = precip_s / np.maximum(precip_u, 1e-20)

# Statistics
mean_diff = np.mean(diffs)
se_diff = np.std(diffs, ddof=1) / np.sqrt(n_trials)
t_stat = mean_diff / se_diff if se_diff > 0 else 0
p_val = erfc(abs(t_stat) / sqrt(2))
pooled_std = np.sqrt((np.var(precip_u, ddof=1) + np.var(precip_s, ddof=1))/2)
cohens_d = mean_diff / pooled_std if pooled_std > 0 else 0
mean_ratio = np.mean(ratios)
ci_ratio = (np.percentile(ratios, 2.5), np.percentile(ratios, 97.5))

# Bootstrap CI
boot_ratios = [np.mean(ratios[np.random.choice(n_trials, n_trials, replace=True)]) for _ in range(5000)]
boot_ci = (np.percentile(boot_ratios, 2.5), np.percentile(boot_ratios, 97.5))

# === VISUALIZATION ===
fig = plt.figure(figsize=(18, 14))
fig.patch.set_facecolor('#1f2937')

# Custom grid: 3 rows, varying columns
gs = fig.add_gridspec(3, 4, hspace=0.35, wspace=0.35)

def style_ax(ax):
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    for spine in ['bottom', 'left']:
        ax.spines[spine].set_color('gray')
    for spine in ['top', 'right']:
        ax.spines[spine].set_visible(False)

# Title
fig.suptitle('Cloud Seeding Simulator: Complete Portfolio Analysis',
             color='white', fontsize=16, fontweight='bold', y=0.98)

# Row 1, Col 1: Precipitation accumulation curves
ax = fig.add_subplot(gs[0, 0:2])
style_ax(ax)
# Plot all curves lightly, then mean
for r in results_u[:5]:
    ax.plot(r['times'], r['precip_curve'], color='#3b82f6', alpha=0.15, linewidth=0.8)
for r in results_s[:5]:
    ax.plot(r['times'], r['precip_curve'], color='#22c55e', alpha=0.15, linewidth=0.8)

# Mean curves
mean_times = results_u[0]['times']
mean_u_curve = np.mean([r['precip_curve'] for r in results_u], axis=0)
mean_s_curve = np.mean([r['precip_curve'] for r in results_s], axis=0)
ax.plot(mean_times, mean_u_curve, color='#3b82f6', linewidth=2.5, label='Unseeded (mean)')
ax.plot(mean_times, mean_s_curve, color='#22c55e', linewidth=2.5, label='Seeded (mean)')
ax.set_xlabel('Time (minutes)', color='white')
ax.set_ylabel('Cumulative precipitation', color='white')
ax.set_title('Precipitation accumulation over time', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=10)

# Row 1, Col 2: Enhancement ratio histogram
ax = fig.add_subplot(gs[0, 2:4])
style_ax(ax)
ax.hist(ratios, bins=20, color='#f59e0b', alpha=0.8, edgecolor='none')
ax.axvline(x=1.0, color='white', linewidth=1.5, linestyle='--', alpha=0.7, label='No effect')
ax.axvline(x=mean_ratio, color='#ef4444', linewidth=2.5, label=f'Mean: {mean_ratio:.3f}x')
ax.axvspan(ci_ratio[0], ci_ratio[1], alpha=0.15, color='#a855f7',
           label=f'95% CI: [{ci_ratio[0]:.2f}, {ci_ratio[1]:.2f}]')
ax.set_xlabel('Seeded / Unseeded ratio', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Enhancement ratio distribution', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Row 2, Col 1: Paired scatter
ax = fig.add_subplot(gs[1, 0])
style_ax(ax)
ax.scatter(precip_u, precip_s, color='#f59e0b', alpha=0.7, s=40, zorder=3)
max_v = max(precip_u.max(), precip_s.max()) * 1.1
ax.plot([0, max_v], [0, max_v], color='white', linewidth=1, linestyle='--', alpha=0.5)
pct_above = np.sum(precip_s > precip_u) / n_trials * 100
ax.set_xlabel('Unseeded', color='white')
ax.set_ylabel('Seeded', color='white')
ax.set_title(f'Paired: {pct_above:.0f}% above diagonal', color='white', fontsize=11, fontweight='bold')

# Row 2, Col 2: Paired differences
ax = fig.add_subplot(gs[1, 1])
style_ax(ax)
ax.hist(diffs, bins=15, color='#22c55e', alpha=0.8, edgecolor='none')
ax.axvline(x=0, color='white', linewidth=1.5, linestyle='--', alpha=0.7)
ax.axvline(x=mean_diff, color='#ef4444', linewidth=2)
ax.set_xlabel('Seeded - Unseeded', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title(f'Paired diff (p={p_val:.4f})', color='white', fontsize=11, fontweight='bold')

# Row 2, Col 3: Ice crystal evolution
ax = fig.add_subplot(gs[1, 2])
style_ax(ax)
for r in results_u[:3]:
    ax.plot(r['times'], r['n_ice_curve'], color='#3b82f6', alpha=0.3, linewidth=1)
for r in results_s[:3]:
    ax.plot(r['times'], r['n_ice_curve'], color='#22c55e', alpha=0.3, linewidth=1)
mean_ice_u = np.mean([r['n_ice_curve'] for r in results_u], axis=0)
mean_ice_s = np.mean([r['n_ice_curve'] for r in results_s], axis=0)
ax.plot(mean_times, mean_ice_u, color='#3b82f6', linewidth=2, label='Unseeded')
ax.plot(mean_times, mean_ice_s, color='#22c55e', linewidth=2, label='Seeded')
ax.set_xlabel('Time (min)', color='white')
ax.set_ylabel('Ice crystal count', color='white')
ax.set_title('Ice formation: seeded vs natural', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# Row 2, Col 4: Bootstrap CI
ax = fig.add_subplot(gs[1, 3])
style_ax(ax)
ax.hist(boot_ratios, bins=40, color='#a855f7', alpha=0.8, edgecolor='none')
ax.axvline(x=1.0, color='white', linewidth=1, linestyle=':', alpha=0.5)
ax.axvline(x=boot_ci[0], color='#f59e0b', linewidth=2, linestyle='--')
ax.axvline(x=boot_ci[1], color='#f59e0b', linewidth=2, linestyle='--',
           label=f'Boot CI: [{boot_ci[0]:.3f}, {boot_ci[1]:.3f}]')
ax.set_xlabel('Bootstrap mean ratio', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Bootstrap confidence interval', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# Row 3: Full summary panel
ax = fig.add_subplot(gs[2, :])
ax.axis('off')

sig = p_val < 0.05
sig_word = "SIGNIFICANT" if sig else "NOT SIGNIFICANT"
sig_color = "#22c55e" if sig else "#ef4444"

d_interp = "negligible" if abs(cohens_d) < 0.2 else "small" if abs(cohens_d) < 0.5 else "medium" if abs(cohens_d) < 0.8 else "large"

report = f"""
CLOUD SEEDING SIMULATOR — FINAL REPORT
{'='*70}

EXPERIMENT DESIGN                           STATISTICAL RESULTS
  Paired trials:     {n_trials:>5d}                   t-statistic:    {t_stat:>8.3f}
  Droplets per run:  3,000                   p-value:        {p_val:>8.4f}
  Duration:          20 min                  Result:         {sig_word}
  Cloud: T_base=15C, T_top=-20C
  AgI concentration: 5 per liter             EFFECT SIZE
                                               Mean ratio:   {mean_ratio:>8.3f}x
PHYSICS MODULES                                Cohen's d:    {cohens_d:>8.3f} ({d_interp})
  Condensation growth (Maxwell)                95% CI:       [{ci_ratio[0]:.3f}, {ci_ratio[1]:.3f}]
  Collision-coalescence (stochastic)           Bootstrap CI: [{boot_ci[0]:.3f}, {boot_ci[1]:.3f}]
  Ice nucleation (heterogeneous)
  Bergeron process                           CONCLUSION
  Precipitation removal                        Silver iodide seeding {'increases' if mean_ratio > 1 else 'does not increase'}
                                               precipitation by {abs(mean_ratio-1)*100:.0f}% on average.
                                               {'This effect is statistically detectable.' if sig else 'This effect is not statistically separable from noise.'}
"""

ax.text(0.02, 0.95, report, transform=ax.transAxes, fontsize=10.5,
        color='white', fontfamily='monospace', verticalalignment='top',
        bbox=dict(boxstyle='round', facecolor='#111827', edgecolor=sig_color,
                  linewidth=2, alpha=0.9))

plt.savefig('/tmp/cloud_seeding_portfolio.png', dpi=150, bbox_inches='tight',
            facecolor='#1f2937', edgecolor='none')
plt.show()

print()
print("PORTFOLIO COMPLETE")
print("=" * 55)
print(f"  Saved to: /tmp/cloud_seeding_portfolio.png")
print()
print(f"  Enhancement: {mean_ratio:.3f}x ({(mean_ratio-1)*100:.1f}% increase)")
print(f"  Statistical significance: {sig_word} (p = {p_val:.4f})")
print(f"  Effect size: Cohen's d = {cohens_d:.3f} ({d_interp})")
print(f"  95% CI: [{ci_ratio[0]:.3f}, {ci_ratio[1]:.3f}]")
print()
print("From the story of a cloud that refused to rain,")
print("you have built a complete cloud physics simulator.")
print("You understand the droplet growth barrier, the Bergeron process,")
print("nucleation theory, aerosol-cloud interactions, and the statistical")
print("challenge of proving that weather modification works.")
print()
print("The cloud does not refuse anymore. You know how to make it rain.")
print("The harder question — should you? — remains yours to answer.")`,
      challenge: 'Package the simulator as a reusable Python module with a command-line interface: python cloud_sim.py --droplets 5000 --duration 30 --seed --agi 5 --trials 50 --output results.json. Add command-line argument parsing, JSON output, and a --plot flag for visualization. This transforms your notebook experiment into a tool that a real atmospheric scientist could use.',
      successHint: 'You have gone from a children\'s story about a stubborn cloud to a publication-quality atmospheric simulation. The physics is real. The statistics are rigorous. The code is modular and extensible. And the ethical questions remain open. That is what real science looks like — precise answers surrounded by honest uncertainty.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Cloud Seeding Simulator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (cloud physics & weather modification)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete cloud seeding simulator using Python with numpy and matplotlib. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
