import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FireflyChemLevel1() {
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
      title: 'What is bioluminescence — life that makes light',
      concept: `**Bioluminescence** is the production of light by living organisms through chemical reactions. It has evolved independently at least 40 times across the tree of life, appearing in:

- **Fireflies** (beetles): yellow-green flashes for mating communication
- **Deep-sea fish** (anglerfish): lures prey with glowing bait
- **Jellyfish** (Aequorea victoria): green fluorescent protein (GFP), revolutionized biology
- **Dinoflagellates** (ocean plankton): blue glow when disturbed (bioluminescent bays)
- **Fungi** (foxfire): continuous dim green glow, possibly to attract spore-dispersing insects
- **Bacteria** (Vibrio fischeri): quorum sensing — glow only when population density is high

The basic chemistry is the same across all organisms: a substrate (**luciferin**) is oxidized by an enzyme (**luciferase**), producing light. But the specific molecules are different in each group — confirming that bioluminescence evolved independently each time.

Key fact: bioluminescence produces almost no heat. An incandescent bulb converts only ~5% of energy to light (95% heat). Fireflies convert ~90% of energy to light. This is why it's called "cold light."`,
      analogy: 'Bioluminescence is like a chemical glow stick. Crack the stick, two chemicals mix, and light is emitted without heat or electricity. Fireflies have the same reaction happening inside specialized cells — they just evolved it 100 million years before we manufactured it.',
      storyConnection: 'The story says fireflies don\'t burn because their light comes from a different place than fire. The science confirms this beautifully: fire is combustion (rapid oxidation with heat), bioluminescence is controlled oxidation (slow, enzymatic, almost all energy goes to light). Same chemistry (oxidation), completely different engineering.',
      checkQuestion: 'Bioluminescence has evolved 40+ times independently. Why is it so common? What survival advantage does making light provide?',
      checkAnswer: 'Multiple functions across different organisms: (1) Mating signals (fireflies), (2) Predator lures (anglerfish), (3) Counter-illumination camouflage (squid match the light from above so their silhouette disappears), (4) Startle/distract predators (some squid squirt luminous ink), (5) Illumination for hunting (flashlight fish), (6) Communication (bacteria). Light is useful in darkness — and 80% of the ocean is dark.',
      codeIntro: 'Visualize the diversity of bioluminescent organisms and their emission wavelengths.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Bioluminescent emission spectra
ax1.set_facecolor('#111827')
wavelengths = np.linspace(400, 700, 500)

organisms = [
    ('Firefly (Photinus)', 562, 30, '#84cc16', 'Yellow-green'),
    ('Jellyfish (GFP)', 509, 20, '#22c55e', 'Green'),
    ('Deep-sea shrimp', 470, 25, '#3b82f6', 'Blue'),
    ('Dinoflagellates', 475, 20, '#06b6d4', 'Blue-green'),
    ('Railroad worm (red)', 623, 25, '#ef4444', 'Red'),
    ('Fungi (foxfire)', 530, 30, '#a855f7', 'Green'),
]

for name, peak, width, color, _ in organisms:
    spectrum = np.exp(-((wavelengths - peak) / width)**2)
    ax1.plot(wavelengths, spectrum, color=color, linewidth=2, label=name)
    ax1.fill_between(wavelengths, spectrum, alpha=0.1, color=color)

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Relative intensity', color='white')
ax1.set_title('Bioluminescent Emission Spectra', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# 2. Distribution across the tree of life
ax2.set_facecolor('#111827')

groups = ['Deep-sea\\nfish', 'Jellyfish/\\ncorals', 'Squid/\\noctopus', 'Fireflies/\\nbeetles',
          'Marine\\nbacteria', 'Dino-\\nflagellates', 'Fungi', 'Worms']
n_species = [1500, 200, 70, 2000, 30, 68, 80, 100]
n_independent = [5, 3, 2, 1, 1, 1, 4, 3]  # independent evolutionary origins
colors_grp = ['#3b82f6', '#06b6d4', '#a855f7', '#84cc16', '#f59e0b', '#22c55e', '#ec4899', '#ef4444']

bars = ax2.bar(groups, n_species, color=colors_grp, alpha=0.8, edgecolor='white', linewidth=0.5)
for bar, n_ind in zip(bars, n_independent):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 30,
             f'{n_ind}× evolved', ha='center', color='white', fontsize=7)

ax2.set_ylabel('Estimated bioluminescent species', color='white')
ax2.set_title('Bioluminescence Across Life', color='white', fontsize=13)
ax2.tick_params(colors='gray', labelsize=8)

plt.tight_layout()
plt.show()

print("Bioluminescence facts:")
print("  Total bioluminescent species: ~10,000+")
print("  Independent evolutionary origins: 40+")
print("  Most common environment: deep ocean (90% of deep-sea organisms)")
print("  Most common color: blue-green (470-510nm)")
print("    Why? Water transmits blue light best → blue is visible farthest")
print("  Rarest color: red (only railroad worm and a few deep-sea fish)")`,
      challenge: 'Most ocean bioluminescence is blue (470nm). Most land bioluminescence is green-yellow (530-560nm). Why the difference? (Hint: think about what wavelength travels best in each medium.)',
      successHint: 'Bioluminescence is one of nature\'s most spectacular inventions — chemistry that makes light without fire. Understanding it opens doors to medical imaging, genetic engineering, and environmental monitoring.',
    },
    {
      title: 'The luciferin-luciferase reaction — the chemistry of cold light',
      concept: `All bioluminescence follows the same general scheme:

**Luciferin + O₂ → (luciferase enzyme) → Oxyluciferin* → Oxyluciferin + LIGHT**

Step by step:
1. **Luciferin** (the substrate) binds to **luciferase** (the enzyme)
2. Luciferase catalyzes the oxidation of luciferin by molecular oxygen (O₂)
3. The product (**oxyluciferin**) is initially in an excited electronic state (marked with *)
4. The excited molecule relaxes to its ground state, emitting a photon of light
5. The color depends on the energy gap between excited and ground states

In fireflies specifically:
- **Firefly luciferin** + **ATP** + **O₂** → (firefly luciferase) → **oxyluciferin** + **AMP** + **PPi** + **CO₂** + **LIGHT (562nm)**

ATP (adenosine triphosphate) is required — this links bioluminescence to cellular energy metabolism. A dead firefly can't glow because it can't make ATP.

Different organisms use different luciferins (at least 11 distinct types are known), confirming independent evolution. But the reaction logic — enzyme-catalyzed oxidation producing an excited state — is universal.`,
      analogy: 'The luciferin-luciferase reaction is like striking a match in slow motion. The match head (luciferin) contains stored chemical energy. The striker (luciferase) provides the activation energy to start the reaction. Oxygen drives the combustion. But unlike a match (which wastes 95% of energy as heat), the bioluminescent reaction channels >90% into light.',
      storyConnection: 'The story asks why fireflies don\'t burn. The answer is in the chemistry: the luciferase enzyme catalyzes the reaction so precisely that the energy is funneled almost entirely into photon emission, not molecular vibration (heat). Fire is uncontrolled oxidation. Bioluminescence is enzyme-controlled oxidation — same reaction, but with a molecular engineer (luciferase) directing the energy.',
      checkQuestion: 'If you mix purified luciferin, luciferase, ATP, and oxygen in a test tube, what happens?',
      checkAnswer: 'It glows! This was first demonstrated by Raphael Dubois in 1887. The reaction works outside the organism — it\'s pure chemistry, not some mystical "life force." This was a landmark experiment because it proved bioluminescence is a chemical reaction, not a biological mystery. Today, purified firefly luciferase is used in billions of dollars worth of medical and industrial assays.',
      codeIntro: 'Model the luciferin-luciferase reaction kinetics and light output.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Reaction kinetics: Michaelis-Menten model
ax1.set_facecolor('#111827')

# Enzyme kinetics: v = Vmax * [S] / (Km + [S])
luciferin_conc = np.linspace(0, 100, 200)  # μM
Vmax = 10  # μmol/min (max reaction rate)
Km = 15  # μM (Michaelis constant)

rate = Vmax * luciferin_conc / (Km + luciferin_conc)

ax1.plot(luciferin_conc, rate, color='#84cc16', linewidth=2.5)
ax1.axhline(Vmax, color='#f59e0b', linestyle='--', linewidth=1, label=f'Vmax = {Vmax}')
ax1.axhline(Vmax/2, color='#ef4444', linestyle=':', linewidth=1, label=f'Vmax/2 = {Vmax/2}')
ax1.axvline(Km, color='#ef4444', linestyle=':', linewidth=1)
ax1.annotate(f'Km = {Km} μM', xy=(Km, Vmax/2), xytext=(Km+10, Vmax/2+1),
             color='#ef4444', fontsize=9, arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax1.set_xlabel('[Luciferin] (μM)', color='white')
ax1.set_ylabel('Reaction rate (μmol/min)', color='white')
ax1.set_title('Firefly Luciferase Kinetics', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# 2. Flash kinetics: light output over time
ax2.set_facecolor('#111827')

# Simulate a firefly flash (rapid ATP release → luciferin oxidation → decay)
time = np.linspace(0, 2, 500)  # seconds

# Flash model: rapid rise, exponential decay
# Light = k * [luciferin] * [ATP] * exp(-k_decay * t)
k_rise = 20  # rate of reaction initiation
k_decay = 3  # rate of product inhibition

# Single flash
flash = (1 - np.exp(-k_rise * time)) * np.exp(-k_decay * time)
flash = flash / flash.max()

# Multiple flashes (pattern)
pattern_time = np.linspace(0, 10, 2000)
pattern = np.zeros_like(pattern_time)
flash_times = [0.5, 1.5, 2.5, 4.0, 5.0, 6.0, 7.5, 8.5, 9.5]
for ft in flash_times:
    dt = pattern_time - ft
    mask = dt >= 0
    single = np.zeros_like(pattern_time)
    single[mask] = (1 - np.exp(-k_rise * dt[mask])) * np.exp(-k_decay * dt[mask])
    pattern += single

pattern = pattern / pattern.max()

ax2.plot(pattern_time, pattern, color='#84cc16', linewidth=1.5)
ax2.fill_between(pattern_time, pattern, alpha=0.2, color='#84cc16')

ax2.set_xlabel('Time (seconds)', color='white')
ax2.set_ylabel('Light intensity (relative)', color='white')
ax2.set_title('Firefly Flash Pattern', color='white', fontsize=13)
ax2.tick_params(colors='gray')

# Annotate
ax2.text(2, 0.85, 'Species-specific\\nflash pattern', color='#f59e0b', fontsize=9,
         bbox=dict(boxstyle='round', facecolor='#f59e0b', alpha=0.2))

plt.tight_layout()
plt.show()

print("Firefly bioluminescence reaction:")
print("  Luciferin + ATP + O₂ → Oxyluciferin + AMP + PPi + CO₂ + hν (light)")
print()
print("Kinetics:")
print(f"  Km = {Km} μM (substrate concentration for half-max rate)")
print(f"  Vmax = {Vmax} μmol/min (maximum rate)")
print(f"  Flash duration: ~100-200 ms")
print(f"  Flash frequency: species-specific (used for mate recognition)")
print()
print("The flash pattern is a code: each species has a unique")
print("sequence of flashes. Males flash in flight; females respond from the ground.")`,
      challenge: 'What happens to the flash rate as temperature increases? Enzyme reactions speed up with temperature (roughly doubling per 10°C). Simulate the flash pattern at 20°C vs 30°C by doubling k_rise and k_decay.',
      successHint: 'The luciferin-luciferase reaction is one of the most important biochemical reactions in modern science — not because of fireflies, but because it\'s used as a reporter in thousands of medical and genetic assays. Understanding its kinetics is essential for biotechnology.',
    },
    {
      title: 'Quantum yield — the efficiency of biological light',
      concept: `**Quantum yield** (Φ) is the ratio of photons emitted to molecules of luciferin consumed:

Φ = photons emitted / luciferin molecules reacted

The firefly has a quantum yield of **0.88** — meaning 88% of the chemical energy is converted to light. This is extraordinary:

Comparison of light source efficiency:
- **Incandescent bulb**: ~2% of energy → visible light (rest is heat)
- **Fluorescent tube**: ~25%
- **LED**: ~30-50%
- **Firefly**: ~88% (and nearly 0% heat!)
- **Theoretical maximum**: 100% (every molecule produces one photon)

Why is the firefly so efficient? The luciferase enzyme holds the excited oxyluciferin in a rigid molecular cage that prevents the excitation energy from dissipating as heat (molecular vibrations). The energy has "nowhere to go" except as a photon. This is called a **tight binding pocket** — the enzyme forces the molecule to emit light rather than heat.

Lower-efficiency bioluminescence (e.g., bacteria at Φ ≈ 0.1) occurs when the excited molecule has more freedom to vibrate and lose energy thermally.`,
      analogy: 'Quantum yield is like the fraction of a ball\'s energy that goes into sound vs. heat when it bounces. A superball on a hard floor converts most energy to kinetic (elastic bounce) — high "quantum yield." A clay ball on carpet converts most energy to deformation and heat — low "quantum yield." The firefly\'s luciferase is like a molecular superball floor.',
      storyConnection: 'The story says fireflies don\'t burn. Quantitatively: a firefly converts 88% of chemical energy to light and only 12% to heat. A candle converts about 0.02% to light and 99.98% to heat. The firefly is 4,400× more efficient at making light than a candle. That\'s not "not burning" — that\'s operating in a completely different efficiency regime.',
      checkQuestion: 'If we could build an LED with firefly-level efficiency (88%), how would it change energy consumption?',
      checkAnswer: 'Current LEDs are 30-50% efficient (electrical energy to visible light). At 88%, the same LED would produce 1.8-2.9× more light per watt. Global lighting uses about 20% of electricity. If all lights were 88% efficient, we\'d save about 10% of global electricity — roughly equal to the entire electricity consumption of India. The firefly\'s quantum yield is a real engineering target.',
      codeIntro: 'Compare quantum yields and energy efficiency across light sources.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Quantum yield / efficiency comparison
ax1.set_facecolor('#111827')
sources = ['Candle', 'Incandescent', 'Fluorescent', 'LED\\n(current)', 'LED\\n(best)', 'Bacterial\\nbiolum.', 'Jellyfish', 'Firefly']
efficiency = [0.02, 2, 25, 40, 55, 10, 40, 88]
colors_eff = ['#ef4444', '#ef4444', '#f59e0b', '#22c55e', '#22c55e', '#3b82f6', '#06b6d4', '#84cc16']

bars = ax1.barh(sources, efficiency, color=colors_eff, alpha=0.8, edgecolor='white', linewidth=0.5)
for bar, eff in zip(bars, efficiency):
    ax1.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
             f'{eff}%', va='center', color='white', fontsize=10, fontweight='bold')

