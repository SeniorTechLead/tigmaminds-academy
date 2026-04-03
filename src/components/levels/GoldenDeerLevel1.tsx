import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GoldenDeerLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is light — electromagnetic waves and the speed of light',
      concept: `In the story of the Golden Deer of Kamakhya, a deer appeared whose coat shone like molten gold, radiating light so brilliant it stunned everyone who saw it. But what actually *is* light? How does a surface "shine"?

Light is an **electromagnetic wave** — a ripple of electric and magnetic fields that travels through space. Unlike sound (which needs air), light travels through empty vacuum. It's the fastest thing in the universe: **299,792,458 meters per second** (roughly 300,000 km/s). At that speed, light from the Sun reaches Earth in about 8 minutes and 20 seconds.

Light has two key properties:
- **Wavelength**: the distance between wave peaks (measured in nanometers, nm). This determines the color we see.
- **Frequency**: how many wave peaks pass a point per second (measured in Hertz, Hz). Higher frequency = shorter wavelength = more energy.

The relationship is simple: **speed = wavelength x frequency**. Since the speed of light is constant, shorter wavelength always means higher frequency.`,
      analogy: 'Imagine dropping a stone into a still pond. Ripples spread outward — those are waves. Now imagine the ripples move at 300,000 km/s and carry energy. That is light. The distance between ripple peaks is the wavelength; how fast the peaks arrive is the frequency.',
      storyConnection: 'The golden deer\'s coat "shone like the sun." Sunlight is a mixture of all visible wavelengths — the deer\'s fur reflected specific wavelengths (around 570-590 nm) that our eyes perceive as gold. The brilliance that captivated everyone was electromagnetic radiation bouncing off a surface.',
      checkQuestion: 'If light travels at 300,000 km/s and the Moon is about 384,400 km away, how long does it take for light to travel from the Earth to the Moon?',
      checkAnswer: 'About 1.28 seconds. Distance / speed = 384,400 / 300,000 = 1.28 seconds. When astronauts on the Moon talked to Houston, there was a noticeable delay — that\'s the speed of light at work. It\'s fast, but not instant.',
      codeIntro: 'Visualize a light wave and see how wavelength and frequency relate.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Speed of light
c = 3e8  # m/s

# Create three waves with different wavelengths
wavelengths = [700e-9, 550e-9, 450e-9]  # red, green, blue in meters
colors = ['#ef4444', '#22c55e', '#3b82f6']
labels = ['Red (700 nm)', 'Green (550 nm)', 'Blue (450 nm)']

fig, axes = plt.subplots(3, 1, figsize=(10, 7), sharex=True)
fig.patch.set_facecolor('#1f2937')

# We'll plot a few cycles of each wave
for i, (wl, color, label) in enumerate(zip(wavelengths, colors, labels)):
    freq = c / wl
    # Plot over a spatial range showing ~4 wavelengths
    x = np.linspace(0, 4 * wl * 1e9, 1000)  # in nm for readability
    y = np.sin(2 * np.pi * x / (wl * 1e9))

    axes[i].set_facecolor('#111827')
    axes[i].plot(x, y, color=color, linewidth=2)
    axes[i].fill_between(x, y, alpha=0.15, color=color)
    axes[i].set_ylabel('Amplitude', color='white', fontsize=9)
    axes[i].set_title(f'{label} — frequency: {freq:.2e} Hz', color=color, fontsize=11)
    axes[i].tick_params(colors='gray')
    axes[i].set_ylim(-1.3, 1.3)
    axes[i].axhline(0, color='gray', linewidth=0.5, linestyle='--')

    # Mark one wavelength
    axes[i].annotate('', xy=(wl * 1e9, 1.1), xytext=(0, 1.1),
                     arrowprops=dict(arrowstyle='<->', color='white', lw=1.5))
    axes[i].text(wl * 1e9 / 2, 1.2, f'{wl*1e9:.0f} nm', color='white',
                 ha='center', fontsize=9)

axes[2].set_xlabel('Distance (nm)', color='white')
plt.tight_layout()
plt.show()

print("Key relationship: speed = wavelength x frequency")
print(f"Speed of light: {c:.2e} m/s")
print()
for wl, label in zip(wavelengths, labels):
    freq = c / wl
    print(f"  {label}: wavelength = {wl*1e9:.0f} nm, frequency = {freq:.2e} Hz")
print()
print("Shorter wavelength = higher frequency = more energy")
print("Blue light carries more energy than red light.")`,
      challenge: 'Add a fourth wave for ultraviolet light (wavelength = 350 nm). What do you notice about its frequency compared to visible light? UV has enough energy to damage skin cells — that is why sunscreen matters.',
      successHint: 'Light is a wave, and its wavelength determines everything: color, energy, and how it interacts with matter. The golden deer\'s coat reflected a specific slice of these wavelengths — and your eyes decoded them as "gold."',
    },
    {
      title: 'Reflection — how mirrors and shiny surfaces work',
      concept: `The golden deer\'s coat shone because it **reflected** light. Reflection is the simplest thing light does: it bounces off a surface. The **law of reflection** states that the angle of incidence (incoming light) equals the angle of reflection (outgoing light), both measured from the surface normal (the perpendicular line).

