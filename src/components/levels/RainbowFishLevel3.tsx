import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RainbowFishLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Fish coloration — chromatophores and iridophores',
      concept: `Fish produce color through two fundamentally different mechanisms. Chromatophores are pigment-containing cells that absorb specific wavelengths and reflect the rest. Melanophores contain melanin (black/brown), xanthophores contain carotenoids and pteridines (yellow/orange/red), and erythrophores concentrate red pigments. The second mechanism is structural: iridophores contain stacks of crystalline guanine platelets that act as thin-film interference mirrors, producing the metallic silvers, blues, and rainbow iridescence that give fish their shimmer.

Iridophore physics follows the same principles as thin-film interference in soap bubbles. Guanine platelets (refractive index ~1.83) alternate with cytoplasm layers (n~1.37). Constructive interference occurs when 2nd cos(θ) = mλ, where d is the platelet thickness, θ is the angle, m is an integer, and λ is the wavelength. By varying platelet spacing (typically 50-200 nm), fish can selectively reflect different colors. Changing the angle shifts the color — this is why fish flash iridescent colors as they turn.

Many fish can dynamically change color. Motor neurons and hormones control the dispersion of pigment granules within chromatophores — when melanin granules aggregate to the cell center, the skin lightens; when they disperse throughout the cell, it darkens. Some species can shift color in seconds (for camouflage or signaling) while others change slowly over weeks (adapting to background). This is one of nature\'s most sophisticated optical systems.`,
      analogy: 'Think of fish skin as a two-layer display. The bottom layer is like a traditional painting with real pigments — reds, yellows, and blacks. The top layer is like a holographic sticker made of tiny mirrors arranged in precise stacks. The mirrors produce iridescence through interference (like oil on water), while the pigments underneath add stable base colors. Together they create the dazzling palette that no single mechanism could achieve.',
      storyConnection: 'The rainbow fish of Umiam Lake earned its name from the shifting iridescent colors visible as it darts through sun-dappled water. Those rainbow flashes are not pigment but physics — guanine crystal stacks in iridophores acting as wavelength-selective mirrors. As the fish turns, the viewing angle changes, shifting the constructive interference condition and sweeping through the spectrum. The rainbow is structural, not chemical.',
      checkQuestion: 'If guanine platelets in an iridophore are 80 nm thick (n=1.83), what wavelength experiences first-order constructive interference at normal incidence? What color is this?',
      checkAnswer: 'At normal incidence (θ=0, cos θ=1), constructive interference: 2nd = mλ. For m=1: λ = 2 × 1.83 × 80 = 292.8 nm — this is UV, invisible to human eyes. For m=1 to produce visible light, we need thicker platelets. At d=120nm: λ = 2 × 1.83 × 120 = 439.2 nm (blue-violet). At d=160nm: λ = 585.6 nm (orange-gold). Fish tune their color by controlling platelet thickness.',
      codeIntro: 'Model thin-film interference in iridophores and visualize how platelet spacing controls fish coloration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Thin-film interference in iridophores
# Constructive interference: 2*n*d*cos(theta) = m*lambda
# Reflectance from multilayer stack (simplified transfer matrix)

n_guanine = 1.83    # refractive index of guanine
n_cytoplasm = 1.37  # refractive index of cytoplasm

def multilayer_reflectance(wavelengths, d_guanine, d_cyto, n_layers=6):
    """Simplified reflectance from alternating guanine/cytoplasm stack."""
    reflectance = np.zeros_like(wavelengths, dtype=float)
    for lam in range(len(wavelengths)):
        # Phase accumulated in each layer
        phi_g = 2 * np.pi * n_guanine * d_guanine / wavelengths[lam]
        phi_c = 2 * np.pi * n_cytoplasm * d_cyto / wavelengths[lam]
        # Fresnel coefficients at interfaces
        r12 = (n_guanine - n_cytoplasm) / (n_guanine + n_cytoplasm)
        # Approximate: reflectance peaks when round-trip phase = 2*pi*m
        total_phase = phi_g + phi_c
        # Constructive: sum of partial reflections
        R = n_layers * r12**2 / (1 + (n_layers * r12**2 - 1) * np.sin(total_phase)**2)
        reflectance[lam] = min(R, 1.0)
    return reflectance

wavelengths = np.linspace(350, 750, 400)  # nm

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Reflectance spectra for different platelet thicknesses
ax = axes[0, 0]
ax.set_facecolor('#111827')
thicknesses = [(70, 70, 'UV-blue'), (90, 90, 'Blue'), (110, 110, 'Green'),
               (130, 130, 'Yellow'), (160, 160, 'Orange-red')]
