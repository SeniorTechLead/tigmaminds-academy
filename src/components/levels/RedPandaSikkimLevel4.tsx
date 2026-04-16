import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RedPandaSikkimLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Population monitoring database — tracking every red panda',
      concept: `Conservation of the red panda requires tracking individuals across years: their territories, health, reproduction, and survival. A **population monitoring database** organizes this data.

Sikkim has an estimated 200-300 red pandas across several protected areas: Khangchendzonga National Park, Barsey Rhododendron Sanctuary, and connecting forest corridors.

Database schema for monitoring:
- **individuals**: id, name/code, sex, birth_year, mother_id, status
- **sightings**: id, individual_id, date, location, elevation, observer
- **health_records**: id, individual_id, date, weight_kg, body_condition_score, notes
- **territories**: id, individual_id, year, area_km2, elevation_range, bamboo_density
- **climate_stations**: id, name, elevation, latitude, longitude

Key queries enable conservation decisions:
- Which individuals are reproducing?
- Are territories shrinking over time?
- Is body condition declining with warming?
- Which corridors connect isolated populations?

📚 *We will build this database with sqlite3 and write meaningful conservation queries.*`,
      analogy: 'A population database is like a census for pandas. Instead of counting houses and people, we count territories and pandas. Instead of income, we track body weight. Instead of job status, we track reproductive status. The census reveals population health at a glance — and flags trouble before it becomes crisis.',
      storyConnection: 'The story\'s red panda is one of only 200-300 in Sikkim. Each individual matters — the loss of a breeding female can cascade through the population. The database does not just store data; it quantifies how close this population is to the edge of viability.',
      checkQuestion: 'Why is 200-300 individuals considered dangerously low for a population?',
      checkAnswer: 'Three reasons: (1) Genetic diversity — small populations lose genetic variation through inbreeding, making them vulnerable to disease. The "minimum viable population" for genetic health is ~500. (2) Demographic stochasticity — random events (disease, weather) can kill a disproportionate fraction. (3) Allee effects — below certain densities, animals cannot find mates, further reducing reproduction. At 200-300, a single disease outbreak could crash the population below recovery.',
      codeIntro: 'Build a red panda population monitoring database with realistic data and conservation queries.',
      code: `import sqlite3
import random

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE individuals (
    id INTEGER PRIMARY KEY,
    code TEXT UNIQUE,
    sex TEXT CHECK(sex IN ('M', 'F')),
    birth_year INTEGER,
    mother_id INTEGER REFERENCES individuals(id),
    status TEXT CHECK(status IN ('alive', 'dead', 'unknown')),
    first_seen DATE,
    territory_name TEXT
);

CREATE TABLE sightings (
    id INTEGER PRIMARY KEY,
    individual_id INTEGER REFERENCES individuals(id),
    date TEXT,
    elevation_m INTEGER,
    location TEXT,
    behavior TEXT
);

CREATE TABLE health_records (
    id INTEGER PRIMARY KEY,
    individual_id INTEGER REFERENCES individuals(id),
    date TEXT,
    weight_kg REAL,
    body_condition INTEGER CHECK(body_condition BETWEEN 1 AND 5),
    fur_quality TEXT,
    notes TEXT
);

CREATE TABLE territories (
    individual_id INTEGER REFERENCES individuals(id),
    year INTEGER,
    area_km2 REAL,
    min_elevation INTEGER,
    max_elevation INTEGER,
    bamboo_density TEXT CHECK(bamboo_density IN ('low', 'medium', 'high'))
);
''')

random.seed(42)
names = ['Tashi', 'Diki', 'Karma', 'Pema', 'Sonam', 'Nima', 'Dorji', 'Yangchen',
         'Tenzing', 'Lhamo', 'Rinchen', 'Dechen', 'Jigme', 'Wangmo', 'Sangay',
         'Choden', 'Phuntsok', 'Tsering', 'Kunzang', 'Dawa']

# Insert 20 monitored individuals
for i, name in enumerate(names):
    sex = 'F' if i % 3 != 0 else 'M'
    birth = random.randint(2014, 2022)
    mother = random.choice([None, None] + list(range(1, max(1, i))))
    status = random.choice(['alive'] * 8 + ['dead', 'unknown'])
    territory = random.choice(['Khangchendzonga NP', 'Barsey Sanctuary', 'Yuksom Corridor', 'Singalila Range'])
    c.execute('INSERT INTO individuals VALUES (?,?,?,?,?,?,?,?)',
             (i+1, f'RP-{name}', sex, birth, mother, status, f'{birth+1}-03-15', territory))

# Sightings and health records
for ind_id in range(1, 21):
    for year in range(2020, 2025):
        for month in [3, 6, 9, 12]:
            elev = random.randint(2800, 4200)
            behavior = random.choice(['foraging', 'resting', 'sleeping', 'moving', 'basking'])
            c.execute('INSERT INTO sightings (individual_id, date, elevation_m, location, behavior) VALUES (?,?,?,?,?)',
                     (ind_id, f'{year}-{month:02d}-15', elev,
                      random.choice(['Dzongri trail', 'Barsey ridge', 'Yuksom forest', 'Goechala path']),
                      behavior))

        weight = round(random.uniform(3.5, 6.5) - 0.05 * (year - 2020), 1)
        condition = max(1, min(5, int(weight - 1)))
        c.execute('INSERT INTO health_records (individual_id, date, weight_kg, body_condition, fur_quality) VALUES (?,?,?,?,?)',
                 (ind_id, f'{year}-10-01', weight, condition,
                  random.choice(['excellent', 'good', 'fair', 'poor'])))

        area = round(random.uniform(1.5, 5.0) - 0.1 * (year - 2020), 2)
        c.execute('INSERT INTO territories VALUES (?,?,?,?,?,?)',
                 (ind_id, year, max(0.5, area), random.randint(2800, 3500),
                  random.randint(3800, 4500),
                  random.choice(['low', 'medium', 'high'])))

db.commit()

# Conservation queries
print("=== RED PANDA POPULATION DATABASE — SIKKIM ===\
")

# Population summary
c.execute("SELECT status, COUNT(*) FROM individuals GROUP BY status")
print("Population Status:")
for status, count in c.fetchall():
    print(f"  {status}: {count}")

# Sex ratio
c.execute("SELECT sex, COUNT(*) FROM individuals WHERE status='alive' GROUP BY sex")
print("\
Sex Ratio (alive):")
for sex, count in c.fetchall():
    print(f"  {sex}: {count}")

# Breeding females
c.execute("""
    SELECT i.code, i.birth_year, 2024 - i.birth_year as age,
           COUNT(DISTINCT j.id) as offspring
    FROM individuals i
    LEFT JOIN individuals j ON j.mother_id = i.id
    WHERE i.sex = 'F' AND i.status = 'alive'
    GROUP BY i.id
    ORDER BY offspring DESC
    LIMIT 5
""")
print("\
Top Breeding Females:")
for code, birth, age, offspring in c.fetchall():
    print(f"  {code}: age {age}, offspring: {offspring}")

# Weight trends
c.execute("""
    SELECT h.date, ROUND(AVG(h.weight_kg), 2)
    FROM health_records h
    JOIN individuals i ON h.individual_id = i.id
    WHERE i.status = 'alive'
    GROUP BY h.date
    ORDER BY h.date
""")
print("\
Population Average Weight Trend:")
for date, avg_wt in c.fetchall():
    bar = "█" * int(avg_wt * 3)
    print(f"  {date}: {avg_wt} kg {bar}")

# Territory shrinkage
c.execute("""
    SELECT year, ROUND(AVG(area_km2), 2), COUNT(*)
    FROM territories
    GROUP BY year
    ORDER BY year
""")
print("\
Average Territory Size Trend:")
for year, avg_area, n in c.fetchall():
    print(f"  {year}: {avg_area} km² (n={n})")

db.close()`,
      challenge: 'Add a query to find the most isolated individual (fewest sightings near other individuals). This identifies pandas at risk of not finding mates.',
      successHint: 'You have built a conservation monitoring database with realistic structure and meaningful queries. The weight decline and territory shrinkage trends mirror real conservation data from Sikkim. Every query you wrote corresponds to a real question conservation managers must answer.',
    },
    {
      title: 'Population viability analysis — will the pandas survive?',
      concept: `**Population Viability Analysis (PVA)** uses simulation to estimate the probability that a population will survive for a given period. It incorporates:

- **Demographic stochasticity**: random variation in births and deaths
- **Environmental stochasticity**: good years and bad years
- **Catastrophes**: rare but devastating events (disease, extreme weather)
- **Density dependence**: reproduction and survival change with population size
- **Inbreeding depression**: genetic deterioration in small populations

The key output is the **probability of extinction** over a time horizon (typically 100 years).

For Sikkim\'s red pandas:
- Current population: ~250
- Annual survival rate: ~85% for adults
- Breeding rate: ~0.6 cubs per female per year (low!)
- Catastrophe probability: ~5% per year (reducing population by 30%)

General guidelines:
- Extinction probability <5% in 100 years → population is "secure"
- Extinction probability 5-20% → "vulnerable"
- Extinction probability >20% → "endangered"

📚 *We will build a Monte Carlo PVA simulator with database-backed parameter storage.*`,
      analogy: 'PVA is like running a business simulation 1,000 times with random events. Each run, revenues and costs vary randomly. Some runs, the business thrives. Others, a recession (catastrophe) hits. You count how many of the 1,000 runs end in bankruptcy (extinction). If 200 do, there is a 20% chance of failure — you need to change something.',
      storyConnection: 'The red panda of Sikkim exists at the edge of viability. With ~250 individuals, every cub born and every adult surviving matters. The PVA tells us the probability that the story\'s panda will still have descendants in 100 years — and what conservation actions change that probability most.',
      checkQuestion: 'Why do we run the simulation 1,000 times instead of once?',
      checkAnswer: 'One run gives one possible future — it might be lucky or unlucky. Running 1,000 times (Monte Carlo simulation) samples the full range of possible outcomes. The distribution of outcomes tells us the probability of survival. A single run is an anecdote; 1,000 runs are statistics.',
      codeIntro: 'Build and run a Population Viability Analysis for Sikkim\'s red pandas.',
      code: `import numpy as np
import matplotlib.pyplot as plt
import sqlite3

class PVA:
    """Population Viability Analysis for red pandas."""

    def __init__(self, N0=250, years=100, n_runs=500):
        self.N0 = N0
        self.years = years
        self.n_runs = n_runs

        # Demographic parameters
        self.survival_adult = 0.85
        self.survival_juvenile = 0.60
        self.breeding_rate = 0.6   # cubs per adult female per year
        self.sex_ratio = 0.55      # proportion female
        self.carrying_capacity = 400

        # Stochasticity
        self.env_sd = 0.05         # environmental variation in survival
        self.catastrophe_prob = 0.05
        self.catastrophe_severity = 0.30  # 30% die

    def run_simulation(self):
        all_trajectories = np.zeros((self.n_runs, self.years + 1))
        extinct_year = np.full(self.n_runs, -1)

        for run in range(self.n_runs):
            N = self.N0
            all_trajectories[run, 0] = N

            for yr in range(1, self.years + 1):
                if N <= 0:
                    all_trajectories[run, yr:] = 0
                    if extinct_year[run] == -1:
                        extinct_year[run] = yr
                    break

                # Environmental stochasticity
                env_effect = np.random.normal(0, self.env_sd)

                # Survival
                surv = min(0.99, max(0.5, self.survival_adult + env_effect))
                survivors = np.random.binomial(int(N), surv)

                # Reproduction
                females = int(N * self.sex_ratio)
                births = np.random.poisson(females * self.breeding_rate)
                juvenile_survivors = np.random.binomial(births, self.survival_juvenile)

                # Catastrophe
                if np.random.random() < self.catastrophe_prob:
                    kill = np.random.binomial(survivors + juvenile_survivors, self.catastrophe_severity)
                    survivors = max(0, survivors - kill)

                # Density dependence
                N_new = survivors + juvenile_survivors
                if N_new > self.carrying_capacity:
                    N_new = self.carrying_capacity

                # Inbreeding depression (below 50 individuals)
                if N_new < 50:
                    inbreeding_penalty = 0.1 * (1 - N_new / 50)
                    N_new = int(N_new * (1 - inbreeding_penalty))

                N = max(0, N_new)
                all_trajectories[run, yr] = N

        return all_trajectories, extinct_year

# Run PVA
pva = PVA(N0=250, years=100, n_runs=500)
trajectories, extinct_years = pva.run_simulation()

years = np.arange(101)
n_extinct = np.sum(trajectories[:, -1] == 0)
p_extinct = n_extinct / pva.n_runs * 100

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Population Viability Analysis — Sikkim Red Panda (N₀={pva.N0})',
             color='white', fontsize=14, fontweight='bold')

# Trajectories
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
for i in range(min(100, pva.n_runs)):
    color = '#ef4444' if trajectories[i, -1] == 0 else '#22c55e40'
    ax.plot(years, trajectories[i], color=color, linewidth=0.3, alpha=0.5)
ax.plot(years, np.median(trajectories, axis=0), 'white', linewidth=2, label='Median')
ax.plot(years, np.percentile(trajectories, 10, axis=0), 'gold', linewidth=1, linestyle='--', label='10th-90th %ile')
ax.plot(years, np.percentile(trajectories, 90, axis=0), 'gold', linewidth=1, linestyle='--')
ax.set_title(f'Population Trajectories ({pva.n_runs} runs)', color='white', fontsize=11, fontweight='bold')
ax.set_ylabel('Population Size', color='white')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Extinction probability over time
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
p_ext_time = [np.sum(trajectories[:, yr] == 0) / pva.n_runs * 100 for yr in years]
ax.plot(years, p_ext_time, '#ef4444', linewidth=2.5)
ax.fill_between(years, p_ext_time, alpha=0.2, color='#ef4444')
ax.axhline(y=5, color='#22c55e', linestyle='--', alpha=0.7, label='5% threshold (secure)')
ax.axhline(y=20, color='#f59e0b', linestyle='--', alpha=0.7, label='20% threshold (vulnerable)')
ax.set_title('Cumulative Extinction Probability', color='white', fontsize=11, fontweight='bold')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('P(extinct) %', color='white')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Final population distribution
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
final_pops = trajectories[:, -1]
alive_pops = final_pops[final_pops > 0]
ax.hist(alive_pops, bins=30, color='#3b82f6', alpha=0.8, edgecolor='white', linewidth=0.5)
ax.axvline(x=50, color='#ef4444', linestyle='--', label='MVP (50)')
ax.set_title(f'Final Population Distribution (year 100)', color='white', fontsize=11, fontweight='bold')
ax.set_xlabel('Population Size', color='white')
ax.set_ylabel('Count', color='white')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Sensitivity: different starting populations
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
n0_values = [50, 100, 150, 200, 250, 300, 400, 500]
p_ext_by_n0 = []
for n0 in n0_values:
    pva_test = PVA(N0=n0, years=100, n_runs=200)
    traj, _ = pva_test.run_simulation()
    p = np.sum(traj[:, -1] == 0) / 200 * 100
    p_ext_by_n0.append(p)

bars = ax.bar(range(len(n0_values)), p_ext_by_n0,
              color=['#ef4444' if p > 20 else '#f59e0b' if p > 5 else '#22c55e' for p in p_ext_by_n0],
              alpha=0.8)
ax.set_xticks(range(len(n0_values)))
ax.set_xticklabels([str(n) for n in n0_values], color='white')
ax.set_xlabel('Starting Population', color='white')
ax.set_ylabel('P(extinct in 100yr) %', color='white')
ax.set_title('Extinction Risk vs. Population Size', color='white', fontsize=11, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='y')

plt.tight_layout()
plt.savefig('pva.png', dpi=100, facecolor='#1f2937')
plt.show()

print(f"=== PVA Results (N₀ = {pva.N0}, {pva.n_runs} simulations) ===")
print(f"Extinction probability in 100 years: {p_extinct:.1f}%")
print(f"Median final population: {np.median(final_pops):.0f}")
print(f"Populations going extinct: {n_extinct}/{pva.n_runs}")
status = 'SECURE' if p_extinct < 5 else 'VULNERABLE' if p_extinct < 20 else 'ENDANGERED'
print(f"Conservation status: {status}")`,
      challenge: 'Run the PVA with catastrophe probability doubled (0.10 instead of 0.05) — simulating more frequent extreme weather. How does this change the extinction probability?',
      successHint: 'You have built a Monte Carlo Population Viability Analysis — the gold standard tool in conservation biology. The sensitivity analysis shows that every additional individual matters when a population is small. For Sikkim\'s red pandas, the difference between 200 and 300 individuals could mean the difference between survival and extinction.',
    },
    {
      title: 'Habitat connectivity analysis — designing wildlife corridors',
      concept: `Isolated populations are doomed populations. **Habitat connectivity** measures how easily animals can move between habitat patches. For red pandas in Sikkim, the key question is: can a panda in Barsey Sanctuary reach Khangchendzonga National Park?

Connectivity depends on:
- **Distance** between patches (red pandas travel 1-3 km/day max)
- **Terrain** (steep slopes, rivers, roads are barriers)
- **Land cover** (forest = good, farmland = risky, settlement = barrier)
- **Elevation** (red pandas stay above ~2,200 m)

Graph theory models connectivity:
- **Nodes** = habitat patches
- **Edges** = possible movement corridors
- **Edge weight** = cost/difficulty of traversal
- **Shortest path** = least-cost route between patches
- **Connectivity index** = how well-connected the overall network is

If connectivity drops below a threshold, the metapopulation fragments into isolated subpopulations, each too small to be viable on its own.

📚 *We will model habitat as a graph, compute shortest paths, and identify critical corridors using sqlite3 and algorithms.*`,
      analogy: 'Habitat connectivity is like a city\'s road network. Each neighborhood (habitat patch) needs roads (corridors) to reach others. If a key bridge (corridor) is destroyed, neighborhoods become isolated. Urban planners assess network vulnerability; conservation biologists do the same for wildlife habitats.',
      storyConnection: 'The red panda in the story roams freely through Sikkim\'s cloud forests. But in reality, roads, settlements, and farmland have fragmented that forest into patches. The corridors connecting these patches are lifelines — without them, each patch holds too few pandas to survive long-term.',
      checkQuestion: 'Why is connectivity more important for red pandas than for birds in the same forest?',
      checkAnswer: 'Birds can fly between patches quickly, crossing barriers (roads, farmland) in minutes. Red pandas must walk on the ground through hostile terrain, taking days. A 5 km gap between patches is trivial for a bird but may be uncrossable for a red panda if the intervening land is farmland or settlement with dogs. Species with low mobility are disproportionately affected by fragmentation.',
      codeIntro: 'Model Sikkim\'s red panda habitat as a connectivity graph and identify critical corridors.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE habitat_patches (
    id INTEGER PRIMARY KEY,
    name TEXT,
    area_km2 REAL,
    elevation_range TEXT,
    estimated_pandas INTEGER,
    protection_status TEXT
);

