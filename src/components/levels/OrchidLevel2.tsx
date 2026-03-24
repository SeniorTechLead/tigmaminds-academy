import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function OrchidLevel2() {
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
      title: 'Chromatography — separating pigments by molecular properties',
      concept: `In Level 1, we learned that flower colour comes from pigments. But how do scientists identify which pigments are in a petal? The answer is **chromatography** — one of the most powerful separation techniques in chemistry.

**Paper chromatography** (the simplest version):
1. Crush the petal in a solvent (alcohol or acetone)
2. Place a dot of the extract on filter paper
3. Let the solvent travel up the paper by capillary action
4. Different pigments travel at different speeds based on their **polarity** and **molecular weight**

The key measurement is **Rf** (retention factor):
- Rf = distance pigment moved / distance solvent moved
- Each pigment has a characteristic Rf value
- Rf ranges from 0 (didn't move) to 1 (moved with the solvent front)

**Non-polar** pigments (like carotenoids) dissolve easily in the solvent and travel far (high Rf). **Polar** pigments (like anthocyanins) stick to the paper and travel less (low Rf).`,
      analogy: 'Chromatography is like a race on a muddy field. Some runners (non-polar pigments) wear cleats and move fast on the mud. Others (polar pigments) wear smooth shoes and get stuck. By seeing who finishes where, you know what shoes (molecular properties) each runner has.',
      storyConnection: 'The orchid\'s colours looked like a single sunset, but chromatography would reveal the hidden complexity — dozens of individual pigment molecules, each contributing a fraction of the final colour. Science sees what the eye cannot.',
      checkQuestion: 'If you run chromatography on a green leaf, you won\'t see just green. Why? What colours will you see?',
      checkAnswer: 'A green leaf contains multiple pigments: chlorophyll a (blue-green, Rf ~0.59), chlorophyll b (yellow-green, Rf ~0.42), carotenoids (yellow-orange, Rf ~0.95), and xanthophylls (yellow, Rf ~0.71). The green you see is the sum of all of these — chromatography separates them into distinct bands.',
      codeIntro: 'Simulate a paper chromatography experiment with plant pigments.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulated chromatography of orchid petal extract
pigments = [
    {'name': 'Beta-carotene', 'Rf': 0.95, 'color': '#ff8c00', 'type': 'Carotenoid'},
    {'name': 'Xanthophyll', 'Rf': 0.71, 'color': '#ffd700', 'type': 'Carotenoid'},
    {'name': 'Chlorophyll a', 'Rf': 0.59, 'color': '#228b22', 'type': 'Chlorophyll'},
    {'name': 'Chlorophyll b', 'Rf': 0.42, 'color': '#90ee90', 'type': 'Chlorophyll'},
    {'name': 'Anthocyanin (cyanidin)', 'Rf': 0.15, 'color': '#8b008b', 'type': 'Anthocyanin'},
    {'name': 'Anthocyanin (delphinidin)', 'Rf': 0.10, 'color': '#4b0082', 'type': 'Anthocyanin'},
]

solvent_front = 10  # cm from origin

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 7))
fig.patch.set_facecolor('#1f2937')

# Left: chromatography "paper"
ax1.set_facecolor('#f5f0e1')  # paper color
ax1.set_xlim(-1, 3)
ax1.set_ylim(-0.5, 11.5)

# Draw origin line
ax1.axhline(0, color='gray', linestyle='--', linewidth=0.5)
ax1.text(-0.8, 0, 'Origin', fontsize=8, color='gray')

# Draw solvent front
ax1.axhline(solvent_front, color='#3b82f6', linestyle='--', linewidth=1)
ax1.text(-0.8, solvent_front, 'Solvent\\nfront', fontsize=8, color='#3b82f6')

# Draw pigment spots
for p in pigments:
    y = p['Rf'] * solvent_front
    # Gaussian blob for each pigment spot
    spot = plt.Circle((1, y), 0.3, color=p['color'], alpha=0.7)
    ax1.add_patch(spot)
    ax1.text(1.8, y, f"{p['name']}\\nRf = {p['Rf']}", fontsize=7,
             va='center', color='#333')

