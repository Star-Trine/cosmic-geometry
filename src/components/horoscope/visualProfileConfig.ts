import type {
  HouseNumber,
  PlanetId,
  PlanetVisualData,
  ZodiacSignId,
} from '../../data/horoscope/types';
import { createPlanetVisualParameter } from './visualProfileParameters';

export type PlanetVisualMetadata = {
  id: PlanetId;
  symbol: string;
  name: string;
  available: boolean;
};

export const PLANET_VISUAL_METADATA = [
  { id: 'sun', symbol: '☉', name: 'Sun', available: true },
  { id: 'moon', symbol: '☽', name: 'Moon', available: true },
  { id: 'mercury', symbol: '☿', name: 'Mercury', available: true },
  { id: 'venus', symbol: '♀', name: 'Venus', available: true },
  { id: 'mars', symbol: '♂', name: 'Mars', available: true },
  { id: 'jupiter', symbol: '♃', name: 'Jupiter', available: true },
  { id: 'saturn', symbol: '♄', name: 'Saturn', available: true },
  { id: 'uranus', symbol: '♅', name: 'Uranus', available: true },
  { id: 'neptune', symbol: '♆', name: 'Neptune', available: true },
  { id: 'pluto', symbol: '♇', name: 'Pluto', available: true },
] as const satisfies readonly PlanetVisualMetadata[];

export type AvailablePlanetVisualId = Extract<
  (typeof PLANET_VISUAL_METADATA)[number],
  { available: true }
>['id'];

export const PLANET_METADATA_BY_ID = Object.fromEntries(
  PLANET_VISUAL_METADATA.map((metadata) => [metadata.id, metadata]),
) as Record<PlanetId, PlanetVisualMetadata>;

const prototypePlanet = (
  planetId: AvailablePlanetVisualId,
  sign: ZodiacSignId,
  house: HouseNumber,
): PlanetVisualData => ({ planetId, sign, house, retrograde: false });

export const FIXED_RELATION_MARS_PARAMETER = createPlanetVisualParameter(
  prototypePlanet('mars', 'scorpio', 2),
);

export type HouseEnvironmentVariant =
  | 'front'
  | 'held'
  | 'localNetwork'
  | 'enclosed'
  | 'expressive'
  | 'ordered'
  | 'mirrored'
  | 'layered'
  | 'elevated'
  | 'public'
  | 'distributed'
  | 'veiled'
  | 'neutral';

export type HouseEnvironmentParameters = {
  depth: number;
  openness: number;
  visibility: number;
  boundary: number;
  density: number;
  symmetry: number;
  connectivity: number;
  brightness: number;
  position: 'center' | 'upper' | 'lower' | 'inner' | 'outer';
};

export type HouseEnvironmentConfig = HouseEnvironmentParameters & {
  variant: HouseEnvironmentVariant;
  label: string;
  stageLabel: string;
};