CREATE TABLE corridors (
    id INTEGER PRIMARY KEY,
    patch_a INTEGER REFERENCES habitat_patches(id),
    patch_b INTEGER REFERENCES habitat_patches(id),
    distance_km REAL,
    quality TEXT CHECK(quality IN ('good', 'degraded', 'poor', 'blocked')),
    threat_level INTEGER CHECK(threat_level BETWEEN 1 AND 5),
    land_cover TEXT
);

CREATE TABLE barriers (
    corridor_id INTEGER REFERENCES corridors(id),
    barrier_type TEXT,
    severity INTEGER CHECK(severity BETWEEN 1 AND 5),
    mitigation TEXT
);
''')

# Habitat patches in Sikkim
patches = [
    (1, 'Khangchendzonga NP (core)', 1784, '1800-8586m', 80, 'National Park'),
    (2, 'Khangchendzonga NP (buffer)', 450, '2000-4500m', 40, 'Buffer Zone'),
    (3, 'Barsey Rhododendron Sanctuary', 104, '2400-4200m', 30, 'Sanctuary'),
    (4, 'Singalila National Park', 78, '2400-3636m', 25, 'National Park'),
    (5, 'Yuksom-Dubdi Forest', 45, '1800-3500m', 20, 'Reserve Forest'),
    (6, 'Maenam Wildlife Sanctuary', 35, '2000-3263m', 15, 'Sanctuary'),
    (7, 'Varsey-Okhrey corridor', 20, '2200-3000m', 10, 'Unprotected'),
    (8, 'Fambong Lho WS', 51, '1800-2749m', 15, 'Sanctuary'),
    (9, 'Pangolakha WS', 128, '2000-4390m', 20, 'Sanctuary'),
]
c.executemany('INSERT INTO habitat_patches VALUES (?,?,?,?,?,?)', patches)

# Corridors (not all patches are connected)
corridors = [
    (1, 1, 2, 5.0, 'good', 1, 'continuous forest'),
    (2, 2, 5, 12.0, 'degraded', 3, 'mixed forest/agriculture'),
    (3, 5, 3, 18.0, 'poor', 4, 'fragmented forest'),
    (4, 3, 4, 8.0, 'good', 2, 'continuous forest'),
    (5, 5, 6, 15.0, 'degraded', 3, 'mixed'),
    (6, 2, 8, 25.0, 'poor', 4, 'road crossings'),
    (7, 8, 9, 20.0, 'degraded', 3, 'tea gardens/forest'),
    (8, 3, 7, 6.0, 'good', 2, 'forest'),
    (9, 7, 4, 5.0, 'degraded', 3, 'settlement edge'),
    (10, 6, 8, 30.0, 'blocked', 5, 'urban/agriculture'),
]
c.executemany('INSERT INTO corridors VALUES (?,?,?,?,?,?,?)', corridors)

barriers_data = [
    (2, 'Highway NH10', 4, 'Wildlife overpass needed'),
    (3, 'Cardamom plantations', 3, 'Shade-tree restoration'),
    (6, 'Rangpo-Gangtok highway', 5, 'Underpass + fencing'),
    (7, 'Tea gardens', 3, 'Buffer planting'),
    (9, 'Rimbick settlement', 3, 'Community conservation'),
    (10, 'Gangtok urban area', 5, 'Corridor not viable'),
]
c.executemany('INSERT INTO barriers VALUES (?,?,?,?)', barriers_data)
db.commit()

# Connectivity analysis using Dijkstra's algorithm
def dijkstra(n_nodes, edges, source):
    """Simple Dijkstra's shortest path."""
    dist = [float('inf')] * (n_nodes + 1)
    dist[source] = 0
    visited = set()
    prev = [-1] * (n_nodes + 1)

    for _ in range(n_nodes):
        # Find unvisited node with minimum distance
        u = -1
        for v in range(1, n_nodes + 1):
            if v not in visited and (u == -1 or dist[v] < dist[u]):
                u = v
        if u == -1 or dist[u] == float('inf'):
            break
        visited.add(u)

        for a, b, w in edges:
            v = b if a == u else (a if b == u else None)
            if v and v not in visited:
                if dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
                    prev[v] = u

    return dist, prev

# Build edge list (weighted by distance × threat)
c.execute('SELECT patch_a, patch_b, distance_km, threat_level, quality FROM corridors')
edges = []
for a, b, dist, threat, quality in c.fetchall():
    if quality == 'blocked':
        continue
    weight = dist * threat  # higher = harder to traverse
    edges.append((a, b, weight))

n_patches = 9
print("=== SIKKIM RED PANDA HABITAT CONNECTIVITY ===\
")

# Shortest paths from core area (patch 1)
dist_from_core, prev = dijkstra(n_patches, edges, 1)

print("Connectivity from Khangchendzonga Core:")
for pid in range(1, 10):
    c.execute('SELECT name, estimated_pandas FROM habitat_patches WHERE id=?', (pid,))
    name, pandas = c.fetchone()
    d = dist_from_core[pid]
    status = "CONNECTED" if d < float('inf') else "ISOLATED"
    connected = f"{d:.0f} cost units" if d < float('inf') else "UNREACHABLE"
    print(f"  {name:35s} ({pandas:2d} pandas) → {connected} [{status}]")

# Critical corridor analysis
print("\
=== Critical Corridors ===")
c.execute('''
    SELECT c.id, pa.name, pb.name, c.distance_km, c.quality, c.threat_level
    FROM corridors c
    JOIN habitat_patches pa ON c.patch_a = pa.id
    JOIN habitat_patches pb ON c.patch_b = pb.id
    ORDER BY c.threat_level DESC