ax1.set_title('Chromatography Paper', color='#333', fontsize=12)
ax1.set_ylabel('Distance from origin (cm)', color='#333')
ax1.set_xticks([])
ax1.tick_params(axis='y', colors='#333')

# Right: Rf values as bar chart
ax2.set_facecolor('#111827')
names = [p['name'] for p in pigments]
rfs = [p['Rf'] for p in pigments]
colors = [p['color'] for p in pigments]

bars = ax2.barh(range(len(pigments)), rfs, color=colors, alpha=0.85, edgecolor='white', linewidth=0.5)
ax2.set_yticks(range(len(pigments)))
ax2.set_yticklabels(names, color='white', fontsize=9)
ax2.set_xlabel('Rf value', color='white')
ax2.set_title('Retention Factor (Rf) Values', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 1.1)
ax2.axvline(0.5, color='gray', linestyle=':', linewidth=0.5)

for bar, rf in zip(bars, rfs):
    ax2.text(bar.get_width() + 0.02, bar.get_y() + bar.get_height()/2,
             f'{rf:.2f}', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Rf interpretation:")
print("  High Rf (>0.7): non-polar molecules (dissolve in solvent, travel far)")
print("  Low Rf (<0.3): polar molecules (stick to paper, travel little)")
print()
print("Beta-carotene (Rf=0.95): very non-polar, travels almost to solvent front")
print("Anthocyanins (Rf~0.1): very polar, barely moves from origin")
print()
print("This single technique can identify dozens of pigments in one experiment.")`,
      challenge: 'If you changed the solvent from acetone to water (more polar), would the Rf values increase or decrease for non-polar pigments? Modify the Rf values accordingly and re-run.',
      successHint: 'Chromatography is used everywhere: drug testing, forensics, food safety, environmental monitoring. Understanding Rf values means understanding molecular interactions — the foundation of analytical chemistry.',
    },
    {
      title: 'Absorption spectra — the fingerprint of every pigment',
      concept: `Every pigment molecule has a unique **absorption spectrum** — a plot of how much light it absorbs at each wavelength. This is the molecule's "fingerprint" because no two different molecules have the same spectrum.

A spectrophotometer measures absorption:
1. Shine white light through a pigment solution
2. Measure how much light comes through at each wavelength
3. Wavelengths with high absorption = the pigment is "eating" that light
4. Wavelengths with low absorption = that light passes through (and reaches your eye)

**Beer-Lambert Law**: A = epsilon * c * l
- A = absorbance (no units)
- epsilon = molar absorptivity (how strongly the molecule absorbs — intrinsic property)
- c = concentration (mol/L)
- l = path length (cm)

This law is linear: double the concentration, double the absorbance. This allows scientists to measure unknown concentrations by comparing absorbance to a standard curve.`,
      analogy: 'An absorption spectrum is like a voice print. Every person\'s voice has unique frequencies. Every pigment has unique absorption wavelengths. A spectrophotometer is the "ear" that listens to what wavelengths are being "eaten" by the molecule.',
      storyConnection: 'The orchid\'s colours are not just visual — they are molecular signatures. Each pigment absorbs specific wavelengths with precision tuned by millions of years of evolution. A spectrophotometer can read these signatures like sheet music.',
      checkQuestion: 'If a solution looks purple, what wavelengths is it absorbing?',
      checkAnswer: 'Purple means the solution absorbs green and yellow light (~500-580nm) and transmits red and blue. Your eye blends the transmitted red and blue into purple. The absorption spectrum would show a peak around 530-560nm.',
      codeIntro: 'Simulate absorption spectra and the Beer-Lambert law.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelength = np.linspace(380, 750, 500)

def gaussian(x, mu, sigma, amp):
    return amp * np.exp(-0.5 * ((x - mu) / sigma) ** 2)

# Absorption spectra of key pigments
spectra = {
    'Chlorophyll a': gaussian(wavelength, 430, 15, 0.85) + gaussian(wavelength, 662, 18, 0.72),
    'Chlorophyll b': gaussian(wavelength, 453, 15, 0.70) + gaussian(wavelength, 642, 18, 0.55),
    'Beta-carotene': gaussian(wavelength, 450, 20, 0.90) + gaussian(wavelength, 475, 18, 0.80),
    'Cyanidin (anthocyanin)': gaussian(wavelength, 535, 35, 0.75),
}
colors = ['#22c55e', '#86efac', '#f59e0b', '#a855f7']

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# Top: absorption spectra
ax1.set_facecolor('#111827')
for (name, spectrum), color in zip(spectra.items(), colors):
    ax1.plot(wavelength, spectrum, linewidth=2, label=name, color=color)
    ax1.fill_between(wavelength, spectrum, alpha=0.1, color=color)

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Absorbance', color='white')
ax1.set_title('Absorption Spectra: Pigment Fingerprints', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Bottom: Beer-Lambert law demonstration
ax2.set_facecolor('#111827')
concentrations = np.linspace(0, 0.1, 100)  # mol/L
epsilon = 15000  # L/(mol*cm), typical for chlorophyll
path_length = 1  # cm

absorbance = epsilon * concentrations * path_length

ax2.plot(concentrations * 1000, absorbance, color='#22c55e', linewidth=2)
ax2.set_xlabel('Concentration (mmol/L)', color='white')
ax2.set_ylabel('Absorbance at 662nm', color='white')
ax2.set_title('Beer-Lambert Law: Absorbance vs Concentration (Chlorophyll a)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# Mark a "measurement"
unknown_conc = 0.05
unknown_abs = epsilon * unknown_conc * path_length
ax2.plot(unknown_conc * 1000, unknown_abs, 'o', color='#ef4444', markersize=10)
ax2.annotate(f'Unknown sample\\nA = {unknown_abs:.0f}\\nc = {unknown_conc*1000:.0f} mmol/L',
             xy=(unknown_conc*1000, unknown_abs), xytext=(unknown_conc*1000+20, unknown_abs-200),
             color='#ef4444', fontsize=9, arrowprops=dict(arrowstyle='->', color='#ef4444'))

plt.tight_layout()
plt.show()

print("Beer-Lambert Law: A = epsilon * c * l")
print(f"  epsilon (chlorophyll a at 662nm) = {epsilon:,} L/(mol*cm)")
print(f"  path length = {path_length} cm")
print(f"  If A = {unknown_abs:.0f}, then c = A / (epsilon * l) = {unknown_conc*1000:.1f} mmol/L")
print()
print("This linear relationship lets us measure concentration")
print("from absorbance — the basis of all spectrophotometry.")`,
      challenge: 'What happens to the Beer-Lambert law at very high concentrations? (It breaks down — the relationship becomes non-linear.) Add a curve that shows this saturation effect at concentrations above 0.1 mol/L.',
      successHint: 'Spectrophotometry and Beer-Lambert are used daily in every hospital (blood tests), environmental lab (water quality), and research lab (protein quantification). This one equation is worth memorizing.',
    },
    {
      title: 'Photoreceptors — how plants see light without eyes',
      concept: `Plants don't have eyes, but they **respond to light** with remarkable precision. They detect light using **photoreceptor proteins** — molecular light sensors embedded in their cells.

The main plant photoreceptors:
- **Phytochromes**: detect red (660nm) and far-red (730nm) light. Control seed germination, flowering timing, shade avoidance. They act as a toggle switch — red light activates them, far-red deactivates them.
- **Cryptochromes**: detect blue light (~450nm) and UV-A. Control stem growth inhibition, circadian rhythms.
- **Phototropins**: detect blue light. Control phototropism (bending toward light), chloroplast movement, stomata opening.
- **UVR8**: detects UV-B (~280-315nm). Triggers UV-protective pigment production (like a molecular sunscreen alert).

The phytochrome system is especially elegant: under a forest canopy, most red light is absorbed by leaves above, but far-red passes through. So understory plants detect shade by the **ratio of red to far-red** — a biological light meter.`,
      analogy: 'Phytochrome is like a toggle switch (on/off). Red light flips it ON; far-red flips it OFF. The plant "reads" this switch thousands of times per second to know whether it\'s in sun or shade. Cryptochrome is like a dimmer switch for blue light — it adjusts smoothly rather than toggling.',
      storyConnection: 'The orchid in its tree-canopy home doesn\'t just passively receive light — it actively measures the quality of light using photoreceptors. Each epiphytic orchid adjusts its growth, flowering, and pigment production based on the precise mix of wavelengths filtering through the canopy above.',
      checkQuestion: 'Lettuce seeds need red light to germinate. If you bury them too deep, they won\'t sprout. Why does this make evolutionary sense?',
      checkAnswer: 'A seed buried deep has too much soil above it — the seedling would exhaust its energy reserves before reaching light. By requiring red light (which only penetrates the top few mm of soil), the seed ensures it only germinates when it\'s close enough to the surface to reach sunlight in time. Phytochrome is the safety check.',
      codeIntro: 'Model the phytochrome toggle and shade-avoidance response.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Phytochrome exists in two forms:
# Pr (inactive, absorbs red 660nm) <-> Pfr (active, absorbs far-red 730nm)
# Red light: Pr -> Pfr (activate)
# Far-red: Pfr -> Pr (deactivate)

# Simulate phytochrome ratio under different light conditions
conditions = ['Full sun', 'Light shade', 'Deep shade', 'Canopy gap', 'Sunset']
red_intensity = [1.0, 0.5, 0.1, 0.8, 0.3]  # relative red light
far_red_intensity = [1.0, 1.2, 1.5, 0.9, 1.3]  # far-red passes through leaves

# Pfr/Ptotal ratio (simplified: proportional to R/FR ratio)
pfr_ratio = [r / (r + fr) for r, fr in zip(red_intensity, far_red_intensity)]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Left: Pfr ratio under different conditions
ax1.set_facecolor('#111827')
bar_colors = ['#f59e0b' if p > 0.4 else '#3b82f6' if p > 0.2 else '#6b7280' for p in pfr_ratio]
bars = ax1.bar(range(len(conditions)), pfr_ratio, color=bar_colors, alpha=0.85)
ax1.set_xticks(range(len(conditions)))
ax1.set_xticklabels(conditions, color='white', fontsize=9)
ax1.set_ylabel('Pfr / Ptotal ratio', color='white')
ax1.set_title('Phytochrome Activation Under Different Light', color='white', fontsize=13)
ax1.axhline(0.4, color='#22c55e', linestyle='--', linewidth=1, label='Shade avoidance threshold')
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 0.6)

