// ============================================================
// REFERENCE DATA MODEL
//
// Types, categories, and the combined references array.
// Actual entries live in sub-files (reference-coding.ts, etc.)
// and are re-exported from here.
// ============================================================

// ─── Types ───────────────────────────────────────────────────

export type ReferenceCategory =
  | 'language' | 'data-science' | 'database' | 'electronics' | 'math' | 'ai'
  | 'physics' | 'biology' | 'chemistry' | 'geography'
  | 'ecology' | 'earth-science'
  | 'economics' | 'engineering' | 'music-arts'
  | 'zoology' | 'botany' | 'neuroscience' | 'materials-science'
  | 'meteorology' | 'geology' | 'astronomy' | 'marine-science'
  | 'conservation' | 'health-medicine' | 'agriculture';

export interface InteractiveConfig {
  type: 'matching' | 'true-false' | 'slider' | 'did-you-know' | 'tone-player' | 'interval-player' | 'beat-machine' | 'harmonics-explorer' | 'gaussian-explorer' | 'contour-explainer' | 'logic-gate-simulator' | 'sql-playground' | 'ts-playground' | 'html-playground' | 'python-playground';
  props: Record<string, unknown>;
}

// ─── Practice Problems ─────────────────────────────────────

export interface PracticeProblemStep {
  label: string;        // "Step 1: Find the mean"
  content: string;      // Markdown — rendered with bold/code/tables
}

export type ProblemVisualType =
  | { kind: 'dice'; count: number; values?: number[] }
  | { kind: 'coins'; count: number; heads?: number }
  | { kind: 'cards'; drawn: string[] }                         // e.g. ["A♠","K♥","3♦"]
  | { kind: 'bar-chart'; labels: string[]; values: number[]; highlight?: number }
  | { kind: 'waiting'; avgMinutes: number; markTime?: number } // animated queue/timeline
  | { kind: 'scatter'; points: [number, number][]; showLine?: boolean }
  | { kind: 'distribution'; type: 'normal' | 'binomial' | 'poisson' | 'exponential' | 'chi-squared'; params: Record<string, number>; markX?: number; shadeFrom?: number; shadeTo?: number };

export interface PracticeProblem {
  id: string;
  difficulty: 1 | 2 | 3;
  question: string;                    // Markdown
  hint?: string;
  steps: PracticeProblemStep[];        // step-by-step hand solution
  answer: string;                      // display-friendly final answer
  visual?: ProblemVisualType;
  code?: string;                       // Python starter code (for code practice variant)
  codeSolution?: string;               // Python solution (revealed on request)
}

export interface PracticeSet {
  title: string;                       // "Practice — Mean, Median, Mode"
  problems: PracticeProblem[];
}

// ─── Reference Section ─────────────────────────────────────

export interface ReferenceSection {
  id?: string;                // unique section identifier (e.g., 'py-strings', 'algo-binary-search')
  title: string;
  beginnerContent: string;           // Level 0 — analogies, try-this, zero jargon
  intermediateContent?: string;      // Level 1 — formulas, calculations, code snippets
  advancedContent?: string;          // Level 2 — derivations, research, edge cases
  code?: string;
  diagram?: string;           // key into DiagramRegistry
  interactive?: InteractiveConfig;
  practice?: PracticeSet;            // optional practice problems (accessed via button, not inline)
}

export interface ReferenceGuide {
  slug: string;
  title: string;
  category: ReferenceCategory;
  icon: string;
  tagline: string;
  understand: ReferenceSection[];    // no-code, visual
  build?: ReferenceSection[];        // code + technical (optional for science entries)
  relatedStories?: string[];
}

// ─── Category metadata ───────────────────────────────────────

export type CategoryGroup = 'coding' | 'science';

export interface CategoryMeta {
  key: ReferenceCategory;
  label: string;
  icon: string;
  color: string;
  group: CategoryGroup;
}

