import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function WootzSteelLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Iron vs steel — how carbon transforms a metal',
      concept: `Pure iron is surprisingly **soft**. You can bend a wrought-iron bar with your hands if it's thin enough. But add just 0.2–2.0% carbon by weight and you get **steel** — a material that can hold a razor edge and support a skyscraper. How does such a tiny amount of carbon make such a dramatic difference?

The answer lies in **atomic packing**. Iron atoms arrange themselves in a regular crystal lattice. Carbon atoms are much smaller — small enough to squeeze into the gaps between iron atoms. Once wedged in, these interstitial carbon atoms **block the movement of dislocations** — the tiny slip-planes that allow metals to deform. More carbon → more obstacles → harder material.

But there's a trade-off. Low carbon (<0.3%) gives **mild steel**: tough, ductile, easy to weld — used for car bodies and I-beams. Medium carbon (0.3–0.6%) gives **medium steel**: stronger, used for rails and axles. High carbon (0.6–2.0%) gives **tool steel**: very hard, holds an edge, but more brittle. Above 2.0% carbon, you get **cast iron** — extremely hard but so brittle it shatters under impact.

Wootz steel sat in the sweet spot: **1.0–1.8% carbon**, giving it both hardness AND toughness. The Indian smiths controlled this balance empirically over centuries.

📚 *Hardness measures resistance to scratching or denting (Vickers scale, HV). Toughness measures energy absorbed before fracture (Joules). Engineering is about balancing both — a material that is hard but brittle is useless for a sword blade that must absorb the shock of combat.*`,
      analogy: 'Think of a jar packed with oranges (iron atoms). The oranges leave gaps between them. Now drop in some peas (carbon atoms). The peas wedge into the gaps and lock the oranges in place — the oranges can no longer slide past each other. A few peas stiffen the arrangement. Too many peas crack the jar. Steel is the sweet spot of peas-to-oranges ratio.',
      storyConnection: 'Indian smiths in the Deccan discovered that sealing iron with specific amounts of charcoal and plant matter in a clay crucible produced a steel of legendary quality. They could not measure carbon percentage, but they controlled it through precise recipes — the weight of iron, the type of wood, the size of the crucible. The result was wootz steel with 1.0–1.8% carbon, the ideal range for a blade that was both hard and resilient.',
      checkQuestion: 'Why can\'t you just keep adding more carbon to make iron harder and harder without limit?',
      checkAnswer: 'Above about 2.0% carbon, the excess carbon forms large, brittle plates of iron carbide (cementite, Fe₃C) throughout the material. These plates act as crack initiation sites — when stressed, cracks propagate along the brittle cementite plates and the material fractures catastrophically. This is cast iron: very hard in compression but shatter-prone under impact or tension. A sword made of cast iron would snap on first contact.',
      codeIntro: 'Model hardness and toughness as functions of carbon percentage.',
      code: `import numpy as np

# Carbon content range (weight percent)
carbon_pct = np.linspace(0.0, 2.5, 100)

# Hardness model (Vickers HV) — rises with carbon, flattens near 2%
# Based on empirical data for slowly cooled plain carbon steel
hardness = 80 + 350 * carbon_pct - 60 * carbon_pct**2

# Toughness model (Charpy impact energy, Joules)
# Peaks at low carbon, drops steeply as carbon increases
toughness = 200 * np.exp(-1.5 * carbon_pct) + 10

print("=== Iron-Carbon Property Map ===")
print(f"{'Carbon %':>10} {'Hardness (HV)':>15} {'Toughness (J)':>15} {'Classification'}")
print("-" * 58)

checkpoints = [0.0, 0.1, 0.3, 0.6, 1.0, 1.5, 2.0, 2.5]
for c in checkpoints:
    h = 80 + 350 * c - 60 * c**2
    t = 200 * np.exp(-1.5 * c) + 10
    if c < 0.05:
        label = "Pure iron"
    elif c < 0.3:
        label = "Mild steel"
    elif c < 0.6:
        label = "Medium steel"
    elif c <= 2.0:
        label = "High-C steel"
    else:
        label = "Cast iron"
    print(f"{c:>10.1f} {h:>15.0f} {t:>15.1f} {label:>16}")

# Wootz steel sweet spot
print(f"\
=== Wootz Steel Sweet Spot (1.0-1.8% C) ===")
wootz_c = np.linspace(1.0, 1.8, 5)
for c in wootz_c:
    h = 80 + 350 * c - 60 * c**2
    t = 200 * np.exp(-1.5 * c) + 10
    product = h * t  # combined quality metric
    print(f"  {c:.1f}% C → Hardness: {h:.0f} HV, Toughness: {t:.1f} J, H×T index: {product:.0f}")

# Optimal point (maximize hardness × toughness product)
ht_product = hardness * toughness
best_idx = np.argmax(ht_product)
best_c = carbon_pct[best_idx]
print(f"\
Optimal carbon for hardness×toughness balance: {best_c:.2f}%")
print(f"This falls squarely in the wootz steel range — the Indian")
print(f"smiths found the optimum empirically 2,000 years ago.")`,
      challenge: 'Add a third property: **weldability** (decreases linearly from 100 at 0% C to near 0 at 0.5% C). Plot all three properties on the same chart. At what carbon percentage do you lose the ability to weld? This is why modern structural steel uses low carbon — bridges must be welded.',
      successHint: 'You modelled the fundamental engineering trade-off: hardness vs toughness. Every material choice in engineering involves this kind of compromise. The genius of wootz steel was achieving both — not by magic, but by precise carbon control in the 1.0–1.8% range. The hardness×toughness product is a real metric used by materials scientists today.',
    },
    {
      title: 'Crystal lattices — where carbon atoms hide inside iron',
      concept: `Metals are not smooth blobs — they are **crystals**. Iron atoms arrange themselves in a repeating three-dimensional grid called a **lattice**. At room temperature, iron forms a **body-centred cubic** (BCC) lattice: 8 atoms at the corners of a cube, 1 atom in the centre. Each unit cell is only 0.287 nm (nanometres) across — about 350,000 cells lined up would span a human hair.

The BCC lattice has **interstitial sites** — tiny gaps between atoms where smaller atoms can fit. Carbon atoms (radius 0.077 nm) are small enough to squeeze into these gaps, but just barely. The carbon atom is actually slightly too large for a perfect fit, so it **distorts** the surrounding iron atoms, pushing them apart. This local distortion is exactly what blocks dislocations and hardens the steel.

Above 912°C, iron transforms to a different structure: **face-centred cubic** (FCC), called **austenite**. FCC has larger interstitial sites, so it can dissolve much more carbon — up to 2.14% vs only 0.022% for BCC ferrite. This is critical: the wootz crucible was heated above 912°C so the iron could absorb carbon, then slowly cooled so the carbon was forced out into specific microstructures.

📚 *Interstitial means "in the spaces between." Substitutional means replacing an atom in the lattice with a different one (like chromium replacing iron in stainless steel). Carbon is interstitial because it's small enough to fit in the gaps.*`,
      analogy: 'Imagine a room full of footballs stacked in a neat grid (iron atoms in BCC). There are tiny triangular gaps between the footballs. Now try to push a tennis ball (carbon atom) into one of those gaps. It fits, but only by pushing the surrounding footballs apart slightly. That distortion — the footballs bulging outward — is what makes the whole stack harder to shift. Heat the room and the footballs rearrange into a looser stack (FCC/austenite) with bigger gaps — now the tennis ball fits comfortably and many more tennis balls can squeeze in.',
      storyConnection: 'The wootz crucible was heated to 1200–1300°C — well above the 912°C BCC→FCC transition. At this temperature, iron is in the austenite (FCC) phase and can absorb up to 2% carbon from the charcoal sealed inside. When the crucible cooled slowly over days, the iron transformed back to BCC — but now it contained far more carbon than BCC can hold at room temperature. The excess carbon was forced to precipitate out, forming the cementite bands that gave Damascus steel its famous watered pattern.',
      checkQuestion: 'BCC iron can dissolve at most 0.022% carbon. FCC iron can dissolve up to 2.14%. Why the huge difference?',
      checkAnswer: 'The FCC lattice has larger octahedral interstitial sites (0.052 nm radius) compared to BCC\'s largest sites (0.036 nm radius). Since a carbon atom has radius 0.077 nm, it causes less distortion in the larger FCC gaps and is therefore more energetically stable there. More sites + less strain energy = 100× more carbon solubility.',
      codeIntro: 'Calculate interstitial site sizes in BCC and FCC iron and compare with the carbon atom radius.',
      code: `import numpy as np

# Iron atom radius
r_Fe = 0.126  # nm (iron atomic radius)
r_C = 0.077   # nm (carbon atomic radius)

# BCC lattice parameter: a = 4r / sqrt(3)
a_bcc = 4 * r_Fe / np.sqrt(3)

# FCC lattice parameter: a = 2 * sqrt(2) * r
a_fcc = 2 * np.sqrt(2) * r_Fe

print("=== Iron Crystal Structures ===")
print(f"Iron atomic radius: {r_Fe} nm")
print(f"Carbon atomic radius: {r_C} nm\
")

# BCC analysis
print("--- BCC (Body-Centred Cubic) — Ferrite (α-iron) ---")
print(f"Lattice parameter: {a_bcc:.4f} nm")
atoms_per_bcc = 8 * (1/8) + 1  # 8 corners × 1/8 + 1 centre
print(f"Atoms per unit cell: {atoms_per_bcc:.0f}")

# BCC octahedral interstitial site radius
r_oct_bcc = (a_bcc / 2) - r_Fe
# BCC tetrahedral interstitial site radius
r_tet_bcc = (a_bcc * np.sqrt(5) / 4) - r_Fe

print(f"Octahedral site radius: {r_oct_bcc:.4f} nm")
print(f"Tetrahedral site radius: {r_tet_bcc:.4f} nm")
print(f"Carbon atom radius: {r_C:.4f} nm")
print(f"Misfit in oct site: {((r_C - r_oct_bcc)/r_oct_bcc)*100:.1f}% (carbon is TOO BIG)")

# FCC analysis
print(f"\
--- FCC (Face-Centred Cubic) — Austenite (γ-iron) ---")
print(f"Lattice parameter: {a_fcc:.4f} nm")
atoms_per_fcc = 8 * (1/8) + 6 * (1/2)  # 8 corners + 6 faces
print(f"Atoms per unit cell: {atoms_per_fcc:.0f}")

# FCC octahedral interstitial site radius
r_oct_fcc = (a_fcc / 2) - r_Fe
# FCC tetrahedral interstitial site radius
r_tet_fcc = (a_fcc * np.sqrt(3) / 4) - r_Fe

print(f"Octahedral site radius: {r_oct_fcc:.4f} nm")
print(f"Tetrahedral site radius: {r_tet_fcc:.4f} nm")
print(f"Carbon atom radius: {r_C:.4f} nm")
print(f"Misfit in oct site: {((r_C - r_oct_fcc)/r_oct_fcc)*100:.1f}% (still too big, but LESS strain)")

# Solubility comparison
print(f"\
=== Carbon Solubility Comparison ===")
print(f"BCC (ferrite) max carbon: 0.022 wt% at 727°C")
print(f"FCC (austenite) max carbon: 2.14 wt% at 1147°C")
print(f"Ratio: {2.14/0.022:.0f}× more carbon in FCC")
print(f"\
Why? Larger interstitial sites → less lattice strain")
print(f"→ lower energy penalty → more carbon dissolves.")
print(f"\
Wootz crucible at 1200°C: iron is FCC, absorbs ~1.5% C")
print(f"Slow cooling to room temp: iron reverts to BCC (max 0.022% C)")
print(f"Excess carbon MUST go somewhere → forms Fe₃C (cementite) bands")
print(f"These cementite bands = the famous Damascus pattern")`,
      challenge: 'Calculate the packing efficiency of BCC vs FCC lattices. Packing efficiency = (volume of atoms / volume of unit cell) × 100%. FCC should be denser. This explains why iron contracts when heated through 912°C — the FCC phase is more tightly packed despite having bigger interstitial sites.',
      successHint: 'You calculated real interstitial site sizes from first principles using nothing but atomic radii and geometry. The mismatch between carbon\'s radius and the available gap is the physical origin of steel\'s hardness. Materials science is applied geometry at the atomic scale — the wootz smiths mastered the consequences of these numbers without ever seeing an atom.',
    },
    {
      title: 'Phase diagrams — predicting microstructure from temperature and composition',
      concept: `The **iron-carbon phase diagram** is the single most important chart in metallurgy. It tells you exactly what microstructure a steel will have at any combination of temperature and carbon content — if cooled slowly enough to reach equilibrium.

The key regions: **Ferrite** (α) is nearly pure BCC iron — soft, magnetic, ductile. **Austenite** (γ) is FCC iron with dissolved carbon — stable only above 727°C. **Cementite** (Fe₃C) is iron carbide — extremely hard and brittle, contains 6.67% carbon. **Pearlite** is a layered mix of ferrite + cementite that forms at 727°C — the layers are only 0.1–1 μm thick and give steel its strength.

Critical temperatures: The **eutectoid** point is at 727°C and 0.76% carbon — here, austenite transforms directly into pearlite (alternating ferrite + cementite layers). Below 0.76% C (**hypoeutectoid**), you get ferrite + pearlite. Above 0.76% C (**hypereutectoid**), you get cementite + pearlite.

Wootz steel at 1.5% carbon is **hypereutectoid** — it contains more carbon than the eutectoid composition. On slow cooling, cementite precipitates first along the austenite grain boundaries, forming a network. Then the remaining austenite transforms to pearlite. The cementite network creates the visible bands in Damascus steel.

📚 *A phase diagram is like a weather map for materials — instead of predicting rain vs sun from temperature and humidity, it predicts ferrite vs austenite from temperature and carbon content.*`,
      analogy: 'Imagine a lake in winter. Above 0°C: all liquid water. Below 0°C: ice forms. At exactly 0°C: ice and water coexist. Now add salt to the lake — the freezing point drops. A phase diagram maps these transitions: temperature on one axis, composition on the other, and regions showing what phases exist. The iron-carbon diagram does the same thing but for solid phases of steel.',
      storyConnection: 'The wootz crucible was cooled over 2–4 days — extremely slowly by modern standards. This slow cooling allowed the steel to follow the equilibrium path on the phase diagram: first cementite precipitating from austenite, then pearlite forming at 727°C. If the smiths had cooled quickly (quenching), they would have gotten martensite instead — hard but brittle and without the beautiful banded pattern. Their patience was the key.',
      checkQuestion: 'Wootz steel has 1.5% carbon. As it cools from 1200°C, what is the FIRST new phase to appear?',
      checkAnswer: 'Cementite (Fe₃C). Since 1.5% is above the eutectoid composition (0.76%), this is hypereutectoid steel. On cooling, the first phase to precipitate from austenite is cementite, which forms along austenite grain boundaries. This happens at the Acm line, around 1000°C for 1.5% C. The remaining austenite continues to cool until 727°C, where it transforms to pearlite.',
      codeIntro: 'Map the iron-carbon phase diagram and predict microstructure for wootz steel.',
      code: `import numpy as np

# Key points on the iron-carbon phase diagram (simplified)
# Temperature boundaries as functions of carbon content

def A3_line(c):
    """Upper critical temperature for hypoeutectoid steel (ferrite boundary)"""
    # Linear approximation: 912°C at 0%C → 727°C at 0.76%C
    return 912 - (912 - 727) * (c / 0.76)

def Acm_line(c):
    """Cementite dissolution line for hypereutectoid steel"""
    # Approximately: 727°C at 0.76%C → 1147°C at 2.14%C
    return 727 + (1147 - 727) * ((c - 0.76) / (2.14 - 0.76))

# Eutectoid temperature
T_eutectoid = 727  # °C
C_eutectoid = 0.76  # wt%

print("=== Iron-Carbon Phase Diagram Analysis ===\
")

# Predict microstructure at room temperature (slow cooling)
def predict_microstructure(carbon_pct):
    if carbon_pct < 0.022:
        return "Ferrite (nearly pure iron)", 0, 100
    elif carbon_pct <= 0.76:
        # Hypoeutectoid: ferrite + pearlite
        f_pearlite = (carbon_pct - 0.022) / (0.76 - 0.022) * 100
        f_ferrite = 100 - f_pearlite
        return f"Ferrite + Pearlite", f_ferrite, f_pearlite
    elif carbon_pct <= 2.14:
        # Hypereutectoid: pearlite + cementite network
        f_cementite = (carbon_pct - 0.76) / (6.67 - 0.76) * 100
        f_pearlite = 100 - f_cementite
        return f"Pearlite + Cementite", f_pearlite, f_cementite
    else:
        return "Cast iron (excess cementite)", 0, 0

print(f"{'Carbon %':>10} {'Microstructure':<30} {'Phase 1 %':>10} {'Phase 2 %':>10}")
print("-" * 64)

test_carbons = [0.01, 0.1, 0.3, 0.5, 0.76, 1.0, 1.5, 2.0]
for c in test_carbons:
    structure, p1, p2 = predict_microstructure(c)
    print(f"{c:>10.2f} {structure:<30} {p1:>10.1f} {p2:>10.1f}")

# Wootz steel analysis
print(f"\
=== Wootz Steel (1.5% C) Cooling Path ===")
wootz_c = 1.5
T_start = 1200  # °C (crucible temperature)
T_Acm = Acm_line(wootz_c)

print(f"Starting temperature: {T_start}°C (all austenite, FCC)")
print(f"Acm temperature: {T_Acm:.0f}°C — cementite begins to precipitate")
print(f"Eutectoid temperature: {T_eutectoid}°C — remaining austenite → pearlite")

# Lever rule: fraction of cementite at just above 727°C
f_cem = (wootz_c - C_eutectoid) / (6.67 - C_eutectoid) * 100
f_pearlite = 100 - f_cem

print(f"\
Final microstructure (lever rule):")
print(f"  Cementite (Fe₃C): {f_cem:.1f}%  — hard, brittle carbide bands")
print(f"  Pearlite:          {f_pearlite:.1f}% — layered ferrite+cementite")
print(f"\
The cementite network along grain boundaries creates")
print(f"the visible banded pattern known as 'Damascus' or 'watered' steel.")
print(f"\
Estimated hardness: ~350-400 HV (Vickers)")
print(f"This is hard enough to cut softer steels, yet tough enough")
print(f"for a sword blade — the ideal wootz combination.")`,
      challenge: 'For a hypoeutectoid steel with 0.4% carbon, use the lever rule to calculate the exact percentages of ferrite and pearlite at room temperature. Then calculate for 0.76% (eutectoid — what percentage is pearlite?). Verify that at 0.76%, you get 100% pearlite — this is the eutectoid point where the phase diagram predicts a single transformation.',
      successHint: 'You used the iron-carbon phase diagram to predict the exact microstructure of wootz steel from its composition alone. This diagram — first mapped experimentally by Roberts-Austen in 1897 — explains what the Indian smiths had discovered empirically: 1.5% carbon cooled slowly produces the ideal combination of hard cementite bands in a tough pearlite matrix. The phase diagram is the Rosetta Stone of metallurgy.',
    },
    {
      title: 'Cooling rate effects — pearlite vs martensite',
      concept: `The phase diagram tells you what happens at **equilibrium** — infinitely slow cooling. Real cooling is never infinitely slow, and cooling rate changes EVERYTHING.

**Slow cooling** (furnace cooling, ~1°C/min): atoms have time to diffuse. Austenite decomposes into **pearlite** — alternating layers of ferrite and cementite, each layer ~0.2 μm thick. Pearlite is moderately hard (~300 HV) and reasonably tough.

**Fast cooling** (quenching in water, ~1000°C/s): atoms are frozen in place. Carbon atoms are **trapped** inside the iron lattice — they cannot diffuse out to form cementite. The FCC austenite tries to transform to BCC, but the trapped carbon distorts the lattice into a strained **body-centred tetragonal** (BCT) structure. This is **martensite** — the hardest microstructure in steel (~700+ HV) but extremely brittle.

**Medium cooling** (oil quench, air cool): produces intermediate structures — **bainite** (fine needles of ferrite + carbide, ~400–550 HV) or **fine pearlite** (thinner layers = harder).

The wootz process used very slow cooling (2–4 days in an insulated furnace). This produced **coarse pearlite** with a distinct cementite network — the watered pattern. The smiths did NOT quench the ingot; they forged it at lower temperatures and used careful reheating cycles instead. The slow cooling was essential for the pattern and the unique combination of properties.

📚 *The cooling rate diagram is called a TTT (Time-Temperature-Transformation) or CCT (Continuous Cooling Transformation) diagram. It's the dynamic counterpart to the static phase diagram.*`,
      analogy: 'Imagine a crowded room where everyone must rearrange from standing (austenite) to sitting in assigned seats (ferrite + cementite). If you give them 10 minutes (slow cool), everyone walks calmly to their seat — neat rows, orderly arrangement (pearlite). If you yell "SIT NOW!" and give them 1 second (quench), everyone drops where they stand — a chaotic, stressed tangle of bodies (martensite). Same people, same room, vastly different arrangement — all because of time.',
      storyConnection: 'Medieval European smiths who obtained wootz ingots from India tried to improve the steel by quenching it in water — a standard European hardening technique. But quenching destroyed the watered pattern and often cracked the blade. The wootz pattern required slow cooling to form, and the smiths who understood this (in India) produced far superior blades to those who did not (in Europe, initially). The secret was patience, not force.',
      checkQuestion: 'If martensite is the hardest phase, why didn\'t wootz smiths just quench the steel?',
      checkAnswer: 'Martensite at 1.5% carbon is so brittle it cracks during quenching — the internal stresses from the trapped carbon exceed the material\'s fracture toughness. Even if it survived quenching, a 1.5% carbon martensite blade would shatter on first impact. The wootz approach traded some hardness for much greater toughness by using slow cooling to produce pearlite + cementite. Modern high-carbon tools ARE quenched, but they must be immediately tempered (reheated to 150–300°C) to relieve stress — a step that reduces hardness but prevents shattering.',
      codeIntro: 'Model hardness as a function of cooling rate for wootz steel.',
      code: `import numpy as np

# Cooling rates (°C per second) on a log scale
cooling_rates = np.logspace(-2, 4, 200)  # 0.01 to 10000 °C/s

# Simplified model for 1.5% carbon steel
# Based on CCT diagram behaviour

def microstructure(cooling_rate):
    """Predict microstructure and hardness from cooling rate."""
    if cooling_rate < 0.1:
        # Very slow: coarse pearlite + cementite network
        hardness = 250 + 50 * np.log10(cooling_rate + 0.01)
        hardness = max(200, hardness)
        return "Coarse pearlite + cementite", hardness
    elif cooling_rate < 1:
        # Slow: fine pearlite + cementite
        hardness = 280 + 40 * np.log10(cooling_rate + 1)
        return "Fine pearlite + cementite", hardness
    elif cooling_rate < 10:
        # Medium: bainite
        hardness = 350 + 80 * np.log10(cooling_rate)
        return "Bainite", hardness
    elif cooling_rate < 100:
        # Fast: mixed bainite + martensite
        frac_mart = (np.log10(cooling_rate) - 1) / 1.0
        hardness = 450 + 250 * frac_mart
        return "Bainite + martensite", hardness
    else:
        # Very fast: full martensite
        hardness = 750 + 30 * np.log10(cooling_rate / 100)
        return "Martensite", min(hardness, 850)

print("=== Cooling Rate vs Microstructure (1.5% C Wootz Steel) ===")
print(f"{'Rate (°C/s)':>12} {'Microstructure':<30} {'Hardness (HV)':>14} {'Brittle?'}")
print("-" * 68)

test_rates = [0.01, 0.05, 0.1, 0.5, 1, 5, 10, 50, 100, 500, 5000]
for rate in test_rates:
    phase, hv = microstructure(rate)
    brittle = "YES ⚠️" if hv > 500 else "moderate" if hv > 350 else "no"
    print(f"{rate:>12.2f} {phase:<30} {hv:>14.0f} {brittle:>8}")

# Wootz crucible cooling
print(f"\
=== Wootz Crucible Cooling ===")
crucible_time_hours = 48  # 2 days
temp_drop = 1200 - 25     # °C
wootz_rate = temp_drop / (crucible_time_hours * 3600)  # °C/s
phase, hv = microstructure(wootz_rate)

print(f"Cooling time: {crucible_time_hours} hours")
print(f"Temperature drop: {temp_drop}°C")
print(f"Average cooling rate: {wootz_rate:.4f} °C/s")
print(f"Microstructure: {phase}")
print(f"Hardness: {hv:.0f} HV")

# Compare: modern water quench
print(f"\
=== Modern Water Quench ===")
quench_rate = 1000  # °C/s
phase_q, hv_q = microstructure(quench_rate)
print(f"Cooling rate: {quench_rate} °C/s")
print(f"Microstructure: {phase_q}")
print(f"Hardness: {hv_q:.0f} HV")
print(f"BUT: at 1.5% C, martensite is so strained it CRACKS.")
print(f"Internal stress exceeds fracture toughness.")
print(f"\
The wootz smiths' slow cooling was not primitive —")
print(f"it was the ONLY way to get a usable blade at 1.5% carbon.")
print(f"Modern metallurgy confirms their empirical wisdom.")`,
      challenge: 'Modern tool steel (e.g., a chisel at 0.8% C) IS quenched to martensite, then tempered at 200°C for 1 hour to reduce hardness from ~800 HV to ~600 HV. Model tempering: hardness drops as H = H_quenched × exp(-k × T_temper / 1000) where k ≈ 0.5. Print a table of tempering temperatures (100–500°C) and resulting hardness. At what temperature does the steel become too soft for a cutting tool (<400 HV)?',
      successHint: 'You discovered that cooling rate is as important as composition in determining steel properties. The same 1.5% carbon steel can be anything from soft pearlite (250 HV) to rock-hard martensite (800 HV). The wootz smiths controlled cooling rate by controlling furnace insulation — thicker clay crucible walls = slower cooling = the specific microstructure that produced the Damascus pattern. Metallurgy is as much about process as about chemistry.',
    },
    {
      title: 'The crucible process — simulating the sealed reaction',
      concept: `The wootz process was a **sealed crucible** reaction. Indian smiths packed wrought iron, charcoal, and sometimes glass or plant matter into a small clay crucible (~10 cm tall), sealed it with clay, and heated it in a charcoal furnace for hours. The sealed environment was critical — it created a **reducing atmosphere** (low oxygen) inside the crucible.

Here is what happens step by step. First (0–4 hours): the furnace heats the crucible to **~1200°C**. Iron transforms from BCC ferrite to FCC austenite at 912°C. Second (4–8 hours): charcoal reacts with any residual oxygen to form CO, creating a reducing atmosphere. The CO reacts with iron oxide on the surface: **FeO + CO → Fe + CO₂**. Third (8–16 hours): carbon **dissolves** into the austenite. The rate is controlled by diffusion — carbon atoms must migrate from the charcoal surface through the bulk iron. At 1200°C, carbon diffusivity in austenite is ~2×10⁻¹¹ m²/s. For a 1 cm iron piece, diffusion takes roughly L²/D = (0.01)²/(2×10⁻¹¹) ≈ 5×10⁶ seconds ≈ 58 days for FULL homogenisation. But the crucible only needs 1–2% carbon — so partial dissolution over 8+ hours is sufficient.

Finally (16–48 hours): the furnace is allowed to cool slowly. The carbon-enriched iron solidifies and the cementite bands form.

📚 *Diffusion distance scales as √(D×t): doubling the time only increases penetration by √2 ≈ 1.4×. This square-root law governs many natural processes — perfume spreading, ink in water, and carbon dissolving in iron.*`,
      analogy: 'Think of a tea bag in hot water. At room temperature, the tea barely colours the water — diffusion is slow. In boiling water, the colour spreads rapidly — high temperature dramatically increases diffusion rate. The crucible is the teapot: the iron is the water, the charcoal is the tea bag, and the high temperature drives the carbon "flavour" into the iron. The sealed lid keeps the atmosphere controlled, just as a teapot lid keeps the steam in.',
      storyConnection: 'Archaeological analysis of wootz crucibles found in the Deccan region of India (modern Karnataka/Tamil Nadu) shows they were heated in pit furnaces using bellows to reach 1200°C+. The crucibles were about the size of a fist — small enough to heat uniformly but large enough to produce a ~1 kg ingot (called a "cake" or "puck"). The glass or plant matter sealed any cracks and created a flux that removed impurities. Each crucible was single-use — cracked open to retrieve the steel cake inside.',
      checkQuestion: 'If carbon diffusivity doubles for every ~100°C increase in temperature, why not heat to 1500°C to speed up the process?',
      checkAnswer: 'At 1500°C, the iron would start to melt (the solidus for 1.5% C steel is about 1350°C). Partial melting would destroy the controlled microstructure. Also, the clay crucible itself would soften and fail above ~1300°C. The 1200°C target was the sweet spot: hot enough for reasonable diffusion rates, cool enough to keep everything solid and the crucible intact. Temperature control was the master skill of wootz production.',
      codeIntro: 'Simulate carbon diffusion into iron in the wootz crucible over time.',
      code: `import numpy as np

# Physical constants for carbon diffusion in austenite (FCC iron)
D0 = 2.3e-5      # pre-exponential factor (m²/s)
Q = 148000        # activation energy (J/mol)
R = 8.314         # gas constant (J/mol·K)

def diffusivity(T_celsius):
    """Arrhenius equation for carbon diffusivity in austenite."""
    T_K = T_celsius + 273.15
    return D0 * np.exp(-Q / (R * T_K))

# Temperature profile of the crucible (simplified)
print("=== Carbon Diffusivity vs Temperature ===")
print(f"{'Temp (°C)':>10} {'D (m²/s)':>14} {'√(Dt) for 8h (mm)':>20}")
print("-" * 48)

for T in [800, 900, 1000, 1100, 1200, 1300]:
    D = diffusivity(T)
    # Diffusion distance in 8 hours
    t = 8 * 3600  # seconds
    x = np.sqrt(D * t) * 1000  # mm
    print(f"{T:>10} {D:>14.2e} {x:>20.2f}")

# Full crucible simulation
print(f"\
=== Wootz Crucible Simulation ===")
T_crucible = 1200  # °C
D_1200 = diffusivity(T_crucible)
print(f"Temperature: {T_crucible}°C")
print(f"Diffusivity: {D_1200:.2e} m²/s")

# 1D diffusion into a slab (semi-infinite approximation)
# C(x,t) = C_surface * erfc(x / (2*sqrt(D*t)))
# where erfc is the complementary error function

from math import erfc

C_surface = 2.0  # wt% carbon at iron-charcoal interface
iron_radius = 5e-3  # 5 mm radius of iron piece

print(f"\
Carbon profile after different times:")
print(f"Surface carbon: {C_surface}% (set by charcoal contact)")
print(f"Iron piece radius: {iron_radius*1000:.0f} mm\
")

times_hours = [1, 2, 4, 8, 12, 16]
positions_mm = [0, 0.5, 1.0, 2.0, 3.0, 4.0, 5.0]

print(f"{'':>8}", end="")
for x in positions_mm:
    print(f"  {x:>5.1f}mm", end="")
print("  (depth from surface)")
print("-" * 68)

for t_hr in times_hours:
    t = t_hr * 3600
    print(f"{t_hr:>5.0f} hr:", end="")
    for x_mm in positions_mm:
        x = x_mm / 1000  # convert to metres
        C = C_surface * erfc(x / (2 * np.sqrt(D_1200 * t)))
        print(f"  {C:>5.2f}%", end="")
    print()

# Average carbon after 12 hours
t_final = 12 * 3600
depths = np.linspace(0, iron_radius, 50)
carbons = [C_surface * erfc(d / (2 * np.sqrt(D_1200 * t_final))) for d in depths]
avg_C = np.mean(carbons)

print(f"\
After 12 hours at {T_crucible}°C:")
print(f"  Average carbon content: {avg_C:.2f} wt%")
print(f"  Centre carbon: {carbons[-1]:.2f} wt%")
print(f"  Surface carbon: {carbons[0]:.2f} wt%")
print(f"\
The gradient from surface to centre explains why wootz")
print(f"ingots had slightly inhomogeneous carbon — which actually")
print(f"HELPED form the banded cementite pattern during slow cooling.")`,
      challenge: 'Double the iron piece radius to 10 mm and recalculate. How much longer does it take to reach the same average carbon content? Remember: diffusion distance scales as √t, so doubling the distance requires 4× the time. Verify this numerically.',
      successHint: 'You simulated the actual physics of the wootz crucible process — carbon diffusion governed by the Arrhenius equation and Fick\'s second law. The Indian smiths controlled this process through empirical recipes (size of iron, amount of charcoal, furnace time), achieving remarkably consistent results. Modern diffusion calculations confirm that their typical 8–16 hour cycles at 1200°C produced exactly the 1.0–1.8% carbon content measured in archaeological wootz samples.',
    },
    {
      title: 'Nanostructures — carbon nanotubes in ancient steel',
      concept: `In 2006, researchers at the Technical University of Dresden made a stunning discovery. Using high-resolution transmission electron microscopy on a genuine Damascus steel blade, they found **carbon nanotubes** and **cementite nanowires** embedded in the steel matrix. Carbon nanotubes — structures not "invented" until 1991 — had been forming spontaneously in wootz steel for over 2,000 years.

How? Wootz steel contained trace amounts of **vanadium** (V), **molybdenum** (Mo), and other elements from the specific iron ores used in southern India. During the slow cooling of the crucible, these trace elements acted as **catalysts** — they provided nucleation sites where carbon atoms assembled into tubular structures instead of simply forming flat cementite plates.

A carbon nanotube is a sheet of graphene rolled into a cylinder, typically 1–50 nm in diameter. Despite being made of the same element as pencil graphite, nanotubes have extraordinary properties: **tensile strength of ~60 GPa** (vs ~0.5 GPa for bulk steel), **electrical conductivity** comparable to copper, and **thermal conductivity** higher than diamond.

The nanotubes in wootz steel were encapsulated inside cementite nanowires, forming a composite nanostructure that may have contributed to the steel's legendary sharpness and ability to hold an edge. The cementite nanowires aligned along the forging direction, creating the visible "watering" pattern at the macro scale.

📚 *A nanometre is 10⁻⁹ m — about 100,000× smaller than a human hair. Nanotechnology manipulates matter at this scale. The wootz smiths produced nanoscale structures without knowing it, through chemistry that happened to create the right conditions for self-assembly.*`,
      analogy: 'Imagine rolling a sheet of chicken wire into a tube. Flat chicken wire is floppy — easy to bend and tear. But once rolled into a tube, it becomes remarkably rigid and strong. Carbon nanotubes work the same way: a flat sheet of carbon atoms (graphene) is weak in one direction, but rolled into a tube, the geometry distributes forces evenly around the circumference, creating one of the strongest structures known. The vanadium atoms in wootz steel acted like tiny jigs that helped the carbon sheet curl into tubes during cooling.',
      storyConnection: 'When 19th-century European metallurgists tried to reproduce Damascus steel, they failed — even when they matched the carbon content exactly. The missing ingredient was the specific trace element profile of Indian iron ore: vanadium, molybdenum, chromium, and manganese in particular ratios. These trace elements, present at levels below 0.1%, catalysed the nanotube formation that made wootz unique. The "recipe" was not just iron + carbon — it was iron + carbon + the geological fingerprint of Deccan ore.',
      checkQuestion: 'If carbon nanotubes are 100× stronger than steel, why don\'t we just make everything out of nanotubes?',
      checkAnswer: 'Three problems. First, we can only make nanotubes in tiny quantities — a few grams at a time, at enormous cost ($30–300 per gram vs $0.50/kg for steel). Second, individual nanotubes are nanoscale — assembling them into a macroscale structure (a beam, a plate) while preserving their properties is an unsolved manufacturing challenge. Third, nanotubes are strong in tension along their axis but weak in other directions. Engineering requires materials that perform in all directions. Bulk steel is weaker per atom but available by the megaton and strong in all orientations.',
      codeIntro: 'Compare carbon nanotube properties with bulk steel and model the effect of trace elements.',
      code: `import numpy as np

# Material properties comparison
materials = {
    "Bulk iron": {
        "tensile_strength_GPa": 0.25,
        "density_kg_m3": 7874,
        "youngs_modulus_GPa": 210,
        "thermal_cond_W_mK": 80,
    },
    "Wootz steel": {
        "tensile_strength_GPa": 0.80,
        "density_kg_m3": 7850,
        "youngs_modulus_GPa": 220,
        "thermal_cond_W_mK": 50,
    },
    "Modern high-C steel": {
        "tensile_strength_GPa": 1.20,
        "density_kg_m3": 7840,
        "youngs_modulus_GPa": 210,
        "thermal_cond_W_mK": 45,
    },
    "Carbon nanotube": {
        "tensile_strength_GPa": 60.0,
        "density_kg_m3": 1300,
        "youngs_modulus_GPa": 1000,
        "thermal_cond_W_mK": 3500,
    },
    "Cementite (Fe₃C)": {
        "tensile_strength_GPa": 0.05,
        "density_kg_m3": 7690,
        "youngs_modulus_GPa": 200,
        "thermal_cond_W_mK": 8,
    },
}

print("=== Materials Property Comparison ===\
")
print(f"{'Material':<22} {'σ (GPa)':>9} {'ρ (kg/m³)':>10} {'E (GPa)':>9} {'k (W/mK)':>10}")
print("-" * 64)

for name, props in materials.items():
    print(f"{name:<22} {props['tensile_strength_GPa']:>9.2f} "
          f"{props['density_kg_m3']:>10} {props['youngs_modulus_GPa']:>9} "
          f"{props['thermal_cond_W_mK']:>10}")

# Specific strength (strength-to-weight ratio)
print(f"\
=== Specific Strength (σ/ρ) — strength per unit mass ===")
print(f"{'Material':<22} {'σ/ρ (kN·m/kg)':>15}")
print("-" * 40)
for name, props in materials.items():
    specific = props['tensile_strength_GPa'] * 1e9 / props['density_kg_m3'] / 1000
    print(f"{name:<22} {specific:>15.1f}")

# Trace element catalysis model
print(f"\
=== Trace Elements in Wootz Steel ===")
print(f"These elements catalyse carbon nanotube formation:\
")

trace_elements = {
    "Vanadium (V)": {"ppm": 400, "role": "Primary CNT catalyst, forms VC nucleation sites"},
    "Molybdenum (Mo)": {"ppm": 200, "role": "Stabilises cementite nanowires"},
    "Chromium (Cr)": {"ppm": 300, "role": "Grain boundary segregation, aids banding"},
    "Manganese (Mn)": {"ppm": 500, "role": "Deoxidiser, improves hot workability"},
    "Phosphorus (P)": {"ppm": 150, "role": "Segregates to bands, enhances pattern visibility"},
}

total_trace_ppm = 0
for elem, data in trace_elements.items():
    print(f"  {elem:<20} {data['ppm']:>5} ppm  — {data['role']}")
    total_trace_ppm += data['ppm']

print(f"\
  Total trace elements: {total_trace_ppm} ppm = {total_trace_ppm/10000:.2f}%")
print(f"  Less than 0.2% of the steel by weight — yet absolutely critical.")

# CNT reinforcement estimate (rule of mixtures)
print(f"\
=== Composite Strength Estimate (Rule of Mixtures) ===")
cnt_volume_fractions = [0.0001, 0.001, 0.005, 0.01, 0.05]
steel_strength = 0.80  # GPa (wootz matrix)
cnt_strength = 60.0    # GPa

print(f"{'CNT vol%':>10} {'Composite σ (GPa)':>18} {'Improvement':>12}")
print("-" * 44)
for vf in cnt_volume_fractions:
    composite = (1 - vf) * steel_strength + vf * cnt_strength
    improvement = (composite - steel_strength) / steel_strength * 100
    print(f"{vf*100:>10.3f} {composite:>18.3f} {improvement:>11.1f}%")

print(f"\
Even 0.01% CNTs by volume adds ~6% strength.")
print(f"More importantly, CNTs at crack tips RESIST crack propagation,")
print(f"dramatically improving fracture toughness — the key to a blade")
print(f"that is both hard AND resilient.")
print(f"\
The Indian smiths unknowingly created a NANOCOMPOSITE —")
print(f"a material that modern engineers are still learning to replicate.")`,
      challenge: 'The Halpin-Tsai equation gives a better estimate than rule-of-mixtures for short-fibre composites: E_composite = E_matrix × (1 + ξηVf)/(1 - ηVf) where η = (E_fibre/E_matrix - 1)/(E_fibre/E_matrix + ξ) and ξ ≈ 2 for randomly oriented short fibres. Calculate E_composite for wootz steel with 0.01% CNT volume fraction using E_matrix = 220 GPa and E_fibre = 1000 GPa. Compare with the rule-of-mixtures estimate.',
      successHint: 'You explored the nanostructures hidden inside ancient wootz steel — carbon nanotubes and cementite nanowires formed through trace-element catalysis during slow crucible cooling. This is one of the most remarkable convergences in the history of technology: a process developed 2,000 years ago in southern India inadvertently produced nanoscale structures that modern science only identified in the 21st century. The lesson is humbling — nature and human ingenuity can achieve at the bench what takes science centuries to explain at the blackboard.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Metallurgy, crystallography, and nanotechnology through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model iron-carbon metallurgy, crystal structures, phase transformations, diffusion kinetics, and nanoscale composites.
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