for bar, ratio in zip(bars, pfr_ratio):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.01,
             f'{ratio:.2f}', ha='center', color='white', fontsize=9)

# Right: Shade avoidance response (stem elongation vs Pfr ratio)
ax2.set_facecolor('#111827')
pfr_range = np.linspace(0.05, 0.55, 100)
# Low Pfr -> high elongation (shade avoidance response)
elongation = 30 * np.exp(-5 * pfr_range) + 5  # cm/week

ax2.plot(pfr_range, elongation, color='#22c55e', linewidth=2)
ax2.fill_between(pfr_range, elongation, alpha=0.15, color='#22c55e')
ax2.set_xlabel('Pfr/Ptotal ratio', color='white')
ax2.set_ylabel('Stem elongation rate (cm/week)', color='white')
ax2.set_title('Shade Avoidance: Low Pfr Triggers Rapid Stem Growth', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# Mark shade and sun zones
ax2.axvspan(0.05, 0.25, alpha=0.1, color='#3b82f6')
ax2.text(0.15, 25, 'SHADE\\n(grow tall!)', ha='center', color='#3b82f6', fontsize=9)
ax2.axvspan(0.35, 0.55, alpha=0.1, color='#f59e0b')
ax2.text(0.45, 25, 'SUN\\n(grow wide)', ha='center', color='#f59e0b', fontsize=9)

plt.tight_layout()
plt.show()

print("Phytochrome: the plant's light quality sensor")
print("  High R:FR ratio (sun) -> Pfr high -> normal growth")
print("  Low R:FR ratio (shade) -> Pfr low -> elongate stems to escape shade")
print()
print("This is why houseplants near a window grow toward the light,")
print("and why plants under a canopy grow tall and spindly.")`,
      challenge: 'Simulate a day-night cycle: 12 hours of light (Pr -> Pfr) and 12 hours of dark (Pfr slowly reverts to Pr with a half-life of ~2 hours). Plot the Pfr level over 48 hours.',
      successHint: 'Photoreceptors are why plants know what season it is, which direction is up, and whether to grow tall or bushy. They are the plant\'s sensory system — vision without eyes.',
    },
    {
      title: 'Genetic control of colour — from DNA to pigment',
      concept: `Flower colour is ultimately controlled by **genes** — specific segments of DNA that code for the enzymes in pigment biosynthesis pathways.

The **anthocyanin pathway** (simplified):
1. Phenylalanine (amino acid) → Cinnamic acid (enzyme: PAL)
2. → Naringenin (a flavanone)
3. → Dihydroflavonol
4. → **Leucoanthocyanidin** (enzyme: DFR — dihydroflavonol reductase)
5. → **Anthocyanidin** (enzyme: ANS — anthocyanidin synthase)
6. → **Anthocyanin** (enzyme: UFGT — adds a sugar group for stability)

Each arrow is a chemical reaction catalysed by a specific enzyme, coded by a specific gene. Mutations in any gene can change the colour:
- **DFR mutation** → no anthocyanin → white flowers
- **F3'H mutation** → no delphinidin → red instead of blue
- **MYB transcription factor** → controls how much pigment is made → intensity variation

This is why plant breeders can create new colours by crossing varieties with different gene variants.`,
      analogy: 'The pigment pathway is like a factory assembly line. Each gene codes for one worker (enzyme). If worker #4 calls in sick (gene mutation), everything before them piles up, and nothing after them gets made. The final product (colour) depends on every worker showing up.',
      storyConnection: 'The orchid\'s colour didn\'t come from stealing the sunset — it came from a precise chain of biochemical reactions, each controlled by DNA. When breeders create a new orchid colour, they\'re not painting — they\'re editing an assembly line.',
      checkQuestion: 'Blue roses don\'t exist naturally. Rose DNA lacks the gene for delphinidin (the blue anthocyanin). In 2004, a Japanese company created blue roses by inserting a gene from pansies. Is this "natural"?',
      checkAnswer: 'It\'s genetic engineering — inserting a gene from one species into another (transgenic). The gene itself is natural (pansies make delphinidin). The combination is not. Nature does horizontal gene transfer too (bacteria do it constantly), but not between roses and pansies. Whether it\'s "natural" depends on your definition — a philosophical question, not a scientific one.',
      codeIntro: 'Model the anthocyanin biosynthesis pathway and predict flower colour from enzyme activity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified anthocyanin pathway simulation
# Each enzyme converts substrate to product
# Enzyme activity ranges 0-1 (0 = mutated/inactive, 1 = fully active)

def simulate_pathway(pal, chs, f3h, dfr, ans, ufgt):
    """Simulate metabolite levels through the pathway."""
    substrate = 100  # starting phenylalanine
    cinnamic = substrate * pal
    naringenin = cinnamic * chs
    dihydroflavonol = naringenin * f3h
    leucoanthocyanidin = dihydroflavonol * dfr
    anthocyanidin = leucoanthocyanidin * ans
    anthocyanin = anthocyanidin * ufgt
    return [substrate, cinnamic, naringenin, dihydroflavonol,
            leucoanthocyanidin, anthocyanidin, anthocyanin]

steps = ['Phenylalanine', 'Cinnamic\\nacid', 'Naringenin', 'Dihydro-\\nflavonol',
         'Leuco-\\nanthocyanidin', 'Anthocyanidin', 'Anthocyanin']
enzymes = ['PAL', 'CHS', 'F3H', 'DFR', 'ANS', 'UFGT']

# Three genotypes
genotypes = {
    'Wild type (purple)': (1.0, 1.0, 1.0, 1.0, 1.0, 1.0),
    'DFR mutant (white)': (1.0, 1.0, 1.0, 0.0, 1.0, 1.0),
    'Low MYB (pale pink)': (0.3, 0.3, 0.3, 0.3, 0.3, 0.3),
}
gcolors = ['#a855f7', '#e5e7eb', '#fda4af']

fig, axes = plt.subplots(1, 3, figsize=(15, 5), sharey=True)
fig.patch.set_facecolor('#1f2937')

for ax, (name, params), color in zip(axes, genotypes.items(), gcolors):
    ax.set_facecolor('#111827')
    levels = simulate_pathway(*params)
    ax.bar(range(len(steps)), levels, color=color, alpha=0.8, edgecolor='white', linewidth=0.5)
    ax.set_xticks(range(len(steps)))
    ax.set_xticklabels(steps, color='white', fontsize=7, rotation=30, ha='right')
    ax.set_title(name, color=color, fontsize=11, fontweight='bold')
    ax.tick_params(colors='gray')

    # Show enzyme names between bars
    for i, enz in enumerate(enzymes):
        activity = params[i]
        enz_color = '#22c55e' if activity > 0.5 else '#ef4444'
        ax.annotate(f'{enz}\\n({activity:.0%})', xy=(i+0.5, max(levels)*0.95),
                    fontsize=6, color=enz_color, ha='center')

axes[0].set_ylabel('Metabolite level', color='white')
plt.suptitle('Anthocyanin Pathway: How Genes Control Flower Colour',
             color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Pathway predictions:")
for name, params in genotypes.items():
    levels = simulate_pathway(*params)
    print(f"  {name}:")
    print(f"    Final anthocyanin: {levels[-1]:.1f}% of max")
    if levels[-1] > 50:
        print(f"    Prediction: DEEP colour")
    elif levels[-1] > 10:
        print(f"    Prediction: PALE colour")
    else:
        print(f"    Prediction: WHITE (no pigment)")`,
      challenge: 'Create a 4th genotype: "ANS overexpressed" where ANS activity is 2.0 (twice normal). What happens? Does more enzyme always mean more product? (Hint: consider rate-limiting steps.)',
      successHint: 'Genetic control of colour is the foundation of plant breeding, genetic engineering, and even gene therapy. The logic of pathways — where a single broken link changes everything — applies far beyond flowers.',
    },
    {
      title: 'Hybridization — creating new orchid varieties',
      concept: `Orchid hybridization is the art and science of crossing two orchid species (or varieties) to create offspring with combined traits. It's one of the oldest forms of genetic engineering — breeders have been doing it since the 1850s.

Key concepts:
- **Cross-pollination**: manually transferring pollinia from one orchid to the stigma of another
- **F1 hybrid**: the first generation from a cross. Often shows **hybrid vigour** (heterosis) — growing larger or more vigorously than either parent.
- **Dominant vs. recessive traits**: purple colour is often dominant over white. An F1 from purple × white is usually purple.
- **Segregation in F2**: when F1 hybrids cross with each other, the F2 generation shows a mix of parent traits (Mendelian ratios: 3:1 for a single gene).

Modern orchid breeding:
- Over 150,000 registered hybrid orchid varieties (called **grexes**)
- Some inter-generic hybrids (crossing different genera — impossible in animals)
- Breeding cycle: 5-7 years from cross to flowering
- Goal: larger flowers, brighter colours, longer bloom time, disease resistance`,
      analogy: 'Orchid hybridization is like mixing paint colours. Purple × white might give you pale purple (intermediate). But unlike paint, genetics has rules: dominant alleles can mask recessive ones, so the F1 might be fully purple — the white "disappears" but is still in the DNA, ready to reappear in the grandchildren.',
      storyConnection: 'The orchid in our story received its colours from different sources — the sunset, the earth, the sky. Real orchid breeders do something similar: they combine the red of one species with the shape of another and the fragrance of a third, across multiple generations of crosses.',
      checkQuestion: 'If you cross a homozygous purple orchid (PP) with a homozygous white orchid (pp), what colours appear in the F1 and F2 generations?',
      checkAnswer: 'F1: all Pp (heterozygous) → all purple (purple is dominant). F2 (Pp × Pp): PP, Pp, Pp, pp → 3 purple : 1 white. This is Mendel\'s classic 3:1 ratio. The white "reappears" in 25% of the F2 — the gene was hidden, not lost.',
      codeIntro: 'Simulate Mendelian inheritance of flower colour across generations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Single gene model: P (purple, dominant) and p (white, recessive)
# PP or Pp = purple, pp = white

def cross(parent1, parent2, n_offspring=100):
    """Cross two diploid genotypes, return offspring genotypes."""
    offspring = []
    for _ in range(n_offspring):
        allele1 = parent1[np.random.randint(2)]
        allele2 = parent2[np.random.randint(2)]
        offspring.append(sorted([allele1, allele2]))
    return offspring

def phenotype(genotype):
    return 'purple' if 'P' in genotype else 'white'

# P generation: PP x pp
p1 = ['P', 'P']
p2 = ['p', 'p']
f1 = cross(p1, p2, 200)

# F1 x F1 -> F2
f1_parent = ['P', 'p']  # all F1 are Pp
f2 = cross(f1_parent, f1_parent, 400)

# F2 x F2 (random mating) -> F3
f3 = []
for _ in range(400):
    p_a = f2[np.random.randint(len(f2))]
    p_b = f2[np.random.randint(len(f2))]
    child_a1 = p_a[np.random.randint(2)]
    child_a2 = p_b[np.random.randint(2)]
    f3.append(sorted([child_a1, child_a2]))

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

generations = [('F1 (PP × pp)', f1), ('F2 (Pp × Pp)', f2), ('F3 (random mating)', f3)]

for ax, (name, gen) in zip(axes, generations):
    ax.set_facecolor('#111827')

    geno_counts = {}
    for g in gen:
        key = ''.join(g)
        geno_counts[key] = geno_counts.get(key, 0) + 1

    # Count phenotypes
    purple = sum(1 for g in gen if phenotype(g) == 'purple')
    white = len(gen) - purple

    # Genotype bars
    genotypes = ['PP', 'Pp', 'pp']
    counts = [geno_counts.get(g, 0) for g in genotypes]
    geno_colors = ['#7c3aed', '#a78bfa', '#e5e7eb']

    bars = ax.bar(genotypes, counts, color=geno_colors, edgecolor='white', linewidth=0.5)
    ax.set_title(name, color='white', fontsize=12)
    ax.tick_params(colors='gray')

    for bar, c in zip(bars, counts):
        if c > 0:
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 3,
                    str(c), ha='center', color='white', fontsize=10)

    ratio = f"{purple}:{white}"
    ax.set_xlabel(f'Purple:{white} = {purple/max(white,1):.1f}:1', color='white', fontsize=9)
    ax.set_ylabel('Count', color='white')

