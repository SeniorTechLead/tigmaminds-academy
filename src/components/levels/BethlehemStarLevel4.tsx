import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import BethlehemMagnitudeDiagram from '../diagrams/BethlehemMagnitudeDiagram';
import BethlehemConjunctionDiagram from '../diagrams/BethlehemConjunctionDiagram';
import BethlehemCelestialNavDiagram from '../diagrams/BethlehemCelestialNavDiagram';
import BethlehemKeplerDiagram from '../diagrams/BethlehemKeplerDiagram';
import OrbitalMechanicsDiagram from '../diagrams/OrbitalMechanicsDiagram';
import LatLongGridDiagram from '../diagrams/LatLongGridDiagram';

export default function BethlehemStarLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Part 1 — Design a complete planetarium engine',
      concept: `Time to build a full **planetarium engine** that combines every concept from Levels 1-3 into a single interactive system. The engine will:

1. Solve Kepler’s equation for any planet at any date
2. Transform heliocentric to geocentric coordinates
3. Convert to horizontal coordinates for any observer location
4. Compute apparent magnitude including distance correction
5. Render a sky map

This is a substantial Python program organized as a class with clean methods. The architecture mirrors professional planetarium software.`,
      analogy: 'You are building a flight simulator for the night sky. Instead of modeling aerodynamics and engines, you model gravity and light. The inputs are date, time, and location. The output is a complete picture of the sky. Every calculation you have learned feeds into this one system.',
      storyConnection: 'This planetarium engine can answer the Magi’s question directly: "What did the sky look like from Babylon on the evening of May 29, 7 BCE?" By running the engine for that date and location, you see the Jupiter-Saturn conjunction exactly as they saw it — two bright planets near each other in Pisces, rising in the east after sunset.',
      checkQuestion: 'What is the minimum set of data needed to render a complete sky view?',
      checkAnswer: 'You need: (1) a star catalogue with RA, Dec, and magnitude for each star; (2) orbital elements for each planet; (3) the observer’s latitude and longitude; (4) the date and time. From these four inputs, you can compute every object’s position and brightness on the observer’s sky. Professional planetariums add atmospheric refraction, extinction, and precession corrections.',
      codeIntro: 'Build the core planetarium engine class.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class PlanetariumEngine:
    """A simplified planetarium that computes sky positions for any date and location."""

    GM = 4 * np.pi**2  # AU^3/yr^2

    # Orbital elements (a, e, P, L0, omega) for J2000.0
    PLANETS = {
        'Mercury': (0.387, 0.206, 0.241, 252.25, 77.46),
        'Venus':   (0.723, 0.007, 0.615, 181.98, 131.53),
        'Earth':   (1.000, 0.017, 1.000, 100.46, 102.94),
        'Mars':    (1.524, 0.093, 1.881, 355.45, 336.04),
        'Jupiter': (5.203, 0.048, 11.86, 34.40, 14.75),
        'Saturn':  (9.537, 0.054, 29.46, 49.94, 92.43),
    }

    def __init__(self, lat, lon):
        self.lat = lat
        self.lon = lon

    @staticmethod
    def solve_kepler(M, e, tol=1e-12):
        E = M
        for _ in range(50):
            dE = -(E - e * np.sin(E) - M) / (1 - e * np.cos(E))
            E += dE
            if abs(dE) < tol: break
        return E

    def helio_position(self, name, t_j2000):
        """Heliocentric x, y in AU at time t (years from J2000)."""
        a, e, P, L0, omega = self.PLANETS[name]
        n = 2 * np.pi / P
        M = (n * t_j2000 + np.radians(L0 - omega)) % (2 * np.pi)
        E = self.solve_kepler(M, e)
        nu = 2 * np.arctan2(np.sqrt(1+e)*np.sin(E/2), np.sqrt(1-e)*np.cos(E/2))
        r = a * (1 - e**2) / (1 + e * np.cos(nu))
        lon = nu + np.radians(omega)
        return r * np.cos(lon), r * np.sin(lon), r

    def apparent_position(self, name, t_j2000):
        """Geocentric ecliptic longitude and distance."""
        ex, ey, _ = self.helio_position('Earth', t_j2000)
        px, py, rp = self.helio_position(name, t_j2000)
        dx, dy = px - ex, py - ey
        geo_dist = np.sqrt(dx**2 + dy**2)
        ecl_lon = np.degrees(np.arctan2(dy, dx)) % 360
        return ecl_lon, geo_dist

    def sky_map(self, t_j2000, ax=None):
        """Plot all planets on a simple ecliptic sky map."""
        if ax is None:
            fig, ax = plt.subplots(figsize=(12, 4), facecolor='#0f172a')
            ax.set_facecolor('#0f172a')

        planet_colors = {'Mercury': '#94a3b8', 'Venus': '#e2e8f0',
                        'Mars': '#ef4444', 'Jupiter': '#f59e0b', 'Saturn': '#a78bfa'}
        planet_sizes = {'Mercury': 30, 'Venus': 50, 'Mars': 40, 'Jupiter': 80, 'Saturn': 60}

        for name in ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']:
            lon, dist = self.apparent_position(name, t_j2000)
            s = planet_sizes[name]
            ax.scatter(lon, 0, s=s, color=planet_colors[name], zorder=5, marker='*')
            ax.annotate(name, (lon, 0), textcoords="offset points",
                       xytext=(0, 12), ha='center', fontsize=9,
                       color=planet_colors[name], fontweight='bold')

        # Zodiac constellations (approximate ecliptic longitudes)
        zodiac = [('Aries', 30), ('Taurus', 60), ('Gemini', 90), ('Cancer', 120),
                  ('Leo', 150), ('Virgo', 180), ('Libra', 210), ('Scorpio', 240),
                  ('Sagittarius', 270), ('Capricorn', 300), ('Aquarius', 330), ('Pisces', 360)]
        for name, lon in zodiac:
            ax.axvline(lon - 30, color='#334155', linewidth=0.5, alpha=0.3)
            ax.text(lon - 15, -0.15, name, ha='center', fontsize=7, color='#64748b', rotation=45)

        ax.set_xlim(0, 360)
        ax.set_ylim(-0.3, 0.3)
        ax.set_xlabel('Ecliptic Longitude (°)', fontsize=11, color='white')
        ax.tick_params(colors='white')
        return ax

