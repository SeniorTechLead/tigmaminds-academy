import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function CuckooLevel1() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Biological clocks — why the cuckoo calls at dawn',
      concept: `In the village, people set their routines by the cuckoo's call at dawn. But the cuckoo doesn't check a watch. It has an internal **biological clock** — a molecular timekeeping system built into its cells.

Almost every organism on Earth has a biological clock:
- **Cuckoos** call at dawn because their clock triggers singing behaviour when light levels reach a threshold
- **Flowers** open and close at specific times (Linnaeus designed a "flower clock" in the 1700s)
- **Humans** feel sleepy at night and alert in the morning because of our internal clock
- Even **single-celled organisms** like cyanobacteria have clocks

These clocks aren't just reactions to light — they're **anticipatory**. They predict when dawn will come and prepare the body in advance. A cuckoo's brain starts ramping up activity before sunrise, not after it.`,
      analogy: 'A biological clock is like an alarm you set the night before. You don\'t wait for someone to wake you — your body "sets the alarm" automatically. Even in a dark room with no windows, your body roughly knows what time it is. The alarm runs on chemistry instead of batteries.',
      storyConnection: 'The villagers in "Why the Cuckoo Calls at Dawn" relied on the bird\'s punctual morning song. The cuckoo wasn\'t being helpful on purpose — its biological clock simply triggered calling behaviour at the same time each day. Biology gave the village a living alarm clock.',
      checkQuestion: 'If you put a cuckoo in a completely dark room with no light cues, would it still call at roughly the same time each day?',
      checkAnswer: 'Yes — at least for a while. Biological clocks are endogenous (internally generated). In constant darkness, the cuckoo would still cycle, but its rhythm would "free-run" at slightly more or less than 24 hours and gradually drift away from real dawn. Light resets the clock each day to keep it accurate.',
      codeIntro: 'Model a simple biological clock as a sine wave oscillating over 24 hours.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# A biological clock modeled as a 24-hour oscillation
hours = np.linspace(0, 72, 500)  # 3 days

# Clock signal: peaks at dawn (~6am), troughs at night
# Using a cosine with period 24, peak at hour 6
clock_signal = np.cos(2 * np.pi * (hours - 6) / 24)

# Activity threshold: cuckoo calls when signal > 0.8
threshold = 0.8
calling = clock_signal > threshold

