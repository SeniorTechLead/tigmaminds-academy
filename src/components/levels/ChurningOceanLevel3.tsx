import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import ChurningIntermolecularDiagram from '../diagrams/ChurningIntermolecularDiagram';
import ChurningColloidDiagram from '../diagrams/ChurningColloidDiagram';
import PHScaleDiagram from '../diagrams/PHScaleDiagram';
import PhaseChangeDiagram from '../diagrams/PhaseChangeDiagram';
import ChurningChromatographyDiagram from '../diagrams/ChurningChromatographyDiagram';
import ChurningMassSpecDiagram from '../diagrams/ChurningMassSpecDiagram';

export default function ChurningOceanLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Intermolecular forces — Van der Waals, dipoles, and hydrogen bonds',
      concept: `In Level 2 we learned that polarity determines mixing. Now let's quantify the forces between molecules. There are three main types, from weakest to strongest:

**1. London dispersion (Van der Waals)**: Present in ALL molecules. Caused by temporary fluctuations in electron clouds that create momentary dipoles. Strength increases with molecular size.

**2. Dipole-dipole**: Between polar molecules with permanent charge separation. The positive end of one attracts the negative end of another. ~5× stronger than London forces.

**3. Hydrogen bonds**: A special, strong dipole-dipole force. Occurs when H is bonded to O, N, or F (very electronegative atoms). ~4× stronger than regular dipole-dipole.

These forces explain nearly everything about liquids:
- Why water boils at 100°C but methane (similar mass) boils at -161°C → water has H-bonds
- Why oil is viscous → large London forces between long chains
- Why salt dissolves in water → ion-dipole forces

The code calculates and compares intermolecular force strengths for different molecule pairs using the Lennard-Jones potential: \`E = 4*epsilon * [(sigma/r)^12 - (sigma/r)^6]\``,
      analogy: 'Imagine three types of handshakes. A London force is a limp handshake between strangers — brief and weak, but everyone does it. A dipole-dipole force is a firm handshake between acquaintances — real grip, real attraction. A hydrogen bond is a bear hug between close friends — strong, specific, and hard to break. The type of "handshake" determines whether molecules stick together or fly apart.',
      storyConnection: 'The serpent Vasuki used as the churning rope needed to be strong enough to not break under the tremendous forces of churning. Hydrogen bonds in water are like Vasuki — individually modest, but collectively they give water its extraordinary properties (high boiling point, surface tension, ability to dissolve salts). Without these forces, the "ocean" could not exist as a liquid.',
      checkQuestion: 'Water (H₂O, MW=18) boils at 100°C while hydrogen sulfide (H₂S, MW=34) boils at -60°C. H₂S is nearly twice as heavy. Why does the lighter molecule have the higher boiling point?',
      checkAnswer: 'Water forms hydrogen bonds (H bonded to very electronegative O), which are strong intermolecular forces requiring high energy to break. H₂S cannot form hydrogen bonds because S is much less electronegative than O — it only has weaker dipole-dipole and London forces. Despite being heavier, H₂S has weaker intermolecular forces, so less energy (lower temperature) is needed to vaporize it. This demonstrates that intermolecular force type matters more than molecular weight.',
      codeIntro: 'Model the Lennard-Jones potential for different intermolecular interactions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Lennard-Jones potential: E = 4*eps * [(sig/r)^12 - (sig/r)^6]
def lennard_jones(r, epsilon, sigma):
    return 4 * epsilon * ((sigma / r)**12 - (sigma / r)**6)

r = np.linspace(2.5, 8.0, 300)  # distance in Angstroms

# Parameters for different interaction types
forces = [
    ("London (Ar-Ar)", 0.010, 3.4, "#94a3b8"),
    ("Dipole-dipole (HCl-HCl)", 0.030, 3.3, "#60a5fa"),
    ("H-bond (H2O-H2O)", 0.065, 2.8, "#10b981"),
]

