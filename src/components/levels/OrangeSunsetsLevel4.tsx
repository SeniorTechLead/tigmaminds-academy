import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import SunsetSimulatorOutputDiagram from '../diagrams/SunsetSimulatorOutputDiagram';
import SunsetPathDiagram from '../diagrams/SunsetPathDiagram';
import WavelengthSpectrum from '../diagrams/WavelengthSpectrum';
import RayleighScatteringDiagram from '../diagrams/RayleighScatteringDiagram';
import CorrelationDiagram from '../diagrams/CorrelationDiagram';
import LinearGraphDiagram from '../diagrams/LinearGraphDiagram';

export default function OrangeSunsetsLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Project Design: Sunset Color Prediction',
      concept: `Every serious engineering project starts with a clear problem definition. Ours is: given current atmospheric conditions, predict the dominant color of tonight's sunset. This is not a toy problem. Photographers, filmmakers, and atmospheric scientists all want accurate sunset predictions, and no existing weather app provides them.

To build this predictor, we need to identify what actually determines sunset color. Five measurable atmospheric variables dominate the physics. **Humidity** controls how much water vapor scatters light. **PM2.5 concentration** (fine particulate matter in micrograms per cubic meter) determines how much Mie scattering occurs — the mechanism that produces deep reds and oranges. **Observer altitude** affects path length through the atmosphere. **Solar elevation angle** controls how far sunlight must travel through the atmosphere (the lower the sun, the longer the path, the more scattering). **Cloud cover percentage** determines whether scattered light is reflected, amplified, or hidden entirely.

The pipeline we will build has four stages. First, data ingestion: reading raw weather measurements. Second, feature engineering: transforming raw values into physics-meaningful quantities (optical depth, atmospheric path length, scattering coefficients). Third, prediction: a physics-based model enhanced by machine learning to produce an RGB color. Fourth, visualization: rendering the predicted sunset and comparing it to real data. By the end of this capstone, you will have a complete, deployable system.`,
      analogy: 'Designing this project is like planning a building before laying bricks. An architect does not start by mixing concrete — she starts by asking: what is this building for, what loads must it bear, what materials are available, what are the constraints? Our "blueprint" is the pipeline: data in, features computed, prediction made, result visualized. Every later lesson fills in one section of the blueprint.',
      storyConnection: 'In "Why Assam\'s Sunsets Are Orange," the story explains that the Brahmaputra Valley\'s unique combination of river moisture, agricultural dust, and low geography creates uniquely vivid orange sunsets. Our predictor will encode exactly these physical factors — humidity from the river, PM2.5 from biomass burning and agriculture, and the low altitude of the valley — into a quantitative model that explains why Assam\'s sunsets look different from, say, those in the Sahara or the Arctic.',
      checkQuestion: 'Why do we need both humidity AND PM2.5 as separate features, rather than combining them into a single "atmospheric density" variable?',
      checkAnswer: 'Humidity and PM2.5 cause fundamentally different types of scattering. Water vapor primarily causes Rayleigh scattering (wavelength-dependent, favoring blue/violet removal), while particulate matter causes Mie scattering (less wavelength-dependent, creating broad orange/red). Combining them would lose the distinction between these two mechanisms and destroy information the model needs to predict color accurately.',
      codeIntro: 'Define the complete feature set, generate synthetic atmospheric data for the Brahmaputra Valley, and inspect the distributions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Feature Definitions ---
FEATURES = {
    'humidity': {'unit': '%', 'range': (30, 98), 'description': 'Relative humidity'},
    'pm25': {'unit': 'ug/m3', 'range': (5, 200), 'description': 'Fine particulate matter'},
    'altitude': {'unit': 'm', 'range': (0, 3000), 'description': 'Observer altitude ASL'},
    'solar_angle': {'unit': 'deg', 'range': (-5, 15), 'description': 'Solar elevation angle'},
    'cloud_cover': {'unit': '%', 'range': (0, 100), 'description': 'Cloud cover percentage'},
}

def generate_brahmaputra_data(n_samples=500):
    """Generate synthetic atmospheric data mimicking Brahmaputra Valley conditions."""
    # Humidity: high due to river — skewed toward 60-90%
    humidity = np.clip(np.random.beta(5, 2, n_samples) * 70 + 30, 30, 98)

    # PM2.5: bimodal — low during monsoon, high during crop burning season
    season = np.random.choice([0, 1], n_samples, p=[0.6, 0.4])  # 0=clean, 1=burning
    pm25_clean = np.random.gamma(3, 5, n_samples)  # mode ~10
    pm25_burn = np.random.gamma(4, 25, n_samples)   # mode ~75
    pm25 = np.clip(np.where(season == 0, pm25_clean, pm25_burn), 5, 200)

    # Altitude: valley floor, mostly 50-100m
    altitude = np.clip(np.random.exponential(80, n_samples) + 30, 0, 3000)

    # Solar angle at sunset: typically -5 to 15 degrees
    solar_angle = np.random.uniform(-5, 15, n_samples)

    # Cloud cover: bimodal (clear or overcast)
    cloud_cover = np.clip(
        np.where(np.random.random(n_samples) < 0.5,
                 np.random.beta(2, 8, n_samples) * 100,
                 np.random.beta(8, 2, n_samples) * 100),
        0, 100)

    data = np.column_stack([humidity, pm25, altitude, solar_angle, cloud_cover])
    return data, list(FEATURES.keys())

# Generate dataset
data, feature_names = generate_brahmaputra_data(500)

# --- Visualize distributions ---
fig, axes = plt.subplots(2, 3, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Brahmaputra Valley Atmospheric Data — 500 Synthetic Samples',
             color='white', fontsize=14, fontweight='bold')

colors = ['#3b82f6', '#f59e0b', '#22c55e', '#ef4444', '#a855f7']
for i, (name, color) in enumerate(zip(feature_names, colors)):
    ax = axes.flat[i]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    info = FEATURES[name]
    ax.hist(data[:, i], bins=30, color=color, alpha=0.8, edgecolor='none')
    ax.set_title(f'{info["description"]} ({info["unit"]})', color='white', fontsize=10)
    ax.set_xlabel(f'{name}', color='white', fontsize=9)
    ax.set_ylabel('Count', color='white', fontsize=9)
    med = np.median(data[:, i])
    ax.axvline(med, color='white', linestyle='--', linewidth=1, alpha=0.7)
    ax.text(med, ax.get_ylim()[1] * 0.9, f' median={med:.1f}',
            color='white', fontsize=8)

# Hide extra subplot
axes.flat[5].set_visible(False)

plt.tight_layout()
plt.show()

# Summary statistics
print("Feature Summary Statistics")
print("=" * 65)
print(f"{'Feature':<16} {'Mean':>8} {'Std':>8} {'Min':>8} {'Max':>8} {'Unit':<8}")
print("-" * 65)
for i, name in enumerate(feature_names):
    col = data[:, i]
    info = FEATURES[name]
    print(f"{name:<16} {col.mean():>8.1f} {col.std():>8.1f} "
          f"{col.min():>8.1f} {col.max():>8.1f} {info['unit']:<8}")

print()
print(f"Dataset shape: {data.shape} — {data.shape[0]} samples, {data.shape[1]} features")
print(f"Pipeline stage 1 complete: raw data generation.")
print(f"Next: transform these raw values into physics-meaningful features.")`,
      challenge: 'Add a sixth feature: "time_of_year" as day-of-year (1-365). Make it correlate with PM2.5 (higher in Nov-Feb crop burning season, days 305-365 and 1-60). Re-plot the distributions.',
      successHint: 'A well-defined problem is half-solved. You now have a clear pipeline, five physics-motivated features, and realistic synthetic data. The rest of the capstone fills in the engineering between this data and a predicted sunset color.',
    },
    {
      title: 'Data Collection & Feature Engineering',
      concept: `Raw sensor readings are not what the physics needs. A humidity reading of 75% does not directly tell you how much light is scattered — you need the **optical depth** due to water vapor, which depends on humidity, temperature, and path length. A PM2.5 reading of 50 micrograms per cubic meter does not directly tell you the Mie scattering coefficient — you need to convert concentration to an extinction coefficient using particle size distribution assumptions. Feature engineering bridges the gap between what sensors measure and what physics equations require.

The most important engineered feature for sunset prediction is **atmospheric path length**. When the sun is directly overhead, sunlight passes through about 1 atmosphere of air (this is called "air mass 1" or AM1). At sunset, when the solar elevation is near zero, the path through the atmosphere can be 10-40 times longer. The Kasten-Young formula gives us air mass as a function of solar elevation angle: AM = 1 / [sin(angle) + 0.50572 * (angle + 6.07995)^(-1.6364)]. This single transformation is enormously important — it converts a geometric angle into the physical quantity that drives scattering.