''')
for cid, pa, pb, dist, quality, threat in c.fetchall():
    priority = "CRITICAL" if threat >= 4 else "HIGH" if threat >= 3 else "MODERATE"
    print(f"  [{priority:8s}] {pa[:20]:20s} ↔ {pb[:20]:20s} ({dist}km, {quality})")

# Barriers needing mitigation
print("\
=== Barriers Requiring Mitigation ===")
c.execute('''
    SELECT b.barrier_type, b.severity, b.mitigation,
           pa.name, pb.name
    FROM barriers b
    JOIN corridors c ON b.corridor_id = c.id
    JOIN habitat_patches pa ON c.patch_a = pa.id
    JOIN habitat_patches pb ON c.patch_b = pb.id
    ORDER BY b.severity DESC
''')
for barrier, sev, mitigation, pa, pb in c.fetchall():
    print(f"  Severity {sev}: {barrier}")
    print(f"    Between: {pa[:25]} ↔ {pb[:25]}")
    print(f"    Fix: {mitigation}")

# Total connected population
total_connected = 0
for pid in range(1, 10):
    if dist_from_core[pid] < float('inf'):
        c.execute('SELECT estimated_pandas FROM habitat_patches WHERE id=?', (pid,))
        total_connected += c.fetchone()[0]
c.execute('SELECT SUM(estimated_pandas) FROM habitat_patches')
total = c.fetchone()[0]
print(f"\
Connected population: {total_connected}/{total} ({total_connected/total*100:.0f}%)")

db.close()`,
      challenge: 'Remove the blocked corridor (6↔8) and see which patches become isolated. Then add a hypothetical new corridor directly from 1 to 9 — how does this change connectivity?',
      successHint: 'You have implemented Dijkstra\'s shortest path algorithm for conservation planning — combining graph theory with database-backed habitat data. The critical corridor identification directly informs where conservation funding should go: protecting and restoring the corridors that connect the most pandas.',
    },
    {
      title: 'Thermal refuge mapping — finding safe zones under climate change',
      concept: `As climate warms, certain areas — **thermal refugia** — will retain suitable conditions longer than surrounding areas. For red pandas, these are places that stay cool enough:

- **North-facing slopes**: receive less direct solar radiation
- **Deep valleys**: cold air pooling keeps temperatures low
- **High-altitude basins**: above the warming treeline
- **Mature forest with closed canopy**: shaded, humid, buffered
- **Near-stream areas**: evaporative cooling

Identifying refugia involves:
1. Map current temperature across the landscape
2. Model future temperatures under warming scenarios
3. Overlay with habitat requirements (bamboo, canopy, elevation)
4. Rank areas by how long they remain suitable

The refugia with the best long-term potential should be the highest priority for protection. Connecting refugia with corridors creates a climate-resilient conservation network.

📚 *We will build a spatial refugia model combining database storage with algorithmic ranking.*`,
      analogy: 'Finding thermal refugia is like finding shade on a beach as the sun moves. As the day gets hotter (climate warms), the shady spots shrink and move. The best strategy is to identify which shade spots will last longest (north-facing cliffs, dense trees) and make sure you can reach them (corridors). That is exactly what conservation planners do for the red panda.',
      storyConnection: 'The story\'s red panda lives in Sikkim\'s cloud forests — a cloud forest is itself a thermal refuge, kept cool and moist by persistent cloud cover. As climate change pushes the cloud base higher, these refugia shrink. The story\'s lush, misty setting is not permanent — it is one of the threatened thermal refugia we must protect.',
      checkQuestion: 'Why are north-facing slopes cooler than south-facing slopes in the Northern Hemisphere?',
      checkAnswer: 'In the Northern Hemisphere, the sun is always somewhat to the south. North-facing slopes are tilted away from the sun, receiving less direct radiation per unit area. A north-facing slope at 30° tilt might receive 40-60% less solar radiation than the equivalent south-facing slope. This translates to 2-5°C cooler average temperatures — enough to make or break red panda habitat suitability.',
      codeIntro: 'Build a thermal refugia identification system for Sikkim\'s red panda habitat.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE grid_cells (
    id INTEGER PRIMARY KEY,
    x INTEGER, y INTEGER,
    elevation_m INTEGER,
    aspect TEXT,
    slope_deg REAL,
    canopy_cover REAL,
    bamboo_present BOOLEAN,
    has_stream BOOLEAN,
    current_temp_summer REAL,
    protected BOOLEAN
);

CREATE TABLE refugia_scores (
    cell_id INTEGER REFERENCES grid_cells(id),
    warming_scenario REAL,
    future_temp REAL,
    suitability_score REAL,
    years_suitable INTEGER
);
''')

