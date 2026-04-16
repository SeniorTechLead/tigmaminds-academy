import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function OwlLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Nocturnal adaptations — life in the dark',
      concept: `Roughly 30% of all vertebrate species are **nocturnal** — active at night. They've evolved remarkable adaptations to function in darkness:

**Visual adaptations**: Larger eyes (relative to body size), more rod cells (sensitive to dim light), a reflective layer behind the retina (tapetum lucidum) that gives light a second chance to be detected — this is why cat and owl eyes "glow" in flashlight beams.

**Auditory adaptations**: Enhanced hearing compensates for limited vision. Owls have asymmetrical ear placement (one higher than the other) that lets them locate prey in complete darkness using sound alone.

**Other senses**: Some nocturnal animals use echolocation (bats), infrared detection (pit vipers), or electroreception (platypus). Darkness drove the evolution of entirely new sensory modalities.

**Behavioral adaptations**: Reduced activity during the day (to avoid predators and heat), cached food, territorial calls instead of visual displays. Owl wisdom isn't intelligence — it's the accumulation of sensory superpowers evolved over 60 million years.`,
      analogy: 'Nocturnal animals are like submarines. Submarines can\'t see through dark ocean water, so they rely on sonar (sound), radar (electromagnetic waves), and passive listening. Owls can\'t see well in pitch darkness either, so they rely on hearing (asymmetric ears), enhanced dim-light vision (more rods), and signal amplification (tapetum). Same engineering challenge, same solution categories.',
      storyConnection: 'The story says the owl is the wisest because it sees what others cannot. In biology, the owl\'s "wisdom" is sensory: it perceives the world through senses that are invisible to daytime animals — ultrasensitive hearing, wide-angle vision, and the ability to fly silently. Its "knowledge" of the night is literally its evolved perception of it.',
      checkQuestion: 'Owls can rotate their heads 270 degrees. Why can\'t humans do this, and why do owls need to?',
      checkAnswer: 'Owl eyes are tubular (not spherical like ours) and fixed in their sockets — they can\'t move their eyes. To look sideways, they must turn their entire head. Evolution compensated with 14 cervical vertebrae (humans have 7) and special blood vessels that maintain brain blood flow during rotation. The 270° head rotation is a workaround for immobile eyes — engineering trade-offs in action.',
      codeIntro: 'Compare eye sizes and light sensitivity across nocturnal and diurnal species.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Eye size vs body mass (allometric relationship)
ax1.set_facecolor('#111827')

animals = {
    'Tarsier': (0.12, 16, True), 'Owl (eagle)': (3.5, 36, True),
    'Cat': (4, 22, True), 'Owl (barn)': (0.5, 21, True),
    'Human': (70, 24, False), 'Eagle': (4.5, 33, False),
    'Chicken': (2, 11, False), 'Mouse': (0.02, 3, True),
    'Dog': (15, 20, False), 'Horse': (500, 40, False),
}

for name, (mass, eye_dia, nocturnal) in animals.items():
    color = '#f59e0b' if nocturnal else '#3b82f6'
    marker = 'o' if nocturnal else 's'
    ax1.scatter(mass, eye_dia, c=color, s=100, marker=marker, edgecolors='white',
                linewidths=1, zorder=5)
    ax1.annotate(name, (mass, eye_dia), textcoords="offset points",
                 xytext=(5, 5), color='white', fontsize=7)

# Allometric line for diurnal
masses = np.logspace(-2, 3, 100)
diurnal_eye = 5 * masses**0.25  # approximate allometric scaling
ax1.plot(masses, diurnal_eye, color='#3b82f6', linestyle='--', alpha=0.5, label='Diurnal trend')

ax1.scatter([], [], c='#f59e0b', s=60, label='Nocturnal')
ax1.scatter([], [], c='#3b82f6', s=60, marker='s', label='Diurnal')
ax1.set_xscale('log')
ax1.set_xlabel('Body mass (kg)', color='white')
ax1.set_ylabel('Eye diameter (mm)', color='white')
ax1.set_title('Eye Size vs Body Mass', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# 2. Light sensitivity comparison
ax2.set_facecolor('#111827')
species_sens = ['Human', 'Cat', 'Owl', 'Tarsier', 'Deep-sea\
fish']
sensitivity = [1, 6, 10, 20, 100]  # relative to human
rod_pct = [95, 97, 99, 99.5, 100]  # % of photoreceptors that are rods
colors_bar = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7']

bars = ax2.bar(species_sens, sensitivity, color=colors_bar, alpha=0.8, edgecolor='white', linewidth=0.5)
for bar, rod in zip(bars, rod_pct):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             f'{rod}% rods', ha='center', color='white', fontsize=8)

