import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import AgniCombustionTriangleDiagram from '../diagrams/AgniCombustionTriangleDiagram';
import AgniFlameColorDiagram from '../diagrams/AgniFlameColorDiagram';
import AgniHeatTransferDiagram from '../diagrams/AgniHeatTransferDiagram';
import AgniSpectroscopyDiagram from '../diagrams/AgniSpectroscopyDiagram';
import EnergyProfileDiagram from '../diagrams/EnergyProfileDiagram';
import MolecularMotionDiagram from '../diagrams/MolecularMotionDiagram';

export default function AgniLevel3() {
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
      title: 'Hess\u2019s law \u2014 energy paths are state functions',
      concept: `In Level 2 you calculated combustion energy using bond energies. **Hess\u2019s law** says something profound: the total energy change of a reaction depends only on the initial and final states, not on the path taken.

If you burn carbon to CO\u2082 in one step: C + O\u2082 \u2192 CO\u2082 (\u0394H = -393 kJ)
Or in two steps: C + \u00bdO\u2082 \u2192 CO (\u0394H\u2081 = -111 kJ), then CO + \u00bdO\u2082 \u2192 CO\u2082 (\u0394H\u2082 = -283 kJ)
Total: -111 + (-283) = **-394 kJ** \u2014 essentially the same.

This is enormously useful because many reactions are hard to measure directly. But if you can break them into simpler steps whose energies are known, you can calculate the total.

In the code, you\u2019ll build a Hess\u2019s law calculator that combines known reaction enthalpies to find unknown ones.`,
      analogy: 'Hess\u2019s law is like altitude. Whether you climb a mountain by the steep path or the gentle switchback path, you end up at the same height. The total altitude gained is the same regardless of route. Enthalpy is the same: the energy difference between start and end is fixed, no matter how many intermediate steps you take.',
      storyConnection: 'In the yajna ritual, whether ghee was added slowly (gradual combustion) or poured all at once (rapid combustion), the total heat released was the same \u2014 because enthalpy is a state function. The sages observed that the total warmth from a measured amount of ghee was consistent, whether the fire burned slowly or flared up.',
      checkQuestion: 'If Hess\u2019s law means the path does not matter, why do catalysts exist? Do they violate Hess\u2019s law?',
      checkAnswer: 'No. Catalysts change the RATE of a reaction (lower activation energy = faster), but not the total energy change (\u0394H stays the same). Hess\u2019s law governs total energy; catalysts govern speed. A catalyst is like a shorter tunnel through the mountain \u2014 you arrive at the same altitude (same \u0394H) but get there faster (lower activation energy).',
      codeIntro: 'Build a Hess\u2019s law calculator from known reaction enthalpies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Known reaction enthalpies (kJ/mol)
known = {
    "C + O2 -> CO2":      -393.5,
    "C + 0.5O2 -> CO":    -110.5,
    "CO + 0.5O2 -> CO2":  -283.0,
    "H2 + 0.5O2 -> H2O":  -285.8,
    "CH4 + 2O2 -> CO2 + 2H2O": -890.4,
}

# Verify Hess's law: C -> CO -> CO2 should equal C -> CO2
path_direct = known["C + O2 -> CO2"]
path_two_step = known["C + 0.5O2 -> CO"] + known["CO + 0.5O2 -> CO2"]

print("=== Hess\u2019s Law Verification ===\\n")
print(f"Direct path:  C + O\u2082 \u2192 CO\u2082       = {path_direct:.1f} kJ")
print(f"Two-step:     C \u2192 CO \u2192 CO\u2082     = {path_two_step:.1f} kJ")
print(f"Difference:   {abs(path_direct - path_two_step):.1f} kJ")
print(f"Match: {'YES \u2705' if abs(path_direct - path_two_step) < 1 else 'NO \u274c'}\\n")

# Energy level diagram
fig, ax = plt.subplots(figsize=(10, 6))

levels = [
    (0, 1, "C + O\u2082", "#93c5fd"),
    (-110.5, 2, "CO + \u00bdO\u2082", "#fbbf24"),
    (-393.5, 3, "CO\u2082", "#86efac"),
]

for energy, x, label, color in levels:
    ax.plot([x - 0.3, x + 0.3], [energy, energy], linewidth=4, color=color)
    ax.text(x, energy + 12, label, ha='center', fontsize=11, color='lightgray')
    ax.text(x, energy - 18, f'{energy} kJ', ha='center', fontsize=10, color=color)

# Arrows
ax.annotate('', xy=(1.5, -110.5), xytext=(1.5, 0),
            arrowprops=dict(arrowstyle='->', color='#fbbf24', linewidth=2))
ax.text(1.7, -55, '\u0394H\u2081\\n-111 kJ', fontsize=9, color='#fbbf24')

ax.annotate('', xy=(2.5, -393.5), xytext=(2.5, -110.5),
            arrowprops=dict(arrowstyle='->', color='#86efac', linewidth=2))
ax.text(2.7, -252, '\u0394H\u2082\\n-283 kJ', fontsize=9, color='#86efac')

ax.annotate('', xy=(0.5, -393.5), xytext=(0.5, 0),
            arrowprops=dict(arrowstyle='->', color='#ef4444', linewidth=2))
ax.text(0.15, -197, '\u0394H\u2083\\n-394 kJ', fontsize=9, color='#ef4444')

ax.set_ylabel('Enthalpy (kJ/mol)', fontsize=12)
ax.set_title('Hess\u2019s Law: Path Independence of Enthalpy', fontsize=14)
ax.set_xticks([1, 2, 3])
ax.set_xticklabels(['Reactants', 'Intermediate', 'Products'])
ax.grid(alpha=0.2)
plt.tight_layout()
plt.show()

print("Whether you go directly or through an intermediate,")
print("the total energy change is the same. That is Hess\u2019s law.")`,
      challenge: 'Use Hess\u2019s law to find the enthalpy of formation of methane (C + 2H\u2082 \u2192 CH\u2084), given: C + O\u2082 \u2192 CO\u2082 (\u0394H = -393.5), H\u2082 + \u00bdO\u2082 \u2192 H\u2082O (\u0394H = -285.8), and CH\u2084 + 2O\u2082 \u2192 CO\u2082 + 2H\u2082O (\u0394H = -890.4).',
      successHint: 'Hess\u2019s law is the foundation of thermochemistry. It allows chemists to calculate the energy of reactions that cannot be measured directly. Every enthalpy table in a chemistry textbook relies on this principle.',
    },
    {
      title: 'Entropy and free energy \u2014 why fires burn spontaneously',
      concept: `Energy alone does not determine whether a reaction happens. You also need **entropy** \u2014 a measure of disorder. The **Gibbs free energy** combines both:

**\u0394G = \u0394H - T\u0394S**

A reaction is spontaneous when \u0394G < 0. For combustion: \u0394H is large and negative (exothermic) AND \u0394S is positive (gases are more disordered than solid wood). Both terms favour spontaneity, which is why fire \u2014 once started \u2014 keeps going.

But if \u0394G < 0, why does wood not burn spontaneously? Because there is a kinetic barrier (activation energy). Thermodynamics says the reaction SHOULD happen; kinetics says it needs a push to START. The match provides that push.

This distinction between "can it happen?" (thermodynamics, \u0394G) and "how fast?" (kinetics, activation energy) is one of the most important in all of chemistry.`,
      analogy: 'A ball at the top of a hill "wants" to roll down (negative \u0394G). But if there is a small lip at the edge, the ball stays put until someone gives it a nudge. Wood "wants" to burn (\u0394G is very negative) but the activation energy is the lip. A match is the nudge.',
      storyConnection: 'The Vedic concept of fire "hiding" in wood captures this beautifully. The energy is there (thermodynamic favourability), the reaction is ready (\u0394G < 0), but Agni remains dormant until coaxed out by the friction of arani sticks (activation energy provided). The sages understood the distinction between potential and actual fire.',
      checkQuestion: 'Ice melting at room temperature is endothermic (\u0394H > 0). Yet it happens spontaneously. Why?',
      checkAnswer: 'Because the entropy increase (\u0394S > 0, liquid water is more disordered than ice) is large enough that T\u0394S > \u0394H, making \u0394G negative. Specifically: \u0394H = +6.01 kJ/mol, \u0394S = +22 J/(mol\u00b7K), at 298 K: T\u0394S = 6.56 kJ/mol. So \u0394G = 6.01 - 6.56 = -0.55 kJ/mol. Barely negative, but enough. At 0\u00b0C (273 K): T\u0394S = 6.01 exactly \u2192 \u0394G = 0 \u2192 equilibrium (ice and water coexist).',
      codeIntro: 'Calculate Gibbs free energy for combustion and other reactions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Gibbs free energy: dG = dH - T*dS
# dG < 0 = spontaneous

reactions = [
    {"name": "CH\u2084 combustion", "dH": -890, "dS": -5.2},
    {"name": "C combustion", "dH": -394, "dS": 2.9},
    {"name": "H\u2082 combustion", "dH": -286, "dS": -163.2},
    {"name": "Fe rusting", "dH": -824, "dS": -549},
    {"name": "Ice melting", "dH": 6.01, "dS": 22.0},
    {"name": "Water boiling", "dH": 40.7, "dS": 109},
]

# Calculate dG at different temperatures
T_range = np.linspace(200, 500, 300)  # Kelvin

plt.figure(figsize=(10, 6))
for rxn in reactions:
    dG = rxn["dH"] - T_range * rxn["dS"] / 1000  # dS in J, convert to kJ
    plt.plot(T_range - 273.15, dG, linewidth=2, label=rxn["name"])

plt.axhline(0, color='white', linewidth=1, linestyle=':', alpha=0.4)
plt.text(230, 5, 'NOT spontaneous (\u0394G > 0)', fontsize=10, color='#fca5a5')
plt.text(230, -15, 'Spontaneous (\u0394G < 0)', fontsize=10, color='#86efac')

plt.xlabel('Temperature (\u00b0C)', fontsize=12)
plt.ylabel('\u0394G (kJ/mol)', fontsize=12)
plt.title('Gibbs Free Energy vs Temperature', fontsize=14)
plt.legend(fontsize=9, loc='best')
plt.grid(alpha=0.2)
plt.tight_layout()
plt.show()

# Print values at 25\u00b0C (298 K)
print("At 25\u00b0C (298 K):\\n")
print(f"{'Reaction':<20} {'\u0394H (kJ)':>10} {'\u0394S (J/K)':>10} {'\u0394G (kJ)':>10} {'Spontaneous?':>14}")
print("-" * 66)
for rxn in reactions:
    dG = rxn["dH"] - 298 * rxn["dS"] / 1000
    sp = "YES" if dG < 0 else "NO"
    print(f"{rxn['name']:<20} {rxn['dH']:>10.1f} {rxn['dS']:>10.1f} {dG:>10.1f} {sp:>14}")`,
      challenge: 'Find the temperature at which water boiling becomes spontaneous by solving \u0394G = 0 for T: T = \u0394H/\u0394S. Does your answer match the known boiling point of water (100\u00b0C)?',
      successHint: 'Gibbs free energy is the ultimate arbiter of chemical spontaneity. It combines the universe\u2019s two tendencies: minimise energy (enthalpy) and maximise disorder (entropy). Every reaction, biological or chemical, obeys this principle.',
    },
    {
      title: 'Flame dynamics \u2014 Navier-Stokes meets combustion',
      concept: `The shape and behaviour of a flame are governed by fluid dynamics. Hot combustion gases flow upward (convection), fresh air flows inward (entrainment), and the boundary between them determines the flame shape.

At a basic level, the velocity of the rising hot gas depends on the **Grashof number** \u2014 the ratio of buoyancy forces to viscous forces:

**Gr = g \u00d7 \u03b2 \u00d7 \u0394T \u00d7 L\u00b3 / \u03bd\u00b2**

Where g = gravity, \u03b2 = thermal expansion coefficient, \u0394T = temperature difference, L = characteristic length, and \u03bd = kinematic viscosity.

A large Grashof number means buoyancy dominates \u2014 strong convection, tall flame. A small Grashof number means viscosity dominates \u2014 weak convection, short flame. In microgravity (ISS), Gr \u2248 0, so there is NO convection and the flame is spherical.

In the code, you\u2019ll calculate flame height and velocity for different conditions.`,
      analogy: 'The Grashof number is like a tug-of-war between two teams: buoyancy (hot air wanting to rise) and viscosity (air resisting motion). At high Gr, buoyancy wins \u2192 vigorous convection, tall flame. At low Gr, viscosity wins \u2192 sluggish flow, short flame. In space, the buoyancy team has zero players (no gravity), so viscosity always wins.',
      storyConnection: 'The yajna fire pit geometry (deep, narrow) maximises the Grashof number by creating a tall column of hot air above a concentrated heat source. The "chimney effect" accelerates the convection flow, drawing in more oxygen and making the fire burn hotter. Ancient fire pit design is fluid dynamics engineering.',
      checkQuestion: 'On a very windy day, the Grashof number becomes less relevant. Why?',
      checkAnswer: 'Wind introduces forced convection, which overpowers the natural (buoyancy-driven) convection described by the Grashof number. The relevant parameter becomes the Reynolds number (Re = vL/\u03bd), which describes the ratio of inertial forces to viscous forces. High Re from wind creates turbulent flow, distorting the flame. In strong wind, the flame leans sideways because forced convection dominates buoyancy.',
      codeIntro: 'Calculate Grashof number and predicted flame behaviour for different conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Grashof number: Gr = g * beta * dT * L^3 / nu^2
g = 9.81         # m/s^2
beta = 1/300     # thermal expansion coefficient for air (1/T_ambient)
nu = 1.5e-5      # kinematic viscosity of air (m^2/s)

# Different conditions
conditions = [
    {"name": "Candle", "dT": 700, "L": 0.03},
    {"name": "Campfire", "dT": 800, "L": 0.3},
    {"name": "Forest fire", "dT": 900, "L": 3.0},
    {"name": "Industrial furnace", "dT": 1200, "L": 1.0},
    {"name": "ISS candle (g=0)", "dT": 700, "L": 0.03},
]

gravity_values = [9.81, 9.81, 9.81, 9.81, 0.0001]  # ISS ~0

print("=== Flame Fluid Dynamics ===\\n")
print(f"{'Condition':<22} {'Gr':>14} {'Flow type':<18} {'Flame shape'}")
print("-" * 72)

names = []
gr_values = []

for cond, grav in zip(conditions, gravity_values):
    Gr = grav * beta * cond["dT"] * cond["L"]**3 / nu**2
    flow = "Laminar" if Gr < 1e9 else "Turbulent"
    shape = "Spherical" if Gr < 100 else ("Tall teardrop" if Gr > 1e6 else "Short dome")
    print(f"{cond['name']:<22} {Gr:>14.2e} {flow:<18} {shape}")
    names.append(cond["name"])
    gr_values.append(max(Gr, 1))  # avoid log(0)

# Log-scale bar chart
plt.figure(figsize=(10, 5))
colors = ['#fbbf24', '#f97316', '#ef4444', '#8b5cf6', '#3b82f6']
plt.barh(names, gr_values, color=colors)
plt.xscale('log')
plt.xlabel('Grashof Number (log scale)', fontsize=11)
plt.title('Grashof Number \u2014 Predicting Flame Behaviour', fontsize=14)

# Regime annotations
plt.axvline(1e9, color='white', linewidth=1, linestyle=':', alpha=0.3)
plt.text(1e9, -0.3, 'Turbulent transition', fontsize=9, color='lightgray')

plt.grid(axis='x', alpha=0.2)
plt.tight_layout()
plt.show()

print("\\nHigher Gr = stronger convection = taller, more turbulent flames")
print("ISS: Gr \u2248 0 \u2192 no convection \u2192 spherical flame (diffusion only)")`,
      challenge: 'On Mars, gravity is 3.72 m/s\u00b2 (vs 9.81 on Earth). Calculate Gr for a candle on Mars and predict the flame shape. Would Martian flames be taller or shorter than Earth flames?',
      successHint: 'The Grashof number connects combustion to fluid dynamics. Understanding how buoyancy and viscosity compete allows engineers to design efficient burners, predict wildfire behaviour, and even plan fire safety for spacecraft.',
    },
    {
      title: 'Spectral line analysis \u2014 reading an unknown flame',
      concept: `In Level 1 you plotted known emission spectra. Now let\u2019s reverse the problem: given an unknown spectrum, identify which elements are present. This is the real challenge of spectroscopy.

The process:
1. Capture the spectrum of an unknown flame (wavelengths and intensities)
2. Compare each observed wavelength against a database of known emission lines
3. If a peak matches a known wavelength (within tolerance), the element is present

This is exactly how astronomers identify elements in distant stars. The Hubble Space Telescope captures starlight, a spectrograph separates it into wavelengths, and software compares the observed lines against a database of all known elements.

In the code, you\u2019ll build a spectral matching algorithm that identifies elements from an unknown emission spectrum.`,
      analogy: 'Spectral matching is like Shazam for light. Shazam records a song, extracts its key frequencies, and matches them against a database. A spectrometer records light, extracts its key wavelengths, and matches them against an element database. If the "notes" match sodium, the flame contains sodium.',
      storyConnection: 'The Vedic priests observed that different woods and offerings produced different coloured flames. Sandalwood gave a different hue than mango wood; ghee burned differently than sesame oil. They were doing qualitative spectroscopy \u2014 identifying materials by flame colour. Modern spectroscopy quantifies what they observed intuitively.',
      checkQuestion: 'If two elements have emission lines very close together (e.g., sodium at 589 nm and helium at 588 nm), how do scientists tell them apart?',
      checkAnswer: 'They use high-resolution spectrometers with narrow wavelength bins (< 0.1 nm resolution). At high resolution, the two lines appear as distinct peaks. Also, each element has MULTIPLE emission lines at different wavelengths. Sodium has lines at 589, 330, 569 nm; helium at 588, 447, 502, 668 nm. By checking all lines (not just one), the identification becomes unambiguous. This is why a "spectral fingerprint" uses the full pattern, not a single line.',
      codeIntro: 'Build a spectral matching algorithm to identify elements from unknown spectra.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Element database: known emission wavelengths (nm)
database = {
    "Sodium":    [589.0, 589.6, 330.2, 568.8],
    "Potassium": [766.5, 769.9, 404.4],
    "Lithium":   [670.8, 610.3, 460.3],
    "Copper":    [510.6, 515.3, 521.8],
    "Calcium":   [422.7, 612.2, 616.2],
    "Strontium": [460.7, 650.0, 687.8],
    "Barium":    [455.4, 493.4, 553.5],
}

# Unknown spectrum (mystery flame!)
# Simulated: peaks at these wavelengths
unknown_peaks = [589.1, 589.5, 510.8, 515.1, 330.0]

# Match unknown peaks against database
tolerance = 2.0  # nm

print("=== Spectral Analysis: Unknown Flame ===\\n")
print(f"Observed peaks (nm): {unknown_peaks}")
print(f"Matching tolerance: \u00b1{tolerance} nm\\n")

matches = {}
for peak in unknown_peaks:
    for element, lines in database.items():
        for line in lines:
            if abs(peak - line) <= tolerance:
                if element not in matches:
                    matches[element] = []
                matches[element].append((peak, line))

print("Identified elements:")
for element, hits in matches.items():
    confidence = len(hits) / len(database[element]) * 100
    print(f"  {element}: {len(hits)} lines matched ({confidence:.0f}% confidence)")
    for obs, ref in hits:
        print(f"    Observed {obs} nm \u2248 Reference {ref} nm")

# Plot the unknown spectrum with identifications
plt.figure(figsize=(12, 5))
wl = np.linspace(300, 800, 2000)
spectrum = np.zeros_like(wl)
for peak in unknown_peaks:
    spectrum += np.exp(-0.5 * ((wl - peak) / 1.5) ** 2)

plt.plot(wl, spectrum, color='white', linewidth=1.5, alpha=0.7)
plt.fill_between(wl, spectrum, alpha=0.2, color='white')

colors_map = {"Sodium": "#eab308", "Copper": "#22c55e", "Potassium": "#a855f7"}
for element, hits in matches.items():
    color = colors_map.get(element, "#ef4444")
    for obs, ref in hits:
        plt.axvline(ref, color=color, linewidth=2, linestyle='--', alpha=0.6)
        plt.text(ref, spectrum.max() * 0.85, element, fontsize=9,
                 ha='center', color=color, rotation=45)

plt.xlabel('Wavelength (nm)', fontsize=12)
plt.ylabel('Intensity', fontsize=12)
plt.title('Unknown Flame Spectrum with Element Identification', fontsize=14)
plt.grid(alpha=0.2)
plt.tight_layout()
plt.show()

print(f"\\nVerdict: This flame contains {' + '.join(matches.keys())}!")`,
      challenge: 'Create a second "unknown" flame with peaks at [670.5, 610.1, 460.5, 650.2, 688.0]. Run the same analysis. Which elements does it contain? How confident is the identification?',
      successHint: 'Spectral matching is used in astronomy, forensics, environmental monitoring, and quality control. The algorithm you built \u2014 peak detection + database comparison \u2014 is the core of every spectrometer software package.',
    },
    {
      title: 'Thermal equilibrium \u2014 Newton\u2019s law of cooling',
      concept: `When a hot object is placed in a cooler environment, it cools down. The rate of cooling depends on the temperature difference between the object and its surroundings. **Newton\u2019s law of cooling** states:

**dT/dt = -k(T - T_env)**

Where T = object temperature, T_env = environment temperature, and k = cooling constant. The solution is exponential:

**T(t) = T_env + (T\u2080 - T_env) \u00d7 e^(-kt)**

This means hot objects cool quickly at first (large temperature difference) and slow down as they approach room temperature. A cup of tea cools fastest in the first minute and barely changes after an hour.

In the code, you\u2019ll simulate cooling curves for different materials and conditions.`,
      analogy: 'Newton\u2019s cooling law is like water flowing between two tanks connected by a pipe. When the level difference (temperature difference) is large, water flows fast. As the levels equalise, flow slows to a trickle. Heat flows the same way \u2014 fastest when the temperature gap is largest.',
      storyConnection: 'After a yajna ritual, the sacred fire pit\u2019s cooling rate depended on its material: a clay pit cooled slowly (poor conductor, low k), while a metal vessel cooled quickly (good conductor, high k). The priests kept the Dakshinagni (southern fire) as embers partly because clay\u2019s slow cooling preserved heat for relighting.',
      checkQuestion: 'A forensic investigator finds a body and measures its temperature as 32\u00b0C (normal is 37\u00b0C, room is 22\u00b0C). Using Newton\u2019s cooling, approximately how long ago did death occur if k = 0.1/hour?',
      checkAnswer: 'T(t) = T_env + (T\u2080 - T_env) \u00d7 e^(-kt). Solving: 32 = 22 + (37 - 22) \u00d7 e^(-0.1t). 10 = 15 \u00d7 e^(-0.1t). e^(-0.1t) = 0.667. -0.1t = ln(0.667) = -0.405. t = 4.05 hours. Approximately 4 hours. This is a simplified version of the Henssge nomogram that forensic pathologists actually use to estimate time of death.',
      codeIntro: 'Simulate Newton\u2019s law of cooling for different objects and conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Newton's law of cooling: T(t) = T_env + (T0 - T_env) * e^(-kt)
T_env = 22  # room temperature (\u00b0C)

objects = [
    {"name": "Cup of tea", "T0": 90, "k": 0.05},
    {"name": "Metal spoon", "T0": 200, "k": 0.15},
    {"name": "Clay pot", "T0": 300, "k": 0.02},
    {"name": "Campfire embers", "T0": 600, "k": 0.008},
]

t = np.linspace(0, 120, 500)  # minutes

plt.figure(figsize=(10, 6))
for obj in objects:
    T = T_env + (obj["T0"] - T_env) * np.exp(-obj["k"] * t)
    plt.plot(t, T, linewidth=2.5, label=f"{obj['name']} (k={obj['k']})")

plt.axhline(T_env, color='white', linewidth=1, linestyle=':', alpha=0.3)
plt.text(115, T_env + 5, 'Room temp', fontsize=9, color='lightgray')

plt.xlabel('Time (minutes)', fontsize=12)
plt.ylabel('Temperature (\u00b0C)', fontsize=12)
plt.title('Newton\u2019s Law of Cooling', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.2)
plt.tight_layout()
plt.show()

# Calculate time to reach specific temperature
print("Time to cool to 50\u00b0C:\\n")
for obj in objects:
    if obj["T0"] > 50:
        t_cool = -np.log((50 - T_env) / (obj["T0"] - T_env)) / obj["k"]
        print(f"  {obj['name']:<22}: {t_cool:.1f} minutes")
    else:
        print(f"  {obj['name']:<22}: already below 50\u00b0C")

print("\\nKey insight: objects with small k (good insulators) cool MUCH slower.")
print("This is why clay pots keep food warm and metal pots cool quickly.")`,
      challenge: 'Add a "Thermos flask" with T0=90\u00b0C and k=0.001 (excellent insulation). How long does it take to reach 50\u00b0C? Compare to the cup of tea. Also: what happens if you set T_env to -10\u00b0C (winter outdoors)?',
      successHint: 'Newton\u2019s cooling law is used in forensics (time of death), food science (cooling curves), engineering (heat sink design), and climate modelling. The exponential decay pattern appears throughout physics wherever a driving force diminishes as equilibrium is approached.',
    },
    {
      title: 'Combustion engine thermodynamics \u2014 the Otto cycle',
      concept: `The internal combustion engine in cars converts the chemical energy of fuel into mechanical work. It operates on the **Otto cycle**, which has four strokes:

1. **Intake**: Air-fuel mixture drawn in (volume increases)
2. **Compression**: Piston compresses the mixture (volume decreases, T and P rise)
3. **Power**: Spark ignites the mixture, rapid combustion pushes piston down (work done)
4. **Exhaust**: Burned gases expelled

The **thermal efficiency** of an ideal Otto cycle is:

**\u03b7 = 1 - 1/r^(\u03b3-1)**

Where r = compression ratio (V_max / V_min) and \u03b3 = 1.4 for air. A compression ratio of 10:1 gives theoretical efficiency of 60%. Real engines achieve ~25-35% because of heat losses, friction, and incomplete combustion.

In the code, you\u2019ll model the Otto cycle on a pressure-volume (PV) diagram and calculate efficiency.`,
      analogy: 'The Otto cycle is like a slingshot. You pull back the band (compression \u2014 storing energy), release it (combustion \u2014 releasing energy), and the projectile flies (power stroke \u2014 useful work). The efficiency depends on how far back you pull (compression ratio). More compression = more efficient energy conversion.',
      storyConnection: 'Agni\u2019s transformation powers modern civilisation. Every car, truck, and motorcycle uses Agni\u2019s principle: convert stored chemical energy (fuel) into heat (combustion), then into mechanical work (moving pistons). The Vedic concept of fire as a transformer is literally what happens billions of times per second in engines worldwide.',
      checkQuestion: 'If higher compression ratios give better efficiency, why don\u2019t engines just use very high ratios like 20:1 or 30:1?',
      checkAnswer: 'At very high compression ratios, the air-fuel mixture gets so hot during compression that it ignites spontaneously BEFORE the spark plug fires \u2014 this is "engine knock" (pre-ignition), which damages the engine. Petrol engines are limited to about 12:1 for this reason. Diesel engines can use 20:1 because they inject fuel AFTER compression (no premature ignition). This is also why high-octane fuel (more resistant to pre-ignition) allows slightly higher compression ratios.',
      codeIntro: 'Model the Otto cycle and calculate engine efficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Otto cycle parameters
gamma = 1.4   # heat capacity ratio for air
r = 10        # compression ratio (V_max / V_min)

# Efficiency of ideal Otto cycle
eta = 1 - 1 / r**(gamma - 1)
print(f"Compression ratio: {r}:1")
print(f"Ideal Otto efficiency: {eta*100:.1f}%\\n")

# PV diagram
V_max = 1.0    # arbitrary units (cm\u00b3 normalised)
V_min = V_max / r
P1 = 1.0       # intake pressure (atm)
T1 = 300       # intake temperature (K)

# State points
# 1 -> 2: Adiabatic compression
V_12 = np.linspace(V_max, V_min, 100)
P_12 = P1 * (V_max / V_12)**gamma

# 2 -> 3: Constant volume heat addition (combustion)
P2 = P_12[-1]
T2 = T1 * r**(gamma - 1)
Q_in = 2000    # heat added (arbitrary units)
T3 = T2 + Q_in / 1.0  # simplified
P3 = P2 * T3 / T2

# 3 -> 4: Adiabatic expansion (power stroke)
V_34 = np.linspace(V_min, V_max, 100)
P_34 = P3 * (V_min / V_34)**gamma

# 4 -> 1: Constant volume heat rejection (exhaust)
P4 = P_34[-1]

plt.figure(figsize=(10, 6))
plt.plot(V_12, P_12, linewidth=2.5, color='#3b82f6', label='1\u21922 Compression')
plt.plot([V_min, V_min], [P2, P3], linewidth=2.5, color='#ef4444', label='2\u21923 Combustion')
plt.plot(V_34, P_34, linewidth=2.5, color='#22c55e', label='3\u21924 Power stroke')
plt.plot([V_max, V_max], [P4, P1], linewidth=2.5, color='#fbbf24', label='4\u21921 Exhaust')

# Label state points
for x, y, label in [(V_max, P1, '1'), (V_min, P2, '2'), (V_min, P3, '3'), (V_max, P4, '4')]:
    plt.plot(x, y, 'o', markersize=8, color='white')
    plt.text(x + 0.02, y, label, fontsize=12, color='white', fontweight='bold')

plt.xlabel('Volume (normalised)', fontsize=12)
plt.ylabel('Pressure (normalised)', fontsize=12)
plt.title(f'Otto Cycle PV Diagram (r = {r}:1, \u03b7 = {eta*100:.1f}%)', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.2)
plt.tight_layout()
plt.show()

# Efficiency vs compression ratio
r_range = np.linspace(2, 20, 100)
eta_range = 1 - 1 / r_range**(gamma - 1)

plt.figure(figsize=(10, 5))
plt.plot(r_range, eta_range * 100, linewidth=2.5, color='#f97316')
plt.axhline(35, color='#86efac', linewidth=1, linestyle='--', alpha=0.5)
plt.text(15, 36, 'Typical real engine', fontsize=10, color='#86efac')
plt.xlabel('Compression ratio', fontsize=12)
plt.ylabel('Ideal efficiency (%)', fontsize=12)
plt.title('Otto Cycle Efficiency vs Compression Ratio', fontsize=14)
plt.grid(alpha=0.2)
plt.tight_layout()
plt.show()

print("Higher compression ratio = higher efficiency")
print("But knock limit prevents ratios above ~12 for petrol engines")`,
      challenge: 'Compare the Otto cycle (spark ignition) to the Diesel cycle (compression ignition, r = 20). The Diesel efficiency formula is: \u03b7 = 1 - (1/r^(\u03b3-1)) \u00d7 (r_c^\u03b3 - 1) / (\u03b3(r_c - 1)), where r_c is the cutoff ratio (~2). Plot both efficiencies vs compression ratio.',
      successHint: 'The Otto cycle is the thermodynamic heart of over a billion vehicles worldwide. Understanding it connects combustion chemistry to mechanical engineering. Agni\u2019s transformation \u2014 fuel to heat to motion \u2014 is the foundational process of the industrial age.',
    },
  ];

  const diagrams = [EnergyProfileDiagram, MolecularMotionDiagram, AgniHeatTransferDiagram, AgniSpectroscopyDiagram, AgniFlameColorDiagram, AgniCombustionTriangleDiagram];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">University-level thermodynamics and spectroscopy</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced thermodynamics and spectral analysis. Click to start.</p>
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
