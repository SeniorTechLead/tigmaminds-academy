import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import AgniCombustionTriangleDiagram from '../diagrams/AgniCombustionTriangleDiagram';
import AgniFlameColorDiagram from '../diagrams/AgniFlameColorDiagram';
import AgniHeatTransferDiagram from '../diagrams/AgniHeatTransferDiagram';
import AgniSpectroscopyDiagram from '../diagrams/AgniSpectroscopyDiagram';
import EnergyProfileDiagram from '../diagrams/EnergyProfileDiagram';
import BalancingEquationDiagram from '../diagrams/BalancingEquationDiagram';

export default function AgniLevel2() {
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
      title: 'Activation energy — the energy barrier to start a fire',
      concept: `In Level 1 you learned that combustion requires heat. But why? Wood at room temperature is surrounded by oxygen, yet it does not spontaneously burst into flame. The answer is **activation energy** — the minimum energy needed to start the reaction.

Think of it as pushing a boulder over a hill. The boulder (fuel + O₂) sits in a valley (stable state). To reach the other valley (products: CO₂ + H₂O, which is lower energy), the boulder must first be pushed over the hill (activation energy barrier). The match provides just enough push.

Once the reaction starts, it releases enough energy to keep itself going — the flame sustains itself because the energy released exceeds the activation energy needed for the next layer of fuel.

In the code, you’ll plot the energy profile of a combustion reaction, showing the activation barrier and the net energy released.`,
      analogy: 'Starting a fire is like starting a car on a hill. You need to push it to the crest (activation energy), then it rolls downhill on its own (self-sustaining reaction). A catalyst is like making the hill smaller — less push needed to get started.',
      storyConnection: 'The arani sticks (fire-starting friction sticks) in Vedic ritual are tools for overcoming activation energy. The friction converts mechanical energy into localised heat, raising the wood’s temperature past its ignition point (~300°C for dry wood). Once Agni is "born" from the friction, the exothermic reaction sustains itself.',
      checkQuestion: 'If the products of combustion have LESS energy than the reactants, where does the difference go?',
      checkAnswer: 'The difference is released as heat and light — this is an exothermic reaction. The chemical bonds in CO₂ and H₂O are stronger (lower potential energy) than the bonds in CH₄ and O₂. The energy difference is the heat of combustion. For methane, this is 890 kJ/mol — enough to heat 2.5 litres of water from 20°C to boiling.',
      codeIntro: 'Plot the energy profile of a combustion reaction showing activation energy.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Reaction coordinate (arbitrary progress from reactants to products)
x = np.linspace(0, 10, 300)

# Energy profile: starts high, rises to peak (activation), drops to lower level
E_reactants = 100   # energy of CH4 + 2O2 (arbitrary units)
E_products = 10     # energy of CO2 + 2H2O (much lower)
E_activation = 150  # peak of the barrier

# Model with a smooth curve
E = E_products + (E_reactants - E_products) * np.exp(-0.5 * ((x - 1.5) / 0.8)**2 * 0.1)
# Add activation peak
E += (E_activation - E_reactants) * np.exp(-0.5 * ((x - 3.5) / 1.0)**2)
# Smooth descent to products
E[x > 5] = E_products + (E[x > 5][0] - E_products) * np.exp(-0.3 * (x[x > 5] - 5))

plt.figure(figsize=(10, 6))
plt.plot(x, E, linewidth=2.5, color='#ef4444')
plt.fill_between(x, 0, E, alpha=0.1, color='#ef4444')

# Annotations
plt.annotate('Reactants\\n(CH₄ + 2O₂)', xy=(1, E_reactants), fontsize=10,
             color='#93c5fd', ha='center')
plt.annotate('Activation\\nenergy barrier', xy=(3.5, E_activation), fontsize=10,
             color='#fbbf24', ha='center',
             xytext=(5.5, E_activation + 10),
             arrowprops=dict(arrowstyle='->', color='#fbbf24'))
plt.annotate('Products\\n(CO₂ + 2H₂O)', xy=(8.5, E_products + 5), fontsize=10,
             color='#86efac', ha='center')

# Energy released arrow
plt.annotate('', xy=(9, E_products), xytext=(9, E_reactants),
             arrowprops=dict(arrowstyle='<->', color='white', linewidth=1.5))
plt.text(9.3, (E_reactants + E_products) / 2, 'Energy\\nreleased\\n(heat + light)',
         fontsize=9, color='lightgray')

plt.xlabel('Reaction progress', fontsize=12)
plt.ylabel('Energy (kJ/mol)', fontsize=12)
plt.title('Energy Profile of Methane Combustion', fontsize=14)
plt.grid(alpha=0.2)
plt.tight_layout()
plt.show()

print("The match provides activation energy (the initial push).")
print("Once started, the reaction releases more energy than it needs,")
print("so it sustains itself — this is why fires keep burning.")`,
      challenge: 'Add a second curve showing the same reaction WITH a catalyst (lower activation energy, same start and end points). Catalysts do not change the energy released — they just lower the barrier. How does this apply to catalytic converters in cars?',
      successHint: 'Activation energy explains why combustion does not happen spontaneously at room temperature despite being energetically favourable. This concept — kinetic barrier vs thermodynamic favourability — appears throughout chemistry, biology, and engineering.',
    },
    {
      title: 'Bond energies — calculating heat of combustion from scratch',
      concept: `The energy released in combustion comes from the difference in bond strengths between reactants and products. Breaking bonds **costs** energy. Forming bonds **releases** energy. If the products have stronger bonds than the reactants, the net result is energy release.

For methane combustion:
- **Bonds broken**: 4 C–H bonds (413 kJ each) + 2 O=O bonds (498 kJ each) = 2,648 kJ
- **Bonds formed**: 2 C=O bonds (805 kJ each) + 4 O–H bonds (463 kJ each) = 3,462 kJ
- **Net**: 3,462 - 2,648 = **814 kJ released**

The experimental value is 890 kJ/mol — our estimate is close. The difference comes from using average bond energies instead of exact values for specific molecules.`,
      analogy: 'Imagine disassembling two LEGO models and building a new one. If the new model uses less total "snap energy" to hold together (stronger connections), the leftover energy is released. In combustion, the "snap energy" of CO₂ and H₂O bonds is greater than that of CH₄ and O₂ bonds, so the difference comes out as heat.',
      storyConnection: 'Agni transforms matter — wood becomes ash, smoke, and heat. Bond energy calculations reveal exactly where Agni’s power comes from: the rearrangement of atoms into configurations with stronger bonds. The "fire inside the wood" that the Vedic poets described is literally the chemical potential energy stored in carbon-hydrogen bonds.',
      checkQuestion: 'Hydrogen gas (H₂) burning in oxygen is extremely exothermic. Using bond energies: H–H = 436 kJ, O=O = 498 kJ, O–H = 463 kJ, calculate the energy released for 2H₂ + O₂ → 2H₂O.',
      checkAnswer: 'Bonds broken: 2 H–H (2 × 436 = 872) + 1 O=O (498) = 1,370 kJ. Bonds formed: 4 O–H (4 × 463 = 1,852) = 1,852 kJ. Net = 1,852 - 1,370 = 482 kJ released. Experimental: 484 kJ — remarkably close! Hydrogen’s high energy per mole makes it an attractive clean fuel (product is just water).',
      codeIntro: 'Calculate heats of combustion using bond energy data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Average bond energies (kJ/mol)
bond_E = {
    "C-H": 413, "C-C": 347, "C=C": 614,
    "O=O": 498, "C=O": 805, "O-H": 463,
    "H-H": 436, "C-O": 358, "N-H": 391,
}

# Combustion reactions: (bonds_broken, bonds_formed, name)
reactions = [
    {
        "name": "Methane (CH₄)",
        "broken": [("C-H", 4), ("O=O", 2)],
        "formed": [("C=O", 2), ("O-H", 4)],
    },
    {
        "name": "Ethane (C₂H₆)",
        "broken": [("C-H", 6), ("C-C", 1), ("O=O", 3.5)],
        "formed": [("C=O", 4), ("O-H", 6)],
    },
    {
        "name": "Hydrogen (H₂)",
        "broken": [("H-H", 2), ("O=O", 1)],
        "formed": [("O-H", 4)],
    },
]

print("=== Bond Energy Combustion Calculator ===\\n")
names = []
energies = []

for rxn in reactions:
    cost = sum(bond_E[b] * n for b, n in rxn["broken"])
    gain = sum(bond_E[b] * n for b, n in rxn["formed"])
    net = gain - cost

    print(f"{rxn['name']}:")
    print(f"  Energy to break bonds:  {cost:>6} kJ")
    print(f"  Energy from new bonds: -{gain:>5} kJ")
    print(f"  Net energy released:    {net:>6} kJ")
    print()
    names.append(rxn["name"])
    energies.append(net)

# Visualise
plt.figure(figsize=(10, 5))
plt.bar(names, energies, color=['#3b82f6', '#8b5cf6', '#22c55e'], width=0.5)
plt.ylabel('Energy released (kJ/mol)', fontsize=11)
plt.title('Heat of Combustion from Bond Energies', fontsize=14)
plt.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.show()

print("Bond energies explain exactly WHY combustion releases heat:")
print("the products have STRONGER bonds than the reactants.")`,
      challenge: 'Add propane (C₃H₈): bonds broken = 8 C–H + 2 C–C + 5 O=O; bonds formed = 6 C=O + 8 O–H. Calculate its heat of combustion and compare to the experimental value of 2,220 kJ/mol. How close is your estimate?',
      successHint: 'Bond energy calculations are how chemists predict reaction energies without doing experiments. This approach works for any reaction — not just combustion. It is the foundation of thermochemistry.',
    },
    {
      title: 'Convection simulation — modelling hot air rising',
      concept: `In Level 1 you learned that convection makes flames rise. Now let’s simulate the process computationally. We will model air parcels above a heat source: hot parcels rise, cool parcels sink, creating a circulation pattern.

The key physics: a parcel of hot air is less dense than surrounding cool air, so it experiences a net upward **buoyant force**. This is Archimedes’ principle applied to gases. The acceleration is proportional to the temperature difference:

**a = g × (T_parcel - T_ambient) / T_ambient**

This is the **buoyancy equation** for gases. A parcel that is 10% hotter than its surroundings accelerates upward at about 1 m/s² — gentle but steady. This creates the convection currents that shape every flame on Earth.`,
      analogy: 'A hot air balloon works by convection. Heat the air inside the balloon → it becomes less dense → it rises. A flame is a tiny hot air balloon that runs continuously: combustion heats the air, the hot air rises (taking smoke and soot with it), and fresh cool air flows in from below to feed the reaction.',
      storyConnection: 'The Vedic fire pit design used convection intentionally. The pit was dug into the ground with openings at the bottom for air intake. Hot gases rose through the fire, drawing in fresh cool air from below — a natural bellows effect. This "stack effect" (convection-driven airflow) is the same principle that makes chimneys work.',
      checkQuestion: 'In a room with no wind, you light a candle. After a few minutes, the smoke detector on the ceiling goes off. Trace the path the smoke took using convection.',
      checkAnswer: 'The candle heats air above the flame. This hot air (carrying smoke particles) rises in a convection plume directly above the flame. When the plume hits the ceiling, it spreads horizontally in all directions along the ceiling surface (because it cannot rise further). The smoke particles in this hot ceiling layer eventually reach the smoke detector. The key: smoke travels UP first (convection), then ACROSS the ceiling (horizontal flow). This is why smoke detectors are on ceilings.',
      codeIntro: 'Simulate air parcels rising and sinking due to temperature-driven buoyancy.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate convection of air parcels above a heat source
np.random.seed(42)
n_parcels = 30
dt = 0.1  # time step (seconds)
g = 9.81  # gravity
T_ambient = 300  # ambient temperature (K)

# Initial positions and temperatures
x = np.random.uniform(2, 8, n_parcels)
y = np.random.uniform(0, 1, n_parcels)
T = T_ambient + np.random.uniform(50, 300, n_parcels)  # hot parcels
vy = np.zeros(n_parcels)  # vertical velocity

# Simulate 50 time steps
fig, axes = plt.subplots(1, 3, figsize=(12, 5))
snapshots = [0, 25, 49]
titles = ['t = 0s (just heated)', 't = 2.5s (rising)', 't = 5s (convection)']

for step in range(50):
    # Buoyancy acceleration: hotter parcels rise, cooler ones sink
    a = g * (T - T_ambient) / T_ambient

    # Update velocities and positions
    vy += a * dt
    vy *= 0.95  # air drag
    y += vy * dt

    # Parcels that reach the top cool down and sink
    cooling = y > 8
    T[cooling] -= 20
    T[T < T_ambient] = T_ambient

    # Parcels that sink to the bottom get reheated (near fire)
    reheating = y < 0.5
    T[reheating] = T_ambient + np.random.uniform(100, 300, reheating.sum())
    y[y < 0] = 0

    if step in snapshots:
        idx = snapshots.index(step)
        ax = axes[idx]
        sc = ax.scatter(x, y, c=T, cmap='hot', vmin=300, vmax=600, s=40)
        ax.set_xlim(0, 10)
        ax.set_ylim(-0.5, 10)
        ax.set_title(titles[idx], fontsize=11)
        ax.set_xlabel('x', fontsize=10)
        ax.set_ylabel('Height', fontsize=10)
        ax.axhline(0, color='gray', linewidth=2)
        ax.text(5, -0.3, 'FIRE', ha='center', fontsize=10, color='#ef4444')

plt.colorbar(sc, ax=axes, label='Temperature (K)')
plt.suptitle('Convection: Hot Air Parcels Rising Above a Fire', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Hot parcels (bright) rise fast. Cooled parcels (dark) sink.")
print("This creates the convection current that shapes every flame.")`,
      challenge: 'Add horizontal wind by giving all parcels a constant horizontal velocity (vx = 0.5 m/s). How does wind distort the convection pattern? This is why candle flames lean in a breeze.',
      successHint: 'You just simulated a fundamental atmospheric process. Convection drives weather patterns, ocean currents, and the interior dynamics of the Sun. The same code structure — updating positions based on forces each time step — is used in every physics simulation.',
    },
    {
      title: 'Radiation — Stefan-Boltzmann law and blackbody emission',
      concept: `All hot objects radiate energy as electromagnetic waves. The hotter the object, the more energy it radiates. The relationship is described by the **Stefan-Boltzmann law**:

**P = σ × A × T⁴**

Where σ = 5.67 × 10⁻⁸ W/(m²·K⁴), A = surface area, and T = temperature in Kelvin.

The T⁴ dependence is dramatic. Doubling the temperature increases radiation by 2⁴ = **16 times**. This is why a campfire at 1,000 K radiates vastly more than your body at 310 K, even though both emit infrared radiation.

The law also explains why flames change colour with temperature. Wien’s displacement law says the peak emission wavelength shifts: λ_max = 2,897,000 / T. At 1,000 K, the peak is in infrared (not visible), but the tail extends into red-orange. At 6,000 K (the Sun), the peak is at 483 nm — blue-green.`,
      analogy: 'Imagine heating a metal rod. At 500°C it glows dull red. At 1,000°C it glows orange. At 1,500°C it glows white. The rod emits ALL wavelengths at every temperature, but the peak shifts to shorter (bluer) wavelengths as temperature increases. It is like a radio station: turning up the temperature shifts the "frequency dial" toward blue.',
      storyConnection: 'Agni’s three forms — fire on Earth, lightning, and the Sun — correspond to increasing temperature and radiation power. A campfire (~1,000 K) radiates thousands of watts. Lightning (~30,000 K) radiates millions of watts in a flash. The Sun (~5,778 K surface) radiates 3.8 × 10²⁶ watts. All three are thermal radiation — Agni at different power levels.',
      checkQuestion: 'Your body temperature is about 310 K (37°C). Do you emit electromagnetic radiation? If so, at what wavelength?',
      checkAnswer: 'Yes! Using Wien’s law: λ_max = 2,897,000 / 310 ≈ 9,345 nm ≈ 9.3 μm. This is in the mid-infrared range — invisible to your eyes but easily detected by thermal cameras (which is exactly how they work). You radiate about 100 watts of infrared energy constantly. In a room full of people, the human bodies are significant heat sources.',
      codeIntro: 'Plot blackbody radiation curves for different temperatures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Planck's law: spectral radiance of a blackbody
def planck(wavelength_nm, T):
    """Spectral radiance in arbitrary units."""
    lam = wavelength_nm * 1e-9  # convert nm to metres
    h = 6.626e-34   # Planck's constant
    c = 3e8          # speed of light
    k = 1.381e-23    # Boltzmann constant
    # Avoid overflow
    exponent = h * c / (lam * k * T)
    exponent = np.clip(exponent, 0, 500)
    return (2 * h * c**2 / lam**5) / (np.exp(exponent) - 1)

wavelengths = np.linspace(100, 3000, 1000)  # nm

temperatures = [
    (1000, "Campfire (1000 K)", "#ef4444"),
    (2000, "Molten metal (2000 K)", "#f97316"),
    (3500, "Betelgeuse (3500 K)", "#fbbf24"),
    (5778, "Sun (5778 K)", "#fef08a"),
    (10000, "Hot star (10000 K)", "#93c5fd"),
]

plt.figure(figsize=(10, 6))
for T, label, color in temperatures:
    spectrum = planck(wavelengths, T)
    spectrum = spectrum / spectrum.max()  # normalise for comparison
    plt.plot(wavelengths, spectrum, linewidth=2, label=label, color=color)
    # Mark peak wavelength
    peak_wl = 2897000 / T
    if 100 < peak_wl < 3000:
        plt.axvline(peak_wl, color=color, linewidth=0.8, linestyle=':', alpha=0.5)

# Visible range
plt.axvspan(380, 700, alpha=0.1, color='white')
plt.text(540, 0.95, 'Visible', fontsize=10, ha='center', color='lightgray')

plt.xlabel('Wavelength (nm)', fontsize=12)
plt.ylabel('Relative intensity', fontsize=12)
plt.title('Blackbody Radiation at Different Temperatures', fontsize=14)
plt.legend(fontsize=9)
plt.xlim(100, 3000)
plt.grid(alpha=0.2)
plt.tight_layout()
plt.show()

print("Hotter objects peak at shorter wavelengths (Wien’s law).")
print(f"Sun peak: {2897000/5778:.0f} nm (blue-green — but appears white")
print(f"because it emits strongly across the entire visible range)")`,
      challenge: 'Calculate the total power radiated by a campfire (T=1000 K, surface area = 0.5 m²) and the Sun (T=5778 K, surface area = 6.08 × 10¹⁸ m²) using P = σAT⁴. How many campfires would you need to equal the Sun?',
      successHint: 'Blackbody radiation is one of the most important concepts in physics. It explains star colours, thermal cameras, incandescent light bulbs, and was the problem that led Max Planck to discover quantum mechanics in 1900.',
    },
    {
      title: 'Complete vs incomplete combustion — efficiency and pollution',
      concept: `Combustion can be **complete** or **incomplete**, depending on oxygen supply:

**Complete**: CH₄ + 2O₂ → CO₂ + 2H₂O (plenty of O₂ — blue flame, maximum energy)
**Incomplete**: 2CH₄ + 3O₂ → 2CO + 4H₂O (limited O₂ — yellow flame, carbon monoxide)
**Very incomplete**: CH₄ + O₂ → C + 2H₂O (very limited O₂ — soot/smoke)

Incomplete combustion wastes fuel and produces dangerous carbon monoxide (CO) and soot. This is why gas stoves have blue flames (lots of air mixed in) while candles have yellow flames (limited air mixing).

In the code, you’ll calculate the energy output and pollutant production for different oxygen ratios, showing how combustion efficiency changes.`,
      analogy: 'Complete combustion is like fully wringing out a wet towel — you extract all the water (energy). Incomplete combustion is like giving it a half-hearted squeeze — you get some water out but a lot remains (wasted fuel, CO, soot). The towel is the fuel; the squeezing is the oxygen supply.',
      storyConnection: 'The Vedic sages maintained three different fires at different combustion levels: the bright offering fire (complete combustion, blue-white), the cooking fire (moderate, yellow-orange), and the ember fire (smouldering, minimal flame). They were empirically managing the oxygen-to-fuel ratio thousands of years before Lavoisier identified oxygen.',
      checkQuestion: 'Carbon monoxide (CO) from incomplete combustion is dangerous even in small amounts. Why is it called "the silent killer"?',
      checkAnswer: 'CO is colourless and odourless — you cannot see, smell, or taste it. It binds to haemoglobin in your blood 200× more strongly than oxygen, blocking oxygen transport. Even 0.1% CO in air can be lethal within hours. This is why proper ventilation in gas heating systems is critical, and why CO detectors save lives. Incomplete combustion in enclosed spaces is one of the most common causes of accidental poisoning worldwide.',
      codeIntro: 'Model combustion efficiency as a function of oxygen supply.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Oxygen ratio: actual O2 / stoichiometric O2 needed
# 1.0 = perfect (complete combustion)
# < 1.0 = oxygen-starved (incomplete)
# > 1.0 = excess air (complete but cooler)
o2_ratio = np.linspace(0.3, 1.5, 200)

# Energy efficiency (% of maximum)
# Below stoichiometric: efficiency drops
# Above stoichiometric: efficiency is ~100% but temperature drops
efficiency = np.where(o2_ratio < 1.0,
    100 * o2_ratio**1.5,  # incomplete: less energy per mole
    100 - 5 * (o2_ratio - 1.0)**2)  # excess air: slight cooling loss

# CO production (relative units)
co_production = np.where(o2_ratio < 1.0,
    100 * (1 - o2_ratio)**2,  # lots of CO when O2 is low
    0.1)  # negligible with excess oxygen

# Soot production
soot = np.where(o2_ratio < 0.7,
    100 * (0.7 - o2_ratio)**2 / 0.49,
    0)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8), sharex=True)

