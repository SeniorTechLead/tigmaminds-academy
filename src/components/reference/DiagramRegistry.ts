import type { ComponentType } from 'react';

import SineWaveDiagram from '../diagrams/SineWaveDiagram';
import SpectrogramDiagram from '../diagrams/SpectrogramDiagram';
import NumPyRulerDiagram from '../diagrams/NumPyRulerDiagram';
import PlotAnatomyDiagram from '../diagrams/PlotAnatomyDiagram';
import VariablesDiagram from '../diagrams/VariablesDiagram';
import AmplitudeModDiagram from '../diagrams/AmplitudeModDiagram';
import CircuitDiagram from '../diagrams/CircuitDiagram';
import WavelengthSpectrum from '../diagrams/WavelengthSpectrum';
import PhotosynthesisDiagram from '../diagrams/PhotosynthesisDiagram';
import PopulationGrowthCurve from '../diagrams/PopulationGrowthCurve';
import SilkStructureDiagram from '../diagrams/SilkStructureDiagram';
import FoodWebDiagram from '../diagrams/FoodWebDiagram';
import RayleighScatteringDiagram from '../diagrams/RayleighScatteringDiagram';
import RiverErosionDiagram from '../diagrams/RiverErosionDiagram';
import EcholocationDiagram from '../diagrams/EcholocationDiagram';
import MusicalWavesDiagram from '../diagrams/MusicalWavesDiagram';
import NewtonForceDiagram from '../diagrams/NewtonForceDiagram';
import CycloneCrossSectionDiagram from '../diagrams/CycloneCrossSectionDiagram';
import FibonacciSpiralDiagram from '../diagrams/FibonacciSpiralDiagram';
import CSSBoxModelDiagram from '../diagrams/CSSBoxModelDiagram';
import KNNClassificationDiagram from '../diagrams/KNNClassificationDiagram';
import AltitudeProfileDiagram from '../diagrams/AltitudeProfileDiagram';
import FlowchartDiagram from '../diagrams/FlowchartDiagram';
import FeatureExtractionDiagram from '../diagrams/FeatureExtractionDiagram';
import FeatureWeightsDiagram from '../diagrams/FeatureWeightsDiagram';
import TrainTestSplitDiagram from '../diagrams/TrainTestSplitDiagram';
import PostmanSortingDiagram from '../diagrams/PostmanSortingDiagram';
import DogVsCatDiagram from '../diagrams/DogVsCatDiagram';
import DecisionTreeDiagram from '../diagrams/DecisionTreeDiagram';
import LinearClassifierDiagram from '../diagrams/LinearClassifierDiagram';
import NeuralNetworkDiagram from '../diagrams/NeuralNetworkDiagram';
import TransformerAttentionDiagram from '../diagrams/TransformerAttentionDiagram';
import TessellationDiagram from '../diagrams/TessellationDiagram';
import FractalTreeDiagram from '../diagrams/FractalTreeDiagram';
import SymmetryDiagram from '../diagrams/SymmetryDiagram';
import VoronoiDiagram from '../diagrams/VoronoiDiagram';
import MeanMedianModeDiagram from '../diagrams/MeanMedianModeDiagram';
import StdDevDiagram from '../diagrams/StdDevDiagram';
import CorrelationDiagram from '../diagrams/CorrelationDiagram';
import HistogramDiagram from '../diagrams/HistogramDiagram';
import OhmsLawDiagram from '../diagrams/OhmsLawDiagram';
import HeatTransferDiagram from '../diagrams/HeatTransferDiagram';
import DopplerEffectDiagram from '../diagrams/DopplerEffectDiagram';
import AnimalCellDiagram from '../diagrams/AnimalCellDiagram';
import AtomStructureDiagram from '../diagrams/AtomStructureDiagram';
import BalanceScaleDiagram from '../diagrams/BalanceScaleDiagram';
import CellComparisonDiagram from '../diagrams/CellComparisonDiagram';
import DNADoubleHelixDiagram from '../diagrams/DNADoubleHelixDiagram';
import EnergyBarChartDiagram from '../diagrams/EnergyBarChartDiagram';
import EnergyPyramidDiagram from '../diagrams/EnergyPyramidDiagram';
import HeartDiagram from '../diagrams/HeartDiagram';
import IonicBondDiagram from '../diagrams/IonicBondDiagram';
import LensRayDiagram from '../diagrams/LensRayDiagram';
import MagneticFieldLinesDiagram from '../diagrams/MagneticFieldLinesDiagram';
import PHScaleDiagram from '../diagrams/PHScaleDiagram';
import PeriodicTableOverviewDiagram from '../diagrams/PeriodicTableOverviewDiagram';
import PhaseChangeDiagram from '../diagrams/PhaseChangeDiagram';
import PunnettSquareDiagram from '../diagrams/PunnettSquareDiagram';
import PythagoreanDiagram from '../diagrams/PythagoreanDiagram';
import SeriesParallelCircuitDiagram from '../diagrams/SeriesParallelCircuitDiagram';
import TangentLineDiagram from '../diagrams/TangentLineDiagram';
import TransverseLongitudinalDiagram from '../diagrams/TransverseLongitudinalDiagram';
import UnitCircleDiagram from '../diagrams/UnitCircleDiagram';
import WaveEquationDiagram from '../diagrams/WaveEquationDiagram';
import InterferenceDiagram from '../diagrams/InterferenceDiagram';
import MolecularMotionDiagram from '../diagrams/MolecularMotionDiagram';
import StaticElectricityDiagram from '../diagrams/StaticElectricityDiagram';
import CovalentBondDiagram from '../diagrams/CovalentBondDiagram';
import BalancingEquationDiagram from '../diagrams/BalancingEquationDiagram';
import CarbonCycleDiagram from '../diagrams/CarbonCycleDiagram';
import NaturalSelectionDiagram from '../diagrams/NaturalSelectionDiagram';
import BernoulliDiagram from '../diagrams/BernoulliDiagram';
import BuoyancyDiagram from '../diagrams/BuoyancyDiagram';
import CarbonBondingDiagram from '../diagrams/CarbonBondingDiagram';
import CellMembraneDiagram from '../diagrams/CellMembraneDiagram';
import ChromosomeDiagram from '../diagrams/ChromosomeDiagram';
import CoordinatePlaneDiagram from '../diagrams/CoordinatePlaneDiagram';
import DigestiveSystemDiagram from '../diagrams/DigestiveSystemDiagram';
import DominantRecessiveDiagram from '../diagrams/DominantRecessiveDiagram';
import EarthMagnetismDiagram from '../diagrams/EarthMagnetismDiagram';
import ElectromagnetDiagram from '../diagrams/ElectromagnetDiagram';
import ElectronShellDiagram from '../diagrams/ElectronShellDiagram';
import EnergyProfileDiagram from '../diagrams/EnergyProfileDiagram';
import FunctionalGroupsDiagram from '../diagrams/FunctionalGroupsDiagram';
import GravitationalFieldDiagram from '../diagrams/GravitationalFieldDiagram';
import HeightDistanceDiagram from '../diagrams/HeightDistanceDiagram';
import HomologousStructuresDiagram from '../diagrams/HomologousStructuresDiagram';
import HydraulicPressDiagram from '../diagrams/HydraulicPressDiagram';
import IsotopeDiagram from '../diagrams/IsotopeDiagram';
import LinearGraphDiagram from '../diagrams/LinearGraphDiagram';
import LungsDiagram from '../diagrams/LungsDiagram';
import MetallicBondDiagram from '../diagrams/MetallicBondDiagram';
import MitosisDiagram from '../diagrams/MitosisDiagram';
import MolecularShapeDiagram from '../diagrams/MolecularShapeDiagram';
import MotorGeneratorDiagram from '../diagrams/MotorGeneratorDiagram';
import MutationTypesDiagram from '../diagrams/MutationTypesDiagram';
import NeuronDiagram from '../diagrams/NeuronDiagram';
import NumberLineDiagram from '../diagrams/NumberLineDiagram';
import OrbitalMechanicsDiagram from '../diagrams/OrbitalMechanicsDiagram';
import PolymerChainDiagram from '../diagrams/PolymerChainDiagram';
import PressureDepthDiagram from '../diagrams/PressureDepthDiagram';
import ProbabilityScaleDiagram from '../diagrams/ProbabilityScaleDiagram';
import ReactionTypesDiagram from '../diagrams/ReactionTypesDiagram';
import SOHCAHTOADiagram from '../diagrams/SOHCAHTOADiagram';
import SieveOfEratosthenesDiagram from '../diagrams/SieveOfEratosthenesDiagram';
import SkeletonMuscleDiagram from '../diagrams/SkeletonMuscleDiagram';
import SubatomicParticlesDiagram from '../diagrams/SubatomicParticlesDiagram';
import TidesDiagram from '../diagrams/TidesDiagram';
import TreeDiagramProbability from '../diagrams/TreeDiagramProbability';
import TrigGraphsDiagram from '../diagrams/TrigGraphsDiagram';
import VectorAdditionDiagram from '../diagrams/VectorAdditionDiagram';
import AdaptationDiagram from '../diagrams/AdaptationDiagram';
import AngleTypesDiagram from '../diagrams/AngleTypesDiagram';
import AreaUnderCurveDiagram from '../diagrams/AreaUnderCurveDiagram';
import DistanceFormulaDiagram from '../diagrams/DistanceFormulaDiagram';
import EMCSquaredDiagram from '../diagrams/EMCSquaredDiagram';
import LimitDiagram from '../diagrams/LimitDiagram';
import BacteriaStructureDiagram from '../diagrams/BacteriaStructureDiagram';
import BatteryCrossSectionDiagram from '../diagrams/BatteryCrossSectionDiagram';
import BoyleLawDiagram from '../diagrams/BoyleLawDiagram';
import CirclePropertiesDiagram from '../diagrams/CirclePropertiesDiagram';
import CodonTableDiagram from '../diagrams/CodonTableDiagram';
import CombinatoricsGridDiagram from '../diagrams/CombinatoricsGridDiagram';
import ConicSectionsDiagram from '../diagrams/ConicSectionsDiagram';
import DNAReplicationDiagram from '../diagrams/DNAReplicationDiagram';
import DichotomousKeyDiagram from '../diagrams/DichotomousKeyDiagram';
import DiffractionDiagram from '../diagrams/DiffractionDiagram';
import ElementBoxDiagram from '../diagrams/ElementBoxDiagram';
import EnergyConversionChainDiagram from '../diagrams/EnergyConversionChainDiagram';
import ExpectedValueDiagram from '../diagrams/ExpectedValueDiagram';
import EyeAnatomyDiagram from '../diagrams/EyeAnatomyDiagram';
import FermentationDiagram from '../diagrams/FermentationDiagram';
import FissionFusionDiagram from '../diagrams/FissionFusionDiagram';
import FiveKingdomsDiagram from '../diagrams/FiveKingdomsDiagram';
import FungiDiagram from '../diagrams/FungiDiagram';
import HalfLifeDiagram from '../diagrams/HalfLifeDiagram';
import HydroelectricDiagram from '../diagrams/HydroelectricDiagram';
import LightClockDiagram from '../diagrams/LightClockDiagram';
import MatrixMultiplicationDiagram from '../diagrams/MatrixMultiplicationDiagram';
import MetalNonmetalDiagram from '../diagrams/MetalNonmetalDiagram';
import MirrorReflectionDiagram from '../diagrams/MirrorReflectionDiagram';
import ModularClockDiagram from '../diagrams/ModularClockDiagram';
import NEIndiaBiomesDiagram from '../diagrams/NEIndiaBiomesDiagram';
import NitrogenCycleDiagram from '../diagrams/NitrogenCycleDiagram';
import NucleusStructureDiagram from '../diagrams/NucleusStructureDiagram';
import ParticleModelDiagram from '../diagrams/ParticleModelDiagram';
import PeriodicTrendsDiagram from '../diagrams/PeriodicTrendsDiagram';
import PhaseTransitionDiagram from '../diagrams/PhaseTransitionDiagram';
import PhylogeneticTreeDiagram from '../diagrams/PhylogeneticTreeDiagram';
import RadioactiveDecayDiagram from '../diagrams/RadioactiveDecayDiagram';
import RedoxDiagram from '../diagrams/RedoxDiagram';
import SequencePatternDiagram from '../diagrams/SequencePatternDiagram';
import SlopeInterceptDiagram from '../diagrams/SlopeInterceptDiagram';
import TaxonomyHierarchyDiagram from '../diagrams/TaxonomyHierarchyDiagram';
import TotalInternalReflectionDiagram from '../diagrams/TotalInternalReflectionDiagram';
import TranscriptionDiagram from '../diagrams/TranscriptionDiagram';
import TransformationMatrixDiagram from '../diagrams/TransformationMatrixDiagram';
import TransformationsDiagram from '../diagrams/TransformationsDiagram';
import TranslationDiagram from '../diagrams/TranslationDiagram';
import VirusReplicationDiagram from '../diagrams/VirusReplicationDiagram';
import VoltaicCellDiagram from '../diagrams/VoltaicCellDiagram';
import Volume3DDiagram from '../diagrams/Volume3DDiagram';
import WorkForceDiagram from '../diagrams/WorkForceDiagram';
import ClimateFactorsDiagram from '../diagrams/ClimateFactorsDiagram';
import ClimateZonesDiagram from '../diagrams/ClimateZonesDiagram';
import EarthLayersDiagram from '../diagrams/EarthLayersDiagram';
import LatLongGridDiagram from '../diagrams/LatLongGridDiagram';
import PlateBoundaryDiagram from '../diagrams/PlateBoundaryDiagram';
import RockCycleDiagram from '../diagrams/RockCycleDiagram';
import SeismicWavesDiagram from '../diagrams/SeismicWavesDiagram';
import SoilHorizonDiagram from '../diagrams/SoilHorizonDiagram';
import TectonicPlatesDiagram from '../diagrams/TectonicPlatesDiagram';
import WaterCycleDiagram from '../diagrams/WaterCycleDiagram';
import ContourMapDiagram from '../diagrams/ContourMapDiagram';
import DemographicTransitionDiagram from '../diagrams/DemographicTransitionDiagram';
import MapProjectionDiagram from '../diagrams/MapProjectionDiagram';
import MonsoonDiagram from '../diagrams/MonsoonDiagram';
import MagnitudeStaircaseDiagram from '../diagrams/MagnitudeStaircaseDiagram';
import SunsetPathDiagram from '../diagrams/SunsetPathDiagram';
import MilkScatteringDiagram from '../diagrams/MilkScatteringDiagram';
import SunsetSimulatorOutputDiagram from '../diagrams/SunsetSimulatorOutputDiagram';
import MieVsRayleighDiagram from '../diagrams/MieVsRayleighDiagram';
import MirageDiagram from '../diagrams/MirageDiagram';
import RainbowRaindropDiagram from '../diagrams/RainbowRaindropDiagram';

