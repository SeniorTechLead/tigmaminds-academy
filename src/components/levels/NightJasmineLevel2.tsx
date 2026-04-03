import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function NightJasmineLevel2() {
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
      title: 'Gene expression rhythms — the molecular dance',
      concept: `In a plant cell, thousands of genes are turned on and off in rhythmic patterns throughout the day. In Arabidopsis (the model plant), roughly **30% of all genes** show circadian expression — their mRNA levels rise and fall on a 24-hour cycle.

These rhythmic genes are grouped by **phase** — the time of day they peak:
- **Dawn genes**: photosynthesis preparation, chlorophyll biosynthesis
- **Morning genes**: light harvesting, carbon fixation
- **Afternoon genes**: starch metabolism, growth hormones
- **Dusk genes**: flowering signals, defence compounds
- **Night genes**: starch breakdown, repair, cell division

The coordination is remarkable: the cell anticipates each phase of the day and prepares the necessary proteins BEFORE they are needed. Photosynthesis genes peak just before dawn, not after — the plant "knows" sunrise is coming.

This gene expression rhythm is controlled by the circadian clock through **transcription factors** — proteins that bind to gene promoters and switch them on or off. The clock genes produce transcription factors on a schedule, and those factors cascade outward to control thousands of downstream genes.`,
      analogy: 'The circadian gene expression program is like a factory shift schedule. The night shift (starch breakdown crew) clocks out as the day shift (photosynthesis crew) arrives. Each worker (gene) has a specific start and end time. The schedule is set by management (clock genes), not by individual workers. And critically, workers arrive BEFORE their shift starts — they anticipate.',
      storyConnection: 'The night jasmine\'s fragrance genes are "dusk genes" — they peak in expression just before sunset, flooding the flower with scent compounds as moths become active. The flowers don\'t wait for darkness and then start producing fragrance; they prepare hours in advance. The molecular machinery anticipates the night.',
      checkQuestion: 'If 30% of plant genes are circadian, what happens to a plant with a broken clock? (Clock gene mutants exist.)',
      checkAnswer: 'Clock mutant plants grow ~30% slower, are more susceptible to disease, and have impaired photosynthesis. They waste energy by producing the wrong proteins at the wrong time. For example, they make photosynthesis machinery at night (when it is useless) and defence compounds during the day (when pathogens are less active). The clock provides a fitness advantage by optimising timing.',
      codeIntro: 'Simulate gene expression waves over 48 hours, showing how different gene groups peak at different times.',
      code: `import numpy as np
import matplotlib.pyplot as plt

hours = np.linspace(0, 48, 500)

# Gene expression waves (normalised 0-1)
# Each peaks at a different phase
gene_groups = {
    'Dawn genes\\n(photosynthesis prep)': {'phase': 5, 'color': '#f59e0b'},
    'Morning genes\\n(light harvesting)': {'phase': 9, 'color': '#22c55e'},
    'Afternoon genes\\n(growth/starch)': {'phase': 14, 'color': '#3b82f6'},
    'Dusk genes\\n(fragrance/flowering)': {'phase': 18, 'color': '#a855f7'},
    'Night genes\\n(repair/division)': {'phase': 1, 'color': '#ef4444'},
}

fig, axes = plt.subplots(len(gene_groups) + 1, 1, figsize=(12, 10), sharex=True,
                          gridspec_kw={'height_ratios': [1]*len(gene_groups) + [0.5]})
fig.patch.set_facecolor('#1f2937')

for ax, (name, props) in zip(axes[:-1], gene_groups.items()):
    ax.set_facecolor('#111827')
    phase = props['phase']
    color = props['color']

    # Circadian wave: cosine with peak at 'phase'
    expression = 0.5 + 0.5 * np.cos(2 * np.pi * (hours - phase) / 24)
    # Add some noise
    expression += np.random.normal(0, 0.03, len(hours))
    expression = np.clip(expression, 0, 1)

    ax.fill_between(hours, expression, alpha=0.3, color=color)
    ax.plot(hours, expression, color=color, linewidth=1.5)
    ax.set_ylabel(name, color=color, fontsize=8, rotation=0, labelpad=100, va='center', ha='left')
    ax.set_ylim(-0.1, 1.2)
    ax.set_yticks([0, 0.5, 1])
    ax.set_yticklabels(['0', '0.5', '1'], color='gray', fontsize=7)
    ax.tick_params(colors='gray')

    # Mark peak
    peak_hours = [phase, phase + 24]
    for ph in peak_hours:
        if 0 <= ph <= 48:
            ax.annotate('peak', (ph, 1.05), ha='center', color=color, fontsize=7)

# Day/night bar at bottom
ax_dn = axes[-1]
ax_dn.set_facecolor('#111827')
for d in range(3):
    ax_dn.axvspan(d*24 + 6, d*24 + 18, alpha=0.3, color='#f59e0b')
    ax_dn.axvspan(d*24 + 18, d*24 + 30, alpha=0.3, color='#1e3a5f')
    if d*24 + 12 <= 48:
        ax_dn.text(d*24 + 12, 0.5, 'Day', ha='center', va='center', color='#f59e0b', fontsize=9)
    if d*24 + 24 <= 48:
        ax_dn.text(d*24 + 24, 0.5, 'Night', ha='center', va='center', color='#60a5fa', fontsize=9)
ax_dn.set_ylim(0, 1)
ax_dn.set_yticks([])
ax_dn.set_xlabel('Hours', color='white')
ax_dn.tick_params(colors='gray')

plt.suptitle('Circadian Gene Expression Waves (5 gene groups)', color='white', fontsize=13, y=1.01)
plt.tight_layout()
plt.show()

print("30% of all plant genes oscillate on a 24-hour cycle.")
print("Each gene group peaks at a specific time:")
print("  Dawn (~5am): photosynthesis preparation")
print("  Morning (~9am): light harvesting at full speed")
print("  Afternoon (~2pm): starch synthesis, growth")
print("  Dusk (~6pm): fragrance, flowering signals")
print("  Night (~1am): DNA repair, cell division")`,
      challenge: 'Plot what happens when the clock is broken: set all phases to random values instead of their normal times. How does this look compared to the coordinated pattern? This is what happens in clock-mutant plants.',
      successHint: 'The circadian transcriptome is one of the most dramatic examples of biological coordination. Thousands of genes, orchestrated by a handful of clock transcription factors, all timed to optimise the plant\'s daily life.',
    },
    {
      title: 'Clock genes in plants — the core oscillator',
      concept: `The plant circadian clock is built from interlocking **transcription-translation feedback loops (TTFLs)**. In Arabidopsis, the core components are:

**Morning loop:**
- **CCA1** and **LHY**: transcription factors that peak at dawn
- They activate morning genes and repress evening genes
- They also repress their own activator (TOC1), creating a delay

**Evening loop:**
- **TOC1** (TIMING OF CAB EXPRESSION 1): peaks in the evening
- Activates CCA1/LHY (completing the loop)
- Also activates evening-expressed genes

**Additional components:**
- **PRR5, PRR7, PRR9**: pseudo-response regulators that fill the daytime gap
- **ELF3, ELF4, LUX**: the "evening complex" that represses morning genes at night
- **GI** (GIGANTEA): links the clock to flowering through the photoperiod pathway

The interlocking loops create robustness — if one component fails, the others can partially compensate. The clock period (~24h) emerges from the combined delays in transcription, translation, protein modification, and degradation.`,
      analogy: 'The plant clock is like two teams playing a relay race in a loop. Team Morning (CCA1/LHY) runs from dawn to noon, then passes the baton to Team Evening (TOC1/ELF complex), which runs from noon to dawn. Each team suppresses the other while it runs. The race never ends — it cycles forever. Additional runners (PRRs) fill gaps to keep the pace steady.',
      storyConnection: 'The night jasmine\'s dusk flowering is directly controlled by the evening complex (ELF3/ELF4/LUX). When these proteins accumulate in the evening, they activate fragrance biosynthesis genes and flower-opening mechanics. The clock doesn\'t just time the bloom — it IS the bloom trigger.',
      checkQuestion: 'Why does the plant need multiple interlocking loops instead of a single negative feedback loop?',
      checkAnswer: 'A single loop would be fragile — sensitive to temperature changes, mutations, and noise. Multiple interlocking loops provide redundancy (if one fails, others compensate), precision (multiple delays are needed to get exactly 24 hours), and robustness (the system is resistant to perturbation). It is the same reason aircraft have redundant control systems.',
      codeIntro: 'Simulate the CCA1-TOC1 interlocking feedback loop.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Two-loop clock model: CCA1 (morning) and TOC1 (evening)
hours = np.linspace(0, 96, 2000)  # 4 days
dt = hours[1] - hours[0]

# State variables
cca1 = np.zeros_like(hours)  # morning gene
toc1 = np.zeros_like(hours)  # evening gene
cca1[0] = 1.0
toc1[0] = 0.2

# Parameters
k_prod = 1.5       # max production rate
k_deg = 0.15       # degradation rate
k_half = 0.5       # half-activation constant
n = 3              # Hill coefficient (cooperativity)
light_boost = 0.3  # light enhances CCA1

for i in range(1, len(hours)):
    hour_of_day = hours[i] % 24
    is_light = 6 <= hour_of_day <= 18

    # CCA1 production: activated by TOC1, enhanced by light
    cca1_prod = k_prod * (toc1[i-1]**n / (k_half**n + toc1[i-1]**n))
    if is_light:
        cca1_prod += light_boost

    # TOC1 production: repressed by CCA1 (inhibitory Hill function)
    toc1_prod = k_prod * (k_half**n / (k_half**n + cca1[i-1]**n))

    # Degradation
    cca1_deg = k_deg * cca1[i-1]
    toc1_deg = k_deg * toc1[i-1]

    cca1[i] = cca1[i-1] + (cca1_prod - cca1_deg) * dt
    toc1[i] = toc1[i-1] + (toc1_prod - toc1_deg) * dt

    cca1[i] = max(0, cca1[i])
    toc1[i] = max(0, toc1[i])

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Protein levels
ax1.set_facecolor('#111827')
ax1.plot(hours, cca1, color='#f59e0b', linewidth=2, label='CCA1 (morning)')
ax1.plot(hours, toc1, color='#a855f7', linewidth=2, label='TOC1 (evening)')
ax1.fill_between(hours, cca1, alpha=0.1, color='#f59e0b')
ax1.fill_between(hours, toc1, alpha=0.1, color='#a855f7')

for d in range(4):
    ax1.axvspan(d*24 + 6, d*24 + 18, alpha=0.04, color='yellow')
    ax1.axvspan(d*24 + 18, d*24 + 30, alpha=0.04, color='blue')

ax1.set_ylabel('Protein level', color='white')
ax1.set_title('Plant Circadian Clock: CCA1-TOC1 Feedback Loop', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Phase relationship
ax2.set_facecolor('#111827')
phase_diff = np.abs(cca1 - toc1)
ax2.fill_between(hours, phase_diff, alpha=0.3, color='#22c55e')
ax2.plot(hours, phase_diff, color='#22c55e', linewidth=1)
ax2.set_ylabel('|CCA1 - TOC1|', color='white')
ax2.set_xlabel('Hours', color='white')
ax2.set_title('Anti-phase relationship (high when one is up, other is down)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The CCA1-TOC1 loop:")
print("  CCA1 peaks at dawn → represses TOC1")
print("  TOC1 peaks at dusk → activates CCA1 (with delay)")
print("  Result: anti-phase oscillation with ~24h period")
print()
print("This is the core oscillator. Additional loops (PRRs, evening complex)")
print("fine-tune the period and provide robustness against perturbation.")`,
      challenge: 'Remove the light_boost (set to 0) and observe the free-running clock. Does it still oscillate? Does the period change? This simulates a plant in constant darkness.',
      successHint: 'The interlocking feedback loop architecture of plant clocks is remarkably similar to mammalian clocks (BMAL1/CLOCK and PER/CRY). This convergent design suggests that the TTFL is the optimal solution for building a ~24-hour timer from molecular components.',
    },
    {
      title: 'Light signal transduction — from photon to gene',
      concept: `When a photon hits a plant cell, a cascade of molecular events converts that light signal into changes in gene expression. This is **phototransduction** — and plants have multiple systems:

**Photoreceptors:**
1. **Phytochromes (phyA-phyE)**: detect red/far-red light (660/730nm). Control seed germination, shade avoidance, flowering
2. **Cryptochromes (cry1, cry2)**: detect blue/UV-A light (320-500nm). Regulate photomorphogenesis, clock entrainment
3. **Phototropins (phot1, phot2)**: detect blue light. Control phototropism (bending toward light), chloroplast movement, stomatal opening
4. **UVR8**: detects UV-B light (280-315nm). Activates UV protection (sunscreen compounds)

**The signalling cascade (phytochrome example):**
1. Red light converts Pr → Pfr (conformational change)
2. Pfr translocates from cytoplasm to nucleus
3. Pfr binds PIF transcription factors (phytochrome-interacting factors)
4. Pfr-PIF complex is ubiquitinated and degraded by the proteasome
5. PIF degradation de-represses light-responsive genes
6. Photosynthesis genes, pigment genes, and clock genes are activated

The speed is remarkable: gene expression changes begin within 1 minute of light exposure. The full photomorphogenic response (greening, leaf expansion) takes hours, but the molecular machinery responds almost instantly.`,
      analogy: 'Plant phototransduction is like a security system. Photons are intruders that trip a sensor (photoreceptor). The sensor sends a signal to the control room (nucleus). The control room destroys the "all clear" sign (PIF degradation) and activates the alarm (light-responsive genes). The whole sequence from detection to response takes under a minute.',
      storyConnection: 'When dawn breaks on the night jasmine tree, blue light hits cryptochrome receptors in the flower petals. This triggers a signalling cascade that ultimately closes the flowers and shuts down fragrance production. The transition from night to day is not gradual for the flower — it is a rapid molecular switch, triggered by the first photons of sunrise.',
      checkQuestion: 'Plants have 5 different phytochromes (phyA-phyE). Why so many if they all detect red light?',
      checkAnswer: 'Each phytochrome has a different expression pattern, stability, and signalling output. PhyA is abundant in dark-grown seedlings and degrades rapidly in light (it detects the very first light after germination). PhyB is stable and acts as a continuous light sensor throughout the plant\'s life. Different phytochromes serve different developmental decisions at different life stages.',
      codeIntro: 'Model the phytochrome signalling cascade: light → Pfr → PIF degradation → gene activation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Phytochrome signalling cascade model
minutes = np.linspace(0, 60, 600)  # 1 hour
dt = minutes[1] - minutes[0]

# Light turns on at t=10 min
light = np.where(minutes >= 10, 1.0, 0.0)

# Pfr: converts from Pr with light
pfr = np.zeros_like(minutes)
pfr[0] = 0.05  # low in dark

# PIF (repressor): starts high in dark, degraded by Pfr
pif = np.zeros_like(minutes)
pif[0] = 1.0

# Target gene expression: activated when PIF is low
gene = np.zeros_like(minutes)
gene[0] = 0.05

for i in range(1, len(minutes)):
    # Pfr dynamics
    pfr_prod = 2.0 * light[i] * (1 - pfr[i-1])  # light converts Pr to Pfr
    pfr_rev = 0.02 * pfr[i-1]  # slow dark reversion
    pfr[i] = pfr[i-1] + (pfr_prod - pfr_rev) * dt
    pfr[i] = np.clip(pfr[i], 0, 1)

    # PIF dynamics: degraded by Pfr, produced constitutively
    pif_prod = 0.1 * (1 - pif[i-1])
    pif_deg = 3.0 * pfr[i-1] * pif[i-1]  # Pfr-dependent degradation
    pif[i] = pif[i-1] + (pif_prod - pif_deg) * dt
    pif[i] = np.clip(pif[i], 0, 1)

    # Gene activation: inversely related to PIF
    gene_act = 1.5 * (1 - pif[i-1]) * (1 - gene[i-1])
    gene_deg = 0.05 * gene[i-1]
    gene[i] = gene[i-1] + (gene_act - gene_deg) * dt
    gene[i] = np.clip(gene[i], 0, 1)

fig, axes = plt.subplots(4, 1, figsize=(12, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

data = [
    ('Light stimulus', light, '#f59e0b'),
    ('Pfr (active phytochrome)', pfr, '#22c55e'),
    ('PIF (repressor)', pif, '#ef4444'),
    ('Target gene expression', gene, '#3b82f6'),
]

for ax, (label, signal, color) in zip(axes, data):
    ax.set_facecolor('#111827')
    ax.plot(minutes, signal, color=color, linewidth=2)
    ax.fill_between(minutes, signal, alpha=0.15, color=color)
    ax.set_ylabel(label, color=color, fontsize=9, rotation=0, labelpad=100, va='center', ha='left')
    ax.set_ylim(-0.1, 1.2)
    ax.tick_params(colors='gray')

# Add time annotations
axes[1].annotate('Pfr rises\\nwithin seconds', xy=(12, 0.5), xytext=(25, 0.3),
                  color='#22c55e', fontsize=9, arrowprops=dict(arrowstyle='->', color='#22c55e'))
axes[2].annotate('PIF degraded\\nwithin minutes', xy=(15, 0.5), xytext=(30, 0.7),
                  color='#ef4444', fontsize=9, arrowprops=dict(arrowstyle='->', color='#ef4444'))
axes[3].annotate('Gene active\\nwithin 5-10 min', xy=(20, 0.5), xytext=(35, 0.3),
                  color='#3b82f6', fontsize=9, arrowprops=dict(arrowstyle='->', color='#3b82f6'))

axes[0].set_title('Phytochrome Signalling Cascade: Light → Gene Activation', color='white', fontsize=13)
axes[-1].set_xlabel('Minutes', color='white')
plt.tight_layout()
plt.show()

print("Signal cascade timing:")
print("  Light ON → Pfr conversion: <1 second")
print("  Pfr → PIF degradation: 1-5 minutes")
print("  PIF removal → gene expression: 5-15 minutes")
print("  Total: photon to gene activation in <15 minutes")
print()
print("This speed allows plants to respond rapidly to changing")
print("light conditions (clouds, shade from neighbours, dawn).")`,
      challenge: 'Simulate a far-red light pulse at t=30 min that converts Pfr back to Pr. How quickly does PIF recover? This "red/far-red reversibility" was the experiment that proved phytochrome exists (Borthwick et al., 1952).',
      successHint: 'Plant phototransduction shows how a simple photochemical switch (Pr↔Pfr) can control complex developmental programs through a signalling cascade. The same principle — receptor → signal relay → transcription factor → gene — operates in all sensory systems.',
    },
    {
      title: 'Stomatal regulation — the breathing clock',
      concept: `Stomata are microscopic pores on leaf surfaces, flanked by two **guard cells**. They open to let CO2 in for photosynthesis and close to prevent water loss. Their opening pattern follows a circadian rhythm:

**Daily stomatal cycle:**
- **Dawn**: stomata begin opening (anticipating sunrise and photosynthesis)
- **Morning**: fully open (maximum CO2 uptake)
- **Midday**: partial closure if water stress (protecting against dehydration)
- **Afternoon**: reopening if conditions improve
- **Dusk**: closing (photosynthesis stopping, no need for CO2)
- **Night**: closed (preventing water loss)

**The mechanism:**
Guard cells open stomata by pumping K+ ions in → water follows by osmosis → cells swell → pore opens. They close by pumping K+ out → water exits → cells deflate → pore closes.

The circadian clock pre-programmes this cycle, but environmental signals (light, CO2 levels, humidity, drought stress hormone ABA) can override it. This interaction between the clock and the environment is critical for plant survival.

**Numbers:** A single plant leaf has ~100-300 stomata per mm². A mature tree transpires 200-400 litres of water per day through its stomata.`,
      analogy: 'Stomata are like automated shop shutters on a timer. They open at business hours (dawn) and close at night. But they also have an override: if there is a fire (drought), they close immediately regardless of the schedule. The timer (clock) sets the default; the sensors (ABA, light) handle exceptions.',
      storyConnection: 'The night jasmine\'s stomata close at dusk while its flowers open. This seems paradoxical — the flowers need to release fragrance compounds, which escape through petal surfaces, not stomata. The stomatal closure conserves water overnight while the flower petals, which lack a waxy cuticle, allow volatiles to escape. Different tissues, different strategies, same clock.',
      checkQuestion: 'Some desert plants (CAM plants like cacti) open their stomata ONLY at night. Why is this backwards from normal plants?',
      checkAnswer: 'At night, it is cooler and more humid, so less water is lost through open stomata. CAM plants take in CO2 at night, store it as malic acid, and use it for photosynthesis during the day with stomata closed. This reversal costs energy (storing and retrieving CO2 is inefficient) but saves water — a critical trade-off in deserts.',
      codeIntro: 'Model the 24-hour stomatal opening cycle and its interaction with water stress.',
      code: `import numpy as np
import matplotlib.pyplot as plt

hours = np.linspace(0, 48, 500)

# Normal stomatal aperture: circadian + light response
def stomatal_aperture(hours, drought_start=None):
    aperture = np.zeros_like(hours)
    for i, h in enumerate(hours):
        hod = h % 24
        # Circadian component (peaks at 10am)
        circadian = 0.5 + 0.5 * np.cos(2 * np.pi * (hod - 10) / 24)
        # Light component (positive during day)
        light = max(0, np.cos(2 * np.pi * (hod - 12) / 24))
        # Combined
        aperture[i] = 0.4 * circadian + 0.6 * light
        # Night: forced closed
        if hod < 6 or hod > 19:
            aperture[i] *= 0.1
        # Drought override
        if drought_start is not None and h >= drought_start:
            aba = min(1.0, (h - drought_start) / 4)  # ABA builds up over 4h
            aperture[i] *= (1 - 0.9 * aba)
    return np.clip(aperture, 0, 1)

fig, axes = plt.subplots(3, 1, figsize=(12, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Normal conditions
ax = axes[0]
ax.set_facecolor('#111827')
normal = stomatal_aperture(hours)
ax.fill_between(hours, normal, alpha=0.3, color='#22c55e')
ax.plot(hours, normal, color='#22c55e', linewidth=2)
ax.set_title('Normal conditions: clock + light', color='#22c55e', fontsize=11)
ax.set_ylabel('Stomatal\\naperture', color='white', fontsize=9)
ax.tick_params(colors='gray')
ax.set_ylim(-0.05, 1.1)

# Drought at noon on day 1
ax = axes[1]
ax.set_facecolor('#111827')
drought = stomatal_aperture(hours, drought_start=12)
ax.fill_between(hours, drought, alpha=0.3, color='#f59e0b')
ax.plot(hours, drought, color='#f59e0b', linewidth=2)
ax.axvline(12, color='#ef4444', linestyle='--', alpha=0.5)
ax.text(12.5, 0.9, 'Drought starts', color='#ef4444', fontsize=9)
ax.set_title('Drought stress at noon: ABA overrides clock', color='#f59e0b', fontsize=11)
ax.set_ylabel('Stomatal\\naperture', color='white', fontsize=9)
ax.tick_params(colors='gray')
ax.set_ylim(-0.05, 1.1)

# Transpiration (water loss) comparison
ax = axes[2]
ax.set_facecolor('#111827')
transpiration_normal = normal * 8  # arbitrary units, ml/hour
transpiration_drought = drought * 8
ax.fill_between(hours, transpiration_normal, alpha=0.2, color='#3b82f6', label='Normal')
ax.fill_between(hours, transpiration_drought, alpha=0.2, color='#ef4444', label='Drought')
ax.plot(hours, transpiration_normal, color='#3b82f6', linewidth=1.5)
ax.plot(hours, transpiration_drought, color='#ef4444', linewidth=1.5)
ax.set_ylabel('Transpiration\\n(ml/h)', color='white', fontsize=9)
ax.set_xlabel('Hours', color='white')
ax.set_title('Water loss: normal vs drought', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Day/night shading
for ax in axes:
    for d in range(3):
        ax.axvspan(d*24, d*24+6, alpha=0.05, color='blue')
        ax.axvspan(d*24+19, d*24+24, alpha=0.05, color='blue')

plt.tight_layout()
plt.show()

water_normal = np.trapz(transpiration_normal, hours)
water_drought = np.trapz(transpiration_drought, hours)
print(f"Total water lost (48h):")
print(f"  Normal: {water_normal:.0f} arbitrary units")
print(f"  Drought: {water_drought:.0f} arbitrary units")
print(f"  Saved by drought response: {(1 - water_drought/water_normal)*100:.0f}%")
print()
print("The stomatal clock is a compromise between two needs:")
print("  Open → CO2 for photosynthesis (growth)")
print("  Closed → water conservation (survival)")`,
      challenge: 'Model a CAM plant (cactus) that opens stomata only at night. How much water does it save compared to a normal plant? What is the trade-off in CO2 availability for photosynthesis?',
      successHint: 'Stomatal regulation is where the circadian clock meets ecological reality. The clock provides the schedule, but hormones like ABA provide the override. Understanding this interaction is crucial for breeding drought-resistant crops.',
    },
    {
      title: 'Crop photoperiod manipulation — feeding the world',
      concept: `Understanding photoperiodism has directly enabled modern agriculture to feed billions. By manipulating photoperiod responses, breeders have:

**Green Revolution rice:**
- Traditional rice varieties are highly photoperiod-sensitive (flower only when days are short)
- This limits them to one crop per year in many regions
- Breeders identified **photoperiod-insensitive** mutations (in genes like Hd1, Ghd7)
- These varieties flower based on age, not day length
- Result: 2-3 harvests per year instead of 1 → doubling/tripling food production

**Soybean latitude adaptation:**
- Soybean is a short-day plant from China (~35°N)
- Moving it to Brazil (equator) required selecting for different photoperiod genes
- Breeders selected varieties with later-flowering alleles to extend vegetative growth at low latitudes
- Brazil is now the world's largest soybean producer

**Wheat vernalisation + photoperiod:**
- Winter wheat requires cold (vernalisation) AND long days to flower
- Spring wheat skips vernalisation but still needs long days
- Combining mutations in VRN and PPD genes allows wheat growth in diverse climates

These manipulations are among the most impactful genetic modifications in human history — far more consequential than any GMO.`,
      analogy: 'Photoperiod manipulation in crops is like removing the appointment-only restriction from a doctor\'s office. The original plant "sees patients" (flowers) only by appointment (specific day length). By mutating the scheduling gene, the plant now takes walk-ins (flowers whenever it is mature). More patients per day = more harvests per year.',
      storyConnection: 'The night jasmine of the story flowers only in autumn because of its strict photoperiod requirement. If breeders applied the same approach used for rice — finding mutations that bypass the day-length requirement — they could potentially create an ever-blooming night jasmine. The biology permits it; the motivation (cultural significance of seasonal blooming) may not.',
      checkQuestion: 'Why not just make ALL crops photoperiod-insensitive? Would that solve world hunger?',
      checkAnswer: 'Photoperiod sensitivity exists for a reason: it synchronises flowering with the best conditions for seed production. Insensitive varieties may flower too early (frost kills seeds), too late (drought), or at the wrong time for pollinators. Additionally, some quality traits (grain filling, oil content) depend on proper timing. The best approach is matching the right photoperiod genes to each growing region.',
      codeIntro: 'Compare harvests per year for photoperiod-sensitive vs insensitive rice varieties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Rice crop cycle simulation
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

months = np.arange(1, 13)
month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# Day length at 26°N (Assam)
day_length = 12 + 1.5 * np.sin(2 * np.pi * (months * 30 - 80) / 365)

# Traditional (photoperiod-sensitive): one crop
ax1.set_facecolor('#111827')
# Planting in June, flowering in Oct (when days shorten), harvest Nov
stages_trad = {
    'Planting': (6, 6.5, '#3b82f6'),
    'Vegetative': (6.5, 9.5, '#22c55e'),
    'Flowering': (9.5, 10.5, '#f59e0b'),
    'Grain fill': (10.5, 11.5, '#ef4444'),
    'Harvest': (11.5, 12, '#a855f7'),
}
for name, (start, end, color) in stages_trad.items():
    ax1.barh(0, end-start, left=start-0.5, height=0.4, color=color, alpha=0.8, label=name)

ax1.set_title('Traditional rice (photoperiod-sensitive): 1 harvest/year', color='#f59e0b', fontsize=11)
ax1.set_xlim(0.5, 12.5)
ax1.set_xticks(months)
ax1.set_xticklabels(month_names, color='gray')
ax1.set_yticks([])
ax1.legend(loc='upper left', facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, ncol=5)
ax1.tick_params(colors='gray')

# Plot day length on secondary axis
ax1b = ax1.twinx()
ax1b.plot(months, day_length, '--', color='white', alpha=0.3, linewidth=1)
ax1b.set_ylabel('Day length (h)', color='gray', fontsize=8)
ax1b.tick_params(colors='gray')

# Modern (photoperiod-insensitive): 2-3 crops
ax2.set_facecolor('#111827')
crops = [
    ('Crop 1', 1, '#22c55e'),
    ('Crop 2', 5, '#3b82f6'),
    ('Crop 3', 9, '#a855f7'),
]
for crop_name, start_month, color in crops:
    # Each crop: 3.5 months (plant, grow, flower, harvest)
    ax2.barh(0, 1, left=start_month-0.5, height=0.4, color=color, alpha=0.3)  # plant
    ax2.barh(0, 1.5, left=start_month+0.5, height=0.4, color=color, alpha=0.6)  # grow
    ax2.barh(0, 0.5, left=start_month+2, height=0.4, color=color, alpha=0.9)  # flower
    ax2.barh(0, 0.5, left=start_month+2.5, height=0.4, color=color, alpha=0.5)  # harvest
    ax2.text(start_month + 1.5, 0, crop_name, ha='center', va='center', color='white', fontsize=9, fontweight='bold')

ax2.set_title('Modern rice (photoperiod-insensitive): 3 harvests/year', color='#22c55e', fontsize=11)
ax2.set_xlim(0.5, 12.5)
ax2.set_xticks(months)
ax2.set_xticklabels(month_names, color='gray')
ax2.set_yticks([])
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Impact calculation
trad_yield = 4  # tonnes/hectare/crop
modern_yield = 5  # higher yielding variety
print("Impact of photoperiod-insensitive rice:")
print(f"  Traditional: {trad_yield} t/ha x 1 crop = {trad_yield} t/ha/year")
print(f"  Modern: {modern_yield} t/ha x 3 crops = {modern_yield * 3} t/ha/year")
print(f"  Increase: {modern_yield * 3 / trad_yield:.1f}x more food per hectare")
print()
print("This is one of the most impactful applications of plant biology")
print("in human history. Billions of people eat today because of")
print("photoperiod gene manipulation in rice and wheat.")`,
      challenge: 'Not all regions support 3 crops per year (water, temperature limits). Add a temperature constraint: rice needs >20°C. Shade out months where it is too cold for planting. How does this change the calculation for different latitudes?',
      successHint: 'Photoperiod manipulation turned knowledge of circadian biology into one of agriculture\'s greatest achievements. The genes that control night jasmine\'s blooming cycle are cousins of the genes that tripled rice yields.',
    },
    {
      title: 'LED lighting for agriculture — engineering the light spectrum',
      concept: `Understanding exactly which wavelengths plants use has enabled precision LED lighting for indoor farming:

**Key wavelengths:**
- **Red (660nm)**: drives photosynthesis (chlorophyll a absorption peak), promotes stem elongation
- **Blue (450nm)**: drives photosynthesis (chlorophyll b), promotes compact growth, thick leaves
- **Far-red (730nm)**: phytochrome signalling (shade avoidance, flowering control)
- **UV-A (380nm)**: flavonoid production (antioxidants, colour, pest resistance)
- **Green (530nm)**: penetrates deep into canopy, drives photosynthesis in lower leaves

**LED farming advantages:**
- Precise control of photoperiod (any day length, any time)
- Custom light recipes for each crop and growth stage
- 60-80% energy savings vs. fluorescent/HPS lighting
- No seasonal variation — consistent production year-round
- Vertical farming: grow crops in stacked layers indoors

**Current LED farming:**
- Lettuce/herbs: most commercially viable (short cycle, high value)
- Strawberries: LED manipulation of flowering and fruit colour
- Cannabis: precise photoperiod control for flowering
- Microgreens: 7-14 day growth under blue/red LEDs
- Research: NASA grows crops on the ISS under LEDs for space missions`,
      analogy: 'Traditional sunlight for plants is like giving a painter every colour at once. LED farming is like giving the painter exactly the colours they need — no waste. Plants don\'t use green light efficiently (they reflect it — that\'s why they look green). LED systems skip green and provide extra red and blue, delivering more useful photons per watt.',
      storyConnection: 'Could you grow night jasmine indoors with LEDs? Absolutely. You would program a short-day light cycle (10 hours on, 14 hours off) with red and blue LEDs to maintain photosynthesis, plus a pulse of far-red at "dusk" to trigger the phytochrome switch for flowering. The story\'s natural rhythm can be entirely reconstructed with engineering.',
      checkQuestion: 'If plants reflect green light (which is why they look green), why do some indoor farms still include green LEDs?',
      checkAnswer: 'Three reasons: (1) Green light penetrates deeper into thick canopies, reaching lower leaves that red/blue cannot. (2) Green light drives photosynthesis in lower chloroplasts within the leaf. (3) All-red-blue lighting makes it hard for farmers to visually inspect plants for disease, since everything looks purple under red+blue. Green LEDs add enough white-ish light for human vision.',
      codeIntro: 'Design a custom LED light recipe and calculate its photosynthetic efficiency vs. sunlight.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.arange(300, 800, 1)

# Photosynthesis action spectrum (McCree curve, normalised)
def mccree_curve(wl):
    """Approximate McCree photosynthetic action spectrum"""
    # Two peaks: blue (~440nm) and red (~670nm)
    blue_peak = 0.7 * np.exp(-((wl - 440)**2) / (2 * 25**2))
    red_peak = 1.0 * np.exp(-((wl - 670)**2) / (2 * 20**2))
    green_base = 0.4 * np.exp(-((wl - 550)**2) / (2 * 50**2))
    total = blue_peak + red_peak + green_base
    total[wl < 380] = 0
    total[wl > 720] = 0
    return total / np.max(total)

action = mccree_curve(wavelengths)

# Sunlight spectrum (approximate, normalised)
sun = np.exp(-((wavelengths - 550)**2) / (2 * 120**2))
sun[wavelengths < 300] = 0

# Custom LED recipe (peaks at specific wavelengths)
def led_spectrum(peaks, widths, intensities):
    spectrum = np.zeros_like(wavelengths, dtype=float)
    for peak, width, intensity in zip(peaks, widths, intensities):
        spectrum += intensity * np.exp(-((wavelengths - peak)**2) / (2 * width**2))
    return spectrum / np.max(spectrum)

# Optimised recipe
led_peaks = [450, 660, 730]  # blue, red, far-red
led_widths = [10, 10, 10]    # narrow LED bandwidth
led_intens = [0.3, 1.0, 0.1] # red dominant
led = led_spectrum(led_peaks, led_widths, led_intens)

fig, axes = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Spectra comparison
ax = axes[0]
ax.set_facecolor('#111827')
ax.fill_between(wavelengths, action, alpha=0.15, color='#22c55e')
ax.plot(wavelengths, action, color='#22c55e', linewidth=2, label='Plant action spectrum')
ax.fill_between(wavelengths, sun * 0.8, alpha=0.1, color='#f59e0b')
ax.plot(wavelengths, sun * 0.8, color='#f59e0b', linewidth=1, linestyle='--', label='Sunlight')
ax.fill_between(wavelengths, led, alpha=0.2, color='#ef4444')
ax.plot(wavelengths, led, color='#ef4444', linewidth=2, label='LED recipe')

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Relative intensity', color='white')
ax.set_title('Light Spectra: Sunlight vs LED Recipe vs Plant Needs', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Add colour bar
for wl_start, wl_end, color in [(380, 450, '#7c3aed'), (450, 500, '#3b82f6'),
                                   (500, 570, '#22c55e'), (570, 590, '#f59e0b'),
                                   (590, 620, '#f97316'), (620, 750, '#ef4444')]:
    ax.axvspan(wl_start, wl_end, ymin=0, ymax=0.03, alpha=0.5, color=color)

# Efficiency calculation
ax = axes[1]
ax.set_facecolor('#111827')

# Useful photons = spectrum * action spectrum
sun_useful = sun * action
led_useful = led * action

sun_eff = np.trapz(sun_useful, wavelengths) / np.trapz(sun, wavelengths) * 100
led_eff = np.trapz(led_useful, wavelengths) / np.trapz(led, wavelengths) * 100

bars = ax.bar(['Sunlight', 'LED recipe'], [sun_eff, led_eff],
               color=['#f59e0b', '#ef4444'], width=0.4)
ax.set_ylabel('Photosynthetic efficiency (%)', color='white')
ax.set_title('Useful Photons as % of Total Emitted', color='white', fontsize=12)
ax.tick_params(colors='gray')
for bar, val in zip(bars, [sun_eff, led_eff]):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{val:.1f}%', ha='center', color='white', fontsize=12, fontweight='bold')

plt.tight_layout()
plt.show()

print(f"Photosynthetic efficiency:")
print(f"  Sunlight: {sun_eff:.1f}% of photons are useful for photosynthesis")
print(f"  LED recipe: {led_eff:.1f}% of photons are useful")
print(f"  LED advantage: {led_eff/sun_eff:.1f}x more efficient per photon")
print()
print("This is why indoor vertical farms can produce 10-20x more")
print("lettuce per m² than outdoor farms, despite using artificial light.")`,
      challenge: 'Add a green LED peak at 530nm with intensity 0.2. Does overall efficiency go down? Now plot what the plant looks like under this light vs. pure red+blue (hint: under red+blue, plants look purple to human eyes).',
      successHint: 'From the night jasmine\'s natural photoperiod to precision LED farming, plant chronobiology has gone from folklore to engineering. Every vertical farm in the world relies on the circadian and photoreceptor biology we covered in this module.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Deep Dive
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Plant Molecular Biology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for molecular biology simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