ax1.set_xlabel('Energy → Visible Light (%)', color='white')
ax1.set_title('Light Source Efficiency Comparison', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.set_xlim(0, 100)

# 2. Energy flow diagram: where does the energy go?
ax2.set_facecolor('#111827')

# Firefly energy budget
labels = ['Chemical\\nenergy\\n(100%)', 'Light\\n(88%)', 'Heat\\n(12%)']
sizes = [100, 88, 12]

# Incandescent bulb
labels_bulb = ['Electrical\\nenergy\\n(100%)', 'Light\\n(2%)', 'Heat\\n(98%)']
sizes_bulb = [100, 2, 98]

# Draw Sankey-style diagram (simplified)
y_positions = [0.7, 0.3]
names = ['Firefly', 'Light bulb']

for idx, (light_pct, heat_pct, name, y_base) in enumerate([
    (88, 12, 'Firefly', 0.55),
    (2, 98, 'Incandescent', 0.05)
]):
    # Input bar
    ax2.barh(y_base + 0.15, 1, 0.25, left=0, color='#f59e0b', alpha=0.5, edgecolor='white')
    ax2.text(0.5, y_base + 0.15, 'Energy in (100%)', ha='center', va='center', color='white', fontsize=8)

    # Light output
    light_width = light_pct / 100 * 0.25
    ax2.barh(y_base + 0.15, 0.8, light_width, left=1.2, color='#84cc16', alpha=0.8)
    ax2.text(1.6, y_base + 0.15 + light_width/2, f'Light ({light_pct}%)', ha='center', va='bottom', color='#84cc16', fontsize=8)

    # Heat output
    heat_width = heat_pct / 100 * 0.25
    ax2.barh(y_base + 0.15 - heat_width, 0.8, heat_width, left=1.2, color='#ef4444', alpha=0.5)
    ax2.text(1.6, y_base + 0.15 - heat_width/2, f'Heat ({heat_pct}%)', ha='center', va='top', color='#ef4444', fontsize=8)

    ax2.text(-0.1, y_base + 0.15, name, ha='right', va='center', color='white', fontsize=11, fontweight='bold')

ax2.set_xlim(-0.5, 2.5)
ax2.set_ylim(-0.15, 1)
ax2.set_title('Energy Flow: Firefly vs Light Bulb', color='white', fontsize=13)
ax2.axis('off')

plt.tight_layout()
plt.show()

print("Quantum yield comparison:")
print("  Firefly:       Φ = 0.88 (88 photons per 100 luciferin molecules)")
print("  Jellyfish:     Φ ≈ 0.40")
print("  Bacteria:      Φ ≈ 0.10")
print("  Dinoflagellate: Φ ≈ 0.15")
print()
print("Why the firefly is champion:")
print("  Tight enzyme binding pocket prevents energy loss to heat")
print("  Optimal molecular geometry for excited-state emission")
print("  88% efficiency → virtually no heating → 'cold light'")`,
      challenge: 'If a firefly produces 0.01 watts of light with 88% efficiency, how much total chemical power does it consume? How much heat does it generate? Compare to a candle (0.02% light efficiency) producing the same light output.',
      successHint: 'Quantum yield is the ultimate measure of light-production efficiency. The firefly sets the biological record at 88% — a number that human LED technology is still working to approach. Cold light is not magic; it\'s molecular engineering at its finest.',
    },
    {
      title: 'Other bioluminescent organisms — a glowing bestiary',
      concept: `Bioluminescence appears across an astonishing range of organisms:

**Anglerfish** (deep sea): A glowing lure dangles from the head, attracting prey in the pitch-dark deep ocean. The light comes from symbiotic bioluminescent bacteria living in the lure.

**Dinoflagellates** (ocean plankton): When disturbed by waves or boat propellers, they emit brief blue flashes. This creates the spectacular "bioluminescent bays" of Puerto Rico, Jamaica, and Vietnam. Purpose: startle predators and attract bigger predators to eat the attacker ("burglar alarm" hypothesis).

**Comb jellies** (ctenophores): Produce rainbow-like light patterns through cilia (hair-like structures) that scatter light, combined with true bioluminescence.

**Fungi** (foxfire): About 80 species of mushrooms glow green. The glow may attract insects that spread spores, or it may be a metabolic byproduct with no function.

**Glowworms** (cave-dwelling larvae): In New Zealand's Waitomo Caves, Arachnocampa larvae produce blue light to attract prey into sticky silk threads — living constellations on cave ceilings.`,
      analogy: 'The diversity of bioluminescence is like the diversity of human lighting: we use candles, incandescent bulbs, LEDs, neon signs, lasers, and screens — all producing light through different mechanisms for different purposes. Nature is equally creative: chemical reactions, symbiotic bacteria, protein fluorescence, and even physical light scattering.',
      storyConnection: 'Fireflies are the most familiar bioluminescent organism on land, but they\'re just one entry in nature\'s catalogue of living lights. The story focuses on fireflies because they\'re visible in Assam\'s forests — but the same chemistry drives lights across the planet, from deep-sea trenches to forest floors.',
      checkQuestion: 'Some deep-sea organisms produce red bioluminescence. Why is this rare and useful?',
      checkAnswer: 'Red light is rare in the deep ocean because most organisms produce blue/green (which travels farthest in water). This means most deep-sea eyes can\'t see red light — they have no red-sensitive photoreceptors. An organism with a red searchlight (like the dragonfish Malacosteus) can illuminate and see prey without being detected. It\'s a biological infrared spotlight — stealth technology.',
      codeIntro: 'Map the diversity of bioluminescent organisms by habitat, color, and function.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# 1. Bioluminescence by habitat and depth
ax1.set_facecolor('#0c1524')

habitats = {
    'Surface ocean\\n(0-200m)': [
        ('Dinoflagellates', 470, '#06b6d4', 50),
        ('Comb jellies', 490, '#3b82f6', 30),
    ],
    'Twilight zone\\n(200-1000m)': [
        ('Lanternfish', 475, '#3b82f6', 80),
        ('Hatchetfish', 480, '#3b82f6', 60),
        ('Squid', 490, '#06b6d4', 70),
    ],
    'Deep sea\\n(>1000m)': [
        ('Anglerfish', 470, '#3b82f6', 40),
        ('Dragonfish', 700, '#ef4444', 20),
        ('Giant squid', 480, '#3b82f6', 50),
    ],
    'Land': [
        ('Fireflies', 562, '#84cc16', 90),
        ('Glowworms', 487, '#22c55e', 30),
        ('Fungi', 530, '#a855f7', 20),
    ],
    'Freshwater': [
        ('Limpet (NZ)', 495, '#06b6d4', 5),
    ],
}

y_pos = 0
for habitat, organisms in habitats.items():
    ax1.text(-0.5, y_pos + len(organisms)/2, habitat, ha='right', va='center',
             color='white', fontsize=9, fontweight='bold')
    for i, (name, peak_wl, color, abundance) in enumerate(organisms):
        ax1.barh(y_pos, abundance, 0.8, color=color, alpha=0.7, edgecolor='white', linewidth=0.5)
        ax1.text(abundance + 2, y_pos, f'{name} ({peak_wl}nm)', va='center',
                 color='white', fontsize=8)
        y_pos += 1
    y_pos += 0.5

ax1.set_xlabel('Relative abundance (% of species in habitat)', color='white')
ax1.set_title('Bioluminescence Across Habitats', color='white', fontsize=13)
ax1.set_yticks([])
ax1.tick_params(colors='gray')

# 2. Functions of bioluminescence
ax2.set_facecolor('#111827')

functions = ['Mate\\nattraction', 'Prey\\nluring', 'Counter-\\nillumination', 'Predator\\nstartle', 'Illumination', 'Unknown/\\nbyproduct']
n_species = [2500, 500, 300, 400, 100, 200]
examples = ['Fireflies', 'Anglerfish', 'Squid', 'Dinoflag.', 'Flashlight\\nfish', 'Fungi']
colors_func = ['#ec4899', '#ef4444', '#3b82f6', '#f59e0b', '#84cc16', '#a855f7']

bars = ax2.bar(functions, n_species, color=colors_func, alpha=0.8, edgecolor='white', linewidth=0.5)
for bar, ex in zip(bars, examples):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 30,
             f'e.g. {ex}', ha='center', color='white', fontsize=7)