There are two types of reflection:
- **Specular reflection**: smooth surfaces (mirrors, polished metal, still water) reflect light in a single direction. This creates clear images — you can see yourself in a mirror because light rays bounce off in an orderly way.
- **Diffuse reflection**: rough surfaces (paper, cloth, matte paint, deer fur) scatter light in many directions. You can see the surface from any angle, but there\'s no clear image. Most objects around you are visible because of diffuse reflection.

The golden deer\'s coat would have had a mix: the smooth, fine hairs created partial specular reflection (the "shine"), while the overall texture produced diffuse reflection (visible from all angles). Gold-colored surfaces reflect wavelengths around 570-590 nm strongly and absorb shorter wavelengths — that is what makes them look golden.`,
      analogy: 'Throw a ball at a smooth wall and it bounces back predictably (specular). Throw it at a pile of rocks and it flies off in a random direction (diffuse). Light does the same thing. A mirror is the smooth wall; a piece of paper is the rock pile.',
      storyConnection: 'The deer\'s coat "shone like the sun" because the fine golden hairs created specular highlights — concentrated reflections of sunlight. Every time the deer moved, the angle changed, sending flashes of reflected light in new directions. That shimmer is the law of reflection in motion.',
      checkQuestion: 'If you shine a flashlight at a mirror at a 30-degree angle from the surface normal, at what angle does the reflected beam leave?',
      checkAnswer: '30 degrees from the normal, on the opposite side. The law of reflection is absolute: angle in = angle out. This is why you can aim a laser pointer at a mirror and predict exactly where the reflected beam will land. Billiards works the same way — the "angle of incidence" off a cushion equals the "angle of reflection."',
      codeIntro: 'Simulate light rays reflecting off a surface and compare specular vs. diffuse reflection.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# --- Specular Reflection (Mirror) ---
ax1.set_facecolor('#111827')
ax1.set_xlim(-3, 3)
ax1.set_ylim(-0.5, 3.5)
ax1.set_aspect('equal')

# Draw mirror surface
ax1.plot([-2.5, 2.5], [0, 0], color='#94a3b8', linewidth=3)
ax1.text(0, -0.3, 'Mirror surface', color='#94a3b8', ha='center', fontsize=9)

# Draw normal
ax1.plot([0, 0], [0, 3], color='gray', linewidth=1, linestyle='--')
ax1.text(0.15, 2.8, 'Normal', color='gray', fontsize=8)

# Incident and reflected rays (45 degrees)
angles_deg = [20, 35, 50]
colors = ['#f59e0b', '#22c55e', '#3b82f6']

for angle_deg, color in zip(angles_deg, colors):
    angle = np.radians(angle_deg)
    # Incident ray (coming from upper left)
    x_in = -3 * np.sin(angle)
    y_in = 3 * np.cos(angle)
    ax1.annotate('', xy=(0, 0), xytext=(x_in, y_in),
                 arrowprops=dict(arrowstyle='->', color=color, lw=2))

    # Reflected ray (going upper right, same angle)
    x_out = 3 * np.sin(angle)
    y_out = 3 * np.cos(angle)
    ax1.annotate('', xy=(x_out, y_out), xytext=(0, 0),
                 arrowprops=dict(arrowstyle='->', color=color, lw=2))

    ax1.text(x_in * 0.6, y_in * 0.6 + 0.2, f'{angle_deg}deg',
             color=color, fontsize=8, ha='center')

ax1.set_title('Specular Reflection (Mirror)', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# --- Diffuse Reflection (Rough surface) ---
ax2.set_facecolor('#111827')
ax2.set_xlim(-3, 3)
ax2.set_ylim(-0.5, 3.5)
ax2.set_aspect('equal')

# Draw rough surface
x_surface = np.linspace(-2.5, 2.5, 100)
y_surface = 0.1 * np.sin(15 * x_surface) + 0.05 * np.sin(30 * x_surface)
ax2.plot(x_surface, y_surface, color='#94a3b8', linewidth=2)
ax2.text(0, -0.3, 'Rough surface (deer fur)', color='#94a3b8', ha='center', fontsize=9)

# Single incident ray
ax2.annotate('', xy=(0, 0), xytext=(-1.5, 3),
             arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=2.5))
ax2.text(-1.2, 2.5, 'Incoming\\nlight', color='#f59e0b', fontsize=9)

# Multiple scattered reflected rays
np.random.seed(42)
n_scattered = 8
for i in range(n_scattered):
    angle = np.radians(np.random.uniform(10, 170))
    length = np.random.uniform(1.5, 2.5)
    x_end = length * np.cos(angle)
    y_end = length * np.sin(angle)
    ax2.annotate('', xy=(x_end, abs(y_end)), xytext=(0, 0),
                 arrowprops=dict(arrowstyle='->', color='#22c55e', lw=1.5, alpha=0.7))

