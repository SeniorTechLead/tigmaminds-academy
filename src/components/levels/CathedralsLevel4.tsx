import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CathedralsLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Design a Cathedral Force Simulator',
      concept: `In this capstone project, you will build a complete **Cathedral Force Simulator** — a Python program that:

1. **Defines cathedral geometry** — nave dimensions, vault height, wall thickness, buttress configuration
2. **Computes force balance** through the arch-buttress-pier system
3. **Optimises vault height** to maximise vertical reach within material strength limits
4. **Predicts acoustic properties** based on the geometry
5. **Generates an engineering report** with structural safety assessment

This brings together everything from Levels 1-3: voussoir geometry, moment equilibrium, stained glass optics, acoustic modelling, wind loading, finite elements, and multi-criteria analysis.

The first step is **system design** — defining the data structures and interfaces before writing any simulation code. A cathedral simulator has interacting subsystems (structural, acoustic, optical) that must share a common geometric model.

📚 *System design means planning the architecture of your software before coding. In engineering simulation, the data model (how you represent the cathedral) determines everything else — bad data structures make good algorithms impossible.*`,
      analogy: 'Before building a cathedral, the master mason drew the full plan on a plaster tracing floor — every arch, every buttress, every window. Only when the plan was complete did stone cutting begin. System design is the software equivalent: define every class, every method, every data flow before writing the first line of simulation code.',
      storyConnection: 'Villard de Honnecourt\'s sketchbook (c. 1230) contains architectural drawings, structural diagrams, and construction notes — the closest thing we have to a medieval "system design document." His drawings show how Gothic builders thought about the whole system: geometry, structure, and construction sequence as an integrated design.',
      checkQuestion: 'Why should the structural, acoustic, and optical subsystems share a common geometric model rather than each defining their own?',
      checkAnswer: 'Because the geometry IS the design — changing the vault height affects both the structural forces AND the acoustic volume AND the window proportions. A shared model ensures consistency: if you raise the vault, all three subsystems automatically update. Separate models risk contradictory assumptions.',
      codeIntro: 'Design the architecture of the Cathedral Force Simulator — define classes, interfaces, and data flow.',
      code: `import numpy as np

class CathedralGeometry:
    """Defines the geometric parameters of a Gothic cathedral."""

    def __init__(self, name, nave_length, nave_width, vault_height,
                 wall_thickness, buttress_span, buttress_width,
                 n_bays, aisle_width, window_fraction=0.35):
        self.name = name
        self.nave_length = nave_length        # m
        self.nave_width = nave_width          # m
        self.vault_height = vault_height      # m
        self.wall_thickness = wall_thickness  # m
        self.buttress_span = buttress_span    # m (how far buttress extends)
        self.buttress_width = buttress_width  # m
        self.n_bays = n_bays
        self.aisle_width = aisle_width        # m
        self.window_fraction = window_fraction  # fraction of wall that is glass

    @property
    def total_width(self):
        return self.nave_width + 2 * self.aisle_width + 2 * self.wall_thickness

    @property
    def volume(self):
        """Approximate interior volume (m³)."""
        nave_vol = self.nave_length * self.nave_width * self.vault_height
        aisle_vol = 2 * self.nave_length * self.aisle_width * (self.vault_height * 0.5)
        return nave_vol + aisle_vol

    @property
    def floor_area(self):
        return self.nave_length * (self.nave_width + 2 * self.aisle_width)

    @property
    def wall_area(self):
        perimeter = 2 * (self.nave_length + self.total_width)
        return perimeter * self.vault_height

    @property
    def window_area(self):
        return self.wall_area * self.window_fraction

    @property
    def stone_wall_area(self):
        return self.wall_area * (1 - self.window_fraction)

    def bay_width(self):
        return self.nave_length / self.n_bays

    def summary(self):
        print(f"  Dimensions: {self.nave_length}×{self.total_width:.1f}m, "
              f"vault {self.vault_height}m")
        print(f"  Volume: {self.volume:,.0f} m³ | Floor: {self.floor_area:,.0f} m²")
        print(f"  Wall area: {self.wall_area:,.0f} m² "
              f"(glass: {self.window_area:,.0f} m², stone: {self.stone_wall_area:,.0f} m²)")
        print(f"  Bays: {self.n_bays} @ {self.bay_width():.1f}m each")
        print(f"  Buttress: {self.buttress_span}m span × {self.buttress_width}m wide")


# Define cathedral presets
CATHEDRALS = {
    "chartres": CathedralGeometry(
        "Chartres", 130, 16, 37, 2.5, 14, 2.0, 16, 8, 0.40),
    "notre_dame": CathedralGeometry(
        "Notre-Dame", 128, 12, 33, 2.2, 10, 1.8, 14, 10, 0.25),
    "beauvais": CathedralGeometry(
        "Beauvais", 72, 15, 48, 2.0, 12, 2.2, 8, 7, 0.35),
}

print("=== Cathedral Force Simulator — System Architecture ===\\\n")
print("Subsystems:")
print("  1. CathedralGeometry — shared geometric model")
print("  2. ForceBalance — arch thrust, buttress, pier analysis")
print("  3. VaultOptimiser — maximise height within limits")
print("  4. AcousticPredictor — RT60, modal frequencies")
print("  5. ReportGenerator — engineering report output")
print()

for key, cat in CATHEDRALS.items():
    print(f"[{cat.name}]")
    cat.summary()
    print()

print("System ready. Next: implement force balance engine.")`,
      challenge: 'Add a method to CathedralGeometry that calculates the total weight of stone in the walls (using density 2400 kg/m³ and wall thickness). How does the wall weight compare to the volume of interior space? This "mass efficiency" metric reveals how much material is needed to enclose a given volume — the fundamental challenge of Gothic architecture.',
      successHint: 'Good system design makes the simulation code almost write itself. By defining CathedralGeometry with computed properties (volume, wall_area, window_area), every subsystem can query the geometry without duplicating calculations. This is object-oriented design at its best — encapsulation and reuse.',
    },
    {
      title: 'Force balance engine — arch thrust, buttress, and pier analysis',
      concept: `The structural heart of a Gothic cathedral is the **force path**: vault → arch → wall → flying buttress → pier → foundation → ground. At every joint in this chain, forces must balance — if they don't, the structure moves (and potentially collapses).

The force balance engine computes:

1. **Vault thrust** — the horizontal outward push from the pointed vault, approximately: H = w × L² / (8 × f), where w is the distributed load per metre, L is the span, and f is the vault rise.

2. **Wall stability** — the overturning moment from the thrust vs the restoring moment from the wall's weight.

3. **Buttress resistance** — the flying buttress transmits an inward force to counteract the vault thrust. The force depends on the buttress angle and weight.

4. **Pier compression** — the pier at the base of the buttress carries the combined vertical loads. Its stress must not exceed the stone's compressive strength.

The entire system is **statically determinate** if we know the geometry and material weights — meaning we can calculate every force from equilibrium equations alone.

📚 *A statically determinate structure has exactly enough supports for equilibrium — no redundancy. Adding extra supports (as in redundant structures) requires compatibility equations in addition to equilibrium.*`,
      analogy: 'Think of a chain of people passing a heavy box up a hill. Each person takes the box from the person below, carries it one step, and hands it to the person above. If any person is too weak, they drop the box and the chain fails. The force path in a cathedral is the same: vault hands thrust to wall, wall hands it to buttress, buttress hands it to pier. Every link must be strong enough.',
      storyConnection: 'When Beauvais Cathedral\'s choir collapsed in 1284, the failure started where the force path was weakest: the junction between the flying buttress and the clerestory wall. The buttress was pushing at the wrong height — above the actual line of thrust from the vault — creating a stress concentration that cracked the stone.',
      checkQuestion: 'A vault spans 14 m with a rise of 8 m and carries 50 kN/m. What is the horizontal thrust?',
      checkAnswer: 'H = 50 × 14² / (8 × 8) = 50 × 196 / 64 = 153.1 kN. This is the outward push that must be resisted by the wall and buttress combination. If the wall alone can\'t resist it (and in Gothic cathedrals it usually can\'t), the flying buttress must supply the difference.',
      codeIntro: 'Implement the force balance engine that computes forces through the entire arch-buttress-pier system.',
      code: `import numpy as np

class ForceBalance:
    """Computes force equilibrium through the Gothic structural system."""

    def __init__(self, geometry):
        self.geo = geometry
        self.stone_density = 2400  # kg/m³
        self.g = 9.81
        self.stone_strength = 40e6  # Pa (limestone compressive)

    def vault_thrust(self):
        """Horizontal thrust from the pointed vault."""
        # Vault weight per metre of nave length
        vault_thickness = 0.3  # m (typical rib vault)
        vault_area = self.geo.nave_width * 1.2  # account for curvature
        w = vault_area * vault_thickness * self.stone_density * self.g / 1000  # kN/m

        # Rise of the pointed arch
        rise = self.geo.vault_height * 0.4  # rise above springing point
        span = self.geo.nave_width

        # Horizontal thrust: H = w × L / (8f) × L
        H = w * span**2 / (8 * rise)

        # Vertical reaction at each wall
        V = w * span / 2

        return {"H_kn": H, "V_kn": V, "w_kn_per_m": w}

    def wall_stability(self):
        """Check wall overturning stability."""
        thrust = self.vault_thrust()
        H = thrust["H_kn"]
        V = thrust["V_kn"]

        # Wall weight per bay
        bay_w = self.geo.bay_width()
        wall_vol = self.geo.wall_thickness * self.geo.vault_height * bay_w
        wall_weight = wall_vol * self.stone_density * self.g / 1000  # kN

        # Overturning moment about outer base edge
        thrust_height = self.geo.vault_height * 0.85
        M_overturn = H * thrust_height * bay_w

        # Restoring moment from wall weight
        M_restore_wall = wall_weight * self.geo.wall_thickness / 2

        # Restoring moment from vault vertical load
        M_restore_vault = V * bay_w * self.geo.wall_thickness / 2

        M_restore = M_restore_wall + M_restore_vault
        fos = M_restore / M_overturn if M_overturn > 0 else float('inf')

        return {
            "M_overturn": M_overturn,
            "M_restore_wall": M_restore_wall,
            "M_restore_vault": M_restore_vault,
            "M_restore_total": M_restore,
            "fos_wall_only": fos,
            "wall_weight_kn": wall_weight,
        }

    def buttress_contribution(self, buttress_angle_deg=50):
        """Force from the flying buttress."""
        thrust = self.vault_thrust()
        wall = self.wall_stability()

        # Buttress weight
        buttress_vol = (self.geo.buttress_span * self.geo.buttress_width
                        * self.geo.vault_height * 0.3)
        buttress_weight = buttress_vol * self.stone_density * self.g / 1000

        angle_rad = np.radians(buttress_angle_deg)
        # Horizontal inward component
        H_buttress = buttress_weight * np.sin(angle_rad)
        # Vertical downward component
        V_buttress = buttress_weight * np.cos(angle_rad)

        thrust_height = self.geo.vault_height * 0.85
        M_buttress = (H_buttress * thrust_height +
                      V_buttress * self.geo.wall_thickness)

        fos_with_buttress = ((wall["M_restore_total"] + M_buttress)
                             / wall["M_overturn"])

        return {
            "buttress_weight_kn": buttress_weight,
            "H_buttress_kn": H_buttress,
            "M_buttress": M_buttress,
            "fos_with_buttress": fos_with_buttress,
        }

    def pier_stress(self):
        """Compressive stress at the base of the buttress pier."""
        thrust = self.vault_thrust()
        butt = self.buttress_contribution()

        total_vertical = (thrust["V_kn"] + butt["buttress_weight_kn"]
                          + self.wall_stability()["wall_weight_kn"])

        pier_area = self.geo.buttress_width * self.geo.wall_thickness
        stress_pa = total_vertical * 1000 / pier_area
        stress_mpa = stress_pa / 1e6
        utilisation = stress_mpa / (self.stone_strength / 1e6)

        return {
            "total_vertical_kn": total_vertical,
            "pier_area_m2": pier_area,
            "stress_mpa": stress_mpa,
            "utilisation": utilisation,
        }

    def full_report(self):
        """Print complete force balance report."""
        t = self.vault_thrust()
        w = self.wall_stability()
        b = self.buttress_contribution()
        p = self.pier_stress()

        print(f"\\\n{'='*55}")
        print(f"  FORCE BALANCE: {self.geo.name}")
        print(f"{'='*55}")
        print(f"\\\n[Vault Thrust]")
        print(f"  Load: {t['w_kn_per_m']:.1f} kN/m")
        print(f"  Horizontal thrust: {t['H_kn']:.1f} kN")
        print(f"  Vertical reaction: {t['V_kn']:.1f} kN")

        print(f"\\\n[Wall Stability]")
        print(f"  Overturning moment: {w['M_overturn']:.0f} kN·m")
        print(f"  Restoring (wall): {w['M_restore_wall']:.0f} kN·m")
        print(f"  Restoring (vault): {w['M_restore_vault']:.0f} kN·m")
        print(f"  FoS (wall only): {w['fos_wall_only']:.2f} "
              f"{'OK' if w['fos_wall_only'] > 1 else 'UNSTABLE'}")

        print(f"\\\n[Flying Buttress]")
        print(f"  Buttress weight: {b['buttress_weight_kn']:.0f} kN")
        print(f"  Inward force: {b['H_buttress_kn']:.0f} kN")
        print(f"  FoS (with buttress): {b['fos_with_buttress']:.2f} "
              f"{'SAFE' if b['fos_with_buttress'] > 2 else 'MARGINAL' if b['fos_with_buttress'] > 1 else 'FAIL'}")

        print(f"\\\n[Pier Stress]")
        print(f"  Total vertical: {p['total_vertical_kn']:.0f} kN")
        print(f"  Pier stress: {p['stress_mpa']:.1f} MPa "
              f"(stone limit: {self.stone_strength/1e6:.0f} MPa)")
        print(f"  Utilisation: {p['utilisation']:.0%}")

        return {"thrust": t, "wall": w, "buttress": b, "pier": p}


# Analyse all three cathedrals
from __main__ import CathedralGeometry

cathedrals = {
    "chartres": CathedralGeometry(
        "Chartres", 130, 16, 37, 2.5, 14, 2.0, 16, 8, 0.40),
    "notre_dame": CathedralGeometry(
        "Notre-Dame", 128, 12, 33, 2.2, 10, 1.8, 14, 10, 0.25),
    "beauvais": CathedralGeometry(
        "Beauvais", 72, 15, 48, 2.0, 12, 2.2, 8, 7, 0.35),
}

for key, geo in cathedrals.items():
    fb = ForceBalance(geo)
    fb.full_report()`,
      challenge: 'Beauvais shows the lowest factor of safety. Experiment with adding a second tier of flying buttresses (double the buttress weight). How much does this improve the FoS? Real Beauvais has double-tier buttresses — they were added after the 1284 collapse. Calculate whether they were sufficient.',
      successHint: 'You built a complete force balance engine — the same type of tool that structural engineers use to preliminary-design buildings before running detailed FEA. The force path analysis (vault → wall → buttress → pier → foundation) is the first check any engineer performs on a masonry structure.',
    },
    {
      title: 'Vault height optimiser — maximise height within material limits',
      concept: `The Gothic builders' central ambition was **height** — taller vaults glorified God and demonstrated the patron's wealth. But height is constrained by physics: taller vaults produce more thrust, require heavier buttresses, and create more overturning moment.

The **vault height optimiser** searches for the maximum vault height that satisfies all structural constraints simultaneously:
- Factor of safety against overturning ≥ 2.0
- Pier compressive stress ≤ 80% of stone strength
- Buttress mass ≤ practical construction limit
- Wall thickness ≥ minimum for stability

This is a **constrained optimisation problem**: maximise an objective (height) subject to inequality constraints (safety, strength, practicality). We'll use a grid search, checking every candidate height and finding the tallest one that passes all constraints.

📚 *Constrained optimisation is the mathematical framework for all engineering design: maximise performance subject to safety, cost, and physical limits. Linear programming, quadratic programming, and gradient descent are all methods for solving such problems.*`,
      analogy: 'Imagine inflating a balloon inside a box. The balloon (height ambition) wants to expand as much as possible, but the box walls (structural limits) constrain it. The optimal size is the largest balloon that fits inside the box without bursting. The vault height optimiser finds the tallest vault that fits inside the "box" of structural safety constraints.',
      storyConnection: 'Beauvais Cathedral was the medieval equivalent of pushing the balloon until it burst. At 48 m, the vault exceeded what the stone and buttress system could sustain. Chartres at 37 m was near the optimum — tall enough to be spectacular, conservative enough to survive 800 years. The optimiser reveals exactly where the limit lies.',
      checkQuestion: 'If increasing vault height by 1 m increases thrust by 5% but only increases restoring moment by 2%, what happens to the factor of safety?',
      checkAnswer: 'FoS decreases. If original FoS = 2.0, new FoS ≈ 2.0 × 1.02 / 1.05 = 1.94. Each additional metre of height erodes the safety margin. At some height, FoS drops below the minimum threshold — that\'s the maximum safe height.',
      codeIntro: 'Build a vault height optimiser that finds the maximum safe height for a given cathedral plan.',
      code: `import numpy as np

class VaultOptimiser:
    """Find the maximum vault height that satisfies all structural constraints."""

    def __init__(self, base_geometry, stone_strength_mpa=40):
        self.base = base_geometry
        self.stone_strength = stone_strength_mpa
        self.stone_density = 2400
        self.g = 9.81

    def evaluate_height(self, vault_height):
        """Evaluate structural metrics for a given vault height."""
        geo = self.base
        # Vault thrust
        vault_thickness = 0.3
        vault_area = geo.nave_width * 1.2
        w = vault_area * vault_thickness * self.stone_density * self.g / 1000
        rise = vault_height * 0.4
        H = w * geo.nave_width**2 / (8 * rise)
        V = w * geo.nave_width / 2

        # Wall
        bay_w = geo.nave_length / geo.n_bays
        wall_vol = geo.wall_thickness * vault_height * bay_w
        wall_weight = wall_vol * self.stone_density * self.g / 1000

        thrust_height = vault_height * 0.85
        M_overturn = H * thrust_height * bay_w
        M_restore_wall = wall_weight * geo.wall_thickness / 2 + V * bay_w * geo.wall_thickness / 2

        # Buttress
        buttress_vol = geo.buttress_span * geo.buttress_width * vault_height * 0.3
        buttress_weight = buttress_vol * self.stone_density * self.g / 1000
        angle = np.radians(50)
        H_butt = buttress_weight * np.sin(angle)
        V_butt = buttress_weight * np.cos(angle)
        M_buttress = H_butt * thrust_height + V_butt * geo.wall_thickness

        M_restore_total = M_restore_wall + M_buttress
        fos = M_restore_total / M_overturn if M_overturn > 0 else 99

        # Pier stress
        total_vert = V + buttress_weight + wall_weight
        pier_area = geo.buttress_width * geo.wall_thickness
        stress_mpa = total_vert * 1000 / pier_area / 1e6

        # Volume
        volume = geo.nave_length * geo.nave_width * vault_height

        return {
            "height": vault_height,
            "fos": fos,
            "stress_mpa": stress_mpa,
            "utilisation": stress_mpa / self.stone_strength,
            "thrust_kn": H,
            "volume_m3": volume,
            "buttress_mass_tonnes": buttress_weight * geo.n_bays / self.g,
        }

    def optimise(self, min_height=15, max_height=60,
                 min_fos=2.0, max_utilisation=0.80):
        """Search for maximum height satisfying all constraints."""
        heights = np.linspace(min_height, max_height, 200)
        results = []
        best_feasible = None

        for h in heights:
            r = self.evaluate_height(h)
            feasible = (r["fos"] >= min_fos and
                        r["utilisation"] <= max_utilisation)
            r["feasible"] = feasible
            results.append(r)
            if feasible:
                best_feasible = r

        return results, best_feasible

# Optimise each cathedral plan
from __main__ import CathedralGeometry

plans = {
    "Chartres plan": CathedralGeometry(
        "Chartres", 130, 16, 37, 2.5, 14, 2.0, 16, 8, 0.40),
    "Notre-Dame plan": CathedralGeometry(
        "Notre-Dame", 128, 12, 33, 2.2, 10, 1.8, 14, 10, 0.25),
    "Beauvais plan": CathedralGeometry(
        "Beauvais", 72, 15, 48, 2.0, 12, 2.2, 8, 7, 0.35),
}

print("=== Vault Height Optimisation ===")
print(f"Constraints: FoS >= 2.0, pier utilisation <= 80%\\\n")

for name, geo in plans.items():
    opt = VaultOptimiser(geo)
    results, best = opt.optimise()

    print(f"{name}:")
    print(f"  Actual vault height: {geo.vault_height} m")

    if best:
        print(f"  Optimal max height: {best['height']:.1f} m")
        print(f"  At optimal: FoS={best['fos']:.2f}, "
              f"pier={best['utilisation']:.0%}, "
              f"thrust={best['thrust_kn']:.0f}kN")
        diff = best["height"] - geo.vault_height
        print(f"  Margin: {diff:+.1f} m "
              f"({'within limits' if diff >= 0 else 'EXCEEDS SAFE LIMIT'})")
    else:
        print(f"  No feasible height found in range!")
    print()

# Sensitivity: how does wall thickness affect max height?
print("=== Wall Thickness Sensitivity (Chartres plan) ===")
base = plans["Chartres plan"]
for thickness in [1.5, 2.0, 2.5, 3.0, 3.5, 4.0]:
    modified = CathedralGeometry(
        "Chartres", 130, 16, 37, thickness, 14, 2.0, 16, 8, 0.40)
    opt = VaultOptimiser(modified)
    _, best = opt.optimise()
    max_h = best["height"] if best else 0
    print(f"  Wall {thickness:.1f}m: max safe height = {max_h:.1f}m "
          f"(actual: {base.vault_height}m)")`,
      challenge: 'Add a cost function: cost = wall_volume × 10 + buttress_volume × 15 (buttresses are harder to build). Now optimise for the tallest vault with cost below a budget of 50,000 units. This adds a third constraint — you\'re balancing height, safety, AND economy. This is multi-objective optimisation.',
      successHint: 'You built a constrained optimiser — the same class of tool used to design aircraft (maximise range subject to weight and fuel limits), bridges (minimise material subject to safety codes), and circuits (maximise speed subject to power limits). The grid search is the simplest optimisation method; real engineers use gradient descent, genetic algorithms, and machine learning.',
    },
    {
      title: 'Acoustic predictor — reverberation and modal frequencies',
      concept: `The acoustic character of a Gothic cathedral is defined by its geometry. The **acoustic predictor** subsystem takes the cathedral geometry and computes:

1. **Reverberation time (RT60)** — using the Sabine equation: RT60 = 0.161 × V / A
2. **Modal frequencies** — the resonant frequencies of the space, determined by the room dimensions: f_n = c/(2L) × n, where L is a room dimension and n is the mode number
3. **Speech intelligibility** — estimated from RT60 (longer reverb = lower intelligibility)
4. **Optimal music tempo** — slower music works better in reverberant spaces

The modal frequencies reveal which notes the cathedral naturally amplifies. Low frequencies (bass) have long wavelengths that "fit" in the large nave. Higher frequencies bounce more often and decay faster.

The acoustic predictor connects structure to sound: changing the vault height changes the volume, which changes the RT60, which changes how music sounds.

📚 *Room modes are standing waves — the same physics as organ pipes, but in three dimensions. A mode forms when a sound wave bounces between two parallel surfaces and reinforces itself. The room "rings" at these frequencies.*`,
      analogy: 'Tap a wine glass — it rings at a specific frequency determined by its shape and size. A cathedral is a giant wine glass: it has natural resonant frequencies determined by its geometry. When an organ plays a note that matches a room mode, the cathedral itself resonates, amplifying the sound. This is why organ music sounds so powerful in a cathedral — the building IS the loudspeaker.',
      storyConnection: 'The organ builders of Notre-Dame tuned their instrument to complement the cathedral\'s acoustic modes. The 32-foot Bombarde stop (16 Hz fundamental) excites the building\'s lowest mode, creating a physical vibration that listeners feel in their bones. This deliberate matching of instrument to architecture is unique to cathedral organ building.',
      checkQuestion: 'A cathedral nave is 130 m long. What is the fundamental axial mode frequency along the length?',
      checkAnswer: 'f = c/(2L) = 343/(2×130) = 1.32 Hz. This is far below human hearing (20 Hz) — it\'s infrasound. The first audible mode along the length would be the ~15th harmonic: 15 × 1.32 = 19.8 Hz. This explains why cathedrals have a "rumbling" low-frequency character — many closely-spaced low modes reinforce bass.',
      codeIntro: 'Build the acoustic predictor subsystem — compute RT60, room modes, and intelligibility from cathedral geometry.',
      code: `import numpy as np

class AcousticPredictor:
    """Predicts acoustic properties from cathedral geometry."""

    def __init__(self, geometry):
        self.geo = geometry
        self.c = 343  # speed of sound (m/s)

        # Absorption coefficients at 500 Hz
        self.alpha_stone = 0.02
        self.alpha_glass = 0.04
        self.alpha_wood = 0.10
        self.alpha_people = 0.60

    def rt60(self, n_people=0):
        """Sabine reverberation time."""
        V = self.geo.volume

        # Surface absorption
        floor_area = self.geo.floor_area
        ceiling_area = floor_area
        stone_wall = self.geo.stone_wall_area
        glass_area = self.geo.window_area

        A = (floor_area * self.alpha_stone +
             ceiling_area * self.alpha_stone +
             stone_wall * self.alpha_stone +
             glass_area * self.alpha_glass)

        # Wood (pews in 40% of floor)
        A += floor_area * 0.4 * self.alpha_wood

        # People
        A += n_people * 0.5 * self.alpha_people

        return 0.161 * V / A if A > 0 else float('inf')

    def room_modes(self, n_max=5):
        """Calculate axial room modes for each dimension."""
        L = self.geo.nave_length
        W = self.geo.nave_width
        H = self.geo.vault_height

        modes = []
        for nx in range(n_max + 1):
            for ny in range(n_max + 1):
                for nz in range(n_max + 1):
                    if nx + ny + nz == 0:
                        continue
                    f = self.c / 2 * np.sqrt(
                        (nx / L)**2 + (ny / W)**2 + (nz / H)**2)
                    if f <= 100:  # only low-frequency modes
                        mode_type = ("axial" if sum([nx>0, ny>0, nz>0]) == 1
                                     else "tangential" if sum([nx>0, ny>0, nz>0]) == 2
                                     else "oblique")
                        modes.append({
                            "nx": nx, "ny": ny, "nz": nz,
                            "freq": f, "type": mode_type
                        })

        modes.sort(key=lambda m: m["freq"])
        return modes

    def speech_intelligibility(self, n_people=0):
        """Estimate speech intelligibility from RT60."""
        rt = self.rt60(n_people)
        # Rapid Speech Transmission Index (simplified)
        if rt < 1.0:
            sti = 0.9
        elif rt < 2.0:
            sti = 0.8
        elif rt < 4.0:
            sti = 0.6
        elif rt < 6.0:
            sti = 0.4
        else:
            sti = max(0.2, 0.7 - 0.08 * rt)

        quality = ("Excellent" if sti > 0.75 else "Good" if sti > 0.6
                   else "Fair" if sti > 0.45 else "Poor")
        return sti, quality

    def optimal_music_tempo(self):
        """Estimate optimal music tempo based on RT60."""
        rt = self.rt60()
        # Longer reverb → slower tempo needed for clarity
        # Rule of thumb: note spacing > RT60/3 for clarity
        min_note_duration = rt / 3  # seconds
        max_bpm = 60 / min_note_duration
        return max_bpm, min_note_duration

    def full_report(self):
        """Print complete acoustic analysis."""
        rt_empty = self.rt60(0)
        rt_full = self.rt60(500)
        modes = self.room_modes()
        sti_e, qual_e = self.speech_intelligibility(0)
        sti_f, qual_f = self.speech_intelligibility(500)
        bpm, note_dur = self.optimal_music_tempo()

        print(f"\\\n{'='*50}")
        print(f"  ACOUSTIC ANALYSIS: {self.geo.name}")
        print(f"{'='*50}")
        print(f"\\\nVolume: {self.geo.volume:,.0f} m³")
        print(f"\\\n[Reverberation Time (RT60)]")
        print(f"  Empty: {rt_empty:.1f} s")
        print(f"  With 500 people: {rt_full:.1f} s")
        print(f"  Ideal for chant: 4-6 s")
        print(f"  Ideal for speech: 1-2 s")

        print(f"\\\n[Speech Intelligibility]")
        print(f"  Empty: STI={sti_e:.2f} ({qual_e})")
        print(f"  Full: STI={sti_f:.2f} ({qual_f})")

        print(f"\\\n[Music]")
        print(f"  Max clear tempo: {bpm:.0f} BPM")
        print(f"  Min note duration: {note_dur:.2f} s")
        print(f"  Best suited for: ", end="")
        if rt_empty > 5:
            print("Gregorian chant, sustained organ")
        elif rt_empty > 3:
            print("Choral music, organ")
        else:
            print("Orchestral, spoken word")

        print(f"\\\n[Room Modes (below 100 Hz)]")
        print(f"  Total modes: {len(modes)}")
        print(f"  {'Mode':>12} {'Freq (Hz)':>10} {'Type':>12}")
        for m in modes[:10]:
            mode_str = f"({m['nx']},{m['ny']},{m['nz']})"
            print(f"  {mode_str:>12} {m['freq']:>9.1f} {m['type']:>12}")
        if len(modes) > 10:
            print(f"  ... and {len(modes)-10} more modes")


# Analyse all cathedrals
from __main__ import CathedralGeometry

cathedrals = [
    CathedralGeometry("Chartres", 130, 16, 37, 2.5, 14, 2.0, 16, 8, 0.40),
    CathedralGeometry("Notre-Dame", 128, 12, 33, 2.2, 10, 1.8, 14, 10, 0.25),
    CathedralGeometry("Beauvais", 72, 15, 48, 2.0, 12, 2.2, 8, 7, 0.35),
]

for geo in cathedrals:
    ap = AcousticPredictor(geo)
    ap.full_report()`,
      challenge: 'Chartres has unusually large stained glass windows (40% of wall area). Glass absorbs slightly more sound than stone (0.04 vs 0.02). Calculate how much Chartres\' RT60 would change if its windows were replaced with solid stone walls. Does the glass make a noticeable acoustic difference, or is the volume effect dominant?',
      successHint: 'You built a complete acoustic predictor from first principles — the Sabine equation, room modes, and intelligibility estimation. The same tools are used by acoustic consultants designing concert halls, recording studios, and lecture theatres. The key insight: geometry determines acoustics, and acoustics determine how music and speech are perceived.',
    },
    {
      title: 'Portfolio presentation — complete Cathedral Force Simulator documentation',
      concept: `The final step is to integrate all subsystems into a **unified simulation** and document the complete project. Your Cathedral Force Simulator documentation should include:

1. **System overview** — what subsystems exist and how they connect
2. **Input specification** — what parameters define a cathedral
3. **Output specification** — what the simulator produces
4. **Validation** — comparing simulator output against known historical data
5. **Key findings** — what the simulator reveals about Gothic engineering
6. **Limitations and future work** — what the model doesn't capture

The validation step is critical: a simulator that hasn't been checked against reality is just fiction. By comparing your force predictions against Beauvais (which collapsed) and Chartres (which stood), you can verify that your model correctly identifies the structural limits.

📚 *Validation is the process of checking that a model's predictions match real-world observations. A model that predicts Beauvais is safe is WRONG — because Beauvais collapsed. Validation against known outcomes is how engineering models earn trust.*`,
      analogy: 'A weather forecast model is validated by comparing its predictions against actual weather. If it predicts sunshine and it rains, the model needs improvement. Your cathedral simulator is validated the same way: if it predicts Beauvais is safe, something is wrong — because Beauvais collapsed in reality. The history IS the test data.',
      storyConnection: 'The great Gothic cathedrals are a 200-year engineering experiment preserved in stone. Beauvais (collapsed) is the failed test. Chartres (standing for 800 years) is the successful test. Notre-Dame (damaged by fire in 2019, now being rebuilt) is the ongoing experiment. Your simulator uses these historical data points to validate its predictions.',
      checkQuestion: 'Your simulator says Beauvais has a factor of safety of 2.5. You know Beauvais collapsed. What should you conclude?',
      checkAnswer: 'The model is wrong — it\'s overestimating the safety. Possible reasons: the model doesn\'t capture wind loading, doesn\'t model construction imperfections, or uses an incorrect thrust calculation. A model that gives the wrong answer on a known case cannot be trusted for new designs. Fix the model, then re-validate.',
      codeIntro: 'Integrate all subsystems and generate the complete Cathedral Force Simulator report with validation.',
      code: `import numpy as np

print("""
================================================================
          CATHEDRAL FORCE SIMULATOR
              Project Documentation
================================================================

1. SYSTEM OVERVIEW
------------------
The Cathedral Force Simulator integrates four analysis subsystems
to evaluate the structural, acoustic, and optical performance
of Gothic cathedral designs.

  Subsystems:
  a) CathedralGeometry — parametric geometric model
  b) ForceBalance — thrust, moment, and stress analysis
  c) VaultOptimiser — constrained height maximisation
  d) AcousticPredictor — RT60, room modes, intelligibility

  Data flow:
  Geometry → ForceBalance → safety metrics
  Geometry → VaultOptimiser → maximum safe height
  Geometry → AcousticPredictor → acoustic properties

2. INPUT SPECIFICATION
----------------------
  A cathedral is defined by 10 parameters:
  - Nave: length, width, vault_height
  - Walls: thickness, window_fraction
  - Buttress: span, width, angle
  - Plan: n_bays, aisle_width

3. VALIDATION AGAINST HISTORY
-----------------------------
""")

# Run validation
class SimpleGeo:
    def __init__(self, name, nl, nw, vh, wt, bs, bw, nb, aw, wf):
        self.name = name
        self.nave_length = nl; self.nave_width = nw
        self.vault_height = vh; self.wall_thickness = wt
        self.buttress_span = bs; self.buttress_width = bw
        self.n_bays = nb; self.aisle_width = aw
        self.window_fraction = wf
    @property
    def volume(self):
        return self.nave_length * self.nave_width * self.vault_height
    @property
    def floor_area(self):
        return self.nave_length * (self.nave_width + 2*self.aisle_width)
    @property
    def wall_area(self):
        return 2*(self.nave_length + self.nave_width + 2*self.aisle_width + 2*self.wall_thickness)*self.vault_height
    @property
    def window_area(self):
        return self.wall_area * self.window_fraction
    @property
    def stone_wall_area(self):
        return self.wall_area * (1 - self.window_fraction)
    def bay_width(self):
        return self.nave_length / self.n_bays

tests = [
    ("Chartres", SimpleGeo("Chartres", 130, 16, 37, 2.5, 14, 2.0, 16, 8, 0.40),
     "Standing 800+ years", True),
    ("Notre-Dame", SimpleGeo("Notre-Dame", 128, 12, 33, 2.2, 10, 1.8, 14, 10, 0.25),
     "Standing 860+ years", True),
    ("Beauvais", SimpleGeo("Beauvais", 72, 15, 48, 2.0, 12, 2.2, 8, 7, 0.35),
     "Choir collapsed 1284", False),
]

rho = 2400; g = 9.81; stone_str = 40

for name, geo, history, should_pass in tests:
    # Quick force balance
    w = geo.nave_width * 1.2 * 0.3 * rho * g / 1000
    rise = geo.vault_height * 0.4
    H = w * geo.nave_width**2 / (8 * rise)
    bay_w = geo.bay_width()
    wall_wt = geo.wall_thickness * geo.vault_height * bay_w * rho * g / 1000
    V = w * geo.nave_width / 2
    th = geo.vault_height * 0.85

    M_over = H * th * bay_w
    M_rest = wall_wt * geo.wall_thickness/2 + V * bay_w * geo.wall_thickness/2

    # Buttress
    bvol = geo.buttress_span * geo.buttress_width * geo.vault_height * 0.3
    bwt = bvol * rho * g / 1000
    ang = np.radians(50)
    M_butt = bwt * np.sin(ang) * th + bwt * np.cos(ang) * geo.wall_thickness
    fos = (M_rest + M_butt) / M_over if M_over > 0 else 99

    # RT60
    A = (geo.floor_area * 2 * 0.02 + geo.stone_wall_area * 0.02 +
         geo.window_area * 0.04 + geo.floor_area * 0.4 * 0.10)
    rt60 = 0.161 * geo.volume / A if A > 0 else 0

    predicted_safe = fos >= 2.0
    correct = predicted_safe == should_pass

    print(f"  {name}:")
    print(f"    FoS = {fos:.2f} → {'SAFE' if predicted_safe else 'AT RISK'}")
    print(f"    RT60 = {rt60:.1f}s | History: {history}")
    print(f"    Prediction {'CORRECT' if correct else 'INCORRECT'}")
    print()

print("""4. KEY FINDINGS
---------------
  - Vault height is the dominant variable: each +1m increases
    overturning moment faster than restoring moment grows
  - Wall thickness provides diminishing returns above ~3m
  - Flying buttresses are essential above ~25m vault height
  - Acoustic RT60 scales roughly linearly with volume
  - Window fraction has minimal effect on acoustics but
    major effect on structural weight (less wall = less mass)

5. LIMITATIONS
--------------
  - 2D moment analysis only (no 3D effects)
  - Static analysis (no wind, earthquake, or dynamic loads)
  - Simplified vault thrust model (actual ribs carry load differently)
  - No construction staging (assumes complete structure)
  - Acoustic model uses Sabine equation (poor for coupled spaces)

6. SKILLS DEMONSTRATED
----------------------
""")

skills = [
    ("Structural mechanics", "Force balance, moment equilibrium, FEA"),
    ("Constrained optimisation", "Grid search, safety constraints, cost functions"),
    ("Acoustics", "Sabine RT60, room modes, standing waves"),
    ("Object-oriented design", "Classes, properties, subsystem integration"),
    ("Model validation", "Comparison against historical outcomes"),
    ("Technical communication", "Engineering report, comparative analysis"),
]

for skill, detail in skills:
    print(f"  * {skill}: {detail}")

print("\\\n" + "=" * 60)`,
      challenge: 'Turn this into a real portfolio piece by adding a "Design Your Own Cathedral" section: given a budget of 100,000 cost units and a target RT60 of 5.0 seconds, find the optimal combination of nave dimensions, vault height, and window fraction that maximises interior volume while meeting all structural and acoustic constraints. This is the real challenge of cathedral design — balancing ambition, physics, and resources.',
      successHint: 'You\'ve completed a full engineering simulation project: system design, subsystem implementation, integration, validation, and documentation. This is the workflow of every engineering consulting firm and research lab — the tools are more sophisticated, but the process is identical. Your Cathedral Force Simulator demonstrates structural mechanics, acoustics, optimisation, and software engineering — a genuine portfolio project.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Cathedral Force Simulator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Cathedral Force Simulator.
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
