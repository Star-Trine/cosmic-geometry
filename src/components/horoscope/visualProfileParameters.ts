import type {
  HouseNumber,
  PlanetId,
  PlanetVisualData,
  ZodiacSignId,
} from '../../data/horoscope/types';
import {
  SIGN_CLASSIFICATIONS,
  type Element,
  type Modality,
  type Polarity,
} from '../../data/horoscope/signClassifications';

export type PlanetVisualParameter = {
  planetId: PlanetId;
  sign: ZodiacSignId;
  polarity: Polarity;
  modality: Modality;
  element: Element;
  house: HouseNumber | null;
  retrograde: boolean;
};

export const createPlanetVisualParameter = (
  planet: PlanetVisualData,
): PlanetVisualParameter => ({
  ...planet,
  ...SIGN_CLASSIFICATIONS[planet.sign],
});

export const createPlanetVisualParameters = (
  planets: PlanetVisualData[],
): PlanetVisualParameter[] => planets.map(createPlanetVisualParameter);

export const findPlanetVisualParameter = (
  planets: PlanetVisualData[],
  planetId: PlanetId,
): PlanetVisualParameter | null =>
  createPlanetVisualParameters(planets).find((planet) => planet.planetId === planetId) ?? null;