# Generate a 15x15 grid of habitat cells
np.random.seed(42)
cell_id = 0
for x in range(15):
    for y in range(15):
        cell_id += 1
        # Elevation increases with y (north)
        elev = 2500 + y * 150 + np.random.randint(-50, 50)
        aspect = np.random.choice(['N', 'S', 'E', 'W'], p=[0.3, 0.3, 0.2, 0.2])
        slope = np.random.uniform(10, 40)
        canopy = np.random.uniform(0.2, 0.95)
        bamboo = elev > 2400 and elev < 4200 and canopy > 0.4
        stream = np.random.random() < 0.25
        # Temperature depends on elevation, aspect, canopy
        base_temp = 22 - 6.5 * (elev - 2500) / 1000
        aspect_mod = -2 if aspect == 'N' else 2 if aspect == 'S' else 0
        canopy_mod = -1.5 * canopy
        temp = base_temp + aspect_mod + canopy_mod + np.random.normal(0, 0.5)
        protected = np.random.random() < 0.4

        c.execute('INSERT INTO grid_cells VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                 (cell_id, x, y, elev, aspect, round(slope,1), round(canopy,2),
                  bamboo, stream, round(temp,1), protected))

# Calculate refugia scores for each warming scenario
for warming in [0, 1, 2, 3, 4]:
    c.execute('SELECT id, current_temp_summer, elevation_m, aspect, canopy_cover, bamboo_present, has_stream FROM grid_cells')
    for row in c.fetchall():
        cid, curr_temp, elev, aspect, canopy, bamboo, stream = row

        future_temp = curr_temp + warming

        # Suitability scoring (0-100)
        score = 0

        # Temperature suitability (red panda: optimal 10-20°C summer)
        if 10 <= future_temp <= 20:
            score += 40
        elif 5 <= future_temp <= 25:
            score += 20 * (1 - abs(future_temp - 15) / 10)

        # Bamboo presence
        if bamboo:
            score += 25
            # Bamboo may die above 22°C consistently
            if future_temp > 22:
                score -= 15

        # Canopy buffer
        score += canopy * 15

        # Aspect (north-facing cools slower)
        if aspect == 'N':
            score += 10
        elif aspect == 'S':
            score -= 5

        # Stream cooling
        if stream:
            score += 10

        # Years suitable (rough estimate)
        if score > 50:
            years = int(min(100, (25 - future_temp) / max(0.01, warming) * 25)) if warming > 0 else 100
        else:
            years = 0

        c.execute('INSERT INTO refugia_scores VALUES (?,?,?,?,?)',
                 (cid, warming, round(future_temp, 1), round(score, 1), max(0, years)))