plt.suptitle('Mendelian Inheritance of Orchid Flower Colour',
             color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Mendel's predictions:")
print("  F1 (PP × pp): 100% purple (all Pp)")
print("  F2 (Pp × Pp): 75% purple (PP + Pp), 25% white (pp)")
print("  Genotype ratio: 1 PP : 2 Pp : 1 pp")
print()
f2_purple = sum(1 for g in f2 if phenotype(g) == 'purple')
f2_white = len(f2) - f2_purple
print(f"Our simulation: {f2_purple} purple, {f2_white} white")
print(f"Ratio: {f2_purple/max(f2_white,1):.2f}:1 (expected 3:1)")`,
      challenge: 'Extend the model to two genes: one for colour (P/p) and one for pattern (S/s for spotted). How many phenotype classes appear in the F2? (Hint: 9:3:3:1 ratio.)',
      successHint: 'Mendelian genetics is the foundation of all breeding — from orchids to crops to livestock. Understanding dominance, segregation, and independent assortment lets you predict outcomes before making a single cross.',
    },
    {
      title: 'Tissue culture — growing orchids from a single cell',
      concept: `Orchids are notoriously difficult to grow from seed (they need a symbiotic fungus). **Tissue culture** bypasses this by growing orchids from tiny pieces of tissue in sterile lab conditions.

The process:
1. **Explant selection**: take a small piece (a few mm) of shoot tip, leaf, or root
2. **Sterilization**: kill all bacteria and fungi on the surface
3. **Growth medium**: place on agar gel containing sugars, minerals, vitamins, and plant hormones
4. **Callus formation**: cells de-differentiate into an undifferentiated mass (callus)
5. **Shoot induction**: adjust hormones (high cytokinin:auxin ratio) → shoots form
6. **Root induction**: change hormones (high auxin:cytokinin ratio) → roots form
7. **Acclimatization**: gradually move the plantlet from sterile lab to greenhouse

Key hormones:
- **Auxin** (IAA, NAA): promotes root formation and cell elongation
- **Cytokinin** (BAP, kinetin): promotes shoot formation and cell division
- The **ratio** of auxin to cytokinin determines what the tissue becomes

One shoot tip can produce thousands of clones — this is how commercial orchids are mass-produced.`,
      analogy: 'Tissue culture is like resetting a specialized worker back to a general-purpose employee (de-differentiation to callus), then retraining them for a new specialty (re-differentiation into shoots or roots). The training program (hormone ratio) determines the new career path.',
      storyConnection: 'The orchid\'s ability to regenerate from fragments mirrors Tejimola\'s story from Level 1 — the power of totipotent cells. In the lab, scientists harness this natural ability with precision, using hormones as the control signals.',
      checkQuestion: 'If all tissue-cultured orchids from one parent are clones, what is the main advantage AND the main risk?',
      checkAnswer: 'Advantage: every plant is guaranteed to be identical to the parent — same colour, shape, size. You know exactly what you\'re getting. Risk: zero genetic diversity. A disease that kills one will kill all. This is the same clone vulnerability we saw with bananas in Level 1.',
      codeIntro: 'Model the effect of auxin:cytokinin ratio on tissue development.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Auxin:Cytokinin ratio determines tissue fate
# High auxin: roots
# High cytokinin: shoots
# Balanced: callus (undifferentiated)

auxin = np.linspace(0, 10, 100)
cytokinin = np.linspace(0, 10, 100)
A, C = np.meshgrid(auxin, cytokinin)

# Probability of each outcome based on ratio
# Root probability: high when auxin >> cytokinin
root_prob = 1 / (1 + np.exp(-(A - C - 2)))
# Shoot probability: high when cytokinin >> auxin
shoot_prob = 1 / (1 + np.exp(-(C - A - 2)))
# Callus: when roughly balanced
callus_prob = 1 - root_prob - shoot_prob
callus_prob = np.clip(callus_prob, 0, 1)

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

data = [
    ('Root formation', root_prob, 'Greens'),
    ('Shoot formation', shoot_prob, 'Blues'),
    ('Callus (undifferentiated)', callus_prob, 'Oranges'),
]

for ax, (title, prob, cmap) in zip(axes, data):
    ax.set_facecolor('#111827')
    im = ax.contourf(A, C, prob, levels=20, cmap=cmap, alpha=0.9)
    ax.set_xlabel('Auxin concentration', color='white')
    ax.set_ylabel('Cytokinin concentration', color='white')
    ax.set_title(title, color='white', fontsize=11)
    ax.tick_params(colors='gray')
    plt.colorbar(im, ax=ax, label='Probability')

plt.suptitle('Tissue Culture: Hormone Ratio Controls Cell Fate',
             color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Tissue culture recipe for orchid propagation:")
print("  Step 1: Callus induction")
print("    Auxin = 2 mg/L, Cytokinin = 2 mg/L (balanced)")
print("  Step 2: Shoot multiplication")
print("    Auxin = 0.5 mg/L, Cytokinin = 5 mg/L (high cytokinin)")
print("  Step 3: Root induction")
print("    Auxin = 5 mg/L, Cytokinin = 0 mg/L (high auxin)")
print()
print("From one shoot tip -> 1000s of clones in 6-12 months")
print("This is how a $10 orchid at the grocery store is produced.")`,
      challenge: 'Add a fourth scenario: "somatic embryogenesis" where high auxin (>8) with zero cytokinin triggers embryo-like structures directly from callus. Modify the probability model to include this outcome.',
      successHint: 'Tissue culture is where cell biology meets engineering. The same principles apply to animal cell culture, regenerative medicine, and even growing meat in labs. Understanding hormone signaling is the key to controlling cell fate.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Plant Biochemistry</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for biochemistry simulations. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}