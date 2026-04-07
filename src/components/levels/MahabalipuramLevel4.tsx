import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MahabalipuramLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Tessellation engine — generate any tiling from specification',
      concept: `In this capstone, you will build a **tessellation engine** that takes a high-level specification (polygon types, vertex configuration, panel dimensions) and generates the complete tiling with all vertex coordinates. This is the software core of a CNC system for carving jali screens.

The engine works in three stages: (1) parse the vertex configuration to determine which polygons meet at each vertex, (2) generate the lattice of tile positions using the appropriate translation vectors, and (3) compute exact vertex coordinates for every polygon. The output is a list of polygons with their vertices — ready to be sent to a CNC machine or rendered on screen.

This integrates everything from Levels 1-3: polygon geometry, symmetry operations, lattice vectors, and coordinate computation. The result is a tool that can generate any of the standard tessellation patterns used in Mahabalipuram stone screens.

*A CNC (Computer Numerical Control) machine is a computer-controlled cutting tool. It follows a path defined by coordinates to carve, drill, or mill material. The tessellation engine generates these coordinates.*`,
      analogy: 'Think of the tessellation engine as a recipe interpreter. You give it a recipe ("place hexagons in a honeycomb pattern on a 1-metre panel with 5-cm cells") and it outputs exact GPS-like coordinates for every cut the machine needs to make. It translates abstract geometry into concrete instructions.',
      storyConnection: 'Modern stone jali screens in new temples are often CNC-carved using exactly this type of software. A designer specifies the pattern and panel size, and the machine carves it in hours. The same patterns that took Mahabalipuram craftsmen weeks are now produced with sub-millimetre precision by computer.',
      checkQuestion: 'Why is a vertex configuration alone not enough to generate a tiling? What else is needed?',
      checkAnswer: 'A vertex configuration (like 4.8.8) only tells you which polygons meet at each vertex. To generate the full tiling, you also need: the lattice vectors (spacing between unit cells), the orientation of polygons within the cell, and the panel dimensions. The same vertex configuration can produce different patterns depending on how the unit cells are arranged.',
      codeIntro: 'Build a complete tessellation generation engine.',
      code: `import numpy as np

class TessellationEngine:
    def __init__(self):
        self.tiles = []

    def polygon_vertices(self, n, cx, cy, radius, rotation_deg=0):
        angles = [2 * np.pi * k / n + np.radians(rotation_deg) for k in range(n)]
        return [(cx + radius * np.cos(a), cy + radius * np.sin(a)) for a in angles]

    def generate_square_tiling(self, width, height, cell_size):
        self.tiles = []
        cols = int(width / cell_size)
        rows = int(height / cell_size)
        r = cell_size / np.sqrt(2)
        for row in range(rows):
            for col in range(cols):
                cx = col * cell_size + cell_size / 2
                cy = row * cell_size + cell_size / 2
                verts = self.polygon_vertices(4, cx, cy, r, 45)
                self.tiles.append({"type": 4, "vertices": verts, "centre": (cx, cy)})
        return self.tiles

    def generate_hex_tiling(self, width, height, cell_size):
        self.tiles = []
        r = cell_size / np.sqrt(3)
        dx = cell_size
        dy = cell_size * np.sqrt(3) / 2
        rows = int(height / dy) + 1
        cols = int(width / dx) + 1
        for row in range(rows):
            for col in range(cols):
                cx = col * dx + (row % 2) * dx / 2
                cy = row * dy
                if cx <= width and cy <= height:
                    verts = self.polygon_vertices(6, cx, cy, r, 30)
                    self.tiles.append({"type": 6, "vertices": verts, "centre": (cx, cy)})
        return self.tiles

    def generate_oct_square_tiling(self, width, height, cell_size):
        self.tiles = []
        s = cell_size
        gap = s * (np.sqrt(2) - 1)  # square edge in the gap
        stride = s + gap
        rows = int(height / stride) + 1
        cols = int(width / stride) + 1
        for row in range(rows):
            for col in range(cols):
                cx = col * stride
                cy = row * stride
                if cx <= width and cy <= height:
                    r_oct = s / (2 * np.sin(np.pi / 8))
                    verts = self.polygon_vertices(8, cx, cy, r_oct, 22.5)
                    self.tiles.append({"type": 8, "vertices": verts, "centre": (cx, cy)})
                # Small square in the gap
                sx = cx + stride / 2
                sy = cy + stride / 2
                if sx <= width and sy <= height:
                    r_sq = gap / np.sqrt(2)
                    verts = self.polygon_vertices(4, sx, sy, r_sq, 45)
                    self.tiles.append({"type": 4, "vertices": verts, "centre": (sx, sy)})
        return self.tiles

    def statistics(self):
        if not self.tiles:
            return {}
        types = {}
        total_area = 0
        for t in self.tiles:
            n = t["type"]
            types[n] = types.get(n, 0) + 1
            # Shoelace formula for area
            verts = t["vertices"]
            area = 0.5 * abs(sum(
                verts[i][0] * verts[(i+1) % n][1] - verts[(i+1) % n][0] * verts[i][1]
                for i in range(n)
            ))
            total_area += area
        return {"tile_counts": types, "total_tiles": len(self.tiles),
                "total_area": total_area}

engine = TessellationEngine()

# Generate and report on three tilings
configs = [
    ("Square (4.4.4.4)", lambda: engine.generate_square_tiling(20, 20, 2)),
    ("Hexagonal (6.6.6)", lambda: engine.generate_hex_tiling(20, 20, 2)),
    ("Oct-Square (4.8.8)", lambda: engine.generate_oct_square_tiling(20, 20, 2)),
]

for name, gen_func in configs:
    tiles = gen_func()
    stats = engine.statistics()
    print(f"=== {name} ===")
    print(f"  Panel: 20cm x 20cm")
    print(f"  Total tiles: {stats['total_tiles']}")
    print(f"  Tile types: {stats['tile_counts']}")
    print(f"  Covered area: {stats['total_area']:.1f} cm^2")
    print(f"  First tile vertices:")
    for i, (x, y) in enumerate(tiles[0]["vertices"]):
        print(f"    V{i}: ({x:.3f}, {y:.3f})")
    print()`,
      challenge: 'Add a generate_custom_tiling method that accepts a vertex configuration string (like "3.3.4.3.4") and automatically determines the lattice vectors and polygon placements. This is the holy grail of tessellation software — fully automatic tiling from just a vertex specification.',
      successHint: 'You have built the core of a CNC jali screen generator. The same architecture is used in CAD/CAM software that manufactures everything from decorative panels to semiconductor wafer patterns.',
    },
    {
      title: 'Pattern analyser — classify symmetry and detect errors',
      concept: `Given a set of tile coordinates, how do you determine the symmetry group and detect errors? A **pattern analyser** takes raw geometry and extracts mathematical properties: rotation orders, reflection axes, translation vectors, and defect locations.

The analysis works by: (1) finding all vertex positions, (2) computing the angles at each vertex, (3) testing for rotation and reflection symmetries by transforming the pattern and checking if it matches itself, and (4) identifying vertices where the angle sum deviates from 360 degrees (defects).

This is the quality control system for CNC-carved jali screens: after carving, a camera scans the panel and the analyser checks every vertex and edge against the specification. It is also used in archaeology to classify ancient tessellation patterns.

*Pattern recognition — extracting mathematical structure from raw data — is one of the most important problems in computer science. It applies to image recognition, speech recognition, crystal structure determination, and quality control.*`,
      analogy: 'Think of a music recognition app. It listens to a melody and identifies the key, time signature, and any wrong notes. The pattern analyser does the same for tessellations: it "listens" to the geometry and identifies the symmetry group, the tile types, and any defects.',
      storyConnection: 'Archaeologists studying Mahabalipuram use computational pattern analysis to compare screens from different temples and time periods. By identifying the symmetry group and measuring defect patterns, they can determine whether two screens were carved by the same workshop or even the same craftsman.',
      checkQuestion: 'If a scanned pattern has 4-fold rotation symmetry and two perpendicular reflection axes, which wallpaper group is it?',
      checkAnswer: 'p4mm — the most symmetric group with 4-fold rotation. It has 4-fold rotation, reflections across the x and y axes, and reflections across the diagonal axes. This is the symmetry of a simple square grid.',
      codeIntro: 'Build a pattern analyser that classifies symmetry and detects defects.',
      code: `import numpy as np

class PatternAnalyser:
    def __init__(self, tiles):
        self.tiles = tiles
        self.vertices = self._extract_vertices()

    def _extract_vertices(self):
        """Extract unique vertices from all tiles."""
        verts = {}
        for tile in self.tiles:
            n = tile["type"]
            for v in tile["vertices"]:
                key = (round(v[0], 4), round(v[1], 4))
                if key not in verts:
                    verts[key] = {"pos": key, "tiles": [], "angles": []}
                verts[key]["tiles"].append(n)
        return list(verts.values())

    def analyse_vertices(self):
        """Check angle sums at each vertex."""
        results = {"perfect": 0, "defective": 0, "defects": []}
        for v in self.vertices:
            angle_sum = sum((n - 2) * 180 / n for n in v["tiles"])
            if abs(angle_sum - 360) < 1:
                results["perfect"] += 1
            else:
                results["defective"] += 1
                results["defects"].append({
                    "position": v["pos"],
                    "angle_sum": angle_sum,
                    "deficit": 360 - angle_sum,
                    "tiles": v["tiles"],
                })
        return results

    def detect_rotation_symmetry(self):
        """Test for rotation symmetry by checking if rotated pattern matches."""
        if len(self.tiles) < 2:
            return [1]

        centres_x = [t["centre"][0] for t in self.tiles]
        centres_y = [t["centre"][1] for t in self.tiles]
        cx = np.mean(centres_x)
        cy = np.mean(centres_y)

        symmetries = [1]  # identity always works
        for fold in [2, 3, 4, 6]:
            angle = 2 * np.pi / fold
            cos_a, sin_a = np.cos(angle), np.sin(angle)

            matches = 0
            for t in self.tiles:
                tx, ty = t["centre"]
                rx = cx + (tx - cx) * cos_a - (ty - cy) * sin_a
                ry = cy + (tx - cx) * sin_a + (ty - cy) * cos_a
                # Check if rotated position matches any tile
                for t2 in self.tiles:
                    if abs(rx - t2["centre"][0]) < 0.5 and abs(ry - t2["centre"][1]) < 0.5:
                        if t["type"] == t2["type"]:
                            matches += 1
                            break

            match_pct = matches / len(self.tiles) * 100
            if match_pct > 80:
                symmetries.append(fold)

        return symmetries

    def summary(self):
        vertex_analysis = self.analyse_vertices()
        rotation_sym = self.detect_rotation_symmetry()

        print(f"  Tiles: {len(self.tiles)}")
        print(f"  Unique vertices: {len(self.vertices)}")
        print(f"  Perfect vertices: {vertex_analysis['perfect']}")
        print(f"  Defective vertices: {vertex_analysis['defective']}")
        if vertex_analysis["defects"]:
            for d in vertex_analysis["defects"][:5]:
                print(f"    Defect at {d['position']}: sum={d['angle_sum']:.1f} "
                      f"(deficit={d['deficit']:.1f})")
        print(f"  Rotation symmetries: {rotation_sym}")
        max_fold = max(rotation_sym)
        print(f"  Highest rotation order: {max_fold}-fold")

# Create test patterns using the engine from the previous exercise
class SimpleEngine:
    def polygon_vertices(self, n, cx, cy, radius, rot=0):
        angles = [2*np.pi*k/n + np.radians(rot) for k in range(n)]
        return [(cx + radius*np.cos(a), cy + radius*np.sin(a)) for a in angles]

    def make_square_grid(self, size):
        tiles = []
        for r in range(size):
            for c in range(size):
                cx, cy = c * 2 + 1, r * 2 + 1
                v = self.polygon_vertices(4, cx, cy, 1.0, 45)
                tiles.append({"type": 4, "vertices": v, "centre": (cx, cy)})
        return tiles

    def make_hex_grid(self, size):
        tiles = []
        for r in range(size):
            for c in range(size):
                cx = c * 2 + (r % 2)
                cy = r * 1.732
                v = self.polygon_vertices(6, cx, cy, 1.0, 30)
                tiles.append({"type": 6, "vertices": v, "centre": (cx, cy)})
        return tiles

eng = SimpleEngine()

for name, tiles in [("Square grid 5x5", eng.make_square_grid(5)),
                     ("Hex grid 5x5", eng.make_hex_grid(5))]:
    print(f"=== Analysing: {name} ===")
    analyser = PatternAnalyser(tiles)
    analyser.summary()
    print()`,
      challenge: 'Add reflection symmetry detection: test if the pattern has mirror symmetry across horizontal, vertical, and diagonal axes. Combine rotation and reflection results to automatically identify the wallpaper group.',
      successHint: 'You have built a pattern recognition system. The same approach — extract features, test symmetries, classify — is used in crystal structure determination, image recognition, and quality control systems worldwide.',
    },
    {
      title: 'CNC toolpath generator — from geometry to machine instructions',
      concept: `The final step in manufacturing a jali screen is converting the tessellation geometry into a **toolpath** — the sequence of movements that a CNC cutting tool must follow to carve the pattern. The toolpath must account for: the cutting tool diameter (the cut is wider than the line), approach and retract moves, cutting speed, and material constraints.

The toolpath is expressed as **G-code** — a standardized language understood by CNC machines. Key commands include: G00 (rapid move, no cutting), G01 (linear cut at specified feed rate), G02/G03 (circular arc), and M commands for spindle and coolant control.

In this exercise, you will generate G-code for a simple jali pattern. This connects abstract tessellation geometry to the physical reality of CNC manufacturing.

*G-code was developed in the 1950s and is still the standard language for CNC machines. Every machined part — from engine blocks to microchips — was manufactured by a machine reading G-code.*`,
      analogy: 'Think of G-code as turn-by-turn driving directions for a cutting tool. "Drive north 10 cm at 50 cm/min while cutting" is like "G01 Y10 F50." "Drive quickly to the next starting point without cutting" is like "G00 X20 Y30." The toolpath is the complete set of directions for the entire journey.',
      storyConnection: 'Modern stone carving companies in Tamil Nadu now use CNC machines to produce jali screens based on traditional Mahabalipuram patterns. The operator digitises a historic pattern (using a pattern analyser like the one in the previous lesson), generates the toolpath, and the machine carves an exact replica in a fraction of the time.',
      checkQuestion: 'If the cutting tool has a 3 mm diameter, and the desired cut width is 3 mm, where should the tool centre be positioned?',
      checkAnswer: 'The tool centre should follow the exact cut line — the cut width equals the tool diameter, so no offset is needed. But if the desired cut is 5 mm wide and the tool is 3 mm, you need two passes: one offset 1 mm to the left and one 1 mm to the right of the centre line.',
      codeIntro: 'Generate CNC G-code for carving a jali screen pattern.',
      code: `import numpy as np

class GCodeGenerator:
    def __init__(self, tool_diameter_mm=3.0, feed_rate=200, safe_z=5.0, cut_z=-3.0):
        self.tool_d = tool_diameter_mm
        self.feed = feed_rate
        self.safe_z = safe_z
        self.cut_z = cut_z
        self.gcode = []

    def header(self):
        self.gcode.extend([
            "(Jali Screen CNC Program)",
            "(Generated by TessellationEngine)",
            "G90 (Absolute positioning)",
            "G21 (Millimetres)",
            "M03 S12000 (Spindle on at 12000 RPM)",
            "G00 Z%.1f (Move to safe height)" % self.safe_z,
        ])

    def footer(self):
        self.gcode.extend([
            "G00 Z%.1f (Retract to safe height)" % self.safe_z,
            "G00 X0 Y0 (Return to origin)",
            "M05 (Spindle off)",
            "M30 (Program end)",
        ])

    def cut_polygon(self, vertices, polygon_id=0):
        """Generate G-code to cut a polygon opening."""
        if not vertices:
            return

        # Offset vertices inward by tool radius
        offset = self.tool_d / 2

        # Move to first vertex at safe height
        x0, y0 = vertices[0]
        self.gcode.append("(Polygon %d)" % polygon_id)
        self.gcode.append("G00 X%.3f Y%.3f" % (x0, y0))
        self.gcode.append("G01 Z%.1f F%d (Plunge)" % (self.cut_z, self.feed // 3))

        # Cut along edges
        for x, y in vertices[1:]:
            self.gcode.append("G01 X%.3f Y%.3f F%d" % (x, y, self.feed))

        # Close the polygon
        self.gcode.append("G01 X%.3f Y%.3f F%d" % (x0, y0, self.feed))

        # Retract
        self.gcode.append("G00 Z%.1f" % self.safe_z)

    def generate(self, tiles):
        self.header()
        for i, tile in enumerate(tiles):
            self.cut_polygon(tile["vertices"], polygon_id=i)
        self.footer()
        return self.gcode

# Generate a small hexagonal jali pattern
def make_hex_pattern(rows, cols, cell_mm):
    tiles = []
    r = cell_mm * 0.4  # opening radius (smaller than cell for bars)
    for row in range(rows):
        for col in range(cols):
            cx = col * cell_mm + (row % 2) * cell_mm / 2 + cell_mm / 2
            cy = row * cell_mm * 0.866 + cell_mm / 2
            angles = [2 * np.pi * k / 6 + np.pi / 6 for k in range(6)]
            verts = [(cx + r * np.cos(a), cy + r * np.sin(a)) for a in angles]
            tiles.append({"type": 6, "vertices": verts, "centre": (cx, cy)})
    return tiles

tiles = make_hex_pattern(4, 5, 20)

gen = GCodeGenerator(tool_diameter_mm=3.0, feed_rate=200)
gcode = gen.generate(tiles)

print("=== Generated G-Code for Hexagonal Jali ===")
print(f"Pattern: 4x5 hexagonal grid, 20mm cell spacing")
print(f"Tool: 3mm diameter, feed: 200 mm/min")
print(f"Total G-code lines: {len(gcode)}")
print(f"Total polygons to cut: {len(tiles)}")
print()

# Print first 25 lines
print("--- First 25 lines of G-code ---")
for line in gcode[:25]:
    print(f"  {line}")
print("  ...")

# Print last 10 lines
print("--- Last 10 lines ---")
for line in gcode[-10:]:
    print(f"  {line}")

# Estimate cutting time
total_distance = 0
for tile in tiles:
    verts = tile["vertices"]
    for i in range(len(verts)):
        x1, y1 = verts[i]
        x2, y2 = verts[(i+1) % len(verts)]
        total_distance += np.sqrt((x2-x1)**2 + (y2-y1)**2)

cut_time_min = total_distance / 200
print(f"\\n=== Cutting Estimate ===")
print(f"Total cut distance: {total_distance:.0f} mm")
print(f"Estimated cutting time: {cut_time_min:.1f} min")
print(f"Plus rapid moves and plunges: ~{cut_time_min * 1.5:.1f} min total")`,
      challenge: 'Add tool radius compensation: instead of cutting along the exact polygon edge, offset the toolpath inward by the tool radius so the finished opening matches the intended size. Calculate the required offset for each polygon edge and adjust the G-code accordingly.',
      successHint: 'You have completed the full pipeline from mathematical tessellation to CNC manufacturing code. This exact workflow is used in stone fabrication, PCB routing, laser cutting, and 3D printing path planning. You have connected 1300-year-old Pallava geometry to 21st-century digital manufacturing.',
    },
    {
      title: 'Structural analysis — will the jali screen hold together?',
      concept: `A jali screen is a structure — it must support its own weight and resist wind loads without collapsing. The structural analysis depends on the **bar width** (the stone between openings), the **material strength**, and the **pattern topology** (which bars connect to which).

The screen can be modelled as a **truss** — a network of bars connected at joints (vertices). Each bar carries tension or compression forces, and the screen fails if any bar exceeds the material's strength. Different tessellation patterns have different structural efficiencies: a triangular grid is very stiff (all triangulated) while a hexagonal grid is more flexible.

In this final capstone exercise, you will perform a simplified structural analysis of different jali patterns, determining which can support the largest panel size without failure. This connects tessellation geometry to structural engineering.

*A truss is a structure made of bars connected at joints, where loads are applied only at the joints. It is the simplest structural model and is used to analyse everything from bridges to bicycle frames to building facades.*`,
      analogy: 'Think of different tessellation patterns as different types of scaffolding. Triangular scaffolding is rigid — each triangle locks in place. Square scaffolding is wobbly — each square can deform into a parallelogram. Hexagonal scaffolding is in between. The tessellation pattern determines how stiff and strong the screen is.',
      storyConnection: 'The Mahabalipuram carvers knew that triangular patterns were strongest but hexagonal patterns let in more light. They often used hybrid designs: a triangular grid as the structural frame with hexagonal openings for light. This ancient engineering wisdom is now validated by finite element analysis software.',
      checkQuestion: 'A square grid has 4 bars meeting at each internal joint. How many triangulated sub-structures does it have? Is it inherently rigid?',
      checkAnswer: 'Zero. A square has no diagonal bracing, so it can deform into a parallelogram without any bar changing length. It is a mechanism, not a structure. Adding one diagonal to each square (creating triangles) makes it rigid. This is why truss bridges always use triangles, never unsupported squares.',
      codeIntro: 'Analyse the structural performance of different jali screen patterns.',
      code: `import numpy as np

class JaliStructuralAnalyser:
    def __init__(self, pattern_type, panel_width_m, panel_height_m,
                 bar_width_mm, material_strength_mpa=10):
        self.pattern = pattern_type
        self.width = panel_width_m
        self.height = panel_height_m
        self.bar_w = bar_width_mm / 1000  # convert to metres
        self.strength = material_strength_mpa * 1e6  # convert to Pa
        self.stone_density = 2600  # kg/m^3

    def compute_bars(self):
        """Estimate number and total length of bars."""
        if self.pattern == "square":
            cell_size = self.bar_w * 5  # bar + opening
            nx = int(self.width / cell_size)
            ny = int(self.height / cell_size)
            n_horizontal = nx * (ny + 1)
            n_vertical = (nx + 1) * ny
            total_bars = n_horizontal + n_vertical
            avg_length = cell_size
            connectivity = 4  # bars per joint
        elif self.pattern == "hexagonal":
            cell_size = self.bar_w * 6
            nx = int(self.width / cell_size)
            ny = int(self.height / (cell_size * 0.866))
            total_bars = int(nx * ny * 3)
            avg_length = cell_size / np.sqrt(3)
            connectivity = 3
        elif self.pattern == "triangular":
            cell_size = self.bar_w * 4
            nx = int(self.width / cell_size)
            ny = int(self.height / (cell_size * 0.866))
            total_bars = int(nx * ny * 3)
            avg_length = cell_size
            connectivity = 6
        else:
            total_bars = 0
            avg_length = 0
            connectivity = 0

        return total_bars, avg_length, connectivity

    def analyse(self):
        total_bars, avg_length, connectivity = self.compute_bars()

        # Bar cross-section
        bar_area = self.bar_w ** 2  # square cross-section
        bar_volume = bar_area * avg_length
        total_volume = total_bars * bar_volume
        total_mass = total_volume * self.stone_density

        # Panel total volume (for openness calculation)
        panel_volume = self.width * self.height * self.bar_w
        openness = 1 - total_volume / panel_volume if panel_volume > 0 else 0

        # Structural capacity (simplified)
        # Max force per bar before failure
        max_force_per_bar = self.strength * bar_area

        # Self-weight stress
        panel_mass = total_mass
        weight = panel_mass * 9.81
        bars_carrying_weight = total_bars / 3  # roughly 1/3 carry vertical load
        stress_per_bar = weight / (bars_carrying_weight * bar_area) if bars_carrying_weight > 0 else 0

        safety_factor = self.strength / stress_per_bar if stress_per_bar > 0 else float('inf')

        # Wind load (simplified: 0.5 kPa on exposed area)
        wind_pressure = 500  # Pa
        wind_force = wind_pressure * self.width * self.height * (1 - openness)
        wind_stress = wind_force / (total_bars * bar_area / 3) if total_bars > 0 else 0

        return {
            "bars": total_bars,
            "connectivity": connectivity,
            "mass_kg": total_mass,
            "openness": openness,
            "self_weight_stress_mpa": stress_per_bar / 1e6,
            "wind_stress_mpa": wind_stress / 1e6,
            "safety_factor_gravity": safety_factor,
            "max_bar_force_kn": max_force_per_bar / 1000,
        }

# Compare patterns
print("=== Jali Screen Structural Analysis ===")
print("Panel: 1.0m x 1.5m, bar width: 15mm, granite (10 MPa)")
print()

patterns = ["triangular", "square", "hexagonal"]
header = "Pattern       Bars  Connect  Mass(kg)  Open(%)  Gravity(MPa)  Wind(MPa)  Safety"
print(header)
print("-" * len(header))

for pat in patterns:
    analyser = JaliStructuralAnalyser(pat, 1.0, 1.5, 15, 10)
    r = analyser.analyse()
    print(f"{pat:<14} {r['bars']:>4}  {r['connectivity']:>7}  "
          f"{r['mass_kg']:>7.1f}  {r['openness']*100:>5.0f}  "
          f"{r['self_weight_stress_mpa']:>10.3f}    "
          f"{r['wind_stress_mpa']:>7.3f}    {r['safety_factor_gravity']:>5.0f}")

# Test different bar widths
print()
print("=== Bar Width Sensitivity (Hexagonal Pattern) ===")
header2 = "Bar Width(mm)  Mass(kg)  Openness(%)  Safety Factor"
print(header2)
print("-" * len(header2))

for bw in [5, 8, 10, 15, 20, 25, 30]:
    a = JaliStructuralAnalyser("hexagonal", 1.0, 1.5, bw, 10)
    r = a.analyse()
    safe = "OK" if r["safety_factor_gravity"] > 3 else "MARGINAL" if r["safety_factor_gravity"] > 1.5 else "FAIL"
    print(f"{bw:>11}    {r['mass_kg']:>6.1f}    {r['openness']*100:>8.0f}    "
          f"{r['safety_factor_gravity']:>11.0f}  {safe}")

print()
print("Triangular patterns are strongest (highest connectivity).")
print("Hexagonal patterns have the best openness for light.")
print("The Mahabalipuram carvers balanced both requirements.")`,
      challenge: 'Add a seismic load analysis: horizontal acceleration of 0.2g applied to the panel mass. Calculate the additional stress and the combined safety factor (gravity + wind + seismic). Determine the minimum bar width for each pattern to survive an earthquake.',
      successHint: 'You have completed a full engineering pipeline: from mathematical tessellation geometry to CNC manufacturing code to structural safety analysis. This is real engineering — the same workflow used to design the decorative facades of modern buildings. You have connected 1300 years of Pallava stone carving tradition to modern computational engineering.',
    },
    {
      title: 'Complete jali design system — specification to manufacturing',
      concept: `In this final exercise, you bring everything together: a complete jali design system that takes a high-level specification (pattern type, dimensions, structural requirements, and aesthetic preferences) and outputs a manufacturing-ready design with full quality analysis.

The system works in five stages: (1) select pattern and calculate geometry, (2) check structural adequacy, (3) generate CNC toolpath, (4) estimate manufacturing time and cost, and (5) produce a complete design report. If the structural check fails, it automatically adjusts the bar width until the design is safe.

This is a **design automation** system — the same type of software used in modern architectural and manufacturing engineering. It makes thousands of calculations in seconds that would take a human engineer hours.

*Design automation is the use of software to make engineering design decisions. It does not replace the engineer — it amplifies their capability by exploring thousands of design variants and selecting the best one.*`,
      analogy: 'Think of it as an intelligent recipe book. You tell it "I want a hexagonal jali screen, 1 metre square, that can survive monsoon winds, with maximum light transmission." It calculates the minimum bar width for structural safety, generates the CNC cutting program, estimates that it will take 45 minutes to carve and cost a certain amount, and hands you a complete manufacturing package.',
      storyConnection: 'This system bridges the gap between the Mahabalipuram master carver\'s intuitive knowledge and modern computational design. The master knew the right bar width by experience; the software calculates it from physics. The master judged a pattern\'s beauty by eye; the software ensures it also meets structural codes. Together, tradition and technology produce the best possible jali screens.',
      checkQuestion: 'Why does the system try multiple bar widths instead of just calculating the minimum directly?',
      checkAnswer: 'Because the structural analysis is non-linear — doubling the bar width more than doubles the strength (bar area grows as the square of width, and fewer bars are needed). Also, the openness, mass, and manufacturing time all change with bar width. The iterative approach finds the best balance across all constraints simultaneously.',
      codeIntro: 'Run a complete jali design system from specification to manufacturing report.',
      code: `import numpy as np

class JaliDesignSystem:
    def __init__(self, spec):
        self.spec = spec
        self.design = {}

    def auto_design(self):
        """Automatically find the optimal bar width."""
        pattern = self.spec["pattern"]
        width = self.spec["width_m"]
        height = self.spec["height_m"]
        min_safety = self.spec.get("min_safety_factor", 3.0)
        target_openness = self.spec.get("target_openness", 0.5)
        material_strength = self.spec.get("material_mpa", 10)

        best_design = None
        for bar_mm in range(5, 40):
            cell_factor = {"triangular": 4, "square": 5, "hexagonal": 6}
            cell_size = bar_mm / 1000 * cell_factor.get(pattern, 5)
            bar_m = bar_mm / 1000

            nx = max(1, int(width / cell_size))
            ny = max(1, int(height / cell_size))
            n_bars = nx * ny * (3 if pattern != "square" else 2)
            bar_area = bar_m ** 2
            mass = n_bars * bar_area * cell_size * 2600
            weight = mass * 9.81

            panel_vol = width * height * bar_m
            stone_vol = n_bars * bar_area * cell_size
            openness = max(0, 1 - stone_vol / panel_vol) if panel_vol > 0 else 0

            stress = weight / (n_bars * bar_area / 3) if n_bars > 0 and bar_area > 0 else 1e10
            safety = material_strength * 1e6 / stress if stress > 0 else float('inf')

            if safety >= min_safety:
                score = openness  # maximize openness
                if best_design is None or score > best_design.get("score", 0):
                    best_design = {
                        "bar_width_mm": bar_mm,
                        "bars": n_bars,
                        "mass_kg": mass,
                        "openness": openness,
                        "safety_factor": safety,
                        "score": score,
                    }

        self.design = best_design or {"error": "No feasible design found"}
        return self.design

    def manufacturing_estimate(self):
        if "error" in self.design:
            return {}
        n_bars = self.design["bars"]
        # Each polygon cut takes ~30 seconds (positioning + cutting)
        cut_time_min = n_bars * 0.5
        # Material cost (granite: ~$50/m^2 for 15mm thick)
        area = self.spec["width_m"] * self.spec["height_m"]
        material_cost = area * 50
        # Machine time cost ($1/min)
        machine_cost = cut_time_min * 1
        return {
            "cutting_time_min": cut_time_min,
            "total_time_hours": cut_time_min / 60 * 1.5,  # + setup
            "material_cost": material_cost,
            "machining_cost": machine_cost,
            "total_cost": material_cost + machine_cost,
        }

    def report(self):
        print("=" * 58)
        print("     JALI SCREEN DESIGN REPORT")
        print("=" * 58)

        print("\\nSPECIFICATION:")
        for k, v in self.spec.items():
            print(f"  {k}: {v}")

        if "error" in self.design:
            print(f"\\nERROR: {self.design['error']}")
            return

        print("\\nOPTIMISED DESIGN:")
        print(f"  Bar width: {self.design['bar_width_mm']} mm")
        print(f"  Total bars: {self.design['bars']}")
        print(f"  Panel mass: {self.design['mass_kg']:.1f} kg")
        print(f"  Openness: {self.design['openness']*100:.0f}%")
        print(f"  Safety factor: {self.design['safety_factor']:.1f}")

        mfg = self.manufacturing_estimate()
        if mfg:
            print("\\nMANUFACTURING:")
            print(f"  Cutting time: {mfg['cutting_time_min']:.0f} min")
            print(f"  Total time (with setup): {mfg['total_time_hours']:.1f} hours")
            print(f"  Material cost: {mfg['material_cost']:.0f}")
            print(f"  Machining cost: {mfg['machining_cost']:.0f}")
            print(f"  TOTAL COST: {mfg['total_cost']:.0f}")

        print("\\nQUALITY CHECKS:")
        checks = [
            ("Structural safety", self.design["safety_factor"] >= 3),
            ("Openness > 40%", self.design["openness"] > 0.4),
            ("Mass < 50 kg", self.design["mass_kg"] < 50),
            ("Bar width >= 8 mm", self.design["bar_width_mm"] >= 8),
        ]
        all_pass = True
        for name, passed in checks:
            status = "PASS" if passed else "FAIL"
            if not passed:
                all_pass = False
            print(f"  [{status}] {name}")

        verdict = "APPROVED" if all_pass else "REVIEW REQUIRED"
        print(f"\\n  VERDICT: {verdict}")
        print("=" * 58)

# Design three screens
specs = [
    {"name": "Temple window",     "pattern": "hexagonal",   "width_m": 0.8, "height_m": 1.2, "material_mpa": 10, "min_safety_factor": 3},
    {"name": "Garden partition",  "pattern": "square",      "width_m": 1.5, "height_m": 2.0, "material_mpa": 8,  "min_safety_factor": 2.5},
    {"name": "Facade panel",      "pattern": "triangular",  "width_m": 2.0, "height_m": 3.0, "material_mpa": 15, "min_safety_factor": 4},
]

for spec in specs:
    print()
    system = JaliDesignSystem(spec)
    system.auto_design()
    system.report()`,
      challenge: 'Add a multi-objective optimization: find the bar width that maximizes a weighted score of openness (weight 0.4), safety factor (weight 0.3), and minimizes cost (weight 0.3). Compare the results to the single-objective (openness only) optimization.',
      successHint: 'You have built a complete computer-aided design system — from specification to structural analysis to manufacturing planning to quality control. This is the same pipeline used in modern engineering firms designing building facades, automotive panels, and aerospace structures. You have taken the Mahabalipuram stone carving tradition and transformed it into a computational engineering system.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete tessellation generator and analyser</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These capstone exercises build a complete jali design system from geometry to CNC manufacturing.
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
