import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function IbnAlHaythamLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Emission vs intromission — how do we actually see?',
      concept: `For over a thousand years, the greatest minds in Greece believed that **eyes emit rays** that reach out and touch objects. Euclid, Ptolemy, and Plato all held some version of this **emission theory**. It felt intuitive — you "look at" something, so something must go out from your eyes.

Ibn al-Haytham asked a devastating question: **if your eyes emit rays, why does it hurt to look at the sun?** If light comes from your eyes, staring at a bright source should be no different from staring at a dark wall. The pain proves that something enters the eye from outside.

He proposed the **intromission theory**: objects either emit or reflect light, and that light enters the eye to form an image. Every point on an object sends rays in all directions. The ones that happen to enter your pupil are what you see.

This was not a guess. He tested it systematically:
- **Candle experiment**: place a candle in a dark room. Light enters the room from the candle, not from the observer's eyes.
- **Afterimage test**: stare at a bright flame, then look away. You see a lingering image — proof that light affected your eye.
- **Pain test**: bright light hurts. Something is entering and overwhelming the eye.

📚 *Ibn al-Haytham's Book of Optics (Kitab al-Manazir, ~1011 CE) replaced 1,000 years of incorrect theory with experimental evidence. This single insight — light enters the eye — is the foundation of all optics.*`,
      analogy: 'Imagine two theories about how phones work: (A) your phone sends invisible beams that pull information from websites, or (B) websites send data to your phone. If your phone overheats when downloading a huge file, that proves data is coming IN, not going out. The heat is like the pain of staring at the sun — evidence that energy is entering, not leaving.',
      storyConnection: 'Ibn al-Haytham did not simply assert the old theory was wrong — he designed experiments to prove it. When he placed a candle in a dark room and showed that the room lit up from the candle, not from the observer\'s eyes, he was doing something radical: letting nature answer the question instead of philosophy.',
      checkQuestion: 'If the emission theory were true (eyes send out rays), what should happen when you close your eyes? What actually happens, and what does that tell you?',
      checkAnswer: 'If eyes emitted rays, closing your eyes would just block outgoing rays — the room should stay lit by everyone else\'s eye-rays. What actually happens: you see nothing when your eyes are closed, and covering a candle darkens the room. This proves light comes from external sources and enters the eye. No outgoing rays exist.',
      codeIntro: 'Model both theories and see which one matches real observations.',
      code: `import numpy as np

# === Emission vs Intromission Theory ===
# Model what each theory predicts, then compare with reality.

print("=== Testing Two Theories of Vision ===")
print()

# Observation 1: Pain from bright light
sun_intensity = 100000  # lux (approximate)
candle_intensity = 15   # lux

print("Observation 1: Pain from bright light sources")
print(f"  Sun intensity:    {sun_intensity:>8,} lux")
print(f"  Candle intensity: {candle_intensity:>8,} lux")
print()

# Emission theory prediction
print("Emission theory prediction:")
print("  Eyes send out rays -> intensity of SOURCE should not matter.")
print("  Prediction: looking at sun = looking at wall. No pain difference.")
print()

# Intromission theory prediction
print("Intromission theory prediction:")
print("  Light enters the eye -> brighter source = more energy entering.")
ratio = sun_intensity / candle_intensity
print(f"  Sun sends {ratio:.0f}x more light into the eye than a candle.")
print(f"  Prediction: sun causes pain, candle does not.")
print()
print(f"  Reality: sun DOES cause pain. Intromission wins.")
print()

# Observation 2: Afterimages
print("=" * 50)
print("Observation 2: Afterimages")
print()
print("  Stare at a bright red patch, then look at a white wall.")
print("  You see a cyan (blue-green) ghost image.")
print()
print("  Emission theory: no explanation. Why would outgoing rays")
print("  leave a residual image?")
print()
print("  Intromission theory: the bright light overstimulated red")
print("  receptors in the retina. They become less sensitive.")
print("  When you look at white light (all colors), red is suppressed,")
print("  so you see cyan (white minus red).")
print()

# Observation 3: Inverse square law
print("=" * 50)
print("Observation 3: Light gets dimmer with distance")
distances = np.array([1, 2, 3, 5, 10])  # meters
intensities = candle_intensity / distances**2  # inverse square law
print()
print("  If a candle has intensity 15 lux at 1 m:")
for d, I in zip(distances, intensities):
    bar = "#" * int(I * 2)
    print(f"    {d:>2} m: {I:>6.2f} lux  {bar}")
print()
print("  Light follows the inverse square law: I = I0 / d^2")
print("  This only makes sense if light TRAVELS from source to eye.")
print("  Emission theory cannot explain why distant objects look dimmer.")
print()
print("Verdict: All three observations match intromission theory.")
print("Ibn al-Haytham was right. We see because light enters the eye.")`,
      challenge: 'Add a 4th observation: in a pitch-black room, you cannot see anything even with your eyes open. What does each theory predict? Code the comparison.',
      successHint: 'Ibn al-Haytham did not just propose a new theory — he systematically demolished the old one by listing observations it could not explain. This approach — testing a theory against evidence — is the foundation of the scientific method, which he also invented.',
    },
    {
      title: 'The camera obscura — ray tracing through a pinhole',
      concept: `Ibn al-Haytham built a **camera obscura** (Arabic: *al-bayt al-muzlim*, "the dark room") — a dark box with a tiny hole in one wall. Light from outside passes through the hole and forms an **inverted image** on the opposite wall.

This device proved a critical point: **light travels in straight lines**. Each ray from the top of an object passes through the pinhole and hits the bottom of the opposite wall. Each ray from the bottom hits the top. The image is flipped.

The physics of the camera obscura involves geometry:
- **Image size** = object size x (image distance / object distance)
- **Brightness** increases with hole area (bigger hole = more light)
- **Sharpness** decreases with hole area (bigger hole = more blur)

This creates a fundamental trade-off: a smaller pinhole gives a sharper image but a dimmer one. A larger hole gives a brighter image but a blurrier one. This trade-off persists in every modern camera — it is why lenses exist.

📚 *The camera obscura was not just a curiosity. Ibn al-Haytham used it to prove that light from each point on an object travels in every direction. Only the rays that pass through the pinhole contribute to the image. This was the first ray-tracing model in history.*`,
      analogy: 'Imagine a crowd of people trying to walk through a narrow doorway into a dark room. Only a few can pass at a time. The people from the left side of the crowd end up on the right side of the room, and vice versa. The narrower the doorway, the more orderly the arrangement — but fewer people get through. That is the pinhole trade-off.',
      storyConnection: 'Ibn al-Haytham built his camera obscura during a period of house arrest in Cairo. Unable to leave, he turned his room itself into an optical instrument. He observed candle light passing through the pinhole and saw, for the first time, a clear geometric proof that light travels in straight lines from source to eye.',
      checkQuestion: 'If you make the pinhole larger, the image gets brighter but blurrier. Why does blurring happen geometrically?',
      checkAnswer: 'A larger hole allows rays from each point on the object to enter at a wider range of angles. Instead of one ray per point, many rays from the same point hit the wall at slightly different positions, spreading the point into a disc. Each object point becomes a blurred circle rather than a sharp dot. The bigger the hole, the bigger those circles, and the blurrier the image.',
      codeIntro: 'Calculate how image size, brightness, and sharpness change with pinhole diameter.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Camera Obscura: Pinhole Optics ===

# Setup
object_height = 1.0    # meters (a person standing outside)
object_distance = 10.0  # meters from pinhole
box_depth = 0.5         # meters (distance from pinhole to back wall)

# Image size (similar triangles)
image_height = object_height * (box_depth / object_distance)
magnification = box_depth / object_distance

print("=== Camera Obscura Geometry ===")
print(f"Object: {object_height} m tall, {object_distance} m away")
print(f"Box depth: {box_depth} m")
print(f"Image height: {image_height*100:.1f} cm (inverted)")
print(f"Magnification: {magnification:.3f}x")
print()

# Trade-off: pinhole diameter vs sharpness and brightness
diameters = np.linspace(0.1, 10, 200)  # mm

# Brightness proportional to area of pinhole
brightness = np.pi * (diameters / 2)**2  # mm^2
brightness_norm = brightness / brightness.max()

# Blur circle diameter (geometric)
# Each point on the object projects a cone of light through the hole.
# Blur circle on the image wall ~ pinhole diameter (for distant objects)
blur = diameters.copy()  # mm — blur circle matches pinhole diameter
sharpness = 1.0 / blur   # inverse of blur
sharpness_norm = sharpness / sharpness.max()

# Optimal pinhole: diffraction limit (Airy pattern)
wavelength = 550e-6  # mm (green light, 550 nm)
optimal_d = 2 * np.sqrt(wavelength * box_depth * 1000)  # mm
print(f"Optimal pinhole diameter (diffraction limit): {optimal_d:.2f} mm")
print("Smaller than this: diffraction blur dominates.")
print("Larger than this: geometric blur dominates.")
print()

# Plot the trade-off
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Left: brightness vs sharpness
ax1.plot(diameters, brightness_norm, linewidth=2.5, color='#f59e0b',
         label='Brightness')
ax1.plot(diameters, sharpness_norm, linewidth=2.5, color='#3b82f6',
         label='Sharpness')
ax1.axvline(optimal_d, color='#10b981', linestyle='--', linewidth=2,
            label=f'Optimal ({optimal_d:.1f} mm)')
ax1.set_xlabel('Pinhole diameter (mm)', fontsize=12)
ax1.set_ylabel('Relative value', fontsize=12)
ax1.set_title('The Pinhole Trade-off', fontsize=14)
ax1.legend(fontsize=10)
ax1.grid(alpha=0.3)

# Right: image size at different distances
distances = np.linspace(2, 30, 100)
image_sizes = object_height * (box_depth / distances) * 100  # cm

ax2.plot(distances, image_sizes, linewidth=2.5, color='#6366f1')
ax2.set_xlabel('Object distance (m)', fontsize=12)
ax2.set_ylabel('Image height (cm)', fontsize=12)
ax2.set_title('Image Size vs Object Distance', fontsize=14)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("\\nKey insight: there is no free lunch in optics.")
print("More light = more blur. This is why lenses were invented.")`,
      challenge: 'Change box_depth to 1.0 m (a bigger box). How does the image size change? How does the optimal pinhole diameter change? Why?',
      successHint: 'The camera obscura demonstrates every principle of geometric optics in one device: straight-line propagation, image inversion, the brightness-sharpness trade-off, and magnification. Ibn al-Haytham used it to prove his theory — and it evolved directly into the modern camera.',
    },
    {
      title: 'Refraction — Snell\'s law and bending light',
      concept: `Ibn al-Haytham studied what happens when light passes from one medium to another — for example, from air into water or glass. He measured angles carefully and discovered that light **bends** at the boundary. He did not find the exact mathematical law, but his measurements were remarkably accurate.

The full law was later formalized as **Snell's law**:

**n1 sin(theta1) = n2 sin(theta2)**

where:
- **n1** and **n2** are the **refractive indices** of the two media (air = 1.00, water = 1.33, glass = 1.50)
- **theta1** is the angle of incidence (incoming ray vs the surface normal)
- **theta2** is the angle of refraction (bent ray vs the normal)

The higher the refractive index, the slower light travels in that medium, and the more it bends. Light bends **toward** the normal when entering a denser medium (e.g., air to glass) and **away** from the normal when leaving.

There is also a **critical angle**: when light tries to leave a dense medium at a steep angle, it cannot escape — it reflects back entirely. This is **total internal reflection**, the principle behind fiber optics.

📚 *Ibn al-Haytham's refraction experiments used glass spheres and water basins. His data tables are accurate to within 1-2 degrees of modern measurements — extraordinary precision for the 11th century.*`,
      analogy: 'Imagine a car driving from pavement onto sand at an angle. The wheel that hits the sand first slows down while the other wheel is still on pavement, causing the car to turn toward the sand side. Light does the same thing — the side that enters glass first slows down, bending the whole ray.',
      storyConnection: 'Ibn al-Haytham spent years meticulously measuring how light bends through glass and water. He tabulated angles of incidence and refraction, creating the first systematic refraction dataset. While he did not derive the sine relationship, his tables made it possible for later scientists like Snellius to find the law.',
      checkQuestion: 'Light goes from air (n=1.0) into glass (n=1.5) at 30 degrees from the normal. What is the refraction angle? Does the light bend toward or away from the normal?',
      checkAnswer: 'Using Snell\'s law: sin(theta2) = (n1/n2) sin(theta1) = (1.0/1.5) sin(30) = 0.667 x 0.5 = 0.333. theta2 = arcsin(0.333) = 19.5 degrees. The light bends TOWARD the normal (30 -> 19.5) because it enters a denser medium.',
      codeIntro: 'Apply Snell\'s law to calculate bending angles for light entering water and glass.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Snell's Law: n1 sin(θ1) = n2 sin(θ2) ===

# Refractive indices (real values)
n_air = 1.000
n_water = 1.333
n_glass = 1.500
n_diamond = 2.417

media = [
    ("Water",   n_water,   '#3b82f6'),
    ("Glass",   n_glass,   '#10b981'),
    ("Diamond", n_diamond, '#f59e0b'),
]

# Calculate refraction for a range of incidence angles
angles_inc = np.linspace(0, 89, 200)  # degrees
angles_inc_rad = np.radians(angles_inc)

print("=== Snell's Law: Light Bending at Boundaries ===")
print(f"{'Medium':<10} {'n':>6} {'θ_in=30°':>10} {'θ_in=60°':>10}")
print("-" * 40)

for name, n2, color in media:
    sin_out_30 = (n_air / n2) * np.sin(np.radians(30))
    sin_out_60 = (n_air / n2) * np.sin(np.radians(60))
    angle_30 = np.degrees(np.arcsin(sin_out_30))
    angle_60 = np.degrees(np.arcsin(sin_out_60))
    print(f"{name:<10} {n2:>6.3f} {angle_30:>9.1f}° {angle_60:>9.1f}°")

print()

# Critical angle (total internal reflection)
print("=== Critical Angles (light trying to LEAVE the medium) ===")
for name, n2, color in media:
    critical = np.degrees(np.arcsin(n_air / n2))
    print(f"{name}: critical angle = {critical:.1f}°")
    print(f"  Beyond {critical:.1f}°, light reflects back — total internal reflection!")
print()

# Plot refraction angles
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

for name, n2, color in media:
    sin_out = (n_air / n2) * np.sin(angles_inc_rad)
    # Only valid where sin_out <= 1
    valid = sin_out <= 1.0
    angles_out = np.degrees(np.arcsin(sin_out[valid]))

    ax1.plot(angles_inc[valid], angles_out, linewidth=2.5, color=color,
             label=f'{name} (n={n2})')

ax1.plot(angles_inc, angles_inc, '--', color='gray', linewidth=1,
         label='No bending (n=1)')
ax1.set_xlabel('Angle of incidence (degrees)', fontsize=12)
ax1.set_ylabel('Angle of refraction (degrees)', fontsize=12)
ax1.set_title("Snell's Law — Air to Medium", fontsize=14)
ax1.legend(fontsize=10)
ax1.grid(alpha=0.3)

# Plot: light leaving medium (total internal reflection)
for name, n2, color in media:
    sin_out = (n2 / n_air) * np.sin(angles_inc_rad)
    valid = sin_out <= 1.0
    angles_out = np.degrees(np.arcsin(sin_out[valid]))
    critical = np.degrees(np.arcsin(n_air / n2))

    ax2.plot(angles_inc[valid], angles_out, linewidth=2.5, color=color,
             label=f'{name} (crit={critical:.0f}°)')
    ax2.axvline(critical, color=color, linestyle=':', alpha=0.5)

ax2.set_xlabel('Angle of incidence (degrees)', fontsize=12)
ax2.set_ylabel('Angle of refraction (degrees)', fontsize=12)
ax2.set_title('Total Internal Reflection', fontsize=14)
ax2.legend(fontsize=10)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("Higher refractive index = more bending = smaller critical angle.")
print("Diamond sparkles because its critical angle is only 24.4° —")
print("most light bouncing inside gets trapped and exits the top facets.")`,
      challenge: 'Calculate the refraction angle for light going from water (n=1.33) into glass (n=1.50) at 45 degrees. This is NOT air-to-glass. Modify n1 in Snell\'s law.',
      successHint: 'Snell\'s law governs every lens, every fiber optic cable, every camera, and every pair of glasses. Ibn al-Haytham measured these angles a thousand years ago with glass spheres and water bowls, laying the experimental foundation for the law that now runs our optical world.',
    },
    {
      title: 'Atmospheric refraction — seeing the sun after it sets',
      concept: `Here is a strange fact: when you watch the sun touch the horizon, **it has already set**. The physical sun is below the horizon, but you can still see it because the atmosphere bends its light upward.

This happens because Earth's atmosphere is not uniform — it is denser near the ground and thinner higher up. Light from the sun passes through layers of decreasing density, and at each boundary it bends slightly. The cumulative effect curves the light path downward, following the curvature of the Earth.

The amount of bending depends on the **zenith angle** — how far the sun is from directly overhead:
- At the zenith (straight up): nearly zero refraction
- At 45 degrees: about 1 arcminute
- At the horizon (90 degrees): about **34 arcminutes** — more than the sun's diameter!

Since the sun's angular diameter is about 32 arcminutes, when you see the bottom of the sun touching the horizon, the entire disc is geometrically below it. You are seeing a **mirage of the sun**, bent upward by the atmosphere.

Ibn al-Haytham was one of the first to correctly explain atmospheric refraction. He understood that the atmosphere acts as a refracting medium and that celestial objects appear higher than they truly are.

📚 *This same effect makes stars twinkle (atmospheric turbulence causes rapid, random refraction changes) and makes the sun appear oval at sunset (the bottom is refracted more than the top because it passes through thicker atmosphere).*`,
      analogy: 'Imagine looking at a coin at the bottom of a swimming pool. The coin appears to be higher than it really is because light bends when it exits the water. The atmosphere does the same thing to sunlight — Earth\'s air is like a vast, curved pool of water, and the sun is the coin.',
      storyConnection: 'Ibn al-Haytham realized that astronomers could not trust the apparent positions of stars near the horizon. His calculations of atmospheric refraction were the first systematic correction tables for astronomical observations — essential for accurate star catalogues and navigation.',
      checkQuestion: 'Why is the refraction effect strongest at the horizon (34 arcminutes) and nearly zero at the zenith (overhead)?',
      checkAnswer: 'At the zenith, light enters the atmosphere perpendicular to the layers — it passes straight through with minimal bending (like light hitting glass at 0 degrees). At the horizon, light enters at a steep grazing angle, passing through a much thicker slice of atmosphere. More atmosphere means more cumulative bending. The path length through the atmosphere at the horizon is about 38 times longer than at the zenith.',
      codeIntro: 'Calculate how much the atmosphere shifts the apparent position of the sun at different zenith angles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Atmospheric Refraction ===
# How much does the atmosphere shift the apparent position of celestial objects?

# Bennett's empirical formula for atmospheric refraction (arcminutes):
# R = 1 / tan(h + 7.31/(h + 4.4))  where h = apparent altitude in degrees
# This is accurate to ~0.1 arcminutes for h > 0

def atmospheric_refraction(apparent_alt_deg):
    """Calculate atmospheric refraction in arcminutes.
    Uses Bennett's formula (1982)."""
    h = np.clip(apparent_alt_deg, 0.1, 90)
    R = 1.0 / np.tan(np.radians(h + 7.31 / (h + 4.4)))
    return R  # arcminutes

# Calculate refraction at various altitudes
altitudes = np.linspace(0.5, 90, 500)
refraction = atmospheric_refraction(altitudes)

print("=== Atmospheric Refraction Table ===")
print("(How much the atmosphere lifts apparent position)")
print()
print(f"{'Altitude':>10} {'Refraction':>12} {'Notes'}")
print("-" * 50)

key_alts = [0.5, 1, 2, 5, 10, 20, 45, 90]
for alt in key_alts:
    ref = atmospheric_refraction(alt)
    note = ""
    if alt == 0.5:
        note = "<- horizon: sun already set!"
    elif alt == 10:
        note = "<- noticeable shift"
    elif alt == 90:
        note = "<- zenith: no bending"
    print(f"{alt:>8.1f}°  {ref:>8.1f} arcmin  {note}")

print()
sun_diameter = 32  # arcminutes
horizon_ref = atmospheric_refraction(0.5)
print(f"Sun's angular diameter: {sun_diameter} arcminutes")
print(f"Refraction at horizon: {horizon_ref:.1f} arcminutes")
print(f"Ratio: {horizon_ref/sun_diameter:.1f}x the sun's diameter!")
print("When the sun appears to touch the horizon, it is already")
print(f"about {horizon_ref:.0f} arcminutes below it — fully set.")
print()

# Plot refraction vs altitude
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

ax1.plot(altitudes, refraction, linewidth=2.5, color='#f59e0b')
ax1.set_xlabel('Apparent altitude (degrees)', fontsize=12)
ax1.set_ylabel('Refraction (arcminutes)', fontsize=12)
ax1.set_title('Atmospheric Refraction vs Altitude', fontsize=14)
ax1.axhline(sun_diameter, color='#ef4444', linestyle='--', alpha=0.5,
            label=f"Sun's diameter ({sun_diameter}')")
ax1.legend(fontsize=10)
ax1.grid(alpha=0.3)

# Plot: path length through atmosphere
# Approximate: path length ~ 1/cos(zenith angle) for flat atmosphere
# More accurate with curved Earth, but this shows the trend
zenith_angles = np.linspace(0, 85, 200)
path_length = 1.0 / np.cos(np.radians(zenith_angles))  # relative to zenith

ax2.plot(zenith_angles, path_length, linewidth=2.5, color='#6366f1')
ax2.set_xlabel('Zenith angle (degrees)', fontsize=12)
ax2.set_ylabel('Relative path through atmosphere', fontsize=12)
ax2.set_title('Why Horizon Light Bends More', fontsize=14)
ax2.annotate(f'At 85°: {1/np.cos(np.radians(85)):.0f}x longer path',
             xy=(85, 1/np.cos(np.radians(85))),
             xytext=(50, 8), fontsize=10, color='#6366f1',
             arrowprops=dict(arrowstyle='->', color='#6366f1'))
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("Ibn al-Haytham was the first to calculate these corrections.")
print("Every astronomical observation near the horizon must account")
print("for atmospheric refraction — or the star positions will be wrong.")`,
      challenge: 'The moon also appears larger near the horizon (the "moon illusion"). Is this caused by atmospheric refraction? Calculate the refraction difference between the top and bottom of the moon (diameter ~ 31 arcminutes). Does the atmosphere make it look bigger or smaller?',
      successHint: 'Atmospheric refraction is a direct consequence of Snell\'s law applied to the atmosphere\'s density gradient. Ibn al-Haytham connected the physics of glass and water refraction to the entire sky, showing that the same laws govern a laboratory prism and the setting sun.',
    },
    {
      title: 'The scientific method — hypothesis, experiment, conclusion',
      concept: `Ibn al-Haytham did not just discover optical laws — he invented the **method** for discovering laws. Before him, natural philosophy was largely about reasoning from first principles. Aristotle said heavy objects fall faster than light ones, and for 1,400 years, almost nobody tested it.

Ibn al-Haytham's approach was revolutionary:
1. **Observe** — notice something unexplained
2. **Hypothesize** — propose a possible explanation
3. **Design an experiment** — create conditions that will confirm or refute the hypothesis
4. **Collect data** — measure carefully and systematically
5. **Analyze** — look for patterns in the data
6. **Conclude** — accept, reject, or modify the hypothesis
7. **Reproduce** — repeat to make sure the result is not a fluke

His candle experiment is a masterclass in this method. He hypothesized that light travels in straight lines. He placed candles at different positions in front of a pinhole and observed where each light spot appeared on the wall. The spots moved in exactly the pattern predicted by straight-line geometry.

Crucially, he also tested **what should NOT happen** if his theory is wrong. If light did not travel in straight lines, the pinhole image would be scrambled. It was not. Hypothesis confirmed.

📚 *Ibn al-Haytham's Kitab al-Manazir explicitly states that scientists must be skeptical of authorities and trust only systematic experiment. This was written 600 years before Francis Bacon, often credited as the father of the scientific method.*`,
      analogy: 'A detective at a crime scene does not just guess who did it. They collect evidence (fingerprints, witnesses, timelines), form a theory, test it against the facts, and only declare a suspect guilty when all the evidence agrees. Ibn al-Haytham was the first detective of nature — demanding evidence before accepting any theory.',
      storyConnection: 'During his house arrest in Cairo, Ibn al-Haytham had years of uninterrupted time to think and experiment. He wrote in Book of Optics: "The seeker after truth is not one who studies the writings of the ancients and puts his trust in them, but rather the one who suspects his faith in them and questions what he gathers from them."',
      checkQuestion: 'A student claims: "I dropped a heavy ball and a light ball, and the heavy one hit the ground first. Therefore, heavier objects fall faster." Is this good science? What is missing?',
      checkAnswer: 'This is poor science because: (1) No controls — air resistance could explain the difference. Were the balls the same size and shape? (2) No repeated trials — maybe the heavy ball was released a fraction earlier. (3) No precise measurement — "hit first" is subjective. Good science would use balls of different mass but same shape, drop them simultaneously multiple times, and measure fall time precisely. Without controls and repetition, you cannot distinguish between weight effects and air resistance.',
      codeIntro: 'Simulate Ibn al-Haytham\'s candle experiment and see how the scientific method produces evidence.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Ibn al-Haytham's Candle Experiment ===
# Test hypothesis: light travels in straight lines.

# Setup: pinhole at origin, screen at x = 1.0 m
pinhole_x = 0.0
screen_x = 1.0

# Place candles at different positions
candle_positions = np.array([
    [-2.0,  0.5],   # top-left
    [-2.0,  0.0],   # middle-left
    [-2.0, -0.5],   # bottom-left
    [-3.0,  0.3],   # further, slightly up
    [-1.5, -0.2],   # closer, slightly down
])

print("=== Ibn al-Haytham's Candle Experiment ===")
print()
print("Hypothesis: light travels in straight lines.")
print("Prediction: if a candle is above the pinhole, its image")
print("            appears BELOW center on the screen (inverted).")
print()
print("Setup: pinhole at origin, screen at x = 1.0 m")
print()

# If light travels in straight lines, the image position is:
# image_y = -candle_y * (screen_x / |candle_x|)
# (negative because the image is inverted)

print(f"{'Candle #':>8} {'Position':>14} {'Predicted image':>16} {'Inverted?':>10}")
print("-" * 52)

predicted_images = []
for i, (cx, cy) in enumerate(candle_positions):
    image_y = -cy * (screen_x / abs(cx))
    predicted_images.append(image_y)
    inverted = "Yes" if (cy > 0 and image_y < 0) or (cy < 0 and image_y > 0) or cy == 0 else "Center"
    print(f"  {i+1:>5}   ({cx:>4.1f}, {cy:>4.1f})   y = {image_y:>6.3f} m     {inverted:>8}")

print()
print("All images are inverted — consistent with straight-line travel.")
print()

# Now add "noise" — simulate measurement uncertainty
np.random.seed(42)
noise = np.random.normal(0, 0.005, len(predicted_images))
measured_images = np.array(predicted_images) + noise

print("=== Repeated Measurements (with realistic noise) ===")
print(f"{'Candle':>7} {'Predicted':>10} {'Measured':>10} {'Error':>8}")
print("-" * 40)
for i in range(len(predicted_images)):
    err = measured_images[i] - predicted_images[i]
    print(f"  {i+1:>4}   {predicted_images[i]:>8.3f}   {measured_images[i]:>8.3f}   {err:>+6.3f}")

residuals = measured_images - np.array(predicted_images)
rms_error = np.sqrt(np.mean(residuals**2))
print(f"\\nRMS error: {rms_error:.4f} m")
print(f"This is {rms_error*1000:.1f} mm — within measurement precision.")
print("The straight-line hypothesis is NOT refuted by the data.")
print()

# Plot the experiment
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Left: ray diagram
for i, (cx, cy) in enumerate(candle_positions):
    iy = predicted_images[i]
    ax1.plot([cx, 0, screen_x], [cy, 0, iy], '-', linewidth=1.5,
             alpha=0.7, color=plt.cm.Set1(i/5))
    ax1.plot(cx, cy, '*', color=plt.cm.Set1(i/5), markersize=12)
    ax1.plot(screen_x, iy, 'o', color=plt.cm.Set1(i/5), markersize=8)

ax1.axvline(0, color='gray', linewidth=3, label='Pinhole wall')
ax1.axvline(screen_x, color='#334155', linewidth=3, label='Screen')
ax1.set_xlabel('x (meters)', fontsize=12)
ax1.set_ylabel('y (meters)', fontsize=12)
ax1.set_title("Ibn al-Haytham's Candle Experiment", fontsize=14)
ax1.legend(fontsize=9)
ax1.grid(alpha=0.3)

# Right: predicted vs measured
ax2.scatter(predicted_images, measured_images, s=80, color='#6366f1',
            zorder=5, label='Measurements')
line_range = [min(predicted_images)-0.05, max(predicted_images)+0.05]
ax2.plot(line_range, line_range, '--', color='#10b981', linewidth=2,
         label='Perfect agreement')
ax2.set_xlabel('Predicted image position (m)', fontsize=12)
ax2.set_ylabel('Measured image position (m)', fontsize=12)
ax2.set_title('Prediction vs Measurement', fontsize=14)
ax2.legend(fontsize=10)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("Left: rays travel in straight lines through the pinhole.")
print("Right: measured positions match predictions almost perfectly.")
print("Conclusion: the hypothesis is supported. Light travels straight.")`,
      challenge: 'Add a 6th candle that is directly behind another (same angle from the pinhole). The straight-line hypothesis predicts their images will overlap. Add this test to the experiment. Does it pass?',
      successHint: 'You just replicated the logic of the scientific method: state a hypothesis, derive predictions, collect data, and check if the predictions hold. Ibn al-Haytham formalized this process a millennium ago. Every experiment you will ever run — in physics, biology, computer science — follows these same steps.',
    },
    {
      title: 'Lenses — focusing light with curved glass',
      concept: `The camera obscura has a fatal flaw: the pinhole must be tiny for a sharp image, which makes the image extremely dim. Ibn al-Haytham understood this trade-off deeply, and his work on refraction through curved glass surfaces laid the groundwork for the solution: **lenses**.

A lens is a piece of glass with curved surfaces. When parallel light rays hit a **convex lens** (thicker in the middle), they all converge to a single point — the **focal point**. The distance from the lens center to this point is the **focal length** (f).

The **lensmaker's equation** connects the lens shape to its focal length:

**1/f = (n - 1) [1/R1 - 1/R2]**

where:
- **n** is the refractive index of the glass (typically 1.5)
- **R1** is the radius of curvature of the front surface
- **R2** is the radius of curvature of the back surface
- Sign convention: R is positive for a surface that curves away from the light

A lens replaces the pinhole: it gathers light from a **large area** (not just a tiny hole) and focuses it to a sharp image. More light AND more sharpness — the trade-off is broken.

The **thin lens equation** relates object distance (do), image distance (di), and focal length:

**1/f = 1/do + 1/di**

📚 *The evolution from camera obscura to lens camera is a direct line: Ibn al-Haytham's pinhole → reading stones (magnifying lenses, ~1000 CE) → spectacles (1286 CE) → telescopes (1608) → photography (1826) → digital cameras today. Every step was built on the optics Ibn al-Haytham formalized.*`,
      analogy: 'A pinhole is like whispering through a keyhole — only a tiny bit of sound gets through, and it is quiet. A lens is like a satellite dish — it collects sound (or light) from a huge area and focuses it all to one point, making it loud (or bright) and clear.',
      storyConnection: 'Ibn al-Haytham\'s analysis of how curved glass surfaces refract light was the theoretical bridge between the camera obscura and the lens. He showed that each point on a curved surface obeys Snell\'s law independently, and that the right curvature can make all the refracted rays meet at a single point. This insight — geometry plus refraction equals focusing — is the birth of lens design.',
      checkQuestion: 'A convex lens has focal length 10 cm. An object is 30 cm away. Where does the image form? Is it larger or smaller than the object?',
      checkAnswer: 'Using the thin lens equation: 1/10 = 1/30 + 1/di. So 1/di = 1/10 - 1/30 = 3/30 - 1/30 = 2/30 = 1/15. di = 15 cm. The image forms 15 cm behind the lens. Magnification = -di/do = -15/30 = -0.5. The image is half the size of the object and inverted (negative magnification). This is exactly how a camera works.',
      codeIntro: 'Use the lensmaker\'s equation and thin lens equation to design lenses and calculate image formation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Lenses: From Camera Obscura to Modern Camera ===

n_glass = 1.50  # refractive index of typical glass

# Lensmaker's equation: 1/f = (n-1) * (1/R1 - 1/R2)
def focal_length(n, R1, R2):
    """Calculate focal length from lens shape."""
    return 1.0 / ((n - 1) * (1/R1 - 1/R2))

# Thin lens equation: 1/f = 1/do + 1/di
def image_distance(f, do):
    """Calculate image distance from focal length and object distance."""
    return 1.0 / (1/f - 1/do)

# Example: symmetric convex lens (R1 = 20 cm, R2 = -20 cm)
R1 = 20.0   # cm (front surface curves away from light)
R2 = -20.0  # cm (back surface curves toward light)
f = focal_length(n_glass, R1, R2)

print("=== Lensmaker's Equation ===")
print(f"Glass: n = {n_glass}")
print(f"Front radius R1 = {R1} cm, Back radius R2 = {R2} cm")
print(f"Focal length: f = {f:.1f} cm")
print()

# Image formation for objects at various distances
print("=== Thin Lens Equation: Image Formation ===")
print(f"Focal length f = {f:.1f} cm")
print()
print(f"{'Object dist':>12} {'Image dist':>12} {'Magnification':>14} {'Image type'}")
print("-" * 55)

object_distances = [100, 50, 30, 25, 15]
for do in object_distances:
    if abs(do - f) < 0.1:
        print(f"  {do:>8.1f} cm   {'infinity':>10}   {'infinity':>12}   collimated")
        continue
    di = image_distance(f, do)
    mag = -di / do
    img_type = "real, inverted" if di > 0 else "virtual, upright"
    print(f"  {do:>8.1f} cm   {di:>8.1f} cm   {mag:>12.2f}x   {img_type}")

print()

# Compare pinhole vs lens: light gathering
pinhole_diameter = 1.0   # mm
lens_diameter = 50.0      # mm
area_ratio = (lens_diameter / pinhole_diameter) ** 2
print(f"=== Pinhole vs Lens: Light Gathering ===")
print(f"Pinhole area: π({pinhole_diameter/2:.1f})² = {np.pi*(pinhole_diameter/2)**2:.2f} mm²")
print(f"Lens area:    π({lens_diameter/2:.1f})² = {np.pi*(lens_diameter/2)**2:.0f} mm²")
print(f"Lens gathers {area_ratio:.0f}x more light than the pinhole!")
print(f"Same sharpness, {area_ratio:.0f}x brighter. The trade-off is broken.")
print()

# Plot: focal length vs curvature
R_values = np.linspace(5, 100, 200)
f_values = focal_length(n_glass, R_values, -R_values)  # symmetric lens

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

ax1.plot(R_values, f_values, linewidth=2.5, color='#6366f1')
ax1.set_xlabel('Radius of curvature (cm)', fontsize=12)
ax1.set_ylabel('Focal length (cm)', fontsize=12)
ax1.set_title('Flatter Lens = Longer Focal Length', fontsize=14)
ax1.grid(alpha=0.3)

# Plot: image distance vs object distance
obj_dists = np.linspace(f + 1, 200, 300)
img_dists = image_distance(f, obj_dists)
magnifications = np.abs(-img_dists / obj_dists)

ax2.plot(obj_dists, img_dists, linewidth=2.5, color='#3b82f6',
         label='Image distance')
ax2.axhline(f, color='#10b981', linestyle='--', linewidth=1.5,
            label=f'Focal length ({f:.0f} cm)')
ax2.axvline(2*f, color='#f59e0b', linestyle=':', linewidth=1.5,
            label=f'2f = {2*f:.0f} cm (1:1 image)')
ax2.set_xlabel('Object distance (cm)', fontsize=12)
ax2.set_ylabel('Image distance (cm)', fontsize=12)
ax2.set_title('Thin Lens: Where the Image Forms', fontsize=14)
ax2.set_ylim(0, 150)
ax2.legend(fontsize=10)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("Camera obscura → lens → telescope → microscope → camera.")
print("Ibn al-Haytham's optics made all of it possible.")`,
      challenge: 'A smartphone camera has a tiny lens with f = 4 mm. An object is 1 meter (1000 mm) away. Where does the image form? What is the magnification? Why can phone cameras be so small?',
      successHint: 'The lens is the culmination of everything Ibn al-Haytham studied: straight-line propagation (ray tracing), refraction (Snell\'s law at curved surfaces), and the camera obscura (image formation). His work in a Cairo room a thousand years ago is the reason you can take a photo with your phone today.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior optics or coding experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for optics simulations. Click to start.</p>
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
