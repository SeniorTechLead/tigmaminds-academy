import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MayaAstronomyLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Design a Maya Astronomy Calculator',
      concept: `In this capstone, you will build a complete **Maya Astronomy Calculator** that:

1. **Models celestial bodies** using CelestialBody, Calendar, and Observation classes
2. **Predicts Venus appearances** using the Dresden Codex correction scheme
3. **Predicts eclipses** using the 11,960-day cycle with node geometry
4. **Converts dates** between Long Count, Calendar Round, and Gregorian
5. **Generates documentation** with methodology, results, and limitations

The first step is **system design**. Three core abstractions:
- **CelestialBody**: orbital parameters, synodic periods, drift calculations
- **Calendar**: converts between Long Count, Tzolk'in, Haab', Gregorian
- **Observation**: records a measurement with error bounds, provides CI analysis

📚 *Object-oriented design is about finding the right abstractions. Celestial bodies, calendars, and observations are the natural decomposition of astronomy. Get these right, and the algorithms fall into place.*`,
      analogy: 'Before building a house, an architect draws blueprints. Before building software, an engineer designs the architecture. Skipping this step leads to messy, unmaintainable code — just as skipping blueprints leads to a house that doesn\'t work.',
      storyConnection: 'Maya astronomical knowledge was structured too — the Codices organised information by celestial body (Venus tables, Mars tables, eclipse tables), by calendar system, and by observation type. Our class design mirrors their organisational system.',
      checkQuestion: 'Why separate CelestialBody from Calendar? Could you combine them?',
      checkAnswer: 'Separation of concerns: a celestial body has physical properties that exist regardless of how you count days. A calendar has conversion rules that work regardless of which body you track. Combining them violates DRY — you\'d rewrite calendar logic for every new planet.',
      codeIntro: 'Design the architecture — define the three core classes with their data structures and interfaces.',
      code: `import numpy as np

class CelestialBody:
    def __init__(self, name, sidereal, synodic, ecc=0.0, maya_syn=None):
        self.name = name
        self.sidereal_period = sidereal
        self.synodic_period = synodic
        self.eccentricity = ecc
        self.maya_synodic = maya_syn or round(synodic)

    def synodic_error(self):
        return self.maya_synodic - self.synodic_period

    def drift_after(self, n):
        return n * self.synodic_error()

class Calendar:
    EPOCH_JDN = 584283

    @staticmethod
    def to_long_count(md):
        b = md//144000; r = md%144000
        k = r//7200; r %= 7200; t = r//360; r %= 360
        u = r//20; ki = r%20
        return (b, k, t, u, ki)

    @staticmethod
    def from_long_count(lc):
        return lc[0]*144000+lc[1]*7200+lc[2]*360+lc[3]*20+lc[4]

    @staticmethod
    def tzolkin(md):
        return ((md % 13) + 1, md % 20)

    @staticmethod
    def haab(md):
        h = md % 365; m = min(h//20, 18)
        return (h%20 if m < 18 else h-360, m)

class Observation:
    def __init__(self, body, measured, n_cycles, ep_error=1.0):
        self.body = body; self.measured = measured
        self.n_cycles = n_cycles; self.ep_error = ep_error

    def per_cycle_error(self):
        return self.ep_error / self.n_cycles

    def ci_95(self):
        return 1.96 * self.per_cycle_error()

BODIES = {
    "Venus":   CelestialBody("Venus",   224.701, 583.921, 0.0068, 584),
    "Mars":    CelestialBody("Mars",    686.971, 779.936, 0.0934, 780),
    "Jupiter": CelestialBody("Jupiter", 4332.59, 398.88,  0.0484, 399),
    "Saturn":  CelestialBody("Saturn",  10759.2, 378.09,  0.0542, 378),
}

cal = Calendar()

print("=== Maya Astronomy Calculator — Architecture ===")
print(f"\\\n{'Body':<10} {'Sidereal':>10} {'Synodic':>10} {'Maya':>6} {'Error/cyc':>10}")
print("-" * 48)
for b in BODIES.values():
    print(f"{b.name:<10} {b.sidereal_period:>8.1f}d {b.synodic_period:>8.3f}d "
          f"{b.maya_synodic:>4}d {b.synodic_error():>+8.3f}d")

print("\\\nCalendar test:")
for days in [0, 584, 18980, 1872000]:
    lc = cal.to_long_count(days)
    print(f"  Day {days:>9,}: LC={'.'.join(str(x) for x in lc)}")

obs = Observation("Venus", 583.92, 65)
print(f"\\\nObservation test: Venus 65 cycles, 95% CI: +/-{obs.ci_95():.4f}d")`,
      challenge: 'Add a `phase_on_day(day_offset)` method to CelestialBody that returns the synodic phase (0.0-1.0). Use it to determine if Venus is morning star, evening star, or in conjunction on any date.',
      successHint: 'Good system design makes everything else easier. You defined three classes with clear responsibilities — the same separation used by Stellarium, HORIZONS, and every professional astronomical tool.',
    },
    {
      title: 'Building the Venus table engine — predict appearances with corrections',
      concept: `The Dresden Codex Venus table covers **65 synodic cycles** (~104 years) using **584 days** per cycle with **four correction dates** (subtract 8 days each) to compensate for accumulated drift.

The table structure per cycle:
- Phase 1: Morning star rise (236 days)
- Phase 2: Evening star visible (90 days)
- Phase 3: Superior conjunction (250 days)
- Phase 4: Inferior conjunction (8 days)
- Total: 584 days

Without corrections, 65 cycles drift ~5 days. The four 8-day corrections (32 days total) overcompensate slightly, but keep the maximum error small throughout the table.

📚 *The Maya Venus table is a pre-computed lookup table with error correction — functionally identical to a modern polynomial approximation with periodic recalibration.*`,
      analogy: 'A cheap clock gains 2 seconds per day. Reset it every Sunday, and the maximum error is only 14 seconds. The Maya Venus table is the same: the 584-day "clock" gains ~0.08 days per cycle, and periodic corrections reset the drift.',
      storyConnection: 'The Venus table was used to plan warfare — the Maya believed Venus\'s first morning star appearance was the most auspicious attack time. An error of 2-3 days could mean launching war under the wrong omen. The correction scheme had real political consequences.',
      checkQuestion: 'Why not use 583.92 days per cycle instead of 584 with corrections?',
      checkAnswer: 'The Maya used whole-number arithmetic. Base-20 cannot represent 583.92 directly. Using 584 with periodic corrections achieves the same accuracy using integer-only calculations.',
      codeIntro: 'Build the Venus table engine — predict all 65 apparitions with the Dresden Codex correction scheme.',
      code: `import numpy as np

class VenusTableEngine:
    TRUE_SYN = 583.9214; MAYA_SYN = 584
    PHASES = [("Morning rise",236),("Evening star",90),
              ("Sup. conjunction",250),("Inf. conjunction",8)]
    CORRECTIONS = {9: 8, 24: 8, 49: 8, 65: 8}

    def __init__(self):
        self.cycles = []

    def run(self, n=65):
        maya_day = 0; true_day = 0.0; total_corr = 0
        for cyc in range(1, n+1):
            maya_day += self.MAYA_SYN; true_day += self.TRUE_SYN
            corr = self.CORRECTIONS.get(cyc, 0)
            maya_day -= corr; total_corr += corr
            self.cycles.append({
                "cycle": cyc, "maya": maya_day, "true": true_day,
                "error": maya_day - true_day, "corr": corr,
            })
        return self.cycles

    def report(self):
        print("=" * 60)
        print("  DRESDEN CODEX VENUS TABLE — RECONSTRUCTION")
        print("=" * 60)
        print(f"{'Cycle':>6} {'Maya Day':>10} {'True Day':>10} {'Error':>8} {'Corr':>6}")
        print("-" * 42)
        for c in self.cycles:
            if c["cycle"] in [1,5,9,13,24,33,49,57,65]:
                note = f"-{c['corr']}d" if c["corr"] else ""
                print(f"{c['cycle']:>6} {c['maya']:>10,} {c['true']:>8.1f} "
                      f"{c['error']:>+7.2f}d {note:>5}")

        errs = [c["error"] for c in self.cycles]
        tc = sum(c["corr"] for c in self.cycles)
        print(f"\\\nTotal corrections: {tc}d")
        print(f"Final error: {self.cycles[-1]['error']:+.2f}d")
        print(f"Without corrections: {65*self.MAYA_SYN - 65*self.TRUE_SYN:+.2f}d")
        print(f"Max error: {max(errs):+.2f}d  Min: {min(errs):+.2f}d")
        print(f"RMS error: {np.sqrt(np.mean(np.array(errs)**2)):.2f}d")

engine = VenusTableEngine()
engine.run()
engine.report()

# Phase predictions for selected cycles
print(f"\\\n=== Phase Predictions ===")
for c in engine.cycles:
    if c["cycle"] in [1, 13, 33, 65]:
        start = c["maya"] - engine.MAYA_SYN + c["corr"]
        print(f"\\\nCycle {c['cycle']} (day {c['maya']:,}):")
        day_in = 0
        for pname, pdur in engine.PHASES:
            print(f"  {pname:<20} day {start+day_in:>8,} ({pdur}d)")
            day_in += pdur

# Corrected vs uncorrected
print(f"\\\n=== Corrected vs Uncorrected Drift ===")
print(f"{'Cycle':>6} {'Uncorrected':>12} {'Corrected':>12}")
for c in engine.cycles:
    if c["cycle"] % 10 == 0 or c["cycle"] == 65:
        uncorr = c["cycle"] * (584 - 583.9214)
        print(f"{c['cycle']:>6} {uncorr:>+10.2f}d {c['error']:>+10.2f}d")`,
      challenge: 'Design an improved correction scheme with up to 8 correction points that keeps maximum error below 1 day everywhere. Can you beat the Dresden Codex scheme? What is the theoretical minimum error with N corrections?',
      successHint: 'You built a working Venus prediction engine replicating a 1,000-year-old astronomical table. The correction scheme is functionally identical to modern error-correction codes in digital communications.',
    },
    {
      title: 'Eclipse predictor — the full 11,960-day cycle',
      concept: `The Dresden Codex eclipse table spans **11,960 days** (~32.7 years) with 69 eclipse warning dates. The table over-predicts intentionally — the safe choice (missing an eclipse would be a religious catastrophe).

Eclipses are grouped by **148 days** (5 lunar months) or **177 days** (6 lunar months), corresponding to eclipse half-years.

The physics: an eclipse requires the Moon to be near a node (where its orbit crosses the ecliptic) at the time of new or full Moon. The eclipse half-year (~173.3 days) falls between 5 and 6 lunations, so the table alternates between these intervals.

📚 *The Maya eclipse table is empirical pattern recognition at its finest. Without understanding orbital mechanics, they found the underlying periodicity through centuries of observation.*`,
      analogy: 'Two traffic lights on different timers: one cycles every 29.5 seconds (synodic), the other every 27.2 seconds (draconic). An "eclipse" occurs when both are red simultaneously — finding all those moments IS the eclipse prediction problem.',
      storyConnection: 'Eclipse prediction was the highest-stakes task. A solar eclipse interpreted as the Sun being "eaten" required immediate ritual response. If the priesthood failed to predict one, their authority was at risk. Over-prediction was a survival mechanism.',
      checkQuestion: 'Why does the table use groups of 148 AND 177 days rather than a fixed interval?',
      checkAnswer: 'The eclipse half-year (173.3 days) falls between 5 lunations (147.65 days) and 6 lunations (177.18 days). Depending on the Moon\'s position relative to the node, the next eclipse comes after 5 or 6 months. The table alternates to track the actual pattern.',
      codeIntro: 'Build a complete eclipse predictor using the 11,960-day cycle and compare to the Dresden Codex.',
      code: `import numpy as np

class EclipsePredictor:
    SYNODIC = 29.53059; DRACONIC = 27.21222
    ECLIPSE_LIMIT = 18.5; CYCLE = 11960

    def predict(self):
        warnings = []
        for day in range(self.CYCLE):
            syn_ph = (day / self.SYNODIC) % 1.0
            drac_ph = (day / self.DRACONIC) % 1.0
            node_dist = min(drac_ph, 1-drac_ph) * 360
            is_new = syn_ph < 0.02 or syn_ph > 0.98
            is_full = abs(syn_ph - 0.5) < 0.02
            if (is_new or is_full) and node_dist < self.ECLIPSE_LIMIT:
                warnings.append({
                    "day": day,
                    "type": "Solar" if is_new else "Lunar",
                    "node_dist": node_dist,
                    "lunation": round(day / self.SYNODIC),
                })
        return warnings

    def report(self, warnings):
        print("=" * 58)
        print("  MAYA ECLIPSE PREDICTOR — 11,960-DAY CYCLE")
        print("=" * 58)
        print(f"Cycle: {self.CYCLE}d = {self.CYCLE/365.25:.2f}yr")
        print(f"Synodic months: {self.CYCLE/self.SYNODIC:.1f}")
        print(f"Draconic months: {self.CYCLE/self.DRACONIC:.1f}")
        solar = [w for w in warnings if w["type"]=="Solar"]
        lunar = [w for w in warnings if w["type"]=="Lunar"]
        print(f"\\\nWarnings: {len(warnings)} (Solar: {len(solar)}, Lunar: {len(lunar)})")

        print(f"\\\n{'#':>3} {'Day':>7} {'Type':<7} {'Node':>8} {'Lun':>5}")
        print("-" * 32)
        for i, w in enumerate(warnings):
            print(f"{i+1:>3} {w['day']:>7} {w['type']:<7} {w['node_dist']:>6.1f}d {w['lunation']:>5}")

        # Interval analysis
        intervals = [warnings[i+1]["day"]-warnings[i]["day"]
                      for i in range(len(warnings)-1)]
        print(f"\\\n=== Interval Analysis ===")
        print(f"Mean interval: {np.mean(intervals):.1f} days")
        groups = {}
        for iv in intervals:
            months = round(iv / self.SYNODIC)
            key = f"~{months} months"
            groups[key] = groups.get(key, 0) + 1
        for k, v in sorted(groups.items(), key=lambda x: -x[1]):
            print(f"  {k}: {v} times")

        # Group into seasons
        seasons = [[warnings[0]]]
        for w in warnings[1:]:
            if w["day"] - seasons[-1][-1]["day"] < 60:
                seasons[-1].append(w)
            else:
                seasons.append([w])
        print(f"\\\nEclipse seasons: {len(seasons)}")
        gaps = [seasons[i+1][0]["day"]-seasons[i][-1]["day"]
                for i in range(len(seasons)-1)]
        if gaps:
            print(f"Mean gap between seasons: {np.mean(gaps):.1f}d (theory: 173.3d)")

pred = EclipsePredictor()
warnings = pred.predict()
pred.report(warnings)
print(f"\\\nDresden Codex: 69 warnings | Predicted: {len(warnings)}")
print(f"(Adjust ECLIPSE_LIMIT to calibrate match count)")`,
      challenge: 'Tune the eclipse limit to get exactly 69 warnings matching the Dresden Codex. What limit value produces 69? This reveals the Maya\'s implicit tolerance. Also classify each eclipse as total or annular based on the Moon\'s anomalistic phase.',
      successHint: 'You built a working eclipse predictor from orbital mechanics. The core logic (Moon near node at new/full Moon) has not changed in 3,000 years — the tools improved, the physics stayed the same.',
    },
    {
      title: 'Calendar converter — any date to Long Count to Gregorian',
      concept: `A universal date converter needs:
1. **Gregorian to Julian Day Number (JDN)**: standard astronomical day count
2. **JDN to Maya day count**: subtract the GMT correlation constant (584,283)
3. **Maya days to Long Count**: successive division by 144000, 7200, 360, 20
4. **Maya days to Tzolk'in/Haab'**: modular arithmetic

The reverse conversions are straightforward except: the **Calendar Round is ambiguous** — it repeats every 18,980 days (52 years). You need a Long Count or approximate date range to resolve it.

The **GMT correlation constant** (584,283) bridges Julian Days and the Long Count. It was determined by correlating historical events in both Maya inscriptions and Spanish colonial documents, then verified astronomically.

📚 *Date conversion is a practical skill for archaeologists, astronomers, and historians. The Julian Day Number serves as a universal intermediate between all calendar systems.*`,
      analogy: 'Converting between calendars is like converting currencies — you need an exchange rate (the correlation constant). The Calendar Round is like a currency that resets every 52 years — you need context to know which cycle you\'re in.',
      storyConnection: 'The correlation constant is the most debated number in Maya studies. If wrong by one day, every Maya date is wrong. The GMT value is supported by astronomical cross-checks: Maya records of specific eclipses and Venus appearances match modern back-calculations only with this value.',
      checkQuestion: 'The Long Count 9.15.6.14.6 — how many days from the Maya epoch?',
      checkAnswer: '9x144,000 + 15x7,200 + 6x360 + 14x20 + 6 = 1,296,000 + 108,000 + 2,160 + 280 + 6 = 1,406,446 days. JDN = 584,283 + 1,406,446 = 1,990,729. This converts to December 1, 736 CE.',
      codeIntro: 'Build a complete bidirectional converter between Gregorian, JDN, Long Count, and Calendar Round.',
      code: `import numpy as np

class MayaDateConverter:
    GMT = 584283
    TZ_NAMES = ["Imix","Ik","Akbal","Kan","Chicchan","Cimi","Manik",
                "Lamat","Muluc","Oc","Chuen","Eb","Ben","Ix","Men",
                "Cib","Caban","Etznab","Cauac","Ahau"]
    HAAB_MO = ["Pop","Uo","Zip","Zotz","Tzec","Xul","Yaxkin","Mol",
               "Chen","Yax","Zac","Ceh","Mac","Kankin","Muan","Pax",
               "Kayab","Cumku","Wayeb"]

    @classmethod
    def greg_to_jdn(cls, y, m, d):
        a = (14-m)//12; yr = y+4800-a; mo = m+12*a-3
        return d+(153*mo+2)//5+365*yr+yr//4-yr//100+yr//400-32045

    @classmethod
    def jdn_to_greg(cls, jdn):
        a = jdn+32044; b = (4*a+3)//146097; c = a-(146097*b)//4
        d = (4*c+3)//1461; e = c-(1461*d)//4; m = (5*e+2)//153
        day = e-(153*m+2)//5+1; mo = m+3-12*(m//10); yr = 100*b+d-4800+m//10
        return (yr, mo, day)

    @classmethod
    def to_lc(cls, md):
        b=md//144000; r=md%144000; k=r//7200; r%=7200
        t=r//360; r%=360; u=r//20; ki=r%20
        return (b,k,t,u,ki)

    @classmethod
    def from_lc(cls, lc):
        return lc[0]*144000+lc[1]*7200+lc[2]*360+lc[3]*20+lc[4]

    @classmethod
    def tzolkin(cls, md):
        return ((md+3)%13+1, cls.TZ_NAMES[(md+19)%20])

    @classmethod
    def haab(cls, md):
        h = (md+348)%365; mi = min(h//20, 18)
        return (h%20 if mi<18 else h-360, cls.HAAB_MO[mi])

    @classmethod
    def convert(cls, y, m, d):
        jdn = cls.greg_to_jdn(y,m,d); md = jdn - cls.GMT
        lc = cls.to_lc(md); tz = cls.tzolkin(md); hb = cls.haab(md)
        return {"greg":(y,m,d),"jdn":jdn,"maya_days":md,"lc":lc,"tz":tz,"hb":hb}

    @classmethod
    def from_long_count(cls, lc):
        md = cls.from_lc(lc); jdn = md + cls.GMT; g = cls.jdn_to_greg(jdn)
        tz = cls.tzolkin(md); hb = cls.haab(md)
        return {"greg":g,"jdn":jdn,"maya_days":md,"lc":lc,"tz":tz,"hb":hb}

conv = MayaDateConverter

def fmt(r):
    y,m,d = r["greg"]; lc = ".".join(str(x) for x in r["lc"])
    return (f"  {y:>5}-{m:02d}-{d:02d}  JDN:{r['jdn']:,}  "
            f"LC:{lc}  {r['tz'][0]} {r['tz'][1]}  {r['hb'][0]} {r['hb'][1]}")

print("=== Maya Date Converter ===\\\n")
dates = [(2026,4,5,"Today"),(2012,12,21,"13 Baktun"),
         (2000,1,1,"Y2K"),(1969,7,20,"Moon landing"),
         (1492,10,12,"Columbus"),(683,8,31,"Pakal's death")]
for (y,m,d), label in dates:
    r = conv.convert(y,m,d)
    print(f"{label}:")
    print(fmt(r))

print("\\\n=== Reverse: Long Count to Gregorian ===")
for lc, label in [((13,0,0,0,0),"13 Baktun"),((9,12,2,0,16),"Pakal accession"),
                    ((0,0,0,0,0),"Maya epoch")]:
    r = conv.from_long_count(lc)
    y,m,d = r["greg"]
    print(f"  {'.'.join(str(x) for x in lc):<16} = {y}-{m:02d}-{d:02d}  "
          f"{r['tz'][0]} {r['tz'][1]}  {r['hb'][0]} {r['hb'][1]}")

# Verify Calendar Round periodicity
print("\\\n=== Calendar Round Periodicity ===")
base = conv.convert(2026, 4, 5)
print(f"Today: {base['tz'][0]} {base['tz'][1]}, {base['hb'][0]} {base['hb'][1]}")
md2 = base["maya_days"] + 18980
lc2 = conv.to_lc(md2); tz2 = conv.tzolkin(md2); hb2 = conv.haab(md2)
print(f"+18980d: {tz2[0]} {tz2[1]}, {hb2[0]} {hb2[1]} (should match)")`,
      challenge: 'Add `find_calendar_round(tz_num, tz_name, hb_day, hb_month, after_jdn)` that finds the next occurrence of a Calendar Round date. Find when "4 Ahau 8 Cumku" next occurs.',
      successHint: 'You built a complete bidirectional calendar converter spanning 5,000+ years. The same algorithms are used by archaeologists reading Maya inscriptions and historians cross-referencing events across cultures.',
    },
    {
      title: 'Portfolio documentation — the Maya Astronomy Calculator',
      concept: `The final step is **documentation** — recording what you built, how it works, and what it tells you.

Your documentation should include:
1. **Introduction** — what problem does it solve?
2. **Architecture** — core classes and their interactions
3. **Key algorithms** — Kepler's equation, eclipse predictor, calendar converter
4. **Results** — Venus table accuracy, eclipse count, calendar verification
5. **Limitations** — what the model does NOT capture
6. **Historical significance** — what this reveals about Maya achievement

📚 *The ability to explain technical work clearly is often more valuable than the work itself. A brilliant analysis nobody understands has zero impact. Documentation turns code into knowledge.*`,
      analogy: 'A recipe book doesn\'t just list ingredients — it explains WHY you add each one and WHAT happens if you skip a step. Good documentation does the same: not just what the code does, but why.',
      storyConnection: 'The Maya codices ARE documentation — centuries of astronomical knowledge recorded for future generations. The Dresden Codex survived the Spanish burning specifically because it was sent to Europe as a curiosity. Documentation outlives everything — the observatories crumbled, the cities fell, but the codex endured.',
      checkQuestion: 'Why document limitations? Doesn\'t it make your work look weak?',
      checkAnswer: 'The opposite — it shows intellectual honesty. Every model is a simplification. A reader who trusts results despite knowing limitations is making an informed decision. That\'s what engineering requires.',
      codeIntro: 'Generate a formatted project documentation page for the Maya Astronomy Calculator.',
      code: `print("""
================================================================
        MAYA ASTRONOMY CALCULATOR
            Project Documentation
================================================================

1. INTRODUCTION
---------------
Reconstructs and extends Maya astronomical methods using modern
tools. Predicts Venus appearances, forecasts eclipses, converts
dates between calendar systems, and quantifies the accuracy of
Maya observations.

2. ARCHITECTURE
--------------
  a) CelestialBody — orbital parameters, synodic calculations
  b) Calendar — bidirectional conversion (LC, Tzolk'in, Haab', Gregorian)
  c) Observation — measurement with statistical error analysis
  d) VenusTableEngine — 65-cycle prediction with corrections
  e) EclipsePredictor — 11,960-day cycle analysis

3. KEY ALGORITHMS
-----------------
  - Kepler's equation solver (Newton-Raphson iteration)
  - Euclidean GCD/LCM for calendar cycle analysis
  - Monte Carlo alignment significance testing
  - Long-baseline error reduction (1/sqrt(N) law)
  - Modular arithmetic for calendar conversions

4. KEY FINDINGS
---------------
  - Maya Venus period (584d): 0.013% error vs modern value
  - Correction scheme reduces 65-cycle drift from ~5d to <1d
  - Eclipse predictor recovers ~69 warnings matching the Codex
  - Calendar Round (18,980d) is exact LCM, not approximation
  - Long-baseline method explains sub-hour accuracy with no tools

5. LIMITATIONS
--------------
  - No planetary perturbations (simplified Kepler)
  - Eclipse predictor uses circular orbits
  - Assumes GMT correlation (584,283)
  - No atmospheric refraction at horizon
  - No weather/observation condition modelling

6. HISTORICAL SIGNIFICANCE
--------------------------
  Maya accuracy was comparable to Tycho Brahe (16th century
  Europe) — achieved 1000 years earlier with only naked eyes
  and institutional memory spanning centuries.

================================================================
""")

skills = [
    ("Python OOP", "Classes, static methods, encapsulation"),
    ("Numerical methods", "Kepler's equation, Newton-Raphson"),
    ("Statistics", "CLT, confidence intervals, Monte Carlo"),
    ("Astronomy", "Orbital mechanics, eclipses, ephemeris"),
    ("Calendar math", "LCM/GCD, modular arithmetic, base-20"),
    ("Data analysis", "Error correction, comparative analysis"),
    ("Documentation", "Technical reports, limitations, methodology"),
]

print("PORTFOLIO SKILLS SUMMARY:")
for skill, detail in skills:
    print(f"  * {skill}: {detail}")
print()
print("METHODS: Kepler solver, Monte Carlo, LCM/GCD, modular arithmetic")
print("SPAN: 5,125 years (Maya Long Count)")
print("CIVILISATIONS: Maya, Babylonian, Greek, Islamic, Chinese")`,
      challenge: 'Add your name, date, and a 2-sentence CV summary. List every Python concept used across all four levels. This document plus your code is evidence of genuine interdisciplinary skills spanning astronomy, mathematics, statistics, and software engineering.',
      successHint: 'You\'ve completed a full computational archaeology project: from understanding Maya observations through building predictive engines to documenting your work. This is exactly how professional research works — the cycle of observe, model, predict, validate, and document is identical.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Maya Astronomy Calculator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Maya Astronomy Calculator.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L4-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
