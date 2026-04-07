import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FourteenGodsLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Moon phases — why the Moon changes shape',
      concept: `The Moon does not produce its own light — it reflects sunlight. As the Moon orbits Earth (taking about 29.5 days), we see different amounts of its sunlit side. These are the **lunar phases**:

1. **New Moon**: Moon between Earth and Sun — dark side faces us
2. **Waxing Crescent**: thin sliver growing on the right
3. **First Quarter**: right half illuminated (half-moon)
4. **Waxing Gibbous**: more than half, still growing
5. **Full Moon**: Earth between Moon and Sun — fully illuminated
6. **Waning Gibbous**: shrinking from the left
7. **Last Quarter**: left half illuminated
8. **Waning Crescent**: thin sliver before new moon

The cycle repeats every **29.53 days** (synodic month).

📚 *We will use Python variables, lists, and a \`for\` loop to model the illumination percentage through a full lunar cycle.*`,
      analogy: 'Hold a ball in sunlight and walk around a friend. From their perspective, the lit part of the ball changes — sometimes fully visible, sometimes hidden. You are the Moon, your friend is Earth, and the sunlight stays constant. Only the viewing angle changes.',
      storyConnection: 'The Kharchi Puja festival of Tripura honours fourteen gods and is timed to the lunar calendar — specifically the 8th day of the dark fortnight of the month of Ashadha. The entire festival depends on understanding moon phases, because the date shifts every year relative to the solar calendar.',
      checkQuestion: 'If a New Moon occurs on July 1st, when is the next Full Moon approximately?',
      checkAnswer: 'A Full Moon occurs about 14.75 days after a New Moon — so approximately July 15th or 16th. The exact timing varies because the Moon\'s orbit is elliptical, not perfectly circular.',
      codeIntro: 'Calculate the Moon illumination percentage for each day of a lunar cycle.',
      code: `import math

# Lunar cycle: 29.53 days
synodic_month = 29.53

# Phase names at key points
phases = [
    (0, "New Moon"),
    (3.7, "Waxing Crescent"),
    (7.4, "First Quarter"),
    (11.1, "Waxing Gibbous"),
    (14.8, "Full Moon"),
    (18.5, "Waning Gibbous"),
    (22.1, "Last Quarter"),
    (25.8, "Waning Crescent"),
]

print("Day  | Illumination | Phase")
print("-" * 45)

for day in range(30):
    # Illumination follows a cosine curve
    angle = 2 * math.pi * day / synodic_month
    illumination = (1 - math.cos(angle)) / 2 * 100

    # Find closest phase name
    phase_name = ""
    for d, name in phases:
        if abs(day - d) < 1.9:
            phase_name = f"<-- {name}"
            break

    bar = "#" * int(illumination / 5)
    print(f" {day:2d}  | {illumination:5.1f}% {bar:20s} | {phase_name}")

print(f"\\\nFull cycle: {synodic_month} days")
print("The illumination follows a smooth cosine curve.")`,
      challenge: 'Modify the code to show TWO consecutive lunar cycles (60 days). Verify that the pattern repeats perfectly.',
      successHint: 'The Moon phase cycle is one of the oldest observed patterns in nature. Every lunar calendar — including the one that governs Kharchi Puja — is built on this 29.53-day rhythm.',
    },
    {
      title: 'Lunar vs solar calendars — why dates shift',
      concept: `There are two fundamental calendar systems:

**Solar calendar** (Gregorian): based on Earth's orbit around the Sun
- 1 year = 365.2422 days
- Months have 28-31 days (no connection to the Moon)

**Lunar calendar**: based on the Moon's phases
- 1 lunar month = 29.53 days
- 12 lunar months = 354.36 days
- That is **10.87 days shorter** than a solar year

This means lunar dates **drift backward** through the solar calendar by about 11 days per year. The Islamic calendar is purely lunar — Ramadan moves through all seasons over 33 years.

**Lunisolar calendars** (Hindu, Hebrew, Chinese) add a leap month every 2-3 years to stay roughly aligned with seasons.

📚 *We will calculate how lunar and solar dates diverge over multiple years using basic arithmetic and loops.*`,
      analogy: 'Imagine two clocks: one ticks every 365.25 seconds (solar year), the other every 354.37 seconds (lunar year). After each "year," the lunar clock is about 11 seconds behind. After 3 years, it is 33 seconds behind — almost a full month. Lunisolar calendars "reset" the lunar clock periodically.',
      storyConnection: 'Kharchi Puja falls on a specific lunar date but must occur in the right season (monsoon). The Hindu lunisolar calendar adds leap months (Adhik Maas) to prevent the festival from drifting into winter. This ancient correction mirrors what astronomers formalised centuries later.',
      checkQuestion: 'After how many years would a purely lunar calendar be a full 6 months out of sync with the seasons?',
      checkAnswer: 'The drift is 10.87 days/year. To drift 6 months (≈ 182.5 days): 182.5 / 10.87 ≈ 16.8 years. After about 17 years, a summer festival would fall in winter. After ~33 years, it comes full circle.',
      codeIntro: 'Track how lunar and solar dates diverge over 20 years.',
      code: `# Lunar vs Solar calendar drift
solar_year = 365.2422  # days
lunar_year = 29.5306 * 12  # 354.37 days
drift_per_year = solar_year - lunar_year

print(f"Solar year:  {solar_year:.4f} days")
print(f"Lunar year:  {lunar_year:.4f} days (12 months)")
print(f"Annual drift: {drift_per_year:.2f} days")
print()

# Track drift over 20 years
print(f"{'Year':>4} | {'Drift (days)':>12} | {'Drift (months)':>14} | Leap month?")
print("-" * 55)

total_drift = 0
leap_months_added = 0
corrected_drift = 0

for year in range(1, 21):
    total_drift += drift_per_year
    corrected_drift += drift_per_year

    # Lunisolar correction: add leap month when drift exceeds ~29.5 days
    leap = ""
    if corrected_drift >= 29.5306:
        corrected_drift -= 29.5306
        leap_months_added += 1
        leap = f"Yes (#{leap_months_added})"

    drift_months = total_drift / 29.5306
    print(f"{year:4d} | {total_drift:12.1f} | {drift_months:14.2f} | {leap}")

print(f"\\\nWithout correction: {total_drift:.0f} days drift in 20 years")
print(f"That is {total_drift/29.5306:.1f} lunar months of drift")
print(f"Leap months added (lunisolar): {leap_months_added}")
print(f"Remaining drift after correction: {corrected_drift:.1f} days")`,
      challenge: 'The Metonic cycle says that after 19 years, lunar and solar calendars nearly realign. Calculate the remaining error after 19 years with 7 leap months.',
      successHint: 'Calendar systems are humanity\'s oldest applied mathematics. The drift between lunar and solar cycles forced ancient civilisations to develop sophisticated correction systems.',
    },
    {
      title: 'Eclipses — when the Sun, Moon, and Earth align',
      concept: `**Solar eclipse**: Moon passes between Earth and Sun, casting a shadow on Earth
**Lunar eclipse**: Earth passes between Sun and Moon, casting its shadow on the Moon

Eclipses require three conditions:
1. **New Moon** (solar) or **Full Moon** (lunar)
2. Moon must be near a **node** (where its orbit crosses Earth's orbital plane)
3. The alignment must be close enough (within ~18.5° of a node)

The Moon's orbit is tilted **5.14°** relative to Earth's orbit around the Sun. This is why eclipses do not happen every month — most New/Full Moons, the Moon passes above or below the Sun/Earth shadow.

**Eclipse seasons** occur twice a year, about 173 days apart, when the Sun is near a lunar node.

📚 *We will use modular arithmetic to predict when eclipse conditions are met.*`,
      analogy: 'Imagine a tilted hula hoop (Moon orbit) rotating around you (Earth). A ball rolls around the hoop. Only when the ball crosses the level of your eyes AND is directly in front of or behind you does an eclipse occur. Most of the time, the tilt sends the ball above or below the line.',
      storyConnection: 'Eclipses held profound significance in Tripura\'s traditions. The fourteen gods were believed to control celestial events. Understanding the geometry of eclipses reveals that these dramatic events follow precise, predictable patterns — not divine whim.',
      checkQuestion: 'If the Moon\'s orbit were not tilted (0° inclination), how often would we see solar and lunar eclipses?',
      checkAnswer: 'Every single month. Every New Moon would produce a solar eclipse, and every Full Moon a lunar eclipse — 24 eclipses per year instead of the actual 4-7. The 5.14° tilt is what makes eclipses rare and special.',
      codeIntro: 'Model when eclipse conditions are met based on the Moon\'s orbital geometry.',
      code: `import math

# Orbital parameters
synodic_month = 29.5306     # days between same phases
draconic_month = 27.2122    # days between node crossings
eclipse_limit_solar = 18.5  # degrees from node for solar eclipse
eclipse_limit_lunar = 12.0  # degrees from node for lunar eclipse

# Track moon phase and node position over 2 years
days_total = 730
eclipses = []

print("Eclipse Prediction over 2 Years")
print("=" * 60)

for day in range(days_total):
    # Phase angle: 0 = new moon, 180 = full moon
    phase_angle = (day % synodic_month) / synodic_month * 360

    # Node angle: 0 = at ascending node
    node_angle = (day % draconic_month) / draconic_month * 360
    # Distance from nearest node (0 or 180 degrees)
    dist_from_node = min(node_angle % 360, 360 - node_angle % 360)
    if dist_from_node > 180:
        dist_from_node = 360 - dist_from_node
    dist_from_node = min(dist_from_node, abs(180 - dist_from_node))

    # Check for new moon near node (solar eclipse)
    is_new = abs(phase_angle) < 5 or abs(phase_angle - 360) < 5
    is_full = abs(phase_angle - 180) < 5

    if is_new and dist_from_node < eclipse_limit_solar:
        eclipses.append((day, "SOLAR", dist_from_node))
    elif is_full and dist_from_node < eclipse_limit_lunar:
        eclipses.append((day, "LUNAR", dist_from_node))

print(f"{'Day':>5} | {'Month':>6} | {'Type':>6} | {'Node dist':>9} | Quality")
print("-" * 50)

for day, etype, dist in eclipses:
    month = day / 30.44
    if dist < 5:
        quality = "Total/Annular"
    elif dist < 10:
        quality = "Partial"
    else:
        quality = "Penumbral"
    print(f"{day:5d} | {month:6.1f} | {etype:>6} | {dist:8.1f}° | {quality}")

print(f"\\\nTotal eclipses in 2 years: {len(eclipses)}")
print(f"Solar: {sum(1 for _,t,_ in eclipses if t=='SOLAR')}")
print(f"Lunar: {sum(1 for _,t,_ in eclipses if t=='LUNAR')}")
print("Typical: 4-7 eclipses per 2 years (matches reality)")`,
      challenge: 'The eclipse limit depends on the Sun\'s apparent size and Earth\'s shadow size. If the Moon were 20% closer to Earth (appearing larger), how would the solar eclipse limit change?',
      successHint: 'Eclipses are not random — they follow orbital geometry with mathematical precision. This is why ancient astronomers could predict them, and why the fourteen gods\' festival is timed so accurately.',
    },
    {
      title: 'The synodic month — why 29.53 and not 27.3 days?',
      concept: `The Moon takes **27.32 days** to orbit Earth (sidereal month — measured against the stars). But the phase cycle takes **29.53 days** (synodic month). Why the difference?

While the Moon orbits Earth, Earth also moves around the Sun. After one full orbit (27.32 days), the Moon returns to the same position relative to the stars, but the Sun has moved about 27° in the sky. The Moon needs an extra ~2.2 days to "catch up" and reach the same phase.

The relationship: \`1/P_synodic = 1/P_sidereal - 1/P_Earth\`

where P_Earth = 365.25 days.

Plugging in: 1/P_syn = 1/27.32 - 1/365.25 = 0.03660 - 0.00274 = 0.03386, so P_syn = 29.53 days.

📚 *We will calculate this relationship and verify it matches observation.*`,
      analogy: 'Imagine running laps on a track with a friend. You complete one lap in 27 seconds, but your friend (walking slowly) has also moved forward. To pass your friend again, you need more than one lap — about 29.5 seconds. The "extra distance" is the synodic correction.',
      storyConnection: 'The fourteen gods\' festival date is calculated from the synodic month, not the sidereal month, because what matters for rituals is the Moon\'s appearance (phase), not its position among the stars. The distinction between these two periods was understood by ancient Tripura astronomers.',
      checkQuestion: 'If Earth did not orbit the Sun (stood still), what would the synodic month equal?',
      checkAnswer: 'The synodic month would equal the sidereal month (27.32 days), because there would be no "catching up" needed. The difference exists entirely because Earth moves while the Moon orbits.',
      codeIntro: 'Derive the synodic month from the sidereal month and Earth\'s orbital period.',
      code: `# The synodic-sidereal relationship
P_sidereal = 27.321661   # days (Moon's orbital period)
P_earth = 365.256363     # days (Earth's orbital period)

# Formula: 1/P_synodic = 1/P_sidereal - 1/P_earth
P_synodic_calc = 1 / (1/P_sidereal - 1/P_earth)
P_synodic_actual = 29.530589  # observed value

print("SYNODIC MONTH DERIVATION")
print("=" * 45)
print(f"Moon sidereal period:  {P_sidereal:.6f} days")
print(f"Earth orbital period:  {P_earth:.6f} days")
print(f"Calculated synodic:    {P_synodic_calc:.6f} days")
print(f"Observed synodic:      {P_synodic_actual:.6f} days")
print(f"Error:                 {abs(P_synodic_calc - P_synodic_actual)*86400:.1f} seconds")
print()

# How much does Earth move during one sidereal month?
earth_angle = 360 * P_sidereal / P_earth
print(f"Earth moves {earth_angle:.2f}° during one sidereal month")
print(f"Moon must travel an extra {earth_angle:.2f}° to reach the same phase")
extra_days = P_synodic_calc - P_sidereal
print(f"That takes an extra {extra_days:.2f} days")
print()

# What if the Moon were at different distances?
print("Synodic period for hypothetical sidereal periods:")
print(f"{'Sidereal (d)':>12} | {'Synodic (d)':>11} | {'Extra days':>10}")
print("-" * 40)
for p in [10, 15, 20, 25, 27.32, 30, 50, 100]:
    syn = 1 / (1/p - 1/P_earth)
    print(f"{p:12.2f} | {syn:11.2f} | {syn - p:10.2f}")

print("\\\nThe closer the sidereal period to Earth's period,")
print("the longer the synodic month becomes!")`,
      challenge: 'Mars has a sidereal period of 687 days. What is the synodic period of Mars (time between oppositions as seen from Earth)? Use the same formula.',
      successHint: 'The synodic-sidereal relationship is universal — it applies to every planet and moon in the solar system. It is a beautiful example of how relative motion creates observable phenomena.',
    },
    {
      title: 'Counting to Kharchi Puja — a lunar date calculator',
      concept: `Kharchi Puja falls on the **8th day (Ashtami) of the dark fortnight (Krishna Paksha)** in the lunar month of **Ashadha** (June-July).

To find this date in the Gregorian calendar, we need to:
1. Find the New Moon that starts the lunar month of Ashadha
2. Count forward: the dark fortnight begins after the Full Moon
3. The Full Moon is day 15; the 8th day of the dark fortnight is day 23 of the lunar month

The algorithm:
- Start with a known New Moon date
- Count forward by synodic months to find the New Moon in June-July
- Add 22 days (15 for Full Moon + 7 more for Ashtami of dark fortnight)

📚 *We will build a function that calculates the Kharchi Puja date for any given year using lunar arithmetic.*`,
      analogy: 'Finding a lunar date is like finding the 3rd Thursday of November (American Thanksgiving). You know the rule, but the exact calendar date shifts every year. Lunar dates shift even more because lunar months do not align with solar months.',
      storyConnection: 'The priests of the fourteen gods have calculated Kharchi Puja dates for centuries using mental arithmetic and traditional almanacs. Our Python algorithm does the same calculation, revealing the mathematical precision behind the tradition.',
      checkQuestion: 'If a New Moon falls on June 18th, when is the 8th day of the following dark fortnight?',
      checkAnswer: 'Full Moon = June 18 + 14.75 ≈ July 3. The 8th day of the dark fortnight = July 3 + 7 = July 10. Kharchi Puja would fall around July 10th that year.',
      codeIntro: 'Build a lunar date calculator to predict Kharchi Puja dates for multiple years.',
      code: `# Kharchi Puja date calculator
# Reference: New Moon on Jan 11, 2024 (known astronomical date)

synodic = 29.5306  # days

# Known new moons (approximate, for January of each year)
# In practice, you'd use an astronomical almanac
jan_new_moons = {
    2024: 11,   # Jan 11, 2024
    2025: 29,   # Jan 29, 2025
    2026: 18,   # Jan 18, 2026
    2027: 7,    # Jan 7, 2027
    2028: 26,   # Jan 26, 2028
}

def days_in_month(month, year):
    if month in [1,3,5,7,8,10,12]: return 31
    if month in [4,6,9,11]: return 30
    if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0): return 29
    return 28

def day_of_year_to_date(doy, year):
    month = 1
    remaining = doy
    while remaining > days_in_month(month, year):
        remaining -= days_in_month(month, year)
        month += 1
    return month, int(remaining)

month_names = ['','Jan','Feb','Mar','Apr','May','Jun',
               'Jul','Aug','Sep','Oct','Nov','Dec']

print("KHARCHI PUJA DATE PREDICTIONS")
print("=" * 50)
print("(8th day of Krishna Paksha, month of Ashadha)")
print()

for year, jan_nm in jan_new_moons.items():
    # Find new moons throughout the year
    new_moon_doy = jan_nm
    ashadha_nm = None

    while new_moon_doy < 366:
        m, d = day_of_year_to_date(max(1, new_moon_doy), year)
        # Ashadha new moon falls in June-July
        if 6 <= m <= 7 and d <= 20:
            ashadha_nm = new_moon_doy
        new_moon_doy += synodic

    if ashadha_nm:
        # Kharchi = full moon (day 15) + 7 days into dark fortnight
        kharchi_doy = ashadha_nm + 22
        km, kd = day_of_year_to_date(int(kharchi_doy), year)
        nm_m, nm_d = day_of_year_to_date(int(ashadha_nm), year)
        print(f"  {year}: Ashadha New Moon ≈ {month_names[nm_m]} {nm_d}")
        print(f"         Kharchi Puja    ≈ {month_names[km]} {kd}")
    else:
        print(f"  {year}: Could not determine (need better new moon data)")
    print()

print("Note: actual dates may vary by 1-2 days due to")
print("local observation traditions and orbital variations.")`,
      challenge: 'Extend the calculator to also predict the Full Moon date for each month. Print a table of all Full Moons for 2025.',
      successHint: 'You have built a working lunar calendar calculator — the same type of tool that has been essential to religious and agricultural planning for thousands of years. The mathematics is simple; the cultural significance is immense.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Astronomy & Lunar Cycles</span>
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
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
