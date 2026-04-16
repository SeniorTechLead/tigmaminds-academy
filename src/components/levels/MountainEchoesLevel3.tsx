import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MountainEchoesLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Sound reflection & echo formation',
      concept: `Sound is a pressure wave that travels through air. When this wave hits a hard surface — a cliff face, a cave wall, a building — it bounces back, just like light reflecting off a mirror. This reflected wave is an **echo**.

The law of reflection applies: the angle of incidence equals the angle of reflection. A sound wave hitting a cliff at 30° from the surface normal bounces back at 30° on the other side.

For you to hear a distinct echo (not just a blurred "reverb"), the reflecting surface must be far enough away that the reflected sound arrives **at least 0.1 seconds** after the original. Since sound travels at ~343 m/s in air at 20°C, the minimum round-trip distance is:

**d = v × t / 2 = 343 × 0.1 / 2 ≈ 17.15 meters**

If the wall is closer than ~17 m, the reflected sound overlaps with the original and you perceive it as reverb or resonance rather than a separate echo.

When sound bounces back and forth between two parallel surfaces (like two cliff faces in a valley), you get **flutter echo** — a rapid series of echoes that decay over time. Each bounce loses energy due to absorption and spreading, so each successive echo is quieter.`,
      analogy: 'Think of throwing a ball at a wall. If the wall is nearby, the ball returns so fast it feels like it never left your hand (reverb). If the wall is across a field, you throw, wait, and catch the return clearly (echo). Throw the ball between two walls, and it bounces back and forth, each time a bit slower (flutter echo).',
      storyConnection: 'In the Khasi Hills of Meghalaya, deep valleys carved by rivers create natural echo chambers. A shout from one ridge bounces off the opposite cliff face hundreds of meters away, returning as a clear echo a second or more later. The locals have known for centuries that narrow gorges produce the most dramatic echoes — the steep, hard limestone walls reflect sound efficiently with minimal absorption.',
      checkQuestion: 'If you are standing in a valley and hear your echo 1.4 seconds after you shout, how far away is the reflecting cliff face? (Assume speed of sound = 343 m/s)',
      checkAnswer: 'The sound travels to the cliff and back in 1.4 seconds, so one-way distance = 343 × 1.4 / 2 = 240.1 meters. The cliff is about 240 meters away. This is typical of the wider valleys in the Khasi Hills where echoes are particularly pronounced.',
      codeIntro: 'Simulate echo formation: a short pulse reflecting off a wall at varying distances, visualizing how the original and reflected waves combine.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulation parameters
sr = 44100  # sample rate
duration = 2.0  # seconds
t = np.linspace(0, duration, int(sr * duration), endpoint=False)
speed_of_sound = 343.0  # m/s at 20°C

# Generate a short "shout" — a 50ms Gaussian-enveloped sine burst
shout_duration = 0.05
shout_freq = 400  # Hz
shout = np.zeros_like(t)
shout_samples = int(shout_duration * sr)
t_shout = np.linspace(-3, 3, shout_samples)
envelope = np.exp(-t_shout**2 / 2)
shout[:shout_samples] = envelope * np.sin(2 * np.pi * shout_freq * t[:shout_samples])

