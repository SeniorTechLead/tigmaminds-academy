import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import WoodpeckerBioInspirationDiagram from '../diagrams/WoodpeckerBioInspirationDiagram';
import WoodpeckerCrashTestDiagram from '../diagrams/WoodpeckerCrashTestDiagram';
import WoodpeckerMetamaterialDiagram from '../diagrams/WoodpeckerMetamaterialDiagram';
import WoodpeckerSensorDesignDiagram from '../diagrams/WoodpeckerSensorDesignDiagram';
import WoodpeckerSafetyStandardDiagram from '../diagrams/WoodpeckerSafetyStandardDiagram';
import WoodpeckerCapstoneProjectDiagram from '../diagrams/WoodpeckerCapstoneProjectDiagram';

export default function WoodpeckerLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Step 1: Define the helmet impact model',
      concept: `Our capstone project is a **Helmet Safety Analyzer** — a computational tool that models how different helmet designs absorb impact energy and predicts whether they meet safety standards. This is exactly what helmet manufacturers do during the design phase, before building physical prototypes.

A helmet is a multi-layer energy absorption system, just like the woodpecker skull. The standard bicycle helmet has three layers:
- **Outer shell**: A thin, hard polycarbonate layer that spreads the impact over a wider area and prevents penetration.
- **EPS foam liner**: Expanded polystyrene that crushes on impact, converting kinetic energy into permanent deformation. This is the primary energy absorber.
- **Comfort padding**: Soft foam that fits the helmet to the head and provides minor additional cushioning.

Our model will simulate a standard **drop test** — the certification test used by CPSC, EN 1078, and Snell standards. A headform wearing the helmet is dropped from a specified height onto an anvil. Accelerometers in the headform measure the peak g-force and the Head Injury Criterion (HIC), which accounts for both the magnitude and duration of acceleration. A helmet passes if HIC < 1000 and peak g < 300g.

In this first step, we define the physical parameters and build the impact energy calculator.`,
      analogy: 'Building a helmet analyzer is like building a flight simulator before flying a real plane. You model the physics (gravity, lift, drag), define the controls (throttle, flaps), set the test conditions (weather, runway), and see if the plane survives the landing. If the simulation says the design fails, you change it before building the real thing — saving millions of dollars and potentially lives.',
      storyConnection: 'The woodpecker\'s skull is nature\'s helmet — a multi-layer impact protection system refined over millions of years of "testing" through natural selection. Our helmet analyzer reverse-engineers this approach: we define the layers, set the impact conditions, and computationally test whether the design protects the brain. We are doing in minutes what evolution did in millennia.',
      checkQuestion: 'A helmet drop test uses a 5 kg headform dropped from 1.5 m. What is the impact velocity and kinetic energy at the moment of contact?',
      checkAnswer: 'Using conservation of energy: v = sqrt(2*g*h) = sqrt(2 * 9.81 * 1.5) = 5.42 m/s. Kinetic energy = 0.5 * m * v^2 = 0.5 * 5 * 29.4 = 73.6 J. This is the energy the helmet must absorb. If even 10% reaches the head as kinetic energy of the brain, the peak acceleration could exceed concussion thresholds.',
      codeIntro: 'Define the helmet model parameters and calculate impact conditions for standard certification tests.',
      code: `import numpy as np

# === HELMET SAFETY ANALYZER: Step 1 — Impact Model Definition ===

class HelmetImpactModel:
    """Models a helmet drop test for safety certification."""

    def __init__(self, name="Default Helmet"):
        self.name = name
        # Headform properties
        self.head_mass = 5.0  # kg (standard test headform)
        self.head_radius = 0.09  # m (approximate)

        # Helmet layers (from outside in)
        self.layers = []

        # Test standards
        self.standards = {
            'CPSC (bicycle)': {'drop_height': 2.0, 'max_g': 300, 'max_HIC': 1000},
            'EN 1078 (EU bicycle)': {'drop_height': 1.5, 'max_g': 250, 'max_HIC': 1000},
            'Snell B-95 (bicycle)': {'drop_height': 2.2, 'max_g': 300, 'max_HIC': 1000},
            'ECE 22.06 (motorcycle)': {'drop_height': 2.87, 'max_g': 275, 'max_HIC': 2400},
            'Snell M2020 (motorcycle)': {'drop_height': 3.06, 'max_g': 275, 'max_HIC': None},
        }

    def add_layer(self, name, thickness_mm, density_kg_m3, crush_stress_kPa,
                  youngs_modulus_MPa, color='gray'):
        """Add a helmet layer with material properties."""
        self.layers.append({
            'name': name,
            'thickness': thickness_mm / 1000,  # convert to meters
            'density': density_kg_m3,
            'crush_stress': crush_stress_kPa * 1000,  # convert to Pa
            'E': youngs_modulus_MPa * 1e6,  # convert to Pa
            'color': color,
        })

    def impact_conditions(self, drop_height):
        """Calculate impact velocity and energy from drop height."""
        g = 9.81
        v = np.sqrt(2 * g * drop_height)
        KE = 0.5 * self.head_mass * v**2
        return {'velocity': v, 'energy': KE, 'height': drop_height}

    def total_helmet_mass(self):
        """Calculate total helmet mass from layer volumes."""
        total = 0
        for layer in self.layers:
            # Approximate hemisphere shell volume
            r_outer = self.head_radius + sum(l['thickness'] for l in self.layers)

print("\\n[Full visualization in playground]")`,
      challenge: 'Add a fourth layer: a MIPS (Multi-directional Impact Protection System) liner between the EPS foam and comfort padding. MIPS adds ~3mm of low-friction material with very low crush stress (10 kPa). How does it affect the total energy capacity?',
      successHint: 'The model definition is the foundation. We have established the physical parameters, test standards, and energy budget. Next steps will add dynamic simulation, deceleration curves, and HIC calculation to turn this into a real safety analyzer.',
    },
    {
      title: 'Step 2: Simulate the dynamic impact — force vs time',
      concept: `Static energy capacity tells us if the helmet CAN absorb enough energy, but it does not tell us HOW the deceleration unfolds over time. Safety standards care about the **deceleration profile** — the shape of the g-force vs time curve — because the same total energy can be absorbed in dangerous or safe ways.

A helmet that absorbs 100 J in 1 ms produces an extremely high peak g-force. A helmet that absorbs 100 J over 10 ms produces a much lower peak. The ideal deceleration profile is a **square wave** — constant deceleration throughout the crush. This minimizes peak g for a given energy.

Real helmets do not produce square waves. The EPS foam has a stress-strain curve with three regimes:
1. **Linear elastic** (strain < 5%): Low stress, foam compresses cells elastically.
2. **Plateau** (5% < strain < 60-70%): Nearly constant stress as cell walls buckle and collapse. This is where most energy is absorbed.
3. **Densification** (strain > 70%): Collapsed cells compact into solid material, stress rises sharply. This is dangerous — it means the foam is "bottomed out."

Our dynamic simulation uses the equation of motion: m * a(t) = -F_helmet(x(t)), where F_helmet depends on crush distance x through the foam stress-strain curve. We integrate numerically using the Euler method.`,
      analogy: 'Think of jumping off a wall onto a mattress vs onto a thin pillow. Both absorb your landing energy, but the mattress has a long "plateau" where it deforms at nearly constant force. The thin pillow bottoms out immediately — you hit the floor through it. Peak force with the mattress might be 500 N; with the pillow, 5000 N. Same energy, vastly different safety. The EPS foam plateau is the mattress; densification is hitting the floor.',
      storyConnection: 'The woodpecker\'s spongy bone works exactly like EPS foam — it has an elastic region, a plateau where trabeculae buckle progressively, and a densification region when fully compressed. Evolution "discovered" the same stress-strain curve that helmet engineers deliberately design for. Our simulation models both natural and engineered versions of this protective mechanism.',
      checkQuestion: 'A helmet foam has a plateau stress of 800 kPa, contact area of 80 cm^2, and 25 mm thickness. If the head decelerates at constant force through the plateau, what is the g-force on a 5 kg head?',
      checkAnswer: 'Force = stress * area = 800,000 Pa * 0.008 m^2 = 6,400 N. Deceleration = F/m = 6,400 / 5 = 1,280 m/s^2. In g: 1,280 / 9.81 = 130g. This is below the 300g CPSC limit, so the foam density is appropriate. If the foam were too stiff (higher plateau stress), the g-force would be higher. If too soft, the foam would bottom out before absorbing all energy.',
      codeIntro: 'Simulate the dynamic impact using Euler integration with a realistic EPS foam stress-strain curve.',
      code: `import numpy as np

# === HELMET SAFETY ANALYZER: Step 2 — Dynamic Impact Simulation ===

def eps_foam_stress(strain, plateau_stress, densification_strain=0.7):
    """EPS foam stress-strain model with three regions."""
    stress = np.zeros_like(strain)

    # Region 1: Linear elastic (strain < 0.05)
    elastic_mask = strain < 0.05
    E_elastic = plateau_stress / 0.03  # Modulus set so yield matches plateau
    stress[elastic_mask] = E_elastic * strain[elastic_mask]

    # Region 2: Plateau (0.05 < strain < densification)
    plateau_mask = (strain >= 0.05) & (strain < densification_strain)
    # Slight hardening in plateau
    stress[plateau_mask] = plateau_stress * (1 + 0.3 * (strain[plateau_mask] - 0.05))

    # Region 3: Densification (strain > densification)
    dense_mask = strain >= densification_strain
    plateau_at_dense = plateau_stress * (1 + 0.3 * (densification_strain - 0.05))
    stress[dense_mask] = plateau_at_dense * np.exp(5 * (strain[dense_mask] - densification_strain))

    return stress

def simulate_impact(head_mass, drop_height, foam_thickness, foam_plateau_stress,
                    contact_area, shell_stiffness=5e6):
    """Simulate helmet impact using Euler integration."""
    g = 9.81
    v0 = np.sqrt(2 * g * drop_height)
    dt = 1e-6  # 1 microsecond
    t_max = 0.02  # 20 ms max

    t_list, v_list, x_list, a_list, F_list = [0], [v0], [0], [0], [0]

    t, v, x = 0, v0, 0

    while t < t_max and v > 0 and x < foam_thickness * 0.95:
        # Current strain
        strain = x / foam_thickness
        strain = min(strain, 0.95)

        # Foam force
        foam_stress = eps_foam_stress(np.array([strain]), foam_plateau_stress)[0]
        F_foam = foam_stress * contact_area

        # Shell spreading force (distributes load at start)
        F_shell = shell_stiffness * x if x < 0.002 else shell_stiffness * 0.002

        F_total = F_foam + F_shell

print("\\n[Full visualization in playground]")`,
      challenge: 'Vary foam thickness from 15mm to 35mm for the medium foam design. Find the minimum thickness that passes CPSC. This is the thickness-weight tradeoff every helmet designer faces.',
      successHint: 'You now have a dynamic impact simulator. The deceleration profile is what safety labs actually measure with accelerometers during certification. Next we add the HIC calculation that determines pass/fail in most modern standards.',
    },
    {
      title: 'Step 3: Head Injury Criterion (HIC) — the real safety metric',
      concept: `Peak g-force alone is not a sufficient measure of head injury risk. A 500g pulse lasting 0.1 ms might be harmless, while a 200g pulse lasting 10 ms could be lethal. The **Head Injury Criterion (HIC)** captures both magnitude and duration.

HIC is defined as:

HIC = max over (t1, t2) of { (t2 - t1) * [ (1/(t2-t1)) * integral from t1 to t2 of a(t) dt ]^2.5 }

where a(t) is the head acceleration in g's, and the maximum is taken over all pairs of time points (t1, t2) within a 15 ms window (HIC15) or 36 ms window (HIC36).

The exponent 2.5 was determined empirically from cadaver studies at Wayne State University in the 1960s-70s. It means HIC is more sensitive to high accelerations than to duration — a brief spike matters more than a long, gentle push.

Interpreting HIC values:
- HIC < 150: Very low injury risk (< 5% probability of serious injury)
- HIC = 700: ~30% probability of serious head injury
- HIC = 1000: ~50% probability of serious injury (this is the pass/fail threshold)
- HIC > 1500: Very high injury risk

Computing HIC efficiently requires evaluating all valid (t1, t2) pairs, which is an O(n^2) search over the discretized time signal. We will implement this and visualize which time window produces the maximum HIC.`,
      analogy: 'Think of HIC like a weather severity index that combines wind speed and storm duration. A tornado with 200 mph winds for 10 seconds might score lower than a hurricane with 100 mph winds for 6 hours. Both are dangerous, but in different ways. HIC similarly weights intensity (g-force) and exposure time into a single number that predicts actual damage.',
      storyConnection: 'If we could measure the acceleration inside a woodpecker\'s skull during each strike, we could calculate its HIC. Researchers have estimated woodpecker HIC values at 30-80 per strike — well below the injury threshold. This is remarkable given the 1200g peak acceleration. The secret is the extremely short duration (0.5 ms). HIC depends on both magnitude AND time, and the woodpecker wins on time.',
      checkQuestion: 'Two impacts have the same peak g-force of 200g. Impact A lasts 2 ms and Impact B lasts 8 ms. Which has a higher HIC, and approximately by what factor?',
      checkAnswer: 'Impact B has a higher HIC. Rough estimate using HIC ~ dt * a_avg^2.5: HIC_A ~ 0.002 * 200^2.5 = 0.002 * 565,685 = 1,131. HIC_B ~ 0.008 * 200^2.5 = 0.008 * 565,685 = 4,525. Impact B is about 4x higher HIC despite the same peak g. Duration matters enormously in injury prediction. This is why helmets are designed to extend the impact duration as much as possible.',
      codeIntro: 'Implement the HIC calculation from scratch and apply it to the helmet impact simulations from Step 2.',
      code: `import numpy as np

# === HELMET SAFETY ANALYZER: Step 3 — HIC Calculation ===

def compute_HIC(time_s, accel_g, max_window=0.015):
    """
    Compute Head Injury Criterion (HIC15).
    time_s: time array in seconds
    accel_g: acceleration array in g's
    max_window: maximum time window (0.015 for HIC15, 0.036 for HIC36)
    Returns: HIC value and the critical time window (t1, t2)
    """
    n = len(time_s)
    dt = time_s[1] - time_s[0] if n > 1 else 1e-6

    # Precompute cumulative integral of acceleration
    cum_integral = np.cumsum(accel_g) * dt

    max_HIC = 0
    best_t1, best_t2 = 0, 0

    # Search all valid (t1, t2) pairs
    for i in range(n):
        for j in range(i + 1, n):
            t1 = time_s[i]
            t2 = time_s[j]
            delta_t = t2 - t1

            if delta_t > max_window:
                break
            if delta_t < 1e-7:
                continue

            # Average acceleration over window
            integral = cum_integral[j] - cum_integral[i]
            a_avg = integral / delta_t

            # HIC formula
            HIC = delta_t * (abs(a_avg) ** 2.5)

            if HIC > max_HIC:
                max_HIC = HIC
                best_t1, best_t2 = t1, t2

    return max_HIC, best_t1, best_t2

def eps_foam_stress_scalar(strain, plateau_stress):
    if strain < 0.05:
        return (plateau_stress / 0.03) * strain
    elif strain < 0.7:
        pass

print("\\n[Full visualization in playground]")`,
      challenge: 'Implement HIC36 (36ms window) in addition to HIC15. For which helmet designs do the two metrics diverge most? HIC36 is used in some automotive standards and tends to give higher values for longer-duration impacts.',
      successHint: 'HIC is the industry-standard safety metric used by every helmet manufacturer and automobile safety engineer. You just implemented the exact same calculation that NHTSA and CPSC labs use. Next we will use this tool to systematically optimize a helmet design.',
    },
    {
      title: 'Step 4: Design optimization — finding the best foam density and thickness',
      concept: `With our impact simulator and HIC calculator working, we can now systematically explore the design space. A helmet designer must choose foam density, foam thickness, shell material, and contact area — each affecting safety, weight, cost, and comfort. This is a **multi-objective optimization problem**.

The primary design variables for EPS foam are:
- **Density** (30-200 g/L): Higher density means higher plateau stress, which means higher g-force but less crush distance. Too light and the foam bottoms out; too heavy and it transmits too much force.
- **Thickness** (15-40 mm): Thicker foam absorbs more energy but makes the helmet heavier and bulkier. Users resist wearing thick helmets, creating a compliance problem.

The optimization goal: **Find the minimum foam density and thickness that keeps HIC < 1000 and peak g < 300 for the target drop height.** This gives the lightest, most comfortable helmet that still passes certification.

We will create a **design map** — a 2D grid showing HIC and peak g for every combination of density and thickness. The boundary between pass and fail regions reveals the optimal design point. This parametric study approach is standard practice in engineering design.`,
      analogy: 'This is like baking a cake. You have two main variables: oven temperature and baking time. Too hot and too long burns it. Too cool and too short leaves it raw. There is a region of (temperature, time) combinations that produce a good cake. The boundary of that region is your "recipe window." We are finding the recipe window for helmets — the combinations of density and thickness that produce a safe helmet.',
      storyConnection: 'The woodpecker evolved its optimal skull design through millions of years of natural selection — each generation slightly varying thickness and density, with failed designs being eliminated. Our computational optimization does the same thing in seconds. We evaluate thousands of "generations" of helmet designs instantly, finding the optimal configuration without any physical testing.',
      checkQuestion: 'You find that 60 g/L foam at 25 mm thickness gives HIC = 950 (barely passing). How would you adjust the design to add a safety margin without increasing helmet weight significantly?',
      checkAnswer: 'Increase foam density slightly to 70 g/L (adds minimal weight since density increase is small). Or keep 60 g/L but increase thickness to 27 mm. The density increase is usually preferred because it does not change the helmet profile. Another option: improve the shell to spread the load over a larger contact area, which reduces stress without changing foam properties. Real designers use all three levers simultaneously.',
      codeIntro: 'Create a parametric design map scanning foam density and thickness to find the optimal helmet configuration.',
      code: `import numpy as np

# === HELMET SAFETY ANALYZER: Step 4 — Design Optimization ===

def eps_stress(strain, plateau_stress):
    if strain < 0.05:
        return (plateau_stress / 0.03) * strain
    elif strain < 0.7:
        return plateau_stress * (1 + 0.3 * (strain - 0.05))
    else:
        p = plateau_stress * (1 + 0.3 * 0.65)
        return p * np.exp(5 * (strain - 0.7))

def quick_simulate(head_mass, drop_height, foam_thickness, plateau_stress, contact_area):
    g = 9.81
    v = np.sqrt(2 * g * drop_height)
    dt = 1e-5
    x, peak_a = 0, 0
    t_list, a_list = [], []
    t = 0

    while v > 0 and t < 0.02:
        strain = min(x / foam_thickness, 0.95)
        stress = eps_stress(strain, plateau_stress)
        F = stress * contact_area
        a = F / head_mass
        if a > peak_a:
            peak_a = a
        v -= a * dt
        x += max(v, 0) * dt
        t += dt
        t_list.append(t)
        a_list.append(a / g)

    # Quick HIC estimate (simplified: HIC ~ duration * avg_a^2.5)
    if len(a_list) > 0:
        a_arr = np.array(a_list)
        duration = t
        avg_a = np.mean(a_arr)
        # Better estimate: use the peak 15ms window
        n_window = min(int(0.015 / dt), len(a_arr))
        if n_window > 0:
            rolling_avg = np.convolve(a_arr, np.ones(n_window)/n_window, mode='valid')
            if len(rolling_avg) > 0:
                max_avg = np.max(rolling_avg)
                hic = min(n_window * dt, 0.015) * (max_avg ** 2.5)
            else:
                hic = duration * (avg_a ** 2.5)
        else:
            hic = duration * (avg_a ** 2.5)

print("\\n[Full visualization in playground]")`,
      challenge: 'Add a third design variable: contact area (which depends on shell stiffness and anvil shape). Scan contact areas from 40 cm^2 to 120 cm^2 and show how the optimal density-thickness combination shifts. This reveals why shell design matters as much as foam design.',
      successHint: 'You have just performed the same parametric optimization that professional helmet engineers do with commercial FEA software. The design map visualization is a standard tool in engineering — it shows at a glance where the safe designs live and where the boundaries are.',
    },
    {
      title: 'Step 5: Multi-standard certification — testing across conditions',
      concept: `A single optimal design for one test condition is not enough. Real helmets must pass multiple impact conditions: different drop heights, different anvil shapes (flat, curbstone, hemispheric), different impact locations (crown, front, side, rear), and different environmental conditions (hot, cold, wet).

The **flat anvil** test has the largest contact area and is usually the easiest to pass. The **curbstone anvil** (a wedge-shaped anvil) concentrates force on a smaller area, testing the shell's ability to spread the load. The **hemispheric anvil** is the harshest — a small, hard contact point that can punch through the shell.

Temperature also matters enormously. EPS foam is stiffer when cold (higher plateau stress, higher g) and softer when hot (lower plateau stress, more crush risk). Standards require testing at -20C, 20C (room temp), and 50C. A design that passes at room temperature might fail when cold (too stiff) or when hot (too soft).

Our analyzer needs to check the design against ALL these conditions and report the worst-case scenario. The helmet must pass every single test — one failure means no certification.`,
      analogy: 'Certification testing is like qualifying for the Olympics in a decathlon. You cannot just be great at one event — you must meet minimum standards in all ten events. A helmet that aces the flat anvil test but fails the curbstone test is like a decathlete who runs a world-record 100m but cannot clear the high jump bar. The certification goes to the designs that are good enough everywhere, not perfect anywhere.',
      storyConnection: 'The woodpecker faces its own "multi-standard certification" every day. It strikes different tree species (hardwood vs softwood — different anvil stiffness), at different locations on the tree (thick bark vs thin bark — different contact areas), in different seasons (cold vs warm — different tissue stiffness). Its skull design passes ALL conditions with margin. Our analyzer must do the same for the helmet.',
      checkQuestion: 'A helmet design gives HIC = 800 on a flat anvil at room temperature. Testing on a curbstone anvil (half the contact area) at -20C (foam 40% stiffer), what would you estimate the HIC to be?',
      checkAnswer: 'Halving the contact area doubles the stress (same force, half the area), which roughly doubles the g-force. Making the foam 40% stiffer also increases g-force by about 40%. Combined effect: g-force increases by a factor of ~2.8. Since HIC depends on acceleration to the power 2.5, HIC increases by roughly 2.8^2.5 = ~13. Estimated HIC = 800 * 13 = ~10,400. This design would catastrophically fail the curbstone cold test even though it passed the flat anvil room temp test.',
      codeIntro: 'Test the optimized helmet design against all certification conditions and identify the limiting test.',
      code: `import numpy as np

# === HELMET SAFETY ANALYZER: Step 5 — Multi-Standard Certification ===

def eps_stress_val(strain, plateau_stress):
    if strain < 0.05:
        return (plateau_stress / 0.03) * strain
    elif strain < 0.7:
        return plateau_stress * (1 + 0.3 * (strain - 0.05))
    else:
        p = plateau_stress * (1 + 0.3 * 0.65)
        return p * np.exp(5 * (strain - 0.7))

def full_simulate(head_mass, drop_height, foam_thick, plateau_stress, contact_area):
    g = 9.81
    v = np.sqrt(2 * g * drop_height)
    dt = 5e-6
    x, peak_a = 0, 0
    t_list, a_list = [], []
    t_val = 0

    while v > 0 and t_val < 0.025:
        strain = min(x / foam_thick, 0.95)
        stress = eps_stress_val(strain, plateau_stress)
        F = stress * contact_area
        a = F / head_mass
        if a > peak_a: peak_a = a
        v -= a * dt
        x += max(v, 0) * dt
        t_val += dt
        t_list.append(t_val)
        a_list.append(a / g)

    a_arr = np.array(a_list)
    n_window = min(int(0.015 / dt), len(a_arr))
    if n_window > 1:
        rolling_avg = np.convolve(a_arr, np.ones(n_window)/n_window, mode='valid')
        max_avg = np.max(rolling_avg) if len(rolling_avg) > 0 else np.mean(a_arr)
        hic = min(n_window * dt, 0.015) * (max_avg ** 2.5)
    else:
        hic = 0

    return {
        'peak_g': peak_a / g,
        'HIC': hic,
        'crush_pct': x / foam_thick * 100,
        'duration_ms': t_val * 1000,
        't': np.array(t_list),
        'a_g': a_arr,
    }

print("\\n[Full visualization in playground]")`,
      challenge: 'Add a "wet" condition where the shell-foam interface has reduced friction, allowing the helmet to slide on the anvil. Model this as a 30% increase in contact area (force spreads more). How does this affect pass/fail rates? Some standards require wet testing.',
      successHint: 'Multi-condition certification is why helmet design is genuinely difficult. A design that is optimal for one condition is often suboptimal for another. The art of helmet engineering is finding the best compromise across ALL conditions — exactly what the woodpecker skull achieves naturally.',
    },
    {
      title: 'Step 6: Complete Helmet Safety Report — bio-inspired optimization',
      concept: `In this final step, we bring everything together into a complete Helmet Safety Report that compares conventional designs against bio-inspired designs that borrow features from the woodpecker skull.

The woodpecker teaches us four design principles that are not yet standard in commercial helmets:
1. **Graded density foam**: Instead of uniform EPS, use foam that varies in density from stiff at the outside to soft near the head — like the woodpecker's graded bone structure.
2. **Wrap-around reinforcement**: A flexible band that wraps around the helmet like the woodpecker's hyoid bone, redistributing forces from the impact point to the entire shell.
3. **Multi-directional protection**: A low-friction layer (like MIPS) that allows rotational sliding, inspired by the woodpecker's tight-fitting brain that prevents rotational injury.
4. **Tuned damping**: Viscoelastic materials whose relaxation time matches the expected impact duration, as the woodpecker's skull material is tuned to its drumming frequency.

Our final analyzer generates a complete certification report comparing a conventional helmet against a bio-inspired design across all test conditions. This is a professional-grade engineering deliverable.`,
      analogy: 'This final step is like writing the flight test report for a new aircraft. You have tested every system individually — engines, avionics, landing gear, pressurization. Now you compile all results into a single document that says "this aircraft is safe to fly." The certification authority reads this report and stamps "Approved" or "Requires modifications." Our report is the helmet equivalent.',
      storyConnection: 'We started with a woodpecker drumming on a sal tree — a story from the forests of Assam. We analyzed the physics of that drumming: impact mechanics, stress distribution, shock absorption, viscoelasticity, and finite element modeling. Now we have used every one of those principles to design and certify a helmet that protects human brains. The story has come full circle — from nature\'s solution to engineered protection.',
      checkQuestion: 'A bio-inspired helmet with graded density foam uses 120 g/L on the outside and 40 g/L on the inside, with the same total mass as a uniform 80 g/L helmet. Why might the graded version outperform the uniform one?',
      checkAnswer: 'The outer dense layer acts like the outer shell — it spreads force and resists penetration. The inner soft layer acts like a cushion — it extends the deceleration time and reduces peak g. In a uniform foam, you must compromise: stiff enough not to bottom out, but soft enough not to transmit too much force. The graded design eliminates this compromise — each region is optimized for its role. The woodpecker skull uses exactly this graded approach.',
      codeIntro: 'Generate a complete Helmet Safety Report comparing conventional and bio-inspired designs across all certification conditions.',
      code: `import numpy as np

# === HELMET SAFETY ANALYZER: Step 6 — Complete Report ===

def foam_stress(strain, plateau_stress):
    if strain < 0.05:
        return (plateau_stress / 0.03) * strain
    elif strain < 0.7:
        return plateau_stress * (1 + 0.3 * (strain - 0.05))
    else:
        p = plateau_stress * (1 + 0.3 * 0.65)
        return p * np.exp(5 * (strain - 0.7))

def graded_foam_stress(strain, outer_plateau, inner_plateau, thickness):
    """Graded foam: outer half is denser, inner half is softer."""
    crush_dist = strain * thickness
    if crush_dist < thickness * 0.5:
        local_strain = crush_dist / (thickness * 0.5)
        return foam_stress(min(local_strain, 0.95), outer_plateau)
    else:
        local_strain = (crush_dist - thickness * 0.5) / (thickness * 0.5)
        return foam_stress(min(local_strain, 0.95), inner_plateau)

def simulate_helmet(head_mass, drop_height, foam_thick, plateau_stress,
                    contact_area, graded=False, outer_plateau=None, inner_plateau=None,
                    hyoid_factor=1.0, damping_factor=1.0):
    g = 9.81
    v = np.sqrt(2 * g * drop_height)
    dt = 5e-6
    x, peak_a = 0, 0
    t_list, a_list = [], []
    t_val = 0

    while v > 0 and t_val < 0.025:
        strain = min(x / foam_thick, 0.95)

        if graded and outer_plateau and inner_plateau:
            stress_val = graded_foam_stress(strain, outer_plateau, inner_plateau, foam_thick)
        else:
            stress_val = foam_stress(strain, plateau_stress)

        # Hyoid factor: spreads force over larger area
        effective_area = contact_area * hyoid_factor
        F = stress_val * effective_area

        # Viscoelastic damping
        F_damping = damping_factor * 500 * v  # velocity-dependent damping
        F_total = F + F_damping

        a = F_total / head_mass

print("\\n[Full visualization in playground]")`,
      challenge: 'Add a cost model: dense foam costs more than light foam, the hyoid reinforcement adds $3 per helmet, and viscoelastic materials add $5. Find the design that minimizes cost while passing all tests. This is the real engineering optimization — safety at minimum cost.',
      successHint: 'You have built a complete Helmet Safety Analyzer from scratch — impact physics, dynamic simulation, HIC calculation, multi-condition testing, and bio-inspired optimization. This is genuine engineering work. The woodpecker story that started as a children\'s tale has become a masterclass in biomechanics, materials science, and computational engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone: Build a Helmet Safety Analyzer</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project builds a complete Helmet Safety Analyzer using Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={[WoodpeckerBioInspirationDiagram, WoodpeckerCrashTestDiagram, WoodpeckerMetamaterialDiagram, WoodpeckerSensorDesignDiagram, WoodpeckerSafetyStandardDiagram, WoodpeckerCapstoneProjectDiagram][i] ? createElement([WoodpeckerBioInspirationDiagram, WoodpeckerCrashTestDiagram, WoodpeckerMetamaterialDiagram, WoodpeckerSensorDesignDiagram, WoodpeckerSafetyStandardDiagram, WoodpeckerCapstoneProjectDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
