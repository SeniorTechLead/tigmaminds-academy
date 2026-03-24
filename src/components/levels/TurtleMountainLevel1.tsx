import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function TurtleMountainLevel1() {
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
      title: 'Earth\'s structure — crust, mantle, core',
      concept: `In the Bodo creation tale, a great turtle carries the world on its back — the land resting on something immense and alive beneath. In reality, the Earth is not flat on a turtle, but it is layered like an egg:

- **Crust**: the thin outer shell we live on. Oceanic crust is ~7 km thick (basalt). Continental crust is ~35 km thick (granite). The thickest crust is under the Himalayas: ~70 km.
- **Mantle**: below the crust, down to 2,900 km. Solid rock that flows very slowly over millions of years (like very thick honey). Temperature: 500-4,000°C.
- **Outer core**: liquid iron and nickel, 2,900-5,150 km deep. Creates Earth's magnetic field through convection currents.
- **Inner core**: solid iron, 5,150-6,371 km. Temperature ~5,200°C (as hot as the Sun's surface), but so compressed it stays solid.

We have never drilled deeper than 12.3 km (the Kola Superdeep Borehole in Russia). Everything we know about deeper layers comes from **seismic waves** — vibrations from earthquakes that travel through the Earth and change speed at each layer boundary.`,
      analogy: 'The Earth is like a soft-boiled egg. The shell is the crust (thin, brittle, crackable). The white is the mantle (thick, deformable). The yolk is the core. Cut the egg in half and you see the layers — that is exactly how geologists draw cross-sections of the Earth.',
      storyConnection: 'The Bodo tale says the turtle shifts and the ground shakes. Replace "turtle" with "mantle convection" and the story is geologically accurate. The ground shakes because the layers beneath it are in constant, slow motion. The myth captured the essential truth: the earth beneath us is not still.',
      checkQuestion: 'If the inner core is hotter than the Sun\'s surface, why is it solid instead of liquid?',
      checkAnswer: 'Pressure. At the centre of the Earth, the weight of everything above compresses the iron so intensely that atoms are forced into a solid crystal structure despite the extreme heat. Melting point increases with pressure. The outer core is liquid because the pressure there is lower (less weight above it).',
      codeIntro: 'Visualize Earth\'s layered structure with accurate proportions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Cross-section of Earth
ax1.set_facecolor('#111827')
theta = np.linspace(0, 2 * np.pi, 200)

layers = [
    (6371, 'Inner core', '#ef4444', '5200°C, solid iron'),
    (5150, 'Outer core', '#f59e0b', '4000-5200°C, liquid iron'),
    (2900, 'Lower mantle', '#22c55e', '2000-4000°C, solid rock'),
    (660, 'Upper mantle', '#3b82f6', '500-2000°C, partially molten'),
    (35, 'Crust', '#a855f7', '0-500°C, rock we stand on'),
]

# Draw from inside out (reversed for proper layering)
for radius_km, name, color, desc in layers:
    scale = radius_km / 6371  # normalize to unit circle
    x = scale * np.cos(theta)
    y = scale * np.sin(theta)
    ax1.fill(x, y, color=color, alpha=0.6)
    # Label
    r_label = (radius_km / 6371) * 0.85 if radius_km > 1000 else 0.05
    ax1.text(r_label * 0.7, r_label * 0.3, f'{name}\n{radius_km}km',
             color='white', fontsize=7, ha='center', fontweight='bold')

ax1.set_aspect('equal')
ax1.set_title("Earth's Layers (cross-section)", color='white', fontsize=13)
ax1.set_xlim(-1.2, 1.2)
ax1.set_ylim(-1.2, 1.2)
ax1.axis('off')

# Temperature and pressure vs depth
ax2.set_facecolor('#111827')
depth = np.array([0, 35, 100, 660, 2900, 5150, 6371])
temp = np.array([15, 500, 1200, 2000, 3700, 5000, 5200])
pressure = np.array([0, 1, 3.5, 24, 136, 330, 360])  # GPa

ax2_temp = ax2
ax2_pres = ax2.twiny()

ax2_temp.plot(temp, depth, 'o-', color='#ef4444', linewidth=2, label='Temperature (°C)')
ax2_pres.plot(pressure, depth, 's-', color='#3b82f6', linewidth=2, label='Pressure (GPa)')

ax2_temp.set_ylabel('Depth (km)', color='white')
ax2_temp.set_xlabel('Temperature (°C)', color='#ef4444')
ax2_pres.set_xlabel('Pressure (GPa)', color='#3b82f6')
ax2_temp.invert_yaxis()
ax2_temp.set_title('Temperature & Pressure vs Depth', color='white', fontsize=13, pad=30)
ax2_temp.tick_params(colors='gray')
ax2_pres.tick_params(colors='gray')

# Layer boundaries
for d, name in [(35, 'Crust'), (660, 'Upper mantle'), (2900, 'Lower mantle'), (5150, 'Outer core')]:
    ax2_temp.axhline(d, color='gray', linestyle=':', linewidth=0.5)
    ax2_temp.text(100, d + 50, name, color='gray', fontsize=7)

plt.tight_layout()
plt.show()

print("Earth's layers by thickness:")
print(f"  Crust: ~35 km (0.5% of Earth's radius)")
print(f"  Upper mantle: 625 km")
print(f"  Lower mantle: 2,240 km (the thickest layer)")
print(f"  Outer core: 2,250 km")
print(f"  Inner core: 1,221 km")
print()
print("We live on the thinnest, coolest layer.")
print("Everything below is hotter than an oven.")`,
      challenge: 'The crust under the Himalayas is ~70 km thick (double the average). Add a marker for this on the depth plot. Why is the crust thicker under mountains?',
      successHint: 'Understanding Earth\'s layers is the foundation of geology. Every earthquake, volcano, and mountain range is a consequence of what happens in these layers.',
    },
    {
      title: 'Tectonic plates — the puzzle pieces of Earth\'s surface',
      concept: `The Earth's crust is not one solid shell — it is broken into **tectonic plates**, like a cracked eggshell. There are 7 major plates and many smaller ones, all floating on the semi-fluid upper mantle (asthenosphere).

The plates move at 2-15 cm per year — about the speed your fingernails grow. Over millions of years, this motion reshapes continents and oceans.

Three types of plate boundaries:
- **Divergent**: plates move apart. Magma rises to fill the gap, creating new crust (mid-ocean ridges, East African Rift).
- **Convergent**: plates push together. One slides under the other (subduction), or both crumple upward (mountain building).
- **Transform**: plates slide past each other horizontally. Builds up stress, then releases it as earthquakes (San Andreas Fault).

NE India sits where the **Indian Plate** collides with the **Eurasian Plate** and the **Burmese Plate**. This triple junction makes it one of the most seismically active regions on Earth. The 1897 Assam earthquake (magnitude 8.1) was one of the largest ever recorded.`,
      analogy: 'Tectonic plates are like lily pads floating on a pond. The pond is the mantle. Wind (convection currents) slowly pushes the pads around. When two pads collide, their edges crumple upward (mountains). When they pull apart, you see the water below (magma). NE India is where three lily pads are all crashing together.',
      storyConnection: 'The Bodo tale says when the turtle moves, the earth shakes and mountains rise. Plate tectonics says when plates move, earthquakes happen and mountains form. The turtle is the convecting mantle. The mountain on its back is the crust being pushed upward. Same story, different vocabulary.',
      checkQuestion: 'India was once attached to Africa (part of Gondwana). It broke away ~130 million years ago and drifted north at ~15 cm/year, crashing into Asia ~50 million years ago. This collision created the Himalayas. Are the Himalayas still growing?',
      checkAnswer: 'Yes. India is still pushing into Asia at about 5 cm/year. The Himalayas grow about 1 cm taller per year. But erosion (rain, ice, rivers) wears them down at roughly the same rate. The mountains are in a dynamic balance between tectonic uplift and erosive destruction.',
      codeIntro: 'Model the drift of the Indian plate from Gondwana to Asia over 130 million years.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified trajectory of India's northward drift
# From ~50°S to ~25°N over 130 million years
time_ma = np.linspace(130, 0, 200)  # million years ago

# Latitude (degrees north)
# Rapid drift from 130-50 Ma, then deceleration at collision
latitude = np.where(
    time_ma > 50,
    -50 + (130 - time_ma) * (75 / 80),   # fast: ~0.94°/Myr
    25 - time_ma * 0.0                      # slow after collision
)
# Smooth transition
latitude = -50 + 75 * (1 - np.exp(-0.03 * (130 - time_ma)))

# Speed (cm/year)
speed = np.gradient(-latitude, time_ma) * 111 * 100  # degrees to cm

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Latitude vs time
ax1.set_facecolor('#111827')
ax1.plot(time_ma, latitude, color='#f59e0b', linewidth=2)
ax1.axhline(0, color='gray', linestyle=':', linewidth=0.5)
ax1.axhline(25, color='#ef4444', linestyle='--', linewidth=1, label='Current position (~25°N)')
ax1.axvline(50, color='#22c55e', linestyle='--', linewidth=1, label='Collision with Asia (~50 Ma)')
ax1.fill_between(time_ma, latitude, -50, alpha=0.1, color='#f59e0b')
ax1.set_ylabel('Latitude (degrees)', color='white')
ax1.set_title("India's Northward Journey", color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.text(120, -45, 'Part of Gondwana\\n(near Antarctica)', color='gray', fontsize=9)
ax1.text(30, 20, 'Colliding with Asia\\n(Himalayas rising)', color='gray', fontsize=9)

# Speed vs time
ax2.set_facecolor('#111827')
ax2.plot(time_ma, np.abs(speed), color='#3b82f6', linewidth=2)
ax2.fill_between(time_ma, np.abs(speed), alpha=0.15, color='#3b82f6')
ax2.set_xlabel('Million years ago', color='white')
ax2.set_ylabel('Speed (cm/year)', color='white')
ax2.set_title('Plate Speed Over Time', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.axvline(50, color='#22c55e', linestyle='--', linewidth=1)

plt.tight_layout()
plt.show()

print("India's tectonic journey:")
print("  130 Ma: breaks away from Gondwana (near Antarctica)")
print("  100 Ma: crosses the equator")
print("  50 Ma: collides with Asia (Himalayas begin)")
print("  Today: still pushing north at ~5 cm/year")
print()
total_distance = 75 * 111  # degrees * km per degree
print(f"Total distance traveled: ~{total_distance:,} km")
print("That's farther than flying from London to Sydney!")`,
      challenge: 'Africa is currently splitting apart along the East African Rift at ~6 mm/year. How long until it splits completely (the rift is ~3000 km long and needs to open ~500 km)? Add this calculation.',
      successHint: 'Plate tectonics is the unifying theory of geology — it explains earthquakes, volcanoes, mountains, ocean basins, and the distribution of fossils. NE India sits at one of the most dynamic plate boundaries on Earth.',
    },
    {
      title: 'Earthquakes — when stress becomes motion',
      concept: `Tectonic plates do not slide smoothly past each other. Friction locks them together at their boundaries, and stress builds up over years or decades. When the stress exceeds the friction, the rocks break and slip — releasing energy as an **earthquake**.

The point underground where the rock breaks is the **focus** (or hypocentre). The point on the surface directly above is the **epicentre**.

Earthquake energy is released as **seismic waves**:
- **P-waves** (primary): compression waves, fastest, travel through solids and liquids
- **S-waves** (secondary): shear waves, slower, travel only through solids
- **Surface waves**: slowest but most destructive, ripple along the surface

The energy released is measured on the **Richter scale** (actually the moment magnitude scale, Mw). Each whole number increase represents ~32 times more energy:
- Mw 3: felt indoors, like a truck passing
- Mw 5: moderate damage to weak structures
- Mw 7: major destruction over a wide area
- Mw 9: catastrophic (2004 Indian Ocean, 2011 Japan)

NE India averages an earthquake above Mw 5 every year. The region is in **Seismic Zone V** — the highest risk category in India.`,
      analogy: 'An earthquake is like snapping a stick. You bend it slowly (stress builds at the plate boundary). Nothing happens for a while. Then suddenly — snap! The energy you put in gradually is released all at once. The bigger the stick (the longer the fault), the bigger the snap (the larger the earthquake).',
      storyConnection: 'When the Bodo turtle shifts its weight, the earth trembles. Geologically, when stress on a fault overcomes friction, the earth trembles. The turtle\'s "shifting" is the fault\'s "slipping." The mythology encoded the observation that earthquakes are sudden releases of gradually accumulated force.',
      checkQuestion: 'The 1950 Assam earthquake (Mw 8.6) was felt across all of NE India and beyond. Why are NE India earthquakes so powerful compared to, say, California?',
      checkAnswer: 'NE India sits at a continent-continent collision zone (Indian Plate pushing under the Eurasian and Burmese plates). Continental collisions involve thick, rigid crust that can lock over large areas and accumulate enormous stress. California\'s San Andreas Fault is a transform boundary — plates slide past, generating frequent but smaller quakes. Collision zones produce fewer but larger events.',
      codeIntro: 'Visualize the relationship between earthquake magnitude and energy release.',
      code: `import numpy as np
import matplotlib.pyplot as plt

magnitudes = np.arange(1, 10, 0.1)

# Energy in joules: log10(E) = 1.5 * M + 4.8
energy = 10 ** (1.5 * magnitudes + 4.8)

# Notable earthquakes
notable = {
    'Micro (felt by few)': 2,
    'Minor (felt indoors)': 3,
    'Light (shaking)': 4,
    'Moderate (damage)': 5,
    'Strong (serious)': 6,
    '1897 Assam': 8.1,
    '1950 Assam': 8.6,
    '2004 Indian Ocean': 9.1,
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Energy vs magnitude (log scale)
ax1.set_facecolor('#111827')
ax1.plot(magnitudes, energy, color='#ef4444', linewidth=2)
ax1.set_yscale('log')
ax1.set_xlabel('Magnitude (Mw)', color='white')
ax1.set_ylabel('Energy (Joules, log scale)', color='white')
ax1.set_title('Earthquake Energy vs Magnitude', color='white', fontsize=13)
ax1.tick_params(colors='gray')

colors_n = plt.cm.plasma(np.linspace(0.2, 0.9, len(notable)))
for (name, mag), c in zip(notable.items(), colors_n):
    e = 10 ** (1.5 * mag + 4.8)
    ax1.plot(mag, e, 'o', color=c, markersize=8)
    ax1.annotate(name, xy=(mag, e), xytext=(mag - 0.5, e * 5),
                 color=c, fontsize=7, fontweight='bold')

# Energy multiples (linear comparison)
ax2.set_facecolor('#111827')
ref_mag = 5
ref_energy = 10 ** (1.5 * ref_mag + 4.8)
compare_mags = [5, 6, 7, 8, 8.6, 9.1]
compare_names = ['Mw 5\\n(reference)', 'Mw 6', 'Mw 7', 'Mw 8', 'Mw 8.6\\n(1950 Assam)', 'Mw 9.1\\n(2004 tsunami)']
multiples = [10 ** (1.5 * (m - ref_mag)) for m in compare_mags]

bars = ax2.bar(compare_names, multiples, color=['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899'])
ax2.set_ylabel(f'Energy relative to Mw {ref_mag}', color='white')
ax2.set_title('How Energy Scales With Magnitude', color='white', fontsize=13)
ax2.set_yscale('log')
ax2.tick_params(colors='gray', labelsize=8)

for bar, mult in zip(bars, multiples):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() * 1.3,
             f'{mult:,.0f}x', ha='center', color='white', fontsize=9, fontweight='bold')

plt.tight_layout()
plt.show()

print("Energy scaling:")
for m, mult in zip(compare_mags, multiples):
    print(f"  Mw {m}: {mult:,.0f}x the energy of Mw 5")
print()
print("The 1950 Assam earthquake released as much energy as")
print(f"  {multiples[4]:,.0f} simultaneous Mw 5 earthquakes.")`,
      challenge: 'The Hiroshima atomic bomb released about 6.3 x 10^13 Joules. At what magnitude earthquake does the energy equal one Hiroshima bomb? Add a horizontal line for this.',
      successHint: 'The logarithmic nature of earthquake magnitude means our intuition fails. A magnitude 8 is not "slightly worse" than a magnitude 7 — it is 32 times more energetic. This is why major earthquakes are so devastatingly different from moderate ones.',
    },
    {
      title: 'Mountain formation — how the Himalayas rose',
      concept: `Mountains form through several processes, all driven by plate tectonics:

**Fold mountains** (Himalayas, Alps): two continental plates collide. Neither can subduct because continental crust is too buoyant. Instead, the crust crumples, folds, and thickens — like pushing a tablecloth from both sides. The Himalayas formed when India crashed into Asia ~50 million years ago.

**Volcanic mountains** (Mount Fuji, Cascades): oceanic plate subducts under continental plate. The sinking plate melts, and magma rises to form volcanoes.

**Block mountains** (Sierra Nevada): faults crack the crust and blocks are pushed up or down. Horsts (raised blocks) become mountains; grabens (dropped blocks) become valleys.

The Himalayas are the highest because the collision is still happening. Everest grows ~4 mm per year. But erosion from the monsoon rains is fierce — the Brahmaputra river carries more sediment than almost any river on Earth, grinding the mountains down as fast as they rise.

NE India's hills — Naga, Patkai, Khasi, Garo — are also products of the India-Asia collision, specifically the interaction with the Burmese plate.`,
      analogy: 'Mountain formation is like crumpling a piece of paper. Push from both sides (converging plates) and folds rise up (mountains). The harder and longer you push, the taller the folds. The paper is the crust. Your hands are the tectonic plates. The table it sits on is the mantle.',
      storyConnection: 'The Bodo tale says the turtle lifted the mountain from the ocean floor and placed it on the earth. In plate tectonics, the Indian plate literally carried ancient ocean-floor sediments northward and piled them into the Himalayas. Marine fossils found at the summit of Everest prove that the highest point on Earth was once at the bottom of the sea.',
      checkQuestion: 'If you could find a seashell fossil on the top of Mount Everest, what would it prove?',
      checkAnswer: 'That the rock at Everest\'s summit was once under the ocean. The Tethys Sea existed between India and Asia. When the plates collided, the sea floor was scraped up, folded, and pushed to the top of the growing mountain range. The seashell is physical proof of plate tectonics and continental collision.',
      codeIntro: 'Model the growth of the Himalayas over time, balancing uplift and erosion.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Mountain height over time: uplift vs erosion
time_ma = np.linspace(50, 0, 500)  # million years ago to present

# Uplift rate: started slow, accelerated as collision intensified
uplift_rate = 0.5 + 0.3 * np.exp(-0.02 * time_ma)  # mm/year

# Erosion rate: proportional to height (taller = more rain, steeper slopes)
# Solve: dH/dt = uplift - erosion_coeff * H
erosion_coeff = 0.00008  # per year
dt = (50 / 500) * 1e6  # time step in years

height = np.zeros_like(time_ma)
height[0] = 0

for i in range(1, len(time_ma)):
    uplift = uplift_rate[i] / 1000  # mm to metres
    erosion = erosion_coeff * height[i-1]
    height[i] = max(0, height[i-1] + (uplift - erosion) * dt)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Height over time
ax1.set_facecolor('#111827')
ax1.plot(time_ma, height / 1000, color='#f59e0b', linewidth=2, label='Mountain height')
ax1.axhline(8.849, color='#ef4444', linestyle='--', linewidth=1, label='Everest today (8,849m)')
ax1.fill_between(time_ma, height / 1000, alpha=0.15, color='#f59e0b')
ax1.set_ylabel('Height (km)', color='white')
ax1.set_title('Himalayan Mountain Growth Over 50 Million Years', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Key events
events = [(50, 'Collision begins'), (35, 'Rapid uplift'), (15, 'Monsoon intensifies'),
          (5, 'Modern glaciation'), (0, 'Today')]
for t, label in events:
    idx = np.argmin(np.abs(time_ma - t))
    ax1.plot(t, height[idx]/1000, 'o', color='#22c55e', markersize=6)
    ax1.annotate(label, xy=(t, height[idx]/1000), xytext=(t + 2, height[idx]/1000 + 0.5),
                 color='#22c55e', fontsize=8)

# Uplift vs erosion rates
ax2.set_facecolor('#111827')
erosion_rate_plot = erosion_coeff * height * 1000  # back to mm/year
ax2.plot(time_ma, uplift_rate, color='#3b82f6', linewidth=2, label='Uplift rate')
ax2.plot(time_ma, erosion_rate_plot, color='#ef4444', linewidth=2, label='Erosion rate')
ax2.fill_between(time_ma, uplift_rate, erosion_rate_plot,
                 where=uplift_rate > erosion_rate_plot, alpha=0.15, color='#3b82f6', label='Net growth')
ax2.fill_between(time_ma, uplift_rate, erosion_rate_plot,
                 where=uplift_rate < erosion_rate_plot, alpha=0.15, color='#ef4444', label='Net erosion')
ax2.set_xlabel('Million years ago', color='white')
ax2.set_ylabel('Rate (mm/year)', color='white')
ax2.set_title('Uplift vs Erosion: The Dynamic Balance', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The Himalayas are not static — they are a balance:")
print(f"  Current uplift: ~{uplift_rate[-1]:.1f} mm/year")
print(f"  Current erosion: ~{erosion_rate_plot[-1]:.1f} mm/year")
if uplift_rate[-1] > erosion_rate_plot[-1]:
    print("  Net: still growing (uplift > erosion)")
else:
    print("  Net: shrinking (erosion > uplift)")`,
      challenge: 'Increase the erosion coefficient to simulate heavier monsoon rainfall. At what value does the mountain height start to decrease in the present day?',
      successHint: 'Mountains are not permanent — they are a dynamic balance between the forces that build them up (tectonics) and the forces that tear them down (erosion). The Himalayas are young mountains, still growing, still fighting gravity and rain.',
    },
    {
      title: 'NE India\'s seismology — living on a fault zone',
      concept: `NE India is one of the most seismically active regions on Earth. It sits at the junction of three tectonic plates:
- **Indian Plate** (pushing north)
- **Eurasian Plate** (being pushed)
- **Burmese Plate** (subducting from the east)

Major historical earthquakes:
- **1897 Shillong** (Mw 8.1): one of the first great earthquakes to be scientifically studied. Destroyed most masonry buildings in the Shillong Plateau.
- **1950 Assam** (Mw 8.6): the largest earthquake in recorded history in the Indian subcontinent. Triggered massive landslides, changed the course of rivers.
- **1869 Cachar** (Mw 7.5), **1918 Srimangal** (Mw 7.6), **1947 Upper Assam** (Mw 7.7) — all major events.

The region has a "seismic gap" — areas along the plate boundary where stress has been accumulating for decades without a major release. Seismologists warn that a large earthquake (Mw 8+) is overdue.

The entire NE region falls under **Seismic Zone V** (the highest category) in India's seismic zoning map.`,
      analogy: 'NE India is like sitting at the corner of a very busy intersection where three trucks (tectonic plates) are slowly pushing together. The intersection is not wide enough for all three, so something has to give. The "giving" is an earthquake. The longer the trucks push without movement, the bigger the eventual crash.',
      storyConnection: 'The Bodo people placed a turtle beneath the earth to explain why it shakes. They lived in one of the most earthquake-prone regions on the planet and needed a story to make sense of the constant trembling. The turtle myth is an earthquake preparedness narrative: the earth is not stable; expect it to move.',
      checkQuestion: 'Seismologists talk about a "seismic gap" in NE India. What does this mean, and should people be worried?',
      checkAnswer: 'A seismic gap is a section of a fault that has not ruptured in a long time while adjacent sections have. Since stress continues to build, the gap is expected to rupture eventually — and the longer the wait, the larger the potential earthquake. Yes, people should be prepared. NE India\'s seismic gap suggests a major event is statistically overdue.',
      codeIntro: 'Map historical earthquakes in NE India and visualize the seismic gap.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Historical earthquakes in NE India (approximate lat, lon, magnitude, year)
quakes = [
    (25.1, 90.0, 8.1, 1897, 'Shillong'),
    (28.5, 96.7, 8.6, 1950, 'Assam'),
    (25.0, 93.0, 7.5, 1869, 'Cachar'),
    (24.5, 91.0, 7.6, 1918, 'Srimangal'),
    (28.0, 94.0, 7.7, 1947, 'Upper Assam'),
    (26.8, 94.2, 6.7, 2016, 'Manipur'),
    (27.3, 92.5, 6.9, 2011, 'Sikkim'),
    (26.7, 92.8, 5.8, 2009, 'Assam'),
]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Map of earthquakes
ax1.set_facecolor('#111827')
for lat, lon, mag, year, name in quakes:
    size = (mag - 4) ** 3 * 3  # scale point size by magnitude
    alpha = 0.7 if mag >= 7 else 0.4
    color = '#ef4444' if mag >= 8 else '#f59e0b' if mag >= 7 else '#22c55e'
    ax1.scatter(lon, lat, s=size, color=color, alpha=alpha, edgecolors='white', linewidth=0.5)
    ax1.annotate(f'{name}\\n{year} (M{mag})', xy=(lon, lat), xytext=(lon + 0.3, lat + 0.3),
                 color='white', fontsize=7)

# Approximate plate boundaries
ax1.plot([88, 97], [28, 29], 'w--', linewidth=1, alpha=0.3, label='Plate boundary (approx)')
ax1.plot([92, 96], [22, 28], 'w--', linewidth=1, alpha=0.3)

ax1.set_xlabel('Longitude (°E)', color='white')
ax1.set_ylabel('Latitude (°N)', color='white')
ax1.set_title('Historical Earthquakes in NE India', color='white', fontsize=13)
ax1.set_xlim(88, 98)
ax1.set_ylim(22, 30)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Magnitude timeline
ax2.set_facecolor('#111827')
years = [q[3] for q in quakes]
mags = [q[2] for q in quakes]
names = [q[4] for q in quakes]
colors = ['#ef4444' if m >= 8 else '#f59e0b' if m >= 7 else '#22c55e' for m in mags]
sizes = [(m - 4) ** 2 * 20 for m in mags]

ax2.scatter(years, mags, s=sizes, c=colors, alpha=0.8, edgecolors='white', linewidth=0.5)
for y, m, n in zip(years, mags, names):
    ax2.annotate(n, xy=(y, m), xytext=(y, m + 0.15), color='white', fontsize=8, ha='center')

# Highlight seismic gap (post-1950)
ax2.axvspan(1960, 2030, alpha=0.1, color='#ef4444')
ax2.text(1995, 8.8, 'Seismic gap\\n(no Mw 8+ since 1950)', color='#ef4444', fontsize=9, ha='center')

ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Magnitude (Mw)', color='white')
ax2.set_title('Earthquake Timeline', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.set_ylim(5, 9.5)

plt.tight_layout()
plt.show()

print("NE India seismic summary:")
print("  Total Mw 7+ events since 1869: 5")
print("  Last Mw 8+ event: 1950 (75+ years ago)")
print("  Seismic zone: V (highest risk in India)")
print("  Plates involved: Indian, Eurasian, Burmese")
print()
print("The seismic gap is a warning, not a prediction.")
print("We know stress is building. We don't know exactly when it will release.")`,
      challenge: 'Calculate the average return period for Mw 7+ earthquakes in NE India using the data above. If the last one was in 1950, how "overdue" might the next one be?',
      successHint: 'NE India\'s seismicity is not abstract geology — it is a daily reality for the people who live there. Understanding the science is the first step toward preparedness.',
    },
    {
      title: 'Earthquake preparedness — engineering safety',
      concept: `We cannot predict earthquakes precisely (when, where, how big). But we can **prepare** — and preparation saves lives.

**Building design**:
- Use reinforced concrete with steel rebar (resists both compression and tension)
- Add shear walls (resist horizontal forces)
- Use base isolation (building sits on rubber/sliding pads that absorb shaking)
- Avoid "soft stories" (open ground floors with no walls — common in NE India)

**Personal preparedness**:
- **Drop, Cover, Hold On**: during shaking, drop to the ground, take cover under a sturdy desk/table, hold on to it
- Prepare an emergency kit: water, food, flashlight, first aid, documents
- Identify safe spots in every room (away from windows, heavy objects, exterior walls)
- Practice earthquake drills regularly

**Community preparedness**:
- Enforce building codes (India's IS 1893 code specifies design requirements for each seismic zone)
- Plan evacuation routes
- Build earthquake-resistant schools and hospitals (priority structures)

The 2015 Nepal earthquake (Mw 7.8) killed 9,000 people — mostly due to building collapse. In Japan, a Mw 9.0 earthquake in 2011 killed far fewer from shaking (most deaths were from the tsunami) because Japanese buildings are engineered for earthquakes.`,
      analogy: 'Earthquake preparedness is like wearing a seatbelt. You cannot prevent a car crash, but you can dramatically improve your odds of surviving one. Building codes are the seatbelt for houses. Earthquake drills are the seatbelt for people. The effort is small; the payoff is survival.',
      storyConnection: 'The Bodo people knew the turtle would move — they expected earthquakes. This expectation is the first step of preparedness: acknowledging the risk. Modern earthquake science replaces the turtle with plate tectonics, but the core message is the same — the ground will shake, so build and plan accordingly.',
      checkQuestion: 'Many homes in NE India have open ground floors (shops, parking) with heavier upper floors. Why is this dangerous in an earthquake?',
      checkAnswer: 'This is a "soft story" structure. The open ground floor has much less stiffness and strength than the upper floors. During an earthquake, the ground floor collapses while the upper floors drop intact. It is the most common cause of building failure in earthquakes. The fix: add shear walls or bracing to the ground floor.',
      codeIntro: 'Compare building response to earthquake shaking: rigid vs. base-isolated structures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate earthquake ground motion (simplified sinusoidal + noise)
time = np.linspace(0, 20, 2000)  # 20 seconds
dt = time[1] - time[0]

# Ground acceleration (simplified earthquake signal)
freq_main = 2.0  # Hz (typical for moderate earthquake)
ground_accel = (0.3 * np.sin(2 * np.pi * freq_main * time) *
                np.exp(-0.1 * np.abs(time - 5)))  # peak at t=5
ground_accel += 0.1 * np.random.randn(len(time))  # noise
ground_accel *= (time > 2) * (time < 15)  # earthquake duration

# Building response: simple harmonic oscillator
# Rigid building (high natural frequency, low damping)
def building_response(ground_accel, dt, natural_freq, damping_ratio):
    omega = 2 * np.pi * natural_freq
    displacement = np.zeros_like(ground_accel)
    velocity = np.zeros_like(ground_accel)
    for i in range(1, len(ground_accel)):
        a = -omega**2 * displacement[i-1] - 2 * damping_ratio * omega * velocity[i-1] - ground_accel[i]
        velocity[i] = velocity[i-1] + a * dt
        displacement[i] = displacement[i-1] + velocity[i] * dt
    return displacement

rigid_resp = building_response(ground_accel, dt, 3.0, 0.02)   # rigid: high freq, low damping
isolated_resp = building_response(ground_accel, dt, 0.5, 0.15)  # base-isolated: low freq, high damping

fig, axes = plt.subplots(3, 1, figsize=(12, 9), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Ground motion
axes[0].set_facecolor('#111827')
axes[0].plot(time, ground_accel, color='#f59e0b', linewidth=1)
axes[0].fill_between(time, ground_accel, alpha=0.2, color='#f59e0b')
axes[0].set_ylabel('Ground accel (g)', color='white')
axes[0].set_title('Earthquake Ground Motion', color='white', fontsize=13)
axes[0].tick_params(colors='gray')

# Rigid building
axes[1].set_facecolor('#111827')
axes[1].plot(time, rigid_resp * 100, color='#ef4444', linewidth=1)
axes[1].fill_between(time, rigid_resp * 100, alpha=0.2, color='#ef4444')
axes[1].set_ylabel('Displacement (cm)', color='white')
axes[1].set_title(f'Rigid Building (peak: {np.max(np.abs(rigid_resp))*100:.1f} cm)', color='#ef4444', fontsize=11)
axes[1].tick_params(colors='gray')

# Base-isolated building
axes[2].set_facecolor('#111827')
axes[2].plot(time, isolated_resp * 100, color='#22c55e', linewidth=1)
axes[2].fill_between(time, isolated_resp * 100, alpha=0.2, color='#22c55e')
axes[2].set_ylabel('Displacement (cm)', color='white')
axes[2].set_xlabel('Time (seconds)', color='white')
axes[2].set_title(f'Base-Isolated Building (peak: {np.max(np.abs(isolated_resp))*100:.1f} cm)', color='#22c55e', fontsize=11)
axes[2].tick_params(colors='gray')

plt.tight_layout()
plt.show()

reduction = (1 - np.max(np.abs(isolated_resp)) / np.max(np.abs(rigid_resp))) * 100
print("Results:")
print(f"  Rigid building peak displacement: {np.max(np.abs(rigid_resp))*100:.1f} cm")
print(f"  Base-isolated building peak: {np.max(np.abs(isolated_resp))*100:.1f} cm")
print(f"  Reduction: {reduction:.0f}%")
print()
print("Base isolation works by making the building 'flexible'.")
print("The isolators absorb the earthquake energy instead of")
print("transmitting it to the structure above.")
print()
print("This technology is used in hospitals, data centres, and")
print("historic buildings in earthquake-prone areas.")`,
      challenge: 'Change the damping ratio of the base-isolated building from 0.15 to 0.30. Some modern isolators achieve this. How much more does it reduce displacement?',
      successHint: 'Earthquake preparedness is applied physics. Understanding how buildings respond to shaking — and how to engineer that response — is the difference between survival and catastrophe. For NE India, this is not theoretical; it is urgent.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior geology experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for geology simulations. Click to start.</p>
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