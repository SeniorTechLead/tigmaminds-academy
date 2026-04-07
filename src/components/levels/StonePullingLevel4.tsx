import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function StonePullingLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Stone-pulling event database — tracking community engineering',
      concept: `A historical database of stone-pulling events captures the engineering knowledge accumulated over generations. Each event records:

- **Stone properties**: mass, dimensions, rock type
- **Path details**: distance, elevation change, surface preparation
- **Workforce**: number of people, teams, coordination method
- **Techniques**: rollers, ramps, lubrication, lever tools
- **Outcomes**: time, success/failure, lessons learned

This is a form of **engineering knowledge management** — the same approach used by modern construction companies to learn from past projects and improve future ones.

📚 *SQLite supports CREATE TABLE, INSERT, SELECT, JOIN, GROUP BY, and aggregate functions (SUM, AVG, COUNT, MIN, MAX). These are the building blocks of data management.*`,
      analogy: 'A stone-pulling database is like a cookbook that records every meal ever cooked in the village — ingredients, methods, results. Over time, patterns emerge: larger stones need more people, wet paths are faster, certain roller sizes work best for certain stone types. The database makes this accumulated wisdom searchable and precise.',
      storyConnection: 'Naga stone-pulling knowledge was traditionally passed down orally from elders to younger generations. A database preserves this knowledge permanently, makes it searchable, and enables quantitative analysis that oral tradition cannot support.',
      checkQuestion: 'Why would an engineer prefer a relational database over a simple spreadsheet for tracking construction projects?',
      checkAnswer: 'Relational databases enforce data integrity (foreign keys prevent orphaned records), support complex queries across multiple tables simultaneously, handle concurrent access, scale to millions of records, and provide transactions (all-or-nothing updates). A spreadsheet lacks all of these — it is fine for 100 rows but fails at 10,000. Real engineering projects generate enormous datasets that only databases can manage.',
      codeIntro: 'Create a comprehensive stone-pulling event database with historical records.',
      code: `import sqlite3
import numpy as np

conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
    CREATE TABLE stones (
        stone_id INTEGER PRIMARY KEY,
        name TEXT,
        mass_kg REAL,
        length_m REAL,
        width_m REAL,
        height_m REAL,
        rock_type TEXT,
        tensile_strength_mpa REAL
    );

    CREATE TABLE paths (
        path_id INTEGER PRIMARY KEY,
        start_location TEXT,
        end_location TEXT,
        distance_m REAL,
        elevation_gain_m REAL,
        surface_type TEXT,
        avg_slope_deg REAL
    );

    CREATE TABLE events (
        event_id INTEGER PRIMARY KEY,
        stone_id INTEGER REFERENCES stones(stone_id),
        path_id INTEGER REFERENCES paths(path_id),
        event_date TEXT,
        village TEXT,
        n_pullers INTEGER,
        n_teams INTEGER,
        technique TEXT,
        roller_diameter_cm REAL,
        lubrication TEXT,
        duration_hours REAL,
        success INTEGER,
        notes TEXT
    );

    CREATE TABLE measurements (
        meas_id INTEGER PRIMARY KEY,
        event_id INTEGER REFERENCES events(event_id),
        time_min REAL,
        distance_m REAL,
        force_kn REAL,
        speed_m_per_min REAL
    );
''')

# Insert historical stones
np.random.seed(42)
stones = [
    (1, 'Kohima Memorial Stone', 5200, 2.8, 1.6, 0.9, 'granite', 10.0),
    (2, 'Village Gate Stone', 3800, 2.2, 1.4, 0.7, 'sandstone', 5.0),
    (3, 'Feast of Merit Stone', 7500, 3.5, 2.0, 1.1, 'granite', 12.0),
    (4, 'Ancestor Stone', 2500, 1.8, 1.2, 0.5, 'limestone', 4.0),
    (5, 'Grand Monolith', 12000, 4.0, 2.5, 1.4, 'granite', 10.0),
]
c.executemany('INSERT INTO stones VALUES (?,?,?,?,?,?,?,?)', stones)

paths = [
    (1, 'Quarry Hill', 'Village Center', 350, 20, 'packed earth', 3.3),
    (2, 'Riverside', 'Village Gate', 200, 8, 'gravel', 2.3),
    (3, 'Mountain Base', 'Hilltop Shrine', 500, 45, 'mixed', 5.1),
    (4, 'Field Edge', 'Ancestor Grounds', 150, 5, 'grass', 1.9),
    (5, 'Quarry', 'Ceremonial Plaza', 800, 35, 'prepared earth', 2.5),
]
c.executemany('INSERT INTO paths VALUES (?,?,?,?,?,?,?)', paths)

events_data = [
    (1,1,1,'2020-03-15','Kohima',80,4,'rollers+ramp',15,'water',3.5,1,'Successful, mild rain'),
    (2,2,2,'2020-11-20','Khonoma',45,3,'rollers',12,'none',2.0,1,'Dry conditions'),
    (3,3,3,'2021-02-10','Tuensang',150,8,'rollers+ramp+levers',20,'animal fat',6.5,1,'Largest pull in decade'),
    (4,4,4,'2021-08-05','Mokokchung',30,2,'dragging',0,'water',1.5,1,'Small stone, simple pull'),
    (5,1,1,'2022-03-12','Kohima',75,4,'rollers+ramp',15,'water',4.0,1,'Repeat of 2020 route'),
    (6,5,5,'2022-12-01','Zunheboto',200,10,'full system',22,'palm oil',8.0,1,'Record stone, 3-day prep'),
    (7,2,3,'2023-06-15','Dimapur',50,3,'rollers',12,'water',5.0,0,'Failed: stone cracked on steep section'),
    (8,3,1,'2023-11-08','Kohima',120,6,'rollers+ramp',18,'water',5.5,1,'Modified route from 2020'),
]
c.executemany('INSERT INTO events VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', events_data)

# Generate measurements for each successful event
for event_id in [1,2,3,4,5,6,8]:
    event = c.execute('SELECT e.duration_hours, p.distance_m FROM events e JOIN paths p ON e.path_id=p.path_id WHERE e.event_id=?', (event_id,)).fetchone()
    if event:
        dur_min = event[0] * 60
        dist = event[1]
        n_points = 20
        for j in range(n_points):
            t = dur_min * (j + 1) / n_points
            d = dist * (1 - np.exp(-3 * j / n_points))  # logarithmic progress
            force = np.random.normal(15, 3)
            speed = d / t if t > 0 else 0
            c.execute('INSERT INTO measurements VALUES (?,?,?,?,?,?)',
                     (None, event_id, round(t,1), round(d,1), round(force,1), round(speed,2)))

conn.commit()

# Verify
for table in ['stones','paths','events','measurements']:
    count = c.execute(f'SELECT COUNT(*) FROM {table}').fetchone()[0]
    print(f"Table '{table}': {count} records")

print("\\nStone inventory:")
for row in c.execute('SELECT name, mass_kg, rock_type FROM stones ORDER BY mass_kg DESC'):
    print(f"  {row[0]:25s} | {row[1]:>7,.0f} kg | {row[2]}")

print("\\nEvent summary:")
for row in c.execute('''SELECT e.event_date, e.village, s.name, e.n_pullers,
                        CASE WHEN e.success THEN 'Success' ELSE 'FAILED' END
                        FROM events e JOIN stones s ON e.stone_id=s.stone_id ORDER BY e.event_date'''):
    print(f"  {row[0]} | {row[1]:12s} | {row[2]:25s} | {row[3]:>3} people | {row[4]}")

conn.close()`,
      challenge: 'Add a "weather" table and link it to events. Does weather (temperature, humidity, recent rainfall) correlate with success or failure?',
      successHint: 'You have built a knowledge management database that captures engineering experience across multiple events. This is exactly how modern construction companies learn from past projects.',
    },
    {
      title: 'Engineering analytics — what makes a pull succeed or fail?',
      concept: `With a populated database, we can answer critical engineering questions:

1. **What is the relationship between stone mass and required workforce?**
2. **Which techniques provide the best force reduction?**
3. **What surface preparations correlate with success?**
4. **Is there a critical slope angle above which failure becomes likely?**

These are **data-driven engineering decisions** — using historical evidence rather than pure theory to guide practice.

The analytical approach:
1. Query the database for relevant records
2. Calculate derived metrics (force per person, efficiency, etc.)
3. Group and compare across techniques
4. Identify patterns and thresholds

📚 *SQL aggregate functions (AVG, SUM, COUNT, MIN, MAX) combined with GROUP BY enable powerful data analysis directly in the database.*`,
      analogy: 'Engineering analytics is like sports statistics. A cricket team studies batting averages, bowling economy, and field placement data to improve strategy. Similarly, analyzing stone-pulling data reveals which techniques work, which paths are risky, and how many people are needed for a given stone — all based on evidence, not guesswork.',
      storyConnection: 'Each stone-pulling event in Nagaland teaches the community something. Analytics formalize these lessons: the 2023 failure (stone cracked on a steep section) teaches that sandstone should not be taken on paths above a certain slope. The database ensures this lesson is never forgotten.',
      checkQuestion: 'The 2023 event failed because the stone cracked. What data would you query to prevent this from happening again?',
      checkAnswer: 'Query for all events involving sandstone (rock_type="sandstone") on paths with steep sections. Check the tensile strength vs the bending stress for those path profiles. You would find that sandstone (5 MPa tensile strength) cannot handle the bending stress on paths steeper than about 4 degrees with only 3 rollers. The fix: use more rollers on steep sections OR avoid steep paths for weak stones.',
      codeIntro: 'Analyze the stone-pulling database to extract engineering insights.',
      code: `import sqlite3
import numpy as np

conn = sqlite3.connect(':memory:')
c = conn.cursor()

# Rebuild database (abbreviated)
c.executescript('''
    CREATE TABLE stones (stone_id INTEGER PRIMARY KEY, name TEXT, mass_kg REAL, rock_type TEXT, tensile_strength_mpa REAL);
    CREATE TABLE paths (path_id INTEGER PRIMARY KEY, distance_m REAL, elevation_gain_m REAL, surface_type TEXT, avg_slope_deg REAL);
    CREATE TABLE events (event_id INTEGER PRIMARY KEY, stone_id INTEGER, path_id INTEGER, event_date TEXT, village TEXT,
        n_pullers INTEGER, technique TEXT, roller_diameter_cm REAL, lubrication TEXT, duration_hours REAL, success INTEGER);
''')

stones = [(1,'Kohima Memorial',5200,'granite',10),(2,'Village Gate',3800,'sandstone',5),(3,'Feast of Merit',7500,'granite',12),
          (4,'Ancestor Stone',2500,'limestone',4),(5,'Grand Monolith',12000,'granite',10)]
c.executemany('INSERT INTO stones VALUES (?,?,?,?,?)', stones)

paths = [(1,350,20,'packed earth',3.3),(2,200,8,'gravel',2.3),(3,500,45,'mixed',5.1),(4,150,5,'grass',1.9),(5,800,35,'prepared earth',2.5)]
c.executemany('INSERT INTO paths VALUES (?,?,?,?,?)', paths)

events = [
    (1,1,1,'2020-03-15','Kohima',80,'rollers+ramp',15,'water',3.5,1),
    (2,2,2,'2020-11-20','Khonoma',45,'rollers',12,'none',2.0,1),
    (3,3,3,'2021-02-10','Tuensang',150,'rollers+ramp+levers',20,'animal fat',6.5,1),
    (4,4,4,'2021-08-05','Mokokchung',30,'dragging',0,'water',1.5,1),
    (5,1,1,'2022-03-12','Kohima',75,'rollers+ramp',15,'water',4.0,1),
    (6,5,5,'2022-12-01','Zunheboto',200,'full system',22,'palm oil',8.0,1),
    (7,2,3,'2023-06-15','Dimapur',50,'rollers',12,'water',5.0,0),
    (8,3,1,'2023-11-08','Kohima',120,'rollers+ramp',18,'water',5.5,1),
]
c.executemany('INSERT INTO events VALUES (?,?,?,?,?,?,?,?,?,?,?)', events)
conn.commit()

# ANALYSIS 1: Workforce efficiency
print("ANALYSIS 1: Workforce Efficiency (kg moved per person)")
print("=" * 65)
rows = c.execute('''
    SELECT s.name, s.mass_kg, e.n_pullers, e.technique,
           ROUND(s.mass_kg / e.n_pullers, 1) as kg_per_person,
           e.success
    FROM events e JOIN stones s ON e.stone_id = s.stone_id
    WHERE e.success = 1
    ORDER BY kg_per_person DESC
''').fetchall()
print(f"{'Stone':>25} | {'Mass':>7} | {'People':>6} | {'kg/person':>9} | {'Technique'}")
print("-" * 65)
for name, mass, ppl, tech, kpp, _ in rows:
    bar = "█" * int(kpp / 5)
    print(f"  {name:>23} | {mass:>6,.0f} | {ppl:>5} | {kpp:>8.1f} | {tech} {bar}")

# ANALYSIS 2: Technique comparison
print(f"\\nANALYSIS 2: Technique Effectiveness")
print("=" * 65)
rows = c.execute('''
    SELECT e.technique,
           COUNT(*) as events,
           SUM(e.success) as successes,
           ROUND(AVG(s.mass_kg / e.n_pullers), 1) as avg_efficiency,
           ROUND(AVG(p.distance_m / e.duration_hours), 1) as avg_speed_m_per_h
    FROM events e
    JOIN stones s ON e.stone_id = s.stone_id
    JOIN paths p ON e.path_id = p.path_id
    GROUP BY e.technique
    ORDER BY avg_efficiency DESC
''').fetchall()
print(f"{'Technique':>25} | {'Events':>6} | {'Success':>7} | {'kg/person':>9} | {'Speed m/h':>9}")
print("-" * 65)
for tech, events, success, eff, speed in rows:
    rate = success/events*100
    print(f"  {tech:>23} | {events:>5} | {success}/{events} ({rate:.0f}%) | {eff:>8.1f} | {speed:>8.1f}")

# ANALYSIS 3: Failure analysis
print(f"\\nANALYSIS 3: Failure Analysis")
print("=" * 65)
rows = c.execute('''
    SELECT s.name, s.rock_type, s.tensile_strength_mpa,
           p.avg_slope_deg, e.technique, e.roller_diameter_cm
    FROM events e
    JOIN stones s ON e.stone_id = s.stone_id
    JOIN paths p ON e.path_id = p.path_id
    WHERE e.success = 0
''').fetchall()
for name, rock, strength, slope, tech, roller in rows:
    print(f"  FAILED: {name}")
    print(f"    Rock: {rock} (tensile: {strength} MPa)")
    print(f"    Path slope: {slope}° (steep)")
    print(f"    Technique: {tech}, rollers: {roller}cm")
    print(f"    Diagnosis: {rock} (weak, {strength} MPa) on {slope}° slope")
    print(f"    Recommendation: Use granite for slopes > 4° or add more rollers")

# ANALYSIS 4: Lubrication impact
print(f"\\nANALYSIS 4: Lubrication Impact")
print("=" * 65)
rows = c.execute('''
    SELECT e.lubrication,
           COUNT(*) as events,
           ROUND(AVG(p.distance_m / e.duration_hours), 1) as avg_speed,
           ROUND(AVG(s.mass_kg / e.n_pullers), 1) as efficiency
    FROM events e
    JOIN stones s ON e.stone_id = s.stone_id
    JOIN paths p ON e.path_id = p.path_id
    WHERE e.success = 1
    GROUP BY e.lubrication
''').fetchall()
for lub, events, speed, eff in rows:
    print(f"  {lub:>12}: {events} events | speed: {speed} m/h | efficiency: {eff} kg/person")

conn.close()`,
      challenge: 'Write a query that predicts the number of people needed for a new 6,000 kg granite stone on a 300 m path with 25 m elevation gain, based on the historical data.',
      successHint: 'You have performed data-driven engineering analysis. The queries reveal patterns that individual observations miss: technique matters more than brute force, stone material limits path choice, and lubrication is always worth the preparation time.',
    },
    {
      title: 'Pull planner algorithm — automated event planning',
      concept: `A **pull planner** algorithm takes stone properties and path details as input and outputs a complete plan: workforce, technique, equipment, timeline, and risk assessment.

The algorithm:
1. Query historical database for similar past events
2. Calculate required force from physics (friction, slope, mass)
3. Determine optimal technique based on stone/path combination
4. Estimate workforce from force and technique efficiency
5. Project timeline from power output and fatigue models
6. Assess risks (structural failure, slope danger, weather)
7. Generate the complete plan with contingencies

This is a **decision support system** — it does not replace human judgment but provides a rigorous, data-backed starting point.

📚 *Algorithms combine database queries with mathematical models. The output is structured as an actionable plan, not just numbers.*`,
      analogy: 'A pull planner is like a GPS navigation system for stone-pulling. You input the destination (where the stone must go), and the system calculates the best route, estimates travel time, warns about obstacles, and provides turn-by-turn directions. It uses both the map (physics models) and traffic data (historical records) to make its recommendations.',
      storyConnection: 'Imagine the village elders consulting a computer before the next stone-pulling ceremony. The algorithm combines their traditional knowledge (captured in the database) with physics calculations to produce a plan that is more detailed and precise than any individual could create from memory alone.',
      checkQuestion: 'Should the algorithm\'s output be followed exactly, or should it be treated as a starting recommendation?',
      checkAnswer: 'As a starting recommendation. The algorithm cannot account for everything: unusual weather, team morale, ground conditions that differ from the database, or the ceremonial significance of certain routes. Human judgment fills these gaps. The best approach is algorithm-guided, human-decided — like how pilots use autopilot for routine flight but take manual control for unusual situations.',
      codeIntro: 'Build a comprehensive stone-pulling event planner that generates a complete plan.',
      code: `import sqlite3
import numpy as np
import math

conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
    CREATE TABLE planning_rules (
        rule_id INTEGER PRIMARY KEY, category TEXT, condition TEXT,
        recommendation TEXT, priority TEXT
    );
    CREATE TABLE generated_plans (
        plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
        stone_mass REAL, distance REAL, elevation REAL,
        recommended_people INTEGER, technique TEXT,
        estimated_hours REAL, risk_level TEXT, plan_text TEXT
    );
''')

# Engineering rules database
rules = [
    (1,'technique','mass > 8000','Use full system: rollers + ramp + levers + lubrication','REQUIRED'),
    (2,'technique','mass BETWEEN 3000 AND 8000','Use rollers with ramp on slopes > 5°','RECOMMENDED'),
    (3,'technique','mass < 3000','Rollers sufficient for most paths','OPTIONAL'),
    (4,'safety','slope > 6','Avoid sandstone and limestone on steep sections','CRITICAL'),
    (5,'safety','distance > 500','Plan rest stops every 100m; rotate teams','REQUIRED'),
    (6,'prep','lubrication','Always lubricate rollers for stones > 2000 kg','RECOMMENDED'),
    (7,'prep','rollers','Minimum roller diameter: mass/400 cm (e.g., 5000kg → 12.5cm)','REQUIRED'),
    (8,'safety','weather','Cancel if heavy rain expected (slope becomes dangerous)','CRITICAL'),
]
c.executemany('INSERT INTO planning_rules VALUES (?,?,?,?,?)', rules)
conn.commit()

def generate_plan(mass, distance, elevation, rock_type='granite', surface='packed earth'):
    """Generate a complete stone-pulling plan."""
    g = 9.81
    plan = []
    warnings = []

    plan.append("=" * 60)
    plan.append("    STONE-PULLING EVENT PLAN")
    plan.append("=" * 60)
    plan.append(f"\\n  Stone: {mass:,.0f} kg ({rock_type})")
    plan.append(f"  Path: {distance:.0f} m, {elevation:.0f} m elevation gain")
    plan.append(f"  Surface: {surface}")

    # 1. Technique selection
    if mass > 8000:
        technique = 'Full system (rollers + ramp + levers + lubrication)'
        eff_mu = 0.05
        roller_d = mass / 400
    elif mass > 3000:
        technique = 'Rollers with ramp'
        eff_mu = 0.10
        roller_d = mass / 400
    else:
        technique = 'Log rollers'
        eff_mu = 0.12
        roller_d = max(10, mass / 400)

    plan.append(f"\\n[TECHNIQUE]")
    plan.append(f"  Recommended: {technique}")
    plan.append(f"  Roller diameter: {roller_d:.0f} cm minimum")

    # 2. Force calculation
    slope_rad = math.atan2(elevation, distance)
    slope_deg = math.degrees(slope_rad)
    F_pull = mass * g * (math.sin(slope_rad) + eff_mu * math.cos(slope_rad))

    plan.append(f"\\n[FORCE ANALYSIS]")
    plan.append(f"  Average slope: {slope_deg:.1f}°")
    plan.append(f"  Pull force needed: {F_pull/1000:.1f} kN")

    # 3. Workforce
    force_per_person = 350  # N sustained
    n_people_pulling = math.ceil(F_pull / force_per_person)
    n_support = max(10, n_people_pulling // 4)  # roller handlers, guides
    n_total = n_people_pulling + n_support
    n_teams = max(2, n_total // 20)

    plan.append(f"\\n[WORKFORCE]")
    plan.append(f"  Pullers needed: {n_people_pulling}")
    plan.append(f"  Support crew (rollers/guides): {n_support}")
    plan.append(f"  Total: {n_total} people in {n_teams} teams")

    # 4. Time estimate
    power_per_person = 100  # W sustained average
    total_power = n_people_pulling * power_per_person
    total_work = F_pull * distance
    time_seconds = total_work / total_power
    fatigue_factor = 1.5  # add 50% for fatigue and breaks
    time_hours = time_seconds / 3600 * fatigue_factor

    plan.append(f"\\n[TIME ESTIMATE]")
    plan.append(f"  Total work: {total_work/1e6:.2f} MJ")
    plan.append(f"  Estimated duration: {time_hours:.1f} hours (including breaks)")
    if distance > 500:
        n_stops = int(distance / 100)
        plan.append(f"  Rest stops: {n_stops} (every 100m)")

    # 5. Risk assessment
    risks = []
    if slope_deg > 6:
        risks.append(('HIGH', 'Steep slope — risk of uncontrolled acceleration'))
        if rock_type in ['sandstone', 'limestone']:
            risks.append(('CRITICAL', f'{rock_type} may crack on slopes > 5°'))
    if mass > 10000:
        risks.append(('HIGH', 'Extremely heavy — rope failure risk'))
    if time_hours > 6:
        risks.append(('MODERATE', 'Long pull — fatigue management needed'))
    if distance > 400:
        risks.append(('MODERATE', 'Long path — weather change risk'))
    if not risks:
        risks.append(('LOW', 'Standard pull with manageable risks'))

    risk_level = risks[0][0]  # highest risk
    plan.append(f"\\n[RISK ASSESSMENT]")
    for level, desc in risks:
        marker = "!!!" if level == 'CRITICAL' else "! " if level == 'HIGH' else "  "
        plan.append(f"  {marker} [{level:>8}] {desc}")

    # 6. Preparation checklist
    plan.append(f"\\n[PREPARATION CHECKLIST]")
    prep_items = [
        f"[ ] Cut {int(distance/1.5)} logs, diameter ≥ {roller_d:.0f} cm",
        f"[ ] Prepare path surface ({surface})",
        f"[ ] Assemble {n_teams} rope teams of ~{n_people_pulling//n_teams} pullers each",
        f"[ ] Station {n_support} support crew along route",
        f"[ ] Prepare food for {n_total} workers ({time_hours:.0f}+ hours)",
    ]
    if eff_mu < 0.10:
        prep_items.append("[ ] Procure lubrication (water/oil)")
    if slope_deg > 4:
        prep_items.append("[ ] Install guide posts on steep sections")
    if mass > 5000:
        prep_items.append("[ ] Inspect stone for cracks before pull")

    for item in prep_items:
        plan.append(f"  {item}")

    plan.append(f"\\n{'=' * 60}")

    plan_text = "\\n".join(plan)

    # Store plan in database
    c.execute('''INSERT INTO generated_plans
                 (stone_mass, distance, elevation, recommended_people, technique,
                  estimated_hours, risk_level, plan_text)
                 VALUES (?,?,?,?,?,?,?,?)''',
             (mass, distance, elevation, n_total, technique, round(time_hours,1), risk_level, plan_text))
    conn.commit()

    return plan_text, n_total, time_hours, risk_level

# Generate plans for different scenarios
scenarios = [
    (3000, 200, 10, 'granite', 'packed earth'),
    (6000, 400, 25, 'granite', 'prepared earth'),
    (8500, 300, 30, 'sandstone', 'mixed'),
    (15000, 600, 40, 'granite', 'prepared earth'),
]

for mass, dist, elev, rock, surface in scenarios:
    plan_text, people, hours, risk = generate_plan(mass, dist, elev, rock, surface)
    print(plan_text)
    print()

# Summary from database
print("\\nALL GENERATED PLANS SUMMARY:")
print("-" * 70)
rows = c.execute('SELECT stone_mass, distance, elevation, recommended_people, estimated_hours, risk_level FROM generated_plans').fetchall()
for mass, dist, elev, ppl, hrs, risk in rows:
    print(f"  {mass:>7,.0f} kg | {dist:>4.0f}m, +{elev:.0f}m | {ppl:>4} people | {hrs:.1f}h | Risk: {risk}")

conn.close()`,
      challenge: 'Add a cost estimation module: calculate the cost of rollers (timber), food for workers, rope, and preparation time. Generate a complete budget for each plan.',
      successHint: 'You have built an automated planning system that combines physics, historical data, and engineering rules. This is the same approach used in modern construction project management software.',
    },
    {
      title: 'Monte Carlo simulation — handling uncertainty in planning',
      concept: `Real stone-pulling involves many uncertainties:
- Friction coefficient varies along the path
- Not all pullers exert the same force
- Weather changes during the pull
- Rollers have slightly different diameters

**Monte Carlo simulation** handles uncertainty by running thousands of simulations with random variations and analyzing the distribution of outcomes.

For each simulation:
1. Randomly vary friction (normal distribution around expected value)
2. Randomly vary pull force (people have different strengths)
3. Randomly include/exclude weather events
4. Calculate outcome (time, distance, success)

The result: not a single prediction, but a **probability distribution** of outcomes.

📚 *np.random.normal(mean, std, size) generates random values from a Gaussian distribution. Running many simulations with random inputs is the Monte Carlo method.*`,
      analogy: 'Monte Carlo simulation is like rehearsing a play 1,000 times with random audience reactions, actor mistakes, and technical glitches. Most rehearsals go smoothly, but some face problems. By analyzing all 1,000 runs, the director knows: "95% of the time, the show finishes within 2 hours. There is a 5% chance of a delay past 2.5 hours." The stone-pulling planner gains the same kind of probabilistic confidence.',
      storyConnection: 'The village elders know from experience that some pulls go smoothly while others face unexpected problems. Monte Carlo simulation quantifies this wisdom: "With 80 people and rollers, there is a 92% chance of completing the pull in under 4 hours, but a 3% chance of failure due to rain or equipment breakdown."',
      checkQuestion: 'Why is a probability distribution more useful than a single best estimate?',
      checkAnswer: 'A single estimate ("it will take 3.5 hours") gives false confidence. A distribution ("90% chance of finishing between 2.5 and 5 hours, with 5% chance of exceeding 6 hours") enables risk management. The organizers can plan for the likely case (food for 4 hours) while preparing for the worst case (backup plan if it exceeds 6 hours). Decision-making under uncertainty requires distributions, not point estimates.',
      codeIntro: 'Run a Monte Carlo simulation to predict stone-pulling outcomes with uncertainty.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
n_sims = 2000

# Base parameters (with uncertainty)
mass = 5000; g = 9.81; distance = 300; elevation = 18
n_people = 80

# Uncertain parameters
mu_mean = 0.10; mu_std = 0.03          # friction varies
force_per_person_mean = 350; force_std = 80  # people vary
power_per_person_mean = 100; power_std = 25

# Weather: 15% chance of rain (increases friction by 30%)
rain_probability = 0.15
# Equipment: 5% chance of roller failure (30 min delay)
equipment_fail_prob = 0.05

results = {
    'time_hours': [], 'total_work_kj': [], 'success': [],
    'max_force_kn': [], 'rained': [], 'equipment_failed': []
}

slope = np.arctan2(elevation, distance)

for sim in range(n_sims):
    # Sample uncertain parameters
    mu = max(0.02, np.random.normal(mu_mean, mu_std))
    forces = np.random.normal(force_per_person_mean, force_std, n_people)
    forces = np.clip(forces, 100, 600)  # realistic range
    total_pull_force = np.sum(forces)
    powers = np.random.normal(power_per_person_mean, power_std, n_people)
    powers = np.clip(powers, 30, 200)
    total_power = np.sum(powers)

    # Weather event
    rained = np.random.random() < rain_probability
    if rained:
        mu *= 1.3  # wet ground, higher friction

    # Required force
    F_required = mass * g * (np.sin(slope) + mu * np.cos(slope))

    # Can they move it?
    can_move = total_pull_force > F_required
    if not can_move:
        results['time_hours'].append(float('inf'))
        results['total_work_kj'].append(0)
        results['success'].append(False)
        results['max_force_kn'].append(total_pull_force / 1000)
        results['rained'].append(rained)
        results['equipment_failed'].append(False)
        continue

    # Time calculation with fatigue
    total_work = F_required * distance
    base_time = total_work / total_power  # seconds
    fatigue_factor = np.random.uniform(1.3, 1.8)
    time_s = base_time * fatigue_factor

    # Equipment failure delay
    equip_fail = np.random.random() < equipment_fail_prob
    if equip_fail:
        time_s += 1800  # 30 minute delay

    time_h = time_s / 3600

    results['time_hours'].append(time_h)
    results['total_work_kj'].append(total_work / 1000)
    results['success'].append(True)
    results['max_force_kn'].append(F_required / 1000)
    results['rained'].append(rained)
    results['equipment_failed'].append(equip_fail)

# Analysis
times = np.array(results['time_hours'])
success = np.array(results['success'])
successful_times = times[success]

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Time distribution
axes[0,0].hist(successful_times, bins=40, color='#10b981', alpha=0.7, edgecolor='white', linewidth=0.5)
p50 = np.percentile(successful_times, 50)
p90 = np.percentile(successful_times, 90)
p95 = np.percentile(successful_times, 95)
axes[0,0].axvline(x=p50, color='#f59e0b', linestyle='--', linewidth=2, label=f'Median: {p50:.1f}h')
axes[0,0].axvline(x=p90, color='#f87171', linestyle='--', linewidth=2, label=f'90th %ile: {p90:.1f}h')
axes[0,0].set_xlabel('Completion Time (hours)', color='white', fontsize=10)
axes[0,0].set_ylabel('Count', color='white', fontsize=10)
axes[0,0].set_title('Time Distribution', color='white', fontsize=12, fontweight='bold')
axes[0,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

# Force distribution
forces_kn = np.array(results['max_force_kn'])
axes[0,1].hist(forces_kn, bins=40, color='#60a5fa', alpha=0.7, edgecolor='white', linewidth=0.5)
axes[0,1].set_xlabel('Required Force (kN)', color='white', fontsize=10)
axes[0,1].set_ylabel('Count', color='white', fontsize=10)
axes[0,1].set_title('Force Requirement Distribution', color='white', fontsize=12, fontweight='bold')

# Success by condition
categories = ['Overall', 'Dry weather', 'Rain', 'No equip fail', 'Equip failure']
rained = np.array(results['rained'])
equip = np.array(results['equipment_failed'])
rates = [
    success.mean() * 100,
    success[~rained].mean() * 100,
    success[rained].mean() * 100 if rained.any() else 0,
    success[~equip].mean() * 100,
    success[equip].mean() * 100 if equip.any() else 0,
]
bar_colors = ['#10b981', '#60a5fa', '#f87171', '#60a5fa', '#f87171']
axes[1,0].bar(categories, rates, color=bar_colors, edgecolor='white', linewidth=0.5)
axes[1,0].set_ylabel('Success Rate (%)', color='white', fontsize=10)
axes[1,0].set_title('Success by Condition', color='white', fontsize=12, fontweight='bold')
axes[1,0].tick_params(axis='x', rotation=20)
axes[1,0].set_ylim(0, 105)

# Cumulative probability
sorted_times = np.sort(successful_times)
cumulative = np.arange(1, len(sorted_times)+1) / len(sorted_times) * 100
axes[1,1].plot(sorted_times, cumulative, color='#a78bfa', linewidth=2.5)
axes[1,1].axhline(y=50, color='white', linestyle=':', alpha=0.3)
axes[1,1].axhline(y=90, color='white', linestyle=':', alpha=0.3)
axes[1,1].set_xlabel('Time (hours)', color='white', fontsize=10)
axes[1,1].set_ylabel('Cumulative Probability (%)', color='white', fontsize=10)
axes[1,1].set_title('Cumulative Time Distribution', color='white', fontsize=12, fontweight='bold')

plt.suptitle(f'Monte Carlo: {n_sims} Simulations of Stone Pull', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print(f"Monte Carlo Results ({n_sims} simulations):")
print(f"  Success rate: {success.mean()*100:.1f}%")
print(f"  Time: median {p50:.1f}h | 90th %ile {p90:.1f}h | 95th %ile {p95:.1f}h")
print(f"  Rain events: {rained.sum()} ({rained.mean()*100:.0f}%)")
print(f"  Equipment failures: {equip.sum()} ({equip.mean()*100:.0f}%)")
print(f"\\nPlanning recommendation:")
print(f"  Plan for {p90:.1f} hours (covers 90% of scenarios)")
print(f"  Prepare {int(n_people * 1.2)} people (20% buffer for fatigue/absence)")`,
      challenge: 'Add a "team coordination" uncertainty: if teams are poorly synchronized (random 0-50% force reduction at any moment), how does this affect completion time? What is the minimum coordination quality needed for 95% success rate?',
      successHint: 'You have built a probabilistic planning tool that quantifies uncertainty. This is how modern engineering projects manage risk — not by hoping for the best, but by simulating thousands of scenarios and planning for the realistic range.',
    },
    {
      title: 'Capstone — complete stone-pulling engineering toolkit',
      concept: `The **capstone** combines everything into a comprehensive engineering toolkit:

1. **Database**: stores stones, paths, events, and measurements
2. **Physics engine**: calculates forces, work, power, and stresses
3. **Planner**: generates complete event plans from inputs
4. **Simulator**: runs Monte Carlo analysis for uncertainty
5. **Dashboard**: visualizes all results

This mirrors real engineering software suites (like ANSYS, AutoCAD, or SAP2000) that integrate data management, physics simulation, planning tools, and visualization.

📚 *A capstone project demonstrates the ability to integrate multiple complex systems into a coherent whole — the defining skill of a professional engineer.*`,
      analogy: 'This capstone is like building a complete workshop with every tool organized and accessible. A single wrench (one calculation) is useful. A full workshop (integrated toolkit) lets you tackle any stone-pulling problem from initial design to risk analysis to post-event review.',
      storyConnection: 'The complete toolkit preserves and extends the engineering knowledge of Nagaland\'s stone-pulling tradition. It connects ancient practice to modern engineering science, showing that the fundamental principles — force, energy, optimization, risk management — are the same whether discovered empirically over centuries or calculated by computer.',
      checkQuestion: 'What is the value of integrating all these tools into one system rather than using separate scripts?',
      checkAnswer: 'Integration ensures consistency: the same stone properties in the database feed into the physics engine, which feeds the planner, which feeds the simulator. Separate scripts might use different assumptions for the same stone, leading to contradictory results. Integration also enables feedback: Monte Carlo results can update the planning rules, and event outcomes can improve the physics models. This virtuous cycle of data-model-decision-feedback is the foundation of engineering practice.',
      codeIntro: 'Build the complete stone-pulling engineering dashboard.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt
import math

# ===== INTEGRATED ENGINEERING TOOLKIT =====
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
    CREATE TABLE stones (id INTEGER PRIMARY KEY, name TEXT, mass REAL, rock TEXT, strength REAL);
    CREATE TABLE analysis_results (id INTEGER PRIMARY KEY AUTOINCREMENT, stone_id INTEGER,
        scenario TEXT, force_kn REAL, people INTEGER, time_h REAL, efficiency REAL,
        risk TEXT, success_prob REAL);
''')

stones = [(1,'Village Marker',4000,'granite',10),(2,'Memorial Stone',7000,'granite',12),(3,'Sacred Monolith',11000,'granite',10)]
c.executemany('INSERT INTO stones VALUES (?,?,?,?,?)', stones)
conn.commit()

class PhysicsEngine:
    def __init__(self, mass, distance, elevation, mu=0.10):
        self.mass = mass; self.g = 9.81; self.distance = distance
        self.elevation = elevation; self.mu = mu
        self.slope = math.atan2(elevation, distance)

    def pull_force(self):
        return self.mass * self.g * (math.sin(self.slope) + self.mu * math.cos(self.slope))

    def total_work(self):
        return self.pull_force() * self.distance

    def time_estimate(self, n_people, power_per=100):
        return self.total_work() / (n_people * power_per) / 3600 * 1.5

    def efficiency(self):
        W_useful = self.mass * self.g * self.elevation
        return W_useful / self.total_work() * 100 if self.total_work() > 0 else 0

    def min_people(self, force_per=350):
        return math.ceil(self.pull_force() / force_per)

def monte_carlo(physics, n_people, n_sims=500):
    np.random.seed(42)
    successes = 0; times = []
    for _ in range(n_sims):
        mu_actual = max(0.02, np.random.normal(physics.mu, 0.03))
        F_req = physics.mass * physics.g * (math.sin(physics.slope) + mu_actual * math.cos(physics.slope))
        F_avail = sum(np.clip(np.random.normal(350, 80, n_people), 100, 600))
        if F_avail > F_req:
            successes += 1
            work = F_req * physics.distance
            power = sum(np.clip(np.random.normal(100, 25, n_people), 30, 200))
            t = work / power / 3600 * np.random.uniform(1.3, 1.8)
            times.append(t)
    return successes / n_sims, np.array(times) if times else np.array([0])

# ===== RUN ANALYSIS FOR ALL STONES =====
scenarios = [
    ('Short flat path', 200, 8, 0.10),
    ('Medium slope', 350, 20, 0.10),
    ('Long steep route', 500, 40, 0.12),
]

print("╔══════════════════════════════════════════════════════════════╗")
print("║        STONE-PULLING ENGINEERING TOOLKIT — DASHBOARD        ║")
print("╚══════════════════════════════════════════════════════════════╝")

all_data = []

for stone_id, stone_name, mass, rock, strength in stones:
    print(f"\\n━━━ {stone_name} ({mass:,.0f} kg, {rock}) ━━━")
    for scenario_name, dist, elev, mu in scenarios:
        phys = PhysicsEngine(mass, dist, elev, mu)
        n_min = phys.min_people()
        n_rec = int(n_min * 1.3)  # 30% buffer
        time_h = phys.time_estimate(n_rec)
        eff = phys.efficiency()

        # Monte Carlo
        prob, mc_times = monte_carlo(phys, n_rec)
        risk = "LOW" if prob > 0.95 else "MODERATE" if prob > 0.85 else "HIGH"

        # Store results
        c.execute('''INSERT INTO analysis_results (stone_id, scenario, force_kn, people,
                     time_h, efficiency, risk, success_prob) VALUES (?,?,?,?,?,?,?,?)''',
                 (stone_id, scenario_name, round(phys.pull_force()/1000, 1), n_rec,
                  round(time_h, 1), round(eff, 1), risk, round(prob*100, 1)))

        p90_time = np.percentile(mc_times, 90) if len(mc_times) > 1 else time_h
        all_data.append((stone_name, scenario_name, mass, phys.pull_force()/1000,
                        n_rec, time_h, p90_time, eff, prob*100, risk))

        marker = "  " if risk == "LOW" else "! " if risk == "MODERATE" else "!!"
        print(f"  {marker}{scenario_name:20s} | F={phys.pull_force()/1000:>5.1f}kN | {n_rec:>3}ppl | "
              f"{time_h:.1f}h (90%:{p90_time:.1f}h) | eff:{eff:.0f}% | {risk} ({prob*100:.0f}%)")

conn.commit()

# ===== DASHBOARD VISUALIZATION =====
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white', labelsize=8)
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

stone_colors = ['#10b981', '#f59e0b', '#f87171']
stone_names_short = ['Village', 'Memorial', 'Monolith']

# 1. Force requirements
for i, stone_name in enumerate(stone_names_short):
    forces = [d[3] for d in all_data if stone_name in d[0]]
    scenario_names = [d[1].split()[0] for d in all_data if stone_name in d[0]]
    x = np.arange(len(forces)) + i * 0.25
    axes[0,0].bar(x, forces, width=0.2, color=stone_colors[i], label=stone_name)
axes[0,0].set_xticks(np.arange(3) + 0.25)
axes[0,0].set_xticklabels(['Short', 'Medium', 'Long'])
axes[0,0].set_ylabel('Force (kN)', color='white', fontsize=10)
axes[0,0].set_title('Required Force', color='white', fontsize=11, fontweight='bold')
axes[0,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# 2. People needed
for i, stone_name in enumerate(stone_names_short):
    people = [d[4] for d in all_data if stone_name in d[0]]
    x = np.arange(len(people)) + i * 0.25
    axes[0,1].bar(x, people, width=0.2, color=stone_colors[i], label=stone_name)
axes[0,1].set_xticks(np.arange(3) + 0.25)
axes[0,1].set_xticklabels(['Short', 'Medium', 'Long'])
axes[0,1].set_ylabel('People', color='white', fontsize=10)
axes[0,1].set_title('Workforce Required', color='white', fontsize=11, fontweight='bold')

# 3. Time (estimate vs 90th percentile)
times_est = [d[5] for d in all_data]
times_90 = [d[6] for d in all_data]
x = np.arange(len(times_est))
axes[0,2].bar(x - 0.15, times_est, width=0.3, color='#60a5fa', label='Expected', alpha=0.8)
axes[0,2].bar(x + 0.15, times_90, width=0.3, color='#f87171', label='90th %ile', alpha=0.8)
axes[0,2].set_xticks(x)
axes[0,2].set_xticklabels([f'{d[0][:3]}\\n{d[1][:3]}' for d in all_data], fontsize=6)
axes[0,2].set_ylabel('Hours', color='white', fontsize=10)
axes[0,2].set_title('Time Estimates', color='white', fontsize=11, fontweight='bold')
axes[0,2].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# 4. Efficiency
effs = [d[7] for d in all_data]
eff_colors = ['#10b981' if e > 60 else '#f59e0b' if e > 40 else '#f87171' for e in effs]
axes[1,0].bar(x, effs, color=eff_colors, edgecolor='white', linewidth=0.5)
axes[1,0].set_ylabel('Efficiency (%)', color='white', fontsize=10)
axes[1,0].set_title('Energy Efficiency', color='white', fontsize=11, fontweight='bold')

# 5. Success probability
probs = [d[8] for d in all_data]
prob_colors = ['#10b981' if p > 95 else '#f59e0b' if p > 85 else '#f87171' for p in probs]
axes[1,1].bar(x, probs, color=prob_colors, edgecolor='white', linewidth=0.5)
axes[1,1].axhline(y=95, color='white', linestyle=':', alpha=0.3)
axes[1,1].set_ylabel('Success %', color='white', fontsize=10)
axes[1,1].set_title('Success Probability', color='white', fontsize=11, fontweight='bold')
axes[1,1].set_ylim(70, 102)

# 6. Risk matrix (force vs mass)
masses = [d[2] for d in all_data]
forces_plot = [d[3] for d in all_data]
risk_colors = {'LOW': '#10b981', 'MODERATE': '#f59e0b', 'HIGH': '#f87171'}
for d in all_data:
    axes[1,2].scatter(d[2]/1000, d[3], c=risk_colors[d[9]], s=100, edgecolors='white', linewidths=1)
axes[1,2].set_xlabel('Mass (tonnes)', color='white', fontsize=10)
axes[1,2].set_ylabel('Force (kN)', color='white', fontsize=10)
axes[1,2].set_title('Risk Matrix', color='white', fontsize=11, fontweight='bold')
# Legend
for risk, color in risk_colors.items():
    axes[1,2].scatter([], [], c=color, s=60, label=risk)
axes[1,2].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

plt.suptitle('Stone-Pulling Engineering Dashboard', color='white', fontsize=15, fontweight='bold', y=1.01)
plt.tight_layout()
plt.show()

# Final summary from database
print("\\n" + "=" * 60)
print("DATABASE SUMMARY")
rows = c.execute('''SELECT s.name, COUNT(*), ROUND(AVG(a.success_prob),1),
                    MIN(a.risk), MAX(a.risk)
                    FROM analysis_results a JOIN stones s ON a.stone_id=s.id
                    GROUP BY s.name''').fetchall()
for name, n, avg_prob, min_risk, max_risk in rows:
    print(f"  {name}: {n} scenarios analyzed | Avg success: {avg_prob}% | Risk range: {min_risk}-{max_risk}")

conn.close()
print("\\n  Toolkit complete. All analyses stored in database.")`,
      challenge: 'Extend the toolkit to generate a printable PDF-style report (as formatted text output) summarizing all results with recommendations for the village council.',
      successHint: 'You have built a complete engineering software system from scratch: database, physics engine, planner, Monte Carlo simulator, and visualization dashboard. This is professional-grade engineering practice applied to an ancient tradition.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Engineering Decision Systems</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with sqlite3, numpy, and matplotlib. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