The second key transformation converts PM2.5 concentration into an **aerosol optical depth** (AOD). The empirical relationship is roughly AOD = PM2.5 * 0.003 * (path_length_factor), but this varies with particle composition. For the Brahmaputra Valley, where aerosols include both organic carbon from biomass burning and mineral dust, we use a composite extinction efficiency. Finally, we compute **Rayleigh optical depth** (molecular scattering) which depends on wavelength as lambda^(-4) and on the total air column. These three optical depths — Rayleigh, aerosol, and water vapor — are the actual inputs to the scattering calculation.`,
      analogy: 'Feature engineering is like a chef preparing ingredients before cooking. You do not throw a whole chicken into a pan — you debone it, marinate it, slice it to the right thickness. Raw humidity is the whole chicken. Optical depth is the prepared ingredient that actually goes into the recipe (the physics equation). The transformation requires domain knowledge: a chef who has never cooked chicken would not know how to prepare it, just as an engineer who does not understand atmospheric physics would not know to compute air mass from solar angle.',
      storyConnection: 'The story describes how the Brahmaputra River\'s moisture combines with valley dust to create those intense orange hues. Our feature engineering makes this precise: we convert "moisture" into a water-vapor optical depth and "dust" into an aerosol optical depth. The combination of high moisture (high Rayleigh scattering removing blues) and moderate dust (Mie scattering boosting oranges/reds) is exactly the Brahmaputra Valley\'s sunset recipe, now encoded as mathematics.',
      checkQuestion: 'Why does the atmospheric path length increase dramatically at low solar angles, rather than increasing linearly as the angle decreases?',
      checkAnswer: 'At near-zero solar angles, sunlight passes through the atmosphere nearly tangentially, like looking through a sphere at its edge rather than through its center. The geometry is approximately 1/sin(angle), which diverges as the angle approaches zero. At 5 degrees elevation the path is about 10x longer than overhead; at 1 degree it is about 30x longer. This non-linear increase is why sunsets are so much more colorful than midday skies — the scattering compounds exponentially with path length.',
      codeIntro: 'Build the complete feature engineering pipeline that transforms raw atmospheric measurements into physics-ready model inputs.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Raw data generation (from Lesson 1) ---
def generate_data(n=500):
    humidity = np.clip(np.random.beta(5, 2, n) * 70 + 30, 30, 98)
    season = np.random.choice([0, 1], n, p=[0.6, 0.4])
    pm25 = np.clip(np.where(season == 0,
        np.random.gamma(3, 5, n), np.random.gamma(4, 25, n)), 5, 200)
    altitude = np.clip(np.random.exponential(80, n) + 30, 0, 3000)
    solar_angle = np.random.uniform(-5, 15, n)
    cloud_cover = np.clip(np.where(np.random.random(n) < 0.5,
        np.random.beta(2, 8, n) * 100, np.random.beta(8, 2, n) * 100), 0, 100)
    return np.column_stack([humidity, pm25, altitude, solar_angle, cloud_cover])

raw = generate_data(500)

# --- Feature Engineering Pipeline ---
def kasten_young_air_mass(solar_angle_deg):
    """Compute air mass using Kasten-Young formula.
    Handles negative angles (sun below horizon) by clamping."""
    angle = np.clip(solar_angle_deg, 0.5, 90.0)
    angle_rad = np.radians(angle)
    am = 1.0 / (np.sin(angle_rad) + 0.50572 * (angle + 6.07995) ** (-1.6364))
    return am

def compute_rayleigh_optical_depth(wavelength_nm, altitude_m):
    """Rayleigh optical depth for molecular scattering.
    Scales as wavelength^-4, decreases with altitude (less air above)."""
    lam = wavelength_nm * 1e-9  # to meters
    # Sea-level Rayleigh optical depth approximation
    tau_0 = 0.00864 * (wavelength_nm / 1000) ** (-3.916)
    # Altitude correction: pressure decreases exponentially
    scale_height = 8500  # meters
    tau = tau_0 * np.exp(-altitude_m / scale_height)
    return tau

def compute_aerosol_optical_depth(pm25, altitude_m):
    """Convert PM2.5 concentration to aerosol optical depth (AOD).
    Uses empirical relationship with altitude correction."""
    # Empirical: AOD ~ PM2.5 * 0.003 at sea level
    aod_surface = pm25 * 0.003
    # Aerosol scale height ~2km (aerosols concentrated near surface)
    aerosol_scale = 2000
    aod = aod_surface * (1 - np.exp(-aerosol_scale / max(altitude_m, 1)))
    return aod

def compute_water_vapor_depth(humidity_pct, altitude_m):
    """Water vapor contribution to optical depth."""
    # Precipitable water vapor scales with humidity and altitude
    pwv = humidity_pct / 100.0 * 2.0 * np.exp(-altitude_m / 2500)
    # Water vapor optical depth (weak absorber in visible)
    tau_wv = 0.016 * pwv
    return tau_wv

def engineer_features(raw_data):
    """Transform raw atmospheric data into physics-ready features."""
    humidity = raw_data[:, 0]
    pm25 = raw_data[:, 1]
    altitude = raw_data[:, 2]
    solar_angle = raw_data[:, 3]
    cloud_cover = raw_data[:, 4]

    n = len(humidity)
    # Compute air mass for each sample
    air_mass = kasten_young_air_mass(solar_angle)

    # Compute optical depths at reference wavelength (550 nm)
    rayleigh_od = np.array([compute_rayleigh_optical_depth(550, alt) for alt in altitude])
    aerosol_od = np.array([compute_aerosol_optical_depth(p, alt) for p, alt in zip(pm25, altitude)])
    water_od = np.array([compute_water_vapor_depth(h, alt) for h, alt in zip(humidity, altitude)])

    # Total optical depth at 550nm
    total_od = rayleigh_od + aerosol_od + water_od

    # Effective extinction = total_od * air_mass
    extinction = total_od * air_mass

    # Cloud attenuation factor (0 = fully blocked, 1 = clear)
    cloud_factor = 1.0 - 0.7 * (cloud_cover / 100.0)

    engineered = np.column_stack([
        air_mass, rayleigh_od, aerosol_od, water_od,
        total_od, extinction, cloud_factor
    ])
    eng_names = ['air_mass', 'rayleigh_od', 'aerosol_od', 'water_od',
                 'total_od', 'extinction', 'cloud_factor']
    return engineered, eng_names

eng_data, eng_names = engineer_features(raw)

# --- Visualize ---
fig, axes = plt.subplots(2, 4, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Engineered Features — From Raw Sensors to Physics Inputs',
             color='white', fontsize=14, fontweight='bold')

colors = ['#ef4444', '#3b82f6', '#f59e0b', '#22c55e', '#a855f7', '#ec4899', '#06b6d4']
for i, (name, color) in enumerate(zip(eng_names, colors)):
    ax = axes.flat[i]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.hist(eng_data[:, i], bins=30, color=color, alpha=0.8, edgecolor='none')
    ax.set_title(name, color='white', fontsize=10)
    ax.set_ylabel('Count', color='white', fontsize=9)
    med = np.median(eng_data[:, i])
    ax.axvline(med, color='white', linestyle='--', linewidth=1, alpha=0.6)
    ax.text(med, ax.get_ylim()[1] * 0.85, f' {med:.3f}',
            color='white', fontsize=7)

axes.flat[7].set_visible(False)
plt.tight_layout()
plt.show()

# Print transformation summary
print("Feature Engineering Pipeline")
print("=" * 60)
print(f"{'Raw feature':<16} -> {'Engineered feature':<20} {'Transform'}")
print("-" * 60)
print(f"{'solar_angle':<16} -> {'air_mass':<20} Kasten-Young formula")
print(f"{'altitude':<16} -> {'rayleigh_od':<20} lambda^-4 + altitude correction")
print(f"{'pm25 + altitude':<16} -> {'aerosol_od':<20} empirical + scale height")
print(f"{'humidity + alt':<16} -> {'water_od':<20} precipitable water vapor")
print(f"{'all above':<16} -> {'total_od':<20} sum of three optical depths")
print(f"{'total_od + AM':<16} -> {'extinction':<20} od * air_mass")
print(f"{'cloud_cover':<16} -> {'cloud_factor':<20} linear attenuation")
print()
print(f"Raw shape: {raw.shape} -> Engineered shape: {eng_data.shape}")
print(f"5 sensor readings transformed into 7 physics-meaningful features.")
print(f"Key insight: air_mass range is {eng_data[:,0].min():.1f} to {eng_data[:,0].max():.1f}")
print(f"  At solar_angle=0.5 deg, path is {kasten_young_air_mass(0.5):.0f}x longer than overhead!")`,
      challenge: 'Add a correlation heatmap showing which engineered features are correlated. Use np.corrcoef and plt.imshow. Which pairs are most correlated, and does that make physical sense?',
      successHint: 'Feature engineering is where domain knowledge becomes code. Anyone can plug numbers into a model — but knowing that PM2.5 must be converted to optical depth via an extinction coefficient, and that solar angle must become air mass via a trigonometric formula, requires understanding the physics. This is what separates an engineer from a button-presser.',
    },
    {
      title: 'Color Space Mathematics',
      concept: `Now we reach the heart of the physics: computing what color the sky actually becomes when sunlight passes through the atmosphere. The core equation is **Beer-Lambert transmission**: for a given wavelength, the fraction of light that survives is T(lambda) = exp(-tau(lambda) * air_mass), where tau is the total optical depth. Since tau depends on wavelength (Rayleigh scattering goes as lambda^(-4), Mie scattering is nearly flat), different wavelengths are attenuated by different amounts. Blue light (450 nm) is scattered away far more than red light (650 nm), which is why the direct sun path turns orange-red at sunset.

But we do not perceive individual wavelengths — our eyes have three types of cone cells (roughly sensitive to red, green, and blue). To go from a physical spectrum to a perceived color, we must convert through the **CIE XYZ color space**. The CIE defined three "color matching functions" — x_bar(lambda), y_bar(lambda), z_bar(lambda) — that map any spectrum to three numbers (X, Y, Z) representing the color as a human would see it. These are then converted to display-ready sRGB values via a 3x3 matrix transformation and gamma correction.

The full pipeline is: solar spectrum (blackbody at 5778K) multiplied by atmospheric transmission T(lambda) at each wavelength, multiplied by Rayleigh scattering phase function for the viewing angle, then integrated against the CIE color matching functions to produce XYZ, then transformed to linear sRGB, then gamma-corrected to final sRGB. Each step is physically motivated. The result is an actual RGB color that represents what a camera or human eye would perceive.`,
      analogy: 'The spectral-to-RGB pipeline is like translating a poem from one language to another through an intermediate language. The original "poem" is the physical light spectrum — hundreds of wavelength intensities. CIE XYZ is the intermediate language — a universal color description that any display can understand. sRGB is the final translation — the specific dialect that your monitor speaks. Each translation step loses a little nuance, but the result is something your screen can actually show you.',
      storyConnection: 'The story marvels at the specific shade of orange that fills the Brahmaputra Valley at sunset — not the pale yellow of a dry desert sunset or the deep crimson of a polluted city. Our spectral pipeline will reveal exactly why: the combination of high humidity (removing more blue via Rayleigh) and moderate aerosols (adding warm Mie scattering) produces a spectrum that, when mapped through CIE XYZ to RGB, lands squarely in the orange region. Different valleys, different spectra, different colors.',
      checkQuestion: 'If Rayleigh scattering removes blue light from the direct sun path, where does that blue light go? And what does this imply about the color of the sky away from the sun at sunset?',
      checkAnswer: 'The scattered blue light does not disappear — it is redirected in other directions. This is why the sky is blue when you look away from the sun. At sunset, the remaining sky overhead still appears blue-purple (receiving scattered short wavelengths from above), while the horizon near the sun appears orange-red (the direct path with blues removed). The same physics produces both colors simultaneously.',
      codeIntro: 'Implement the full spectral-to-RGB pipeline: solar blackbody spectrum, Beer-Lambert atmospheric transmission, CIE XYZ integration, and sRGB conversion.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Solar spectrum: Planck blackbody at 5778K ---
wavelengths = np.arange(380, 781, 5)  # visible range in nm
n_wav = len(wavelengths)

def planck_spectrum(wavelengths_nm, T=5778):
    """Normalized Planck blackbody spectrum."""
    lam = wavelengths_nm * 1e-9  # to meters
    h = 6.626e-34; c = 3e8; k = 1.381e-23
    B = (2 * h * c**2 / lam**5) / (np.exp(h * c / (lam * k * T)) - 1)
    return B / B.max()  # normalize to peak=1

# --- CIE 1931 color matching functions (simplified) ---
def cie_xyz_approx(lam):
    """Approximate CIE 1931 XYZ color matching functions using Gaussians."""
    t1 = (lam - 442.0) * (0.0624 if lam < 442 else 0.0374)
    t2 = (lam - 599.8) * (0.0264 if lam < 599.8 else 0.0323)
    t3 = (lam - 474.0) * (0.0264 if lam < 474 else 0.0323)

    x_bar = (0.362 * np.exp(-0.5 * t1**2) +
             1.056 * np.exp(-0.5 * t2**2) -
             0.065 * np.exp(-0.5 * t3**2))

    t1 = (lam - 568.8) * (0.0213 if lam < 568.8 else 0.0247)
    t2 = (lam - 530.9) * (0.0613 if lam < 530.9 else 0.0322)
    y_bar = 0.821 * np.exp(-0.5 * t1**2) + 0.286 * np.exp(-0.5 * t2**2)

    t1 = (lam - 437.0) * (0.0845 if lam < 437 else 0.0278)
    t2 = (lam - 459.0) * (0.0385 if lam < 459 else 0.0725)
    z_bar = 1.217 * np.exp(-0.5 * t1**2) + 0.681 * np.exp(-0.5 * t2**2)

    return max(x_bar, 0), max(y_bar, 0), max(z_bar, 0)

# Precompute CIE functions
cie_x = np.array([cie_xyz_approx(w)[0] for w in wavelengths])
cie_y = np.array([cie_xyz_approx(w)[1] for w in wavelengths])
cie_z = np.array([cie_xyz_approx(w)[2] for w in wavelengths])

# --- Atmospheric transmission ---
def rayleigh_optical_depth(wav_nm, altitude_m=80):
    """Rayleigh optical depth at each wavelength."""
    tau_0 = 0.00864 * (wav_nm / 1000) ** (-3.916)
    return tau_0 * np.exp(-altitude_m / 8500)

def compute_transmission(wavelengths, air_mass, aerosol_od_550, humidity_pct, altitude_m):
    """Beer-Lambert transmission at each wavelength."""
    # Rayleigh: strong wavelength dependence
    tau_rayleigh = rayleigh_optical_depth(wavelengths, altitude_m)

    # Mie (aerosol): weak wavelength dependence (Angstrom exponent ~1.3)
    tau_mie = aerosol_od_550 * (wavelengths / 550.0) ** (-1.3)

    # Water vapor absorption bands (simplified)
    tau_water = humidity_pct / 100.0 * 0.01 * np.ones_like(wavelengths)
    # Water absorbs more around 720nm
    tau_water += humidity_pct / 100.0 * 0.005 * np.exp(-0.5 * ((wavelengths - 720) / 20)**2)

    total_tau = tau_rayleigh + tau_mie + tau_water
    transmission = np.exp(-total_tau * air_mass)
    return transmission, tau_rayleigh, tau_mie

def spectrum_to_rgb(spectrum, wavelengths_arr):
    """Convert spectral power distribution to sRGB."""
    # Integrate against CIE color matching functions
    dlam = wavelengths_arr[1] - wavelengths_arr[0]
    X = np.sum(spectrum * cie_x) * dlam
    Y = np.sum(spectrum * cie_y) * dlam
    Z = np.sum(spectrum * cie_z) * dlam

    # Normalize
    norm = max(X + Y + Z, 1e-10)
    X, Y, Z = X/norm, Y/norm, Z/norm

    # XYZ to linear sRGB (D65 illuminant)
    r =  3.2406 * X - 1.5372 * Y - 0.4986 * Z
    g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z
    b =  0.0557 * X - 0.2040 * Y + 1.0570 * Z

    # Gamma correction (sRGB)
    def gamma(c):
        c = max(c, 0)
        return 12.92 * c if c <= 0.0031308 else 1.055 * c**(1/2.4) - 0.055

    rgb = np.array([gamma(r), gamma(g), gamma(b)])
    rgb = np.clip(rgb, 0, 1)
    return rgb

# --- Compute sunset colors for different conditions ---
solar = planck_spectrum(wavelengths)

conditions = [
    ('Noon (overhead)', 1.0, 0.02, 50, 80),
    ('Golden hour (6 deg)', 9.6, 0.05, 65, 80),
    ('Sunset (2 deg)', 19.8, 0.05, 65, 80),
    ('Assam sunset (2 deg, hazy)', 19.8, 0.15, 80, 80),
    ('Heavy pollution sunset', 19.8, 0.40, 70, 80),
    ('Mountain sunset (2 deg)', 19.8, 0.03, 30, 2500),
]

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Spectral-to-RGB Pipeline: From Physics to Perceived Color',
             color='white', fontsize=14, fontweight='bold')