export const HOUSE_ENVIRONMENT_CONFIGS: Record<HouseNumber, HouseEnvironmentConfig> = {
  1: { variant: 'front', label: 'First house environment', stageLabel: 'CENTER · FRONT · CLEAR · PRESENT', depth: 0.15, openness: 0.60, visibility: 1, boundary: 0.65, density: 0.50, symmetry: 0.65, connectivity: 0.30, brightness: 0.90, position: 'center' },
  2: { variant: 'held', label: 'Second house environment', stageLabel: 'GROUNDED · DENSE · HELD · STABLE', depth: 0.45, openness: 0.25, visibility: 0.70, boundary: 0.90, density: 0.90, symmetry: 0.70, connectivity: 0.20, brightness: 0.45, position: 'lower' },
  3: { variant: 'localNetwork', label: 'Third house environment', stageLabel: 'LOCAL · CONNECTED · BRANCHING', depth: 0.30, openness: 0.55, visibility: 0.85, boundary: 0.30, density: 0.55, symmetry: 0.35, connectivity: 0.90, brightness: 0.70, position: 'center' },
  4: { variant: 'enclosed', label: 'Fourth house environment', stageLabel: 'INNER · ENCLOSED · DEEP', depth: 0.85, openness: 0.20, visibility: 0.45, boundary: 0.85, density: 0.60, symmetry: 0.60, connectivity: 0.25, brightness: 0.30, position: 'inner' },
  5: { variant: 'expressive', label: 'Fifth house environment', stageLabel: 'OPEN · EXPRESSIVE · BRIGHT · VISIBLE', depth: 0.20, openness: 0.95, visibility: 0.95, boundary: 0.30, density: 0.45, symmetry: 0.55, connectivity: 0.50, brightness: 1, position: 'outer' },
  6: { variant: 'ordered', label: 'Sixth house environment', stageLabel: 'STRUCTURED · REPETITIVE · ORDERED', depth: 0.40, openness: 0.40, visibility: 0.85, boundary: 0.75, density: 0.75, symmetry: 0.90, connectivity: 0.55, brightness: 0.60, position: 'center' },
  7: { variant: 'mirrored', label: 'Seventh house environment', stageLabel: 'DUAL · MIRRORED · BALANCED', depth: 0.35, openness: 0.60, visibility: 0.90, boundary: 0.55, density: 0.50, symmetry: 1, connectivity: 0.70, brightness: 0.70, position: 'center' },
  8: { variant: 'layered', label: 'Eighth house environment', stageLabel: 'HIDDEN · LAYERED · DEEP', depth: 0.95, openness: 0.15, visibility: 0.25, boundary: 0.70, density: 0.90, symmetry: 0.45, connectivity: 0.35, brightness: 0.20, position: 'inner' },
  9: { variant: 'elevated', label: 'Ninth house environment', stageLabel: 'ELEVATED · DISTANT · EXPANSIVE', depth: 0.65, openness: 1, visibility: 0.80, boundary: 0.20, density: 0.30, symmetry: 0.45, connectivity: 0.55, brightness: 0.75, position: 'upper' },
  10: { variant: 'public', label: 'Tenth house environment', stageLabel: 'UPPER · PUBLIC · VISIBLE', depth: 0.20, openness: 0.70, visibility: 1, boundary: 0.60, density: 0.55, symmetry: 0.75, connectivity: 0.55, brightness: 0.95, position: 'upper' },
  11: { variant: 'distributed', label: 'Eleventh house environment', stageLabel: 'NETWORKED · DISTRIBUTED · OPEN', depth: 0.35, openness: 1, visibility: 0.85, boundary: 0.15, density: 0.45, symmetry: 0.30, connectivity: 1, brightness: 0.75, position: 'outer' },
  12: { variant: 'veiled', label: 'Twelfth house environment', stageLabel: 'SUBMERGED · DIFFUSE · VEILED', depth: 1, openness: 0.35, visibility: 0.15, boundary: 0.10, density: 0.40, symmetry: 0.25, connectivity: 0.40, brightness: 0.15, position: 'inner' },
};

export const NEUTRAL_HOUSE_ENVIRONMENT: HouseEnvironmentConfig = {
  variant: 'neutral',
  label: 'Neutral environment',
  stageLabel: 'UNPLACED · NEUTRAL',
  depth: 0.5,
  openness: 0.5,
  visibility: 0.5,
  boundary: 0.5,
  density: 0.5,
  symmetry: 0.5,
  connectivity: 0.5,
  brightness: 0.5,
  position: 'center',
};

export const getHouseEnvironmentConfig = (
  house: HouseNumber | null,
): HouseEnvironmentConfig => house === null
  ? NEUTRAL_HOUSE_ENVIRONMENT
  : HOUSE_ENVIRONMENT_CONFIGS[house];

export const formatZodiacSign = (sign: ZodiacSignId): string =>
  sign.charAt(0).toUpperCase() + sign.slice(1);

export const formatClassification = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const formatHouse = (house: HouseNumber | null): string => {
  if (house === null) return 'Unknown';
  const suffix = house === 1 ? 'st' : house === 2 ? 'nd' : house === 3 ? 'rd' : 'th';
  return `${house}${suffix} House`;
};