export const REFERENCE_CATEGORIES: CategoryMeta[] = [
  // Science
  {
    key: 'physics',
    label: 'Physics',
    icon: '⚡',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    group: 'science',
  },
  {
    key: 'chemistry',
    label: 'Chemistry',
    icon: '⚗️',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    group: 'science',
  },
  {
    key: 'biology',
    label: 'Biology',
    icon: '🧬',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    group: 'science',
  },
  {
    key: 'ecology',
    label: 'Ecology',
    icon: '🌿',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    group: 'science',
  },
  {
    key: 'earth-science',
    label: 'Earth Science',
    icon: '🌍',
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    group: 'science',
  },
  {
    key: 'geography',
    label: 'Geography',
    icon: '🗺️',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    group: 'science',
  },
  {
    key: 'economics',
    label: 'Economics',
    icon: '📈',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    group: 'science',
  },
  {
    key: 'engineering',
    label: 'Engineering',
    icon: '🔧',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
    group: 'science',
  },
  {
    key: 'music-arts',
    label: 'Music & Arts',
    icon: '🎵',
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    group: 'science',
  },
  {
    key: 'zoology',
    label: 'Zoology',
    icon: '🐾',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    group: 'science',
  },
  {
    key: 'botany',
    label: 'Botany',
    icon: '🌺',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    group: 'science',
  },
  {
    key: 'neuroscience',
    label: 'Neuroscience',
    icon: '🧠',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    group: 'science',
  },
  {
    key: 'materials-science',
    label: 'Materials Science',
    icon: '🧵',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
    group: 'science',
  },
  {
    key: 'meteorology',
    label: 'Meteorology',
    icon: '🌦️',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    group: 'science',
  },
  {
    key: 'geology',
    label: 'Geology',
    icon: '🪨',
    color: 'bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-300',
    group: 'science',
  },
  {
    key: 'astronomy',
    label: 'Astronomy',
    icon: '🔭',
    color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    group: 'science',
  },
  {
    key: 'marine-science',
    label: 'Marine Science',
    icon: '🐟',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    group: 'science',
  },
  {
    key: 'conservation',
    label: 'Conservation',
    icon: '🛡️',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    group: 'science',
  },
  {
    key: 'health-medicine',
    label: 'Health & Medicine',
    icon: '🏥',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    group: 'science',
  },
  {
    key: 'agriculture',
    label: 'Agriculture',
    icon: '🌾',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    group: 'science',
  },

  // Math & Computing
  {
    key: 'math',
    label: 'Mathematics',
    icon: '📐',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    group: 'coding',
  },
  {
    key: 'language',
    label: 'Programming',
    icon: '💻',
    color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    group: 'coding',
  },
  {
    key: 'data-science',
    label: 'Data Science',
    icon: '📊',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    group: 'coding',
  },
  {
    key: 'database',
    label: 'Databases & SQL',
    icon: '🗄️',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    group: 'coding',
  },
  {
    key: 'ai',
    label: 'AI & ML',
    icon: '🤖',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    group: 'coding',
  },
  {
    key: 'electronics',
    label: 'Electronics',
    icon: '⚙️',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    group: 'coding',
  },
];

// ─── Combined references array ───────────────────────────────
// Each guide loaded from its own file for code splitting.