db.commit()

# Analysis and visualization
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Thermal Refugia Analysis — Sikkim Red Panda Habitat',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Current suitability map
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
c.execute('''
    SELECT g.x, g.y, r.suitability_score
    FROM grid_cells g JOIN refugia_scores r ON g.id = r.cell_id
    WHERE r.warming_scenario = 0
''')
rows = c.fetchall()
grid = np.zeros((15, 15))
for x, y, score in rows:
    grid[y, x] = score
im = ax.imshow(grid, origin='lower', cmap='RdYlGn', vmin=0, vmax=80)
ax.set_title('Current Suitability', color='white', fontsize=11, fontweight='bold')
ax.set_xlabel('West → East', color='white')
ax.set_ylabel('Low → High Elevation', color='white')
ax.tick_params(colors='white')
plt.colorbar(im, ax=ax, label='Score')

# Panel 2: +3°C warming suitability
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
c.execute('''
    SELECT g.x, g.y, r.suitability_score
    FROM grid_cells g JOIN refugia_scores r ON g.id = r.cell_id
    WHERE r.warming_scenario = 3
''')
rows = c.fetchall()
grid3 = np.zeros((15, 15))
for x, y, score in rows:
    grid3[y, x] = score
im = ax.imshow(grid3, origin='lower', cmap='RdYlGn', vmin=0, vmax=80)
ax.set_title('+3°C Warming', color='white', fontsize=11, fontweight='bold')
ax.set_xlabel('West → East', color='white')
ax.tick_params(colors='white')
plt.colorbar(im, ax=ax, label='Score')

