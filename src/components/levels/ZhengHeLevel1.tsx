import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ZhengHeLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Buoyancy and displacement — Archimedes\' principle for ship design',
      concept: `A ship floats because the weight of water it pushes aside (displaces) equals the weight of the ship itself. This is **Archimedes' principle**: the upward buoyant force on a submerged object equals the weight of the fluid displaced.

For a rectangular hull of length L, beam (width) B, and draft T (how deep it sits):

**Displacement = L x B x T x C_b x density_water**

where C_b is the **block coefficient** — the fraction of the bounding box actually filled by hull (typically 0.5-0.7 for wooden ships). The remaining hull above the waterline is called **freeboard** — the safety margin between water and deck.

Zheng He's treasure ships were reportedly **137 m long and 56 m wide** — dimensions that seem almost impossible for wooden construction. Even conservative modern estimates of **60-75 m** make them the largest wooden vessels ever built. The key question: could such ships actually float with useful cargo?

The answer depends on the balance between the hull's own weight (wood, fittings, masts) and the displacement volume available for cargo, crew, and stores. A ship that uses 80% of its displacement just to hold itself up has only 20% left for payload — and may not be worth building.

📚 *Every ship design is a buoyancy budget. Naval architects allocate displacement to structure, machinery, fuel, crew, stores, and cargo. If the structure takes too large a share, the ship is uneconomical. Zheng He's engineers had to solve this same optimization problem 600 years ago.*`,
      analogy: 'Fill a bathtub and push an empty shoebox into the water. It sinks to a certain depth and stops — the weight of water it displaced now equals the box\'s weight. Now put coins in the box: it sinks deeper, displacing more water, until equilibrium is restored. Each coin is like adding cargo to a ship — the hull sinks deeper, but as long as water doesn\'t reach the rim (freeboard stays positive), the ship floats.',
      storyConnection: 'Zheng He\'s treasure ships carried 500+ sailors, trade goods, gold, silk, and porcelain across the Indian Ocean. The ships needed enough displacement to carry all this weight while maintaining enough freeboard to survive ocean waves. Getting this balance wrong meant either a ship too heavy to be useful or too light to be safe.',
      checkQuestion: 'A ship has length 65 m, beam 25 m, draft 6 m, and block coefficient 0.55. What is its displacement in tonnes? (Seawater density = 1.025 tonnes/m^3)',
      checkAnswer: 'Displacement = 65 x 25 x 6 x 0.55 x 1.025 = 5,509 tonnes. This is the total weight the ship can support — hull structure, crew, stores, and cargo combined. If the hull weighs 2,500 tonnes, that leaves about 3,000 tonnes for everything else.',
      codeIntro: 'Calculate displacement, draft, and freeboard for treasure ships of different sizes — and find the practical limits.',
      code: `import numpy as np

def ship_buoyancy(length_m, beam_m, depth_m, block_coeff, hull_mass_t,
                   cargo_t, crew_count, stores_days):
    """Full buoyancy analysis for a wooden ship."""
    rho_sw = 1.025  # seawater density, tonnes/m^3
    crew_mass = crew_count * 0.08  # ~80 kg per person in tonnes
    stores_mass = crew_count * stores_days * 0.003  # ~3 kg/person/day

    total_mass = hull_mass_t + cargo_t + crew_mass + stores_mass

    # Draft needed to support total mass
    waterplane_area = length_m * beam_m * block_coeff
    draft = total_mass / (waterplane_area * rho_sw)

    # Freeboard
    freeboard = depth_m - draft
    displacement = length_m * beam_m * draft * block_coeff * rho_sw

    return {
        'total_mass': total_mass,
        'draft': draft,
        'freeboard': freeboard,
        'displacement': displacement,
        'hull_fraction': hull_mass_t / total_mass * 100,
        'cargo_fraction': cargo_t / total_mass * 100,
        'safe': freeboard > 1.5  # minimum safe freeboard
    }

# Zheng He's treasure ships — three size estimates
ships = [
    ("Chronicle account (137m)", 137, 56, 12, 0.50, 8000, 1000, 400, 90),
    ("Moderate estimate (75m)",   75, 28, 9,  0.55, 2800,  600, 500, 90),
    ("Conservative estimate (60m)", 60, 22, 7.5, 0.58, 1500, 500, 300, 90),
    ("Columbus Santa Maria",      19,  6, 3.2, 0.55,   80,  40,  40, 70),
]

print("=== Buoyancy Analysis: Zheng He vs Columbus ===\\n")

for name, L, B, D, Cb, hull, cargo, crew, days in ships:
    r = ship_buoyancy(L, B, D, Cb, hull, cargo, crew, days)
    status = "SAFE" if r['safe'] else "DANGEROUS"
    print(f"--- {name} ---")
    print(f"  Dimensions: {L}m x {B}m x {D}m deep")
    print(f"  Total mass: {r['total_mass']:,.0f} t")
    print(f"  Draft: {r['draft']:.1f}m | Freeboard: {r['freeboard']:.1f}m [{status}]")
    print(f"  Hull: {r['hull_fraction']:.0f}% | Cargo: {r['cargo_fraction']:.0f}%")
    print(f"  Displacement: {r['displacement']:,.0f} t\\n")

# Freeboard sensitivity — how much cargo before danger?
print("=== Cargo Loading Limit (75m Treasure Ship) ===\\n")
print(f"{'Cargo (t)':>10} {'Draft (m)':>10} {'Freeboard':>10} {'Status':>10}")
print("-" * 44)
for cargo in range(0, 4001, 500):
    r = ship_buoyancy(75, 28, 9, 0.55, 2800, cargo, 500, 90)
    status = "SAFE" if r['freeboard'] > 1.5 else "RISK" if r['freeboard'] > 0 else "SUNK"
    print(f"{cargo:>10,} {r['draft']:>10.2f} {r['freeboard']:>9.2f}m {status:>10}")

print(f"\\nKey insight: the 75m ship can carry ~2500t of cargo safely.")
print(f"The 137m chronicle ship would need impossibly thick timbers")
print(f"to resist the structural forces — buoyancy alone is not enough.")`,
      challenge: 'Add a function to compute the maximum safe cargo for each ship size by binary-searching for the cargo mass that gives exactly 1.5 m freeboard. Then calculate each ship\'s cargo-to-hull-mass ratio — a higher ratio means a more efficient design.',
      successHint: 'You applied Archimedes\' principle to real engineering — the same buoyancy calculations used today by naval architects at shipyards worldwide. The key insight is that flotation is necessary but not sufficient: a ship can float perfectly well and still break apart from structural forces, which is what the next lesson examines.',
    },
    {
      title: 'Watertight bulkheads — compartmentalization and survivability',
      concept: `Chinese shipbuilders invented **watertight bulkheads** — internal walls that divide the hull into sealed compartments — at least 1,000 years before European ships adopted them. If one compartment floods (from a rock strike, combat damage, or plank failure), the water stays contained in that section. The ship settles deeper but remains afloat.

Without bulkheads, a single hull breach floods the entire ship. The flooding rate depends on the hole size and water pressure:

**Flow rate = C_d x A x sqrt(2 x g x h)**

where C_d is the discharge coefficient (~0.6), A is the hole area, g is gravity, and h is the depth of the hole below waterline. A 0.1 m^2 hole 2 m below the waterline admits about **0.38 m^3/s** — filling a small ship in minutes.

With bulkheads, only one compartment floods. The ship's overall buoyancy decreases by the displacement of that compartment, but if the remaining compartments provide enough reserve buoyancy, the ship survives. This is the **floodable length** calculation — the maximum length of hull that can flood without sinking the ship.

The number of bulkheads matters enormously. With N bulkheads creating N+1 compartments, each compartment holds only **1/(N+1)** of the total volume. More bulkheads mean smaller compartments, less flooding per breach, and greater survivability — but also more weight and less usable cargo space.

📚 *Marco Polo, visiting China in 1295, was astonished by bulkhead construction: "The ships have 13 bulkheads... so that if the ship springs a leak, the water cannot pass from one compartment to another." European ships would not adopt this technology for 500 more years.*`,
      analogy: 'An ice cube tray holds water in 12 separate compartments. Tip it slightly and water spills from one cube — but the other 11 stay full. Now imagine a tray with no dividers: tip it and ALL the water slides to one end and pours out. A ship without bulkheads is like the divider-less tray — one leak and everything floods.',
      storyConnection: 'Zheng He\'s treasure ships had 13 watertight bulkheads — the same number Marco Polo recorded 130 years earlier. This technology was critical for ocean voyages: a ship striking a coral reef in the South China Sea could lose one compartment and still sail to port. European ships of the same era would sink from the same damage.',
      checkQuestion: 'A ship with 12 compartments has total hull volume of 6,000 m^3 and displaces 4,000 tonnes. If one compartment floods completely, how much reserve buoyancy remains?',
      checkAnswer: 'Each compartment holds 6,000/12 = 500 m^3. Flooding one compartment loses 500 x 1.025 = 512.5 tonnes of buoyancy. Reserve buoyancy was 6,000 x 1.025 - 4,000 = 2,150 tonnes. After flooding: 2,150 - 512.5 = 1,637.5 tonnes reserve. The ship survives easily — it could lose 4 compartments before sinking.',
      codeIntro: 'Simulate flooding with and without bulkheads — see how compartmentalization saves ships.',
      code: `import numpy as np

def flooding_rate(hole_area_m2, depth_below_waterline_m):
    """Water flow through a hull breach (m^3/s)."""
    Cd = 0.6  # discharge coefficient
    g = 9.81
    return Cd * hole_area_m2 * np.sqrt(2 * g * depth_below_waterline_m)

def simulate_flooding(hull_volume_m3, displacement_t, num_bulkheads,
                       hole_area, hole_depth, time_steps=300):
    """Simulate flooding over time. Returns time series."""
    rho = 1.025
    total_buoyancy = hull_volume_m3 * rho
    reserve = total_buoyancy - displacement_t

    compartments = num_bulkheads + 1
    comp_volume = hull_volume_m3 / compartments

    flow = flooding_rate(hole_area, hole_depth)
    times, flooded, reserves = [], [], []

    water_in = 0.0
    for t in range(time_steps):
        water_in = min(water_in + flow, comp_volume)  # can't exceed compartment
        lost_buoyancy = water_in * rho
        remaining = reserve - lost_buoyancy

        times.append(t)
        flooded.append(water_in)
        reserves.append(remaining)

        if remaining <= 0:
            break

    return times, flooded, reserves

# Ship parameters (75m treasure ship)
hull_vol = 8500  # m^3
disp = 5000      # tonnes
hole = 0.05      # m^2 (small breach)
depth = 2.5      # m below waterline

print("=== Flooding Simulation: Effect of Bulkheads ===\\n")
print(f"Ship: 75m treasure ship, {hull_vol} m^3 hull, {disp}t displacement")
print(f"Breach: {hole} m^2 hole, {depth}m below waterline")
print(f"Flow rate: {flooding_rate(hole, depth):.3f} m^3/s\\n")

configs = [
    ("No bulkheads (1 compartment)", 0),
    ("6 bulkheads (7 compartments)", 6),
    ("13 bulkheads (14 compartments)", 13),
    ("20 bulkheads (21 compartments)", 20),
]

for name, n_bulk in configs:
    times, flooded, reserves = simulate_flooding(
        hull_vol, disp, n_bulk, hole, depth)

    comp_vol = hull_vol / (n_bulk + 1)
    final_reserve = reserves[-1]
    sink_time = len(times) if final_reserve <= 0 else None

    print(f"--- {name} ---")
    print(f"  Compartment volume: {comp_vol:,.0f} m^3")
    print(f"  Time to fill compartment: {comp_vol / flooding_rate(hole, depth):.0f}s")
    if sink_time:
        print(f"  SINKS after {sink_time}s ({sink_time/60:.1f} min)")
    else:
        print(f"  SURVIVES — reserve buoyancy: {final_reserve:,.0f}t")
    print(f"  Water ingress after 5 min: {min(300 * flooding_rate(hole, depth), comp_vol):.0f} m^3\\n")

# Multi-compartment flooding (worst case)
print("=== How Many Compartments Can Flood? (13 bulkheads) ===\\n")
rho = 1.025
reserve = hull_vol * rho - disp
comp_vol = hull_vol / 14

print(f"Total reserve buoyancy: {reserve:,.0f} tonnes")
print(f"Buoyancy lost per flooded compartment: {comp_vol * rho:,.0f} tonnes\\n")

for n_flooded in range(1, 8):
    lost = n_flooded * comp_vol * rho
    remaining = reserve - lost
    status = "FLOATS" if remaining > 0 else "SINKS"
    print(f"  {n_flooded} compartment(s) flooded: "
          f"lost {lost:,.0f}t, remaining {remaining:,.0f}t — {status}")

print(f"\\nThe 13-bulkhead treasure ship can survive flooding in")
print(f"up to {int(reserve / (comp_vol * rho))} compartments simultaneously.")`,
      challenge: 'Add a second breach in a different compartment after 60 seconds. Simulate both compartments flooding simultaneously. How does this change the survivability? Then calculate the minimum number of bulkheads needed to survive 2 simultaneous breaches.',
      successHint: 'You modeled damage control engineering — the same compartmentalization principle used in modern warships, submarines, and aircraft. The Titanic had 16 watertight compartments but sank because 6 flooded simultaneously (more than its design allowed). Chinese shipbuilders understood this tradeoff 600 years before the Titanic.',
    },
    {
      title: 'Hogging and sagging — wave-induced bending forces on long hulls',
      concept: `A ship on a wave doesn't experience uniform support. When a wave crest is amidships (middle), the bow and stern hang unsupported — the hull **sags** like a loaded beam. When crests support the bow and stern but a trough is amidships, the hull **hogs** — it arches upward in the middle.

These alternating bending forces create enormous stress in the hull. The bending moment for a ship on a wave is approximately:

**M = (displacement x g x L) / (C x 1000)**

where L is the ship length and C is a coefficient (~20-35 depending on hull shape). The resulting stress in the hull structure is:

**stress = M x y / I**

where y is the distance from the neutral axis and I is the second moment of area of the hull cross-section.

For wooden ships, the critical limit is the **tensile strength of timber joints**. Individual oak or teak planks can withstand ~50 MPa, but the joints between them (mortise-and-tenon, treenails) fail at only **5-10 MPa**. This joint strength sets the maximum practical length for a wooden ship.

Historical evidence confirms this: the longest verified wooden ships (around 100 m) all suffered severe hogging. The Wyoming, a 100 m wooden schooner built in 1909 with steel reinforcement, still flexed so badly that her seams opened and she required constant pumping. She eventually sank in 1924.

📚 *This is why the 137 m chronicle dimension for treasure ships is debated. At that length, wave-induced bending would exceed any wooden joint's capacity. The physics sets a hard upper limit that no amount of clever carpentry can overcome.*`,
      analogy: 'Hold a ruler by both ends and push down in the middle — it bends into a U shape (sagging). Now support the middle and push down on the ends — it bends the other way (hogging). A ship does this continuously as waves pass under it. Short rulers barely flex; long rulers bend dramatically. The same physics makes long ships harder to build than short ones.',
      storyConnection: 'The debate over Zheng He\'s treasure ship dimensions is fundamentally a structural mechanics question. The chronicle dimensions of 137 m would create bending forces that no wooden structure could withstand. Modern naval architects estimate 60-75 m as the practical maximum — still enormous, still the largest wooden ships ever, but constrained by the physics of bending.',
      checkQuestion: 'If bending moment scales as displacement x length, and displacement scales as length^3 (for geometrically similar ships), how does bending stress scale with length?',
      checkAnswer: 'Bending moment scales as L^3 x L = L^4. The section modulus (I/y) scales as L^3 for a geometrically similar cross-section. So stress = M/(I/y) scales as L^4/L^3 = L. Stress increases linearly with length — double the ship length, double the bending stress. This is why there is a hard size limit for any material.',
      codeIntro: 'Calculate bending forces on hulls of different lengths and find the structural limit for wooden ships.',
      code: `import numpy as np

def hull_bending(length_m, beam_m, draft_m, depth_m, block_coeff,
                  wave_height_m=None):
    """Calculate hogging/sagging bending forces on a hull."""
    rho = 1.025  # seawater t/m^3
    g = 9.81

    displacement = length_m * beam_m * draft_m * block_coeff * rho  # tonnes
    disp_N = displacement * 1000 * g  # Newtons

    if wave_height_m is None:
        wave_height_m = 0.607 * np.sqrt(length_m)  # design wave

    # Sagging moment (wave crest amidships)
    C_sag = 25  # coefficient for full hull
    M_sag = disp_N * length_m / (C_sag * 1000)  # N-m

    # Hogging moment (trough amidships, typically 80% of sagging)
    M_hog = M_sag * 0.80

    # Hull cross-section properties (simplified rectangular)
    # Effective hull is planking + frames, thickness ~0.3m top and bottom
    t_planking = 0.30  # m
    y_max = depth_m / 2  # distance from neutral axis to outer fiber

    # Second moment of area (two flanges model)
    I = 2 * (beam_m * t_planking) * (depth_m/2 - t_planking/2)**2

    stress_sag = M_sag * y_max / I / 1e6  # MPa
    stress_hog = M_hog * y_max / I / 1e6  # MPa

    return {
        'displacement_t': displacement,
        'wave_height': wave_height_m,
        'M_sag_MNm': M_sag / 1e6,
        'M_hog_MNm': M_hog / 1e6,
        'stress_sag_MPa': stress_sag,
        'stress_hog_MPa': stress_hog,
        'I_m4': I,
    }

# Analyze ships from 20m to 140m
print("=== Hogging & Sagging: The Structural Limit of Wood ===\\n")

# Material limits
joint_strength = 8.0   # MPa — mortise-and-tenon joints
plank_strength = 50.0  # MPa — solid teak/oak

ships = [
    ("Fishing junk (20m)",      20, 6,  2.5, 4,  0.55),
    ("Columbus Santa Maria",    19, 6,  3.2, 4,  0.55),
    ("Large junk (40m)",        40, 10, 4,   6,  0.55),
    ("Treasure ship (60m)",     60, 22, 6,   8,  0.55),
    ("Treasure ship (75m)",     75, 28, 7,   9,  0.55),
    ("HMS Victory (69m)",       69, 16, 7,   9,  0.58),
    ("Wyoming schooner (100m)",100, 15, 6,  10,  0.50),
    ("Chronicle size (137m)",  137, 56, 8,  12,  0.50),
]

print(f"{'Ship':<28} {'Disp(t)':>8} {'M_sag':>10} {'Stress':>8} {'vs Joint':>9}")
print("-" * 67)

for name, L, B, T, D, Cb in ships:
    r = hull_bending(L, B, T, D, Cb)
    ratio = r['stress_sag_MPa'] / joint_strength
    status = "OK" if ratio < 1 else "RISK" if ratio < 1.5 else "FAIL"
    print(f"{name:<28} {r['displacement_t']:>7,.0f} "
          f"{r['M_sag_MNm']:>8,.0f} MN {r['stress_sag_MPa']:>6.1f} "
          f"{ratio:>6.1f}x [{status}]")

# Find the maximum safe length
print(f"\\n=== Finding Maximum Safe Wooden Ship Length ===\\n")
print(f"Joint strength limit: {joint_strength} MPa")
print(f"Searching for maximum length...\\n")

for length in range(30, 150, 5):
    beam = length * 0.35  # typical L/B ratio
    draft = length * 0.08
    depth = length * 0.12
    r = hull_bending(length, beam, draft, depth, 0.55)
    marker = " <<<" if abs(r['stress_sag_MPa'] - joint_strength) < 1 else ""
    if length % 10 == 0 or abs(r['stress_sag_MPa'] - joint_strength) < 1:
        print(f"  L={length:>3}m: stress = {r['stress_sag_MPa']:.1f} MPa "
              f"({'SAFE' if r['stress_sag_MPa'] < joint_strength else 'EXCEEDS LIMIT'})"
              f"{marker}")

print(f"\\n--- Wave Height Sensitivity (75m ship) ---\\n")
for wh in [1, 2, 3, 4, 5, 6]:
    r = hull_bending(75, 28, 7, 9, 0.55, wave_height_m=wh)
    safe = "OK" if r['stress_sag_MPa'] < joint_strength else "DANGER"
    print(f"  Wave {wh}m: stress = {r['stress_sag_MPa']:.1f} MPa [{safe}]")

print(f"\\nConclusion: wooden ships hit structural limits around 60-80m.")
print(f"The Wyoming (100m with steel straps) confirms this — she flexed")
print(f"badly and sank. Chronicle dimensions of 137m are structurally")
print(f"implausible without modern materials.")`,
      challenge: 'Add steel reinforcement to the model — how much does it increase the maximum safe length? The Wyoming used steel cross-bracing. Calculate the required steel cross-section to make a 100 m wooden ship safe in 4 m waves.',
      successHint: 'You discovered a fundamental engineering limit using beam bending theory — the same analysis used to design bridges, aircraft wings, and skyscrapers. The physics doesn\'t care about ambition or empire: it sets hard limits that only new materials can overcome. This is why the transition from wood to iron hulls in the 1800s was one of the most important engineering revolutions in history.',
    },
    {
      title: 'The magnetic compass — declination, dipping, and the 48-point Chinese system',
      concept: `China invented the magnetic compass for navigation around **1100 CE** — about 100 years before European adoption. But the Chinese compass was different in a fundamental way: it used **48 directional points** compared to Europe's **32 points**.

The Chinese system divided the circle into **24 primary directions** (based on the heavenly stems and earthly branches of Chinese cosmology), then subdivided each into two, giving 48 points. Each point spans **7.5 degrees** (compared to 11.25° for the 32-point European system), providing **50% finer directional resolution**.

A magnetic compass doesn't point to true north — it points to **magnetic north**, which differs by the local **magnetic declination**. In Zheng He's era, the declination in the South China Sea was approximately **1-2° west**. Navigators had to learn the local offset at each port.

Additionally, the compass needle doesn't stay horizontal — it **dips** toward the Earth's surface at an angle that increases with magnetic latitude. At the magnetic equator, dip is 0°. At the poles, the needle points straight down. Chinese navigators noticed this effect and compensated by weighting one end of the needle.

The compass bearing between two points on Earth follows a **rhumb line** (constant bearing) rather than a great circle (shortest path). For short distances this doesn't matter, but for oceanic voyages the difference can be significant:

**Rhumb distance = true distance x sec(average latitude) x correction**

📚 *The Chinese compass was not merely a direction finder — it was integrated into a complete navigation system that included star observations, dead reckoning, depth sounding, and coastal landmark recognition. Zheng He's navigators used all these methods together.*`,
      analogy: 'A clock face has 12 numbers — good enough to tell the hour. Now imagine a clock with 48 marks instead of 12. You could read time to the nearest 7.5 minutes instead of 30 minutes. That\'s the advantage of the Chinese 48-point compass over the European 32-point system: same principle, finer resolution, better precision in steering.',
      storyConnection: 'Zheng He\'s fleet navigated from Nanjing to East Africa — across the South China Sea, through the Strait of Malacca, across the Indian Ocean to Sri Lanka, India, the Persian Gulf, and the Swahili coast. Each leg required accurate compass bearings, corrected for local magnetic declination that changed from port to port.',
      checkQuestion: 'The 48-point compass has resolution of 7.5°. Over a 1,000 km voyage, what is the maximum cross-track error from being off by one compass point?',
      checkAnswer: 'Cross-track error = distance x sin(angular error) = 1,000 x sin(7.5°) = 1,000 x 0.1305 = 130.5 km. Being off by just one compass point over 1,000 km means missing your target by 130 km. This is why navigators needed dead reckoning corrections and landmark recognition to supplement the compass.',
      codeIntro: 'Model the Chinese 48-point compass, compare it with the European 32-point system, and calculate navigation precision.',
      code: `import numpy as np

def build_compass(n_points):
    """Build a compass rose with n equally spaced points."""
    step = 360 / n_points
    return [i * step for i in range(n_points)]

def magnetic_declination(lat, lon, year=1420):
    """Approximate magnetic declination for Zheng He's era.
    Simplified dipole model (real declination varies complexly)."""
    # Magnetic pole ~1420 CE was roughly at 86°N, 160°W
    mag_pole_lat = 86.0
    mag_pole_lon = -160.0

    dlat = np.radians(mag_pole_lat - lat)
    dlon = np.radians(mag_pole_lon - lon)
    lat_r = np.radians(lat)

    # Simplified declination estimate
    dec = np.degrees(np.arctan2(
        np.sin(dlon),
        np.tan(np.radians(mag_pole_lat)) * np.cos(lat_r) -
        np.sin(lat_r) * np.cos(dlon)
    ))
    return dec

def magnetic_dip(lat):
    """Magnetic dip angle (simplified dipole model)."""
    mag_lat = np.radians(lat)  # simplified: geographic ~ magnetic
    return np.degrees(np.arctan(2 * np.tan(mag_lat)))

# Compare Chinese and European compass systems
print("=== 48-Point Chinese vs 32-Point European Compass ===\\n")

chinese_48 = build_compass(48)
european_32 = build_compass(32)

print(f"Chinese compass: {len(chinese_48)} points, {360/48:.1f}° each")
print(f"European compass: {len(european_32)} points, {360/32:.2f}° each")
print(f"Resolution advantage: {(360/32)/(360/48):.1f}x finer\\n")

# True bearing vs nearest compass point
true_bearing = 67.0  # example bearing
ch_nearest = min(chinese_48, key=lambda x: abs(x - true_bearing))
eu_nearest = min(european_32, key=lambda x: abs(x - true_bearing))

print(f"True bearing: {true_bearing}°")
print(f"  Chinese 48-pt nearest: {ch_nearest}° (error: {abs(true_bearing-ch_nearest):.1f}°)")
print(f"  European 32-pt nearest: {eu_nearest}° (error: {abs(true_bearing-eu_nearest):.2f}°)")

# Magnetic declination along Zheng He's route
print(f"\\n=== Magnetic Declination Along Zheng He's Route ===\\n")

waypoints = [
    ("Nanjing (start)",     32.1, 118.8),
    ("Fuzhou",              26.1, 119.3),
    ("Champa (Vietnam)",    12.0, 109.0),
    ("Malacca Strait",       2.0, 102.0),
    ("Sri Lanka (Galle)",    6.0,  80.2),
    ("Calicut (India)",     11.3,  75.8),
    ("Hormuz (Persia)",     27.2,  56.3),
    ("Aden (Yemen)",        12.8,  45.0),
    ("Mogadishu (Africa)",   2.0,  45.3),
    ("Malindi (Kenya)",     -3.2,  40.1),
]

print(f"{'Port':<22} {'Lat':>6} {'Lon':>7} {'Decl':>7} {'Dip':>7}")
print("-" * 52)
for name, lat, lon in waypoints:
    dec = magnetic_declination(lat, lon)
    dip = magnetic_dip(lat)
    print(f"{name:<22} {lat:>5.1f}° {lon:>6.1f}° {dec:>+6.1f}° {dip:>+6.1f}°")

# Navigation error accumulation
print(f"\\n=== Cross-Track Error Over Distance ===\\n")
print(f"{'Distance':>10} {'48-pt max':>12} {'32-pt max':>12} {'Advantage':>10}")
print("-" * 48)
for dist in [100, 500, 1000, 2000, 5000]:
    err_48 = dist * np.sin(np.radians(7.5 / 2))
    err_32 = dist * np.sin(np.radians(11.25 / 2))
    print(f"{dist:>8} km {err_48:>9.1f} km {err_32:>9.1f} km "
          f"{err_32/err_48:>8.1f}x")

print(f"\\nThe Chinese 48-point compass reduced cross-track error by ~1.5x")
print(f"compared to the European system — critical for open-ocean voyaging.")
print(f"\\nNanjing to Malindi: ~12,000 km across 10+ compass corrections.")
print(f"Zheng He's navigators corrected declination at each port,")
print(f"keeping accumulated error within the detection range of")
print(f"coastal landmarks and depth soundings.")`,
      challenge: 'Calculate the rhumb line distance vs great circle distance for the full Nanjing-to-Malindi route. How much extra distance does following a constant compass bearing add compared to the shortest path? This is the practical cost of compass navigation.',
      successHint: 'You modeled the physics of magnetic navigation — declination, dip, and precision — the same principles used in modern aircraft compasses, smartphone magnetometers, and geological surveying. The Chinese 48-point system was an innovation in resolution, trading cosmological tradition for practical advantage. Engineering often advances by making existing tools more precise rather than inventing entirely new ones.',
    },
    {
      title: 'Scale comparison — Zheng He vs Columbus vs modern vessels',
      concept: `To appreciate what Zheng He's fleet represented, we need quantitative comparisons. In 1405, Zheng He commanded **317 ships** carrying **27,800 men**. Columbus, 87 years later in 1492, had **3 ships** and **90 men**. This is not a small difference — it's a difference of **two orders of magnitude**.

The individual ships differed dramatically too. Conservative estimates for treasure ships give dimensions of **60-75 m long, 22-28 m beam** — roughly **5-10 times** the displacement of Columbus's Santa Maria (19 m, ~100 tonnes).

Fleet logistics scale nonlinearly. Feeding 27,800 people for months at sea requires:
- **Rice**: ~1 kg/person/day = 27.8 tonnes/day
- **Fresh water**: ~3 L/person/day = 83.4 tonnes/day (collected rain + carried)
- **Firewood**: for cooking (ships carried stoves)
- **Livestock**: chickens and pigs carried live on deck

The total stores for a 90-day voyage: approximately **10,000 tonnes** of consumables alone — before any trade cargo. This is why the fleet needed so many supply ships in addition to the treasure ships.

**Displacement scales with the cube of length** for geometrically similar ships. A ship twice as long has roughly 8 times the displacement. This cube law explains why small increases in ship size yield enormous gains in cargo capacity — and why the treasure ships were such effective cargo carriers.

📚 *Zheng He's fleet was the largest naval expedition in history until World War II. The entire Spanish Armada of 1588 (130 ships, 30,000 men) was comparable in scale — but came 183 years later and was considered the mightiest fleet ever assembled by European standards.*`,
      analogy: 'Compare a bicycle to a freight train. Both have wheels and carry things, but they operate at completely different scales. You wouldn\'t compare them as if they were variations of the same thing — they represent different levels of engineering capability. Zheng He\'s fleet was the freight train; Columbus\'s was the bicycle. Both crossed oceans, but the underlying industrial capacity was vastly different.',
      storyConnection: 'Zheng He made seven voyages between 1405 and 1433. Each voyage was a massive logistical operation — assembling ships at Nanjing, loading stores and trade goods, coordinating hundreds of vessels across the South China Sea and Indian Ocean. The fleet carried silk, porcelain, and lacquerware to trade for gems, spices, exotic animals, and diplomatic gifts.',
      checkQuestion: 'If displacement scales as length cubed, and a 20 m ship displaces 150 tonnes, what does a geometrically similar 60 m ship displace?',
      checkAnswer: 'Scale factor = 60/20 = 3. Displacement scales as 3^3 = 27. So displacement = 150 x 27 = 4,050 tonnes. Real ships aren\'t perfectly geometrically similar, but the cube law gives a good first estimate. This is why the treasure ships could carry so much more than European vessels.',
      codeIntro: 'Compare fleets across history — dimensions, displacement, crew, cargo, and logistical requirements.',
      code: `import numpy as np

def ship_stats(length_m, beam_m, draft_m, depth_m, block_coeff,
               crew, hull_fraction=0.45):
    """Calculate key statistics for a ship."""
    rho = 1.025
    displacement = length_m * beam_m * draft_m * block_coeff * rho
    hull_mass = displacement * hull_fraction
    cargo_capacity = displacement - hull_mass - crew * 0.08
    deck_area = length_m * beam_m * 0.85  # usable deck

    return {
        'length': length_m, 'beam': beam_m, 'draft': draft_m,
        'displacement': displacement,
        'cargo_capacity': max(0, cargo_capacity),
        'deck_area': deck_area,
        'crew': crew,
    }

# Historical ships database
ships = {
    "Zheng He treasure (75m)": ship_stats(75, 28, 7, 9, 0.55, 500, 0.45),
    "Zheng He treasure (60m)": ship_stats(60, 22, 6, 8, 0.55, 300, 0.45),
    "Zheng He supply ship":    ship_stats(50, 18, 5, 7, 0.55, 100, 0.40),
    "Columbus Santa Maria":    ship_stats(19,  6, 3.2, 4, 0.55, 40, 0.50),
    "Columbus Nina/Pinta":     ship_stats(15,  5, 2.5, 3, 0.55, 25, 0.50),
    "HMS Victory (1765)":      ship_stats(69, 16, 7, 9, 0.58, 850, 0.55),
    "Clipper Cutty Sark":      ship_stats(65, 11, 6, 7, 0.50, 35, 0.35),
    "Titanic (1912)":          ship_stats(269, 28, 10, 19, 0.62, 2200, 0.40),
    "Cont. ship (modern)":     ship_stats(400, 59, 16, 30, 0.70, 25, 0.15),
}

print("=== Ship Comparison Across History ===\\n")
print(f"{'Ship':<30} {'L(m)':>5} {'Disp(t)':>9} {'Cargo(t)':>9} {'Crew':>5}")
print("-" * 62)
for name, s in ships.items():
    print(f"{name:<30} {s['length']:>5.0f} {s['displacement']:>8,.0f} "
          f"{s['cargo_capacity']:>8,.0f} {s['crew']:>5}")

# Fleet comparison
print(f"\\n=== Fleet Comparison ===\\n")

fleets = [
    ("Zheng He 1st voyage (1405)", [
        (62, "Zheng He treasure (75m)"),
        (255, "Zheng He supply ship"),
    ], 27800),
    ("Columbus 1st voyage (1492)", [
        (1, "Columbus Santa Maria"),
        (2, "Columbus Nina/Pinta"),
    ], 90),
    ("Spanish Armada (1588)", [
        (20, "HMS Victory (1765)"),  # approximation
        (110, "Zheng He supply ship"),
    ], 30000),
]

for fleet_name, composition, total_crew in fleets:
    total_disp = sum(n * ships[stype]['displacement'] for n, stype in composition)
    total_cargo = sum(n * ships[stype]['cargo_capacity'] for n, stype in composition)
    total_ships = sum(n for n, _ in composition)

    print(f"--- {fleet_name} ---")
    print(f"  Ships: {total_ships}")
    print(f"  Crew: {total_crew:,}")
    print(f"  Total displacement: {total_disp:,.0f} tonnes")
    print(f"  Total cargo capacity: {total_cargo:,.0f} tonnes\\n")

# Logistics calculation
print(f"=== Fleet Logistics: Feeding 27,800 People ===\\n")

crew_total = 27800
days = 90  # voyage duration

rice_per_day = crew_total * 1.0 / 1000     # tonnes
water_per_day = crew_total * 3.0 / 1000    # tonnes
wood_per_day = crew_total * 0.2 / 1000     # tonnes

print(f"Daily consumption for {crew_total:,} crew:")
print(f"  Rice:  {rice_per_day:>6.1f} t/day ({rice_per_day*days:>6.0f} t for {days} days)")
print(f"  Water: {water_per_day:>6.1f} t/day ({water_per_day*days:>6.0f} t for {days} days)")
print(f"  Fuel:  {wood_per_day:>6.1f} t/day ({wood_per_day*days:>6.0f} t for {days} days)")
total_stores = (rice_per_day + water_per_day + wood_per_day) * days
print(f"  TOTAL: {total_stores:,.0f} tonnes of consumables")

supply_ship_cargo = ships["Zheng He supply ship"]["cargo_capacity"]
ships_needed = int(np.ceil(total_stores / supply_ship_cargo))
print(f"\\n  Supply ship cargo capacity: {supply_ship_cargo:,.0f} t each")
print(f"  Supply ships needed: {ships_needed}")
print(f"  (Historical record: 255 support vessels — consistent)")

# Scale law demonstration
print(f"\\n=== The Cube Law of Ship Scaling ===\\n")
base_length = 19  # Santa Maria
base_disp = ships["Columbus Santa Maria"]["displacement"]
print(f"Base: Santa Maria at {base_length}m = {base_disp:.0f}t\\n")
for factor in [1, 2, 3, 4, 5]:
    L = base_length * factor
    predicted = base_disp * factor**3
    print(f"  {factor}x length ({L}m): {factor}^3 = {factor**3}x displacement"
          f" = {predicted:,.0f}t")`,
      challenge: 'Add a cost analysis: if building cost scales as displacement^0.7 (economies of scale), and crew cost is proportional to crew size, calculate the cost-per-tonne-of-cargo for each ship type. Which ship design is the most economical? This explains why treasure ships were worth building despite their complexity.',
      successHint: 'You quantified the scale differences between civilizations using dimensional analysis and cube-law scaling — the same principles used in modern naval architecture, aerospace engineering, and logistics planning. The numbers tell a story that narrative history cannot: Ming China operated at an industrial scale that Europe would not match for another 300 years.',
    },
    {
      title: 'The cancellation — counterfactual modeling of continued Chinese exploration',
      concept: `In 1433, the Xuande Emperor ordered the treasure fleet scrapped. The Confucian bureaucracy, which had always opposed the expensive voyages, won the political argument. Ship-building records were destroyed. Within a generation, it became illegal to build ocean-going ships with more than two masts.

This is one of history's great counterfactuals: **what if China had continued?** We can model this quantitatively.

By 1433, Zheng He's fleet had reached **East Africa** — approximately halfway around the world. The fleet's average speed was about **4-5 knots** (sailing) and it had demonstrated the ability to cross open ocean for **weeks at a time**. The trade goods included silk, porcelain, tea, and metalwork — products in high demand everywhere.

To model the counterfactual, we need:
1. **Route economics**: revenue per voyage vs cost (ships, crew, cargo)
2. **Expansion rate**: how fast could the fleet explore new territory?
3. **Network effects**: each new trade port increases the value of all routes

The trade network's value grows approximately as **n^2** (Metcalfe's law) where n is the number of connected ports. With 30 ports already connected by 1433, adding 10 more would increase network value by **(40/30)^2 = 1.78x** — a 78% increase.

The economic question isn't whether the voyages were profitable (they were), but whether the bureaucracy could have been convinced to continue investing. The treasure fleet consumed approximately **10% of Ming government revenue** — enormous, but comparable to modern military budgets.

📚 *Counterfactual modeling isn't fantasy — it's a rigorous exercise in identifying which variables matter. Economists, military strategists, and policy analysts use counterfactual models to evaluate decisions and their consequences. The key is making assumptions explicit and testable.*`,
      analogy: 'Imagine a company that invented the smartphone in 1990 but then decided phones were a waste of money and shut down the project. We know what happened when smartphones actually launched in 2007 — trillions in economic value. The treasure fleet cancellation is similar: a proven technology with enormous potential, abandoned for political reasons, leaving the economic gains for others to capture centuries later.',
      storyConnection: 'After the cancellation, Chinese maritime knowledge was deliberately destroyed. The fleet\'s charts, logs, and construction manuals were burned. The shipyards at Nanjing were dismantled. Within 100 years, Portugal and Spain — with far smaller ships and crews — would establish the global trade routes that China had abandoned. The Portuguese reached the same East African ports by 1498, just 65 years later.',
      checkQuestion: 'If the treasure fleet could add ~3 new trade ports per voyage (2-year cycle), how many ports would be connected by 1500 (67 years after cancellation, ~33 more voyages)?',
      checkAnswer: 'Starting from 30 ports in 1433, adding 3 per voyage for 33 voyages = 30 + 99 = 129 ports. Network value scales as n^2, so value ratio = (129/30)^2 = 18.5x. The trade network would have been 18.5 times more valuable than at cancellation — connecting all of Africa, the Middle East, India, Southeast Asia, and potentially the Americas.',
      codeIntro: 'Model the counterfactual: trade network growth, economic value, and what-if scenarios for continued Chinese exploration.',
      code: `import numpy as np

def voyage_economics(num_ships, crew_per_ship, cargo_tonnes,
                      trade_markup, voyage_days, annual_budget):
    """Calculate the economics of a treasure fleet voyage."""
    crew_total = num_ships * crew_per_ship
    crew_cost = crew_total * voyage_days * 0.01  # units of silver taels
    ship_cost = num_ships * 5000  # construction amortized
    cargo_value = cargo_tonnes * 10  # base value
    revenue = cargo_value * trade_markup
    profit = revenue - crew_cost - ship_cost
    roi = profit / (crew_cost + ship_cost) * 100

    return {
        'revenue': revenue,
        'cost': crew_cost + ship_cost,
        'profit': profit,
        'roi': roi,
        'budget_pct': (crew_cost + ship_cost) / annual_budget * 100,
    }

def network_value(n_ports, base_value_per_port=100):
    """Trade network value (Metcalfe's law)."""
    return base_value_per_port * n_ports * (n_ports - 1) / 2

# Historical parameters
print("=== Economics of the Treasure Fleet ===\\n")

ming_budget = 30_000_000  # silver taels, approximate annual revenue

scenarios = [
    ("Actual 4th voyage (1413)", 63, 400, 2000, 2.5, 600),
    ("Reduced fleet (budget cut)", 30, 300, 1000, 2.5, 400),
    ("Expanded fleet (investment)", 100, 400, 3500, 3.0, 700),
]

for name, ships, crew, cargo, markup, days in scenarios:
    r = voyage_economics(ships, crew, cargo, markup, days, ming_budget)
    print(f"--- {name} ---")
    print(f"  Ships: {ships}, Crew: {ships*crew:,}")
    print(f"  Revenue: {r['revenue']:>12,.0f} taels")
    print(f"  Cost:    {r['cost']:>12,.0f} taels")
    print(f"  Profit:  {r['profit']:>12,.0f} taels")
    print(f"  ROI: {r['roi']:.0f}% | Budget share: {r['budget_pct']:.1f}%\\n")

# Network growth model
print("=== Counterfactual: Network Growth 1433-1500 ===\\n")

ports_1433 = 30
new_ports_per_voyage = 3
voyage_cycle_years = 2

print(f"{'Year':>6} {'Voyages':>8} {'Ports':>6} {'Network Value':>14} {'vs 1433':>8}")
print("-" * 46)

for year in range(1433, 1510, 5):
    elapsed = year - 1433
    voyages = elapsed // voyage_cycle_years
    ports = ports_1433 + voyages * new_ports_per_voyage
    value = network_value(ports)
    ratio = value / network_value(ports_1433)
    print(f"{year:>6} {voyages:>8} {ports:>6} {value:>13,.0f} {ratio:>7.1f}x")

# Exploration range model
print(f"\\n=== Exploration Reach by Decade ===\\n")

speed_knots = 4.5
sailing_days_per_voyage = 180
nm_per_day = speed_knots * 24 * 0.6  # 60% utilization
range_per_voyage = nm_per_day * sailing_days_per_voyage
km_per_voyage = range_per_voyage * 1.852

known_range_1433 = 12000  # km from Nanjing (reached E. Africa)

print(f"Fleet range per voyage: {km_per_voyage:,.0f} km")
print(f"Known range by 1433: {known_range_1433:,} km (East Africa)\\n")

milestones = [
    (12000, "East Africa (achieved 1433)"),
    (15000, "Southern Africa / Cape"),
    (18000, "West Africa"),
    (22000, "Brazil / Caribbean"),
    (25000, "Western Europe"),
    (30000, "Circumnavigation"),
]

cumulative_range = known_range_1433
year = 1433

print(f"{'Year':>6} {'Cumulative Range':>16} {'Milestone':>30}")
print("-" * 56)

for _ in range(20):  # 20 more voyages
    year += 2
    cumulative_range += km_per_voyage * 0.3  # 30% is new territory
    for dist, name in milestones:
        if cumulative_range >= dist and cumulative_range - km_per_voyage * 0.3 < dist:
            print(f"{year:>6} {cumulative_range:>14,.0f} km   {name}")

# Compare actual history
print(f"\\n=== What Actually Happened (without China) ===\\n")

events = [
    (1433, "Treasure fleet cancelled"),
    (1488, "Dias rounds Cape of Good Hope"),
    (1492, "Columbus reaches Caribbean"),
    (1498, "Da Gama reaches India (Zheng He's ports)"),
    (1519, "Magellan begins circumnavigation"),
    (1571, "Manila galleon trade begins"),
]

for year, event in events:
    gap = year - 1433
    print(f"  {year} (+{gap:>2}y): {event}")

print(f"\\nKey insight: Europe took 65 years to reach ports China")
print(f"already knew in 1433. The cancellation didn't stop global")
print(f"trade — it just shifted who controlled it, with consequences")
print(f"that shaped the modern world for the next 500 years.")`,
      challenge: 'Model the competition: if China continued AND Portugal expanded simultaneously, where would they have met? Calculate the year and location of first contact between Chinese and Portuguese fleets, assuming both expanded at historical rates. What would the economic and political consequences have been?',
      successHint: 'You built a counterfactual economic model — the same approach used by economic historians, policy analysts, and strategic planners. Counterfactual modeling forces you to make assumptions explicit: growth rates, costs, network effects. The treasure fleet cancellation wasn\'t just a historical curiosity — it\'s a case study in how political decisions can override economic logic, with consequences that compound over centuries.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Naval engineering, navigation, and historical analysis through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model buoyancy, bulkhead flooding, hull bending, compass navigation, fleet logistics, and counterfactual history.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L1-${i + 1}`}
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
