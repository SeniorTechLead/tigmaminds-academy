import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import AltitudeProfileDiagram from '../diagrams/AltitudeProfileDiagram';
import PopulationGrowthCurve from '../diagrams/PopulationGrowthCurve';
import NEIndiaBiomesDiagram from '../diagrams/NEIndiaBiomesDiagram';
import CorrelationDiagram from '../diagrams/CorrelationDiagram';
import LinearGraphDiagram from '../diagrams/LinearGraphDiagram';
import ClimateFactorsDiagram from '../diagrams/ClimateFactorsDiagram';

export default function SnowLeopardLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Atmospheric pressure vs altitude — the barometric formula',
      concept: `The snow leopard lives at 3,000-5,500 meters altitude, where the air pressure is 50-70% of sea level. This dramatic pressure drop follows the **barometric formula**, one of the most important equations in atmospheric physics:

P(h) = P_0 * exp(-M * g * h / (R * T))

where P_0 is sea-level pressure (101,325 Pa), M is the molar mass of air (0.029 kg/mol), g is gravitational acceleration (9.81 m/s^2), h is altitude (meters), R is the universal gas constant (8.314 J/(mol*K)), and T is temperature (Kelvin).

This equation comes from balancing two forces on a thin layer of air: gravity pulling it down and the pressure difference pushing it up. In equilibrium: dP = -rho * g * dh. Combined with the ideal gas law (P = rho * R * T / M), this gives the exponential decay.

The **scale height** H = R * T / (M * g) is the altitude at which pressure drops to 1/e (37%) of its starting value. At 15°C (288 K), H = 8,434 m. This means pressure halves roughly every 5,500 m. At the snow leopard's range (4,000 m), pressure is about P_0 * exp(-4000/8434) = 0.62 * P_0, or about 63 kPa compared to 101 kPa at sea level.

This pressure drop affects everything: breathing, cooking, engine performance, and even the boiling point of water (which drops to about 85°C at 4,500 m — you cannot make proper tea!).`,
      analogy: 'Imagine stacking mattresses. The bottom mattress is compressed by the weight of all the mattresses above it — it is thin and dense. The top mattress has nothing pressing on it — it is thick and fluffy. Air works the same way: molecules at sea level are compressed by the weight of the entire atmosphere above them (high pressure, high density). At altitude, there is less atmosphere above, so the air is "fluffier" — lower pressure, lower density. The barometric formula describes exactly how fast the compression decreases with height.',
      storyConnection: 'The snow leopard in the story hunts at altitudes where human climbers need supplemental oxygen. Its lungs have evolved to extract oxygen from thin air — larger lung capacity, more hemoglobin, and more efficient gas exchange. The barometric formula quantifies exactly how much thinner the air is: at the snow leopard\'s typical hunting altitude of 4,500 m, every breath contains only 60% of the oxygen molecules that a sea-level breath would.',
      checkQuestion: 'At what altitude does the atmospheric pressure drop to exactly half of sea level pressure? (Use T = 288 K)',
      checkAnswer: 'P/P_0 = 0.5 = exp(-h/H) where H = 8434 m. So -h/H = ln(0.5) = -0.693. h = 0.693 * 8434 = 5,845 m. Pressure halves at about 5,845 m — roughly the altitude of Kilimanjaro\'s summit. The snow leopard routinely hunts at altitudes where pressure is 55-65% of sea level.',
      codeIntro: 'Plot the barometric formula and explore how pressure, density, and temperature vary with altitude across the snow leopard\'s range.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Barometric formula and atmospheric profile
P0 = 101325  # Pa (sea level pressure)
M = 0.029  # kg/mol (molar mass of air)
g = 9.81  # m/s^2
R = 8.314  # J/(mol*K)
T0 = 288.15  # K (15°C standard)

# Scale height
H = R * T0 / (M * g)

# Altitude range (sea level to Everest)
altitude = np.linspace(0, 9000, 500)

# Isothermal barometric formula
P_isothermal = P0 * np.exp(-M * g * altitude / (R * T0))

# More realistic: International Standard Atmosphere (ISA)
# Troposphere lapse rate: -6.5°C per 1000m
lapse_rate = 0.0065  # K/m
T_isa = T0 - lapse_rate * altitude
P_isa = P0 * (T_isa / T0) ** (M * g / (R * lapse_rate))

# Air density
rho_isa = P_isa * M / (R * T_isa)
rho_0 = P0 * M / (R * T0)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Pressure vs altitude
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(P_isothermal / 1000, altitude / 1000, color='#3b82f6', linewidth=2,
        linestyle='--', label='Isothermal (simple)')
ax.plot(P_isa / 1000, altitude / 1000, color='#22c55e', linewidth=2,
        label='ISA (realistic)')
