import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function WootzSteelLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: System design — Alloy, HeatTreatment, and Microstructure classes',
      concept: `In this capstone project, you will build a complete **Steel Properties Calculator** — a Python program that models the full journey from alloy composition to final blade properties:

1. **Alloy class** — stores composition (C, V, Mn, Si, P) and computes derived properties
2. **HeatTreatment class** — represents a thermal cycle (heating temperature, hold time, cooling rate)
3. **Microstructure class** — predicts the resulting phases (pearlite, bainite, martensite, cementite) from alloy + heat treatment
4. **Property calculator** — maps microstructure to mechanical properties (hardness, toughness, UTS)
5. **Optimiser** — searches for the best alloy + heat treatment for a given application

The first step is **system design** — defining the classes, their attributes, their methods, and how they interact. This is the architecture of your calculator.

Good object-oriented design means each class has a **single responsibility**: the Alloy knows about composition, the HeatTreatment knows about thermal cycles, and the Microstructure knows about phases. No class does someone else's job.

📚 *The Single Responsibility Principle: every class should have one reason to change. If your Alloy class also calculates heat treatment outcomes, it has two responsibilities — and changes to heat treatment logic would require modifying the Alloy class.*`,
      analogy: 'Think of a restaurant kitchen. The sous chef preps ingredients (Alloy class). The grill cook controls the heat (HeatTreatment class). The result is a cooked dish with specific qualities (Microstructure class). And the head chef evaluates the dish (Property calculator). Each person has one job. If the sous chef also tried to run the grill, the kitchen would descend into chaos.',
      storyConnection: 'The wootz process had exactly these stages: selecting iron ore and carbon sources (alloy composition), controlling the crucible temperature and time (heat treatment), producing a specific banded microstructure (microstructure), and testing the blade\'s edge retention and flexibility (properties). Our calculator models this entire chain.',
      checkQuestion: 'Why define separate Alloy and HeatTreatment classes instead of one big "Steel" class?',
      checkAnswer: 'Because the same alloy can undergo different heat treatments, and the same heat treatment can be applied to different alloys. Separate classes let you mix and match: test 10 alloys × 10 heat treatments = 100 combinations. A monolithic "Steel" class would require duplicating alloy data for each treatment, or treatment data for each alloy.',
      codeIntro: 'Design the architecture of the Steel Properties Calculator — define the three core classes and their interfaces.',
      code: `# Steel Properties Calculator — System Design
# Step 1: Define the three core classes

import numpy as np

class Alloy:
    """Represents a steel alloy composition."""
    def __init__(self, name, C, V=0.0, Mn=0.0, Si=0.0, P=0.02):
        self.name = name
        self.C = C          # carbon (wt%)
        self.V = V          # vanadium (wt%)
        self.Mn = Mn        # manganese (wt%)
        self.Si = Si        # silicon (wt%)
        self.P = P          # phosphorus (wt%)

    def carbon_equivalent(self):
        """CE = C + Mn/6 + Si/24 — weldability/hardenability index."""
        return self.C + self.Mn / 6 + self.Si / 24

    def martensite_start_temp(self):
        """Ms (°C) — temperature where martensite starts forming."""
        return 539 - 423 * self.C - 30.4 * self.Mn - 17.7 * self.Si

    def __repr__(self):
        return f"Alloy({self.name}: {self.C}C-{self.V}V-{self.Mn}Mn-{self.Si}Si)"

class HeatTreatment:
    """Represents a thermal cycle."""
    def __init__(self, name, austenitize_T, hold_hours, cooling_rate):
        self.name = name
        self.austenitize_T = austenitize_T  # °C
        self.hold_hours = hold_hours
        self.cooling_rate = cooling_rate      # °C/s

    def quench_severity(self):
        """Classify quench speed."""
        if self.cooling_rate > 100: return "Water quench"
        if self.cooling_rate > 30: return "Oil quench"
        if self.cooling_rate > 5: return "Forced air"
        if self.cooling_rate > 0.5: return "Still air"
        return "Furnace cool"

class Microstructure:
    """Predicted microstructure from alloy + heat treatment."""
    def __init__(self, pearlite=0, bainite=0, martensite=0, cementite=0, ferrite=0):
        self.pearlite = pearlite      # volume fraction (0-1)
        self.bainite = bainite
        self.martensite = martensite
        self.cementite = cementite
        self.ferrite = ferrite
        self._normalise()

    def _normalise(self):
        total = self.pearlite + self.bainite + self.martensite + self.cementite + self.ferrite
        if total > 0:
            self.pearlite /= total
            self.bainite /= total
            self.martensite /= total
            self.cementite /= total
            self.ferrite /= total

    def dominant_phase(self):
        phases = {"Pearlite": self.pearlite, "Bainite": self.bainite,
                  "Martensite": self.martensite, "Cementite": self.cementite,
                  "Ferrite": self.ferrite}
        return max(phases, key=phases.get)

# Test the architecture
alloys = [
    Alloy("Mild steel", C=0.2, Mn=0.5),
    Alloy("Tool steel", C=0.8, Mn=0.3, V=0.01),
    Alloy("Wootz", C=1.5, V=0.03, Mn=0.3, Si=0.2),
    Alloy("Hypereutectoid", C=2.0, V=0.04, Mn=0.2),
]

treatments = [
    HeatTreatment("Furnace cool", 1100, 24, 0.1),
    HeatTreatment("Air cool", 1100, 24, 2.0),
    HeatTreatment("Oil quench", 1100, 24, 50),
    HeatTreatment("Water quench", 1100, 24, 200),
]

print("=== Steel Properties Calculator — Architecture ===\\\n")
print("--- Alloys ---")
for a in alloys:
    print(f"  {a.name:<18} CE={a.carbon_equivalent():.2f}  Ms={a.martensite_start_temp():.0f}°C")

print("\\\n--- Heat Treatments ---")
for ht in treatments:
    print(f"  {ht.name:<18} {ht.austenitize_T}°C × {ht.hold_hours}h → {ht.quench_severity()}")

print("\\\n--- Microstructure (placeholder) ---")
ms = Microstructure(pearlite=0.4, cementite=0.15, bainite=0.05)
print(f"  Dominant phase: {ms.dominant_phase()}")
print(f"  Phases: P={ms.pearlite:.0%} B={ms.bainite:.0%} M={ms.martensite:.0%} "
      f"C={ms.cementite:.0%} F={ms.ferrite:.0%}")
print("\\\nArchitecture ready. Next: connect alloy + treatment → microstructure prediction.")`,
      challenge: 'Add a method `is_wootz_candidate()` to the Alloy class that returns True if the composition falls within the historical wootz window: C 1.0-2.0%, V 0.01-0.05%, P < 0.04%. Test it on all four alloys. This kind of validation method prevents users from running nonsensical simulations.',
      successHint: 'Good system design makes everything else easier. You defined three classes with clear responsibilities and clean interfaces. This is the foundation of all professional software — from game engines to financial models to the steel industry\'s own JMatPro and Thermo-Calc software.',
    },
    {
      title: 'Phase prediction engine — composition + cooling rate to microstructure',
      concept: `Now we connect the Alloy and HeatTreatment classes to predict the resulting Microstructure. This is the **phase prediction engine** — the core physics of the calculator.

The prediction follows a simplified CCT (Continuous Cooling Transformation) model:

1. **Calculate the critical cooling rates** for each phase transition based on the alloy's carbon content and trace elements
2. **Compare the actual cooling rate** to these critical rates
3. **Assign volume fractions** to each phase based on where the cooling rate falls

Key rules:
- Very slow cooling → mostly **pearlite + cementite** (equilibrium phases)
- Medium cooling → **bainite** (intermediate)
- Fast cooling → **martensite** (non-equilibrium, trapped carbon)
- Higher carbon → more **cementite** (excess carbon above the eutectoid)
- Vanadium → promotes **fine carbide precipitation** (enhances damask pattern)

The wootz sweet spot is slow cooling that produces a pearlite matrix with aligned cementite bands — not too fast (martensite, brittle) and not too slow (coarse, random cementite).

📚 *The eutectoid composition for steel is 0.76% C. Below this (hypoeutectoid), excess iron forms ferrite. Above this (hypereutectoid, like wootz at 1.5% C), excess carbon forms cementite (Fe₃C).*`,
      analogy: 'Imagine making ice cream. Churn it slowly and you get coarse, icy crystals (slow cool → coarse pearlite). Churn it at the right speed and you get smooth, creamy texture (medium cool → fine pearlite + bainite). Flash-freeze it and you get a solid block — smooth but hard and inflexible (quench → martensite). The speed of the process determines the texture of the result.',
      storyConnection: 'The wootz smiths controlled cooling with remarkable precision — one method involved cooling the crucible in a current of air while rotating it. Too fast, and the blade became brittle martensite. Too slow, and the carbide bands became coarse and random. The narrow window for perfect damask patterns corresponds to a specific cooling rate range that our engine will identify.',
      checkQuestion: 'A 1.5% C steel is cooled at 0.5°C/s from 1100°C. Given that martensite requires >50°C/s and bainite requires >5°C/s for this composition, what microstructure do you expect?',
      checkAnswer: 'Pearlite + cementite — the cooling rate (0.5°C/s) is below both the bainite and martensite critical rates. The steel has time to form equilibrium phases. At 1.5% C (hypereutectoid), the excess carbon beyond 0.76% forms proeutectoid cementite. The result: a pearlitic matrix with cementite bands — classic wootz.',
      codeIntro: 'Build the phase prediction engine that takes alloy composition and cooling rate and outputs the microstructure.',
      code: `import numpy as np

class Alloy:
    def __init__(self, name, C, V=0.0, Mn=0.0, Si=0.0, P=0.02):
        self.name = name
        self.C = C; self.V = V; self.Mn = Mn; self.Si = Si; self.P = P

    def Ms_temp(self):
        return 539 - 423 * self.C - 30.4 * self.Mn - 17.7 * self.Si

class HeatTreatment:
    def __init__(self, name, T, hold_h, rate):
        self.name = name; self.T = T; self.hold_h = hold_h; self.rate = rate

def predict_microstructure(alloy, treatment):
    """
    Predict phase fractions from alloy composition and cooling rate.
    Returns dict of phase volume fractions.
    """
    C = alloy.C
    rate = treatment.rate

    # Critical cooling rates (°C/s) — adjusted by composition
    rate_martensite = 50 / (1 + 2 * C) / (1 + 5 * alloy.Mn)
    rate_bainite = 5 / (1 + C) / (1 + 3 * alloy.Mn)
    rate_pearlite = 0.5  # pearlite forms at almost any slow rate

    # Cementite fraction (hypereutectoid: excess C forms Fe3C)
    if C > 0.76:
        cementite = (C - 0.76) / (6.67 - 0.76) * 2.5  # Fe3C is 6.67% C
    else:
        cementite = 0

    # Phase fractions based on cooling rate
    if rate > rate_martensite:
        martensite = 0.85 + 0.1 * min(rate / rate_martensite, 5) / 5
        bainite = 1 - martensite - cementite
        pearlite = 0; ferrite = 0
    elif rate > rate_bainite:
        frac = (rate - rate_bainite) / (rate_martensite - rate_bainite)
        martensite = 0.3 * frac
        bainite = 0.6 * (1 - frac)
        pearlite = 1 - martensite - bainite - cementite
        ferrite = 0
    elif rate > rate_pearlite:
        martensite = 0; bainite = 0.15
        pearlite = 1 - bainite - cementite
        ferrite = 0
    else:
        martensite = 0; bainite = 0
        if C < 0.76:
            ferrite = (0.76 - C) / 0.76 * 0.5
        else:
            ferrite = 0
        pearlite = 1 - cementite - ferrite

    # Vanadium promotes fine carbide within pearlite
    v_boost = alloy.V * 10  # enhances pattern quality

    # Clamp and normalise
    phases = {"pearlite": max(pearlite, 0), "bainite": max(bainite, 0),
              "martensite": max(martensite, 0), "cementite": max(cementite, 0),
              "ferrite": max(ferrite, 0)}
    total = sum(phases.values())
    if total > 0:
        phases = {k: v/total for k, v in phases.items()}
    return phases, v_boost

# Test: wootz alloy with different heat treatments
wootz = Alloy("Wootz", C=1.5, V=0.03, Mn=0.3, Si=0.2)
print(f"=== Phase Prediction for {wootz.name} ({wootz.C}% C) ===")
print(f"Martensite start: {wootz.Ms_temp():.0f}°C\\\n")

rates = [0.05, 0.1, 0.5, 1.0, 2.0, 5.0, 10, 50, 100, 500]
print(f"{'Rate °C/s':<10} {'Pearlite':>9} {'Bainite':>9} {'Martens':>9} "
      f"{'Cement':>9} {'Ferrite':>9} {'V-boost':>8}")
print("-" * 67)

for rate in rates:
    ht = HeatTreatment(f"{rate}C/s", 1100, 24, rate)
    phases, vb = predict_microstructure(wootz, ht)
    print(f"{rate:<10.2f} {phases['pearlite']:>8.0%} {phases['bainite']:>8.0%} "
          f"{phases['martensite']:>8.0%} {phases['cementite']:>8.0%} "
          f"{phases['ferrite']:>8.0%} {vb:>7.2f}")

# Compare alloys at wootz cooling rate (0.5°C/s)
print("\\\n=== Different Alloys at 0.5°C/s (Wootz Cooling Rate) ===")
alloys = [
    Alloy("Mild", C=0.2, Mn=0.5),
    Alloy("Medium C", C=0.5, Mn=0.4),
    Alloy("Eutectoid", C=0.76, Mn=0.3),
    Alloy("Wootz", C=1.5, V=0.03, Mn=0.3, Si=0.2),
    Alloy("Ultra-high C", C=2.0, V=0.04, Mn=0.2),
]
ht = HeatTreatment("Slow air", 1100, 24, 0.5)

print(f"{'Alloy':<14} {'C%':>4} {'Pearlite':>9} {'Cement':>9} {'Ferrite':>9} {'Damask?':>8}")
print("-" * 55)
for a in alloys:
    phases, vb = predict_microstructure(a, ht)
    damask = "Yes" if phases["cementite"] > 0.05 and phases["pearlite"] > 0.4 else "No"
    print(f"{a.name:<14} {a.C:>3.1f} {phases['pearlite']:>8.0%} "
          f"{phases['cementite']:>8.0%} {phases['ferrite']:>8.0%} {damask:>7}")`,
      challenge: 'Add a "pattern quality" score based on: (1) cementite fraction between 5-15% (too little = no pattern, too much = brittle network), (2) pearlite fraction > 50% (need a ductile matrix), (3) vanadium boost > 0.1 (fine carbide dispersion). What cooling rate maximises pattern quality for the 1.5% C wootz alloy?',
      successHint: 'You built a phase prediction engine — the simplified version of what software like JMatPro and Thermo-Calc does for the steel industry. The mapping from composition + cooling rate → microstructure is the central calculation in all of metallurgy. Every steel mill in the world uses this kind of model to control their product quality.',
    },
    {
      title: 'Property calculator — microstructure to hardness and toughness',
      concept: `The microstructure determines the mechanical properties. Each phase contributes differently:

| Phase | Hardness (HV) | Toughness (J) | Why |
|-------|--------------|---------------|-----|
| Ferrite | 80 | 200 | Soft, ductile pure iron |
| Pearlite | 250 | 60 | Layered ferrite + cementite |
| Bainite | 400 | 40 | Fine needle-like structure |
| Martensite | 700 | 10 | Distorted lattice, trapped carbon |
| Cementite | 800 | 5 | Hard but extremely brittle |

The **rule of mixtures** gives the composite properties:

**H_total = Σ (f_i × H_i)** for hardness
**1/T_total = Σ (f_i / T_i)** for toughness (series model — the brittle phase dominates)

But real steel is more complex: the **arrangement** of phases matters, not just their fractions. Cementite as aligned bands (wootz) gives different properties than cementite as a continuous network (white cast iron). We model this with an **arrangement factor** that adjusts the effective toughness.

📚 *The rule of mixtures for toughness uses the inverse (series) model because a crack finds the weakest path. A continuous brittle phase (cementite network) is catastrophic; discrete particles in a ductile matrix are much tougher.*`,
      analogy: 'Imagine a wall of bricks (hard) and mortar (soft). Hit it and the crack runs through the mortar joints (weakest path) — the toughness is dominated by the mortar. But if you arrange the same bricks and mortar as alternating layers, a crack must cross hard AND soft layers, absorbing much more energy. Microstructural arrangement changes everything, even with the same phase fractions.',
      storyConnection: 'This is the secret of wootz: the cementite is arranged as aligned bands (like the layered wall), not a continuous network (like the mortared wall). A crack hitting a wootz blade must zigzag through alternating hard and soft layers, absorbing enormous energy. This arrangement is why wootz combines the hardness of high-carbon steel with the toughness of medium-carbon steel.',
      checkQuestion: 'A microstructure has 60% pearlite (HV=250, T=60J) and 40% cementite (HV=800, T=5J). Calculate the composite hardness and toughness.',
      checkAnswer: 'Hardness (parallel): H = 0.6×250 + 0.4×800 = 150 + 320 = 470 HV. Toughness (series): 1/T = 0.6/60 + 0.4/5 = 0.01 + 0.08 = 0.09, so T = 11.1 J. The toughness is dominated by the brittle cementite! This is why cementite fraction must be kept below ~15% for a usable blade.',
      codeIntro: 'Build the property calculator that converts microstructure phase fractions into mechanical properties.',
      code: `import numpy as np

# Phase properties
PHASE_PROPS = {
    "ferrite":    {"HV": 80,  "toughness": 200, "UTS": 300,  "ductility": 0.35},
    "pearlite":   {"HV": 250, "toughness": 60,  "UTS": 650,  "ductility": 0.15},
    "bainite":    {"HV": 400, "toughness": 40,  "UTS": 900,  "ductility": 0.08},
    "martensite": {"HV": 700, "toughness": 10,  "UTS": 1500, "ductility": 0.02},
    "cementite":  {"HV": 800, "toughness": 5,   "UTS": 200,  "ductility": 0.00},
}

def calculate_properties(phases, arrangement="banded"):
    """
    Calculate composite mechanical properties from phase fractions.
    arrangement: 'banded' (wootz), 'network' (cast iron), 'random' (default)
    """
    # Hardness: rule of mixtures (parallel model)
    hardness = sum(f * PHASE_PROPS[p]["HV"] for p, f in phases.items() if f > 0)

    # Toughness: inverse rule of mixtures (series model)
    inv_tough = sum(f / PHASE_PROPS[p]["toughness"] for p, f in phases.items() if f > 0)
    base_toughness = 1 / inv_tough if inv_tough > 0 else 0

    # Arrangement factor for toughness
    arrangement_factors = {"banded": 2.5, "random": 1.0, "network": 0.3}
    toughness = base_toughness * arrangement_factors.get(arrangement, 1.0)

    # UTS: weighted average with strain hardening correction
    uts = sum(f * PHASE_PROPS[p]["UTS"] for p, f in phases.items() if f > 0)

    # Ductility: dominated by the least ductile major phase
    ductility = sum(f * PHASE_PROPS[p]["ductility"] for p, f in phases.items() if f > 0)

    # HRC conversion
    hrc = max(0, min(70, 0.0536 * hardness - 1.0))

    return {"HV": hardness, "HRC": hrc, "toughness": toughness,
            "UTS": uts, "ductility": ductility * 100}

# Test with various microstructures
print("=== Property Calculator Results ===\\\n")

test_cases = [
    ("Pure ferrite (annealed iron)",
     {"ferrite": 1.0, "pearlite": 0, "bainite": 0, "martensite": 0, "cementite": 0}, "random"),
    ("Medium C pearlitic",
     {"ferrite": 0.3, "pearlite": 0.7, "bainite": 0, "martensite": 0, "cementite": 0}, "random"),
    ("Wootz (banded)",
     {"ferrite": 0, "pearlite": 0.65, "bainite": 0.05, "martensite": 0, "cementite": 0.30}, "banded"),
    ("Wootz (network — bad)",
     {"ferrite": 0, "pearlite": 0.65, "bainite": 0.05, "martensite": 0, "cementite": 0.30}, "network"),
    ("Quenched wootz",
     {"ferrite": 0, "pearlite": 0, "bainite": 0.1, "martensite": 0.7, "cementite": 0.2}, "random"),
    ("Tempered wootz",
     {"ferrite": 0, "pearlite": 0.4, "bainite": 0.3, "martensite": 0.1, "cementite": 0.2}, "banded"),
]

print(f"{'Microstructure':<32} {'HV':>5} {'HRC':>5} {'Tough':>6} {'UTS':>6} {'Duct%':>6}")
print("-" * 62)

for name, phases, arr in test_cases:
    props = calculate_properties(phases, arr)
    print(f"{name:<32} {props['HV']:>4.0f} {props['HRC']:>4.1f} "
          f"{props['toughness']:>5.1f} {props['UTS']:>5.0f} {props['ductility']:>5.1f}")

# The critical role of arrangement
print("\\\n=== Arrangement Effect (Same Phases, Different Structure) ===")
wootz_phases = {"ferrite": 0, "pearlite": 0.65, "bainite": 0.05,
                "martensite": 0, "cementite": 0.30}

for arr in ["banded", "random", "network"]:
    props = calculate_properties(wootz_phases, arr)
    print(f"  {arr:<10}: Toughness = {props['toughness']:>6.1f} J  "
          f"({'Wootz blade' if arr == 'banded' else 'Cast steel' if arr == 'random' else 'White cast iron'})")

print("\\\nSame chemistry. Same phase fractions. 8× toughness difference.")
print("Arrangement is the wootz secret — and it's what the smiths controlled.")`,
      challenge: 'Add a "blade suitability score" that penalises extremes: hardness below 300 HV (too soft to hold an edge), toughness below 15 J (too brittle to survive impact), and ductility below 2% (will snap). What microstructure maximises the blade score? How close is it to the historical wootz composition?',
      successHint: 'You built a property calculator that maps microstructure to mechanical performance — the same function that steel mills use to certify their products meet specification. The key insight: arrangement matters as much as composition. This is why processing (heat treatment, forging) is as important as chemistry in metallurgy.',
    },
    {
      title: 'Optimisation — find the best alloy and heat treatment for a blade',
      concept: `Now we combine all three components — Alloy, HeatTreatment, and Property Calculator — into an **optimisation loop** that searches for the best blade steel.

The search space is six-dimensional:
- Carbon: 0.5 - 2.0%
- Vanadium: 0 - 0.05%
- Manganese: 0 - 0.5%
- Silicon: 0 - 0.5%
- Cooling rate: 0.05 - 500 °C/s
- Austenitising temperature: 900 - 1200°C

The objective function combines multiple criteria with weights:
- **Edge hardness**: HV > 450 for a sharp, long-lasting edge
- **Body toughness**: > 20 J to survive impacts without shattering
- **Pattern quality**: visible damask (cementite fraction 5-15%, banded arrangement)
- **Forgeability**: not too brittle to forge (ductility > 3%)

This is a **multi-objective optimisation problem**. We use a weighted sum approach and grid search to find the Pareto-optimal designs — the set of compositions where no single property can be improved without worsening another.

📚 *In practice, alloy designers use gradient-based methods (for smooth objectives) or genetic algorithms (for complex, non-smooth objectives). Grid search is the simplest approach: exhaustive but reliable.*`,
      analogy: 'Imagine tuning a guitar. Each string must be at the right tension — too tight and it snaps (too brittle), too loose and it sounds dull (too soft). You can\'t maximise tension on all strings independently; they interact through the bridge. Alloy design is the same: maximising hardness may sacrifice toughness, and the optimal design balances all properties.',
      storyConnection: 'The Indian wootz masters spent centuries finding the optimal recipe by trial and error — adjusting iron ore sources, charcoal types, crucible design, and cooling methods. Our optimiser does the same search in seconds, evaluating thousands of combinations. The remarkable finding: our model predicts an optimum very close to the historical wootz composition (1.5% C, trace V), confirming that the ancient smiths had truly found the sweet spot.',
      checkQuestion: 'You find two optimal alloys: Alloy A (HV=500, Toughness=25J) and Alloy B (HV=450, Toughness=35J). Which is "better"?',
      checkAnswer: 'Neither — they are both Pareto-optimal. A is better for hardness, B is better for toughness, and neither dominates the other on ALL criteria. The choice depends on the application: A for a razor that needs edge retention, B for a combat blade that needs impact resistance. The Pareto frontier shows the design engineer the available trade-offs.',
      codeIntro: 'Run the full optimisation — search alloy composition and cooling rate space for the best wootz blade.',
      code: `import numpy as np

def predict_phases(C, V, Mn, rate):
    """Simplified phase prediction."""
    # Critical rates adjusted by composition
    rate_m = 50 / (1 + 2*C) / (1 + 5*Mn)
    rate_b = 5 / (1 + C) / (1 + 3*Mn)

    cementite = max(0, (C - 0.76) / 5.91 * 2.5) if C > 0.76 else 0
    if rate > rate_m:
        martensite = 0.85; bainite = 0; pearlite = 0
    elif rate > rate_b:
        f = (rate - rate_b) / (rate_m - rate_b)
        martensite = 0.3 * f; bainite = 0.6 * (1-f); pearlite = 0
    else:
        martensite = 0; bainite = 0.1; pearlite = 1 - 0.1 - cementite

    ferrite = max(0, (0.76 - C) / 0.76 * 0.5) if C < 0.76 else 0
    total = pearlite + bainite + martensite + cementite + ferrite
    if total > 0:
        pearlite /= total; bainite /= total; martensite /= total
        cementite /= total; ferrite /= total
    return pearlite, bainite, martensite, cementite, ferrite

def calc_props(P, B, M, Ce, F, arrangement="banded"):
    HV = 80*F + 250*P + 400*B + 700*M + 800*Ce
    inv_t = F/200 + P/60 + B/40 + M/10 + Ce/5 if (F+P+B+M+Ce) > 0 else 1
    arr_f = {"banded": 2.5, "random": 1.0}
    tough = (1/inv_t) * arr_f.get(arrangement, 1.0) if inv_t > 0 else 0
    duct = (35*F + 15*P + 8*B + 2*M + 0*Ce) / 100
    return HV, tough, duct

def blade_score(HV, tough, duct, Ce, V):
    """Multi-objective blade suitability score."""
    # Hardness: want 400-600 HV
    h_score = max(0, 1 - abs(HV - 500) / 300)
    # Toughness: want > 20 J
    t_score = min(1, tough / 30)
    # Ductility: want > 3%
    d_score = min(1, duct / 5)
    # Pattern: want cementite 5-15%
    p_score = max(0, 1 - abs(Ce - 0.10) / 0.10) * (1 + 10 * V)
    # Weighted combination
    return 0.30 * h_score + 0.25 * t_score + 0.20 * d_score + 0.25 * min(p_score, 1)

# Grid search
best_score = 0
best_config = None
results = []

for C in np.arange(0.5, 2.05, 0.1):
    for V in np.arange(0, 0.055, 0.01):
        for Mn in np.arange(0, 0.55, 0.1):
            for rate in [0.05, 0.1, 0.5, 1.0, 2.0, 5.0, 10, 50]:
                P, B, M, Ce, F = predict_phases(C, V, Mn, rate)
                HV, tough, duct = calc_props(P, B, M, Ce, F)
                score = blade_score(HV, tough, duct, Ce, V)
                results.append((C, V, Mn, rate, HV, tough, duct, Ce, score))
                if score > best_score:
                    best_score = score
                    best_config = results[-1]

print(f"=== Wootz Blade Optimisation ===")
print(f"Searched {len(results):,} configurations\\\n")

# Top 10
sorted_r = sorted(results, key=lambda r: r[8], reverse=True)
print(f"{'C%':>4} {'V%':>5} {'Mn%':>4} {'Rate':>6} {'HV':>5} {'Tough':>6} {'Duct':>5} {'Ce%':>5} {'Score':>6}")
print("-" * 48)
for r in sorted_r[:10]:
    print(f"{r[0]:>3.1f} {r[1]:>5.3f} {r[2]:>3.1f} {r[3]:>5.1f} "
          f"{r[4]:>4.0f} {r[5]:>5.1f} {r[6]:>4.1f} {r[7]:>.0%} {r[8]:>5.3f}")

b = best_config
print(f"\\\n{'='*48}")
print(f"OPTIMAL BLADE CONFIGURATION")
print(f"{'='*48}")
print(f"  Carbon:    {b[0]:.1f}%")
print(f"  Vanadium:  {b[1]:.3f}%")
print(f"  Manganese: {b[2]:.1f}%")
print(f"  Cool rate: {b[3]:.1f} °C/s")
print(f"  Hardness:  {b[4]:.0f} HV ({max(0,0.0536*b[4]-1):.0f} HRC)")
print(f"  Toughness: {b[5]:.1f} J")
print(f"  Ductility: {b[6]:.1f}%")
print(f"  Cementite: {b[7]:.0%}")
print(f"  Score:     {b[8]:.3f}")

# Historical comparison
print(f"\\\n--- Historical Wootz: 1.5%C, 0.03%V, 0.3%Mn, 0.5°C/s ---")
P,B,M,Ce,F = predict_phases(1.5, 0.03, 0.3, 0.5)
HV, tough, duct = calc_props(P,B,M,Ce,F)
hs = blade_score(HV, tough, duct, Ce, 0.03)
print(f"  HV={HV:.0f} Tough={tough:.1f} Duct={duct:.1f}% Ce={Ce:.0%} Score={hs:.3f}")
print(f"  Optimiser agrees: {abs(b[0]-1.5)<0.2 and abs(b[3]-0.5)<1}")`,
      challenge: 'Add silicon as a fourth alloy variable (0-0.5%). Silicon affects the martensite start temperature and promotes graphite formation in high-carbon steels. Does adding Si to the search space change the optimal composition? (Silicon is uncommon in historical wootz — your model should confirm this.)',
      successHint: 'You just performed a computational alloy design optimisation — the same methodology used by modern steelmakers to develop new grades. The fact that your optimiser independently arrives at a composition close to historical wootz (1.5% C, trace V, moderate Mn, slow cooling) is a powerful validation: the ancient Indian smiths really did find the optimum.',
    },
    {
      title: 'Documentation — Steel Properties Calculator project report',
      concept: `The final step is **documentation** — writing a clear, complete record of your Steel Properties Calculator. This serves three purposes:

1. **For yourself** — six months from now, you'll need to understand what you built and why
2. **For others** — collaborators, teachers, or employers need to understand your work
3. **For science** — reproducibility requires that every assumption, model, and parameter is documented

Your report should cover:
- **Introduction**: what problem does the calculator solve?
- **Model descriptions**: Alloy, HeatTreatment, Microstructure, Property Calculator
- **Validation**: does the model reproduce known results (historical wootz)?
- **Limitations**: what physics is simplified or missing?
- **Future work**: what would make it better?

This is a **technical portfolio piece** — evidence that you can design systems, implement physics models, run optimisations, and communicate results. These are the skills employers in materials science, engineering, and software development look for.

📚 *Documentation is not an afterthought — it is part of the engineering deliverable. The best code in the world is useless if nobody knows how to use it or what assumptions it makes.*`,
      analogy: 'A recipe without instructions is just a list of ingredients. Documentation transforms your code from "a list of functions" into "a tool someone can actually use." Just as a good recipe explains why you fold (not stir) the batter, good documentation explains why you chose the inverse rule of mixtures for toughness (not the parallel model).',
      storyConnection: 'The wootz recipe was lost precisely because it was NOT documented — it was transmitted orally within small family guilds. When those families stopped practising, the knowledge died with them. Your project documentation ensures that your Steel Properties Calculator will not suffer the same fate as the wootz recipe.',
      checkQuestion: 'Your model predicts that wootz at 1.5% C and 0.5°C/s cooling gives HV=470 and Toughness=30J. Historical measurements give HV≈450 and Toughness≈35J. How should you report this?',
      checkAnswer: 'Report both values with the discrepancy: "The model predicts HV=470 vs measured HV=450 (4.4% error) and Toughness=30J vs measured 35J (14% error). The hardness prediction is acceptable; the toughness is underpredicted, likely because the simplified arrangement factor does not fully capture the crack-deflection effect of banded cementite." Honest error reporting builds trust in your model.',
      codeIntro: 'Generate the full project documentation and validation report for the Steel Properties Calculator.',
      code: `# Steel Properties Calculator — Project Documentation & Validation

print("""
================================================================
        STEEL PROPERTIES CALCULATOR
            Project Documentation
================================================================

1. INTRODUCTION
---------------
This calculator predicts the mechanical properties of steel
from its alloy composition and heat treatment parameters. It
was designed to model Indian wootz steel — a legendary high-
carbon steel produced from ~300 BCE to ~1800 CE, famous for
its damask patterns and exceptional blade performance.

The calculator answers: "Given this composition and cooling
rate, what microstructure forms, and what are its properties?"

2. MODEL ARCHITECTURE
---------------------
Three classes with single responsibilities:

  Alloy         → composition, carbon equivalent, Ms temperature
  HeatTreatment → thermal cycle, quench severity classification
  Microstructure → phase fractions from CCT model

Property Calculator:
  - Hardness: rule of mixtures (parallel model)
  - Toughness: inverse rule of mixtures (series) × arrangement
  - UTS: weighted average of phase strengths
  - Ductility: weighted average of phase ductilities

3. KEY ASSUMPTIONS
------------------
  - Simplified CCT: critical rates scale with C and Mn only
  - No grain size effects (real hardness depends on grain size)
  - Arrangement factor is empirical (banded=2.5×, network=0.3×)
  - No tempering model (post-quench reheating)
  - Vanadium affects pattern quality only, not phase boundaries

4. VALIDATION
-------------
""")

import numpy as np

# Validate against known data points
known_data = [
    ("Mild steel (0.2C, normalised)", 0.2, 0, 0.5, 2.0, 150, 120, 30),
    ("Eutectoid (0.76C, air cool)",   0.76, 0, 0.3, 2.0, 280, 250, 15),
    ("Wootz (1.5C, slow cool)",       1.5, 0.03, 0.3, 0.5, 450, None, 8),
    ("Quenched 1080 (0.8C)",          0.8, 0, 0.3, 200, 650, 700, None),
]

def predict(C, V, Mn, rate):
    rate_m = 50 / (1+2*C) / (1+5*Mn)
    rate_b = 5 / (1+C) / (1+3*Mn)
    Ce = max(0, (C-0.76)/5.91*2.5) if C > 0.76 else 0
    if rate > rate_m:
        M=0.85; B=0; P=0
    elif rate > rate_b:
        f=(rate-rate_b)/(rate_m-rate_b); M=0.3*f; B=0.6*(1-f); P=0
    else:
        M=0; B=0.1; P=1-0.1-Ce
    F = max(0, (0.76-C)/0.76*0.5) if C < 0.76 else 0
    t=P+B+M+Ce+F
    if t>0: P/=t; B/=t; M/=t; Ce/=t; F/=t
    HV = 80*F+250*P+400*B+700*M+800*Ce
    return HV

print(f"{'Steel':<32} {'Predicted':>10} {'Measured':>10} {'Error':>8}")
print("-" * 62)
for name, C, V, Mn, rate, measured, alt, elong in known_data:
    predicted = predict(C, V, Mn, rate)
    if measured:
        err = abs(predicted - measured) / measured * 100
        print(f"{name:<32} {predicted:>8.0f} HV {measured:>8} HV {err:>6.0f}%")
    else:
        print(f"{name:<32} {predicted:>8.0f} HV {'N/A':>8} {'---':>6}")

print("""
5. LIMITATIONS
--------------
  - 1D cooling model — no spatial temperature gradients
  - No kinetics — phase fractions are equilibrium estimates
  - Phosphorus segregation not modelled (causes embrittlement)
  - No residual stress from quenching
  - Cementite morphology (spheroidised vs lamellar) not tracked

6. FUTURE IMPROVEMENTS
----------------------
  - Add CALPHAD-based thermodynamic calculations
  - Implement Johnson-Mehl-Avrami kinetics for phase growth
  - Model tempering (martensite decomposition on reheating)
  - Add grain size prediction (Hall-Petch hardening)
  - 2D/3D microstructure simulation using phase-field methods

7. SKILLS DEMONSTRATED
----------------------
  + Object-oriented design (three interacting classes)
  + Physical modelling (CCT, phase prediction, rule of mixtures)
  + Multi-objective optimisation (grid search, Pareto concepts)
  + Numerical computing with NumPy
  + Model validation against known data
  + Technical documentation and reporting

================================================================
        CERTIFICATE OF COMPLETION
  Indian Wootz Steel — Levels 1 through 4
  You have completed a full computational metallurgy project.
================================================================
""")`,
      challenge: 'Add a "sensitivity analysis" section: vary each input parameter by +/-10% and measure the change in predicted hardness. Which parameter has the biggest effect? (This tells you where measurement accuracy matters most — and where the model is most sensitive to errors.) Present the results as a ranked list.',
      successHint: 'You have completed a full engineering project: system design, physics modelling, optimisation, validation, and documentation. This is the exact workflow used by metallurgical engineers at steel companies, by researchers publishing in journals like Acta Materialia, and by software engineers building simulation tools. Your Steel Properties Calculator is a genuine portfolio project that demonstrates computational materials science skills.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Steel Properties Calculator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a Steel Properties Calculator for wootz blade optimisation.
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
