import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import WavelengthSpectrum from '../diagrams/WavelengthSpectrum';
import RayleighScatteringDiagram from '../diagrams/RayleighScatteringDiagram';
import SunsetPathDiagram from '../diagrams/SunsetPathDiagram';
import MieVsRayleighDiagram from '../diagrams/MieVsRayleighDiagram';
import HeatTransferDiagram from '../diagrams/HeatTransferDiagram';
import WaveEquationDiagram from '../diagrams/WaveEquationDiagram';

export default function OrangeSunsetsLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Beyond the rainbow — the electromagnetic spectrum',
      concept: `In Level 1, you plotted visible light from 380 nm (violet) to 700 nm (red). But light does not stop at these boundaries. There are wavelengths shorter than violet and longer than red — your eyes just cannot detect them.

Think of it as a radio dial. Your eyes can tune into one tiny station (visible light). But the dial extends in both directions:

**Shorter than violet** (higher energy, more dangerous):
- Ultraviolet (UV) — causes sunburn. The ozone layer blocks most of it.
- X-rays — pass through soft tissue. Used in medical imaging.
- Gamma rays — from nuclear reactions. Would destroy DNA.

**Longer than red** (lower energy, harmless):
- Infrared (IR) — you feel it as heat. Remote controls use it.
- Microwaves — WiFi, phone signals, microwave ovens.
- Radio waves — FM radio, TV, radar.

All of these are the **same thing** — electromagnetic waves — just at different wavelengths. They all travel at the speed of light (3 × 10⁸ m/s). The only difference is energy: \`E = hc/λ\` — shorter wavelength means higher energy.

The atmosphere blocks most of these except two "windows": visible light and radio. This is why ground telescopes use optics or radio dishes, while X-ray telescopes must be in space.`,
      analogy: 'The EM spectrum is like a piano keyboard stretching from here to the Moon. Visible light is a single octave in the middle — the only notes our eyes can "hear." Radio waves are the deep bass notes far to the left; gamma rays are the ultrasonic notes far to the right. We built instruments (radios, X-ray machines, infrared cameras) to detect the notes our eyes miss.',
      storyConnection: 'Assam\'s orange sunsets exist because our eyes evolved to detect exactly the wavelengths the Sun emits most strongly. If we could see infrared, the sky would glow uniformly with heat. If we could see UV, ozone absorption would make the sky appear dark above us. The sunset is beautiful precisely because of our biological limitations.',
      checkQuestion: 'Why did our eyes evolve to detect 380-700 nm and not, say, infrared or UV?',
      checkAnswer: 'Three converging factors: (1) The Sun peaks at ~500 nm — evolution optimized for the most abundant wavelengths. (2) Water transmits visible light but absorbs UV and IR — eyes evolved in water first. (3) Visible wavelengths carry useful information (color reveals ripe fruit, healthy foliage, predator eyes) without being so energetic that they damage the detector (unlike UV/X-rays).',
      codeIntro: 'Visualize the full electromagnetic spectrum with atmospheric transmission.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# --- EM Spectrum ---
ax1.set_facecolor('#111827')
bands = [
    ('Gamma', 1e-14, 1e-11, '#a855f7'), ('X-ray', 1e-11, 1e-8, '#7c3aed'),
    ('UV', 1e-8, 3.8e-7, '#3b82f6'), ('Visible', 3.8e-7, 7e-7, '#22c55e'),
    ('IR', 7e-7, 1e-3, '#ef4444'), ('Microwave', 1e-3, 3e-1, '#f59e0b'),
    ('Radio', 3e-1, 1e4, '#06b6d4'),
]
for name, lo, hi, color in bands:
    ax1.axvspan(lo, hi, alpha=0.3, color=color)
    ax1.text(np.sqrt(lo*hi), 0.5, name, ha='center', va='center', color='white', fontsize=9, fontweight='bold')

ax1.set_xscale('log')
ax1.set_xlim(1e-14, 1e4); ax1.set_ylim(0, 1)
ax1.set_xlabel('Wavelength (meters)', color='white', fontsize=11)
ax1.set_title('The Electromagnetic Spectrum', color='white', fontsize=13)
ax1.tick_params(colors='gray'); ax1.set_yticks([])

# --- Atmospheric transmission ---
ax2.set_facecolor('#111827')
wl = np.logspace(-7, 1, 1000)
def atm_trans(w):
    t = np.zeros_like(w)
    for i, wi in enumerate(w):
        if 3.5e-7 < wi < 1e-6: t[i] = 0.8
        elif 1e-6 < wi < 1.4e-6: t[i] = 0.6
        elif 2e-6 < wi < 2.5e-6: t[i] = 0.35
        elif 8e-6 < wi < 1.3e-5: t[i] = 0.2
        elif 1e-3 < wi < 3e-1: t[i] = 0.5 + 0.4*(np.log10(wi)+3)/2.5
        elif wi > 3e-1: t[i] = 0.9
        else: t[i] = 0.02
    return t

