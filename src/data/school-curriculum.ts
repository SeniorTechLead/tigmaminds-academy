/**
 * 12-Month School Program Curriculum
 *
 * Each track has 4 terms (12 weeks each = 48 weeks total).
 * Each week has: topic, lesson slug(s), level(s) to cover, project deliverable, and learning objectives.
 *
 * Stories are mapped from the existing lesson library.
 * Weeks marked with `newContent: true` need content to be authored.
 */

export interface WeekPlan {
  week: number;
  topic: string;
  slugs: string[];           // lesson slugs to use this week
  levels: string[];          // which levels to cover: 'L0', 'L1', 'L2', 'L3', 'L4'
  project?: string;          // hands-on project / deliverable
  objectives: string[];      // what the student should be able to do after
  basics?: string;           // link to basics course if needed (first few weeks)
  newContent?: boolean;      // true if this content needs to be authored
}

export interface TermPlan {
  term: number;
  title: string;
  description: string;
  weeks: WeekPlan[];
}

export interface TrackCurriculum {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  audience: string;
  prerequisite: string;
  terms: TermPlan[];
  capstoneProject: string;
}

// ═══════════════════════════════════════════════════════════════
// TRACK 1: ROBOTICS & ARDUINO
// ═══════════════════════════════════════════════════════════════
export const roboticsTrack: TrackCurriculum = {
  id: 'robotics',
  name: 'Robotics & Arduino',
  tagline: 'From blinking LEDs to autonomous robots',
  icon: '🤖',
  color: 'emerald',
  audience: 'Grade 8-12, no prior experience',
  prerequisite: 'Arduino Basics (/learn/arduino-basics)',
  capstoneProject: 'Build and program an autonomous obstacle-avoiding robot with sensor fusion',
  terms: [
    {
      term: 1,
      title: 'Circuits & Light',
      description: 'Understand electricity, build circuits, and control LEDs with code.',
      weeks: [
        { week: 1, topic: 'What is electricity? Voltage, current, resistance', slugs: ['festival-of-lights'], levels: ['L0'], objectives: ['Explain voltage, current, and resistance using water analogy', 'Identify components: LED, resistor, battery'], basics: '/learn/arduino-basics' },
        { week: 2, topic: 'Your first circuit — LED + resistor on breadboard', slugs: ['festival-of-lights'], levels: ['L0', 'L1'], objectives: ['Build a simple LED circuit on a breadboard', 'Calculate resistor value using Ohm\'s law'], project: 'Light up an LED with a battery and resistor' },
        { week: 3, topic: 'Arduino setup — IDE, upload, blink sketch', slugs: ['firefly-festival-of-majuli'], levels: ['L0', 'L1'], objectives: ['Install Arduino IDE', 'Upload blink sketch', 'Understand setup() and loop()'], project: 'Blink an LED with Arduino' },
        { week: 4, topic: 'Digital output — controlling multiple LEDs', slugs: ['firefly-festival-of-majuli'], levels: ['L1'], objectives: ['Use digitalWrite and delay', 'Control 4+ LEDs independently'], project: 'LED chase pattern (Knight Rider effect)' },
        { week: 5, topic: 'Variables and timing — blink patterns', slugs: ['firefly-festival-of-majuli'], levels: ['L1', 'L2'], objectives: ['Use variables for timing', 'Create complex blink patterns'], project: 'Firefly synchronization — 3 LEDs that gradually sync' },
        { week: 6, topic: 'PWM and analog output — LED brightness', slugs: ['firefly-festival-of-majuli'], levels: ['L2'], objectives: ['Understand PWM (Pulse Width Modulation)', 'Use analogWrite for variable brightness'], project: 'Breathing LED — smooth fade in and out' },
        { week: 7, topic: 'RGB LEDs — mixing colors with code', slugs: ['the-girl-who-painted-rain'], levels: ['L0', 'L1'], objectives: ['Understand additive color mixing', 'Control RGB LED with 3 PWM pins'], project: 'Mood light that cycles through rainbow colors' },
        { week: 8, topic: 'Buttons and digital input', slugs: ['river-dolphins-secret'], levels: ['L0', 'L1'], objectives: ['Wire a pushbutton with pull-up resistor', 'Use digitalRead and if/else'], project: 'Button-controlled LED modes' },
        { week: 9, topic: 'Debouncing and state machines', slugs: ['river-dolphins-secret'], levels: ['L1', 'L2'], objectives: ['Understand switch bounce', 'Implement debounce in code', 'Track button state'], project: 'Toggle switch — press once to turn on, press again to turn off' },
        { week: 10, topic: 'Serial communication — talking to the computer', slugs: ['girl-who-spoke-to-elephants'], levels: ['L0', 'L1'], objectives: ['Use Serial.print and Serial.println', 'Read sensor values in Serial Monitor'], project: 'Data logger that prints button press timestamps' },
        { week: 11, topic: 'Build: Traffic light system', slugs: ['festival-of-lights'], levels: ['L2', 'L3'], objectives: ['Combine LEDs, timing, and state machines', 'Build a complete system from spec'], project: 'Traffic light with pedestrian crossing button' },
        { week: 12, topic: 'Term 1 showcase and review', slugs: [], levels: [], objectives: ['Present traffic light project', 'Explain circuit and code to audience'], project: 'Demonstrate and explain your traffic light system' },
      ],
    },
    {
      term: 2,
      title: 'Sensors & Input',
      description: 'Read the physical world with sensors and respond intelligently.',
      weeks: [
        { week: 13, topic: 'Analog input — potentiometers', slugs: ['music-dimasa'], levels: ['L0', 'L1'], objectives: ['Understand analog vs digital signals', 'Read potentiometer with analogRead', 'Map values with map()'] },
        { week: 14, topic: 'Light sensors (LDR) — measuring brightness', slugs: ['orange-sunsets-assam'], levels: ['L0', 'L1'], objectives: ['Build voltage divider with LDR', 'Calibrate sensor readings'], project: 'Light meter that displays brightness level' },
        { week: 15, topic: 'Temperature sensors', slugs: ['monsoon-home'], levels: ['L0', 'L1'], objectives: ['Read temperature from analog sensor', 'Convert raw ADC values to Celsius'], project: 'Digital thermometer with LED indicators' },
        { week: 16, topic: 'Ultrasonic distance sensor', slugs: ['river-dolphins-secret'], levels: ['L1', 'L2'], objectives: ['Understand sonar/echo principle', 'Use HC-SR04 with pulseIn', 'Measure distance accurately'], project: 'Proximity alarm — LED changes color with distance' },
        { week: 17, topic: 'Combining sensors — multi-input systems', slugs: ['snow-leopards-promise'], levels: ['L1', 'L2'], objectives: ['Read multiple sensors simultaneously', 'Make decisions based on combined data'], project: 'Weather station: temp + light + humidity' },
        { week: 18, topic: 'Sensor calibration and noise filtering', slugs: ['fishermans-daughter-storm'], levels: ['L2'], objectives: ['Understand sensor noise', 'Implement moving average filter', 'Calibrate with known references'], project: 'Calibrated temperature logger with smoothing' },
        { week: 19, topic: 'Sound and vibration sensors', slugs: ['dhol-drum'], levels: ['L0', 'L1'], objectives: ['Detect sound levels with microphone module', 'Threshold-based triggering'], project: 'Clap switch — clap twice to toggle LED' },
        { week: 20, topic: 'Build: Automatic night light', slugs: ['orange-sunsets-assam'], levels: ['L2', 'L3'], objectives: ['Combine LDR input with LED output', 'Add hysteresis to prevent flickering'], project: 'Night light that fades on at dusk, off at dawn' },
        { week: 21, topic: 'Piezo buzzer — making sound with code', slugs: ['music-dimasa'], levels: ['L1', 'L2'], objectives: ['Generate tones with tone()', 'Play simple melodies'], project: 'Play a folk tune with Arduino' },
        { week: 22, topic: 'Build: Theremin instrument', slugs: ['music-dimasa'], levels: ['L2', 'L3'], objectives: ['Map distance sensor to pitch', 'Create a playable instrument'], project: 'Ultrasonic theremin — wave hand to change pitch' },
        { week: 23, topic: 'Data logging to Serial — science experiments', slugs: ['old-banyan-trees-stories'], levels: ['L1', 'L2'], objectives: ['Log sensor data over time', 'Export to CSV for analysis'], project: '24-hour temperature/light logger' },
        { week: 24, topic: 'Term 2 showcase and review', slugs: [], levels: [], objectives: ['Present sensor project', 'Demonstrate calibration and data logging'], project: 'Showcase your weather station or theremin' },
      ],
    },
    {
      term: 3,
      title: 'Motors & Movement',
      description: 'Make things move — from spinning motors to driving robots.',
      weeks: [
        { week: 25, topic: 'DC motors — how they work', slugs: ['dragonfly-and-the-paddy-field'], levels: ['L0'], objectives: ['Understand motor physics (electromagnetic force)', 'Why you cannot connect a motor directly to Arduino'] },
        { week: 26, topic: 'Motor drivers and H-bridges', slugs: ['dragonfly-and-the-paddy-field'], levels: ['L0', 'L1'], objectives: ['Wire motor through L298N driver', 'Control speed with PWM', 'Reverse direction'], project: 'Motor speed controller with potentiometer', newContent: true },
        { week: 27, topic: 'Servo motors — precise angle control', slugs: ['woodpeckers-drum'], levels: ['L0', 'L1'], objectives: ['Understand servo vs DC motor', 'Use Servo library', 'Map sensor to servo angle'], project: 'Sensor-controlled servo (point at light source)' },
        { week: 28, topic: 'Building a robot chassis', slugs: [], levels: [], objectives: ['Assemble 2-wheel robot chassis', 'Wire dual motors to driver', 'Test forward/backward/turn'], project: 'Robot that drives in a square', newContent: true },
        { week: 29, topic: 'Line following — IR sensors', slugs: [], levels: [], objectives: ['Read IR reflectance sensors', 'Implement proportional steering'], project: 'Line-following robot', newContent: true },
        { week: 30, topic: 'Obstacle avoidance — ultrasonic + motors', slugs: ['river-dolphins-secret'], levels: ['L2', 'L3'], objectives: ['Mount ultrasonic sensor on servo', 'Scan left/right/center', 'Choose direction'], project: 'Robot that navigates around obstacles' },
        { week: 31, topic: 'PID control — smooth motor control', slugs: ['fishermans-daughter-storm'], levels: ['L3'], objectives: ['Understand proportional, integral, derivative', 'Implement basic PID for line following'], project: 'PID-tuned line follower', newContent: true },
        { week: 32, topic: 'Sensor fusion — combining inputs for smarter robots', slugs: ['girl-who-spoke-to-elephants'], levels: ['L2', 'L3'], objectives: ['Combine distance + light + bump sensors', 'Priority-based behavior'], project: 'Robot with multiple behavior modes' },
        { week: 33, topic: 'Robot states and behaviors', slugs: [], levels: [], objectives: ['Implement state machine for robot', 'Wander, avoid, seek, retreat modes'], project: 'State-machine robot', newContent: true },
        { week: 34, topic: 'Build: Obstacle-avoiding robot (final assembly)', slugs: ['river-dolphins-secret'], levels: ['L3', 'L4'], objectives: ['Integrate all components', 'Test and debug in real environment'], project: 'Complete autonomous robot' },
        { week: 35, topic: 'Competition prep — robot challenges', slugs: [], levels: [], objectives: ['Navigate a course', 'Optimize for speed and accuracy'], project: 'Timed obstacle course run', newContent: true },
        { week: 36, topic: 'Term 3 showcase — robot demo day', slugs: [], levels: [], objectives: ['Present robot to audience', 'Explain design decisions and code'], project: 'Robot demonstration and Q&A' },
      ],
    },
    {
      term: 4,
      title: 'Communication & Capstone',
      description: 'Connect devices wirelessly and build your capstone project.',
      weeks: [
        { week: 37, topic: 'Serial communication protocols', slugs: ['river-dolphins-secret'], levels: ['L3'], objectives: ['Understand UART, I2C, SPI basics', 'Communicate between two Arduinos'], newContent: true },
        { week: 38, topic: 'Bluetooth communication', slugs: [], levels: [], objectives: ['Wire HC-05 Bluetooth module', 'Send commands from phone to Arduino'], project: 'Bluetooth-controlled LED', newContent: true },
        { week: 39, topic: 'Remote-controlled robot', slugs: [], levels: [], objectives: ['Control robot via Bluetooth', 'Build phone app interface (MIT App Inventor)'], project: 'Phone-controlled robot', newContent: true },
        { week: 40, topic: 'Wireless sensor networks', slugs: ['honey-hunters-lesson'], levels: ['L3'], objectives: ['Multiple sensor nodes reporting to base', 'Data aggregation'], project: 'Distributed temperature monitoring', newContent: true },
        { week: 41, topic: 'Python + Arduino — bridging code and hardware', slugs: ['girl-who-spoke-to-elephants'], levels: ['L3', 'L4'], objectives: ['Send Arduino data to Python via Serial', 'Visualize sensor data with matplotlib'], project: 'Real-time sensor dashboard in Python' },
        { week: 42, topic: 'Capstone planning — choose your project', slugs: [], levels: [], objectives: ['Define project scope', 'Create bill of materials', 'Design circuit schematic'] },
        { week: 43, topic: 'Capstone build — week 1', slugs: [], levels: ['L4'], objectives: ['Assemble hardware', 'Write core code'], project: 'Capstone project - phase 1' },
        { week: 44, topic: 'Capstone build — week 2', slugs: [], levels: ['L4'], objectives: ['Add sensors and communication', 'Test subsystems'], project: 'Capstone project - phase 2' },
        { week: 45, topic: 'Capstone build — week 3', slugs: [], levels: ['L4'], objectives: ['Integration testing', 'Debug and optimize'], project: 'Capstone project - phase 3' },
        { week: 46, topic: 'Documentation and presentation prep', slugs: [], levels: [], objectives: ['Write project report', 'Create demo video', 'Prepare presentation'] },
        { week: 47, topic: 'Final showcase rehearsal', slugs: [], levels: [], objectives: ['Practice presentation', 'Peer feedback'], project: 'Dry run presentation' },
        { week: 48, topic: 'Graduation showcase', slugs: [], levels: [], objectives: ['Present capstone to parents, teachers, and guests'], project: 'Live demonstration and certificate' },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// TRACK 2: PYTHON & AI
// ═══════════════════════════════════════════════════════════════
export const pythonAITrack: TrackCurriculum = {
  id: 'python-ai',
  name: 'Python & AI',
  tagline: 'From first print statement to machine learning',
  icon: '🧠',
  color: 'rose',
  audience: 'Grade 8-12, no prior experience',
  prerequisite: 'Python Basics (/learn/python-basics)',
  capstoneProject: 'Build an AI-powered wildlife classifier that identifies species from sensor data',
  terms: [
    {
      term: 1,
      title: 'Python Foundations',
      description: 'Learn Python through stories — variables, loops, functions, and your first projects.',
      weeks: [
        { week: 1, topic: 'Variables, types, and print — your first code', slugs: ['girl-who-spoke-to-elephants'], levels: ['L0'], objectives: ['Write and run a Python program', 'Use variables to store data', 'Print formatted output'], basics: '/learn/python-basics' },
        { week: 2, topic: 'Strings and text manipulation', slugs: ['girl-who-spoke-to-elephants'], levels: ['L0', 'L1'], objectives: ['Slice strings', 'Format with f-strings', 'String methods'], project: 'Name tag generator' },
        { week: 3, topic: 'Lists and loops — processing collections', slugs: ['old-banyan-trees-stories'], levels: ['L0', 'L1'], objectives: ['Create and modify lists', 'for loops', 'List comprehensions'], project: 'Tree ring data analyzer' },
        { week: 4, topic: 'Conditionals — making decisions in code', slugs: ['honey-hunters-lesson'], levels: ['L0', 'L1'], objectives: ['if/elif/else', 'Boolean logic', 'Nested conditions'], project: 'Bee colony health checker' },
        { week: 5, topic: 'Functions — reusable code blocks', slugs: ['honey-hunters-lesson'], levels: ['L1'], objectives: ['Define functions with parameters', 'Return values', 'Scope'], project: 'Honey harvest calculator' },
        { week: 6, topic: 'Dictionaries — structured data', slugs: ['girl-who-spoke-to-elephants'], levels: ['L1'], objectives: ['Create and access dicts', 'Nested data structures', 'JSON-like patterns'], project: 'Elephant database with lookup' },
        { week: 7, topic: 'File I/O — reading and writing data', slugs: ['fishermans-daughter-storm'], levels: ['L1', 'L2'], objectives: ['Read CSV files', 'Write output files', 'Handle errors with try/except'], project: 'Weather data file reader' },
        { week: 8, topic: 'Build: Quiz game', slugs: ['old-banyan-trees-stories'], levels: ['L2'], objectives: ['Combine all concepts into a complete program', 'User input, scoring, feedback'], project: 'Interactive nature quiz with scoring' },
        { week: 9, topic: 'Intro to NumPy — arrays and math', slugs: ['orange-sunsets-assam'], levels: ['L1', 'L2'], objectives: ['Create numpy arrays', 'Vectorized operations', 'Statistics: mean, std, min, max'], project: 'Sunset color analyzer' },
        { week: 10, topic: 'NumPy for science — simulation basics', slugs: ['fishermans-daughter-storm'], levels: ['L2'], objectives: ['Random number generation', 'Simple simulations', 'Accumulation patterns'], project: 'Storm intensity simulator' },
        { week: 11, topic: 'Build: Password generator', slugs: [], levels: [], objectives: ['Random selection from character sets', 'Strength scoring', 'User interface'], project: 'Secure password generator with strength meter' },
        { week: 12, topic: 'Term 1 showcase and review', slugs: [], levels: [], objectives: ['Present quiz game or password generator', 'Explain code structure'], project: 'Project demonstration' },
      ],
    },
    {
      term: 2,
      title: 'Data & Visualization',
      description: 'Turn numbers into understanding with charts, plots, and data analysis.',
      weeks: [
        { week: 13, topic: 'Matplotlib basics — your first plot', slugs: ['orange-sunsets-assam'], levels: ['L2'], objectives: ['Create line plots', 'Labels, titles, colors', 'Save plots as images'] },
        { week: 14, topic: 'Bar charts, scatter plots, histograms', slugs: ['honey-hunters-lesson'], levels: ['L2'], objectives: ['Choose the right chart type', 'Multiple subplots', 'Styling'], project: 'Bee colony dashboard' },
        { week: 15, topic: 'Multi-panel dashboards', slugs: ['fishermans-daughter-storm'], levels: ['L2', 'L3'], objectives: ['Create 2x2 figure layouts', 'Shared axes', 'Color maps'], project: 'Cyclone data dashboard' },
        { week: 16, topic: 'Reading real data — CSV and data cleaning', slugs: ['snow-leopards-promise'], levels: ['L2'], objectives: ['Load CSV with numpy', 'Handle missing values', 'Filter and sort'], project: 'Wildlife sighting data cleaner' },
        { week: 17, topic: 'Time series analysis', slugs: ['monsoon-home'], levels: ['L2', 'L3'], objectives: ['Plot data over time', 'Moving averages', 'Trend detection'], project: 'Monsoon rainfall trend analyzer' },
        { week: 18, topic: 'Statistical analysis — distributions and correlation', slugs: ['girl-who-spoke-to-elephants'], levels: ['L3'], objectives: ['Histograms and normal distributions', 'Correlation coefficients', 'Scatter with trend lines'], project: 'Elephant weight vs age analysis' },
        { week: 19, topic: 'Geospatial data — mapping', slugs: ['stars-above-ziro'], levels: ['L2', 'L3'], objectives: ['Plot coordinates on a map-like figure', 'Color-code by value', 'Contour plots'], project: 'Light pollution map of NE India' },
        { week: 20, topic: 'Build: Weather data analyzer', slugs: ['fishermans-daughter-storm'], levels: ['L3'], objectives: ['End-to-end pipeline: load, clean, analyze, visualize', 'Multiple chart types'], project: 'Complete weather analysis report with 4 plots' },
        { week: 21, topic: 'Interactive exploration — parameter sweeps', slugs: ['old-banyan-trees-stories'], levels: ['L3'], objectives: ['Run simulations with different parameters', 'Compare results visually'], project: 'Tree growth simulator with variable conditions' },
        { week: 22, topic: 'Build: Population tracker', slugs: ['honey-hunters-lesson'], levels: ['L3'], objectives: ['Model population dynamics', 'Visualize growth/decline scenarios', 'Sensitivity analysis'], project: 'Bee colony population tracker' },
        { week: 23, topic: 'Portfolio: compile your best visualizations', slugs: [], levels: [], objectives: ['Select 5 best plots', 'Write captions', 'Create a visual portfolio'] },
        { week: 24, topic: 'Term 2 showcase and review', slugs: [], levels: [], objectives: ['Present data analysis portfolio'], project: 'Portfolio presentation' },
      ],
    },
    {
      term: 3,
      title: 'Intro to AI',
      description: 'Understand how machines learn from data — classification, prediction, and pattern recognition.',
      weeks: [
        { week: 25, topic: 'What is machine learning? — the big picture', slugs: ['girl-who-spoke-to-elephants'], levels: ['L3'], objectives: ['Distinguish supervised vs unsupervised learning', 'Training vs testing data', 'Features and labels'] },
        { week: 26, topic: 'k-Nearest Neighbors — your first classifier', slugs: ['girl-who-spoke-to-elephants'], levels: ['L3'], objectives: ['Understand distance-based classification', 'Implement kNN from scratch', 'Accuracy measurement'], project: 'Elephant call classifier' },
        { week: 27, topic: 'Training and testing — avoiding overfitting', slugs: ['why-the-muga-silk-is-golden'], levels: ['L3'], objectives: ['Train/test split', 'Cross-validation', 'Confusion matrix'], project: 'Silk quality predictor' },
        { week: 28, topic: 'Decision trees — rule-based classification', slugs: ['honey-hunters-lesson'], levels: ['L3', 'L4'], objectives: ['Build decision tree from data', 'Feature importance', 'Pruning'], project: 'Colony health decision tree' },
        { week: 29, topic: 'Linear regression — predicting numbers', slugs: ['old-banyan-trees-stories'], levels: ['L3', 'L4'], objectives: ['Fit a line to data', 'Evaluate with RMSE', 'Predict from new inputs'], project: 'Tree age predictor from measurements' },
        { week: 30, topic: 'Feature engineering — making data useful', slugs: ['fishermans-daughter-storm'], levels: ['L3'], objectives: ['Create derived features', 'Normalization and scaling', 'Feature selection'], project: 'Cyclone intensity predictor' },
        { week: 31, topic: 'Build: Spam classifier', slugs: [], levels: [], objectives: ['Text feature extraction (word counts)', 'Train classifier on text data', 'Evaluate precision/recall'], project: 'Spam message detector', newContent: true },
        { week: 32, topic: 'Image basics — pixels and arrays', slugs: ['kingfisher-blue'], levels: ['L2', 'L3'], objectives: ['Represent images as numpy arrays', 'Color channels', 'Basic image operations'], project: 'Image color analyzer' },
        { week: 33, topic: 'Image classification — template matching', slugs: ['girl-who-spoke-to-elephants'], levels: ['L4'], objectives: ['Compare images using pixel distance', 'Build simple image classifier', 'Accuracy on test set'], project: 'Animal silhouette recognizer' },
        { week: 34, topic: 'Neural network concepts — perceptrons', slugs: [], levels: [], objectives: ['Understand weights, bias, activation', 'Train a single perceptron', 'XOR problem'], project: 'Perceptron that classifies points', newContent: true },
        { week: 35, topic: 'Build: Simple neural network from scratch', slugs: [], levels: [], objectives: ['Multi-layer network', 'Forward pass', 'Backpropagation intuition'], project: '2-layer neural network classifier', newContent: true },
        { week: 36, topic: 'Term 3 showcase', slugs: [], levels: [], objectives: ['Present ML project'], project: 'ML project demonstration' },
      ],
    },
    {
      term: 4,
      title: 'AI Projects & Capstone',
      description: 'Apply everything to build real AI-powered tools.',
      weeks: [
        { week: 37, topic: 'Natural language basics — text as data', slugs: [], levels: [], objectives: ['Tokenization', 'Word frequency analysis', 'Sentiment scoring'], project: 'Story sentiment analyzer', newContent: true },
        { week: 38, topic: 'Chatbot fundamentals — rule-based', slugs: [], levels: [], objectives: ['Pattern matching', 'Response templates', 'Conversation state'], project: 'Nature fact chatbot', newContent: true },
        { week: 39, topic: 'Recommendation systems', slugs: ['boy-who-built-a-library'], levels: ['L3'], objectives: ['Similarity-based recommendations', 'Collaborative filtering basics'], project: 'Story recommender ("if you liked this...")' },
        { week: 40, topic: 'Time series forecasting', slugs: ['monsoon-home'], levels: ['L3', 'L4'], objectives: ['Trend + seasonal decomposition', 'Simple forecasting models', 'Confidence intervals'], project: 'Rainfall predictor for next month' },
        { week: 41, topic: 'Ethics in AI — bias, fairness, and responsibility', slugs: [], levels: [], objectives: ['Understand training data bias', 'Fairness metrics', 'Responsible AI practices'], newContent: true },
        { week: 42, topic: 'Capstone planning — choose your AI project', slugs: [], levels: [], objectives: ['Define problem and dataset', 'Choose algorithm', 'Plan evaluation strategy'] },
        { week: 43, topic: 'Capstone build — data collection and prep', slugs: [], levels: ['L4'], objectives: ['Gather and clean training data', 'Feature engineering'], project: 'Capstone phase 1' },
        { week: 44, topic: 'Capstone build — model training', slugs: [], levels: ['L4'], objectives: ['Train and evaluate models', 'Hyperparameter tuning'], project: 'Capstone phase 2' },
        { week: 45, topic: 'Capstone build — visualization and reporting', slugs: [], levels: ['L4'], objectives: ['Create result visualizations', 'Write methodology section'], project: 'Capstone phase 3' },
        { week: 46, topic: 'Documentation and portfolio', slugs: [], levels: [], objectives: ['Complete project report', 'Add to portfolio website'], project: 'Portfolio documentation' },
        { week: 47, topic: 'Final showcase rehearsal', slugs: [], levels: [], objectives: ['Practice presentation', 'Peer review'], project: 'Dry run' },
        { week: 48, topic: 'Graduation showcase', slugs: [], levels: [], objectives: ['Present capstone to audience'], project: 'Live demo and certificate' },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// TRACK 3: CREATIVE CODING (WEB)
// ═══════════════════════════════════════════════════════════════
export const creativeTrack: TrackCurriculum = {
  id: 'creative',
  name: 'Creative Coding',
  tagline: 'Build beautiful, interactive things for the web',
  icon: '🎨',
  color: 'violet',
  audience: 'Grade 8-12, no prior experience',
  prerequisite: 'Web Basics (/learn/web-basics)',
  capstoneProject: 'Build and deploy a full interactive web application with data visualization',
  terms: [
    {
      term: 1,
      title: 'Web Basics',
      description: 'HTML structure, CSS styling, and your first web pages.',
      weeks: [
        { week: 1, topic: 'HTML — the skeleton of every webpage', slugs: ['boy-who-built-a-library'], levels: ['L0'], objectives: ['Write valid HTML', 'Understand tags, attributes, nesting'], basics: '/learn/web-basics' },
        { week: 2, topic: 'HTML structure — headings, lists, links, images', slugs: ['boy-who-built-a-library'], levels: ['L0', 'L1'], objectives: ['Build multi-section pages', 'Add images and links', 'Semantic HTML'], project: 'Personal "About Me" page' },
        { week: 3, topic: 'CSS — adding style to structure', slugs: ['boy-who-built-a-library'], levels: ['L1'], objectives: ['Color, fonts, spacing', 'Classes and IDs', 'Box model'], project: 'Styled personal page' },
        { week: 4, topic: 'CSS layout — flexbox', slugs: ['boy-who-built-a-library'], levels: ['L1'], objectives: ['Display flex', 'Justify and align', 'Responsive cards'], project: 'Card layout for favorite stories' },
        { week: 5, topic: 'CSS Grid — two-dimensional layouts', slugs: ['boy-who-built-a-library'], levels: ['L1', 'L2'], objectives: ['Grid template rows/columns', 'Gap and alignment', 'Responsive grid'], project: 'Photo gallery layout' },
        { week: 6, topic: 'Responsive design — mobile-first', slugs: [], levels: [], objectives: ['Media queries', 'Viewport meta tag', 'Mobile-first approach'], project: 'Make your pages work on phone screens', newContent: true },
        { week: 7, topic: 'CSS animations and transitions', slugs: [], levels: [], objectives: ['Hover effects', 'Transitions', 'Keyframe animations'], project: 'Animated navigation menu', newContent: true },
        { week: 8, topic: 'Build: Personal portfolio website', slugs: ['boy-who-built-a-library'], levels: ['L2'], objectives: ['Multi-page site', 'Consistent styling', 'Navigation'], project: 'Portfolio with 3+ pages' },
        { week: 9, topic: 'Typography and color theory', slugs: ['the-girl-who-painted-rain'], levels: ['L0'], objectives: ['Font pairing', 'Color palettes', 'Visual hierarchy'], project: 'Redesign your portfolio with better typography' },
        { week: 10, topic: 'Forms and user input (HTML)', slugs: [], levels: [], objectives: ['Input types', 'Labels and accessibility', 'Form structure'], project: 'Contact form', newContent: true },
        { week: 11, topic: 'Build: Recipe website', slugs: [], levels: [], objectives: ['Content organization', 'Consistent design system', 'Print stylesheet'], project: 'Recipe collection website', newContent: true },
        { week: 12, topic: 'Term 1 showcase', slugs: [], levels: [], objectives: ['Present portfolio website'], project: 'Website demonstration' },
      ],
    },
    {
      term: 2,
      title: 'JavaScript & Interactivity',
      description: 'Make pages come alive with JavaScript — events, DOM manipulation, and dynamic content.',
      weeks: [
        { week: 13, topic: 'JavaScript basics — variables, types, console', slugs: ['boy-who-built-a-library'], levels: ['L2'], objectives: ['let/const', 'String/number/boolean/array', 'console.log for debugging'] },
        { week: 14, topic: 'Functions and control flow', slugs: ['boy-who-built-a-library'], levels: ['L2'], objectives: ['Arrow functions', 'if/else', 'for loops', 'Array methods'], project: 'Temperature converter' },
        { week: 15, topic: 'DOM manipulation — changing the page with code', slugs: ['boy-who-built-a-library'], levels: ['L2', 'L3'], objectives: ['getElementById/querySelector', 'Changing text and styles', 'Adding/removing elements'], project: 'Dynamic color picker' },
        { week: 16, topic: 'Events — responding to user actions', slugs: ['boy-who-built-a-library'], levels: ['L3'], objectives: ['Click, input, submit events', 'addEventListener', 'Event delegation'], project: 'Interactive quiz' },
        { week: 17, topic: 'Arrays and objects — structured data in JS', slugs: [], levels: [], objectives: ['Object literals', 'Array of objects', 'Destructuring'], project: 'Student gradebook', newContent: true },
        { week: 18, topic: 'Local storage — saving data in the browser', slugs: [], levels: [], objectives: ['localStorage.setItem/getItem', 'JSON.stringify/parse', 'Persistence'], project: 'Notes app that saves between visits', newContent: true },
        { week: 19, topic: 'Build: Interactive quiz app', slugs: ['boy-who-built-a-library'], levels: ['L3'], objectives: ['Dynamic questions', 'Score tracking', 'Results display'], project: 'Nature knowledge quiz' },
        { week: 20, topic: 'Fetch and APIs — getting data from the internet', slugs: [], levels: [], objectives: ['fetch()', 'Promises and async/await', 'JSON parsing'], project: 'Weather data fetcher', newContent: true },
        { week: 21, topic: 'Build: Drawing app', slugs: [], levels: [], objectives: ['Canvas element', 'Mouse events', 'Drawing tools'], project: 'Simple paint application', newContent: true },
        { week: 22, topic: 'Animations with requestAnimationFrame', slugs: [], levels: [], objectives: ['Animation loop', 'Smooth movement', 'Easing functions'], project: 'Bouncing ball animation', newContent: true },
        { week: 23, topic: 'Build: Memory card game', slugs: [], levels: [], objectives: ['Game state management', 'Card flip animation', 'Win detection'], project: 'Card matching game', newContent: true },
        { week: 24, topic: 'Term 2 showcase', slugs: [], levels: [], objectives: ['Present interactive project'], project: 'App demonstration' },
      ],
    },
    {
      term: 3,
      title: 'Games & Creative Projects',
      description: 'Canvas animations, collision detection, and complete game development.',
      weeks: [
        { week: 25, topic: 'Canvas deep dive — shapes, colors, transforms', slugs: [], levels: [], objectives: ['Draw shapes programmatically', 'Gradients and patterns', 'Rotation and scaling'], newContent: true },
        { week: 26, topic: 'Sprite animation — character movement', slugs: [], levels: [], objectives: ['Sprite sheets', 'Frame animation', 'Keyboard controls'], project: 'Animated character that walks', newContent: true },
        { week: 27, topic: 'Collision detection — AABB and circle', slugs: [], levels: [], objectives: ['Bounding box collision', 'Circle collision', 'Response (bounce, stop)'], project: 'Ball that bounces off walls and paddles', newContent: true },
        { week: 28, topic: 'Build: Breakout/Pong game', slugs: [], levels: [], objectives: ['Complete game loop', 'Scoring', 'Lives'], project: 'Pong or Breakout game', newContent: true },
        { week: 29, topic: 'Particle systems — fire, rain, explosions', slugs: ['firefly-festival-of-majuli'], levels: ['L2'], objectives: ['Particle class', 'Emitters', 'Physics (gravity, wind)'], project: 'Firefly particle effect' },
        { week: 30, topic: 'Procedural generation — random worlds', slugs: [], levels: [], objectives: ['Noise functions', 'Terrain generation', 'Random with constraints'], project: 'Procedural landscape', newContent: true },
        { week: 31, topic: 'Build: Platformer game — level 1', slugs: [], levels: [], objectives: ['Gravity and jumping', 'Platform collision', 'Camera scrolling'], project: 'Platformer game', newContent: true },
        { week: 32, topic: 'Build: Platformer game — level 2', slugs: [], levels: [], objectives: ['Enemies and hazards', 'Collectibles', 'Multiple levels'], project: 'Complete platformer' },
        { week: 33, topic: 'Sound and music in web games', slugs: ['music-dimasa'], levels: ['L1'], objectives: ['Web Audio API basics', 'Sound effects on events', 'Background music'], project: 'Add sound to your game' },
        { week: 34, topic: 'Game polish — menus, transitions, feedback', slugs: [], levels: [], objectives: ['Start screen', 'Game over screen', 'Visual feedback'], project: 'Polished game with full UX', newContent: true },
        { week: 35, topic: 'Publish your game — hosting on the web', slugs: [], levels: [], objectives: ['GitHub Pages', 'Build and deploy', 'Share URL'], project: 'Published game', newContent: true },
        { week: 36, topic: 'Term 3 showcase — game demo day', slugs: [], levels: [], objectives: ['Present game to audience', 'Collect player feedback'], project: 'Game showcase' },
      ],
    },
    {
      term: 4,
      title: 'Full Projects & Portfolio',
      description: 'Build production-quality web applications and assemble your portfolio.',
      weeks: [
        { week: 37, topic: 'Responsive design patterns — real-world layouts', slugs: [], levels: [], objectives: ['Navigation patterns', 'Hero sections', 'Footer layouts'], project: 'Responsive landing page', newContent: true },
        { week: 38, topic: 'CSS frameworks — Tailwind basics', slugs: [], levels: [], objectives: ['Utility-first CSS', 'Rapid prototyping', 'Component patterns'], project: 'Rebuild portfolio with Tailwind', newContent: true },
        { week: 39, topic: 'APIs and data visualization', slugs: ['fishermans-daughter-storm'], levels: ['L3'], objectives: ['Fetch real data', 'Chart.js or custom SVG charts', 'Interactive dashboards'], project: 'Data dashboard' },
        { week: 40, topic: 'Build: Weather dashboard', slugs: ['monsoon-home'], levels: ['L3'], objectives: ['Real-time data fetching', 'Multiple chart types', 'Responsive layout'], project: 'Weather dashboard app' },
        { week: 41, topic: 'Accessibility and performance', slugs: [], levels: [], objectives: ['ARIA labels', 'Keyboard navigation', 'Performance audit'], project: 'Audit and fix your portfolio', newContent: true },
        { week: 42, topic: 'Capstone planning — choose your web project', slugs: [], levels: [], objectives: ['Define project scope', 'Wireframe', 'Tech stack decision'] },
        { week: 43, topic: 'Capstone build — week 1', slugs: [], levels: ['L4'], objectives: ['HTML/CSS structure', 'Core layout'], project: 'Capstone phase 1' },
        { week: 44, topic: 'Capstone build — week 2', slugs: [], levels: ['L4'], objectives: ['JavaScript functionality', 'Data integration'], project: 'Capstone phase 2' },
        { week: 45, topic: 'Capstone build — week 3', slugs: [], levels: ['L4'], objectives: ['Polish, testing, responsive'], project: 'Capstone phase 3' },
        { week: 46, topic: 'Deploy and document', slugs: [], levels: [], objectives: ['Deploy to web', 'Write README', 'Create demo video'] },
        { week: 47, topic: 'Final showcase rehearsal', slugs: [], levels: [], objectives: ['Practice presentation'], project: 'Dry run' },
        { week: 48, topic: 'Graduation showcase', slugs: [], levels: [], objectives: ['Present capstone', 'Receive certificate'], project: 'Live demo and certificate' },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// TRACK 4: COMBINED — ROBOTICS + PROGRAMMING
// ═══════════════════════════════════════════════════════════════
export const combinedTrack: TrackCurriculum = {
  id: 'combined',
  name: 'Robotics + Programming',
  tagline: 'The full stack — code the algorithm, wire the hardware, build the robot',
  icon: '⚡',
  color: 'amber',
  audience: 'Grade 9-12, motivated students who want both',
  prerequisite: 'Arduino Basics + Python Basics',
  capstoneProject: 'Build a smart robot that uses Python AI to process sensor data and Arduino to control hardware',
  terms: [
    {
      term: 1,
      title: 'Foundations — Python + Circuits',
      description: 'Learn Python and Arduino in parallel — code a simulation, then build it in hardware.',
      weeks: [
        { week: 1, topic: 'Python: variables, print, types', slugs: ['girl-who-spoke-to-elephants'], levels: ['L0'], objectives: ['Write first Python program', 'Variables and types'], basics: '/learn/python-basics' },
        { week: 2, topic: 'Arduino: setup, loop, blink', slugs: ['firefly-festival-of-majuli'], levels: ['L0', 'L1'], objectives: ['Upload first Arduino sketch', 'Blink an LED'], basics: '/learn/arduino-basics' },
        { week: 3, topic: 'Python: lists and loops', slugs: ['old-banyan-trees-stories'], levels: ['L0', 'L1'], objectives: ['For loops', 'List operations'], project: 'Tree growth data processor' },
        { week: 4, topic: 'Arduino: multiple LEDs and patterns', slugs: ['firefly-festival-of-majuli'], levels: ['L1'], objectives: ['Arrays in C', 'For loops', 'LED patterns'], project: 'LED chase pattern' },
        { week: 5, topic: 'Python: functions and modules', slugs: ['honey-hunters-lesson'], levels: ['L1'], objectives: ['Define and call functions', 'Import modules'], project: 'Colony health calculator' },
        { week: 6, topic: 'Arduino: buttons and input', slugs: ['river-dolphins-secret'], levels: ['L1'], objectives: ['digitalRead', 'if/else', 'State tracking'], project: 'Button-controlled modes' },
        { week: 7, topic: 'Python: numpy arrays and math', slugs: ['orange-sunsets-assam'], levels: ['L1', 'L2'], objectives: ['Numpy basics', 'Vectorized math'], project: 'Light spectrum analyzer' },
        { week: 8, topic: 'Arduino: analog sensors', slugs: ['monsoon-home'], levels: ['L1'], objectives: ['analogRead', 'Voltage dividers', 'Sensor reading'], project: 'Light level monitor' },
        { week: 9, topic: 'Python: matplotlib — visualizing data', slugs: ['fishermans-daughter-storm'], levels: ['L2'], objectives: ['Line plots', 'Bar charts', 'Labels and titles'], project: 'Sensor data plotter' },
        { week: 10, topic: 'Arduino + Python: Serial bridge', slugs: ['girl-who-spoke-to-elephants'], levels: ['L2'], objectives: ['Send data from Arduino to Python', 'Parse serial data', 'Real-time plotting'], project: 'Live sensor dashboard' },
        { week: 11, topic: 'Build: Smart night light (hardware + data logging)', slugs: ['orange-sunsets-assam'], levels: ['L2', 'L3'], objectives: ['Arduino reads light sensor', 'Python logs and plots data', 'Automatic LED control'], project: 'Smart night light with data log' },
        { week: 12, topic: 'Term 1 showcase', slugs: [], levels: [], objectives: ['Demo hardware project with Python visualization'], project: 'Night light demo' },
      ],
    },
    {
      term: 2,
      title: 'Sensors + Data Science',
      description: 'Collect real-world data with Arduino sensors, analyze it with Python.',
      weeks: [
        { week: 13, topic: 'Multi-sensor Arduino setup', slugs: ['snow-leopards-promise'], levels: ['L1', 'L2'], objectives: ['Wire 3+ sensors', 'Structured serial output'], project: 'Multi-sensor weather station' },
        { week: 14, topic: 'Python data pipelines — from serial to CSV', slugs: ['fishermans-daughter-storm'], levels: ['L2'], objectives: ['Read serial in Python', 'Save to CSV', 'Data validation'], project: 'Automated data collection pipeline' },
        { week: 15, topic: 'Statistical analysis of sensor data', slugs: ['old-banyan-trees-stories'], levels: ['L2', 'L3'], objectives: ['Mean, std, outlier detection', 'Sensor noise analysis'], project: 'Sensor accuracy report' },
        { week: 16, topic: 'Time series from sensors', slugs: ['monsoon-home'], levels: ['L3'], objectives: ['Moving averages', 'Trend detection', 'Anomaly alerts'], project: 'Temperature anomaly detector' },
        { week: 17, topic: 'Dashboard design — multiple charts', slugs: ['honey-hunters-lesson'], levels: ['L3'], objectives: ['4-panel dashboard', 'Real-time updates', 'Alert thresholds'], project: 'Sensor monitoring dashboard' },
        { week: 18, topic: 'Ultrasonic mapping — distance sensing', slugs: ['river-dolphins-secret'], levels: ['L2', 'L3'], objectives: ['Sweep servo with ultrasonic', 'Build distance map', 'Visualize in Python'], project: 'Room scanner with distance map' },
        { week: 19, topic: 'Sound analysis — microphone to frequency', slugs: ['dhol-drum'], levels: ['L2', 'L3'], objectives: ['Sample audio from Arduino', 'FFT in Python', 'Frequency identification'], project: 'Sound frequency analyzer' },
        { week: 20, topic: 'Build: Environmental monitoring station', slugs: ['stars-above-ziro'], levels: ['L3'], objectives: ['Multi-sensor data collection', 'Automated analysis', 'Alert system'], project: 'Complete environmental monitor' },
        { week: 21, topic: 'Data cleaning and calibration', slugs: ['fishermans-daughter-storm'], levels: ['L3'], objectives: ['Calibration curves', 'Error estimation', 'Quality scoring'], project: 'Calibrated sensor report' },
        { week: 22, topic: 'Scientific reporting with Python', slugs: ['old-banyan-trees-stories'], levels: ['L3', 'L4'], objectives: ['Generate formatted report', 'Tables + plots', 'Methodology section'], project: 'Scientific sensor report' },
        { week: 23, topic: 'Build: 48-hour data collection experiment', slugs: [], levels: [], objectives: ['Design experiment', 'Collect data overnight', 'Analyze results'], project: 'Real science experiment' },
        { week: 24, topic: 'Term 2 showcase', slugs: [], levels: [], objectives: ['Present monitoring station and data analysis'], project: 'Experiment results presentation' },
      ],
    },
    {
      term: 3,
      title: 'Smart Robots',
      description: 'Build robots that sense, think (in Python), and act (with Arduino).',
      weeks: [
        { week: 25, topic: 'Robot chassis + motor control', slugs: ['dragonfly-and-the-paddy-field'], levels: ['L1'], objectives: ['Assemble robot', 'Motor driver wiring', 'Basic movement'], project: 'Robot drives in patterns', newContent: true },
        { week: 26, topic: 'Obstacle avoidance — Arduino only', slugs: ['river-dolphins-secret'], levels: ['L2', 'L3'], objectives: ['Ultrasonic scan', 'Decision algorithm', 'Autonomous navigation'], project: 'Obstacle avoider' },
        { week: 27, topic: 'Python brain — send commands via Serial', slugs: ['girl-who-spoke-to-elephants'], levels: ['L3'], objectives: ['Python sends movement commands', 'Arduino executes', 'Bidirectional communication'], project: 'Python-controlled robot' },
        { week: 28, topic: 'Sensor data to Python for analysis', slugs: ['snow-leopards-promise'], levels: ['L3'], objectives: ['Arduino streams sensor data', 'Python makes navigation decisions', 'Closed-loop control'], project: 'Smart navigation with Python brain' },
        { week: 29, topic: 'Machine learning on sensor data', slugs: ['girl-who-spoke-to-elephants'], levels: ['L3', 'L4'], objectives: ['Train classifier on sensor patterns', 'Surface type detection', 'Adaptive behavior'], project: 'Robot that detects floor types' },
        { week: 30, topic: 'Mapping — build a map while driving', slugs: ['map-makers-granddaughter'], levels: ['L3'], objectives: ['Record sensor readings with position', 'Build 2D occupancy map', 'Visualize in Python'], project: 'Room mapper' },
        { week: 31, topic: 'Path planning — A* algorithm', slugs: ['map-makers-granddaughter'], levels: ['L3', 'L4'], objectives: ['Grid-based path planning', 'Obstacle-aware routing', 'Execute plan on robot'], project: 'Robot navigates to goal', newContent: true },
        { week: 32, topic: 'PID control with Python tuning', slugs: ['fishermans-daughter-storm'], levels: ['L3', 'L4'], objectives: ['PID in Python', 'Serial parameter tuning', 'Smooth line following'], project: 'PID-tuned line follower' },
        { week: 33, topic: 'Multi-robot coordination', slugs: ['firefly-festival-of-majuli'], levels: ['L4'], objectives: ['Two robots communicating', 'Leader-follower', 'Collaborative task'], project: 'Robot pair that cooperates', newContent: true },
        { week: 34, topic: 'Build: Smart robot integration', slugs: [], levels: ['L4'], objectives: ['Combine sensing, ML, and control', 'End-to-end autonomous system'], project: 'Fully autonomous smart robot' },
        { week: 35, topic: 'Robot competition — timed challenges', slugs: [], levels: [], objectives: ['Navigate course', 'Optimize performance'], project: 'Competition run' },
        { week: 36, topic: 'Term 3 showcase — robot demo', slugs: [], levels: [], objectives: ['Demo smart robot'], project: 'Robot demonstration' },
      ],
    },
    {
      term: 4,
      title: 'Capstone — AI-Powered Robot',
      description: 'Design, build, and present a robot that combines everything you have learned.',
      weeks: [
        { week: 37, topic: 'IoT concepts — robots on the network', slugs: [], levels: [], objectives: ['WiFi basics', 'MQTT protocol', 'Cloud data logging'], newContent: true },
        { week: 38, topic: 'Remote monitoring dashboard', slugs: [], levels: [], objectives: ['Web dashboard for robot data', 'Real-time updates', 'Control interface'], project: 'Robot web dashboard', newContent: true },
        { week: 39, topic: 'Computer vision basics', slugs: ['girl-who-spoke-to-elephants'], levels: ['L4'], objectives: ['Webcam capture in Python', 'Color detection', 'Object tracking'], project: 'Color-following robot', newContent: true },
        { week: 40, topic: 'Edge AI — running models on small devices', slugs: [], levels: [], objectives: ['Model optimization', 'Inference on Raspberry Pi', 'Latency vs accuracy'], newContent: true },
        { week: 41, topic: 'Capstone planning — design your smart robot', slugs: [], levels: [], objectives: ['Define problem', 'System architecture', 'Component list'] },
        { week: 42, topic: 'Capstone build — hardware assembly', slugs: [], levels: ['L4'], objectives: ['Build robot chassis', 'Wire all sensors', 'Test connections'], project: 'Capstone phase 1' },
        { week: 43, topic: 'Capstone build — Arduino firmware', slugs: [], levels: ['L4'], objectives: ['Write sensor reading code', 'Motor control', 'Serial protocol'], project: 'Capstone phase 2' },
        { week: 44, topic: 'Capstone build — Python AI brain', slugs: [], levels: ['L4'], objectives: ['Data processing pipeline', 'ML model integration', 'Decision logic'], project: 'Capstone phase 3' },
        { week: 45, topic: 'Capstone build — integration and testing', slugs: [], levels: ['L4'], objectives: ['End-to-end testing', 'Debug and optimize', 'Edge case handling'], project: 'Capstone phase 4' },
        { week: 46, topic: 'Documentation — technical report and video', slugs: [], levels: [], objectives: ['Write project report', 'Record demo video', 'Create poster'] },
        { week: 47, topic: 'Final showcase rehearsal', slugs: [], levels: [], objectives: ['Practice demo', 'Peer feedback'], project: 'Dry run' },
        { week: 48, topic: 'Graduation showcase', slugs: [], levels: [], objectives: ['Present AI robot to parents and guests'], project: 'Live demo, report, and certificate' },
      ],
    },
  ],
};

export const allTracks: TrackCurriculum[] = [roboticsTrack, pythonAITrack, creativeTrack, combinedTrack];
