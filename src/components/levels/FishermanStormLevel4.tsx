import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import StormTrackerPipelineDiagram from '../diagrams/StormTrackerPipelineDiagram';
import StormHistoricalTracksDiagram from '../diagrams/StormHistoricalTracksDiagram';
import StormCLIPERDiagram from '../diagrams/StormCLIPERDiagram';
import StormDvorakDiagram from '../diagrams/StormDvorakDiagram';
import StormImpactAssessmentDiagram from '../diagrams/StormImpactAssessmentDiagram';
import StormDashboardDiagram from '../diagrams/StormDashboardDiagram';

export default function FishermanStormLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Project Design — Building a Cyclone Tracker',
      concept: `In Levels 1-3 you learned the physics of storms: pressure gradients, Coriolis rotation, sea surface temperature, numerical weather prediction, storm surge, and climate impacts. Now you will integrate everything into a single project — a **Bay of Bengal Cyclone Tracker** that ingests historical cyclone data, visualizes tracks, predicts future motion, estimates intensity, and assesses coastal impact.

Real operational cyclone trackers (like those used by the India Meteorological Department or JTWC) combine satellite imagery, radar, weather station data, and numerical model output. Our simplified version will use the same core algorithms but with synthetic data modeled on real Bay of Bengal cyclone statistics. The key components are:

1. **Data layer**: Historical cyclone tracks with position, intensity, and timing. We will generate realistic synthetic data based on published Bay of Bengal cyclone climatology.
2. **Visualization layer**: Map-based display of tracks, intensity color-coding, and statistical overlays showing common tracks and landfall zones.
3. **Prediction layer**: A persistence-climatology model (CLIPER) that predicts future motion by blending a cyclone's recent movement with historical average motion at that location and time of year.
4. **Intensity layer**: A simplified Dvorak-like technique that estimates intensity from environmental parameters (SST, wind shear, distance from land).
5. **Impact layer**: Storm surge estimation from pressure deficit and wind speed, applied to Bay of Bengal coastal profiles.

Each of the remaining five mini-lessons builds one of these components. By the end, you will have a complete, working cyclone analysis tool.`,
      analogy: 'Building a cyclone tracker is like assembling a weather station from components. Each sensor (barometer, anemometer, rain gauge) is useful alone, but the real power comes from integrating them into a dashboard that tells a coherent story. Your data module is the sensor array, your prediction model is the brain, and your visualization is the display panel.',
      storyConnection: 'The fisherman\'s daughter had no satellite imagery or computer models — she had her father\'s experience and the color of the sky. But the tracker you will build encodes the same knowledge: where storms tend to form, how they tend to move, what makes them strengthen or weaken. Every algorithm in this project translates a piece of traditional maritime knowledge into quantitative code that can warn thousands of fishing families along the Brahmaputra delta.',
      checkQuestion: 'Why is a "persistence-climatology" model (CLIPER) used as a baseline for cyclone track forecasting instead of simply extrapolating the current motion (pure persistence)?',
      checkAnswer: 'Pure persistence assumes the cyclone will keep moving in the same direction at the same speed indefinitely. This fails because cyclones curve — especially in the Bay of Bengal where they often recurve northward and then northeastward as they interact with mid-latitude westerlies. Climatology captures this average curvature. Blending persistence (recent motion) with climatology (what storms historically do at this location and season) gives a baseline that is surprisingly hard to beat for short-range forecasts. Any model that cannot outperform CLIPER is not worth using.',
      codeIntro: 'Set up the project framework: define data structures for cyclone tracks, create the synthetic data generator calibrated to Bay of Bengal statistics, and build the base visualization.',
      code: `import numpy as np

np.random.seed(42)

# ============================================================
# CYCLONE TRACKER: Project Framework & Data Structures
# ============================================================

class CycloneTrack:
    """Represents a single cyclone's life history."""
    def __init__(self, name, year, season, lats, lons, winds, pressures, times):
        self.name = name
        self.year = year
        self.season = season  # 'pre-monsoon' or 'post-monsoon'
        self.lats = np.array(lats)
        self.lons = np.array(lons)
        self.winds = np.array(winds)       # max sustained wind (m/s)
        self.pressures = np.array(pressures)  # central pressure (hPa)
        self.times = np.array(times)        # hours since genesis
        self.n_points = len(lats)

    def category(self):
        """Saffir-Simpson category from max wind."""
        vmax = self.winds.max()
        if vmax >= 70: return 5
        if vmax >= 58: return 4
        if vmax >= 50: return 3
        if vmax >= 43: return 2
        if vmax >= 33: return 1
        return 0  # tropical storm or depression

    def landfall_point(self):
        """Find approximate landfall (first point where lat > 20 and lon < 92)."""
        for i in range(self.n_points):
            if self.lats[i] > 20 and self.lons[i] < 92:
                return self.lats[i], self.lons[i], self.winds[i]
        return None

def generate_bob_cyclone(name, year, season):
    """
    Generate a realistic Bay of Bengal cyclone track.
    Based on published BoB cyclone statistics:
    - Genesis: 8-15°N, 82-92°E
    - Motion: generally NW to NNE
    - Recurvature common above 18°N
    - Typical lifespan: 3-10 days
    """
    # Genesis location
    if season == 'pre-monsoon':
        lat0 = np.random.uniform(8, 13)
        lon0 = np.random.uniform(84, 92)
    else:
        lat0 = np.random.uniform(7, 14)
        lon0 = np.random.uniform(82, 90)

    n_steps = np.random.randint(20, 60)
    lats, lons = [lat0], [lon0]
    base_dlat = np.random.uniform(0.15, 0.35)
    base_dlon = np.random.uniform(-0.25, -0.05)
    for i in range(1, n_steps):
        dlat = base_dlat * (max(0.3, 1 - 0.05*(lats[-1]-18)) if lats[-1]>18 else 1)
        dlon = base_dlon + (0.02*(lats[-1]-18) if lats[-1]>18 else 0)
        dlat += np.random.normal(0, 0.08)
        dlon += np.random.normal(0, 0.08)
        new_lat, new_lon = lats[-1]+dlat, lons[-1]+dlon
        if new_lat > 26 or new_lon < 78 or new_lon > 100: break
        lats.append(new_lat); lons.append(new_lon)

    n = len(lats)
    times = np.arange(n) * 6
    peak_idx = np.random.randint(n//3, 2*n//3)
    max_wind = np.random.choice([25,30,35,40,45,50,55,60,65,70],
                                 p=[.15,.15,.15,.15,.12,.10,.08,.05,.03,.02])
    winds = np.zeros(n)
    for i in range(n):
        if i <= peak_idx: winds[i] = 15 + (max_wind-15)*(i/peak_idx)**1.5
        else: winds[i] = max(max_wind*(1-((i-peak_idx)/(n-peak_idx))**1.2), 10)
    winds = np.clip(winds + np.random.normal(0, 2, n), 10, 80)
    pressures = 1013 - 0.7 * winds
    return CycloneTrack(name, year, season, lats, lons, winds, pressures, times)

# Generate dataset
cyclones = []
for yr in range(2000, 2024):
    for s in ['pre-monsoon', 'post-monsoon']:
        n_storms = np.random.randint(1, 4)
        for j in range(n_storms):
            cyclones.append(generate_bob_cyclone(f"BOB-{yr}-{s[:3].upper()}-{j+1}", yr, s))

print("Bay of Bengal Cyclone Dataset")
print("=" * 45)
print(f"Total cyclones generated: {len(cyclones)}")
cats = [c.category() for c in cyclones]
for cat in range(6):
    count = cats.count(cat)
    if count > 0:
        label = f"Cat {cat}" if cat > 0 else "TD/TS"
        print(f"  {label}: {count} ({count/len(cyclones)*100:.0f}%)")
print()
landfalls = [c for c in cyclones if c.landfall_point() is not None]
print(f"Storms making landfall: {len(landfalls)}")
print(f"Average track length: {np.mean([c.n_points for c in cyclones]):.0f} positions")
print(f"Average lifespan: {np.mean([c.times[-1] for c in cyclones]):.0f} hours")`,
      challenge: 'Enhance the data generator to include rapid intensification events (wind speed increase of 15+ m/s in 24 hours). What fraction of your cyclones undergo RI? How does this compare to the observed ~10-15% rate in the Bay of Bengal?',
      successHint: 'Good synthetic data is the foundation of any analysis tool. By calibrating your generator to real statistics, you can test algorithms without needing access to restricted operational datasets. This is a standard technique in meteorological research.',
    },
    {
      title: 'Historical Data Analysis — Cyclone Track Climatology',
      concept: `Before building any predictive model, you must understand the data. Cyclone climatology — the statistical study of where, when, and how storms behave — reveals patterns that form the backbone of every forecasting system. For the Bay of Bengal, the key climatological facts are:

**Seasonality**: Two distinct cyclone seasons — pre-monsoon (April-June) and post-monsoon (October-December). Post-monsoon produces more and stronger cyclones because the Bay retains summer heat while atmospheric conditions become favorable for organized convection.

**Genesis zones**: Most Bay of Bengal cyclones form between 8-14°N and 82-92°E. The central and southern Bay is the nursery. The Andaman Sea contributes some storms, especially in the post-monsoon season.

**Track patterns**: The dominant motion is northwestward, driven by the subtropical ridge. However, many storms recurve — turning northward and then northeastward as they interact with mid-latitude troughs. The recurvature point is critical: it determines whether a storm hits the Indian coast (Odisha, Andhra Pradesh) or curves toward Bangladesh and Myanmar.

Analyzing these patterns quantitatively — computing track density maps, landfall probability distributions, intensity statistics by location — gives you the "climatology" half of the CLIPER (CLImatology and PERsistence) forecasting model. Every point in the Bay of Bengal has an average cyclone motion vector derived from decades of historical data. This vector tells you: "storms passing through this grid cell, at this time of year, typically move in direction X at speed Y."`,
      analogy: 'Cyclone climatology is like studying traffic patterns on a highway. Most cars (cyclones) travel in the same general direction, at similar speeds, with predictable rush hours (cyclone seasons). Some take the main exit (landfall on the Indian coast), others continue straight (cross into Bangladesh). By counting thousands of trips, you learn the most probable routes — even though individual cars deviate.',
      storyConnection: 'The fisherman\'s elders on the Brahmaputra knew that October and November were the dangerous months. They knew storms approached from the south-southeast. They knew that a storm moving slowly was more dangerous than a fast-moving one because it dumped more rain. This was climatological knowledge — accumulated over generations of observation. Your analysis code formalizes the same wisdom into probability maps and statistical distributions.',
      checkQuestion: 'Why is track density (number of cyclone positions per grid cell) more useful than simply counting the number of cyclones that form in each grid cell?',
      checkAnswer: 'A cyclone that forms elsewhere can still pass through your grid cell. Track density captures total exposure — the number of times any cyclone occupies a given location, regardless of where it formed. A coastal grid cell might have zero genesis events but very high track density because it sits on a common approach path. For risk assessment, track density (exposure) matters more than genesis density (origin).',
      codeIntro: 'Perform a full climatological analysis of the synthetic dataset: track density maps, monthly distribution, intensity statistics by region, and average motion vectors.',
      code: `import numpy as np

np.random.seed(42)

# Regenerate cyclone dataset (same as MiniLesson 1)
class CycloneTrack:
    def __init__(self, name, year, season, lats, lons, winds, pressures, times):
        self.name, self.year, self.season = name, year, season
        self.lats, self.lons = np.array(lats), np.array(lons)
        self.winds, self.pressures = np.array(winds), np.array(pressures)
        self.times, self.n_points = np.array(times), len(lats)
    def category(self):
        vmax = self.winds.max()
        if vmax >= 70: return 5
        if vmax >= 58: return 4
        if vmax >= 50: return 3
        if vmax >= 43: return 2
        if vmax >= 33: return 1
        return 0

def generate_bob_cyclone(name, year, season):
    lat0 = np.random.uniform(8, 13) if season == 'pre-monsoon' else np.random.uniform(7, 14)
    lon0 = np.random.uniform(84, 92) if season == 'pre-monsoon' else np.random.uniform(82, 90)
    n_steps = np.random.randint(20, 60)
    lats, lons = [lat0], [lon0]
    base_dlat = np.random.uniform(0.15, 0.35)
    base_dlon = np.random.uniform(-0.25, -0.05)
    for i in range(1, n_steps):
        if lats[-1] > 18:
            dlat = base_dlat * max(0.3, 1 - 0.05 * (lats[-1] - 18))
            dlon = base_dlon + 0.02 * (lats[-1] - 18)
        else:
            dlat, dlon = base_dlat, base_dlon
        dlat += np.random.normal(0, 0.08)
        dlon += np.random.normal(0, 0.08)
        new_lat, new_lon = lats[-1] + dlat, lons[-1] + dlon
        if new_lat > 26 or new_lon < 78 or new_lon > 100: break
        lats.append(new_lat); lons.append(new_lon)
    n = len(lats)
    times = np.arange(n) * 6
    peak_idx = np.random.randint(n // 3, 2 * n // 3)
    max_wind = np.random.choice([25,30,35,40,45,50,55,60,65,70],
                                 p=[.15,.15,.15,.15,.12,.10,.08,.05,.03,.02])
    winds = np.zeros(n)
    for i in range(n):
        if i <= peak_idx: winds[i] = 15 + (max_wind - 15) * (i / peak_idx)**1.5
        else:
            decay = (i - peak_idx) / (n - peak_idx)
            winds[i] = max(max_wind * (1 - decay**1.2), 10)
    winds = np.clip(winds + np.random.normal(0, 2, n), 10, 80)
    pressures = 1013 - 0.7 * winds
    return CycloneTrack(name, year, season, lats, lons, winds, pressures, times)

cyclones = []
for yr in range(2000, 2024):
    for s in ['pre-monsoon', 'post-monsoon']:
        for j in range(np.random.randint(1, 4)):
            cyclones.append(generate_bob_cyclone(f"BOB-{yr}-{s[:3].upper()}-{j+1}", yr, s))

# Track density on 2-degree grid
lat_bins = np.arange(5, 27, 2)
lon_bins = np.arange(75, 101, 2)
density = np.zeros((len(lat_bins)-1, len(lon_bins)-1))
motion_dlat = np.zeros_like(density)
motion_dlon = np.zeros_like(density)
motion_count = np.zeros_like(density)

for c in cyclones:
    for k in range(c.n_points):
        li = np.searchsorted(lat_bins, c.lats[k]) - 1
        lj = np.searchsorted(lon_bins, c.lons[k]) - 1
        if 0 <= li < density.shape[0] and 0 <= lj < density.shape[1]:
            density[li, lj] += 1
            if k < c.n_points - 1:
                motion_dlat[li, lj] += c.lats[k+1] - c.lats[k]
                motion_dlon[li, lj] += c.lons[k+1] - c.lons[k]
                motion_count[li, lj] += 1

mask = motion_count > 0
motion_dlat[mask] /= motion_count[mask]
motion_dlon[mask] /= motion_count[mask]

print("Bay of Bengal Cyclone Climatology")
print("=" * 50)
print(f"Dataset: {len(cyclones)} cyclones (2000-2023)")
print()
print("Seasonal distribution:")
pre = sum(1 for c in cyclones if c.season == 'pre-monsoon')
post = len(cyclones) - pre
print(f"  Pre-monsoon (Apr-Jun):  {pre} ({pre/len(cyclones)*100:.0f}%)")
print(f"  Post-monsoon (Oct-Dec): {post} ({post/len(cyclones)*100:.0f}%)")
print()
peak_cell = np.unravel_index(density.argmax(), density.shape)
print(f"Highest track density: {density.max():.0f} positions")
print(f"  at {lat_bins[peak_cell[0]]}-{lat_bins[peak_cell[0]+1]}°N, "
      f"{lon_bins[peak_cell[1]]}-{lon_bins[peak_cell[1]+1]}°E")
print()
print("Average motion vectors (top 5 busiest cells):")
flat_idx = np.argsort(density.ravel())[::-1][:5]
for idx in flat_idx:
    i, j = np.unravel_index(idx, density.shape)
    if motion_count[i, j] > 0:
        speed = np.sqrt(motion_dlat[i, j]**2 + motion_dlon[i, j]**2) * 111 / 6
        print(f"  {lat_bins[i]:.0f}-{lat_bins[i+1]:.0f}°N, {lon_bins[j]:.0f}-{lon_bins[j+1]:.0f}°E: "
              f"dlat={motion_dlat[i,j]:+.2f}°, dlon={motion_dlon[i,j]:+.2f}° per 6h "
              f"(~{speed:.0f} km/h)")`,
      challenge: 'Compute the "return period" for different intensity thresholds at a specific coastal grid cell (e.g., near Kolkata at 88°E, 22°N). How often does a Cat 3+ cyclone pass within 200 km? Express it as "once every N years."',
      successHint: 'Climatology is the foundation of probabilistic forecasting. Every number you computed — average motion, track density, intensity distribution — feeds directly into the prediction model. Without climatology, prediction is just extrapolation. With it, prediction becomes informed estimation.',
    },
    {
      title: 'Track Prediction — Persistence-Climatology Model (CLIPER)',
      concept: `The simplest useful cyclone track forecast blends two ideas: **persistence** (the storm will keep doing what it has been doing) and **climatology** (the storm will do what storms historically do at this location and season). This combination is called **CLIPER** (CLImatology and PERsistence), and it has been the official baseline for cyclone track forecasting since the 1970s.

Persistence extrapolates the cyclone's recent motion (over the past 12-24 hours) forward in time. If a storm has been moving northwest at 20 km/h, persistence says it will continue northwest at 20 km/h. This works well for 6-12 hours but degrades quickly because cyclones curve, accelerate, and decelerate.

Climatology uses the average motion vector at the cyclone's current location and time of year, derived from the historical database. It captures the large-scale steering patterns (e.g., the subtropical ridge pushes Bay of Bengal storms northwest, mid-latitude westerlies cause recurvature) but ignores the current storm's specific behavior.

CLIPER blends the two with time-dependent weights: at short forecast horizons (6-12 hours), persistence gets most of the weight because the storm's recent motion is more informative than the historical average. At longer horizons (48-72 hours), climatology dominates because persistence has decayed to uselessness. The formula is: **forecast_motion = alpha(t) * persistence + (1 - alpha(t)) * climatology**, where alpha(t) decreases from ~0.8 at 6 hours to ~0.2 at 72 hours. Any operational model that cannot beat CLIPER is considered to have no skill.`,
      analogy: 'Predicting a cyclone\'s path with CLIPER is like predicting where a taxi will be in 10 minutes. For the next 2 minutes, you just extend its current direction (persistence). For the next 10 minutes, you also consider that most taxis in this area are heading toward the airport (climatology). You weight your prediction toward the current direction for near-term and toward the common destination for longer-term.',
      storyConnection: 'When the fisherman\'s daughter watched a storm approach from the south-southeast over two days, the elders combined their immediate observation ("it is heading straight for us") with decades of memory ("storms like this usually curve east before reaching our village"). They were computing a CLIPER forecast in their heads — blending persistence with climatology. Sometimes the climatology saved them. Sometimes the storm defied the average.',
      checkQuestion: 'At a 72-hour forecast horizon, a CLIPER model gives 80% weight to climatology and 20% to persistence. A new ML model beats CLIPER at 72 hours by 15%. Is this impressive? What about beating it by 2%?',
      checkAnswer: 'Beating CLIPER by 15% at 72 hours is genuinely impressive — it means the ML model captures steering patterns that neither persistence nor historical averages encode (likely from current atmospheric state data). Beating it by only 2% is marginal — it could be noise or overfitting. The bar for "skillful" is consistently beating CLIPER. For operational use, a model needs to beat it by a meaningful margin across many storms, not just on average. CLIPER is deceptively hard to beat because it encodes so much information in a simple formula.',
      codeIntro: 'Implement a full CLIPER model: compute persistence from recent track points, look up climatological motion vectors, blend them with time-dependent weights, and evaluate forecast skill.',
      code: `import numpy as np

np.random.seed(42)

# Regenerate dataset (compact version)
def gen_cyclone(seed_offset=0):
    rs = np.random.RandomState(42 + seed_offset)
    lat0 = rs.uniform(8, 14)
    lon0 = rs.uniform(82, 92)
    n_steps = rs.randint(25, 55)
    lats, lons = [lat0], [lon0]
    bdlat, bdlon = rs.uniform(0.15, 0.35), rs.uniform(-0.25, -0.05)
    for i in range(1, n_steps):
        dl = bdlat * (max(0.3, 1 - 0.05*(lats[-1]-18)) if lats[-1]>18 else 1)
        dn = bdlon + (0.02*(lats[-1]-18) if lats[-1]>18 else 0)
        dl += rs.normal(0, 0.08); dn += rs.normal(0, 0.08)
        nl, nn = lats[-1]+dl, lons[-1]+dn
        if nl > 26 or nn < 78 or nn > 100: break
        lats.append(nl); lons.append(nn)
    return np.array(lats), np.array(lons)

# Generate training set (20 cyclones) and test set (5 cyclones)
train_cyclones = [gen_cyclone(i) for i in range(20)]
test_cyclones = [gen_cyclone(i + 100) for i in range(5)]

# Build climatology grid: average motion per 2-degree cell
lat_bins = np.arange(5, 27, 2)
lon_bins = np.arange(75, 101, 2)
clim_dlat = np.zeros((len(lat_bins)-1, len(lon_bins)-1))
clim_dlon = np.zeros((len(lat_bins)-1, len(lon_bins)-1))
clim_count = np.zeros((len(lat_bins)-1, len(lon_bins)-1))

for lats, lons in train_cyclones:
    for k in range(len(lats) - 1):
        li = np.searchsorted(lat_bins, lats[k]) - 1
        lj = np.searchsorted(lon_bins, lons[k]) - 1
        if 0 <= li < clim_dlat.shape[0] and 0 <= lj < clim_dlat.shape[1]:
            clim_dlat[li, lj] += lats[k+1] - lats[k]
            clim_dlon[li, lj] += lons[k+1] - lons[k]
            clim_count[li, lj] += 1

mask = clim_count > 0
clim_dlat[mask] /= clim_count[mask]
clim_dlon[mask] /= clim_count[mask]

# Default motion for cells with no data
default_dlat = np.mean(clim_dlat[mask]) if mask.any() else 0.2
default_dlon = np.mean(clim_dlon[mask]) if mask.any() else -0.1

def get_climatology(lat, lon):
    """Look up average motion vector for a grid cell."""
    li = np.searchsorted(lat_bins, lat) - 1
    lj = np.searchsorted(lon_bins, lon) - 1
    if 0 <= li < clim_dlat.shape[0] and 0 <= lj < clim_dlat.shape[1] and clim_count[li, lj] > 0:
        return clim_dlat[li, lj], clim_dlon[li, lj]
    return default_dlat, default_dlon

def cliper_forecast(lats, lons, n_ahead=12):
    """CLIPER: blend persistence with climatology."""
    # Persistence from last 3 points
    p_dlat = (lats[-1] - lats[-3]) / 2
    p_dlon = (lons[-1] - lons[-3]) / 2
    fc_lats, fc_lons = [lats[-1]], [lons[-1]]
    for t in range(1, n_ahead + 1):
        alpha = 0.8 * np.exp(-t / 8.0)  # persistence weight decays
        c_dlat, c_dlon = get_climatology(fc_lats[-1], fc_lons[-1])
        dlat = alpha * p_dlat + (1 - alpha) * c_dlat
        dlon = alpha * p_dlon + (1 - alpha) * c_dlon
        fc_lats.append(fc_lats[-1] + dlat)
        fc_lons.append(fc_lons[-1] + dlon)
    return np.array(fc_lats), np.array(fc_lons)

# Evaluate on test cyclones
print("CLIPER Track Forecast Evaluation")
print("=" * 50)
print(f"Training set: {len(train_cyclones)} cyclones")
print(f"Test set: {len(test_cyclones)} cyclones")
print(f"Climatology grid: {clim_dlat.shape[0]}x{clim_dlat.shape[1]} cells")
print(f"Default motion: dlat={default_dlat:+.3f}°, dlon={default_dlon:+.3f}° per step")
print()

horizons = [2, 4, 8, 12]
for tc_idx, (lats, lons) in enumerate(test_cyclones):
    if len(lats) < 16: continue
    fc_lats, fc_lons = cliper_forecast(lats[:4], lons[:4], n_ahead=12)
    print(f"Cyclone {tc_idx + 1} (starts at {lats[0]:.1f}°N, {lons[0]:.1f}°E):")
    for h in horizons:
        if 4 + h < len(lats) and h < len(fc_lats):
            err_km = np.sqrt((fc_lats[h]-lats[4+h])**2 + (fc_lons[h]-lons[4+h])**2) * 111
            print(f"  {h*6:2d}h forecast error: {err_km:.0f} km")
    print()`,
      challenge: 'Implement an "analog" forecaster: find the 3 most similar historical tracks (based on recent motion and position), and average their future paths. Compare it to CLIPER. Does the analog method beat CLIPER?',
      successHint: 'CLIPER is elegant in its simplicity — two ingredients, one blending formula, and it provides a surprisingly good baseline. This is a recurring lesson in forecasting: simple models calibrated to good data often outperform complex models trained on poor data. Always benchmark against the simple baseline first.',
    },
    {
      title: 'Intensity Estimation — Simplified Dvorak Technique',
      concept: `Predicting where a cyclone goes (track) and how strong it is (intensity) are two different problems. Track forecasting has improved dramatically over the past 30 years, but intensity forecasting remains stubbornly difficult. The **Dvorak technique**, developed by Vernon Dvorak in the 1970s, is the foundation of operational intensity estimation from satellite imagery.

The original Dvorak technique is a pattern-matching method: trained analysts compare satellite cloud patterns to a set of templates and assign a "T-number" (intensity score from 1.0 to 8.0) based on the degree of organization. Key features include: the presence of an eye, the temperature difference between the warm eye and cold surrounding clouds, the symmetry of the cloud pattern, and the spiral banding structure. Higher T-numbers correspond to stronger winds: T1.0 = 25 knots, T8.0 = 170 knots.

For our simplified computational version, we estimate intensity from **environmental parameters** rather than cloud imagery. The key predictors are: (1) **Sea surface temperature** — warmer water provides more energy. (2) **Vertical wind shear** — the difference in wind speed/direction between the surface and upper atmosphere. High shear tears a cyclone apart; low shear allows it to intensify. (3) **Distance from land** — land interaction weakens storms. (4) **Upper ocean heat content** — deep warm water sustains intensity even after wind mixing. These four variables explain roughly 70% of intensity variance in statistical models, making them a reasonable proxy for the full Dvorak analysis.`,
      analogy: 'The Dvorak technique is like diagnosing a patient from an X-ray. A radiologist does not need to take the patient\'s temperature or blood pressure — they can estimate health from the image pattern alone. Similarly, a Dvorak analyst estimates cyclone intensity from cloud pattern shapes without needing direct wind measurements. Our simplified version is like a nurse using a checklist (SST, shear, distance) instead of the X-ray — less precise but faster and automated.',
      storyConnection: 'Before satellites, the fisherman\'s daughter\'s only intensity information came from the old men reading the sky: "The clouds are building tall and the wind is backing — this will be a strong one." The Dvorak technique formalized this visual pattern recognition. Today, India Meteorological Department analysts in Delhi estimate the intensity of Bay of Bengal cyclones that threaten Brahmaputra delta communities using the same core pattern-matching logic — augmented by algorithms that run in seconds instead of hours.',
      checkQuestion: 'Why is high vertical wind shear destructive to a developing cyclone? Think about the cyclone as a vertical stack of rotating air.',
      checkAnswer: 'A cyclone is a vertically coherent vortex — the rotation must be aligned from the ocean surface to the upper troposphere. High wind shear means the upper-level winds blow in a different direction or speed than the surface winds. This tilts the vortex, displacing the warm core aloft from the surface circulation. The feedback loop (warm core -> low pressure -> inflow -> evaporation -> more warming) breaks down because the energy release aloft is no longer positioned above the surface low. The cyclone becomes lopsided and weakens. Think of it as trying to spin a top while someone pushes the top sideways — the spin cannot maintain itself.',
      codeIntro: 'Build a statistical intensity model using environmental predictors (SST, shear, distance from land, ocean heat content). Evaluate it against a simple persistence baseline.',
      code: `import numpy as np

np.random.seed(42)

# ============================================================
# INTENSITY ESTIMATION MODEL
# ============================================================

# Generate synthetic environmental data for cyclone positions
n_samples = 500

# Environmental predictors
sst = np.random.uniform(25, 32, n_samples)           # SST (°C)
shear = np.random.uniform(2, 30, n_samples)           # wind shear (m/s)
dist_land = np.random.uniform(0, 800, n_samples)      # distance from land (km)
ohc = np.random.uniform(10, 120, n_samples)           # ocean heat content (kJ/cm²)

# True intensity model (simplified physics):
# V_max depends on SST (positive), shear (negative), dist_land (positive then plateau),
# and OHC (positive)
def true_intensity(sst, shear, dist_land, ohc, noise_std=5):
    """Simplified intensity model based on environmental parameters."""
    # SST contribution: ramps up above 26.5°C
    sst_term = np.maximum(0, (sst - 26.5)) * 12

    # Shear penalty: strong negative effect
    shear_term = -1.5 * shear

    # Distance from land: weakens near coast
    land_term = 10 * (1 - np.exp(-dist_land / 200))

    # OHC: additional energy reservoir
    ohc_term = 0.1 * ohc

    intensity = 20 + sst_term + shear_term + land_term + ohc_term
    intensity += np.random.normal(0, noise_std, len(sst))
    return np.clip(intensity, 10, 80)

wind_true = true_intensity(sst, shear, dist_land, ohc)

# Split into train/test
n_train = 400
X = np.column_stack([sst, shear, dist_land, ohc])
y = wind_true

X_train, X_test = X[:n_train], X[n_train:]
y_train, y_test = y[:n_train], y[n_train:]

# Multiple linear regression from scratch (normal equation)
def fit_linear_regression(X, y):
    """Fit y = X @ beta using the normal equation."""
    X_b = np.column_stack([np.ones(len(X)), X])  # add bias
    beta = np.linalg.lstsq(X_b, y, rcond=None)[0]
    return beta

beta = fit_linear_regression(X_train, y_train)

# Predict on test set
X_test_b = np.column_stack([np.ones(len(X_test)), X_test])
y_pred = X_test_b @ beta

# Evaluate
rmse = np.sqrt(np.mean((y_pred - y_test)**2))
mae = np.mean(np.abs(y_pred - y_test))
persistence_rmse = np.sqrt(np.mean((np.mean(y_train) - y_test)**2))

print("Statistical Intensity Estimation Model")
print("=" * 50)
print(f"Training samples: {n_train}, Test samples: {len(y_test)}")
print()
print("Regression coefficients:")
labels = ['Bias', 'SST (°C)', 'Shear (m/s)', 'Dist land (km)', 'OHC (kJ/cm²)']
for name, coef in zip(labels, beta):
    print(f"  {name:20s}: {coef:+.4f}")
print()
print("Physical interpretation:")
print(f"  +1°C SST -> {beta[1]:+.1f} m/s wind (warm = stronger)")
print(f"  +1 m/s shear -> {beta[2]:+.1f} m/s wind (shear = weaker)")
print(f"  +100 km from land -> {beta[3]*100:+.1f} m/s wind")
print()
print(f"Test RMSE: {rmse:.1f} m/s")
print(f"Test MAE:  {mae:.1f} m/s")
print(f"Climatology baseline RMSE: {persistence_rmse:.1f} m/s")
print(f"Skill over baseline: {(1 - rmse/persistence_rmse)*100:.0f}%")`,
      challenge: 'Add a "rapid intensification" detector: flag samples where intensity increases by more than 15 m/s in 24 hours. What environmental conditions are associated with RI events? Build a logistic regression classifier to predict RI probability.',
      successHint: 'Intensity forecasting is the hardest problem in tropical meteorology. Even with satellites, AI, and supercomputers, 24-hour intensity forecasts still have average errors of 5-10 m/s. Understanding the key predictors — SST, shear, ocean heat content — is the first step toward reducing those errors.',
    },
    {
      title: 'Impact Assessment — Storm Surge from Pressure & Wind',
      concept: `The final step in our cyclone tracker converts meteorological data (wind speed, pressure deficit) into **human impact metrics** — specifically, storm surge height. This is where physics meets consequence. A cyclone with 60 m/s winds over the open ocean is a scientific phenomenon. The same cyclone pushing a 5-meter wall of water into a fishing village is a disaster.

The total water level at the coast during a cyclone is the sum of: (1) **Astronomical tide** — the normal tidal cycle. A cyclone arriving at high tide adds its surge on top of an already elevated ocean. (2) **Inverse barometer effect** — 1 cm rise per 1 hPa pressure deficit. (3) **Wind setup** — onshore wind stress pushing water against the coast. This is the dominant term and depends on wind speed squared, duration, fetch (distance over water), and shelf bathymetry. (4) **Wave setup** — breaking waves near shore push additional water up the beach.

A simplified but useful formula for total surge height is: **S = 0.01 * (1013 - P_center) + C * V_max^2 * L / (g * D)**, where P_center is central pressure, V_max is maximum wind, L is the fetch length over shallow shelf, D is the average shelf depth, g is gravity, and C is a drag coefficient. For the Bay of Bengal with its wide shallow shelf (D ~ 30m, L ~ 300km), this formula predicts catastrophic surges for any major cyclone. The 1970 Bhola cyclone (P_center ~ 966 hPa, V_max ~ 55 m/s) produced a 10-meter surge — the deadliest natural disaster of the 20th century.`,
      analogy: 'Computing storm surge from cyclone parameters is like computing flood damage from rainfall: you need to know the rain (wind/pressure), the terrain (bathymetry), and the drainage (how fast water can flow away). A heavy rainstorm on a mountain drains quickly. The same rain in a flat valley floods. Similarly, a strong cyclone on a steep coast produces modest surge, while the same cyclone on a shallow shelf creates a catastrophe.',
      storyConnection: 'For the fisherman\'s daughter, storm surge was not a number in a model — it was the water that took her uncle\'s boat, flooded the rice paddies with salt, and left her family sleeping on the school roof for a week. The surge calculator you build converts the same atmospheric variables that weather services track into the water levels that determine whether a village evacuates in time. Every meter of predicted surge corresponds to thousands of lives and livelihoods along the Brahmaputra delta.',
      checkQuestion: 'A cyclone has P_center = 960 hPa and V_max = 55 m/s. It approaches the coast at high tide (0.8m above mean sea level). The shelf is 300 km wide and 25m deep on average. Qualitatively, would you expect a larger surge component from the inverse barometer effect or from the wind setup? Why?',
      checkAnswer: 'The wind setup dominates. The inverse barometer effect gives 0.01 * (1013 - 960) = 0.53 meters — significant but not catastrophic. The wind setup over a 300 km, 25m-deep shelf with 55 m/s winds is much larger — typically 3-7 meters depending on exact geometry and friction. Wind stress scales with V_max squared and is amplified by the shallow depth and long fetch. The inverse barometer is a linear, modest effect. Wind setup is a quadratic, geometry-amplified monster. Total surge: 0.53 (IB) + ~5 (wind) + 0.8 (tide) = ~6.3 meters.',
      codeIntro: 'Build a surge calculator that takes cyclone parameters (pressure, wind, track) and coastal parameters (shelf profile, tide) to estimate total water level at the coast. Apply it to historical Bay of Bengal scenarios.',
      code: `import numpy as np

np.random.seed(42)

# ============================================================
# STORM SURGE IMPACT CALCULATOR
# ============================================================

def compute_total_surge(p_center, v_max, shelf_depth, shelf_width,
                        tide_level=0.0, Cd=0.002, rho_air=1.2, rho_water=1025, g=9.81):
    """
    Compute total storm surge at the coast.

    Parameters:
    - p_center: central pressure (hPa)
    - v_max: maximum sustained wind (m/s)
    - shelf_depth: average shelf depth (m)
    - shelf_width: shelf width (m)
    - tide_level: astronomical tide (m above MSL)
    """
    # 1. Inverse barometer effect
    ib_surge = 0.01 * (1013 - p_center)

    # 2. Wind setup (simplified)
    wind_stress = Cd * rho_air * v_max**2
    wind_surge = wind_stress * shelf_width / (rho_water * g * shelf_depth)

    # 3. Wave setup (empirical: ~15% of wind surge for energetic seas)
    wave_surge = 0.15 * wind_surge

    total = ib_surge + wind_surge + wave_surge + tide_level
    return {
        'inverse_barometer': ib_surge,
        'wind_setup': wind_surge,
        'wave_setup': wave_surge,
        'tide': tide_level,
        'total': total
    }

# Historical Bay of Bengal cyclone scenarios
scenarios = {
    'Bhola 1970': {'p': 966, 'v': 55, 'depth': 25, 'width': 300e3, 'tide': 0.5,
                   'observed_surge': 10.0, 'deaths': 300000},
    'Sidr 2007':  {'p': 944, 'v': 70, 'depth': 30, 'width': 250e3, 'tide': 0.3,
                   'observed_surge': 5.0, 'deaths': 3400},
    'Nargis 2008': {'p': 962, 'v': 55, 'depth': 35, 'width': 200e3, 'tide': 0.4,
                    'observed_surge': 4.0, 'deaths': 138000},
    'Aila 2009':  {'p': 968, 'v': 40, 'depth': 20, 'width': 280e3, 'tide': 0.8,
                   'observed_surge': 3.0, 'deaths': 339},
    'Amphan 2020': {'p': 920, 'v': 85, 'depth': 25, 'width': 300e3, 'tide': 0.2,
                     'observed_surge': 5.0, 'deaths': 128},
}

print("Storm Surge Impact Calculator")
print("=" * 55)
print()
for name, s in scenarios.items():
    result = compute_total_surge(s['p'], s['v'], s['depth'], s['width'], s['tide'])
    print(f"{name}:")
    print(f"  Pressure: {s['p']} hPa, Wind: {s['v']} m/s")
    print(f"  Inverse barometer: {result['inverse_barometer']:.2f} m")
    print(f"  Wind setup:        {result['wind_setup']:.2f} m")
    print(f"  Wave setup:        {result['wave_setup']:.2f} m")
    print(f"  Tide:              {result['tide']:.2f} m")
    print(f"  TOTAL predicted:   {result['total']:.1f} m")
    print(f"  Observed surge:    {s['observed_surge']:.1f} m")
    print(f"  Deaths:            {s['deaths']:,}")
    print()`,
      challenge: 'Add sea level rise to the analysis: for each historical cyclone, compute how much higher the surge would be with +0.5m SLR (projected for 2070). Which cities face the largest increase in risk? Express the risk change as a percentage of current surge.',
      successHint: 'Storm surge estimation closes the loop between atmospheric science and human safety. The same physics that governs pressure gradients and wind stress determines whether a fishing village floods or stays dry. Accurate surge models, combined with early warning, have already saved hundreds of thousands of lives in the Bay of Bengal.',
    },
    {
      title: 'Portfolio — Complete Cyclone Tracker Dashboard',
      concept: `Your cyclone tracker is now complete. Over the past five mini-lessons, you have built: (1) a synthetic data generator calibrated to Bay of Bengal cyclone statistics, (2) a climatological analysis module that maps track density, motion vectors, and intensity distributions, (3) a CLIPER track prediction model that blends persistence with climatology, (4) a statistical intensity estimator based on environmental predictors, and (5) a storm surge impact calculator that converts meteorological data into coastal water levels.

This final lesson integrates all five components into a single dashboard that demonstrates the full analysis pipeline. Given a "current" cyclone position, the dashboard will: visualize the historical context, run the CLIPER track forecast, estimate intensity along the forecast track, compute storm surge at potential landfall points, and produce a summary risk assessment.

This is the workflow that operational meteorologists follow — from data ingestion through analysis to risk communication. The tools are more sophisticated at agencies like IMD or JTWC (ensemble NWP models, Dvorak satellite analysis, coupled ocean-atmosphere models), but the logical flow is identical. You have built, from first principles, a miniature version of the system that protects millions of lives along the Bay of Bengal coast.

The key lesson is integration. Each component alone is incomplete. A track forecast without intensity estimation does not tell you how dangerous the storm is. Intensity without surge estimation does not tell you how high the water will rise. Surge without risk context does not tell you who needs to evacuate. Only the complete pipeline — track + intensity + surge + risk — provides actionable information.`,
      analogy: 'A cyclone tracker dashboard is like a pilot\'s instrument panel. The altimeter, airspeed indicator, compass, and fuel gauge each tell you one thing. But flight safety requires reading them together — altitude is meaningless without airspeed, heading is meaningless without fuel. Your dashboard reads pressure, track, intensity, and surge together to paint a complete picture of the threat.',
      storyConnection: 'If the fisherman\'s daughter had access to this dashboard, she could have seen the storm forming in the central Bay, watched its predicted track curve toward the Brahmaputra delta, read its intensifying winds, and computed the surge height at her village — all 48 hours before landfall. That information, communicated clearly, is the difference between evacuation and tragedy. Every component you built translates atmospheric physics into the single question that matters: "Is my village safe?"',
      checkQuestion: 'Your dashboard shows a cyclone 500 km south of the Brahmaputra delta, moving NW at 20 km/h, with winds of 50 m/s over 29°C water with low shear. The CLIPER model predicts landfall in 25 hours. What is your risk assessment — and what information is still missing that would change your confidence?',
      checkAnswer: 'Risk is very high. The cyclone is already Cat 3 (50 m/s), the environment favors further intensification (warm SST, low shear), and the CLIPER track points at the most surge-vulnerable coast on Earth. Expected surge: 4-7 meters on the shallow northern Bay shelf, arriving in ~25 hours. Missing information: (1) the current tide state — high tide at landfall would add 0.5-1m; (2) current river levels — monsoon-swollen Brahmaputra would compound the surge; (3) ensemble forecast spread — how confident is the CLIPER track? (4) local bathymetry at the exact landfall point; (5) whether evacuation has begun. The physical forecast is only useful if it reaches the people who need to act on it.',
      codeIntro: 'Build the integrated cyclone tracker dashboard: a single visualization that shows the full analysis pipeline from track to impact for a simulated Bay of Bengal cyclone.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Circle
from matplotlib.collections import LineCollection

np.random.seed(42)

# ============================================================
# INTEGRATED CYCLONE TRACKER DASHBOARD
# ============================================================

# --- Simulate a "live" cyclone approaching the BoB coast ---
known_lats = np.array([10.0, 10.8, 11.5, 12.3, 13.0, 13.8, 14.5, 15.2])
known_lons = np.array([89.0, 88.5, 88.1, 87.6, 87.2, 86.7, 86.3, 85.8])
known_winds = np.array([25, 30, 35, 42, 48, 55, 58, 62])
known_pressures = 1013 - 0.7 * known_winds
known_times = np.arange(len(known_lats)) * 6  # hours

# --- CLIPER Track Forecast ---
def cliper_forecast(lats, lons, n_ahead=16):
    p_dlat = (lats[-1] - lats[-3]) / 2
    p_dlon = (lons[-1] - lons[-3]) / 2
    c_dlat, c_dlon = 0.22, -0.12
    fc_lats, fc_lons = [lats[-1]], [lons[-1]]
    for t in range(1, n_ahead + 1):
        alpha = 0.8 * np.exp(-t / 8.0)
        dlat = alpha * p_dlat + (1 - alpha) * c_dlat
        dlon = alpha * p_dlon + (1 - alpha) * c_dlon
        fc_lats.append(fc_lats[-1] + dlat)
        fc_lons.append(fc_lons[-1] + dlon)
    return np.array(fc_lats), np.array(fc_lons)

fc_lats, fc_lons = cliper_forecast(known_lats, known_lons, n_ahead=16)
fc_times = known_times[-1] + np.arange(len(fc_lats)) * 6

# --- Intensity forecast along track ---
def forecast_intensity(fc_lats, fc_lons, current_wind=62):
    winds = [current_wind]
    for i in range(1, len(fc_lats)):
        lat, lon = fc_lats[i], fc_lons[i]
        sst = 30.0 - 0.3 * (lat - 10)
        shear = 5 + 1.5 * (lat - 10)
        dist_land = min(abs(lon - 82) * 111, abs(21 - lat) * 111, 500)
        sst_factor = max(0, (sst - 26.5)) * 2.0
        shear_factor = -shear * 0.8
        land_factor = -max(0, (200 - dist_land) / 200) * 10
        tendency = sst_factor + shear_factor + land_factor
        winds.append(np.clip(winds[-1] + tendency * 0.3, 10, 80))
    return np.array(winds)

fc_winds = forecast_intensity(fc_lats, fc_lons, current_wind=known_winds[-1])
fc_pressures = 1013 - 0.7 * fc_winds

# --- Storm surge model ---
def compute_surge(v_max, p_center, shelf_depth=25, shelf_width=300e3,
                  tide=0.5, Cd=0.002, rho_air=1.2, rho_water=1025, g=9.81):
    ib = 0.01 * (1013 - p_center)
    tau = Cd * rho_air * v_max**2
    wind_surge = tau * shelf_width / (rho_water * g * shelf_depth)
    return ib + wind_surge * 1.15 + tide

# Find landfall
landfall_idx = None
for i in range(len(fc_lats)):
    if fc_lats[i] > 20:
        landfall_idx = i
        break

# ============================================================
# DASHBOARD VISUALIZATION (2x3 grid)
# ============================================================
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#0d1117')
fig.suptitle('CYCLONE TRACKER DASHBOARD — Bay of Bengal',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# --- Panel 1: Track Map ---
ax = axes[0, 0]
# Coastline approximation (India east coast)
coast_lats = [8, 10, 13, 15, 17, 19, 21, 22, 23]
coast_lons = [77, 80, 80, 81, 83, 85, 87, 88, 89]
ax.plot(coast_lons, coast_lats, 'o-', color='#4b5563', markersize=2, linewidth=1.5, label='Coast')
ax.fill_betweenx(coast_lats, 75, coast_lons, color='#1c1917', alpha=0.5)

# Known track (color by intensity)
for i in range(len(known_lats)-1):
    color = '#ef4444' if known_winds[i] >= 50 else '#f59e0b' if known_winds[i] >= 33 else '#22c55e'
    ax.plot(known_lons[i:i+2], known_lats[i:i+2], '-', color=color, linewidth=3)
ax.plot(known_lons, known_lats, 'o', color='white', markersize=4, zorder=5)

# Forecast track (dashed, color by intensity)
for i in range(len(fc_lats)-1):
    color = '#ef4444' if fc_winds[i] >= 50 else '#f59e0b' if fc_winds[i] >= 33 else '#22c55e'
    ax.plot(fc_lons[i:i+2], fc_lats[i:i+2], '--', color=color, linewidth=2, alpha=0.7)
ax.plot(fc_lons[::4], fc_lats[::4], 's', color='#60a5fa', markersize=5, alpha=0.7)

# Current position marker
ax.plot(known_lons[-1], known_lats[-1], '*', color='#f59e0b', markersize=15, zorder=10)

# Landfall marker
if landfall_idx:
    ax.plot(fc_lons[landfall_idx], fc_lats[landfall_idx], 'X', color='#ef4444', markersize=12, zorder=10)

ax.set_xlim(78, 95)
ax.set_ylim(7, 24)
ax.set_xlabel('Longitude (°E)', color='white')
ax.set_ylabel('Latitude (°N)', color='white')
ax.set_title('Track & Forecast', color='white', fontsize=11)
ax.set_aspect('equal')

# --- Panel 2: Intensity Timeline ---
ax = axes[0, 1]
all_times = np.concatenate([known_times, fc_times[1:]])
all_winds = np.concatenate([known_winds, fc_winds[1:]])
all_press = np.concatenate([known_pressures, fc_pressures[1:]])

ax.plot(known_times, known_winds, '-o', color='#ef4444', linewidth=2, markersize=4, label='Observed')
ax.plot(fc_times, fc_winds, '--s', color='#ef4444', linewidth=1.5, markersize=3, alpha=0.6, label='Forecast')
ax2 = ax.twinx()
ax2.plot(known_times, known_pressures, '-o', color='#3b82f6', linewidth=2, markersize=4)
ax2.plot(fc_times, fc_pressures, '--s', color='#3b82f6', linewidth=1.5, markersize=3, alpha=0.6)
ax2.set_ylabel('Pressure (hPa)', color='#3b82f6')
ax2.tick_params(colors='#3b82f6')

# Category thresholds
for cat, v, c in [(1, 33, '#f59e0b'), (3, 50, '#ef4444'), (5, 70, '#dc2626')]:
    ax.axhline(v, color=c, linewidth=0.5, linestyle=':', alpha=0.5)
    ax.text(all_times[-1]+2, v, f'Cat{cat}', color=c, fontsize=7, va='center')

if landfall_idx:
    ax.axvline(fc_times[landfall_idx], color='#ef4444', linewidth=1, linestyle='--', alpha=0.5)
    ax.text(fc_times[landfall_idx], max(all_winds)*0.95, 'Landfall', color='#ef4444', fontsize=8, ha='center')

ax.set_xlabel('Hours since genesis', color='white')
ax.set_ylabel('Wind speed (m/s)', color='#ef4444')
ax.tick_params(colors='#ef4444')
ax.set_title('Intensity & Pressure', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# --- Panel 3: Environmental Conditions ---
ax = axes[0, 2]
fc_sst = [30.0 - 0.3 * (lat - 10) for lat in fc_lats]
fc_shear = [5 + 1.5 * (lat - 10) for lat in fc_lats]
fc_dist = [min(abs(lon - 82)*111, abs(21-lat)*111, 500) for lat, lon in zip(fc_lats, fc_lons)]

ax.plot(fc_times, fc_sst, '-', color='#ef4444', linewidth=2, label='SST (°C)')
ax.axhline(26.5, color='#ef4444', linewidth=0.5, linestyle=':', alpha=0.5)
ax.text(fc_times[0], 26.7, '26.5°C threshold', color='#ef4444', fontsize=7)

ax_s = ax.twinx()
ax_s.plot(fc_times, fc_shear, '-', color='#a855f7', linewidth=2, label='Shear (m/s)')
ax_s.set_ylabel('Wind shear (m/s)', color='#a855f7')
ax_s.tick_params(colors='#a855f7')

ax.set_xlabel('Forecast hour', color='white')
ax.set_ylabel('SST (°C)', color='#ef4444')
ax.tick_params(colors='#ef4444')
ax.set_title('Environment Along Track', color='white', fontsize=11)
ax.legend(loc='upper left', fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax_s.legend(loc='upper right', fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# --- Panel 4: Surge Risk at Landfall ---
ax = axes[1, 0]
wind_range = np.linspace(20, 80, 50)
surge_bob = [compute_surge(v, 1013-0.7*v, shelf_depth=25, shelf_width=300e3) for v in wind_range]
surge_steep = [compute_surge(v, 1013-0.7*v, shelf_depth=100, shelf_width=50e3) for v in wind_range]

ax.plot(wind_range, surge_bob, '-', color='#ef4444', linewidth=2.5, label='Bay of Bengal (shallow)')
ax.plot(wind_range, surge_steep, '-', color='#3b82f6', linewidth=2, label='Steep shelf')
ax.fill_between(wind_range, surge_bob, surge_steep, color='#ef4444', alpha=0.1)

if landfall_idx:
    lf_surge = compute_surge(fc_winds[landfall_idx], fc_pressures[landfall_idx])
    ax.plot(fc_winds[landfall_idx], lf_surge, '*', color='#f59e0b', markersize=15, zorder=10,
            label=f'This cyclone: {lf_surge:.1f}m')

ax.axhline(3, color='#f59e0b', linewidth=0.5, linestyle='--', alpha=0.5)
ax.text(75, 3.2, 'Danger: 3m', color='#f59e0b', fontsize=7)
ax.set_xlabel('Max wind (m/s)', color='white')
ax.set_ylabel('Surge height (m)', color='white')
ax.set_title('Storm Surge vs Wind Speed', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# --- Panel 5: Uncertainty Cone ---
ax = axes[1, 1]
# Simple uncertainty: grows with forecast lead time
for sigma_mult in [2.0, 1.0, 0.5]:
    upper_lats = fc_lats + sigma_mult * np.arange(len(fc_lats)) * 0.08
    lower_lats = fc_lats - sigma_mult * np.arange(len(fc_lats)) * 0.08
    upper_lons = fc_lons + sigma_mult * np.arange(len(fc_lats)) * 0.06
    lower_lons = fc_lons - sigma_mult * np.arange(len(fc_lats)) * 0.06
    alpha = 0.15 if sigma_mult > 1 else 0.25
    ax.fill_between(fc_times, lower_lats, upper_lats, color='#ef4444', alpha=alpha)

ax.plot(known_times, known_lats, '-o', color='white', linewidth=2, markersize=4, label='Observed')
ax.plot(fc_times, fc_lats, '--', color='#ef4444', linewidth=2, label='Forecast')

if landfall_idx:
    ax.axhline(20, color='#f59e0b', linewidth=1, linestyle=':', alpha=0.5)
    ax.text(fc_times[0], 20.3, 'Coastline (~20°N)', color='#f59e0b', fontsize=8)

ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Latitude (°N)', color='white')
ax.set_title('Forecast Uncertainty Cone', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# --- Panel 6: Risk Summary ---
ax = axes[1, 2]
ax.axis('off')

def cat_from_wind(v):
    if v >= 70: return 5
    if v >= 58: return 4
    if v >= 50: return 3
    if v >= 43: return 2
    if v >= 33: return 1
    return 0

curr_cat = cat_from_wind(known_winds[-1])
lf_text = "N/A"
surge_text = "N/A"
risk_color = '#22c55e'
risk_level = 'MODERATE'

if landfall_idx:
    lf_cat = cat_from_wind(fc_winds[landfall_idx])
    lf_surge = compute_surge(fc_winds[landfall_idx], fc_pressures[landfall_idx])
    lf_text = f"{fc_lats[landfall_idx]:.1f}°N, {fc_lons[landfall_idx]:.1f}°E in ~{landfall_idx*6}h"
    surge_text = f"{lf_surge:.1f}m (Cat {lf_cat} at landfall)"
    if lf_surge > 5: risk_level, risk_color = 'EXTREME', '#dc2626'
    elif lf_surge > 3: risk_level, risk_color = 'VERY HIGH', '#ef4444'
    elif lf_surge > 1: risk_level, risk_color = 'HIGH', '#f59e0b'

report = (
    f"RISK ASSESSMENT\
"
    f"{'='*35}\
\
"
    f"Current: {known_lats[-1]:.1f}°N {known_lons[-1]:.1f}°E\
"
    f"Category: {curr_cat} ({known_winds[-1]} m/s)\
"
    f"Pressure: {known_pressures[-1]:.0f} hPa\
\
"
    f"Landfall: {lf_text}\
"
    f"Surge: {surge_text}\
\
"
    f"Risk: {risk_level}\
"
)

ax.text(0.05, 0.95, report, transform=ax.transAxes, color='white',
        fontsize=10, va='top', fontfamily='monospace',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117',
                  edgecolor=risk_color, linewidth=2, alpha=0.9))

# Risk level badge
ax.text(0.5, 0.08, risk_level, transform=ax.transAxes, ha='center',
        color='white', fontsize=18, fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.3', facecolor=risk_color, alpha=0.9))

plt.tight_layout()
plt.show()

# Text summary
print("CYCLONE TRACKER — FORECAST SUMMARY")
print("=" * 45)
print(f"Current: {known_lats[-1]:.1f}°N, {known_lons[-1]:.1f}°E | Cat {curr_cat} | {known_winds[-1]} m/s")
if landfall_idx:
    print(f"Landfall: ~{landfall_idx*6}h | Surge: {lf_surge:.1f}m | Risk: {risk_level}")
else:
    print("Forecast: remains offshore")`,
      challenge: 'Add a "what-if" module: allow the user to change the cyclone\'s current intensity and direction, and show how the risk assessment changes in real time. This is how emergency managers use operational tools — exploring scenarios to make evacuation decisions.',
      successHint: 'You have built a cyclone tracker from scratch — data generation, climatological analysis, track prediction, intensity estimation, surge calculation, and integrated visualization. Every component connects atmospheric physics to human safety. The fisherman\'s daughter\'s village deserves this tool. Across the Bay of Bengal, systems built on these same principles save thousands of lives every cyclone season.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Build a Cyclone Tracker
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (ocean science & storm physics)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete cyclone tracker. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={[StormTrackerPipelineDiagram, StormHistoricalTracksDiagram, StormCLIPERDiagram, StormDvorakDiagram, StormImpactAssessmentDiagram, StormDashboardDiagram][i] ? createElement([StormTrackerPipelineDiagram, StormHistoricalTracksDiagram, StormCLIPERDiagram, StormDvorakDiagram, StormImpactAssessmentDiagram, StormDashboardDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
