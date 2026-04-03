import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import BabelSkyscraperDiagram from '../diagrams/BabelSkyscraperDiagram';
import BabelBucklingDiagram from '../diagrams/BabelBucklingDiagram';

export default function BabelLevel3() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Finite element analysis — breaking a tower into pieces',
      concept: `Real structural engineers do not calculate forces for an entire building at once. They divide the structure into thousands of small **elements** (triangles, rectangles, tetrahedra) and solve the force equations for each one. This is **Finite Element Analysis (FEA)**.

Each element has nodes (corner points). The stiffness of each element is encoded in a **stiffness matrix**. When you assemble all element matrices into one giant system, you get: **K × u = F** — where K is the global stiffness matrix, u is the displacement vector, and F is the force vector.

Solving this matrix equation gives you the displacement of every node, from which you calculate stress and strain everywhere in the structure.

The code implements a simple 1D FEA for a column under load.`,
      analogy: 'Imagine predicting traffic flow for a whole city. Impossible as one problem. But divide the city into blocks, model each intersection, and connect them — suddenly it is solvable. FEA does the same for structures: divide, solve locally, assemble globally.',
      storyConnection: 'If the Babel builders had FEA, they could have predicted exactly which bricks would crack first, where the tower would buckle, and how wind would stress the upper sections. They would have known their design was doomed before laying a single brick.',
      checkQuestion: 'Why do FEA models use triangles rather than squares for meshing?',
      checkAnswer: 'Triangles can approximate any shape (curved surfaces, corners, holes) because three points always define a plane. Squares require four coplanar points, which is harder to guarantee on complex geometry. Triangles also handle stress concentrations better because they can be made very small near critical areas (adaptive meshing).',
      codeIntro: 'Build a simple 1D finite element model of a tower column.',
      code: `import numpy as np

# 1D FEA: Column divided into elements
# Each element is a segment of the column

n_elements = 10
height = 100  # metres
element_length = height / n_elements
area = 4.0    # m² cross-section
E = 2e9       # Young's modulus (mud brick, Pa)
density = 1800  # kg/m³
g = 9.8

n_nodes = n_elements + 1

# Global stiffness matrix (tridiagonal)
K = np.zeros((n_nodes, n_nodes))
for i in range(n_elements):
    k_e = E * area / element_length  # element stiffness
    K[i, i] += k_e
    K[i, i+1] -= k_e
    K[i+1, i] -= k_e
    K[i+1, i+1] += k_e

# Force vector: self-weight at each node
F = np.zeros(n_nodes)
element_weight = density * area * element_length * g
for i in range(n_elements):
    F[i] += element_weight / 2
    F[i+1] += element_weight / 2

# Boundary condition: bottom node is fixed (u[0] = 0)
# Remove first row/col and solve
K_reduced = K[1:, 1:]
F_reduced = F[1:]
u = np.zeros(n_nodes)
u[1:] = np.linalg.solve(K_reduced, F_reduced)

# Stress in each element
stresses = np.zeros(n_elements)
for i in range(n_elements):
    strain = (u[i+1] - u[i]) / element_length
    stresses[i] = E * abs(strain) / 1e6  # MPa

# Results
heights_nodes = np.linspace(0, height, n_nodes)
heights_elements = np.linspace(element_length/2, height - element_length/2, n_elements)

print("1D Finite Element Analysis: Tower Column")
print("=" * 50)
print(f"Elements: {n_elements}, Height: {height}m")
print(f"Material: Mud brick (E={E/1e9:.0f} GPa)")
print()
print(f"{'Element':>8s} {'Height(m)':>10s} {'Stress(MPa)':>12s} {'Status':>10s}")
for i in range(n_elements):
    status = "OK" if stresses[i] < 2.0 else "FAILED!"
    print(f"{i+1:>8d} {heights_elements[i]:>10.1f} {stresses[i]:>12.3f} {status:>10s}")

print(f"\\nMax compression at base: {u[-1]*1000:.2f} mm")
print(f"Max stress: {max(stresses):.3f} MPa (limit: 2.0 MPa)")
if max(stresses) > 2.0:
    print("TOWER FAILS — base bricks are crushed!")
else:
    print(f"Safety margin: {(2.0 - max(stresses))/2.0*100:.1f}%")`,
      challenge: 'Increase n_elements to 50 for a finer mesh. Does the maximum stress change? Try height = 200 and see which elements fail first. This is the power of FEA — precise failure prediction.',
      successHint: 'FEA is the foundation of all modern structural design. Every skyscraper, bridge, aircraft, and car is simulated with FEA before a single piece is manufactured. The K×u=F equation governs all of it.',
    },
    {
      title: 'Truss analysis — the triangle as structural unit',
      concept: `A **truss** is a structure made entirely of triangles connected at joints (called nodes). Trusses are extraordinarily efficient because every member is in either pure tension or pure compression — no bending.

Why triangles? Because a triangle is the only polygon that **cannot deform** without changing the length of its sides. A square frame can be squashed into a parallelogram. A pentagon can be deformed in multiple ways. But push on a triangle and nothing moves — it is inherently rigid.

The method of joints uses equilibrium at each node: ΣFx = 0, ΣFy = 0. Every node has two equations, so a truss with N nodes gives 2N equations for the unknown member forces.

The code solves a simple truss and identifies which members are in tension and which are in compression.`,
      analogy: 'A chain-link fence is flexible because each quadrilateral can deform. But a geodesic dome (made of triangles) is rigid. The difference is geometry, not material. Triangles lock forces into pure push-pull along their members, eliminating the weak bending mode.',
      storyConnection: 'Ancient builders used post-and-lintel construction (vertical columns + horizontal beams) — which wastes material because beams must resist bending. If the Babel builders had discovered the truss (Rome did, later), they could have built lighter, taller, and more efficiently.',
      checkQuestion: 'The Eiffel Tower is essentially a giant truss — 99.3% air, 0.7% iron. How can something so empty be so strong?',
      checkAnswer: 'Because every iron member is in either pure tension or pure compression — no bending. The triangulated lattice distributes loads so efficiently that very little material is needed. If you melted the entire Eiffel Tower (7,300 tonnes of iron) into a flat plate the size of its 125m × 125m base, it would be only 6 cm thick.',
      codeIntro: 'Solve forces in a simple truss structure.',
      code: `import numpy as np

# Simple 4-node truss (two triangles)
#   2---3
#   |\ /|
#   | X |
#   |/ \\|
#   0---1  (0,1 are fixed to ground)

# Node coordinates (x, y) in metres
nodes = np.array([
    [0, 0],    # 0: bottom-left (fixed)
    [4, 0],    # 1: bottom-right (fixed)
    [0, 3],    # 2: top-left
    [4, 3],    # 3: top-right
])

# Elements: [node_i, node_j]
elements = [
    (0, 1),  # bottom
    (0, 2),  # left
    (1, 3),  # right
    (2, 3),  # top
    (0, 3),  # diagonal 1
    (1, 2),  # diagonal 2
]

# Applied load: 10 kN downward on node 2
load_node = 2
load_force = -50000  # Newtons (downward)

# Calculate member lengths and angles
print("Truss Analysis: 4-Node, 6-Member Structure")
print("=" * 55)
print(f"\\nLoad: {abs(load_force)/1000:.0f} kN downward on node {load_node}")
print()

print(f"{'Member':>8s} {'Nodes':>8s} {'Length(m)':>10s} {'Angle(deg)':>11s}")
for i, (n1, n2) in enumerate(elements):
    dx = nodes[n2][0] - nodes[n1][0]
    dy = nodes[n2][1] - nodes[n1][1]
    length = np.sqrt(dx**2 + dy**2)
    angle = np.degrees(np.arctan2(dy, dx))
    print(f"{i+1:>8d} {n1}-{n2:>5s} {length:>10.2f} {angle:>11.1f}")

# Simplified force analysis using method of joints
# For this symmetric structure with vertical load:
print()
print("Member Forces (method of joints):")
print(f"{'Member':>8s} {'Force(kN)':>10s} {'Type':>12s}")

# Approximate solution for this specific geometry
forces = {
    "0-1": 0,
    "0-2": 25.0,      # compression
    "1-3": 25.0,      # compression
    "2-3": -33.3,     # tension
    "0-3": -41.7,     # tension (diagonal)
    "1-2": 41.7,      # compression (diagonal)
}

for member, force in forces.items():
    force_type = "COMPRESSION" if force >= 0 else "TENSION"
    symbol = "<<< >>>" if force >= 0 else ">>> <<<"
    print(f"  {member:>6s} {abs(force):>10.1f} {force_type:>12s} {symbol}")

print()
print("Key insight: EVERY member is in pure tension or compression.")
print("No bending anywhere — this is why trusses are so efficient.")
print("The diagonals carry the largest forces (longest load path).")`,
      challenge: 'What happens if you remove the diagonals (members 0-3 and 1-2)? The structure becomes a rectangle and collapses — it has zero stiffness against lateral loads. Try calculating: 4 nodes × 2 equations = 8 unknowns, but only 4 members + 4 reactions = 8. Exactly determinate with diagonals; indeterminate without them.',
      successHint: 'Truss analysis is elegant: pure geometry + equilibrium = every force in the structure. No calculus, no differential equations — just F=0 at every joint. This is why engineers love trusses.',
    },
    {
      title: 'Earthquake resistance — dynamic structural analysis',
      concept: `A building is not just loaded by static forces (gravity, wind). **Earthquakes** shake the ground beneath the foundation, sending waves of acceleration through the structure. The building must absorb this energy without collapsing.

The key concept is **natural frequency**. Every structure vibrates at specific frequencies when disturbed — like a tuning fork. If an earthquake’s frequency matches the building’s natural frequency, **resonance** occurs and motion is amplified enormously.

Taller buildings have lower natural frequencies (they sway slowly). Short buildings have higher frequencies (they vibrate quickly). An earthquake with period ~1 second resonates with 10-storey buildings. Period ~3 seconds resonates with 30-storey buildings.

The code models a building as a mass-spring system and simulates its response to earthquake ground motion.`,
      analogy: 'Push a child on a swing at the right rhythm (matching its natural frequency) and the swing goes higher and higher. Push at the wrong rhythm and nothing happens. Earthquakes "push" buildings — and if the push matches the building’s swing frequency, disaster follows.',
      storyConnection: 'The Tower of Babel sat in Mesopotamia — an active seismic zone near the boundary of the Arabian and Eurasian tectonic plates. A mud brick tower with no earthquake resistance would not survive even a moderate tremor. The 2003 Bam earthquake in Iran (magnitude 6.6) destroyed nearly every mud brick building in the city.',
      checkQuestion: 'The 2011 Tōhoku earthquake produced waves that shook Tokyo skyscrapers for over 5 minutes — some swayed 3 metres at the top. Why did they not collapse?',
      checkAnswer: 'Japanese skyscrapers are specifically designed for earthquake flexibility. They have steel frames that can deform elastically (bend without breaking), base isolation systems (rubber bearings that decouple the building from ground motion), and tuned mass dampers. The 3-metre sway was within design limits — the buildings absorbed the energy by moving, rather than resisting and cracking.',
      codeIntro: 'Simulate a building’s response to earthquake ground acceleration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Building as single-degree-of-freedom oscillator
# m*a + c*v + k*x = -m*ag (earthquake ground acceleration)

mass = 1e6       # kg (building mass)
k = 4e6          # N/m (stiffness)
damping = 0.05   # damping ratio (5% typical for buildings)
c = 2 * damping * np.sqrt(k * mass)  # damping coefficient

# Natural frequency
f_n = np.sqrt(k / mass) / (2 * np.pi)
T_n = 1 / f_n
print(f"Building natural frequency: {f_n:.2f} Hz (period: {T_n:.2f} s)")

# Simulate earthquake: combination of frequencies
dt = 0.01   # time step
t = np.arange(0, 30, dt)

# Ground acceleration (simplified earthquake signal)
ag = (0.3 * np.sin(2 * np.pi * 0.5 * t) +
      0.2 * np.sin(2 * np.pi * f_n * t) +  # resonant component!
      0.1 * np.sin(2 * np.pi * 2 * t))
ag *= np.exp(-t / 10)  # earthquake decays over time
ag *= 9.8  # convert to m/s²

# Newmark-beta integration
x = np.zeros(len(t))
v = np.zeros(len(t))
a = np.zeros(len(t))
a[0] = (-mass * ag[0] - c * v[0] - k * x[0]) / mass

for i in range(len(t) - 1):
    # Predict
    x[i+1] = x[i] + v[i]*dt + 0.5*a[i]*dt**2
    v_pred = v[i] + a[i]*dt
    # Correct
    a[i+1] = (-mass*ag[i+1] - c*v_pred - k*x[i+1]) / mass
    v[i+1] = v[i] + 0.5*(a[i] + a[i+1])*dt

fig, axes = plt.subplots(3, 1, figsize=(12, 8), sharex=True)

axes[0].plot(t, ag/9.8, color='#ef4444', linewidth=1)
axes[0].set_ylabel('Ground Accel (g)', fontsize=11)
axes[0].set_title('Earthquake Response of a Building', fontsize=13)
axes[0].grid(alpha=0.3)

axes[1].plot(t, x * 100, color='#60a5fa', linewidth=1.5)
axes[1].set_ylabel('Displacement (cm)', fontsize=11)
axes[1].grid(alpha=0.3)

axes[2].plot(t, v, color='#22c55e', linewidth=1)
axes[2].set_ylabel('Velocity (m/s)', fontsize=11)
axes[2].set_xlabel('Time (s)', fontsize=11)
axes[2].grid(alpha=0.3)

plt.tight_layout()
plt.show()

print(f"Max displacement: {max(abs(x))*100:.1f} cm")
print(f"Max velocity: {max(abs(v)):.2f} m/s")
print(f"Max floor acceleration: {max(abs(a))/9.8:.2f} g")`,
      challenge: 'Remove the resonant component from the earthquake signal (delete the line with f_n). How much does the max displacement decrease? This shows how dangerous resonance is — even a small resonant component causes massive amplification.',
      successHint: 'Dynamic analysis is essential for any structure in a seismic zone. The natural frequency determines which earthquakes are dangerous. Tuning your building’s frequency away from common earthquake frequencies is the first line of defence.',
    },
    {
      title: 'Reinforced concrete — the material that changed everything',
      concept: `The single most important structural invention since the wheel: **reinforced concrete**. Take concrete (strong in compression, weak in tension) and embed steel bars (strong in tension). The result is a composite material that handles ALL three force types.

When a beam bends, the top is compressed and the bottom is stretched (tension). Plain concrete cracks on the bottom. But if steel rebar runs through the tension zone, the steel catches the tensile force and the beam holds.

The placement of rebar is critical. It must go where tension occurs — the bottom of beams, the outer face of columns under wind load, and in diagonal patterns to resist shear. Getting this wrong is catastrophic.

The code calculates the required rebar for a concrete beam under load.`,
      analogy: 'Concrete is like a strong but brittle person who can push but cannot pull. Steel rebar is like a flexible friend who can pull but tends to buckle. Together they are an unbeatable team — concrete provides the compression strength and prevents the steel from buckling, while steel provides the tension strength that concrete lacks.',
      storyConnection: 'If the Babel builders had reinforced concrete (invented in 1849 by Joseph Monier), they could have built far taller with far less material. The Burj Khalifa uses 330,000 m³ of reinforced concrete — the concrete resists the enormous compressive load of 828 metres, while the embedded steel handles the wind-induced tension.',
      checkQuestion: 'Why does rebar have a ridged surface instead of being smooth?',
      checkAnswer: 'The ridges create mechanical interlocking (bond) between the steel and concrete. A smooth bar would slip through the concrete under load, defeating the purpose. The ridges ensure that when the concrete tries to stretch, it drags the rebar along with it, and vice versa. This bond is essential — reinforced concrete only works if the two materials deform together.',
      codeIntro: 'Design rebar placement for a concrete beam under load.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Beam design: simply-supported beam with uniform load
span = 6.0         # metres
width = 0.3        # beam width (m)
depth = 0.5        # beam total depth (m)
load = 20000       # N/m (uniform distributed load)
f_c = 30e6         # concrete compressive strength (Pa)
f_y = 400e6        # steel yield strength (Pa)

# Maximum bending moment (at midspan)
M_max = load * span**2 / 8
print(f"Beam: {span}m span, {width}m x {depth}m")
print(f"Load: {load/1000:.0f} kN/m")
print(f"Max bending moment: {M_max/1000:.1f} kN·m")

# Required effective depth
# M = 0.87 * f_y * A_s * (d - 0.5 * A_s * f_y / (0.85 * f_c * width))
# Simplified: A_s = M / (0.87 * f_y * 0.9 * d)
d = depth - 0.05  # effective depth (cover = 50mm)
A_s = M_max / (0.87 * f_y * 0.9 * d)
A_s_cm2 = A_s * 1e4

# Number of bars needed
bar_diameters = [12, 16, 20, 25]  # mm
print(f"\\nRequired steel area: {A_s_cm2:.2f} cm²")
print(f"\\nBar options:")
for d_bar in bar_diameters:
    area_per_bar = np.pi * (d_bar/1000)**2 / 4
    n_bars = int(np.ceil(A_s / area_per_bar))
    actual_area = n_bars * area_per_bar * 1e4
    print(f"  {n_bars} x ø{d_bar}mm bars = {actual_area:.2f} cm²")

# Stress distribution plot
y = np.linspace(-depth/2, depth/2, 100)
# Linear stress distribution (compression at top, tension at bottom)
stress = -M_max * y / (width * depth**3 / 12) / 1e6

fig, ax = plt.subplots(figsize=(8, 6))
ax.plot(stress, y * 100, linewidth=2.5, color='#60a5fa')
ax.fill_betweenx(y * 100, 0, stress,
                  where=(stress < 0), alpha=0.2, color='#ef4444',
                  label='Compression (concrete)')
ax.fill_betweenx(y * 100, 0, stress,
                  where=(stress > 0), alpha=0.2, color='#60a5fa',
                  label='Tension (steel rebar)')
ax.axhline(0, color='white', linewidth=0.5, linestyle=':')
ax.axvline(0, color='white', linewidth=0.5, linestyle=':')

# Mark rebar position
ax.scatter([stress[-5]], [y[-5]*100], color='#fbbf24', s=100, zorder=5,
           label='Rebar position')

ax.set_xlabel('Stress (MPa)', fontsize=12)
ax.set_ylabel('Height in beam (cm)', fontsize=12)
ax.set_title('Stress Distribution in a Reinforced Concrete Beam', fontsize=13)
ax.legend(fontsize=10)
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()

print("\\nTop of beam: COMPRESSION (concrete handles this)")
print("Bottom of beam: TENSION (steel rebar handles this)")
print("Neutral axis: zero stress (middle of beam)")`,
      challenge: 'Double the load to 40,000 N/m. How much more steel is needed? What if you also increase beam depth to 0.6 m? Deeper beams need less steel — this is the depth-vs-reinforcement trade-off that engineers optimise.',
      successHint: 'Reinforced concrete is the most widely used construction material on Earth. Over 10 billion tonnes are poured annually. Understanding how concrete and steel work together is the single most important skill in structural engineering.',
    },
    {
      title: 'Syntax trees — the hidden structure of language',
      concept: `Every sentence has a **tree structure** that determines its meaning. "The dog bit the man" and "The man bit the dog" use the same words but have different trees — the subject and object swap positions.

Linguists represent this with **syntax trees** (parse trees). A sentence (S) divides into a Noun Phrase (NP) and a Verb Phrase (VP). The VP may contain a verb and another NP. This is **recursive** — phrases contain other phrases, just like fractals.

The revolutionary insight of **Noam Chomsky** (1957): all human languages share a common deep structure (Universal Grammar), even though surface forms vary enormously. English puts verbs before objects (SVO): "I eat rice." Hindi puts verbs last (SOV): "Main chawal khata hun."

The code parses sentences into tree structures and detects the word order type.`,
      analogy: 'A sentence is like a Russian nesting doll. The outermost doll is the sentence. Open it and you find two dolls: a noun phrase and a verb phrase. Open the verb phrase and you find a verb and another noun phrase. Open that noun phrase and you find a determiner and a noun. Every language uses the same nesting pattern — only the order of dolls changes.',
      storyConnection: 'The "confusion of tongues" at Babel might represent the divergence of word order systems. Proto-languages may have had one dominant word order (possibly SOV, the most common type today). As groups separated, different communities settled on different orders: SVO in Europe, SOV in South Asia, VSO in Celtic and Polynesian languages.',
      checkQuestion: 'The sentence "I saw the man with the telescope" is ambiguous. Why?',
      checkAnswer: 'It has two valid parse trees. Tree 1: [I] [saw [the man] [with the telescope]] — I used a telescope to see him. Tree 2: [I] [saw [the man [with the telescope]]] — I saw a man who had a telescope. The words are identical; only the tree structure differs. This is called structural ambiguity, and it is a major challenge for NLP systems.',
      codeIntro: 'Parse sentences into syntax trees and classify word order types.',
      code: `# Simple recursive-descent parser for English sentences

def parse_sentence(words):
    """Parse a simple sentence into a tree structure."""
    tree = {"type": "S", "children": []}
    i = 0

    # Try to find NP (determiner + adjectives + noun)
    np_node = {"type": "NP", "children": []}
    if i < len(words) and words[i] in ("the", "a", "an", "this", "that"):
        np_node["children"].append({"type": "Det", "word": words[i]})
        i += 1
    while i < len(words) and words[i] in ("big", "small", "old", "red", "tall"):
        np_node["children"].append({"type": "Adj", "word": words[i]})
        i += 1
    if i < len(words) and words[i] not in ("is", "was", "runs", "sits", "built", "saw", "ate"):
        np_node["children"].append({"type": "N", "word": words[i]})
        i += 1

    if np_node["children"]:
        tree["children"].append(np_node)

    # Try to find VP (verb + optional NP)
    vp_node = {"type": "VP", "children": []}
    if i < len(words):
        vp_node["children"].append({"type": "V", "word": words[i]})
        i += 1

    # Object NP
    obj_np = {"type": "NP", "children": []}
    if i < len(words) and words[i] in ("the", "a", "an"):
        obj_np["children"].append({"type": "Det", "word": words[i]})
        i += 1
    while i < len(words) and words[i] in ("big", "small", "old", "red", "tall"):
        obj_np["children"].append({"type": "Adj", "word": words[i]})
        i += 1
    if i < len(words):
        obj_np["children"].append({"type": "N", "word": words[i]})
        i += 1
    if obj_np["children"]:
        vp_node["children"].append(obj_np)

    if vp_node["children"]:
        tree["children"].append(vp_node)

    return tree

def print_tree(node, indent=0):
    """Pretty-print a parse tree."""
    prefix = "  " * indent
    if "word" in node:
        print(f"{prefix}[{node['type']}] {node['word']}")
    else:
        print(f"{prefix}[{node['type']}]")
        for child in node.get("children", []):
            print_tree(child, indent + 1)

# Parse example sentences
sentences = [
    "the tall tower reached the sky",
    "the builders built a big tower",
    "the old man saw the red bird",
]

for sent in sentences:
    print(f"Sentence: '{sent}'")
    tree = parse_sentence(sent.split())
    print_tree(tree)
    print()

# Word order classification
print("Word Order Types in World Languages:")
print("=" * 50)
word_orders = {
    "SOV (Subject-Object-Verb)": ["Hindi", "Japanese", "Korean", "Turkish", "Latin"],
    "SVO (Subject-Verb-Object)": ["English", "French", "Mandarin", "Russian", "Swahili"],
    "VSO (Verb-Subject-Object)": ["Arabic", "Irish", "Hawaiian", "Tagalog"],
    "VOS (Verb-Object-Subject)": ["Malagasy", "Fijian"],
    "Free order":               ["Warlpiri", "Latin (flexible)"],
}
for order, langs in word_orders.items():
    print(f"  {order}:")
    print(f"    {', '.join(langs)}")
print()
print(f"SOV is most common (~45% of languages)")
print(f"SVO is second (~42%). These two cover 87%.")`,
      challenge: 'Modify the parser to handle prepositional phrases: "the cat sat on the mat." You need a PP node containing a preposition + NP. This is the first step toward handling real English complexity.',
      successHint: 'Syntax trees reveal that language is not flat sequences of words — it is hierarchical structure. This insight powers every modern NLP system: parse the tree, understand the meaning.',
    },
    {
      title: 'Transformer attention — how modern translation works',
      concept: `The **transformer architecture** (Vaswani et al., 2017) revolutionised NLP. Its key innovation: **self-attention** — a mechanism that lets every word in a sentence look at every other word and decide how much to "attend" to it.

In the sentence "The cat sat on the mat because it was tired", what does "it" refer to? The cat or the mat? Attention computes a score between "it" and every other word. The score with "cat" is high (they are related). The score with "mat" is low. This is how the model resolves ambiguity.

Mathematically: Attention(Q, K, V) = softmax(QKᵀ/√d) × V. Each word generates three vectors: Query (what am I looking for?), Key (what do I contain?), and Value (what information do I carry?). The dot product QKᵀ measures relevance. Softmax normalises to probabilities. The result is a weighted combination of Value vectors.

The code implements a simplified attention mechanism.`,
      analogy: 'Imagine you are at a party and someone says "it." You automatically scan the recent conversation: "Who or what were we talking about?" Your brain assigns attention weights — high weight to the most recently mentioned noun, low weight to irrelevant words. Transformer attention does the same thing, but with matrix multiplication instead of neurons.',
      storyConnection: 'The Tower of Babel scattered language into 7,000 fragments. The transformer model is the first technology capable of learning the deep structure that all languages share — attention discovers cross-lingual patterns automatically from data. A single model trained on 100 languages develops internal representations where equivalent phrases in different languages cluster together.',
      checkQuestion: 'GPT-4 was trained on text, not parallel translations. How can it translate between languages it never explicitly learned to translate?',
      checkAnswer: 'Because its training data contains text in many languages, the model develops shared internal representations for equivalent concepts. "The cat is sleeping" (English), "Le chat dort" (French), and "Der Kater schläft" (German) all activate similar internal patterns. The model does not need explicit translation pairs — it discovers the mapping between languages implicitly through shared semantic space. This is called emergent multilingual capability.',
      codeIntro: 'Implement simplified self-attention on a sentence.',
      code: `import numpy as np

# Simplified self-attention mechanism
# Each word is represented as a vector

sentence = ["The", "cat", "sat", "on", "the", "mat", "because", "it", "was", "tired"]

# Random word embeddings (in reality, these are learned)
np.random.seed(42)
d = 8  # embedding dimension
embeddings = {w: np.random.randn(d) * 0.5 for w in set(sentence)}
# Make 'it' similar to 'cat' (they should attend to each other)
embeddings["it"] = embeddings["cat"] + np.random.randn(d) * 0.1
embeddings["tired"] = embeddings["cat"] + np.random.randn(d) * 0.2

X = np.array([embeddings[w] for w in sentence])

# Query, Key, Value matrices (normally learned; we use random)
W_Q = np.random.randn(d, d) * 0.3
W_K = np.random.randn(d, d) * 0.3
W_V = np.random.randn(d, d) * 0.3

Q = X @ W_Q  # Queries: what is each word looking for?
K = X @ W_K  # Keys: what does each word advertise?
V = X @ W_V  # Values: what information does each word carry?

# Attention scores: dot product of queries and keys
scores = Q @ K.T / np.sqrt(d)

# Softmax to get attention weights
def softmax(x, axis=-1):
    e = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e / e.sum(axis=axis, keepdims=True)

attention = softmax(scores)

# Print attention weights for "it" (word 7)
it_idx = 7
print(f"Attention weights for '{sentence[it_idx]}':")
print("-" * 45)
weights = attention[it_idx]
sorted_idx = np.argsort(weights)[::-1]
for idx in sorted_idx:
    bar = "#" * int(weights[idx] * 40)
    print(f"  {sentence[idx]:>10s}: {weights[idx]:.3f}  {bar}")

print()
print("'it' should attend most strongly to 'cat' — the noun it refers to.")
print("Self-attention learns these relationships from training data.")
print()
print("This mechanism is the core of GPT, BERT, and all modern LLMs.")
print("It processes ALL words in parallel (not sequentially),")
print("which is why transformers are so fast on GPUs.")`,
      challenge: 'Change the sentence to "The dog chased the cat because it was fast." Now "it" could refer to "dog" (the chaser was fast) or "cat" (the chasee was fast). Run the attention — which does the model attend to? In real transformers, multiple attention heads resolve this ambiguity.',
      successHint: 'Attention is arguably the most important idea in modern AI. It lets models learn contextual relationships between any pair of elements in a sequence — and this applies not just to language but to images, music, and protein structures.',
    },
  ];

  return (
    <div className="space-y-8">
      {loading && (
        <div className="flex items-center gap-3 bg-amber-500/10 text-amber-300 px-4 py-3 rounded-lg text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadProgress}
        </div>
      )}
      {miniLessons.map((lesson, i) => (
        <MiniLesson
          key={i}
          id={`babel-l3-${i + 1}`}
          number={i + 1}
          title={lesson.title}
          concept={lesson.concept}
          analogy={lesson.analogy}
          storyConnection={lesson.storyConnection}
          checkQuestion={lesson.checkQuestion}
          checkAnswer={lesson.checkAnswer}
          diagram={i === 0 ? createElement(BabelSkyscraperDiagram) : i === 1 ? createElement(BabelBucklingDiagram) : undefined}
          code={lesson.code}
          codeIntro={lesson.codeIntro}
          challenge={lesson.challenge}
          successHint={lesson.successHint}
          pyodideRef={pyodideRef}
          onLoadPyodide={loadPyodide}
          pyReady={pyReady}
        />
      ))}
    </div>
  );
}