# Create engine for Bethlehem
engine = PlanetariumEngine(lat=31.7, lon=35.2)

# 7 BCE = approximately -2006 years from J2000
t_7bce = -2006.4  # ~May 7 BCE

fig, axes = plt.subplots(3, 1, figsize=(12, 10), facecolor='#0f172a')
for ax in axes: ax.set_facecolor('#0f172a')

dates = [('May 7 BCE (1st conjunction)', -2006.4),
         ('Sep 7 BCE (2nd conjunction)', -2006.1),
         ('Dec 7 BCE (3rd conjunction)', -2005.85)]

for ax, (label, t) in zip(axes, dates):
    engine.sky_map(t, ax)
    ax.set_title(label, fontsize=12, color='white')

plt.tight_layout()
plt.show()

# Print positions
for label, t in dates:
    j_lon, j_dist = engine.apparent_position('Jupiter', t)
    s_lon, s_dist = engine.apparent_position('Saturn', t)
    sep = abs(j_lon - s_lon)
    if sep > 180: sep = 360 - sep
    print(f"{label}:")
    print(f"  Jupiter: {j_lon:.1f}°  Saturn: {s_lon:.1f}°  Sep: {sep:.1f}°")`,
      challenge: 'Add the Moon to the planetarium. The Moon orbits Earth at ~0.00257 AU with a period of 27.32 days. When was the Moon near the conjunction in 7 BCE? A crescent Moon near the conjunction would have made the sight even more spectacular.',
      successHint: 'You have built a working planetarium engine. From here, you could add a star catalogue, atmospheric refraction, twilight calculations, and a graphical user interface. This is genuinely how planetarium software is structured.',
    },
    {
      title: 'Capstone Part 2 — Historical conjunction analyzer',
      concept: `Extend the planetarium engine into a **historical conjunction analyzer** that searches for significant planetary alignments over thousands of years.

The analyzer will:
1. Scan through centuries of planetary positions
2. Identify all conjunctions below a threshold separation
3. Classify them (single, double, triple) based on retrograde behavior
4. Rank them by rarity and astronomical significance
5. Output a report comparing the 7 BCE event to other historical conjunctions