ax2.set_title('Diffuse Reflection (Rough Surface)', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Law of Reflection: angle_in = angle_out")
print()
print("Specular (mirror): all rays reflect at the same angle")
print("  -> creates a clear image")
print()
print("Diffuse (rough): rays scatter in all directions")
print("  -> no image, but visible from every angle")
print()
print("The golden deer's coat: fine hairs create BOTH types")
print("  -> specular highlights (the 'shine') + diffuse glow")`,
      challenge: 'A periscope uses two mirrors at 45 degrees to let you see over walls. Draw two mirrors and trace a light ray bouncing from one to the other. What is the total angle the light turns?',
      successHint: 'Reflection is the reason you can see anything that is not a light source. Every object you see is reflecting light into your eyes. The golden deer was spectacular because its coat was optimized for reflection — like a biological mirror.',
    },
    {
      title: 'Refraction — how light bends through water',
      concept: `In the story, the golden deer\'s eyes "sparkled like river reflections." When you look into a river, objects beneath the surface appear shifted or distorted. This is **refraction** — light bending as it passes from one material to another.

Light travels at different speeds in different materials:
- In vacuum: 299,792,458 m/s (the maximum)
- In air: 299,702,547 m/s (almost the same)
- In water: 225,000,000 m/s (about 75% of vacuum speed)
- In glass: ~200,000,000 m/s (about 67%)
- In diamond: ~124,000,000 m/s (about 41%)

The ratio of light\'s speed in vacuum to its speed in a material is called the **refractive index** (n). Water has n = 1.33, glass has n = 1.5, diamond has n = 2.42.

**Snell\'s Law** describes exactly how much light bends: **n1 * sin(angle1) = n2 * sin(angle2)**. When light goes from a less dense medium (air) to a more dense medium (water), it bends *toward* the normal. When it exits, it bends *away* from the normal. This is why a stick in water looks "broken" at the surface.`,
      analogy: 'Imagine a line of marching soldiers moving from pavement onto sand at an angle. The soldiers who hit the sand first slow down, while the others are still on pavement going fast. The line pivots — the whole formation changes direction. That is exactly how a light wavefront bends at a boundary.',
      storyConnection: 'The deer stood by a river, its golden reflection shimmering in the water. That shimmering was refraction — light from the deer entering the water, slowing down, bending, and bouncing back to your eyes at slightly shifted angles. The "sparkle like river reflections" is Snell\'s Law in action.',
      checkQuestion: 'A fish in a pond appears to be at a shallower depth than it actually is. If the fish looks like it is 1 meter deep, approximately how deep is it really? (Water\'s refractive index is 1.33.)',
      checkAnswer: 'About 1.33 meters deep. The apparent depth is reduced by the refractive index: real depth = apparent depth x n. So 1.0 x 1.33 = 1.33 meters. This is why spearfishing is hard — you have to aim below where the fish appears to be.',
      codeIntro: 'Visualize Snell\'s Law: a light ray bending as it enters water from air.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def snells_law(n1, n2, theta1_deg):
    """Calculate refracted angle using Snell's law."""
    theta1 = np.radians(theta1_deg)
    sin_theta2 = n1 * np.sin(theta1) / n2
    if abs(sin_theta2) > 1:
        return None  # total internal reflection
    return np.degrees(np.arcsin(sin_theta2))

# Refractive indices
n_air = 1.00
n_water = 1.33
n_glass = 1.50
n_diamond = 2.42

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# --- Left: ray diagram showing refraction ---
ax1.set_facecolor('#111827')
ax1.set_xlim(-3, 3)
ax1.set_ylim(-3, 3)
ax1.set_aspect('equal')

# Draw boundary (air above, water below)
ax1.axhline(0, color='#38bdf8', linewidth=2)
ax1.fill_between([-3, 3], -3, 0, color='#0c4a6e', alpha=0.3)
ax1.text(-2.5, 2.5, 'AIR (n = 1.00)', color='white', fontsize=10)
ax1.text(-2.5, -2.5, 'WATER (n = 1.33)', color='#38bdf8', fontsize=10)

# Draw normal
ax1.plot([0, 0], [-2.5, 2.5], color='gray', linewidth=1, linestyle='--')
ax1.text(0.1, 2.3, 'Normal', color='gray', fontsize=8)

# Incident ray at 45 degrees
theta1 = 45
theta2 = snells_law(n_air, n_water, theta1)
length = 2.5

# Incident ray
x_in = -length * np.sin(np.radians(theta1))
y_in = length * np.cos(np.radians(theta1))
ax1.annotate('', xy=(0, 0), xytext=(x_in, y_in),
             arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=2.5))

# Refracted ray
x_out = length * np.sin(np.radians(theta2))
y_out = -length * np.cos(np.radians(theta2))
ax1.annotate('', xy=(x_out, y_out), xytext=(0, 0),
             arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=2.5))

# Angle arcs
arc1 = np.linspace(np.radians(90), np.radians(90 + theta1), 30)
ax1.plot(0.8 * np.cos(arc1), 0.8 * np.sin(arc1), color='#ef4444', linewidth=2)
ax1.text(-0.7, 1.0, f'{theta1}deg', color='#ef4444', fontsize=10)