fig, ax = plt.subplots(figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

ax.plot(hours, clock_signal, color='#3b82f6', linewidth=2, label='Internal clock signal')
ax.axhline(threshold, color='#f59e0b', linestyle='--', linewidth=1, label=f'Calling threshold ({threshold})')
ax.fill_between(hours, clock_signal, threshold, where=calling, alpha=0.3, color='#22c55e', label='Cuckoo calling')

# Mark dawn times
for day in range(3):
    dawn = day * 24 + 6
    ax.axvline(dawn, color='#ef4444', linestyle=':', alpha=0.5)
    ax.text(dawn, -1.1, f'Dawn (Day {day+1})', ha='center', color='#ef4444', fontsize=8)

# Shade nighttime
for day in range(3):
    night_start = day * 24 + 18
    night_end = day * 24 + 30
    ax.axvspan(night_start, min(night_end, 72), alpha=0.1, color='gray')

ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Clock signal strength', color='white')
ax.set_title('Biological Clock: 3-Day Oscillation', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_xlim(0, 72)
ax.set_ylim(-1.3, 1.3)
plt.tight_layout()
plt.show()

print("The cuckoo's internal clock oscillates with a ~24 hour period.")
print("It calls when the signal crosses the threshold — near dawn.")
print("This cycle repeats every day, driven by molecular oscillators.")`,
      challenge: 'Change the period from 24 to 23.5 hours (the actual free-running period for many birds). Run for 10 days. How much does the calling time drift from actual dawn?',
      successHint: 'The biological clock is not perfectly 24 hours — it\'s "circa-dian" (approximately a day). Light exposure each morning resets the clock to prevent drift. This is why the cuckoo needs dawn light, not just its internal timer.',
    },
    {
      title: 'Circadian rhythms — the 24-hour body cycle',
      concept: `The biological clock drives **circadian rhythms** — repeating cycles of physiology and behaviour that follow a roughly 24-hour pattern. "Circadian" comes from Latin: *circa* (about) + *dies* (day).

In humans, circadian rhythms control:
- **Body temperature**: lowest at ~4am, highest at ~6pm
- **Cortisol** (stress hormone): surges at dawn to wake you up
- **Melatonin** (sleep hormone): rises at dusk, drops at dawn
- **Alertness**: peaks mid-morning and late afternoon
- **Digestion**: most efficient during daytime hours
- **Cell repair**: most active during deep sleep

These rhythms are coordinated by a master clock in the brain called the **suprachiasmatic nucleus (SCN)** — a tiny cluster of about 20,000 neurons sitting right above where the optic nerves cross. It receives light signals directly from the eyes.`,
      analogy: 'The SCN is like the conductor of an orchestra. Every organ (instrument) has its own rhythm, but the conductor keeps them all synchronized. Light is the sheet music — it tells the conductor what "movement" (time of day) the orchestra should be playing.',
      storyConnection: 'The cuckoo\'s dawn call was the village\'s timekeeper. In your body, the SCN is the timekeeper — and just like the villagers synchronized their activities to the cuckoo, every organ in your body synchronizes its activities to the SCN.',
      checkQuestion: 'Why do you feel groggy when you wake up at 3am for an early flight, even if you slept 8 hours the night before?',
      checkAnswer: 'Your circadian rhythm had your body temperature, cortisol, and alertness set for sleep at 3am. Even with enough sleep hours, waking during the low point of your circadian cycle means your body isn\'t prepared to be active. The clock matters as much as the duration.',
      codeIntro: 'Plot multiple circadian rhythms over 48 hours showing how body functions rise and fall.',
      code: `import numpy as np
import matplotlib.pyplot as plt

hours = np.linspace(0, 48, 500)

# Different circadian rhythms with different phases
# Body temperature: peaks at ~18:00 (hour 18)
temp = 36.5 + 0.5 * np.cos(2 * np.pi * (hours - 18) / 24)

# Cortisol: peaks at ~8:00 (morning surge)
cortisol = 50 + 40 * np.cos(2 * np.pi * (hours - 8) / 24)
cortisol = np.clip(cortisol, 10, 100)

# Melatonin: peaks at ~3:00 (deep night)
melatonin = 50 + 45 * np.cos(2 * np.pi * (hours - 3) / 24)
melatonin = np.clip(melatonin, 5, 100)

# Alertness: peaks at ~10:00 and ~16:00 (two peaks)
alertness = 40 + 30 * np.cos(2 * np.pi * (hours - 10) / 24) + 15 * np.cos(2 * np.pi * (hours - 16) / 12)
alertness = np.clip(alertness, 10, 100)

fig, axes = plt.subplots(4, 1, figsize=(12, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')

data = [
    (temp, 'Body Temperature', '#ef4444', '°C'),
    (cortisol, 'Cortisol', '#f59e0b', '% of max'),
    (melatonin, 'Melatonin', '#8b5cf6', '% of max'),
    (alertness, 'Alertness', '#22c55e', '% of max'),
]

for ax, (values, label, color, unit) in zip(axes, data):
    ax.set_facecolor('#111827')
    ax.plot(hours, values, color=color, linewidth=2)
    ax.fill_between(hours, values, alpha=0.15, color=color)
    ax.set_ylabel(f'{label}\\n({unit})', color='white', fontsize=9)
    ax.tick_params(colors='gray')
    # Shade night hours
    for day in range(3):
        ax.axvspan(day * 24 + 21, day * 24 + 30, alpha=0.1, color='white')

axes[0].set_title('Circadian Rhythms: 48-Hour View', color='white', fontsize=13)
axes[-1].set_xlabel('Time (hours from midnight)', color='white')

# Add time labels
for ax in axes:
    for h in [0, 6, 12, 18, 24, 30, 36, 42, 48]:
        time_label = f'{int(h % 24):02d}:00'
        ax.axvline(h, color='gray', alpha=0.2, linewidth=0.5)

plt.tight_layout()
plt.show()

print("Notice how each rhythm peaks at a different time:")
print("  Body temp peaks ~6pm (preparing for evening activity)")
print("  Cortisol peaks ~8am (wake-up signal)")
print("  Melatonin peaks ~3am (deep sleep maintenance)")
print("  Alertness peaks ~10am and ~4pm (with a post-lunch dip)")`,
      challenge: 'Add a 5th subplot for "Digestion efficiency" that peaks at noon (12:00). Why might it be bad for your health to eat large meals at midnight?',
      successHint: 'Circadian rhythms explain why shift workers have higher rates of obesity, heart disease, and cancer — eating and working against your body\'s natural rhythms disrupts every system shown in this chart.',
    },
    {
      title: 'Day/night cycles — light as the master signal',
      concept: `The Earth rotates once every 24 hours, creating the day/night cycle that all life on our planet has adapted to over billions of years. This cycle of light and dark is the most powerful **zeitgeber** (German for "time-giver") — an environmental signal that resets biological clocks.

How light resets the clock:
1. Light enters the eye and hits special cells in the retina called **intrinsically photosensitive retinal ganglion cells (ipRGCs)**
2. These cells contain a blue-light-sensitive pigment called **melanopsin**
3. They send signals directly to the SCN (master clock)
4. The SCN adjusts its timing to match the actual sunrise/sunset

This is why:
- **Blue light from screens** at night confuses your clock (it mimics daylight)
- **Blind people** can still have functioning circadian rhythms (ipRGCs don't need vision)
- **Seasons matter**: longer summer days shift the clock differently than short winter days`,
      analogy: 'Light is like a daily software update for your biological clock. Without the update, your clock still runs but slowly drifts out of sync (like a watch that gains 10 minutes per week). Morning light is the "sync" button that keeps your internal time matched to solar time.',
      storyConnection: 'The cuckoo in the story called specifically at dawn — not at noon or dusk. Dawn is the critical moment because it\'s when the light signal is strongest (the transition from dark to bright). The cuckoo\'s clock is most sensitive to light at exactly this transition.',
      checkQuestion: 'Why do health experts say to avoid phone screens before bed, but reading a paper book is fine?',
      checkAnswer: 'Phone screens emit strong blue light, which activates melanopsin in your ipRGCs and tells your SCN it\'s daytime. This suppresses melatonin production and delays sleep onset. Paper books reflect ambient light (which is much dimmer and warmer in the evening) and don\'t trigger the same response.',
      codeIntro: 'Model how day length changes across seasons and how that affects the light signal to the biological clock.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Day length variation across the year (for Guwahati, ~26°N)
days_of_year = np.arange(1, 366)
latitude = 26  # degrees N (Assam)

# Solar declination angle
declination = 23.45 * np.sin(np.radians(360 / 365 * (days_of_year - 81)))

# Day length calculation
lat_rad = np.radians(latitude)
dec_rad = np.radians(declination)
hour_angle = np.degrees(np.arccos(-np.tan(lat_rad) * np.tan(dec_rad)))
day_length = 2 * hour_angle / 15  # hours of daylight

# Blue light exposure from screens (hypothetical evening use)
screen_exposure = np.ones(24) * 5  # baseline low
screen_exposure[8:17] = 30  # daytime moderate
screen_exposure[20:24] = 80  # evening phone use — high blue light

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Seasonal day length
ax1.set_facecolor('#111827')
ax1.plot(days_of_year, day_length, color='#f59e0b', linewidth=2)
ax1.fill_between(days_of_year, day_length, 12, where=day_length > 12, alpha=0.2, color='#f59e0b', label='Longer than 12h')
ax1.fill_between(days_of_year, day_length, 12, where=day_length < 12, alpha=0.2, color='#3b82f6', label='Shorter than 12h')
ax1.axhline(12, color='gray', linestyle='--', linewidth=1)

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
month_starts = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
ax1.set_xticks(month_starts)
ax1.set_xticklabels(months, color='gray', fontsize=8)
ax1.set_ylabel('Day length (hours)', color='white')
ax1.set_title(f'Day Length in Assam ({latitude}°N)', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Blue light exposure
hours_of_day = np.arange(24)
ax2.set_facecolor('#111827')
ax2.bar(hours_of_day, screen_exposure, color='#3b82f6', alpha=0.7, label='Screen blue light')

# Natural light pattern
natural_light = np.zeros(24)
natural_light[6:18] = np.sin(np.linspace(0, np.pi, 12)) * 100
ax2.plot(hours_of_day, natural_light, color='#f59e0b', linewidth=2, label='Natural sunlight')

ax2.set_xlabel('Hour of day', color='white')
ax2.set_ylabel('Blue light intensity (arbitrary)', color='white')
ax2.set_title('Natural Light vs Screen Light', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Day length range in Assam: {day_length.min():.1f}h (Dec) to {day_length.max():.1f}h (Jun)")
print(f"Difference: {day_length.max() - day_length.min():.1f} hours across the year")
print()
print("The problem with screens at night:")
print("  Natural blue light drops to zero after sunset.")
print("  Phone screens blast blue light at 80% intensity at 10pm.")
print("  Your SCN thinks it's still daytime. Melatonin is suppressed.")`,
      challenge: 'Change the latitude to 65 (northern Norway). How extreme does the day length variation get? This is why Scandinavians struggle with winter depression.',
      successHint: 'Light is the most powerful input to your biological clock. Modern life — with artificial lighting, screens, and shift work — has fundamentally disrupted a system that evolved over billions of years.',
    },
    {
      title: 'Melatonin and sleep — the darkness hormone',
      concept: `When the sun sets and darkness falls, your pineal gland (a tiny structure deep in the brain) starts producing **melatonin** — often called the "darkness hormone" or "vampire hormone" because it only appears at night.

Melatonin's role:
- **Signals nighttime** to every cell in your body (it's a chemical broadcast of darkness)
- **Promotes sleep onset** by lowering body temperature and reducing alertness
- **Regulates sleep timing** (not sleep depth — that's controlled by other systems)
- Acts as an **antioxidant**, protecting cells during the repair phase of sleep

The melatonin cycle:
1. **~9pm**: melatonin starts rising (dim light melatonin onset, DLMO)
2. **~3am**: melatonin peaks
3. **~7am**: melatonin drops as light hits the eyes
4. **Daytime**: melatonin is nearly undetectable

Teenagers naturally produce melatonin later than adults — their DLMO shifts to ~11pm. This is why teens genuinely can't fall asleep early; their biology has shifted.`,
      analogy: 'Melatonin is like a "closed for maintenance" sign that your brain hangs on every organ at night. It doesn\'t force you to sleep (you can fight it), but it tells your body that now is the time for repair, cleanup, and rest. Ignoring the sign means the maintenance doesn\'t happen.',
      storyConnection: 'The cuckoo calls at dawn — when melatonin is dropping. In the story, the cuckoo\'s call woke the village. In biology, falling melatonin levels do the same thing — they signal every cell that night is over and it\'s time to become active again.',
      checkQuestion: 'Melatonin supplements are sold in stores. If melatonin helps with sleep timing, why don\'t doctors recommend taking it every night?',
      checkAnswer: 'Melatonin supplements can help reset your clock (e.g., after jet lag or for shift workers), but taking them nightly can suppress your body\'s own production over time. The better approach is to manage light exposure: bright light in the morning, dim light at night. This lets your pineal gland produce melatonin naturally.',
      codeIntro: 'Model the melatonin cycle over 24 hours and show how screen light disrupts it.',
      code: `import numpy as np
import matplotlib.pyplot as plt

hours = np.linspace(0, 24, 200)

# Normal melatonin cycle (pg/mL)
# Rises ~21:00, peaks ~3:00, drops ~7:00
def melatonin_normal(t):
    # Gaussian-like curve centered at 3am (hour 3)
    t_shifted = np.where(t < 12, t, t - 24)  # wrap evening hours
    return 60 * np.exp(-0.5 * ((t_shifted - 3) / 3) ** 2)

# Screen-disrupted melatonin (phone use until 11pm)
def melatonin_screen(t):
    t_shifted = np.where(t < 12, t, t - 24)
    # Delayed by 2 hours, reduced amplitude by 40%
    return 36 * np.exp(-0.5 * ((t_shifted - 5) / 3) ** 2)

# Teenager melatonin (naturally delayed)
def melatonin_teen(t):
    t_shifted = np.where(t < 12, t, t - 24)
    return 55 * np.exp(-0.5 * ((t_shifted - 5) / 3.5) ** 2)

normal = melatonin_normal(hours)
screen = melatonin_screen(hours)
teen = melatonin_teen(hours)

fig, ax = plt.subplots(figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

ax.plot(hours, normal, color='#8b5cf6', linewidth=2.5, label='Normal adult')
ax.plot(hours, screen, color='#ef4444', linewidth=2, linestyle='--', label='After screen use until 11pm')
ax.plot(hours, teen, color='#3b82f6', linewidth=2, linestyle=':', label='Teenager (natural delay)')

# Shade nighttime
ax.axvspan(21, 24, alpha=0.1, color='white')
ax.axvspan(0, 7, alpha=0.1, color='white')

# Mark key events
ax.annotate('DLMO (normal)\\n~9pm', xy=(21, 10), color='#8b5cf6', fontsize=9)
ax.annotate('DLMO (screen)\\n~11pm', xy=(23, 8), color='#ef4444', fontsize=9)
ax.annotate('School starts\\n8am', xy=(8, 50), color='#f59e0b', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax.axvline(8, color='#f59e0b', linestyle=':', alpha=0.5)

time_labels = ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm', '12am']
ax.set_xticks(np.arange(0, 25, 3))
ax.set_xticklabels(time_labels, color='gray')
ax.set_ylabel('Melatonin (pg/mL)', color='white')
ax.set_title('Melatonin Cycles: Normal, Screen-Disrupted, and Teenage', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=10)
ax.tick_params(colors='gray')
plt.tight_layout()
plt.show()

print("Key findings:")
print("  Normal adult: melatonin rises at 9pm, asleep by 10:30pm")
print("  After screens: melatonin delayed 2 hours, 40% weaker")
print("  Teenagers: naturally delayed by ~2 hours")
print()
print("When school starts at 8am:")
print("  Normal adult has been awake for 1-2 hours ✓")
print("  Teenager is still in peak melatonin zone ✗")
print("  This is why sleep scientists advocate for later school start times.")`,
      challenge: 'Add a 4th curve for a shift worker who sleeps from 8am to 4pm. Their melatonin peak would need to shift to ~12pm. What would this look like, and why is it hard for the body to do?',
      successHint: 'Melatonin is the chemical link between the light/dark cycle and your body\'s repair systems. Disrupting it doesn\'t just affect sleep — it affects immune function, metabolism, and even cancer risk.',
    },
    {
      title: 'Migration timing — how birds know when to travel',
      concept: `Many birds (and other animals) make extraordinary seasonal journeys. The bar-tailed godwit flies 11,000 km nonstop from Alaska to New Zealand. Monarch butterflies travel 4,000 km from Canada to Mexico. How do they know when to go?

The answer involves two clocks:
1. **Circannual clock**: a roughly 365-day internal cycle that tracks seasons. Even birds kept in constant conditions for years will show migratory restlessness ("zugunruhe") at the right time of year.
2. **Photoperiodic response**: day length change is the trigger. As days shorten in autumn, hormonal changes prepare the bird for migration — fat stores increase, muscles grow, navigation systems activate.

The cuckoo is a migratory bird. In India, the common cuckoo (*Cuculus canorus*) arrives from Africa in spring, calls during breeding season, and departs before winter. Its timing is so precise that traditional calendars were built around its arrival.

Critical adaptation: young cuckoos migrate to Africa **without their parents** (cuckoos are brood parasites — they never meet their parents). The route is entirely **genetically encoded**.`,
      analogy: 'Migration timing is like a software program with two triggers: a long-running timer (the circannual clock, like a yearly calendar alert) and a real-time sensor (day length, like checking the weather before a trip). Both must agree before the bird "launches" its migration.',
      storyConnection: 'The cuckoo calls at dawn in a specific season. Its arrival in the village and its departure are timed by the same photoperiodic mechanisms that control migration. The story captures an ancient observation: the cuckoo is seasonal, and its timing is reliable enough to plan crops by.',
      checkQuestion: 'Climate change is causing spring to arrive earlier each year. If flowers bloom 2 weeks earlier but the cuckoo still arrives on the same date, what happens?',
      checkAnswer: 'A "phenological mismatch" — the cuckoo arrives after its food sources (caterpillars that eat the flowers) have already peaked. The caterpillars emerged when the flowers bloomed (they respond to temperature), but the cuckoo responds to day length (which doesn\'t change with warming). This mismatch is already causing population declines in some migratory species.',
      codeIntro: 'Model migration timing based on day length change and body condition.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate a year of day length and cuckoo migration readiness
days = np.arange(1, 366)

# Day length for ~26°N (Assam)
declination = 23.45 * np.sin(np.radians(360 / 365 * (days - 81)))
lat_rad = np.radians(26)
dec_rad = np.radians(declination)
hour_angle = np.degrees(np.arccos(np.clip(-np.tan(lat_rad) * np.tan(dec_rad), -1, 1)))
day_length = 2 * hour_angle / 15

# Rate of day length change (the trigger)
day_length_change = np.gradient(day_length)

# Migration readiness score (hypothetical composite)
# Spring arrival: triggered by increasing day length
spring_readiness = np.clip(day_length_change * 50, 0, 100)
# Autumn departure: triggered by decreasing day length
autumn_readiness = np.clip(-day_length_change * 50, 0, 100)

# Fat stores (build up before migration)
fat_stores = np.zeros(365)
# Pre-autumn migration: fat builds Aug-Sep (days 213-273)
for i in range(213, 274):
    fat_stores[i] = (i - 213) / 60 * 100
# Pre-spring migration: fat builds in Africa (not shown, set to arrival condition)
for i in range(60, 100):
    fat_stores[i] = (i - 60) / 40 * 100

fig, axes = plt.subplots(3, 1, figsize=(12, 9), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Day length
axes[0].set_facecolor('#111827')
axes[0].plot(days, day_length, color='#f59e0b', linewidth=2)
axes[0].set_ylabel('Day length (h)', color='white')
axes[0].set_title('Cuckoo Migration Timing Across the Year', color='white', fontsize=13)
axes[0].tick_params(colors='gray')

# Day length change rate
axes[1].set_facecolor('#111827')
axes[1].plot(days, day_length_change * 60, color='#3b82f6', linewidth=2)
axes[1].axhline(0, color='gray', linewidth=0.5)
axes[1].fill_between(days, day_length_change * 60, 0, where=day_length_change > 0, alpha=0.2, color='#22c55e', label='Lengthening (spring trigger)')
axes[1].fill_between(days, day_length_change * 60, 0, where=day_length_change < 0, alpha=0.2, color='#ef4444', label='Shortening (autumn trigger)')
axes[1].set_ylabel('Rate of change\\n(min/day)', color='white')
axes[1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
axes[1].tick_params(colors='gray')

# Migration windows
axes[2].set_facecolor('#111827')
axes[2].fill_between(days, spring_readiness, alpha=0.5, color='#22c55e', label='Spring arrival readiness')
axes[2].fill_between(days, autumn_readiness, alpha=0.5, color='#ef4444', label='Autumn departure readiness')
axes[2].axvspan(75, 105, alpha=0.2, color='#22c55e')
axes[2].axvspan(243, 273, alpha=0.2, color='#ef4444')
axes[2].text(90, 80, 'Arrives\\nMar-Apr', ha='center', color='#22c55e', fontsize=10, fontweight='bold')
axes[2].text(258, 80, 'Departs\\nSep-Oct', ha='center', color='#ef4444', fontsize=10, fontweight='bold')
axes[2].set_ylabel('Readiness (%)', color='white')
axes[2].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
axes[2].tick_params(colors='gray')

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
month_starts = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
axes[2].set_xticks(month_starts)
axes[2].set_xticklabels(months, color='gray', fontsize=8)

plt.tight_layout()
plt.show()

print("The cuckoo's annual cycle:")
print("  Mar-Apr: Arrives in Assam (triggered by lengthening days)")
print("  Apr-Jul: Breeding season (calls at dawn)")
print("  Sep-Oct: Departs for Africa (triggered by shortening days)")
print("  Oct-Feb: Winters in East Africa")`,
      challenge: 'Simulate climate change by shifting the "caterpillar peak" 14 days earlier (from day 105 to day 91). The cuckoo still arrives on day 90. Plot both and measure the mismatch.',
      successHint: 'Migration timing shows how circadian and circannual clocks work together across vastly different timescales — from the 24-hour dawn call to the 365-day migration cycle.',
    },
    {
      title: 'Jet lag — when your clock and the sun disagree',
      concept: `If you fly from Guwahati to London (a 5.5-hour time zone shift), your body arrives in London but your biological clock is still on Assam time. This mismatch is **jet lag** — and it's the most direct proof that biological clocks are real, internal mechanisms.

Symptoms of jet lag:
- **Insomnia** at local bedtime (your clock says it's afternoon)
- **Daytime sleepiness** (your clock says it's 3am)
- **Digestive problems** (your gut clock is out of sync)
- **Cognitive fog** (your alertness rhythm is misaligned)

Recovery rate: approximately **1 day per time zone crossed**. Flying east (losing time) is harder than flying west (gaining time) because it's easier to stay up late than to fall asleep early.

The reason jet lag takes days to resolve: each organ's clock resets at a different speed. The SCN (master clock) resets in 1-2 days, but the liver clock, gut clock, and muscle clocks take 4-7 days. During this transition, your organs are literally in different time zones.`,
      analogy: 'Jet lag is like a family where everyone has a different clock. Dad\'s watch says noon, Mom\'s says 3pm, the kids\' say 6pm. They can\'t coordinate meals, bedtimes, or activities until everyone\'s watch agrees. That resynchronization takes days — and it\'s uncomfortable.',
      storyConnection: 'The cuckoo calls at dawn wherever it is — but when it migrates from Africa to Assam, it crosses time zones. Birds actually experience a form of jet lag too. However, they travel slowly enough (days to weeks) that their clocks adjust gradually. Humans in airplanes don\'t have that luxury.',
      checkQuestion: 'Airline pilots and frequent flyers cross time zones constantly. What long-term health effects has research found in these populations?',
      checkAnswer: 'Chronic circadian disruption from frequent jet lag is associated with increased risk of cancer, cardiovascular disease, cognitive decline, and mood disorders. Flight attendants have higher rates of breast cancer than the general population. The WHO classifies shift work (chronic circadian disruption) as a probable carcinogen.',
      codeIntro: 'Simulate jet lag recovery after flying east across 8 time zones.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate jet lag: flying from India (GMT+5:30) to US East Coast (GMT-5)
# That's a 10.5 hour shift (westward)
time_zone_shift = -10.5  # hours (negative = westward)

days_after_arrival = np.arange(0, 11)

# Each organ re-entrains at a different rate
# SCN: fast (~1 day per TZ), Liver: medium, Gut: slow, Muscle: slowest
organs = {
    'SCN (master clock)': {'rate': 1.5, 'color': '#ef4444'},
    'Liver': {'rate': 0.8, 'color': '#f59e0b'},
    'Gut': {'rate': 0.6, 'color': '#22c55e'},
    'Muscle': {'rate': 0.5, 'color': '#3b82f6'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Organ re-entrainment
ax1.set_facecolor('#111827')
for organ, props in organs.items():
    # Exponential re-entrainment
    offset = time_zone_shift * np.exp(-props['rate'] * days_after_arrival / abs(time_zone_shift))
    ax1.plot(days_after_arrival, offset, 'o-', color=props['color'], linewidth=2, label=organ, markersize=5)

ax1.axhline(0, color='white', linestyle='--', linewidth=1, alpha=0.5, label='Fully adjusted')
ax1.set_xlabel('Days after arrival', color='white')
ax1.set_ylabel('Clock offset (hours from local time)', color='white')
ax1.set_title('Jet Lag Recovery: Each Organ Adjusts Differently', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Subjective well-being score
ax2.set_facecolor('#111827')
hours = np.linspace(0, 10, 100)

# Well-being based on inter-organ desynchrony
for day_h in hours:
    offsets = [time_zone_shift * np.exp(-props['rate'] * day_h / abs(time_zone_shift)) for props in organs.values()]
    desync = max(offsets) - min(offsets)  # max difference between organs

offsets_over_time = []
desync_over_time = []
wellbeing_over_time = []
for d in hours:
    offs = [time_zone_shift * np.exp(-props['rate'] * d / abs(time_zone_shift)) for props in organs.values()]
    desync = max(offs) - min(offs)
    offsets_over_time.append(np.mean(offs))
    desync_over_time.append(desync)
    wellbeing_over_time.append(max(0, 100 - desync * 15 - abs(np.mean(offs)) * 5))

ax2.plot(hours, wellbeing_over_time, color='#a855f7', linewidth=2.5, label='Overall well-being')
ax2.fill_between(hours, wellbeing_over_time, alpha=0.15, color='#a855f7')
ax2.set_xlabel('Days after arrival', color='white')
ax2.set_ylabel('Well-being score (%)', color='white')
ax2.set_title('Subjective Well-Being During Recovery', color='white', fontsize=12)

# Mark worst day
worst_day = hours[np.argmin(wellbeing_over_time)]
worst_score = min(wellbeing_over_time)
ax2.annotate(f'Worst: Day {worst_day:.1f}\\n({worst_score:.0f}%)', xy=(worst_day, worst_score),
             xytext=(worst_day + 2, worst_score + 20), color='#ef4444',
             arrowprops=dict(arrowstyle='->', color='#ef4444'), fontsize=10)

ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 100)

plt.tight_layout()
plt.show()

print("Jet lag is worst on days 1-3 — not because of the total offset,")
print("but because your organs are maximally OUT OF SYNC with each other.")
print()
print("Recovery strategy:")
print("  Day 1: Bright light at local morning, melatonin at local bedtime")
print("  Days 2-3: Eat meals at local times (resets liver clock)")
print("  Days 4-7: Exercise at local afternoon (resets muscle clock)")
print("  Full recovery: 7-10 days for a 10-hour shift")`,
      challenge: 'Change the shift to +5.5 hours (flying eastward, London to India). Eastward travel is harder — modify the recovery rates to be 20% slower. How much longer does recovery take?',
      successHint: 'Jet lag proves that your body runs on an internal clock, not just external cues. Understanding this has practical applications: optimizing travel recovery, designing shift work schedules, and treating sleep disorders.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior biology experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for biology simulations. Click to start.</p>
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}