This tool can evaluate the various "Star of Bethlehem" hypotheses quantitatively.`,
      analogy: 'You are building a detective tool that searches through centuries of planetary positions like a forensic investigator searching through databases. Instead of fingerprints and DNA, your evidence is angular separations and conjunction timings.',
      storyConnection: 'Multiple hypotheses exist for the Star of Bethlehem: the 7 BCE Jupiter-Saturn triple conjunction, a 6 BCE nova in Aquila, a 5 BCE conjunction of Jupiter and Venus, Halley’s Comet in 12 BCE, and others. Your analyzer can evaluate each hypothesis by checking whether the astronomical event actually occurred when and where the texts describe.',
      checkQuestion: 'Why is a triple conjunction more significant than a single conjunction?',
      checkAnswer: 'Single conjunctions of Jupiter and Saturn happen every ~20 years — they are notable but not extraordinary. A triple conjunction (caused by retrograde motion) happens every ~900 years. The repeated appearance of the two planets close together over several months would command attention from any astronomer. The 7 BCE event had conjunctions in May, September, and December — spanning eight months.',
      codeIntro: 'Build a conjunction analyzer that searches through millennia.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def solve_kepler(M, e):
    E = M
    for _ in range(30):
        E = E - (E - e * np.sin(E) - M) / (1 - e * np.cos(E))
    return E

def geocentric_lon(t, a, e, P, L0, w, a_e=1.0, e_e=0.017, P_e=1.0, L0_e=100.46, w_e=102.94):
    """Geocentric ecliptic longitude of a planet at time t (J2000 years)."""
    def helio(a_, e_, P_, L0_, w_):
        M = (2*np.pi/P_ * t + np.radians(L0_ - w_)) % (2*np.pi)
        E = solve_kepler(M, e_)
        nu = 2 * np.arctan2(np.sqrt(1+e_)*np.sin(E/2), np.sqrt(1-e_)*np.cos(E/2))
        r = a_ * (1-e_**2) / (1+e_*np.cos(nu))
        lon = nu + np.radians(w_)
        return r*np.cos(lon), r*np.sin(lon)

    ex, ey = helio(a_e, e_e, P_e, L0_e, w_e)
    px, py = helio(a, e, P, L0, w)
    return np.degrees(np.arctan2(py-ey, px-ex)) % 360

# Jupiter and Saturn elements
J = (5.203, 0.048, 11.86, 34.40, 14.75)
S = (9.537, 0.054, 29.46, 49.94, 92.43)

# Scan 2000 years: 1000 BCE to 1000 CE
# In J2000 terms: -3000 to -1000
t_start, t_end = -3000, -1000
dt = 0.005  # ~2 day resolution
t = np.arange(t_start, t_end, dt)

# Compute longitudes
print("Computing ephemeris (this takes a moment)...")
j_lon = np.array([geocentric_lon(ti, *J) for ti in t])
s_lon = np.array([geocentric_lon(ti, *S) for ti in t])

# Angular separation
sep = np.abs(j_lon - s_lon)
sep = np.minimum(sep, 360 - sep)

# Find conjunction events (sep < 3°)
threshold = 3.0
conj_mask = sep < threshold
events = []
in_event = False
for i in range(len(t)):
    if conj_mask[i] and not in_event:
        in_event = True
        start = i
    elif not conj_mask[i] and in_event:
        in_event = False
        chunk = sep[start:i]
        min_idx = start + np.argmin(chunk)
        duration = (t[i] - t[start]) * 365.25  # days
        events.append({
            'year': t[min_idx] + 2000,  # convert to BCE/CE
            'min_sep': sep[min_idx],
            'duration_days': duration,
        })

# Classify: triple conjunctions have duration > 200 days
for ev in events:
    ev['type'] = 'Triple' if ev['duration_days'] > 180 else 'Single'

plt.figure(figsize=(12, 5))
years_plot = [e['year'] for e in events]
seps_plot = [e['min_sep'] for e in events]
colors_plot = ['#ef4444' if e['type'] == 'Triple' else '#3b82f6' for e in events]

plt.scatter(years_plot, seps_plot, c=colors_plot, s=40, zorder=5)
plt.axhline(threshold, color='#94a3b8', linewidth=1, linestyle='--', alpha=0.5)

# Highlight 7 BCE
for e in events:
    if -8 < e['year'] < -6:
        plt.scatter(e['year'], e['min_sep'], s=200, color='#fbbf24',
                   marker='*', zorder=10, label=f"7 BCE ({e['type']})")

plt.xlabel('Year (negative = BCE)', fontsize=12)
plt.ylabel('Minimum separation (°)', fontsize=12)
plt.title('Jupiter-Saturn Conjunctions: 1000 BCE to 1000 CE', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

# Summary
triples = [e for e in events if e['type'] == 'Triple']
print(f"\\nTotal conjunctions found: {len(events)}")
print(f"Triple conjunctions: {len(triples)}")
print(f"\\nTriple conjunctions (rare!):")
for e in triples:
    yr = e['year']
    era = 'BCE' if yr < 0 else 'CE'
    print(f"  Year {abs(yr):.0f} {era}: min sep {e['min_sep']:.2f}°, duration {e['duration_days']:.0f} days")`,
      challenge: 'Add Venus conjunctions with Jupiter. The "Venus hypothesis" suggests a 3-2 BCE Jupiter-Venus conjunction was the Star of Bethlehem. Which event was more astronomically spectacular — the 7 BCE triple conjunction or the 3-2 BCE Venus-Jupiter conjunction?',
      successHint: 'Your conjunction analyzer is a research tool. Historians and astronomers use exactly this approach to evaluate biblical and historical astronomical references. By quantifying rarity, duration, and brightness, you can objectively compare competing hypotheses.',
    },
    {
      title: 'Capstone Part 3 — Navigation route optimizer',
      concept: `The Magi traveled from Persia to Bethlehem — a journey of roughly 1,500 km across desert and mountains. Build a **navigation route optimizer** that plans the journey using celestial navigation.

The optimizer:
1. Computes Polaris altitude for latitude checks at each waypoint
2. Calculates star transit times for longitude determination
3. Accounts for the equation of time correction
4. Plans travel segments based on nighttime visibility
5. Estimates total journey time considering terrain and rest stops

This combines astronomy, geography, and optimization into a single system.`,
      analogy: 'You are building an ancient GPS. Instead of satellites, you use stars. Instead of radio signals, you use sextant angles. The precision is lower (degrees instead of metres), but the principles are identical: triangulate your position using known reference points at known locations.',
      storyConnection: 'The Magi’s route likely followed established trade roads: from Babylon or Ctesiphon northwest to cross the Euphrates, through Palmyra, down to Damascus, and south through Galilee to Jerusalem and Bethlehem. At each stop, they could verify their position using Polaris for latitude and star transit timings for longitude.',
      checkQuestion: 'Why is longitude harder to determine from stars than latitude?',
      checkAnswer: 'Latitude comes directly from Polaris altitude — one simple measurement. Longitude requires knowing the EXACT TIME a star crosses your meridian, then comparing with tables that give the transit time at a reference location. The time difference tells you the longitude difference (1 hour = 15°). But without an accurate clock, you cannot measure that time difference precisely. This is the famous "longitude problem" that was not fully solved until John Harrison’s chronometer in 1761.',
      codeIntro: 'Build a celestial navigation route planner.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class CelestialNavigator:
    """Plan a route using celestial navigation."""

    def __init__(self):
        self.waypoints = []

    def add_waypoint(self, name, lat, lon, terrain='road'):
        self.waypoints.append({
            'name': name, 'lat': lat, 'lon': lon, 'terrain': terrain
        })

    def polaris_altitude(self, lat):
        """Polaris altitude = latitude (simplified)."""
        return lat

    def distance_km(self, lat1, lon1, lat2, lon2):
        """Haversine distance between two points."""
        R = 6371
        dlat = np.radians(lat2 - lat1)
        dlon = np.radians(lon2 - lon1)
        a = (np.sin(dlat/2)**2 +
             np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) *
             np.sin(dlon/2)**2)
        return R * 2 * np.arctan2(np.sqrt(a), np.sqrt(1-a))

    def travel_time_days(self, dist_km, terrain):
        """Estimate travel time based on terrain."""
        speeds = {'road': 30, 'desert': 20, 'mountain': 15}  # km/day by camel
        return dist_km / speeds.get(terrain, 25)

    def plan_route(self):
        """Compute distances and times for the full route."""
        segments = []
        for i in range(len(self.waypoints) - 1):
            w1 = self.waypoints[i]
            w2 = self.waypoints[i + 1]
            dist = self.distance_km(w1['lat'], w1['lon'], w2['lat'], w2['lon'])
            time = self.travel_time_days(dist, w2['terrain'])
            segments.append({
                'from': w1['name'], 'to': w2['name'],
                'distance_km': dist, 'days': time,
                'polaris_start': self.polaris_altitude(w1['lat']),
                'polaris_end': self.polaris_altitude(w2['lat']),
            })
        return segments