arc2 = np.linspace(np.radians(270), np.radians(270 + theta2), 30)
ax1.plot(0.8 * np.cos(arc2), 0.8 * np.sin(arc2), color='#22c55e', linewidth=2)
ax1.text(0.3, -1.0, f'{theta2:.1f}deg', color='#22c55e', fontsize=10)

ax1.set_title("Snell's Law: Air to Water", color='white', fontsize=12)
ax1.tick_params(colors='gray')

# --- Right: refracted angle vs incident angle for different materials ---
ax2.set_facecolor('#111827')

incident_angles = np.linspace(0, 85, 100)
materials = [
    ('Water (n=1.33)', n_water, '#38bdf8'),
    ('Glass (n=1.50)', n_glass, '#22c55e'),
    ('Diamond (n=2.42)', n_diamond, '#a855f7'),
]

for label, n, color in materials:
    refracted = []
    for theta in incident_angles:
        r = snells_law(n_air, n, theta)
        refracted.append(r if r is not None else np.nan)
    ax2.plot(incident_angles, refracted, color=color, linewidth=2, label=label)

# No refraction line (air to air)
ax2.plot(incident_angles, incident_angles, color='gray', linewidth=1,
         linestyle='--', label='No refraction')

ax2.set_xlabel('Incident angle (degrees)', color='white')
ax2.set_ylabel('Refracted angle (degrees)', color='white')
ax2.set_title('Refraction in Different Materials', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)")
print()
print(f"Light entering water at {theta1} degrees:")
print(f"  Refracted angle: {theta2:.1f} degrees (bends toward normal)")
print()
for label, n, _ in materials:
    r = snells_law(n_air, n, 45)
    print(f"  {label}: 45 deg -> {r:.1f} deg")
print()
print("Higher refractive index = more bending.")
print("Diamond bends light the most — that's why it sparkles so much.")`,
      challenge: 'What happens when light goes from water into air (n_water to n_air) at a steep angle? At some critical angle, the refracted angle reaches 90 degrees and light cannot escape — this is called total internal reflection. Calculate the critical angle for water.',
      successHint: 'Refraction explains why pools look shallower than they are, why diamonds sparkle, why lenses focus light, and why the golden deer\'s reflection danced in the river. One simple law — Snell\'s — governs it all.',
    },
    {
      title: 'Color and wavelengths — why gold looks gold',
      concept: `The golden deer\'s coat wasn\'t just "shiny" — it was specifically **gold-colored**. Color is not a property of objects themselves; it is a property of the light they reflect. An object looks gold because it absorbs certain wavelengths and reflects others.

Visible light spans wavelengths from about 380 nm (violet) to 700 nm (red):
- **Violet**: 380-450 nm
- **Blue**: 450-495 nm
- **Green**: 495-570 nm
- **Yellow**: 570-590 nm
- **Orange**: 590-620 nm
- **Red**: 620-700 nm

**Gold** is a specific color — it reflects strongly in the yellow-orange range (570-600 nm) while also reflecting some red and green. The result is a warm, rich tone. Real metallic gold does this because of how its electrons interact with light: gold atoms absorb blue/violet wavelengths and reflect everything else, creating the characteristic golden hue.

