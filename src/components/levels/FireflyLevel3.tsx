import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle, HelpCircle } from 'lucide-react';
import ArduinoPlayground from '../ArduinoPlayground';

interface CircuitLesson {
  title: string;
  concept: string;
  analogy?: string;
  storyConnection?: string;
  checkQuestion?: string;
  checkAnswer?: string;
  codeIntro?: string;
  code: string;
  ledCount?: number;
  challenge?: string;
  successHint?: string;
}

function renderMd(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 dark:text-white">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-teal-700 dark:text-teal-300 text-xs font-mono">$1</code>');
}

function CircuitMiniLesson({ lesson, number }: { lesson: CircuitLesson; number: number }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div id={`L3-{number}`} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden scroll-mt-24">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{number}</span>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{lesson.title}</h4>
        </div>
        <div className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: renderMd(lesson.concept) }} />

        {lesson.analogy && (
          <div className="bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-400 rounded-r-lg px-4 py-3 mb-4">
            <p className="text-sm text-sky-800 dark:text-sky-300 leading-relaxed"><strong>Think of it this way:</strong> {lesson.analogy}</p>
          </div>
        )}
        {lesson.storyConnection && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 rounded-r-lg px-4 py-3 mb-4">
            <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed"><strong>In the story:</strong> {lesson.storyConnection}</p>
          </div>
        )}
        {lesson.checkQuestion && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-2">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">Before you code — think about this:</p>
                <p className="text-sm text-amber-800 dark:text-amber-300">{lesson.checkQuestion}</p>
                {lesson.checkAnswer && (
                  <>
                    <button onClick={() => setShowAnswer(!showAnswer)} className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {showAnswer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {showAnswer ? 'Hide answer' : 'Show answer'}
                    </button>
                    {showAnswer && <p className="mt-2 text-sm text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-3 py-2 rounded-lg">{lesson.checkAnswer}</p>}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {lesson.codeIntro && (
        <div className="px-6 py-2 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400"><strong className="text-gray-900 dark:text-white">Now try it:</strong> {lesson.codeIntro}</p>
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700">
        <ArduinoPlayground starterCode={lesson.code} title={`Circuit ${number}`} ledCount={lesson.ledCount || 3} />
      </div>

      {lesson.challenge && (
        <div className="px-6 py-3 bg-teal-50 dark:bg-teal-900/20 border-t border-teal-200 dark:border-teal-800">
          <p className="text-sm text-teal-800 dark:text-teal-300"><strong>Experiment:</strong> {lesson.challenge}</p>
        </div>
      )}
      {lesson.successHint && (
        <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-emerald-800 dark:text-emerald-300"><CheckCircle className="w-4 h-4 inline mr-1" />{lesson.successHint}</p>
        </div>
      )}
    </div>
  );
}

export default function FireflyLevel3() {
  const lessons: CircuitLesson[] = [
    {
      title: 'PCB design — from breadboard to permanent circuit',
      concept: `Your firefly jar works on a breadboard. But breadboards are fragile — wires pop out, connections corrode, and the whole thing falls apart if you bump it. To make a **permanent, reliable circuit**, you design a **PCB** (Printed Circuit Board).

A PCB is a fiberglass board with **copper traces** etched onto it — replacing your jumper wires with solid metal paths. Components are soldered directly to the board. Every electronic device you own — your phone, laptop, TV remote — has a PCB inside.

**PCB design workflow:**
1. **Schematic** — draw the logical connections (which pins connect to what). This is your circuit diagram in digital form.
2. **Component footprints** — each component (LED, resistor, Arduino header) has a physical footprint defining its pad spacing and dimensions.
3. **Layout** — arrange footprints on the board and route copper traces between them. Rules: no traces crossing (use vias for layer changes), maintain minimum trace width (0.2mm for signal, 0.5mm for power), keep analog and digital sections separated.
4. **Design Rule Check (DRC)** — software verifies no traces are too close, no pads overlap, all connections are made.
5. **Gerber export** — generate manufacturing files (one file per layer: top copper, bottom copper, solder mask, silkscreen, drill).
6. **Fabrication** — send Gerbers to a fab house (JLCPCB, PCBWay). Cost: ~$2 for 5 boards.

**Key terms:**
- **Trace** — a copper path (replaces a wire)
- **Pad** — a copper area where you solder a component lead
- **Via** — a hole connecting traces on different layers
- **Silkscreen** — white text/labels printed on the board
- **Solder mask** — the green/blue coating that prevents solder bridges`,
      analogy: 'A breadboard is like writing a letter in pencil on loose paper — easy to change, but fragile and temporary. A PCB is like printing that letter on card stock with permanent ink — fixed, durable, and professional. The content is the same; the medium makes it reliable.',
      storyConnection: 'Joon\'s firefly jar started as an experiment — LEDs stuck in clay with twisted wire connections. But to survive monsoon season on Majuli, it needed to be robust. A PCB-based design would withstand humidity, vibration, and time — turning a prototype into a product that lasts.',
      checkQuestion: 'Your firefly circuit has 6 LEDs, 6 resistors, an Arduino Nano, and an LDR. How many unique copper traces do you need on the PCB? (Hint: count connections, not components.)',
      checkAnswer: 'Each LED needs 2 traces (pin to resistor, resistor to ground). That\'s 12 traces for LEDs. Arduino Nano connects to 6 LED pins + power + ground + LDR = 9 traces. The LDR needs 2 traces. Shared ground rail reduces total. Roughly 15-20 unique traces after optimization. A good PCB layout minimizes trace count by using ground planes and power rails.',
      codeIntro: 'Simulate PCB trace routing — an algorithm that finds paths between component pads while avoiding conflicts.',
      code: `// PCB Design: Trace Routing Simulator
// Route copper traces between component pads

void setup() {
  Serial.println("=============================");
  Serial.println("  PCB DESIGN: Firefly Board");
  Serial.println("=============================");
  Serial.println("");

  // Component placement (grid coordinates)
  Serial.println("--- Component Placement ---");
  Serial.println("  Arduino Nano:  (5, 3) - (5, 12)");
  Serial.println("  LED1 (pin 3):  (2, 4)");
  Serial.println("  LED2 (pin 5):  (2, 6)");
  Serial.println("  LED3 (pin 6):  (2, 8)");
  Serial.println("  R1 (220 ohm):  (3, 4)");
  Serial.println("  R2 (220 ohm):  (3, 6)");
  Serial.println("  R3 (220 ohm):  (3, 8)");
  Serial.println("  LDR + R4:      (8, 5)");
  Serial.println("  Power header:  (8, 10)");
  Serial.println("");
}

void loop() {
  // Simulate trace routing
  Serial.println("--- Routing Traces ---");
  Serial.println("Trace 1: Arduino D3 -> R1 pad A");
  Serial.println("  Path: (5,4) -> (4,4) -> (3,4)");
  Serial.println("  Length: 2 units | Width: 0.25mm");
  analogWrite(2, 100);
  delay(400);

  Serial.println("Trace 2: R1 pad B -> LED1 anode");
  Serial.println("  Path: (3,4) -> (2,4)");
  Serial.println("  Length: 1 unit | Width: 0.25mm");
  analogWrite(3, 100);
  delay(400);

  Serial.println("Trace 3: LED1 cathode -> GND rail");
  Serial.println("  Path: (2,4) -> (1,4) -> (1,1) [ground plane]");
  Serial.println("  Length: 4 units | Width: 0.5mm (power)");
  delay(400);

  Serial.println("");
  Serial.println("--- Design Rule Check ---");
  Serial.println("  Min trace spacing: 0.2mm ... PASS");
  Serial.println("  Min trace width: 0.25mm ... PASS");
  Serial.println("  All nets connected: 15/15 ... PASS");
  Serial.println("  No overlapping pads ... PASS");
  Serial.println("  Thermal relief on GND pads ... PASS");
  analogWrite(2, 255);
  analogWrite(3, 255);
  analogWrite(4, 255);
  delay(600);

  Serial.println("");
  Serial.println("--- Gerber Export ---");
  Serial.println("  F.Cu   (front copper)  ... exported");
  Serial.println("  B.Cu   (back copper)   ... exported");
  Serial.println("  F.Mask (solder mask)   ... exported");
  Serial.println("  F.Silk (silkscreen)    ... exported");
  Serial.println("  Drill  (PTH + NPTH)    ... exported");
  Serial.println("");
  Serial.println("Board size: 40mm x 30mm");
  Serial.println("Est. cost: $1.60 for 5 boards (JLCPCB)");
  Serial.println("");

  analogWrite(2, 0);
  analogWrite(3, 0);
  analogWrite(4, 0);
  delay(1200);
}`,
      ledCount: 3,
      challenge: 'Real PCB design tools: KiCad (free, professional-grade), EasyEDA (browser-based, integrated with JLCPCB). Try KiCad\'s tutorial — design a simple LED circuit board and export Gerbers. Your first real PCB can be manufactured for under $5.',
      successHint: 'PCB design is where software meets physical manufacturing. The skills — schematic capture, layout, DRC, Gerber export — are directly transferable to professional hardware engineering. Every IoT device, every robot, every medical instrument starts as a PCB design.',
    },
    {
      title: 'Soldering technique — permanent connections',
      concept: `Soldering is the process of joining two metal surfaces using a filler metal (**solder**) that melts at a relatively low temperature (~180-220°C). When the solder cools, it forms a strong electrical and mechanical bond.

**Through-hole vs. SMD:**
- **Through-hole (THT)** — component leads poke through holes in the PCB and are soldered on the back. Easier for beginners. Used for connectors, large components, and anything that needs mechanical strength.
- **Surface mount (SMD)** — tiny components are soldered directly onto pads on the PCB surface. No holes. Components can be incredibly small (0402 = 1mm × 0.5mm). Used in phones, laptops — anything where space matters. Requires tweezers, flux, and steady hands (or a pick-and-place machine).

**Soldering fundamentals:**
1. **Tip temperature**: 350°C for leaded solder, 380°C for lead-free
2. **The technique**: heat the PAD and the LEAD simultaneously for 2 seconds, then feed solder into the joint (not onto the iron). The solder should flow onto the heated surfaces by capillary action.
3. **A good joint**: shiny, concave fillet (volcano shape). Covers the pad, wraps around the lead. ~2 seconds total.
4. **A cold joint**: dull, lumpy, grainy. Caused by not enough heat or moving the parts before solder solidified. Unreliable — rework it.
5. **Safety**: fume extractor (solder flux smoke is irritating), wash hands after (lead solder), never touch the tip, use a heat-resistant mat.

**Flux** is a chemical that cleans oxide from metal surfaces, allowing solder to flow. Most solder wire has a flux core. For SMD rework, external flux paste is essential.`,
      analogy: 'Soldering is like welding for electronics — but at much lower temperatures and much smaller scale. Think of it like gluing two pieces of metal together with liquid metal. The key insight: you heat the PARTS, not the glue. The glue (solder) flows onto hot surfaces. If you heat the glue directly, it balls up and doesn\'t stick.',
      storyConnection: 'The artisans of Majuli who build the Satras (monasteries) join wooden beams with traditional mortise-and-tenon joints — strong, permanent, and requiring skill. Soldering is the electronic equivalent: a permanent joint that, done correctly, will last decades. Done poorly, it\'s the weakest link in the entire circuit.',
      checkQuestion: 'You\'re soldering a resistor lead to a PCB pad. You hold the iron to the pad for 5 seconds but the solder won\'t flow. What\'s wrong?',
      checkAnswer: 'Most likely: the tip is dirty (oxidized), preventing heat transfer. Solution: clean with brass sponge, re-tin the tip. Other possibilities: pad is connected to a large ground plane (heat sinking — use a higher temperature or preheat), or the pad/lead is contaminated with oxide (apply flux). A clean, tinned tip on a clean pad should achieve solder flow in 2 seconds.',
      codeIntro: 'Simulate soldering temperature profiles and joint quality assessment — the physics behind good solder joints.',
      code: `// Soldering Simulator: Temperature & Joint Quality
// Understanding heat profiles and joint assessment

void setup() {
  Serial.println("============================");
  Serial.println("  SOLDERING STATION SIM");
  Serial.println("============================");
  Serial.println("");
  Serial.println("Iron: Hakko FX-888D");
  Serial.println("Tip: Chisel 2.4mm");
  Serial.println("Solder: 63/37 Sn/Pb 0.8mm");
  Serial.println("Melting point: 183°C");
  Serial.println("");
}

void loop() {
  // Simulate soldering sequence
  Serial.println("=== JOINT 1: Through-hole resistor ===");
  Serial.println("Step 1: Heat pad + lead (2 sec)");
  Serial.println("  Tip temp: 350°C");
  Serial.println("  Pad temp: 0°C -> 120°C -> 210°C");
  analogWrite(2, 80);
  delay(400);
  analogWrite(2, 160);
  delay(400);
  analogWrite(2, 255);
  delay(400);

  Serial.println("Step 2: Feed solder (1 sec)");
  Serial.println("  Solder melting... flowing...");
  Serial.println("  Flux activating: cleaning surfaces");
  analogWrite(3, 255);
  delay(500);

  Serial.println("Step 3: Remove iron, let cool (3 sec)");
  Serial.println("  Joint temp: 250°C -> 183°C (solidifying)");
  Serial.println("  Joint temp: 183°C -> 80°C -> 25°C");
  analogWrite(2, 180);
  analogWrite(3, 180);
  delay(300);
  analogWrite(2, 80);
  analogWrite(3, 80);
  delay(300);
  analogWrite(2, 0);
  analogWrite(3, 0);
  delay(300);

  Serial.println("");
  Serial.println("Quality check:");
  Serial.println("  Shape: concave fillet ... GOOD");
  Serial.println("  Surface: shiny, smooth ... GOOD");
  Serial.println("  Coverage: pad + lead wetted ... GOOD");
  Serial.println("  Resistance: < 0.01 ohm ... PASS");
  Serial.println("");

  // Bad joint example
  Serial.println("=== JOINT 2: Cold joint (DEFECTIVE) ===");
  Serial.println("Step 1: Iron on pad only (lead not heated)");
  analogWrite(2, 120);
  delay(400);
  Serial.println("Step 2: Solder applied to iron (WRONG!)");
  Serial.println("  Solder balls up, doesn't flow to lead");
  analogWrite(4, 120);
  delay(400);
  analogWrite(2, 0);
  analogWrite(4, 0);

  Serial.println("");
  Serial.println("Quality check:");
  Serial.println("  Shape: convex blob ... BAD");
  Serial.println("  Surface: dull, grainy ... BAD");
  Serial.println("  Coverage: solder on pad only ... BAD");
  Serial.println("  Resistance: 47 ohms! ... FAIL");
  Serial.println("  Action: REWORK REQUIRED");
  Serial.println("");

  // SMD comparison
  Serial.println("=== SMD vs THT comparison ===");
  Serial.println("Through-hole (0805 resistor):");
  Serial.println("  Size: 7.5mm x 3.2mm");
  Serial.println("  Technique: iron + solder wire");
  Serial.println("  Skill: beginner");
  Serial.println("");
  Serial.println("Surface mount (0402 resistor):");
  Serial.println("  Size: 1.0mm x 0.5mm");
  Serial.println("  Technique: tweezers + flux + drag");
  Serial.println("  Skill: intermediate");
  Serial.println("  Or: solder paste + hot air / reflow oven");
  Serial.println("");

  delay(2000);
}`,
      ledCount: 3,
      challenge: 'Watch a soldering tutorial (EEVblog #180 is the classic). Key practice: solder 20 through-hole joints on a practice board before touching your firefly PCB. Muscle memory matters more than theory here.',
      successHint: 'Soldering is a physical skill — the only way to learn it is to practice it. But understanding WHY you heat the pad (not the solder), WHY flux matters, and HOW to recognize a good joint gives you a massive head start. Every hardware engineer\'s career starts with a soldering iron.',
    },
    {
      title: 'Power management — keeping the fireflies alive',
      concept: `Your Arduino runs off USB (5V from a computer). But a standalone firefly jar needs its own power source. **Power management** is the art of choosing the right power source, regulating voltage, and making it last.

**Voltage regulators:**
Most components need specific voltages. A 9V battery can't connect directly to a 3.3V sensor — it would fry instantly. A **voltage regulator** steps down (or up) voltage:
- **Linear regulators** (LM7805): simple, reliable, but waste excess voltage as heat. Efficiency: V_out / V_in. A 7805 fed with 9V outputting 5V: 5/9 = 56% efficient. The other 44% is pure heat.
- **Switching regulators** (buck/boost converters): use inductors and rapid switching to convert voltage at 85-95% efficiency. More complex circuit, but critical for battery applications.

**Battery selection:**
- **9V alkaline**: convenient, but only ~500mAh. At 100mA draw, lasts 5 hours.
- **4x AA alkaline**: 6V, ~2500mAh. At 100mA, lasts 25 hours.
- **Li-ion 18650**: 3.7V, ~2600mAh, rechargeable. Best energy density. Needs a charge controller (TP4056) and protection circuit.
- **LiPo pouch**: 3.7V, various capacities, rechargeable. Light, flat. Used in drones and phones.

**Power budget calculation:**
List every component, its voltage, and its current draw. Sum the currents. Multiply by safety margin (1.2x). This tells you what battery and regulator you need.

**Sleep modes** — an Arduino Nano draws ~19mA even doing nothing. In power-down sleep mode: ~5uA. Wake on timer or external interrupt. For a battery jar that only glows at night, sleep mode extends battery life from days to months.`,
      analogy: 'Power management is like a water distribution system. The reservoir (battery) has a capacity. The main pipe (regulator) steps down the water pressure (voltage) to what each house (component) needs. A linear regulator is like a pressure-relief valve — excess pressure is wasted as noise/heat. A switching regulator is like a turbine — it captures the excess energy and recycles it.',
      storyConnection: 'Majuli has unreliable grid power — Joon\'s jar needs to run on batteries for days. Power management isn\'t optional; it\'s survival. A jar that dies after 4 hours is a toy. One that runs for 3 months on 2 AA batteries is a product. The difference is engineering: sleep modes, efficient regulators, and a careful power budget.',
      checkQuestion: 'Your firefly jar has: Arduino Nano (19mA active, 0.005mA sleep), 6 LEDs (20mA each at full brightness, average 8mA with PWM), LDR circuit (0.5mA). Active 8 hours/day (night), sleep 16 hours. What\'s the daily mAh consumption?',
      checkAnswer: 'Active current: 19 + (6 × 8) + 0.5 = 67.5mA × 8h = 540mAh. Sleep current: 0.005 + 0.5 = 0.505mA × 16h = 8.1mAh. Total daily: 548.1mAh. A 2600mAh 18650 battery lasts ~4.7 days. Two in parallel: ~9.5 days. Add a solar panel (6V, 1W) for indefinite runtime — charge during the day, glow at night.',
      codeIntro: 'Simulate a power management system: battery monitoring, sleep/wake cycles, and power budget tracking.',
      code: `// Power Management: Battery + Sleep Mode Simulator
// Optimizing the firefly jar for months of runtime

void setup() {
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  Serial.println("=============================");
  Serial.println("  POWER MANAGEMENT SYSTEM");
  Serial.println("=============================");
  Serial.println("Battery: 18650 Li-ion 3.7V 2600mAh");
  Serial.println("Regulator: LM7805 (5V out)");
  Serial.println("");
}

void loop() {
  // Power budget report
  Serial.println("=== POWER BUDGET ===");
  Serial.println("Component        | mA (active) | mA (sleep)");
  Serial.println("-----------------+-------------+----------");
  Serial.println("Arduino Nano     |   19.0      |  0.005");
  Serial.println("LED 1 (avg PWM)  |    8.0      |  0.000");
  Serial.println("LED 2 (avg PWM)  |    8.0      |  0.000");
  Serial.println("LED 3 (avg PWM)  |    8.0      |  0.000");
  Serial.println("LED 4 (avg PWM)  |    8.0      |  0.000");
  Serial.println("LED 5 (avg PWM)  |    8.0      |  0.000");
  Serial.println("LED 6 (avg PWM)  |    8.0      |  0.000");
  Serial.println("LDR circuit      |    0.5      |  0.500");
  Serial.println("-----------------+-------------+----------");
  Serial.println("TOTAL            |   67.5 mA   |  0.505 mA");
  Serial.println("");
  delay(800);

  // Simulate night cycle (active)
  Serial.println("--- NIGHT MODE (active) ---");
  Serial.println("LDR reading: 45 (dark) -> ACTIVATE");
  analogWrite(2, random(80, 200));
  analogWrite(3, random(60, 180));
  analogWrite(4, random(40, 160));
  Serial.println("LEDs: glowing (67.5 mA draw)");
  Serial.println("Battery: 2600 -> 2532.5 mAh (-67.5)");
  delay(600);

  analogWrite(2, random(100, 255));
  analogWrite(3, random(80, 200));
  analogWrite(4, random(60, 180));
  delay(600);

  // Simulate dawn transition
  Serial.println("");
  Serial.println("--- DAWN DETECTED ---");
  Serial.println("LDR reading: 580 (bright) -> SLEEP");
  analogWrite(2, 40);
  analogWrite(3, 20);
  analogWrite(4, 10);
  delay(300);
  analogWrite(2, 0);
  analogWrite(3, 0);
  analogWrite(4, 0);
  delay(300);

  // Sleep mode
  Serial.println("");
  Serial.println("--- SLEEP MODE ---");
  Serial.println("Power-down sleep activated");
  Serial.println("Watchdog timer: wake every 8 sec to check LDR");
  Serial.println("Draw: 0.505 mA (was 67.5 mA — 99.3% reduction!)");
  Serial.println("");

  // Battery life calculation
  Serial.println("=== BATTERY LIFE ESTIMATE ===");
  Serial.println("Night (8h active):  67.5 mA x 8h = 540 mAh");
  Serial.println("Day (16h sleep):     0.5 mA x 16h = 8 mAh");
  Serial.println("Daily total: 548 mAh");
  Serial.println("2600 mAh battery: 4.7 days");
  Serial.println("+ solar (1W panel): indefinite!");
  Serial.println("");

  // Regulator efficiency comparison
  Serial.println("=== REGULATOR COMPARISON ===");
  Serial.println("LM7805 (linear): 56% efficient");
  Serial.println("  Heat waste: 44% = 297 mW as heat");
  Serial.println("  Battery life: 4.7 days");
  Serial.println("");
  Serial.println("MP1584 (switching): 92% efficient");
  Serial.println("  Heat waste: 8% = 54 mW");
  Serial.println("  Battery life: 7.7 days (+64%!)");
  Serial.println("");

  delay(1500);
}`,
      ledCount: 3,
      challenge: 'Design a solar-powered firefly jar: 6V/1W solar panel charges a 2600mAh 18650 through a TP4056 module during the day. At night, the LDR triggers activation. Calculate: how many hours of sun do you need to replace the nightly power consumption? (Answer: 540mAh at ~85% charge efficiency needs ~635mAh from solar. At 5V/200mA from the panel = 3.2 hours of direct sun.)',
      successHint: 'Power management separates hobby projects from real products. Sleep modes, efficient regulators, and proper battery selection can extend runtime by 100x. Every IoT engineer spends more time on power than on features.',
    },
    {
      title: 'Sensor integration — light-sensing auto-activation',
      concept: `A firefly jar that you manually switch on and off is disappointing. A jar that **senses darkness and activates itself** — like real fireflies — is magical. This requires a **sensor**, a **reading**, and **decision logic**.

**LDR (Light Dependent Resistor):**
An LDR's resistance changes with light:
- Bright light: ~1 kOhm (low resistance)
- Darkness: ~100+ kOhm (high resistance)

Wire it in a **voltage divider** with a fixed resistor (10 kOhm), and the voltage at the midpoint varies with light level. \`analogRead()\` converts this to a 0-1023 value.

**Sensor calibration:**
Raw readings are meaningless without calibration. You need to map real-world conditions to sensor values:
- Cover the LDR completely: note the value (e.g., 12). That's "pitch black."
- Shine a flashlight on it: note the value (e.g., 980). That's "bright."
- Measure at dusk: note the value (e.g., 300). That's your **threshold**.

**Hysteresis — the engineering secret to stable switching:**
Without hysteresis, at the threshold boundary, the jar flickers on and off as light fluctuates around the value. Solution: use TWO thresholds:
- Turn ON when light drops below 250
- Turn OFF when light rises above 350
The 100-unit gap (hysteresis band) prevents flickering. Every thermostat, every sensor-driven system uses this technique.

**Debouncing** is the time-domain equivalent: don't react to a single reading. Require the condition to be true for N consecutive readings (e.g., 5 readings over 1 second all below threshold) before triggering. Protects against shadows, passing clouds, and noise.`,
      analogy: 'Hysteresis is like a thermostat. You set it to 22°C. Without hysteresis, the heater clicks on at 21.9°C and off at 22.1°C — cycling frantically. With hysteresis: on at 21°C, off at 23°C. The 2-degree band prevents rapid cycling. Your firefly jar\'s light sensor needs the same buffer zone.',
      storyConnection: 'Real fireflies don\'t have an on/off switch — they sense the fading light and begin glowing as dusk deepens. The LDR gives our jar the same ability: a sensor that reads the environment and triggers behavior. The jar becomes responsive to its world, just like the fireflies of Majuli.',
      checkQuestion: 'Your LDR reads 320 at dusk. Your ON threshold is 300 and OFF threshold is 400. A cloud passes and the reading dips to 280, then rises to 350, then drops to 310. Does the jar turn on? Does it stay on?',
      checkAnswer: 'At 280: below ON threshold (300) → jar turns ON. At 350: still below OFF threshold (400) → jar STAYS ON. At 310: still below OFF threshold → jar STAYS ON. Without hysteresis (single threshold at 300), the jar would flicker at 310 (above 300 = off, then below = on). Hysteresis keeps it stable.',
      codeIntro: 'Implement a complete sensor integration system with calibration, hysteresis, and debouncing.',
      code: `// Sensor Integration: LDR with hysteresis & debounce
// Auto-activate firefly jar at dusk

void setup() {
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  Serial.println("=============================");
  Serial.println("  SENSOR INTEGRATION SYSTEM");
  Serial.println("=============================");
  Serial.println("Sensor: LDR + 10K voltage divider");
  Serial.println("ADC: 10-bit (0-1023)");
  Serial.println("");
  Serial.println("Calibration:");
  Serial.println("  Dark (covered): 12");
  Serial.println("  Dusk (threshold): ~300");
  Serial.println("  Bright (flashlight): 980");
  Serial.println("");
  Serial.println("Hysteresis band: 250 (ON) to 400 (OFF)");
  Serial.println("Debounce: 5 consecutive readings");
  Serial.println("");
}

void loop() {
  // Simulate sunset sequence
  Serial.println("=== SUNSET SIMULATION ===");
  Serial.println("");

  // Bright afternoon
  Serial.println("[14:00] LDR: 890 | State: OFF | Bright sun");
  analogWrite(2, 0); analogWrite(3, 0); analogWrite(4, 0);
  delay(400);

  // Cloud passes
  Serial.println("[16:00] LDR: 620 | State: OFF | Cloudy");
  Serial.println("  (Above ON threshold 250 — no change)");
  delay(400);

  // Getting dim
  Serial.println("[17:30] LDR: 380 | State: OFF | Fading");
  Serial.println("  (Above ON threshold 250 — no change)");
  delay(400);

  // At threshold zone
  Serial.println("[18:00] LDR: 290 | State: OFF | Dusk");
  Serial.println("  (Below ON threshold 250? NO — debouncing...)");
  delay(400);

  Serial.println("[18:05] LDR: 240 | Below ON threshold!");
  Serial.println("  Debounce: 1/5 readings below threshold");
  delay(200);
  Serial.println("[18:06] LDR: 230 | Debounce: 2/5");
  delay(200);
  Serial.println("[18:07] LDR: 245 | Debounce: 3/5");
  delay(200);
  Serial.println("[18:08] LDR: 220 | Debounce: 4/5");
  delay(200);
  Serial.println("[18:09] LDR: 210 | Debounce: 5/5 -> ACTIVATE!");
  Serial.println("");

  // Fireflies active with gradual turn-on
  Serial.println("*** FIREFLY JAR ACTIVATED ***");
  analogWrite(2, 50);
  delay(200);
  analogWrite(3, 30);
  delay(200);
  analogWrite(4, 20);
  delay(200);

  // Glowing
  analogWrite(2, random(100, 200));
  analogWrite(3, random(60, 160));
  analogWrite(4, random(80, 180));
  Serial.println("[20:00] LDR: 15 | State: ON | Full dark");
  Serial.println("  Fireflies glowing at full pattern");
  delay(600);

  // Car headlights pass — test hysteresis
  Serial.println("");
  Serial.println("[21:00] Car headlights! LDR: 350");
  Serial.println("  Below OFF threshold (400)? NO -> stays ON");
  Serial.println("  Hysteresis prevents false deactivation!");
  analogWrite(2, random(80, 180));
  analogWrite(3, random(60, 140));
  analogWrite(4, random(100, 200));
  delay(600);

  // Dawn
  Serial.println("");
  Serial.println("[05:30] LDR: 380 | Dawn approaching");
  Serial.println("  Below OFF threshold (400)? YES");
  Serial.println("  Debounce: waiting for 5 consecutive...");
  delay(300);
  Serial.println("[05:45] LDR: 420 | Debounce: 3/5 above OFF");
  delay(300);
  Serial.println("[05:50] LDR: 450 | Debounce: 5/5 -> DEACTIVATE");
  Serial.println("");

  // Gradual fade out
  Serial.println("*** FIREFLY JAR DEACTIVATING ***");
  analogWrite(2, 60); analogWrite(3, 40); analogWrite(4, 30);
  delay(300);
  analogWrite(2, 20); analogWrite(3, 10); analogWrite(4, 5);
  delay(300);
  analogWrite(2, 0); analogWrite(3, 0); analogWrite(4, 0);
  Serial.println("Entering sleep mode...");
  Serial.println("");
  delay(1500);
}`,
      ledCount: 3,
      challenge: 'Add a potentiometer (analog input) as a sensitivity control. The user turns a knob to set the threshold for their specific environment — a window sill gets more light than a shelf in the corner. Map analogRead(potPin) to the hysteresis center point.',
      successHint: 'Hysteresis and debouncing are universal engineering patterns. Every thermostat, every touch screen, every industrial sensor uses them. You\'ve learned to make a sensor-driven system that\'s stable and responsive — not just functional, but reliable.',
    },
    {
      title: 'Enclosure design — LEDs in a jar',
      concept: `You have a working circuit, a PCB, and sensor-driven activation. Now you need to **put it in a jar** and make it look like a firefly jar, not an electronics project.

**LED mounting:**
- **Point source** — LED visible directly: harsh, clearly artificial. Not what we want.
- **Diffused** — wrap each LED in translucent material (hot glue, silicone, or a ping-pong ball cut in half). The light scatters, creating a soft glow. Cut ping-pong balls are the classic DIY firefly trick.
- **Fiber optic** — run thin fiber optic strands from each LED to different points in the jar. Each strand tip glows like an individual firefly. Most realistic effect.
- **Spacing** — distribute LEDs at different heights and positions. Avoid grid patterns — randomness looks more natural.

**The jar:**
- Glass mason jar: traditional, beautiful, heavy.
- Plastic jar: lighter, shatter-proof, cheaper. Frosted plastic diffuses light naturally.
- **Seal**: if outdoors, the jar needs a weather-resistant seal. Silicone gasket + rubber cable gland for the power wire.

**Waterproofing (IP rating):**
- **IP20**: no protection (bare PCB). Indoor only.
- **IP44**: splash-resistant. Conformal coating on the PCB + sealed jar lid.
- **IP67**: submersible. Full potting (embed PCB in epoxy resin). Extreme but permanent.

**Conformal coating**: a thin layer of acrylic or silicone sprayed on the PCB. Protects against humidity, dust, and corrosion. Essential for anything in Assam's monsoon climate. Cost: ~$10 for a can that covers dozens of boards.

**Thermal considerations:** LEDs generate heat. In an enclosed jar, heat builds up. Calculate: 6 LEDs at 20mA × 2V forward voltage = 240mW of heat. Small, but in a sealed jar on a hot day, internal temp can reach 50-60°C. Ventilation holes (covered with mesh to keep bugs out) or thermally conductive mounting can help.`,
      analogy: 'An enclosure is packaging — the difference between a loose pile of ingredients and a beautifully plated dish. The food (circuit) is the same, but presentation determines whether people engage with it. Industrial design is engineering with empathy: making technology approachable.',
      storyConnection: 'Joon didn\'t just build a circuit — he built a firefly jar that sat on Aita\'s shelf and brought joy to everyone who saw it. The glass, the diffusion, the soft glow through frosted surfaces — these aren\'t engineering extras. They\'re the whole point. The enclosure is what transforms a circuit into an experience.',
      checkQuestion: 'Your jar will sit outdoors on Majuli during monsoon season (90% humidity, heavy rain, 35°C). Which IP rating do you need, and what specific measures would you take?',
      checkAnswer: 'Minimum IP44 (splash-proof). Measures: conformal coat the PCB, seal the jar lid with silicone gasket, use a cable gland for the charging wire, add a small silica gel packet inside to absorb residual moisture. For "set and forget" deployment: IP67 with full epoxy potting — but then you can\'t access the battery. Best compromise: IP44 with a removable lid for battery access, conformal coating, and a good gasket.',
      codeIntro: 'Simulate thermal management and enclosure environment monitoring inside the sealed jar.',
      code: `// Enclosure Design: Thermal & Environmental Monitor
// Tracking conditions inside the sealed firefly jar

void setup() {
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  Serial.println("============================");
  Serial.println("  ENCLOSURE MONITOR");
  Serial.println("============================");
  Serial.println("Jar: 500mL frosted glass mason jar");
  Serial.println("Seal: Silicone gasket + cable gland");
  Serial.println("Coating: Conformal acrylic on PCB");
  Serial.println("IP rating: IP44 (splash-proof)");
  Serial.println("");
}

void loop() {
  // LED diffusion comparison
  Serial.println("=== LED DIFFUSION TEST ===");
  Serial.println("");

  Serial.println("Test 1: Bare LED (no diffusion)");
  Serial.println("  Beam angle: 20 degrees (harsh spot)");
  analogWrite(2, 255);
  analogWrite(3, 0);
  analogWrite(4, 0);
  delay(500);

  Serial.println("Test 2: Hot-glue diffuser");
  Serial.println("  Beam angle: 120 degrees (soft glow)");
  analogWrite(2, 0);
  analogWrite(3, 180);
  analogWrite(4, 0);
  delay(500);

  Serial.println("Test 3: Ping-pong ball half");
  Serial.println("  Beam angle: 270 degrees (firefly-like!)");
  analogWrite(2, 0);
  analogWrite(3, 0);
  analogWrite(4, 140);
  delay(500);

  analogWrite(2, 0); analogWrite(3, 0); analogWrite(4, 0);
  Serial.println("");

  // Thermal simulation
  Serial.println("=== THERMAL SIMULATION ===");
  Serial.println("Ambient: 30°C | 6 LEDs active");
  Serial.println("");
  Serial.println("Time  | Jar Temp | LED Temp | Status");
  Serial.println("------+----------+----------+-------");
  Serial.println("0 min |  30.0°C  |  30.0°C  | OK");
  analogWrite(2, 80);
  delay(300);
  Serial.println("30min |  34.2°C  |  38.5°C  | OK");
  analogWrite(2, 120); analogWrite(3, 60);
  delay(300);
  Serial.println("1 hr  |  37.8°C  |  42.1°C  | OK");
  analogWrite(2, 160); analogWrite(3, 100);
  delay(300);
  Serial.println("2 hr  |  39.5°C  |  44.2°C  | OK");
  analogWrite(2, 180); analogWrite(3, 140); analogWrite(4, 80);
  delay(300);
  Serial.println("4 hr  |  40.1°C  |  45.0°C  | STABLE");
  Serial.println("");
  Serial.println("Thermal equilibrium reached at 40°C");
  Serial.println("Max LED junction temp: 45°C (limit: 85°C)");
  Serial.println("Status: SAFE — no cooling needed");
  delay(500);

  analogWrite(2, 0); analogWrite(3, 0); analogWrite(4, 0);

  // Humidity simulation
  Serial.println("");
  Serial.println("=== MONSOON HUMIDITY TEST ===");
  Serial.println("External: 95% RH, 32°C, rain");
  Serial.println("");
  Serial.println("Gasket seal: HOLDING (pressure stable)");
  Serial.println("Internal humidity: 45% RH");
  Serial.println("Silica gel: absorbing residual moisture");
  Serial.println("Conformal coat: protecting traces");
  Serial.println("Cable gland: sealed, no water ingress");
  Serial.println("");

  // Bill of materials for enclosure
  Serial.println("=== ENCLOSURE BOM ===");
  Serial.println("Item                | Cost (INR)");
  Serial.println("--------------------+----------");
  Serial.println("Mason jar 500mL     |   80");
  Serial.println("Silicone gasket     |   25");
  Serial.println("Cable gland PG7     |   15");
  Serial.println("Ping-pong balls x6  |   30");
  Serial.println("Hot glue sticks x5  |   20");
  Serial.println("Conformal coat spray|   40 (per unit)");
  Serial.println("Silica gel packet   |    5");
  Serial.println("--------------------+----------");
  Serial.println("Total enclosure     |  215 INR");
  Serial.println("");
  delay(1500);
}`,
      ledCount: 3,
      challenge: 'Design a mounting bracket that holds the PCB centered inside the jar with the LDR facing the glass (for light sensing) and LEDs distributed around the perimeter. Consider: can you 3D-print it? Laser-cut acrylic? Or bend it from sheet metal?',
      successHint: 'Enclosure design is where engineering meets industrial design. The best circuit in the world is worthless if it falls apart, overheats, or looks ugly. Waterproofing, thermal management, and diffusion are what separate a prototype from a product people actually want to own.',
    },
    {
      title: 'From prototype to product — BOM, cost analysis, production',
      concept: `You've built one firefly jar. Now imagine building 100. Or 1,000. The jump from **prototype to product** is where engineering meets business.

**Bill of Materials (BOM):**
Every component, its quantity, unit cost, and supplier. Your prototype might use a $25 Arduino Nano — but in production, you'd use a bare ATmega328P chip ($2.50) on your PCB, or an ESP32-C3 ($1.50) for even more capability. The Arduino board is a development tool, not a production component.

**Cost optimization:**
- **MCU**: Arduino Nano ($25) → ATmega328P bare chip ($2.50) → ESP8266 ($1.20, adds WiFi)
- **Resistors**: $0.10 each from a hobby shop → $0.005 each in reels of 5000
- **LEDs**: $0.50 each → $0.02 each in bulk
- **PCB**: $5 each (prototype) → $0.30 each (production panel of 100)
- **Assembly**: hand-soldered → pick-and-place machine ($0.02/component)

**Volume pricing tiers:**
| Quantity | Unit Cost | Total |
|----------|-----------|-------|
| 1 (proto)| ~2,500 INR| 2,500 |
| 10       | ~800 INR  | 8,000 |
| 100      | ~350 INR  | 35,000|
| 1000     | ~180 INR  | 1,80,000|

**Testing in production:**
- **ICT (In-Circuit Test)** — probe every connection on the PCB, verify continuity
- **Functional test** — power up, check LEDs light up, check LDR responds
- **Burn-in** — run for 24 hours to catch infant mortality failures
- **Quality sampling** — test 10% of units thoroughly; if any fail, test the whole batch

**Certification:**
- **BIS (India)** — required for selling electronic products in India
- **CE (Europe)** — conformity with EU safety standards
- **FCC (USA)** — electromagnetic compatibility (your circuit doesn't interfere with others)
- Each costs $500-5000 and takes 4-12 weeks`,
      analogy: 'Building one house vs. developing a housing colony. One house is craft — you pick materials by hand, adjust as you go. A colony is engineering: standardized plans, bulk material procurement, assembly-line processes, quality inspections. The first house might cost 10x per square foot compared to the hundredth. That\'s the prototype-to-production curve.',
      storyConnection: 'Dipankar started with one library in his backyard. When neighboring villages wanted their own, he couldn\'t build each one from scratch. He needed standardized shelving (PCB), bulk book procurement (BOM optimization), a setup guide (assembly instructions), and quality standards (testing). Scaling is a fundamentally different challenge than building one.',
      checkQuestion: 'Your prototype firefly jar costs 2,500 INR in components. You think you can sell it for 1,500 INR. Is this viable?',
      checkAnswer: 'Not at prototype cost (2,500 > 1,500). But at 100-unit production cost (350 INR per unit), your margin is 1,500 - 350 = 1,150 INR per jar (77% gross margin). After packaging (100 INR), shipping (50 INR), and marketing (200 INR amortized), net margin is ~800 INR (53%). That\'s a viable product. The math only works at scale.',
      codeIntro: 'Run a production cost analyzer that calculates BOM costs at different volumes and estimates break-even.',
      code: `// Production Engineering: BOM & Cost Analyzer
// From prototype to product — the numbers

void setup() {
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  Serial.println("==============================");
  Serial.println("  PRODUCTION COST ANALYZER");
  Serial.println("  Firefly Jar v1.0");
  Serial.println("==============================");
  Serial.println("");
}

void loop() {
  // Prototype BOM
  Serial.println("=== PROTOTYPE BOM (1 unit) ===");
  Serial.println("Component           | Qty | Unit   | Total");
  Serial.println("--------------------+-----+--------+------");
  Serial.println("Arduino Nano clone  |  1  | 450 INR| 450");
  Serial.println("Green LED 5mm       |  6  |  10    |  60");
  Serial.println("220 ohm resistor    |  6  |   5    |  30");
  Serial.println("10K resistor        |  1  |   5    |   5");
  Serial.println("LDR (GL5528)        |  1  |  15    |  15");
  Serial.println("PCB (prototype)     |  1  | 200    | 200");
  Serial.println("18650 battery       |  1  | 150    | 150");
  Serial.println("TP4056 charger      |  1  |  30    |  30");
  Serial.println("Mason jar + parts   |  1  | 215    | 215");
  Serial.println("Wires, solder, misc |  -  |  50    |  50");
  Serial.println("--------------------+-----+--------+------");
  Serial.println("PROTOTYPE TOTAL     |     |        | 1,205");
  Serial.println("+ Assembly (1 hr)   |     |        |   200");
  Serial.println("TOTAL COST          |     |        | 1,405");
  analogWrite(2, 80);
  delay(800);

  Serial.println("");
  Serial.println("=== PRODUCTION BOM (100 units) ===");
  Serial.println("Component           | Qty | Unit   | Total");
  Serial.println("--------------------+-----+--------+------");
  Serial.println("ESP8266 module      | 100 |  90 INR| 9,000");
  Serial.println("Green LED 5mm       | 600 |   2    | 1,200");
  Serial.println("SMD resistor 220R   | 600 |  0.5   |   300");
  Serial.println("SMD resistor 10K    | 100 |  0.5   |    50");
  Serial.println("LDR (GL5528)        | 100 |   8    |   800");
  Serial.println("PCB (panelized)     | 100 |  15    | 1,500");
  Serial.println("18650 battery       | 100 |  90    | 9,000");
  Serial.println("TP4056 charger      | 100 |  12    | 1,200");
  Serial.println("Enclosure kit       | 100 | 120    |12,000");
  Serial.println("SMD assembly        | 100 |  25    | 2,500");
  Serial.println("--------------------+-----+--------+------");
  Serial.println("TOTAL (100 units)   |     |        |37,550");
  Serial.println("PER UNIT COST       |     |        |   376");
  analogWrite(3, 80);
  delay(800);

  Serial.println("");
  Serial.println("=== COST SCALING CURVE ===");
  Serial.println("Volume | Unit Cost | Savings vs Prototype");
  Serial.println("-------+-----------+--------------------");
  Serial.println("     1 | 1,405 INR |  (baseline)");
  Serial.println("    10 |   720 INR |  49% savings");
  Serial.println("   100 |   376 INR |  73% savings");
  Serial.println("  1000 |   185 INR |  87% savings");
  Serial.println(" 10000 |   120 INR |  91% savings");
  analogWrite(4, 80);
  delay(800);

  Serial.println("");
  Serial.println("=== BUSINESS MODEL ===");
  Serial.println("Retail price: 999 INR");
  Serial.println("Production cost (100 units): 376 INR");
  Serial.println("Packaging + shipping: 120 INR");
  Serial.println("Marketing (amortized): 80 INR");
  Serial.println("---");
  Serial.println("Gross margin: 623 INR (62%)");
  Serial.println("Net margin: 423 INR (42%)");
  Serial.println("");
  Serial.println("Break-even: sell 89 units");
  Serial.println("  (37,550 production + 5,000 tooling)");
  Serial.println("  / (999 - 120 - 80) per unit");
  Serial.println("  = 53 units to cover production");
  Serial.println("  + 36 units for fixed costs");

  // Victory animation
  Serial.println("");
  Serial.println("=== QUALITY TEST (sample unit) ===");
  Serial.println("ICT: all connections verified ... PASS");
  Serial.println("LED test: 6/6 responding ... PASS");
  Serial.println("LDR test: dark=18, light=940 ... PASS");
  Serial.println("Sleep current: 0.48 mA ... PASS");
  Serial.println("Seal test: IP44 verified ... PASS");
  Serial.println("");
  Serial.println("Unit APPROVED for shipping.");

  analogWrite(2, 255); analogWrite(3, 255); analogWrite(4, 255);
  delay(400);
  analogWrite(2, random(80, 200));
  analogWrite(3, random(60, 160));
  analogWrite(4, random(40, 140));
  delay(400);
  analogWrite(2, random(100, 255));
  analogWrite(3, random(80, 200));
  analogWrite(4, random(60, 180));
  delay(400);
  analogWrite(2, 0); analogWrite(3, 0); analogWrite(4, 0);
  delay(1500);
}`,
      ledCount: 3,
      challenge: 'Replace the Arduino Nano with an ESP8266/ESP32 in your design. Now your firefly jar has WiFi — you can add a web interface for color, brightness, and pattern control. The ESP8266 costs 90 INR vs. 450 INR for the Nano, AND adds wireless capability. That\'s production thinking: better AND cheaper.',
      successHint: 'From a single LED on a breadboard to a production-ready product with BOM, cost analysis, testing, and certification. You\'ve traced the entire hardware engineering pipeline — the same one used by companies building everything from LED lamps to satellites. The firefly jar is just the beginning.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Level 3: Hardware Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">From prototype to production-ready hardware</span>
      </div>

      <div className="mb-8 bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4 border border-teal-200 dark:border-teal-800">
        <p className="text-sm text-teal-800 dark:text-teal-300">
          These lessons take your firefly jar from a breadboard prototype to a manufactured product. You'll learn PCB design, soldering, power management, sensor integration, enclosure engineering, and production scaling — the complete hardware engineering pipeline.
        </p>
      </div>

      <div className="space-y-8">
        {lessons.map((lesson, i) => (
          <CircuitMiniLesson key={i} lesson={lesson} number={i + 1} />
        ))}
      </div>
    </div>
  );
}
