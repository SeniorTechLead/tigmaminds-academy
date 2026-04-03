import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function StarDeepoorLevel2() {
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
      title: 'Stellar lifecycle — from gas cloud to remnant',
      concept: `Stars are born, live, and die. Their lifecycle depends almost entirely on one property: **mass**.

**Birth** (all stars): A cloud of gas and dust (nebula) collapses under gravity. As it compresses, the core heats up. When the core reaches ~10 million K, hydrogen fusion ignites — a star is born. This takes about 100,000 years.

**Main Sequence** (stable phase): The star fuses hydrogen into helium. Our Sun has been doing this for 4.6 billion years. Duration depends on mass:
- 0.1 M☉ (red dwarf): ~10 trillion years
- 1 M☉ (Sun): ~10 billion years
- 10 M☉ (blue giant): ~20 million years
- 50 M☉ (supergiant): ~4 million years

**Death** depends on mass:
- **< 8 M☉**: expands to red giant → sheds outer layers (planetary nebula) → leaves behind a **white dwarf** (Earth-sized, incredibly dense)
- **8-25 M☉**: expands to supergiant → core collapses → **supernova** explosion → **neutron star** (city-sized, nuclear density)
- **> 25 M☉**: same as above but the core is too massive for even neutrons → collapses to a **black hole**

The heavier elements in your body — iron, calcium, carbon — were forged inside massive stars and scattered by supernovae. You are literally made of stardust.`,
      analogy: 'A star\'s life is like a campfire. A small fire (low-mass star) burns slowly on a few logs and lasts all night. A bonfire (massive star) blazes brilliantly but burns through its fuel in hours. When the fuel runs out, a small fire leaves glowing embers (white dwarf). A bonfire might explode (supernova) and leave a crater (black hole). More fuel does NOT mean longer life — it means faster burning.',
      storyConnection: 'The star that "fell" into Deepor Beel was just a meteor — but real stars have lifecycles spanning billions of years. Some of the iron atoms in that meteorite were forged inside a massive star that exploded as a supernova over 4.6 billion years ago. The atoms in the meteor, in Deepor Beel\'s water, and in you were all created in dying stars.',
      checkQuestion: 'Why do massive stars live shorter lives? They have more fuel, so shouldn\'t they last longer?',
      checkAnswer: 'Massive stars burn fuel exponentially faster. Luminosity scales roughly as M³·⁵ (mass to the 3.5 power), while fuel scales as M. So lifetime ∝ M/M³·⁵ = M⁻²·⁵. A star 10× more massive burns fuel 10³·⁵ = 3,162× faster, giving it only 10/3162 ≈ 0.003× the lifetime. More mass = more gravity = higher core temperature = much faster fusion. The fire is too hot for its own good.',
      codeIntro: 'Simulate and visualize the complete lifecycle of stars with different masses.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# --- Stellar lifetime vs mass ---
ax1.set_facecolor('#111827')
masses = np.logspace(-1, 2, 100)  # 0.1 to 100 solar masses
# Lifetime ∝ M / L, where L ∝ M^3.5
lifetimes = 10 * masses**(-2.5)  # billion years (normalized to Sun = 10 Gyr)

ax1.loglog(masses, lifetimes, color='#f59e0b', linewidth=2.5)
ax1.fill_between(masses, lifetimes, alpha=0.1, color='#f59e0b')

# Mark specific stars
star_data = [
    (0.1, 'Red dwarf', '#ef4444'),
    (1.0, 'Sun', '#fbbf24'),
    (3.0, 'A-type', '#f5f5f5'),
    (10, 'Blue giant', '#3b82f6'),
    (50, 'Supergiant', '#a855f7'),
]
for mass, name, color in star_data:
    lifetime = 10 * mass**(-2.5)
    ax1.plot(mass, lifetime, 'o', color=color, markersize=10, zorder=5, edgecolors='white')
    ax1.annotate(f'{name}\\n{lifetime:.1f} Gyr' if lifetime > 0.01 else f'{name}\\n{lifetime*1000:.0f} Myr',
                xy=(mass, lifetime), xytext=(mass * 1.5, lifetime * 2),
                color=color, fontsize=8, arrowprops=dict(arrowstyle='->', color=color, lw=0.8))

ax1.axhline(13.8, color='gray', linestyle=':', alpha=0.3)
ax1.text(0.15, 15, 'Age of Universe (13.8 Gyr)', color='gray', fontsize=8)
ax1.set_xlabel('Star mass (M☉)', color='white', fontsize=11)
ax1.set_ylabel('Lifetime (billion years)', color='white', fontsize=11)
ax1.set_title('Stellar Lifetime vs Mass', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# --- Lifecycle flowchart ---
ax2.set_facecolor('#111827')
ax2.set_xlim(0, 10); ax2.set_ylim(0, 10)

# Common birth
ax2.add_patch(plt.FancyBboxPatch((3.5, 9), 3, 0.7, boxstyle='round,pad=0.1',
              facecolor='#374151', edgecolor='#9ca3af'))
ax2.text(5, 9.35, 'Nebula (gas cloud)', color='white', ha='center', fontsize=9, fontweight='bold')

ax2.annotate('', xy=(5, 8.5), xytext=(5, 9), arrowprops=dict(arrowstyle='->', color='white'))
ax2.add_patch(plt.FancyBboxPatch((3.5, 7.8), 3, 0.7, boxstyle='round,pad=0.1',
              facecolor='#374151', edgecolor='#9ca3af'))
ax2.text(5, 8.15, 'Protostar', color='white', ha='center', fontsize=9, fontweight='bold')

# Split by mass
ax2.annotate('', xy=(2.5, 7), xytext=(5, 7.8), arrowprops=dict(arrowstyle='->', color='#3b82f6'))
ax2.annotate('', xy=(7.5, 7), xytext=(5, 7.8), arrowprops=dict(arrowstyle='->', color='#ef4444'))
ax2.text(2.5, 7.5, '< 8 M☉', color='#3b82f6', fontsize=8)
ax2.text(7.5, 7.5, '> 8 M☉', color='#ef4444', fontsize=8)

# Low mass path
stages_low = [('Main Sequence', 6.3), ('Red Giant', 5.0), ('Planetary Nebula', 3.7), ('White Dwarf', 2.4)]
for label, y in stages_low:
    ax2.add_patch(plt.FancyBboxPatch((1, y), 3, 0.6, boxstyle='round,pad=0.1',
                  facecolor='#1e3a5f', edgecolor='#3b82f6'))
    ax2.text(2.5, y + 0.3, label, color='#93c5fd', ha='center', fontsize=8)
for i in range(len(stages_low)-1):
    ax2.annotate('', xy=(2.5, stages_low[i+1][1]+0.6), xytext=(2.5, stages_low[i][1]),
                arrowprops=dict(arrowstyle='->', color='#3b82f6', lw=0.8))

# High mass path
stages_high = [('Main Sequence', 6.3), ('Supergiant', 5.0), ('Supernova!', 3.7)]
for label, y in stages_high:
    color = '#ef4444' if 'Supernova' not in label else '#fbbf24'
    ax2.add_patch(plt.FancyBboxPatch((6, y), 3, 0.6, boxstyle='round,pad=0.1',
                  facecolor='#5f1e1e', edgecolor='#ef4444'))
    ax2.text(7.5, y + 0.3, label, color='#fca5a5', ha='center', fontsize=8)
for i in range(len(stages_high)-1):
    ax2.annotate('', xy=(7.5, stages_high[i+1][1]+0.6), xytext=(7.5, stages_high[i][1]),
                arrowprops=dict(arrowstyle='->', color='#ef4444', lw=0.8))

# Final remnants from supernova
ax2.annotate('', xy=(6.3, 2.4), xytext=(7, 3.7), arrowprops=dict(arrowstyle='->', color='#a855f7'))
ax2.annotate('', xy=(8.7, 2.4), xytext=(8, 3.7), arrowprops=dict(arrowstyle='->', color='#374151'))
ax2.add_patch(plt.FancyBboxPatch((5, 1.8), 2.5, 0.6, boxstyle='round,pad=0.1',
              facecolor='#3b1f5f', edgecolor='#a855f7'))
ax2.text(6.25, 2.1, 'Neutron Star', color='#c4b5fd', ha='center', fontsize=8)
ax2.add_patch(plt.FancyBboxPatch((7.8, 1.8), 2, 0.6, boxstyle='round,pad=0.1',
              facecolor='#1f1f1f', edgecolor='#6b7280'))
ax2.text(8.8, 2.1, 'Black Hole', color='#d1d5db', ha='center', fontsize=8)

ax2.text(6.5, 1.4, '8-25 M☉', color='#a855f7', fontsize=7)
ax2.text(8.5, 1.4, '> 25 M☉', color='#6b7280', fontsize=7)

ax2.set_title('Stellar Lifecycle', color='white', fontsize=13)
ax2.set_xticks([]); ax2.set_yticks([])

plt.tight_layout()
plt.show()

print("Stellar lifecycle summary:")
print("  All stars: nebula → protostar → main sequence")
print("  Low mass (< 8 M☉): → red giant → planetary nebula → white dwarf")
print("  High mass (8-25 M☉): → supergiant → supernova → neutron star")
print("  Very high mass (> 25 M☉): → supergiant → supernova → black hole")
print()
print("Key insight: lifetime ∝ M^(-2.5)")
print(f"  Sun (1 M☉): ~10 billion years")
print(f"  10 M☉ star: ~{10 * 10**(-2.5)*1000:.0f} million years")`,
      challenge: 'The smallest known star (EBLM J0555-57Ab) has 0.081 solar masses. Calculate its lifetime. Will it outlive the current age of the universe (13.8 billion years)? By how much?',
      successHint: 'Stellar lifecycles are the cosmic recycling program. Stars forge heavy elements, explode, scatter them into space, and new stars (and planets, and people) form from the debris. We are the universe recycling itself.',
    },
    {
      title: 'Light-years and cosmic scale — measuring the unmeasurable',
      concept: `Astronomical distances are so large that ordinary units (km, miles) become useless. Astronomers use:

- **Astronomical Unit (AU)**: Earth-Sun distance = 150 million km. Used within solar systems.
- **Light-year (ly)**: distance light travels in one year = 9.46 trillion km = 63,241 AU. Used between stars.
- **Parsec (pc)**: 3.26 ly. Based on parallax measurement. Used by professional astronomers.

Scale examples:
- Moon: 1.3 light-seconds away
- Sun: 8.3 light-minutes away
- Jupiter: 43 light-minutes away
- Proxima Centauri (nearest star): **4.24 light-years** away
- Center of Milky Way: ~26,000 light-years
- Andromeda Galaxy (nearest large galaxy): **2.5 million light-years**
- Edge of observable universe: **46 billion light-years**

The profound implication: when you look at a star 100 light-years away, you see it as it was 100 years ago. Every telescope is a time machine. The further you look in space, the further back in time you see. This is not metaphor — it is literal physics.`,
      analogy: 'Imagine you could only communicate by mail (no phone, no internet). A letter to your neighbor takes 1 second (the Moon). A letter to your friend across town takes 8 minutes (the Sun). A letter to another country takes 4.2 years (nearest star). A letter across the ocean takes 2.5 million years (Andromeda). By the time your letter arrives, civilizations have risen and fallen. This is the reality of cosmic communication.',
      storyConnection: 'The light from the star that "fell" into Deepor Beel may have left its source hundreds or thousands of years ago. The meteor itself — a piece of rock ejected from an asteroid collision — may have been traveling for millions of years before reaching Earth. Cosmic events operate on timescales that make human history look like a blink.',
      checkQuestion: 'If aliens on a planet 65 million light-years away look at Earth right now with a powerful telescope, what do they see?',
      checkAnswer: 'They see Earth 65 million years ago — the age of dinosaurs. The light that left Earth when T. Rex was alive is just now arriving at their telescope. If they watch for a while, they will eventually see the Chicxulub impact flash. They cannot see modern Earth because that light hasn\'t reached them yet — it won\'t for another 65 million years.',
      codeIntro: 'Visualize cosmic distances on a logarithmic scale.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cosmic distance ladder (distance in light-years)
objects = [
    ('Moon', 1.3/3.156e7, '#9ca3af'),  # 1.3 light-seconds
    ('Sun', 8.3/525960, '#fbbf24'),  # 8.3 light-minutes
    ('Jupiter', 43/525960, '#d4a574'),
    ('Voyager 1', 0.0024, '#22c55e'),
    ('Proxima Centauri', 4.24, '#ef4444'),
    ('Sirius', 8.6, '#93c5fd'),
    ('Betelgeuse', 700, '#ff8c42'),
    ('Galactic center', 26000, '#a855f7'),
    ('Andromeda', 2.5e6, '#3b82f6'),
    ('Observable universe edge', 4.6e10, '#f59e0b'),
]

names = [o[0] for o in objects]
distances = [o[1] for o in objects]
colors = [o[2] for o in objects]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# --- Log scale bar chart ---
ax1.set_facecolor('#111827')
y_pos = range(len(names))
bars = ax1.barh(y_pos, np.log10(distances), color=colors, height=0.6)
ax1.set_yticks(y_pos)
ax1.set_yticklabels(names, color='white', fontsize=9)
ax1.set_xlabel('Distance (log₁₀ light-years)', color='white', fontsize=11)
ax1.set_title('Cosmic Distance Ladder', color='white', fontsize=13)
ax1.tick_params(colors='gray')

for bar, dist in zip(bars, distances):
    if dist < 1:
        if dist < 0.001:
            label = f'{dist*525960:.1f} light-min'
        else:
            label = f'{dist:.4f} ly'
    elif dist < 1000:
        label = f'{dist:.1f} ly'
    elif dist < 1e6:
        label = f'{dist/1000:.0f} kly'
    elif dist < 1e9:
        label = f'{dist/1e6:.1f} Mly'
    else:
        label = f'{dist/1e9:.1f} Gly'
    ax1.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
             label, va='center', color='white', fontsize=8)

# --- Light travel time visualization ---
ax2.set_facecolor('#111827')

# Show what we see vs what's happening now
lookback = [
    ('Moon', 1.3, 's', '#9ca3af'),
    ('Sun', 8.3, 'min', '#fbbf24'),
    ('Proxima Centauri', 4.24, 'yr', '#ef4444'),
    ('Betelgeuse', 700, 'yr', '#ff8c42'),
    ('Galactic center', 26000, 'yr', '#a855f7'),
    ('Andromeda', 2.5e6, 'yr', '#3b82f6'),
]

y_positions = range(len(lookback))
for i, (name, time, unit, color) in enumerate(lookback):
    # Draw timeline
    ax2.barh(i, 1, left=0, height=0.5, color=color, alpha=0.6)
    if unit == 's':
        label = f'{time:.1f} seconds ago'
    elif unit == 'min':
        label = f'{time:.1f} minutes ago'
    else:
        if time < 1000:
            label = f'{time:.0f} years ago'
        elif time < 1e6:
            label = f'{time/1000:.0f} thousand years ago'
        else:
            label = f'{time/1e6:.1f} million years ago'
    ax2.text(1.1, i, f'{name}: we see it as it was {label}', va='center', color=color, fontsize=9)

ax2.set_xlim(0, 8)
ax2.set_yticks([]); ax2.set_xticks([])
ax2.set_title('Telescopes Are Time Machines', color='white', fontsize=13)

plt.tight_layout()
plt.show()

print("Every telescope is a time machine:")
print("  Looking at the Moon = seeing 1.3 seconds into the past")
print("  Looking at the Sun = seeing 8.3 minutes into the past")
print("  Looking at Proxima Centauri = seeing 4.24 years into the past")
print("  Looking at Andromeda = seeing 2.5 million years into the past")
print()
print("The further you look, the further back in time you see.")
print("The most distant objects visible are 13+ billion years old.")`,
      challenge: 'The James Webb Space Telescope can see galaxies from 13.5 billion years ago — just 300 million years after the Big Bang. How far away are those galaxies now? (Hint: the universe has been expanding, so they are much farther than 13.5 billion light-years.)',
      successHint: 'Cosmic scale is humbling and awe-inspiring. The universe is so vast that light — the fastest thing in existence — takes billions of years to cross it. Every photon that enters your eye from a distant star is an ancient messenger.',
    },
    {
      title: 'Spectroscopy — reading the fingerprints of stars',
      concept: `How do we know what stars are made of if we can never visit them? The answer is **spectroscopy** — analyzing the specific wavelengths of light a star emits or absorbs.

Every element produces a unique pattern of spectral lines — like a fingerprint. When hydrogen is heated, it emits light at exactly: 656.3 nm (red), 486.1 nm (blue-green), 434.0 nm (blue), 410.2 nm (violet). These are the **Balmer series** — and they appear in every star with hydrogen.

Types of spectra:
- **Emission spectrum**: hot gas emits light at specific wavelengths (bright lines on dark background)
- **Absorption spectrum**: cool gas in front of a hot source absorbs those same wavelengths (dark lines on bright background)
- **Continuous spectrum**: hot solid/dense gas emits all wavelengths (blackbody radiation)

A star's spectrum tells us:
- **Composition**: which elements are present (by which lines appear)
- **Temperature**: which lines are strongest (hotter = more ionized elements)
- **Velocity**: Doppler shift (moving toward us = blue-shifted, away = red-shifted)
- **Rotation**: line broadening (rotating stars have broader lines)
- **Magnetic fields**: Zeeman splitting (strong magnetic fields split spectral lines)

All from light alone. Spectroscopy is arguably the most powerful tool in all of science.`,
      analogy: 'Spectroscopy is like identifying a musician by their voice alone. Every element "sings" at unique frequencies (wavelengths). Hydrogen has a distinctive "voice," helium has another, iron another. A star\'s spectrum is a choir of all its elements singing together. A skilled spectroscopist can pick out each voice in the choir — even determining how loud (abundant) each element is.',
      storyConnection: 'If a meteor fell into Deepor Beel, a spectroscopist analyzing its fireball light could determine the meteoroid\'s composition in seconds — before it even hit the ground. Iron meteors show strong iron emission lines. Stony meteors show silicon, magnesium, and oxygen. The fireball IS the spectroscopic analysis, burning in real time.',
      checkQuestion: 'Helium was discovered on the Sun (via spectroscopy) before it was found on Earth. How is it possible to discover an element on a star 150 million km away?',
      checkAnswer: 'In 1868, astronomer Jules Janssen observed a yellow spectral line (587.6 nm) in the Sun\'s chromosphere during a solar eclipse. This line did not match any known element. Norman Lockyer named the unknown element "helium" after "helios" (Greek for Sun). It was not found on Earth until 1895, when William Ramsay isolated it from uranium ore. Spectroscopy identified it remotely 27 years before anyone could touch it.',
      codeIntro: 'Simulate emission and absorption spectra for hydrogen and other elements.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hydrogen Balmer series wavelengths (nm)
hydrogen_lines = {
    'Hα': 656.3,
    'Hβ': 486.1,
    'Hγ': 434.0,
    'Hδ': 410.2,
}

# Helium emission lines (nm)
helium_lines = {
    'He 587.6': 587.6,
    'He 501.6': 501.6,
    'He 471.3': 471.3,
    'He 447.1': 447.1,
}

# Sodium doublet
sodium_lines = {
    'Na D1': 589.6,
    'Na D2': 589.0,
}

# Iron (many lines)
iron_lines = {f'Fe {w}': w for w in [438.4, 440.5, 489.1, 495.8, 516.7, 527.0, 532.8, 537.1]}

fig, axes = plt.subplots(4, 1, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

def plot_emission(ax, lines, element_name, color):
    ax.set_facecolor('#111827')
    wavelengths = np.linspace(380, 700, 2000)

    # Continuous background (barely visible)
    ax.fill_between(wavelengths, 0, 0.05, color='gray', alpha=0.1)

    # Emission lines as narrow Gaussians
    for name, wl in lines.items():
        line = np.exp(-0.5 * ((wavelengths - wl) / 0.5) ** 2)
        ax.fill_between(wavelengths, line, color=color, alpha=0.7)
        ax.annotate(f'{name}\\n{wl}nm', xy=(wl, 1.05), ha='center', fontsize=6,
                    color='white', fontweight='bold')

    ax.set_xlim(380, 700)
    ax.set_ylim(0, 1.3)
    ax.set_title(f'{element_name} Emission Spectrum', color='white', fontsize=10)
    ax.set_xticks([]); ax.set_yticks([])

def plot_absorption(ax, lines, element_name, color):
    ax.set_facecolor('#111827')
    wavelengths = np.linspace(380, 700, 2000)

    # Rainbow continuous background
    for i in range(len(wavelengths)-1):
        w = wavelengths[i]
        if 380 <= w < 440: rgb = (-(w-440)/(440-380), 0, 1)
        elif 440 <= w < 490: rgb = (0, (w-440)/(490-440), 1)
        elif 490 <= w < 510: rgb = (0, 1, -(w-510)/(510-490))
        elif 510 <= w < 580: rgb = ((w-510)/(580-510), 1, 0)
        elif 580 <= w < 645: rgb = (1, -(w-645)/(645-580), 0)
        else: rgb = (1, 0, 0)
        ax.axvspan(wavelengths[i], wavelengths[i+1], color=rgb, alpha=0.6)

    # Dark absorption lines
    for name, wl in lines.items():
        ax.axvspan(wl - 1, wl + 1, color='#111827', alpha=0.9)
        ax.annotate(f'{wl}', xy=(wl, -0.1), ha='center', fontsize=5,
                    color='white', rotation=90)

    ax.set_xlim(380, 700)
    ax.set_ylim(-0.2, 1)
    ax.set_title(f'{element_name} Absorption Spectrum', color='white', fontsize=10)
    ax.set_xticks([]); ax.set_yticks([])

plot_emission(axes[0], hydrogen_lines, 'Hydrogen', '#ef4444')
plot_emission(axes[1], helium_lines, 'Helium', '#fbbf24')
plot_absorption(axes[2], {**hydrogen_lines, **sodium_lines}, 'Star (H + Na absorption)', '#3b82f6')
plot_emission(axes[3], iron_lines, 'Iron (many lines)', '#a855f7')

plt.tight_layout()
plt.show()

print("Spectroscopy: reading starlight")
print()
print("Hydrogen Balmer series:")
for name, wl in hydrogen_lines.items():
    print(f"  {name}: {wl} nm")
print()
print("From ONE star's spectrum, we learn:")
print("  Composition (which elements)")
print("  Temperature (which lines are strongest)")
print("  Velocity (Doppler shift)")
print("  Rotation (line broadening)")
print("  Magnetic fields (Zeeman splitting)")`,
      challenge: 'The Doppler formula: λ_observed = λ_rest × (1 + v/c). If a star\'s Hα line (rest = 656.3 nm) is observed at 658.0 nm, is the star moving toward or away from us? At what speed?',
      successHint: 'Spectroscopy is how we know the universe is expanding (red-shifted galaxies), what exoplanet atmospheres contain, and what the Sun is made of. It is the most versatile measurement technique in physics.',
    },
    {
      title: 'Orbital mechanics — the physics of falling around',
      concept: `Everything in space is in orbit — planets around stars, moons around planets, asteroids around the Sun. An orbit is really just **falling and missing**. An object in orbit is constantly falling toward the body it orbits but moving sideways fast enough to keep missing it.

**Kepler's Laws** (1609-1619):
1. **Orbits are ellipses** with the central body at one focus
2. **Equal areas in equal times**: a planet moves faster when closer to the Sun
3. **Period² ∝ semi-major axis³**: T² = (4π²/GM) × a³

**Orbital velocity** at radius r: v = √(GM/r)
- Earth's orbital speed: ~30 km/s
- ISS orbital speed: ~7.7 km/s (at 400 km altitude)
- Escape velocity from Earth's surface: ~11.2 km/s

**Types of orbits**:
- **Circular**: constant radius (special case of ellipse)
- **Elliptical**: varying distance (most natural orbits)
- **Parabolic**: just barely escaping (escape velocity exactly)
- **Hyperbolic**: escaping with speed to spare (interstellar objects)

The meteoroid that fell into Deepor Beel was originally in an elliptical orbit around the Sun. A gravitational perturbation (probably from Jupiter) nudged it onto a collision course with Earth.`,
      analogy: 'Imagine throwing a ball horizontally from the top of a very tall tower. Throw it gently — it falls to the ground nearby. Throw it harder — it falls farther away. Throw it at 7.7 km/s — it curves around the Earth and comes back to you. That\'s orbit: moving sideways so fast that the ground curves away from you at the same rate you\'re falling toward it. Newton figured this out in 1687.',
      storyConnection: 'The "star" that fell into Deepor Beel wasn\'t falling randomly — it was on a precise orbit around the Sun for millions of years before its path intersected Earth\'s orbit at exactly the right time and place. The impact was an orbital mechanics problem: two objects (Earth and meteoroid) converging at a point in space-time. Not random chance — predictable physics.',
      checkQuestion: 'The ISS orbits at 400 km altitude. If it stopped moving sideways, how long would it take to fall to the ground?',
      checkAnswer: 'Using free-fall: h = ½gt², so t = √(2h/g) = √(2 × 400,000 / 9.8) ≈ 286 seconds ≈ 4.8 minutes. The ISS would crash in under 5 minutes if it lost all horizontal velocity. It stays in orbit because it moves sideways at 7.7 km/s — fast enough that the ground curves away as fast as it falls. Orbit is controlled falling.',
      codeIntro: 'Simulate orbits using Newton\'s law of gravity and Kepler\'s laws.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def simulate_orbit(v0, r0, GM, dt=0.001, steps=10000):
    """Simulate a 2D orbit using Euler integration."""
    x, y = r0, 0
    vx, vy = 0, v0
    positions = [(x, y)]
    for _ in range(steps):
        r = np.sqrt(x**2 + y**2)
        ax = -GM * x / r**3
        ay = -GM * y / r**3
        vx += ax * dt
        vy += ay * dt
        x += vx * dt
        y += vy * dt
        positions.append((x, y))
    return np.array(positions)

# Normalized units: GM = 1, r0 = 1
GM = 1
r0 = 1

fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.patch.set_facecolor('#1f2937')

# --- Different orbit types ---
ax = axes[0]
ax.set_facecolor('#111827')

v_circular = np.sqrt(GM / r0)
v_elliptical = v_circular * 0.7
v_escape = np.sqrt(2 * GM / r0)
v_hyperbolic = v_escape * 1.2

orbits = [
    (v_circular, 'Circular', '#22c55e', 15000),
    (v_elliptical, 'Elliptical', '#f59e0b', 15000),
    (v_escape * 0.95, 'Near-escape', '#3b82f6', 8000),
    (v_hyperbolic, 'Hyperbolic', '#ef4444', 4000),
]

for v, label, color, steps in orbits:
    pos = simulate_orbit(v, r0, GM, dt=0.002, steps=steps)
    ax.plot(pos[:, 0], pos[:, 1], color=color, linewidth=1.5, label=label, alpha=0.8)

ax.plot(0, 0, 'o', color='#fbbf24', markersize=12)  # Central body
ax.plot(r0, 0, 'o', color='white', markersize=5)  # Starting point
ax.set_aspect('equal')
ax.set_title('Orbit Types', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.set_xlim(-3, 3); ax.set_ylim(-3, 3)

# --- Kepler's second law (equal areas) ---
ax = axes[1]
ax.set_facecolor('#111827')

# Elliptical orbit
e = 0.6  # eccentricity
a = 1 / (1 - e)  # semi-major axis for r0=1 at perihelion
v_peri = np.sqrt(GM * (1 + e) / (a * (1 - e)))
pos = simulate_orbit(v_peri, a * (1 - e), GM, dt=0.001, steps=20000)

ax.plot(pos[:, 0], pos[:, 1], color='#3b82f6', linewidth=1.5)
ax.plot(0, 0, 'o', color='#fbbf24', markersize=12)

# Shade equal-time sectors
n = len(pos)
sector_size = n // 8
colors_sector = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b']
for i, color in enumerate(colors_sector):
    start = i * 2 * sector_size
    end = start + sector_size
    if end < n:
        sector_x = np.concatenate([[0], pos[start:end, 0], [0]])
        sector_y = np.concatenate([[0], pos[start:end, 1], [0]])
        ax.fill(sector_x, sector_y, color=color, alpha=0.2)

ax.set_aspect('equal')
ax.set_title('Kepler\\'s 2nd Law:\\nEqual Areas in Equal Times', color='white', fontsize=10)
ax.tick_params(colors='gray')
ax.set_xlim(-4, 2); ax.set_ylim(-3, 3)

# --- Kepler's third law ---
ax = axes[2]
ax.set_facecolor('#111827')

# Planet data (AU, years)
planet_data = [
    ('Mercury', 0.387, 0.241),
    ('Venus', 0.723, 0.615),
    ('Earth', 1.0, 1.0),
    ('Mars', 1.524, 1.881),
    ('Jupiter', 5.203, 11.86),
    ('Saturn', 9.537, 29.46),
    ('Uranus', 19.19, 84.01),
    ('Neptune', 30.07, 164.8),
]

a_vals = [p[1] for p in planet_data]
T_vals = [p[2] for p in planet_data]
names = [p[0] for p in planet_data]

ax.loglog(a_vals, T_vals, 'o', color='#3b82f6', markersize=8, zorder=5)
# Kepler's law: T² = a³ → T = a^1.5
a_fit = np.logspace(-0.5, 1.6, 100)
T_fit = a_fit**1.5
ax.loglog(a_fit, T_fit, color='#f59e0b', linewidth=2, linestyle='--', label='T = a^(3/2)')

for name, a, T in planet_data:
    ax.annotate(name, xy=(a, T), xytext=(a*1.2, T*0.8),
                color='white', fontsize=7)

ax.set_xlabel('Semi-major axis (AU)', color='white')
ax.set_ylabel('Orbital period (years)', color='white')
ax.set_title('Kepler\\'s 3rd Law: T² ∝ a³', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Kepler's Laws:")
print("  1st: Orbits are ellipses")
print("  2nd: Equal areas in equal times (faster near perihelion)")
print("  3rd: T² = a³ (period squared = axis cubed)")
print()
print(f"Circular orbit velocity at Earth's distance: {np.sqrt(1/1):.2f} (normalized)")
print(f"Escape velocity: {np.sqrt(2/1):.2f} (√2 × circular)")`,
      challenge: 'An asteroid orbits the Sun at 2.5 AU. Using Kepler\'s 3rd law, calculate its orbital period. If Jupiter\'s gravity nudges it onto a collision course with Earth, how does its orbit change?',
      successHint: 'Orbital mechanics governs everything from satellite launches to Mars missions to asteroid deflection. Understanding orbits means understanding how everything moves in space — including the rocks that occasionally fall into places like Deepor Beel.',
    },
    {
      title: 'Space debris tracking — protecting Earth from above',
      concept: `There are two types of hazardous objects near Earth:

**Near-Earth Objects (NEOs)**: asteroids and comets whose orbits bring them close to Earth
- As of 2024, over **34,000 NEOs** have been cataloged
- About **2,350** are classified as **Potentially Hazardous Asteroids (PHAs)** — larger than 140m and passing within 7.5 million km
- NASA's Planetary Defense Coordination Office (PDCO) tracks them all

**Space debris (orbital junk)**: defunct satellites, rocket stages, collision fragments
- About **36,000 objects** larger than 10 cm tracked by the US Space Surveillance Network
- ~1 million objects 1-10 cm (dangerous but too small to track reliably)
- ~130 million objects < 1 cm
- Orbiting at 7-8 km/s, even a 1 cm paint chip can damage a satellite

Detection methods:
- **Optical telescopes**: detect NEOs by their reflected sunlight (good for large objects)
- **Radar** (Goldstone, Arecibo): bounce radio waves off NEOs for precise size/shape/orbit data
- **Space-based surveys**: NASA's NEOWISE (infrared — detects dark objects that optical telescopes miss)
- **Ground radar** (Space Fence): tracks orbital debris in real-time

In 2022, NASA's **DART mission** successfully deflected asteroid Dimorphos by crashing a spacecraft into it — the first planetary defense test. The impact changed Dimorphos's orbital period by 33 minutes, proving we can deflect asteroids.`,
      analogy: 'Tracking NEOs is like watching for trucks on a dark highway from a distance. You can see the big ones (bright headlights = large asteroids reflecting sunlight). Small ones are harder to spot. But even a small truck at highway speed (cosmic velocity) can be catastrophic. The goal: find them all, calculate their paths, and know years in advance if any will hit us.',
      storyConnection: 'If the Deepor Beel fireball happened today, it would be detected by multiple monitoring systems. Infrasound sensors would detect the shock wave. Satellite sensors would detect the flash. Meteorological radar might even track the fragments. But the object was too small and too fast for advance warning — that is why we need better detection for smaller NEOs.',
      checkQuestion: 'NASA\'s DART mission changed Dimorphos\'s orbit by 33 minutes. That seems tiny. How is this useful for planetary defense?',
      checkAnswer: 'Deflection works by changing the asteroid\'s velocity by a tiny amount, far in advance. If you deflect an asteroid 10 years before impact, even a tiny velocity change accumulates over millions of kilometers of travel, resulting in a miss distance of thousands of kilometers. The key is early detection — deflect 10 years out, and a nudge works. Discover it 6 months before impact, and you need a nuclear option. DART proved the nudge works; the challenge is finding threats early.',
      codeIntro: 'Visualize near-Earth object populations and impact probability calculations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# --- NEO size distribution ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
sizes = np.array([0.001, 0.01, 0.1, 0.14, 1, 10])  # km
discovered = np.array([0, 5000, 25000, 2350, 900, 15])
estimated = np.array([130000000, 10000000, 100000, 5000, 1000, 15])

ax.loglog(sizes * 1000, estimated, 'o--', color='#ef4444', linewidth=2, markersize=6, label='Estimated total')
ax.loglog(sizes * 1000, discovered, 's-', color='#22c55e', linewidth=2, markersize=6, label='Discovered')
ax.fill_between(sizes * 1000, discovered, estimated, alpha=0.1, color='#ef4444')

ax.set_xlabel('Diameter (meters)', color='white')
ax.set_ylabel('Number of objects', color='white')
ax.set_title('NEOs: Known vs Unknown', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# --- DART mission deflection ---
ax = axes[0, 1]
ax.set_facecolor('#111827')

# Deflection effect over time
years_advance = np.linspace(0.1, 20, 100)
miss_distance_km = 33 * 60 * 0.001 * years_advance * 365.25 * 24 * 3600 * 0.00001  # simplified
# More realistic: deltav = 1 mm/s, miss = deltav * time
delta_v = 0.001  # 1 mm/s change
miss_km = delta_v * years_advance * 365.25 * 24 * 3600 / 1000  # km

ax.plot(years_advance, miss_km, color='#22c55e', linewidth=2.5)
ax.fill_between(years_advance, miss_km, alpha=0.1, color='#22c55e')
ax.axhline(6371, color='#ef4444', linestyle='--', linewidth=1, label='Earth radius (6,371 km)')
ax.axhline(6371 * 10, color='#f59e0b', linestyle=':', linewidth=1, label='Safe miss (10 Earth radii)')

# Mark key points
for yr in [1, 5, 10]:
    miss = delta_v * yr * 365.25 * 24 * 3600 / 1000
    ax.plot(yr, miss, 'o', color='white', markersize=6)
    ax.annotate(f'{yr}yr: {miss:.0f} km', xy=(yr, miss), xytext=(yr+1, miss*1.5),
                color='white', fontsize=8, arrowprops=dict(arrowstyle='->', color='white'))

ax.set_xlabel('Years before impact (advance warning)', color='white')
ax.set_ylabel('Miss distance (km)', color='white')
ax.set_title('Deflection Effect vs Warning Time', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='upper left')
ax.tick_params(colors='gray')
ax.set_yscale('log')

# --- Space debris environment ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
altitude_bins = ['200-400', '400-600', '600-800', '800-1000', '1000-1200', '1200+']
debris_count = [2000, 5000, 8000, 12000, 4000, 5000]  # approximate tracked objects

ax.barh(altitude_bins, debris_count, color='#f59e0b', height=0.6)
ax.set_xlabel('Tracked objects (> 10 cm)', color='white')
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('Space Debris by Altitude', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Mark key altitudes
ax.axvline(x=0, color='gray')
ax.text(13000, 0, 'ISS: 400 km', color='#3b82f6', fontsize=8)
ax.text(13000, 3, 'Hubble: 540 km', color='#22c55e', fontsize=8)

# --- Impact probability timeline ---
ax = axes[1, 1]
ax.set_facecolor('#111827')

years = np.array([1, 10, 100, 1000, 10000, 100000, 1000000])
prob_1m = 1 - (1 - 1/100)**years  # 1m object: ~1 per year
prob_50m = 1 - (1 - 1/1000)**years  # 50m object: ~1 per 1000 years
prob_1km = 1 - (1 - 1/500000)**years  # 1km object: ~1 per 500,000 years

ax.semilogx(years, prob_1m * 100, color='#22c55e', linewidth=2, label='1m (Deepor Beel size)')
ax.semilogx(years, prob_50m * 100, color='#f59e0b', linewidth=2, label='50m (Tunguska size)')
ax.semilogx(years, prob_1km * 100, color='#ef4444', linewidth=2, label='1km (civilization threat)')

ax.set_xlabel('Time window (years)', color='white')
ax.set_ylabel('Cumulative probability (%)', color='white')
ax.set_title('Impact Probability Over Time', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.set_ylim(0, 105)

plt.tight_layout()
plt.show()

print("Planetary defense status:")
print("  34,000+ NEOs discovered (and counting)")
print("  2,350 Potentially Hazardous Asteroids tracked")
print("  DART mission: first successful asteroid deflection (2022)")
print("  Key insight: EARLY detection = small nudge. Late detection = big problem.")
print()
print("Space debris: ~36,000 objects tracked")
print("  Kessler syndrome risk: collisions create more debris,")
print("  which causes more collisions, potentially making some")
print("  orbits unusable for decades.")`,
      challenge: 'An asteroid is discovered on a collision course with Earth, arriving in exactly 5 years. If a DART-like mission can change its velocity by 2 mm/s, is that enough to make it miss? Calculate the miss distance and compare to Earth\'s radius.',
      successHint: 'Space debris tracking and planetary defense are among the most critical applications of orbital mechanics and astronomy. The physics of the Deepor Beel meteor, scaled up, becomes the physics of existential risk from asteroid impacts.',
    },
    {
      title: 'Telescope design — how we see the invisible',
      concept: `Telescopes are light-collection machines. Their power comes from two properties:

**1. Aperture** (diameter of the primary mirror/lens):
- Larger aperture = more light collected = fainter objects visible
- Light-gathering power ∝ area ∝ diameter²
- A 10 m telescope gathers 100× more light than a 1 m telescope

**2. Resolution** (ability to distinguish fine details):
- Limited by diffraction: θ = 1.22 × λ/D (Rayleigh criterion)
- Larger aperture = better resolution
- Also limited by atmospheric turbulence (seeing) — which is why we put telescopes in space

**Types of telescopes**:
- **Refractor**: uses lenses. Simple but limited by chromatic aberration and lens size (largest: 1 m)
- **Reflector**: uses mirrors. No chromatic aberration, can be made very large (largest: 39 m ELT, under construction)
- **Radio telescopes**: detect radio waves. Can be enormous (500 m FAST in China) because radio waves are long
- **Space telescopes**: above the atmosphere. JWST (infrared, 6.5 m), Hubble (optical, 2.4 m), Chandra (X-ray)

Adaptive optics (AO) is a remarkable technology: a deformable mirror adjusts its shape hundreds of times per second to compensate for atmospheric turbulence, allowing ground telescopes to approach space telescope resolution.`,
      analogy: 'A telescope is like a bucket in the rain. A bigger bucket catches more raindrops (photons). A bucket in a covered area (space telescope) catches cleaner rain (no atmospheric distortion). A bucket with a funnel (adaptive optics) directs scattered raindrops into the bucket more efficiently. The goal: catch as many photons as possible, as cleanly as possible.',
      storyConnection: 'If someone at Deepor Beel had a telescope pointed at the meteor, they could have captured the fireball\'s spectrum (composition), trajectory (orbit), and brightness curve (size and speed). Amateur astronomers with even modest telescopes can contribute to meteor science. The telescope — whether Galileo\'s 1609 refractor or JWST — remains our primary tool for understanding the cosmos that sends rocks toward Earth.',
      checkQuestion: 'The James Webb Space Telescope has a 6.5 m mirror. The upcoming Extremely Large Telescope (ELT) will have a 39 m mirror. Why bother with space telescopes when ground telescopes can be bigger?',
      checkAnswer: 'Atmosphere blocks infrared and UV light almost completely — JWST sees infrared that ground telescopes cannot detect at all. Atmosphere also causes turbulence (twinkling), limiting resolution regardless of mirror size. Space gives perfect stability, zero light pollution, and access to all wavelengths. Ground telescopes are bigger and cheaper but limited to visible/radio windows. Both are needed: ground for raw size, space for clarity and wavelength coverage.',
      codeIntro: 'Compare telescope performance: aperture, resolution, and light gathering.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# --- Light gathering power ---
ax = axes[0, 0]
ax.set_facecolor('#111827')

diameters = np.linspace(0.1, 40, 100)
light_power = (diameters / 0.007)**2  # relative to human eye (7mm pupil)

ax.semilogy(diameters, light_power, color='#f59e0b', linewidth=2.5)
ax.fill_between(diameters, light_power, alpha=0.1, color='#f59e0b')

# Mark famous telescopes
telescopes = [
    (0.1, 'Binoculars', '#22c55e'),
    (0.2, 'Amateur 8"', '#3b82f6'),
    (2.4, 'Hubble', '#a855f7'),
    (6.5, 'JWST', '#ef4444'),
    (10, 'Keck', '#06b6d4'),
    (39, 'ELT (planned)', '#f59e0b'),
]
for d, name, color in telescopes:
    power = (d / 0.007)**2
    ax.plot(d, power, 'o', color=color, markersize=8, zorder=5)
    ax.annotate(f'{name}\\n{d}m', xy=(d, power), xytext=(d + 1, power * 2),
                color=color, fontsize=7, arrowprops=dict(arrowstyle='->', color=color, lw=0.8))

ax.set_xlabel('Mirror diameter (m)', color='white')
ax.set_ylabel('Light gathering (× human eye)', color='white')
ax.set_title('Light Gathering Power', color='white', fontsize=11)
ax.tick_params(colors='gray')

# --- Angular resolution ---
ax = axes[0, 1]
ax.set_facecolor('#111827')

wavelength = 550e-9  # 550 nm (green light)
resolution_arcsec = 1.22 * wavelength / diameters * 206265  # convert radians to arcseconds

ax.loglog(diameters, resolution_arcsec, color='#3b82f6', linewidth=2.5, label='Diffraction limit (550nm)')

# Atmospheric seeing limit
ax.axhline(1.0, color='#ef4444', linestyle='--', linewidth=1.5, label='Good seeing (1")')
ax.axhline(0.3, color='#22c55e', linestyle='--', linewidth=1.5, label='Adaptive optics (0.3")')

for d, name, color in telescopes:
    res = 1.22 * wavelength / d * 206265
    ax.plot(d, res, 'o', color=color, markersize=8, zorder=5)

ax.set_xlabel('Mirror diameter (m)', color='white')
ax.set_ylabel('Resolution (arcseconds)', color='white')
ax.set_title('Angular Resolution (smaller = better)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- Electromagnetic spectrum coverage ---
ax = axes[1, 0]
ax.set_facecolor('#111827')

bands = ['Gamma\\nray', 'X-ray', 'UV', 'Visible', 'Near-IR', 'Mid-IR', 'Radio']
ground_access = [0, 0, 0.2, 1.0, 0.7, 0.1, 0.9]
space_access = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]

x = np.arange(len(bands))
ax.bar(x - 0.2, ground_access, 0.35, color='#ef4444', label='Ground telescope', alpha=0.7)
ax.bar(x + 0.2, space_access, 0.35, color='#3b82f6', label='Space telescope', alpha=0.7)
ax.set_xticks(x)
ax.set_xticklabels(bands, color='white', fontsize=8)
ax.set_ylabel('Atmospheric transmission', color='white')
ax.set_title('Wavelength Access: Ground vs Space', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- Timeline of telescope apertures ---
ax = axes[1, 1]
ax.set_facecolor('#111827')

history = [
    (1609, 0.04, 'Galileo', '#9ca3af'),
    (1668, 0.033, 'Newton', '#9ca3af'),
    (1789, 1.2, 'Herschel', '#f59e0b'),
    (1917, 2.5, 'Hooker', '#f59e0b'),
    (1948, 5.1, 'Hale', '#22c55e'),
    (1990, 2.4, 'Hubble (space)', '#a855f7'),
    (1993, 10, 'Keck', '#3b82f6'),
    (2021, 6.5, 'JWST (space)', '#ef4444'),
    (2028, 39, 'ELT (planned)', '#f59e0b'),
]

years_h = [h[0] for h in history]
diams = [h[1] for h in history]
names_h = [h[2] for h in history]
colors_h = [h[3] for h in history]

ax.scatter(years_h, diams, c=colors_h, s=80, zorder=5, edgecolors='white', linewidths=0.5)
ax.plot(years_h, diams, color='gray', linewidth=1, linestyle='--', alpha=0.3)

for yr, d, name, color in history:
    ax.annotate(name, xy=(yr, d), xytext=(yr, d*1.3),
                color=color, fontsize=7, ha='center')

ax.set_xlabel('Year', color='white')
ax.set_ylabel('Aperture (m)', color='white')
ax.set_title('Telescope Aperture Over Time', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.set_yscale('log')

plt.tight_layout()
plt.show()

print("Telescope engineering milestones:")
print("  1609: Galileo's 4cm refractor → moons of Jupiter")
print("  1948: Hale 5.1m reflector → galaxies beyond Milky Way")
print("  1990: Hubble 2.4m in space → deep field, dark energy")
print("  2021: JWST 6.5m in space → first galaxies, exoplanet atmospheres")
print("  2028: ELT 39m on ground → direct exoplanet imaging")
print()
print("From Deepor Beel, you can see ~5,000 stars with the naked eye.")
print("A backyard telescope shows ~100,000. Hubble sees ~100 BILLION galaxies.")`,
      challenge: 'A 20 cm amateur telescope has a diffraction-limited resolution of about 0.7 arcseconds at 550 nm. But atmospheric seeing limits ground resolution to ~1-2 arcseconds. At what aperture does the atmosphere become the bottleneck rather than the mirror size?',
      successHint: 'Telescopes transform invisible, distant phenomena into knowledge. From Galileo\'s simple lens to JWST\'s gold-plated beryllium mirror, the principle is the same: collect photons, focus them, and learn what they tell us about the universe. The star that fell into Deepor Beel is a story from that universe.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 astronomy foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for astrophysics simulations. Click to start.</p>
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
