import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import WavelengthSpectrum from '../diagrams/WavelengthSpectrum';
import RayleighScatteringDiagram from '../diagrams/RayleighScatteringDiagram';
import SunsetPathDiagram from '../diagrams/SunsetPathDiagram';
import MieVsRayleighDiagram from '../diagrams/MieVsRayleighDiagram';
import MirageDiagram from '../diagrams/MirageDiagram';
import RainbowRaindropDiagram from '../diagrams/RainbowRaindropDiagram';

export default function OrangeSunsetsLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Your first plot — the visible spectrum',
      concept: `In Level 0 you learned that white light is a mix of all visible colors, each with a different **wavelength** — red is longest (~700 nm), violet is shortest (~380 nm).

Now let's see this with code. We'll use two Python libraries:
- **NumPy** (\`np\`) — creates arrays of numbers (like a spreadsheet column)
- **Matplotlib** (\`plt\`) — draws charts and graphs

The code below creates an array of wavelengths from 380 to 700 nm, then plots a colored bar showing which color each wavelength corresponds to. **Read each comment line** — they explain what the code does.

📚 *New to NumPy or Matplotlib? Open the Reference Library for full guides.*`,
      analogy: 'Think of \`np.linspace(380, 700, 100)\` as saying "give me 100 equally spaced numbers between 380 and 700." It is like marking 100 evenly spaced points on a ruler that goes from 380 to 700.',
      storyConnection: 'Rongili the sky painter used pots of different colors. In code, we represent each color by its wavelength number. The visible spectrum IS Rongili\'s palette — every sunset color lives somewhere between 380 and 700 nm.',
      checkQuestion: 'If you changed np.linspace(380, 700, 100) to np.linspace(380, 700, 5), what would happen to the plot?',
      checkAnswer: 'Instead of 100 data points you would have only 5 — the plot would show just 5 colored bars instead of a smooth gradient. More points = smoother chart. This is true for all data visualization: resolution matters.',
      codeIntro: 'Plot the visible spectrum — your first chart with NumPy and Matplotlib.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create 100 wavelengths from violet (380nm) to red (700nm)
wavelengths = np.linspace(380, 700, 100)

# Assign a color to each wavelength (simplified RGB mapping)
colors = []
for wl in wavelengths:
    if wl < 440:   colors.append('violet')
    elif wl < 490: colors.append('blue')
    elif wl < 510: colors.append('cyan')
    elif wl < 580: colors.append('green')
    elif wl < 600: colors.append('yellow')
    elif wl < 645: colors.append('orange')
    else:          colors.append('red')

# Plot each wavelength as a colored bar
plt.figure(figsize=(10, 3))
plt.bar(wavelengths, [1]*len(wavelengths), color=colors, width=3.5)
plt.xlabel('Wavelength (nm)')
plt.title('The Visible Spectrum — Every Color of Sunlight')
plt.yticks([])  # hide y-axis (height doesn't matter here)
plt.show()

print("Violet (380nm) is on the left, red (700nm) on the right.")
print("White sunlight contains ALL of these colors mixed together.")
print()
print("Next question: why does the sky only show BLUE?")`,
      challenge: 'Change the code to plot wavelengths from 300 to 800 nm. What happens outside the visible range (below 380 and above 700)? Those are ultraviolet and infrared — invisible to your eyes but real. Label them on your chart.',
      successHint: 'You just created your first scientific visualization! np.linspace generates data, plt.bar draws it. Every plot in science starts with these two steps: create the data, then visualize it.',
    },
    {
      title: 'The 1/λ⁴ rule — why blue scatters more',
      concept: `In Level 0 you learned that air molecules bounce blue light around more than red. Now let's put a number on it.

The rule is: **scattering ∝ 1/λ⁴** (one over wavelength to the fourth power). That "to the fourth" is what makes the difference dramatic — not just a little more, but *hugely* more.

Let's calculate. Red light has wavelength 700 nm, blue has 450 nm:
- (700/450)⁴ = 1.56⁴ = **5.8×**

Blue light scatters **5.8 times more** than red. Not double, not triple — nearly six times more. That single formula explains the blue sky.

