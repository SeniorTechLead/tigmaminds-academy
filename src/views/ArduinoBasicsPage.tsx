import { useState } from 'react';
import { BookOpen, ChevronRight, CheckCircle, Circle, Sparkles, Cpu } from 'lucide-react';
import ArduinoPlayground from '../components/ArduinoPlayground';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useBasicsProgress } from '../contexts/BasicsProgressContext';
import FrequencyExplorerDiagram from '../components/diagrams/FrequencyExplorerDiagram';
import LEDBlinkDiagram from '../components/diagrams/LEDBlinkDiagram';
import VariableSpeedDiagram from '../components/diagrams/VariableSpeedDiagram';
import LEDPatternDiagram from '../components/diagrams/LEDPatternDiagram';
import ButtonInputDiagram from '../components/diagrams/ButtonInputDiagram';
import PWMBrightnessDiagram from '../components/diagrams/PWMBrightnessDiagram';
import SerialLoggerDiagram from '../components/diagrams/SerialLoggerDiagram';

const lessons = [
  {
    title: 'Your first Arduino program — blinking an LED',
    concept: `An Arduino is a tiny computer on a single board. It does not have a screen or keyboard — instead, it connects to the physical world through **pins**. You can wire LEDs, motors, sensors, and buttons to those pins, and then write code that controls them.

Every Arduino program has exactly two parts. **setup()** runs once when the board powers on — use it to configure your pins. **loop()** runs over and over forever after that — this is where your main logic goes. The board never stops looping until you unplug it.

To control an LED, you first tell the Arduino that a pin is an output using \`pinMode(pin, OUTPUT)\`. Then you turn it on with \`digitalWrite(pin, 1)\` and off with \`digitalWrite(pin, 0)\`. Add a \`delay(milliseconds)\` between them and the LED blinks. That is your first program — and it is exactly how real embedded engineers start.`,
    analogy: 'An Arduino program is like a drummer in a band. setup() is the drummer counting in — "1, 2, 3, 4" — it runs once before the music begins. loop() is the beat that repeats for the entire song. The drummer does not stop until the music ends. Your Arduino does not stop until you pull the plug.',
    storyConnection: 'In "The Firefly Festival of Majuli," thousands of fireflies blink in the darkness along the riverbank. Each firefly is running its own tiny program: turn on, wait, turn off, wait, repeat. Your first Arduino program does exactly the same thing — a single LED blinking like a lone firefly in the Majuli night.',
    starterCode: `void setup() {
  pinMode(2, OUTPUT);
  Serial.begin(9600);
  Serial.println("Firefly ready!");
}

void loop() {
  digitalWrite(2, 1);
  Serial.println("LED ON  - firefly glows");
  delay(800);

  digitalWrite(2, 0);
  Serial.println("LED OFF - darkness");
  delay(800);
}`,
    ledCount: 6,
    challenge: 'Change the blink timing so the LED stays on for 200ms and off for 1000ms — a quick flash like a real firefly. Then try adding a second blink on pin 3 with different timing.',
    successHint: 'You just wrote your first embedded program. Every traffic light, washing machine, and elevator runs on the same principle: setup once, loop forever, toggle outputs.',
  },
  {
    title: 'Variables and timing — controlling blink speed',
    concept: `Hard-coding numbers like \`delay(800)\` works, but what if you want the blink speed to change over time? That is where **variables** come in. A variable is a named container that holds a number: \`int speed = 1000;\` creates a variable called "speed" holding the value 1000.

You can use variables anywhere you would use a number. Instead of \`delay(800)\`, write \`delay(speed)\`. Now you can change the speed by changing the variable: \`speed = speed - 50;\` makes it 50 milliseconds faster each time through the loop.

This is how you make programs adaptive. Instead of doing the same thing forever, the Arduino's behavior evolves over time. You can speed things up, slow them down, or respond to changing conditions — all by manipulating variables with simple arithmetic.`,
    analogy: 'A variable is like the volume knob on a radio. The knob has a name ("volume"), it holds a value (say, 7), and you can turn it up or down. Your code is the same — the variable has a name, holds a number, and you can increase or decrease it whenever you want.',
    storyConnection: 'Firefly synchronization is one of nature\'s great mysteries. On Majuli island, fireflies start blinking at their own individual speeds. Slowly, over minutes, they synchronize — blinking faster and faster until thousands flash in unison. Your variable-speed blink captures that same gradual acceleration.',
    starterCode: `int speed = 1000;

void setup() {
  pinMode(2, OUTPUT);
  Serial.begin(9600);
  Serial.println("Firefly sync starting...");
}

void loop() {
  digitalWrite(2, 1);
  delay(speed);
  digitalWrite(2, 0);
  delay(speed);

  Serial.print("Blink speed: ");
  Serial.print(speed);
  Serial.println(" ms");

  speed = speed - 50;

  if (speed < 100) {
    speed = 1000;
    Serial.println("--- Resetting to slow ---");
  }
}`,
    ledCount: 6,
    challenge: 'Make two LEDs (pins 2 and 3) that start at different speeds — one at 1000ms, one at 700ms. Both should speed up by 30ms each loop. Watch how they gradually synchronize and then drift apart again.',
    successHint: 'You just built adaptive behavior with nothing more than an integer variable and subtraction. Industrial control systems — thermostats, cruise control, autofocus cameras — all work on this same principle: measure, adjust, repeat.',
  },
  {
    title: 'Multiple LEDs — patterns and sequences',
    concept: `One LED is a firefly. Five LEDs are a festival. To control multiple LEDs, you need two new tools: **arrays** and **for loops**.

An array is a list of numbers stored under one name. Instead of writing \`int pin1 = 2; int pin2 = 3; int pin3 = 4;\`, you write \`int pins[5] = {2, 3, 4, 5, 6};\` — one variable holding all five pin numbers. You access individual items with square brackets: \`pins[0]\` is 2, \`pins[1]\` is 3, and so on. Indexing starts at 0, not 1.

A **for loop** repeats code a set number of times. \`for (int i = 0; i < 5; i = i + 1)\` means: start i at 0, keep going while i is less than 5, add 1 to i each time. Inside the loop, you use \`i\` as an index into your array. This combination — arrays plus for loops — is how you create LED chase patterns, sequential animations, and light shows.`,
    analogy: 'An array is like a row of numbered mailboxes in an apartment building. Instead of remembering each tenant by name, you just say "mailbox 0, mailbox 1, mailbox 2." A for loop is the mail carrier walking down the row, dropping a letter in each box one at a time.',
    storyConnection: 'During the Firefly Festival of Majuli, strings of oil lamps line the Brahmaputra riverbank. Each lamp lights in sequence — a wave of light rolling along the water\'s edge. Your LED chase pattern recreates that wave: pin 2 lights, then pin 3, then pin 4, rippling down the line like festival lights reflected in the river.',
    starterCode: `int pins[5] = {2, 3, 4, 5, 6};
int count = 5;
int speed = 150;

void setup() {
  for (int i = 0; i < count; i = i + 1) {
    pinMode(pins[i], OUTPUT);
  }
  Serial.begin(9600);
  Serial.println("Festival lights ready!");
}

void loop() {
  Serial.println("--- Chase forward ---");
  for (int i = 0; i < count; i = i + 1) {
    digitalWrite(pins[i], 1);
    Serial.print("LED ");
    Serial.print(pins[i]);
    Serial.println(" ON");
    delay(speed);
    digitalWrite(pins[i], 0);
  }

  Serial.println("--- Chase backward ---");
  for (int i = count - 1; i >= 0; i = i - 1) {
    digitalWrite(pins[i], 1);
    Serial.print("LED ");
    Serial.print(pins[i]);
    Serial.println(" ON");
    delay(speed);
    digitalWrite(pins[i], 0);
  }
}`,
    ledCount: 6,
    challenge: 'Create a "fill" pattern: turn on LED 2, then 2 and 3, then 2, 3, and 4 — building up until all five are lit. Then turn them all off and start over. This mimics the lamps being lit one by one along the riverbank.',
    successHint: 'Arrays and for loops together are the backbone of any embedded system that controls multiple outputs. LED strips, motor arrays, sensor grids — they all use this exact pattern.',
  },
  {
    title: 'Reading input — buttons and decisions',
    concept: `So far, your Arduino only sends signals out. But real projects also need to **read input** — detect button presses, sensor readings, or signals from the outside world. The function \`digitalRead(pin)\` returns 1 if a pin is receiving a signal (HIGH) and 0 if it is not (LOW).

To react to input, you combine digitalRead with **if/else** statements. \`if (digitalRead(4) == 1)\` means "if pin 4 is receiving a signal, do this." The \`else\` block handles the opposite case. This is how buttons work: press the button, the pin reads 1, your code does something. Release it, the pin reads 0, your code does something else.

In the simulator, you can toggle input pins to simulate button presses. This lets you build interactive projects where the Arduino responds to the world around it rather than just running a fixed pattern.`,
    analogy: 'digitalRead is like checking your mailbox. You walk out, open the box, and look inside. Either there is mail (1) or there is not (0). You do not control whether mail arrives — you just check and react. Your Arduino checks the pin and reacts to whatever state it finds.',
    storyConnection: 'In "The Honey Hunter\'s Lesson," smoke signals are the communication system of the forest. The hunter presses a bundle of damp leaves onto the fire — smoke rises. Releases it — the smoke stops. That press-and-release is exactly a button press. Your Arduino reads the "button" and responds: press to signal, release to wait.',
    starterCode: `int ledPin = 2;
int buttonPin = 4;
int ledState = 0;
int lastButton = 0;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT);
  Serial.begin(9600);
  Serial.println("Press the button to toggle LED");
}

void loop() {
  int buttonNow = digitalRead(buttonPin);

  if (buttonNow == 1) {
    if (lastButton == 0) {
      if (ledState == 0) {
        ledState = 1;
        Serial.println("Signal ON  - smoke rises");
      } else {
        ledState = 0;
        Serial.println("Signal OFF - smoke clears");
      }
    }
  }

  lastButton = buttonNow;
  digitalWrite(ledPin, ledState);
  delay(50);
}`,
    ledCount: 6,
    challenge: 'Add a second button on pin 5 that controls a second LED on pin 3. Then make a "panic" mode: if both buttons are pressed at the same time, all LEDs on pins 2 through 6 blink rapidly.',
    successHint: 'You just built a toggle switch — the fundamental input pattern in electronics. Every light switch, remote control, and touchscreen button works on this same logic: read the input, track the state, respond accordingly.',
  },
  {
    title: 'Analog output — fading and brightness',
    concept: `Digital output is binary — on or off, 1 or 0, full brightness or darkness. But the real world is not binary. Fireflies do not snap on and off; they **glow** — fading smoothly from dim to bright and back. To achieve this, Arduino uses **analogWrite**.

\`analogWrite(pin, value)\` takes a value from 0 (fully off) to 255 (fully bright). Values in between give you intermediate brightness: 128 is roughly half brightness, 64 is dim, 200 is nearly full. This works through a technique called **PWM** (Pulse Width Modulation) — the pin actually flickers on and off thousands of times per second, and the ratio of on-time to off-time creates the illusion of partial brightness.

To create a smooth fade, you increment the brightness value in a for loop: start at 0, add a small amount each step, delay briefly, repeat. When you hit 255, reverse direction and count back down. The result is a "breathing" effect — a soft, organic pulse of light.`,
    analogy: 'PWM is like a ceiling fan. The fan motor is either spinning or not — there is no "half speed" switch. Instead, the fan clicks on and off rapidly. Mostly on? The fan spins fast. Mostly off? It spins slowly. Your eyes blur the flickering into smooth motion, just as they blur PWM into smooth brightness.',
    storyConnection: 'Bioluminescence in "The Firefly Festival of Majuli" is not a simple on/off flash. Fireflies produce a chemical glow that builds gradually, peaks, and fades — a breathing rhythm evolved over millions of years. analogWrite lets your LED mimic that organic glow instead of the harsh digital blink.',
    starterCode: `int ledPin = 2;
int brightness = 0;
int step = 5;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Bioluminescence mode");
}

void loop() {
  analogWrite(ledPin, brightness);

  Serial.print("Brightness: ");
  Serial.println(brightness);

  brightness = brightness + step;

  if (brightness >= 255) {
    brightness = 255;
    step = -5;
    Serial.println("--- Fading out ---");
  }

  if (brightness <= 0) {
    brightness = 0;
    step = 5;
    Serial.println("--- Fading in ---");
  }

  delay(30);
}`,
    ledCount: 6,
    challenge: 'Make three LEDs (pins 2, 3, 4) breathe at different rates — one fast, one medium, one slow — like three fireflies with different rhythms. Use separate brightness and step variables for each.',
    successHint: 'You just created smooth analog control from a digital system. This PWM technique powers LED dimmers in your home, motor speed controllers in drones, and display brightness on your phone.',
  },
  {
    title: 'Serial communication — talking to the computer',
    concept: `Your Arduino is a standalone computer, but sometimes it needs to report back to you. **Serial communication** is how the Arduino sends data to your computer over a USB cable (or in our case, to the Serial Monitor panel).

\`Serial.begin(9600)\` starts the communication channel at 9600 bits per second — you call this once in setup(). Then \`Serial.print("text")\` sends text without a newline, and \`Serial.println("text")\` sends text followed by a newline. You can print numbers too: \`Serial.println(42)\` displays 42.

Serial output is how you **debug** programs — printing variable values to see what your code is actually doing. It is also how real Arduino projects log data: a weather station printing temperature every minute, a motion sensor logging activity timestamps, or a wildlife tracker recording animal detections. The Serial Monitor is your window into what the Arduino is thinking.`,
    analogy: 'Serial communication is like a walkie-talkie. The Arduino holds down the button and talks: "Temperature is 24 degrees." Your computer listens and writes it down. The Arduino cannot hear back in our simulator, but the one-way reports are enough to monitor everything happening on the board.',
    storyConnection: 'In "The Girl Who Spoke to Elephants," wildlife trackers attach GPS collars to elephants and log their movements — latitude, longitude, timestamp, speed — transmitting data back to the research station. Your Serial.println does the same thing on a smaller scale: the Arduino is the collar, and the Serial Monitor is the research station receiving the data.',
    starterCode: `int sensorPin = 3;
int reading = 0;
int logCount = 0;
int threshold = 150;

void setup() {
  pinMode(2, OUTPUT);
  Serial.begin(9600);
  Serial.println("=== Wildlife Tracker v1 ===");
  Serial.println("Logging elephant sensor data...");
  Serial.println("----------------------------");
}

void loop() {
  reading = random(50, 250);
  logCount = logCount + 1;

  Serial.print("Log #");
  Serial.print(logCount);
  Serial.print("  Sensor: ");
  Serial.print(reading);

  if (reading > threshold) {
    Serial.println("  ** ELEPHANT DETECTED **");
    digitalWrite(2, 1);
    delay(200);
    digitalWrite(2, 0);
  } else {
    Serial.println("  (quiet)");
  }

  delay(500);

  if (logCount >= 20) {
    Serial.println("----------------------------");
    Serial.println("Session complete: 20 readings logged.");
    Serial.print("Detection threshold was: ");
    Serial.println(threshold);
    delay(3000);
    logCount = 0;
    Serial.println("=== New session ===");
  }
}`,
    ledCount: 6,
    challenge: 'Add a running average: track the last 5 sensor readings in an array and print the average alongside each new reading. Also count total detections and print a summary showing the detection rate (detections / total readings) at the end of each session.',
    successHint: 'You just built a data logging system. Real wildlife conservation projects in Kaziranga use exactly this pattern — sensors detect animal crossings, log the data, and flag unusual activity. The only difference is scale.',
  },
  {
    title: 'Making sound — tone(), frequency, and the buzzer',
    concept: `So far your Arduino can blink, fade, read buttons, and log data — but it is silent. A **piezo buzzer** changes that. Connect one to any digital pin and use \`tone(pin, frequency)\` to produce a sound at a specific pitch.

**Frequency** is measured in **hertz (Hz)** — vibrations per second. Middle C on a piano is 262 Hz. The A above it is 440 Hz. Higher frequency = higher pitch. The human ear can hear roughly 20 Hz to 20,000 Hz.

\`tone(pin, frequency)\` starts a continuous tone. \`tone(pin, frequency, duration)\` plays for a set number of milliseconds then stops. \`noTone(pin)\` silences it immediately.

Why does this matter? Parking sensors beep faster as you get closer. Smoke alarms use a specific frequency pattern. Medical monitors use different pitches for different alerts. Every one of these is a \`tone()\` call with changing frequency and timing.`,
    analogy: 'Think of a guitar string. A thick, loose string vibrates slowly — low frequency, deep sound. A thin, tight string vibrates fast — high frequency, high pitch. tone() tells the Arduino how fast to vibrate the buzzer. 262 vibrations per second = middle C. 880 vibrations per second = a high A. You are programming the string tension with a number.',
    storyConnection: 'In "The River Dolphin\'s Secret," the dolphin uses clicks at specific frequencies to echolocate — higher frequencies for closer objects. In the sonar capstone, you will use tone() to create a pitch-mapped proximity alert that beeps higher as an object gets closer. This lesson teaches you the building block.',
    starterCode: `// === MAKING SOUND ===
// Buzzer on pin 5

int buzzer = 5;

void setup() {
  pinMode(buzzer, OUTPUT);
  Serial.begin(9600);
  Serial.println("=== Sound lesson ===");

  // Play a startup melody
  Serial.println("Playing startup melody...");
  tone(buzzer, 262, 200);  // C
  delay(250);
  tone(buzzer, 330, 200);  // E
  delay(250);
  tone(buzzer, 392, 200);  // G
  delay(250);
  tone(buzzer, 523, 400);  // High C
  delay(500);
  noTone(buzzer);
  Serial.println("Ready!");
}

void loop() {
  // Sweep from low to high pitch
  Serial.println("Pitch sweep: low to high");
  for (int freq = 200; freq <= 1000; freq = freq + 50) {
    tone(buzzer, freq, 80);
    Serial.print("  ");
    Serial.print(freq);
    Serial.println(" Hz");
    delay(100);
  }
  noTone(buzzer);
  delay(500);

  // Alarm pattern: two-tone alternating
  Serial.println("Alarm pattern:");
  for (int i = 0; i < 5; i++) {
    tone(buzzer, 800, 150);
    delay(200);
    tone(buzzer, 1200, 150);
    delay(200);
  }
  noTone(buzzer);

  Serial.println("--- Cycle complete ---");
  delay(2000);
}`,
    ledCount: 1,
    challenge: 'Create a "doorbell" — when the program starts, play a two-note chime (e.g., 659 Hz then 523 Hz, 300ms each). Then add an "intruder alert" that plays three fast high-pitched beeps (1500 Hz, 100ms each with 50ms gaps).',
    successHint: 'You can now make your Arduino produce any pitch, any pattern, any duration. Combined with LEDs and sensors from the previous lessons, you can build proximity alarms, musical instruments, and accessibility devices — all from tone(), noTone(), and a 50-cent buzzer.',
  },
];