predicted_colors = []
for idx, (label, am, aod, hum, alt) in enumerate(conditions):
    ax = axes.flat[idx]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

    trans, tau_r, tau_m = compute_transmission(wavelengths, am, aod, hum, alt)
    perceived = solar * trans
    rgb = spectrum_to_rgb(perceived, wavelengths)
    predicted_colors.append(rgb)

    # Plot spectrum colored by wavelength
    for j in range(len(wavelengths) - 1):
        w = wavelengths[j]
        # Approximate wavelength to color for visualization
        if w < 440: c = (0.3, 0.0, 0.8)
        elif w < 490: c = (0.0, 0.5, 1.0)
        elif w < 530: c = (0.0, 0.9, 0.3)
        elif w < 580: c = (0.9, 0.9, 0.0)
        elif w < 620: c = (1.0, 0.5, 0.0)
        else: c = (1.0, 0.1, 0.0)
        ax.fill_between(wavelengths[j:j+2], perceived[j:j+2], alpha=0.7, color=c)

    ax.plot(wavelengths, solar, '--', color='gray', linewidth=0.8, alpha=0.5, label='Solar input')
    ax.plot(wavelengths, perceived, color='white', linewidth=1.2, label='After atmosphere')

    # Show predicted color as background patch
    rect = plt.Rectangle((0.75, 0.65), 0.22, 0.3, transform=ax.transAxes,
                          facecolor=rgb, edgecolor='white', linewidth=2)
    ax.add_patch(rect)
    ax.text(0.86, 0.58, f'RGB({rgb[0]:.2f},{rgb[1]:.2f},{rgb[2]:.2f})',
            transform=ax.transAxes, color='white', fontsize=6, ha='center')

    ax.set_title(label, color='white', fontsize=10)
    ax.set_xlabel('Wavelength (nm)', color='white', fontsize=8)
    ax.set_ylabel('Intensity', color='white', fontsize=8)
    if idx == 0:
        ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

# Print results
print("Sunset Color Prediction Results")
print("=" * 60)
for (label, am, aod, hum, alt), rgb in zip(conditions, predicted_colors):
    hex_color = '#{:02x}{:02x}{:02x}'.format(int(rgb[0]*255), int(rgb[1]*255), int(rgb[2]*255))
    print(f"  {label:<30} -> {hex_color}  R={rgb[0]:.2f} G={rgb[1]:.2f} B={rgb[2]:.2f}")