In the code below, you will use NumPy to compute \`1 / wavelengths**4\` for every colour — and plot the result. The curve is steep: violet scatters even more than blue. But we see a blue sky, not violet, because the Sun emits less violet and our eyes are less sensitive to it.

📚 *The \`**\` operator in Python means "to the power of". \`x**4\` = x × x × x × x.*`,
      analogy: 'Imagine you\'re in a crowd and you throw a tennis ball straight ahead. It hits a few heads and bounces off in random directions. Now imagine you throw a bowling ball — it plows through without bouncing. Blue light is the tennis ball (short wavelength, easily scattered by small air molecules). Red light is the bowling ball (long wavelength, passes through). The sky is blue because the "tennis balls" are bouncing everywhere above you.',
      storyConnection: 'The Brahmaputra valley, surrounded by hills and full of humid air, has a particularly rich blue sky on clear days. The moisture particles in Assam\'s humid air add to the scattering effect. When the story says "the sky deepened to violet before sunset," it\'s describing the transition from Rayleigh-dominated blue to sunset orange as the scattering path length increases.',
      checkQuestion: 'Mars has a pink/orange sky during the day, not blue. Why?',
      checkAnswer: 'Mars\'s atmosphere is extremely thin (1% of Earth\'s pressure) and filled with fine reddish iron oxide dust (~1-10 micrometers). These dust particles are large enough that they don\'t follow Rayleigh scattering (which requires particles much smaller than light wavelengths). Instead, they follow Mie scattering, which scatters red/orange wavelengths more effectively in the forward direction. Additionally, the thin atmosphere scatters less blue. Result: pink-orange sky.',
      codeIntro: 'Plot the Rayleigh scattering formula and see why blue dominates.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Every wavelength from violet to red
wavelengths = np.linspace(380, 700, 200)

# Rayleigh scattering: intensity = 1 / wavelength^4
# Normalize so red (700nm) = 1
scattering = (700 / wavelengths) ** 4

# Plot it
plt.figure(figsize=(10, 5))
plt.plot(wavelengths, scattering, linewidth=2.5, color='royalblue')
plt.fill_between(wavelengths, scattering, alpha=0.15, color='royalblue')

# Mark key colors
plt.annotate(f'Violet: {scattering[0]:.1f}× red', xy=(380, scattering[0]),
             xytext=(430, scattering[0]-1), fontsize=10, color='purple',
             arrowprops=dict(arrowstyle='->', color='purple'))
plt.annotate(f'Blue: {np.interp(450, wavelengths, scattering):.1f}× red',
             xy=(450, np.interp(450, wavelengths, scattering)),
             xytext=(500, np.interp(450, wavelengths, scattering)-1),
             fontsize=10, color='blue',
             arrowprops=dict(arrowstyle='->', color='blue'))
plt.annotate('Red: 1×', xy=(700, 1), xytext=(640, 3),
             fontsize=10, color='red',
             arrowprops=dict(arrowstyle='->', color='red'))

plt.xlabel('Wavelength (nm)', fontsize=12)
plt.ylabel('Scattering intensity (relative to red)', fontsize=12)
plt.title('Rayleigh Scattering: 1/λ⁴', fontsize=14)
plt.grid(alpha=0.3)
plt.show()

print("The curve is steep!")
print(f"  Violet (380nm) scatters {scattering[0]:.1f}× more than red")
print(f"  Blue (450nm) scatters {np.interp(450, wavelengths, scattering):.1f}× more than red")
print()
print("This is why the sky is blue — blue light bounces")
print("off air molecules in every direction, filling the sky.")`,
      challenge: 'Change the exponent from 4 to 2 (try `(700 / wavelengths) ** 2`). How does the curve change? With a weaker dependence on wavelength, would the sky still look blue? What exponent would make the sky white?',
      successHint: 'Rayleigh scattering is one of the most elegant explanations in physics. A single equation (1/λ⁴) explains both the blue sky and the orange sunset. The rest of this lesson series builds on this foundation.',
    },
    {
      title: 'Simulating a sunset — what survives the long path?',
      concept: `You now know the scattering rule (1/λ⁴). At noon, sunlight passes through about 10 km of atmosphere. At sunset, the path is roughly **350 km** — 35 times longer. More path = more scattering = more blue removed.

The code below simulates this. For each sun angle, it calculates how much of each colour survives the atmospheric path. The key line is:

\`surviving = solar * np.exp(-scattering * path_length)\`

This is the **Beer-Lambert law** — light gets weaker exponentially as it passes through a scattering medium. The \`np.exp(-x)\` function (e to the negative x) drops toward zero as x increases. For blue light, \`scattering\` is large, so \`np.exp(-scattering * path_length)\` is tiny — almost nothing survives. For red, \`scattering\` is small, so most of it gets through.

Run the code and watch the Sun's colour change from white-yellow at noon to deep orange-red at sunset.

📚 *\`np.exp()\` is the exponential function — you'll use it constantly in science and data analysis.*`,
      analogy: 'Imagine shining a white flashlight through a long hallway filled with blue fog. Near the flashlight, you see white light. But by the time the beam reaches the far end, all the blue has been scattered by the fog, and only red/orange remains. The hallway is the atmosphere, the fog is air molecules, and the far end of the hallway is the horizon at sunset.',
      storyConnection: 'The story asks "Why Assam\'s Sunsets Are Orange?" The answer is deeply specific: Assam\'s location at ~26°N latitude, its river valley topography providing unobstructed western horizons over the Brahmaputra, and its high monsoon humidity all combine to produce sunsets that are more vivid orange than those in drier, higher-altitude regions.',
      checkQuestion: 'After a major volcanic eruption, sunsets around the world become dramatically more vivid for months. Why?',
      checkAnswer: 'Volcanic eruptions inject sulfur dioxide into the stratosphere, where it forms sulfate aerosol particles (~0.5 μm). These particles scatter short wavelengths effectively (enhanced Rayleigh-like scattering) while allowing red to pass, intensifying the sunset effect. The particles stay in the stratosphere for 1-3 years because there is no rain to wash them out. After Krakatoa (1883) and Pinatubo (1991), sunsets were vivid worldwide for over a year.',
      codeIntro: 'Simulate sunlight passing through different amounts of atmosphere.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(380, 700, 200)

# Sunlight starts as roughly equal brightness across all colors
solar = np.ones_like(wavelengths)

# Scattering strength for each color (Rayleigh: 1/λ^4)
scattering = (550 / wavelengths) ** 4  # normalized to green

# Beer-Lambert law: surviving light = initial × e^(-scattering × path)
# Try different path lengths (1 = noon, 10 = low sun, 35 = sunset)
path_lengths = [1, 5, 10, 20, 35]
labels = ['Noon', 'Afternoon', 'Low sun', 'Near sunset', 'Sunset']
colors = ['gold', 'orange', 'orangered', 'red', 'darkred']

plt.figure(figsize=(10, 5))
for path, label, color in zip(path_lengths, labels, colors):
    surviving = solar * np.exp(-0.1 * scattering * path)
    plt.plot(wavelengths, surviving, linewidth=2, label=f'{label} (path={path})', color=color)

plt.xlabel('Wavelength (nm)', fontsize=12)
plt.ylabel('Surviving light intensity', fontsize=12)
plt.title('What Survives the Atmospheric Path?', fontsize=14)
plt.legend(fontsize=9)
plt.grid(alpha=0.3)
plt.show()

print("At noon (short path): most colors survive → white/yellow Sun")
print("At sunset (long path): only red/orange survive → orange Sun")
print()
print("The key function: np.exp(-scattering * path)")
print("  Large scattering (blue) × long path → e^(-big) → almost zero")
print("  Small scattering (red) × long path → e^(-small) → most survives")`,
      challenge: 'Add a line for path_length = 50 (imagine an extremely dusty day). What color survives? Try changing the 0.1 multiplier to 0.2 to simulate a more polluted atmosphere.',
      successHint: 'The sunset is a physics experiment that runs every evening. The same 1/λ⁴ law that makes the sky blue at noon makes the sunset orange — the only difference is path length. One equation, two beautiful phenomena.',
    },
    {
      title: 'Dust, smoke, and clouds — the other scattering',
      concept: `So far we have only talked about air **molecules** scattering light (Rayleigh). But the atmosphere also has bigger particles — dust, smoke, water droplets, pollen. These scatter light too, but with a completely different rule.

**Rayleigh** (tiny molecules): scatters blue far more than red → blue sky
**Mie** (bigger particles): scatters all colours roughly equally → white/grey

This explains something you have seen: **clouds are white**. Cloud droplets are much larger than air molecules, so they scatter every colour equally. Equal mix of all colours = white. Dirty clouds with soot scatter unevenly → grey.

It also explains why:
- A **clear desert sky** is deep blue (pure Rayleigh, no particles)
- **Assam's humid sky** is paler blue (water droplets add Mie = washes out the blue)
- **Smoky skies** turn orange even at noon (smoke absorbs blue AND scatters it)