ax2.set_ylabel('Estimated species', color='white')
ax2.set_title('Functions of Bioluminescence', color='white', fontsize=13)
ax2.tick_params(colors='gray', labelsize=8)

plt.tight_layout()
plt.show()

print("Bioluminescence diversity:")
print("  Most species: deep ocean (90% of organisms below 200m glow)")
print("  Most common function: unknown! Many organisms glow for unclear reasons")
print("  Rarest: freshwater bioluminescence (almost nonexistent)")
print()
print("Notable organisms:")
print("  Anglerfish: bacteria in a lure → prey attraction")
print("  Hawaiian bobtail squid: bacteria in a light organ → camouflage")
print("  Dragonfish: RED bioluminescence → invisible searchlight")
print("  Foxfire fungi: green glow → possibly attracts spore dispersers")`,
      challenge: 'The Hawaiian bobtail squid harbors bioluminescent bacteria (Vibrio fischeri) in a specialized light organ. The bacteria only glow when their population density is high (quorum sensing). Why would bacteria evolve to glow only in groups?',
      successHint: 'Bioluminescence is one of evolution\'s most versatile inventions. The same basic chemistry has been adapted for communication, hunting, defense, and camouflage across thousands of species and billions of years.',
    },
    {
      title: 'Deep-sea glow — bioluminescence in the abyss',
      concept: `Below 200 meters in the ocean, sunlight disappears. Below 1000 meters, it's pitch dark. Yet **90% of deep-sea organisms produce bioluminescence** — making the deep ocean the largest bioluminescent habitat on Earth.

