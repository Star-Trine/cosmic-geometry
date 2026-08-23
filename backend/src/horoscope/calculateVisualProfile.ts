import {
  HOUSE_NUMBERS,
  type HoroscopeAnalysis,
  type HouseNumber,
} from "./analysisTypes.js";
import { PLANET_IDS, type HoroscopeData } from "./types.js";
import type {
  AspectVisualData,
  HouseVisualData,
  PlanetVisualData,
  VisualProfileData,
  VisualProfileMode,
} from "./visualProfileTypes.js";

const PLANET_COUNT = PLANET_IDS.length;
const MAX_ASPECT_ORB = 5;
const HOUSE_NUMBER_SET = new Set<number>(HOUSE_NUMBERS);

const clampUnit = (value: number): number => Math.min(1, Math.max(0, value));

const assertCountTotal = (
  values: number[],
  classification: string,
): void => {
  if (values.some((value) => !Number.isInteger(value) || value < 0)) {
    throw new TypeError(`${classification} counts must be non-negative integers`);
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total !== PLANET_COUNT) {
    throw new TypeError(
      `${classification} counts must total ${PLANET_COUNT}; received ${total}`,
    );
  }
};

const toHouseNumber = (house: number, context: string): HouseNumber => {
  if (!HOUSE_NUMBER_SET.has(house)) {
    throw new RangeError(`${context} has an invalid house: ${house}`);
  }
  return house as HouseNumber;
};

const normalizePlanets = (
  horoscope: HoroscopeData,
  mode: VisualProfileMode,
): PlanetVisualData[] => {
  if (horoscope.planets.length !== PLANET_COUNT) {
    throw new TypeError(
      `Visual Profile requires ${PLANET_COUNT} planets; received ${horoscope.planets.length}`,
    );
  }

  return horoscope.planets.map((planet) => {
    const house =
      mode === "partial"
        ? null
        : planet.house === null
          ? null
          : toHouseNumber(planet.house, `Planet ${planet.id}`);

    if (mode === "full" && house === null) {
      throw new TypeError(
        `Planet ${planet.id} must have a house in a full Visual Profile`,
      );
    }

    return {
      planetId: planet.id,
      sign: planet.sign,
      house,
      retrograde: planet.retrograde,
    };
  });
};

const normalizeHouses = (
  horoscope: HoroscopeData,
  mode: VisualProfileMode,
): HouseVisualData[] | null => {
  if (mode === "partial") return null;
  if (horoscope.houses === null) {
    throw new TypeError("Houses must be present in a full Visual Profile");
  }

  if (horoscope.houses.length !== HOUSE_NUMBERS.length) {
    throw new TypeError(
      `Visual Profile requires ${HOUSE_NUMBERS.length} houses; received ${horoscope.houses.length}`,
    );
  }

  const houses = horoscope.houses.map((house) => ({
    house: toHouseNumber(house.house, "HoroscopeData.houses"),
  }));
  if (new Set(houses.map((house) => house.house)).size !== HOUSE_NUMBERS.length) {
    throw new TypeError("Visual Profile houses must contain each house exactly once");
  }

  return houses.sort((a, b) => a.house - b.house);
};

const normalizeAspects = (horoscope: HoroscopeData): AspectVisualData[] =>
  horoscope.aspects.map((aspect) => ({
    bodyA: aspect.bodyA,
    bodyB: aspect.bodyB,
    type: aspect.type,
    strength: clampUnit(1 - aspect.orb / MAX_ASPECT_ORB),
  }));

export const calculateVisualProfile = (
  horoscope: HoroscopeData,
  analysis: HoroscopeAnalysis,
): VisualProfileData => {
  assertCountTotal(
    [analysis.polarity.masculine, analysis.polarity.feminine],
    "Polarity",
  );
  assertCountTotal(
    [
      analysis.modalities.cardinal,
      analysis.modalities.fixed,
      analysis.modalities.mutable,
    ],
    "Modality",
  );
  assertCountTotal(
    [
      analysis.elements.fire,
      analysis.elements.earth,
      analysis.elements.air,
      analysis.elements.water,
    ],
    "Element",
  );

  const mode: VisualProfileMode = horoscope.birth.timeKnown
    ? "full"
    : "partial";

  return {
    mode,
    direction: {
      outward: analysis.polarity.masculine / PLANET_COUNT,
      inward: analysis.polarity.feminine / PLANET_COUNT,
    },
    motion: {
      cardinal: analysis.modalities.cardinal / PLANET_COUNT,
      fixed: analysis.modalities.fixed / PLANET_COUNT,
      mutable: analysis.modalities.mutable / PLANET_COUNT,
    },
    palette: {
      fire: analysis.elements.fire / PLANET_COUNT,
      earth: analysis.elements.earth / PLANET_COUNT,
      air: analysis.elements.air / PLANET_COUNT,
      water: analysis.elements.water / PLANET_COUNT,
    },
    planets: normalizePlanets(horoscope, mode),
    houses: normalizeHouses(horoscope, mode),
    aspects: normalizeAspects(horoscope),
  };
};