In the code, you will model both types of scattering and compare them. The key difference: Rayleigh uses \`1/λ**4\` (steep curve), Mie uses roughly \`1/λ**0.5\` (nearly flat).`,
      analogy: 'Think of the atmosphere as water in a fish tank. Clean water (clean air) lets you see clearly with a slight blue tint (Rayleigh). Add a drop of milk (humidity/dust) and the water turns hazy — you see the fish less clearly, and light passing through turns more orange. Add more milk (heavy pollution) and you can barely see through at all. The particles determine the clarity and color of the "tank."',
      storyConnection: 'Assam\'s sunsets are distinctively orange because of its unique atmospheric recipe: high humidity from the Brahmaputra valley, seasonal smoke from jhum (shifting cultivation), dust from construction, and moisture from the monsoon. Each particle type contributes a different scattering signature, blending into the characteristic warm orange that the story celebrates.',
      checkQuestion: 'Why does a forest fire make the Sun look red even at noon?',
      checkAnswer: 'Smoke particles (soot, ~0.1-1 μm) are large enough for Mie scattering but also absorb short wavelengths (blue, green). This dual effect — absorbing blue AND scattering it away — removes short wavelengths very efficiently, even over the short noon path length. The result: a red Sun at midday, similar to a normal sunset effect but caused by particles rather than path length.',
      codeIntro: 'Compare Rayleigh and Mie scattering on the same chart.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(380, 700, 200)

# Rayleigh: scattering ∝ 1/λ^4 (steep — blue scatters way more)
rayleigh = (550 / wavelengths) ** 4

# Mie: scattering ∝ 1/λ^0.5 (nearly flat — all colors scatter equally)
mie = (550 / wavelengths) ** 0.5