plt.figure(figsize=(10, 5))
for name, eps, sig, color in forces:
    E = lennard_jones(r, eps, sig)
    E = np.clip(E, -0.08, 0.05)  # clip for visualization
    plt.plot(r, E, linewidth=2.5, color=color, label=name)

plt.axhline(y=0, color='white', linewidth=0.5, alpha=0.3)
plt.xlabel('Distance between molecules (Angstroms)', fontsize=11, color='lightgray')
plt.ylabel('Potential energy (eV)', fontsize=11, color='lightgray')
plt.title('Intermolecular Force Comparison', fontsize=14, color='white')
plt.legend(fontsize=9, labelcolor='lightgray')
plt.grid(alpha=0.2)
plt.tick_params(colors='lightgray')
plt.tight_layout()
plt.show()

print("Deeper well = stronger attraction = higher boiling point")
for name, eps, sig, _ in forces:
    r_min = sig * 2**(1/6)  # equilibrium distance
    E_min = -eps
    print(f"  {name}: well depth = {abs(E_min)*1000:.1f} meV, r_eq = {r_min:.2f} A")`,
      challenge: 'Add a fourth curve for ion-dipole forces (NaCl dissolving in water): epsilon=0.15, sigma=2.5. How much deeper is its well? This explains why salt dissolves so readily in water — ion-dipole forces are stronger than hydrogen bonds.',
      successHint: 'The Lennard-Jones potential is one of the most important models in physical chemistry. The balance between attraction (1/r^6) and repulsion (1/r^12) determines molecular spacing, phase behavior, and ultimately everything about the macroscopic properties of matter.',
    },
    {
      title: 'Colloid chemistry — suspensions, sols, and gels',
      concept: `Between true solutions (completely dissolved, like salt in water) and coarse mixtures (visibly separate, like sand in water), there is a fascinating middle ground: **colloids**.

A colloid has particles between 1 nm and 1000 nm — too small to see individually, but large enough to scatter light (the **Tyndall effect**). Milk, fog, paint, and blood are all colloids.

Types of colloids by phase:
- **Sol**: solid particles in liquid (paint, ink, blood)
- **Emulsion**: liquid in liquid (milk, mayonnaise)
- **Foam**: gas in liquid (whipped cream) or gas in solid (styrofoam)
- **Gel**: liquid trapped in solid network (jelly, butter, tofu)
- **Aerosol**: liquid in gas (fog) or solid in gas (smoke)

Butter — the product of churning milk — is a **gel**: a network of fat crystals trapping water droplets. When you churn milk, you invert the emulsion: milk is oil-in-water (fat droplets in water), but butter is water-in-oil (water droplets in fat).