ax2.set_ylabel('Light sensitivity (× human)', color='white')
ax2.set_title('Low-Light Vision: Sensitivity Comparison', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Nocturnal eye adaptations:")
print("  1. Larger eyes → larger pupil → more light collected")
print("  2. More rod cells → better dim-light detection")
print("  3. Tapetum lucidum → light reflected back through retina")
print("  4. Larger cornea → wider field of view")
print()
print("Owl eyes are so large they can't rotate in their sockets.")
print("  Owl eye: ~5% of head weight")
print("  Human eye: ~0.03% of head weight")`,
      challenge: 'If an owl\'s pupil can dilate to 14mm diameter and a human\'s to 8mm, how much more light does the owl collect? (Hint: light gathering is proportional to area, which is proportional to diameter squared.)',
      successHint: 'Nocturnal adaptations are evolution\'s solution to the engineering challenge of operating in low-light conditions. Every night-vision technology we\'ve built — from image intensifiers to infrared cameras — solves the same problem owls solved millions of years ago.',
    },
    {
      title: 'How eyes work — the biological camera',
      concept: `The eye is a biological camera. Every component has a direct engineering analog:

| Eye part | Camera analog | Function |
|----------|-------------|----------|
| Cornea | Front lens element | Refracts (bends) incoming light |
| Iris/Pupil | Aperture/f-stop | Controls light amount |
| Lens | Focus lens | Fine-focuses the image |
| Retina | Image sensor (CCD/CMOS) | Detects light, converts to signals |
| Fovea | Center of sensor | Highest resolution area |
| Optic nerve | USB cable | Sends data to the brain (processor) |

The eye focuses light by refraction: the cornea does ~2/3 of the focusing, the lens does ~1/3 (and adjusts for distance — **accommodation**). The image on the retina is upside down and reversed — the brain flips it right-side-up.

Resolution limit: ~1 arcminute (1/60 of a degree), limited by the spacing of photoreceptor cells in the fovea (~5 micrometers apart). This corresponds to reading 1cm letters from 3.4 meters away.`,
      analogy: 'The eye is so camera-like that early camera obscuras (the ancestor of cameras) were literally modeled on the eye. Both use a lens to project an inverted image onto a surface. The main difference: cameras use electronics to read the image, while eyes use neurochemistry. Otherwise, the optics are identical.',
      storyConnection: 'The owl\'s eye works on the same principles as ours, but with different engineering specifications: larger aperture (bigger pupil), more sensitive sensor (more rods), and built-in signal amplifier (tapetum). It\'s like comparing a professional DSLR camera to a smartphone camera — same physics, different specs.',
      checkQuestion: 'The human eye can see a single candle flame from 2.6 km away on a clear dark night. How many photons per second does that correspond to?',
      checkAnswer: 'About 90 photons per second reach the retina, of which ~5-10 are actually detected (quantum efficiency ~10%). The absolute threshold is about 5-9 photons in a 100ms window. The human eye in dark-adapted conditions is close to the quantum limit — detecting individual photons. It\'s an extraordinarily sensitive instrument.',
      codeIntro: 'Model the optics of the eye: how the lens forms an image on the retina.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Eye optics ray diagram
ax1.set_facecolor('#111827')

# Eye dimensions (simplified)
eye_radius = 12  # mm (half of ~24mm diameter)
cornea_x = -eye_radius
retina_x = eye_radius
lens_x = -5  # mm from center
focal_length = 17  # mm (of combined cornea+lens)

# Object at 3 distances
objects = [
    (250, 15, 'Near (25cm)', '#22c55e'),     # 250mm, 15mm tall
    (1000, 30, 'Medium (1m)', '#3b82f6'),    # 1m
    (10000, 200, 'Far (10m)', '#f59e0b'),    # 10m
]

for obj_dist, obj_height, label, color in objects:
    # Thin lens equation: 1/f = 1/do + 1/di
    # Image distance (from lens): di = f * do / (do - f)
    di = focal_length * obj_dist / (obj_dist - focal_length)
    image_height = -obj_height * di / obj_dist

    # Scale for visualization
    scale = 1 / 50
    obj_x_scaled = cornea_x - min(obj_dist * 0.001, 8)
    obj_h_scaled = obj_height * scale * min(1, 100/obj_dist)

    # Rays from object tip to lens to image
    obj_tip = (obj_x_scaled, obj_h_scaled)
    lens_center = (lens_x, 0)
    image_tip = (retina_x, image_height * 0.5)

    # Parallel ray → through focal point
    ax1.plot([obj_x_scaled, lens_x], [obj_h_scaled, obj_h_scaled], color=color, linewidth=1, alpha=0.6)
    ax1.plot([lens_x, retina_x], [obj_h_scaled, image_tip[1]], color=color, linewidth=1, alpha=0.6)

    # Central ray → straight through
    ax1.plot([obj_x_scaled, retina_x], [obj_h_scaled, image_tip[1]], color=color, linewidth=1, alpha=0.6, linestyle='--')

    ax1.plot(retina_x, image_tip[1], 'o', color=color, markersize=5)
    ax1.text(obj_x_scaled - 0.5, obj_h_scaled + 0.5, label, color=color, fontsize=8)

# Draw eye structure
theta = np.linspace(-np.pi/2, np.pi/2, 100)
ax1.plot(eye_radius * np.cos(theta) + 0, eye_radius * np.sin(theta), color='#9ca3af', linewidth=2)
ax1.plot(-eye_radius * np.cos(theta), eye_radius * np.sin(theta), color='#9ca3af', linewidth=2)

# Lens
lens_h = 5
ax1.plot([lens_x, lens_x], [-lens_h, lens_h], color='#60a5fa', linewidth=3, alpha=0.5)
ax1.text(lens_x, lens_h + 1, 'Lens', color='#60a5fa', fontsize=8, ha='center')

# Retina
ax1.plot([retina_x, retina_x], [-10, 10], color='#f59e0b', linewidth=3, alpha=0.5)
ax1.text(retina_x + 1, 0, 'Retina', color='#f59e0b', fontsize=8, va='center')

ax1.set_xlim(-22, 16)
ax1.set_ylim(-14, 14)
ax1.set_title('Eye Optics: How the Lens Forms an Image', color='white', fontsize=13)
ax1.set_xlabel('mm', color='white')
ax1.set_aspect('equal')
ax1.tick_params(colors='gray')

# 2. Resolution comparison
ax2.set_facecolor('#111827')
species_res = ['Human', 'Eagle', 'Owl', 'Cat', 'Mouse', 'Goldfish']
acuity = [60, 140, 10, 6, 1, 4]  # cycles per degree
min_angle = [1, 0.43, 6, 10, 60, 15]  # arcminutes

bars = ax2.barh(species_res, acuity, color=['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#ec4899'],
                alpha=0.8, edgecolor='white', linewidth=0.5)
for bar, angle in zip(bars, min_angle):
    ax2.text(bar.get_width() + 2, bar.get_y() + bar.get_height()/2,
             f"{angle}' min angle", va='center', color='white', fontsize=9)

ax2.set_xlabel('Visual acuity (cycles/degree)', color='white')
ax2.set_title('Visual Resolution: Sharpness vs Sensitivity Trade-off', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Eye optics summary:")
print("  Thin lens equation: 1/f = 1/do + 1/di")
print(f"  Human eye focal length: ~{focal_length}mm")
print(f"  Human eye diameter: ~24mm")
print()
print("Resolution vs sensitivity trade-off:")
print("  Eagle: highest acuity (sharp vision, fewer rods)")
print("  Owl: lower acuity but extreme sensitivity (more rods)")
print("  You can't maximize both — photoreceptor space is limited")`,
      challenge: 'Calculate the image size on the retina for a 1.8m tall person standing 10m away. Use the thin lens equation with f=17mm. How many photoreceptors wide is this image?',
      successHint: 'The eye is nature\'s camera. Understanding its optics — focal length, aperture, sensor sensitivity — is the foundation for understanding every optical instrument humans have built.',
    },
    {
      title: 'Rod vs cone cells — sensitivity vs color',
      concept: `The retina contains two types of photoreceptor cells:

**Rod cells** (~120 million per eye):
- Extremely sensitive to light (can detect a single photon)
- No color discrimination (only one type of photopigment: rhodopsin)
- Provide peripheral and dim-light vision
- Slow response time (~100ms)

**Cone cells** (~6 million per eye):
- Less sensitive (need ~100 photons to fire)
- Three types with different pigments: S (blue, 420nm peak), M (green, 530nm), L (red, 560nm)
- Provide color vision and sharp central vision
- Fast response time (~15ms)

The fovea (center of vision) is cone-dominated — highest resolution, best color. The periphery is rod-dominated — lower resolution, no color, but much more sensitive.

Owls have retinas that are almost entirely rods — maximizing sensitivity at the cost of color vision and acuity. This is the fundamental trade-off: **sensitivity vs. resolution vs. color**.`,
      analogy: 'Rods are like black-and-white film: very sensitive to light (high ISO), but no color information. Cones are like color film: need more light (low ISO), but capture full color. Night photographers switch to high-ISO black-and-white for dim conditions — exactly what your brain does when it shifts from cone vision (photopic) to rod vision (scotopic).',
      storyConnection: 'The owl sees the world in near-monochrome at night — lots of detail in dim light, but little color. The "wisdom" of the owl is not about seeing beautiful colors in the dark; it\'s about detecting the faintest movement of a mouse 30 meters away in starlight. Different mission, different hardware.',
      checkQuestion: 'Why do you lose color vision in dim light? You can test this: in a dark room, colored objects appear gray.',
      checkAnswer: 'Cone cells need ~100 photons to activate, while rods need only ~1. In dim light, only rods are active. Since rods have only one pigment type (rhodopsin), they can\'t distinguish wavelengths — everything is monochrome. This is called scotopic vision. At intermediate light levels (mesopic), both rods and cones contribute, giving partial color.',
      codeIntro: 'Visualize the spectral sensitivity of rods and cones and the rod-cone transition.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Spectral sensitivity of rods and cones
ax1.set_facecolor('#111827')
wavelengths = np.linspace(380, 720, 500)

# Absorption spectra (Gaussian approximations)
rod = np.exp(-((wavelengths - 498) / 35)**2)  # rhodopsin peak at 498nm
s_cone = np.exp(-((wavelengths - 420) / 20)**2) * 0.6  # S-cone (blue)
m_cone = np.exp(-((wavelengths - 530) / 30)**2) * 0.8  # M-cone (green)
l_cone = np.exp(-((wavelengths - 560) / 30)**2)  # L-cone (red)

ax1.plot(wavelengths, rod, color='#9ca3af', linewidth=2.5, label='Rod (rhodopsin)', linestyle='--')
ax1.plot(wavelengths, s_cone, color='#3b82f6', linewidth=2, label='S-cone (blue, 420nm)')
ax1.plot(wavelengths, m_cone, color='#22c55e', linewidth=2, label='M-cone (green, 530nm)')
ax1.plot(wavelengths, l_cone, color='#ef4444', linewidth=2, label='L-cone (red, 560nm)')

ax1.fill_between(wavelengths, rod, alpha=0.05, color='#9ca3af')
ax1.fill_between(wavelengths, s_cone, alpha=0.1, color='#3b82f6')
ax1.fill_between(wavelengths, m_cone, alpha=0.1, color='#22c55e')
ax1.fill_between(wavelengths, l_cone, alpha=0.1, color='#ef4444')

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Relative sensitivity', color='white')
ax1.set_title('Photoreceptor Spectral Sensitivity', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# 2. Rod vs cone sensitivity as function of light level
ax2.set_facecolor('#111827')
light_levels = np.logspace(-6, 4, 200)  # cd/m²

# Rod sensitivity (saturates at high light)
rod_response = 1 / (1 + light_levels / 0.01) * 100

# Cone sensitivity (threshold around 0.01 cd/m²)
cone_response = 100 * light_levels / (light_levels + 1) * (light_levels > 0.01)

ax2.semilogx(light_levels, rod_response, color='#9ca3af', linewidth=2.5, label='Rod system')
ax2.semilogx(light_levels, cone_response, color='#f59e0b', linewidth=2.5, label='Cone system')

# Annotate vision regimes
ax2.axvspan(1e-6, 0.01, alpha=0.1, color='#3b82f6')
ax2.axvspan(0.01, 10, alpha=0.1, color='#a855f7')
ax2.axvspan(10, 1e4, alpha=0.1, color='#f59e0b')
ax2.text(0.001, 85, 'Scotopic\
(rods only)', color='#3b82f6', fontsize=9, ha='center')
ax2.text(0.3, 85, 'Mesopic\
(both)', color='#a855f7', fontsize=9, ha='center')
ax2.text(100, 85, 'Photopic\
(cones only)', color='#f59e0b', fontsize=9, ha='center')

# Mark owl and human operating ranges
ax2.annotate('Owl hunting\
range', xy=(0.0001, 60), color='#22c55e', fontsize=8, ha='center',
             bbox=dict(boxstyle='round', facecolor='#22c55e', alpha=0.2))
ax2.annotate('Human\
reading', xy=(100, 50), color='#ef4444', fontsize=8, ha='center',
             bbox=dict(boxstyle='round', facecolor='#ef4444', alpha=0.2))

ax2.set_xlabel('Luminance (cd/m²)', color='white')
ax2.set_ylabel('System response (%)', color='white')
ax2.set_title('Rod-Cone Transition: The Duplex Retina', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Rod vs Cone comparison:")
print("  Rods: 120 million/eye, 1-photon threshold, no color, slow")
print("  Cones: 6 million/eye, 100-photon threshold, color, fast")
print()
print("Owl retina: ~99% rods → extreme dim-light sensitivity")
print("Human retina: ~95% rods (but fovea is 100% cones)")
print("Eagle retina: ~80% cones → extreme acuity (8× human)")`,
      challenge: 'Color blindness occurs when one cone type is missing. Red-green color blindness (deuteranopia) lacks M-cones. Remove the M-cone curve and explain which colors would be indistinguishable.',
      successHint: 'The rod-cone system is a masterpiece of biological engineering. It gives us a visual range from starlight to bright sunlight — about 10 billion to 1. No single camera sensor can match this dynamic range.',
    },
    {
      title: 'Night vision technology — engineering the owl\'s eye',
      concept: `Human night-vision technology uses three approaches, each solving the same problem owls solve biologically:

**Generation 1-3 Image Intensifiers** (1960s-present): An image intensifier tube amplifies available light (starlight, moonlight) by 20,000-50,000×. Photons hit a photocathode, generating electrons, which are accelerated and multiplied through a microchannel plate, then converted back to visible light on a phosphor screen. The green glow is from the phosphor — green was chosen because human eyes are most sensitive to green.

**Thermal Imaging** (1970s-present): Detects infrared radiation (heat) emitted by all objects above absolute zero. Doesn't need any light at all. Warm objects (animals, engines) appear bright against cool backgrounds. Uses bolometers or quantum well detectors.

**Digital Low-Light Cameras** (2000s-present): Highly sensitive CMOS sensors with large pixels, combined with computational image processing (noise reduction, frame stacking, AI enhancement). Smartphones now have "night mode" that takes multiple short exposures and combines them.`,
      analogy: 'The three night-vision approaches are like three ways to read in the dark: (1) Image intensifiers = using a magnifying glass to collect more ambient light. (2) Thermal imaging = reading Braille — using a completely different signal (heat instead of light). (3) Digital processing = taking many dim photos and computationally combining them into one bright image.',
      storyConnection: 'The owl combines all three strategies biologically: (1) Large eyes and tapetum act as natural light amplifiers (like image intensifiers). (2) The owl\'s ears provide a "thermal-like" non-visual detection system. (3) The owl\'s brain integrates multiple dim signals over time (like digital frame stacking). Human engineers needed three separate technologies to match one bird.',
      checkQuestion: 'Night-vision goggles show a green image. Why green specifically?',
      checkAnswer: 'The phosphor screen that converts amplified electrons back to visible light is chosen to be green (P43 phosphor) because human eyes have peak sensitivity at ~555nm (green). More cones respond to green than any other color, so green images appear brightest and most detailed. This maximizes the effective resolution and contrast of the intensified image.',
      codeIntro: 'Simulate how image intensifiers amplify dim scenes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Create a simple scene (owl hunting mouse)
scene_size = 100
scene = np.zeros((scene_size, scene_size))

# Ground (slight texture)
scene += np.random.uniform(0.1, 0.15, (scene_size, scene_size))

# Mouse (small warm object)
mouse_y, mouse_x = 60, 70
scene[mouse_y-2:mouse_y+2, mouse_x-3:mouse_x+3] = 0.7

# Tree (dark object)
scene[10:80, 20:25] = 0.05
scene[10:30, 15:35] = 0.08

# Stars
for _ in range(20):
    sx, sy = np.random.randint(0, 100, 2)
    scene[sy, sx] = 0.9

# 1. Full daylight
ax = axes[0, 0]
ax.imshow(scene, cmap='gray', vmin=0, vmax=1)
ax.set_title('Daylight (100%)', color='white', fontsize=11)
ax.axis('off')

# 2. Moonlight (1/400,000 of daylight)
ax = axes[0, 1]
moonlight = scene * 0.01 + np.random.normal(0, 0.003, scene.shape)
ax.imshow(np.clip(moonlight, 0, 1), cmap='gray', vmin=0, vmax=0.02)
ax.set_title('Moonlight (~0.01×)', color='white', fontsize=11)
ax.axis('off')

# 3. Starlight (1/1,000,000,000 of daylight)
ax = axes[0, 2]
starlight = scene * 0.001 + np.random.normal(0, 0.005, scene.shape)
ax.imshow(np.clip(starlight, 0, 1), cmap='gray', vmin=0, vmax=0.01)
ax.set_title('Starlight (~0.001×)', color='white', fontsize=11)
ax.axis('off')

# 4. Image intensifier (amplify + green phosphor + noise)
ax = axes[1, 0]
amplified = starlight * 30000
amp_noise = amplified + np.random.normal(0, 0.5, scene.shape)
amp_clipped = np.clip(amp_noise, 0, 1)
# Green channel only (phosphor)
green_image = np.zeros((*scene.shape, 3))
green_image[:, :, 1] = amp_clipped
ax.imshow(green_image)
ax.set_title('Image Intensifier (Gen 3)', color='white', fontsize=11)
ax.axis('off')

# 5. Thermal imaging
ax = axes[1, 1]
thermal = np.random.uniform(0.2, 0.3, scene.shape)  # ambient temp
thermal[mouse_y-2:mouse_y+2, mouse_x-3:mouse_x+3] = 0.9  # warm mouse
thermal[10:80, 20:25] = 0.25  # cool tree
thermal += np.random.normal(0, 0.02, scene.shape)
ax.imshow(np.clip(thermal, 0, 1), cmap='inferno')
ax.set_title('Thermal Imaging (IR)', color='white', fontsize=11)
ax.axis('off')

# 6. Digital night mode (frame stacking)
ax = axes[1, 2]
n_frames = 30
stacked = np.zeros_like(scene)
for _ in range(n_frames):
    frame = scene * 0.005 + np.random.normal(0, 0.003, scene.shape)
    stacked += frame
stacked /= n_frames
stacked = stacked / stacked.max()
ax.imshow(np.clip(stacked, 0, 1), cmap='gray')
ax.set_title(f'Digital Night Mode ({n_frames} frames)', color='white', fontsize=11)
ax.axis('off')

plt.suptitle('Night Vision Technologies Compared', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Night vision comparison:")
print("  Image intensifier: amplifies existing light 20,000-50,000×")
print("    + Works in very low light (starlight)")
print("    - Useless in total darkness (no photons to amplify)")
print()
print("  Thermal: detects heat radiation (8-14 μm wavelength)")
print("    + Works in total darkness")
print("    - Low resolution, no detail (just heat signatures)")
print()
print("  Digital: stacks multiple dim frames computationally")
print("    + Cheap (smartphone cameras)")
print("    - Needs some light, slow (multi-exposure)")`,
      challenge: 'The signal-to-noise ratio (SNR) of stacking N frames improves as √N. How many frames do you need to stack to match a 30,000× image intensifier if each frame captures 1/1000th of the scene brightness?',
      successHint: 'Night vision technology is a direct application of the physics of light detection. Every generation of NV goggles gets closer to what owls achieve biologically — detecting and processing images from just a handful of photons.',
    },
    {
      title: 'Silent flight — owl feather aeroacoustics',
      concept: `Owls fly almost silently — their wing noise is below the hearing threshold of both prey and human ears. This is achieved through three feather adaptations:

1. **Comb-like leading edge**: The front edge of the primary flight feather has tiny serrations (like a comb) that break up turbulence into smaller vortices. Smaller vortices produce higher-frequency noise — above the hearing range of prey.

2. **Velvety surface**: The upper surface of owl feathers has a soft, velvety texture that absorbs aerodynamic noise. This acts like acoustic foam on the wing surface.

3. **Fringed trailing edge**: The rear edge of the feather is ragged, not sharp. This breaks up the coherent vortex sheet that forms at the trailing edge, reducing the tonal noise (the "whoosh" sound).

Together, these features reduce flight noise by ~18 dB (decibels) compared to similarly-sized birds. Since decibels are logarithmic, 18 dB means the owl's flight is about **60× quieter** than other birds.

Engineers are now applying these principles to wind turbines, aircraft engines, and computer fans.`,
      analogy: 'The three owl feather adaptations are like three noise-reduction strategies in a car: (1) The serrated leading edge is like a muffler — it breaks up the exhaust into smaller, quieter pulses. (2) The velvety surface is like sound-deadening insulation. (3) The fringed trailing edge is like a diffuser on a sports car — it manages airflow to reduce turbulence noise.',
      storyConnection: 'The story says the owl is wise because it moves unseen and unheard. The "unheard" part is real engineering: owl feathers are optimized acoustic silencers. The mouse doesn\'t hear the owl coming — by the time it could, the owl\'s talons are already closing.',
      checkQuestion: 'A 3 dB reduction means halving the sound power. An 18 dB reduction means halving it 6 times: 2⁶ = 64. If a normal bird\'s flight noise is 50 dB at 1 meter, what is the owl\'s?',
      checkAnswer: '50 - 18 = 32 dB. For reference, 30 dB is a whisper, 40 dB is a quiet library. The owl\'s flight noise is literally quieter than a whisper. At the prey\'s typical hearing distance, it\'s below the detection threshold entirely — the owl is acoustically invisible.',
      codeIntro: 'Model the noise reduction mechanisms of owl feathers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Noise spectrum: owl vs regular bird
ax1.set_facecolor('#111827')
frequencies = np.logspace(1, 5, 500)  # 10 Hz to 100 kHz

# Regular bird noise spectrum (broadband with peaks)
regular_noise = 60 - 10 * np.log10(frequencies / 100)
regular_noise += 10 * np.exp(-((np.log10(frequencies) - 2.5) / 0.3)**2)  # vortex shedding peak
regular_noise = np.clip(regular_noise, 0, 70)

# Owl noise (reduced by serrations, velvet, fringe)
serration_reduction = 8 * (frequencies > 500).astype(float)  # reduces mid-high freq
velvet_reduction = 5 * np.ones_like(frequencies)  # broadband absorption
fringe_reduction = 10 * np.exp(-((np.log10(frequencies) - 2.5) / 0.3)**2)  # kills the peak

owl_noise = regular_noise - serration_reduction - velvet_reduction - fringe_reduction
owl_noise = np.clip(owl_noise, 0, 70)

# Mouse hearing range
mouse_hearing = (frequencies > 1000) & (frequencies < 70000)

ax1.semilogx(frequencies, regular_noise, color='#ef4444', linewidth=2, label='Regular bird')
ax1.semilogx(frequencies, owl_noise, color='#22c55e', linewidth=2, label='Owl')
ax1.fill_between(frequencies, 0, 70, where=mouse_hearing, alpha=0.1, color='#f59e0b')
ax1.text(5000, 65, 'Mouse hearing range', color='#f59e0b', fontsize=9, ha='center')

# Mouse detection threshold
ax1.axhline(25, color='#f59e0b', linestyle=':', alpha=0.5, label='Mouse detection threshold')

ax1.set_xlabel('Frequency (Hz)', color='white')
ax1.set_ylabel('Sound pressure level (dB)', color='white')
ax1.set_title('Flight Noise Spectrum: Owl vs Regular Bird', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 75)

# 2. Applications: owl-inspired noise reduction
ax2.set_facecolor('#111827')
applications = ['Wind turbine\
blade', 'Aircraft\
landing gear', 'Computer\
fan', 'Train\
pantograph', 'Drone\
propeller']
noise_reduction = [6, 10, 8, 12, 5]  # dB reduction achieved
bio_feature = ['Leading edge\
serrations', 'Trailing edge\
fringe', 'Velvety\
surface', 'Edge\
serrations', 'Serrated\
tips']

colors_app = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']
bars = ax2.barh(applications, noise_reduction, color=colors_app, alpha=0.8, edgecolor='white', linewidth=0.5)
for bar, feat, val in zip(bars, bio_feature, noise_reduction):
    ax2.text(bar.get_width() + 0.3, bar.get_y() + bar.get_height()/2,
             f'{feat} ({val} dB)', va='center', color='white', fontsize=8)

ax2.set_xlabel('Noise reduction (dB)', color='white')
ax2.set_title('Owl-Inspired Noise Reduction in Engineering', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Owl silent flight mechanisms:")
print("  1. Serrated leading edge: breaks vortices → higher-freq noise (~+8dB)")
print("     (Higher freq = shorter propagation distance + above prey hearing)")
print("  2. Velvety surface: absorbs broadband noise (~5dB)")
print("  3. Fringed trailing edge: eliminates vortex shedding tone (~10dB)")
print()
print("Total reduction: ~18dB = 60× quieter")
print()
print("Real-world applications:")
print("  Siemens: serrated wind turbine blades reduce noise by 6dB")
print("  Airbus: owl-inspired landing gear covers reduce approach noise")`,
      challenge: 'A wind turbine at 300m produces 45 dB of noise. With owl-inspired serrations reducing noise by 6 dB, what is the new noise level? Is it below the 40 dB nighttime noise limit for residential areas?',
      successHint: 'Owl silent flight combines fluid dynamics, acoustics, and materials science. The three feather adaptations — serrated leading edge, velvety surface, fringed trailing edge — are now standard tools in noise engineering. Level 2 goes deeper into the sensory physics.',
    },
    {
      title: 'Echolocation in some owls — hearing replaces sight',
      concept: `Most owls don't echolocate (unlike bats), but they achieve something equally remarkable: **passive sound localization** so precise they can catch prey in complete darkness.

The barn owl (*Tyto alba*) is the champion. Its asymmetric ears (left ear higher than right) create different arrival times and intensities for sounds from different directions:

- **Horizontal localization**: sound arrives at the nearer ear ~30 microseconds earlier (interaural time difference, ITD)
- **Vertical localization**: the higher ear detects sounds from below more strongly; the lower ear detects sounds from above (interaural level difference, ILD)

The barn owl can localize a sound to within **1-2 degrees** in both horizontal and vertical planes — comparable to visual acuity. In complete darkness, it strikes a mouse with >90% success rate using sound alone.

The auditory processing happens in a brain structure called the **inferior colliculus**, which contains a neural map of auditory space — neurons are arranged by the location of the sound they respond to, much like the visual cortex maps visual space.`,
      analogy: 'The barn owl\'s hearing is like a stereo microphone system used in concert recording. Two microphones placed apart create a stereo image — you can tell where each instrument is by the time and volume difference between the channels. The owl\'s asymmetric ears do the same thing in 3D, with microsecond precision.',
      storyConnection: 'The story says the owl is the wisest because it knows the night\'s secrets. In biology, the barn owl literally "hears" a 3D map of its surroundings — the rustling of a mouse under leaves, the heartbeat of a vole under snow. Its auditory world is as rich and detailed as our visual world. Different sense, same depth of perception.',
      checkQuestion: 'Sound travels at ~340 m/s. An owl\'s ears are about 5 cm apart. What is the maximum interaural time difference (ITD)?',
      checkAnswer: 'Maximum ITD = ear separation / speed of sound = 0.05m / 340 m/s ≈ 147 microseconds. This occurs when the sound is directly to one side (90°). The owl\'s brain can detect differences as small as ~10 microseconds, corresponding to about 2° of angular resolution. For comparison, digital audio has 44,100 samples per second (22.7 microseconds per sample) — the owl\'s brain operates at higher temporal resolution than CD audio.',
      codeIntro: 'Model the barn owl\'s sound localization: interaural time and level differences.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Interaural time difference (ITD) as function of angle
ax1.set_facecolor('#111827')
ear_separation = 0.05  # meters (5 cm for barn owl)
speed_of_sound = 340  # m/s

angles = np.linspace(-90, 90, 200)  # degrees from center
# ITD = d * sin(theta) / c
itd = ear_separation * np.sin(np.radians(angles)) / speed_of_sound * 1e6  # microseconds

ax1.plot(angles, itd, color='#22c55e', linewidth=2.5)
ax1.fill_between(angles, itd, alpha=0.1, color='#22c55e')

# Mark detection threshold
ax1.axhline(10, color='#f59e0b', linestyle='--', alpha=0.5, label='Detection threshold (~10 μs)')
ax1.axhline(-10, color='#f59e0b', linestyle='--', alpha=0.5)

# Mark angular resolution
threshold_angle = np.degrees(np.arcsin(10e-6 * speed_of_sound / ear_separation))
ax1.axvline(threshold_angle, color='#ef4444', linestyle=':', alpha=0.3)
ax1.axvline(-threshold_angle, color='#ef4444', linestyle=':', alpha=0.3)
ax1.text(0, -120, f'Resolution: ±{threshold_angle:.1f}°', color='#ef4444', fontsize=10, ha='center')

ax1.set_xlabel('Sound source angle (degrees)', color='white')
ax1.set_ylabel('Interaural time difference (μs)', color='white')
ax1.set_title('Horizontal Sound Localization (ITD)', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# 2. Auditory map: neural response as function of position
ax2.set_facecolor('#111827')

# Simulate neural map of auditory space
azimuth = np.linspace(-90, 90, 100)
elevation = np.linspace(-60, 60, 100)
AZ, EL = np.meshgrid(azimuth, elevation)

# Sound source: mouse at (20°, -10°)
mouse_az, mouse_el = 20, -10
# Neural response (Gaussian tuning)
response = np.exp(-((AZ - mouse_az)**2 / (8**2) + (EL - mouse_el)**2 / (10**2)))

# Add some noise
response += np.random.normal(0, 0.1, response.shape)
response = np.clip(response, 0, 1)

im = ax2.imshow(response, cmap='hot', aspect='auto',
                extent=[-90, 90, -60, 60], origin='lower')
ax2.plot(mouse_az, mouse_el, 'x', color='#22c55e', markersize=15, markeredgewidth=3,
         label=f'Mouse at ({mouse_az}°, {mouse_el}°)')
ax2.set_xlabel('Azimuth (degrees)', color='white')
ax2.set_ylabel('Elevation (degrees)', color='white')
ax2.set_title('Owl Auditory Space Map (neural activity)', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper left')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Barn owl sound localization:")
print(f"  Ear separation: {ear_separation*100:.0f} cm")
print(f"  Max ITD: {ear_separation/speed_of_sound*1e6:.0f} μs (sound from 90°)")
print(f"  Minimum detectable ITD: ~10 μs → ~{threshold_angle:.1f}° resolution")
print()
print("For comparison:")
print("  Human ITD resolution: ~10 μs → ~1-2° (similar to owl)")
print("  Human ILD resolution: ~1 dB (owl: ~0.5 dB)")
print("  But owl combines ITD + ILD for 3D localization")
print("  Success rate in total darkness: >90%")`,
      challenge: 'A mouse rustles leaves at 30° to the left and 2 meters away. Calculate: (1) the ITD at the owl\'s ears, (2) the time delay from mouse to owl, (3) whether the owl can localize the mouse precisely enough to strike.',
      successHint: 'From nocturnal adaptations to eye optics to rods and cones to night vision technology to silent flight to sound localization — the owl is a complete course in sensory physics. Level 2 takes each of these topics deeper into the mathematics and engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Owl Adaptations & Night Vision — no prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for sensory physics simulations. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}