print()
print("Key observations:")
print("  - Noon: nearly white (all wavelengths pass through)")
print("  - Golden hour: warm yellow (some blue removed)")
print("  - Clean sunset: orange (most blue+green removed)")
print("  - Assam sunset: deep orange (humidity + aerosol boost)")
print("  - Polluted: deep red (extreme scattering)")
print("  - Mountain: purer orange (less water vapor, less aerosol)")`,
      challenge: 'Add a seventh condition: "Post-monsoon Assam" with very high humidity (95%) but very low PM2.5 (8 ug/m3, because rain washed out particles). Predict the color and explain why it differs from the standard Assam sunset.',
      successHint: 'You have just built a spectral rendering pipeline from first principles. The key insight is that sunset color is not a single physical quantity — it emerges from the interaction of a continuous spectrum with wavelength-dependent scattering, filtered through the peculiarities of human color perception. The CIE XYZ system is the bridge between physics and experience.',
    },
    {
      title: 'Machine Learning Enhancement',
      concept: `Our physics-based model is a solid foundation, but it has limitations. The Rayleigh and Mie scattering equations are approximations. We used simplified CIE color matching functions. We ignored multiple scattering (light that bounces more than once), which becomes important in hazy conditions. We ignored ozone absorption (which creates the purple hues sometimes seen at twilight). A machine learning model can learn corrections to these approximations from real data.

The strategy is called **physics-informed machine learning** or **hybrid modeling**. Instead of training an ML model from scratch (which would need thousands of labeled sunset photos), we train it to predict the **residual** — the difference between the physics model's prediction and the true color. If the physics model predicts RGB = (0.85, 0.45, 0.10) and the true color is (0.82, 0.50, 0.12), the residual is (-0.03, +0.05, +0.02). A simple model can learn these small corrections much more easily than learning the entire physics from scratch.

