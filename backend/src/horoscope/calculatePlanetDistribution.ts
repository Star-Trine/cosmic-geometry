import type { PlanetDistribution } from "./analysisTypes.js";
import {
  PLANET_IDS,
  ZODIAC_SIGN_IDS,
  type PlanetData,
  type ZodiacSignId,
} from "./types.js";

const SIGN_ID_SET = new Set<string>(ZODIAC_SIGN_IDS);

export const calculatePlanetDistribution = (
  planets: PlanetData[],
): PlanetDistribution => {
  if (planets.length !== PLANET_IDS.length) {
    throw new TypeError(
      `Planet distribution requires ${PLANET_IDS.length} planets; received ${planets.length}`,
    );
  }

  const counts = new Map<ZodiacSignId, number>(
    ZODIAC_SIGN_IDS.map((sign) => [sign, 0]),
  );

  for (const planet of planets) {
    if (!SIGN_ID_SET.has(planet.sign)) {
      throw new TypeError(
        `Planet ${planet.id} has an unsupported sign: ${planet.sign}`,
      );
    }

    counts.set(planet.sign, (counts.get(planet.sign) ?? 0) + 1);
  }

  const distribution: PlanetDistribution = ZODIAC_SIGN_IDS.map((sign) => ({
    sign,
    count: counts.get(sign) ?? 0,
  }));
  const total = distribution.reduce((sum, entry) => sum + entry.count, 0);

  if (total !== PLANET_IDS.length) {
    throw new Error("Planet distribution total does not match the ten major planets");
  }

  return distribution;
};
