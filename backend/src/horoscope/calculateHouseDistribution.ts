import {
  HOUSE_NUMBERS,
  type HouseDistribution,
  type HouseNumber,
} from "./analysisTypes.js";
import { PLANET_IDS, type PlanetData } from "./types.js";

export const calculateHouseDistribution = (
  planets: PlanetData[],
): HouseDistribution | null => {
  if (planets.length !== PLANET_IDS.length) {
    throw new TypeError(
      `House distribution requires ${PLANET_IDS.length} planets; received ${planets.length}`,
    );
  }

  let hasUnknownHouse = false;
  const counts = new Map<HouseNumber, number>(
    HOUSE_NUMBERS.map((house) => [house, 0]),
  );

  for (const planet of planets) {
    if (planet.house === null) {
      hasUnknownHouse = true;
      continue;
    }
    if (
      !Number.isInteger(planet.house) ||
      planet.house < 1 ||
      planet.house > 12
    ) {
      throw new RangeError(
        `Planet ${planet.id} has an invalid house: ${planet.house}`,
      );
    }

    const house = planet.house as HouseNumber;
    counts.set(house, (counts.get(house) ?? 0) + 1);
  }

  if (hasUnknownHouse) return null;

  const distribution: HouseDistribution = HOUSE_NUMBERS.map((house) => ({
    house,
    count: counts.get(house) ?? 0,
  }));
  const total = distribution.reduce((sum, entry) => sum + entry.count, 0);

  if (total !== PLANET_IDS.length) {
    throw new Error("House distribution total does not match the ten major planets");
  }

  return distribution;
};