colors = ['#818cf8', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
for (d_g, d_c, label), color in zip(thicknesses, colors):
    R = multilayer_reflectance(wavelengths, d_g, d_c)
    ax.plot(wavelengths, R, color=color, linewidth=2, label=f'd={d_g}nm ({label})')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('Iridophore Reflectance vs Platelet Thickness', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Peak wavelength vs platelet thickness (tuning curve)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
d_range = np.linspace(50, 200, 100)
peak_wavelengths = 2 * n_guanine * d_range  # first-order approximation
# Color each point by its wavelength
def wl_to_rgb(w):
    if 380 <= w < 440: return (-(w-440)/60, 0, 1)
    elif 440 <= w < 490: return (0, (w-440)/50, 1)
    elif 490 <= w < 510: return (0, 1, -(w-510)/20)
    elif 510 <= w < 580: return ((w-510)/70, 1, 0)
    elif 580 <= w < 645: return (1, -(w-645)/65, 0)
    elif 645 <= w <= 750: return (1, 0, 0)
    else: return (0.5, 0.5, 0.5)

for i in range(len(d_range)-1):
    color = wl_to_rgb(peak_wavelengths[i])
    ax2.plot(d_range[i:i+2], peak_wavelengths[i:i+2], color=color, linewidth=3)
ax2.axhspan(380, 750, alpha=0.08, color='white', label='Visible range')
ax2.set_xlabel('Guanine platelet thickness (nm)', color='white')
ax2.set_ylabel('Peak reflected wavelength (nm)', color='white')
ax2.set_title('Color Tuning: Thickness → Wavelength', color='white', fontsize=11)
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Angle-dependent iridescence
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
angles = np.linspace(0, 70, 8)  # viewing angles in degrees
d_g = 130  # nm
for angle in angles:
    cos_theta = np.cos(np.radians(angle))
    # Shift peak wavelength with angle
    shifted_peak = 2 * n_guanine * d_g * cos_theta
    R_shifted = np.exp(-0.5 * ((wavelengths - shifted_peak) / 30)**2)
    color = wl_to_rgb(shifted_peak)
    ax3.plot(wavelengths, R_shifted * 0.8 + angle/100, color=color, linewidth=2,
             label=f'{angle:.0f}° → {shifted_peak:.0f}nm')
ax3.set_xlabel('Wavelength (nm)', color='white')
ax3.set_ylabel('Reflectance (offset)', color='white')
ax3.set_title('Angle-Dependent Iridescence (d=130nm)', color='white', fontsize=11)
ax3.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Chromatophore pigment absorption spectra
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Simplified absorption spectra for fish pigments
melanin_abs = 1.0 * np.exp(-0.005 * (wavelengths - 350))  # broad UV/blue absorber
carotenoid_abs = np.exp(-0.5 * ((wavelengths - 450) / 40)**2)
pteridine_abs = np.exp(-0.5 * ((wavelengths - 380) / 35)**2)

ax4.plot(wavelengths, melanin_abs / melanin_abs.max(), color='#6b7280', linewidth=2,
         label='Melanin (melanophore)')
ax4.plot(wavelengths, carotenoid_abs, color='#f59e0b', linewidth=2,
         label='Carotenoid (xanthophore)')
ax4.plot(wavelengths, pteridine_abs, color='#a855f7', linewidth=2,
         label='Pteridine (xanthophore)')
ax4.fill_between(wavelengths, 0, melanin_abs / melanin_abs.max(), color='#6b7280', alpha=0.1)
ax4.set_xlabel('Wavelength (nm)', color='white')
ax4.set_ylabel('Relative absorption', color='white')
ax4.set_title('Fish Pigment Absorption Spectra', color='white', fontsize=11)
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fish Coloration Summary:")
print(f"{'Mechanism':<20} {'Cell type':<16} {'Colors produced'}")
print("-" * 55)
print(f"{'Pigment (chemical)':<20} {'Melanophore':<16} Black, brown")
print(f"{'Pigment (chemical)':<20} {'Xanthophore':<16} Yellow, orange, red")
print(f"{'Structural (physics)':<20} {'Iridophore':<16} Silver, blue, rainbow")
print()
print("Iridophore peak wavelength = 2 × n_guanine × d_platelet × cos(θ)")
print(f"  d=80nm → {2*1.83*80:.0f}nm (UV)")
print(f"  d=120nm → {2*1.83*120:.0f}nm (blue-violet)")
print(f"  d=150nm → {2*1.83*150:.0f}nm (green-yellow)")
print(f"  d=170nm → {2*1.83*170:.0f}nm (orange-red)")
print()
print("The rainbow fish shifts color by angle — pure thin-film physics.")`,
      challenge: 'Model a complete fish scale with both iridophore and chromatophore layers. Show how melanin underneath iridophores changes the perceived color — dark background enhances iridescent brightness (like dark paper behind a hologram).',
      successHint: 'Fish coloration is one of nature\'s most sophisticated optical systems, combining chemical pigments and physical nanostructures. The same thin-film interference physics that creates rainbow patterns on oil slicks and soap bubbles is precisely engineered at the nanoscale in fish iridophores.',
    },
    {
      title: 'Sexual selection in fish — why bright colors evolve',
      concept: `Darwin identified sexual selection as a force distinct from natural selection. In many fish species, males are far more colorful than females. This seems paradoxical — bright colors attract predators. Yet they persist because they attract mates even more effectively than they attract predators. Females preferentially mate with brightly colored males, creating a positive feedback loop that drives increasingly elaborate ornamentation.

Why would females prefer bright males? The "honest signal" hypothesis (Zahavi's handicap principle) proposes that costly ornaments — like bright colors that increase predation risk — are reliable indicators of male quality. Only genuinely fit males can survive despite the handicap, so bright coloration signals good genes, parasite resistance, and foraging ability. The carotenoid hypothesis adds specificity: red and orange pigments come from the diet (carotenoids cannot be synthesized by vertebrates), so intense red coloration proves a male is an efficient forager.

The guppy (Poecilia reticulata) is the textbook example. In high-predation streams, males are duller (natural selection wins). In low-predation streams, males are vibrantly colored (sexual selection wins). The balance between these opposing forces sets the equilibrium color for each population. This trade-off can be modeled mathematically as an optimization problem where fitness depends on both mating success and survival probability.`,
      analogy: 'Sexual selection is like a job interview where being overqualified is the qualification. Wearing an expensive suit (bright colors) to a dangerous neighborhood (predator-rich water) is costly and risky. But it signals to employers (females) that you are confident enough in your abilities to take that risk. Only truly capable candidates (fit males) can afford the handicap.',
      storyConnection: 'The rainbow fish of Umiam Lake is brilliantly colored — and that brilliance is not decorative but functional. In the relatively predator-sparse waters of the highland lake, sexual selection has pushed male coloration toward maximum spectral display. Each scale is a fitness advertisement. The rainbow is not just beauty; it is an evolutionary arms race between attracting mates and avoiding predators.',
      checkQuestion: 'In a lake where a new predator species is introduced, what would you predict happens to male fish coloration over 20 generations? Why?',
      checkAnswer: 'Male coloration would become duller over ~20 generations. Brightly colored males, previously successful at attracting mates, would now also attract predators and suffer higher mortality. Natural selection against conspicuousness would shift the optimum toward less flashy phenotypes. This is exactly what researchers have observed in guppy translocation experiments in Trinidad — evolutionary response within 15-20 generations.',
      codeIntro: 'Model the trade-off between sexual selection (favoring brightness) and natural selection (favoring camouflage) to find the evolutionary equilibrium.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Evolutionary model: color brightness trade-off
# Fitness = mating_success(brightness) × survival(brightness, predation)

def mating_success(brightness, female_preference=0.7):
    """Sigmoid function: females prefer brighter males."""
    return 1 / (1 + np.exp(-10 * (brightness - female_preference)))

def survival(brightness, predation_pressure):
    """Survival decreases with brightness, more so under high predation."""
    return np.exp(-predation_pressure * brightness**2)

def total_fitness(brightness, predation):
    return mating_success(brightness) * survival(brightness, predation)

brightness = np.linspace(0, 1, 200)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Fitness components and total fitness
ax = axes[0, 0]
ax.set_facecolor('#111827')
pred = 2.0  # moderate predation
ax.plot(brightness, mating_success(brightness), color='#ef4444', linewidth=2,
        label='Mating success', linestyle='--')
ax.plot(brightness, survival(brightness, pred), color='#3b82f6', linewidth=2,
        label='Survival', linestyle='--')
ax.plot(brightness, total_fitness(brightness, pred), color='#22c55e', linewidth=3,
        label='Total fitness')
opt_idx = np.argmax(total_fitness(brightness, pred))
ax.axvline(brightness[opt_idx], color='#fbbf24', linewidth=1.5, linestyle=':',
           label=f'Optimum = {brightness[opt_idx]:.2f}')
ax.plot(brightness[opt_idx], total_fitness(brightness, pred)[opt_idx], 'o',
        color='#fbbf24', markersize=10, zorder=5)
ax.set_xlabel('Color brightness (0=dull, 1=maximum)', color='white')
ax.set_ylabel('Fitness component', color='white')
ax.set_title('Sexual vs Natural Selection Trade-off', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Optimal brightness vs predation pressure
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
pred_levels = np.linspace(0.1, 8, 100)
optimal_brightness = np.zeros_like(pred_levels)
for i, p in enumerate(pred_levels):
    fitness = total_fitness(brightness, p)
    optimal_brightness[i] = brightness[np.argmax(fitness)]

ax2.plot(pred_levels, optimal_brightness, color='#f59e0b', linewidth=2.5)
ax2.fill_between(pred_levels, 0, optimal_brightness, color='#f59e0b', alpha=0.15)
ax2.set_xlabel('Predation pressure', color='white')
ax2.set_ylabel('Optimal male brightness', color='white')
ax2.set_title('Equilibrium Color vs Predation', color='white', fontsize=11)
ax2.tick_params(colors='gray')
# Mark scenarios
ax2.annotate('Umiam Lake\
(low predation)', xy=(0.5, optimal_brightness[5]),
            xytext=(2, 0.85), color='#22c55e', fontsize=9, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#22c55e'))
ax2.annotate('River\
(high predation)', xy=(6, optimal_brightness[75]),
            xytext=(5, 0.2), color='#ef4444', fontsize=9, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#ef4444'))

# Plot 3: Population evolution over generations
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
np.random.seed(42)
n_gen = 50
pop_size = 100

def evolve_population(predation, n_gen=50):
    """Simulate population evolution of brightness."""
    pop = np.random.normal(0.5, 0.15, pop_size)
    pop = np.clip(pop, 0, 1)
    mean_history = [pop.mean()]

    for gen in range(n_gen):
        # Fitness-based selection
        fitness = total_fitness(pop, predation)
        fitness /= fitness.sum()
        # Select parents
        parents = np.random.choice(pop, size=pop_size, p=fitness)
        # Reproduce with mutation
        pop = parents + np.random.normal(0, 0.03, pop_size)
        pop = np.clip(pop, 0, 1)
        mean_history.append(pop.mean())
    return mean_history

scenarios = [
    ('No predators', 0.2, '#22c55e'),
    ('Low predation (Umiam)', 1.5, '#3b82f6'),
    ('Moderate predation', 3.0, '#f59e0b'),
    ('High predation (river)', 6.0, '#ef4444'),
]
for label, pred, color in scenarios:
    history = evolve_population(pred)
    ax3.plot(range(n_gen + 1), history, color=color, linewidth=2, label=label)
ax3.set_xlabel('Generation', color='white')
ax3.set_ylabel('Mean population brightness', color='white')
ax3.set_title('Evolutionary Trajectories', color='white', fontsize=11)
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Carotenoid allocation model
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Males must allocate dietary carotenoids between immune function and coloration
carotenoid_to_color = np.linspace(0, 1, 100)
carotenoid_to_immune = 1 - carotenoid_to_color
color_display = carotenoid_to_color ** 0.5  # diminishing returns
immune_function = carotenoid_to_immune ** 0.5
# Parasite load affects both
parasite_fitness = immune_function * 0.5 + 0.5
mate_fitness = color_display
total = parasite_fitness * mate_fitness

ax4.plot(carotenoid_to_color * 100, color_display, color='#ef4444', linewidth=2,
         label='Color display', linestyle='--')
ax4.plot(carotenoid_to_color * 100, immune_function, color='#3b82f6', linewidth=2,
         label='Immune function', linestyle='--')
ax4.plot(carotenoid_to_color * 100, total, color='#22c55e', linewidth=3,
         label='Total fitness')
opt = np.argmax(total)
ax4.axvline(carotenoid_to_color[opt]*100, color='#fbbf24', linewidth=1.5, linestyle=':')
ax4.plot(carotenoid_to_color[opt]*100, total[opt], 'o', color='#fbbf24', markersize=10)
ax4.set_xlabel('% carotenoids allocated to coloration', color='white')
ax4.set_ylabel('Fitness', color='white')
ax4.set_title('Carotenoid Allocation Trade-off', color='white', fontsize=11)
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Sexual Selection Model Results:")
print(f"{'Predation Level':<25} {'Optimal brightness':>20}")
print("-" * 47)
for label, pred, _ in scenarios:
    opt = brightness[np.argmax(total_fitness(brightness, pred))]
    print(f"{label:<25} {opt:>18.2f}")
print()
print("Carotenoid allocation optimum: {:.0f}% to color, {:.0f}% to immunity".format(
    carotenoid_to_color[opt]*100, (1-carotenoid_to_color[opt])*100))
print()
print("Key insight: bright fish colors are honest signals of quality.")
print("Only healthy, well-fed males can 'afford' to be conspicuous.")
print("The rainbow fish's brilliance is a fitness badge, not just decoration.")`,
      challenge: 'Add female choice dynamics: model females that vary in their preference for brightness. Show how assortative mating (choosy females with bright males) accelerates the evolution of both traits — a Fisherian runaway process.',
      successHint: 'Sexual selection explains some of nature\'s most extravagant displays. The mathematical framework of fitness trade-offs shows that what appears wasteful actually contains deep information about individual quality. The rainbow fish\'s iridescence is evolution\'s quality certificate.',
    },
    {
      title: 'Lake limnology — thermal stratification and mixing in Umiam Lake',
      concept: `Lakes are not uniform bodies of water — they are stratified. In summer, the sun heats the surface layer (epilimnion), making it warm and buoyant. Below lies the thermocline (metalimnion), where temperature drops rapidly with depth. The bottom layer (hypolimnion) stays cold year-round. This thermal stratification has profound effects on water chemistry and biology.

Water has a unique density property: it is densest at 3.98°C (not at 0°C). This means warm surface water floats on cold deep water, preventing mixing. The density difference creates a stable barrier — the thermocline — that can persist for months. Nutrients accumulate in the hypolimnion (released from decomposing sediment), while light and warmth are concentrated in the epilimnion. Phytoplankton need both nutrients and light, so their peak productivity often occurs at the thermocline where these gradients overlap.

In temperate and subtropical lakes like Umiam, seasonal turnover occurs when surface cooling eliminates the density gradient. The entire water column mixes (holomixis), redistributing oxygen downward and nutrients upward. Umiam Lake (elevation 1000m) experiences monomictic mixing — one major turnover in winter when surface temperatures drop below the hypolimnion temperature. Understanding stratification is essential for predicting where fish live, how nutrients cycle, and where oxygen depletion occurs.`,
      analogy: 'Lake stratification is like a layered cocktail. The dense, sweet syrup sinks to the bottom (cold hypolimnion), the lighter juice sits in the middle (thermocline), and the lightest layer floats on top (warm epilimnion). You can carefully pour layers without mixing because of density differences. But if you shake the glass (wind mixing), everything blends — that is seasonal turnover.',
      storyConnection: 'The rainbow fish of Umiam Lake lives in a thermally stratified world. During summer, warm surface waters hold less oxygen but have abundant food (algae). The cool depths hold more oxygen but less food. Fish must navigate these invisible layers, choosing their depth based on the trade-off between temperature, oxygen, and food availability. The lake is not one habitat but a vertical stack of microhabitats.',
      checkQuestion: 'In summer, Umiam Lake surface is 25°C and the bottom is 8°C. Which layer holds more dissolved oxygen and why? Where would you expect to find the most fish?',
      checkAnswer: 'The hypolimnion (8°C) has a higher oxygen saturation capacity (~11.8 mg/L vs ~8.1 mg/L at 25°C). However, if the lake has been stratified for months, hypolimnetic oxygen may be depleted by decomposition of sinking organic matter, while the epilimnion gets continual reaeration from the atmosphere. Fish would concentrate near the thermocline — warm enough for metabolic activity, with adequate oxygen, and close to nutrient-rich water that supports prey. This thermocline zone is the "Goldilocks layer."',
      codeIntro: 'Model the thermal structure of Umiam Lake through seasons and simulate how fish distribute themselves across depth based on temperature and oxygen.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Umiam Lake thermal stratification model
depths = np.linspace(0, 30, 100)  # meters

def temperature_profile(depth, month):
    """Seasonal temperature profile for a monomictic subtropical lake."""
    # Surface temperature varies seasonally
    surface_temp = 18 + 10 * np.sin(2 * np.pi * (month - 3) / 12)
    bottom_temp = 10  # relatively stable

    if month in [11, 12, 1, 2]:  # winter mixing
        # Nearly uniform (mixed)
        return bottom_temp + (surface_temp - bottom_temp) * np.exp(-depth / 50)
    else:
        # Stratified: thermocline at ~8-12m
        thermocline_depth = 8 + 2 * np.sin(2 * np.pi * (month - 4) / 12)
        thermocline_width = 3
        return bottom_temp + (surface_temp - bottom_temp) / (1 + np.exp((depth - thermocline_depth) / thermocline_width))

def DO_profile(depth, month, temp_profile):
    """DO depends on temperature and stratification duration."""
    # Saturation DO decreases with temperature
    DO_sat = 14.6 - 0.39 * temp_profile + 0.007 * temp_profile**2
    if month in [11, 12, 1, 2]:
        return DO_sat * 0.9  # well-mixed, near saturation
    else:
        # Stratified: surface near saturation, bottom depleted
        months_stratified = min(month - 3, 7) if month > 3 else 0
        depletion = 1 - 0.08 * months_stratified * np.exp(depth / 15)
        return np.clip(DO_sat * depletion, 0.5, DO_sat.max())

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Seasonal temperature profiles
ax = axes[0, 0]
ax.set_facecolor('#111827')
month_names = {1:'Jan',4:'Apr',7:'Jul',10:'Oct'}
colors_m = {'Jan':'#3b82f6','Apr':'#22c55e','Jul':'#ef4444','Oct':'#f59e0b'}
for month, name in month_names.items():
    temp = temperature_profile(depths, month)
    ax.plot(temp, depths, color=colors_m[name], linewidth=2.5, label=name)
ax.invert_yaxis()
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Depth (m)', color='white')
ax.set_title('Umiam Lake Thermal Stratification', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
# Label layers for summer
ax.annotate('Epilimnion', xy=(24, 3), color='#ef4444', fontsize=9, fontweight='bold')
ax.annotate('Thermocline', xy=(18, 9), color='#f59e0b', fontsize=9, fontweight='bold')
ax.annotate('Hypolimnion', xy=(12, 22), color='#3b82f6', fontsize=9, fontweight='bold')

# Plot 2: Temperature-depth heatmap through year
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
months = np.arange(1, 13)
temp_grid = np.zeros((len(depths), 12))
for i, m in enumerate(months):
    temp_grid[:, i] = temperature_profile(depths, m)
im = ax2.imshow(temp_grid, aspect='auto', cmap='RdYlBu_r',
                extent=[0.5, 12.5, 30, 0], interpolation='bilinear')
plt.colorbar(im, ax=ax2, label='Temperature (°C)')
ax2.set_xlabel('Month', color='white')
ax2.set_ylabel('Depth (m)', color='white')
ax2.set_xticks(months)
ax2.set_xticklabels(['J','F','M','A','M','J','J','A','S','O','N','D'])
ax2.set_title('Annual Temperature Structure', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# Plot 3: DO profiles — summer vs winter
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
for month, name in [(1, 'January (mixed)'), (7, 'July (stratified)')]:
    temp = temperature_profile(depths, month)
    do = DO_profile(depths, month, temp)
    color = '#3b82f6' if month == 1 else '#ef4444'
    ax3.plot(do, depths, color=color, linewidth=2.5, label=name)
ax3.axvline(5, color='#f59e0b', linewidth=1, linestyle='--', label='Fish stress (5 mg/L)')
ax3.axvline(2, color='#ef4444', linewidth=1, linestyle='--', label='Hypoxia (2 mg/L)')
ax3.invert_yaxis()
ax3.set_xlabel('Dissolved Oxygen (mg/L)', color='white')
ax3.set_ylabel('Depth (m)', color='white')
ax3.set_title('DO Profiles: Mixed vs Stratified', color='white', fontsize=11)
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Fish habitat suitability (temperature × DO)
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
temp_july = temperature_profile(depths, 7)
do_july = DO_profile(depths, 7, temp_july)
# Suitability = f(temp_preference) × f(DO_requirement)
# Rainbow fish: prefer 18-24°C, need DO > 5
temp_suit = np.exp(-0.5 * ((temp_july - 21) / 4)**2)
do_suit = 1 / (1 + np.exp(-2 * (do_july - 5)))
total_suit = temp_suit * do_suit

ax4.fill_betweenx(depths, 0, temp_suit, alpha=0.3, color='#ef4444', label='Temp suitability')
ax4.fill_betweenx(depths, 0, do_suit, alpha=0.3, color='#3b82f6', label='DO suitability')
ax4.plot(total_suit, depths, color='#22c55e', linewidth=3, label='Combined habitat')
optimal_depth = depths[np.argmax(total_suit)]
ax4.axhline(optimal_depth, color='#fbbf24', linewidth=1.5, linestyle=':')
ax4.annotate(f'Optimal: {optimal_depth:.0f}m', xy=(0.8, optimal_depth),
            xytext=(0.6, optimal_depth + 5), color='#fbbf24', fontsize=10,
            fontweight='bold', arrowprops=dict(arrowstyle='->', color='#fbbf24'))
ax4.invert_yaxis()
ax4.set_xlabel('Habitat suitability (0-1)', color='white')
ax4.set_ylabel('Depth (m)', color='white')
ax4.set_title('Fish Habitat Suitability (July)', color='white', fontsize=11)
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Umiam Lake Limnology Summary:")
print(f"  Lake type: Monomictic (one mixing period in winter)")
print(f"  Maximum depth: ~30m")
print(f"  Summer surface temp: ~28°C, Bottom temp: ~10°C")
print(f"  Thermocline depth: ~8-12m")
print(f"\
Fish habitat analysis (July):")
print(f"  Optimal depth for rainbow fish: {optimal_depth:.0f}m")
print(f"  Temperature there: {temp_july[np.argmax(total_suit)]:.1f}°C")
print(f"  DO there: {do_july[np.argmax(total_suit)]:.1f} mg/L")
print(f"\
The thermocline zone is the 'Goldilocks layer' —")
print(f"warm enough for metabolism, oxygen-rich enough for survival.")`,
      challenge: 'Model the effect of climate warming: increase surface temperature by 2°C and show how a deeper, stronger thermocline reduces the habitable zone for cold-water fish species. Calculate the volume of suitable habitat lost.',
      successHint: 'Lake stratification creates invisible but profound boundaries in aquatic ecosystems. Understanding the vertical structure of temperature and oxygen is essential for fisheries management, water supply planning, and predicting how lakes respond to climate change.',
    },
    {
      title: 'Freshwater biodiversity and invasive species impact',
      concept: `Freshwater ecosystems cover less than 1% of Earth\'s surface but harbor nearly 10% of all known species — an extraordinary concentration of biodiversity. Northeast India is a freshwater biodiversity hotspot, with Umiam Lake supporting endemic fish, crustacean, and mollusk species found nowhere else on Earth. This diversity is maintained by habitat heterogeneity (depth zones, substrates, vegetation types), stable environmental conditions, and geographic isolation.

Invasive species are the second greatest threat to freshwater biodiversity (after habitat loss). An invasive species is one introduced outside its native range that causes ecological or economic harm. Common pathways include aquaculture escapes, ornamental fish releases, ballast water discharge, and deliberate stocking for sport fishing. Invasive fish like tilapia, common carp, and African catfish have devastated native freshwater communities across Asia.

The impact of invasives follows predictable patterns. Phase 1: Introduction and establishment — the invader finds a niche. Phase 2: Population expansion — with no natural predators or pathogens, the population grows exponentially. Phase 3: Ecological impact — competition, predation, habitat modification, and disease transmission reduce native species. Phase 4: New equilibrium — native community is permanently altered. The competitive exclusion principle (Gause's Law) predicts that two species competing for the exact same niche cannot coexist indefinitely — one will drive the other to local extinction.`,
      analogy: 'An invasive species in a lake is like a new student transferring to a small school who is bigger, eats more, and has no social constraints. They take resources from existing students (native species), break established social structures (food webs), and because nobody knows how to deal with them (no co-evolved predators), they dominate until the school (ecosystem) is fundamentally changed.',
      storyConnection: 'The rainbow fish of Umiam Lake is part of a unique freshwater community shaped by millions of years of isolation in the Khasi Hills. When non-native species are introduced — whether for aquaculture or accidentally — they threaten this irreplaceable diversity. The story\'s rainbow fish is not just one species; it represents an entire community of endemic freshwater life that exists nowhere else.',
      checkQuestion: 'Invasive tilapia are introduced to Umiam Lake. They reproduce faster than native fish, tolerate lower water quality, and eat the same algae and invertebrates. Using the competitive exclusion principle, predict the outcome for native herbivorous fish.',
      checkAnswer: 'The competitive exclusion principle predicts that tilapia will outcompete native herbivores for shared resources. Tilapia\'s advantages — faster reproduction, broader diet, and tolerance of degraded conditions — mean they capture more resources per individual. Over time, native herbivores will decline to local extinction unless they can partition the niche (e.g., feeding at different depths or on different food items) or unless tilapia are controlled. In practice, tilapia invasions have reduced native fish diversity by 30-70% in Asian lakes.',
      codeIntro: 'Model the population dynamics of native vs invasive species using Lotka-Volterra competition equations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Lotka-Volterra competition model
# dN1/dt = r1*N1*(1 - (N1 + alpha12*N2)/K1)
# dN2/dt = r2*N2*(1 - (N2 + alpha21*N1)/K2)

def lotka_volterra_competition(N1_0, N2_0, r1, r2, K1, K2, alpha12, alpha21, T=200, dt=0.1):
    """Simulate two-species competition."""
    steps = int(T / dt)
    N1 = np.zeros(steps); N2 = np.zeros(steps)
    N1[0] = N1_0; N2[0] = N2_0
    for t in range(1, steps):
        dN1 = r1 * N1[t-1] * (1 - (N1[t-1] + alpha12 * N2[t-1]) / K1) * dt
        dN2 = r2 * N2[t-1] * (1 - (N2[t-1] + alpha21 * N1[t-1]) / K2) * dt
        N1[t] = max(N1[t-1] + dN1, 0)
        N2[t] = max(N2[t-1] + dN2, 0)
    time = np.linspace(0, T, steps)
    return time, N1, N2

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Scenario 1: Invasive tilapia vs native herbivore
ax = axes[0, 0]
ax.set_facecolor('#111827')
# Native fish: lower r, lower K (specialist)
# Tilapia: higher r, higher K (generalist), strong competitor
t, native, tilapia = lotka_volterra_competition(
    N1_0=500, N2_0=10,  # tilapia starts rare
    r1=0.1, r2=0.25,     # tilapia reproduces faster
    K1=1000, K2=1500,    # tilapia has higher carrying capacity
    alpha12=1.5, alpha21=0.6,  # tilapia impacts native more than reverse
    T=100
)
ax.plot(t, native, color='#3b82f6', linewidth=2.5, label='Native herbivore')
ax.plot(t, tilapia, color='#ef4444', linewidth=2.5, label='Invasive tilapia')
ax.set_xlabel('Time (years)', color='white')
ax.set_ylabel('Population', color='white')
ax.set_title('Invasive Tilapia vs Native Fish', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Scenario 2: Phase portrait (isoclines)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
r1, r2 = 0.1, 0.25
K1, K2 = 1000, 1500
a12, a21 = 1.5, 0.6
# N1 isocline: N1 + alpha12*N2 = K1 → N2 = (K1 - N1)/alpha12
# N2 isocline: N2 + alpha21*N1 = K2 → N2 = K2 - alpha21*N1
N1_range = np.linspace(0, 1200, 100)
N2_iso1 = (K1 - N1_range) / a12
N2_iso2 = K2 - a21 * N1_range
ax2.plot(N1_range, np.clip(N2_iso1, 0, 2000), color='#3b82f6', linewidth=2,
         label='Native isocline')
ax2.plot(N1_range, np.clip(N2_iso2, 0, 2000), color='#ef4444', linewidth=2,
         label='Tilapia isocline')
# Plot trajectory
ax2.plot(native, tilapia, color='#22c55e', linewidth=1.5, alpha=0.7)
ax2.plot(native[0], tilapia[0], 'o', color='#22c55e', markersize=8, label='Start')
ax2.plot(native[-1], tilapia[-1], 's', color='#fbbf24', markersize=10, label='End')
ax2.set_xlabel('Native population', color='white')
ax2.set_ylabel('Tilapia population', color='white')
ax2.set_title('Phase Portrait & Isoclines', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 1200); ax2.set_ylim(0, 1800)

# Scenario 3: Multi-species community impact
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Simulate 5 native species + 1 invasive
np.random.seed(42)
n_species = 5
years = 100
native_pops = np.zeros((n_species, int(years / 0.1)))
invasive_pop = np.zeros(int(years / 0.1))
invasive_pop[0] = 5
for i in range(n_species):
    native_pops[i, 0] = 200 + np.random.randint(-50, 50)

# Simple community model
for t in range(1, native_pops.shape[1]):
    dt = 0.1
    inv_effect = 0.001 * invasive_pop[t-1]
    for i in range(n_species):
        r = 0.08 + 0.02 * i
        K = 300 + 50 * i
        dN = r * native_pops[i, t-1] * (1 - native_pops[i, t-1]/K - inv_effect) * dt
        native_pops[i, t] = max(native_pops[i, t-1] + dN, 0)
    # Invasive grows
    total_native = native_pops[:, t-1].sum()
    r_inv = 0.2
    K_inv = 2000
    dI = r_inv * invasive_pop[t-1] * (1 - invasive_pop[t-1]/K_inv) * dt
    invasive_pop[t] = max(invasive_pop[t-1] + dI, 0)

time_arr = np.linspace(0, years, native_pops.shape[1])
species_names = ['Sp. A (endemic)', 'Sp. B', 'Sp. C', 'Sp. D', 'Sp. E']
native_colors = ['#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b', '#06b6d4']
for i in range(n_species):
    ax3.plot(time_arr, native_pops[i], color=native_colors[i], linewidth=1.5,
             label=species_names[i])
ax3.plot(time_arr, invasive_pop, color='#ef4444', linewidth=2.5,
         label='Invasive', linestyle='--')
ax3.set_xlabel('Time (years)', color='white')
ax3.set_ylabel('Population', color='white')
ax3.set_title('Community-Level Invasion Impact', color='white', fontsize=11)
ax3.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Species loss over time
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Count species above threshold at each time
threshold = 10
richness = np.zeros(native_pops.shape[1])
for t in range(native_pops.shape[1]):
    richness[t] = np.sum(native_pops[:, t] > threshold)
ax4.plot(time_arr, richness, color='#3b82f6', linewidth=2.5, label='Native species richness')
ax4.plot(time_arr, np.ones_like(time_arr) * (invasive_pop > threshold).astype(float),
         color='#ef4444', linewidth=2, linestyle='--', label='Invasive present')
ax4.set_xlabel('Time (years)', color='white')
ax4.set_ylabel('Species count', color='white')
ax4.set_title('Biodiversity Loss Timeline', color='white', fontsize=11)
ax4.set_ylim(-0.5, 6.5)
ax4.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Invasion Impact Summary:")
print(f"  Initial native species: {n_species}")
final_surviving = sum(1 for i in range(n_species) if native_pops[i, -1] > threshold)
print(f"  Surviving after {years} years: {final_surviving}")
print(f"  Species lost: {n_species - final_surviving}")
print(f"  Invasive final population: {invasive_pop[-1]:.0f}")
print()
print("Competitive exclusion conditions:")
print(f"  K1/alpha12 < K2 AND K2/alpha21 > K1")
print(f"  → {K1}/{a12:.1f} = {K1/a12:.0f} < {K2} AND {K2}/{a21:.1f} = {K2/a21:.0f} > {K1}")
print(f"  → {K1/a12 < K2} AND {K2/a21 > K1} → Tilapia wins")
print()
print("Umiam Lake's endemic fish face existential threat from invasives.")
print("Once lost, endemic species cannot be replaced — they exist nowhere else.")`,
      challenge: 'Add a management intervention: model the effect of removing 50% of the invasive population annually starting at year 30. What removal rate is needed to allow native species to recover? Find the critical threshold.',
      successHint: 'The Lotka-Volterra competition equations reveal why invasive species are so devastating: even small advantages in growth rate or competitive ability can lead to complete exclusion of native species over ecological timescales. Prevention is far more effective than eradication.',
    },
    {
      title: 'Environmental DNA (eDNA) sampling — detecting species from water',
      concept: `Every organism sheds DNA into its environment — through skin cells, mucus, feces, gametes, and decomposing tissue. This environmental DNA (eDNA) can be collected from water samples and analyzed to detect which species are present without ever seeing or capturing them. A single liter of lake water contains DNA from dozens of fish, amphibian, and invertebrate species.

The eDNA workflow has four steps. Step 1: Field sampling — collect water in sterile bottles, typically 1-2 liters from multiple locations. Step 2: Filtration — pass water through fine membrane filters (0.2-0.45 μm pore size) to capture DNA fragments. Step 3: DNA extraction and amplification — extract DNA from the filter and use PCR (polymerase chain reaction) to amplify a target gene region. For fish, the 12S ribosomal RNA gene is commonly used. For broader surveys, the COI (cytochrome oxidase I) "barcode" gene works across many animal groups. Step 4: Sequencing and identification — compare amplified sequences against reference databases (GenBank, BOLD) to identify species.

Metabarcoding uses universal primers that amplify the target gene from ALL species simultaneously, followed by high-throughput sequencing. A single water sample processed through metabarcoding can detect 50+ species in one analysis — far more than traditional fish surveys using nets, which are destructive, labor-intensive, and biased toward certain species. eDNA detection probability depends on species abundance, water flow, temperature (DNA degrades faster in warm water), and UV exposure. The detection half-life of eDNA in freshwater is typically 1-7 days.`,
      analogy: 'eDNA sampling is like reading footprints in the snow to know which animals passed through, without ever seeing them. Every organism leaves a molecular footprint in the water — tiny fragments of its genetic code. PCR is like a photocopier that makes billions of copies of each footprint so they are large enough to read. Sequencing is like matching each footprint pattern to an identification guide.',
      storyConnection: 'To monitor the rainbow fish and all other species in Umiam Lake, scientists no longer need to catch them. A water sample from the lake contains DNA traces of every fish swimming in it — including rare endemic species that nets might miss. eDNA could detect the rainbow fish\'s presence across different parts of the lake, mapping its distribution without disturbing a single scale.',
      checkQuestion: 'You collect a 1-liter water sample from Umiam Lake. eDNA analysis detects DNA of Species X, which was thought to be locally extinct. What can you conclude, and what can you NOT conclude?',
      checkAnswer: 'You CAN conclude that Species X DNA is present in the water, indicating the species was recently present in the area (within the DNA half-life of ~1-7 days). You CANNOT conclude: (1) how many individuals are present (eDNA is semi-quantitative at best), (2) whether they are alive or dead (DNA from a dead individual persists), (3) whether they are reproducing (DNA does not indicate population viability), (4) the exact location of the animal (DNA can be transported by currents). eDNA is a powerful presence/absence tool but not a census.',
      codeIntro: 'Model eDNA dynamics in a lake: DNA release rates, degradation kinetics, transport, and detection probability. Simulate a multi-species metabarcoding survey.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# eDNA dynamics model
# dC/dt = R * N - k * C - D * C
# C = eDNA concentration, R = release rate per individual,
# N = population size, k = degradation rate, D = dilution/transport

def edna_concentration(N, R, k, D, t):
    """Steady-state and dynamic eDNA concentration."""
    # Steady state: C_ss = R*N / (k + D)
    C_ss = R * N / (k + D)
    # Dynamic: C(t) = C_ss * (1 - exp(-(k+D)*t))
    return C_ss * (1 - np.exp(-(k + D) * t))

# Parameters
R_fish = 1e-6       # DNA copies/individual/hour (relative units)
k_base = 0.03       # degradation rate (/hour) at 20°C
D = 0.01            # dilution rate (/hour)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: eDNA accumulation for different population sizes
ax = axes[0, 0]
ax.set_facecolor('#111827')
t = np.linspace(0, 200, 500)  # hours
pop_sizes = [10, 50, 200, 1000, 5000]
colors_p = ['#818cf8', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
for N, color in zip(pop_sizes, colors_p):
    C = edna_concentration(N, R_fish, k_base, D, t)
    ax.plot(t, C, color=color, linewidth=2, label=f'N = {N:,}')
ax.axhline(0.1, color='#fbbf24', linewidth=1, linestyle='--', label='Detection limit')
ax.set_xlabel('Hours after species enters area', color='white')
ax.set_ylabel('eDNA concentration (relative)', color='white')
ax.set_title('eDNA Accumulation by Population Size', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: eDNA decay after species leaves
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
t_decay = np.linspace(0, 168, 500)  # hours (1 week)
temps = [5, 15, 25, 35]
temp_colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
C0 = 1.0  # initial concentration
for T_water, color in zip(temps, temp_colors):
    # Degradation rate increases with temperature (Q10 rule)
    k_T = k_base * 2**((T_water - 20) / 10)
    C_decay = C0 * np.exp(-k_T * t_decay)
    half_life = np.log(2) / k_T
    ax2.plot(t_decay, C_decay, color=color, linewidth=2,
             label=f'{T_water}°C (t½={half_life:.0f}h)')
ax2.axhline(0.1, color='#fbbf24', linewidth=1, linestyle='--', label='Detection limit')
ax2.set_xlabel('Hours after species leaves', color='white')
ax2.set_ylabel('eDNA remaining (relative)', color='white')
ax2.set_title('eDNA Decay vs Temperature', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Simulated metabarcoding results
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
np.random.seed(42)
species = [
    'Rainbow barb', 'Mahseer', 'Stone loach', 'Hill trout', 'Puntius sp.',
    'Danio sp.', 'Mystus catfish', 'Channa snakehead', 'Garra sp.',
    'Tilapia (invasive)', 'Eel', 'Crab (decapod)',
]
# Simulated read counts (proportional to abundance + noise)
abundances = [500, 50, 300, 30, 800, 600, 100, 80, 200, 1200, 20, 150]
read_counts = np.array([max(int(a * np.random.lognormal(0, 0.5) * 10), 0) for a in abundances])
sorted_idx = np.argsort(read_counts)[::-1]

bar_colors = ['#ef4444' if 'invasive' in species[i] else '#3b82f6' for i in sorted_idx]
ax3.barh(range(len(species)), read_counts[sorted_idx], color=bar_colors, alpha=0.8,
         edgecolor='white', linewidth=0.5)
ax3.set_yticks(range(len(species)))
ax3.set_yticklabels([species[i] for i in sorted_idx], fontsize=9)
ax3.set_xlabel('Sequence read count', color='white')
ax3.set_title('eDNA Metabarcoding — Species Detected', color='white', fontsize=11)
ax3.tick_params(colors='gray')
ax3.invert_yaxis()

# Plot 4: Detection probability vs sampling effort
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
n_samples = np.arange(1, 21)
# Detection probability increases with samples (1 - (1-p)^n)
detection_probs = {
    'Common (p=0.8)': 0.8,
    'Moderate (p=0.4)': 0.4,
    'Rare (p=0.1)': 0.1,
    'Very rare (p=0.02)': 0.02,
}
dp_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
for (label, p), color in zip(detection_probs.items(), dp_colors):
    prob_detect = 1 - (1 - p)**n_samples
    ax4.plot(n_samples, prob_detect * 100, 'o-', color=color, linewidth=2,
             label=label, markersize=4)
ax4.axhline(95, color='#fbbf24', linewidth=1, linestyle='--', label='95% confidence')
ax4.set_xlabel('Number of water samples', color='white')
ax4.set_ylabel('Cumulative detection probability (%)', color='white')
ax4.set_title('Sampling Effort vs Detection Probability', color='white', fontsize=11)
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("eDNA Survey Simulation — Umiam Lake:")
print(f"  Species detected: {len(species)}")
print(f"  Total sequence reads: {read_counts.sum():,}")
print(f"  Invasive species found: {'Yes — Tilapia dominates reads' if any('invasive' in s for s in species) else 'No'}")
print()
print("Detection probability (95% confidence):")
for label, p in detection_probs.items():
    n_needed = int(np.ceil(np.log(0.05) / np.log(1 - p)))
    print(f"  {label}: need {n_needed} samples")
print()
print("eDNA half-life by temperature:")
for T in [5, 15, 25, 35]:
    k_T = k_base * 2**((T - 20) / 10)
    hl = np.log(2) / k_T
    print(f"  {T}°C: {hl:.0f} hours ({hl/24:.1f} days)")
print()
print("eDNA transforms biodiversity monitoring —")
print("one liter of water tells you more than days of netting.")`,
      challenge: 'Design an optimal eDNA sampling strategy for Umiam Lake. Given a budget for 20 water samples, decide how to distribute them across 5 sites and 4 seasons to maximize the probability of detecting all species, including rare endemics. Use the detection probability model to optimize allocation.',
      successHint: 'eDNA is revolutionizing aquatic ecology. It is non-invasive, comprehensive, and increasingly affordable. For lakes like Umiam that harbor rare endemic species, eDNA provides the best tool for monitoring biodiversity without disturbing the ecosystem. The future of fish surveys is in a water bottle, not a fishing net.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (freshwater ecology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for limnology, population dynamics, and eDNA simulations. Click to start.</p>
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