We will use **linear regression with polynomial features** — one of the simplest ML models. The inputs are our 7 engineered features. We expand them to include squared terms and interactions (e.g., air_mass * aerosol_od), giving us a richer feature space. The output is the RGB correction vector. We train on a synthetic dataset where "ground truth" includes effects our physics model omits (multiple scattering, ozone, etc.). Finally, we evaluate using RMSE (root mean squared error) on a held-out test set and compare the physics-only model against the ML-enhanced model.`,
      analogy: 'This approach is like a GPS that uses both satellite signals and a road map. The road map (physics model) tells you the general route. The GPS corrections (ML model) adjust for the map being slightly out of date, roads being one-way, and construction detours. Using both together is far better than either alone: the map provides structure, and the corrections handle the details the map missed.',
      storyConnection: 'The story captures the ineffable beauty of Assam\'s sunsets — the way locals can tell the season by the exact shade of orange, or predict tomorrow\'s weather from tonight\'s sunset color. Our physics model captures the broad strokes, but those subtle distinctions (is it a pre-monsoon orange or a post-harvest orange?) come from effects our physics model misses. The ML correction captures exactly these fine distinctions that separate "a sunset" from "an Assam sunset."',
      checkQuestion: 'Why train the ML model on the residual (error) of the physics model rather than training it directly to predict RGB colors?',
      checkAnswer: 'Training on residuals gives three advantages. First, the residuals are small, so the ML model only needs to learn small corrections rather than the entire complex physics-to-color mapping. Second, the physics model provides strong inductive bias — the ML model cannot predict something wildly unphysical because the base prediction is already reasonable. Third, it requires far less training data because the function being learned (the correction) is simpler than the full prediction.',
      codeIntro: 'Train a regression model to correct physics-based predictions, compare RMSE, and visualize improvement.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Simplified physics model (from previous lessons) ---
wavelengths = np.arange(380, 781, 5)
n_wav = len(wavelengths)

def planck_spectrum(wavs, T=5778):
    lam = wavs * 1e-9
    h, c, k = 6.626e-34, 3e8, 1.381e-23
    B = (2*h*c**2/lam**5) / (np.exp(h*c/(lam*k*T)) - 1)
    return B / B.max()

def cie_xyz_approx(lam):
    t1 = (lam - 442.0) * (0.0624 if lam < 442 else 0.0374)
    t2 = (lam - 599.8) * (0.0264 if lam < 599.8 else 0.0323)
    t3 = (lam - 474.0) * (0.0264 if lam < 474 else 0.0323)
    x_bar = 0.362*np.exp(-0.5*t1**2) + 1.056*np.exp(-0.5*t2**2) - 0.065*np.exp(-0.5*t3**2)
    t1 = (lam - 568.8) * (0.0213 if lam < 568.8 else 0.0247)
    t2 = (lam - 530.9) * (0.0613 if lam < 530.9 else 0.0322)
    y_bar = 0.821*np.exp(-0.5*t1**2) + 0.286*np.exp(-0.5*t2**2)
    t1 = (lam - 437.0) * (0.0845 if lam < 437 else 0.0278)
    t2 = (lam - 459.0) * (0.0385 if lam < 459 else 0.0725)
    z_bar = 1.217*np.exp(-0.5*t1**2) + 0.681*np.exp(-0.5*t2**2)
    return max(x_bar, 0), max(y_bar, 0), max(z_bar, 0)

cie_x = np.array([cie_xyz_approx(w)[0] for w in wavelengths])
cie_y = np.array([cie_xyz_approx(w)[1] for w in wavelengths])
cie_z = np.array([cie_xyz_approx(w)[2] for w in wavelengths])
solar = planck_spectrum(wavelengths)

def physics_predict_rgb(air_mass, aerosol_od, humidity, altitude, cloud_factor):
    """Physics-only sunset color prediction."""
    tau_r = 0.00864 * (wavelengths/1000)**(-3.916) * np.exp(-altitude/8500)
    tau_m = aerosol_od * (wavelengths/550.0)**(-1.3)
    tau_w = humidity/100 * 0.01 + humidity/100 * 0.005 * np.exp(-0.5*((wavelengths-720)/20)**2)
    trans = np.exp(-(tau_r + tau_m + tau_w) * air_mass) * cloud_factor
    perceived = solar * trans
    dlam = 5
    X = np.sum(perceived * cie_x) * dlam
    Y = np.sum(perceived * cie_y) * dlam
    Z = np.sum(perceived * cie_z) * dlam
    norm = max(X+Y+Z, 1e-10)
    X, Y, Z = X/norm, Y/norm, Z/norm
    r = 3.2406*X - 1.5372*Y - 0.4986*Z
    g = -0.9689*X + 1.8758*Y + 0.0415*Z
    b = 0.0557*X - 0.2040*Y + 1.0570*Z
    def gamma(c):
        c = max(c, 0)
        return 12.92*c if c <= 0.0031308 else 1.055*c**(1/2.4) - 0.055
    return np.clip([gamma(r), gamma(g), gamma(b)], 0, 1)

# --- Generate "ground truth" with extra effects physics model misses ---
def ground_truth_rgb(air_mass, aerosol_od, humidity, altitude, cloud_factor):
    """Simulated ground truth: physics + multiple scattering + ozone + noise."""
    base = physics_predict_rgb(air_mass, aerosol_od, humidity, altitude, cloud_factor)

    # Multiple scattering: adds a warm glow, boosts red/green slightly at high air mass
    ms_boost = 0.02 * np.log1p(air_mass) * np.array([1.0, 0.6, 0.1])

    # Ozone absorption: Chappuis band absorbs ~500-650nm, slightly reduces green
    ozone_effect = np.array([0.0, -0.01 * air_mass / 20, 0.005 * air_mass / 20])

    # Non-linear aerosol interaction: heavy aerosol + humidity creates brighter base
    interaction = 0.015 * aerosol_od * humidity / 100 * np.array([0.5, 0.8, 0.2])

    # Sensor/observation noise
    noise = np.random.normal(0, 0.01, 3)

    truth = base + ms_boost + ozone_effect + interaction + noise
    return np.clip(truth, 0, 1)

# --- Create dataset ---
n_train, n_test = 400, 100
n_total = n_train + n_test

# Generate atmospheric conditions
humidity = np.clip(np.random.beta(5, 2, n_total) * 70 + 30, 30, 98)
pm25 = np.clip(np.where(np.random.random(n_total) < 0.6,
    np.random.gamma(3, 5, n_total), np.random.gamma(4, 25, n_total)), 5, 200)
altitude = np.clip(np.random.exponential(80, n_total) + 30, 0, 3000)
solar_angle = np.random.uniform(0.5, 15, n_total)
cloud_frac = np.clip(np.random.beta(2, 5, n_total), 0, 1)

# Compute engineered features
air_mass = 1.0 / (np.sin(np.radians(np.clip(solar_angle, 0.5, 90))) +
    0.50572 * (np.clip(solar_angle, 0.5, 90) + 6.07995)**(-1.6364))
aod = pm25 * 0.003
cloud_factor = 1 - 0.7 * cloud_frac

# Get physics predictions and ground truth
physics_rgb = np.array([physics_predict_rgb(am, ao, h, a, cf)
    for am, ao, h, a, cf in zip(air_mass, aod, humidity, altitude, cloud_factor)])
truth_rgb = np.array([ground_truth_rgb(am, ao, h, a, cf)
    for am, ao, h, a, cf in zip(air_mass, aod, humidity, altitude, cloud_factor)])

# Features for ML model
features = np.column_stack([air_mass, aod, humidity/100, altitude/3000, cloud_factor,
    air_mass * aod, air_mass**2])  # polynomial features

# Residuals = truth - physics
residuals = truth_rgb - physics_rgb

# Train/test split
X_train, X_test = features[:n_train], features[n_train:]
r_train, r_test = residuals[:n_train], residuals[n_train:]
phys_train, phys_test = physics_rgb[:n_train], physics_rgb[n_train:]
truth_test = truth_rgb[n_train:]

# --- Simple linear regression (normal equation) ---
def fit_linear_regression(X, y):
    """Fit y = X @ w using normal equation (X^T X)^-1 X^T y."""
    # Add bias column
    X_b = np.column_stack([np.ones(len(X)), X])
    # Normal equation with regularization
    lam_reg = 0.01
    w = np.linalg.solve(X_b.T @ X_b + lam_reg * np.eye(X_b.shape[1]), X_b.T @ y)
    return w

def predict_lr(X, w):
    X_b = np.column_stack([np.ones(len(X)), X])
    return X_b @ w

# Train separate models for R, G, B residuals
weights = []
for ch in range(3):
    w = fit_linear_regression(X_train, r_train[:, ch])
    weights.append(w)

# Predict corrections on test set
ml_corrections = np.column_stack([predict_lr(X_test, w) for w in weights])
ml_enhanced = np.clip(phys_test + ml_corrections, 0, 1)

# --- Evaluate ---
rmse_physics = np.sqrt(np.mean((phys_test - truth_test)**2, axis=0))
rmse_ml = np.sqrt(np.mean((ml_enhanced - truth_test)**2, axis=0))

# --- Visualize ---
fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Physics-Only vs ML-Enhanced Sunset Predictions',
             color='white', fontsize=14, fontweight='bold')

# Top row: scatter plots for each channel
channels = ['Red', 'Green', 'Blue']
colors_ch = ['#ef4444', '#22c55e', '#3b82f6']
for i, (ch_name, color) in enumerate(zip(channels, colors_ch)):
    ax = axes[0, i]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.scatter(truth_test[:, i], phys_test[:, i], alpha=0.4, s=15,
               color='gray', label=f'Physics (RMSE={rmse_physics[i]:.4f})')
    ax.scatter(truth_test[:, i], ml_enhanced[:, i], alpha=0.5, s=15,
               color=color, label=f'ML-enhanced (RMSE={rmse_ml[i]:.4f})')
    ax.plot([0, 1], [0, 1], '--', color='white', linewidth=1, alpha=0.5)
    ax.set_xlabel(f'True {ch_name}', color='white')
    ax.set_ylabel(f'Predicted {ch_name}', color='white')
    ax.set_title(f'{ch_name} Channel', color='white', fontsize=11)
    ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
    ax.set_xlim(0, 1); ax.set_ylim(0, 1)

# Bottom left: color swatches comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
n_show = 15
for i in range(n_show):
    ax.add_patch(plt.Rectangle((i, 2), 0.9, 0.9, facecolor=truth_test[i], edgecolor='white', lw=0.5))
    ax.add_patch(plt.Rectangle((i, 1), 0.9, 0.9, facecolor=ml_enhanced[i], edgecolor='white', lw=0.5))
    ax.add_patch(plt.Rectangle((i, 0), 0.9, 0.9, facecolor=phys_test[i], edgecolor='white', lw=0.5))
ax.set_xlim(-0.5, n_show + 0.5)
ax.set_ylim(-0.3, 3.3)
ax.set_yticks([0.45, 1.45, 2.45])
ax.set_yticklabels(['Physics', 'ML-enhanced', 'Ground truth'], color='white', fontsize=9)
ax.set_title('Side-by-side color comparison', color='white', fontsize=10)
ax.set_xticks([])

# Bottom middle: RMSE comparison bar chart
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
x_pos = np.arange(3)
width = 0.35
bars1 = ax.bar(x_pos - width/2, rmse_physics, width, color='gray', label='Physics only', alpha=0.8)
bars2 = ax.bar(x_pos + width/2, rmse_ml, width, color=colors_ch, label='ML-enhanced', alpha=0.8)
ax.set_xticks(x_pos)
ax.set_xticklabels(channels, color='white')
ax.set_ylabel('RMSE', color='white')
ax.set_title('RMSE Comparison by Channel', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
for bar in bars1:
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.001,
            f'{bar.get_height():.4f}', ha='center', color='gray', fontsize=7)
for bar, c in zip(bars2, colors_ch):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.001,
            f'{bar.get_height():.4f}', ha='center', color=c, fontsize=7)

# Bottom right: improvement percentage
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
improvement = (1 - rmse_ml / rmse_physics) * 100
bars = ax.bar(x_pos, improvement, color=colors_ch, alpha=0.8)
ax.set_xticks(x_pos)
ax.set_xticklabels(channels, color='white')
ax.set_ylabel('Improvement (%)', color='white')
ax.set_title('ML Improvement Over Physics Baseline', color='white', fontsize=10)
for bar, imp in zip(bars, improvement):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
            f'{imp:.1f}%', ha='center', color='white', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.show()

overall_physics = np.sqrt(np.mean(rmse_physics**2))
overall_ml = np.sqrt(np.mean(rmse_ml**2))
print("Model Comparison Results")
print("=" * 55)
print(f"{'Channel':<10} {'Physics RMSE':>14} {'ML RMSE':>14} {'Improvement':>12}")
print("-" * 55)
for ch, rp, rm, imp in zip(channels, rmse_physics, rmse_ml, improvement):
    print(f"{ch:<10} {rp:>14.5f} {rm:>14.5f} {imp:>11.1f}%")
print("-" * 55)
print(f"{'Overall':<10} {overall_physics:>14.5f} {overall_ml:>14.5f} "
      f"{(1-overall_ml/overall_physics)*100:>11.1f}%")
print()
print("The ML model learns corrections for effects the physics misses:")
print("  - Multiple scattering (warm glow at high air mass)")
print("  - Ozone absorption (Chappuis band green reduction)")
print("  - Aerosol-humidity interaction (non-linear brightening)")
print("Hybrid approach: physics provides structure, ML fills the gaps.")`,
      challenge: 'Add cross-validation: split the training set into 5 folds, train on 4 folds, evaluate on the 5th, and report mean +/- std RMSE. Does the model performance vary significantly across folds?',
      successHint: 'Physics-informed ML is one of the most powerful approaches in modern science and engineering. Pure ML needs vast data and can produce unphysical results. Pure physics misses real-world complexity. The hybrid approach gets the best of both: physical correctness as a floor, with data-driven refinement on top.',
    },
    {
      title: 'Visualization Dashboard',
      concept: `A prediction is only useful if people can understand and interact with it. This lesson builds a multi-panel visualization dashboard — the kind of interface that turns a research prototype into a tool someone would actually use. Good scientific visualization follows three principles: **accuracy** (the data is not distorted or misleading), **clarity** (the viewer understands what they see without reading a manual), and **density** (maximum information per pixel without clutter).

Our dashboard will have four panels. The main panel shows the predicted sunset sky as a gradient — not just a single color swatch, but a vertical gradient from horizon (warmest) to zenith (coolest), because the atmosphere scatters differently at different viewing angles. The second panel shows how the predicted color changes as a function of each input variable while holding others constant — sensitivity analysis. The third panel shows a "color trajectory" as the sun moves from 15 degrees to below the horizon — the full color evolution of a sunset. The fourth panel shows the RGB channel breakdown over time.

Interactive elements are critical. A slider for each input variable lets the user explore: "What happens if I increase PM2.5 from 20 to 100?" In a web app, these would be HTML range inputs. In our matplotlib version, we will simulate this by computing predictions across a grid of input values and showing the full parameter space at once. The goal is that a photographer in Assam could enter today's weather conditions and see: "Tonight's sunset will peak at this color around 6:12 PM."`,
      analogy: 'A dashboard is like the cockpit of an airplane. A pilot does not want raw sensor data streams — she wants an altimeter, an airspeed indicator, a heading display. Each instrument shows one critical piece of information, clearly and immediately. Our dashboard is the "cockpit" for understanding sunsets: one panel for the prediction, one for sensitivity, one for trajectory, one for channel detail. Together they give a complete operational picture.',
      storyConnection: 'Imagine the village elders from the story having this dashboard on their phones. They could check: "Today\'s humidity is 85%, the rice straw burning has PM2.5 at 60, and the sun sets at 5:45 PM — tonight\'s sunset will be a deep amber orange, peaking at 5:52 PM." The story\'s wonder about why sunsets look the way they do becomes a quantitative, interactive experience that still preserves the beauty.',
      checkQuestion: 'Why show a vertical gradient rather than a single color swatch for the sunset prediction?',
      checkAnswer: 'The sky is not one color at sunset — the horizon is warm orange/red where you look through the most atmosphere, and it transitions to blue/purple overhead where the path length is short. A single swatch would misrepresent the actual visual experience. The gradient captures the angular dependence of atmospheric scattering, which is a key feature of real sunsets. It is also more visually compelling and informative.',
      codeIntro: 'Build a four-panel dashboard that visualizes predicted sunset colors across different atmospheric conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

np.random.seed(42)

# --- Core prediction functions (from previous lessons) ---
wavelengths = np.arange(380, 781, 5)

def planck(wavs, T=5778):
    lam = wavs * 1e-9; h, c, k = 6.626e-34, 3e8, 1.381e-23
    B = (2*h*c**2/lam**5) / (np.exp(h*c/(lam*k*T)) - 1)
    return B / B.max()

def cie_xyz(lam):
    t1 = (lam-442)*(0.0624 if lam<442 else 0.0374)
    t2 = (lam-599.8)*(0.0264 if lam<599.8 else 0.0323)
    t3 = (lam-474)*(0.0264 if lam<474 else 0.0323)
    x = 0.362*np.exp(-.5*t1**2)+1.056*np.exp(-.5*t2**2)-0.065*np.exp(-.5*t3**2)
    t1 = (lam-568.8)*(0.0213 if lam<568.8 else 0.0247)
    t2 = (lam-530.9)*(0.0613 if lam<530.9 else 0.0322)
    y = 0.821*np.exp(-.5*t1**2)+0.286*np.exp(-.5*t2**2)
    t1 = (lam-437)*(0.0845 if lam<437 else 0.0278)
    t2 = (lam-459)*(0.0385 if lam<459 else 0.0725)
    z = 1.217*np.exp(-.5*t1**2)+0.681*np.exp(-.5*t2**2)
    return max(x,0), max(y,0), max(z,0)

cx = np.array([cie_xyz(w)[0] for w in wavelengths])
cy = np.array([cie_xyz(w)[1] for w in wavelengths])
cz = np.array([cie_xyz(w)[2] for w in wavelengths])
sol = planck(wavelengths)

def predict_color(air_mass, aod, humidity, altitude, cloud_fac):
    tau_r = 0.00864*(wavelengths/1000)**(-3.916)*np.exp(-altitude/8500)
    tau_m = aod*(wavelengths/550.0)**(-1.3)
    tau_w = humidity/100*0.01 + humidity/100*0.005*np.exp(-.5*((wavelengths-720)/20)**2)
    trans = np.exp(-(tau_r+tau_m+tau_w)*air_mass)*cloud_fac
    spec = sol * trans
    dl = 5
    X = np.sum(spec*cx)*dl; Y = np.sum(spec*cy)*dl; Z = np.sum(spec*cz)*dl
    n = max(X+Y+Z, 1e-10); X/=n; Y/=n; Z/=n
    r = 3.2406*X-1.5372*Y-0.4986*Z
    g = -0.9689*X+1.8758*Y+0.0415*Z
    b = 0.0557*X-0.2040*Y+1.0570*Z
    gam = lambda c: 12.92*max(c,0) if max(c,0)<=0.0031308 else 1.055*max(c,0)**(1/2.4)-0.055
    return np.clip([gam(r), gam(g), gam(b)], 0, 1)

def angle_to_am(deg):
    a = max(deg, 0.5)
    return 1.0/(np.sin(np.radians(a))+0.50572*(a+6.07995)**(-1.6364))

# --- Dashboard Configuration ---
# Typical Assam evening conditions
base_humidity = 75.0
base_pm25 = 45.0
base_altitude = 80.0
base_angle = 3.0
base_cloud = 0.15

base_am = angle_to_am(base_angle)
base_aod = base_pm25 * 0.003
base_cf = 1 - 0.7 * base_cloud

fig = plt.figure(figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Sunset Color Predictor Dashboard — Brahmaputra Valley',
             color='white', fontsize=16, fontweight='bold', y=0.98)

# --- Panel 1: Sky gradient (left column) ---
ax1 = fig.add_axes([0.03, 0.08, 0.2, 0.82])
ax1.set_facecolor('#111827')

# Compute colors at different viewing angles (horizon to zenith)
view_angles = np.linspace(0, 80, 60)  # 0=horizon, 80=near-zenith
sky_colors = []
for va in view_angles:
    # Near horizon: long path, see transmitted light (warm)
    # Near zenith: short path, see scattered light (blue)
    if va < 20:  # near horizon — transmitted sunset light
        effective_am = base_am * (1 + 0.5 * (20 - va) / 20)
        rgb = predict_color(effective_am, base_aod, base_humidity, base_altitude, base_cf)
    else:  # higher up — scattered blue dominates
        scatter_strength = (va - 20) / 60.0
        sunset_rgb = predict_color(base_am * 0.5, base_aod * 0.3, base_humidity,
                                    base_altitude, base_cf)
        blue_sky = np.array([0.15, 0.15, 0.45])  # twilight blue
        rgb = (1 - scatter_strength) * sunset_rgb + scatter_strength * blue_sky
        rgb = np.clip(rgb, 0, 1)
    sky_colors.append(rgb)

# Draw the gradient
for i in range(len(view_angles) - 1):
    ax1.axhspan(view_angles[i], view_angles[i+1], color=sky_colors[i])

ax1.set_xlim(0, 1); ax1.set_ylim(0, 80)
ax1.set_xticks([])
ax1.set_ylabel('Viewing angle from horizon (degrees)', color='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.set_title('Predicted Sky', color='white', fontsize=11, fontweight='bold')

# Add condition labels
info_text = (f"Humidity: {base_humidity}%\n"
             f"PM2.5: {base_pm25} ug/m3\n"
             f"Alt: {base_altitude}m\n"
             f"Sun: {base_angle} deg\n"
             f"Cloud: {base_cloud*100:.0f}%")
ax1.text(0.5, 0.02, info_text, transform=ax1.transAxes, color='white',
         fontsize=8, ha='center', va='bottom',
         bbox=dict(boxstyle='round,pad=0.3', facecolor='black', alpha=0.6))

# --- Panel 2: Sensitivity analysis (top right) ---
ax2 = fig.add_axes([0.3, 0.55, 0.65, 0.35])
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')

params = [
    ('Humidity (%)', np.linspace(30, 98, 40), lambda v: predict_color(
        base_am, base_aod, v, base_altitude, base_cf)),
    ('PM2.5 (ug/m3)', np.linspace(5, 150, 40), lambda v: predict_color(
        base_am, v*0.003, base_humidity, base_altitude, base_cf)),
    ('Solar angle (deg)', np.linspace(1, 15, 40), lambda v: predict_color(
        angle_to_am(v), base_aod, base_humidity, base_altitude, base_cf)),
    ('Cloud cover (%)', np.linspace(0, 80, 40), lambda v: predict_color(
        base_am, base_aod, base_humidity, base_altitude, 1-0.7*v/100)),
]

n_params = len(params)
bar_height = 0.8 / n_params
for pi, (pname, prange, pfunc) in enumerate(params):
    colors_row = np.array([pfunc(v) for v in prange])
    y_base = 1.0 - (pi + 1) * (1.0 / n_params) + 0.02
    for j in range(len(prange) - 1):
        x0 = (prange[j] - prange[0]) / (prange[-1] - prange[0])
        x1 = (prange[j+1] - prange[0]) / (prange[-1] - prange[0])
        rect = plt.Rectangle((x0, y_base), x1-x0, bar_height,
                              transform=ax2.transAxes, color=colors_row[j], clip_on=True)
        ax2.add_patch(rect)
    ax2.text(-0.01, y_base + bar_height/2, pname, transform=ax2.transAxes,
             color='white', fontsize=9, ha='right', va='center')
    # Range labels
    ax2.text(0.0, y_base - 0.02, f'{prange[0]:.0f}', transform=ax2.transAxes,
             color='gray', fontsize=7, ha='left')
    ax2.text(1.0, y_base - 0.02, f'{prange[-1]:.0f}', transform=ax2.transAxes,
             color='gray', fontsize=7, ha='right')

ax2.set_xlim(0, 1); ax2.set_ylim(0, 1)
ax2.set_xticks([]); ax2.set_yticks([])
ax2.set_title('Sensitivity Analysis — Color vs Each Parameter',
              color='white', fontsize=11, fontweight='bold')

# --- Panel 3: Sunset trajectory (bottom left) ---
ax3 = fig.add_axes([0.3, 0.08, 0.3, 0.38])
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')

sun_angles = np.linspace(15, 0.5, 50)
traj_colors = np.array([predict_color(angle_to_am(a), base_aod, base_humidity,
    base_altitude, base_cf) for a in sun_angles])

# Plot as colored line
for i in range(len(sun_angles) - 1):
    ax3.plot(sun_angles[i:i+2], [0.5, 0.5], linewidth=20, solid_capstyle='butt',
             color=traj_colors[i])

# Also plot R, G, B channels
ax3_twin = ax3.twinx()
ax3_twin.plot(sun_angles, traj_colors[:, 0], '-', color='#ef4444', linewidth=2, label='R')
ax3_twin.plot(sun_angles, traj_colors[:, 1], '-', color='#22c55e', linewidth=2, label='G')
ax3_twin.plot(sun_angles, traj_colors[:, 2], '-', color='#3b82f6', linewidth=2, label='B')
ax3_twin.set_ylabel('Channel value', color='white', fontsize=9)
ax3_twin.tick_params(colors='gray')
ax3_twin.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper left')

ax3.set_xlabel('Solar elevation angle (degrees)', color='white', fontsize=9)
ax3.set_title('Color Trajectory: Sun 15 deg -> Horizon',
              color='white', fontsize=11, fontweight='bold')
ax3.set_yticks([])
ax3.invert_xaxis()

# --- Panel 4: Location comparison (bottom right) ---
ax4 = fig.add_axes([0.65, 0.08, 0.3, 0.38])
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')

locations = [
    ('Guwahati, Assam', 80, 45, 75, 0.15),
    ('Sahara Desert', 400, 80, 15, 0.05),
    ('Arctic Circle', 10, 5, 50, 0.30),
    ('Los Angeles', 50, 35, 40, 0.10),
    ('Mumbai Coast', 10, 55, 85, 0.25),
    ('Swiss Alps', 2500, 10, 35, 0.20),
]

bar_w = 0.7
for i, (name, alt, pm, hum, cloud) in enumerate(locations):
    am = angle_to_am(3.0)  # same sun angle for comparison
    aod = pm * 0.003
    cf = 1 - 0.7 * cloud
    rgb = predict_color(am, aod, hum, alt, cf)
    ax4.barh(i, 1, height=bar_w, color=rgb, edgecolor='white', linewidth=0.5)
    hex_c = '#{:02x}{:02x}{:02x}'.format(int(rgb[0]*255), int(rgb[1]*255), int(rgb[2]*255))
    # Choose text color for contrast
    brightness = 0.299*rgb[0] + 0.587*rgb[1] + 0.114*rgb[2]
    tc = 'black' if brightness > 0.5 else 'white'
    ax4.text(0.5, i, f'{name}  {hex_c}', ha='center', va='center',
             color=tc, fontsize=9, fontweight='bold')

ax4.set_yticks([]); ax4.set_xticks([])
ax4.set_xlim(0, 1)
ax4.set_title('Location Comparison (same sun angle)',
              color='white', fontsize=11, fontweight='bold')

plt.show()

print("Dashboard rendered with 4 panels:")
print("  1. Sky gradient — full horizon-to-zenith color prediction")
print("  2. Sensitivity analysis — how each parameter shifts color")
print("  3. Color trajectory — evolution as sun descends to horizon")
print("  4. Location comparison — same physics, different atmospheres")
print()
print("The Assam sunset stands out: deep warm orange from high humidity")
print("+ moderate aerosols, distinct from the dry Sahara (reddish) or")
print("clean Arctic (pale gold). Geography IS color.")`,
      challenge: 'Add a fifth panel: a 2D heatmap showing predicted sunset "warmth" (R-B channel difference) as a function of humidity (x-axis) and PM2.5 (y-axis). This shows the full parameter space at a glance.',
      successHint: 'Visualization is not decoration — it is a tool for understanding. Each panel in this dashboard answers a different question: "What will it look like?" (gradient), "What matters most?" (sensitivity), "How does it change?" (trajectory), "How does location matter?" (comparison). A good dashboard makes the physics intuitive.',
    },
    {
      title: 'Deployment & Portfolio',
      concept: `The final step of any capstone project is packaging it for the real world. This means clean code, clear documentation, a well-defined API, graceful error handling, and sample outputs that demonstrate the system works. It also means being honest about limitations — what the model cannot do is as important as what it can.

Our Sunset Color Predictor has several known limitations worth documenting. First, it assumes single-scattering only; multiple scattering effects are approximated by the ML correction but not fully modeled. Second, the CIE color matching functions are simplified Gaussian approximations rather than the tabulated standard values. Third, the model does not account for terrain features (mountains blocking the sun, reflections off water). Fourth, cloud effects are modeled as simple attenuation rather than as scattering surfaces that can produce spectacular pink and gold illumination.

A professional deployment would package this as a Python library with a clean API: \`predict_sunset(humidity, pm25, altitude, solar_angle, cloud_cover)\` returns an RGB tuple. It would include type hints, docstrings, input validation, and unit tests. The README would explain the physics, show example outputs, list dependencies, and acknowledge limitations. For a web deployment, a Flask or FastAPI wrapper would serve predictions via HTTP, and a JavaScript frontend would render the gradient. This lesson builds the polished final version.`,
      analogy: 'Deploying a project is like publishing a book. Writing the draft (building the model) is only half the work. You still need editing (code review, refactoring), formatting (clean API, consistent style), a cover (sample outputs, documentation), and an honest "about the author" page (limitations, assumptions). A beautifully written book with no cover and no table of contents sits unread on a shelf. Same with undocumented code.',
      storyConnection: 'The story of Assam\'s sunsets is itself a kind of deployment — it takes complex atmospheric physics and packages it as a narrative that a child can understand and an adult can appreciate. Our predictor does the same thing computationally: it takes equations involving optical depth, Rayleigh scattering, and CIE color spaces and packages them behind a simple question anyone can ask: "What color will tonight\'s sunset be?"',
      checkQuestion: 'A user reports that the predictor gives unrealistic results when cloud_cover is set to 100%. What went wrong, and how should the system handle this edge case?',
      checkAnswer: 'At 100% cloud cover, our simple model multiplies by cloud_factor = 1 - 0.7*1.0 = 0.3, producing a dim but still colored sunset. In reality, 100% thick cloud cover means no visible sunset at all. The system should validate inputs and handle edge cases: cloud_cover >= 90% could trigger a warning ("Sunset unlikely to be visible") and return a gray color. Input validation and meaningful error messages are essential for deployment.',
      codeIntro: 'Build the final polished version with a clean API, comprehensive docstrings, input validation, and a showcase of sample predictions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ================================================================
# SUNSET COLOR PREDICTOR — Final Polished Version
# ================================================================
# A physics-based sunset color prediction tool that computes
# the perceived RGB color of a sunset given atmospheric conditions.
#
# Based on: Rayleigh scattering, Mie scattering, Beer-Lambert law,
#           CIE 1931 XYZ color space, sRGB conversion.
#
# Limitations:
#   - Single scattering only (no multiple scattering)
#   - Simplified CIE color matching functions
#   - No terrain modeling (assumes flat horizon)
#   - Cloud effects modeled as simple attenuation
# ================================================================

class SunsetPredictor:
    """Predict sunset colors from atmospheric conditions.

    Usage:
        predictor = SunsetPredictor()
        rgb = predictor.predict(humidity=75, pm25=45, altitude=80,
                                solar_angle=3.0, cloud_cover=15)
    """

    # Visible spectrum wavelengths (nm)
    WAVELENGTHS = np.arange(380, 781, 5)

    # Precomputed constants
    _solar = None
    _cie_x = None
    _cie_y = None
    _cie_z = None

    def __init__(self):
        """Initialize precomputed spectra."""
        wavs = self.WAVELENGTHS
        # Solar spectrum (Planck blackbody, 5778 K)
        lam = wavs * 1e-9
        h, c, k = 6.626e-34, 3e8, 1.381e-23
        T_sun = 5778
        B = (2*h*c**2/lam**5) / (np.exp(h*c/(lam*k*T_sun)) - 1)
        self._solar = B / B.max()

        # CIE 1931 color matching functions (Wyman et al. approximation)
        self._cie_x = np.array([self._cie_xbar(w) for w in wavs])
        self._cie_y = np.array([self._cie_ybar(w) for w in wavs])
        self._cie_z = np.array([self._cie_zbar(w) for w in wavs])

    @staticmethod
    def _cie_xbar(lam):
        t1 = (lam-442)*(0.0624 if lam<442 else 0.0374)
        t2 = (lam-599.8)*(0.0264 if lam<599.8 else 0.0323)
        t3 = (lam-474)*(0.0264 if lam<474 else 0.0323)
        return max(0.362*np.exp(-.5*t1**2)+1.056*np.exp(-.5*t2**2)-0.065*np.exp(-.5*t3**2), 0)

    @staticmethod
    def _cie_ybar(lam):
        t1 = (lam-568.8)*(0.0213 if lam<568.8 else 0.0247)
        t2 = (lam-530.9)*(0.0613 if lam<530.9 else 0.0322)
        return max(0.821*np.exp(-.5*t1**2)+0.286*np.exp(-.5*t2**2), 0)

    @staticmethod
    def _cie_zbar(lam):
        t1 = (lam-437)*(0.0845 if lam<437 else 0.0278)
        t2 = (lam-459)*(0.0385 if lam<459 else 0.0725)
        return max(1.217*np.exp(-.5*t1**2)+0.681*np.exp(-.5*t2**2), 0)

    def _validate_inputs(self, humidity, pm25, altitude, solar_angle, cloud_cover):
        """Validate and clamp input parameters. Returns warnings list."""
        warnings = []
        if not (0 <= humidity <= 100):
            warnings.append(f"Humidity {humidity}% clamped to [0, 100]")
            humidity = np.clip(humidity, 0, 100)
        if pm25 < 0:
            warnings.append(f"PM2.5 {pm25} clamped to 0")
            pm25 = max(pm25, 0)
        if pm25 > 500:
            warnings.append(f"PM2.5 {pm25} is extremely high (AQI hazardous)")
        if altitude < 0:
            warnings.append(f"Altitude {altitude}m clamped to 0")
            altitude = max(altitude, 0)
        if solar_angle < -5:
            warnings.append("Sun is well below horizon — no visible sunset")
        if cloud_cover >= 90:
            warnings.append("Heavy cloud cover — sunset may not be visible")
        return humidity, pm25, altitude, solar_angle, cloud_cover, warnings

    def _air_mass(self, solar_angle_deg):
        """Kasten-Young air mass formula."""
        a = max(solar_angle_deg, 0.5)
        return 1.0 / (np.sin(np.radians(a)) + 0.50572*(a+6.07995)**(-1.6364))

    def _transmission(self, air_mass, aod_550, humidity, altitude):
        """Beer-Lambert atmospheric transmission at each wavelength."""
        wavs = self.WAVELENGTHS
        tau_r = 0.00864 * (wavs/1000)**(-3.916) * np.exp(-altitude/8500)
        tau_m = aod_550 * (wavs/550.0)**(-1.3)
        tau_w = (humidity/100*0.01 +
                 humidity/100*0.005*np.exp(-0.5*((wavs-720)/20)**2))
        return np.exp(-(tau_r + tau_m + tau_w) * air_mass)

    def _spectrum_to_rgb(self, spectrum):
        """Convert spectral power distribution to sRGB via CIE XYZ."""
        dl = self.WAVELENGTHS[1] - self.WAVELENGTHS[0]
        X = np.sum(spectrum * self._cie_x) * dl
        Y = np.sum(spectrum * self._cie_y) * dl
        Z = np.sum(spectrum * self._cie_z) * dl

        n = max(X+Y+Z, 1e-10)
        X, Y, Z = X/n, Y/n, Z/n

        # XYZ -> linear sRGB (D65)
        r_lin = 3.2406*X - 1.5372*Y - 0.4986*Z
        g_lin = -0.9689*X + 1.8758*Y + 0.0415*Z
        b_lin = 0.0557*X - 0.2040*Y + 1.0570*Z

        # sRGB gamma
        def gamma(c):
            c = max(c, 0)
            return 12.92*c if c <= 0.0031308 else 1.055*c**(1/2.4)-0.055

        return np.clip([gamma(r_lin), gamma(g_lin), gamma(b_lin)], 0, 1)

    def predict(self, humidity=60, pm25=30, altitude=0, solar_angle=3.0, cloud_cover=20):
        """Predict sunset RGB color from atmospheric conditions.

        Args:
            humidity: Relative humidity (0-100%)
            pm25: PM2.5 concentration (ug/m3, typically 5-200)
            altitude: Observer altitude above sea level (meters)
            solar_angle: Solar elevation angle (degrees, 0=horizon)
            cloud_cover: Cloud cover (0-100%)

        Returns:
            dict with keys: 'rgb', 'hex', 'warnings', 'air_mass', 'aod'
        """
        h, p, a, sa, cc, warnings = self._validate_inputs(
            humidity, pm25, altitude, solar_angle, cloud_cover)

        am = self._air_mass(sa)
        aod = p * 0.003
        cf = 1 - 0.7 * (cc / 100)

        trans = self._transmission(am, aod, h, a)
        perceived = self._solar * trans * cf
        rgb = self._spectrum_to_rgb(perceived)
        hex_color = '#{:02x}{:02x}{:02x}'.format(
            int(rgb[0]*255), int(rgb[1]*255), int(rgb[2]*255))

        return {
            'rgb': tuple(np.round(rgb, 4)),
            'hex': hex_color,
            'warnings': warnings,
            'air_mass': round(am, 2),
            'aod': round(aod, 4),
        }

    def predict_trajectory(self, humidity=60, pm25=30, altitude=0,
                           cloud_cover=20, angles=None):
        """Predict color trajectory as sun moves toward horizon.

        Returns list of (angle, rgb_tuple) pairs.
        """
        if angles is None:
            angles = np.linspace(15, 0.5, 30)
        results = []
        for ang in angles:
            result = self.predict(humidity, pm25, altitude, ang, cloud_cover)
            results.append((ang, result['rgb']))
        return results

# ================================================================
# DEMONSTRATION
# ================================================================
predictor = SunsetPredictor()

# --- Sample predictions ---
print("SUNSET COLOR PREDICTOR — Sample Predictions")
print("=" * 65)

scenarios = [
    ("Brahmaputra Valley (typical)", dict(humidity=75, pm25=45, altitude=80, solar_angle=3, cloud_cover=15)),
    ("Brahmaputra (crop burning)", dict(humidity=70, pm25=120, altitude=80, solar_angle=3, cloud_cover=10)),
    ("Brahmaputra (post-monsoon)", dict(humidity=92, pm25=8, altitude=80, solar_angle=3, cloud_cover=25)),
    ("Clear mountain summit", dict(humidity=25, pm25=5, altitude=3000, solar_angle=3, cloud_cover=5)),
    ("Polluted megacity", dict(humidity=55, pm25=180, altitude=50, solar_angle=3, cloud_cover=20)),
    ("Tropical beach", dict(humidity=85, pm25=12, altitude=5, solar_angle=3, cloud_cover=30)),
    ("Edge case: 100% clouds", dict(humidity=80, pm25=30, altitude=100, solar_angle=3, cloud_cover=100)),
    ("Edge case: sun below horizon", dict(humidity=60, pm25=30, altitude=100, solar_angle=-3, cloud_cover=10)),
]

results = []
for name, params in scenarios:
    r = predictor.predict(**params)
    results.append((name, params, r))
    warn_str = f"  WARNING: {'; '.join(r['warnings'])}" if r['warnings'] else ""
    print(f"  {name:<35} {r['hex']}  AM={r['air_mass']:>5.1f}  AOD={r['aod']:.3f}{warn_str}")

# --- Final showcase plot ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Sunset Color Predictor — Final Showcase',
             color='white', fontsize=16, fontweight='bold')

# Panel 1: All scenario colors
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i, (name, params, r) in enumerate(results):
    rgb = r['rgb']
    ax.barh(i, 1, color=rgb, edgecolor='white', linewidth=0.5, height=0.8)
    brightness = 0.299*rgb[0] + 0.587*rgb[1] + 0.114*rgb[2]
    tc = 'black' if brightness > 0.5 else 'white'
    ax.text(0.02, i, f'{name}', va='center', color=tc, fontsize=8, fontweight='bold')
    ax.text(0.98, i, r['hex'], va='center', ha='right', color=tc, fontsize=8)
ax.set_yticks([]); ax.set_xticks([])
ax.set_xlim(0, 1)
ax.set_title('Predicted Colors by Scenario', color='white', fontsize=11)

# Panel 2: Assam trajectory
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
traj = predictor.predict_trajectory(humidity=75, pm25=45, altitude=80, cloud_cover=15)
angles_t = [t[0] for t in traj]
rgbs_t = np.array([t[1] for t in traj])

for i in range(len(angles_t)-1):
    ax.plot(angles_t[i:i+2], [0]*2, linewidth=25, solid_capstyle='butt',
            color=rgbs_t[i])

ax.plot(angles_t, rgbs_t[:, 0], '-', color='#ef4444', linewidth=2, alpha=0.8, label='R')
ax.plot(angles_t, rgbs_t[:, 1], '-', color='#22c55e', linewidth=2, alpha=0.8, label='G')
ax.plot(angles_t, rgbs_t[:, 2], '-', color='#3b82f6', linewidth=2, alpha=0.8, label='B')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlabel('Solar angle (deg)', color='white')
ax.set_title('Assam Sunset Trajectory', color='white', fontsize=11)
ax.invert_xaxis()

# Panel 3: Humidity vs PM2.5 heatmap
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
hum_range = np.linspace(30, 95, 25)
pm_range = np.linspace(5, 150, 25)
warmth_map = np.zeros((len(pm_range), len(hum_range), 3))
for hi, hv in enumerate(hum_range):
    for pi, pv in enumerate(pm_range):
        r = predictor.predict(humidity=hv, pm25=pv, altitude=80, solar_angle=3, cloud_cover=15)
        warmth_map[pi, hi] = r['rgb']

ax.imshow(warmth_map, origin='lower', aspect='auto',
          extent=[hum_range[0], hum_range[-1], pm_range[0], pm_range[-1]])
ax.set_xlabel('Humidity (%)', color='white')
ax.set_ylabel('PM2.5 (ug/m3)', color='white')
ax.set_title('Color Space: Humidity vs PM2.5', color='white', fontsize=11)
# Mark Assam typical conditions
ax.plot(75, 45, 'w*', markersize=15, markeredgecolor='black', markeredgewidth=1)
ax.annotate('Assam', (75, 45), (80, 80), color='white', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='white'))

