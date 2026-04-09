import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function OrchidsPhawngpuiLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Orchid biodiversity database',
      concept: `A biodiversity database for orchid conservation stores species records, habitat data, pollinator observations, and threat assessments.

Schema design:
- **species**: taxonomy, morphology, conservation status
- **populations**: locations, sizes, habitat descriptions
- **observations**: field sightings with GPS, date, observer
- **pollinators**: documented pollinator species and interactions
- **threats**: identified threats per population (deforestation, poaching, climate)

This is a **conservation informatics** system — the digital backbone of species protection programs.

📚 *SQL's GROUP BY with HAVING filters aggregated results. We use this to find species with critically low population counts or observation gaps.*`,
      analogy: 'A biodiversity database is like a hospital\'s patient records for endangered species. Each species is a patient with medical history (population trend), vital signs (current population), risk factors (threats), and treatment plan (conservation actions). Without the database, doctors (conservationists) are flying blind.',
      storyConnection: 'Mizoram\'s Forest Department and botanical researchers need a systematic database of Phawngpui orchids. Currently, much knowledge exists only in field notebooks and researchers\' memories. A proper database makes this knowledge searchable, shareable, and actionable for conservation.',
      checkQuestion: 'Why do we need GPS coordinates for each orchid observation?',
      checkAnswer: 'GPS enables spatial analysis: mapping species distributions, identifying hot spots, detecting range contractions, and planning protected areas. Without precise locations, you cannot measure range size (a key vulnerability factor) or detect population shifts due to climate change. Approximate locations ("near the summit") are nearly useless for quantitative conservation.',
      codeIntro: 'Build a comprehensive orchid biodiversity database for Phawngpui.',
      code: `import sqlite3
import random

random.seed(42)
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE species (
    id INTEGER PRIMARY KEY, genus TEXT, species TEXT,
    common_name TEXT, family TEXT DEFAULT 'Orchidaceae',
    iucn_status TEXT, endemic INTEGER DEFAULT 0,
    pollinator_type TEXT, spur_length_mm REAL
);
CREATE TABLE populations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    species_id INTEGER REFERENCES species(id),
    lat REAL, lon REAL, elevation_m INTEGER,
    habitat TEXT, est_individuals INTEGER,
    last_surveyed TEXT
);
CREATE TABLE observations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    population_id INTEGER REFERENCES populations(id),
    date TEXT, observer TEXT, count INTEGER,
    flowering INTEGER DEFAULT 0, notes TEXT
);
CREATE TABLE threats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    population_id INTEGER REFERENCES populations(id),
    threat_type TEXT, severity TEXT, year INTEGER
);
''')

# Populate species
species_data = [
    (1, 'Dendrobium', 'chrysanthum', 'Golden Dendrobium', 'VU', 0, 'bee', 8),
    (2, 'Vanda', 'coerulea', 'Blue Vanda', 'EN', 0, 'bee', 12),
    (3, 'Paphiopedilum', 'villosum', 'Slipper Orchid', 'EN', 0, 'hover_fly', 0),
    (4, 'Coelogyne', 'cristata', 'Angel Orchid', 'LC', 0, 'bee', 5),
    (5, 'Aerides', 'odorata', 'Cat Tail Orchid', 'VU', 0, 'moth', 25),
    (6, 'Bulbophyllum', 'phawngpuiense', 'Phawngpui Bulb', 'CR', 1, 'fly', 3),
    (7, 'Cymbidium', 'tigrinum', 'Tiger Orchid', 'EN', 0, 'bee', 7),
    (8, 'Eria', 'mizoramensis', 'Mizoram Eria', 'CR', 1, 'beetle', 2),
]
c.executemany('INSERT INTO species VALUES (?,?,?,?,?,?,?,?,?)',
              [(s[0],s[1],s[2],s[3],'Orchidaceae',s[4],s[5],s[6],s[7]) for s in species_data])

# Generate populations and observations
for sp in species_data:
    sid = sp[0]
    n_pops = random.randint(1, 5) if sp[4] != 'CR' else random.randint(1, 2)
    for _ in range(n_pops):
        lat = 22.6 + random.uniform(-0.1, 0.1)
        lon = 93.0 + random.uniform(-0.1, 0.1)
        elev = random.randint(1200, 2100)
        hab = random.choice(['epiphytic_tree', 'lithophyte', 'terrestrial', 'stream_bank'])
        n_ind = random.randint(10, 5000) if sp[4] == 'LC' else random.randint(5, 200)

        c.execute('INSERT INTO populations (species_id, lat, lon, elevation_m, habitat, est_individuals, last_surveyed) VALUES (?,?,?,?,?,?,?)',
                  (sid, round(lat,4), round(lon,4), elev, hab, n_ind, f'2025-0{random.randint(1,9):d}-15'))

        pid = c.lastrowid
        # Add observations
        for year in range(2020, 2026):
            count = max(1, n_ind + random.randint(-n_ind//3, n_ind//5))
            flowering = 1 if random.random() < 0.3 else 0
            c.execute('INSERT INTO observations (population_id, date, observer, count, flowering) VALUES (?,?,?,?,?)',
                      (pid, f'{year}-04-{random.randint(1,28):02d}', random.choice(['Dr. Lalthansanga','R. Vanlalruati','K. Zothantluanga']), count, flowering))

        # Add threats
        for threat in random.sample(['deforestation','poaching','climate_shift','invasive_species','road_construction'], random.randint(1,3)):
            severity = random.choice(['low','medium','high','critical'])
            c.execute('INSERT INTO threats (population_id, threat_type, severity, year) VALUES (?,?,?,?)',
                      (pid, threat, severity, random.randint(2020,2025)))

conn.commit()

# Analysis queries
print("PHAWNGPUI ORCHID BIODIVERSITY DATABASE")
print("=" * 65)

print(f"\\nTotal: {c.execute('SELECT COUNT(*) FROM species').fetchone()[0]} species, "
      f"{c.execute('SELECT COUNT(*) FROM populations').fetchone()[0]} populations, "
      f"{c.execute('SELECT COUNT(*) FROM observations').fetchone()[0]} observations")

print("\\nSpecies summary:")
print(f"{'Species':<30} {'Status':>6} {'Pops':>5} {'Total N':>8} {'Threats':>8}")
print("-" * 60)
for row in c.execute('''
    SELECT s.genus || ' ' || s.species, s.iucn_status,
        COUNT(DISTINCT p.id), SUM(p.est_individuals),
        (SELECT COUNT(*) FROM threats t WHERE t.population_id IN
            (SELECT id FROM populations WHERE species_id = s.id))
    FROM species s LEFT JOIN populations p ON s.id = p.species_id
    GROUP BY s.id ORDER BY 4
'''):
    print(f"{row[0]:<30} {row[1]:>6} {row[2]:>5} {row[3]:>8} {row[4]:>8}")

print("\\nCritically endangered endemic species:")
for row in c.execute('''
    SELECT s.common_name, p.elevation_m, p.est_individuals, p.habitat
    FROM species s JOIN populations p ON s.id = p.species_id
    WHERE s.iucn_status = 'CR' AND s.endemic = 1
'''):
    print(f"  {row[0]}: {row[2]} individuals at {row[1]}m ({row[3]})")

print("\\nTop threats across all populations:")
for row in c.execute('''
    SELECT threat_type, COUNT(*) as n, SUM(CASE WHEN severity IN ('high','critical') THEN 1 ELSE 0 END) as severe
    FROM threats GROUP BY threat_type ORDER BY n DESC
'''):
    print(f"  {row[0]:<20}: {row[1]} occurrences ({row[2]} severe)")

conn.close()`,
      challenge: 'Add a "population trend" query that compares the earliest and latest observation counts for each population. Flag populations where counts have declined by more than 30%. These need immediate conservation attention.',
      successHint: 'You built a conservation biodiversity database with proper schema design, realistic data, and analytical queries. This is exactly how real conservation organizations like IUCN and botanical gardens manage species data — the foundation of evidence-based conservation.',
    },
    {
      title: 'Conservation prioritization algorithm',
      concept: `Given limited conservation funding, which species and populations should we protect first? This is a **conservation prioritization** problem:

**Objective**: maximize total biodiversity saved per dollar spent
**Factors**: species uniqueness, vulnerability, cost of protection, probability of success

The **EDGE score** (Evolutionary Distinctiveness + Global Endangerment) ranks species by:
\`EDGE = ln(ED) + GE × ln(2)\`

Where ED measures how evolutionarily unique the species is (no close relatives = high ED) and GE is the threat level.

We implement a greedy algorithm: repeatedly select the species-action pair with the highest conservation value per dollar until the budget runs out.

📚 *The optimization combines database queries (to find candidates) with algorithmic selection (greedy ranking). This is the computational backbone of systematic conservation planning.*`,
      analogy: 'Conservation prioritization is like a hospital triage system during a mass casualty event. You cannot save everyone with limited resources, so you prioritize: most urgent cases that can actually be helped. Species that are critically endangered AND can feasibly be saved get resources first. Species that are common (do not need help) or already doomed (cannot be helped) are deprioritized.',
      storyConnection: 'The Mizoram Forest Department has a limited budget for orchid conservation on Phawngpui. Should they protect the two critically endangered endemics (small populations, uncertain outcomes) or the larger populations of vulnerable species (more individuals saved per dollar)? The prioritization algorithm provides a systematic answer.',
      checkQuestion: 'Why is "probability of success" important in conservation prioritization?',
      checkAnswer: 'A species that is critically endangered but has no known conservation intervention (e.g., its habitat cannot be protected, its threats cannot be mitigated) scores lower than a less-endangered species with a clear, feasible recovery plan. Spending money on hopeless cases wastes resources that could save other species. Triage is emotionally difficult but mathematically necessary.',
      codeIntro: 'Build a conservation prioritization system for Phawngpui orchids.',
      code: `import sqlite3

conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE species (
    id INTEGER PRIMARY KEY, name TEXT, iucn TEXT,
    endemic INTEGER, population INTEGER,
    uniqueness REAL, recovery_prob REAL
);
CREATE TABLE actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    species_id INTEGER, action TEXT,
    cost_inr REAL, effectiveness REAL, duration_years INTEGER
);
CREATE TABLE portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    species_id INTEGER, action_id INTEGER,
    priority_score REAL, cost REAL, expected_benefit REAL
);
''')

# Species data
species = [
    (1, 'Bulbophyllum phawngpuiense', 'CR', 1, 150, 0.95, 0.4),
    (2, 'Eria mizoramensis', 'CR', 1, 80, 0.90, 0.3),
    (3, 'Vanda coerulea', 'EN', 0, 2000, 0.60, 0.7),
    (4, 'Paphiopedilum villosum', 'EN', 0, 500, 0.75, 0.6),
    (5, 'Dendrobium chrysanthum', 'VU', 0, 8000, 0.40, 0.8),
    (6, 'Aerides odorata', 'VU', 0, 5000, 0.50, 0.75),
    (7, 'Cymbidium tigrinum', 'EN', 0, 1200, 0.65, 0.65),
    (8, 'Coelogyne cristata', 'LC', 0, 30000, 0.20, 0.9),
]
c.executemany('INSERT INTO species VALUES (?,?,?,?,?,?,?)', species)

# Conservation actions
actions_data = [
    ('Habitat protection', 500000, 0.8, 10),
    ('Ex-situ cultivation', 200000, 0.6, 5),
    ('Anti-poaching patrol', 150000, 0.5, 3),
    ('Pollinator habitat', 300000, 0.7, 10),
    ('Seed banking', 100000, 0.4, 20),
    ('Community education', 80000, 0.3, 5),
]

for sp in species:
    for action, cost, eff, dur in actions_data:
        # Adjust cost by species difficulty
        adj_cost = cost * (1 + (1 - sp[6]) * 0.5)  # harder to recover = more expensive
        c.execute('INSERT INTO actions (species_id, action, cost_inr, effectiveness, duration_years) VALUES (?,?,?,?,?)',
                  (sp[0], action, round(adj_cost), round(eff * sp[6], 2), dur))

# EDGE-like scoring
iucn_weight = {'CR': 4, 'EN': 3, 'VU': 2, 'LC': 1}

BUDGET = 2000000  # 20 lakh INR

# Calculate priority scores
for sp in species:
    ge = iucn_weight[sp[2]]
    ed = sp[5]  # evolutionary distinctiveness
    endemic_bonus = 1.5 if sp[3] else 1.0
    base_score = (ge * 0.4 + ed * 10 * 0.3 + (1 - sp[4]/30000) * 0.3) * endemic_bonus

    for row in c.execute('SELECT id, cost_inr, effectiveness FROM actions WHERE species_id=?', (sp[0],)):
        aid, cost, eff = row
        benefit = base_score * eff
        value_ratio = benefit / (cost / 100000)  # benefit per lakh
        c.execute('INSERT INTO portfolio (species_id, action_id, priority_score, cost, expected_benefit) VALUES (?,?,?,?,?)',
                  (sp[0], aid, round(value_ratio, 3), cost, round(benefit, 3)))

conn.commit()

# Greedy selection
print("CONSERVATION PRIORITIZATION — PHAWNGPUI ORCHIDS")
print(f"Budget: {BUDGET:,} INR")
print("=" * 75)

budget_left = BUDGET
selected = []
used_species = set()

for row in c.execute('''
    SELECT p.id, s.name, a.action, p.priority_score, p.cost, p.expected_benefit,
           s.iucn, s.endemic
    FROM portfolio p
    JOIN species s ON p.species_id = s.id
    JOIN actions a ON p.action_id = a.id
    ORDER BY p.priority_score DESC
'''):
    pid, name, action, score, cost, benefit, iucn, endemic = row
    if cost <= budget_left and (name, action) not in used_species:
        selected.append(row)
        budget_left -= cost
        used_species.add((name, action))

print(f"\\n{'Species':<30} {'Action':<22} {'Cost':>10} {'Benefit':>8} {'Score':>6}")
print("-" * 80)
total_benefit = 0
for row in selected[:10]:
    _, name, action, score, cost, benefit, iucn, endemic = row
    tag = f"[{iucn}]{'*' if endemic else ''}"
    print(f"{name[:25]:<25} {tag:<5} {action:<22} {cost:>10,} {benefit:>8.2f} {score:>6.2f}")
    total_benefit += benefit

print(f"\\nBudget used: {BUDGET - budget_left:,} / {BUDGET:,} INR")
print(f"Total expected benefit: {total_benefit:.2f}")
print(f"Actions funded: {len(selected[:10])}")
print(f"Species covered: {len(set(r[1] for r in selected[:10]))}")

# Compare: what if we just protect the most endangered?
print("\\nComparison: CR-only strategy vs optimized:")
cr_cost = sum(r[4] for r in selected[:10] if r[6] == 'CR')
cr_benefit = sum(r[5] for r in selected[:10] if r[6] == 'CR')
print(f"  CR species: cost={cr_cost:,}, benefit={cr_benefit:.2f}")
print(f"  Optimized:  cost={BUDGET-budget_left:,}, benefit={total_benefit:.2f}")

conn.close()`,
      challenge: 'Add a "complementarity" constraint: prefer actions that cover different species rather than multiple actions on the same species. Does this change the priority ranking? This is the difference between species-level and portfolio-level optimization.',
      successHint: 'You built a conservation prioritization system — the same approach used by organizations like WWF, IUCN, and the Alliance for Zero Extinction to allocate limited conservation funding globally. Systematic prioritization saves more biodiversity per dollar than ad-hoc decision-making.',
    },
    {
      title: 'Pollination network resilience simulator',
      concept: `How resilient is Phawngpui\'s orchid-pollinator network to species loss? We test this by simulating **sequential extinctions**:

1. Remove the most-connected pollinator
2. Check which orchids lose ALL pollinators (secondary extinction)
3. Remove the next most-connected pollinator
4. Repeat until the network collapses

Compare with:
- **Random removal**: remove pollinators randomly
- **Specialist-first removal**: remove the rarest pollinators first

The **extinction curve** plots fraction of orchids surviving vs. fraction of pollinators removed. The area under this curve measures **network robustness**.

📚 *We implement the simulation as a database-backed system: store the network, simulate removals, and query for cascading effects.*`,
      analogy: 'Network resilience testing is like stress-testing a bridge. You do not wait for the bridge to fail — you simulate removing cables one by one to find the weakest link. For pollination networks, each pollinator is a cable. Removing random cables has a different effect than removing the most load-bearing cables — targeted attacks are far more damaging than random failures.',
      storyConnection: 'Phawngpui faces multiple threats to pollinators: pesticide use, habitat loss, climate change. Understanding which pollinators are keystone species — whose loss would cascade through the network — is critical for protecting the entire orchid community. The resilience simulator identifies these keystone species before they are lost.',
      checkQuestion: 'Why is targeted removal (most-connected first) more damaging than random removal?',
      checkAnswer: 'The most-connected pollinators are the network\'s "hubs" — they pollinate many orchid species. Removing a hub disconnects many orchids simultaneously. Random removal typically hits less-connected species first (there are more of them), causing fewer cascading effects. This is analogous to the internet: removing a major server (hub) is catastrophic; removing a random home computer is barely noticed.',
      codeIntro: 'Simulate pollinator extinction scenarios and measure network resilience.',
      code: `import sqlite3
import numpy as np

np.random.seed(42)
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE network (
    orchid TEXT, pollinator TEXT, strength REAL
);
CREATE TABLE simulations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    strategy TEXT, pollinators_removed INTEGER,
    orchids_surviving INTEGER, orchid_fraction REAL
);
''')

# Build network
orchids = ['Dendrobium', 'Vanda', 'Aerides', 'Bulbophyllum', 'Coelogyne',
           'Paphiopedilum', 'Cymbidium', 'Eria', 'Calanthe', 'Phalaenopsis']
pollinators = ['Honeybee', 'Carpenter_bee', 'Hawk_moth', 'Sphinx_moth',
               'Swallowtail', 'Hover_fly', 'Beetle_sp1', 'Beetle_sp2',
               'Wasp', 'Ant', 'Fruit_bat', 'Sunbird']

# Generate nested interaction matrix
for i, orchid in enumerate(orchids):
    n_partners = max(1, 12 - i)
    partners = np.random.choice(pollinators, min(n_partners, 12), replace=False)
    for poll in partners:
        strength = np.random.uniform(0.2, 1.0)
        c.execute('INSERT INTO network VALUES (?,?,?)', (orchid, poll, round(strength, 2)))

conn.commit()

n_orchids = len(orchids)
n_pollinators = len(pollinators)

def count_surviving(conn, removed_pollinators):
    """Count orchids that still have at least one pollinator."""
    placeholders = ','.join('?' * len(removed_pollinators)) if removed_pollinators else "''"
    if removed_pollinators:
        query = f'''SELECT COUNT(DISTINCT orchid) FROM network
                    WHERE pollinator NOT IN ({placeholders})'''
        return conn.execute(query, removed_pollinators).fetchone()[0]
    return conn.execute('SELECT COUNT(DISTINCT orchid) FROM network').fetchone()[0]

# Simulate three removal strategies
strategies = {
    'Most-connected first': sorted(pollinators,
        key=lambda p: c.execute('SELECT COUNT(*) FROM network WHERE pollinator=?', (p,)).fetchone()[0],
        reverse=True),
    'Random removal': list(np.random.permutation(pollinators)),
    'Specialist first': sorted(pollinators,
        key=lambda p: c.execute('SELECT COUNT(*) FROM network WHERE pollinator=?', (p,)).fetchone()[0]),
}

print("POLLINATION NETWORK RESILIENCE ANALYSIS")
print("=" * 60)

# Initial network stats
print(f"Network: {n_orchids} orchids, {n_pollinators} pollinators")
print(f"Total interactions: {c.execute('SELECT COUNT(*) FROM network').fetchone()[0]}")
print()

results = {}
for strategy_name, removal_order in strategies.items():
    removed = []
    curve = [(0, n_orchids)]

    for poll in removal_order:
        removed.append(poll)
        surviving = count_surviving(conn, removed)
        curve.append((len(removed), surviving))

        c.execute('INSERT INTO simulations (strategy, pollinators_removed, orchids_surviving, orchid_fraction) VALUES (?,?,?,?)',
                  (strategy_name, len(removed), surviving, round(surviving / n_orchids, 3)))

    results[strategy_name] = curve

    # Robustness (area under curve)
    robustness = sum(s / n_orchids for _, s in curve) / len(curve)
    print(f"{strategy_name}:")
    print(f"  Robustness: {robustness:.3f}")
    collapse_at = next((n for n, s in curve if s <= n_orchids * 0.5), n_pollinators)
    print(f"  50% orchid loss at: {collapse_at} pollinator removals ({collapse_at/n_pollinators:.0%})")

conn.commit()

# Print extinction cascade
print("\\nExtinction cascade (most-connected first):")
print(f"{'Removed':>8} {'Pollinator':<20} {'Orchids left':>12} {'% surviving':>12}")
print("-" * 55)
curve = results['Most-connected first']
order = strategies['Most-connected first']
for i, (n_rem, n_surv) in enumerate(curve):
    poll_name = order[i-1] if i > 0 else "(none)"
    pct = n_surv / n_orchids * 100
    bar = "█" * int(pct / 5)
    print(f"{n_rem:>8} {poll_name:<20} {n_surv:>12} {pct:>10.0f}% {bar}")

# Keystone species
print("\\nKeystone pollinators (whose removal causes most orchid loss):")
for row in c.execute('''
    SELECT s1.pollinators_removed, s1.orchids_surviving,
           LAG(s1.orchids_surviving) OVER (ORDER BY s1.pollinators_removed) as prev
    FROM simulations s1 WHERE s1.strategy = 'Most-connected first'
    ORDER BY s1.pollinators_removed
'''):
    if row[2] is not None:
        loss = row[2] - row[1]
        if loss > 0:
            poll = order[row[0]-1]
            print(f"  {poll}: removing it causes {loss} orchid extinction(s)")

conn.close()`,
      challenge: 'Add a "conservation intervention" scenario: before simulating extinction, protect the top 3 keystone pollinators (make them immune to removal). How much does this improve network robustness? Is protecting pollinators more cost-effective than protecting orchids directly?',
      successHint: 'You built a network resilience simulator — a critical tool for conservation ecology. The analysis reveals that protecting keystone pollinators can be more effective than protecting individual orchid species, because each pollinator protects multiple orchids simultaneously.',
    },
    {
      title: 'Integrated conservation planning system',
      concept: `The capstone integrates everything: biodiversity databases, vulnerability models, network analysis, and prioritization into a **complete conservation planning system** for Phawngpui orchids.

The system answers the key questions:
1. **What do we have?** (biodiversity inventory)
2. **What is at risk?** (vulnerability assessment)
3. **What depends on what?** (network analysis)
4. **What should we do first?** (prioritization)
5. **How do we measure success?** (monitoring plan)

This is **systematic conservation planning** — the evidence-based approach to protecting biodiversity.

📚 *The final system connects databases, algorithms, and ecological models into one decision-support pipeline — the computational foundation of modern conservation.*`,
      analogy: 'The integrated conservation system is like a military command center. Intelligence (database) feeds into threat assessment (vulnerability), which feeds into strategy (prioritization), which feeds into operations (actions), which feeds back into intelligence (monitoring). Each component informs the others in a continuous loop of observation, analysis, decision, and evaluation.',
      storyConnection: 'This system is what Phawngpui needs. The mountain holds irreplaceable orchid diversity, faces multiple threats, and has limited conservation resources. A systematic approach — grounded in data, guided by models, and optimized by algorithms — can protect more species with less money than any ad-hoc effort.',
      checkQuestion: 'What is the most important output of a conservation planning system?',
      checkAnswer: 'Actionable recommendations: specific conservation actions for specific species at specific locations, ranked by priority and cost-effectiveness. A plan that is scientifically rigorous but too complex to implement is useless. The system must translate ecological understanding into practical steps that conservation workers can execute in the field.',
      codeIntro: 'Build the complete Phawngpui orchid conservation planning system.',
      code: `import sqlite3
import numpy as np

np.random.seed(42)
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE inventory (
    species TEXT, status TEXT, population INTEGER,
    endemic INTEGER, pollinators INTEGER, vulnerability REAL
);
CREATE TABLE network_metrics (
    species TEXT, degree INTEGER, specialization REAL,
    keystone_dependency INTEGER
);
CREATE TABLE conservation_plan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    species TEXT, action TEXT, priority TEXT,
    cost_lakhs REAL, expected_outcome TEXT,
    timeline TEXT, responsible TEXT
);
CREATE TABLE monitoring_targets (
    species TEXT, metric TEXT, baseline REAL,
    target_5yr REAL, method TEXT
);
''')

# Build inventory
species_data = [
    ('Bulbophyllum phawngpuiense', 'CR', 150, 1, 1, 0.92),
    ('Eria mizoramensis', 'CR', 80, 1, 2, 0.88),
    ('Vanda coerulea', 'EN', 2000, 0, 3, 0.65),
    ('Paphiopedilum villosum', 'EN', 500, 0, 2, 0.72),
    ('Cymbidium tigrinum', 'EN', 1200, 0, 4, 0.58),
    ('Dendrobium chrysanthum', 'VU', 8000, 0, 5, 0.42),
    ('Aerides odorata', 'VU', 5000, 0, 4, 0.45),
    ('Coelogyne cristata', 'LC', 30000, 0, 8, 0.18),
]
c.executemany('INSERT INTO inventory VALUES (?,?,?,?,?,?)', species_data)

# Network metrics
for sp, _, _, _, polls, vuln in species_data:
    spec = 1.0 / max(polls, 1)
    keystone = 1 if polls <= 2 and vuln > 0.7 else 0
    c.execute('INSERT INTO network_metrics VALUES (?,?,?,?)', (sp, polls, round(spec, 2), keystone))

# Generate conservation plan
actions_map = {
    'CR': [
        ('Emergency habitat fence', 'CRITICAL', 5.0, 'Prevent immediate loss', '0-6 months', 'Forest Dept'),
        ('Ex-situ propagation', 'CRITICAL', 3.0, 'Backup population in nursery', '0-12 months', 'Botanical Garden'),
        ('Pollinator habitat creation', 'HIGH', 4.0, 'Ensure pollinator survival', '6-24 months', 'NGO partner'),
        ('Genetic study', 'MEDIUM', 2.0, 'Assess genetic diversity', '12-24 months', 'University'),
    ],
    'EN': [
        ('Habitat protection', 'HIGH', 4.0, 'Secure key populations', '0-12 months', 'Forest Dept'),
        ('Anti-poaching patrol', 'HIGH', 2.0, 'Reduce illegal collection', '0-6 months', 'Forest Dept'),
        ('Seed banking', 'MEDIUM', 1.5, 'Long-term insurance', '6-18 months', 'Seed Bank'),
    ],
    'VU': [
        ('Population monitoring', 'MEDIUM', 1.0, 'Track trends', '0-60 months', 'Research team'),
        ('Community awareness', 'LOW', 0.5, 'Reduce accidental damage', '0-12 months', 'NGO'),
    ],
    'LC': [
        ('Baseline survey', 'LOW', 0.5, 'Establish reference data', '0-12 months', 'Research team'),
    ],
}

for sp, status, pop, endemic, polls, vuln in species_data:
    for action, priority, cost, outcome, timeline, resp in actions_map.get(status, []):
        c.execute('INSERT INTO conservation_plan (species, action, priority, cost_lakhs, expected_outcome, timeline, responsible) VALUES (?,?,?,?,?,?,?)',
                  (sp, action, priority, cost, outcome, timeline, resp))

# Monitoring targets
for sp, status, pop, _, _, _ in species_data:
    growth_target = 1.2 if status in ['CR', 'EN'] else 1.0
    c.execute('INSERT INTO monitoring_targets VALUES (?,?,?,?,?)',
              (sp, 'population_count', pop, int(pop * growth_target), 'Annual census'))
    c.execute('INSERT INTO monitoring_targets VALUES (?,?,?,?,?)',
              (sp, 'flowering_rate', 0.3, 0.4, 'Phenology monitoring'))

conn.commit()

# Generate report
print("PHAWNGPUI ORCHID CONSERVATION PLAN")
print("=" * 70)

# Executive summary
total_sp = c.execute('SELECT COUNT(*) FROM inventory').fetchone()[0]
cr_sp = c.execute("SELECT COUNT(*) FROM inventory WHERE status='CR'").fetchone()[0]
en_sp = c.execute("SELECT COUNT(*) FROM inventory WHERE status='EN'").fetchone()[0]
endemic_sp = c.execute("SELECT COUNT(*) FROM inventory WHERE endemic=1").fetchone()[0]
total_cost = c.execute("SELECT SUM(cost_lakhs) FROM conservation_plan").fetchone()[0]

print(f"\\nExecutive Summary:")
print(f"  Species: {total_sp} ({cr_sp} CR, {en_sp} EN, {endemic_sp} endemic)")
print(f"  Total budget needed: {total_cost:.1f} lakhs INR")
critical_count = c.execute("SELECT COUNT(*) FROM conservation_plan WHERE priority='CRITICAL'").fetchone()[0]
print(f"  Critical actions: {critical_count}")

# Priority actions
print(f"\\nCRITICAL PRIORITY ACTIONS:")
print(f"{'Species':<30} {'Action':<25} {'Cost':>6} {'Timeline':<15}")
print("-" * 80)
for row in c.execute("SELECT species, action, cost_lakhs, timeline FROM conservation_plan WHERE priority='CRITICAL' ORDER BY cost_lakhs DESC"):
    print(f"{row[0]:<30} {row[1]:<25} {row[2]:>5.1f}L {row[3]:<15}")

# Network vulnerability
print(f"\\nNETWORK VULNERABILITY:")
for row in c.execute('''
    SELECT n.species, i.status, n.degree, n.specialization, n.keystone_dependency, i.vulnerability
    FROM network_metrics n JOIN inventory i ON n.species = i.species
    ORDER BY i.vulnerability DESC LIMIT 5
'''):
    flag = " *** CRITICAL ***" if row[4] else ""
    print(f"  {row[0][:25]:<25} [{row[1]}] {row[2]} pollinators, spec={row[3]:.2f}, vuln={row[5]:.2f}{flag}")

# Monitoring plan
print(f"\\n5-YEAR MONITORING TARGETS:")
print(f"{'Species':<30} {'Metric':<18} {'Baseline':>9} {'Target':>9}")
print("-" * 70)
for row in c.execute("SELECT * FROM monitoring_targets WHERE metric='population_count' ORDER BY baseline"):
    change = ((row[3] - row[2]) / row[2]) * 100
    print(f"{row[0]:<30} {row[1]:<18} {row[2]:>9,} {row[3]:>9,} ({change:+.0f}%)")

# Cost-effectiveness
print(f"\\nCOST-EFFECTIVENESS RANKING:")
for row in c.execute('''
    SELECT cp.species, SUM(cp.cost_lakhs), i.vulnerability, i.population,
           ROUND(i.vulnerability / SUM(cp.cost_lakhs), 2)
    FROM conservation_plan cp JOIN inventory i ON cp.species = i.species
    GROUP BY cp.species ORDER BY 5 DESC LIMIT 5
'''):
    print(f"  {row[0][:25]:<25}: {row[1]:.1f}L cost, {row[2]:.2f} vuln, ratio={row[4]}")

conn.close()
print(f"\\n{'='*70}")
print("This plan protects Phawngpui's irreplaceable orchid heritage through")
print("systematic, evidence-based conservation. Every rupee is allocated to")
print("maximize biodiversity outcomes.")`,
      challenge: 'Add a "scenario planning" module: compare outcomes under three funding levels (50%, 100%, 200% of requested budget). How many species can be protected at each level? At what funding level do we save all CR species? This is the funding gap analysis that conservation organizations present to donors.',
      successHint: 'You built a complete conservation planning system integrating biodiversity inventory, network ecology, vulnerability assessment, and resource optimization. This capstone demonstrates that computational science is not just academic — it is a powerful tool for protecting the natural world. The orchids of Phawngpui, products of millions of years of coevolution, deserve the best science we can bring to their conservation.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Database-Driven Conservation Biology</span>
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