Our eyes have three types of **cone cells**: red-sensitive (L), green-sensitive (M), and blue-sensitive (S). The brain combines the signals from all three to produce the color we perceive. Gold activates the L and M cones strongly while activating S cones weakly — which the brain interprets as "warm, golden yellow."`,
      analogy: 'Imagine sunlight as a choir singing all notes simultaneously (white light). A gold surface is like a wall that absorbs the high notes (blue/violet) and bounces back the low and middle notes (red/yellow/green). What you hear reflected back is the "sound of gold." A red surface absorbs everything except the low notes.',
      storyConnection: 'The golden deer\'s coat reflected wavelengths around 570-600 nm while absorbing shorter wavelengths. If you could measure the light bouncing off its fur with a spectrometer, you would see a peak in the yellow-orange range and a dip in the blue-violet range. The "golden" appearance was physics, not magic.',
      checkQuestion: 'If you illuminate a gold-colored object with pure blue light (450 nm), what color will it appear?',
      checkAnswer: 'Very dark or black. The object looks gold in white light because it reflects yellow-orange wavelengths and absorbs blue. Under pure blue light, there are no yellow-orange wavelengths to reflect — the object absorbs the blue and reflects almost nothing. This is why colored objects look strange under colored lights.',
      codeIntro: 'Plot the visible light spectrum and show what wavelengths a gold surface reflects.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create the visible spectrum
wavelengths = np.linspace(380, 700, 1000)

# Convert wavelength to approximate RGB
def wavelength_to_rgb(wl):
    """Convert wavelength (nm) to RGB values (0-1)."""
    if 380 <= wl < 440:
        r = -(wl - 440) / (440 - 380)
        g = 0.0
        b = 1.0
    elif 440 <= wl < 490:
        r = 0.0
        g = (wl - 440) / (490 - 440)
        b = 1.0
    elif 490 <= wl < 510:
        r = 0.0
        g = 1.0
        b = -(wl - 510) / (510 - 490)
    elif 510 <= wl < 580:
        r = (wl - 510) / (580 - 510)
        g = 1.0
        b = 0.0
    elif 580 <= wl < 645:
        r = 1.0
        g = -(wl - 645) / (645 - 580)
        b = 0.0
    elif 645 <= wl <= 700:
        r = 1.0
        g = 0.0
        b = 0.0
    else:
        r = g = b = 0.0

    # Intensity drops at the edges
    if 380 <= wl < 420:
        factor = 0.3 + 0.7 * (wl - 380) / (420 - 380)
    elif 645 < wl <= 700:
        factor = 0.3 + 0.7 * (700 - wl) / (700 - 645)
    else:
        factor = 1.0

    return (r * factor, g * factor, b * factor)

# Gold reflectance spectrum (approximate)
# Gold absorbs blue/violet, reflects yellow-red
gold_reflectance = 1 / (1 + np.exp(-0.05 * (wavelengths - 500)))

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7))
fig.patch.set_facecolor('#1f2937')

# --- Top: visible spectrum ---
ax1.set_facecolor('#111827')
for i in range(len(wavelengths) - 1):
    color = wavelength_to_rgb(wavelengths[i])
    ax1.axvspan(wavelengths[i], wavelengths[i+1], color=color, alpha=0.9)

ax1.set_xlim(380, 700)
ax1.set_ylim(0, 1)
ax1.set_ylabel('Intensity', color='white')
ax1.set_title('The Visible Light Spectrum', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Label regions
regions = [('Violet', 410, '#8b5cf6'), ('Blue', 472, '#3b82f6'),
           ('Green', 532, '#22c55e'), ('Yellow', 580, '#eab308'),
           ('Orange', 605, '#f97316'), ('Red', 660, '#ef4444')]
for name, pos, color in regions:
    ax1.text(pos, 0.5, name, color='white', fontsize=8, ha='center',
             fontweight='bold', rotation=90, va='center')

# --- Bottom: gold reflectance ---
ax2.set_facecolor('#111827')
ax2.plot(wavelengths, gold_reflectance * 100, color='#f59e0b', linewidth=2.5)
ax2.fill_between(wavelengths, gold_reflectance * 100, alpha=0.2, color='#f59e0b')

# Color the area under curve with spectrum colors
for i in range(len(wavelengths) - 1):
    color = wavelength_to_rgb(wavelengths[i])
    ax2.fill_between(wavelengths[i:i+2], 0, gold_reflectance[i:i+2] * 100,
                     color=color, alpha=0.4)

ax2.set_xlabel('Wavelength (nm)', color='white')
ax2.set_ylabel('Reflectance (%)', color='white')
ax2.set_title('Gold Surface Reflectance Spectrum', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.set_xlim(380, 700)
ax2.set_ylim(0, 105)

# Annotate
ax2.annotate('Absorbs blue/violet\\n(low reflectance)', xy=(430, 15),
             xytext=(420, 60), color='#38bdf8', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#38bdf8'))
ax2.annotate('Reflects yellow-red\\n(high reflectance)', xy=(600, 95),
             xytext=(520, 40), color='#f59e0b', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.show()

print("Why gold looks gold:")
print("  - Absorbs blue/violet light (wavelengths < 500 nm)")
print("  - Reflects yellow, orange, and red (wavelengths > 500 nm)")
print("  - The mix of reflected wavelengths = 'gold'")
print()
print("Human color perception:")
print("  L cones (red-sensitive): strongly activated")
print("  M cones (green-sensitive): moderately activated")
print("  S cones (blue-sensitive): weakly activated")
print("  Brain interpretation: warm golden yellow")`,
      challenge: 'Silver reflects all visible wavelengths roughly equally — that is why it looks "white metallic." Modify the reflectance curve to be flat at 90% across all wavelengths and see what that looks like compared to gold.',
      successHint: 'Color is not a thing — it is a perception. Objects do not "have" color; they reflect specific wavelengths, and your brain constructs color from the pattern of cone activation. The golden deer was golden because of electron physics in its fur pigments.',
    },
    {
      title: 'Mixing light — RGB color model, additive vs. subtractive',
      concept: `The golden deer\'s coat appeared golden because of the specific mix of wavelengths it reflected. But how do screens display gold without using actual gold? They use the **RGB color model** — mixing just three colors of light: **Red, Green, and Blue**.

**Additive color mixing** (light):
- Red + Green = Yellow
- Red + Blue = Magenta
- Green + Blue = Cyan
- Red + Green + Blue = White
- No light = Black

This is "additive" because adding more light makes things brighter. Your phone, TV, and computer screen all use tiny red, green, and blue LEDs (or sub-pixels) to create every color you see. Gold on a screen is roughly R=255, G=215, B=0.

**Subtractive color mixing** (pigments/paint/ink):
- Cyan + Magenta = Blue
- Cyan + Yellow = Green
- Magenta + Yellow = Red
- Cyan + Magenta + Yellow = Black (in theory; in practice, dark brown — which is why printers add a separate Black)

This is "subtractive" because each pigment absorbs (subtracts) certain wavelengths. Mix more pigments, absorb more light, get darker.`,
      analogy: 'Additive mixing (light) is like adding colored spotlights on a stage — more lights mean brighter, eventually white. Subtractive mixing (paint) is like adding filters to a window — more filters mean darker, eventually black. They are opposite processes that both create the full spectrum of colors.',
      storyConnection: 'If you wanted to paint the golden deer, you would mix yellow and orange paint (subtractive mixing). If you wanted to show the golden deer on a screen, you would set pixels to high red, high green, zero blue (additive mixing). Same golden color — two completely different physics.',
      checkQuestion: 'Why does mixing all paint colors together make a muddy brown/black, while mixing all light colors together makes white?',
      checkAnswer: 'Paint works by subtraction — each color absorbs certain wavelengths. Mix all paints, and nearly every wavelength gets absorbed, leaving almost no reflected light (dark). Light works by addition — each color adds wavelengths. Mix all lights, and every wavelength is present, which your brain sees as white.',
      codeIntro: 'Visualize additive RGB color mixing and show how to make gold on a screen.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# --- Top left: RGB circles showing additive mixing ---
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.set_xlim(-2, 2)
ax1.set_ylim(-1.5, 2)
ax1.set_aspect('equal')
ax1.set_title('Additive Color Mixing (Light)', color='white', fontsize=11)

# Draw overlapping circles
theta = np.linspace(0, 2*np.pi, 100)
r = 0.9
centers = [(0, 0.5), (-0.6, -0.3), (0.6, -0.3)]
colors_rgb = [(1, 0, 0, 0.5), (0, 1, 0, 0.5), (0, 0, 1, 0.5)]
labels_rgb = ['Red', 'Green', 'Blue']

for (cx, cy), color, label in zip(centers, colors_rgb, labels_rgb):
    circle = plt.Circle((cx, cy), r, color=color[:3], alpha=0.4)
    ax1.add_patch(circle)
    ax1.text(cx + (cx - 0) * 0.6, cy + (cy - 0.07) * 0.6, label,
             color='white', ha='center', fontsize=9, fontweight='bold')

# Label overlaps
ax1.text(0, 1.3, 'R+G+B = White', color='white', ha='center', fontsize=8)
ax1.text(-0.3, 0.9, 'Yellow', color='#eab308', fontsize=7, ha='center')
ax1.text(0.3, 0.9, 'Yellow', color='#eab308', fontsize=7, ha='center')
ax1.tick_params(colors='gray', labelbottom=False, labelleft=False)

# --- Top right: gold color breakdown ---
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')

# Gold in RGB: (255, 215, 0)
gold_r, gold_g, gold_b = 255, 215, 0
channels = ['Red', 'Green', 'Blue']
values = [gold_r, gold_g, gold_b]
bar_colors = ['#ef4444', '#22c55e', '#3b82f6']

bars = ax2.bar(channels, values, color=bar_colors)
ax2.set_ylim(0, 280)
ax2.set_title('Gold Color: RGB(255, 215, 0)', color='#f59e0b', fontsize=11)
ax2.set_ylabel('Value (0-255)', color='white')
ax2.tick_params(colors='gray')

for bar, val in zip(bars, values):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,
             str(val), ha='center', color='white', fontsize=12, fontweight='bold')