# Efficiency plot
ax1.plot(o2_ratio, efficiency, linewidth=2.5, color='#22c55e', label='Energy efficiency')
ax1.axvline(1.0, color='white', linewidth=1, linestyle=':', alpha=0.3)
ax1.text(1.01, 50, 'Stoichiometric\\n(perfect ratio)', fontsize=9, color='lightgray')
ax1.set_ylabel('Efficiency (%)', fontsize=11)
ax1.set_title('Combustion Efficiency vs Oxygen Supply', fontsize=14)
ax1.legend(fontsize=10)
ax1.grid(alpha=0.2)

# Pollutant plot
ax2.plot(o2_ratio, co_production, linewidth=2.5, color='#ef4444', label='CO (carbon monoxide)')
ax2.plot(o2_ratio, soot, linewidth=2.5, color='#6b7280', label='Soot (unburned carbon)')
ax2.axvline(1.0, color='white', linewidth=1, linestyle=':', alpha=0.3)
ax2.set_xlabel('Oxygen ratio (actual / stoichiometric)', fontsize=11)
ax2.set_ylabel('Relative production', fontsize=11)
ax2.set_title('Pollutant Production', fontsize=14)
ax2.legend(fontsize=10)
ax2.grid(alpha=0.2)

plt.tight_layout()
plt.show()