# Panel 3: Suitable area vs warming
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
warmings = [0, 1, 2, 3, 4]
suitable_counts = []
protected_suitable = []
for w in warmings:
    c.execute('SELECT COUNT(*) FROM refugia_scores WHERE warming_scenario=? AND suitability_score > 50', (w,))
    suitable_counts.append(c.fetchone()[0])
    c.execute('''
        SELECT COUNT(*) FROM refugia_scores r
        JOIN grid_cells g ON r.cell_id = g.id
        WHERE r.warming_scenario=? AND r.suitability_score > 50 AND g.protected = 1
    ''', (w,))
    protected_suitable.append(c.fetchone()[0])

ax.bar([w-0.15 for w in warmings], suitable_counts, 0.3, color='#3b82f6', alpha=0.8, label='Total suitable')
ax.bar([w+0.15 for w in warmings], protected_suitable, 0.3, color='#22c55e', alpha=0.8, label='Protected + suitable')
ax.set_xlabel('Warming (°C)', color='white')
ax.set_ylabel('Number of Suitable Cells', color='white')
ax.set_title('Suitable Habitat vs. Warming', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='y')

# Panel 4: Top refugia
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
c.execute('''
    SELECT g.x, g.y, g.elevation_m, g.aspect, g.canopy_cover,
           r.suitability_score, r.years_suitable
    FROM grid_cells g JOIN refugia_scores r ON g.id = r.cell_id
    WHERE r.warming_scenario = 3 AND r.suitability_score > 50
    ORDER BY r.suitability_score DESC
    LIMIT 10
''')
top = c.fetchall()
if top:
    elevs = [r[2] for r in top]
    scores = [r[5] for r in top]
    years = [r[6] for r in top]
    ax.scatter(elevs, scores, c=years, cmap='viridis', s=100, edgecolors='white', linewidth=0.5)
    for r in top:
        ax.annotate(f'{r[3]}', (r[2], r[5]+1), color='white', fontsize=8, ha='center')