import { guide as lightAndColor } from './reference/light-and-color';
import { guide as soundAndVibration } from './reference/sound-and-vibration';
import { guide as forcesAndMotion } from './reference/forces-and-motion';
import { guide as altitudeAndAtmosphere } from './reference/altitude-and-atmosphere';
import { guide as plantBiology } from './reference/plant-biology';
import { guide as animalSensesAndBehavior } from './reference/animal-senses-and-behavior';
import { guide as riversAndLandforms } from './reference/rivers-and-landforms';
import { guide as patternsInNature } from './reference/patterns-in-nature';
import { guide as ecologyAndPopulations } from './reference/ecology-and-populations';
import { guide as weatherAndClimate } from './reference/weather-and-climate';
import { guide as materialsAndChemistry } from './reference/materials-and-chemistry';
import { guide as electricityAndCurrent } from './reference/electricity-and-current';
import { guide as magnetismAndElectromagnetism } from './reference/magnetism-and-electromagnetism';
import { guide as opticsAndLenses } from './reference/optics-and-lenses';
import { guide as wavesAndProperties } from './reference/waves-and-properties';
import { guide as heatAndThermodynamics } from './reference/heat-and-thermodynamics';
import { guide as energyAndWork } from './reference/energy-and-work';
import { guide as cellStructure } from './reference/cell-structure';
import { guide as geneticsAndDna } from './reference/genetics-and-dna';
import { guide as humanBodySystems } from './reference/human-body-systems';
import { guide as evolutionAndNaturalSelection } from './reference/evolution-and-natural-selection';
import { guide as algebraFundamentals } from './reference/algebra-fundamentals';
import { guide as geometryEssentials } from './reference/geometry-essentials';
import { guide as trigonometry } from './reference/trigonometry';
import { guide as probabilityAndCombinatorics } from './reference/probability-and-combinatorics';
import { guide as nuclearPhysics } from './reference/nuclear-physics';
import { guide as gravityAndOrbits } from './reference/gravity-and-orbits';
import { guide as fluidMechanics } from './reference/fluid-mechanics';
import { guide as introToRelativity } from './reference/intro-to-relativity';
import { guide as atomsAndStructure } from './reference/atoms-and-structure';
import { guide as periodicTable } from './reference/periodic-table';
import { guide as chemicalBonding } from './reference/chemical-bonding';
import { guide as chemicalReactions } from './reference/chemical-reactions';
import { guide as microbiology } from './reference/microbiology';
import { guide as classificationOfLife } from './reference/classification-of-life';
import { guide as molecularBiology } from './reference/molecular-biology';
import { guide as ecosystemsAndBiomes } from './reference/ecosystems-and-biomes';
import { guide as acidsBasesAndPh } from './reference/acids-bases-and-ph';
import { guide as statesOfMatter } from './reference/states-of-matter';
import { guide as organicChemistryIntro } from './reference/organic-chemistry-intro';
import { guide as electrochemistry } from './reference/electrochemistry';
import { guide as coordinateGeometry } from './reference/coordinate-geometry';
import { guide as numberTheoryAndSequences } from './reference/number-theory-and-sequences';
import { guide as introToCalculus } from './reference/intro-to-calculus';
import { guide as statisticsAndDistributions } from './reference/statistics-and-distributions';
import { guide as matricesAndVectors } from './reference/matrices-and-vectors';
import { guide as plateTectonics } from './reference/plate-tectonics';
import { guide as mapsAndNavigation } from './reference/maps-and-navigation';
import { guide as climateAndZones } from './reference/climate-and-zones';
import { guide as rocksMineralsSoil } from './reference/rocks-minerals-soil';
import { guide as populationAndUrbanization } from './reference/population-and-urbanization';
import { guide as naturalResources } from './reference/natural-resources';
import { guide as foodWebsEnergyFlow } from './reference/food-webs-energy-flow';
import { guide as habitatsAndBiomes } from './reference/habitats-and-biomes';
import { guide as symbiosisAndInteractions } from './reference/symbiosis-and-interactions';
import { guide as conservationBiology } from './reference/conservation-biology';
import { guide as nutrientCycles } from './reference/nutrient-cycles';
import { guide as solarSystemAndSpace } from './reference/solar-system-and-space';
import { guide as humanHealthNutrition } from './reference/human-health-nutrition';
import { guide as simpleMachines } from './reference/simple-machines';
import { guide as environmentalScience } from './reference/environmental-science';
import { guide as scientificMethod } from './reference/scientific-method';
import { guide as ratiosAndProportions } from './reference/ratios-and-proportions';
import { guide as supplyDemandEconomics } from './reference/supply-demand-economics';
import { guide as engineeringDesign } from './reference/engineering-design';
import { guide as musicTheoryPhysics } from './reference/music-theory-physics';
import { guide as rhythmAndPercussion } from './reference/rhythm-and-percussion';
import { guide as colorAndVisualArts } from './reference/color-and-visual-arts';
import { guide as machinesAndMotors } from './reference/machines-and-motors';
import { guide as structuralEngineering } from './reference/structural-engineering';
import { guide as rotationalMechanics } from './reference/rotational-mechanics';
import { guide as sonarAndEcholocation } from './reference/sonar-and-echolocation';
import { guide as tidesAndOceanography } from './reference/tides-and-oceanography';
import { guide as aerodynamicsAndFlight } from './reference/aerodynamics-and-flight';
import { guide as neuroscienceAndBrain } from './reference/neuroscience-and-brain';
import { guide as geologyAndEarth } from './reference/geology-and-earth';
import { guide as hydrologyAndWater } from './reference/hydrology-and-water';
import { guide as python } from './reference/python';
import { guide as htmlCssJs } from './reference/html-css-js';
import { guide as typescript } from './reference/typescript';
import { guide as arduinoLanguage } from './reference/arduino-language';
import { guide as numpy } from './reference/numpy';
import { guide as matplotlib } from './reference/matplotlib';
import { guide as machineLearning } from './reference/machine-learning';
import { guide as signalProcessing } from './reference/signal-processing';
import { guide as circuitsBasics } from './reference/circuits-basics';
import { guide as arduinoSimulator } from './reference/arduino-simulator';
import { guide as statisticsBasics } from './reference/statistics-basics';
import { guide as sineWaves } from './reference/sine-waves';
import { guide as gitVersionControl } from './reference/git-version-control';
import { guide as databasesAndSql } from './reference/databases-and-sql';
import { guide as apisAndWeb } from './reference/apis-and-web';
import { guide as algorithmsDataStructures } from './reference/algorithms-data-structures';
import { guide as cybersecurityBasics } from './reference/cybersecurity-basics';
import { guide as logicGates } from './reference/logic-gates';