# Simulate echoes from walls at different distances
distances = [17, 50, 120, 240]  # meters
fig, axes = plt.subplots(len(distances), 1, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

for idx, d in enumerate(distances):
    ax = axes[idx]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

    round_trip = 2 * d / speed_of_sound
    delay_samples = int(round_trip * sr)
    # Echo loses energy: inverse square law approximation
    attenuation = 1.0 / (1 + (d / 20.0))

    combined = shout.copy()
    if delay_samples < len(combined):
        combined[delay_samples:] += attenuation * shout[:len(combined) - delay_samples]

    ax.plot(t[:sr], combined[:sr], color='#3b82f6', linewidth=0.5, alpha=0.8)
    ax.axvline(x=round_trip, color='#f59e0b', linestyle='--', linewidth=1.5, alpha=0.7)
    ax.set_title(f'Wall at {d}m — echo delay: {round_trip*1000:.0f}ms (attn: {attenuation:.2f})',
                 color='white', fontsize=10)
    ax.set_ylabel('Amplitude', color='white', fontsize=8)
    if idx == len(distances) - 1:
        ax.set_xlabel('Time (s)', color='white')

plt.tight_layout()
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')
print()
print("Echo timing analysis:")
for d in distances:
    rt = 2 * d / speed_of_sound
    atten = 1.0 / (1 + (d / 20.0))
    distinct = "YES" if rt >= 0.1 else "NO (perceived as reverb)"
    print(f"  Wall at {d:>3d}m: round trip = {rt*1000:>6.1f}ms, attenuation = {atten:.3f}, distinct echo: {distinct}")
print()
print("Key insight: 17m is the threshold. Below that, the echo merges with the original.")
print("Mountain valleys in Meghalaya with 200-500m cliff faces produce echoes 1-3 seconds later.")`,
      challenge: 'Add a second reflecting wall behind the listener (e.g. 80m away in the opposite direction). Simulate the combined signal with echoes from both walls. How does the pattern change when you have two walls creating flutter echo?',
      successHint: 'You now understand the physics of echo formation — reflection law, minimum distance, and flutter echo. Next we examine how temperature changes the speed of sound in mountain environments.',
    },
    {
      title: 'Speed of sound & temperature',
      concept: `The speed of sound in air is not constant — it depends on temperature. The relationship is well-approximated by:

**v = 331.3 + 0.606 × T**

where v is speed in m/s and T is temperature in °C. At 0°C, sound travels at 331.3 m/s. At 30°C, it travels at 349.5 m/s — about 5.5% faster.

This matters enormously in mountain environments because temperature changes with altitude. The standard lapse rate is about -6.5°C per 1000m of elevation. A valley floor at 25°C might have air at 12°C at the 2000m ridge above.

When the speed of sound varies with height, sound waves **bend** — this is acoustic refraction. On a normal day (warm below, cool above), sound bends upward, away from the ground. Listeners far away may not hear anything because the sound curves over their heads.

But in mountain valleys at dawn and dusk, **temperature inversions** occur: cold air pools in the valley floor while warmer air sits above. Now the speed of sound is faster above than below, and sound waves bend **downward**, funneling into the valley. This is why echoes in mountain valleys are often loudest in early morning — the inversion acts as a natural acoustic waveguide.`,
      analogy: 'Imagine a line of marching soldiers crossing from pavement onto sand at an angle. The soldiers who hit sand first slow down, while those still on pavement keep marching fast. The entire line pivots — it bends toward the sand side. Sound waves do the same: they bend toward the region where they travel slower (colder air).',
      storyConnection: 'The Khasi Hills experience dramatic temperature inversions during winter mornings. Cold air drains into the deep valleys overnight while the ridges stay warmer. Villagers on opposite sides of a valley can hear each other speaking across distances of a kilometer or more at dawn, but the same voices become inaudible by midday when normal temperature gradients reassert and sound refracts upward.',
      checkQuestion: 'At a mountain valley floor (temperature 5°C) and the ridge 1500m above (temperature -5°C using the lapse rate), what is the difference in sound speed? Which direction does sound bend during a temperature inversion?',
      checkAnswer: 'At 5°C: v = 331.3 + 0.606 × 5 = 334.3 m/s. At -5°C: v = 331.3 + 0.606 × (-5) = 328.3 m/s. Difference: 6.0 m/s. During a temperature inversion (warm above, cold below), sound travels faster in the upper layer, so waves bend downward toward the valley floor — channeling sound along the valley like a natural megaphone.',
      codeIntro: 'Model how sound speed varies with altitude and visualize acoustic refraction: sound rays bending in a temperature gradient.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Speed of sound as a function of temperature
def speed_of_sound(T):
    """v = 331.3 + 0.606*T (m/s), T in Celsius"""
    return 331.3 + 0.606 * T

# Temperature profiles
altitude = np.linspace(0, 2000, 500)  # meters

# Normal lapse rate: -6.5°C per 1000m, base temp 25°C
T_normal = 25 - 6.5 * altitude / 1000

# Temperature inversion: cold valley floor (5°C), warm at 500m (15°C), then lapse
T_inversion = np.where(altitude < 500,
    5 + (15 - 5) * altitude / 500,
    15 - 6.5 * (altitude - 500) / 1000)

v_normal = speed_of_sound(T_normal)
v_inversion = speed_of_sound(T_inversion)

fig, axes = plt.subplots(1, 3, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Panel 1: Temperature profiles
axes[0].plot(T_normal, altitude, color='#ef4444', linewidth=2, label='Normal lapse')
axes[0].plot(T_inversion, altitude, color='#3b82f6', linewidth=2, label='Inversion')
axes[0].set_xlabel('Temperature (°C)', color='white')
axes[0].set_ylabel('Altitude (m)', color='white')
axes[0].set_title('Temperature profiles', color='white')
axes[0].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 2: Sound speed profiles
axes[1].plot(v_normal, altitude, color='#ef4444', linewidth=2, label='Normal')
axes[1].plot(v_inversion, altitude, color='#3b82f6', linewidth=2, label='Inversion')
axes[1].set_xlabel('Speed of sound (m/s)', color='white')
axes[1].set_ylabel('Altitude (m)', color='white')
axes[1].set_title('Speed of sound vs altitude', color='white')
axes[1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 3: Simple ray tracing showing refraction
# Ray tracing using Snell's law for sound
def trace_ray(v_profile, altitudes, launch_angle_deg, x_max=3000):
    """Trace a sound ray through a vertical speed-of-sound profile."""
    angle = np.radians(launch_angle_deg)
    x, z = [0], [0]
    dx_step = 5.0  # horizontal step

    # Snell's law: cos(theta)/v = constant
    # At ground level
    v0 = v_profile[0]
    snell_const = np.cos(angle) / v0

    cx, cz = 0.0, 0.0
    for _ in range(1000):
        # Find speed at current altitude
        if cz < 0 or cz > altitudes[-1] or cx > x_max:
            break
        v_here = np.interp(cz, altitudes, v_profile)

        # cos(theta) = snell_const * v_here
        cos_theta = snell_const * v_here
        if abs(cos_theta) > 1:
            break  # total internal reflection

        sin_theta = np.sqrt(1 - cos_theta**2)
        # Determine if going up or down based on gradient
        if len(z) >= 2 and z[-1] < z[-2]:
            sin_theta = -sin_theta

        cx += dx_step * cos_theta
        cz += dx_step * sin_theta
        if cz < 0:
            cz = 0
        x.append(cx)
        z.append(cz)

    return np.array(x), np.array(z)

colors_rays = ['#22c55e', '#f59e0b', '#ec4899', '#a855f7']
launch_angles = [10, 20, 35, 50]

for profile, label, style in [(v_normal, 'Normal', '--'), (v_inversion, 'Inversion', '-')]:
    for angle, color in zip(launch_angles, colors_rays):
        rx, rz = trace_ray(profile, altitude, angle)
        axes[2].plot(rx, rz, color=color, linestyle=style, linewidth=1.2, alpha=0.7)

axes[2].fill_between([0, 3000], [0, 0], [-50, -50], color='#4a3728', alpha=0.5)
axes[2].set_xlabel('Horizontal distance (m)', color='white')
axes[2].set_ylabel('Altitude (m)', color='white')
axes[2].set_title('Sound ray paths\
(solid=inversion, dashed=normal)', color='white', fontsize=10)
axes[2].set_ylim(-20, 1200)
axes[2].set_xlim(0, 3000)

plt.tight_layout()
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')
print()
print("Speed of sound at key temperatures:")
for T in [-10, 0, 10, 20, 30]:
    print(f"  {T:>4d}°C: {speed_of_sound(T):.1f} m/s")
print()
print("During a temperature inversion, sound rays curve DOWNWARD into the valley.")
print("During normal lapse conditions, sound rays curve UPWARD away from listeners.")
print("This explains why mountain echoes are strongest at dawn when inversions form.")`,
      challenge: 'Add humidity to the model. The speed of sound also depends on humidity: roughly v = 331.3 + 0.606T + 0.0124h where h is relative humidity in %. Model a humid valley (90% RH) versus a dry ridge (30% RH) and see how it affects refraction.',
      successHint: 'Temperature-dependent sound speed creates refraction that channels or disperses echoes in mountain valleys. Next we quantify why echoes get quieter — the inverse square law.',
    },
    {
      title: 'Sound intensity & the inverse square law',
      concept: `When a sound source emits power P (in watts), that energy spreads out over an ever-growing sphere. At distance r from the source, the intensity (power per unit area) is:

**I = P / (4πr²)**

This is the **inverse square law** — double the distance, and intensity drops to one quarter. An echo has to travel to the cliff and back, so the total distance is 2d. The reflected sound is already weaker just from spreading, even before any absorption at the reflecting surface.

We measure sound intensity in **decibels (dB)**, a logarithmic scale:

**L = 10 × log₁₀(I / I₀)**

where I₀ = 10⁻¹² W/m² is the threshold of hearing. A normal conversation is about 60 dB. A shout might be 80 dB. The inverse square law means that every doubling of distance reduces the level by about 6 dB.

For an echo from a cliff at distance d:
- The sound travels distance 2d total (there and back)
- Intensity drops by a factor of (2d)² = 4d² compared to 1m
- The cliff surface absorbs some energy (absorption coefficient α)
- Returned intensity: I_echo = P × (1 - α) / (4π × (2d)²)

Hard rock surfaces like limestone (α ≈ 0.02) reflect 98% of the energy. Forest canopy (α ≈ 0.5) absorbs half. This is why mountain cliffs produce strong echoes while forested hillsides produce muffled, quiet returns.`,
      analogy: 'Imagine painting a balloon as you inflate it. When the balloon is small, the paint is thick and vivid. As it grows, the same amount of paint stretches thinner and thinner over the larger surface. Sound energy does the same — the same watts of power spread over a larger sphere, getting thinner (quieter) with distance.',
      storyConnection: 'The limestone cliffs of the Jaintia Hills in Meghalaya are some of the best natural echo surfaces in northeast India. Their hard, smooth surfaces have absorption coefficients as low as 0.02, reflecting nearly all sound energy. In contrast, the dense tropical forests that blanket the lower slopes absorb much of the sound, creating a sharp acoustic boundary: shout toward a bare cliff face and you get a ringing echo; shout into the forest and the sound vanishes.',
      checkQuestion: 'A climber shouts (sound power 0.001 W) toward a limestone cliff 200m away (α = 0.02). What is the intensity of the returned echo at the climber? How does it compare to the threshold of hearing?',
      checkAnswer: 'Total round-trip distance is 400m. I_echo = 0.001 × (1 - 0.02) / (4π × 400²) = 0.00098 / (4π × 160000) = 0.00098 / 2,010,619 ≈ 4.87 × 10⁻¹⁰ W/m². In dB: 10 × log₁₀(4.87 × 10⁻¹⁰ / 10⁻¹²) = 10 × log₁₀(487) ≈ 26.9 dB. This is above the threshold of hearing (0 dB) and about as loud as a whisper — clearly audible in a quiet mountain valley.',
      codeIntro: 'Compute and visualize how echo intensity drops with distance for different surface materials, and convert to the decibel scale.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Source parameters
P_source = 0.001  # watts (a loud shout)
I_ref = 1e-12     # threshold of hearing (W/m^2)

# Distance range
distances = np.linspace(5, 500, 200)  # meters to reflecting surface

# Surface absorption coefficients
surfaces = {
    'Limestone cliff': {'alpha': 0.02, 'color': '#3b82f6'},
    'Granite face': {'alpha': 0.05, 'color': '#8b5cf6'},
    'Brick wall': {'alpha': 0.15, 'color': '#f59e0b'},
    'Wooden surface': {'alpha': 0.30, 'color': '#ef4444'},
    'Forest canopy': {'alpha': 0.50, 'color': '#22c55e'},
    'Thick vegetation': {'alpha': 0.80, 'color': '#6b7280'},
}

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Panel 1: Inverse square law — intensity vs distance (one surface)
round_trip = 2 * distances
I_echo_limestone = P_source * (1 - 0.02) / (4 * np.pi * round_trip**2)
axes[0, 0].plot(distances, I_echo_limestone * 1e9, color='#3b82f6', linewidth=2)
axes[0, 0].set_xlabel('Distance to cliff (m)', color='white')
axes[0, 0].set_ylabel('Echo intensity (nW/m²)', color='white')
axes[0, 0].set_title('Inverse square law (limestone)', color='white')
axes[0, 0].axhline(y=I_ref*1e9, color='#ef4444', linestyle=':', linewidth=1, label='Hearing threshold')

# Panel 2: Echo intensity in dB vs distance for all surfaces
for name, props in surfaces.items():
    alpha = props['alpha']
    color = props['color']
    I_echo = P_source * (1 - alpha) / (4 * np.pi * (2 * distances)**2)
    dB = 10 * np.log10(I_echo / I_ref)
    axes[0, 1].plot(distances, dB, color=color, linewidth=2, label=name)

axes[0, 1].axhline(y=0, color='white', linestyle=':', linewidth=0.8, alpha=0.5)
axes[0, 1].axhline(y=20, color='gray', linestyle=':', linewidth=0.8, alpha=0.5)
axes[0, 1].set_xlabel('Distance to surface (m)', color='white')
axes[0, 1].set_ylabel('Echo level (dB)', color='white')
axes[0, 1].set_title('Echo strength by surface type', color='white')
axes[0, 1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)

# Panel 3: dB drop per doubling of distance
d_ref = 50  # reference distance
doublings = np.array([1, 2, 4, 8, 16, 32])
d_values = d_ref * doublings
I_values = P_source * 0.98 / (4 * np.pi * (2 * d_values)**2)
dB_values = 10 * np.log10(I_values / I_ref)

axes[1, 0].bar(range(len(doublings)), dB_values, color='#3b82f6', alpha=0.8)
axes[1, 0].set_xticks(range(len(doublings)))
axes[1, 0].set_xticklabels([f'{d}m' for d in d_values], color='gray', fontsize=8)
axes[1, 0].set_ylabel('Echo level (dB)', color='white')
axes[1, 0].set_title('6 dB drop per distance doubling', color='white')
for i, (db, d) in enumerate(zip(dB_values, d_values)):
    axes[1, 0].text(i, db + 0.5, f'{db:.1f} dB', ha='center', color='white', fontsize=8)

# Panel 4: Absorption coefficient comparison
names = list(surfaces.keys())
alphas = [surfaces[n]['alpha'] for n in names]
colors = [surfaces[n]['color'] for n in names]
reflected = [1 - a for a in alphas]

axes[1, 1].barh(range(len(names)), reflected, color=colors, alpha=0.8)
axes[1, 1].set_yticks(range(len(names)))
axes[1, 1].set_yticklabels(names, color='gray', fontsize=8)
axes[1, 1].set_xlabel('Fraction of sound reflected', color='white')
axes[1, 1].set_title('Reflection coefficient (1 - α)', color='white')
axes[1, 1].set_xlim(0, 1.05)
for i, r in enumerate(reflected):
    axes[1, 1].text(r + 0.01, i, f'{r:.0%}', va='center', color='white', fontsize=9)

plt.tight_layout()
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')
print()
print("Echo analysis for a 0.001 W shout:")
print(f"{'Surface':<20} {'α':>5} {'Echo at 100m (dB)':>18} {'Echo at 300m (dB)':>18}")
print("-" * 65)
for name, props in surfaces.items():
    alpha = props['alpha']
    for d in [100, 300]:
        I = P_source * (1 - alpha) / (4 * np.pi * (2*d)**2)
        db = 10 * np.log10(I / I_ref)
        if d == 100:
            print(f"{name:<20} {alpha:>5.2f} {db:>18.1f}", end="")
        else:
            print(f" {db:>18.1f}")
print()
print("Limestone at 100m: ~27 dB (whisper level). Forest at 300m: ~2 dB (barely audible).")`,
      challenge: 'Add atmospheric absorption to the model. In humid air, sound at higher frequencies is absorbed more (about 0.01-0.1 dB/m for frequencies 1-10 kHz). Model how a high-pitched whistle (4 kHz) versus a low shout (200 Hz) differ in echo strength at 300m.',
      successHint: 'The inverse square law plus surface absorption explains why mountain echoes are quieter than the original sound. Limestone cliffs in Meghalaya are ideal reflectors. Next we explore how this physics is harnessed in technology.',
    },
    {
      title: 'Acoustic imaging — echolocation, sonar, and ultrasound',
      concept: `Echoes are not just curiosities — they are the foundation of several powerful technologies that "see" with sound.

**Biological echolocation**: Bats emit ultrasonic chirps (20-200 kHz) and listen for the returning echoes to build a 3D map of their surroundings. They can detect a moth's wing 5 meters away by measuring: (a) the time delay — gives distance, (b) the frequency shift (Doppler) — gives the prey's speed and direction, (c) the intensity difference between ears — gives direction. Dolphins use a similar system underwater, where sound travels 4.3× faster than in air.

**Sonar**: Ships use sound pulses to map the ocean floor (bathymetry). A pulse is sent downward, and the echo return time gives depth: d = v_water × t / 2. Side-scan sonar sends pulses sideways and builds detailed images of the seabed — essentially acoustic photography.

**Medical ultrasound**: Frequencies of 2-18 MHz are sent into the body. Different tissues (muscle, bone, fluid) have different **acoustic impedances**, so each boundary reflects some energy. The pattern of reflections builds an image. Higher frequencies give better resolution but penetrate less deeply.

**Seismic surveying**: Geologists set off controlled explosions or vibrations and record how the sound reflects off underground rock layers. This maps oil deposits, fault lines, and underground water — all using the same echo principle the Khasi Hills demonstrate naturally.`,
      analogy: 'Acoustic imaging is like a blind person tapping their cane. Each tap sends out a sound, and the person builds a mental map from the echoes — hard floor here, wall there, open doorway ahead. Bats, sonar, and ultrasound machines are doing the same thing, just with much more precision and at frequencies humans cannot hear.',
      storyConnection: 'The Mawsmai and Krem Liat Prah caves of Meghalaya — among the longest caves in the Indian subcontinent — were partially mapped using acoustic techniques. The cave passages create complex echo patterns: sound bouncing off stalactites, reflecting down branching tunnels, absorbed by underground pools. Biologists studying the caves have recorded bats navigating the pitch-dark passages using echolocation, their ultrasonic chirps bouncing off walls only centimeters away with a precision that GPS cannot match underground.',
      checkQuestion: 'A dolphin emits a sonar click and hears the echo 0.012 seconds later. Sound travels at 1480 m/s in seawater. How far away is the object? If the echo is slightly higher in pitch than the original click, is the object moving toward or away from the dolphin?',
      checkAnswer: 'Distance = 1480 × 0.012 / 2 = 8.88 meters. A higher-pitched echo means the reflected sound waves are compressed — the object is moving toward the dolphin (Doppler effect). If the object were moving away, the echo would be lower-pitched (stretched waves). This is how dolphins distinguish approaching prey from retreating fish.',
      codeIntro: 'Simulate a basic sonar/echolocation system: send pulses, detect echoes from multiple objects, and reconstruct their positions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sonar simulation: 1D pulse-echo system
sr = 44100
duration = 0.5  # seconds of recording
t = np.linspace(0, duration, int(sr * duration), endpoint=False)
speed = 343.0  # sound in air (could be 1480 for water)

# Objects at different distances with different reflectivities
objects = [
    {'distance': 15, 'reflectivity': 0.9, 'name': 'Rock wall'},
    {'distance': 35, 'reflectivity': 0.6, 'name': 'Tree trunk'},
    {'distance': 52, 'reflectivity': 0.3, 'name': 'Foliage'},
    {'distance': 78, 'reflectivity': 0.85, 'name': 'Cliff face'},
]

# Transmit pulse: short chirp (frequency sweep for better resolution)
pulse_duration = 0.003  # 3ms
pulse_samples = int(pulse_duration * sr)
t_pulse = np.linspace(0, pulse_duration, pulse_samples)
# Linear frequency sweep 1000-5000 Hz
pulse = np.sin(2 * np.pi * (1000 + 2000 * t_pulse / pulse_duration) * t_pulse)
pulse *= np.hanning(pulse_samples)

# Build received signal
received = np.zeros_like(t)
received[:pulse_samples] += pulse  # direct signal (attenuated)

for obj in objects:
    delay = 2 * obj['distance'] / speed
    delay_samples = int(delay * sr)
    atten = obj['reflectivity'] / (1 + (obj['distance'] / 10)**2) * 50
    if delay_samples + pulse_samples < len(received):
        received[delay_samples:delay_samples + pulse_samples] += atten * pulse

# Add noise
received += 0.01 * np.random.randn(len(received))

# Matched filter: cross-correlate received signal with transmitted pulse
correlation = np.correlate(received, pulse, mode='full')
correlation = correlation[len(pulse)-1:]  # keep causal part
correlation = correlation / np.max(np.abs(correlation))

# Convert sample index to distance
corr_distances = np.arange(len(correlation)) / sr * speed / 2

fig, axes = plt.subplots(3, 1, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Panel 1: Transmitted pulse
axes[0].plot(t_pulse * 1000, pulse, color='#22c55e', linewidth=1.5)
axes[0].set_title('Transmitted chirp pulse (3ms, 1-5 kHz sweep)', color='white')
axes[0].set_xlabel('Time (ms)', color='white')
axes[0].set_ylabel('Amplitude', color='white')

# Panel 2: Received signal (raw)
axes[1].plot(t * 1000, received, color='#3b82f6', linewidth=0.5)
for obj in objects:
    delay_ms = 2 * obj['distance'] / speed * 1000
    axes[1].axvline(x=delay_ms, color='#f59e0b', linestyle='--', linewidth=1, alpha=0.6)
    axes[1].text(delay_ms, np.max(received)*0.8, f"{obj['name']}\
{obj['distance']}m",
                 color='#f59e0b', fontsize=7, ha='center')
axes[1].set_title('Received signal (echoes + noise)', color='white')
axes[1].set_xlabel('Time (ms)', color='white')
axes[1].set_ylabel('Amplitude', color='white')

# Panel 3: Matched filter output (distance domain)
mask = corr_distances < 100
axes[2].plot(corr_distances[mask], np.abs(correlation[mask]), color='#ec4899', linewidth=1.5)
for obj in objects:
    axes[2].axvline(x=obj['distance'], color='#f59e0b', linestyle='--', linewidth=1, alpha=0.6)
    axes[2].text(obj['distance'], 0.9, f"{obj['name']}", color='#f59e0b',
                 fontsize=8, ha='center', rotation=45)
axes[2].set_title('Matched filter output — detected objects', color='white')
axes[2].set_xlabel('Distance (m)', color='white')
axes[2].set_ylabel('Correlation', color='white')

plt.tight_layout()
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')
print()
print("Sonar detection results:")
print(f"{'Object':<15} {'Actual (m)':>10} {'Round trip (ms)':>15} {'Reflectivity':>12}")
print("-" * 55)
for obj in objects:
    rt = 2 * obj['distance'] / speed * 1000
    print(f"{obj['name']:<15} {obj['distance']:>10.1f} {rt:>15.1f} {obj['reflectivity']:>12.1%}")
print()
print("The matched filter (cross-correlation) is the key to modern sonar/radar.")
print("It pulls weak echoes out of noise by looking for the transmitted pulse shape.")`,
      challenge: 'Add Doppler to the simulation: make one of the objects move toward the source at 5 m/s. The returned pulse will be compressed in time (higher frequency). Compute the Doppler-shifted frequency and show it in the matched filter output.',
      successHint: 'The same echo physics that makes mountain valleys ring is the foundation of sonar, ultrasound, and echolocation. Next we explore how sound waves interfere in enclosed spaces.',
    },
    {
      title: 'Interference in real spaces — standing waves and acoustics',
      concept: `When two sound waves overlap, they **interfere**. If their peaks align (in phase), they add up — **constructive interference** makes the sound louder. If peaks meet troughs (out of phase), they cancel — **destructive interference** creates silence.

In an enclosed space — a room, a cave, a valley between parallel cliffs — reflected waves interfere with incoming waves to create **standing waves**. At certain frequencies, the reflections reinforce perfectly:

**f_n = n × v / (2L)**

where L is the distance between walls and n = 1, 2, 3... These are the **resonant frequencies** or **modes** of the space. At a resonant frequency, you get fixed locations of maximum amplitude (**antinodes**) and zero amplitude (**nodes**).

This has real consequences:
- **Dead spots**: Stand at a node and you hear almost nothing at that frequency. Move half a meter and it is loud again.
- **Room modes**: Small rooms have modes in the audible range (below ~300 Hz) that make bass sound uneven — boomy in corners, absent in the middle.
- **Acoustic treatment**: Studios use absorbers (to remove reflections) and diffusers (to scatter reflections) to eliminate standing waves and create even sound.

Caves and narrow gorges are natural resonators. Their irregular shapes create complex interference patterns — some frequencies boom and echo, others are swallowed.`,
      analogy: 'Imagine two people shaking opposite ends of a jump rope in sync. At certain speeds, the rope forms stable patterns — loops that stand still while the rope vibrates. These are standing waves. The points that do not move (nodes) are where the two waves always cancel. The points that swing wildly (antinodes) are where they always reinforce.',
      storyConnection: 'The Mawsmai cave in Cherrapunji is a natural acoustic laboratory. Its narrow limestone passages, some only 2-3 meters wide, create standing waves at low frequencies that make certain spots eerily loud and others oddly silent. Visitors walking through the cave pass through nodes and antinodes without realizing it. The cave entrance, shaped like a funnel, amplifies certain frequencies — a natural horn that Khasi guides say "speaks" during monsoon winds.',
      checkQuestion: 'A narrow cave passage is 4 meters wide. What is the fundamental resonant frequency (n=1)? If a person hums at exactly this frequency while standing at the center of the passage, are they at a node or antinode?',
      checkAnswer: 'f₁ = 1 × 343 / (2 × 4) = 42.9 Hz. This is a very low rumble near the lower limit of human hearing. At the center of the passage (halfway between walls), the person is at an antinode for the fundamental mode (the first mode has maximum amplitude at the center and nodes at the walls). They would feel/hear the resonance strongly at this position.',
      codeIntro: 'Visualize standing waves forming between two walls, showing nodes and antinodes, and compute room modes for different cavity sizes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

v_sound = 343.0  # m/s

# Standing wave visualization
L = 8.0  # distance between walls (meters)
x = np.linspace(0, L, 500)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Panel 1: Standing wave modes (first 4)
colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
for n in range(1, 5):
    wavelength = 2 * L / n
    freq = n * v_sound / (2 * L)
    amplitude = np.sin(n * np.pi * x / L)
    axes[0, 0].plot(x, amplitude + 2.5 * n, color=colors[n-1], linewidth=2,
                     label=f'n={n}: {freq:.1f} Hz (λ={wavelength:.1f}m)')
    # Mark nodes
    for k in range(n + 1):
        node_x = k * L / n
        axes[0, 0].plot(node_x, 2.5 * n, 'o', color='white', markersize=4)

axes[0, 0].axvline(x=0, color='gray', linewidth=3, alpha=0.5)
axes[0, 0].axvline(x=L, color='gray', linewidth=3, alpha=0.5)
axes[0, 0].set_xlabel('Position (m)', color='white')
axes[0, 0].set_title(f'Standing wave modes (L={L}m valley)', color='white')
axes[0, 0].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# Panel 2: Interference pattern — two counter-propagating waves over time
freq_demo = v_sound / (2 * L)  # fundamental
t_frames = np.linspace(0, 2 / freq_demo, 8)
for i, t_val in enumerate(t_frames):
    # Right-going and left-going waves
    right_wave = np.sin(2 * np.pi * (x / (2 * L) - freq_demo * t_val))
    left_wave = np.sin(2 * np.pi * (x / (2 * L) + freq_demo * t_val))
    standing = right_wave + left_wave
    alpha = 0.3 + 0.7 * (i / len(t_frames))
    axes[0, 1].plot(x, standing, color='#3b82f6', linewidth=1, alpha=alpha)

# Envelope
envelope = 2 * np.abs(np.sin(np.pi * x / L))
axes[0, 1].plot(x, envelope, color='#f59e0b', linewidth=2, linestyle='--', label='Envelope')
axes[0, 1].plot(x, -envelope, color='#f59e0b', linewidth=2, linestyle='--')
axes[0, 1].set_title('Standing wave formation (n=1)', color='white')
axes[0, 1].set_xlabel('Position (m)', color='white')
axes[0, 1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 3: Room modes for different cavity sizes
cavity_sizes = [2, 4, 8, 16, 30]
for L_room in cavity_sizes:
    modes = [n * v_sound / (2 * L_room) for n in range(1, 8)]
    modes = [f for f in modes if f < 500]
    axes[1, 0].scatter(modes, [L_room] * len(modes), s=60, alpha=0.8)
    for f in modes:
        axes[1, 0].plot([f, f], [L_room - 0.3, L_room + 0.3], color='#3b82f6', linewidth=1.5)

axes[1, 0].set_xlabel('Resonant frequency (Hz)', color='white')
axes[1, 0].set_ylabel('Cavity size (m)', color='white')
axes[1, 0].set_title('Room modes vs cavity size', color='white')
axes[1, 0].set_xscale('log')

# Panel 4: Sound pressure level at different positions (composite)
L_cave = 6.0  # 6m cave passage
x_pos = np.linspace(0, L_cave, 300)
freqs_test = np.linspace(20, 500, 200)
pressure_map = np.zeros((len(freqs_test), len(x_pos)))

for i, f in enumerate(freqs_test):
    # Sum first 10 modes, each weighted by closeness to f
    for n in range(1, 11):
        f_mode = n * v_sound / (2 * L_cave)
        # Lorentzian resonance shape (Q factor ~20)
        Q = 20
        response = 1.0 / np.sqrt(1 + Q**2 * ((f / f_mode) - (f_mode / f))**2)
        spatial = np.sin(n * np.pi * x_pos / L_cave)**2
        pressure_map[i, :] += response * spatial

im = axes[1, 1].imshow(pressure_map, aspect='auto', origin='lower',
                         extent=[0, L_cave, freqs_test[0], freqs_test[-1]],
                         cmap='inferno')
axes[1, 1].set_xlabel('Position in cave (m)', color='white')
axes[1, 1].set_ylabel('Frequency (Hz)', color='white')
axes[1, 1].set_title('Sound pressure map (bright = loud)', color='white')

plt.tight_layout()
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')
print()
print("Room modes for an 8m valley/cave passage:")
for n in range(1, 6):
    f = n * v_sound / (2 * 8)
    print(f"  Mode {n}: {f:.1f} Hz (wavelength {v_sound/f:.1f}m)")
print()
print("The pressure map shows dead spots (dark) and hot spots (bright).")
print("At a node, you could be standing in silence while 1m away the sound booms.")
print("Cave passages in Meghalaya create natural standing wave patterns like this.")`,
      challenge: 'Extend the model to 2D: a rectangular cave chamber (8m × 5m). The modes become f(m,n) = v/2 × sqrt((m/Lx)² + (n/Ly)²). Plot the first 10 modes and visualize the 2D pressure pattern for a specific mode.',
      successHint: 'Standing waves explain why certain spots in caves and valleys are mysteriously loud or silent. The final lesson brings all of this together with computational methods.',
    },
    {
      title: 'Computational acoustics — simulating sound in complex spaces',
      concept: `Real mountain valleys and caves are not neat rectangles — they have irregular walls, overhangs, scattered boulders, vegetation, wind. Predicting how sound behaves in such environments requires computational acoustics.

Three main approaches:

**1. Ray tracing**: Treat sound as rays (like light rays). Launch thousands of rays from a source, bounce them off surfaces using the reflection law, track their energy loss at each bounce. Fast and intuitive but ignores wave effects (diffraction, interference). Works well for high frequencies where wavelengths are small compared to surface features.

**2. Finite Element Method (FEM)**: Divide the entire space into tiny triangular (2D) or tetrahedral (3D) elements. Solve the wave equation at every element simultaneously. Captures all wave effects perfectly but is computationally expensive — a small room at audio frequencies requires millions of elements.

**3. Boundary Element Method (BEM)**: Only mesh the boundaries (walls, obstacles), not the entire volume. Solve how the boundaries scatter incoming waves. More efficient than FEM for open spaces (like outdoor valleys) but still computationally demanding.

**Hybrid methods** combine ray tracing for high frequencies with FEM/BEM for low frequencies, getting the best of both worlds. Modern room acoustics software uses this approach to design concert halls, recording studios, and noise barriers.

The key equation underlying all methods is the **wave equation**:

∂²p/∂t² = v² × ∇²p

where p is pressure and v is the speed of sound. Every computational method is a different strategy for solving this equation in a complex geometry.`,
      analogy: 'Ray tracing is like predicting where billiard balls will go — fast, approximate, works well in open spaces. FEM is like simulating every water molecule in a pool to predict wave patterns — exact but slow. BEM is a compromise: just simulate the pool walls and figure out the interior from that. Engineers choose based on how much accuracy they need and how long they can wait.',
      storyConnection: 'Researchers studying the acoustic properties of Meghalaya caves have used a combination of impulse response measurements (clapping hands and recording the reverberations) and ray-tracing simulations to understand why some chambers amplify sound and others absorb it. The irregular limestone formations create diffusion patterns that are nearly impossible to calculate by hand — only computational methods can predict the complex echo patterns heard deep inside Krem Liat Prah, one of the longest caves in the subcontinent.',
      checkQuestion: 'Why would ray tracing fail to accurately predict the echo pattern of a sound with wavelength 3.4m (about 100 Hz) bouncing off a 1m boulder? What method would you use instead?',
      checkAnswer: 'At 100 Hz the wavelength (3.4m) is larger than the boulder (1m). Sound diffracts around objects smaller than its wavelength rather than reflecting cleanly off them. Ray tracing assumes reflection (wavelength << object size) and would incorrectly predict a sharp shadow behind the boulder. FEM or BEM would correctly model the diffraction, showing how the low-frequency sound bends around the boulder with minimal blockage.',
      codeIntro: 'Implement a 2D ray tracer that simulates sound bouncing around a simplified mountain valley cross-section.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class AcousticRayTracer:
    """2D ray tracer for sound in a valley cross-section."""

    def __init__(self):
        self.walls = []  # list of (x1, y1, x2, y2, absorption) segments

    def add_wall(self, x1, y1, x2, y2, absorption=0.05):
        self.walls.append((x1, y1, x2, y2, absorption))

    def _intersect_ray_segment(self, ox, oy, dx, dy, x1, y1, x2, y2):
        """Find intersection of ray (origin+direction) with line segment."""
        sx, sy = x2 - x1, y2 - y1
        denom = dx * sy - dy * sx
        if abs(denom) < 1e-10:
            return None, None, None
        t = ((x1 - ox) * sy - (y1 - oy) * sx) / denom
        u = ((x1 - ox) * dy - (y1 - oy) * dx) / denom
        if t > 0.001 and 0 <= u <= 1:
            return t, ox + t * dx, oy + t * dy
        return None, None, None

    def _reflect(self, dx, dy, nx, ny):
        """Reflect direction (dx,dy) off surface with normal (nx,ny)."""
        dot = dx * nx + dy * ny
        return dx - 2 * dot * nx, dy - 2 * dot * ny

    def trace_ray(self, ox, oy, angle_deg, max_bounces=15):
        """Trace a single ray, return list of (x, y, energy) points."""
        dx = np.cos(np.radians(angle_deg))
        dy = np.sin(np.radians(angle_deg))
        energy = 1.0
        path = [(ox, oy, energy)]

        for _ in range(max_bounces):
            best_t = float('inf')
            best_wall = None
            best_x, best_y = None, None

            for wall in self.walls:
                x1, y1, x2, y2, alpha = wall
                t, ix, iy = self._intersect_ray_segment(ox, oy, dx, dy, x1, y1, x2, y2)
                if t is not None and t < best_t:
                    best_t = t
                    best_wall = wall
                    best_x, best_y = ix, iy

            if best_wall is None or best_t > 2000:
                # Ray escaped
                path.append((ox + dx * 500, oy + dy * 500, energy))
                break

            x1, y1, x2, y2, alpha = best_wall
            # Surface normal (perpendicular to wall segment)
            wx, wy = x2 - x1, y2 - y1
            length = np.sqrt(wx**2 + wy**2)
            nx, ny = -wy / length, wx / length
            # Make sure normal points toward the ray origin
            if nx * (ox - best_x) + ny * (oy - best_y) < 0:
                nx, ny = -nx, -ny

            energy *= (1 - alpha)
            path.append((best_x, best_y, energy))

            if energy < 0.01:
                break

            dx, dy = self._reflect(dx, dy, nx, ny)
            ox, oy = best_x, best_y

        return path

# Build a mountain valley cross-section
tracer = AcousticRayTracer()

# Valley floor
tracer.add_wall(-200, 0, 200, 0, absorption=0.15)

# Left mountain slope (rocky)
tracer.add_wall(-200, 0, -180, 80, absorption=0.03)
tracer.add_wall(-180, 80, -150, 180, absorption=0.03)
tracer.add_wall(-150, 180, -120, 300, absorption=0.05)
tracer.add_wall(-120, 300, -100, 400, absorption=0.03)

# Right mountain slope (partially forested)
tracer.add_wall(200, 0, 180, 60, absorption=0.03)
tracer.add_wall(180, 60, 160, 150, absorption=0.40)  # forested section
tracer.add_wall(160, 150, 140, 250, absorption=0.40)  # forested section
tracer.add_wall(140, 250, 120, 350, absorption=0.05)
tracer.add_wall(120, 350, 100, 400, absorption=0.03)

# Source position: person shouting from valley floor
source_x, source_y = 0, 5

fig, axes = plt.subplots(1, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.set_aspect('equal')

# Panel 1: Ray tracing visualization
n_rays = 36
angles = np.linspace(5, 175, n_rays)
ray_colors = plt.cm.plasma(np.linspace(0.2, 0.9, n_rays))

# Draw walls
for wall in tracer.walls:
    x1, y1, x2, y2, alpha = wall
    color = '#22c55e' if alpha > 0.2 else '#94a3b8'
    lw = 3 if alpha > 0.2 else 2
    axes[0].plot([x1, x2], [y1, y2], color=color, linewidth=lw)

# Trace and draw rays
echo_times = []
for i, angle in enumerate(angles):
    path = tracer.trace_ray(source_x, source_y, angle, max_bounces=8)
    xs = [p[0] for p in path]
    ys = [p[1] for p in path]
    energies = [p[2] for p in path]

    for j in range(len(xs) - 1):
        axes[0].plot([xs[j], xs[j+1]], [ys[j], ys[j+1]],
                     color=ray_colors[i], linewidth=0.8, alpha=energies[j])

    # Calculate total path length for echo time
    total_dist = sum(np.sqrt((xs[j+1]-xs[j])**2 + (ys[j+1]-ys[j])**2) for j in range(len(xs)-1))
    echo_times.append(total_dist / 343.0)

axes[0].plot(source_x, source_y, '*', color='#f59e0b', markersize=15, zorder=5)
axes[0].text(source_x + 5, source_y + 10, 'Source', color='#f59e0b', fontsize=10)
axes[0].set_xlim(-220, 220)
axes[0].set_ylim(-20, 420)
axes[0].set_xlabel('Horizontal distance (m)', color='white')
axes[0].set_ylabel('Altitude (m)', color='white')
axes[0].set_title('Sound rays in a mountain valley\
(green = forested, gray = rock)', color='white', fontsize=11)

# Panel 2: Echo arrival times and energies
# Collect all reflection points and their arrival times
arrival_data = []
for angle in np.linspace(5, 175, 100):
    path = tracer.trace_ray(source_x, source_y, angle, max_bounces=6)
    cumulative_dist = 0
    for j in range(1, len(path)):
        dx = path[j][0] - path[j-1][0]
        dy = path[j][1] - path[j-1][1]
        cumulative_dist += np.sqrt(dx**2 + dy**2)
        arrival_time = cumulative_dist / 343.0
        energy_db = 10 * np.log10(max(path[j][2], 1e-10))
        arrival_data.append((arrival_time, energy_db, j))

times = [d[0] for d in arrival_data]
energies_db = [d[1] for d in arrival_data]
bounces = [d[2] for d in arrival_data]

scatter = axes[1].scatter(times, energies_db, c=bounces, cmap='plasma',
                           s=10, alpha=0.6, vmin=1, vmax=6)
axes[1].axvline(x=0.1, color='#ef4444', linestyle='--', linewidth=1.5, alpha=0.7,
                 label='Echo threshold (0.1s)')
axes[1].set_xlabel('Arrival time (s)', color='white')
axes[1].set_ylabel('Energy (dB relative)', color='white')
axes[1].set_title('Echo arrival pattern', color='white')
axes[1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
plt.colorbar(scatter, ax=axes[1], label='Bounce number')

plt.tight_layout()
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')
print()
print("Valley echo simulation results:")
print(f"  Rays traced: {n_rays}")
print(f"  Valley width: 400m (±200m from center)")
print(f"  Left slope: bare rock (α=0.03-0.05)")
print(f"  Right slope: partially forested (α=0.40 in middle section)")
print()
print("Observations:")
print("  - Rays hitting rock bounce cleanly with minimal loss")
print("  - Rays hitting forest are absorbed heavily (green walls)")
print("  - First echoes arrive ~1.0-1.2s later from the near rock walls")
print("  - Multiple bounces between walls create flutter echo pattern")
print("  - The asymmetry (rock vs forest) means echoes from the left are louder")`,
      challenge: 'Add a cave opening in the left cliff face (remove a wall segment and add interior walls). Trace rays into the cave and observe how sound gets trapped, creating reverberant energy that leaks out slowly. This models the "cave echo" effect heard near the entrance to Mawsmai cave.',
      successHint: 'You have built a working acoustic ray tracer that simulates sound in a mountain valley. This is the same fundamental technique used in architectural acoustics, noise modeling, and virtual reality audio. Level 4 will take this further into a full echo simulator.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Acoustics Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (sound & wave fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real acoustics simulations. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
