import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import AgniCombustionTriangleDiagram from '../diagrams/AgniCombustionTriangleDiagram';
import AgniFlameColorDiagram from '../diagrams/AgniFlameColorDiagram';
import AgniHeatTransferDiagram from '../diagrams/AgniHeatTransferDiagram';
import AgniSpectroscopyDiagram from '../diagrams/AgniSpectroscopyDiagram';
import HeatTransferDiagram from '../diagrams/HeatTransferDiagram';
import EnergyBarChartDiagram from '../diagrams/EnergyBarChartDiagram';

export default function AgniLevel1() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'The combustion triangle — your first fire model',
      concept: `In Level 0 you learned that fire needs three things: **fuel**, **oxygen**, and **heat**. Now let’s turn that into code.

We’ll model the combustion triangle as a simple Python program. For each combination of the three ingredients, we check: are all three present? If yes → fire. If any one is missing → no fire.

This is a **boolean logic** problem. In Python, \`True and True and True\` gives \`True\`. \`True and True and False\` gives \`False\`. The \`and\` operator requires ALL conditions to be true — just like fire requires ALL three ingredients.

📚 *A boolean is a value that is either True or False. Named after mathematician George Boole.*`,
      analogy: 'Think of a three-legged stool. Remove any one leg and the stool falls over. The combustion triangle works the same way — each side supports the fire. Boolean AND logic captures this perfectly: all conditions must be True for the result to be True.',
      storyConnection: 'The Vedic yajna fire pit was engineered around the combustion triangle: dry wood arranged with gaps (fuel + airflow for oxygen), started with friction from arani sticks (heat). The priests understood that blocking any one ingredient killed the fire — they used this knowledge to control sacred flames for hours.',
      checkQuestion: 'In the code, what happens if you set oxygen = False but fuel and heat are both True?',
      checkAnswer: 'Fire = False. The AND operator requires all three to be True. With oxygen = False, the expression fuel and oxygen and heat evaluates to False. This models what happens when you cover a candle with a jar — you cut off oxygen and the fire dies.',
      codeIntro: 'Model the combustion triangle with boolean logic.',
      code: `# The Combustion Triangle as Code
# Fire needs ALL three: fuel, oxygen, heat

scenarios = [
    {"name": "Campfire",        "fuel": True,  "oxygen": True,  "heat": True},
    {"name": "Jar over candle", "fuel": True,  "oxygen": False, "heat": True},
    {"name": "Wet wood",        "fuel": True,  "oxygen": True,  "heat": False},
    {"name": "Empty fire pit",  "fuel": False, "oxygen": True,  "heat": True},
    {"name": "Yajna (ritual)",  "fuel": True,  "oxygen": True,  "heat": True},
    {"name": "Space vacuum",    "fuel": True,  "oxygen": False, "heat": True},
]

print("=== Combustion Triangle Checker ===\\n")
print(f"{'Scenario':<20} {'Fuel':>6} {'O₂':>6} {'Heat':>6}  {'Fire?':>6}")
print("-" * 52)

for s in scenarios:
    fire = s["fuel"] and s["oxygen"] and s["heat"]
    f = "✅ YES" if fire else "❌ NO"
    print(f"{s['name']:<20} {str(s['fuel']):>6} {str(s['oxygen']):>6} {str(s['heat']):>6}  {f:>6}")

print()
print("Rule: ALL three must be True for fire to exist.")
print("Remove ANY one → no fire. This is Boolean AND logic.")`,
      challenge: 'Add three more scenarios: "Forest fire", "Underwater flare" (special flares carry their own oxidiser!), and "Lightning strike on dry grass". Set the boolean values correctly for each.',
      successHint: 'You just modelled a real physical system with boolean logic. This is the foundation of computational thinking: take a real-world rule and express it as code. The combustion triangle is one of the simplest and most powerful models in chemistry.',
    },
    {
      title: 'Fuel energy — comparing fuels with data',
      concept: `Not all fuels are equal. Hydrogen releases 141,800 kJ per kg when burned — the most energy-dense chemical fuel known. Wood releases only 15,000 kJ per kg. The Vedic priests intuitively knew this: they used ghee (clarified butter, ~37,000 kJ/kg) to make the sacred fire burn hotter and brighter, not water or earth.

In the code below, you’ll store fuel data in a Python **dictionary** and calculate how much of each fuel is needed to boil 1 litre of water. The key formula is:

**Energy needed = mass × specific heat × temperature change**

For water: E = 1 kg × 4.186 kJ/(kg·°C) × 80°C = 334.9 kJ

Then: mass of fuel needed = E / fuel’s energy per kg

📚 *A dictionary maps keys to values: \`fuels["Methane"]\` returns all data about methane.*`,
      analogy: 'Fuel energy density is like battery capacity. A phone battery (small energy per gram) runs out fast. A car battery (more energy per gram) lasts longer. Hydrogen is like a super-battery — the most energy per gram of any fuel. But it is also a gas that is hard to store, which is why we do not put it in campfires.',
      storyConnection: 'When Vedic priests poured ghee into the sacred fire, the flames surged because ghee has 2.5× the energy density of wood. They were empirically selecting the most energetic readily available fuel — thousands of years before anyone measured kilojoules.',
      checkQuestion: 'If hydrogen has the most energy per kg, why don’t we use it for everything?',
      checkAnswer: 'Hydrogen is an extremely light gas at room temperature and pressure — storing it requires either high-pressure tanks (700 atm) or cooling it to -253°C (liquid hydrogen). It is also highly flammable and can leak through tiny gaps in containers. Energy density per kg is fantastic, but energy density per LITRE is poor unless compressed. This storage challenge is the main barrier to a "hydrogen economy."',
      codeIntro: 'Compare fuel energy densities and calculate how much of each fuel boils water.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Energy density of common fuels (kJ per kg)
fuels = {
    "Wood":     15000,
    "Coal":     24000,
    "Ghee":     37000,
    "Petrol":   46000,
    "Methane":  55500,
    "Hydrogen": 141800,
}

# Energy needed to heat 1 kg of water from 20°C to 100°C
E_needed = 1.0 * 4.186 * 80  # kJ (mass * specific heat * delta T)

print(f"Energy to boil 1L water: {E_needed:.1f} kJ\\n")
print(f"{'Fuel':<12} {'kJ/kg':>10} {'grams needed':>14}")
print("-" * 38)

names = list(fuels.keys())
energies = list(fuels.values())
grams_needed = []

for name, kj_per_kg in fuels.items():
    g = (E_needed / kj_per_kg) * 1000  # convert kg to grams
    grams_needed.append(g)
    print(f"{name:<12} {kj_per_kg:>10,} {g:>12.1f} g")

# Plot it
plt.figure(figsize=(10, 5))
colors = ['#92400e', '#374151', '#f59e0b', '#dc2626', '#3b82f6', '#8b5cf6']
plt.barh(names, energies, color=colors)
plt.xlabel('Energy density (kJ/kg)', fontsize=11)
plt.title('Fuel Energy Density Comparison', fontsize=14)
plt.grid(axis='x', alpha=0.3)
plt.tight_layout()
plt.show()

print("\\nHydrogen wins per kg — but try carrying hydrogen gas to a campfire!")`,
      challenge: 'Add "Ethanol" (29,700 kJ/kg) and "Propane" (50,300 kJ/kg) to the dictionary. Plot all 8 fuels. Then calculate: how many grams of each fuel would you need to heat 5 litres of water?',
      successHint: 'You just did your first energy calculation with real data. The formula E = m × c × ΔT is fundamental to thermodynamics. Every heating system, engine, and power plant is designed around this equation.',
    },
    {
      title: 'Combustion reactions — balancing equations with code',
      concept: `Fire is a chemical reaction. Specifically, it is the rapid combination of a fuel with oxygen, producing carbon dioxide, water, and energy. The balanced equation for methane burning is:

**CH₄ + 2O₂ → CO₂ + 2H₂O**

"Balanced" means the number of each type of atom is the same on both sides. Left side: 1 C, 4 H, 4 O. Right side: 1 C, 4 H, 4 O. Atoms are conserved — they rearrange but never appear or disappear.

In the code, you’ll represent chemical formulas as dictionaries of atom counts and verify that a reaction is balanced by checking that every element adds up on both sides.

📚 *The law of conservation of mass: matter is neither created nor destroyed in a chemical reaction. Lavoisier proved this in 1789.*`,
      analogy: 'Balancing a chemical equation is like balancing a recipe. If a recipe calls for 2 eggs and you crack 2 eggs, you have 2 eggshells and the contents of 2 eggs. Nothing new was created; nothing was lost. The ingredients just rearranged. In combustion: carbon and hydrogen from fuel + oxygen from air → CO₂ and H₂O. Same atoms, new molecules.',
      storyConnection: 'Agni’s mythological role as the "transformer" maps directly to chemical equations. The Vedic sages observed that when wood burns, the wood disappears but smoke, ash, and heat appear. They recognised transformation, not destruction. Modern chemistry confirms: the atoms in wood are still there — they have just rearranged into CO₂, H₂O, and ash (minerals).',
      checkQuestion: 'If atoms are never created or destroyed in combustion, where does the light and heat come from?',
      checkAnswer: 'The energy comes from chemical bonds. The bonds in the products (CO₂ and H₂O) are STRONGER (lower energy) than the bonds in the reactants (CH₄ and O₂). The difference in bond energies is released as heat and light. This is an exothermic reaction. E = mc² is technically at play too — the products are very slightly lighter than the reactants — but the mass difference is immeasurably small for chemical reactions.',
      codeIntro: 'Check whether a combustion reaction is balanced using atom-counting code.',
      code: `# Chemical equation balancer checker
# Represent each molecule as a dict of atom counts

def count_atoms(molecules):
    """Sum up all atoms across a list of (coefficient, formula) pairs."""
    total = {}
    for coeff, formula in molecules:
        for atom, count in formula.items():
            total[atom] = total.get(atom, 0) + coeff * count
    return total

# Methane combustion: CH4 + 2O2 -> CO2 + 2H2O
reactants = [
    (1, {"C": 1, "H": 4}),       # 1 CH4
    (2, {"O": 2}),                 # 2 O2
]
products = [
    (1, {"C": 1, "O": 2}),        # 1 CO2
    (2, {"H": 2, "O": 1}),        # 2 H2O
]

left = count_atoms(reactants)
right = count_atoms(products)

print("Methane Combustion: CH₄ + 2O₂ → CO₂ + 2H₂O\\n")
print(f"{'Atom':<8} {'Left':>6} {'Right':>6} {'Balanced?':>10}")
print("-" * 32)

all_atoms = set(list(left.keys()) + list(right.keys()))
balanced = True
for atom in sorted(all_atoms):
    l = left.get(atom, 0)
    r = right.get(atom, 0)
    ok = "✅" if l == r else "❌"
    if l != r: balanced = False
    print(f"{atom:<8} {l:>6} {r:>6} {ok:>10}")

print(f"\\nOverall: {'BALANCED ✅' if balanced else 'NOT BALANCED ❌'}")
print()
print("Every atom on the left appears on the right.")
print("Nothing created, nothing destroyed — just rearranged.")`,
      challenge: 'Add propane combustion: C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. Create new reactants and products lists and check if it balances. Then try an UNBALANCED version (use wrong coefficients) and see the checker catch it.',
      successHint: 'Atom counting is exactly how chemists verify equations. You just wrote a tool that does what students spend hours doing by hand. In later levels, you will extend this to predict products and calculate energy from bond energies.',
    },
    {
      title: 'Flame temperature — plotting the heat profile',
      concept: `A candle flame is not one uniform temperature. The dark zone near the wick is ~600°C. The bright yellow zone is ~1,000°C. The blue outer zone is ~1,200°C. The tip where it fades is ~1,400°C. These zones exist because different combustion conditions occur at different parts of the flame.

In the code, you’ll model the temperature profile of a candle flame along its vertical axis. The key insight is that temperature is not highest at the top — it peaks in the outer zone where oxygen supply is best, then drops at the very top as hot gases mix with cool air.

We will use NumPy arrays to represent height and temperature, and Matplotlib to plot the profile.

📚 *Temperature profiles appear everywhere in science: from ocean depths to atmospheric layers to CPU heat maps.*`,
      analogy: 'A flame’s temperature profile is like a mountain with a peak in the middle, not at the top. The base camp (wick) is moderate, the summit (outer zone) is hottest, and the air above gets cooler as you climb past the peak. If you only look at the tip, you miss where the real action is.',
      storyConnection: 'The Vedic sages identified three types of sacred fire by temperature and appearance: the steady household fire (low, orange), the offering fire (high, bright), and the ember fire (glowing coals). They were empirically mapping flame zones — what we now plot as a temperature profile.',
      checkQuestion: 'Why is the dark zone near the wick cooler than the zones above it?',
      checkAnswer: 'The dark zone contains wax vapour that has evaporated from the wick but has NOT yet ignited. It is too cool for combustion because the oxygen has not yet mixed with the fuel vapour. This zone is actually below the ignition temperature of wax (~300°C for paraffin). You can prove this: if you quickly pass a match through the dark zone, nothing happens. But touch it to the luminous zone and the match ignites instantly.',
      codeIntro: 'Plot the temperature profile of a candle flame from wick to tip.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Height above wick (cm)
height = np.linspace(0, 4.0, 200)

# Temperature model: rises, peaks at ~2.5 cm, then drops
# Using a skewed Gaussian to model the asymmetric profile
peak_height = 2.5
sigma = 1.2
T_base = 400    # dark zone
T_peak = 1400   # hottest point (outer zone)
T_ambient = 25  # room temperature

temp = T_ambient + (T_peak - T_ambient) * np.exp(-0.5 * ((height - peak_height) / sigma) ** 2)
# Below the wick, temperature is lower (dark zone)
temp[height < 0.8] = np.linspace(T_base, temp[height >= 0.8][0], sum(height < 0.8))

# Define flame zones
zones = [
    (0, 0.8, "Dark zone\\n(wax vapour)", "#374151", 0.15),
    (0.8, 2.0, "Luminous zone\\n(yellow glow)", "#f59e0b", 0.15),
    (2.0, 3.2, "Outer zone\\n(hottest, blue)", "#3b82f6", 0.15),
    (3.2, 4.0, "Tip\\n(cooling)", "#9ca3af", 0.1),
]

plt.figure(figsize=(10, 6))
plt.plot(height, temp, linewidth=2.5, color='#ef4444')

for lo, hi, label, color, alpha in zones:
    plt.axvspan(lo, hi, alpha=alpha, color=color)
    plt.text((lo + hi) / 2, T_peak * 0.92, label, ha='center',
             fontsize=9, color='lightgray')

plt.xlabel('Height above wick (cm)', fontsize=12)
plt.ylabel('Temperature (°C)', fontsize=12)
plt.title('Temperature Profile of a Candle Flame', fontsize=14)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()

print("Key insight: the hottest point is NOT at the tip!")
print(f"Peak temperature: {T_peak}°C at {peak_height} cm above wick")
print("The outer zone has the best oxygen supply → most complete combustion")`,
      challenge: 'Create a second curve for a Bunsen burner (peak temp ~1,500°C, narrower peak, almost no luminous zone). Plot both on the same chart. Why is the Bunsen burner hotter and bluer?',
      successHint: 'Temperature profiles reveal the physics hidden inside a flame. The same technique — plotting a variable along a spatial axis — is used in climate science, oceanography, materials engineering, and anywhere temperature varies with position.',
    },
    {
      title: 'Heat transfer modes — modelling conduction',
      concept: `Heat conducts through a solid by atom-to-atom vibration transfer. Metals are good conductors because they have free electrons that carry energy fast. Wood is a poor conductor because its molecular structure traps vibrations.

The rate of heat conduction is given by **Fourier’s law**:

**Q = k × A × (T₁ - T₂) / L**

Where k = thermal conductivity (W/m·K), A = cross-sectional area, T₁ - T₂ = temperature difference, and L = length.

Copper (k = 385) conducts ~2,000× better than wood (k = 0.17). This is why a copper pot handle gets hot fast but a wooden handle stays cool.

In the code, you’ll calculate heat flow through different materials and visualise which ones are the best and worst conductors.`,
      analogy: 'Imagine a line of people passing buckets of water. If they are standing close together and passing quickly (metal), the water moves fast down the line. If they are far apart and slow (wood), the water barely moves. Thermal conductivity is the speed of the bucket brigade.',
      storyConnection: 'The Vedic fire pit was built with specific materials: clay walls (poor conductor, keeps heat in) with a metal grate (good conductor, heats evenly). This is engineering heat transfer — using insulators to contain energy and conductors to distribute it. The same principle governs modern ovens, furnaces, and spacecraft heat shields.',
      checkQuestion: 'Why do metals feel cold when you touch them, even though they are the same temperature as the surrounding air?',
      checkAnswer: 'Your hand is warmer than room temperature (~37°C vs ~22°C). When you touch metal, its high thermal conductivity rapidly draws heat away from your skin, making it FEEL cold. Wood at the same temperature conducts heat slowly, so your hand stays warmer. The metal is not colder — it just steals your heat faster. Your nerves sense rate of heat loss, not actual temperature.',
      codeIntro: 'Calculate and compare thermal conductivity of common materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Thermal conductivity (W/m·K) for common materials
materials = {
    "Diamond":  2200,
    "Copper":   385,
    "Aluminium": 205,
    "Iron":     80,
    "Glass":    1.0,
    "Wood":     0.17,
    "Air":      0.026,
    "Styrofoam": 0.033,
}

# Calculate heat flow through a 1m², 1cm thick slab
# with 100°C on one side and 0°C on the other
A = 1.0    # m²
L = 0.01   # m (1 cm thick)
dT = 100   # °C difference

print("Heat flow through a 1cm slab (A=1m², ΔT=100°C)\\n")
print(f"{'Material':<14} {'k (W/m·K)':>12} {'Heat flow (W)':>14}")
print("-" * 42)

names = list(materials.keys())
k_values = list(materials.values())
heat_flows = []

for name, k in materials.items():
    Q = k * A * dT / L
    heat_flows.append(Q)
    print(f"{name:<14} {k:>12.3f} {Q:>14,.0f}")

# Log-scale bar chart (huge range from air to diamond)
plt.figure(figsize=(10, 5))
colors = ['#a855f7', '#f97316', '#94a3b8', '#6b7280',
          '#86efac', '#92400e', '#bfdbfe', '#fde68a']
plt.barh(names, k_values, color=colors)
plt.xscale('log')
plt.xlabel('Thermal conductivity (W/m·K) — log scale', fontsize=11)
plt.title('Thermal Conductivity: Conductors vs Insulators', fontsize=14)
plt.grid(axis='x', alpha=0.3)
plt.tight_layout()
plt.show()

print("\\nCopper conducts ~15,000× better than wood!")
print("This is why metal handles get hot and wooden handles stay cool.")`,
      challenge: 'Add a "Thermos vacuum" with k = 0.000001 (almost zero). Also try calculating: if you wrap a copper pipe with 2 cm of styrofoam, what is the total heat loss? (Hint: resistances in series add up.)',
      successHint: 'Fourier’s law is the foundation of thermal engineering. Every insulated building, every heat sink on a computer chip, and every cooking pot is designed using this equation. You now understand why some materials burn your hand and others protect it.',
    },
    {
      title: 'Flame colours and spectroscopy — reading light',
      concept: `When you heat an element, its electrons absorb energy and jump to higher energy levels. When they fall back, they emit light at specific wavelengths. Sodium emits at 589 nm (yellow). Copper at 510 nm (green). Each element has a unique **emission spectrum**.

In the code, you’ll create a simulated emission spectrum for several elements. The key data structure is a dictionary mapping element names to their characteristic wavelengths. You’ll plot these as vertical lines on a wavelength axis — this is exactly what a spectrometer produces.

This is how astronomers identify elements in stars: they capture starlight, split it with a prism, and match the spectral lines to known elements. The same science that explains firework colours reveals the composition of the Sun.

📚 *A spectrometer splits light into its component wavelengths. Every element produces a unique barcode of spectral lines.*`,
      analogy: 'Each element’s emission spectrum is like a fingerprint or a musical chord. Sodium always plays the same "note" (589 nm). Copper always plays its note (510 nm). When you see a flame or a star, you hear the "chord" of all elements present, and a spectrometer teases apart the individual notes.',
      storyConnection: 'Fireworks are modern spectroscopy in action. Strontium chloride for red, barium chloride for green, copper compounds for blue — each metal salt is chosen for the specific wavelength its electrons emit. The Diwali sky is a spectroscopy demonstration, and Agni is the energy source that excites those electrons.',
      checkQuestion: 'If you burn a mixture of sodium and copper salts together, what colour would you see?',
      checkAnswer: 'You would see a yellowish-green flame — a mix of sodium’s yellow (589 nm) and copper’s green (510 nm). Your eye perceives the blend, but a spectrometer would separate them into two distinct spectral lines. This is why spectroscopy is more precise than the human eye: it can identify individual elements even in a complex mixture.',
      codeIntro: 'Simulate emission spectra for elements used in flame tests.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Characteristic emission wavelengths (nm) for flame test elements
elements = {
    "Lithium":   [670],
    "Sodium":    [589],
    "Potassium": [766, 770],
    "Calcium":   [622],
    "Copper":    [510, 515],
    "Strontium": [650, 660],
    "Barium":    [524, 554],
}

# Map wavelength to approximate visible color
def wl_to_rgb(wl):
    if wl < 440:   return '#8b5cf6'  # violet
    elif wl < 490: return '#3b82f6'  # blue
    elif wl < 510: return '#06b6d4'  # cyan
    elif wl < 560: return '#22c55e'  # green
    elif wl < 590: return '#eab308'  # yellow
    elif wl < 630: return '#f97316'  # orange
    else:          return '#ef4444'  # red

fig, axes = plt.subplots(len(elements), 1, figsize=(10, 8), sharex=True)

for ax, (name, wavelengths) in zip(axes, elements.items()):
    for wl in wavelengths:
        color = wl_to_rgb(wl)
        ax.axvline(wl, color=color, linewidth=4, alpha=0.8)
        ax.text(wl, 0.6, f'{wl}nm', fontsize=8, ha='center', color='lightgray')
    ax.set_ylabel(name, fontsize=10, color='lightgray', rotation=0, ha='right')
    ax.set_xlim(380, 800)
    ax.set_ylim(0, 1)
    ax.set_yticks([])
    ax.patch.set_facecolor('#111827')

axes[-1].set_xlabel('Wavelength (nm)', fontsize=11, color='lightgray')
axes[0].set_title('Emission Spectra — Each Element’s Unique Light Fingerprint', fontsize=13)
plt.tight_layout()
plt.show()

print("Each element emits light at specific wavelengths.")
print("This is the same technique astronomers use to identify")
print("elements in stars millions of light-years away!")`,
      challenge: 'Add "Iron" with wavelengths [438, 527, 540] and "Hydrogen" with [410, 434, 486, 656]. Hydrogen’s four lines are the famous Balmer series — they were one of the first clues that led to quantum mechanics.',
      successHint: 'Spectroscopy is one of the most powerful tools in all of science. With nothing more than light, you can determine the chemical composition of a flame, a star, or a distant galaxy. The same atomic physics that makes fireworks colourful lets us read the universe.',
    },
  ];

  const diagrams = [AgniCombustionTriangleDiagram, EnergyBarChartDiagram, AgniFlameColorDiagram, AgniFlameColorDiagram, HeatTransferDiagram, AgniSpectroscopyDiagram];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior chemistry experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for combustion simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
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