# Panel 4: API documentation
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.set_xticks([]); ax.set_yticks([])
doc_text = """API Reference
─────────────────────────────
predictor = SunsetPredictor()

result = predictor.predict(
    humidity=75,     # 0-100 %
    pm25=45,         # ug/m3
    altitude=80,     # meters ASL
    solar_angle=3.0, # degrees
    cloud_cover=15   # 0-100 %
)

result['rgb']  → (0.92, 0.58, 0.14)
result['hex']  → '#eb941f'
result['warnings'] → []
result['air_mass'] → 19.79

Limitations
─────────────────────────────
• Single scattering only
• Simplified CIE functions
• No terrain modeling
• Cloud = attenuation only
• No twilight purple (ozone)"""

ax.text(0.05, 0.95, doc_text, transform=ax.transAxes, color='#22c55e',
        fontsize=8.5, va='top', fontfamily='monospace',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))
ax.set_title('Documentation', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print()
print("CAPSTONE COMPLETE")
print("=" * 65)
print("You built a Sunset Color Predictor from scratch:")
print("  1. Defined the problem and feature set")
print("  2. Engineered physics-meaningful features from raw data")
print("  3. Implemented spectral rendering (Rayleigh + Mie -> CIE XYZ -> sRGB)")
print("  4. Enhanced physics with ML residual correction")
print("  5. Built a multi-panel visualization dashboard")
print("  6. Packaged it as a clean, documented, validated API")
print()
print("Skills demonstrated: physics modeling, feature engineering,")
print("color science, machine learning, data visualization, software design.")
print()
print("Next steps for a real deployment:")
print("  - Use tabulated CIE functions instead of Gaussian approximation")
print("  - Add multiple scattering via adding-doubling method")
print("  - Train ML correction on real sunset photographs")
print("  - Build a web frontend with real-time weather API integration")
print("  - Add twilight purple (ozone Chappuis band absorption)")`,
      challenge: 'Add a method predict_best_time(humidity, pm25, altitude, cloud_cover) that scans solar angles from 15 to 0.5 degrees and returns the angle (and approximate time) at which the sunset is most vivid — defined as the angle where (R - B) is maximized. Test it with Assam conditions.',
      successHint: 'You have completed a full capstone project: from problem definition through physics, machine learning, visualization, and deployment. This is the shape of real engineering work — not a single algorithm, but a pipeline where every stage matters. The sunset predictor is portfolio-ready: it demonstrates physics knowledge, coding skill, ML understanding, and communication through visualization.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (machine learning foundations)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Sunset Color Predictor. Click to start.</p>
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
            diagram={[RayleighScatteringDiagram, CorrelationDiagram, WavelengthSpectrum, LinearGraphDiagram, SunsetSimulatorOutputDiagram, SunsetPathDiagram][i] ? createElement([RayleighScatteringDiagram, CorrelationDiagram, WavelengthSpectrum, LinearGraphDiagram, SunsetSimulatorOutputDiagram, SunsetPathDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
