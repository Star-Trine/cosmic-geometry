import type { HouseNumber } from "./analysisTypes.js";
import type {
  AspectType,
  PlanetId,
  ZodiacSignId,
} from "./types.js";

export type VisualProfileMode = "full" | "partial";

export type PlanetVisualData = {
  planetId: PlanetId;
  sign: ZodiacSignId;
  house: HouseNumber | null;
  retrograde: boolean;
};

export type HouseVisualData = {
  house: HouseNumber;
};

export type AspectVisualData = {
  bodyA: PlanetId;
  bodyB: PlanetId;
  type: AspectType;
  strength: number;
};

export type VisualProfileData = {
  mode: VisualProfileMode;
  direction: {
    outward: number;
    inward: number;
  };
  motion: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };
  palette: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  planets: PlanetVisualData[];
  houses: HouseVisualData[] | null;
  aspects: AspectVisualData[];
};