const COURSE_SLUG = 'arduino-basics' as const;

export default function ArduinoBasicsPage() {
  const { markLessonComplete, isLessonComplete, getCompletedCount, isCourseComplete } = useBasicsProgress();
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const completedCount = getCompletedCount(COURSE_SLUG);
  const courseComplete = isCourseComplete(COURSE_SLUG, lessons.length);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12 flex-1 w-full">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Cpu className="w-4 h-4" /> Prerequisite Course
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Arduino Basics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Never programmed a microcontroller? Start here. 7 lessons that take you from zero to
            building sensor systems and LED animations — all running in a simulator in your browser.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> 7 lessons</span>
            <span className="flex items-center gap-1"><Sparkles className="w-4 h-4" /> No experience needed</span>
            <span className="flex items-center gap-1"><Cpu className="w-4 h-4" /> Runs in your browser</span>
          </div>
        </div>

        {/* Progress overview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{completedCount} / {lessons.length} lessons complete</span>
            {courseComplete && <span className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Course complete!</span>}
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${(completedCount / lessons.length) * 100}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-10">
          {lessons.map((lesson, i) => {
            const done = isLessonComplete(COURSE_SLUG, i);
            return (
              <button
                key={i}
                onClick={() => setExpandedLesson(expandedLesson === i ? null : i)}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all
                  ${expandedLesson === i
                    ? 'bg-amber-600 text-white scale-110 shadow-lg'
                    : done
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 ring-2 ring-amber-400/50'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                  }`}
                title={`${lesson.title}${done ? ' ✓' : ''}`}
              >
                {done ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </button>
            );
          })}
        </div>

        {/* Lessons */}
        <div className="space-y-6">
          {lessons.map((lesson, i) => {
            const done = isLessonComplete(COURSE_SLUG, i);
            return (
            <div key={i} id={`lesson-${i}`}>
              {/* Lesson header — always visible */}
              <button
                onClick={() => {
                  const opening = expandedLesson !== i;
                  setExpandedLesson(opening ? i : null);
                  if (opening) {
                    setTimeout(() => document.getElementById(`lesson-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                  }
                }}
                className={`w-full text-left px-6 py-4 rounded-xl border transition-all flex items-center gap-4
                  ${expandedLesson === i
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
                    : done
                      ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-amber-300 dark:hover:border-amber-700'
                  }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0
                  ${expandedLesson === i
                    ? 'bg-amber-600 text-white'
                    : done
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                  {done ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${expandedLesson === i ? 'text-amber-700 dark:text-amber-300' : done ? 'text-amber-700 dark:text-amber-300' : 'text-gray-900 dark:text-white'}`}>
                    {lesson.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{lesson.analogy}</p>
                </div>
                {done && expandedLesson !== i && <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex-shrink-0">Complete</span>}
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedLesson === i ? 'rotate-90' : ''}`} />
              </button>

              {/* Expanded lesson content */}
              {expandedLesson === i && (
                <div className="mt-4 ml-2 space-y-6">
                  {/* Concept */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Lesson {i + 1}: {lesson.title}
                    </h3>
                    <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {lesson.concept}
                    </div>
                  </div>

                  {/* Interactive diagrams — one per lesson */}
                  {i === 0 && <LEDBlinkDiagram />}
                  {i === 1 && <VariableSpeedDiagram />}
                  {i === 2 && <LEDPatternDiagram />}
                  {i === 3 && <ButtonInputDiagram />}
                  {i === 4 && <PWMBrightnessDiagram />}
                  {i === 5 && <SerialLoggerDiagram />}
                  {i === 6 && <FrequencyExplorerDiagram />}

                  {/* Analogy */}
                  <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">Analogy</p>
                    <p className="text-sm text-amber-900 dark:text-amber-200">{lesson.analogy}</p>
                  </div>

                  {/* Story connection */}
                  <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-1">Story Connection</p>
                    <p className="text-sm text-purple-900 dark:text-purple-200">{lesson.storyConnection}</p>
                  </div>

                  {/* Arduino Playground */}
                  <ArduinoPlayground
                    starterCode={lesson.starterCode}
                    title={`Lesson ${i + 1}: ${lesson.title}`}
                    ledCount={lesson.ledCount}
                  />

                  {/* Challenge */}
                  <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">Challenge</p>
                    <p className="text-sm text-amber-900 dark:text-amber-200">{lesson.challenge}</p>
                  </div>

                  {/* Success hint */}
                  <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-5 border border-green-200 dark:border-green-800">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">When You Succeed</p>
                    <p className="text-sm text-green-900 dark:text-green-200">{lesson.successHint}</p>
                  </div>

                  {/* Mark Complete button */}
                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                    {done ? (
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">Lesson complete</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => markLessonComplete(COURSE_SLUG, i)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Complete
                      </button>
                    )}
                    {i < lessons.length - 1 && (
                      <button
                        onClick={() => { if (!done) markLessonComplete(COURSE_SLUG, i); setExpandedLesson(i + 1); }}
                        className="flex items-center gap-1 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      >
                        Next lesson <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
          })}
        </div>

        {/* Completion CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 text-center">
          <CheckCircle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready for Level 1</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            After completing these 7 lessons, you have the Arduino skills to start
            Level 1 of the electronics and hardware stories.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/lessons/firefly-festival-of-majuli"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-amber-400 transition-colors"
            >
              The Firefly Festival of Majuli <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
