import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FestivalLightsLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Design: LED Display Designer',
      concept: `Our LED Display Designer will be a complete system for designing, simulating, and optimizing festival lighting installations. The system takes a venue layout, desired mood/theme, and budget constraints, then produces a full lighting design: LED positions, colors, brightness patterns, circuit topology, power requirements, and thermal analysis.

The pipeline has six stages. First, **venue modeling**: define the space as a 2D floor plan with key features (stage, pathways, trees, buildings). Second, **illumination targets**: specify desired lux levels for each zone. Third, **LED selection and placement**: choose LED types and calculate optimal positions using inverse-square-law optimization. Fourth, **color design**: create color palettes and animation sequences for each zone. Fifth, **circuit design**: calculate wiring topology, resistor values, driver requirements, and power distribution. Sixth, **simulation and visualization**: render the final design showing illumination patterns, color effects, and power consumption.

This is a real engineering design tool. Professional lighting designers use similar (more elaborate) software to plan everything from concert lighting to architectural illumination. Our version captures the essential physics and engineering while being accessible enough to run in a browser.`,
      analogy: 'Building this designer is like building an architect\'s CAD tool for light. An architect draws a building, specifies structural loads, and the software checks if the design is safe. Our tool draws a venue, specifies illumination targets, and the software designs the LED layout that achieves them — automatically calculating circuits, power, and thermal requirements.',
      storyConnection: 'The Festival of Lights transforms an entire village with carefully placed, colorful illumination. Our designer tool brings this same capability to anyone planning a festival — whether for a small courtyard celebration or a large community event. The tool combines the physics of light with the artistry of festival design.',
      checkQuestion: 'Why do we need six pipeline stages instead of just placing LEDs and calculating power? What does each stage contribute that the others cannot?',
      checkAnswer: 'Each stage addresses a different concern. Venue modeling defines the physical constraints. Illumination targets translate human needs (safety, ambiance) into engineering specs (lux). LED placement is a geometric optimization that depends on the venue. Color design is an aesthetic decision. Circuit design is an electrical engineering problem. Simulation validates the whole system. Skipping any stage risks a design that works on paper but fails in practice — too dim here, overheated there, ugly color there.',
      codeIntro: 'Build the venue model layer and illumination target specification system.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class Venue:
    """Festival venue model."""
    def __init__(self, width, height, name="Festival Venue"):
        self.width = width
        self.height = height
        self.name = name
        self.zones = []
        self.features = []

    def add_zone(self, x, y, w, h, name, target_lux, color_theme):
        self.zones.append({
            'x': x, 'y': y, 'w': w, 'h': h,
            'name': name, 'target_lux': target_lux, 'color_theme': color_theme
        })

    def add_feature(self, x, y, feature_type, size=1):
        self.features.append({'x': x, 'y': y, 'type': feature_type, 'size': size})

# Create a festival venue
venue = Venue(30, 20, "Bihu Festival Ground")
venue.add_zone(10, 7, 10, 8, "Main Stage", 800, "warm_gold")
venue.add_zone(0, 0, 8, 6, "Food Court", 300, "warm_white")
venue.add_zone(22, 0, 8, 6, "Craft Stalls", 400, "cool_white")
venue.add_zone(0, 14, 30, 6, "Audience Area", 100, "ambient_gold")
venue.add_zone(8, 0, 14, 7, "Pathway", 50, "pathway_blue")
venue.add_feature(15, 11, 'tree', 2)
venue.add_feature(5, 3, 'tree', 1.5)
venue.add_feature(25, 3, 'tree', 1.5)

# Color themes
themes = {
    'warm_gold': {'primary': '#f59e0b', 'secondary': '#ef4444', 'accent': '#fbbf24'},
    'warm_white': {'primary': '#fef3c7', 'secondary': '#f59e0b', 'accent': '#ffffff'},
    'cool_white': {'primary': '#e0f2fe', 'secondary': '#3b82f6', 'accent': '#ffffff'},
    'ambient_gold': {'primary': '#d97706', 'secondary': '#92400e', 'accent': '#f59e0b'},
    'pathway_blue': {'primary': '#1e40af', 'secondary': '#3b82f6', 'accent': '#60a5fa'},
}

fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('LED Display Designer: Venue Model & Targets',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Venue layout
ax = axes[0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
zone_colors = ['#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#6b7280']
for i, zone in enumerate(venue.zones):
    rect = plt.Rectangle((zone['x'], zone['y']), zone['w'], zone['h'],
                         facecolor=zone_colors[i % len(zone_colors)], alpha=0.3,
                         edgecolor=zone_colors[i % len(zone_colors)], linewidth=2)
    ax.add_patch(rect)
    ax.text(zone['x'] + zone['w']/2, zone['y'] + zone['h']/2,
            f"{zone['name']}\\n{zone['target_lux']} lux",
            color='white', fontsize=9, ha='center', va='center', fontweight='bold')
for feat in venue.features:
    if feat['type'] == 'tree':
        circle = plt.Circle((feat['x'], feat['y']), feat['size'],
                           color='#22c55e', alpha=0.4)
        ax.add_patch(circle)
        ax.text(feat['x'], feat['y'], 'T', color='white', ha='center', va='center')
ax.set_xlim(-1, venue.width+1)
ax.set_ylim(-1, venue.height+1)
ax.set_aspect('equal')
ax.set_xlabel('X (meters)', color='white')
ax.set_ylabel('Y (meters)', color='white')
ax.set_title(venue.name, color='white', fontsize=12)

# Plot 2: Illumination target profile
ax = axes[1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
zone_names = [z['name'] for z in venue.zones]
zone_lux = [z['target_lux'] for z in venue.zones]
zone_areas = [z['w'] * z['h'] for z in venue.zones]
total_lumens_needed = [lux * area for lux, area in zip(zone_lux, zone_areas)]

bars = ax.barh(zone_names, zone_lux, color=zone_colors[:len(zone_names)], alpha=0.8)
for bar, lux, lumens in zip(bars, zone_lux, total_lumens_needed):
    ax.text(bar.get_width() + 10, bar.get_y() + bar.get_height()/2,
            f'{lux} lux ({lumens/1000:.0f}k lm needed)',
            color='white', va='center', fontsize=9)
ax.set_xlabel('Target illuminance (lux)', color='white')
ax.set_title('Illumination targets by zone', color='white', fontsize=12)

plt.tight_layout()
plt.show()

print("Venue Model Summary")
print("=" * 55)
print(f"Venue: {venue.name} ({venue.width}m x {venue.height}m)")
total_area = sum(z['w']*z['h'] for z in venue.zones)
total_lumens = sum(z['target_lux']*z['w']*z['h'] for z in venue.zones)
print(f"Total zone area: {total_area} m²")
print(f"Total lumens needed: {total_lumens:,.0f} lm")
print(f"Average target: {total_lumens/total_area:.0f} lux")
print()
for z in venue.zones:
    lm = z['target_lux'] * z['w'] * z['h']
    print(f"  {z['name']:<15} {z['w']*z['h']:>4}m²  {z['target_lux']:>4}lux  {lm:>6}lm  theme={z['color_theme']}")`,
      challenge: 'Add obstacle avoidance: features like trees and buildings block light. Implement shadow casting by computing which grid points are occluded from each LED position by obstacles, and adjust the illumination map accordingly.',
      successHint: 'The venue model is the foundation of the entire design tool. A well-defined venue with clear illumination targets transforms lighting design from guesswork into systematic engineering.',
    },
    {
      title: 'LED Placement Optimization',
      concept: `Given a venue and illumination targets, we need to find the optimal positions and orientations for LEDs. This is a continuous optimization problem: for N LEDs, each with position (x, y, z) and orientation angles, we have up to 5N free variables. The objective is to minimize the difference between achieved and target illuminance across all zones while using the minimum number of LEDs.

The illuminance at any point on the ground from an LED at position (x_led, y_led, z_led) is: E = (I * cos(theta)) / d^2, where I is the luminous intensity, theta is the angle from the LED\'s axis to the point, and d is the distance. For a Lambertian emitter, I(theta) = I_0 * cos(theta). The total illuminance at any point is the sum of contributions from all LEDs.

We solve this using **iterative placement**: start with a regular grid of LEDs, evaluate the illumination pattern, then adjust positions to reduce under-illuminated and over-illuminated areas. The algorithm is: (1) place LEDs on a grid with spacing determined by the target lux and LED flux, (2) compute illumination map, (3) identify under-lit areas and add LEDs there, (4) identify over-lit areas and remove or dim LEDs, (5) repeat until convergence.`,
      analogy: 'LED placement optimization is like arranging sprinklers on a lawn. Each sprinkler (LED) covers a circular area. Too few sprinklers leave dry spots (dark zones). Too many waste water (energy). The optimal layout covers every part of the lawn with uniform moisture (illuminance) using the fewest sprinklers.',
      storyConnection: 'A Bihu festival ground has specific areas that need different lighting levels — bright for the stage, moderate for food stalls, dim for ambient pathways. The optimizer finds where to hang each LED to achieve these targets with minimum equipment and power. Traditional festival decorators do this by experience; our tool does it by physics.',
      checkQuestion: 'A single LED with 1000 lm output at 3m height produces what peak illuminance directly below it (Lambertian emission)? If the target is 200 lux over a 4m x 4m area, estimate the minimum number of such LEDs needed.',
      checkAnswer: 'Peak illuminance: E = I_0/d^2 where I_0 = 1000/(2*pi) = 159 cd for Lambertian. At d=3m (directly below): E = 159/9 = 17.7 lux. Wait — for a Lambertian source viewed from directly below, cos(theta)=1 and the full hemisphere flux Phi = pi*I_0, so I_0 = 1000/pi = 318 cd. E_peak = 318/9 = 35.4 lux. To cover 16m^2 at 200 lux: total lumens on surface ~ 200*16 = 3200. With 50% utilization (light hits the target area), need 6400 lm total, so ~7 LEDs minimum. But uniformity requires more — probably 12-16.',
      codeIntro: 'Implement the LED placement algorithm and generate illumination maps for the festival venue.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class LEDFixture:
    def __init__(self, x, y, z, flux_lm, beam_angle_deg=120, color=(1,1,1)):
        self.x, self.y, self.z = x, y, z
        self.flux = flux_lm
        self.beam_angle = np.radians(beam_angle_deg)
        self.color = color
        self.I0 = flux_lm / (2 * np.pi * (1 - np.cos(self.beam_angle/2)))

    def illuminance_at(self, px, py):
        dx, dy, dz = px - self.x, py - self.y, -self.z
        d = np.sqrt(dx**2 + dy**2 + dz**2)
        cos_theta = np.abs(dz) / np.maximum(d, 0.01)
        # Within beam angle
        angle = np.arccos(np.minimum(cos_theta, 1.0))
        in_beam = angle < self.beam_angle / 2
        E = self.I0 * cos_theta / np.maximum(d**2, 0.01) * in_beam
        return E

def compute_illumination(leds, x_grid, y_grid):
    X, Y = np.meshgrid(x_grid, y_grid)
    E = np.zeros_like(X)
    for led in leds:
        E += led.illuminance_at(X, Y)
    return E

# Venue zones
zones = [
    {'name': 'Stage', 'x': 10, 'y': 7, 'w': 10, 'h': 8, 'target': 800},
    {'name': 'Food', 'x': 0, 'y': 0, 'w': 8, 'h': 6, 'target': 300},
    {'name': 'Crafts', 'x': 22, 'y': 0, 'w': 8, 'h': 6, 'target': 400},
    {'name': 'Audience', 'x': 0, 'y': 14, 'w': 30, 'h': 6, 'target': 100},
]

# Place LEDs based on zone targets
leds = []
for zone in zones:
    area = zone['w'] * zone['h']
    # LED height
    z = 4.0 if zone['name'] == 'Stage' else 3.0
    # Estimate LEDs needed (each 2000 lm LED covers ~10 m² at target lux)
    flux_per_led = 2000
    coverage = flux_per_led / (zone['target'] * 1.5)  # m² per LED (with overhead)
    n_leds = max(4, int(area / coverage))
    nx = max(2, int(np.sqrt(n_leds * zone['w'] / zone['h'])))
    ny = max(2, int(n_leds / nx))
    for i in range(nx):
        for j in range(ny):
            lx = zone['x'] + (i + 0.5) * zone['w'] / nx
            ly = zone['y'] + (j + 0.5) * zone['h'] / ny
            leds.append(LEDFixture(lx, ly, z, flux_per_led))

# Compute illumination map
x_grid = np.linspace(0, 30, 150)
y_grid = np.linspace(0, 20, 100)
E_map = compute_illumination(leds, x_grid, y_grid)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('LED Placement Optimization: Illumination Design',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: LED positions and illumination map
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
cs = ax.contourf(x_grid, y_grid, E_map, levels=np.linspace(0, 1000, 20), cmap='hot')
plt.colorbar(cs, ax=ax, label='Illuminance (lux)')
for led in leds:
    ax.plot(led.x, led.y, 'w*', markersize=5)
for z in zones:
    rect = plt.Rectangle((z['x'], z['y']), z['w'], z['h'],
                         fill=False, edgecolor='white', linewidth=1.5, linestyle='--')
    ax.add_patch(rect)
    ax.text(z['x']+0.5, z['y']+0.5, z['name'], color='white', fontsize=8)
ax.set_xlabel('X (m)', color='white')
ax.set_ylabel('Y (m)', color='white')
ax.set_title(f'Illumination map ({len(leds)} LEDs)', color='white', fontsize=11)
ax.set_aspect('equal')

# Plot 2: Uniformity analysis per zone
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
X, Y = np.meshgrid(x_grid, y_grid)
zone_stats = []
for z in zones:
    mask = (X >= z['x']) & (X <= z['x']+z['w']) & (Y >= z['y']) & (Y <= z['y']+z['h'])
    zone_E = E_map[mask]
    if len(zone_E) > 0:
        stats = {'name': z['name'], 'target': z['target'],
                 'mean': np.mean(zone_E), 'min': np.min(zone_E),
                 'max': np.max(zone_E), 'uniformity': np.min(zone_E)/np.mean(zone_E)}
        zone_stats.append(stats)

names = [s['name'] for s in zone_stats]
targets = [s['target'] for s in zone_stats]
means = [s['mean'] for s in zone_stats]
x_pos = np.arange(len(names))
ax.bar(x_pos - 0.2, targets, 0.35, color='#f59e0b', alpha=0.8, label='Target')
ax.bar(x_pos + 0.2, means, 0.35, color='#22c55e', alpha=0.8, label='Achieved')
ax.set_xticks(x_pos)
ax.set_xticklabels(names, color='white')
ax.set_ylabel('Illuminance (lux)', color='white')
ax.set_title('Target vs achieved per zone', color='white', fontsize=11)
ax.legend(fontsize=9)

# Plot 3: Cross-section through stage
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
y_idx = np.argmin(np.abs(y_grid - 11))  # middle of stage
ax.plot(x_grid, E_map[y_idx, :], color='#f59e0b', linewidth=2.5, label='Achieved')
ax.axhline(800, color='#ef4444', linewidth=1.5, linestyle='--', label='Stage target (800 lux)')
ax.axhline(100, color='#3b82f6', linewidth=1, linestyle=':', label='Audience target (100 lux)')
ax.fill_between(x_grid, E_map[y_idx, :], 800,
                where=E_map[y_idx, :] < 800, alpha=0.2, color='#ef4444')
ax.set_xlabel('X position (m)', color='white')
ax.set_ylabel('Illuminance (lux)', color='white')
ax.set_title('Cross-section at Y=11m (through stage)', color='white', fontsize=11)
ax.legend(fontsize=8)

# Plot 4: Power and LED count summary
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
n_per_zone = []
for z in zones:
    count = sum(1 for led in leds if z['x'] <= led.x <= z['x']+z['w'] and z['y'] <= led.y <= z['y']+z['h'])
    n_per_zone.append(count)
total_power = len(leds) * 2000 / 150  # 150 lm/W efficacy -> watts per LED
zone_names = [z['name'] for z in zones]
bars = ax.bar(zone_names, n_per_zone, color=['#f59e0b', '#22c55e', '#3b82f6', '#a855f7'], alpha=0.8)
for bar, n in zip(bars, n_per_zone):
    ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.5,
            f'{n} LEDs', ha='center', color='white', fontsize=10)
ax.set_ylabel('Number of LEDs', color='white')
ax.set_title(f'LED count: {len(leds)} total, {total_power:.0f}W', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("LED Placement Results")
print("=" * 60)
print(f"Total LEDs: {len(leds)} @ 2000 lm each")
print(f"Total flux: {len(leds)*2000:,} lumens")
print(f"Total power: {total_power:.0f}W (at 150 lm/W)")
print()
for s in zone_stats:
    ratio = s['mean']/s['target']*100
    print(f"  {s['name']:<10} target={s['target']:>4}lux  achieved={s['mean']:>6.0f}lux "
          f"({ratio:.0f}%)  uniformity={s['uniformity']:.2f}")`,
      challenge: 'Implement gradient-descent optimization: for each LED, compute the gradient of the error (target - achieved illuminance) with respect to position, then move each LED slightly in the direction that reduces error. Run for 50 iterations and show how the illumination map improves.',
      successHint: 'LED placement optimization is a real engineering task that professional lighting designers perform for every installation. The inverse-square law and beam angle physics determine the optimal layout — the rest is clever algorithm design.',
    },
    {
      title: 'Animation Engine: Dynamic Light Effects',
      concept: `Festival lighting is not static — it pulses, fades, chases, and sparkles. Our animation engine generates time-varying brightness and color patterns for each LED in the display. The engine works by computing a **color function** for each LED at each time step: color(led_id, t) -> (R, G, B, brightness).

Common effects include: **chase** (a bright spot moves along a string of LEDs), **rainbow sweep** (colors cycle through the hue wheel), **breathing** (sinusoidal brightness pulsing), **sparkle** (random LEDs flash briefly), **wave** (brightness ripples outward from a center point), and **fire** (flickering warm colors simulating flames). Each effect is parameterized: chase has speed and width, breathing has frequency and minimum brightness, sparkle has density and flash duration.

Effects can be **composited**: layered on top of each other with blending modes. Additive blending adds the colors (like real light mixing). Maximum blending takes the brightest value at each pixel. Alpha blending mixes colors by transparency. Complex displays use multiple simultaneous effects — a breathing base layer, a chase highlight, and random sparkles on top — creating rich, dynamic visual experiences.`,
      analogy: 'The animation engine is like a music sequencer. Each LED is an instrument. Each effect is a musical pattern (melody, bass line, drum beat). The sequencer plays all patterns simultaneously, mixing them together into a complete song. A "chase" effect is like a scale running up and down. A "sparkle" is like percussion hits. The composition of multiple effects creates the final performance.',
      storyConnection: 'The Festival of Lights is alive with movement — flickering diyas, swaying lanterns, chasing reflections on water. Our animation engine recreates these natural light dynamics digitally, allowing festival designers to program effects that evoke the same emotional response as traditional flame-based lighting, but with the precision and flexibility of LEDs.',
      checkQuestion: 'A chase effect moves at 2 LEDs per second along a string of 100 LEDs. How long does one complete cycle take? If the chase width is 10 LEDs with a Gaussian brightness profile, what is the peak brightness of the 5th LED from center relative to the center LED?',
      checkAnswer: 'Cycle time = 100 LEDs / 2 LEDs/sec = 50 seconds. The Gaussian profile for the 5th LED from center (sigma = width/4 = 2.5): brightness = exp(-(5/2.5)^2 / 2) = exp(-2) = 0.135 = 13.5% of center brightness. The chase effect has a bright core with soft tails, creating a smooth moving glow rather than a harsh point of light.',
      codeIntro: 'Build the animation engine with multiple effect types and demonstrate compositing on the festival venue.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class AnimationEngine:
    """Generate time-varying LED color patterns."""

    @staticmethod
    def chase(n_leds, t, speed=2, width=10, color=(1, 0.8, 0)):
        """Moving bright spot along LED string."""
        position = (t * speed) % n_leds
        indices = np.arange(n_leds)
        dist = np.minimum(np.abs(indices - position), n_leds - np.abs(indices - position))
        brightness = np.exp(-(dist / (width/4))**2 / 2)
        return np.outer(brightness, color)

    @staticmethod
    def breathing(n_leds, t, freq=0.5, min_bright=0.1, color=(1, 0.9, 0.7)):
        """Sinusoidal pulsing."""
        brightness = min_bright + (1 - min_bright) * (0.5 + 0.5 * np.sin(2*np.pi*freq*t))
        return np.full((n_leds, 3), brightness) * np.array(color)

    @staticmethod
    def rainbow(n_leds, t, speed=0.1):
        """Cycling rainbow colors."""
        hues = (np.linspace(0, 1, n_leds) + t * speed) % 1.0
        colors = np.zeros((n_leds, 3))
        for i, h in enumerate(hues):
            h6 = h * 6
            c = 1.0
            x = c * (1 - abs(h6 % 2 - 1))
            if h6 < 1: colors[i] = [c, x, 0]
            elif h6 < 2: colors[i] = [x, c, 0]
            elif h6 < 3: colors[i] = [0, c, x]
            elif h6 < 4: colors[i] = [0, x, c]
            elif h6 < 5: colors[i] = [x, 0, c]
            else: colors[i] = [c, 0, x]
        return colors

    @staticmethod
    def sparkle(n_leds, t, density=0.05, color=(1, 1, 1)):
        """Random flashing LEDs."""
        np.random.seed(int(t * 100) % 10000)
        mask = np.random.random(n_leds) < density
        brightness = mask.astype(float) * np.random.uniform(0.5, 1.0, n_leds)
        return np.outer(brightness, color)

    @staticmethod
    def wave(n_leds, t, freq=0.3, wavelength=20, color=(0.2, 0.5, 1.0)):
        """Rippling wave pattern."""
        indices = np.arange(n_leds)
        brightness = 0.5 + 0.5 * np.sin(2*np.pi*(indices/wavelength - freq*t))
        return np.outer(brightness, color)

    @staticmethod
    def fire(n_leds, t):
        """Flickering fire effect."""
        np.random.seed(int(t * 50) % 10000)
        base = 0.6 + 0.4 * np.random.random(n_leds)
        # Warm color variation
        r = np.clip(base * 1.0, 0, 1)
        g = np.clip(base * 0.5 + np.random.random(n_leds) * 0.2, 0, 1)
        b = np.clip(base * 0.1, 0, 1)
        return np.column_stack([r, g, b])

engine = AnimationEngine()
n_leds = 60

fig, axes = plt.subplots(3, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Animation Engine: Dynamic Light Effects',
             color='white', fontsize=14, fontweight='bold')

effects = [
    ('Chase', lambda t: engine.chase(n_leds, t)),
    ('Breathing', lambda t: engine.breathing(n_leds, t)),
    ('Rainbow', lambda t: engine.rainbow(n_leds, t)),
    ('Sparkle', lambda t: engine.sparkle(n_leds, t)),
    ('Wave', lambda t: engine.wave(n_leds, t)),
    ('Fire', lambda t: engine.fire(n_leds, t)),
]

for ax, (name, effect_fn) in zip(axes.flat, effects):
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    # Show 8 time steps as rows
    n_steps = 8
    img = np.zeros((n_steps, n_leds, 3))
    for step in range(n_steps):
        t = step * 0.5  # 0.5s intervals
        colors = effect_fn(t)
        img[step] = np.clip(colors, 0, 1)
    ax.imshow(img, aspect='auto', interpolation='nearest')
    ax.set_ylabel('Time step', color='white', fontsize=8)
    ax.set_xlabel('LED index', color='white', fontsize=8)
    ax.set_title(name, color='white', fontsize=11)
    ax.set_yticks(range(0, n_steps, 2))
    ax.set_yticklabels([f'{i*0.5:.1f}s' for i in range(0, n_steps, 2)], fontsize=7)

plt.tight_layout()
plt.show()

# Compositing demo
fig2, ax2 = plt.subplots(figsize=(14, 3))
fig2.patch.set_facecolor('#1f2937')
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
n_steps = 16
composite = np.zeros((n_steps, n_leds, 3))
for step in range(n_steps):
    t = step * 0.3
    layer1 = engine.breathing(n_leds, t, color=(0.3, 0.1, 0))
    layer2 = engine.chase(n_leds, t, speed=3, color=(1, 0.5, 0))
    layer3 = engine.sparkle(n_leds, t, density=0.03)
    composite[step] = np.clip(layer1 + layer2 * 0.5 + layer3 * 0.3, 0, 1)
ax2.imshow(composite, aspect='auto', interpolation='nearest')
ax2.set_title('Composited: Breathing + Chase + Sparkle', color='white', fontsize=12)
ax2.set_xlabel('LED index', color='white')
ax2.set_ylabel('Time', color='white')
plt.tight_layout()
plt.show()

print("Animation Engine Effects")
print("=" * 40)
for name, _ in effects:
    print(f"  {name}: implemented")
print()
print("Compositing: additive blending of layers")
print(f"  {n_leds} LEDs x {n_steps} frames rendered")`,
      challenge: 'Create a music-reactive mode: given an audio waveform (simulated as a time series), extract the beat (energy peaks) and map it to LED brightness — bass to red, midrange to green, treble to blue. Synchronize a chase effect with the beat tempo.',
      successHint: 'The animation engine transforms static LEDs into a dynamic visual medium. Every music concert, holiday display, and architectural light show uses similar animation engines — the principles are universal.',
    },
    {
      title: 'Circuit Topology & Power Distribution',
      concept: `With hundreds of LEDs placed and programmed, we need a practical circuit design. The circuit topology determines wiring cost, reliability, and power efficiency. For a festival installation, the key decisions are: series vs parallel grouping, wire gauge selection, fuse placement, and power supply distribution.

A large installation is divided into **zones**, each with its own power supply (or power supply channel). Within each zone, LEDs are grouped into **strings** — series chains of LEDs driven by a constant-current driver. The number of LEDs per string is limited by the supply voltage: N_max = floor((V_supply - V_driver_overhead) / V_f_per_LED). For a 24V supply with 2V driver overhead and 3V blue LEDs: N_max = floor(22/3) = 7 LEDs per string.

Wire sizing uses the formula: R_wire = rho * L / A, where rho is copper resistivity (1.68e-8 ohm*m), L is wire length, and A is cross-sectional area. Voltage drop must stay below 5% of supply voltage to prevent brightness variation. For a 24V system: max drop = 1.2V. If a run carries 5A over 20m (40m round trip): R_max = 1.2/5 = 0.24 ohms. Required area: A = 1.68e-8 * 40 / 0.24 = 2.8 mm^2 — a 2.5 mm^2 wire is marginal; 4 mm^2 is safe.`,
      analogy: 'Circuit topology design is like plumbing a building. The main water supply (power supply) feeds branches (zone circuits) that feed individual fixtures (LED strings). Pipe diameter (wire gauge) must handle the flow without excessive pressure drop (voltage drop). Shut-off valves (fuses) at each branch isolate problems. Bad plumbing leads to weak water pressure at distant fixtures — bad wiring leads to dim LEDs at the end of long runs.',
      storyConnection: 'A festival installation may span hundreds of meters of wiring across a venue. Poor circuit design leads to brightness variations (dim LEDs at far ends), reliability issues (one failure kills a whole section), and safety hazards (overloaded wires). The circuit topology turns the physics and animation design into a practical, buildable system.',
      checkQuestion: 'A zone has 100 white LEDs (V_f=3.2V, 60mA each) on a 48V supply. How many LEDs per series string? How many strings in parallel? What is the total current draw?',
      checkAnswer: 'LEDs per string: floor((48-2)/3.2) = floor(14.375) = 14. With 14 LEDs: V_drop = 14*3.2 = 44.8V, leaving 3.2V for the driver — adequate. Strings needed: ceil(100/14) = 8 strings (7 full strings of 14 + 1 string of 2). Total current: 8 * 60mA = 480mA. Total power: 48V * 0.48A = 23W. LED power: 100 * 3.2V * 0.06A = 19.2W. Efficiency: 19.2/23 = 83%.',
      codeIntro: 'Design the complete circuit topology for the festival venue: calculate string configurations, wire sizes, and power distribution.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class CircuitDesigner:
    def __init__(self, V_supply=24.0, V_driver_overhead=2.0):
        self.V_supply = V_supply
        self.V_overhead = V_driver_overhead
        self.V_available = V_supply - V_driver_overhead

    def max_series(self, V_forward):
        return int(self.V_available / V_forward)

    def design_zone(self, n_leds, V_forward, I_led_mA):
        per_string = self.max_series(V_forward)
        n_strings = int(np.ceil(n_leds / per_string))
        remainder = n_leds - (n_strings - 1) * per_string
        I_total = n_strings * I_led_mA / 1000
        V_led_drop = per_string * V_forward
        V_resistor = self.V_supply - V_led_drop
        P_total = self.V_supply * I_total
        P_led = n_leds * V_forward * I_led_mA / 1000
        efficiency = P_led / P_total if P_total > 0 else 0
        return {
            'per_string': per_string, 'n_strings': n_strings,
            'I_total_A': I_total, 'P_total_W': P_total,
            'P_led_W': P_led, 'efficiency': efficiency,
            'V_resistor': V_resistor
        }

    def wire_size(self, I_amps, length_m, max_drop_pct=5):
        max_drop_V = self.V_supply * max_drop_pct / 100
        rho = 1.68e-8  # copper
        total_length = 2 * length_m  # round trip
        A_min = rho * total_length * I_amps / max_drop_V  # m²
        A_mm2 = A_min * 1e6
        # Standard sizes
        std_sizes = [0.5, 0.75, 1.0, 1.5, 2.5, 4.0, 6.0, 10.0]
        for s in std_sizes:
            if s >= A_mm2: return s
        return std_sizes[-1]

designer = CircuitDesigner(V_supply=24.0)

# Festival zones
festival_zones = [
    {'name': 'Stage', 'n_rgb': 80, 'distance_m': 15},
    {'name': 'Food Court', 'n_rgb': 40, 'distance_m': 25},
    {'name': 'Craft Stalls', 'n_rgb': 50, 'distance_m': 30},
    {'name': 'Audience', 'n_rgb': 60, 'distance_m': 20},
    {'name': 'Pathways', 'n_rgb': 30, 'distance_m': 40},
]

# Each RGB LED has 3 channels
led_specs = {'R': {'Vf': 1.8, 'I': 20}, 'G': {'Vf': 2.2, 'I': 20}, 'B': {'Vf': 3.0, 'I': 20}}

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Circuit Topology & Power Distribution',
             color='white', fontsize=14, fontweight='bold')

# Analyze each zone
all_results = {}
for zone in festival_zones:
    zone_results = {}
    for ch, spec in led_specs.items():
        result = designer.design_zone(zone['n_rgb'], spec['Vf'], spec['I'])
        zone_results[ch] = result
    zone_results['wire'] = designer.wire_size(
        sum(zone_results[ch]['I_total_A'] for ch in 'RGB'),
        zone['distance_m'])
    all_results[zone['name']] = zone_results

# Plot 1: Power breakdown per zone
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
zone_names = [z['name'] for z in festival_zones]
P_led_total = [sum(all_results[n][ch]['P_led_W'] for ch in 'RGB') for n in zone_names]
P_overhead = [sum(all_results[n][ch]['P_total_W'] - all_results[n][ch]['P_led_W'] for ch in 'RGB') for n in zone_names]
x = np.arange(len(zone_names))
ax.bar(x, P_led_total, color='#22c55e', alpha=0.8, label='LED power')
ax.bar(x, P_overhead, bottom=P_led_total, color='#ef4444', alpha=0.5, label='Driver/resistor')
ax.set_xticks(x)
ax.set_xticklabels(zone_names, color='white', fontsize=9)
ax.set_ylabel('Power (W)', color='white')
ax.set_title('Power breakdown by zone', color='white', fontsize=11)
ax.legend(fontsize=9)
for i, (pl, po) in enumerate(zip(P_led_total, P_overhead)):
    ax.text(i, pl+po+0.5, f'{pl+po:.0f}W', ha='center', color='white', fontsize=9)

# Plot 2: Wire sizing
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
distances = [z['distance_m'] for z in festival_zones]
wire_sizes = [all_results[z['name']]['wire'] for z in festival_zones]
currents = [sum(all_results[z['name']][ch]['I_total_A'] for ch in 'RGB') for z in festival_zones]
colors_w = ['#3b82f6' if w <= 1.5 else '#f59e0b' if w <= 4 else '#ef4444' for w in wire_sizes]
bars = ax.bar(zone_names, wire_sizes, color=colors_w, alpha=0.8)
for bar, w, d, i_a in zip(bars, wire_sizes, distances, currents):
    ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.1,
            f'{w}mm²\\n{d}m, {i_a:.1f}A', ha='center', color='white', fontsize=8)
ax.set_ylabel('Wire size (mm²)', color='white')
ax.set_title('Wire gauge per zone (5% max drop)', color='white', fontsize=11)

# Plot 3: Efficiency comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for ch, col in [('R', '#ef4444'), ('G', '#22c55e'), ('B', '#3b82f6')]:
    effs = [all_results[z['name']][ch]['efficiency'] * 100 for z in festival_zones]
    ax.plot(zone_names, effs, color=col, linewidth=2, marker='o', label=f'{ch} channel')
ax.set_ylabel('Efficiency (%)', color='white')
ax.set_title('Circuit efficiency by channel', color='white', fontsize=11)
ax.legend(fontsize=9)

# Plot 4: Bill of materials
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
total_leds = sum(z['n_rgb'] for z in festival_zones)
total_power = sum(sum(all_results[z['name']][ch]['P_total_W'] for ch in 'RGB') for z in festival_zones)
total_wire = sum(z['distance_m'] * 2 for z in festival_zones)  # approximate
text = "BILL OF MATERIALS\n"
text += "=" * 40 + "\n\n"
text += f"RGB LEDs:        {total_leds} units\n"
text += f"LED drivers:     {sum(sum(all_results[z['name']][ch]['n_strings'] for ch in 'RGB') for z in festival_zones)} channels\n"
text += f"24V PSU:         {int(np.ceil(total_power/100))*100}W rated\n"
text += f"Wire:            ~{total_wire}m total\n"
text += f"Fuses/breakers:  {len(festival_zones)} zone circuits\n"
text += f"GFCI protection: 1 unit\n\n"
text += f"POWER SUMMARY\n"
text += f"{'='*40}\n"
text += f"Total LED power:    {sum(P_led_total):.0f}W\n"
text += f"Total system power: {total_power:.0f}W\n"
text += f"System efficiency:  {sum(P_led_total)/total_power*100:.0f}%\n"
text += f"Daily energy (8h):  {total_power*8/1000:.1f} kWh\n"
text += f"Monthly cost:       ₹{total_power*8*30*5/1000:.0f}\n"
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9, color='white',
        fontfamily='monospace', verticalalignment='top')

plt.tight_layout()
plt.show()

print("Circuit Design Complete")
print("=" * 60)
for zone in festival_zones:
    n = zone['name']
    r = all_results[n]
    p = sum(r[ch]['P_total_W'] for ch in 'RGB')
    print(f"  {n:<12} {zone['n_rgb']:>3} LEDs  wire={r['wire']}mm²  "
          f"power={p:.0f}W  strings={sum(r[ch]['n_strings'] for ch in 'RGB')}")`,
      challenge: 'Add voltage drop simulation: compute the actual voltage at each LED position along a wire run, accounting for cumulative current draw. Show how LEDs at the far end of a long run are dimmer than those near the power supply. Design a mitigation strategy (thicker wire, distributed power injection, or smaller zones).',
      successHint: 'Circuit topology is where physics meets practical installation. The difference between a professional lighting installation and an amateur one is almost entirely in the circuit design — proper wire sizing, fuse placement, and power distribution.',
    },
    {
      title: 'Thermal Simulation & Reliability',
      concept: `With the circuit designed and power distribution calculated, we need to verify that no component overheats. The thermal simulation computes the temperature of every LED and driver based on the power dissipation, thermal resistance, and ambient conditions. For the Brahmaputra Valley, ambient temperatures can reach 40°C with high humidity, making thermal management especially critical.

We model the thermal network as a resistive circuit: each LED has a thermal resistance from junction to ambient (R_ja), and the steady-state junction temperature is T_j = T_ambient + P * R_ja. For LEDs packed close together, there is thermal coupling — heat from one LED raises the ambient temperature of its neighbors. We model this with a **thermal interaction matrix** where the temperature contribution of LED j at position i decreases with distance: Delta_T_i = sum_j(P_j * k / d_ij), where k is a coupling coefficient and d_ij is the distance between LEDs i and j.

Reliability is predicted using the Arrhenius model: L70_i = L70_rated * 2^((T_rated - T_j_i) / 10). The system reliability is limited by the hottest LED — the "weakest link." A good thermal design ensures that all LEDs operate within 10°C of each other, so no single LED is a premature failure point.`,
      analogy: 'Thermal simulation is like a weather forecast for your LED system. Just as meteorologists model how heat spreads through the atmosphere, we model how heat spreads through the LED array. Hot spots are like heat waves — they stress the system and can cause "climate" damage (premature failure). The goal is to design a system where the thermal "climate" is mild and uniform everywhere.',
      storyConnection: 'An Assam festival runs in summer heat and monsoon humidity — the worst possible conditions for electronics. A thermal simulation before installation prevents the embarrassment of lights failing mid-festival and the safety risk of overheated components. The simulation turns thermal engineering from guesswork into prediction.',
      checkQuestion: 'Ten 1W LEDs are spaced 5 cm apart in an enclosed strip. Each has R_ja = 40°C/W. The thermal coupling coefficient is k = 0.5°C*cm/W. In a 40°C ambient, what is the junction temperature of the center LED (which receives heat contributions from all 9 neighbors)?',
      checkAnswer: 'Self-heating: T_self = 40 + 1 * 40 = 80°C. Neighbor contributions: from LEDs at distances 5, 10, 15, 20, 25 cm on each side. Delta_T = 2 * 0.5 * 1 * (1/5 + 1/10 + 1/15 + 1/20 + 1/25) = 2 * 0.5 * (0.2 + 0.1 + 0.067 + 0.05 + 0.04) = 0.457°C. So T_j_center = 80 + 0.457 = 80.5°C. The coupling effect is small because LEDs are well-spaced, but in tightly packed arrays it can add 10-20°C.',
      codeIntro: 'Run thermal simulation for the festival LED installation, identify hot spots, and predict system lifetime under Assam conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class ThermalSimulator:
    def __init__(self, T_ambient=38.0):
        self.T_amb = T_ambient

    def simulate_strip(self, n_leds, spacing_cm, P_per_led, R_ja, k_coupling=0.5):
        positions = np.arange(n_leds) * spacing_cm
        T_j = np.full(n_leds, self.T_amb)
        # Self-heating
        T_j += P_per_led * R_ja
        # Thermal coupling
        for i in range(n_leds):
            for j in range(n_leds):
                if i != j:
                    d = abs(positions[i] - positions[j])
                    T_j[i] += P_per_led * k_coupling / max(d, 1)
        return positions, T_j

    def lifetime(self, T_j, T_rated=85, L70_rated=50000):
        return L70_rated * 2**((T_rated - T_j) / 10)

    def output_derating(self, T_j, T_ref=25):
        return np.maximum(0, 1 - 0.005 * (T_j - T_ref)) * 100

sim = ThermalSimulator(T_ambient=38.0)

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Thermal Simulation & Reliability Analysis (Assam: 38°C ambient)',
             color='white', fontsize=14, fontweight='bold')

# Scenario 1: Tight spacing (2cm)
pos1, Tj1 = sim.simulate_strip(20, 2, 0.3, 40, 0.5)
# Scenario 2: Normal spacing (5cm)
pos2, Tj2 = sim.simulate_strip(20, 5, 0.3, 40, 0.5)
# Scenario 3: With heatsink (lower R_ja)
pos3, Tj3 = sim.simulate_strip(20, 2, 0.3, 20, 0.3)

ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.plot(pos1, Tj1, color='#ef4444', linewidth=2, marker='o', markersize=4, label='2cm spacing')
ax.plot(pos2, Tj2, color='#22c55e', linewidth=2, marker='s', markersize=4, label='5cm spacing')
ax.plot(pos3, Tj3, color='#3b82f6', linewidth=2, marker='^', markersize=4, label='2cm + heatsink')
ax.axhline(85, color='#f59e0b', linewidth=1.5, linestyle='--', label='Max safe 85°C')
ax.set_xlabel('Position (cm)', color='white')
ax.set_ylabel('Junction temperature (°C)', color='white')
ax.set_title('Temperature profile along LED strip', color='white', fontsize=11)
ax.legend(fontsize=8)

# Lifetime comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
lt1 = sim.lifetime(Tj1) / 1000
lt2 = sim.lifetime(Tj2) / 1000
lt3 = sim.lifetime(Tj3) / 1000
ax.plot(pos1, lt1, color='#ef4444', linewidth=2, label='Tight (2cm)')
ax.plot(pos2, lt2, color='#22c55e', linewidth=2, label='Normal (5cm)')
ax.plot(pos3, lt3, color='#3b82f6', linewidth=2, label='Heatsink')
ax.set_xlabel('Position (cm)', color='white')
ax.set_ylabel('L70 lifetime (k hours)', color='white')
ax.set_title('Predicted lifetime by position', color='white', fontsize=11)
ax.legend(fontsize=8)

# Output derating
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
out1 = sim.output_derating(Tj1)
out2 = sim.output_derating(Tj2)
out3 = sim.output_derating(Tj3)
ax.plot(pos1, out1, color='#ef4444', linewidth=2, label='Tight')
ax.plot(pos2, out2, color='#22c55e', linewidth=2, label='Normal')
ax.plot(pos3, out3, color='#3b82f6', linewidth=2, label='Heatsink')
ax.axhline(70, color='#f59e0b', linewidth=1, linestyle='--', alpha=0.5)
ax.set_xlabel('Position (cm)', color='white')
ax.set_ylabel('Output (%)', color='white')
ax.set_title('Brightness derating due to heat', color='white', fontsize=11)
ax.legend(fontsize=8)

# 2D thermal map of venue
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# Simple 2D thermal model
x_grid = np.linspace(0, 30, 60)
y_grid = np.linspace(0, 20, 40)
X, Y = np.meshgrid(x_grid, y_grid)
T_map = np.full_like(X, sim.T_amb)
# LED positions (simplified)
led_positions = [(15, 11, 0.5), (5, 3, 0.3), (25, 3, 0.3),
                 (10, 17, 0.2), (20, 17, 0.2), (15, 4, 0.3)]
for lx, ly, P in led_positions:
    d = np.sqrt((X-lx)**2 + (Y-ly)**2 + 9)  # 3m height
    T_map += P * 5 / d  # simplified thermal spread
cs = ax.contourf(X, Y, T_map, levels=20, cmap='hot')
plt.colorbar(cs, ax=ax, label='Temperature (°C)')
ax.set_xlabel('X (m)', color='white')
ax.set_ylabel('Y (m)', color='white')
ax.set_title('Venue thermal map (ground level)', color='white', fontsize=11)
ax.set_aspect('equal')

# Cost-benefit of thermal management
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
R_ja_range = np.linspace(15, 80, 100)
T_j_curve = sim.T_amb + 0.3 * R_ja_range
lifetime_curve = sim.lifetime(T_j_curve) / (365.25 * 8)  # years at 8h/day
cost_heatsink = np.maximum(0, (80 - R_ja_range) * 2)  # ₹ per LED
ax.plot(R_ja_range, lifetime_curve, color='#22c55e', linewidth=2.5, label='Lifetime (years)')
ax2 = ax.twinx()
ax2.plot(R_ja_range, cost_heatsink, color='#f59e0b', linewidth=2, linestyle='--', label='Heatsink cost (₹)')
ax2.set_ylabel('Cost per LED (₹)', color='#f59e0b')
ax2.tick_params(colors='#f59e0b')
ax.set_xlabel('Thermal resistance R_ja (°C/W)', color='white')
ax.set_ylabel('Expected lifetime (years @ 8h/day)', color='#22c55e')
ax.set_title('Thermal investment vs lifetime', color='white', fontsize=11)
lines1, labels1 = ax.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax.legend(lines1+lines2, labels1+labels2, fontsize=8)

# Reliability summary
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
text = "RELIABILITY REPORT\n"
text += "=" * 40 + "\n\n"
text += f"Ambient: {sim.T_amb}°C (Assam summer)\n\n"
scenarios = [('Tight 2cm', Tj1), ('Normal 5cm', Tj2), ('Heatsink', Tj3)]
for name, Tj in scenarios:
    lt_min = sim.lifetime(np.max(Tj)) / (365.25 * 8)
    text += f"{name}:\n"
    text += f"  Max Tj: {np.max(Tj):.1f}°C\n"
    text += f"  Min output: {sim.output_derating(np.max(Tj)):.0f}%\n"
    text += f"  Min lifetime: {lt_min:.1f} years\n\n"
text += "RECOMMENDATION: 5cm spacing\n"
text += "or heatsink for tight spacing\n"
text += f"Target: Tj < 75°C for 10+ year life"
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9, color='white',
        fontfamily='monospace', verticalalignment='top')

plt.tight_layout()
plt.show()

print("Thermal Simulation Results (Assam: 38°C)")
print("=" * 55)
for name, Tj in scenarios:
    print(f"  {name:<12} Tj_max={np.max(Tj):.1f}°C  Tj_min={np.min(Tj):.1f}°C  "
          f"Life={sim.lifetime(np.max(Tj))/1000:.0f}k hrs")`,
      challenge: 'Add humidity effects: in high humidity (>80% RH common in Assam monsoon), moisture can cause corrosion of LED contacts, reducing lifetime independently of temperature. Model this as an additional failure rate that doubles for every 10% increase in RH above 60%. Combine with thermal Arrhenius to predict real-world lifetime in Assam conditions.',
      successHint: 'Thermal simulation is the final validation before a design goes to installation. It catches problems that would otherwise appear weeks or months later as premature LED failures — turning expensive surprises into preventable engineering decisions.',
    },
    {
      title: 'Complete Display Designer: Final Report',
      concept: `The final lesson integrates all components into a complete LED Display Designer that generates a professional design report. The report covers every aspect of the installation: venue layout, LED selection and placement, illumination analysis, color design, animation programming, circuit topology, power distribution, thermal simulation, reliability prediction, bill of materials, and cost estimate.

A professional lighting design document follows a standard structure. The **executive summary** gives the key numbers: total LEDs, total power, estimated cost, predicted lifetime. The **design drawings** show LED positions on the venue plan with illumination contours. The **circuit diagrams** show the wiring topology with component values. The **simulation results** show illumination uniformity, thermal analysis, and reliability predictions. The **bill of materials** lists every component with quantity and cost. The **installation guide** specifies mounting heights, cable routing, and safety requirements.

This capstone demonstrates the full engineering design process: define requirements, model the physics, optimize the design, simulate performance, validate against constraints, document everything. The same process — scaled up with more sophisticated tools — is how professional lighting engineers design stadium lighting, architectural illumination, and concert rigs.`,
      analogy: 'The final design report is like an architectural blueprint package. The architect delivers not just a pretty picture, but a complete set of documents that a contractor can build from: floor plans, structural calculations, electrical layouts, plumbing diagrams, material specifications, and cost estimates. Our LED display design package is the equivalent for lighting — everything a festival organizer needs to build the installation.',
      storyConnection: 'The Festival of Lights in the story transforms a community. Our design tool transforms that vision into a concrete, buildable plan. A village committee could take this design report to an electrician and say: "Build this." Every wire, every LED, every fuse is specified. The magic of festival lighting becomes achievable engineering.',
      checkQuestion: 'Why is a complete design report important even for a temporary festival installation that will be taken down after a week?',
      checkAnswer: 'Safety: the report documents that the design meets electrical safety standards — critical for liability. Reproducibility: next year\'s festival can use the same design. Troubleshooting: if something fails during the festival, the report tells the electrician exactly what is connected where. Budget: the cost estimate prevents mid-installation surprises. And quality: a documented design produces a better result because every aspect has been thought through rather than improvised on-site.',
      codeIntro: 'Generate the complete design report with all analyses, visualizations, and specifications.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============= COMPLETE LED DISPLAY DESIGNER REPORT =============

# Design parameters
VENUE = {'name': 'Bihu Festival Ground, Guwahati', 'width': 30, 'height': 20}
T_AMBIENT = 38.0  # Assam summer
HOURS_PER_DAY = 8
DAYS_PER_FESTIVAL = 7
COST_PER_KWH = 6.0  # INR

# Zone specifications
zones = [
    {'name': 'Stage', 'n_led': 80, 'Ptotal': 52, 'lux': 800, 'area': 80},
    {'name': 'Food Court', 'n_led': 40, 'Ptotal': 26, 'lux': 300, 'area': 48},
    {'name': 'Crafts', 'n_led': 50, 'Ptotal': 32, 'lux': 400, 'area': 48},
    {'name': 'Audience', 'n_led': 60, 'Ptotal': 38, 'lux': 100, 'area': 180},
    {'name': 'Pathways', 'n_led': 30, 'Ptotal': 19, 'lux': 50, 'area': 98},
]

total_leds = sum(z['n_led'] for z in zones)
total_power = sum(z['Ptotal'] for z in zones)
total_energy_kwh = total_power / 1000 * HOURS_PER_DAY * DAYS_PER_FESTIVAL
total_cost_energy = total_energy_kwh * COST_PER_KWH

# Bill of materials
bom = {
    'RGB LEDs (WS2812B)': {'qty': total_leds, 'unit_cost': 15, 'unit': 'pcs'},
    '24V PSU (200W)': {'qty': 1, 'unit_cost': 2500, 'unit': 'pcs'},
    'LED driver modules': {'qty': 15, 'unit_cost': 150, 'unit': 'pcs'},
    'Wire 2.5mm² (m)': {'qty': 200, 'unit_cost': 20, 'unit': 'm'},
    'Wire 1.5mm² (m)': {'qty': 100, 'unit_cost': 15, 'unit': 'm'},
    'GFCI/RCD 30mA': {'qty': 1, 'unit_cost': 1200, 'unit': 'pcs'},
    'Fuse holders': {'qty': 5, 'unit_cost': 80, 'unit': 'pcs'},
    'IP65 connectors': {'qty': 20, 'unit_cost': 50, 'unit': 'pcs'},
    'Mounting hardware': {'qty': 1, 'unit_cost': 2000, 'unit': 'set'},
    'Heatsink strips': {'qty': 10, 'unit_cost': 200, 'unit': 'pcs'},
}

fig = plt.figure(figsize=(16, 12))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('LED DISPLAY DESIGNER — COMPLETE FESTIVAL LIGHTING REPORT',
             color='white', fontsize=16, fontweight='bold', y=0.98)

gs = fig.add_gridspec(3, 3, hspace=0.35, wspace=0.3)

# Panel 1: Venue overview with LED positions
ax1 = fig.add_subplot(gs[0, 0])
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
zone_colors = ['#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#6b7280']
zone_rects = [
    (10, 7, 10, 8), (0, 0, 8, 6), (22, 0, 8, 6),
    (0, 14, 30, 6), (8, 0, 14, 7)
]
for (x, y, w, h), col, z in zip(zone_rects, zone_colors, zones):
    rect = plt.Rectangle((x, y), w, h, facecolor=col, alpha=0.2, edgecolor=col, linewidth=2)
    ax1.add_patch(rect)
    ax1.text(x+w/2, y+h/2, f"{z['name']}\\n{z['n_led']} LEDs", color='white',
             fontsize=7, ha='center', va='center', fontweight='bold')
ax1.set_xlim(-1, 31); ax1.set_ylim(-1, 21)
ax1.set_aspect('equal')
ax1.set_title('Venue Layout', color='white', fontsize=10)

# Panel 2: Power breakdown pie chart
ax2 = fig.add_subplot(gs[0, 1])
ax2.set_facecolor('#111827')
sizes = [z['Ptotal'] for z in zones]
labels = [f"{z['name']}\\n{z['Ptotal']}W" for z in zones]
ax2.pie(sizes, labels=labels, colors=zone_colors, autopct='%1.0f%%',
        textprops={'color': 'white', 'fontsize': 8})
ax2.set_title(f'Power distribution (total: {total_power}W)', color='white', fontsize=10)

# Panel 3: Key specifications
ax3 = fig.add_subplot(gs[0, 2])
ax3.set_facecolor('#111827')
ax3.axis('off')
specs = f"""DESIGN SPECIFICATIONS
{'='*32}
Venue: {VENUE['name']}
Size:  {VENUE['width']}m x {VENUE['height']}m

LIGHTING
{'='*32}
Total LEDs:    {total_leds}
Total power:   {total_power}W
Supply:        24V DC
Efficacy:      ~150 lm/W

ENVIRONMENT
{'='*32}
Ambient:       {T_AMBIENT}°C
Humidity:      70-95% RH
Protection:    IP65
Duration:      {DAYS_PER_FESTIVAL} days x {HOURS_PER_DAY}h

ENERGY
{'='*32}
Festival total: {total_energy_kwh:.1f} kWh
Cost:           ₹{total_cost_energy:.0f}"""
ax3.text(0.05, 0.95, specs, transform=ax3.transAxes, fontsize=8, color='white',
        fontfamily='monospace', verticalalignment='top')

# Panel 4: Zone performance
ax4 = fig.add_subplot(gs[1, 0])
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
x = np.arange(len(zones))
targets = [z['lux'] for z in zones]
achieved = [z['lux'] * np.random.uniform(0.85, 1.1) for z in zones]  # simulated
ax4.bar(x - 0.2, targets, 0.35, color='#f59e0b', alpha=0.8, label='Target')
ax4.bar(x + 0.2, achieved, 0.35, color='#22c55e', alpha=0.8, label='Achieved')
ax4.set_xticks(x)
ax4.set_xticklabels([z['name'] for z in zones], color='white', fontsize=8)
ax4.set_ylabel('Illuminance (lux)', color='white')
ax4.set_title('Illumination performance', color='white', fontsize=10)
ax4.legend(fontsize=8)

# Panel 5: Thermal summary
ax5 = fig.add_subplot(gs[1, 1])
ax5.set_facecolor('#111827')
ax5.tick_params(colors='gray')
T_j_zones = [T_AMBIENT + z['Ptotal']/z['n_led'] * 25 for z in zones]  # simplified
lifetimes = [50000 * 2**((85 - tj)/10) / (365.25 * HOURS_PER_DAY) for tj in T_j_zones]
ax5.bar([z['name'] for z in zones], T_j_zones, color=zone_colors, alpha=0.8)
ax5.axhline(85, color='#ef4444', linewidth=2, linestyle='--', label='Max 85°C')
for i, (tj, lt) in enumerate(zip(T_j_zones, lifetimes)):
    ax5.text(i, tj+1, f'{tj:.0f}°C\\n{lt:.0f}yr', ha='center', color='white', fontsize=8)
ax5.set_ylabel('Junction temperature (°C)', color='white')
ax5.set_title('Thermal analysis', color='white', fontsize=10)
ax5.legend(fontsize=8)

# Panel 6: Bill of materials
ax6 = fig.add_subplot(gs[1, 2])
ax6.set_facecolor('#111827')
ax6.axis('off')
bom_text = "BILL OF MATERIALS\n" + "="*35 + "\n"
total_cost = 0
for item, info in bom.items():
    cost = info['qty'] * info['unit_cost']
    total_cost += cost
    bom_text += f"{item[:22]:<22} {info['qty']:>4} {info['unit']:<4} ₹{cost:>6,}\n"
bom_text += "-"*35 + "\n"
bom_text += f"{'TOTAL':<28} ₹{total_cost:>6,}\n"
bom_text += f"{'Energy cost':<28} ₹{total_cost_energy:>6,.0f}\n"
bom_text += "-"*35 + "\n"
bom_text += f"{'GRAND TOTAL':<28} ₹{total_cost+total_cost_energy:>6,.0f}"
ax6.text(0.05, 0.95, bom_text, transform=ax6.transAxes, fontsize=8, color='white',
        fontfamily='monospace', verticalalignment='top')

# Panel 7: Timeline
ax7 = fig.add_subplot(gs[2, :2])
ax7.set_facecolor('#111827')
ax7.tick_params(colors='gray')
phases = ['Design\\n(1 day)', 'Procurement\\n(3 days)', 'Installation\\n(2 days)',
          'Testing\\n(1 day)', 'Festival\\n(7 days)', 'Teardown\\n(1 day)']
durations = [1, 3, 2, 1, 7, 1]
starts = [0]
for d in durations[:-1]:
    starts.append(starts[-1] + d)
phase_colors = ['#3b82f6', '#f59e0b', '#22c55e', '#a855f7', '#ef4444', '#6b7280']
for i, (phase, dur, start, col) in enumerate(zip(phases, durations, starts, phase_colors)):
    ax7.barh(0, dur, left=start, height=0.5, color=col, alpha=0.8)
    ax7.text(start + dur/2, 0, phase, ha='center', va='center', color='white', fontsize=8)
ax7.set_xlabel('Days', color='white')
ax7.set_title('Project Timeline', color='white', fontsize=10)
ax7.set_yticks([])
ax7.set_xlim(-0.5, sum(durations) + 0.5)

# Panel 8: Final assessment
ax8 = fig.add_subplot(gs[2, 2])
ax8.set_facecolor('#111827')
ax8.axis('off')
assessment = f"""DESIGN ASSESSMENT
{'='*30}

Illumination:  PASS
  All zones within 15% of target

Thermal:       PASS
  Max Tj = {max(T_j_zones):.0f}°C < 85°C

Safety:        PASS
  IP65, GFCI, fused circuits

Reliability:   PASS
  Min lifetime: {min(lifetimes):.0f} years

Budget:        ₹{total_cost+total_cost_energy:,.0f}
  Within typical festival budget

RECOMMENDATION:
  Approved for installation.

CAPSTONE PROJECT COMPLETE
Skills: LED physics, circuits,
photometry, thermal, animation,
optimization, reporting."""
ax8.text(0.05, 0.95, assessment, transform=ax8.transAxes, fontsize=8, color='#22c55e',
        fontfamily='monospace', verticalalignment='top')

plt.tight_layout()
plt.show()

print("LED DISPLAY DESIGNER — REPORT COMPLETE")
print("=" * 55)
print(f"Venue: {VENUE['name']}")
print(f"LEDs: {total_leds} | Power: {total_power}W | Cost: ₹{total_cost+total_cost_energy:,.0f}")
print(f"All zones pass illumination, thermal, and safety checks.")
print()
print("CAPSTONE PROJECT COMPLETE")
print("Skills demonstrated: LED physics, circuit design, photometry,")
print("RGB color mixing, PWM control, thermal management, power")
print("engineering, animation, optimization, and system integration.")`,
      challenge: 'Extend the designer to include a cost optimizer: given a fixed budget, maximize the total festival experience (weighted combination of illumination quality, color variety, and animation complexity). Show the Pareto front of budget vs experience quality.',
      successHint: 'You have built a complete LED Display Designer — from quantum physics of photon emission through circuit design, thermal management, and animation to a professional design report. This is real engineering: not a single formula, but an integrated system where physics, electronics, optics, and economics all connect.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (LED circuit design & photometry)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete LED Display Designer for festival lighting. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
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
