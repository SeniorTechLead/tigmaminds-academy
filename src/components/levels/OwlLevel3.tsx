import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function OwlLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Nocturnal adaptations — engineering eyes for darkness',
      concept: `Owls can hunt in light levels 100 times dimmer than what humans need. Their eyes are marvels of optical engineering:

**Optical adaptations:**
- **Large eyes**: an owl's eyes account for 3-5% of body weight (vs 0.0003% in humans). Larger aperture = more photons collected.
- **Tubular shape**: owl eyes are not spherical but cylindrical, giving a long focal length without the weight of a full sphere. This produces a larger image on the retina.
- **Large pupil**: dilates to fill nearly the entire eye opening, maximizing light gathering. The f-number (focal length / pupil diameter) is about f/1.1 — compare to the best camera lenses at f/1.2.
- **Tapetum lucidum**: a reflective layer behind the retina that bounces unabsorbed photons back through the photoreceptors for a second chance at detection. This is why animal eyes glow in headlights.

**Retinal adaptations:**
- **Rod-dominated retina**: rods are 100x more sensitive to light than cones but provide no color vision. Owls have up to 1 million rods per mm² (humans: 150,000).
- **Spatial summation**: multiple rods feed into a single ganglion cell, increasing sensitivity at the cost of spatial resolution. Like combining pixels on a camera sensor.
- **Rhodopsin concentration**: the light-sensitive pigment in rods. Owls have higher concentrations, absorbing a greater fraction of incoming photons.

The physics: at minimum, one photon must be absorbed by a rod to trigger a neural signal. In dim light, photons arrive randomly (Poisson statistics). The owl's large pupil and high rod density maximize the probability of catching enough photons to detect prey.`,
      analogy: 'An owl\'s eye is like a professional DSLR camera in low light: large aperture (big pupil = f/1.1), high-ISO sensor (dense rods with spatial summation), and image stabilization (fixed tubular eyes compensated by head rotation). A human eye in the dark is like a phone camera — smaller sensor, higher noise, fewer photons captured. The owl\'s "camera" is physically larger and optically faster.',
      storyConnection: 'The story asks why the owl is the wisest. Part of that wisdom is seeing what others cannot — literally. While other birds sleep in darkness, the owl hunts with eyes that turn near-total darkness into a usable visual scene. That ability to perceive what is hidden is the deepest kind of wisdom.',
      checkQuestion: 'If owl eyes are so much better in darkness, why don\'t they work well in bright daylight? Why can\'t they have the best of both?',
      checkAnswer: 'Trade-offs. (1) Rod-dominated retinas sacrifice color vision and daytime acuity. Rods saturate in bright light, becoming useless. (2) Large pupils let in too much light during the day, requiring powerful iris constriction that most owls cannot fully achieve. (3) Spatial summation that helps in dim light reduces resolution in bright light. (4) The tapetum lucidum scatters light in bright conditions, reducing contrast. Every adaptation for darkness is a liability in daylight. Evolution cannot optimize for both simultaneously.',
      codeIntro: 'Model photon capture in owl vs human eyes: compute detection probability as a function of light level using Poisson statistics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class EyeModel:
    """Model photon capture and detection for different eye designs."""

    def __init__(self, name, pupil_mm, focal_mm, rod_density_per_mm2,
                 quantum_efficiency, spatial_summation, has_tapetum=False):
        self.name = name
        self.pupil_area = np.pi * (pupil_mm / 2) ** 2  # mm²
        self.focal = focal_mm
        self.rod_density = rod_density_per_mm2
        self.qe = quantum_efficiency  # fraction of photons that trigger response
        self.summation = spatial_summation  # rods per ganglion cell
        self.tapetum = 1.6 if has_tapetum else 1.0  # effective photon multiplier

    def photons_per_rod(self, scene_luminance_cd_m2, integration_time_ms=100):
        """Compute mean photons captured per rod at given luminance."""
        # Simplified: luminance -> retinal illuminance -> photons/rod
        retinal_illuminance = scene_luminance_cd_m2 * self.pupil_area / (self.focal ** 2)
        photons_per_mm2 = retinal_illuminance * 1e6 * (integration_time_ms / 1000)
        photons_per_rod = photons_per_mm2 / self.rod_density * self.tapetum * self.qe
        return max(photons_per_rod, 1e-10)

    def detection_probability(self, luminance, threshold_photons=5):
        """Probability of detecting a target (Poisson model)."""
        mean_photons = self.photons_per_rod(luminance) * self.summation
        # P(detect) = P(photons >= threshold) = 1 - P(photons < threshold)
        from math import factorial, exp
        p_below = sum(exp(-mean_photons) * mean_photons**k / factorial(k)
                      for k in range(threshold_photons))
        return max(0, min(1, 1 - p_below))

# Define eye models
owl = EyeModel('Great horned owl', pupil_mm=14, focal_mm=17, rod_density_per_mm2=1000000,
               quantum_efficiency=0.5, spatial_summation=30, has_tapetum=True)
human = EyeModel('Human (dark-adapted)', pupil_mm=7, focal_mm=17, rod_density_per_mm2=150000,
                 quantum_efficiency=0.3, spatial_summation=10, has_tapetum=False)
cat = EyeModel('Domestic cat', pupil_mm=12, focal_mm=12, rod_density_per_mm2=500000,
               quantum_efficiency=0.4, spatial_summation=20, has_tapetum=True)
hawk = EyeModel('Red-tailed hawk', pupil_mm=6, focal_mm=15, rod_density_per_mm2=50000,
                quantum_efficiency=0.35, spatial_summation=3, has_tapetum=False)

eyes = [owl, human, cat, hawk]
colors = ['#f59e0b', '#3b82f6', '#a855f7', '#22c55e']

# Light levels
luminances = np.logspace(-6, 4, 200)  # cd/m², from starlight to bright sun
light_labels = {1e-4: 'Starlight', 1e-2: 'Quarter moon', 1: 'Twilight',
                100: 'Overcast day', 10000: 'Bright sun'}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Detection probability vs luminance
ax = axes[0, 0]
ax.set_facecolor('#111827')
for eye, color in zip(eyes, colors):
    probs = [eye.detection_probability(L) for L in luminances]
    ax.semilogx(luminances, probs, color=color, linewidth=2, label=eye.name)
for lum, label in light_labels.items():
    ax.axvline(lum, color='gray', linestyle=':', alpha=0.3)
    ax.text(lum, 1.02, label, color='gray', fontsize=7, rotation=45, ha='left')
ax.set_xlabel('Luminance (cd/m²)', color='white')
ax.set_ylabel('Detection probability', color='white')
ax.set_title('Target detection vs light level', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Photon catch comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
moonlight = 0.01  # cd/m²
catches = [eye.photons_per_rod(moonlight) * eye.summation for eye in eyes]
bars = ax.bar([e.name[:10] for e in eyes], catches, color=colors, edgecolor='none', width=0.5)
for bar, c in zip(bars, catches):
    ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.5,
            f'{c:.1f}', ha='center', color='white', fontsize=10)
