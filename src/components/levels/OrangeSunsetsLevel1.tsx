import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function OrangeSunsetsLevel1() {
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
      title: 'White light is all colors — the hidden rainbow in sunlight',
      concept: `Sunlight looks white, but it is actually a mixture of every color of the visible spectrum — red, orange, yellow, green, blue, and violet — all blended together.

Isaac Newton proved this in 1666 by passing a beam of sunlight through a glass **prism**. The prism bent each wavelength by a different amount (a property called **dispersion**), splitting white light into its component colors. He then used a second prism to recombine the rainbow back into white light — proving that colors are not created by the prism but are already present in sunlight.

Key facts:
- **Shorter wavelengths** (violet, 380-450nm) bend more through the prism
- **Longer wavelengths** (red, 620-700nm) bend less
- The Sun emits light across the entire visible spectrum, peaking around 500nm (green-blue)
- Our eyes perceive this mix as white because all three cone types are stimulated equally

This is the starting point for understanding Assam's orange sunsets: if sunlight is all colors, why do sunsets show only some colors? Something must be removing the blue.`,
      analogy: 'White light is like a chord played on a piano — many notes (wavelengths) sounding simultaneously. Your ear hears a blended chord, not individual notes. A prism is like a music visualizer that separates the chord into its individual notes, letting you see each one. Sunlight is the richest chord in nature — every note from violet to red, all at once.',
      storyConnection: 'When the sun sets over the Brahmaputra, the white sunlight that illuminated the river all day is being filtered by the atmosphere. The colors you see at sunset — orange, red, pink, purple — are the notes that survive the filtering. Understanding why starts with Newton\'s discovery that white contains every color.',
      checkQuestion: 'If the Sun\'s peak emission is at about 500nm (green-blue), why doesn\'t the Sun look green?',
      checkAnswer: 'The Sun emits strongly across the entire visible spectrum — the peak at 500nm doesn\'t mean it only emits green. It emits plenty of red, yellow, and blue too. When all these wavelengths hit your eye together, your three cone types are all stimulated, and your brain perceives this as white (or pale yellow, when compared to a truly white surface). A truly green star would need to emit ONLY green, with no red or blue — but blackbody physics doesn\'t allow such narrow emission.',
      codeIntro: 'Plot the Sun\'s emission spectrum and show how white light contains all colors.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Planck blackbody spectrum for the Sun (T = 5778 K)
wavelengths = np.linspace(200, 2000, 1000)  # nm
T = 5778  # K
h = 6.626e-34  # Planck constant
c = 3e8  # speed of light
k = 1.381e-23  # Boltzmann constant

# Convert wavelength to meters for calculation
wl_m = wavelengths * 1e-9
# Planck function (spectral radiance)
B = (2 * h * c**2 / wl_m**5) / (np.exp(h * c / (wl_m * k * T)) - 1)
B_normalized = B / B.max()

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# --- Solar spectrum ---
ax1.set_facecolor('#111827')

# Color the visible region
for i in range(len(wavelengths) - 1):
    wl = wavelengths[i]
    if 380 <= wl <= 700:
        if wl < 440: rgb = (-(wl-440)/(440-380)*0.5, 0, 0.5)
        elif wl < 490: rgb = (0, (wl-440)/(490-440)*0.5, 0.5)
        elif wl < 510: rgb = (0, 0.5, -(wl-510)/(510-490)*0.5)
        elif wl < 580: rgb = ((wl-510)/(580-510)*0.5, 0.5, 0)
        elif wl < 645: rgb = (0.5, -(wl-645)/(645-580)*0.5, 0)
        else: rgb = (0.5, 0, 0)
        ax1.axvspan(wavelengths[i], wavelengths[i+1], color=rgb, alpha=0.3)

ax1.plot(wavelengths, B_normalized, color='white', linewidth=2)
ax1.fill_between(wavelengths, B_normalized, alpha=0.1, color='white')

ax1.axvline(500, color='#22c55e', linewidth=1, linestyle=':', alpha=0.5)
ax1.text(505, 0.95, 'Peak ~500nm', color='#22c55e', fontsize=9)

ax1.axvspan(380, 700, alpha=0.05, color='white')
ax1.text(540, 0.5, 'Visible range', color='white', fontsize=10, ha='center')

ax1.set_xlim(200, 1500)
ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Relative intensity', color='white')
ax1.set_title('Solar Emission Spectrum (T = 5,778 K)', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# --- Visible spectrum bar with cone responses ---
ax2.set_facecolor('#111827')
vis_wl = np.linspace(380, 700, 500)

# Cone responses
s_cone = np.exp(-0.5*((vis_wl - 440)/20)**2)
m_cone = np.exp(-0.5*((vis_wl - 535)/40)**2)
l_cone = np.exp(-0.5*((vis_wl - 565)/45)**2)

ax2.plot(vis_wl, s_cone, color='#3b82f6', linewidth=2, label='S-cone (blue)')
ax2.plot(vis_wl, m_cone, color='#22c55e', linewidth=2, label='M-cone (green)')
ax2.plot(vis_wl, l_cone, color='#ef4444', linewidth=2, label='L-cone (red)')

# Solar intensity in visible range (relatively flat)
solar_vis = np.interp(vis_wl, wavelengths, B_normalized)
ax2.fill_between(vis_wl, solar_vis * 0.9, alpha=0.1, color='#fbbf24', label='Sunlight intensity')

ax2.set_xlabel('Wavelength (nm)', color='white')
ax2.set_ylabel('Relative response', color='white')
ax2.set_title('Why White Light Looks White: All Cones Stimulated Equally', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("White sunlight contains ALL visible wavelengths.")
print("The Sun peaks at ~500nm but emits broadly.")
print("All 3 cone types are stimulated → brain says 'white'.")
print()
print("Key question: if sunlight is white, why are sunsets orange?")
print("Something must REMOVE the blue. That something is the atmosphere.")`,
      challenge: 'Plot the blackbody spectrum for three different temperatures: 3000 K (red dwarf), 5778 K (Sun), and 10000 K (hot star). How does the peak wavelength shift? This is Wien\'s law: λ_max = 2,898,000 / T.',
      successHint: 'Understanding that white light is a mixture of all colors is the essential first step. Every optical phenomenon — sunsets, rainbows, blue skies, green leaves — is about selectively removing some wavelengths from this mix.',
    },
    {
      title: 'Why the sky is blue — Rayleigh scattering explained',
      concept: `The sky is blue because of **Rayleigh scattering** — the scattering of light by particles much smaller than the wavelength of light (in this case, nitrogen and oxygen molecules in the atmosphere, ~0.3 nm, compared to light at 400-700 nm).

The key equation: **scattering intensity ∝ 1/λ⁴**

This means shorter wavelengths scatter MUCH more:
- Violet (400nm): scatters (700/400)⁴ = **9.4×** more than red (700nm)
- Blue (470nm): scatters (700/470)⁴ = **4.9×** more than red

So blue and violet light are scattered in all directions by the atmosphere, while red, orange, and yellow pass through relatively straight. When you look at the sky (away from the Sun), you see this scattered blue light coming from every direction. That is the blue sky.

Why blue and not violet? Violet scatters even more than blue, but:
1. The Sun emits less violet than blue
2. Our eyes are less sensitive to violet (S-cones respond better to blue)
3. Some violet is absorbed by ozone in the upper atmosphere

The result: the sky appears a rich blue, not violet.`,
      analogy: 'Imagine you\'re in a crowd and you throw a tennis ball straight ahead. It hits a few heads and bounces off in random directions. Now imagine you throw a bowling ball — it plows through without bouncing. Blue light is the tennis ball (short wavelength, easily scattered by small air molecules). Red light is the bowling ball (long wavelength, passes through). The sky is blue because the "tennis balls" are bouncing everywhere above you.',
      storyConnection: 'The Brahmaputra valley, surrounded by hills and full of humid air, has a particularly rich blue sky on clear days. The moisture particles in Assam\'s humid air add to the scattering effect. When the story says "the sky deepened to violet before sunset," it\'s describing the transition from Rayleigh-dominated blue to sunset orange as the scattering path length increases.',
      checkQuestion: 'Mars has a pink/orange sky during the day, not blue. Why?',
      checkAnswer: 'Mars\'s atmosphere is extremely thin (1% of Earth\'s pressure) and filled with fine reddish iron oxide dust (~1-10 micrometers). These dust particles are large enough that they don\'t follow Rayleigh scattering (which requires particles much smaller than light wavelengths). Instead, they follow Mie scattering, which scatters red/orange wavelengths more effectively in the forward direction. Additionally, the thin atmosphere scatters less blue. Result: pink-orange sky.',
      codeIntro: 'Simulate Rayleigh scattering and show why the sky is blue.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(380, 700, 500)

# Rayleigh scattering: intensity ∝ 1/λ^4
scattering = 1 / (wavelengths / 700)**4  # normalized to red = 1

# Solar spectrum at top of atmosphere (simplified blackbody)
solar = np.exp(-0.5*((wavelengths - 500)/150)**2)  # peak at 500nm

# Scattered light (what you see looking at sky) = solar × scattering
sky_light = solar * scattering
sky_light /= sky_light.max()

# Direct light (what you see looking at Sun) = solar × (1 - scattering_fraction)
# At noon, about 10-20% of blue is scattered out
direct_noon = solar * (1 - 0.2 * scattering / scattering.max())
direct_noon /= direct_noon.max()

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# --- Scattering vs wavelength ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(wavelengths, scattering, color='#3b82f6', linewidth=2.5)
ax.fill_between(wavelengths, scattering, alpha=0.15, color='#3b82f6')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Relative scattering', color='white')
ax.set_title('Rayleigh Scattering: 1/λ⁴', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Annotate key points
ax.annotate(f'Violet: {scattering[0]:.1f}×', xy=(380, scattering[0]),
            xytext=(420, scattering[0]-1), color='#a855f7', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#a855f7'))
ax.annotate(f'Blue: {np.interp(470, wavelengths, scattering):.1f}×', xy=(470, np.interp(470, wavelengths, scattering)),
            xytext=(510, np.interp(470, wavelengths, scattering)-0.5), color='#3b82f6', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#3b82f6'))
ax.annotate('Red: 1×', xy=(700, 1), xytext=(650, 2), color='#ef4444', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#ef4444'))

# --- Sky spectrum vs solar spectrum ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(wavelengths, solar, color='#fbbf24', linewidth=2, label='Sunlight (all colors)')
ax.plot(wavelengths, sky_light, color='#3b82f6', linewidth=2, label='Sky light (scattered)')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Relative intensity', color='white')
ax.set_title('Sunlight vs Sky Light', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# --- Why blue not violet ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Three factors
scatter_factor = 1 / (wavelengths / 700)**4
solar_factor = np.exp(-0.5*((wavelengths - 500)/150)**2)
eye_sensitivity = np.exp(-0.5*((wavelengths - 555)/80)**2)  # photopic sensitivity

combined = scatter_factor * solar_factor * eye_sensitivity
combined /= combined.max()

ax.plot(wavelengths, scatter_factor/scatter_factor.max(), color='#3b82f6', linewidth=1.5,
        linestyle='--', label='Scattering', alpha=0.7)
ax.plot(wavelengths, solar_factor, color='#fbbf24', linewidth=1.5,
        linestyle='--', label='Solar emission', alpha=0.7)
ax.plot(wavelengths, eye_sensitivity, color='#22c55e', linewidth=1.5,
        linestyle='--', label='Eye sensitivity', alpha=0.7)
ax.plot(wavelengths, combined, color='white', linewidth=2.5, label='Combined (perceived sky)')
ax.fill_between(wavelengths, combined, alpha=0.1, color='#3b82f6')

peak_idx = np.argmax(combined)
ax.axvline(wavelengths[peak_idx], color='#06b6d4', linestyle=':', alpha=0.5)
ax.text(wavelengths[peak_idx]+5, 0.9, f'Peak: {wavelengths[peak_idx]:.0f}nm', color='#06b6d4', fontsize=9)

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Relative contribution', color='white')
ax.set_title('Why Blue, Not Violet?', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, loc='upper right')
ax.tick_params(colors='gray')

# --- Visual comparison: noon vs sunset path ---
ax = axes[1, 1]
ax.set_facecolor('#111827')

# Simple diagram
# Earth surface
theta = np.linspace(0, np.pi, 100)
r_earth = 5
ax.plot(r_earth*np.cos(theta), r_earth*np.sin(theta) - 5, color='#22c55e', linewidth=2)

# Atmosphere
r_atm = 5.8
ax.plot(r_atm*np.cos(theta), r_atm*np.sin(theta) - 5, color='#3b82f6', linewidth=1, alpha=0.5)

# Noon ray (short path)
ax.annotate('', xy=(0, 0.5), xytext=(0, 1.5),
            arrowprops=dict(arrowstyle='->', color='#fbbf24', lw=2))
ax.text(0.2, 1.2, 'Noon: short path\\n→ little scattering\\n→ white/yellow Sun', color='#fbbf24', fontsize=8)

# Sunset ray (long path)
ax.annotate('', xy=(-4, -0.3), xytext=(-1, 0.6),
            arrowprops=dict(arrowstyle='->', color='#ef4444', lw=2))
ax.text(-4.5, 0.5, 'Sunset: long path\\n→ much scattering\\n→ orange/red Sun', color='#ef4444', fontsize=8)

ax.text(0, -1, '🌍 Earth surface', color='white', ha='center', fontsize=9)
ax.text(0, 1.8, 'Atmosphere', color='#3b82f6', ha='center', fontsize=8)

ax.set_xlim(-6, 3); ax.set_ylim(-2, 2.5)
ax.set_aspect('equal')
ax.set_title('Path Length: Noon vs Sunset', color='white', fontsize=12)
ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Rayleigh scattering: intensity ∝ 1/λ⁴")
print("  Violet (400nm) scatters 9.4× more than red (700nm)")
print("  Blue (470nm) scatters 4.9× more than red")
print()
print("But we see BLUE sky, not violet, because:")
print("  1. Sun emits less violet")
print("  2. Eyes are less sensitive to violet")
print("  3. Ozone absorbs some violet")`,
      challenge: 'On the Moon (no atmosphere), there is no Rayleigh scattering. What color is the sky? What do sunsets look like? What about on Titan (thick nitrogen atmosphere)?',
      successHint: 'Rayleigh scattering is one of the most elegant explanations in physics. A single equation (1/λ⁴) explains both the blue sky and the orange sunset. The rest of this lesson series builds on this foundation.',
    },
    {
      title: 'Why sunsets are red and orange — the long path through air',
      concept: `At noon, sunlight passes through the atmosphere almost vertically — a path of about 10 km through air. At sunset, it passes almost horizontally — a path of up to **350 km** through air. That is **35 times longer**.

More air = more scattering. Over that long sunset path:
- Blue light (high scattering) is scattered away almost completely
- Green light is significantly reduced
- Only red and orange (low scattering) survive the journey to your eye

This is why the setting Sun looks orange or red: by the time its light reaches you, most of the blue and green has been scattered away in every other direction. Other people, to the east, are seeing that scattered blue as their evening blue sky.

The redness of a sunset depends on:
- **Atmospheric path length**: longer path = more red
- **Dust and aerosols**: larger particles (pollution, volcanic ash, smoke) scatter all wavelengths, creating more vivid reds but also hazier skies
- **Humidity**: water droplets scatter light differently (Mie scattering), adding pinks and purples
- **Altitude**: higher vantage point = less atmosphere below you = less vivid sunset

Assam's sunsets over the Brahmaputra are particularly vivid because of high humidity (moisture scatters light effectively) and the flat river valley that provides a clear view of the horizon.`,
      analogy: 'Imagine shining a white flashlight through a long hallway filled with blue fog. Near the flashlight, you see white light. But by the time the beam reaches the far end, all the blue has been scattered by the fog, and only red/orange remains. The hallway is the atmosphere, the fog is air molecules, and the far end of the hallway is the horizon at sunset.',
      storyConnection: 'The story asks "Why Assam\'s Sunsets Are Orange?" The answer is deeply specific: Assam\'s location at ~26°N latitude, its river valley topography providing unobstructed western horizons over the Brahmaputra, and its high monsoon humidity all combine to produce sunsets that are more vivid orange than those in drier, higher-altitude regions.',
      checkQuestion: 'After a major volcanic eruption, sunsets around the world become dramatically more vivid for months. Why?',
      checkAnswer: 'Volcanic eruptions inject sulfur dioxide into the stratosphere, where it forms sulfate aerosol particles (~0.5 μm). These particles scatter short wavelengths effectively (enhanced Rayleigh-like scattering) while allowing red to pass, intensifying the sunset effect. The particles stay in the stratosphere for 1-3 years because there is no rain to wash them out. After Krakatoa (1883) and Pinatubo (1991), sunsets were vivid worldwide for over a year.',
      codeIntro: 'Simulate how the Sun\'s color changes as it approaches the horizon.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(380, 700, 500)

# Solar spectrum (simplified blackbody at top of atmosphere)
solar = np.exp(-0.5*((wavelengths - 500)/150)**2)

# Rayleigh optical depth as function of zenith angle
# At zenith, τ = τ_0 * (λ_ref/λ)^4
# At angle θ from zenith, path length multiplied by 1/cos(θ) (airmass)
tau_0 = 0.1  # optical depth at zenith for reference wavelength

def transmitted_spectrum(zenith_angle_deg, extra_aerosol=0):
    airmass = 1 / np.cos(np.radians(min(zenith_angle_deg, 89.5)))
    tau = (tau_0 + extra_aerosol) * (550 / wavelengths)**4 * airmass
    return solar * np.exp(-tau)

angles = [0, 30, 60, 75, 85, 89]
labels = ['Noon (0°)', '30°', '60°', '75°', 'Near sunset (85°)', 'Sunset (89°)']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# --- Spectrum at different sun angles ---
ax1.set_facecolor('#111827')
cmap = plt.cm.YlOrRd

for i, (angle, label) in enumerate(zip(angles, labels)):
    spec = transmitted_spectrum(angle)
    spec /= solar.max()  # normalize to noon
    color = cmap(i / (len(angles) - 1))
    ax1.plot(wavelengths, spec, color=color, linewidth=2, label=label)

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Relative intensity', color='white')
ax1.set_title('Sunlight Spectrum vs Sun Angle', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# --- Color of Sun as it sets (color swatches) ---
ax2.set_facecolor('#111827')

def spectrum_to_rgb(spec, wl):
    """Very approximate conversion of spectrum to RGB."""
    r = np.trapz(spec * np.exp(-0.5*((wl-600)/50)**2), wl)
    g = np.trapz(spec * np.exp(-0.5*((wl-535)/40)**2), wl)
    b = np.trapz(spec * np.exp(-0.5*((wl-445)/25)**2), wl)
    mx = max(r, g, b, 1e-10)
    return (min(1, r/mx), min(1, g/mx), min(1, b/mx))

n_steps = 30
angles_smooth = np.linspace(0, 89.5, n_steps)
for i, angle in enumerate(angles_smooth):
    spec = transmitted_spectrum(angle)
    rgb = spectrum_to_rgb(spec, wavelengths)
    ax2.add_patch(plt.Rectangle((i, 0), 1, 3, color=rgb))

# Time labels
for i, angle in enumerate([0, 30, 60, 75, 85, 89]):
    idx = int(angle / 89.5 * (n_steps - 1))
    ax2.text(idx + 0.5, -0.3, f'{angle}°', ha='center', color='white', fontsize=7)

ax2.set_xlim(0, n_steps)
ax2.set_ylim(-0.5, 3.5)
ax2.set_title('Sun Color: Noon → Sunset', color='white', fontsize=13)
ax2.text(n_steps/2, 3.2, '← Noon                    Sunset →', color='white',
         ha='center', fontsize=10)
ax2.set_xticks([]); ax2.set_yticks([])

plt.tight_layout()
plt.show()

print("Why sunsets are orange/red:")
print("  At noon: sunlight passes through ~10 km of atmosphere")
print("  At sunset: sunlight passes through ~350 km of atmosphere")
print("  More path = more blue scattered out = only red/orange remains")
print()
print("Assam sunset factors:")
print("  High humidity → extra Mie scattering → vivid colors")
print("  Flat Brahmaputra valley → clear horizon → full sunset visible")
print("  Aerosols from cooking fires → enhanced redness")`,
      challenge: 'Simulate a "volcanic sunset" by adding extra aerosol scattering (set extra_aerosol=0.05). How does it change the sunset colors? After Pinatubo (1991), sunsets were vivid for over a year.',
      successHint: 'The sunset is a physics experiment that runs every evening. The same 1/λ⁴ law that makes the sky blue at noon makes the sunset orange — the only difference is path length. One equation, two beautiful phenomena.',
    },
    {
      title: 'Atmospheric particles — dust, smoke, and humidity',
      concept: `Rayleigh scattering (by molecules) is not the only scattering in the atmosphere. Larger particles scatter light differently:

**Mie scattering** (particles ~same size as light wavelength, 0.1-10 μm):
- Dust, smoke, pollen, water droplets, aerosols
- Scatters all wavelengths roughly equally → white/grey haze
- Scatters more in the forward direction (why the sky near the Sun is whitish)
- This is why polluted or humid skies look hazy and milky rather than deep blue

**Particle effects on sky color**:
- **Clean, dry air**: deep blue sky (pure Rayleigh scattering)
- **Humid air**: paler blue (water droplets add Mie scattering)
- **Polluted air**: whitish-grey sky (lots of Mie scattering from aerosols)
- **Volcanic aerosols**: enhanced sunsets (stratospheric particles, Rayleigh-like)
- **Smoke**: brown/orange sky (absorbs blue, scatters red)

Assam's atmosphere is often humid (relative humidity 60-90%), meaning Mie scattering is significant. This is why:
- Assam's daytime sky is often a softer, paler blue than desert skies
- Assam's sunsets have more pinks and purples (Mie scattering adds these)
- During the burning season (jhum cultivation), smoke makes sunsets dramatically red`,
      analogy: 'Think of the atmosphere as water in a fish tank. Clean water (clean air) lets you see clearly with a slight blue tint (Rayleigh). Add a drop of milk (humidity/dust) and the water turns hazy — you see the fish less clearly, and light passing through turns more orange. Add more milk (heavy pollution) and you can barely see through at all. The particles determine the clarity and color of the "tank."',
      storyConnection: 'Assam\'s sunsets are distinctively orange because of its unique atmospheric recipe: high humidity from the Brahmaputra valley, seasonal smoke from jhum (shifting cultivation), dust from construction, and moisture from the monsoon. Each particle type contributes a different scattering signature, blending into the characteristic warm orange that the story celebrates.',
      checkQuestion: 'Why does a forest fire make the Sun look red even at noon?',
      checkAnswer: 'Smoke particles (soot, ~0.1-1 μm) are large enough for Mie scattering but also absorb short wavelengths (blue, green). This dual effect — absorbing blue AND scattering it away — removes short wavelengths very efficiently, even over the short noon path length. The result: a red Sun at midday, similar to a normal sunset effect but caused by particles rather than path length.',
      codeIntro: 'Compare Rayleigh and Mie scattering and model different atmospheric conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(380, 700, 500)

# Rayleigh scattering (molecules): ∝ 1/λ^4
rayleigh = 1 / (wavelengths / 550)**4

# Mie scattering (larger particles): much weaker wavelength dependence
# For particles ~1μm: ∝ 1/λ^(0.5 to 1.5)
mie_dust = 1 / (wavelengths / 550)**0.8  # dust
mie_water = 1 / (wavelengths / 550)**0.2  # water droplets (nearly flat)
mie_smoke = 1 / (wavelengths / 550)**1.5 + 0.3 * np.exp(-((wavelengths - 450)/40)**2)  # smoke absorbs blue

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# --- Scattering type comparison ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(wavelengths, rayleigh/rayleigh.max(), color='#3b82f6', linewidth=2.5, label='Rayleigh (molecules)')
ax.plot(wavelengths, mie_dust/mie_dust.max(), color='#f59e0b', linewidth=2.5, label='Mie (dust)')
ax.plot(wavelengths, mie_water/mie_water.max(), color='#06b6d4', linewidth=2.5, label='Mie (water droplets)')
ax.plot(wavelengths, mie_smoke/mie_smoke.max(), color='#9ca3af', linewidth=2.5, label='Mie (smoke)')

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Relative scattering', color='white')
ax.set_title('Scattering Types', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- Sky color under different conditions ---
ax = axes[0, 1]
ax.set_facecolor('#111827')

solar = np.exp(-0.5*((wavelengths - 500)/150)**2)

conditions = {
    'Clean (Rayleigh only)': rayleigh,
    'Humid (Assam)': rayleigh + 0.5 * mie_water,
    'Dusty': rayleigh + 0.8 * mie_dust,
    'Smoky': rayleigh + 1.0 * mie_smoke,
}

colors_cond = ['#3b82f6', '#06b6d4', '#f59e0b', '#9ca3af']
for (name, scatter), color in zip(conditions.items(), colors_cond):
    sky = solar * scatter / scatter.max()
    sky /= sky.max()
    ax.plot(wavelengths, sky, color=color, linewidth=2, label=name)

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Sky brightness', color='white')
ax.set_title('Sky Spectrum Under Different Conditions', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- Visual sky color comparison ---
ax = axes[1, 0]
ax.set_facecolor('#111827')

def approx_sky_color(scatter):
    sky_spec = solar * scatter
    r = np.trapz(sky_spec * np.exp(-0.5*((wavelengths-600)/50)**2), wavelengths)
    g = np.trapz(sky_spec * np.exp(-0.5*((wavelengths-535)/40)**2), wavelengths)
    b = np.trapz(sky_spec * np.exp(-0.5*((wavelengths-445)/25)**2), wavelengths)
    mx = max(r, g, b, 1e-10)
    return (min(1, r/mx * 0.7), min(1, g/mx * 0.7), min(1, b/mx))

labels_sky = list(conditions.keys())
for i, (name, scatter) in enumerate(conditions.items()):
    rgb = approx_sky_color(scatter)
    ax.add_patch(plt.Rectangle((i, 0), 0.9, 1, color=rgb))
    ax.text(i + 0.45, -0.15, name.split('(')[0].strip(), ha='center', color='white',
            fontsize=8, rotation=15)

ax.set_xlim(-0.2, len(conditions) + 0.2)
ax.set_ylim(-0.3, 1.2)
ax.set_title('Approximate Sky Colors', color='white', fontsize=12)
ax.set_xticks([]); ax.set_yticks([])

# --- Particle size effects ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
particle_sizes = np.logspace(-4, -2, 100)  # μm to mm
# Size parameter x = 2πr/λ
# Rayleigh: x << 1, Mie: x ~ 1, Geometric: x >> 1
wavelength_ref = 0.55e-6  # 550 nm in meters
size_param = 2 * np.pi * particle_sizes * 1e-6 / wavelength_ref

ax.axvspan(particle_sizes[size_param < 0.1].min(), particle_sizes[size_param < 0.1].max(),
           alpha=0.2, color='#3b82f6', label='Rayleigh regime')
ax.axvspan(particle_sizes[(size_param >= 0.1) & (size_param <= 10)].min(),
           particle_sizes[(size_param >= 0.1) & (size_param <= 10)].max(),
           alpha=0.2, color='#f59e0b', label='Mie regime')
ax.axvspan(particle_sizes[size_param > 10].min(), particle_sizes[size_param > 10].max(),
           alpha=0.2, color='#ef4444', label='Geometric regime')

# Label particles
particles = [
    (3e-4, 'Air molecules', '#3b82f6'),
    (1e-3, 'Smoke', '#9ca3af'),
    (5e-3, 'Dust', '#f59e0b'),
    (1e-2, 'Water droplets', '#06b6d4'),
    (5e-2, 'Rain drops', '#ef4444'),
]
for size, name, color in particles:
    ax.axvline(size, color=color, linewidth=1.5, linestyle='--', alpha=0.7)
    ax.text(size, 0.95, name, color=color, fontsize=7, rotation=90, va='top', ha='right')

ax.set_xscale('log')
ax.set_xlabel('Particle radius (μm)', color='white')
ax.set_title('Scattering Regimes by Particle Size', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='center')
ax.tick_params(colors='gray')
ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Scattering depends on particle size relative to wavelength:")
print("  Rayleigh (x << 1): molecules → blue sky, strong λ dependence")
print("  Mie (x ~ 1): dust, smoke, droplets → hazy, weak λ dependence")
print("  Geometric (x >> 1): rain, hail → rainbows, no λ scattering")
print()
print("Assam's atmosphere: high humidity + seasonal smoke + dust")
print("= softer blue daytime sky + vivid orange sunsets")`,
      challenge: 'During Diwali, air pollution spikes in many Indian cities. Model a "Diwali sky" with very high Mie scattering (3× the smoky condition). What color does the sky become? What about the Sun at noon?',
      successHint: 'Atmospheric particles are the paintbrush of the sky. Clean air gives deep blue; dust gives hazy white; smoke gives red. Understanding which particles produce which colors lets you read the sky like a physicist.',
    },
    {
      title: 'Mirages — when light bends near the ground',
      concept: `A **mirage** is not an illusion or a hallucination — it is a real optical phenomenon caused by the **refraction** (bending) of light through layers of air at different temperatures.

**How mirages work**:
Hot air near the ground is less dense than cooler air above it. Light travels faster through less-dense (hotter) air. When light passes from cooler to hotter air, it bends away from the ground — curving upward toward the observer's eye.

**Inferior mirage** (hot road shimmer):
- Hot ground heats the air just above it
- Light from the sky bends upward near the ground
- You see a "reflection" of the sky on the road → looks like water
- Common on Assam's highways in summer

**Superior mirage** (cold surface):
- Cold water/ice surface cools the air just above it
- Light bends downward toward the surface
- Objects beyond the horizon can appear above it → "looming"
- Ships appear to float in the air (Fata Morgana)

The refractive index of air depends on temperature: **n ≈ 1 + 7.86 × 10⁻⁴ × P / T** (where P is pressure in atm, T in Kelvin). Hotter air = lower n = faster light = bending away from the hot layer.`,
      analogy: 'Imagine a row of marching soldiers on a beach. When they step from firm sand onto soft sand, the soldiers on one side slow down first. The row naturally curves toward the slow side. Light does the same: when it enters denser (cooler) air, it slows down and bends toward the cooler air. Mirages are just light "marching" through air layers of different densities.',
      storyConnection: 'On hot summer days along the Brahmaputra, mirages shimmer above the river banks. The flat, sun-baked sandy stretches create strong temperature gradients — perfect conditions for inferior mirages. Travelers might see "water" on the road ahead that is actually reflected sky. The river valley\'s geography and heat create natural mirage factories.',
      checkQuestion: 'If mirages are real optics (not illusions), can you photograph them?',
      checkAnswer: 'Yes, absolutely. Mirages are real optical phenomena — the light genuinely bends. A camera records the bent light exactly as your eye does. Photographs of road mirages, Fata Morganas, and superior mirages are common. The camera doesn\'t "know" the light was bent — it just records photons arriving at its sensor. In this sense, mirages are fundamentally different from hallucinations (which are neural, not optical).',
      codeIntro: 'Simulate how light bends through temperature gradients to create mirages.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# --- Temperature profile near hot ground ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
heights = np.linspace(0, 3, 100)  # meters above ground
# Temperature decreases with height near hot ground
T_ground = 60  # °C
T_air = 35  # °C ambient
temps = T_air + (T_ground - T_air) * np.exp(-heights / 0.3)

ax.plot(temps, heights, color='#ef4444', linewidth=2.5)
ax.fill_betweenx(heights, 35, temps, alpha=0.1, color='#ef4444')
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Height above ground (m)', color='white')
ax.set_title('Temperature Profile (Hot Day)', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.axhline(0, color='#f59e0b', linewidth=2, label='Ground surface')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# --- Refractive index profile ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
# n ≈ 1 + 7.86e-4 * P / T (P in atm, T in Kelvin)
P = 1  # atm
n_values = 1 + 7.86e-4 * P / (temps + 273.15)

ax.plot(n_values, heights, color='#3b82f6', linewidth=2.5)
ax.set_xlabel('Refractive index', color='white')
ax.set_ylabel('Height above ground (m)', color='white')
ax.set_title('Refractive Index Profile', color='white', fontsize=11)
ax.tick_params(colors='gray')

# --- Ray tracing through mirage ---
ax = axes[1, 0]
ax.set_facecolor('#111827')

# Simple ray tracing through temperature gradient
def trace_ray(y0, angle_deg, n_steps=500, dx=0.1):
    """Trace a light ray through the temperature gradient."""
    x, y = 0, y0
    angle = np.radians(angle_deg)
    xs, ys = [x], [y]
    for _ in range(n_steps):
        x += dx * np.cos(angle)
        y += dx * np.sin(angle)
        if y < 0.01:  # ground reflection
            angle = -angle
            y = 0.01
        if y > 3:
            break
        # Bending: dn/dy causes curvature
        T_at_y = T_air + (T_ground - T_air) * np.exp(-max(0, y) / 0.3)
        n_here = 1 + 7.86e-4 / (T_at_y + 273.15)
        # Gradient of n
        T_above = T_air + (T_ground - T_air) * np.exp(-max(0, y+0.01) / 0.3)
        n_above = 1 + 7.86e-4 / (T_above + 273.15)
        dn_dy = (n_above - n_here) / 0.01
        # Snell's law in continuous medium: d(angle)/ds = dn/dy / n * cos(angle)
        angle += dn_dy / n_here * np.cos(angle) * dx * 50  # amplified for visibility
        xs.append(x)
        ys.append(y)
    return xs, ys

# Trace several rays
for angle in [-2, -3, -4, -5, -6]:
    xs, ys = trace_ray(2.5, angle)
    ax.plot(xs, ys, color='#f59e0b', linewidth=1, alpha=0.6)

# Straight ray for comparison
for angle in [-2, -3, -4, -5, -6]:
    x_straight = np.linspace(0, 50, 100)
    y_straight = 2.5 + x_straight * np.tan(np.radians(angle))
    mask = y_straight > 0
    ax.plot(x_straight[mask], y_straight[mask], color='gray', linewidth=0.5, linestyle=':', alpha=0.3)

# Ground
ax.fill_between([0, 50], -0.5, 0, color='#92400e', alpha=0.3)
ax.text(25, -0.3, 'Hot ground', color='#f59e0b', ha='center', fontsize=9)
ax.set_xlabel('Horizontal distance (m)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Ray Tracing: Inferior Mirage', color='white', fontsize=11)
ax.set_ylim(-0.5, 3)
ax.tick_params(colors='gray')

# --- Mirage diagram ---
ax = axes[1, 1]
ax.set_facecolor('#111827')

# Observer
ax.plot(0, 1.5, 'o', color='white', markersize=10)
ax.text(0, 1.8, 'Observer', color='white', ha='center', fontsize=9)

# Real object (tree)
ax.plot([40, 40], [0, 4], color='#22c55e', linewidth=3)
ax.plot(40, 4.5, '^', color='#22c55e', markersize=15)
ax.text(40, 5.2, 'Real tree', color='#22c55e', ha='center', fontsize=9)

# Direct ray (real image)
ax.annotate('', xy=(0, 1.5), xytext=(40, 3),
            arrowprops=dict(arrowstyle='->', color='#22c55e', lw=1.5))

# Mirage ray (curved, shows inverted image below ground)
t = np.linspace(0, 1, 50)
mirage_x = 40 * (1 - t)
mirage_y = 1.5 * t + 2 * np.sin(np.pi * t) * 0.3 - 0.5 * (1-t)
ax.plot(mirage_x, mirage_y, color='#ef4444', linewidth=1.5, linestyle='--')

# Mirage image
ax.plot([38, 38], [0, -2], color='#22c55e', linewidth=2, alpha=0.3)
ax.plot(38, -2.5, 'v', color='#22c55e', markersize=10, alpha=0.3)
ax.text(38, -3.2, 'Mirage\n(inverted)', color='#ef4444', ha='center', fontsize=8)

# Ground
ax.fill_between([-5, 45], -4, 0, color='#92400e', alpha=0.2)
ax.axhline(0, color='#f59e0b', linewidth=1)

ax.set_xlim(-5, 45); ax.set_ylim(-4, 6)
ax.set_title('How a Mirage Works', color='white', fontsize=11)
ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Mirages are REAL optics, not hallucinations:")
print("  Hot ground → lower air density → lower refractive index")
print("  Light bends AWAY from hot layer → curves upward")
print("  Observer sees 'reflection' of sky or distant objects")
print()
print("Types:")
print("  Inferior mirage: hot ground, image appears below object")
print("  Superior mirage: cold surface, image appears above object")
print("  Fata Morgana: complex layering, distorted floating images")`,
      challenge: 'A Fata Morgana creates images of ships floating above the horizon. Draw a ray diagram showing how multiple temperature inversion layers create this effect. (Hint: an inversion layer where warm air is above cold air bends light downward.)',
      successHint: 'Mirages demonstrate that light does not always travel in straight lines. In a medium with varying density, light curves — and this principle underlies fiber optics, atmospheric modeling, and even gravitational lensing in general relativity.',
    },
    {
      title: 'Rainbows — geometry of water and light',
      concept: `A **rainbow** is formed when sunlight enters a water droplet, reflects off the back surface, and exits — with each wavelength refracted at a slightly different angle (dispersion).

The geometry:
1. Sunlight enters the droplet and refracts (bends) at the surface
2. It reflects off the back of the droplet (like a mirror)
3. It exits the front and refracts again
4. Each color exits at a slightly different angle — red at ~42°, violet at ~40°

This means you always see a rainbow at exactly **42° from the anti-solar point** (the point directly opposite the Sun from your perspective). The Sun must be behind you, and the rain in front.

**Why arcs?** Every droplet at exactly 42° from the anti-solar point sends red light to your eye. Droplets at 40° send violet. Droplets at 41° send green. Together, all the droplets at these precise angles form a circular arc of color.

**Double rainbows**: light reflects TWICE inside the droplet before exiting. The second reflection reverses the color order (red on inside, violet outside) and appears at ~51° — fainter because energy is lost at each reflection.

Assam, with its intense monsoon rains and frequent afternoon thunderstorms followed by sunshine, is a prime rainbow location. Post-monsoon rainbows over the Brahmaputra are common and spectacular.`,
      analogy: 'Imagine a disco ball where each mirror reflects one specific color at one specific angle. A raindrop is a tiny disco ball — it reflects/refracts sunlight and sends each color in a slightly different direction. Millions of raindrops together, each sending its own color toward your eye, create the arc of the rainbow. No two people see exactly the same rainbow — each person\'s rainbow comes from a different set of drops.',
      storyConnection: 'After Assam\'s monsoon rains, the sun often breaks through clouds in the west while rain continues to the east — perfect rainbow conditions. The story\'s orange sunsets and rainbows are two faces of the same physics: the interaction of sunlight with water and air. Both are explained by refraction, dispersion, and the geometry of light paths.',
      checkQuestion: 'If you fly in an airplane above the rain and look down, what shape is the rainbow?',
      checkAnswer: 'A complete circle. From the ground, you only see an arc because the ground cuts off the bottom half. From above (in a plane or on a mountain with mist below), the anti-solar point is below the horizon, and you can see the full 360° circle of the rainbow. This is occasionally visible from airplanes, and always visible in garden sprinklers if you position yourself correctly.',
      codeIntro: 'Simulate rainbow formation by tracing light rays through a water droplet.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.patch.set_facecolor('#1f2937')

# --- Ray tracing through a droplet ---
ax = axes[0]
ax.set_facecolor('#111827')

# Draw droplet
theta = np.linspace(0, 2*np.pi, 100)
r_drop = 1
ax.plot(r_drop * np.cos(theta), r_drop * np.sin(theta), color='#06b6d4', linewidth=2)
ax.fill(r_drop * np.cos(theta), r_drop * np.sin(theta), color='#06b6d4', alpha=0.1)

# Trace one ray for red and blue
for color, n, rgb in [('Red (n=1.331)', 1.331, '#ef4444'), ('Violet (n=1.343)', 1.343, '#7c3aed')]:
    # Incident ray hits at impact parameter b = 0.85
    b = 0.85
    y_entry = b
    x_entry = -np.sqrt(1 - b**2)

    # Entry refraction
    normal_angle = np.arctan2(y_entry, x_entry)  # normal at entry
    incident_angle = np.pi - normal_angle
    sin_refracted = np.sin(incident_angle) / n
    refracted_angle = np.arcsin(sin_refracted)

    # Inside the drop - direction after first refraction
    dir_inside = normal_angle + np.pi - refracted_angle
    # Find exit point on back of droplet
    t_vals = np.linspace(0, 3, 1000)
    for t in t_vals:
        px = x_entry + t * np.cos(dir_inside)
        py = y_entry + t * np.sin(dir_inside)
        if px**2 + py**2 >= 1 and t > 0.1:
            break
    x_back, y_back = px, py

    # Reflection at back
    norm_back = np.arctan2(y_back, x_back)
    incoming_angle_back = dir_inside - norm_back - np.pi
    dir_reflected = norm_back + np.pi + incoming_angle_back

    # Find exit point
    for t in t_vals:
        px2 = x_back + t * np.cos(dir_reflected)
        py2 = y_back + t * np.sin(dir_reflected)
        if px2**2 + py2**2 >= 1 and t > 0.1:
            break
    x_exit, y_exit = px2, py2

    # Draw rays
    ax.plot([-2, x_entry], [y_entry, y_entry], color=rgb, linewidth=1.5)  # incoming
    ax.plot([x_entry, x_back], [y_entry, y_back], color=rgb, linewidth=1.5, alpha=0.7)  # inside
    ax.plot([x_back, x_exit], [y_back, y_exit], color=rgb, linewidth=1.5, alpha=0.7)  # inside reflected
    ax.plot([x_exit, x_exit + 1.5*np.cos(dir_reflected)],
            [y_exit, y_exit + 1.5*np.sin(dir_reflected)], color=rgb, linewidth=1.5)  # exit

ax.set_aspect('equal')
ax.set_xlim(-2.5, 2.5); ax.set_ylim(-2, 2)
ax.set_title('Light Path in a Raindrop', color='white', fontsize=11)
ax.text(-2, -1.5, 'Sunlight →', color='#fbbf24', fontsize=9)
ax.set_xticks([]); ax.set_yticks([])

# --- Rainbow angle vs wavelength ---
ax = axes[1]
ax.set_facecolor('#111827')

# Refractive index of water vs wavelength (Cauchy equation approx)
wl = np.linspace(400, 700, 100)
n_water = 1.3199 + 6878 / wl**2  # simplified Cauchy

# Rainbow angle = 4*arcsin(sin(i)/n) - 2*i where i is the optimal impact angle
# For minimum deviation: i = arccos(sqrt((n²-1)/3))
i_opt = np.arccos(np.sqrt((n_water**2 - 1) / 3))
rainbow_angle = np.degrees(4 * np.arcsin(np.sin(i_opt) / n_water) - 2 * i_opt)

# Color mapping
colors_rainbow = []
for w in wl:
    if w < 440: colors_rainbow.append('#7c3aed')
    elif w < 490: colors_rainbow.append('#3b82f6')
    elif w < 510: colors_rainbow.append('#06b6d4')
    elif w < 560: colors_rainbow.append('#22c55e')
    elif w < 590: colors_rainbow.append('#eab308')
    elif w < 640: colors_rainbow.append('#f97316')
    else: colors_rainbow.append('#ef4444')

ax.scatter(wl, rainbow_angle, c=colors_rainbow, s=20, zorder=5)
ax.plot(wl, rainbow_angle, color='white', linewidth=1, alpha=0.3)

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Rainbow angle (°)', color='white')
ax.set_title('Rainbow Angle vs Color', color='white', fontsize=11)
ax.tick_params(colors='gray')

# --- Rainbow arc visualization ---
ax = axes[2]
ax.set_facecolor('#111827')

# Draw a rainbow arc
for angle_deg, width, rgb_c in [
    (42, 0.8, '#ef4444'), (41.5, 0.8, '#f97316'), (41, 0.8, '#eab308'),
    (40.5, 0.8, '#22c55e'), (40, 0.8, '#06b6d4'), (39.5, 0.8, '#3b82f6'),
    (39, 0.8, '#7c3aed'),
]:
    r1 = np.tan(np.radians(angle_deg)) * 5
    r2 = np.tan(np.radians(angle_deg + width)) * 5
    theta_arc = np.linspace(0, np.pi, 100)
    ax.fill_between(theta_arc * 5, [r1]*100, [r2]*100, color=rgb_c, alpha=0.6,
                    transform=ax.transData)

# Simplified arc
arc_angles = np.linspace(np.pi * 0.15, np.pi * 0.85, 100)
for r, color in [(4.2, '#ef4444'), (4.1, '#f97316'), (4.0, '#eab308'),
                  (3.9, '#22c55e'), (3.8, '#06b6d4'), (3.7, '#3b82f6'), (3.6, '#7c3aed')]:
    x_arc = r * np.cos(arc_angles)
    y_arc = r * np.sin(arc_angles)
    ax.plot(x_arc, y_arc, color=color, linewidth=4, alpha=0.7)

# Ground
ax.fill_between([-5, 5], -0.5, 0, color='#22c55e', alpha=0.2)
ax.axhline(0, color='#22c55e', linewidth=1)

# Observer
ax.plot(0, 0, 'o', color='white', markersize=8)
ax.text(0, -0.3, 'You', color='white', ha='center', fontsize=9)

# Sun direction
ax.annotate('☀ Sun (behind you)', xy=(-4, -0.2), color='#fbbf24', fontsize=9)

ax.set_xlim(-5, 5); ax.set_ylim(-0.5, 5)
ax.set_aspect('equal')
ax.set_title('Rainbow Arc', color='white', fontsize=11)
ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Rainbow physics:")
print("  Red: appears at 42° from anti-solar point")
print("  Violet: appears at 40° (2° smaller angle)")
print("  Each color comes from DIFFERENT raindrops")
print()
print("Conditions for a rainbow:")
print("  1. Sun behind you, rain in front")
print("  2. Sun low in the sky (< 42° above horizon)")
print("  3. Assam post-monsoon afternoons are ideal")`,
      challenge: 'A secondary rainbow appears at ~51° from the anti-solar point, with reversed colors. It forms from light reflecting TWICE inside the droplet. Calculate the angle and explain why it\'s fainter than the primary.',
      successHint: 'Rainbows are a complete physics lesson in a single arc: refraction, reflection, dispersion, and geometry all working together. Combined with the previous lessons on scattering and sunsets, you now understand the full spectrum of atmospheric optics visible from the banks of the Brahmaputra.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior physics experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for atmospheric optics simulations. Click to start.</p>
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
