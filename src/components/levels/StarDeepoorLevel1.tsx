import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function StarDeepoorLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What are stars? — Nuclear furnaces in the sky',
      concept: `In the story, a star fell into Deepor Beel. But what exactly IS a star? A star is a massive ball of hot gas (mostly hydrogen and helium) held together by gravity, with a nuclear fusion reactor at its core.

At the core of our Sun, the temperature reaches **15 million °C** and the pressure is 250 billion atmospheres. Under these extreme conditions, hydrogen nuclei (protons) fuse together to form helium:

**4 H → He + energy** (the proton-proton chain)

This reaction converts a tiny amount of mass into a huge amount of energy, following Einstein's E = mc². The Sun converts **4 million tonnes of matter into energy every second** and has been doing so for 4.6 billion years.

Stars are classified by surface temperature and luminosity:
- **O stars**: blue-white, >30,000 K, 10,000-1,000,000× Sun's luminosity (rare, short-lived)
- **B stars**: blue-white, 10,000-30,000 K
- **A stars**: white, 7,500-10,000 K (e.g., Sirius)
- **F stars**: yellow-white, 6,000-7,500 K
- **G stars**: yellow, 5,200-6,000 K (our Sun is G2)
- **K stars**: orange, 3,700-5,200 K
- **M stars**: red, <3,700 K (most common, very dim)`,
      analogy: 'A star is like a pressure cooker the size of a million Earths. Gravity pushes inward (the lid), nuclear fusion pushes outward (the steam). As long as these forces balance, the star is stable. When the fuel runs out, the balance breaks — and the star either gently cools down or explodes spectacularly.',
      storyConnection: 'The star that fell into Deepor Beel was likely not a star at all — no actual star could approach Earth without destroying it. It was almost certainly a meteor: a small piece of rock or iron burning up in the atmosphere. But the story captures a real human experience — seeing a brilliant streak of light fall from the sky and splash into water. Ancient people had no way to know the difference between a "falling star" and a real star.',
      checkQuestion: 'The Sun converts 4 million tonnes of mass to energy per second. How long can it keep this up?',
      checkAnswer: 'The Sun\'s mass is about 2 × 10³⁰ kg. But only the core (~10% of the mass) is hot enough for fusion, and only ~0.7% of the hydrogen mass is converted to energy. So the available fuel is about 0.007 × 0.1 × 2×10³⁰ = 1.4 × 10²⁷ kg. At 4 × 10⁹ kg/s, that lasts about 3.5 × 10¹⁷ seconds ≈ 11 billion years. The Sun is 4.6 billion years old — it is roughly middle-aged.',
      codeIntro: 'Plot the Hertzsprung-Russell diagram — the "periodic table" of stellar astronomy.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified HR diagram data
# (Temperature K, Luminosity relative to Sun, Name, Spectral class)
stars = [
    (40000, 500000, 'Rigel', 'B', '#9db4ff'),
    (30000, 100000, 'Spica', 'B', '#aabfff'),
    (10000, 25, 'Sirius', 'A', '#cad7ff'),
    (7500, 5, 'Altair', 'A', '#f8f7ff'),
    (5778, 1, 'Sun', 'G', '#fff4ea'),
    (5000, 0.4, 'Alpha Centauri B', 'K', '#ffd2a1'),
    (3500, 0.04, 'Proxima Centauri', 'M', '#ffcc6f'),
    (3000, 100000, 'Betelgeuse', 'M', '#ff8c42'),
    (4000, 10000, 'Aldebaran', 'K', '#ffa040'),
    (3500, 200, 'Arcturus', 'K', '#ff9030'),
    (10000, 0.01, 'Sirius B (WD)', 'A', '#cad7ff'),
    (7000, 0.001, 'Procyon B (WD)', 'F', '#f8f7ff'),
]

