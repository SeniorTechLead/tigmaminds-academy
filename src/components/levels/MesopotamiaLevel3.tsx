import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MesopotamiaLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Coupled salt-water transport — the advection-diffusion PDE',
      concept: `Salt moves through soil by two mechanisms simultaneously: **advection** (carried along with flowing water) and **diffusion** (spreading from high concentration to low concentration). The equation governing this is the **advection-diffusion equation**:

**\u2202C/\u2202t = D \u2202\u00B2C/\u2202z\u00B2 - v \u2202C/\u2202z - S**

Where C is salt concentration (g/L), t is time, z is depth, D is the dispersion coefficient (m\u00B2/day), v is the pore water velocity (m/day), and S is a source/sink term (salt precipitation, root uptake, etc.).

This is a **partial differential equation** (PDE) — it describes how concentration changes in both time AND space simultaneously. We solve it numerically using **finite differences**: divide the soil profile into layers, approximate the derivatives, and step forward in time.

The advection term (v \u2202C/\u2202z) moves salt downward with the irrigation water. The diffusion term (D \u2202\u00B2C/\u2202z\u00B2) spreads salt from concentrated zones to dilute zones. When evapotranspiration draws water upward from the water table, the advection reverses — pulling salt UP into the root zone. This upward salt flux is what destroyed Mesopotamian agriculture.

\uD83D\uDCDA *A PDE relates how a quantity changes with respect to multiple variables (here, time and depth). The advection-diffusion equation is one of the most important PDEs in science — it describes pollutant transport, heat conduction, drug diffusion, and financial option pricing.*`,
      analogy: 'Drop a blob of ink into a flowing river. The river current carries the ink downstream (advection). At the same time, the ink spreads outward in all directions (diffusion). The advection-diffusion equation describes both processes simultaneously. In soil, salt is the ink, irrigation water is the river current, and the "spreading" is molecular diffusion through the pore space.',
      storyConnection: 'In Mesopotamia, the advection direction REVERSED seasonally. During irrigation (winter-spring), water flowed downward, carrying salt into the subsoil. During the dry summer, intense evaporation pulled groundwater upward through capillary action, dragging dissolved salt back into the root zone. This seasonal pumping concentrated salt where it did the most damage — right where the roots are.',
      checkQuestion: 'If pore water velocity is 5 mm/day downward and the dispersion coefficient is 0.01 m\u00B2/day, which dominates salt transport: advection or diffusion?',
      checkAnswer: 'Compare the Peclet number: Pe = vL/D. For a 1 m soil profile: Pe = 0.005 \u00D7 1 / 0.01 = 0.5. When Pe < 1, diffusion dominates; when Pe > 1, advection dominates. At Pe = 0.5, both matter — you must solve the full advection-diffusion equation. In summer, when evaporation reverses the flow, advection dominates and salt rises rapidly.',
      codeIntro: 'Solve the 1D advection-diffusion equation for salt transport in a Mesopotamian soil profile.',
      code: `import numpy as np

def solve_salt_transport(n_layers, depth_m, dt_days, n_steps,
                          velocity_m_day, dispersion, c_irrigation,
                          c_initial, et_rate_m_day):
    """
    Solve 1D advection-diffusion equation using explicit finite differences.
    Positive velocity = downward flow (irrigation).
    Negative velocity = upward flow (evaporation-driven capillary rise).
    """
    dz = depth_m / n_layers
    z = np.linspace(0, depth_m, n_layers)
    c = np.ones(n_layers) * c_initial  # initial salt concentration

    snapshots = [(0, c.copy())]

    for step in range(1, n_steps + 1):
        c_new = c.copy()
        day = step * dt_days

        # Seasonal velocity: irrigation in winter, evaporation in summer
        season = (day % 365) / 365
        if season < 0.4:  # winter-spring: irrigation
            v = velocity_m_day
            c[0] = c_irrigation  # salt input at surface
        else:  # summer-autumn: evaporation pulls water up
            v = -et_rate_m_day * 0.3  # upward capillary flux
            c[0] = c[0]  # surface concentration increases

        for i in range(1, n_layers - 1):
            # Diffusion term
            diffusion = dispersion * (c[i+1] - 2*c[i] + c[i-1]) / dz**2
            # Advection term (upwind scheme)
            if v >= 0:
                advection = -v * (c[i] - c[i-1]) / dz
            else:
                advection = -v * (c[i+1] - c[i]) / dz
            c_new[i] = c[i] + dt_days * (diffusion + advection)
            c_new[i] = max(0, c_new[i])

        # Bottom boundary: free drainage
        c_new[-1] = c_new[-2]
        c = c_new

        # Save snapshots
        if step * dt_days in [30, 90, 180, 365, 730, 1825]:
            snapshots.append((step * dt_days, c.copy()))

    return z, snapshots

# Mesopotamian soil profile simulation
n_layers = 50
depth = 2.0  # metres
dt = 1.0     # 1 day time step
n_steps = 1825  # 5 years

z, snapshots = solve_salt_transport(
    n_layers=n_layers, depth_m=depth, dt_days=dt, n_steps=n_steps,
    velocity_m_day=0.003,     # slow downward percolation
    dispersion=0.005,          # m²/day
    c_irrigation=1.5,          # g/L in canal water
    c_initial=0.5,             # g/L initial soil salinity
    et_rate_m_day=0.008,       # 8 mm/day ET in summer
)

print("=== Salt Concentration Profile Over Time ===")
print(f"Depth range: 0-{depth}m | Irrigation salt: 1.5 g/L\\n")

for day, c_profile in snapshots:
    label = f"Day {day:>5}" if day < 365 else f"Year {day/365:.0f}   "
    root_zone_salt = np.mean(c_profile[:15])  # top 0.6m
    deep_salt = np.mean(c_profile[35:])        # below 1.4m
    max_salt = np.max(c_profile)
    max_depth = z[np.argmax(c_profile)]
    print(f"{label}  Root zone: {root_zone_salt:>5.2f} g/L  "
          f"Deep: {deep_salt:>5.2f} g/L  "
          f"Peak: {max_salt:>5.2f} g/L at {max_depth:.1f}m")

# Salt mass balance
print("\\n=== Salt Mass Balance After 5 Years ===")
final_c = snapshots[-1][1]
dz_val = depth / n_layers
porosity = 0.4
salt_mass = np.sum(final_c * dz_val * porosity * 1000)  # g/m²
initial_mass = 0.5 * depth * porosity * 1000
print(f"Initial salt in profile: {initial_mass:.0f} g/m²")
print(f"Final salt in profile:   {salt_mass:.0f} g/m²")
print(f"Net accumulation:        {salt_mass - initial_mass:.0f} g/m² "
      f"({(salt_mass/initial_mass - 1)*100:.0f}% increase)")

# Convert to EC (electrical conductivity) for agronomic interpretation
print("\\n=== Root Zone Salinity (EC) Over Time ===")
for day, c_profile in snapshots:
    root_c = np.mean(c_profile[:15])
    ec_ds_m = root_c * 1.56  # approximate conversion: g/L to dS/m
    status = "Safe" if ec_ds_m < 4 else "Wheat fails" if ec_ds_m < 8 else "Barley fails"
    print(f"  {'Day '+str(day) if day<365 else 'Year '+str(int(day/365)):>8}: "
          f"EC = {ec_ds_m:.1f} dS/m  [{status}]")`,
      challenge: 'Add a "leaching event" — once per year, apply a heavy irrigation (double the normal rate for 10 days) to flush salts downward. Does annual leaching prevent salt accumulation in the root zone, or does the summer capillary rise bring it back? This is the fundamental question of irrigated agriculture in arid climates.',
      successHint: 'You just solved a partial differential equation numerically — the same technique used to model groundwater contamination, atmospheric pollution, heat transfer in buildings, and drug distribution in the body. The advection-diffusion equation is arguably the most widely applied PDE in applied science.',
    },
    {
      title: 'GIS-based salinisation mapping — spatial interpolation and risk assessment',
      concept: `Salinisation doesn't happen uniformly — it depends on local topography, drainage, soil type, and distance from canals. **Geographic Information Systems (GIS)** map these spatial patterns by combining point measurements into continuous surfaces.

The key technique is **spatial interpolation** — estimating values at unsampled locations based on nearby measurements. **Inverse Distance Weighting (IDW)** is a common method:

**C(x,y) = \u03A3[w_i \u00D7 C_i] / \u03A3[w_i]  where  w_i = 1/d_i^p**

Where C_i is the measured value at point i, d_i is the distance from the estimation point to point i, and p is the power parameter (typically 2).

From interpolated salinity maps, you can classify zones by risk level, estimate total affected area, and prioritise remediation — exactly the workflow used by modern irrigation engineers managing salt-affected land in the Tigris-Euphrates valley today.

\uD83D\uDCDA *GIS combines spatial data (locations, boundaries, elevations) with attribute data (salinity, yield, soil type) to reveal patterns that aren't visible in tables alone. It's the foundation of environmental management, urban planning, and precision agriculture.*`,
      analogy: 'Imagine measuring temperature at 20 weather stations across a country. Between stations, you estimate the temperature by averaging nearby stations, giving more weight to closer ones. That\'s spatial interpolation — and it turns scattered point measurements into a continuous temperature map. The same technique turns scattered soil salinity samples into a salinity map of an entire irrigation district.',
      storyConnection: 'Archaeological surveys of the Diyala River basin east of Baghdad mapped ancient field boundaries, canal traces, and settlement patterns. By overlaying these with modern salinity measurements, researchers showed that the most salinised zones today correspond exactly to the most intensively irrigated zones 4,000 years ago. The salt deposited by Sumerian farmers is STILL there.',
      checkQuestion: 'You have salinity measurements of 2, 6, and 10 dS/m at three points, each 1 km from your estimation point. Using IDW with p=2, what is the estimated salinity?',
      checkAnswer: 'All distances are equal (1 km), so all weights are equal: w = 1/1\u00B2 = 1. Estimate = (1\u00D72 + 1\u00D76 + 1\u00D710) / (1+1+1) = 18/3 = 6 dS/m. When all points are equidistant, IDW gives a simple average. The power of IDW shows when points are at different distances — closer points dominate the estimate.',
      codeIntro: 'Build a GIS-style salinity map from point samples using inverse distance weighting interpolation.',
      code: `import numpy as np

np.random.seed(42)

# Generate synthetic field area (10km x 10km irrigation district)
grid_size = 50  # 50x50 grid = 200m resolution
x_grid = np.linspace(0, 10, grid_size)
y_grid = np.linspace(0, 10, grid_size)
xx, yy = np.meshgrid(x_grid, y_grid)

# Generate sample points (simulated soil sampling locations)
n_samples = 40
sample_x = np.random.uniform(0.5, 9.5, n_samples)
sample_y = np.random.uniform(0.5, 9.5, n_samples)

# True salinity pattern: higher near canal (y=5), lower at edges
# Plus local variation from drainage and topography
true_salt = lambda x, y: (3.0 + 5.0 * np.exp(-((y - 5)**2) / 8)
                           + 2.0 * np.sin(x * 0.8)
                           + np.random.normal(0, 0.5))

sample_ec = np.array([true_salt(sx, sy) for sx, sy in zip(sample_x, sample_y)])
sample_ec = np.clip(sample_ec, 0.5, 15.0)

def idw_interpolation(sample_x, sample_y, sample_vals, grid_x, grid_y, power=2):
    """Inverse Distance Weighting interpolation."""
    result = np.zeros_like(grid_x)
    for i in range(grid_x.shape[0]):
        for j in range(grid_x.shape[1]):
            distances = np.sqrt((sample_x - grid_x[i,j])**2 +
                                (sample_y - grid_y[i,j])**2)
            distances = np.maximum(distances, 0.001)  # avoid division by zero
            weights = 1.0 / distances**power
            result[i,j] = np.sum(weights * sample_vals) / np.sum(weights)
    return result

# Run interpolation
ec_map = idw_interpolation(sample_x, sample_y, sample_ec, xx, yy)

# Classification
print("=== GIS Salinisation Risk Map ===")
print(f"Area: 10 km × 10 km | Resolution: 200 m | Samples: {n_samples}\\n")

thresholds = [
    (0, 2, "Low risk (all crops safe)"),
    (2, 4, "Moderate (sensitive crops affected)"),
    (4, 8, "High (wheat fails, barley marginal)"),
    (8, 12, "Severe (most crops fail)"),
    (12, 99, "Extreme (salt crust, abandoned)"),
]

total_cells = grid_size * grid_size
print(f"{'Risk Level':<40} {'Area %':>8} {'Area km²':>10}")
print("-" * 60)
for low, high, label in thresholds:
    mask = (ec_map >= low) & (ec_map < high)
    count = np.sum(mask)
    pct = count / total_cells * 100
    area = pct / 100 * 100  # 100 km² total
    bar = "█" * int(pct / 2)
    print(f"{label:<40} {pct:>6.1f}% {area:>8.1f}  {bar}")

# Spatial statistics
print(f"\\n=== Spatial Statistics ===")
print(f"Mean EC: {np.mean(ec_map):.1f} dS/m")
print(f"Std EC:  {np.std(ec_map):.1f} dS/m")
print(f"Min EC:  {np.min(ec_map):.1f} dS/m (best area)")
print(f"Max EC:  {np.max(ec_map):.1f} dS/m (worst area)")

# Transect along canal (y=5)
print(f"\\n=== Salinity Transect Along Main Canal (y = 5 km) ===")
canal_row = grid_size // 2
print(f"{'Distance (km)':>14} {'EC (dS/m)':>10} {'Risk':<20}")
print("-" * 46)
for j in range(0, grid_size, 5):
    ec = ec_map[canal_row, j]
    risk = "Low" if ec < 2 else "Moderate" if ec < 4 else "High" if ec < 8 else "Severe"
    print(f"{x_grid[j]:>12.1f} {ec:>8.1f} {risk:<20}")

# Remediation priority
print(f"\\n=== Remediation Priority Zones ===")
severe_mask = ec_map >= 8
if np.any(severe_mask):
    severe_y, severe_x = np.where(severe_mask)
    clusters = len(severe_y)
    center_x = np.mean(x_grid[severe_x])
    center_y = np.mean(y_grid[severe_y])
    area_severe = np.sum(severe_mask) / total_cells * 100
    print(f"Severe/extreme zones: {area_severe:.0f} km² ({area_severe:.0f}% of district)")
    print(f"Centroid of worst area: ({center_x:.1f}, {center_y:.1f}) km")
    print(f"Recommended: install subsurface drainage in this zone first")
else:
    print("No severe zones detected — preventive management recommended")`,
      challenge: 'IDW has a weakness: it creates "bull\'s-eye" patterns around sample points. Implement a simple **kriging** alternative: fit a linear trend surface (EC = a + bx + cy) to the sample data, then use IDW on the residuals. Does the combined approach produce a smoother, more realistic map?',
      successHint: 'You just built a spatial interpolation and classification pipeline — the core of every GIS-based environmental assessment. The same workflow is used to map groundwater contamination, air pollution, disease outbreaks, and crop productivity. GIS skills are in high demand across environmental science, public health, and urban planning.',
    },
    {
      title: 'Economic modelling of agricultural collapse — surplus, trade, and feedback loops',
      concept: `Salinisation didn't just reduce crop yields — it triggered an **economic cascade**: lower yields \u2192 less surplus grain \u2192 less trade revenue \u2192 less investment in canal maintenance \u2192 worse irrigation \u2192 more salinisation. This is a **positive feedback loop** — it amplifies itself.

We can model this using **system dynamics**: a set of coupled equations where each variable depends on others. The key variables are:

- **Grain yield** (tonnes/ha) — declines with salinity
- **Surplus** (yield minus subsistence) — available for trade
- **Revenue** — from trade, taxes, tribute
- **Investment** — fraction of revenue spent on canal maintenance
- **Canal condition** — determines irrigation efficiency
- **Salinity** — increases when canals deteriorate

When surplus drops below zero, the civilisation consumes more than it produces — borrowing from reserves, reducing military capacity, and eventually collapsing. The Ur III dynasty fell in 2004 BCE; the southern Mesopotamian population crashed by 80% over the following centuries.

\uD83D\uDCDA *System dynamics models interconnected systems where feedback loops create non-linear behaviour. Invented by Jay Forrester at MIT in the 1950s, it's used to model economies, ecosystems, epidemics, and climate.*`,
      analogy: 'Imagine a farm that uses profits to maintain its irrigation system. If yields drop, profits drop, maintenance is cut, the irrigation system degrades, yields drop further — a downward spiral. It\'s like a business that cuts quality to save money, loses customers, has less money, cuts quality more. The feedback loop accelerates the decline until collapse.',
      storyConnection: 'The collapse of Ur III was not sudden — it took about a century. Tax records from 2050-2000 BCE show steadily declining grain deliveries to the central granaries. Temple records show increasing imports of barley from the north. Military garrisons were reduced. Canal workers were reassigned to food production. Each adaptation further weakened the system, until the Elamite invasion of 2004 BCE found a civilisation too weak to defend itself.',
      checkQuestion: 'If a 10% yield decline causes a 5% cut in canal maintenance, which causes a further 3% yield decline, what is the total yield decline after this one feedback cycle?',
      checkAnswer: 'Total decline = 10% + 3% = 13%. But this isn\'t the end — the 3% decline triggers another maintenance cut, causing another yield decline. The total effect is a geometric series: 10% + 3% + 0.9% + 0.27% + ... = 10% / (1 - 0.3) = 14.3%. The feedback loop amplifies the initial shock by 43%.',
      codeIntro: 'Model the economic feedback loop between salinisation, agricultural surplus, and infrastructure investment.',
      code: `import numpy as np

def simulate_economy(years, initial_yield, subsistence, trade_price,
                     maintenance_fraction, salt_rate_base, canal_decay_rate):
    """
    System dynamics model of Mesopotamian agricultural economy.
    Feedback loop: yield -> surplus -> revenue -> investment ->
    canal condition -> salinity -> yield
    """
    n = len(years)
    yield_t = np.zeros(n)
    salinity = np.zeros(n)
    surplus = np.zeros(n)
    revenue = np.zeros(n)
    canal_cond = np.zeros(n)
    population = np.zeros(n)

    # Initial conditions
    yield_t[0] = initial_yield
    salinity[0] = 1.5  # dS/m — low initial salinity
    canal_cond[0] = 1.0  # perfect condition
    population[0] = 100  # index

    for t in range(1, n):
        # Yield depends on salinity (FAO model: Y = Ym × (1 - b(EC - ECt)))
        threshold_ec = 8.0  # barley threshold
        slope_b = 0.05  # yield decline per dS/m above threshold
        if salinity[t-1] > threshold_ec:
            salt_penalty = slope_b * (salinity[t-1] - threshold_ec)
        else:
            salt_penalty = 0
        yield_t[t] = max(0, initial_yield * canal_cond[t-1] * (1 - salt_penalty))

        # Surplus = yield - subsistence needs
        surplus[t] = yield_t[t] - subsistence * (population[t-1] / 100)

        # Revenue from surplus trade
        revenue[t] = max(0, surplus[t] * trade_price)

        # Investment in canal maintenance
        investment = revenue[t] * maintenance_fraction
        canal_cond[t] = min(1.0, canal_cond[t-1] * (1 - canal_decay_rate) +
                            investment * 0.001)
        canal_cond[t] = max(0.1, canal_cond[t])

        # Salinity increases; rate depends on canal condition (poor canals = poor drainage)
        drainage_factor = canal_cond[t]  # better canals = better drainage
        salt_increase = salt_rate_base / max(drainage_factor, 0.1)
        salinity[t] = salinity[t-1] + salt_increase

        # Population adjusts to food supply
        if surplus[t] > 0:
            population[t] = min(population[t-1] * 1.005, 150)  # slow growth
        else:
            population[t] = population[t-1] * 0.97  # decline from famine/emigration

    return years, yield_t, salinity, surplus, canal_cond, population

# Run simulation for southern Mesopotamia
years = np.arange(-2500, -1400, 10)  # 2500-1400 BCE in 10-year steps

results = simulate_economy(
    years=years,
    initial_yield=2.5,      # tonnes/ha
    subsistence=1.2,         # tonnes/ha needed for food
    trade_price=10,          # revenue units per tonne surplus
    maintenance_fraction=0.3, # 30% of revenue to canal work
    salt_rate_base=0.03,     # dS/m per decade base rate
    canal_decay_rate=0.02,   # 2% condition loss per decade
)

yrs, yield_t, salinity, surplus, canal_cond, population = results

print("=== Mesopotamian Agricultural Economy Simulation ===")
print(f"Period: {abs(years[0])}-{abs(years[-1])} BCE\\n")

print(f"{'Year BCE':>9} {'Yield t/ha':>11} {'Salt dS/m':>10} {'Surplus':>8} "
      f"{'Canal%':>7} {'Pop Idx':>8} {'Status':<14}")
print("-" * 72)

for i in range(0, len(years), 5):
    status = ("Prosperous" if surplus[i] > 0.5 else
              "Strained" if surplus[i] > 0 else
              "Deficit" if surplus[i] > -0.5 else "Collapse")
    print(f"{abs(years[i]):>7} {yield_t[i]:>9.2f} {salinity[i]:>8.1f} "
          f"{surplus[i]:>8.2f} {canal_cond[i]*100:>6.0f}% {population[i]:>7.0f} "
          f"{status:<14}")

# Find collapse point
collapse_idx = np.argmax(surplus < 0) if np.any(surplus < 0) else -1
if collapse_idx > 0:
    print(f"\\n=== Collapse Analysis ===")
    print(f"Surplus turns negative: {abs(years[collapse_idx])} BCE")
    print(f"Salinity at collapse: {salinity[collapse_idx]:.1f} dS/m")
    print(f"Canal condition at collapse: {canal_cond[collapse_idx]*100:.0f}%")
    print(f"Population at end: {population[-1]:.0f}% of peak")
    print(f"Years from first surplus to collapse: "
          f"{abs(years[collapse_idx] - years[0])} years")

# Sensitivity analysis
print(f"\\n=== Sensitivity: What If Maintenance Were Higher? ===")
for maint in [0.1, 0.2, 0.3, 0.5, 0.7]:
    _, _, salt, surp, _, pop = simulate_economy(
        years, 2.5, 1.2, 10, maint, 0.03, 0.02)
    collapse = np.argmax(surp < 0) if np.any(surp < 0) else len(years)-1
    print(f"  Maintenance {maint*100:>3.0f}%: collapse at "
          f"{abs(years[collapse])} BCE, final pop {pop[-1]:.0f}%")`,
      challenge: 'Add a "technology shock" at 2200 BCE: the invention of improved drainage that reduces the salt accumulation rate by 50%. Does this prevent collapse or merely delay it? What if the technology is invented 200 years earlier? This models the real question: can technology outrun environmental degradation?',
      successHint: 'You just modelled the economic dynamics of civilisational collapse — the same framework used by Jared Diamond in "Collapse" and by modern economists studying resource depletion. System dynamics reveals that feedback loops can turn small problems into existential crises — and that early intervention is exponentially more effective than late intervention.',
    },
    {
      title: 'Climate reconstruction from proxy data — reading the geological record',
      concept: `How do we know what Mesopotamia's climate was like 4,000 years ago? Direct measurements don't exist — but **proxy data** does. Proxies are natural recorders of climate: tree rings (width = rainfall), lake sediments (pollen types = vegetation = temperature), cave stalagmites (\u03B4\u00B9\u2078O isotope ratio = rainfall), and marine cores (foraminifera species = ocean temperature).

Reconstructing climate from proxies requires: (1) **calibration** — establishing the relationship between the proxy and the climate variable using modern data where both are known, (2) **transfer function** — the mathematical model relating proxy to climate, and (3) **uncertainty quantification** — how confident are we in the reconstruction?

For Mesopotamia, the key proxy is the **\u03B4\u00B9\u2078O record from Soreq Cave** (Israel) and **lake level records from Lake Van** (Turkey). These show that the period 2200-1900 BCE experienced a severe, prolonged drought — the **4.2 ka event** — that coincided with the collapse of the Akkadian Empire and the decline of Ur III.

\uD83D\uDCDA *\u03B4\u00B9\u2078O (delta-O-18) measures the ratio of heavy oxygen-18 to light oxygen-16 in water. Higher \u03B4\u00B9\u2078O in cave deposits = less rainfall. It's one of the most powerful climate proxies, recording rainfall patterns going back hundreds of thousands of years.*`,
      analogy: 'A proxy is like reading someone\'s diary to learn about the weather — they didn\'t write "it rained 50 mm" but they wrote "the river flooded and ruined the crops." You can infer the climate from indirect evidence. Tree rings, lake muds, and cave minerals are nature\'s diary — they don\'t record temperature directly, but their chemistry and structure encode it.',
      storyConnection: 'The 4.2 kiloyear event was likely the trigger that pushed already-salinised Mesopotamian agriculture over the edge. Drought reduced river flows, concentrated canal water salinity, and raised evapotranspiration. Salinisation that might have taken centuries to reach critical levels was accelerated to decades. The drought didn\'t cause the collapse alone — but it hit a system already weakened by 1,500 years of salt accumulation.',
      checkQuestion: 'A stalagmite shows \u03B4\u00B9\u2078O of -5.0\u2030 during a wet period and -3.0\u2030 during a dry period. If the modern calibration shows 1\u2030 change = 150 mm rainfall change, what was the rainfall difference?',
      checkAnswer: 'Change in \u03B4\u00B9\u2078O = -3.0 - (-5.0) = +2.0\u2030 (more positive = drier). Rainfall change = 2.0 \u00D7 150 = 300 mm less rainfall during the dry period. For a region receiving 400 mm/year, this is a 75% reduction — a catastrophic drought.',
      codeIntro: 'Reconstruct Mesopotamian climate from simulated proxy data and identify drought periods.',
      code: `import numpy as np

np.random.seed(42)

# Simulate 3000 years of proxy data (4500-1500 BCE)
years_bp = np.arange(4500, 1499, -1)  # BCE
n_years = len(years_bp)

# True climate signal: baseline + long-term trends + the 4.2ka drought
def true_rainfall(year_bce):
    """Simulated true annual rainfall (mm) for Mesopotamia."""
    baseline = 350  # mm/year
    # Long-term drying trend
    trend = -0.02 * (4500 - year_bce)
    # 4.2 ka drought event (centered at 2150 BCE, lasting ~300 years)
    drought = -180 * np.exp(-((year_bce - 2150)**2) / (2 * 80**2))
    # Decadal oscillation
    decadal = 30 * np.sin(2 * np.pi * (4500 - year_bce) / 60)
    return baseline + trend + drought + decadal

rainfall_true = np.array([true_rainfall(y) for y in years_bp])

# Generate proxy records with different noise levels
# Proxy 1: Tree ring width (good seasonal resolution, moderate noise)
tree_ring = rainfall_true * 0.003 + np.random.normal(0, 0.15, n_years)
tree_ring = np.maximum(0.1, tree_ring)

# Proxy 2: Lake sediment d18O (smoothed, inverted — more positive = drier)
d18o_true = -rainfall_true * 0.01 + np.random.normal(0, 0.3, n_years)
# Apply smoothing (sediments average over ~50 years)
kernel = np.ones(50) / 50
d18o_smoothed = np.convolve(d18o_true, kernel, mode='same')

# Proxy 3: Pollen count (very smoothed, coarse resolution)
pollen = rainfall_true * 0.5 + np.random.normal(0, 40, n_years)
pollen = np.maximum(0, pollen)
kernel_pollen = np.ones(100) / 100
pollen_smoothed = np.convolve(pollen, kernel_pollen, mode='same')

# Calibration: use "modern" period (most recent 500 years) to build transfer function
cal_mask = years_bp < 2000
cal_rainfall = rainfall_true[cal_mask]
cal_tree = tree_ring[cal_mask]

# Linear regression for calibration
coeffs = np.polyfit(cal_tree, cal_rainfall, 1)
reconstructed = np.polyval(coeffs, tree_ring)

# Report
print("=== Mesopotamian Climate Reconstruction ===")
print(f"Period: {years_bp[0]}-{years_bp[-1]} BCE | {n_years} years\\n")

print("Proxy calibration (tree ring -> rainfall):")
print(f"  Slope: {coeffs[0]:.1f} mm per ring-width unit")
print(f"  Intercept: {coeffs[1]:.1f} mm")
cal_r2 = np.corrcoef(cal_tree, cal_rainfall)[0,1]**2
print(f"  R² = {cal_r2:.3f}\\n")

# Century averages
print(f"{'Period BCE':<16} {'True Rain':>10} {'Recon Rain':>11} {'δ¹⁸O':>7} {'Status':<16}")
print("-" * 62)
for start in range(4500, 1500, -200):
    mask = (years_bp <= start) & (years_bp > start - 200)
    if np.sum(mask) == 0:
        continue
    true_avg = np.mean(rainfall_true[mask])
    recon_avg = np.mean(reconstructed[mask])
    d18o_avg = np.mean(d18o_smoothed[mask])
    status = ("Wet" if true_avg > 350 else
              "Normal" if true_avg > 250 else
              "Dry" if true_avg > 150 else "Severe Drought")
    print(f"{start}-{start-200} BCE {true_avg:>8.0f} mm {recon_avg:>9.0f} mm "
          f"{d18o_avg:>6.1f} {status:<16}")

# Detect the 4.2ka event
print("\\n=== 4.2 ka Drought Event Detection ===")
window = 100
running_mean = np.convolve(reconstructed, np.ones(window)/window, mode='same')
long_mean = np.mean(reconstructed)
long_std = np.std(reconstructed)

drought_mask = running_mean < (long_mean - 1.5 * long_std)
if np.any(drought_mask):
    drought_years = years_bp[drought_mask]
    print(f"Drought detected: {drought_years[0]}-{drought_years[-1]} BCE")
    print(f"Duration: {drought_years[0] - drought_years[-1]} years")
    drought_rainfall = np.mean(reconstructed[drought_mask])
    print(f"Mean rainfall during drought: {drought_rainfall:.0f} mm "
          f"({(1-drought_rainfall/long_mean)*100:.0f}% below average)")
    print(f"This coincides with the fall of the Akkadian Empire (2154 BCE)")
    print(f"and the decline of Ur III dynasty (2004 BCE).")`,
      challenge: 'Add uncertainty bands to the reconstruction: for each century, calculate the 90% confidence interval based on the calibration R\u00B2 and the standard error of the regression. How wide are the uncertainty bands? Can you definitively say the 4.2 ka event happened, or is the signal within the noise? This is the fundamental challenge of palaeoclimatology.',
      successHint: 'You just performed palaeoclimate reconstruction — the same workflow used by IPCC scientists to extend the temperature record back thousands of years. Proxy calibration, transfer functions, and uncertainty quantification are the tools that connect ice cores, tree rings, and sediments to our understanding of past climates.',
    },
    {
      title: 'Modern remediation engineering — the leaching requirement calculation',
      concept: `Can salinised land be rescued? Yes — with **leaching**. The principle: apply enough extra irrigation water to dissolve the accumulated salt and flush it below the root zone through subsurface drains.

The **leaching requirement (LR)** is the fraction of applied water that must drain past the root zone:

**LR = EC_w / (5 \u00D7 EC_t - EC_w)**

Where EC_w is the electrical conductivity of the irrigation water (dS/m) and EC_t is the maximum tolerable salinity for the crop (dS/m).

For barley (EC_t = 8 dS/m) with moderate-quality water (EC_w = 1.5 dS/m):
LR = 1.5 / (5 \u00D7 8 - 1.5) = 1.5 / 38.5 = 0.039 = 3.9%

This means 3.9% of all irrigation water must pass through the root zone and be removed by drains. For salt-sensitive crops like beans (EC_t = 1.0), LR jumps to 1.5 / (5 \u00D7 1 - 1.5) = 43% — nearly half the water is "wasted" on salt flushing.

For heavily salinised land (EC_soil = 20+ dS/m), the initial reclamation requires **ponding** — flooding the field with 60-100 cm of low-salt water to dissolve and flush the worst of the accumulated salt. This can take 2-3 seasons of repeated leaching.

\uD83D\uDCDA *The leaching requirement is the minimum water needed to prevent salt accumulation in steady state. During reclamation of already-salinised land, much more water is needed initially — the "reclamation leaching requirement" depends on the starting salinity.*`,
      analogy: 'Imagine a dirty sponge (salty soil). To clean it, you run water through it — the water dissolves the dirt and carries it away. The leaching requirement tells you: for every litre of water the sponge absorbs, how much EXTRA water must you push through to keep it clean? A dirtier water supply means more flushing. A more sensitive sponge (salt-intolerant crop) means even more flushing.',
      storyConnection: 'Modern Iraq has attempted to reclaim ancient salinised land using the leaching requirement approach. The Main Outfall Drain (completed 1992) stretches 565 km from Baghdad to the Gulf, carrying saline drainage water away from reclaimed farmland. It is, in a sense, the drainage infrastructure that Mesopotamia needed 4,000 years ago. But the scale and cost are staggering — billions of dollars to fix what millennia of careless irrigation created.',
      checkQuestion: 'An engineer wants to grow tomatoes (EC_t = 2.5 dS/m) with water of EC_w = 0.8 dS/m. What is the leaching requirement?',
      checkAnswer: 'LR = 0.8 / (5 \u00D7 2.5 - 0.8) = 0.8 / 11.7 = 0.068 = 6.8%. About 7% of the applied water must drain through. If tomato water demand is 600 mm/season, total water needed = 600 / (1 - 0.068) = 644 mm. The extra 44 mm is the leaching water.',
      codeIntro: 'Calculate leaching requirements for different crop-water combinations and model reclamation of salinised land.',
      code: `import numpy as np

def leaching_requirement(ec_water, ec_threshold):
    """FAO leaching requirement fraction."""
    denominator = 5 * ec_threshold - ec_water
    if denominator <= 0:
        return float('inf')  # impossible — water too salty for this crop
    return ec_water / denominator

def total_water_need(crop_et_mm, lr):
    """Total water = crop ET / (1 - LR)."""
    if lr >= 1:
        return float('inf')
    return crop_et_mm / (1 - lr)

# Crop and water quality combinations
crops = [
    ("Barley", 8.0, 500),
    ("Wheat", 6.0, 450),
    ("Cotton", 7.7, 700),
    ("Tomato", 2.5, 600),
    ("Date palm", 4.0, 900),
    ("Rice", 3.0, 550),
    ("Bean", 1.0, 400),
]

water_qualities = [
    ("Pristine river", 0.3),
    ("Good canal", 0.8),
    ("Average canal", 1.5),
    ("Reused drainage", 3.0),
    ("Brackish well", 5.0),
]

print("=== Leaching Requirement (%) by Crop and Water Quality ===\\n")
header = f"{'Crop':<14}" + "".join(f"{w[0]:>16}" for w in water_qualities)
print(header)
print("-" * len(header))

for crop_name, ec_t, et in crops:
    row = f"{crop_name:<14}"
    for w_name, ec_w in water_qualities:
        lr = leaching_requirement(ec_w, ec_t)
        if lr > 1:
            row += f"{'IMPOSSIBLE':>16}"
        else:
            row += f"{lr*100:>14.1f}%"
    print(row)

# Reclamation simulation
print("\\n=== Reclamation of Salinised Field ===")
initial_ec = 25.0  # severely salinised (dS/m)
target_ec = 4.0    # safe for barley
root_depth = 1.0   # metre
porosity = 0.4
water_ec = 1.0     # reclamation water quality

print(f"Initial soil EC: {initial_ec} dS/m")
print(f"Target EC: {target_ec} dS/m")
print(f"Water quality: {water_ec} dS/m\\n")

# Each leaching event: soil_ec_new = soil_ec × (1 - efficiency) + water_ec × efficiency
# where efficiency depends on water applied / pore volume
leaching_events = []
soil_ec = initial_ec
total_water = 0

for event in range(1, 30):
    # Apply 100mm of water per event
    water_mm = 100
    total_water += water_mm
    pore_vol = root_depth * porosity * 1000  # mm
    efficiency = min(0.7, water_mm / pore_vol)

    soil_ec = soil_ec * (1 - efficiency) + water_ec * efficiency
    leaching_events.append({
        "event": event,
        "total_water_mm": total_water,
        "soil_ec": soil_ec,
    })

    if soil_ec <= target_ec:
        break

print(f"{'Event':>6} {'Total Water':>12} {'Soil EC':>10} {'Status':<16}")
print("-" * 46)
for le in leaching_events:
    status = ("Target reached!" if le["soil_ec"] <= target_ec else
              "Improving" if le["soil_ec"] < initial_ec * 0.7 else "Still high")
    print(f"{le['event']:>6} {le['total_water_mm']:>10} mm {le['soil_ec']:>8.1f} {status:<16}")

print(f"\\nTotal water for reclamation: {total_water} mm = {total_water/1000:.1f} m depth")
print(f"This equals {total_water / (root_depth * porosity * 1000):.1f} pore volumes")
print(f"At 10 mm/day drainage capacity: {total_water / 10:.0f} days = "
      f"{total_water / 10 / 30:.0f} months")

# Cost comparison
print("\\n=== Reclamation Cost vs Abandonment ===")
water_cost_per_m3 = 0.05  # $ per m³
drain_install_per_ha = 3000  # $
reclaim_water_m3 = total_water * 10  # mm to m³/ha
reclaim_water_cost = reclaim_water_m3 * water_cost_per_m3
total_reclaim = drain_install_per_ha + reclaim_water_cost
annual_crop_value = 1500  # $/ha for barley
payback = total_reclaim / annual_crop_value

print(f"Drainage installation: \{drain_install_per_ha}/ha")
print(f"Reclamation water: {reclaim_water_m3:.0f} m³/ha = \{reclaim_water_cost:.0f}/ha")
print(f"Total cost: \{total_reclaim:.0f}/ha")
print(f"Annual crop value: \{annual_crop_value}/ha")
print(f"Payback period: {payback:.1f} years")
print(f"\\nVerdict: {'Economically viable' if payback < 10 else 'Marginal'} "
      f"— reclamation pays for itself in {payback:.0f} years")`,
      challenge: 'What happens if you use drainage water (EC = 3 dS/m) instead of fresh water for reclamation? How many more leaching events are needed? Is it still economically viable? In water-scarce regions, this is a real dilemma — fresh water is too valuable for leaching, but salty water extends the reclamation timeline dramatically.',
      successHint: 'You now understand the complete lifecycle of irrigated agriculture in arid climates: water brings salt, evaporation concentrates it, drainage removes it, and leaching reclaims damaged land. The FAO leaching requirement is used by every irrigation engineer in the world. The tragedy of Mesopotamia was not ignorance — it was the absence of drainage technology that wouldn\'t be invented for another 3,500 years.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced modelling, spatial analysis, and climate reconstruction</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers coupled PDEs, GIS mapping, economic system dynamics, climate proxy analysis, and remediation engineering.
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