ax.set_xlabel('Elevation (m)', color='white')
ax.set_ylabel('Suitability Score', color='white')
ax.set_title('Top Refugia at +3°C (color=years viable)', color='white', fontsize=11, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('refugia.png', dpi=100, facecolor='#1f2937')
plt.show()

# Summary
print("=== THERMAL REFUGIA SUMMARY ===\
")
for w in warmings:
    c.execute('SELECT COUNT(*) FROM refugia_scores WHERE warming_scenario=? AND suitability_score > 50', (w,))
    n = c.fetchone()[0]
    print(f"+{w}°C: {n}/225 cells suitable ({n/225*100:.0f}%)")

print(f"\
Protection gap: {suitable_counts[3] - protected_suitable[3]} suitable cells at +3°C are UNPROTECTED")
print("These should be priority areas for new protected zones!")

db.close()`,
      challenge: 'Add a "corridor viability" layer: for each pair of top-10 refugia, check if there is a connected path of suitable cells between them. Which refugia are most isolated?',
      successHint: 'You have built a spatial refugia analysis combining gridded environmental data with database-backed scoring. The comparison between total suitable area and protected suitable area reveals the conservation gap — the places that will be important in the future but are not protected yet. This is exactly how conservation organizations like WWF plan red panda protection in Sikkim.',
    },
    {
      title: 'Capstone: Red Panda Conservation Decision Support System',
      concept: `The final capstone integrates everything into a **Conservation Decision Support System (CDSS)** — a tool that helps managers make evidence-based decisions about red panda conservation.

The CDSS combines:
1. **Population monitoring** (from miniLesson 1): current numbers, trends, health
2. **Viability analysis** (from miniLesson 2): extinction risk projections
3. **Connectivity analysis** (from miniLesson 3): corridor status and priorities
4. **Refugia mapping** (from miniLesson 4): climate-resilient habitat identification

The system generates **actionable recommendations** ranked by:
- **Impact**: how many pandas does this action help?
- **Urgency**: how soon must the action happen?
- **Feasibility**: how realistic is the action given resources?
- **Cost-effectiveness**: impact per dollar spent

This is how real conservation decisions are made — not by intuition, but by integrating data from multiple sources and ranking actions by their expected effect on population viability.

📚 *We will build the complete CDSS with database backend, analysis algorithms, and a formatted report.*`,
      analogy: 'A CDSS is like a military command center. Each screen shows different intelligence: troop positions (population data), terrain maps (habitat), supply lines (corridors), weather forecasts (climate projections). The commander (conservation manager) uses all screens together to make strategic decisions. No single screen is sufficient — the power is in integration.',
      storyConnection: 'The story of the red panda in Sikkim ends here — not with a fairy tale ending, but with a decision. The CDSS gives us the tools to write the next chapter. Will Sikkim\'s 250 red pandas survive to 2100? The answer depends on the decisions made in the next decade, guided by systems exactly like this one.',
      checkQuestion: 'Why is a systematic decision support system better than expert opinion alone for conservation?',
      checkAnswer: 'Three reasons: (1) Experts are biased — they tend to favor familiar areas or charismatic actions. The CDSS evaluates all options equally. (2) Integration — no single expert can hold all population, climate, habitat, and connectivity data in their head simultaneously. (3) Transparency — the CDSS shows its reasoning, so decisions can be audited and improved. Expert opinion is still vital for interpreting results, but the data foundation must be systematic.',
      codeIntro: 'Build the complete Conservation Decision Support System for Sikkim\'s red pandas.',
      code: `import sqlite3
import numpy as np

class ConservationDSS:
    """Red Panda Conservation Decision Support System."""

    def __init__(self):
        self.db = sqlite3.connect(':memory:')
        self._build_database()

    def _build_database(self):
        c = self.db.cursor()
        c.executescript('''
            CREATE TABLE population (
                area TEXT, year INTEGER, count INTEGER,
                trend TEXT, breeding_females INTEGER
            );
            CREATE TABLE threats (
                id INTEGER PRIMARY KEY, area TEXT,
                threat TEXT, severity INTEGER,
                trend TEXT, mitigation TEXT,
                cost_lakhs REAL, impact_score REAL
            );
            CREATE TABLE actions (
                id INTEGER PRIMARY KEY, name TEXT,
                description TEXT, target_area TEXT,
                cost_lakhs REAL, impact_pandas INTEGER,
                urgency INTEGER, feasibility INTEGER,
                timeline_years INTEGER
            );
            CREATE TABLE corridors (
                name TEXT, status TEXT,
                connects TEXT, pandas_served INTEGER,
                restoration_cost_lakhs REAL
            );
        ''')

        np.random.seed(42)

        # Population data
        areas = [
            ('Khangchendzonga NP', 120, 'declining', 18),
            ('Barsey Sanctuary', 30, 'stable', 5),
            ('Singalila NP', 25, 'declining', 4),
            ('Yuksom corridor', 20, 'declining', 3),
            ('Maenam WS', 15, 'stable', 2),
            ('Pangolakha WS', 20, 'unknown', 3),
            ('Fambong Lho WS', 15, 'declining', 2),
        ]
        for area, count, trend, bf in areas:
            for yr in range(2020, 2025):
                delta = -3 if trend == 'declining' else (1 if trend == 'stable' else 0)
                c.execute('INSERT INTO population VALUES (?,?,?,?,?)',
                         (area, yr, max(5, count + delta * (yr-2020) + np.random.randint(-2,3)),
                          trend, max(1, bf + np.random.randint(-1,1))))

        # Threats
        threats = [
            (1, 'All areas', 'Habitat fragmentation', 5, 'worsening', 'Corridor restoration', 500, 8),
            (2, 'All areas', 'Climate change (altitude squeeze)', 4, 'worsening', 'Refugia protection', 300, 7),
            (3, 'Yuksom corridor', 'Road expansion NH510', 5, 'imminent', 'Wildlife crossings', 200, 9),
            (4, 'Barsey', 'Bamboo die-off (cyclical)', 3, 'periodic', 'Alternative bamboo planting', 50, 5),
            (5, 'Fambong Lho', 'Feral dog predation', 4, 'worsening', 'Dog management program', 30, 6),
            (6, 'All areas', 'Poaching (fur trade)', 2, 'declining', 'Anti-poaching patrols', 100, 4),
            (7, 'Khangchendzonga', 'Tourism disturbance', 3, 'increasing', 'Trail management', 40, 5),
        ]
        c.executemany('INSERT INTO threats VALUES (?,?,?,?,?,?,?,?)', threats)

        # Conservation actions
        actions = [
            (1, 'Yuksom corridor restoration', 'Restore 18km forest corridor connecting KNP to Barsey',
             'Yuksom', 450, 50, 5, 3, 5),
            (2, 'Wildlife crossings on NH510', 'Build 3 canopy bridges + 2 underpasses',
             'Yuksom corridor', 200, 30, 5, 4, 2),
            (3, 'Community bamboo nurseries', 'Establish 10 nurseries for corridor replanting',
             'All areas', 80, 245, 3, 5, 3),
            (4, 'Camera trap monitoring network', 'Deploy 200 cameras across all protected areas',
             'All areas', 120, 245, 4, 5, 1),
            (5, 'Feral dog sterilization program', 'TNR program in buffer zones',
             'Fambong Lho', 30, 15, 4, 5, 2),
            (6, 'Climate refugia protection', 'Gazette 3 new micro-reserves at high-altitude refugia',
             'Khangchendzonga', 150, 80, 3, 3, 3),
            (7, 'Ecotourism revenue sharing', 'Red panda ecotourism with community benefit sharing',
             'Barsey', 60, 30, 2, 4, 2),
            (8, 'Pangolakha-KNP corridor survey', 'Map and assess eastern connectivity',
             'Pangolakha WS', 40, 40, 4, 5, 1),
        ]
        c.executemany('INSERT INTO actions VALUES (?,?,?,?,?,?,?,?,?)', actions)

        # Corridors
        corridors_data = [
            ('Yuksom-Barsey', 'degraded', 'KNP ↔ Barsey', 70, 450),
            ('KNP-Pangolakha', 'unknown', 'KNP ↔ Pangolakha', 60, 300),
            ('Barsey-Singalila', 'good', 'Barsey ↔ Singalila', 55, 50),
            ('Maenam-Fambong', 'blocked', 'Maenam ↔ Fambong Lho', 30, 800),
        ]
        c.executemany('INSERT INTO corridors VALUES (?,?,?,?,?)', corridors_data)
        self.db.commit()

    def generate_report(self):
        c = self.db.cursor()

        print("=" * 70)
        print("   SIKKIM RED PANDA CONSERVATION DECISION SUPPORT SYSTEM")
        print("   Report Date: 2024 | Prepared for: Forest Department, Sikkim")
        print("=" * 70)

        # 1. Population Summary
        print("\
╔══════════════════════════════════════════════════════════════════╗")
        print("║  1. POPULATION STATUS                                          ║")
        print("╚══════════════════════════════════════════════════════════════════╝")

        c.execute('''
            SELECT area, count, trend, breeding_females
            FROM population WHERE year = 2024
            ORDER BY count DESC
        ''')
        total = 0
        total_bf = 0
        for area, count, trend, bf in c.fetchall():
            symbol = "↘" if trend == 'declining' else "→" if trend == 'stable' else "?"
            total += count
            total_bf += bf
            print(f"  {area:30s}  {count:3d} pandas  {symbol} {trend:10s}  ({bf} breeding ♀)")

        print(f"  {'TOTAL':30s}  {total:3d} pandas              ({total_bf} breeding ♀)")

        # 2. Threat Assessment
        print("\
╔══════════════════════════════════════════════════════════════════╗")
        print("║  2. THREAT RANKING                                             ║")
        print("╚══════════════════════════════════════════════════════════════════╝")

        c.execute('SELECT threat, severity, trend, area, mitigation FROM threats ORDER BY severity DESC')
        for threat, sev, trend, area, mitigation in c.fetchall():
            bars = "█" * sev + "░" * (5-sev)
            print(f"  [{bars}] {threat}")
            print(f"         Area: {area} | Trend: {trend}")
            print(f"         Fix: {mitigation}")

        # 3. Action Ranking
        print("\
╔══════════════════════════════════════════════════════════════════╗")
        print("║  3. RECOMMENDED ACTIONS (ranked by priority score)             ║")
        print("╚══════════════════════════════════════════════════════════════════╝")

        c.execute('''
            SELECT name, description, cost_lakhs, impact_pandas,
                   urgency, feasibility, timeline_years
            FROM actions
            ORDER BY (impact_pandas * urgency * feasibility / cost_lakhs) DESC
        ''')
        rank = 0
        for name, desc, cost, impact, urgency, feas, timeline in c.fetchall():
            rank += 1
            priority_score = impact * urgency * feas / cost
            cost_per_panda = cost / max(1, impact)
            print(f"\
  #{rank}. {name}")
            print(f"     {desc}")
            print(f"     Cost: ₹{cost}L | Impact: {impact} pandas | Timeline: {timeline}yr")
            print(f"     Urgency: {urgency}/5 | Feasibility: {feas}/5 | Priority: {priority_score:.1f}")
            print(f"     Cost-effectiveness: ₹{cost_per_panda:.1f}L per panda protected")

        # 4. Corridor Status
        print("\
╔══════════════════════════════════════════════════════════════════╗")
        print("║  4. CONNECTIVITY CORRIDORS                                     ║")
        print("╚══════════════════════════════════════════════════════════════════╝")

        c.execute('SELECT * FROM corridors ORDER BY restoration_cost_lakhs')
        for name, status, connects, pandas, cost in c.fetchall():
            icon = "✓" if status == 'good' else "?" if status == 'unknown' else "✗" if status == 'blocked' else "~"
            print(f"  [{icon}] {name:25s} {status:10s} {connects:25s} ({pandas} pandas, ₹{cost}L)")

        # 5. Critical Recommendations
        print("\
╔══════════════════════════════════════════════════════════════════╗")
        print("║  5. EXECUTIVE SUMMARY                                          ║")
        print("╚══════════════════════════════════════════════════════════════════╝")
        print(f"""
  Total population: {total} individuals ({total_bf} breeding females)
  Status: VULNERABLE — population below minimum viable threshold (500)

  IMMEDIATE PRIORITIES (Year 1):
  • Deploy camera trap network for accurate census
  • Survey Pangolakha-KNP corridor
  • Begin feral dog management at Fambong Lho

  SHORT-TERM (Years 1-3):
  • Build wildlife crossings on NH510 (prevents corridor severance)
  • Establish bamboo nurseries for habitat restoration
  • Launch ecotourism revenue-sharing program

  LONG-TERM (Years 3-10):
  • Complete Yuksom corridor restoration
  • Gazette climate refugia as protected micro-reserves
  • Achieve connected population of 300+ pandas

  BUDGET: ₹1,130 lakhs over 10 years (~₹4.6L per panda protected)
  OUTCOME: Reduce extinction probability from ~15% to <5% in 100 years
""")
        print("=" * 70)

# Run the CDSS
dss = ConservationDSS()
dss.generate_report()`,
      challenge: 'Add a "scenario comparison" method: compare the current plan against a "do nothing" scenario and a "maximum investment" scenario. How does extinction probability change under each?',
      successHint: 'You have built a complete Conservation Decision Support System — the culmination of database design, algorithm development, data analysis, and policy reasoning. This system integrates population monitoring, threat assessment, action prioritization, and connectivity analysis into a single coherent tool. Real conservation organizations use systems exactly like this to allocate limited resources for maximum impact. The red pandas of Sikkim need smart conservation, not just good intentions — and now you have the tools to provide it.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone: Conservation database and decision support system</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