print("At O₂ ratio < 1.0: incomplete combustion → CO + soot + wasted energy")
print("At O₂ ratio = 1.0: perfect combustion → max energy, min pollution")
print("At O₂ ratio > 1.0: excess air cools the flame slightly")`,
      challenge: 'Real engines run at an O₂ ratio of about 1.05-1.15 (slight excess). Plot a zoomed view of the 0.9-1.3 range and add a shaded region showing the "optimal operating zone." Why is slight excess better than exactly 1.0?',
      successHint: 'Combustion efficiency is the central problem of engine design, power generation, and pollution control. Every car, furnace, and power plant is optimised to run as close to stoichiometric as possible while avoiding CO production. You now understand the chemistry behind air quality regulations.',
    },
    {
      title: 'Calorimetry — measuring the energy in food and fuel',
      concept: `How do we actually measure the energy released by combustion? The answer is **calorimetry**: burn the fuel inside an insulated container (a calorimeter) and measure the temperature rise of surrounding water.

**q = m × c × ΔT**

Where q = heat energy (J), m = mass of water (g), c = specific heat of water (4.186 J/g·°C), and ΔT = temperature change.

This is how food calories are measured. A food "calorie" (kcal) is the energy needed to heat 1 kg of water by 1°C. When a nutrition label says a peanut has 6 kcal, it means burning that peanut releases enough heat to warm 6 kg of water by 1°C.

