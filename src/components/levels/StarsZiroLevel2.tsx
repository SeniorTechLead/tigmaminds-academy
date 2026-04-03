import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import { createElement } from 'react';
import StarSpectrumDiagram from '../diagrams/StarSpectrumDiagram';
import StarHRDiagram from '../diagrams/StarHRDiagram';
import StarColorTempDiagram from '../diagrams/StarColorTempDiagram';
import StarPhotometryDiagram from '../diagrams/StarPhotometryDiagram';
import StarAtmosphereLayersDiagram from '../diagrams/StarAtmosphereLayersDiagram';
import StarLightPollutionMapDiagram from '../diagrams/StarLightPollutionMapDiagram';

export default function StarsZiroLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Spectroscopy — reading the fingerprints of starlight',
      concept: `Every element absorbs and emits light at specific wavelengths — its spectral fingerprint. When starlight passes through a star's atmosphere, elements absorb their characteristic wavelengths, creating dark **absorption lines** in the spectrum.

**Hydrogen**: the Balmer series at 656nm (red), 486nm (blue-green), 434nm (violet)
**Helium**: first discovered in the Sun's spectrum (helios = sun) before found on Earth
**Iron**: thousands of absorption lines — the most complex spectrum of any element
**Calcium**: strong lines at 393nm and 397nm — visible even in low-resolution spectra

From these lines, astronomers determine:
- **Composition**: which elements are present and in what amounts
- **Temperature**: line strengths depend on temperature (hotter → more ionization)
- **Velocity**: Doppler-shifted lines reveal how fast the star moves toward/away from us
- **Magnetic fields**: Zeeman splitting of lines indicates field strength
- **Rotation**: broadened lines indicate rapid rotation

A single spectrum contains more information about a star than any image could. This is why spectroscopy is called "the astronomer's most powerful tool."`,
      analogy: 'Spectroscopy is like recognizing a person by their voice over the phone. You cannot see them, but the unique pattern of their voice (spectral fingerprint) tells you who they are, how they feel (temperature), whether they are moving (Doppler shift), and even what they had for lunch (composition). Each star has a unique "voice" in light.',
      storyConnection: 'The children of Ziro saw white starlight. But split through a prism, each star reveals a unique barcode of dark lines — its chemical identity card. The stars are not just points of light; they are broadcasting their composition, temperature, and velocity in every photon they emit.',
      checkQuestion: 'Helium was discovered in the Sun\'s spectrum 27 years before it was found on Earth. How is it possible to discover an element in something 150 million km away?',
      checkAnswer: 'Because spectral lines are universal — each element has exactly the same absorption/emission wavelengths everywhere in the universe (adjusted for Doppler shift). The unknown lines in the Sun\'s spectrum did not match any known element. They were assigned to a new element named "helium" (from helios, Greek for sun). When helium was later found in uranium ore on Earth, its spectrum matched perfectly.',
      codeIntro: 'Simulate the absorption spectrum of a star showing element fingerprints.',
      code: `import numpy as np

# Simulate a stellar absorption spectrum
wavelengths = np.linspace(380, 700, 5000)  # visible range in nm

# Continuous spectrum (blackbody approximation for Sun-like star)
T = 5778  # K
# Simplified Planck in terms of nm
continuum = 1.0 / (wavelengths**5 * (np.exp(14388 / (wavelengths * T / 1e6)) - 1))
continuum = continuum / continuum.max()  # normalize

# Absorption lines (element, wavelength_nm, depth, width)
absorption_lines = [
    ('H-α', 656.3, 0.7, 0.5),
    ('H-β', 486.1, 0.5, 0.4),
    ('H-γ', 434.0, 0.4, 0.3),
    ('H-δ', 410.2, 0.3, 0.3),
    ('Na D₁', 589.6, 0.6, 0.2),
    ('Na D₂', 589.0, 0.6, 0.2),
    ('Ca K', 393.4, 0.8, 0.4),
    ('Ca H', 396.8, 0.7, 0.4),
    ('Fe', 527.0, 0.3, 0.2),
    ('Fe', 532.8, 0.25, 0.2),
    ('Mg', 518.4, 0.35, 0.3),
    ('Fe', 438.4, 0.2, 0.2),
]

# Apply absorption
spectrum = continuum.copy()
for name, center, depth, width in absorption_lines:
    gaussian = depth * np.exp(-((wavelengths - center) / width)**2)
    spectrum -= gaussian * continuum


print("Elements identified in this spectrum:")
elements = set(name.split()[0].split('-')[0] for name, _, _, _ in absorption_lines)
for elem in sorted(elements):
    lines = [(n, c) for n, c, _, _ in absorption_lines if n.startswith(elem)]
    print(f"  {elem}: {', '.join(f'{n} ({c}nm)' for n, c in lines)}")`,
      challenge: 'If a star is moving toward us at 300 km/s, all its spectral lines are blue-shifted. The H-α line at 656.3nm shifts to 655.6nm. Can you calculate the shift for each line using the formula: Δλ/λ = v/c?',
      successHint: 'Spectroscopy turned astronomy from a descriptive science (what does a star look like?) into a physical science (what IS a star?). Every element on the periodic table has been found in stars — because the laws of physics are universal.',
    },
    {
      title: 'Hertzsprung-Russell diagram — the map of all stars',
      concept: `The **Hertzsprung-Russell (HR) diagram** plots stars by temperature (x-axis, reversed: hot on left, cool on right) versus luminosity (y-axis). It is the most important diagram in all of astronomy.

When you plot thousands of stars, they do not scatter randomly. They cluster into distinct regions:

- **Main sequence**: a diagonal band from hot-bright (upper left) to cool-dim (lower right). About 90% of all stars, including our Sun, are here. They are burning hydrogen into helium.
- **Red giants**: upper right — cool but very luminous. Stars that have exhausted core hydrogen and expanded.
- **White dwarfs**: lower left — hot but very dim. Dead stellar cores the size of Earth.
- **Supergiants**: very top — the most luminous stars in the universe.

The HR diagram is like a stellar life story:
1. Star is born → joins main sequence
2. Burns hydrogen for millions-billions of years
3. Runs out of hydrogen → expands to red giant
4. Low-mass stars → shed outer layers → white dwarf
5. High-mass stars → supernova → neutron star or black hole

The Sun has been on the main sequence for 4.6 billion years and will remain there for another ~5 billion.`,
      analogy: 'The HR diagram is like a map of a city where every building represents a star. The main sequence is the main boulevard — most buildings are here, varying in size (luminosity) and style (temperature). Red giants are the sprawling mansions in the suburbs. White dwarfs are the tiny apartments downtown. The diagram tells you the "neighborhood" (life stage) of any star.',
      storyConnection: 'Every star the children of Ziro saw occupies a specific place on the HR diagram. Sirius is a hot main-sequence star (upper left). Betelgeuse is a red supergiant (upper right). Our Sun is a modest yellow star in the middle. The HR diagram gives every star an address in the cosmic city.',
      checkQuestion: 'Two stars have the same temperature but star A is 10,000× more luminous than star B. What can you conclude about their sizes?',
      checkAnswer: 'Luminosity = surface area × flux per area. Same temperature means same flux per unit area. So star A must have 10,000× more surface area. Since surface area ∝ radius², star A has 100× the radius. If B is the Sun, A is 100 solar radii — a red giant or supergiant. This is how the HR diagram reveals stellar sizes without directly measuring them.',
      codeIntro: 'Generate an HR diagram and plot different types of stars.',
      code: `import numpy as np

np.random.seed(42)

# Generate stars for each region of the HR diagram
# Temperature (K) on x-axis, Luminosity (solar units) on y-axis

def generate_main_sequence(n=500):
    temp = np.random.uniform(3000, 30000, n)
    # L ∝ T^4 approximately on main sequence, with scatter
    log_L = 4 * np.log10(temp/5778) + np.random.normal(0, 0.3, n)
    return temp, 10**log_L

def generate_red_giants(n=80):
    temp = np.random.uniform(3000, 5000, n)
    log_L = np.random.uniform(1.5, 3.5, n)
    return temp, 10**log_L

def generate_white_dwarfs(n=50):
    temp = np.random.uniform(6000, 30000, n)
    log_L = np.random.uniform(-4, -1, n)
    return temp, 10**log_L

def generate_supergiants(n=15):
    temp = np.random.uniform(3500, 25000, n)
    log_L = np.random.uniform(3.5, 5.5, n)
    return temp, 10**log_L

ms_t, ms_l = generate_main_sequence()
rg_t, rg_l = generate_red_giants()
wd_t, wd_l = generate_white_dwarfs()
sg_t, sg_l = generate_supergiants()


print("Star regions on the HR diagram:")
print(f"  Main Sequence: {len(ms_t)} stars (90% of all stars)")
print(f"  Red Giants: {len(rg_t)} stars (evolved, hydrogen-exhausted)")
print(f"  White Dwarfs: {len(wd_t)} stars (stellar remnants)")
print(f"  Supergiants: {len(sg_t)} stars (rare, massive, short-lived)")`,
      challenge: 'Our Sun will become a red giant in ~5 billion years. Plot its evolutionary track: from current position (5778K, 1 L☉) to red giant (3500K, 2000 L☉) to white dwarf (100,000K initially, 0.001 L☉).',
      successHint: 'The HR diagram is the Rosetta Stone of stellar astronomy. It revealed that stars are not eternal — they are born, they age, they die. Every point on the diagram tells a story of nuclear physics, gravity, and time.',
    },
    {
      title: 'Dark matter — the invisible scaffold of the universe',
      concept: `Only about 5% of the universe is ordinary matter (atoms). The rest is:
- **Dark matter** (~27%): an unknown substance that has gravity but does not emit, absorb, or reflect light
- **Dark energy** (~68%): an unknown force causing the universe's expansion to accelerate

Evidence for dark matter:
1. **Galaxy rotation curves**: stars at the edges of galaxies orbit too fast. Without extra invisible mass, they would fly off. The visible matter alone cannot hold them.
2. **Gravitational lensing**: massive galaxy clusters bend light from background objects more than their visible mass should allow.
3. **Cosmic microwave background**: the pattern of the CMB requires dark matter to explain its structure.
4. **Galaxy cluster dynamics**: galaxy clusters are held together by ~10× more gravity than visible matter provides.

Dark matter candidates:
- **WIMPs** (Weakly Interacting Massive Particles): hypothetical particles that interact only through gravity and the weak force
- **Axions**: very light hypothetical particles
- **Primordial black holes**: small black holes formed in the early universe

Despite decades of searching, dark matter has never been directly detected. It is one of the greatest unsolved problems in physics.`,
      analogy: 'Dark matter is like wind. You cannot see wind, but you can see its effects: leaves move, flags flutter, boats sail. Similarly, you cannot see dark matter, but you can see its gravitational effects: galaxies rotate too fast, light bends too much, clusters hold together too tightly. Something invisible is pulling the strings.',
      storyConnection: 'The children of Ziro saw a universe filled with stars. But for every kilogram of visible matter they could see, there were 5 kilograms of invisible dark matter surrounding it. The stars they admired are just the visible foam on an ocean of darkness. The true structure of the universe is invisible — shaped by matter we have yet to understand.',
      checkQuestion: 'If dark matter does not interact with light, how can we ever hope to detect it directly?',
      checkAnswer: 'Several approaches: (1) Underground detectors watch for rare dark matter particle collisions with normal atoms (XENON, LUX experiments). (2) Particle accelerators try to create dark matter particles (LHC at CERN). (3) Space telescopes look for gamma rays from dark matter annihilation. So far, no direct detection — but the indirect gravitational evidence is overwhelming. We know it is there; we just do not know what it is.',
      codeIntro: 'Plot a galaxy rotation curve showing the evidence for dark matter.',
      code: `import numpy as np

# Galaxy rotation curve
# v(r) = orbital velocity at distance r from galaxy center

r = np.linspace(0.5, 50, 200)  # kpc (kiloparsecs)

# Visible matter contribution (exponential disk)
M_visible = 5e10  # solar masses
r_disk = 3.0  # scale length in kpc
v_visible = np.sqrt(4.3e-3 * M_visible * (1 - np.exp(-r/r_disk)) * r_disk / r)

# Dark matter halo contribution (NFW-like profile)
M_halo = 5e11  # 10x visible matter
r_halo = 15.0  # scale radius
v_dark = np.sqrt(4.3e-3 * M_halo * (np.log(1 + r/r_halo) - r/(r+r_halo)) / r)

# Total
v_total = np.sqrt(v_visible**2 + v_dark**2)

# Simulated observations (with scatter)
np.random.seed(42)
r_obs = np.linspace(2, 45, 25)
v_obs = np.sqrt(v_visible[np.searchsorted(r, r_obs)]**2 +
               v_dark[np.searchsorted(r, r_obs)]**2)
v_obs += np.random.normal(0, 8, len(r_obs))


print("The dark matter problem:")
print(f"  Visible matter predicts velocity dropping as 1/sqrt(r)")
print(f"  Observed velocity stays FLAT out to edge of galaxy")
print(f"  Discrepancy requires ~{M_halo/M_visible:.0f}x more mass than visible")
print()
print("We are made of 4.9% of the universe.")
print("The other 95.1% is completely unknown.")`,
      challenge: 'If we could somehow remove all dark matter from the Milky Way, what would happen to the Sun\'s orbit? Calculate the new orbital velocity using only visible matter.',
      successHint: 'Dark matter is arguably the biggest mystery in modern physics. We can measure its effects precisely, model its distribution mathematically, but we have no idea what it actually is. The universe is mostly made of things we cannot see — a humbling reminder from the stars of Ziro.',
    },
    {
      title: 'Gravitational lensing — when gravity bends light',
      concept: `Einstein predicted that massive objects curve spacetime, causing light to follow curved paths. When a massive galaxy or cluster lies between us and a distant object, it acts as a **gravitational lens**, bending and magnifying the distant light.

Types of gravitational lensing:
- **Strong lensing**: creates multiple images, arcs, or Einstein rings from a single background source. Requires a very massive foreground object perfectly aligned.
- **Weak lensing**: subtly distorts shapes of thousands of background galaxies. Used to map dark matter distribution.
- **Microlensing**: a star passes in front of another star, briefly magnifying it. Used to detect exoplanets and MACHOs (Massive Astrophysical Compact Halo Objects).

The Einstein radius (angular size of the ring) depends on:
- Mass of the lens
- Distance to the lens
- Distance to the source

Gravitational lensing is:
- A test of general relativity (confirmed in 1919 solar eclipse)
- A tool for measuring dark matter (mass = lens strength)
- A natural telescope (magnifies distant galaxies by 10-50×)`,
      analogy: 'Gravitational lensing is like looking through the bottom of a wine glass. The curved glass bends light from objects behind it, creating distorted, magnified, and sometimes multiple images. The "glass" in space is curved spacetime, and the "wine" is the mass causing the curvature.',
      storyConnection: 'From Ziro Valley, every photon of starlight reaching the children\'s eyes has been very slightly deflected by the gravity of every massive object along its path. Space itself is curved by mass. The straight lines of geometry become curves in the presence of gravity — and the universe becomes a hall of distorted mirrors.',
      checkQuestion: 'During a total solar eclipse in 1919, Arthur Eddington measured the positions of stars near the Sun. They appeared shifted by 1.75 arcseconds from their known positions. Why did this make Einstein famous?',
      checkAnswer: 'Einstein\'s general relativity predicted that the Sun\'s gravity would bend starlight by exactly 1.75 arcseconds. Newton\'s gravity predicted only 0.87 arcseconds (half the value). Eddington\'s measurement matched Einstein\'s prediction, confirming that gravity curves spacetime, not just pulls objects. Headlines read "LIGHTS ALL ASKEW IN THE HEAVENS" — and Einstein became a household name overnight.',
      codeIntro: 'Simulate gravitational lensing of a background source by a foreground mass.',
      code: `import numpy as np

# Gravitational lensing simulation (point mass lens)
# Lens equation: theta_s = theta - theta_E^2 / theta
# theta_s = source position, theta = image position, theta_E = Einstein radius

theta_E = 1.0  # Einstein radius (arcseconds, normalized)

# Grid for deflection field
x = np.linspace(-3, 3, 400)
y = np.linspace(-3, 3, 400)
X, Y = np.meshgrid(x, y)
R = np.sqrt(X**2 + Y**2) + 1e-10  # distance from lens center

# Deflection angle
alpha_x = theta_E**2 * X / R**2
alpha_y = theta_E**2 * Y / R**2

# Source position (ray-traced from image plane)
source_X = X - alpha_x
source_Y = Y - alpha_y


print("Gravitational lensing key facts:")
print(f"  Einstein radius: {theta_E} arcsecond")
print(f"  Source offset: ({source_x0}, {source_y0}) arcsec from lens")
print(f"  Peak magnification: {magnification.max():.0f}x (at Einstein ring)")
print()
print("Applications:")
print("  - Mapping dark matter (mass → lens strength)")
print("  - Magnifying distant galaxies (natural telescope)")
print("  - Detecting exoplanets (microlensing events)")`,
      challenge: 'Move the source directly behind the lens (x0=0, y0=0). What shape does the lensed image become? This is the famous Einstein ring — predicted in 1936, first observed in 1998.',
      successHint: 'Gravitational lensing turns the universe into a lens shop. Every massive object bends light, and by measuring the bending, we can weigh the invisible. It is the primary tool for mapping dark matter — turning Einstein\'s abstract equations into a practical astronomical instrument.',
    },
    {
      title: 'Cosmological redshift — measuring the expanding universe',
      concept: `In 1929, Edwin Hubble discovered that almost every galaxy is moving away from us, and the farther away a galaxy is, the faster it recedes. This is **Hubble's Law**:

**v = H₀ × d**

Where v is recession velocity, H₀ is the Hubble constant (~70 km/s/Mpc), and d is distance.

This does not mean galaxies are flying through space away from us. Space itself is expanding, carrying galaxies along. The light from distant galaxies is stretched during its journey, shifting its wavelength toward the red end of the spectrum — **cosmological redshift**.

Redshift z is defined as: z = (λ_observed - λ_emitted) / λ_emitted

Key redshift values:
- z = 0: here and now
- z = 0.1: galaxy ~1.4 billion light-years away
- z = 1: galaxy ~7.7 billion light-years away (light took 7.7 billion years)
- z = 10: galaxy ~13.1 billion years ago (early universe)
- z = 1089: cosmic microwave background (380,000 years after Big Bang)

The expansion means the universe had a beginning — the Big Bang, ~13.8 billion years ago. The children of Ziro, looking at distant galaxies, were looking back in time.`,
      analogy: 'Cosmological redshift is like dots drawn on a balloon being inflated. As the balloon (space) expands, every dot (galaxy) moves away from every other dot. A bug crawling between two dots (a photon of light) has to travel farther because the surface stretches during the journey. The stretching of the bug\'s path = redshift of light.',
      storyConnection: 'When the children of Ziro looked at the Andromeda galaxy (visible to the naked eye at magnitude 3.4), they were seeing light that left 2.5 million years ago — when our ancestors were first learning to use stone tools. Every star, every galaxy they saw was a time machine, showing the universe as it was, not as it is.',
      checkQuestion: 'If the universe is expanding, does that mean we are at the center of the expansion?',
      checkAnswer: 'No. Every point in the universe sees every other point receding. It is like the balloon analogy: no dot on the balloon is the "center of expansion." The expansion is uniform — there is no center, no edge. This is called the cosmological principle: the universe looks the same from every point (on large scales). The children of Ziro are no more or less "central" than observers anywhere else in the cosmos.',
      codeIntro: 'Visualize Hubble\'s Law and the expanding universe.',
      code: `import numpy as np

# Hubble's Law: v = H0 * d
H0 = 70  # km/s/Mpc (Hubble constant)

distances = np.linspace(0, 5000, 200)  # Mpc
velocities = H0 * distances  # km/s

# Redshift: z = v/c for small v (special relativity approximation)
c = 3e5  # km/s
redshift_approx = velocities / c

# More accurate: 1+z = sqrt((1+v/c)/(1-v/c)) for special relativity
# But for cosmological redshift, need full GR. Use approximation for visualization.


# Lookback times for different redshifts
print("Redshift → lookback time → distance:")
redshifts = [0.01, 0.1, 0.5, 1.0, 2.0, 5.0, 10.0]
for z in redshifts:
    # Approximate lookback time (simplified flat ΛCDM)
    from_age = 13.8 / (1 + z)**1.5  # very rough
    lookback = 13.8 - from_age
    d_mpc = z * c / H0  # linear approx, valid for small z
    print(f"  z={z:>5.2f}: lookback ~{lookback:.1f} Gyr, d ~{min(d_mpc, 14000):.0f} Mpc")

print()
print(f"Age of universe: 13.8 billion years")
print(f"Observable universe radius: ~46.5 billion light-years")
print(f"(Larger than 13.8 Gly because space expanded during light travel)")`,
      challenge: 'If H₀ were 100 km/s/Mpc instead of 70, the universe would be younger. Calculate the "Hubble time" (1/H₀) for both values. The Hubble time approximates the age of the universe.',
      successHint: 'From the dark skies of Ziro Valley to the expanding universe — you have journeyed from photons hitting retinas to the largest-scale structure of reality. The same stars the Apatani people have watched for millennia are our connection to a cosmos 13.8 billion years old, 93 billion light-years across, and still expanding.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build on Level 1 astronomy foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced astrophysics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={[StarSpectrumDiagram, StarHRDiagram, StarColorTempDiagram, StarPhotometryDiagram, StarAtmosphereLayersDiagram, StarLightPollutionMapDiagram][i] ? createElement([StarSpectrumDiagram, StarHRDiagram, StarColorTempDiagram, StarPhotometryDiagram, StarAtmosphereLayersDiagram, StarLightPollutionMapDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