# Normalize both to 1 at 550nm (green) for comparison
rayleigh = rayleigh / rayleigh[len(rayleigh)//2]
mie = mie / mie[len(mie)//2]

plt.figure(figsize=(10, 5))
plt.plot(wavelengths, rayleigh, linewidth=2.5, color='royalblue',
         label='Rayleigh (molecules) — 1/λ⁴')
plt.plot(wavelengths, mie, linewidth=2.5, color='gray',
         label='Mie (dust/droplets) — 1/λ⁰·⁵')
plt.axhline(1, color='white', linewidth=0.5, linestyle=':', alpha=0.3)

plt.xlabel('Wavelength (nm)', fontsize=12)
plt.ylabel('Relative scattering', fontsize=12)
plt.title('Rayleigh vs Mie: Why Clouds Are White', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print("Rayleigh (blue curve): steep — blue scatters MUCH more → blue sky")
print("Mie (gray curve): nearly flat — all colors scatter equally → white")
print()
print("Clean sky = mostly Rayleigh = deep blue")
print("Humid sky = Rayleigh + Mie = paler, washed-out blue")
print("Clouds = almost pure Mie = white")
print("Smoke = Mie + absorption of blue = orange/brown")`,
      challenge: 'Try plotting Mie with exponent 1.5 instead of 0.5 — this models smoke, which scatters blue slightly more. How does the curve change? What color would a smoky sky be?',
      successHint: 'Atmospheric particles are the paintbrush of the sky. Clean air gives deep blue; dust gives hazy white; smoke gives red. Understanding which particles produce which colors lets you read the sky like a physicist.',
    },
    {
      title: 'Mirages — when light bends near hot ground',
      concept: `Have you ever seen what looks like water on a hot road ahead — but when you get there, it is dry? That is a **mirage**. It is not a trick of your mind. It is real physics, and you can photograph it.

Here is what happens. Hot road heats the air just above it. Hot air is **less dense** (molecules spread out). Light travels **faster** through less-dense air. When a light ray passes from the cooler air above into the hotter air near the ground, it speeds up on the bottom edge and slows on the top — this makes it **bend upward**, curving away from the ground like a ball rolling off a slope.

Your brain does not know the light curved. It assumes light travels in straight lines (it usually does). So it traces the light ray backward in a straight line — and concludes the light came from *below the ground*. You see a shimmery "reflection" that looks like water. It is actually reflected sky.

The code simulates this by calculating how the speed of light changes with temperature, and tracing a ray through a temperature gradient. The key insight: **light always bends toward the denser (cooler) medium**.`,
      analogy: 'Imagine a row of marching soldiers on a beach. When they step from firm sand onto soft sand, the soldiers on one side slow down first. The row naturally curves toward the slow side. Light does the same: when it enters denser (cooler) air, it slows down and bends toward the cooler air. Mirages are just light "marching" through air layers of different densities.',
      storyConnection: 'On hot summer days along the Brahmaputra, mirages shimmer above the river banks. The flat, sun-baked sandy stretches create strong temperature gradients — perfect conditions for inferior mirages. Travelers might see "water" on the road ahead that is actually reflected sky. The river valley\'s geography and heat create natural mirage factories.',
      checkQuestion: 'If mirages are real optics (not illusions), can you photograph them?',
      checkAnswer: 'Yes, absolutely. Mirages are real optical phenomena — the light genuinely bends. A camera records the bent light exactly as your eye does. Photographs of road mirages, Fata Morganas, and superior mirages are common. The camera doesn\'t "know" the light was bent — it just records photons arriving at its sensor. In this sense, mirages are fundamentally different from hallucinations (which are neural, not optical).',
      codeIntro: 'Plot the temperature profile above a hot road and see how it affects air density.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Height above the road (0 = road surface, 3 = head height)
heights = np.linspace(0, 3, 100)  # metres

# Temperature profile: hot at ground, cooling with height
T_ground = 60   # °C (road surface on a hot day)
T_air = 35      # °C (ambient temperature)
temperature = T_air + (T_ground - T_air) * np.exp(-heights / 0.3)

# Speed of light in air depends on density (and thus temperature)
# Hotter air = less dense = light goes FASTER
speed_relative = temperature / T_air  # simplified — higher T = faster

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Temperature profile
ax1.plot(temperature, heights, linewidth=2.5, color='orangered')
ax1.fill_betweenx(heights, T_air, temperature, alpha=0.15, color='orangered')
ax1.axhline(0, color='gold', linewidth=2, label='Road surface')
ax1.set_xlabel('Temperature (°C)', fontsize=11)
ax1.set_ylabel('Height above road (m)', fontsize=11)
ax1.set_title('Air Temperature Near a Hot Road', fontsize=13)
ax1.legend(fontsize=9)
ax1.grid(alpha=0.3)

# Speed profile
ax2.plot(speed_relative, heights, linewidth=2.5, color='dodgerblue')
ax2.fill_betweenx(heights, 1, speed_relative, alpha=0.15, color='dodgerblue')
ax2.axhline(0, color='gold', linewidth=2)
ax2.set_xlabel('Relative speed of light', fontsize=11)
ax2.set_ylabel('Height above road (m)', fontsize=11)
ax2.set_title('Light Speed Near a Hot Road', fontsize=13)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("Near the ground: hot air → light travels FASTER")
print("Higher up: cooler air → light travels slower")
print()
print("When one edge of a light ray goes faster than the other,")
print("the ray BENDS — just like a car pulling to one side when")
print("one wheel hits gravel. This bending creates the mirage.")`,
      challenge: 'Try changing T_ground to 40°C (mild day) and 80°C (extreme heat). How does the temperature gradient change? At what ground temperature does the bending become strong enough to see a mirage?',
      successHint: 'Mirages demonstrate that light does not always travel in straight lines. In a medium with varying density, light curves — and this principle underlies fiber optics, atmospheric modeling, and even gravitational lensing in general relativity.',
    },
    {
      title: 'Rainbows — geometry inside a raindrop',
      concept: `A rainbow is not painted on the sky. Each colour you see comes from a **different raindrop** at a specific angle from you. Here is what happens inside one drop:

1. **Sunlight enters** the front of the drop and bends (refracts) — blue bends more than red
2. **It hits the back wall** and bounces (reflects) like a mirror
3. **It exits the front** and bends again — spreading the colours further apart

Each colour exits at a slightly different angle: red at about **42°** from the direction of the sunlight, violet at about **40°**. That 2° difference is what separates the colours into a band.

Now multiply this by millions of drops. Every drop at exactly 42° from the anti-solar point (the point opposite the Sun behind you) sends you red light. Drops at 40° send violet. All together, they form an arc of colour.

**Key insight:** no two people see the same rainbow — your rainbow comes from a completely different set of raindrops than the person standing next to you. Each person's rainbow is their own.

The code uses **Snell's law** (\`n₁ sin θ₁ = n₂ sin θ₂\`) to calculate how light bends at the water surface. The refractive index of water is slightly different for each colour — that tiny difference is what creates the rainbow.`,
      analogy: 'Imagine a disco ball where each mirror reflects one specific color at one specific angle. A raindrop is a tiny disco ball — it reflects/refracts sunlight and sends each color in a slightly different direction. Millions of raindrops together, each sending its own color toward your eye, create the arc of the rainbow. No two people see exactly the same rainbow — each person\'s rainbow comes from a different set of drops.',
      storyConnection: 'After Assam\'s monsoon rains, the sun often breaks through clouds in the west while rain continues to the east — perfect rainbow conditions. The story\'s orange sunsets and rainbows are two faces of the same physics: the interaction of sunlight with water and air. Both are explained by refraction, dispersion, and the geometry of light paths.',
      checkQuestion: 'If you fly in an airplane above the rain and look down, what shape is the rainbow?',
      checkAnswer: 'A complete circle. From the ground, you only see an arc because the ground cuts off the bottom half. From above (in a plane or on a mountain with mist below), the anti-solar point is below the horizon, and you can see the full 360° circle of the rainbow. This is occasionally visible from airplanes, and always visible in garden sprinklers if you position yourself correctly.',
      codeIntro: 'Calculate the rainbow angle for each colour using Snell\'s law.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Refractive index of water for each colour
# (slightly different for each — this is what creates the rainbow)
colors_data = [
    ('Red',    1.331, 'red'),
    ('Orange', 1.332, 'orange'),
    ('Yellow', 1.333, 'gold'),
    ('Green',  1.335, 'green'),
    ('Blue',   1.338, 'blue'),
    ('Violet', 1.343, 'purple'),
]

print("=== Rainbow Exit Angles ===")
print("(Snell's law: n₁ × sin(θ₁) = n₂ × sin(θ₂))")
print()

exit_angles = []
color_names = []
color_rgbs = []

for name, n_water, rgb in colors_data:
    # For a primary rainbow, the exit angle depends on
    # the refractive index. The formula (derived from Snell's law):
    # The maximum deflection angle = 4 * arcsin(1/n) - 2 * arcsin(1/(n*sqrt(3)))
    # The rainbow angle from anti-solar point ≈ 180° - deflection

    # Simpler: use the known relationship
    # Rainbow angle ≈ 42.0° for red, 40.5° for violet
    # Calculated from: arccos((n² - 1) / 3) simplified

    # Exact: iterate over impact parameters to find max deflection
    impacts = np.linspace(0.01, 0.99, 1000)
    theta_i = np.arcsin(impacts)  # incidence angle
    theta_r = np.arcsin(impacts / n_water)  # refracted angle (Snell)
    # Deflection = 2(θi - θr) + (π - 2θr) = 2θi - 4θr + π
    deflection = 2 * theta_i - 4 * theta_r + np.pi
    rainbow_angle = np.degrees(np.min(deflection))  # minimum deflection = rainbow
    viewing_angle = 180 - rainbow_angle

    exit_angles.append(viewing_angle)
    color_names.append(name)
    color_rgbs.append(rgb)
    print(f"  {name:8s} (n={n_water:.3f}): rainbow at {viewing_angle:.1f}°")

# Plot the rainbow angles as coloured bars
plt.figure(figsize=(10, 5))
plt.barh(color_names[::-1], exit_angles[::-1], color=color_rgbs[::-1], height=0.6)
plt.xlabel('Viewing angle from anti-solar point (degrees)', fontsize=12)
plt.title('Rainbow Angles — Why Colours Separate', fontsize=14)
plt.xlim(39, 43)
plt.grid(axis='x', alpha=0.3)
plt.show()

spread = max(exit_angles) - min(exit_angles)
print(f"\
The whole rainbow spans just {spread:.1f}° — a tiny difference")
print("in refractive index creates the entire colour band!")
print()
print("Red is on the outside (42°), violet on the inside (40.5°).")
print("This is why you always see red on top of a rainbow.")`,
      challenge: 'A secondary (double) rainbow appears at ~51° with reversed colours. It forms from light reflecting TWICE inside the drop. Why is it fainter? (Hint: energy is lost at each reflection.)',
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
            diagram={[WavelengthSpectrum, RayleighScatteringDiagram, SunsetPathDiagram, MieVsRayleighDiagram, MirageDiagram, RainbowRaindropDiagram][i] ? createElement([WavelengthSpectrum, RayleighScatteringDiagram, SunsetPathDiagram, MieVsRayleighDiagram, MirageDiagram, RainbowRaindropDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