trans = atm_trans(wl)
ax2.fill_between(wl, trans, alpha=0.3, color='#3b82f6')
ax2.plot(wl, trans, color='#3b82f6', linewidth=1.5)
ax2.set_xscale('log'); ax2.set_xlim(1e-7, 1e1); ax2.set_ylim(0, 1)
ax2.set_xlabel('Wavelength (meters)', color='white')
ax2.set_ylabel('Transmission', color='white')
ax2.set_title('Atmospheric Windows', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.annotate('Optical window', xy=(5.5e-7, 0.85), color='#22c55e', fontsize=9, ha='center', fontweight='bold')
ax2.annotate('Radio window', xy=(5e-1, 0.85), color='#06b6d4', fontsize=9, ha='center', fontweight='bold')

plt.tight_layout()
plt.show()

print("The EM spectrum: ALL are oscillating electric + magnetic fields.")
print("  Differ only in wavelength/frequency/energy.")
print("  E = hc/λ — shorter wavelength = higher energy")
print()
print("Atmospheric windows let through:")
print("  Optical (380-700nm): visible + some near-IR")
print("  Radio (1cm-10m): radio astronomy, communication")
print("  Everything else: blocked → need space telescopes")`,
      challenge: 'Calculate the photon energy of: red light (700nm), UV-B (300nm), X-ray (0.1nm). Use E = hc/λ. How many red photons would you need to equal one X-ray photon\'s energy?',
      successHint: 'The visible spectrum is a narrow window into a vast electromagnetic universe. Orange sunsets are just one color of a much larger, invisible painting that instruments reveal across the full spectrum.',
    },
    {
      title: 'Scattering equations — putting numbers on it',
      concept: `In Level 1, you plotted \`1/λ**4\` and saw that blue scatters ~6× more than red. Now let's go further — calculate *exactly* how much light survives at sunset.

Two new concepts:

**Optical depth (τ)** — measures how much scattering a light ray encounters. The more air it passes through, the higher τ. The surviving light follows: **I = I₀ × e^(-τ)** (the Beer-Lambert law you used in Level 1's sunset exercise).

**Airmass** — how many "thicknesses" of atmosphere the light passes through:
- Sun overhead (noon): airmass = 1
- 60° from zenith: airmass = 2
- Sunset (horizon): airmass ≈ 38 (the light skims sideways through 38× more air)

Now combine them. At sunset (airmass 38):
- Blue (470nm): τ ≈ 0.18 × 38 = 6.8 → e^(-6.8) = **0.1% survives**
- Red (700nm): τ ≈ 0.04 × 38 = 1.5 → e^(-1.5) = **22% survives**

Red light survives **220 times** better than blue at sunset. That single calculation explains every orange sky you have ever seen.`,
      analogy: 'The 1/λ⁴ law is like a sieve with holes sized for red light. Blue photons are too "big" (scatter too much) and get caught; red photons are "small" enough to pass through. Make the sieve thicker (longer path at sunset), and even medium photons (green, yellow) get caught. Only the smallest (red) make it through.',
      storyConnection: 'Rayleigh\'s equation perfectly predicts Assam\'s sunset colors. The Brahmaputra valley\'s high humidity adds Mie scattering (weaker λ dependence), which explains why Assam sunsets are often orange rather than deep red: moisture particles scatter all colors slightly, adding warmth without the stark red of dry desert sunsets.',
      checkQuestion: 'At what zenith angle does blue light first become "mostly gone" (τ > 3, meaning 95% scattered)?',
      checkAnswer: 'For blue (470nm), τ_zenith ≈ 0.18. We need τ_total = 0.18 × airmass > 3, so airmass > 16.7. Using the approximation airmass = 1/cos(z), we get cos(z) < 0.06, or z > 86.6°. That is about 3.4° above the horizon — well into sunset. Blue starts fading noticeably around 75° (airmass ≈ 4, τ ≈ 0.7).',
      codeIntro: 'Calculate and plot the Rayleigh scattering equations quantitatively.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

wavelengths = np.linspace(380, 700, 200)

# --- 1/λ⁴ wavelength dependence ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
scatter = (550/wavelengths)**4
ax.plot(wavelengths, scatter, color='#3b82f6', linewidth=2.5)
ax.fill_between(wavelengths, scatter, alpha=0.15, color='#3b82f6')
for wl, name, c in [(400,'Violet','#7c3aed'),(470,'Blue','#3b82f6'),(550,'Green','#22c55e'),(700,'Red','#ef4444')]:
    s = (550/wl)**4
    ax.plot(wl, s, 'o', color=c, markersize=8, zorder=5)
    ax.annotate(f'{name}: {s:.1f}×', xy=(wl,s), xytext=(wl+10,s+0.5), color=c, fontsize=8,
                arrowprops=dict(arrowstyle='->', color=c, lw=0.8))
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Relative scattering', color='white')
ax.set_title('Rayleigh: 1/λ⁴', color='white', fontsize=11)
ax.tick_params(colors='gray')

# --- Angular pattern ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
theta = np.linspace(0, np.pi, 200)
angular = 1 + np.cos(theta)**2
ax.plot(np.degrees(theta), angular, color='#f59e0b', linewidth=2.5)
ax.fill_between(np.degrees(theta), angular, alpha=0.15, color='#f59e0b')
ax.axvline(90, color='#ef4444', linewidth=1.5, linestyle='--')
ax.text(92, 1.5, '90°: deepest blue,\\nmost polarized', color='#ef4444', fontsize=8)
ax.set_xlabel('Scattering angle (°)', color='white')
ax.set_ylabel('Intensity (1 + cos²θ)', color='white')
ax.set_title('Angular Distribution', color='white', fontsize=11)
ax.tick_params(colors='gray')

# --- Optical depth vs zenith angle ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
zenith = np.linspace(0, 89.5, 100)
airmass = 1/np.cos(np.radians(zenith))
for wl_val, name, c in [(400,'Violet','#7c3aed'),(470,'Blue','#3b82f6'),(550,'Green','#22c55e'),(700,'Red','#ef4444')]:
    tau0 = 0.0088 * (550/wl_val)**4 * 10  # approximate
    tau = tau0 * airmass
    ax.plot(zenith, tau, color=c, linewidth=2, label=name)
ax.axhline(1, color='gray', linestyle=':', alpha=0.3); ax.text(5,1.1,'63% gone',color='gray',fontsize=7)
ax.axhline(3, color='gray', linestyle=':', alpha=0.3); ax.text(5,3.1,'95% gone',color='gray',fontsize=7)
ax.set_xlabel('Zenith angle (°)', color='white')
ax.set_ylabel('Optical depth τ', color='white')
ax.set_title('Optical Depth vs Sun Position', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- Transmission spectrum at sunset ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
for z, label in [(0,'Noon'),(60,'60°'),(80,'80°'),(88,'Sunset 88°')]:
    am = 1/np.cos(np.radians(min(z,89.5)))
    tau = 0.1*(550/wavelengths)**4 * am
    trans = np.exp(-tau)
    ax.plot(wavelengths, trans, linewidth=2, label=label)
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Transmission', color='white')
ax.set_title('What Survives at Sunset', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Quantitative sunset physics:")
print("  At sunset (airmass ≈ 38):")
print("    Blue (470nm): τ ≈ 6.8 → 0.1% survives")
print("    Red (700nm):  τ ≈ 1.5 → 22% survives")
print("    Red is 220× stronger than blue")
print("  This IS the orange sunset, expressed as mathematics.")`,
      challenge: 'Find the exact wavelength where transmission = 50% at sunset (airmass = 38). This "color boundary" separates the surviving warm colors from the extinct cool colors.',
      successHint: 'A single equation — I ∝ 1/λ⁴ — explains both the blue sky and the orange sunset. Path length is the only difference. This is physics at its most elegant: one formula, two beautiful phenomena.',
    },
    {
      title: 'Polarization — light with a direction',
      concept: `Shake a rope up and down — the wave is **vertical**. Shake it side to side — **horizontal**. Light waves work the same way, except the "shaking" is an electric field. The direction it shakes is called **polarization**.

Sunlight is **unpolarized** — the electric field shakes in random directions. But when Rayleigh scattering bounces light sideways, something interesting happens: the scattered light becomes **polarized**. At 90° from the Sun, the sky is almost completely polarized in one direction.

Why does this matter?
- **Polarizing sunglasses** block reflected glare (reflected light is partially polarized)
- **Camera polarizers** deepen blue skies by blocking the polarized component
- **LCD screens** use two polarizers to control every pixel
- **Bees** navigate using the sky's polarization pattern — they can "see" what we cannot

The rule is simple: when polarized light passes through a filter at angle θ to its polarization, the intensity follows **Malus's Law: I = I₀ × cos²θ**. At 0° — full transmission. At 90° — nothing passes. You will plot this in the code below.`,
      analogy: 'Imagine waving a rope through a picket fence. Vertical waves pass through vertical slits. Horizontal waves are blocked. A polarizing filter is a picket fence for photons — it passes one oscillation direction and blocks the perpendicular one.',
      storyConnection: 'A photographer at the Brahmaputra capturing the orange sunset would use a polarizing filter rotated to 90° from the Sun. The filter darkens the polarized blue sky, making the orange sunset pop against deep blue. Polarization is invisible to the naked eye but controls the aesthetics of every sunset photograph.',
      checkQuestion: 'Two polarizers are crossed at 90° — no light passes. Insert a third at 45° between them. Does light now pass through?',
      checkAnswer: 'Yes! The first polarizer passes vertically polarized light. The 45° filter transmits cos²(45°) = 50% of that, now polarized at 45°. The final filter (horizontal) transmits cos²(45°) = 50% of the 45° light. Total: 25% of the first filter\'s output passes through — light from apparent nothing. This is because polarizers are not simply "gates" — they project the polarization state onto their axis, creating a new polarization that partially aligns with the next filter.',
      codeIntro: 'Visualize polarization and the sky\'s polarization pattern.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# --- Degree of polarization vs angle ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
theta = np.linspace(0, 180, 200)
DoP = np.sin(np.radians(theta))**2 / (1 + np.cos(np.radians(theta))**2)
ax.plot(theta, DoP*100, color='#3b82f6', linewidth=2.5)
ax.fill_between(theta, DoP*100, alpha=0.15, color='#3b82f6')
ax.axvline(90, color='#ef4444', linewidth=1.5, linestyle='--')
ax.text(92, 80, '90°: max polarization', color='#ef4444', fontsize=9)
ax.set_xlabel('Scattering angle from Sun (°)', color='white')
ax.set_ylabel('Degree of polarization (%)', color='white')
ax.set_title('Sky Polarization vs Angle from Sun', color='white', fontsize=11)
ax.tick_params(colors='gray')

# --- Malus's Law ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
angles = np.linspace(0, 180, 200)
intensity = np.cos(np.radians(angles))**2
ax.plot(angles, intensity*100, color='#22c55e', linewidth=2.5)
ax.fill_between(angles, intensity*100, alpha=0.15, color='#22c55e')
ax.axvline(90, color='#ef4444', linestyle='--', linewidth=1)
ax.text(92, 50, 'Crossed: 0%', color='#ef4444', fontsize=9)
ax.set_xlabel('Filter angle (°)', color='white')
ax.set_ylabel('Transmitted (%)', color='white')
ax.set_title("Malus's Law: I = I₀cos²θ", color='white', fontsize=11)
ax.tick_params(colors='gray')

# --- Three-polarizer puzzle ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Two crossed: 0%. With 45° insert: 12.5% of unpolarized input
configs = ['Unpolarized\\\n(100%)', 'After V\\\nfilter (50%)', 'After 45°\\\nfilter (25%)', 'After H\\\nfilter (12.5%)']
values = [100, 50, 25, 12.5]
colors_bar = ['#9ca3af', '#3b82f6', '#22c55e', '#ef4444']
bars = ax.bar(range(4), values, color=colors_bar, width=0.6)
ax.set_xticks(range(4)); ax.set_xticklabels(configs, color='white', fontsize=8)
ax.set_ylabel('Light intensity (%)', color='white')
ax.set_title('Three-Polarizer Puzzle', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, val in zip(bars, values):
    ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+2, f'{val}%', ha='center', color='white', fontsize=10)

# --- Sky polarization map ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
x = np.linspace(-90, 90, 50)
y = np.linspace(0, 90, 25)
X, Y = np.meshgrid(x, y)
angle_from_sun = np.sqrt(X**2 + Y**2)
angle_from_sun = np.clip(angle_from_sun, 0, 180)
dop = np.sin(np.radians(angle_from_sun))**2 / (1 + np.cos(np.radians(angle_from_sun))**2)
im = ax.pcolormesh(X, Y, dop*100, cmap='Blues', shading='auto')
plt.colorbar(im, ax=ax, label='Polarization %', shrink=0.8)
ax.plot(0, 0, '*', color='#fbbf24', markersize=15)
ax.text(2, -5, 'Sun', color='#fbbf24', fontsize=9)
ax.set_xlabel('Azimuth from Sun (°)', color='white')
ax.set_ylabel('Elevation (°)', color='white')
ax.set_title('Sky Polarization Map', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Polarization of Rayleigh-scattered light:")
print("  At 90° from Sun: ~100% polarized")
print("  At 0° or 180°: 0% polarized")
print()
print("Three-polarizer puzzle:")
print("  V + H = 0% (crossed)")
print("  V + 45° + H = 12.5% (inserting a filter ADDS light!)")
print("  This demonstrates that polarizers PROJECT, not just filter.")`,
      challenge: 'Some animals (bees, mantis shrimp) can see polarized light. What evolutionary advantage does this give? How would the sky look to a bee with polarization vision?',
      successHint: 'Polarization adds an invisible dimension to light. It enables glare reduction, sky-deepening photography, LCD screens, 3D cinema, and bee navigation. Rayleigh scattering gives us this polarization for free, every clear day.',
    },
    {
      title: 'Building a sky model — predicting sunset colour',
      concept: `You now have all the ingredients: Rayleigh scattering (1/λ⁴), Beer-Lambert law (e^(-τ)), and airmass. Let's combine them into a **function** that predicts the sky colour for any Sun angle, any humidity, any dust level.

The approach:
1. Pick a Sun angle (0° = noon, 89° = sunset)
2. Calculate **airmass** from the angle: \`airmass = 1 / cos(angle)\`
3. For each wavelength, calculate **optical depth**: Rayleigh + Mie scattering × airmass
4. Apply Beer-Lambert: \`surviving = solar × exp(-optical_depth)\`
5. Convert the surviving spectrum to an RGB colour

This is the core of what professional atmospheric models (MODTRAN, libRadtran) do — just with more layers and more physics. You are building a simplified version that produces surprisingly realistic results.

**Bonus physics:** Atmospheric refraction bends sunlight by about 0.5° near the horizon. This means you can see the Sun for ~2 minutes *after* it has geometrically set below the horizon. Every sunset lasts slightly longer than geometry predicts.`,
      analogy: 'An atmospheric model is like a flight simulator for photons. Instead of simulating an airplane flying through weather, it simulates billions of light rays bouncing through atmospheric layers. Each layer has its own temperature, density, and particle content. The output: a predicted sky color at any location, any time, any weather condition.',
      storyConnection: 'To predict the exact color of tonight\'s sunset over the Brahmaputra, you would need current weather data (humidity, aerosol content, cloud cover) fed into an atmospheric model. Such models exist and are used for satellite calibration, solar energy forecasting, and air quality assessment. The sunset is, in principle, calculable.',
      checkQuestion: 'Atmospheric refraction makes the Sun visible after it has set. Can you ever see a sunrise before the Sun has geometrically risen?',
      checkAnswer: 'Yes, for the same reason. Refraction bends light from below the horizon upward, so you see the Sun ~2 minutes before it geometrically clears the horizon. The visible day (sunrise to sunset) is about 4 minutes longer than the geometric day. At the equinox, when day should equal night, the visible day exceeds 12 hours by about 4 minutes.',
      codeIntro: 'Build a sky color model and predict sunset colors for different atmospheric conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def sky_model(zenith, humidity=0.5, aerosol=0.1):
    wl = np.linspace(380, 700, 100)
    am = 1/np.cos(np.radians(min(zenith, 89.5)))
    tau_r = 0.1*(550/wl)**4 * am
    tau_m = (aerosol*(550/wl)**0.8 + humidity*0.05*(550/wl)**0.2) * am
    solar = np.exp(-0.5*((wl-500)/150)**2)
    direct = solar * np.exp(-(tau_r + tau_m))
    scattered = solar * (1-np.exp(-tau_r))*0.3 + solar*(1-np.exp(-tau_m))*0.1
    return wl, direct, scattered

def spec_to_rgb(wl, spec):
    r = np.trapz(spec*np.exp(-0.5*((wl-610)/40)**2), wl)
    g = np.trapz(spec*np.exp(-0.5*((wl-540)/35)**2), wl)
    b = np.trapz(spec*np.exp(-0.5*((wl-460)/25)**2), wl)
    mx = max(r,g,b,1e-10)
    return (min(1,max(0,r/mx)), min(1,max(0,g/mx)), min(1,max(0,b/mx)))

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# --- Day progression ---
ax = axes[0, 0]; ax.set_facecolor('#111827')
n = 50; zeniths = np.linspace(0, 89.5, n)
for i, z in enumerate(zeniths):
    wl, d, s = sky_model(z, 0.6, 0.1)
    ax.add_patch(plt.Rectangle((i,0),1,1,color=spec_to_rgb(wl,s)))
    ax.add_patch(plt.Rectangle((i,1.1),1,1,color=spec_to_rgb(wl,d)))
ax.text(n/2,.5,'Sky',color='white',ha='center',fontsize=10)
ax.text(n/2,1.6,'Sun',color='black',ha='center',fontsize=10)
ax.set_xlim(0,n); ax.set_ylim(-.2,2.3); ax.set_xticks([]); ax.set_yticks([])
ax.set_title('Noon → Sunset (Assam humidity)', color='white', fontsize=11)

# --- Humidity effect ---
ax = axes[0, 1]; ax.set_facecolor('#111827')
for h, label, c in [(0.1,'Desert','#f59e0b'),(0.3,'Normal','#22c55e'),(0.6,'Assam','#3b82f6'),(0.9,'Monsoon','#06b6d4')]:
    wl, d, s = sky_model(30, h)
    ax.plot(wl, s, color=c, linewidth=2, label=label)
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Sky brightness', color='white')
ax.set_title('Humidity Effect (30° zenith)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- Aerosol effect at sunset ---
ax = axes[1, 0]; ax.set_facecolor('#111827')
for a, label, c in [(0.02,'Clean','#3b82f6'),(0.1,'Normal','#22c55e'),(0.3,'Polluted','#f59e0b'),(0.8,'Smoky','#9ca3af')]:
    wl, d, s = sky_model(80, aerosol=a)
    ax.plot(wl, d, color=c, linewidth=2, label=label)
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Direct sunlight', color='white')
ax.set_title('Aerosol Effect (near sunset)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- Full day RGB ---
ax = axes[1, 1]; ax.set_facecolor('#111827')
hours = np.linspace(6,18,100)
z_day = 90 - 45*np.sin((hours-6)/12*np.pi)
rs, gs, bs = [], [], []
for z in z_day:
    wl, d, s = sky_model(z, 0.6, 0.1)
    rgb = spec_to_rgb(wl, s)
    rs.append(rgb[0]); gs.append(rgb[1]); bs.append(rgb[2])
ax.plot(hours, rs, color='#ef4444', linewidth=2, label='R')
ax.plot(hours, gs, color='#22c55e', linewidth=2, label='G')
ax.plot(hours, bs, color='#3b82f6', linewidth=2, label='B')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('RGB component', color='white')
ax.set_title('Sky Color Through the Day', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Sky color model parameters:")
print("  Rayleigh: 1/λ⁴ (molecular scattering)")
print("  Mie: 1/λ⁰·⁸ (aerosol scattering)")
print("  Humidity adds wavelength-flat Mie component")
print("  Result: Assam (humid) → paler blue, softer orange sunsets")
print("  Desert (dry) → deep blue, vivid red sunsets")`,
      challenge: 'Model a volcanic sunset (aerosol=1.5 with steeper wavelength dependence). How do stratospheric sulfate aerosols produce different colors than surface pollution?',
      successHint: 'Computational atmospheric modeling is used for satellite calibration, solar energy prediction, and climate science. Your simplified model captures the essential physics that determines every sunset\'s color.',
    },
    {
      title: 'Colour temperature — why sunsets feel warm',
      concept: `Have you noticed that sunset light feels "warm" and fluorescent light feels "cold"? Photographers and filmmakers measure this with **colour temperature** in Kelvin:

- **1,800 K**: candle — deep orange-red
- **2,700 K**: incandescent bulb — warm yellow
- **5,000 K**: noon sunlight — neutral white
- **5,778 K**: Sun's actual surface
- **6,500 K**: overcast sky (D65 standard white)
- **10,000+ K**: blue sky

Counter-intuitively, "warm" light has LOW color temperature and "cool" light has HIGH. This is because cooler fires are red/orange while hotter fires are blue-white.

**Wien's displacement law**: λ_peak = 2,898,000 / T (nm)
- At 5778 K: peak = 501 nm (green) — the Sun's peak
- At 2700 K: peak = 1073 nm (infrared) — incandescent bulbs emit mostly heat!

Assam's sunsets: the filtered sunlight at ~2,000-2,500 K has the same color temperature as candlelight. This is why sunsets feel warm and intimate. The zenith sky at sunset exceeds 15,000 K — ethereally cool blue.

Cameras adjust **white balance** by compensating for color temperature. Set to daylight (5500 K) and photograph a sunset: colors are accurate. Set to indoor (3200 K): everything looks blue. Understanding color temperature prevents photographic mistakes.`,
      analogy: 'Color temperature is a "mood thermometer" for light. Low readings (2000-3000 K) = warm, firelit, romantic. High readings (6000-10000 K) = cool, clinical, overcast. Filmmakers use color temperature to set every scene\'s emotional tone. A warm 2700 K dinner scene vs. a cold 6500 K hospital scene — same room, different feeling.',
      storyConnection: 'The Brahmaputra at sunset is lit by ~2,200 K light — the same warmth as a traditional oil lamp. This creates the golden, intimate atmosphere that the story celebrates. By contrast, the same river at noon under 5,500 K light appears neutral and objective. Color temperature explains why sunsets FEEL different from noon, beyond just being dimmer.',
      checkQuestion: 'If the Sun\'s peak emission is at ~500 nm (green), why doesn\'t it look green?',
      checkAnswer: 'The Sun emits broadly across the entire visible spectrum, not narrowly at 500 nm. All three cone types are stimulated roughly equally, so your brain perceives white. A truly green star would need to emit ONLY green — but blackbody physics produces broad spectra. No star can appear purely green because the emission always spans enough of the spectrum to stimulate multiple cone types.',
      codeIntro: 'Visualize blackbody spectra at different color temperatures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def planck_normalized(wl_nm, T):
    wl = wl_nm * 1e-9
    h, c, k = 6.626e-34, 3e8, 1.381e-23
    B = (2*h*c**2/wl**5) / (np.exp(h*c/(wl*k*T))-1)
    return B / B.max()

wl = np.linspace(380, 700, 200)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# --- Blackbody spectra ---
ax1.set_facecolor('#111827')
def approx_rgb(T):
    s = planck_normalized(wl, T)
    r = np.trapz(s*np.exp(-0.5*((wl-610)/40)**2), wl)
    g = np.trapz(s*np.exp(-0.5*((wl-540)/35)**2), wl)
    b = np.trapz(s*np.exp(-0.5*((wl-460)/25)**2), wl)
    mx = max(r,g,b,1e-10)
    return (min(1,r/mx), min(1,g/mx), min(1,b/mx))

temps = [1800, 2700, 4000, 5778, 6500, 10000]
labels = ['Candle', 'Bulb', 'LED', 'Sun', 'Overcast', 'Blue sky']
for T, label in zip(temps, labels):
    s = planck_normalized(wl, T)
    rgb = approx_rgb(T)
    ax1.plot(wl, s, linewidth=2, label=f'{label} ({T}K)', color=rgb)
ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Relative intensity', color='white')
ax1.set_title('Blackbody Spectra', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax1.tick_params(colors='gray')

# --- Color temperature strip ---
ax2.set_facecolor('#111827')
n_t = 40; t_range = np.linspace(1500, 15000, n_t)
for i, T in enumerate(t_range):
    ax2.add_patch(plt.Rectangle((i,0),1,3,color=approx_rgb(T)))
for T, label in [(1800,'Candle'),(2700,'Bulb'),(5778,'Sun'),(6500,'D65'),(10000,'Sky')]:
    idx = np.argmin(np.abs(t_range-T))
    ax2.axvline(idx, color='white', linewidth=0.5, linestyle=':')
    ax2.text(idx+0.5, 3.2, f'{T}K\\n{label}', ha='center', color='white', fontsize=7)
ax2.set_xlim(0,n_t); ax2.set_ylim(-.3,4.5)
ax2.text(5,-.2,'Warm →',color='#ef4444',fontsize=9)
ax2.text(n_t-7,-.2,'← Cool',color='#3b82f6',fontsize=9)
ax2.set_title('Color Temperature Scale', color='white', fontsize=12)
ax2.set_xticks([]); ax2.set_yticks([])

plt.tight_layout()
plt.show()

print("Color temperature connects physics to perception:")
print(f"  Sunset over Brahmaputra: ~2,200 K (warm orange)")
print(f"  Noon sunlight: ~5,500 K (neutral white)")
print(f"  Overcast sky: ~6,500 K (cool blue-white)")
print(f"  Clear zenith: ~10,000+ K (deep blue)")
print()
print("Wien's law: λ_peak = 2,898,000 / T")
print(f"  Sun: {2898000/5778:.0f} nm (green — but looks white)")
print(f"  Candle: {2898000/1800:.0f} nm (infrared — mostly heat!)")`,
      challenge: 'An incandescent bulb at 2700 K has Wien peak at 1073 nm (infrared). What fraction of its emission is in the visible range (380-700 nm) vs infrared? This explains why incandescent bulbs are only ~5% efficient as light sources.',
      successHint: 'Color temperature quantifies the warmth of light in a single number. It enables precise communication between photographers, cinematographers, display engineers, and lighting designers. The sunset\'s warmth is not just poetic — it is 2,200 Kelvin.',
    },
    {
      title: 'Spectrophotometry — the instrument behind the science',
      concept: `Everything you have coded so far — scattering curves, sunset spectra, transmission — a real scientist measures with a **spectrophotometer**. It shines light through a sample and records exactly how much of each wavelength comes out the other side. Your eye says "orange sunset." A spectrophotometer says "580nm: 0.43 W/m²/nm, 600nm: 0.51, 620nm: 0.48."

A spectrophotometer has three parts:
1. **Light source** (tungsten for visible, deuterium for UV)
2. **Monochromator** (diffraction grating selects one wavelength)
3. **Detector** (photodiode or CCD measures intensity)

**Beer-Lambert Law**: A = ε × c × l
- A = absorbance, ε = molar absorptivity, c = concentration, l = path length

This is the sunset equation in different notation: the atmosphere is a 350 km cuvette, air molecules are absorbers, and τ = A × ln(10). Every sunset is a spectrophotometric measurement.

Applications:
- **Water quality**: turbidity, dissolved pollutants in Deepor Beel
- **Air quality**: aerosol optical depth, ozone monitoring
- **Astronomy**: stellar composition via spectral lines
- **Medicine**: pulse oximeters measure blood oxygen using two wavelengths (660nm and 940nm) and the ratio of oxygenated to deoxygenated hemoglobin absorption
- **Food science**: color measurement for quality control`,
      analogy: 'A spectrophotometer is an ultra-precise color detector. Your eye says "orange sunset." A spectrophotometer says "580nm: 0.43 W/m²/nm, 600nm: 0.51, 620nm: 0.48" — exact numbers at every wavelength. It is the difference between "warm outside" and "32.4°C."',
      storyConnection: 'A spectrophotometer pointed at Assam\'s sunset would decode its composition: humidity level, aerosol type, ozone concentration, and even the Sun\'s position — all from the spectrum of transmitted light. The sunset encodes atmospheric data that only precise measurement can extract.',
      checkQuestion: 'A pulse oximeter on your finger uses spectrophotometry. How does shining red and infrared light through your finger measure blood oxygen?',
      checkAnswer: 'Oxygenated hemoglobin (HbO₂) absorbs more infrared (940nm) and less red (660nm). Deoxygenated hemoglobin (Hb) absorbs more red and less infrared. The ratio of absorption at 660nm vs 940nm gives the oxygen saturation (SpO₂). Normal: 95-100%. Below 90%: dangerous hypoxia. This is Beer-Lambert law applied through living tissue.',
      codeIntro: 'Simulate spectrophotometric measurements and the Beer-Lambert law.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

wl = np.linspace(380, 700, 200)

# --- Beer-Lambert Law ---
ax = axes[0, 0]; ax.set_facecolor('#111827')
epsilon = np.exp(-0.5*((wl-500)/30)**2)
for c_val in [0, 0.5, 1, 2, 5]:
    A = epsilon * c_val * 1
    T = 10**(-A)
    ax.plot(wl, T, linewidth=2, label=f'c = {c_val}')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Transmittance', color='white')
ax.set_title('Beer-Lambert Law: A = εcl', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- Calibration curve ---
ax = axes[0, 1]; ax.set_facecolor('#111827')
conc = np.linspace(0, 5, 50)
A_at_500 = 1.0 * conc
ax.plot(conc, A_at_500, color='#22c55e', linewidth=2.5)
ax.plot(2.3, 2.3, 'o', color='#ef4444', markersize=10, zorder=5)
ax.plot([2.3,2.3],[0,2.3], '--', color='#ef4444', linewidth=1)
ax.plot([0,2.3],[2.3,2.3], '--', color='#ef4444', linewidth=1)
ax.annotate('Unknown:\\nA=2.3 → c=2.3', xy=(2.3,2.3), xytext=(3.2,3),
            color='#ef4444', fontsize=9, arrowprops=dict(arrowstyle='->', color='#ef4444'))
ax.set_xlabel('Concentration', color='white')
ax.set_ylabel('Absorbance', color='white')
ax.set_title('Calibration Curve', color='white', fontsize=11)
ax.tick_params(colors='gray')

# --- Atmospheric spectrophotometry ---
ax = axes[1, 0]; ax.set_facecolor('#111827')
wl2 = np.linspace(300, 800, 500)
solar = np.exp(-0.5*((wl2-500)/180)**2)
ozone = 1 - 0.3*np.exp(-0.5*((wl2-310)/15)**2)
water = 1 - 0.3*np.exp(-0.5*((wl2-720)/20)**2)
rayl = np.exp(-0.1*(550/np.maximum(wl2,300))**4)
ground = solar * ozone * water * rayl
ax.plot(wl2, solar, color='#fbbf24', linewidth=2, label='Top of atmosphere')
ax.plot(wl2, ground, color='#ef4444', linewidth=2, label='At ground')
ax.fill_between(wl2, ground, solar, alpha=0.1, color='#ef4444')
ax.annotate('Ozone', xy=(310,0.4), color='#a855f7', fontsize=8)
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Intensity', color='white')
ax.set_title('Solar Spectrum: Space vs Ground', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- Pulse oximetry ---
ax = axes[1, 1]; ax.set_facecolor('#111827')
wl_ox = np.linspace(600, 1000, 200)
HbO2 = 0.1 + 0.3*np.exp(-0.5*((wl_ox-660)/20)**2) + 0.8*np.exp(-0.5*((wl_ox-940)/40)**2)
Hb = 0.8*np.exp(-0.5*((wl_ox-660)/25)**2) + 0.2*np.exp(-0.5*((wl_ox-940)/50)**2)
ax.plot(wl_ox, HbO2, color='#ef4444', linewidth=2.5, label='HbO₂ (oxygenated)')
ax.plot(wl_ox, Hb, color='#3b82f6', linewidth=2.5, label='Hb (deoxygenated)')
ax.axvline(660, color='#f59e0b', linestyle='--', linewidth=1.5)
ax.axvline(940, color='#f59e0b', linestyle='--', linewidth=1.5)
ax.text(665, 0.85, '660nm', color='#f59e0b', fontsize=8)
ax.text(945, 0.85, '940nm', color='#f59e0b', fontsize=8)
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Absorption', color='white')
ax.set_title('Pulse Oximetry', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The sunset IS spectrophotometry:")
print("  Light source: Sun")
print("  Sample: 350 km of atmosphere")
print("  Detector: your eye (or a spectrometer)")
print("  Result: orange (blue absorbed, red transmitted)")
print()
print("Same principle measures:")
print("  Blood oxygen (pulse oximeter)")
print("  Water quality (turbidity)")
print("  Stellar composition (astronomical spectroscopy)")`,
      challenge: 'Design a spectrophotometric experiment to measure Deepor Beel water turbidity. What wavelength? What calibration? How would you relate absorbance to water quality?',
      successHint: 'Spectrophotometry is where all the optics in this series becomes practical. From atmospheric science to medicine to environmental monitoring, the ability to measure light precisely is one of the most important capabilities in science. Every sunset is a measurement waiting to be decoded.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 atmospheric optics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for optical physics simulations. Click to start.</p>
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
            diagram={[WavelengthSpectrum, RayleighScatteringDiagram, WaveEquationDiagram, SunsetPathDiagram, HeatTransferDiagram, MieVsRayleighDiagram][i] ? createElement([WavelengthSpectrum, RayleighScatteringDiagram, WaveEquationDiagram, SunsetPathDiagram, HeatTransferDiagram, MieVsRayleighDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