Why so much light in the dark?

**Counter-illumination camouflage**: Many mid-water organisms have light organs on their bellies that match the dim sunlight filtering from above. This eliminates their silhouette when viewed from below — making them invisible to predators looking up.

**Prey attraction**: Anglerfish use glowing lures. Siphonophores (colonial jellyfish) create glowing tentacle nets. Cookie-cutter sharks have a dark collar that may mimic a small fish's silhouette, attracting larger predators that the shark then bites.

**Burglar alarm**: When a small organism is being eaten by a medium one, it flashes brightly — attracting a LARGE predator that will eat the medium one, potentially freeing the small one. The flash is a distress signal to the predator's predator.

**Species recognition**: In the dark, bioluminescent patterns serve the same function as color patterns in shallow water — identifying species, sex, and readiness to mate.`,
      analogy: 'The deep sea is like a city at night. In a dark city, lights serve many purposes: streetlights for navigation, neon signs for advertising, car headlights for illumination, and emergency beacons for distress. Deep-sea bioluminescence serves exactly the same range of functions — the deep ocean is the universe\'s largest city of living lights.',
      storyConnection: 'Fireflies light up Assam\'s forests. Deep-sea creatures light up the ocean\'s darkness. The chemistry is different (firefly luciferin vs. coelenterazine, the most common marine luciferin), but the principle is identical: controlled oxidation producing cold light. The deep-sea "fireflies" outnumber the terrestrial ones by orders of magnitude.',
      checkQuestion: 'If 90% of deep-sea organisms glow, is the deep ocean actually dark? Or is it lit by bioluminescence?',
      checkAnswer: 'Paradoxically, it\'s still dark. Bioluminescent flashes are brief (milliseconds to seconds) and dim (a few photons per flash). The ocean is so vast that the total bioluminescent light is spread incredibly thin. It\'s like a stadium where 90% of fans have phone flashlights — each flash is visible, but the total doesn\'t illuminate the stadium. Cameras need long exposures to capture the cumulative glow.',
      codeIntro: 'Simulate the distribution of bioluminescence in the deep ocean.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# 1. Vertical distribution of bioluminescence with depth
ax1.set_facecolor('#0c1524')

depths = np.linspace(0, 4000, 100)

# Sunlight intensity (exponential decay)
sunlight = 100 * np.exp(-depths / 200)  # e-folding depth ~200m

# Bioluminescent organisms (% that are bioluminescent)
biolum_pct = np.where(depths < 200, 30 + depths/200 * 40,
                       np.where(depths < 1000, 70 + (depths-200)/800 * 20, 90))

# Flash frequency (events per cubic meter per hour)
flash_freq = biolum_pct * 0.5 * np.exp(-(depths - 800)**2 / 400000)

ax1.plot(sunlight, -depths, color='#f59e0b', linewidth=2, label='Sunlight (%)')
ax1.plot(biolum_pct, -depths, color='#22c55e', linewidth=2, label='% organisms that glow')
ax1.plot(flash_freq * 5, -depths, color='#3b82f6', linewidth=2, label='Flash frequency (×5)')

# Depth zones
zones = [
    (0, 200, 'Sunlit zone', '#f59e0b'),
    (200, 1000, 'Twilight zone', '#3b82f6'),
    (1000, 4000, 'Midnight zone', '#1e1b4b'),
]
for d_top, d_bottom, name, color in zones:
    ax1.axhspan(-d_bottom, -d_top, alpha=0.1, color=color)
    ax1.text(95, -(d_top + d_bottom)/2, name, color='white', fontsize=9,
             ha='right', va='center')

ax1.set_xlabel('Value (%)', color='white')
ax1.set_ylabel('Depth (m)', color='white')
ax1.set_title('Bioluminescence vs Depth', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9, loc='lower right')
ax1.tick_params(colors='gray')

# 2. Simulated deep-sea "light field"
ax2.set_facecolor('#020617')

# Random bioluminescent flashes in a volume of ocean
n_organisms = 200
x = np.random.uniform(0, 100, n_organisms)
y = np.random.uniform(0, 100, n_organisms)

# Some are flashing, most are dark
flashing = np.random.rand(n_organisms) < 0.15  # 15% flashing at any time
flash_colors = np.random.choice(['#3b82f6', '#06b6d4', '#22c55e', '#84cc16'],
                                 size=n_organisms, p=[0.5, 0.25, 0.15, 0.1])

# Plot dark organisms (barely visible)
ax2.scatter(x[~flashing], y[~flashing], s=5, c='#1e293b', alpha=0.3)

# Plot flashing organisms with glow effect
for xi, yi, ci in zip(x[flashing], y[flashing], flash_colors[flashing]):
    # Glow halo
    for radius, alpha in [(8, 0.03), (5, 0.08), (3, 0.15), (1.5, 0.3)]:
        circle = plt.Circle((xi, yi), radius, facecolor=ci, alpha=alpha, edgecolor='none')
        ax2.add_patch(circle)
    ax2.scatter(xi, yi, s=20, c=ci, zorder=5)

# Anglerfish with lure
ax2.scatter(70, 30, s=200, c='#1e293b', marker='>', zorder=3)
for r, a in [(4, 0.05), (2, 0.15), (1, 0.3)]:
    circle = plt.Circle((75, 33), r, facecolor='#22c55e', alpha=a, edgecolor='none')
    ax2.add_patch(circle)
ax2.scatter(75, 33, s=15, c='#22c55e', zorder=5)
ax2.text(78, 33, 'Anglerfish\\nlure', color='#22c55e', fontsize=7)

ax2.set_xlim(0, 100)
ax2.set_ylim(0, 100)
ax2.set_title('Deep Sea Light Field (snapshot)', color='white', fontsize=13)
ax2.set_xlabel('Horizontal (m)', color='white')
ax2.set_ylabel('Vertical (m)', color='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Deep-sea bioluminescence facts:")
print("  90% of organisms below 200m are bioluminescent")
print("  Most common color: blue-green (470-490nm)")
print("    Why: water transmits blue best → maximizes signaling range")
print("  Total bioluminescent light in the ocean: ~0.01% of sunlight")
print("    But it's the ONLY light below 1000m")
print()
print("Marine bioluminescence produces ~2-4 × 10¹⁸ photons/second globally")
print("That's comparable to a dim light bulb — spread across all oceans!")`,
      challenge: 'Calculate: if a deep-sea fish emits 10⁸ photons per flash at 470nm, how much energy is that? (Energy per photon E = hc/λ where h = 6.626×10⁻³⁴ J·s, c = 3×10⁸ m/s). Compare to the energy in a grain of rice.',
      successHint: 'The deep sea is the largest bioluminescent habitat on Earth — and the least explored. Every deep-sea dive reveals new species with new bioluminescent strategies. The chemistry of cold light is universal, but its applications are endlessly creative.',
    },
    {
      title: 'Applications — medical imaging, GFP, and beyond',
      concept: `Bioluminescence has become one of the most important tools in modern biology and medicine:

**Green Fluorescent Protein (GFP)**: Isolated from jellyfish *Aequorea victoria* in 1962 by Osamu Shimomura. The gene for GFP can be inserted into any organism, making specific cells glow green. This revolutionized cell biology — you can now literally watch individual proteins, cells, and organisms in real-time.

**Bioluminescence imaging (BLI)**: Firefly luciferase is inserted into cancer cells. The cells glow only where luciferin is provided. Researchers can track tumor growth, metastasis, and drug responses in living animals non-invasively. No radiation, no surgery — just measure the glow.

**ATP assays**: Firefly luciferase requires ATP. If you add luciferase + luciferin to a sample, the light output is proportional to ATP concentration. Used to detect: bacterial contamination (bacteria have ATP), cell viability, food safety.

**Drug screening**: Luciferase reporter genes are linked to disease-relevant genes. When a drug activates the target gene, cells glow. Pharmaceutical companies screen millions of compounds using bioluminescent assays.

The 2008 Nobel Prize in Chemistry was awarded to Shimomura, Chalfie, and Tsien "for the discovery and development of the green fluorescent protein, GFP." A jellyfish protein became one of the most important tools in all of biology.`,
      analogy: 'GFP is like a biological highlighter pen. Just as you highlight important text in a book, scientists use GFP to highlight specific proteins, cells, or organs in a living organism. The highlight glows green under blue light, making the invisible visible. And like a highlighter, it doesn\'t change the underlying text — the organism functions normally.',
      storyConnection: 'The firefly\'s cold light, which the story presents as a poetic mystery, has become one of the most practically important chemical reactions in modern science. Firefly luciferase assays are used in COVID testing, cancer research, food safety, and drug development. The firefly\'s gift to humanity goes far beyond beauty — it\'s a toolkit for understanding and treating disease.',
      checkQuestion: 'GFP glows green when illuminated with blue light (fluorescence). Firefly luciferase glows without any external light (bioluminescence). What\'s the fundamental difference?',
      checkAnswer: 'Fluorescence requires an external light source — GFP absorbs blue photons and re-emits green photons (lower energy). Bioluminescence generates its own light from a chemical reaction — no external light needed. GFP is useful for microscopy (where you control the light source). Luciferase is useful for whole-animal imaging (where external light can\'t penetrate tissue). Both are essential tools, for different applications.',
      codeIntro: 'Simulate a bioluminescence imaging experiment: tracking tumor growth with luciferase.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Simulate tumor growth over 6 weeks
# Tumor cells express firefly luciferase → glow when luciferin injected
weeks = [0, 1, 2, 3, 4, 5]
image_size = 60

for idx, week in enumerate(weeks):
    ax = axes[idx // 3][idx % 3]
    ax.set_facecolor('#020617')

    # Background (mouse body outline)
    mouse_y, mouse_x = np.mgrid[:image_size, :image_size]
    body = np.exp(-((mouse_x - 30)**2 / 300 + (mouse_y - 30)**2 / 150))
    ax.imshow(body * 0.05, cmap='gray', vmin=0, vmax=0.1)

    # Primary tumor (grows exponentially)
    tumor_radius = 2 + week * 1.5
    tumor_x, tumor_y = 25, 35
    tumor_signal = 1000 * (2 ** week)  # doubles each week
    r = np.sqrt((mouse_x - tumor_x)**2 + (mouse_y - tumor_y)**2)
    tumor_glow = tumor_signal * np.exp(-r**2 / (2 * tumor_radius**2))

    # Metastasis (appears at week 3)
    met_glow = np.zeros_like(tumor_glow)
    if week >= 3:
        met_x, met_y = 40, 20
        met_radius = 1 + (week - 3) * 1.2
        met_signal = 200 * (2 ** (week - 3))
        r_met = np.sqrt((mouse_x - met_x)**2 + (mouse_y - met_y)**2)
        met_glow = met_signal * np.exp(-r_met**2 / (2 * met_radius**2))

    total_signal = tumor_glow + met_glow
    noise = np.random.poisson(np.maximum(total_signal * 0.01, 1)).astype(float)
    total_signal += noise

    # Display with hot colormap
    im = ax.imshow(total_signal, cmap='hot', vmin=0, vmax=tumor_signal * 0.8)
    ax.set_title(f'Week {week}: signal={tumor_signal + (met_signal if week >= 3 else 0):.0f}',
                 color='white', fontsize=10)
    ax.axis('off')

    if week >= 3:
        ax.annotate('Metastasis!', xy=(met_x, met_y), xytext=(met_x+5, met_y-5),
                     color='#22c55e', fontsize=8, arrowprops=dict(arrowstyle='->', color='#22c55e'))

plt.suptitle('Bioluminescence Imaging: Tracking Tumor Growth with Firefly Luciferase',
             color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Bioluminescence imaging (BLI) applications:")
print("  Cancer research: track tumor growth and metastasis in real-time")
print("  Drug testing: measure if a drug shrinks the tumor (signal decreases)")
print("  Gene expression: attach luciferase to any gene, watch when it turns on")
print("  Infection tracking: make bacteria express luciferase, watch them spread")
print()
print("Advantages over other imaging:")
print("  No radiation (unlike CT/PET)")
print("  Non-invasive (no surgery)")
print("  Quantitative (light ∝ cell count)")
print("  Longitudinal (same animal, many timepoints)")
print()
print("The firefly's cold light → one of medicine's most powerful imaging tools")`,
      challenge: 'A researcher notices the bioluminescence signal from a tumor-bearing mouse decreases by 50% after drug treatment. Does this mean 50% of the tumor cells died? What other explanations are there?',
      successHint: 'From a firefly\'s flash to tracking cancer in living organisms — bioluminescence has become one of the most important tools in biomedical research. The 2008 Nobel Prize for GFP confirmed what the firefly always knew: cold light is the most powerful kind.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Bioluminescence Chemistry — no prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for bioluminescence simulations. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}