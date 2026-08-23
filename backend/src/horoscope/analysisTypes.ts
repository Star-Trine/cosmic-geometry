import type { ZodiacSignId } from "./types.js";

export type PlanetDistribution = Array<{
  sign: ZodiacSignId;
  count: number;
}>;

export const HOUSE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export type HouseNumber = (typeof HOUSE_NUMBERS)[number];

export type HouseDistribution = Array<{
  house: HouseNumber;
  count: number;
}>;

export type HoroscopeAnalysis = {
  polarity: {
    masculine: number;
    feminine: number;
  };
  modalities: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };
  elements: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  planetDistribution: PlanetDistribution;
  houseDistribution: HouseDistribution | null;
};
