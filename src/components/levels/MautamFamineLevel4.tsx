import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MautamFamineLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Building an ecological monitoring database',
      concept: `An ecological monitoring system tracks species populations, environmental conditions, and interventions over time. The database schema must handle:

- **Observations**: timestamped population counts at specific locations
- **Sites**: monitoring stations with GPS coordinates and habitat type
- **Species**: tracked organisms with life history parameters
- **Interventions**: management actions (trapping, poisoning, crop protection)
- **Outcomes**: measured effects of interventions

Proper schema design enables queries like:
- "Show population trends for all sites within 5 km of bamboo forest"
- "Compare crop survival between sites with and without predator programs"
- "Which intervention had the best cost-effectiveness ratio?"

📚 *SQL JOIN operations connect related tables. An INNER JOIN returns only matching rows; a LEFT JOIN keeps all rows from the left table even without matches.*`,
      analogy: 'An ecological database is like a hospital medical records system. Patients (monitoring sites) have charts (observations) recorded at each visit (survey). Doctors (ecologists) prescribe treatments (interventions) and track outcomes. The database lets any doctor review a patient\'s complete history and compare treatments across patients.',
      storyConnection: 'The Mizoram government lacked systematic ecological data during the 1959 Mautam. By 2007, satellite monitoring and field surveys provided better data, enabling more effective response. A proper monitoring database could transform Mautam preparedness from reactive to predictive.',
      checkQuestion: 'Why do we need separate tables for observations and sites instead of putting everything in one table?',
      checkAnswer: 'A single table would duplicate site information (GPS, habitat) in every observation row. This wastes space and creates inconsistency risk (what if you update the GPS for one observation but not another?). Separating them into linked tables (normalization) ensures each fact is stored exactly once.',
      codeIntro: 'Design and populate an ecological monitoring database for the Mautam.',
      code: `import sqlite3
import random
import json

random.seed(42)
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE sites (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    lat REAL, lon REAL,
    habitat TEXT CHECK(habitat IN ('bamboo_forest','agriculture','mixed','village')),
    dist_to_bamboo_km REAL
);

CREATE TABLE species (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    trophic_level INTEGER,
    max_growth_rate REAL,
    category TEXT
);

CREATE TABLE observations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER REFERENCES sites(id),
    species_id INTEGER REFERENCES species(id),
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    count INTEGER NOT NULL,
    method TEXT DEFAULT 'trap_survey'
);

CREATE TABLE interventions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER REFERENCES sites(id),
    type TEXT CHECK(type IN ('trapping','poisoning','predator_release','crop_fence','grain_store')),
    month INTEGER, year INTEGER,
    cost_inr REAL, effectiveness REAL
);
''')

# Populate sites
sites = [
    (1, 'Aizawl Forest Edge', 23.73, 92.72, 'bamboo_forest', 0.5),
    (2, 'Lunglei Agricultural', 22.88, 92.75, 'agriculture', 3.0),
    (3, 'Champhai Mixed', 23.47, 93.33, 'mixed', 1.5),
    (4, 'Kolasib Village', 24.22, 92.68, 'village', 5.0),
    (5, 'Serchhip Farm', 23.30, 92.85, 'agriculture', 2.0),
]
c.executemany('INSERT INTO sites VALUES (?,?,?,?,?,?)', sites)

# Populate species
species = [
    (1, 'Black rat', 2, 0.25, 'rodent'),
    (2, 'Bamboo rat', 2, 0.20, 'rodent'),
    (3, 'King cobra', 3, 0.05, 'predator'),
    (4, 'Barn owl', 3, 0.08, 'predator'),
    (5, 'Rice crop', 1, 0.10, 'crop'),
]
c.executemany('INSERT INTO species VALUES (?,?,?,?,?)', species)

# Generate 3 years of monthly observations (2006-2008, spanning Mautam)
for year in range(2006, 2009):
    for month in range(1, 13):
        for site in sites:
            for sp in species:
                is_mautam = year == 2007 and 3 <= month <= 10
                base = 100 if sp[4] == 'rodent' else 20 if sp[4] == 'predator' else 80
                base *= (1 - site[5] * 0.05)  # distance effect

                if sp[4] == 'rodent' and is_mautam:
                    base *= 5 + month * 0.5
                elif sp[4] == 'predator' and is_mautam:
                    base *= 1.5 + month * 0.1
                elif sp[4] == 'crop' and year == 2007 and month > 8:
                    base *= 0.3

                count = max(int(base + random.gauss(0, base * 0.2)), 0)
                c.execute('INSERT INTO observations (site_id, species_id, month, year, count, method) VALUES (?,?,?,?,?,?)',
                          (site[0], sp[0], month, year, count, 'trap_survey'))

conn.commit()

# Analytical queries
print("MAUTAM ECOLOGICAL MONITORING DATABASE")
print("=" * 60)

print("\
Total observations:", c.execute('SELECT COUNT(*) FROM observations').fetchone()[0])

print("\
Rat populations by site (2007 peak vs 2006 baseline):")
for row in c.execute('''
    SELECT s.name, s.dist_to_bamboo_km,
        AVG(CASE WHEN o.year=2006 THEN o.count END) as baseline,
        MAX(CASE WHEN o.year=2007 THEN o.count END) as peak,
        ROUND(1.0*MAX(CASE WHEN o.year=2007 THEN o.count END) /
              NULLIF(AVG(CASE WHEN o.year=2006 THEN o.count END), 0), 1) as ratio
    FROM observations o
    JOIN sites s ON o.site_id = s.id
    JOIN species sp ON o.species_id = sp.id
    WHERE sp.category = 'rodent'
    GROUP BY s.id ORDER BY s.dist_to_bamboo_km
'''):
    print(f"  {row[0]:<25} ({row[1]}km) baseline:{row[2]:>6.0f} peak:{row[3]:>6.0f} ratio:{row[4]}x")

print("\
Crop impact by distance to bamboo:")
for row in c.execute('''
    SELECT s.dist_to_bamboo_km,
        AVG(CASE WHEN o.year=2006 THEN o.count END) as normal,
        AVG(CASE WHEN o.year=2007 AND o.month>8 THEN o.count END) as post_mautam
    FROM observations o JOIN sites s ON o.site_id=s.id JOIN species sp ON o.species_id=sp.id
    WHERE sp.category='crop' GROUP BY s.id ORDER BY s.dist_to_bamboo_km
'''):
    pct = row[2]/row[1]*100 if row[1] else 0
    print(f"  {row[0]}km: normal={row[1]:.0f}, post-Mautam={row[2]:.0f} ({pct:.0f}% remaining)")

conn.close()`,
      challenge: 'Add intervention records and a query that calculates cost-effectiveness: crop yield saved per 1000 INR spent. Which intervention type gives the best return on investment at each distance from bamboo forest?',
      successHint: 'You built a real ecological monitoring database with proper normalization, referential integrity, and analytical queries. This is how conservation organizations like WWF and government wildlife departments manage field data — enabling evidence-based ecological management.',
    },
    {
      title: 'Predictive early warning system',
      concept: `Can we predict when a Mautam will turn critical? An **early warning system** monitors key indicators and triggers alerts:

**Leading indicators** (predict the crash before it happens):
- Bamboo flowering extent (satellite data)
- Rat trap counts exceeding threshold
- Grain prices rising in local markets
- Predator-to-prey ratio falling

**Alert levels**:
- GREEN: all indicators normal
- YELLOW: 1-2 indicators elevated
- ORANGE: 3+ indicators elevated
- RED: imminent crisis, activate response plan

We implement this as a **rule engine** backed by a database: observations feed into rules, which generate alerts, which trigger action plans.

📚 *SQL CASE expressions implement conditional logic inside queries. Combined with aggregate functions, they create a powerful rule evaluation engine.*`,
      analogy: 'An early warning system is like a smoke detector for the ecosystem. Individual indicators (smoke detector, CO detector, temperature sensor) each detect different dangers. When multiple alarms trigger simultaneously, the probability of real danger is much higher than any single alarm. The system must be sensitive enough to detect real threats but not so sensitive that it cries wolf.',
      storyConnection: 'The 2007 Mautam was better managed than 1959 largely because of early warning. The Mizoram government monitored bamboo flowering via satellite and started preparing 18 months in advance. A database-driven alert system could automate and systematize this early warning process.',
      checkQuestion: 'What is the danger of setting alert thresholds too low (too sensitive)?',
      checkAnswer: 'Too many false alarms lead to "alert fatigue" — people stop responding to alerts. The 2007 Mizoram government initially struggled to convince people that the Mautam was coming because many had not experienced one before. Overly sensitive systems can actually reduce preparedness by eroding trust.',
      codeIntro: 'Build a database-backed early warning system for Mautam famine prediction.',
      code: `import sqlite3
import random

random.seed(42)
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE indicators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month INTEGER, year INTEGER,
    bamboo_flowering_pct REAL,
    rat_trap_count INTEGER,
    grain_price_index REAL,
    predator_prey_ratio REAL
);

CREATE TABLE alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month INTEGER, year INTEGER,
    level TEXT CHECK(level IN ('GREEN','YELLOW','ORANGE','RED')),
    indicators_triggered TEXT,
    recommended_actions TEXT
);

CREATE TABLE thresholds (
    indicator TEXT PRIMARY KEY,
    yellow_threshold REAL,
    orange_threshold REAL,
    red_threshold REAL
);
''')

# Set thresholds
c.executemany('INSERT INTO thresholds VALUES (?,?,?,?)', [
    ('bamboo_flowering_pct', 5.0, 20.0, 50.0),
    ('rat_trap_count', 50, 150, 400),
    ('grain_price_index', 110, 130, 160),
    ('predator_prey_ratio', 0.15, 0.08, 0.03),
])

# Generate 3 years of monthly indicator data
for year in range(2006, 2009):
    for month in range(1, 13):
        t = (year - 2006) * 12 + month
        # Bamboo flowering ramps up in 2007
        bf = max(0, (t - 12) * 4 + random.gauss(0, 3)) if t > 10 else random.gauss(1, 0.5)
        bf = min(max(bf, 0), 100)
        # Rat counts follow flowering with 2-month lag
        rats = int(20 + max(0, bf * 3 * max(0, t-14)/12) + random.gauss(0, 15))
        # Grain price rises as rats increase
        grain = 100 + max(0, (rats - 40) * 0.3) + random.gauss(0, 5)
        # Predator-prey ratio drops as rats explode
        pp_ratio = max(0.01, 0.2 - rats * 0.0005 + random.gauss(0, 0.02))

        c.execute('INSERT INTO indicators (month, year, bamboo_flowering_pct, rat_trap_count, grain_price_index, predator_prey_ratio) VALUES (?,?,?,?,?,?)',
                  (month, year, round(bf,1), rats, round(grain,1), round(pp_ratio,3)))

        # Evaluate alert level
        triggered = []
        flags = 0

        thresholds = dict(c.execute('SELECT indicator, yellow_threshold, orange_threshold, red_threshold FROM thresholds').fetchall())

        if bf > 5: triggered.append('bamboo'); flags += 1
        if bf > 20: flags += 1
        if rats > 50: triggered.append('rats'); flags += 1
        if rats > 150: flags += 1
        if grain > 110: triggered.append('grain_price'); flags += 1
        if pp_ratio < 0.15: triggered.append('pred_prey'); flags += 1

        if flags >= 5: level = 'RED'
        elif flags >= 3: level = 'ORANGE'
        elif flags >= 1: level = 'YELLOW'
        else: level = 'GREEN'

        actions = {
            'GREEN': 'Routine monitoring',
            'YELLOW': 'Increase survey frequency, alert district officials',
            'ORANGE': 'Begin grain stockpiling, activate trapping programs',
            'RED': 'Full emergency response, request central aid'
        }

        c.execute('INSERT INTO alerts (month, year, level, indicators_triggered, recommended_actions) VALUES (?,?,?,?,?)',
                  (month, year, level, ','.join(triggered), actions[level]))

conn.commit()

# Analysis
print("MAUTAM EARLY WARNING SYSTEM — REPORT")
print("=" * 60)

print("\
Alert timeline:")
print(f"{'Date':<12} {'Level':<8} {'Triggers':<35} {'Action'}")
print("-" * 90)
for row in c.execute('''
    SELECT month, year, level, indicators_triggered, recommended_actions
    FROM alerts WHERE level != 'GREEN' ORDER BY year, month
'''):
    print(f"{row[1]}-{row[0]:02d}     {row[2]:<8} {row[3]:<35} {row[4]}")

print("\
Alert counts by level:")
for row in c.execute('SELECT level, COUNT(*) FROM alerts GROUP BY level ORDER BY COUNT(*) DESC'):
    bar = "█" * row[1]
    print(f"  {row[0]:<8}: {row[1]:>3} months  {bar}")

print("\
First RED alert:", c.execute("SELECT year||'-'||printf('%02d',month) FROM alerts WHERE level='RED' ORDER BY year,month LIMIT 1").fetchone()[0])
print("Lead time before peak rats:", end=" ")
peak = c.execute("SELECT year,month FROM indicators ORDER BY rat_trap_count DESC LIMIT 1").fetchone()
first_red = c.execute("SELECT year,month FROM alerts WHERE level='RED' ORDER BY year,month LIMIT 1").fetchone()
lead = (peak[0]-first_red[0])*12 + peak[1]-first_red[1]
print(f"{lead} months")

conn.close()`,
      challenge: 'Add a "false alarm rate" analysis: for each threshold configuration, count how many ORANGE/RED alerts occurred during non-Mautam periods (2006). Optimize thresholds to minimize false alarms while still providing at least 6 months of lead time for real events.',
      successHint: 'You built a complete early warning system with indicator monitoring, rule-based alerting, and action recommendations. This architecture is used in real disaster preparedness systems: flood warnings, earthquake alerts, and epidemic surveillance all follow this pattern.',
    },
    {
      title: 'Optimal resource allocation algorithm',
      concept: `Given limited resources (budget, personnel, equipment), how should Mautam response be allocated across sites? This is an **optimization problem**:

**Objective**: minimize total crop loss across all sites
**Constraints**: total budget ≤ available funds, personnel ≤ available workers
**Decision variables**: how much of each intervention to apply at each site

This is a **linear programming** problem (or integer programming if quantities must be whole numbers). We solve it using a **greedy algorithm**: repeatedly allocate the next unit of resource to the site-intervention combination with the highest marginal benefit.

📚 *We implement greedy optimization by sorting candidates by benefit-to-cost ratio, then greedily selecting the best until the budget is exhausted.*`,
      analogy: 'Resource allocation is like a fire department deciding where to send trucks. You have 5 trucks and 10 fires. Some fires are near buildings (high risk), some are in open fields (low risk). You cannot send a truck to every fire, so you prioritize by expected damage prevented per truck. The greedy approach sends each truck to the highest-priority remaining fire.',
      storyConnection: 'The Mizoram government in 2007 had to distribute limited rat poison, traps, and grain across hundreds of villages. Some villages were near bamboo forests (high risk), some were far away (lower risk). A systematic allocation algorithm could have optimized this distribution — saving more crops with the same budget.',
      checkQuestion: 'When does a greedy algorithm fail to find the optimal solution?',
      checkAnswer: 'Greedy algorithms fail when the best local choice is not the best global choice — when interventions interact. For example, crop fencing at site A might protect 100 units of crop, but that same budget spent on predator introduction at site B might protect 80 units at B AND 50 units at nearby site C (spillover effect). Greedy misses the interaction.',
      codeIntro: 'Implement a greedy resource allocation algorithm for Mautam response.',
      code: `import sqlite3
import random

random.seed(42)
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE sites (
    id INTEGER PRIMARY KEY, name TEXT,
    population INTEGER, dist_bamboo_km REAL,
    crop_area_hectares REAL, risk_score REAL
);

CREATE TABLE interventions (
    id INTEGER PRIMARY KEY, name TEXT,
    cost_per_unit REAL, effectiveness REAL,
    max_units_per_site INTEGER
);

CREATE TABLE allocations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER, intervention_id INTEGER,
    units INTEGER, expected_crop_saved REAL,
    cost REAL
);
''')

# Sites with varying risk
sites_data = [
    (1, 'Aizawl Edge', 5000, 0.5, 200, 0.95),
    (2, 'Lunglei Farm', 3000, 3.0, 150, 0.70),
    (3, 'Champhai Valley', 4000, 1.5, 300, 0.85),
    (4, 'Kolasib Village', 2000, 5.0, 100, 0.50),
    (5, 'Serchhip North', 3500, 2.0, 250, 0.80),
    (6, 'Mamit District', 2500, 4.0, 120, 0.55),
    (7, 'Saiha Remote', 1500, 6.0, 80, 0.35),
    (8, 'Lawngtlai South', 2800, 3.5, 180, 0.65),
]
c.executemany('INSERT INTO sites VALUES (?,?,?,?,?,?)', sites_data)

interventions_data = [
    (1, 'Rat trapping', 5000, 0.15, 10),
    (2, 'Poison bait', 3000, 0.20, 8),
    (3, 'Crop fencing', 15000, 0.40, 5),
    (4, 'Grain storage', 8000, 0.25, 6),
    (5, 'Predator release', 12000, 0.30, 3),
]
c.executemany('INSERT INTO interventions VALUES (?,?,?,?,?)', interventions_data)

# Greedy allocation
TOTAL_BUDGET = 500000  # INR

# Calculate benefit-to-cost for every (site, intervention) pair
candidates = []
for site in sites_data:
    for intv in interventions_data:
        crop_at_risk = site[4] * site[5]  # hectares * risk
        crop_saved = crop_at_risk * intv[3]  # effectiveness
        cost = intv[2]
        ratio = crop_saved / cost
        candidates.append({
            'site_id': site[0], 'site_name': site[1],
            'intv_id': intv[0], 'intv_name': intv[1],
            'crop_saved': crop_saved, 'cost': cost,
            'ratio': ratio, 'max_units': intv[4]
        })

# Sort by benefit-to-cost ratio (descending)
candidates.sort(key=lambda x: x['ratio'], reverse=True)

budget_remaining = TOTAL_BUDGET
allocated = {}
total_saved = 0

for cand in candidates:
    key = (cand['site_id'], cand['intv_id'])
    current_units = allocated.get(key, 0)
    if current_units >= cand['max_units']:
        continue
    if cand['cost'] > budget_remaining:
        continue

    units_to_add = min(cand['max_units'] - current_units,
                       int(budget_remaining / cand['cost']))
    if units_to_add <= 0:
        continue

    cost = units_to_add * cand['cost']
    saved = units_to_add * cand['crop_saved']
    allocated[key] = current_units + units_to_add
    budget_remaining -= cost
    total_saved += saved

    c.execute('INSERT INTO allocations (site_id, intervention_id, units, expected_crop_saved, cost) VALUES (?,?,?,?,?)',
              (cand['site_id'], cand['intv_id'], units_to_add, round(saved, 1), cost))

conn.commit()

print("MAUTAM RESOURCE ALLOCATION — GREEDY OPTIMIZER")
print(f"Budget: {TOTAL_BUDGET:,} INR")
print("=" * 70)

print(f"\
{'Site':<20} {'Intervention':<18} {'Units':>6} {'Saved(ha)':>10} {'Cost':>10}")
print("-" * 70)
for row in c.execute('''
    SELECT s.name, i.name, a.units, a.expected_crop_saved, a.cost
    FROM allocations a JOIN sites s ON a.site_id=s.id JOIN interventions i ON a.intervention_id=i.id
    ORDER BY a.expected_crop_saved DESC
'''):
    print(f"{row[0]:<20} {row[1]:<18} {row[2]:>6} {row[3]:>10.1f} {row[4]:>10,}")

print(f"\
Budget used: {TOTAL_BUDGET - budget_remaining:,} / {TOTAL_BUDGET:,} INR")
print(f"Total crop saved: {total_saved:.0f} hectare-equivalents")
print(f"Cost per hectare saved: {(TOTAL_BUDGET - budget_remaining) / max(total_saved, 1):.0f} INR")

# Summary by site
print("\
Allocation by site:")
for row in c.execute('''
    SELECT s.name, COUNT(*) as interventions, SUM(a.cost) as total_cost,
           SUM(a.expected_crop_saved) as total_saved
    FROM allocations a JOIN sites s ON a.site_id=s.id
    GROUP BY s.id ORDER BY total_saved DESC
'''):
    print(f"  {row[0]:<20}: {row[1]} interventions, {row[2]:>8,} INR, {row[3]:.0f} ha saved")

conn.close()`,
      challenge: 'Compare the greedy solution with a random allocation of the same budget. Run 100 random allocations and compare their average crop saved to the greedy result. How much better is the greedy approach?',
      successHint: 'You implemented a resource allocation optimizer combining database queries with greedy algorithms. This is how real disaster response is planned: limited resources must be distributed to maximize total benefit, and systematic algorithms outperform ad-hoc decision-making.',
    },
    {
      title: 'Historical simulation and policy evaluation',
      concept: `The final capstone integrates everything: monitoring data, population models, early warning, and resource allocation into a **historical simulation and policy evaluation** tool.

We simulate the 2007 Mautam with and without various policy interventions:
1. **Baseline**: no intervention (1959 scenario)
2. **Reactive**: respond only after RED alert
3. **Proactive**: begin preparations at YELLOW alert
4. **Optimal**: use the allocation algorithm with maximum budget

For each scenario, we track:
- Crop survival (% of pre-Mautam level)
- Economic cost (intervention spending + crop loss)
- Food security (months below famine threshold)

📚 *This capstone combines sqlite3, numpy, and algorithmic optimization into one integrated analysis pipeline — the kind of computational tool that real policy analysts build.*`,
      analogy: 'Policy evaluation through simulation is like a flight simulator for government. Real policy experiments are expensive and irreversible — you cannot "undo" a failed famine response. But simulations let you test policies repeatedly at zero cost, learn from failures, and optimize before real stakes are involved.',
      storyConnection: 'The contrast between 1959 and 2007 shows that preparedness works. But how much more effective could the 2007 response have been? This simulation tool lets us explore that question: given what we know about ecology and resource allocation, what would the optimal Mautam response look like?',
      checkQuestion: 'Why should policy simulations include uncertainty (stochastic models) rather than just deterministic "average case" projections?',
      checkAnswer: 'Average-case projections can be dangerously misleading. A policy that works well "on average" might fail catastrophically 20% of the time. Decision-makers need to see the full distribution of outcomes — especially the worst case. A policy that saves slightly less crop on average but eliminates the worst outcomes may be much better overall.',
      codeIntro: 'Build a comprehensive Mautam policy evaluation simulator with multiple scenarios and outcome tracking.',
      code: `import sqlite3
import numpy as np

np.random.seed(42)
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE scenarios (
    id INTEGER PRIMARY KEY, name TEXT,
    description TEXT, alert_threshold TEXT,
    budget_inr REAL, start_month INTEGER
);

CREATE TABLE results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scenario_id INTEGER, run_id INTEGER,
    final_crop_pct REAL, months_famine INTEGER,
    total_cost REAL, peak_rats REAL,
    crop_loss_value REAL
);
''')

scenarios = [
    (1, 'No intervention', 'No response (1959)', 'NONE', 0, 99),
    (2, 'Late reactive', 'Respond at RED alert only', 'RED', 200000, 0),
    (3, 'Early reactive', 'Respond at ORANGE alert', 'ORANGE', 300000, 0),
    (4, 'Proactive', 'Respond at YELLOW alert', 'YELLOW', 500000, 0),
    (5, 'Maximum prep', 'Full early preparation', 'GREEN', 800000, 0),
]
c.executemany('INSERT INTO scenarios VALUES (?,?,?,?,?,?)', scenarios)

def simulate_mautam(intervention_start, budget, n_runs=50):
    results_list = []

    for run in range(n_runs):
        rats = 3000.0
        preds = 40.0
        crops = 100.0
        budget_spent = 0
        famine_months = 0
        peak_rats = 0

        for month in range(36):
            # Mautam food pulse
            food = 8.0 if 6 <= month <= 16 else 1.0
            noise = np.random.normal(0, 0.1)

            # Rat growth
            K = 80000 * food
            growth = 0.2 * (1 + noise) * rats * (1 - rats / K)
            predation = 0.003 * rats * preds
            rats = max(rats + growth - predation, 50)

            # Intervention effect
            if month >= intervention_start and budget_spent < budget:
                monthly_spend = min(budget * 0.1, budget - budget_spent)
                kill_rate = monthly_spend / budget * 0.05
                rats *= (1 - kill_rate)
                crop_protect = monthly_spend / budget * 0.3
                budget_spent += monthly_spend

            # Predator dynamics
            pred_growth = 0.0003 * rats * preds - 0.15 * preds
            preds = max(preds + pred_growth, 5)

            # Crop damage (post-flowering)
            if month > 16:
                damage = 0.00004 * rats * (1 - (crop_protect if month >= intervention_start else 0))
                crops = max(crops - damage, 0)

            if crops < 30:
                famine_months += 1
            peak_rats = max(peak_rats, rats)

        crop_loss_value = (100 - crops) * 10000  # INR per percentage point
        results_list.append((crops, famine_months, budget_spent, peak_rats, crop_loss_value))

    return results_list

print("MAUTAM POLICY EVALUATION — SIMULATION RESULTS")
print("=" * 70)

for scen in scenarios:
    sid, name, desc, thresh, budget, _ = scen

    # Determine intervention start month based on threshold
    if thresh == 'NONE': start = 99
    elif thresh == 'RED': start = 16
    elif thresh == 'ORANGE': start = 12
    elif thresh == 'YELLOW': start = 8
    else: start = 4  # GREEN = start early

    runs = simulate_mautam(start, budget, n_runs=100)

    for i, (crop, fam, cost, peak, loss) in enumerate(runs):
        c.execute('INSERT INTO results (scenario_id, run_id, final_crop_pct, months_famine, total_cost, peak_rats, crop_loss_value) VALUES (?,?,?,?,?,?,?)',
                  (sid, i, round(crop, 1), fam, round(cost), round(peak), round(loss)))

conn.commit()

# Compare scenarios
print(f"\
{'Scenario':<18} {'Crop%':>7} {'Famine':>8} {'Budget':>10} {'Loss':>10} {'Net Cost':>10}")
print(f"{'':18} {'(median)':>7} {'(months)':>8} {'Spent':>10} {'Value':>10} {'(total)':>10}")
print("-" * 70)

for row in c.execute('''
    SELECT s.name,
        ROUND(AVG(r.final_crop_pct),1),
        ROUND(AVG(r.months_famine),1),
        ROUND(AVG(r.total_cost)),
        ROUND(AVG(r.crop_loss_value)),
        ROUND(AVG(r.total_cost + r.crop_loss_value))
    FROM results r JOIN scenarios s ON r.scenario_id = s.id
    GROUP BY s.id ORDER BY 6
'''):
    print(f"{row[0]:<18} {row[1]:>7.1f} {row[2]:>8.1f} {row[3]:>10,.0f} {row[4]:>10,.0f} {row[5]:>10,.0f}")

# Risk analysis: worst case
print("\
Worst-case analysis (10th percentile crop survival):")
for row in c.execute('''
    SELECT s.name, MIN(r.final_crop_pct), MAX(r.months_famine)
    FROM results r JOIN scenarios s ON r.scenario_id = s.id
    GROUP BY s.id ORDER BY 2
'''):
    print(f"  {row[0]:<18}: worst crop = {row[1]:.1f}%, max famine = {row[2]} months")

# Best strategy
best = c.execute('''
    SELECT s.name, ROUND(AVG(r.total_cost + r.crop_loss_value))
    FROM results r JOIN scenarios s ON r.scenario_id=s.id
    GROUP BY s.id ORDER BY 2 LIMIT 1
''').fetchone()
print(f"\
Optimal strategy: {best[0]} (total cost: {best[1]:,.0f} INR)")

conn.close()`,
      challenge: 'Add a "budget sensitivity" analysis: for the proactive scenario, vary the budget from 100k to 1M INR in 10 steps. Plot total cost (budget + crop loss) vs budget. Is there an optimal budget level? This is the "investment sweet spot" that policy-makers need.',
      successHint: 'You built a complete policy evaluation tool combining population simulation, database management, and statistical analysis. This is the kind of computational analysis that informs real government disaster preparedness: evidence-based, quantitative, and transparent. The Mautam, a tragedy repeated across centuries, can be mitigated through computational science and proactive policy.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Database-Driven Ecological Management</span>
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
