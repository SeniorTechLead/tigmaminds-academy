import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RainbowFishLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'How light behaves in water — the basics of underwater optics',
      concept: `The rainbow fish of Umiam Lake shimmer because of how light interacts with water and scales. To understand why, we need to start with how light behaves in water.

Light is an **electromagnetic wave** that travels at different speeds in different materials:
- In vacuum/air: ~300,000 km/s (speed of light, c)
- In water: ~225,000 km/s (about 75% of c)
- In glass: ~200,000 km/s (about 67% of c)
- In diamond: ~124,000 km/s (about 41% of c)

The ratio of speeds is the **refractive index (n)**:
- Air: n = 1.0
- Water: n = 1.33
- Glass: n = 1.5
- Diamond: n = 2.42

When light slows down entering a denser medium, it also **changes direction** — this is **refraction**. The higher the refractive index difference, the more the light bends.

This is why:
- A straw in water looks bent at the surface
- Objects underwater appear closer than they are
- A pool looks shallower than it actually is
- Fish look like they're in a different position than where they actually are`,
      analogy: 'Light entering water is like a car driving from pavement onto sand. The right wheels hit sand first and slow down while the left wheels are still on pavement going fast. This makes the car turn. Light "turns" at a surface for the same reason — one side slows down before the other.',
      storyConnection: 'The rainbow fish of Umiam Lake lived in clear mountain water. Anyone looking at the fish from above would see them slightly displaced from their true position — refraction bending the light path from fish to eye. The shimmer itself comes from multiple refractions and reflections in the scales.',
      checkQuestion: 'Spearfishers learn to aim BELOW where they see a fish. Why?',
      checkAnswer: 'Light from the fish bends (refracts) as it exits the water surface, angling upward. Your brain traces the light ray back in a straight line, placing the fish higher than its true position. To actually hit the fish, you must aim lower — at the real position, not the apparent one. The deeper the fish, the greater the displacement.',
      codeIntro: 'Model refraction at the air-water interface using Snell\'s Law.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
n_air = 1.0
n_water = 1.33

# Range of incident angles
theta_i = np.linspace(0, 89, 200)  # degrees
theta_i_rad = np.radians(theta_i)