const registry: Record<string, ComponentType> = {
  SineWaveDiagram,
  SpectrogramDiagram,
  NumPyRulerDiagram,
  PlotAnatomyDiagram,
  VariablesDiagram,
  AmplitudeModDiagram,
  CircuitDiagram,
  WavelengthSpectrum,
  PhotosynthesisDiagram,
  PopulationGrowthCurve,
  SilkStructureDiagram,
  FoodWebDiagram,
  RayleighScatteringDiagram,
  RiverErosionDiagram,
  EcholocationDiagram,
  MusicalWavesDiagram,
  NewtonForceDiagram,
  CycloneCrossSectionDiagram,
  FibonacciSpiralDiagram,
  CSSBoxModelDiagram,
  KNNClassificationDiagram,
  AltitudeProfileDiagram,
  FlowchartDiagram,
  FeatureExtractionDiagram,
  FeatureWeightsDiagram,
  TrainTestSplitDiagram,
  PostmanSortingDiagram,
  DogVsCatDiagram,
  DecisionTreeDiagram,
  LinearClassifierDiagram,
  NeuralNetworkDiagram,
  TransformerAttentionDiagram,
  TessellationDiagram,
  FractalTreeDiagram,
  SymmetryDiagram,
  VoronoiDiagram,
  MeanMedianModeDiagram,
  StdDevDiagram,
  CorrelationDiagram,
  HistogramDiagram,
  OhmsLawDiagram,
  HeatTransferDiagram,
  DopplerEffectDiagram,
  AnimalCellDiagram,
  AtomStructureDiagram,
  BalanceScaleDiagram,
  CellComparisonDiagram,
  DNADoubleHelixDiagram,
  EnergyBarChartDiagram,
  EnergyPyramidDiagram,
  HeartDiagram,
  IonicBondDiagram,
  LensRayDiagram,
  MagneticFieldLinesDiagram,
  PHScaleDiagram,
  PeriodicTableOverviewDiagram,
  PhaseChangeDiagram,
  PunnettSquareDiagram,
  PythagoreanDiagram,
  SeriesParallelCircuitDiagram,
  TangentLineDiagram,
  TransverseLongitudinalDiagram,
  UnitCircleDiagram,
  WaveEquationDiagram,
  InterferenceDiagram,
  MolecularMotionDiagram,
  StaticElectricityDiagram,
  CovalentBondDiagram,
  BalancingEquationDiagram,
  CarbonCycleDiagram,
  NaturalSelectionDiagram,
  BernoulliDiagram,
  BuoyancyDiagram,
  CarbonBondingDiagram,
  CellMembraneDiagram,
  ChromosomeDiagram,
  CoordinatePlaneDiagram,
  DigestiveSystemDiagram,
  DominantRecessiveDiagram,
  EarthMagnetismDiagram,
  ElectromagnetDiagram,
  ElectronShellDiagram,
  EnergyProfileDiagram,
  FunctionalGroupsDiagram,
  GravitationalFieldDiagram,
  HeightDistanceDiagram,
  HomologousStructuresDiagram,
  HydraulicPressDiagram,
  IsotopeDiagram,
  LinearGraphDiagram,
  LungsDiagram,
  MetallicBondDiagram,
  MitosisDiagram,
  MolecularShapeDiagram,
  MotorGeneratorDiagram,
  MutationTypesDiagram,
  NeuronDiagram,
  NumberLineDiagram,
  OrbitalMechanicsDiagram,
  PolymerChainDiagram,
  PressureDepthDiagram,
  ProbabilityScaleDiagram,
  ReactionTypesDiagram,
  SOHCAHTOADiagram,
  SieveOfEratosthenesDiagram,
  SkeletonMuscleDiagram,
  SubatomicParticlesDiagram,
  TidesDiagram,
  TreeDiagramProbability,
  TrigGraphsDiagram,
  VectorAdditionDiagram,
  AdaptationDiagram,
  AngleTypesDiagram,
  AreaUnderCurveDiagram,
  DistanceFormulaDiagram,
  EMCSquaredDiagram,
  LimitDiagram,
  BacteriaStructureDiagram,
  BatteryCrossSectionDiagram,
  BoyleLawDiagram,
  CirclePropertiesDiagram,
  CodonTableDiagram,
  CombinatoricsGridDiagram,
  ConicSectionsDiagram,
  DNAReplicationDiagram,
  DichotomousKeyDiagram,
  DiffractionDiagram,
  ElementBoxDiagram,
  EnergyConversionChainDiagram,
  ExpectedValueDiagram,
  EyeAnatomyDiagram,
  FermentationDiagram,
  FissionFusionDiagram,
  FiveKingdomsDiagram,
  FungiDiagram,
  HalfLifeDiagram,
  HydroelectricDiagram,
  LightClockDiagram,
  MatrixMultiplicationDiagram,
  MetalNonmetalDiagram,
  MirrorReflectionDiagram,
  ModularClockDiagram,
  NEIndiaBiomesDiagram,
  NitrogenCycleDiagram,
  NucleusStructureDiagram,
  ParticleModelDiagram,
  PeriodicTrendsDiagram,
  PhaseTransitionDiagram,
  PhylogeneticTreeDiagram,
  RadioactiveDecayDiagram,
  RedoxDiagram,
  SequencePatternDiagram,
  SlopeInterceptDiagram,
  TaxonomyHierarchyDiagram,
  TotalInternalReflectionDiagram,
  TranscriptionDiagram,
  TransformationMatrixDiagram,
  TransformationsDiagram,
  TranslationDiagram,
  VirusReplicationDiagram,
  VoltaicCellDiagram,
  Volume3DDiagram,
  WorkForceDiagram,
  ClimateFactorsDiagram,
  ClimateZonesDiagram,
  EarthLayersDiagram,
  LatLongGridDiagram,
  PlateBoundaryDiagram,
  RockCycleDiagram,
  SeismicWavesDiagram,
  SoilHorizonDiagram,
  TectonicPlatesDiagram,
  WaterCycleDiagram,
  ContourMapDiagram,
  DemographicTransitionDiagram,
  MapProjectionDiagram,
  MonsoonDiagram,
  MagnitudeStaircaseDiagram,
  SunsetPathDiagram,
  MilkScatteringDiagram,
  SunsetSimulatorOutputDiagram,
  MieVsRayleighDiagram,
  MirageDiagram,
  RainbowRaindropDiagram,
};

export default registry;