fig, ax = plt.subplots(figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

for temp, lum, name, spec, color in stars:
    size = max(20, min(200, 30 * np.log10(lum + 1) + 50))
    ax.scatter(temp, lum, s=size, color=color, edgecolors='white', linewidths=0.5, zorder=5)
    offset_x = -1500 if temp > 10000 else 500
    offset_y = lum * 0.3 if lum > 1 else lum * 2
    ax.annotate(name, xy=(temp, lum), xytext=(temp + offset_x, lum + offset_y),
                color='white', fontsize=7, fontweight='bold')

# Main sequence band
ms_temp = np.array([40000, 30000, 15000, 10000, 7500, 6000, 5000, 3500])
ms_lum = np.array([500000, 50000, 1000, 25, 5, 1, 0.2, 0.01])
ax.plot(ms_temp, ms_lum, color='gray', linewidth=1, linestyle='--', alpha=0.5)
ax.fill_between(ms_temp, ms_lum * 0.3, ms_lum * 3, alpha=0.05, color='white')
ax.text(15000, 0.5, 'Main Sequence', color='gray', fontsize=9, rotation=-45)

# Regions
ax.text(4000, 80000, 'Red Giants', color='#ff8c42', fontsize=10, fontstyle='italic')
ax.text(15000, 0.002, 'White Dwarfs', color='#cad7ff', fontsize=10, fontstyle='italic')

ax.set_xscale('log'); ax.set_yscale('log')
ax.set_xlim(50000, 2000); ax.set_ylim(0.0005, 2000000)
ax.set_xlabel('Surface Temperature (K)', color='white', fontsize=11)
ax.set_ylabel('Luminosity (× Sun)', color='white', fontsize=11)
ax.set_title('Hertzsprung-Russell Diagram', color='white', fontsize=14)
ax.tick_params(colors='gray')

# Spectral class labels at top
for temp, label in [(35000, 'O'), (20000, 'B'), (9000, 'A'), (7000, 'F'),
                     (5500, 'G'), (4500, 'K'), (3200, 'M')]:
    ax.text(temp, 1500000, label, color='white', fontsize=10, ha='center', fontweight='bold')

plt.tight_layout()
plt.show()

print("The HR diagram organizes stars by temperature and brightness:")
print("  Main Sequence: stable stars fusing hydrogen (Sun is here)")
print("  Red Giants: old, swollen stars running out of fuel")
print("  White Dwarfs: dead cores of small/medium stars")
print()
print("The Sun is a G2 star: yellow, medium-sized, medium-lived.")
print("It will become a red giant in ~5 billion years.")`,
      challenge: 'The most massive star known (R136a1) has ~200× the Sun\'s mass and ~8,000,000× its luminosity. Plot it on the HR diagram. Where does it fall? How long will it live? (Hint: stellar lifetime ∝ Mass/Luminosity)',
      successHint: 'The HR diagram is to astronomers what the periodic table is to chemists — a map that organizes an entire class of objects and predicts their behavior. Every star you see in the night sky has a specific location on this diagram.',
    },
    {
      title: 'Solar system basics — our cosmic neighborhood',
      concept: `Before we can understand what fell into Deepor Beel, we need to know what is out there. Our solar system is organized in nested zones:

**Inner rocky planets** (Mercury, Venus, Earth, Mars): small, dense, close to the Sun
**Asteroid belt**: millions of rocky fragments between Mars and Jupiter
**Gas giants** (Jupiter, Saturn): huge, mostly hydrogen and helium
**Ice giants** (Uranus, Neptune): large, with water/ammonia/methane ice
**Kuiper Belt**: icy objects beyond Neptune (including Pluto)
**Oort Cloud**: a vast spherical shell of icy bodies extending halfway to the nearest star

Scale is hard to grasp:
- If the Sun were a basketball (24 cm), Earth would be a peppercorn (2 mm) 26 meters away
- Jupiter would be a walnut 135 meters away
- Neptune would be a cherry 780 meters away
- The nearest star (Proxima Centauri) would be another basketball **6,800 km away** — farther than Delhi to London

Everything that falls from space and reaches Earth's surface — meteorites — comes from this cosmic neighborhood, mostly from the asteroid belt.`,
      analogy: 'The solar system is like a city. The Sun is the central power plant. The rocky planets are the inner-city houses (small, close). The gas giants are suburban estates (big, farther out). The Kuiper Belt is the rural outskirts. The Oort Cloud is the distant countryside. And the next solar system? Another city, absurdly far away.',
      storyConnection: 'The "star" that fell into Deepor Beel traveled millions of kilometers through this cosmic neighborhood before hitting Earth\'s atmosphere. If it came from the asteroid belt (most likely), it spent millions of years orbiting the Sun before being nudged out of its orbit by Jupiter\'s gravity and sent on a collision course with Earth.',
      checkQuestion: 'Light takes 8 minutes to travel from the Sun to Earth. How long does it take to reach Neptune?',
      checkAnswer: 'Neptune is about 30 AU from the Sun (30 times the Earth-Sun distance). Since light takes 8 minutes to travel 1 AU, it takes 30 × 8 = about 240 minutes = 4 hours to reach Neptune. The Voyager 2 spacecraft, traveling at ~17 km/s, took 12 years to reach Neptune. The scale of space is incomprehensible.',
      codeIntro: 'Visualize the solar system to scale (showing why meteoroids are everywhere).',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Planet data: (name, distance_AU, radius_km, color)
planets = [
    ('Mercury', 0.387, 2440, '#a0a0a0'),
    ('Venus', 0.723, 6052, '#e6c35c'),
    ('Earth', 1.000, 6371, '#3b82f6'),
    ('Mars', 1.524, 3390, '#ef4444'),
    ('Jupiter', 5.203, 69911, '#d4a574'),
    ('Saturn', 9.537, 58232, '#f0d68a'),
    ('Uranus', 19.19, 25362, '#7dd3fc'),
    ('Neptune', 30.07, 24622, '#3b82f6'),
]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# --- Orbital distances (log scale) ---
ax1.set_facecolor('#111827')
ax1.scatter(0, 0, s=200, color='#fbbf24', zorder=5, label='Sun')

for name, dist, radius, color in planets:
    size = max(20, radius / 1000)
    ax1.scatter(dist, 0, s=size, color=color, zorder=5, edgecolors='white', linewidths=0.5)
    ax1.annotate(name, xy=(dist, 0), xytext=(dist, 0.15),
                color='white', fontsize=8, ha='center', fontweight='bold')

# Asteroid belt
np.random.seed(42)
n_asteroids = 200
a_dist = np.random.uniform(2.1, 3.3, n_asteroids)
a_y = np.random.normal(0, 0.05, n_asteroids)
ax1.scatter(a_dist, a_y, s=1, color='gray', alpha=0.5)
ax1.text(2.7, -0.25, 'Asteroid Belt', color='gray', fontsize=8, ha='center')

# Kuiper belt indication
ax1.axvspan(30, 50, alpha=0.05, color='#06b6d4')
ax1.text(40, 0.2, 'Kuiper Belt →', color='#06b6d4', fontsize=8)

ax1.set_xlabel('Distance from Sun (AU)', color='white')
ax1.set_title('Solar System: Orbital Distances', color='white', fontsize=13)
ax1.set_xlim(-1, 35)
ax1.set_ylim(-0.4, 0.4)
ax1.tick_params(colors='gray')

# --- Size comparison ---
ax2.set_facecolor('#111827')
names = [p[0] for p in planets]
radii = [p[2] for p in planets]
colors = [p[3] for p in planets]

bars = ax2.barh(names, radii, color=colors, height=0.6)
ax2.set_xlabel('Radius (km)', color='white')
ax2.set_title('Planet Sizes', color='white', fontsize=13)
ax2.tick_params(colors='gray')

# Mark Earth
earth_idx = 2
ax2.barh('Earth', 6371, color='#3b82f6', height=0.6, edgecolor='white', linewidth=2)

for bar, radius in zip(bars, radii):
    ax2.text(bar.get_width() + 500, bar.get_y() + bar.get_height()/2,
             f'{radius:,} km', va='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Solar system scale:")
print("  Sun to Earth: 150 million km (1 AU)")
print("  Sun to Jupiter: 780 million km (5.2 AU)")
print("  Sun to Neptune: 4.5 billion km (30 AU)")
print()
print("Size comparison:")
print(f"  Jupiter is {69911/6371:.0f}× Earth's radius")
print(f"  The Sun is {696000/6371:.0f}× Earth's radius")
print()
print("The asteroid belt (2.1-3.3 AU) is the source of most meteorites.")`,
      challenge: 'If you drew the solar system to true scale where 1 AU = 1 cm, how big would Earth be? (Hint: Earth\'s radius is 6,371 km; 1 AU = 150,000,000 km). This will show you why scale models of the solar system are nearly impossible.',
      successHint: 'Understanding solar system scale is the first step to understanding what falls from space. Meteoroids, asteroids, and comets all orbit within this vast system — and occasionally collide with Earth.',
    },
    {
      title: 'Meteors, meteorites, and asteroids — what is the difference?',
      concept: `The terminology confuses everyone, so let's be precise:

- **Asteroid**: a rocky/metallic body orbiting the Sun, typically in the asteroid belt (1m to 1000km across)
- **Comet**: an icy body that develops a glowing tail when near the Sun (ice + rock + dust)
- **Meteoroid**: a small piece of space rock/metal, from dust-grain to boulder size, floating in space
- **Meteor**: the streak of light (the "shooting star") produced when a meteoroid burns up in Earth's atmosphere. The light comes from the air being heated to ~3000°C by friction and compression.
- **Meteorite**: a piece of space rock that survives atmospheric entry and lands on the ground

So: asteroid (in space, big) → meteoroid (in space, small) → meteor (in atmosphere, burning) → meteorite (on ground, survived).

Most meteors burn up completely at 80-120 km altitude. Only the toughest rocks — iron meteorites and dense stone — survive to the ground. The fireball over Deepor Beel was a meteor; if anything landed in the water, it became a meteorite.

Earth encounters about **100 tonnes** of space debris per day, mostly dust-sized. About 5-10 meteorites hit the ground per day, but most land in oceans or uninhabited areas.`,
      analogy: 'Think of it as a journey: the rock is a "tourist" (asteroid/meteoroid) traveling through space. When it enters Earth\'s atmosphere, it becomes a "streak of light" (meteor) — that\'s the traveler being noticed. If it actually arrives on Earth\'s surface, it becomes an "immigrant" (meteorite) — it made it. Most tourists burn up before arriving.',
      storyConnection: 'In the story, a "star fell into Deepor Beel." In reality, no star fell — stars are millions of times larger than Earth. What fell was a meteor: a piece of space rock, perhaps the size of a football, that heated to incandescence as it plunged through the atmosphere at 30-70 km/s. The brilliant light made it look like a star to observers on the ground.',
      checkQuestion: 'A meteoroid enters Earth\'s atmosphere at 30 km/s. That is 108,000 km/h — about 100 times faster than a rifle bullet. Where does the energy come from to produce such an intense fireball?',
      checkAnswer: 'Kinetic energy (½mv²). At 30 km/s, even a 1 kg rock has KE = ½ × 1 × 30000² = 450 million joules — roughly the energy of 100 kg of TNT. This energy is converted to heat through compression of air ahead of the meteoroid (not friction, as commonly stated). The air is compressed so violently that it heats to 3,000-10,000 K, which vaporizes the rock surface and creates the visible trail.',
      codeIntro: 'Simulate a meteor\'s descent through Earth\'s atmosphere.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Meteor descent simulation (simplified)
# Parameters
v0 = 30000  # initial velocity (m/s) = 30 km/s
m0 = 10  # initial mass (kg) - football-sized iron meteoroid
altitude0 = 120000  # entry altitude (m) = 120 km
angle = 45  # entry angle from horizontal (degrees)

# Atmospheric density (exponential model)
def rho(h):
    """Air density at altitude h (meters)."""
    return 1.225 * np.exp(-h / 8500)

# Simulation
dt = 0.01  # time step (seconds)
h = altitude0
v = v0
m = m0
theta = np.radians(angle)

altitudes = [h / 1000]  # km
velocities = [v / 1000]  # km/s
masses = [m]
luminosities = [0]
times = [0]

drag_coeff = 1.0
cross_area = 0.03  # m² (football-sized)
ablation_rate = 1e-8  # kg per joule of heat

t = 0
while h > 0 and v > 100 and m > 0.01:
    t += dt
    rho_h = rho(h)

    # Drag force: F = 0.5 * Cd * rho * v² * A
    drag = 0.5 * drag_coeff * rho_h * v**2 * cross_area

    # Deceleration
    dv = -(drag / m) * dt
    v = max(0, v + dv)

    # Mass loss (ablation)
    heat = drag * v * dt
    dm = ablation_rate * heat
    m = max(0.01, m - dm)

    # Altitude change
    dh = -v * np.sin(theta) * dt
    h += dh

    # Luminosity proportional to kinetic energy loss rate
    lum = 0.5 * drag * v

    if len(times) % 10 == 0:  # sample every 10th step
        altitudes.append(h / 1000)
        velocities.append(v / 1000)
        masses.append(m)
        luminosities.append(lum / 1e9)
        times.append(t)

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Meteor Descent Through Earth\\'s Atmosphere', color='white', fontsize=14, y=1.02)

# Altitude vs time
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(times, altitudes, color='#3b82f6', linewidth=2)
ax.set_xlabel('Time (seconds)', color='white')
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('Altitude', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.axhline(80, color='gray', linestyle=':', alpha=0.3)
ax.text(max(times)*0.7, 82, 'Mesosphere', color='gray', fontsize=8)

# Velocity vs time
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(times, velocities, color='#ef4444', linewidth=2)
ax.set_xlabel('Time (seconds)', color='white')
ax.set_ylabel('Velocity (km/s)', color='white')
ax.set_title('Velocity', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Mass vs time
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(times, masses, color='#22c55e', linewidth=2)
ax.set_xlabel('Time (seconds)', color='white')
ax.set_ylabel('Mass (kg)', color='white')
ax.set_title('Mass (ablation)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Luminosity vs altitude
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(altitudes, luminosities, color='#f59e0b', linewidth=2)
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Luminosity (GW)', color='white')
ax.set_title('Brightness vs Altitude', color='white', fontsize=11)
ax.tick_params(colors='gray')
# Mark peak brightness
peak_idx = np.argmax(luminosities)
ax.plot(altitudes[peak_idx], luminosities[peak_idx], 'o', color='#ef4444', markersize=10)
ax.annotate(f'Peak at {altitudes[peak_idx]:.0f} km', xy=(altitudes[peak_idx], luminosities[peak_idx]),
            xytext=(altitudes[peak_idx] + 10, luminosities[peak_idx]),
            color='#ef4444', fontsize=9, arrowprops=dict(arrowstyle='->', color='#ef4444'))

plt.tight_layout()
plt.show()

print(f"Meteor simulation (10 kg iron, entering at {v0/1000} km/s):")
print(f"  Entry altitude: {altitude0/1000} km")
print(f"  Final velocity: {velocities[-1]:.1f} km/s")
print(f"  Final mass: {masses[-1]:.2f} kg ({masses[-1]/m0*100:.0f}% survived)")
print(f"  Peak brightness at ~{altitudes[peak_idx]:.0f} km altitude")
print(f"  Total descent time: {times[-1]:.1f} seconds")`,
      challenge: 'Change the initial mass from 10 kg to 0.1 kg (pebble-sized). Does it survive to the ground? What about 1000 kg (car-sized)? How does mass affect survivability?',
      successHint: 'The physics of meteor entry — drag, ablation, and deceleration — is the same physics used to design spacecraft heat shields. Every space capsule returning to Earth faces the same forces as a meteor.',
    },
    {
      title: 'Impact physics — what happens when space meets ground',
      concept: `When a meteorite hits the ground (or water), it releases enormous energy. The kinetic energy ½mv² is converted into:
- **Heat**: melting and vaporizing rock
- **Shock waves**: compressing and fracturing the ground
- **Crater formation**: excavating material
- **Seismic waves**: like a small earthquake
- **Light and sound**: the flash and boom

The energy depends on velocity squared, so doubling the speed quadruples the energy. A 10-meter asteroid hitting at 20 km/s releases about **100 kilotons of TNT** — roughly 7 Hiroshima bombs.

**Crater size** depends on impactor size, speed, angle, and target material:
- A rough rule: crater diameter ≈ 20× impactor diameter (for high-speed impacts)
- The 10 km Chicxulub impactor (that killed the dinosaurs) made a 180 km crater

For the Deepor Beel event, if a meteorite the size of a football (20 cm, ~30 kg) hit the water at terminal velocity (~200 m/s after atmospheric deceleration), the energy would be about 600,000 joules — equivalent to about 150 grams of TNT. Enough to make a dramatic splash and maybe a small tsunami in the shallow beel, but not a crater.`,
      analogy: 'A meteor impact is like dropping a bowling ball into a sandbox from a helicopter. The ball\'s kinetic energy excavates a hole much larger than itself. Drop it from higher (more speed) and the crater is bigger. Drop a basketball instead of a bowling ball (less mass) and the crater is smaller. The crater records the energy of the impact.',
      storyConnection: 'In the story, the falling star "lit up the sky and churned the water of Deepor Beel." A real meteor fireball over a wetland would indeed light up the sky (the meteor burning in the upper atmosphere) and could churn the water if fragments reached the surface. The splash and steam would have been visible from the banks of the beel.',
      checkQuestion: 'The Chicxulub asteroid was only 10 km across but killed ~75% of all species. The Chelyabinsk meteor in 2013 was 20 meters and only broke windows. Why such a difference for only a 500× size increase?',
      checkAnswer: 'Energy scales as the cube of diameter (mass ~ d³) times the square of velocity. The Chicxulub impactor was 500× larger in diameter, so ~125 million times more massive. At the same speed, it delivered 125 million times more energy. Additionally, Chelyabinsk exploded high in the atmosphere (air burst at 30 km), dissipating energy over a wide area. Chicxulub hit the ground directly, concentrating all energy at one point.',
      codeIntro: 'Model crater formation and the energy-size relationship of impacts.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Impact energy and crater size
diameters = np.logspace(-2, 4, 100)  # impactor diameter in meters (1cm to 10km)
density = 3000  # kg/m³ (typical rocky asteroid)
velocity = 20000  # m/s (typical impact velocity)

# Mass = (4/3)π(d/2)³ × density
masses = (4/3) * np.pi * (diameters/2)**3 * density
# Kinetic energy = 0.5 * m * v²
energies_j = 0.5 * masses * velocity**2
energies_tnt = energies_j / 4.184e9  # tonnes of TNT

# Approximate crater diameter (Pi-scaling law)
# D_crater ≈ 1.16 * (d_impactor)^0.78 * (v/1000)^0.44 * (rho_i/rho_t)^0.33
crater_diams = 1.16 * diameters**0.78 * (velocity/1000)**0.44 * (density/2500)**0.33

fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.patch.set_facecolor('#1f2937')

# --- Energy vs size ---
ax = axes[0]
ax.set_facecolor('#111827')
ax.loglog(diameters, energies_tnt, color='#ef4444', linewidth=2)
ax.set_xlabel('Impactor diameter (m)', color='white')
ax.set_ylabel('Energy (tonnes TNT)', color='white')
ax.set_title('Impact Energy vs Size', color='white', fontsize=11)

# Mark famous events
events = [
    (0.02, 'Deepor Beel\\n(football)', '#f59e0b'),
    (20, 'Chelyabinsk\\n2013', '#3b82f6'),
    (50, 'Tunguska\\n1908', '#22c55e'),
    (10000, 'Chicxulub\\n(dinosaurs)', '#a855f7'),
]
for d, label, color in events:
    e = 0.5 * (4/3)*np.pi*(d/2)**3 * density * velocity**2 / 4.184e9
    ax.plot(d, e, 'o', color=color, markersize=8, zorder=5)
    ax.annotate(label, xy=(d, e), xytext=(d*2, e*3),
                color=color, fontsize=7, arrowprops=dict(arrowstyle='->', color=color, lw=0.8))

ax.tick_params(colors='gray')
ax.axhline(1, color='gray', linestyle=':', alpha=0.3)
ax.text(0.03, 1.5, '1 tonne TNT', color='gray', fontsize=7)

# --- Crater size vs impactor size ---
ax = axes[1]
ax.set_facecolor('#111827')
ax.loglog(diameters, crater_diams, color='#22c55e', linewidth=2)
ax.plot(diameters, diameters, color='gray', linewidth=1, linestyle='--', alpha=0.5, label='1:1 line')
ax.set_xlabel('Impactor diameter (m)', color='white')
ax.set_ylabel('Crater diameter (m)', color='white')
ax.set_title('Crater Size vs Impactor Size', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# --- Frequency of impacts ---
ax = axes[2]
ax.set_facecolor('#111827')
# Approximate impact frequency (years between impacts of given size)
sizes = np.array([0.001, 0.01, 0.1, 1, 10, 100, 1000, 10000])
intervals = np.array([1e-5, 0.01, 1, 10, 100, 10000, 500000, 100000000])  # years

ax.loglog(sizes, intervals, color='#f59e0b', linewidth=2.5, marker='o', markersize=6)
ax.set_xlabel('Impactor diameter (m)', color='white')
ax.set_ylabel('Average interval (years)', color='white')
ax.set_title('How Often Do Impacts Happen?', color='white', fontsize=11)
ax.tick_params(colors='gray')

labels_freq = ['Dust\\n(daily)', 'Pebble\\n(weekly)', 'Rock\\n(yearly)', 'Car\\n(decade)',
               'House\\n(century)', 'Tunguska\\n(10,000 yr)', 'City-killer\\n(500,000 yr)',
               'Chicxulub\\n(100M yr)']
for s, i, label in zip(sizes, intervals, labels_freq):
    ax.annotate(label, xy=(s, i), xytext=(s*2.5, i*0.5),
                color='white', fontsize=6)

plt.tight_layout()
plt.show()

print("Impact energy scales as diameter CUBED × velocity SQUARED:")
print("  Double the size → 8× the energy")
print("  Double the speed → 4× the energy")
print()
print("Famous impacts:")
print("  Chelyabinsk (2013): 20m, ~500 kilotons TNT, broke windows")
print("  Tunguska (1908): 50m, ~15 megatons, flattened 2000 km² of forest")
print("  Chicxulub (66 Mya): 10km, ~100 teratons, killed the dinosaurs")`,
      challenge: 'If the Deepor Beel meteor was 20 cm and hit the water at 200 m/s (slowed by atmosphere), calculate its energy in joules. How high would the splash column be? (Hint: energy converts to gravitational potential energy of ejected water: E = mgh)',
      successHint: 'Impact physics connects astronomy, geophysics, and engineering. The same principles that govern meteor craters apply to car crash testing, ballistic armor design, and even asteroid deflection missions like NASA\'s DART.',
    },
    {
      title: 'Famous craters — Earth\'s scars from space',
      concept: `Earth has been hit by space rocks billions of times. Most craters have been eroded away by wind, water, and plate tectonics, but about **190 confirmed impact craters** remain visible today:

- **Chicxulub** (Mexico): 180 km wide, 66 million years old. Killed the dinosaurs. Buried under sediment, discovered by geophysicists in 1978.
- **Vredefort** (South Africa): ~300 km original diameter, 2 billion years old. Largest confirmed crater.
- **Sudbury** (Canada): 130 km wide, 1.8 billion years old. Rich nickel-copper mining district — the impact melted deep rock and concentrated metals.
- **Meteor Crater** (Arizona): 1.2 km wide, 50,000 years old. Best-preserved crater, from a ~50 m iron meteoroid.
- **Lonar** (India): 1.8 km wide, 50,000 years old. Only known impact crater in basalt rock, in Maharashtra. Now a salt-water lake.

India also has the **Dhala structure** in Madhya Pradesh (~11 km, 1.5-2.5 billion years old) and the **Ramgarh structure** in Rajasthan (~10 km, possibly impact).

Craters are identified by:
- Shocked quartz (quartz grains with parallel deformation features)
- Shatter cones (conical rock fractures)
- Iridium anomaly (iridium is rare on Earth but common in asteroids)
- Melted rock (impact melt sheets)`,
      analogy: 'Earth\'s impact craters are like scars on an old warrior. Each tells a story: how big the attacker was, how fast it came, when the battle happened. Unlike warriors, Earth can\'t heal its biggest scars — Vredefort is still visible after 2 billion years. Smaller craters heal faster through erosion, but the evidence (shocked minerals, melt rock) remains in the geology.',
      storyConnection: 'If the star that fell into Deepor Beel had been larger — say 100 meters — it would have created a crater roughly 2 km wide, destroying Guwahati. The fact that Deepor Beel survived tells us the object was small. But the story preserves an important truth: things DO fall from the sky, and when they are big enough, they reshape the landscape.',
      checkQuestion: 'The Chicxulub crater is buried under 1 km of sediment. How was it discovered?',
      checkAnswer: 'In 1978, geophysicists Glen Penfield and Antonio Camargo were surveying for oil in the Gulf of Mexico using gravity and magnetic measurements. They found a perfectly circular anomaly 180 km across — far too regular to be geological. It matched the predicted size of the dinosaur-killing impactor. Drilling confirmed shocked quartz and impact melt. The crater was hiding in plain sight under Yucatán sediment for 66 million years.',
      codeIntro: 'Map Earth\'s confirmed impact craters and analyze their size distribution.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Major impact craters (lat, lon, diameter_km, age_Mya, name)
craters = [
    (21.3, -89.5, 180, 66, 'Chicxulub'),
    (-27.0, 27.5, 300, 2023, 'Vredefort'),
    (46.6, -81.2, 130, 1850, 'Sudbury'),
    (35.0, -111.0, 1.2, 0.05, 'Meteor Crater'),
    (19.9, 76.5, 1.8, 0.05, 'Lonar'),
    (56.1, -74.1, 100, 214, 'Manicouagan'),
    (48.9, 10.9, 24, 14.8, 'Nördlinger Ries'),
    (61.0, -73.5, 28, 290, 'Mistastin'),
    (-15.2, 136.0, 24, 142, 'Gosses Bluff'),
    (63.0, 169.0, 100, 3.5, 'Popigai'),
    (57.5, 80.0, 100, 35, 'Kara'),
    (54.5, 109.4, 40, 0.00004, 'Tunguska (no crater)'),
]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))
fig.patch.set_facecolor('#1f2937')

# --- World map with crater locations ---
ax1.set_facecolor('#111827')
# Simple continent outlines (very simplified)
ax1.axhline(0, color='gray', linewidth=0.3, alpha=0.3)
ax1.axvline(0, color='gray', linewidth=0.3, alpha=0.3)

for lat, lon, diam, age, name in craters:
    size = max(30, diam / 5)
    color = '#ef4444' if diam > 50 else '#f59e0b' if diam > 10 else '#22c55e'
    ax1.scatter(lon, lat, s=size, color=color, alpha=0.7, edgecolors='white', linewidths=0.5, zorder=5)
    ax1.annotate(name, xy=(lon, lat), xytext=(lon + 5, lat + 3),
                color='white', fontsize=6, arrowprops=dict(arrowstyle='->', color='gray', lw=0.5))

# Mark Deepor Beel
ax1.scatter(91.65, 26.12, s=100, color='#06b6d4', marker='*', zorder=10)
ax1.annotate('Deepor Beel', xy=(91.65, 26.12), xytext=(100, 30),
            color='#06b6d4', fontsize=8, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#06b6d4', lw=1))

ax1.set_xlabel('Longitude', color='white')
ax1.set_ylabel('Latitude', color='white')
ax1.set_title('Confirmed Impact Craters on Earth', color='white', fontsize=12)
ax1.set_xlim(-180, 180); ax1.set_ylim(-80, 80)
ax1.tick_params(colors='gray')

# Legend
for size_label, diam_range, color in [('> 50 km', 50, '#ef4444'),
                                        ('10-50 km', 25, '#f59e0b'),
                                        ('< 10 km', 5, '#22c55e')]:
    ax1.scatter([], [], s=60, color=color, label=size_label)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='lower left')

# --- Size-frequency distribution ---
ax2.set_facecolor('#111827')
crater_diameters = [c[2] for c in craters if c[2] > 0.5]

# Power law: number of craters > D is proportional to D^(-b)
d_range = np.logspace(-1, 3, 50)
# Known crater counts (approximate cumulative)
sizes = [1, 5, 10, 20, 50, 100, 200]
counts = [190, 80, 45, 25, 8, 4, 1]

ax2.loglog(sizes, counts, 'o-', color='#f59e0b', markersize=8, linewidth=2, label='Known craters (N > D)')
# Power law fit line
b = 1.8  # typical power law exponent
fit_line = counts[0] * (np.array(sizes) / sizes[0]) ** (-b)
ax2.loglog(sizes, fit_line, color='gray', linestyle='--', linewidth=1, alpha=0.5, label=f'Power law (b={b})')

ax2.set_xlabel('Crater diameter (km)', color='white')
ax2.set_ylabel('Number of craters larger than D', color='white')
ax2.set_title('Crater Size-Frequency Distribution', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Earth's confirmed impact craters: ~190")
print("Most craters are eroded or buried (estimated 100,000+ have existed)")
print()
print("India's impact structures:")
print("  Lonar (Maharashtra): 1.8 km, 50,000 years old")
print("  Dhala (Madhya Pradesh): ~11 km, 1.5-2.5 billion years old")
print("  Ramgarh (Rajasthan): ~10 km, possibly impact")`,
      challenge: 'The Moon has far more visible craters than Earth, even though both were hit equally. Why? Plot the number of visible craters on the Moon (~9,000 > 20 km) vs Earth (~45 > 20 km) as a bar chart. What geological processes explain the difference?',
      successHint: 'Impact craters are windows into Earth\'s violent past and warnings about its future. Finding and cataloging near-Earth asteroids is one of the most important safety projects in all of science.',
    },
    {
      title: 'Deepor Beel — a Ramsar wetland and its cosmic visitor',
      concept: `Deepor Beel (also Dipor Bil) is a permanent freshwater lake in southwest Guwahati, Assam — one of the largest beels (wetlands) in the Brahmaputra valley. It was designated a **Ramsar site** in 2002 — an internationally recognized wetland of importance.

Key facts about Deepor Beel:
- **Area**: ~4 km² (expands to ~40 km² during monsoon)
- **Depth**: typically 1-2 meters (maximum ~4 m in monsoon)
- **Biodiversity**: 219 bird species recorded, including the rare greater adjutant stork
- **Ecology**: acts as a natural flood buffer for Guwahati, filtering water and absorbing monsoon overflow
- **Threats**: garbage dumping, encroachment, railway line bisects the beel, water quality declining

The Ramsar Convention (1971, signed in Ramsar, Iran) identifies wetlands of international importance. There are over 2,400 Ramsar sites worldwide. India has 80+ designated sites. Deepor Beel qualifies because of its critical role in bird migration (it lies on the Central Asian Flyway) and its function as Guwahati's natural kidney.

If a meteorite fell into Deepor Beel, it would be nearly impossible to recover — the shallow, muddy bottom would swallow it. But the event itself — a fireball over a wetland — would be witnessed by thousands of birdwatchers, fishers, and city dwellers.`,
      analogy: 'Deepor Beel is like a city\'s kidneys: it filters waste, regulates water levels, and processes nutrients. Just as your kidneys clean your blood, Deepor Beel cleans Guwahati\'s water. And just as kidney failure is life-threatening, the degradation of Deepor Beel threatens Guwahati\'s water security and flood resilience.',
      storyConnection: 'The story places a cosmic event — a falling star — in a very specific, real, ecologically important place. Deepor Beel is not just a backdrop; it is a character in the story. The wetland\'s vast, shallow water surface makes it the perfect "canvas" for a meteor\'s reflection, and the rich birdlife would react dramatically to a fireball. The story merges cosmic physics with terrestrial ecology.',
      checkQuestion: 'Deepor Beel expands from 4 km² to 40 km² during monsoon. Where does all that extra water come from and where does it go?',
      checkAnswer: 'The water comes from: (1) direct rainfall during monsoon (Guwahati receives ~1,700 mm/year, mostly June-September), (2) overflow from the Brahmaputra via connecting channels, and (3) urban runoff from Guwahati. The water recedes as: (1) the Brahmaputra level drops and water flows back, (2) evaporation, (3) groundwater seepage. This seasonal expansion-contraction is what makes beels ecologically productive — the flooding deposits nutrient-rich sediment.',
      codeIntro: 'Analyze Deepor Beel\'s seasonal water level cycle and its role as a flood buffer.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Deepor Beel seasonal cycle (approximate)
months = np.arange(1, 13)
month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# Water area (km²) - seasonal pattern
water_area = np.array([4, 3.5, 3.5, 5, 10, 25, 38, 40, 35, 20, 10, 5])

# Rainfall (mm/month)
rainfall = np.array([10, 20, 50, 150, 250, 350, 350, 300, 250, 120, 20, 5])

# Bird species count (inverse of water level - birds prefer mudflats)
bird_count = np.array([180, 190, 200, 160, 100, 60, 40, 35, 50, 120, 170, 185])

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# --- Water area ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.fill_between(months, water_area, color='#3b82f6', alpha=0.3)
ax.plot(months, water_area, color='#3b82f6', linewidth=2.5, marker='o', markersize=5)
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white', fontsize=8)
ax.set_ylabel('Water area (km²)', color='white')
ax.set_title('Deepor Beel: Seasonal Water Spread', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.axhline(4, color='gray', linestyle=':', alpha=0.3)
ax.text(1.5, 4.5, 'Permanent area', color='gray', fontsize=8)

# --- Rainfall ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.bar(months, rainfall, color='#06b6d4', alpha=0.7, width=0.6)
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white', fontsize=8)
ax.set_ylabel('Rainfall (mm)', color='white')
ax.set_title('Guwahati Monthly Rainfall', color='white', fontsize=11)
ax.tick_params(colors='gray')

# --- Bird diversity ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.fill_between(months, bird_count, color='#22c55e', alpha=0.3)
ax.plot(months, bird_count, color='#22c55e', linewidth=2.5, marker='o', markersize=5)
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white', fontsize=8)
ax.set_ylabel('Bird species observed', color='white')
ax.set_title('Bird Diversity (peaks in winter)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# --- Flood buffer effect ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Without beel: all monsoon water hits city
city_flood_risk = rainfall / 30  # mm/day, simplified
# With beel: water absorbed
absorbed = np.minimum(city_flood_risk * 0.3, water_area / 4)
net_risk = city_flood_risk - absorbed

ax.plot(months, city_flood_risk, color='#ef4444', linewidth=2, label='Without wetland', linestyle='--')
ax.plot(months, net_risk, color='#22c55e', linewidth=2, label='With Deepor Beel')
ax.fill_between(months, net_risk, city_flood_risk, alpha=0.15, color='#22c55e', label='Water absorbed by beel')
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white', fontsize=8)
ax.set_ylabel('Flood risk (relative)', color='white')
ax.set_title('Deepor Beel as Flood Buffer', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Deepor Beel facts:")
print("  Area: 4 km² (dry) to 40 km² (monsoon) — 10× expansion!")
print("  Ramsar site since 2002")
print("  219 bird species including greater adjutant stork")
print("  Critical flood buffer for Guwahati city")
print()
print("Threats: garbage dumping, encroachment, railway,")
print("sewage discharge, invasive water hyacinth.")
print()
print("If destroyed, Guwahati loses its natural flood defense")
print("AND a critical stop on the Central Asian Flyway for migratory birds.")`,
      challenge: 'If Deepor Beel were filled in for development (as some proposals suggest), how much additional floodwater would Guwahati need to manage during monsoon? Calculate the volume: 36 km² extra area × average 1.5 m depth = ? cubic meters of water per season.',
      successHint: 'Deepor Beel connects the cosmic and the terrestrial — a meteor over a Ramsar wetland. Understanding both the physics of space and the ecology of wetlands gives you a complete picture of why this story resonates. Astronomy needs ecology; ecology needs astronomy. Both need protection.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior astronomy experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for astronomy simulations. Click to start.</p>
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