# Draw gold swatch
ax2.axhspan(250, 270, xmin=0.1, xmax=0.9,
            color=(gold_r/255, gold_g/255, gold_b/255))

# --- Bottom left: spectrum of common colors ---
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')

color_data = [
    ('Gold', (255, 215, 0)),
    ('Orange', (255, 165, 0)),
    ('Red', (255, 0, 0)),
    ('Green', (0, 255, 0)),
    ('Blue', (0, 0, 255)),
    ('White', (255, 255, 255)),
    ('Cyan', (0, 255, 255)),
    ('Magenta', (255, 0, 255)),
    ('Yellow', (255, 255, 0)),
]

y_positions = range(len(color_data))
for y, (name, (r, g, b)) in zip(y_positions, color_data):
    ax3.barh(y, r, height=0.6, color='#ef4444', alpha=0.6, left=0)
    ax3.barh(y, g, height=0.6, color='#22c55e', alpha=0.6, left=r)
    ax3.barh(y, b, height=0.6, color='#3b82f6', alpha=0.6, left=r+g)

    # Color swatch
    ax3.barh(y, 30, height=0.6, color=(r/255, g/255, b/255), left=780)

ax3.set_yticks(list(y_positions))
ax3.set_yticklabels([c[0] for c in color_data])
ax3.set_xlabel('Stacked R + G + B values', color='white')
ax3.set_title('RGB Composition of Colors', color='white', fontsize=11)
ax3.tick_params(colors='gray')

# --- Bottom right: additive mixing demo ---
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')

mix_results = [
    ('R + G', (1, 1, 0)),
    ('R + B', (1, 0, 1)),
    ('G + B', (0, 1, 1)),
    ('R + G + B', (1, 1, 1)),
    ('None', (0, 0, 0)),
]