In the code, you’ll simulate a calorimetry experiment: burning different fuels and calculating the energy released from the water temperature rise.`,
      analogy: 'A calorimeter is like a thermometer for energy. Instead of measuring how hot something is, it measures how much heat something releases. You capture ALL the heat in a known amount of water, then calculate backward: if the water got X degrees hotter, the fuel must have released Y joules.',
      storyConnection: 'The Vedic priests noticed that ghee-fed fires heated their clay pots faster than wood fires of the same size. They were observing calorimetric differences: ghee releases more energy per gram (37 kJ/g) than wood (15 kJ/g). A modern calorimeter confirms what the priests knew empirically: not all fuels are equal.',
      checkQuestion: 'A food calorimeter burns a 10-gram sample of cashew nuts in oxygen and the 2,000 g of surrounding water rises from 20°C to 35°C. What is the energy content of the cashews in kJ/g?',
      checkAnswer: 'q = m × c × ΔT = 2,000 g × 4.186 J/(g·°C) × 15°C = 125,580 J = 125.6 kJ. Per gram: 125.6 / 10 = 12.56 kJ/g. In food calories: 125.6 / 4.186 = 30 kcal, or 3 kcal per gram. This matches typical nut calorie values on nutrition labels. The calorimeter literally burns food to measure its energy — the same chemical process your body uses, just faster.',
      codeIntro: 'Simulate a calorimetry experiment for different fuels.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Calorimetry simulation
# Burn fuel samples, measure water temperature rise

water_mass = 500  # grams
water_c = 4.186   # J/(g·°C)
T_initial = 20.0  # °C

fuels = [
    {"name": "Wood",    "mass": 2.0, "energy_kJ_per_g": 15.0},
    {"name": "Ethanol", "mass": 2.0, "energy_kJ_per_g": 29.7},
    {"name": "Ghee",    "mass": 2.0, "energy_kJ_per_g": 37.0},
    {"name": "Methane", "mass": 2.0, "energy_kJ_per_g": 55.5},
    {"name": "Peanut",  "mass": 2.0, "energy_kJ_per_g": 26.0},
]

print(f"Calorimeter: {water_mass}g water at {T_initial}°C")
print(f"Burning 2.0g of each fuel\\n")
print(f"{'Fuel':<12} {'Energy (kJ)':>12} {'ΔT (°C)':>10} {'T_final':>10}")
print("-" * 48)

names = []
delta_Ts = []

for fuel in fuels:
    q = fuel["mass"] * fuel["energy_kJ_per_g"] * 1000  # convert to J
    dT = q / (water_mass * water_c)
    T_final = T_initial + dT
    names.append(fuel["name"])
    delta_Ts.append(dT)
    print(f"{fuel['name']:<12} {fuel['mass'] * fuel['energy_kJ_per_g']:>10.1f} kJ {dT:>10.2f} {T_final:>10.2f}")

# Plot
plt.figure(figsize=(10, 5))
colors = ['#92400e', '#a855f7', '#f59e0b', '#3b82f6', '#f97316']
bars = plt.bar(names, delta_Ts, color=colors, width=0.5)
plt.ylabel('Temperature rise (°C)', fontsize=11)
plt.title('Calorimetry: Which Fuel Heats Water Most?', fontsize=14)
plt.grid(axis='y', alpha=0.3)

# Add value labels on bars
for bar, dT in zip(bars, delta_Ts):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
             f'{dT:.1f}°C', ha='center', fontsize=10, color='lightgray')

plt.tight_layout()
plt.show()

print("\\nThe formula q = mcΔT connects heat energy to temperature change.")
print("This is how food calories, fuel ratings, and heating systems are measured.")`,
      challenge: 'Design a "reverse calorimeter": given a target water temperature of 60°C and 1,000 g of water, calculate how many grams of each fuel are needed. Which fuel requires the least mass?',
      successHint: 'Calorimetry connects the abstract concept of "energy" to something you can measure with a thermometer. The q = mcΔT equation is one of the most useful in all of science and engineering. You will use it in every future thermodynamics problem.',
    },
  ];

  const diagrams = [EnergyProfileDiagram, BalancingEquationDiagram, AgniHeatTransferDiagram, AgniSpectroscopyDiagram, AgniFlameColorDiagram, AgniCombustionTriangleDiagram];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for combustion and thermodynamics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
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