ax.set_ylabel('Photons per ganglion cell', color='white')
ax.set_title(f'Photon capture at moonlight ({moonlight} cd/m²)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Optical parameters comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
params = ['Pupil area\n(mm²)', 'Rod density\n(×1000/mm²)', 'Summation\n(rods/cell)', 'Effective\ngain']
owl_vals = [owl.pupil_area, owl.rod_density/1000, owl.summation,
            owl.pupil_area * owl.qe * owl.summation * owl.tapetum]
human_vals = [human.pupil_area, human.rod_density/1000, human.summation,
              human.pupil_area * human.qe * human.summation * human.tapetum]
x = np.arange(4)
ax.bar(x-0.15, [v/max(ov,hv) for v,ov,hv in zip(owl_vals, owl_vals, human_vals)],
       0.3, color='#f59e0b', label='Owl', edgecolor='none')
ax.bar(x+0.15, [v/max(ov,hv) for v,ov,hv in zip(human_vals, owl_vals, human_vals)],
       0.3, color='#3b82f6', label='Human', edgecolor='none')
ax.set_xticks(x); ax.set_xticklabels(params, color='white', fontsize=8)
ax.set_ylabel('Relative value', color='white')
ax.set_title('Owl vs human eye parameters', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Minimum detectable light
ax = axes[1, 1]
ax.set_facecolor('#111827')
min_detectable = []
for eye in eyes:
    for L in luminances:
        if eye.detection_probability(L) >= 0.5:
            min_detectable.append(L)
            break
    else:
        min_detectable.append(luminances[-1])
bars = ax.barh(range(len(eyes)), np.log10(min_detectable), color=colors,
               edgecolor='none', height=0.5)
ax.set_yticks(range(len(eyes)))
ax.set_yticklabels([e.name for e in eyes], color='white', fontsize=9)
ax.set_xlabel('log10(Minimum detectable luminance)', color='white')
ax.set_title('Visual sensitivity threshold (50% detection)', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Night vision comparison:")
for eye, md in zip(eyes, min_detectable):
    advantage = md / min_detectable[1]  # relative to human
    print(f"  {eye.name}: threshold = {md:.1e} cd/m² ({1/advantage:.0f}x more sensitive than human)")
print(f"\\nOwl advantage over human: {min_detectable[1]/min_detectable[0]:.0f}x in detection threshold")`,
      challenge: 'Model the effect of light pollution: what light level renders the owl\'s advantage negligible (both owl and human can detect equally well)? At what city luminance does the owl\'s hunting ability degrade?',
      successHint: 'The owl\'s visual system is the product of millions of years of optimization for low-light hunting. Understanding the physics reveals why each adaptation exists — and predicts how artificial light disrupts nocturnal ecology.',
    },
    {
      title: 'Asymmetric ears and sound localization — biological sonar',
      concept: `Owls can catch prey in complete darkness using sound alone. The key adaptation: **asymmetric ears**. In many owl species, the left ear opening is higher than the right (or angled differently). This asymmetry creates a binaural system that localizes sound in both horizontal AND vertical planes:

**Horizontal localization (azimuth):**
- Based on **Interaural Time Difference (ITD)**: sound arrives at the nearer ear first
- For a sound directly to the left, ITD = ear_separation / speed_of_sound ≈ 50 μs for owls
- The brain detects these microsecond differences with specialized neurons (coincidence detectors)
- Angular resolution: ~1° in azimuth

**Vertical localization (elevation):**
- Based on **Interaural Level Difference (ILD)**: the ear that is higher (or more forward-facing) receives a different intensity than the lower ear
- This is possible BECAUSE the ears are asymmetric — symmetric ears would give identical ILD for targets above and below
- The facial disc (feather ruff around the face) acts as a sound-focusing dish, amplifying directional differences

**Processing:** the owl's auditory cortex contains a **space map** — neurons tuned to specific azimuth-elevation combinations. When a mouse rustles in the leaves, the activated neuron directly encodes "target at 30° left, 15° below." The owl strikes with its talons spread to cover the uncertainty ellipse.

Angular accuracy in complete darkness: ±1° in azimuth, ±2° in elevation — sufficient to catch a mouse at 3 meters.`,
      analogy: 'The owl\'s auditory localization works like radar, but with two receivers instead of a transmitter. Each ear is a "receiver." The time difference between when the signal arrives at each receiver tells you the horizontal angle (like a submarine\'s passive sonar). The asymmetric placement adds a vertical dimension — like having one antenna high and one low to triangulate altitude. Together, they pinpoint the target in 3D space.',
      storyConnection: 'The story says the owl is the wisest. In the dark forest, the owl "sees" with its ears — constructing a 3D sound map of its environment. A mouse rustling under leaves at 10 meters is as visible to the owl\'s auditory system as it would be to our eyes in daylight. That acoustic perception IS a form of wisdom — knowing what is there without seeing it.',
      checkQuestion: 'If you plugged one of an owl\'s ears, which ability would be lost — horizontal localization, vertical localization, or both?',
      checkAnswer: 'Both would be severely impaired. Horizontal localization requires comparing arrival times at TWO ears (ITD is undefined with one ear). Vertical localization requires comparing intensities at TWO ears (ILD is undefined with one ear). With one ear, the owl could still detect that a sound exists and estimate its rough frequency, but could not localize it in space. This has been confirmed experimentally: owls with one ear occluded miss their prey by 30-40°.',
      codeIntro: 'Build a 2D sound localization model: compute ITD and ILD as functions of sound source position, then triangulate to estimate source location.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class OwlAuditorySystem:
    """Model binaural sound localization with asymmetric ears."""

    def __init__(self, ear_separation_cm=5.0, ear_asymmetry_cm=1.5, head_radius_cm=3.0):
        self.ear_sep = ear_separation_cm / 100  # meters
        self.ear_asym = ear_asymmetry_cm / 100  # vertical offset
        self.head_r = head_radius_cm / 100
        self.v_sound = 343  # m/s

        # Left ear: slightly higher; Right ear: slightly lower
        self.left_ear = np.array([-self.ear_sep/2, self.ear_asym/2])  # (x, y)
        self.right_ear = np.array([self.ear_sep/2, -self.ear_asym/2])

    def compute_itd_ild(self, source_pos, frequency=4000):
        """
        Compute Interaural Time Difference and Level Difference.
        source_pos: (x, y) in meters, relative to owl head center
        """
        dist_left = np.linalg.norm(source_pos - self.left_ear)
        dist_right = np.linalg.norm(source_pos - self.right_ear)

        # ITD (seconds)
        itd = (dist_right - dist_left) / self.v_sound

        # ILD (dB) — intensity drops as 1/r², plus head shadow
        intensity_left = 1 / max(dist_left, 0.01) ** 2
        intensity_right = 1 / max(dist_right, 0.01) ** 2

        # Head shadow: frequency-dependent attenuation for far ear
        wavelength = self.v_sound / frequency
        shadow_factor = min(1.0, self.head_r / wavelength)
        angle = np.arctan2(source_pos[1], source_pos[0])

        if source_pos[0] < 0:  # source on left
            intensity_right *= (1 - 0.5 * shadow_factor)
        else:  # source on right
            intensity_left *= (1 - 0.5 * shadow_factor)

        ild = 10 * np.log10(max(intensity_left, 1e-15) / max(intensity_right, 1e-15))

        return itd, ild

    def localize(self, itd, ild, distance_estimate=3.0):
        """Estimate source position from ITD and ILD."""
        # Azimuth from ITD
        sin_azimuth = itd * self.v_sound / self.ear_sep
        sin_azimuth = np.clip(sin_azimuth, -1, 1)
        azimuth = np.arcsin(sin_azimuth)

        # Elevation from ILD (using asymmetry)
        elevation = np.arctan(ild / 20 * self.ear_asym / self.ear_sep) * 2

        # Convert to cartesian
        x = distance_estimate * np.sin(azimuth)
        y = distance_estimate * np.sin(elevation)

        return np.array([x, y]), np.degrees(azimuth), np.degrees(elevation)

owl = OwlAuditorySystem()

# Test localization across a grid of positions
test_range = 3.0  # meters
grid_res = 30
xs = np.linspace(-test_range, test_range, grid_res)
ys = np.linspace(-test_range, test_range, grid_res)

itd_map = np.zeros((grid_res, grid_res))
ild_map = np.zeros((grid_res, grid_res))
error_map = np.zeros((grid_res, grid_res))

for i, y in enumerate(ys):
    for j, x in enumerate(xs):
        source = np.array([x, y])
        dist = np.linalg.norm(source)
        if dist < 0.1:
            continue
        itd, ild = owl.compute_itd_ild(source)
        itd_map[i, j] = itd * 1e6  # microseconds
        ild_map[i, j] = ild
        est_pos, _, _ = owl.localize(itd, ild, dist)
        error_map[i, j] = np.linalg.norm(est_pos - source) * 100  # cm

# Single target example
target = np.array([1.5, -0.8])
itd, ild = owl.compute_itd_ild(target)
est_pos, az, el = owl.localize(itd, ild, np.linalg.norm(target))

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
XS, YS = np.meshgrid(xs, ys)

# ITD map
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.pcolormesh(XS, YS, itd_map, cmap='RdBu', shading='auto',
                    vmin=-200, vmax=200)
ax.plot(*owl.left_ear, 's', color='#22c55e', markersize=10, label='Left ear')
ax.plot(*owl.right_ear, 's', color='#ef4444', markersize=10, label='Right ear')
ax.set_xlabel('X (m)', color='white')
ax.set_ylabel('Y (m)', color='white')
ax.set_title('Interaural Time Difference (μs)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.set_aspect('equal')
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, label='ITD (μs)')

# ILD map
ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.pcolormesh(XS, YS, ild_map, cmap='PiYG', shading='auto',
                    vmin=-15, vmax=15)
ax.plot(*owl.left_ear, 's', color='#22c55e', markersize=10)
ax.plot(*owl.right_ear, 's', color='#ef4444', markersize=10)
ax.set_xlabel('X (m)', color='white')
ax.set_ylabel('Y (m)', color='white')
ax.set_title('Interaural Level Difference (dB)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, label='ILD (dB)')

# Localization error map
ax = axes[1, 0]
ax.set_facecolor('#111827')
em = np.ma.masked_where(error_map == 0, error_map)
im = ax.pcolormesh(XS, YS, em, cmap='hot_r', shading='auto', vmin=0, vmax=50)
ax.set_xlabel('X (m)', color='white')
ax.set_ylabel('Y (m)', color='white')
ax.set_title('Localization error (cm)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, label='Error (cm)')

# Example localization
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(0, 0, 'o', color='white', markersize=15, label='Owl')
ax.plot(*owl.left_ear * 100, 's', color='#22c55e', markersize=8, label='Left ear')
ax.plot(*owl.right_ear * 100, 's', color='#ef4444', markersize=8, label='Right ear')
ax.plot(target[0]*100, target[1]*100, '*', color='#f59e0b', markersize=15, label='True target')
ax.plot(est_pos[0]*100, est_pos[1]*100, '^', color='#a855f7', markersize=12, label='Estimated')
ax.plot([target[0]*100, est_pos[0]*100], [target[1]*100, est_pos[1]*100],
        '--', color='gray', linewidth=1)
err = np.linalg.norm(est_pos - target) * 100
ax.set_xlabel('X (cm)', color='white')
ax.set_ylabel('Y (cm)', color='white')
ax.set_title(f'Localization example (error: {err:.1f} cm)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.set_aspect('equal')
ax.tick_params(colors='gray')
ax.set_xlim(-300, 300)
ax.set_ylim(-300, 300)

plt.tight_layout()
plt.show()

print("Sound localization analysis:")
print(f"  ITD for target at ({target[0]:.1f}, {target[1]:.1f}) m: {itd*1e6:.1f} μs")
print(f"  ILD: {ild:.1f} dB")
print(f"  Estimated azimuth: {az:.1f}°, elevation: {el:.1f}°")
print(f"  Position error: {err:.1f} cm")
print(f"  Mean error across field: {error_map[error_map>0].mean():.1f} cm")
print(f"\\n  A mouse body is ~5 cm. Owl accuracy (~{err:.0f} cm) is sufficient for a strike.")`,
      challenge: 'Model the effect of making ears symmetric (remove the 1.5 cm offset). Recompute the ILD map — it should become nearly flat in the vertical dimension, eliminating elevation localization. This proves why asymmetric ears are essential.',
      successHint: 'The owl\'s asymmetric ears solve a problem that engineers face in sonar and radar: localizing a target in 3D with only two sensors. The biological solution predates human engineering by millions of years.',
    },
    {
      title: 'Silent flight — leading edge serrations and noise cancellation',
      concept: `Owls fly in near-silence — their wing noise is below the hearing threshold of their prey (and below the frequency range of most bird species). Three structural adaptations achieve this:

**1. Leading edge serrations (comb-like structures):**
- The front edge of owl flight feathers has a comb-like fringe of tiny barbs
- These break up the large-scale turbulent eddies that cause aerodynamic noise into many tiny eddies
- Small eddies produce higher-frequency sound that attenuates faster and falls above prey hearing range
- Engineering equivalent: serrated trailing edges on wind turbine blades (inspired by owls)

**2. Velvet surface texture:**
- Owl feathers have a soft, downy upper surface that absorbs sound
- This dampens surface friction noise and prevents feather-on-feather contact noise
- Engineering equivalent: acoustic foam in recording studios

**3. Trailing edge fringe:**
- Flexible fringes on the trailing edge of flight feathers break up the wake vortices
- Vortex shedding is a major source of tonal noise in conventional wings

**The physics:** aerodynamic noise power scales as v⁶ to v⁸ (velocity to the 6th-8th power). Owls fly slowly compared to hawks, and their wing modifications further reduce the noise. The combination of slow flight + noise-reducing structures achieves silence.

This has direct engineering applications: Boeing and Airbus are developing owl-inspired modifications for aircraft noise reduction.`,
      analogy: 'Leading edge serrations work like a kitchen faucet aerator. Without the aerator, water from the tap comes out as a noisy, turbulent stream. The aerator breaks the flow into many tiny streams that merge quietly. Owl feather serrations do the same thing to airflow — breaking large, noisy turbulent structures into small, quiet ones.',
      storyConnection: 'The owl in the story is described as wise, but it is also stealthy. Its wisdom includes the physics of silence — wings engineered over millions of years to eliminate the aerodynamic noise that would alert prey. The mouse never hears the owl coming. In the story\'s dark forest, silence is the ultimate wisdom.',
      checkQuestion: 'Hawks are faster fliers than owls but much noisier. Why don\'t hawks evolve silent flight too?',
      checkAnswer: 'Trade-offs again. (1) Hawks hunt by sight during the day — their prey sees them coming regardless of noise, so silence provides no advantage. (2) Silent flight structures add drag, reducing speed. Hawks need speed to catch fast-moving prey in open air. (3) Owl-style serrations work best at low speeds; at hawk speeds, they would increase drag without significantly reducing noise (since noise scales as v^6-8, speed reduction is the primary strategy). Each predator optimizes for its hunting strategy.',
      codeIntro: 'Model aerodynamic noise: compare conventional and owl-modified wing profiles, computing noise spectra and demonstrating the effect of leading edge serrations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Aerodynamic noise model
def wing_noise_spectrum(velocity_ms, chord_m=0.15, span_m=1.0,
                         serrations=False, velvet=False, fringe=False,
                         freq_range=(20, 20000)):
    """
    Compute noise spectrum of a wing in flight.
    Based on simplified Ffowcs Williams-Hawkings acoustic analogy.
    """
    freqs = np.logspace(np.log10(freq_range[0]), np.log10(freq_range[1]), 500)

    # Turbulent boundary layer noise (dominant source)
    # SPL scales as v^5 * chord * span
    tbl_ref = velocity_ms ** 5 * chord_m * span_m

    # Spectral shape: broadband hump centered at Strouhal frequency
    strouhal = 0.2  # typical
    peak_freq = strouhal * velocity_ms / chord_m
    sigma = peak_freq * 0.5
    tbl_spectrum = tbl_ref * np.exp(-(np.log(freqs / peak_freq)) ** 2 / (2 * 0.5 ** 2))

    # Trailing edge noise (tonal component from vortex shedding)
    te_freq = 0.5 * velocity_ms / (0.01 * chord_m)  # boundary layer thickness
    te_spectrum = 0.3 * tbl_ref * np.exp(-((freqs - te_freq) / (te_freq * 0.1)) ** 2)

    total = tbl_spectrum + te_spectrum

    # Apply owl modifications
    if serrations:
        # Serrations shift energy to higher frequencies (smaller eddies)
        # and reduce overall level by breaking coherent structures
        shift_factor = 2.0  # shift peak frequency up
        total = tbl_ref * 0.3 * np.exp(-(np.log(freqs / (peak_freq * shift_factor))) ** 2 / (2 * 0.7 ** 2))
        # Tonal component suppressed
        total += 0.05 * tbl_ref * np.exp(-((freqs - te_freq*1.5) / (te_freq * 0.3)) ** 2)

    if velvet:
        # Surface absorption: reduces high-frequency noise
        absorption = 1 - 0.5 * (1 - np.exp(-freqs / 5000))
        total *= absorption
        total *= 0.6  # overall reduction

    if fringe:
        # Trailing edge fringe: eliminates tonal vortex shedding
        te_mask = np.abs(freqs - te_freq) < te_freq * 0.3
        total[te_mask] *= 0.1

    # Convert to dB SPL (reference: 20 μPa)
    spl = 10 * np.log10(total / (20e-6) ** 2 + 1e-10)
    return freqs, spl

# Flight speeds
owl_speed = 5.0    # m/s (slow, gliding approach)
hawk_speed = 15.0  # m/s (fast dive)

# Compute spectra
f_hawk, spl_hawk = wing_noise_spectrum(hawk_speed)
f_owl_no_mod, spl_owl_no = wing_noise_spectrum(owl_speed)
f_owl_serr, spl_owl_serr = wing_noise_spectrum(owl_speed, serrations=True)
f_owl_full, spl_owl_full = wing_noise_spectrum(owl_speed, serrations=True, velvet=True, fringe=True)

# Mouse hearing threshold (approximate)
mouse_hearing = 20 + 30 * np.exp(-((np.log10(f_hawk) - 3.5) / 0.5) ** 2)
mouse_hearing[f_hawk < 1000] = 60
mouse_hearing[f_hawk > 15000] = 50

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Noise spectra comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.semilogx(f_hawk, spl_hawk, color='#ef4444', linewidth=2, label=f'Hawk ({hawk_speed} m/s)')
ax.semilogx(f_owl_no_mod, spl_owl_no, color='#f59e0b', linewidth=2,
            label=f'Owl wing, no mods ({owl_speed} m/s)')
ax.semilogx(f_owl_full, spl_owl_full, color='#22c55e', linewidth=2,
            label='Owl wing, all mods')
ax.semilogx(f_hawk, mouse_hearing, '--', color='gray', linewidth=1.5,
            label='Mouse hearing threshold')
ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('SPL (dB)', color='white')
ax.set_title('Wing noise spectra', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')
ax.set_xlim(20, 20000)

# Effect of each modification
ax = axes[0, 1]
ax.set_facecolor('#111827')
_, spl_base = wing_noise_spectrum(owl_speed)
_, spl_s = wing_noise_spectrum(owl_speed, serrations=True)
_, spl_sv = wing_noise_spectrum(owl_speed, serrations=True, velvet=True)
_, spl_svf = wing_noise_spectrum(owl_speed, serrations=True, velvet=True, fringe=True)

# Overall noise level (integrated)
def total_spl(spl):
    return 10 * np.log10(np.sum(10 ** (spl / 10)))

levels = [total_spl(spl_base), total_spl(spl_s), total_spl(spl_sv), total_spl(spl_svf)]
labels = ['No mods', '+ Serrations', '+ Velvet', '+ Fringe\n(full owl)']
reductions = [0] + [levels[0] - l for l in levels[1:]]
bars = ax.bar(labels, reductions, color=['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'],
              edgecolor='none', width=0.5)
ax.set_ylabel('Noise reduction (dB)', color='white')
ax.set_title('Cumulative effect of owl wing modifications', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, r in zip(bars, reductions):
    ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.5,
            f'{r:.1f} dB', ha='center', color='white', fontsize=10)

# Speed vs noise (v^6 law)
ax = axes[1, 0]
ax.set_facecolor('#111827')
speeds = np.linspace(2, 20, 50)
noise_conventional = speeds ** 6 / 15 ** 6 * 100  # normalized
noise_owl = speeds ** 6 / 15 ** 6 * 100 * 0.15  # 85% reduction
ax.plot(speeds, noise_conventional, color='#ef4444', linewidth=2, label='Conventional wing')
ax.plot(speeds, noise_owl, color='#22c55e', linewidth=2, label='Owl-modified wing')
ax.axvline(owl_speed, color='#f59e0b', linestyle='--', label=f'Owl speed ({owl_speed} m/s)')
ax.axvline(hawk_speed, color='#ef4444', linestyle='--', alpha=0.5, label=f'Hawk speed ({hawk_speed} m/s)')
ax.set_xlabel('Flight speed (m/s)', color='white')
ax.set_ylabel('Relative noise level', color='white')
ax.set_title('Noise vs speed (∝ v⁶)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Detection range
ax = axes[1, 1]
ax.set_facecolor('#111827')
# At what distance can mouse hear the wing noise?
# Sound drops 6 dB per doubling of distance
total_hawk = total_spl(spl_hawk)
total_owl = total_spl(spl_svf)
mouse_threshold = 30  # dB at best frequency
distances = np.logspace(-1, 2, 100)  # meters
hawk_at_dist = total_hawk - 20 * np.log10(distances)
owl_at_dist = total_owl - 20 * np.log10(distances)
ax.semilogx(distances, hawk_at_dist, color='#ef4444', linewidth=2, label='Hawk')
ax.semilogx(distances, owl_at_dist, color='#22c55e', linewidth=2, label='Owl')
ax.axhline(mouse_threshold, color='gray', linestyle='--', label='Mouse threshold')
# Find detection distances
hawk_detect = distances[np.argmin(np.abs(hawk_at_dist - mouse_threshold))]
owl_detect = distances[np.argmin(np.abs(owl_at_dist - mouse_threshold))]
ax.axvline(hawk_detect, color='#ef4444', linestyle=':', alpha=0.5)
ax.axvline(owl_detect, color='#22c55e', linestyle=':', alpha=0.5)
ax.set_xlabel('Distance (m)', color='white')
ax.set_ylabel('Perceived noise (dB)', color='white')
ax.set_title(f'Detection range: hawk {hawk_detect:.1f}m vs owl {owl_detect:.1f}m', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Silent flight analysis:")
print(f"  Hawk noise at 1m: {total_hawk:.0f} dB")
print(f"  Owl noise at 1m:  {total_owl:.0f} dB")
print(f"  Reduction:        {total_hawk - total_owl:.0f} dB")
print(f"  Mouse detects hawk at: {hawk_detect:.1f} m")
print(f"  Mouse detects owl at:  {owl_detect:.1f} m")
print(f"  Stealth advantage: {hawk_detect/owl_detect:.0f}x closer before detection")`,
      challenge: 'Model the biomimetic application: apply owl-style serrations to a wind turbine blade profile. Compute noise reduction at typical turbine tip speeds (60-80 m/s). At these speeds, do serrations still work, or does the v^6 scaling overwhelm the modification?',
      successHint: 'Owl-inspired noise reduction is one of the most successful examples of biomimicry in engineering. The same serrations that let owls hunt silently are now being tested on aircraft, wind turbines, and computer fans.',
    },
    {
      title: 'Retinal rod density and dark adaptation — the photobiology of night vision',
      concept: `When you walk from a bright room into darkness, you cannot see anything for several minutes. Then gradually, shapes emerge. This is **dark adaptation** — the process of switching from cone vision (bright light) to rod vision (dim light).

The two phases of dark adaptation:
1. **Cone adaptation** (0-7 minutes): cones regenerate their photopigment (iodopsin). Sensitivity improves by ~100x but plateaus quickly.
2. **Rod adaptation** (7-40 minutes): rods regenerate rhodopsin much more slowly. Sensitivity improves by another ~1000x, reaching maximum after ~30-40 minutes.

**Rod photochemistry:**
- Rhodopsin absorbs a photon → retinal changes shape (11-cis to all-trans) → protein conformational change → ion channel closes → neural signal
- After bleaching, rhodopsin must be regenerated (retinal recycled back to 11-cis form)
- Regeneration half-time: ~5 minutes for rods, ~1.5 minutes for cones

**Owl advantage:** owls have 3-5x more rhodopsin per rod than humans, meaning:
1. They start darker-adapted (more unbleached rhodopsin available)
2. They recover faster from bright light exposure
3. Each rod captures more photons at any given light level

**Rod density distribution:** humans have a fovea (cone-rich center) surrounded by rod-rich periphery. Owls have a more uniform rod distribution with much higher overall density, providing better peripheral night vision.`,
      analogy: 'Dark adaptation is like adjusting the ISO on a camera. When you go from outdoor to indoor photography, you increase ISO — the sensor becomes more sensitive but noisier. Your eyes do the same thing by switching from cones (low ISO, high quality) to rods (high ISO, grainy but sensitive). Owls have a sensor that starts at high ISO and goes even higher — their "camera" is always ready for low light.',
      storyConnection: 'The owl in the story is wise because it sees what others miss. Dark adaptation is the mechanism — while other animals stumble in darkness, the owl\'s rhodopsin-rich retina reaches full sensitivity rapidly, revealing a detailed world invisible to cone-dependent species. The owl\'s wisdom is literally the chemistry of seeing in the dark.',
      checkQuestion: 'A car\'s headlights temporarily blind a deer (dark-adapted) but an owl recovers quickly. Why the difference?',
      checkAnswer: 'Both are blinded because the bright light bleaches their rhodopsin. The difference is recovery speed: (1) owls have more total rhodopsin, so even after partial bleaching, enough remains for basic vision, (2) owls have faster rhodopsin regeneration rates, (3) owls can constrict their pupils more effectively to reduce the initial bleaching. The deer is stuck with bleached rods for 10-15 minutes. The owl recovers in 2-3 minutes. This is why light pollution is catastrophic for nocturnal wildlife — repeated bleaching from car headlights prevents full dark adaptation.',
      codeIntro: 'Model dark adaptation curves for owl, human, and cat: simulate rhodopsin regeneration kinetics and sensitivity recovery.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class DarkAdaptationModel:
    """Model dark adaptation through photopigment regeneration."""

    def __init__(self, name, rhodopsin_total, regen_half_time_min,
                 rod_density, cone_threshold_log, rod_threshold_log):
        self.name = name
        self.rhodopsin_total = rhodopsin_total  # arbitrary units
        self.regen_tau = regen_half_time_min / np.log(2)  # time constant
        self.rod_density = rod_density
        self.cone_thresh = cone_threshold_log  # log10(cd/m²)
        self.rod_thresh = rod_threshold_log

    def dark_adaptation_curve(self, time_minutes, initial_bleach=0.9):
        """Compute threshold vs time after bleaching."""
        t = np.array(time_minutes)

        # Cone recovery (fast, limited sensitivity)
        cone_recovery = self.cone_thresh + 2 * np.exp(-t / 2)

        # Rod recovery (slow, high sensitivity)
        rhodopsin_fraction = 1 - initial_bleach * np.exp(-t / self.regen_tau)
        # Sensitivity proportional to rhodopsin available
        rod_sensitivity = self.rod_thresh + 4 * (1 - rhodopsin_fraction)

        # Overall threshold is the minimum of cone and rod curves
        threshold = np.minimum(cone_recovery, rod_sensitivity)

        return threshold, cone_recovery, rod_sensitivity, rhodopsin_fraction

# Define species
owl_model = DarkAdaptationModel('Barn owl', rhodopsin_total=5.0, regen_half_time_min=3.0,
                                 rod_density=1000000, cone_threshold_log=-1, rod_threshold_log=-5.5)
human_model = DarkAdaptationModel('Human', rhodopsin_total=1.0, regen_half_time_min=5.0,
                                   rod_density=150000, cone_threshold_log=-1, rod_threshold_log=-4.5)
cat_model = DarkAdaptationModel('Cat', rhodopsin_total=3.0, regen_half_time_min=4.0,
                                 rod_density=500000, cone_threshold_log=-1, rod_threshold_log=-5.0)

models = [owl_model, human_model, cat_model]
colors = ['#f59e0b', '#3b82f6', '#a855f7']

t = np.linspace(0, 45, 500)  # 45 minutes

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Dark adaptation curves
ax = axes[0, 0]
ax.set_facecolor('#111827')
for model, color in zip(models, colors):
    thresh, cone, rod, rho = model.dark_adaptation_curve(t)
    ax.plot(t, thresh, color=color, linewidth=2.5, label=model.name)
    ax.plot(t, cone, '--', color=color, linewidth=1, alpha=0.4)
    ax.plot(t, rod, ':', color=color, linewidth=1, alpha=0.4)
ax.set_xlabel('Time in dark (minutes)', color='white')
ax.set_ylabel('log10 Threshold (cd/m²)', color='white')
ax.set_title('Dark adaptation curves', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.invert_yaxis()
ax.text(3, -1.5, 'Cone phase', color='gray', fontsize=8, fontstyle='italic')
ax.text(20, -4, 'Rod phase', color='gray', fontsize=8, fontstyle='italic')

# Rhodopsin regeneration
ax = axes[0, 1]
ax.set_facecolor('#111827')
for model, color in zip(models, colors):
    _, _, _, rho = model.dark_adaptation_curve(t)
    ax.plot(t, rho * 100, color=color, linewidth=2, label=model.name)
ax.axhline(50, color='gray', linestyle='--', alpha=0.5, label='50% regeneration')
ax.set_xlabel('Time in dark (minutes)', color='white')
ax.set_ylabel('Rhodopsin regenerated (%)', color='white')
ax.set_title('Rhodopsin regeneration kinetics', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Time to reach functional night vision
ax = axes[1, 0]
ax.set_facecolor('#111827')
functional_threshold = -3.5  # log10(cd/m²) — quarter moonlight
times_to_functional = []
for model in models:
    thresh, _, _, _ = model.dark_adaptation_curve(t)
    idx = np.searchsorted(-thresh, -functional_threshold)
    times_to_functional.append(t[min(idx, len(t)-1)])

bars = ax.bar([m.name for m in models], times_to_functional, color=colors,
              edgecolor='none', width=0.5)
for bar, time in zip(bars, times_to_functional):
    ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.3,
            f'{time:.1f} min', ha='center', color='white', fontsize=11)
ax.set_ylabel('Minutes to functional night vision', color='white')
ax.set_title('Recovery time after bright light exposure', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Rod density comparison with retinal map
ax = axes[1, 1]
ax.set_facecolor('#111827')
eccentricity = np.linspace(-90, 90, 200)  # degrees from fovea

# Human: fovea (cone-rich), periphery (rod-rich), blind spot at ~15°
human_rods = 150000 * (1 - np.exp(-np.abs(eccentricity) / 15))
human_rods[np.abs(eccentricity) < 2] = 0  # fovea has no rods
human_rods[(eccentricity > 12) & (eccentricity < 18)] *= 0  # blind spot

# Owl: more uniform, higher density
owl_rods = 800000 * (0.7 + 0.3 * np.exp(-eccentricity**2 / (40**2)))

ax.plot(eccentricity, owl_rods / 1000, color='#f59e0b', linewidth=2, label='Owl')
ax.plot(eccentricity, human_rods / 1000, color='#3b82f6', linewidth=2, label='Human')
ax.set_xlabel('Retinal eccentricity (degrees)', color='white')
ax.set_ylabel('Rod density (×1000/mm²)', color='white')
ax.set_title('Rod density across retina', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.text(0, 50, 'Fovea', color='gray', fontsize=8, ha='center')

plt.tight_layout()
plt.show()

print("Dark adaptation analysis:")
for model, ttf in zip(models, times_to_functional):
    print(f"  {model.name}: functional night vision in {ttf:.1f} minutes")
    print(f"    Rhodopsin regeneration half-time: {model.regen_tau * np.log(2):.1f} min")
    print(f"    Rod density: {model.rod_density:,}/mm²")`,
      challenge: 'Model repeated light exposure (car headlights every 5 minutes). The owl never fully dark-adapts before the next bleach. Compute the average sensitivity over a 1-hour period and compare to an undisturbed owl. This quantifies the impact of light pollution on hunting efficiency.',
      successHint: 'Dark adaptation reveals why light pollution is one of the most underestimated threats to nocturnal wildlife. Every streetlight, every car headlight resets the adaptation clock, keeping nocturnal animals in a perpetual state of reduced sensitivity.',
    },
    {
      title: 'Brain-to-body ratio and cognitive ethology — measuring animal intelligence',
      concept: `The story calls the owl "wisest." Can we measure wisdom scientifically? **Cognitive ethology** studies animal intelligence through behavior and neurobiology.

**Brain-to-body ratio metrics:**
- **Absolute brain size**: elephants and whales have the largest brains, but this mostly reflects body size
- **Encephalization quotient (EQ)**: actual brain mass / expected brain mass for that body size. EQ > 1 means bigger brain than expected. Humans: EQ ≈ 7.5. Owls: EQ ≈ 1.5. Crows: EQ ≈ 2.5.
- **Pallium ratio**: fraction of the brain that is "cortex-equivalent." In birds, the pallium handles higher cognition. Corvids (crows) have very high pallium ratios.

**Owl cognition:**
- Owls are actually NOT among the most cognitively advanced birds. Corvids (crows, ravens) and parrots consistently outperform owls in problem-solving tests.
- Owls have relatively small brains for their body size (EQ ~1.5)
- Most of the owl brain is devoted to sensory processing (vision and hearing), not higher cognition
- The "wise owl" myth comes from: (1) their large, forward-facing eyes resembling a serious human face, (2) their ability to rotate their heads 270° (appearing to "observe everything"), (3) ancient Greek association with Athena, goddess of wisdom

**The allometric relationship:** brain mass scales with body mass as Brain ∝ Body^0.75. Species above this line are "brainer" than expected; species below are "less brained." Plotting many species reveals which groups invested in cognitive ability.`,
      analogy: 'Measuring animal intelligence by brain size alone is like measuring computer performance by weight. A heavy mainframe computer from 1970 is less capable than a lightweight smartphone. What matters is architecture, not mass. Similarly, a crow\'s small but highly organized brain outperforms an owl\'s larger but more specialized brain. EQ and pallium ratio try to account for this, but they are still crude metrics.',
      storyConnection: 'The story calls the owl wise, but science reveals a more nuanced picture. The owl is wise in the sense of having extraordinary perceptual abilities — seeing in darkness, hearing with precision, flying in silence. But in tests of problem-solving and tool use, the crow outperforms the owl. The owl\'s wisdom is sensory mastery, not abstract reasoning. Both are forms of intelligence, adapted to different ecological challenges.',
      checkQuestion: 'An owl has a larger brain than a crow, but a lower EQ. Which is "smarter" and does EQ actually measure intelligence?',
      checkAnswer: 'The crow is consistently smarter in cognitive tasks (tool use, planning, mirror self-recognition). EQ does correlate with cognitive ability across species but is imperfect: (1) it does not account for brain architecture (where neurons are matters more than how many), (2) it penalizes large-bodied species (elephants have lower EQ than expected for their cognitive ability), (3) birds pack neurons more densely than mammals, making direct comparison unreliable. EQ is a useful first approximation but not a definitive intelligence measure.',
      codeIntro: 'Analyze brain-body allometry: plot the allometric relationship across species, compute EQ, and identify which animals deviate most from expectation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Brain-body data for various species (approximate values)
species_data = [
    # (name, body_mass_g, brain_mass_g, group)
    ('Human',           70000,  1400, 'Primate'),
    ('Chimpanzee',      50000,  400,  'Primate'),
    ('Macaque',         8000,   90,   'Primate'),
    ('Elephant',        5000000, 4800, 'Mammal'),
    ('Dolphin',         200000, 1600, 'Mammal'),
    ('Dog',             30000,  72,   'Mammal'),
    ('Cat',             4000,   30,   'Mammal'),
    ('Mouse',           30,     0.4,  'Mammal'),
    ('Rat',             300,    2,    'Mammal'),
    ('Barn owl',        500,    8.5,  'Bird'),
    ('Great horned owl', 1400,  12,   'Bird'),
    ('Crow',            500,    10,   'Bird'),
    ('Raven',           1200,   15,   'Bird'),
    ('Parrot (African grey)', 400, 9, 'Bird'),
    ('Pigeon',          350,    2.5,  'Bird'),
    ('Chicken',         3000,   3.5,  'Bird'),
    ('Eagle',           4000,   18,   'Bird'),
    ('Hummingbird',     4,      0.2,  'Bird'),
    ('Octopus',         2000,   3,    'Other'),
    ('Goldfish',        50,     0.05, 'Other'),
]

names = [s[0] for s in species_data]
body = np.array([s[1] for s in species_data], dtype=float)
brain = np.array([s[2] for s in species_data], dtype=float)
groups = [s[3] for s in species_data]

# Allometric relationship: brain = a * body^b
log_body = np.log10(body)
log_brain = np.log10(brain)
b_fit, a_fit = np.polyfit(log_body, log_brain, 1)
expected_brain = 10 ** (a_fit + b_fit * log_body)

# Encephalization Quotient
EQ = brain / expected_brain

group_colors = {'Primate': '#ef4444', 'Mammal': '#3b82f6', 'Bird': '#22c55e', 'Other': '#a855f7'}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Allometric plot
ax = axes[0, 0]
ax.set_facecolor('#111827')
for group in ['Primate', 'Mammal', 'Bird', 'Other']:
    mask = [g == group for g in groups]
    ax.scatter(body[mask], brain[mask], s=60, color=group_colors[group],
               alpha=0.8, label=group, edgecolors='white', linewidth=0.5)
# Regression line
x_range = np.logspace(0, 7, 100)
ax.plot(x_range, 10 ** (a_fit + b_fit * np.log10(x_range)),
        '--', color='gray', linewidth=2, label=f'Brain ∝ Body^{b_fit:.2f}')
# Label key species
for i, name in enumerate(names):
    if name in ['Human', 'Barn owl', 'Crow', 'Elephant', 'Dolphin', 'Parrot (African grey)']:
        ax.annotate(name, (body[i], brain[i]), textcoords="offset points",
                    xytext=(8, 5), fontsize=7, color='white')
ax.set_xscale('log'); ax.set_yscale('log')
ax.set_xlabel('Body mass (g)', color='white')
ax.set_ylabel('Brain mass (g)', color='white')
ax.set_title('Brain-body allometry', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# EQ comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
# Sort by EQ
sort_idx = np.argsort(EQ)[::-1][:15]
eq_names = [names[i] for i in sort_idx]
eq_vals = EQ[sort_idx]
eq_colors = [group_colors[groups[i]] for i in sort_idx]
bars = ax.barh(range(len(eq_names)), eq_vals, color=eq_colors, edgecolor='none', height=0.6)
ax.set_yticks(range(len(eq_names)))
ax.set_yticklabels(eq_names, color='white', fontsize=8)
ax.axvline(1, color='gray', linestyle='--', label='Expected (EQ=1)')
ax.set_xlabel('Encephalization Quotient (EQ)', color='white')
ax.set_title('Encephalization Quotient ranking', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.invert_yaxis()

# Owl vs Crow comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
metrics = ['EQ', 'Brain/body %', 'Neuron density\n(relative)', 'Problem-\nsolving score', 'Tool use\nscore']
owl_scores = [1.5, 1.7, 0.8, 0.3, 0.0]  # relative scores
crow_scores = [2.5, 2.0, 1.5, 0.9, 0.8]
x = np.arange(len(metrics))
ax.bar(x-0.15, owl_scores, 0.3, color='#f59e0b', label='Barn owl', edgecolor='none')
ax.bar(x+0.15, crow_scores, 0.3, color='#22c55e', label='Crow', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(metrics, color='white', fontsize=8)
ax.set_ylabel('Score (normalized)', color='white')
ax.set_title('Owl vs Crow: cognitive comparison', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# What owls ARE good at (sensory brain allocation)
ax = axes[1, 1]
ax.set_facecolor('#111827')
owl_brain = {'Visual processing': 35, 'Auditory processing': 25,
             'Motor control': 20, 'Higher cognition': 10, 'Other': 10}
crow_brain = {'Visual processing': 15, 'Auditory processing': 10,
              'Motor control': 15, 'Higher cognition': 40, 'Other': 20}
labels = list(owl_brain.keys())
owl_vals = list(owl_brain.values())
crow_vals = list(crow_brain.values())
x = np.arange(len(labels))
ax.bar(x-0.15, owl_vals, 0.3, color='#f59e0b', label='Owl', edgecolor='none')
ax.bar(x+0.15, crow_vals, 0.3, color='#22c55e', label='Crow', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(labels, color='white', fontsize=7, rotation=20, ha='right')
ax.set_ylabel('Brain allocation (%)', color='white')
ax.set_title('Brain resource allocation', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Cognitive analysis:")
print(f"  Allometric exponent: brain ∝ body^{b_fit:.3f}")
owl_idx = names.index('Barn owl')
crow_idx = names.index('Crow')
print(f"  Barn owl: EQ = {EQ[owl_idx]:.2f} (brain {brain[owl_idx]:.1f}g, body {body[owl_idx]:.0f}g)")
print(f"  Crow:     EQ = {EQ[crow_idx]:.2f} (brain {brain[crow_idx]:.1f}g, body {body[crow_idx]:.0f}g)")
print(f"  Human:    EQ = {EQ[names.index('Human')]:.2f}")
print()
print("The owl is NOT the wisest bird by cognitive metrics.")
print("Its 'wisdom' is sensory mastery — extraordinary vision and hearing.")
print("The crow is the true avian genius — tool use, planning, self-recognition.")
print("Different kinds of intelligence for different ecological niches.")`,
      challenge: 'Add 5 more bird species (parrot, magpie, jay, woodpecker, ostrich) with realistic brain data. Recompute the allometric line for birds only (separate from mammals). Do birds follow a different allometric slope? This would mean bird brains are fundamentally different from mammalian brains.',
      successHint: 'Cognitive ethology teaches us that intelligence is not a single axis — it is multidimensional. The owl excels in sensory processing; the crow in abstract reasoning; the parrot in vocal learning. Each is "wise" in its own ecological context.',
    },
    {
      title: 'Cognitive ethology — testing animal intelligence experimentally',
      concept: `How do you test if an animal is "wise"? Cognitive ethology uses controlled experiments:

**Classic tests:**
1. **Object permanence**: does the animal know an object still exists after it is hidden? Owls pass at level 4 (object moved behind two screens). Corvids pass at level 6 (invisible displacement).
2. **Causal reasoning**: can the animal infer cause from effect? Crows understand that pulling a string brings food. Owls do not — they strike at the food directly even when the string is the only way.
3. **Tool use**: using objects to achieve goals. Crows bend wire into hooks. Owls show no tool use in any study.
4. **Mirror self-recognition**: can the animal recognize itself? Magpies can. Owls cannot (they attack their reflection as if it were a rival).
5. **Planning**: acting now for future benefit. Corvids cache food and remember thousands of cache locations. Owls cache some prey but show less spatial memory sophistication.

**Why owls score low on cognitive tests:**
- Their ecological niche does not require complex problem-solving
- Sit-and-wait predation (listen → strike) needs excellent sensory processing but minimal planning
- Corvids are generalist foragers in complex social groups, which selects for cognitive flexibility

**The key insight:** intelligence evolves when the ecological challenge demands it. Owls are perfectly adapted for their niche — they do not need to be "smart" in the crow sense. Their sensory brilliance IS their form of intelligence.`,
      analogy: 'Comparing owl and crow intelligence is like comparing a concert pianist and a chess grandmaster. The pianist has extraordinary motor skill and auditory processing (like the owl\'s sensory abilities). The grandmaster has extraordinary abstract reasoning and planning (like the crow\'s cognitive abilities). Neither is "smarter" in absolute terms — they are optimized for different domains. Intelligence tests that only measure chess would declare the grandmaster superior, but that misses the pianist\'s brilliance.',
      storyConnection: 'The story\'s title — "Why the Owl Is the Wisest" — reflects human cultural bias. We see the owl\'s large eyes and solemn expression and project wisdom onto it. Science reveals that the owl is a sensory master, not a cognitive champion. But the story is still right in a deeper sense: wisdom includes knowing your environment, perceiving what others miss, and acting with precision. The owl does all three, just through perception rather than reasoning.',
      checkQuestion: 'A researcher designs an intelligence test where the animal must track a moving prey item behind an obstacle and predict where it will emerge. Would this test favor owls or crows?',
      checkAnswer: 'This test would favor owls. It requires spatial tracking, motion prediction, and precise timing — all of which are core hunting skills that owls have been selected for. Crows would likely perform well too (they are generalists) but the test aligns perfectly with the owl\'s ecological niche. This illustrates a fundamental problem in comparative cognition: the test design determines which species appears "smarter." Ecologically fair tests must span multiple cognitive domains.',
      codeIntro: 'Simulate cognitive test performance: model multiple species taking a battery of cognitive tests, revealing that "intelligence" depends on which tests you choose.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Cognitive test battery for multiple species
species_cognitive = {
    'Barn owl':        {'spatial_tracking': 9, 'object_permanence': 6, 'causal_reasoning': 3,
                        'tool_use': 0, 'mirror_self': 0, 'social_cognition': 2,
                        'vocal_learning': 3, 'memory': 5, 'planning': 2, 'sensory_acuity': 10},
    'Crow':            {'spatial_tracking': 7, 'object_permanence': 9, 'causal_reasoning': 9,
                        'tool_use': 9, 'mirror_self': 5, 'social_cognition': 9,
                        'vocal_learning': 6, 'memory': 9, 'planning': 8, 'sensory_acuity': 5},
    'African grey':    {'spatial_tracking': 5, 'object_permanence': 8, 'causal_reasoning': 7,
                        'tool_use': 6, 'mirror_self': 4, 'social_cognition': 8,
                        'vocal_learning': 10, 'memory': 8, 'planning': 7, 'sensory_acuity': 4},
    'Pigeon':          {'spatial_tracking': 6, 'object_permanence': 5, 'causal_reasoning': 4,
                        'tool_use': 1, 'mirror_self': 2, 'social_cognition': 3,
                        'vocal_learning': 1, 'memory': 6, 'planning': 3, 'sensory_acuity': 6},
    'Chicken':         {'spatial_tracking': 4, 'object_permanence': 4, 'causal_reasoning': 3,
                        'tool_use': 0, 'mirror_self': 0, 'social_cognition': 4,
                        'vocal_learning': 1, 'memory': 3, 'planning': 2, 'sensory_acuity': 4},
    'Dog':             {'spatial_tracking': 6, 'object_permanence': 7, 'causal_reasoning': 5,
                        'tool_use': 1, 'mirror_self': 2, 'social_cognition': 9,
                        'vocal_learning': 2, 'memory': 6, 'planning': 4, 'sensory_acuity': 7},
}

test_names = list(list(species_cognitive.values())[0].keys())
sp_names = list(species_cognitive.keys())
n_tests = len(test_names)

# Build score matrix
scores = np.array([[species_cognitive[sp][t] for t in test_names] for sp in sp_names])

# Different "intelligence" weightings
weightings = {
    'Cognitive flexibility': [0.5, 1, 2, 2, 1.5, 1.5, 1, 1.5, 2, 0.3],
    'Sensory mastery':       [2, 1, 0.5, 0.3, 0.3, 0.5, 0.5, 1, 0.5, 3],
    'Social intelligence':   [0.5, 1, 1, 0.5, 1, 3, 2, 1, 1.5, 0.5],
    'Equal weight':          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
}

fig, axes = plt.subplots(2, 2, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')
sp_colors = ['#f59e0b', '#22c55e', '#ef4444', '#3b82f6', '#a855f7', '#06b6d4']

# Radar chart (test profile per species)
ax = axes[0, 0]
ax.set_facecolor('#111827')
angles = np.linspace(0, 2*np.pi, n_tests, endpoint=False)
angles = np.concatenate([angles, [angles[0]]])
for i, (sp, color) in enumerate(zip(sp_names[:4], sp_colors[:4])):
    vals = scores[i].tolist() + [scores[i][0]]
    ax.plot(angles, vals, 'o-', color=color, linewidth=1.5, label=sp, markersize=4)
    ax.fill(angles, vals, color=color, alpha=0.05)
ax.set_xticks(angles[:-1])
ax.set_xticklabels([t.replace('_', '\n')[:10] for t in test_names], color='white', fontsize=6)
ax.set_ylim(0, 11)
ax.set_title('Cognitive test profiles', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, loc='upper right')
ax.tick_params(colors='gray')

# Rankings under different weightings
ax = axes[0, 1]
ax.set_facecolor('#111827')
rankings = {}
for wname, weights in weightings.items():
    weighted = scores @ np.array(weights)
    ranking = np.argsort(-weighted)
    rankings[wname] = [(sp_names[r], weighted[r]) for r in ranking]

x = np.arange(len(sp_names))
w = 0.2
for i, (wname, color) in enumerate(zip(weightings.keys(),
                                        ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'])):
    weights = np.array(list(weightings.values())[i])
    weighted = scores @ weights
    ax.bar(x + i*w - 1.5*w, weighted, w, color=color, label=wname, edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(sp_names, color='white', fontsize=7, rotation=30, ha='right')
ax.set_ylabel('Weighted score', color='white')
ax.set_title('Intelligence depends on what you measure', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=6)
ax.tick_params(colors='gray')

# Who is "wisest" under each weighting?
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.axis('off')
report = "WHO IS THE WISEST?\n" + "=" * 45 + "\n\n"
for wname, ranking in rankings.items():
    report += f"{wname}:\n"
    for rank, (sp, score) in enumerate(ranking[:3], 1):
        medal = ['1st', '2nd', '3rd'][rank-1]
        report += f"  {medal}: {sp} (score: {score:.1f})\n"
    report += "\n"
report += "KEY INSIGHT:\n"
report += "The 'wisest' animal depends entirely\n"
report += "on which cognitive dimensions you value.\n"
report += "Owls win on sensory mastery.\n"
report += "Crows win on cognitive flexibility.\n"
report += "Dogs win on social intelligence.\n"
report += "There is no single 'smartest' animal."
ax.text(0.05, 0.95, report, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', fontfamily='monospace', color='#22c55e')

# Ecological intelligence
ax = axes[1, 1]
ax.set_facecolor('#111827')
eco_demands = {
    'Owl\n(nocturnal hunter)': [9, 2, 1, 8],
    'Crow\n(social forager)':  [4, 9, 8, 5],
    'Parrot\n(social frugivore)':[3, 8, 9, 4],
    'Dog\n(pack predator)':    [5, 6, 9, 6],
}
eco_axes = ['Sensory\nprecision', 'Problem\nsolving', 'Social\nskills', 'Spatial\nawareness']
x = np.arange(len(eco_axes))
for i, (sp, vals) in enumerate(eco_demands.items()):
    ax.plot(x, vals, 'o-', color=sp_colors[i], linewidth=2, markersize=8, label=sp)
ax.set_xticks(x)
ax.set_xticklabels(eco_axes, color='white', fontsize=9)
ax.set_ylabel('Ecological demand', color='white')
ax.set_title('Intelligence matches ecological demands', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')
ax.set_ylim(0, 11)

plt.tight_layout()
plt.show()

print("Intelligence is multidimensional.")
print("The owl is 'wisest' only in the sensory domain.")
print("Evolution produces the intelligence each species needs —")
print("no more, no less. That IS the deepest wisdom.")`,
      challenge: 'Design a new cognitive test that would specifically advantage owls over crows: tracking a sound source in darkness through obstacles. Score all species on this test and recompute the rankings. Does this change who is "wisest"?',
      successHint: 'Comparative cognition teaches humility: our human-centric definition of intelligence misses the extraordinary cognitive achievements of other species. The owl\'s acoustic spatial reasoning, the crow\'s tool fabrication, the parrot\'s linguistic ability — all are forms of intelligence shaped by evolution for specific challenges.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Neurobiology & Biophysics
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (owl biology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for neurobiology and biophysics modeling. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
