import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MishingFishLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Traditional fishing technology — nets, traps, and ingenuity',
      concept: `The Mishing people of Assam are one of the great river-dwelling communities of the world. Living along the Brahmaputra and its tributaries, they developed sophisticated fishing technologies over centuries:

- **Jakoi**: a conical bamboo trap placed in shallow water. Fish swim in through the wide end and cannot find the narrow exit. This exploits fish behavior — they follow current into funnels but cannot navigate backwards.
- **Polo**: a cylindrical bamboo basket pushed into muddy water. Fish are trapped as the polo is pressed into the sediment.
- **Juluki**: a large net suspended between two bamboo poles, operated by two people wading in water.
- **Chapa**: a flat net thrown from shore in a circular motion (cast net). Physics of projectile motion determines the spread.

Each tool is engineered for a specific water depth, current speed, and target species. The Mishing fisherman reads the river — water color, current speed, temperature, time of day — to choose the right tool.

These are not primitive methods. They are optimized technologies refined over generations, using locally available materials with zero environmental footprint.`,
      analogy: 'Traditional fishing tools are like specialized surgical instruments. A surgeon does not use a scalpel for everything — there are forceps, retractors, clamps, each designed for a specific task. Similarly, a Mishing fisherman has a toolkit of nets, traps, and baskets, each optimized for specific conditions. The "operating room" is the river.',
      storyConnection: 'The Mishing people in the story did not just fish — they understood the river. Their technology was born from intimate knowledge of fish behavior, water dynamics, and seasonal patterns. Every tool encoded generations of empirical science.',
      checkQuestion: 'Why is the jakoi (conical trap) wider at the entrance and narrower at the back?',
      checkAnswer: 'Fish follow current flow, which naturally funnels into the narrowing cone. Once inside, the narrow space prevents them from turning around (most fish cannot swim backwards efficiently). The cone shape exploits two things: hydrodynamic flow patterns that guide fish in, and the biomechanical limitation that fish cannot reverse. This is identical in principle to modern lobster traps and eel fyke nets.',
      codeIntro: 'Model the physics of cast net deployment — projectile motion and spread.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cast net physics
# When thrown, the net follows projectile motion
# Lead weights on the edge spread the net into a circle

g = 9.81  # m/s²
v0 = 8.0  # initial throw speed (m/s)
angle = 30  # launch angle (degrees)
theta = np.radians(angle)

# Time of flight
t_flight = 2 * v0 * np.sin(theta) / g
t = np.linspace(0, t_flight, 100)

# Center of mass trajectory
x_cm = v0 * np.cos(theta) * t
y_cm = v0 * np.sin(theta) * t - 0.5 * g * t**2

# Net spread (weights spread outward due to centrifugal effect)
# Diameter increases with time
net_radius = np.linspace(0, 2.5, len(t))  # meters, net opens during flight

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Trajectory
ax1.set_facecolor('#111827')
ax1.plot(x_cm, y_cm, color='#f59e0b', linewidth=2, label='Net center of mass')
ax1.fill_between(x_cm, y_cm - net_radius * 0.3, y_cm + net_radius * 0.3,
                alpha=0.2, color='#22c55e', label='Net spread')

# Show net at different times
for i in [20, 50, 80]:
    circle = plt.Circle((x_cm[i], y_cm[i]), net_radius[i] * 0.3,
                        fill=False, color='#22c55e', linewidth=1, alpha=0.5)
    ax1.add_patch(circle)

