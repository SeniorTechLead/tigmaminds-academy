import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import StormPressureGradientDiagram from '../diagrams/StormPressureGradientDiagram';
import StormGeostrophicDiagram from '../diagrams/StormGeostrophicDiagram';
import StormIntensityScaleDiagram from '../diagrams/StormIntensityScaleDiagram';
import StormNWPDiagram from '../diagrams/StormNWPDiagram';
import StormClimateModelDiagram from '../diagrams/StormClimateModelDiagram';
import StormPrepareDiagram from '../diagrams/StormPrepareDiagram';

export default function FishermanStormLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Pressure gradient force — the engine of all winds',
      concept: `In Level 1, we learned that wind flows from high to low pressure. Now let's quantify it. The **pressure gradient force (PGF)** is the force per unit mass that drives air from high to low pressure:

**PGF = -(1/ρ) × (ΔP/Δx)**

Where ρ is air density, ΔP is the pressure change, and Δx is the distance. The negative sign means the force points FROM high TO low pressure.

Key implications:
- Tightly packed isobars (lines of equal pressure) → strong PGF → strong wind
- Widely spaced isobars → weak PGF → light wind
- PGF is always perpendicular to isobars, pointing toward lower pressure
- On a weather map, you can estimate wind speed just by looking at isobar spacing

In a cyclone, the PGF is enormous near the eyewall — isobars are squeezed together over just 50-100 km, creating a pressure gradient of ~30 hPa over that distance. This is what drives 200+ km/h eyewall winds.`,
      analogy: 'The pressure gradient force is like the slope of a hill for a rolling ball. A steep hill (tight isobars) makes the ball accelerate fast (strong wind). A gentle slope (wide isobars) produces a lazy roll (light breeze). The steepness IS the force — you can measure how fast the ball will roll just by measuring the slope, before the ball even starts moving.',
      storyConnection: 'As the cyclone approached in the story, the fisherman\'s daughter noticed the barometric pressure dropping rapidly. That rapid drop over a short distance is exactly the PGF at work. Old sailors had mercury barometers; a sharp drop meant a storm was building its pressure gradient. Today, atmospheric pressure sensors on weather buoys measure PGF directly across the Bay of Bengal.',
      checkQuestion: 'Two weather maps show the same low-pressure system. In Map A, the isobars are 100 km apart. In Map B, they\'re 50 km apart. Which map shows stronger winds, and by how much?',
      checkAnswer: 'Map B shows winds roughly twice as strong. PGF is inversely proportional to distance: if ΔP is the same but Δx is halved, PGF doubles. Since wind speed is proportional to PGF (approximately, in a simplified model), the winds in B are about 2× stronger. This is why meteorologists read isobar spacing — it\'s a direct visual indicator of wind speed.',
      codeIntro: 'Calculate PGF from pressure data and relate it to observed wind speeds.',
      code: `import numpy as np

# Pressure gradient force calculations
# PGF = -(1/rho) * dP/dx

rho = 1.225  # air density at sea level (kg/m3)

# Create isobar patterns at different spacings
x = np.linspace(0, 500, 200)  # km
y = np.linspace(0, 500, 200)
X, Y = np.meshgrid(x, y)

# Scenario 1: Gentle gradient (high pressure system)
P_gentle = 1020 - 0.01 * X
# Scenario 2: Moderate gradient (approaching front)
P_moderate = 1020 - 0.04 * X
# Scenario 3: Steep gradient (cyclone)
P_steep = 1020 - 0.12 * X

scenarios = [
    ('Gentle (high pressure)', P_gentle, 0.01),
    ('Moderate (weather front)', P_moderate, 0.04),
    ('Steep (cyclone approach)', P_steep, 0.12),
]


print("Pressure Gradient Force summary:")
for label, P, gradient in scenarios:
    pgf = gradient * 100 / rho  # m/s^2
    print(f"  {label}:")
    print(f"    Gradient: {gradient} hPa/km = {gradient*100:.0f} Pa/km")
    print(f"    PGF: {pgf:.4f} m/s²")`,
      challenge: 'In a cyclone, the pressure drops from 1010 hPa to 940 hPa over 200 km (from outer edge to center). Calculate the average PGF. Then calculate it over just the 30 km of the eyewall (where 40 hPa of that drop occurs). How do they compare?',
      successHint: 'The pressure gradient force is the master equation of meteorology. Every wind on Earth — from sea breezes to jet streams to tornadoes — starts with a pressure difference. PGF turns that difference into motion.',
    },
    {
      title: 'Geostrophic wind — when forces balance in the sky',
      concept: `If the pressure gradient force were the only force, wind would blow directly from high to low pressure and quickly equalize. But it doesn't — thanks to the Coriolis effect. When PGF and Coriolis force reach a balance, the result is **geostrophic wind**: air that flows PARALLEL to isobars, not across them.

**How it works:**
1. PGF pushes air from high to low pressure
2. As the air moves, the Coriolis effect deflects it to the right (Northern Hemisphere)
3. Deflection continues until the air is moving parallel to the isobars
4. At that point, PGF (pointing from high to low) exactly balances Coriolis (pointing from low to high)
5. The wind is in "geostrophic balance" — it flows along the isobars

**Geostrophic wind speed: V_g = (1/ρf) × (ΔP/Δn)**

Where f is the Coriolis parameter and Δn is the distance perpendicular to the isobars.

This balance works well above ~1 km altitude where friction is minimal. Near the surface, friction slows the wind and allows it to cross isobars at an angle — that's why surface wind spirals into cyclones instead of circling them perfectly.`,
      analogy: 'Geostrophic wind is like a car on a banked curve. Gravity (PGF) pulls it downward (toward low pressure). The bank angle (Coriolis) pushes it to the side. When perfectly balanced, the car drives along the curve (parallel to isobars) without drifting up or down. Too fast = drifts up (away from low). Too slow = drifts down (toward low). The balance speed is the geostrophic wind.',
      storyConnection: 'The large-scale winds that steer cyclones across the Bay of Bengal are geostrophic — they follow the pressure patterns of the surrounding atmosphere. The cyclone in the story didn\'t move randomly; it was steered by these balanced winds. Forecasters predict cyclone tracks by analyzing the geostrophic flow in which the cyclone is embedded.',
      checkQuestion: 'In the Southern Hemisphere, the Coriolis effect deflects to the LEFT. How does this change geostrophic wind around a low-pressure system?',
      checkAnswer: 'The wind still flows parallel to isobars, but it circles CLOCKWISE around a low (opposite to the Northern Hemisphere). PGF still points toward the low, but Coriolis deflects leftward. Balance is achieved with the low to the RIGHT of the wind direction (instead of left, as in the NH). This is why Southern Hemisphere cyclones spin clockwise.',
      codeIntro: 'Simulate the development of geostrophic balance — watch the Coriolis effect redirect the wind.',
      code: `import numpy as np

# Time evolution of wind adjusting to geostrophic balance
# Start with PGF only, then watch Coriolis deflect until balance
dt = 60  # seconds
total_time = 24 * 3600  # 24 hours
steps = int(total_time / dt)

# Parameters
rho = 1.225  # kg/m3
f = 1e-4  # Coriolis parameter (mid-latitudes)
dpdx = 0  # no east-west gradient
dpdy = -0.002  # Pa/m (pressure decreases northward)

# PGF (points north, toward low pressure)
pgf_x = -(1/rho) * dpdx
pgf_y = -(1/rho) * dpdy

# Geostrophic wind (analytical solution)
vg_x = -(1/(rho * f)) * dpdy
vg_y = (1/(rho * f)) * dpdx

# Simulate with damping (friction)
friction_coeff = 1e-5  # small friction

u_hist = [0]
v_hist = [0]
u, v = 0.0, 0.0

for step in range(steps):
    # Accelerations
    du = pgf_x + f * v - friction_coeff * u
    dv = pgf_y - f * u - friction_coeff * v
    u += du * dt
    v += dv * dt
    if step % 60 == 0:  # record every hour
        u_hist.append(u)
        v_hist.append(v)

u_hist = np.array(u_hist)
v_hist = np.array(v_hist)
hours = np.arange(len(u_hist))


print(f"Geostrophic wind: {vg_x:.1f} m/s eastward ({vg_x*3.6:.0f} km/h)")
print(f"PGF: {abs(dpdy/rho):.5f} m/s² (northward)")
print(f"Coriolis: {f*vg_x:.5f} m/s² (southward, balancing PGF)")
print(f"\\nThe wind blows PARALLEL to isobars, not across them.")
print(f"This is why weather maps show isobars — they're wind direction indicators.")`,
      challenge: 'Near the surface, friction reduces the wind speed by ~30% and turns it ~20-30° toward low pressure. Modify the simulation to include friction. How does the trajectory change?',
      successHint: 'Geostrophic balance is the default state of large-scale atmospheric flow. Understanding it is essential for reading weather maps, predicting wind, and understanding why weather systems move the way they do.',
    },
    {
      title: 'Cyclone intensity scales — measuring a storm\'s punch',
      concept: `Not all cyclones are equal. The **Saffir-Simpson Hurricane Wind Scale** (used in the Atlantic) and the **IMD intensity classification** (used in the Indian Ocean) categorize storms by their maximum sustained wind speed.

**IMD Classification:**
| Category | Wind Speed | Damage |
|---|---|---|
| Depression | < 52 km/h | Minimal |
| Deep Depression | 52-61 km/h | Light |
| Cyclonic Storm | 62-88 km/h | Moderate |
| Severe Cyclonic Storm | 89-117 km/h | Extensive |
| Very Severe | 118-166 km/h | Devastating |
| Extremely Severe | 167-221 km/h | Catastrophic |
| Super Cyclonic Storm | > 221 km/h | Total destruction |

**Key insight**: damage scales with wind speed CUBED. A 200 km/h storm doesn't cause twice the damage of a 100 km/h storm — it causes roughly EIGHT times the damage. This is because:
- Wind force on a surface ∝ v²
- Power (force × velocity) ∝ v³
- Additionally, stronger winds launch heavier debris`,
      analogy: 'Cyclone categories are like earthquake magnitudes — the scale seems linear (Cat 1, 2, 3...) but the damage is exponential. Going from Cat 3 to Cat 5 is not like going from 3 to 5 on a ruler. It\'s like going from a firecracker to a stick of dynamite. The numbers hide the exponential reality.',
      storyConnection: 'The cyclone in the story was powerful enough to capsize boats and flood the coast — likely a Severe or Very Severe cyclonic storm. The fisherman\'s daughter\'s survival depended on recognizing the severity fast enough to take shelter. In real life, the difference between a Cyclonic Storm and a Super Cyclonic Storm is the difference between roof damage and the building being gone.',
      checkQuestion: 'If wind damage scales with v³, and a Cat 1 cyclone (120 km/h) causes $1 million in damage, how much damage would a Cat 5 (260 km/h) cause by the same formula?',
      checkAnswer: 'Damage ∝ v³, so ratio = (260/120)³ = (2.17)³ = 10.2. The Cat 5 would cause roughly $10.2 million — over 10 times more damage from only about twice the wind speed. This is why intensity matters so much, and why a small increase in maximum wind speed means a huge increase in destructive potential.',
      codeIntro: 'Visualize the non-linear relationship between wind speed and destructive power.',
      code: `import numpy as np

# Wind speed vs destructive power
wind_speeds = np.linspace(30, 300, 200)  # km/h
wind_ms = wind_speeds / 3.6

# Force ∝ v^2, Power ∝ v^3
force = wind_ms ** 2
power = wind_ms ** 3

# Normalize to Cat 1 values
cat1_speed = 120 / 3.6
force_normalized = force / (cat1_speed ** 2)
power_normalized = power / (cat1_speed ** 3)

# IMD categories
categories = [
    ('Depression', 0, 52, '#22c55e'),
    ('Deep Depression', 52, 61, '#84cc16'),
    ('Cyclonic Storm', 62, 88, '#f59e0b'),
    ('Severe', 89, 117, '#ef4444'),
    ('Very Severe', 118, 166, '#dc2626'),
    ('Extremely Severe', 167, 221, '#991b1b'),
    ('Super Cyclonic', 222, 300, '#7f1d1d'),
]


print("Damage scaling:")
for name, lo, hi, _ in categories:
    mid = (lo + hi) / 2
    power_ratio = (mid / 70) ** 3  # relative to a Cyclonic Storm
    print(f"  {name:20s}: {lo:3d}-{hi:3d} km/h, power = {power_ratio:.1f}x Cyclonic Storm")`,
      challenge: 'The potential maximum intensity a cyclone can reach depends on sea surface temperature and upper-atmosphere temperature. Model this relationship: Vmax ∝ sqrt(SST - T_outflow). At what SST can a Super Cyclonic Storm form?',
      successHint: 'Intensity scales help communicate risk to the public, but the cubic damage relationship means that small differences in peak wind speed have enormous consequences. A Cat 4 and a Cat 5 sound similar; their impacts are vastly different.',
    },
    {
      title: 'Numerical weather prediction — computers that see the future',
      concept: `Modern cyclone forecasts rely on **numerical weather prediction (NWP)** — using supercomputers to simulate the atmosphere by solving the fundamental equations of fluid dynamics.

The process:
1. **Observation**: satellites, weather stations, buoys, aircraft, and radiosondes measure temperature, pressure, humidity, and wind globally
2. **Data assimilation**: observations are merged with a previous forecast to create the best possible "initial state"
3. **Model integration**: the equations of motion (Navier-Stokes), thermodynamics, and moisture physics are solved forward in time on a 3D grid
4. **Post-processing**: raw model output is adjusted based on known biases and local effects
5. **Ensemble forecasting**: the model is run 20-50 times with slightly different initial conditions to estimate uncertainty

The atmosphere is divided into millions of grid cells (~10-25 km horizontally, ~50 layers vertically). At each cell, the computer calculates temperature, pressure, humidity, and wind at every time step (typically 10-30 seconds). A 7-day global forecast requires ~10¹⁵ calculations.`,
      analogy: 'NWP is like simulating a chess game forward move by move. The current board position (observations) is known. The rules (physics equations) are known. The computer plays out every possible next move (ensemble members) and reports the most likely outcome. The further ahead you "play" (longer forecast), the more uncertain the result — because small differences in the opening position compound over many moves.',
      storyConnection: 'When the cyclone formed in the Bay of Bengal, NWP models at IMD and international centers were already running forecasts. The fisherman\'s daughter received a warning because a supercomputer solved millions of equations and predicted that the storm would intensify and hit their coast in 48 hours. Without NWP, they would have had hours of warning instead of days.',
      checkQuestion: 'Why is it impossible to make accurate weather forecasts beyond about 10-14 days, even with perfect models?',
      checkAnswer: 'The atmosphere is a chaotic system — tiny differences in initial conditions grow exponentially over time (the "butterfly effect"). Even with perfect physics, our observations have finite precision. A 0.001°C temperature error today becomes a 1°C error in 10 days and a 10°C error in 20 days. Chaos sets a fundamental limit on deterministic weather prediction. This is why we use ensemble (probabilistic) forecasting for longer ranges.',
      codeIntro: 'Simulate how ensemble forecasting works — multiple slightly different starting points diverge over time.',
      code: `import numpy as np

np.random.seed(42)

# Simplified ensemble forecast demonstration
# Lorenz-like system (simplified): x_{n+1} = a*x_n*(1-x_n)
# Small differences in initial conditions grow exponentially

a = 3.9  # chaos parameter (>3.57 = chaotic)

# True trajectory
x0_true = 0.5
n_steps = 50
true_traj = [x0_true]
for i in range(n_steps):
    true_traj.append(a * true_traj[-1] * (1 - true_traj[-1]))

# Ensemble: 30 members with slightly perturbed initial conditions
n_ensemble = 30
perturbation = 1e-6  # tiny perturbation

ensemble = []
for member in range(n_ensemble):
    x0 = x0_true + np.random.uniform(-perturbation, perturbation)
    traj = [x0]
    for i in range(n_steps):
        traj.append(a * traj[-1] * (1 - traj[-1]))
    ensemble.append(traj)

ensemble = np.array(ensemble)


print("Numerical Weather Prediction key facts:")
print(f"  Ensemble members: {n_ensemble}")
print(f"  Initial perturbation: ±{perturbation}")
print(f"  Spread at step 10: {spread[10]:.4f}")
print(f"  Spread at step 30: {spread[30]:.4f}")
print(f"  Spread at step 50: {spread[50]:.4f}")
print(f"\\nSmall errors grow exponentially — this is chaos.")
print(f"Ensemble forecasting acknowledges this by giving probabilities, not certainties.")`,
      challenge: 'Change the Lorenz parameter from 3.9 to 3.5 (less chaotic) and to 4.0 (maximally chaotic). How does the ensemble spread change? At what parameter value does the system become predictable?',
      successHint: 'NWP is one of humanity\'s greatest scientific achievements. Every day, supercomputers solve the equations of atmospheric physics to predict tomorrow\'s weather with remarkable accuracy. Ensemble forecasting honestly represents what we know and what we don\'t.',
    },
    {
      title: 'Climate models — the long view beyond weather',
      concept: `Weather forecasts predict the next 1-10 days. **Climate models** project decades to centuries. They use the same physics but ask a different question: not "will it rain next Tuesday?" but "will monsoons be stronger in 2100?"

The difference:
- **Weather**: specific state of the atmosphere at a specific time (chaotic, unpredictable beyond ~10 days)
- **Climate**: statistical average of weather over 30+ years (much more predictable)

Climate models divide Earth into a 3D grid (~100 km resolution) and simulate:
- Atmosphere (wind, temperature, humidity)
- Oceans (currents, temperature, salinity)
- Land surface (vegetation, soil moisture, ice)
- Carbon cycle (CO₂ emissions, absorption by oceans and forests)

For cyclones and the Bay of Bengal, climate projections suggest:
- Fewer total cyclones but more intense ones (Cat 4-5)
- Higher storm surge due to sea level rise
- Changes in monsoon patterns affecting cyclone steering`,
      analogy: 'The difference between weather and climate is like the difference between a single coin toss and the statistics of 1000 tosses. You can\'t predict the next toss (weather), but you can predict that heads will come up ~50% of the time (climate). Climate models don\'t predict specific future storms — they predict the statistical properties of all future storms.',
      storyConnection: 'The fisherman\'s daughter\'s world is changing. The Bay of Bengal is warming, sea levels are rising, and cyclone patterns are shifting. Her grandchildren may face fewer storms but more violent ones, with higher storm surges reaching further inland. Climate models are the tools that help communities plan for this future — building higher shelters, relocating villages, adapting agriculture.',
      checkQuestion: 'If we can\'t predict weather beyond 10 days, how can climate models project 100 years into the future?',
      checkAnswer: 'Because climate models predict averages, not specific events. You can\'t predict which way a heated pot of water will boil (turbulent), but you can predict that it WILL boil at 100°C (thermodynamic). Similarly, doubling CO₂ changes the average temperature by ~3°C — the specific weather on any given day is unpredictable, but the statistics shift predictably. It\'s statistics, not fortune-telling.',
      codeIntro: 'Build a simple energy balance climate model and explore climate sensitivity.',
      code: `import numpy as np

# Simple Energy Balance Model
# dT/dt = (1/C) * (S*(1-alpha)/4 - epsilon*sigma*T^4 + RF)
# S = solar constant, alpha = albedo, epsilon = emissivity, RF = radiative forcing

sigma = 5.67e-8  # Stefan-Boltzmann constant
S = 1361         # solar constant (W/m2)
alpha = 0.30     # Earth's albedo
C = 4.2e8        # heat capacity (J/m2/K, represents mixed ocean layer)
epsilon = 0.62   # effective emissivity (accounts for greenhouse effect)

dt = 365.25 * 24 * 3600  # 1 year in seconds
n_years = 300

# Scenario 1: Pre-industrial (stable)
# Scenario 2: Gradual CO2 increase (RF grows)
# Scenario 3: Abrupt CO2 doubling
# Scenario 4: CO2 doubling then halt

scenarios = {
    'Pre-industrial': np.zeros(n_years),
    'Gradual increase': np.linspace(0, 4, n_years),
    'Abrupt 2x CO2': np.ones(n_years) * 3.7,
    '2x CO2 + halt at yr 150': np.concatenate([np.linspace(0, 3.7, 150), np.ones(150) * 3.7]),
}


print("Climate model projections for Bay of Bengal:")
print("  Fewer total cyclones (less favorable conditions overall)")
print("  More intense cyclones (warmer water = more fuel)")
print("  Higher storm surges (sea level rise + intensity increase)")
print("  Changing monsoon patterns (affects cyclone steering)")
print("\\nClimate sensitivity (best estimate): 3.0°C per CO2 doubling")
print("This means: if CO2 doubles from pre-industrial, equilibrium warming ~ 3°C")`,
      challenge: 'Modify the energy balance model to include ice-albedo feedback: as temperature rises, albedo decreases (less ice). Set albedo = 0.30 - 0.02 * max(dT, 0). How does this change the warming? This is a positive feedback loop.',
      successHint: 'Climate models are our only tool for seeing the long-term future of Earth\'s atmosphere. They\'re imperfect, but their core physics is well-tested and their projections are the basis for global climate policy. Understanding their strengths and limitations is essential for informed citizenship.',
    },
    {
      title: 'Disaster preparedness — engineering survival',
      concept: `The science of cyclones means nothing if communities can't survive them. **Disaster preparedness** is the engineering discipline that translates atmospheric science into saved lives.

The system has four phases:
1. **Mitigation**: reduce risk before disaster (build cyclone shelters, plant mangroves, enforce building codes)
2. **Preparedness**: plan for disaster (warning systems, evacuation routes, stockpile supplies, community drills)
3. **Response**: act during disaster (evacuation, search and rescue, emergency shelter, medical aid)
4. **Recovery**: rebuild after disaster (infrastructure repair, economic support, psychological care, lessons learned)

India's cyclone preparedness transformation:
- **1970 (Bhola)**: 300,000-500,000 dead — essentially no warning system
- **1999 (Odisha)**: 10,000 dead — warnings existed but couldn't reach people
- **2013 (Phailin)**: 45 dead — mass evacuation of 1 million people in 48 hours
- **2020 (Amphan)**: 128 dead — 3 million evacuated during a pandemic

The 100x reduction in deaths is not because storms got weaker. It's because preparedness got better.`,
      analogy: 'Disaster preparedness is like a fire escape plan in a building. You hope you never need it, but when the fire alarm rings, every second counts. The plan was designed when there was no fire, tested with drills, and works automatically when panic sets in. Cyclone preparedness works the same way — the time to plan is before the storm, not during it.',
      storyConnection: 'The fisherman\'s daughter survived because she knew what to do. She read the signs, sought shelter, and waited out the storm. Her survival was not luck — it was preparedness, inherited from generations of coastal wisdom. Modern disaster management formalizes this wisdom into systems: warning channels, shelter networks, evacuation protocols. The story\'s lesson — that knowledge saves lives — is the founding principle of disaster risk reduction.',
      checkQuestion: 'Cyclone Phailin (2013) and the Odisha Super Cyclone (1999) hit nearly the same coastline with similar wind speeds. Phailin killed 45 people; the 1999 cyclone killed 10,000+. What changed?',
      checkAnswer: 'Multiple improvements: (1) Cell phones reached rural areas, enabling direct warnings to individuals. (2) 2,000+ cyclone shelters were built after 1999. (3) Evacuation was ordered 48 hours early and enforced. (4) Community-based disaster management trained local leaders. (5) NDRF (National Disaster Response Force) was created in 2006. The science was similar; the preparedness infrastructure was transformed.',
      codeIntro: 'Model the relationship between warning time, shelter availability, and lives saved.',
      code: `import numpy as np

# Disaster preparedness effectiveness model
# Lives saved = f(warning_time, shelter_capacity, community_training)

population_at_risk = 500000  # coastal population

# Model: lives saved = pop * (1 - mortality_rate)
# mortality_rate = base_rate * (1 - warning_factor) * (1 - shelter_factor) * (1 - training_factor)

base_mortality = 0.05  # 5% without any intervention (severe cyclone)

# Warning time effect (diminishing returns after 48 hours)
warning_hours = np.linspace(0, 96, 100)
warning_factor = 1 - np.exp(-0.05 * warning_hours)

# Shelter capacity effect
shelter_pct = np.linspace(0, 100, 100)  # % of population with shelter access
shelter_factor = shelter_pct / 100


print("Key takeaway: the same cyclones hit India today as in 1970.")
print("The difference is preparedness, not nature.")
print("\\nCost-effectiveness winners:")
for name, data in sorted(interventions.items(), key=lambda x: x[1]['cost']/x[1]['lives_saved_per_event']):
    cpl = data['cost'] / data['lives_saved_per_event'] * 1e6
    print(f"  {name.replace(chr(10), ' ')}: {cpl:,.0f} per life saved")`,
      challenge: 'A government has $100 million to spend on disaster preparedness. Using the cost-effectiveness data above, design the optimal portfolio of interventions. Which combination saves the most lives?',
      successHint: 'Disaster preparedness is where atmospheric science meets civil engineering, social science, economics, and politics. India\'s 100x improvement in cyclone survival is one of the greatest public health achievements of the 21st century — and it\'s replicable anywhere with the political will to invest in preparedness over response.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Atmospheric Dynamics — builds on Level 1 concepts</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for atmospheric modeling. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={[StormPressureGradientDiagram, StormGeostrophicDiagram, StormIntensityScaleDiagram, StormNWPDiagram, StormClimateModelDiagram, StormPrepareDiagram][i] ? createElement([StormPressureGradientDiagram, StormGeostrophicDiagram, StormIntensityScaleDiagram, StormNWPDiagram, StormClimateModelDiagram, StormPrepareDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