ax.axhspan(3, 5.5, alpha=0.1, color='#f59e0b', label='Snow leopard range')
ax.set_xlabel('Pressure (kPa)', color='white')
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('Atmospheric pressure vs altitude', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Mark key altitudes
for alt, name in [(3000, 'Lhasa'), (4500, 'Typical hunt'), (5500, 'Upper range'), (8849, 'Everest')]:
    idx = np.argmin(np.abs(altitude - alt))
    ax.plot(P_isa[idx] / 1000, alt / 1000, 'o', color='#ef4444', markersize=5)
    ax.text(P_isa[idx] / 1000 + 2, alt / 1000, f'{name} ({P_isa[idx]/1000:.0f} kPa)',
            color='white', fontsize=7, va='center')

# Plot 2: Temperature vs altitude
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(T_isa - 273.15, altitude / 1000, color='#ef4444', linewidth=2)
ax.axhspan(3, 5.5, alpha=0.1, color='#f59e0b')
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('Temperature lapse rate (-6.5°C/km)', color='white', fontsize=11)

for alt in [0, 3000, 4500, 5500, 8849]:
    idx = np.argmin(np.abs(altitude - alt))
    ax.plot(T_isa[idx] - 273.15, alt / 1000, 'o', color='#f59e0b', markersize=5)
    ax.text(T_isa[idx] - 273.15 + 1, alt / 1000,
            f'{T_isa[idx]-273.15:.1f}°C', color='white', fontsize=7)

# Plot 3: Air density vs altitude
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(rho_isa, altitude / 1000, color='#a855f7', linewidth=2)
ax.axhspan(3, 5.5, alpha=0.1, color='#f59e0b')
ax.set_xlabel('Air density (kg/m³)', color='white')
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('Air density decreases with altitude', color='white', fontsize=11)

# Plot 4: Pressure as % of sea level
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

pressure_pct = P_isa / P0 * 100
ax.plot(altitude / 1000, pressure_pct, color='#06b6d4', linewidth=2)
ax.fill_between(altitude / 1000, 0, pressure_pct, alpha=0.1, color='#06b6d4')
ax.axvspan(3, 5.5, alpha=0.1, color='#f59e0b')
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Pressure (% of sea level)', color='white')
ax.set_title('How much atmosphere is left?', color='white', fontsize=11)
ax.set_ylim(0, 105)

for alt, name in [(0, 'Sea level'), (3, 'Lower range'), (4.5, 'Hunt zone'), (5.5, 'Upper range')]:
    idx = np.argmin(np.abs(altitude - alt * 1000))
    ax.scatter(alt, pressure_pct[idx], c='#ef4444', s=60, zorder=5)
    ax.text(alt + 0.2, pressure_pct[idx] + 3, f'{pressure_pct[idx]:.0f}%',
            color='white', fontsize=8)

# Plot 5: Boiling point of water vs altitude
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Clausius-Clapeyron: boiling point drops with pressure
# T_boil = 1 / (1/373 - R*ln(P/P0)/L_vap) where L_vap = 40700 J/mol
L_vap = 40700  # J/mol
T_boil = 1 / (1/373.15 - R / L_vap * np.log(P_isa / P0))
T_boil_C = T_boil - 273.15

ax.plot(altitude / 1000, T_boil_C, color='#f59e0b', linewidth=2)
ax.axhspan(3, 5.5, alpha=0.1, color='#f59e0b')
ax.axhline(100, color='gray', linestyle='--', alpha=0.5, label='100°C (sea level)')
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Boiling point (°C)', color='white')
ax.set_title('Water boils at lower T at altitude', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

for alt in [0, 3, 4.5, 5.5, 8.849]:
    idx = np.argmin(np.abs(altitude - alt * 1000))
    ax.scatter(alt, T_boil_C[idx], c='#ef4444', s=40, zorder=5)
    ax.text(alt + 0.2, T_boil_C[idx] - 2, f'{T_boil_C[idx]:.0f}°C', color='white', fontsize=7)

# Plot 6: Column of air above — why pressure drops
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Mass of air above each altitude
mass_above = P_isa / g  # kg/m^2
ax.plot(altitude / 1000, mass_above, color='#22c55e', linewidth=2)
ax.fill_between(altitude / 1000, 0, mass_above, alpha=0.1, color='#22c55e')
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Air mass above (kg/m²)', color='white')
ax.set_title('Weight of air column above', color='white', fontsize=11)

ax.text(4, mass_above[0] * 0.7,
        f'Sea level: {mass_above[0]:.0f} kg/m²\\n'
        f'4500m: {mass_above[np.argmin(np.abs(altitude-4500))]:.0f} kg/m²\\n'
        f'That is {mass_above[0]-mass_above[np.argmin(np.abs(altitude-4500))]:.0f} kg/m² LESS',
        color='white', fontsize=8, bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#22c55e'))

plt.tight_layout()
plt.show()

print("Barometric Formula Summary:")
print(f"Scale height H = {H:.0f} m")
print(f"Pressure halves every {H * np.log(2):.0f} m")
print()
print(f"{'Altitude':<15} {'P (kPa)':>10} {'T (°C)':>8} {'rho (kg/m³)':>12} {'P/P0':>8} {'Boil (°C)':>10}")
print("-" * 68)
for alt in [0, 1000, 2000, 3000, 4000, 4500, 5000, 5500, 8849]:
    idx = np.argmin(np.abs(altitude - alt))
    print(f"{alt:>6}m       {P_isa[idx]/1000:>10.1f} {T_isa[idx]-273.15:>8.1f} {rho_isa[idx]:>12.3f} {P_isa[idx]/P0:>8.1%} {T_boil_C[idx]:>10.1f}")`,
      challenge: 'Add humidity to the model. Moist air has a lower effective molar mass (water vapor, M=0.018, is lighter than N2/O2). Calculate how the barometric formula changes at 80% relative humidity. Does moist air make pressure drop faster or slower with altitude?',
      successHint: 'The barometric formula is the starting point for all altitude physics — aviation, mountaineering, meteorology, and physiology. Every altimeter in every aircraft uses this equation. The snow leopard lives its entire life in the regime where this exponential decay significantly affects every physical process.',
    },
    {
      title: 'Gas laws at altitude — density, pressure, and the ideal gas law',
      concept: `The atmosphere obeys the **ideal gas law**: P * V = n * R * T, or equivalently P = rho * R_specific * T, where R_specific = R / M = 287 J/(kg*K) for air. This equation connects three quantities that all change with altitude: pressure (P), density (rho), and temperature (T).

At altitude, pressure drops (barometric formula), temperature drops (lapse rate), and density drops (as a consequence of both). The key insight is that density drops FASTER than pressure because temperature also drops. At 4,500 m: pressure is ~58 kPa (57% of sea level), temperature is ~259 K (90% of sea level), so density = P/(R_specific * T) = 58000/(287*259) = 0.780 kg/m^3, which is 64% of sea-level density (1.225 kg/m^3).

This density reduction has profound effects:
- **Breathing**: Each breath contains 36% fewer oxygen molecules
- **Aerodynamics**: Drag force is proportional to density, so birds (and snow leopards leaping) experience less air resistance
- **Convection**: Heat transfer by air movement is weaker, making it harder to stay warm
- **Sound**: Sound speed drops (c = sqrt(gamma * R_specific * T)), so the snow leopard's roar travels slower and attenuates faster
- **Engine performance**: Internal combustion engines lose ~3% power per 300 m of altitude gain due to reduced air intake

For the snow leopard, the most critical effect is on oxygen availability. The partial pressure of O2 is P_O2 = 0.21 * P_total. At 4,500 m, P_O2 = 0.21 * 58 = 12.2 kPa, compared to 21.3 kPa at sea level. This 43% reduction in oxygen pressure drives all the physiological adaptations we will explore later.`,
      analogy: 'The ideal gas law is like a budget equation: Income (P) = People (rho) x Spending_per_person (R_specific * T). At altitude, "income" (pressure) drops. "Spending per person" (temperature-related energy) also drops but less steeply. So "people" (density — the number of molecules per volume) must drop the most to balance the equation. Fewer molecules means fewer oxygen molecules per breath.',
      storyConnection: 'The snow leopard in the story can sprint and leap at altitudes where human mountaineers are gasping for breath. Its body has three key adaptations that compensate for the ideal gas law\'s consequences: larger nostrils and lungs (to inhale more of the thin air), blood with 20% more hemoglobin (to carry more oxygen per red blood cell), and muscles with higher myoglobin content (to store oxygen locally). The physics is the same; the biology is extraordinarily different.',
      checkQuestion: 'At 5,000 m altitude (P = 54 kPa, T = 256 K), calculate the air density and the number of O2 molecules per liter of air. Compare to sea level (P = 101 kPa, T = 288 K).',
      checkAnswer: 'At 5000m: rho = P/(R_specific*T) = 54000/(287*256) = 0.735 kg/m^3. At sea level: rho = 101325/(287*288) = 1.225 kg/m^3. Ratio: 0.735/1.225 = 60%. For O2 molecules: n/V = P_O2/(kB*T). At 5000m: 0.21*54000/(1.38e-23*256) = 3.21e24 /m^3 = 3.21e21 /liter. At sea level: 0.21*101325/(1.38e-23*288) = 5.35e24 /m^3 = 5.35e21 /liter. Ratio: 60%. Each liter of air at 5000m has 40% fewer O2 molecules.',
      codeIntro: 'Explore gas law relationships at altitude, calculating density, oxygen content, and derived quantities across the snow leopard\'s range.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Gas laws at altitude — comprehensive analysis
P0 = 101325  # Pa
T0 = 288.15  # K
M_air = 0.029  # kg/mol
R = 8.314  # J/(mol*K)
R_specific = R / M_air  # 287 J/(kg*K)
g = 9.81
kB = 1.38e-23  # Boltzmann constant

lapse_rate = 0.0065  # K/m
altitude = np.linspace(0, 8000, 500)

# ISA profiles
T = T0 - lapse_rate * altitude
P = P0 * (T / T0) ** (M_air * g / (R * lapse_rate))
rho = P / (R_specific * T)
rho_0 = P0 / (R_specific * T0)

# Oxygen partial pressure
f_O2 = 0.2095  # Fraction of O2 in dry air
P_O2 = f_O2 * P
P_O2_0 = f_O2 * P0

# Number density (molecules per m^3)
n_density = P / (kB * T)
n_O2 = f_O2 * n_density

# Sound speed
gamma = 1.4
c_sound = np.sqrt(gamma * R_specific * T)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: P, rho, T as fraction of sea level
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(altitude / 1000, P / P0 * 100, color='#3b82f6', linewidth=2, label='Pressure')
ax.plot(altitude / 1000, rho / rho_0 * 100, color='#22c55e', linewidth=2, label='Density')
ax.plot(altitude / 1000, T / T0 * 100, color='#ef4444', linewidth=2, label='Temperature')
ax.plot(altitude / 1000, P_O2 / P_O2_0 * 100, color='#f59e0b', linewidth=2, linestyle='--', label='O2 partial pressure')
ax.axvspan(3, 5.5, alpha=0.1, color='#f59e0b')
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('% of sea level value', color='white')
ax.set_title('How everything changes with altitude', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 105)

# Plot 2: O2 partial pressure (the critical one for life)
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(altitude / 1000, P_O2 / 1000, color='#22c55e', linewidth=2)
ax.fill_between(altitude / 1000, 0, P_O2 / 1000, alpha=0.1, color='#22c55e')
ax.axhspan(0, 6, alpha=0.1, color='#ef4444', label='Danger zone (<6 kPa)')
ax.axhline(P_O2_0 / 1000 * 0.6, color='#f59e0b', linestyle='--', alpha=0.7,
           label='60% O2 (impairment begins)')
ax.axvspan(3, 5.5, alpha=0.1, color='#a855f7', label='Snow leopard range')

ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('O2 partial pressure (kPa)', color='white')
ax.set_title('Oxygen available for breathing', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Molecules per breath
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

breath_volume = 0.5e-3  # 500 mL = 0.5 liter
O2_per_breath = n_O2 * breath_volume  # molecules per breath
O2_per_breath_sea = n_O2[0] * breath_volume

ax.plot(altitude / 1000, O2_per_breath / 1e22, color='#a855f7', linewidth=2)
ax.fill_between(altitude / 1000, 0, O2_per_breath / 1e22, alpha=0.1, color='#a855f7')
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('O2 molecules per breath (x10²²)', color='white')
ax.set_title('Oxygen per 500mL breath', color='white', fontsize=11)

for alt in [0, 3, 4.5, 5.5]:
    idx = np.argmin(np.abs(altitude - alt * 1000))
    ax.scatter(alt, O2_per_breath[idx] / 1e22, c='#f59e0b', s=60, zorder=5)
    ax.text(alt + 0.3, O2_per_breath[idx] / 1e22, f'{O2_per_breath[idx]/O2_per_breath_sea*100:.0f}%',
            color='white', fontsize=8)

# Plot 4: Sound speed vs altitude
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(altitude / 1000, c_sound, color='#06b6d4', linewidth=2)
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Sound speed (m/s)', color='white')
ax.set_title('Sound travels slower at altitude', color='white', fontsize=11)

# Plot 5: Drag force reduction (for a leaping snow leopard)
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

v_leap = 10  # m/s
A_frontal = 0.3  # m^2 (snow leopard frontal area)
Cd = 0.5  # Drag coefficient

F_drag = 0.5 * rho * v_leap**2 * Cd * A_frontal
F_drag_sea = 0.5 * rho_0 * v_leap**2 * Cd * A_frontal

ax.plot(altitude / 1000, F_drag, color='#ef4444', linewidth=2, label=f'Drag at {v_leap} m/s')
ax.axhline(F_drag_sea, color='gray', linestyle='--', alpha=0.5, label=f'Sea level: {F_drag_sea:.1f}N')
ax.axvspan(3, 5.5, alpha=0.1, color='#f59e0b')
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Drag force (N)', color='white')
ax.set_title('Less drag = easier leaping', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Mark reduction at typical altitude
idx_45 = np.argmin(np.abs(altitude - 4500))
reduction = (F_drag_sea - F_drag[idx_45]) / F_drag_sea * 100
ax.text(4.5, F_drag[idx_45] + 0.5, f'{reduction:.0f}% less drag',
        color='#22c55e', fontsize=9)

# Plot 6: Gas law relationship P = rho * R * T
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Show that P/(rho*T) = R_specific = constant
ratio = P / (rho * T)  # Should be R_specific everywhere
ax.plot(altitude / 1000, ratio, color='#22c55e', linewidth=2)
ax.axhline(R_specific, color='#f59e0b', linestyle='--', label=f'R_specific = {R_specific:.0f} J/(kg*K)')
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('P / (ρ × T) [J/(kg*K)]', color='white')
ax.set_title('Ideal gas law holds at all altitudes', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(R_specific * 0.99, R_specific * 1.01)

plt.tight_layout()
plt.show()

print("Gas Laws at Altitude:")
print(f"R_specific (air) = {R_specific:.1f} J/(kg*K)")
print()
print(f"{'Altitude':<10} {'P(kPa)':>8} {'T(°C)':>7} {'rho':>8} {'O2(kPa)':>8} {'O2/breath':>12} {'c_sound':>8}")
print("-" * 75)
for alt in [0, 3000, 4000, 4500, 5000, 5500]:
    idx = np.argmin(np.abs(altitude - alt))
    print(f"{alt:>6}m   {P[idx]/1000:>8.1f} {T[idx]-273.15:>7.1f} {rho[idx]:>8.3f} {P_O2[idx]/1000:>8.1f} "
          f"{O2_per_breath[idx]/O2_per_breath_sea*100:>10.0f}%  {c_sound[idx]:>8.1f}")`,
      challenge: 'Calculate how the snow leopard would need to increase its breathing rate to maintain the same oxygen intake as a sea-level cat. If sea-level breathing rate is 20 breaths/min, what rate is needed at 4500m? What if the tidal volume also increases by 30% (as measured in high-altitude adapted species)?',
      successHint: 'The ideal gas law connects pressure, density, and temperature into a single framework that explains every altitude effect. Understanding this relationship is essential for aviation, mountaineering, respiratory medicine, and ecology of high-altitude species.',
    },
    {
      title: 'Oxygen partial pressure — the physiology of thin air',
      concept: `The most critical altitude effect for any living creature is the reduction in **oxygen partial pressure**. Dalton's law says the total pressure of a gas mixture equals the sum of partial pressures: P_total = P_N2 + P_O2 + P_Ar + P_CO2 + ... Oxygen makes up 20.95% of dry air at ALL altitudes (the composition does not change), so P_O2 = 0.2095 * P_total.

At sea level: P_O2 = 0.2095 * 101.3 = 21.2 kPa. This is the **inspired O2 partial pressure** (PiO2). But what matters for the body is the **alveolar O2 partial pressure** (PAO2) — the O2 pressure in the lung air sacs where gas exchange occurs. The alveolar gas equation gives:

PAO2 = PiO2 - PaCO2 / RQ

where PaCO2 is arterial CO2 partial pressure (~40 mmHg = 5.3 kPa at sea level) and RQ is the respiratory quotient (~0.8). Water vapor also reduces PiO2: the lungs humidify inspired air to 100% at 37°C, adding 6.3 kPa of water vapor pressure.

So: PiO2 = 0.2095 * (P_atm - 6.3 kPa), and PAO2 = PiO2 - 5.3/0.8 = PiO2 - 6.6 kPa.

At 4,500 m: PiO2 = 0.2095 * (57.7 - 6.3) = 10.8 kPa. PAO2 = 10.8 - 6.6 = 4.2 kPa. Compare to sea level PAO2 = 0.2095 * (101.3 - 6.3) - 6.6 = 13.3 kPa. The alveolar O2 is only 32% of sea level — dramatically lower than the 57% suggested by atmospheric pressure alone. Water vapor and CO2 take a bigger "bite" out of the available oxygen at altitude.

This is why altitude sickness is more severe than simple pressure ratios suggest. The body responds by increasing ventilation (breathing faster), which lowers PaCO2 (respiratory alkalosis), partially restoring PAO2. The snow leopard has evolved to maintain efficient O2 extraction even at these extreme partial pressures.`,
      analogy: 'Think of a pie chart showing how the air in your lungs is divided. At sea level, O2 gets a generous slice (13.3 kPa out of ~100 kPa). But water vapor (6.3 kPa) and CO2 (5.3 kPa) always claim their slices first — they are mandatory "taxes." At altitude, the total pie shrinks, but the taxes stay the same size. The O2 slice gets squeezed from both sides: a smaller pie AND the same mandatory deductions. That is why altitude hits harder than the raw pressure numbers suggest.',
      storyConnection: 'The snow leopard can sustain a hunting sprint at 4,500 m — something that would leave a human athlete unconscious. Its secret is multi-layered: lungs with 30% more surface area (bigger pie), hemoglobin that binds O2 more tightly at low partial pressures (more efficient extraction from the small slice), and mitochondria that produce energy with less oxygen (more efficient use). Evolution has optimized every step of the oxygen cascade.',
      checkQuestion: 'A mountaineer at 5,500 m hyperventilates, reducing PaCO2 from 40 mmHg to 25 mmHg. How does this change PAO2? (Atmospheric pressure at 5500m is ~50.5 kPa)',
      checkAnswer: 'PiO2 = 0.2095 * (50.5 - 6.3) = 9.26 kPa. Normal: PAO2 = 9.26 - 40*0.133/0.8 = 9.26 - 6.65 = 2.61 kPa (dangerously low). With hyperventilation: PaCO2 = 25 mmHg = 3.33 kPa, so PAO2 = 9.26 - 3.33/0.8 = 9.26 - 4.16 = 5.10 kPa. Hyperventilation nearly doubles alveolar O2 from 2.61 to 5.10 kPa. This is the body\'s primary acclimatization response — it trades CO2 (causing alkalosis) for O2 (preventing hypoxia).',
      codeIntro: 'Model the complete oxygen cascade from atmosphere to alveoli, showing how each step reduces available O2 at altitude.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Oxygen partial pressure and the O2 cascade
P0 = 101325  # Pa
T0 = 288.15  # K
M = 0.029
g = 9.81
R_gas = 8.314
lapse = 0.0065

altitude = np.linspace(0, 8000, 500)
T = T0 - lapse * altitude
P_atm = P0 * (T / T0) ** (M * g / (R_gas * lapse))
P_atm_kPa = P_atm / 1000

f_O2 = 0.2095
P_H2O = 6.3  # kPa (water vapor in lungs at 37°C)
PaCO2_normal = 5.3  # kPa (normal arterial CO2)
RQ = 0.8  # Respiratory quotient

# O2 cascade at each altitude
PiO2 = f_O2 * (P_atm_kPa - P_H2O)  # Inspired O2 (humidified)
PAO2_normal = PiO2 - PaCO2_normal / RQ  # Alveolar O2 (no acclimatization)

# With acclimatization (hyperventilation reduces PaCO2)
# PaCO2 drops roughly linearly with altitude above 2000m
PaCO2_acclimatized = np.where(altitude < 2000, PaCO2_normal,
                              PaCO2_normal * (1 - 0.3 * (altitude - 2000) / 6000))
PAO2_acclimatized = PiO2 - PaCO2_acclimatized / RQ

# O2 saturation (sigmoid curve)
def hemoglobin_saturation(PO2_kPa, P50=3.5):
    """O2-hemoglobin dissociation curve (Hill equation)."""
    n = 2.7  # Hill coefficient
    return PO2_kPa**n / (P50**n + PO2_kPa**n) * 100

SpO2_normal = hemoglobin_saturation(np.maximum(PAO2_normal, 0.1))
SpO2_acclimatized = hemoglobin_saturation(np.maximum(PAO2_acclimatized, 0.1))

# Snow leopard (higher O2 affinity, P50 = 2.8 kPa)
SpO2_leopard = hemoglobin_saturation(np.maximum(PAO2_normal, 0.1), P50=2.8)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: O2 cascade at different altitudes
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

altitudes_demo = [0, 2000, 3500, 4500, 5500, 7000]
cascade_colors = ['#22c55e', '#3b82f6', '#06b6d4', '#f59e0b', '#ef4444', '#a855f7']

for alt, color in zip(altitudes_demo, cascade_colors):
    idx = np.argmin(np.abs(altitude - alt))
    stages = ['Atmosphere', 'Trachea\\n(humidified)', 'Alveoli', 'Arterial\\nblood']
    values = [
        f_O2 * P_atm_kPa[idx],
        PiO2[idx],
        max(PAO2_normal[idx], 0),
        max(PAO2_normal[idx] * 0.95, 0),  # Small A-a gradient
    ]
    ax.plot(range(len(stages)), values, 'o-', color=color, linewidth=1.5,
            markersize=4, label=f'{alt}m', alpha=0.8)

ax.set_xticks(range(4))
ax.set_xticklabels(['Atmos', 'Trachea', 'Alveoli', 'Blood'], color='white', fontsize=8)
ax.set_ylabel('O2 partial pressure (kPa)', color='white')
ax.set_title('O2 cascade at different altitudes', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Alveolar O2 vs altitude
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(altitude / 1000, PAO2_normal, color='#ef4444', linewidth=2, label='No acclimatization')
ax.plot(altitude / 1000, PAO2_acclimatized, color='#22c55e', linewidth=2, label='Acclimatized')
ax.axhspan(0, 4, alpha=0.1, color='#ef4444', label='Severe hypoxia')
ax.axhspan(4, 6, alpha=0.1, color='#f59e0b', label='Mild hypoxia')
ax.axvspan(3, 5.5, alpha=0.1, color='#a855f7')

ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Alveolar PO2 (kPa)', color='white')
ax.set_title('Alveolar oxygen pressure', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: O2-hemoglobin dissociation curve
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

PO2_range = np.linspace(0, 15, 200)
SpO2_human = hemoglobin_saturation(PO2_range, P50=3.5)
SpO2_leopard_curve = hemoglobin_saturation(PO2_range, P50=2.8)

ax.plot(PO2_range, SpO2_human, color='#3b82f6', linewidth=2, label='Human (P50=3.5 kPa)')
ax.plot(PO2_range, SpO2_leopard_curve, color='#f59e0b', linewidth=2, label='Snow leopard (P50=2.8 kPa)')

# Mark operating points at 4500m
PAO2_at_45 = PAO2_normal[np.argmin(np.abs(altitude - 4500))]
ax.scatter(PAO2_at_45, hemoglobin_saturation(max(PAO2_at_45, 0.1), 3.5),
           c='#3b82f6', s=100, zorder=5, edgecolors='white')
ax.scatter(PAO2_at_45, hemoglobin_saturation(max(PAO2_at_45, 0.1), 2.8),
           c='#f59e0b', s=100, zorder=5, edgecolors='white')
ax.axvline(PAO2_at_45, color='gray', linestyle=':', alpha=0.3)
ax.text(PAO2_at_45 + 0.3, 40, f'4500m\\nPAO2={PAO2_at_45:.1f}kPa',
        color='gray', fontsize=8)

ax.set_xlabel('O2 partial pressure (kPa)', color='white')
ax.set_ylabel('Hemoglobin saturation (%)', color='white')
ax.set_title('O2-Hb dissociation curves', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: SpO2 vs altitude (human vs snow leopard)
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(altitude / 1000, SpO2_normal, color='#3b82f6', linewidth=2, label='Human (unacclimatized)')
ax.plot(altitude / 1000, SpO2_acclimatized, color='#06b6d4', linewidth=2, linestyle='--', label='Human (acclimatized)')
ax.plot(altitude / 1000, SpO2_leopard, color='#f59e0b', linewidth=2, label='Snow leopard')
ax.axhline(90, color='gray', linestyle='--', alpha=0.5)
ax.text(1, 91, 'Normal SpO2 > 90%', color='gray', fontsize=7)
ax.axvspan(3, 5.5, alpha=0.1, color='#a855f7')

ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Blood O2 saturation (%)', color='white')
ax.set_title('SpO2 vs altitude by species', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 105)

# Plot 5: What steals oxygen at altitude
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Stacked bar showing what occupies the lung gas at each altitude
for i, alt in enumerate([0, 3000, 4500, 6000]):
    idx = np.argmin(np.abs(altitude - alt))
    P_total = P_atm_kPa[idx]
    po2 = max(PAO2_normal[idx], 0)
    pco2 = PaCO2_normal
    ph2o = P_H2O
    pn2 = P_total - po2 - pco2 - ph2o

    bottom = 0
    for val, color, name in [
        (po2, '#22c55e', 'O2'), (pco2, '#ef4444', 'CO2'),
        (ph2o, '#3b82f6', 'H2O'), (max(pn2, 0), '#94a3b8', 'N2')
    ]:
        ax.bar(i, val, bottom=bottom, color=color, alpha=0.8, width=0.6)
        if val > 3:
            ax.text(i, bottom + val/2, f'{name}\n{val:.1f}', ha='center',
                    va='center', color='white', fontsize=6)
        bottom += val

    ax.text(i, bottom + 2, f'{alt}m\n({P_total:.0f}kPa)', ha='center',
            color='white', fontsize=7)

ax.set_xticks(range(4))
ax.set_xticklabels(['Sea level', '3000m', '4500m', '6000m'], color='white', fontsize=8)
ax.set_ylabel('Partial pressure (kPa)', color='white')
ax.set_title('Alveolar gas composition', color='white', fontsize=11)

# Plot 6: Effective altitude with climate change
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Climate change: temperature increases reduce effective altitude benefits
T_warming = [0, 1, 2, 3, 4]
colors_warm = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7']

for dT, color in zip(T_warming, colors_warm):
    T_warm = (T0 + dT) - lapse * altitude
    P_warm = P0 * (T_warm / (T0 + dT)) ** (M * g / (R_gas * lapse))
    PiO2_warm = f_O2 * (P_warm / 1000 - P_H2O)
    PAO2_warm = PiO2_warm - PaCO2_normal / RQ
    ax.plot(altitude / 1000, PAO2_warm, color=color, linewidth=1.5,
            label=f'+{dT}°C', alpha=0.8)

ax.axvspan(3, 5.5, alpha=0.1, color='#a855f7')
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Alveolar PO2 (kPa)', color='white')
ax.set_title('Climate warming shifts O2 landscape', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Oxygen Partial Pressure Analysis:")
print()
print(f"{'Altitude':>8} {'P_atm':>8} {'PiO2':>8} {'PAO2':>8} {'SpO2_human':>12} {'SpO2_leopard':>14}")
print("-" * 72)
for alt in [0, 2000, 3000, 4000, 4500, 5000, 5500, 6000]:
    idx = np.argmin(np.abs(altitude - alt))
    print(f"{alt:>6}m  {P_atm_kPa[idx]:>7.1f}  {PiO2[idx]:>7.1f}  {max(PAO2_normal[idx],0):>7.1f}  "
          f"{SpO2_normal[idx]:>10.1f}%  {SpO2_leopard[idx]:>12.1f}%")
print()
print("Snow leopard advantage at 4500m:")
idx_45 = np.argmin(np.abs(altitude - 4500))
print(f"  Human SpO2: {SpO2_normal[idx_45]:.1f}%")
print(f"  Leopard SpO2: {SpO2_leopard[idx_45]:.1f}%")
print(f"  Advantage: {SpO2_leopard[idx_45] - SpO2_normal[idx_45]:.1f} percentage points")`,
      challenge: 'Model exercise at altitude. During heavy exercise, O2 consumption increases 10x and CO2 production increases proportionally. At what altitude can the snow leopard still maintain SpO2 > 85% during a hunting sprint, and at what altitude can a human?',
      successHint: 'The oxygen cascade — from atmosphere to mitochondria — reveals why altitude affects organisms so profoundly. Each step (humidification, alveolar mixing, hemoglobin binding, tissue delivery) takes its toll, and the cumulative effect is much larger than the simple atmospheric pressure ratio suggests.',
    },
    {
      title: 'Wind chill factor — when physics meets physiology',
      concept: `At high altitude, the snow leopard faces not just thin air but extreme cold made worse by wind. The **wind chill factor** quantifies how wind speed makes a surface lose heat faster than still air would, making the "felt" temperature much lower than the actual air temperature.

The physics: heat loss from a warm body to cold air occurs primarily through **forced convection**. The rate of heat loss is: Q_dot = h * A * (T_surface - T_air), where h is the convective heat transfer coefficient, A is the surface area, and the temperatures are in Kelvin. In still air, h is small because a warm boundary layer insulates the surface. Wind strips away this boundary layer, dramatically increasing h.

The convection coefficient h depends on wind speed: h ~ V^0.5 to V^0.8, depending on the flow regime and geometry. For a cylinder (approximating a limb): h = C * (V * D / nu)^n * k / D, where C and n are empirical constants, D is diameter, nu is kinematic viscosity, and k is thermal conductivity of air.

The wind chill temperature (WCT) used by meteorologists is an empirical formula: WCT = 13.12 + 0.6215*T - 11.37*V^0.16 + 0.3965*T*V^0.16, where T is air temperature (°C) and V is wind speed at 10m height (km/h). At 4,500 m with T = -15°C and V = 60 km/h wind, WCT = -32°C.

For the snow leopard, wind chill determines the metabolic cost of staying warm. Its thick fur (5-12 cm, with 4,000 hairs per cm^2) creates a trapped air layer that resists wind penetration. But above certain wind speeds, even this insulation fails, and the animal must seek shelter or burn extra calories.`,
      analogy: 'Wind chill is like the difference between standing in a cold room and standing in front of an open freezer with the fan blowing. The actual air temperature might be the same, but the moving air pulls heat away from your skin much faster. The wind acts as a "heat vacuum" — it continuously replaces the warmed air near your body with fresh cold air, preventing any insulating boundary layer from forming.',
      storyConnection: 'The snow leopard in the story wraps its long, thick tail around its nose and mouth while sleeping on exposed ridges. This is not merely comfort — it is thermal engineering. The exhaled warm, moist air is recycled through the fur, reducing both heat loss and water loss. At -20°C with 50 km/h wind (wind chill -42°C), every joule of conserved heat extends the animal\'s survival between meals.',
      checkQuestion: 'At 5,000 m altitude, the air temperature is -18°C and wind speed is 40 km/h. What is the wind chill temperature? If the snow leopard\'s fur reduces the effective wind speed to 5 km/h (by trapping air), what is the wind chill felt at the skin?',
      checkAnswer: 'With full wind: WCT = 13.12 + 0.6215*(-18) - 11.37*(40^0.16) + 0.3965*(-18)*(40^0.16) = 13.12 - 11.19 - 11.37*2.17 + 0.3965*(-18)*2.17 = 13.12 - 11.19 - 24.67 - 15.49 = -38.2°C. With fur protection (V=5): WCT = 13.12 - 11.19 - 11.37*(5^0.16) + 0.3965*(-18)*(5^0.16) = 13.12 - 11.19 - 11.37*1.30 + (-7.14)*1.30 = 13.12 - 11.19 - 14.78 - 9.28 = -22.1°C. The fur converts -38°C into -22°C — a 16°C improvement. This is the difference between survivable and lethal cold exposure.',
      codeIntro: 'Calculate wind chill factors across altitude and wind conditions, and model the snow leopard\'s thermal protection from its fur.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Wind chill analysis for high-altitude conditions

def wind_chill_temp(T_celsius, V_kmh):
    """Wind chill temperature (Environment Canada / NWS formula)."""
    V = np.maximum(V_kmh, 4.8)  # Formula valid for V >= 4.8 km/h
    WCT = 13.12 + 0.6215 * T_celsius - 11.37 * V**0.16 + 0.3965 * T_celsius * V**0.16
    return np.where(V_kmh < 4.8, T_celsius, WCT)

def heat_loss_rate(T_air_C, V_ms, T_skin=33, fur_thickness=0):
    """Heat loss rate in W/m^2 from exposed surface."""
    T_air = T_air_C + 273.15
    T_s = T_skin + 273.15
    # Air properties
    k_air = 0.024  # W/(m*K) thermal conductivity
    nu_air = 1.5e-5  # m^2/s kinematic viscosity
    D = 0.1  # m (characteristic length, e.g., limb diameter)
    # Forced convection (cylinder in crossflow)
    Re = V_ms * D / nu_air
    if Re < 4000:
        h = 0.683 * Re**0.466 * k_air / D * 0.6**0.33  # Pr ~ 0.7
    else:
        h = 0.027 * Re**0.805 * k_air / D * 0.6**0.33

    # Fur insulation (reduces h)
    if fur_thickness > 0:
        k_fur = 0.04  # W/(m*K) effective conductivity of fur
        R_fur = fur_thickness / k_fur  # Thermal resistance of fur
        h_eff = 1 / (1/h + R_fur)
    else:
        h_eff = h

    Q = h_eff * (T_s - T_air)
    return max(Q, 0)

# Conditions at snow leopard altitude
altitudes = [0, 2000, 3500, 4500, 5500]
lapse = 0.0065
T0 = 288.15

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Wind chill temperature map
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

T_range = np.linspace(-30, 10, 50)
V_range = np.linspace(5, 80, 50)
TT, VV = np.meshgrid(T_range, V_range)
WCT = wind_chill_temp(TT, VV)

im = ax.contourf(T_range, V_range, WCT, levels=np.arange(-60, 15, 5), cmap='RdBu_r')
ax.contour(T_range, V_range, WCT, levels=[-40, -30, -20], colors='white', linewidths=1)
cbar = plt.colorbar(im, ax=ax)
cbar.set_label('Wind chill (°C)', color='white')
cbar.ax.tick_params(colors='gray')

# Mark typical snow leopard conditions
ax.scatter(-15, 40, c='#f59e0b', s=100, zorder=5, edgecolors='white', linewidths=2)
ax.annotate('Typical\\nhunt', (-15, 40), textcoords="offset points",
            xytext=(10, 10), color='#f59e0b', fontsize=8)

ax.set_xlabel('Air temperature (°C)', color='white')
ax.set_ylabel('Wind speed (km/h)', color='white')
ax.set_title('Wind chill temperature', color='white', fontsize=11)

# Plot 2: Wind chill at different altitudes
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

V_demo = np.linspace(0, 80, 100)
alt_colors = ['#22c55e', '#3b82f6', '#06b6d4', '#f59e0b', '#ef4444']
for alt, color in zip(altitudes, alt_colors):
    T_alt = T0 - lapse * alt - 273.15  # °C
    WCT_alt = wind_chill_temp(T_alt, V_demo)
    ax.plot(V_demo, WCT_alt, color=color, linewidth=2, label=f'{alt}m ({T_alt:.0f}°C)')

ax.axhline(-40, color='gray', linestyle='--', alpha=0.5)
ax.text(5, -38, 'Frostbite in 10 min', color='gray', fontsize=7)
ax.set_xlabel('Wind speed (km/h)', color='white')
ax.set_ylabel('Wind chill temperature (°C)', color='white')
ax.set_title('Wind chill by altitude', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Heat loss rate — naked vs fur-insulated
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

V_ms_range = np.linspace(0.5, 20, 100)
T_test = -15  # °C

Q_naked = [heat_loss_rate(T_test, v, fur_thickness=0) for v in V_ms_range]
Q_thin_fur = [heat_loss_rate(T_test, v, fur_thickness=0.03) for v in V_ms_range]
Q_thick_fur = [heat_loss_rate(T_test, v, fur_thickness=0.08) for v in V_ms_range]
Q_leopard = [heat_loss_rate(T_test, v, fur_thickness=0.10) for v in V_ms_range]

ax.plot(V_ms_range * 3.6, Q_naked, color='#ef4444', linewidth=2, label='Naked skin')
ax.plot(V_ms_range * 3.6, Q_thin_fur, color='#f59e0b', linewidth=2, label='3cm fur (dog)')
ax.plot(V_ms_range * 3.6, Q_thick_fur, color='#3b82f6', linewidth=2, label='8cm fur (wolf)')
ax.plot(V_ms_range * 3.6, Q_leopard, color='#22c55e', linewidth=2, label='10cm fur (snow leopard)')

ax.set_xlabel('Wind speed (km/h)', color='white')
ax.set_ylabel('Heat loss (W/m²)', color='white')
ax.set_title(f'Heat loss at {T_test}°C', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Metabolic cost of cold
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

body_surface = 1.2  # m^2 (snow leopard)
basal_metabolic = 50  # W (resting metabolic rate)

T_range_met = np.linspace(-30, 20, 100)
for V_wind in [0, 20, 40, 60]:
    V_ms = V_wind / 3.6
    extra_heat = [body_surface * heat_loss_rate(t, max(V_ms, 0.5), fur_thickness=0.10)
                  for t in T_range_met]
    total_met = [basal_metabolic + max(e - basal_metabolic, 0) for e in extra_heat]
    ax.plot(T_range_met, total_met, linewidth=2,
            label=f'Wind = {V_wind} km/h')

ax.axhline(basal_metabolic, color='gray', linestyle='--', alpha=0.5,
           label=f'Basal ({basal_metabolic}W)')
ax.set_xlabel('Air temperature (°C)', color='white')
ax.set_ylabel('Metabolic rate (W)', color='white')
ax.set_title('Metabolic cost of staying warm', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Fur as thermal engineering
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

fur_range = np.linspace(0, 0.15, 100)  # meters
V_test = 10  # m/s (36 km/h)
T_test = -20

Q_vs_fur = [heat_loss_rate(T_test, V_test, fur_thickness=f) for f in fur_range]

ax.plot(fur_range * 100, Q_vs_fur, color='#f59e0b', linewidth=2)
ax.set_xlabel('Fur thickness (cm)', color='white')
ax.set_ylabel('Heat loss (W/m²)', color='white')
ax.set_title(f'Insulation vs fur depth ({T_test}°C, {V_test*3.6:.0f}km/h)', color='white', fontsize=11)

# Mark different animals
animals = [
    ('Human (clothed)', 1, '#ef4444'),
    ('Dog', 3, '#f59e0b'),
    ('Wolf', 8, '#3b82f6'),
    ('Snow leopard', 10, '#22c55e'),
    ('Musk ox', 12, '#a855f7'),
]
for name, thick, color in animals:
    q = heat_loss_rate(T_test, V_test, fur_thickness=thick/100)
    ax.scatter(thick, q, c=color, s=80, zorder=5, edgecolors='white')
    ax.annotate(name, (thick, q), textcoords="offset points",
                xytext=(5, 10), color=color, fontsize=7)

# Plot 6: Survival time without shelter
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Energy reserves (fat) and metabolic rate determine survival
fat_reserves_kJ = 15000  # kJ (snow leopard ~4kg fat x 37 kJ/g = 148,000 kJ; use fraction)
# Actually use ~15,000 kJ readily available

conditions = [
    ('Mild (-5°C, calm)', -5, 0, '#22c55e'),
    ('Cold (-15°C, 20km/h)', -15, 20, '#3b82f6'),
    ('Severe (-25°C, 40km/h)', -25, 40, '#f59e0b'),
    ('Extreme (-30°C, 60km/h)', -30, 60, '#ef4444'),
]

for name, T_c, V_c, color in conditions:
    V_c_ms = max(V_c / 3.6, 0.5)
    Q = body_surface * heat_loss_rate(T_c, V_c_ms, fur_thickness=0.10)
    total = max(Q, basal_metabolic)
    hours = fat_reserves_kJ * 1000 / total / 3600
    ax.barh(name, hours, color=color, alpha=0.8)
    ax.text(hours + 1, name, f'{hours:.0f}h', va='center', color='white', fontsize=8)

ax.set_xlabel('Survival time without food (hours)', color='white')
ax.set_title('Survival vs conditions (with 10cm fur)', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Wind Chill Analysis:")
print(f"{'Condition':<30} {'T_air':>6} {'Wind':>8} {'WCT':>8} {'Q_loss':>10}")
print("-" * 66)
for name, T_c, V_c, _ in conditions:
    WCT = wind_chill_temp(T_c, V_c)
    Q = body_surface * heat_loss_rate(T_c, max(V_c/3.6, 0.5), fur_thickness=0.10)
    print(f"{name:<30} {T_c:>5}°C {V_c:>6}km/h {WCT:>7.0f}°C {Q:>9.0f}W")
print()
print("The snow leopard's 10cm fur reduces heat loss by 80-90% compared to bare skin.")
print("This is the difference between thriving and freezing at 4500m.")`,
      challenge: 'Model the heat recovery from the snow leopard\'s nasal passages. The long nasal cavity acts as a counter-current heat exchanger — inhaled cold air is warmed by exhaled warm air. Calculate how much heat is recovered per breath and the daily energy savings.',
      successHint: 'Wind chill combines atmospheric physics with thermal engineering. The snow leopard\'s fur is one of the most effective natural insulation systems — achieving R-values comparable to modern synthetic insulation at a fraction of the weight.',
    },
    {
      title: 'Thermal radiation at high altitude — the cold sky above',
      concept: `At high altitude, heat loss through **thermal radiation** becomes surprisingly important. Every warm object emits electromagnetic radiation according to the **Stefan-Boltzmann law**: P = epsilon * sigma * A * T^4, where epsilon is emissivity (0-1), sigma = 5.67e-8 W/(m^2*K^4) is the Stefan-Boltzmann constant, A is surface area, and T is temperature in Kelvin.

At sea level, radiative heat loss from the body is partially offset by radiation FROM the surrounding environment (warm ground, buildings, clouds). The net radiative exchange is: Q_net = epsilon * sigma * A * (T_body^4 - T_surroundings^4).

At high altitude, the "surroundings" include the sky — and the high-altitude sky is COLD. The effective sky temperature depends on cloud cover and water vapor content. At 4,500 m on a clear night, the effective sky temperature can be -40 to -60°C (215-235 K), much colder than the air temperature. The thin, dry air at altitude has less water vapor to absorb and re-emit infrared radiation, so the sky appears radiatively "colder" than at sea level.

This means the snow leopard loses heat in two ways simultaneously: convection to cold air (wind chill) and radiation to the cold sky. On clear, calm nights, radiation can actually exceed convection as the dominant heat loss mechanism. This is why mountain temperatures plunge far below what the barometric formula alone predicts — and why the snow leopard\'s fur works as a radiation shield (trapping warm air) as well as a convection barrier.`,
      analogy: 'Imagine standing next to a campfire on a cold night. The side facing the fire feels warm (absorbing thermal radiation), while your back feels cold (radiating heat to the dark sky). Now imagine the campfire goes out — both sides feel cold because you are radiating to the cold sky in all directions with nothing warm to radiate back. High altitude is like having no campfire — the thin atmosphere provides less of the "warm blanket" of re-radiated heat that sea-level air provides.',
      storyConnection: 'The snow leopard in the story always seeks a rock overhang to sleep under, even when no wind is blowing. The villagers thought it feared the stars. In truth, the rock overhang blocks radiative heat loss to the cold sky. A rock at 0°C (273 K) radiates much more warmth back than the clear sky at -50°C (223 K). The overhang reduces net radiative heat loss by 60-80% — a significant survival advantage on cold, clear nights.',
      checkQuestion: 'A snow leopard (body surface 1.2 m^2, fur surface temperature 0°C = 273 K, emissivity 0.95) faces a clear sky with effective temperature -50°C (223 K). What is the net radiative heat loss? Compare to convective loss in a 10 km/h wind at -15°C.',
      checkAnswer: 'Radiative: Q_rad = 0.95 * 5.67e-8 * 1.2 * (273^4 - 223^4) = 0.95 * 5.67e-8 * 1.2 * (5.55e9 - 2.47e9) = 0.95 * 5.67e-8 * 1.2 * 3.08e9 = 199 W. Convective (from wind chill calculation): roughly 80-120 W at 10 km/h with 10cm fur. So radiative loss (199 W) EXCEEDS convective loss (100 W) on clear nights. This is why shelter matters more than just wind protection.',
      codeIntro: 'Model thermal radiation exchange between the snow leopard and its environment, comparing radiative and convective heat loss at altitude.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Thermal radiation at high altitude
sigma = 5.67e-8  # Stefan-Boltzmann constant (W/(m^2*K^4))

def sky_temperature(altitude_m, cloud_cover=0, T_air_C=-15):
    """Effective sky temperature in Kelvin."""
    T_air = T_air_C + 273.15
    # Clear sky temperature decreases with altitude (less water vapor)
    T_clear = T_air - 20 - altitude_m / 200  # Simplified model
    T_cloudy = T_air - 5  # Clouds are nearly at air temperature
    T_sky = (1 - cloud_cover) * T_clear + cloud_cover * T_cloudy
    return max(T_sky, 180)  # Floor at 180 K

def radiative_heat_loss(T_surface_K, T_sky_K, emissivity, area):
    """Net radiative heat loss in Watts."""
    return emissivity * sigma * area * (T_surface_K**4 - T_sky_K**4)

def convective_loss(T_air_C, V_ms, area, fur_cm=10):
    """Convective heat loss in Watts (simplified)."""
    h = 10 + 4 * V_ms  # Simplified convection coefficient
    R_fur = (fur_cm / 100) / 0.04 if fur_cm > 0 else 0
    h_eff = 1 / (1/h + R_fur)
    T_skin = 33 + 273.15
    T_air = T_air_C + 273.15
    return h_eff * area * (T_skin - T_air)

body_area = 1.2  # m^2
emissivity = 0.95
T_fur_surface = 273.15  # 0°C (fur surface temperature)

altitude = np.linspace(0, 7000, 200)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Sky temperature vs altitude (clear vs cloudy)
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for cc, name, color in [(0, 'Clear sky', '#3b82f6'), (0.5, '50% clouds', '#f59e0b'),
                          (1.0, 'Overcast', '#ef4444')]:
    T_sky = [sky_temperature(a, cc, -10 - 0.0065 * a) for a in altitude]
    ax.plot(altitude / 1000, [t - 273.15 for t in T_sky], color=color, linewidth=2, label=name)

ax.axvspan(3, 5.5, alpha=0.1, color='#a855f7')
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Effective sky temperature (°C)', color='white')
ax.set_title('Sky gets colder at altitude', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Radiative vs convective heat loss at 4500m
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

winds = np.linspace(0, 60, 100)  # km/h
T_air_45 = -15  # °C at 4500m
T_sky_clear = sky_temperature(4500, 0, T_air_45)
T_sky_cloudy = sky_temperature(4500, 1, T_air_45)

Q_rad_clear = radiative_heat_loss(T_fur_surface, T_sky_clear, emissivity, body_area) * np.ones_like(winds)
Q_rad_cloudy = radiative_heat_loss(T_fur_surface, T_sky_cloudy, emissivity, body_area) * np.ones_like(winds)
Q_conv = [convective_loss(T_air_45, w / 3.6, body_area) for w in winds]

ax.plot(winds, Q_rad_clear, color='#3b82f6', linewidth=2, label=f'Radiation (clear, Tsky={T_sky_clear-273:.0f}°C)')
ax.plot(winds, Q_rad_cloudy, color='#06b6d4', linewidth=2, linestyle='--', label=f'Radiation (cloudy, Tsky={T_sky_cloudy-273:.0f}°C)')
ax.plot(winds, Q_conv, color='#ef4444', linewidth=2, label='Convection (with 10cm fur)')

ax.set_xlabel('Wind speed (km/h)', color='white')
ax.set_ylabel('Heat loss (W)', color='white')
ax.set_title('Radiation vs convection at 4500m', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Total heat loss breakdown
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

scenarios = [
    ('Clear, calm\\nnight', 0, 0, -20),
    ('Clear, windy\\nnight', 0, 30, -20),
    ('Cloudy, calm\\nnight', 1.0, 0, -15),
    ('Clear\\ndaytime*', 0, 15, -10),
]

for i, (name, cc, wind, T_a) in enumerate(scenarios):
    T_sky_s = sky_temperature(4500, cc, T_a)
    Q_r = radiative_heat_loss(T_fur_surface, T_sky_s, emissivity, body_area)
    Q_c = convective_loss(T_a, wind / 3.6, body_area)
    # Solar gain during daytime (partial offset)
    Q_solar = 200 * body_area * 0.3 if 'day' in name else 0  # 200 W/m^2 * absorptivity
    Q_total = Q_r + Q_c - Q_solar

    ax.bar(i, Q_r, color='#3b82f6', alpha=0.8, label='Radiation' if i == 0 else '')
    ax.bar(i, Q_c, bottom=Q_r, color='#ef4444', alpha=0.8, label='Convection' if i == 0 else '')
    if Q_solar > 0:
        ax.bar(i, -Q_solar, bottom=Q_r + Q_c, color='#f59e0b', alpha=0.8,
               label='Solar gain' if 'day' in name else '')

    ax.text(i, Q_r + Q_c + 10, f'{Q_total:.0f}W', ha='center', color='white', fontsize=8)

ax.set_xticks(range(len(scenarios)))
ax.set_xticklabels([s[0] for s in scenarios], color='white', fontsize=7)
ax.set_ylabel('Heat loss (W)', color='white')
ax.set_title('Heat budget at 4500m', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Stefan-Boltzmann radiation spectrum
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Planck's law
def planck(wavelength_um, T):
    c1 = 3.742e8  # W*um^4/m^2
    c2 = 1.439e4  # um*K
    return c1 / (wavelength_um**5 * (np.exp(c2 / (wavelength_um * T)) - 1))

wavelength = np.linspace(1, 50, 500)
for T, name, color in [(310, 'Leopard body (37°C)', '#ef4444'),
                        (273, 'Fur surface (0°C)', '#f59e0b'),
                        (223, 'Cold sky (-50°C)', '#3b82f6')]:
    spectrum = planck(wavelength, T)
    ax.plot(wavelength, spectrum / 1e6, color=color, linewidth=2, label=name)

ax.set_xlabel('Wavelength (μm)', color='white')
ax.set_ylabel('Spectral radiance (MW/m²/μm/sr)', color='white')
ax.set_title('Thermal radiation spectra', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(1, 40)

# Plot 5: Shelter effect
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

shelter_types = [
    ('Open sky', 223, 0, '#ef4444'),
    ('Under rock\\noverhang', 263, 0.8, '#f59e0b'),
    ('Cave\\nentrance', 270, 0.95, '#22c55e'),
    ('Deep\\ncave', 275, 1.0, '#3b82f6'),
]

for name, T_surround, wind_block, color in shelter_types:
    Q_r = radiative_heat_loss(T_fur_surface, T_surround, emissivity, body_area)
    Q_c = convective_loss(-15, 10 * (1 - wind_block), body_area)
    Q_total = Q_r + Q_c
    ax.barh(name, Q_total, color=color, alpha=0.8)
    ax.text(Q_total + 5, name, f'{Q_total:.0f}W', va='center', color='white', fontsize=8)

ax.set_xlabel('Total heat loss (W)', color='white')
ax.set_title('Shelter reduces heat loss', color='white', fontsize=11)

# Plot 6: UV at altitude
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# UV increases ~10-12% per 1000m
UV_sea = 1.0  # relative
UV_altitude = UV_sea * (1 + 0.11 * altitude / 1000)
# Snow reflection adds up to 80% more
UV_with_snow = UV_altitude * 1.8

ax.plot(altitude / 1000, UV_altitude, color='#a855f7', linewidth=2, label='Direct UV')
ax.plot(altitude / 1000, UV_with_snow, color='#ef4444', linewidth=2, linestyle='--', label='UV + snow reflection')
ax.axvspan(3, 5.5, alpha=0.1, color='#f59e0b')
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('UV intensity (relative to sea level)', color='white')
ax.set_title('UV radiation increases with altitude', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Thermal Radiation at Altitude:")
print(f"Stefan-Boltzmann: sigma = {sigma} W/(m²*K⁴)")
print()
print("Clear night at 4500m:")
print(f"  Fur temperature: {T_fur_surface-273:.0f}°C")
print(f"  Sky temperature: {T_sky_clear-273:.0f}°C")
print(f"  Radiative loss: {radiative_heat_loss(T_fur_surface, T_sky_clear, emissivity, body_area):.0f} W")
print(f"  Convective loss (10 km/h): {convective_loss(-15, 10/3.6, body_area):.0f} W")
print()
print("Under rock overhang:")
print(f"  Effective surround: ~{263-273:.0f}°C (vs {T_sky_clear-273:.0f}°C sky)")
print(f"  Radiative saving: {radiative_heat_loss(T_fur_surface, T_sky_clear, emissivity, body_area) - radiative_heat_loss(T_fur_surface, 263, emissivity, body_area):.0f} W")
print()
print(f"UV at 4500m: {1 + 0.11 * 4.5:.0f}x sea level, {(1 + 0.11 * 4.5) * 1.8:.1f}x with snow reflection")`,
      challenge: 'Model the snow leopard\'s daily thermal budget over 24 hours: solar heating during the day, radiative cooling at night, and the effect of hunting (increased metabolic heat) vs resting. At what altitude does the daily energy deficit (heat loss > metabolic production) become unsustainable?',
      successHint: 'Thermal radiation is the silent killer at altitude. Most people think of wind and cold air, but on clear nights the radiative heat loss to the cold sky can exceed convective loss. The snow leopard\'s shelter-seeking behavior is as critical to survival as its fur. This completes the physics of mountain survival: pressure, oxygen, wind chill, and radiation.',
    },
    {
      title: 'UV radiation at altitude — the invisible danger above',
      concept: `Ultraviolet radiation increases significantly with altitude because there is less atmosphere above to absorb it. The atmosphere filters UV through three mechanisms: **ozone absorption** (primarily UV-C and UV-B), **Rayleigh scattering** (more effective at shorter wavelengths), and **aerosol absorption** (dust and pollution). At higher altitudes, all three mechanisms are weaker because there is less air above.

The UV increase follows approximately: UV(h) = UV_0 * exp(h / H_UV), where H_UV is the UV scale height (~15-20 km, different from the pressure scale height because UV absorption is concentrated in the ozone layer). Empirically, UV increases by about **10-12% per 1000 m** of altitude gain.

At the snow leopard's habitat (4,500 m), direct UV is about 50% stronger than at sea level. Add snow reflection (albedo 0.8-0.9), and the total UV exposure can be **2.7x sea level** — enough to cause snow blindness in unprotected eyes within hours.

The UV spectrum is divided into:
- **UV-A** (315-400 nm): Penetrates deepest, causes aging, relatively abundant
- **UV-B** (280-315 nm): Causes sunburn and DNA damage, partially absorbed by ozone
- **UV-C** (100-280 nm): Extremely dangerous but completely absorbed by ozone

At altitude, the UV-B increase is proportionally larger than UV-A because UV-B absorption depends more strongly on atmospheric path length. The ratio of UV-B to UV-A shifts toward more dangerous UV-B at altitude.

The snow leopard's adaptations include: pale, UV-reflecting fur, dark skin underneath (melanin absorbs transmitted UV), and a third eyelid (nictitating membrane) that protects the eyes from snow glare.`,
      analogy: 'Think of UV absorption by the atmosphere as a stack of sunglasses. At sea level, you look through the full stack — say, 10 pairs. Each pair absorbs some UV. At 4,500 m altitude, you have removed 4 pairs — only 6 remain. The same sun shines, but less UV is filtered. If the ground is snow-covered, you also get UV reflected from below, like having a mirror on the floor in a tanning salon. The snow leopard lives in a double-exposure zone: more UV from above, more reflected UV from below.',
      storyConnection: 'The snow leopard in the story has eyes that seem to glow in the mountain light. Local herders have long known that snow leopards are never blinded by snow glare, while their dogs and horses sometimes suffer snow blindness on bright days. The secret is the nictitating membrane — a transparent third eyelid that filters UV while allowing visible light through. It is a biological UV filter, evolved over millennia of high-altitude living.',
      checkQuestion: 'At 5,000 m altitude, direct UV is 55% stronger than sea level. Fresh snow reflects 85% of UV. What is the total UV dose (direct + reflected) relative to sea level, and how does this compare to standing in direct sun at noon at the equator at sea level?',
      checkAnswer: 'Direct UV at 5000m = 1.55 * UV_sea. Reflected UV = 1.55 * 0.85 = 1.32 * UV_sea. Total = 1.55 + 1.32 = 2.87 * UV_sea. This is 2.87 times the sea-level UV dose. The UV index at equatorial sea level at noon is about 12. At 5000m on snow, it would be 12 * 2.87 = 34.4 — far above the "extreme" category (11+). This is why snow blindness can occur in under 30 minutes of unprotected exposure at these altitudes.',
      codeIntro: 'Model UV radiation intensity across altitude, including atmospheric absorption, Rayleigh scattering, and snow reflection effects.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# UV radiation at altitude
altitude = np.linspace(0, 8000, 500)

# UV increase with altitude (empirical model)
UV_increase_rate = 0.11  # 11% per 1000m
UV_direct = 1 + UV_increase_rate * altitude / 1000

# UV-B increases faster than UV-A
UVB_increase_rate = 0.15  # 15% per 1000m
UVA_increase_rate = 0.08  # 8% per 1000m
UVB_direct = 1 + UVB_increase_rate * altitude / 1000
UVA_direct = 1 + UVA_increase_rate * altitude / 1000

# Snow reflection
snow_albedo_UV = 0.85
snow_albedo_visible = 0.80

UV_with_snow = UV_direct * (1 + snow_albedo_UV)
UV_with_rock = UV_direct * (1 + 0.15)  # Rock albedo ~15%
UV_with_grass = UV_direct * (1 + 0.03)  # Grass albedo ~3%

# UV Index calculation
# UV Index at sea level noon = ~10 (tropical) or ~6 (temperate)
UV_index_base = 8  # Mid-latitude, summer noon
UV_index = UV_index_base * UV_direct
UV_index_snow = UV_index_base * UV_with_snow

# DNA damage action spectrum (relative)
def dna_damage_spectrum(wavelength_nm):
    """Relative DNA damage per photon vs wavelength."""
    if wavelength_nm < 280:
        return 0  # Filtered by ozone
    elif wavelength_nm < 300:
        return np.exp(-0.1 * (wavelength_nm - 280))
    elif wavelength_nm < 320:
        return np.exp(-0.1 * (wavelength_nm - 280)) * 0.1
    else:
        return 0.001

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: UV intensity vs altitude
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(altitude / 1000, UV_direct, color='#a855f7', linewidth=2, label='Direct UV')
ax.plot(altitude / 1000, UV_with_snow, color='#ef4444', linewidth=2, linestyle='--', label='With snow reflection')
ax.plot(altitude / 1000, UV_with_rock, color='#f59e0b', linewidth=1.5, linestyle=':', label='With rock reflection')
ax.plot(altitude / 1000, UV_with_grass, color='#22c55e', linewidth=1.5, linestyle=':', label='With grass reflection')
ax.axvspan(3, 5.5, alpha=0.1, color='#f59e0b')
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('UV intensity (relative to sea level)', color='white')
ax.set_title('UV increases with altitude + surface', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: UV-A vs UV-B at altitude
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(altitude / 1000, UVA_direct, color='#3b82f6', linewidth=2, label='UV-A (+8%/km)')
ax.plot(altitude / 1000, UVB_direct, color='#ef4444', linewidth=2, label='UV-B (+15%/km)')
ax.plot(altitude / 1000, UVB_direct / UVA_direct, color='#f59e0b', linewidth=2, linestyle='--',
        label='UV-B/UV-A ratio')
ax.axvspan(3, 5.5, alpha=0.1, color='#a855f7')
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Relative intensity', color='white')
ax.set_title('UV-B increases faster (more dangerous)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: UV Index at altitude
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.fill_between(altitude / 1000, 0, UV_index, alpha=0.3, color='#a855f7')
ax.fill_between(altitude / 1000, UV_index, UV_index_snow, alpha=0.3, color='#ef4444',
                label='Added by snow')
ax.plot(altitude / 1000, UV_index, color='#a855f7', linewidth=2, label='Direct')
ax.plot(altitude / 1000, UV_index_snow, color='#ef4444', linewidth=2, label='With snow')

# UV Index categories
ax.axhline(3, color='#22c55e', linestyle='--', alpha=0.5)
ax.axhline(6, color='#f59e0b', linestyle='--', alpha=0.5)
ax.axhline(8, color='#ef4444', linestyle='--', alpha=0.5)
ax.axhline(11, color='#dc2626', linestyle='--', alpha=0.5)
ax.text(0.5, 1.5, 'Low', color='#22c55e', fontsize=7)
ax.text(0.5, 4.5, 'Moderate', color='#f59e0b', fontsize=7)
ax.text(0.5, 7, 'High', color='#ef4444', fontsize=7)
ax.text(0.5, 9.5, 'Very High', color='#dc2626', fontsize=7)
ax.text(0.5, 12, 'EXTREME', color='white', fontsize=7, fontweight='bold')

ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('UV Index', color='white')
ax.set_title('UV Index at altitude', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.axvspan(3, 5.5, alpha=0.1, color='#a855f7')

# Plot 4: Atmospheric transmission spectrum
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

wavelength = np.linspace(200, 400, 500)  # nm
# Approximate atmospheric transmission
transmission_sea = np.where(wavelength < 290, 0,
                   np.where(wavelength < 320, (wavelength - 290) / 30 * 0.3,
                   np.where(wavelength < 340, 0.3 + (wavelength - 320) / 20 * 0.5, 0.8)))

transmission_4500 = np.where(wavelength < 280, 0,
                    np.where(wavelength < 310, (wavelength - 280) / 30 * 0.5,
                    np.where(wavelength < 340, 0.5 + (wavelength - 310) / 30 * 0.4, 0.9)))

ax.plot(wavelength, transmission_sea * 100, color='#22c55e', linewidth=2, label='Sea level')
ax.plot(wavelength, transmission_4500 * 100, color='#ef4444', linewidth=2, label='4500m')
ax.fill_between(wavelength, transmission_sea * 100, transmission_4500 * 100,
                alpha=0.2, color='#f59e0b', label='Extra UV at altitude')

ax.axvspan(280, 315, alpha=0.1, color='#ef4444')
ax.text(297, 95, 'UV-B', color='#ef4444', fontsize=8, ha='center')
ax.axvspan(315, 400, alpha=0.1, color='#3b82f6')
ax.text(357, 95, 'UV-A', color='#3b82f6', fontsize=8, ha='center')

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Atmospheric transmission (%)', color='white')
ax.set_title('More UV passes through thin air', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Snow leopard UV protection features
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

features = ['Pale fur\\n(UV reflect)', 'Dark skin\\n(melanin)', 'Nictitating\\nmembrane',
            'Low body\\nprofile', 'Crepuscular\\nhunting']
protection = [70, 90, 95, 40, 80]  # % UV reduction from each
feat_colors = ['#f59e0b', '#a855f7', '#3b82f6', '#22c55e', '#06b6d4']

bars = ax.barh(range(len(features)), protection, color=feat_colors, alpha=0.8)
ax.set_yticks(range(len(features)))
ax.set_yticklabels(features, color='white', fontsize=8)
ax.set_xlabel('UV protection effectiveness (%)', color='white')
ax.set_title('Snow leopard UV adaptations', color='white', fontsize=11)

for bar, pct in zip(bars, protection):
    ax.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
            f'{pct}%', va='center', color='white', fontsize=9)

# Plot 6: Sunburn time at altitude
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Minimal Erythemal Dose (MED) ~ 200 J/m^2 for fair skin
MED = 200  # J/m^2
# UV irradiance at sea level noon ~ 3 W/m^2 (erythemal)
UV_irradiance_sea = 3  # W/m^2

sunburn_time_min = MED / (UV_irradiance_sea * UV_direct) / 60

ax.plot(altitude / 1000, sunburn_time_min, color='#ef4444', linewidth=2, label='Direct sun')
sunburn_snow = MED / (UV_irradiance_sea * UV_with_snow) / 60
ax.plot(altitude / 1000, sunburn_snow, color='#f59e0b', linewidth=2, linestyle='--', label='On snow')

ax.axvspan(3, 5.5, alpha=0.1, color='#a855f7')
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Time to sunburn (minutes)', color='white')
ax.set_title('Sunburn time decreases at altitude', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

for alt in [0, 3, 4.5, 5.5]:
    idx = np.argmin(np.abs(altitude - alt * 1000))
    ax.scatter(alt, sunburn_time_min[idx], c='#ef4444', s=40, zorder=5)
    ax.text(alt + 0.2, sunburn_time_min[idx] + 0.5, f'{sunburn_time_min[idx]:.0f}min',
            color='white', fontsize=7)

plt.tight_layout()
plt.show()

print("UV Radiation at Altitude:")
print()
print(f"{'Altitude':>8} {'UV direct':>10} {'UV+snow':>10} {'UV Index':>10} {'Sunburn(min)':>14}")
print("-" * 58)
for alt in [0, 2000, 3000, 4000, 4500, 5000, 5500]:
    idx = np.argmin(np.abs(altitude - alt))
    print(f"{alt:>6}m  {UV_direct[idx]:>10.2f}x {UV_with_snow[idx]:>10.2f}x "
          f"{UV_index_snow[idx]:>10.1f} {sunburn_snow[idx]*60:>12.0f}")
print()
print("The snow leopard lives in UV conditions 2-3x sea level.")
print("Its pale fur reflects UV, dark skin absorbs what penetrates,")
print("and crepuscular hunting avoids peak UV hours.")`,
      challenge: 'Calculate the annual UV dose received by a snow leopard that hunts primarily at dawn and dusk (when UV is 20% of noon levels) vs a hypothetical diurnal predator at the same altitude. How much less UV damage does the crepuscular strategy prevent?',
      successHint: 'UV radiation completes the picture of mountain physics: thin air means more UV reaches the surface, snow reflection doubles the dose, and the UV-B component (the most damaging) increases disproportionately. The snow leopard\'s behavioral and biological adaptations form a complete UV protection system rivaling any human-designed sunscreen.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Mountain physics and atmospheric science</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for atmospheric physics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={[AltitudeProfileDiagram, PopulationGrowthCurve, NEIndiaBiomesDiagram, CorrelationDiagram, LinearGraphDiagram, ClimateFactorsDiagram][i] ? createElement([AltitudeProfileDiagram, PopulationGrowthCurve, NEIndiaBiomesDiagram, CorrelationDiagram, LinearGraphDiagram, ClimateFactorsDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