ax1.axhline(0, color='#3b82f6', linewidth=2, alpha=0.3)
ax1.fill_between(x_cm, -0.5, 0, color='#3b82f6', alpha=0.1)
ax1.set_xlabel('Distance (m)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title('Cast Net Trajectory', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.set_ylim(-0.5, 3)
ax1.set_aspect('equal')

# Net coverage vs throw parameters
angles = np.arange(10, 60, 5)
speeds = np.array([5, 8, 10, 12])
colors_v = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

ax2.set_facecolor('#111827')
for v, color in zip(speeds, colors_v):
    ranges = v**2 * np.sin(2 * np.radians(angles)) / g
    ax2.plot(angles, ranges, 'o-', color=color, linewidth=2, label=f'v₀ = {v} m/s')

ax2.set_xlabel('Launch angle (degrees)', color='white')
ax2.set_ylabel('Throw distance (m)', color='white')
ax2.set_title('Distance vs Angle for Different Throw Speeds', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Optimal throw angle: 45° (maximizes range)")
print(f"At v₀={v0} m/s, angle={angle}°:")
print(f"  Range: {x_cm[-1]:.1f} m")
print(f"  Max height: {y_cm.max():.1f} m")
print(f"  Time of flight: {t_flight:.2f} s")
print(f"  Net spread at landing: ~{net_radius[-1]:.1f} m diameter")`,
      challenge: 'The optimal angle for maximum range is 45°. But Mishing fishermen often throw at 20-30°. Why might a lower angle be better in practice? (Hint: think about when the net hits the water vs. when it fully opens.)',
      successHint: 'Cast net throwing is applied physics — projectile motion, angular momentum, and aerodynamics combined with muscle memory. The best fishermen are intuitive physicists.',
    },
    {
      title: 'Fish behavior — why fish are where they are',
      concept: `Successful fishing requires understanding why fish occupy specific locations. Fish distribution is governed by:

- **Dissolved oxygen**: fish need O₂. Fast-moving water has more. Fish congregate near rapids, inflows, and vegetation.
- **Temperature**: fish are ectotherms (body temperature = water temperature). Each species has an optimal range.
- **Current speed**: different species are adapted to different flow speeds. Mahseer thrive in rapids; catfish prefer still pools.
- **Light levels**: predator fish hunt at dawn/dusk (crepuscular) when prey visibility is reduced.
- **Structure**: fish hide near rocks, fallen trees, and vegetation to avoid predators and ambush prey.

The Mishing fisherman knows:
- Early morning: fish near the surface (cooler, more O₂)
- Monsoon: fish spread into flooded plains (spawning migration)
- Winter: fish concentrate in deep pools (warmest water)
- New moon: fish are more active (less light = more confident prey movement)

This is empirical ecology — knowledge built from generations of observation, identical in principle to modern fisheries science.`,
      analogy: 'Fish in a river are like customers in a shopping mall. They congregate where conditions are best: near the food court (abundant prey), in comfortable temperatures (air conditioning), with easy access (corridors = current lanes). A good fisherman, like a good retailer, knows exactly where the "customers" will be at any given time.',
      storyConnection: 'The Mishing fishermen in the story seemed to know where fish would be before they arrived. This was not magic — it was pattern recognition built over lifetimes of observation. Where science uses instruments, traditional knowledge uses experience. The conclusions are often the same.',
      checkQuestion: 'During monsoon floods, fish leave the river channel and swim into flooded rice paddies. Why is this advantageous for the fish?',
      checkAnswer: 'Flooded paddies provide: (1) abundant food (insects, worms, rice plant detritus), (2) warm, shallow water ideal for spawning, (3) refuge from large predators (too shallow for big fish), and (4) nursery habitat for fry (young fish can hide among rice stalks). This is why the Mishing traditionally welcome floods — they bring fish to the fields, which is also how fish naturally fertilize rice paddies.',
      codeIntro: 'Model fish distribution based on environmental variables in a river cross-section.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# River cross-section: model fish distribution
# based on depth, current speed, and dissolved oxygen

width = np.linspace(0, 50, 200)  # river width in meters

# River profile (cross-section depth)
depth = 4 * np.exp(-((width - 25)/12)**2) + 0.5  # deepest at center

# Current speed (fastest at center surface, slow at edges)
current = 1.5 * np.exp(-((width - 25)/15)**2) * (1 - 0.3 * np.random.random(len(width)))

# Dissolved oxygen (higher near surface and edges where mixing occurs)
DO = 7 + 2 * (1 - depth/depth.max()) + np.random.normal(0, 0.3, len(width))

# Fish habitat suitability (combine factors)
# Mahseer: likes moderate depth (2-3m), good current, high DO
mahseer = np.exp(-((depth - 2.5)/1.0)**2) * np.exp(-((current - 1.0)/0.5)**2) * (DO/10)
mahseer = mahseer / mahseer.max()

# Catfish: likes deep, slow water
catfish = np.exp(-((depth - 3.5)/1.0)**2) * np.exp(-((current - 0.3)/0.3)**2)
catfish = catfish / catfish.max()

# Small fish (puntius): likes shallow edges with vegetation
puntius = np.exp(-((depth - 1.0)/0.5)**2) * np.exp(-((current - 0.2)/0.3)**2)
puntius = puntius / puntius.max()

fig, axes = plt.subplots(3, 1, figsize=(12, 9), sharex=True)
fig.patch.set_facecolor('#1f2937')

# River cross-section with depth
axes[0].set_facecolor('#111827')
axes[0].fill_between(width, -depth, 0, color='#1e3a5f', alpha=0.5)
axes[0].plot(width, -depth, color='#854d0e', linewidth=2)
axes[0].axhline(0, color='#60a5fa', linewidth=1)

# Current speed arrows
for w in range(5, 50, 5):
    idx = np.argmin(np.abs(width - w))
    arrow_len = current[idx] * 0.5
    axes[0].annotate('', xy=(w + arrow_len, -depth[idx]/2),
                     xytext=(w, -depth[idx]/2),
                     arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=1.5))

axes[0].set_ylabel('Depth (m)', color='white')
axes[0].set_title('River Cross-Section with Current Speed', color='white', fontsize=12)
axes[0].tick_params(colors='gray')
axes[0].set_ylim(-5, 1)

# Environmental variables
axes[1].set_facecolor('#111827')
axes[1].plot(width, current, color='#f59e0b', linewidth=2, label='Current (m/s)')
axes[1].plot(width, DO/3, color='#3b82f6', linewidth=2, label='DO (scaled)')
axes[1].plot(width, depth/2, color='#854d0e', linewidth=2, label='Depth (scaled)')
axes[1].set_ylabel('Value', color='white')
axes[1].set_title('Environmental Variables', color='white', fontsize=12)
axes[1].legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
axes[1].tick_params(colors='gray')

# Fish suitability
axes[2].set_facecolor('#111827')
axes[2].fill_between(width, 0, mahseer, alpha=0.3, color='#22c55e', label='Mahseer')
axes[2].fill_between(width, 0, catfish, alpha=0.3, color='#ef4444', label='Catfish')
axes[2].fill_between(width, 0, puntius, alpha=0.3, color='#f59e0b', label='Small fish')
axes[2].plot(width, mahseer, color='#22c55e', linewidth=1.5)
axes[2].plot(width, catfish, color='#ef4444', linewidth=1.5)
axes[2].plot(width, puntius, color='#f59e0b', linewidth=1.5)
axes[2].set_xlabel('River width (m)', color='white')
axes[2].set_ylabel('Habitat suitability', color='white')
axes[2].set_title('Where Each Fish Species Prefers to Be', color='white', fontsize=12)
axes[2].legend(facecolor='#1f2937', labelcolor='white')
axes[2].tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Best fishing spots:")
print(f"  Mahseer: river width ~{width[np.argmax(mahseer)]:.0f}m (moderate depth, good current)")
print(f"  Catfish: river width ~{width[np.argmax(catfish)]:.0f}m (deep, slow pools)")
print(f"  Small fish: river width ~{width[np.argmax(puntius)]:.0f}m (shallow edges)")`,
      challenge: 'Add a "time of day" factor. At dawn, fish move to shallower water (multiply shallow preference by 1.5). At noon, they retreat to deep water. Plot the change in optimal fishing location.',
      successHint: 'Modern fisheries science uses the same habitat suitability models — just with more variables and satellite data. The Mishing approach is the same science, learned from the river itself.',
    },
    {
      title: 'Fluid dynamics — how water shapes fishing',
      concept: `A river is not a uniform flow — it is a complex three-dimensional system with eddies, turbulence, and boundary layers. Understanding fluid dynamics explains why fish are found in specific spots.

Key concepts:
- **Laminar vs. turbulent flow**: slow, shallow water flows in smooth layers (laminar). Fast, deep water is chaotic (turbulent). The **Reynolds number** Re = ρvL/μ determines which: Re < 2000 is laminar, Re > 4000 is turbulent.
- **Boundary layer**: near the riverbed, friction slows the water. Fish rest in this slow zone while the current above carries food to them.
- **Eddies**: behind rocks and obstacles, circular flow patterns create calm pockets. Fish shelter here — maximum food delivery, minimum energy expenditure.
- **Bernoulli's principle**: faster water = lower pressure. This creates suction effects at river constrictions and near obstacles.

A fish holding position behind a rock uses only 40% of the energy it would need in open current. Mishing fishermen place traps at eddy boundaries — where fast and slow water meet — because fish congregate at these energy-efficient locations.`,
      analogy: 'A river\'s flow is like traffic on a highway. The center lanes are fastest (main current). Near the shoulders, traffic slows (boundary layer). Behind a parked truck (rock), there is a calm zone where you can stop without blocking traffic (eddy). Fish are like hitchhikers who stand just at the edge of the calm zone, grabbing food carried by the fast traffic.',
      storyConnection: 'The Mishing fishermen placed their traps where the water told them to — behind rocks, at river bends, where tributaries meet. They did not know the word "eddy" or "Reynolds number," but they understood the physics intuitively. Their trap placement was applied fluid dynamics.',
      checkQuestion: 'Why do fish often jump at the base of waterfalls rather than swimming calmly upstream?',
      checkAnswer: 'At the base of a waterfall, fast-falling water creates a deep, turbulent pool. The hydraulic jump creates a boundary between super-critical (fast, shallow) and sub-critical (slow, deep) flow. Fish exploit the upward-flowing water in the recirculation zone to gain height. Jumping uses burst energy but takes advantage of the chaotic upward flows. It is not brute force — it is surfing the turbulence.',
      codeIntro: 'Simulate water flow around a rock showing eddies and boundary layers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified 2D flow around a circular obstacle (rock)
# Using potential flow + boundary layer approximation

nx, ny = 100, 60
x = np.linspace(-3, 5, nx)
y = np.linspace(-2, 2, ny)
X, Y = np.meshgrid(x, y)

# Rock position and radius
rock_x, rock_y, rock_r = 0, 0, 0.5

# Distance from rock center
R = np.sqrt((X - rock_x)**2 + (Y - rock_y)**2)

# Potential flow: uniform stream + dipole
U_inf = 1.0  # free stream velocity

# Velocity components (potential flow around cylinder)
theta_field = np.arctan2(Y - rock_y, X - rock_x)
Vx = U_inf * (1 - rock_r**2 * (np.cos(2*theta_field)) / R**2)
Vy = -U_inf * rock_r**2 * np.sin(2*theta_field) / R**2

# Mask inside rock
mask = R < rock_r
Vx[mask] = 0
Vy[mask] = 0

# Add wake/eddy behind rock (simplified)
wake = (X > rock_x) & (np.abs(Y - rock_y) < rock_r * 1.5)
wake_factor = np.exp(-((X - rock_x - 1.5)/1.0)**2)
Vx[wake] *= (1 - 0.7 * wake_factor[wake])

speed = np.sqrt(Vx**2 + Vy**2)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Flow field
ax1.set_facecolor('#111827')
speed_plot = ax1.pcolormesh(X, Y, speed, cmap='cool', shading='auto', vmin=0, vmax=2)
ax1.streamplot(X, Y, Vx, Vy, color='white', linewidth=0.5, density=2, arrowsize=0.5)

# Draw rock
circle = plt.Circle((rock_x, rock_y), rock_r, color='#854d0e', zorder=5)
ax1.add_patch(circle)

# Mark zones
ax1.annotate('Eddy zone\\n(fish rest here)', xy=(1.5, 0), xytext=(3, 1.2),
            color='#22c55e', fontsize=10, arrowprops=dict(arrowstyle='->', color='#22c55e'))
ax1.annotate('Boundary layer\\n(slow flow near bed)', xy=(-2, -1.8), xytext=(-1, -1.5),
            color='#f59e0b', fontsize=9)
ax1.annotate('Fast current\\n(carries food)', xy=(0, 1.5), xytext=(2, 1.8),
            color='#ef4444', fontsize=9)

ax1.set_title('Flow Around a Rock: Where Fish Hide', color='white', fontsize=12)
ax1.set_xlabel('Downstream distance (m)', color='white')
ax1.set_ylabel('Cross-stream (m)', color='white')
ax1.tick_params(colors='gray')
plt.colorbar(speed_plot, ax=ax1, label='Speed (m/s)')
ax1.set_aspect('equal')

# Velocity profile (boundary layer)
ax2.set_facecolor('#111827')
heights = np.linspace(0, 2, 100)
# Log-law velocity profile
u_star = 0.1  # friction velocity
kappa = 0.41  # von Karman constant
z0 = 0.01  # roughness length (pebble bed)
v_profile = (u_star / kappa) * np.log(heights / z0 + 1)
v_profile = np.clip(v_profile, 0, U_inf)

ax2.plot(v_profile, heights, color='#3b82f6', linewidth=2)
ax2.fill_betweenx(heights, 0, v_profile, alpha=0.1, color='#3b82f6')
ax2.axhline(0.1, color='#22c55e', linestyle='--', alpha=0.5)
ax2.text(0.05, 0.15, 'Fish resting zone', color='#22c55e', fontsize=9)
ax2.set_xlabel('Current speed (m/s)', color='white')
ax2.set_ylabel('Height above riverbed (m)', color='white')
ax2.set_title('Boundary Layer: Speed Near the Bottom', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key fluid dynamics for fishing:")
print(f"  Free stream velocity: {U_inf} m/s")
print(f"  Speed in eddy zone: ~{0.3*U_inf:.1f} m/s (70% reduction)")
print(f"  Speed at riverbed: ~{v_profile[5]:.2f} m/s (boundary layer)")
print(f"  Energy saved by fish in eddy: ~{(1-0.3**3)*100:.0f}% (drag ∝ v³)")`,
      challenge: 'Add a second rock downstream. How do their eddies interact? Does the second rock create a better or worse resting spot for fish?',
      successHint: 'Fluid dynamics governs everything in a river — from sediment transport to fish behavior to bridge design. The Mishing understood these patterns intuitively; engineers use the same physics with equations.',
    },
    {
      title: 'Sustainable yield — how much can you catch?',
      concept: `The central question of fisheries science: **How many fish can you catch each year without reducing the population?** This is the **maximum sustainable yield (MSY)**.

The logistic growth model: dN/dt = rN(1 - N/K)
- N = population size
- r = intrinsic growth rate
- K = carrying capacity

MSY = rK/4 (at population N = K/2)

This means:
- Maximum catch occurs when the population is at exactly HALF its natural carrying capacity
- Fishing too little: fish compete with each other, waste growth potential
- Fishing too much: population crashes below replacement rate
- Fishing at MSY: maximum harvest, population stable

The Mishing traditionally practiced seasonal fishing bans during spawning periods (April-July), effectively managing their fishery for sustainability centuries before Western fisheries science existed.

Modern fisheries that ignored MSY (North Atlantic cod, Pacific sardines) collapsed catastrophically. Traditional systems that respected natural cycles (Mishing, Japanese satoyama) persisted for generations.`,
      analogy: 'MSY is like a savings account. The fish population is the principal. Reproduction is the interest. MSY is the maximum amount of "interest" you can withdraw each year without reducing the principal. Withdraw too much → principal shrinks → less interest next year → spiral to bankruptcy (population collapse).',
      storyConnection: 'The Mishing never took all the fish. They fished specific seasons, used size-selective traps, and left breeding populations alone. This was not charity — it was calculated sustainability. Their "technology" included restraint, which is the hardest technology of all.',
      checkQuestion: 'If a lake has a carrying capacity of 10,000 fish and a growth rate of 0.5/year, what is the MSY?',
      checkAnswer: 'MSY = rK/4 = 0.5 × 10,000 / 4 = 1,250 fish per year. You can sustainably harvest 1,250 fish annually, as long as the population stays near K/2 = 5,000. If the population drops below ~3,000, you should stop fishing and let it recover. If it is near 10,000, you are under-harvesting — the population is limited by competition, not fishing.',
      codeIntro: 'Model fish population dynamics and find the maximum sustainable yield.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Logistic growth with harvesting
K = 10000  # carrying capacity
r = 0.5    # growth rate
dt = 0.1
years = np.arange(0, 30, dt)

# Different harvest rates
harvest_rates = [0, 0.05, 0.10, 0.15, 0.20, 0.25]
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#dc2626']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5.5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
total_catch = {}

for h, color in zip(harvest_rates, colors):
    N = np.zeros(len(years))
    N[0] = K * 0.8  # start near carrying capacity
    catch_total = 0

    for i in range(1, len(years)):
        growth = r * N[i-1] * (1 - N[i-1]/K)
        harvest = h * N[i-1]
        N[i] = max(0, N[i-1] + (growth - harvest) * dt)
        catch_total += harvest * dt

    ax1.plot(years, N, color=color, linewidth=1.5,
            label=f'h={h:.0%} (catch={catch_total:.0f})')
    total_catch[h] = catch_total

ax1.axhline(K/2, color='gray', linestyle=':', alpha=0.3)
ax1.text(25, K/2 + 200, 'K/2 = MSY population', color='gray', fontsize=8)
ax1.set_xlabel('Years', color='white')
ax1.set_ylabel('Fish population', color='white')
ax1.set_title('Population Under Different Harvest Rates', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Yield curve
ax2.set_facecolor('#111827')
h_range = np.linspace(0, 0.5, 100)
equilibrium_N = K * (1 - h_range/r)  # N* at equilibrium
equilibrium_N = np.maximum(equilibrium_N, 0)
sustainable_yield = h_range * equilibrium_N

msy = r * K / 4
msy_h = r / 2

ax2.plot(h_range, sustainable_yield, color='#22c55e', linewidth=2)
ax2.axvline(msy_h, color='#f59e0b', linestyle='--', linewidth=1)
ax2.axhline(msy, color='#f59e0b', linestyle='--', linewidth=1)
ax2.plot(msy_h, msy, 'o', color='#f59e0b', markersize=10)
ax2.annotate(f'MSY = {msy:.0f} fish/year\\nat h = {msy_h:.0%}',
            xy=(msy_h, msy), xytext=(0.3, msy*0.7),
            color='#f59e0b', fontsize=10, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Danger zone
ax2.fill_between(h_range[h_range > msy_h], 0, sustainable_yield[h_range > msy_h],
                alpha=0.1, color='#ef4444', label='Overfishing zone')

ax2.set_xlabel('Harvest rate (fraction/year)', color='white')
ax2.set_ylabel('Sustainable yield (fish/year)', color='white')
ax2.set_title('The Yield Curve: Finding MSY', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Carrying capacity (K): {K:,} fish")
print(f"Growth rate (r): {r}")
print(f"Maximum Sustainable Yield: {msy:,.0f} fish/year")
print(f"Optimal harvest rate: {msy_h:.0%} of population per year")
print(f"Population at MSY: {K/2:,.0f} (half of K)")`,
      challenge: 'What if the carrying capacity drops from 10,000 to 7,000 (due to habitat degradation)? Recalculate the MSY. If fishermen do not adjust, what happens?',
      successHint: 'MSY is the most important concept in fisheries management. Every collapsed fishery in history was one that exceeded its MSY for too long. The Mishing\'s traditional restraint was MSY in practice.',
    },
    {
      title: 'Aquaculture innovation — farming fish instead of hunting them',
      concept: `As wild fish populations decline worldwide, **aquaculture** (fish farming) has become essential. Global aquaculture now produces more fish than wild capture. The Mishing have practiced a form of aquaculture for centuries — integrating fish ponds with rice paddies.

Key aquaculture systems:
- **Pond culture**: fish in constructed ponds (most common)
- **Rice-fish culture**: fish in flooded rice paddies (Mishing tradition). Fish eat pests and weeds; their waste fertilizes rice. Win-win.
- **Cage culture**: fish in cages in rivers or lakes
- **Recirculating aquaculture systems (RAS)**: indoor tanks with water recycling — the future of urban fish farming

Critical parameters:
- **Stocking density**: too many fish → stress, disease, low O₂
- **Feed conversion ratio (FCR)**: kg of feed per kg of fish produced. Tilapia: 1.5; salmon: 1.2; beef: 6-8.
- **Water quality**: pH 6.5-8.5, DO > 5 mg/L, ammonia < 0.02 mg/L, temperature species-specific

Fish are the most efficient animal protein source: cold-blooded (no energy wasted on body heat), supported by water (no energy on skeleton), and have excellent FCR.`,
      analogy: 'Aquaculture is to fishing what farming is to hunting. Just as humans transitioned from hunting deer to raising cattle ~10,000 years ago, we are now transitioning from catching wild fish to raising farmed fish. The Mishing rice-fish system is one of the oldest examples of this transition — a 2,000-year-old technology that the modern world is rediscovering.',
      storyConnection: 'The Mishing innovation was not just catching fish — it was integrating fish with agriculture. Their rice-fish paddies were early examples of integrated farming systems. The story celebrates not just fishing skill but farming wisdom — understanding that the best technology works with nature, not against it.',
      checkQuestion: 'Fish have a feed conversion ratio of 1.2-1.5 (kg feed per kg meat). Beef is 6-8. Why such a huge difference?',
      checkAnswer: 'Three reasons: (1) Fish are ectotherms — they do not burn calories maintaining body temperature. A cow uses 75% of its feed energy just staying warm. (2) Fish are supported by water — they do not need heavy skeletons. A cow converts much of its feed into bone. (3) Fish excrete ammonia directly — less energy wasted on nitrogen metabolism compared to urea in mammals. Cold-blooded + buoyant + efficient excretion = the most efficient animal protein.',
      codeIntro: 'Compare protein production efficiency across different farming systems.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Protein production efficiency comparison
systems = {
    'Rice-fish (Mishing)': {'fcr': 1.8, 'protein': 18, 'water': 2000, 'co2': 2.0, 'color': '#22c55e'},
    'Pond tilapia': {'fcr': 1.5, 'protein': 20, 'water': 3000, 'co2': 2.5, 'color': '#3b82f6'},
    'Cage salmon': {'fcr': 1.2, 'protein': 20, 'water': 4000, 'co2': 3.0, 'color': '#f59e0b'},
    'Chicken': {'fcr': 2.0, 'protein': 21, 'water': 4300, 'co2': 4.5, 'color': '#a855f7'},
    'Pork': {'fcr': 3.5, 'protein': 26, 'water': 6000, 'co2': 7.0, 'color': '#ef4444'},
    'Beef': {'fcr': 7.0, 'protein': 26, 'water': 15000, 'co2': 27.0, 'color': '#dc2626'},
}

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

names = list(systems.keys())
colors_list = [systems[n]['color'] for n in names]

# FCR comparison
axes[0,0].set_facecolor('#111827')
fcrs = [systems[n]['fcr'] for n in names]
bars = axes[0,0].barh(names, fcrs, color=colors_list, alpha=0.8)
axes[0,0].set_xlabel('Feed Conversion Ratio (kg feed / kg meat)', color='white')
axes[0,0].set_title('Feed Efficiency', color='white', fontsize=11)
axes[0,0].tick_params(colors='gray')
for bar, val in zip(bars, fcrs):
    axes[0,0].text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
                  f'{val:.1f}', va='center', color='white', fontsize=9)

# Water use
axes[0,1].set_facecolor('#111827')
water = [systems[n]['water'] for n in names]
bars = axes[0,1].barh(names, water, color=colors_list, alpha=0.8)
axes[0,1].set_xlabel('Water use (L / kg protein)', color='white')
axes[0,1].set_title('Water Footprint', color='white', fontsize=11)
axes[0,1].tick_params(colors='gray')

# CO2 emissions
axes[1,0].set_facecolor('#111827')
co2 = [systems[n]['co2'] for n in names]
bars = axes[1,0].barh(names, co2, color=colors_list, alpha=0.8)
axes[1,0].set_xlabel('CO₂ equivalent (kg / kg protein)', color='white')
axes[1,0].set_title('Carbon Footprint', color='white', fontsize=11)
axes[1,0].tick_params(colors='gray')

# Protein per hectare (estimated annual yield)
axes[1,1].set_facecolor('#111827')
yields = [2500, 4000, 3000, 800, 400, 50]  # kg protein/hectare/year (estimates)
bars = axes[1,1].barh(names, yields, color=colors_list, alpha=0.8)
axes[1,1].set_xlabel('Protein yield (kg / hectare / year)', color='white')
axes[1,1].set_title('Land Efficiency', color='white', fontsize=11)
axes[1,1].tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Why fish farming is the future:")
print(f"  Best FCR: salmon at {min(fcrs):.1f} (vs beef at {max(fcrs):.1f})")
print(f"  Lowest water: rice-fish at {min(water):,} L/kg protein")
print(f"  Lowest CO₂: rice-fish at {min(co2):.1f} kg CO₂/kg protein")
print()
print("The Mishing rice-fish system scores well on EVERY metric.")
print("It's 2000 years old — and still one of the best designs.")`,
      challenge: 'Design a comparison for a new system: insect farming (FCR: 1.0, protein: 60%, water: 1000 L/kg, CO₂: 0.5 kg/kg). How does it compare to all existing systems?',
      successHint: 'The future of food is efficiency. Fish and insect farming lead every metric — FCR, water, CO₂, land use. The Mishing rice-fish system anticipated this by two millennia.',
    },
    {
      title: 'Sonar and fish-finding technology — seeing underwater with sound',
      concept: `Modern fishing boats use **sonar** (Sound Navigation and Ranging) to find fish. A transducer sends sound pulses into the water and listens for echoes bouncing off fish, the bottom, and underwater structures.

How sonar works:
1. Transducer emits a sound pulse (typically 50-200 kHz)
2. Sound travels through water at ~1,500 m/s (4.3× faster than in air)
3. When it hits a fish (or school), some sound reflects back
4. Time between emission and echo → distance: d = v × t / 2
5. Echo strength → fish size (larger fish = stronger echo)

Types of fish-finding sonar:
- **Single beam**: one cone of sound, shows depth and fish directly below
- **Side scan**: wide fan of sound, maps the bottom topography
- **CHIRP**: sweeps through frequencies for higher resolution
- **Forward-looking**: sees ahead, not just below (like submarine sonar)

Fish are detectable because their swim bladders (air-filled organs for buoyancy control) have very different acoustic properties from water. The density contrast creates a strong echo.

The same principle is used in medical ultrasound, submarine navigation, and bat echolocation.`,
      analogy: 'Fish-finding sonar is like shouting in a canyon and listening for echoes. If you shout toward a cliff (fish school), you hear a loud echo. If you shout into open air (empty water), silence. The time delay tells you how far away the cliff is. Fish finders do this thousands of times per second, building a picture of what is underwater.',
      storyConnection: 'The Mishing fishermen used their senses — sight, sound, water feel — to locate fish. Modern sonar extends these senses far beyond human capability. A fish finder can "see" a school of fish 100 meters below the surface in murky water. It is the technological evolution of the same goal: finding fish.',
      checkQuestion: 'Sound travels at 1,500 m/s in water. If a fish finder receives an echo 0.08 seconds after sending a pulse, how deep is the fish?',
      checkAnswer: 'Distance = speed × time / 2 = 1500 × 0.08 / 2 = 60 meters. We divide by 2 because the sound travels to the fish AND back. The fish (or whatever reflected the sound) is 60 meters below the transducer.',
      codeIntro: 'Simulate a fish finder sonar display showing fish at different depths.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate fish finder display
# X-axis: time (boat moving), Y-axis: depth
width = 200  # time steps (boat positions)
max_depth = 60  # meters

# Bottom topography
x = np.arange(width)
bottom = 40 + 10 * np.sin(x / 30) + 5 * np.sin(x / 10) + np.random.normal(0, 0.5, width)

# Fish schools (position, depth, size)
fish_schools = [
    (30, 15, 50, 8),   # (x_center, depth, n_fish, spread)
    (80, 25, 30, 5),
    (120, 10, 80, 12),
    (160, 35, 20, 4),
]

# Individual fish
individual_fish = [(np.random.randint(0, width), np.random.uniform(5, 40)) for _ in range(15)]

# Build sonar image
sonar_image = np.zeros((int(max_depth * 10), width))

# Bottom echo (strong)
for xi in range(width):
    bottom_pixel = int(bottom[xi] * 10)
    if bottom_pixel < sonar_image.shape[0]:
        sonar_image[bottom_pixel:min(bottom_pixel+5, sonar_image.shape[0]), xi] = 1.0

# Fish school echoes
for cx, cd, n, spread in fish_schools:
    for _ in range(n):
        fx = int(cx + np.random.normal(0, spread))
        fd = int((cd + np.random.normal(0, spread/3)) * 10)
        if 0 <= fx < width and 0 <= fd < sonar_image.shape[0]:
            strength = 0.3 + 0.4 * np.random.random()
            sonar_image[fd:fd+2, max(0,fx-1):fx+2] = strength

# Individual fish
for fx, fd in individual_fish:
    fx = int(fx)
    fd = int(fd * 10)
    if 0 <= fx < width and 0 <= fd < sonar_image.shape[0]:
        sonar_image[fd:fd+1, fx:fx+1] = 0.5

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Sonar display
ax1.set_facecolor('#000000')
ax1.imshow(sonar_image, aspect='auto', cmap='hot', vmin=0, vmax=1,
          extent=[0, width, max_depth, 0])

# Label fish schools
for cx, cd, n, spread in fish_schools:
    ax1.annotate(f'School\\n({n} fish)', xy=(cx, cd), xytext=(cx+15, cd-5),
                color='#22c55e', fontsize=8, arrowprops=dict(arrowstyle='->', color='#22c55e', lw=0.5))

ax1.set_xlabel('Boat position (time →)', color='white')
ax1.set_ylabel('Depth (m)', color='white')
ax1.set_title('Fish Finder Sonar Display', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Echo strength vs fish size
ax2.set_facecolor('#111827')
fish_lengths = np.linspace(5, 100, 50)  # cm
# Target strength ∝ length^2 (roughly)
target_strength = 20 * np.log10(fish_lengths / 100)  # dB relative to 1m fish

ax2.plot(fish_lengths, target_strength, color='#f59e0b', linewidth=2)
ax2.set_xlabel('Fish length (cm)', color='white')
ax2.set_ylabel('Echo strength (dB)', color='white')
ax2.set_title('Echo Strength vs Fish Size', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Mark common species
species = [('Small fish\\n(puntius)', 10, '#22c55e'), ('Rohu', 40, '#3b82f6'),
          ('Catfish', 60, '#f59e0b'), ('Mahseer', 80, '#ef4444')]
for name, length, color in species:
    ts = 20 * np.log10(length / 100)
    ax2.plot(length, ts, 'o', color=color, markersize=8)
    ax2.annotate(name, xy=(length, ts), xytext=(length+3, ts+2), color=color, fontsize=9)

plt.tight_layout()
plt.show()

print("Sonar physics:")
print(f"  Sound speed in water: 1,500 m/s")
print(f"  Typical frequency: 200 kHz (high resolution)")
print(f"  Resolution: ~{1500/(200000*2)*100:.1f} cm at 200 kHz")
print()
print("Echo depth = speed × time / 2")
print("  0.01s echo → {:.0f}m depth".format(1500 * 0.01 / 2))
print("  0.05s echo → {:.0f}m depth".format(1500 * 0.05 / 2))
print("  0.10s echo → {:.0f}m depth".format(1500 * 0.10 / 2))`,
      challenge: 'Sonar frequency affects resolution and range. High frequency (200 kHz) = better resolution but shorter range. Low frequency (50 kHz) = longer range but worse resolution. Plot the resolution vs range trade-off.',
      successHint: 'From bamboo traps to sonar fish finders — fishing technology has evolved from physical to electronic. But the goal is the same: understand where fish are and how to reach them. The Mishing fisherman and the sonar operator are solving the same problem with different tools.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for fishing science simulations. Click to start.</p>
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
