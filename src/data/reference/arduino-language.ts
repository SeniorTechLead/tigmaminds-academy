import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'arduino-language',
  title: 'Arduino Language',
  category: 'language',
  icon: '🔌',
  tagline: 'C++ for microcontrollers — talk to the physical world',
  relatedStories: ['firefly-festival-of-majuli', 'river-dolphins-secret', 'bridge-that-grew'],

  understand: [
    {
      title: 'What Is Arduino?',
      beginnerContent:
        'Arduino is a small, inexpensive computer on a single board — about the size of a credit ' +
        'card. Unlike your laptop, it does not have a screen, keyboard, or operating system. Instead, ' +
        'it has *pins* — metal connectors that link to the physical world. Some pins read sensors ' +
        '(temperature, light, distance, sound). Others control actuators (LEDs, motors, speakers, ' +
        'relays). You write a program on your laptop in a language based on C++, upload it to the ' +
        'board through a USB cable, and the board runs that program forever until you unplug it. ' +
        'Arduino is used in robots, weather stations, home automation, art installations, and ' +
        'thousands of student projects around the world.',
      intermediateContent:
        'An Arduino Uno uses the ATmega328P: 16 MHz clock, 32 KB flash (program), 2 KB SRAM (variables), 1 KB EEPROM (persistent). Compare to your phone: ~2 GHz (125× faster), 4-8 GB RAM (2 million × more). Yet Arduino excels at real-time hardware control — no OS overhead. analogRead(A0) returns 0-1023 (10-bit, 0-5V) in ~100 μs. analogWrite(pin, 0-255) uses PWM at ~490 Hz. Digital pins source/sink up to 20 mA — enough for an LED but not a motor (use a transistor or motor driver).',
      advancedContent:
        'The Arduino ecosystem spans 8-bit AVR (Uno, Nano) to 32-bit ARM (Due, Teensy 4.x at 600 MHz), RISC-V, and ESP32 (dual-core 240 MHz with WiFi/Bluetooth). Real-time operating systems (FreeRTOS on ESP32) enable multitasking. Direct register manipulation (PORTB |= (1 << PB5)) switches pins in ~62 ns vs ~4 μs for digitalWrite. Interrupts (attachInterrupt) respond within microseconds for encoder reading and communication protocols. The PlatformIO ecosystem provides cross-platform builds, unit testing, and library management for professional embedded development.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match the Arduino concept to its description',
          pairs: [
            ['Pin', 'A metal connector that links Arduino to sensors or LEDs'],
            ['Sketch', 'The name for an Arduino program'],
            ['USB cable', 'Connects Arduino to your laptop for uploading code'],
            ['Sensor', 'A component that reads the physical world (light, temperature)'],
            ['Actuator', 'A component that affects the physical world (LED, motor, speaker)'],
          ],
        },
      },
    },
    {
      id: 'arduino-setup',
      title: 'The setup() and loop() Mental Model',
      beginnerContent:
        'Every Arduino program (called a "sketch") has exactly two required functions. `setup()` ' +
        'runs once when the board powers on or resets — use it to configure pins and start serial ' +
        'communication. Think of it as setting the table before dinner. `loop()` runs over and over, ' +
        'thousands of times per second, for as long as the board has power. Think of it as the ' +
        'heartbeat of your project — read sensors, make decisions, control outputs, repeat. If you ' +
        'want something to happen once (play a startup sound), put it in setup(). If you want ' +
        'something to happen continuously (check if a button is pressed), put it in loop().',
      intermediateContent:
        'The Arduino program structure: setup() runs once at power-on, loop() runs repeatedly. Essential functions: pinMode(pin, OUTPUT/INPUT/INPUT_PULLUP), digitalWrite(pin, HIGH/LOW), digitalRead(pin), analogRead(pin) → 0-1023, analogWrite(pin, 0-255), Serial.begin(9600), Serial.println(value), delay(ms), millis() (time since boot). A temperature logger: void loop() { int raw = analogRead(A0); float tempC = (raw * 5.0 / 1024.0 - 0.5) * 100; Serial.println(tempC); delay(1000); }.',
      advancedContent:
        'Non-blocking programming replaces delay() with millis() timing: if (millis() - lastRead > 1000) { lastRead = millis(); readSensor(); }. This handles multiple tasks simultaneously. **State machines** organize complex behavior: define states (IDLE, READING, ALERTING), transitions (IDLE→READING on timer), and actions for each state. This pattern scales from simple projects to industrial controllers. Watchdog timers (WDT) automatically reset the microcontroller if code hangs — essential for unattended deployments like weather stations and wildlife monitoring sensors.',
      diagram: 'SetupLoopDiagram',
    },
    {
      title: 'Digital vs Analog — Two Ways to Talk',
      beginnerContent:
        'Digital pins deal in absolutes: HIGH (5V, on) or LOW (0V, off). They are perfect for ' +
        'buttons (pressed or not), LEDs (on or off), and switches. Analog pins deal in ranges: ' +
        'analogRead() returns a value from 0 to 1023, representing voltage from 0V to 5V. This ' +
        'lets you read sensors that give continuous values — how bright is the light (0=dark, ' +
        '1023=blinding), how hot is the room, how far away is the object. There is also a trick ' +
        'called PWM (Pulse Width Modulation) that lets digital pins *simulate* analog output by ' +
        'flickering on and off so fast that an LED appears dimmed or a motor runs at half speed. ' +
        'PWM pins are marked with a ~ symbol on the board.',
      intermediateContent:
        'Digital signals have two states: HIGH (5V on Arduino Uno) and LOW (0V). Like a light switch — on or off. Analog signals vary continuously between 0V and 5V. The Arduino reads analog with analogRead() returning 0-1023 (10-bit ADC: 2^10 = 1024 levels). Resolution: 5V/1024 ≈ 4.88 mV per step. analogWrite() uses PWM (Pulse Width Modulation) — rapidly switching between HIGH and LOW. duty cycle 50% = average 2.5V, 75% = 3.75V. LEDs dimmed this way flicker at ~490 Hz — too fast for your eye to see, so it looks like smooth dimming.',
      advancedContent:
        'ADC conversion time on the Arduino Uno is ~100 μs (10,000 samples/second max). For faster sampling, configure the ADC prescaler: ADCSRA = (ADCSRA & 0xF8) | 0x04 sets prescaler to 16, achieving ~77 kHz sampling at reduced accuracy. External ADCs (ADS1115: 16-bit, MCP3008: 10-bit SPI) provide better resolution and speed. DAC (Digital-to-Analog Converter) output is not available on the Uno — use PWM with an RC low-pass filter (R=10kΩ, C=100nF, cutoff ~159 Hz) to smooth the PWM into a true analog voltage for audio or control applications.',
      diagram: 'DigitalAnalogDiagram',
    },
    {
      title: 'Sensors — How Arduino Reads the World',
      beginnerContent:
        'A sensor converts a physical quantity into an electrical signal. A light sensor (photoresistor) ' +
        'changes its resistance based on brightness — more light means lower resistance, which changes ' +
        'the voltage Arduino reads. A temperature sensor (like the TMP36) outputs a voltage proportional ' +
        'to temperature — 0.5V at 0°C, 0.75V at 25°C. An ultrasonic distance sensor sends out a ' +
        'sound pulse and times the echo — farther objects take longer to echo back. A PIR (passive ' +
        'infrared) sensor detects body heat and outputs HIGH when someone walks by. Each sensor ' +
        'connects to an Arduino pin, and your code reads the value and decides what to do with it — ' +
        'that is the core pattern of every Arduino project.',
      intermediateContent:
        'Common sensors and their interfaces: **Temperature** (LM35: analog, 10mV/°C; DHT22: digital, temp+humidity), **Light** (LDR: analog voltage divider; BH1750: I2C digital lux meter), **Distance** (HC-SR04 ultrasonic: trigger pulse, measure echo time; distance = time × 343/2 m/s), **Motion** (PIR: digital HIGH when motion detected), **Accelerometer** (MPU6050: I2C, 3-axis acceleration + gyroscope). Sensor readings are noisy — averaging 10 readings smooths the signal: total = 0; for(int i=0; i<10; i++) total += analogRead(A0); avg = total/10.',
      advancedContent:
        'I2C (Inter-Integrated Circuit) connects multiple sensors on just 2 wires (SDA, SCL). Each device has a unique 7-bit address (0x00-0x7F). The Wire library handles communication: Wire.beginTransmission(addr); Wire.write(reg); Wire.endTransmission(); Wire.requestFrom(addr, bytes). SPI (Serial Peripheral Interface) uses 4 wires but is faster (up to 10 MHz vs I2C\'s 400 kHz). Sensor fusion algorithms (complementary filter, Kalman filter) combine accelerometer and gyroscope data to get accurate orientation — essential for drone stabilization, robot balancing, and motion tracking.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'analogRead() returns a value from 0 to 1023.', answer: true, explanation: 'The Arduino ADC is 10-bit, so it maps 0-5V to the integer range 0-1023.' },
            { text: 'A PIR sensor detects light levels in a room.', answer: false, explanation: 'PIR (passive infrared) sensors detect body heat and motion, not light. A photoresistor detects light.' },
            { text: 'An ultrasonic sensor measures distance by timing a sound echo.', answer: true, explanation: 'It sends a high-frequency pulse, then measures how long the echo takes to return. Farther objects produce longer echo times.' },
          ],
        },
      },
    },
  ],

  build: [
    {
      title: 'Blink an LED — The Hello World',
      beginnerContent:
        'The simplest Arduino project: turn the built-in LED on and off. This teaches you setup(), loop(), and digital output.',
      code: `// Every Arduino sketch needs setup() and loop()

void setup() {
// Run once: configure pin 13 (built-in LED) as output
pinMode(LED_BUILTIN, OUTPUT);
Serial.begin(9600);
Serial.println("Blink sketch started!");
}

void loop() {
// Run forever: blink the LED
digitalWrite(LED_BUILTIN, HIGH);   // LED on (5V)
Serial.println("ON");
delay(1000);                        // wait 1 second (1000 ms)

digitalWrite(LED_BUILTIN, LOW);    // LED off (0V)
Serial.println("OFF");
delay(1000);
}

// To change the blink speed, change the delay values.
// delay(100) = 10 blinks per second (fast strobe)
// delay(2000) = very slow, relaxed blink`,
    },
    {
      title: 'Read a Sensor and Print Values',
      beginnerContent:
        'Read an analog sensor (like a light sensor or potentiometer) and print the value to the serial monitor for debugging.',
      code: `const int sensorPin = A0;   // analog input pin

void setup() {
Serial.begin(9600);
Serial.println("Sensor reader ready.");
Serial.println("Open Serial Monitor to see values.");
}

void loop() {
int raw = analogRead(sensorPin);  // 0 to 1023

// Convert to voltage (5V reference)
float voltage = raw * 5.0 / 1023.0;

// For a TMP36 temperature sensor: voltage to Celsius
float tempC = (voltage - 0.5) * 100.0;

Serial.print("Raw: ");
Serial.print(raw);
Serial.print(" | Voltage: ");
Serial.print(voltage, 2);
Serial.print("V | Temp: ");
Serial.print(tempC, 1);
Serial.println("°C");

delay(500);  // read twice per second
}`,
    },
    {
      title: 'Sensor + LED: A Reactive Project',
      beginnerContent:
        'Combine reading a sensor with controlling an output — the fundamental pattern of every Arduino project.',
      code: `const int sensorPin = A0;   // light sensor
const int ledPin = 9;       // LED with resistor (PWM pin)
const int buzzerPin = 8;    // optional buzzer

void setup() {
pinMode(ledPin, OUTPUT);
pinMode(buzzerPin, OUTPUT);
Serial.begin(9600);
}

void loop() {
int light = analogRead(sensorPin);

// Map light level to LED brightness (inverted: darker = brighter LED)
int brightness = map(light, 0, 1023, 255, 0);
analogWrite(ledPin, brightness);  // PWM output

// Three-level response
if (light < 200) {
  // Very dark — LED bright + alarm
  Serial.println("DARK — Night mode, LED bright");
  tone(buzzerPin, 1000, 100);  // short beep
} else if (light < 600) {
  // Medium — LED dimmed, no alarm
  Serial.println("MEDIUM — Dusk mode");
  noTone(buzzerPin);
} else {
  // Bright — LED off
  Serial.println("BRIGHT — Day mode, LED off");
  noTone(buzzerPin);
}

delay(200);
}`,
    },
    {
      title: 'Multiple Sensors and Outputs',
      beginnerContent:
        'A more advanced sketch that reads two sensors and controls multiple outputs with different logic.',
      code: `// Weather station: temperature + light sensor
// Outputs: LED indicator + serial dashboard

const int tempPin = A0;     // TMP36 temperature sensor
const int lightPin = A1;    // photoresistor
const int redLED = 11;      // red LED (hot warning)
const int greenLED = 10;    // green LED (comfortable)
const int blueLED = 9;      // blue LED (cold warning)

void setup() {
pinMode(redLED, OUTPUT);
pinMode(greenLED, OUTPUT);
pinMode(blueLED, OUTPUT);
Serial.begin(9600);
Serial.println("Weather Station v1.0");
Serial.println("Temp(C) | Light | Status");
Serial.println("--------|-------|-------");
}

float readTempC(int pin) {
int raw = analogRead(pin);
float voltage = raw * 5.0 / 1023.0;
return (voltage - 0.5) * 100.0;
}

void setColor(bool r, bool g, bool b) {
digitalWrite(redLED, r);
digitalWrite(greenLED, g);
digitalWrite(blueLED, b);
}

void loop() {
float tempC = readTempC(tempPin);
int light = analogRead(lightPin);
const char* status;

if (tempC > 35) {
  setColor(HIGH, LOW, LOW);   // red = hot
  status = "HOT!";
} else if (tempC > 20) {
  setColor(LOW, HIGH, LOW);   // green = comfortable
  status = "OK";
} else {
  setColor(LOW, LOW, HIGH);   // blue = cold
  status = "COLD";
}

Serial.print(tempC, 1);
Serial.print("    | ");
Serial.print(light);
Serial.print("  | ");
Serial.println(status);

delay(1000);
}`,
    },
  ],
};
