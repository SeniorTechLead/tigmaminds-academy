import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'arduino-simulator',
  title: 'Arduino Simulator',
  category: 'electronics',
  icon: '🖥️',
  tagline: 'Test circuits without physical hardware',
  relatedStories: ['firefly-festival-of-majuli', 'river-dolphins-secret'],

  understand: [
    {
      title: 'Why Simulate Instead of Using Real Hardware?',
      beginnerContent:
        'Real Arduino boards and components cost money and take time to ship. A simulator lets ' +
        'you build virtual circuits, write code, and test everything in your browser — for free, ' +
        'instantly. You can wire an LED backwards, short-circuit a virtual battery, or accidentally ' +
        'send too much voltage to a sensor, and nothing breaks. You just click "undo" and try again. ' +
        'This makes learning much faster because you can experiment fearlessly. Professionals use ' +
        'simulators too: engineers simulate rocket circuits before building them, because testing ' +
        'on a real rocket is expensive and risky.',
      intermediateContent:
        'Tinkercad (free, browser-based) simulates Arduino circuits: drag components, wire them, write code, and run. The simulator shows real-time voltage, current, and pin states. Starter projects: (1) Blink LED with variable delay, (2) Potentiometer → LED brightness via PWM, (3) Temperature sensor → serial monitor, (4) Ultrasonic distance → LED bar graph. Simulation catches wiring errors, logic bugs, and timing issues without risking hardware.',
      advancedContent:
        'Professional embedded development uses hardware-in-the-loop (HIL) simulation: microcontroller runs real firmware while sensors are simulated. This tests edge cases (sensor reads -40°C, GPS drops) that are hard to reproduce physically. PlatformIO supports unit testing on simulated hardware. For complex systems (drones, robots), Software-in-the-Loop (SIL) simulates both hardware and firmware. Continuous integration pipelines run automated tests on every commit, catching regressions before they reach physical devices.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'In a simulator, wiring an LED backwards will physically damage your computer.', answer: false, explanation: 'Nothing physical can break in a simulator. You just click undo and try again, which is exactly why simulators are great for learning.' },
            { text: 'Professional engineers use simulators to test circuits before building the real thing.', answer: true, explanation: 'Simulation saves time and money. Testing on a real rocket or satellite is expensive, so engineers verify designs virtually first.' },
          ],
        },
      },
    },
    {
      title: 'What You See in the Simulator',
      beginnerContent:
        'A typical Arduino simulator (like Wokwi or Tinkercad Circuits) shows three main areas. ' +
        'First, the *code editor* where you write your Arduino sketch — it looks just like the real ' +
        'Arduino IDE. Second, the *circuit view* where you drag and drop components (LEDs, resistors, ' +
        'sensors, wires) onto a virtual breadboard and connect them to the Arduino board. Third, the ' +
        '*serial monitor* that shows text output from your program, just like the real one. Some ' +
        'simulators also show an oscilloscope view so you can see voltage changing over time.',
      intermediateContent:
        'Building in simulation: (1) Draw a schematic, (2) Calculate component values (R = (V_supply - V_LED)/I_LED), (3) Wire in simulator, (4) Write code, (5) Test and debug. Traffic light project: 3 LEDs with 220Ω resistors on pins 2, 3, 4. Code sequences through green-yellow-red with appropriate delays. Add a pedestrian button: if(digitalRead(7) == LOW) { pedestrianSequence(); }. The simulator\'s serial monitor displays debug output just like real hardware.',
      advancedContent:
        'Moving from simulation to real hardware introduces: component tolerances (a "100Ω" resistor might be 95-105Ω), wire resistance, breadboard contact resistance (~0.1Ω), and electromagnetic interference (EMI). Decoupling capacitors (100nF ceramic near IC power pins) filter noise. Pull-up/pull-down resistors (10kΩ) ensure defined input states. Power supply considerations: USB provides 5V/500mA, but motors and LED strips need external power. Level shifting is needed when interfacing 5V Arduino with 3.3V sensors — a voltage divider or dedicated level shifter IC prevents damage.',
      diagram: 'CircuitDiagram',
    },
    {
      title: 'Common Mistakes (and Why Simulation Helps)',
      beginnerContent:
        'The most common beginner mistake is forgetting to set the pin mode — your LED does nothing ' +
        'because you never told the Arduino whether the pin is an INPUT or OUTPUT. Another common ' +
        'issue: connecting an LED without a resistor, which in real life burns it out instantly. ' +
        'In the simulator, the LED might blink red to warn you, but it will not literally catch fire. ' +
        'Other frequent errors: using the wrong pin number, forgetting Serial.begin() before printing, ' +
        'or mixing up analogRead (for sensors, returns 0-1023) with digitalRead (for buttons, ' +
        'returns HIGH or LOW). The simulator\'s serial monitor helps you debug all of these by ' +
        'printing values so you can see exactly what your code is doing.',
      intermediateContent:
        'Top simulator-catchable mistakes: (1) Forgetting a resistor with an LED — in simulation, the virtual LED shows "burned out." (2) Wrong pin mode — writing to a pin set as INPUT does nothing. (3) Reversed LED polarity — the long leg (anode) goes to positive. (4) Missing ground connection — circuit is not complete, nothing works. (5) analogRead on a digital-only pin — returns meaningless values. (6) Using delay() in a time-sensitive loop — blocks all other code. The serial monitor is your best debugging tool: Serial.println(analogRead(A0)) confirms the sensor is wired correctly.',
      advancedContent:
        'Debugging embedded systems differs from desktop programming: no debugger breakpoints on basic Arduino (the ATmega328P lacks hardware debug support). Serial.println() is the primary debugging tool. Timing issues: millis() overflow after ~50 days (use unsigned long subtraction, which handles overflow correctly). Memory issues: 2KB SRAM fills fast with strings — use F() macro for string literals: Serial.println(F("This stays in flash")). Stack overflow from deep recursion crashes silently. On ESP32 and ARM-based boards, JTAG debugging with breakpoints and variable inspection is available through hardware debug probes.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match the common Arduino mistake to the symptom',
          pairs: [
            ['Forgot pinMode()', 'LED does nothing when you write HIGH to the pin'],
            ['Missing resistor on LED', 'LED burns out (real) or shows a warning (simulator)'],
            ['Wrong pin number', 'Code runs but nothing happens on the expected component'],
            ['Forgot Serial.begin()', 'Serial.print() produces no output in the monitor'],
            ['Used digitalRead for analog sensor', 'Only get HIGH or LOW instead of a 0-1023 range'],
          ],
        },
      },
    },
    {
      title: 'From Simulation to Real Hardware',
      beginnerContent:
        'Once your simulated circuit works, moving to real hardware is straightforward. Buy the ' +
        'same components you used in the simulator, wire them the same way on a real breadboard, ' +
        'and upload the same code to a real Arduino via USB. The only differences: real components ' +
        'have tolerances (a "100 ohm" resistor might actually be 98 or 102 ohms), real wires can ' +
        'come loose, and real sensors have noise. But the logic and code stay exactly the same. ' +
        'Start in simulation, finish with real hardware.',
      intermediateContent:
        'Transitioning checklist: (1) Double-check component values (resistors, capacitors) against schematic. (2) Check power supply: USB provides 5V/500mA — motors need external power. (3) Test each component individually before combining. (4) Use a multimeter: voltage mode checks supply, resistance mode checks connections, continuity mode finds broken wires (beep = connected). (5) Start with the simplest version that proves the concept works, then add complexity. (6) Secure connections: breadboard prototypes → soldered perfboard → custom PCB for permanent projects.',
      advancedContent:
        'PCB (Printed Circuit Board) design moves projects from prototype to product. KiCad (free, open-source) handles schematic capture and board layout. Design rules: trace width determines current capacity (0.25 mm for signals, 1+ mm for power), copper clearance prevents short circuits, ground planes reduce noise. Fabrication services (JLCPCB, PCBWay) produce 5 boards for ~$2-5 with 5-day turnaround. Surface-mount components (SMD) are smaller than through-hole but require a soldering iron with a fine tip or a reflow oven. Assembly houses can populate boards automatically for larger quantities.',
      diagram: 'SeriesParallelCircuitDiagram',
    },
  ],

  build: [
    {
      title: 'Simulated LED Circuit',
      beginnerContent:
        'The classic "Hello World" of Arduino. This blinks an LED and prints status to the serial monitor.',
      code: `// Paste into the Arduino simulator editor
// Works in Wokwi, Tinkercad Circuits, or similar

void setup() {
pinMode(13, OUTPUT);       // built-in LED pin
pinMode(12, OUTPUT);       // external LED pin
Serial.begin(9600);
Serial.println("Simulator ready!");
}

void loop() {
// Blink built-in LED
digitalWrite(13, HIGH);
Serial.println("LED ON");
delay(500);

digitalWrite(13, LOW);
Serial.println("LED OFF");
delay(500);

// Blink external LED on pin 12 (opposite pattern)
// In the simulator: drag an LED + 220Ω resistor
// from pin 12 to GND
digitalWrite(12, !digitalRead(13));
}`,
    },
    {
      title: 'Simulated Sensor with Variable Input',
      beginnerContent:
        'The simulator lets you drag a slider to change the value of a virtual potentiometer or sensor. ' +
        'This example maps sensor input to LED brightness and prints values for debugging.',
      code: `// Virtual potentiometer on A0 controls LED brightness on pin 9
const int potPin = A0;
const int ledPin = 9;    // must be a PWM pin (~)

void setup() {
pinMode(ledPin, OUTPUT);
Serial.begin(9600);
Serial.println("Drag the potentiometer slider!");
}

void loop() {
int sensorValue = analogRead(potPin);  // 0-1023
int brightness = map(sensorValue, 0, 1023, 0, 255);

analogWrite(ledPin, brightness);  // PWM output

// Print a simple bar graph to serial monitor
Serial.print("Sensor: ");
Serial.print(sensorValue);
Serial.print(" | Brightness: ");
Serial.print(brightness);
Serial.print(" |");
for (int i = 0; i < brightness / 10; i++) {
  Serial.print("█");
}
Serial.println();
delay(100);
}`,
    },
    {
      title: 'Multi-Component Simulation: Traffic Light',
      beginnerContent:
        'A more advanced simulation with three LEDs and timed transitions — a virtual traffic light.',
      code: `// Traffic light: Red, Yellow, Green LEDs on pins 11, 10, 9
const int RED = 11;
const int YELLOW = 10;
const int GREEN = 9;

void setup() {
pinMode(RED, OUTPUT);
pinMode(YELLOW, OUTPUT);
pinMode(GREEN, OUTPUT);
Serial.begin(9600);
Serial.println("Traffic light starting...");
}

void setLight(bool r, bool y, bool g, const char* label) {
digitalWrite(RED, r);
digitalWrite(YELLOW, y);
digitalWrite(GREEN, g);
Serial.println(label);
}

void loop() {
setLight(LOW,  LOW, HIGH, "GREEN  - Go");
delay(3000);

setLight(LOW, HIGH,  LOW, "YELLOW - Slow down");
delay(1000);

setLight(HIGH, LOW,  LOW, "RED    - Stop");
delay(3000);

setLight(HIGH, HIGH, LOW, "RED+YELLOW - Get ready");
delay(1000);
}
// In the simulator: wire 3 LEDs (with resistors) to pins 11, 10, 9`,
    },
  ],
};