# Plan the Magi's route
nav = CelestialNavigator()
nav.add_waypoint('Babylon', 32.54, 44.42, 'road')
nav.add_waypoint('Ctesiphon', 33.09, 44.58, 'road')
nav.add_waypoint('Hatra', 35.59, 42.72, 'desert')
nav.add_waypoint('Palmyra', 34.56, 38.27, 'desert')
nav.add_waypoint('Damascus', 33.51, 36.29, 'road')
nav.add_waypoint('Sea of Galilee', 32.83, 35.59, 'road')
nav.add_waypoint('Jerusalem', 31.77, 35.23, 'mountain')
nav.add_waypoint('Bethlehem', 31.70, 35.21, 'road')

segments = nav.plan_route()

# Plot the route on a map
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

lats = [w['lat'] for w in nav.waypoints]
lons = [w['lon'] for w in nav.waypoints]

ax1.plot(lons, lats, 'o-', color='#fbbf24', linewidth=2, markersize=8)
for w in nav.waypoints:
    ax1.annotate(w['name'], (w['lon'], w['lat']), textcoords="offset points",
                xytext=(5, 5), fontsize=8, color='white')

ax1.set_xlabel('Longitude (°E)', fontsize=12)
ax1.set_ylabel('Latitude (°N)', fontsize=12)
ax1.set_title('The Magi\\'s Route', fontsize=13)
ax1.grid(alpha=0.3)
ax1.set_facecolor('#1a2332')

# Navigation data
names = [s['to'] for s in segments]
distances = [s['distance_km'] for s in segments]
cumulative_dist = np.cumsum(distances)
cumulative_days = np.cumsum([s['days'] for s in segments])
polaris_alts = [s['polaris_end'] for s in segments]

ax2.bar(range(len(segments)), distances, color='#3b82f6', alpha=0.7, label='Distance (km)')
ax2_twin = ax2.twinx()
ax2_twin.plot(range(len(segments)), polaris_alts, 'o-', color='#fbbf24', linewidth=2, label='Polaris altitude')
ax2.set_xticks(range(len(segments)))
ax2.set_xticklabels(names, rotation=45, ha='right', fontsize=8)
ax2.set_ylabel('Segment distance (km)', fontsize=11)
ax2_twin.set_ylabel('Polaris altitude (°)', fontsize=11, color='#fbbf24')
ax2.set_title('Route Segments', fontsize=13)
ax2.legend(loc='upper left', fontsize=9)
ax2_twin.legend(loc='upper right', fontsize=9)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

# Print summary
total_dist = sum(distances)
total_days = sum(s['days'] for s in segments)
print(f"Route Summary:")
print(f"{'Segment':<30s} {'Dist (km)':>10s} {'Days':>8s} {'Polaris':>8s}")
print("-" * 60)
for s in segments:
    print(f"  {s['from']} → {s['to']:<18s} {s['distance_km']:8.1f}  {s['days']:7.1f}  {s['polaris_end']:6.1f}°")
print("-" * 60)
print(f"  {'TOTAL':<28s} {total_dist:8.1f}  {total_days:7.1f}")
print(f"\\nEstimated journey: {total_days:.0f} days ({total_days/7:.1f} weeks)")`,
      challenge: 'Add a "night visibility" calculation: for each waypoint, compute how many hours Jupiter-Saturn is above the horizon during the night. The Magi would time their journey to arrive when the conjunction was best visible.',
      successHint: 'You have combined celestial navigation, geography, and route planning into a single tool. This is computational geography — the same principles used in modern GPS routing, but using the sky as the reference frame.',
    },
    {
      title: 'Capstone Part 4 — Hypothesis evaluator and report generator',
      concept: `The final piece: build a **hypothesis evaluator** that systematically compares the leading candidates for the Star of Bethlehem and generates a scientific report.

Hypotheses to evaluate:
1. **Jupiter-Saturn triple conjunction** (7 BCE)
2. **Jupiter-Venus conjunction** (3-2 BCE)
3. **Nova in Aquila** (5 BCE, recorded in Chinese records)
4. **Halley’s Comet** (12 BCE)
5. **Jupiter occultation by Moon** (6 BCE)

For each hypothesis, the evaluator scores:
- **Timing**: does it match the historical timeline?
- **Visibility**: was it visible from the right locations?
- **Brightness**: was it remarkable enough to motivate a journey?
- **Duration**: did it last long enough for a months-long journey?
- **Significance**: would Babylonian astronomers recognize its meaning?`,
      analogy: 'You are a scientific jury evaluating evidence for competing theories. Each theory (hypothesis) is scored on multiple criteria. No single piece of evidence is conclusive, but the weight of evidence across all criteria points toward the most likely explanation. This is how science works: systematic comparison of hypotheses against data.',
      storyConnection: 'For 2,000 years, people have wondered what the Star of Bethlehem was. Theologians, historians, and astronomers have proposed dozens of explanations. Your evaluator does what a good scientist does: lay out the criteria, score each hypothesis objectively, and present the evidence without bias. The answer is not certain — but some hypotheses are far stronger than others.',
      checkQuestion: 'Why is the year of Jesus’s birth uncertain, and how does this affect the Star of Bethlehem analysis?',
      checkAnswer: 'King Herod died in 4 BCE (established from Josephus’s histories and an eclipse record). Since the Gospels say Jesus was born during Herod’s reign, the birth must have been 4 BCE or earlier — not 1 CE as the calendar assumes (Dionysius Exiguus made an error in the 6th century). This pushes the "Star" to 7-4 BCE, which is why the 7 BCE conjunction and 5 BCE nova are leading candidates.',
      codeIntro: 'Build a systematic hypothesis evaluator with scoring and visualization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class HypothesisEvaluator:
    """Evaluate Star of Bethlehem hypotheses against scientific criteria."""

    def __init__(self):
        self.criteria = ['Timing\\n(matches Herod)',
                        'Visibility\\n(from Persia)',
                        'Brightness\\n(remarkable)',
                        'Duration\\n(months)',
                        'Significance\\n(to Magi)']
        self.hypotheses = {}

    def add_hypothesis(self, name, scores, year, description):
        """scores: list of 5 values from 0-10 for each criterion."""
        self.hypotheses[name] = {
            'scores': np.array(scores),
            'year': year,
            'description': description,
            'total': sum(scores),
        }

    def radar_chart(self, ax, name, color):
        """Draw radar chart for one hypothesis."""
        h = self.hypotheses[name]
        N = len(self.criteria)
        angles = np.linspace(0, 2*np.pi, N, endpoint=False)
        angles = np.concatenate([angles, [angles[0]]])
        values = np.concatenate([h['scores'], [h['scores'][0]]])

        ax.plot(angles, values, 'o-', color=color, linewidth=2, label=name)
        ax.fill(angles, values, color=color, alpha=0.1)

    def comparison_chart(self):
        """Generate full comparison visualization."""
        fig = plt.figure(figsize=(14, 10))

        # Radar chart
        ax1 = fig.add_subplot(221, polar=True)
        colors = ['#fbbf24', '#3b82f6', '#ef4444', '#a78bfa', '#4ade80']
        for (name, _), color in zip(self.hypotheses.items(), colors):
            self.radar_chart(ax1, name, color)

        N = len(self.criteria)
        angles = np.linspace(0, 2*np.pi, N, endpoint=False)
        ax1.set_xticks(angles)
        ax1.set_xticklabels(self.criteria, fontsize=7)
        ax1.set_ylim(0, 10)
        ax1.set_title('Criteria Comparison', fontsize=12, pad=20)
        ax1.legend(fontsize=7, loc='upper right', bbox_to_anchor=(1.3, 1.1))

        # Bar chart of total scores
        ax2 = fig.add_subplot(222)
        names = list(self.hypotheses.keys())
        totals = [self.hypotheses[n]['total'] for n in names]
        bars = ax2.barh(names, totals, color=colors[:len(names)])
        ax2.set_xlabel('Total Score (out of 50)', fontsize=11)
        ax2.set_title('Overall Ranking', fontsize=12)
        for bar, total in zip(bars, totals):
            ax2.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
                    f'{total}', va='center', fontsize=10, color='white')
        ax2.grid(axis='x', alpha=0.3)

        # Timeline
        ax3 = fig.add_subplot(212)
        for i, (name, h) in enumerate(self.hypotheses.items()):
            ax3.scatter(h['year'], i, s=100, color=colors[i], zorder=5)
            ax3.annotate(f"{name}\\n({h['year']} BCE)",
                        (h['year'], i), textcoords="offset points",
                        xytext=(10, 0), fontsize=9, color=colors[i])
        ax3.axvspan(4, 8, alpha=0.1, color='#fbbf24', label='Herod\\'s reign overlap')
        ax3.set_xlabel('Year BCE', fontsize=11)
        ax3.set_title('Timeline of Candidate Events', fontsize=12)
        ax3.set_yticks([])
        ax3.invert_xaxis()
        ax3.legend(fontsize=9)
        ax3.grid(alpha=0.3)

        plt.tight_layout()
        plt.show()

# Build and evaluate
ev = HypothesisEvaluator()

# Scores: [Timing, Visibility, Brightness, Duration, Significance]
ev.add_hypothesis('Jupiter-Saturn\\nTriple Conjunction',
    [9, 9, 7, 10, 10], 7,
    'Three conjunctions over 8 months in Pisces; matched Babylonian astrological significance')

ev.add_hypothesis('Jupiter-Venus\\nConjunction',
    [6, 9, 9, 3, 7], 2,
    'Extremely bright but brief; timing conflicts with Herod death in 4 BCE')

ev.add_hypothesis('Nova in Aquila',
    [8, 8, 8, 5, 5], 5,
    'Recorded in Chinese annals; visible for 70 days; position less significant to Magi')

ev.add_hypothesis('Halley\\'s Comet',
    [3, 9, 8, 4, 4], 12,
    'Too early (12 BCE); comets were bad omens in ancient world, not good signs')

ev.add_hypothesis('Jupiter-Moon\\nOccultation',
    [7, 7, 6, 1, 6], 6,
    'Brief event; Jupiter hidden by Moon then reemerging; culturally significant')

ev.comparison_chart()

# Print detailed report
print("\\n" + "="*60)
print("STAR OF BETHLEHEM: HYPOTHESIS EVALUATION REPORT")
print("="*60)
sorted_hyp = sorted(ev.hypotheses.items(), key=lambda x: x[1]['total'], reverse=True)
for rank, (name, h) in enumerate(sorted_hyp, 1):
    print(f"\\n#{rank}: {name.replace(chr(10), ' ')} (Score: {h['total']}/50)")
    print(f"    Year: {h['year']} BCE")
    print(f"    {h['description']}")
    for criterion, score in zip(ev.criteria, h['scores']):
        bar = '█' * score + '░' * (10 - score)
        print(f"    {criterion.replace(chr(10), ' '):20s} [{bar}] {score}/10")`,
      challenge: 'Add your own hypothesis — a supernova, a bolide (bright meteor), or a combination of events. Score it honestly against the criteria. Can any single natural event explain ALL features of the Gospel account?',
      successHint: 'You have completed the capstone project. Starting from a story about wise men following a star, you built: a magnitude calculator, a conjunction simulator, a celestial navigator, a Kepler equation solver, an ephemeris engine, a perturbation simulator, a planetarium renderer, and a hypothesis evaluator. That is a complete journey from ancient wonder to modern computational astronomy.',
    },
    {
      title: 'Capstone Part 5 — Interactive sky simulator',
      concept: `The final exercise: build an **interactive sky simulator** that renders the night sky for any date, time, and location. This combines every skill from all four levels.

The simulator:
1. Computes planetary positions using Kepler’s equation
2. Transforms to horizontal coordinates (altitude-azimuth)
3. Adds a background star field
4. Labels constellations and planets
5. Marks the horizon, cardinal directions, and zenith
6. Highlights any conjunctions or notable configurations

Run it for Bethlehem, May 7 BCE, and see the sky the Magi saw.`,
      analogy: 'You are building a time machine for the night sky. Set the dial to any date in history, any place on Earth, and see the sky exactly as it appeared. Every planetarium show, every historical astronomical reconstruction, every "what did the sky look like when..." question is answered by this kind of simulation.',
      storyConnection: 'This is the culmination: you can now reconstruct the sky the Magi saw. Jupiter and Saturn blazing together in the east after sunset. Polaris marking their latitude. The crescent Moon perhaps nearby. Orion rising in the southeast. The entire dome of stars that guided three travelers on a 1,500 km journey to find a child in a manger.',
      checkQuestion: 'What aspects of the ancient sky would be different from today, beyond precession?',
      checkAnswer: 'Atmospheric conditions: less light pollution meant far more visible stars (magnitude 6+ everywhere). Proper motion: some fast-moving stars (like Barnard’s Star at 10 arcsec/year) have moved noticeably in 2,000 years, but most bright stars have barely shifted. Supernovae: there may have been nebulae visible then that have since faded. The Milky Way would have been a stunning band across the entire sky every clear night.',
      codeIntro: 'Build an all-sky dome view for any date and location.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def solve_kepler(M, e):
    E = M
    for _ in range(30):
        E -= (E - e*np.sin(E) - M) / (1 - e*np.cos(E))
    return E

def planet_geo_lon(t, a, e, P, L0, w):
    M = (2*np.pi/P * t + np.radians(L0-w)) % (2*np.pi)
    E = solve_kepler(M, e)
    nu = 2*np.arctan2(np.sqrt(1+e)*np.sin(E/2), np.sqrt(1-e)*np.cos(E/2))
    r = a*(1-e**2)/(1+e*np.cos(nu)); lon = nu + np.radians(w)
    return r*np.cos(lon), r*np.sin(lon)

def equatorial_to_altaz(ha_deg, dec_deg, lat_deg):
    ha, dec, lat = np.radians(ha_deg), np.radians(dec_deg), np.radians(lat_deg)
    sin_alt = np.sin(lat)*np.sin(dec) + np.cos(lat)*np.cos(dec)*np.cos(ha)
    alt = np.degrees(np.arcsin(np.clip(sin_alt, -1, 1)))
    cos_az = (np.sin(dec) - np.sin(lat)*sin_alt) / (np.cos(lat)*np.cos(np.radians(alt)) + 1e-10)
    az = np.degrees(np.arccos(np.clip(cos_az, -1, 1)))
    if np.sin(ha) > 0: az = 360 - az
    return alt, az

# Star catalogue (simplified: bright stars with RA, Dec, magnitude)
stars_cat = [
    ('Sirius', 6.75, -16.72, -1.46), ('Canopus', 6.40, -52.70, -0.74),
    ('Arcturus', 14.26, 19.18, -0.05), ('Vega', 18.62, 38.78, 0.03),
    ('Capella', 5.28, 46.00, 0.08), ('Rigel', 5.24, -8.20, 0.13),
    ('Betelgeuse', 5.92, 7.41, 0.42), ('Aldebaran', 4.60, 16.51, 0.87),
    ('Spica', 13.42, -11.16, 0.97), ('Antares', 16.49, -26.43, 1.06),
    ('Pollux', 7.76, 28.03, 1.14), ('Fomalhaut', 22.96, -29.62, 1.16),
    ('Deneb', 20.69, 45.28, 1.25), ('Regulus', 10.14, 11.97, 1.36),
    ('Polaris', 2.53, 89.26, 1.98),
]

# Settings
lat, lon = 31.7, 35.2  # Bethlehem
lst = 22.0  # Local sidereal time (hours) — evening view

fig, ax = plt.subplots(figsize=(10, 10), subplot_kw={'projection': 'polar'}, facecolor='#0a0e1a')
ax.set_facecolor('#0a0e1a')

# Plot stars
for name, ra, dec, mag in stars_cat:
    ha = (lst - ra) * 15
    alt, az = equatorial_to_altaz(ha, dec, lat)
    if alt > 0:
        r = 90 - alt  # zenith at center, horizon at edge
        theta = np.radians(az)
        size = max(1, (3 - mag) ** 2 * 3)
        ax.scatter(theta, r, s=size, color='white', alpha=min(1, (4-mag)/4), zorder=3)
        if mag < 1.5:
            ax.annotate(name, (theta, r), textcoords="offset points",
                       xytext=(5, 5), fontsize=7, color='#94a3b8')

# Random faint stars
np.random.seed(42)
for _ in range(300):
    az = np.random.uniform(0, 360)
    alt = np.random.uniform(5, 85)
    ax.scatter(np.radians(az), 90-alt, s=0.3, color='white', alpha=0.2)

# Planets for ~7 BCE
t_7bce = -2006.4
planets_data = [
    ('Jupiter', 5.203, 0.048, 11.86, 34.40, 14.75, '#f59e0b', 80),
    ('Saturn', 9.537, 0.054, 29.46, 49.94, 92.43, '#a78bfa', 50),
    ('Mars', 1.524, 0.093, 1.881, 355.45, 336.04, '#ef4444', 40),
]

for name, a, e, P, L0, w, color, size in planets_data:
    px, py = planet_geo_lon(t_7bce, a, e, P, L0, w)
    ex, ey = planet_geo_lon(t_7bce, 1.0, 0.017, 1.0, 100.46, 102.94)
    ecl_lon = np.degrees(np.arctan2(py-ey, px-ex)) % 360
    # Simplified: treat ecliptic longitude as RA (rough approximation)
    ha = (lst - ecl_lon/15) * 15
    alt, az = equatorial_to_altaz(ha, 0, lat)  # Dec~0 for ecliptic
    if alt > -5:
        r = max(0, 90 - alt)
        ax.scatter(np.radians(az), r, s=size, color=color, zorder=5, marker='*')
        ax.annotate(name, (np.radians(az), r), textcoords="offset points",
                   xytext=(8, 0), fontsize=10, color=color, fontweight='bold')

# Horizon and labels
ax.set_ylim(0, 90)
ax.set_yticks([0, 30, 60, 90])
ax.set_yticklabels(['90°', '60°', '30°', 'Horizon'], fontsize=8, color='#64748b')
ax.set_theta_zero_location('N')
ax.set_theta_direction(-1)
ax.set_xticks(np.radians([0, 90, 180, 270]))
ax.set_xticklabels(['N', 'E', 'S', 'W'], fontsize=12, color='#4ade80')
ax.grid(alpha=0.1, color='#334155')
ax.set_title('The Sky Over Bethlehem, ~May 7 BCE', fontsize=14, color='white', pad=20)

plt.tight_layout()
plt.show()

print("This is approximately what the Magi saw:")
print("  Jupiter and Saturn close together in the east")
print("  Polaris at 32° above the northern horizon")
print("  The Milky Way arcing overhead")
print("  No light pollution — thousands of stars visible")
print()
print("From ancient observation to modern simulation —")
print("the science of the stars bridges 2,000 years.")`,
      challenge: 'Run the simulation for your own location tonight. Compare the number of visible stars (magnitude < 6) with and without light pollution (magnitude limit 3). How much of the sky have modern city dwellers lost?',
      successHint: 'You have built a complete sky simulator from scratch. This capstone project combined every concept: magnitude scales, Kepler’s laws, coordinate transforms, orbital mechanics, celestial navigation, and data visualization. From a single story about wise men following a star, you learned the foundations of observational and computational astronomy.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Planetarium Engine
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete astronomical simulation system</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises build a complete planetarium engine. Click to start Python.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python</>)}
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
            diagram={[BethlehemConjunctionDiagram, BethlehemKeplerDiagram, BethlehemCelestialNavDiagram, BethlehemMagnitudeDiagram, OrbitalMechanicsDiagram, LatLongGridDiagram][i] ? createElement([BethlehemConjunctionDiagram, BethlehemKeplerDiagram, BethlehemCelestialNavDiagram, BethlehemMagnitudeDiagram, OrbitalMechanicsDiagram, LatLongGridDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
