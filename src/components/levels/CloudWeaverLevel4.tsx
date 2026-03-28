import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function CloudWeaverLevel4() {
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
      title: 'Capstone — Build an Orographic Rainfall Model for the Himalayan Front',
      concept: `In this capstone you will build a complete orographic rainfall prediction model that takes mountain elevation profile and wind direction as inputs and produces a spatial rainfall distribution as output. This is a simplified version of the models used by the India Meteorological Department for flood forecasting in northeast India.

Your model combines three physics modules. First, a terrain module that generates realistic mountain cross-sections from elevation data, computing slope, aspect, and effective barrier height for any wind direction. Second, an adiabatic cooling module that tracks air temperature, humidity, and condensation as a parcel is forced upslope, using the DALR below cloud base and SALR above. Third, a precipitation efficiency module that converts condensed water into rainfall based on orographic enhancement factors, rain shadow effects, and wind speed.

The key insight is that rainfall distribution is not uniform across a mountain — it depends critically on the interaction between wind direction and terrain orientation. A wind perpendicular to a ridge produces maximum orographic uplift and maximum rainfall. A wind parallel to the ridge produces minimal uplift. By rotating the wind direction and recomputing the model, you can generate a full 360-degree rainfall rose that predicts where rain falls for any wind direction. This is the cloud weaver\'s knowledge — which winds bring rain and which bring clear skies — expressed as a physical model.`,
      analogy: 'Building an orographic rainfall model is like designing a simulation for a water park slide. The slide shape (mountain profile) determines where the water speeds up (steep slopes = strong uplift), where it pools (valleys = convergence), and where it sprays off the edges (ridgetops = maximum precipitation). Changing the wind direction is like changing which direction the water flows down the slide — different starting points produce completely different splash patterns.',
      storyConnection: 'The cloud weaver of Tawang knows from experience which winds bring rain: the southerly monsoon flow that crashes into the Himalayan front. Your model quantifies this knowledge, predicting exactly how much rain falls on each slope for any given wind direction. The weaver\'s intuitive understanding of terrain-weather interaction becomes a computational tool that could help forecast floods, plan agriculture, and manage water resources across Tawang and Arunachal Pradesh.',
      checkQuestion: 'Your model shows that a south wind at 10 m/s produces 25 mm/hr on the windward slope, but a southwest wind at the same speed produces only 15 mm/hr on the same slope. Why the difference, even though the wind speed is the same?',
      checkAnswer: 'The effective orographic uplift depends on the component of wind perpendicular to the terrain slope, not the total wind speed. A south wind hitting a south-facing slope is perpendicular (maximum uplift). A southwest wind has only its southward component contributing to uplift — at 45 degrees, the effective perpendicular speed is 10 × cos(45°) = 7.07 m/s. Less uplift means less adiabatic cooling, less condensation, and less rainfall. The model captures this through the dot product of wind direction and terrain normal vectors.',
      codeIntro: 'Build the complete orographic rainfall model — terrain generation, adiabatic physics, precipitation computation, and wind direction sensitivity analysis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Physical constants ---
g = 9.81
DALR = 9.8  # °C/km
SALR = 5.5  # °C/km (simplified constant)

def saturation_mixing_ratio(T_c, P_hPa=800):
    es = 6.112 * np.exp(17.27 * T_c / (T_c + 243.5))
    return 622 * es / (P_hPa - es)

# --- Terrain module ---
def generate_terrain(x_km, profile='himalayan'):
    """Generate a realistic mountain cross-section."""
    if profile == 'himalayan':
        # Foothills + main range + plateau
        foothills = 200 * np.exp(-0.5 * ((x_km - 30) / 10)**2)
        main_range = 3500 * np.exp(-0.5 * ((x_km - 60) / 12)**2)
        plateau = 2000 / (1 + np.exp(-0.3 * (x_km - 80)))
        terrain = foothills + main_range * 0.7 + plateau * 0.3
    elif profile == 'single_ridge':
        terrain = 3000 * np.exp(-0.5 * ((x_km - 50) / 15)**2)
    else:
        terrain = np.zeros_like(x_km)
    return np.maximum(terrain, 0)

# --- Adiabatic + precipitation module ---
def orographic_rainfall(terrain, x_km, wind_speed, T_initial, q_initial, wind_angle=0):
    """Compute rainfall along a terrain transect.
    wind_angle: 0 = perpendicular to ridge (maximum uplift), 90 = parallel (no uplift)
    """
    dx = (x_km[1] - x_km[0]) * 1000  # meters
    effective_wind = wind_speed * np.cos(np.radians(wind_angle))
    effective_wind = max(effective_wind, 0.5)  # minimum

    T = T_initial
    q = q_initial
    rainfall = np.zeros_like(terrain)
    cloud_mask = np.zeros_like(terrain, dtype=bool)

    for i in range(1, len(terrain)):
        dz = (terrain[i] - terrain[i-1]) / 1000  # km

        if dz > 0:  # ascending (windward)
            q_sat = saturation_mixing_ratio(T)
            if q > q_sat:  # saturated
                T -= SALR * dz
                q_sat_new = saturation_mixing_ratio(T)
                condensed = max(q - q_sat_new, 0)
                q = q_sat_new
                # Precipitation efficiency depends on slope steepness and wind
                slope = abs(dz) / (dx / 1000)
                efficiency = min(0.3 + 0.5 * slope * effective_wind / 10, 0.8)
                rainfall[i] = condensed * efficiency * effective_wind * 0.1
                cloud_mask[i] = True
            else:  # unsaturated
                T -= DALR * dz
                q_sat_new = saturation_mixing_ratio(T)
                if q > q_sat_new:
                    cloud_mask[i] = True
        elif dz < 0:  # descending (leeward)
            T += DALR * abs(dz)  # foehn warming
            rainfall[i] = max(rainfall[i-1] * 0.3, 0)  # rapid decrease
            cloud_mask[i] = False

    return rainfall, cloud_mask, T

# --- Main computation ---
x_km = np.linspace(0, 100, 500)
terrain = generate_terrain(x_km)

fig, axes = plt.subplots(2, 2, figsize=(14, 11))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Rainfall for different wind speeds
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax_terrain = ax.twinx()
ax_terrain.fill_between(x_km, 0, terrain, color='#4a3728', alpha=0.4)
ax_terrain.plot(x_km, terrain, color='#8B6914', linewidth=1)
ax_terrain.set_ylabel('Elevation (m)', color='#8B6914')

wind_speeds = [5, 10, 15, 20]
colors_w = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
for ws, color in zip(wind_speeds, colors_w):
    rain, clouds, _ = orographic_rainfall(terrain, x_km, ws, T_initial=28, q_initial=18)
    ax.plot(x_km, rain, color=color, linewidth=2, label=f'Wind = {ws} m/s')

ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Rainfall rate (mm/hr)', color='white')
ax.set_title('Orographic Rainfall vs Wind Speed', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray'); ax_terrain.tick_params(colors='gray')

# Plot 2: Wind direction sensitivity
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
wind_angles = np.linspace(0, 90, 10)
total_rain = []
peak_rain = []
for angle in wind_angles:
    rain, _, _ = orographic_rainfall(terrain, x_km, 10, 28, 18, wind_angle=angle)
    total_rain.append(rain.sum())
    peak_rain.append(rain.max())

ax2.plot(wind_angles, np.array(total_rain) / total_rain[0] * 100, 'o-', color='#3b82f6',
         linewidth=2.5, label='Total rainfall')
ax2.plot(wind_angles, np.array(peak_rain) / peak_rain[0] * 100, 's-', color='#ef4444',
         linewidth=2.5, label='Peak intensity')
ax2.axhline(50, color='gray', linewidth=0.5, linestyle='--')
ax2.set_xlabel('Wind angle to ridge normal (degrees)', color='white')
ax2.set_ylabel('% of perpendicular wind rainfall', color='white')
ax2.set_title('Rainfall Sensitivity to Wind Direction', color='white', fontsize=11)
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.annotate('Perpendicular\\n(maximum rain)', xy=(0, 100), xytext=(15, 95),
            color='#fbbf24', fontsize=9, arrowprops=dict(arrowstyle='->', color='#fbbf24'))
ax2.annotate('Parallel\\n(minimal rain)', xy=(90, peak_rain[-1]/peak_rain[0]*100),
            xytext=(70, 30), color='#fbbf24', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#fbbf24'))

# Plot 3: 360-degree rainfall rose
ax3 = axes[1, 0]
ax3.remove()
ax3 = fig.add_subplot(2, 2, 3, projection='polar')
ax3.set_facecolor('#111827')
directions = np.linspace(0, 360, 36, endpoint=False)
rain_by_direction = []
for direction in directions:
    # Tawang's main ridge runs roughly E-W, so N and S winds are most effective
    # Convert wind direction to angle relative to ridge normal (N-S)
    angle_to_normal = min(abs(direction - 180), abs(direction), abs(direction - 360))
    rain, _, _ = orographic_rainfall(terrain, x_km, 10, 28, 18, wind_angle=angle_to_normal)
    rain_by_direction.append(rain.sum())

rain_by_direction = np.array(rain_by_direction)
theta = np.radians(directions)
# Add closing point
theta_closed = np.append(theta, theta[0])
rain_closed = np.append(rain_by_direction, rain_by_direction[0])

ax3.fill(theta_closed, rain_closed / rain_closed.max() * 100, color='#3b82f6', alpha=0.3)
ax3.plot(theta_closed, rain_closed / rain_closed.max() * 100, color='#3b82f6', linewidth=2)
ax3.set_title('Rainfall Rose (% of max)', color='white', fontsize=11, pad=20)
ax3.set_theta_zero_location('N')
ax3.set_theta_direction(-1)
ax3.tick_params(colors='gray')

# Plot 4: Complete model output — terrain + clouds + rain
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
rain_final, clouds_final, T_final = orographic_rainfall(terrain, x_km, 12, 28, 18)
# Cloud visualization
cloud_base = np.where(clouds_final, terrain, np.nan)
cloud_top = np.where(clouds_final, terrain + 1500, np.nan)

ax4.fill_between(x_km, 0, terrain, color='#4a3728', alpha=0.6)
ax4.plot(x_km, terrain, color='#8B6914', linewidth=2)
# Cloud layer
for i in range(len(x_km) - 1):
    if clouds_final[i]:
        ax4.fill_between(x_km[i:i+2], terrain[i:i+2], terrain[i:i+2] + 1500,
                         color='#94a3b8', alpha=0.3)
# Rain drops
rain_x = x_km[rain_final > 0.5]
for rx in rain_x[::5]:
    ax4.plot([rx, rx], [terrain[np.argmin(np.abs(x_km - rx))] + 200,
                         terrain[np.argmin(np.abs(x_km - rx))] + 1200],
             color='#3b82f6', linewidth=0.5, alpha=0.5)

ax4_rain = ax4.twinx()
ax4_rain.fill_between(x_km, 0, rain_final, color='#3b82f6', alpha=0.3)
ax4_rain.plot(x_km, rain_final, color='#3b82f6', linewidth=2)
ax4_rain.set_ylabel('Rainfall (mm/hr)', color='#3b82f6')

ax4.text(20, 3800, 'Monsoon wind →', color='white', fontsize=12, fontweight='bold')
ax4.text(60, terrain.max() + 200, 'Tawang', color='#fbbf24', fontsize=10, fontweight='bold')
ax4.set_xlabel('Distance (km)', color='white')
ax4.set_ylabel('Elevation (m)', color='white')
ax4.set_title('Complete Orographic Model Output', color='white', fontsize=11)
ax4.tick_params(colors='gray'); ax4_rain.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Print full report
print("=" * 65)
print("  OROGRAPHIC RAINFALL MODEL — TAWANG HIMALAYAN FRONT")
print("=" * 65)
print(f"\\nModel parameters:")
print(f"  Terrain: Himalayan profile, peak = {terrain.max():.0f}m")
print(f"  Initial conditions: T=28°C, moisture=18 g/kg")
print(f"  Reference wind: 12 m/s (perpendicular)")
print()
print(f"Results:")
print(f"  Peak rainfall rate: {rain_final.max():.1f} mm/hr")
print(f"  Rainfall location: {x_km[np.argmax(rain_final)]:.0f} km (windward slope)")
print(f"  Total transect rainfall: {rain_final.sum() * 0.2:.0f} mm (integrated)")
print(f"  Rain shadow ratio: {rain_final[x_km > 70].mean() / max(rain_final[x_km < 50].mean(), 0.01):.2f}")
print(f"  Foehn warming: air exits {T_final:.1f}°C warmer and drier than it entered")
print()
print("Wind direction sensitivity:")
for angle in [0, 30, 45, 60, 90]:
    rain_a, _, _ = orographic_rainfall(terrain, x_km, 10, 28, 18, wind_angle=angle)
    print(f"  {angle:>2}° from ridge normal: {rain_a.sum()/total_rain[0]*100:>5.1f}% of max rainfall")
print()
print("This model explains why the cloud weaver knows which winds bring rain:")
print("Only winds with a strong component perpendicular to the Himalayan ridge")
print("produce significant orographic uplift and precipitation at Tawang.")`,
      challenge: 'Extend the model to 2D: create a realistic topographic map (a valley between two ridges) and compute rainfall for an array of wind directions. Produce a map of annual rainfall accumulation by combining all wind directions weighted by their climatological frequency.',
      successHint: 'You have built a physics-based precipitation model from first principles. Orographic rainfall models of this type are used operationally for flood forecasting, water resource assessment, and climate downscaling. Your model captures the essential insight: mountain rainfall is the product of atmospheric moisture and topographic uplift, and predicting it requires understanding both.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build an Orographic Rainfall Model from mountain elevation and wind direction</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a physics-based orographic precipitation model. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
