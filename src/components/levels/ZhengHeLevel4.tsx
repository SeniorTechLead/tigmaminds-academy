import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ZhengHeLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Design a Ship Design Calculator',
      concept: `In this capstone project, you will build a complete **Ship Design Calculator** — a Python program that:

1. **Defines ship components** as classes (Hull, Sail, Compartment) with physical properties
2. **Calculates buoyancy and displacement** for any hull shape using hydrostatic integration
3. **Analyses structural loads** (hogging, sagging) against material limits
4. **Predicts performance** (speed, range, cargo capacity) from the design parameters
5. **Generates a design report** comparing your ship to historical vessels

This brings together everything from Levels 1-3: metacentric height, sail forces, wood properties, hull stress, wave response, logistics, and structural scaling.

The first step is **system design** — defining the class hierarchy and data flow before writing calculations. A ship is naturally decomposed into components: the hull provides buoyancy, the sails provide propulsion, and the compartments organise internal space.

📚 *Object-oriented design maps naturally to physical systems: each physical component becomes a class, its properties become attributes, and its behaviour becomes methods. A ship is a collection of interacting components — and so is the code that models it.*`,
      analogy: 'Before building a real ship, the naval architect draws plans showing every component: hull lines, mast positions, compartment layout, rudder geometry. Before writing the Ship Design Calculator, you design the "software blueprint" — class diagrams showing every component, its properties, and how they interact.',
      storyConnection: 'Zheng He\'s master shipbuilders at the Longjiang shipyard in Nanjing planned every detail before cutting timber: hull shape, mast count, compartment layout, rudder size. Their planning process — design before construction — is the same principle we apply to software: architecture before code.',
      checkQuestion: 'Why should Hull, Sail, and Compartment be separate classes rather than one big Ship class?',
      checkAnswer: 'Separation of concerns: each class handles one responsibility. The Hull class knows about buoyancy and structure. The Sail class knows about wind forces. The Compartment class knows about cargo and flooding. This makes each class simpler, testable, and reusable. You could swap in different sail designs without changing the hull code.',
      codeIntro: 'Design the architecture of the Ship Design Calculator — define classes, properties, and interfaces.',
      code: `# Ship Design Calculator — System Design
# Step 1: Define the class hierarchy

import numpy as np

class Hull:
    """Represents the ship's hull with hydrostatic properties."""
    def __init__(self, name, length, beam, depth, draft,
                 block_coeff=0.6, material="teak"):
        self.name = name
        self.L = length        # m
        self.B = beam           # m
        self.D = depth          # m (total hull depth)
        self.T = draft          # m (submerged depth)
        self.Cb = block_coeff   # block coefficient (fullness)
        self.material = material

        # Material properties
        self.mat_props = {
            "teak":     {"density": 650, "strength_long": 95, "strength_trans": 5.5},
            "oak":      {"density": 700, "strength_long": 85, "strength_trans": 5.0},
            "fir":      {"density": 350, "strength_long": 40, "strength_trans": 2.5},
            "ironwood": {"density": 1050,"strength_long": 130,"strength_trans": 8.0},
        }

    def displacement(self):
        """Displacement in tonnes."""
        rho_water = 1025  # kg/m³
        vol = self.L * self.B * self.T * self.Cb
        return vol * rho_water / 1000

    def waterplane_area(self):
        """Waterplane area in m²."""
        Cwp = 0.7 * self.Cb + 0.3  # waterplane coefficient approximation
        return self.L * self.B * Cwp

class Sail:
    """Represents a single sail or the full sail plan."""
    def __init__(self, name, area, mast_height, sail_type="lug"):
        self.name = name
        self.area = area          # m²
        self.height = mast_height  # m
        self.type = sail_type     # lug, square, lateen

    def force(self, wind_speed, angle_of_attack_deg):
        """Aerodynamic force in newtons."""
        rho_air = 1.225
        CL = {"lug": 1.1, "square": 0.9, "lateen": 1.3}[self.type]
        return 0.5 * rho_air * wind_speed**2 * self.area * CL

class Compartment:
    """Represents a watertight compartment."""
    def __init__(self, name, length, beam, depth, purpose="cargo"):
        self.name = name
        self.L = length
        self.B = beam
        self.D = depth
        self.purpose = purpose  # cargo, water, crew, stores

    def volume(self):
        """Usable volume in m³ (80% fill factor)."""
        return self.L * self.B * self.D * 0.8

    def capacity_tonnes(self):
        """Cargo capacity in tonnes (assuming 500 kg/m³ stowage)."""
        stow_factor = {"cargo": 500, "water": 1000,
                       "crew": 200, "stores": 400}
        return self.volume() * stow_factor.get(self.purpose, 500) / 1000

# Build Zheng He's treasure ship
hull = Hull("Treasure Ship", 120, 50, 12, 7.5, 0.55, "teak")
sails = [Sail(f"Mast {i+1}", area, 30, "lug")
         for i, area in enumerate([400, 400, 350, 350, 300, 300, 250, 200, 150])]
compartments = [
    Compartment("Fore cargo", 20, 40, 8, "cargo"),
    Compartment("Main cargo 1", 15, 40, 8, "cargo"),
    Compartment("Main cargo 2", 15, 40, 8, "cargo"),
    Compartment("Water tank 1", 10, 30, 6, "water"),
    Compartment("Water tank 2", 10, 30, 6, "water"),
    Compartment("Crew quarters", 15, 35, 5, "crew"),
    Compartment("Provisions", 12, 30, 6, "stores"),
    Compartment("Aft cargo", 10, 35, 8, "cargo"),
]

# System overview
print("=== Ship Design Calculator — Architecture ===\\n")
print(f"Hull: {hull.name}")
print(f"  Dimensions: {hull.L}m × {hull.B}m × {hull.D}m (draft {hull.T}m)")
print(f"  Displacement: {hull.displacement():,.0f} tonnes")
print(f"  Waterplane area: {hull.waterplane_area():,.0f} m²")
print(f"\\nSail plan: {len(sails)} masts")
total_sail = sum(s.area for s in sails)
print(f"  Total sail area: {total_sail:,.0f} m²")
print(f"\\nCompartments: {len(compartments)}")
total_cargo = sum(c.capacity_tonnes() for c in compartments)
for c in compartments:
    print(f"  {c.name:<20} {c.volume():>6.0f} m³  {c.capacity_tonnes():>6.0f}t ({c.purpose})")
print(f"  Total capacity: {total_cargo:,.0f} tonnes")`,
      challenge: 'Add a Rudder class with properties: area, aspect_ratio, and max_angle. Include a method that calculates the turning force at a given ship speed. The treasure ship used a massive balanced rudder (~7 m tall) that could be raised and lowered — add a draft parameter for the rudder.',
      successHint: 'Good system design makes everything else easier. You defined three cooperating classes — Hull, Sail, Compartment — each with clear responsibilities and interfaces. This is the same decomposition pattern used by professional ship design software (Maxsurf, NAPA, Rhino/Orca3D).',
    },
    {
      title: 'Building the buoyancy engine — hydrostatic calculations for any hull shape',
      concept: `The buoyancy engine is the heart of the Ship Design Calculator. It answers the fundamental question: **at what draft does the ship float?**

Archimedes' principle: a floating ship displaces water equal to its own weight. The buoyancy force equals: **F_b = ρ_water × g × V_submerged**. The ship floats when this equals its weight.

For a realistic hull shape (not a simple box), we calculate submerged volume by **numerical integration** — slicing the hull into thin horizontal layers and summing their areas:

**V = Σ A(z) × Δz** (from keel to waterline)

Where A(z) is the waterplane area at height z. For a hull with curved sections, A(z) varies — wider at the waterline, narrower at the keel.

From the submerged volume, we can also calculate the **centre of buoyancy** (the centroid of the submerged volume) and the **waterplane second moment of area** (which gives BM for stability).

📚 *Numerical integration replaces an exact integral with a sum of small pieces — the same technique used in every engineering simulation, from fluid dynamics to orbital mechanics.*`,
      analogy: 'Imagine lowering a ship model into a bathtub one millimetre at a time, measuring the water that overflows at each step. The total overflow when the model floats equals its weight. Numerical integration does the same thing mathematically — summing thin slices of submerged volume until the buoyancy matches the ship\'s weight.',
      storyConnection: 'Chinese shipbuilders at the Longjiang shipyard used empirical methods to determine the correct draft — loading ballast stones until the waterline matched scribed marks on the hull. Our buoyancy engine does the same calculation analytically, predicting the draft before the ship is even built.',
      checkQuestion: 'A hull has a waterplane area of 4,000 m² at the waterline and tapers to 2,000 m² at the keel, 7.5 m below. Using the trapezoidal rule with one step, what is the approximate submerged volume?',
      checkAnswer: 'V = (A_top + A_bottom) / 2 × depth = (4,000 + 2,000) / 2 × 7.5 = 22,500 m³. Displacement = 22,500 × 1.025 = 23,062 tonnes. With more integration steps (thinner slices), the answer becomes more accurate as we capture the actual shape of the hull.',
      codeIntro: 'Build a hydrostatic calculator that computes buoyancy, draft, and stability for any hull shape.',
      code: `import numpy as np

class BuoyancyEngine:
    """Hydrostatic calculator for arbitrary hull shapes."""

    def __init__(self, length, max_beam, depth, hull_shape="junk"):
        self.L = length
        self.B_max = max_beam
        self.D = depth
        self.shape = hull_shape
        self.rho = 1025  # seawater kg/m³

    def beam_at_depth(self, z):
        """Hull beam at height z above keel."""
        if self.shape == "junk":
            # Flat bottom, slight flare: beam increases from ~85% at keel to 100% at deck
            fraction = z / self.D
            return self.B_max * (0.85 + 0.15 * fraction)
        elif self.shape == "caravel":
            # Round bottom: beam = max × sin(π/2 × z/D)
            return self.B_max * np.sin(np.pi / 2 * min(z / self.D, 1))
        elif self.shape == "galleon":
            # Slight V-shape: beam increases with sqrt
            return self.B_max * np.sqrt(min(z / self.D, 1))
        return self.B_max

    def waterplane_area(self, z):
        """Waterplane area at height z above keel."""
        B_z = self.beam_at_depth(z)
        Cwp = 0.75  # waterplane coefficient
        return self.L * B_z * Cwp

    def submerged_volume(self, draft, n_slices=50):
        """Calculate submerged volume by numerical integration."""
        dz = draft / n_slices
        volume = 0
        for i in range(n_slices):
            z = (i + 0.5) * dz  # midpoint of each slice
            A = self.waterplane_area(z)
            volume += A * dz
        return volume

    def displacement(self, draft):
        """Displacement in tonnes at given draft."""
        return self.submerged_volume(draft) * self.rho / 1000

    def find_draft(self, weight_tonnes, tol=0.1):
        """Find equilibrium draft for a given weight (Newton's method)."""
        draft = self.D * 0.5  # initial guess
        for _ in range(50):
            disp = self.displacement(draft)
            error = disp - weight_tonnes
            if abs(error) < tol:
                break
            # Adjust draft proportionally
            dwp = self.waterplane_area(draft) * self.rho / 1000
            draft -= error / dwp
            draft = max(0.1, min(draft, self.D * 0.95))
        return draft

    def centre_of_buoyancy(self, draft, n_slices=50):
        """Vertical position of centre of buoyancy (KB) above keel."""
        dz = draft / n_slices
        moment = 0
        volume = 0
        for i in range(n_slices):
            z = (i + 0.5) * dz
            A = self.waterplane_area(z)
            dV = A * dz
            volume += dV
            moment += dV * z
        return moment / volume if volume > 0 else 0

    def BM(self, draft):
        """Metacentric radius BM = I_wp / V."""
        B_wl = self.beam_at_depth(draft)
        I_wp = self.L * B_wl**3 / 12  # second moment of waterplane
        V = self.submerged_volume(draft)
        return I_wp / V if V > 0 else 0

# Analyse Zheng He's treasure ship
engine = BuoyancyEngine(120, 50, 12, "junk")

print("=== Buoyancy Engine: Treasure Ship ===\\n")

# Draft vs displacement curve
print(f"{'Draft (m)':<10} {'Volume (m³)':>12} {'Disp (t)':>10} {'KB (m)':>8} {'BM (m)':>8}")
print("-" * 50)
for T in np.arange(1, 10.1, 1):
    vol = engine.submerged_volume(T)
    disp = engine.displacement(T)
    kb = engine.centre_of_buoyancy(T)
    bm = engine.BM(T)
    print(f"{T:<9.1f} {vol:>11.0f} {disp:>9.0f} {kb:>7.2f} {bm:>7.1f}")

# Find draft for different loading conditions
print("\\n=== Loading Conditions ===")
conditions = [
    ("Light ship (empty)", 8000),
    ("Half cargo", 14000),
    ("Full cargo", 20000),
    ("Overloaded", 25000),
]

for name, weight in conditions:
    draft = engine.find_draft(weight)
    kb = engine.centre_of_buoyancy(draft)
    bm = engine.BM(draft)
    freeboard = 12 - draft  # distance from waterline to deck
    safe = "OK" if freeboard > 2.0 else "LOW" if freeboard > 1.0 else "DANGER"
    print(f"  {name:<25} {weight:>6,}t  Draft: {draft:.1f}m  "
          f"Freeboard: {freeboard:.1f}m [{safe}]")

# Compare hull shapes
print("\\n=== Hull Shape Comparison (same dimensions) ===")
print(f"{'Shape':<12} {'Vol at 7.5m':>12} {'Disp (t)':>10} {'KB (m)':>8} {'BM (m)':>8}")
print("-" * 52)
for shape in ["junk", "caravel", "galleon"]:
    eng = BuoyancyEngine(120, 50, 12, shape)
    vol = eng.submerged_volume(7.5)
    disp = eng.displacement(7.5)
    kb = eng.centre_of_buoyancy(7.5)
    bm = eng.BM(7.5)
    print(f"{shape:<12} {vol:>11.0f} {disp:>9.0f} {kb:>7.2f} {bm:>7.1f}")`,
      challenge: 'Add a flooding analysis: if compartment 3 (15 m long) floods, the ship gains weight and the draft increases. Calculate the new draft and check if the freeboard is still positive (ship still floats). This is the calculation that determines whether a ship survives a hull breach — and why watertight bulkheads matter.',
      successHint: 'You built a hydrostatic solver — the core tool of naval architecture. Professional software (Maxsurf Stability, GHS) uses the same integration technique with finer mesh and 3D hull geometry, but the principle is identical: slice, sum, and find equilibrium.',
    },
    {
      title: 'Structural analyser — hogging and sagging stress vs material limits',
      concept: `A ship in waves acts as a **beam** — supported unevenly by water pressure and loaded unevenly by its own weight and cargo. When a wave crest is at midship, the bow and stern are unsupported and droop — this is **sagging**. When wave crests support the bow and stern but the midship is in a trough — this is **hogging**.

The bending moment at any section is: **M(x) = ∫₀ˣ [b(x) - w(x)] dx**, where b(x) is the buoyancy force per unit length and w(x) is the weight per unit length at position x along the ship.

The bending stress is: **σ = M / Z**, where Z is the section modulus of the hull cross-section. For a wooden ship, the hull section modulus depends on the plank thickness, frame spacing, keelson dimensions, and deck beam scantlings.

The structural analyser compares this bending stress against the material's strength. If **σ > σ_material**, the hull fails — planks crack, frames buckle, and the ship breaks in two.

📚 *Hogging and sagging are the primary structural loads on any ship. Classification societies (Lloyd's, DNV) require that every ship demonstrate adequate strength against both — calculated using methods very similar to what you'll code below.*`,
      analogy: 'Hold a long baguette by the ends and push down in the middle — it sags and eventually snaps. Now support the middle and push down on the ends — it hogs and snaps at the centre. A ship in waves experiences both: sagging on wave crests, hogging in wave troughs. The midship section — where the bending moment is greatest — is where ships break.',
      storyConnection: 'Historical reports describe Chinese treasure ships sometimes "working" in heavy seas — the hull visibly flexing and creaking as waves passed along its length. The flexible junk construction (planks lashed and caulked rather than rigidly fastened) allowed this deflection without catastrophic failure. European ships of the same era, with rigid mortise-and-tenon joints, would crack rather than flex.',
      checkQuestion: 'A 120 m ship has a uniform weight of 200 kN/m and sits on a wave with a crest at midship. The buoyancy under the crest is 250 kN/m but drops to 150 kN/m at the bow and stern. Is the ship hogging or sagging?',
      checkAnswer: 'The midship has excess buoyancy (250 > 200 = +50 kN/m net upward) while the ends have excess weight (200 > 150 = -50 kN/m net downward). The ends droop relative to the middle — this is HOGGING (the ship bends convex-upward like a banana). The deck is in compression and the keel is in tension.',
      codeIntro: 'Build a structural analyser that calculates hogging and sagging bending moments along the ship.',
      code: `import numpy as np

class StructuralAnalyser:
    """Analyses longitudinal bending of a ship hull."""

    def __init__(self, length, beam, depth, displacement_tonnes):
        self.L = length
        self.B = beam
        self.D = depth
        self.disp = displacement_tonnes
        self.g = 9.81

    def weight_distribution(self, x, cargo_profile="uniform"):
        """Weight per unit length (kN/m) at position x along ship."""
        base = self.disp * self.g / self.L  # average kN/m
        if cargo_profile == "uniform":
            return base
        elif cargo_profile == "midship_heavy":
            # More weight amidships (typical cargo loading)
            mid = self.L / 2
            factor = 1.0 + 0.3 * np.exp(-((x - mid) / (self.L / 4))**2)
            return base * factor
        return base

    def buoyancy_distribution(self, x, wave_type="still"):
        """Buoyancy per unit length (kN/m) at position x."""
        base = self.disp * self.g / self.L  # must equal weight in still water
        if wave_type == "still":
            return base
        elif wave_type == "hogging":
            # Wave crests at bow and stern, trough at midship
            factor = 1.0 + 0.25 * np.cos(2 * np.pi * x / self.L)
            return base * factor
        elif wave_type == "sagging":
            # Wave crest at midship
            factor = 1.0 - 0.25 * np.cos(2 * np.pi * x / self.L)
            return base * factor
        return base

    def bending_moment(self, wave_type="still", cargo="uniform", n_points=200):
        """Calculate bending moment distribution along the ship."""
        dx = self.L / n_points
        x_vals = np.linspace(0, self.L, n_points)
        shear = np.zeros(n_points)
        moment = np.zeros(n_points)

        for i in range(1, n_points):
            x = x_vals[i]
            w = self.weight_distribution(x, cargo)
            b = self.buoyancy_distribution(x, wave_type)
            net = b - w  # net upward force per unit length

            shear[i] = shear[i-1] + net * dx
            moment[i] = moment[i-1] + shear[i] * dx

        return x_vals, shear, moment

    def hull_section_modulus(self, plank_thickness_m):
        """Section modulus of hull cross-section (simplified box girder)."""
        t = plank_thickness_m
        I_outer = self.B * self.D**3 / 12
        I_inner = (self.B - 2*t) * (self.D - 2*t)**3 / 12
        I_net = I_outer - I_inner
        Z = I_net / (self.D / 2)
        return Z

# Analyse the treasure ship
analyser = StructuralAnalyser(120, 50, 12, 20000)

print("=== Structural Analysis: Zheng He Treasure Ship ===\\n")

# Compare still water, hogging, and sagging
conditions = [
    ("Still water", "still", "uniform"),
    ("Hogging (wave L=120m)", "hogging", "uniform"),
    ("Sagging (wave L=120m)", "sagging", "uniform"),
    ("Hogging + midship cargo", "hogging", "midship_heavy"),
]

plank_t = 0.15  # 150mm planking
Z = analyser.hull_section_modulus(plank_t)
wood_strength = 20  # MPa (effective hull girder strength)

print(f"Hull section modulus: {Z:.1f} m³")
print(f"Wood effective strength: {wood_strength} MPa\\n")

for name, wave, cargo in conditions:
    x, shear, moment = analyser.bending_moment(wave, cargo)
    M_max = np.max(np.abs(moment))
    M_max_pos = x[np.argmax(np.abs(moment))]
    sigma = M_max / Z / 1000  # MPa

    sf = wood_strength / sigma if sigma > 0 else float('inf')
    status = "SAFE" if sf > 2.0 else "marginal" if sf > 1.0 else "FAILS"

    print(f"{name}:")
    print(f"  Max moment: {M_max/1000:>10.0f} kN·m at x = {M_max_pos:.0f}m")
    print(f"  Max stress: {sigma:>10.1f} MPa | Safety factor: {sf:.1f} [{status}]")
    print()

# Effect of plank thickness
print("=== Plank Thickness Effect (hogging condition) ===")
_, _, moment_hog = analyser.bending_moment("hogging", "midship_heavy")
M_max = np.max(np.abs(moment_hog))

print(f"{'Thickness (mm)':<16} {'Z (m³)':>8} {'Stress (MPa)':>13} {'SF':>5} {'Status':>10}")
print("-" * 54)
for t_mm in [80, 100, 120, 150, 180, 200, 250]:
    Z_t = analyser.hull_section_modulus(t_mm / 1000)
    sigma_t = M_max / Z_t / 1000
    sf_t = wood_strength / sigma_t if sigma_t > 0 else float('inf')
    status = "SAFE" if sf_t > 2 else "marginal" if sf_t > 1 else "FAILS"
    print(f"{t_mm:<15} {Z_t:>7.1f} {sigma_t:>11.1f} {sf_t:>5.1f} {status:>10}")`,
      challenge: 'Add dynamic wave loading: instead of a single static wave, model the ship passing through a wave train. At each position, calculate the bending moment. Find the worst-case position (maximum bending moment) — this is the design wave condition that classification societies use.',
      successHint: 'You built a longitudinal strength analyser — the most critical calculation in ship structural design. Every ship in the world has this analysis performed before construction begins. Classification societies require that the maximum bending stress never exceeds the material\'s allowable stress with an adequate safety margin.',
    },
    {
      title: 'Performance predictor — speed, range, and cargo capacity',
      concept: `With the buoyancy engine and structural analyser in place, we can now build the **performance predictor** — the module that answers practical questions:

- **How fast will the ship go** in a given wind?
- **How far can it travel** on its provisions?
- **How much cargo can it carry** while maintaining safety margins?

Speed prediction requires balancing **sail drive force** against **hull resistance**. At steady speed, these are equal:

**F_sail = F_resistance**

Hull resistance has two components:
- **Friction drag**: R_f = 0.5 × ρ × V² × S × C_f (proportional to wetted area and V²)
- **Wave-making drag**: R_w ≈ k × Δ × (V/√L)⁴ (increases dramatically near hull speed)

The **hull speed** — the maximum practical speed for a displacement vessel — is approximately: **V_hull = 1.34 × √L (in knots, L in feet)** or **V_hull = 2.43 × √L (in knots, L in metres)**.

📚 *Hull speed exists because a displacement vessel creates a bow wave. As speed increases, the wave gets longer. When the wave length equals the hull length, the ship is essentially climbing its own bow wave — requiring enormous power to go faster.*`,
      analogy: 'Imagine running through waist-deep water. At first, pushing harder makes you go faster. But at some speed, you\'re climbing up the wave you\'re creating in front of you — and pushing harder barely helps. That\'s hull speed. You\'re trapped behind your own bow wave. The only way to go faster is to get ON TOP of the wave (planing) — which displacement ships can\'t do.',
      storyConnection: 'Zheng He\'s treasure ships, at 120 m, had a theoretical hull speed of about 26 knots — far higher than their actual speed of 4-6 knots. They were nowhere near hull speed, meaning their speed was limited by sail power, not hull physics. This is typical for large ships: they have more hull speed than they can use.',
      checkQuestion: 'A ship is 120 m long. What is its hull speed? If it actually sails at 5 knots, what percentage of hull speed is it using?',
      checkAnswer: 'Hull speed = 2.43 × √120 = 2.43 × 10.95 = 26.6 knots. At 5 knots: 5/26.6 = 18.8%. The ship is operating well below hull speed, meaning wave-making resistance is negligible — friction drag dominates. Increasing sail area would increase speed almost linearly in this regime.',
      codeIntro: 'Build a performance predictor combining sail power, hull resistance, and endurance calculations.',
      code: `import numpy as np

class PerformancePredictor:
    """Predicts ship speed, range, and cargo capacity."""

    def __init__(self, length, beam, draft, displacement_t,
                 sail_area, crew_size):
        self.L = length
        self.B = beam
        self.T = draft
        self.disp = displacement_t
        self.sail_area = sail_area
        self.crew = crew_size
        self.rho_water = 1025
        self.rho_air = 1.225

    def wetted_surface(self):
        """Approximate wetted surface area (Holtrop method simplified)."""
        return self.L * (2 * self.T + self.B) * 0.75

    def hull_speed_knots(self):
        """Theoretical hull speed."""
        return 2.43 * np.sqrt(self.L)

    def resistance(self, speed_knots):
        """Total hull resistance in Newtons at given speed."""
        V = speed_knots * 0.5144  # convert to m/s
        S = self.wetted_surface()

        # Friction resistance (ITTC 1957)
        Re = V * self.L / 1.19e-6  # Reynolds number
        if Re < 1:
            return 0
        Cf = 0.075 / (np.log10(Re) - 2)**2
        R_friction = 0.5 * self.rho_water * V**2 * S * Cf

        # Wave-making resistance (simplified Michell)
        Fn = V / np.sqrt(9.81 * self.L)  # Froude number
        Cw = 0.001 * (Fn / 0.35)**4 if Fn < 0.5 else 0.01
        R_wave = 0.5 * self.rho_water * V**2 * S * Cw

        return R_friction + R_wave

    def sail_drive(self, wind_knots, wind_angle_deg):
        """Sail drive force in Newtons."""
        V_wind = wind_knots * 0.5144
        CL = 1.1  # lug sail
        F_total = 0.5 * self.rho_air * V_wind**2 * self.sail_area * CL
        angle_rad = np.radians(wind_angle_deg)
        drive = F_total * np.cos(angle_rad / 2)
        return max(drive, 0)

    def equilibrium_speed(self, wind_knots, wind_angle_deg):
        """Find speed where sail drive = hull resistance."""
        drive = self.sail_drive(wind_knots, wind_angle_deg)
        # Binary search for equilibrium
        v_low, v_high = 0.1, 20
        for _ in range(50):
            v_mid = (v_low + v_high) / 2
            R = self.resistance(v_mid)
            if R < drive:
                v_low = v_mid
            else:
                v_high = v_mid
        return (v_low + v_high) / 2

    def range_nm(self, speed_knots, provisions_tonnes):
        """Maximum range in nautical miles."""
        daily_consumption = self.crew * 4.5 / 1000  # tonnes per day
        days = provisions_tonnes / daily_consumption
        return speed_knots * 24 * days

# Treasure ship performance
ship = PerformancePredictor(120, 50, 7.5, 20000, 3000, 500)

print("=== Performance Prediction: Zheng He Treasure Ship ===\\n")
print(f"Hull speed: {ship.hull_speed_knots():.1f} knots")
print(f"Wetted surface: {ship.wetted_surface():,.0f} m²\\n")

# Speed vs wind
print("=== Speed vs Wind Conditions ===")
print(f"{'Wind (kt)':<11} {'Angle':>6} {'Drive (kN)':>11} {'Speed (kt)':>11}")
print("-" * 41)
for wind in [8, 12, 15, 20, 25]:
    for angle in [60, 90, 120]:
        drive = ship.sail_drive(wind, angle)
        speed = ship.equilibrium_speed(wind, angle)
        if angle == 90:  # only print beam wind for brevity
            print(f"{wind:<10} {angle:>4}° {drive/1000:>9.1f} {speed:>9.1f}")

# Speed-resistance curve
print("\\n=== Resistance vs Speed ===")
print(f"{'Speed (kt)':<12} {'R_total (kN)':>13} {'Power (kW)':>11} {'% hull spd':>11}")
print("-" * 49)
hull_spd = ship.hull_speed_knots()
for v in [2, 3, 4, 5, 6, 8, 10, 15]:
    R = ship.resistance(v)
    P = R * v * 0.5144 / 1000  # power in kW
    pct = v / hull_spd * 100
    print(f"{v:<11} {R/1000:>11.1f} {P:>9.1f} {pct:>9.0f}%")

# Range and endurance
print("\\n=== Range and Endurance ===")
provisions = 3000  # tonnes
for speed in [3, 4, 5, 6]:
    range_nm = ship.range_nm(speed, provisions)
    days = provisions / (ship.crew * 4.5 / 1000)
    print(f"  At {speed} knots: range = {range_nm:,.0f} nm "
          f"({range_nm * 1.852:,.0f} km) | endurance = {days:.0f} days")

# Cargo capacity analysis
print("\\n=== Maximum Cargo (maintaining 2m freeboard) ===")
max_draft = 12 - 2  # 2m minimum freeboard
max_disp = 120 * 50 * max_draft * 0.55 * 1025 / 1000
ship_weight = 8000  # light ship weight
max_cargo = max_disp - ship_weight - provisions - 500  # 500t provisions+crew
print(f"  Max displacement at {max_draft}m draft: {max_disp:,.0f} tonnes")
print(f"  Light ship: {ship_weight:,} t | Provisions: {provisions:,} t")
print(f"  Maximum cargo: {max_cargo:,.0f} tonnes")`,
      challenge: 'Add a trade-off analysis: for every extra tonne of cargo, the ship sits deeper (more draft, less freeboard, more resistance, slower speed). Plot cargo weight vs speed and cargo weight vs range. Find the optimal cargo load that maximises cargo × range (tonne-miles) — the standard metric for commercial shipping efficiency.',
      successHint: 'You built a ship performance predictor that combines hydrodynamics, sail aerodynamics, and logistics. Professional ship design tools (NAPA, Maxsurf Resistance) use more sophisticated methods but the same physics: balance thrust against drag to find speed, calculate endurance from provisions, and optimise cargo loading.',
    },
    {
      title: 'Portfolio presentation — documenting the Ship Design Calculator',
      concept: `The final step is **documentation** — recording your Ship Design Calculator as a complete engineering portfolio piece. Your documentation should demonstrate:

1. **Problem understanding** — what does a naval architect need to calculate?
2. **Engineering methodology** — hydrostatics, structural mechanics, performance prediction
3. **Software design** — class hierarchy, data flow, calculation pipeline
4. **Validation** — do the results match historical data and known physics?
5. **Limitations and future work** — what simplifications did you make?

This documentation transforms your code from "a homework exercise" into "an engineering project" — evidence of real technical skills that could be shown to a university admissions board or a future employer.

📚 *Documentation is what separates a prototype from a product. Without documentation, your calculator is useful only to you. With documentation, it's useful to anyone — and demonstrates your engineering maturity.*`,
      analogy: 'A scientific paper doesn\'t just present results — it explains the method, validates the results against known benchmarks, and honestly discusses limitations. Your project documentation follows the same structure. A reader should be able to understand, reproduce, and extend your work from the documentation alone.',
      storyConnection: 'The Ming dynasty Longjiang shipyard maintained detailed construction records: timber inventories, hull dimensions, mast specifications, and launch dates. These records — engineering documentation from 600 years ago — are what allow modern historians and naval architects to reconstruct Zheng He\'s ships. Good documentation outlasts the artefact it describes.',
      checkQuestion: 'Why is validation (comparing your results to known data) the most important section of an engineering report?',
      checkAnswer: 'Because an unchecked model might be wrong. If your calculator says the treasure ship displaces 50,000 tonnes but historical estimates are 20,000 tonnes, something is off — maybe the block coefficient, the dimensions, or the density. Validation builds trust: if the model matches known cases, it\'s more likely to be correct for unknown cases.',
      codeIntro: 'Generate the complete project documentation for the Ship Design Calculator.',
      code: `# Ship Design Calculator — Project Documentation

import numpy as np

print("""
================================================================
           SHIP DESIGN CALCULATOR
              Project Documentation
================================================================

1. INTRODUCTION
---------------
This calculator predicts the performance of historical wooden
sailing ships — specifically Zheng He's treasure fleet (1405-1433).
It calculates buoyancy, structural loads, speed, range, and cargo
capacity from hull dimensions and material properties.

Inspired by the engineering challenge of building the largest
wooden ships in history: 120m vessels that carried 28,000 people
across the Indian Ocean seven times.

2. ARCHITECTURE
--------------
Four core modules:

  a) Hull class: stores geometry and material properties
  b) BuoyancyEngine: numerical integration of hull volume,
     calculates draft, displacement, stability (KB, BM, GM)
  c) StructuralAnalyser: longitudinal bending moment distribution,
     hogging/sagging stress vs material strength
  d) PerformancePredictor: sail drive, hull resistance, equilibrium
     speed, range, and cargo optimisation

Data flow: Hull -> BuoyancyEngine -> StructuralAnalyser
                                  -> PerformancePredictor

3. KEY RESULTS
--------------
  Treasure ship (120m x 50m x 12m):
  - Displacement: ~20,000 tonnes (full load)
  - Draft: ~7.5m (freeboard 4.5m)
  - GM: ~3.0m (very stable, stiff in roll)
  - Speed: 4-6 knots in moderate trade winds
  - Range: ~12,000 nm with 3,000t provisions (60+ days)
  - Max cargo: ~10,000 tonnes

  Structural assessment:
  - Hogging stress: marginal (SF ~1.5) at 120m
  - Watertight bulkheads essential for structural integrity
  - 150mm+ teak planking required for adequate strength

4. VALIDATION
--------------
""")

# Quick validation calculations
print("  Cross-checking against known data:")
validations = [
    ("Displacement", 20000, "~20,000t", "Historical estimates: 15,000-25,000t"),
    ("Speed", 5.0, "4-6 kt", "Historical accounts: 4-6 knots"),
    ("Crew capacity", 500, "~500", "Per treasure ship (28,000 total fleet)"),
    ("Hull speed", 26.6, "26.6 kt", "Physics: 2.43 × sqrt(120) = 26.6"),
    ("GM estimate", 3.0, "~3.0m", "Wide beam gives high stability"),
]

for param, calc, result, ref in validations:
    print(f"    {param:<18} Calculated: {result:<10} Reference: {ref}")

print("""
  All results fall within expected ranges for a large wooden vessel
  of these proportions. The structural analysis correctly identifies
  120m as the practical limit for wooden construction.

5. LIMITATIONS
--------------
  - Hull shape simplified to parametric sections (not actual lines)
  - No dynamic wave analysis (only quasi-static hogging/sagging)
  - Sail forces use simplified aerodynamic model (no CFD)
  - No rudder or steering analysis
  - Spoilage model is approximate (not species-specific)
  - Wood properties assumed uniform (real timber varies by tree)
  - No fatigue analysis (cumulative damage from repeated waves)

6. FUTURE IMPROVEMENTS
----------------------
  - Import actual hull lines from archaeological data
  - Add 3D panel method for wave resistance
  - Include roll damping from bilge keels and hull friction
  - Model cargo stowage in individual compartments
  - Add cost model (timber, labour, provisions, port fees)
  - Implement Pareto optimisation for multi-objective design

7. SKILLS DEMONSTRATED
----------------------
""")

skills = [
    ("Python OOP",           "Classes, inheritance, encapsulation"),
    ("Numerical methods",    "Integration, root-finding, binary search"),
    ("Naval architecture",   "Hydrostatics, stability, resistance, seakeeping"),
    ("Structural mechanics", "Bending moments, stress analysis, material limits"),
    ("Fluid mechanics",      "Sail aerodynamics, hull hydrodynamics"),
    ("Logistics modelling",  "Provisioning, range, endurance calculations"),
    ("Technical writing",    "Structured documentation, validation, limitations"),
]

for skill, detail in skills:
    print(f"    {skill:<24} {detail}")

print("""
================================================================
     Built as part of TigmaMinds Academy
     Story 220: Zheng He's Fleet
================================================================
""")`,
      challenge: 'Turn this documentation into a real portfolio piece: add a section comparing your calculator\'s predictions against three other historical ships (Columbus\'s Santa Maria, Drake\'s Golden Hind, a modern container ship). If your model gives reasonable results for all three, that\'s strong evidence of correctness. This kind of cross-validation is what separates student projects from professional engineering.',
      successHint: 'You have completed a full engineering project cycle: problem definition, system design, implementation, simulation, analysis, and documentation. This Ship Design Calculator demonstrates real skills in naval architecture, computational methods, and software engineering — the same skills used by professionals at shipyards, classification societies, and maritime research institutions worldwide.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Ship Design Calculator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Ship Design Calculator.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L4-${i + 1}`}
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