for i, (label, color) in enumerate(mix_results):
    rect = plt.Rectangle((i * 1.2, 0), 1, 1, facecolor=color,
                         edgecolor='gray', linewidth=1)
    ax4.add_patch(rect)
    ax4.text(i * 1.2 + 0.5, -0.2, label, color='white', ha='center', fontsize=8)
    result_name = {(1,1,0): 'Yellow', (1,0,1): 'Magenta', (0,1,1): 'Cyan',
                   (1,1,1): 'White', (0,0,0): 'Black'}
    ax4.text(i * 1.2 + 0.5, 0.5, result_name[color], color='black' if sum(color) > 1.5 else 'white',
             ha='center', fontsize=9, fontweight='bold')

ax4.set_xlim(-0.2, 6.2)
ax4.set_ylim(-0.5, 1.5)
ax4.set_title('Additive Mixing Results', color='white', fontsize=11)
ax4.tick_params(colors='gray', labelbottom=False, labelleft=False)
ax4.set_aspect('equal')

plt.tight_layout()
plt.show()

print("Additive mixing (light/screens): more light = brighter")
print("  R + G = Yellow   |   R + B = Magenta   |   G + B = Cyan")
print("  R + G + B = White")
print()
print("Gold on a screen: RGB(255, 215, 0)")
print("  Full red, most green, no blue")
print("  The warmth comes from the red; the brightness from the green")
print()
print("Subtractive mixing (paint/ink): more pigment = darker")
print("  C + M = Blue   |   C + Y = Green   |   M + Y = Red")
print("  C + M + Y = Black (ideally)")`,
      challenge: 'Explore the range of "metallic gold" shades by varying the green channel from 150 to 255 while keeping R=255 and B=0. Plot all the shades. Which green value looks most like real gold to you?',
      successHint: 'Every image on every screen you have ever seen was built from just three colors mixed additively. The golden deer on your screen right now is millions of tiny red, green, and blue lights — no gold anywhere. Your brain does the mixing.',
    },
    {
      title: 'The electromagnetic spectrum — visible light is just a tiny slice',
      concept: `Everything you have learned so far — reflection, refraction, color — applies to visible light. But visible light is only a tiny fraction of the **electromagnetic (EM) spectrum**. The full spectrum spans wavelengths from picometers (gamma rays) to kilometers (radio waves):

- **Gamma rays** (< 0.01 nm): most energetic, used in cancer treatment, emitted by nuclear reactions
- **X-rays** (0.01 - 10 nm): penetrate soft tissue, used for medical imaging
- **Ultraviolet** (10 - 380 nm): causes sunburns, used for sterilization
- **Visible light** (380 - 700 nm): the only part our eyes detect
- **Infrared** (700 nm - 1 mm): heat radiation, used in remote controls and thermal cameras
- **Microwaves** (1 mm - 1 m): used for cooking and Wi-Fi
- **Radio waves** (> 1 m): used for FM/AM radio, TV, cell phones

All of these are the same fundamental thing — electromagnetic waves. They differ only in wavelength (and therefore frequency and energy). The shorter the wavelength, the higher the energy. Gamma rays can shatter molecules; radio waves pass harmlessly through your body.

The visible spectrum (380-700 nm) is an incredibly narrow band — like one octave on a piano that stretches for miles. Our eyes evolved to detect this band because it is the range where the Sun emits the most light and Earth\'s atmosphere is most transparent.`,
      analogy: 'The EM spectrum is like a piano keyboard that stretches from here to the Moon. Visible light is a single key in the middle. We built our entire visual experience — art, cinema, golden deer — on that one key. Radio, X-rays, and gamma rays are all the other keys we cannot hear but can build instruments (antennas, detectors) to detect.',
      storyConnection: 'The golden deer shone in visible light — the narrow band our eyes can see. But if you had infrared vision, you would see the deer\'s body heat glowing. With ultraviolet vision (like a bee), the deer\'s coat would look completely different — many flowers and animals have UV patterns invisible to us. The "golden" deer is only golden in our narrow slice of reality.',
      checkQuestion: 'Your TV remote uses infrared light. You can\'t see it, but your phone camera can (try it!). Why can a camera detect infrared when your eyes cannot?',
      checkAnswer: 'Camera sensors (CCD/CMOS) are made of silicon, which responds to a wider range of wavelengths than human cone cells. Silicon can detect near-infrared (~700-1100 nm) that our cones cannot. Camera manufacturers often add IR-blocking filters, but cheap cameras and phone front cameras may let some through — which is why you can see a faint glow from a remote through your phone.',
      codeIntro: 'Plot the full electromagnetic spectrum and show where visible light sits.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7))
fig.patch.set_facecolor('#1f2937')

# --- Top: full EM spectrum (log scale) ---
ax1.set_facecolor('#111827')

# Define regions (wavelength in meters, log scale)
regions = [
    ('Gamma\\nrays', 1e-13, 1e-11, '#8b5cf6'),
    ('X-rays', 1e-11, 1e-8, '#6366f1'),
    ('UV', 1e-8, 3.8e-7, '#a78bfa'),
    ('Visible', 3.8e-7, 7e-7, '#f59e0b'),
    ('Infrared', 7e-7, 1e-3, '#ef4444'),
    ('Micro-\\nwaves', 1e-3, 1, '#f97316'),
    ('Radio\\nwaves', 1, 1e5, '#22c55e'),
]