export const references: ReferenceGuide[] = [
  lightAndColor, soundAndVibration, forcesAndMotion, altitudeAndAtmosphere,
  plantBiology, animalSensesAndBehavior, riversAndLandforms, patternsInNature,
  ecologyAndPopulations, weatherAndClimate, materialsAndChemistry, electricityAndCurrent,
  magnetismAndElectromagnetism, opticsAndLenses, wavesAndProperties, heatAndThermodynamics,
  energyAndWork, cellStructure, geneticsAndDna, humanBodySystems,
  evolutionAndNaturalSelection, algebraFundamentals, geometryEssentials, trigonometry,
  probabilityAndCombinatorics, nuclearPhysics, gravityAndOrbits, fluidMechanics,
  introToRelativity, atomsAndStructure, periodicTable, chemicalBonding,
  chemicalReactions, microbiology, classificationOfLife, molecularBiology,
  ecosystemsAndBiomes, acidsBasesAndPh, statesOfMatter, organicChemistryIntro,
  electrochemistry, coordinateGeometry, numberTheoryAndSequences, introToCalculus,
  statisticsAndDistributions, matricesAndVectors, plateTectonics, mapsAndNavigation,
  climateAndZones, rocksMineralsSoil, populationAndUrbanization, naturalResources,
  foodWebsEnergyFlow, habitatsAndBiomes, symbiosisAndInteractions, conservationBiology,
  nutrientCycles, solarSystemAndSpace, humanHealthNutrition, simpleMachines,
  environmentalScience, scientificMethod, ratiosAndProportions, supplyDemandEconomics,
  engineeringDesign, musicTheoryPhysics, rhythmAndPercussion, colorAndVisualArts,
  machinesAndMotors, structuralEngineering, rotationalMechanics, sonarAndEcholocation,
  tidesAndOceanography, aerodynamicsAndFlight, neuroscienceAndBrain, geologyAndEarth,
  hydrologyAndWater, python, htmlCssJs, typescript,
  arduinoLanguage, numpy, matplotlib, machineLearning,
  signalProcessing, circuitsBasics, arduinoSimulator, statisticsBasics,
  sineWaves, gitVersionControl, databasesAndSql, apisAndWeb,
  algorithmsDataStructures, cybersecurityBasics, logicGates,
];