# Calculate refracted angle
sin_theta_r = (n_air / n_water) * np.sin(theta_i_rad)
theta_r_rad = np.arcsin(np.clip(sin_theta_r, -1, 1))
theta_r = np.degrees(theta_r_rad)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Snell's law relationship
ax1.set_facecolor('#111827')
ax1.plot(theta_i, theta_r, color='#3b82f6', linewidth=2.5, label='Refracted angle')
ax1.plot(theta_i, theta_i, color='gray', linestyle='--', linewidth=1, label='No refraction (reference)')
ax1.fill_between(theta_i, theta_r, theta_i, alpha=0.15, color='#3b82f6')
ax1.set_xlabel('Incident angle (degrees)', color='white')
ax1.set_ylabel('Refracted angle (degrees)', color='white')
ax1.set_title("Snell's Law: Air → Water", color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.annotate(f'n_air = {n_air}\\nn_water = {n_water}', xy=(5, 60), color='#f59e0b', fontsize=11,
             bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#f59e0b'))

# Ray diagram
ax2.set_facecolor('#111827')

# Draw water surface
ax2.axhline(0, color='white', linewidth=2)
ax2.fill_between([-5, 5], [0, 0], [-5, -5], alpha=0.15, color='#3b82f6')
ax2.text(-4.5, -4.5, 'WATER (n=1.33)', color='#3b82f6', fontsize=11)
ax2.text(-4.5, 4.5, 'AIR (n=1.0)', color='white', fontsize=11)

# Draw normal line
ax2.plot([0, 0], [-5, 5], color='gray', linestyle=':', linewidth=1, label='Normal')

# Draw rays at different angles
angles_to_show = [20, 40, 60, 80]
ray_colors = ['#22c55e', '#f59e0b', '#ef4444', '#a855f7']

for angle, color in zip(angles_to_show, ray_colors):
    angle_rad = np.radians(angle)
    # Incoming ray (in air)
    x_in = -5 * np.sin(angle_rad)
    y_in = 5 * np.cos(angle_rad)
    ax2.annotate('', xy=(0, 0), xytext=(x_in, y_in),
                arrowprops=dict(arrowstyle='->', color=color, linewidth=2))

    # Refracted ray (in water)
    sin_r = (n_air/n_water) * np.sin(angle_rad)
    if abs(sin_r) <= 1:
        r_angle = np.arcsin(sin_r)
        x_out = 3 * np.sin(r_angle)
        y_out = -3 * np.cos(r_angle)
        ax2.annotate('', xy=(x_out, y_out), xytext=(0, 0),
                    arrowprops=dict(arrowstyle='->', color=color, linewidth=2))
        ax2.text(x_in * 0.3, y_in * 0.7, f'{angle}°→{np.degrees(r_angle):.0f}°',
                color=color, fontsize=9)

ax2.set_xlim(-5, 5)
ax2.set_ylim(-5, 5)
ax2.set_aspect('equal')
ax2.set_title('Ray Diagram: Light Entering Water', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Snell's Law: n₁ sin(θ₁) = n₂ sin(θ₂)")
print()
print("Light entering water ALWAYS bends toward the normal")
print("(because water is denser than air).")
print()
for a in angles_to_show:
    r = np.degrees(np.arcsin((n_air/n_water) * np.sin(np.radians(a))))
    print(f"  {a}° in air → {r:.1f}° in water (bent by {a-r:.1f}°)")`,
      challenge: 'Change n_water to 2.42 (diamond). How much more does light bend? Then calculate what happens when light goes from water to air (flip n1 and n2). At what angle does something special happen?',
      successHint: 'Refraction is the foundation of all optics — lenses, glasses, cameras, and fiber optics all work by bending light at surfaces. The rainbow fish\'s shimmer starts here, with light bending at every surface it encounters.',
    },
    {
      title: 'Refraction at the water surface — why underwater looks different',
      concept: `When you look at a fish from above the water, refraction distorts what you see. But the distortion is even more dramatic from the fish's perspective looking UP.

From a fish's point of view:
- Looking straight up: sees the sky normally (like a circular window)
- Looking at an angle: the sky is compressed into a cone with a half-angle of ~48.6°
- This cone is called **Snell's window** — the entire above-water world is squeezed into it
- Beyond Snell's window (~48.6° from vertical): the fish sees a mirror! The water surface reflects light from below

The size of Snell's window depends on the refractive index:
**θ_critical = arcsin(n_air / n_water) = arcsin(1/1.33) ≈ 48.6°**

This is the same angle that creates **total internal reflection** (next lesson). It's why:
- Fish can see above water but the view is distorted and compressed
- Underwater photographers see a bright circular patch above them
- The edges of Snell's window show rainbow-like colour fringes (chromatic dispersion)`,
      analogy: 'Snell\'s window is like looking up through a fisheye lens. The entire sky is crammed into a small circle directly overhead. Everything outside that circle is a mirror reflecting the bottom of the lake. The fish lives in a world with a porthole to the sky and mirrors on the ceiling.',
      storyConnection: 'The rainbow fish in Umiam Lake saw the world through Snell\'s window — the sky compressed into a bright circle above, the rest of the surface reflecting the lake\'s blue-green depths. When people peered down to see the fish, the fish was looking back up through its own distorted porthole.',
      checkQuestion: 'A fish is 2 meters below the surface. What is the radius of Snell\'s window (the circle of sky it can see)?',
      checkAnswer: 'The radius of Snell\'s window = depth × tan(θ_critical) = 2 × tan(48.6°) = 2 × 1.134 ≈ 2.27 meters. So from 2 meters deep, the fish sees the entire sky compressed into a circle about 4.5 meters in diameter on the surface. Move deeper, and the window gets larger but the image gets dimmer.',
      codeIntro: 'Visualize Snell\'s window from a fish\'s perspective and show how the sky appears compressed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Snell's window visualization
n_water = 1.33
n_air = 1.0
theta_critical = np.degrees(np.arcsin(n_air / n_water))

# Depth vs Snell's window radius
depths = np.linspace(0.1, 10, 100)
window_radius = depths * np.tan(np.radians(theta_critical))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Window radius vs depth
ax1.set_facecolor('#111827')
ax1.plot(depths, window_radius, color='#3b82f6', linewidth=2.5)
ax1.fill_between(depths, window_radius, alpha=0.15, color='#3b82f6')
ax1.set_xlabel('Depth (meters)', color='white')
ax1.set_ylabel("Snell's window radius (meters)", color='white')
ax1.set_title("Snell's Window Size vs Depth", color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.annotate(f'Critical angle: {theta_critical:.1f}°', xy=(1, 1.2), color='#f59e0b', fontsize=11,
             bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#f59e0b'))

# What the fish sees (polar diagram)
# Show how the above-water angles map to underwater viewing angles
ax2 = fig.add_subplot(122, polar=True)
ax2.set_facecolor('#111827')

# Above-water angles (0 to 90) map to underwater angles (0 to theta_critical)
above_angles = np.linspace(0, 90, 100)
above_rad = np.radians(above_angles)

# Snell's law: what underwater angle corresponds to each above-water angle
underwater_angles = np.degrees(np.arcsin(n_air * np.sin(above_rad) / n_water))

# The sky appears compressed into the cone
# Map sky angles (0-90°) to fish viewing angles (0-48.6°)
theta_fish = np.radians(underwater_angles)

# Intensity drops near the edge of Snell's window
intensity = np.cos(above_rad)  # Fresnel-like approximation

# Snell's window region
theta_window = np.linspace(0, np.radians(theta_critical), 100)
ax2.fill_between(theta_window, 0, 1, alpha=0.3, color='#87CEEB', label="Snell's window (sky)")

# Mirror region
theta_mirror = np.linspace(np.radians(theta_critical), np.pi/2, 100)
ax2.fill_between(theta_mirror, 0, 1, alpha=0.2, color='#6b7280', label='Total internal reflection (mirror)')

# Mark critical angle
ax2.axvline(np.radians(theta_critical), color='#ef4444', linewidth=2, linestyle='--', label=f'Critical angle ({theta_critical:.1f}°)')

# Compression visualization
for above_deg in [0, 15, 30, 45, 60, 75, 89]:
    under_deg = np.degrees(np.arcsin(n_air * np.sin(np.radians(above_deg)) / n_water))
    ax2.plot([np.radians(under_deg)], [0.8], 'o', color='#f59e0b', markersize=6)
    ax2.annotate(f'{above_deg}°→{under_deg:.0f}°', xy=(np.radians(under_deg), 0.8),
                xytext=(np.radians(under_deg) + 0.05, 0.6), color='#f59e0b', fontsize=7)

ax2.set_title("Fish's View Looking Up", color='white', fontsize=12, pad=15)
ax2.set_ylim(0, 1)
ax2.set_thetamax(90)
ax2.legend(loc='lower right', facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Snell's window properties:")
print(f"  Critical angle: {theta_critical:.1f}°")
print(f"  Window half-angle as seen by fish: {theta_critical:.1f}°")
print()
print("Sky compression (above-water angle → fish's viewing angle):")
for a in [0, 15, 30, 45, 60, 75, 89]:
    u = np.degrees(np.arcsin(np.sin(np.radians(a)) / n_water))
    compression = a / u if u > 0 else 0
    print(f"  {a}° above water → {u:.1f}° underwater (compressed {compression:.1f}x)")`,
      challenge: 'Calculate Snell\'s window for a fish in very salty water (n = 1.38) vs. fresh water (n = 1.33). How much does salinity change the window size?',
      successHint: 'Snell\'s window is a beautiful consequence of refraction. It shows that the same physics that makes a straw look bent also creates an entirely different visual world for creatures living underwater.',
    },
    {
      title: 'Total internal reflection — light trapped inside',
      concept: `When light travels from a denser medium (water) to a less dense medium (air), something remarkable happens at steep angles: the light **cannot escape**. It bounces back entirely. This is **total internal reflection (TIR)**.

The physics:
- Light going from water to air bends AWAY from the normal (opposite of entering)
- As the angle increases, the refracted ray bends more and more
- At the **critical angle** (48.6° for water-air), the refracted ray skims along the surface
- Beyond the critical angle: **no refraction at all**. 100% of the light is reflected back into the water

TIR is why:
- **Fiber optics** work: light bounces along the inside of a glass fiber, never escaping
- **Diamonds sparkle**: the high refractive index (n=2.42) gives a critical angle of only 24.4°, so most light that enters gets bounced around inside
- **Prisms in binoculars**: TIR reflects light without needing mirrors
- **Fish scales shimmer**: light bouncing between scale layers at angles beyond critical gets trapped and redirected

For the rainbow fish, TIR inside the transparent layers of scales creates the shimmering effect — light enters the scale, bounces between layers at different angles, and exits in unexpected directions, creating flashes of colour.`,
      analogy: 'TIR is like shouting in a hallway. At a shallow angle, your voice goes through the wall (refraction — some energy escapes). At a steep angle, the walls bounce your voice back perfectly (total internal reflection). The steeper the angle, the better the reflection — until you hit the critical angle and the hallway becomes a perfect echo chamber.',
      storyConnection: 'The rainbow fish\'s shimmer is partly TIR: light enters a scale, hits internal surfaces at angles beyond critical, and bounces around before exiting. Different viewing angles see different bounced rays — creating the characteristic flash and colour shift that made these fish famous in the story.',
      checkQuestion: 'Fiber optic cables carry internet data as pulses of light that travel thousands of kilometers without losing signal. How does TIR make this possible?',
      checkAnswer: 'The fiber has a glass core (high n) surrounded by cladding (lower n). Light injected into the core hits the core-cladding boundary at angles well beyond the critical angle, so TIR reflects it perfectly back into the core. The light zigzags along the fiber, never escaping. Loss comes from absorption and scattering in the glass, not from leakage — so signals can travel ~100 km before needing amplification.',
      codeIntro: 'Simulate total internal reflection: plot reflectance vs angle and show the critical angle.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Total internal reflection: Fresnel equations
n1 = 1.33  # water
n2 = 1.0   # air

theta_i = np.linspace(0, 89.9, 500)
theta_i_rad = np.radians(theta_i)

# Critical angle
theta_c = np.degrees(np.arcsin(n2 / n1))

# Fresnel reflectance (unpolarized light)
reflectance = np.zeros_like(theta_i)
for i, th in enumerate(theta_i_rad):
    sin_t = (n1 / n2) * np.sin(th)
    if sin_t >= 1:
        reflectance[i] = 1.0  # TIR
    else:
        cos_t = np.sqrt(1 - sin_t**2)
        cos_i = np.cos(th)
        rs = ((n1 * cos_i - n2 * cos_t) / (n1 * cos_i + n2 * cos_t))**2
        rp = ((n2 * cos_i - n1 * cos_t) / (n2 * cos_i + n1 * cos_t))**2
        reflectance[i] = (rs + rp) / 2

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Reflectance curve
ax1.set_facecolor('#111827')
ax1.plot(theta_i, reflectance * 100, color='#3b82f6', linewidth=2.5)
ax1.fill_between(theta_i, reflectance * 100, alpha=0.15, color='#3b82f6')
ax1.axvline(theta_c, color='#ef4444', linestyle='--', linewidth=2, label=f'Critical angle ({theta_c:.1f}°)')
ax1.axhspan(95, 100, xmin=theta_c/90, alpha=0.2, color='#22c55e')
ax1.text(theta_c + 2, 50, 'Total Internal\\nReflection', color='#22c55e', fontsize=12, fontweight='bold')
ax1.text(theta_c - 15, 50, 'Partial\\nreflection', color='#3b82f6', fontsize=12)
ax1.set_xlabel('Angle of incidence (degrees)', color='white')
ax1.set_ylabel('Reflectance (%)', color='white')
ax1.set_title('Water → Air: Reflectance vs Angle', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 105)

# Fiber optic demonstration
ax2.set_facecolor('#111827')

# Draw a fiber (rectangle)
fiber_y_top = 2
fiber_y_bot = -2
ax2.fill_between([-1, 15], fiber_y_bot, fiber_y_top, alpha=0.15, color='#3b82f6')
ax2.axhline(fiber_y_top, color='white', linewidth=2)
ax2.axhline(fiber_y_bot, color='white', linewidth=2)
ax2.text(7, 2.5, 'Cladding (n=1.46)', color='gray', fontsize=9, ha='center')
ax2.text(7, 0, 'Core (n=1.50)', color='#3b82f6', fontsize=11, ha='center')
ax2.text(7, -2.5, 'Cladding (n=1.46)', color='gray', fontsize=9, ha='center')

# Trace a light ray bouncing through the fiber
x_positions = [0]
y_positions = [1]
slope = 0.3  # angle of propagation
x = 0
y = 1
for bounce in range(10):
    # Find next wall hit
    if slope > 0:
        dx = (fiber_y_top - y) / slope
    else:
        dx = (fiber_y_bot - y) / slope
    x += dx
    y += slope * dx
    x_positions.append(x)
    y_positions.append(y)
    slope = -slope  # TIR reflection

ax2.plot(x_positions, y_positions, color='#ef4444', linewidth=2, label='Light ray (TIR)')

# Mark reflection points
for xp, yp in zip(x_positions[1:-1], y_positions[1:-1]):
    ax2.plot(xp, yp, 'o', color='#f59e0b', markersize=6)

ax2.set_xlim(-1, 15)
ax2.set_ylim(-4, 4)
ax2.set_xlabel('Distance along fiber', color='white')
ax2.set_title('Fiber Optic: Light Trapped by TIR', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_aspect('equal')

plt.tight_layout()
plt.show()

# Critical angles for different materials
materials = {'Water→Air': (1.33, 1.0), 'Glass→Air': (1.5, 1.0),
             'Diamond→Air': (2.42, 1.0), 'Glass→Water': (1.5, 1.33)}
print("Critical angles for TIR:")
for name, (n1m, n2m) in materials.items():
    tc = np.degrees(np.arcsin(n2m / n1m))
    print(f"  {name}: {tc:.1f}°")
print()
print("Lower critical angle = MORE light gets trapped = MORE sparkle")
print("This is why diamonds (24.4°) sparkle more than glass (41.8°)")`,
      challenge: 'Diamond cutters angle the facets so that light entering the top gets TIR\'d twice before exiting through the top again (never out the bottom). What angles would you need for the facets? Model the ray path through a simple diamond cross-section.',
      successHint: 'Total internal reflection is one of nature\'s most elegant phenomena — light perfectly trapped by geometry. From fish scales to fiber optics to diamond rings, TIR creates sparkle, enables communication, and makes beautiful things beautiful.',
    },
    {
      title: 'Iridescence in nature — colour without pigment',
      concept: `The rainbow fish doesn't get its colours from **pigments** (chemical dyes that absorb specific wavelengths). Instead, it uses **structural colour** — colour created by the physical structure of surfaces interacting with light.

Two types of colour in nature:
- **Pigment colour**: molecules absorb certain wavelengths, reflect others (e.g., chlorophyll absorbs red and blue, reflects green)
- **Structural colour**: microscopic physical structures interfere with light waves to produce colour (e.g., peacock feathers, soap bubbles, fish scales)

**Iridescence** is structural colour that changes with viewing angle. It happens when:
1. Light hits a surface with thin layers (thinner than the wavelength of light, ~400-700 nm)
2. Some light reflects off the top of each layer, some off the bottom
3. These reflected waves **interfere** with each other
4. **Constructive interference**: waves align → bright colour
5. **Destructive interference**: waves cancel → no colour at that angle

As the viewing angle changes, the path length through the layers changes, so different wavelengths get boosted at different angles. The result: colour that shifts as you move — the hallmark of iridescence.

In fish scales, thin layers of **guanine crystals** (yes, the same molecule as in DNA) create the reflective layers.`,
      analogy: 'Iridescence is like two speakers playing the same note but slightly out of sync. At some positions in the room, the sound waves add up (loud). At others, they cancel (quiet). Move to a different spot, and the pattern changes. Structural colour works the same way — except with light waves instead of sound, and "bright colour" instead of "loud."',
      storyConnection: 'The rainbow fish of Umiam Lake shimmered with colours that changed as they swam — classic iridescence. The fish weren\'t painted rainbow colours. Their scales contained nano-thin guanine crystal layers that created rainbow reflections through structural colour. The "rainbow" was physics, not chemistry.',
      checkQuestion: 'A bird feather looks bright blue in sunlight but black in shadow. Why? A blue pigment would look blue in both conditions.',
      checkAnswer: 'Structural blue requires light coming from a specific direction to create constructive interference at blue wavelengths. In shadow (diffuse light from all directions), no single direction dominates, so no strong interference occurs and the feather appears dark. Pigment colour is angle-independent — it absorbs the same wavelengths regardless of lighting direction. The test for structural colour: it disappears when you crush the structure (grind the feather).',
      codeIntro: 'Model thin-film interference: how layer thickness determines which colours are reflected.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Thin film interference: reflected colour depends on film thickness and viewing angle
# For a single thin film (like guanine crystal in fish scale)

# Constructive interference when: 2 * n * d * cos(theta) = m * lambda
# where n = refractive index of film, d = thickness, theta = angle in film, m = integer, lambda = wavelength

n_film = 1.83  # guanine crystal
d_values = np.linspace(50, 400, 200)  # film thickness in nm

# Wavelengths of visible light
wavelengths = np.linspace(380, 780, 200)  # nm
# Map wavelength to approximate RGB colour
def wavelength_to_rgb(w):
    if w < 440:
        r, g, b = -(w - 440) / (440 - 380), 0, 1
    elif w < 490:
        r, g, b = 0, (w - 440) / (490 - 440), 1
    elif w < 510:
        r, g, b = 0, 1, -(w - 510) / (510 - 490)
    elif w < 580:
        r, g, b = (w - 510) / (580 - 510), 1, 0
    elif w < 645:
        r, g, b = 1, -(w - 645) / (645 - 580), 0
    else:
        r, g, b = 1, 0, 0
    return np.clip([r, g, b], 0, 1)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Reflectance spectrum for different film thicknesses
ax1.set_facecolor('#111827')
thicknesses = [80, 120, 160, 200, 250]
for d in thicknesses:
    # Reflectance: simplified Fabry-Perot
    # R = 4 * R0 * sin²(delta/2) / (1 - R0)² + 4*R0*sin²(delta/2)
    R0 = ((n_film - 1) / (n_film + 1)) ** 2  # single surface reflectance
    delta = 4 * np.pi * n_film * d / wavelengths  # phase difference
    reflectance = 4 * R0 * np.sin(delta / 2) ** 2 / ((1 - R0) ** 2 + 4 * R0 * np.sin(delta / 2) ** 2)

    peak_wl = wavelengths[np.argmax(reflectance)]
    color = wavelength_to_rgb(peak_wl)
    ax1.plot(wavelengths, reflectance * 100, linewidth=2, color=color, label=f'd = {d} nm')

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Reflectance (%)', color='white')
ax1.set_title('Thin Film Reflectance: Colour Depends on Thickness', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Colour strip showing the visible spectrum
ax1_inset = ax1.inset_axes([0.05, 0.85, 0.9, 0.08])
spectrum_colors = np.array([wavelength_to_rgb(w) for w in wavelengths])
ax1_inset.imshow([spectrum_colors], aspect='auto', extent=[380, 780, 0, 1])
ax1_inset.set_xticks([])
ax1_inset.set_yticks([])

# Iridescence: colour shift with viewing angle
ax2.set_facecolor('#111827')
d_fixed = 150  # nm
angles = np.linspace(0, 70, 100)  # viewing angles in degrees

peak_wavelengths = []
for angle in angles:
    # Effective path through film changes with angle
    cos_theta = np.cos(np.radians(angle))
    # Constructive interference: 2*n*d*cos(theta) = m*lambda, for m=1
    peak_wl = 2 * n_film * d_fixed * cos_theta
    if 380 <= peak_wl <= 780:
        peak_wavelengths.append(peak_wl)
    else:
        peak_wavelengths.append(np.nan)

# Plot colour shift
for i in range(len(angles) - 1):
    if not np.isnan(peak_wavelengths[i]):
        color = wavelength_to_rgb(peak_wavelengths[i])
        ax2.barh(angles[i], 1, height=angles[1]-angles[0], color=color, alpha=0.8)

ax2.set_xlabel('(colour)', color='white')
ax2.set_ylabel('Viewing angle (degrees)', color='white')
ax2.set_title(f'Iridescence: Colour Shift with Angle (d={d_fixed}nm)', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Structural colour summary:")
print(f"  Film material: guanine crystal (n = {n_film})")
print(f"  As thickness changes, reflected colour changes:")
for d in thicknesses:
    peak = 2 * n_film * d
    if peak > 780: peak = 2 * n_film * d / 2
    visible = 'yes' if 380 <= peak <= 780 else 'UV/IR'
    print(f"    d = {d} nm → peak ≈ {peak:.0f} nm")
print()
print("As viewing angle changes, the effective path changes,")
print("so the colour shifts — this is iridescence.")`,
      challenge: 'Add a second layer on top of the first (different thickness: 100 nm). The combined reflectance is more complex — some wavelengths get double-boosted. Model this multilayer system and plot the resulting spectrum.',
      successHint: 'Structural colour is nature\'s photonic technology — older than any human invention. Fish, butterflies, beetles, and birds all use it. Understanding it has led to anti-counterfeiting technology, reflective displays, and biomimetic coatings.',
    },
    {
      title: 'Structural colour in fish scales — guanine crystal engineering',
      concept: `Fish scales are sophisticated optical devices. The rainbow shimmer of many fish species comes from **guanine crystals** — flat, hexagonal platelets arranged in regular stacks within the scales.

The structure:
- Each guanine platelet is ~5-20 nm thick
- Platelets are separated by cytoplasm (~100-200 nm gaps)
- The stack has 5-20 layers
- Guanine has a high refractive index (n ≈ 1.83), cytoplasm is lower (n ≈ 1.33)

This creates a natural **multilayer reflector** — a stack of alternating high-n and low-n layers that reflects specific wavelengths through constructive interference. The same principle is used in:
- **Anti-reflective coatings** on camera lenses
- **Dielectric mirrors** in lasers
- **Bragg reflectors** in fiber optics

Why fish evolved this:
- **Camouflage**: silver scales reflect ambient light, making the fish hard to see against a bright water surface (predator confusion)
- **Communication**: some species change iridescence for mating displays (angle-dependent colour change)
- **UV protection**: guanine layers block UV light that could damage skin

Some species can actively control their iridescence by expanding or contracting the spacing between guanine platelets — changing colour in real time.`,
      analogy: 'Fish scale guanine layers work like the anti-glare coating on your glasses — except in reverse. Anti-glare coatings cancel reflections (destructive interference at all visible wavelengths). Fish scales boost reflections (constructive interference at specific wavelengths). Same physics, opposite goal: one reduces reflection, the other maximizes it.',
      storyConnection: 'The rainbow fish of Umiam Lake had scales that acted as natural multilayer reflectors. Each scale was a tiny mirror built from stacked guanine crystals, reflecting different colours at different angles. The "rainbow" was thousands of these micro-mirrors, each tilted slightly differently, creating a mosaic of shimmering colour.',
      checkQuestion: 'Some deep-sea fish have silvery scales that reflect ALL wavelengths equally (appearing silver/mirror-like), while shallow fish have iridescent scales that reflect specific colours. Why the difference?',
      checkAnswer: 'Deep-sea fish need to reflect bioluminescent light from all directions to be invisible (broadband mirror = silver). They achieve this with disordered guanine crystal stacks at many thicknesses. Shallow fish face directional sunlight and benefit from angle-specific colour for camouflage against the bright surface (narrowband reflector = iridescent). The structure is tuned to the light environment.',
      codeIntro: 'Model a multilayer guanine crystal reflector and calculate its reflection spectrum.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Multilayer reflector (transfer matrix method, simplified)
# Alternating layers: guanine (n=1.83) and cytoplasm (n=1.33)

n_guanine = 1.83
n_cyto = 1.33
n_layers = 10  # 5 pairs of guanine + cytoplasm

# Layer thicknesses
d_guanine = 70  # nm
d_cyto = 100    # nm

wavelengths = np.linspace(350, 800, 500)

def multilayer_reflectance(wls, d_g, d_c, n_pairs, angle_deg=0):
    """Calculate reflectance spectrum of multilayer stack"""
    angle_rad = np.radians(angle_deg)
    reflectance = np.zeros_like(wls)

    for i, wl in enumerate(wls):
        # Phase accumulated in each layer
        cos_g = np.sqrt(1 - (np.sin(angle_rad) / n_guanine) ** 2)
        cos_c = np.sqrt(1 - (np.sin(angle_rad) / n_cyto) ** 2)

        delta_g = 2 * np.pi * n_guanine * d_g * cos_g / wl
        delta_c = 2 * np.pi * n_cyto * d_c * cos_c / wl

        # Simplified: sum of partial reflections with phase
        # For a quarter-wave stack, peak reflectance at lambda = 4*n*d
        total_phase = n_pairs * (delta_g + delta_c)
        r_single = (n_guanine - n_cyto) / (n_guanine + n_cyto)

        # Approximate reflectance for multilayer
        # R ≈ ((n_g/n_c)^(2N) - 1)^2 / ((n_g/n_c)^(2N) + 1)^2 at peak
        # Away from peak, use interference pattern
        phase_mismatch = np.cos(total_phase)
        r_eff = r_single * n_pairs * (1 + phase_mismatch) / 2
        reflectance[i] = min(1.0, r_eff ** 2)

    return reflectance

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Reflectance for different numbers of layers
ax1.set_facecolor('#111827')
for n_p in [2, 5, 10, 20]:
    R = multilayer_reflectance(wavelengths, d_guanine, d_cyto, n_p)
    # Peak wavelength
    peak_wl = 2 * (n_guanine * d_guanine + n_cyto * d_cyto)
    ax1.plot(wavelengths, R * 100, linewidth=2, label=f'{n_p} layer pairs')

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Reflectance (%)', color='white')
ax1.set_title('Multilayer Reflectance: More Layers = Sharper Peak', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Angle dependence (iridescence)
ax2.set_facecolor('#111827')
angles = [0, 15, 30, 45, 60]
angle_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

for angle, color in zip(angles, angle_colors):
    R = multilayer_reflectance(wavelengths, d_guanine, d_cyto, 10, angle)
    ax2.plot(wavelengths, R * 100, linewidth=2, color=color, label=f'{angle}°')

ax2.set_xlabel('Wavelength (nm)', color='white')
ax2.set_ylabel('Reflectance (%)', color='white')
ax2.set_title('Iridescence: Colour Shifts with Viewing Angle', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', title='Viewing angle',
           title_fontsize=9)
ax2.tick_params(colors='gray')

# Add colour strip
for ax in [ax1, ax2]:
    wl_to_rgb = lambda w: [max(0, min(1, -(w-440)/(440-380))) if w < 440 else 0 if w < 510 else max(0, min(1, (w-510)/(580-510))) if w < 580 else 1 if w < 780 else 0,
                           0 if w < 440 else max(0, min(1, (w-440)/(490-440))) if w < 490 else 1 if w < 580 else max(0, min(1, -(w-645)/(645-580))) if w < 645 else 0,
                           1 if w < 490 else max(0, min(1, -(w-510)/(510-490))) if w < 510 else 0]

plt.tight_layout()
plt.show()

peak_normal = 2 * (n_guanine * d_guanine + n_cyto * d_cyto)
print(f"Multilayer reflector parameters:")
print(f"  Guanine: n={n_guanine}, d={d_guanine}nm")
print(f"  Cytoplasm: n={n_cyto}, d={d_cyto}nm")
print(f"  Peak wavelength (normal incidence): {peak_normal:.0f}nm")
print()
print("More layers → sharper, stronger peak (better mirror)")
print("Changing angle → peak shifts to shorter wavelengths (blue shift)")
print("This is why fish shimmer: each scale viewed from a different angle")
print("reflects a different colour.")`,
      challenge: 'Design a scale that reflects green (550nm) at normal incidence. What combination of d_guanine and d_cyto do you need? Use the condition: 2*(n_g*d_g + n_c*d_c) = target wavelength.',
      successHint: 'Fish scale optics is a billion-year-old nanotechnology. Engineers designing anti-reflective coatings, laser mirrors, and structural colour pigments study fish scales for design inspiration. The rainbow fish is a natural photonic engineer.',
    },
    {
      title: 'Thin film interference — soap bubbles and oil slicks',
      concept: `The simplest example of structural colour is **thin film interference** — the rainbow patterns you see in soap bubbles and oil slicks. The physics is identical to fish scale iridescence, just with a single layer instead of a stack.

How it works:
1. Light hits the top surface of the thin film → part reflects, part enters
2. Light hits the bottom surface → part reflects back up, part passes through
3. The two reflected beams recombine at the top surface
4. If they're **in phase**: constructive interference → bright colour
5. If they're **out of phase**: destructive interference → dark

The condition for constructive interference:
**2 × n × d × cos(θ) = (m + ½) × λ**
(The extra ½λ comes from the phase flip at one of the surfaces.)

Key insight: the reflected colour depends on:
- **Film thickness (d)**: thinner film → shorter wavelength (blue); thicker → longer (red)
- **Refractive index (n)**: higher n → longer effective path
- **Viewing angle (θ)**: changing angle changes the path length

This is why soap bubbles show swirling rainbow patterns — the film thickness varies across the bubble, so different spots reflect different colours. As the bubble thins (gravity pulls soap down), the colours change and eventually the top turns black (too thin for any visible constructive interference).`,
      analogy: 'Thin film interference is like two people walking side by side at slightly different speeds (the two reflected beams). Sometimes they\'re in step (constructive — bright), sometimes out of step (destructive — dark). The "speed difference" is the path length difference through the film. Change the film thickness, and you change which wavelengths are in step.',
      storyConnection: 'The rainbow fish creates the same physics as a soap bubble — but with guanine crystals instead of soap. Both use thin layers to split light into two beams that interfere with each other. The only difference is durability: the fish\'s structural colour lasts a lifetime; the bubble\'s lasts seconds.',
      checkQuestion: 'Why do oil slicks on water show rainbow colours, but a thick layer of oil on water doesn\'t?',
      checkAnswer: 'For interference to produce visible colours, the film must be in the right thickness range — roughly 100-1000 nm (comparable to the wavelength of visible light). A thick layer of oil has path length differences of millions of nanometers. At those thicknesses, constructive and destructive interference happen for so many closely spaced wavelengths that they average out to white — no colour separation. You need the film to be nano-thin for the interference pattern to have wide enough spacing to isolate individual colours.',
      codeIntro: 'Simulate thin film interference and show how colour changes with film thickness.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Thin film interference simulation
# Oil film on water
n_oil = 1.5
n_water = 1.33
n_air = 1.0

wavelengths = np.linspace(380, 780, 400)

def thin_film_color(d, n_film=1.5, angle=0):
    """Calculate reflected spectrum for thin film"""
    cos_t = np.sqrt(1 - (np.sin(np.radians(angle)) / n_film) ** 2)
    path_diff = 2 * n_film * d * cos_t

    # Phase difference (including half-wave shift at one surface)
    delta = 2 * np.pi * path_diff / wavelengths + np.pi

    # Reflectance (simplified Airy function for single film)
    r12 = (n_air - n_film) / (n_air + n_film)
    r23 = (n_film - n_water) / (n_film + n_water)

    reflectance = r12**2 + r23**2 + 2*r12*r23*np.cos(delta)
    reflectance = reflectance / (1 + r12**2 * r23**2 + 2*r12*r23*np.cos(delta))
    return np.clip(reflectance, 0, 1)

def spectrum_to_rgb(spectrum, wls):
    """Very approximate conversion of spectrum to RGB"""
    r = np.trapz(spectrum * np.clip(1.5 - abs(wls - 620) / 60, 0, 1), wls)
    g = np.trapz(spectrum * np.clip(1.5 - abs(wls - 530) / 50, 0, 1), wls)
    b = np.trapz(spectrum * np.clip(1.5 - abs(wls - 460) / 40, 0, 1), wls)
    mx = max(r, g, b, 0.001)
    return np.clip([r/mx, g/mx, b/mx], 0, 1)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Reflected spectra for different thicknesses
ax1.set_facecolor('#111827')
thicknesses = [100, 200, 300, 400, 500]
for d in thicknesses:
    R = thin_film_color(d)
    rgb = spectrum_to_rgb(R, wavelengths)
    ax1.plot(wavelengths, R * 100, linewidth=2, color=rgb, label=f'd = {d} nm')

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Reflectance (%)', color='white')
ax1.set_title('Thin Film Reflectance: Colour vs Thickness', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Colour bar: thickness → colour
ax2.set_facecolor('#111827')
d_range = np.linspace(50, 600, 200)
color_bar = np.zeros((1, len(d_range), 3))
for i, d in enumerate(d_range):
    R = thin_film_color(d)
    color_bar[0, i] = spectrum_to_rgb(R, wavelengths)

ax2.imshow(np.repeat(color_bar, 50, axis=0), aspect='auto',
           extent=[50, 600, 0, 1])
ax2.set_xlabel('Film thickness (nm)', color='white')
ax2.set_title('Colour Map: Thickness → Reflected Colour', color='white', fontsize=13)
ax2.set_yticks([])
ax2.tick_params(colors='gray')

# Add angle variation below
ax2_inset = fig.add_axes([0.55, 0.15, 0.4, 0.25])
ax2_inset.set_facecolor('#111827')
d_fixed = 250  # nm
for angle in [0, 20, 40, 60]:
    R = thin_film_color(d_fixed, angle=angle)
    rgb = spectrum_to_rgb(R, wavelengths)
    ax2_inset.plot(wavelengths, R * 100, linewidth=1.5, color=rgb, label=f'{angle}°')
ax2_inset.set_title(f'Angle shift (d={d_fixed}nm)', color='white', fontsize=9)
ax2_inset.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax2_inset.tick_params(colors='gray', labelsize=7)

plt.tight_layout()
plt.show()

print("Thin film interference creates colour from structure, not pigment.")
print()
print("Colour vs thickness (at normal incidence):")
for d in thicknesses:
    R = thin_film_color(d)
    peak_idx = np.argmax(R)
    peak_wl = wavelengths[peak_idx]
    print(f"  d = {d}nm → peak at {peak_wl:.0f}nm")
print()
print("Applications: anti-reflective coatings, soap bubbles,")
print("oil slick colours, fish scale iridescence, butterfly wings")`,
      challenge: 'Simulate a soap bubble thinning over time (thickness decreasing from 500nm to 50nm over 30 seconds). Create an animation (sequence of spectra) showing how the reflected colour changes as the bubble thins. At what thickness does the bubble appear black?',
      successHint: 'Thin film interference connects everyday observations (soap bubbles, oil slicks) to sophisticated optics (anti-reflective coatings, laser mirrors) and biological structures (fish scales, beetle shells). The rainbow fish of Umiam Lake is a living lesson in wave physics. Level 2 explores the deeper photonic crystal structures that make this possible.',
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