The code models the Tyndall effect — how particle size affects light scattering intensity — which is how we detect and measure colloids.`,
      analogy: 'Imagine three sizes of fish in a net. A true solution is like dissolved salt — the "fish" are molecular-sized and pass through any net. A colloid is like small fish caught in a fine net — visible collectively (cloudy solution) but not individually. A suspension is like big fish in a coarse net — clearly visible and eventually settling to the bottom. The net size (1-1000 nm) defines the colloidal realm.',
      storyConnection: 'The cosmic ocean was neither a pure solution nor a simple mixture — it was a colloidal system. The treasures that emerged were suspended in the milky ocean (kshirasagara, literally "ocean of milk"). Milk IS a colloid — fat globules suspended in water. The myth describes a colloidal inversion: churning transforms a stable colloid (milk) into separated phases (butter + buttermilk).',
      checkQuestion: 'Why does a beam of light appear visible when shining through milk but invisible when shining through sugar water?',
      checkAnswer: 'This is the Tyndall effect. Milk is a colloid with fat particles (100-10,000 nm) large enough to scatter visible light (wavelength 400-700 nm). The scattered light makes the beam visible from the side. Sugar water is a true solution — dissolved sugar molecules (~1 nm) are far too small to scatter visible light. The beam passes through invisibly. This is actually how scientists distinguish colloids from true solutions.',
      codeIntro: 'Model the Tyndall effect and colloid scattering across particle sizes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Tyndall effect: scattering depends on particle size relative to wavelength
# Rayleigh: I ~ d^6 / lambda^4 (for d << lambda)
# Mie: more complex for d ~ lambda

d = np.logspace(-1, 4, 300)  # particle diameter in nm
wavelength = 550  # nm (green light)

# Scattering intensity (simplified model)
# Below wavelength: Rayleigh (steep d^6 dependence)
# Near wavelength: Mie (peaks then oscillates)
scatter = np.where(
    d < wavelength,
    (d / wavelength)**6,  # Rayleigh regime
    (d / wavelength)**2 * np.exp(-(d / wavelength - 1)**2 / 5)  # Mie
)
scatter = scatter / scatter.max()  # normalize

plt.figure(figsize=(10, 5))
plt.semilogx(d, scatter, color='#f59e0b', linewidth=2.5)

# Regime labels
plt.axvspan(0.1, 1, alpha=0.1, color='blue', label='Solution (<1 nm)')
plt.axvspan(1, 1000, alpha=0.1, color='green', label='Colloid (1-1000 nm)')
plt.axvspan(1000, 10000, alpha=0.1, color='red', label='Suspension (>1000 nm)')

plt.xlabel('Particle diameter (nm)', fontsize=11, color='lightgray')
plt.ylabel('Relative scattering intensity', fontsize=11, color='lightgray')
plt.title('Tyndall Effect: Light Scattering vs Particle Size', fontsize=14, color='white')
plt.legend(fontsize=9, labelcolor='lightgray', loc='upper left')
plt.grid(alpha=0.2)
plt.tick_params(colors='lightgray')
plt.tight_layout()
plt.show()

print("Solution particles (<1 nm): almost no scattering → transparent")
print("Colloidal particles (1-1000 nm): strong scattering → Tyndall effect")
print("Suspension particles (>1000 nm): scatter + settle → visibly cloudy")
print()
print("Milk scatters light because fat globules (~100 nm) are colloidal!")`,
      challenge: 'Plot scattering for red light (700 nm) and blue light (450 nm) on the same chart. Which color scatters more from colloidal particles? This explains why colloidal solutions often appear bluish when viewed from the side.',
      successHint: 'Colloid chemistry bridges the molecular and macroscopic worlds. Understanding colloids explains why paint stays mixed, why blood is opaque, why fog forms, and why butter is solid. The Tyndall effect is a powerful analytical tool — shine a laser and you can detect particles invisible to the naked eye.',
    },
    {
      title: 'Reaction kinetics — rates of neutralization',
      concept: `Chemical reactions do not happen instantaneously — they have **rates**. The study of how fast reactions occur is called **kinetics**. The rate depends on:

**Rate = k × [A]^m × [B]^n**

Where k is the rate constant, [A] and [B] are reactant concentrations, and m, n are the reaction orders (usually 1 or 2).

Key factors that affect rate:
- **Concentration**: More molecules → more collisions → faster reaction
- **Temperature**: Higher T → faster molecules → more energetic collisions → much faster rate. The Arrhenius equation: k = A × exp(-Ea/RT)
- **Catalyst**: Provides an alternative pathway with lower activation energy

For a neutralization reaction (HCl + NaOH → NaCl + H₂O), the rate is extremely fast because H⁺ and OH⁻ ions combine almost instantly. But many other reactions are much slower — rust takes years, digestion takes hours.

The code models first-order and second-order reaction kinetics, showing how concentration changes over time and how temperature affects the rate constant through the Arrhenius equation.`,
      analogy: 'Imagine a crowded dance floor. The rate of "collisions" (people bumping into each other) depends on: (1) how many people are on the floor (concentration), (2) how fast they are moving (temperature), and (3) whether there is a good DJ who gets everyone moving toward each other (catalyst). A reaction happens when molecules collide with enough energy AND in the right orientation — just like a conversation starts when two people bump into each other face-to-face.',
      storyConnection: 'The churning happened at a specific rate — not too fast, not too slow. If the gods and demons churned too slowly, nothing would separate. Too fast, and Mount Mandara would destroy itself. Reaction kinetics teaches the same lesson: the rate of transformation depends on conditions. Temperature, concentration, and catalysts determine whether a reaction takes microseconds or millennia.',
      checkQuestion: 'Why does putting food in a refrigerator slow spoilage? Express your answer in terms of the Arrhenius equation.',
      checkAnswer: 'Spoilage is caused by chemical reactions (enzymatic breakdown, bacterial metabolism). The Arrhenius equation says k = A × exp(-Ea/RT). When T decreases (refrigeration: ~4°C = 277 K vs room temp ~25°C = 298 K), the exponent -Ea/RT becomes more negative, making exp(-Ea/RT) smaller, so k (rate constant) decreases. As a rule of thumb, every 10°C decrease roughly halves the reaction rate. Refrigeration slows spoilage reactions by 3-4× compared to room temperature.',
      codeIntro: 'Model reaction kinetics: first-order decay and the Arrhenius equation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# First-order reaction: [A] = [A]0 * exp(-k*t)
# Second-order: 1/[A] = 1/[A]0 + k*t

t = np.linspace(0, 10, 200)  # seconds
A0 = 1.0  # initial concentration (mol/L)

# Different rate constants
k_values = [0.1, 0.3, 0.5, 1.0]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# First-order kinetics
for k in k_values:
    A = A0 * np.exp(-k * t)
    ax1.plot(t, A, linewidth=2, label=f'k = {k} s⁻¹')

ax1.set_xlabel('Time (s)', fontsize=11, color='lightgray')
ax1.set_ylabel('[A] (mol/L)', fontsize=11, color='lightgray')
ax1.set_title('First-Order Kinetics', fontsize=13, color='white')
ax1.legend(fontsize=9, labelcolor='lightgray')
ax1.grid(alpha=0.2)
ax1.tick_params(colors='lightgray')

# Arrhenius: k = A * exp(-Ea/RT)
T_range = np.linspace(250, 450, 200)  # Kelvin
R = 8.314  # J/(mol*K)
A_factor = 1e10  # pre-exponential factor

for Ea in [30, 50, 70, 90]:  # kJ/mol
    k_arr = A_factor * np.exp(-Ea * 1000 / (R * T_range))
    ax2.semilogy(T_range - 273.15, k_arr, linewidth=2, label=f'Ea = {Ea} kJ/mol')

ax2.set_xlabel('Temperature (°C)', fontsize=11, color='lightgray')
ax2.set_ylabel('Rate constant k (s⁻¹)', fontsize=11, color='lightgray')
ax2.set_title('Arrhenius: Temperature vs Rate', fontsize=13, color='white')
ax2.legend(fontsize=9, labelcolor='lightgray')
ax2.grid(alpha=0.2)
ax2.tick_params(colors='lightgray')

plt.tight_layout()
plt.show()

print("Left: Higher k → faster reaction → concentration drops faster")
print("Right: Higher T → exponentially faster reaction")
print("Lower Ea (activation energy) → reaction is faster at any T")`,
      challenge: 'Calculate the half-life (time for concentration to halve) for each k value. For first-order reactions, t_half = ln(2)/k. Does the half-life depend on initial concentration?',
      successHint: 'Kinetics determines whether a reaction takes nanoseconds or millennia. The Arrhenius equation is one of the most powerful relationships in chemistry — it explains why cooking is faster at higher temperatures, why enzymes have optimal temperatures, and why chemical reactions in space are incredibly slow.',
    },
    {
      title: 'Phase diagrams — states of matter transitions',
      concept: `Every substance exists as solid, liquid, or gas depending on temperature and pressure. A **phase diagram** maps these states on a temperature-pressure plot, showing the boundaries where transitions occur.

Key features of a phase diagram:
- **Triple point**: The unique T and P where all three phases coexist (water: 0.01°C, 0.006 atm)
- **Critical point**: Above this T and P, liquid and gas become indistinguishable — a **supercritical fluid** (water: 374°C, 218 atm)
- **Phase boundaries**: Lines where two phases coexist (melting curve, boiling curve, sublimation curve)

Water's phase diagram has a peculiarity: the solid-liquid line slopes **backward** (negative slope). This means increasing pressure on ice at 0°C can melt it — pressure lowers the melting point. This is unique to water (because ice is less dense than liquid water) and explains why ice skating works.

The code plots a complete phase diagram for water, marking all critical features. We use the Clausius-Clapeyron equation to calculate phase boundary curves:

**dP/dT = delta_H / (T × delta_V)**`,
      analogy: 'A phase diagram is like a map of a country with three territories: Solid Province, Liquid Republic, and Gas Empire. The borders between territories are the phase transition lines. At the triple point, all three territories share a single border post. At the critical point, the border between Liquid and Gas disappears — they become one unified state. Your latitude is temperature, your longitude is pressure.',
      storyConnection: 'The ocean in the myth underwent dramatic transformations during churning — from calm liquid to violent foam to producing solid treasures. These are phase transitions: liquid to gas (foam contains bubbles), liquid to solid (gems crystallizing out). Understanding phase diagrams lets you predict which state a substance will be in under any conditions.',
      checkQuestion: 'On top of Mount Everest (pressure ~0.3 atm), water boils at about 71°C instead of 100°C. Why, and what practical problem does this cause?',
      checkAnswer: 'The boiling point curve on water\'s phase diagram shows that boiling point decreases with decreasing pressure. At 0.3 atm, the curve intersects at ~71°C. Practically, this means you cannot cook food properly at high altitude — boiling water is not hot enough to cook rice, eggs, or pasta in normal time. A pressure cooker solves this by raising the internal pressure above 1 atm, restoring a higher boiling point (~120°C at 2 atm).',
      codeIntro: 'Plot the phase diagram of water showing all three phases and critical points.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Water phase diagram (simplified curves)
# Sublimation curve: solid-gas boundary
T_sub = np.linspace(200, 273.16, 50)
P_sub = 611.657 * np.exp(22.5 * (1 - 273.16 / T_sub))

# Boiling curve: liquid-gas boundary (Clausius-Clapeyron)
T_boil = np.linspace(273.16, 647, 100)
P_boil = 611.657 * np.exp(13.0 * (1 - 373.15 / T_boil))

# Melting curve: solid-liquid (negative slope for water!)
T_melt = np.linspace(250, 273.16, 50)
P_melt = 611.657 * (1 + 1.3e8 * (273.16 - T_melt))

plt.figure(figsize=(10, 6))

# Phase regions
plt.fill_between(T_sub, P_sub, 1, alpha=0.15, color='cyan', label='Solid (Ice)')
plt.text(235, 1e5, 'SOLID', fontsize=14, color='cyan', fontweight='bold')
plt.text(400, 1e4, 'LIQUID', fontsize=14, color='blue', fontweight='bold')
plt.text(500, 1e2, 'GAS', fontsize=14, color='orange', fontweight='bold')

# Phase boundary curves
plt.semilogy(T_sub, P_sub, 'c-', linewidth=2)
plt.semilogy(T_boil, P_boil, 'b-', linewidth=2)

# Triple point
plt.plot(273.16, 611.657, 'wo', markersize=8, zorder=5)
plt.annotate('Triple point\\n(0.01°C, 611 Pa)', xy=(273.16, 611.657),
             xytext=(290, 100), fontsize=9, color='white',
             arrowprops=dict(arrowstyle='->', color='white'))

# Critical point
plt.plot(647, P_boil[-1], 'r*', markersize=12, zorder=5)
plt.annotate('Critical point\\n(374°C, 22.1 MPa)', xy=(647, P_boil[-1]),
             xytext=(550, P_boil[-1]*5), fontsize=9, color='red',
             arrowprops=dict(arrowstyle='->', color='red'))

# Normal boiling point
plt.axhline(y=101325, color='gray', linewidth=0.5, linestyle='--', alpha=0.4)
plt.text(680, 101325, '1 atm', color='gray', fontsize=8)

plt.xlabel('Temperature (K)', fontsize=11, color='lightgray')
plt.ylabel('Pressure (Pa)', fontsize=11, color='lightgray')
plt.title("Water Phase Diagram", fontsize=14, color='white')
plt.xlim(200, 700)
plt.ylim(1, 1e8)
plt.grid(alpha=0.15)
plt.tick_params(colors='lightgray')
plt.tight_layout()
plt.show()

print("Triple point: all 3 phases coexist (0.01°C, 611 Pa)")
print("Critical point: liquid/gas become indistinguishable (374°C)")
print("Normal boiling: where boiling curve crosses 1 atm → 100°C")`,
      challenge: 'Look up CO2\'s triple point (216.55 K, 5.18 atm) and critical point (304.13 K, 72.8 atm). Plot its phase diagram. Notice that CO2\'s triple point pressure is above 1 atm — what does this mean for CO2 at room temperature and 1 atm? (Hint: dry ice sublimes directly.)',
      successHint: 'Phase diagrams are the complete map of matter\'s behavior. They predict whether a substance will be solid, liquid, or gas at any temperature and pressure. Engineers use them to design everything from freeze-drying processes to supercritical CO2 extraction in coffee decaffeination.',
    },
    {
      title: 'Chromatography — separating mixtures by affinity',
      concept: `Chromatography separates mixtures based on how strongly each component sticks to a stationary surface. The mixture is dissolved in a moving fluid (**mobile phase**) that carries it over a stationary material (**stationary phase**).

Components that stick strongly to the stationary phase move slowly; those that stick weakly move fast. This differential movement separates the mixture.

The key measurement is **Rf** (retention factor):

**Rf = distance traveled by substance / distance traveled by solvent**

Rf ranges from 0 (stuck to start) to 1 (moves with solvent). Each substance has a characteristic Rf value in a given solvent-stationary phase system — this is its chemical "fingerprint."

Types of chromatography:
- **Paper**: Simplest — ink separates into component dyes
- **TLC (Thin Layer)**: Faster, on coated glass plates
- **Column**: Gravity-driven, for larger quantities
- **HPLC**: High pressure, extremely precise separation
- **Gas (GC)**: For volatile compounds; mixtures carried by inert gas

The code simulates a chromatography separation, tracking how different components move at different speeds through a column.`,
      analogy: 'Imagine a group of hikers walking through a forest (stationary phase) along a river (mobile phase). Some hikers keep stopping to pick berries — they fall behind. Others ignore the berries and keep walking fast. After an hour, the berry-pickers are far behind the non-pickers. The forest has separated the group by their "affinity" for berries — this is exactly how chromatography works. Different molecules have different affinities for the stationary phase.',
      storyConnection: 'The mythical ocean contained everything mixed together — treasures, poisons, animals, plants. The churning separated them in a specific order, each substance emerging at a different time. Chromatography does the same: a complex mixture enters the column, and components emerge one by one in order of their affinity. Each fraction is a different "treasure" from the mixture.',
      checkQuestion: 'A forensic scientist uses paper chromatography on ink from two pens. Pen A produces spots with Rf values 0.25, 0.45, 0.70. Pen B produces spots at 0.25, 0.55, 0.70. Are the inks the same?',
      checkAnswer: 'No. While they share two components (Rf 0.25 and 0.70), the middle component differs (0.45 vs 0.55). These are different ink formulations. In forensic science, this is how forged documents are detected — the ink from the forger\'s pen has a different chromatographic fingerprint than the original. Even inks that look identical to the eye can be distinguished by chromatography.',
      codeIntro: 'Simulate chromatographic separation of a 4-component mixture.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Chromatography simulation
# Each component moves at speed proportional to its Rf
column_length = 100  # arbitrary units

components = [
    ("Dye A (blue)", 0.25, "#3b82f6"),
    ("Dye B (red)",  0.50, "#ef4444"),
    ("Dye C (yellow)", 0.72, "#fbbf24"),
    ("Dye D (green)", 0.38, "#10b981"),
]

time_steps = np.linspace(0, 100, 200)

plt.figure(figsize=(10, 5))
for name, rf, color in components:
    # Position = rf * solvent_front_position
    # Gaussian peak shape at each position
    for t_idx in [50, 100, 150, 199]:
        t = time_steps[t_idx]
        pos = rf * t
        # Peak broadening increases with time (diffusion)
        sigma = 1 + 0.05 * t
        x = np.linspace(0, 100, 500)
        peak = np.exp(-(x - pos)**2 / (2 * sigma**2))
        if t_idx == 199:
            plt.plot(x, peak, color=color, linewidth=2, label=f"{name} (Rf={rf})")
        else:
            plt.plot(x, peak, color=color, linewidth=0.5, alpha=0.3)

plt.xlabel('Position along column', fontsize=11, color='lightgray')
plt.ylabel('Concentration', fontsize=11, color='lightgray')
plt.title('Chromatographic Separation Over Time', fontsize=14, color='white')
plt.legend(fontsize=9, labelcolor='lightgray')
plt.grid(alpha=0.2)
plt.tick_params(colors='lightgray')
plt.tight_layout()
plt.show()

print("=== Separation Results ===")
for name, rf, _ in sorted(components, key=lambda x: x[1]):
    print(f"  {name}: Rf = {rf:.2f} → exits at position {rf*100:.0f}")
print()
print("Higher Rf → less affinity for stationary phase → moves faster")
print("Lower Rf → sticks more to stationary phase → moves slower")`,
      challenge: 'Two components have Rf values 0.48 and 0.52. Can the column separate them? Increase the column length (try 500 instead of 100) and see if the peaks separate better. This is the principle behind HPLC — longer columns and higher pressure for better resolution.',
      successHint: 'Chromatography is arguably the most important analytical technique in chemistry. It can separate mixtures that no other method can — from drug metabolites in blood to pollutants in water. Every pharmaceutical company, forensic lab, and food safety agency relies on chromatography daily.',
    },
    {
      title: 'Mass spectrometry — identifying unknowns by molecular weight',
      concept: `Mass spectrometry (MS) is the ultimate identification tool in chemistry. It measures the **mass-to-charge ratio (m/z)** of ions, giving you a "molecular fingerprint" that identifies unknown compounds.

How it works:
1. **Ionization**: Molecules are given an electric charge (usually by removing one electron)
2. **Acceleration**: Ions are accelerated through an electric field
3. **Separation**: A magnetic field deflects ions — lighter ions curve more, heavier ions curve less
4. **Detection**: Each ion hits a detector at a position determined by its m/z ratio

The result is a **mass spectrum**: a bar chart with m/z on the x-axis and intensity on the y-axis. Each peak corresponds to a specific ion. The molecular ion peak (M⁺) tells you the molecular weight. Fragment peaks tell you the structure.

Example: Ethanol (CH₃CH₂OH, MW = 46)
- m/z = 46: molecular ion (whole molecule)
- m/z = 45: loss of H (CH₃CHOH⁺)
- m/z = 31: loss of CH₃ (CH₂OH⁺)
- m/z = 29: CHO⁺ fragment

The code simulates a mass spectrometer, generating spectra for known compounds and then matching an unknown spectrum to a database.`,
      analogy: 'Imagine a row of cannons firing balls of different sizes at the same speed through a crosswind. Light balls (small m/z) are blown far sideways by the wind. Heavy balls (large m/z) barely deflect — they plow straight through. By measuring where each ball lands, you can calculate its weight. A mass spectrometer fires ions through a magnetic "crosswind" and measures where they land.',
      storyConnection: 'After the churning, the treasures needed to be identified — which gem was which, which liquid was which. Mass spectrometry is the modern equivalent: you take an unknown substance from a mixture and determine exactly what it is by measuring its molecular weight and fragmentation pattern. Each compound has a unique spectrum, like a chemical fingerprint.',
      checkQuestion: 'A mass spectrum shows a molecular ion at m/z = 44 and major fragments at m/z = 28 and 16. What is the compound?',
      checkAnswer: 'The compound is CO₂ (carbon dioxide, MW = 44). Fragment at m/z = 28 is CO⁺ (loss of one oxygen), and m/z = 16 is O⁺ (individual oxygen atom). The fragmentation pattern is consistent: 44 → 28 + 16 (CO₂ → CO + O). This is exactly how environmental scientists identify greenhouse gases in atmospheric samples.',
      codeIntro: 'Generate mass spectra and match an unknown compound to a database.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Mass spectra database (simplified)
database = {
    "Water (H2O)":    {18: 100, 17: 25, 16: 5},
    "Methanol":       {32: 65, 31: 100, 29: 40, 28: 10},
    "Ethanol":        {46: 30, 45: 100, 31: 50, 29: 25, 27: 15},
    "Acetone":        {58: 40, 43: 100, 42: 10, 15: 30},
    "Acetic acid":    {60: 50, 45: 100, 43: 80, 28: 15},
}

# Plot spectra for 3 compounds
fig, axes = plt.subplots(1, 3, figsize=(14, 4))
compounds = ["Water (H2O)", "Ethanol", "Acetone"]

for ax, name in zip(axes, compounds):
    spec = database[name]
    mz = list(spec.keys())
    intensities = list(spec.values())
    ax.bar(mz, intensities, width=0.8, color='#a78bfa', edgecolor='white')
    ax.set_xlabel('m/z', fontsize=10, color='lightgray')
    ax.set_ylabel('Intensity (%)', fontsize=10, color='lightgray')
    ax.set_title(name, fontsize=11, color='white')
    ax.set_ylim(0, 120)
    ax.tick_params(colors='lightgray', labelsize=8)
    ax.grid(axis='y', alpha=0.2)
    for m, i in zip(mz, intensities):
        ax.text(m, i + 3, str(m), ha='center', fontsize=8, color='lightgray')

plt.suptitle('Mass Spectra — Molecular Fingerprints', fontsize=13, color='white')
plt.tight_layout()
plt.show()

# Match an unknown spectrum
unknown = {46: 28, 45: 100, 31: 48, 29: 22, 27: 13}
print("Unknown spectrum:", unknown)
print()

for name, ref in database.items():
    shared = set(unknown.keys()) & set(ref.keys())
    if len(shared) >= 2:
        score = sum(min(unknown.get(m,0), ref.get(m,0)) for m in shared)
        print(f"  {name}: match score = {score:.0f} ({len(shared)} shared peaks)")

print()
print("Highest match score identifies the unknown compound!")`,
      challenge: 'Add a new compound to the database: "Benzene" with peaks at {78: 100, 77: 25, 52: 20, 51: 30, 39: 15}. Then create an unknown spectrum that is a noisy version of benzene (add +/- 5% random variation to each intensity) and see if the matching algorithm correctly identifies it.',
      successHint: 'Mass spectrometry is how scientists identify everything from drug metabolites to ancient proteins to compounds on Mars. Combined with chromatography (GC-MS, LC-MS), it can separate AND identify thousands of compounds in a single sample. You have now learned the complete analytical toolkit for understanding any mixture.',
    },
  ];

  const diagrams = [ChurningIntermolecularDiagram, ChurningColloidDiagram, PHScaleDiagram, PhaseChangeDiagram, ChurningChromatographyDiagram, ChurningMassSpecDiagram];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced chemistry and analytical techniques</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced chemistry simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
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
            diagram={diagrams[i] ? createElement(diagrams[i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