for name, wl_min, wl_max, color in regions:
    ax1.axvspan(np.log10(wl_min), np.log10(wl_max), color=color, alpha=0.4)
    mid = (np.log10(wl_min) + np.log10(wl_max)) / 2
    ax1.text(mid, 0.5, name, color='white', ha='center', va='center',
             fontsize=9, fontweight='bold')

# Highlight visible
vis_min, vis_max = np.log10(3.8e-7), np.log10(7e-7)
ax1.axvspan(vis_min, vis_max, color='#f59e0b', alpha=0.8)
ax1.annotate('VISIBLE\\nLIGHT', xy=((vis_min + vis_max)/2, 0.85),
             color='white', ha='center', fontsize=10, fontweight='bold')

ax1.set_xlim(-13, 5)
ax1.set_ylim(0, 1)
ax1.set_xlabel('log10(wavelength in meters)', color='white')
ax1.set_title('The Electromagnetic Spectrum', color='white', fontsize=14)
ax1.tick_params(colors='gray', labelleft=False)

# Add wavelength labels
for exp in range(-12, 6, 3):
    ax1.axvline(exp, color='gray', linewidth=0.5, linestyle=':')
    if exp < -6:
        label = f'10^{exp} m'
    elif exp == -6:
        label = '1 um'
    elif exp == -3:
        label = '1 mm'
    elif exp == 0:
        label = '1 m'
    elif exp == 3:
        label = '1 km'
    else:
        label = f'10^{exp} m'
    ax1.text(exp, -0.05, label, color='gray', ha='center', fontsize=7)

# --- Bottom: zoom into visible spectrum ---
ax2.set_facecolor('#111827')

wavelengths = np.linspace(380, 700, 1000)

def wavelength_to_rgb(wl):
    if 380 <= wl < 440:
        r, g, b = -(wl - 440) / 60, 0.0, 1.0
    elif 440 <= wl < 490:
        r, g, b = 0.0, (wl - 440) / 50, 1.0
    elif 490 <= wl < 510:
        r, g, b = 0.0, 1.0, -(wl - 510) / 20
    elif 510 <= wl < 580:
        r, g, b = (wl - 510) / 70, 1.0, 0.0
    elif 580 <= wl < 645:
        r, g, b = 1.0, -(wl - 645) / 65, 0.0
    elif 645 <= wl <= 700:
        r, g, b = 1.0, 0.0, 0.0
    else:
        r, g, b = 0.0, 0.0, 0.0
    if 380 <= wl < 420:
        f = 0.3 + 0.7 * (wl - 380) / 40
    elif 645 < wl <= 700:
        f = 0.3 + 0.7 * (700 - wl) / 55
    else:
        f = 1.0
    return (r * f, g * f, b * f)

# Sun's emission spectrum (approximation: blackbody at 5778K)
h, c, k = 6.626e-34, 3e8, 1.381e-23
T = 5778
wl_m = wavelengths * 1e-9
intensity = (2 * h * c**2 / wl_m**5) / (np.exp(h * c / (wl_m * k * T)) - 1)
intensity = intensity / intensity.max()  # normalize

ax2.plot(wavelengths, intensity, color='white', linewidth=2, label="Sun's emission")

# Color the spectrum
for i in range(len(wavelengths) - 1):
    color = wavelength_to_rgb(wavelengths[i])
    ax2.fill_between(wavelengths[i:i+2], 0, intensity[i:i+2],
                     color=color, alpha=0.7)

# Mark golden deer's reflection peak
ax2.axvspan(570, 600, color='#f59e0b', alpha=0.3)
ax2.annotate('Golden deer\\nreflection peak', xy=(585, 0.85),
             xytext=(500, 0.4), color='#f59e0b', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax2.set_xlabel('Wavelength (nm)', color='white')
ax2.set_ylabel('Relative intensity', color='white')
ax2.set_title('Visible Spectrum — The Sun\\'s Output Peaks Here', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The electromagnetic spectrum spans 16+ orders of magnitude.")
print(f"Visible light: 380 - 700 nm (just 320 nm wide!)")
print()
print("That's like hearing only one note on a piano")
print("that stretches from here to the Moon.")
print()
print("Yet from that tiny slice, we get:")
print("  - All colors, all art, all photography")
print("  - Plant photosynthesis (life depends on it)")
print("  - Vision (our primary sense)")
print("  - The golden glow of a mythical deer")
print()
print("Level 1 complete! Level 2 explores what we BUILD")
print("with light: lenses, lasers, fiber optics, and more.")`,
      challenge: 'The Sun\'s peak emission is around 500 nm (green). So why does the Sun look yellow-white, not green? Research this — it has to do with how our eyes integrate the full spectrum. Plot the Sun\'s full blackbody curve from 200 nm to 2000 nm to see the answer.',
      successHint: 'From "what is light?" to the full electromagnetic spectrum — you now understand the physics behind every color, every reflection, every golden shimmer. The deer of Kamakhya shone because of electromagnetic waves, and visible light is just one octave in the cosmic symphony.',
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