import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'animal-senses-and-behavior',
  title: 'Animal Senses & Behavior',
  category: 'zoology',
  icon: '🦇',
  tagline: 'How animals see, hear, and sense the world in ways humans cannot.',
  relatedStories: ['girl-who-spoke-to-elephants', 'tigers-whisker', 'river-dolphins-secret', 'owl-wisest', 'dancing-deer-of-loktak-lake', 'peacocks-dance'],
  understand: [
    // ── Section 1: Senses Beyond Human Perception ────────────────
    {
      title: 'Senses Beyond Human Perception',
      diagram: 'FishIridescenceDiagram',
      beginnerContent:
        'Close your eyes and imagine the Brahmaputra at night. You see nothing, hear the water, maybe smell the damp earth. But a pit viper coiled on the bank **sees** the warm body of a frog glowing in infrared. A Gangetic dolphin navigates the pitch-black silt by **listening** to echoes. A migrating bar-headed goose overhead **feels** Earth\'s magnetic field like an invisible compass needle in its eye.\n\n' +
        'Every animal lives in its own sensory world — the German biologist Jakob von Uexkull called it the **Umwelt** (pronounced OOM-velt). A bee\'s Umwelt includes ultraviolet patterns on flowers invisible to us. A shark\'s Umwelt includes the faint electric pulse of a fish\'s heartbeat buried in sand. Our human senses are just one narrow window.\n\n' +
        '**Analogy:** Think of a radio. All the stations are broadcasting at the same time, but your radio can only tune to one frequency. Animals have different "radios" — some tuned to infrared, some to electric fields, some to magnetic lines.\n\n' +
        '| Animal | Superpower sense | What it detects | Human equivalent? |\n' +
        '|--------|-----------------|-----------------|-------------------|\n' +
        '| Pit viper | Infrared pits | Body heat of prey in total darkness | Like thermal goggles |\n' +
        '| Shark | Ampullae of Lorenzini | Electric fields from muscle twitches | No equivalent |\n' +
        '| Migratory birds | Magnetoreception | Earth\'s magnetic field direction | Like a built-in GPS |\n' +
        '| Mantis shrimp | 16-receptor eyes | UV light, polarised light | We have only 3 receptor types |\n' +
        '| Gangetic dolphin | Echolocation | 3D map from sound echoes in murky water | Like sonar on a submarine |\n' +
        '| Star-nosed mole | Eimer\'s organs | Touch at 25,000 receptors on nose | Like having fingertips on your face |\n\n' +
        'Kaziranga National Park is home to animals whose senses dwarf ours — one-horned rhinos that communicate with infrasonic grunts, king cobras that flick their tongues to "taste" chemical trails in the air, and fishing cats at Deepor Beel that sense vibrations of fish through their whiskers.\n\n' +
        '| Sense | Frequency/range in humans | Range in champion animal |\n' +
        '|-------|--------------------------|-------------------------|\n' +
        '| Hearing | 20 Hz – 20,000 Hz | Bat: up to 200,000 Hz |\n' +
        '| Vision | 380–700 nm (visible) | Mantis shrimp: 300–720 nm (UV to far-red) |\n' +
        '| Smell | ~400 receptor types | Dog: ~800 receptor types, 10,000× more sensitive |\n' +
        '| Touch | Fingertip: ~2 mm resolution | Star-nosed mole: ~0.5 mm resolution |\n' +
        '| Electroreception | None | Shark: 5 nV/cm (5 billionths of a volt) |\n\n' +
        '**Check yourself:** If you could pick one animal superpower sense, which would be most useful for navigating Guwahati during a monsoon power cut?',
      intermediateContent:
        'Let\'s put numbers on these superpowers.\n\n' +
        '**Pit viper infrared detection:**\n\n' +
        'The pit organ contains a thin membrane (~15 μm thick) with ~1,800 heat-sensitive neurons using **TRPA1 ion channels**. These channels detect temperature changes as small as **0.003 degrees C** — that\'s like sensing a candle flame from 30 metres away. The pit has a pinhole-camera design giving spatial resolution of ~5 degrees.\n\n' +
        '| Parameter | Pit viper | Best human thermal camera |\n' +
        '|-----------|-----------|-------------------------|\n' +
        '| Temperature sensitivity | 0.003 degrees C | 0.02 degrees C |\n' +
        '| Detection range (mouse) | ~1 m | >100 m |\n' +
        '| Response time | ~35 ms | ~15 ms |\n' +
        '| Spatial resolution | ~5 degrees | <0.05 degrees |\n' +
        '| Power consumption | ~0.01 W (biological) | ~3 W (electronic) |\n\n' +
        'The snake\'s sensitivity is better than engineered cameras, but its spatial resolution is much coarser — it sees a "heat blob," not a sharp image.\n\n' +
        '**Shark electroreception:**\n\n' +
        'The **ampullae of Lorenzini** are jelly-filled canals ending in sensory cells. The jelly has the highest electrical conductivity of any known biological material. Sensitivity: **5 nV/cm** — that\'s equivalent to detecting the voltage from a 1.5V battery with electrodes separated by 3,000 km.\n\n' +
        '| Electric signal source | Field strength | Detectable by shark? |\n' +
        '|-----------------------|---------------|---------------------|\n' +
        '| Fish heartbeat (10 cm away) | ~0.5 μV/cm | Yes — easy |\n' +
        '| Fish muscle twitch (1 m away) | ~20 nV/cm | Yes |\n' +
        '| Crab buried in sand (30 cm) | ~50 nV/cm | Yes |\n' +
        '| Earth\'s magnetic field (swimming) | ~5 nV/cm | Borderline — may use for navigation |\n\n' +
        '**Magnetic sense in birds:**\n\n' +
        'Migratory birds likely use **cryptochrome proteins** in the retina. Light creates radical pairs (molecules with unpaired electrons) whose quantum spin states are influenced by Earth\'s magnetic field (~50 μT). This produces a visual overlay — the bird may literally **see** the magnetic field as a pattern of light and shadow superimposed on its normal vision. The system detects field inclination (angle of dip), not polarity — it\'s an inclination compass, not a polarity compass.',
      advancedContent:
        'The concept of **Umwelt** (von Uexkull, 1909) has been formalized in modern neuroethology through **sensory drive theory**: sensory systems evolve to match the statistical structure of signals in the animal\'s ecological niche.\n\n' +
        '**Active electrolocation in weakly electric fish:**\n\n' +
        'Mormyrids and gymnotids generate electric fields at 20–2,000 Hz via an electric organ and detect distortions through ~15,000 tuberous electroreceptors. The computational problem — reconstructing object shape, distance, and material from field distortions — is mathematically equivalent to solving an **inverse electromagnetic boundary problem**:\n\n' +
        '`nabla . (sigma nabla phi) = 0` (Laplace\'s equation in a conductive medium)\n\n' +
        'The fish\'s electrosensory lobe solves this in real-time using neural circuits with topographic maps of the body surface. This inspired algorithms for **underwater robot navigation** that don\'t rely on cameras or sonar.\n\n' +
        '| Sensory system | Physics exploited | Neural processing | Bio-inspired technology |\n' +
        '|---------------|------------------|-------------------|----------------------|\n' +
        '| Electroreception | E-field distortion | Electrosensory lobe maps | Underwater robot nav |\n' +
        '| Magnetoreception | Quantum radical pairs | Cluster N visual brain area | Autonomous drone compass |\n' +
        '| Infrared pits | Thermal radiation | Optic tectum overlay | Uncooled IR sensors |\n' +
        '| Echolocation | Sound reflection | Auditory cortex delay maps | Sonar, assistive canes |\n\n' +
        '**Quantum biology of magnetoreception:**\n\n' +
        'Cryptochrome radical pairs exhibit singlet-triplet interconversion rates sensitive to magnetic field orientation. The angular sensitivity is enhanced by **hyperfine interactions** with nitrogen nuclei. Recent evidence (Xu et al., 2021) showed that human cryptochrome 4 (CRY4) forms radical pairs sensitive to magnetic fields in vitro, suggesting the molecular machinery exists in humans too — we just lack the neural circuitry to use it. This makes avian magnetoreception one of the few confirmed **macroscopic quantum effects** in biology.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each animal to its superpower sense',
          pairs: [
            ['Pit viper', 'Infrared heat detection — "sees" warm prey in total darkness via pit organ'],
            ['Shark', 'Electroreception — detects nanovolts from a fish\'s heartbeat in sand'],
            ['Bar-headed goose', 'Magnetoreception — senses Earth\'s magnetic field as a visual compass overlay'],
            ['Mantis shrimp', 'UV + polarised light vision with 16 receptor types (humans have 3)'],
            ['Gangetic dolphin', 'Echolocation — builds a 3D sound-map of the murky Brahmaputra'],
          ],
        },
      },
    },

    // ── Section 2: Echolocation — Seeing with Sound ──────────────
    {
      title: 'Echolocation — Seeing with Sound',
      diagram: 'DolphinEcholocationDiagram',
      beginnerContent:
        'Imagine you\'re standing in a pitch-black cave and you clap your hands. The sound bounces off the walls and comes back to you — you can tell the wall is close if the echo returns quickly, and far if it takes longer. **That\'s echolocation in its simplest form.**\n\n' +
        'Bats and dolphins have turned this trick into a superpower. They emit high-frequency sound pulses — so fast you can\'t hear them — and listen for the echoes that bounce back from objects. Their brains calculate the distance, size, shape, and even texture of targets from those echoes.\n\n' +
        '**The Gangetic river dolphins of the Brahmaputra** have taken echolocation to the extreme. They are essentially blind — their tiny eyes can only tell light from dark. In the silt-choked, muddy waters of the Brahmaputra, seeing with light is useless anyway. Instead, they "see" entirely with sound. Their echolocation is so precise they can detect a **thin wire** in murky water where a human can\'t see their own hand.\n\n' +
        '| Feature | Bat echolocation | Dolphin echolocation |\n' +
        '|---------|-----------------|---------------------|\n' +
        '| Medium | Air (sound travels slowly) | Water (sound travels 4.3x faster) |\n' +
        '| Frequency | 20,000–200,000 Hz | 20,000–130,000 Hz |\n' +
        '| Range | ~5–30 m (insect hunting) | ~100+ m (fish finding) |\n' +
        '| Sound source | Larynx or nose | Melon (fatty forehead) |\n' +
        '| Echo receiver | Ears | Fat-filled lower jaw |\n' +
        '| Target | Moths, mosquitoes, beetles | Fish, squid, river bottom |\n\n' +
        '**How distance works:** Sound leaves the dolphin, hits a fish, and bounces back. If the echo returns in 0.01 seconds and sound in water travels at 1,480 m/s, the fish is `(1,480 x 0.01) / 2 = 7.4 metres` away. You divide by 2 because the sound made a round trip.\n\n' +
        '| Echo return time | Distance to target (in water) |\n' +
        '|-----------------|------------------------------|\n' +
        '| 0.001 s | 0.74 m — right in front |\n' +
        '| 0.01 s | 7.4 m — across a room |\n' +
        '| 0.1 s | 74 m — length of a football field |\n' +
        '| 0.5 s | 370 m — too far, echo too faint |\n\n' +
        '**Prediction:** If a bat is hunting in air (sound speed 343 m/s) and gets an echo back in 0.006 seconds, how far away is the moth? Try calculating: `(343 x 0.006) / 2 = ?`\n\n' +
        'The Gangetic river dolphin (locally called *shishu* or *hihu*) is found across the Brahmaputra river system. Assam is one of their last strongholds. Their echolocation clicks can be heard with hydrophones — conservation teams use this sound to survey dolphin populations without disturbing them.',
      intermediateContent:
        '**The echolocation equation:**\n\n' +
        '`d = (v x t) / 2`\n\n' +
        'where v = speed of sound, t = round-trip echo time, d = distance to target.\n\n' +
        '**Worked example — dolphin in the Brahmaputra:**\n\n' +
        'A Gangetic dolphin emits a click. The echo from a hilsa fish returns in 6.76 ms (0.00676 s). Sound speed in fresh river water at 25 degrees C is ~1,497 m/s.\n\n' +
        '`d = (1,497 x 0.00676) / 2 = 10.12 / 2 = 5.06 m`\n\n' +
        'The fish is about 5 metres away.\n\n' +
        '**Bat echolocation — the terminal buzz:**\n\n' +
        'As a bat closes in on prey, it speeds up its pulse rate dramatically:\n\n' +
        '| Phase | Pulse rate | Purpose |\n' +
        '|-------|-----------|--------|\n' +
        '| Search | ~10 pulses/s | Scanning wide area |\n' +
        '| Approach | ~30–50 pulses/s | Tracking moving target |\n' +
        '| Terminal buzz | 150–200 pulses/s | Sub-centimetre precision for the strike |\n\n' +
        'This is exactly analogous to a radar system switching from search mode to track mode to fire-control mode.\n\n' +
        '**Frequency and resolution:**\n\n' +
        'Bats emit calls at 20–200 kHz. Wavelength = v/f. At 100 kHz in air: wavelength = 343/100,000 = **3.4 mm**. This means a bat can resolve objects as small as a mosquito wing (~3 mm).\n\n' +
        '| Frequency (kHz) | Wavelength in air (mm) | Can resolve objects... |\n' +
        '|-----------------|----------------------|----------------------|\n' +
        '| 20 | 17.2 | Larger than a coin |\n' +
        '| 50 | 6.9 | Moth-sized |\n' +
        '| 100 | 3.4 | Mosquito-wing-sized |\n' +
        '| 200 | 1.7 | Finer than a grain of rice |\n\n' +
        '**Dolphin click loudness:**\n\n' +
        'Dolphins emit broadband clicks with peak energy of **220 dB re 1 uPa** — among the loudest sounds any animal produces. For comparison, a jet engine at 30 m is ~150 dB in air. The dolphin\'s fat-filled lower jaw channels returning echoes directly to the inner ear, and the brain detects interaural time differences of ~30 microseconds to determine direction.',
      advancedContent:
        '**Two echolocation strategies in bats:**\n\n' +
        '| Strategy | Species example | Call type | What it excels at |\n' +
        '|----------|---------------|-----------|------------------|\n' +
        '| **FM (frequency-modulated)** | Myotis (mouse-eared bats) | Broadband sweeps (100→30 kHz) | Range determination, cluttered environments |\n' +
        '| **CF-FM (constant-frequency)** | Rhinolophus (horseshoe bats) | Long CF tone + FM sweep | Detecting wing-beat flutter (Doppler) |\n\n' +
        '**FM bats** extract target range using **delay-tuned neurons** in the auditory cortex. Each neuron fires maximally at a specific echo delay (= specific distance), creating a topographic map of distance across the cortical surface.\n\n' +
        '**CF-FM bats** exploit the **Doppler effect**. When a bat flies toward a target, the echo frequency is higher than the emitted frequency:\n\n' +
        '`f_echo = f_emit x (v_sound + v_bat) / (v_sound - v_bat)`\n\n' +
        'Rhinolophus ferrumequinum compensates by **lowering its emission frequency** so the echo always lands in a narrow "acoustic fovea" — a ~200 Hz band around 83 kHz where **30% of cochlear hair cells** are concentrated. This is neurally analogous to smooth-pursuit eye movements — the bat "locks on" to the echo frequency.\n\n' +
        '**Prey counter-measures and co-evolution:**\n\n' +
        '| Defence | Used by | Mechanism |\n' +
        '|---------|---------|----------|\n' +
        '| Ultrasonic ears | Tiger moths, some mantids | Hear bat calls → evasive dive |\n' +
        '| Jamming clicks | Tiger moth (Bertholdia) | Emit ultrasonic clicks that confuse bat sonar |\n' +
        '| Sound-absorbing scales | Some moth species | Wing scales absorb ultrasound → reduced echo |\n' +
        '| Erratic flight | Many moths | Unpredictable loops when bat calls detected |\n\n' +
        '**Bio-inspired technology:**\n\n' +
        'Echolocation research has directly inspired:\n' +
        '- **Ultrasonic canes** for visually impaired people (emit 40 kHz pulses, vibrate when objects are near)\n' +
        '- **Robotic bat navigation** using biomimetic sonar arrays\n' +
        '- **Medical ultrasound** imaging uses the same pulse-echo principle at 2–18 MHz\n' +
        '- **Acoustic monitoring** of dolphins in the Brahmaputra — hydrophone arrays detect echolocation clicks to survey populations without visual contact',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Sound travels faster in water than in air, which is why dolphin echolocation has longer range.', answer: true, explanation: 'Sound travels at ~1,480 m/s in water vs ~343 m/s in air. Faster propagation + less attenuation = longer effective range.' },
            { text: 'Gangetic river dolphins are blind because they evolved in dark caves.', answer: false, explanation: 'They evolved in silt-heavy rivers where vision is useless anyway. Their tiny eyes can still detect light/dark — they\'re not cave animals.' },
            { text: 'A bat increases its pulse rate to 200 pulses/second just before catching prey.', answer: true, explanation: 'This "terminal buzz" gives much finer time resolution, like switching from a wide-angle to a zoom lens right before the catch.' },
            { text: 'Dolphins echolocate using their mouths to produce clicks.', answer: false, explanation: 'Dolphins produce clicks using air sacs near their blowhole. The fatty "melon" on their forehead focuses the sound into a beam, and the fat-filled lower jaw receives echoes.' },
          ],
        },
      },
    },

    // ── Section 3: Infrasound — The Secret Language of Elephants ──
    {
      title: 'Infrasound — The Secret Language of Elephants',
      diagram: 'ElephantGroundWaveDiagram',
      beginnerContent:
        'You\'re standing in Kaziranga National Park at dusk. A herd of Asian elephants is feeding quietly 200 metres away. Suddenly, they all stop eating at the same instant, raise their heads, and begin walking east — in unison. No trumpet, no visible signal. What happened?\n\n' +
        'They\'re talking — but in a language you literally **cannot hear**. Elephants communicate using **infrasound**: sounds with frequencies below 20 Hz, beneath the lower limit of human hearing. These rumbles are so deep they travel through the ground as vibrations, covering distances of up to **10 kilometres**.\n\n' +
        '**Analogy:** Imagine a bass speaker at a concert. You don\'t just hear the bass — you feel it in your chest. Elephant infrasound is like a bass note turned down so low that only the "feel" remains. Elephants listen with their feet.\n\n' +
        '| Elephant call type | What it means | Frequency |\n' +
        '|-------------------|--------------|----------|\n' +
        '| Contact rumble | "Where are you?" / "I\'m here" | 14–24 Hz |\n' +
        '| "Let\'s go" rumble | Initiates group movement | ~18 Hz |\n' +
        '| Mating rumble (female) | Signals estrus to distant bulls | ~14 Hz |\n' +
        '| Distress call | "Help! Danger!" | 20–35 Hz |\n' +
        '| Greeting rumble | Reunion after separation | 18–25 Hz |\n\n' +
        '**How they listen:** Elephants detect ground vibrations through their feet, which contain special sensory cells called **Pacinian corpuscles** — the same kind of pressure sensors in your fingertips, but packed densely into the elephant\'s foot pad. When listening, elephants freeze, lean forward, and press their feet harder into the ground — they are literally putting their ear to the floor.\n\n' +
        '| Sound type | Frequency | How far it travels | Why |\n' +
        '|-----------|-----------|-------------------|-----|\n' +
        '| Human whisper | 200–4,000 Hz | ~2 m | High frequency = absorbed quickly |\n' +
        '| Human shout | 100–3,000 Hz | ~100 m | More energy, still absorbed |\n' +
        '| Elephant rumble | 14–35 Hz | Up to 10 km | Low frequency = very little absorption |\n' +
        '| Whale song | 10–30 Hz | 100s of km in ocean | Water conducts sound even better |\n\n' +
        'Kaziranga\'s elephant herds use infrasound to coordinate movements across the park\'s tall grasslands, where visual contact is impossible. During floods — when the Brahmaputra inundates the park — infrasound helps scattered herds regroup on higher ground at the Karbi Anglong hills.',
      intermediateContent:
        '**Why infrasound travels so far:**\n\n' +
        'Sound attenuation in air depends heavily on frequency. Low frequencies lose almost no energy:\n\n' +
        '| Frequency | Attenuation (dB/km in air) | Distance for 60 dB loss |\n' +
        '|-----------|---------------------------|------------------------|\n' +
        '| 20 Hz | ~0.01 | 6,000 km (theoretical!) |\n' +
        '| 100 Hz | ~0.05 | 1,200 km |\n' +
        '| 1,000 Hz | ~1.0 | 60 km |\n' +
        '| 10,000 Hz | ~10 | 6 km |\n' +
        '| 100,000 Hz (bat call) | ~300 | 200 m |\n\n' +
        'In practice, elephant calls reach ~10 km because of ground attenuation and geometric spreading, not the theoretical air limit.\n\n' +
        '**The dual pathway — air + ground:**\n\n' +
        'Elephant infrasound propagates through two channels simultaneously:\n\n' +
        '| Pathway | Medium | Speed | Detection method |\n' +
        '|---------|--------|-------|------------------|\n' +
        '| Airborne sound | Air | ~343 m/s | Ears (pinnae funnel sound) |\n' +
        '| Rayleigh surface wave | Ground | ~250 m/s | Feet (Pacinian corpuscles, ~30/cm2) |\n\n' +
        'Because the two waves travel at different speeds, an elephant can estimate **distance** from the time delay between hearing the sound in its ears and feeling it in its feet.\n\n' +
        '**Worked example — estimating distance:**\n\n' +
        'An elephant hears a contact rumble in its ears and feels the ground vibration 1.2 seconds later. Air speed = 343 m/s, ground speed = 250 m/s.\n\n' +
        'Let d = distance. Time via air = d/343. Time via ground = d/250.\n\n' +
        '`d/250 - d/343 = 1.2`\n' +
        '`d(1/250 - 1/343) = 1.2`\n' +
        '`d(0.004 - 0.00292) = 1.2`\n' +
        '`d x 0.00108 = 1.2`\n' +
        '`d = 1,111 m` (about 1.1 km away)\n\n' +
        '**Call types decoded by spectrographic analysis:**\n\n' +
        'Researchers have identified at least **30 distinct call types** through spectrograms:\n\n' +
        '| Call | SPL at 1 m (dB) | Duration (s) | Context |\n' +
        '|------|----------------|-------------|--------|\n' +
        '| Contact rumble | 90–103 | 4–8 | Separated individuals seeking group |\n' +
        '| Estrous call | 95–117 | 3–5 | Female in heat, attracts bulls from 4+ km |\n' +
        '| "Let\'s go" rumble | 85–95 | 2–4 | Matriarch initiates movement |\n' +
        '| Musth rumble (male) | 100–112 | 5–10 | Male in musth advertising dominance |',
      advancedContent:
        '**Rayleigh wave physics:**\n\n' +
        'Elephant-generated ground vibrations propagate as **Rayleigh surface waves** — retrograde elliptical particle motion confined to the substrate surface. The displacement amplitude decays as 1/sqrt(r) (geometric spreading for surface waves) rather than 1/r (body waves), giving them longer range.\n\n' +
        'O\'Connell-Rodwell et al. (2000, 2006) demonstrated that elephants can discriminate between alarm calls from **familiar vs unfamiliar herds** transmitted through the ground alone — proving that seismic signals carry identity information, not just alerting signals.\n\n' +
        '| Wave parameter | Value | Significance |\n' +
        '|---------------|-------|-------------|\n' +
        '| Frequency range | 10–40 Hz | Matches Pacinian corpuscle tuning |\n' +
        '| Ground displacement | ~10 nm at 2 km | Detectable by mechanoreceptors |\n' +
        '| Propagation speed | ~250 m/s | Slower than airborne, allowing time-of-arrival estimation |\n' +
        '| Wavelength at 20 Hz | 12.5 m | Foot separation (1.5 m) gives ~43 degree phase difference |\n\n' +
        '**Directional localization:**\n\n' +
        'With a foot separation of ~1.5 m and a wavelength of ~12.5 m (250 m/s / 20 Hz), the maximum interaural (inter-pedal) phase difference is ~43 degrees. This is sufficient for coarse directional localization — the elephant can tell which direction the call came from by comparing the phase of vibrations at its two front feet. Neural processing likely uses **temporal coding** of phase relationships.\n\n' +
        '**Conservation applications:**\n\n' +
        '| Technology | How it works | Application in Assam |\n' +
        '|-----------|-------------|---------------------|\n' +
        '| Infrasonic microphone arrays | Triangulate elephant positions from rumbles | Track herds in Kaziranga without GPS collars |\n' +
        '| ML classifiers on acoustic data | Distinguish call types automatically | Detect distress calls = potential poaching |\n' +
        '| Seismic geophones | Record ground vibrations from footfalls | Census elephants in dense grassland |\n' +
        '| Early-warning systems | Detect approaching herds via infrasound | Reduce human-elephant conflict near tea gardens |',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each elephant call to what it communicates',
          pairs: [
            ['Contact rumble (14–24 Hz)', '"Where are you?" — maintaining group cohesion across kilometres'],
            ['"Let\'s go" rumble (~18 Hz)', 'Matriarch signals the herd to start moving in a direction'],
            ['Estrous call (~14 Hz)', 'Female advertises mating readiness to bulls up to 4 km away'],
            ['Musth rumble (100–112 dB)', 'Male in musth broadcasts dominance and reproductive fitness'],
          ],
        },
      },
    },

    // ── Section 4: Whiskers, Fur, and Touch ──────────────────────
    {
      title: 'Whiskers, Fur, and Touch',
      diagram: 'WhiskerSensorDiagram',
      beginnerContent:
        'Look at a cat or a tiger and you\'ll notice long, stiff hairs on either side of the muzzle. These are **vibrissae** — whiskers — and they are not decorative. They are among the most sensitive touch organs in the animal kingdom.\n\n' +
        'A tiger\'s whiskers are rooted deep in the skin, each connected to **hundreds of nerve endings**. They can detect the slightest brush of air, the vibration of nearby movement, and the width of a gap. In fact, a tiger\'s whiskers are roughly as wide as its body — they work as a **built-in measuring tape**. If a tiger can fit its whiskers through an opening, it knows its body will follow.\n\n' +
        '**Analogy:** Imagine walking through your house at night with your arms stretched out — you\'d feel doorframes, walls, furniture. Whiskers do the same thing, but with much finer sensitivity, detecting air currents and vibrations you\'d never feel.\n\n' +
        '| Animal | Whisker speciality | What it can do |\n' +
        '|--------|-------------------|---------------|\n' +
        '| Tiger | Gap-width measurement | Judge if it can fit through a space in the dark |\n' +
        '| Seal | Hydrodynamic trail detection | Follow a fish trail minutes old, underwater |\n' +
        '| Rat | Tactile scanning (whisking) | Build a 3D map of surroundings at 12 sweeps/second |\n' +
        '| Cat | Air current detection | Sense prey movement nearby without seeing |\n' +
        '| Manatee | Full-body vibrissae | Entire body covered in whiskers — senses water currents |\n' +
        '| Walrus | Seafloor foraging | 400–700 whiskers detect shellfish buried in sand |\n\n' +
        'The Royal Bengal tigers of Kaziranga hunt in tall elephant grass that can be 5 metres high — taller than the tiger. In this dense undergrowth, vision is limited. Whiskers become critical sensors, helping the tiger navigate silently and detect the movements of prey like deer and wild buffalo through air disturbances.\n\n' +
        '| Whisker fact | Number |\n' +
        '|-------------|--------|\n' +
        '| Nerve endings per whisker (cat) | ~100–200 |\n' +
        '| Whisker sweeps per second (rat) | 5–12 |\n' +
        '| Smallest detectable deflection | ~0.02 degrees |\n' +
        '| Trail detection delay (seal) | 30+ seconds after fish passed |\n' +
        '| Number of whiskers on a walrus | 400–700 |\n\n' +
        '**Check yourself:** Why would cutting a cat\'s whiskers (never do this!) be like blindfolding a person? What information would the cat lose?',
      intermediateContent:
        '**The follicle-sinus complex:**\n\n' +
        'Each vibrissa sits in a specialised structure far more complex than a regular hair follicle:\n\n' +
        '| Component | Function |\n' +
        '|-----------|----------|\n' +
        '| **Blood sinus** | Fluid-filled capsule that amplifies mechanical deflection |\n' +
        '| **Merkel cells** | Detect sustained touch (slowly adapting) |\n' +
        '| **Lanceolate endings** | Detect vibration and rapid changes (rapidly adapting) |\n' +
        '| **~200 myelinated nerve fibres** | Fast signal transmission to the brain |\n' +
        '| **Intrinsic muscles** (rats) | Allow active whisking — sweeping whiskers back and forth |\n\n' +
        'Angular sensitivity: **~0.02 degrees** of deflection — comparable to human fingertip sensitivity but achieved with a single hair.\n\n' +
        '**Rat whisking — active sensing:**\n\n' +
        'Rats don\'t passively wait for things to touch their whiskers — they actively scan their environment:\n\n' +
        '| Phase | Muscle action | Duration | What happens |\n' +
        '|-------|-------------|----------|-------------|\n' +
        '| Protraction (forward sweep) | Intrinsic muscles contract | ~50 ms | Whiskers sweep forward to contact objects |\n' +
        '| Contact | — | ~10 ms | Whisker bends, nerve fires |\n' +
        '| Retraction (backward sweep) | Extrinsic muscles contract | ~40 ms | Whiskers return to resting position |\n' +
        '| Full cycle | Both | ~83–200 ms | 5–12 complete sweeps per second |\n\n' +
        '**The barrel cortex — one whisker, one barrel:**\n\n' +
        'Each whisker has its own dedicated column of ~4,000 neurons in the somatosensory cortex, called a **barrel**. The barrels are arranged in the same pattern as the whiskers on the face — a topographic map. Touch one whisker and the corresponding barrel lights up within 7–10 ms.\n\n' +
        '| Whisker grid | Barrels in cortex | Mapping |\n' +
        '|-------------|------------------|--------|\n' +
        '| Row A (5 whiskers) | 5 barrels in row A | 1:1 correspondence |\n' +
        '| Row B (5 whiskers) | 5 barrels in row B | Preserved spatial layout |\n' +
        '| Row C (5 whiskers) | 5 barrels in row C | Each barrel ~300 μm diameter |\n\n' +
        '**Seal whiskers — reading water trails:**\n\n' +
        'Harbor seals can track a fish\'s hydrodynamic trail **30+ seconds** after the fish swam past. Their secret: the whiskers have an **undulating (wavy) surface profile** that suppresses self-generated vibration during swimming, leaving only the signal from the fish trail. This is analogous to noise-cancelling headphones — the shape cancels the seal\'s own "noise."',
      advancedContent:
        '**The barrel cortex as a model system:**\n\n' +
        'The rat barrel cortex (SI, layer IV) is one of neuroscience\'s best-studied sensory circuits. Each barrel contains ~4,000 neurons receiving thalamocortical input from the whisker\'s representation in the VPM thalamus.\n\n' +
        '| Layer | Neuron count/barrel | Function |\n' +
        '|-------|-------------------|----------|\n' +
        '| Layer IV (barrels) | ~4,000 | Primary input from thalamus |\n' +
        '| Layer II/III | ~3,000 | Cross-barrel integration |\n' +
        '| Layer V | ~2,500 | Output to motor cortex, brainstem |\n' +
        '| Layer VI | ~2,000 | Feedback to thalamus |\n\n' +
        '**Texture discrimination via resonance:**\n\n' +
        'Active sensing research shows rats make perceptual decisions within 1–2 whisking cycles (~100 ms). Different textures induce different **frequency patterns** in whiskers of different lengths — short whiskers resonate at higher frequencies, long whiskers at lower. The array functions like a set of **tuned mechanical resonators**, similar to the cochlea\'s frequency-to-place mapping.\n\n' +
        'The mathematical model uses **Euler-Bernoulli beam theory**:\n\n' +
        '`EI(d4y/dx4) = -mu(d2y/dt2)`\n\n' +
        'where E = Young\'s modulus, I = area moment of inertia, mu = linear mass density. The natural frequency of a tapered conical whisker (length L, base radius r) is:\n\n' +
        '`f_n ~ (lambda_n^2 / (2pi L^2)) x sqrt(EI / mu)`\n\n' +
        '**Biomimetic whisker sensors:**\n\n' +
        '| Technology | Inspired by | Performance |\n' +
        '|-----------|------------|------------|\n' +
        '| Artificial vibrissae arrays | Rat barrel cortex mapping | ~90% texture discrimination accuracy |\n' +
        '| Undulating sensor rods | Seal whisker surface profile | Noise rejection in turbulent flow |\n' +
        '| MEMS whisker chips | Insect mechanoreceptors | 0.1 degree deflection sensitivity |\n' +
        '| Robot navigation whiskers | Cat gap-sensing | Autonomous obstacle avoidance in darkness |',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'A tiger\'s whiskers are roughly as wide as its body — if the whiskers fit through a gap in the Kaziranga grasslands, the tiger knows its whole body will follow.',
            'Harbor seals can detect the hydrodynamic trail of a fish that swam past 30+ seconds ago. The wavy surface of their whiskers cancels self-noise like biological noise-cancelling headphones.',
            'Rats whisk their whiskers back and forth up to 12 times per second to build a 3D tactile map — each whisker has its own dedicated column of 4,000 neurons in the brain.',
            'A walrus has 400–700 whiskers on its muzzle and uses them to find shellfish buried in the seafloor sand, like fingers feeling for coins in a pocket.',
          ],
        },
      },
    },

    // ── Section 5: Night Vision and UV Vision ────────────────────
    {
      title: 'Night Vision and UV Vision',
      diagram: 'EyeAnatomyDiagram',
      beginnerContent:
        'Step outside in Kaziranga after sunset. You can barely see your hand in front of your face. But the jungle is alive with hunters who see perfectly: **owls** swooping on rodents, **leopards** stalking through bamboo, **fishing cats** at Deepor Beel watching for fish ripples. How?\n\n' +
        'The answer lies in their eyes. Owl eyes are not spherical like ours — they are **tubular**, shaped like telescopes, collecting far more light. Their retinas are packed with **rod cells** (light sensors for dim conditions) and have few **cone cells** (color sensors). The result: owls can see in light **100 times dimmer** than what humans need.\n\n' +
        '**Analogy:** Imagine a bucket catching rain versus a cup. The owl\'s wide tubular eye is the bucket — it catches more photons (light particles). Human eyes are the cup.\n\n' +
        '| Eye feature | Human | Owl | Advantage |\n' +
        '|------------|-------|-----|----------|\n' +
        '| Eye shape | Spherical | Tubular (telescope) | Collects more light |\n' +
        '| Pupil opening | ~8 mm max | ~15 mm max | Lets in ~3.5x more light |\n' +
        '| Rod density | ~150,000/mm2 | ~1,000,000/mm2 | 6.7x more light detectors |\n' +
        '| Cone density | High (color vision) | Very low | Sacrifices color for sensitivity |\n' +
        '| Can rotate eyes? | Yes, ~160 degree range | No — eyes fixed in skull | Why they rotate their heads |\n' +
        '| Head rotation | ~90 degrees | Up to **270 degrees** | Compensates for fixed eyes |\n\n' +
        'Because owl eyes are fixed in their sockets (too large to rotate), owls evolved the ability to swivel their heads up to **270 degrees** — three-quarters of a full circle. They have 14 neck vertebrae (humans have 7) and special blood vessel arrangements that prevent stroke during rotation.\n\n' +
        '**UV vision — the hidden world of flowers:**\n\n' +
        'On the other end of the spectrum, bees and many birds see **ultraviolet light** (below 380 nm, invisible to us). Flowers that look plain white to us often have vivid UV patterns — "landing strips" that guide bees straight to the nectar.\n\n' +
        '| What we see | What a bee sees | UV pattern purpose |\n' +
        '|------------|----------------|-------------------|\n' +
        '| Plain white flower | Dark centre with bright UV ring | "Bullseye" → nectar is here |\n' +
        '| Yellow sunflower | Dark UV streaks on petals | "Landing strips" → follow the lines |\n' +
        '| Red poppy | UV-dark (invisible to bee) | Bees can\'t see red — they use UV instead |\n\n' +
        'Assam\'s tea gardens attract countless bee species. When tea flowers bloom, the UV nectar guides that bees follow are invisible to the tea pluckers standing right next to them — two entirely different visual worlds sharing the same garden.',
      intermediateContent:
        '**The physics of rod cell sensitivity:**\n\n' +
        'A single rod cell can respond to a **single photon** of light — this is the theoretical detection limit.\n\n' +
        'The cascade works like this:\n\n' +
        '| Step | What happens | Amplification |\n' +
        '|------|-------------|---------------|\n' +
        '| 1. Photon strikes retinal | 11-cis retinal isomerises to all-trans | 1 photon → 1 activated rhodopsin |\n' +
        '| 2. Rhodopsin activates transducin | G-protein cascade begins | 1 rhodopsin → ~500 transducin |\n' +
        '| 3. Transducin activates PDE | Phosphodiesterase enzyme activated | ~500 PDE molecules |\n' +
        '| 4. PDE breaks down cGMP | Cyclic nucleotide hydrolysis | ~500,000 cGMP destroyed |\n' +
        '| 5. Na+ channels close | Membrane hyperpolarises | Signal sent to brain |\n\n' +
        'Total amplification: **~100,000x**. One photon → 100,000 molecular events → detectable signal.\n\n' +
        '**Dark adaptation:**\n\n' +
        'When you walk from bright sunlight into a dark room, you\'re initially blind. Over ~30 minutes, your rods regenerate rhodopsin and sensitivity increases 10,000-fold:\n\n' +
        '| Time in dark | Sensitivity gain | What you can see |\n' +
        '|-------------|-----------------|------------------|\n' +
        '| 0 min | 1x (cone vision only) | Almost nothing |\n' +
        '| 5 min | ~10x | Large shapes, doorways |\n' +
        '| 10 min | ~100x | Furniture, faces |\n' +
        '| 20 min | ~5,000x | Stars, dim outlines |\n' +
        '| 30 min | ~10,000x | Full scotopic vision |\n\n' +
        '**UV vision quantified:**\n\n' +
        'Bee UV receptors peak at ~340 nm (human violet cutoff: ~380 nm). Many flowers contain UV-absorbing pigments (flavonoids) concentrated in petal tips.\n\n' +
        '| Organism | Cone/receptor types | Spectral range (nm) | Estimated discriminable colours |\n' +
        '|----------|-------------------|--------------------|---------------------------------|\n' +
        '| Human | 3 (S, M, L) | 380–700 | ~1 million |\n' +
        '| Honeybee | 3 (UV, blue, green) | 300–650 | ~1 million (shifted to UV) |\n' +
        '| Pigeon | 4 + oil droplets | 300–700 | ~10 million |\n' +
        '| Mantis shrimp | 16 | 300–720 | Unknown — may use for signalling, not fine discrimination |',
      advancedContent:
        '**Quantum detection limit of rod cells:**\n\n' +
        'The phototransduction cascade makes the rod a **quantum detector** operating near the **shot noise limit** — the fundamental limit set by the statistical fluctuation of photon arrivals. At threshold, humans can detect a flash of ~5–7 photons absorbed across ~500 rods. The limiting factor is not receptor sensitivity but **dark noise** — random isomerisation of rhodopsin (~0.01 events per rod per minute) that produces false signals.\n\n' +
        '**The sensitivity-acuity trade-off:**\n\n' +
        '| Parameter | Rod pathway (night) | Cone pathway (day) |\n' +
        '|-----------|-------------------|--------------------|\n' +
        '| Convergence ratio | ~1,500 rods → 1 ganglion cell | ~6 cones → 1 ganglion cell |\n' +
        '| Spatial resolution | Low (~3 degrees) | High (~0.02 degrees, fovea) |\n' +
        '| Sensitivity | Single photon detectable | Need ~100 photons |\n' +
        '| Colour information | Monochromatic (one pigment) | Trichromatic (three pigments) |\n\n' +
        'High convergence sums signals for sensitivity but destroys spatial detail. This is why you can detect a faint star in peripheral vision (rod-dominated) but can\'t read a book — and why owls sacrifice color for extreme dim-light sensitivity.\n\n' +
        '**Avian tetrachromacy:**\n\n' +
        'Birds retained a fourth cone type (SWS1, peak ~370 nm) that mammals lost during the **nocturnal bottleneck** — the period when early mammals were small, nocturnal, and lost two of four ancestral cone types. Some birds also have **double cones** containing oil droplets that act as long-pass filters, effectively creating **5-dimensional colour space**.\n\n' +
        '| Cone type | Peak wavelength | Oil droplet |\n' +
        '|-----------|----------------|------------|\n' +
        '| SWS1 (UV) | ~370 nm | Transparent |\n' +
        '| SWS2 (blue) | ~450 nm | Clear/light yellow |\n' +
        '| MWS (green) | ~530 nm | Yellow-orange |\n' +
        '| LWS (red) | ~600 nm | Red |\n' +
        '| Double cone | ~570 nm | Pale | \n\n' +
        'Computational models of avian tetrachromatic colour space suggest birds perceive ~10x more discriminable colours than humans. The peacock\'s iridescent tail — so central to Assamese folklore — may contain visual information in the UV range that is completely invisible to us but critical for peahen mate choice.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Owls can rotate their heads 360 degrees (a full circle).', answer: false, explanation: 'Owls can rotate up to 270 degrees — three-quarters of a circle. Their 14 cervical vertebrae (double ours) and special blood vessels make this possible without stroke.' },
            { text: 'A single rod cell in your eye can detect a single photon of light.', answer: true, explanation: 'The phototransduction cascade amplifies one photon into ~100,000 molecular events. Rods are quantum detectors at the theoretical sensitivity limit.' },
            { text: 'Bees can see red flowers clearly because they have UV vision.', answer: false, explanation: 'Bees cannot see red at all — it\'s outside their spectral range. What bees see is UV patterns on flowers. A red poppy appears UV-dark to a bee.' },
            { text: 'Birds see more colours than humans because they have a fourth type of cone cell.', answer: true, explanation: 'Most birds have 4 cone types including a UV-sensitive one. Mammals lost 2 of 4 ancestral cones during the nocturnal bottleneck — birds kept them.' },
          ],
        },
      },
    },

    // ── Section 6: Migration — Epic Journeys ─────────────────────
    {
      title: 'Migration — Epic Journeys',
      diagram: 'HilsaMigrationDiagram',
      beginnerContent:
        'Every winter, thousands of migratory birds descend on Assam\'s wetlands — Deepor Beel near Guwahati, Pani Dihing in Sibsagar, and the marshes around Kaziranga. Bar-headed geese, pintails, pochards, and dozens of other species arrive after flying **thousands of kilometres** from Central Asia, Mongolia, and even Siberia. How do they find their way?\n\n' +
        'Migration is one of nature\'s greatest feats of navigation. Animals use a toolbox of compasses:\n\n' +
        '| Navigation tool | How it works | Who uses it |\n' +
        '|----------------|-------------|------------|\n' +
        '| **Sun compass** | Track the sun\'s position, adjusted for time of day | Monarch butterflies, birds |\n' +
        '| **Star compass** | Use rotation of stars around the North Star | Night-migrating songbirds |\n' +
        '| **Magnetic compass** | Sense Earth\'s magnetic field inclination | Birds, sea turtles, salmon |\n' +
        '| **Smell** | Detect chemical signature of home waters | Salmon (return to birth stream) |\n' +
        '| **Landmarks** | Follow rivers, coastlines, mountain ranges | Many bird species |\n\n' +
        '**Record-holders:**\n\n' +
        '| Animal | Journey | Distance | Remarkable fact |\n' +
        '|--------|---------|----------|----------------|\n' +
        '| Arctic tern | Arctic ↔ Antarctic | ~70,000 km/year | Longest migration; sees two summers per year |\n' +
        '| Monarch butterfly | Canada → Mexico | ~4,500 km | Takes 4 generations to complete round trip |\n' +
        '| Bar-headed goose | Mongolia → India | ~5,000 km | Flies over the Himalayas at 9,000 m altitude |\n' +
        '| Salmon | Ocean → birth stream | 100s–1,000s km | Navigates by smell to the exact stream |\n' +
        '| Hilsa fish | Bay of Bengal → Brahmaputra | ~300 km upstream | Assam\'s beloved fish, migrates to spawn |\n' +
        '| Amur falcon | Siberia → Southern Africa | ~22,000 km | Stops in Nagaland — massive congregations |\n\n' +
        '' +
        '- **Deepor Beel** (Guwahati): Ramsar wetland site hosting thousands of winter migrants from Central Asia\n' +
        '- **Amur falcons** in Nagaland: Millions roost in Pangti village before crossing the Indian Ocean in one non-stop flight\n' +
        '- **Hilsa** (ilish) migration up the Brahmaputra is the basis of Assam\'s most prized cuisine and a major fisheries economy\n\n' +
        '**Check yourself:** Why do birds migrate south for winter instead of just staying put? Think about food availability, not just temperature.',
      intermediateContent:
        '**Multiple compass systems — redundancy and calibration:**\n\n' +
        'Migratory birds don\'t rely on a single compass — they cross-calibrate multiple systems:\n\n' +
        '| Compass | Stimulus | Calibration | Limitations |\n' +
        '|---------|---------|-------------|------------|\n' +
        '| Sun | Sun position + internal clock (~15 degree/hr) | Clock reset by dawn/dusk cycle | Useless on overcast days |\n' +
        '| Star | Rotation of stars around celestial pole | Learned during first summer by watching star rotation | Useless during daytime |\n' +
        '| Magnetic | Inclination angle of Earth\'s field lines | Calibrated against sun/star compass at dusk | Disrupted near magnetic anomalies |\n' +
        '| Polarised light | Polarisation pattern of sky at sunset | Innate | Only visible near horizon at dusk |\n\n' +
        '**Worked example — bar-headed goose altitude physiology:**\n\n' +
        'Bar-headed geese cross the Himalayas at **9,000 m** altitude. At sea level, O2 partial pressure is 21 kPa. At 9,000 m, air density is ~30% of sea level.\n\n' +
        '`PO2 at 9,000 m = 21 x 0.30 = 6.3 kPa`\n\n' +
        'That\'s less than a third of the oxygen available at sea level — equivalent to breathing through a thin straw. How do they survive?\n\n' +
        '| Adaptation | Mechanism | Effect |\n' +
        '|-----------|-----------|-------|\n' +
        '| Modified haemoglobin | Pro→Ala substitution at position 119alpha | Higher O2 affinity (P50 ~35 mmHg vs ~50 mmHg in lowland geese) |\n' +
        '| Larger lungs | More gas exchange surface | 15% more O2 per breath |\n' +
        '| More capillaries in flight muscles | Denser vascularisation | O2 reaches muscle fibres faster |\n' +
        '| Counter-current heat exchange | Warm blood heats cold incoming air | Prevents lung damage from -30 degree C air |\n\n' +
        '**Salmon olfactory navigation:**\n\n' +
        'Salmon imprint on their natal stream\'s chemical signature during the parr-smolt transformation. Years later, they can detect their home stream among millions of litres of water.\n\n' +
        '| Stage | What happens | Hormones involved |\n' +
        '|-------|-------------|------------------|\n' +
        '| Parr (juvenile in stream) | Normal freshwater fish | — |\n' +
        '| Smolt (transformation) | Physiological changes for salt water; olfactory imprinting | Thyroxine (T4) + cortisol open critical period |\n' +
        '| Ocean phase (1–5 years) | Feeds and grows in open ocean | — |\n' +
        '| Upstream migration | Follows amino acid gradients to birth stream | Gonadotropins drive spawning urge |',
      advancedContent:
        '**Molecular basis of the monarch butterfly compass:**\n\n' +
        'The monarch\'s **time-compensated sun compass** is encoded in circadian clock proteins in the antennae:\n\n' +
        '| Protein | Location | Function |\n' +
        '|---------|---------|----------|\n' +
        '| CRY1 (cryptochrome 1) | Antennae | Light-sensitive flavoprotein; entrains circadian clock |\n' +
        '| PER/TIM | Antennae | Core clock proteins; generate ~24-hour oscillation |\n' +
        '| CRY2 (cryptochrome 2) | Brain (central complex) | Magnetoreceptor (radical pair mechanism) |\n\n' +
        'Surgical removal of antennae abolishes compass orientation. Transplanting antennae with a **phase-shifted clock** (6 hours advanced) redirects the butterfly by ~90 degrees — proving the antennae contain the clock used for sun compensation.\n\n' +
        '**Energy budget of the Arctic tern:**\n\n' +
        'Satellite tracking reveals Arctic terns exploit global wind patterns, following a **figure-8 route** that adds distance but reduces energy expenditure.\n\n' +
        '| Parameter | Value |\n' +
        '|-----------|-------|\n' +
        '| Total annual distance | ~70,000 km |\n' +
        '| Average daily distance | ~520 km |\n' +
        '| Daily energy expenditure | ~60 kJ |\n' +
        '| Fat burned per day | ~7 g |\n' +
        '| Body mass | ~100 g |\n' +
        '| Lifespan | ~30 years |\n' +
        '| Lifetime distance | ~2.1 million km (>3 round trips to the Moon) |\n\n' +
        '**Salmon olfactory specificity:**\n\n' +
        'Olfactory imprinting occurs when surges of thyroxine (T4) and cortisol open a critical period. Dissolved amino acids unique to the natal stream are imprinted onto olfactory receptor neurons expressing specific **V2R receptors**. Upstream-migrating adults match waterborne amino acid profiles against this template with astonishing specificity.\n\n' +
        '| Amino acid | Concentration in stream (nM) | Salmon detection threshold (nM) | Can detect? |\n' +
        '|-----------|---------------------------|-------------------------------|------------|\n' +
        '| L-alanine | 50–500 | ~10 | Yes |\n' +
        '| L-serine | 20–200 | ~5 | Yes |\n' +
        '| L-proline | 5–50 | ~1 | Yes |\n' +
        '| Taurine | 1–10 | ~0.5 | Yes (borderline at low end) |\n\n' +
        'Each stream has a unique ratio of these amino acids — a chemical fingerprint as distinctive as a human face. The salmon\'s brain compares the current ratio to the imprinted template and swims toward the best match.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each migrating animal to its navigation method',
          pairs: [
            ['Arctic tern', 'Figure-8 route exploiting global winds — 70,000 km/year, 2.1 million km in a lifetime'],
            ['Monarch butterfly', 'Time-compensated sun compass in antennae — clock proteins adjust for sun movement'],
            ['Salmon', 'Olfactory imprinting — matches amino acid fingerprint of birth stream from ocean'],
            ['Bar-headed goose', 'Modified haemoglobin flies it over the Himalayas at 9,000 m on 30% oxygen'],
            ['Amur falcon', 'Non-stop Indian Ocean crossing from Nagaland staging ground — 4,000 km over water'],
          ],
        },
      },
    },

    // ── Section 7: Camouflage and Mimicry ────────────────────────
    {
      title: 'Camouflage and Mimicry',
      diagram: 'PandaCamouflageDiagram',
      beginnerContent:
        'In the forests of NE India, a **clouded leopard** lies perfectly still on a dappled branch. Its coat — a mosaic of dark clouds on tawny fur — breaks up its outline so completely that a deer walking below looks straight at it and sees... nothing. Just another pattern of light and shadow. This is **camouflage** — evolution\'s invisibility cloak.\n\n' +
        '**Analogy:** Camouflage works like a "Where\'s Wally?" puzzle. Wally hides by matching the busy background. Animals do the same — their patterns, colours, and textures match their surroundings so predators (or prey) can\'t pick them out.\n\n' +
        '| Camouflage strategy | How it works | Example |\n' +
        '|--------------------|-------------|------------------|\n' +
        '| **Colour matching** | Body colour matches background | Green pit viper on a leaf |\n' +
        '| **Disruptive patterns** | Bold patches break up body outline | Clouded leopard\'s "cloud" markings |\n' +
        '| **Countershading** | Dark on top, light below — cancels shadow | Gangetic dolphin (grey above, pink-white below) |\n' +
        '| **Mimesis** (looking like an object) | Body shape resembles a leaf, twig, or stone | Dead-leaf butterfly (Kallima inachus) |\n' +
        '| **Active colour change** | Change colour in real time | Chameleon (not native to Assam, but famous) |\n\n' +
        '**Mimicry** is related but different — here an animal copies the appearance of a *different species*:\n\n' +
        '| Mimicry type | Strategy | Example |\n' +
        '|-------------|---------|--------|\n' +
        '| **Batesian** | Harmless species copies a dangerous one | Hoverfly mimics wasp stripes |\n' +
        '| **Mullerian** | Two dangerous species share warning colours | Multiple toxic coral snake species share red-black bands |\n' +
        '| **Aggressive** | Predator mimics something harmless | Zone-tailed hawk mimics vulture silhouette — prey ignores it |\n\n' +
        '**NE India wildlife:**\n' +
        '- The **dead-leaf butterfly** (Kallima inachus) of Assam\'s forests is a perfect leaf mimic — underside looks exactly like a dry brown leaf, complete with fake "veins" and "fungal spots"\n' +
        '- **Golden langurs** of western Assam have golden fur that blends with dry-season foliage\n' +
        '- The **king cobra** of Kaziranga has a hood pattern that makes it look larger and more threatening\n\n' +
        '**Check yourself:** A clouded leopard has spots, a tiger has stripes. Both are camouflage — but why different patterns? Hint: think about where each animal hunts (dappled tree canopy vs tall grass).',
      intermediateContent:
        '**How chameleons change colour — photonic crystals, not pigment:**\n\n' +
        'Chameleons don\'t redistribute pigments like cuttlefish. Instead, they tune **photonic nanocrystals**:\n\n' +
        '| Layer | Cell type | What it does |\n' +
        '|-------|----------|-------------|\n' +
        '| Outer | Xanthophores / erythrophores | Yellow/red pigments (chemical colour) |\n' +
        '| Middle | Iridophores (S-type) | Guanine nanocrystals in a lattice — structural colour |\n' +
        '| Deep | Iridophores (D-type) | Reflect infrared — thermoregulation |\n' +
        '| Deepest | Melanophores | Dark melanin — darkens or lightens overall |\n\n' +
        'By tensing or relaxing skin, the spacing between guanine nanocrystals changes:\n\n' +
        '| Crystal spacing | Reflected wavelength | Colour seen |\n' +
        '|----------------|---------------------|------------|\n' +
        '| ~140 nm (relaxed) | ~450 nm | Blue |\n' +
        '| ~170 nm | ~520 nm | Green |\n' +
        '| ~200 nm | ~580 nm | Yellow |\n' +
        '| ~300+ nm (stretched) | ~650+ nm | Red/orange |\n\n' +
        'This is **structural colour** — the same physics as butterfly wings, opals, and soap bubbles. The colour comes from interference of light waves, not from any pigment molecule.\n\n' +
        '**Cuttlefish — the ultimate camouflage artist:**\n\n' +
        'Despite being **colourblind** (only one type of photoreceptor), cuttlefish achieve perfect colour and pattern matching in <1 second. They control ~200,000 chromatophores independently using direct neural connections (no hormonal delay).\n\n' +
        '| Background type | Cuttlefish response | Pattern category |\n' +
        '|----------------|--------------------|-----------------|\n' +
        '| Uniform sand | Uniform pale | Category 1: uniform |\n' +
        '| Small pebbles | Mottled patches | Category 2: mottle |\n' +
        '| Large rocks/coral | Bold contrasting shapes | Category 3: disruptive |\n\n' +
        '**Batesian mimicry — frequency dependence:**\n\n' +
        'Batesian mimicry only works while mimics remain **rare** relative to the dangerous model. If hoverflies (harmless) outnumbered wasps (stinging), predators would learn that yellow-and-black = safe to eat.\n\n' +
        '| Mimic:model ratio | Predator learns | Mimicry effectiveness |\n' +
        '|-------------------|----------------|---------------------|\n' +
        '| 1:10 (mimics rare) | "Yellow-black = pain" | High — mimics well-protected |\n' +
        '| 1:1 (equal) | "50/50 — sometimes hurts" | Moderate |\n' +
        '| 10:1 (mimics common) | "Yellow-black = usually safe" | Low — predators attack freely |',
      advancedContent:
        '**Signal detection theory in predator decision-making:**\n\n' +
        'Whether a predator attacks depends on an internal threshold separating "palatable" from "unpalatable" categories. This is formally modelled using **signal detection theory (SDT)**:\n\n' +
        '| SDT outcome | Predator decision | Prey identity | Result |\n' +
        '|------------|------------------|--------------|--------|\n' +
        '| Hit | Attack | Palatable | Predator gets meal |\n' +
        '| Miss | Don\'t attack | Palatable | Missed meal |\n' +
        '| False alarm | Attack | Toxic/mimicry | Predator gets stung/poisoned |\n' +
        '| Correct rejection | Don\'t attack | Toxic | Predator avoids harm |\n\n' +
        'The predator\'s optimal threshold depends on the cost of a false alarm (getting stung) vs the cost of a miss (going hungry). Mullerian mimicry works via **number-dependent selection** (more shared-pattern individuals = faster predator learning), while Batesian mimicry works via **frequency-dependent selection** (mimics must stay rare).\n\n' +
        '**Cuttlefish computational mystery:**\n\n' +
        'With only one photoreceptor type (no colour vision), cuttlefish classify backgrounds using **luminance contrast** and **spatial frequency** via a decision tree in the optic lobe. The neural circuit from optic lobe → lateral basal lobes → chromatophore motor neurons executes in ~300 ms for a full-body pattern change — suggesting pre-computed motor programs rather than pixel-by-pixel real-time matching.\n\n' +
        'Recent research (Reiter et al., 2018) suggests cuttlefish may achieve colour matching through **chromatic aberration** in their single-pigment eye: by adjusting pupil shape (W-shaped), they create wavelength-dependent blur that provides coarse spectral information — similar to how a pinhole camera with a dispersive element can extract colour from a monochrome sensor.\n\n' +
        '**Structural colour physics:**\n\n' +
        'The iridescent feathers of NE India\'s peacocks (and many kingfisher species in Assam) use thin-film interference:\n\n' +
        '`Constructive interference: 2nd cos(theta) = m x lambda`\n\n' +
        'where d = film thickness, theta = angle of refraction, m = integer, lambda = wavelength. This predicts that colour shifts with viewing angle — which is why peacock feathers shimmer as the bird moves, creating a dynamic display that may carry information in dimensions invisible to us.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each camouflage or mimicry strategy to its example',
          pairs: [
            ['Disruptive colouration', 'Clouded leopard — bold "cloud" patches break up body outline on dappled branches'],
            ['Mimesis (object mimicry)', 'Dead-leaf butterfly (Kallima) — underside replicates a dry leaf with fake veins'],
            ['Batesian mimicry', 'Harmless hoverfly copies yellow-black wasp stripes to deter predators'],
            ['Structural colour change', 'Chameleon tunes guanine nanocrystal spacing — physics, not pigment'],
            ['Mullerian mimicry', 'Multiple toxic coral snakes share red-black warning bands — shared learning cost'],
          ],
        },
      },
    },

    // ── Section 8: Animal Communication ──────────────────────────
    {
      title: 'Animal Communication',
      diagram: 'FrogVocalSacDiagram',
      beginnerContent:
        'Animals don\'t have language the way humans do, but they communicate constantly — through sound, scent, light, colour, touch, and even electricity. The variety and sophistication of animal communication systems is staggering.\n\n' +
        '**Analogy:** Think of communication as sending a message. Humans mainly use words. But imagine if you could glow in the dark, release a chemical cloud, vibrate the floor, or flash ultraviolet patterns — those are all "languages" animals use.\n\n' +
        '| Communication channel | Signal type | Example from NE India |\n' +
        '|----------------------|-----------|----------------------|\n' +
        '| **Sound** | Calls, songs, clicks | Hoolock gibbon dawn chorus in Assam\'s rainforests |\n' +
        '| **Chemical** | Pheromones, scent marks | Tiger scent-marking trees along Kaziranga corridors |\n' +
        '| **Visual** | Colour displays, postures | Peacock tail spread — iridescent eyespots |\n' +
        '| **Tactile** | Grooming, vibration | Elephant trunk touching (greeting ritual) |\n' +
        '| **Seismic** | Ground vibrations | Elephant infrasound through the forest floor |\n' +
        '| **Bioluminescent** | Light production | Fireflies in Assam\'s wetlands — flash patterns for mating |\n\n' +
        '**Frog calls — NE India\'s monsoon orchestra:**\n\n' +
        'During Assam\'s monsoon season, wetlands and paddy fields erupt with frog calls. Each species has a unique call, and males inflate their **vocal sacs** like balloons to amplify the sound. The vocal sac acts like a resonating chamber — the same principle as cupping your hands around your mouth to shout louder.\n\n' +
        '| Frog species | Call description | Purpose |\n' +
        '|-------------|----------------|--------|\n' +
        '| Indian bullfrog | Deep, loud "wuuorrr" | Territory defence + attract mates |\n' +
        '| Tree frog | High-pitched chirp | Species recognition in mixed-species ponds |\n' +
        '| Bush frog | Rapid clicking | Location signalling in dense foliage |\n\n' +
        '**Hoolock gibbons** — Assam\'s only ape — produce loud, complex songs at dawn that carry over 1 km through the canopy. Mated pairs sing duets: the male starts, the female adds her part, and the duet advertises territory ownership and pair-bond strength.\n\n' +
        '| Gibbon call element | Singer | Function |\n' +
        '|--------------------|--------|----------|\n' +
        '| Opening sequence | Male | "This territory is occupied" |\n' +
        '| Great call | Female | "I have a strong mate — don\'t challenge us" |\n' +
        '| Duet together | Both | Strengthens pair bond + coordinates territory defence |',
      intermediateContent:
        '**Vocal sac physics:**\n\n' +
        'A frog\'s vocal sac is a **Helmholtz resonator** — the same physics as blowing across a bottle opening. Sound produced by the larynx enters the sac, which amplifies specific frequencies:\n\n' +
        '`f = (v / 2pi) x sqrt(A / (V x L))`\n\n' +
        'where v = speed of sound, A = opening area, V = sac volume, L = neck length.\n\n' +
        '| Parameter | Small tree frog | Large bullfrog |\n' +
        '|-----------|----------------|---------------|\n' +
        '| Sac volume | ~0.5 cm3 | ~50 cm3 |\n' +
        '| Resonant frequency | ~3,000 Hz | ~200 Hz |\n' +
        '| Call loudness at 1 m | ~70 dB | ~90 dB |\n' +
        '| Audible range | ~50 m | ~500 m |\n\n' +
        '**Chemical communication — the tiger\'s scent network:**\n\n' +
        'Tigers are solitary but maintain elaborate scent-marking networks:\n\n' +
        '| Marking method | Chemical source | Information encoded |\n' +
        '|---------------|----------------|--------------------|\n' +
        '| Urine spray (backward) | Urine + anal gland secretions | Sex, reproductive status, individual identity |\n' +
        '| Scraping (ground) | Interdigital glands (between toes) | "I was here" + direction of travel |\n' +
        '| Cheek rubbing (trees) | Facial glands | Territory boundary marker |\n' +
        '| Flehmen response | Vomeronasal organ (Jacobson\'s organ) | Reading another tiger\'s chemical message |\n\n' +
        'A tiger\'s urine mark persists for **~3 weeks**, creating a slow-motion communication network. A male tiger in Kaziranga can patrol 60–100 km2 and know which rivals have passed through by reading their scent marks — like checking a visitor log.\n\n' +
        '**Firefly flash patterns:**\n\n' +
        'Fireflies produce light via the **luciferin-luciferase reaction**. Each species has a unique flash pattern:\n\n' +
        '| Species pattern | Flash duration | Inter-flash interval | Meaning |\n' +
        '|----------------|---------------|---------------------|--------|\n' +
        '| Single long flash | ~0.5 s | 5 s | "I\'m a Photinus male, species A" |\n' +
        '| Double quick flash | ~0.1 s each | 2 s gap, then 6 s | "I\'m species B" |\n' +
        '| Steady glow (female) | Continuous | — | "I\'m receptive, come here" |\n' +
        '| Predatory mimic (Photuris) | Copies species B female | — | Lures species B male → eats him |',
      advancedContent:
        '**Honest vs dishonest signals — the handicap principle:**\n\n' +
        'Amotz Zahavi\'s **handicap principle** (1975) explains why many animal signals are costly: the peacock\'s enormous tail, the frog\'s energetically expensive call, the elk\'s heavy antlers. Only truly fit individuals can afford the cost, making the signal **honest** by default.\n\n' +
        '| Signal | Cost to signaller | Information conveyed | Honest? |\n' +
        '|--------|------------------|---------------------|--------|\n' +
        '| Peacock tail | ~25% higher predation, energy for growth | Genetic quality, parasite resistance | Yes — handicap |\n' +
        '| Frog call (loud) | ~8x resting metabolic rate | Body size, stamina | Yes — energetically costly |\n' +
        '| Firefly flash (Photuris mimic) | Minimal | Fakes species ID | **No — dishonest signal** |\n' +
        '| Tiger urine mark | Low (byproduct of metabolism) | Territory ownership | Mostly honest |\n\n' +
        '**Information theory and animal signals:**\n\n' +
        'Claude Shannon\'s information theory applies to animal communication. The information content of a signal depends on how unexpected it is:\n\n' +
        '`H = -sum(p_i x log2(p_i))` bits\n\n' +
        'Studies of gibbon songs show ~3–5 bits of information per call element (comparable to human phonemes at ~4–5 bits). Vervet monkey alarm calls encode predator category (eagle, leopard, snake) as distinct "words" — one of the few examples of **referential signalling** outside humans.\n\n' +
        '| Communication system | Vocabulary size | Information per signal | Referential? |\n' +
        '|---------------------|----------------|----------------------|-------------|\n' +
        '| Honeybee waggle dance | Continuous (direction + distance) | ~4 bits | Yes (location) |\n' +
        '| Vervet monkey alarms | 3–6 distinct calls | ~2–3 bits | Yes (predator type) |\n' +
        '| Gibbon song | ~15–20 note types | ~3–5 bits per note | Partially (territory, pair) |\n' +
        '| Whale song | ~30–40 units | ~5–6 bits per unit | Unknown |\n' +
        '| Human speech | ~40–50 phonemes | ~4–5 bits per phoneme | Yes (fully symbolic) |\n\n' +
        '**The frog chorus coordination problem:**\n\n' +
        'In a mixed-species frog chorus (common in Assam\'s paddy fields during monsoon), each species must be heard above the noise. They solve this through **spectral partitioning** (calling at different frequencies) and **temporal partitioning** (calling at different times of night). This is mathematically equivalent to the FDMA/TDMA multiplexing used in mobile phone networks — nature discovered it first.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each animal communication method to its channel',
          pairs: [
            ['Hoolock gibbon dawn duet', 'Sound — mated pairs sing together to defend territory and strengthen bonds'],
            ['Tiger scent-marking trees', 'Chemical — urine + gland secretions encode identity, sex, and territory claims'],
            ['Peacock tail display', 'Visual — iridescent eyespots are an honest signal of genetic fitness'],
            ['Firefly flash patterns', 'Bioluminescent — species-specific flash codes for mate recognition'],
            ['Elephant trunk greeting', 'Tactile — trunk touches and entwining convey reassurance and social bonding'],
          ],
        },
      },
    },

    // ── Section 9: Remarkable Animal Facts & Biomimicry ──────────
    {
      title: 'Remarkable Animal Facts & Biomimicry',
      diagram: 'ActivityBirdWatchDiagram',
      beginnerContent:
        'The animal kingdom is an engineering library that has been perfecting designs for **3.8 billion years**. Humans have been engineering for maybe 10,000. No wonder we keep finding that animals solved our problems first — and often better. The field of **biomimicry** takes lessons from nature and applies them to human technology.\n\n' +
        '| Animal innovation | What it does | Human technology inspired |\n' +
        '|------------------|-------------|-------------------------|\n' +
        '| Shark skin (tiny tooth-shaped scales) | Reduces drag by 8% | Swimsuits, aircraft coatings |\n' +
        '| Kingfisher beak shape | Enters water with minimal splash | Shinkansen bullet train nose |\n' +
        '| Gecko foot pads (nanoscale hairs) | Sticks to any surface without glue | Reusable adhesive tape |\n' +
        '| Spider silk | 5x stronger than steel by weight | Synthetic silk for sutures, body armour |\n' +
        '| Lotus leaf (nanobumps) | Water rolls off, carrying dirt | Self-cleaning paint, glass |\n' +
        '| Termite mound ventilation | Passive cooling with no energy | Building ventilation (Eastgate Centre, Zimbabwe) |\n\n' +
        '**NE India biomimicry connections:**\n' +
        '- **Muga silk** (unique to Assam) has a natural golden sheen from structural colour + pigment — studied for anti-counterfeiting coatings\n' +
        '- **Bamboo** (abundant in NE India) is a natural composite of cellulose fibres in a lignin matrix — stronger per weight than many steels, inspiring composite materials\n' +
        '- **Rhino skin** has a layered, folded structure that distributes impact — studied for flexible body armour\n\n' +
        '| Animal record | The feat | How |\n' +
        '|-------------|---------|-----|\n' +
        '| Mantis shrimp punch | Acceleration: 10,400 g | Spring-latch mechanism stores energy, releases faster than muscle |\n' +
        '| Peregrine falcon dive | Speed: 389 km/h | Gravity + tucked wings (Cd ~0.04) + nasal baffles prevent lung damage |\n' +
        '| Pistol shrimp snap | Creates 4,700 degree C bubble | Claw closes so fast it creates cavitation — a tiny implosion |\n' +
        '| Octopus escape | Fits through any gap > beak size | No skeleton; 300 million neurons, 60% in arms |\n' +
        '| Tardigrade survival | Survives space vacuum, radiation, -272 degrees C | Trehalose glass formation protects cell structures |\n\n' +
        '**Check yourself:** Next time you see a spider web covered in morning dew in an Assam garden, look at the spiral structure. It\'s an engineering masterpiece — stronger than steel, stretchier than nylon, and built in about 30 minutes. What human product could this inspire?',
      intermediateContent:
        '**The mantis shrimp\'s spring-latch mechanism — detailed physics:**\n\n' +
        'The mantis shrimp\'s strike is too fast for muscle alone. It uses a **spring-latch system**:\n\n' +
        '| Phase | What happens | Duration |\n' +
        '|-------|-------------|----------|\n' +
        '| Loading | Muscles compress a saddle-shaped exoskeletal spring | ~200 ms |\n' +
        '| Latching | A sclerite (hard tab) locks the spring in place | Held until ready |\n' +
        '| Release | Latch slides free | <1 ms |\n' +
        '| Strike | Spring energy → kinetic energy at 10,400 g | <3 ms |\n' +
        '| Cavitation | Water vaporises from low pressure, then implodes | ~0.5 ms |\n\n' +
        '`F = ma = 0.004 kg x 104,000 m/s2 = 416 N` (from a 4-gram appendage!)\n\n' +
        'The cavitation bubble collapse generates temperatures of **~4,700 degrees C** and a second shockwave — the prey is hit twice from a single strike.\n\n' +
        '**Peregrine falcon dive — terminal velocity calculation:**\n\n' +
        'At terminal velocity, drag force = gravitational force:\n\n' +
        '`mg = 0.5 x rho x v2 x Cd x A`\n\n' +
        '| Parameter | Value |\n' +
        '|-----------|-------|\n' +
        '| Mass (m) | 1.0 kg |\n' +
        '| g | 9.81 m/s2 |\n' +
        '| Air density (rho, 1500m) | ~1.06 kg/m3 |\n' +
        '| Drag coefficient (Cd, tucked) | ~0.04 |\n' +
        '| Frontal area (A, tucked) | ~0.01 m2 |\n\n' +
        '`v = sqrt(2mg / (rho x Cd x A))`\n' +
        '`v = sqrt(2 x 1.0 x 9.81 / (1.06 x 0.04 x 0.01))`\n' +
        '`v = sqrt(19.62 / 0.000424) = sqrt(46,274) = ~215 m/s`\n\n' +
        'That\'s ~774 km/h — even higher than measured values (~389 km/h), because real falcons don\'t fully tuck and start from finite altitude. The point: the physics allows insane speeds with streamlined shape.\n\n' +
        '**Biomimicry examples — quantified:**\n\n' +
        '| Natural design | Biomimetic product | Performance gain |\n' +
        '|---------------|-------------------|------------------|\n' +
        '| Kingfisher beak → bullet train | Shinkansen 500 nose cone | 15% less energy, 30% less noise |\n' +
        '| Shark skin → Speedo LZR suit | Riblet swimsuit fabric | 3% drag reduction (banned from competition!) |\n' +
        '| Gecko setae → Geckskin adhesive | Reversible dry adhesive | Holds 300 kg on smooth surface |\n' +
        '| Mantis shrimp dactyl → composites | Helicoidal carbon fibre | 20% better impact resistance |\n' +
        '| Lotus leaf → Lotusan paint | Self-cleaning facade paint | Stays clean for 5+ years |',
      advancedContent:
        '**The mantis shrimp dactyl club — materials science:**\n\n' +
        'The dactyl club has a layered architecture that prevents catastrophic failure despite delivering enormous forces:\n\n' +
        '| Layer | Material | Thickness | Function |\n' +
        '|-------|---------|-----------|----------|\n' +
        '| Impact surface | Hydroxyapatite nanocrystals (crystalline) | ~70 μm | Extreme hardness — initiates contact |\n' +
        '| Periodic region | Chitin fibres in **helicoidal (Bouligand) arrangement** | ~500 μm | Arrests crack propagation by redirecting fractures along spiral paths |\n' +
        '| Striated region | Parallel chitin fibres | ~200 μm | Absorbs compressive energy |\n' +
        '| Inner region | Amorphous mineral + chitin | ~300 μm | Impact absorption, energy dissipation |\n\n' +
        'The **Bouligand structure** is key: chitin fibres are stacked in layers, each rotated ~15 degrees from the previous one, creating a helicoidal pattern. When a crack tries to propagate, it encounters fibres at different angles and is forced to twist and branch — dissipating energy across a large volume instead of cleaving through.\n\n' +
        'This architecture has been replicated in carbon-fibre laminate designs showing **20% improvement** in impact resistance compared to conventional cross-ply layups.\n\n' +
        '**Octopus arm control — the dimensionality problem:**\n\n' +
        'With ~300 million neurons (60% in the arms), each arm has ~10^7 degrees of freedom. The octopus solves this combinatorial explosion by generating stereotyped **bend propagation waves** — a bend point travels along the arm at constant velocity, simplifying control to just 3 parameters:\n\n' +
        '| Parameter | What it controls |\n' +
        '|-----------|------------------|\n' +
        '| Bend point location | Where on the arm the action starts |\n' +
        '| Propagation velocity | Speed of the reaching motion |\n' +
        '| Bend direction | Which way the arm curls |\n\n' +
        'Soft robotics labs have built pneumatic silicone arms mimicking this strategy, achieving dexterous grasping with minimal computational overhead — just 3 control channels instead of thousands of individual motor commands.\n\n' +
        '**Biomimicry as an industry:**\n\n' +
        'The global biomimicry market is estimated at **$1.6 trillion** in bioinspired products. NE India\'s biodiversity — one of the world\'s richest — is a virtually untapped library of engineering solutions. The Assam silk moth\'s cocoon structure, the one-horned rhino\'s folded-plate skin armour, and the bamboo\'s hollow-tube-with-nodes design each contain principles that materials scientists are only beginning to study formally.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'A mantis shrimp punches with the acceleration of a .22-calibre bullet (10,400 g). The strike is so fast it boils the water around it, and the prey is hit by the fist AND a cavitation shockwave.',
            'Elephants are one of the few animals that can recognise themselves in a mirror, showing self-awareness. They also mourn their dead, gently touching the bones of deceased family members with their trunks.',
            'A peregrine falcon dives at over 389 km/h — the fastest animal on Earth. Special nasal baffles slow incoming air to prevent its lungs from collapsing at this speed.',
            'Octopuses have three hearts, blue blood (copper-based instead of iron-based), and can squeeze through any gap larger than their beak — the only hard part of their entire body.',
            'Assam\'s muga silk moth produces the only naturally golden silk in the world. The golden sheen comes partly from structural colour — the same physics that gives peacock feathers their shimmer.',
          ],
        },
      },
    },
  ],
};
